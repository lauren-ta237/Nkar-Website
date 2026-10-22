import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SearchBar from '@/components/SearchBar';
import Reveal from '@/components/Reveal';
import { images, photoNote } from '@/data/images';
import { site } from '@/data/site';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-ivory">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={images.highlands}
          alt="Illustrative image: highland hills of the Cameroon Grassfields"
          className="h-full w-full"
          fittingType="fill"
          quality={85}
        />
      </div>
      <div className="absolute inset-0 scrim-hero" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-gold-300">
            Nkar village · Northwest Region, Cameroon
          </p>

          <h1 className="mt-6 font-display text-5xl leading-[1.03] md:text-6xl lg:text-7xl">
            {site.name}
            <span className="mt-4 block font-light italic text-gold-300 md:text-3xl lg:text-4xl">
              Our Heritage, Our Identity, Our Future.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/80">{site.promise}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-gold-400 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-900 transition-colors hover:bg-gold-300"
            >
              Enter the archive
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/leadership"
              className="inline-flex items-center gap-2 border border-ivory/30 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              Visit the fondom
            </Link>
          </div>

          <div className="mt-10 max-w-xl">
            <SearchBar />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ivory/45">{photoNote}</p>
        </Reveal>

        <Reveal delay={0.15} className="hidden lg:block">
          <div className="relative ml-auto h-[480px] w-full max-w-sm border border-gold-500/30">
            <Image
              src={images.ceremonialCloth}
              alt="Illustrative image: hand-embroidered ceremonial cloth in gold and black"
              className="absolute inset-0 h-full w-full"
              fittingType="fill"
              quality={85}
            />
          </div>
          <p className="mt-4 max-w-sm text-right text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ivory/45">
            Ceremonial cloth — {photoNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}