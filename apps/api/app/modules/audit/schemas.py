from datetime import datetime
from uuid import UUID
from app.modules.base import ModuleModel

class AuditLogResponse(ModuleModel):
    id: UUID
    action: str
    entity_type: str
    entity_id: UUID
    performed_by_id: UUID | None = None
    details: dict | None = None
    timestamp: datetime
