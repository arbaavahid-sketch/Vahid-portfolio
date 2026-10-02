"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Charts render at measured pixel width rather than scaling a fixed viewBox,
 * so axis text stays at its intended size instead of shrinking with the card.
 */
export function useMeasuredWidth<T extends HTMLElement>(): [
  RefObject<T | null>,
  number,
] {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    setWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}

// ------------------------------------------------------------------- scales

export type Scale = {
  min: number;
  max: number;
  ticks: number[];
};

/** Round an axis out to clean numbers (0 / 10 / 20 …). */
export function niceScale(
  dataMin: number,
  dataMax: number,
  targetTicks = 5,
  { zeroBased = false }: { zeroBased?: boolean } = {},
): Scale {
  let lo = zeroBased ? Math.min(0, dataMin) : dataMin;
  let hi = dataMax;
  if (hi === lo) hi = lo + 1;

  const rawStep = (hi - lo) / Math.max(1, targetTicks - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;

  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;

  const ticks: number[] = [];
  // Accumulate in integer steps to avoid float drift on fractional steps.
  for (let i = 0; lo + i * step <= hi + step / 1e6; i += 1) {
    ticks.push(Number((lo + i * step).toPrecision(12)));
  }
  return { min: lo, max: hi, ticks };
}

export function makeY(scale: Scale, top: number, bottom: number) {
  const span = scale.max - scale.min || 1;
  return (v: number) => bottom - ((v - scale.min) / span) * (bottom - top);
}

// ------------------------------------------------------------------ gridlines

/** Hairline, solid, one step off the surface. Never dashed. */
export function Gridlines({
  ticks,
  y,
  x0,
  x1,
}: {
  ticks: number[];
  y: (v: number) => number;
  x0: number;
  x1: number;
}) {
  return (
    <g aria-hidden>
      {ticks.map((t) => (
        <line
          key={t}
          x1={x0}
          x2={x1}
          y1={y(t)}
          y2={y(t)}
          stroke="var(--grid)"
          strokeWidth={1}
          shapeRendering="crispEdges"
        />
      ))}
    </g>
  );
}

export function AxisLabels({
  ticks,
  y,
  x,
  format,
}: {
  ticks: number[];
  y: (v: number) => number;
  x: number;
  format: (v: number) => string;
}) {
  return (
    <g aria-hidden>
      {ticks.map((t) => (
        <text
          key={t}
          x={x}
          y={y(t)}
          dy="0.32em"
          textAnchor="end"
          className="tnum"
          fontSize={11}
          fill="var(--ink-3)"
        >
          {format(t)}
        </text>
      ))}
    </g>
  );
}

/** A named reference line — a target or a limit, not a gridline. */
export function ReferenceLine({
  value,
  y,
  x0,
  x1,
  label,
  color = "var(--st-serious)",
}: {
  value: number;
  y: (v: number) => number;
  x0: number;
  x1: number;
  label?: string;
  color?: string;
}) {
  const yy = y(value);
  return (
    <g aria-hidden>
      <line
        x1={x0}
        x2={x1}
        y1={yy}
        y2={yy}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.9}
      />
      {/* The label sits at the left edge: direct end-labels always ride the
          right edge, and the two collide there whenever a series finishes near
          its own target — which is exactly when both matter most. */}
      {label && (
        <text
          x={x0 + 3}
          y={yy - 5}
          textAnchor="start"
          fontSize={10.5}
          fontWeight={600}
          fill="var(--ink-2)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// -------------------------------------------------------------------- tooltip

export type TooltipRow = {
  label: string;
  value: string;
  /** Series slot for the line key, or a raw colour. */
  slot?: number;
  color?: string;
};

export type TooltipState = {
  x: number;
  y: number;
  title: string;
  rows: TooltipRow[];
  note?: string;
} | null;

/**
 * Values lead, labels follow — the reader already has the series and wants the
 * number. Series are keyed with a short stroke, not a filled box.
 */
export function ChartTooltip({
  state,
  containerWidth,
}: {
  state: TooltipState;
  containerWidth: number;
}) {
  if (!state) return null;
  const W = 210;
  const flip = state.x + W + 16 > containerWidth;
  const left = flip ? state.x - W - 12 : state.x + 12;

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 rounded-xl border border-line bg-surface p-3 shadow-pop"
      style={{
        width: W,
        left: Math.max(0, left),
        top: Math.max(0, state.y - 12),
      }}
    >
      <div className="text-xs font-semibold text-ink">{state.title}</div>
      <ul className="mt-2 space-y-1.5">
        {state.rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{
                background: r.color ?? `var(--s${r.slot ?? 1})`,
              }}
            />
            <span className="tnum text-sm font-semibold text-ink">
              {r.value}
            </span>
            <span className="truncate text-xs text-ink-3">{r.label}</span>
          </li>
        ))}
      </ul>
      {state.note && (
        <p className="mt-2 border-t border-line pt-2 text-xs leading-snug text-ink-2">
          {state.note}
        </p>
      )}
    </div>
  );
}

/** Wraps a chart so the tooltip can position against the same box. */
export function ChartBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-chart className={`relative ${className ?? ""}`}>
      {children}
    </div>
  );
}

/**
 * Keyboard parity: Arrow keys walk the marks, Escape clears, so focus shows
 * the same readout as hover.
 */
export function useKeyboardCursor(count: number, onMove: (i: number) => void) {
  const [index, setIndex] = useState<number | null>(null);

  const handler = useCallback(
    (e: React.KeyboardEvent) => {
      if (count === 0) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next =
          index === null
            ? dir > 0
              ? 0
              : count - 1
            : Math.min(count - 1, Math.max(0, index + dir));
        setIndex(next);
        onMove(next);
      } else if (e.key === "Escape") {
        setIndex(null);
        onMove(-1);
      }
    },
    [count, index, onMove],
  );

  return { index, setIndex, handler };
}

/**
 * Clears a hover readout when the pointer leaves the window entirely. The
 * callback is held in a ref so the listener is attached once, not on every
 * render of the chart that owns it.
 */
export function useBlurOnLeave(clear: () => void) {
  const latest = useRef(clear);

  useEffect(() => {
    latest.current = clear;
  });

  useEffect(() => {
    const onLeave = () => latest.current();
    window.addEventListener("blur", onLeave);
    return () => window.removeEventListener("blur", onLeave);
  }, []);
}
