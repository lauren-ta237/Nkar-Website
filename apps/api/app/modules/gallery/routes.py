from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.gallery.schemas import GalleryCreate, GalleryResponse, GalleryUpdate
from app.modules.gallery.service import (
    create_gallery,
    delete_gallery,
    get_gallery_by_id,
    list_all_gallery,
    list_published_gallery,
    update_gallery,
)
from app.shared.enums import ContentStatus, MediaType, UserRole
from app.shared.responses import Envelope

router = APIRouter(prefix="/gallery", tags=["gallery"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[GalleryResponse]])
async def get_published_media(
    album: str | None = Query(None),
    media_type: MediaType | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_gallery(db, album=album, media_type=media_type, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.get("/{item_id}", response_model=Envelope[GalleryResponse])
async def get_media_detail(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_gallery_by_id(db, item_id)
    if not item or item.status != ContentStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Media item not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[GalleryResponse]])
async def admin_get_all_media(
    status_filter: ContentStatus | None = Query(None, alias="status"),
    album: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(24, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_gallery(db, status_filter=status_filter, album=album, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[GalleryResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_media(
    payload: GalleryCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    item = await create_gallery(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_GALLERY",
        entity_type="gallery",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"title": item.title, "album": item.album_category},
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{item_id}", response_model=Envelope[GalleryResponse])
@router.put("/admin/items/{item_id}", response_model=Envelope[GalleryResponse])
async def admin_update_media(
    item_id: UUID,
    payload: GalleryUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_gallery_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Media item not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    updated_item = await update_gallery(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_GALLERY",
        entity_type="gallery",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"updated_fields": list(payload.model_dump(exclude_unset=True).keys())},
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_media(
    item_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete gallery records"},
        )
    item = await get_gallery_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Media item not found"},
        )

    await record_audit(
        db,
        action="DELETE_GALLERY",
        entity_type="gallery",
        entity_id=item.id,
        performed_by_id=actor["user_id"],
        details={"title": item.title},
    )
    await delete_gallery(db, item)
