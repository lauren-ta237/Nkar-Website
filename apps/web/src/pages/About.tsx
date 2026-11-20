import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import ContentNotice from '@/components/ContentNotice';
import Timeline from '@/components/Timeline';
import LoadingState from '@/components/LoadingState';
import AboutSection from '@/components/about/AboutSection';
import TraditionsGrid from '@/components/about/TraditionsGrid';
import { site } from '@/data/site';
import { images } from '@/data/images';
import { aboutLead, traditions as staticTraditions, timeline, aboutSections as staticAboutSections } from '@/data/culture';
import { useHeritageList } from '@/lib/api/heritage.api';

export default function About() {
  const { hash } = useLocation();
  const { data: heritageItems = [], isLoading } = useHeritageList();

  const sections = useMemo(() => {
    if (heritageItems.length > 0) {
      return heritageItems.map((h) => ({
        id: h.slug || h.id,
        eyebrow: h.category ? h.category.replace(/_/g, ' ') : 'Heritage',
        title: h.title,
        image: h.images && h.images.length > 0 ? h.images[0] : null,
        paragraphs: (h.content || '').split('\n\n').filter(Boolean),
      }));
    }
    return staticAboutSections;
  }, [heritageItems]);

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, isLoading]);

  return (
    <>
      <PageHero
        eyebrow="About Nkar"
        title="The Nkar Indigenous Kingdom/Fondom"
        description="The history, origins, royal leadership, and vibrant cultural traditions of the Nkar Fondom."
        image={images.highlands}
        imageAlt="Nkar Kingdom/Fondom landscape in the Cameroon Grassfields"
      />

      <section className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <ContentNotice>{site.contentPolicy}</ContentNotice>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 text-base leading-relaxed text-forest-800/90">
              {aboutLead.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <aside className="h-fit border border-border bg-cream/60 p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600">
                On this page
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-forest-700 transition-colors hover:text-gold-600 capitalize"
                    >
                      {section.eyebrow}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#traditions"
                    className="text-forest-700 transition-colors hover:text-gold-600"
                  >
                    Culture &amp; traditions
                  </a>
                </li>
                <li>
                  <a
                    href="#timeline"
                    className="text-forest-700 transition-colors hover:text-gold-600"
                  >
                    Timeline of Nkar
                  </a>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="py-20 text-center">
          <LoadingState label="Loading heritage archives…" />
        </div>
      ) : (
        sections.map((section, index) => (
          <AboutSection
            key={section.id}
            section={section}
            flipped={index % 2 === 1}
            dark={index % 2 === 1}
          />
        ))
      )}

      <section id="traditions" className="bg-ivory py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Culture & customs"
            title="Traditions that hold Nkar together"
            description="The rites, celebrations and customary laws handed down across generations and observed in the village today."
          />
          <div className="mt-12">
            <TraditionsGrid traditions={staticTraditions} />
          </div>
        </div>
      </section>

      <section id="timeline" className="border-t border-border bg-cream/60 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Chronology"
            title="A timeline of Nkar"
            description="From the founding lineages to the digital heritage archive: key periods in the story of the village."
          />
          <div className="mt-12">
            <Timeline entries={timeline} />
          </div>

          <div className="mt-16 border-t border-border pt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Have a historical document, photograph or lineage account to contribute to this archive?
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-forest-700 transition-colors hover:text-gold-700"
            >
              Write to the custodians
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
