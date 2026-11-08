import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from './backend';
import { useAdminStore } from '../store/useAdminStore';
import {
  News,
  EventItem,
  Heritage,
  Leadership,
  Gallery,
  Publication,
  DevelopmentProject,
  User,
} from '../types';

export const QUERY_KEYS = {
  STATS: ['dashboard', 'stats'],
  PENDING_REVIEWS: ['dashboard', 'pending_reviews'],
  NEWS: ['news'],
  EVENTS: ['events'],
  HERITAGE: ['heritage'],
  LEADERSHIP: ['leadership'],
  GALLERY: ['gallery'],
  PUBLICATIONS: ['publications'],
  PROJECTS: ['projects'],
  CONTACTS: ['contacts'],
  USERS: ['users'],
  AUDIT_LOGS: ['audit_logs'],
};

// Dashboard Queries
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.STATS,
    queryFn: () => backendApi.getDashboardStats(),
  });
}

export function usePendingReviews() {
  return useQuery({
    queryKey: QUERY_KEYS.PENDING_REVIEWS,
    queryFn: () => backendApi.getPendingReviewItems(),
  });
}

// News
export function useNewsList() {
  return useQuery({
    queryKey: QUERY_KEYS.NEWS,
    queryFn: () => backendApi.news.list(),
  });
}

export function useNewsMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) =>
      backendApi.news.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<News> }) =>
      backendApi.news.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      backendApi.news.approve(currentUser, id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      backendApi.news.reject(currentUser, id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => backendApi.news.publish(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => backendApi.news.archive(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.news.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return {
    createMutation,
    updateMutation,
    approveMutation,
    rejectMutation,
    publishMutation,
    archiveMutation,
    deleteMutation,
  };
}

// Events
export function useEventsList() {
  return useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: () => backendApi.events.list(),
  });
}

export function useEventsMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.events.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EventItem> }) =>
      backendApi.events.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => backendApi.events.publish(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => backendApi.events.archive(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.events.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, publishMutation, archiveMutation, deleteMutation };
}

// Heritage
export function useHeritageList() {
  return useQuery({
    queryKey: QUERY_KEYS.HERITAGE,
    queryFn: () => backendApi.heritage.list(),
  });
}

export function useHeritageMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<Heritage, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.heritage.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Heritage> }) =>
      backendApi.heritage.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => backendApi.heritage.publish(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.heritage.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HERITAGE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// Leadership
export function useLeadershipList() {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERSHIP,
    queryFn: () => backendApi.leadership.list(),
  });
}

export function useLeadershipMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<Leadership, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.leadership.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Leadership> }) =>
      backendApi.leadership.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.leadership.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERSHIP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}

// Gallery
export function useGalleryList() {
  return useQuery({
    queryKey: QUERY_KEYS.GALLERY,
    queryFn: () => backendApi.gallery.list(),
  });
}

export function useGalleryMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.gallery.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Gallery> }) =>
      backendApi.gallery.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => backendApi.gallery.publish(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.gallery.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GALLERY });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// Publications
export function usePublicationsList() {
  return useQuery({
    queryKey: QUERY_KEYS.PUBLICATIONS,
    queryFn: () => backendApi.publications.list(),
  });
}

export function usePublicationsMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.publications.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Publication> }) =>
      backendApi.publications.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => backendApi.publications.publish(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_REVIEWS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.publications.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PUBLICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, publishMutation, deleteMutation };
}

// Projects
export function useProjectsList() {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => backendApi.projects.list(),
  });
}

export function useProjectsMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<DevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.projects.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DevelopmentProject> }) =>
      backendApi.projects.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.projects.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}

// Contacts (Inbox)
export function useContactsList() {
  return useQuery({
    queryKey: QUERY_KEYS.CONTACTS,
    queryFn: () => backendApi.contacts.list(),
  });
}

export function useContactsMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: 'UNREAD' | 'IN_PROGRESS' | 'RESOLVED';
      notes?: string;
    }) => backendApi.contacts.updateStatus(currentUser, id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendApi.contacts.delete(currentUser, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { updateStatusMutation, deleteMutation };
}

// Users
export function useUsersList() {
  const { currentUser } = useAdminStore();
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: () => backendApi.users.list(currentUser),
  });
}

export function useUsersMutations() {
  const queryClient = useQueryClient();
  const { currentUser } = useAdminStore();

  const createMutation = useMutation({
    mutationFn: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      backendApi.users.create(currentUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      backendApi.users.update(currentUser, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' }) =>
      backendApi.users.toggleStatus(currentUser, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: { name?: string; email?: string; phone?: string; title?: string; avatar?: string }) =>
      backendApi.users.updateProfile(currentUser, updates),
    onSuccess: (updatedUser) => {
      useAdminStore.getState().setCurrentUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUDIT_LOGS });
    },
  });

  return { createMutation, updateMutation, toggleStatusMutation, updateProfileMutation };
}

// Audit Logs
export function useAuditLogs() {
  const { currentUser } = useAdminStore();
  return useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOGS,
    queryFn: () => backendApi.auditLogs.list(currentUser),
    enabled: currentUser.role === 'SUPER_ADMIN',
  });
}
