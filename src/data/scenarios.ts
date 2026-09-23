import { SAFEFLOW_PLAN } from "@/data/safeflow";
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
  flowFromBuildingId: null,
  insight: null,
  safeflow: null,
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
  flowFromBuildingId: "main",
  available: true,
  safeflow: null,
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
      signage: {
        ids: ["SGN-03", "SGN-04", "SGN-07"],
        message: {
          kind: "wayfinding",
          headline: "공학관 1층 혼잡",
          sub: "서편 복도로 우회하세요",
          arrow: "left",
        },
        reason: "공학관 10분 후 91% 혼잡 예측에 따른 우회 안내",
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
      // The receiving end of the diversion gets its own wording — the same
      // AI decision, but a display standing at the corridor it opens.
      t: 21,
      signage: {
        ids: ["SGN-05"],
        message: {
          kind: "wayfinding",
          headline: "서편 복도 개방",
          sub: "3층 강의동 방면 우회로",
          arrow: "up",
        },
        reason: "공학관 10분 후 91% 혼잡 예측에 따른 우회 안내",
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
      signage: {
        ids: ["SGN-06"],
        message: {
          kind: "alert",
          headline: "엘리베이터 분산 운행",
          sub: "2·3호기 5~9층 전용 · 1·4호기 저층",
        },
        reason: "공학관 저층 혼잡 완화를 위한 엘리베이터 분산 결정",
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

/**
 * The graduation exhibition. Unlike the crowd scenario this inflow is
 * planned — the AI is not suppressing a spike, it is deciding where a
 * known crowd should walk. Visitors park and head for the exhibition on
 * the 3rd floor of Engineering Hall; left alone they all funnel through
 * the Student Center plaza, so the AI splits the stream across the
 * central walkway and puts the two idle guide robots on the route.
 *
 * The campus ends the run at CAUTION, not NORMAL. An exhibition day is
 * busy by definition; what the AI removed was the concentration, not the
 * visitors — and the third busy building at the end (Main Hall) is busy
 * *because* the AI routed people through it.
 */
const EVENT: ScenarioDefinition = {
  id: "event",
  label: "행사",
  headline: "졸업작품전 — 방문객 동선 분산",
  description:
    "졸업작품전에 외부 방문객이 들어옵니다. AI가 방문객 동선을 예측해 행사 안내 사이니지를 바꾸고, 혼잡 구역을 우회시키고, 안내로봇을 투입합니다.",
  durationSec: 60,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: "student-center",
  // Visitors arrive by car, so the map draws the inbound stream from the
  // parking area towards the plaza the AI is trying to keep clear.
  flowFromBuildingId: "parking",
  available: true,
  safeflow: null,
  insight: {
    id: "insight-event-student-center",
    buildingId: "student-center",
    title: "졸업작품전 방문객 동선 집중",
    summary:
      "주차장에서 전시장으로 향하는 방문객이 학생회관 광장 한 곳으로 몰리고 있습니다. 현재 유입 속도면 광장 혼잡이 88%에 이릅니다.",
    prediction: 88,
    horizonMin: 10,
    confidence: 92,
    recommendation: "방문객 동선 일부를 중앙 보행로로 분산하고 전시장 안내를 사이니지로 바꾸세요.",
    severity: "warning",
    appearsAt: 12,
    resolvesAt: 48,
    resolution:
      "광장 혼잡이 88%에서 꺾였습니다. 중앙 보행로가 열린 뒤 방문객이 두 경로로 나뉘어 들어오고 있습니다.",
    steps: [
      {
        stage: "observe",
        label: "방문객 유입 감지",
        detail: "주차장 → 학생회관 광장 · 분당 +26명",
        t: 6,
      },
      {
        stage: "predict",
        label: "10분 후 광장 88% 예측",
        detail: "졸업작품전 개장 · 신뢰도 92%",
        t: 12,
      },
      {
        stage: "decide",
        label: "방문객 동선 분산 계획 선택",
        detail: "중앙 보행로 우회 · 안내로봇 · 전시장 엘리베이터",
        t: 18,
      },
      {
        stage: "act",
        label: "물리 시스템 4종 작동",
        detail: "사이니지 2 · 안내로봇 2대 · 엘리베이터",
        t: 39,
      },
    ],
  },
  keyframes: [
    {
      t: -30,
      log: {
        category: "signage",
        stage: "act",
        severity: "info",
        title: "졸업작품전 안내 사이니지 사전 배포",
        location: "캠퍼스 전체",
        target: "디스플레이 12대",
      },
    },
    {
      t: -22,
      log: {
        category: "robot",
        stage: "decide",
        severity: "info",
        title: "안내로봇 전시장 순회 경로 사전 생성",
        location: "공학관 3층 전시장",
        target: "GDE-03",
      },
    },
    {
      t: -14,
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "외부 방문객 사전 등록 412명 확인",
        location: "졸업작품전",
      },
    },
    {
      t: -6,
      log: {
        category: "energy",
        stage: "act",
        severity: "info",
        title: "전시장 조명·환기 사전 가동",
        location: "공학관 3층 전시장",
      },
    },
    {
      t: 0,
      metrics: {
        "student-center": { crowd: 71, temperature: 23.1, airQuality: 47 },
        engineering: { crowd: 82, energy: 74 },
        main: { crowd: 48 },
        parking: { crowd: 26 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "졸업작품전 개장 — 방문객 입장 시작",
        location: "공학관 3층 전시장",
      },
    },
    {
      t: 6,
      metrics: {
        "student-center": { crowd: 74 },
        main: { crowd: 50 },
        parking: { crowd: 38 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "AI Vision이 주차장발 방문객 흐름을 감지",
        location: "학생회관 광장",
        target: "분당 +26명",
      },
    },
    {
      t: 12,
      metrics: {
        "student-center": { crowd: 79, airQuality: 52 },
        engineering: { crowd: 83 },
        main: { crowd: 52 },
        parking: { crowd: 47 },
      },
      log: {
        category: "crowd",
        stage: "predict",
        severity: "warning",
        title: "학생회관 광장 혼잡 예측 발생 — 10분 후 88%",
        location: "학생회관 광장",
        target: "신뢰도 92%",
      },
    },
    {
      t: 18,
      metrics: {
        "student-center": { crowd: 84 },
        main: { crowd: 55 },
        parking: { crowd: 54 },
      },
      log: {
        category: "crowd",
        stage: "decide",
        severity: "warning",
        title: "방문객 동선 분산 계획 선택",
        location: "캠퍼스 전체",
        target: "대응 4건",
      },
    },
    {
      t: 21,
      metrics: {
        "student-center": { crowd: 87 },
        parking: { crowd: 57 },
      },
      action: {
        id: "act-signage-event",
        kind: "signage",
        buildingId: "engineering",
        label: "행사 안내 사이니지",
        detail: "전시장 방면 · 디스플레이 3대 변경",
      },
      signage: {
        ids: ["SGN-01", "SGN-03", "SGN-07"],
        message: {
          kind: "event",
          headline: "졸업작품전 전시장",
          sub: "공학관 3층 · 중앙 보행로 경유",
          arrow: "right",
        },
        reason: "졸업작품전 방문객 동선 안내",
      },
      log: {
        category: "signage",
        stage: "act",
        severity: "info",
        title: "행사 안내 사이니지 활성화",
        location: "본관 · 중앙 보행로 · 공학관",
        target: "디스플레이 3대",
      },
    },
    {
      // The gate arm sees the visitors first, so it carries the parking
      // instruction rather than the exhibition wayfinding.
      t: 21,
      signage: {
        ids: ["SGN-12"],
        message: {
          kind: "wayfinding",
          headline: "졸업작품전 방문객 주차",
          sub: "B구역 · 전시장까지 도보 4분",
          arrow: "right",
        },
        reason: "졸업작품전 방문객 동선 안내",
      },
    },
    {
      t: 24,
      metrics: {
        "student-center": { crowd: 88, temperature: 23.8, airQuality: 58 },
        main: { crowd: 58 },
        parking: { crowd: 60 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "warning",
        title: "학생회관 광장 88% — 예측 피크 도달",
        location: "학생회관 광장",
      },
    },
    {
      t: 27,
      metrics: {
        "student-center": { crowd: 85 },
        main: { crowd: 63 },
        parking: { crowd: 62 },
      },
      action: {
        id: "act-signage-detour",
        kind: "signage",
        buildingId: "student-center",
        label: "방문객 동선 우회",
        detail: "광장 → 중앙 보행로",
      },
      signage: {
        ids: ["SGN-09"],
        message: {
          kind: "wayfinding",
          headline: "광장 혼잡 — 중앙 보행로 이용",
          sub: "공학관 3층 전시장 방면",
          arrow: "up",
        },
        reason: "학생회관 광장 88% 혼잡에 따른 방문객 동선 분산",
      },
      log: {
        category: "signage",
        stage: "act",
        severity: "warning",
        title: "학생회관 광장 우회 안내 활성화",
        location: "학생회관 앞 광장",
        target: "SGN-09",
      },
    },
    {
      t: 33,
      metrics: {
        "student-center": { crowd: 81 },
        engineering: { crowd: 84, energy: 78 },
        main: { crowd: 68 },
        parking: { crowd: 63 },
      },
      action: {
        id: "act-robot-guide-event",
        kind: "robot",
        buildingId: "engineering",
        label: "안내로봇 2대 투입",
        detail: "안내로봇 01 → 전시장 · 04 → 주차장 입구",
      },
      robot: {
        id: "GDE-01",
        buildingId: "engineering",
        task: "전시장 방문객 안내",
        location: "공학관 1층 로비",
        status: "안내 중",
      },
      log: {
        category: "robot",
        stage: "act",
        severity: "info",
        title: "안내로봇 01 전시장 투입",
        location: "공학관 1층 로비",
        target: "GDE-01",
      },
    },
    {
      // Second unit, same decision — it meets visitors at the car park so
      // the routing starts before they are inside the campus.
      t: 33,
      robot: {
        id: "GDE-04",
        buildingId: "parking",
        task: "방문객 입장 동선 안내",
        location: "주차장 진입로",
        status: "안내 중",
      },
      log: {
        category: "robot",
        stage: "act",
        severity: "info",
        title: "안내로봇 04 주차장 입구 배치",
        location: "주차장 진입로",
        target: "GDE-04",
      },
    },
    {
      t: 39,
      metrics: {
        "student-center": { crowd: 78 },
        engineering: { crowd: 84 },
        main: { crowd: 70 },
        parking: { crowd: 64 },
      },
      action: {
        id: "act-elevator-exhibition",
        kind: "elevator",
        buildingId: "engineering",
        label: "전시장 전용 엘리베이터",
        detail: "3·4호기 3층 직통 운행",
      },
      signage: {
        ids: ["SGN-06"],
        message: {
          kind: "alert",
          headline: "전시장 전용 엘리베이터",
          sub: "3·4호기 3층 직통 · 1·2호기 전층",
        },
        reason: "전시장 방문객과 재학생 동선 분리",
      },
      log: {
        category: "crowd",
        stage: "act",
        severity: "info",
        title: "엘리베이터 전시장 직통 운행 적용",
        location: "공학관",
        target: "3·4호기 → 3층",
      },
    },
    {
      t: 45,
      metrics: {
        "student-center": { crowd: 76, temperature: 23.4, airQuality: 52 },
        main: { crowd: 71 },
        parking: { crowd: 64 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "광장 혼잡 완화 — 76%",
        location: "학생회관 앞 광장",
      },
    },
    {
      t: 60,
      metrics: {
        "student-center": { crowd: 74, temperature: 23.2, airQuality: 49 },
        engineering: { crowd: 84, energy: 79 },
        main: { crowd: 71 },
        parking: { crowd: 63 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "방문객 동선이 두 경로로 분산 — 광장 74%",
        location: "캠퍼스 전체",
      },
    },
  ],
};

/**
 * SafeFlow — the spec's core demo. Six phases over ten simulated minutes:
 * detect, analyse the risk area, locate people, compute safe routes,
 * coordinate the physical systems, activate. The phase list and the route
 * geometry live in `data/safeflow.ts`; the numbers below are the timeline
 * that makes them happen.
 */
const EMERGENCY: ScenarioDefinition = {
  id: "emergency",
  label: "비상",
  headline: "공학관 화재 — SafeFlow 대피 대응",
  description:
    "공학관 3층 동편에서 화재가 감지됩니다. AI가 위험 구역과 인원 위치를 분석해 안전 대피경로를 산출하고, 출입문·사이니지·로봇·방송을 동시에 작동시킵니다.",
  durationSec: 60,
  timeScale: 10,
  clockStart: "14:30",
  focusBuildingId: "engineering",
  // The crowd here flows out, not in — the evacuation routes are drawn by
  // the SafeFlow layer instead of the inbound flow curve.
  flowFromBuildingId: null,
  available: true,
  safeflow: SAFEFLOW_PLAN,
  insight: {
    id: "insight-emergency-engineering",
    buildingId: "engineering",
    title: "공학관 3층 화재 — 저층 출구 혼잡 예측",
    summary:
      "동편 실험동에서 연기가 감지되었습니다. 현재 인원 분포로는 2분 내 중앙 계단과 1층 로비에 혼잡이 집중됩니다.",
    prediction: 89,
    horizonMin: 2,
    confidence: 96,
    recommendation: "동편 복도를 차단하고 남측·서편 비상계단으로 대피 동선을 유도하세요.",
    severity: "critical",
    appearsAt: 6,
    resolvesAt: 54,
    resolution:
      "출구 혼잡이 예측된 89%를 넘지 않았습니다. 안전 경로 2개로 분산된 뒤 공학관 재실이 계속 감소했습니다.",
    steps: [
      {
        stage: "observe",
        label: "3층 동편 연기 감지",
        detail: "연기 감지기 3대 · AI Vision 확인",
        t: 4,
      },
      {
        stage: "predict",
        label: "2분 후 출구 혼잡 89% 예측",
        detail: "중앙 계단 집중 · 신뢰도 96%",
        t: 16,
      },
      {
        stage: "decide",
        label: "SafeFlow 대피 계획 선택",
        detail: "동편 차단 · 안전 경로 2개 · 집결지 2개소",
        t: 24,
      },
      {
        stage: "act",
        label: "물리 시스템 5종 작동",
        detail: "출입문 2 · 사이니지 · 로봇 · 방송",
        t: 42,
      },
    ],
  },
  keyframes: [
    {
      t: -12,
      log: {
        category: "emergency",
        stage: "observe",
        severity: "info",
        title: "소방 설비 자가진단 완료 — 이상 없음",
        location: "캠퍼스 전체",
      },
    },
    {
      t: -6,
      log: {
        category: "crowd",
        stage: "observe",
        severity: "info",
        title: "캠퍼스 전역 재실 스캔 완료",
        location: "건물 6개소",
      },
    },
    {
      t: 0,
      metrics: {
        engineering: { crowd: 82, energy: 74, temperature: 23.4, airQuality: 52 },
      },
      log: {
        category: "emergency",
        stage: "observe",
        severity: "critical",
        title: "공학관 3층 동편 연기 감지",
        location: "공학관 3층 실험동",
        target: "연기 감지기 3대",
      },
    },
    {
      t: 4,
      metrics: { engineering: { crowd: 84, temperature: 25.8, airQuality: 78 } },
      log: {
        category: "emergency",
        stage: "observe",
        severity: "critical",
        title: "AI Vision 화재 확인 — SafeFlow 개시",
        location: "공학관 3층 동편",
      },
    },
    {
      t: 10,
      metrics: { engineering: { crowd: 85, temperature: 27.4, airQuality: 96 } },
      log: {
        category: "emergency",
        stage: "observe",
        severity: "critical",
        title: "위험 구역 산출 — 동편 실험동·중앙 계단",
        location: "공학관",
        target: "연기 확산 예측",
      },
    },
    {
      t: 16,
      metrics: { engineering: { crowd: 86, temperature: 28.4, airQuality: 112 } },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "warning",
        title: "공학관 재실 인원 위치 분석 완료",
        location: "공학관 9개 층",
      },
    },
    {
      // Same moment, the other half of the analysis: where those people are
      // about to pile up.
      t: 16,
      log: {
        category: "crowd",
        stage: "predict",
        severity: "critical",
        title: "저층 출구 혼잡 예측 — 2분 내 89%",
        location: "공학관 중앙 계단",
        target: "신뢰도 96%",
      },
    },
    {
      t: 24,
      metrics: { engineering: { crowd: 88, temperature: 29.6, airQuality: 124 } },
      log: {
        category: "emergency",
        stage: "decide",
        severity: "critical",
        title: "SafeFlow 대피 계획 선택",
        location: "공학관",
        target: "안전 경로 2 · 차단 3",
      },
    },
    {
      t: 28,
      // The rest of the campus holds its baseline until the doors open.
      // Without these anchors the engine would ramp the assembly areas up
      // from t=0, filling them before anyone had been told to leave.
      metrics: {
        engineering: { crowd: 89 },
        parking: { crowd: 26 },
        "student-center": { crowd: 71 },
        gymnasium: { crowd: 37 },
        main: { crowd: 48 },
      },
      action: {
        id: "act-door-gate-b",
        kind: "door",
        buildingId: "engineering",
        label: "B출입구 개방",
        detail: "남측 비상계단 → 주차장 집결지",
      },
      log: {
        category: "emergency",
        stage: "act",
        severity: "critical",
        title: "B출입구 비상 개방",
        location: "공학관 남측",
        target: "주차장 집결지",
      },
    },
    {
      t: 32,
      metrics: { engineering: { crowd: 86 }, parking: { crowd: 30 } },
      action: {
        id: "act-door-east-restricted",
        kind: "door",
        buildingId: "engineering",
        label: "동편 복도 차단",
        detail: "동편 연결통로 · 중앙 계단 접근 제한",
      },
      log: {
        category: "emergency",
        stage: "act",
        severity: "critical",
        title: "동편 복도 접근 차단",
        location: "공학관 동편 연결통로",
        target: "고위험 경로 3개",
      },
    },
    {
      t: 36,
      metrics: { engineering: { crowd: 78 }, parking: { crowd: 36 } },
      action: {
        id: "act-signage-evacuation",
        kind: "signage",
        buildingId: "engineering",
        label: "비상 대피 사이니지",
        detail: "대피 방향 전환 · 디스플레이 7대",
      },
      signage: {
        ids: ["SGN-04", "SGN-06", "SGN-07"],
        message: {
          kind: "evacuation",
          headline: "화재 발생 — 즉시 대피",
          sub: "남측 비상계단 → B출입구",
          arrow: "right",
        },
        reason: "공학관 3층 동편 화재 감지에 따른 대피 유도",
      },
      log: {
        category: "signage",
        stage: "act",
        severity: "critical",
        title: "비상 대피 사이니지 활성화",
        location: "공학관 · 중앙 보행로",
        target: "디스플레이 7대",
      },
    },
    {
      // The corridor that stays open says where it leads, not what happened.
      t: 36,
      signage: {
        ids: ["SGN-05"],
        message: {
          kind: "evacuation",
          headline: "서편 비상계단 개방",
          sub: "학생회관 광장 방면 · 통행 가능",
          arrow: "left",
        },
        reason: "공학관 3층 동편 화재 감지에 따른 대피 유도",
      },
    },
    {
      // Displays outside the building are keeping people away rather than
      // moving them out — a warning, not an evacuation sign.
      t: 36,
      signage: {
        ids: ["SGN-01", "SGN-02", "SGN-03"],
        message: {
          kind: "alert",
          headline: "공학관 접근 제한",
          sub: "소방 진입 동선 · 우회하세요",
        },
        reason: "공학관 3층 동편 화재 감지에 따른 대피 유도",
      },
    },
    {
      t: 39,
      metrics: { engineering: { crowd: 70 }, parking: { crowd: 41 } },
      action: {
        id: "act-robot-guide-dispatch",
        kind: "robot",
        buildingId: "engineering",
        label: "안내로봇 02 투입",
        detail: "서편 비상계단 대피 유도",
      },
      robot: {
        id: "GDE-02",
        buildingId: "engineering",
        task: "대피 유도 — 서편 비상계단",
        location: "공학관 1층 서편",
        status: "대피 유도 중",
      },
      log: {
        category: "robot",
        stage: "act",
        severity: "critical",
        title: "안내로봇 02 대피 유도 투입",
        location: "공학관 1층 서편",
        target: "GDE-02",
      },
    },
    {
      // Clearing the route matters as much as marking it.
      t: 39,
      robot: {
        id: "CLN-04",
        task: "대피 경로 확보 — 지하 도크 복귀",
        location: "공학관 지하1층 도크",
        status: "경로 확보 중",
      },
      log: {
        category: "robot",
        stage: "act",
        severity: "info",
        title: "청소로봇 04 대피 경로에서 철수",
        location: "공학관 1층 로비",
        target: "CLN-04",
      },
    },
    {
      t: 42,
      metrics: {
        engineering: { crowd: 60, temperature: 30.4, airQuality: 132 },
        parking: { crowd: 46 },
      },
      action: {
        id: "act-broadcast-emergency",
        kind: "broadcast",
        buildingId: "engineering",
        label: "비상 방송 송출",
        detail: "공학관 전층 · 3개 국어 안내",
      },
      log: {
        category: "emergency",
        stage: "act",
        severity: "critical",
        title: "비상 방송 송출 — 공학관 전층",
        location: "공학관",
        target: "3개 국어",
      },
    },
    {
      t: 48,
      metrics: {
        engineering: { crowd: 28, energy: 55, temperature: 31.6, airQuality: 140 },
        parking: { crowd: 56 },
        "student-center": { crowd: 78 },
        gymnasium: { crowd: 44 },
        main: { crowd: 50 },
      },
      log: {
        category: "emergency",
        stage: "act",
        severity: "critical",
        title: "대응 활성화 완료 — 대피 유도 중",
        location: "공학관",
        target: "안전 경로 2개",
      },
    },
    {
      t: 54,
      metrics: {
        engineering: { crowd: 15 },
        parking: { crowd: 63 },
        "student-center": { crowd: 79 },
        gymnasium: { crowd: 47 },
      },
      log: {
        category: "crowd",
        stage: "observe",
        severity: "warning",
        title: "공학관 재실 급감 — 대피 진행 중",
        location: "공학관",
      },
    },
    {
      t: 60,
      metrics: {
        engineering: { crowd: 9, energy: 38, temperature: 32.2, airQuality: 148 },
        parking: { crowd: 67 },
        "student-center": { crowd: 80 },
        gymnasium: { crowd: 48 },
        main: { crowd: 52 },
      },
      log: {
        category: "emergency",
        stage: "observe",
        severity: "info",
        title: "공학관 대피 완료 — 집결지 인원 확인",
        location: "주차장 집결지",
      },
    },
  ],
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
