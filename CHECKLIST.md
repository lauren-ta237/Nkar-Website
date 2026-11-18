# Frontend Apps API Integration Checklist

This document tracks the phased integration of the **NKAR WOO LÀN** REST API (`apps/api`, port `8000`) into the frontend applications, prioritizing **`apps/admin`** (Administration Portal) followed by **`apps/web`** (Public Web Portal).

---

## Architecture & Integration Standards

- **Backend Base URL**: `http://localhost:8000/api/v1` (configurable via `VITE_API_URL`).
- **Data Fetching Layer**: TanStack React Query (`@tanstack/react-query`) with Axios HTTP client.
- **State & Auth**:
  - JWT Access Token stored in memory / secure storage with auto-refresh via interceptor.
  - Role-Based Access Control (RBAC): `super_admin`, `content_editor`, `content_reviewer`.
- **Media Upload Pipeline**: Streaming multipart upload directly through backend to Cloudinary (`/api/v1/media/upload`).
- **Pagination Standard**: Page index starts at `1`, standardized `PageMeta` (`total_items`, `total_pages`, `has_next`, `has_prev`).

---

## Phase 1: `apps/admin` (Administration Portal) Integration

### 1.1 Environment, Axios Client & Auth Baseline
- [x] **Configure Environment Variables**:
  - Ensure `apps/admin/.env` defines `VITE_API_URL=http://localhost:8000`.
  - Validate `apps/admin/src/lib/env.ts` normalizes and exposes `API_URL`.
- [x] **Axios Interceptors & Error Standardization**:
  - Verify `src/lib/api/config/axios-client.ts` baseURL targets `${VITE_API_URL}/api/v1`.
  - Attach Bearer token on all outgoing authenticated requests.
  - Intercept `401 Unauthorized` responses to clear invalid tokens and trigger session logout/re-authentication.
  - Standardize API error payload parsing (`response.data.detail`).
- [x] **Authentication & Session Flow**:
  - Wire `POST /api/v1/auth/login` in `src/lib/api/auth.api.ts` with real credentials.
  - Verify auth token persistence in `src/lib/auth-token.ts`.
  - Connect `AuthContext` and `useAdminStore` user state with current user profile (`GET /api/v1/users/me` or decoded token payload).
  - Wire Logout modal to trigger token purge and redirect to login state.

### 1.2 Dashboard & Overview Metrics
- [x] **Dashboard Stats (`src/components/modules/dashboard/`)**:
  - Replace static fallback values in `useDashboardStats` query with aggregated real live counts.
  - Aggregate metrics from backend endpoints (`/news`, `/events`, `/heritage`, `/gallery`, `/publications`, `/projects`, `/contacts`, `/users`).
- [x] **Pending Review Queue (`usePendingReviews`)**:
  - Query content with status `SUBMITTED` across News, Events, and Heritage:
    - `GET /api/v1/news/admin/items?status=submitted`
    - `GET /api/v1/events/admin/items?status=submitted`
    - `GET /api/v1/heritage/admin/items?status=submitted`
  - Wire one-click review actions (Approve / Reject / Publish) from the dashboard list.

### 1.3 Media Upload Pipeline (`src/components/common/FileUpload.tsx`)
- [x] **Cloudinary Upload Hook**:
  - Implement `useMediaUpload` mutation calling `POST /api/v1/media/upload`.
  - Handle progress state, payload formatting (`FormData` with `file`), and error alerts.
- [x] **Asset Management**:
  - Implement `useMediaDelete` mutation calling `DELETE /api/v1/media/destroy`.
  - Replace local object URL mocks with real Cloudinary URLs in image previews and form fields.

### 1.4 News & Articles Module (`src/components/modules/news/`)
- [x] **Read & Filter (`NewsView.tsx`)**:
  - Wire `useNewsList` to `GET /api/v1/news/admin/items` with search `q`, `category`, and `status`.
  - Wire server-side pagination with `PageParams` and `PageMeta`.
- [x] **Create & Edit (`NewsFormModal.tsx`)**:
  - Wire create mutation to `POST /api/v1/news/admin/items`.
  - Wire update mutation to `PUT /api/v1/news/admin/items/{id}`.
  - Connect cover image file picker to Cloudinary upload pipeline.
