import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Newspaper, Calendar, Landmark, Crown, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { useAdminGlobalSearch } from '@/lib/api/dashboard.api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { searchModalOpen, setSearchModalOpen } = useAdminStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Command+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  const { data: results = [], isLoading } = useAdminGlobalSearch(query, {
    enabled: searchModalOpen && query.trim().length > 0,
    limit: 25,
  });

  const q = query.trim();

  const filteredNews = results.filter((r) => r.type === 'news');
  const filteredEvents = results.filter((r) => r.type === 'events');
  const filteredHeritage = results.filter((r) => r.type === 'heritage');
  const filteredLeadership = results.filter((r) => r.type === 'leadership');
  const filteredProjects = results.filter((r) => r.type === 'projects');

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchModalOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 gap-0 overflow-hidden bg-white dark:bg-stone-900 border border-[#E5E0D5] dark:border-stone-800 rounded-2xl shadow-2xl text-stone-900 dark:text-stone-100">
        <DialogTitle className="sr-only">Search Nkar Woo Làn Records</DialogTitle>
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8E4DA] dark:border-stone-800 flex items-center gap-3 bg-[#FAF8F5] dark:bg-stone-950">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Type to search across heritage archives, articles, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-0 focus:outline-none text-stone-800 dark:text-stone-100 placeholder-stone-400"
            autoFocus
          />
          {isLoading && <Loader2 className="w-4 h-4 text-stone-400 animate-spin shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto max-h-[60vh] space-y-4">
          {!q ? (
            <div className="py-8 text-center text-stone-400 dark:text-stone-500 text-xs">
              <p>Type keywords to search Nkar Woo Làn database records.</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded text-[11px] text-stone-600 dark:text-stone-300">Water project</span>
                <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded text-[11px] text-stone-600 dark:text-stone-300">Fon of Nkar</span>
                <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded text-[11px] text-stone-600 dark:text-stone-300">Ngon Nkar Festival</span>
              </div>
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="py-10 text-center text-stone-400 dark:text-stone-500 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNews.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-1.5">
                    News & Announcements ({filteredNews.length})
                  </p>
                  <div className="space-y-1">
                    {filteredNews.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelect(`/news/${n.id}/edit`)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-stone-800/60 flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Newspaper className="w-4 h-4 text-[#153E2E] dark:text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">{n.title}</span>
                            {n.subtitle && <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">{n.subtitle}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-1.5">
                    Events ({filteredEvents.length})
                  </p>
                  <div className="space-y-1">
                    {filteredEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect(`/events/${e.id}/edit`)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-stone-800/60 flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">{e.title}</span>
                            {e.subtitle && <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">{e.subtitle}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredHeritage.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-1.5">
                    Heritage Records ({filteredHeritage.length})
                  </p>
                  <div className="space-y-1">
                    {filteredHeritage.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => handleSelect(`/heritage/${h.id}/edit`)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-stone-800/60 flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Landmark className="w-4 h-4 text-[#153E2E] dark:text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">{h.title}</span>
                            {h.subtitle && <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">{h.subtitle}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLeadership.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-1.5">
                    Traditional Leadership ({filteredLeadership.length})
                  </p>
                  <div className="space-y-1">
                    {filteredLeadership.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleSelect('/leadership')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-stone-800/60 flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">{l.title}</span>
                            {l.subtitle && <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">{l.subtitle}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider px-2 mb-1.5">
                    Development Projects ({filteredProjects.length})
                  </p>
                  <div className="space-y-1">
                    {filteredProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(`/projects/${p.id}/edit`)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-stone-800/60 flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Briefcase className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">{p.title}</span>
                            {p.subtitle && <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">{p.subtitle}</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
