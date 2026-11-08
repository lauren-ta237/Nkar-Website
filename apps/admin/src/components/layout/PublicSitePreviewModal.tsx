import React, { useState } from 'react';
import {
  X,
  Globe,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Calendar,
  Newspaper,
  Landmark,
  Crown,
  MapPin,
  ChevronRight,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const PublicSitePreviewModal: React.FC = () => {
  const { publicPreviewOpen, setPublicPreviewOpen } = useAdminStore();
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const { data: news = [] } = useNewsList();
  const { data: events = [] } = useEventsList();
  const { data: heritage = [] } = useHeritageList();
  const { data: leaders = [] } = useLeadershipList();
  const { data: projects = [] } = useProjectsList();

  const publishedNews = news.filter((n) => n.status === 'PUBLISHED').slice(0, 3);
  const upcomingEvents = events.filter((e) => e.status === 'PUBLISHED').slice(0, 3);
  const featuredHeritage = heritage.slice(0, 3);

  const containerWidthClass =
    deviceView === 'mobile'
      ? 'max-w-sm mx-auto'
      : deviceView === 'tablet'
      ? 'max-w-2xl mx-auto'
      : 'w-full';

  return (
    <Dialog open={publicPreviewOpen} onOpenChange={setPublicPreviewOpen}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-stone-900 border-stone-800 text-stone-100">
        {/* Top Control Bar */}
        <div className="p-3 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/80 bg-black shrink-0">
              <img
                src="/assets/aistudio/image_63748073.png"
                alt="Nkar Woo Làn"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  NKAR WOO LÀN — Live Public Portal
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  PUBLIC PREVIEW
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-mono">
                https://nkarwoolad.cm
              </p>
            </div>
          </div>

          {/* Viewport Device Switcher */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-[#153E2E] text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Desktop View (1200px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === 'tablet'
                  ? 'bg-[#153E2E] text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>

            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-[#153E2E] text-white shadow-xs font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPublicPreviewOpen(false)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Back to Admin Panel
            </button>
          </div>
        </div>

        {/* Viewport Frame with Simulated Public Site */}
        <div className="flex-1 overflow-y-auto bg-stone-950 p-2 sm:p-4">
          <div
            className={`transition-all duration-300 bg-[#FAF9F5] text-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-800 ${containerWidthClass}`}
          >
            {/* 1. Public Header */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E8E4DA] px-4 sm:px-8 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] bg-black shrink-0">
                  <img
                    src="/assets/aistudio/image_63748073.png"
                    alt="Nkar Woo Làn"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-heritage text-base sm:text-lg font-bold text-[#153E2E] tracking-wide leading-tight">
                    NKAR WOO LÀN
                  </h1>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                    Fondom of Nkar · Bui Division
                  </p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-700">
                <span className="text-[#153E2E] hover:text-[#0E2C20] cursor-pointer">Home</span>
                <span className="hover:text-[#153E2E] cursor-pointer">Heritage & History</span>
                <span className="hover:text-[#153E2E] cursor-pointer">Traditional Leadership</span>
                <span className="hover:text-[#153E2E] cursor-pointer">News & Events</span>
                <span className="hover:text-[#153E2E] cursor-pointer">Development</span>
                <span className="hover:text-[#153E2E] cursor-pointer">Contact</span>
              </nav>

              <button
                onClick={() => setPublicPreviewOpen(false)}
                className="text-[11px] font-bold text-[#153E2E] border border-[#153E2E]/30 hover:bg-[#153E2E]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Admin Access
              </button>
            </header>

            {/* 2. Public Hero Banner */}
            <section className="relative bg-gradient-to-br from-[#153E2E] via-[#1A4C39] to-[#0F2E22] text-white p-6 sm:p-12 overflow-hidden border-b-4 border-[#D4AF37]">
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>The Official Digital Heritage of Nkar Fondom</span>
                </div>
                <h2 className="font-heritage text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                  Preserving Our Culture, Honoring Our Royal Lineage
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  Welcome to the official civic portal of Nkar Woo Làn in the North West Region of Cameroon. Explore oral histories, traditional council announcements, sacred monuments, and community infrastructure projects.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold">
                  <span className="px-4 py-2 bg-[#D4AF37] text-[#153E2E] rounded-xl font-bold shadow-md">
                    Explore Cultural Archives
                  </span>
                  <span className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
                    Traditional Council News
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Published News Section */}
            <section className="p-6 sm:p-8 border-b border-[#E8E4DA] bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#153E2E]" />
                    Latest Village Announcements & News
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live updates verified and approved by the Nkar Editorial Council
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {publishedNews.length === 0 ? (
                  <p className="text-xs text-stone-400">No published articles yet.</p>
                ) : (
                  publishedNews.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      {item.coverImage && (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-36 object-cover"
                        />
                      )}
                      <div className="p-4 flex-1">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 mt-2 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                      </div>
                      <div className="p-4 pt-0 text-[10px] text-stone-400 font-mono">
                        Published: {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 4. Upcoming Events Section */}
            <section className="p-6 sm:p-8 border-b border-[#E8E4DA] bg-[#FAF8F5]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    Traditional Calendar & Upcoming Events
                  </h3>
                  <p className="text-xs text-stone-500">
                    Official gatherings, youth conventions, and sacred ceremonies
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-white border border-[#E8E4DA] rounded-xl shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#153E2E]">{evt.eventDate}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{evt.startTime} - {evt.endTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{evt.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{evt.description}</p>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#153E2E]" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Public Footer */}
            <footer className="p-8 bg-[#153E2E] text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] bg-black">
                    <img
                      src="/assets/aistudio/image_63748073.png"
                      alt="Nkar Woo Làn"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-heritage text-base font-bold">NKAR WOO LÀN</h4>
                    <p className="text-xs text-stone-300">
                      Traditional Fondom Administration · North West Region, Cameroon
                    </p>
                  </div>
                </div>
                <p className="text-xs text-stone-400">
                  © {new Date().getFullYear()} Nkar Woo Làn Heritage Trust. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
