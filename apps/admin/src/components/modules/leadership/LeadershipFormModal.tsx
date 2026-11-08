import React, { useState, useEffect } from 'react';
import { X, Crown, AlertCircle } from 'lucide-react';
import { Leadership, ContentStatus } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface LeadershipFormModalProps {
  isOpen: boolean;
  initialData?: Leadership | null;
  onClose: () => void;
  onSubmit: (data: Omit<Leadership, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const LeadershipFormModal: React.FC<LeadershipFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [traditionalTitle, setTraditionalTitle] = useState('');
  const [biography, setBiography] = useState('');
  const [activePeriod, setActivePeriod] = useState('');
  const [portraitPhoto, setPortraitPhoto] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [lineage, setLineage] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTraditionalTitle(initialData.traditionalTitle);
      setBiography(initialData.biography);
      setActivePeriod(initialData.activePeriod);
      setPortraitPhoto(initialData.portraitPhoto);
      setDisplayOrder(initialData.displayOrder);
      setLineage(initialData.lineage || '');
      setStatus(initialData.status);
    } else {
      setName('');
      setTraditionalTitle('Senior Kingmaker & Council Member');
      setBiography('');
      setActivePeriod('2015 — Present');
      setPortraitPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80');
      setDisplayOrder(5);
      setLineage('');
      setStatus('PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !traditionalTitle.trim() || !biography.trim() || !activePeriod.trim()) {
      setError('Name, traditional title, active period, and biography are required.');
      return;
    }

    onSubmit({
      name: name.trim(),
      traditionalTitle: traditionalTitle.trim(),
      biography: biography.trim(),
      activePeriod: activePeriod.trim(),
      portraitPhoto: portraitPhoto.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      displayOrder: Number(displayOrder) || 1,
      lineage: lineage.trim() || undefined,
      status,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit Traditional Leader Profile' : 'Enthrone / Add Traditional Leader'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Paramount Fon, Fais of Nkar, Queen Mothers (Yaa), and traditional council dignitaries
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Leader Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. His Royal Highness Fon Martin Fongang II"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Traditional Title *</label>
            <input
              type="text"
              value={traditionalTitle}
              onChange={(e) => setTraditionalTitle(e.target.value)}
              placeholder="e.g. Paramount Fon of Nkar / Fai Woo (Prime Minister)"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Active Reign / Period *</label>
              <input
                type="text"
                value={activePeriod}
                onChange={(e) => setActivePeriod(e.target.value)}
                placeholder="e.g. 1998 — Present or 1952 — 1998"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hierarchy Display Order *</label>
              <input
                type="number"
                min="1"
                max="99"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 tabular-nums"
                required
              />
              <span className="text-[10px] text-stone-400">1 = Paramount Fon, 2 = Senior Fais, etc.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Dynastic Lineage / House</label>
            <input
              type="text"
              value={lineage}
              onChange={(e) => setLineage(e.target.value)}
              placeholder="e.g. 24th Dynasty Sovereign of Nkar Royal Court"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
            />
          </div>

          <FileUpload
            label="Portrait Photograph *"
            value={portraitPhoto}
            onChange={setPortraitPhoto}
            accept="image/*"
            mediaTypeHint="image"
            helperText="Upload official photograph of the traditional leader (JPEG, PNG, WebP up to 15MB)"
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Biography & Royal Legacy *</label>
            <textarea
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Chieftaincy achievements, traditional duties, and historic reforms..."
              rows={4}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
            >
              <option value="PUBLISHED">Published (Official Archive)</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Historical / Memoriam</option>
            </select>
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
              {isLoading ? 'Saving...' : initialData ? 'Update Profile' : 'Save Leader'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
