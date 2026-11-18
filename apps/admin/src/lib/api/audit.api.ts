// src/lib/api/audit.api.ts
//
// Pure API methods & TanStack Query hooks for Security Audit Logs.
// Pattern: useAdminAudit...

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, AuditLog } from '@/types';

export const AUDIT_QUERY_KEYS = {
  ALL: ['admin', 'audit'] as const,
  LIST: (limit?: number) => ['admin', 'audit', 'list', limit || 50] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  const { data } = await api.get<ApiResponse<AuditLog[]>>(`/audit?limit=${limit}`);
  return data.data || [];
}

// ---- hooks ---------------------------------------------------------------

export function useAdminAuditLogs(options: { limit?: number; enabled?: boolean } = {}) {
  const limit = options.limit ?? 50;
  return useQuery({
    queryKey: AUDIT_QUERY_KEYS.LIST(limit),
    queryFn: () => fetchAdminAuditLogs(limit),
    ...options,
  });
}
