from uuid import UUID

from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus


class PublicationCreate(ModuleModel):
    title: str = Field(min_length=1, max_length=200)
    author_name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    cover_image_url: HttpUrlStr | None = None
    document_url: HttpUrlStr
    file_type: str = Field(default="pdf", max_length=20)
    file_size_bytes: int | None = Field(default=None, ge=0)
    publication_year: int | None = Field(default=None, ge=1800, le=2100)
    status: ContentStatus = ContentStatus.DRAFT


class PublicationUpdate(ModuleModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    author_name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    cover_image_url: HttpUrlStr | None = None
    document_url: HttpUrlStr | None = None
    file_type: str | None = Field(default=None, max_length=20)
    file_size_bytes: int | None = Field(default=None, ge=0)
    publication_year: int | None = Field(default=None, ge=1800, le=2100)
    status: ContentStatus | None = None


class PublicationResponse(PublicationCreate, Metadata):
    uploaded_by_id: UUID | None = None
