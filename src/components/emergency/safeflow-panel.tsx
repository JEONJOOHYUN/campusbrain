"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { IconCheck, IconEmergency, IconPlay } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const EMERGENCY_SCENARIO = "emergency" as const;

/**
 * The six-step run itself. The button rewinds and plays the emergency
 * scenario from wherever the operator is, so this page is the entry point
 * to the demo rather than another read-only view.
 */
export function SafeFlowPanel() {
  const { state, isPlaying, runScenario } = useSimulation();
  const safeflow = deriveSafeFlow(state);

  const label = !safeflow
    ? "비상 시뮬레이션 실행"
    : isPlaying
      ? "진행 중"
      : state.elapsed > 0
        ? "처음부터 실행"
        : "비상 시뮬레이션 실행";

  const runButton = (
    <Button
      size="sm"
      variant={safeflow?.activated ? "secondary" : "danger"}
      disabled={isPlaying}
      onClick={() => runScenario(EMERGENCY_SCENARIO)}
    >
      <IconPlay width={13} height={13} />
      {label}
    </Button>
  );

  return (
    <Card className={cn(safeflow && !safeflow.activated && "border-danger/30")}>
      <CardHeader>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="danger">
              <IconEmergency width={12} height={12} />
              SafeFlow
            </Badge>
            {safeflow?.activated && (
              <Badge tone="success" mono>
                ACTIVATED
              </Badge>
            )}
          </div>
          <CardTitle className="text-[15px] leading-snug">
            화재 대응 6단계
          </CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            감지부터 물리 시스템 연동까지, AI가 순서대로 실행합니다.
          </p>
        </div>
        {runButton}
      </CardHeader>

      <CardContent className="space-y-4">
        {!safeflow ? (
          <EmptyState
            icon={<IconEmergency width={18} height={18} />}
            title="지금은 비상 시나리오가 아닙니다"
            description="비상 시뮬레이션을 실행하면 화재 감지부터 대응 활성화까지 6단계가 순서대로 진행됩니다."
          >
            {runButton}
          </EmptyState>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Progress
                value={(safeflow.completed / safeflow.total) * 100}
                className="flex-1"
                indicatorColor={
                  safeflow.activated ? "var(--status-normal)" : "var(--status-critical)"
                }
                label="SafeFlow 진행률"
              />
              <span className="tnum w-14 text-right text-xs font-semibold text-muted">
                {safeflow.completed} / {safeflow.total}
              </span>
            </div>

            <ol className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {safeflow.phases.map((phase) => (
                <li
                  key={phase.id}
                  className={cn(
                    "flex gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                    phase.done
                      ? "border-line bg-background/40"
                      : phase.active
                        ? "border-danger/40 bg-danger/8"
                        : "border-line/60 bg-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                      phase.done
                        ? "border-success/50 bg-success/15 text-success"
                        : phase.active
                          ? "border-danger/50 bg-danger/15 text-danger"
                          : "border-line text-muted/60",
                    )}
                  >
                    {phase.done ? (
                      <IconCheck width={12} height={12} strokeWidth={2.4} />
                    ) : (
                      <span className="tnum">{phase.step}</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-sm font-medium",
                          phase.done || phase.active ? "text-fg" : "text-muted/60",
                        )}
                      >
                        {phase.label}
                      </span>
                      <span className="tnum shrink-0 text-[11px] text-muted">
                        {phase.at ?? (phase.active ? "진행 중" : "대기")}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 text-xs leading-snug",
                        phase.done || phase.active ? "text-muted" : "text-muted/50",
                      )}
                    >
                      {phase.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </CardContent>
    </Card>
  );
}
