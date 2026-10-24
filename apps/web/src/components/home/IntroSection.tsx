import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { images, photoNote } from '@/data/images';
import { aboutLead } from '@/data/culture';

export default function IntroSection() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative aspect-[3/2] overflow-hidden border border-border">
            <Image
              src={images.villagePath}
              alt="Illustrative image: a footpath through farmland in the Cameroon highlands"
              className="absolute inset-0 h-full w-full"
              fittingType="fill"
              quality={80}
            />
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {photoNote}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <SectionHeading
            eyebrow="Welcome to Nkar"
            title="A village in the Grassfields, kept by its own people"
            ornament
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-forest-800/90">
            {aboutLead.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors hover:text-gold-600"
          >
            Read about Nkar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}