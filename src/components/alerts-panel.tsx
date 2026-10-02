import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { StatusPill } from "./ui";
import { t, type Locale } from "@/lib/i18n";
import type { Alert } from "@/lib/demo/laboratory";

const TONE = {
  critical: { tone: "critical", key: "sevCritical" },
  serious: { tone: "serious", key: "sevSerious" },
  warning: { tone: "warning", key: "sevWarning" },
} as const;

export function AlertsPanel({
  locale,
  alerts,
}: {
  locale: Locale;
  alerts: Alert[];
}) {
  // The arrow points the way the reader is going, which flips with the script.
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;

  return (
    <ul className="divide-y divide-line">
      {alerts.map((a) => {
        const tone = TONE[a.severity];
        return (
          <li key={a.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={tone.tone} label={t(locale, tone.key)} />
              <h3 className="text-sm font-semibold text-ink">
                {a.title[locale]}
              </h3>
            </div>
            <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-ink-2">
              {a.detail[locale]}
            </p>
            <Link
              href={`/${locale}${a.href}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              {a.cta[locale]}
              <Arrow size={13} aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
