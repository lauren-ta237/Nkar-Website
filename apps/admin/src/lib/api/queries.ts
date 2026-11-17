// src/lib/api/queries.ts
//
// Direct TanStack Query hooks implementing API integration for apps/admin.
// Directly calls backend endpoints via axios-client matching FastAPI responses.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './config/axios-client';
import {
  News,
  EventItem,
  Heritage,
  Leadership,
  Gallery,
  Publication,
  DevelopmentProject,
  ContactSubmission,
  AuditLog,
  User,
  DashboardStats,
  ApiResponse,
} from '@/types';

export const QUERY_KEYS = {
  STATS: ['dashboard', 'stats'] as const,
  PENDING_REVIEWS: ['dashboard', 'pending_reviews'] as const,
  NEWS: ['news'] as const,
  EVENTS: ['events'] as const,
  HERITAGE: ['heritage'] as const,
  LEADERSHIP: ['leadership'] as const,
  GALLERY: ['gallery'] as const,
  PUBLICATIONS: ['publications'] as const,
  PROJECTS: ['projects'] as const,
  CONTACTS: ['contacts'] as const,
  USERS: ['users'] as const,
  AUDIT_LOGS: ['audit_logs'] as const,
};

// ============================================================================
// 1. DASHBOARD QUERIES
// ============================================================================

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
        return data.data;
      } catch {
        return {
          totalNews: 0,
          publishedNews: 0,
          upcomingEvents: 0,
          heritageRecords: 0,
          galleryItems: 0,
          publicationsCount: 0,
          developmentProjectsCount: 0,
          pendingReviews: 0,
          unreadMessages: 0,
          registeredAdmins: 0,
        };
      }
    },
  });
}

export function usePendingReviews() {
  return useQuery({
    queryKey: QUERY_KEYS.PENDING_REVIEWS,
    queryFn: async (): Promise<any[]> => {
      try {
        const [newsRes, eventsRes, heritageRes] = await Promise.all([
          api.get<ApiResponse<News[]>>('/news/admin/items?status=SUBMITTED').catch(() => ({ data: { data: [] } })),
          api.get<ApiResponse<EventItem[]>>('/events/admin/items?status=SUBMITTED').catch(() => ({ data: { data: [] } })),
          api.get<ApiResponse<Heritage[]>>('/heritage/admin/items?status=SUBMITTED').catch(() => ({ data: { data: [] } })),
        ]);
        const newsItems = (newsRes.data.data || []).map((n) => ({ ...n, type: 'News' }));
        const eventItems = (eventsRes.data.data || []).map((e) => ({ ...e, type: 'Event' }));
        const heritageItems = (heritageRes.data.data || []).map((h) => ({ ...h, type: 'Heritage' }));
        return [...newsItems, ...eventItems, ...heritageItems];
      } catch {
        return [];
      }
    },
  });
}

// ============================================================================
// 2. NEWS QUERIES & MUTATIONS
// ============================================================================

export function useNewsList(statusFilter?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.NEWS, statusFilter],
    queryFn: async (): Promise<News[]> => {
      const url = statusFilter ? `/news/admin/items?status=${statusFilter}` : '/news/admin/items';
      const { data } = await api.get<ApiResponse<News[]>>(url);
      return data.data || [];
    },
  });
}

export function useNewsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<News>>('/news/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, review_notes }: { id: string; review_notes?: string }) => {
      const res = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, { status: 'APPROVED', review_notes });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, review_notes }: { id: string; review_notes?: string }) => {
      const res = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, { status: 'REJECTED', review_notes });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<News>>(`/news/admin/items/${id}`, { status: 'ARCHIVED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/news/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS }),
  });

  return { createMutation, updateMutation, publishMutation, approveMutation, rejectMutation, archiveMutation, deleteMutation };
}

// ============================================================================
// 3. EVENTS QUERIES & MUTATIONS
// ============================================================================

export function useEventsList() {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: async (): Promise<EventItem[]> => {
      const { data } = await api.get<ApiResponse<EventItem[]>>('/events/admin/items');
      return data.data || [];
    },
  });
}

export function useEventsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<EventItem>>('/events/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<EventItem>>(`/events/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<EventItem>>(`/events/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS }),
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<EventItem>>(`/events/admin/items/${id}`, { status: 'ARCHIVED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS }),
  });

  return { createMutation, updateMutation, publishMutation, archiveMutation, deleteMutation };
}

// ============================================================================
// 4. HERITAGE QUERIES & MUTATIONS
// ============================================================================

