"use client";

import { deriveEnergy } from "@/lib/simulation/energy";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCount } from "@/lib/utils";

export function EnergyBuildings({ className }: { className?: string }) {
  const { state, selectedBuildingId, selectBuilding } = useSimulation();
  const energy = deriveEnergy(state);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div>
          <CardTitle>건물별 전력</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            정격 전력 × 현재 부하율로 계산합니다
          </p>
        </div>
        <span className="tnum text-xs font-semibold text-fg">
          {formatCount(energy.totalKw)} kW
        </span>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <ul className="divide-y divide-line">
          {energy.buildings.map((building) => {
            const selected = selectedBuildingId === building.id;
            return (
              <li key={building.id}>
                <button
                  type="button"
                  onClick={() => selectBuilding(building.id)}
                  aria-pressed={selected}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-3 text-left transition-colors",
                    selected ? "bg-primary/10" : "hover:bg-white/5",
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                      {building.name}
                    </span>
                    <span className="tnum text-[10px] tracking-wider text-muted">
                      {building.code}
                    </span>
                    <span className="tnum shrink-0 text-sm font-semibold text-fg">
                      {formatCount(building.drawKw)}
                      <span className="ml-0.5 text-[10px] font-medium text-muted">
                        kW
                      </span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <Progress
                      value={building.share}
                      className="flex-1"
                      label={`${building.name} 전력 비중`}
                    />
                    <span className="tnum w-10 text-right text-xs font-semibold text-muted">
                      {Math.round(building.share)}%
                    </span>
                  </div>

                  <div className="tnum mt-1.5 flex gap-4 text-[11px] text-muted">
                    <span>부하율 {building.load}%</span>
                    <span>정격 {formatCount(building.ratedKw)} kW</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
