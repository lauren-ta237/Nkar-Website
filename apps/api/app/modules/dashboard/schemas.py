from datetime import datetime
from uuid import UUID

from app.modules.base import ModuleModel


class DashboardStatsResponse(ModuleModel):
    totalNews: int
    publishedNews: int
    upcomingEvents: int
    heritageRecords: int
    galleryItems: int
    publicationsCount: int
    developmentProjectsCount: int
    activeProjectsCount: int
    averageProjectProgress: int
    pendingReviews: int
    unreadMessages: int
    registeredAdmins: int


class PendingReviewItem(ModuleModel):
    id: UUID
    title: str
    slug: str | None = None
    type: str
    category: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime
    author_id: UUID | None = None


class GlobalSearchResultItem(ModuleModel):
    id: UUID
    title: str
    type: str
    page: str
    status: str | None = None
    category: str | None = None
    subtitle: str | None = None
