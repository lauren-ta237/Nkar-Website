// src/lib/api/leadership.api.ts
//
// Pure API methods & TanStack Query hooks for Register of Reigns module.
// Pattern: useAdminLeadership...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Leadership } from '@/types';
import { sanitizePayload } from './helpers';

export const LEADERSHIP_QUERY_KEYS = {
  ALL: ['admin', 'leadership'] as const,
  LIST: ['admin', 'leadership', 'list'] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminLeadershipList(): Promise<Leadership[]> {
  const { data } = await api.get<ApiResponse<Leadership[]>>('/leadership/admin/items');
  return data.data || [];
}

export async function createAdminLeadership(payload: any): Promise<Leadership> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.post<ApiResponse<Leadership>>('/leadership/admin/items', sanitized);
  return data.data;
}

export async function updateAdminLeadership(id: string, payload: any): Promise<Leadership> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.put<ApiResponse<Leadership>>(`/leadership/admin/items/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminLeadership(id: string): Promise<void> {
  await api.delete(`/leadership/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminLeadershipList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: LEADERSHIP_QUERY_KEYS.LIST,
    queryFn: fetchAdminLeadershipList,
    ...options,
  });
}

export function useAdminLeadershipMutations() {
  const queryClient = useQueryClient();

  const invalidateLeadership = () => {
    queryClient.invalidateQueries({ queryKey: LEADERSHIP_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminLeadership,
    onSuccess: invalidateLeadership,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminLeadership(id, data),
    onSuccess: invalidateLeadership,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminLeadership(id, { status: 'published' }),
    onSuccess: invalidateLeadership,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminLeadership,
    onSuccess: invalidateLeadership,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    deleteMutation,
  };
}
