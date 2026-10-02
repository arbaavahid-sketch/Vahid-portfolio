import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { canonical, localeAlternates } from "@/lib/site";

/** Every page, in both languages, cross-linked with hreflang. */
const PATHS = [
  "",
  "/demo/laboratory",
  "/demo/laboratory/samples",
  "/demo/laboratory/instruments",
  "/demo/laboratory/qc",
  "/demo/laboratory/turnaround",
  "/demo/sales",
  "/demo/inventory",
  "/demo/management",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    PATHS.map((path) => ({
      url: canonical(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: { languages: localeAlternates(path) },
    })),
  );
}
