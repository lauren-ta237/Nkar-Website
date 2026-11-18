// src/lib/api/events.api.ts
//
// Pure API methods & TanStack Query hooks for Sovereign Events module.
// Pattern: useAdminEvents...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, EventItem } from '@/types';
import { sanitizePayload } from './helpers';

export const EVENTS_QUERY_KEYS = {
  ALL: ['admin', 'events'] as const,
  LIST: (status?: string) => ['admin', 'events', 'list', status || 'ALL'] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminEventsList(statusFilter?: string): Promise<EventItem[]> {
  const url = statusFilter && statusFilter !== 'ALL'
    ? `/events/admin/items?status=${statusFilter}`
    : '/events/admin/items';
  const { data } = await api.get<ApiResponse<EventItem[]>>(url);
  return data.data || [];
}

export async function createAdminEvent(payload: any): Promise<EventItem> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.post<ApiResponse<EventItem>>('/events/admin/items', sanitized);
  return data.data;
}

export async function updateAdminEvent(id: string, payload: any): Promise<EventItem> {
  const sanitized = sanitizePayload(payload);
  const { data } = await api.put<ApiResponse<EventItem>>(`/events/admin/items/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminEvent(id: string): Promise<void> {
  await api.delete(`/events/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminEventsList(
  statusFilterOrOptions?: string | { enabled?: boolean },
  options?: { enabled?: boolean }
) {
  const statusFilter = typeof statusFilterOrOptions === 'string' ? statusFilterOrOptions : undefined;
  const opts = typeof statusFilterOrOptions === 'object' ? statusFilterOrOptions : (options ?? {});
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.LIST(statusFilter),
    queryFn: () => fetchAdminEventsList(statusFilter),
    ...opts,
  });
}

export function useAdminEventsMutations() {
  const queryClient = useQueryClient();

  const invalidateEvents = () => {
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminEvent,
    onSuccess: invalidateEvents,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminEvent(id, data),
    onSuccess: invalidateEvents,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminEvent(id, { status: 'published' }),
    onSuccess: invalidateEvents,
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => updateAdminEvent(id, { status: 'archived' }),
    onSuccess: invalidateEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminEvent,
    onSuccess: invalidateEvents,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    archiveMutation,
    deleteMutation,
  };
}
