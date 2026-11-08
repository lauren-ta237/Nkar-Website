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
  onSubmit: (data: Omit<DevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const ProjectsFormModal: React.FC<ProjectsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budgetXAF, setBudgetXAF] = useState<number>(25000000);
  const [status, setStatus] = useState<ProjectStatus>('IN_PROGRESS');
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const [coverImage, setCoverImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [leadCoordinator, setLeadCoordinator] = useState('');
  const [fundingSource, setFundingSource] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setProjectName(initialData.projectName);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setBudgetXAF(initialData.budgetXAF);
      setStatus(initialData.status);
      setProgressPercentage(initialData.progressPercentage);
      setCoverImage(initialData.coverImage);
      setStartDate(initialData.startDate);
      setCompletionDate(initialData.completionDate || '');
      setLeadCoordinator(initialData.leadCoordinator);
      setFundingSource(initialData.fundingSource);
    } else {
      setProjectName('');
      setDescription('');
      setLocation('Roh-Nkar / Central Axis');
      setBudgetXAF(30000000);
      setStatus('IN_PROGRESS');
      setProgressPercentage(35);
      setCoverImage('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80');
      setStartDate('2026-01-15');
      setCompletionDate('2026-12-30');
      setLeadCoordinator('Eng. Francis Mbinkar');
      setFundingSource('NKACUDA Community Development & Diaspora Fund');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim() || !location.trim() || !startDate) {
      setError('Project name, description, location, and start date are required.');
      return;
    }
    if (progressPercentage < 0 || progressPercentage > 100) {
      setError('Progress percentage must be between 0 and 100.');
      return;
    }

    onSubmit({
      projectName: projectName.trim(),
      description: description.trim(),
      location: location.trim(),
      budgetXAF: Number(budgetXAF) || 0,
      status,
      progressPercentage: Number(progressPercentage) || 0,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
      startDate,
      completionDate: completionDate.trim() || undefined,
      leadCoordinator: leadCoordinator.trim(),
      fundingSource: fundingSource.trim(),
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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
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
                value={budgetXAF}
                onChange={(e) => setBudgetXAF(Number(e.target.value))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Lead Project Coordinator</label>
              <input
                type="text"
                value={leadCoordinator}
                onChange={(e) => setLeadCoordinator(e.target.value)}
                placeholder="e.g. Eng. Francis Mbinkar"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Funding Source</label>
              <input
                type="text"
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                placeholder="e.g. Diaspora Contributions / Council Grant"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              />
            </div>
          </div>

          <FileUpload
            label="Project Cover / Site Photograph *"
            value={coverImage}
            onChange={setCoverImage}
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
