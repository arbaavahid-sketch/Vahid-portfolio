import type { Metadata } from "next";
import { AlertsPanel } from "@/components/alerts-panel";
import { BulletBars } from "@/components/charts/bullet-bars";
import { LineChart } from "@/components/charts/line-chart";
import { StackedBar } from "@/components/charts/stacked-bar";
import { SamplePipeline } from "@/components/sample-pipeline";
import { TableView } from "@/components/table-view";
import { Card, Legend, Note, PageHeader, StatTile } from "@/components/ui";
import {
  ALERTS,
  BACKLOG,
  DAILY,
  TAT_TARGET_HOURS,
  TEST_TAT,
  WORKLOAD,
  departmentName,
  departmentSlot,
} from "@/lib/demo/laboratory";
import * as s from "@/lib/demo/selectors";
import {
  fmtDateShort,
  fmtDelta,
  fmtHours,
  fmtNum,
  fmtPct,
} from "@/lib/format";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/laboratory">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { title: t(l, "labOverviewTitle") };
}

const inFlight = BACKLOG.filter((b) => b.status !== "on-hold");

export default async function LaboratoryOverview({
  params,
}: PageProps<"/[locale]/demo/laboratory">) {
  const { locale } = (await params) as { locale: Locale };
  const xLabels = DAILY.map((d) => fmtDateShort(d.date, locale));
  const commitment = fmtHours(TAT_TARGET_HOURS, locale);

  return (
    <>
      <PageHeader
        title={t(locale, "labOverviewTitle")}
        subtitle={t(locale, "labOverviewSub")}
      />

      {/* -------------------------------------------------- headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t(locale, "labKpiMedianTat")}
          value={fmtNum(s.today.medianTat, locale, 1)}
          unit={locale === "fa" ? "ساعت" : "h"}
          delta={fmtDelta(s.tatDelta, locale, 1)}
          deltaLabel={t(locale, "labKpiVs30dMedian")}
          deltaGood={s.tatDelta < 0}
          hint={t(locale, "labKpiCommitmentIs").replace("{v}", commitment)}
        />
        <StatTile
          label={t(locale, "labKpiOnTime")}
          value={fmtPct(s.today.onTimePct, locale, 1)}
          delta={fmtDelta(s.onTimeDelta, locale, 1)}
          deltaLabel={t(locale, "labKpiVs30dAvg")}
          deltaGood={s.onTimeDelta > 0}
          hint={t(locale, "labKpiReportsIssued").replace(
            "{v}",
            fmtNum(s.today.reported, locale),
          )}
        />
        <StatTile
          label={t(locale, "labKpiInstruments")}
          value={fmtNum(s.instrumentsOperational, locale)}
          unit={t(locale, "labKpiOf").replace(
            "{v}",
            fmtNum(s.instrumentsTotal, locale),
          )}
          delta={fmtPct(s.meanUptime, locale, 1)}
          deltaLabel={t(locale, "labKpiMeanUptime")}
          hint={t(locale, "labKpiCalDue")
            .replace("{a}", fmtNum(s.calibrationsDueSoon.length, locale))
            .replace("{b}", fmtNum(s.calibrationsOverdue.length, locale))}
        />
        <StatTile
          label={t(locale, "labKpiQcPass")}
          value={fmtPct(s.qcPassRate, locale, 1)}
          delta={t(locale, "labKpiRejected").replace(
            "{v}",
            fmtNum(s.qcRejected, locale),
          )}
          deltaLabel={t(locale, "labKpiOfRuns").replace(
            "{v}",
            fmtNum(s.qcRuns, locale),
          )}
          deltaGood={false}
          hint={t(locale, "labKpiLast30All")}
        />
      </div>

      {/* ------------------------------------------------ turnaround + backlog */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title={t(locale, "labTatCardTitle")}
          subtitle={t(locale, "labTatCardSub")}
        >
          <LineChart
            locale={locale}
            ariaLabel={t(locale, "labTatChartAria").replace("{v}", commitment)}
            series={[
              {
                key: "tat",
                label: t(locale, "labKpiMedianTat30"),
                slot: 1,
                values: DAILY.map((d) => d.medianTat),
              },
            ]}
            xLabels={xLabels}
            height={250}
            format="hours"
            target={TAT_TARGET_HOURS}
            targetLabel={commitment}
          />
          <Note>
            {t(locale, "labTatNote")
              .replace("{peak}", fmtHours(s.peakTatDay.medianTat, locale))
              .replace("{date}", fmtDateShort(s.peakTatDay.date, locale))
              .replace(
                "{since}",
                s.underTargetSince
                  ? fmtDateShort(s.underTargetSince, locale)
                  : "—",
              )}
          </Note>
          <TableView
            locale={locale}
            caption={t(locale, "labTatTableCaption")}
            columns={[
              { key: "date", label: t(locale, "labColDate") },
              { key: "tat", label: t(locale, "labColMedianTat"), numeric: true },
              { key: "reported", label: t(locale, "labColReports"), numeric: true },
              { key: "onTime", label: t(locale, "labColOnTime"), numeric: true },
            ]}
            rows={DAILY.map((d) => ({
              date: fmtDateShort(d.date, locale),
              tat: fmtHours(d.medianTat, locale),
              reported: fmtNum(d.reported, locale),
              onTime: fmtPct(d.onTimePct, locale, 1),
            }))}
          />
        </Card>

        <Card
          title={t(locale, "labBacklogTitle")}
          subtitle={t(locale, "labBacklogSub")}
        >
          <div>
            <div className="text-5xl font-semibold leading-none text-ink">
              {fmtNum(s.activeSamples, locale)}
            </div>
            <p className="mt-1.5 text-xs text-ink-3">
              {t(locale, "labBacklogHero").replace(
                "{v}",
                fmtNum(s.onHold, locale),
              )}
            </p>
          </div>
          <div className="mt-5">
            <SamplePipeline locale={locale} stages={inFlight} />
          </div>
          <Note>
            {t(locale, "labBacklogNote")
              .replace("{a}", fmtNum(s.today.received, locale))
              .replace("{b}", fmtNum(s.today.reported, locale))}
          </Note>
        </Card>
      </div>

      {/* --------------------------------------------------- intake + workload */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card
          title={t(locale, "labIntakeTitle")}
          subtitle={t(locale, "labIntakeSub")}
          action={
            <Legend
              shape="line"
              items={[
                { slot: 1, label: t(locale, "labRegistered") },
                { slot: 2, label: t(locale, "labReported") },
              ]}
            />
          }
        >
          <LineChart
            locale={locale}
            ariaLabel={t(locale, "labIntakeChartAria")}
            series={[
              {
                key: "received",
                label: t(locale, "labRegistered"),
                slot: 1,
                values: DAILY.map((d) => d.received),
              },
              {
                key: "reported",
                label: t(locale, "labReported"),
                slot: 2,
                values: DAILY.map((d) => d.reported),
              },
            ]}
            xLabels={xLabels}
            height={230}
            zeroBased
            format="number"
          />
          <Note>
            {t(locale, "labIntakeNote")
              .replace("{a}", fmtNum(s.received30d, locale))
              .replace("{b}", fmtNum(s.reports30d, locale))}
          </Note>
          <TableView
            locale={locale}
            caption={t(locale, "labIntakeChartAria")}
            columns={[
              { key: "date", label: t(locale, "labColDate") },
              { key: "received", label: t(locale, "labRegistered"), numeric: true },
              { key: "reported", label: t(locale, "labReported"), numeric: true },
            ]}
            rows={DAILY.map((d) => ({
              date: fmtDateShort(d.date, locale),
              received: fmtNum(d.received, locale),
              reported: fmtNum(d.reported, locale),
            }))}
          />
        </Card>

        <Card
          title={t(locale, "labWorkloadTitle")}
          subtitle={t(locale, "labWorkloadSub").replace(
            "{v}",
            fmtNum(s.workloadTotal, locale),
          )}
        >
          <StackedBar
            locale={locale}
            ariaLabel={t(locale, "labWorkloadAria")}
            unit={t(locale, "labSamplesUnit")}
            segments={WORKLOAD.map((w) => ({
              key: w.department,
              label: departmentName(w.department)[locale],
              slot: departmentSlot(w.department),
              value: w.active,
            }))}
          />
          <div className="mt-5">
            <Note>
              {t(locale, "labWorkloadNote")
                .replace(
                  "{dept}",
                  departmentName(s.busiestDepartment.department)[locale],
                )
                .replace("{n}", fmtNum(s.busiestDepartment.active, locale))}
            </Note>
          </div>
          <TableView
            locale={locale}
            caption={t(locale, "labWorkloadAria")}
            columns={[
              { key: "dept", label: t(locale, "labColDept") },
              { key: "active", label: t(locale, "labColActiveSamples"), numeric: true },
              { key: "share", label: t(locale, "share"), numeric: true },
            ]}
            rows={WORKLOAD.map((w) => ({
              dept: departmentName(w.department)[locale],
              active: fmtNum(w.active, locale),
              share: fmtPct((w.active / s.workloadTotal) * 100, locale, 1),
            }))}
          />
        </Card>
      </div>

      {/* ------------------------------------------------------ method pressure */}
      <Card
        className="mt-5"
        title={t(locale, "labMethodTitle")}
        subtitle={t(locale, "labMethodSub")}
        action={
          <span className="text-xs text-ink-3">
            {t(locale, "labMethodsOver")
              .replace("{a}", fmtNum(s.testsOverTarget.length, locale))
              .replace("{b}", fmtNum(TEST_TAT.length, locale))}
          </span>
        }
      >
        <BulletBars
          locale={locale}
          rows={[...TEST_TAT]
            .sort(
              (a, b) =>
                b.medianHours / b.targetHours - a.medianHours / a.targetHours,
            )
            .slice(0, 6)
            .map((x) => ({
              key: x.code,
              label: x.name[locale],
              sublabel: x.method,
              value: x.medianHours,
              target: x.targetHours,
              reach: x.p90Hours,
              volumeLabel: t(locale, "labReportsIn30d").replace(
                "{v}",
                fmtNum(x.volume, locale),
              ),
            }))}
          format="hours"
          scaleMode="ofTarget"
          valueLabel={t(locale, "median")}
          reachLabel={t(locale, "labP90")}
          targetLabel={t(locale, "target")}
        />
        <div className="mt-4">
          <Note>
            {t(locale, "labMethodNote")
              .replace("{a}", fmtHours(s.worstTat.medianHours, locale))
              .replace("{b}", fmtHours(s.worstTat.targetHours, locale))}
          </Note>
        </div>
      </Card>

      {/* --------------------------------------------------------------- alerts */}
      <Card
        className="mt-5"
        title={t(locale, "needsAttention")}
        subtitle={t(locale, "needsAttentionSub")}
      >
        <AlertsPanel locale={locale} alerts={ALERTS} />
      </Card>
    </>
  );
}
