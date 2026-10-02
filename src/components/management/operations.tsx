"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Download, Plus } from "lucide-react";
import {
  DEMO_DAY,
  history,
  managementMetrics,
  overdueTask,
  teams,
  type DemoState,
  type Deal,
  type Job,
  type Shipment,
} from "@/lib/demo/management";
import { downloadCsv } from "@/lib/download";
import { ColumnChart } from "../charts/column-chart";
import { LineChart } from "../charts/line-chart";
import { Legend, Meter } from "../ui";
import { TableView } from "../table-view";
import { date, Empty, Modal, money, Panel, Pill, Stat, Table } from "./shared";
import { updateDemo } from "./store";
import { makeCopy, type Locale } from "@/lib/i18n";
import { fmtNum, fmtPct } from "@/lib/format";
import {
  ACTION_STATUS,
  AUDIENCES,
  CLIENT_NAMES,
  DEAL_STAGE,
  DEAL_TITLES,
  JOB_EQUIPMENT,
  JOB_NOTES,
  JOB_STATUS,
  JOB_TYPE,
  MESSAGE_BODIES,
  MESSAGE_TITLES,
  PERSON_NAMES,
  SHIPMENT_ITEMS,
  TASK_TITLES,
  SHIPMENT_STATUS,
  TEAM_FOCUS,
  VENDOR_NAMES,
  displayText,
  lookup,
  teamLabel,
} from "@/lib/demo/management-i18n";

