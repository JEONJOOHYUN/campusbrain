"use client";

import { BATTERY_THRESHOLDS } from "@/data/robots";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RobotSummary() {
  const { state } = useSimulation();
  const { robots, campus } = state;

  const charging = robots.filter((r) => r.charging).length;
  const retasked = robots.filter((r) => r.retasked).length;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Tile label="전체 로봇" value={robots.length} note="캠퍼스 배치 대수" />
      <Tile
        label="가동 중"
        value={campus.activeRobots}
        valueClass="text-success"
        note="작업 수행 중"
      />
      <Tile
        label="충전 중"
        value={charging}
        note={`배터리 ${BATTERY_THRESHOLDS.low}% 미만 · 도크 복귀`}
      />
      <Tile
        label="AI 재배치"
        value={retasked}
        valueClass={retasked > 0 ? "text-ai" : undefined}
        note={retasked > 0 ? "시나리오 대응으로 작업 변경됨" : "변경된 작업 없음"}
      />
    </div>
  );
}

function Tile({
  label,
  value,
  valueClass,
  note,
}: {
  label: string;
  value: number;
  valueClass?: string;
  note: string;
}) {
  return (
    <Card className="px-4 py-3.5">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className={cn("tnum text-2xl font-bold tracking-tight text-fg", valueClass)}
        >
          {value}
        </span>
        <span className="text-sm font-medium text-muted">대</span>
      </div>
      <p className="mt-1 truncate text-[11px] text-muted">{note}</p>
    </Card>
  );
}
