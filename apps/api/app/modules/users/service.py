from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.modules.auth.service import hash_password
from app.modules.users.models import User
from app.modules.users.schemas import UserCreate, UserUpdate


async def list_users(db: AsyncSession, skip: int = 0, limit: int = 50):
    total = await db.scalar(select(func.count()).select_from(User)) or 0
    query = select(User).order_by(User.created_at.desc()).offset(skip).limit(limit)
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:
    return await db.get(User, user_id)


async def create_user(db: AsyncSession, payload: UserCreate, created_by_id: UUID | None = None) -> User:
    user_data = payload.model_dump(exclude_unset=True)
    password = user_data.pop("password")
    user = User(
        **user_data,
        password_hash=hash_password(password),
        created_by_id=created_by_id,
    )
    db.add(user)
    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "EMAIL_IN_USE", "message": "Email is already registered"},
        ) from exc
    return user


async def update_user(db: AsyncSession, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    if "password" in data:
        pwd = data.pop("password")
        if pwd:
            user.password_hash = hash_password(pwd)

    for field, val in data.items():
        setattr(user, field, val)

    try:
        await db.commit()
        await db.refresh(user)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "CONFLICT", "message": "Email is already in use by another account"},
        ) from exc
    return user


async def delete_user(db: AsyncSession, user: User) -> None:
    await db.delete(user)
    await db.commit()
