import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';
import FilterChips from '@/components/FilterChips';
import LoadingState from '@/components/LoadingState';
import { usePublicSearch } from '@/lib/api/search.api';
import type { FormEvent } from 'react';

const SEARCH_TYPES = [
  'All',
  'News',
  'Event',
  'Heritage',
  'Leadership',
  'Project',
  'Publication',
  'Gallery'
];

const typeStyles: Record<string, string> = {
  News: 'border-gold-500 bg-gold-100 text-gold-700',
  Event: 'border-clay-500 bg-clay-100 text-clay-700',
  Heritage: 'border-forest-600 bg-forest-700 text-ivory',
  Leadership: 'border-gold-500 bg-forest-900 text-gold-300',
  Project: 'border-border bg-cream text-forest-700',
  Publication: 'border-border bg-ivory text-forest-700',
  Gallery: 'border-gold-500 bg-ivory text-gold-700'
};

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const [type, setType] = useState('All');

  useEffect(() => {
    setTerm(params.get('q') || '');
  }, [params]);

  const activeQuery = params.get('q') || '';
  const { data: results = [], isLoading } = usePublicSearch(activeQuery, type);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = term.trim();
    setParams(next ? { q: next } : {});
  };

  return (
    <>
      <section className="relative overflow-hidden bg-forest-900 text-ivory">
        <div className="absolute inset-0 pattern-toghu-light opacity-40" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-gold-300">
            Search the archive
          </p>
          <h1 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            Find anything published about Nkar
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/75">
            Search across news, events, development projects, publications, photographs, and the pages of this community archive.
          </p>

          <form onSubmit={submit} role="search" className="mt-9">
            <label htmlFor="archive-search" className="sr-only">
              Search NKAR WOO LÀN
            </label>
            <div className="flex items-center gap-3 border border-gold-500/40 bg-ivory p-2 pl-5">
              <SearchIcon className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
              <input
                id="archive-search"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="History, leadership, water project, proverbs…"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-forest-800 outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="shrink-0 bg-forest-700 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold-600"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-ivory py-14 md:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <FilterChips
              options={SEARCH_TYPES}
              value={type}
              onChange={setType}
              label="Filter search results by type"
            />
            {activeQuery && !isLoading && (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>

          <div className="mt-10">
            {isLoading ? (
              <LoadingState label="Searching the live database…" />
            ) : !activeQuery ? (
              <div className="border border-dashed border-border p-12 text-center">
                <p className="font-display text-2xl text-forest-700">Type a keyword to begin</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Search by village quarter, clan, traditional institution, event date or keyword.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="border border-border bg-card p-12 text-center">
                <p className="font-display text-2xl text-forest-700">No results found</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nothing matching “{activeQuery}” was found in the archive. Try another spelling or contact the palace custodians.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border border-y border-border">
                {results.map((item) => (
                  <li key={item.id} className="py-6">
                    <Link
                      to={item.url}
                      className="group flex items-start justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                              typeStyles[item.type] || 'border-border bg-card text-forest-700'
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.category && (
                            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl text-forest-700 transition-colors group-hover:text-gold-600">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
