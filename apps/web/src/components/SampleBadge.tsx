import { Info } from 'lucide-react';

/** Marks content that is illustrative rather than verified Nkar heritage. */
export default function SampleBadge({ label = 'Sample', className = '' }) {
  return (
    <span
      title="Illustrative placeholder — not yet verified for Nkar"
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700 ${className}`}
    >
      <Info className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}