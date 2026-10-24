import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import IconTile from './IconTile';
import type { Pillar } from '@/data/site';

interface PillarCardProps {
  pillar: Pillar;
  index: number;
}

export default function PillarCard({ pillar, index }: PillarCardProps) {
  return (
    <article className="group relative flex h-full flex-col border border-border bg-card p-7 transition-colors hover:border-gold-500/60">
      <span
        className="absolute right-6 top-6 font-display text-4xl text-gold-500/25"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <IconTile name={pillar.icon} />
      <h3 className="mt-6 font-display text-2xl text-forest-700">{pillar.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
      <Link
        to={pillar.to}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.26em] text-forest-600 transition-colors group-hover:text-gold-600"
      >
        {pillar.cta}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}