import { ChevronRight } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";

export type Column = {
  key: string;
  label: string;
  /** Right-align and use tabular figures. */
  numeric?: boolean;
};

/**
 * Every chart has a table twin: the WCAG-clean equivalent that keeps each value
 * reachable without hovering, and carries the relief for the light-mode series
 * colours that sit below 3:1 on the surface.
 */
export function TableView({
  locale,
  caption,
  columns,
  rows,
}: {
  locale: Locale;
  caption: string;
  columns: Column[];
  rows: Record<string, string>[];
}) {
  return (
    <details className="group mt-4 border-t border-line pt-3">
      <summary className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-ink-2 hover:text-ink">
        <ChevronRight
          size={14}
          aria-hidden
          className="transition-transform group-open:rotate-90"
        />
        {t(locale, "tableView")}
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line text-start">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`py-2 pe-4 font-medium text-ink-3 ${
                    c.numeric ? "text-end" : ""
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[columns[0].key] ?? i} className="border-b border-line/60">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`py-1.5 pe-4 ${
                      c.numeric ? "tnum text-end text-ink" : "text-ink-2"
                    }`}
                  >
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
