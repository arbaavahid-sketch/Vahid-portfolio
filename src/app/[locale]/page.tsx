import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  FlaskConical,
  LineChart,
  LayoutGrid,
  Mail,
  Phone,
} from "lucide-react";
import { notFound } from "next/navigation";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProjectBrief } from "@/components/project-brief";
import { isLocale, t } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const fa = locale === "fa";
  const copy = (en: string, persian: string) => (fa ? persian : en);
  const Arrow = fa ? ArrowLeft : ArrowRight;
  const demos = [
    {
      path: "management",
      icon: LayoutGrid,
      title: copy("Management Center", "مرکز مدیریت سازمانی"),
      text: copy(
        "A complete workspace with management, technical, supply, planning, team dashboards, weekly comparisons and local announcements. Edit an action and follow it through the daily digest.",
        "یک محیط چندصفحه‌ای برای مدیریت، فنی، تأمین، برنامه‌ریزی، گروه‌ها، مقایسهٔ هفتگی و پیام‌ها. یک کار را ویرایش کنید و تغییرش را در گزارش روزانه ببینید.",
      ),
      tag: copy("Full application demo", "دموی کامل اپلیکیشن"),
      features: [
        copy("7 planning sections", "۷ بخش برنامه‌ریزی"),
        copy("Editable records", "رکوردهای قابل ویرایش"),
        copy("Daily digest", "گزارش روزانه"),
      ],
      number: "01",
    },
    {
      path: "laboratory",
      icon: FlaskConical,
      title: t(locale, "labTitle"),
      text: t(locale, "labBlurb"),
      tag: copy("Laboratories", "آزمایشگاه‌ها"),
      features: [
        copy("Sample tracking", "رهگیری نمونه"),
        "TAT / QC",
        copy("Calibration", "کالیبراسیون"),
      ],
      number: "02",
    },
    {
      path: "sales",
      icon: LineChart,
      title: t(locale, "salesTitle"),
      text: t(locale, "salesBlurb"),
      tag: copy("Trading companies", "شرکت‌های بازرگانی"),
      features: [
        copy("Revenue & margin", "فروش و حاشیه سود"),
        copy("Receivables", "مطالبات"),
        copy("Pipeline", "فرصت‌های فروش"),
      ],
      number: "03",
    },
    {
      path: "inventory",
      icon: Boxes,
      title: t(locale, "inventoryTitle"),
      text: t(locale, "inventoryBlurb"),
      tag: copy("Manufacturers", "شرکت‌های تولیدی"),
      features: [
        copy("Stock cover", "پوشش موجودی"),
        copy("Batch yield", "بازده بچ"),
        copy("Downtime", "توقف خط"),
      ],
      number: "04",
    },
  ];
  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-xl bg-navy text-xs font-bold tracking-wide text-white"
              aria-hidden
            >
              VA
            </span>
            <span className="text-sm font-semibold">
              {t(locale, "siteOwner")}
            </span>
          </Link>
          <nav
            aria-label={copy("Main navigation", "راهبری اصلی")}
            className="hidden items-center gap-7 text-xs font-medium text-ink-2 md:flex"
          >
            <a href="#demos" className="hover:text-accent">
              {copy("Live demos", "دموها")}
            </a>
            <a href="#approach" className="hover:text-accent">
              {copy("How we work", "روند همکاری")}
            </a>
            <a href="#contact" className="hover:text-accent">
              {copy("Discuss a project", "گفت‌وگو دربارهٔ پروژه")}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </header>
      <main id="main">
        <section className="relative overflow-hidden bg-hero text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-24">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-blue-200 uppercase">
                <span className="h-px w-7 bg-brand-accent" />
                {copy(
                  "Laboratories · Chemical industry",
                  "آزمایشگاه و صنایع شیمیایی",
                )}
              </p>
              <h1 className="mt-6 max-w-2xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                {copy("Your operations.", "وضعیت کارتان را")}
                <br />
                <span className="text-blue-200">
                  {copy("A clearer view.", "روشن‌تر ببینید.")}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-blue-100/85">
                {copy(
                  "Custom web dashboards for sample tracking, sales and production. Bring scattered records into one view, built around the decisions your team makes every day.",
                  "داشبورد تحت وب برای رهگیری نمونه‌ها، فروش و تولید. اطلاعات پراکنده را در یک صفحه ببینید؛ متناسب با تصمیم‌هایی که تیم شما هر روز می‌گیرد.",
                )}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#demos"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-blue-50"
                >
                  {copy("Explore the demos", "دموها را ببینید")}
                  <Arrow size={16} />
                </a>
                <a
                  href="#contact"
                  className="rounded-lg border border-white/30 px-5 py-3 text-sm font-medium hover:bg-white/10"
                >
                  {copy("Discuss your workflow", "دربارهٔ نیازتان صحبت کنیم")}
                </a>
              </div>
              <p className="mt-6 text-xs text-blue-200">
                {copy(
                  "No sign-up. All demo data is fictional.",
                  "بدون ثبت‌نام. تمام داده‌های دموها ساختگی‌اند.",
                )}
              </p>
            </div>
            <div
              className="relative rounded-2xl border border-white/20 bg-[#0b1c35]/80 p-5 shadow-2xl sm:p-7"
              dir="ltr"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <FlaskConical size={16} />
                  {copy("OPERATIONS / PREVIEW", "پیش‌نمایش عملیات")}
                </div>
                <span className="rounded-full border border-white/20 px-2 py-1 text-[10px] text-blue-200">
                  {copy("Illustrative", "نمایشی")}
                </span>
              </div>
              <div className="mt-6 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-blue-200">
                    {copy("From record to decision", "از ثبت داده تا تصمیم")}
                  </p>
                  <p className="mt-2 text-2xl font-medium">
                    {copy("Every step, visible.", "هر مرحله، قابل پیگیری.")}
                  </p>
                </div>
                <span className="rounded-lg bg-white/10 p-2">
                  <LineChart size={20} className="text-blue-200" />
                </span>
              </div>
              <div
                className="mt-8 flex h-32 items-end gap-3 border-b border-white/15 pb-1"
                aria-hidden
              >
                {[38, 55, 44, 70, 62, 84, 73, 96, 87, 108, 100, 120].map(
                  (height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${i === 11 ? "bg-brand-accent" : "bg-blue-400/60"}`}
                      style={{ height }}
                    />
                  ),
                )}
              </div>
              <div className="mt-6 space-y-3">
                {[
                  copy(
                    "Trace each sample through the lab",
                    "مسیر هر نمونه را در آزمایشگاه دنبال کنید",
                  ),
                  copy(
                    "Spot invoices that need a follow-up",
                    "فاکتورهای نیازمند پیگیری را ببینید",
                  ),
                  copy(
                    "See materials at risk of running out",
                    "مواد در معرض کمبود را شناسایی کنید",
                  ),
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3 text-xs text-blue-100"
                    dir={fa ? "rtl" : "ltr"}
                  >
                    <Check size={14} className="shrink-0 text-blue-300" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          id="demos"
          className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 lg:px-8 lg:py-20"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                {copy("Explore the work", "نمونه‌کارهای تعاملی")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                {copy(
                  "Explore the apps. Try the workflows.",
                  "اپ‌ها را باز کنید؛ فرایندها را امتحان کنید.",
                )}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ink-3">
              {copy(
                "Open a dashboard, filter the records and inspect the numbers behind each chart.",
                "داشبورد را باز کنید، رکوردها را فیلتر کنید و داده‌های پشت نمودارها را ببینید.",
              )}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {demos.map(
              ({ path, icon: Icon, title, text, tag, features, number }) => (
                <Link
                  key={path}
                  href={`/${locale}/demo/${path}`}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-colors hover:border-accent/50"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon size={23} />
                    </span>
                    <span className="text-xs text-ink-3" dir="ltr">
                      {number} / {copy("DEMO", "دمو")}
                    </span>
                  </div>
                  <p className="mt-7 text-xs font-medium text-accent">{tag}</p>
                  <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-ink-2">
                    {text}
                  </p>
                  <ul className="my-5 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-md bg-surface-2 px-2 py-1 text-[11px] text-ink-3"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center justify-between border-t border-line pt-4 text-sm font-medium text-accent">
                    {t(locale, "openDemo")}
                    <Arrow size={16} />
                  </span>
                </Link>
              ),
            )}
          </div>
        </section>
        <section
          id="approach"
          className="scroll-mt-8 border-y border-line bg-surface"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_2fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">
                {copy(
                  "From your data to a working tool",
                  "از دادهٔ شما تا ابزار قابل استفاده",
                )}
              </p>
              <h2 className="mt-3 text-2xl leading-relaxed font-semibold">
                {copy(
                  "Start with one useful workflow.",
                  "از یک فرایند مشخص شروع می‌کنیم.",
                )}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink-3">
                {copy(
                  "Scope, data access and delivery are agreed after reviewing your requirements. Integration depends on what your existing systems make available.",
                  "دامنهٔ کار، دسترسی به داده و زمان تحویل پس از بررسی نیازها مشخص می‌شوند. امکان اتصال به هر سامانه به دسترسی‌هایی بستگی دارد که آن سامانه فراهم می‌کند.",
                )}
              </p>
            </div>
            <ol className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: copy("Define the decision", "تعریف نیاز"),
                  text: copy(
                    "Choose the users, the questions they need answered and the measures that matter.",
                    "کاربران، پرسش‌های روزانه و شاخص‌های مورد نیاز را مشخص می‌کنیم.",
                  ),
                },
                {
                  title: copy("Review the data", "بررسی داده"),
                  text: copy(
                    "Map your spreadsheets or available APIs. Agree on definitions, access and update frequency.",
                    "فایل‌ها و رابط‌های موجود را بررسی می‌کنیم و تعریف شاخص‌ها، دسترسی‌ها و دورهٔ به‌روزرسانی را تعیین می‌کنیم.",
                  ),
                },
                {
                  title: copy("Build and validate", "ساخت و اعتبارسنجی"),
                  text: copy(
                    "Review a working prototype, reconcile the numbers and prepare the agreed deployment and handover.",
                    "نسخهٔ اولیه را بررسی می‌کنید؛ اعداد با منبع تطبیق داده می‌شوند و استقرار و تحویل طبق توافق انجام می‌شود.",
                  ),
                },
              ].map((step, i) => (
                <li
                  key={step.title}
                  className="border-t-2 border-accent/20 pt-4"
                >
                  <span className="text-xs font-semibold text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-2">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          id="contact"
          className="mx-auto grid max-w-7xl scroll-mt-8 gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">
              {copy("Let's discuss your project", "گفت‌وگو دربارهٔ پروژه")}
            </p>
            <h2 className="mt-3 text-3xl leading-snug font-semibold">
              {copy(
                "What do you need to see more clearly?",
                "کدام بخش کارتان باید روشن‌تر دیده شود؟",
              )}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-ink-2">
              {copy(
                "Tell me how you track the work today and where reporting slows your team down. A short description is enough to start.",
                "بگویید امروز کارها را چطور پیگیری می‌کنید و گزارش‌گیری کجا وقت تیم را می‌گیرد. برای شروع یک توضیح کوتاه کافی است.",
              )}
            </p>
            <div className="mt-8 border-t border-line pt-6">
              <p className="font-semibold">{t(locale, "siteOwner")}</p>
              <a
                href="mailto:arbaavahid@gmail.com"
                className="mt-5 flex w-fit items-center gap-3 text-sm text-accent"
              >
                <Mail size={17} />
                <span dir="ltr">arbaavahid@gmail.com</span>
                <ArrowUpRight size={14} />
              </a>
              <a
                href="tel:+989352244130"
                className="mt-4 flex w-fit items-center gap-3 text-sm text-accent"
              >
                <Phone size={17} />
                <span dir="ltr">0935 224 4130</span>
              </a>
            </div>
          </div>
          <ProjectBrief locale={locale} />
        </section>
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-xs text-ink-3 lg:px-8">
          <span>
            {t(locale, "siteOwner")} ·{" "}
            {copy("Custom web dashboards", "طراحی داشبورد تحت وب")}
          </span>
          <span>
            {copy(
              "All demo companies and records are fictional.",
              "همهٔ شرکت‌ها و رکوردهای دموها ساختگی‌اند.",
            )}
          </span>
        </div>
      </footer>
    </div>
  );
}
