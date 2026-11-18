from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.modules.base import ContentBase, HttpUrlStr, Metadata, ModuleModel, ModuleRequestModel
from app.shared.enums import ContentStatus, NewsCategory


class NewsCreate(ContentBase):
    summary: str | None = Field(default=None, max_length=500)
    content: str = Field(min_length=1)
    cover_image: HttpUrlStr | None = None
    category: NewsCategory
    tags: list[str] = Field(default_factory=list, max_length=50)
    status: ContentStatus = ContentStatus.DRAFT
    review_notes: str | None = Field(default=None, max_length=1000)


class NewsUpdate(ModuleRequestModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    summary: str | None = Field(default=None, max_length=500)
    content: str | None = Field(default=None, min_length=1)
    cover_image: HttpUrlStr | None = None
    category: NewsCategory | None = None
    tags: list[str] | None = Field(default=None, max_length=50)
    is_featured: bool | None = None
    status: ContentStatus | None = None
    review_notes: str | None = Field(default=None, max_length=1000)
    published_at: datetime | None = None


class NewsResponse(NewsCreate, Metadata):
    author_id: UUID | None = None
    reviewer_id: UUID | None = None
    published_at: datetime | None = None
    views: int = 0
