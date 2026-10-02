import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical, Info } from "lucide-react";
import { DemoNav } from "@/components/demo-nav";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LAB, TODAY } from "@/lib/demo/laboratory";
import { fmtDate } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";

export default async function LaboratoryDemoLayout({
  children,
  params,
}: LayoutProps<"/[locale]/demo/laboratory">) {
  const { locale } = (await params) as { locale: Locale };
  const Back = locale === "fa" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={`/${locale}`}
            aria-label={t(locale, "allDemos")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 hover:text-ink"
          >
            <Back size={14} aria-hidden />
            <span className="hidden sm:inline">{t(locale, "allDemos")}</span>
          </Link>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
              <FlaskConical size={16} aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-ink">
                {LAB.name[locale]}
              </div>
              <div className="truncate text-[11px] text-ink-3" dir="ltr">
                {LAB.accreditation}
              </div>
            </div>
          </div>

          <div className="ms-auto flex items-center gap-2">
            <span className="hidden text-xs text-ink-3 md:inline">
              {fmtDate(TODAY, locale)}
            </span>
            <LocaleSwitch locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:flex lg:py-8">
        <aside className="mb-5 shrink-0 lg:mb-0 lg:w-52">
          <div className="lg:sticky lg:top-24">
            <DemoNav locale={locale} />
          </div>
        </aside>

        <main id="main" className="min-w-0 flex-1">
          <DemoBanner locale={locale} />
          {children}
        </main>
      </div>

      <footer className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <p className="border-t border-line pt-5 text-xs text-ink-3">
          {t(locale, "demoFooter")}
        </p>
      </footer>
    </div>
  );
}

function DemoBanner({ locale }: { locale: Locale }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 px-4 py-3">
      <Info size={15} className="mt-0.5 shrink-0 text-ink-3" aria-hidden />
      <p className="text-xs leading-relaxed text-ink-2">
        <span className="font-semibold text-ink">
          {t(locale, "demoBannerLead")}
        </span>{" "}
        {t(locale, "demoBannerBody")}
      </p>
    </div>
  );
}
