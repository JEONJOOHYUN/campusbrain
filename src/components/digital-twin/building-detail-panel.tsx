"use client";

import { useEffect, useRef } from "react";
import { SCENARIOS, SCENARIO_ORDER } from "@/data/scenarios";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { AiInsightBody } from "@/components/dashboard/ai-insight-card";
import {
  BUILDING_STATUS_LABEL,
  CROWD_LEVEL_LABEL,
  crowdTone,
  statusTone,
} from "@/components/dashboard/status";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import {
  IconAir,
  IconBrain,
  IconCheck,
  IconClose,
  IconElevator,
  IconEnergy,
  IconRobot,
  IconSensor,
  IconSignage,
  IconTemperature,
} from "@/components/icons";
import type { AiActionKind } from "@/types";
import { cn, formatCount } from "@/lib/utils";

const ACTION_ICON: Record<AiActionKind, typeof IconSignage> = {
  signage: IconSignage,
  elevator: IconElevator,
  robot: IconRobot,
  door: IconCheck,
  hvac: IconTemperature,
  broadcast: IconAir,
};

export function BuildingDetailPanel() {
  const { state, selectedBuildingId, selectBuilding, runScenario } = useSimulation();
  const building = state.buildings.find((b) => b.id === selectedBuildingId) ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<Element | null>(null);

  const open = building !== null;

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectBuilding(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [open, selectBuilding]);

  if (!building) return null;

  /* Every runnable scenario that is *about* this building can be launched
     from here. Engineering Hall carries two (crowd and emergency); most
     buildings carry none, and then the footer is simply absent. */
  const runnable = SCENARIO_ORDER.map((id) => SCENARIOS[id]).filter(
    (def) => def.available && def.focusBuildingId === building.id,
  );

  const actions = state.actions.filter((a) => a.buildingId === building.id);
  const insight =
    state.insight?.buildingId === building.id ? state.insight : null;

  const tone = statusTone(building.status);
  const crowd = crowdTone(building.crowdLevel);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/70 backdrop-blur-[2px]"
        onClick={() => selectBuilding(null)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${building.name} 상세 정보`}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-full max-w-[26rem] flex-col",
          "border-l border-line bg-surface shadow-2xl animate-slide-in",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold tracking-tight">
                {building.name}
              </h2>
              <Badge mono>{building.code}</Badge>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5",
                  tone.border,
                  tone.bg,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
                <span className={cn("tnum text-[11px] font-semibold", tone.text)}>
                  {BUILDING_STATUS_LABEL[building.status]}
                </span>
              </span>
              <span className="tnum text-xs text-muted">
                {building.floors}층 · 센서 {building.sensors}대
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => selectBuilding(null)}
            aria-label="패널 닫기"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-fg"
          >
            <IconClose />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Occupancy */}
          <section>
            <SectionLabel>인원</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <BigStat
                label="현재 인원"
                value={formatCount(building.population)}
                unit="명"
              />
              <BigStat
                label={
                  building.predictionHorizon
                    ? `${building.predictionHorizon}분 후 예상`
                    : "예상 인원"
                }
                value={
                  building.prediction === null
                    ? "—"
                    : formatCount((building.capacity * building.prediction) / 100)
                }
                unit="명"
                simulated={building.prediction !== null}
                valueClass={building.prediction !== null ? crowd.text : undefined}
              />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted">혼잡도</span>
                <span className="flex items-baseline gap-2">
                  <span className={cn("tnum text-sm font-semibold", crowd.text)}>
                    {CROWD_LEVEL_LABEL[building.crowdLevel]}
                  </span>
                  <span className="tnum text-lg font-semibold text-fg">
                    {building.crowd}%
                  </span>
                </span>
              </div>
              <Progress
                value={building.crowd}
                indicatorColor={crowd.css}
                label={`${building.name} 혼잡도`}
              />
              {building.prediction !== null && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <SimulatedTag />
                  <span className="tnum">
                    {building.predictionHorizon}분 후 예측 → {building.prediction}%
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Environment */}
          <section>
            <SectionLabel>환경</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <SmallStat
                icon={<IconTemperature width={14} height={14} />}
                label="온도"
                value={`${building.temperature.toFixed(1)}°C`}
              />
              <SmallStat
                icon={<IconAir width={14} height={14} />}
                label="공기질"
                value={`${building.airQuality} AQI`}
              />
              <SmallStat
                icon={<IconEnergy width={14} height={14} />}
                label="에너지"
                value={`${building.energy}%`}
              />
            </div>
          </section>

          {/* Robots */}
          <section>
            <SectionLabel>
              로봇
              <span className="tnum ml-1.5 font-normal text-muted">
                {building.robots.length}
              </span>
            </SectionLabel>
            <ul className="space-y-2">
              {building.robots.map((robot) => (
                <li
                  key={robot.id}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 transition-colors",
                    robot.retasked
                      ? "border-cyan/40 bg-cyan/8"
                      : "border-line bg-card/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-fg">
                      {robot.name}
                    </span>
                    <span className="tnum shrink-0 text-xs text-muted">
                      {robot.battery}%
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span className={cn(robot.retasked && "text-cyan")}>
                      {robot.status}
                    </span>
                    <span className="text-line">·</span>
                    <span className="truncate">{robot.task}</span>
                  </div>
                </li>
              ))}
              {building.robots.length === 0 && (
                <li>
                  <EmptyState
                    size="sm"
                    icon={<IconRobot width={15} height={15} />}
                    title="이 건물에 배치된 로봇이 없습니다"
                    description="인근 건물의 로봇이 필요 시 재배치됩니다."
                  />
                </li>
              )}
            </ul>
          </section>

          {/* Sensors */}
          <section>
            <SectionLabel>연결 센서</SectionLabel>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-card/60 px-3 py-2.5">
              <IconSensor width={16} height={16} className="text-cyan" />
              <span className="tnum text-sm font-medium text-fg">
                {building.sensors}
              </span>
              <span className="text-xs text-muted">
                영상 · 재실 · 공기질 · 전력
              </span>
              <Badge tone="cyan" className="ml-auto" mono>
                ONLINE
              </Badge>
            </div>
          </section>

          {/* AI judgement */}
          <section>
            <SectionLabel>AI 판단</SectionLabel>
            {insight ? (
              <AiInsightBody insight={insight} />
            ) : (
              <EmptyState
                size="sm"
                icon={<IconBrain width={15} height={15} />}
                title="현재 이 건물에 대한 예측 경보가 없습니다"
                description={
                  runnable.length > 0
                    ? "아래에서 이 건물의 시나리오를 실행해 보세요."
                    : undefined
                }
              />
            )}
          </section>

          {/* AI actions */}
          {actions.length > 0 && (
            <section>
              <SectionLabel>
                AI 대응
                <span className="tnum ml-1.5 font-normal text-muted">
                  {actions.length}
                </span>
              </SectionLabel>
              <ul className="space-y-2">
                {actions.map((action) => {
                  const Icon = ACTION_ICON[action.kind];
                  return (
                    <li
                      key={action.id}
                      className="animate-rise flex items-start gap-3 rounded-lg border border-success/30 bg-success/8 px-3 py-2.5"
                    >
                      <IconCheck
                        width={15}
                        height={15}
                        strokeWidth={2.4}
                        className="mt-0.5 shrink-0 text-success"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium text-fg">
                            {action.label}
                          </span>
                          <span className="tnum shrink-0 text-xs text-muted">
                            {action.at}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          <Icon width={12} height={12} />
                          <span className="truncate">{action.detail}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        {runnable.length > 0 && (
          <footer className="space-y-2 border-t border-line px-5 py-4">
            {runnable.map((def) => (
              <Button
                key={def.id}
                className="w-full"
                size="lg"
                variant={def.id === "emergency" ? "secondary" : "primary"}
                onClick={() => runScenario(def.id)}
              >
                {def.label} 시뮬레이션 실행
              </Button>
            ))}
            <p className="pt-1 text-center text-[11px] leading-relaxed text-muted">
              시뮬레이션 데이터로 상황과 AI 대응을 재생합니다.
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </h3>
  );
}

function BigStat({
  label,
  value,
  unit,
  simulated,
  valueClass,
}: {
  label: string;
  value: string;
  unit: string;
  simulated?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-card/60 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
        {simulated && <SimulatedTag />}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={cn("tnum text-2xl font-semibold text-fg", valueClass)}>
          {value}
        </span>
        <span className="text-[11px] text-muted">{unit}</span>
      </div>
    </div>
  );
}

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-card/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="tnum mt-1 text-sm font-semibold text-fg">{value}</div>
    </div>
  );
}
