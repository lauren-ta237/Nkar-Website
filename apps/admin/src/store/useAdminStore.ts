import { create } from 'zustand';
import { User, Role } from '../types';

export type AdminPage =
  | 'dashboard'
  | 'news'
  | 'events'
  | 'heritage'
  | 'leadership'
  | 'gallery'
  | 'publications'
  | 'projects'
  | 'contact'
  | 'users'
  | 'audit'
  | 'settings';

interface AdminState {
  currentPage: AdminPage;
  setCurrentPage: (page: AdminPage) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  
  // Active Authenticated Administrator (Role Switcher for RBAC testing)
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  
  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Modals and UI state
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  publicPreviewOpen: boolean;
  setPublicPreviewOpen: (open: boolean) => void;
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (open: boolean) => void;
  
  // Breadcrumb custom trail if needed
  customBreadcrumb?: string;
  setCustomBreadcrumb: (text?: string) => void;
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Fon Martin Fongang',
    email: 'admin@nkarwoolan.org',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    avatar_url: null,
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2026-11-06T09:30:00Z',
  },
  {
    id: 'usr-2',
    name: 'Dr. Shey Berinyuy',
    email: 'reviewer@nkarwoolan.org',
    role: 'CONTENT_REVIEWER',
    status: 'ACTIVE',
    avatar_url: null,
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2026-11-06T08:15:00Z',
  },
  {
    id: 'usr-3',
    name: 'Yaa Stella Wirba',
    email: 'editor@nkarwoolan.org',
    role: 'CONTENT_EDITOR',
    status: 'ACTIVE',
    avatar_url: null,
    created_at: '2025-03-01T09:30:00Z',
    updated_at: '2026-11-05T14:45:00Z',
  },
];

export const useAdminStore = create<AdminState>((set, get) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page, customBreadcrumb: undefined }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  
  currentUser: INITIAL_USERS[0],
  setCurrentUser: (user) => set({ currentUser: user }),
  switchRole: (role) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      set({ currentUser: found });
    }
  },
  
  // Theme initialization
  theme: (typeof window !== 'undefined' && (localStorage.getItem('nkar_theme') as 'light' | 'dark')) || 'light',
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('nkar_theme', nextTheme);
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    });
  },
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nkar_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  searchModalOpen: false,
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  notificationDrawerOpen: false,
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  profileModalOpen: false,
  setProfileModalOpen: (open) => set({ profileModalOpen: open }),
  publicPreviewOpen: false,
  setPublicPreviewOpen: (open) => set({ publicPreviewOpen: open }),
  logoutConfirmOpen: false,
  setLogoutConfirmOpen: (open) => set({ logoutConfirmOpen: open }),
  
  customBreadcrumb: undefined,
  setCustomBreadcrumb: (text) => set({ customBreadcrumb: text }),
}));
