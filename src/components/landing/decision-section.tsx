import { SCENARIOS } from "@/data/scenarios";
import { STAGE_LABEL } from "@/components/dashboard/status";
import { LandingSection, revealStep } from "@/components/landing/section";
import { IconBrain } from "@/components/icons";

const INSIGHT = SCENARIOS.crowd.insight!;

/** Each stage owns a colour, matching the pipeline strip further up. */
const STAGE_TONE = {
  observe: "text-cyan",
  predict: "text-primary",
  decide: "text-ai",
  act: "text-success",
} as const;

export function DecisionSection() {
  return (
    <LandingSection
      id="decision"
      index={4}
      stage="판단"
      code="DECISION"
      tone="text-ai"
      band
      title={
        <>
          예측만으로는
          <br />
          아무 일도 일어나지 않습니다.
        </>
      }
      lead="AI는 무엇을 할지까지 정합니다. 담당자에게 알림을 보내는 것이 아니라, 어떤 물리 시스템을 어떤 순서로 움직일지 결정합니다."
    >
      <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {INSIGHT.steps.map((step, i) => (
          <li
            key={step.stage}
            className="reveal bg-card px-5 py-6"
            style={revealStep(i * 0.6)}
          >
            <div className="flex items-baseline gap-2">
              <span className="tnum text-2xl font-extralight text-muted/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${STAGE_TONE[step.stage]}`}
              >
                {STAGE_LABEL[step.stage]}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-fg">
              {step.label}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <div
        className="reveal mt-8 flex items-start gap-3 rounded-xl border border-ai/30 bg-ai/8 px-5 py-4"
        style={revealStep(1)}
      >
        <IconBrain className="mt-0.5 shrink-0 text-ai" width={18} height={18} />
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ai">
            AI 권고
          </div>
          <p className="mt-1 text-lg font-semibold leading-snug tracking-tight text-fg sm:text-xl">
            {INSIGHT.recommendation}
          </p>
        </div>
      </div>
    </LandingSection>
  );
}
