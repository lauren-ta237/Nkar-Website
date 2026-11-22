import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, Trash2, Landmark } from 'lucide-react';
import { ContentEditorLayout } from '@/components/common/editor/ContentEditorLayout';
import { FileUpload } from '@/components/common/FileUpload';
import { useAdminHeritageList, useAdminHeritageMutations } from '@/lib/api/heritage.api';
import { Heritage, HeritageCategory, ContentStatus } from '@/types';
import { useAdminStore } from '@/store/useAdminStore';

const CATEGORIES: { label: string; value: HeritageCategory }[] = [
  { label: 'Village History & Migration', value: 'VILLAGE_HISTORY' },
  { label: 'Customs & Sacred Rites', value: 'CUSTOMS' },
  { label: 'Language & Oral Proverbs', value: 'LANGUAGE' },
  { label: 'Royal Lineage & Dynasties', value: 'ROYAL_LINEAGE' },
  { label: 'Historical Artifacts & Regalia', value: 'HISTORICAL_ARTIFACTS' },
];

export const HeritageEditorView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAdminStore();
  const { data: items = [] } = useAdminHeritageList();
  const { createMutation, updateMutation } = useAdminHeritageMutations();

  const isEditMode = Boolean(id);
  const existingItem = id ? items.find((h) => h.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<HeritageCategory>('VILLAGE_HISTORY');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState<string | null>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setSlug(existingItem.slug);
      setCategory(existingItem.category);
      setContent(existingItem.content);
      setImages(existingItem.images || []);
      setStatus(existingItem.status);
    }
  }, [existingItem]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  const handleInsertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const el = contentTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end) || defaultText;
    const nextText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setContent(nextText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleAddImage = (url: string) => {
    if (url && !images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    setError(null);
    if (!title.trim()) {
      setError('Heritage record title is required.');
      return;
    }
    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!generatedSlug) {
      setError('A valid title is required to generate the record slug.');
      return;
    }
    if (!content.trim()) {
      setError('Historical narrative body is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      category,
      content: content.trim(),
      images,
      status,
    };

    if (isEditMode && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => navigate('/heritage'),
          onError: (err: any) => setError(err?.response?.data?.message || 'Failed to update heritage record'),
        }
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => navigate('/heritage'),
        onError: (err: any) => setError(err?.response?.data?.message || 'Failed to archive heritage record'),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <ContentEditorLayout
      title={title || 'New Heritage Record'}
      category={CATEGORIES.find((c) => c.value === category)?.label}
      status={status}
      backUrl="/heritage"
      onBack={() => navigate('/heritage')}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonLabel={isEditMode ? 'Update Heritage Record' : 'Archive to Heritage'}
      wordCount={wordCount}
      readingTimeMinutes={readingTimeMinutes}
      contentRef={contentTextareaRef}
      onInsertMarkdown={handleInsertMarkdown}
      editorContent={
        <div className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Heritage Record Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Origin of the Nkar Royal Dynasty & Sacred Symbols"
              className="w-full text-sm p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-900 dark:text-stone-100 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Heritage Domain / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HeritageCategory)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="DRAFT">Draft (Under curation)</option>
                <option value="SUBMITTED">Submit for Custodian Review</option>
                <option value="PUBLISHED">Published to Public Archive</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Narrative Markdown Textarea */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Oral History Narrative &amp; Cultural Essay *
            </label>
            <textarea
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record the oral traditions, historical lineage, sacred rites, cultural significance..."
              rows={14}
              className="w-full text-xs sm:text-sm p-4 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-100 font-sans leading-relaxed"
              required
            />
          </div>

          {/* Photo Documentation Gallery */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Photographic Artifacts &amp; Documentation
            </label>
            <FileUpload
              label="Add Heritage Photograph"
              value=""
              onChange={handleAddImage}
              accept="image/*"
              folder="nkar_woo_lan/heritage"
              helperText="Upload photographs of regalia, sacred sites, shrines, or royal gatherings"
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group overflow-hidden border border-[#E8E4DA] dark:border-stone-700 rounded-xl bg-card"
                  >
                    <img src={img} alt={`Heritage ${idx + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      previewContent={
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#D4AF37] font-semibold">
            <Landmark className="w-3.5 h-3.5" />
            <span>{CATEGORIES.find((c) => c.value === category)?.label || 'Oral Heritage'}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#153E2E] dark:text-emerald-300 leading-tight">
            {title || 'Heritage Title will appear here'}
          </h1>

          {images.length > 0 && (
            <div className="overflow-hidden border border-[#E8E4DA] dark:border-stone-700 shadow-xs">
              <img src={images[0]} alt={title} className="w-full h-auto max-h-[360px] object-cover" />
            </div>
          )}

          <div className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            {content ? (
              content.split('\n\n').map((para, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? 'first-letter:font-serif first-letter:text-2xl first-letter:text-[#153E2E] dark:first-letter:text-emerald-400 first-letter:font-bold' : ''}
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="text-stone-400 italic">
                Oral tradition paragraphs will format here in real time...
              </p>
            )}
          </div>
        </div>
      }
    />
  );
};
