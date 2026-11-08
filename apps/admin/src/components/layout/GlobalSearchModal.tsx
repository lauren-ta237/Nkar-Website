import React, { useState, useEffect } from 'react';
import { Search, X, Newspaper, Calendar, Landmark, Crown, Briefcase, ChevronRight } from 'lucide-react';
import { useAdminStore, AdminPage } from '../../store/useAdminStore';
import {
  useNewsList,
  useEventsList,
  useHeritageList,
  useLeadershipList,
  useProjectsList,
} from '../../api/queries';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export const GlobalSearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, setCurrentPage } = useAdminStore();
  const [query, setQuery] = useState('');

  const { data: news = [] } = useNewsList();
  const { data: events = [] } = useEventsList();
  const { data: heritage = [] } = useHeritageList();
  const { data: leadership = [] } = useLeadershipList();
  const { data: projects = [] } = useProjectsList();

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

  const q = query.trim().toLowerCase();

  const filteredNews = q ? news.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)) : [];
  const filteredEvents = q ? events.filter((e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)) : [];
  const filteredHeritage = q ? heritage.filter((h) => h.title.toLowerCase().includes(q) || h.summary.toLowerCase().includes(q)) : [];
  const filteredLeadership = q ? leadership.filter((l) => l.name.toLowerCase().includes(q) || l.traditionalTitle.toLowerCase().includes(q)) : [];
  const filteredProjects = q ? projects.filter((p) => p.projectName.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)) : [];

  const totalResults =
    filteredNews.length +
    filteredEvents.length +
    filteredHeritage.length +
    filteredLeadership.length +
    filteredProjects.length;

  const handleSelect = (page: AdminPage) => {
    setCurrentPage(page);
    setSearchModalOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 gap-0 overflow-hidden bg-white border border-[#E5E0D5] rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">Search Nkar Woo Làn Records</DialogTitle>
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8E4DA] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Type to search across heritage archives, articles, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-0 focus:outline-none text-stone-800 placeholder-stone-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-white border border-stone-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-stone-400 text-xs">
              <p>Type keywords to search Nkar Woo Làn database records.</p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-1 bg-stone-100 rounded text-[11px] text-stone-600">Water project</span>
                <span className="px-2 py-1 bg-stone-100 rounded text-[11px] text-stone-600">Fon of Nkar</span>
                <span className="px-2 py-1 bg-stone-100 rounded text-[11px] text-stone-600">Ngon Nkar Festival</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-stone-400 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNews.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider px-2 mb-1.5">
                    News & Announcements ({filteredNews.length})
                  </p>
                  <div className="space-y-1">
                    {filteredNews.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelect('news')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Newspaper className="w-4 h-4 text-[#153E2E] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 block truncate">{n.title}</span>
                            <span className="text-[11px] text-stone-500 truncate block">{n.category} · {n.status}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider px-2 mb-1.5">
                    Events ({filteredEvents.length})
                  </p>
                  <div className="space-y-1">
                    {filteredEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect('events')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 block truncate">{e.title}</span>
                            <span className="text-[11px] text-stone-500 truncate block">{e.eventDate} · {e.location}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredHeritage.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider px-2 mb-1.5">
                    Heritage Records ({filteredHeritage.length})
                  </p>
                  <div className="space-y-1">
                    {filteredHeritage.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => handleSelect('heritage')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Landmark className="w-4 h-4 text-[#153E2E] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 block truncate">{h.title}</span>
                            <span className="text-[11px] text-stone-500 truncate block">{h.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLeadership.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider px-2 mb-1.5">
                    Traditional Leadership ({filteredLeadership.length})
                  </p>
                  <div className="space-y-1">
                    {filteredLeadership.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleSelect('leadership')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 block truncate">{l.name}</span>
                            <span className="text-[11px] text-stone-500 truncate block">{l.traditionalTitle}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider px-2 mb-1.5">
                    Development Projects ({filteredProjects.length})
                  </p>
                  <div className="space-y-1">
                    {filteredProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('projects')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-[#FAF8F5] flex items-center justify-between text-xs group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Briefcase className="w-4 h-4 text-stone-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-stone-800 block truncate">{p.projectName}</span>
                            <span className="text-[11px] text-stone-500 truncate block">{p.location} · {p.progressPercentage}% complete</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 shrink-0" />
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
