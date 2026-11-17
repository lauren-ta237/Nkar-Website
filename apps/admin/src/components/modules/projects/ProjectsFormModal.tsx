import React, { useState, useEffect } from 'react';
import { X, Briefcase, AlertCircle } from 'lucide-react';
import { DevelopmentProject, ProjectStatus } from '../../../types';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface ProjectsFormModalProps {
  isOpen: boolean;
  initialData?: DevelopmentProject | null;
  onClose: () => void;
  onSubmit: (data: Omit<DevelopmentProject, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

export const ProjectsFormModal: React.FC<ProjectsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budgetCfa, setBudgetCfa] = useState<number>(25000000);
  const [status, setStatus] = useState<ProjectStatus>('IN_PROGRESS');
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setBudgetCfa(initialData.budget_cfa || 0);
      setStatus(initialData.status);
      setProgressPercentage(initialData.progress_percentage);
      setCoverImageUrl(initialData.cover_image_url || '');
      setStartDate(initialData.start_date || '');
      setCompletionDate(initialData.completion_date || '');
    } else {
      setTitle('');
      setDescription('');
      setLocation('Roh-Nkar / Central Axis');
      setBudgetCfa(30000000);
      setStatus('IN_PROGRESS');
      setProgressPercentage(35);
      setCoverImageUrl('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80');
      setStartDate('2026-01-15');
      setCompletionDate('2026-12-30');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Project title, description, and location are required.');
      return;
    }
    if (progressPercentage < 0 || progressPercentage > 100) {
      setError('Progress percentage must be between 0 and 100.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      budget_cfa: Number(budgetCfa) || null,
      status,
      progress_percentage: Number(progressPercentage) || 0,
      cover_image_url: coverImageUrl.trim() || null,
      start_date: startDate || null,
      completion_date: completionDate.trim() || null,
      milestones: initialData?.milestones || null,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Update Community Project' : 'Initiate Development Project'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Clean water, electrification, schools, roads, and village civic infrastructure
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Nkar Gravity-Fed Community Water Supply Phase II"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Roh-Nkar / College Campus"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Budget in XAF (FCFA) *</label>
              <input
                type="number"
                min="0"
                step="100000"
                value={budgetCfa}
                onChange={(e) => setBudgetCfa(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 tabular-nums font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="IN_PROGRESS">In Progress (Active Work)</option>
                <option value="PLANNING">Planning & Feasibility</option>
                <option value="COMPLETED">Completed & Commissioned</option>
                <option value="ON_HOLD">On Hold / Awaiting Funds</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-700">Progress: {progressPercentage}%</label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(Number(e.target.value))}
                className="w-full accent-[#153E2E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Completion Date</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              />
            </div>
          </div>

          <FileUpload
            label="Project Cover / Site Photograph"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            accept="image/*"
            mediaTypeHint="image"
            helperText="Upload official site or project progress photograph (JPEG, PNG, WebP up to 15MB)"
          />

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Project Scope & Community Impact *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specifications, quarters impacted, number of beneficiaries..."
              rows={4}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800 leading-relaxed"
              required
            />
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
              {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
