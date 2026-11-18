// src/lib/api/gallery.api.ts
//
// Pure API methods & TanStack Query hooks for Gallery module.
// Pattern: useAdminGallery...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Gallery } from '@/types';
import { sanitizePayload } from './helpers';

export const GALLERY_QUERY_KEYS = {
  ALL: ['admin', 'gallery'] as const,
  LIST: ['admin', 'gallery', 'list'] as const,
};

function cleanGalleryPayload(payload: any) {
  const sanitized = sanitizePayload(payload);
  if (sanitized.media_type) {
    sanitized.media_type = String(sanitized.media_type).toLowerCase();
  }
  return sanitized;
}

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminGalleryList(): Promise<Gallery[]> {
  const { data } = await api.get<ApiResponse<Gallery[]>>('/gallery/admin/items');
  return data.data || [];
}

export async function createAdminGallery(payload: any): Promise<Gallery> {
  const sanitized = cleanGalleryPayload(payload);
  const { data } = await api.post<ApiResponse<Gallery>>('/gallery/admin/items', sanitized);
  return data.data;
}

export async function updateAdminGallery(id: string, payload: any): Promise<Gallery> {
  const sanitized = cleanGalleryPayload(payload);
  const { data } = await api.put<ApiResponse<Gallery>>(`/gallery/admin/items/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminGallery(id: string): Promise<void> {
  await api.delete(`/gallery/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminGalleryList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.LIST,
    queryFn: fetchAdminGalleryList,
    ...options,
  });
}

export function useAdminGalleryMutations() {
  const queryClient = useQueryClient();

  const invalidateGallery = () => {
    queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminGallery,
    onSuccess: invalidateGallery,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminGallery(id, data),
    onSuccess: invalidateGallery,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminGallery(id, { status: 'published' }),
    onSuccess: invalidateGallery,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminGallery,
    onSuccess: invalidateGallery,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    deleteMutation,
  };
}
