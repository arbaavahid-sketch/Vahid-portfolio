/**
 * Synthetic dataset for the Laboratory Dashboard demo.
 *
 * Every company, person, sample and reading below is invented. No real client
 * data, no live Google Sheet, no API — the numbers are hard-coded here so the
 * demo is safe to show to anyone and renders identically every time.
 *
 * Names carry both languages on the record itself rather than in the interface
 * dictionary: a customer name is data, not a label.
 */

import type { I18nText } from "../i18n";

/** The dataset's "today". Fixed so the demo never drifts or looks stale. */
export const TODAY = "2026-09-24";

export const LAB = {
  name: {
    fa: "آزمایشگاه تحلیلی پارسان",
    en: "Parsan Analytical Laboratory",
  } satisfies I18nText,
  accreditation: "ISO/IEC 17025:2017",
} as const;

// ---------------------------------------------------------------- departments

export type DepartmentKey =
  | "chromatography"
  | "spectroscopy"
  | "wet-chemistry"
  | "physical"
  | "microbiology";

export const DEPARTMENTS: {
  key: DepartmentKey;
  name: I18nText;
  /** Categorical slot, 1-indexed. Fixed per department — never by rank. */
  slot: 1 | 2 | 3 | 4 | 5 | 6;
}[] = [
  {
    key: "chromatography",
    name: { fa: "کروماتوگرافی", en: "Chromatography" },
    slot: 1,
  },
  {
    key: "spectroscopy",
    name: { fa: "طیف‌سنجی", en: "Spectroscopy" },
    slot: 2,
  },
  {
    key: "wet-chemistry",
    name: { fa: "شیمی تر", en: "Wet chemistry" },
    slot: 3,
  },
  {
    key: "physical",
    name: { fa: "آزمون فیزیکی", en: "Physical testing" },
    slot: 4,
  },
  {
    key: "microbiology",
    name: { fa: "میکروبیولوژی", en: "Microbiology" },
    slot: 5,
  },
];

export function departmentName(key: DepartmentKey): I18nText {
  return (
    DEPARTMENTS.find((d) => d.key === key)?.name ?? { fa: key, en: key }
  );
}

export function departmentSlot(key: DepartmentKey): number {
  return DEPARTMENTS.find((d) => d.key === key)?.slot ?? 1;
}

// ------------------------------------------------------------------- samples

export type SampleStatus =
  | "received"
  | "preparation"
  | "testing"
  | "review"
  | "reported"
  | "on-hold";

export const SAMPLE_STATUS_LABEL: Record<SampleStatus, I18nText> = {
  received: { fa: "دریافت‌شده", en: "Received" },
  preparation: { fa: "آماده‌سازی", en: "In preparation" },
  testing: { fa: "در حال آزمون", en: "Under test" },
  review: { fa: "بازبینی فنی", en: "Technical review" },
  reported: { fa: "گزارش‌شده", en: "Reported" },
  "on-hold": { fa: "متوقف", en: "On hold" },
};

export type Priority = "routine" | "urgent" | "critical";

export const PRIORITY_LABEL: Record<Priority, I18nText> = {
  routine: { fa: "عادی", en: "Routine" },
  urgent: { fa: "فوری", en: "Urgent" },
  critical: { fa: "بحرانی", en: "Critical" },
};

export type Sample = {
  id: string;
  client: I18nText;
  matrix: I18nText;
  department: DepartmentKey;
  tests: number;
  status: SampleStatus;
  priority: Priority;
  receivedAt: string;
  /** Contractual report date. */
  dueAt: string;
  /** Hours elapsed since login. Drives the TAT-against-target read. */
  elapsedHours: number;
  targetHours: number;
  analyst: I18nText;
};

const ANALYSTS = {
  soltani: { fa: "ر. سلطانی", en: "R. Soltani" },
  dadashi: { fa: "م. داداشی", en: "M. Dadashi" },
  ahmadpour: { fa: "س. احمدپور", en: "S. Ahmadpour" },
  rahmani: { fa: "ن. رحمانی", en: "N. Rahmani" },
  bayat: { fa: "ح. بیات", en: "H. Bayat" },
  kazemi: { fa: "ف. کاظمی", en: "F. Kazemi" },
  mirzaei: { fa: "ا. میرزایی", en: "A. Mirzaei" },
  unassigned: { fa: "تخصیص‌نیافته", en: "Unassigned" },
} satisfies Record<string, I18nText>;

const CLIENTS = {
  arvandan: { fa: "پلیمر اروندان", en: "Arvandan Polymer Co." },
  setareh: { fa: "پالایش ستاره", en: "Setareh Refining Co." },
  mehrgan: { fa: "صنایع شیمیایی مهرگان", en: "Mehrgan Chemical Industries" },
  kavir: { fa: "روغن کویر", en: "Kavir Lube Oil Co." },
  tandis: { fa: "پلیمرهای تندیس", en: "Tandis Polymers" },
  borna: { fa: "برنا پترو", en: "Borna Petro Co." },
  nilgoon: { fa: "شیمیایی نیلگون", en: "Nilgoon Chemicals" },
} satisfies Record<string, I18nText>;

