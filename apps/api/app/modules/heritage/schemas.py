from uuid import UUID

from pydantic import Field

from app.modules.base import ContentBase, HttpUrlStr, Metadata, ModuleModel, ModuleRequestModel
from app.shared.enums import ContentStatus, HeritageCategory


class HeritageCreate(ContentBase):
    content: str = Field(min_length=1)
    category: HeritageCategory
    images: list[HttpUrlStr] = Field(default_factory=list)
    status: ContentStatus = ContentStatus.DRAFT


class HeritageUpdate(ModuleRequestModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    content: str | None = Field(default=None, min_length=1)
    category: HeritageCategory | None = None
    images: list[HttpUrlStr] | None = None
    is_featured: bool | None = None
    status: ContentStatus | None = None
    reviewed_by_id: UUID | None = None


class HeritageResponse(HeritageCreate, Metadata):
    author_id: UUID | None = None
    reviewed_by_id: UUID | None = None
