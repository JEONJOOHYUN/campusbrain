import Link from "next/link";
import { CampusVisual } from "@/components/landing/campus-visual";
import { ProblemSection } from "@/components/landing/problem-section";
import { PerceptionSection } from "@/components/landing/perception-section";
import { PredictionSection } from "@/components/landing/prediction-section";
import { DecisionSection } from "@/components/landing/decision-section";
import { ActionSection } from "@/components/landing/action-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { SafeFlowSection } from "@/components/landing/safeflow-section";
import { revealStep } from "@/components/landing/section";
import { IconArrowRight, IconBrain } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";

/** The spec's own chain, kept as one line so the narrative below can expand it. */
const CHAIN = [
  { label: "물리 공간", tone: "text-muted" },
  { label: "카메라 · 센서 · IoT", tone: "text-muted" },
  { label: "CampusBrain AI", tone: "text-fg" },
  { label: "관측", tone: "text-cyan" },
  { label: "예측", tone: "text-primary" },
  { label: "판단", tone: "text-ai" },
  { label: "실행", tone: "text-success" },
  { label: "사이니지 · 로봇 · 엘리베이터 · 냉난방", tone: "text-muted" },
];

/** The presenter's path through the prototype, in order. */
const DEMO_ROUTE = [
  { label: "개요에서 캠퍼스 전체 상태 확인", href: "/dashboard" },
  { label: "디지털 트윈에서 공학관 선택", href: "/dashboard/twin" },
  { label: "혼잡 시뮬레이션 재생", href: "/dashboard?scenario=crowd" },
  { label: "비상 시뮬레이션과 SafeFlow", href: "/dashboard/emergency?scenario=emergency" },
  { label: "AI 리포트에서 대응 기록 확인", href: "/dashboard/reports" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-4 sm:gap-3 sm:px-6">
          <IconBrain className="shrink-0 text-primary" width={22} height={22} />
          <span className="text-sm font-extrabold tracking-[0.14em]">CAMPUSBRAIN</span>
          <span className="hidden rounded border border-ai/40 bg-ai/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.14em] text-ai sm:inline">
            프로토타입
          </span>
          <Link
            href="/dashboard"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            대시보드
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            Physical AI Campus Operating System
          </p>
          <h1 className="mt-5 text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            CAMPUS
            <br />
            <span className="bg-gradient-to-r from-primary via-ai to-cyan bg-clip-text text-transparent">
              BRAIN
            </span>
          </h1>
          <p className="mt-8 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            공간이 사람을 이해하는 순간.
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
            AI가 캠퍼스를 보고, 상황을 예측하고, 공간을 움직입니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonClasses({ size: "lg" })}>
              CampusBrain 살펴보기
              <IconArrowRight width={16} height={16} />
            </Link>
            <Link
              href="/dashboard?scenario=crowd"
              className={buttonClasses({ size: "lg", variant: "secondary" })}
            >
              시뮬레이션 보기
            </Link>
          </div>

          <p className="mt-6 max-w-lg text-xs leading-relaxed text-muted">
            이 사이트는 인터랙티브 프로토타입입니다. 실제 CCTV·IoT·로봇·설비와 연결되어
            있지 않으며, 화면의 모든 수치는 시뮬레이션 데이터입니다.
          </p>
        </div>

        <CampusVisual className="w-full" />
      </section>

      {/* The chain, one line. Every link in it is a section below. */}
      <div className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-4 sm:px-6">
          <ol className="flex w-max items-center gap-2.5 sm:gap-3">
            {CHAIN.map((link, i) => (
              <li key={link.label} className="flex items-center gap-2.5 sm:gap-3">
                {i > 0 && (
                  <span className="text-muted/40" aria-hidden>
                    →
                  </span>
                )}
                <span
                  className={`whitespace-nowrap text-[11px] font-medium tracking-tight sm:text-xs ${link.tone}`}
                >
                  {link.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ProblemSection />
      <PerceptionSection />
      <PredictionSection />
      <DecisionSection />
      <ActionSection />
      <UseCasesSection />
      <SafeFlowSection />

      {/* CTA */}
      <section
        id="cta"
        className="scroll-mt-16 border-t border-line bg-surface/40"
        aria-labelledby="cta-title"
      >
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="reveal text-center">
            <span className="tnum text-[10px] font-medium uppercase tracking-[0.18em] text-muted/50">
              08 · CTA
            </span>
            <h2
              id="cta-title"
              className="mt-5 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
            >
              The Campus
              <br />
              <span className="bg-gradient-to-r from-primary via-ai to-cyan bg-clip-text text-transparent">
                That Thinks.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
              공학관에 사람이 몰리는 순간부터 화재 대피까지, 직접 재생하며 확인할 수
              있습니다.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard?scenario=crowd"
                className={buttonClasses({ size: "lg" })}
              >
                혼잡 시뮬레이션 실행
                <IconArrowRight width={16} height={16} />
              </Link>
              <Link
                href="/dashboard/emergency?scenario=emergency"
                className={buttonClasses({ size: "lg", variant: "secondary" })}
              >
                비상 시뮬레이션 실행
              </Link>
            </div>
          </div>

          {/* The demo path, so a presenter never has to hunt for the next click. */}
          <ol
            className="reveal mx-auto mt-16 grid max-w-3xl gap-px overflow-hidden rounded-xl border border-line bg-line"
            style={revealStep(1)}
          >
            {DEMO_ROUTE.map((step, i) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="group flex items-center gap-4 bg-card px-5 py-4 transition-colors hover:bg-surface"
                >
                  <span className="tnum shrink-0 text-sm font-medium text-muted/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-fg">
                    {step.label}
                  </span>
                  <IconArrowRight
                    width={15}
                    height={15}
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs leading-relaxed text-muted sm:px-6">
          CampusBrain — Physical AI 스마트 캠퍼스 프로토타입. 대학 프로젝트이며 상용
          제품이 아닙니다.
        </div>
      </footer>
    </div>
  );
}
