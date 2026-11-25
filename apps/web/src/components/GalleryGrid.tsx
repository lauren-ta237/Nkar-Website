import { Play } from 'lucide-react';
import { Image } from '@/components/ui/image';
import type { Gallery } from '@/types/api.types';

interface GalleryGridProps {
  items: Gallery[];
  onOpen: (index: number) => void;
}

export function isVideoGalleryItem(item: Pick<Gallery, 'media_type' | 'media_url'>): boolean {
  if (String(item.media_type || '').toLowerCase() === 'video') return true;
  return /(\.(mp4|webm|ogg|mov|m4v)(\?|#|$)|\/video\/upload\/)/i.test(item.media_url || '');
}

export function normalizeMediaUrl(url?: string | null): string {
  if (!url) return '';
  return url.trim().replace(/^http:\/\//i, 'https://');
}

export default function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const isVideo = isVideoGalleryItem(item);
        const mediaSrc = normalizeMediaUrl(item.media_url);
        const posterSrc = item.thumbnail_url ? normalizeMediaUrl(item.thumbnail_url) : undefined;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={`Open ${isVideo ? 'video' : 'image'}: ${item.title}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-gold-500/25 bg-card p-1.5 text-left shadow-sm transition-colors hover:border-gold-500/60"
          >
            <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-950">
              {isVideo ? (
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <Image
                  src={mediaSrc}
                  alt={item.alt_text || item.title}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  fittingType="fill"
                  quality={85}
                />
              )}

              {isVideo && (
                <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm border border-gold-500/30 bg-forest-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                  <Play className="h-3 w-3 fill-current" />
                  Video
                </span>
              )}
            </span>

            <span className="block px-3 py-3.5 sm:px-4 sm:py-4">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-600">
                {item.category}
              </span>
              <span className="mt-1.5 block font-display text-base leading-snug text-forest-700 line-clamp-2 sm:text-lg group-hover:text-gold-600 transition-colors">
                {item.title}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
