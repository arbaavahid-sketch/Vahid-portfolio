import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Vazirmatn } from "next/font/google";
import { DEFAULT_LOCALE, LOCALES, dirOf, isLocale, t } from "@/lib/i18n";
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
  return {
    title: {
      default: t(l, "siteTitle"),
      template: `%s · ${t(l, "siteOwner")}`,
    },
    description: t(l, "siteDescription"),
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
