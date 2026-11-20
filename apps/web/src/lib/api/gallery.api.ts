// src/lib/api/gallery.api.ts
//
// Pure API methods & TanStack Query hooks for public Gallery.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, Gallery } from '@/types/api.types';

export const GALLERY_QUERY_KEYS = {
  ALL: ['public', 'gallery'] as const,
  LIST: (params?: { media_type?: string; category?: string }) =>
    ['public', 'gallery', 'list', params?.media_type || 'ALL', params?.category || 'ALL'] as const,
};

export interface GalleryQueryParams {
  media_type?: string;
  category?: string;
}

export async function fetchGalleryList(params: GalleryQueryParams = {}): Promise<Gallery[]> {
  const query = new URLSearchParams();
  if (params.media_type && params.media_type !== 'ALL') {
    query.append('media_type', params.media_type.toLowerCase());
  }
  if (params.category && params.category !== 'ALL') {
    query.append('category', params.category);
  }

  const qs = query.toString();
  const url = qs ? `/gallery?${qs}` : '/gallery';
  const { data } = await api.get<ApiResponse<Gallery[]>>(url);
  return data.data || [];
}

export function useGalleryList(params: GalleryQueryParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.LIST(params),
    queryFn: () => fetchGalleryList(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
