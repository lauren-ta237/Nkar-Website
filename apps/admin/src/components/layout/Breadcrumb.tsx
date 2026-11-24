import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';

const SEGMENT_NAMES: Record<string, string> = {
  dashboard: 'Executive Dashboard',
  news: 'News & Announcements',
  events: 'Events Management',
  heritage: 'Heritage & Traditions',
  leadership: 'Traditional Leadership',
  gallery: 'Gallery Management',
  publications: 'Books & Publications',
  projects: 'Development Projects',
  contact: 'Contact Submissions',
  users: 'Administrator Management',
  audit: 'System Audit Logs',
  settings: 'Platform Settings',
  new: 'Create New',
  edit: 'Edit Details',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { customBreadcrumb } = useAdminStore();

  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-4 select-none" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-[#153E2E] dark:hover:text-[#D4AF37] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Nkar Woo Làn</span>
      </Link>

      {segments.map((segment: string, index: number) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1 && !customBreadcrumb;
        const displayName = SEGMENT_NAMES[segment.toLowerCase()] || (segment.length > 15 ? 'Details' : segment);

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
            {isLast ? (
              <span className="text-stone-900 dark:text-stone-100 font-semibold truncate max-w-xs">
                {displayName}
              </span>
            ) : (
              <Link
                to={path}
                className="hover:text-[#153E2E] dark:hover:text-[#D4AF37] transition-colors font-medium truncate max-w-[120px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}

      {customBreadcrumb && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
          <span className="text-[#153E2E] dark:text-emerald-400 font-semibold truncate max-w-xs">
            {customBreadcrumb}
          </span>
        </>
      )}
    </nav>
  );
};
