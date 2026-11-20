import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import NewsCard from '@/components/NewsCard';
import EventCard from '@/components/EventCard';
import LoadingState from '@/components/LoadingState';
import { useNewsList } from '@/lib/api/news.api';
import { useEventsList } from '@/lib/api/events.api';

export default function NewsEventsSection() {
  const { data: news = [], isLoading: newsLoading } = useNewsList({ limit: 3 });
  const { data: events = [], isLoading: eventsLoading } = useEventsList({ limit: 3 });

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="News & events"
            title="What is happening in Nkar"
            description="Announcements, community meetings and the celebrations of the village year."
          />
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            All news &amp; events
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-600">
              Latest news
            </p>
            {newsLoading ? (
              <LoadingState />
            ) : news.length === 0 ? (
              <p className="mt-7 text-xs text-muted-foreground italic">No news published yet.</p>
            ) : (
              <div className="mt-7 space-y-10">
                {news.map((item, index) => (
                  <NewsCard key={item.id} item={item} featured={index === 0} />
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-600">
              Upcoming events
            </p>
            {eventsLoading ? (
              <LoadingState />
            ) : events.length === 0 ? (
              <p className="mt-7 text-xs text-muted-foreground italic">No upcoming events scheduled.</p>
            ) : (
              <div className="mt-7 space-y-5">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
