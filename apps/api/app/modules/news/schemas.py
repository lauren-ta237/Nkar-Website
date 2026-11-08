from datetime import datetime
from uuid import UUID
from pydantic import AnyHttpUrl, Field
from app.modules.base import ContentBase, Metadata
from app.shared.enums import NewsCategory, PublicationStatus

class NewsCreate(ContentBase):
    summary: str | None = Field(default=None, max_length=500)
    body: str = Field(min_length=1)
    cover_image: AnyHttpUrl | None = None
    category: NewsCategory
    tags: list[str] = Field(default_factory=list, max_length=50)
    status: PublicationStatus = PublicationStatus.DRAFT
    review_notes: str | None = Field(default=None, max_length=1000)
    owner_id: UUID | None = None

class NewsResponse(NewsCreate, Metadata):
    submitted_by_id: UUID | None = None
    reviewed_by_id: UUID | None = None
    published_at: datetime | None = None
    views: int = 0
