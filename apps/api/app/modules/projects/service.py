from uuid import UUID
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.projects.models import DevelopmentProject
from app.modules.projects.schemas import DevelopmentProjectCreate, DevelopmentProjectUpdate
from app.shared.enums import ProjectStatus


async def list_projects(
    db: AsyncSession,
    status_filter: ProjectStatus | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(DevelopmentProject.status == status_filter)
    if q:
        conditions.append(
            or_(
                DevelopmentProject.project_name.ilike(f"%{q}%"),
                DevelopmentProject.description.ilike(f"%{q}%"),
                DevelopmentProject.location.ilike(f"%{q}%"),
            )
        )

    total = await db.scalar(select(func.count()).select_from(DevelopmentProject).where(*conditions)) or 0
    query = (
        select(DevelopmentProject)
        .where(*conditions)
        .order_by(DevelopmentProject.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_project_by_id(db: AsyncSession, project_id: UUID) -> DevelopmentProject | None:
    return await db.get(DevelopmentProject, project_id)


async def create_project(
    db: AsyncSession,
    payload: DevelopmentProjectCreate,
    author_id: UUID,
) -> DevelopmentProject:
    data = payload.model_dump(exclude_unset=True)
    item = DevelopmentProject(**data, created_by_id=author_id)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_project(
    db: AsyncSession,
    item: DevelopmentProject,
    payload: DevelopmentProjectUpdate,
) -> DevelopmentProject:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_project(db: AsyncSession, item: DevelopmentProject) -> None:
    await db.delete(item)
    await db.commit()
