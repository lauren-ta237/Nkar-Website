"""SQL-optimized aggregation service for the Admin Dashboard."""

from datetime import datetime, timezone
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.contacts.models import ContactSubmission
from app.modules.dashboard.schemas import (
    DashboardStatsResponse,
    GlobalSearchResultItem,
    PendingReviewItem,
)
from app.modules.events.models import Event
from app.modules.gallery.models import Gallery
from app.modules.heritage.models import Heritage
from app.modules.leadership.models import Leadership
from app.modules.news.models import News
from app.modules.projects.models import DevelopmentProject
from app.modules.publications.models import Publication
from app.modules.users.models import User
from app.shared.enums import (
    ContactStatus,
    ContentStatus,
    EventStatus,
    ProjectStatus,
)


async def get_dashboard_stats(db: AsyncSession) -> DashboardStatsResponse:
    """Performs fast scalar aggregations via SQL without loading full entities."""
    now = datetime.now(timezone.utc)

    # 1. News metrics
    news_stmt = select(
        func.count(News.id).label("total"),
        func.coalesce(
            func.sum(case((News.status == ContentStatus.PUBLISHED, 1), else_=0)),
            0,
        ).label("published"),
        func.coalesce(
            func.sum(case((News.status == ContentStatus.SUBMITTED, 1), else_=0)),
            0,
        ).label("submitted"),
    )
    news_res = (await db.execute(news_stmt)).one()

    # 2. Events metrics
    events_stmt = select(
        func.count(Event.id).label("total"),
        func.coalesce(
            func.sum(
                case(
                    (
                        (Event.status == EventStatus.PUBLISHED)
                        & (Event.start_datetime >= now),
                        1,
                    ),
                    else_=0,
                )
            ),
            0,
        ).label("upcoming"),
        func.coalesce(
            func.sum(case((Event.status == EventStatus.SUBMITTED, 1), else_=0)),
            0,
        ).label("submitted"),
    )
    events_res = (await db.execute(events_stmt)).one()

    # 3. Heritage metrics
    heritage_stmt = select(
        func.count(Heritage.id).label("total"),
        func.coalesce(
            func.sum(case((Heritage.status == ContentStatus.SUBMITTED, 1), else_=0)),
            0,
        ).label("submitted"),
    )
    heritage_res = (await db.execute(heritage_stmt)).one()

    # 4. Simple counts: Gallery, Publications, Users
    gallery_count = (await db.execute(select(func.count(Gallery.id)))).scalar_one()
    publications_count = (await db.execute(select(func.count(Publication.id)))).scalar_one()
    users_count = (await db.execute(select(func.count(User.id)))).scalar_one()

    # 5. Projects metrics (total, active, avg progress)
    projects_stmt = select(
        func.count(DevelopmentProject.id).label("total"),
        func.coalesce(
            func.sum(
                case(
                    (DevelopmentProject.status == ProjectStatus.ONGOING, 1),
                    else_=0,
                )
            ),
            0,
        ).label("active"),
        func.coalesce(
            func.avg(DevelopmentProject.progress_percentage),
            0,
        ).label("avg_progress"),
    )
    projects_res = (await db.execute(projects_stmt)).one()

    # 6. Contact submissions (unread messages)
    contacts_stmt = select(
        func.coalesce(
            func.sum(case((ContactSubmission.status == ContactStatus.UNREAD, 1), else_=0)),
            0,
        )
    )
    unread_messages = (await db.execute(contacts_stmt)).scalar_one()

    # Total pending reviews = submitted news + submitted events + submitted heritage
    pending_reviews = int(news_res.submitted + events_res.submitted + heritage_res.submitted)

    return DashboardStatsResponse(
        totalNews=int(news_res.total),
        publishedNews=int(news_res.published),
        upcomingEvents=int(events_res.upcoming),
        heritageRecords=int(heritage_res.total),
        galleryItems=int(gallery_count),
        publicationsCount=int(publications_count),
        developmentProjectsCount=int(projects_res.total),
        activeProjectsCount=int(projects_res.active),
        averageProjectProgress=int(round(float(projects_res.avg_progress))),
        pendingReviews=pending_reviews,
        unreadMessages=int(unread_messages),
        registeredAdmins=int(users_count),
    )


