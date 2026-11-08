import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useProjectsList, useProjectsMutations } from '../../../api/queries';
import { DevelopmentProject } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { ProjectsFormModal } from './ProjectsFormModal';

export const ProjectsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: projects = [], isLoading } = useProjectsList();
  const { createMutation, updateMutation, deleteMutation } = useProjectsMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DevelopmentProject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = (data: Omit<DevelopmentProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      updateMutation.mutate(
        { id: editingProject.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingProject(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setFormModalOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const canManage = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER';
  const canDelete = currentUser.role === 'SUPER_ADMIN';

  const totalCommittedBudget = projects.reduce((acc, p) => acc + p.budgetXAF, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#153E2E]" />
            Community Development Projects
          </h2>
          <p className="text-xs text-stone-500">
            Water catchments, solar electrification, school labs, roads, and village civic infrastructure
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingProject(null);
              setFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Project</span>
          </button>
        )}
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Development Capital</p>
          <p className="text-xl font-bold text-stone-900 mt-1 tabular-nums">
            {totalCommittedBudget.toLocaleString()} XAF
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Across {projects.length} community initiatives</p>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Construction</p>
          <p className="text-xl font-bold text-[#153E2E] mt-1 tabular-nums">
            {projects.filter((p) => p.status === 'IN_PROGRESS').length} Projects
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Under active engineering supervision</p>
        </div>

        <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Completed & Commissioned</p>
          <p className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">
            {projects.filter((p) => p.status === 'COMPLETED').length} Handed Over
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">100% community access verified</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project name, location or coordinator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Project Statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PLANNING">Planning & Feasibility</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Development Projects Found"
          description="Initiate a community infrastructure project for Nkar Village."
          actionLabel={canManage ? 'Initiate Project' : undefined}
          onAction={() => {
            setEditingProject(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-[#E8E4DA] rounded-2xl overflow-hidden shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
            >
              <div>
                {proj.coverImage && (
                  <div className="w-full h-44 bg-stone-100 overflow-hidden relative">
                    <img
                      src={proj.coverImage}
                      alt={proj.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <StatusBadge status={proj.status} />
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-[#153E2E] shrink-0" />
                    <span className="font-semibold text-stone-700 truncate">{proj.location}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#153E2E] transition-colors leading-snug">
                    {proj.projectName}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Progress Bar & Budget */}
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EAE6DD] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Budget:</span>
                      <span className="font-bold text-stone-900 tabular-nums">
                        {proj.budgetXAF.toLocaleString()} XAF
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-stone-500">Milestone Progress</span>
                        <span className="font-bold text-[#153E2E] tabular-nums">
                          {proj.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#153E2E] to-[#40916C] rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col gap-1 text-[11px] text-stone-500">
                      <p className="truncate">
                        Lead: <span className="font-semibold text-stone-700">{proj.leadCoordinator}</span>
                      </p>
                      <p className="truncate">
                        Funding: <span className="text-stone-700">{proj.fundingSource}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E4DA] flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400 font-mono">
                  Started {proj.startDate}
                </span>

                <div className="flex items-center gap-1">
                  {canManage && (
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setFormModalOpen(true);
                      }}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Update Project"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {formModalOpen && (
        <ProjectsFormModal
          isOpen={formModalOpen}
          initialData={editingProject}
          onClose={() => {
            setFormModalOpen(false);
            setEditingProject(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Development Project"
          message="Are you sure you want to delete this development project record? This will remove its budget and progress tracking."
          confirmLabel="Delete Project"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