export const SAMPLES: Sample[] = [
  {
    id: "SMP-26-4412",
    client: CLIENTS.arvandan,
    matrix: { fa: "گرانول پلی‌پروپیلن", en: "Polypropylene granule" },
    department: "chromatography",
    tests: 6,
    status: "testing",
    priority: "urgent",
    receivedAt: "2026-09-23",
    dueAt: "2026-09-25",
    elapsedHours: 19,
    targetHours: 48,
    analyst: ANALYSTS.soltani,
  },
  {
    id: "SMP-26-4411",
    client: CLIENTS.setareh,
    matrix: { fa: "گازوئیل", en: "Gas oil" },
    department: "physical",
    tests: 8,
    status: "review",
    priority: "routine",
    receivedAt: "2026-09-22",
    dueAt: "2026-09-25",
    elapsedHours: 41,
    targetHours: 72,
    analyst: ANALYSTS.dadashi,
  },
  {
    id: "SMP-26-4410",
    client: CLIENTS.mehrgan,
    matrix: { fa: "روغن پایه SN-500", en: "Base oil SN-500" },
    department: "wet-chemistry",
    tests: 5,
    status: "testing",
    priority: "routine",
    receivedAt: "2026-09-22",
    dueAt: "2026-09-26",
    elapsedHours: 44,
    targetHours: 72,
    analyst: ANALYSTS.ahmadpour,
  },
  {
    id: "SMP-26-4409",
    client: CLIENTS.kavir,
    matrix: { fa: "روغن موتور کارکرده", en: "Used engine oil" },
    department: "spectroscopy",
    tests: 12,
    status: "testing",
    priority: "critical",
    receivedAt: "2026-09-23",
    dueAt: "2026-09-24",
    elapsedHours: 22,
    targetHours: 24,
    analyst: ANALYSTS.rahmani,
  },
  {
    id: "SMP-26-4408",
    client: CLIENTS.tandis,
    matrix: { fa: "پلی‌اتیلن سنگین", en: "HDPE pellet" },
    department: "physical",
    tests: 4,
    status: "preparation",
    priority: "routine",
    receivedAt: "2026-09-24",
    dueAt: "2026-09-28",
    elapsedHours: 5,
    targetHours: 72,
    analyst: ANALYSTS.bayat,
  },
  {
    id: "SMP-26-4407",
    client: CLIENTS.borna,
    matrix: { fa: "نفتای سبک", en: "Light naphtha" },
    department: "chromatography",
    tests: 7,
    status: "review",
    priority: "urgent",
    receivedAt: "2026-09-22",
    dueAt: "2026-09-24",
    elapsedHours: 46,
    targetHours: 48,
    analyst: ANALYSTS.soltani,
  },
  {
    id: "SMP-26-4406",
    client: CLIENTS.nilgoon,
    matrix: { fa: "محلول سود سوزآور", en: "Caustic soda solution" },
    department: "wet-chemistry",
    tests: 3,
    status: "on-hold",
    priority: "routine",
    receivedAt: "2026-09-21",
    dueAt: "2026-09-25",
    elapsedHours: 68,
    targetHours: 72,
    analyst: ANALYSTS.ahmadpour,
  },
  {
    id: "SMP-26-4405",
    client: CLIENTS.setareh,
    matrix: { fa: "نفت سفید", en: "Kerosene" },
    department: "physical",
    tests: 9,
    status: "reported",
    priority: "routine",
    receivedAt: "2026-09-20",
    dueAt: "2026-09-24",
    elapsedHours: 58,
    targetHours: 72,
    analyst: ANALYSTS.dadashi,
  },
  {
    id: "SMP-26-4404",
    client: CLIENTS.arvandan,
    matrix: { fa: "آب فرایند", en: "Process water" },
    department: "microbiology",
    tests: 4,
    status: "testing",
    priority: "routine",
    receivedAt: "2026-09-21",
    dueAt: "2026-09-27",
    elapsedHours: 71,
    targetHours: 120,
    analyst: ANALYSTS.kazemi,
  },
  {
    id: "SMP-26-4403",
    client: CLIENTS.kavir,
    matrix: { fa: "روغن هیدرولیک", en: "Hydraulic oil" },
    department: "spectroscopy",
    tests: 10,
    status: "reported",
    priority: "urgent",
    receivedAt: "2026-09-20",
    dueAt: "2026-09-22",
    elapsedHours: 44,
    targetHours: 48,
    analyst: ANALYSTS.rahmani,
  },
  {
    id: "SMP-26-4402",
    client: CLIENTS.mehrgan,
    matrix: { fa: "مخلوط حلال", en: "Solvent blend" },
    department: "chromatography",
    tests: 5,
    status: "reported",
    priority: "routine",
    receivedAt: "2026-09-19",
    dueAt: "2026-09-23",
    elapsedHours: 79,
    targetHours: 72,
    analyst: ANALYSTS.soltani,
  },
  {
    id: "SMP-26-4401",
    client: CLIENTS.tandis,
    matrix: { fa: "مستربچ", en: "Masterbatch" },
    department: "spectroscopy",
    tests: 6,
    status: "received",
    priority: "routine",
    receivedAt: "2026-09-24",
    dueAt: "2026-09-29",
    elapsedHours: 2,
    targetHours: 96,
    analyst: ANALYSTS.unassigned,
  },
  {
    id: "SMP-26-4400",
    client: CLIENTS.borna,
    matrix: { fa: "نفت کوره ۳۸۰", en: "Fuel oil 380" },
    department: "wet-chemistry",
    tests: 7,
    status: "review",
    priority: "routine",
    receivedAt: "2026-09-21",
    dueAt: "2026-09-25",
    elapsedHours: 66,
    targetHours: 72,
    analyst: ANALYSTS.ahmadpour,
  },
  {
    id: "SMP-26-4399",
    client: CLIENTS.nilgoon,
    matrix: { fa: "اسید سولفوریک ۹۸٪", en: "Sulphuric acid 98%" },
    department: "wet-chemistry",
    tests: 2,
    status: "reported",
    priority: "critical",
    receivedAt: "2026-09-23",
    dueAt: "2026-09-24",
    elapsedHours: 17,
    targetHours: 24,
    analyst: ANALYSTS.ahmadpour,
  },
  {
    id: "SMP-26-4398",
    client: CLIENTS.setareh,
    matrix: { fa: "قیر ۶۰/۷۰", en: "Bitumen 60/70" },
    department: "physical",
    tests: 6,
    status: "testing",
    priority: "routine",
    receivedAt: "2026-09-22",
    dueAt: "2026-09-28",
    elapsedHours: 47,
    targetHours: 120,
    analyst: ANALYSTS.bayat,
  },
  {
    id: "SMP-26-4397",
    client: CLIENTS.arvandan,
    matrix: { fa: "آب برج خنک‌کننده", en: "Cooling tower water" },
    department: "microbiology",
    tests: 3,
    status: "testing",
    priority: "routine",
    receivedAt: "2026-09-20",
    dueAt: "2026-09-26",
    elapsedHours: 94,
    targetHours: 120,
    analyst: ANALYSTS.kazemi,
  },
  {
    id: "SMP-26-4396",
    client: CLIENTS.kavir,
    matrix: { fa: "روغن دنده EP-220", en: "Gear oil EP-220" },
    department: "spectroscopy",
    tests: 8,
    status: "reported",
    priority: "routine",
    receivedAt: "2026-09-18",
    dueAt: "2026-09-22",
    elapsedHours: 69,
    targetHours: 72,
    analyst: ANALYSTS.rahmani,
  },
  {
    id: "SMP-26-4395",
    client: CLIENTS.borna,
    matrix: { fa: "نفتای سنگین", en: "Heavy naphtha" },
    department: "chromatography",
    tests: 7,
    status: "reported",
    priority: "urgent",
    receivedAt: "2026-09-18",
    dueAt: "2026-09-20",
    elapsedHours: 51,
    targetHours: 48,
    analyst: ANALYSTS.soltani,
  },
];