async def get_pending_reviews(
    db: AsyncSession, limit: int = 20
) -> list[PendingReviewItem]:
    """Retrieves lightweight records awaiting editorial review across entities."""
    results: list[PendingReviewItem] = []

    # 1. Submitted News
    news_stmt = (
        select(
            News.id,
            News.title,
            News.slug,
            News.category,
            News.status,
            News.created_at,
            News.updated_at,
            News.author_id,
        )
        .where(News.status == ContentStatus.SUBMITTED)
        .order_by(News.updated_at.desc())
        .limit(limit)
    )
    news_rows = (await db.execute(news_stmt)).all()
    for row in news_rows:
        results.append(
            PendingReviewItem(
                id=row.id,
                title=row.title,
                slug=row.slug,
                type="News",
                category=str(row.category),
                status=str(row.status),
                created_at=row.created_at,
                updated_at=row.updated_at,
                author_id=row.author_id,
            )
        )

    # 2. Submitted Events
    events_stmt = (
        select(
            Event.id,
            Event.title,
            Event.slug,
            Event.status,
            Event.created_at,
            Event.updated_at,
        )
        .where(Event.status == EventStatus.SUBMITTED)
        .order_by(Event.updated_at.desc())
        .limit(limit)
    )
    event_rows = (await db.execute(events_stmt)).all()
    for row in event_rows:
        results.append(
            PendingReviewItem(
                id=row.id,
                title=row.title,
                slug=row.slug,
                type="Event",
                category="Event",
                status=str(row.status),
                created_at=row.created_at,
                updated_at=row.updated_at,
            )
        )

    # 3. Submitted Heritage
    heritage_stmt = (
        select(
            Heritage.id,
            Heritage.title,
            Heritage.slug,
            Heritage.category,
            Heritage.status,
            Heritage.created_at,
            Heritage.updated_at,
            Heritage.author_id,
        )
        .where(Heritage.status == ContentStatus.SUBMITTED)
        .order_by(Heritage.updated_at.desc())
        .limit(limit)
    )
    heritage_rows = (await db.execute(heritage_stmt)).all()
    for row in heritage_rows:
        results.append(
            PendingReviewItem(
                id=row.id,
                title=row.title,
                slug=row.slug,
                type="Heritage",
                category=str(row.category),
                status=str(row.status),
                created_at=row.created_at,
                updated_at=row.updated_at,
                author_id=row.author_id,
            )
        )

    # Sort combined results by updated_at descending
    results.sort(key=lambda item: item.updated_at, reverse=True)
    return results[:limit]


async def search_admin_portal(
    db: AsyncSession, q: str, limit: int = 15
) -> list[GlobalSearchResultItem]:
    """Performs targeted ILIKE queries across modules for Global Search."""
    if not q or not q.strip():
        return []

    pattern = f"%{q.strip()}%"
    results: list[GlobalSearchResultItem] = []

    # 1. Search News
    news_stmt = (
        select(News.id, News.title, News.status, News.category, News.summary)
        .where(News.title.ilike(pattern) | News.content.ilike(pattern))
        .limit(limit)
    )
    for row in (await db.execute(news_stmt)).all():
        results.append(
            GlobalSearchResultItem(
                id=row.id,
                title=row.title,
                type="News",
                page="news",
                status=str(row.status),
                category=str(row.category),
                subtitle=row.summary,
            )
        )

    # 2. Search Events
    events_stmt = (
        select(Event.id, Event.title, Event.status, Event.location)
        .where(Event.title.ilike(pattern) | Event.content.ilike(pattern))
        .limit(limit)
    )
    for row in (await db.execute(events_stmt)).all():
        results.append(
            GlobalSearchResultItem(
                id=row.id,
                title=row.title,
                type="Event",
                page="events",
                status=str(row.status),
                category="Event",
                subtitle=row.location,
            )
        )

    # 3. Search Heritage
    heritage_stmt = (
        select(Heritage.id, Heritage.title, Heritage.status, Heritage.category)
        .where(Heritage.title.ilike(pattern) | Heritage.content.ilike(pattern))
        .limit(limit)
    )
    for row in (await db.execute(heritage_stmt)).all():
        results.append(
            GlobalSearchResultItem(
                id=row.id,
                title=row.title,
                type="Heritage",
                page="heritage",
                status=str(row.status),
                category=str(row.category),
                subtitle=None,
            )
        )

    # 4. Search Leadership
    leadership_stmt = (
        select(Leadership.id, Leadership.name, Leadership.status, Leadership.traditional_title)
        .where(Leadership.name.ilike(pattern) | Leadership.traditional_title.ilike(pattern))
        .limit(limit)
    )
    for row in (await db.execute(leadership_stmt)).all():
        results.append(
            GlobalSearchResultItem(
                id=row.id,
                title=row.name,
                type="Leadership",
                page="leadership",
                status=str(row.status),
                category="Royal Lineage",
                subtitle=row.traditional_title,
            )
        )

    # 5. Search Projects
    projects_stmt = (
        select(DevelopmentProject.id, DevelopmentProject.title, DevelopmentProject.status, DevelopmentProject.location)
        .where(DevelopmentProject.title.ilike(pattern) | DevelopmentProject.description.ilike(pattern))
        .limit(limit)
    )
    for row in (await db.execute(projects_stmt)).all():
        results.append(
            GlobalSearchResultItem(
                id=row.id,
                title=row.title,
                type="Project",
                page="projects",
                status=str(row.status),
                category="Development",
                subtitle=row.location,
            )
        )

    return results[:limit]
