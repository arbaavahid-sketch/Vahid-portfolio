"use client";

import { useState } from "react";
import { fmtNum, fmtPct } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

export type StackSegment = {
  key: string;
  label: string;
  /** Categorical slot, fixed per entity — a filter must not repaint survivors. */
  slot: number;
  value: number;
};

/**
 * Part-to-whole across one bar. Segments are separated by a 2px surface gap,
 * never by a stroke. Values are direct-labelled in the key below the bar rather
 * than inside the segments, where a label can be clipped and the text contrast
 * flips between light and dark mode.
 */
export function StackedBar({
  locale,
  segments,
  unit,
  ariaLabel,
}: {
  locale: Locale;
  segments: StackSegment[];
  unit: string;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <div>
      <div
        className="flex h-7 w-full gap-0.5 overflow-hidden rounded-lg"
        role="img"
        aria-label={ariaLabel}
      >
        {segments.map((s) => (
          <div
            key={s.key}
            tabIndex={0}
            onPointerEnter={() => setHover(s.key)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(s.key)}
            onBlur={() => setHover(null)}
            title={`${s.label}: ${fmtNum(s.value, locale)} ${unit}`}
            className="h-full outline-none transition-opacity first:rounded-s-lg last:rounded-e-lg focus-visible:ring-2 focus-visible:ring-brand-accent"
            style={{
              width: `${(s.value / total) * 100}%`,
              background: `var(--s${s.slot})`,
              opacity: hover === null || hover === s.key ? 1 : 0.6,
            }}
          />
        ))}
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {segments.map((s) => (
          <li
            key={s.key}
            onPointerEnter={() => setHover(s.key)}
            onPointerLeave={() => setHover(null)}
            className="flex items-baseline gap-2"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 translate-y-px rounded-sm"
              style={{ background: `var(--s${s.slot})` }}
            />
            <span className="min-w-0 flex-1 truncate text-xs text-ink-2">
              {s.label}
            </span>
            <span className="tnum text-xs font-semibold text-ink">
              {fmtNum(s.value, locale)}
            </span>
            <span className="tnum w-11 text-end text-[11px] text-ink-3">
              {fmtPct((s.value / total) * 100, locale, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
