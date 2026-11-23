## TOODO

- [x] Convert project to typescript
- [x] Convert project from tailwindcss v3 to v4 setup

### NKAR WOO LÀN Updates (2026-11-09)

- [x] **Authentic Hero & Intro Imagery**:
  - Home Hero Background: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
  - About Page Hero: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
  - Leadership Page Hero: `fon sit.jpeg`
  - "Welcome to Nkar" Section: `WhatsApp Image 2026-11-01 at 1.16.56 PM.jpeg`
- [x] **Featured Gallery Photographs**:
  - `fon sit.jpeg` (The Royal Throne of the Fon)
  - `WhatsApp Image 2026-11-01 at 2.12.47 PM.jpeg` (Royal audience with Pope Francis at the Vatican)
  - `fon pope.jpeg` (Palace homage & papal blessing)
- [x] **Orthography & Branding**:
  - Standardized spelling to **NKAR WOO LÀN** (with grave accent "asang" on A).
  - Eliminated all residual occurrences of `"Land"` / `"LAND"`.
  - Switched logo imports to `logo.jpeg` and deleted `logo.jpg`.
- [x] **Official Contact Channels**:
  - Phone: `+237 679 632 780` & `+237 678 496 051` (clickable `tel:` links).
  - Email: `info@nkarwoolan.org` (clickable `mailto:` link).
