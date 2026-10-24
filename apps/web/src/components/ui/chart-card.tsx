import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { ErrorStateArt, EmptyChartArt } from "@/components/illustrations";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  footer?: ReactNode;
  height?: number;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Shared Recharts frame. Owns the responsive container and the four states so
 * pages never hand-roll a chart shell. See DESIGN.md section 9.
 */
export default function ChartCard({
  title,
  description,
  icon: Icon,
  action,
  footer,
  height = 250,
  isLoading = false,
  isError = false,
  isEmpty = false,
  onRetry,
  children,
  className,
}: Props) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="flex items-center gap-2">
          {Icon && (
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          )}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <ChartSkeleton height={height} />
        ) : isError ? (
          <EmptyState
            size="sm"
            illustration={ErrorStateArt}
            title="Chart unavailable"
            description="We could not load this series."
            action={
              onRetry ? (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              ) : undefined
            }
          />
        ) : isEmpty ? (
          <EmptyState
            size="sm"
            illustration={EmptyChartArt}
            title="No data yet"
            description="Once activity starts flowing through, this chart fills in."
          />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            {children as React.ReactElement}
          </ResponsiveContainer>
        )}
      </CardContent>

      {footer && (
        <div className="border-t border-border/60 px-(--card-spacing) pt-4">
          {footer}
        </div>
      )}
    </Card>
  );
}

function ChartSkeleton({ height }: { height: number }) {
  const bars = [0.45, 0.7, 0.55, 0.85, 0.6, 0.95, 0.75];
  return (
    <div
      className="flex items-end gap-3"
      style={{ height }}
      aria-hidden="true">
      {bars.map((fraction, index) => (
        <Skeleton
          key={index}
          className="flex-1 rounded-lg"
          style={{ height: `${fraction * 100}%` }}
        />
      ))}
    </div>
  );
}

/** Shared tooltip so every chart in the product reads the same. */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
  valueFormatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-e3">
      {label && <div className="mb-1.5 font-semibold">{label}</div>}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={item.name ?? index} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: item.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-semibold tabular">
              {valueFormatter && typeof item.value === "number"
                ? valueFormatter(item.value)
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Shared axis styling so charts do not drift apart. */
export const axisProps = {
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  axisLine: false,
  tickLine: false,
} as const;
