import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  ArrowRight,
  Eye,
  Copy,
  Check,
  FileCode,
  Layers,
  Database,
  Lock,
} from 'lucide-react';
import { useAdminAuditLogs } from '@/lib/api/audit.api';
import { AuditLog } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { EmptyState } from '../../common/EmptyState';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export const AuditLogsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  // Immediate protection: Only SUPER_ADMIN can view or query audit records
  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const { data: logs = [], isLoading } = useAdminAuditLogs({ enabled: isSuperAdmin });

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  // Detail Sheet state
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.resource_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.resource_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.actor_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.resource_type === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'PUBLISH':
      case 'APPROVE':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'CREATE':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'UPDATE':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'DELETE':
      case 'REJECT':
      case 'SUSPEND':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#153E2E] dark:text-[#D4AF37]" />
            System Governance Audit Logs
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Immutable governance audit trail restricted to Super Administrator oversight
          </p>
        </div>

        <span className="px-3 py-1 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-xs self-start sm:self-auto">
          {logs.length} Recorded Events
        </span>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword, entity, or actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-700 dark:text-stone-300"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="PUBLISH">PUBLISH</option>
              <option value="APPROVE">APPROVE</option>
              <option value="REJECT">REJECT</option>
              <option value="SUSPEND">SUSPEND</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-700 dark:text-stone-300"
            >
              <option value="ALL">All Database Entities</option>
              <option value="News">News</option>
              <option value="Events">Events</option>
              <option value="Heritage">Heritage</option>
              <option value="Leadership">Leadership</option>
              <option value="Gallery">Gallery</option>
              <option value="Publications">Publications</option>
              <option value="DevelopmentProjects">DevelopmentProjects</option>
              <option value="ContactSubmissions">ContactSubmissions</option>
              <option value="Users">Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Streamlined Essential Logs Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Audit Records Found"
          description="No governance records match the selected action or entity filter criteria."
        />
      ) : (
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-stone-950 border-b border-[#E8E4DA] dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Operation Summary</th>
                  <th className="py-3 px-4 whitespace-nowrap">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
                  >
                    {/* 1. Action Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono border ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* 2. Entity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {log.resource_type}
                      </span>
                    </td>

                    {/* 3. Administrator */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                        <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-mono text-[11px] truncate max-w-[130px]">
                          {log.actor_id || 'System'}
                        </span>
                      </div>
                    </td>

                    {/* 4. Operation Summary (Clean single line) */}
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-stone-600 dark:text-stone-300 truncate" title={log.details || ''}>
                        {log.details || '—'}
                      </p>
                    </td>

                    {/* 5. Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                      {new Date(log.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* 6. Inspect Trigger */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="p-1.5 text-stone-400 group-hover:text-[#153E2E] dark:group-hover:text-[#D4AF37] hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                        title="Inspect Full Audit Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Audit Detail Sheet */}
      <Sheet open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800">
          {selectedLog && (
            <>
              {/* Drawer Header */}
              <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono border ${getActionBadgeClass(
                      selectedLog.action
                    )}`}
                  >
                    {selectedLog.action}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(selectedLog.created_at).toUTCString()}
                  </span>
                </div>
                <SheetTitle className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#153E2E] dark:text-[#D4AF37]" />
                  Audit Event Dossier
                </SheetTitle>
                <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
                  Cryptographic ledger record for {selectedLog.resource_type} modification
                </SheetDescription>
              </SheetHeader>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Primary Metadata Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF8F5] dark:bg-stone-800/60 border border-[#E8E4DA] dark:border-stone-700/60 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                      Resource Type
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {selectedLog.resource_type}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] dark:bg-stone-800/60 border border-[#E8E4DA] dark:border-stone-700/60 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                      Severity Level
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block uppercase">
                      {selectedLog.severity || 'INFO'}
                    </span>
                  </div>
                </div>

                {/* Identifiers Card */}
                <div className="p-4 bg-white dark:bg-stone-950 border border-[#E8E4DA] dark:border-stone-800 rounded-xl space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider mb-1">
                      Audit Event Record ID
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 bg-[#FAF8F5] dark:bg-stone-900 rounded-lg font-mono text-[11px] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800">
                      <span className="truncate">{selectedLog.id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedLog.id, 'event-id')}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                        title="Copy Event ID"
                      >
                        {copiedId === 'event-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider mb-1">
                      Target Entity ID (Resource)
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 bg-[#FAF8F5] dark:bg-stone-900 rounded-lg font-mono text-[11px] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800">
                      <span className="truncate">{selectedLog.resource_id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedLog.resource_id, 'res-id')}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                        title="Copy Resource ID"
                      >
                        {copiedId === 'res-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider mb-1">
                      Administrator Actor ID
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 bg-[#FAF8F5] dark:bg-stone-900 rounded-lg font-mono text-[11px] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800">
                      <span className="truncate">{selectedLog.actor_id || 'System / Auto Engine'}</span>
                      {selectedLog.actor_id && (
                        <button
                          onClick={() => copyToClipboard(selectedLog.actor_id!, 'actor-id')}
                          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                          title="Copy Actor ID"
                        >
                          {copiedId === 'actor-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operation Details Narrative */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    Operation Narrative
                  </span>
                  <div className="p-3.5 bg-[#FAF8F5] dark:bg-stone-800/60 border border-[#E8E4DA] dark:border-stone-700/60 rounded-xl text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                    {selectedLog.details || 'No extended narrative recorded for this action.'}
                  </div>
                </div>

                {/* Payload / Changes Diff JSON Block */}
                {(selectedLog.changes || selectedLog.metadata_json) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" />
                        State Changes & Payload Diff
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(selectedLog.changes || selectedLog.metadata_json, null, 2),
                            'payload-json'
                          )
                        }
                        className="text-[11px] font-semibold text-[#153E2E] dark:text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'payload-json' ? 'Copied' : 'Copy JSON'}
                      </button>
                    </div>

                    <pre className="p-3 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-56 border border-stone-800 leading-tight">
                      {JSON.stringify(selectedLog.changes || selectedLog.metadata_json, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Governance Security Footprint */}
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    This record is sealed within the immutable audit log and cannot be altered or removed by any administrative role.
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
