"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { ColumnChart } from "./charts/column-chart";
import { TableView } from "./table-view";
import { Card, Meter, Note, PageHeader, StatTile, StatusPill } from "./ui";
import {
  opportunities,
  orders,
  orderStatus,
  outstanding,
  periods,
  salesSummary,
  salesTargets,
  type Period,
} from "@/lib/demo/business";
import {
  fmtDateShort,
  fmtMoney,
  fmtMoneyBare,
  moneyUnit,
  fmtInvoiceMonth,
  fmtNum,
  fmtPct,
} from "@/lib/format";
import { pick, t, type Locale } from "@/lib/i18n";
import { downloadCsv } from "@/lib/download";

import { fieldClass, buttonClass } from "./control-styles";

export function SalesDashboard({ locale }: { locale: Locale }) {
  const fa = locale === "fa";
  const copy = (en: string, persian: string) => (fa ? persian : en);
  const [period, setPeriod] = useState<Period>("2026-09");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const monthOrders = orders.filter((row) => row.date.startsWith(period));
  const summary = salesSummary(monthOrders);
  const target = salesTargets[period];
  const customers = [...new Set(monthOrders.map((row) => row.customer.en))]
    .map((key) => ({
      label: pick(
        monthOrders.find((row) => row.customer.en === key)!.customer,
        locale,
      ),
      value: monthOrders
        .filter((row) => row.customer.en === key)
        .reduce((sum, row) => sum + row.revenue, 0),
    }))
    .sort((a, b) => b.value - a.value);
  const filtered = monthOrders.filter(
    (row) =>
      (status === "all" || orderStatus(row) === status) &&
      `${row.id} ${row.customer.en} ${row.customer.fa} ${row.product.en} ${row.product.fa}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const labels = {
    paid: copy("Paid", "تسویه‌شده"),
    open: copy("Not yet due", "سررسید نرسیده"),
    overdue: copy("Overdue", "معوق"),
  };
  const stages = [
    { key: "qualified", label: copy("Qualified", "ارزیابی‌شده") },
    { key: "quoted", label: copy("Quoted", "پیش‌فاکتور") },
    { key: "negotiation", label: copy("Negotiation", "مذاکره") },
  ];
  const weighted = opportunities.reduce(
    (sum, row) => sum + row.value * row.probability,
    0,
  );
  const trend = periods.map((month) => ({
    label: fmtInvoiceMonth(month, locale),
    value: salesSummary(orders.filter((row) => row.date.startsWith(month)))
      .revenue,
  }));
  return (
    <>
      <PageHeader
        title={t(locale, "salesTitle")}
        subtitle={copy(
          "Atlas Trading · fictional chemical distributor",
          "بازرگانی اطلس · توزیع‌کنندهٔ فرضی مواد شیمیایی",
        )}
      >
        <label className="flex items-center gap-2 text-xs text-ink-2">
          {copy("Invoice month", "ماه صدور فاکتور (میلادی)")}
          <select
            className={fieldClass}
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as Period);
              setStatus("all");
              setQuery("");
            }}
          >
            {periods.map((month) => (
              <option key={month} value={month}>
                {fmtInvoiceMonth(month, locale)}
              </option>
            ))}
          </select>
        </label>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={copy("Invoiced revenue", "فروش فاکتورشده")}
          value={fmtMoneyBare(summary.revenue, locale)}
          unit={moneyUnit(summary.revenue, locale)}
          hint={`${copy("Monthly target", "هدف ماه")} · ${fmtMoney(target, locale)}`}
        >
          <Meter
            value={summary.revenue}
            max={target}
            label={copy("Revenue against target", "فروش نسبت به هدف")}
          />
        </StatTile>
        <StatTile
          label={copy("Gross margin", "حاشیهٔ سود ناخالص")}
          value={fmtPct(summary.margin, locale, 1)}
          hint={copy(
            "(Revenue − cost of goods) ÷ revenue",
            "(فروش منهای بهای کالا) تقسیم بر فروش",
          )}
        />
        <StatTile
          label={copy("Outstanding balance", "ماندهٔ مطالبات")}
          value={fmtMoneyBare(summary.outstanding, locale)}
          unit={moneyUnit(summary.outstanding, locale)}
          hint={copy(
            "Unpaid balance on this month's invoices",
            "ماندهٔ پرداخت‌نشدهٔ فاکتورهای این ماه",
          )}
        />
        <StatTile
          label={copy("Overdue balance", "مطالبات معوق")}
          value={fmtMoneyBare(summary.overdue, locale)}
          unit={moneyUnit(summary.overdue, locale)}
          hint={copy(
            "Selected invoices overdue at the snapshot date",
            "ماندهٔ فاکتورهای ماه انتخابی که سررسیدشان گذشته",
          )}
        />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card
          title={copy("Revenue by month", "فروش ماهانه")}
          subtitle={copy(
            "Million toman · September through 24 Sep, earlier months complete",
            "میلیون تومان · سپتامبر تا روز ۲۴؛ ماه‌های قبل کامل‌اند",
          )}
        >
          <ColumnChart
            locale={locale}
            data={trend}
            format="money"
            valueLabel={copy("Revenue", "فروش")}
            ariaLabel={copy(
              "Three-month invoiced revenue",
              "فروش فاکتورشده در سه ماه",
            )}
          />
          <TableView
            locale={locale}
            caption={copy("Monthly revenue", "فروش ماهانه")}
            columns={[
              { key: "month", label: copy("Month", "ماه") },
              { key: "value", label: copy("Revenue", "فروش"), numeric: true },
              { key: "target", label: t(locale, "target"), numeric: true },
            ]}
            rows={trend.map((row, i) => ({
              month: row.label,
              value: fmtMoney(row.value, locale),
              target: fmtMoney(salesTargets[periods[i]], locale),
            }))}
          />
        </Card>
        <Card
          title={copy("Customer concentration", "تمرکز مشتریان")}
          subtitle={copy(
            "Share of revenue in the selected invoice month",
            "سهم از فروش فاکتورشده در ماه انتخابی",
          )}
        >
          <div className="space-y-5">
            {customers.map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs">
                  <span>{row.label}</span>
                  <span className="tnum text-ink-2">
                    {fmtMoney(row.value, locale)} ·{" "}
                    {fmtPct((row.value / summary.revenue) * 100, locale, 1)}
                  </span>
                </div>
                <Meter
                  value={row.value}
                  max={summary.revenue}
                  label={row.label}
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Note>
              {copy(
                "Customer shares are calculated from the same invoices as the revenue total.",
                "سهم هر مشتری از همان فاکتورهایی محاسبه می‌شود که مبنای جمع فروش هستند.",
              )}
            </Note>
          </div>
        </Card>
      </div>
      <div className="mt-5">
        <Card
          title={copy("Invoice register", "فهرست فاکتورها")}
          subtitle={copy(
            "Search and status filters apply to this register and its export.",
            "جست‌وجو و فیلتر وضعیت فقط بر این فهرست و خروجی آن اعمال می‌شوند.",
          )}
        >
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-xs text-ink-2">
              {t(locale, "search")}
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy(
                  "Customer, invoice, product",
                  "مشتری، فاکتور، محصول",
                )}
                className={`${fieldClass} w-full sm:w-64`}
              />
            </label>
            <label className="grid gap-1 text-xs text-ink-2">
              {t(locale, "status")}
              <select
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">{t(locale, "all")}</option>
                {Object.entries(labels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className={buttonClass}
              onClick={() =>
                downloadCsv(`sales-${period}.csv`, [
                  [
                    "Invoice",
                    "Customer",
                    "Product",
                    "Date",
                    "Due",
                    "Revenue (M toman)",
                    "Outstanding (M toman)",
                    "Status",
                  ],
                  ...filtered.map((row) => [
                    row.id,
                    pick(row.customer, locale),
                    pick(row.product, locale),
                    row.date,
                    row.due,
                    row.revenue,
                    outstanding(row),
                    orderStatus(row),
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
            <table className="w-full text-start text-xs">
              <caption className="sr-only">
                {copy("Invoices for selected month", "فاکتورهای ماه انتخابی")}
              </caption>
              <thead>
                <tr className="border-b border-line text-ink-3">
                  {[
                    copy("Invoice / product", "فاکتور / محصول"),
                    copy("Customer", "مشتری"),
                    copy("Due", "سررسید"),
                    copy("Revenue", "فروش"),
                    copy("Balance", "مانده"),
                    t(locale, "status"),
                  ].map((label) => (
                    <th
                      scope="col"
                      key={label}
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
                    <td className="px-2 py-3">
                      <span className="font-medium" dir="ltr">
                        {row.id}
                      </span>
                      <div className="mt-1 text-ink-3">{pick(row.product, locale)}</div>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {pick(row.customer, locale)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {fmtDateShort(row.due, locale)}
                    </td>
                    <td className="tnum px-2 py-3 whitespace-nowrap">
                      {fmtMoney(row.revenue, locale)}
                    </td>
                    <td className="tnum px-2 py-3 whitespace-nowrap">
                      {fmtMoney(outstanding(row), locale)}
                    </td>
                    <td className="px-2 py-3">
                      <StatusPill
                        tone={
                          orderStatus(row) === "paid"
                            ? "good"
                            : orderStatus(row) === "overdue"
                              ? "critical"
                              : "idle"
                        }
                        label={labels[orderStatus(row)]}
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
        </Card>
      </div>
      <div className="mt-5">
        <Card
          title={copy("Open opportunity pipeline", "فرصت‌های باز فروش")}
          subtitle={copy(
            "Snapshot across all months · independent of invoice filters",
            "وضعیت فعلی همهٔ فرصت‌ها · مستقل از فیلتر فاکتورها",
          )}
          action={
            <span className="text-xs text-ink-2">
              {copy("Weighted value", "ارزش موزون")} ·{" "}
              {fmtMoney(weighted, locale)}
            </span>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {stages.map((stage, i) => {
              const rows = opportunities.filter(
                (row) => row.stage === stage.key,
              );
              return (
                <section
                  key={stage.key}
                  className="rounded-xl border border-line bg-surface-2 p-4"
                  style={{
                    borderTopColor: `var(--ord-${i + 2})`,
                    borderTopWidth: 3,
                  }}
                >
                  <h3 className="text-sm font-semibold">{stage.label}</h3>
                  <p className="mt-1 text-xs text-ink-3">
                    {fmtMoney(
                      rows.reduce((sum, row) => sum + row.value, 0),
                      locale,
                    )}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {rows.map((row) => (
                      <li
                        key={row.id}
                        className="rounded-lg border border-line bg-surface p-3 text-xs"
                      >
                        <div className="font-medium">{pick(row.customer, locale)}</div>
                        <div className="mt-2 flex justify-between gap-2 text-ink-3">
                          <span dir="ltr">{row.id}</span>
                          <span>{fmtMoney(row.value, locale)}</span>
                        </div>
                        <div className="mt-2 text-ink-3">
                          {copy("Assumed probability", "احتمال فرضی موفقیت")}:{" "}
                          {fmtPct(row.probability * 100, locale, 0)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
          <div className="mt-4">
            <Note>
              {copy(
                "Weighted pipeline = opportunity value × assumed probability. It is not booked revenue.",
                "ارزش موزون برابر مبلغ هر فرصت ضرب در احتمال فرضی موفقیت است و فروش ثبت‌شده محسوب نمی‌شود.",
              )}
            </Note>
          </div>
        </Card>
      </div>
    </>
  );
}
