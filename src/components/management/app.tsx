"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock3,
  DollarSign,
  Eye,
  House,
  LayoutGrid,
  Mail,
  MessageSquare,
  Package,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { dirOf, makeCopy, type Locale } from "@/lib/i18n";
import { teams } from "@/lib/demo/management";
import { TEAM_NAMES } from "@/lib/demo/management-i18n";
import { ThemeToggle } from "../theme-toggle";
import { LocaleSwitch } from "../locale-switch";
import { useDemo, resetDemo } from "./store";
import { Modal } from "./shared";
import { Digest, Finance, TaskBoard } from "./planning";
import {
  Dashboard,
  Messages,
  SalesPlan,
  Supply,
  Technical,
  WeeklyHistory,
} from "./operations";

type Copy = (en: string, fa: string) => string;

const navigationFor = (c: Copy) => [
  { path: "", title: c("Overview", "نمای کلی"), icon: House },
  { path: "management", title: c("Management", "مدیریت"), icon: LayoutGrid },
  { path: "technical", title: c("Technical", "فنی"), icon: Activity },
  { path: "supply", title: c("Supply", "تأمین"), icon: Package },
  { path: "planning", title: c("Planning", "برنامه‌ریزی"), icon: CalendarDays },
  {
    path: "weekly-history",
    title: c("Weekly history", "سوابق هفتگی"),
    icon: Clock3,
  },
  {
    path: "messages",
    title: c("CEO messages", "پیام‌های مدیرعامل"),
    icon: MessageSquare,
  },
];

const planningTabsFor = (c: Copy) => [
  { path: "", title: c("Actions", "کارها"), icon: CalendarDays },
  { path: "groups", title: c("Group planning", "برنامهٔ گروه‌ها"), icon: Users },
  {
    path: "projects",
    title: c("Project planning", "برنامهٔ پروژه‌ها"),
    icon: BriefcaseBusiness,
  },
  { path: "watchlist", title: c("Watch list", "فهرست پایش"), icon: Eye },
  { path: "finance", title: c("C&C", "قرارداد و وصول"), icon: DollarSign },
  { path: "sales", title: c("Sales plan", "برنامهٔ فروش"), icon: TrendingUp },
  { path: "digest", title: c("Daily digest", "گزارش روزانه"), icon: Mail },
];

const subtitlesFor = (c: Copy): Record<string, string> => ({
  "": c(
    "One workspace for sales, team actions, technical work and supply. Explore the records, update a task and follow the change through the demo.",
    "یک محیط واحد برای فروش، کارهای تیم، کار فنی و تأمین. رکوردها را ببینید، یک کار را تغییر دهید و اثرش را در دمو دنبال کنید.",
  ),
  management: c(
    "A shared view of group performance, contract execution and the operational commitments that need attention.",
    "نمای مشترک از عملکرد گروه‌ها، اجرای قراردادها و تعهدهای عملیاتی که رسیدگی می‌خواهند.",
  ),
  technical: c(
    "Track technical reviews, installations and service work. Inspect owners, due dates and the next step for every job.",
    "پیگیری بررسی‌های فنی، نصب‌ها و کارهای سرویس. مسئول، سررسید و قدم بعدی هر کار را ببینید.",
  ),
  supply: c(
    "Purchase orders, vendor commitments and delivery follow-up. See what is late and who owns the next action.",
    "سفارش‌های خرید، تعهد تأمین‌کننده‌ها و پیگیری تحویل. ببینید چه چیزی عقب است و قدم بعدی با کیست.",
  ),
  planning: c(
    "October 2026: every person's actions, carried-over work, project commitments and the morning management digest.",
    "مهر و آبان ۱۴۰۵: کارهای هر فرد، کارهای منتقل‌شده، تعهدهای پروژه‌ای و گزارش صبحگاهی مدیریت.",
  ),
  groups: c(
    "Group sales, open opportunities and related operational records, all connected to the same demo dataset.",
    "فروش گروه، فرصت‌های باز و رکوردهای عملیاتی مرتبط — همه روی یک مجموعه دادهٔ دمو.",
  ),
  "weekly-history": c(
    "Compare weekly performance across teams and inspect the figures behind the trend.",
    "مقایسهٔ عملکرد هفتگی گروه‌ها و دیدن اعدادی که پشت روند هستند.",
  ),
  messages: c(
    "Team announcements and acknowledgements, with a local authoring workflow to try yourself.",
    "اعلان‌های تیمی و تأیید دریافت، همراه با امکان نوشتن پیام که خودتان امتحان کنید.",
  ),
});

