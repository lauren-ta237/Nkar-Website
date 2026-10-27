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
            <ContentNotice className="mt-8" tone="cream" title="Draft — pending verification">
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
            <div className="flex min-h-[220px] items-center justify-center border border-gold-500/30 bg-cream/70 p-8 pattern-toghu text-center">
              <p className="max-w-xs text-sm leading-relaxed text-forest-700">
                Photographs of Nkar will be placed here once the community supplies them.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}