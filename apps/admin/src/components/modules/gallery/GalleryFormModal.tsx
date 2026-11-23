import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Gallery, MediaType, ContentStatus } from '../../../types';
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
  onSubmit: (data: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

export const GalleryFormModal: React.FC<GalleryFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('IMAGE');
  const [category, setCategory] = useState('Festivals & Culture');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [altText, setAltText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setMediaUrl(initialData.media_url);
      setThumbnailUrl(initialData.thumbnail_url || '');
      setMediaType(initialData.media_type);
      setCategory(initialData.category);
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setStatus(initialData.status);
      setAltText(initialData.alt_text || '');
    } else {
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setThumbnailUrl('');
      setMediaType('IMAGE');
      setCategory('Festivals & Culture');
      setTagsInput('');
      setStatus('PUBLISHED');
      setAltText('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) {
      setError('Title and media file upload are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      media_url: mediaUrl.trim(),
      thumbnail_url: thumbnailUrl.trim() || null,
      media_type: mediaType,
      category,
      tags,
      status,
      alt_text: altText.trim() || title.trim(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
          <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            {initialData ? 'Edit Media Metadata' : 'Upload Multimedia Asset'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Village photography, ceremonial masquerade footage, and cultural regalia
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Media Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Palace Dance at Nkar Annual Festival"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-900 dark:text-stone-100 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Archive Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="Festivals & Culture">Festivals & Culture</option>
                <option value="Palace & Lineage">Palace & Lineage</option>
                <option value="Landscape & Village">Landscape & Village</option>
                <option value="Institutions & Regalia">Institutions & Regalia</option>
                <option value="Civic Works">Civic Works</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Media Format *</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaType)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="IMAGE">Photograph (JPEG / PNG / WebP)</option>
                <option value="VIDEO">Video Footage (MP4 / WebM)</option>
              </select>
            </div>
          </div>

          <FileUpload
            label={mediaType === 'VIDEO' ? 'Video File (MP4, WebM) *' : 'High-Resolution Photography *'}
            value={mediaUrl}
            onChange={(url, file) => {
              setMediaUrl(url);
              if (file?.type?.startsWith('video')) {
                setMediaType('VIDEO');
              }
            }}
            accept={mediaType === 'VIDEO' ? 'video/*' : 'image/*'}
            mediaTypeHint={mediaType === 'VIDEO' ? 'video' : 'image'}
            folder="nkar_woo_lan/gallery"
            helperText={mediaType === 'VIDEO' ? 'Upload video file up to 100MB' : 'Upload photo up to 10MB'}
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Descriptive Caption</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Narrative description, historical context, photographer credit..."
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Keywords / Search Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="festival, royal dance, toghu, fon (comma separated)"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div className="pt-4 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Upload Asset'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
