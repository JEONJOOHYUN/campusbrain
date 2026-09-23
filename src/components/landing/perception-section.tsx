"use client";

import { useMemo } from "react";
import { CampusMapView } from "@/components/digital-twin/campus-map";
import { LandingSection, revealStep } from "@/components/landing/section";
import { statusTone } from "@/components/dashboard/status";
import { deriveState } from "@/lib/simulation/engine";
import { cn } from "@/lib/utils";

/**
 * The Digital Twin, frozen at the start of a quiet afternoon. It is the same
 * component the dashboard renders — the landing just hands it a snapshot
 * instead of live playback, so nothing here can drift from the real screen.
 */
export function PerceptionSection() {
  const state = useMemo(() => deriveState("normal", 0), []);

  return (
    <LandingSection
      id="perception"
      index={2}
      stage="관측"
      code="PERCEPTION"
      tone="text-cyan"
      band
      title={
        <>
          AI는 캠퍼스를
          <br />
          <span className="bg-gradient-to-r from-cyan to-primary bg-clip-text text-transparent">
            한 장의 공간으로
          </span>{" "}
          봅니다.
        </>
      }
      lead="건물마다 흩어진 카메라·재실 센서·온도계·공기질계의 값이 하나의 디지털 트윈으로 합쳐집니다. 관제실이 보는 것은 화면 여섯 개가 아니라 캠퍼스 하나입니다."
    >
      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="reveal overflow-hidden rounded-xl border border-line bg-card/60">
          <CampusMapView
            state={state}
            selectedBuildingId={null}
            onSelectBuilding={() => {}}
            isPlaying={false}
            interactive={false}
            className="aspect-[960/560]"
          />
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {state.buildings.map((b, i) => {
            const tone = statusTone(b.status);
            return (
              <li
                key={b.id}
                className="reveal flex items-center gap-3 rounded-lg border border-line bg-card/60 px-3.5 py-2.5"
                style={revealStep(i * 0.4)}
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-fg">{b.name}</div>
                  <div className="tnum text-[11px] text-muted">
                    {b.code} · 센서 {b.sensors}대
                  </div>
                </div>
                <div className="tnum shrink-0 text-right">
                  <div className={cn("text-base font-bold", tone.text)}>{b.crowd}%</div>
                  <div className="text-[11px] text-muted">
                    {b.temperature.toFixed(1)}°C · AQI {b.airQuality}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </LandingSection>
  );
}
