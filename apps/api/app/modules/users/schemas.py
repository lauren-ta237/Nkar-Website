from pydantic import EmailStr, Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel, ModuleRequestModel
from app.shared.enums import UserRole, UserStatus


class UserCreate(ModuleRequestModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.CONTENT_EDITOR
    status: UserStatus = UserStatus.ACTIVE
    avatar_url: HttpUrlStr | None = None


class UserUpdate(ModuleRequestModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    role: UserRole | None = None
    status: UserStatus | None = None
    avatar_url: HttpUrlStr | None = None


class UserResponse(Metadata):
    name: str
    email: EmailStr
    role: UserRole
    status: UserStatus
    avatar_url: HttpUrlStr | None = None
