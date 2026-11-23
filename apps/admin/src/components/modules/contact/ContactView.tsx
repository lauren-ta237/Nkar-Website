import React, { useState } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useAdminContactsList, useAdminContactsMutations } from '@/lib/api/contacts.api';
import { ContactStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { ConfirmModal } from '../../common/ConfirmModal';

export const ContactView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: contacts = [], isLoading } = useAdminContactsList();
  const { updateStatusMutation, deleteMutation } = useAdminContactsMutations();

  const [selectedId, setSelectedId] = useState<string | null>(contacts[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const sortedContacts = [...contacts].sort(
    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );

  const filtered = sortedContacts.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeContact = contacts.find((c) => c.id === (selectedId || filtered[0]?.id));

  const handleStatusChange = (id: string, status: ContactStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleSaveNote = () => {
    if (activeContact && internalNoteText.trim()) {
      updateStatusMutation.mutate(
        { id: activeContact.id, status: activeContact.status, internal_notes: internalNoteText.trim() },
        {
          onSuccess: () => setInternalNoteText(''),
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
          if (selectedId === deleteConfirmId) {
            setSelectedId(null);
          }
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-stone-100 dark:bg-stone-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#153E2E] dark:text-emerald-400" />
            Citizen & Diaspora Inquiries Inbox
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Field inquiries, academic archive permissions, diaspora contributions, and community messages
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-lg font-semibold text-stone-700 dark:text-stone-300">
            Total: {contacts.length}
          </span>
          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 rounded-lg font-semibold">
            Unread: {contacts.filter((c) => c.status === 'UNREAD').length}
          </span>
          <span className="px-3 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg font-semibold">
            Active/Resolved: {contacts.filter((c) => c.status !== 'UNREAD').length}
          </span>
        </div>
      </div>

      {/* Inbox Split Pane Layout */}
      <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Pane: Inbox List (5 cols) */}
        <div className="md:col-span-5 border-r border-[#E8E4DA] dark:border-stone-800 flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search citizen messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#153E2E] text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['ALL', 'UNREAD', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#153E2E] dark:bg-emerald-700 text-white'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'UNREAD' ? 'Unread' : st === 'IN_PROGRESS' ? 'Active' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 max-h-[520px]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500">
                No inquiries matching criteria.
              </div>
            ) : (
              filtered.map((msg) => {
                const isSelected = activeContact?.id === msg.id;
                const isUnread = msg.status === 'UNREAD';
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedId(msg.id)}
                    className={`p-3.5 cursor-pointer transition-all text-xs border-l-4 ${
                      isSelected && isUnread
                        ? 'bg-amber-100/90 dark:bg-amber-950/70 border-l-[#D4AF37] ring-1 ring-inset ring-amber-300 dark:ring-amber-800/80 shadow-xs'
                        : isSelected && !isUnread
                        ? 'bg-[#FAF6EE] dark:bg-stone-850 border-l-[#D4AF37]'
                        : isUnread
                        ? 'bg-amber-50 dark:bg-amber-950/45 border-l-amber-500 hover:bg-amber-100/70 dark:hover:bg-amber-900/40'
                        : 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" title="Unread Inquiry" />
                        )}
                        <span className={`truncate ${isUnread ? 'font-bold text-stone-900 dark:text-stone-100' : 'font-semibold text-stone-700 dark:text-stone-300'}`}>
                          {msg.sender_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0 ml-2">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${isUnread ? 'font-semibold text-stone-900 dark:text-stone-100' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <StatusBadge status={msg.status} />
                      {msg.assigned_to_id && (
                        <span className="text-[10px] text-stone-400">Assigned</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Message Viewer & Action Deck (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-white dark:bg-stone-900">
          {activeContact ? (
            <div className="flex flex-col h-full">
              {/* Header Bar */}
              <div className="p-4 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                    {activeContact.subject}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{activeContact.sender_name}</span>
                    <span>•</span>
                    <span>{activeContact.sender_email}</span>
                    {activeContact.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3" /> {activeContact.phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {currentUser.role === 'SUPER_ADMIN' && (
                  <button
                    onClick={() => setDeleteConfirmId(activeContact.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Unread Attention Banner */}
              {activeContact.status === 'UNREAD' && (
                <div className="px-4 py-2.5 bg-amber-100/80 dark:bg-amber-950/70 border-b border-amber-300 dark:border-amber-800/80 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    Inquiry is currently marked as UNREAD
                  </span>
                  <button
                    onClick={() => handleStatusChange(activeContact.id, 'IN_PROGRESS')}
                    className="px-3 py-1 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-950 dark:text-amber-100 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Acknowledge & Mark Active
                  </button>
                </div>
              )}

              {/* Message Content */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-[#FAF9F7] dark:bg-stone-950 rounded-2xl border border-[#EAE6DD] dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                  {activeContact.message}
                </div>

                {/* Status Toggles */}
                <div>
                  <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
                    Inquiry Lifecycle Status
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'UNREAD')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                        activeContact.status === 'UNREAD'
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                      }`}
                    >
                      Mark Unread
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'IN_PROGRESS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                        activeContact.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                      }`}
                    >
                      Mark as Read / Active
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'RESOLVED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                        activeContact.status === 'RESOLVED'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                      }`}
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

                {/* Internal Council Notes */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Internal Council & Administrative Notes
                  </p>

                  {activeContact.internal_notes ? (
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed mb-3">
                      {activeContact.internal_notes}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 dark:text-stone-500 italic mb-2">No internal notes recorded yet.</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add coordination note for other administrators..."
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      className="flex-1 text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={!internalNoteText.trim()}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-xl disabled:opacity-40 cursor-pointer transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>Received: {new Date(activeContact.created_at).toLocaleString()}</span>
                <span>Assigned to: {activeContact.assigned_to_id || 'Unassigned'}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-stone-400 dark:text-stone-500 text-xs">
              Select an inquiry from the left to read details and record responses.
            </div>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <ConfirmModal
          isOpen={true}
          title="Delete Citizen Inquiry"
          message="Are you sure you want to delete this message record? This action cannot be reversed."
          confirmLabel="Delete Message"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};