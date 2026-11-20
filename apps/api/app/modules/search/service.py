"""Public search service: queries only published items across modules."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.events.models import Event
from app.modules.gallery.models import Gallery
from app.modules.heritage.models import Heritage
from app.modules.leadership.models import Leadership
from app.modules.news.models import News
from app.modules.projects.models import DevelopmentProject
from app.modules.publications.models import Publication
from app.modules.search.schemas import PublicSearchResultItem
from app.shared.enums import ContentStatus, EventStatus, ProjectStatus


async def search_public_portal(
    db: AsyncSession,
    q: str,
    target_type: str | None = None,
    limit: int = 20,
) -> list[PublicSearchResultItem]:
    if not q or not q.strip():
        return []

    pattern = f"%{q.strip()}%"
    results: list[PublicSearchResultItem] = []
    type_filter = target_type.lower() if target_type and target_type != "All" else None

    # 1. News
    if not type_filter or type_filter == "news":
        news_stmt = (
            select(News.id, News.title, News.slug, News.category, News.summary)
            .where(
                News.status == ContentStatus.PUBLISHED,
                News.title.ilike(pattern) | News.summary.ilike(pattern) | News.content.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(news_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="News",
                    category=str(row.category),
                    subtitle=row.summary,
                    url=f"/news/{row.slug}",
                )
            )

    # 2. Events
    if not type_filter or type_filter == "event":
        events_stmt = (
            select(Event.id, Event.title, Event.slug, Event.location, Event.content)
            .where(
                Event.status == EventStatus.PUBLISHED,
                Event.title.ilike(pattern) | Event.content.ilike(pattern) | Event.location.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(events_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="Event",
                    category="Events",
                    subtitle=row.location,
                    url=f"/events/{row.slug}",
                )
            )

    # 3. Heritage
    if not type_filter or type_filter in ("heritage", "culture"):
        heritage_stmt = (
            select(Heritage.id, Heritage.title, Heritage.slug, Heritage.category)
            .where(
                Heritage.status == ContentStatus.PUBLISHED,
                Heritage.title.ilike(pattern) | Heritage.content.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(heritage_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="Heritage",
                    category=str(row.category),
                    subtitle=None,
                    url=f"/heritage/{row.slug}",
                )
            )

    # 4. Leadership
    if not type_filter or type_filter == "leadership":
        leadership_stmt = (
            select(Leadership.id, Leadership.name, Leadership.traditional_title)
            .where(
                Leadership.status == ContentStatus.PUBLISHED,
                Leadership.name.ilike(pattern) | Leadership.traditional_title.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(leadership_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.name,
                    type="Leadership",
                    category="Royal Lineage",
                    subtitle=row.traditional_title,
                    url="/leadership",
                )
            )

    # 5. Projects
    if not type_filter or type_filter == "project":
        projects_stmt = (
            select(DevelopmentProject.id, DevelopmentProject.title, DevelopmentProject.location, DevelopmentProject.description)
            .where(
                DevelopmentProject.title.ilike(pattern) | DevelopmentProject.description.ilike(pattern) | DevelopmentProject.location.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(projects_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="Project",
                    category="Development",
                    subtitle=row.location,
                    url=f"/projects/{row.id}",
                )
            )

    # 6. Publications
    if not type_filter or type_filter in ("publication", "book", "books"):
        pubs_stmt = (
            select(Publication.id, Publication.title, Publication.author_name, Publication.publication_year)
            .where(
                Publication.status == ContentStatus.PUBLISHED,
                Publication.title.ilike(pattern) | Publication.author_name.ilike(pattern) | Publication.description.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(pubs_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="Publication",
                    category="Publications",
                    subtitle=f"{row.author_name} ({row.publication_year})" if row.publication_year else row.author_name,
                    url="/books",
                )
            )

    # 7. Gallery
    if not type_filter or type_filter == "gallery":
        gallery_stmt = (
            select(Gallery.id, Gallery.title, Gallery.category, Gallery.description)
            .where(
                Gallery.status == ContentStatus.PUBLISHED,
                Gallery.title.ilike(pattern) | Gallery.description.ilike(pattern),
            )
            .limit(limit)
        )
        for row in (await db.execute(gallery_stmt)).all():
            results.append(
                PublicSearchResultItem(
                    id=row.id,
                    title=row.title,
                    type="Gallery",
                    category=str(row.category),
                    subtitle=row.description,
                    url="/gallery",
                )
            )

    return results[:limit]
