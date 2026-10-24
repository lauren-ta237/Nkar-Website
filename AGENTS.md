# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a monorepo-style root containing a single application:

```
Nkar-Website/
├── .git/
└── apps/
    └── web/          # ← The actual Vite + React 18 application
```

All development happens inside **`apps/web/`**. Run all commands from that directory.

---

## Quick Start

```bash
cd apps/web
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Primary Documentation

- **`apps/web/CLAUDE.md`** — comprehensive guidance for this project (commands, architecture, conventions, API layer, etc.)
- **`apps/web/README.md`** — generic setup/run/publish guide
- **`apps/web/AGENTS.md`** — agent working notes
- **`apps/web/docs/api-setup.md`** — API layer documentation

---

## Key Facts

- **Framework:** Vite + React 18 (NOT Next.js)
- **Routing:** React Router v7 (client-side)
- **State/Data:** TanStack Query v5 (already configured)
- **HTTP Client:** Axios (already installed)
- **Styling:** Tailwind CSS + shadcn-style UI components
- **Language:** Plain JS/JSX (no TypeScript files)
- **Package Manager:** npm (no lock file in repo)
- **No backend/API routes exist** — the app is frontend-only with static content

---

## Git Conventions

- Branch: `feat/ui-client` (tracks `origin/feat/ui-client`); `main` is at same commit
- Conventional commit messages: `feat(chores): ...`, `fix: ...`, etc.
- Commit attribution is auto-added:
  ```
  Co-Authored-By: Claude Code <noreply@anthropic.com>
  ```
- PR descriptions end with:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

---

## Working in This Repo

1. **Always `cd apps/web` first** — all npm scripts, configs, and source are there.
2. Read `apps/web/CLAUDE.md` for the complete picture.
3. The repo root has no build tooling, no `package.json`, no `node_modules`.