import { quickFacts } from '@/data/site';
import SampleBadge from './SampleBadge';

export default function QuickFacts() {
  return (
    <dl className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {quickFacts.map((fact) => (
        <div key={fact.label} className="bg-ivory p-6">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            {fact.label}
          </dt>
          <dd className="mt-3 text-sm leading-relaxed text-forest-800">{fact.value}</dd>
          {fact.draft && <SampleBadge className="mt-4" label="To be verified" />}
        </div>
      ))}
    </dl>
  );
}