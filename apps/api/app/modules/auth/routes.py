from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import bearer
from app.core.config import settings
from app.database.session import get_db
from app.modules.auth.schemas import AuthUser, LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.modules.auth.service import authenticate, create_tokens, register

router = APIRouter(prefix="/auth", tags=["auth"])


def _response(user) -> TokenResponse:
    access_token, refresh_token, expires_in = create_tokens(user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        user=AuthUser(id=user.id, name=user.name, email=user.email, role=user.role.value),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    from sqlalchemy import select
    from app.modules.users.models import User

    if await db.scalar(select(User).where(User.email == payload.email.lower())):
        raise HTTPException(status_code=409, detail={"code": "EMAIL_IN_USE", "message": "Email is already registered"})
    return _response(await register(db, name=payload.name, email=payload.email, password=payload.password))


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = await authenticate(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail={"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"})
    return _response(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    try:
        claims = jwt.decode(payload.refresh_token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        if claims.get("type") != "refresh":
            raise ValueError("wrong token type")
        user_id = UUID(str(claims["sub"]))
    except (JWTError, KeyError, ValueError) as exc:
        raise HTTPException(status_code=401, detail={"code": "INVALID_REFRESH_TOKEN", "message": "Invalid refresh token"}) from exc

    from sqlalchemy import select
    from app.modules.users.models import User

    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(status_code=401, detail={"code": "USER_NOT_FOUND", "message": "Invalid refresh token"})
    return _response(user)


@router.get("/health")
async def auth_health() -> dict[str, bool]:
    return {"enabled": True}
