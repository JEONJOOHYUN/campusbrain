"use client";

import { deriveEnergy } from "@/lib/simulation/energy";
import {
  ENERGY_SYSTEM_LABEL,
  energySystemTone,
} from "@/components/dashboard/status";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCount } from "@/lib/utils";

export function EnergySystems({ className }: { className?: string }) {
  const { state } = useSimulation();
  const energy = deriveEnergy(state);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div>
          <CardTitle>시스템별 전력</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            캠퍼스 전체 부하를 설비 계통으로 나눈 값입니다
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* One bar for the whole campus, so the split is legible before any
            number is read. */}
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/8"
          role="img"
          aria-label="시스템별 전력 구성"
        >
          {energy.systems.map((system) => (
            <span
              key={system.system}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${system.share}%`,
                backgroundColor: energySystemTone(system.system).css,
              }}
            />
          ))}
        </div>

        <ul className="space-y-3">
          {energy.systems.map((system) => {
            const tone = energySystemTone(system.system);
            return (
              <li key={system.system} className="flex items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: tone.css }}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-fg">
                  {ENERGY_SYSTEM_LABEL[system.system]}
                </span>
                <span className="tnum text-xs text-muted">
                  {Math.round(system.share)}%
                </span>
                <span className="tnum w-20 text-right text-sm font-semibold text-fg">
                  {formatCount(system.drawKw)}
                  <span className="ml-0.5 text-[10px] font-medium text-muted">kW</span>
                </span>
              </li>
            );
          })}
        </ul>

        <p className="text-[11px] leading-relaxed text-muted">
          계통 비중은 캠퍼스 공통값을 사용합니다. 프로토타입이라 건물마다 따로
          계측하지 않습니다.
        </p>
      </CardContent>
    </Card>
  );
}
