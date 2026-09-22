import Link from "next/link";
import { CampusVisual } from "@/components/landing/campus-visual";
import { IconArrowRight, IconBrain } from "@/components/icons";
import { Button } from "@/components/ui/button";

const PIPELINE = [
  {
    stage: "관측",
    title: "공간을 본다",
    body: "카메라와 IoT 센서가 인원 흐름, 온도, 공기질, 전력 사용을 동시에 관측합니다.",
    tone: "text-cyan",
  },
  {
    stage: "예측",
    title: "다음을 예측한다",
    body: "수업 시간표와 이동 패턴을 결합해 10분 뒤의 혼잡을 미리 계산합니다.",
    tone: "text-primary",
  },
  {
    stage: "판단",
    title: "무엇을 할지 정한다",
    body: "사이니지·엘리베이터·로봇 중 어떤 물리 시스템을 움직일지 판단합니다.",
    tone: "text-ai",
  },
  {
    stage: "실행",
    title: "공간을 움직인다",
    body: "우회 경로를 안내하고, 엘리베이터를 분산하고, 로봇 경로를 바꿉니다.",
    tone: "text-success",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <IconBrain className="text-primary" width={22} height={22} />
          <span className="text-sm font-extrabold tracking-[0.14em]">CAMPUSBRAIN</span>
          <span className="rounded border border-ai/40 bg-ai/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.14em] text-ai">
            프로토타입
          </span>
          <Link
            href="/dashboard"
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            대시보드
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
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
            <Link href="/dashboard">
              <Button size="lg">
                CampusBrain 살펴보기
                <IconArrowRight width={16} height={16} />
              </Button>
            </Link>
            <Link href="/dashboard?scenario=crowd">
              <Button size="lg" variant="secondary">
                시뮬레이션 보기
              </Button>
            </Link>
          </div>

          <p className="mt-6 max-w-lg text-xs leading-relaxed text-muted">
            이 사이트는 인터랙티브 프로토타입입니다. 실제 CCTV·IoT·로봇·설비와 연결되어
            있지 않으며, 화면의 모든 수치는 시뮬레이션 데이터입니다.
          </p>
        </div>

        <CampusVisual className="w-full" />
      </section>

      {/* Pipeline */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI는 네 단계로 캠퍼스를 운영합니다.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            물리 공간 → 카메라 / 센서 / IoT → CampusBrain AI → 사이니지 / 로봇 /
            엘리베이터 / 냉난방
          </p>

          <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PIPELINE.map((step, index) => (
              <li
                key={step.stage}
                className="rounded-xl border border-line bg-card/70 p-5"
              >
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-3xl font-extralight text-muted/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${step.tone}`}
                  >
                    {step.stage}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-28">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          The Campus That Thinks.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
          공학관에 사람이 몰리는 상황을 직접 재생해 보세요. AI가 혼잡을 예측하고,
          사이니지·엘리베이터·청소로봇을 조정하는 과정을 단계별로 볼 수 있습니다.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard?scenario=crowd">
            <Button size="lg">
              혼잡 시뮬레이션 실행
              <IconArrowRight width={16} height={16} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted">
          CampusBrain — Physical AI 스마트 캠퍼스 프로토타입. 대학 프로젝트이며 상용
          제품이 아닙니다.
        </div>
      </footer>
    </div>
  );
}
