import type { Metadata } from "next";
import { StackedBar } from "@/components/charts/stacked-bar";
import { SamplePipeline } from "@/components/sample-pipeline";
import { SampleRegister } from "@/components/sample-register";
import { TableView } from "@/components/table-view";
import { Card, Note, PageHeader, StatTile } from "@/components/ui";
import {
  BACKLOG,
  SAMPLES,
  SAMPLE_STATUS_LABEL,
  WORKLOAD,
  departmentName,
  departmentSlot,
} from "@/lib/demo/laboratory";
import * as s from "@/lib/demo/selectors";
import { fmtNum, fmtPct } from "@/lib/format";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/laboratory/samples">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { title: t(l, "labSamplesTitle") };
}

const inFlight = BACKLOG.filter((b) => b.status !== "on-hold");
const underTest = BACKLOG.find((b) => b.status === "testing")?.count ?? 0;
const atRisk = SAMPLES.filter(
  (x) => x.status !== "reported" && x.elapsedHours / x.targetHours >= 0.85,
);

export default async function SamplesPage({
  params,
}: PageProps<"/[locale]/demo/laboratory/samples">) {
  const { locale } = (await params) as { locale: Locale };

  return (
    <>
      <PageHeader
        title={t(locale, "labSamplesTitle")}
        subtitle={t(locale, "labSamplesSub")}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t(locale, "labKpiActive")}
          value={fmtNum(s.activeSamples, locale)}
          hint={t(locale, "labKpiActiveHint")}
        />
        <StatTile
          label={t(locale, "labKpiUnderTest")}
          value={fmtNum(underTest, locale)}
          delta={fmtPct((underTest / s.activeSamples) * 100, locale, 0)}
          deltaLabel={t(locale, "labKpiOfActiveBook")}
          hint={t(locale, "labKpiOnBenchNow")}
        />
        <StatTile
          label={t(locale, "labKpiOnHold")}
          value={fmtNum(s.onHold, locale)}
          hint={t(locale, "labKpiOnHoldHint")}
        />
        <StatTile
          label={t(locale, "labKpiRegisteredToday")}
          value={fmtNum(s.today.received, locale)}
          delta={t(locale, "labKpiReportedSoFar").replace(
            "{v}",
            fmtNum(s.today.reported, locale),
          )}
          deltaLabel={t(locale, "labKpiSoFarToday")}
          hint={t(locale, "labKpiIntakeOpen")}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card
          title={t(locale, "labPipelineTitle")}
          subtitle={t(locale, "labPipelineSub")}
        >
          <SamplePipeline locale={locale} stages={inFlight} />
          <div className="mt-4">
            <Note>
              {t(locale, "labPipelineNote").replace(
                "{v}",
                fmtNum(s.onHold, locale),
              )}
            </Note>
          </div>
          <TableView
            locale={locale}
            caption={t(locale, "labPipelineSub")}
            columns={[
              { key: "stage", label: t(locale, "labColStage") },
              { key: "count", label: t(locale, "labSamplesUnit"), numeric: true },
              { key: "share", label: t(locale, "share"), numeric: true },
            ]}
            rows={BACKLOG.map((b) => ({
              stage: SAMPLE_STATUS_LABEL[b.status][locale],
              count: fmtNum(b.count, locale),
              share: fmtPct((b.count / s.activeSamples) * 100, locale, 1),
            }))}
          />
        </Card>

        <Card
          title={t(locale, "labCarryTitle")}
          subtitle={t(locale, "labCarrySub").replace(
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
            <Note>{t(locale, "labCarryNote")}</Note>
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

      <Card
        className="mt-5"
        title={t(locale, "labRegisterTitle")}
        subtitle={t(locale, "labRegisterSub")}
        action={
          <span className="text-xs text-ink-3">
            {t(locale, "labPast85").replace(
              "{v}",
              fmtNum(atRisk.length, locale),
            )}
          </span>
        }
      >
        <SampleRegister locale={locale} samples={SAMPLES} />
        <div className="mt-4">
          <Note>{t(locale, "labRegisterNote")}</Note>
        </div>
      </Card>
    </>
  );
}
