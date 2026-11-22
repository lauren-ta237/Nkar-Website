import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  ShieldAlert,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAdminUsersList, useAdminUsersMutations } from '@/lib/api/users.api';
import { User, Role } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { UserFormModal } from './UserFormModal';

export const UsersView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: users = [], isLoading } = useAdminUsersList();
  const { createMutation, updateMutation, toggleStatusMutation, deleteMutation } = useAdminUsersMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [suspendConfirmUser, setSuspendConfirmUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const filtered = users.filter((u) => {
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateOrUpdate = (data: any) => {
    if (editingUser) {
      updateMutation.mutate(
        { id: editingUser.id, data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingUser(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setFormModalOpen(false),
      });
    }
  };

  const handleToggleStatus = (target: User) => {
    toggleStatusMutation.mutate(target.id, {
      onSuccess: () => setSuspendConfirmUser(null),
    });
  };

  const handleDeleteUser = (target: User) => {
    deleteMutation.mutate(target.id, {
      onSuccess: () => setDeleteConfirmUser(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-stone-100 dark:bg-stone-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
            Administrator & Role Management
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Control access roles, assign permissions, and provision council officer accounts
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={() => {
              setEditingUser(null);
              setFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Administrator</span>
          </button>
        )}
      </div>

      {/* Security notice if not Super Admin */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold">Restricted Governance Scope</p>
            <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
              You are currently authenticated as <span className="font-semibold">{currentUser.name}</span> with role{' '}
              <span className="font-mono uppercase font-bold">{currentUser.role}</span>. Administrator management operations
              (creating accounts, changing roles, suspending access) are strictly restricted to Super Admins.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="p-4 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search administrators by name, email, or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#153E2E] text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-700 dark:text-stone-200"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admins</option>
              <option value="CONTENT_REVIEWER">Content Reviewers</option>
              <option value="CONTENT_EDITOR">Content Editors</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] dark:bg-stone-950 border-b border-[#E8E4DA] dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((user) => {
                const isSelf = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                              {user.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold text-[#153E2E] dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono block truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-[#153E2E] text-[#D4AF37]'
                            : user.role === 'CONTENT_REVIEWER'
                            ? 'bg-[#D4AF37]/20 text-[#8B6508] dark:text-amber-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-600 dark:text-stone-400">
                      <span className="font-mono text-[11px]">{user.email}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-500 dark:text-stone-400 text-[11px]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {isSuperAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setFormModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer transition-colors"
                              title="Edit Permissions"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {!isSelf && (
                              <>
                                <button
                                  onClick={() => setSuspendConfirmUser(user)}
                                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                                    user.status === 'ACTIVE'
                                      ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                      : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                  }`}
                                  title={user.status === 'ACTIVE' ? 'Suspend Access' : 'Activate Access'}
                                >
                                  {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>

                                <button
                                  onClick={() => setDeleteConfirmUser(user)}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer transition-colors"
                                  title="Delete Administrator"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {formModalOpen && (
        <UserFormModal
          isOpen={formModalOpen}
          initialData={editingUser}
          onClose={() => {
            setFormModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Suspend Confirmation Modal */}
      {suspendConfirmUser && (
        <ConfirmModal
          isOpen={true}
          title={suspendConfirmUser.status === 'ACTIVE' ? 'Suspend Administrator Account' : 'Reactivate Administrator Account'}
          message={`Are you sure you want to ${
            suspendConfirmUser.status === 'ACTIVE' ? 'suspend' : 'reactivate'
          } access for ${suspendConfirmUser.name}?`}
          confirmLabel={suspendConfirmUser.status === 'ACTIVE' ? 'Suspend Access' : 'Activate Access'}
          onConfirm={() => handleToggleStatus(suspendConfirmUser)}
          onCancel={() => setSuspendConfirmUser(null)}
          isLoading={toggleStatusMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <ConfirmModal
          isOpen={true}
          title="Delete Administrator Account"
          message={`Are you sure you want to permanently delete the administrator profile for ${deleteConfirmUser.name}? This action cannot be reversed.`}
          confirmLabel="Delete Account"
          onConfirm={() => handleDeleteUser(deleteConfirmUser)}
          onCancel={() => setDeleteConfirmUser(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
