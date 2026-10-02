import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Vazirmatn } from "next/font/google";
import { DEFAULT_LOCALE, LOCALES, dirOf, isLocale, t } from "@/lib/i18n";
import { canonical, localeAlternates, siteUrl } from "@/lib/site";
import "../globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const title = t(l, "siteTitle");
  const description = t(l, "siteDescription");

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${t(l, "siteOwner")}` },
    description,
    alternates: {
      canonical: canonical(l),
      languages: localeAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: t(l, "siteOwner"),
      locale: l === "fa" ? "fa_IR" : "en_GB",
      url: canonical(l),
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} ${inter.variable} min-h-screen antialiased`}
      >
        <a href="#main" className="skip-link">
          {t(locale, "skipToContent")}
        </a>
        {children}
      </body>
    </html>
  );
}
