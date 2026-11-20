from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.events.schemas import EventCreate, EventResponse, EventUpdate
from app.modules.events.service import (
    create_event,
    delete_event,
    get_event_by_id,
    get_event_by_identifier,
    list_all_events,
    list_published_events,
    update_event,
)
from app.shared.enums import AuditSeverity, EventStatus, UserRole
from app.shared.pagination import PageMeta, PageParams
from app.shared.responses import Envelope

router = APIRouter(prefix="/events", tags=["events"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[EventResponse]])
async def get_published_events(
    q: str | None = Query(None, max_length=100, description="Search keyword"),
    upcoming: bool = Query(False, description="Filter for upcoming events only"),
    page_params: PageParams = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_events(
        db,
        q=q,
        upcoming_only=upcoming,
        skip=page_params.offset,
        limit=page_params.limit,
    )
    meta = PageMeta.create(page=page_params.page, page_size=page_params.page_size, total_items=total)
    return {"success": True, "data": rows, "meta": meta.model_dump()}


@router.get("/{identifier}", response_model=Envelope[EventResponse])
async def get_event_detail(
    identifier: str,
    db: AsyncSession = Depends(get_db),
):
    item = await get_event_by_identifier(db, identifier)
    if not item or item.status != EventStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[EventResponse]])
async def admin_get_all_events(
    status_filter: EventStatus | None = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_events(db, status_filter=status_filter, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[EventResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_event(
    payload: EventCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status == EventStatus.PUBLISHED:
        payload.status = EventStatus.SUBMITTED

    item = await create_event(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_EVENT",
        resource_type="events",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Created event: {item.title}",
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{event_id}", response_model=Envelope[EventResponse])
@router.put("/admin/items/{event_id}", response_model=Envelope[EventResponse])
async def admin_update_event(
    event_id: UUID,
    payload: EventUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_event_by_id(db, event_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR:
        if item.created_by_id and item.created_by_id != actor["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Content Editors can only edit their own events"},
            )
        if payload.status == EventStatus.PUBLISHED:
            payload.status = EventStatus.SUBMITTED

    updated_item = await update_event(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_EVENT",
        resource_type="events",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated event: {item.title}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_event(
    event_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete events"},
        )
    item = await get_event_by_id(db, event_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found"},
        )

    await record_audit(
        db,
        action="DELETE_EVENT",
        resource_type="events",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted event: {item.title}",
    )
    await delete_event(db, item)
