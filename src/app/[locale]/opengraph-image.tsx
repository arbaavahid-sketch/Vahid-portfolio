import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_LOCALE, isLocale, t } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  return [{ id: locale, size, contentType, alt: t(locale, "siteTitle") }];
}

/**
 * Vazirmatn is read from disk rather than fetched, so the build does not depend
 * on a font CDN being reachable. It covers Latin as well, which keeps both
 * cards on one typeface.
 */
const font = await readFile(
  join(process.cwd(), "assets", "Vazirmatn-SemiBold.ttf"),
);

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const fa = locale === "fa";

  const demos = fa
    ? ["آزمایشگاه", "فروش", "موجودی و تولید", "مرکز مدیریت"]
    : ["Laboratory", "Sales", "Inventory", "Management"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(115deg, #081c3c 0%, #13447e 100%)",
          color: "#ffffff",
          direction: fa ? "rtl" : "ltr",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ffffff",
              color: "#1c3f73",
              fontSize: 26,
            }}
          >
            VA
          </div>
          <div style={{ fontSize: 30, color: "#bfd1e7" }}>
            {t(locale, "siteOwner")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 24,
              color: "#8bc5ff",
            }}
          >
            <div style={{ width: 56, height: 3, background: "#ec7a1c" }} />
            {fa ? "آزمایشگاه و صنایع شیمیایی" : "Laboratories & chemical industry"}
          </div>
          <div style={{ fontSize: 62, lineHeight: 1.25, maxWidth: 940 }}>
            {t(locale, "siteTitle")}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {demos.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.28)",
                fontSize: 24,
                color: "#dbeafe",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Vazirmatn", data: font, style: "normal", weight: 600 }],
    },
  );
}
