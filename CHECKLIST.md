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
- [ ] **News & Announcements** (`src/lib/api/news.api.ts`):
  - [ ] `fetchNewsList(params?: { category?, search?, limit?, skip? })`
  - [ ] `fetchNewsBySlug(slug: string)`
  - [ ] Hooks: `useNewsList`, `useNewsDetail`
- [ ] **Events & Calendar** (`src/lib/api/events.api.ts`):
  - [ ] `fetchEventsList(params?: { status?, search? })`
  - [ ] `fetchEventBySlug(slug: string)`
  - [ ] Hooks: `useEventsList`, `useEventDetail`
- [ ] **Cultural Heritage** (`src/lib/api/heritage.api.ts`):
  - [ ] `fetchHeritageList(params?: { category? })`
  - [ ] `fetchHeritageBySlug(slug: string)`
  - [ ] Hooks: `useHeritageList`, `useHeritageDetail`
- [ ] **Royal Leadership** (`src/lib/api/leadership.api.ts`):
  - [ ] `fetchLeadershipList()`
  - [ ] Hook: `useLeadershipList`
- [ ] **Gallery & Media** (`src/lib/api/gallery.api.ts`):
  - [ ] `fetchGalleryList(params?: { media_type?, category? })`
  - [ ] Hook: `useGalleryList`
- [ ] **Development Projects** (`src/lib/api/projects.api.ts`):
  - [ ] `fetchProjectsList(params?: { status? })`
  - [ ] Hook: `useProjectsList`
- [ ] **Publications & Documents** (`src/lib/api/publications.api.ts`):
  - [ ] `fetchPublicationsList()`
  - [ ] Hook: `usePublicationsList`
- [ ] **Citizen Contact & Inquiries** (`src/lib/api/contacts.api.ts`):
  - [ ] `submitContactForm(payload: ContactCreate)`
  - [ ] Mutation Hook: `useSubmitContact`

---

## 3. Page & Component Integration
- [ ] **Home Page (`apps/web/src/pages/`)**:
  - [ ] Connect Featured News & Bulletins
  - [ ] Connect Upcoming Events
  - [ ] Connect Highlights / Gallery
- [ ] **News Page & News Article Detail**:
  - [ ] Wire `useNewsList` with category filter
  - [ ] Wire `useNewsDetail` by slug
- [ ] **Events Page & Event Detail**:
  - [ ] Wire `useEventsList`
  - [ ] Wire `useEventDetail`
- [ ] **Heritage Page & Heritage Detail**:
  - [ ] Wire `useHeritageList`
  - [ ] Wire `useHeritageDetail`
- [ ] **Leadership / Royalty Page**:
  - [ ] Wire `useLeadershipList`
- [ ] **Gallery Page**:
  - [ ] Wire `useGalleryList` with filter tabs
- [ ] **Projects Page**:
  - [ ] Wire `useProjectsList` with status filters
- [ ] **Contact Page**:
  - [ ] Connect contact form submission to `useSubmitContact` with toast feedback

---

## 4. Verification & QA
- [ ] Verify zero TypeScript errors (`npm run typecheck` or `npm run build`)
- [ ] Verify error states and empty states across pages
- [ ] End-to-end audit with live backend running