/**
 * The register above is the most recent 18 registrations, not the whole book.
 * Lab-wide figures come from here so the overview and the sample list cannot
 * contradict each other.
 */
export const BACKLOG: { status: SampleStatus; count: number }[] = [
  { status: "received", count: 18 },
  { status: "preparation", count: 24 },
  { status: "testing", count: 51 },
  { status: "review", count: 19 },
  { status: "on-hold", count: 4 },
];

/** Active samples per department. Sums to the same total as BACKLOG. */
export const WORKLOAD: { department: DepartmentKey; active: number }[] = [
  { department: "chromatography", active: 24 },
  { department: "spectroscopy", active: 31 },
  { department: "wet-chemistry", active: 22 },
  { department: "physical", active: 29 },
  { department: "microbiology", active: 10 },
];

// --------------------------------------------------------------- instruments

export type InstrumentState = "operational" | "maintenance" | "out-of-service";

export const INSTRUMENT_STATE_LABEL: Record<InstrumentState, I18nText> = {
  operational: { fa: "در سرویس", en: "Operational" },
  maintenance: { fa: "در تعمیر", en: "In maintenance" },
  "out-of-service": { fa: "خارج از سرویس", en: "Out of service" },
};

export type Instrument = {
  id: string;
  name: I18nText;
  model: string;
  department: DepartmentKey;
  state: InstrumentState;
  /** Utilisation over the last 30 days, percent of available shift hours. */
  utilisation: number;
  uptime30d: number;
  lastCalibration: string;
  nextCalibration: string;
  /** Months between scheduled calibrations. 0 = weekly in-house check. */
  intervalMonths: number;
  note?: I18nText;
};

