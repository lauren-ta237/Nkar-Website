from datetime import datetime

from pydantic import Field

from app.modules.base import ContentBase, HttpUrlStr, Metadata, ModuleModel
from app.shared.enums import ContentStatus, NewsCategory


class NewsCreate(ContentBase):
    summary: str | None = Field(default=None, max_length=500)
    body: str = Field(min_length=1)
    cover_image: HttpUrlStr | None = None
    category: NewsCategory
    tags: list[str] = Field(default_factory=list, max_length=50)
    status: ContentStatus = ContentStatus.DRAFT
    review_notes: str | None = Field(default=None, max_length=1000)


class NewsUpdate(ModuleModel):
    title: str | None = Field(default=None, min_length=3, max_length=200)
    slug: str | None = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=220)
    summary: str | None = Field(default=None, max_length=500)
    body: str | None = Field(default=None, min_length=1)
    cover_image: HttpUrlStr | None = None
    category: NewsCategory | None = None
    tags: list[str] | None = Field(default=None, max_length=50)
    featured: bool | None = None
    status: ContentStatus | None = None
    review_notes: str | None = Field(default=None, max_length=1000)
    published_at: datetime | None = None


class NewsResponse(NewsCreate, Metadata):
    published_at: datetime | None = None
    views: int = 0
