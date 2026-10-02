import type { Metadata } from "next";
import { ControlChart } from "@/components/charts/control-chart";
import { TableView } from "@/components/table-view";
import {
  Badge,
  Card,
  Note,
  PageHeader,
  StatTile,
  StatusPill,
} from "@/components/ui";
import {
  QC_CHART,
  QC_SUMMARY,
  WESTGARD_RULES,
  departmentName,
} from "@/lib/demo/laboratory";
import * as s from "@/lib/demo/selectors";
import { fmtDate, fmtNum, fmtPct } from "@/lib/format";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/laboratory/qc">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { title: t(l, "labQcTitle") };
}

export default async function QualityControlPage({
  params,
}: PageProps<"/[locale]/demo/laboratory/qc">) {
  const { locale } = (await params) as { locale: Locale };
  const unit = QC_CHART.unit[locale];

  return (
    <>
      <PageHeader
        title={t(locale, "labQcTitle")}
        subtitle={t(locale, "labQcSub")}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t(locale, "labQcPassRate")}
          value={fmtPct(s.qcPassRate, locale, 1)}
          hint={t(locale, "labQcPassHint")
            .replace("{a}", fmtNum(s.qcPassed, locale))
            .replace("{b}", fmtNum(s.qcRuns, locale))}
        />
        <StatTile
          label={t(locale, "labQcWarnings")}
          value={fmtNum(s.qcWarnings, locale)}
          hint={t(locale, "labQcWarningsHint")}
        />
        <StatTile
          label={t(locale, "labQcRejections")}
          value={fmtNum(s.qcRejected, locale)}
          delta={fmtPct((s.qcRejected / s.qcRuns) * 100, locale, 1)}
          deltaLabel={t(locale, "labQcOfAllRuns")}
          deltaGood={false}
          hint={t(locale, "labQcRejectHint")}
        />
        <StatTile
          label={t(locale, "labQcCv")}
          value={fmtPct(s.qcCv, locale, 2)}
          hint={t(locale, "labQcCvHint")
            .replace("{control}", QC_CHART.control[locale].split(" · ")[0])
            .replace("{n}", fmtNum(QC_CHART.points.length, locale))}
        />
      </div>

      {/* ------------------------------------------------------ control chart */}
      <Card
        className="mt-6"
        title={t(locale, "labQcChartTitle")}
        subtitle={`${QC_CHART.control[locale]} · ${QC_CHART.instrument} · ${QC_CHART.method}`}
        action={
          <div className="flex flex-wrap gap-1.5">
            <Badge>
              {t(locale, "qcMean")} {fmtNum(QC_CHART.mean, locale, 1)} {unit}
            </Badge>
            <Badge>SD {fmtNum(QC_CHART.sd, locale, 1)} {unit}</Badge>
          </div>
        }
      >
        <ControlChart
          locale={locale}
          points={[...QC_CHART.points]}
          mean={QC_CHART.mean}
          sd={QC_CHART.sd}
          unit={unit}
          height={300}
        />

        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2 text-xs text-ink-2">
            <span
              aria-hidden
              className="size-2.5 rounded-full ring-2 ring-surface"
              style={{ background: "var(--s1)" }}
            />
            {t(locale, "labQcInControl")}
          </li>
          <li className="flex items-center gap-2 text-xs text-ink-2">
            <span
              aria-hidden
              className="size-3 rotate-45 ring-2 ring-surface"
              style={{ background: "var(--st-warning)" }}
            />
            {t(locale, "labQcWarnInspect")}
          </li>
          <li className="flex items-center gap-2 text-xs text-ink-2">
            <span
              aria-hidden
              className="size-3 rounded-[2px] ring-2 ring-surface"
              style={{ background: "var(--st-critical)" }}
            />
            {t(locale, "labQcRejected")}
          </li>
        </ul>

        <div className="mt-4">
          <Note>
            {t(locale, "labQcChartNote")
              .replace("{n}", fmtNum(QC_CHART.characterisedOver, locale))
              .replace("{p}", fmtNum(QC_CHART.points.length, locale))
              .replace(
                "{sd}",
                `${fmtNum(s.qcObservedSd.sd, locale, 2)} ${unit}`,
              )
              .replace("{csd}", fmtNum(QC_CHART.sd, locale, 1))}
          </Note>
        </div>

        <TableView
          locale={locale}
          caption={t(locale, "labQcTableCaption")}
          columns={[
            { key: "run", label: t(locale, "labColRun"), numeric: true },
            { key: "date", label: t(locale, "labColDate") },
            {
              key: "value",
              label: t(locale, "labColResult").replace("{v}", unit),
              numeric: true,
            },
            { key: "z", label: t(locale, "labColFromMean"), numeric: true },
            { key: "analyst", label: t(locale, "labColAnalyst") },
            { key: "flag", label: t(locale, "labColRule") },
          ]}
          rows={QC_CHART.points.map((p) => {
            const z = (p.value - QC_CHART.mean) / QC_CHART.sd;
            return {
              run: fmtNum(p.run, locale),
              date: fmtDate(p.date, locale),
              value: fmtNum(p.value, locale, 1),
              z: `${z > 0 ? "+" : "−"}${fmtNum(Math.abs(z), locale, 2)} SD`,
              analyst: p.analyst[locale],
              flag: p.flag ? WESTGARD_RULES[p.flag].label : "—",
            };
          })}
        />
      </Card>

      {/* ------------------------------------------------------------ flags */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card
          title={t(locale, "labFlaggedTitle")}
          subtitle={t(locale, "labFlaggedSub")}
        >
          <ul className="divide-y divide-line">
            {s.qcFlagged.map((p) => {
              const rule = WESTGARD_RULES[p.flag!];
              const z = (p.value - QC_CHART.mean) / QC_CHART.sd;
              return (
                <li key={p.run} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      tone={rule.action === "reject" ? "critical" : "warning"}
                      label={t(
                        locale,
                        rule.action === "reject"
                          ? "labFlagRejected"
                          : "labFlagWarning",
                      )}
                    />
                    <span className="text-sm font-semibold text-ink">
                      {t(locale, "qcRun")} {fmtNum(p.run, locale)} · {rule.label}
                    </span>
                    <span className="tnum ms-auto text-xs text-ink-3">
                      {fmtDate(p.date, locale)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                    {t(locale, "labFlagRead")
                      .replace("{v}", `${fmtNum(p.value, locale, 1)} ${unit}`)
                      .replace("{z}", fmtNum(Math.abs(z), locale, 2))
                      .replace(
                        "{dir}",
                        t(locale, z > 0 ? "labAbove" : "labBelow"),
                      )}{" "}
                    {rule.meaning[locale]} {p.analyst[locale]}.
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            <Note>
              {t(locale, "labFlaggedNote").replace(
                "{v}",
                `${fmtNum(48.6, locale, 1)} ${unit}`,
              )}
            </Note>
          </div>
        </Card>

        <Card
          title={t(locale, "labWestgardTitle")}
          subtitle={t(locale, "labWestgardSub")}
        >
          <ul className="divide-y divide-line">
            {(
              Object.keys(WESTGARD_RULES) as (keyof typeof WESTGARD_RULES)[]
            ).map((k) => {
              const r = WESTGARD_RULES[k];
              return (
                <li
                  key={k}
                  className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="tnum w-10 shrink-0 text-sm font-semibold text-ink">
                    {r.label}
                  </span>
                  <span className="flex-1 text-xs leading-relaxed text-ink-2">
                    {r.meaning[locale]}
                  </span>
                  <StatusPill
                    tone={r.action === "reject" ? "critical" : "warning"}
                    label={t(
                      locale,
                      r.action === "reject" ? "labReject" : "labWarn",
                    )}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* ------------------------------------------------ per-department QC */}
      <Card
        className="mt-5"
        title={t(locale, "labQcDeptTitle")}
        subtitle={t(locale, "labQcDeptSub")}
      >
        <ul className="space-y-4">
          {QC_SUMMARY.map((q) => {
            const pct = (q.passed / q.runs) * 100;
            const dept = departmentName(q.department)[locale];
            return (
              <li key={q.department}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-ink">{dept}</span>
                  <span className="text-xs text-ink-3">
                    <span className="tnum font-semibold text-ink">
                      {fmtPct(pct, locale, 1)}
                    </span>{" "}
                    {t(locale, "labQcPassWord")} ·{" "}
                    {t(locale, "labQcRunsWord").replace(
                      "{v}",
                      fmtNum(q.runs, locale),
                    )}
                  </span>
                </div>
                <div
                  className="mt-1.5 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
                  role="img"
                  aria-label={t(locale, "labQcDeptAria")
                    .replace("{dept}", dept)
                    .replace("{p}", fmtNum(q.passed, locale))
                    .replace("{w}", fmtNum(q.warnings, locale))
                    .replace("{r}", fmtNum(q.rejected, locale))
                    .replace("{n}", fmtNum(q.runs, locale))}
                >
                  <span
                    style={{
                      width: `${(q.passed / q.runs) * 100}%`,
                      background: "var(--st-good)",
                    }}
                  />
                  {q.warnings > 0 && (
                    <span
                      style={{
                        width: `${(q.warnings / q.runs) * 100}%`,
                        background: "var(--st-warning)",
                      }}
                    />
                  )}
                  {q.rejected > 0 && (
                    <span
                      style={{
                        width: `${(q.rejected / q.runs) * 100}%`,
                        background: "var(--st-critical)",
                      }}
                    />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-ink-3">
                  {t(locale, "labQcDeptLine")
                    .replace("{p}", fmtNum(q.passed, locale))
                    .replace("{w}", fmtNum(q.warnings, locale))
                    .replace("{r}", fmtNum(q.rejected, locale))}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-5">
          <Note>{t(locale, "labQcDeptNote")}</Note>
        </div>
        <TableView
          locale={locale}
          caption={t(locale, "labQcDeptTableCaption")}
          columns={[
            { key: "dept", label: t(locale, "labColDept") },
            { key: "runs", label: t(locale, "labColRuns"), numeric: true },
            { key: "passed", label: t(locale, "labColPassed"), numeric: true },
            { key: "warnings", label: t(locale, "labColWarnings"), numeric: true },
            { key: "rejected", label: t(locale, "labColRejectedCol"), numeric: true },
            { key: "rate", label: t(locale, "labColPassRate"), numeric: true },
          ]}
          rows={QC_SUMMARY.map((q) => ({
            dept: departmentName(q.department)[locale],
            runs: fmtNum(q.runs, locale),
            passed: fmtNum(q.passed, locale),
            warnings: fmtNum(q.warnings, locale),
            rejected: fmtNum(q.rejected, locale),
            rate: fmtPct((q.passed / q.runs) * 100, locale, 1),
          }))}
        />
      </Card>
    </>
  );
}
