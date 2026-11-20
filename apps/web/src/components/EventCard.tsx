import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { formatDate, formatDay, formatMonth, formatWeekday } from '@/lib/format';
import type { EventItem } from '@/types/api.types';

interface EventCardProps {
  event: EventItem;
  past?: boolean;
}

export default function EventCard({ event, past = false }: EventCardProps) {
  const startDate = new Date(event.start_datetime);
  const dateStr = event.start_datetime.split('T')[0];
  const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article
      className={`flex h-full gap-5 border p-6 ${
        past ? 'border-border bg-cream/60' : 'border-border bg-card'
      }`}
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center self-start bg-forest-800 px-2 py-3 text-ivory">
        <span className="font-display text-3xl leading-none text-gold-300">
          {formatDay(dateStr)}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/70">
          {formatMonth(dateStr)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className={past ? '' : 'text-gold-600'}>
            {past ? 'Past event' : 'Upcoming'}
          </span>
          <span>
            {formatWeekday(dateStr)} · {timeStr}
          </span>
        </div>

        <h3 className="mt-3 font-display text-2xl leading-snug text-forest-700">
          <Link to={`/events/${event.slug}`} className="hover:text-gold-600 transition-colors">
            {event.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {event.content}
        </p>

        <ul className="mt-4 space-y-2 text-xs text-forest-600">
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {event.location}
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {event.organizer_name || 'Nkar Traditional Council'}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {formatDate(dateStr)}
          </li>
        </ul>

        <div className="mt-5 border-t border-border pt-4">
          <Link
            to={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-600 hover:text-forest-700 transition-colors"
          >
            Event Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
