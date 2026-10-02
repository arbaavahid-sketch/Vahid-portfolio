import clsx from "clsx";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Info,
  OctagonAlert,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

// ----------------------------------------------------------------- layout

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-3">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-line bg-surface shadow-card",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 px-5 pt-4">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-ink">{title}</h2>
            )}
            {subtitle && <p className="mt-1 text-xs text-ink-3">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div
        className={clsx(
          "px-5 pb-5",
          title || action ? "pt-4" : "pt-5",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

// -------------------------------------------------------------- stat tiles

/**
 * A single current value. Proportional figures, not tabular — at this size
 * equal-width digits read loose.
 */
export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  /** Which direction is good. Drives the delta colour, not the sign. */
  deltaGood,
  hint,
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaLabel?: string;
  deltaGood?: boolean;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      <div className="text-xs font-medium text-ink-3">{label}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold leading-none text-ink">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-ink-3">{unit}</span>
        )}
      </div>
      {delta && (
        <div className="mt-2 flex items-baseline gap-1.5 text-xs">
          <span
            className={clsx(
              "font-semibold whitespace-nowrap",
              deltaGood === undefined
                ? "text-ink-2"
                : deltaGood
                  ? "text-st-good"
                  : "text-st-critical",
            )}
          >
            {delta}
          </span>
          {deltaLabel && <span className="text-ink-3">{deltaLabel}</span>}
        </div>
      )}
      {hint && <p className="mt-2 text-xs leading-relaxed text-ink-3">{hint}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

/**
 * A single ratio against a limit. The unfilled track is a lighter step of the
 * same ramp, so the state reads across the whole bar.
 */
export function Meter({
  value,
  max = 100,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  tone?: "accent" | "warning" | "critical";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = {
    accent: "var(--seq-400)",
    warning: "var(--st-warning)",
    critical: "var(--st-critical)",
  }[tone];
  return (
    <div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--seq-100)" }}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ status

export type StatusTone = "good" | "warning" | "serious" | "critical" | "idle";

const STATUS_ICON = {
  good: CheckCircle2,
  warning: AlertTriangle,
  serious: Wrench,
  critical: OctagonAlert,
  idle: CircleSlash,
} as const;

const STATUS_COLOR: Record<StatusTone, string> = {
  good: "var(--st-good)",
  warning: "var(--st-warning)",
  serious: "var(--st-serious)",
  critical: "var(--st-critical)",
  idle: "var(--st-idle)",
};

/**
 * Status always ships as icon + label. The colour is a third channel, never
 * the only one — three of these are sub-3:1 on the light surface by design.
 */
export function StatusPill({
  tone,
  label,
  className,
}: {
  tone: StatusTone;
  label: string;
  className?: string;
}) {
  const Icon = STATUS_ICON[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-2",
        className,
      )}
    >
      <Icon size={13} strokeWidth={2.25} style={{ color: STATUS_COLOR[tone] }} />
      {label}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-2 ring-1 ring-line ring-inset",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A small colour key beside a label. Identity lives in the mark, not the text. */
export function SeriesKey({
  slot,
  label,
  shape = "rect",
}: {
  slot: number;
  label: string;
  shape?: "rect" | "line";
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-2">
      <span
        aria-hidden
        className={shape === "line" ? "h-0.5 w-3.5 rounded-full" : "size-2.5 rounded-sm"}
        style={{ background: `var(--s${slot})` }}
      />
      {label}
    </span>
  );
}

export function Legend({
  items,
  shape = "rect",
}: {
  items: { slot: number; label: string }[];
  shape?: "rect" | "line";
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <li key={it.label}>
          <SeriesKey slot={it.slot} label={it.label} shape={shape} />
        </li>
      ))}
    </ul>
  );
}

// ------------------------------------------------------------------- notes

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-3">
      <Info size={14} className="mt-px shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-3">
      {children}
    </div>
  );
}
