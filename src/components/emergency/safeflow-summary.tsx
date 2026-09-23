"use client";

import { useSimulation } from "@/components/simulation/simulation-provider";
import { deriveSafeFlow } from "@/lib/simulation/safeflow";
import { SafeFlowOutcomeStats } from "@/components/emergency/safeflow-outcome";
import { IconCheck, IconReports } from "@/components/icons";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * The closing summary, available once the sixth phase is done. The numbers
 * are modelled, not measured, so the card wears a SimulatedTag the same way
 * every forecast on the dashboard does.
 */
export function SafeFlowSummary() {
  const { state } = useSimulation();
  const safeflow = deriveSafeFlow(state);
  const done = safeflow?.activated ?? false;

  return (
    <Card className={done ? "animate-rise" : undefined}>
      <CardHeader>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="primary">종료 요약</Badge>
            <SimulatedTag />
          </div>
          <CardTitle className="text-[15px] leading-snug">SafeFlow 대응 결과</CardTitle>
        </div>
        {done && (
          <Badge tone="success" mono>
            <IconCheck width={11} height={11} strokeWidth={2.4} />
            COMPLETE
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {safeflow && done ? (
          <>
            <SafeFlowOutcomeStats outcome={safeflow.outcome} />
            <p className="text-[11px] leading-relaxed text-muted">
              대피 개선율은 동일 건물의 대피 훈련 기준 시간과 SafeFlow 경로 배분을
              비교해 산출한 모델링 값입니다.
            </p>
          </>
        ) : (
          <EmptyState
            icon={<IconReports width={18} height={18} />}
            title="대응이 활성화되면 결과가 요약됩니다"
            description="6단계를 모두 마치면 유도 인원·회피한 고위험 경로·대피 개선율이 여기에 표시됩니다."
          />
        )}
      </CardContent>
    </Card>
  );
}
