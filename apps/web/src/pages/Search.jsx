import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';
import FilterChips from '@/components/FilterChips';
import LoadingState from '@/components/LoadingState';
import { searchContent, searchTypes, useSearchIndex } from '@/hooks/useContent';

const typeStyles = {
  Page: 'border-forest-600 bg-forest-700 text-ivory',
  News: 'border-gold-500 bg-gold-100 text-gold-700',
  Event: 'border-clay-500 bg-clay-100 text-clay-700',
  Project: 'border-border bg-cream text-forest-700',
  Publication: 'border-border bg-ivory text-forest-700',
  Gallery: 'border-gold-500 bg-ivory text-gold-700'
};

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const [type, setType] = useState('All');
  const indexQuery = useSearchIndex();

  useEffect(() => {
    setTerm(params.get('q') || '');
  }, [params]);

  const results = useMemo(
    () => searchContent(indexQuery.data || [], term, type),
    [indexQuery.data, term, type]
  );

  const submit = (event) => {
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
            News, events, projects, publications, photographs and the pages of this site — search
            them all at once, or filter by what you are looking for.
          </p>

          <form onSubmit={submit} role="search" className="mt-9">
            <label htmlFor="archive-search" className="sr-only">
              Search Nkar Woo Land
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
              options={searchTypes}
              value={type}
              onChange={setType}
              label="Filter results by type"
            />
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {term.trim() ? ` for “${term.trim()}”` : ''}
            </p>
          </div>

          {indexQuery.isLoading ? (
            <LoadingState label="Searching the archive…" />
          ) : results.length === 0 ? (
            <div className="mt-12 border border-gold-500/40 bg-gold-50/70 p-8 text-center">
              <p className="font-display text-2xl text-forest-700">
                Nothing found for “{term.trim()}”.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-forest-800">
                Try another word — a quarter, a family name, a project or a ceremony. If what you
                are looking for is not here yet, it may not have been published: write to the
                custodians and they will help you find it.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 bg-forest-700 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-gold-600"
              >
                Ask the custodians
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="mt-10 space-y-4">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="group flex flex-col gap-4 border border-border bg-card p-6 transition-colors hover:border-gold-500/60 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] ${
                            typeStyles[item.type] || typeStyles.Page
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.meta && (
                          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                            {item.meta}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 font-display text-2xl leading-snug text-forest-700">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-forest-600 transition-colors group-hover:text-gold-600">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}