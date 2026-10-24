import SampleBadge from './SampleBadge';
import type { TimelineEntry } from '@/data/culture';

interface TimelineProps {
  items: TimelineEntry[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <ol className="relative border-l border-gold-500/40 pl-8">
      {items.map((item) => (
        <li key={item.title} className="relative pb-10 last:pb-0">
          <span
            className="absolute -left-[38px] top-2 h-3 w-3 rotate-45 border border-gold-500 bg-ivory"
            aria-hidden="true"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            {item.period}
          </p>
          <h3 className="mt-3 font-display text-2xl text-forest-700">{item.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {item.text}
          </p>
          {String(item.period).toLowerCase().includes('verify') && (
            <SampleBadge className="mt-4" label="Awaiting verification" />
          )}
        </li>
      ))}
    </ol>
  );
}