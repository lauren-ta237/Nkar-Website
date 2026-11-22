import { create } from 'zustand';
import { User } from '../types';

interface AdminState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;

  // Active Authenticated Administrator (synced from /api/v1/auth/me)
  currentUser: User;
  setCurrentUser: (user: User) => void;

  // Theme state (persisted to localStorage & root class)
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
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (open: boolean) => void;

  // Breadcrumb custom trail if needed
  customBreadcrumb?: string;
  setCustomBreadcrumb: (text?: string) => void;
}

const DEFAULT_ADMIN_USER: User = {
  id: '',
  name: 'Administrator',
  email: 'admin@nkarwoolan.org',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAdminStore = create<AdminState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  currentUser: DEFAULT_ADMIN_USER,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Theme initialization
  theme:
    (typeof window !== 'undefined' &&
      (localStorage.getItem('nkar_theme') as 'light' | 'dark')) ||
    'light',
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
  logoutConfirmOpen: false,
  setLogoutConfirmOpen: (open) => set({ logoutConfirmOpen: open }),

  customBreadcrumb: undefined,
  setCustomBreadcrumb: (text) => set({ customBreadcrumb: text }),
}));
