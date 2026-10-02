"use client";
import { useEffect, useSyncExternalStore } from "react";
import { seed, type DemoState } from "@/lib/demo/management";

const KEY = "nova-management-demo-v1";
let state: DemoState = seed;
let storageNotice = "";
let loaded = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function valid(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const data = value as DemoState;
  if (data.version !== 1) return false;
  for (const key of [
    "tasks",
    "deals",
    "jobs",
    "shipments",
    "messages",
  ] as const) {
    if (!Array.isArray(data[key]) || data[key].length > 1000) return false;
    const model = seed[key][0];
    if (
      !data[key].every(
        (row) =>
          row &&
          Object.entries(model).every(
            ([field, sample]) =>
              typeof (row as unknown as Record<string, unknown>)[field] ===
              typeof sample,
          ),
      )
    )
      return false;
  }
  return (
    Array.isArray(data.digestRuns) &&
    data.digestRuns.every(
      (row) =>
        typeof row.id === "string" &&
        typeof row.date === "string" &&
        typeof row.open === "number",
    )
  );
}
function hydrate() {
  if (loaded) return;
  loaded = true;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (valid(parsed)) state = parsed;
      else
        storageNotice =
          "Saved demo data was incompatible. The original sample data has been restored.";
    }
  } catch {
    storageNotice =
      "Browser storage is unavailable. Changes will last only in this session.";
  }
  notify();
}
export function updateDemo(update: (current: DemoState) => DemoState) {
  hydrate();
  state = update(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    storageNotice =
      "Changes are in memory only; browser storage could not be updated.";
  }
  notify();
}
export const resetDemo = () => updateDemo(() => structuredClone(seed));
export function useDemo() {
  const data = useSyncExternalStore(
    subscribe,
    () => state,
    () => seed,
  );
  const notice = useSyncExternalStore(
    subscribe,
    () => storageNotice,
    () => "",
  );
  useEffect(hydrate, []);
  return { data, notice };
}
