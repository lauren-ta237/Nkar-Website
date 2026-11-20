import { Image } from '@/components/ui/image';
import type { Gallery } from '@/types/api.types';

interface GalleryGridProps {
  items: Gallery[];
  onOpen: (index: number) => void;
}

export default function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(index)}
          aria-label={`Open image: ${item.title}`}
          className="group relative aspect-[3/2] overflow-hidden border border-border bg-stone-900"
        >
          <Image
            src={item.media_url}
            alt={item.alt_text || item.title}
            className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
            fittingType="fill"
            quality={80}
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute inset-x-0 bottom-0 p-5 text-left">
            <span className="block text-[10px] uppercase tracking-[0.26em] text-gold-300">
              {item.category}
            </span>
            <span className="mt-2 block font-display text-xl text-ivory">{item.title}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
