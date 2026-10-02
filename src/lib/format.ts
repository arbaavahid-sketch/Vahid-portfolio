import type { Locale } from "./i18n";

/**
 * Every formatter takes a locale. In Persian that means Persian digits and the
 * Jalali calendar, which `Intl` gives us for free — the alternative, a Latin
 * numeral sitting inside a Persian sentence, is the thing that makes a
 * translated dashboard look machine-made.
 */

const numLocale = (locale: Locale) => (locale === "fa" ? "fa-IR" : "en-GB");

export function fmtNum(n: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(numLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/** Compact form for stat tiles: 12,840 · 12.9K · ۱۲٫۹ هزار */
export function fmtCompact(n: number, locale: Locale): string {
  if (Math.abs(n) < 10_000) return fmtNum(n, locale);
  return new Intl.NumberFormat(numLocale(locale), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Persian writes the sign before the number: ٪۹۷٫۲ */
export function fmtPct(n: number, locale: Locale, digits = 1): string {
  const v = fmtNum(n, locale, digits);
  return locale === "fa" ? `٪${v}` : `${v}%`;
}

/**
 * Turnaround is always quoted in hours — a lab contract is written in hours,
 * and switching to days part-way up a chart makes two marks incomparable.
 */
export function fmtHours(h: number, locale: Locale): string {
  const v = Number.isInteger(h) ? fmtNum(h, locale) : fmtNum(h, locale, 1);
  return locale === "fa" ? `${v} ساعت` : `${v} h`;
}

/** Short axis form, where the unit is already in the card subtitle. */
export function fmtHoursShort(h: number, locale: Locale): string {
  const v = Number.isInteger(h) ? fmtNum(h, locale) : fmtNum(h, locale, 1);
  return locale === "fa" ? `${v}س` : `${v}h`;
}

/**
 * Money is held in millions of toman, which is the unit an Iranian management
 * report is actually written in. Past a thousand it reads as milliard.
 */
export function fmtMoney(millionToman: number, locale: Locale): string {
  if (Math.abs(millionToman) >= 1000) {
    const v = fmtNum(millionToman / 1000, locale, 1);
    return locale === "fa" ? `${v} میلیارد تومان` : `${v}bn toman`;
  }
  const v = fmtNum(millionToman, locale);
  return locale === "fa" ? `${v} میلیون تومان` : `${v}M toman`;
}

/** The same amount without the unit, for a tile that labels its own unit. */
export function fmtMoneyBare(millionToman: number, locale: Locale): string {
  if (Math.abs(millionToman) >= 1000) {
    return fmtNum(millionToman / 1000, locale, 1);
  }
  return fmtNum(millionToman, locale);
}

export function moneyUnit(millionToman: number, locale: Locale): string {
  if (Math.abs(millionToman) >= 1000) {
    return locale === "fa" ? "میلیارد تومان" : "bn toman";
  }
  return locale === "fa" ? "میلیون تومان" : "M toman";
}

/** Axis ticks: bare numbers, the unit lives in the subtitle. */
export function fmtMoneyAxis(millionToman: number, locale: Locale): string {
  if (Math.abs(millionToman) >= 1000) {
    return locale === "fa"
      ? fmtNum(millionToman, locale)
      : `${fmtNum(millionToman / 1000, locale, 1)}k`;
  }
  return fmtNum(millionToman, locale);
}

// ------------------------------------------------------------------- dates

function toDate(iso: string): Date {
  return new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
}

const dateLocale = (locale: Locale) =>
  locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB";

export function fmtDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    day: "numeric",
    month: locale === "fa" ? "long" : "short",
    year: "numeric",
  }).format(toDate(iso));
}

export function fmtDateShort(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    day: "numeric",
    month: "short",
  }).format(toDate(iso));
}

/** "Mehr 1405" / "Oct 2026" — for a month-by-month axis. */
export function fmtMonth(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    month: "short",
    year: locale === "fa" ? undefined : "2-digit",
  }).format(toDate(iso));
}

export function fmtMonthLong(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    month: "long",
    year: "numeric",
  }).format(toDate(iso));
}

/** Invoice periods are Gregorian months, even when their labels are Persian. */
export function fmtInvoiceMonth(period: string, locale: Locale): string {
  return new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR-u-ca-gregory" : "en-GB",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(new Date(`${period}-01T00:00:00Z`));
}

// ------------------------------------------------------------------ deltas

/** Signed delta for stat tiles. The minus is U+2212, not a hyphen. */
export function fmtDelta(
  n: number,
  locale: Locale,
  digits = 1,
  unit = "",
): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${fmtNum(Math.abs(n), locale, digits)}${unit}`;
}

export function fmtDeltaPct(n: number, locale: Locale, digits = 1): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const v = fmtNum(Math.abs(n), locale, digits);
  return locale === "fa" ? `${sign}٪${v}` : `${sign}${v}%`;
}

/** Whole days between `iso` and the dataset's "today". Negative = overdue. */
export function daysUntil(iso: string, today: string): number {
  const a = Date.parse(`${iso}T00:00:00Z`);
  const b = Date.parse(`${today}T00:00:00Z`);
  return Math.round((a - b) / 86_400_000);
}

// ------------------------------------------------------- chart formatters

/**
 * Charts are client components and cannot take a formatter function as a prop
 * from a server component, so they take one of these names and look the pair up
 * here. `axis` is terse enough for a tick; `value` is the readable form for
 * tooltips and direct labels.
 */
export type FormatKey = "number" | "hours" | "percent" | "money";

export const FORMATS: Record<
  FormatKey,
  {
    axis: (v: number, locale: Locale) => string;
    value: (v: number, locale: Locale) => string;
  }
> = {
  number: {
    axis: (v, l) => fmtNum(v, l),
    value: (v, l) => fmtNum(v, l),
  },
  hours: {
    axis: (v, l) => fmtHoursShort(v, l),
    value: (v, l) => fmtHours(v, l),
  },
  percent: {
    axis: (v, l) => fmtPct(v, l, 0),
    value: (v, l) => fmtPct(v, l, 1),
  },
  money: {
    axis: (v, l) => fmtMoneyAxis(v, l),
    value: (v, l) => fmtMoney(v, l),
  },
};
