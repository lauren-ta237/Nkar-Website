// src/lib/api/events.api.ts
//
// Pure API methods & TanStack Query hooks for public Events.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, EventItem } from '@/types/api.types';

export const EVENTS_QUERY_KEYS = {
  ALL: ['public', 'events'] as const,
  LIST: (params?: { search?: string }) => ['public', 'events', 'list', params?.search || ''] as const,
  DETAIL: (slug: string) => ['public', 'events', 'detail', slug] as const,
};

export interface EventsQueryParams {
  search?: string;
  limit?: number;
  skip?: number;
}

export async function fetchEventsList(params: EventsQueryParams = {}): Promise<EventItem[]> {
  const query = new URLSearchParams();
  if (params.search) {
    query.append('search', params.search);
  }
  if (params.limit) {
    query.append('limit', String(params.limit));
  }
  if (params.skip) {
    query.append('skip', String(params.skip));
  }

  const qs = query.toString();
  const url = qs ? `/events?${qs}` : '/events';
  const { data } = await api.get<ApiResponse<EventItem[]>>(url);
  return data.data || [];
}

export async function fetchEventBySlug(slug: string): Promise<EventItem> {
  const { data } = await api.get<ApiResponse<EventItem>>(`/events/${slug}`);
  return data.data;
}

export function useEventsList(params: EventsQueryParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.LIST(params),
    queryFn: () => fetchEventsList(params),
    staleTime: 1000 * 60 * 3,
    ...options,
  });
}

export function useEventDetail(slug: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.DETAIL(slug),
    queryFn: () => fetchEventBySlug(slug),
    enabled: Boolean(slug) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}
