from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.schemas import AuditLogResponse
from app.modules.audit.service import list_audit_logs
from app.shared.enums import AuditSeverity, UserRole
from app.shared.responses import Envelope

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("", response_model=Envelope[list[AuditLogResponse]])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    resource_type: str | None = Query(None, max_length=100),
    severity: AuditSeverity | None = Query(None),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can view audit logs"},
        )

    rows, total = await list_audit_logs(db, skip=skip, limit=limit, resource_type=resource_type, severity=severity)
    return {
        "success": True,
        "data": rows,
        "meta": {"total": total, "skip": skip, "limit": limit},
    }
