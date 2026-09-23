"use client";

import { useMemo } from "react";
import { SCENARIOS } from "@/data/scenarios";
import { deriveState } from "@/lib/simulation/engine";
import { buildScenarioReport } from "@/lib/simulation/report";
import { AI_ACTION_KIND_LABEL } from "@/components/dashboard/status";
import { SignageScreen } from "@/components/signage/signage-screen";
import { LandingSection, revealStep } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight, IconCheck } from "@/components/icons";

const CROWD = SCENARIOS.crowd;

/**
 * The end of the crowd run, rendered with the dashboard's own signage
 * display. Everything here — which signs changed, what they now read, which
 * systems fired, where the crowd ended up — is read off the finished state.
 */
export function ActionSection() {
  const { actions, overridden, report } = useMemo(() => {
    const state = deriveState("crowd", CROWD.durationSec);
    return {
      actions: state.actions,
      overridden: state.signage.filter((s) => s.overridden),
      report: buildScenarioReport(state),
    };
  }, []);

  return (
    <LandingSection
      id="action"
      index={5}
      stage="실행"
      code="PHYSICAL ACTION"
      tone="text-success"
      title={
        <>
          그리고 실제로
          <br />
          <span className="text-success">공간이 움직입니다.</span>
        </>
      }
      lead="사이니지 문구가 바뀌고, 엘리베이터가 분산되고, 청소로봇이 경로를 비킵니다. 사람이 승인 버튼을 누르는 단계는 없습니다."
    >
      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* What a person standing in the corridor actually sees. */}
        <div className="grid gap-4 sm:grid-cols-2">
          {overridden.map((sign, i) => (
            <div key={sign.id} className="reveal" style={revealStep(i * 0.5)}>
              <SignageScreen message={sign.message} online={sign.online} />
              <div className="mt-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium text-fg">
                    {sign.name}
                  </div>
                  <div className="truncate text-[11px] text-muted">
                    {sign.location}
                  </div>
                </div>
                <Badge tone="primary" mono className="shrink-0">
                  {sign.changedAt}
                </Badge>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
                <span className="truncate line-through decoration-muted/50">
                  {sign.baseMessage.headline}
                </span>
                <IconArrowRight width={11} height={11} className="shrink-0" />
              </p>
            </div>
          ))}
        </div>

        <div>
          <ul className="grid gap-2.5">
            {actions.map((action, i) => (
              <li
                key={action.id}
                className="reveal rounded-lg border border-success/35 bg-success/8 px-4 py-3"
                style={revealStep(i * 0.5)}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-success/50 bg-success/15 text-success">
                    <IconCheck width={11} height={11} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                    {action.label}
                  </span>
                  <span className="tnum shrink-0 text-[11px] text-muted">
                    {action.at}
                  </span>
                </div>
                <p className="mt-1.5 pl-7 text-xs leading-relaxed text-muted">
                  {action.detail}
                </p>
                <div className="mt-2 pl-7">
                  <Badge tone="success">{AI_ACTION_KIND_LABEL[action.kind]}</Badge>
                </div>
              </li>
            ))}
          </ul>

          {/* The point of all of it. */}
          {report && report.peak !== null && report.final !== null && (
            <div
              className="reveal mt-4 rounded-xl border border-line bg-card/60 px-5 py-5"
              style={revealStep(1)}
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {report.focusBuildingName} 혼잡도
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="tnum text-4xl font-bold tracking-tight text-danger">
                  {report.peak}%
                </span>
                <IconArrowRight width={18} height={18} className="text-muted" />
                <span className="tnum text-4xl font-bold tracking-tight text-success">
                  {report.final}%
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-muted">
                {CROWD.insight!.resolution}
              </p>
            </div>
          )}
        </div>
      </div>
    </LandingSection>
  );
}
