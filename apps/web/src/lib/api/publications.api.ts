// src/lib/api/publications.api.ts
//
// Pure API methods & TanStack Query hooks for public Publications & Books.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Publication } from '@/types/api.types';

export const PUBLICATIONS_QUERY_KEYS = {
  ALL: ['public', 'publications'] as const,
  LIST: ['public', 'publications', 'list'] as const,
  DETAIL: (id: string) => ['public', 'publications', 'detail', id] as const,
};

export async function fetchPublicationsList(): Promise<Publication[]> {
  const { data } = await api.get<ApiResponse<Publication[]>>('/publications');
  return data.data || [];
}

export function usePublicationsList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PUBLICATIONS_QUERY_KEYS.LIST,
    queryFn: fetchPublicationsList,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export async function fetchPublicationDetail(id: string): Promise<Publication> {
  const { data } = await api.get<ApiResponse<Publication>>(`/publications/${id}`);
  return data.data;
}

export function usePublicationDetail(id?: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PUBLICATIONS_QUERY_KEYS.DETAIL(id || ''),
    queryFn: () => fetchPublicationDetail(id!),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 10,
  });
}