- [x] **Review & Workflow Actions (`ReviewActionModal.tsx`)**:
  - Wire workflow status updates: Submit (`PUT /.../submit`), Approve (`PUT /.../approve`), Reject (`PUT /.../reject`), Publish (`PUT /.../publish`), Archive (`PUT /.../archive`).
- [x] **Delete Action (`ConfirmModal.tsx`)**:
  - Wire delete mutation to `DELETE /api/v1/news/admin/items/{id}`.

### 1.5 Sovereign Events Module (`src/components/modules/events/`)
- [x] **Read & Filter (`EventsView.tsx`)**:
  - Wire to `GET /api/v1/events/admin/items` with search `q`, `upcoming`, and `status`.
- [x] **Create & Edit (`EventFormModal.tsx`)**:
  - Validate ISO 8601 `start_datetime` and `end_datetime`.
  - Wire to `POST /api/v1/events/admin/items` and `PUT /api/v1/events/admin/items/{id}`.
  - Connect event banner upload to Cloudinary.
- [x] **Lifecycle Actions**:
  - Wire workflow mutations (Submit, Approve, Publish, Cancel, Archive, Delete).

### 1.6 Cultural Heritage Module (`src/components/modules/heritage/`)
- [x] **Read & Filter (`HeritageView.tsx`)**:
  - Wire to `GET /api/v1/heritage/admin/items` with category filtering (`HeritageCategory`).
- [x] **Create & Edit (`HeritageFormModal.tsx`)**:
  - Wire to `POST /api/v1/heritage/admin/items` and `PUT /api/v1/heritage/admin/items/{id}`.
  - Support multi-image upload array (`images: string[]`) via Cloudinary.
- [x] **Workflow & Review**:
  - Wire review approval and publication transitions.

### 1.7 Leadership (Register of Reigns) Module (`src/components/modules/leadership/`)
- [x] **Read & Sequential Ordering (`LeadershipView.tsx`)**:
  - Wire to `GET /api/v1/leadership/admin/items` ensuring sequential reign ordering (`reign_order`).
- [x] **Create & Edit (`LeadershipFormModal.tsx`)**:
  - Wire to `POST /api/v1/leadership/admin/items` and `PUT /api/v1/leadership/admin/items/{id}`.
  - Connect royal portrait upload to Cloudinary (`image_url`).
- [x] **Reorder / Delete**:
  - Verify reign sequence integrity and deletion protection.

### 1.8 Gallery Module (`src/components/modules/gallery/`)
- [x] **Read & Filter (`GalleryView.tsx`)**:
  - Wire to `GET /api/v1/gallery/admin/items` with `media_type` and `category` filters.
- [x] **Create & Edit (`GalleryFormModal.tsx`)**:
  - Integrate image and video URL inputs or direct Cloudinary media upload.
  - Wire to `POST /api/v1/gallery/admin/items` and `PUT /api/v1/gallery/admin/items/{id}`.
- [x] **Batch Actions & Deletion**:
  - Connect item removal with optional asset deletion on Cloudinary.

### 1.9 Publications Module (`src/components/modules/publications/`)
- [x] **Read & Filter (`PublicationsView.tsx`)**:
  - Wire to `GET /api/v1/publications/admin/items` with search `q`.
- [x] **Create & Edit (`PublicationFormModal.tsx`)**:
  - Wire document file upload (`PDF`, `DOCX`) to Cloudinary document pipeline.
  - Connect cover image upload.
  - Wire to `POST /api/v1/publications/admin/items` and `PUT /api/v1/publications/admin/items/{id}`.
- [x] **Workflow Actions**:
  - Connect approval and publishing workflows.

### 1.10 Community Development Projects Module (`src/components/modules/projects/`)
- [x] **Read & Filter (`ProjectsView.tsx`)**:
  - Wire to `GET /api/v1/projects/admin/items` with `status_filter` and search `q`.
- [x] **Create & Edit (`ProjectFormModal.tsx`)**:
  - Form inputs for `target_budget_cfa`, `current_funding_cfa`, `progress_percentage`, and milestones.
  - Wire to `POST /api/v1/projects/admin/items` and `PUT /api/v1/projects/admin/items/{id}`.
- [x] **Milestone & Status Updates**:
  - Verify progress calculation and status transitions (`ongoing`, `completed`, `planned`, `on_hold`).

