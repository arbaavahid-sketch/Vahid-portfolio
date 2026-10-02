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


/**
 * Satori has no bidi reordering: it lays Persian words out left-to-right, which
 * scrambles the sentence. So each word becomes its own flex item in a
 * row-reverse row, which Satori does lay out reliably — that puts the words in
 * the right visual order and gives us the word spacing back.
 */
function Words({
  text,
  rtl,
  size,
  color,
  wrap = true,
}: {
  text: string;
  rtl: boolean;
  size: number;
  color?: string;
  wrap?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        flexDirection: rtl ? "row-reverse" : "row",
        justifyContent: "flex-start",
        columnGap: size * 0.12,
        rowGap: size * 0.28,
        fontSize: size,
        color,
        ...(wrap ? { maxWidth: 1000 } : {}),
      }}
    >
      {text.split(" ").map((word, i) => (
        <div key={`${word}-${i}`} style={{ display: "flex" }}>
          {word}
        </div>
      ))}
    </div>
  );
}

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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexDirection: fa ? "row-reverse" : "row",
            alignSelf: fa ? "flex-end" : "flex-start",
          }}
        >
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
          <Words
            text={t(locale, "siteOwner")}
            rtl={fa}
            size={30}
            color="#bfd1e7"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignItems: fa ? "flex-end" : "flex-start",
            textAlign: fa ? "right" : "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              color: "#8bc5ff",
              flexDirection: fa ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                width: 56,
                height: 3,
                background: "#ec7a1c",
                marginLeft: fa ? 16 : 0,
                marginRight: fa ? 0 : 16,
              }}
            />
            <Words
              text={
                fa
                  ? "آزمایشگاه و صنایع شیمیایی"
                  : "Laboratories & chemical industry"
              }
              rtl={fa}
              size={24}
              color="#8bc5ff"
            />
          </div>
          <Words
            text={t(locale, "siteTitle")}
            rtl={fa}
            size={fa ? 56 : 62}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexDirection: fa ? "row-reverse" : "row",
            alignSelf: fa ? "flex-end" : "flex-start",
          }}
        >
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
              <Words
                text={label}
                rtl={fa}
                size={24}
                wrap={false}
              />
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
