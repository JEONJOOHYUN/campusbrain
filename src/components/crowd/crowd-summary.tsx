"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { CrowdTrend } from "@/components/crowd/crowd-trend";
import { CROWD_LEVEL_LABEL, crowdTone } from "@/components/dashboard/status";
import { Card } from "@/components/ui/card";
import { SimulatedTag } from "@/components/ui/badge";
import { cn, formatCount } from "@/lib/utils";

export function CrowdSummary() {
  const { state } = useSimulation();
  const { campus, buildings, insight } = state;

  const population = useCountUp(campus.population);

  // "Busiest" is read off the same building list every other screen uses,
  // so it can never point at a different hall than the map does.
  const busiest = buildings.reduce((worst, b) => (b.crowd > worst.crowd ? b : worst));
  const busiestTone = crowdTone(busiest.crowdLevel);

  // A resolved forecast is history, not something to act on.
  const forecast = insight && !insight.resolved ? insight : null;
  const forecastBuilding = forecast
    ? buildings.find((b) => b.id === forecast.buildingId)
    : null;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Card className="px-4 py-3.5">
        <Label>캠퍼스 인원</Label>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="tnum text-2xl font-bold tracking-tight text-fg">
            {formatCount(population)}
          </span>
          <span className="text-sm font-medium text-muted">명</span>
        </div>
        <p className="mt-1 text-[11px] text-muted">건물 {buildings.length}개소 합계</p>
      </Card>

      <Card className="px-4 py-3.5">
        <Label>혼잡 구역</Label>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span
            className={cn(
              "tnum text-2xl font-bold tracking-tight",
              campus.crowdedAreas >= 4 ? "text-warning" : "text-fg",
            )}
          >
            {campus.crowdedAreas}
          </span>
          <span className="tnum text-sm font-medium text-muted">
            / {buildings.length}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted">MODERATE 이상 구역</p>
      </Card>

      <Card className={cn("px-4 py-3.5", busiestTone.border)}>
        <Label>최고 혼잡</Label>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={cn("tnum text-2xl font-bold tracking-tight", busiestTone.text)}>
            {busiest.crowd}%
          </span>
          <CrowdTrend value={busiest.crowdTrend} />
        </div>
        <p className="mt-1 truncate text-[11px] text-muted">
          {busiest.name} · {CROWD_LEVEL_LABEL[busiest.crowdLevel]}
        </p>
      </Card>

      <Card className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-2">
          <Label>AI 예측</Label>
          {forecast && <SimulatedTag />}
        </div>
        {forecast && forecastBuilding ? (
          <>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="tnum text-2xl font-bold tracking-tight text-warning">
                {forecast.prediction}%
              </span>
              <span className="tnum text-sm font-medium text-muted">
                {forecast.horizonMin}분 내
              </span>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">
              {forecastBuilding.name} · 신뢰도 {forecast.confidence}%
            </p>
          </>
        ) : (
          <>
            <div className="mt-1.5 text-2xl font-bold tracking-tight text-muted">—</div>
            <p className="mt-1 text-[11px] text-muted">주의가 필요한 예측 없음</p>
          </>
        )}
      </Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </div>
  );
}
