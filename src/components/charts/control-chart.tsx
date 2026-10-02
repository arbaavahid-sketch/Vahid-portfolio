"use client";

import { useState } from "react";
import {
  ChartBox,
  ChartTooltip,
  makeY,
  useBlurOnLeave,
  useKeyboardCursor,
  useMeasuredWidth,
  type TooltipState,
} from "./frame";
import { fmtDate, fmtNum } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { QcPoint, WestgardRule } from "@/lib/demo/laboratory";
import { WESTGARD_RULES } from "@/lib/demo/laboratory";

/** Static chart padding, hoisted so it is not a fresh object every render. */
const PAD = { top: 16, right: 52, bottom: 30, left: 48 };

/**
 * A Levey-Jennings control chart: successive control results against a mean
 * and its 1, 2 and 3 SD limits. The 2 SD and 3 SD rules are warnings and
 * rejections, so those limits wear the reserved status colours; the control
 * results themselves stay in series slot 1.
 *
 * A flagged point changes shape as well as colour — a diamond for a warning,
 * a filled square for a rejection — so the state survives any colour vision.
 */
export function ControlChart({
  locale,
  points,
  mean,
  sd,
  unit,
  height = 280,
}: {
  locale: Locale;
  points: QcPoint[];
  mean: number;
  sd: number;
  unit: string;
  height?: number;
}) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>();
  const [tip, setTip] = useState<TooltipState>(null);
  const [cursor, setCursor] = useState<number | null>(null);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const n = points.length;

  const lo = mean - 4 * sd;
  const hi = mean + 4 * sd;
  const y = makeY({ min: lo, max: hi, ticks: [] }, PAD.top, PAD.top + plotH);
  const x = (i: number) =>
    PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);

  const show = (i: number) => {
      if (i < 0 || i >= n) {
        setTip(null);
        setCursor(null);
        return;
      }
      const p = points[i];
      const z = (p.value - mean) / sd;
      const rule = p.flag ? WESTGARD_RULES[p.flag] : undefined;
      setCursor(i);
      setTip({
        x: x(i),
        y: PAD.top + 6,
        title: `${t(locale, "qcRun")} ${fmtNum(p.run, locale)} · ${fmtDate(p.date, locale)}`,
        rows: [
          {
            label: unit,
            value: fmtNum(p.value, locale, 1),
            color: p.flag
              ? rule?.action === "reject"
                ? "var(--st-critical)"
                : "var(--st-warning)"
              : "var(--s1)",
          },
          {
            label: t(locale, "qcFromMean"),
            value: `${z > 0 ? "+" : "−"}${fmtNum(Math.abs(z), locale, 2)} SD`,
            color: "var(--ink-3)",
          },
        ],
        note: rule
          ? `${rule.label} — ${rule.meaning[locale]} ${analystLine(locale, p.analyst[locale])}`
          : analystLine(locale, p.analyst[locale]),
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

  const limits = [
    { k: 3, color: "var(--st-critical)", label: "+3 SD" },
    { k: 2, color: "var(--st-warning)", label: "+2 SD" },
    { k: 1, color: "var(--grid)", label: "+1 SD" },
    { k: -1, color: "var(--grid)", label: "−1 SD" },
    { k: -2, color: "var(--st-warning)", label: "−2 SD" },
    { k: -3, color: "var(--st-critical)", label: "−3 SD" },
  ];

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`)
    .join(" ");

  return (
    <ChartBox>
      <div ref={ref}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={t(locale, "qcChartAria")
              .replace("{n}", fmtNum(n, locale))
              .replace("{mean}", fmtNum(mean, locale, 1))
              .replace("{unit}", unit)
              .replace("{sd}", fmtNum(sd, locale, 1))}
            tabIndex={0}
            onKeyDown={handler}
            onPointerMove={onPointerMove}
            onPointerLeave={() => show(-1)}
            onBlur={() => show(-1)}
            className="touch-pan-y outline-none"
          >
            {/* ±1 SD band: where results are expected to sit */}
            <rect
              x={PAD.left}
              y={y(mean + sd)}
              width={plotW}
              height={Math.max(0, y(mean - sd) - y(mean + sd))}
              fill="var(--s1)"
              fillOpacity={0.07}
              aria-hidden
            />

            {limits.map((l) => (
              <g key={l.label}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotW}
                  y1={y(mean + l.k * sd)}
                  y2={y(mean + l.k * sd)}
                  stroke={l.color}
                  strokeWidth={Math.abs(l.k) === 1 ? 1 : 1.5}
                  aria-hidden
                />
                <text
                  x={PAD.left + plotW + 6}
                  y={y(mean + l.k * sd)}
                  dy="0.32em"
                  fontSize={10.5}
                  fontWeight={Math.abs(l.k) === 1 ? 400 : 600}
                  fill="var(--ink-3)"
                  aria-hidden
                >
                  {l.label}
                </text>
              </g>
            ))}

            {/* the mean */}
            <line
              x1={PAD.left}
              x2={PAD.left + plotW}
              y1={y(mean)}
              y2={y(mean)}
              stroke="var(--ink-2)"
              strokeWidth={1.5}
              aria-hidden
            />
            <text
              x={PAD.left + plotW + 6}
              y={y(mean)}
              dy="0.32em"
              fontSize={10.5}
              fontWeight={600}
              fill="var(--ink-2)"
              aria-hidden
            >
              {t(locale, "qcMean")}
            </text>

            {/* left axis: the value at each SD step */}
            <g aria-hidden>
              {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
                <text
                  key={k}
                  x={PAD.left - 8}
                  y={y(mean + k * sd)}
                  dy="0.32em"
                  textAnchor="end"
                  fontSize={11}
                  className="tnum"
                  fill="var(--ink-3)"
                >
                  {fmtNum(mean + k * sd, locale, 1)}
                </text>
              ))}
            </g>

            {cursor !== null && (
              <line
                x1={x(cursor)}
                x2={x(cursor)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="var(--axis)"
                strokeWidth={1}
                aria-hidden
              />
            )}

            <path
              d={path}
              fill="none"
              stroke="var(--s1)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            />

            {points.map((p, i) => (
              <Marker
                key={p.run}
                cx={x(i)}
                cy={y(p.value)}
                flag={p.flag}
                active={cursor === i}
              />
            ))}

            {/* run numbers along the bottom */}
            <g aria-hidden>
              {points.map((p, i) =>
                i % 2 === 0 || i === n - 1 ? (
                  <text
                    key={p.run}
                    x={x(i)}
                    y={PAD.top + plotH + 18}
                    textAnchor="middle"
                    fontSize={10.5}
                    className="tnum"
                    fill="var(--ink-3)"
                  >
                    {fmtNum(p.run, locale)}
                  </text>
                ) : null,
              )}
            </g>

            {/* a transparent hit band per run, well above the 24px minimum */}
            {points.map((p, i) => (
              <rect
                key={`hit-${p.run}`}
                x={x(i) - Math.max(12, plotW / Math.max(1, n) / 2)}
                y={PAD.top}
                width={Math.max(24, plotW / Math.max(1, n))}
                height={plotH}
                fill="transparent"
                onPointerEnter={() => show(i)}
              />
            ))}
          </svg>
        )}
      </div>
      <ChartTooltip state={tip} containerWidth={width} />
    </ChartBox>
  );
}

/** Shape carries the flag as well as colour: circle, diamond, square. */
function Marker({
  cx,
  cy,
  flag,
  active,
}: {
  cx: number;
  cy: number;
  flag?: WestgardRule;
  active: boolean;
}) {
  const ring = { stroke: "var(--surface)", strokeWidth: 2 };
  if (!flag) {
    return (
      <circle cx={cx} cy={cy} r={active ? 5 : 4} fill="var(--s1)" {...ring} />
    );
  }
  const reject = WESTGARD_RULES[flag].action === "reject";
  const fill = reject ? "var(--st-critical)" : "var(--st-warning)";
  const s = 6;
  if (reject) {
    return (
      <rect
        x={cx - s}
        y={cy - s}
        width={s * 2}
        height={s * 2}
        rx={1.5}
        fill={fill}
        {...ring}
      />
    );
  }
  return (
    <polygon
      points={`${cx},${cy - s - 1} ${cx + s + 1},${cy} ${cx},${cy + s + 1} ${cx - s - 1},${cy}`}
      fill={fill}
      {...ring}
    />
  );
}

/** "Analyst N. Rahmani." / «کارشناس: ن. رحمانی» */
function analystLine(locale: Locale, analyst: string): string {
  return locale === "fa" ? `کارشناس: ${analyst}` : `Analyst ${analyst}.`;
}
