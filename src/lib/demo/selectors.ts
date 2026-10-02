/**
 * Every figure the dashboard shows is derived from the dataset here rather than
 * written out a second time, so no two pages can disagree about the same number.
 */

import {
  BACKLOG,
  DAILY,
  INSTRUMENTS,
  QC_CHART,
  QC_SUMMARY,
  TAT_TARGET_HOURS,
  TEST_TAT,
  TODAY,
  WORKLOAD,
  type DayPoint,
  type Instrument,
} from "./laboratory";
import { daysUntil } from "../format";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export const today: DayPoint = DAILY[DAILY.length - 1];

/** The 29 complete days before today — the baseline a daily figure is read against. */
const priorDays = DAILY.slice(0, -1);

export const activeSamples = BACKLOG.reduce((a, b) => a + b.count, 0);

export const onHold =
  BACKLOG.find((b) => b.status === "on-hold")?.count ?? 0;

export const medianTat30d = median(DAILY.map((d) => d.medianTat));
export const medianTatPrior = median(priorDays.map((d) => d.medianTat));
export const tatDelta = today.medianTat - medianTatPrior;

export const onTime30d =
  DAILY.reduce((a, d) => a + d.onTimePct * d.reported, 0) /
  DAILY.reduce((a, d) => a + d.reported, 0);
export const onTimePrior =
  priorDays.reduce((a, d) => a + d.onTimePct * d.reported, 0) /
  priorDays.reduce((a, d) => a + d.reported, 0);
export const onTimeDelta = today.onTimePct - onTimePrior;

export const reports30d = DAILY.reduce((a, d) => a + d.reported, 0);
export const received30d = DAILY.reduce((a, d) => a + d.received, 0);

// ------------------------------------------------------------- instruments

export const instrumentsTotal = INSTRUMENTS.length;
export const instrumentsOperational = INSTRUMENTS.filter(
  (i) => i.state === "operational",
).length;
export const instrumentsDown = INSTRUMENTS.filter(
  (i) => i.state !== "operational",
);

export const meanUptime =
  INSTRUMENTS.reduce((a, i) => a + i.uptime30d, 0) / INSTRUMENTS.length;

/** Calibrations due within `days`, soonest first. Negative days = overdue. */
export function calibrationsDue(days = 7): Instrument[] {
  return INSTRUMENTS.filter(
    (i) => daysUntil(i.nextCalibration, TODAY) <= days,
  ).sort(
    (a, b) =>
      daysUntil(a.nextCalibration, TODAY) - daysUntil(b.nextCalibration, TODAY),
  );
}

/** Lapsed already — counted separately so neither number double-counts. */
export const calibrationsOverdue = INSTRUMENTS.filter(
  (i) => daysUntil(i.nextCalibration, TODAY) < 0,
);

/** Falling due inside the week, soonest first, excluding the lapsed ones. */
export const calibrationsDueSoon = calibrationsDue(7).filter(
  (i) => daysUntil(i.nextCalibration, TODAY) >= 0,
);

// ----------------------------------------------------------------- quality

export const qcRuns = QC_SUMMARY.reduce((a, q) => a + q.runs, 0);
export const qcPassed = QC_SUMMARY.reduce((a, q) => a + q.passed, 0);
export const qcWarnings = QC_SUMMARY.reduce((a, q) => a + q.warnings, 0);
export const qcRejected = QC_SUMMARY.reduce((a, q) => a + q.rejected, 0);
export const qcPassRate = (qcPassed / qcRuns) * 100;

export const qcFlagged = QC_CHART.points.filter((p) => p.flag);

/** Observed scatter of the control results against the characterised SD. */
export const qcObservedSd = (() => {
  const vals = QC_CHART.points.map((p) => p.value);
  const m = vals.reduce((a, v) => a + v, 0) / vals.length;
  const variance =
    vals.reduce((a, v) => a + (v - m) ** 2, 0) / (vals.length - 1);
  return { mean: m, sd: Math.sqrt(variance) };
})();

/** Coefficient of variation — the number a lab quotes for method precision. */
export const qcCv = (qcObservedSd.sd / qcObservedSd.mean) * 100;

// --------------------------------------------------------------- turnaround

export const testsOverTarget = TEST_TAT.filter(
  (t) => t.medianHours > t.targetHours,
);

export const testsVolume30d = TEST_TAT.reduce((a, t) => a + t.volume, 0);

/** Share of the last 30 days whose median sat at or under the commitment. */
export const daysWithinTarget =
  (DAILY.filter((d) => d.medianTat <= TAT_TARGET_HOURS).length / DAILY.length) *
  100;

/**
 * The start of the current unbroken run at or under the commitment — the one
 * date the overview can claim without hand-counting working days.
 */
export const underTargetSince = (() => {
  let start: string | null = null;
  for (let i = DAILY.length - 1; i >= 0; i -= 1) {
    if (DAILY[i].medianTat <= TAT_TARGET_HOURS) start = DAILY[i].date;
    else break;
  }
  return start;
})();

export const peakTatDay = [...DAILY].sort(
  (a, b) => b.medianTat - a.medianTat,
)[0];

export const worstTat = [...TEST_TAT].sort(
  (a, b) => b.medianHours / b.targetHours - a.medianHours / a.targetHours,
)[0];

// ---------------------------------------------------------------- workload

export const workloadTotal = WORKLOAD.reduce((a, w) => a + w.active, 0);

export const busiestDepartment = [...WORKLOAD].sort(
  (a, b) => b.active - a.active,
)[0];
