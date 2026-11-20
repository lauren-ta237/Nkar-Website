from contextlib import asynccontextmanager
from urllib.parse import urlsplit

from fastapi import FastAPI, Request
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
        "publications, projects, contacts, users, and audit history. "
        "Public read endpoints live under /api/v1/{entity}; protected admin CRUD "
        "endpoints live under /api/v1/admin/{entity}/items."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "auth", "description": "Authentication and token lifecycle."},
        {"name": "public", "description": "Public read and contact submission endpoints."},
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


@app.middleware("http")
async def restore_vercel_path(request: Request, call_next):
    # Registered after CORSMiddleware so it runs first and restores the original path
    if request.scope.get("path") in {"/api/index", "/api/index.py", "/app/main.py"}:
        original = (
            request.headers.get("x-vercel-original-url")
            or request.headers.get("x-invoke-path")
            or request.headers.get("x-forwarded-uri")
            or request.headers.get("x-matched-path")
        )
        if original:
            parsed = urlsplit(original)
            restored_path = parsed.path or "/"
            request.scope["path"] = restored_path
            request.scope["raw_path"] = restored_path.encode("latin-1")
            if parsed.query:
                request.scope["query_string"] = parsed.query.encode("latin-1")
    return await call_next(request)


app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "nkar-woo-lan-api"}