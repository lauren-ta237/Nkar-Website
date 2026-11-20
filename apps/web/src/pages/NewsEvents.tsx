import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import FilterChips from '@/components/FilterChips';
import NewsCard from '@/components/NewsCard';
import EventCard from '@/components/EventCard';
import LoadingState from '@/components/LoadingState';
import { useNewsList } from '@/lib/api/news.api';
import { useEventsList } from '@/lib/api/events.api';

const NEWS_CATEGORIES = [
  'All',
  'Announcements',
  'Clan News',
  'Culture',
  'Celebrations',
  'Education',
  'Health',
  'Obituaries',
];

export default function NewsEvents() {
  const [category, setCategory] = useState('All');
  const categoryParam = category === 'All' ? undefined : category.toLowerCase().replace(/ /g, '_');
  
  const { data: news = [], isLoading: newsLoading } = useNewsList({ category: categoryParam });
  const { data: events = [], isLoading: eventsLoading } = useEventsList();

  const now = new Date();
  const upcoming = useMemo(
    () => events.filter((e) => new Date(e.start_datetime) >= now),
    [events, now]
  );
  const past = useMemo(
    () => events.filter((e) => new Date(e.start_datetime) < now),
    [events, now]
  );

  return (
    <>
      <PageHero
        eyebrow="News & events"
        title="The village year, as it is lived"
        description="Announcements, community meetings, progress reports, and the cultural celebrations of Nkar, all in one place."
        note="Dates, venues, and figures are published after confirmation by the palace council and organizing committees."
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice>
            Official notices, cultural bulletins, and upcoming community calendar entries published directly
            by the Nkar traditional council and development committees.
          </ContentNotice>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Latest news"
              title="Announcements & community reports"
            />
            <FilterChips
              options={NEWS_CATEGORIES}
              value={category}
              onChange={setCategory}
              label="Filter news by category"
            />
          </div>

          {newsLoading ? (
            <LoadingState />
          ) : news.length === 0 ? (
            <div className="mt-12 p-8 text-center border border-border bg-card">
              <p className="text-sm text-muted-foreground italic">
                No news articles currently published in this category.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {news.map((item, index) => (
                <NewsCard key={item.id} item={item} featured={index === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Upcoming"
            title="Events, meetings & celebrations"
            description="What the village has ahead of it: assemblies, town halls, the diaspora dialogue and the cultural festival."
          />
          {eventsLoading ? (
            <LoadingState />
          ) : upcoming.length === 0 ? (
            <div className="mt-12 p-8 text-center border border-border bg-card">
              <p className="text-sm text-muted-foreground italic">
                No upcoming events currently scheduled on the calendar.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="bg-ivory py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionHeading
              eyebrow="Past events"
              title="Recently held in Nkar"
              description="Ceremonies, sports and gatherings the village has already held."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
