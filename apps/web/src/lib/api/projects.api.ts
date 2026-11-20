// src/lib/api/projects.api.ts
//
// Pure API methods & TanStack Query hooks for public Community Projects.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, DevelopmentProject } from '@/types/api.types';

export const PROJECTS_QUERY_KEYS = {
  ALL: ['public', 'projects'] as const,
  LIST: (status?: string) => ['public', 'projects', 'list', status || 'ALL'] as const,
};

export async function fetchProjectsList(status?: string): Promise<DevelopmentProject[]> {
  const url = status && status !== 'ALL' ? `/projects?status=${status.toLowerCase()}` : '/projects';
  const { data } = await api.get<ApiResponse<DevelopmentProject[]>>(url);
  return data.data || [];
}

export function useProjectsList(status?: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEYS.LIST(status),
    queryFn: () => fetchProjectsList(status),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
