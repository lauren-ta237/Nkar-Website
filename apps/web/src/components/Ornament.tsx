/** Grassfields-inspired divider: a gold hairline split by stacked diamonds. */
export default function Ornament({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-500/70" />
      <span className="h-2 w-2 rotate-45 border border-gold-500/70" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold-500/80" />
      <span className="h-2 w-2 rotate-45 border border-gold-500/70" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-500/70" />
    </div>
  );
}