# Modular API Integration & Component Implementation Plan

This plan establishes a phased roadmap to transition **NKAR WOO LÀN** from static mock data to the FastAPI backend (`apps/api`), integrating components and TanStack Query hooks in both **`apps/web`** (public portal) and **`apps/admin`** (executive dashboard).

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    FastAPI Backend (apps/api)        │
                      │       http://localhost:8000          │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│     Public Web (apps/web)       │             │     Admin Portal (apps/admin)   │
│   src/lib/api/ (Axios + Hooks)  │             │   src/lib/api/ (Axios + Hooks)  │
│      Read-only & Contacts       │             │       Protected Full CRUD       │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

### Core Design Rules:
1. **Fallback Resilience (Offline/Static First)**: If `apps/api` is offline or returns an error, the public web client seamlessly falls back to local static data (`src/data/`) to prevent broken pages.
2. **Standardized HTTP Client**: Both clients use their configured `src/lib/api/config/axios-client.ts` with Bearer auth token interceptors and normalized `ApiError` handling.
3. **Pydantic $\leftrightarrow$ TypeScript Type Parity**: Every module contract is typed identically across `apps/api/app/modules/*/schemas.py`, `apps/web/src/types/`, and `apps/admin/src/types/`.

---

## Phase 0: Foundation, Auth & Environment Setup

### Objectives:
- Establish shared API client conventions, auth context, and environment toggles.
- Verify CORS and session token exchange between `apps/web` (port 5173), `apps/admin` (port 3000), and `apps/api` (port 8000).

### Key Tasks:
1. **Backend Verification (`apps/api`)**:
   - Verify `CORS` allows `http://localhost:5173` and `http://localhost:3000`.
   - Ensure `/health` endpoint responds with `{ "status": "ok" }`.
   - Seed database (`python -m app.database.seed`) with initial users, 25 Fons, and baseline content.
2. **Frontend Client Foundation**:
   - Add toggle in `apps/web/src/lib/env.ts` (`VITE_USE_REMOTE_API="false"` by default, set to `"true"` to enable live fetching).
   - In `apps/admin/src/lib/env.ts`, verify `VITE_USE_MOCK_STORAGE="false"` switches `backendApi` calls to real HTTP endpoints.
3. **Authentication Handshake**:
   - Connect `apps/admin` login modal to `POST /api/v1/auth/login`.
   - Store access token in `src/lib/auth-token.ts` with automatic header injection.

---

## Phase 1: High-Frequency Content Modules (News & Events)

### Objectives:
- Connect dynamic community news and events to the backend, enabling administrators to publish updates and visitors to view live articles.

### 1. Public Web (`apps/web`):
- **Endpoints**:
  - `GET /api/v1/news?published_only=true`
  - `GET /api/v1/news/{slug}`
  - `GET /api/v1/events?upcoming_only=true`
- **Implementation**:
  - Create `apps/web/src/lib/api/news.api.ts` and `events.api.ts`.
  - Update `useContent.ts` (`useNews`, `useEvents`) to query live API with fallback to `@/data/news`.
  - Ensure `NewsCard.tsx`, `EventCard.tsx`, and `NewsEvents.tsx` reflect live database timestamps and cover images.

### 2. Admin Portal (`apps/admin`):
- **Endpoints**:
  - Full CRUD under `GET|POST|PUT|DELETE /api/v1/admin/news/items` and `/api/v1/admin/events/items`.
- **Implementation**:
  - In `apps/admin/src/lib/api/queries.ts`, switch `useNewsList`, `useNewsMutations`, `useEventsList`, and `useEventsMutations` to execute HTTP calls via `api` (`axios-client`).
  - Verify `NewsFormModal.tsx` and `EventsFormModal.tsx` create/update records directly in PostgreSQL/SQLite.

---

## Phase 2: Cultural Heritage, Sacred Sites & Traditional Leadership

### Objectives:
- Connect the core sovereign institutions, sacred boundary sacrifice sites, and the 25-Fon succession register.

### 1. Public Web (`apps/web`):
- **Endpoints**:
  - `GET /api/v1/leadership?published_only=true` (Returns 25 Fons, sorted by `display_order`).
  - `GET /api/v1/heritage?published_only=true` (Returns historical chronicles, metallurgy, migrations).
  - `GET /api/v1/leadership/institutions` & `/api/v1/leadership/sacred-sites`.
