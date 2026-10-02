"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { ColumnChart } from "./charts/column-chart";
import { TableView } from "./table-view";
import { Card, Meter, Note, PageHeader, StatTile, StatusPill } from "./ui";
import {
  available,
  downtime,
  materials,
  needsReorder,
  productionSummary,
  stockCover,
} from "@/lib/demo/business";
import { fmtNum, fmtPct } from "@/lib/format";
import { pick, t, type Locale } from "@/lib/i18n";
import { downloadCsv } from "@/lib/download";
import { buttonClass, fieldClass } from "./control-styles";

export function InventoryDashboard({ locale }: { locale: Locale }) {
  const copy = (en: string, fa: string) => (locale === "fa" ? fa : en);
  const [line, setLine] = useState("all");
  const [query, setQuery] = useState("");
  const [riskOnly, setRiskOnly] = useState(false);
  const production = productionSummary(line);
  const filtered = materials.filter(
    (row) =>
      (!riskOnly || needsReorder(row)) &&
      `${row.id} ${row.name.en} ${row.name.fa}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const risks = materials.filter(needsReorder);
  const stops = downtime.filter((row) => line === "all" || row.line === line);
  const states = {
    released: copy("Released", "آزادشده"),
    quality: copy("Awaiting QC", "در انتظار کنترل کیفیت"),
    running: copy("In production", "در حال تولید"),
    planned: copy("Planned", "برنامه‌ریزی‌شده"),
  };
  const kg = copy("kg", "کیلوگرم");
  return (
    <>
      <PageHeader
        title={t(locale, "inventoryTitle")}
        subtitle={copy(
          "Vertex Materials · fictional manufacturing site",
          "مواد صنعتی ورتکس · کارخانهٔ فرضی",
        )}
      >
        <label className="flex items-center gap-2 text-xs text-ink-2">
          {copy("Production line", "خط تولید")}
          <select
            className={fieldClass}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          >
            <option value="all">{copy("All lines", "همهٔ خطوط")}</option>
            <option value="A">{copy("Line A", "خط A")}</option>
            <option value="B">{copy("Line B", "خط B")}</option>
          </select>
        </label>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={copy("Completed output today", "تولید تکمیل‌شدهٔ امروز")}
          value={fmtNum(production.output, locale)}
          unit={kg}
          hint={copy(
            "Includes completed batches awaiting QC",
            "شامل بچ‌های تکمیل‌شده در انتظار کنترل کیفیت",
          )}
        />
        <StatTile
          label={copy("Mass yield", "بازده جرمی")}
          value={fmtPct(production.yield, locale, 1)}
          hint={copy(
            "Output ÷ input of completed batches only",
            "خروجی تقسیم بر ورودی، فقط برای بچ‌های تکمیل‌شده",
          )}
        />
        <StatTile
          label={copy("Recorded downtime", "توقف ثبت‌شده")}
          value={fmtNum(production.downtime, locale)}
          unit={copy("min", "دقیقه")}
          hint={copy(
            "Today · selected production line",
            "امروز · خط تولید انتخابی",
          )}
        />
        <StatTile
          label={copy(
            "Materials below lead-time cover",
            "مواد با پوشش کمتر از زمان تأمین",
          )}
          value={fmtNum(risks.length, locale)}
          unit={copy("items", "قلم")}
          hint={copy("Shared warehouse · all lines", "انبار مشترک · همهٔ خطوط")}
        />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card
          title={copy("Production against plan", "تولید نسبت به برنامه")}
          subtitle={copy(
            "Today · selected line · kilograms",
            "امروز · خط انتخابی · کیلوگرم",
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-semibold">
              {fmtPct(
                (production.output / production.planned) * 100,
                locale,
                1,
              )}
            </span>
            <span className="text-xs text-ink-3">
              {fmtNum(production.output, locale)} /{" "}
              {fmtNum(production.planned, locale)} {kg}
            </span>
          </div>
          <div className="mt-4">
            <Meter
              value={production.output}
              max={production.planned}
              label={copy(
                "Completed output against plan",
                "تولید تکمیل‌شده نسبت به برنامه",
              )}
            />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-xs text-ink-3">
                {copy("QC released", "آزادشده توسط کنترل کیفیت")}
              </dt>
              <dd className="mt-2 font-semibold">
                {fmtNum(production.released, locale)} {kg}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-3">
                {copy("Awaiting QC", "در انتظار کنترل کیفیت")}
              </dt>
              <dd className="mt-2 font-semibold">
                {fmtNum(production.output - production.released, locale)} {kg}
              </dd>
            </div>
          </dl>
          <div className="mt-5">
            <Note>
              {copy(
                "Running and planned batches are excluded from completed output and mass yield.",
                "بچ‌های در حال تولید و برنامه‌ریزی‌شده در تولید تکمیل‌شده و بازده جرمی محاسبه نمی‌شوند.",
              )}
            </Note>
          </div>
        </Card>
        <Card
          title={copy("Downtime by event", "توقف به تفکیک رویداد")}
          subtitle={copy("Minutes · selected line", "دقیقه · خط انتخابی")}
        >
          <ColumnChart
            locale={locale}
            data={stops.map((row) => ({
              label: pick(row.reason, locale),
              value: row.minutes,
            }))}
            valueLabel={copy("Minutes", "دقیقه")}
            ariaLabel={copy(
              "Recorded production downtime",
              "توقف ثبت‌شدهٔ تولید",
            )}
            height={180}
            slot={2}
          />
          <TableView
            locale={locale}
            caption={copy("Downtime events", "رویدادهای توقف")}
            columns={[
              { key: "reason", label: copy("Event", "رویداد") },
              { key: "line", label: copy("Line", "خط") },
              {
                key: "minutes",
                label: copy("Minutes", "دقیقه"),
                numeric: true,
              },
            ]}
            rows={stops.map((row) => ({
              reason: pick(row.reason, locale),
              line: row.line,
              minutes: fmtNum(row.minutes, locale),
            }))}
          />
        </Card>
      </div>
      <div className="mt-5">
        <Card
          title={copy("Material availability", "موجودی قابل مصرف مواد")}
          subtitle={copy(
            "Shared warehouse · available = on hand − reserved; cover excludes incoming stock",
            "انبار مشترک · قابل مصرف = موجودی منهای رزرو؛ محمولهٔ در راه در پوشش محاسبه نمی‌شود",
          )}
        >
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-xs text-ink-2">
              {t(locale, "search")}
              <input
                className={fieldClass}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy("Material or code", "نام یا کد ماده")}
              />
            </label>
            <label className="flex min-h-10 items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={riskOnly}
                onChange={(e) => setRiskOnly(e.target.checked)}
              />
              {copy("Reorder risks only", "فقط موارد نیازمند تأمین")}
            </label>
            <button
              className={buttonClass}
              onClick={() =>
                downloadCsv("material-availability.csv", [
                  [
                    "Material",
                    "Name",
                    "On hand kg",
                    "Reserved kg",
                    "Available kg",
                    "Daily usage kg",
                    "Cover days",
                    "Lead days",
                    "Incoming kg",
                  ],
                  ...filtered.map((row) => [
                    row.id,
                    pick(row.name, locale),
                    row.stock,
                    row.reserved,
                    available(row),
                    row.dailyUse,
                    Number(stockCover(row).toFixed(2)),
                    row.leadDays,
                    row.incoming,
                  ]),
                ])
              }
            >
              <Download size={14} />
              {copy("Export CSV", "خروجی CSV")}
            </button>
            <span aria-live="polite" className="py-2 text-xs text-ink-3">
              {fmtNum(filtered.length, locale)} {t(locale, "records")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <caption className="sr-only">
                {copy(
                  "Material stock in kilograms",
                  "موجودی مواد بر حسب کیلوگرم",
                )}
              </caption>
              <thead>
                <tr className="border-b border-line text-ink-3">
                  {[
                    copy("Material", "ماده"),
                    copy("On hand / reserved (kg)", "موجودی / رزرو (کیلوگرم)"),
                    copy("Available (kg)", "قابل مصرف (کیلوگرم)"),
                    copy("Cover / lead (days)", "پوشش / تأمین (روز)"),
                    copy("Incoming (kg)", "در راه (کیلوگرم)"),
                    t(locale, "status"),
                  ].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="px-2 py-3 text-start font-medium whitespace-nowrap"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-line/60">
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="font-medium">
                        {pick(row.name, locale)}
                      </div>
                      <div className="mt-1 text-ink-3" dir="ltr">
                        {row.id}
                      </div>
                    </td>
                    <td className="tnum px-2 py-3 whitespace-nowrap">
                      {fmtNum(row.stock, locale)} /{" "}
                      {fmtNum(row.reserved, locale)}
                    </td>
                    <td className="tnum px-2 py-3">
                      {fmtNum(available(row), locale)}
                    </td>
                    <td className="tnum px-2 py-3 whitespace-nowrap">
                      {fmtNum(stockCover(row), locale, 1)} /{" "}
                      {fmtNum(row.leadDays, locale)}
                    </td>
                    <td className="tnum px-2 py-3">
                      {fmtNum(row.incoming, locale)}
                    </td>
                    <td className="px-2 py-3">
                      <StatusPill
                        tone={needsReorder(row) ? "warning" : "good"}
                        label={
                          needsReorder(row)
                            ? copy("Reorder risk", "نیازمند تأمین")
                            : copy("Covered", "پوشش کافی")
                        }
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ink-3">
                      {t(locale, "noMatch")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Note>
              {copy(
                "Cover = available stock ÷ average daily use. Reorder risk means cover is shorter than supplier lead time; incoming stock has no confirmed arrival date in this demo.",
                "پوشش برابر موجودی قابل مصرف تقسیم بر مصرف متوسط روزانه است. اگر پوشش از زمان تأمین کمتر باشد، ماده نیازمند تأمین است. زمان ورود محموله‌ها در این دمو مشخص نیست.",
              )}
            </Note>
          </div>
        </Card>
      </div>
      <div className="mt-5">
        <Card
          title={copy("Today's batch schedule", "برنامهٔ بچ‌های امروز")}
          subtitle={copy("Selected production line", "خط تولید انتخابی")}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {production.rows.map((row) => (
              <article
                key={row.id}
                className="rounded-xl border border-line bg-surface-2 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold" dir="ltr">
                    {row.id} · {row.line}
                  </span>
                  <StatusPill
                    tone={
                      row.status === "released"
                        ? "good"
                        : row.status === "quality"
                          ? "warning"
                          : "idle"
                    }
                    label={states[row.status]}
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold">
                  {pick(row.product, locale)}
                </h3>
                <p className="mt-2 text-xs text-ink-3">
                  {copy("Plan", "برنامه")}: {fmtNum(row.planned, locale)} {kg}
                </p>
                <p className="mt-1 text-xs text-ink-3">
                  {copy("Completed output", "تولید تکمیل‌شده")}:{" "}
                  {fmtNum(row.output, locale)} {kg}
                </p>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
