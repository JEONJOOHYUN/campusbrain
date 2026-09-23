"use client";

import { CROWD_THRESHOLDS, CROWD_TREND_LOOKBACK_MIN } from "@/data/campus";
import { ZoneCard } from "@/components/crowd/zone-card";
import { CROWD_LEVEL_LABEL, crowdTone } from "@/components/dashboard/status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulation } from "@/components/simulation/simulation-provider";
import type { CrowdLevel } from "@/types";

/** Bands read off the thresholds, so the legend can never drift from them. */
const BANDS: { level: CrowdLevel; range: string }[] = [
  { level: "low", range: `0–${CROWD_THRESHOLDS.moderate - 1}%` },
  {
    level: "moderate",
    range: `${CROWD_THRESHOLDS.moderate}–${CROWD_THRESHOLDS.caution - 1}%`,
  },
  {
    level: "high",
    range: `${CROWD_THRESHOLDS.caution}–${CROWD_THRESHOLDS.critical - 1}%`,
  },
  { level: "critical", range: `${CROWD_THRESHOLDS.critical}% 이상` },
];

export function ZoneGrid() {
  const { state, selectedBuildingId, selectBuilding } = useSimulation();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>구역별 혼잡 상태</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            카드를 클릭하면 상세 정보와 AI 판단이 열립니다 · 추세는 최근 {CROWD_TREND_LOOKBACK_MIN}분 대비 증감
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {BANDS.map(({ level, range }) => (
            <span key={level} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: crowdTone(level).css }}
              />
              <span className="tnum text-[10px] font-medium tracking-wider text-muted">
                {CROWD_LEVEL_LABEL[level]} {range}
              </span>
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {state.buildings.map((building) => (
            <ZoneCard
              key={building.id}
              building={building}
              selected={selectedBuildingId === building.id}
              onSelect={() => selectBuilding(building.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
