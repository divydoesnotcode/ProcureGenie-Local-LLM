import httpx
import json
from app.core.config import settings

async def generate_vendors_llm(item, location):
    prompt = f"""
Return vendor list in JSON format.

Schema:
{{
  "vendors": [
    {{
      "name": "",
      "address": "",
      "phone": "",
      "email": "",
      "website": ""
    }}
  ]
}}
 If the mobile number is not available, return an empty string. Do not create any data.
Item: {item}
Location: {location}

Return ONLY JSON.
"""

    payload = {
        "model": settings.MODEL_NAME,
        "prompt": prompt,
        "format": "json",
        "stream": False
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(settings.OLLAMA_URL, json=payload)
        response.raise_for_status()

    raw = response.json()
    llm_text = raw.get("response", "").strip()

    if not llm_text:
        raise Exception(
            f"Ollama returned an empty response. "
            f"Check that model '{settings.MODEL_NAME}' is pulled correctly. "
            f"Full Ollama response: {raw}"
        )

    return json.loads(llm_text)
