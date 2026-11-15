from uuid import UUID
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.gallery.models import Gallery
from app.modules.gallery.schemas import GalleryCreate, GalleryUpdate
from app.shared.enums import ContentStatus, MediaType


async def list_published_gallery(
    db: AsyncSession,
    album: str | None = None,
    media_type: MediaType | None = None,
    skip: int = 0,
    limit: int = 24,
):
    conditions = [Gallery.status == ContentStatus.PUBLISHED]
    if album:
        conditions.append(Gallery.album_category == album)
    if media_type:
        conditions.append(Gallery.media_type == media_type)

    total = await db.scalar(select(func.count()).select_from(Gallery).where(*conditions)) or 0
    query = (
        select(Gallery)
        .where(*conditions)
        .order_by(Gallery.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def list_all_gallery(
    db: AsyncSession,
    status_filter: ContentStatus | None = None,
    album: str | None = None,
    skip: int = 0,
    limit: int = 24,
):
    conditions = []
    if status_filter:
        conditions.append(Gallery.status == status_filter)
    if album:
        conditions.append(Gallery.album_category == album)

    total = await db.scalar(select(func.count()).select_from(Gallery).where(*conditions)) or 0
    query = (
        select(Gallery)
        .where(*conditions)
        .order_by(Gallery.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_gallery_by_id(db: AsyncSession, item_id: UUID) -> Gallery | None:
    return await db.get(Gallery, item_id)


async def create_gallery(db: AsyncSession, payload: GalleryCreate, author_id: UUID) -> Gallery:
    data = payload.model_dump(exclude_unset=True)
    item = Gallery(**data, created_by_id=author_id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_gallery(db: AsyncSession, item: Gallery, payload: GalleryUpdate) -> Gallery:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_gallery(db: AsyncSession, item: Gallery) -> None:
    await db.delete(item)
    await db.commit()