export const INSTRUMENTS: Instrument[] = [
  {
    id: "GC-01",
    name: { fa: "کروماتوگراف گازی", en: "Gas chromatograph" },
    model: "GC-2030 FID/TCD",
    department: "chromatography",
    state: "operational",
    utilisation: 87,
    uptime30d: 99.1,
    lastCalibration: "2026-07-14",
    nextCalibration: "2027-01-14",
    intervalMonths: 6,
  },
  {
    id: "GC-02",
    name: { fa: "کروماتوگراف گازی", en: "Gas chromatograph" },
    model: "GC-2010 Plus",
    department: "chromatography",
    state: "maintenance",
    utilisation: 41,
    uptime30d: 82.4,
    lastCalibration: "2026-06-02",
    nextCalibration: "2026-10-02",
    intervalMonths: 4,
    note: {
      fa: "تعویض سپتوم و لاینر؛ بازسازی ستون در جریان است.",
      en: "Septum and liner replacement; column reconditioning in progress.",
    },
  },
  {
    id: "HPLC-01",
    name: { fa: "کروماتوگراف مایع", en: "Liquid chromatograph" },
    model: "UltiMate 3000 UHPLC",
    department: "chromatography",
    state: "operational",
    utilisation: 63,
    uptime30d: 97.8,
    lastCalibration: "2026-08-20",
    nextCalibration: "2027-02-20",
    intervalMonths: 6,
  },
  {
    id: "ICP-01",
    name: { fa: "ICP-OES", en: "ICP-OES" },
    model: "Avio 5800",
    department: "spectroscopy",
    state: "operational",
    utilisation: 91,
    uptime30d: 98.6,
    lastCalibration: "2026-09-01",
    nextCalibration: "2026-10-01",
    intervalMonths: 1,
    note: {
      fa: "دورهٔ یک‌ماهه: پنل فلزات سایشی پرحجم‌ترین روش آزمایشگاه است.",
      en: "Monthly interval: the wear-metals panel is the lab's highest-volume method.",
    },
  },
  {
    id: "FTIR-01",
    name: { fa: "طیف‌سنج FT-IR", en: "FT-IR spectrometer" },
    model: "Spectrum Two",
    department: "spectroscopy",
    state: "operational",
    utilisation: 54,
    uptime30d: 100,
    lastCalibration: "2026-04-11",
    nextCalibration: "2026-10-11",
    intervalMonths: 6,
  },
  {
    id: "UV-01",
    name: { fa: "اسپکتروفتومتر UV-Vis", en: "UV-Vis spectrophotometer" },
    model: "Lambda 365",
    department: "spectroscopy",
    state: "operational",
    utilisation: 38,
    uptime30d: 99.9,
    lastCalibration: "2026-03-28",
    nextCalibration: "2026-09-28",
    intervalMonths: 6,
  },
  {
    id: "KF-01",
    name: { fa: "تیتراتور کارل فیشر", en: "Karl Fischer titrator" },
    model: "V30S coulometric",
    department: "wet-chemistry",
    state: "operational",
    utilisation: 72,
    uptime30d: 96.2,
    lastCalibration: "2026-08-05",
    nextCalibration: "2026-11-05",
    intervalMonths: 3,
  },
  {
    id: "BAL-01",
    name: { fa: "ترازوی تحلیلی", en: "Analytical balance" },
    model: "XPE-205 (0.01 mg)",
    department: "wet-chemistry",
    state: "operational",
    utilisation: 95,
    uptime30d: 100,
    lastCalibration: "2026-09-18",
    nextCalibration: "2026-09-25",
    intervalMonths: 0,
    note: {
      fa: "کنترل هفتگی داخلی با وزنه‌های E2؛ کالیبراسیون بیرونی سالانه.",
      en: "Weekly in-house check against E2 weights; annual external calibration.",
    },
  },
  {
    id: "VIS-01",
    name: { fa: "حمام ویسکوزیته", en: "Viscosity bath" },
    model: "CT-52 (40 / 100 °C)",
    department: "physical",
    state: "operational",
    utilisation: 84,
    uptime30d: 99.4,
    lastCalibration: "2026-07-30",
    nextCalibration: "2027-01-30",
    intervalMonths: 6,
  },
  {
    id: "FP-01",
    name: { fa: "دستگاه نقطهٔ اشتعال", en: "Flash point tester" },
    model: "NPM-440 Pensky-Martens",
    department: "physical",
    state: "out-of-service",
    utilisation: 0,
    uptime30d: 61.7,
    lastCalibration: "2026-05-19",
    nextCalibration: "2026-09-19",
    intervalMonths: 4,
    note: {
      fa: "انحراف ترموکوپل فراتر از تلورانس. قطعه سفارش داده شده، رسیدن ۲۹ سپتامبر. نقطهٔ اشتعال به FP-02 منتقل شد.",
      en: "Thermocouple drift beyond tolerance. Spare part on order, ETA 29 Sep. Flash point routed to FP-02.",
    },
  },
  {
    id: "FP-02",
    name: { fa: "دستگاه نقطهٔ اشتعال", en: "Flash point tester" },
    model: "NPM-450 Pensky-Martens",
    department: "physical",
    state: "operational",
    utilisation: 96,
    uptime30d: 99.8,
    lastCalibration: "2026-08-28",
    nextCalibration: "2027-02-28",
    intervalMonths: 6,
    note: {
      fa: "بار کاری FP-01 را جذب کرده؛ شیفت دوم روزانه اجرا می‌شود.",
      en: "Absorbing the FP-01 workload; running a second daily session.",
    },
  },
  {
    id: "INC-01",
    name: { fa: "انکوباتور", en: "Incubator" },
    model: "BD-115 (35 ± 2 °C)",
    department: "microbiology",
    state: "operational",
    utilisation: 67,
    uptime30d: 100,
    lastCalibration: "2026-06-22",
    nextCalibration: "2026-12-22",
    intervalMonths: 6,
  },
  {
    id: "AUT-01",
    name: { fa: "اتوکلاو", en: "Autoclave" },
    model: "SA-260MA",
    department: "microbiology",
    state: "operational",
    utilisation: 49,
    uptime30d: 98.1,
    lastCalibration: "2026-09-10",
    nextCalibration: "2026-10-10",
    intervalMonths: 1,
  },
];

