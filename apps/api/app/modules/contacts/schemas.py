from uuid import UUID

from pydantic import EmailStr, Field

from app.modules.base import Metadata, ModuleModel
from app.shared.enums import ContactStatus


class ContactSubmissionCreate(ModuleModel):
    sender_name: str = Field(min_length=2, max_length=100)
    sender_email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    subject: str = Field(min_length=1, max_length=255)
    message: str = Field(min_length=10)


class ContactSubmissionUpdate(ModuleModel):
    status: ContactStatus | None = None
    assigned_to_id: UUID | None = None
    internal_notes: str | None = None


class ContactSubmissionResponse(ContactSubmissionCreate, Metadata):
    status: ContactStatus
    assigned_to_id: UUID | None = None
    internal_notes: str | None = None
