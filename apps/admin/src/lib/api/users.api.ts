// src/lib/api/users.api.ts
//
// Pure API methods & TanStack Query hooks for User & Admin Management.
// Pattern: useAdminUsers...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, User } from '@/types';
import { sanitizePayload } from './helpers';

export const USERS_QUERY_KEYS = {
  ALL: ['admin', 'users'] as const,
  LIST: ['admin', 'users', 'list'] as const,
};

function cleanUserPayload(payload: any) {
  const sanitized = sanitizePayload(payload);
  if (sanitized.role) {
    sanitized.role = String(sanitized.role).toLowerCase();
  }
  if (sanitized.status) {
    sanitized.status = String(sanitized.status).toLowerCase();
  }
  return sanitized;
}

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminUsersList(): Promise<User[]> {
  const { data } = await api.get<ApiResponse<User[]>>('/users');
  return data.data || [];
}

export async function createAdminUser(payload: any): Promise<User> {
  const sanitized = cleanUserPayload(payload);
  const { data } = await api.post<ApiResponse<User>>('/users', sanitized);
  return data.data;
}

export async function updateAdminUser(id: string, payload: any): Promise<User> {
  const sanitized = cleanUserPayload(payload);
  const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function toggleAdminUserStatus(id: string): Promise<User> {
  const users = await fetchAdminUsersList();
  const targetUser = users.find((u) => u.id === id);
  const newStatus = targetUser?.status?.toLowerCase() === 'active' ? 'suspended' : 'active';
  return updateAdminUser(id, { status: newStatus });
}

// ---- hooks ---------------------------------------------------------------

export function useAdminUsersList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.LIST,
    queryFn: fetchAdminUsersList,
    ...options,
  });
}

export function useAdminUsersMutations() {
  const queryClient = useQueryClient();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: invalidateUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminUser(id, data),
    onSuccess: invalidateUsers,
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminUser(id, data),
    onSuccess: invalidateUsers,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleAdminUserStatus,
    onSuccess: invalidateUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: invalidateUsers,
  });

  return {
    createMutation,
    updateMutation,
    updateProfileMutation,
    toggleStatusMutation,
    deleteMutation,
  };
}
