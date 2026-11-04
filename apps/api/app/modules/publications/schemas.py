from datetime import date
from pydantic import AnyHttpUrl, Field
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import SimpleStatus

class PublicationCreate(ModuleModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    document_url: AnyHttpUrl
    file_type: str | None = Field(default=None, max_length=20)
    author_name: str | None = None
    publication_date: date | None = None
    status: SimpleStatus = SimpleStatus.DRAFT

class PublicationResponse(PublicationCreate, Metadata):
    pass
