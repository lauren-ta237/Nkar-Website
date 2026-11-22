import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
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
  onSubmit: (data: Omit<Leadership, 'id' | 'created_at' | 'updated_at'>) => void;
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
      setTraditionalTitle(initialData.traditional_title);
      setBiography(initialData.biography || '');
      setActivePeriod(initialData.period_label || '');
      setPortraitPhoto(initialData.portrait_url || '');
      setDisplayOrder(initialData.order_index);
      setLineage(initialData.historical_notes || '');
      setStatus(initialData.status);
    } else {
      setName('');
      setTraditionalTitle('');
      setBiography('');
      setActivePeriod('');
      setPortraitPhoto('');
      setDisplayOrder(1);
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
      traditional_title: traditionalTitle.trim(),
      biography: biography.trim() || null,
      period_label: activePeriod.trim() || null,
      portrait_url: portraitPhoto.trim() || null,
      order_index: Number(displayOrder) || 0,
      historical_notes: lineage.trim() || null,
      status,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-left">
          <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            {initialData ? 'Edit Traditional Leader Profile' : 'Enthrone / Add Traditional Leader'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Paramount Fon, Fais of Nkar, Queen Mothers (Yaa), and traditional council dignitaries
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
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Leader Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. His Royal Highness Fon Martin Fongang II"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-900 dark:text-stone-100 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Traditional Title *</label>
            <input
              type="text"
              value={traditionalTitle}
              onChange={(e) => setTraditionalTitle(e.target.value)}
              placeholder="e.g. Paramount Fon of Nkar / Fai Woo (Prime Minister)"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Active Era / Reign Period *</label>
              <input
                type="text"
                value={activePeriod}
                onChange={(e) => setActivePeriod(e.target.value)}
                placeholder="e.g. 1985 – Present (or 1952 – 1984)"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Protocol Order Index *</label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Lineage & Traditional House</label>
            <input
              type="text"
              value={lineage}
              onChange={(e) => setLineage(e.target.value)}
              placeholder="e.g. Royal Dynasty of Nkar Fondom / Kingmaker of Nkar"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Royal Biography & Historical Deeds *</label>
            <textarea
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Detailed biographical narrative, ascension history, customary contributions..."
              className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 leading-relaxed"
              required
            />
          </div>

          <FileUpload
            label="Official Portrait or Regalia Photography"
            value={portraitPhoto}
            onChange={setPortraitPhoto}
            accept="image/*"
            mediaTypeHint="image"
            folder="nkar_woo_lan/leadership"
            helperText="Upload official traditional portrait (JPEG, PNG, WebP up to 10MB)"
          />

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
              {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Leader'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
