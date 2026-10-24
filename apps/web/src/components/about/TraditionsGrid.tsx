import IconTile from '@/components/IconTile';
import SampleBadge from '@/components/SampleBadge';
import Reveal from '@/components/Reveal';
import type { Tradition } from '@/data/culture';

interface TraditionsGridProps {
  traditions: Tradition[];
}

export default function TraditionsGrid({ traditions }: TraditionsGridProps) {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {traditions.map((tradition, index) => (
        <Reveal key={tradition.title} delay={index * 0.05}>
          <article className="flex h-full flex-col border border-border bg-card p-7">
            <IconTile name={tradition.icon} />
            <h3 className="mt-5 font-display text-2xl text-forest-700">{tradition.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tradition.text}</p>
            <SampleBadge className="mt-5 self-start" label="Regional context" />
          </article>
        </Reveal>
      ))}
    </div>
  );
}