"""Database seeding script for NKAR WOO LÀN.

Seeds the database with authentic initial content matching the schema definitions
and verified website data across all 10 modules:
- Users (Superadmin, Editor, Reviewer)
- News articles
- Events
- Heritage records
- Leadership / Register of Reigns
- Gallery media
- Publications & Research
- Development Projects
- Contacts
- Audit Logs
"""

import asyncio
from datetime import datetime, timezone
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import SessionLocal
from app.modules.auth.service import hash_password
from app.modules.users.models import User
from app.modules.news.models import News
from app.modules.events.models import Event
from app.modules.heritage.models import Heritage
from app.modules.leadership.models import Leadership
from app.modules.gallery.models import Gallery
from app.modules.publications.models import Publication
from app.modules.projects.models import DevelopmentProject
from app.modules.contacts.models import ContactSubmission
from app.modules.audit.models import AuditLog
from app.shared.enums import (
    AuditSeverity,
    ContactStatus,
    ContentStatus,
    EventStatus,
    HeritageCategory,
    MediaType,
    NewsCategory,
    ProjectStatus,
    UserRole,
    UserStatus,
)


async def seed_database(db: AsyncSession) -> None:
    print("[Seed] Checking existing records...")
    existing_user = await db.scalar(select(User).limit(1))
    if existing_user:
        print("[Seed] Database already seeded. Skipping seed execution.")
        return

    print("[Seed] Seeding Users...")
    super_admin_id = uuid.uuid4()
    editor_id = uuid.uuid4()
    reviewer_id = uuid.uuid4()

    users = [
        User(
            id=super_admin_id,
            email="admin@nkarwoolan.org",
            name="Paramount Administrator",
            password_hash=hash_password("Admin@Nkar2026!"),
            role=UserRole.SUPER_ADMIN,
            status=UserStatus.ACTIVE,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        ),
        User(
            id=editor_id,
            email="editor@nkarwoolan.org",
            name="Yaa Stella Wirba",
            password_hash=hash_password("Editor@Nkar2026!"),
            role=UserRole.CONTENT_EDITOR,
            status=UserStatus.ACTIVE,
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
        ),
        User(
            id=reviewer_id,
            email="reviewer@nkarwoolan.org",
            name="Fon Martin Fongang",
            password_hash=hash_password("Reviewer@Nkar2026!"),
            role=UserRole.CONTENT_REVIEWER,
            status=UserStatus.ACTIVE,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        ),
    ]
    db.add_all(users)
    await db.flush()

    print("[Seed] Seeding News...")
    news_items = [
        News(
            id=uuid.uuid4(),
            title="Historic Restoration of the Nkar Royal Palace Archives Commences",
            slug="historic-restoration-nkar-royal-palace-archives",
            summary="A landmark preservation initiative launched under the auspices of the Traditional Council to safeguard century-old palm-leaf scripts and royal decrees.",
            content=(
                "The Traditional Council of Nkar Fondom, in collaboration with the cultural heritage commission, "
                "has officially commenced the comprehensive physical and digital restoration of the Royal Palace archives.\n\n"
                "Covering manuscripts, royal lineages, colonial-era boundary agreements, and sacred oral decrees dating back over 180 years, "
                "the project aims to ensure that generations to come have access to uninterrupted cultural truths.\n\n"
                "Speaking during the libation ceremony at the Palace forecourt, the Paramount Fon emphasized the paramount importance "
                "of communal memory: 'A people who forget the footsteps of their ancestors wander aimlessly into tomorrow. "
                "Nkar legacy belongs to every son and daughter at home and in the diaspora.'"
            ),
            cover_image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            category=NewsCategory.ANNOUNCEMENTS,
            tags=["Palace", "Archives", "Preservation", "Fondom"],
            is_featured=True,
            status=ContentStatus.PUBLISHED,
            views=1420,
            published_at=datetime(2026, 11, 1, 10, 0, 0, tzinfo=timezone.utc),
            author_id=super_admin_id,
            reviewer_id=reviewer_id,
            review_notes="Approved with blessing of the Traditional Council.",
        ),
        News(
            id=uuid.uuid4(),
            title="Nkar Community Water Catchment Phase II Reaches 85% Completion",
            slug="nkar-community-water-catchment-phase-two",
            summary="Clean gravity-fed spring water is now flowing to three new quarters: Roh-Nkar, Kika-kom, and Mbah Village.",
            content=(
                "The Nkar Cultural and Development Association (NKACUDA) technical committee has reported significant milestone progress "
                "on the community-funded gravity spring water catchment project.\n\n"
                "With over 14 kilometers of high-density polyethylene piping laid through the lush highland terrains of Mount Nkar, "
                "clean potable spring water is now successfully reaching distribution standpipes across Roh-Nkar and adjacent settlement clusters.\n\n"
                "The total budget of 48,000,000 CFA, raised through diaspora self-reliance rallies and local community contributions, "
                "showcases the legendary unity of the Nkar people."
            ),
            cover_image="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80",
            category=NewsCategory.CLAN_NEWS,
            tags=["Water", "NKACUDA", "Infrastructure", "Self-Reliance"],
            is_featured=True,
            status=ContentStatus.PUBLISHED,
            views=890,
            published_at=datetime(2026, 11, 3, 11, 30, 0, tzinfo=timezone.utc),
            author_id=editor_id,
            reviewer_id=reviewer_id,
            review_notes="Verified engineering milestones and community contributions.",
        ),
        News(
            id=uuid.uuid4(),
            title="Annual Ngon Nkar Cultural Festival 2026 Dates Announced",
            slug="annual-ngon-nkar-cultural-festival-2026-dates",
            summary="The Fondom will gather from December 18th to 23rd for the grand triennial masquerade dances and ancestral homages.",
            content=(
                "His Royal Highness the Fon of Nkar together with the Seven Kingmakers (Fais of Nkar) have sanctioned the official festival calendar "
                "for the upcoming Ngon Nkar cultural celebration.\n\n"
                "Highlights will include the sacred display of traditional royal regalia, traditional wrestling competitions among the youth, "
                "culinary exhibitions featuring legendary cocoyam fufu and traditional smoked beef delicacies, and musical performances by the Nwerong elders."
            ),
            cover_image="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            category=NewsCategory.CULTURE,
            tags=["Festival", "Ngon Nkar", "Masquerade", "Tradition"],
            is_featured=True,
            status=ContentStatus.PUBLISHED,
            views=2150,
            published_at=datetime(2026, 11, 5, 8, 0, 0, tzinfo=timezone.utc),
            author_id=editor_id,
            reviewer_id=reviewer_id,
        ),
    ]
    db.add_all(news_items)

    print("[Seed] Seeding Events...")
    events = [
        Event(
            id=uuid.uuid4(),
            title="Development Town Hall: Water and Village Roads",
            slug="development-town-hall-water-village-roads",
            content="An open meeting on the community water supply and the village roads: progress, costs, next steps, and how families and the diaspora can take part.",
            location="Nkar Palace Square",
            cover_image="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
            media=["https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"],
            start_datetime=datetime(2026, 11, 14, 10, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 11, 14, 13, 0, 0, tzinfo=timezone.utc),
            organizer_name="Nkar Development Committee",
            status=EventStatus.PUBLISHED,
            is_featured=True,
        ),
        Event(
            id=uuid.uuid4(),
            title="Nkar Diaspora Global Dialogue",
            slug="nkar-diaspora-global-dialogue",
            content="An online worldwide gathering for Nkar sons and daughters living outside the village: heritage archive progress, project reports, and collaborative giving.",
            location="Online (Virtual Livestream)",
            cover_image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
            media=["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"],
            start_datetime=datetime(2026, 11, 21, 18, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 11, 21, 20, 0, 0, tzinfo=timezone.utc),
            organizer_name="Nkar Associations Abroad",
            status=EventStatus.PUBLISHED,
            is_featured=True,
        ),
        Event(
            id=uuid.uuid4(),
            title="Nkar Annual General Assembly 2026",
            slug="nkar-annual-general-assembly-2026",
            content="The supreme yearly assembly of the Fondom: reports of the past year, full financial accounts, strategic projects ahead, and communal council resolutions.",
            location="Nkar Palace Square",
            cover_image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            media=["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"],
            start_datetime=datetime(2026, 12, 5, 9, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 12, 5, 17, 0, 0, tzinfo=timezone.utc),
            organizer_name="Palace and Traditional Council",
            status=EventStatus.PUBLISHED,
            is_featured=True,
        ),
        Event(
            id=uuid.uuid4(),
            title="Palace Thanksgiving Ceremony",
            slug="palace-thanksgiving-ceremony",
            content="A solemn thanksgiving gathering at the palace with HRM the Fon, the Traditional Council, quarter heads, and visiting sons and daughters of Nkar.",
            location="Nkar Palace",
            cover_image="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            media=["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"],
            start_datetime=datetime(2026, 8, 16, 10, 0, 0, tzinfo=timezone.utc),
            end_datetime=datetime(2026, 8, 16, 15, 0, 0, tzinfo=timezone.utc),
            organizer_name="Palace and Traditional Council",
            status=EventStatus.COMPLETED,
            is_featured=False,
        ),
    ]
    db.add_all(events)

    print("[Seed] Seeding Heritage...")
    heritage_entries = [
        Heritage(
            id=uuid.uuid4(),
            title="The Sacred Royal Throne and Regalia of the Paramount Fon",
            slug="sacred-royal-throne-regalia-paramount-fon",
            content=(
                "The royal throne of the Fon of Nkar represents the spiritual and temporal apex of the Fondom. "
                "Carved from indigenous hardwood and adorned with sacred brass and beadwork motifs, it symbolizes uninterrupted sovereignty.\n\n"
                "The regalia includes the sacred peace plant (Keng), the royal walking staff, hand-woven ceremonial wraps, "
                "and ancient leopard pelts symbolizing royal authority, protection, and judicial equity across all quarters."
            ),
            category=HeritageCategory.ROYAL_LINEAGE,
            images=[
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80",
            ],
            author_id=super_admin_id,
            reviewed_by_id=reviewer_id,
            status=ContentStatus.PUBLISHED,
        ),
        Heritage(
            id=uuid.uuid4(),
            title="Brief History and Migration Routes of the Nkar People",
            slug="brief-history-migration-routes-nkar-people",
            content=(
                "The history of Nkar is rooted in centuries of Grassfields migration, settlement, and institutional resilience. "
                "Descending from ancestral lineages that navigated the highland ridgelines, the early settlers established "
                "sacred groves, terraced agriculture, and defense outposts that defined the fondom borders.\n\n"
                "Through strategic alliances and diplomatic ties with neighboring kingdoms, Nkar maintained its territorial autonomy "
                "and distinct linguistic identity while fostering rich inter-tribal trade."
            ),
            category=HeritageCategory.HISTORY,
            images=[
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80"
            ],
            author_id=editor_id,
            reviewed_by_id=reviewer_id,
            status=ContentStatus.PUBLISHED,
        ),
        Heritage(
            id=uuid.uuid4(),
            title="The 11 Traditional Institutions and Governance of the Fondom",
            slug="eleven-traditional-institutions-governance-fondom",
            content=(
                "Traditional authority in Nkar operates through 11 sacred and civic institutions:\n"
                "1. Settlement & Administration\n"
                "2. The Fon (Lord of the Land)\n"
                "3. The Spirit Fon\n"
                "4. Palace Administration\n"
                "5. Lavwong\n"
                "6. The Atarntoh\n"
                "7. The Nchiylav Fai\n"
                "8. Ngiri Nkar\n"
                "9. Manjong Nkar\n"
                "10. The Queen Mother (Yaa)\n"
                "11. The Fon as Religious and Spiritual Intercessor.\n\n"
                "Together, these organs ensure checks and balances, dispute arbitration, and the continuity of communal harmony."
            ),
            category=HeritageCategory.CUSTOMS,
            images=[
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
            ],
            author_id=editor_id,
            reviewed_by_id=reviewer_id,
            status=ContentStatus.PUBLISHED,
        ),
    ]
    db.add_all(heritage_entries)

    print("[Seed] Seeding Leadership (Register of Reigns)...")
    leaders = [
        Leadership(
            id=uuid.uuid4(),
            name="Fon Molo I",
            traditional_title="Fon of Nkar",
            biography="Led the fondom during the late 19th-century colonial encounter, consolidating the highland defenses and securing foundational treaty agreements.",
            historical_notes="Instituted the earliest recorded quarter councils and fortified the palace perimeter.",
            portrait_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            start_year=1880,
            end_year=1905,
            period_label="1880 - 1905",
            order_index=1,
            status=ContentStatus.PUBLISHED,
        ),
        Leadership(
            id=uuid.uuid4(),
            name="Fon Molo II",
            traditional_title="Fon of Nkar",
            biography="Steered the fondom through early 20th-century agrarian transitions, patronizing regional trade routes and expanding coffee cultivation across the hills.",
            historical_notes="Recognized for establishing the market square distribution network and standardizing court proceedings.",
            portrait_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            start_year=1905,
            end_year=1940,
            period_label="1905 - 1940",
            order_index=2,
            status=ContentStatus.PUBLISHED,
        ),
        Leadership(
            id=uuid.uuid4(),
            name="Fon Ntani I",
            traditional_title="Fon of Nkar",
            biography="Guided the community through mid-century modern education, public health reforms, and the construction of foundational primary schools and health clinics.",
            historical_notes="Championed missionary-community partnerships and the codification of customary land titles.",
            portrait_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            start_year=1940,
            end_year=1982,
            period_label="1940 - 1982",
            order_index=3,
            status=ContentStatus.PUBLISHED,
        ),
        Leadership(
            id=uuid.uuid4(),
            name="Fon Tume Ntani II",
            traditional_title="Paramount Fon of Nkar",
            biography="Current reigning sovereign. Dedicated to modern infrastructure, global diaspora mobilization, cultural heritage preservation, and sustainable agrarian economy.",
            historical_notes="Represented the Fondom in high-level diplomatic and spiritual engagements, including a royal audience with Pope Francis at the Vatican.",
            portrait_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            start_year=1982,
            end_year=None,
            period_label="1982 - Present",
            order_index=4,
            status=ContentStatus.PUBLISHED,
        ),
    ]
    db.add_all(leaders)

    print("[Seed] Seeding Gallery...")
    gallery_items = [
        Gallery(
            id=uuid.uuid4(),
            title="The Royal Throne of the Paramount Fon",
            alt_text="Authentic photograph of the Royal Throne of Nkar inside the palace chamber",
            description="The revered throne symbolizing royal continuity, peace, and ancestral authority.",
            media_type=MediaType.IMAGE,
            media_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=85",
            thumbnail_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80",
            category="Royalty & Heritage",
            tags=["Palace", "Throne", "Royalty", "Regalia"],
            uploaded_by_id=super_admin_id,
            status=ContentStatus.PUBLISHED,
        ),
        Gallery(
            id=uuid.uuid4(),
            title="Royal Audience with Pope Francis at the Vatican",
            alt_text="HRM the Fon of Nkar in traditional regalia during audience with Pope Francis",
            description="Historic encounter in Rome celebrating interfaith harmony and cultural brotherhood.",
            media_type=MediaType.IMAGE,
            media_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=85",
            thumbnail_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            category="Royalty & Heritage",
            tags=["Vatican", "Diplomacy", "Fon", "Faith"],
            uploaded_by_id=super_admin_id,
            status=ContentStatus.PUBLISHED,
        ),
        Gallery(
            id=uuid.uuid4(),
            title="Nkar Highland Slopes and Agricultural Terraces",
            alt_text="Panoramic view of mist-covered green hills and highland farm fields in Nkar",
            description="Lush highland ridges where generations of Nkar farming families cultivate coffee, maize, and highland crops.",
            media_type=MediaType.IMAGE,
            media_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=85",
            thumbnail_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80",
            category="Landscape",
            tags=["Highlands", "Farmland", "Landscape", "Mount Nkar"],
            uploaded_by_id=editor_id,
            status=ContentStatus.PUBLISHED,
        ),
        Gallery(
            id=uuid.uuid4(),
            title="Palace Cultural Assembly and Masquerade Dance",
            alt_text="Traditional dancers in embroidered robes surrounded by community crowds in the palace plaza",
            description="Energetic traditional dancing and rhythmic drumming during the annual cultural gathering.",
            media_type=MediaType.IMAGE,
            media_url="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=85",
            thumbnail_url="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
            category="Ceremony",
            tags=["Dance", "Festival", "Ngon Nkar", "Music"],
            uploaded_by_id=editor_id,
            status=ContentStatus.PUBLISHED,
        ),
    ]
    db.add_all(gallery_items)

    print("[Seed] Seeding Publications...")
    publications = [
        Publication(
            id=uuid.uuid4(),
            title="The History and Traditions of Nkar Fondom",
            author_name="Rev. Fr. Joseph Tata & Council of Elders",
            description="A foundational anthropological and historical survey detailing the migration chronicles, sovereign dynasties, and sacred societal institutions of Nkar.",
            cover_image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
            document_url="https://nkarwoolan.org/docs/history-and-traditions-of-nkar-fondom.pdf",
            file_type="pdf",
            file_size_bytes=14200000,
            publication_year=2018,
            uploaded_by_id=super_admin_id,
            status=ContentStatus.PUBLISHED,
        ),
        Publication(
            id=uuid.uuid4(),
            title="Grassfields Chieftaincy and Traditional Governance",
            author_name="Dr. Emmanuel Wirba",
            description="Comparative study exploring traditional constitutionalism, sacred institutions, and customary dispute resolution in Nkar and the wider Grassfields.",
            cover_image_url="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
            document_url="https://nkarwoolan.org/docs/grassfields-chieftaincy-traditional-governance.pdf",
            file_type="pdf",
            file_size_bytes=9800000,
            publication_year=2022,
            uploaded_by_id=editor_id,
            status=ContentStatus.PUBLISHED,
        ),
        Publication(
            id=uuid.uuid4(),
            title="Nkar Community Development Charter 2025-2030",
            author_name="NKACUDA Strategic Planning Committee",
            description="Five-year master plan outlining priority targets across rural electrification, road paving, secondary school endowments, and digital medical records.",
            cover_image_url="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
            document_url="https://nkarwoolan.org/docs/nkar-development-charter-2025-2030.pdf",
            file_type="pdf",
            file_size_bytes=5600000,
            publication_year=2025,
            uploaded_by_id=super_admin_id,
            status=ContentStatus.PUBLISHED,
        ),
    ]
    db.add_all(publications)

    print("[Seed] Seeding Development Projects...")
    projects = [
        DevelopmentProject(
            id=uuid.uuid4(),
            title="Nkar Community Water Catchment Phase II",
            description="A comprehensive clean gravity-fed spring water distribution project delivering potable running water to households, school yards, and market squares.",
            location="Roh-Nkar, Kika-kom & Mbah Quarters",
            status=ProjectStatus.ONGOING,
            budget_cfa=48000000,
            progress_percentage=85,
            cover_image_url="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80",
            start_date=datetime(2025, 6, 1, tzinfo=timezone.utc).date(),
            completion_date=datetime(2026, 12, 31, tzinfo=timezone.utc).date(),
            milestones=[
                {"title": "Spring Intake & Filtration Basin", "status": "Completed", "date": "2025-10-15"},
                {"title": "Main Pipeline Laying (14km)", "status": "Completed", "date": "2026-04-20"},
                {"title": "Distribution Standpipes & Water Points", "status": "In Progress", "date": "2026-11-01"},
            ],
        ),
        DevelopmentProject(
            id=uuid.uuid4(),
            title="Palace Cultural Archive & Museum Conservation",
            description="Physical preservation, climate-controlled storage, and digital cataloguing of century-old royal artifacts, sacred regalia, and historical treaties.",
            location="Nkar Royal Palace Grounds",
            status=ProjectStatus.ONGOING,
            budget_cfa=25000000,
            progress_percentage=40,
            cover_image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
            start_date=datetime(2026, 2, 1, tzinfo=timezone.utc).date(),
            completion_date=datetime(2027, 6, 30, tzinfo=timezone.utc).date(),
            milestones=[
                {"title": "Structural Roof Reinforcement", "status": "Completed", "date": "2026-06-10"},
                {"title": "Climate-Controlled Display Cases", "status": "In Progress", "date": "2026-10-25"},
                {"title": "High-Resolution Digital Scanning", "status": "Pending", "date": "2027-02-15"},
            ],
        ),
    ]
    db.add_all(projects)

    print("[Seed] Seeding Contacts...")
    contacts = [
        ContactSubmission(
            id=uuid.uuid4(),
            sender_name="Paul Ndzi",
            sender_email="paul.ndzi@gmail.com",
            phone="+44 7700 900077",
            subject="Diaspora Contribution to Cultural Archive",
            message="Warm greetings to the Palace and Traditional Council. Our family in London holds several photographs from the 1970s of the palace assembly that we wish to donate to the digital heritage repository.",
            status=ContactStatus.UNREAD,
            assigned_to_id=editor_id,
            internal_notes="High priority: Reach out via email with upload link for high-resolution TIFF scans.",
        ),
        ContactSubmission(
            id=uuid.uuid4(),
            sender_name="Grace Fonyuy",
            sender_email="grace.fonyuy@yahoo.fr",
            phone="+237 677 123 456",
            subject="Inquiry regarding Ngon Nkar 2026 Masquerade Registrations",
            message="Hello, our youth cultural dance group from Douala would like to know the deadline for registering our participation in the upcoming cultural festival.",
            status=ContactStatus.IN_PROGRESS,
            assigned_to_id=editor_id,
            internal_notes="Replied with registration forms and scheduled follow-up call with the dance coordinator.",
        ),
    ]
    db.add_all(contacts)

    print("[Seed] Seeding Initial Audit Log...")
    audit_logs = [
        AuditLog(
            id=uuid.uuid4(),
            actor_id=super_admin_id,
            action="INITIALIZE_SYSTEM",
            resource_type="system",
            resource_id=uuid.uuid4(),
            severity=AuditSeverity.INFO,
            details="Fresh schema initialized and canonical seed data populated across all 10 modules.",
            changes={"status": "initialized", "modules": 10},
            metadata_json={"environment": "development", "version": "2.0.0"},
        )
    ]
    db.add_all(audit_logs)

    await db.commit()
    print("[Seed] Database seeding completed successfully!")


async def main() -> None:
    async with SessionLocal() as session:
        await seed_database(session)


if __name__ == "__main__":
    asyncio.run(main())
