// src/lib/api/heritage.api.ts
//
// Pure API methods & TanStack Query hooks for Cultural Heritage module.
// Pattern: useAdminHeritage...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Heritage } from '@/types';
import { sanitizePayload } from './helpers';

export const HERITAGE_QUERY_KEYS = {
  ALL: ['admin', 'heritage'] as const,
  LIST: ['admin', 'heritage', 'list'] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminHeritageList(): Promise<Heritage[]> {
  const { data } = await api.get<ApiResponse<Heritage[]>>('/heritage/admin/items');
  return data.data || [];
}

export async function createAdminHeritage(payload: any): Promise<Heritage> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.post<ApiResponse<Heritage>>('/heritage/admin/items', sanitized);
  return data.data;
}

export async function updateAdminHeritage(id: string, payload: any): Promise<Heritage> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.put<ApiResponse<Heritage>>(`/heritage/admin/items/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminHeritage(id: string): Promise<void> {
  await api.delete(`/heritage/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminHeritageList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: HERITAGE_QUERY_KEYS.LIST,
    queryFn: fetchAdminHeritageList,
    ...options,
  });
}

export function useAdminHeritageMutations() {
  const queryClient = useQueryClient();

  const invalidateHeritage = () => {
    queryClient.invalidateQueries({ queryKey: HERITAGE_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminHeritage,
    onSuccess: invalidateHeritage,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminHeritage(id, data),
    onSuccess: invalidateHeritage,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminHeritage(id, { status: 'published' }),
    onSuccess: invalidateHeritage,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminHeritage,
    onSuccess: invalidateHeritage,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    deleteMutation,
  };
}
