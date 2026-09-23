"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SCENARIOS } from "@/data/scenarios";
import { deriveState } from "@/lib/simulation/engine";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { formatSimDuration } from "@/lib/simulation/report";
import { CampusMapView } from "@/components/digital-twin/campus-map";
import { LandingSection, revealStep } from "@/components/landing/section";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { IconArrowRight, IconCheck, IconEmergency } from "@/components/icons";

const EMERGENCY = SCENARIOS.emergency;
/** The moment the run is fully activated — every layer on, nothing pending. */
const AT = EMERGENCY.durationSec;

/**
 * SafeFlow, frozen at the end of the emergency run: the same map, the same
 * six phases, the same route arithmetic the dashboard shows. This is the
 * section the demo is built around, so none of it is re-typed for the
 * landing — the plan is read straight out of the scenario.
 */
export function SafeFlowSection() {
  const { state, safeflow } = useMemo(() => {
    const s = deriveState("emergency", AT);
    return { state: s, safeflow: deriveSafeFlow(s)! };
  }, []);

  const { outcome } = safeflow;

  return (
    <LandingSection
      id="safeflow"
      index={7}
      stage="비상"
      code="SAFEFLOW"
      tone="text-danger"
      title={
        <>
          불이 나면,
          <br />
          <span className="text-danger">공간이 먼저 대피시킵니다.</span>
        </>
      }
      lead={EMERGENCY.description}
    >
      {/* Six phases, in the order the run completes them. */}
      <ol className="mt-14 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {safeflow.phases.map((phase, i) => (
          <li
            key={phase.id}
            className="reveal rounded-lg border border-danger/30 bg-danger/6 px-4 py-3.5"
            style={revealStep(i * 0.4)}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-danger/50 bg-danger/15 text-danger">
                <IconCheck width={11} height={11} strokeWidth={2.4} />
              </span>
              <span className="tnum text-[11px] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-fg">
                {phase.label}
              </span>
            </div>
            <p className="mt-1.5 pl-7 text-xs leading-relaxed text-muted">
              {phase.detail}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="reveal overflow-hidden rounded-xl border border-danger/30 bg-card/60">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
            <IconEmergency width={15} height={15} className="text-danger" />
            <span className="text-sm font-semibold tracking-tight text-fg">
              {safeflow.fire.buildingName} {safeflow.fire.floor}
            </span>
            <span className="truncate text-xs text-muted">{safeflow.fire.detail}</span>
            <Badge tone="danger" mono className="ml-auto shrink-0">
              {state.clock}
            </Badge>
          </div>
          <CampusMapView
            state={state}
            selectedBuildingId={null}
            onSelectBuilding={() => {}}
            isPlaying={false}
            interactive={false}
            className="aspect-[960/560]"
          />
        </div>

        <div className="grid content-start gap-4">
          {/* Blocked routes and safe routes carry the same 124 people — the
              sum is the point, so both sides are shown. */}
          <div className="reveal rounded-xl border border-line bg-card/60 px-5 py-5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                인원 유도
              </span>
              <SimulatedTag />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="tnum text-5xl font-bold tracking-tight text-fg">
                {outcome.redirected}
              </span>
              <span className="text-lg font-medium text-muted">명</span>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              고위험 경로 {outcome.avoidedRoutes}개의 인원이 그대로 안전 경로{" "}
              {safeflow.safeRoutes.length}개로 재배분됩니다.
            </p>

            <ul className="mt-4 grid gap-1.5">
              {[...safeflow.blockedRoutes, ...safeflow.safeRoutes].map((route) => (
                <li key={route.id} className="flex items-center gap-2 text-[11px]">
                  <span
                    className="h-0 w-3.5 shrink-0 border-t-2"
                    style={{
                      borderColor:
                        route.kind === "safe"
                          ? "var(--status-normal)"
                          : "var(--status-critical)",
                      borderStyle: route.kind === "safe" ? "solid" : "dashed",
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted">
                    {route.label}
                  </span>
                  <span className="tnum shrink-0 text-fg">{route.people}명</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="reveal rounded-xl border border-success/30 bg-success/8 px-5 py-5"
            style={revealStep(1)}
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-success">
              대피 완료 시간
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="tnum text-2xl font-bold tracking-tight text-muted line-through">
                {formatSimDuration(outcome.baselineSec)}
              </span>
              <IconArrowRight width={16} height={16} className="text-muted" />
              <span className="tnum text-4xl font-bold tracking-tight text-success">
                {formatSimDuration(outcome.safeflowSec)}
              </span>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              같은 건물의 대피 훈련 기준 대비 {outcome.improvementPct}% 단축.
            </p>
          </div>

          <Link
            href="/dashboard/emergency?scenario=emergency"
            className={buttonClasses({
              size: "lg",
              variant: "secondary",
              className: "reveal w-full",
            })}
          >
            비상 시뮬레이션 실행
            <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </LandingSection>
  );
}
