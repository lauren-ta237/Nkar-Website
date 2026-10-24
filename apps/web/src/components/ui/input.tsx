import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Height is h-10 so a 16px affixed icon has room and the target stays
 * comfortable. Prefer `Field` from ui/field over using this bare — see
 * DESIGN.md section 8.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-input bg-surface-raised px-3 py-1 text-base text-foreground shadow-e1 transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

type InputGroupProps = React.ComponentProps<"div"> & {
  startIcon?: LucideIcon
  endIcon?: LucideIcon
  /** Interactive trailing content such as a password toggle. */
  endAdornment?: React.ReactNode
  /** Pin the leading icon to the first line, for textareas. */
  iconAlign?: "center" | "top"
  invalid?: boolean
}

/**
 * Low-level icon affix. Adds the matching padding to the control it wraps and
 * tints the icon on focus and on invalid.
 */
function InputGroup({
  className,
  startIcon: StartIcon,
  endIcon: EndIcon,
  endAdornment,
  iconAlign = "center",
  invalid,
  children,
  ...props
}: InputGroupProps) {
  const iconPosition =
    iconAlign === "top" ? "top-3" : "top-1/2 -translate-y-1/2"

  const iconTone = cn(
    "pointer-events-none absolute size-4 text-muted-foreground transition-colors",
    "group-focus-within/input-group:text-primary",
    "group-data-[invalid=true]/input-group:text-destructive",
    iconPosition
  )

  return (
    <div
      data-slot="input-group"
      data-invalid={invalid ? "true" : undefined}
      className={cn("group/input-group relative w-full", className)}
      {...props}
    >
      {StartIcon && (
        <StartIcon className={cn(iconTone, "left-3")} aria-hidden="true" />
      )}
      {children}
      {EndIcon && !endAdornment && (
        <EndIcon className={cn(iconTone, "right-3")} aria-hidden="true" />
      )}
      {endAdornment && (
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center">
          {endAdornment}
        </div>
      )}
    </div>
  )
}

export { Input, InputGroup }
