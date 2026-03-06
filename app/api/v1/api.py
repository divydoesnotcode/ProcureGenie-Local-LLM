# app/api/v1/api.py  — replace your existing api.py with this
from fastapi import APIRouter
from app.api.v1.endpoints import vendors, chat_endpoint 

api_router = APIRouter()
api_router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
api_router.include_router(chat_endpoint.router, prefix="/chat", tags=["chat_endpoint"])