import { Image } from '@/components/ui/image';
import type { Gallery } from '@/types/api.types';

interface GalleryGridProps {
  items: Gallery[];
  onOpen: (index: number) => void;
}

export default function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(index)}
          aria-label={`Open image: ${item.title}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-gold-500/25 bg-cream/60 p-1.5 shadow-sm transition-colors hover:border-gold-500/60"
        >
          <span className="relative block h-full w-full overflow-hidden rounded-sm bg-stone-900">
            <Image
              src={item.media_url}
              alt={item.alt_text || item.title}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              fittingType="fill"
              quality={85}
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-900/25 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute inset-x-0 bottom-0 p-5 text-left">
              <span className="block text-[10px] uppercase tracking-[0.26em] text-gold-300">
                {item.category}
              </span>
              <span className="mt-2 block font-display text-xl text-ivory">{item.title}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}