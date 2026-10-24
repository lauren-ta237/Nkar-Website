// query-client.ts
//
// TanStack Query client instance with app-wide defaults.
// - refetchOnWindowFocus: false — we control when data refreshes (user action, mutation invalidation).
// - retry: 1 — a single retry for transient network blips; failed queries surface quickly.
// - mutations.retry: false — writes (login, register) must fail fast so UI shows the error.

import { QueryClient } from "@tanstack/react-query";

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      // Don't retry writes — a failed login/register should surface
      // immediately so the UI can show the error message.
      retry: false,
    },
  },
});

/**
 * Reset the whole cache. Call it on a hard logout or when switching users so
 * stale queries from the previous session never leak into the next one.
 */
export function resetQueryClient(): void {
  queryClientInstance.removeQueries();
  queryClientInstance.clear();
}