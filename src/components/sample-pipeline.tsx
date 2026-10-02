import { fmtNum } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import {
  SAMPLE_STATUS_LABEL,
  type SampleStatus,
} from "@/lib/demo/laboratory";

/**
 * Custody stages are an ordered scale, so they take the ordinal ramp — one
 * hue, darker as the sample moves down the bench — rather than categorical
 * hues, which would imply the stages are unrelated.
 */
export function SamplePipeline({
  locale,
  stages,
}: {
  locale: Locale;
  stages: { status: SampleStatus; count: number }[];
}) {
  const max = Math.max(...stages.map((s) => s.count));

  return (
    <ol className="space-y-2.5">
      {stages.map((s, i) => (
        <li key={s.status} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3">
          <span className="text-xs text-ink-2">
            {SAMPLE_STATUS_LABEL[s.status][locale]}
          </span>
          <span className="h-2.5 w-full">
            <span
              className="block h-full rounded-e-[4px]"
              style={{
                width: `${(s.count / max) * 100}%`,
                background: `var(--ord-${i + 1})`,
              }}
            />
          </span>
          <span className="tnum text-end text-xs font-semibold text-ink">
            {fmtNum(s.count, locale)}
          </span>
        </li>
      ))}
    </ol>
  );
}
