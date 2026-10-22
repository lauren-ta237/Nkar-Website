import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { photoNote } from '@/data/images';
import SampleBadge from './SampleBadge';

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (event) => {
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
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close gallery"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-ivory/20 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="mt-4 h-[52vh] w-full md:h-[62vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.image}
          alt={item.title}
          className="h-full w-full"
          fittingType="fit"
          quality={90}
        />
      </div>

      <div
        className="mx-auto mt-5 w-full max-w-3xl text-center text-ivory"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-display text-2xl text-gold-200">{item.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ivory/75">{item.caption}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-ivory/45">{photoNote}</p>
        {item.sample && <SampleBadge className="mt-4 bg-ivory" />}
      </div>
    </div>
  );
}