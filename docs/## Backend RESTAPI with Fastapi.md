## Backend RESTAPI with Fastapi

Act as a Lead Software Architect and Senior Systems Engineer for a backend system using fastapi.

Your task is to build a centralized RESTAPI backend system for a platform called Nkar Woo Lan, a centralized digital community heritage platform for Nkar Clan, Northwest Region, Cameroon.

Emphasis on a good Architecture, schema design, documentation, API structure {request, response}, validation. 

Note: You are building APIs only no UI

### Recommended architecture 
| Area                | My Recommendation               |
| ------------------- | ------------------------------- |
| Architecture        | Modular Monolith                |
| Backend             | FastAPI                         |
| Database            | PostgreSQL                      |
| ORM                 | SQLAlchemy 2.0                  |
| Validation          | Pydantic v2                     |
| Authentication      | JWT with refresh-token rotation |
| Authorization       | Database-backed RBAC            |
| API Structure       | REST `/api/v1`                  |
| Database Migrations | Alembic                         |
| File Management     | cloudinary         |
| Testing             | Pytest                          |
| Documentation       | Swagger               |
| Deployment          | Docker                          |


### Folder Structure 

nkar-woo-lan-backend/
│
├── app/
│   │
│   ├── main.py
│   ├── __init__.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── exceptions.py
│   │   ├── logging.py
│   │   ├── permissions.py
│   │   ├── constants.py
│   │   └── middleware.py
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── session.py
│   │   ├── base.py
│   │   └── init_db.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   │
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       │
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   ├── users.py
│   │       │   ├── news.py
│   │       │   ├── events.py
│   │       │   ├── heritage.py
│   │       │   ├── leadership.py
│   │       │   ├── gallery.py
│   │       │   ├── publications.py
│   │       │   ├── projects.py
│   │       │   ├── contacts.py
│   │       │   ├── contributions.py
│   │       │   ├── dashboard.py
│   │       │   └── audit_logs.py
│   │       │
│   │       └── dependencies/
│   │           ├── authentication.py
│   │           ├── authorization.py
│   │           └── pagination.py
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── utils.py
│   │   │
│   │   ├── users/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── news/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── validators.py
│   │   │
│   │   ├── events/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── heritage/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── leadership/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── gallery/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── publications/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── projects/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── contacts/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   ├── contributions/
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   │
│   │   └── audit/
│   │       ├── __init__.py
│   │       ├── models.py
│   │       ├── schemas.py
│   │       ├── service.py
│   │       └── repository.py
│   │
│   ├── shared/
│   │   ├── __init__.py
│   │   ├── enums.py
│   │   ├── pagination.py
│   │   ├── responses.py
│   │   ├── exceptions.py
│   │   └── validators.py
│   │
│   └── storage/
│       ├── __init__.py
│       ├── storage_service.py
│       └── providers.py
│
├── migrations/
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_auth.py
│   │   ├── test_news.py
│   │   ├── test_events.py
│   │   └── test_permissions.py
│   │
│   ├── integration/
│   │   ├── test_auth_api.py
│   │   ├── test_news_api.py
│   │   ├── test_events_api.py
│   │   └── test_users_api.py
│   │
│   └── security/
│       ├── test_rbac.py
│       └── test_protected_routes.py
│
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── authentication.md
│   ├── authorization.md
│   ├── api-documentation.md
│   ├── error-handling.md
│   └── deployment.md
│
├── scripts/
│   ├── create_admin.py
│   └── seed_database.py
│
├── .env
├── .env.example
├── .gitignore
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pytest.ini
├── pyproject.toml
└── README.md


======================================================================
1. ARCHITECTURAL PRINCIPLES & API STANDARDS
======================================================================
- RESTful Versioning: Structure all endpoint paths under `/api/v1/`.
- Uniform JSON Envelope: Standardize all responses:
  * Success: `{ "success": true, "data": <payload|array>, "meta": { "total": number, "page": number, "limit": number } }`
  * Error: `{ "success": false, "error": { "code": "STRING_CODE", "message": "Human readable summary", "details": [<validation_errors>] } }`
- HTTP Status Codes: Strict adherence (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable Entity, 500 Internal Error).
- Validation: Enforce strict input validation (type checking, string length constraints, regex matching for emails/slugs, enum validation, min/max numbers).

======================================================================
2. ENTITY DEFINITIONS & SCHEMAS (ALL 10 ENTITIES)
======================================================================
Instantiate all 10 schema models with exact constraints and metadata tracking (`id`, `created_date`, `updated_date`, `created_by_id`):

1. Users
   - `name`: string, required, min 2, max 100 chars
   - `email`: string, required, unique, valid email format
   - `role`: enum ['super_admin', 'content_editor', 'content_reviewer'], default: 'content_editor'
   - `status`: enum ['active', 'suspended'], default: 'active'
   - `avatar_url`: string, valid URL

