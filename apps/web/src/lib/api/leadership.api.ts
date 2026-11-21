// src/lib/api/leadership.api.ts
//
// Pure API methods & TanStack Query hooks for public Leadership (Register of Reigns).

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Leadership } from '@/types/api.types';

export const LEADERSHIP_QUERY_KEYS = {
  ALL: ['public', 'leadership'] as const,
  LIST: ['public', 'leadership', 'list'] as const,
};

export async function fetchLeadershipList(pageSize = 100): Promise<Leadership[]> {
  const { data } = await api.get<ApiResponse<Leadership[]>>('/leadership', {
    params: { page_size: pageSize },
  });
  return data.data || [];
}

export function useLeadershipList(options: { enabled?: boolean; pageSize?: number } = {}) {
  const { enabled, pageSize = 100, ...queryOptions } = options;

  return useQuery({
    queryKey: [...LEADERSHIP_QUERY_KEYS.LIST, pageSize],
    queryFn: () => fetchLeadershipList(pageSize),
    staleTime: 1000 * 60 * 10,
    enabled,
    ...queryOptions,
  });
}