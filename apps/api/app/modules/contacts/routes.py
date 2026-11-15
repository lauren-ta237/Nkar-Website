from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.contacts.schemas import (
    ContactSubmissionCreate,
    ContactSubmissionResponse,
    ContactSubmissionUpdate,
)
from app.modules.contacts.service import (
    create_contact_submission,
    delete_contact_submission,
    get_contact_by_id,
    list_contact_submissions,
    update_contact_submission,
)
from app.shared.enums import AuditSeverity, ContactStatus, UserRole
from app.shared.responses import Envelope

router = APIRouter(prefix="/contacts", tags=["contacts"])


# ---- Public Submission Endpoint ----

@router.post("", response_model=Envelope[ContactSubmissionResponse], status_code=status.HTTP_201_CREATED)
async def submit_contact_message(
    payload: ContactSubmissionCreate,
    db: AsyncSession = Depends(get_db),
):
    item = await create_contact_submission(db, payload)
    return {"success": True, "data": item}


# ---- Admin Endpoints ----

@router.get("/admin/items", response_model=Envelope[list[ContactSubmissionResponse]])
async def admin_get_contact_submissions(
    status_filter: ContactStatus | None = Query(None, alias="status"),
    q: str | None = Query(None, max_length=100),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_contact_submissions(db, status_filter=status_filter, q=q, skip=skip, limit=limit)
    return {"success": True, "data": rows, "meta": {"total": total, "skip": skip, "limit": limit}}


@router.get("/admin/items/{item_id}", response_model=Envelope[ContactSubmissionResponse])
async def admin_get_single_contact(
    item_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_contact_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Contact submission not found"},
        )
    return {"success": True, "data": item}


@router.patch("/admin/items/{item_id}", response_model=Envelope[ContactSubmissionResponse])
@router.put("/admin/items/{item_id}", response_model=Envelope[ContactSubmissionResponse])
async def admin_update_contact_status(
    item_id: UUID,
    payload: ContactSubmissionUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    item = await get_contact_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Contact submission not found"},
        )

    updated_item = await update_contact_submission(db, item, payload)
    await record_audit(
        db,
        action="UPDATE_CONTACT_STATUS",
        resource_type="contacts",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.INFO,
        details=f"Updated contact inquiry from {item.sender_name}",
        changes=payload.model_dump(exclude_unset=True),
    )
    await db.commit()
    return {"success": True, "data": updated_item}


@router.delete("/admin/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_contact(
    item_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete contact messages"},
        )
    item = await get_contact_by_id(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Contact submission not found"},
        )

    await record_audit(
        db,
        action="DELETE_CONTACT",
        resource_type="contacts",
        resource_id=item.id,
        actor_id=actor["user_id"],
        severity=AuditSeverity.WARNING,
        details=f"Deleted contact submission from {item.sender_email}",
    )
    await delete_contact_submission(db, item)
