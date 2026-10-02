import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  managementMetrics,
  digestText,
  carriedTask,
  overdueTask,
  routes,
} from "../src/lib/demo/management.ts";

test("contracts and payments reconcile across team and management views", () => {
  const total = managementMetrics(seed);
  assert.equal(total.revenue, 1760);
  assert.equal(total.pipeline, 2430);
  assert.equal(total.overdue, 470);
  assert.equal(total.open, 9);
  assert.equal(
    ["a", "b", "c"].reduce(
      (sum, team) => sum + managementMetrics(seed, team).revenue,
      0,
    ),
    total.revenue,
  );
  const paid = structuredClone(seed);
  paid.deals.find((row) => row.id === "DL-201").paid = 920;
  assert.equal(managementMetrics(paid).overdue, 200);
});
test("closing a carried action removes it from overdue work and the digest", () => {
  const current = structuredClone(seed);
  const task = current.tasks.find((row) => row.id === "AC-102");
  assert.ok(carriedTask(task));
  assert.ok(overdueTask(task));
  assert.match(digestText(current), /AC-102/);
  task.status = "Done";
  assert.equal(carriedTask(task), false);
  assert.equal(overdueTask(task), false);
  assert.doesNotMatch(digestText(current), /AC-102/);
  assert.equal(managementMetrics(current).open, 8);
});
test("technical jobs and purchase orders link to real demo deals", () => {
  const ids = new Set(seed.deals.map((deal) => deal.id));
  for (const row of [...seed.jobs, ...seed.shipments])
    assert.ok(ids.has(row.deal));
  assert.equal(new Set(routes.map((route) => route.join("/"))).size, 16);
  for (const deal of seed.deals)
    assert.ok(deal.paid >= 0 && deal.paid <= deal.value);
});
test("changing a proposal to won updates sales and removes it from pipeline", () => {
  const current = structuredClone(seed);
  current.deals.find((row) => row.id === "DL-206").stage = "Won";
  assert.equal(managementMetrics(current).revenue, 2000);
  assert.equal(managementMetrics(current).pipeline, 2190);
});
