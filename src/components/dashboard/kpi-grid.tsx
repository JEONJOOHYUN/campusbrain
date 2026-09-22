"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { statusTone } from "@/components/dashboard/status";
import { Card } from "@/components/ui/card";
import { cn, formatCount } from "@/lib/utils";

export function KpiGrid() {
  const { state } = useSimulation();
  const { campus } = state;
  const tone = statusTone(campus.status);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <Card className={cn("px-4 py-3.5", tone.border)}>
        <KpiLabel>캠퍼스 상태</KpiLabel>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full animate-pulse-soft", tone.dot)} />
          <span className={cn("tnum text-xl font-bold tracking-tight", tone.text)}>
            {campus.status}
          </span>
        </div>
      </Card>

      <KpiNumber label="현재 인원" value={campus.population} />
      <KpiNumber label="오늘 AI 대응" value={campus.aiActionsToday} />
      <KpiNumber label="가동 로봇" value={campus.activeRobots} />
      <KpiNumber
        label="혼잡 구역"
        value={campus.crowdedAreas}
        valueClass={campus.crowdedAreas >= 4 ? "text-warning" : undefined}
      />
      <KpiNumber label="에너지 절감" value={campus.energySaving} suffix="%" decimals={1} />
    </div>
  );
}

function KpiLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </div>
  );
}

function KpiNumber({
  label,
  value,
  suffix,
  decimals = 0,
  valueClass,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  valueClass?: string;
}) {
  const display = useCountUp(value);
  const text =
    decimals > 0 ? display.toFixed(decimals) : formatCount(display);

  return (
    <Card className="px-4 py-3.5">
      <KpiLabel>{label}</KpiLabel>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className={cn(
            "tnum text-2xl font-bold tracking-tight text-fg",
            valueClass,
          )}
        >
          {text}
        </span>
        {suffix && <span className="text-sm font-medium text-muted">{suffix}</span>}
      </div>
    </Card>
  );
}
