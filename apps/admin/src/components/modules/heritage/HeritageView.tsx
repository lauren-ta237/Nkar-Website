import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Search,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  ScrollText,
} from 'lucide-react';
import { useHeritageList, useHeritageMutations } from '../../../api/queries';
import { Heritage, HeritageCategory } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { HeritageFormModal } from './HeritageFormModal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

const CATEGORY_NAMES: Record<HeritageCategory, string> = {
  VILLAGE_HISTORY: 'Village History',
  CUSTOMS: 'Customs & Rites',
  LANGUAGE: 'Language & Proverbs',
  ROYAL_LINEAGE: 'Royal Lineage',
  HISTORICAL_ARTIFACTS: 'Historical Artifacts',
};

export const HeritageView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: heritage = [], isLoading } = useHeritageList();
  const { createMutation, updateMutation, publishMutation, deleteMutation } = useHeritageMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingHeritage, setEditingHeritage] = useState<Heritage | null>(null);
  const [viewHeritage, setViewHeritage] = useState<Heritage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = heritage.filter((h) => {
    const matchesSearch =
      searchQuery === '' ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.oralTraditionSource && h.oralTraditionSource.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || h.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || h.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateOrUpdate = (data: Omit<Heritage, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingHeritage) {
      updateMutation.mutate(
        { id: editingHeritage.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingHeritage(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#153E2E]" />
            Heritage & Oral Tradition Archives
          </h2>
          <p className="text-xs text-stone-500">
            Village history, royal lineage, traditional regalia, and indigenous language preservation
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHeritage(null);
            setFormModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Document Heritage</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search oral traditions, titles, or elders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Heritage Domains</option>
              {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published (Verified)</option>
              <option value="APPROVED">Approved</option>
              <option value="SUBMITTED">Under Review</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Heritage Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No Heritage Records Found"
          description="Document the sacred history, customs, or regalia of Nkar Fondom to preserve them for future generations."
          actionLabel="Document Heritage"
          onAction={() => {
            setEditingHeritage(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const canEdit =
              currentUser.role === 'SUPER_ADMIN' ||
              currentUser.role === 'CONTENT_REVIEWER' ||
              (currentUser.role === 'CONTENT_EDITOR' && item.authorId === currentUser.id);

            const canDelete = currentUser.role === 'SUPER_ADMIN';

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#153E2E] bg-[#EAF2EE] px-2 py-0.5 rounded uppercase tracking-wider">
                      {CATEGORY_NAMES[item.category] || item.category}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#153E2E] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>

                  {item.oralTraditionSource && (
                    <div className="mt-3 p-2 bg-[#FAF8F5] rounded-lg border border-[#EAE6DD] text-[11px] text-stone-500 flex items-center gap-1.5">
                      <ScrollText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">Source: {item.oralTraditionSource}</span>
                    </div>
                  )}

                  {item.supportingMedia && item.supportingMedia.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 overflow-hidden">
                      {item.supportingMedia.slice(0, 3).map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {item.supportingMedia.length > 3 && (
                        <span className="text-[10px] text-stone-400 font-semibold">
                          +{item.supportingMedia.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">
                    Updated {new Date(item.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewHeritage(item)}
                      className="p-1.5 text-stone-500 hover:text-[#153E2E] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      title="Read Full Narrative"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingHeritage(item);
                          setFormModalOpen(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {item.status === 'SUBMITTED' && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && (
                      <button
                        onClick={() => publishMutation.mutate(item.id)}
                        className="px-2 py-1 text-[11px] font-bold text-[#153E2E] bg-[#D4AF37]/30 hover:bg-[#D4AF37] rounded-md transition-colors cursor-pointer"
                      >
                        Publish Live
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Heritage Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {formModalOpen && (
        <HeritageFormModal
          isOpen={formModalOpen}
          initialData={editingHeritage}
          onClose={() => {
            setFormModalOpen(false);
            setEditingHeritage(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* View Details Sheet */}
      <Sheet open={!!viewHeritage} onOpenChange={(open) => !open && setViewHeritage(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
          {viewHeritage && (
            <>
              <SheetHeader className="p-4 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
                <div className="flex items-center gap-2">
                  <StatusBadge status={viewHeritage.status} />
                  <span className="text-xs font-semibold text-stone-500">
                    · {CATEGORY_NAMES[viewHeritage.category] || viewHeritage.category}
                  </span>
                </div>
                <SheetTitle className="font-bold text-stone-900 text-sm mt-1">
                  Heritage Archive Dossier
                </SheetTitle>
                <SheetDescription className="text-xs text-stone-500">
                  Preserved cultural knowledge, custodianship records, and media
                </SheetDescription>
              </SheetHeader>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <h2 className="text-xl font-bold text-stone-900 leading-snug">{viewHeritage.title}</h2>
                {viewHeritage.oralTraditionSource && (
                  <p className="text-xs text-stone-500 italic">Custodial Source: {viewHeritage.oralTraditionSource}</p>
                )}
                <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DA] text-xs font-medium text-stone-700 leading-relaxed">
                  {viewHeritage.summary}
                </div>
                <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-stone-100">
                  {viewHeritage.content}
                </div>

                {viewHeritage.supportingMedia.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Preserved Media</p>
                    <div className="grid grid-cols-2 gap-3">
                      {viewHeritage.supportingMedia.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="w-full h-36 rounded-xl object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Heritage Record"
          message="Are you sure you want to delete this heritage archive? This will remove oral history and lineage documentation from the records."
          confirmLabel="Delete Record"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
