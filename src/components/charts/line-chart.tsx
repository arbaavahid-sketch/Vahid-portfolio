"use client";

import { useState } from "react";
import { FORMATS, type FormatKey } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import {
  AxisLabels,
  ChartBox,
  ChartTooltip,
  Gridlines,
  ReferenceLine,
  makeY,
  niceScale,
  useBlurOnLeave,
  useKeyboardCursor,
  useMeasuredWidth,
  type TooltipState,
} from "./frame";

export type LineSeries = {
  key: string;
  label: string;
  /** Categorical slot, fixed per entity. Never reassigned by rank. */
  slot: number;
  values: number[];
};

/** Static chart padding, hoisted so it is not a fresh object every render. */
const PAD = { top: 16, right: 16, bottom: 26, left: 44 };

/**
 * Trend over time. One series gets an area wash; two or more rely on the
 * legend plus the crosshair readout, which lists every series at the hovered X
 * so the pointer never has to land on a line.
 */
export function LineChart({
  locale,
  series,
  xLabels,
  height = 240,
  format = "number",
  target,
  targetLabel,
  zeroBased = false,
  ariaLabel,
}: {
  locale: Locale;
  series: LineSeries[];
  xLabels: string[];
  height?: number;
  format?: FormatKey;
  target?: number;
  targetLabel?: string;
  zeroBased?: boolean;
  ariaLabel: string;
}) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>();
  const [tip, setTip] = useState<TooltipState>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const yFormat = (v: number) => FORMATS[format].axis(v, locale);
  const fmtValue = (v: number) => FORMATS[format].value(v, locale);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const n = xLabels.length;

  const allValues = series.flatMap((s) => s.values);
  if (target !== undefined) allValues.push(target);
  const scale = niceScale(
    Math.min(...allValues),
    Math.max(...allValues),
    5,
    { zeroBased },
  );

  const y = makeY(scale, PAD.top, PAD.top + plotH);
  const x = (i: number) =>
    PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);

  const show = (i: number) => {
      if (i < 0 || i >= n) {
        setTip(null);
        setCursor(null);
        return;
      }
      setCursor(i);
      setTip({
        x: x(i),
        y: PAD.top + 8,
        title: xLabels[i],
        rows: series.map((s) => ({
          label: s.label,
          value: fmtValue(s.values[i]),
          slot: s.slot,
        })),
    });
  };

  useBlurOnLeave(() => show(-1));
  const { handler } = useKeyboardCursor(n, show);

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    const i = Math.round(((px - PAD.left) / Math.max(1, plotW)) * (n - 1));
    show(Math.min(n - 1, Math.max(0, i)));
  };

  // Direct end-labels only when the series separate enough at the right edge;
  // nudging collided labels apart detaches them from their lines.
  const endLabels = (() => {
    if (n === 0) return [];
    const ends = series.map((s) => ({
      slot: s.slot,
      label: s.label,
      v: s.values[n - 1],
      yy: y(s.values[n - 1]),
    }));
    const sorted = [...ends].sort((a, b) => a.yy - b.yy);
    const collides = sorted.some(
      (p, i) => i > 0 && Math.abs(p.yy - sorted[i - 1].yy) < 15,
    );
    return collides ? [] : ends;
  })();

  const path = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");

  /**
   * Thin the x labels by the room actually available, not by a fixed count,
   * and only keep the final label when it clears the one before it — a last
   * label forced in on top of its neighbour is worse than no last label.
   */
  const step = n > 1 ? plotW / (n - 1) : plotW;
  const tickEvery = Math.max(1, Math.ceil(52 / Math.max(1, step)));
  const shown = new Set<number>();
  for (let i = 0; i < n; i += tickEvery) shown.add(i);
  if (n > 1) {
    const last = Math.max(...shown);
    if ((n - 1 - last) * step >= 52) shown.add(n - 1);
    else {
      shown.delete(last);
      shown.add(n - 1);
    }
  }

  return (
    <ChartBox>
      <div ref={ref}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={ariaLabel}
            tabIndex={0}
            onKeyDown={handler}
            onPointerMove={onPointerMove}
            onPointerLeave={() => show(-1)}
            onBlur={() => show(-1)}
            className="touch-pan-y outline-none focus-visible:rounded-lg"
          >
            <Gridlines
              ticks={scale.ticks}
              y={y}
              x0={PAD.left}
              x1={PAD.left + plotW}
            />
            <AxisLabels
              ticks={scale.ticks}
              y={y}
              x={PAD.left - 8}
              format={yFormat}
            />

            {/* x-axis labels, thinned so they never collide */}
            <g aria-hidden>
              {xLabels.map((l, i) =>
                shown.has(i) ? (
                  <text
                    key={l + i}
                    x={x(i)}
                    y={PAD.top + plotH + 16}
                    textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                    fontSize={11}
                    fill="var(--ink-3)"
                  >
                    {l}
                  </text>
                ) : null,
              )}
            </g>

            {target !== undefined && (
              <ReferenceLine
                value={target}
                y={y}
                x0={PAD.left}
                x1={PAD.left + plotW}
                label={targetLabel}
              />
            )}

            {/* Single series gets a 10% wash; multiples would muddy each other. */}
            {series.length === 1 && (
              <path
                d={`${path(series[0].values)} L${x(n - 1)},${PAD.top + plotH} L${x(0)},${
                  PAD.top + plotH
                } Z`}
                fill={`var(--s${series[0].slot})`}
                fillOpacity={0.1}
                aria-hidden
              />
            )}

            {series.map((s) => (
              <path
                key={s.key}
                d={path(s.values)}
                fill="none"
                stroke={`var(--s${s.slot})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              />
            ))}

            {/* crosshair */}
            {cursor !== null && (
              <g aria-hidden>
                <line
                  x1={x(cursor)}
                  x2={x(cursor)}
                  y1={PAD.top}
                  y2={PAD.top + plotH}
                  stroke="var(--axis)"
                  strokeWidth={1}
                />
                {series.map((s) => (
                  <circle
                    key={s.key}
                    cx={x(cursor)}
                    cy={y(s.values[cursor])}
                    r={4.5}
                    fill={`var(--s${s.slot})`}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                ))}
              </g>
            )}

            {/* end markers carry a 2px surface ring so they stay legible */}
            {n > 0 &&
              series.map((s) => (
                <circle
                  key={`end-${s.key}`}
                  cx={x(n - 1)}
                  cy={y(s.values[n - 1])}
                  r={4}
                  fill={`var(--s${s.slot})`}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  aria-hidden
                />
              ))}

            {endLabels.map((e) => (
              <text
                key={e.label}
                x={x(n - 1) - 8}
                y={e.yy - 10}
                textAnchor="end"
                fontSize={11.5}
                fontWeight={600}
                fill="var(--ink)"
                className="tnum"
                aria-hidden
              >
                {fmtValue(e.v)}
              </text>
            ))}
          </svg>
        )}
      </div>
      <ChartTooltip state={tip} containerWidth={width} />
    </ChartBox>
  );
}
