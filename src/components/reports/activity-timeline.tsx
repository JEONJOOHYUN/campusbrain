"use client";

import { useState } from "react";
import { ACTIVITY_ARCHIVE } from "@/data/activity";
import { SCENARIOS } from "@/data/scenarios";
import { ActivityRow } from "@/components/dashboard/activity-log-list";
import { CATEGORY_LABEL } from "@/components/dashboard/status";
import { IconReports } from "@/components/icons";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type {
  ActivityCategory,
  ActivityLogEntry,
  SimulationScenario,
} from "@/types";
import { cn } from "@/lib/utils";

type CategoryFilter = ActivityCategory | "all";
type ScenarioFilter = SimulationScenario | "all";

const CATEGORIES = Object.keys(CATEGORY_LABEL) as ActivityCategory[];
const SCENARIO_IDS = Object.keys(SCENARIOS) as SimulationScenario[];

/**
 * The whole record: the run in progress on top, the day's earlier work
 * underneath. Both come from the same log shape, so one set of filters
 * covers them.
 */
export function ActivityTimeline() {
  const { state } = useSimulation();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [scenario, setScenario] = useState<ScenarioFilter>("all");

  const matches = (entry: ActivityLogEntry) =>
    (category === "all" || entry.category === category) &&
    (scenario === "all" || entry.scenario === scenario);

  const live = state.log.filter(matches);
  const archive = ACTIVITY_ARCHIVE.filter(matches);
  const total = live.length + archive.length;

  const countIn = (entries: ActivityLogEntry[], predicate: (e: ActivityLogEntry) => boolean) =>
    entries.filter(predicate).length;

  // Counts describe what each chip would show, not what is on screen now,
  // so the two filter rows stay independent of each other.
  const all = [...state.log, ...ACTIVITY_ARCHIVE];
  const categoryCount = (value: CategoryFilter) =>
    countIn(all, (e) =>
      (value === "all" || e.category === value) &&
      (scenario === "all" || e.scenario === scenario),
    );
  const scenarioCount = (value: ScenarioFilter) =>
    countIn(all, (e) =>
      (category === "all" || e.category === category) &&
      (value === "all" || e.scenario === value),
    );

  return (
    <Card>
      <CardHeader className="flex-col items-stretch gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>AI 활동 로그</CardTitle>
            <p className="mt-0.5 text-xs text-muted">
              AI가 관측·예측·판단·실행한 기록 전체
            </p>
          </div>
          <span className="tnum shrink-0 text-xs font-semibold text-fg">
            {total}건
          </span>
        </div>

        <div className="space-y-2">
          <FilterRow label="분류">
            <Chip
              active={category === "all"}
              label="전체"
              count={categoryCount("all")}
              onClick={() => setCategory("all")}
            />
            {CATEGORIES.map((value) => (
              <Chip
                key={value}
                active={category === value}
                label={CATEGORY_LABEL[value]}
                count={categoryCount(value)}
                onClick={() => setCategory(value)}
              />
            ))}
          </FilterRow>

          <FilterRow label="시나리오">
            <Chip
              active={scenario === "all"}
              label="전체"
              count={scenarioCount("all")}
              onClick={() => setScenario("all")}
            />
            {SCENARIO_IDS.map((value) => (
              <Chip
                key={value}
                active={scenario === value}
                label={SCENARIOS[value].label}
                count={scenarioCount(value)}
                onClick={() => setScenario(value)}
              />
            ))}
          </FilterRow>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {total === 0 ? (
          <EmptyState
            icon={<IconReports width={18} height={18} />}
            title="조건에 맞는 기록이 없습니다"
            description="분류나 시나리오 필터를 바꿔 보세요. 시뮬레이션을 재생하면 새 기록이 위에 쌓입니다."
          />
        ) : (
          <div className="space-y-5">
            <Section
              title={`실행 중 시나리오 · ${state.definition.label}`}
              count={live.length}
              emptyText="이 조건에 맞는 실시간 기록이 아직 없습니다."
              entries={live}
            />
            <Section
              title="오늘 이전 기록"
              count={archive.length}
              emptyText="이 조건에 맞는 이전 기록이 없습니다."
              entries={archive}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  count,
  entries,
  emptyText,
}: {
  title: string;
  count: number;
  entries: ActivityLogEntry[];
  emptyText: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {title}
        </h4>
        <span className="tnum text-[10px] text-muted">{count}건</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted">{emptyText}</p>
      ) : (
        <ol>
          {entries.map((entry, index) => (
            <ActivityRow
              key={entry.id}
              entry={entry}
              isFirst={index === 0}
              isLast={index === entries.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-14 shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/50 bg-primary/12 text-primary"
          : "border-line text-muted hover:border-primary/40 hover:text-fg",
        count === 0 && !active && "opacity-50",
      )}
    >
      {label}
      <span className="tnum text-[10px] opacity-70">{count}</span>
    </button>
  );
}
