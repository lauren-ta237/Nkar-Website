import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import ContentNotice from '@/components/ContentNotice';
import FilterChips from '@/components/FilterChips';
import GalleryGrid from '@/components/GalleryGrid';
import Lightbox from '@/components/Lightbox';
import LoadingState from '@/components/LoadingState';
import { useGalleryList } from '@/lib/api/gallery.api';

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const categoryParam = category === 'All' ? undefined : category;
  const { data: items = [], isLoading } = useGalleryList({ category: categoryParam });

  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((index) => (index === null ? 0 : (index - 1 + items.length) % items.length));
  const next = () =>
    setOpenIndex((index) => (index === null ? 0 : (index + 1) % items.length));

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Nkar, seen and remembered"
        description="Photographs of the land, the crafts, the ceremonies, and the daily life of the village, gathered here for the people who live it and those across the diaspora."
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice title="Photograph policy">
            Visual records from across the Nkar Fondom, credited to the photographers, custodians, and families who supply them.
          </ContentNotice>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <FilterChips
              options={categories}
              value={category}
              onChange={(value) => {
                setCategory(value);
                setOpenIndex(null);
              }}
              label="Filter the gallery"
            />
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {items.length} {items.length === 1 ? 'image' : 'images'}
            </p>
          </div>

          <div className="mt-10">
            {isLoading ? (
              <LoadingState label="Loading the gallery…" />
            ) : items.length === 0 ? (
              <div className="p-8 text-center border border-border bg-card">
                <p className="text-sm text-muted-foreground italic">
                  No photographs found in this category.
                </p>
              </div>
            ) : (
              <GalleryGrid items={items} onOpen={setOpenIndex} />
            )}
          </div>

          <div className="mt-14 grid gap-8 border-t border-border pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-600">
                Films & recordings
              </p>
              <h2 className="mt-4 font-display text-3xl text-forest-700">
                Recorded heritage, to come
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Ceremonies, drumming and dance, and the accounts of elders recorded in their own
                voices will be published here as film and audio, with the permission of the palace
                and the families involved.
              </p>
            </div>
            <div className="border border-gold-500/40 bg-gold-50/70 p-8">
              <p className="font-display text-2xl text-forest-700">Send your photographs</p>
              <p className="mt-3 text-sm leading-relaxed text-forest-800">
                Old prints, family photographs and recent pictures all have a place here. Tell us
                who is in them and when they were taken, where you know.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-700 transition-colors hover:text-gold-700"
              >
                Submit a photograph
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {openIndex !== null && items[openIndex] && (
        <Lightbox
          items={items}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}
