import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/format';
import SampleBadge from './SampleBadge';

export default function NewsCard({ item, featured = false }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`flex h-full flex-col ${
        featured
          ? 'border border-border bg-card p-8 md:p-10'
          : 'border-t border-border pt-6'
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        <span className="text-gold-600">{item.category}</span>
        <span className="h-1 w-1 rotate-45 bg-gold-500/60" aria-hidden="true" />
        <time dateTime={item.date}>{formatDate(item.date)}</time>
        {item.sample && <SampleBadge />}
      </div>

      <h3
        className={`mt-4 font-display leading-snug text-forest-700 ${
          featured ? 'text-3xl md:text-4xl' : 'text-2xl'
        }`}
      >
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>

      {open && (
        <div className="mt-5 space-y-4 border-l-2 border-gold-500/40 pl-5 text-sm leading-relaxed text-forest-800">
          {item.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-forest-600 transition-colors hover:text-gold-600"
        >
          {open ? 'Close' : 'Read more'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}