"use client";

import { IconRobot } from "@/components/icons";
import { ROBOT_KIND_LABEL } from "@/components/dashboard/status";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

/**
 * Where the fleet is standing right now. Read off `building.robots`, the
 * same list the building detail panel uses, so a re-tasked robot moves here
 * the moment the scenario moves it.
 */
export function RobotDeployment() {
  const { state, selectBuilding } = useSimulation();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>건물별 배치</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            건물을 클릭하면 상세 정보가 열립니다
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {state.buildings.map((building) => {
            const retasked = building.robots.filter((r) => r.retasked).length;
            return (
              <button
                key={building.id}
                type="button"
                onClick={() => selectBuilding(building.id)}
                className={cn(
                  "rounded-lg border px-3 py-3 text-left transition-colors",
                  retasked > 0
                    ? "border-ai/40 bg-ai/8"
                    : "border-line hover:border-primary/40",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-fg">
                    {building.name}
                  </span>
                  <span className="tnum text-sm font-bold text-fg">
                    {building.robots.length}
                    <span className="ml-0.5 text-[10px] font-medium text-muted">대</span>
                  </span>
                </div>

                {building.robots.length === 0 ? (
                  <p className="mt-2 text-[11px] text-muted">배치된 로봇 없음</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {building.robots.map((robot) => (
                      <li
                        key={robot.id}
                        className="tnum flex items-baseline gap-1.5 text-[10px] text-muted"
                      >
                        <span className={cn(robot.retasked && "text-ai")}>
                          {robot.id}
                        </span>
                        <span className="truncate font-sans">
                          {ROBOT_KIND_LABEL[robot.kind]}
                        </span>
                        {robot.charging && <span className="ml-auto">충전</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>

        {state.buildings.every((b) => b.robots.length === 0) && (
          <EmptyState
            size="sm"
            className="mt-3"
            icon={<IconRobot width={16} height={16} />}
            title="배치된 로봇이 없습니다"
          />
        )}
      </CardContent>
    </Card>
  );
}
