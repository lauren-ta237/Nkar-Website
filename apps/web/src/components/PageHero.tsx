import { Image } from '@/components/ui/image';
import Reveal from './Reveal';
import type { ReactNode } from 'react';

/** Interior page banner: forest ground, photograph, gold eyebrow. */
interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  note?: string;
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = '',
  note,
  children
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-ivory">
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={image}
            alt={imageAlt}
            className="h-full w-full"
            fittingType="fill"
            quality={80}
          />
        </div>
      )}
      <div className="absolute inset-0 scrim-hero" aria-hidden="true" />
      <div
        className="absolute inset-y-0 right-0 hidden w-1/3 pattern-toghu-light opacity-40 lg:block"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-gold-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.06] md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75">
              {description}
            </p>
          )}
          {note && (
            <p className="mt-6 max-w-2xl text-[11px] uppercase tracking-[0.24em] text-gold-200/80">
              {note}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}