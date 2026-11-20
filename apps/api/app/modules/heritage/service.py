from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.heritage.models import Heritage
from app.modules.heritage.schemas import HeritageCreate, HeritageUpdate
from app.shared.enums import ContentStatus, HeritageCategory


async def list_published_heritage(
    db: AsyncSession,
    category: HeritageCategory | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = [Heritage.status == ContentStatus.PUBLISHED]
    if category:
        conditions.append(Heritage.category == category)
    if q:
        conditions.append(or_(Heritage.title.ilike(f"%{q}%"), Heritage.content.ilike(f"%{q}%")))

    total = await db.scalar(select(func.count()).select_from(Heritage).where(*conditions)) or 0
    query = (
        select(Heritage)
        .where(*conditions)
        .order_by(Heritage.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_heritage(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    category: HeritageCategory | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(Heritage.status == status_filter)
    if category:
        conditions.append(Heritage.category == category)

    total = await db.scalar(select(func.count()).select_from(Heritage).where(*conditions)) or 0
    query = (
        select(Heritage)
        .where(*conditions)
        .order_by(Heritage.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_heritage_by_id(db: AsyncSession, item_id: UUID) -> Heritage | None:
    return await db.get(Heritage, item_id)


async def get_heritage_by_identifier(db: AsyncSession, identifier: str) -> Heritage | None:
    try:
        val_uuid = UUID(identifier)
        return await db.get(Heritage, val_uuid)
    except ValueError:
        pass
    stmt = select(Heritage).where(Heritage.slug == identifier)
    return await db.scalar(stmt)


async def create_heritage(db: AsyncSession, payload: HeritageCreate, author_id: UUID) -> Heritage:
    data = payload.model_dump(exclude_unset=True)
    item = Heritage(
        **data,
        author_id=author_id,
        created_by_id=author_id,
    )
    db.add(item)
    try:
        await db.commit()
        await db.refresh(item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "Heritage record with this slug already exists"},
        ) from exc
    return item


async def update_heritage(db: AsyncSession, item: Heritage, payload: HeritageUpdate) -> Heritage:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    try:
        await db.commit()
        await db.refresh(item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "Heritage record with this slug already exists"},
        ) from exc
    return item


async def delete_heritage(db: AsyncSession, item: Heritage) -> None:
    await db.delete(item)
    await db.commit()