// ----------------------------------------------------------- daily throughput

export type DayPoint = {
  date: string;
  /** Samples logged in. */
  received: number;
  /** Reports issued. */
  reported: number;
  /** Median turnaround of the reports issued that day, in hours. */
  medianTat: number;
  /** Share of those reports issued on or before the contractual date. */
  onTimePct: number;
};

/** Last 30 days. The weekend here is Thursday–Friday, so intake drops then. */
export const DAILY: DayPoint[] = [
  { date: "2026-08-26", received: 24, reported: 21, medianTat: 38.4, onTimePct: 90.5 },
  { date: "2026-08-27", received: 19, reported: 26, medianTat: 36.1, onTimePct: 92.3 },
  { date: "2026-08-28", received: 8, reported: 11, medianTat: 35.2, onTimePct: 100 },
  { date: "2026-08-29", received: 5, reported: 6, medianTat: 33.8, onTimePct: 100 },
  { date: "2026-08-30", received: 27, reported: 18, medianTat: 39.6, onTimePct: 88.9 },
  { date: "2026-08-31", received: 31, reported: 24, medianTat: 41.2, onTimePct: 87.5 },
  { date: "2026-09-01", received: 29, reported: 28, medianTat: 42.8, onTimePct: 85.7 },
  { date: "2026-09-02", received: 26, reported: 30, medianTat: 40.5, onTimePct: 90.0 },
  { date: "2026-09-03", received: 22, reported: 27, medianTat: 39.1, onTimePct: 92.6 },
  { date: "2026-09-04", received: 9, reported: 10, medianTat: 37.4, onTimePct: 100 },
  { date: "2026-09-05", received: 6, reported: 7, medianTat: 36.9, onTimePct: 100 },
  { date: "2026-09-06", received: 33, reported: 21, medianTat: 43.7, onTimePct: 85.7 },
  { date: "2026-09-07", received: 35, reported: 23, medianTat: 46.2, onTimePct: 82.6 },
  { date: "2026-09-08", received: 30, reported: 25, medianTat: 48.9, onTimePct: 80.0 },
  { date: "2026-09-09", received: 28, reported: 29, medianTat: 47.1, onTimePct: 82.8 },
  { date: "2026-09-10", received: 25, reported: 31, medianTat: 44.3, onTimePct: 87.1 },
  { date: "2026-09-11", received: 7, reported: 12, medianTat: 42.0, onTimePct: 91.7 },
  { date: "2026-09-12", received: 5, reported: 8, medianTat: 40.6, onTimePct: 100 },
  { date: "2026-09-13", received: 29, reported: 26, medianTat: 41.4, onTimePct: 88.5 },
  { date: "2026-09-14", received: 32, reported: 28, medianTat: 39.8, onTimePct: 89.3 },
  { date: "2026-09-15", received: 28, reported: 31, medianTat: 38.2, onTimePct: 90.3 },
  { date: "2026-09-16", received: 31, reported: 33, medianTat: 36.7, onTimePct: 93.9 },
  { date: "2026-09-17", received: 27, reported: 30, medianTat: 35.9, onTimePct: 93.3 },
  { date: "2026-09-18", received: 8, reported: 11, medianTat: 34.8, onTimePct: 100 },
  { date: "2026-09-19", received: 6, reported: 7, medianTat: 34.1, onTimePct: 100 },
  { date: "2026-09-20", received: 30, reported: 27, medianTat: 35.6, onTimePct: 92.6 },
  { date: "2026-09-21", received: 34, reported: 29, medianTat: 34.9, onTimePct: 93.1 },
  { date: "2026-09-22", received: 29, reported: 32, medianTat: 33.4, onTimePct: 96.9 },
  { date: "2026-09-23", received: 33, reported: 31, medianTat: 32.8, onTimePct: 96.8 },
  { date: "2026-09-24", received: 18, reported: 14, medianTat: 32.1, onTimePct: 97.2 },
];

