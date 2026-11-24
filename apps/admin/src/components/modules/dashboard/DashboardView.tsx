import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Newspaper,
  CalendarDays,
  Landmark,
  Crown,
  Briefcase,
  Clock,
  Mail,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  useAdminDashboardStats,
  useAdminPendingReviews,
} from '@/lib/api/dashboard.api';
import { useAdminProjectsList } from '@/lib/api/projects.api';
import { useAdminAuditLogs } from '@/lib/api/audit.api';
import { useAdminLeadershipList } from '@/lib/api/leadership.api';
import { StatCard } from '../../common/StatCard';
import { ReviewActionModal } from '../../common/ReviewActionModal';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAdminStore();
  const { data: stats } = useAdminDashboardStats();
  const { data: pendingItems = [] } = useAdminPendingReviews();
  const { data: projects = [] } = useAdminProjectsList();
  const { data: auditLogs = [] } = useAdminAuditLogs();
  const { data: leaders = [] } = useAdminLeadershipList();

  // Chart timeframes
  const [activityTimeframe, setActivityTimeframe] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [statsPeriod, setStatsPeriod] = useState<'Today' | 'Month'>('Today');

  // Carousel scroll index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Review decision modal
  const [reviewModalItem, setReviewModalItem] = useState<{ id: string; title: string; type: string } | null>(null);

  // Quick stats calculations
  const totalNews = stats?.totalNews || 0;
  const publishedNews = stats?.publishedNews || 0;
  const publishRate = totalNews > 0 ? Math.round((publishedNews / totalNews) * 100) : 100;

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'IN_PROGRESS').length;
  const avgProgress =
    totalProjects > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress_percentage, 0) / totalProjects)
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

  // SVG Chart data calculated strictly from actual audit log volume
  const chartPoints = useMemo(() => {
    if (activityTimeframe === 'Weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map((day, i) => {
        const count = auditLogs.filter((log) => {
          const d = new Date(log.created_at).getDay();
          const adjusted = d === 0 ? 6 : d - 1;
          return adjusted === i;
        }).length;
        return { label: day, val: count };
      });
    } else if (activityTimeframe === 'Monthly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map((label, i) => {
        const count = auditLogs.filter((log) => {
          const date = new Date(log.created_at).getDate();
          return Math.floor((date - 1) / 7) === i;
        }).length;
        return { label, val: count };
      });
    } else {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return quarters.map((label, i) => {
        const count = auditLogs.filter((log) => {
          const month = new Date(log.created_at).getMonth();
          return Math.floor(month / 3) === i;
        }).length;
        return { label, val: count };
      });
    }
  }, [activityTimeframe, auditLogs]);

  // SVG Area path generator
  const maxVal = Math.max(...chartPoints.map((p) => p.val), 5);
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
              src="/assets/logo.jpeg"
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
          <div
            onClick={() => navigate('/news')}
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
                Official Kingdom/Fondom notices & news
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate('/events')}
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

          <div
            onClick={() => navigate('/heritage')}
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

          <div
            onClick={() => navigate('/projects')}
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

      {/* Top Carousel: Content Awaiting Review */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100">
              Content Awaiting Review & Recent Submissions
            </h3>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
              ({pendingItems.length} items queued)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevCarousel}
              disabled={carouselIndex === 0}
              className="p-1.5 rounded-lg border border-[#E8E4DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer text-stone-600 dark:text-stone-400 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextCarousel}
              disabled={carouselIndex + 2 >= pendingItems.length}
              className="p-1.5 rounded-lg border border-[#E8E4DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-30 cursor-pointer text-stone-600 dark:text-stone-400 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-4 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl text-center text-xs text-stone-500 dark:text-stone-400">
            No submissions currently awaiting editorial review. All content is up to date!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingItems.slice(carouselIndex, carouselIndex + 4).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#153E2E] dark:text-emerald-300 bg-[#EAF2EE] dark:bg-emerald-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-[#153E2E] dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                    Submitted by: <span className="font-medium text-stone-700 dark:text-stone-300">{item.submittedBy || item.submitted_by || item.author_id || 'Staff'}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2EFE9] dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/60">
                    Under Review
                  </span>

                  {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'CONTENT_REVIEWER') ? (
                    <button
                      onClick={() => setReviewModalItem({ id: item.id, title: item.title, type: item.type })}
                      className="text-xs font-bold text-[#153E2E] dark:text-emerald-400 hover:text-[#0C241B] flex items-center gap-1 cursor-pointer"
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

      {/* Middle Analytical Row: Area Trend Chart & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Engagement Activity (Area Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#153E2E] dark:text-emerald-400" />
                Administrative & Governance Activity Trend
              </h3>
              <p className="text-xs text-stone-400 dark:text-stone-500">Live immutable governance audit trail activity density</p>
            </div>

            {/* Segmented Period Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-stone-800 p-1 border border-[#E8E4DA] dark:border-stone-700 rounded-lg self-start">
              {(['Weekly', 'Monthly', 'Yearly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivityTimeframe(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    activityTimeframe === period
                      ? 'bg-white dark:bg-stone-900 text-[#153E2E] dark:text-emerald-300 shadow-xs'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
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
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-stone-200 dark:text-stone-800" strokeWidth="1" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-stone-200 dark:text-stone-800" strokeWidth="1" strokeDasharray="4 4" />

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
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[10px] fill-stone-700 dark:fill-stone-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {p.val}
                  </text>
                </g>
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-2 pt-2 border-t border-[#F2EFE9] dark:border-stone-800 text-[10px] text-stone-400 font-mono">
              {chartPoints.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Content Workflow Distribution */}
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Content Status Distribution</h3>
                <p className="text-xs text-stone-400 dark:text-stone-500">Published vs. Editorial Queue</p>
              </div>

              <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-stone-800 p-0.5 border border-[#E8E4DA] dark:border-stone-700 rounded-lg">
                {(['Today', 'Month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setStatsPeriod(period)}
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded ${
                      statsPeriod === period
                        ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 dark:text-stone-400'
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
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    Published Records
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">{publishedNews} articles</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${publishRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                    Awaiting Review
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {stats?.pendingReviews || 0} items
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.pendingReviews || 0) * 20, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Upcoming Events
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {stats?.upcomingEvents || 0} scheduled
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.upcomingEvents || 0) * 25, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                    Unread Inquiries
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {stats?.unreadMessages || 0} citizens
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats?.unreadMessages || 0) * 30, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#F2EFE9] dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Official Publication Rate</span>
            <span className="font-bold text-[#153E2E] dark:text-emerald-400">{publishRate}% Live Verified</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Circular Gauge Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Published News"
          value={publishedNews}
          subtitle={`Out of ${totalNews} total articles`}
          percentage={publishRate}
          accentColor="#153E2E"
          icon={Newspaper}
          onClick={() => navigate('/news')}
        />

        <StatCard
          title="Heritage Records"
          value={stats?.heritageRecords || 0}
          subtitle="Traditions & Oral Histories"
          percentage={stats?.heritageRecords ? 100 : 0}
          accentColor="#D4AF37"
          icon={Landmark}
          onClick={() => navigate('/heritage')}
        />

        <StatCard
          title="Development Projects"
          value={`${activeProjects} Active`}
          subtitle={`Avg ${avgProgress}% Completion`}
          percentage={avgProgress}
          accentColor="#6F4E37"
          icon={Briefcase}
          onClick={() => navigate('/projects')}
        />

        <StatCard
          title="Community Inquiries"
          value={stats?.unreadMessages || 0}
          subtitle="Citizen Inquiries Awaiting Reply"
          percentage={stats?.unreadMessages ? 40 : 100}
          accentColor="#C69214"
          icon={Mail}
          onClick={() => navigate('/contact')}
        />
      </div>

      {/* Secondary Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => navigate('/events')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Upcoming Events</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{stats?.upcomingEvents || 0}</span>
        </div>

        <div
          onClick={() => navigate('/gallery')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Gallery Media</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{stats?.galleryItems || 0}</span>
        </div>

        <div
          onClick={() => navigate('/publications')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Publications</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{stats?.publicationsCount || 0}</span>
        </div>

        <div
          onClick={() => navigate('/leadership')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Royal Leaders</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{leaders.length} Enrolled</span>
        </div>

        <div
          onClick={() => navigate('/users')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Administrators</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{stats?.registeredAdmins || 0}</span>
        </div>

        <div
          onClick={() => navigate('/audit')}
          className="p-3.5 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-xl hover:border-[#153E2E] dark:hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 block">Audit Entries</span>
          <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">{auditLogs.length}</span>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Activities & Development Projects Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Activities (Live Stream) */}
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Recent Administrative Activities</h3>
              <p className="text-xs text-stone-400 dark:text-stone-500">Live immutable governance audit trail</p>
            </div>
            {currentUser.role === 'SUPER_ADMIN' && (
              <button
                onClick={() => navigate('/audit')}
                className="text-xs font-semibold text-[#153E2E] dark:text-emerald-400 hover:underline"
              >
                View All Logs
              </button>
            )}
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#FAF8F5] dark:bg-stone-950 border border-[#EAE6DD] dark:border-stone-800 rounded-xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        log.action === 'PUBLISH' || log.action === 'APPROVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : log.action === 'CREATE'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : log.action === 'DELETE' || log.action === 'REJECT' || log.action === 'SUSPEND'
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">{log.resource_type}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 line-clamp-1">{log.details || '—'}</p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Actor: <span className="font-mono text-stone-700 dark:text-stone-300">{log.actor_id || 'System'}</span>
                  </p>
                </div>

                <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap shrink-0">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Development Projects Snapshot */}
        <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">High-Priority Development Projects</h3>
                <p className="text-xs text-stone-400 dark:text-stone-500">Kingdom/Fondom infrastructure and community facilities</p>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-[#153E2E] dark:text-emerald-400 hover:underline"
              >
                Manage Projects
              </button>
            </div>

            <div className="space-y-3.5">
              {projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="p-3 bg-[#FAF8F5] dark:bg-stone-950 border border-[#EAE6DD] dark:border-stone-800 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{proj.title}</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">{proj.location}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {proj.status}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500 dark:text-stone-400">Budget Progress</span>
                      <span className="font-bold text-[#153E2E] dark:text-emerald-400 tabular-nums">
                        {proj.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#153E2E] to-[#40916C] dark:from-emerald-600 dark:to-emerald-400 rounded-full"
                        style={{ width: `${proj.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#F2EFE9] dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400">Active Capital Commitment</span>
            <span className="font-bold text-[#153E2E] dark:text-emerald-400 tabular-nums">
              {projects
                .filter((p) => p.status === 'IN_PROGRESS')
                .reduce((sum, p) => sum + (p.budget_cfa || 0), 0)
                .toLocaleString()}{' '}
              XAF
            </span>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalItem && (
        <ReviewActionModal
          isOpen={true}
          itemTitle={reviewModalItem.title}
          onClose={() => setReviewModalItem(null)}
          onApprove={() => setReviewModalItem(null)}
          onReject={() => setReviewModalItem(null)}
        />
      )}
    </div>
  );
};
