import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  percentage?: number; // 0-100 for ring gauge (like in screenshot)
  accentColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  isPositive = true,
  percentage,
  accentColor = '#153E2E',
  onClick,
}) => {
  // SVG circular gauge math
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = percentage !== undefined ? circumference - (percentage / 100) * circumference : 0;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 shadow-xs transition-all hover:shadow-md hover:border-[#D4AF37]/50 relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight tabular-nums">
            {value}
          </h3>

          {subtitle && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 truncate">
              {subtitle}
            </p>
          )}

          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-semibold ${
                  isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {isPositive ? '↑' : '↓'} {change}
              </span>
              <span className="text-[11px] text-stone-400">vs last month</span>
            </div>
          )}
        </div>

        {/* Circular Progress or Icon */}
        <div className="shrink-0 flex items-center justify-center">
          {percentage !== undefined ? (
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 54 54">
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke="#F3F0E9"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="27"
                  cy="27"
                  r={radius}
                  stroke={accentColor}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-stone-700 tabular-nums">
                {percentage}%
              </span>
            </div>
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