/** Contractual median-TAT ceiling the lab commits to. */
export const TAT_TARGET_HOURS = 40;

// ---------------------------------------------------- turnaround by test type

export type TestTat = {
  code: string;
  name: I18nText;
  method: string;
  department: DepartmentKey;
  /** Reports issued in the last 30 days. */
  volume: number;
  medianHours: number;
  p90Hours: number;
  targetHours: number;
};

export const TEST_TAT: TestTat[] = [
  {
    code: "S-TOT",
    name: { fa: "گوگرد کل", en: "Total sulphur" },
    method: "ASTM D4294",
    department: "spectroscopy",
    volume: 142,
    medianHours: 14.2,
    p90Hours: 26.0,
    targetHours: 24,
  },
  {
    code: "DENS",
    name: { fa: "دانسیته در ۱۵ درجه", en: "Density at 15 °C" },
    method: "ASTM D1298",
    department: "physical",
    volume: 168,
    medianHours: 9.6,
    p90Hours: 17.4,
    targetHours: 24,
  },
  {
    code: "VISC",
    name: { fa: "ویسکوزیتهٔ سینماتیک", en: "Kinematic viscosity" },
    method: "ASTM D445",
    department: "physical",
    volume: 131,
    medianHours: 21.8,
    p90Hours: 38.5,
    targetHours: 48,
  },
  {
    code: "FLASH",
    name: { fa: "نقطهٔ اشتعال", en: "Flash point" },
    method: "ASTM D93",
    department: "physical",
    volume: 97,
    medianHours: 52.4,
    p90Hours: 78.1,
    targetHours: 48,
  },
  {
    code: "H2O",
    name: { fa: "مقدار آب (کارل فیشر)", en: "Water content (Karl Fischer)" },
    method: "ASTM D6304",
    department: "wet-chemistry",
    volume: 104,
    medianHours: 16.1,
    p90Hours: 29.3,
    targetHours: 24,
  },
  {
    code: "TAN",
    name: { fa: "عدد اسیدی", en: "Acid number" },
    method: "ASTM D664",
    department: "wet-chemistry",
    volume: 88,
    medianHours: 27.5,
    p90Hours: 44.9,
    targetHours: 48,
  },
  {
    code: "DIST",
    name: { fa: "تقطیر", en: "Distillation" },
    method: "ASTM D86",
    department: "physical",
    volume: 76,
    medianHours: 31.2,
    p90Hours: 49.8,
    targetHours: 48,
  },
  {
    code: "METALS",
    name: { fa: "فلزات سایشی با ICP-OES", en: "Wear metals by ICP-OES" },
    method: "ASTM D5185",
    department: "spectroscopy",
    volume: 159,
    medianHours: 18.7,
    p90Hours: 33.6,
    targetHours: 24,
  },
  {
    code: "BENZ",
    name: { fa: "بنزن با GC", en: "Benzene by GC" },
    method: "ASTM D3606",
    department: "chromatography",
    volume: 64,
    medianHours: 34.9,
    p90Hours: 57.2,
    targetHours: 48,
  },
  {
    code: "TPC",
    name: { fa: "شمارش کلی میکروبی", en: "Total plate count" },
    method: "ISO 4833-1",
    department: "microbiology",
    volume: 42,
    medianHours: 96.4,
    p90Hours: 118.0,
    targetHours: 120,
  },
];

// ------------------------------------------------------------ quality control

export type WestgardRule = "1-2s" | "1-3s" | "2-2s" | "R-4s" | "4-1s" | "10-x";

export type QcPoint = {
  run: number;
  date: string;
  value: number;
  analyst: I18nText;
  /** Westgard rule triggered on this run, if any. */
  flag?: WestgardRule;
};

/**
 * One control chart: a certified reference material run alongside every
 * wear-metals batch on ICP-01. Mean and SD come from the 20-run
 * characterisation period, not from the points plotted here.
 */
