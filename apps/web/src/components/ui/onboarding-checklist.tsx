import type { ReactNode } from "react";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChecklistStep = {
  id: string;
  label: string;
  description?: string;
  status: "complete" | "current" | "pending";
};

type Props = {
  steps: ChecklistStep[];
  action?: ReactNode;
  className?: string;
};

/**
 * Turns an empty account into a guided path rather than a blank canvas.
 */
export default function OnboardingChecklist({
  steps,
  action,
  className,
}: Props) {
  return (
    <div className={cn("space-y-1", className)}>
      <ol className="space-y-1">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-3 pb-1">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px",
                    step.status === "complete" ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-1 transition-colors",
                  step.status === "complete" &&
                    "bg-primary text-primary-foreground ring-primary/30",
                  step.status === "current" &&
                    "bg-primary/12 text-primary ring-primary/30",
                  step.status === "pending" &&
                    "bg-surface-sunken text-muted-foreground ring-border",
                )}>
                {step.status === "complete" ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : step.status === "current" ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Circle className="size-2 fill-current" aria-hidden="true" />
                )}
              </span>

              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.status === "pending"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
