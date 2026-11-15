from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.publications.schemas import PublicationCreate, PublicationResponse, PublicationUpdate
from app.modules.publications.service import (
    create_publication,
    delete_publication,
    get_publication_by_id,
    list_all_publications,
    list_published_publications,
    update_publication,
)
from app.shared.enums import ContentStatus, UserRole
from app.shared.responses import Envelope

router = APIRouter(prefix="/publications", tags=["publications"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[PublicationResponse]])
async def get_published_books(
    q: str | None = Query(None, max_length=100),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_publications(db, q=q, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.get("/{item_id}", response_model=Envelope[PublicationResponse])
async def get_publication_detail(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_publication_by_id(db, item_id)
    if not item or item.status != ContentStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Publication not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[PublicationResponse]])
async def admin_get_all_publications(
    status_filter: ContentStatus | None = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_publications(db, status_filter=status_filter, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[PublicationResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_publication(
    payload: PublicationCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    item = await create_publication(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_PUBLICATION",
        entity_type="publications",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"title": item.title, "author": item.author_name},
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{item_id}", response_model=Envelope[PublicationResponse])
@router.put("/admin/items/{item_id}", response_model=Envelope[PublicationResponse])
async def admin_update_publication(
    item_id: UUID,
    payload: PublicationUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_publication_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Publication not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    updated_item = await update_publication(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_PUBLICATION",
        entity_type="publications",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"updated_fields": list(payload.model_dump(exclude_unset=True).keys())},
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_publication(
    item_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete publication records"},
        )
    item = await get_publication_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Publication not found"},
        )

    await record_audit(
        db,
        action="DELETE_PUBLICATION",
        entity_type="publications",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"title": item.title},
    )
    await delete_publication(db, item)
