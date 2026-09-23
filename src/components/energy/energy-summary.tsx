"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { deriveEnergy, systemDraw } from "@/lib/simulation/energy";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { ENERGY_SYSTEM_LABEL } from "@/components/dashboard/status";
import { SimulatedTag } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatCount } from "@/lib/utils";

export function EnergySummary() {
  const { state } = useSimulation();
  const energy = deriveEnergy(state);

  const total = useCountUp(energy.totalKw);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <Card className="px-4 py-3.5">
        <Label>현재 전력</Label>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="tnum text-2xl font-bold tracking-tight text-fg">
            {formatCount(total)}
          </span>
          <span className="text-sm font-medium text-muted">kW</span>
        </div>
        <p className="tnum mt-1 text-[11px] text-muted">
          정격 {formatCount(energy.ratedKw)} kW의 {energy.loadPct}%
        </p>
      </Card>

      <SystemTile
        label={ENERGY_SYSTEM_LABEL.hvac}
        kw={systemDraw(energy, "hvac")}
        total={energy.totalKw}
      />
      <SystemTile
        label={ENERGY_SYSTEM_LABEL.lighting}
        kw={systemDraw(energy, "lighting")}
        total={energy.totalKw}
      />

      <Card className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <Label>에너지 절감</Label>
          <SimulatedTag />
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="tnum text-2xl font-bold tracking-tight text-success">
            {energy.savingPct.toFixed(1)}
          </span>
          <span className="text-sm font-medium text-muted">%</span>
        </div>
        <p className="mt-1 text-[11px] text-muted">미최적화 기준 대비</p>
      </Card>

      <Card className="px-4 py-3.5">
        <Label>오늘 자동 제어</Label>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="tnum text-2xl font-bold tracking-tight text-fg">
            {energy.autoControlToday}
          </span>
          <span className="text-sm font-medium text-muted">회</span>
        </div>
        <p className="mt-1 text-[11px] text-muted">AI가 직접 실행한 제어</p>
      </Card>
    </div>
  );
}

function SystemTile({
  label,
  kw,
  total,
}: {
  label: string;
  kw: number;
  total: number;
}) {
  const share = total > 0 ? Math.round((kw / total) * 100) : 0;
  return (
    <Card className="px-4 py-3.5">
      <Label>{label}</Label>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="tnum text-2xl font-bold tracking-tight text-fg">
          {formatCount(kw)}
        </span>
        <span className="text-sm font-medium text-muted">kW</span>
      </div>
      <p className="tnum mt-1 text-[11px] text-muted">전체의 {share}%</p>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "text-[10px] font-medium uppercase tracking-[0.14em] text-muted",
      )}
    >
      {children}
    </div>
  );
}
