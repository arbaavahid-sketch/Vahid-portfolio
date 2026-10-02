import { LOCALES, type Locale } from "./i18n";

/**
 * The public origin, used for canonical links, the sitemap and the absolute
 * URLs that Open Graph requires — a relative image URL will not render a
 * preview card anywhere.
 *
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every deployment, so the
 * production build picks up the real domain on its own. Set NEXT_PUBLIC_SITE_URL
 * once a custom domain is attached, and it wins over both.
 */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();

/** Every locale of one path, for the hreflang alternates. */
export function localeAlternates(path = ""): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
  );
}

export function canonical(locale: Locale, path = ""): string {
  return `${siteUrl}/${locale}${path}`;
}
