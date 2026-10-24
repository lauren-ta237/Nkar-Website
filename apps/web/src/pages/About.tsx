import { useEffect } from 'react';
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
import { aboutLead } from '@/data/culture';
import { useAboutContent } from '@/hooks/useContent';

export default function About() {
  const { hash } = useLocation();
  const { data, isLoading } = useAboutContent();
  const sections = data?.aboutSections || [];
  const traditions = data?.traditions || [];
  const timeline = data?.timeline || [];

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, isLoading]);

  return (
    <>
      <PageHero
        eyebrow="About Nkar"
        title="A village, its people and its customs"
        description="The history, origins, culture and traditions of Nkar, gathered by the community that holds them."
        note="Draft content is labelled — verified history is published only after confirmation."
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
                      className="text-forest-700 transition-colors hover:text-gold-600"
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
        <LoadingState label="Gathering the record…" />
      ) : (
        sections.map((section, index) => (
          <AboutSection key={section.id} section={section} index={index} />
        ))
      )}

      <section
        id="traditions"
        className="scroll-mt-28 border-t border-border bg-cream/60 py-16 md:py-20"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Culture & traditions"
            title="What a Nkar life is made of"
            description="The customs kept across the Grassfields — cloth and ceremony, drums and dance, craft and hospitality — written here in general terms."
          />
          {isLoading ? <LoadingState /> : <TraditionsGrid traditions={traditions} />}

          <ContentNotice className="mt-10" tone="cream" title="To be confirmed for Nkar">
            Each custom is described in general terms. The Nkar-specific detail — names, songs,
            dates, dress, prohibitions and the families who hold them — will be added with the
            elders, the palace and the traditional council.
          </ContentNotice>
        </div>
      </section>

      <section
        id="timeline"
        className="scroll-mt-28 border-t border-border bg-ivory py-16 md:py-20"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <SectionHeading
            eyebrow="Timeline"
            title="A timeline still to be written"
            description="Nkar’s story will be dated here milestone by milestone. The frame is ready; the verified dates and names will fill it."
          />
          {isLoading ? <LoadingState /> : <Timeline items={timeline} />}

          <div className="mt-12 border border-gold-500/40 bg-gold-50/70 p-8">
            <p className="font-display text-2xl text-forest-700">Do you hold a piece of it?</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-800">
              A photograph, a place name, a date, an account your elders told you — send it and the
              custodians will record it properly, with the family’s permission.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600"
            >
              Share what you hold
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}