"use client";

import { CROWD_THRESHOLDS } from "@/data/campus";
import { CrowdTrend } from "@/components/crowd/crowd-trend";
import {
  BUILDING_STATUS_LABEL,
  CROWD_LEVEL_BADGE,
  CROWD_LEVEL_LABEL,
  crowdTone,
  statusTone,
} from "@/components/dashboard/status";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BuildingState } from "@/types";
import { cn, formatCount } from "@/lib/utils";

/** Where a crowd level begins — the same numbers the status badge uses. */
const TICKS = [
  CROWD_THRESHOLDS.moderate,
  CROWD_THRESHOLDS.caution,
  CROWD_THRESHOLDS.critical,
];

export function ZoneCard({
  building,
  selected,
  onSelect,
}: {
  building: BuildingState;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = crowdTone(building.crowdLevel);
  const status = statusTone(building.status);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors",
        selected ? "border-primary/60" : "hover:border-primary/40",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="w-full px-4 py-4 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", status.dot)} />
              <span className="truncate text-sm font-semibold text-fg">
                {building.name}
              </span>
            </div>
            <span className="tnum mt-0.5 block text-[10px] tracking-wider text-muted">
              {building.code}
            </span>
          </div>
          <Badge tone={CROWD_LEVEL_BADGE[building.crowdLevel]} mono>
            {CROWD_LEVEL_LABEL[building.crowdLevel]}
          </Badge>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5">
          <span className={cn("tnum text-3xl font-bold tracking-tight", tone.text)}>
            {building.crowd}%
          </span>
          <CrowdTrend value={building.crowdTrend} />
        </div>

        {/* Level boundaries sit on the track, so a bar is readable without
            cross-checking the legend. */}
        <div className="relative mt-3">
          <Progress
            value={building.crowd}
            indicatorColor={tone.css}
            label={`${building.name} 혼잡도`}
          />
          {TICKS.map((tick) => (
            <span
              key={tick}
              aria-hidden
              className="absolute top-0 h-1.5 w-px bg-background/70"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>

        <dl className="tnum mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <Row label="현재 인원" value={`${formatCount(building.population)}명`} />
          <Row label="수용 인원" value={`${formatCount(building.capacity)}명`} />
          <Row label="상태" value={BUILDING_STATUS_LABEL[building.status]} valueClass={status.text} />
          <Row label="센서" value={`${building.sensors}개`} />
        </dl>

        {building.prediction !== null && (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-warning/25 bg-warning/8 px-3 py-2">
            <span className="tnum text-xs font-semibold text-warning">
              {building.predictionHorizon}분 후 {building.prediction}% 예측
            </span>
            <SimulatedTag />
          </div>
        )}
      </button>
    </Card>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="font-sans text-muted">{label}</dt>
      <dd className={cn("font-semibold text-fg", valueClass)}>{value}</dd>
    </div>
  );
}
