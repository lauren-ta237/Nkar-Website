import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Video,
  Eye,
  Edit,
  Trash2,
  Folder,
  Tag,
} from 'lucide-react';
import { useGalleryList, useGalleryMutations } from '../../../api/queries';
import { Gallery } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { GalleryFormModal } from './GalleryFormModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export const GalleryView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: gallery = [], isLoading } = useGalleryList();
  const { createMutation, updateMutation, publishMutation, deleteMutation } = useGalleryMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [albumFilter, setAlbumFilter] = useState('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [viewImage, setViewImage] = useState<Gallery | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const albums = Array.from(new Set(gallery.map((g) => g.album)));

  const filtered = gallery.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAlbum = albumFilter === 'ALL' || item.album === albumFilter;
    return matchesSearch && matchesAlbum;
  });

  const handleCreateOrUpdate = (data: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingItem(null);
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
            <ImageIcon className="w-5 h-5 text-[#153E2E]" />
            Multimedia & Photographic Archives
          </h2>
          <p className="text-xs text-stone-500">
            Curated photographic galleries, ceremonial masquerade footage, and village landscapes
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Filter */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Curated Albums</option>
              {albums.map((alb) => (
                <option key={alb} value={alb}>
                  {alb}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Media Items Found"
          description="Upload high-resolution photography or ceremonial footage from Nkar Village."
          actionLabel="Upload Media"
          onAction={() => {
            setEditingItem(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                    {item.mediaType === 'VIDEO' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    <span>{item.mediaType}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#153E2E] font-semibold">
                    <Folder className="w-3 h-3 text-[#D4AF37]" />
                    <span className="truncate">{item.album}</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#153E2E] transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] border-t border-[#E8E4DA] flex items-center justify-between text-xs">
                <span className="text-[10px] text-stone-400 font-mono">
                  By {item.uploadedBy.split(' ')[0]}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewImage(item)}
                    className="p-1.5 text-stone-500 hover:text-[#153E2E] hover:bg-stone-100 rounded-lg cursor-pointer"
                    title="View Full Resolution"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {canEdit && (
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setFormModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / View Modal using Shadcn Dialog */}
      <Dialog open={!!viewImage} onOpenChange={(open) => { if (!open) setViewImage(null); }}>
        {viewImage && (
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-stone-900 border-stone-800 text-stone-100">
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={viewImage.mediaUrl}
                alt={viewImage.title}
                className="max-h-[70vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 bg-stone-900 border-t border-stone-800">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-white">{viewImage.title}</DialogTitle>
                <DialogDescription className="text-xs text-stone-400 mt-1">{viewImage.description}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800 text-xs text-stone-400">
                <span>Album: <strong className="text-amber-400 font-medium">{viewImage.album}</strong></span>
                <button
                  type="button"
                  onClick={() => setViewImage(null)}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Modals */}
      {formModalOpen && (
        <GalleryFormModal
          isOpen={formModalOpen}
          initialData={editingItem}
          onClose={() => {
            setFormModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Media Asset"
          message="Are you sure you want to delete this photographic record? It will be removed from the public cultural archive."
          confirmLabel="Delete Media"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
