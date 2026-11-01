# Nkar Woo Land API

Express/TypeScript REST API at `/api/v1` for public heritage content and protected administrator workflows.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS`.
2. Install dependencies with `npm install`.
3. Apply migrations with `npm run migrate`.
4. Create the first administrator with `SEED_ADMIN_PASSWORD='use-a-strong-password' npm run seed`.
5. Start with `npm run dev`.

Swagger UI is available at `/docs`; the OpenAPI document is `/openapi.json`.

## API conventions

Responses use `{ data, meta }` on success and `{ error: { code, message, details } }` on failure. Public content endpoints only return `PUBLISHED` records. Content types are `news`, `events`, `heritage`, `leadership`, `gallery`, `publications`, and `projects`.

Authentication uses short-lived JWT access tokens and httpOnly refresh-token cookies. Administrator routes require a role; permissions are enforced in middleware and services. Content editors create/edit and submit drafts, reviewers approve/reject/publish, and super administrators have full access.

## Frontend integration

Set the frontend API base URL to `VITE_API_URL` (for example `http://localhost:4000/api/v1`). Use `POST /auth/login`, send `Authorization: Bearer <accessToken>` for protected requests, and call `POST /auth/refresh` when an access token expires. Public GET endpoints require no authentication.

## Testing

`npm run test` runs the Vitest/Supertest suite. Database integration tests require a PostgreSQL `DATABASE_URL`; unit-level route validation tests do not.
