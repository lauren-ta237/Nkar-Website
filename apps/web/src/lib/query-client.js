import { QueryClient } from '@tanstack/react-query';

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
export function resetQueryClient() {
	queryClientInstance.removeQueries();
	queryClientInstance.clear();
}