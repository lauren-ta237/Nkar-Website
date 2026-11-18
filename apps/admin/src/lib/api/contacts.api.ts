// src/lib/api/contacts.api.ts
//
// Pure API methods & TanStack Query hooks for Citizen Contacts & Inquiries.
// Pattern: useAdminContacts...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, ContactSubmission } from '@/types';

export const CONTACTS_QUERY_KEYS = {
  ALL: ['admin', 'contacts'] as const,
  LIST: (status?: string) => ['admin', 'contacts', 'list', status || 'ALL'] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminContactsList(statusFilter?: string): Promise<ContactSubmission[]> {
  const url = statusFilter && statusFilter !== 'ALL'
    ? `/contacts/admin/items?status=${statusFilter}`
    : '/contacts/admin/items';
  const { data } = await api.get<ApiResponse<ContactSubmission[]>>(url);
  return data.data || [];
}

export async function updateAdminContactStatus(
  id: string,
  status: string,
  internalNotes?: string
): Promise<ContactSubmission> {
  const { data } = await api.patch<ApiResponse<ContactSubmission>>(`/contacts/admin/items/${id}`, {
    status,
    internal_notes: internalNotes,
  });
  return data.data;
}

export async function deleteAdminContact(id: string): Promise<void> {
  await api.delete(`/contacts/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminContactsList(
  options: { status?: string; enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: CONTACTS_QUERY_KEYS.LIST(options.status),
    queryFn: () => fetchAdminContactsList(options.status),
    ...options,
  });
}

export function useAdminContactsMutations() {
  const queryClient = useQueryClient();

  const invalidateContacts = () => {
    queryClient.invalidateQueries({ queryKey: CONTACTS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, internal_notes }: { id: string; status: any; internal_notes?: string }) =>
      updateAdminContactStatus(id, status, internal_notes),
    onSuccess: invalidateContacts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminContact,
    onSuccess: invalidateContacts,
  });

  return { updateStatusMutation, deleteMutation };
}
