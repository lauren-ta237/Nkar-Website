import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import FilterChips from '@/components/FilterChips';
import NewsCard from '@/components/NewsCard';
import EventCard from '@/components/EventCard';
import LoadingState from '@/components/LoadingState';
import { useEvents, useNews } from '@/hooks/useContent';

export default function NewsEvents() {
  const [category, setCategory] = useState('All');
  const newsQuery = useNews();
  const eventsQuery = useEvents();

  const news = newsQuery.data || [];
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(news.map((item) => item.category)))],
    [news]
  );
  const filteredNews = category === 'All' ? news : news.filter((item) => item.category === category);
  const upcoming = eventsQuery.data?.upcoming || [];
  const past = eventsQuery.data?.past || [];

  return (
    <>
      <PageHero
        eyebrow="News & events"
        title="The village year, as it is lived"
        description="Announcements, community meetings, reports and the cultural celebrations of Nkar — all in one place."
        note="Dates, venues and figures shown are samples until confirmed by the palace and the committees."
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice>
            Nothing on this page is presented as an official notice. Meeting dates, venues,
            organisers and project figures are placeholders, shown so the community can see how the
            news page will work. Confirmed notices will be published here.
          </ContentNotice>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Latest news"
              title="Announcements & community reports"
            />
            <FilterChips
              options={categories}
              value={category}
              onChange={setCategory}
              label="Filter news by category"
            />
          </div>

          {newsQuery.isLoading ? (
            <LoadingState />
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {filteredNews.map((item, index) => (
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
          {eventsQuery.isLoading ? (
            <LoadingState />
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Past events"
            title="Recently held in Nkar"
            description="Ceremonies, sports and gatherings the village has already held."
          />
          {eventsQuery.isLoading ? (
            <LoadingState />
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}