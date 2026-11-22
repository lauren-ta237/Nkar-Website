import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { ContentEditorLayout } from '@/components/common/editor/ContentEditorLayout';
import { useAdminEventsList, useAdminEventsMutations } from '@/lib/api/events.api';
import { EventItem, ContentStatus } from '@/types';
import { useAdminStore } from '@/store/useAdminStore';

export const EventEditorView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAdminStore();
  const { data: events = [] } = useAdminEventsList();
  const { createMutation, updateMutation } = useAdminEventsMutations();

  const isEditMode = Boolean(id);
  const existingEvent = id ? events.find((e) => e.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('Nkar Traditional Council');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState<string | null>(null);

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setSlug(existingEvent.slug);
      setLocation(existingEvent.location || '');
      setOrganizer(existingEvent.organizer_name || 'Nkar Traditional Council');
      setStartDatetime(existingEvent.start_datetime ? existingEvent.start_datetime.substring(0, 16) : '');
      setEndDatetime(existingEvent.end_datetime ? existingEvent.end_datetime.substring(0, 16) : '');
      setContent(existingEvent.content);
      setStatus(existingEvent.status || 'PUBLISHED');
    }
  }, [existingEvent]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
  };

  const handleInsertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const el = contentTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end) || defaultText;
    const nextText = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setContent(nextText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = () => {
    setError(null);
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    const generatedSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!generatedSlug) {
      setError('A valid title is required to generate the event slug.');
      return;
    }
    if (!location.trim()) {
      setError('Event venue or location is required.');
      return;
    }
    if (!startDatetime) {
      setError('Event start date and time is required.');
      return;
    }
    if (!content.trim()) {
      setError('Event description and program is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      location: location.trim(),
      organizer_name: organizer.trim() || 'Nkar Traditional Council',
      start_datetime: new Date(startDatetime).toISOString(),
      end_datetime: endDatetime ? new Date(endDatetime).toISOString() : null,
      content: content.trim(),
      status,
    };

    if (isEditMode && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => navigate('/events'),
          onError: (err: any) => setError(err?.response?.data?.message || 'Failed to update event'),
        }
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => navigate('/events'),
        onError: (err: any) => setError(err?.response?.data?.message || 'Failed to schedule event'),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <ContentEditorLayout
      title={title || 'New Event Program'}
      category="Ceremonies & Festivals"
      status={status}
      backUrl="/events"
      onBack={() => navigate('/events')}
      onSave={handleSave}
      isSaving={isSaving}
      saveButtonLabel={isEditMode ? 'Update Event' : 'Schedule Event'}
      wordCount={wordCount}
      readingTimeMinutes={readingTimeMinutes}
      contentRef={contentTextareaRef}
      onInsertMarkdown={handleInsertMarkdown}
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
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Annual Nkar Cultural Festival & Royal Dance"
              className="w-full text-sm p-3 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-[#153E2E]/20 text-stone-900 dark:text-stone-100 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Venue & Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nkar Royal Palace Esplanade"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Organizer Body
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Nkar Traditional Council"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={startDatetime}
                onChange={(e) => setStartDatetime(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={endDatetime}
                onChange={(e) => setEndDatetime(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-200"
              >
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted for Review</option>
                <option value="APPROVED">Approved</option>
                <option value="PUBLISHED">Published (Official)</option>
                <option value="ARCHIVED">Archived / Past</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Event Overview & Program Breakdown *
            </label>
            <textarea
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detail the ceremony itinerary, expected royal delegations, traditional attire, and guidelines..."
              rows={12}
              className="w-full text-xs sm:text-sm p-4 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E5E0D5] dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:outline-none text-stone-800 dark:text-stone-100 font-sans leading-relaxed"
              required
            />
          </div>
        </div>
      }
      previewContent={
        <div className="space-y-6">
          <div className="border border-[#E8E4DA] dark:border-stone-700 bg-white dark:bg-stone-800 p-5 rounded-xl space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#153E2E] dark:text-emerald-300">
              {title || 'Event Name'}
            </h2>
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                {startDatetime
                  ? new Date(startDatetime).toLocaleString(undefined, {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })
                  : 'Start date not set'}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                {location || 'Location will appear here'}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                {organizer || 'Nkar Traditional Council'}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Event Schedule &amp; Community Program
            </h3>
            {content ? (
              content.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              <p className="text-stone-400 italic">
                Event program description will preview here in real time...
              </p>
            )}
          </div>
        </div>
      }
    />
  );
};
