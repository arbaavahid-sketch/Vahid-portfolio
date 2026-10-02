import test from "node:test";
import assert from "node:assert/strict";
import {
  orders,
  salesSummary,
  orderStatus,
  materials,
  stockCover,
  needsReorder,
  productionSummary,
} from "../src/lib/demo/business.ts";
import { fmtInvoiceMonth } from "../src/lib/format.ts";
import { makeCsv } from "../src/lib/download.ts";

test("CSV preserves Persian, quotes and line breaks, and neutralises formulas", () => {
  assert.equal(
    makeCsv([["نام", 'A,"B"', "two\nlines", "=1+2", 42]]),
    '\uFEFF"نام","A,""B""","two\nlines","\'=1+2","42"',
  );
});

test("partial payments count only the unpaid balance, including at due-date boundary", () => {
  const invoice = {
    ...orders[0],
    revenue: 100,
    cost: 70,
    paid: 40,
    due: "2026-09-23",
  };
  assert.equal(orderStatus(invoice), "overdue");
  assert.equal(salesSummary([invoice]).overdue, 60);
  assert.equal(orderStatus({ ...invoice, due: "2026-09-24" }), "open");
  assert.equal(orderStatus({ ...invoice, paid: 100 }), "paid");
});
test("September sales reconcile to invoices and aggregate margin uses weighted revenue", () => {
  const summary = salesSummary(
    orders.filter((row) => row.date.startsWith("2026-09")),
  );
  assert.deepEqual(summary, {
    revenue: 2000,
    margin: 26.25,
    outstanding: 1050,
    overdue: 350,
  });
  assert.deepEqual(salesSummary([]), {
    revenue: 0,
    margin: 0,
    outstanding: 0,
    overdue: 0,
  });
});
test("stock coverage excludes reservations and incoming orders", () => {
  assert.equal(stockCover(materials[0]), 8.5);
  assert.equal(needsReorder({ ...materials[0], incoming: 99999 }), true);
  assert.equal(needsReorder({ ...materials[0], stock: 4800 }), false);
});
test("production excludes running batches from yield and separates QC-held output", () => {
  const all = productionSummary("all");
  assert.equal(all.output, 6348);
  assert.equal(all.released, 4068);
  assert.equal(all.planned, 9400);
  assert.equal(all.downtime, 120);
  assert.ok(Math.abs(all.yield - (6348 / 6600) * 100) < 1e-10);
  assert.equal(productionSummary("A").downtime, 55);
  assert.equal(productionSummary("B").yield, 96);
});
test("Persian invoice-month labels retain the Gregorian calendar", () => {
  assert.match(fmtInvoiceMonth("2026-09", "en"), /September 2026/);
  assert.match(fmtInvoiceMonth("2026-09", "fa"), /سپتامبر/);
  assert.doesNotMatch(fmtInvoiceMonth("2026-09", "fa"), /شهریور/);
});
test("synthetic records respect accounting and inventory bounds", () => {
  assert.equal(new Set(orders.map((row) => row.id)).size, orders.length);
  for (const row of orders) {
    assert.ok(row.cost >= 0 && row.cost <= row.revenue);
    assert.ok(row.paid >= 0 && row.paid <= row.revenue);
  }
  for (const row of materials) {
    assert.ok(row.reserved <= row.stock && row.dailyUse > 0);
  }
});
