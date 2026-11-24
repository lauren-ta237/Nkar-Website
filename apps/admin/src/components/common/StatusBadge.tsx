import React from 'react';
import { CheckCircle2, Clock, FileEdit, AlertTriangle, Archive, XCircle } from 'lucide-react';
import { ContentStatus, UserStatus, ProjectStatus, ContactStatus } from '../../types';

interface StatusBadgeProps {
  status: ContentStatus | UserStatus | ProjectStatus | ContactStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || '').toUpperCase();
  switch (norm) {
    case 'PUBLISHED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{norm === 'PUBLISHED' ? 'Published' : norm === 'ACTIVE' ? 'Active' : norm === 'COMPLETED' ? 'Completed' : 'Resolved'}</span>
        </span>
      );

    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#153E2E] bg-[#EAF2EE] px-2.5 py-1 rounded-md border border-[#153E2E]/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#153E2E]" />
          <span>Approved</span>
        </span>
      );

    case 'SUBMITTED':
    case 'IN_PROGRESS':
    case 'ONGOING':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{norm === 'SUBMITTED' ? 'Under Review' : 'In Progress'}</span>
        </span>
      );

    case 'UNREAD':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/70 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-700/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Unread</span>
        </span>
      );

    case 'DRAFT':
    case 'PLANNING':
    case 'PROPOSED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
          <FileEdit className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
          <span>{norm === 'DRAFT' ? 'Draft' : norm === 'PROPOSED' ? 'Proposed' : 'Planning'}</span>
        </span>
      );

    case 'REJECTED':
    case 'CANCELLED':
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200/80">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          <span>{norm === 'REJECTED' ? 'Rejected' : norm === 'SUSPENDED' ? 'Suspended' : 'Cancelled'}</span>
        </span>
      );

    case 'ARCHIVED':
    case 'ON_HOLD':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-100/70 px-2.5 py-1 rounded-md border border-stone-200">
          <Archive className="w-3.5 h-3.5 text-stone-400" />
          <span>{norm === 'ARCHIVED' ? 'Archived' : 'On Hold'}</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
          {status}
        </span>
      );
  }
};
