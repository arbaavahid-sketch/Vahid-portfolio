import { BusinessShell } from "@/components/business-shell";
import { SalesDashboard } from "@/components/sales-dashboard";
import { isLocale, t } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/sales">) {
  const { locale } = await params;
  return {
    title: isLocale(locale) ? t(locale, "salesTitle") : "Sales Dashboard",
  };
}
export default async function SalesPage({
  params,
}: PageProps<"/[locale]/demo/sales">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <BusinessShell locale={locale} active="sales">
      <SalesDashboard locale={locale} />
    </BusinessShell>
  );
}
