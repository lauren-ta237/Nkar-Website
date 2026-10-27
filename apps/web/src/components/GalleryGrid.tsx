import { Image } from '@/components/ui/image';
import SampleBadge from './SampleBadge';
import type { GalleryItem } from '@/data/gallery';

const aspectClass: Record<string, string> = { wide: 'aspect-[3/2]', square: 'aspect-square' };

interface GalleryGridProps {
  items: GalleryItem[];
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
          className={`group relative overflow-hidden border border-border ${
            aspectClass[item.aspect] || aspectClass.wide
          }`}
        >
          <Image
            src={item.image}
            alt={`${item.title}`}
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
          {item.sample && <SampleBadge className="absolute right-3 top-3 bg-ivory" />}
        </button>
      ))}
    </div>
  );
}