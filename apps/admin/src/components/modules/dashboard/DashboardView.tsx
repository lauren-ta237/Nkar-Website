import React, { useState } from 'react';
import {
  Newspaper,
  CalendarDays,
  Landmark,
  Crown,
  Image as ImageIcon,
  BookOpen,
  Briefcase,
  Users,
  Clock,
  Mail,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Plus,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Filter,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  useDashboardStats,
  usePendingReviews,
  useProjectsList,
  useAuditLogs,
  useNewsMutations,
} from '../../../api/queries';
import { StatCard } from '../../common/StatCard';
import { StatusBadge } from '../../common/StatusBadge';
import { ReviewActionModal } from '../../common/ReviewActionModal';

export const DashboardView: React.FC = () => {
  const { setCurrentPage, currentUser } = useAdminStore();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: pendingItems = [] } = usePendingReviews();
  const { data: projects = [] } = useProjectsList();
  const { data: auditLogs = [] } = useAuditLogs();

  const { approveMutation, rejectMutation } = useNewsMutations();

  // Chart timeframes
  const [activityTimeframe, setActivityTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [statsPeriod, setStatsPeriod] = useState<'New' | 'Today' | 'Month'>('Today');

  // Carousel scroll index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Review decision modal
  const [reviewModalItem, setReviewModalItem] = useState<{ id: string; title: string; type: string } | null>(null);

  // Quick stats calculations
  const totalNews = stats?.totalNews || 0;
  const publishedNews = stats?.publishedNews || 0;
  const publishRate = totalNews > 0 ? Math.round((publishedNews / totalNews) * 100) : 0;

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const avgProgress =
    totalProjects > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progressPercentage, 0) / totalProjects)
      : 0;

  // Carousel navigation
  const nextCarousel = () => {
    if (carouselIndex + 2 < pendingItems.length) {
      setCarouselIndex(carouselIndex + 1);
    }
  };
  const prevCarousel = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  // SVG Chart data based on timeframe
  const chartPoints =
    activityTimeframe === 'Weekly'
      ? [
          { label: 'Mon', val: 180 },
          { label: 'Tue', val: 240 },
          { label: 'Wed', val: 320 },
          { label: 'Thu', val: 290 },
          { label: 'Fri', val: 410 },
          { label: 'Sat', val: 490 },
          { label: 'Sun', val: 380 },
        ]
      : activityTimeframe === 'Monthly'
      ? [
          { label: 'Day 1', val: 120 },
          { label: 'Day 5', val: 180 },
          { label: 'Day 9', val: 260 },
          { label: 'Day 13', val: 220 },
          { label: 'Day 17', val: 340 },
          { label: 'Day 21', val: 450 },
          { label: 'Day 25', val: 290 },
          { label: 'Day 28', val: 380 },
          { label: 'Day 31', val: 420 },
        ]
      : [
          { label: 'Q1', val: 1200 },
          { label: 'Q2', val: 1850 },
          { label: 'Q3', val: 2400 },
          { label: 'Q4', val: 3100 },
        ];

  // SVG Area path generator
  const maxVal = Math.max(...chartPoints.map((p) => p.val), 500);
  const width = 600;
  const height = 180;
  const padding = 20;

  const points = chartPoints.map((p, i) => {
    const x = padding + (i / (chartPoints.length - 1)) * (width - 2 * padding);
    const y = height - padding - (p.val / maxVal) * (height - 2 * padding);
    return { x, y, ...p };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner with African Royal Gold Accents */}
      <div className="bg-gradient-to-r from-[#153E2E] via-[#1C4D3A] to-[#153E2E] rounded-2xl p-6 text-white relative overflow-hidden shadow-sm border border-[#D4AF37]/30">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src="/assets/aistudio/image_63748073.png"
              alt="Nkar Woo Làn Official Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain shrink-0 border-2 border-[#D4AF37] shadow-md bg-black"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 mb-1 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Nkar Woo Làn Traditional Council & Community Portal</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome, {currentUser.name}
              </h2>
              <p className="text-xs text-stone-200 mt-1 max-w-xl leading-relaxed">
                Managing the cultural archives, royal lineage, community development projects, and civic engagements of Nkar Woo Làn, Bui Division, Cameroon.
              </p>
            </div>
          </div>
        </div>

        {/* Four Quick Action Cards on Dashboard Banner */}
        <div className="pt-5 mt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
          {/* Card 1: News */}
          <div
            onClick={() => setCurrentPage('news')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#D4AF37]/80 backdrop-blur-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Newspaper className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Publish Announcement
              </h4>
              <p className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                Official village notices & news
              </p>
            </div>
          </div>

          {/* Card 2: Events */}
          <div
            onClick={() => setCurrentPage('events')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#D4AF37]/80 backdrop-blur-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <CalendarDays className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Schedule Ceremony
              </h4>
              <p className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                Palace festivals & calendar
              </p>
            </div>
          </div>

          {/* Card 3: Heritage */}
          <div
            onClick={() => setCurrentPage('heritage')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#D4AF37]/80 backdrop-blur-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Landmark className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Archive Heritage
              </h4>
              <p className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                Sacred shrines, rites & lore
              </p>
            </div>
          </div>

          {/* Card 4: Projects */}
          <div
            onClick={() => setCurrentPage('projects')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#D4AF37]/80 backdrop-blur-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Briefcase className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Development Works
              </h4>
              <p className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                Budget & progress tracker
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Carousel / Card Strip (Matching Reference Image) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-stone-800">
              Content Awaiting Review & Recent Submissions
            </h3>
            <span className="text-[11px] font-semibold text-stone-500 tabular-nums">
              ({pendingItems.length} items queued)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevCarousel}
              disabled={carouselIndex === 0}
              className="p-1.5 rounded-lg border border-[#E8E4DA] bg-white hover:bg-stone-50 disabled:opacity-30 cursor-pointer text-stone-600"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCarousel}
              disabled={carouselIndex + 2 >= pendingItems.length}
              className="p-1.5 rounded-lg border border-[#E8E4DA] bg-white hover:bg-stone-50 disabled:opacity-30 cursor-pointer text-stone-600"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-4 bg-white border border-[#E8E4DA] rounded-xl text-center text-xs text-stone-500">
            No submissions currently awaiting editorial review. All content is up to date!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingItems.slice(carouselIndex, carouselIndex + 4).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-[#E8E4DA] rounded-2xl shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#153E2E] bg-[#EAF2EE] px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 line-clamp-2 group-hover:text-[#153E2E] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                    Submitted by: <span className="font-medium text-stone-700">{item.submittedBy}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Under Review
                  </span>

                  {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') ? (
                    <button
                      onClick={() => setReviewModalItem({ id: item.id, title: item.title, type: item.type })}
                      className="text-xs font-bold text-[#153E2E] hover:text-[#0C241B] flex items-center gap-1 cursor-pointer"
                    >
                      Review <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-400 italic">Reviewer Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Middle Analytical Row (Matching Reference Screenshot): Area Trend Chart & Segmented Workflow Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Community & Portal Engagement Trends (Area Chart) */}
        <div className="lg:col-span-2 bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#153E2E]" />
                Diaspora & Community Engagement Activity
              </h3>
              <p className="text-xs text-stone-400">Monthly reader impressions and submission volume</p>
            </div>

            {/* Segmented Period Tabs (Reference screenshot) */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 border border-[#E8E4DA] rounded-lg self-start">
              {(['Weekly', 'Monthly', 'Yearly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivityTimeframe(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activityTimeframe === period
                      ? 'bg-white text-[#153E2E] shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#153E2E" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#153E2E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F2EFE9" strokeWidth="1" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F2EFE9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area path */}
              <path d={areaD} fill="url(#areaGradient)" />

              {/* Line path */}
              <path d={pathD} fill="none" stroke="#153E2E" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data points */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    className="hover:r-6 transition-all"
                  />
                  {/* Tooltip on hover */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[10px] fill-stone-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {p.val}
                  </text>
                </g>
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-2 pt-2 border-t border-[#F2EFE9] text-[10px] text-stone-400 font-mono">
              {chartPoints.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Content Workflow Distribution (Segmented Bar Chart - from screenshot) */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Content Status Distribution</h3>
                <p className="text-xs text-stone-400">Published vs. Editorial Queue</p>
              </div>

              {/* Time toggle */}
              <div className="flex items-center gap-1 bg-[#FAF8F5] p-0.5 border border-[#E8E4DA] rounded-lg">
                {(['Today', 'Month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setStatsPeriod(period as any)}
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded ${
                      statsPeriod === period ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Segmented Bars */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Published Records
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">{publishedNews} articles</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${publishRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                    Awaiting Review
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {stats?.pendingReviews || 0} items
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.pendingReviews || 0) * 20, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Upcoming Events
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {stats?.upcomingEvents || 0} scheduled
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.upcomingEvents || 0) * 25, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    Unread Inquiries
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {stats?.unreadMessages || 0} citizens
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.unreadMessages || 0) * 30, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-stone-500">
            <span>Overall Verification Grade</span>
            <span className="font-bold text-[#153E2E]">98.4% Cultural Accuracy</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Circular Gauge Stat Cards (Matching Reference Screenshot bottom row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Published News"
          value={publishedNews}
          subtitle={`Out of ${totalNews} total articles`}
          percentage={publishRate}
          accentColor="#153E2E"
          icon={Newspaper}
          onClick={() => setCurrentPage('news')}
        />

        <StatCard
          title="Heritage Records"
          value={stats?.heritageRecords || 0}
          subtitle="Traditions & Oral Histories"
          percentage={92}
          accentColor="#D4AF37"
          icon={Landmark}
          onClick={() => setCurrentPage('heritage')}
        />

        <StatCard
          title="Development Projects"
          value={`${activeProjects} Active`}
          subtitle={`Avg ${avgProgress}% Completion`}
          percentage={avgProgress}
          accentColor="#6F4E37"
          icon={Briefcase}
          onClick={() => setCurrentPage('projects')}
        />

        <StatCard
          title="Community Inquiries"
          value={stats?.unreadMessages || 0}
          subtitle="Citizen Inquiries Awaiting Reply"
          percentage={stats?.unreadMessages ? 40 : 100}
          accentColor="#C69214"
          icon={Mail}
          onClick={() => setCurrentPage('contact')}
        />
      </div>

      {/* Secondary Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setCurrentPage('events')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Upcoming Events</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">{stats?.upcomingEvents || 0}</span>
        </div>

        <div
          onClick={() => setCurrentPage('gallery')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Gallery Media</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">{stats?.galleryItems || 0}</span>
        </div>

        <div
          onClick={() => setCurrentPage('publications')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Publications</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">{stats?.publicationsCount || 0}</span>
        </div>

        <div
          onClick={() => setCurrentPage('leadership')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Royal Leaders</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">5 Enrolled</span>
        </div>

        <div
          onClick={() => setCurrentPage('users')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Administrators</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">{stats?.registeredAdmins || 0}</span>
        </div>

        <div
          onClick={() => setCurrentPage('audit')}
          className="p-3.5 bg-white border border-[#E8E4DA] rounded-xl hover:border-[#153E2E] cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Audit Entries</span>
          <span className="text-lg font-bold text-stone-900 tabular-nums">{auditLogs.length}</span>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Activities & Development Projects Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Activities (Live Stream) */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Recent Administrative Activities</h3>
              <p className="text-xs text-stone-400">Live immutable governance audit trail</p>
            </div>
            {currentUser.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => setCurrentPage('audit')}
                className="text-xs font-semibold text-[#153E2E] hover:underline"
              >
                View All Logs
              </button>
            )}
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#FAF8F5] border border-[#EAE6DD] rounded-xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        log.action === 'PUBLISH' || log.action === 'APPROVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'CREATE'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'DELETE' || log.action === 'REJECT' || log.action === 'SUSPEND'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-stone-800 truncate">{log.entityType}</span>
                  </div>
                  <p className="text-stone-600 line-clamp-1">{log.details}</p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    By <span className="font-medium text-stone-700">{log.adminName}</span> ({log.adminRole.replace('_', ' ')})
                  </p>
                </div>

                <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Development Projects Snapshot */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">High-Priority Development Projects</h3>
                <p className="text-xs text-stone-400">Village infrastructure and community facilities</p>
              </div>
              <button
                onClick={() => setCurrentPage('projects')}
                className="text-xs font-semibold text-[#153E2E] hover:underline"
              >
                Manage Projects
              </button>
            </div>

            <div className="space-y-3.5">
              {projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="p-3 bg-[#FAF8F5] border border-[#EAE6DD] rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{proj.projectName}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 truncate">{proj.location}</p>
                    </div>
                    <StatusBadge status={proj.status} />
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500">
                        Budget: <span className="font-semibold text-stone-800 tabular-nums">{proj.budgetXAF.toLocaleString()} XAF</span>
                      </span>
                      <span className="font-bold text-[#153E2E] tabular-nums">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#153E2E] rounded-full"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-stone-500">
            <span>Total Capital Deployed:</span>
            <span className="font-bold text-stone-900 tabular-nums">
              {projects.reduce((acc, p) => acc + p.budgetXAF, 0).toLocaleString()} XAF
            </span>
          </div>
        </div>
      </div>

      {/* Review Decision Modal */}
      {reviewModalItem && (
        <ReviewActionModal
          isOpen={true}
          itemTitle={reviewModalItem.title}
          itemType={reviewModalItem.type}
          onApprove={(notes) => {
            approveMutation.mutate({ id: reviewModalItem.id, notes });
            setReviewModalItem(null);
          }}
          onReject={(notes) => {
            rejectMutation.mutate({ id: reviewModalItem.id, notes });
            setReviewModalItem(null);
          }}
          onCancel={() => setReviewModalItem(null)}
          isLoading={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </div>
  );
};
