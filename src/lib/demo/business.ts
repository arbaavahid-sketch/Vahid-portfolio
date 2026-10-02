/** Entirely fictional records. Monetary values are in million toman. */
import type { I18nText } from "../i18n";

/**
 * Customers and product lines are named once here, in both scripts. A customer
 * name is data rather than interface copy, so it travels with the record — the
 * Persian view would otherwise print an English name in the middle of a Persian
 * sentence.
 */
export const CUSTOMERS = {
  cedar: { en: "Cedar Chemicals", fa: "شیمی سدر" },
  orion: { en: "Orion Materials", fa: "مواد اوریون" },
  meridian: { en: "Meridian Process", fa: "فرایند مریدین" },
  northstar: { en: "Northstar Labs", fa: "آزمایشگاه نورث‌استار" },
} satisfies Record<string, I18nText>;

export const PRODUCT_LINES = {
  solvents: { en: "Solvents", fa: "حلال‌ها" },
  reagents: { en: "Reagents", fa: "معرف‌ها" },
  catalysts: { en: "Catalysts", fa: "کاتالیست‌ها" },
} satisfies Record<string, I18nText>;

export const SNAPSHOT = "2026-09-24";
export const periods = ["2026-07", "2026-08", "2026-09"] as const;
export type Period = (typeof periods)[number];
export type OrderStatus = "paid" | "open" | "overdue";
export const orders = [
  {
    id: "SO-101",
    customer: CUSTOMERS.cedar,
    product: PRODUCT_LINES.solvents,
    date: "2026-07-08",
    due: "2026-08-08",
    revenue: 420,
    cost: 320,
    paid: 420,
  },
  {
    id: "SO-102",
    customer: CUSTOMERS.orion,
    product: PRODUCT_LINES.reagents,
    date: "2026-07-17",
    due: "2026-08-17",
    revenue: 280,
    cost: 210,
    paid: 280,
  },
  {
    id: "SO-103",
    customer: CUSTOMERS.cedar,
    product: PRODUCT_LINES.catalysts,
    date: "2026-07-25",
    due: "2026-08-25",
    revenue: 650,
    cost: 490,
    paid: 500,
  },
  {
    id: "SO-104",
    customer: CUSTOMERS.northstar,
    product: PRODUCT_LINES.reagents,
    date: "2026-08-04",
    due: "2026-09-04",
    revenue: 360,
    cost: 260,
    paid: 360,
  },
  {
    id: "SO-105",
    customer: CUSTOMERS.orion,
    product: PRODUCT_LINES.solvents,
    date: "2026-08-12",
    due: "2026-09-12",
    revenue: 540,
    cost: 420,
    paid: 400,
  },
  {
    id: "SO-106",
    customer: CUSTOMERS.cedar,
    product: PRODUCT_LINES.catalysts,
    date: "2026-08-24",
    due: "2026-09-24",
    revenue: 720,
    cost: 535,
    paid: 720,
  },
  {
    id: "SO-107",
    customer: CUSTOMERS.northstar,
    product: PRODUCT_LINES.reagents,
    date: "2026-09-02",
    due: "2026-09-16",
    revenue: 310,
    cost: 220,
    paid: 200,
  },
  {
    id: "SO-108",
    customer: CUSTOMERS.cedar,
    product: PRODUCT_LINES.catalysts,
    date: "2026-09-08",
    due: "2026-09-22",
    revenue: 840,
    cost: 630,
    paid: 600,
  },
  {
    id: "SO-109",
    customer: CUSTOMERS.orion,
    product: PRODUCT_LINES.solvents,
    date: "2026-09-15",
    due: "2026-10-15",
    revenue: 460,
    cost: 345,
    paid: 0,
  },
  {
    id: "SO-110",
    customer: CUSTOMERS.meridian,
    product: PRODUCT_LINES.reagents,
    date: "2026-09-21",
    due: "2026-10-21",
    revenue: 390,
    cost: 280,
    paid: 150,
  },
];
export type Order = (typeof orders)[number];
export const salesTargets: Record<Period, number> = {
  "2026-07": 1600,
  "2026-08": 1800,
  "2026-09": 2200,
};
export const opportunities = [
  {
    id: "QT-201",
    customer: CUSTOMERS.meridian,
    stage: "qualified",
    value: 620,
    probability: 0.2,
  },
  {
    id: "QT-202",
    customer: CUSTOMERS.northstar,
    stage: "quoted",
    value: 480,
    probability: 0.5,
  },
  {
    id: "QT-203",
    customer: CUSTOMERS.orion,
    stage: "negotiation",
    value: 920,
    probability: 0.75,
  },
  {
    id: "QT-204",
    customer: CUSTOMERS.cedar,
    stage: "quoted",
    value: 740,
    probability: 0.5,
  },
] as const;
export function orderStatus(order: Order): OrderStatus {
  if (order.paid >= order.revenue) return "paid";
  return order.due < SNAPSHOT ? "overdue" : "open";
}
export const outstanding = (order: Order) => order.revenue - order.paid;
export function salesSummary(rows: Order[]) {
  const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const cost = rows.reduce((sum, row) => sum + row.cost, 0);
  return {
    revenue,
    margin: revenue ? ((revenue - cost) / revenue) * 100 : 0,
    outstanding: rows.reduce((sum, row) => sum + outstanding(row), 0),
    overdue: rows
      .filter((row) => orderStatus(row) === "overdue")
      .reduce((sum, row) => sum + outstanding(row), 0),
  };
}

