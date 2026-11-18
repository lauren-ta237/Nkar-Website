// src/lib/api/dashboard.api.ts
//
// Pure API methods & TanStack Query hooks for the Admin Dashboard.
// Consumes backend SQL aggregations and lightweight review queues.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, DashboardStats } from '@/types';

export interface PendingReviewItem {
  id: string;
  title: string;
  slug?: string | null;
  type: string;
  category?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  author_id?: string | null;
  submittedBy?: string | null;
  submitted_by?: string | null;
}

export interface GlobalSearchResultItem {
  id: string;
  title: string;
  type: string;
  page: string;
  status?: string | null;
  category?: string | null;
  subtitle?: string | null;
}

export const DASHBOARD_QUERY_KEYS = {
  STATS: ['admin', 'dashboard', 'stats'] as const,
  PENDING_REVIEWS: ['admin', 'dashboard', 'pending_reviews'] as const,
  SEARCH: (query: string) => ['admin', 'dashboard', 'search', query] as const,
};

// ---- pure api routes -----------------------------------------------------

export async function fetchAdminDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  return data.data;
}

export async function fetchAdminPendingReviews(limit: number = 20): Promise<PendingReviewItem[]> {
  const { data } = await api.get<ApiResponse<PendingReviewItem[]>>(`/admin/dashboard/pending-reviews?limit=${limit}`);
  return data.data || [];
}

export async function searchAdminPortal(query: string, limit: number = 15): Promise<GlobalSearchResultItem[]> {
  if (!query || !query.trim()) return [];
  const { data } = await api.get<ApiResponse<GlobalSearchResultItem[]>>(
    `/admin/dashboard/search?q=${encodeURIComponent(query.trim())}&limit=${limit}`
  );
  return data.data || [];
}

// ---- hooks (useAdmin<Entity> pattern) -------------------------------------

export function useAdminDashboardStats(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.STATS,
    queryFn: fetchAdminDashboardStats,
    staleTime: 1000 * 30, // 30s
    ...options,
  });
}

export function useAdminPendingReviews(options: { limit?: number; enabled?: boolean } = {}) {
  const limit = options.limit ?? 20;
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEYS.PENDING_REVIEWS, limit],
    queryFn: () => fetchAdminPendingReviews(limit),
    staleTime: 1000 * 30,
    ...options,
  });
}

export function useAdminGlobalSearch(query: string, options: { limit?: number; enabled?: boolean } = {}) {
  const limit = options.limit ?? 15;
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.SEARCH(query),
    queryFn: () => searchAdminPortal(query, limit),
    enabled: Boolean(options.enabled ?? (query && query.trim().length > 0)),
    staleTime: 1000 * 60,
  });
}
