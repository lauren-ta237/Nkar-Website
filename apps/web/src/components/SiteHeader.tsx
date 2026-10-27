import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import FacebookIcon from './FacebookIcon';
import logo from '@/assets/images/logo.jpg';
import { navLinks, site } from '@/data/site';
import SearchBar from './SearchBar';
import HeritageBorder from './HeritageBorder';
import type { FormEvent } from 'react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setSearchOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = query.trim();
    setSearchOpen(false);
    setQuery('');
    if (next) navigate(`/search?q=${encodeURIComponent(next)}`);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-forest-900 text-ivory md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2 text-[10px] uppercase tracking-[0.24em]">
          <p className="text-ivory/70">{site.location}</p>
          <div className="flex items-center gap-6">
            <Link to="/news" className="text-ivory/70 transition-colors hover:text-gold-300">
              Meetings & events
            </Link>
            <a
              href={site.contact.facebookUrl}
              target="_blank"
              rel="noreferrer"
              title={site.contact.facebookNote}
              className="inline-flex items-center gap-2 text-ivory/70 transition-colors hover:text-gold-300"
            >
              <FacebookIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="bg-forest-800">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 lg:gap-6 lg:px-6 justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-300 shadow-inner">
              <img
                src={logo}
                alt={`${site.name} logo`}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl sm:text-2xl text-ivory">
                {site.name}
              </span>
              <span className="hidden mt-2 sm:block text-[9px] uppercase tracking-[0.34em] text-gold-300 dt:hidden lg:block">
                Heritage • Identity • Future
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden flex-1 justify-center dt:flex">
            <ul className="flex items-center gap-x-4 lg:gap-x-5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `whitespace-nowrap border-b pb-1 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-gold-300 text-gold-300'
                          : 'border-transparent text-ivory/85 hover:border-gold-300/60 hover:text-gold-200'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 dt:ml-auto">
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label={`Search ${site.name}`}
              aria-expanded={searchOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-300 text-gold-300 transition-colors hover:bg-gold-300 hover:text-forest-800"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-300/60 text-ivory dt:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.form
              onSubmit={onSearchSubmit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-ivory/10"
            >
              <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4">
                <Search className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search the archive — history, leadership, projects…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/40"
                />
                <button
                  type="submit"
                  className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300 transition-colors hover:text-gold-200"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ivory/70 transition-colors hover:text-ivory"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* <HeritageBorder variant="boxes" /> */}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 bg-forest-900 text-ivory dt:hidden"
          >
            <div className="absolute inset-0 pattern-toghu-light opacity-40" aria-hidden="true" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-4">
                <span className="font-display text-xl text-gold-300">{site.name}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-ivory/20"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <nav aria-label="Mobile">
                  <ul>
                    {navLinks.map((link, index) => (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          end={link.to === '/'}
                          className={({ isActive }) =>
                            `flex items-baseline justify-between border-b border-ivory/10 py-4 font-display text-2xl transition-colors ${
                              isActive ? 'text-gold-300' : 'text-ivory/90'
                            }`
                          }
                        >
                          <span>{link.label}</span>
                          <span className="text-[10px] tracking-[0.3em] text-ivory/40">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-8 space-y-6">
                  <SearchBar size="compact" placeholder="Search the archive…" />
                  <a
                    href={site.contact.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-ivory/70"
                  >
                    <FacebookIcon className="h-4 w-4" aria-hidden="true" />
                    NKAR WOO LAN on Facebook
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}