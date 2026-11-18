// src/lib/api/publications.api.ts
//
// Pure API methods & TanStack Query hooks for Publications module.
// Pattern: useAdminPublications...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Publication } from '@/types';

export const PUBLICATIONS_QUERY_KEYS = {
  ALL: ['admin', 'publications'] as const,
  LIST: ['admin', 'publications', 'list'] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminPublicationsList(): Promise<Publication[]> {
  const { data } = await api.get<ApiResponse<Publication[]>>('/publications/admin/items');
  return data.data || [];
}

export async function createAdminPublication(payload: any): Promise<Publication> {
  const { data } = await api.post<ApiResponse<Publication>>('/publications/admin/items', payload);
  return data.data;
}

export async function updateAdminPublication(id: string, payload: any): Promise<Publication> {
  const { data } = await api.put<ApiResponse<Publication>>(`/publications/admin/items/${id}`, payload);
  return data.data;
}

export async function deleteAdminPublication(id: string): Promise<void> {
  await api.delete(`/publications/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminPublicationsList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PUBLICATIONS_QUERY_KEYS.LIST,
    queryFn: fetchAdminPublicationsList,
    ...options,
  });
}

export function useAdminPublicationsMutations() {
  const queryClient = useQueryClient();

  const invalidatePublications = () => {
    queryClient.invalidateQueries({ queryKey: PUBLICATIONS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminPublication,
    onSuccess: invalidatePublications,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminPublication(id, data),
    onSuccess: invalidatePublications,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminPublication(id, { status: 'published' }),
    onSuccess: invalidatePublications,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPublication,
    onSuccess: invalidatePublications,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    deleteMutation,
  };
}
