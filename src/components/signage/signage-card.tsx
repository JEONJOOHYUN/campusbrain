"use client";

import { IconBrain } from "@/components/icons";
import { SIGNAGE_KIND_LABEL, signageTone } from "@/components/dashboard/status";
import { SignageScreen } from "@/components/signage/signage-screen";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SignageState } from "@/types";
import { cn } from "@/lib/utils";

export function SignageCard({ display }: { display: SignageState }) {
  const tone = signageTone(display.message.kind);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4 transition-colors",
        display.overridden && "animate-rise border-ai/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="tnum text-[10px] tracking-wider text-muted">
              {display.id}
            </span>
            <span className="truncate text-sm font-semibold text-fg">
              {display.name}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted">{display.location}</p>
        </div>
        <Badge tone={display.online ? "success" : "neutral"} mono>
          {display.online ? "ONLINE" : "OFFLINE"}
        </Badge>
      </div>

      <SignageScreen message={display.message} online={display.online} />

      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-[11px] font-medium", tone.text)}>
          {SIGNAGE_KIND_LABEL[display.message.kind]}
        </span>
        {display.overridden ? (
          <Badge tone="ai" className="shrink-0">
            <IconBrain width={11} height={11} />
            <span className="tnum">AI 변경 {display.changedAt}</span>
          </Badge>
        ) : (
          <span className="text-[11px] text-muted">기본 편성</span>
        )}
      </div>

      {/* The reason is the point of the page: an operator can see which AI
          decision put this message on this screen. */}
      {display.changeReason && (
        <p className="rounded-lg border border-ai/25 bg-ai/8 px-3 py-2 text-[11px] leading-relaxed text-muted">
          {display.changeReason}
        </p>
      )}

      {!display.online && (
        <p className="text-[11px] leading-relaxed text-muted">
          점검 중인 디스플레이입니다. 마지막 메시지를 유지하며, AI 변경은 복구 후
          반영됩니다.
        </p>
      )}
    </Card>
  );
}
