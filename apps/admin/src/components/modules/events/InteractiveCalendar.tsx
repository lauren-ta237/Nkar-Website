import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Filter,
  Users,
  Eye,
  Edit,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { EventItem } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { useAdminStore } from '../../../store/useAdminStore';

interface InteractiveCalendarProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onScheduleForDate: (dateStr: string) => void;
  canManage: boolean;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onSelectEvent,
  onScheduleForDate,
  canManage,
}) => {
  // Current viewed month and year
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 1)); // November 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-20');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Grid dates construction (42 cells: 6 rows of 7 days)
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: true,
    });
  }

  // 3. Next month leading days
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false,
    });
  }

  const getEventCategory = (evt: EventItem) => {
    const t = (evt.title + ' ' + evt.description + ' ' + evt.organizer).toLowerCase();
    if (t.includes('festival') || t.includes('celebration') || t.includes('dance')) return 'Traditional Festival';
    if (t.includes('fon') || t.includes('royal') || t.includes('palace') || t.includes('coronation')) return 'Royal Ceremony';
    if (t.includes('meeting') || t.includes('council') || t.includes('assembly') || t.includes('elders')) return 'Council Meeting';
    if (t.includes('youth') || t.includes('sport') || t.includes('convention') || t.includes('football')) return 'Youth & Culture';
    return 'Community Event';
  };

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'ALL') return true;
    return getEventCategory(e) === categoryFilter;
  });

  // Map events by dateStr
  const eventsByDate = filteredEvents.reduce<Record<string, EventItem[]>>((acc, evt) => {
    const d = evt.eventDate ? evt.eventDate.split('T')[0] : '';
    if (d) {
      if (!acc[d]) acc[d] = [];
      acc[d].push(evt);
    }
    return acc;
  }, {});

  // Selected date events
  const selectedDayEvents = events.filter(
    (e) => (e.eventDate ? e.eventDate.split('T')[0] : '') === selectedDateStr
  );

  // Category color mapping
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Traditional Festival':
      case 'Royal Ceremony':
        return 'bg-[#D4AF37]/20 text-[#8B6E10] dark:bg-[#D4AF37]/30 dark:text-amber-300 border-[#D4AF37]/40';
      case 'Council Meeting':
        return 'bg-[#153E2E]/15 text-[#153E2E] dark:bg-[#153E2E]/40 dark:text-emerald-300 border-[#153E2E]/30';
      case 'Youth & Culture':
      case 'Youth Convention':
      case 'Development Assembly':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  const categories = ['Traditional Festival', 'Royal Ceremony', 'Council Meeting', 'Youth & Culture', 'Community Event'];

  return (
    <div className="space-y-4">
      {/* Top Calendar Toolbar */}
      <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 min-w-44">
            {monthNames[month]} {year}
          </h3>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#153E2E] text-white shadow-xs'
                : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
            }`}
          >
            All Events ({events.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer truncate ${
                categoryFilter === cat
                  ? 'bg-[#153E2E] text-white shadow-xs'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Selected Day Agenda Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-[#E8E4DA] dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 text-center">
            {daysOfWeek.map((day, idx) => (
              <div
                key={day}
                className={`py-3 text-xs font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 42 Calendar Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#F0EDE6] dark:divide-stone-800">
            {calendarCells.map((cell, idx) => {
              const cellEvents = eventsByDate[cell.dateStr] || [];
              const isSelected = selectedDateStr === cell.dateStr;
              const isToday =
                new Date().toISOString().split('T')[0] === cell.dateStr;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[92px] sm:min-h-[110px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                    !cell.isCurrentMonth
                      ? 'bg-stone-50/60 dark:bg-stone-950/40 text-stone-400 dark:text-stone-600'
                      : isSelected
                      ? 'bg-[#FAF6EE] dark:bg-amber-950/20 ring-2 ring-inset ring-[#D4AF37]'
                      : 'hover:bg-[#FAF9F7] dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#153E2E] text-white shadow-xs'
                          : isSelected
                          ? 'bg-[#D4AF37] text-[#153E2E]'
                          : cell.isCurrentMonth
                          ? 'text-stone-800 dark:text-stone-200'
                          : 'text-stone-400 dark:text-stone-600'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {canManage && cell.isCurrentMonth && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleForDate(cell.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-[#153E2E] dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-opacity"
                        title={`Schedule event on ${cell.dateStr}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {cellEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border transition-transform hover:scale-[1.02] ${getCategoryColor(
                          getEventCategory(evt)
                        )}`}
                        title={`${evt.title} (${getEventCategory(evt)})`}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {cellEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 pl-1">
                        +{cellEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Agenda Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              {/* Agenda Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DA] dark:border-stone-800 mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Selected Date Agenda</span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h4>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#FAF8F5] dark:bg-stone-800 border border-[#E8E4DA] dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300">
                  {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event' : 'Events'}
                </span>
              </div>

              {/* Event Cards for Selected Date */}
              {selectedDayEvents.length === 0 ? (
                <div className="py-12 text-center text-stone-400 dark:text-stone-500 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium">No events scheduled on this date.</p>
                  <p className="text-[11px] text-stone-400">
                    Click below to schedule a traditional gathering, council meeting, or festival.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 bg-[#FAF8F5] dark:bg-stone-950 rounded-xl border border-[#E8E4DA] dark:border-stone-800 space-y-2 hover:border-[#D4AF37] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(
                            getEventCategory(evt)
                          )}`}
                        >
                          {getEventCategory(evt)}
                        </span>
                        <StatusBadge status={evt.status} />
                      </div>

                      <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                        {evt.title}
                      </h5>

                      <div className="space-y-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#153E2E] dark:text-emerald-400" />
                          <span>{evt.eventDate} ({evt.startTime} - {evt.endTime})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-stone-800">
                        <button
                          onClick={() => onSelectEvent(evt)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#153E2E] dark:text-emerald-400 hover:bg-[#153E2E]/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Manage</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule CTA */}
            {canManage && (
              <div className="pt-4 mt-4 border-t border-[#E8E4DA] dark:border-stone-800">
                <button
                  onClick={() => onScheduleForDate(selectedDateStr)}
                  className="w-full py-2.5 px-3 bg-[#153E2E] hover:bg-[#0E2C20] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Schedule Event on This Date</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Traditional Guidelines Notice */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Nkar Fondom Traditional Calendar Rules</span>
            </p>
            <p className="text-[11px] leading-relaxed opacity-90">
              Sacred Fon ceremonies and traditional market days (Nkar Country Sundays) must be booked at least 7 days in advance for council verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
