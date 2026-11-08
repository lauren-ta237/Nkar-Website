import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Newspaper,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Archive,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNewsList, useNewsMutations } from '../../../api/queries';
import { News, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { ReviewActionModal } from '../../common/ReviewActionModal';
import { NewsFormModal } from './NewsFormModal';
import { NewsDetailModal } from './NewsDetailModal';

export const NewsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: news = [], isLoading } = useNewsList();
  const {
    createMutation,
    updateMutation,
    approveMutation,
    rejectMutation,
    publishMutation,
    archiveMutation,
    deleteMutation,
  } = useNewsMutations();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<News | null>(null);
  const [detailArticle, setDetailArticle] = useState<News | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [reviewModalArticle, setReviewModalArticle] = useState<News | null>(null);

  // Filtered news
  const filtered = news.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPageNum - 1) * itemsPerPage, currentPageNum * itemsPerPage);

  const categories = Array.from(new Set(news.map((n) => n.category)));

  const handleCreateOrUpdate = (data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) => {
    if (editingArticle) {
      updateMutation.mutate(
        { id: editingArticle.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingArticle(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormModalOpen(false);
        },
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

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#153E2E]" />
            News & Announcements Management
          </h2>
          <p className="text-xs text-stone-500">
            Publish official announcements, project updates, and royal bulletins from Nkar Fondom
          </p>
        </div>

        <button
          onClick={() => {
            setEditingArticle(null);
            setFormModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, keywords or tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Publication Statuses</option>
              <option value="PUBLISHED">Published (Live)</option>
              <option value="APPROVED">Approved by Reviewer</option>
              <option value="SUBMITTED">Submitted (Pending Review)</option>
              <option value="DRAFT">Drafts</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPageNum(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-700"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Articles Management Table */}
      {paginated.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No News Articles Found"
          description="Try modifying your search keywords or filter settings, or compose a new announcement."
          actionLabel="Create Announcement"
          onAction={() => {
            setEditingArticle(null);
            setFormModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E4DA] text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Article Title & Slug</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Views</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginated.map((item) => {
                  const canEdit =
                    currentUser.role === 'SUPER_ADMIN' ||
                    currentUser.role === 'CONTENT_REVIEWER' ||
                    (currentUser.role === 'CONTENT_EDITOR' && item.authorId === currentUser.id);

                  const canDelete = currentUser.role === 'SUPER_ADMIN';

                  const canReview =
                    item.status === 'SUBMITTED' &&
                    (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER');

                  const canPublish =
                    item.status === 'APPROVED' &&
                    (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER');

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F6] transition-colors group">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                              <Newspaper className="w-4 h-4 text-stone-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {item.isFeatured && (
                                <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37] shrink-0" />
                              )}
                              <span className="font-bold text-stone-900 truncate block group-hover:text-[#153E2E] transition-colors">
                                {item.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400 block truncate">
                              /{item.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                        {item.authorName}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-stone-500 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-center tabular-nums text-stone-600 font-medium">
                        {item.viewsCount}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailArticle(item)}
                            className="p-1.5 text-stone-500 hover:text-[#153E2E] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingArticle(item);
                                setFormModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {canReview && (
                            <button
                              onClick={() => setReviewModalArticle(item)}
                              className="px-2 py-1 text-[11px] font-bold text-[#153E2E] bg-[#D4AF37]/30 hover:bg-[#D4AF37] rounded-md transition-colors cursor-pointer"
                              title="Approve / Reject"
                            >
                              Review
                            </button>
                          )}

                          {canPublish && (
                            <button
                              onClick={() => publishMutation.mutate(item.id)}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-[#153E2E] hover:bg-[#0D2B1F] rounded-md transition-colors cursor-pointer"
                              title="Publish Live"
                            >
                              Publish
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#E8E4DA] bg-[#FAF8F5] flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing {(currentPageNum - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPageNum * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPageNum((p) => Math.max(p - 1, 1))}
                disabled={currentPageNum === 1}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-stone-800 px-2 tabular-nums">
                Page {currentPageNum} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPageNum((p) => Math.min(p + 1, totalPages))}
                disabled={currentPageNum === totalPages}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {formModalOpen && (
        <NewsFormModal
          isOpen={formModalOpen}
          initialData={editingArticle}
          onClose={() => {
            setFormModalOpen(false);
            setEditingArticle(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {detailArticle && (
        <NewsDetailModal
          article={detailArticle}
          onClose={() => setDetailArticle(null)}
          onEdit={(art) => {
            setDetailArticle(null);
            setEditingArticle(art);
            setFormModalOpen(true);
          }}
          onPublish={(id) => publishMutation.mutate(id)}
          onReview={(art) => {
            setDetailArticle(null);
            setReviewModalArticle(art);
          }}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete News Article"
          message="Are you sure you want to permanently delete this news article? This action cannot be reversed and an immutable audit log will be created."
          confirmLabel="Delete Permanently"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}

      {reviewModalArticle && (
        <ReviewActionModal
          isOpen={true}
          itemTitle={reviewModalArticle.title}
          itemType="News Article"
          onApprove={(notes) => {
            approveMutation.mutate({ id: reviewModalArticle.id, notes });
            setReviewModalArticle(null);
          }}
          onReject={(notes) => {
            rejectMutation.mutate({ id: reviewModalArticle.id, notes });
            setReviewModalArticle(null);
          }}
          onCancel={() => setReviewModalArticle(null)}
          isLoading={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </div>
  );
};
