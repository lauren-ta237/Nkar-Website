import SampleBadge from './SampleBadge';
import type { LeadershipRecord } from '@/data/culture';

interface LeadershipRecordProps {
  record: LeadershipRecord;
  index: number;
}

export default function LeadershipRecord({ record, index }: LeadershipRecordProps) {
  return (
    <article className="grid gap-6 border border-border bg-card p-6 md:grid-cols-[150px_1fr] md:p-8">
      <div className="flex min-h-[150px] flex-col items-center justify-center bg-forest-800 p-4 pattern-toghu-light text-center">
        <span className="font-display text-7xl leading-none text-gold-500/40" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="mt-2 text-[9px] uppercase tracking-[0.24em] text-ivory/60">
          Portrait pending
        </span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
            {record.label}
          </p>
          <SampleBadge label="Register entry" />
        </div>

        <h3 className="mt-3 font-display text-2xl text-forest-700">
          Reign record — {record.era}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{record.summary}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {['Name', 'Reign years', 'Notable works'].map((field) => (
            <div key={field} className="border-t border-border pt-3">
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {field}
              </dt>
              <dd className="mt-1 font-display text-lg text-forest-700">To be confirmed</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}