export function useHeritageList() {
  return useQuery({
    queryKey: QUERY_KEYS.HERITAGE,
    queryFn: async (): Promise<Heritage[]> => {
      const { data } = await api.get<ApiResponse<Heritage[]>>('/heritage/admin/items');
      return data.data || [];
    },
  });
}

export function useHeritageMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<Heritage>>('/heritage/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<Heritage>>(`/heritage/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<Heritage>>(`/heritage/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/heritage/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE }),
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// ============================================================================
// 5. LEADERSHIP QUERIES & MUTATIONS
// ============================================================================

export function useLeadershipList() {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERSHIP,
    queryFn: async (): Promise<Leadership[]> => {
      const { data } = await api.get<ApiResponse<Leadership[]>>('/leadership/admin/items');
      return data.data || [];
    },
  });
}

export function useLeadershipMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<Leadership>>('/leadership/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<Leadership>>(`/leadership/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<Leadership>>(`/leadership/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leadership/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP }),
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// ============================================================================
// 6. GALLERY QUERIES & MUTATIONS
// ============================================================================

export function useGalleryList() {
  return useQuery({
    queryKey: QUERY_KEYS.GALLERY,
    queryFn: async (): Promise<Gallery[]> => {
      const { data } = await api.get<ApiResponse<Gallery[]>>('/gallery/admin/items');
      return data.data || [];
    },
  });
}

export function useGalleryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<Gallery>>('/gallery/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<Gallery>>(`/gallery/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<Gallery>>(`/gallery/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/gallery/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY }),
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// ============================================================================
// 7. PUBLICATIONS QUERIES & MUTATIONS
// ============================================================================

export function usePublicationsList() {
  return useQuery({
    queryKey: QUERY_KEYS.PUBLICATIONS,
    queryFn: async (): Promise<Publication[]> => {
      const { data } = await api.get<ApiResponse<Publication[]>>('/publications/admin/items');
      return data.data || [];
    },
  });
}

export function usePublicationsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<Publication>>('/publications/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<Publication>>(`/publications/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<Publication>>(`/publications/admin/items/${id}`, { status: 'PUBLISHED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/publications/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS }),
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// ============================================================================
// 8. PROJECTS QUERIES & MUTATIONS
// ============================================================================

export function useProjectsList() {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: async (): Promise<DevelopmentProject[]> => {
      const { data } = await api.get<ApiResponse<DevelopmentProject[]>>('/projects/admin/items');
      return data.data || [];
    },
  });
}

export function useProjectsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<DevelopmentProject>>('/projects/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<DevelopmentProject>>(`/projects/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<ApiResponse<DevelopmentProject>>(`/projects/admin/items/${id}`, { status: 'COMPLETED' });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS }),
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// ============================================================================
// 9. CONTACT INQUIRIES QUERIES & MUTATIONS
// ============================================================================

export function useContactsList() {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS,
    queryFn: async (): Promise<ContactSubmission[]> => {
      const { data } = await api.get<ApiResponse<ContactSubmission[]>>('/contacts/admin/items');
      return data.data || [];
    },
  });
}

export function useContactsMutations() {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, internal_notes }: { id: string; status: any; internal_notes?: string }) => {
      const res = await api.patch<ApiResponse<ContactSubmission>>(`/contacts/admin/items/${id}`, {
        status,
        internal_notes,
      });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contacts/admin/items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS }),
  });

  return { updateStatusMutation, deleteMutation };
}

// ============================================================================
// 10. USER MANAGEMENT QUERIES & MUTATIONS
// ============================================================================

export function useUsersList() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async (): Promise<User[]> => {
      const { data } = await api.get<ApiResponse<User[]>>('/users/admin/items');
      return data.data || [];
    },
  });
}

export function useUsersMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post<ApiResponse<User>>('/users/admin/items', payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<User>>(`/users/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put<ApiResponse<User>>(`/users/admin/items/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<ApiResponse<User>>(`/users/admin/items/${id}/toggle-status`);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
  });

  return { createMutation, updateMutation, updateProfileMutation, toggleStatusMutation };
}

// ============================================================================
// 11. AUDIT LOGS QUERIES
// ============================================================================

export function useAuditLogs() {
  return useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOGS,
    queryFn: async (): Promise<AuditLog[]> => {
      const { data } = await api.get<ApiResponse<AuditLog[]>>('/audit/admin/logs');
      return data.data || [];
    },
  });
}
