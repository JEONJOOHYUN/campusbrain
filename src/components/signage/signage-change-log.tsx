"use client";

import { IconBrain, IconSignage } from "@/components/icons";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { SignageState } from "@/types";

interface Change {
  key: string;
  at: string;
  reason: string;
  displays: SignageState[];
}

/**
 * One AI decision can light up several screens with different wording, so
 * the history groups by reason rather than listing twelve near-identical
 * rows. Built from the live signage state — no separate record to drift.
 */
function groupByReason(signage: SignageState[]): Change[] {
  const groups = new Map<string, Change>();

  for (const display of signage) {
    if (!display.overridden || !display.changeReason || !display.changedAt) continue;
    const key = `${display.changedAt}·${display.changeReason}`;
    const existing = groups.get(key);
    if (existing) {
      existing.displays.push(display);
      continue;
    }
    groups.set(key, {
      key,
      at: display.changedAt,
      reason: display.changeReason,
      displays: [display],
    });
  }

  // Newest first, matching every other timeline on the dashboard.
  return [...groups.values()].sort((a, b) => b.at.localeCompare(a.at));
}

export function SignageChangeLog() {
  const { state } = useSimulation();
  const changes = groupByReason(state.signage);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBrain width={16} height={16} className="text-ai" />
          AI 메시지 변경 이력
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {changes.length === 0 ? (
          <EmptyState
            size="sm"
            icon={<IconSignage width={16} height={16} />}
            title="AI가 변경한 메시지가 없습니다"
            description="모든 디스플레이가 기본 편성을 보여주고 있습니다. 시뮬레이션을 재생하면 AI가 상황에 맞춰 메시지를 교체합니다."
          />
        ) : (
          <ol className="space-y-3">
            {changes.map((change) => (
              <li
                key={change.key}
                className="animate-rise rounded-lg border border-ai/25 bg-ai/8 px-3.5 py-3"
              >
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-xs font-semibold text-ai">
                    {change.at}
                  </span>
                  <span className="tnum text-[10px] text-muted">
                    디스플레이 {change.displays.length}대
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-fg">{change.reason}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {change.displays.map((display) => (
                    <li
                      key={display.id}
                      className="tnum rounded border border-line bg-background/60 px-1.5 py-0.5 text-[10px] text-muted"
                    >
                      {display.id} · {display.message.headline}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
