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
  itemType: string;
  onApprove: (notes?: string) => void;
  onReject: (notes: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ReviewActionModal: React.FC<ReviewActionModalProps> = ({
  isOpen,
  itemTitle,
  itemType,
  onApprove,
  onReject,
  onCancel,
  isLoading = false,
}) => {
  const [action, setAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#153E2E]" />
            <SheetTitle className="font-bold text-stone-900 text-sm">
              Editorial Review Decision: {itemType}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500">
            Verify authenticity, community accuracy, and approve or request revision
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Review Target</p>
            <p className="text-sm font-bold text-stone-900 mt-0.5 truncate">{itemTitle}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
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
                    ? 'bg-[#EAF2EE] border-[#153E2E] text-[#153E2E] shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Approve Submission
              </button>

              <button
                type="button"
                onClick={() => setAction('REJECT')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  action === 'REJECT'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-600" />
                Reject & Send Feedback
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
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
              className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-800"
            />
            {error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors ${
                action === 'APPROVE'
                  ? 'bg-[#153E2E] hover:bg-[#0D291F]'
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
