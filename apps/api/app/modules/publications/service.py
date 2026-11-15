from uuid import UUID
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.publications.models import Publication
from app.modules.publications.schemas import PublicationCreate, PublicationUpdate
from app.shared.enums import ContentStatus


async def list_published_publications(
    db: AsyncSession,
    q: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = [Publication.status == ContentStatus.PUBLISHED]
    if q:
        conditions.append(or_(Publication.title.ilike(f"%{q}%"), Publication.author_name.ilike(f"%{q}%")))

    total = await db.scalar(select(func.count()).select_from(Publication).where(*conditions)) or 0
    query = (
        select(Publication)
        .where(*conditions)
        .order_by(Publication.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_publications(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(Publication.status == status_filter)

    total = await db.scalar(select(func.count()).select_from(Publication).where(*conditions)) or 0
    query = (
        select(Publication)
        .where(*conditions)
        .order_by(Publication.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_publication_by_id(db: AsyncSession, item_id: UUID) -> Publication | None:
    return await db.get(Publication, item_id)


async def create_publication(db: AsyncSession, payload: PublicationCreate, author_id: UUID) -> Publication:
    data = payload.model_dump(exclude_unset=True)
    item = Publication(
        **data,
        uploaded_by_id=author_id,
        created_by_id=author_id,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_publication(db: AsyncSession, item: Publication, payload: PublicationUpdate) -> Publication:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_publication(db: AsyncSession, item: Publication) -> None:
    await db.delete(item)
    await db.commit()
