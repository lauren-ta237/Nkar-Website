import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { images } from '@/data/images';
import { aboutLead } from '@/data/culture';

export default function IntroSection() {
  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative aspect-[3/2] overflow-hidden border border-border">
            <Image
              src={images.villagePath}
              alt="Authentic landscape: Nkar Kingdom/Fondom in the Cameroon Grassfields"
              className="absolute inset-0 h-full w-full"
              fittingType="fill"
              quality={80}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SectionHeading
            eyebrow="Welcome to Nkar"
            title="An indigenous Kingdom in the Grassfields, kept by its own people"
            ornament
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-forest-800/90">
            {aboutLead.map((paragraph) => {
              const isLocation = paragraph.startsWith('The indigenous Fondom of Nkar is located');
              return (
                <div key={paragraph.slice(0, 24)}>
                  {isLocation && (
                    <h3 className="mb-1.5 text-sm font-bold tracking-wide text-forest-900">
                      Location
                    </h3>
                  )}
                  <p>{paragraph}</p>
                </div>
              );
            })}
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