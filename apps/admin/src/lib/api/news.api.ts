// src/lib/api/news.api.ts
//
// Pure API methods & TanStack Query hooks for News module.
// Pattern: useAdminNews...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, News } from '@/types';

export const NEWS_QUERY_KEYS = {
  ALL: ['admin', 'news'] as const,
  LIST: (status?: string) => ['admin', 'news', 'list', status || 'ALL'] as const,
  DETAIL: (id: string) => ['admin', 'news', 'detail', id] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminNewsList(statusFilter?: string): Promise<News[]> {
  const url = statusFilter && statusFilter !== 'ALL'
    ? `/news/admin/items?status=${statusFilter}`
    : '/news/admin/items';
  const { data } = await api.get<ApiResponse<News[]>>(url);
  return data.data || [];
}

export async function createAdminNews(payload: any): Promise<News> {
  const { data } = await api.post<ApiResponse<News>>('/news/admin/items', payload);
  return data.data;
}

export async function updateAdminNews(id: string, payload: any): Promise<News> {
  const { data } = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, payload);
  return data.data;
}

export async function deleteAdminNews(id: string): Promise<void> {
  await api.delete(`/news/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminNewsList(
  statusFilterOrOptions?: string | { enabled?: boolean },
  options?: { enabled?: boolean }
) {
  const statusFilter = typeof statusFilterOrOptions === 'string' ? statusFilterOrOptions : undefined;
  const opts = typeof statusFilterOrOptions === 'object' ? statusFilterOrOptions : (options ?? {});
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.LIST(statusFilter),
    queryFn: () => fetchAdminNewsList(statusFilter),
    ...opts,
  });
}

export function useAdminNewsMutations() {
  const queryClient = useQueryClient();

  const invalidateNews = () => {
    queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminNews,
    onSuccess: invalidateNews,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminNews(id, data),
    onSuccess: invalidateNews,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminNews(id, { status: 'published' }),
    onSuccess: invalidateNews,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, review_notes }: { id: string; review_notes?: string }) =>
      updateAdminNews(id, { status: 'approved', review_notes }),
    onSuccess: invalidateNews,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, review_notes }: { id: string; review_notes?: string }) =>
      updateAdminNews(id, { status: 'rejected', review_notes }),
    onSuccess: invalidateNews,
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateAdminNews(id, { status: 'archived' }),
    onSuccess: invalidateNews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminNews,
    onSuccess: invalidateNews,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    approveMutation,
    rejectMutation,
    archiveMutation,
    deleteMutation,
  };
}
