# Plan: Convert Nkar Woo Land from JavaScript to TypeScript

## Context

This Vite + React 18 SPA currently uses **plain JavaScript/JSX** (~130 source files). Two files are already TypeScript (`src/lib/env.ts`, `src/lib/api/auth.api.ts`). The goal is a complete, type-safe migration while preserving all existing functionality.

**Why now:** The new API layer (`auth.api.ts`) was written in TypeScript and works. The project has `@types/react`, `@types/node`, and `typescript` already installed. Converting now avoids technical debt and enables type-safe refactoring as the backend is wired up.

---

## Recommended Approach

**Incremental, bottom-up conversion** — start with config, then core libs, then hooks/data, then pages/components, finally the shadcn UI library. Each phase runs `npm run typecheck` to catch regressions early.

---

## Phase 1: Configuration & Tooling — **COMPLETED**

| Task | Status |
|------|--------|
| Create `tsconfig.json` (strict mode, bundler resolution, path aliases) | ✅ Done |
| Update `components.json` — `"tsx": true` | ✅ Done |
| Update `package.json` `typecheck` script → `tsc -p ./tsconfig.json` | ✅ Done |
| Delete `jsconfig.json` | ✅ Done |

**Remaining optional:** Rename `vite.config.js` → `vite.config.ts`, `tailwind.config.js` → `tailwind.config.ts` (low priority, current JS configs work fine).

---

## Phase 2: Core Lib & Types — **PARTIAL** (4 of 8 files)

| File | Target | Status |
|------|--------|--------|
| `utils.js` → `utils.ts` | Type `cn(...inputs: ClassValue[])` | ✅ Done |
| `format.js` → `format.ts` | Add parameter/return types using `date-fns` types | ✅ Done |
| `authReturnTo.js` → `authReturnTo.ts` | Type return value as `string` | ✅ Done |
| `env.ts` | Already TS — verify compiles | ✅ Done |
| `query-client.js` → `query-client.ts` | Add `QueryClient` types, export `resetQueryClient` | ⬜ Pending |
| `AuthContext.jsx` → `AuthContext.tsx` | Define `AuthContextType` interface, type `user`, `isAuthenticated`, handlers | ⬜ Pending |
| `PageNotFound.jsx` → `PageNotFound.tsx` | Simple FC | ⬜ Pending |
| `image-helpers.js` → `image-helpers.ts` | Type all exported functions | ⬜ Pending |
| `api/` config & token | Convert `axios-client.js`, `auth-token.js`, add barrel `index.ts` | ⬜ Pending |

**Action:** Install missing `@types` packages first:
```bash
npm i -D @types/lodash @types/canvas-confetti @types/html2canvas @types/jspdf @types/three @types/react-day-picker
```

---

## Phase 3: Hooks & Data — **PARTIAL** (4 of 10 files)

| File | Target | Status |
|------|--------|--------|
| `useContent.js` → `useContent.ts` | Type query keys, return types for each `useQuery` | ✅ Done |
| `use-mobile.jsx` → `use-mobile.ts` | `useMediaQuery` hook, return `boolean` | ✅ Done |
| `use-size.jsx` → `use-size.ts` | Window size hook, return `{ width, height }` | ✅ Done |
| `site.js` → `site.ts` | Export interfaces (`SiteConfig`, `NavLink`, etc.) + typed const | ✅ Done |
| `culture.js` → `culture.ts` | Export interfaces for about sections, traditions, timeline, leadership | ⬜ Pending |
| `news.js` → `news.ts` | Export interfaces `NewsItem`, `EventItem` + typed arrays | ⬜ Pending |
| `projects.js` → `projects.ts` | Export interface `Project` + typed array | ⬜ Pending |
| `books.js` → `books.ts` | Export interface `Book` + typed array | ⬜ Pending |
| `gallery.js` → `gallery.ts` | Export interface `GalleryItem`, `galleryCategories` | ⬜ Pending |
| `images.js` → `images.ts` | Export typed `images` record + `photoNote` | ⬜ Pending |
| `utils/index.jsx` → `index.ts` | Simple `createPageUrl(pageName: string): string` | ✅ Done |

---

## Phase 4: Pages & App Components — **NOT STARTED** (51 files)

### 4.1 Pages (`src/pages/`) — 13 files
All are React components → rename `.jsx` → `.tsx`. Add `FC` or implicit return typing. Type props destructured from data hooks.

