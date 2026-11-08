import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { Gallery, MediaType, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface GalleryFormModalProps {
  isOpen: boolean;
  initialData?: Gallery | null;
  onClose: () => void;
  onSubmit: (data: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const ALBUMS = [
  'Royal Ceremonies & Palace Heritage',
  'Landscapes of Nkar',
  'Arts & Traditional Crafts',
  'Festivals & Dances',
  'Community Development in Action',
  'Historical Photographic Archive',
];

export const GalleryFormModal: React.FC<GalleryFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();

  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('PHOTO');
  const [album, setAlbum] = useState(ALBUMS[0]);
  const [category, setCategory] = useState('Ceremonies');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMediaType(initialData.mediaType);
      setAlbum(initialData.album);
      setCategory(initialData.category);
      setMediaUrl(initialData.mediaUrl);
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setDescription(initialData.description);
      setTagsInput(initialData.tags.join(', '));
      setStatus(initialData.status);
    } else {
      setTitle('');
      setMediaType('PHOTO');
      setAlbum(ALBUMS[0]);
      setCategory('Ceremonies');
      setMediaUrl('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80');
      setThumbnailUrl('');
      setDescription('');
      setTagsInput('Nkar, Culture, Heritage');
      setStatus(currentUser.role === 'CONTENT_EDITOR' ? 'SUBMITTED' : 'PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim() || !description.trim()) {
      setError('Title, media URL, and description are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      mediaType,
      album,
      category: category.trim(),
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      description: description.trim(),
      tags,
      status,
      uploadedBy: currentUser.name,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit Media Asset' : 'Upload Gallery Item'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Photographs, ceremonial videos, and historical visual documentation
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Media Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Procession with Leopard Skin Regalia"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PHOTO">Photograph</option>
                <option value="VIDEO">Video Footage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PUBLISHED">Published (Live Gallery)</option>
                <option value="APPROVED">Approved</option>
                <option value="SUBMITTED">Under Review</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Album</label>
              <select
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                {ALBUMS.map((alb) => (
                  <option key={alb} value={alb}>
                    {alb}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ceremonies, Landscapes, Crafts..."
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>
          </div>

          <FileUpload
            label={mediaType === 'VIDEO' ? 'Gallery Video Asset *' : 'Gallery Image Asset *'}
            value={mediaUrl}
            onChange={setMediaUrl}
            accept={mediaType === 'VIDEO' ? 'video/mp4,video/webm,video/ogg,video/*' : 'image/*'}
            mediaTypeHint={mediaType === 'VIDEO' ? 'video' : 'image'}
            maxSizeBytes={mediaType === 'VIDEO' ? 50 * 1024 * 1024 : 15 * 1024 * 1024}
            helperText={
              mediaType === 'VIDEO'
                ? 'Upload MP4, WebM or OGG video (up to 50MB)'
                : 'Upload high-resolution photography (JPEG, PNG, WebP up to 15MB)'
            }
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contextual description of the event, location, or cultural artifact shown..."
              rows={3}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Royalty, Ndop, Weaving, Mountain"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
            />
          </div>

          <div className="pt-4 border-t border-[#E8E4DA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Media' : 'Save Media'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
