"use client";

import { useState } from "react";
import { IconRobot } from "@/components/icons";
import { ROBOT_KIND_LABEL } from "@/components/dashboard/status";
import { RobotCard } from "@/components/robots/robot-card";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { RobotKind } from "@/types";
import { cn } from "@/lib/utils";

type Filter = RobotKind | "all";

const KINDS = Object.keys(ROBOT_KIND_LABEL) as RobotKind[];

export function RobotFleet() {
  const { state } = useSimulation();
  const [filter, setFilter] = useState<Filter>("all");

  const robots =
    filter === "all" ? state.robots : state.robots.filter((r) => r.kind === filter);

  const countOf = (kind: Filter) =>
    kind === "all"
      ? state.robots.length
      : state.robots.filter((r) => r.kind === kind).length;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>로봇 현황</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            원격 조종은 제공하지 않습니다 — AI가 상황에 맞춰 작업을 재배치합니다
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip
            active={filter === "all"}
            count={countOf("all")}
            label="전체"
            onClick={() => setFilter("all")}
          />
          {KINDS.map((kind) => (
            <FilterChip
              key={kind}
              active={filter === kind}
              count={countOf(kind)}
              label={ROBOT_KIND_LABEL[kind]}
              onClick={() => setFilter(kind)}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {robots.length === 0 ? (
          <EmptyState
            icon={<IconRobot width={18} height={18} />}
            title="해당 종류의 로봇이 없습니다"
            description="다른 종류를 선택하거나 전체 보기로 돌아가세요."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {robots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FilterChip({
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
      )}
    >
      {label}
      <span className="tnum text-[10px] opacity-70">{count}</span>
    </button>
  );
}
