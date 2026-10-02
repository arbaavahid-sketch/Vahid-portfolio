"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_LABEL, otherLocale, type Locale } from "@/lib/i18n";

/**
 * Swaps only the first path segment, so the reader lands on the same page in
 * the other language instead of being dropped back at the index.
 */
export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const next = otherLocale(locale);
  const href = pathname.replace(/^\/[^/]+/, `/${next}`) || `/${next}`;

  return (
    <Link
      href={href}
      hrefLang={next}
      lang={next}
      className="inline-flex h-9 items-center rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-ink-2 hover:text-ink"
    >
      {LOCALE_LABEL[next]}
    </Link>
  );
}
