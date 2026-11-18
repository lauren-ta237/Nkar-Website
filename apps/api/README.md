# NKAR WOO LÀN — Backend API

Modern, strictly-typed asynchronous REST API powering the **NKAR WOO LÀN** cultural heritage, community news, events, and administration platform.

Built with **FastAPI**, **SQLAlchemy 2.0 (Asyncio)**, **PostgreSQL (Asyncpg)**, **Pydantic v2**, and **Alembic**.

---

## Architecture & Features

- **Strict Per-Module Setup**: 10 dedicated domain modules located in `app/modules/`:
  - `users`: User identity, RBAC (`super_admin`, `content_editor`, `content_reviewer`), status, and bcrypt hashing.
  - `news`: Community articles, summaries, view counts, and publishing workflows.
  - `events`: Sovereign ceremonies and community gatherings with ISO 8601 datetimes.
  - `heritage`: Sacred traditions, oral histories, and institutional records.
  - `leadership`: Register of Reigns with sequential ordering and royal portraits.
  - `gallery`: Media catalog with external URL validation and thumbnails.
  - `publications`: Books, research PDFs, and community charters.
  - `projects`: Development initiatives with progress tracking, milestones, and CFA budgets.
  - `contacts`: Community message submissions and triage statuses.
  - `audit`: Immutable security audit log tracking actors, diffs, and severity.
- **External Media Storage**: URL-only media pointers (`HttpUrlStr`); no binary BLOBs stored in database.
- **Strictly Fresh Schemas**: Zero backward compatibility bloat; standardized UTC `created_at` / `updated_at`.

---

## Prerequisites

- **Python**: `3.11+` (tested with Python 3.12, 3.13, 3.14)
- **PostgreSQL**: `15+` running locally or via Docker
- **pip** package manager

---

## Quick Start Setup

### 1. Clone & Navigate to API Directory

```bash
cd apps/api
```

### 2. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create your `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` to configure your database connection and secrets:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/nkar_woo_lan
JWT_SECRET_KEY=replace-with-a-strong-random-secret-key-in-production
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
ENVIRONMENT=development

# Cloudinary Object Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=nkar_woo_lan
```

> **Note**: The API expects async database drivers (`postgresql+asyncpg://`). If standard `postgresql://` is provided, the settings validator automatically normalizes it.

---

## Database Management

### 1. Run Migrations

Apply the initial schema to create all 10 tables, foreign keys, and indexes:

```bash
alembic upgrade head
```

To create a new migration after model changes:

```bash
alembic revision --autogenerate -m "describe_changes"
```

### 2. Seed Database with Authentic Initial Data

Populate the database with canonical data across all 10 modules (users, news, events, register of reigns, projects, and media):

```bash
python -m app.database.seed
```

#### Seeded Administrative Accounts

| Role | Email | Default Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@nkarwoolan.org` | `Admin@Nkar2026!` |
| **Content Editor** | `editor@nkarwoolan.org` | `Editor@Nkar2026!` |
| **Content Reviewer** | `reviewer@nkarwoolan.org` | `Reviewer@Nkar2026!` |

---

## Running the Application

### Start Development Server

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at `http://127.0.0.1:8000`.

### Operational Endpoints & Documentation

- **Interactive API Docs (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative API Docs (ReDoc)**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI Schema (JSON)**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## Running Tests

Execute the automated test suite with pytest:

```bash
pytest -v
```

The test suite covers:
- System health checks
- Authentication (login, token validation, invalid credentials rejection)
- Public listing and detail endpoints across all modules
- Public contact form submissions
- Role-based access control (RBAC) security on audit logs

---

## Core API Endpoints

### Authentication
- `POST /api/v1/auth/login` — Authenticate and receive JWT access + refresh tokens
- `POST /api/v1/auth/refresh` — Refresh expired access tokens
- `POST /api/v1/auth/register` — Self-registration (defaults to `content_editor`)

### Public Read Endpoints (Standardized Pagination & Filters)
All public listing endpoints accept `page` (default 1, minimum 1) and `page_size` (default 10, max 100), returning standardized metadata (`meta: { page, page_size, total_items, total_pages, has_next, has_prev }`):
- `GET /api/v1/news` — Published news articles (filter by `category`, search `q` in title/summary/content)
- `GET /api/v1/events` — Published cultural events (filter by `upcoming=true|false`, search `q`)
- `GET /api/v1/heritage` — Cultural heritage records (filter by `category`, search `q`)
- `GET /api/v1/leadership` — Chronological Register of Reigns (search `q`)
- `GET /api/v1/gallery` — Photo and video gallery items (filter by `category`, `media_type`)
- `GET /api/v1/publications` — Books and downloadable PDF publications (search `q`)
- `GET /api/v1/projects` — Community development projects (filter by `status_filter`, search `q`)
- `POST /api/v1/contacts` — Public contact message submission

### Media Storage (Cloudinary)
- `POST /api/v1/media/upload` — Upload image/video/document file (Admin only). Directly streams to Cloudinary and returns pure CDN URL and public ID. No mock responses; requires valid credentials.
- `DELETE /api/v1/media/destroy` — Remove asset from Cloudinary by `public_id` (Admin only).

### Protected Admin Endpoints
- `GET /api/v1/{module}/admin/items` — List all items including drafts, submitted, archived
- `POST /api/v1/{module}/admin/items` — Create new entity record
- `PUT /api/v1/{module}/admin/items/{id}` — Update entity record
- `DELETE /api/v1/{module}/admin/items/{id}` — Delete entity record
- `GET /api/v1/audit` — View security audit log (Super Admin only)

