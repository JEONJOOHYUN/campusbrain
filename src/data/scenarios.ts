import type { ScenarioDefinition, SimulationScenario } from "@/types";

/* ------------------------------------------------------------------ *
 * Scenarios are timelines: "at playback second t, this is true".
 * Numbers between keyframes are interpolated by the engine, so every
 * KPI, map colour and panel reading comes from here and nowhere else.
 *
 * Keyframes with a negative `t` are backlog — things the AI already did
 * before the operator opened the dashboard. They are always included.
 * ------------------------------------------------------------------ */

const NORMAL: ScenarioDefinition = {
  id: "normal",
  label: "평상시",
  headline: "평상시 캠퍼스 운영",
  description:
    "평상시 운영 상태입니다. AI는 공간을 계속 관측하면서 에너지와 로봇 작업을 미세 조정합니다.",
  durationSec: 60,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: null,
  insight: null,
  available: true,
  keyframes: [
    {
      t: -24,
      log: {
        category: "energy",
        stage: "act",
        severity: "info",
        title: "빈 강의실 감지 — 조명·냉난방 ECO 전환",
        location: "본관 304호",
      },
    },
    {
      t: -18,
      log: {
        category: "robot",
        stage: "decide",
        severity: "info",
        title: "청소 일정을 비혼잡 시간대로 재배정",
        location: "학생회관 1층",
        target: "CLN-03",
      },
    },
    {
      t: -12,
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "학생회관 재실률 71% 유지",
        location: "학생회관",
      },
    },
    {
      t: -6,
      log: {
        category: "signage",
        stage: "act",
        severity: "info",
        title: "일일 행사 사이니지 교체",
        location: "캠퍼스 전체",
        target: "디스플레이 12대",
      },
    },
    {
      t: 0,
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "캠퍼스 전역 재실 스캔 완료",
        location: "건물 6개소",
      },
    },
    {
      t: 24,
      metrics: {
        library: { crowd: 66 },
        main: { crowd: 51 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "15:00 수업을 앞두고 도서관 유입 증가",
        location: "도서관",
      },
    },
    {
      t: 48,
      metrics: {
        library: { crowd: 69, energy: 60 },
        main: { crowd: 53 },
      },
      log: {
        category: "energy",
        stage: "act",
        severity: "info",
        title: "저재실 구역 냉난방 설정온도 0.5°C 상향",
        location: "체육관",
      },
    },
    { t: 60, metrics: { library: { crowd: 70 }, main: { crowd: 54 } } },
  ],
};

