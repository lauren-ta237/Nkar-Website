import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import PillarsSection from '@/components/home/PillarsSection';
import PatternStrip from '@/components/home/PatternStrip';
import NewsEventsSection from '@/components/home/NewsEventsSection';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import QuickFacts from '@/components/QuickFacts';
import ContributeBand from '@/components/ContributeBand';

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="bg-forest-900/5 py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-600">
            Nkar at a glance
          </p>
          <div className="mt-7">
            <QuickFacts />
          </div>
        </div>
      </section>

      <IntroSection />
      <PillarsSection />
      <PatternStrip />
      <NewsEventsSection />
      <GalleryTeaser />
      <ProjectsPreview />
      <ContributeBand />
    </>
  );
}