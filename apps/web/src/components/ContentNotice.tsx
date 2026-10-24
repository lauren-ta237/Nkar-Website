import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

const tones: Record<string, string> = {
  gold: 'border-gold-500/35 bg-gold-50/70',
  cream: 'border-border bg-cream'
};

interface ContentNoticeProps {
  title?: string;
  children: ReactNode;
  tone?: string;
  className?: string;
}

export default function ContentNotice({
  title = 'Content status',
  children,
  tone = 'gold',
  className = ''
}: ContentNoticeProps) {
  return (
    <div className={`rounded-sm border p-5 md:p-6 ${tones[tone]} ${className}`}>
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-700">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {title}
      </p>
      <div className="mt-3 text-sm leading-relaxed text-forest-800">{children}</div>
    </div>
  );
}