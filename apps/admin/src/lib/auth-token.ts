// auth-token.ts
//
// Minimal, dependency-free token store shared between the axios request
// interceptor and the (future) AuthContext.
//
// It is deliberately NOT a React context: the axios instance lives outside the
// component tree, so a context provider would create a circular dependency.
// Instead we keep module-level state plus a tiny pub/sub so the interceptor
// always reads the latest token, and a provider can subscribe to changes
// (e.g. to propagate logout to the whole app without re-rendering the client).

const STORAGE_KEY = "nkar_auth_token";

let _token: string | null = null;
const _subscribers = new Set<(token: string | null) => void>();

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Returns the current token (memory first, then localStorage).
 * Safe to call outside a browser (returns null).
 */
export function getToken(): string | null {
  if (_token) return _token;
  const stored = readStored();
  if (stored) _token = stored;
  return _token;
}

/**
 * Persist a token in memory and localStorage, then notify subscribers.
 * Pass null to clear it (logout / expired session).
 */
export function setToken(token: string | null): void {
  _token = token || null;
  if (typeof window !== "undefined") {
    try {
      if (token) window.localStorage.setItem(STORAGE_KEY, token);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable (private mode, quota) — memory still holds it.
    }
  }
  _subscribers.forEach((fn) => {
    try {
      fn(_token);
    } catch {
      /* swallow subscriber errors */
    }
  });
}

/**
 * Subscribe to token changes. Returns an unsubscribe function.
 */
export function subscribe(fn: (token: string | null) => void): () => void {
  _subscribers.add(fn);
  return () => _subscribers.delete(fn);
}

/** Clear the token (logout). */
export function clearToken(): void {
  setToken(null);
}