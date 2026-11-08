import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Download,
  ExternalLink,
  Edit,
  Trash2,
  FileText,
  Calendar,
} from 'lucide-react';
import { usePublicationsList, usePublicationsMutations } from '../../../api/queries';
import { Publication } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { PublicationsFormModal } from './PublicationsFormModal';

export const PublicationsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: publications = [], isLoading } = usePublicationsList();
  const { createMutation, updateMutation, publishMutation, deleteMutation } =
    usePublicationsMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = publications.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFormat = formatFilter === 'ALL' || p.fileType === formatFilter;
    return matchesSearch && matchesFormat;
  });

  const handleCreateOrUpdate = (data: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPub) {
      updateMutation.mutate(
        { id: editingPub.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingPub(null);
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

  const canEdit = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER' || currentUser.role === 'CONTENT_EDITOR';
  const canDelete = currentUser.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#153E2E]" />
            Books & Scholarly Publications
          </h2>
          <p className="text-xs text-stone-500">
            Historical monographs, linguistic dictionaries, customary law essays, and development blueprints
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPub(null);
            setFormModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, scholar or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All File Formats</option>
              <option value="PDF">PDF Documents</option>
              <option value="EPUB">EPUB E-Books</option>
              <option value="DOCX">DOCX Manuscripts</option>
              <option value="EXTERNAL_LINK">External Repositories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Publications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Publications Found"
          description="Catalog scholarly monographs, research papers, or community manuals."
          actionLabel="Add Publication"
          onAction={() => {
            setEditingPub(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((pub) => (
            <div
              key={pub.id}
              className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4">
                  {pub.coverImage ? (
                    <img
                      src={pub.coverImage}
                      alt={pub.title}
                      className="w-20 h-28 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-28 rounded-xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center text-stone-400 shrink-0">
                      <FileText className="w-8 h-8" />
                      <span className="text-[10px] font-bold mt-1 uppercase">{pub.fileType}</span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-mono uppercase">
                        {pub.fileType} {pub.fileSize && `· ${pub.fileSize}`}
                      </span>
                      <StatusBadge status={pub.status} />
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#153E2E] transition-colors line-clamp-2 leading-snug">
                      {pub.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#8B6508] mt-1 truncate">
                      By {pub.author}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-2 font-mono">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{pub.publicationDate}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-3.5 line-clamp-2 leading-relaxed">
                  {pub.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs">
                <a
                  href={pub.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#153E2E] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Access Document</span>
                </a>

                <div className="flex items-center gap-1">
                  {canEdit && (
                    <button
                      onClick={() => {
                        setEditingPub(pub);
                        setFormModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit Publication"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setDeleteConfirmId(pub.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Publication"
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
        <PublicationsFormModal
          isOpen={formModalOpen}
          initialData={editingPub}
          onClose={() => {
            setFormModalOpen(false);
            setEditingPub(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Publication"
          message="Are you sure you want to delete this publication record? It will be removed from the public digital library."
          confirmLabel="Delete Publication"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
