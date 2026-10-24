# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nkar Woo Land** — a Vite + React 18 single-page application for the Nkar village heritage archive in the Cameroon Grassfields. Client-side routing via React Router v7. All content is currently static (shipped in `src/data/`) and wrapped in TanStack Query to simulate async loading states. No backend exists yet.

- **Branch:** `feat/ui-client` (same as `main`)
- **Remote:** `https://github.com/lauren-ta237/Nkar-Website`
- **Working tree:** clean

---

## Commands (run from `apps/web`)

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Vite, usually `http://localhost:5173`) |
| Production build | `npm run build` (outputs to `dist/`) |
| Preview build | `npm run preview` |
| Lint | `npm run lint` (ESLint 9 flat config, `--quiet`) |
| Lint + fix | `npm run lint:fix` |
| Type-check | `npm run typecheck` (runs `tsc -p ./jsconfig.json`) |

> ⚠️ The `typecheck` script currently emits many pre-existing errors in UI components (JSX `src` prop mismatches, missing `htmlFor` on `label`, etc.). They are unrelated to new code — do not block on them.

---

## Architecture & Key Files

### Entry & Providers (`src/`)
| File | Purpose |
|------|---------|
| `main.jsx` | `ReactDOM.createRoot(...).render(<App />)` |
| `App.jsx` | Provider tree: `AuthProvider` → `QueryClientProvider` → `BrowserRouter` → `AuthenticatedApp` + `Toaster` |
| `src/lib/query-client.js` | **TanStack Query client** instance (`queryClientInstance`) with `refetchOnWindowFocus: false`, `retry: 1`, `mutations.retry: false`. Exports `resetQueryClient()`. |
| `src/lib/AuthContext.jsx` | **Stub auth context** — placeholder state/handlers (`checkAppState`, `checkUserAuth`, `logout`, `navigateToLogin`). No real auth. |
| `src/lib/authReturnTo.js` | Security utility `safeReturnTo()` for validating `?returnTo=` redirects. |

### Routing (`src/App.jsx`)
All public routes are nested under `<SiteLayout>` (header + `<Outlet>` + footer):
- `/` `Home`, `/about`, `/leadership`, `/news`, `/gallery`, `/books`, `/projects`, `/contact`, `/search`, `*` `PageNotFound`

Auth pages (`Login`, `Register`, `ForgetPassword`, `ResetPassword`, `OAuthConsent`) exist but are **not wired** into the router.

### Data Layer
| File | Role |
|------|------|
| `src/data/*.js` | 7 static content modules (`site`, `culture`, `news`, `projects`, `books`, `gallery`, `images`) |
| `src/hooks/useContent.js` | `useQuery` wrappers over the data modules with a 240 ms artificial `load()` delay. Query keys: `['nkar', '<section>']`. |
| `src/lib/api/auth.api.ts` | **New** — TanStack Query hooks for auth: `useMe`, `useLogin`, `useRegister`, `useLogout`. Uses `useMutation` for writes. Co-located with the auth API functions. |

### API Layer (`src/lib/api/`) — **Newly Added**
| File | Purpose |
|------|---------|
| `axios-client.js` | Shared `axios` instance. Base URL = `VITE_API_BASE_URL` or `/api` fallback. 15s timeout. Request interceptor attaches `Bearer` token from `auth-token.js`. Response interceptor normalises errors & clears token on 401. |
| `auth-token.js` | Minimal token store: memory + `localStorage` (`nkar_auth_token`), pub/sub via `subscribe(fn)`. Exports `getToken`, `setToken`, `clearToken`, `subscribe`. |
| `auth.api.ts` | Demo auth endpoints (`login`, `register`, `me`, `logout`) using the shared axios instance. Returns TypeScript-typed promises. |
| `index.js` | Barrel export: `export { api } from './axios-client'; export * from './auth-token'; export * from './auth.api';` |

Import path pattern (all from the barrel):
```js
import { api, login, useMe, useLogin, useRegister, useLogout } from '@/lib/api';
```

### UI / Styling
- **Tailwind CSS 3.4** with custom palette (`forest`, `gold`, `clay`, `cream`, `ivory`, `obsidian`) and a `dt: 880px` desktop breakpoint.
- **shadcn-style** primitives in `src/components/ui/` (50+ components). `components.json` sets `"style": "new-york"`, `"rsc": false`, `"tsx": false`.
- **Lucide React** icons, **Framer Motion** animations.
- Path alias `@/` → `src/` (configured in both `vite.config.js` and `jsconfig.json`).

### Code Conventions
- **Language:** Plain JS/JSX (no `.ts`/`.tsx` anywhere). `jsconfig.json` has `checkJs: true` but **excludes** `src/lib`, `src/components/ui`, `src/api` from type-checking.
- **ESLint 9 flat config** — lints `src/components/**` and `src/pages/**`, **ignores** `src/lib/**` and `src/components/ui/**`. Rules of note: `unused-imports/no-unused-imports: error`, `react/prop-types: off`, `react/react-in-jsx-scope: off`.
- **Imports:** one per line, grouped by external → `@/` alias → relative. Mixed quote styles (single in app code, double in shadcn UI).
- **Components:** default-exported function components, destructured props with defaults. Accessibility attributes (`aria-*`, `role`) used liberally.
- **No `"use client"`** — this is an SPA, not Next.js. The directives in `src/components/ui/` are inert leftovers from shadcn generation.

---

## Documentation
- `README.md` — generic setup/run/publish guide + link to `docs/api-setup.md`
- `AGENTS.md` — agent working notes (points to `README.md`, lists key files)
- `docs/api-setup.md` — full API layer documentation (client, token store, hooks, env config, testing, extension)

---

## Environment
Create `.env.local` (git-ignored) for local overrides:
```
VITE_API_BASE_URL=https://your-backend.example.com/api
```
Restart the dev server after changes.

---

## Git / Commit Conventions
- Conventional commits: `feat(chores): ...`, `fix: ...`, etc.
- Commit attribution lines are added automatically by the harness:
  ```
  Co-Authored-By: Claude Code <noreply@anthropic.com>
  ```
- PR descriptions end with:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

---

## Extending the API
1. Add a new file under `src/lib/api/` (e.g. `posts.api.ts`) exporting thin wrapper functions using `api` from `axios-client.js` **and** the corresponding TanStack Query hooks (`useQuery` for reads, `useMutation` for writes) co-located in the same file.
2. Re-export from `src/lib/api/index.js` if desired.