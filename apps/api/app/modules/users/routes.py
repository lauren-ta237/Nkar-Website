from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.modules.audit.service import record_audit
from app.modules.users.schemas import UserCreate, UserResponse, UserUpdate
from app.modules.users.service import (
    create_user,
    delete_user,
    get_user_by_id,
    list_users,
    update_user,
)
from app.shared.enums import UserRole, UserStatus
from app.shared.responses import Envelope

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=Envelope[list[UserResponse]])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    rows, total = await list_users(db, skip=skip, limit=limit)
    return {
        "success": True,
        "data": rows,
        "meta": {"total": total, "skip": skip, "limit": limit},
    }


@router.get("/{user_id}", response_model=Envelope[UserResponse])
async def get_single_user(
    user_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "USER_NOT_FOUND", "message": "User not found"},
        )
    return {"success": True, "data": user}


@router.post("", response_model=Envelope[UserResponse], status_code=status.HTTP_201_CREATED)
async def create_new_user(
    payload: UserCreate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can create administrator accounts"},
        )

    user = await create_user(db, payload, created_by_id=actor["user_id"])
    await record_audit(
        db,
        action="CREATE_USER",
        entity_type="users",
        entity_id=user.id,
        performed_by_id=actor["user_id"],
        details={"name": user.name, "email": user.email, "role": user.role.value},
    )
    await db.commit()
    return {"success": True, "data": user}


@router.patch("/{user_id}", response_model=Envelope[UserResponse])
@router.put("/{user_id}", response_model=Envelope[UserResponse])
async def update_existing_user(
    user_id: UUID,
    payload: UserUpdate,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN and actor["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Insufficient permissions to update this user"},
        )

    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "USER_NOT_FOUND", "message": "User not found"},
        )

    # Protect self-demotion / self-suspension
    if actor["user_id"] == user_id:
        if payload.role and payload.role != user.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "SELF_MODIFICATION_FORBIDDEN", "message": "Administrators cannot change their own role"},
            )
        if payload.status and payload.status == UserStatus.SUSPENDED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "SELF_SUSPENSION_FORBIDDEN", "message": "Administrators cannot suspend their own account"},
            )

    updated_user = await update_user(db, user, payload)
    await record_audit(
        db,
        action="UPDATE_USER",
        entity_type="users",
        entity_id=user.id,
        performed_by_id=actor["user_id"],
        details={"updated_fields": list(payload.model_dump(exclude_unset=True).keys())},
    )
    await db.commit()
    return {"success": True, "data": updated_user}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_user(
    user_id: UUID,
    actor: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if actor["role"] != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "Only Super Admins can delete users"},
        )
    if actor["user_id"] == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "SELF_DELETE_FORBIDDEN", "message": "Cannot delete your own account"},
        )

    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "USER_NOT_FOUND", "message": "User not found"},
        )

    await record_audit(
        db,
        action="DELETE_USER",
        entity_type="users",
        entity_id=user.id,
        performed_by_id=actor["user_id"],
        details={"email": user.email, "name": user.name},
    )
    await delete_user(db, user)
