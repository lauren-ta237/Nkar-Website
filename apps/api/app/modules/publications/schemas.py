from datetime import date

from pydantic import Field

from app.modules.base import HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus


class PublicationCreate(ModuleModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    document_url: HttpUrlStr
    file_type: str | None = Field(default=None, max_length=20)
    author_name: str | None = Field(default=None, max_length=200)
    publication_date: date | None = None
    status: ContentStatus = ContentStatus.DRAFT


class PublicationUpdate(ModuleModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    document_url: HttpUrlStr | None = None
    file_type: str | None = Field(default=None, max_length=20)
    author_name: str | None = Field(default=None, max_length=200)
    publication_date: date | None = None
    status: ContentStatus | None = None


class PublicationResponse(PublicationCreate, Metadata):
    pass
