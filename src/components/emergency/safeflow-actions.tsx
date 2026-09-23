"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { AI_ACTION_KIND_LABEL } from "@/components/dashboard/status";
import { IconCheck, IconEmergency } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

/**
 * The physical systems SafeFlow reaches for. All five are listed from the
 * start and tick over as the run fires them, so the operator can see what
 * is still coming — the count comes from the timeline, never from here.
 */
export function SafeFlowActions() {
  const { state } = useSimulation();
  const safeflow = deriveSafeFlow(state);

  const actions = safeflow?.actions ?? [];
  const fired = actions.filter((action) => action.fired).length;

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>AI Action</CardTitle>
          <p className="mt-0.5 text-xs text-muted">
            AI가 직접 작동시킨 물리 시스템입니다 — 담당자에게 알림을 보내는 것이
            아닙니다.
          </p>
        </div>
        {actions.length > 0 && (
          <Badge tone={fired === actions.length ? "success" : "danger"} mono>
            {fired} / {actions.length}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        {actions.length === 0 ? (
          <EmptyState
            icon={<IconEmergency width={18} height={18} />}
            title="실행된 비상 대응이 없습니다"
            description="비상 시뮬레이션을 실행하면 출입문·사이니지·로봇·방송이 순서대로 작동합니다."
          />
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {actions.map((action) => (
              <li
                key={action.id}
                className={cn(
                  "rounded-lg border px-3.5 py-3 transition-colors",
                  action.fired
                    ? "border-success/35 bg-success/8 animate-rise"
                    : "border-line/60",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        action.fired
                          ? "border-success/50 bg-success/15 text-success"
                          : "border-line text-muted/60",
                      )}
                    >
                      {action.fired ? (
                        <IconCheck width={11} height={11} strokeWidth={2.4} />
                      ) : (
                        <span className="h-1 w-1 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        action.fired ? "text-fg" : "text-muted/60",
                      )}
                    >
                      {action.label}
                    </span>
                  </div>
                  <span className="tnum shrink-0 text-[11px] text-muted">
                    {action.at ?? "대기"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Badge tone={action.fired ? "primary" : "neutral"}>
                    {AI_ACTION_KIND_LABEL[action.kind]}
                  </Badge>
                  <span
                    className={cn(
                      "truncate text-xs",
                      action.fired ? "text-muted" : "text-muted/50",
                    )}
                  >
                    {action.detail}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