| File | Key Types Needed |
|------|------------------|
| `Home.tsx` | `useNews`, `useEvents`, `useProjects`, `useBooks`, `useGallery` |
| `About.tsx` | `useAboutContent` |
| `Leadership.tsx` | `useLeadershipContent` |
| `NewsEvents.tsx` | `useNews`, `useEvents` |
| `Gallery.tsx` | `useGallery` |
| `Books.tsx` | `useBooks` |
| `Projects.tsx` | `useProjects` |
| `Contact.tsx` | `site.contactTopics` |
| `Search.tsx` | `useSearchIndex`, `searchTypes`, `searchContent` |
| Auth pages (`Login`, `Register`, `ForgetPassword`, `ResetPassword`, `OAuthConsent`) | Form types, `safeReturnTo()` |

### 4.2 Root Components (`src/components/`) — 27 files
Add `interface Props` for each. Use data types from `src/data/` imports. Type event handlers.

Key files: `SiteLayout`, `SiteHeader`, `SiteFooter`, `PageHero`, `SectionHeading`, `ProjectCard`, `NewsCard`, `EventCard`, `BookCard`, `GalleryGrid`, `Lightbox`, `Timeline`, `PillarCard`, `IconTile`, `SampleBadge`, `QuickFacts`, `ContributeBand`, `ContactForm`, `SearchBar`, `FilterChips`, `LoadingState`, `Reveal`, `Ornament`, `HeritageBorder`, `ContentNotice`, `ScrollToTop`, `GoogleIcon`, `ProtectedRoute`, `UserNotRegisteredError`, `AuthLayout`, `LeadershipRecord`.

### 4.3 Subfolder Components — 11 files
- `home/`: `HeroSection`, `IntroSection`, `PillarsSection`, `PatternStrip`, `NewsEventsSection`, `GalleryTeaser`, `ProjectsPreview`
- `about/`: `AboutSection`, `TraditionsGrid`
- `leadership/`: `RolesGrid`, `CeremonialYear`

---

## Phase 5: Shadcn UI Components — **DEFERRED** (53 files)

**Strategy change:** The existing hand-typed `.jsx` components in `src/components/ui/` were deleted (see git status). Instead of manual conversion, the plan is:

1. Delete any remaining `src/components/ui/` files
2. Run `npx shadcn@latest init --baseui` to regenerate TypeScript-native components
3. Re-add any project-specific customizations (style: `base-nova`, custom aliases)

> **Note:** This step is marked `[PENDING - run manually]` because `npx shadcn` hits a lockfile conflict in this environment. Execute during a later update pass when the lockfile is clean.

---

## Phase 6: API Layer — **NOT STARTED** (4 files)

| File | Status | Action |
|------|--------|--------|
| `axios-client.js` → `axios-client.ts` | ⬜ | Convert, type interceptors, fix `env.BASE_API_URL` reference |
| `auth-token.js` → `auth-token.ts` | ⬜ | Add `TokenStore` interface |
| `auth.api.ts` | ✅ TS | Verify strict mode compatibility |
| `index.js` → `index.ts` | ⬜ | Barrel export |

---

## Phase 7: ESLint & Tooling — **NOT STARTED**

### 7.1 Update `eslint.config.js`
```javascript
import typescriptEslint from 'typescript-eslint';

export default [
  ...typescriptEslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["src/components/ui/**/*"],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
    },
    plugins: { "@typescript-eslint": typescriptEslint.plugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  // ...existing react/react-hooks configs
];
```