export const QC_CHART = {
  control: {
    fa: "CRM-842 · آهن در روغن کارکرده",
    en: "CRM-842 · Iron in used oil",
  } satisfies I18nText,
  instrument: "ICP-01",
  method: "ASTM D5185",
  unit: { fa: "mg/kg", en: "mg/kg" } satisfies I18nText,
  mean: 48.0,
  sd: 1.6,
  characterisedOver: 20,
  points: [
    { run: 1, date: "2026-08-27", value: 48.4, analyst: ANALYSTS.rahmani },
    { run: 2, date: "2026-08-30", value: 47.2, analyst: ANALYSTS.rahmani },
    { run: 3, date: "2026-08-31", value: 49.1, analyst: ANALYSTS.mirzaei },
    { run: 4, date: "2026-09-01", value: 48.0, analyst: ANALYSTS.rahmani },
    { run: 5, date: "2026-09-02", value: 46.9, analyst: ANALYSTS.rahmani },
    { run: 6, date: "2026-09-03", value: 47.6, analyst: ANALYSTS.mirzaei },
    { run: 7, date: "2026-09-06", value: 51.3, analyst: ANALYSTS.mirzaei, flag: "1-2s" },
    { run: 8, date: "2026-09-07", value: 49.4, analyst: ANALYSTS.rahmani },
    { run: 9, date: "2026-09-08", value: 48.8, analyst: ANALYSTS.rahmani },
    { run: 10, date: "2026-09-09", value: 47.1, analyst: ANALYSTS.mirzaei },
    { run: 11, date: "2026-09-10", value: 48.3, analyst: ANALYSTS.rahmani },
    { run: 12, date: "2026-09-13", value: 49.0, analyst: ANALYSTS.rahmani },
    { run: 13, date: "2026-09-14", value: 52.9, analyst: ANALYSTS.mirzaei, flag: "1-3s" },
    { run: 14, date: "2026-09-15", value: 48.6, analyst: ANALYSTS.rahmani },
    { run: 15, date: "2026-09-16", value: 47.8, analyst: ANALYSTS.rahmani },
    { run: 16, date: "2026-09-17", value: 48.9, analyst: ANALYSTS.mirzaei },
    { run: 17, date: "2026-09-20", value: 49.3, analyst: ANALYSTS.rahmani },
    { run: 18, date: "2026-09-21", value: 48.2, analyst: ANALYSTS.rahmani },
    { run: 19, date: "2026-09-22", value: 49.6, analyst: ANALYSTS.mirzaei },
    { run: 20, date: "2026-09-23", value: 48.5, analyst: ANALYSTS.rahmani },
    { run: 21, date: "2026-09-24", value: 47.9, analyst: ANALYSTS.rahmani },
  ] as QcPoint[],
} as const;

export const WESTGARD_RULES: Record<
  WestgardRule,
  { label: string; meaning: I18nText; action: "warning" | "reject" }
> = {
  "1-2s": {
    label: "1₂s",
    meaning: {
      fa: "یک نتیجه فراتر از ۲ انحراف معیار — فقط هشدار. بررسی شود، رد نشود.",
      en: "One result beyond 2 SD — warning only. Inspect, do not reject.",
    },
    action: "warning",
  },
  "1-3s": {
    label: "1₃s",
    meaning: {
      fa: "یک نتیجه فراتر از ۳ انحراف معیار — خطای تصادفی. بچ رد و تکرار می‌شود.",
      en: "One result beyond 3 SD — random error. Batch rejected and repeated.",
    },
    action: "reject",
  },
  "2-2s": {
    label: "2₂s",
    meaning: {
      fa: "دو نتیجهٔ پیاپی فراتر از یک حد ۲ انحراف معیار — خطای سیستماتیک.",
      en: "Two consecutive results beyond the same 2 SD limit — systematic error.",
    },
    action: "reject",
  },
  "R-4s": {
    label: "R₄s",
    meaning: {
      fa: "اختلاف دو نتیجهٔ پیاپی بیش از ۴ انحراف معیار — خطای تصادفی.",
      en: "Range between two consecutive results exceeds 4 SD — random error.",
    },
    action: "reject",
  },
  "4-1s": {
    label: "4₁s",
    meaning: {
      fa: "چهار نتیجهٔ پیاپی در یک سمت و فراتر از ۱ انحراف معیار — سوگیری در حال شکل‌گیری.",
      en: "Four consecutive results on one side beyond 1 SD — developing bias.",
    },
    action: "reject",
  },
  "10-x": {
    label: "10x̄",
    meaning: {
      fa: "ده نتیجهٔ پیاپی در یک سمت میانگین — جابه‌جایی سیستماتیک.",
      en: "Ten consecutive results on one side of the mean — systematic shift.",
    },
    action: "reject",
  },
};

/** QC performance per department, last 30 days. */
export type QcSummary = {
  department: DepartmentKey;
  runs: number;
  passed: number;
  warnings: number;
  rejected: number;
};

