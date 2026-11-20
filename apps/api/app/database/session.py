from collections.abc import AsyncGenerator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


def _prepare_async_database_config(raw_url: str) -> tuple[str, dict]:
    normalized = raw_url.strip()
    if normalized.startswith("postgresql://"):
        normalized = "postgresql+asyncpg://" + normalized[len("postgresql://") :]
    elif normalized.startswith("postgres://"):
        normalized = "postgresql+asyncpg://" + normalized[len("postgres://") :]

    parts = urlsplit(normalized)
    filtered_query = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key.lower() not in {"sslmode", "channel_binding"}
    ]
    cleaned_url = urlunsplit(
        (
            parts.scheme,
            parts.netloc,
            parts.path,
            urlencode(filtered_query),
            parts.fragment,
        )
    )

    connect_args: dict = {}
    if "neon.tech" in parts.netloc.lower() or "asyncpg" in parts.scheme:
        connect_args["ssl"] = "require"

    return cleaned_url, connect_args


_database_url, _connect_args = _prepare_async_database_config(settings.database_url)
engine = create_async_engine(
    _database_url,
    connect_args=_connect_args,
    pool_pre_ping=True,
)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def close_database() -> None:
    await engine.dispose()