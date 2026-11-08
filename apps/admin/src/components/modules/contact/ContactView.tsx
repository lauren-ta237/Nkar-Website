import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Calendar,
  User,
  MessageSquare,
  CornerDownRight,
  Send,
  Filter,
} from 'lucide-react';
import { useContactsList, useContactsMutations } from '../../../api/queries';
import { ContactSubmission, ContactStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { StatusBadge } from '../../common/StatusBadge';
import { EmptyState } from '../../common/EmptyState';
import { ConfirmModal } from '../../common/ConfirmModal';

export const ContactView: React.FC = () => {
  const { currentUser } = useAdminStore();
  const { data: contacts = [], isLoading } = useContactsList();
  const { updateStatusMutation, deleteMutation } = useContactsMutations();

  const [selectedId, setSelectedId] = useState<string | null>(contacts[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        { id: activeContact.id, status: activeContact.status, notes: internalNoteText.trim() },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#153E2E]" />
            Citizen & Diaspora Inquiries Inbox
          </h2>
          <p className="text-xs text-stone-500">
            Field inquiries, academic archive permissions, diaspora contributions, and community messages
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-white border border-[#E8E4DA] rounded-lg font-semibold text-stone-700">
            Total: {contacts.length}
          </span>
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-semibold">
            Unread: {contacts.filter((c) => c.status === 'UNREAD').length}
          </span>
        </div>
      </div>

      {/* Inbox Split Pane Layout */}
      <div className="bg-white border border-[#E8E4DA] rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Pane: Inbox List (5 cols) */}
        <div className="md:col-span-5 border-r border-[#E8E4DA] flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-[#E8E4DA] bg-[#FAF8F5] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search citizen messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#153E2E]"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['ALL', 'UNREAD', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#153E2E] text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st === 'UNREAD' ? 'Unread' : st === 'IN_PROGRESS' ? 'Active' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 max-h-[520px]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No inquiries matching criteria.
              </div>
            ) : (
              filtered.map((msg) => {
                const isSelected = activeContact?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedId(msg.id);
                      if (msg.status === 'UNREAD') {
                        handleStatusChange(msg.id, 'IN_PROGRESS');
                      }
                    }}
                    className={`p-3.5 cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-[#FAF6EE] border-l-4 border-l-[#D4AF37]'
                        : msg.status === 'UNREAD'
                        ? 'bg-amber-50/40 hover:bg-stone-50 font-semibold'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 truncate">{msg.senderName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-stone-800 font-medium truncate">{msg.subject}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={msg.status} />
                      {msg.assignedTo && (
                        <span className="text-[10px] text-stone-400">Assigned: {msg.assignedTo.split(' ')[0]}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Message Viewer & Action Deck (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between bg-white">
          {activeContact ? (
            <div className="flex flex-col h-full">
              {/* Header Bar */}
              <div className="p-4 border-b border-[#E8E4DA] bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 leading-tight">
                    {activeContact.subject}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span className="font-semibold text-stone-800">{activeContact.senderName}</span>
                    <span>·</span>
                    <span>{activeContact.email}</span>
                    {activeContact.phoneNumber && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3" /> {activeContact.phoneNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {currentUser.role === 'SUPER_ADMIN' && (
                  <button
                    onClick={() => setDeleteConfirmId(activeContact.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Message Content */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-[#EAE6DD] text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                  {activeContact.message}
                </div>

                {/* Status Toggles */}
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Inquiry Lifecycle Status
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'UNREAD')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        activeContact.status === 'UNREAD'
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Mark Unread
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'IN_PROGRESS')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        activeContact.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeContact.id, 'RESOLVED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        activeContact.status === 'RESOLVED'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

                {/* Internal Council Notes */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Internal Council & Administrative Notes
                  </p>

                  {activeContact.internalNotes ? (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed mb-3">
                      {activeContact.internalNotes}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic mb-2">No internal notes recorded yet.</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add coordination note for other administrators..."
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      className="flex-1 text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={!internalNoteText.trim()}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#153E2E] hover:bg-[#0E2C20] rounded-xl disabled:opacity-40 cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#E8E4DA] bg-[#FAF8F5] flex items-center justify-between text-[11px] text-stone-500">
                <span>Received: {new Date(activeContact.createdAt).toLocaleString()}</span>
                <span>Assigned to: {activeContact.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-stone-400 text-xs">
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
