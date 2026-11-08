import React, { useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminStore } from './store/useAdminStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { UserProfileModal } from './components/layout/UserProfileModal';
import { PublicSitePreviewModal } from './components/layout/PublicSitePreviewModal';
import { LogoutModal } from './components/layout/LogoutModal';

// Module Views
import { DashboardView } from './components/modules/dashboard/DashboardView';
import { NewsView } from './components/modules/news/NewsView';
import { EventsView } from './components/modules/events/EventsView';
import { HeritageView } from './components/modules/heritage/HeritageView';
import { LeadershipView } from './components/modules/leadership/LeadershipView';
import { GalleryView } from './components/modules/gallery/GalleryView';
import { PublicationsView } from './components/modules/publications/PublicationsView';
import { ProjectsView } from './components/modules/projects/ProjectsView';
import { ContactView } from './components/modules/contact/ContactView';
import { UsersView } from './components/modules/users/UsersView';
import { AuditLogsView } from './components/modules/audit/AuditLogsView';
import { SettingsView } from './components/modules/settings/SettingsView';

export default function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminPortalContent />
    </QueryClientProvider>
  );
}

function AdminPortalContent() {
  const { currentPage, sidebarCollapsed, theme } = useAdminStore();

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderActiveView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'news':
        return <NewsView />;
      case 'events':
        return <EventsView />;
      case 'heritage':
        return <HeritageView />;
      case 'leadership':
        return <LeadershipView />;
      case 'gallery':
        return <GalleryView />;
      case 'publications':
        return <PublicationsView />;
      case 'projects':
        return <ProjectsView />;
      case 'contact':
        return <ContactView />;
      case 'users':
        return <UsersView />;
      case 'audit':
        return <AuditLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex transition-colors">
      {/* 1. Left-Hand Collapsible Sidebar */}
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

          {/* Active Module Screen */}
          {renderActiveView()}
        </main>
      </div>

      {/* Universal Floating Modals */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <UserProfileModal />
      <PublicSitePreviewModal />
      <LogoutModal />
    </div>
  );
}
