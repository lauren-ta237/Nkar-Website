import type { LeadershipRecord } from '@/data/culture';
import { Image } from '@/components/ui/image';

interface LeadershipRecordProps {
  record: LeadershipRecord;
  index: number;
}

export default function LeadershipRecord({ record, index }: LeadershipRecordProps) {
  return (
    <article className="grid gap-6 border border-border bg-card p-6 md:grid-cols-[150px_1fr] md:p-8">
      <div className="relative flex min-h-[150px] overflow-hidden bg-forest-800 text-center">
        {record.image ? (
          <Image
            src={record.image}
            alt={record.label}
            className={`absolute inset-0 h-full w-full object-cover ${
              record.id === 'record-24' ? 'object-top' : 'object-center'
            }`}
            fittingType="fill"
            quality={80}
          />
        ) : (
          <div className="flex w-full flex-col items-center justify-center p-4 pattern-toghu-light">
            <span className="font-display text-7xl leading-none text-gold-500/40" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[9px] uppercase tracking-[0.24em] text-ivory/60">
              Portrait pending
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
          Reign Record
        </p>

        <h3 className="mt-3 font-display text-2xl text-forest-700">
          {record.label}
        </h3>
        
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-600">
          Reign Era: {record.era}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{record.summary}</p>
      </div>
    </article>
  );
}