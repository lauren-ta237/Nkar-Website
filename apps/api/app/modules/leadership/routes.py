from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.leadership.schemas import LeadershipCreate, LeadershipResponse, LeadershipUpdate
from app.modules.leadership.service import (
    create_leader,
    delete_leader,
    get_leader_by_id,
    list_all_leadership,
    list_published_leadership,
    update_leader,
)
from app.shared.enums import AuditSeverity, ContentStatus, UserRole
from app.shared.pagination import PageMeta, PageParams
from app.shared.responses import Envelope

router = APIRouter(prefix="/leadership", tags=["leadership"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[LeadershipResponse]])
async def get_published_leaders(
    q: str | None = Query(None, max_length=100, description="Search keyword"),
    page_params: PageParams = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_leadership(db, q=q, skip=page_params.offset, limit=page_params.limit)
    meta = PageMeta.create(page=page_params.page, page_size=page_params.page_size, total_items=total)
    return {"success": True, "data": rows, "meta": meta.model_dump()}


@router.get("/{leader_id}", response_model=Envelope[LeadershipResponse])
async def get_leader_detail(
    leader_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_leader_by_id(db, leader_id)
    if not item or item.status != ContentStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Leader profile not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[LeadershipResponse]])
async def admin_get_all_leaders(
    status_filter: ContentStatus | None = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_leadership(db, status_filter=status_filter, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[LeadershipResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_leader(
    payload: LeadershipCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    item = await create_leader(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_LEADERSHIP",
        resource_type="leadership",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Created leadership entry: {item.name}",
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{leader_id}", response_model=Envelope[LeadershipResponse])
@router.put("/admin/items/{leader_id}", response_model=Envelope[LeadershipResponse])
async def admin_update_leader(
    leader_id: UUID,
    payload: LeadershipUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_leader_by_id(db, leader_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Leader profile not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    updated_item = await update_leader(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_LEADERSHIP",
        resource_type="leadership",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated leadership entry: {item.name}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{leader_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_leader(
    leader_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete leadership records"},
        )
    item = await get_leader_by_id(db, leader_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Leader profile not found"},
        )

    await record_audit(
        db,
        action="DELETE_LEADERSHIP",
        resource_type="leadership",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted leadership entry: {item.name}",
    )
    await delete_leader(db, item)
