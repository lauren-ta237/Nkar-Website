import React from 'react';
import { X, CheckCircle, Clock, AlertCircle, Mail, ArrowRight, Bell } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { usePendingReviews, useContactsList } from '../../api/queries';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export const NotificationDrawer: React.FC = () => {
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    setCurrentPage,
    currentUser,
  } = useAdminStore();

  const { data: pendingItems = [] } = usePendingReviews();
  const { data: contacts = [] } = useContactsList();

  const unreadMessages = contacts.filter((c) => c.status === 'UNREAD');

  return (
    <Sheet open={notificationDrawerOpen} onOpenChange={setNotificationDrawerOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <SheetTitle className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-[#153E2E]" />
              Notifications & Review Queue
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-stone-500">
            Pending editorial submissions and citizen inquiries
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Section 1: Content Awaiting Review */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                Awaiting Review ({pendingItems.length})
              </span>
              {currentUser.role === 'CONTENT_EDITOR' && (
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                  Reviewer Action Required
                </span>
              )}
            </div>

            {pendingItems.length === 0 ? (
              <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-center text-stone-500 text-xs">
                No submissions currently awaiting review. All clear!
              </div>
            ) : (
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl hover:border-[#D4AF37] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold uppercase text-stone-500 block">
                          {item.type} · {item.category || 'General'}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5">{item.title}</h4>
                        <p className="text-[11px] text-stone-500 mt-1">Submitted by {item.submittedBy}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#E8E4DA] flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          if (item.type === 'News') setCurrentPage('news');
                          else if (item.type === 'Events') setCurrentPage('events');
                          else if (item.type === 'Heritage') setCurrentPage('heritage');
                          else if (item.type === 'Gallery') setCurrentPage('gallery');
                          else if (item.type === 'Publications') setCurrentPage('publications');
                          setNotificationDrawerOpen(false);
                        }}
                        className="text-[11px] font-semibold text-[#153E2E] hover:text-[#0C241B] flex items-center gap-1 cursor-pointer"
                      >
                        Review in {item.type} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Unread Contact Inquiries */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                Unread Contact Messages ({unreadMessages.length})
              </span>
            </div>

            {unreadMessages.length === 0 ? (
              <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-xl text-center text-stone-500 text-xs">
                Inbox is up to date. No unread citizen submissions.
              </div>
            ) : (
              <div className="space-y-2">
                {unreadMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setCurrentPage('contact');
                      setNotificationDrawerOpen(false);
                    }}
                    className="p-3 bg-white border border-[#E5E0D5] hover:border-stone-400 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 truncate">{msg.senderName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-stone-700 truncate mt-0.5">{msg.subject}</p>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E8E4DA] bg-[#FAF8F5] text-center">
          <button
            onClick={() => {
              setCurrentPage('dashboard');
              setNotificationDrawerOpen(false);
            }}
            className="text-xs text-[#153E2E] font-semibold hover:underline cursor-pointer"
          >
            Go to Executive Dashboard Overview
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
