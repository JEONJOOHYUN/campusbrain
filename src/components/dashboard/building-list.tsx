"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import {
  BUILDING_STATUS_LABEL,
  crowdTone,
  statusTone,
} from "@/components/dashboard/status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCount } from "@/lib/utils";

export function BuildingList({ className }: { className?: string }) {
  const { state, selectedBuildingId, selectBuilding } = useSimulation();

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>건물</CardTitle>
        <span className="text-xs text-muted">행을 클릭하면 상세 정보가 열립니다</span>
      </CardHeader>
      <CardContent className="flex-1 pt-2">
        <ul className="divide-y divide-line">
          {state.buildings.map((b) => {
            const tone = statusTone(b.status);
            const crowd = crowdTone(b.crowdLevel);
            const selected = selectedBuildingId === b.id;
            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => selectBuilding(b.id)}
                  aria-pressed={selected}
                  className={cn(
                    "w-full rounded-lg px-2.5 py-3 text-left transition-colors",
                    selected ? "bg-primary/10" : "hover:bg-white/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                      {b.name}
                    </span>
                    <span
                      className={cn(
                        "tnum shrink-0 text-[10px] font-semibold tracking-wider",
                        tone.text,
                      )}
                    >
                      {BUILDING_STATUS_LABEL[b.status]}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <Progress
                      value={b.crowd}
                      indicatorColor={crowd.css}
                      className="flex-1"
                      label={`${b.name} 혼잡도`}
                    />
                    <span className={cn("tnum w-10 text-right text-xs font-semibold", crowd.text)}>
                      {b.crowd}%
                    </span>
                  </div>

                  <div className="tnum mt-1.5 flex gap-4 text-[11px] text-muted">
                    <span>{formatCount(b.population)}명</span>
                    <span>에너지 {b.energy}%</span>
                    {b.prediction !== null && (
                      <span className="text-warning">→ {b.prediction}%</span>
                    )}
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