export const materials = [
  {
    id: "RM-01",
    name: { en: "Solvent base", fa: "حلال پایه" },
    stock: 4200,
    reserved: 800,
    dailyUse: 400,
    leadDays: 10,
    incoming: 3000,
  },
  {
    id: "RM-02",
    name: { en: "Alumina carrier", fa: "پایه آلومینا" },
    stock: 6800,
    reserved: 1200,
    dailyUse: 280,
    leadDays: 14,
    incoming: 0,
  },
  {
    id: "RM-03",
    name: { en: "Binder resin", fa: "رزین بایندر" },
    stock: 950,
    reserved: 250,
    dailyUse: 150,
    leadDays: 7,
    incoming: 1200,
  },
  {
    id: "RM-04",
    name: { en: "Active concentrate", fa: "کنسانتره فعال" },
    stock: 1800,
    reserved: 300,
    dailyUse: 90,
    leadDays: 12,
    incoming: 0,
  },
  {
    id: "RM-05",
    name: { en: "Process additive", fa: "افزودنی فرایند" },
    stock: 320,
    reserved: 120,
    dailyUse: 80,
    leadDays: 5,
    incoming: 600,
  },
];
export type Material = (typeof materials)[number];
export const available = (row: Material) => row.stock - row.reserved;
export const stockCover = (row: Material) => available(row) / row.dailyUse;
export const needsReorder = (row: Material) => stockCover(row) < row.leadDays;
export const batches = [
  {
    id: "BT-301",
    line: "A",
    product: { en: "Process solvent", fa: "حلال فرایندی" },
    planned: 2400,
    input: 2400,
    output: 2340,
    status: "released",
  },
  {
    id: "BT-302",
    line: "B",
    product: { en: "Catalyst carrier", fa: "پایه کاتالیست" },
    planned: 1800,
    input: 1800,
    output: 1728,
    status: "released",
  },
  {
    id: "BT-303",
    line: "A",
    product: { en: "Process solvent", fa: "حلال فرایندی" },
    planned: 2400,
    input: 2400,
    output: 2280,
    status: "quality",
  },
  {
    id: "BT-304",
    line: "B",
    product: { en: "Catalyst carrier", fa: "پایه کاتالیست" },
    planned: 1600,
    input: 1600,
    output: 0,
    status: "running",
  },
  {
    id: "BT-305",
    line: "A",
    product: { en: "Reagent blend", fa: "مخلوط معرف" },
    planned: 1200,
    input: 0,
    output: 0,
    status: "planned",
  },
] as const;
export const downtime = [
  {
    line: "A",
    reason: { en: "Filter change", fa: "تعویض فیلتر" },
    minutes: 35,
  },
  {
    line: "A",
    reason: { en: "Feed interruption", fa: "قطع خوراک" },
    minutes: 20,
  },
  {
    line: "B",
    reason: { en: "Pump maintenance", fa: "تعمیر پمپ" },
    minutes: 65,
  },
];
export function productionSummary(line: string) {
  const rows = batches.filter((row) => line === "all" || row.line === line);
  const finished = rows.filter(
    (row) => row.status === "released" || row.status === "quality",
  );
  const output = finished.reduce((sum, row) => sum + row.output, 0);
  const input = finished.reduce((sum, row) => sum + row.input, 0);
  return {
    rows,
    output,
    released: rows
      .filter((row) => row.status === "released")
      .reduce((sum, row) => sum + row.output, 0),
    planned: rows.reduce((sum, row) => sum + row.planned, 0),
    yield: input ? (output / input) * 100 : 0,
    downtime: downtime
      .filter((row) => line === "all" || row.line === line)
      .reduce((sum, row) => sum + row.minutes, 0),
  };
}
