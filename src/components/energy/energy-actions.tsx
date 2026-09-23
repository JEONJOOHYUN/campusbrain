"use client";

import { BUILDING_BY_ID } from "@/data/buildings";
import { ENERGY_ACTIONS } from "@/data/energy";
import { deriveEnergy } from "@/lib/simulation/energy";
import { IconBrain, IconCheck } from "@/components/icons";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * The day's auto-control record — what the sensors reported, what the AI
 * did about it, and what that saved. These are today's actual events, so
 * they do not move with the scenario selector.
 */
export function EnergyActions() {
  const { state } = useSimulation();
  const energy = deriveEnergy(state);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <IconBrain width={16} height={16} className="text-ai" />
            AI 자동 제어 기록
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            오늘 실행된 {energy.autoControlToday}회 중 최근 {ENERGY_ACTIONS.length}건
          </p>
        </div>
        <Badge tone="success" mono>
          {energy.sampleSavingKwh} kWh 절감
        </Badge>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {ENERGY_ACTIONS.map((action) => (
            <li
              key={action.id}
              className="rounded-lg border border-line bg-background/40 px-4 py-3.5"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-fg">
                  {action.zone}
                </span>
                <span className="tnum shrink-0 text-xs text-muted">{action.at}</span>
              </div>
              <p className="tnum mt-0.5 text-[10px] tracking-wider text-muted">
                {BUILDING_BY_ID[action.buildingId].code}
              </p>

              <dl className="mt-3 space-y-2 text-[11px]">
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                    감지
                  </dt>
                  <dd className="mt-0.5 text-muted">{action.detection}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
                    실행
                  </dt>
                  <dd className="mt-0.5 flex items-start gap-1.5 text-fg">
                    <IconCheck
                      width={12}
                      height={12}
                      strokeWidth={2.4}
                      className="mt-0.5 shrink-0 text-success"
                    />
                    <span>{action.action}</span>
                  </dd>
                </div>
              </dl>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2.5">
                <span className="text-[11px] text-muted">예상 절감</span>
                <span className="tnum text-sm font-semibold text-success">
                  {action.savingKwh} kWh
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
