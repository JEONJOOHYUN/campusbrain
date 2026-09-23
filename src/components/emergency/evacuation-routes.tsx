"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { IconTwin } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SafeFlowRoute } from "@/types";
import { cn } from "@/lib/utils";

/**
 * The routes behind the lines on the map: which ones the AI opened, which
 * ones it took out of service, and how many people each decision moved.
 * They appear as the run computes them, not before.
 */
export function EvacuationRoutes() {
  const { state } = useSimulation();
  const safeflow = deriveSafeFlow(state);

  const safe = safeflow?.reached.route ? safeflow.safeRoutes : [];
  const blocked = safeflow?.reached.coordinate ? safeflow.blockedRoutes : [];
  const shown = [...safe, ...blocked];

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>대피 경로</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            지도 위의 선과 같은 경로입니다.
          </p>
        </div>
        {shown.length > 0 && (
          <Badge tone="neutral" mono>
            개방 {safe.length} · 차단 {blocked.length}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {shown.length === 0 ? (
          <EmptyState
            icon={<IconTwin width={18} height={18} />}
            title="산출된 대피 경로가 없습니다"
            description="AI가 위험 구역과 인원 위치를 분석한 뒤 안전 경로를 여기에 표시합니다."
          />
        ) : (
          <>
            <ul className="space-y-2">
              {shown.map((route) => (
                <RouteRow key={route.id} route={route} />
              ))}
            </ul>
            {safe.length > 0 && blocked.length > 0 && (
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                차단한 경로에 있던 인원이 그대로 안전 경로로 재배분됩니다 — 양쪽 합계는
                같은 사람들입니다.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RouteRow({ route }: { route: SafeFlowRoute }) {
  const safe = route.kind === "safe";
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 animate-rise",
        safe ? "border-success/30 bg-success/8" : "border-danger/25 bg-danger/8",
      )}
    >
      <span
        className="h-0 w-5 shrink-0 border-t-2"
        style={{
          borderColor: safe ? "var(--status-normal)" : "var(--status-critical)",
          borderStyle: safe ? "solid" : "dashed",
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-fg">{route.label}</div>
        <p className="truncate text-[11px] text-muted">{route.detail}</p>
      </div>
      <div className="shrink-0 text-right">
        <div
          className={cn(
            "tnum text-sm font-semibold",
            safe ? "text-success" : "text-danger",
          )}
        >
          {route.people}명
        </div>
        <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {safe ? "유도" : "회피"}
        </div>
      </div>
    </li>
  );
}
