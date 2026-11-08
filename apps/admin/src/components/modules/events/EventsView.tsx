import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Star,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useEventsList, useEventsMutations } from '../../../api/queries';
import { EventItem } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';
import { EventsFormModal } from './EventsFormModal';
import { InteractiveCalendar } from './InteractiveCalendar';

export const EventsView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: events = [], isLoading } = useEventsList();
  const { createMutation, updateMutation, publishMutation, archiveMutation, deleteMutation } =
    useEventsMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'calendar' | 'cards' | 'table'>('calendar');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const canManage =
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'CONTENT_REVIEWER' ||
    currentUser.role === 'CONTENT_EDITOR';

  const filtered = events.filter((e) => {
    const matchesSearch =
      searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = (data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEvent && editingEvent.id) {
      updateMutation.mutate(
        { id: editingEvent.id, updates: data },
        {
          onSuccess: () => {
            setFormModalOpen(false);
            setEditingEvent(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
            Cultural & Civic Events Management
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Schedule and coordinate palace festivities, general assemblies, and youth competitions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-stone-900 p-1 border border-[#E8E4DA] dark:border-stone-800 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-stone-800 text-[#153E2E] dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Interactive Monthly Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-stone-800 text-[#153E2E] dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-stone-800 text-[#153E2E] dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingEvent(null);
              setFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-[#153E2E] bg-[#D4AF37] hover:bg-[#E5B83B] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, location or organizer..."
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
              <option value="ALL">All Event Statuses</option>
              <option value="PUBLISHED">Published (Official)</option>
              <option value="APPROVED">Approved</option>
              <option value="SUBMITTED">Under Review</option>
              <option value="DRAFT">Drafts</option>
              <option value="ARCHIVED">Past / Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === 'calendar' ? (
        <InteractiveCalendar
          events={events}
          onSelectEvent={(evt) => {
            setEditingEvent(evt);
            setFormModalOpen(true);
          }}
          onScheduleForDate={(dateStr) => {
            setEditingEvent({
              eventDate: dateStr,
              startTime: '09:00',
              endTime: '17:00',
              location: 'Nkar Royal Palace Grand Courtyard',
            });
            setFormModalOpen(true);
          }}
          canManage={canManage}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Events Found"
          description="Schedule an event for Nkar Woo Làn to inform the community and diaspora."
          actionLabel="Schedule Event"
          onAction={() => {
            setEditingEvent(null);
            setFormModalOpen(true);
          }}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => {
            const canEdit =
              currentUser.role === 'SUPER_ADMIN' ||
              currentUser.role === 'CONTENT_REVIEWER' ||
              (currentUser.role === 'CONTENT_EDITOR' && event.authorId === currentUser.id);

            const canDelete = currentUser.role === 'SUPER_ADMIN';

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
              >
                <div>
                  {event.coverImage && (
                    <div className="w-full h-40 bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <StatusBadge status={event.status} />
                      </div>
                      {event.isFeatured && (
                        <div className="absolute bottom-2.5 left-2.5 bg-[#153E2E]/90 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                          <Star className="w-3 h-3 fill-[#D4AF37]" /> Featured
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#153E2E] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#F2EFE9] dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-semibold text-stone-800 dark:text-stone-200">{event.eventDate}</span>
                        <span className="text-stone-400">·</span>
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>

                      <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#153E2E] dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <p className="text-[11px] text-stone-400 truncate">
                        Organizer: <span className="font-medium text-stone-700 dark:text-stone-300">{event.organizer}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] dark:bg-stone-950 border-t border-[#E8E4DA] dark:border-stone-800 flex items-center justify-between">
                  {event.status === 'SUBMITTED' && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') ? (
                    <button
                      onClick={() => publishMutation.mutate(event.id)}
                      className="text-xs font-bold text-[#153E2E] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Approve & Publish
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-400 truncate">/{event.slug}</span>
                  )}

                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setFormModalOpen(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => setDeleteConfirmId(event.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-stone-950 border-b border-[#E8E4DA] dark:border-stone-800 text-stone-500 dark:text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Event & Location</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Organizer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((event) => {
                  const canEdit =
                    currentUser.role === 'SUPER_ADMIN' ||
                    currentUser.role === 'CONTENT_REVIEWER' ||
                    (currentUser.role === 'CONTENT_EDITOR' && event.authorId === currentUser.id);
                  const canDelete = currentUser.role === 'SUPER_ADMIN';

                  return (
                    <tr key={event.id} className="hover:bg-[#FAF9F6] dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {event.coverImage ? (
                            <img
                              src={event.coverImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-stone-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                              {event.title}
                            </span>
                            <span className="text-[11px] text-stone-400 truncate block flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#D4AF37]" /> {event.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-600 dark:text-stone-300 text-[11px]">
                        <div>{event.eventDate}</div>
                        <div className="text-[10px] text-stone-400">{event.startTime} - {event.endTime}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-700 dark:text-stone-300">
                        {event.organizer}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <button
                              onClick={() => {
                                setEditingEvent(event);
                                setFormModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                              title="Edit Event"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteConfirmId(event.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* Modals */}
      {formModalOpen && (
        <EventsFormModal
          isOpen={formModalOpen}
          initialData={editingEvent}
          onClose={() => {
            setFormModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Event"
          message="Are you sure you want to delete this event? This action will remove it from the public community calendar."
          confirmLabel="Delete Event"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
