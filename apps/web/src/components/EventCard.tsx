import { CalendarDays, MapPin, Users } from 'lucide-react';
import { formatDate, formatDay, formatMonth, formatWeekday } from '@/lib/format';
import SampleBadge from './SampleBadge';
import type { EventItem } from '@/data/news';

interface EventCardProps {
  event: EventItem;
  past?: boolean;
}

export default function EventCard({ event, past = false }: EventCardProps) {
  return (
    <article
      className={`flex h-full gap-5 border p-6 ${
        past ? 'border-border bg-cream/60' : 'border-border bg-card'
      }`}
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center self-start bg-forest-800 px-2 py-3 text-ivory">
        <span className="font-display text-3xl leading-none text-gold-300">
          {formatDay(event.date)}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/70">
          {formatMonth(event.date)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className={past ? '' : 'text-gold-600'}>
            {past ? 'Past event' : 'Upcoming'}
          </span>
          <span>
            {formatWeekday(event.date)} · {event.time}
          </span>
          {event.sample && <SampleBadge />}
        </div>

        <h3 className="mt-3 font-display text-2xl leading-snug text-forest-700">
          {event.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <ul className="mt-4 space-y-2 text-xs text-forest-600">
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {event.venue}
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {event.organiser}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
            {formatDate(event.date)}
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gold-500/30 bg-gold-50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}