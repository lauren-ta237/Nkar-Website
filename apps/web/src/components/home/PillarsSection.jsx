import SectionHeading from '@/components/SectionHeading';
import PillarCard from '@/components/PillarCard';
import Reveal from '@/components/Reveal';
import { pillars } from '@/data/site';

export default function PillarsSection() {
  return (
    <section className="border-y border-border bg-cream/60 py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          eyebrow="Four pillars"
          title="What Nkar Woo Land holds"
          description="History, culture, traditional leadership and development: the four things this archive exists to keep, and to hand on."
          align="center"
          ornament
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.06}>
              <PillarCard pillar={pillar} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}