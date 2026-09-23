"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SignageSummary() {
  const { state } = useSimulation();
  const displays = state.signage;

  const online = displays.filter((d) => d.online).length;
  const overridden = displays.filter((d) => d.overridden).length;
  const offline = displays.length - online;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Tile label="디스플레이" value={displays.length} unit="대" />
      <Tile label="온라인" value={online} unit="대" valueClass="text-success" />
      <Tile
        label="AI 변경 중"
        value={overridden}
        unit="대"
        valueClass={overridden > 0 ? "text-ai" : undefined}
        note={overridden > 0 ? "AI 판단에 따라 메시지 교체됨" : "전부 기본 편성"}
      />
      <Tile
        label="OFFLINE"
        value={offline}
        unit="대"
        valueClass={offline > 0 ? "text-warning" : undefined}
        note={offline > 0 ? "점검 중 · 마지막 메시지 유지" : "점검 중인 화면 없음"}
      />
    </div>
  );
}

function Tile({
  label,
  value,
  unit,
  valueClass,
  note,
}: {
  label: string;
  value: number;
  unit: string;
  valueClass?: string;
  note?: string;
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
        <span className="text-sm font-medium text-muted">{unit}</span>
      </div>
      {note && <p className="mt-1 truncate text-[11px] text-muted">{note}</p>}
    </Card>
  );
}
