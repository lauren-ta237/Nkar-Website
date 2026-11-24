import React, { useState } from 'react';
import {
  ArrowLeft,
  Columns,
  Eye,
  FileText,
  Save,
  Clock,
  Type,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

export type EditorViewMode = 'split' | 'editor' | 'preview';

interface ContentEditorLayoutProps {
  title: string;
  category?: string;
  status: string;
  backUrl: string;
  onBack: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveButtonLabel?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
  // Left editor pane content
  editorContent: React.ReactNode;
  // Right live preview pane content
  previewContent: React.ReactNode;
  // Textarea reference for toolbar injection
  contentRef?: React.RefObject<HTMLTextAreaElement | null>;
  onInsertMarkdown?: (prefix: string, suffix?: string, defaultText?: string) => void;
}

export const ContentEditorLayout: React.FC<ContentEditorLayoutProps> = ({
  title,
  category,
  status,
  onBack,
  onSave,
  isSaving = false,
  saveButtonLabel = 'Save Changes',
  wordCount = 0,
  readingTimeMinutes = 1,
  editorContent,
  previewContent,
  onInsertMarkdown,
}) => {
  const [viewMode, setViewMode] = useState<EditorViewMode>('split');

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Sticky Action Toolbar */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Return to list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                {category || 'Content Editor'}
              </span>
              <StatusBadge status={status as any} />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate max-w-md">
              {title || 'Untitled Draft'}
            </h2>
          </div>
        </div>

        {/* Center / Right: Mode Switcher, Word Stats & Save Button */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Word Stats */}
          <div className="hidden md:flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 font-mono border-r border-[#E8E4DA] dark:border-stone-800 pr-3">
            <span className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-stone-400" />
              {wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              ~{readingTimeMinutes} min read
            </span>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-0.5 bg-[#FAF8F5] dark:bg-stone-800 p-1 border border-[#E8E4DA] dark:border-stone-700 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-stone-900 text-[#153E2E] dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Editor Only"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Editor</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-stone-900 text-[#153E2E] dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Split View (Editor + Live Preview)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-stone-900 text-[#153E2E] dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Live Visual Preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Live Preview</span>
            </button>
          </div>

          {/* Primary Save Button */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 sm:px-5 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0D291F] dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : saveButtonLabel}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column or Single-Column Work Area */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-2 items-start'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {/* Left: Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            {/* Formatting Toolbar */}
            {onInsertMarkdown && (
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#FAF8F5] dark:bg-stone-800/80 border border-[#E8E4DA] dark:border-stone-700 rounded-xl">
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('**', '**', 'bold text')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Bold (**text**)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('*', '*', 'italic text')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Italic (*text*)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1" />
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('## ', '', 'Section Heading')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Heading 2 (## Heading)"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('### ', '', 'Subsection Heading')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Heading 3 (### Heading)"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1" />
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('> ', '', 'Quoted traditional saying or proverb')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Quote (> quote)"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('- ', '', 'List item')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Bulleted list (- item)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('1. ', '', 'Numbered step')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Numbered list (1. item)"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onInsertMarkdown('\n---\n', '', '')}
                  className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  title="Section Divider (---)"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {editorContent}
          </div>
        )}

        {/* Right: Live Visual Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="bg-[#FAF8F5] dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs sticky top-36 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E8E4DA] dark:border-stone-800">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#153E2E] dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Public Website Live Rendering
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                WYSIWYG Nkar Woo Làn Theme
              </span>
            </div>

            <div className="max-w-none">{previewContent}</div>
          </div>
        )}
      </div>
    </div>
  );
};
