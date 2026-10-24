import { useId } from "react";
import { cn } from "@/lib/utils";
import { toneGradient, type Tone } from "@/lib/tones";

type Props = {
  /** 0 to 100. */
  value: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
  className?: string;
};

export default function ProgressRing({
  value,
  size = 132,
  thickness = 10,
  tone = "brand",
  label,
  sublabel,
  className,
}: Props) {
  const gradientId = useId();
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "Progress"}: ${Math.round(clamped)} percent complete`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={toneGradient[tone][0]} />
            <stop offset="100%" stopColor={toneGradient[tone][1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-slow ease-out-quart"
          style={{ transitionDuration: "var(--duration-slow)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-metric-sm text-foreground">
          {Math.round(clamped)}
          <span className="text-base font-medium text-muted-foreground">%</span>
        </span>
        {sublabel && (
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