export const QC_SUMMARY: QcSummary[] = [
  { department: "chromatography", runs: 96, passed: 92, warnings: 3, rejected: 1 },
  { department: "spectroscopy", runs: 124, passed: 119, warnings: 4, rejected: 1 },
  { department: "wet-chemistry", runs: 81, passed: 79, warnings: 2, rejected: 0 },
  { department: "physical", runs: 110, passed: 104, warnings: 4, rejected: 2 },
  { department: "microbiology", runs: 34, passed: 34, warnings: 0, rejected: 0 },
];

// --------------------------------------------------------------------- alerts

export type Alert = {
  id: string;
  severity: "critical" | "serious" | "warning";
  title: I18nText;
  detail: I18nText;
  /** Appended to the locale prefix at render time. */
  href: string;
  cta: I18nText;
};

export const ALERTS: Alert[] = [
  {
    id: "al-1",
    severity: "critical",
    title: {
      fa: "FP-01 خارج از سرویس، تعهد نقطهٔ اشتعال نقض شده",
      en: "FP-01 out of service, flash point target breached",
    },
    detail: {
      fa: "انحراف ترموکوپل در ۱۹ سپتامبر FP-01 را از کار انداخت. میانهٔ زمان پاسخ نقطهٔ اشتعال ۵۲٫۴ ساعت در برابر هدف ۴۸ ساعت است — تنها روش نقض‌شدهٔ آزمایشگاه. FP-02 با ۹۶٪ بهره‌برداری دارد بار را جذب می‌کند.",
      en: "Thermocouple drift took FP-01 down on 19 Sep. Flash point median turnaround is 52.4 h against a 48 h target — the only breached method in the lab. FP-02 is at 96% utilisation absorbing the load.",
    },
    href: "/demo/laboratory/instruments",
    cta: { fa: "دستگاه‌ها", en: "Instruments" },
  },
  {
    id: "al-2",
    severity: "serious",
    title: {
      fa: "سه کالیبراسیون ظرف هفت روز سررسید می‌شود",
      en: "Three calibrations fall due within seven days",
    },
    detail: {
      fa: "BAL-01 (۲۵ سپتامبر)، UV-01 (۲۸ سپتامبر) و ICP-01 (۱ اکتبر) همه داخل همین هفته‌اند، و کالیبراسیون FP-01 از ۱۹ سپتامبر منقضی شده در حالی که خارج از سرویس است. ICP-01 پرحجم‌ترین روش آزمایشگاه را می‌برد، پس آن را دور از اوج ورودی یکشنبه رزرو کنید.",
      en: "BAL-01 (25 Sep), UV-01 (28 Sep) and ICP-01 (1 Oct) are all due inside the week, and FP-01 has been lapsed since 19 Sep while it sits out of service. ICP-01 carries the lab's highest-volume method, so book it away from the Sunday intake peak.",
    },
    href: "/demo/laboratory/instruments",
    cta: { fa: "برنامهٔ کالیبراسیون", en: "Calibration schedule" },
  },
  {
    id: "al-3",
    severity: "serious",
    title: {
      fa: "رد شدن 1₃s روی CRM-842، ران ۱۳",
      en: "1₃s rejection on CRM-842, run 13",
    },
    detail: {
      fa: "آهن در روغن کارکرده ۵۲٫۹ میلی‌گرم بر کیلوگرم خوانده شد در برابر کنترل ۴۸٫۰ ± ۱٫۶ — فراتر از ۳ انحراف معیار. بچ رد و تکرار شد، نبولایزر تعویض شد و ران ۱۴ به ۴۸٫۶ برگشت.",
      en: "Iron in used oil read 52.9 mg/kg against a 48.0 ± 1.6 mg/kg control — beyond 3 SD. The batch was rejected and repeated, the nebuliser replaced, and run 14 returned to 48.6 mg/kg.",
    },
    href: "/demo/laboratory/qc",
    cta: { fa: "نمودار کنترل", en: "Control chart" },
  },
  {
    id: "al-4",
    severity: "warning",
    title: {
      fa: "SMP-26-4406 شصت‌وهشت ساعت متوقف مانده",
      en: "SMP-26-4406 held for 68 hours",
    },
    detail: {
      fa: "نمونهٔ سود سوزآور شیمیایی نیلگون در انتظار تأیید کتبی مبنای غلظت متوقف است. تاریخ قراردادی ۲۵ سپتامبر است، یعنی پس از آزاد شدن فقط ۴ ساعت از هدف ۷۲ ساعته باقی می‌ماند.",
      en: "The Nilgoon Chemicals caustic soda sample is on hold pending written confirmation of the concentration basis. Contractual date is 25 Sep, leaving 4 h of the 72 h target once released.",
    },
    href: "/demo/laboratory/samples",
    cta: { fa: "دفتر نمونه", en: "Sample register" },
  },
];