export function ManagementApp({
  locale,
  section,
}: {
  locale: Locale;
  section: string[];
}) {
  const { data, notice } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const copy = makeCopy(locale);
  const Exit = locale === "fa" ? ArrowRight : ArrowLeft;
  const navigation = navigationFor(copy);
  const planningTabs = planningTabsFor(copy);
  const subtitles = subtitlesFor(copy);
  const base = `/${locale}/demo/management`;
  const area = section[0] ?? "";
  const tab = section[1] ?? "";
  const title =
    area === "groups"
      ? (TEAM_NAMES[tab]?.[locale] ?? copy("Groups", "گروه‌ها"))
      : (navigation.find((item) => item.path === area)?.title ??
        copy("Overview", "نمای کلی"));
  const navLink = ({
    path,
    title: label,
    icon: Icon,
  }: (typeof navigation)[number]) => (
    <Link
      key={path}
      href={`${base}${path ? `/${path}` : ""}`}
      aria-current={area === path ? "page" : undefined}
    >
      <Icon size={16} aria-hidden />
      {label}
    </Link>
  );
  return (
    <div className="mc-app" lang={locale} dir={dirOf(locale)}>
      <header className="mc-topbar">
        <div className="mc-topbar-inner">
          <Link
            className="mc-brand"
            href={base}
            aria-label={copy("Nova Industrial overview", "نمای کلی نوا اینداستریال")}
          >
            <span className="mc-brand-mark" aria-hidden>
              NI
            </span>
            <span>
              <strong>{copy("Nova Industrial", "نوا اینداستریال")}</strong>
              <small>{copy("Management Center", "مرکز مدیریت")}</small>
            </span>
          </Link>
          <nav
            className="mc-main-nav"
            aria-label={copy("Management center navigation", "راهبری مرکز مدیریت")}
          >
            {navigation.slice(0, 5).map(navLink)}
            <details className="mc-groups">
              <summary className={area === "groups" ? "mc-selected" : ""}>
                <Users size={16} aria-hidden />
                {copy("Groups", "گروه‌ها")}
                <ChevronDown size={13} aria-hidden />
              </summary>
              <div className="mc-popover">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`${base}/groups/${team.id}`}
                    aria-current={
                      area === "groups" && tab === team.id ? "page" : undefined
                    }
                  >
                    {TEAM_NAMES[team.id]?.[locale] ?? team.name}
                  </Link>
                ))}
              </div>
            </details>
            {navigation.slice(5).map(navLink)}
          </nav>
          <div className="mc-tools">
            <LocaleSwitch locale={locale} />
            <ThemeToggle locale={locale} />
            <Link className="mc-exit" href={`/${locale}`}>
              <Exit size={15} />
              {copy("Exit demo", "خروج از دمو")}
            </Link>
          </div>
        </div>
      </header>
      <main className="mc-main" id="main">
        <div className="mc-banner">
          <span>
            <ShieldCheck size={15} />
            {copy(
              "Interactive demo · fictional company and records · changes stay in this browser",
              "دموی تعاملی · شرکت و رکوردها ساختگی‌اند · تغییرها فقط در همین مرورگر می‌مانند",
            )}
          </span>
          <button
            className="mc-link flex items-center gap-2"
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw size={13} />
            {copy("Reset demo", "بازنشانی دمو")}
          </button>
        </div>
        {notice && (
          <p className="mc-notice" role="status">
            {notice}
          </p>
        )}
        <section className="mc-hero">
          <div>
            <span className="mc-eyebrow">
              {area === "planning"
                ? copy("Team planning", "برنامه‌ریزی تیم")
                : copy("Nova Industrial workspace", "فضای کاری نوا اینداستریال")}
            </span>
            <h1>{title}</h1>
            <p>{subtitles[area]}</p>
          </div>
          <div className="mc-hero-card">
            {area === "planning" ? (
              <Mail size={26} color="#91d9d2" />
            ) : (
              <LayoutGrid size={26} color="#91d9d2" />
            )}
            <strong>
              {area === "planning"
                ? copy("Daily digest preview", "پیش‌نمایش گزارش روزانه")
                : copy("Connected demo views", "نماهای به‌هم‌پیوستهٔ دمو")}
            </strong>
            <span>
              {area === "planning"
                ? copy(
                    "07:00 · Tehran time · simulation only",
                    "ساعت ۷ صبح · به وقت تهران · فقط شبیه‌سازی",
                  )
                : copy(
                    "1 October 2026 · fictional snapshot",
                    "۹ مهر ۱۴۰۵ · وضعیت ساختگی",
                  )}
            </span>
          </div>
        </section>
        {area === "planning" && (
          <nav
            className="mc-tabs"
            aria-label={copy("Planning sections", "بخش‌های برنامه‌ریزی")}
          >
            {planningTabs.map(({ path, title: label, icon: Icon }) => (
              <Link
                key={path}
                href={`${base}/planning${path ? `/${path}` : ""}`}
                aria-current={tab === path ? "page" : undefined}
              >
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        )}
        {(area === "" || area === "management" || area === "groups") && (
          <Dashboard
            key={`${area}/${tab}`}
            data={data}
            base={base}
            overview={area === ""}
            team={area === "groups" ? tab : "all"}
            locale={locale}
          />
        )}
        {area === "technical" && <Technical data={data} locale={locale} />}
        {area === "supply" && <Supply data={data} locale={locale} />}
        {area === "planning" &&
          (["", "groups", "projects", "watchlist"].includes(tab) ? (
            <TaskBoard key={tab} data={data} mode={tab} locale={locale} />
          ) : tab === "finance" ? (
            <Finance data={data} locale={locale} />
          ) : tab === "sales" ? (
            <SalesPlan data={data} locale={locale} />
          ) : (
            <Digest data={data} locale={locale} />
          ))}
        {area === "weekly-history" && <WeeklyHistory locale={locale} />}
        {area === "messages" && <Messages data={data} locale={locale} />}
      </main>
      <footer className="mc-footer">
        {copy(
          "Demonstration by Vahid Arbaa · No company credentials, live workbooks or external message delivery.",
          "نمونهٔ نمایشی از وحید اربع · بدون رمز شرکتی، بدون فایل زنده و بدون ارسال پیام بیرونی.",
        )}
      </footer>
      {confirmReset && (
        <Modal
          title={copy("Reset this demo?", "دمو بازنشانی شود؟")}
          onClose={() => setConfirmReset(false)}
          locale={locale}
        >
          <p>
            {copy(
              "Restore the original sample records and remove your local demo actions, payments, announcements and simulated digest runs.",
              "رکوردهای نمونهٔ اولیه برمی‌گردند و کارها، پرداخت‌ها، اعلان‌ها و گزارش‌های شبیه‌سازی‌شدهٔ محلی شما حذف می‌شوند.",
            )}
          </p>
          <div className="mc-filters mt-6">
            <button
              className="mc-btn mc-btn-primary"
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
              }}
            >
              {copy("Restore sample data", "بازگرداندن دادهٔ نمونه")}
            </button>
            <button className="mc-btn" onClick={() => setConfirmReset(false)}>
              {copy("Keep my changes", "تغییرهایم بماند")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
