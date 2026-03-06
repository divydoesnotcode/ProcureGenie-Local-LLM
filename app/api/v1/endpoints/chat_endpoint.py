"""
ADD THIS FILE: app/api/v1/endpoints/chat.py

Then in app/api/v1/api.py, add:
    from app.api.v1.endpoints import chat
    api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.db.database import get_db
from app.repositories.vendor_repo import VendorRepository
from app.services.ollama_service import generate_vendors_llm
import httpx
import json
from app.core.config import settings

router = APIRouter()


class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []  # [{"role": "user"|"assistant", "content": "..."}]


async def parse_intent_llm(message: str, history: list[dict]) -> dict:
    """
    Ask Ollama to extract item + location from a natural language message.
    Returns {"item": "...", "location": "...", "is_vendor_query": true/false}
    """
    history_text = ""
    for h in history[-6:]:  # last 3 turns
        history_text += f"{h['role'].upper()}: {h['content']}\n"

    prompt = f"""You are a procurement assistant. Analyze the user's message and extract vendor search intent.

Conversation so far:
{history_text}
USER: {message}

Respond ONLY with valid JSON:
{{
  "is_vendor_query": true or false,
  "item": "the product/item they want to find vendors for (empty string if not applicable)",
  "location": "the city or region (empty string if not mentioned, use 'India' as default)",
  "clarification_needed": "if the query is too vague, ask a clarifying question here (empty string if clear enough)"
}}

Examples:
- "find me laptop vendors in Delhi" → {{"is_vendor_query": true, "item": "laptop", "location": "Delhi", "clarification_needed": ""}}
- "hello" → {{"is_vendor_query": false, "item": "", "location": "", "clarification_needed": ""}}
- "I need suppliers" → {{"is_vendor_query": true, "item": "", "location": "India", "clarification_needed": "What product are you looking to source?"}}
"""

    payload = {
        "model": settings.MODEL_NAME,
        "prompt": prompt,
        "format": "json",
        "stream": False,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(settings.OLLAMA_URL, json=payload)
        resp.raise_for_status()

    raw = resp.json().get("response", "{}").strip()
    return json.loads(raw)


async def generate_chat_reply(message: str, history: list[dict], vendors: list, context: dict) -> str:
    """
    Ask Ollama to generate a friendly conversational reply given the vendors found.
    """
    vendors_text = ""
    if vendors:
        for v in vendors[:5]:  # summarize top 5
            vendors_text += f"- {v.vendor_name}, {v.address or 'address not available'}, {v.phone or 'no phone'}\n"
    else:
        vendors_text = "No vendors found."

    history_text = ""
    for h in history[-6:]:
        history_text += f"{h['role'].upper()}: {h['content']}\n"

    prompt = f"""You are ProcureGenie, a helpful procurement assistant. Be concise, friendly, and professional.

Conversation history:
{history_text}
USER: {message}

Vendor search results for "{context.get('item', '')}" in "{context.get('location', '')}":
{vendors_text}

Write a short, helpful response (2-4 sentences) summarizing what you found. 
If vendors were found, mention the count and highlight 1-2 of them briefly.
If no vendors were found, apologize and suggest trying a different search.
Do NOT list all vendors — the UI already shows them. Just give a natural conversational summary.
"""

    payload = {
        "model": settings.MODEL_NAME,
        "prompt": prompt,
        "stream": False,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(settings.OLLAMA_URL, json=payload)
        resp.raise_for_status()

    return resp.json().get("response", "I found some results for you!").strip()


@router.post("/")
async def chat(req: ChatMessage, db: AsyncSession = Depends(get_db)):
    """
    Main chat endpoint. Flow:
    1. Parse intent from user message
    2. If vendor query → search DB → generate from LLM if not found
    3. Generate a conversational reply
    4. Return reply + vendors
    """
    # Step 1: Parse intent
    try:
        intent = await parse_intent_llm(req.message, req.history)
    except Exception:
        intent = {"is_vendor_query": False, "item": "", "location": "India", "clarification_needed": ""}

    # Handle clarification needed
    if intent.get("clarification_needed"):
        return {
            "reply": intent["clarification_needed"],
            "vendors": [],
            "source": None,
        }

    # Handle non-vendor queries with a simple Ollama reply
    if not intent.get("is_vendor_query") or not intent.get("item"):
        try:
            payload = {
                "model": settings.MODEL_NAME,
                "prompt": f"You are ProcureGenie, a procurement assistant. Reply briefly and helpfully to: {req.message}",
                "stream": False,
            }
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(settings.OLLAMA_URL, json=payload)
                reply = resp.json().get("response", "How can I help you find vendors today?").strip()
        except Exception:
            reply = "Hi! I'm ProcureGenie. Ask me to find vendors for any product in any city!"

        return {"reply": reply, "vendors": [], "source": None}

    # Step 2: Search / generate vendors
    item = intent["item"].strip().lower()
    location = intent["location"].strip().lower() or "india"

    repo = VendorRepository(db)
    vendors = await repo.get_vendors(item, location)
    source = "database"

    if not vendors:
        source = "llm"
        try:
            llm_response = await generate_vendors_llm(item, location)
            vendors_data = llm_response.get("vendors", [])
            await repo.save_vendors(item, location, vendors_data)
            vendors = await repo.get_vendors(item, location)
        except Exception as e:
            return {
                "reply": f"I tried to find vendors for **{item}** in **{location}** but hit an error: {str(e)}. Please try again.",
                "vendors": [],
                "source": None,
            }

    # Step 3: Generate conversational reply
    try:
        reply = await generate_chat_reply(
            req.message,
            req.history,
            vendors,
            {"item": item, "location": location},
        )
    except Exception:
        count = len(vendors)
        reply = f"Found {count} vendor{'s' if count != 1 else ''} for {item} in {location}!"

    # Serialize vendors (SQLAlchemy objects → dicts)
    vendor_list = [
        {
            "id": v.id,
            "vendor_name": v.vendor_name,
            "item_name": v.item_name,
            "location": v.location,
            "address": v.address,
            "phone": v.phone,
            "email": v.email,
            "website": v.website,
        }
        for v in vendors
    ]

    return {
        "reply": reply,
        "vendors": vendor_list,
        "source": source,
    }