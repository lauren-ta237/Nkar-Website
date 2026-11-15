from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.projects.schemas import (
    DevelopmentProjectCreate,
    DevelopmentProjectResponse,
    DevelopmentProjectUpdate,
)
from app.modules.projects.service import (
    create_project,
    delete_project,
    get_project_by_id,
    list_projects,
    update_project,
)
from app.shared.enums import AuditSeverity, ProjectStatus, UserRole
from app.shared.pagination import PageMeta, PageParams
from app.shared.responses import Envelope

router = APIRouter(prefix="/projects", tags=["projects"])


# ---- Public Endpoints ----

@router.get("", response_model=Envelope[list[DevelopmentProjectResponse]])
async def get_public_projects(
    status_filter: ProjectStatus | None = Query(None, alias="status", description="Filter by status (proposed, ongoing, completed)"),
    q: str | None = Query(None, max_length=100, description="Search keyword"),
    page_params: PageParams = Depends(),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_projects(
        db,
        status_filter=status_filter,
        q=q,
        skip=page_params.offset,
        limit=page_params.limit,
    )
    meta = PageMeta.create(page=page_params.page, page_size=page_params.page_size, total_items=total)
    return {"success": True, "data": rows, "meta": meta.model_dump()}


@router.get("/{project_id}", response_model=Envelope[DevelopmentProjectResponse])
async def get_project_detail(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    item = await get_project_by_id(db, project_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Project not found"},
        )
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[DevelopmentProjectResponse]])
async def admin_get_all_projects(
    status_filter: ProjectStatus | None = Query(None, alias="status"),
    q: str | None = Query(None, max_length=100),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_projects(db, status_filter=status_filter, q=q, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.post("/admin/items", response_model=Envelope[DevelopmentProjectResponse], status_code=status.HTTP_201_CREATED)
async def admin_create_project(
    payload: DevelopmentProjectCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await create_project(db, payload, author_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_PROJECT",
        resource_type="projects",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Created development project: {item.title}",
    )
    await db.commit()
    return {"success": True, "data": item}


@router.patch("/admin/items/{project_id}", response_model=Envelope[DevelopmentProjectResponse])
@router.put("/admin/items/{project_id}", response_model=Envelope[DevelopmentProjectResponse])
async def admin_update_project(
    project_id: UUID,
    payload: DevelopmentProjectUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_project_by_id(db, project_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Project not found"},
        )

    updated_item = await update_project(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_PROJECT",
        resource_type="projects",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated development project: {item.title}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_project(
    project_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete project records"},
        )
    item = await get_project_by_id(db, project_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Project not found"},
        )

    await record_audit(
        db,
        action="DELETE_PROJECT",
        resource_type="projects",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted project: {item.title}",
    )
    await delete_project(db, item)
