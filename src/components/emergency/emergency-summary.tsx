"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCount } from "@/lib/utils";

/**
 * The four things an operator asks first in a fire: how far along is the
 * response, where is it, how many people are still inside, and where can
 * they go. Everything is read from the run — nothing here is typed in.
 */
export function EmergencySummary() {
  const { state } = useSimulation();
  const safeflow = deriveSafeFlow(state);

  const occupants = useCountUp(safeflow?.occupants ?? 0);
  const active = safeflow?.phases.find((phase) => phase.active) ?? null;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Card
        className={cn(
          "px-4 py-3.5",
          safeflow && (safeflow.activated ? "border-success/40" : "border-danger/40"),
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <Label>대응 상태</Label>
          {safeflow && (
            <Badge tone={safeflow.activated ? "success" : "danger"} mono>
              {safeflow.activated ? "ACTIVE" : "SAFEFLOW"}
            </Badge>
          )}
        </div>
        {safeflow ? (
          <>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span
                className={cn(
                  "tnum text-2xl font-bold tracking-tight",
                  safeflow.activated ? "text-success" : "text-danger",
                )}
              >
                {safeflow.completed}
              </span>
              <span className="tnum text-sm font-medium text-muted">
                / {safeflow.total} 단계
              </span>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">
              {safeflow.activated ? "대응 활성화 완료" : (active?.label ?? "대기 중")}
            </p>
          </>
        ) : (
          <Idle note="비상 시나리오를 실행하면 표시됩니다" />
        )}
      </Card>

      <Card className="px-4 py-3.5">
        <Label>화재 위치</Label>
        {safeflow?.reached.detect ? (
          <>
            <div className="mt-1.5 truncate text-2xl font-bold tracking-tight text-fg">
              {safeflow.fire.buildingName}
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">
              {safeflow.fire.floor} · {safeflow.fire.detail}
            </p>
          </>
        ) : (
          <Idle note={safeflow ? "감지 대기 중" : "감지된 화재 없음"} />
        )}
      </Card>

      <Card className="px-4 py-3.5">
        <Label>잔류 인원</Label>
        {safeflow ? (
          <>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span
                className={cn(
                  "tnum text-2xl font-bold tracking-tight",
                  safeflow.occupants > 0 ? "text-warning" : "text-success",
                )}
              >
                {formatCount(occupants)}
              </span>
              <span className="text-sm font-medium text-muted">명</span>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">
              {safeflow.fire.buildingName} 재실 인원
            </p>
          </>
        ) : (
          <Idle note="화재 건물 재실 인원" />
        )}
      </Card>

      <Card className="px-4 py-3.5">
        <Label>대피 경로</Label>
        {safeflow?.reached.route ? (
          <>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="tnum text-2xl font-bold tracking-tight text-success">
                {safeflow.safeRoutes.length}
              </span>
              <span className="text-sm font-medium text-muted">개 개방</span>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">
              차단 {safeflow.blockedRoutes.length}개 · 유도{" "}
              {safeflow.outcome.redirected}명
            </p>
          </>
        ) : (
          <Idle note={safeflow ? "AI가 안전 경로를 산출 중입니다" : "산출된 경로 없음"} />
        )}
      </Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </div>
  );
}

function Idle({ note }: { note: string }) {
  return (
    <>
      <div className="mt-1.5 text-2xl font-bold tracking-tight text-muted">—</div>
      <p className="mt-1 truncate text-[11px] text-muted">{note}</p>
    </>
  );
}