### 1.11 Contacts & Triage Module (`src/components/modules/contact/`)
- [x] **Read & Filter (`ContactView.tsx`)**:
  - Wire to `GET /api/v1/contacts/admin/items` with `status` filter (`UNREAD`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`).
- [x] **Status Triage & Internal Notes**:
  - Wire `PUT /api/v1/contacts/admin/items/{id}` for marking status and adding administrative triage notes.
  - Display unread message counter in notification badges.

### 1.12 Users & RBAC Module (`src/components/modules/users/`)
- [x] **Read Users (`UsersView.tsx`)**:
  - Wire to `GET /api/v1/users` (restricted to `SUPER_ADMIN`).
- [x] **Create & Manage Admins (`UserFormModal.tsx`)**:
  - Wire to `POST /api/v1/users` with role selection (`super_admin`, `content_editor`, `content_reviewer`).
  - Wire user status updates (Activate / Suspend) via `PUT /api/v1/users/{id}`.

### 1.13 Security Audit Logs (`src/components/modules/audit/`)
- [x] **Read Audit Logs (`AuditView.tsx`)**:
  - Wire to `GET /api/v1/audit` (restricted to `SUPER_ADMIN`).
  - Implement timeline filter by date range, action type, and user ID.
  - Inspect JSON diff inspector for state changes.

---

## Phase 2: `apps/web` (Public Web Portal) Integration

### 2.1 Configuration & API Client Setup
- [ ] Create `apps/web/src/lib/api/` client mirroring the standard axios configuration.
- [ ] Define TanStack Query provider in `apps/web/src/main.tsx` or `App.tsx`.
- [ ] Replace static mock imports from `apps/web/src/data/*` with dynamic Query hooks.

### 2.2 Public Pages Integration
- [ ] **Home Page (`apps/web/src/pages/Home.tsx`)**:
  - Wire latest published News (`/api/v1/news?page=1&page_size=3`).
  - Wire upcoming Events (`/api/v1/events?upcoming=true&page_size=2`).
  - Wire active Development Projects (`/api/v1/projects?status_filter=ongoing`).
  - Wire Gallery Teaser (`/api/v1/gallery?page=1&page_size=6`).
- [ ] **About & Culture Page (`apps/web/src/pages/About.tsx`)**:
  - Wire Cultural Heritage entries (`/api/v1/heritage`).
- [ ] **Leadership Page (`apps/web/src/pages/Leadership.tsx`)**:
  - Wire Register of Reigns (`/api/v1/leadership`).
- [ ] **News & Events Page (`apps/web/src/pages/NewsEvents.tsx`)**:
  - Wire paginated news list with category filter and search query.
  - Wire events list with upcoming/past toggle.
- [ ] **Gallery Page (`apps/web/src/pages/Gallery.tsx`)**:
  - Wire paginated gallery items with category and media type filters.
  - Wire Lightbox component to remote high-resolution URLs.
- [ ] **Publications Page (`apps/web/src/pages/Books.tsx`)**:
  - Wire books and research publications (`/api/v1/publications`).
  - Provide direct download links to Cloudinary PDF assets.
- [ ] **Projects Page (`apps/web/src/pages/Projects.tsx`)**:
  - Wire development initiatives with real progress bars and CFA budgets.
- [ ] **Contact Page (`apps/web/src/pages/Contact.tsx`)**:
  - Connect public contact form to `POST /api/v1/contacts`.
  - Handle submission success feedback and validation errors.

---

## Phase 3: End-to-End Validation & Verification
- [ ] **Authentication & Security**:
  - Verify protected admin routes reject unauthorized or expired tokens.
  - Verify RBAC restricts `SUPER_ADMIN` actions (Users, Audit logs) from editors.
- [ ] **End-to-End Content Lifecycle**:
  - Create draft article in Admin -> Submit for Review -> Reviewer Approves -> Publish -> Verify immediate appearance on Public Web portal.
- [ ] **Media Pipeline Test**:
  - Upload authentic photo from Admin -> Verify Cloudinary CDN URL storage in database -> Verify rendering on Web portal with responsive layout.
- [ ] **Build & Typecheck**:
  - `npm run typecheck` passes in both `apps/admin` and `apps/web`.
  - `npm run build` succeeds without bundle errors.
