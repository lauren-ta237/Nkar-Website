import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
            {section.paragraphs.map((rawParagraph) => {
              const paragraph = rawParagraph.replace(/^Settlement and administration\s*\n+/i, '');
              const lines = paragraph.split('\n');
              const hasSubheading = lines.length > 1 && lines[0].trim().length < 60;
              if (hasSubheading) {
                const [subheading, ...rest] = lines;
                return (
                  <div key={paragraph.slice(0, 24)}>
                    <h3 className="mb-1.5 text-sm font-bold tracking-wide text-forest-900">
                      {subheading.trim()}
                    </h3>
                    <p>{rest.join(' ').trim()}</p>
                  </div>
                );
              }
              return <p key={paragraph.slice(0, 24)}>{paragraph}</p>;
            })}
          </div>

          <div className="mt-6">
            <Link
              to={`/heritage/${section.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-gold-600 hover:text-forest-700 transition-colors"
            >
              Explore Archive Record
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {section.pending && (
            <ContentNotice className="mt-8" tone="cream" title="Draft: Pending Verification">
              {section.pending}
            </ContentNotice>
          )}
        </Reveal>

        <Reveal delay={0.1} className={flipped ? 'lg:order-1' : ''}>
          {section.image ? (
            <figure className="group rounded-sm border border-gold-500/25 bg-cream/60 p-2.5 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-forest-950/5">
                <Image
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  fittingType="fill"
                  quality={85}
                />
              </div>
              <figcaption className="mt-2.5 px-1 text-[11px] tracking-wide text-muted-foreground">
                {section.imageAlt || section.title}
              </figcaption>
            </figure>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-sm border border-gold-500/30 bg-forest-900 p-8 text-center text-ivory pattern-toghu">
              <span className="font-display text-2xl text-gold-300">NKAR WOO LÀN</span>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ivory/70">
                Indigenous Kingdom &amp; Fondom
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}