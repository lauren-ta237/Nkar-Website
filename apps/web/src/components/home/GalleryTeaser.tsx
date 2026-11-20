import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SectionHeading from '@/components/SectionHeading';
import LoadingState from '@/components/LoadingState';
import { useGalleryList } from '@/lib/api/gallery.api';

export default function GalleryTeaser() {
  const { data: gallery = [], isLoading } = useGalleryList();
  const featured = gallery.slice(0, 3);

  return (
    <section className="border-y border-border bg-cream/60 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Gallery"
            title="Featured photographs"
            description="A curated preview of the gallery: authentic landscapes, royal regalia, crafts, and ceremonies from across the Nkar Fondom."
          />
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            Open the gallery
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : featured.length === 0 ? (
          <p className="mt-12 text-xs text-muted-foreground italic">No gallery photographs published yet.</p>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="group relative aspect-[4/3] overflow-hidden border border-border bg-stone-900"
              >
                <Image
                  src={item.media_url}
                  alt={item.alt_text || item.title}
                  className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                  fittingType="fill"
                  quality={80}
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/25 to-transparent"
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 p-5 text-left">
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-gold-300">
                    {item.category}
                  </span>
                  <span className="mt-2 block font-display text-lg text-ivory">{item.title}</span>
                </span>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Recorded film, including ceremonies, elders' oral accounts, and community celebrations, will be published in the
          gallery as it is documented and confirmed with the palace and families involved.
        </p>
      </div>
    </section>
  );
}
