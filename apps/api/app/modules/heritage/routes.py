from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.heritage.schemas import HeritageCreate, HeritageResponse, HeritageUpdate
from app.modules.heritage.service import (
    create_heritage,
    delete_heritage,
    get_heritage_by_id,
    list_all_heritage,
    list_published_heritage,
    update_heritage,
)
from app.shared.enums import AuditSeverity, ContentStatus, HeritageCategory, UserRole
from app.shared.pagination import PageMeta, PageParams
from app.shared.responses import Envelope

router = APIRouter(prefix="/heritage", tags=["heritage"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[HeritageResponse]])
async def get_published_heritage(
    q: str | None = Query(None, max_length=100, description="Search keyword"),
    category: HeritageCategory | None = Query(None, description="Filter by category"),
    page_params: PageParams = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_heritage(
        db,
        category=category,
        q=q,
        skip=page_params.offset,
        limit=page_params.limit,
    )
    meta = PageMeta.create(page=page_params.page, page_size=page_params.page_size, total_items=total)
    return {"success": True, "data": rows, "meta": meta.model_dump()}


@router.get("/{item_id}", response_model=Envelope[HeritageResponse])
async def get_heritage_detail(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_heritage_by_id(db, item_id)
    if not item or item.status != ContentStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Heritage record not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[HeritageResponse]])
async def admin_get_all_heritage(
    status_filter: ContentStatus | None = Query(None, alias="status"),
    category: HeritageCategory | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_heritage(db, status_filter=status_filter, category=category, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[HeritageResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_heritage(
    payload: HeritageCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    item = await create_heritage(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_HERITAGE",
        resource_type="heritage",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Created heritage item: {item.title}",
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{item_id}", response_model=Envelope[HeritageResponse])
@router.put("/admin/items/{item_id}", response_model=Envelope[HeritageResponse])
async def admin_update_heritage(
    item_id: UUID,
    payload: HeritageUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_heritage_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Heritage record not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR:
        if item.created_by_id and item.created_by_id != actor["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Content Editors can only edit their own heritage items"},
            )
        if payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
            payload.status = ContentStatus.SUBMITTED

    updated_item = await update_heritage(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_HERITAGE",
        resource_type="heritage",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated heritage item: {item.title}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_heritage(
    item_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete heritage records"},
        )
    item = await get_heritage_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Heritage record not found"},
        )

    await record_audit(
        db,
        action="DELETE_HERITAGE",
        resource_type="heritage",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted heritage item: {item.title}",
    )
    await delete_heritage(db, item)
