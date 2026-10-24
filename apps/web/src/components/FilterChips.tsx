interface FilterChipsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function FilterChips({ options, value, onChange, label = 'Filter' }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
              active
                ? 'border-forest-700 bg-forest-700 text-ivory'
                : 'border-border bg-ivory text-forest-700 hover:border-gold-500 hover:text-gold-600'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}