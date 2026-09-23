import { BUILDINGS } from "@/data/buildings";
import { ROBOTS } from "@/data/robots";
import { SIGNAGE } from "@/data/signage";
import { deriveState } from "@/lib/simulation/engine";
import { Figure, LandingSection, revealStep } from "@/components/landing/section";

/* The scale of what a campus already measures — every figure counted from
   the same data the dashboard runs on, never typed in here. */
const SENSOR_COUNT = BUILDINGS.reduce((sum, b) => sum + b.sensors, 0);
const BASELINE = deriveState("normal", 0);

const FIGURES = [
  {
    value: SENSOR_COUNT,
    unit: "대",
    label: "카메라 · IoT 센서",
    detail: `건물 ${BUILDINGS.length}개소에 흩어져 있습니다.`,
    tone: "text-primary",
  },
  {
    value: SIGNAGE.length,
    unit: "면",
    label: "디지털 사이니지",
    detail: "대부분 같은 안내를 하루 종일 반복합니다.",
    tone: "text-cyan",
  },
  {
    value: ROBOTS.length,
    unit: "대",
    label: "청소 · 안내 · 배송 로봇",
    detail: "정해진 경로를 정해진 시간에 돕니다.",
    tone: "text-ai",
  },
  {
    value: BASELINE.campus.population.toLocaleString(),
    unit: "명",
    label: "지금 캠퍼스 안의 사람",
    detail: "평상시 오후 2시 30분 기준.",
    tone: "text-fg",
  },
];

export function ProblemSection() {
  return (
    <LandingSection
      id="problem"
      index={1}
      stage="문제"
      code="PROBLEM"
      tone="text-muted"
      title={
        <>
          캠퍼스는 이미 모든 것을 재고 있습니다.
          <br />
          <span className="text-muted">아무도 그것을 쓰지 않을 뿐입니다.</span>
        </>
      }
      lead="센서는 기록하고, 사이니지는 같은 문구를 반복하고, 로봇은 정해진 경로를 돕니다. 데이터는 쌓이지만 공간은 움직이지 않습니다."
    >
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {FIGURES.map((figure, i) => (
          <Figure key={figure.label} {...figure} style={revealStep(i)} />
        ))}
      </div>

      <p
        className="reveal mt-14 max-w-2xl border-l-2 border-line pl-5 text-xl font-semibold leading-snug tracking-tight text-fg sm:text-2xl"
        style={revealStep(1)}
      >
        문제는 데이터가 없는 것이 아닙니다. 데이터를 보고{" "}
        <span className="text-primary">공간을 움직이는 주체</span>가 없는 것입니다.
      </p>
    </LandingSection>
  );
}
