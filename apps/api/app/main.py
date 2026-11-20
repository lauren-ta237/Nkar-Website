from contextlib import asynccontextmanager
from urllib.parse import urlsplit

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.database.session import close_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await close_database()


fastapi_app = FastAPI(
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

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fastapi_app.include_router(api_router, prefix="/api/v1")


@fastapi_app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "nkar-woo-lan-api"}


class VercelPathFixMiddleware:
    def __init__(self, inner_app):
        self.inner_app = inner_app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            for header_name in (
                b"x-vercel-original-url",
                b"x-invoke-path",
                b"x-forwarded-uri",
                b"x-matched-path",
                b"x-now-route-matches",
            ):
                raw_val = headers.get(header_name)
                if raw_val:
                    decoded = raw_val.decode("latin-1")
                    if decoded.startswith("/"):
                        parsed = urlsplit(decoded)
                        if parsed.path and parsed.path not in {"/api/index", "/api/index.py", "/app/main.py"}:
                            scope["path"] = parsed.path
                            scope["raw_path"] = parsed.path.encode("latin-1")
                            if parsed.query:
                                scope["query_string"] = parsed.query.encode("latin-1")
                            break
        await self.inner_app(scope, receive, send)


app = VercelPathFixMiddleware(fastapi_app)