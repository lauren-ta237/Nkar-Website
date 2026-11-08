from pydantic import AnyHttpUrl, EmailStr, Field
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import UserRole, UserStatus

class UserCreate(ModuleModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    role: UserRole = UserRole.CONTENT_EDITOR
    avatar_url: AnyHttpUrl | None = None

class UserUpdate(ModuleModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    role: UserRole | None = None
    status: UserStatus | None = None
    avatar_url: AnyHttpUrl | None = None

class UserResponse(Metadata):
    name: str
    email: EmailStr
    role: UserRole
    status: UserStatus
    avatar_url: AnyHttpUrl | None = None
