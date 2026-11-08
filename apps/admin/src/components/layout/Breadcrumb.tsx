import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAdminStore, AdminPage } from '../../store/useAdminStore';

const PAGE_NAMES: Record<AdminPage, string> = {
  dashboard: 'Executive Dashboard',
  news: 'News & Announcements',
  events: 'Events Management',
  heritage: 'Heritage & Oral Traditions',
  leadership: 'Traditional Leadership',
  gallery: 'Gallery Management',
  publications: 'Books & Publications',
  projects: 'Development Projects',
  contact: 'Contact Submissions',
  users: 'Administrator Management',
  audit: 'System Audit Logs',
  settings: 'Platform Settings',
};

export const Breadcrumb: React.FC = () => {
  const { currentPage, setCurrentPage, customBreadcrumb } = useAdminStore();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-4 select-none" aria-label="Breadcrumb">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className="flex items-center gap-1 hover:text-[#153E2E] dark:hover:text-[#D4AF37] transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Nkar Woo Làn</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />

      <button
        onClick={() => setCurrentPage(currentPage)}
        className={`hover:text-[#153E2E] dark:hover:text-[#D4AF37] transition-colors cursor-pointer font-medium ${
          customBreadcrumb ? 'text-stone-500 dark:text-stone-400' : 'text-stone-900 dark:text-stone-100 font-semibold'
        }`}
      >
        {PAGE_NAMES[currentPage]}
      </button>

      {customBreadcrumb && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
          <span className="text-[#153E2E] dark:text-emerald-400 font-semibold truncate max-w-xs">{customBreadcrumb}</span>
        </>
      )}
    </nav>
  );
};
