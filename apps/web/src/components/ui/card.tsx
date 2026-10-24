import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Surface tiers and elevation come from tokens. See DESIGN.md sections 3 and 4
 * for when to reach for each variant.
 */
const cardVariants = cva(
  "group/card relative flex flex-col gap-(--card-spacing) rounded-2xl py-(--card-spacing) text-sm [--card-spacing:--spacing(5)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
  {
    variants: {
      variant: {
        raised:
          "bg-surface-raised text-card-foreground border border-border/60 shadow-e2",
        flat: "bg-surface-raised text-card-foreground border border-border/60",
        sunken:
          "bg-surface-sunken text-card-foreground border border-border/50",
        brand:
          "bg-surface-brand text-surface-brand-foreground border border-primary/20 shadow-e2",
        gradient:
          "bg-gradient-hero text-white border-0 shadow-brand overflow-hidden",
        inverse:
          "bg-surface-inverse text-surface-inverse-foreground border-0 shadow-e3 overflow-hidden",
      },
      interactive: {
        true: "transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-(--ease-out-quart) hover:shadow-e3 focus-within:shadow-e3 motion-safe:hover:-translate-y-0.5 motion-safe:focus-within:-translate-y-0.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "raised",
      interactive: false,
    },
  }
)

function Card({
  className,
  size = "default",
  variant,
  interactive,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant ?? "raised"}
      className={cn(cardVariants({ variant, interactive }), className)}
      {...props}
    />
  )
}

/**
 * Top-edge highlight for gradient and inverse tiles. Drop in as the first child.
 */
function CardSheen({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-sheen",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground group-data-[variant=gradient]/card:text-white/70 group-data-[variant=inverse]/card:text-surface-inverse-foreground/65",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-2xl border-t border-border/60 bg-surface-sunken p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardSheen,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
