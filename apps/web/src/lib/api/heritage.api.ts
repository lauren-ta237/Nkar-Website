// src/lib/api/heritage.api.ts
//
// Pure API methods & TanStack Query hooks for public Heritage.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Heritage } from '@/types/api.types';

export const HERITAGE_QUERY_KEYS = {
  ALL: ['public', 'heritage'] as const,
  LIST: (category?: string) => ['public', 'heritage', 'list', category || 'ALL'] as const,
  DETAIL: (slug: string) => ['public', 'heritage', 'detail', slug] as const,
};

export async function fetchHeritageList(category?: string): Promise<Heritage[]> {
  const url = category && category !== 'ALL' ? `/heritage?category=${category}` : '/heritage';
  const { data } = await api.get<ApiResponse<Heritage[]>>(url);
  return data.data || [];
}

export async function fetchHeritageBySlug(slug: string): Promise<Heritage> {
  const { data } = await api.get<ApiResponse<Heritage>>(`/heritage/${slug}`);
  return data.data;
}

export function useHeritageList(category?: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: HERITAGE_QUERY_KEYS.LIST(category),
    queryFn: () => fetchHeritageList(category),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useHeritageDetail(slug: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: HERITAGE_QUERY_KEYS.DETAIL(slug),
    queryFn: () => fetchHeritageBySlug(slug),
    enabled: Boolean(slug) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 10,
  });
}