2. News
   - `title`: string, required, 3–200 chars
   - `slug`: string, required, unique, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
   - `summary`: string, max 500 chars
   - `body`: string (Markdown/HTML), required
   - `cover_image`: string, valid URL
   - `category`: enum ['announcements', 'clan_news', 'obituaries', 'celebrations', 'education', 'health', 'culture'], required
   - `tags`: array of strings
   - `featured`: boolean, default: false
   - `status`: enum ['draft', 'submitted', 'approved', 'rejected', 'published', 'archived'], required, default: 'draft'
   - `review_notes`: string, max 1000 chars
   - `owner_id`: string (FK -> Users.id)
   - `submitted_by_id`: string (FK -> Users.id)
   - `reviewed_by_id`: string (FK -> Users.id)
   - `published_at`: string (ISO 8601 Timestamp)
   - `views`: number, integer, default: 0

3. Events
   - `title`: string, required, 3–200 chars
   - `slug`: string, required, unique, lower-kebab-case
   - `description`: string, required
   - `location`: string, required (e.g., "Nkar Fondom Grounds", "Douala", "Virtual")
   - `event_date`: string, required (ISO 8601 Date)
   - `start_time`: string (e.g., "09:00")
   - `end_time`: string (e.g., "17:00")
   - `cover_image`: string, valid URL
   - `organizer_name`: string
   - `status`: enum ['draft', 'submitted', 'published', 'archived'], required, default: 'draft'
   - `featured`: boolean, default: false

4. Heritage
   - `title`: string, required, 3–200 chars
   - `slug`: string, required, unique
   - `content`: string (Markdown/HTML), required
   - `category`: enum ['history', 'customs', 'language', 'royal_lineage', 'artifacts'], required
   - `media_urls`: array of strings (URLs)
   - `status`: enum ['draft', 'submitted', 'published', 'archived'], required, default: 'draft'

5. Leadership
   - `name`: string, required (e.g., "Fon of Nkar")
   - `title_role`: string, required (e.g., "Fon", "Sub-Chief", "Nkum", "Council Member")
   - `bio`: string
   - `period_active`: string (e.g., "1982 - Present")
   - `photo_url`: string, valid URL
   - `order_index`: number, integer (for display sorting)
   - `status`: enum ['draft', 'published'], required, default: 'draft'

6. Gallery
   - `title`: string, required
   - `description`: string
   - `media_type`: enum ['image', 'video'], required, default: 'image'
   - `media_url`: string, required, valid URL
   - `album_category`: string (e.g., "Cultural Festival 2026")
   - `tags`: array of strings
   - `status`: enum ['draft', 'published'], required, default: 'draft'

7. Publications
   - `title`: string, required
   - `description`: string
   - `document_url`: string, required, valid URL
   - `file_type`: string (e.g., "pdf", "docx")
   - `author_name`: string
   - `publication_date`: string (ISO 8601 Date)
   - `status`: enum ['draft', 'published'], required, default: 'draft'

8. DevelopmentProjects
   - `project_name`: string, required
   - `description`: string, required
   - `location`: string (e.g., "Nkar Village, Northwest Region")
   - `status`: enum ['proposed', 'ongoing', 'completed'], required, default: 'proposed'
   - `budget_cfa`: number, positive integer (XAF currency)
   - `progress_percentage`: number, integer 0–100, default: 0
   - `cover_image`: string, valid URL
   - `start_date`: string (ISO 8601 Date)
   - `completion_date`: string (ISO 8601 Date)

9. ContactSubmissions
   - `sender_name`: string, required, min 2 chars
   - `sender_email`: string, required, valid email
   - `phone`: string
   - `subject`: string, required
   - `message`: string, required, min 10 chars
   - `status`: enum ['unread', 'in_progress', 'resolved'], required, default: 'unread'
   - `notes`: string

10. AuditLogs
    - `action`: string, required (e.g., "CREATE_NEWS", "PUBLISH_EVENT", "SUSPEND_USER")
    - `entity_type`: string, required (e.g., "News", "Users")
    - `entity_id`: string, required
    - `performed_by_id`: string, required (FK -> Users.id)
    - `details`: string (JSON string of changes/payload)
    - `timestamp`: string, required (ISO 8601 Timestamp)

======================================================================
3. WORKFLOWS, RBAC, & SECURITY RULES
======================================================================
- Public API Access: All anonymous/public GET endpoints must enforce `status == 'published'` (or `status == 'resolved'` for public views if applicable). Public users must NEVER see drafts, submitted items, or audit logs.
- Role-Based Access Control (RBAC):
  * Super Admin: Full CRUD access across all 10 entities, role management, system settings, and AuditLogs viewing.
  * Content Editor: Create and update own records in draft/submitted states across News, Events, Heritage, Gallery, Publications, and DevelopmentProjects. Cannot publish directly.
  * Content Reviewer: Review, update, approve, reject, publish, or archive records across content entities.
- Audit Logging: Automatically trigger an entry in `AuditLogs` on every state mutation (CREATE, UPDATE, DELETE, PUBLISH, SUSPEND).

======================================================================
4. REQUIRED DELIVERABLES & OUTPUT
======================================================================
1. Schema Configurations: Complete schema setup for all 10 entities.
2. Route Registration: Full set of REST API endpoints for every entity (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `bulk`).
3. Swagger Specs: Generate complete specs including request schemas, query parameters (`q`, `limit`, `skip`, `sort_by`), and response object models for all 10 entities.
4. Execution Confirmation: Confirm when all endpoints, schemas, and RBAC rules are fully deployed and visible in the platform documentation panel.