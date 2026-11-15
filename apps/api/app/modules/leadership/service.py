from uuid import UUID
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.leadership.models import Leadership
from app.modules.leadership.schemas import LeadershipCreate, LeadershipUpdate
from app.shared.enums import ContentStatus


async def list_published_leadership(
    db: AsyncSession,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
):
    conditions = [Leadership.status == ContentStatus.PUBLISHED]
    if q:
        conditions.append(or_(Leadership.name.ilike(f"%{q}%"), Leadership.title_role.ilike(f"%{q}%")))

    total = await db.scalar(select(func.count()).select_from(Leadership).where(*conditions)) or 0
    query = (
        select(Leadership)
        .where(*conditions)
        .order_by(Leadership.order_index.asc(), Leadership.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_leadership(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    skip: int = 0,
    limit: int = 50,
):
    conditions = []
    if status_filter:
        conditions.append(Leadership.status == status_filter)

    total = await db.scalar(select(func.count()).select_from(Leadership).where(*conditions)) or 0
    query = (
        select(Leadership)
        .where(*conditions)
        .order_by(Leadership.order_index.asc(), Leadership.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_leader_by_id(db: AsyncSession, leader_id: UUID) -> Leadership | None:
    return await db.get(Leadership, leader_id)


async def create_leader(db: AsyncSession, payload: LeadershipCreate, author_id: UUID) -> Leadership:
    data = payload.model_dump(exclude_unset=True)
    item = Leadership(**data, created_by_id=author_id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_leader(db: AsyncSession, item: Leadership, payload: LeadershipUpdate) -> Leadership:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_leader(db: AsyncSession, item: Leadership) -> None:
    await db.delete(item)
    await db.commit()
