// src/lib/api/search.api.ts
//
// Pure API methods & TanStack Query hooks for public search.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse } from '@/types/api.types';

export interface PublicSearchResultItem {
  id: string;
  title: string;
  type: string;
  category?: string;
  subtitle?: string;
  url: string;
}

export const SEARCH_QUERY_KEYS = {
  SEARCH: (query: string, type?: string) => ['public', 'search', query, type || 'All'] as const,
};

export async function fetchPublicSearch(
  q: string,
  type?: string,
  limit = 20
): Promise<PublicSearchResultItem[]> {
  if (!q.trim()) return [];
  const params = new URLSearchParams({ q: q.trim(), limit: String(limit) });
  if (type && type !== 'All') {
    params.append('type', type.toLowerCase());
  }

  const { data } = await api.get<ApiResponse<PublicSearchResultItem[]>>(`/search?${params.toString()}`);
  return data.data || [];
}

export function usePublicSearch(
  query: string,
  type?: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: SEARCH_QUERY_KEYS.SEARCH(query, type),
    queryFn: () => fetchPublicSearch(query, type),
    enabled: Boolean(query.trim()) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 2,
  });
}
