import { Image } from '@/components/ui/image';
import ContentNotice from '@/components/ContentNotice';
import Reveal from '@/components/Reveal';
import type { AboutSection } from '@/data/culture';

interface AboutSectionProps {
  section: AboutSection;
  index: number;
}

export default function AboutSection({ section, index }: AboutSectionProps) {
  const flipped = index % 2 === 1;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 border-t border-border bg-ivory py-16 md:py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-start">
        <Reveal className={flipped ? 'lg:order-2' : ''}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-600">
            {section.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl text-forest-700 md:text-4xl">
            {section.title}
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-forest-800/90">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          {section.pending && (
            <ContentNotice className="mt-8" tone="cream" title="Draft: Pending Verification">
              {section.pending}
            </ContentNotice>
          )}
        </Reveal>

        <Reveal delay={0.1} className={flipped ? 'lg:order-1' : ''}>
          {section.image ? (
            <>
              <div className="relative aspect-[4/3] overflow-hidden border border-border">
                <Image
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  className="absolute inset-0 h-full w-full"
                  fittingType="fill"
                  quality={80}
                />
              </div>
            </>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center border border-gold-500/30 bg-forest-900 p-8 text-center text-ivory pattern-toghu">
              <span className="font-display text-2xl text-gold-300">NKAR WOO LÀN</span>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/70">
                Indigenous Kingdom & Fondom
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}