export function Dashboard({
  locale,
  data,
  base,
  team = "all",
  overview = false,
}: {
  data: DemoState;
  base: string;
  team?: string;
  overview?: boolean;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const metric = managementMetrics(data, team);
  const groups = teams.filter((row) => team === "all" || row.id === team);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const selectedDeal = data.deals.find((deal) => deal.id === selected);
  const deals = metric.deals.filter(
    (deal) =>
      (stage === "all" || stage === deal.stage) &&
      `${deal.id} ${deal.client} ${deal.title} ${lookup(CLIENT_NAMES, deal.client, "fa")} ${DEAL_TITLES[deal.id]?.fa ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const lateJobs = data.jobs.filter(
    (job) => job.status !== "Completed" && job.due < DEMO_DAY,
  );
  const lateShipments = data.shipments.filter(
    (row) => row.status !== "Delivered" && row.due < DEMO_DAY,
  );
  return (
    <div className="mc-stack">
      <div className="mc-stats">
        <Stat
          label={copy("Booked sales", "فروش ثبت‌شده")}
          value={money(metric.revenue, locale)}
          detail={copy(
            "Won contracts · demonstration snapshot",
            "قراردادهای برنده‌شده · وضعیت نمایشی",
          )}
        />
        <Stat
          label={copy("Open pipeline", "فرصت‌های باز")}
          value={money(metric.pipeline, locale)}
          detail={copy(
            "Proposal, technical and supply stages",
            "مراحل پیشنهاد، فنی و تأمین",
          )}
        />
        <Stat
          label={copy("Open actions", "کارهای باز")}
          value={fmtNum(metric.open, locale)}
          detail={copy(
            `${metric.tasks.filter(overdueTask).length} past their due date`,
            `${fmtNum(metric.tasks.filter(overdueTask).length, locale)} مورد از سررسید گذشته`,
          )}
        />
        <Stat
          label={copy("Overdue receivables", "مطالبات معوق")}
          value={money(metric.overdue, locale)}
          detail={copy(
            "Unpaid balance on won contracts",
            "ماندهٔ پرداخت‌نشدهٔ قراردادهای برنده‌شده",
          )}
        />
      </div>
      {overview && (
        <Panel
          title={copy("Choose a workspace", "یک بخش را انتخاب کنید")}
          subtitle={copy(
            "Follow the work from a customer opportunity to planning, technical review and delivery.",
            "مسیر کار را از فرصت مشتری تا برنامه‌ریزی، بررسی فنی و تحویل دنبال کنید.",
          )}
        >
          <div className="mc-three">
            {[
              {
                href: "management",
                title: copy("Management", "مدیریت"),
                detail: copy("Group performance, contracts and operational alerts", "عملکرد گروه‌ها، قراردادها و هشدارهای عملیاتی"),
              },
              {
                href: "planning",
                title: copy("Planning", "برنامه‌ریزی"),
                detail: copy("Actions, meetings, projects and the daily digest", "کارها، جلسه‌ها، پروژه‌ها و گزارش روزانه"),
              },
              {
                href: "technical",
                title: copy("Technical", "فنی"),
                detail: copy("Approval queue, installation and service", "صف تأیید، نصب و سرویس"),
              },
              {
                href: "supply",
                title: copy("Supply", "تأمین"),
                detail: copy("Purchase orders, vendor follow-up and deliveries", "سفارش‌های خرید، پیگیری تأمین‌کننده و تحویل‌ها"),
              },
              {
                href: "weekly-history",
                title: copy("Weekly history", "سوابق هفتگی"),
                detail: copy("Compare the teams across four weekly snapshots", "مقایسهٔ گروه‌ها در چهار هفتهٔ گذشته"),
              },
              {
                href: "messages",
                title: copy("CEO messages", "پیام‌های مدیرعامل"),
                detail: copy("Publish and acknowledge local demo announcements", "انتشار و تأیید اعلان‌های محلی دمو"),
              },
            ].map((item) => (
              <Link
                className="mc-team"
                href={`${base}/${item.href}`}
                key={item.href}
              >
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <span className="mc-link flex items-center gap-2">
                  {copy("Open workspace", "باز کردن بخش")}{" "}
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </Panel>
      )}
      <div className="mc-grid">
        <Panel
          title={copy("Operational alerts", "هشدارهای عملیاتی")}
          subtitle={copy(
            "Items that need a next step, with links to the working registers.",
            "مواردی که قدم بعدی می‌خواهند، با لینک به دفتر کاری مربوطه.",
          )}
        >
          <div className="mc-list">
            <Link href={`${base}/planning/watchlist`} className="mc-list-item">
              <div>
                <strong>
                  {copy(
                    `${metric.tasks.filter(overdueTask).length} overdue actions`,
                    `${fmtNum(metric.tasks.filter(overdueTask).length, locale)} کار از سررسید گذشته`,
                  )}
                </strong>
                <p>
                  {copy(
                    "Assign a next step or update the action status.",
                    "قدم بعدی را تعیین کنید یا وضعیت کار را به‌روز کنید.",
                  )}
                </p>
              </div>
              <ArrowRight size={17} />
            </Link>
            <Link href={`${base}/technical`} className="mc-list-item">
              <div>
                <strong>
                  {copy(
                    `${lateJobs.length} late technical jobs`,
                    `${fmtNum(lateJobs.length, locale)} کار فنی عقب‌افتاده`,
                  )}
                </strong>
                <p>
                  {copy(
                    "Across all teams · approval or service dependencies.",
                    "در همهٔ گروه‌ها · وابستگی تأیید یا سرویس.",
                  )}
                </p>
              </div>
              <ArrowRight size={17} />
            </Link>
            <Link href={`${base}/supply`} className="mc-list-item">
              <div>
                <strong>
                  {copy(
                    `${lateShipments.length} late purchase orders`,
                    `${fmtNum(lateShipments.length, locale)} سفارش خرید عقب‌افتاده`,
                  )}
                </strong>
                <p>
                  {copy(
                    "Across all teams · follow up with the vendor.",
                    "در همهٔ گروه‌ها · با تأمین‌کننده پیگیری شود.",
                  )}
                </p>
              </div>
              <ArrowRight size={17} />
            </Link>
            <Link href={`${base}/planning/finance`} className="mc-list-item">
              <div>
                <strong>
                  {copy(
                    `${money(metric.overdue, locale)} overdue balance`,
                    `${money(metric.overdue, locale)} ماندهٔ معوق`,
                  )}
                </strong>
                <p>
                  {copy(
                    "Review the collections register.",
                    "دفتر وصول مطالبات را ببینید.",
                  )}
                </p>
              </div>
              <ArrowRight size={17} />
            </Link>
          </div>
        </Panel>
        <Panel
          title={copy("Booked sales by group", "فروش ثبت‌شده به تفکیک گروه")}
          subtitle={copy(
            "Million toman · won contracts in the current demo snapshot",
            "میلیون تومان · قراردادهای برنده‌شده در وضعیت فعلی دمو",
          )}
        >
          <ColumnChart
            locale={locale}
            data={groups.map((group) => ({
              label: teamLabel(group.id, locale),
              value: managementMetrics(data, group.id).revenue,
            }))}
            ariaLabel={copy("Booked sales by group", "فروش ثبت‌شده به تفکیک گروه")}
            valueLabel={copy("Booked sales", "فروش ثبت‌شده")}
            format="money"
            height={220}
          />
          <TableView
            locale={locale}
            caption={copy("Booked group sales", "فروش ثبت‌شدهٔ گروه‌ها")}
            columns={[
              { key: "group", label: copy("Group", "گروه") },
              {
                key: "value",
                label: copy("Booked sales", "فروش ثبت‌شده"),
                numeric: true,
              },
            ]}
            rows={groups.map((group) => ({
              group: teamLabel(group.id, locale),
              value: money(managementMetrics(data, group.id).revenue, locale),
            }))}
          />
        </Panel>
      </div>
      <div className="mc-three">
        {groups.map((group) => {
          const result = managementMetrics(data, group.id);
          return (
            <Link
              href={`${base}/groups/${group.id}`}
              key={group.id}
              className="mc-team"
            >
              <span className="mc-avatar">{group.id.toUpperCase()}</span>
              <h3>{teamLabel(group.id, locale)}</h3>
              <p>
                {lookup(PERSON_NAMES, group.lead, locale)} ·{" "}
                {TEAM_FOCUS[group.id]?.[locale] ?? group.focus}
              </p>
              <strong>{money(result.revenue, locale)}</strong>
              <div className="mt-3">
                <Meter
                  value={result.revenue}
                  max={group.target}
                  label={`${teamLabel(group.id, locale)} — ${copy("sales target", "هدف فروش")}`}
                />
              </div>
              <div className="mc-team-foot">
                <span>
                  {copy("Target", "هدف")} {money(group.target, locale)}
                </span>
                <span>
                  {copy(
                    `${result.deals.length} deals`,
                    `${fmtNum(result.deals.length, locale)} قرارداد`,
                  )}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <Panel
        title={
          team === "all"
            ? copy("Deal execution register", "دفتر اجرای قراردادها")
            : `${teamLabel(team, locale)} · ${copy("deals and offers", "قراردادها و پیشنهادها")}`
        }
        subtitle={copy(
          "Open a deal to inspect related actions, technical jobs and purchase orders.",
          "یک قرارداد را باز کنید تا کارها، کارهای فنی و سفارش‌های خرید مرتبط را ببینید.",
        )}
      >
        <div className="mc-filters">
          <label className="mc-field mc-grow">
            {copy("Search deals", "جست‌وجوی قراردادها")}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy(
                "Customer, product or deal ID",
                "مشتری، محصول یا شناسهٔ قرارداد",
              )}
            />
          </label>
          <label className="mc-field">
            {copy("Deal stage", "مرحلهٔ قرارداد")}
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="all">{copy("All stages", "همهٔ مراحل")}</option>
              {["Proposal", "Technical", "Supply", "Won"].map((value) => (
                <option key={value} value={value}>
                  {lookup(DEAL_STAGE, value, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="mc-btn"
            onClick={() =>
              downloadCsv("management-deals.csv", [
                [
                  copy("ID", "شناسه"),
                  copy("Customer", "مشتری"),
                  copy("Title", "عنوان"),
                  copy("Team", "گروه"),
                  copy("Stage", "مرحله"),
                  copy("Value M toman", "مبلغ (میلیون تومان)"),
                  copy("Paid M toman", "پرداخت‌شده (میلیون تومان)"),
                ],
                ...deals.map((deal) => [
                  deal.id,
                  lookup(CLIENT_NAMES, deal.client, locale),
                  displayText(deal.title, DEAL_TITLES[deal.id], locale),
                  teamLabel(deal.team, locale),
                  lookup(DEAL_STAGE, deal.stage, locale),
                  deal.value,
                  deal.paid,
                ]),
              ])
            }
          >
            <Download size={15} />
            {copy("Export view", "خروجی این نما")}
          </button>
        </div>
        {deals.length ? (
          <Table
            caption={copy("Deal execution register", "دفتر اجرای قراردادها")}
            headers={[
              copy("Deal / customer", "قرارداد / مشتری"),
              copy("Product", "محصول"),
              copy("Owner", "مسئول"),
              copy("Stage", "مرحله"),
              copy("Value", "مبلغ"),
              copy("Recorded payment", "پرداخت ثبت‌شده"),
            ]}
          >
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>
                  <button
                    className="mc-link"
                    onClick={() => setSelected(deal.id)}
                  >
                    {deal.id}
                  </button>
                  <small>{lookup(CLIENT_NAMES, deal.client, locale)}</small>
                </td>
                <td className="mc-action-cell">
                  {displayText(deal.title, DEAL_TITLES[deal.id], locale)}
                </td>
                <td>
                  {lookup(PERSON_NAMES, deal.owner, locale)}
                  <small>{teamLabel(deal.team, locale)}</small>
                </td>
                <td>
                  <Pill
                    value={deal.stage}
                    label={lookup(DEAL_STAGE, deal.stage, locale)}
                  />
                </td>
                <td>{money(deal.value, locale)}</td>
                <td>{money(deal.paid, locale)}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty locale={locale} />
        )}
      </Panel>
      {overview && data.messages[0] && (
        <Panel
          title={copy("Latest CEO message", "آخرین پیام مدیرعامل")}
          subtitle={`${lookup(AUDIENCES, data.messages[0].audience, locale)} · ${date(data.messages[0].date, locale)}`}
          action={
            <Link className="mc-btn" href={`${base}/messages`}>
              {copy("View messages", "دیدن پیام‌ها")}
            </Link>
          }
        >
          <h3 className="font-semibold mb-3">
            {displayText(
              data.messages[0].title,
              MESSAGE_TITLES[data.messages[0].id],
              locale,
            )}
          </h3>
          <p className="whitespace-pre-wrap text-ink-2">
            {displayText(
              data.messages[0].body,
              MESSAGE_BODIES[data.messages[0].id],
              locale,
            )}
          </p>
        </Panel>
      )}
      {selectedDeal && (
        <Modal
          title={`${selectedDeal.id} · ${lookup(CLIENT_NAMES, selectedDeal.client, locale)}`}
          onClose={() => setSelected(null)}
          locale={locale}
        >
          <div className="mc-form">
            <p>
              {displayText(
                selectedDeal.title,
                DEAL_TITLES[selectedDeal.id],
                locale,
              )}
            </p>
            <div className="mc-form-row">
              <Stat
                label={copy("Contract value", "مبلغ قرارداد")}
                value={money(selectedDeal.value, locale)}
                detail={teamLabel(selectedDeal.team, locale)}
              />
              <Stat
                label={copy("Gross margin", "حاشیهٔ سود ناخالص")}
                value={fmtPct(
                  ((selectedDeal.value - selectedDeal.cost) /
                    selectedDeal.value) *
                    100,
                  locale,
                  1,
                )}
                detail={copy(
                  "Contract value less cost of goods",
                  "مبلغ قرارداد منهای بهای تمام‌شدهٔ کالا",
                )}
              />
            </div>
            <label className="mc-field">
              {copy("Demo deal stage", "مرحلهٔ قرارداد در دمو")}
              <select
                value={selectedDeal.stage}
                onChange={(e) =>
                  updateDemo((current) => ({
                    ...current,
                    deals: current.deals.map((deal) =>
                      deal.id === selectedDeal.id
                        ? { ...deal, stage: e.target.value as Deal["stage"] }
                        : deal,
                    ),
                  }))
                }
              >
                {["Proposal", "Technical", "Supply", "Won"].map((value) => (
                  <option key={value} value={value}>
                    {lookup(DEAL_STAGE, value, locale)}
                  </option>
                ))}
              </select>
            </label>
            <p className="mc-note">
              {copy(
                "Changing the stage updates booked sales, pipeline and the collections register.",
                "تغییر مرحله، فروش ثبت‌شده، فرصت‌های باز و دفتر وصول را به‌روز می‌کند.",
              )}
            </p>
            <h3 className="font-semibold">
              {copy("Related operations", "عملیات مرتبط")}
            </h3>
            {data.jobs
              .filter((row) => row.deal === selectedDeal.id)
              .map((job) => (
                <Link
                  key={job.id}
                  href={`${base}/technical`}
                  className="mc-list-item"
                >
                  <span>
                    {job.id} ·{" "}
                    {displayText(job.equipment, JOB_EQUIPMENT[job.id], locale)}
                  </span>
                  <Pill
                    value={job.status}
                    label={lookup(JOB_STATUS, job.status, locale)}
                  />
                </Link>
              ))}
            {data.shipments
              .filter((row) => row.deal === selectedDeal.id)
              .map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`${base}/supply`}
                  className="mc-list-item"
                >
                  <span>
                    {shipment.id} ·{" "}
                    {displayText(
                      shipment.item,
                      SHIPMENT_ITEMS[shipment.id],
                      locale,
                    )}
                  </span>
                  <Pill
                    value={shipment.status}
                    label={lookup(SHIPMENT_STATUS, shipment.status, locale)}
                  />
                </Link>
              ))}
            <Link href={`${base}/planning/groups`} className="mc-link">
              {copy("Review team actions", "دیدن کارهای گروه")}
            </Link>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Technical({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [engineer, setEngineer] = useState("all");
  const [notice, setNotice] = useState("");
  const statuses: Job["status"][] = [
    "Approval queue",
    "Waiting installation",
    "Under repair",
    "Completed",
  ];
  const rows = data.jobs.filter(
    (job) =>
      (filter === "all" || job.status === filter) &&
      (engineer === "all" || engineer === job.engineer) &&
      `${job.id} ${job.equipment} ${job.deal} ${JOB_EQUIPMENT[job.id]?.fa ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="mc-stack">
      <div className="mc-stats">
        {statuses.map((status) => (
          <Stat
            key={status}
            label={lookup(JOB_STATUS, status, locale)}
            value={fmtNum(
              data.jobs.filter((job) => job.status === status).length,
              locale,
            )}
            detail={copy(
              "All technical jobs at the snapshot",
              "همهٔ کارهای فنی در این وضعیت",
            )}
          />
        ))}
      </div>
      <Panel
        title={copy("Technical work queue", "صف کارهای فنی")}
        subtitle={copy(
          "Inspect equipment, owners and due dates. Status changes are saved only in the demo.",
          "تجهیزات، مسئول و سررسیدها را ببینید. تغییر وضعیت فقط در همین دمو ذخیره می‌شود.",
        )}
      >
        <p className={notice ? "mc-notice" : "sr-only"} role="status">
          {notice}
        </p>
        <div className="mc-filters">
          <label className="mc-field mc-grow">
            {copy("Search technical jobs", "جست‌وجوی کارهای فنی")}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy(
                "Equipment, job or deal",
                "تجهیزات، کار یا قرارداد",
              )}
            />
          </label>
          <label className="mc-field">
            {copy("Engineer", "کارشناس فنی")}
            <select
              value={engineer}
              onChange={(e) => setEngineer(e.target.value)}
            >
              <option value="all">{copy("All engineers", "همهٔ کارشناسان")}</option>
              {[...new Set(data.jobs.map((job) => job.engineer))].map(
                (name) => (
                  <option key={name} value={name}>
                    {lookup(PERSON_NAMES, name, locale)}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="mc-field">
            {copy("Job status", "وضعیت کار")}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">{copy("All statuses", "همهٔ وضعیت‌ها")}</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {lookup(JOB_STATUS, status, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="mc-btn"
            onClick={() =>
              downloadCsv("technical-jobs.csv", [
                [
                  copy("ID", "شناسه"),
                  copy("Deal", "قرارداد"),
                  copy("Equipment", "تجهیزات"),
                  copy("Engineer", "کارشناس فنی"),
                  copy("Status", "وضعیت"),
                  copy("Due", "سررسید"),
                  copy("Notes", "یادداشت"),
                ],
                ...rows.map((row) => [
                  row.id,
                  row.deal,
                  displayText(row.equipment, JOB_EQUIPMENT[row.id], locale),
                  lookup(PERSON_NAMES, row.engineer, locale),
                  lookup(JOB_STATUS, row.status, locale),
                  row.due,
                  displayText(row.note, JOB_NOTES[row.id], locale),
                ]),
              ])
            }
          >
            <Download size={15} />
            {copy("Export view", "خروجی این نما")}
          </button>
        </div>
        {rows.length ? (
          <Table
            caption={copy("Technical work queue", "صف کارهای فنی")}
            headers={[
              copy("Job", "کار"),
              copy("Equipment / customer", "تجهیزات / مشتری"),
              copy("Engineer", "کارشناس فنی"),
              copy("Due", "سررسید"),
              copy("Update status", "تغییر وضعیت"),
              copy("Technical note", "یادداشت فنی"),
            ]}
          >
            {rows.map((job) => (
              <tr key={job.id}>
                <td>
                  {job.id}
                  <small>
                    {lookup(JOB_TYPE, job.type, locale)} · {job.deal}
                  </small>
                </td>
                <td>
                  {displayText(job.equipment, JOB_EQUIPMENT[job.id], locale)}
                  <small>
                    {(() => {
                      const client = data.deals.find(
                        (deal) => deal.id === job.deal,
                      )?.client;
                      return client
                        ? lookup(CLIENT_NAMES, client, locale)
                        : null;
                    })()}
                  </small>
                </td>
                <td>{lookup(PERSON_NAMES, job.engineer, locale)}</td>
                <td>
                  {date(job.due, locale)}
                  {job.due < DEMO_DAY && job.status !== "Completed" && (
                    <small>
                      <Pill
                        value="Overdue"
                        label={copy("Overdue", "از سررسید گذشته")}
                      />
                    </small>
                  )}
                </td>
                <td>
                  <select
                    aria-label={copy(
                      `Status for ${job.id}`,
                      `وضعیت ${job.id}`,
                    )}
                    value={job.status}
                    onChange={(e) => {
                      const status = e.target.value as Job["status"];
                      updateDemo((current) => ({
                        ...current,
                        jobs: current.jobs.map((row) =>
                          row.id === job.id ? { ...row, status } : row,
                        ),
                      }));
                      setNotice(
                        copy(
                          `${job.id} moved to ${status}.`,
                          `${job.id} به «${lookup(JOB_STATUS, status, "fa")}» منتقل شد.`,
                        ),
                      );
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {lookup(JOB_STATUS, status, locale)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="mc-action-cell">
                  {displayText(job.note, JOB_NOTES[job.id], locale)}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty locale={locale} />
        )}
      </Panel>
      <Panel
        title={copy("Engineer workload", "بار کاری کارشناسان")}
        subtitle={copy(
          "Open jobs by engineer, derived from the queue above.",
          "کارهای باز هر کارشناس، برگرفته از صف بالا.",
        )}
      >
        <div className="mc-three">
          {[...new Set(data.jobs.map((job) => job.engineer))].map((name) => (
            <div className="mc-team" key={name}>
              <h3>{lookup(PERSON_NAMES, name, locale)}</h3>
              <p>
                {copy(
                  `${data.jobs.filter((job) => job.engineer === name && job.status !== "Completed").length} open jobs`,
                  `${fmtNum(data.jobs.filter((job) => job.engineer === name && job.status !== "Completed").length, locale)} کار باز`,
                )}
              </p>
              <Pill
                value={
                  data.jobs.some(
                    (job) =>
                      job.engineer === name &&
                      job.status !== "Completed" &&
                      job.due < DEMO_DAY,
                  )
                    ? "Overdue"
                    : "In progress"
                }
                label={
                  data.jobs.some(
                    (job) =>
                      job.engineer === name &&
                      job.status !== "Completed" &&
                      job.due < DEMO_DAY,
                  )
                    ? copy("Overdue", "از سررسید گذشته")
                    : copy("In progress", "در حال انجام")
                }
              />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function Supply({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const statuses: Shipment["status"][] = [
    "Not ordered",
    "Ordered",
    "In transit",
    "Delivered",
  ];
  const rows = data.shipments.filter(
    (row) =>
      (status === "all" || status === "late"
        ? status !== "late" ||
          (row.due < DEMO_DAY && row.status !== "Delivered")
        : row.status === status) &&
      `${row.id} ${row.item} ${row.vendor} ${row.owner} ${SHIPMENT_ITEMS[row.id]?.fa ?? ""} ${VENDOR_NAMES[row.vendor]?.fa ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const open = data.shipments.filter((row) => row.status !== "Delivered");
  return (
    <div className="mc-stack">
      <div className="mc-stats">
        <Stat
          label={copy("Open purchase orders", "سفارش‌های خرید باز")}
          value={fmtNum(open.length, locale)}
          detail={copy(
            "Not delivered at the snapshot",
            "تا این تاریخ تحویل نشده‌اند",
          )}
        />
        <Stat
          label={copy("Not ordered", "سفارش‌نشده")}
          value={fmtNum(
            open.filter((row) => row.status === "Not ordered").length,
            locale,
          )}
          detail={copy("Placement still required", "هنوز باید سفارش داده شود")}
        />
        <Stat
          label={copy("Late orders", "سفارش‌های عقب‌افتاده")}
          value={fmtNum(open.filter((row) => row.due < DEMO_DAY).length, locale)}
          detail={copy("Due before 1 October", "سررسیدشان پیش از ۹ مهر بوده")}
        />
        <Stat
          label={copy("Open order value", "ارزش سفارش‌های باز")}
          value={money(open.reduce((sum, row) => sum + row.value, 0), locale)}
          detail={copy(
            "Full value of undelivered POs",
            "ارزش کل سفارش‌های تحویل‌نشده",
          )}
        />
      </div>
      <Panel
        title={copy("Purchase orders & logistics", "سفارش‌های خرید و لجستیک")}
        subtitle={copy(
          "Follow each order from placement through delivery. Demo changes update management alerts.",
          "هر سفارش را از ثبت تا تحویل دنبال کنید. تغییرهای دمو هشدارهای مدیریتی را به‌روز می‌کنند.",
        )}
      >
        <p role="status" className={notice ? "mc-notice" : "sr-only"}>
          {notice}
        </p>
        <div className="mc-filters">
          <label className="mc-field mc-grow">
            {copy("Search supply", "جست‌وجوی تأمین")}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy(
                "PO, vendor, item or manager",
                "سفارش، تأمین‌کننده، قلم یا مسئول",
              )}
            />
          </label>
          <label className="mc-field">
            {copy("Supply status", "وضعیت تأمین")}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">{copy("All orders", "همهٔ سفارش‌ها")}</option>
              <option value="late">
                {copy("Late only", "فقط عقب‌افتاده‌ها")}
              </option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {lookup(SHIPMENT_STATUS, value, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="mc-btn"
            onClick={() =>
              downloadCsv("supply-orders.csv", [
                [
                  copy("PO", "سفارش"),
                  copy("Deal", "قرارداد"),
                  copy("Item", "قلم"),
                  copy("Vendor", "تأمین‌کننده"),
                  copy("Owner", "مسئول"),
                  copy("Quantity", "تعداد"),
                  copy("Value M toman", "ارزش (میلیون تومان)"),
                  copy("Due", "سررسید"),
                  copy("Status", "وضعیت"),
                ],
                ...rows.map((row) => [
                  row.id,
                  row.deal,
                  displayText(row.item, SHIPMENT_ITEMS[row.id], locale),
                  lookup(VENDOR_NAMES, row.vendor, locale),
                  lookup(PERSON_NAMES, row.owner, locale),
                  row.quantity,
                  row.value,
                  row.due,
                  lookup(SHIPMENT_STATUS, row.status, locale),
                ]),
              ])
            }
          >
            <Download size={15} />
            {copy("Export view", "خروجی این نما")}
          </button>
        </div>
        {rows.length ? (
          <Table
            caption={copy(
              "Purchase orders and deliveries",
              "سفارش‌های خرید و تحویل‌ها",
            )}
            headers={[
              copy("PO / deal", "سفارش / قرارداد"),
              copy("Item / vendor", "قلم / تأمین‌کننده"),
              copy("Manager", "مسئول"),
              copy("Quantity", "تعداد"),
              copy("Value", "ارزش"),
              copy("Expected", "زمان مورد انتظار"),
              copy("Update status", "تغییر وضعیت"),
            ]}
          >
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.id}
                  <small>{row.deal}</small>
                </td>
                <td>
                  {displayText(row.item, SHIPMENT_ITEMS[row.id], locale)}
                  <small>{lookup(VENDOR_NAMES, row.vendor, locale)}</small>
                </td>
                <td>{lookup(PERSON_NAMES, row.owner, locale)}</td>
                <td>{fmtNum(row.quantity, locale)}</td>
                <td>{money(row.value, locale)}</td>
                <td>
                  {date(row.due, locale)}
                  {row.due < DEMO_DAY && row.status !== "Delivered" && (
                    <small>
                      <Pill value="Late" label={copy("Late", "عقب‌افتاده")} />
                    </small>
                  )}
                </td>
                <td>
                  <select
                    aria-label={copy(
                      `Status for ${row.id}`,
                      `وضعیت ${row.id}`,
                    )}
                    value={row.status}
                    onChange={(e) => {
                      const next = e.target.value as Shipment["status"];
                      updateDemo((current) => ({
                        ...current,
                        shipments: current.shipments.map((shipment) =>
                          shipment.id === row.id
                            ? { ...shipment, status: next }
                            : shipment,
                        ),
                      }));
                      setNotice(
                        copy(
                          `${row.id} moved to ${next}.`,
                          `${row.id} به «${lookup(SHIPMENT_STATUS, next, "fa")}» منتقل شد.`,
                        ),
                      );
                    }}
                  >
                    {statuses.map((value) => (
                      <option key={value} value={value}>
                        {lookup(SHIPMENT_STATUS, value, locale)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty locale={locale} />
        )}
      </Panel>
      <Panel
        title={copy(
          "Supply workload by manager",
          "بار کاری تأمین به تفکیک مسئول",
        )}
        subtitle={copy(
          "Open orders and late commitments across all purchase orders.",
          "سفارش‌های باز و تعهدهای عقب‌افتاده در همهٔ سفارش‌های خرید.",
        )}
      >
        <Table
          caption={copy("Supply manager workload", "بار کاری مسئولان تأمین")}
          headers={[
            copy("Manager", "مسئول"),
            copy("Open orders", "سفارش‌های باز"),
            copy("Late", "عقب‌افتاده"),
            copy("Open value", "ارزش باز"),
          ]}
        >
          {[...new Set(data.shipments.map((row) => row.owner))].map((owner) => {
            const managed = open.filter((row) => row.owner === owner);
            return (
              <tr key={owner}>
                <td>{lookup(PERSON_NAMES, owner, locale)}</td>
                <td>{fmtNum(managed.length, locale)}</td>
                <td>
                  {fmtNum(
                    managed.filter((row) => row.due < DEMO_DAY).length,
                    locale,
                  )}
                </td>
                <td>
                  {money(managed.reduce((sum, row) => sum + row.value, 0), locale)}
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    </div>
  );
}

export function SalesPlan({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const target = teams.reduce((sum, team) => sum + team.target, 0);
  const metric = managementMetrics(data);
  return (
    <div className="mc-stack">
      <div className="mc-stats">
        <Stat
          label={copy("October sales target", "هدف فروش این ماه")}
          value={money(target, locale)}
          detail={copy(
            "Combined target across three groups",
            "مجموع هدف سه گروه",
          )}
        />
        <Stat
          label={copy("Booked toward target", "ثبت‌شده در برابر هدف")}
          value={money(metric.revenue, locale)}
          detail={copy("Current won contracts", "قراردادهای برنده‌شدهٔ فعلی")}
        />
        <Stat
          label={copy("Target attainment", "تحقق هدف")}
          value={fmtPct((metric.revenue / target) * 100, locale, 1)}
          detail={copy(
            "Booked sales divided by monthly target",
            "فروش ثبت‌شده تقسیم بر هدف ماهانه",
          )}
        />
        <Stat
          label={copy("Remaining to target", "باقی‌مانده تا هدف")}
          value={money(Math.max(0, target - metric.revenue), locale)}
          detail={copy(
            "Not a forecast or committed revenue",
            "پیش‌بینی یا درآمد قطعی‌شده نیست",
          )}
        />
      </div>
      <Panel
        title={copy("Individual & team targets", "هدف افراد و گروه‌ها")}
        subtitle={copy(
          "October plan · figures are in million toman. Open pipeline is not booked revenue.",
          "برنامهٔ ماه · ارقام به میلیون تومان. فرصت‌های باز، فروش ثبت‌شده نیستند.",
        )}
      >
        <Table
          caption={copy("Sales plan by team", "برنامهٔ فروش به تفکیک گروه")}
          headers={[
            copy("Team / lead", "گروه / سرپرست"),
            copy("Target", "هدف"),
            copy("Booked", "ثبت‌شده"),
            copy("Open pipeline", "فرصت‌های باز"),
            copy("Remaining", "باقی‌مانده"),
            copy("Attainment", "تحقق"),
          ]}
        >
          {teams.map((team) => {
            const summary = managementMetrics(data, team.id);
            return (
              <tr key={team.id}>
                <td>
                  {teamLabel(team.id, locale)}
                  <small>{lookup(PERSON_NAMES, team.lead, locale)}</small>
                </td>
                <td>{money(team.target, locale)}</td>
                <td>{money(summary.revenue, locale)}</td>
                <td>{money(summary.pipeline, locale)}</td>
                <td>{money(Math.max(0, team.target - summary.revenue), locale)}</td>
                <td>
                  <span>
                    {fmtPct((summary.revenue / team.target) * 100, locale, 1)}
                  </span>
                  <Meter
                    value={summary.revenue}
                    max={team.target}
                    label={`${teamLabel(team.id, locale)} — ${copy("attainment", "تحقق")}`}
                  />
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>
      <Panel
        title={copy("Monthly priorities", "اولویت‌های ماه")}
        subtitle={copy(
          "Actions already assigned to the sales groups; their live status comes from the planning register.",
          "کارهایی که به گروه‌های فروش سپرده شده‌اند؛ وضعیت زندهٔ آن‌ها از دفتر برنامه‌ریزی می‌آید.",
        )}
      >
        <div className="mc-three">
          {teams.map((team) => (
            <div className="mc-team" key={team.id}>
              <h3>{teamLabel(team.id, locale)}</h3>
              <p>{TEAM_FOCUS[team.id]?.[locale] ?? team.focus}</p>
              <div className="mc-list">
                {data.tasks
                  .filter(
                    (task) => task.team === team.id && task.priority === "High",
                  )
                  .map((task) => (
                    <div key={task.id}>
                      <strong className="text-sm">
                        {displayText(task.title, TASK_TITLES[task.id], locale)}
                      </strong>
                      <p>
                        {lookup(PERSON_NAMES, task.owner, locale)} ·{" "}
                        {date(task.due, locale)}
                      </p>
                      <Pill
                        value={task.status}
                        label={lookup(ACTION_STATUS, task.status, locale)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function WeeklyHistory({ locale }: { locale: Locale }) {
  const copy = makeCopy(locale);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [metric, setMetric] = useState<"sales" | "offers" | "deals">("sales");
  const label = {
    sales: copy("Weekly sales", "فروش هفتگی"),
    offers: copy("Offers sent", "پیشنهادهای ارسالی"),
    deals: copy("Deals handled", "قراردادهای رسیدگی‌شده"),
  }[metric];
  const format = (n: number) =>
    metric === "sales" ? money(n, locale) : fmtNum(n, locale);
  const rows = teams.map((team) => ({
    id: team.id,
    name: teamLabel(team.id, locale),
    a: history[a].groups.find((row) => row.team === team.id)![metric],
    b: history[b].groups.find((row) => row.team === team.id)![metric],
  }));
  return (
    <div className="mc-stack">
      <Panel
        title={copy("Week-to-week comparison", "مقایسهٔ هفته‌به‌هفته")}
        subtitle={copy(
          "Fixed historical snapshots; edits to the current demo do not rewrite previous weeks.",
          "وضعیت‌های تاریخی ثابت‌اند؛ تغییرهای دموی فعلی هفته‌های گذشته را بازنویسی نمی‌کنند.",
        )}
      >
        <div className="mc-filters">
          <label className="mc-field">
            {copy("Week A", "هفتهٔ الف")}
            <select value={a} onChange={(e) => setA(Number(e.target.value))}>
              {history.map((week, i) => (
                <option key={week.week} value={i}>
                  {copy(
                    `Week ending ${date(week.week, locale)}`,
                    `هفتهٔ منتهی به ${date(week.week, locale)}`,
                  )}
                </option>
              ))}
            </select>
          </label>
          <button
            className="mc-btn"
            onClick={() => {
              setA(b);
              setB(a);
            }}
          >
            {copy("Swap weeks", "جابه‌جایی هفته‌ها")}
          </button>
          <label className="mc-field">
            {copy("Week B", "هفتهٔ ب")}
            <select value={b} onChange={(e) => setB(Number(e.target.value))}>
              {history.map((week, i) => (
                <option key={week.week} value={i}>
                  {copy(
                    `Week ending ${date(week.week, locale)}`,
                    `هفتهٔ منتهی به ${date(week.week, locale)}`,
                  )}
                </option>
              ))}
            </select>
          </label>
          <label className="mc-field">
            {copy("Measure", "شاخص")}
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as typeof metric)}
            >
              <option value="sales">{copy("Weekly sales", "فروش هفتگی")}</option>
              <option value="offers">
                {copy("Offers sent", "پیشنهادهای ارسالی")}
              </option>
              <option value="deals">
                {copy("Deals handled", "قراردادهای رسیدگی‌شده")}
              </option>
            </select>
          </label>
        </div>
        <Table
          caption={copy(
            "Week-to-week group comparison",
            "مقایسهٔ هفته‌به‌هفتهٔ گروه‌ها",
          )}
          headers={[
            copy("Group", "گروه"),
            `${copy("A", "الف")} · ${date(history[a].week, locale)}`,
            `${copy("B", "ب")} · ${date(history[b].week, locale)}`,
            copy("Change", "تغییر"),
            copy("Change %", "درصد تغییر"),
          ]}
        >
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{format(row.a)}</td>
              <td>{format(row.b)}</td>
              <td>
                {row.b - row.a > 0 ? "+" : ""}
                {format(row.b - row.a)}
              </td>
              <td>
                {row.a
                  ? fmtPct(((row.b - row.a) / row.a) * 100, locale, 1)
                  : "—"}
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
      <Panel
        title={`${label} · ${copy("four-week trend", "روند چهار هفته")}`}
        subtitle={
          metric === "sales"
            ? copy(
                "Million toman · historical weekly activity",
                "میلیون تومان · فعالیت هفتگی گذشته",
              )
            : copy("Count per week", "تعداد در هر هفته")
        }
      >
        <Legend
          items={teams.map((team) => ({
            label: teamLabel(team.id, locale),
            slot: team.slot,
          }))}
          shape="line"
        />
        <LineChart
          locale={locale}
          xLabels={history.map((week) => date(week.week, locale))}
          series={teams.map((team) => ({
            key: team.id,
            label: teamLabel(team.id, locale),
            slot: team.slot,
            values: history.map(
              (week) =>
                week.groups.find((row) => row.team === team.id)![metric],
            ),
          }))}
          format={metric === "sales" ? "money" : "number"}
          zeroBased
          ariaLabel={copy(
            `${label} by group across four weeks`,
            `${label} به تفکیک گروه در چهار هفته`,
          )}
        />
        <TableView
          locale={locale}
          caption={copy(
            `${label} historical values`,
            `مقادیر تاریخی ${label}`,
          )}
          columns={[
            { key: "week", label: copy("Week", "هفته") },
            ...teams.map((team) => ({
              key: team.id,
              label: teamLabel(team.id, locale),
              numeric: true,
            })),
          ]}
          rows={history.map((week) =>
            Object.fromEntries([
              ["week", date(week.week, locale)],
              ...week.groups.map((row) => [row.team, format(row[metric])]),
            ]),
          )}
        />
      </Panel>
    </div>
  );
}

export function Messages({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [compose, setCompose] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <Panel
      title={copy("CEO messages", "پیام‌های مدیرعامل")}
      subtitle={copy(
        "Compose a local announcement and preview how it appears to the team. Nothing is sent or published externally.",
        "یک اعلان محلی بنویسید و ببینید برای تیم چطور دیده می‌شود. هیچ چیزی ارسال یا بیرون منتشر نمی‌شود.",
      )}
      action={
        <button
          className="mc-btn mc-btn-primary"
          onClick={() => setCompose(true)}
        >
          <Plus size={16} />
          {copy("New message", "پیام جدید")}
        </button>
      }
    >
      <p role="status" className={notice ? "mc-notice" : "sr-only"}>
        {notice}
      </p>
      <div className="mc-list">
        {data.messages.map((message) => (
          <article className="mc-team" key={message.id}>
            <div className="mc-panel-head">
              <div>
                <h3>
                  {displayText(
                    message.title,
                    MESSAGE_TITLES[message.id],
                    locale,
                  )}
                </h3>
                <p>
                  {lookup(AUDIENCES, message.audience, locale)} ·{" "}
                  {date(message.date, locale)} ·{" "}
                  {copy("Demo announcement", "اعلان دمو")}
                </p>
              </div>
              <Pill
                value={message.acknowledged ? "Done" : "Unread"}
                label={
                  message.acknowledged
                    ? copy("Acknowledged", "تأیید شد")
                    : copy("Unread", "خوانده‌نشده")
                }
              />
            </div>
            <p className="whitespace-pre-wrap !text-sm !text-ink-2">
              {displayText(message.body, MESSAGE_BODIES[message.id], locale)}
            </p>
            <button
              className="mc-btn"
              disabled={message.acknowledged}
              onClick={() => {
                updateDemo((current) => ({
                  ...current,
                  messages: current.messages.map((row) =>
                    row.id === message.id
                      ? { ...row, acknowledged: true }
                      : row,
                  ),
                }));
                setNotice(
                  copy(
                    "Acknowledgement recorded in this browser only.",
                    "تأیید فقط در همین مرورگر ثبت شد.",
                  ),
                );
              }}
            >
              {message.acknowledged
                ? copy("Acknowledged", "تأیید شد")
                : copy("Acknowledge message", "تأیید دریافت پیام")}
            </button>
          </article>
        ))}
      </div>
      {compose && (
        <Modal
          title={copy("Compose demo announcement", "نوشتن اعلان دمو")}
          onClose={() => setCompose(false)}
          locale={locale}
        >
          <form
            className="mc-form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const title = String(form.get("title")).trim();
              const body = String(form.get("body")).trim();
              if (!title || !body) return;
              updateDemo((current) => ({
                ...current,
                messages: [
                  {
                    id: `MSG-${crypto.randomUUID().slice(0, 8)}`,
                    title,
                    body,
                    audience: String(form.get("audience")),
                    date: DEMO_DAY,
                    acknowledged: false,
                  },
                  ...current.messages,
                ],
              }));
              setCompose(false);
              setNotice(
                copy(
                  "Demo message added. It is visible here and on the overview; no external message was sent.",
                  "پیام دمو اضافه شد. اینجا و در نمای کلی دیده می‌شود؛ هیچ پیامی بیرون ارسال نشد.",
                ),
              );
            }}
          >
            <label className="mc-field">
              {copy("Message title", "عنوان پیام")}
              <input name="title" required maxLength={120} />
            </label>
            <label className="mc-field">
              {copy("Audience", "مخاطب")}
              <select name="audience">
                <option value="All teams">
                  {copy("All teams", "همهٔ گروه‌ها")}
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {teamLabel(team.id, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="mc-field">
              {copy("Message body", "متن پیام")}
              <textarea name="body" required maxLength={3000} />
            </label>
            <button className="mc-btn mc-btn-primary">
              {copy("Add to demo", "افزودن به دمو")}
            </button>
          </form>
        </Modal>
      )}
    </Panel>
  );
}
