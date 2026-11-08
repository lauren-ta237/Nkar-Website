import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuditLogs } from '../../../api/queries';
import { AuditAction, EntityType } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { EmptyState } from '../../common/EmptyState';

export const AuditLogsView: React.FC = () => {
  const { currentUser, switchRole } = useAdminStore();
  const { data: logs = [], isLoading } = useAuditLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  if (currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div className="py-16 px-4 text-center bg-white rounded-2xl border border-[#E8E4DA] max-w-lg mx-auto shadow-sm my-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">Governance Security Policy</h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
          Audit logs contain sensitive cryptographic tracking of administrative actions and are restricted
          strictly to <span className="font-semibold text-stone-900">SUPER ADMIN</span> accounts.
        </p>
        <button
          onClick={() => switchRole('SUPER_ADMIN')}
          className="mt-5 px-4 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-xl transition-colors cursor-pointer"
        >
          Switch to Super Admin to Inspect
        </button>
      </div>
    );
  }

  const filtered = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entityTitle && log.entityTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#153E2E]" />
            System Governance Audit Logs
          </h2>
          <p className="text-xs text-stone-500">
            Immutable system audit records tracking every create, update, publish, and delete action
          </p>
        </div>

        <span className="px-3 py-1 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg text-xs font-semibold text-stone-700">
          Total Logs: {logs.length}
        </span>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search details, admin name, or entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Recorded Actions</option>
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
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
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

      {/* Logs Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Audit Records Found"
          description="No governance records match the selected action or entity filter criteria."
        />
      ) : (
        <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E4DA] text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity Type</th>
                  <th className="py-3.5 px-4">Entity Target</th>
                  <th className="py-3.5 px-4">Operation Details</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                          log.action === 'PUBLISH' || log.action === 'APPROVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'CREATE'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'DELETE' || log.action === 'REJECT' || log.action === 'SUSPEND'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-stone-700">
                      {log.entityType}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate">
                        <span className="font-medium text-stone-900 block truncate">
                          {log.entityTitle || log.entityId}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block">
                          ID: {log.entityId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{log.details}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-stone-900 block">{log.adminName}</span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {log.adminRole.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-stone-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
