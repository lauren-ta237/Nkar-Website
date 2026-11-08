import React, { useState } from 'react';
import {
  Crown,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';
import { useLeadershipList, useLeadershipMutations } from '../../../api/queries';
import { Leadership } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { LeadershipFormModal } from './LeadershipFormModal';

export const LeadershipView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: leadership = [], isLoading } = useLeadershipList();
  const { createMutation, updateMutation, deleteMutation } = useLeadershipMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leadership | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = leadership.filter(
    (l) =>
      searchQuery === '' ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.traditionalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.lineage && l.lineage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateOrUpdate = (data: Omit<Leadership, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingLeader) {
      updateMutation.mutate(
        { id: editingLeader.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingLeader(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setFormModalOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const canManage = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER';
  const canDelete = currentUser.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            Traditional Leadership Directory
          </h2>
          <p className="text-xs text-stone-500">
            Royal Fon, Seven Kingmakers (Fais of Nkar), Queen Mothers (Yaa Woo), and traditional dignitaries
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingLeader(null);
              setFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leader</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by traditional title, royal name, or dynasty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
          />
        </div>
      </div>

      {/* Leadership Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Crown}
          title="No Traditional Leaders Found"
          description="Add royal leaders and traditional kingmakers of Nkar Fondom to maintain the official hierarchy."
          actionLabel={canManage ? 'Add Royal Leader' : undefined}
          onAction={() => {
            setEditingLeader(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((leader) => (
            <div
              key={leader.id}
              className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={leader.portraitPhoto}
                      alt={leader.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#153E2E] text-[#D4AF37] font-bold text-[11px] flex items-center justify-center border border-white">
                      #{leader.displayOrder}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <StatusBadge status={leader.status} />
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#153E2E] transition-colors mt-1.5 leading-tight">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#8B6508] mt-0.5 leading-snug">
                      {leader.traditionalTitle}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Period: {leader.activePeriod}</span>
                  </div>

                  {leader.lineage && (
                    <p className="text-[11px] text-stone-500 bg-[#FAF8F5] p-2 rounded-lg border border-[#EAE6DD] truncate">
                      Lineage: <span className="font-semibold text-stone-700">{leader.lineage}</span>
                    </p>
                  )}

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mt-2">
                    {leader.biography}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono">
                  Order Index: #{leader.displayOrder}
                </span>

                <div className="flex items-center gap-1">
                  {canManage && (
                    <button
                      onClick={() => {
                        setEditingLeader(leader);
                        setFormModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setDeleteConfirmId(leader.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Leader"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {formModalOpen && (
        <LeadershipFormModal
          isOpen={formModalOpen}
          initialData={editingLeader}
          onClose={() => {
            setFormModalOpen(false);
            setEditingLeader(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Traditional Leader Profile"
          message="Are you sure you want to delete this royal leadership profile? This will remove their official seat record from the Fondom directory."
          confirmLabel="Delete Leader"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
