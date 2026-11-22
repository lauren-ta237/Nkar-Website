import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './components/auth/AuthGuard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AdminLayout } from './components/layout/AdminLayout';

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

import { useAdminStore } from './store/useAdminStore';

// Dedicated Content Editors
import { NewsEditorView } from './components/modules/news/NewsEditorView';
import { EventEditorView } from './components/modules/events/EventEditorView';
import { HeritageEditorView } from './components/modules/heritage/HeritageEditorView';
import { ProjectEditorView } from './components/modules/projects/ProjectEditorView';

function SuperAdminRoute({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAdminStore();
  if (currentUser?.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthGuard>
          <BrowserRouter>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardView />} />

                {/* News & Announcements */}
                <Route path="/news" element={<NewsView />} />
                <Route path="/news/new" element={<NewsEditorView />} />
                <Route path="/news/:id/edit" element={<NewsEditorView />} />

                {/* Events */}
                <Route path="/events" element={<EventsView />} />
                <Route path="/events/new" element={<EventEditorView />} />
                <Route path="/events/:id/edit" element={<EventEditorView />} />

                {/* Cultural Heritage */}
                <Route path="/heritage" element={<HeritageView />} />
                <Route path="/heritage/new" element={<HeritageEditorView />} />
                <Route path="/heritage/:id/edit" element={<HeritageEditorView />} />

                {/* Development Projects */}
                <Route path="/projects" element={<ProjectsView />} />
                <Route path="/projects/new" element={<ProjectEditorView />} />
                <Route path="/projects/:id/edit" element={<ProjectEditorView />} />

                {/* Other Administrative Modules */}
                <Route path="/leadership" element={<LeadershipView />} />
                <Route path="/gallery" element={<GalleryView />} />
                <Route path="/publications" element={<PublicationsView />} />
                <Route path="/contact" element={<ContactView />} />
                <Route
                  path="/users"
                  element={
                    <SuperAdminRoute>
                      <UsersView />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <SuperAdminRoute>
                      <AuditLogsView />
                    </SuperAdminRoute>
                  }
                />
                <Route path="/settings" element={<SettingsView />} />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthGuard>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
