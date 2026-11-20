from datetime import datetime, timezone
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.news.models import News
from app.modules.news.schemas import NewsCreate, NewsUpdate
from app.shared.enums import ContentStatus, NewsCategory


async def list_published_news(
    db: AsyncSession,
    q: str | None = None,
    category: NewsCategory | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = [News.status == ContentStatus.PUBLISHED]
    if category:
        conditions.append(News.category == category)
    if q:
        conditions.append(or_(News.title.ilike(f"%{q}%"), News.summary.ilike(f"%{q}%"), News.content.ilike(f"%{q}%")))

    total = await db.scalar(select(func.count()).select_from(News).where(*conditions)) or 0
    query = (
        select(News)
        .where(*conditions)
        .order_by(News.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_news(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    category: NewsCategory | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(News.status == status_filter)
    if category:
        conditions.append(News.category == category)

    total = await db.scalar(select(func.count()).select_from(News).where(*conditions)) or 0
    query = (
        select(News)
        .where(*conditions)
        .order_by(News.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_news_by_id(db: AsyncSession, news_id: UUID) -> News | None:
    return await db.get(News, news_id)


async def get_news_by_identifier(db: AsyncSession, identifier: str) -> News | None:
    try:
        val_uuid = UUID(identifier)
        return await db.get(News, val_uuid)
    except ValueError:
        pass
    stmt = select(News).where(News.slug == identifier)
    return await db.scalar(stmt)


async def create_news(db: AsyncSession, payload: NewsCreate, author_id: UUID) -> News:
    data = payload.model_dump(exclude_unset=True)
    if data.get("status") == ContentStatus.PUBLISHED:
        data["published_at"] = datetime.now(timezone.utc)

    news_item = News(
        **data,
        author_id=author_id,
        created_by_id=author_id,
    )
    db.add(news_item)
    try:
        await db.commit()
        await db.refresh(news_item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "News article with this slug already exists"},
        ) from exc
    return news_item


async def update_news(db: AsyncSession, news_item: News, payload: NewsUpdate) -> News:
    data = payload.model_dump(exclude_unset=True)
    if data.get("status") == ContentStatus.PUBLISHED and not news_item.published_at:
        news_item.published_at = datetime.now(timezone.utc)

    for field, val in data.items():
        setattr(news_item, field, val)

    try:
        await db.commit()
        await db.refresh(news_item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "News article with this slug already exists"},
        ) from exc
    return news_item


async def increment_news_views(db: AsyncSession, news_item: News) -> None:
    news_item.views += 1
    await db.commit()
    await db.refresh(news_item)


async def delete_news(db: AsyncSession, news_item: News) -> None:
    await db.delete(news_item)
    await db.commit()
