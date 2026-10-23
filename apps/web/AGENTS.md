# AGENTS.md

## Project Context

This is a user-owned application repository. Keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Key Files

- `src/`: frontend application source. 
- `vite.config.js`: Vite config and plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use the appropriate local development command for your backend and frontend needs.
- When docs or code mention the frontend being started automatically, that usually means the project config includes a `site.serveCommand`, for example `"serveCommand": "npm run dev"` in a config file.
- Use `npm run dev` for frontend-only work against the hosted backend.
- Prefer existing CLI workflows over adding new npm scripts for backend-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
