// src/lib/api/news.api.ts
//
// Pure API methods & TanStack Query hooks for public News & Announcements.

import { useQuery } from '@tanstack/react-query';
import { api } from './config/axios-client';
import { ApiResponse, News } from '@/types/api.types';

export const NEWS_QUERY_KEYS = {
  ALL: ['public', 'news'] as const,
  LIST: (params?: { category?: string; search?: string }) =>
    ['public', 'news', 'list', params?.category || 'ALL', params?.search || ''] as const,
  DETAIL: (slug: string) => ['public', 'news', 'detail', slug] as const,
};

export interface NewsQueryParams {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export async function fetchNewsList(params: NewsQueryParams = {}): Promise<News[]> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'ALL') {
    query.append('category', params.category);
  }
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
  const url = qs ? `/news?${qs}` : '/news';
  const { data } = await api.get<ApiResponse<News[]>>(url);
  return data.data || [];
}

export async function fetchNewsBySlug(slug: string): Promise<News> {
  const { data } = await api.get<ApiResponse<News>>(`/news/${slug}`);
  return data.data;
}

export function useNewsList(params: NewsQueryParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.LIST(params),
    queryFn: () => fetchNewsList(params),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    ...options,
  });
}

export function useNewsDetail(slug: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: NEWS_QUERY_KEYS.DETAIL(slug),
    queryFn: () => fetchNewsBySlug(slug),
    enabled: Boolean(slug) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
}
