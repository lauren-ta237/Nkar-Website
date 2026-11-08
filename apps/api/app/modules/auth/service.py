from datetime import datetime, timedelta, timezone
from uuid import UUID

import bcrypt
from jose import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.modules.users.models import User
from app.shared.enums import UserRole, UserStatus


def hash_password(password: str) -> str:
    # Encode password to bytes and hash directly using bcrypt (truncates safely to 72 bytes)
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    pwd_bytes = password.encode("utf-8")[:72]
    return bcrypt.checkpw(pwd_bytes, password_hash.encode("utf-8"))


def _token(subject: UUID, role: UserRole, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": str(subject), "role": role.value, "type": token_type, "iat": now, "exp": now + expires_delta},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_tokens(user: User) -> tuple[str, str, int]:
    access_seconds = settings.access_token_expire_minutes * 60
    return (
        _token(user.id, user.role, "access", timedelta(seconds=access_seconds)),
        _token(user.id, user.role, "refresh", timedelta(days=settings.refresh_token_expire_days)),
        access_seconds,
    )


async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    user = await db.scalar(select(User).where(User.email == email.lower()))
    if not user or user.status != UserStatus.ACTIVE or not verify_password(password, user.password_hash):
        return None
    return user


async def register(db: AsyncSession, *, name: str, email: str, password: str) -> User:
    user = User(
        name=name, 
        email=email.lower(), 
        password_hash=hash_password(password), 
        role=UserRole.CONTENT_EDITOR, 
        status=UserStatus.ACTIVE
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user