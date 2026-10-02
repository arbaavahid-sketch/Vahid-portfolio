import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  FlaskConical,
  LineChart,
} from "lucide-react";
import type { ReactNode } from "react";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";
import { t, type Locale } from "@/lib/i18n";
import { SNAPSHOT } from "@/lib/demo/business";
import { fmtDate } from "@/lib/format";

export function BusinessShell({
  locale,
  active,
  children,
}: {
  locale: Locale;
  active: "sales" | "inventory";
  children: ReactNode;
}) {
  const Back = locale === "fa" ? ArrowRight : ArrowLeft;
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Back size={16} />
            {t(locale, "siteOwner")}
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-7xl px-5 py-7 sm:py-10">
        <nav
          aria-label={t(locale, "allDemos")}
          className="mb-7 flex flex-wrap gap-2"
        >
          {(
            [
              { slug: "laboratory", key: "labTitle", icon: FlaskConical },
              { slug: "sales", key: "salesTitle", icon: LineChart },
              { slug: "inventory", key: "inventoryTitle", icon: Boxes },
            ] as const
          ).map(({ slug, key, icon: Icon }) => (
            <Link
              key={slug}
              href={`/${locale}/demo/${slug}`}
              aria-current={active === slug ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${active === slug ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface"}`}
            >
              <Icon size={15} />
              {t(locale, key)}
            </Link>
          ))}
        </nav>
        <div className="mb-6 flex flex-wrap justify-between gap-2 border-s-2 border-brand-accent ps-3 text-xs text-ink-3">
          <span>
            {locale === "fa"
              ? "دموی تعاملی با داده‌های ساختگی؛ بدون اتصال به اطلاعات شرکت‌ها."
              : "Interactive demo with fictional data. No connection to company systems."}
          </span>
          <span>{fmtDate(SNAPSHOT, locale)}</span>
        </div>
        {children}
      </main>
      <footer className="mx-auto max-w-7xl px-5 py-8 text-xs text-ink-3">
        {t(locale, "demoFooter")}
      </footer>
    </div>
  );
}
