import Link from "next/link";
import { SCENARIOS, SCENARIO_ORDER } from "@/data/scenarios";
import { LandingSection, revealStep } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

/* Colour per scenario, on the status scale the dashboard already uses. */
const TONE = {
  normal: { text: "text-success", border: "hover:border-success/50" },
  crowd: { text: "text-warning", border: "hover:border-warning/50" },
  event: { text: "text-cyan", border: "" },
  emergency: { text: "text-danger", border: "hover:border-danger/50" },
} as const;

export function UseCasesSection() {
  return (
    <LandingSection
      id="use-cases"
      index={6}
      stage="활용"
      code="USE CASES"
      tone="text-cyan"
      band
      title={
        <>
          하나의 상황이
          <br />
          화면 여덟 개를 동시에 움직입니다.
        </>
      }
      lead="시나리오를 바꾸면 KPI·디지털 트윈·사이니지·로봇·에너지·리포트가 같은 데이터에서 함께 바뀝니다. 숫자만 갈아 끼우는 것이 아닙니다."
    >
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {SCENARIO_ORDER.map((id, i) => {
          const scenario = SCENARIOS[id];
          const tone = TONE[id];
          const body = (
            <>
              <div className="flex items-center gap-2.5">
                <span
                  className={cn("text-lg font-bold tracking-tight", tone.text)}
                >
                  {scenario.label}
                </span>
                {scenario.available ? (
                  <Badge tone="neutral" mono>
                    {scenario.durationSec}s
                  </Badge>
                ) : (
                  <Badge tone="neutral">준비 중</Badge>
                )}
                {scenario.available && (
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="ml-auto shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                )}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                {scenario.headline}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {scenario.description}
              </p>
            </>
          );

          const shell =
            "reveal block rounded-xl border border-line bg-card/60 px-5 py-6 transition-colors";

          return scenario.available ? (
            <Link
              key={id}
              href={`/dashboard?scenario=${id}`}
              className={cn("group", shell, tone.border, "hover:bg-card")}
              style={revealStep(i * 0.5)}
            >
              {body}
            </Link>
          ) : (
            <div
              key={id}
              className={cn(shell, "opacity-45")}
              style={revealStep(i * 0.5)}
            >
              {body}
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