- [x] **SEO, Open Graph & Social Sharing**:
  - Configured complete Open Graph metadata (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:type`, `og:locale`).
  - Configured Twitter Card metadata (`summary_large_image`).
  - Set OG image to `public/banner.png` (`https://nkarwoolan.org/banner.png` at 960x941).
  - Configured multi-resolution favicons (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) and `site.webmanifest`.
- [x] **Hero Logo Presentation**:
  - Removed frosted glass blur backdrop (`backdrop-blur-xs`, `border_border-gold-500/30_bg-forest-950/60`, container box).
  - Made the circular emblem significantly larger (`max-w-[420px]`, up from 280px) with authentic gold border (`border-gold-300/80`), deep shadow, and subtle interactive hover scaling.
- [x] **Copy Polish & Natural Phrasing Across the App**:
  - Eliminated AI-style em-dashes (`—`) across all data files (`culture.ts`, `books.ts`, `gallery.ts`, `news.ts`, `projects.ts`, `site.ts`) and pages.
  - Replaced contradictory photo placeholder notice in `Gallery.tsx` with accurate acknowledgement of authentic photography of the Fon, Vatican audience, and Nkar landscape.
  - Updated `ContactForm.tsx` submission feedback to an authentic community confirmation message with direct WhatsApp/phone and email channels.
  - Restructured draft notices in `NewsEvents.tsx` and `About.tsx` to read with dignified, natural community cadence.
  - Replaced repetitive "Nkar author — name to be confirmed" placeholders with dignified community attribution.
- [x] **Verification**:
  - Removed obsolete `photoNote` from `images.ts` and clean up unused imagery notes.
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Bundled all authentic media assets and compiled cleanly.

### NKAR WOO LÀN Overhaul — `tasks/pro 3.docx` Directives (2026-11-13)

- [x] **Sovereign Terminology Shift**:
  - Replaced "Clan" with "Kingdom/Fondom" globally across header utility bar, hero banner, meta tags, and footer.
  - Updated core promise to: *"The Nkar indigenous Kingdom/Fondom..."*
- [x] **Home Intro Section**:
  - Integrated exact governance opening highlighting the Fon, Lord of the Land, and Nwerong.
  - Updated second paragraph opening to: *"The Nkar Kingdom/Fondom is a community of the Cameroon Grassfields..."*
- [x] **Prototype & Badge Cleanup**:
  - Removed all "TO BE VERIFIED", "Sample", and "Draft" badges from Quick Facts, Gallery, News, Projects, and Timeline.
- [x] **About Us Page Overhaul**:
  - Replaced "Where Nkar comes from" with "Brief History of Nkar".
  - Integrated dedicated sections: Major Migration Routes, HRM The Fon of Nkar Speaks, Climate Topography & Vegetation, Economic Activities & Farming, and Traditional Dances & Social Life.
  - Linked authentic media: `nkar_hill_farms.png` (conical hill) and `palace_gathering.jpeg` (cultural dance/palace crowd).
- [x] **Leadership Page Overhaul**:
  - Restructured traditional governance into the 11 authentic institutions (Settlement & Admin, The Fon, The Spirit Fon, Palace Admin, Lavwong, The Atarntoh, The Nchiylav Fai, Ngiri Nkar, Manjong Nkar, Queen Mother, Fon as Religious Leader).
  - Added dedicated section: "Nkar Sites and Traditional Sacrifices".
  - Redesigned Register of Reigns: displays official names and reign dates only, mapping authentic portraits for Fon Molo I, Fon Molo II, Fon Ntani I, Fon Tume Ntani II, with missing portraits defaulting to the Royal Throne (`fon sit.jpeg`).
- [x] **Verification**:
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Bundled all 10+ authentic media assets and compiled in 43.92s with 0 errors.

### NKAR WOO LÀN — Backend API Setup Proper (2026-11-15)

- [x] **Explicit Per-Module Architecture**:
  - Removed catch-all dynamic routes (`entities.py`), generic CRUD (`crud.py`), and dynamic dispatchers.
  - Implemented 10 dedicated, strictly-typed modules under `apps/api/app/modules/`:
    - `users`: User authentication, roles (`super_admin`, `content_editor`, `content_reviewer`), status (`active`, `suspended`), bcrypt password hashing, and login/audit hooks.
    - `news`: Articles, summaries, category, tags, view tracking, and workflow publishing.
    - `events`: Community and cultural events with ISO 8601 `start_datetime`, `end_datetime`, `status: EventStatus` (`upcoming`, `ongoing`, `completed`, `cancelled`), and media URLs.
    - `heritage`: Cultural assets, oral traditions, reviewer attribution, and `HeritageCategory` (`village_history`, `customs`, `language`, `royal_lineage`, `historical_artifacts`).
    - `leadership`: Traditional rulers/Fons, `traditional_title`, `start_year`, `end_year`, `period_label`, and `order_index`.
    - `gallery`: Media repository with `media_type` (`photo`, `video`), external `media_url`, `thumbnail_url`, category, and tags.
    - `publications`: Books and research with `document_url`, `file_type`, `file_size_bytes`, and `publication_year`.
    - `projects`: Development projects with `budget_cfa`, `progress_percentage`, milestones JSON array, and `ProjectStatus`.
    - `contacts`: Community contact form submissions, tracking `status: ContactStatus` (`unread`, `in_progress`, `resolved`), and internal notes.
    - `audit`: Immutable audit trail tracking `severity: AuditSeverity` (`info`, `warning`, `critical`), actor ID, action, resource diffs, and metadata.
- [x] **Clean-Slate Schema Alignment (Zero Backward Compatibility)**:
  - Standardized universal UTC timestamps to `created_at` and `updated_at` (removing legacy `createdAt`/`updatedAt` duplicates).
  - All media paths strictly validated as external URL strings (`HttpUrlStr`), with no binary/blob storage in database or filesystem.
  - Eliminated legacy dual/redundant fields (e.g. single `content` column, single `title` column, normalized integer year ranges).
- [x] **Database & Migrations**:
  - Rewrote Alembic migration `0001_initial_schema.py` to produce clean 10-table relational schema with appropriate indexes and foreign keys.
  - Verified 100% clean compilation across all modules (`python -B -m compileall -q apps/api/app apps/api/migrations`).

---

### Proposed Schema Enhancements (Based on UI Form Audit & Removed Fields)

During the Phase 0 API client alignment for `apps/admin`, several rich domain fields previously used in UI forms were removed to strictly match existing backend Pydantic models. Below is a structured proposal to re-introduce these high-value fields into the backend schemas and database tables:

#### 1. `users` Module (`apps/api/app/modules/users/`)
* **`phone`** (`str | None`):
  * **Pydantic**: `phone: str | None = Field(default=None, max_length=30)` (in `UserCreate`, `UserUpdate`, `UserResponse`)
  * **SQLAlchemy**: `phone: Mapped[str | None] = mapped_column(String(30), nullable=True)`
  * **Justification**: Vital for emergency coordination among council administrators, contact verification, and direct WhatsApp communication between editors, reviewers, and super admins.
* **`title`** (`str | None`):
  * **Pydantic**: `title: str | None = Field(default=None, max_length=150)`
  * **SQLAlchemy**: `title: Mapped[str | None] = mapped_column(String(150), nullable=True)`
  * **Justification**: Captures the official traditional or administrative working title (e.g., *"Heritage Council Secretary & Chief Reviewer"*, *"Community Content Officer & Field Writer"*) to properly display administrator identity across audit logs and profile headers.

#### 2. `heritage` Module (`apps/api/app/modules/heritage/`)
* **`summary`** (`str | None`):
  * **Pydantic**: `summary: str | None = Field(default=None, max_length=500)`
  * **SQLAlchemy**: `summary: Mapped[str | None] = mapped_column(String(500), nullable=True)`
  * **Justification**: Essential for card summaries, search result snippets, and global search listings without loading massive multi-page historical narratives.
* **`oral_tradition_source`** (`str | None`):
  * **Pydantic**: `oral_tradition_source: str | None = Field(default=None, max_length=255)`
  * **SQLAlchemy**: `oral_tradition_source: Mapped[str | None] = mapped_column(String(255), nullable=True)`
  * **Justification**: Nkar heritage relies heavily on oral accounts. Recording custodial provenance (e.g., *"Pa Shey Ndzefon & Council of Royal Elders (1994 tape transcription)"*) is indispensable for historical authority and cultural provenance.

#### 3. `projects` Module (`apps/api/app/modules/projects/`)
* **`lead_coordinator`** (`str | None`):
  * **Pydantic**: `lead_coordinator: str | None = Field(default=None, max_length=150)`
  * **SQLAlchemy**: `lead_coordinator: Mapped[str | None] = mapped_column(String(150), nullable=True)`
  * **Justification**: Village development projects (water gravity schemes, electrification, health centers) require public accountability and named operational leads (e.g., *"Eng. Francis Mbinkar"*).
* **`funding_source`** (`str | None`):
  * **Pydantic**: `funding_source: str | None = Field(default=None, max_length=255)`
  * **SQLAlchemy**: `funding_source: Mapped[str | None] = mapped_column(String(255), nullable=True)`
  * **Justification**: Tracks community grants, diaspora branches (e.g., *"NKACUDA North America"*, *"NKACUDA Yaounde Branch"*), or council funds.

#### 4. `events` Module (`apps/api/app/modules/events/`)
* **`category`** (`str | None` or `EventCategory` enum):
  * **Pydantic**: `category: str | None = Field(default=None, max_length=100)`
  * **SQLAlchemy**: `category: Mapped[str | None] = mapped_column(String(100), nullable=True)`
  * **Justification**: Allows categorizing cultural gatherings (e.g., *"Traditional Festival"*, *"Royal Ceremony"*, *"Council Meeting"*, *"Youth & Culture"*, *"Community Assembly"*), enabling calendar and list view filtering matching the other content modules.

#### 5. `publications` Module (`apps/api/app/modules/publications/`)
* **`isbn`** (`str | None`):
  * **Pydantic**: `isbn: str | None = Field(default=None, max_length=25)`
  * **SQLAlchemy**: `isbn: Mapped[str | None] = mapped_column(String(25), nullable=True)`
  * **Justification**: International standard identifier for published books and monographs cataloged in the Nkar library repository.

#### Backend Implementation Checklist for New Fields:
- [ ] Add columns to SQLAlchemy models in `apps/api/app/modules/<module>/models.py`
- [ ] Add fields to Pydantic schemas in `apps/api/app/modules/<module>/schemas.py` (`Create`, `Update`, `Response`)
- [ ] Generate Alembic migration: `alembic revision --autogenerate -m "add_operational_fields_to_users_heritage_projects"`
- [ ] Run migration: `alembic upgrade head`
- [ ] Update `apps/admin/src/types/index.ts` and re-enable form controls in `apps/admin`


---


- Also, cleanup the login ui and other related ui states across the admin. Never disclose internal data to ui
- image Assets are not imported correctly in login view and other files validate and fix
- Never claim, don't blood the UI with unnecessary text (generated text)
- there is still default legacy data on the app, also cleanup the useAdminStore