### 7.2 Install:
```bash
npm i -D typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## Phase 8: Verification & Cleanup — **NOT STARTED**

| Check | Command |
|-------|---------|
| Type-check passes | `npm run typecheck` (zero errors) |
| Lint passes | `npm run lint` |
| Build succeeds | `npm run build` |
| Dev server runs | `npm run dev` |
| No `"use client"` left | `grep -r '"use client"' src/` → empty |
| All imports resolve | Check for missing `@types` |

---

## File Structure After Conversion (Target)

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── vite-env.d.ts
├── data/
│   ├── site.ts
│   ├── culture.ts
│   ├── news.ts
│   ├── projects.ts
│   ├── books.ts
│   ├── gallery.ts
│   └── images.ts
├── hooks/
│   ├── useContent.ts
│   ├── use-mobile.ts
│   └── use-size.ts
├── lib/
│   ├── query-client.ts
│   ├── AuthContext.tsx
│   ├── authReturnTo.ts
│   ├── format.ts
│   ├── utils.ts
│   ├── image-helpers.ts
│   ├── PageNotFound.tsx
│   ├── env.ts
│   └── api/
│       ├── axios-client.ts
│       ├── auth-token.ts
│       ├── auth.api.ts
│       └── index.ts
├── utils/
│   └── index.ts
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Leadership.tsx
│   ├── NewsEvents.tsx
│   ├── Gallery.tsx
│   ├── Books.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Search.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgetPassword.tsx
│   ├── ResetPassword.tsx
│   └── OAuthConsent.tsx
├── components/
│   ├── SiteLayout.tsx
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── PageHero.tsx
│   ├── SectionHeading.tsx
│   ├── ProjectCard.tsx
│   ├── NewsCard.tsx
│   ├── EventCard.tsx
│   ├── BookCard.tsx
│   ├── GalleryGrid.tsx
│   ├── Lightbox.tsx
│   ├── Timeline.tsx
│   ├── PillarCard.tsx
│   ├── IconTile.tsx
│   ├── SampleBadge.tsx
│   ├── QuickFacts.tsx
│   ├── ContributeBand.tsx
│   ├── ContactForm.tsx
│   ├── SearchBar.tsx
│   ├── FilterChips.tsx
│   ├── LoadingState.tsx
│   ├── Reveal.tsx
│   ├── Ornament.tsx
│   ├── HeritageBorder.tsx
│   ├── ContentNotice.tsx
│   ├── ScrollToTop.tsx
│   ├── GoogleIcon.tsx
│   ├── ProtectedRoute.tsx
│   ├── UserNotRegisteredError.tsx
│   ├── AuthLayout.tsx
│   ├── LeadershipRecord.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── IntroSection.tsx
│   │   ├── PillarsSection.tsx
│   │   ├── PatternStrip.tsx
│   │   ├── NewsEventsSection.tsx
│   │   ├── GalleryTeaser.tsx
│   │   └── ProjectsPreview.tsx
│   ├── about/
│   │   ├── AboutSection.tsx
│   │   └── TraditionsGrid.tsx
│   ├── leadership/
│   │   ├── RolesGrid.tsx
│   │   └── CeremonialYear.tsx
│   └── ui/                # 53 files from shadcn init --baseui
│       ├── *.tsx
```

---

## Verification Checklist

- [x] `tsconfig.json` created with strict mode
- [x] `jsconfig.json` deleted
- [x] `components.json` has `"tsx": true`
- [x] `package.json` has `typecheck: tsc -p ./tsconfig.json`
- [ ] Missing `@types` packages installed
- [ ] All `.js/.jsx` files renamed to `.ts/.tsx`
- [ ] Analyze the new typescript files and setup types in @/types/...
- [ ] No `"use client"` directives remain
- [ ] `React.forwardRef` properly typed in UI components (after shadcn re-init)
- [ ] `cva` variants typed with `VariantProps` (after shadcn re-init)
- [ ] `Slot` components typed with `ComponentPropsWithoutRef` (after shadcn re-init)
- [ ] All data files export TypeScript interfaces
- [ ] All components have `Props` interfaces
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → success
- [ ] `npm run dev` → runs without errors

---

## Estimated Remaining Effort

| Phase | Files | Effort |
|-------|-------|--------|
| Core Lib (remaining 5) | 5 files | 2 hrs |
| Hooks & Data (remaining 6) | 6 files | 2 hrs |
| Pages & App Components | 51 files | 8 hrs |
| Shadcn UI (re-init) | 53 files | 1 hr (auto) + 2 hrs fixes |
| API Layer | 4 files | 1.5 hrs |
| ESLint & Verification | 2 configs + checks | 2 hrs |
| **Total Remaining** | **~119** | **~17.5 hrs** |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `forwardRef` typing breaks UI | Convert UI components incrementally; test each in Storybook or manual check |
| `cva` variant types complex | Start with `button.tsx` as reference pattern (auto-generated by shadcn) |
| Missing `@types` for deps | Install all 6 missing packages upfront |
| Strict mode too aggressive | Use `noUncheckedIndexedAccess` but allow `@ts-expect-error` temporarily for third-party props |
| Build breaks on dev server | Vite 8 (rolldown) handles TS natively — low risk |
| shadcn re-init loses customizations | Document customizations first; re-apply after init |

---

## Success Criteria

1. **Zero TypeScript errors** (`npm run typecheck`)
2. **Zero ESLint errors** (`npm run lint`)
3. **Production build succeeds** (`npm run build`)
4. **Dev server runs** (`npm run dev`)
5. **All existing functionality preserved** (manual smoke test of all routes)

---

## Next Immediate Steps

1. **Install missing `@types` packages** (enables Phase 2–3 typecheck)
2. **Complete Phase 2** (5 remaining lib files)
3. **Complete Phase 3** (6 remaining data files)
4. **Run `npm run typecheck`** — should pass with only UI/API errors remaining
5. **Phase 4** — convert pages & components (bulk work, but straightforward)
6. **Phase 6** — API layer
7. **Phase 5** — shadcn re-init (manual step)
8. **Phase 7–8** — ESLint, final verification