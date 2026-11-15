from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.news.schemas import NewsCreate, NewsResponse, NewsUpdate
from app.modules.news.service import (
    create_news,
    delete_news,
    get_news_by_id,
    increment_news_views,
    list_all_news,
    list_published_news,
    update_news,
)
from app.shared.enums import AuditSeverity, ContentStatus, NewsCategory, UserRole
from app.shared.pagination import PageMeta, PageParams
from app.shared.responses import Envelope

router = APIRouter(prefix="/news", tags=["news"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[NewsResponse]])
async def get_published_news(
    q: str | None = Query(None, max_length=100, description="Search keyword"),
    category: NewsCategory | None = Query(None, description="Filter by news category"),
    page_params: PageParams = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_published_news(
        db,
        q=q,
        category=category,
        skip=page_params.offset,
        limit=page_params.limit,
    )
    meta = PageMeta.create(page=page_params.page, page_size=page_params.page_size, total_items=total)
    return {"success": True, "data": rows, "meta": meta.model_dump()}


@router.get("/{news_id}", response_model=Envelope[NewsResponse])
async def get_news_detail(
    news_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_news_by_id(db, news_id)
    if not item or item.status != ContentStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "News article not found"},
        )
    await increment_news_views(db, item)
    return {"success": True, "data": item}


# ---- Protected Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[NewsResponse]])
async def admin_get_all_news(
    status_filter: ContentStatus | None = Query(None, alias="status"),
    category: NewsCategory | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_all_news(db, status_filter=status_filter, category=category, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[NewsResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_news(
    payload: NewsCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] == UserRole.CONTENT_EDITOR and payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
        payload.status = ContentStatus.SUBMITTED

    item = await create_news(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_NEWS",
        resource_type="news",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Created news article: {item.title}",
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{news_id}", response_model=Envelope[NewsResponse])
@router.put("/admin/items/{news_id}", response_model=Envelope[NewsResponse])
async def admin_update_news(
    news_id: UUID,
    payload: NewsUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_news_by_id(db, news_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "News article not found"},
        )

    if actor["role"] == UserRole.CONTENT_EDITOR:
        if item.created_by_id and item.created_by_id != actor["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "Content Editors can only edit their own articles"},
            )
        if payload.status in {ContentStatus.PUBLISHED, ContentStatus.APPROVED}:
            payload.status = ContentStatus.SUBMITTED

    updated_item = await update_news(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_NEWS",
        resource_type="news",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated news article: {item.title}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_news(
    news_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete news records"},
        )
    item = await get_news_by_id(db, news_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "News article not found"},
        )

    await record_audit(
        db,
        action="DELETE_NEWS",
        resource_type="news",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted news article: {item.title}",
    )
    await delete_news(db, item)
