import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { ColumnChart } from "@/components/charts/column-chart";
import { TableView } from "@/components/table-view";
import {
  Badge,
  Card,
  Meter,
  Note,
  PageHeader,
  StatTile,
  StatusPill,
  type StatusTone,
} from "@/components/ui";
import {
  INSTRUMENTS,
  INSTRUMENT_STATE_LABEL,
  TODAY,
  departmentName,
  type Instrument,
  type InstrumentState,
} from "@/lib/demo/laboratory";
import * as s from "@/lib/demo/selectors";
import { daysUntil, fmtDate, fmtNum, fmtPct } from "@/lib/format";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/laboratory/instruments">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { title: t(l, "labInstrumentsTitle") };
}

const STATE_TONE: Record<InstrumentState, StatusTone> = {
  operational: "good",
  maintenance: "serious",
  "out-of-service": "critical",
};

/** Sorted soonest-first; overdue sorts above everything. */
const schedule = [...INSTRUMENTS].sort(
  (a, b) =>
    daysUntil(a.nextCalibration, TODAY) - daysUntil(b.nextCalibration, TODAY),
);

const utilisationRanked = [...INSTRUMENTS]
  .filter((i) => i.state !== "out-of-service")
  .sort((a, b) => b.utilisation - a.utilisation);

