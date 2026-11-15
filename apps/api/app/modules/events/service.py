from datetime import date
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.events.models import Event
from app.modules.events.schemas import EventCreate, EventUpdate
from app.shared.enums import ContentStatus


async def list_published_events(
    db: AsyncSession,
    q: str | None = None,
    upcoming_only: bool = False,
    skip: int = 0,
    limit: int = 20,
):
    conditions = [Event.status == ContentStatus.PUBLISHED]
    if upcoming_only:
        conditions.append(Event.event_date >= date.today())
    if q:
        conditions.append(or_(Event.title.ilike(f"%{q}%"), Event.description.ilike(f"%{q}%"), Event.location.ilike(f"%{q}%")))

    total = await db.scalar(select(func.count()).select_from(Event).where(*conditions)) or 0
    query = (
        select(Event)
        .where(*conditions)
        .order_by(Event.event_date.asc() if upcoming_only else Event.event_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_events(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(Event.status == status_filter)

    total = await db.scalar(select(func.count()).select_from(Event).where(*conditions)) or 0
    query = (
        select(Event)
        .where(*conditions)
        .order_by(Event.event_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_event_by_id(db: AsyncSession, event_id: UUID) -> Event | None:
    return await db.get(Event, event_id)


async def create_event(db: AsyncSession, payload: EventCreate, author_id: UUID) -> Event:
    data = payload.model_dump(exclude_unset=True)
    event_item = Event(**data, created_by_id=author_id)
    db.add(event_item)
    try:
        await db.commit()
        await db.refresh(event_item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "Event with this slug already exists"},
        ) from exc
    return event_item


async def update_event(db: AsyncSession, event_item: Event, payload: EventUpdate) -> Event:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(event_item, field, val)

    try:
        await db.commit()
        await db.refresh(event_item)
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "SLUG_IN_USE", "message": "Event with this slug already exists"},
        ) from exc
    return event_item


async def delete_event(db: AsyncSession, event_item: Event) -> None:
    await db.delete(event_item)
    await db.commit()
