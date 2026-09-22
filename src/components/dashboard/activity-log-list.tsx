"use client";

import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import {
  CATEGORY_LABEL,
  STAGE_LABEL,
  severityTone,
} from "@/components/dashboard/status";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityLogEntry } from "@/types";
import { cn } from "@/lib/utils";

/** Overview shows the newest few; AI Reports will show the whole timeline. */
export function RecentActivityCard({
  limit = 5,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const { state } = useSimulation();
  const entries = state.log.slice(0, limit);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>최근 AI 활동</CardTitle>
        <Link
          href={`/dashboard/reports?scenario=${state.scenario}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-fg"
        >
          전체 보기
          <IconArrowRight width={13} height={13} />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {entries.length === 0 ? (
          <p className="text-sm text-muted">아직 기록된 AI 활동이 없습니다.</p>
        ) : (
          <ol className="space-y-0">
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
      </CardContent>
    </Card>
  );
}

function ActivityRow({
  entry,
  isFirst,
  isLast,
}: {
  entry: ActivityLogEntry;
  isFirst: boolean;
  isLast: boolean;
}) {
  const tone = severityTone(entry.severity);

  return (
    <li className={cn("flex gap-3", isFirst && "animate-rise")}>
      <div className="flex flex-col items-center pt-1.5">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", tone.dot)} />
        {!isLast && <span className="w-px flex-1 bg-line" />}
      </div>
      <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-4")}>
        <div className="flex items-baseline gap-2">
          <span className="tnum text-xs font-medium text-muted">{entry.time}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
            {CATEGORY_LABEL[entry.category]} · {STAGE_LABEL[entry.stage]}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-fg">{entry.title}</p>
        {(entry.location || entry.target) && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {[entry.location, entry.target].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </li>
  );
}