export default async function InstrumentsPage({
  params,
}: PageProps<"/[locale]/demo/laboratory/instruments">) {
  const { locale } = (await params) as { locale: Locale };
  const top = utilisationRanked[0];

  return (
    <>
      <PageHeader
        title={t(locale, "labInstrumentsTitle")}
        subtitle={t(locale, "labInstrumentsSub")}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label={t(locale, "labKpiOperational")}
          value={fmtNum(s.instrumentsOperational, locale)}
          unit={t(locale, "labKpiOf").replace(
            "{v}",
            fmtNum(s.instrumentsTotal, locale),
          )}
          hint={t(locale, "labKpiOffBench")
            .replace("{v}", fmtNum(s.instrumentsDown.length, locale))
            .replace("{ids}", s.instrumentsDown.map((i) => i.id).join(", "))}
        />
        <StatTile
          label={t(locale, "labKpiMeanUptimeLabel")}
          value={fmtPct(s.meanUptime, locale, 1)}
          hint={t(locale, "labKpiAcrossAll")}
        />
        <StatTile
          label={t(locale, "labKpiCalibrationsDue")}
          value={fmtNum(s.calibrationsDueSoon.length, locale)}
          unit={t(locale, "labKpiIn7Days")}
          delta={t(locale, "labKpiLapsed").replace(
            "{v}",
            fmtNum(s.calibrationsOverdue.length, locale),
          )}
          deltaGood={s.calibrationsOverdue.length === 0}
          deltaLabel={t(locale, "labKpiAlreadyPastDue")}
        />
        <StatTile
          label={t(locale, "labKpiHighestUtil")}
          value={fmtPct(top.utilisation, locale, 0)}
          hint={`${top.id} — ${top.model}`}
        >
          <Meter
            value={top.utilisation}
            tone={top.utilisation >= 90 ? "warning" : "accent"}
            label={`${top.id}`}
          />
        </StatTile>
      </div>

      {/* ------------------------------------------------- calibration schedule */}
      <Card
        className="mt-6"
        title={t(locale, "labCalTitle")}
        subtitle={t(locale, "labCalSub")}
        action={
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-3">
            <CalendarClock size={14} aria-hidden />
            {t(locale, "labAsAt").replace("{v}", fmtDate(TODAY, locale))}
          </span>
        }
      >
        <ul className="divide-y divide-line">
          {schedule.slice(0, 6).map((i) => {
            const days = daysUntil(i.nextCalibration, TODAY);
            const tone: StatusTone =
              days < 0 ? "critical" : days <= 7 ? "warning" : "good";
            const label =
              days < 0
                ? t(locale, "labDaysOverdue").replace(
                    "{v}",
                    fmtNum(Math.abs(days), locale),
                  )
                : days === 0
                  ? t(locale, "labDueToday")
                  : t(locale, "labInDays").replace("{v}", fmtNum(days, locale));
            return (
              <li
                key={i.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0"
              >
                <span className="tnum w-20 shrink-0 text-sm font-medium text-ink">
                  {i.id}
                </span>
                <span className="min-w-0 flex-1 text-sm text-ink-2">
                  {i.name[locale]}
                  <span className="text-ink-3"> · {i.model}</span>
                </span>
                <span className="tnum whitespace-nowrap text-xs text-ink-3">
                  {fmtDate(i.nextCalibration, locale)}
                </span>
                <StatusPill tone={tone} label={label} />
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <Note>
            {t(locale, "labCalNote").replace(
              "{v}",
              fmtDate("2026-09-19", locale),
            )}
          </Note>
        </div>
        <TableView
          locale={locale}
          caption={t(locale, "labCalTableCaption")}
          columns={[
            { key: "id", label: t(locale, "labColInstrument") },
            { key: "model", label: t(locale, "labColModel") },
            { key: "last", label: t(locale, "labColLastCal") },
            { key: "next", label: t(locale, "labColNextCal") },
            { key: "days", label: t(locale, "labColDays"), numeric: true },
          ]}
          rows={schedule.map((i) => ({
            id: i.id,
            model: i.model,
            last: fmtDate(i.lastCalibration, locale),
            next: fmtDate(i.nextCalibration, locale),
            days: fmtNum(daysUntil(i.nextCalibration, TODAY), locale),
          }))}
        />
      </Card>

      {/* ------------------------------------------------------ utilisation */}
      <Card
        className="mt-5"
        title={t(locale, "labUtilTitle")}
        subtitle={t(locale, "labUtilSub")}
      >
        <ColumnChart
          locale={locale}
          ariaLabel={t(locale, "labUtilAria")}
          data={utilisationRanked.map((i) => ({
            label: i.id,
            value: i.utilisation,
            note: `${i.name[locale]} · ${departmentName(i.department)[locale]}`,
          }))}
          slot={1}
          height={210}
          format="percent"
          valueLabel={t(locale, "labUtilMeasure")}
          target={90}
          targetLabel={t(locale, "labUtilCeiling")}
        />
        <div className="mt-3">
          <Note>{t(locale, "labUtilNote")}</Note>
        </div>
        <TableView
          locale={locale}
          caption={t(locale, "labUtilTableCaption")}
          columns={[
            { key: "id", label: t(locale, "labColInstrument") },
            { key: "dept", label: t(locale, "labColDept") },
            { key: "util", label: t(locale, "labColUtil"), numeric: true },
            { key: "uptime", label: t(locale, "labColUptime"), numeric: true },
          ]}
          rows={utilisationRanked.map((i) => ({
            id: i.id,
            dept: departmentName(i.department)[locale],
            util: fmtPct(i.utilisation, locale, 0),
            uptime: fmtPct(i.uptime30d, locale, 1),
          }))}
        />
      </Card>

      {/* --------------------------------------------------------- the fleet */}
      <Card
        className="mt-5"
        title={t(locale, "labFleetTitle")}
        subtitle={t(locale, "labFleetSub").replace(
          "{v}",
          fmtNum(INSTRUMENTS.length, locale),
        )}
      >
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {INSTRUMENTS.map((i) => (
            <InstrumentCard key={i.id} instrument={i} locale={locale} />
          ))}
        </ul>
      </Card>
    </>
  );
}

function InstrumentCard({
  instrument: i,
  locale,
}: {
  instrument: Instrument;
  locale: Locale;
}) {
  const days = daysUntil(i.nextCalibration, TODAY);

  return (
    <li className="rounded-xl border border-line bg-surface-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="tnum text-sm font-semibold text-ink">{i.id}</div>
          <div className="truncate text-xs text-ink-2">{i.name[locale]}</div>
          <div className="truncate text-[11px] text-ink-3" dir="ltr">
            {i.model}
          </div>
        </div>
        <StatusPill
          tone={STATE_TONE[i.state]}
          label={INSTRUMENT_STATE_LABEL[i.state][locale]}
        />
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-ink-3">{t(locale, "labColUtil")}</span>
          <span className="tnum font-semibold text-ink">
            {fmtPct(i.utilisation, locale, 0)}
          </span>
        </div>
        <div className="mt-1.5">
          <Meter
            value={i.utilisation}
            tone={i.utilisation >= 90 ? "warning" : "accent"}
            label={i.id}
          />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        <dt className="text-ink-3">{t(locale, "labColUptime")}</dt>
        <dd className="tnum text-end text-ink-2">
          {fmtPct(i.uptime30d, locale, 1)}
        </dd>
        <dt className="text-ink-3">{t(locale, "labColNextCal")}</dt>
        <dd className="tnum text-end text-ink-2">
          {fmtDate(i.nextCalibration, locale)}
        </dd>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{departmentName(i.department)[locale]}</Badge>
        {days < 0 && (
          <Badge className="text-st-critical">
            {t(locale, "labCalLapsedBadge")}
          </Badge>
        )}
        {days >= 0 && days <= 7 && (
          <Badge>
            {t(locale, "labCalDueBadge").replace("{v}", fmtNum(days, locale))}
          </Badge>
        )}
      </div>

      {i.note && (
        <p className="mt-3 border-t border-line pt-2.5 text-[11px] leading-relaxed text-ink-3">
          {i.note[locale]}
        </p>
      )}
    </li>
  );
}
