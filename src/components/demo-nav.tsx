"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Microscope,
  Timer,
} from "lucide-react";
import { t, type DictKey, type Locale } from "@/lib/i18n";

const ITEMS = [
  { path: "", labelKey: "labNavOverview", icon: LayoutDashboard },
  { path: "/samples", labelKey: "labNavSamples", icon: FlaskConical },
  { path: "/instruments", labelKey: "labNavInstruments", icon: Microscope },
  { path: "/qc", labelKey: "labNavQc", icon: Gauge },
  { path: "/turnaround", labelKey: "labNavTurnaround", icon: Timer },
] satisfies { path: string; labelKey: DictKey; icon: typeof Timer }[];

export function DemoNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const base = `/${locale}/demo/laboratory`;

  return (
    <nav aria-label={t(locale, "labNavOverview")}>
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ITEMS.map((item) => {
          const href = `${base}${item.path}`;
          const active =
            item.path === "" ? pathname === href : pathname.startsWith(href);
          const Icon = item.icon;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )}
              >
                <Icon size={16} aria-hidden />
                {t(locale, item.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
