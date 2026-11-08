import React from 'react';
import { CheckCircle2, Clock, FileEdit, AlertTriangle, Archive, XCircle } from 'lucide-react';
import { ContentStatus, UserStatus, ProjectStatus, ContactStatus } from '../../types';

interface StatusBadgeProps {
  status: ContentStatus | UserStatus | ProjectStatus | ContactStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'PUBLISHED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{status === 'PUBLISHED' ? 'Published' : status === 'ACTIVE' ? 'Active' : status === 'COMPLETED' ? 'Completed' : 'Resolved'}</span>
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
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{status === 'SUBMITTED' ? 'Under Review' : 'In Progress'}</span>
        </span>
      );

    case 'DRAFT':
    case 'PLANNING':
    case 'UNREAD':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
          <FileEdit className="w-3.5 h-3.5 text-stone-500" />
          <span>{status === 'DRAFT' ? 'Draft' : status === 'PLANNING' ? 'Planning' : 'Unread'}</span>
        </span>
      );

    case 'REJECTED':
    case 'CANCELLED':
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200/80">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          <span>{status === 'REJECTED' ? 'Rejected' : status === 'SUSPENDED' ? 'Suspended' : 'Cancelled'}</span>
        </span>
      );

    case 'ARCHIVED':
    case 'ON_HOLD':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-100/70 px-2.5 py-1 rounded-md border border-stone-200">
          <Archive className="w-3.5 h-3.5 text-stone-400" />
          <span>{status === 'ARCHIVED' ? 'Archived' : 'On Hold'}</span>
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
