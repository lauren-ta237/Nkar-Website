import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Tag, AlertCircle } from 'lucide-react';
import { News, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface NewsFormModalProps {
  isOpen: boolean;
  initialData?: News | null;
  onClose: () => void;
  onSubmit: (data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Royalty & Heritage',
  'Development',
  'Culture & Arts',
  'Environment & Heritage',
  'Announcements',
  'Education',
  'Youth & Sports',
];

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<ContentStatus>('DRAFT');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSlug(initialData.slug);
      setSummary(initialData.summary);
      setContent(initialData.content);
      setCoverImage(initialData.coverImage);
      setCategory(initialData.category);
      setTagsInput(initialData.tags.join(', '));
      setIsFeatured(initialData.isFeatured);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setSlug('');
      setSummary('');
      setContent('');
      setCoverImage('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80');
      setCategory(CATEGORIES[0]);
      setTagsInput('Nkar, Fondom, Community');
      setIsFeatured(false);
      setStatus(currentUser.role === 'CONTENT_EDITOR' ? 'DRAFT' : 'PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen, currentUser.role]);

  if (!isOpen) return null;

  // Auto generate slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Article slug is required.');
      return;
    }
    if (!summary.trim()) {
      setError('Brief summary is required.');
      return;
    }
    if (!content.trim()) {
      setError('Article full content is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      category,
      tags,
      isFeatured,
      status,
      authorId: initialData?.authorId || currentUser.id,
      authorName: initialData?.authorName || currentUser.name,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit News Article' : 'Compose News & Announcement'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Preserving and broadcasting Nkar Woo Làn developments and cultural bulletins
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Slug */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Article Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Royal Council Approves Nkar Spring Catchment Extension"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-900 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Permanent Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="royal-council-approves-spring-catchment"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl font-mono text-stone-600 focus:bg-white focus:outline-none"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="DRAFT">Draft (Working version)</option>
                <option value="SUBMITTED">Submit for Review</option>
                {currentUser.role !== 'CONTENT_EDITOR' && (
                  <>
                    <option value="APPROVED">Approved</option>
                    <option value="PUBLISHED">Published (Live)</option>
                    <option value="ARCHIVED">Archived</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Cover Image Direct Upload */}
          <div>
            <FileUpload
              label="Article Cover Image"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              accept="image/*"
              helperText="Upload JPG, PNG, or WebP cover photograph"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Summary (1-2 sentences) *</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview displayed on list cards..."
              rows={2}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Article Body *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed reporting of the event, quotes, and background..."
              rows={6}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 font-normal leading-relaxed"
              required
            />
          </div>

          {/* Tags & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Water, Infrastructure, Fondom"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#E5E0D5] text-[#153E2E] focus:ring-[#153E2E] w-4 h-4"
                />
                <span className="text-xs font-semibold text-stone-700">Mark as Featured Announcement</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
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
              {isLoading ? 'Saving...' : initialData ? 'Update Article' : 'Save Article'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
