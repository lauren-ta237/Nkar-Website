from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import TypeAdapter, ValidationError
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.base import Base
from app.database.session import get_db
from app.modules.entity_exports import ENTITY_MODELS
from app.modules.contacts.schemas import ContactSubmissionCreate
from app.modules.contributions.schemas import ContributionCreate
from app.modules.events.schemas import EventCreate
from app.modules.gallery.schemas import GalleryCreate
from app.modules.heritage.schemas import HeritageCreate
from app.modules.leadership.schemas import LeadershipCreate
from app.modules.news.schemas import NewsCreate
from app.modules.projects.schemas import DevelopmentProjectCreate
from app.modules.publications.schemas import PublicationCreate
from app.shared.responses import Envelope

router = APIRouter(tags=["public", "admin"])
PUBLIC_ENTITIES = {"news", "events", "heritage", "leadership", "gallery", "publications", "projects"}
SORT_FIELDS = {"created_date", "updated_date", "title", "name", "event_date", "order_index"}
CREATE_SCHEMAS = {
    "news": NewsCreate, "events": EventCreate, "heritage": HeritageCreate,
    "leadership": LeadershipCreate, "gallery": GalleryCreate, "publications": PublicationCreate,
    "projects": DevelopmentProjectCreate, "contacts": ContactSubmissionCreate,
    "contributions": ContributionCreate,
}


def model_for(entity: str) -> type[Base]:
    model = ENTITY_MODELS.get(entity)
    if model is None:
        raise HTTPException(status_code=404, detail={"code": "UNKNOWN_ENTITY", "message": "Entity is not supported"})
    return model


def serialize(row: Any) -> dict[str, Any]:
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}


def validate_payload(entity: str, payload: dict[str, Any]) -> dict[str, Any]:
    schema = CREATE_SCHEMAS.get(entity)
    if schema is None:
        raise HTTPException(status_code=405, detail={"code": "CREATE_NOT_SUPPORTED", "message": "Creation is not supported for this resource"})
    try:
        values = TypeAdapter(schema).validate_python(payload).model_dump(mode="python", exclude_none=True)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail={"code": "VALIDATION_ERROR", "message": "Request validation failed", "fields": exc.errors()}) from exc
    return values


@router.get("/{entity}", response_model=Envelope[list[dict[str, Any]]])
async def public_list(entity: str, q: str | None = Query(None, max_length=100), skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), sort_by: str = Query("created_date", pattern=r"^[a-z_]+$"), db: AsyncSession = Depends(get_db)):
    model = model_for(entity)
    if entity not in PUBLIC_ENTITIES:
        raise HTTPException(status_code=404, detail={"code": "PUBLIC_RESOURCE_NOT_FOUND", "message": "Resource not found"})
    if sort_by not in SORT_FIELDS or not hasattr(model, sort_by):
        raise HTTPException(status_code=422, detail={"code": "INVALID_SORT", "message": "Unsupported sort field"})
    conditions = [model.status == "published"] if hasattr(model, "status") else []
    if q:
        searchable = [getattr(model, field) for field in ("title", "name", "project_name") if hasattr(model, field)]
        if searchable:
            conditions.append(or_(*(field.ilike(f"%{q}%") for field in searchable)))
    total = await db.scalar(select(func.count()).select_from(model).where(*conditions))
    rows = (await db.scalars(select(model).where(*conditions).order_by(getattr(model, sort_by).desc()).offset(skip).limit(limit))).all()
    return {"success": True, "data": [serialize(row) for row in rows], "meta": {"total": total or 0, "skip": skip, "limit": limit}}


@router.get("/{entity}/{item_id}", response_model=Envelope[dict[str, Any]])
async def public_get(entity: str, item_id: UUID, db: AsyncSession = Depends(get_db)):
    if entity not in PUBLIC_ENTITIES:
        raise HTTPException(status_code=404, detail={"code": "PUBLIC_RESOURCE_NOT_FOUND", "message": "Resource not found"})
    row = await db.get(model_for(entity), item_id)
    if row is None or (hasattr(row, "status") and str(row.status.value) != "published"):
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Resource not found"})
    return {"success": True, "data": serialize(row)}


@router.post("/{entity}", status_code=201, response_model=Envelope[dict[str, Any]])
async def public_create(entity: str, payload: dict[str, Any], db: AsyncSession = Depends(get_db)):
    if entity not in {"contacts", "contributions"}:
        raise HTTPException(status_code=405, detail={"code": "PUBLIC_WRITE_NOT_ALLOWED", "message": "This resource is read-only publicly"})
    values = validate_payload(entity, payload)
    model = model_for(entity)
    allowed = {column.name for column in model.__table__.columns if column.name not in {"id", "created_date", "updated_date"}}
    row = model(**{key: value for key, value in values.items() if key in allowed})
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return {"success": True, "data": serialize(row)}


@router.get("/admin/{entity}/items", response_model=Envelope[list[dict[str, Any]]], dependencies=[Depends(require_admin)])
async def admin_list(entity: str, skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100), db: AsyncSession = Depends(get_db)):
    model = model_for(entity)
    rows = (await db.scalars(select(model).order_by(model.created_date.desc()).offset(skip).limit(limit))).all()
    return {"success": True, "data": [serialize(row) for row in rows], "meta": {"skip": skip, "limit": limit}}


@router.post("/admin/{entity}/items", status_code=status.HTTP_201_CREATED, response_model=Envelope[dict[str, Any]], dependencies=[Depends(require_admin)])
async def admin_create(entity: str, payload: dict[str, Any], db: AsyncSession = Depends(get_db)):
    values = validate_payload(entity, payload)
    model = model_for(entity)
    allowed = {column.name for column in model.__table__.columns if column.name not in {"id", "created_date", "updated_date"}}
    row = model(**{key: value for key, value in values.items() if key in allowed})
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return {"success": True, "data": serialize(row)}


@router.patch("/admin/{entity}/items/{item_id}", response_model=Envelope[dict[str, Any]], dependencies=[Depends(require_admin)])
@router.put("/admin/{entity}/items/{item_id}", response_model=Envelope[dict[str, Any]], dependencies=[Depends(require_admin)])
async def admin_update(entity: str, item_id: UUID, payload: dict[str, Any], db: AsyncSession = Depends(get_db)):
    row = await db.get(model_for(entity), item_id)
    if row is None:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Resource not found"})
    protected = {"id", "created_date", "updated_date", "created_by_id"}
    for key, value in payload.items():
        if key in row.__table__.columns and key not in protected:
            setattr(row, key, value)
    await db.commit()
    await db.refresh(row)
    return {"success": True, "data": serialize(row)}


@router.delete("/admin/{entity}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
async def admin_delete(entity: str, item_id: UUID, db: AsyncSession = Depends(get_db)):
    row = await db.get(model_for(entity), item_id)
    if row is None:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Resource not found"})
    await db.delete(row)
    await db.commit()
