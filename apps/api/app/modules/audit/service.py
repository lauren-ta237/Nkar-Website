from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.audit.models import AuditLog


async def record_audit(db: AsyncSession, action: str, entity_type: str, entity_id: UUID, performed_by_id: UUID | None = None, details: dict | None = None) -> AuditLog:
    entry = AuditLog(action=action, entity_type=entity_type, entity_id=entity_id, performed_by_id=performed_by_id, details=details)
    db.add(entry)
    await db.flush()
    return entry
