import { useTranslation } from "react-i18next";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import type { CardLevel, CardNetworkSlug, CardStatus } from "@/types";
import CardNetworkMark from "@/components/ui/card-network-mark";

const faceStyles = cva(
  "relative isolate flex aspect-[1.586/1] w-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-left shadow-e3 ring-2 ring-inset",
  {
    variants: {
      level: {
        standard:
          "bg-[var(--card-face-standard)] text-[var(--card-face-standard-fg)] ring-primary-foreground/30",
        gold: "bg-[var(--card-face-gold)] text-[var(--card-face-gold-fg)] ring-[color:color-mix(in_oklch,var(--brand-ink)_30%,transparent)]",
        platinum:
          "bg-[var(--card-face-platinum)] text-[var(--card-face-platinum-fg)] ring-foreground/20",
        black:
          "bg-[var(--card-face-black)] text-[var(--card-face-black-fg)] ring-primary/70",
      },
      muted: {
        true: "opacity-90",
        false: "",
      },
    },
    defaultVariants: {
      level: "standard",
      muted: false,
    },
  },
);

type Props = {
  level: CardLevel;
  name: string;
  lastFour?: string | null;
  expiresAt?: string | null;
  status?: CardStatus;
  network?: CardNetworkSlug | null;
  balance?: string | null;
  currency?: string | null;
  className?: string;
} & VariantProps<typeof faceStyles>;

function formatExpiry(expiresAt?: string | null): string {
  if (!expiresAt) return "••/••";
  const date = new Date(`${expiresAt}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "••/••";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export default function VirtualCardFace({
  level,
  name,
  lastFour,
  expiresAt,
  status = "active",
  network = null,
  balance = null,
  currency = "USD",
  className,
}: Props) {
  const { t } = useTranslation(["dashboard", "enums"]);
  const issued = Boolean(lastFour) && status !== "pending";
  const muted =
    status === "pending" ||
    status === "cancelled" ||
    status === "blocked" ||
    status === "suspended";

  return (
    <div
      className={cn(faceStyles({ level, muted }), className)}
      aria-label={`${level} virtual card${network ? ` · ${network.replaceAll("_", " ")}` : ""}${issued ? ` ending ${lastFour}` : ""}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-sheen"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-current opacity-[0.12]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -left-10 size-40 rounded-full bg-current opacity-[0.1]"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-90">
            TrustVault
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] opacity-80">
            {level}
          </p>
        </div>
        {network ? <CardNetworkMark slug={network} size="lg" /> : null}
      </div>

      <div className="relative flex items-end gap-3">
        <span
          aria-hidden="true"
          className="block h-8 w-11 rounded-md bg-current/25 shadow-e1"
          style={{
            background:
              "color-mix(in oklch, var(--warning) 70%, var(--primary-foreground) 30%)",
          }}
        />
        <svg
          viewBox="0 0 24 24"
          className="mb-0.5 size-6 opacity-70"
          aria-hidden="true"
          fill="none">
          <path
            d="M8 12a6 6 0 0 1 0 0.1M11 8.5a8 8 0 0 1 0 7M14 5.5a10.5 10.5 0 0 1 0 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        {balance != null && balance !== "" ? (
          <div className="ms-auto text-right">
            {/* <p className="text-[11px] uppercase tracking-[0.14em] opacity-60">
              Balance
            </p> */}
            <p className="text-sm font-semibold tabular">
              {formatMoney(balance, currency ?? "USD")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-sm tracking-[0.22em] tabular">
            <span className="opacity-45">•••• •••• •••• </span>
            {issued ? lastFour : "••••"}
          </p>
          {muted ? (
            <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground shadow-e1">
              {t(`enums:cardStatus.${status}`, { defaultValue: status })}
            </span>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] opacity-60">
              {t("dashboard:cards.cardholder")}
            </p>
            <p className="truncate text-sm font-semibold">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.14em] opacity-60">
              {t("dashboard:cards.expires")}
            </p>
            <p className="text-sm font-semibold tabular">{formatExpiry(expiresAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { faceStyles };
