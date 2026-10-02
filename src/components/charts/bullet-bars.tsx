"use client";

import { useState } from "react";
import { FORMATS, fmtPct, type FormatKey } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";

export type BulletRow = {
  key: string;
  label: string;
  sublabel?: string;
  /** The measured value the bar length encodes. */
  value: number;
  /** The commitment the value is read against. */
  target: number;
  /** A second, lighter measure drawn as a whisker — p90 behind the median. */
  reach?: number;
  /** Pre-rendered context line for the tooltip, already in the right language. */
  volumeLabel?: string;
};

/**
 * Value against a commitment, one row per test.
 *
 * `scaleMode` decides what the bar length means, and it matters: rows whose
 * targets differ by a factor of five are not comparable on an absolute axis —
 * a method sitting comfortably inside a 120 h target would draw a longer bar
 * than one breaching a 24 h target. "ofTarget" divides each row by its own
 * commitment, which puts every target tick on the same vertical line and makes
 * the comparison the chart invites the correct one. The printed value stays in
 * real units either way.
 *
 * The bar is one hue for every row — length already carries magnitude.
 * Breaching the target switches it to the reserved critical status colour, and
 * the row says "Over target" in words so the state never rests on hue alone.
 */
export function BulletBars({
  locale,
  rows,
  slot = 1,
  format = "hours",
  scaleMode = "absolute",
  valueLabel,
  targetLabel = "Target",
  reachLabel,
}: {
  locale: Locale;
  rows: BulletRow[];
  slot?: number;
  format?: FormatKey;
  scaleMode?: "absolute" | "ofTarget";
  valueLabel: string;
  targetLabel?: string;
  reachLabel?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const fmt = (v: number) => FORMATS[format].value(v, locale);

  const ofTarget = scaleMode === "ofTarget";
  const ratio = (r: BulletRow, v: number) => (ofTarget ? v / r.target : v);
  const max = Math.max(
    ...rows.map((r) =>
      Math.max(ratio(r, r.value), ratio(r, r.target), ratio(r, r.reach ?? 0)),
    ),
  );
  const scale = (r: BulletRow, v: number) => `${(ratio(r, v) / max) * 100}%`;

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const over = r.value > r.target;
        const isHover = hover === r.key;
        return (
          <div
            key={r.key}
            tabIndex={0}
            onPointerEnter={() => setHover(r.key)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(r.key)}
            onBlur={() => setHover(null)}
            className="relative grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:grid-cols-[minmax(0,11rem)_1fr_auto] sm:items-center"
          >
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-ink">
                {r.label}
              </div>
              {r.sublabel && (
                <div className="truncate text-[11px] text-ink-3">
                  {r.sublabel}
                </div>
              )}
              {over && (
                <div className="mt-0.5 text-[11px] font-semibold text-st-critical">
                  {t(locale, "overTarget")}
                </div>
              )}
            </div>

            <div className="tnum w-16 text-end text-xs font-semibold text-ink sm:col-start-3 sm:row-start-1">
              {fmt(r.value)}
            </div>

            <div className="relative col-span-2 h-5 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              {/* p90 whisker sits behind the median bar as context */}
              {r.reach !== undefined && (
                <div
                  className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-e-[2px]"
                  style={{
                    width: scale(r, r.reach),
                    background: `var(--s${slot})`,
                    opacity: 0.28,
                  }}
                  aria-hidden
                />
              )}
              <div
                className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-e-[4px]"
                style={{
                  width: scale(r, r.value),
                  background: over ? "var(--st-critical)" : `var(--s${slot})`,
                  opacity: hover === null || isHover ? 1 : 0.75,
                }}
                aria-hidden
              />
              {/* target tick, with a surface gap either side so it reads as a rule */}
              <div
                className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
                style={{
                  insetInlineStart: scale(r, r.target),
                  background: "var(--ink-2)",
                  boxShadow: "0 0 0 2px var(--surface)",
                }}
                aria-hidden
              />
            </div>


            {isHover && (
              <div
                role="tooltip"
                className="pointer-events-none absolute top-full end-0 z-20 mt-1 w-56 rounded-xl border border-line bg-surface p-3 shadow-pop"
              >
                <div className="text-xs font-semibold text-ink">{r.label}</div>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-0.5 w-3 shrink-0 rounded-full"
                      style={{
                        background: over
                          ? "var(--st-critical)"
                          : `var(--s${slot})`,
                      }}
                    />
                    <span className="tnum text-sm font-semibold text-ink">
                      {fmt(r.value)}
                    </span>
                    <span className="text-xs text-ink-3">{valueLabel}</span>
                  </li>
                  {r.reach !== undefined && reachLabel && (
                    <li className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-0.5 w-3 shrink-0 rounded-full"
                        style={{ background: `var(--s${slot})`, opacity: 0.4 }}
                      />
                      <span className="tnum text-sm font-semibold text-ink">
                        {fmt(r.reach)}
                      </span>
                      <span className="text-xs text-ink-3">{reachLabel}</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-0.5 w-3 shrink-0 rounded-full"
                      style={{ background: "var(--ink-2)" }}
                    />
                    <span className="tnum text-sm font-semibold text-ink">
                      {fmt(r.target)}
                    </span>
                    <span className="text-xs text-ink-3">{targetLabel}</span>
                  </li>
                </ul>
                {ofTarget && (
                  <p className="mt-2 text-xs text-ink-2">
                    {t(locale, "ofTimeAllowed").replace(
                      "{v}",
                      fmtPct((r.value / r.target) * 100, locale, 0),
                    )}
                  </p>
                )}
                {r.volumeLabel !== undefined && (
                  <p className="mt-2 border-t border-line pt-2 text-xs text-ink-2">
                    {r.volumeLabel}
                  </p>
                )}
                {over && (
                  <p className="mt-2 text-xs font-medium text-st-critical">
                    {t(locale, "overTargetBy").replace(
                      "{v}",
                      fmt(r.value - r.target),
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
