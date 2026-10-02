import { notFound } from "next/navigation";
import { ManagementApp } from "@/components/management/app";
import { routes } from "@/lib/demo/management";
import { DEFAULT_LOCALE, isLocale, makeCopy } from "@/lib/i18n";
import "../management.css";

export function generateStaticParams() {
  return routes.map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section?: string[] }>;
}) {
  const { locale, section = [] } = await params;
  const copy = makeCopy(isLocale(locale) ? locale : DEFAULT_LOCALE);
  const names: Record<string, string> = {
    management: copy("Management", "مدیریت"),
    technical: copy("Technical", "فنی"),
    supply: copy("Supply", "تأمین"),
    planning: copy("Planning", "برنامه‌ریزی"),
    groups: copy("Groups", "گروه‌ها"),
    projects: copy("Projects", "پروژه‌ها"),
    watchlist: copy("Watch list", "فهرست پایش"),
    finance: copy("C&C", "قرارداد و وصول"),
    sales: copy("Sales plan", "برنامهٔ فروش"),
    digest: copy("Daily digest", "گزارش روزانه"),
    "weekly-history": copy("Weekly history", "سوابق هفتگی"),
    messages: copy("CEO messages", "پیام‌های مدیرعامل"),
  };
  const title = section.length
    ? section.map((part) => names[part] ?? part.replaceAll("-", " ")).join(" · ")
    : copy("Overview", "نمای کلی");
  return {
    title: `${title} · ${copy("Nova Management Demo", "دموی مدیریت نوا")}`,
  };
}
export default async function ManagementPage({
  params,
}: {
  params: Promise<{ locale: string; section?: string[] }>;
}) {
  const { locale, section = [] } = await params;
  if (
    !isLocale(locale) ||
    !routes.some((route) => route.join("/") === section.join("/"))
  )
    notFound();
  return <ManagementApp locale={locale} section={section} />;
}
