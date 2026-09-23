"use client";

import { IconBrain } from "@/components/icons";
import {
  ROBOT_KIND_BADGE,
  ROBOT_KIND_LABEL,
  batteryTone,
} from "@/components/dashboard/status";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { RobotState } from "@/types";
import { cn } from "@/lib/utils";

export function RobotCard({ robot }: { robot: RobotState }) {
  const battery = batteryTone(robot.battery);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4 transition-colors",
        robot.retasked && "animate-rise border-ai/40",
        robot.charging && "opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                robot.charging ? "bg-muted" : "bg-success animate-pulse-soft",
              )}
            />
            <span className="truncate text-sm font-semibold text-fg">{robot.name}</span>
          </div>
          <span className="tnum mt-0.5 block text-[10px] tracking-wider text-muted">
            {robot.id}
          </span>
        </div>
        <Badge tone={ROBOT_KIND_BADGE[robot.kind]}>{ROBOT_KIND_LABEL[robot.kind]}</Badge>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            배터리
          </span>
          <span className={cn("tnum text-sm font-semibold", battery.text)}>
            {robot.battery}%
          </span>
        </div>
        <Progress
          value={robot.battery}
          indicatorColor={battery.css}
          className="mt-1.5"
          label={`${robot.name} 배터리`}
        />
      </div>

      <dl className="space-y-1.5 text-[11px]">
        <Row label="위치" value={robot.location} />
        <Row label="상태" value={robot.status} />
        <Row label="작업" value={robot.task} />
      </dl>

      {robot.retasked && (
        <div className="flex items-center gap-1.5 rounded-lg border border-ai/25 bg-ai/8 px-3 py-2">
          <IconBrain width={12} height={12} className="shrink-0 text-ai" />
          <span className="text-[11px] font-medium text-ai">
            AI가 작업을 재배치했습니다
          </span>
        </div>
      )}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-8 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-fg">{value}</dd>
    </div>
  );
}
