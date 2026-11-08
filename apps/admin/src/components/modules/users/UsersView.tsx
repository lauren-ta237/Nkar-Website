import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  Edit3,
  Edit,
  UserX,
  CheckCircle,
  Mail,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import { useUsersList, useUsersMutations } from '../../../api/queries';
import { User, Role } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { UserFormModal } from './UserFormModal';

export const UsersView: React.FC = () => {
  const { currentUser, switchRole } = useAdminStore();
  const { data: users = [], isLoading } = useUsersList();
  const { createMutation, updateMutation, toggleStatusMutation } = useUsersMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [suspendConfirmUser, setSuspendConfirmUser] = useState<User | null>(null);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const filtered = users.filter((u) => {
    const matchesSearch =
      searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateOrUpdate = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingUser) {
      updateMutation.mutate(
        { id: editingUser.id, updates: data },
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
    const newStatus = target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    toggleStatusMutation.mutate(
      { id: target.id, status: newStatus },
      {
        onSuccess: () => setSuspendConfirmUser(null),
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#153E2E]" />
            Administrator & Role Management
          </h2>
          <p className="text-xs text-stone-500">
            Control access roles, assign permissions, and provision council officer accounts
          </p>
        </div>

        {isSuperAdmin ? (
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
        ) : (
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="px-3 py-1.5 text-xs font-semibold text-[#153E2E] bg-[#EAF2EE] border border-[#153E2E]/30 rounded-xl hover:bg-[#D5E7DD] transition-colors cursor-pointer self-start sm:self-auto"
          >
            Switch to Super Admin to Edit
          </button>
        )}
      </div>

      {/* Security notice if not Super Admin */}
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">Restricted Governance Scope</p>
            <p className="mt-0.5 leading-relaxed text-amber-800">
              You are currently authenticated as <span className="font-semibold">{currentUser.name}</span> with role{' '}
              <span className="font-mono uppercase font-bold">{currentUser.role}</span>. Administrator management operations
              (creating accounts, changing roles, suspending access) are strictly restricted to Super Admins. Use the Role
              Simulator in the top bar to test Super Admin powers.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search administrators by name, email, or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
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
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8E4DA] text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((user) => {
                const isSelf = user.id === currentUser.id;
                return (
                  <tr key={user.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900 truncate">{user.name}</span>
                            {isSelf && (
                              <span className="text-[9px] font-bold text-[#153E2E] bg-[#EAF2EE] px-1.5 py-0.2 rounded uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 truncate block">
                            {user.title || user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-[#153E2E]/10 text-[#153E2E]'
                            : user.role === 'CONTENT_REVIEWER'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {user.role === 'SUPER_ADMIN' && <Shield className="w-3 h-3 text-[#153E2E]" />}
                        {user.role === 'CONTENT_REVIEWER' && <UserCheck className="w-3 h-3 text-amber-700" />}
                        {user.role === 'CONTENT_EDITOR' && <Edit3 className="w-3 h-3 text-stone-600" />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-[11px]">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{user.email}</span>
                        </p>
                        {user.phone && (
                          <p className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{user.phone}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isSuperAdmin ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setFormModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Administrator"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => setSuspendConfirmUser(user)}
                                className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                                  user.status === 'ACTIVE'
                                    ? 'text-red-700 bg-red-50 hover:bg-red-100'
                                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                }`}
                              >
                                {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Read-Only</span>
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

      {/* Form Modal */}
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

      {/* Suspend Confirmation */}
      {suspendConfirmUser && (
        <ConfirmModal
          isOpen={true}
          title={
            suspendConfirmUser.status === 'ACTIVE'
              ? `Suspend Administrator: ${suspendConfirmUser.name}`
              : `Activate Administrator: ${suspendConfirmUser.name}`
          }
          message={
            suspendConfirmUser.status === 'ACTIVE'
              ? `Are you sure you want to suspend ${suspendConfirmUser.name}? They will immediately lose all administrative access to the platform.`
              : `Are you sure you want to reactivate ${suspendConfirmUser.name}? Their portal credentials and permissions will be restored.`
          }
          confirmLabel={suspendConfirmUser.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
          isDestructive={suspendConfirmUser.status === 'ACTIVE'}
          onConfirm={() => handleToggleStatus(suspendConfirmUser)}
          onCancel={() => setSuspendConfirmUser(null)}
          isLoading={toggleStatusMutation.isPending}
        />
      )}
    </div>
  );
};
