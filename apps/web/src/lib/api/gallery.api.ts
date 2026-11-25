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
function frameOwnerPortrait(item: Gallery): Gallery {
  const isOwnerCard =
    /software engineer|platform architect|nsambu laurenta|technical team/i.test(item.title || '');
  if (!isOwnerCard || !item.media_url) return item;

  const url = item.media_url.trim().replace(/^http:\/\//i, 'https://');
  const cloudinaryUploadSegment = '/image/upload/';
  const idx = url.indexOf(cloudinaryUploadSegment);
  if (idx === -1) return item;

  const prefix = url.slice(0, idx + cloudinaryUploadSegment.length);
  const rest = url.slice(idx + cloudinaryUploadSegment.length);
  const cleanRest = rest.replace(/^(?:[a-z]+_[^/,]+,)*[a-z]+_[^/]+\//i, '');
  const framedUrl = `${prefix}c_fill,g_face,ar_4:3,w_1200,q_auto,f_auto/${cleanRest}`;

  return {
    ...item,
    media_url: framedUrl,
    thumbnail_url: item.thumbnail_url ? framedUrl : item.thumbnail_url,
  };
}

  const items = (data.data || []).map(frameOwnerPortrait);

  // Keep the main Leadership & Team portraits pinned at the top (first 7),
  // placing "Resource Person Shey Njong Sebastian" at position #4 (index 3)
  const leadership = items.filter((item) => item.category === 'Leadership & Team');
  if (leadership.length === 0) return items;

  const isResourcePerson = (item: Gallery) =>
    /resource person|shey njong sebastian/i.test(item.title || '');

  const coreLeadership = leadership.filter((item) => !isResourcePerson(item));
  const resourcePerson = leadership.filter(isResourcePerson);
  const orderedLeadership = [
    ...coreLeadership.slice(0, 3),
    ...resourcePerson,
    ...coreLeadership.slice(3),
  ];
  const pinned = orderedLeadership.slice(0, 7);

  const pinnedIds = new Set(pinned.map((item) => item.id));
  const remaining = items.filter((item) => !pinnedIds.has(item.id));
  return [...pinned, ...remaining];
}

export function useGalleryList(params: GalleryQueryParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.LIST(params),
    queryFn: () => fetchGalleryList(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
