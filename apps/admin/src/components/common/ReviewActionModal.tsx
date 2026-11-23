import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface ReviewActionModalProps {
  isOpen: boolean;
  itemTitle: string;
  itemType?: string;
  onApprove: (notes?: string) => void;
  onReject: (notes: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export const ReviewActionModal: React.FC<ReviewActionModalProps> = ({
  isOpen,
  itemTitle,
  itemType = 'Content',
  onApprove,
  onReject,
  onCancel,
  onClose,
  isLoading = false,
}) => {
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleDismiss = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'REJECT' && !notes.trim()) {
      setError('Review notes are strictly mandatory when rejecting content.');
      return;
    }
    setError('');
    if (action === 'APPROVE') {
      onApprove(notes.trim() || undefined);
    } else {
      onReject(notes.trim());
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-white dark:bg-stone-900 border-l border-[#E5E0D5] dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-850 text-left">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#153E2E] dark:text-[#D4AF37]" />
            <SheetTitle className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Editorial Review Decision: {itemType}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500 dark:text-stone-400">
            Verify authenticity, community accuracy, and approve or request revision
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">Review Target</p>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5 truncate">{itemTitle}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Decision Action
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAction('APPROVE');
                  setError('');
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  action === 'APPROVE'
                    ? 'bg-[#EAF2EE] dark:bg-emerald-950/40 border-[#153E2E] dark:border-emerald-600 text-[#153E2E] dark:text-emerald-400 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-750'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Approve Submission
              </button>

              <button
                type="button"
                onClick={() => setAction('REJECT')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  action === 'REJECT'
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-400 shadow-xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-750'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                Reject & Send Feedback
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Editorial Review Notes {action === 'REJECT' && <span className="text-red-500">* (Mandatory)</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                action === 'APPROVE'
                  ? 'Optional: verification notes for traditional council records...'
                  : 'Specify exact required corrections or missing cultural facts for the author...'
              }
              rows={3}
              className="w-full text-xs p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-800 dark:text-stone-200"
            />
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${
                action === 'APPROVE'
                  ? 'bg-[#153E2E] hover:bg-[#0D291F] dark:bg-emerald-700 dark:hover:bg-emerald-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Saving...' : action === 'APPROVE' ? 'Confirm Approval' : 'Submit Rejection'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
