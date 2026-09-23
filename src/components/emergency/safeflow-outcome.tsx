import { formatSimDuration } from "@/lib/simulation/report";
import type { SafeFlowOutcome as Outcome } from "@/lib/simulation/safeflow";
import { cn } from "@/lib/utils";

/**
 * What the SafeFlow run achieved. Shown twice — on the emergency page and
 * inside the scenario report — so the two can never quote different
 * numbers. Every value is a sum or a ratio of the fire-response plan.
 */
export function SafeFlowOutcomeStats({
  outcome,
  className,
}: {
  outcome: Outcome;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-3 sm:grid-cols-3", className)}>
      <Stat
        label="인원 유도"
        value={`${outcome.redirected}명`}
        note={`고위험 경로에서 안전 경로로 재배분`}
      />
      <Stat
        label="회피한 고위험 경로"
        value={`${outcome.avoidedRoutes}개`}
        note="차단 후 대체 경로 확보"
      />
      <Stat
        label="대피 개선율"
        value={`${outcome.improvementPct}%`}
        note={`${formatSimDuration(outcome.baselineSec)} → ${formatSimDuration(
          outcome.safeflowSec,
        )} 단축`}
        valueClass="text-success"
      />
    </dl>
  );
}

function Stat({
  label,
  value,
  note,
  valueClass,
}: {
  label: string;
  value: string;
  note: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-background/40 px-3.5 py-3">
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd>
        <div
          className={cn("tnum mt-1 text-xl font-bold tracking-tight text-fg", valueClass)}
        >
          {value}
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">{note}</p>
      </dd>
    </div>
  );
}
