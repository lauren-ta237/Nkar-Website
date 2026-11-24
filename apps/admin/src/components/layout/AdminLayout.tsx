import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationDrawer } from './NotificationDrawer';
import { UserProfileModal } from './UserProfileModal';
import { LogoutModal } from './LogoutModal';

export const AdminLayout: React.FC = () => {
  const { sidebarCollapsed, theme } = useAdminStore();

  // Sync theme with document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex transition-colors">
      {/* 1. Left-Hand Collapsible Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Viewport Canvas with dynamic margin based on sidebar state */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ml-0 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Inner Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumb Navigation Trail */}
          <Breadcrumb />

          {/* Active Route Screen */}
          <Outlet />
        </main>
      </div>

      {/* Universal Floating Modals */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <UserProfileModal />
      <LogoutModal />
    </div>
  );
};
