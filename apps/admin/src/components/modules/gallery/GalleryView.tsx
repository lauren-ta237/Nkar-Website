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
} from 'lucide-react';
import { useAdminGalleryList, useAdminGalleryMutations } from '@/lib/api/gallery.api';
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

function isVideoMedia(mediaType?: string | null, url?: string | null): boolean {
  if (String(mediaType || '').toLowerCase() === 'video') return true;
  return Boolean(url && /(\.(mp4|webm|ogg|mov|m4v)(\?|#|$)|\/video\/upload\/)/i.test(url));
}

function toHttpsUrl(url?: string | null): string {
  if (!url) return '';
  return url.trim().replace(/^http:\/\//i, 'https://');
}

export const GalleryView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: gallery = [], isLoading } = useAdminGalleryList();
  const { createMutation, updateMutation, publishMutation, deleteMutation } = useAdminGalleryMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Gallery | null>(null);
  const [viewImage, setViewImage] = useState<Gallery | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = Array.from(new Set(gallery.map((g) => g.category)));

  const filtered = gallery.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateOrUpdate = (data: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
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

  const canEdit =
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'CONTENT_REVIEWER' ||
    currentUser.role === 'CONTENT_EDITOR';
  const canDelete = currentUser.role === 'SUPER_ADMIN';

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
            <ImageIcon className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
            Multimedia & Photographic Archives
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
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
      <div className="p-4 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-[#153E2E] text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-700 dark:text-stone-200"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
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
          {filtered.map((item) => {
            const isVideo = isVideoMedia(item.media_type, item.media_url);
            const mediaSrc = toHttpsUrl(item.media_url);
            const posterSrc = item.thumbnail_url ? toHttpsUrl(item.thumbnail_url) : undefined;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="p-2.5 pb-0 bg-[#FAF8F5] dark:bg-stone-950">
                    <div className="relative aspect-[4/3] w-full bg-stone-900 overflow-hidden rounded-xl border border-[#E8E4DA] dark:border-stone-800">
                      {isVideo ? (
                        <video
                          src={mediaSrc}
                          poster={posterSrc}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover object-top bg-black"
                        />
                      ) : (
                        <img
                          src={mediaSrc}
                          alt={item.alt_text || item.title}
                          className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute top-2.5 right-2.5">
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="absolute top-2.5 left-2.5 bg-black/65 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                        {isVideo ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <ImageIcon className="w-3 h-3" />
                        )}
                        <span>{isVideo ? 'VIDEO' : item.media_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#153E2E] dark:text-emerald-400 font-semibold">
                      <Folder className="w-3 h-3 text-[#D4AF37]" />
                      <span className="truncate">{item.category}</span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#153E2E] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description || '—'}
                    </p>

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] dark:bg-stone-950 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400 font-mono">
                    {item.uploaded_by_id ? 'By Admin' : 'System'}
                  </span>

                  <div className="flex items-center gap-1">
                    {item.status === 'SUBMITTED' &&
                      (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && (
                        <button
                          type="button"
                          onClick={() => publishMutation.mutate(item.id)}
                          className="px-2 py-1 text-[10px] font-bold text-[#153E2E] bg-[#D4AF37]/30 hover:bg-[#D4AF37] rounded-md transition-colors cursor-pointer"
                        >
                          Publish
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() => setViewImage(item)}
                      className="p-1.5 text-stone-500 hover:text-[#153E2E] dark:text-stone-400 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer transition-colors"
                      title="View Full Resolution"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(item);
                          setFormModalOpen(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer transition-colors"
                        title="Delete Media"
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

      {/* Lightbox / View Modal using Shadcn Dialog */}
      <Dialog
        open={!!viewImage}
        onOpenChange={(open) => {
          if (!open) setViewImage(null);
        }}
      >
        {viewImage && (
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-stone-900 border-stone-800 text-stone-100">
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              {isVideoMedia(viewImage.media_type, viewImage.media_url) ? (
                <video
                  key={toHttpsUrl(viewImage.media_url)}
                  src={toHttpsUrl(viewImage.media_url)}
                  poster={viewImage.thumbnail_url ? toHttpsUrl(viewImage.thumbnail_url) : undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="max-h-[70vh] w-full bg-black object-contain"
                />
              ) : (
                <img
                  src={toHttpsUrl(viewImage.media_url)}
                  alt={viewImage.alt_text || viewImage.title}
                  className="max-h-[70vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div className="p-4 bg-stone-900 border-t border-stone-800">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-white">{viewImage.title}</DialogTitle>
                <DialogDescription className="text-xs text-stone-400 mt-1">
                  {viewImage.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800 text-xs text-stone-400">
                <span>
                  Category: <strong className="text-amber-400 font-medium">{viewImage.category}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setViewImage(null)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  Close Preview
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
          title="Delete Media Record"
          message="Are you sure you want to permanently delete this media file from the public cultural archive? This cannot be undone."
          confirmLabel="Delete Media"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