- **Implementation**:
  - Create `apps/web/src/lib/api/culture.api.ts`.
  - Update `useLeadershipContent` in `useContent.ts` to hydrate `leadershipRecords` and `sacredSites` from the API, falling back to `@/data/culture.ts`.
  - Update `Leadership.tsx` and `About.tsx` to display live historical additions while preserving local royal portraits.

### 2. Admin Portal (`apps/admin`):
- **Endpoints**:
  - `GET|POST|PUT|DELETE /api/v1/admin/leadership/items`
  - `GET|POST|PUT|DELETE /api/v1/admin/heritage/items`
- **Implementation**:
  - Wire `LeadershipView.tsx` and `HeritageView.tsx` to real API mutations.
  - Enable palace archivists to update reign dates, oral tradition sources, and upload historical documentation.

---

## Phase 3: Media Gallery & Digital Publications

### Objectives:
- Enable media uploads, photographic galleries, and academic monographs/PDF downloads.

### 1. Public Web (`apps/web`):
- **Endpoints**:
  - `GET /api/v1/gallery?published_only=true`
  - `GET /api/v1/publications?published_only=true`
- **Implementation**:
  - Create `apps/web/src/lib/api/gallery.api.ts` and `publications.api.ts`.
  - Connect `useGalleryContent` and `useBooksContent` in `useContent.ts`.
  - Verify `GalleryGrid.tsx`, `Lightbox.tsx`, and `BookCard.tsx` display backend-served media.

### 2. Admin Portal (`apps/admin`):
- **Endpoints**:
  - `POST /api/v1/media/upload` (File upload handling images and documents).
  - CRUD on `/api/v1/admin/gallery/items` and `/api/v1/admin/publications/items`.
- **Implementation**:
  - Integrate `FileUpload.tsx` in `apps/admin` to upload media to `apps/api/app/modules/media/`.
  - Wire `GalleryView.tsx` and `PublicationsView.tsx` form modals.

---

## Phase 4: Community Development Projects & Public Inquiries

### Objectives:
- Track community infrastructure milestones (water catchment, museum construction) and process public contact submissions.

### 1. Public Web (`apps/web`):
- **Endpoints**:
  - `GET /api/v1/projects?status=IN_PROGRESS`
  - `POST /api/v1/contacts` (Public contact & archive record submissions).
- **Implementation**:
  - Update `ContactForm.tsx` to submit messages via `POST /api/v1/contacts`.
  - Connect `useProjectsContent` in `useContent.ts` to live project funding and progress data.

### 2. Admin Portal (`apps/admin`):
- **Endpoints**:
  - `GET|PUT /api/v1/admin/contacts/items` (Reviewing and archiving messages).
  - `GET|POST|PUT|DELETE /api/v1/admin/projects/items` (Budget & progress percentage updates).
- **Implementation**:
  - Wire `ContactView.tsx` and `ProjectsView.tsx` with live query hooks.
  - Enable review status updates (`UNREAD` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`).

---

## Phase 5: Administration, User Management & Audit Logging

### Objectives:
- Implement role-based access control (Super Admin, Editor, Reviewer) and immutable activity auditing.

### Admin Portal (`apps/admin`):
- **Endpoints**:
  - `GET|POST|PUT|DELETE /api/v1/admin/users/items`
  - `GET /api/v1/admin/audit/logs`
  - `GET /api/v1/admin/dashboard/stats`
- **Implementation**:
  - Wire `UsersView.tsx` to real user invite, suspension, and role-assignment endpoints.
  - Connect `DashboardView.tsx` stats counters to backend SQL aggregates.
  - Stream live administrative audit trails in `AuditLogsView.tsx`.

---

## Verification & Rollout Strategy

For each module phase:
1. **API Health & Tests**:
   - Run backend test suite: `cd apps/api && pytest`.
2. **Frontend Typecheck & Build**:
   - `cd apps/web && npm run typecheck && npm run build`
   - `cd apps/admin && npm run typecheck && npm run build`
3. **End-to-End Functional Test**:
   - Create a test item in `apps/admin` (e.g. news article or project update).
   - Publish it and verify immediate appearance on `apps/web`.
   - Disconnect backend and verify graceful fallback to static cache with zero client crashes.
