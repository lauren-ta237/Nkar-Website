import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { images, photoNote } from '@/data/images';
import { contributeWays } from '@/data/site';
import Ornament from './Ornament';
import Reveal from './Reveal';

export default function ContributeBand() {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-ivory">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={images.gathering}
          alt="Illustrative image: an evening gathering in a grassfields village"
          className="h-full w-full"
          fittingType="fill"
          quality={80}
        />
      </div>
      <div className="absolute inset-0 bg-forest-900/88" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-gold-300">
            Nkar sons and daughters, at home and abroad
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            This heritage is kept by all of us — or it is not kept at all.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75">
            A photograph in a drawer, an account an elder has never written down, a book nobody
            has catalogued: every piece that reaches the archive is a piece of Nkar saved for the
            generation after us.
          </p>
          <Ornament className="mt-8 justify-start" />
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-ivory/15 bg-ivory/15 sm:grid-cols-2 lg:grid-cols-3">
          {contributeWays.map((way) => (
            <div key={way.title} className="flex flex-col bg-forest-900/85 p-6">
              <h3 className="font-display text-xl text-gold-200">{way.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{way.text}</p>
              <Link
                to={way.to}
                className="mt-auto inline-flex items-center gap-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-300 transition-colors hover:text-ivory"
              >
                {way.cta}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-ivory/40">{photoNote}</p>
      </div>
    </section>
  );
}