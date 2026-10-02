import type { Metadata } from "next";
import { BulletBars } from "@/components/charts/bullet-bars";
import { LineChart } from "@/components/charts/line-chart";
import { TableView } from "@/components/table-view";
import {
  Card,
  Note,
  PageHeader,
  StatTile,
  StatusPill,
} from "@/components/ui";
import {
  DAILY,
  TAT_TARGET_HOURS,
  TEST_TAT,
  departmentName,
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
}: PageProps<"/[locale]/demo/laboratory/turnaround">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { title: t(l, "labTurnaroundTitle") };
}

const ON_TIME_TARGET = 95;

/** Slowest relative to its own commitment first — the order that matters. */
const ranked = [...TEST_TAT].sort(
  (a, b) => b.medianHours / b.targetHours - a.medianHours / a.targetHours,
);

const tailRisk = TEST_TAT.filter(
  (x) => x.medianHours <= x.targetHours && x.p90Hours > x.targetHours,
);

export default async function TurnaroundPage({
  params,
}: PageProps<"/[locale]/demo/laboratory/turnaround">) {
  const { locale } = (await params) as { locale: Locale };
  const xLabels = DAILY.map((d) => fmtDateShort(d.date, locale));
  const commitment = fmtHours(TAT_TARGET_HOURS, locale);
  const goal = fmtPct(ON_TIME_TARGET, locale, 0);

  return (
    <>
      <PageHeader
        title={t(locale, "labTurnaroundTitle")}
        subtitle={t(locale, "labTurnaroundSub")}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t(locale, "labKpiMedianTat30")}
          value={fmtNum(s.medianTat30d, locale, 1)}
          unit={locale === "fa" ? "ساعت" : "h"}
          delta={fmtDelta(s.medianTat30d - TAT_TARGET_HOURS, locale, 1)}
          deltaLabel={t(locale, "labAgainstCommitment")}
          deltaGood={s.medianTat30d <= TAT_TARGET_HOURS}
          hint={t(locale, "labAcross30Days")}
        />
        <StatTile
          label={t(locale, "labKpiOnTime30")}
          value={fmtPct(s.onTime30d, locale, 1)}
          delta={fmtDelta(s.onTime30d - ON_TIME_TARGET, locale, 1)}
          deltaLabel={t(locale, "labAgainstGoal").replace("{v}", goal)}
          deltaGood={s.onTime30d >= ON_TIME_TARGET}
          hint={t(locale, "labKpiReportsIssued").replace(
            "{v}",
            fmtNum(s.reports30d, locale),
          )}
        />
        <StatTile
          label={t(locale, "labKpiDaysWithin")}
          value={fmtPct(s.daysWithinTarget, locale, 0)}
          hint={t(locale, "labDaysWithinHint")
            .replace(
              "{a}",
              fmtNum(
                DAILY.filter((d) => d.medianTat <= TAT_TARGET_HOURS).length,
                locale,
              ),
            )
            .replace("{b}", fmtNum(DAILY.length, locale))
            .replace("{c}", commitment)}
        />
        <StatTile
          label={t(locale, "labKpiMethodsOver")}
          value={fmtNum(s.testsOverTarget.length, locale)}
          unit={t(locale, "labKpiOf").replace(
            "{v}",
            fmtNum(TEST_TAT.length, locale),
          )}
          delta={s.worstTat.name[locale]}
          deltaLabel={t(locale, "labIsTheWorst")}
          deltaGood={s.testsOverTarget.length === 0}
        />
      </div>

      {/* ------------------------------------------------------- the two trends */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card
          title={t(locale, "labTatOnlyTitle")}
          subtitle={t(locale, "labTatOnlySub").replace("{v}", commitment)}
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
            height={240}
            format="hours"
            target={TAT_TARGET_HOURS}
            targetLabel={commitment}
          />
          <Note>
            {t(locale, "labUnderSince").replace(
              "{v}",
              s.underTargetSince ? fmtDateShort(s.underTargetSince, locale) : "—",
            )}
          </Note>
        </Card>

        <Card
          title={t(locale, "labOnTimeTitle")}
          subtitle={t(locale, "labOnTimeSub").replace("{v}", goal)}
        >
          <LineChart
            locale={locale}
            ariaLabel={t(locale, "labOnTimeChartAria").replace("{v}", goal)}
            series={[
              {
                key: "onTime",
                label: t(locale, "labKpiOnTime30"),
                slot: 1,
                values: DAILY.map((d) => d.onTimePct),
              },
            ]}
            xLabels={xLabels}
            height={240}
            format="percent"
            target={ON_TIME_TARGET}
            targetLabel={goal}
          />
          <Note>{t(locale, "labOnTimeNote")}</Note>
        </Card>
      </div>

      {/* -------------------------------------------- turnaround per method */}
      <Card
        className="mt-5"
        title={t(locale, "labEveryMethodTitle")}
        subtitle={t(locale, "labEveryMethodSub")}
        action={
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <li className="flex items-center gap-1.5 text-xs text-ink-2">
              <span
                aria-hidden
                className="h-2.5 w-3.5 rounded-e-[2px]"
                style={{ background: "var(--s1)" }}
              />
              {t(locale, "median")}
            </li>
            <li className="flex items-center gap-1.5 text-xs text-ink-2">
              <span
                aria-hidden
                className="h-[3px] w-3.5 rounded-e-[2px]"
                style={{ background: "var(--s1)", opacity: 0.28 }}
              />
              {t(locale, "labP90")}
            </li>
            <li className="flex items-center gap-1.5 text-xs text-ink-2">
              <span
                aria-hidden
                className="h-3.5 w-0.5 rounded-full"
                style={{ background: "var(--ink-2)" }}
              />
              {t(locale, "target")}
            </li>
          </ul>
        }
      >
        <BulletBars
          locale={locale}
          rows={ranked.map((x) => ({
            key: x.code,
            label: x.name[locale],
            sublabel: `${x.method} · ${departmentName(x.department)[locale]}`,
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
          <Note>{t(locale, "labEveryMethodNote")}</Note>
        </div>
        <TableView
          locale={locale}
          caption={t(locale, "labMethodTableCaption")}
          columns={[
            { key: "name", label: t(locale, "labColMethod") },
            { key: "code", label: t(locale, "labColStandard") },
            { key: "dept", label: t(locale, "labColDept") },
            { key: "volume", label: t(locale, "labColVolume"), numeric: true },
            { key: "median", label: t(locale, "median"), numeric: true },
            { key: "p90", label: t(locale, "labColP90"), numeric: true },
            { key: "target", label: t(locale, "target"), numeric: true },
            { key: "ofTarget", label: t(locale, "labColOfTarget"), numeric: true },
          ]}
          rows={ranked.map((x) => ({
            name: x.name[locale],
            code: x.method,
            dept: departmentName(x.department)[locale],
            volume: fmtNum(x.volume, locale),
            median: fmtHours(x.medianHours, locale),
            p90: fmtHours(x.p90Hours, locale),
            target: fmtHours(x.targetHours, locale),
            ofTarget: fmtPct((x.medianHours / x.targetHours) * 100, locale, 0),
          }))}
        />
      </Card>

      {/* ----------------------------------------------------- the tail risk */}
      <Card
        className="mt-5"
        title={t(locale, "labTailTitle")}
        subtitle={t(locale, "labTailSub")}
      >
        <ul className="divide-y divide-line">
          {tailRisk.map((x) => (
            <li
              key={x.code}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink">
                  {x.name[locale]}
                </div>
                <div className="text-xs text-ink-3">
                  {x.method} · {departmentName(x.department)[locale]} ·{" "}
                  {t(locale, "labReportsWord").replace(
                    "{v}",
                    fmtNum(x.volume, locale),
                  )}
                </div>
              </div>
              <span className="tnum whitespace-nowrap text-xs text-ink-2">
                {t(locale, "labMedianWord").replace(
                  "{v}",
                  fmtHours(x.medianHours, locale),
                )}
              </span>
              <span className="tnum whitespace-nowrap text-xs font-semibold text-ink">
                {t(locale, "labP90Word").replace(
                  "{v}",
                  fmtHours(x.p90Hours, locale),
                )}
              </span>
              <StatusPill
                tone="warning"
                label={t(locale, "labTailOverAtP90").replace(
                  "{v}",
                  fmtHours(x.p90Hours - x.targetHours, locale),
                )}
              />
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Note>{t(locale, "labTailNote")}</Note>
        </div>
      </Card>
    </>
  );
}
