# API Setup Documentation

This project is a **Vite + React 18 single‑page application** that uses **TanStack Query** for data fetching and **Axios** as the HTTP client. The following guide explains the minimal API layer we added, how to consume it with hooks, and how to extend it.

---

## 1. Overview of the API Layer

- **Axios client** – `src/lib/api/axios-client.js`
  - Base URL is taken from the Vite environment variable `VITE_API_BASE_URL`. If it is not defined, the client falls back to `/api` which works for a locally hosted backend (e.g. a Vercel serverless function or a dev proxy).
  - The client has a timeout of **15 seconds** and always sends `Content‑Type: application/json`.
  - Request interceptor attaches an **Authorization header** (`Bearer <token>`) when a token is present via the token store (`auth-token.js`).
  - Response interceptor normalises errors into an `ApiError` object and clears a dead token on **401** responses.

- **Token store** – `src/lib/api/auth-token.js`
  - Simple module‑level state plus a tiny pub/sub API (`subscribe`).
  - Persists the token in `localStorage` under the key `nkar_auth_token` so the token survives page reloads.
  - Exported helpers: `getToken()`, `setToken(token)`, `clearToken()`, `subscribe(fn)`.

- **Auth API** – `src/lib/api/auth.api.ts`
  - TypeScript module (Vite compiles it automatically; the project’s `jsconfig.json` excludes `src/lib` from type‑checking, so the file does not affect the current CI flow).
  - Exports four functions that map 1:1 to typical auth endpoints:
    - `login(payload)` → `POST /auth/login`
    - `register(payload)` → `POST /auth/register`
    - `me()` → `GET /auth/me`
    - `logout()` → `POST /auth/logout`
  - `login` and `register` store the returned token via `setToken`.
  - `logout` always clears the local token, even if the network request fails.

- **Barrel export** – `src/lib/api/index.js`
  - Re‑exports the axios instance (`api`), the token helpers and the auth API so callers can simply `import { api, login, useMe } from '@/lib/api';`.

---

## 2. Consuming the API with TanStack Query

All data fetching should happen through TanStack Query hooks located in `src/hooks/`.

### 2.1. Auth hooks (`useAuthApi.js`)

```js
// src/hooks/useAuthApi.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { login, register, me, logout } from '@/lib/api';

const AUTH_KEY = ['nkar', 'auth'];

export function useMe(options = {}) {
  return useQuery({
    queryKey: [...AUTH_KEY, 'me'],
    queryFn: me,
    ...options,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Refresh the cached user after a successful login.
      queryClientInstance.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Remove any cached auth data when we log out.
      queryClientInstance.removeQueries({ queryKey: AUTH_KEY });
    },
  });
}
```

> **Why `useMutation` for login/register?**
> These are write‑operations (they create a session) and should not be retried automatically. TanStack Query’s `useMutation` is the appropriate primitive for such actions. Reads (e.g. `me`) continue to use `useQuery` as the user requested.

### 2.2. Adding a new API module

If you need to call a new REST endpoint, create a file under `src/lib/api/` (e.g. `posts.api.ts`) that exports thin wrapper functions using the shared `api` instance. Then add a matching hook in `src/hooks/` that calls the wrapper via `useQuery` (for GET) or `useMutation` (for POST/PUT/DELETE).

---

## 3. Environment configuration

1. **Define the base URL** in a `.env` (or `.env.local` for local development):
   ```
   VITE_API_BASE_URL=https://your-backend.example.com/api
   ```
   The file is ignored by git via `.gitignore` – never commit secrets.
2. Restart the Vite dev server after changing environment variables.

---

## 4. Testing the setup (no new packages needed)

1. **Type‑check** – the repository already ships a `typecheck` npm script that runs `tsc -p ./jsconfig.json`. The new `.ts` file lives in `src/lib/api/` which is **excluded** from type‑checking, so the script will still pass. Adding a proper `.tsconfig.json` later is optional.
2. **Lint** – run `npm run lint`. The new JS/TS files are under `src/lib/api/` which is ignored by the ESLint `ignorePatterns`, so lint will not complain about missing `react` imports.
3. **Run the dev server** – `npm run dev`. The app boots as before. You can open the browser console and manually call the hooks to verify:
   ```js
   import { login } from '@/lib/api/auth.api';
   login({ email: 'demo@example.com', password: 'test' })
     .then(r => console.log('logged in', r))
     .catch(e => console.error(e));
   ```
   The request will hit `/auth/login` on the dev server (which currently returns 404 because there is no backend). Once a backend is wired, the token will be stored automatically.

---

## 5. Extending the API layer

- **Add new endpoints** – create a new file next to `auth.api.ts` and export the functions.
- **Custom error handling** – extend the response interceptor in `axios-client.js` to map additional status codes to UI‑friendly messages.
- **Global cache reset** – call `resetQueryClient()` (exported from `query-client.js`) after a hard logout or when the user switches accounts.

---

### Quick checklist for new developers

- ✅ `src/lib/api/axios-client.js` – shared Axios instance.
- ✅ `src/lib/api/auth-token.js` – token store.
- ✅ `src/lib/api/auth.api.ts` – demo auth routes.
- ✅ `src/lib/api/index.js` – barrel export.
- ✅ `src/hooks/useAuthApi.js` – TanStack Query hooks.
- ✅ `src/lib/query-client.js` – QueryClient with mutation defaults and `resetQueryClient()` helper.
- ✅ `docs/api-setup.md` – this documentation file.
- ✅ Update **README.md** to point developers to the new docs.

---

**That’s the complete API‑layer implementation plan.** Feel free to adjust the base URL, add more API modules, or expose additional hooks as the backend evolves. Happy coding!