"use client";

import { buildScenarioReport, formatSimDuration } from "@/lib/simulation/report";
import { AI_ACTION_KIND_LABEL } from "@/components/dashboard/status";
import { IconPlay, IconReports } from "@/components/icons";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { Badge, SimulatedTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * The summary a finished run produces. Every number comes from
 * `buildScenarioReport`, so the report can never describe a run the
 * operator did not just watch. Kept in memory only — there is no saving.
 */
export function ScenarioReportCard() {
  const { state, isPlaying, runScenario } = useSimulation();
  const report = buildScenarioReport(state);

  const header = (
    <CardHeader>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone="primary">시나리오 실행 리포트</Badge>
          <SimulatedTag />
        </div>
        <CardTitle className="text-[15px] leading-snug">
          {state.definition.headline}
        </CardTitle>
      </div>
      {state.isComplete && (
        <Badge tone="success" mono>
          COMPLETE
        </Badge>
      )}
    </CardHeader>
  );

  if (!report) {
    return (
      <Card>
        {header}
        <CardContent className="pt-2">
          <EmptyState
            icon={<IconReports width={18} height={18} />}
            title="아직 타임라인이 없는 시나리오입니다"
            description="시나리오가 준비되면 실행 결과가 여기에 요약됩니다."
          />
        </CardContent>
      </Card>
    );
  }

  if (!state.isComplete) {
    const pct = Math.round(state.progress * 100);
    return (
      <Card>
        {header}
        <CardContent className="space-y-4 pt-2">
          <EmptyState
            icon={<IconReports width={18} height={18} />}
            title="시나리오를 끝까지 실행하면 리포트가 만들어집니다"
            description={
              isPlaying
                ? "재생이 끝나면 트리거·대응·결과가 여기에 요약됩니다."
                : "재생 버튼을 누르거나 아래에서 바로 실행하세요."
            }
          >
            <Button size="sm" onClick={() => runScenario(state.scenario)}>
              <IconPlay width={13} height={13} />
              {state.elapsed > 0 ? "처음부터 실행" : "시나리오 실행"}
            </Button>
          </EmptyState>

          <div className="flex items-center gap-3">
            <Progress value={pct} className="flex-1" label="시나리오 진행률" />
            <span className="tnum w-10 text-right text-xs font-semibold text-muted">
              {pct}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const breakdown = report.actionBreakdown
    .map((item) => `${AI_ACTION_KIND_LABEL[item.kind]} ${item.count}`)
    .join(" · ");

  return (
    <Card className="animate-rise">
      {header}
      <CardContent className="space-y-4">
        <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {report.focusBuildingName && report.start !== null && (
            <Stat
              label="트리거"
              value={
                report.predicted !== null
                  ? `${report.start}% → ${report.predicted}%`
                  : `${report.start}%`
              }
              note={
                report.confidence !== null
                  ? `${report.focusBuildingName} · 예측 신뢰도 ${report.confidence}%`
                  : report.focusBuildingName
              }
              valueClass="text-warning"
            />
          )}

          <Stat
            label="AI 대응"
            value={`${report.actionCount}건`}
            note={breakdown || "실행된 물리 제어 없음"}
          />

          {report.peak !== null && report.final !== null && (
            <Stat
              label="결과"
              value={`${report.peak}% → ${report.final}%`}
              note={
                report.final < report.peak
                  ? `피크 대비 ${report.peak - report.final}%p 완화`
                  : "피크 유지"
              }
              valueClass={report.final < report.peak ? "text-success" : undefined}
            />
          )}

          <Stat
            label="소요 시간"
            value={formatSimDuration(report.durationSimSec)}
            note={`시뮬레이션 시각 · 기록 ${report.logCount}건`}
          />
        </dl>

        <p className="text-[11px] leading-relaxed text-muted">
          이 리포트는 브라우저 세션 동안만 유지됩니다. 시나리오를 바꾸거나 리셋하면
          사라집니다.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  note,
  valueClass,
}: {
  label: string;
  value: string;
  note: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-background/40 px-3.5 py-3">
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd>
        <div className={cn("tnum mt-1 text-xl font-bold tracking-tight text-fg", valueClass)}>
          {value}
        </div>
        <p className="mt-1 text-[11px] leading-snug text-muted">{note}</p>
      </dd>
    </div>
  );
}
