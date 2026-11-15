from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.audit.models import AuditLog


async def record_audit(
    db: AsyncSession,
    action: str,
    entity_type: str,
    entity_id: UUID,
    performed_by_id: UUID | None = None,
    details: dict | None = None,
) -> AuditLog:
    entry = AuditLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        performed_by_id=performed_by_id,
        details=details,
    )
    db.add(entry)
    await db.flush()
    return entry


async def list_audit_logs(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    entity_type: str | None = None,
):
    conditions = []
    if entity_type:
        conditions.append(AuditLog.entity_type == entity_type)

    total = await db.scalar(select(func.count()).select_from(AuditLog).where(*conditions)) or 0
    query = (
        select(AuditLog)
        .where(*conditions)
        .order_by(AuditLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total
