import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IllustrationComponent = ComponentType<{ className?: string }>;

type Props = {
  /** An illustration from @/components/illustrations. Never a bare lucide glyph. */
  illustration: IllustrationComponent;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "default" | "sm";
  className?: string;
};

/**
 * The only correct zero state. A grey icon in a grey box is an anti-pattern —
 * see DESIGN.md section 13.
 */
export default function EmptyState({
  illustration: Illustration,
  title,
  description,
  action,
  secondaryAction,
  size = "default",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "gap-3 px-5 py-8" : "gap-4 px-6 py-12",
        className,
      )}>
      <Illustration
        className={cn("text-primary", size === "sm" ? "w-32" : "w-44 sm:w-52")}
      />
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