const CROWD: ScenarioDefinition = {
  id: "crowd",
  label: "혼잡",
  headline: "공학관 혼잡 상황",
  description:
    "수업 종료와 함께 공학관으로 인원이 몰립니다. AI가 혼잡을 예측하고 사이니지·엘리베이터·로봇을 조정합니다.",
  durationSec: 60,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: "engineering",
  available: true,
  insight: {
    id: "insight-crowd-engineering",
    buildingId: "engineering",
    title: "공학관 혼잡도 상승 중",
    summary:
      "수업 종료 시간과 이동 흐름을 분석한 결과, 10분 내 1층 로비 혼잡이 예상됩니다.",
    prediction: 91,
    horizonMin: 10,
    confidence: 94,
    recommendation: "서편 복도로 이동 동선을 우회시키세요.",
    severity: "warning",
    appearsAt: 12,
    resolvesAt: 48,
    resolution:
      "예측된 피크가 억제되었습니다. 우회 안내와 엘리베이터 분산 이후 혼잡도가 다시 내려갔습니다.",
    steps: [
      {
        stage: "observe",
        label: "유입 흐름 감지",
        detail: "본관 → 공학관 · 분당 +38명",
        t: 6,
      },
      {
        stage: "predict",
        label: "10분 후 91% 예측",
        detail: "14:40 수업 종료 · 신뢰도 94%",
        t: 12,
      },
      {
        stage: "decide",
        label: "혼잡 완화 계획 선택",
        detail: "사이니지 · 엘리베이터 분산 · 로봇 경로 변경",
        t: 18,
      },
      {
        stage: "act",
        label: "물리 시스템 3종 작동",
        detail: "서편 복도 개방, 엘리베이터 분산, 청소 중단",
        t: 33,
      },
    ],
  },
  keyframes: [
    {
      t: -12,
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "캠퍼스 전역 재실 스캔 완료",
        location: "건물 6개소",
      },
    },
    {
      t: -6,
      log: {
        category: "signage",
        stage: "act",
        severity: "info",
        title: "일일 행사 사이니지 교체",
        location: "캠퍼스 전체",
        target: "디스플레이 12대",
      },
    },
    {
      t: 0,
      metrics: {
        engineering: { crowd: 82, energy: 74, temperature: 23.4, airQuality: 52 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "공학관 혼잡도 82%",
        location: "공학관 1층",
      },
    },
    {
      t: 6,
      metrics: { engineering: { crowd: 84, airQuality: 56 } },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "AI Vision이 본관발 유입 흐름을 감지",
        location: "중앙 보행로",
        target: "분당 +38명",
      },
    },
    {
      t: 12,
      metrics: { engineering: { crowd: 87, temperature: 24.0, airQuality: 61 } },
      log: {
        category: "crowd",
        stage: "predict",
        severity: "warning",
        title: "공학관 혼잡 예측 발생 — 10분 후 91%",
        location: "공학관",
        target: "신뢰도 94%",
      },
    },
    {
      t: 18,
      metrics: { engineering: { crowd: 90 } },
      log: {
        category: "crowd",
        stage: "decide",
        severity: "warning",
        title: "혼잡 완화 계획 선택",
        location: "공학관",
        target: "대응 3건",
      },
    },
    {
      t: 21,
      metrics: { engineering: { crowd: 91, temperature: 24.6, airQuality: 68 } },
      action: {
        id: "act-signage-west",
        kind: "signage",
        buildingId: "engineering",
        label: "우회 경로 사이니지",
        detail: "서편 복도 · 디스플레이 4대 변경",
      },
      log: {
        category: "signage",
        stage: "act",
        severity: "warning",
        title: "우회 경로 사이니지 활성화",
        location: "공학관 1층 · 서편 복도",
        target: "디스플레이 4대",
      },
    },
    {
      t: 27,
      metrics: {
        engineering: { crowd: 88 },
        "student-center": { crowd: 73 },
      },
      action: {
        id: "act-elevator-split",
        kind: "elevator",
        buildingId: "engineering",
        label: "엘리베이터 분산",
        detail: "2·3호기 5~9층 전용 운행",
      },
      log: {
        category: "crowd",
        stage: "act",
        severity: "warning",
        title: "엘리베이터 운행 분산 적용",
        location: "공학관",
        target: "2·3호기 → 5~9층",
      },
    },
    {
      t: 33,
      metrics: {
        engineering: { crowd: 83 },
        "student-center": { crowd: 75 },
      },
      action: {
        id: "act-robot-reroute",
        kind: "robot",
        buildingId: "engineering",
        label: "청소로봇 경로 변경",
        detail: "청소로봇 04 → 지하1층 복도",
      },
      robot: {
        id: "CLN-04",
        task: "경로 변경 — 지하1층 복도 청소",
        location: "공학관 지하1층",
        status: "경로 변경 중",
      },
      log: {
        category: "robot",
        stage: "act",
        severity: "info",
        title: "청소로봇 04 경로 변경",
        location: "공학관 지하1층",
        target: "CLN-04",
      },
    },
    {
      t: 39,
      metrics: {
        engineering: { crowd: 77, temperature: 24.1, airQuality: 60 },
        "student-center": { crowd: 76 },
      },
    },
    {
      t: 45,
      metrics: { engineering: { crowd: 72, airQuality: 55 } },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "공학관 혼잡 완화 — 72%",
        location: "공학관 1층",
      },
    },
    {
      t: 60,
      metrics: {
        engineering: { crowd: 68, energy: 70, temperature: 23.2, airQuality: 49 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "공학관 68%로 안정화",
        location: "공학관 1층",
      },
    },
  ],
};

/** Stubs — the switcher shows them, disabled, until they are built. */
const EVENT: ScenarioDefinition = {
  id: "event",
  label: "행사",
  headline: "졸업작품전",
  description: "졸업작품전 시나리오는 다음 단계에서 구현됩니다.",
  durationSec: 0,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: null,
  insight: null,
  keyframes: [],
  available: false,
};

const EMERGENCY: ScenarioDefinition = {
  id: "emergency",
  label: "비상",
  headline: "SafeFlow 대피 대응",
  description: "화재 대응 SafeFlow 시나리오는 다음 단계에서 구현됩니다.",
  durationSec: 0,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: null,
  insight: null,
  keyframes: [],
  available: false,
};

export const SCENARIOS: Record<SimulationScenario, ScenarioDefinition> = {
  normal: NORMAL,
  crowd: CROWD,
  event: EVENT,
  emergency: EMERGENCY,
};

export const SCENARIO_ORDER: SimulationScenario[] = [
  "normal",
  "crowd",
  "event",
  "emergency",
];

export const DEFAULT_SCENARIO: SimulationScenario = "normal";

export function isSimulationScenario(
  value: string | null | undefined,
): value is SimulationScenario {
  return value === "normal" || value === "crowd" || value === "event" || value === "emergency";
}
