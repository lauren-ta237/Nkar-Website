# Nkar Web Client Integration Checklist

This checklist tracks the step-by-step progress of connecting `apps/web` to the live FastAPI backend (`apps/api`), replacing mock/dummy static data with TanStack Query hooks, and verifying full end-to-end functionality.

---

## 1. Environment & Client Setup
- [x] Create `apps/web/.env` with `VITE_ENV=development` and `VITE_API_URL=http://localhost:8000`
- [x] Verify `apps/web/src/lib/env.ts` loads environment configuration cleanly
- [x] Verify `apps/web/src/lib/api/config/axios-client.ts` Axios instance pointing to `${env.API_URL}/api/v1`
- [x] Test production build of `apps/web` (`npm run build`) - Passed

---

## 2. API Services & TanStack Query Hooks Setup (`apps/web/src/lib/api/`)
- [x] **News & Announcements** (`src/lib/api/news.api.ts`):
  - [x] `fetchNewsList(params?: { category?, search?, limit?, skip? })`
  - [x] `fetchNewsBySlug(slug: string)`
  - [x] Hooks: `useNewsList`, `useNewsDetail`
- [x] **Events & Calendar** (`src/lib/api/events.api.ts`):
  - [x] `fetchEventsList(params?: { search?, limit?, skip? })`
  - [x] `fetchEventBySlug(slug: string)`
  - [x] Hooks: `useEventsList`, `useEventDetail`
- [x] **Cultural Heritage** (`src/lib/api/heritage.api.ts`):
  - [x] `fetchHeritageList(category?: string)`
  - [x] `fetchHeritageBySlug(slug: string)`
  - [x] Hooks: `useHeritageList`, `useHeritageDetail`
- [x] **Royal Leadership** (`src/lib/api/leadership.api.ts`):
  - [x] `fetchLeadershipList()`
  - [x] Hook: `useLeadershipList`
- [x] **Gallery & Media** (`src/lib/api/gallery.api.ts`):
  - [x] `fetchGalleryList(params?: { media_type?, category? })`
  - [x] Hook: `useGalleryList`
- [x] **Development Projects** (`src/lib/api/projects.api.ts`):
  - [x] `fetchProjectsList(status?: string)`
  - [x] Hook: `useProjectsList`
- [x] **Publications & Documents** (`src/lib/api/publications.api.ts`):
  - [x] `fetchPublicationsList()`
  - [x] Hook: `usePublicationsList`
- [x] **Citizen Contact & Inquiries** (`src/lib/api/contacts.api.ts`):
  - [x] `submitContactForm(payload: ContactCreatePayload)`
  - [x] Mutation Hook: `useSubmitContact`

---

## 3. Page & Component Integration
- [x] **Home Page (`apps/web/src/pages/Home.tsx`)**:
  - [x] Connect Featured News & Bulletins
  - [x] Connect Upcoming Events
  - [x] Connect Highlights / Gallery
  - [x] Connect Projects Preview
- [x] **News & Events Page (`apps/web/src/pages/NewsEvents.tsx`)**:
  - [x] Wire `useNews` with live backend query and category filter
  - [x] Wire `useEvents` for upcoming & past community events
- [x] **About & Cultural Heritage (`apps/web/src/pages/About.tsx`)**:
  - [x] Wire `useAboutContent` connecting to live `fetchHeritageList`
- [x] **Leadership / Royalty Page (`apps/web/src/pages/Leadership.tsx`)**:
  - [x] Wire `useLeadershipContent` connecting to live `fetchLeadershipList`
- [x] **Gallery Page (`apps/web/src/pages/Gallery.tsx`)**:
  - [x] Wire `useGallery` connecting to live `fetchGalleryList`
- [x] **Projects Page (`apps/web/src/pages/Projects.tsx`)**:
  - [x] Wire `useProjects` connecting to live `fetchProjectsList` with ongoing/planned/completed counters
- [x] **Books & Publications Page (`apps/web/src/pages/Books.tsx`)**:
  - [x] Wire `useBooks` connecting to live `fetchPublicationsList`
- [x] **Search Page (`apps/web/src/pages/Search.tsx`)**:
  - [x] Connect live search indexer across all live modules (`useSearchIndex`, `searchContent`)
- [x] **Contact Page (`apps/web/src/pages/Contact.tsx` & `ContactForm.tsx`)**:
  - [x] Connect contact form submission to `useSubmitContact` mutation
  - [x] Added `react-hot-toast` notifications on message delivery

---

## 4. Pure API Refactoring & Dummy Data Purge
- [x] Implemented dedicated backend search endpoint: `GET /api/v1/search` in `apps/api/app/modules/search/`
- [x] Created `src/types/api.types.ts` strictly mirroring FastAPI schemas
- [x] Directly wired pages and components to `src/lib/api/<entity>.api.ts`
- [x] Completely deleted transitional `src/hooks/useContent.ts`
- [x] Completely deleted `src/components/SampleBadge.tsx`
- [x] Completely purged dummy mock data files: `news.ts`, `projects.ts`, `books.ts`, `gallery.ts`
- [x] Updated all card components (`NewsCard`, `EventCard`, `ProjectCard`, `BookCard`, `GalleryGrid`, `LeadershipRecord`) to backend entity types

---

## 5. Dynamic Detail Pages & SEO Permalinks
- [x] Updated backend endpoints to resolve both UUID and slug:
  - [x] `GET /api/v1/news/{identifier}` (by slug or UUID with views increment and session refresh)
  - [x] `GET /api/v1/events/{identifier}` (by slug or UUID)
  - [x] `GET /api/v1/heritage/{identifier}` (by slug or UUID)
  - [x] `GET /api/v1/projects/{identifier}` (by ID)
- [x] Updated `search_public_portal` URLs to point to direct permalinks (`/news/{slug}`, `/events/{slug}`, `/heritage/{slug}`, `/projects/{id}`)
- [x] Implemented `fetchProjectById` & `useProjectDetail` in `apps/web/src/lib/api/projects.api.ts`
- [x] Created `apps/web/src/pages/NewsDetail.tsx` (`/news/:slug`)
- [x] Created `apps/web/src/pages/EventDetail.tsx` (`/events/:slug`)
- [x] Created `apps/web/src/pages/HeritageDetail.tsx` (`/heritage/:slug`)
- [x] Created `apps/web/src/pages/ProjectDetail.tsx` (`/projects/:id`)
- [x] Registered detail routes in `apps/web/src/App.tsx`
- [x] Updated `NewsCard.tsx`, `EventCard.tsx`, `ProjectCard.tsx`, and `AboutSection.tsx` with links to detail pages

---

## 6. Verification & QA
- [x] Production compilation of `apps/web`: `npm run build` completed with 0 errors
- [x] Production compilation of `apps/admin`: `npm run build` completed with 0 errors
- [x] All 24 backend tests passing in `apps/api`: `pytest tests/test_api.py` (24 passed)
