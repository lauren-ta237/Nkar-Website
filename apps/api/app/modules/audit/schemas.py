from datetime import datetime
from typing import Any
from uuid import UUID

from app.modules.base import ModuleModel
from app.shared.enums import AuditSeverity


class AuditLogResponse(ModuleModel):
    id: UUID
    actor_id: UUID | None = None
    action: str
    resource_type: str
    resource_id: UUID
    severity: AuditSeverity
    details: str | None = None
    changes: dict[str, Any] | None = None
    metadata_json: dict[str, Any] | None = None
    created_at: datetime
