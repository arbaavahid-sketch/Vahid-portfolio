"use client";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Download, Plus, Send } from "lucide-react";
import {
  carriedTask,
  DEMO_DAY,
  digestText,
  managementMetrics,
  overdueTask,
  people,
  teams,
  type Task,
  type DemoState,
} from "@/lib/demo/management";
import { downloadCsv, downloadText } from "@/lib/download";
import { Meter } from "../ui";
import { updateDemo } from "./store";
import { makeCopy, type Locale } from "@/lib/i18n";
import { fmtNum } from "@/lib/format";
import {
  ACTION_STATUS,
  CLIENT_NAMES,
  DEAL_TITLES,
  PERSON_NAMES,
  PRIORITY,
  PROJECT_NAMES,
  TASK_COMMENTS,
  TASK_TITLES,
  TEAM_FOCUS,
  displayText,
  lookup,
  teamLabel,
} from "@/lib/demo/management-i18n";
import { date, Empty, Modal, money, Panel, Pill, Stat, Table } from "./shared";

const taskStatuses = ["Not started", "In progress", "Blocked", "Done"] as const;
export function TaskBoard({
  data,
  mode,
  locale,
}: {
  data: DemoState;
  mode: string;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [owner, setOwner] = useState("all");
  const [bucket, setBucket] = useState("open");
  const [month, setMonth] = useState("scope");
  const [project, setProject] = useState("all");
  const [editing, setEditing] = useState<Task | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const projects = [...new Set(data.tasks.map((task) => task.project))];
  const base = data.tasks.filter(
    (task) =>
      (team === "all" || task.team === team) &&
      (owner === "all" || task.owner === owner) &&
      (month === "scope"
        ? task.month === "2026-10" || carriedTask(task)
        : task.month === month) &&
      (project === "all" || task.project === project) &&
      `${task.id} ${task.title} ${task.owner} ${task.comment} ${TASK_TITLES[task.id]?.fa ?? ""} ${PERSON_NAMES[task.owner]?.fa ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const rows = base.filter((task) =>
    mode === "watchlist"
      ? overdueTask(task) || task.status === "Blocked"
      : bucket === "all" ||
        (bucket === "open"
          ? task.status !== "Done"
          : bucket === "carried"
            ? carriedTask(task)
            : task.status === bucket),
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    if (!title) return;
    const task: Task = {
      id:
        editing === "new"
          ? `AC-${crypto.randomUUID().slice(0, 8)}`
          : (editing as Task).id,
      title,
      owner: String(form.get("owner")),
      team: String(form.get("team")),
      project: String(form.get("project")).trim() || "General operations",
      due: String(form.get("due")),
      month: editing === "new" ? "2026-10" : (editing as Task).month,
      status: String(form.get("status")) as Task["status"],
      priority: String(form.get("priority")) as Task["priority"],
      comment: String(form.get("comment")).trim(),
    };
    updateDemo((current) => ({
      ...current,
      tasks:
        editing === "new"
          ? [...current.tasks, task]
          : current.tasks.map((row) => (row.id === task.id ? task : row)),
    }));
    setEditing(null);
    setNotice(
      copy(
        `${task.id} saved in this demo. All linked views and the digest now use the updated action.`,
        `${task.id} در این دمو ذخیره شد. همهٔ نماهای مرتبط و گزارش روزانه از همین نسخه استفاده می‌کنند.`,
      ),
    );
  }
  return (
    <div className="mc-stack">
      {(mode === "groups" || mode === "projects") && (
        <div className="mc-three">
          {(mode === "groups"
            ? teams.map((row) => ({
                id: row.id,
                name: teamLabel(row.id, locale),
                detail: `${lookup(PERSON_NAMES, row.lead, locale)} · ${TEAM_FOCUS[row.id]?.[locale] ?? row.focus}`,
                tasks: data.tasks.filter((task) => task.team === row.id),
              }))
            : projects.map((name) => ({
                id: name,
                name: lookup(PROJECT_NAMES, name, locale),
                detail: copy("Project action register", "دفتر کارهای پروژه"),
                tasks: data.tasks.filter((task) => task.project === name),
              }))
          ).map((item) => {
            const done = item.tasks.filter(
              (task) => task.status === "Done",
            ).length;
            return (
              <button
                key={item.id}
                className="mc-team text-left"
                onClick={() => {
                  if (mode === "groups") setTeam(item.id);
                  else setProject(item.id);
                  setBucket("all");
                }}
              >
                <span className="mc-avatar">
                  {mode === "groups" ? item.id.toUpperCase() : "P"}
                </span>
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
                <Meter
                  value={done}
                  max={item.tasks.length || 1}
                  label={`${item.name} — ${copy("completed actions", "کارهای انجام‌شده")}`}
                />
                <div className="mc-team-foot">
                  <span>
                    {copy(
                      `${done} / ${item.tasks.length} completed`,
                      `${fmtNum(done, locale)} از ${fmtNum(item.tasks.length, locale)} انجام‌شده`,
                    )}
                  </span>
                  <span>
                    {copy(
                      `${item.tasks.filter(overdueTask).length} overdue`,
                      `${fmtNum(item.tasks.filter(overdueTask).length, locale)} از سررسید گذشته`,
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <Panel
        title={
          mode === "groups"
            ? copy("Group planning", "برنامهٔ گروه‌ها")
            : mode === "projects"
              ? copy("Project planning", "برنامهٔ پروژه‌ها")
              : mode === "watchlist"
                ? copy("Watch list", "فهرست پایش")
                : copy("Actions", "کارها")
        }
        subtitle={
          mode === "watchlist"
            ? copy(
                "Overdue and blocked work across the selected scope. Open an action to update its owner, status or next step.",
                "کارهای عقب‌افتاده و متوقف در محدودهٔ انتخابی. یک کار را باز کنید تا مسئول، وضعیت یا قدم بعدی را تغییر دهید.",
              )
            : copy(
                "October actions and unfinished work carried over from September. Open a row to inspect or update it.",
                "کارهای این ماه و کارهای ناتمام منتقل‌شده از ماه قبل. یک ردیف را باز کنید تا ببینید یا تغییر دهید.",
              )
        }
        action={
          <button
            className="mc-btn mc-btn-primary"
            onClick={() => setEditing("new")}
          >
            <Plus size={16} />
            {copy("New action", "کار جدید")}
          </button>
        }
      >
        {notice && (
          <p className="mc-notice" role="status">
            {notice}
          </p>
        )}
        <div className="mc-filters">
          <label className="mc-field mc-grow">
            {copy("Search actions", "جست‌وجوی کارها")}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy(
                "Action, person, ID or comment",
                "کار، فرد، شناسه یا توضیح",
              )}
            />
          </label>
          <label className="mc-field">
            {copy("Team", "گروه")}
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option value="all">{copy("All teams", "همهٔ گروه‌ها")}</option>
              {teams.map((row) => (
                <option key={row.id} value={row.id}>
                  {teamLabel(row.id, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="mc-field">
            {copy("Owner", "مسئول")}
            <select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option value="all">{copy("All people", "همهٔ افراد")}</option>
              {people.map((person) => (
                <option key={person} value={person}>
                  {lookup(PERSON_NAMES, person, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="mc-field">
            {copy("Period", "دوره")}
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="scope">
                {copy("October + carry-over", "این ماه + منتقل‌شده‌ها")}
              </option>
              <option value="2026-10">
                {copy("October only", "فقط اکتبر")}
              </option>
              <option value="2026-09">
                {copy("September only", "فقط سپتامبر")}
              </option>
            </select>
          </label>
          <label className="mc-field">
            {copy("Project", "پروژه")}
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="all">{copy("All projects", "همهٔ پروژه‌ها")}</option>
              {projects.map((name) => (
                <option key={name} value={name}>
                  {lookup(PROJECT_NAMES, name, locale)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mc-stats">
          <Stat
            label={copy("Open actions", "کارهای باز")}
            value={fmtNum(
              base.filter((task) => task.status !== "Done").length,
              locale,
            )}
            detail={copy(
              "Selected team, person and period",
              "گروه، فرد و دورهٔ انتخاب‌شده",
            )}
          />
          <Stat
            label={copy("Carried over", "منتقل‌شده")}
            value={fmtNum(base.filter(carriedTask).length, locale)}
            detail={copy(
              "Unfinished from earlier months",
              "ناتمام‌های ماه‌های قبل",
            )}
          />
          <Stat
            label={copy("Blocked", "متوقف")}
            value={fmtNum(
              base.filter((task) => task.status === "Blocked").length,
              locale,
            )}
            detail={copy(
              "A dependency needs attention",
              "یک وابستگی رسیدگی می‌خواهد",
            )}
          />
          <Stat
            label={copy("Completed", "انجام‌شده")}
            value={fmtNum(
              base.filter((task) => task.status === "Done").length,
              locale,
            )}
            detail={copy("Within the selected scope", "در محدودهٔ انتخاب‌شده")}
          />
        </div>
        <div className="mc-filters">
          {mode !== "watchlist" && (
            <label className="mc-field">
              {copy("Action status", "وضعیت کار")}
              <select
                value={bucket}
                onChange={(e) => setBucket(e.target.value)}
              >
                <option value="open">{copy("Open work", "کارهای باز")}</option>
                <option value="all">
                  {copy("All statuses", "همهٔ وضعیت‌ها")}
                </option>
                <option value="carried">
                  {copy("Carried over", "منتقل‌شده")}
                </option>
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {lookup(ACTION_STATUS, status, locale)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className="mc-btn"
            onClick={() =>
              downloadCsv("planning-actions.csv", [
                [
                  copy("ID", "شناسه"),
                  copy("Owner", "مسئول"),
                  copy("Team", "گروه"),
                  copy("Action", "کار"),
                  copy("Status", "وضعیت"),
                  copy("Due", "سررسید"),
                  copy("Project", "پروژه"),
                  copy("Comment", "توضیح"),
                ],
                ...rows.map((row) => [
                  row.id,
                  lookup(PERSON_NAMES, row.owner, locale),
                  teamLabel(row.team, locale),
                  displayText(row.title, TASK_TITLES[row.id], locale),
                  lookup(ACTION_STATUS, row.status, locale),
                  row.due,
                  lookup(PROJECT_NAMES, row.project, locale),
                  displayText(row.comment, TASK_COMMENTS[row.id], locale),
                ]),
              ])
            }
          >
            <Download size={15} />
            {copy("Export view", "خروجی این نما")}
          </button>
          <button
            className="mc-btn"
            onClick={() => {
              setQuery("");
              setTeam("all");
              setOwner("all");
              setBucket("open");
              setMonth("scope");
              setProject("all");
            }}
          >
            {copy("Clear filters", "پاک کردن فیلترها")}
          </button>
          <span className="mc-note" aria-live="polite">
            {copy(
              `${rows.length} actions shown`,
              `${fmtNum(rows.length, locale)} کار نمایش داده شده`,
            )}
          </span>
        </div>
        {rows.length ? (
          <Table
            caption={copy("Planning action register", "دفتر کارهای برنامه‌ریزی")}
            headers={[
              copy("Person", "فرد"),
              copy("Action", "کار"),
              copy("Status", "وضعیت"),
              copy("Latest comment", "آخرین توضیح"),
              copy("Due / month", "سررسید / ماه"),
            ]}
          >
            {rows.map((task) => (
              <tr key={task.id}>
                <td>
                  <strong>{lookup(PERSON_NAMES, task.owner, locale)}</strong>
                  <small>{teamLabel(task.team, locale)}</small>
                </td>
                <td className="mc-action-cell">
                  <button className="mc-link" onClick={() => setEditing(task)}>
                    {displayText(task.title, TASK_TITLES[task.id], locale)}
                  </button>
                  <small>
                    {task.id} · {lookup(PROJECT_NAMES, task.project, locale)}
                  </small>
                  {task.priority === "High" && (
                    <Pill
                      value="High"
                      label={lookup(PRIORITY, "High", locale)}
                    />
                  )}
                </td>
                <td>
                  <Pill
                    value={task.status}
                    label={lookup(ACTION_STATUS, task.status, locale)}
                  />
                  {carriedTask(task) && (
                    <small>{copy("Carried over", "منتقل‌شده")}</small>
                  )}
                </td>
                <td className="mc-action-cell">
                  {displayText(task.comment, TASK_COMMENTS[task.id], locale)}
                </td>
                <td>
                  <span className={overdueTask(task) ? "mc-bad" : ""}>
                    {date(task.due, locale)}
                  </span>
                  <small>{task.month}</small>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty locale={locale} />
        )}
      </Panel>
      {editing && (
        <Modal
          title={
            editing === "new"
              ? copy("New demo action", "کار جدید در دمو")
              : copy(`Update ${editing.id}`, `ویرایش ${editing.id}`)
          }
          onClose={() => setEditing(null)}
          locale={locale}
        >
          <form onSubmit={save} className="mc-form">
            <label className="mc-field">
              {copy("Action title", "عنوان کار")}
              <input
                name="title"
                required
                maxLength={160}
                defaultValue={editing === "new" ? "" : editing.title}
              />
            </label>
            <div className="mc-form-row">
              <label className="mc-field">
                {copy("Owner", "مسئول")}
                <select
                  name="owner"
                  defaultValue={editing === "new" ? people[0] : editing.owner}
                >
                  {people.map((person) => (
                    <option key={person} value={person}>
                      {lookup(PERSON_NAMES, person, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mc-field">
                {copy("Team", "گروه")}
                <select
                  name="team"
                  defaultValue={editing === "new" ? "a" : editing.team}
                >
                  {teams.map((row) => (
                    <option key={row.id} value={row.id}>
                      {teamLabel(row.id, locale)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mc-field">
              {copy("Project", "پروژه")}
              <input
                name="project"
                required
                maxLength={100}
                defaultValue={
                  editing === "new" ? "General operations" : editing.project
                }
              />
            </label>
            <div className="mc-form-row">
              <label className="mc-field">
                {copy("Status", "وضعیت")}
                <select
                  name="status"
                  defaultValue={
                    editing === "new" ? "Not started" : editing.status
                  }
                >
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {lookup(ACTION_STATUS, status, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mc-field">
                {copy("Priority", "اولویت")}
                <select
                  name="priority"
                  defaultValue={editing === "new" ? "Normal" : editing.priority}
                >
                  <option value="Normal">
                    {lookup(PRIORITY, "Normal", locale)}
                  </option>
                  <option value="High">
                    {lookup(PRIORITY, "High", locale)}
                  </option>
                </select>
              </label>
            </div>
            <label className="mc-field">
              {copy("Due date", "تاریخ سررسید")}
              <input
                type="date"
                name="due"
                required
                defaultValue={editing === "new" ? DEMO_DAY : editing.due}
              />
            </label>
            <label className="mc-field">
              {copy("Latest comment", "آخرین توضیح")}
              <textarea
                name="comment"
                maxLength={2000}
                defaultValue={editing === "new" ? "" : editing.comment}
              />
            </label>
            <button className="mc-btn mc-btn-primary" type="submit">
              {copy("Save demo action", "ذخیرهٔ کار در دمو")}
            </button>
            <p className="mc-note">
              {copy(
                "This changes only the fictional data stored in your browser.",
                "این فقط دادهٔ ساختگی ذخیره‌شده در مرورگر شما را تغییر می‌دهد.",
              )}
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function Finance({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [all, setAll] = useState(false);
  const [payment, setPayment] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const won = data.deals.filter((deal) => deal.stage === "Won");
  const rows = won.filter((deal) => all || deal.paid < deal.value);
  const deal = data.deals.find((row) => row.id === payment);
  return (
    <div className="mc-stack">
      <div className="mc-stats">
        <Stat
          label={copy("Booked contracts", "قراردادهای ثبت‌شده")}
          value={money(won.reduce((sum, row) => sum + row.value, 0), locale)}
          detail={copy("Won deals only", "فقط قراردادهای برنده‌شده")}
        />
        <Stat
          label={copy("Collected", "وصول‌شده")}
          value={money(won.reduce((sum, row) => sum + row.paid, 0), locale)}
          detail={copy(
            "Payments against won contracts",
            "پرداخت‌های قراردادهای برنده‌شده",
          )}
        />
        <Stat
          label={copy("Outstanding", "مانده")}
          value={money(
            won.reduce((sum, row) => sum + row.value - row.paid, 0),
            locale,
          )}
          detail={copy(
            "Contract value less recorded payments",
            "مبلغ قرارداد منهای پرداخت‌های ثبت‌شده",
          )}
        />
        <Stat
          label={copy("Overdue", "معوق")}
          value={money(managementMetrics(data).overdue, locale)}
          detail={copy(
            "Outstanding balances due before 1 October",
            "مانده‌هایی که سررسیدشان پیش از ۹ مهر بوده",
          )}
        />
      </div>
      <Panel
        title={copy(
          "C&C · contracts and collections",
          "قرارداد و وصول · مانده‌ها و دریافت‌ها",
        )}
        subtitle={copy(
          "Review balances and record a fictional payment. No financial transaction takes place.",
          "مانده‌ها را ببینید و یک پرداخت ساختگی ثبت کنید. هیچ تراکنش مالی‌ای انجام نمی‌شود.",
        )}
      >
        <p role="status" className={notice ? "mc-notice" : "sr-only"}>
          {notice}
        </p>
        <label className="flex items-center gap-2 mb-5 text-sm">
          <input
            type="checkbox"
            checked={all}
            onChange={(e) => setAll(e.target.checked)}
          />
          {copy("Include fully paid contracts", "قراردادهای تسویه‌شده هم نشان داده شوند")}
        </label>
        {rows.length ? (
          <Table
            caption={copy("Contract collections", "وصول قراردادها")}
            headers={[
              copy("Contract", "قرارداد"),
              copy("Customer", "مشتری"),
              copy("Value", "مبلغ"),
              copy("Paid", "پرداخت‌شده"),
              copy("Balance", "مانده"),
              copy("Due", "سررسید"),
              copy("Action", "اقدام"),
            ]}
          >
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {row.id}
                  <small>
                    {displayText(row.title, DEAL_TITLES[row.id], locale)}
                  </small>
                </td>
                <td>{lookup(CLIENT_NAMES, row.client, locale)}</td>
                <td>{money(row.value, locale)}</td>
                <td>{money(row.paid, locale)}</td>
                <td>{money(row.value - row.paid, locale)}</td>
                <td>
                  {date(row.due, locale)}
                  <small>
                    {row.paid === row.value
                      ? copy("Paid", "تسویه‌شده")
                      : row.due < DEMO_DAY
                        ? copy("Overdue", "معوق")
                        : copy("Not yet due", "سررسید نرسیده")}
                  </small>
                </td>
                <td>
                  <button
                    className="mc-link"
                    disabled={row.paid === row.value}
                    onClick={() => setPayment(row.id)}
                  >
                    {row.paid === row.value
                      ? copy("Settled", "تسویه شد")
                      : copy("Record payment", "ثبت پرداخت")}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty locale={locale} />
        )}
      </Panel>
      {deal && (
        <Modal
          title={copy(
            `Demo payment · ${deal.id}`,
            `پرداخت دمو · ${deal.id}`,
          )}
          onClose={() => setPayment(null)}
          locale={locale}
        >
          <form
            className="mc-form"
            onSubmit={(event) => {
              event.preventDefault();
              const amount = Number(
                new FormData(event.currentTarget).get("amount"),
              );
              if (
                !Number.isFinite(amount) ||
                amount <= 0 ||
                amount > deal.value - deal.paid
              )
                return;
              updateDemo((current) => ({
                ...current,
                deals: current.deals.map((row) =>
                  row.id === deal.id
                    ? { ...row, paid: Math.min(row.value, row.paid + amount) }
                    : row,
                ),
              }));
              setPayment(null);
              setNotice(
                copy(
                  `Demo payment recorded against ${deal.id}. No money was transferred.`,
                  `پرداخت دمو روی ${deal.id} ثبت شد. هیچ پولی جابه‌جا نشد.`,
                ),
              );
            }}
          >
            <p>
              {copy("Outstanding", "مانده")}:{" "}
              {money(deal.value - deal.paid, locale)}
            </p>
            <label className="mc-field">
              {copy("Payment amount (million toman)", "مبلغ پرداخت (میلیون تومان)")}
              <input
                name="amount"
                type="number"
                min="0.01"
                max={deal.value - deal.paid}
                step="0.01"
                required
              />
            </label>
            <button className="mc-btn mc-btn-primary">
              {copy("Record in demo", "ثبت در دمو")}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export function Digest({
  data,
  locale,
}: {
  data: DemoState;
  locale: Locale;
}) {
  const copy = makeCopy(locale);
  const [notice, setNotice] = useState("");
  const open = data.tasks.filter((task) => task.status !== "Done");
  return (
    <Panel
      title={copy("Daily digest", "گزارش روزانه")}
      subtitle={copy(
        "A preview of the 07:00 Tehran briefing. This demo has no scheduled job, Google connection or email delivery.",
        "پیش‌نمایش گزارش ساعت ۷ صبح به وقت تهران. این دمو هیچ زمان‌بندی، اتصال گوگل یا ارسال ایمیلی ندارد.",
      )}
      action={
        <button
          className="mc-btn mc-btn-primary"
          onClick={() => {
            updateDemo((current) => ({
              ...current,
              digestRuns: [
                {
                  id: crypto.randomUUID(),
                  date: new Date().toISOString(),
                  open: current.tasks.filter((task) => task.status !== "Done")
                    .length,
                },
                ...current.digestRuns,
              ].slice(0, 10),
            }));
            setNotice(
              copy(
                "Simulation complete. A local run was recorded; no email was sent.",
                "شبیه‌سازی تمام شد. یک اجرای محلی ثبت شد؛ هیچ ایمیلی ارسال نشد.",
              ),
            );
          }}
        >
          <Send size={17} />
          {copy("Simulate send", "شبیه‌سازی ارسال")}
        </button>
      }
    >
      {notice && (
        <p className="mc-notice" role="status">
          {notice}
        </p>
      )}
      <p className="mc-connection">
        <CheckCircle2 size={17} />
        {copy(
          "Sample workbook loaded from fictional demo records",
          "فایل نمونه از رکوردهای ساختگی دمو بارگذاری شد",
        )}
      </p>
      <p className="mc-connection">
        <CheckCircle2 size={17} />
        {copy(
          "Preview recipient: management@example.com",
          "گیرندهٔ پیش‌نمایش: management@example.com",
        )}
      </p>
      <p className="mc-connection">
        <CheckCircle2 size={17} />
        {copy(
          "Schedule preview: 07:00 · Tehran time · disabled in demo",
          "زمان‌بندی پیش‌نمایش: ساعت ۷ صبح · به وقت تهران · در دمو غیرفعال",
        )}
      </p>
      <p className="mt-7">
        {copy(
          "Subject: Nova Industrial daily planning | 1 October 2026",
          "موضوع: برنامه‌ریزی روزانهٔ نوا اینداستریال | ۹ مهر ۱۴۰۵",
        )}
      </p>
      <div className="mc-digest-preview">
        <div className="mc-digest-heading">
          <h3>{copy("Good morning, team.", "صبح بخیر، تیم.")}</h3>
          <p>
            {copy(
              `${open.length} open actions · ${open.filter(carriedTask).length} carried over · ${open.filter((row) => row.status === "Blocked").length} blocked`,
              `${fmtNum(open.length, locale)} کار باز · ${fmtNum(open.filter(carriedTask).length, locale)} منتقل‌شده · ${fmtNum(open.filter((row) => row.status === "Blocked").length, locale)} متوقف`,
            )}
          </p>
        </div>
        <div className="mc-three">
          {teams.map((team) => (
            <div key={team.id} className="mc-team">
              <h3>{teamLabel(team.id, locale)}</h3>
              <p>{TEAM_FOCUS[team.id]?.[locale] ?? team.focus}</p>
              <strong>
                {copy(
                  `${open.filter((row) => row.team === team.id).length} open actions`,
                  `${fmtNum(open.filter((row) => row.team === team.id).length, locale)} کار باز`,
                )}
              </strong>
            </div>
          ))}
        </div>
        <div className="mc-list mt-6">
          {open.map((task) => (
            <div key={task.id} className="mc-list-item">
              <div>
                <strong>
                  {displayText(task.title, TASK_TITLES[task.id], locale)}
                </strong>
                <p>
                  {lookup(PERSON_NAMES, task.owner, locale)} ·{" "}
                  {teamLabel(task.team, locale)} · {copy("Due", "سررسید")}{" "}
                  {date(task.due, locale)}
                </p>
                <p>
                  {displayText(task.comment, TASK_COMMENTS[task.id], locale)}
                </p>
              </div>
              <Pill
                value={task.status}
                label={lookup(ACTION_STATUS, task.status, locale)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mc-filters mt-5">
        <button
          className="mc-btn"
          onClick={() =>
            downloadText("nova-daily-digest.txt", digestText(data))
          }
        >
          <Download size={15} />
          {copy("Download digest", "دانلود گزارش")}
        </button>
      </div>
      <h3 className="font-semibold mt-7 mb-3">
        {copy("Local simulation history", "سوابق شبیه‌سازی محلی")}
      </h3>
      {data.digestRuns.length ? (
        <Table
          caption={copy("Digest simulation history", "سوابق شبیه‌سازی گزارش")}
          headers={[
            copy("Run time · Tehran", "زمان اجرا · تهران"),
            copy("Open actions", "کارهای باز"),
            copy("Result", "نتیجه"),
          ]}
        >
          {data.digestRuns.map((run) => (
            <tr key={run.id}>
              <td>
                {new Date(run.date).toLocaleString(
                  locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB",
                  { timeZone: "Asia/Tehran" },
                )}
              </td>
              <td>{fmtNum(run.open, locale)}</td>
              <td>
                {copy(
                  "Simulated · no email sent",
                  "شبیه‌سازی‌شده · ایمیلی ارسال نشد",
                )}
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <p className="mc-note">
          {copy("No simulated runs yet.", "هنوز اجرای شبیه‌سازی‌شده‌ای نیست.")}
        </p>
      )}
    </Panel>
  );
}
