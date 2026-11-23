import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, Trash2, MapPin, Coins, Calendar, CheckCircle2 } from 'lucide-react';
import { ContentEditorLayout } from '@/components/common/editor/ContentEditorLayout';
import { FileUpload } from '@/components/common/FileUpload';
import { useAdminProjectsList, useAdminProjectsMutations } from '@/lib/api/projects.api';
import { DevelopmentProject, ProjectStatus } from '@/types';

interface MilestoneItem {
  date: string;
  title: string;
  completed: boolean;
}

export const ProjectEditorView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: projects = [] } = useAdminProjectsList();
  const { createMutation, updateMutation } = useAdminProjectsMutations();

  const isEditMode = Boolean(id);
  const existingProject = id ? projects.find((p) => p.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('PROPOSED');
  const [budgetCfa, setBudgetCfa] = useState<number | ''>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (existingProject) {
      setTitle(existingProject.title);
      setLocation(existingProject.location || '');
      setStatus((existingProject.status?.toUpperCase() as ProjectStatus) || 'PROPOSED');
      setBudgetCfa(existingProject.budget_cfa ?? '');
      setProgressPercentage(existingProject.progress_percentage || 0);
      setStartDate(existingProject.start_date ? existingProject.start_date.split('T')[0] : '');
      setCompletionDate(existingProject.completion_date ? existingProject.completion_date.split('T')[0] : '');
      setCoverImageUrl(existingProject.cover_image_url || '');
      setDescription(existingProject.description);
      setMilestones(
        (existingProject.milestones || []).map((m: any) => ({
          date: m.date || '',
          title: m.title || m.text || '',
          completed: Boolean(m.completed ?? true),
        }))
      );
    }
  }, [existingProject]);

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestones([
      ...milestones,
      {
        date: newMilestoneDate || new Date().toISOString().split('T')[0],
        title: newMilestoneText.trim(),
        completed: progressPercentage > 0,
      },
    ]);
    setNewMilestoneText('');
    setNewMilestoneDate('');
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = () => {
    setError(null);
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!location.trim()) {
      setError('Project location is required.');
      return;
    }
    if (!description.trim()) {
      setError('Project scope & description is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      status,
      budget_cfa: budgetCfa === '' ? null : Number(budgetCfa),
      progress_percentage: Number(progressPercentage),
      cover_image_url: coverImageUrl.trim() || null,
      start_date: startDate || null,
      completion_date: completionDate || null,
      milestones: milestones.map((m) => ({
        date: m.date,
        title: m.title,
        completed: m.completed,
      })),
    };

    if (isEditMode && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => navigate('/projects'),
          onError: (err: any) => setError(err?.response?.data?.message || 'Failed to update project'),
        }
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => navigate('/projects'),
        onError: (err: any) => setError(err?.response?.data?.message || 'Failed to create project'),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <ContentEditorLayout
      title={title || 'New Development Project'}
      category="Community Works"
      status={status}
      backUrl="/projects"
      onBack={() => navigate('/projects')}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonLabel={isEditMode ? 'Update Project' : 'Register Project'}
      wordCount={wordCount}
      readingTimeMinutes={readingTimeMinutes}
      contentRef={contentTextareaRef}
      editorContent={
        <div className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Project Initiative Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Nkar Comprehensive Clean Water Spring Gravity Extension"
              className="w-full text-sm p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-900 dark:text-stone-100 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Location & Quarter *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mbah, Nkar Centre"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="PROPOSED">Proposed</option>
                <option value="IN_PROGRESS">In Progress (Ongoing)</option>
                <option value="COMPLETED">Completed</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Estimated Budget (CFA Francs)
              </label>
              <input
                type="number"
                value={budgetCfa}
                onChange={(e) => setBudgetCfa(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 15000000"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Execution Progress
                </label>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">{progressPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(Number(e.target.value))}
                className="w-full accent-[#153E2E] dark:accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target / Completion Date
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          <div>
            <FileUpload
              label="Project Cover Photograph"
              value={coverImageUrl}
              onChange={(url) => setCoverImageUrl(url)}
              accept="image/*"
              folder="nkar_woo_lan/projects"
              helperText="Upload site inspection photo or architectural blueprint"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Project Scope &amp; Community Impact *
            </label>
            <textarea
              ref={contentTextareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe objectives, beneficiary quarters, engineering scope, and community contributions..."
              rows={12}
              className="w-full text-xs sm:text-sm p-4 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-100 font-sans leading-relaxed"
              required
            />
          </div>

          {/* Milestones Management */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Project Milestones &amp; Key Deliverables
            </label>

            <div className="flex gap-2">
              <input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="w-40 text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200"
              />
              <input
                type="text"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                placeholder="e.g. Catchment foundation dug and gravel bed laid"
                className="flex-1 text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl text-stone-800 dark:text-stone-200"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-2 bg-[#153E2E] dark:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-2 pt-2">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#FAF8F5] dark:bg-stone-800/60 border border-[#E8E4DA] dark:border-stone-700 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      <div>
                        <span className="font-mono text-stone-400 mr-2">{m.date}:</span>
                        <span className="font-medium text-stone-800 dark:text-stone-200">{m.title}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
      previewContent={
        <div className="space-y-6">
          <div className="border border-[#E8E4DA] dark:border-stone-700 bg-white dark:bg-stone-800 p-6 rounded-xl space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#153E2E] dark:text-emerald-300">
              {title || 'Project Title'}
            </h2>
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                {location || 'Location'}
              </p>
              {budgetCfa !== '' && (
                <p className="flex items-center gap-2 font-mono font-semibold text-[#153E2E] dark:text-emerald-400">
                  <Coins className="w-4 h-4 text-[#D4AF37]" />
                  {Number(budgetCfa).toLocaleString()} CFA
                </p>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 dark:text-stone-300">
                <span>Execution Progress</span>
                <span className="text-[#D4AF37]">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#153E2E] dark:bg-[#D4AF37] transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {coverImageUrl && (
            <div className="overflow-hidden border border-[#E8E4DA] dark:border-stone-700 shadow-xs">
              <img src={coverImageUrl} alt={title} className="w-full h-auto max-h-[360px] object-cover" />
            </div>
          )}

          <div className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Project Scope &amp; Community Impact
            </h3>
            {description ? (
              description.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              <p className="text-stone-400 italic">Project description will format here in real time...</p>
            )}
          </div>
        </div>
      }
    />
  );
};
