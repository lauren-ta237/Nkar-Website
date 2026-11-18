// src/lib/api/projects.api.ts
//
// Pure API methods & TanStack Query hooks for Community Projects module.
// Pattern: useAdminProjects...

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, DevelopmentProject } from '@/types';
import { sanitizePayload } from './helpers';

export const PROJECTS_QUERY_KEYS = {
  ALL: ['admin', 'projects'] as const,
  LIST: ['admin', 'projects', 'list'] as const,
};

function cleanProjectPayload(payload: any) {
  const sanitized = sanitizePayload(payload);
  if (sanitized.budget_cfa !== undefined && (sanitized.budget_cfa === null || Number(sanitized.budget_cfa) <= 0)) {
    sanitized.budget_cfa = null;
  }
  return sanitized;
}

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminProjectsList(): Promise<DevelopmentProject[]> {
  const { data } = await api.get<ApiResponse<DevelopmentProject[]>>('/projects/admin/items');
  return data.data || [];
}

export async function createAdminProject(payload: any): Promise<DevelopmentProject> {
  const sanitized = cleanProjectPayload(payload);
  const { data } = await api.post<ApiResponse<DevelopmentProject>>('/projects/admin/items', sanitized);
  return data.data;
}

export async function updateAdminProject(id: string, payload: any): Promise<DevelopmentProject> {
  const sanitized = cleanProjectPayload(payload);
  const { data } = await api.put<ApiResponse<DevelopmentProject>>(`/projects/admin/items/${id}`, sanitized);
  return data.data;
}

export async function deleteAdminProject(id: string): Promise<void> {
  await api.delete(`/projects/admin/items/${id}`);
}

// ---- hooks ---------------------------------------------------------------

export function useAdminProjectsList(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEYS.LIST,
    queryFn: fetchAdminProjectsList,
    ...options,
  });
}

export function useAdminProjectsMutations() {
  const queryClient = useQueryClient();

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEYS.ALL });
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: createAdminProject,
    onSuccess: invalidateProjects,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminProject(id, data),
    onSuccess: invalidateProjects,
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => updateAdminProject(id, { status: 'completed' }),
    onSuccess: invalidateProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProject,
    onSuccess: invalidateProjects,
  });

  return {
    createMutation,
    updateMutation,
    publishMutation,
    deleteMutation,
  };
}
