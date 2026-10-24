import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { CardNetworkSlug } from "@/types";

const markStyles = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden",
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-8",
        lg: "size-11",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type Props = {
  slug: CardNetworkSlug;
  className?: string;
} & VariantProps<typeof markStyles>;

function Mark({
  label,
  viewBox,
  size,
  className,
  children,
}: {
  label: string;
  viewBox: string;
  size?: VariantProps<typeof markStyles>["size"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn(markStyles({ size }), className)}>
      <svg
        viewBox={viewBox}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label}>
        <title>{label}</title>
        {children}
      </svg>
    </span>
  );
}

function VisaMark({
  size,
  className,
}: Pick<Props, "size" | "className">) {
  return (
    <Mark label="Visa" viewBox="0 21 64 20" size={size} className={className}>
      <path
        fill="var(--network-visa)"
        d="m12.77 32.28-1.69-8.17a2 2 0 0 0-2.2-1.5H1.06L1 23c6.08 1.46 10.1 5 11.77 9.28Zm5.68-9.49L13.51 35.4 13 33.5a19.77 19.77 0 0 0-7-7.66l4.51 15.41h5.33l7.94-18.46Zm7.38 0-3.15 18.5h5l3.16-18.5Zm33.09 0H55a2.5 2.5 0 0 0-2.64 1.54l-7.45 16.94h5.29s.86-2.28 1.06-2.78h6.45c.15.64.61 2.76.61 2.76H63Zm-6.21 11.92c.42-1.06 2-5.17 2-5.17s.42-1.06.67-1.76l.35 1.59 1.16 5.34ZM41 30.2c-1.75-.85-2.83-1.43-2.82-2.29s.91-1.59 2.88-1.59a9.08 9.08 0 0 1 3.77.71l.46.21.68-4a12.89 12.89 0 0 0-4.51-.77c-5 0-8.49 2.5-8.52 6.1 0 2.65 2.5 4.14 4.41 5S40 35.06 40 35.87c0 1.24-1.57 1.81-3 1.81a10.58 10.58 0 0 1-4.74-1l-.65-.3-.71 4.14a15.87 15.87 0 0 0 5.62 1c5.29 0 8.73-2.48 8.77-6.32-.01-2.08-1.35-3.68-4.29-5Z"
      />
      <path
        fill="var(--network-visa-accent)"
        d="M11.08 24.11a2 2 0 0 0-2.2-1.5H1.06L1 23c6.08 1.47 10.1 5 11.77 9.29Z"
      />
    </Mark>
  );
}

function MastercardMark({
  size,
  className,
}: Pick<Props, "size" | "className">) {
  return (
    <Mark label="Mastercard" viewBox="0 0 24 24" size={size} className={className}>
      <path fill="var(--network-mastercard-orange)" d="M15.245 17.831h-6.49V6.168h6.49v11.663z" />
      <path
        fill="var(--network-mastercard-red)"
        d="M9.167 12A7.404 7.404 0 0 1 12 6.169 7.417 7.417 0 0 0 0 12a7.417 7.417 0 0 0 11.999 5.831A7.406 7.406 0 0 1 9.167 12z"
      />
      <path
        fill="var(--network-mastercard-yellow)"
        d="M24 12a7.417 7.417 0 0 1-12 5.831c1.725-1.358 2.833-3.465 2.833-5.831S13.725 7.527 12 6.169A7.417 7.417 0 0 1 24 12z"
      />
    </Mark>
  );
}

function AmexMark({
  size,
  className,
}: Pick<Props, "size" | "className">) {
  return (
    <Mark
      label="American Express"
      viewBox="0 0 48 30"
      size={size}
      className={className}>
      <rect
        width="48"
        height="30"
        rx="4"
        fill="var(--network-amex)"
      />
      <text
        x="24"
        y="13.2"
        textAnchor="middle"
        fill="var(--network-amex-fg)"
        fontSize="6.2"
        fontWeight="700"
        letterSpacing="0.18em"
        fontFamily="ui-sans-serif, system-ui, sans-serif">
        AMERICAN
      </text>
      <text
        x="24"
        y="22.4"
        textAnchor="middle"
        fill="var(--network-amex-fg)"
        fontSize="6.2"
        fontWeight="700"
        letterSpacing="0.28em"
        fontFamily="ui-sans-serif, system-ui, sans-serif">
        EXPRESS
      </text>
    </Mark>
  );
}

function DiscoverMark({
  size,
  className,
}: Pick<Props, "size" | "className">) {
  return (
    <Mark label="Discover" viewBox="0 0 72 24" size={size} className={className}>
      <text
        x="0"
        y="16.4"
        fill="var(--network-discover)"
        fontSize="9.4"
        fontWeight="700"
        letterSpacing="0.06em"
        fontFamily="ui-sans-serif, system-ui, sans-serif">
        DISCOVER
      </text>
      <circle cx="65.2" cy="12" r="6.6" fill="var(--network-discover)" />
    </Mark>
  );
}

export default function CardNetworkMark({ slug, size = "md", className }: Props) {
  if (slug === "visa") return <VisaMark size={size} className={className} />;
  if (slug === "mastercard") return <MastercardMark size={size} className={className} />;
  if (slug === "american_express") return <AmexMark size={size} className={className} />;
  return <DiscoverMark size={size} className={className} />;
}

export { markStyles };
