import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Copy,
  Check,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingState from '@/components/LoadingState';
import { formatDate, formatDay, formatMonth, formatWeekday } from '@/lib/format';
import { useEventDetail, useEventsList } from '@/lib/api/events.api';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, isError } = useEventDetail(slug || '');
  const { data: recentEvents = [] } = useEventsList({ limit: 4 });
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Event link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-ivory py-24">
        <LoadingState label="Loading event information…" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28 text-center bg-ivory">
        <div className="border border-border bg-card p-12">
          <p className="font-display text-3xl text-forest-700">Event Not Found</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The event you are looking for may have concluded, changed dates, or been archived.
          </p>
          <div className="mt-8">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Events &amp; News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_datetime);
  const isPast = startDate < new Date();
  const dateStr = event.start_datetime.split('T')[0];
  const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const paragraphs = (event.content || '').split('\n\n').filter(Boolean);
  const otherEvents = recentEvents.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <>
      {/* Header Section */}
      <section className="relative overflow-hidden bg-forest-900 text-ivory py-16 md:py-24">
        <div className="absolute inset-0 pattern-toghu-light opacity-30" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-4xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-gold-300/80 mb-6">
            <Link to="/" className="hover:text-gold-200 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/news" className="hover:text-gold-200 transition-colors">News &amp; Events</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px] text-ivory/60">{event.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-gold-300">
            <span className={`px-3 py-1 border ${isPast ? 'border-border bg-card/20 text-ivory/70' : 'border-gold-500/40 bg-gold-500/20 text-gold-300'}`}>
              {isPast ? 'Past Event' : 'Upcoming Event'}
            </span>
            <span className="flex items-center gap-1.5 text-ivory/70">
              <CalendarDays className="h-3.5 w-3.5 text-gold-400" />
              {formatWeekday(dateStr)} · {formatDate(dateStr)}
            </span>
          </div>

          <h1 className="mt-6 font-display text-3xl leading-tight md:text-5xl text-ivory">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Main Event Details */}
      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Event Description & Program */}
            <div>
              {/* Highlight Date & Time Strip */}
              <div className="flex flex-wrap items-center gap-6 border border-border bg-card p-6 md:p-8 mb-8">
                <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-forest-800 px-3 py-4 text-ivory">
                  <span className="font-display text-3xl leading-none text-gold-300">
                    {formatDay(dateStr)}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-[0.22em] text-ivory/80">
                    {formatMonth(dateStr)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-xl text-forest-700">
                    {formatWeekday(dateStr)}, {formatDate(dateStr)}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-gold-600" />
                    Starting at {timeStr}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-forest-700 font-medium">
                    <MapPin className="h-4 w-4 text-gold-600" />
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Event Content */}
              <div className="prose max-w-none space-y-5 text-base leading-relaxed text-forest-800">
                <h3 className="font-display text-2xl text-forest-700 not-prose mb-4">
                  Event Overview &amp; Program
                </h3>
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Share & Actions Toolbar */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-forest-600 hover:text-gold-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Events &amp; News
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-1.5 text-xs font-medium text-forest-700 hover:border-gold-500 hover:text-gold-600 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-gold-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Share event'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Metadata */}
            <aside className="space-y-8 lg:border-l lg:border-border lg:pl-8">
              <div className="border border-border bg-card p-6 space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                  Event Logistics
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Location</span>
                    <span className="font-medium text-forest-800">{event.location}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Organizer</span>
                    <span className="font-medium text-forest-800">{event.organizer_name || 'Nkar Traditional Council'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Date &amp; Time</span>
                    <span className="font-medium text-forest-800">{formatDate(dateStr)} at {timeStr}</span>
                  </div>
                </div>
              </div>

              {otherEvents.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                    Other Events
                  </p>
                  <div className="mt-4 space-y-4">
                    {otherEvents.map((e) => (
                      <Link
                        key={e.id}
                        to={`/events/${e.slug}`}
                        className="group block border-b border-border pb-3 transition-colors"
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {formatDate(e.start_datetime.split('T')[0])}
                        </span>
                        <h4 className="mt-1 font-display text-sm leading-snug text-forest-700 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {e.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
