import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { News } from '@/types/api.types';

interface NewsCardProps {
  item: News;
  featured?: boolean;
}

function formatCategoryLabel(cat?: string): string {
  if (!cat) return 'Announcements';
  const clean = cat.toLowerCase().replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function NewsCard({ item, featured = false }: NewsCardProps) {
  const [open, setOpen] = useState(false);
  const displayDate = item.published_at || item.created_at;
  const paragraphs = (item.content || '').split('\n\n').filter(Boolean);

  return (
    <article
      className={`flex h-full flex-col ${
        featured
          ? 'border border-border bg-card p-8 md:p-10'
          : 'border-t border-border pt-6'
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        <span className="text-gold-600">{formatCategoryLabel(item.category)}</span>
        <span className="h-1 w-1 rotate-45 bg-gold-500/60" aria-hidden="true" />
        <time dateTime={displayDate}>{formatDate(displayDate)}</time>
      </div>

      <h3
        className={`mt-4 font-display leading-snug text-forest-700 ${
          featured ? 'text-3xl md:text-4xl' : 'text-2xl'
        }`}
      >
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {item.summary || (paragraphs[0] ? paragraphs[0].slice(0, 180) + '...' : '')}
      </p>

      {open && (
        <div className="mt-5 space-y-4 border-l-2 border-gold-500/40 pl-5 text-sm leading-relaxed text-forest-800">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
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
