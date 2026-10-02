import { BusinessShell } from "@/components/business-shell";
import { InventoryDashboard } from "@/components/inventory-dashboard";
import { isLocale, t } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/demo/inventory">) {
  const { locale } = await params;
  return {
    title: isLocale(locale)
      ? t(locale, "inventoryTitle")
      : "Inventory & Production Dashboard",
  };
}
export default async function InventoryPage({
  params,
}: PageProps<"/[locale]/demo/inventory">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <BusinessShell locale={locale} active="inventory">
      <InventoryDashboard locale={locale} />
    </BusinessShell>
  );
}
