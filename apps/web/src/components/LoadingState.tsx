import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Gathering the record…', className = '' }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 py-20 text-center ${className}`}
    >
      <Loader2 className="h-5 w-5 animate-spin text-gold-600" aria-hidden="true" />
      <p className="text-[11px] uppercase tracking-[0.3em] text-forest-600">{label}</p>
    </div>
  );
}