from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.database.session import close_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await close_database()


app = FastAPI(
    title="Nkar Woo Lan API",
    summary="Digital community heritage and administration API",
    description=(
        "REST API for Nkar Clan news, events, heritage, leadership, gallery, "
        "publications, projects, contacts, contributions, users, and audit history. "
        "Public read endpoints live under /api/v1/{entity}; protected admin CRUD "
        "endpoints live under /api/v1/admin/{entity}/items."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "auth", "description": "Authentication and token lifecycle."},
        {"name": "public", "description": "Public read and submission endpoints."},
        {"name": "admin", "description": "Role-protected administration endpoints."},
        {"name": "system", "description": "Service health and operational endpoints."},
    ],
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "nkar-woo-lan-api"}
