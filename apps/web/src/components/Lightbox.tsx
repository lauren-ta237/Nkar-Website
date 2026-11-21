import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { isVideoGalleryItem, normalizeMediaUrl } from '@/components/GalleryGrid';
import type { Gallery } from '@/types/api.types';

interface LightboxProps {
  items: Gallery[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  const item = items[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  if (!item) return null;

  const isVideo = isVideoGalleryItem(item);
  const mediaSrc = normalizeMediaUrl(item.media_url);
  const posterSrc = item.thumbnail_url ? normalizeMediaUrl(item.thumbnail_url) : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col bg-forest-900/95 p-5 backdrop-blur md:p-8"
    >
      <div className="flex items-center justify-between gap-4 text-ivory">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-300">
          {index + 1} / {items.length} · {item.category}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous item"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold-500 hover:text-gold-300"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next item"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold-500 hover:text-gold-300"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold-500 hover:text-gold-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="relative my-auto flex max-h-[75vh] w-full items-center justify-center py-4"
        onClick={(event) => event.stopPropagation()}
      >
        {isVideo ? (
          <div className="relative flex max-h-[70vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-sm border border-gold-500/30 bg-black">
            <video
              key={mediaSrc}
              src={mediaSrc}
              poster={posterSrc}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[70vh] w-full bg-black object-contain"
            />
          </div>
        ) : (
          <div className="relative max-h-[70vh] max-w-4xl overflow-hidden rounded-sm border border-border bg-black">
            <Image
              src={mediaSrc}
              alt={item.alt_text || item.title}
              className="max-h-[70vh] w-auto object-contain"
              fittingType="fill"
              quality={90}
            />
          </div>
        )}
      </div>

      <div
        className="mx-auto w-full max-w-2xl text-center text-ivory"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl text-ivory md:text-2xl">{item.title}</h3>
        <p className="mt-2 text-sm text-ivory/70">{item.description || item.alt_text}</p>
      </div>
    </div>
  );
}
