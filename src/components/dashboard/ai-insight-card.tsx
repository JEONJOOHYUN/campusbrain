"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { IconBrain, IconCheck } from "@/components/icons";
import { STAGE_LABEL, severityTone } from "@/components/dashboard/status";
import { useSimulation } from "@/components/simulation/simulation-provider";
import type { AiInsight } from "@/types";
import { cn } from "@/lib/utils";

export function AiInsightCard({ className }: { className?: string }) {
  const { state } = useSimulation();
  return <AiInsightBody insight={state.insight} className={className} />;
}

export function AiInsightBody({
  insight,
  className,
  compact = false,
}: {
  insight: AiInsight | null;
  className?: string;
  compact?: boolean;
}) {
  if (!insight) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBrain width={16} height={16} className="text-ai" />
            AI 인사이트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            현재 주의가 필요한 예측이 없습니다. AI가 6개 건물을 계속 관측하고 있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tone = severityTone(insight.severity);

  return (
    <Card className={cn("animate-rise", className)}>
      <CardHeader>
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Badge tone="ai">
              <IconBrain width={12} height={12} />
              AI 인사이트
            </Badge>
            {insight.resolved ? (
              <Badge tone="success" mono>
                RESOLVED
              </Badge>
            ) : (
              <Badge tone={insight.severity === "critical" ? "danger" : "warning"} mono>
                {insight.severity.toUpperCase()}
              </Badge>
            )}
          </div>
          <CardTitle className="text-[15px] leading-snug">{insight.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="현재" value={`${insight.current}%`} />
          <Metric
            label={insight.resolved ? "최고치" : `${insight.horizonMin}분 후 예측`}
            value={`${insight.prediction}%`}
            valueClass={insight.resolved ? "text-muted" : tone.text}
            simulated
          />
          <Metric label="신뢰도" value={`${insight.confidence}%`} simulated />
        </div>

        <p className="text-sm leading-relaxed text-muted">{insight.summary}</p>

        {!compact && (
          <ol className="space-y-2.5">
            {insight.steps.map((step) => (
              <li key={step.stage} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    step.done
                      ? "border-ai/50 bg-ai/15 text-ai"
                      : "border-line text-muted/60",
                  )}
                >
                  {step.done ? (
                    <IconCheck width={11} height={11} strokeWidth={2.4} />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-current" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.14em]",
                        step.done ? "text-ai" : "text-muted/60",
                      )}
                    >
                      {STAGE_LABEL[step.stage]}
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        step.done ? "text-fg" : "text-muted/60",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs",
                      step.done ? "text-muted" : "text-muted/50",
                    )}
                  >
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {insight.resolved && insight.resolution ? (
          <div className="rounded-lg border border-success/25 bg-success/8 px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-success">
              <IconCheck width={12} height={12} strokeWidth={2.6} />
              해소됨
            </div>
            <p className="mt-1 text-sm text-fg">{insight.resolution}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-primary/25 bg-primary/8 px-3.5 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              권장 조치
            </div>
            <p className="mt-1 text-sm text-fg">{insight.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  valueClass,
  simulated = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  simulated?: boolean;
}) {
  return (
    <div>
      {/* Fixed height keeps the three values on one baseline even when a
          label wraps onto a second line. */}
      <div className="flex min-h-9 flex-wrap items-start gap-x-1.5 gap-y-1">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
        {simulated && <SimulatedTag />}
      </div>
      <div className={cn("tnum mt-1 text-2xl font-semibold text-fg", valueClass)}>
        {value}
      </div>
    </div>
  );
}
