import React, { useState, useEffect } from 'react';
import { X, Landmark, AlertCircle, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Heritage, HeritageCategory, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface HeritageFormModalProps {
  isOpen: boolean;
  initialData?: Heritage | null;
  onClose: () => void;
  onSubmit: (data: Omit<Heritage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const CATEGORIES: { label: string; value: HeritageCategory }[] = [
  { label: 'Village History & Migration', value: 'VILLAGE_HISTORY' },
  { label: 'Customs & Sacred Rites', value: 'CUSTOMS' },
  { label: 'Language & Oral Proverbs', value: 'LANGUAGE' },
  { label: 'Royal Lineage & Dynasties', value: 'ROYAL_LINEAGE' },
  { label: 'Historical Artifacts & Regalia', value: 'HISTORICAL_ARTIFACTS' },
];

export const HeritageFormModal: React.FC<HeritageFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HeritageCategory>('VILLAGE_HISTORY');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [oralSource, setOralSource] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setSummary(initialData.summary);
      setContent(initialData.content);
      setOralSource(initialData.oralTraditionSource || '');
      setMediaUrls(initialData.supportingMedia.length > 0 ? initialData.supportingMedia : ['']);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setCategory('VILLAGE_HISTORY');
      setSummary('');
      setContent('');
      setOralSource('Traditional Council Elder & Custodian Archives');
      setMediaUrls(['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80']);
      setStatus(currentUser.role === 'CONTENT_EDITOR' ? 'SUBMITTED' : 'PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleAddMedia = () => setMediaUrls([...mediaUrls, '']);
  const handleRemoveMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };
  const handleMediaChange = (index: number, val: string) => {
    const updated = [...mediaUrls];
    updated[index] = val;
    setMediaUrls(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Title, summary, and content are required.');
      return;
    }

    const cleanMedia = mediaUrls.map((u) => u.trim()).filter(Boolean);

    onSubmit({
      title: title.trim(),
      category,
      summary: summary.trim(),
      content: content.trim(),
      oralTraditionSource: oralSource.trim() || undefined,
      supportingMedia: cleanMedia,
      status,
      authorId: currentUser.id,
      authorName: currentUser.name,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit Heritage Record' : 'Document Heritage Asset'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Preserving sacred oral traditions, customs, language, and historical regalia
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Heritage Record Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Origins of the Fondom of Nkar & Sacred Wong Shrines"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Heritage Domain *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HeritageCategory)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PUBLISHED">Published (Verified)</option>
                <option value="APPROVED">Approved by Council</option>
                <option value="SUBMITTED">Submitted for Review</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Oral Tradition Source / Custodian</label>
            <input
              type="text"
              value={oralSource}
              onChange={(e) => setOralSource(e.target.value)}
              placeholder="e.g. Pa Shey Ndzefon & Council of Royal Elders (1994 tape transcription)"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Short Summary *</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief introductory overview..."
              rows={2}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Historical / Cultural Narrative *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full transcribed oral history, ceremonial procedures, or anthropological details..."
              rows={6}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 leading-relaxed font-normal"
              required
            />
          </div>

          {/* Supporting Media Uploads */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-stone-700">
                Supporting Media & Artifact Photographs
              </label>
              <button
                type="button"
                onClick={handleAddMedia}
                className="text-[11px] font-semibold text-[#153E2E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Media Slot
              </button>
            </div>
            
            <div className="space-y-3">
              {mediaUrls.map((url, i) => (
                <div key={i} className="relative p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-600">Media File #{i + 1}</span>
                    {mediaUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(i)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Remove media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <FileUpload
                    value={url}
                    onChange={(newUrl) => handleMediaChange(i, newUrl)}
                    accept="image/*,video/*"
                    helperText="Upload artifact photograph or historical video recording"
                  />
                </div>
              ))}
            </div>
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
              {isLoading ? 'Saving...' : initialData ? 'Update Record' : 'Record Heritage'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
