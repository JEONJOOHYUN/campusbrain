"use client";

import { useMemo } from "react";
import { CROWD_THRESHOLDS } from "@/data/campus";
import { SCENARIOS } from "@/data/scenarios";
import { deriveState } from "@/lib/simulation/engine";
import { LandingSection, revealStep } from "@/components/landing/section";
import { SimulatedTag } from "@/components/ui/badge";

const CROWD = SCENARIOS.crowd;
/* Non-null on the crowd scenario; the section exists because of it. */
const INSIGHT = CROWD.insight!;

const VIEW_W = 680;
const VIEW_H = 220;
const PAD = 28;
/** The chart's vertical window — crowd never leaves it. */
const MIN = 40;
const MAX = 100;

const x = (t: number) => PAD + (t / CROWD.durationSec) * (VIEW_W - PAD * 2);
const y = (v: number) =>
  VIEW_H - PAD - ((v - MIN) / (MAX - MIN)) * (VIEW_H - PAD * 2);

/**
 * The forecast, drawn from the engine rather than from a hand-made path:
 * the solid segment is what the sensors had actually seen by the moment the
 * insight fires, and the dashed one is the claim the AI makes about the rest
 * of the hour. What really happened is the next two sections.
 */
export function PredictionSection() {
  const { observed, atInsight } = useMemo(() => {
    const points: Array<[number, number]> = [];
    for (let t = 0; t <= INSIGHT.appearsAt; t += 1) {
      const b = deriveState("crowd", t).buildings.find(
        (x) => x.id === INSIGHT.buildingId,
      )!;
      points.push([t, b.crowd]);
    }
    return { observed: points, atInsight: points[points.length - 1][1] };
  }, []);

  const observedPath = observed.map(([t, v]) => `${x(t)},${y(v)}`).join(" ");
  const clockAtInsight = deriveState("crowd", INSIGHT.appearsAt).clock;

  return (
    <LandingSection
      id="prediction"
      index={3}
      stage="예측"
      code="PREDICTION"
      tone="text-primary"
      title={
        <>
          지금 {atInsight}%.
          <br />
          {INSIGHT.horizonMin}분 뒤{" "}
          <span className="text-warning">{INSIGHT.prediction}%</span>.
        </>
      }
      lead={INSIGHT.summary}
    >
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="reveal rounded-xl border border-line bg-card/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-semibold tracking-tight text-fg">
              {INSIGHT.title}
            </span>
            <SimulatedTag />
          </div>

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="mt-4 w-full"
            role="img"
            aria-label={`공학관 혼잡도 예측 — 현재 ${atInsight}퍼센트, ${INSIGHT.horizonMin}분 뒤 ${INSIGHT.prediction}퍼센트 예상`}
          >
            {/* Threshold bands: the same cut-offs the dashboard colours by. */}
            <rect
              x={PAD}
              y={y(MAX)}
              width={VIEW_W - PAD * 2}
              height={y(CROWD_THRESHOLDS.critical) - y(MAX)}
              fill="var(--status-critical)"
              fillOpacity={0.07}
            />
            <rect
              x={PAD}
              y={y(CROWD_THRESHOLDS.critical)}
              width={VIEW_W - PAD * 2}
              height={y(CROWD_THRESHOLDS.caution) - y(CROWD_THRESHOLDS.critical)}
              fill="var(--status-caution)"
              fillOpacity={0.07}
            />

            {[CROWD_THRESHOLDS.caution, CROWD_THRESHOLDS.critical].map((v) => (
              <g key={v}>
                <line
                  x1={PAD}
                  y1={y(v)}
                  x2={VIEW_W - PAD}
                  y2={y(v)}
                  stroke="var(--color-line)"
                  strokeDasharray="4 6"
                />
                <text
                  x={PAD - 6}
                  y={y(v) + 4}
                  textAnchor="end"
                  className="tnum fill-[var(--color-muted)] text-[11px]"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Observed — what the sensors had already produced. */}
            <polyline
              points={observedPath}
              fill="none"
              stroke="var(--color-cyan)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Forecast — the claim, marked as one. */}
            <line
              x1={x(INSIGHT.appearsAt)}
              y1={y(atInsight)}
              x2={x(CROWD.durationSec)}
              y2={y(INSIGHT.prediction)}
              stroke="var(--color-warning)"
              strokeWidth={2.5}
              strokeDasharray="7 6"
              strokeLinecap="round"
            />

            <circle
              cx={x(INSIGHT.appearsAt)}
              cy={y(atInsight)}
              r={4.5}
              fill="var(--color-cyan)"
            />
            <circle
              cx={x(CROWD.durationSec)}
              cy={y(INSIGHT.prediction)}
              r={5}
              fill="var(--color-warning)"
              className="animate-pulse-soft"
            />

            <text
              x={x(INSIGHT.appearsAt)}
              y={VIEW_H - 8}
              textAnchor="middle"
              className="tnum fill-[var(--color-muted)] text-[11px]"
            >
              {clockAtInsight}
            </text>
            <text
              x={VIEW_W - PAD}
              y={VIEW_H - 8}
              textAnchor="end"
              className="tnum fill-[var(--color-warning)] text-[11px]"
            >
              {INSIGHT.prediction}% 예상
            </text>
          </svg>
        </div>

        <dl className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          {[
            {
              k: "예측 시점",
              v: `${INSIGHT.horizonMin}분 후`,
              d: INSIGHT.steps[1].detail,
            },
            {
              k: "신뢰도",
              v: `${INSIGHT.confidence}%`,
              d: "수업 시간표와 과거 이동 패턴을 함께 사용합니다.",
            },
            {
              k: "근거",
              v: INSIGHT.steps[0].label,
              d: INSIGHT.steps[0].detail,
            },
          ].map((row, i) => (
            <div
              key={row.k}
              className="reveal border-l-2 border-line pl-4"
              style={revealStep(i)}
            >
              <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {row.k}
              </dt>
              <dd className="tnum mt-1.5 text-2xl font-bold tracking-tight text-fg">
                {row.v}
              </dd>
              <dd className="mt-1 text-xs leading-relaxed text-muted">{row.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </LandingSection>
  );
}
