import { Image } from '@/components/ui/image';
import { images } from '@/data/images';
import type { LeadershipRecord } from '@/data/culture';

interface LeadershipRecordProps {
  record: LeadershipRecord;
  index: number;
}

export default function LeadershipRecord({ record, index }: LeadershipRecordProps) {
  const portrait = record.image || images.fonSit;
  const altText = record.imageAlt || `${record.name} of Nkar`;

  return (
    <article className="grid gap-6 border border-border bg-card p-6 md:grid-cols-[180px_1fr] md:p-8 md:items-center">
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-gold-500/30 bg-forest-900 shadow-md">
        <Image
          src={portrait}
          alt={altText}
          className="h-full w-full object-cover"
          fittingType="fill"
          quality={85}
        />
        <div className="absolute bottom-2 left-2 bg-forest-950/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-300">
          Reign #{String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-600">
          Traditional Ruler of Nkar
        </p>

        <h3 className="font-display text-3xl text-forest-700">
          {record.name}
        </h3>

        <div className="inline-flex items-center gap-2 border-y border-gold-500/20 py-2 text-xs font-medium uppercase tracking-[0.2em] text-forest-800">
          <span className="text-muted-foreground">Period of Rule:</span>
          <span className="font-semibold text-gold-700">{record.era}</span>
        </div>

        {record.summary && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {record.summary}
          </p>
        )}
      </div>
    </article>
  );
}
