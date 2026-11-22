import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar } from 'lucide-react';
import { ContentEditorLayout } from '@/components/common/editor/ContentEditorLayout';
import { FileUpload } from '@/components/common/FileUpload';
import { useAdminNewsList, useAdminNewsMutations } from '@/lib/api/news.api';
import { News, NewsCategory, ContentStatus } from '@/types';
import { useAdminStore } from '@/store/useAdminStore';

const CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'announcements', label: 'Announcements & Bulletins' },
  { value: 'clan_news', label: 'Clan & Village News' },
  { value: 'culture', label: 'Culture & Heritage' },
  { value: 'celebrations', label: 'Celebrations & Festivals' },
  { value: 'education', label: 'Education & Schools' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'obituaries', label: 'Obituaries & Remembrance' },
];

export const NewsEditorView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAdminStore();
  const { data: news = [], isLoading: isListLoading } = useAdminNewsList();
  const { createMutation, updateMutation } = useAdminNewsMutations();

  const isEditMode = Boolean(id);
  const existingArticle = id ? news.find((n) => n.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<NewsCategory>('announcements');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setSlug(existingArticle.slug);
      setSummary(existingArticle.summary || '');
      setContent(existingArticle.content);
      setCoverImage(existingArticle.cover_image || '');
      const matched = CATEGORIES.find(
        (c) => c.value.toLowerCase() === (existingArticle.category || '').toLowerCase()
      );
      setCategory(matched ? matched.value : 'announcements');
      setTagsInput((existingArticle.tags || []).join(', '));
      setIsFeatured(Boolean(existingArticle.is_featured));
      setStatus((existingArticle.status?.toLowerCase() as ContentStatus) || 'draft');
    }
  }, [existingArticle]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  // Insert markdown helpers from toolbar into textarea
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

  const handleSave = () => {
    setError(null);
    if (!title.trim()) {
      setError('Article headline is required.');
      return;
    }
    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!generatedSlug) {
      setError('A valid headline is required to generate the article slug.');
      return;
    }
    if (!summary.trim()) {
      setError('Summary excerpt is required.');
      return;
    }
    if (!content.trim()) {
      setError('Article content body is required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      summary: summary.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      category,
      tags,
      is_featured: isFeatured,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };

    if (isEditMode && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => navigate('/news'),
          onError: (err: any) => setError(err?.response?.data?.message || 'Failed to update article'),
        }
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => navigate('/news'),
        onError: (err: any) => setError(err?.response?.data?.message || 'Failed to publish article'),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <ContentEditorLayout
      title={title || 'New Announcement Draft'}
      category={CATEGORIES.find((c) => c.value === category)?.label}
      status={status}
      backUrl="/news"
      onBack={() => navigate('/news')}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonLabel={isEditMode ? 'Update Article' : 'Publish Article'}
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

          {/* Title & Slug */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Article Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Traditional Council Proclaims Annual Cultural Jubilee Dates"
              className="w-full text-sm p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-900 dark:text-stone-100 font-bold"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
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
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="draft">Draft (Private draft)</option>
                <option value="submitted">Submit for Editorial Review</option>
                {currentUser?.role !== 'CONTENT_EDITOR' && currentUser?.role !== 'content_editor' && (
                  <>
                    <option value="approved">Approved</option>
                    <option value="published">Published (Live on Public Portal)</option>
                    <option value="archived">Archived</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Cover Photo Upload */}
          <div>
            <FileUpload
              label="Cover Photograph"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              accept="image/*"
              folder="nkar_woo_lan/news"
              helperText="Upload JPG, PNG, or WebP cover photograph"
            />
          </div>

          {/* Summary Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Summary Excerpt (1-2 sentences) *
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief introductory summary displayed on overview cards and social sharing..."
              rows={2}
              className="w-full text-xs p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 leading-relaxed font-serif"
              required
            />
          </div>

          {/* Full Article Body */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Full Article Narrative *
            </label>
            <textarea
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full report, royal proclamations, quotes, and cultural details..."
              rows={14}
              className="w-full text-xs sm:text-sm p-4 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-100 font-sans leading-relaxed"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Palace, Council, Festival, Nkar"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>
        </div>
      }
      previewContent={
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#8C8270] dark:text-stone-400">
            <span className="text-[#D4AF37] font-semibold">
              {CATEGORIES.find((c) => c.value === category)?.label || 'Announcements'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#D4AF37]" />
              {new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#153E2E] dark:text-emerald-300 leading-tight">
            {title || 'Headline will appear here'}
          </h1>

          {summary && (
            <p className="text-sm font-serif italic text-stone-600 dark:text-stone-300 border-l-2 border-[#D4AF37] pl-4 leading-relaxed">
              {summary}
            </p>
          )}

          {coverImage ? (
            <div className="overflow-hidden border border-[#E8E4DA] dark:border-stone-700 shadow-xs">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-auto max-h-[360px] object-cover"
              />
            </div>
          ) : (
            <div className="h-44 bg-stone-100 dark:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs text-stone-400">
              No cover photograph uploaded yet
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
                Article body paragraphs will be formatted here in real time...
              </p>
            )}
          </div>
        </div>
      }
    />
  );
};
