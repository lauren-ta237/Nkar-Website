import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SearchBar from '@/components/SearchBar';
import Reveal from '@/components/Reveal';
import { images } from '@/data/images';
import { site } from '@/data/site';
import logo from '@/assets/images/logo.jpg';

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
            Nkar Clan · Northwest Region, Cameroon
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
              About Nkar Woo
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
        </Reveal>

        <Reveal delay={0.15} className="hidden lg:block">
          <div className="relative ml-auto flex h-120 w-full max-w-sm items-center justify-center overflow-hidden border_border-gold-500/30_bg-forest-950/60 p-4 shadow-2xl backdrop-blur-xs">
          {/* <div className="relative ml-auto flex h-120 w-full max-w-sm items-center justify-center overflow-hidden border border-gold-500/30 bg-forest-950/60 p-8 shadow-2xl backdrop-blur-xs"> */}
            {/* <div className="absolute inset-0 pattern-toghu-light opacity-15" aria-hidden="true" /> */}
            <div className="relative aspect-square w-full max-w-70 overflow-hidden rounded-full border-2 border-gold-300 shadow-2xl shadow-forest-950/80">
              <img
                src={logo}
                alt={`${site.name} official emblem`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
