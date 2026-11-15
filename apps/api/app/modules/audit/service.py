from typing import Any
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.audit.models import AuditLog
from app.shared.enums import AuditSeverity


async def record_audit(
    db: AsyncSession,
    action: str,
    resource_type: str,
    resource_id: UUID,
    actor_id: UUID | None = None,
    severity: AuditSeverity = AuditSeverity.INFO,
    details: str | None = None,
    changes: dict[str, Any] | None = None,
    metadata_json: dict[str, Any] | None = None,
) -> AuditLog:
    entry = AuditLog(
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        actor_id=actor_id,
        severity=severity,
        details=details,
        changes=changes,
        metadata_json=metadata_json,
    )
    db.add(entry)
    await db.flush()
    return entry


async def list_audit_logs(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    resource_type: str | None = None,
    severity: AuditSeverity | None = None,
):
    conditions = []
    if resource_type:
        conditions.append(AuditLog.resource_type == resource_type)
    if severity:
        conditions.append(AuditLog.severity == severity)

    total = await db.scalar(select(func.count()).select_from(AuditLog).where(*conditions)) or 0
    query = (
        select(AuditLog)
        .where(*conditions)
        .order_by(AuditLog.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total
