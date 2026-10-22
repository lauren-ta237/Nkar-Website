import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({
  initialValue = '',
  size = 'large',
  placeholder = 'Search the archive — history, people, projects, books…'
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();
  const large = size === 'large';

  const submit = (event) => {
    event.preventDefault();
    const term = value.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  return (
    <form onSubmit={submit} className="w-full" role="search">
      <label htmlFor={`site-search-${size}`} className="sr-only">
        Search Nkar Woo Land
      </label>
      <div className="flex items-center gap-3 rounded-full border border-gold-500/40 bg-ivory/95 px-4 py-1.5 shadow-sm backdrop-blur">
        <Search className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
        <input
          id={`site-search-${size}`}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-forest-800 outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className={`shrink-0 rounded-full bg-forest-700 font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold-600 ${
            large ? 'px-6 py-2.5 text-[11px]' : 'px-4 py-2 text-[10px]'
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
