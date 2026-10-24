import SampleBadge from '@/components/SampleBadge';
import type { CeremonialYearEntry } from '@/data/culture';

interface CeremonialYearProps {
  items: CeremonialYearEntry[];
}

export default function CeremonialYear({ items }: CeremonialYearProps) {
  return (
    <ol className="mt-10 divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <li key={item.title} className="grid gap-4 py-6 md:grid-cols-[80px_1fr] md:items-baseline">
          <span className="font-display text-3xl text-gold-500/50" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-2xl text-forest-700">{item.title}</h3>
              <SampleBadge label="Draft" />
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}