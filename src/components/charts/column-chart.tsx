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

/** Static chart padding, hoisted so it is not a fresh object every render. */
const PAD = { top: 14, right: 12, bottom: 26, left: 40 };

/** Square at the baseline, 4px rounded at the data end. */
export function columnPath(
  x: number,
  y: number,
  w: number,
  h: number,
  r = 4,
): string {
  const rr = Math.min(r, w / 2, Math.max(0, h));
  if (h <= 0.5) return "";
  return [
    `M${x},${y + h}`,
    `L${x},${y + rr}`,
    `Q${x},${y} ${x + rr},${y}`,
    `L${x + w - rr},${y}`,
    `Q${x + w},${y} ${x + w},${y + rr}`,
    `L${x + w},${y + h}`,
    "Z",
  ].join(" ");
}

export type Column = {
  label: string;
  value: number;
  /** Optional per-column note surfaced in the tooltip. */
  note?: string;
};

/**
 * Magnitude across one nominal dimension. One series, one colour — colouring
 * each column by its own height would burn the free channel on information the
 * column length already carries.
 */
export function ColumnChart({
  locale,
  data,
  slot = 1,
  height = 200,
  format = "number",
  valueLabel,
  emphasise,
  target,
  targetLabel,
  ariaLabel,
}: {
  locale: Locale;
  data: Column[];
  slot?: number;
  height?: number;
  format?: FormatKey;
  /** Name of the measure, shown beside the number in the tooltip. */
  valueLabel: string;
  /**
   * Index of the one column the story is about; the rest recede. Only use this
   * when a single column really is the point — dimming eleven bars to highlight
   * one misstates a story that is about several of them.
   */
  emphasise?: number;
  /** A named limit the columns are read against — not a gridline. */
  target?: number;
  targetLabel?: string;
  ariaLabel: string;
}) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>();
  const [tip, setTip] = useState<TooltipState>(null);
  const [active, setActive] = useState<number | null>(null);

  const yFormat = (v: number) => FORMATS[format].axis(v, locale);
  const vFormat = (v: number) => FORMATS[format].value(v, locale);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const n = data.length;

  const scale = niceScale(
    0,
    Math.max(...data.map((d) => d.value), target ?? 0),
    5,
    { zeroBased: true },
  );
  const y = makeY(scale, PAD.top, PAD.top + plotH);

  const band = n > 0 ? plotW / n : 0;
  // Cap the mark and keep a 2px surface gap between neighbours; the band's
  // leftover is air, not a wider bar.
  const barW = Math.max(2, Math.min(24, band - 2));

  const show = (i: number) => {
      if (i < 0 || i >= n) {
        setTip(null);
        setActive(null);
        return;
      }
      const d = data[i];
      setActive(i);
      setTip({
        x: PAD.left + i * band + band / 2,
        y: y(d.value) - 4,
        title: d.label,
        rows: [{ label: valueLabel, value: vFormat(d.value), slot }],
        note: d.note,
    });
  };

  useBlurOnLeave(() => show(-1));
  const { handler } = useKeyboardCursor(n, show);

  // Thin x labels only when they would actually collide, not by count.
  const tickEvery = Math.max(1, Math.ceil(52 / Math.max(1, band)));

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
            onPointerLeave={() => show(-1)}
            onBlur={() => show(-1)}
            className="outline-none"
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

            {data.map((d, i) => {
              const cx = PAD.left + i * band + band / 2;
              const top = y(d.value);
              const dim = emphasise !== undefined && emphasise !== i;
              return (
                <g key={d.label + i}>
                  <path
                    d={columnPath(cx - barW / 2, top, barW, PAD.top + plotH - top)}
                    fill={dim ? "var(--muted-mark)" : `var(--s${slot})`}
                    fillOpacity={active === null || active === i ? 1 : 0.72}
                    aria-hidden
                  />
                  {/* hit target spans the whole band, never only the painted pixels */}
                  <rect
                    x={PAD.left + i * band}
                    y={PAD.top}
                    width={band}
                    height={plotH}
                    fill="transparent"
                    onPointerEnter={() => show(i)}
                    onPointerMove={() => show(i)}
                  />
                </g>
              );
            })}

            {target !== undefined && (
              <ReferenceLine
                value={target}
                y={y}
                x0={PAD.left}
                x1={PAD.left + plotW}
                label={targetLabel}
              />
            )}

            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={PAD.top + plotH}
              y2={PAD.top + plotH}
              stroke="var(--axis)"
              strokeWidth={1}
              shapeRendering="crispEdges"
              aria-hidden
            />

            <g aria-hidden>
              {data.map((d, i) =>
                i % tickEvery === 0 || i === n - 1 ? (
                  <text
                    key={d.label + i}
                    x={PAD.left + i * band + band / 2}
                    y={PAD.top + plotH + 16}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--ink-3)"
                  >
                    {d.label}
                  </text>
                ) : null,
              )}
            </g>
          </svg>
        )}
      </div>
      <ChartTooltip state={tip} containerWidth={width} />
    </ChartBox>
  );
}
