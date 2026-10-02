"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { StatusPill, type StatusTone } from "./ui";
import {
  DEPARTMENTS,
  PRIORITY_LABEL,
  SAMPLE_STATUS_LABEL,
  type DepartmentKey,
  type Sample,
  type SampleStatus,
} from "@/lib/demo/laboratory";
import { fmtDateShort, fmtHours, fmtNum, fmtPct } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";

const STATUS_TONE: Record<SampleStatus, StatusTone> = {
  received: "idle",
  preparation: "idle",
  testing: "warning",
  review: "warning",
  reported: "good",
  "on-hold": "critical",
};

type StatusFilter = SampleStatus | "all" | "active";
type DeptFilter = DepartmentKey | "all";

/**
 * One filter row above everything it scopes, so the counts and the table can
 * never disagree about which slice is on screen.
 */
export function SampleRegister({
  locale,
  samples,
}: {
  locale: Locale;
  samples: Sample[];
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dept, setDept] = useState<DeptFilter>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return samples.filter((s) => {
      if (dept !== "all" && s.department !== dept) return false;
      if (status === "active" && s.status === "reported") return false;
      if (status !== "all" && status !== "active" && s.status !== status)
        return false;
      if (
        q &&
        // Search both languages, so a Persian reader can still paste an ID or
        // an English client name that a colleague sent them.
        !`${s.id} ${s.client.fa} ${s.client.en} ${s.matrix.fa} ${s.matrix.en} ${s.analyst.fa} ${s.analyst.en}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [samples, status, dept, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Field label={t(locale, "status")}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-9 rounded-lg border border-line bg-surface px-2.5 text-sm text-ink"
          >
            <option value="all">{t(locale, "all")}</option>
            <option value="active">{t(locale, "labActiveOnly")}</option>
            {(Object.keys(SAMPLE_STATUS_LABEL) as SampleStatus[]).map((k) => (
              <option key={k} value={k}>
                {SAMPLE_STATUS_LABEL[k][locale]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t(locale, "department")}>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value as DeptFilter)}
            className="h-9 rounded-lg border border-line bg-surface px-2.5 text-sm text-ink"
          >
            <option value="all">{t(locale, "all")}</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.name[locale]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t(locale, "search")}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(locale, "labSearchPlaceholder")}
            className="h-9 w-56 rounded-lg border border-line bg-surface px-2.5 text-sm text-ink placeholder:text-ink-3"
          />
        </Field>

        <p className="ms-auto pb-1.5 text-xs text-ink-3" aria-live="polite">
          {fmtNum(rows.length, locale)} {t(locale, "recordsOf")}{" "}
          {fmtNum(samples.length, locale)} {t(locale, "records")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] text-sm">
          <caption className="sr-only">
            {t(locale, "labRegisterCaption")}
          </caption>
          <thead>
            <tr className="border-b border-line text-start text-xs text-ink-3">
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "labColSample")}
              </th>
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "labColClient")}
              </th>
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "labColMatrix")}
              </th>
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "status")}
              </th>
              <th scope="col" className="py-2 pe-4 text-end font-medium">
                {t(locale, "labColTests")}
              </th>
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "labColElapsed")}
              </th>
              <th scope="col" className="py-2 pe-4 font-medium">
                {t(locale, "labColDue")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t(locale, "labColAnalyst")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const pct = (s.elapsedHours / s.targetHours) * 100;
              const tone =
                pct >= 100 ? "critical" : pct >= 85 ? "warning" : "ok";
              return (
                <tr
                  key={s.id}
                  className="border-b border-line/60 align-middle hover:bg-surface-2"
                >
                  <td className="py-2.5 pe-4">
                    <div className="tnum font-medium whitespace-nowrap text-ink">
                      {s.id}
                    </div>
                    {s.priority !== "routine" && (
                      <div
                        className={clsx(
                          "text-[11px] font-semibold",
                          s.priority === "critical"
                            ? "text-st-critical"
                            : "text-st-serious",
                        )}
                      >
                        {PRIORITY_LABEL[s.priority][locale]}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 pe-4 text-ink-2">{s.client[locale]}</td>
                  <td className="py-2.5 pe-4 text-ink-2">{s.matrix[locale]}</td>
                  <td className="py-2.5 pe-4">
                    <StatusPill
                      tone={STATUS_TONE[s.status]}
                      label={SAMPLE_STATUS_LABEL[s.status][locale]}
                    />
                  </td>
                  <td className="tnum py-2.5 pe-4 text-end text-ink">
                    {fmtNum(s.tests, locale)}
                  </td>
                  <td className="py-2.5 pe-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-surface-2">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${Math.min(100, pct)}%`,
                            background:
                              tone === "critical"
                                ? "var(--st-critical)"
                                : tone === "warning"
                                  ? "var(--st-warning)"
                                  : "var(--seq-400)",
                          }}
                        />
                      </span>
                      <span
                        dir="ltr"
                        className="tnum whitespace-nowrap text-xs text-ink-2"
                      >
                        {fmtHours(s.elapsedHours, locale)} /{" "}
                        {fmtHours(s.targetHours, locale)}
                      </span>
                      <span className="sr-only">
                        {t(locale, "labPctOfTargetElapsed").replace(
                          "{v}",
                          fmtPct(pct, locale, 0),
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pe-4 whitespace-nowrap text-ink-2">
                    {fmtDateShort(s.dueAt, locale)}
                  </td>
                  <td className="py-2.5 whitespace-nowrap text-ink-2">
                    {s.analyst[locale]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-ink-3">
            {t(locale, "noMatch")}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-ink-3">{label}</span>
      {children}
    </label>
  );
}
