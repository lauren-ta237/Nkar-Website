import React from 'react';
import { X, Calendar, User, Eye, Tag, CheckCircle2, Clock, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { News } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface NewsDetailModalProps {
  article: News | null;
  onClose: () => void;
  onEdit: (article: News) => void;
  onPublish?: (id: string) => void;
  onReview?: (article: News) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  article,
  onClose,
  onEdit,
  onPublish,
  onReview,
}) => {
  const { currentUser } = useAdminStore();

  return (
    <Sheet open={!!article} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        {article && (
          <>
            {/* Header */}
            <SheetHeader className="p-4 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
              <div className="flex items-center gap-2">
                <StatusBadge status={article.status} />
                <span className="text-xs font-semibold text-stone-500">· {article.category}</span>
              </div>
              <SheetTitle className="font-bold text-stone-900 text-sm mt-1">
                Article Verification & Preview
              </SheetTitle>
              <SheetDescription className="text-xs text-stone-500">
                Detailed metadata, readership engagement, and review status
              </SheetDescription>
            </SheetHeader>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {article.coverImage && (
            <div className="w-full h-52 rounded-xl overflow-hidden border border-[#E8E4DA] bg-stone-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">{article.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                {article.authorName}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 tabular-nums">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                {article.viewsCount} views
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DA]">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Executive Summary</p>
            <p className="text-xs font-medium text-stone-800 leading-relaxed">{article.summary}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Article Body</p>
            <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-stone-100">
              {article.content}
            </div>
          </div>

          {article.reviewNotes && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">Editorial Review Notes</p>
              <p className="text-xs text-amber-800">{article.reviewNotes}</p>
            </div>
          )}

          {article.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#E8E4DA] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[11px] font-mono text-stone-400 truncate max-w-xs">
            Slug: /{article.slug}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(article);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg cursor-pointer"
            >
              Edit Article
            </button>

            {article.status === 'SUBMITTED' && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && onReview && (
              <button
                onClick={() => {
                  onClose();
                  onReview(article);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-lg cursor-pointer flex items-center gap-1"
              >
                Decide Review
              </button>
            )}

            {article.status === 'APPROVED' && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && onPublish && (
              <button
                onClick={() => {
                  onPublish(article.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-lg cursor-pointer flex items-center gap-1"
              >
                Publish Live
              </button>
            )}
          </div>
        </div>
        </>
      )}
      </SheetContent>
    </Sheet>
  );
};
