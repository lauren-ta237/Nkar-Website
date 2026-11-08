from fastapi import APIRouter

from app.api.v1.endpoints.entities import router as entities_router
from app.modules.auth.routes import router as auth_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(entities_router)
