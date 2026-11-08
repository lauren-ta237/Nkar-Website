import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { EventItem, ContentStatus } from '../../../types';
import { useAdminStore } from '../../../store/useAdminStore';
import { FileUpload } from '../../common/FileUpload';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface EventsFormModalProps {
  isOpen: boolean;
  initialData?: Partial<EventItem> | null;
  onClose: () => void;
  onSubmit: (data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const EventsFormModal: React.FC<EventsFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { currentUser } = useAdminStore();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [organizer, setOrganizer] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<ContentStatus>('PUBLISHED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      setEventDate(initialData.eventDate || '');
      setStartTime(initialData.startTime || '09:00');
      setEndTime(initialData.endTime || '17:00');
      setOrganizer(initialData.organizer || '');
      setCoverImage(initialData.coverImage || '');
      setIsFeatured(initialData.isFeatured || false);
      setStatus(initialData.status || 'PUBLISHED');
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setLocation('Nkar Royal Palace Grounds');
      setEventDate(new Date().toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('17:00');
      setOrganizer('Nkar Traditional Council');
      setCoverImage('');
      setIsFeatured(false);
      setStatus(currentUser.role === 'CONTENT_EDITOR' ? 'SUBMITTED' : 'PUBLISHED');
    }
    setError('');
  }, [initialData, isOpen, currentUser.role]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate || !location.trim() || !organizer.trim()) {
      setError('Title, date, location, and organizer are required fields.');
      return;
    }

    onSubmit({
      title: title.trim(),
      slug: slug.trim() || `event-${Date.now()}`,
      description: description.trim(),
      location: location.trim(),
      eventDate,
      startTime,
      endTime,
      organizer: organizer.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      isFeatured,
      status,
      authorId: currentUser.id,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-white border-l border-[#E5E0D5]">
        <SheetHeader className="p-5 border-b border-[#E8E4DA] bg-[#FAF8F5] text-left">
          <SheetTitle className="font-bold text-stone-900 text-sm">
            {initialData ? 'Edit Cultural Event' : 'Schedule New Event'}
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500">
            Traditional festivals, cultural gatherings, and community assemblies
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
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Ngon Nkar Grand Cultural Festival Opening"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-900 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Date *</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              >
                <option value="PUBLISHED">Published (Official)</option>
                <option value="SUBMITTED">Submitted for Review</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Nkar Palace Square / Community Hall"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Organizing Body *</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="e.g. Nkar Traditional Council / NKACUDA"
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <FileUpload
              label="Event Banner / Cover Image"
              value={coverImage}
              onChange={(url) => setCoverImage(url)}
              accept="image/*"
              helperText="Upload JPG, PNG, or WebP promotional cover image"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full details of the program, rites, and public attendance..."
              rows={4}
              className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:bg-white focus:outline-none text-stone-800"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#E5E0D5] text-[#153E2E] focus:ring-[#153E2E] w-4 h-4"
              />
              <span className="text-xs font-semibold text-stone-700">Highlight as Featured Village Event</span>
            </label>
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
              {isLoading ? 'Saving...' : initialData ? 'Update Event' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
