import type { SafeFlowPlan } from "@/types";

/* ------------------------------------------------------------------ *
 * SafeFlow — the campus fire-response plan the emergency scenario runs.
 *
 * Phase `t` values mirror the EMERGENCY keyframes in `scenarios.ts`: a
 * phase completes on the same playback second as the keyframe that makes
 * it true. Route waypoints live in the Digital Twin's 960 x 560 SVG
 * space, the same coordinates `buildings.ts` uses for footprints.
 *
 * The people counts balance on purpose: the 124 taken off the three
 * high-risk routes are exactly the 124 put onto the two safe ones, so
 * "인원 유도 124명" is a sum the screen can be checked against rather
 * than a number typed into a summary card.
 * ------------------------------------------------------------------ */

export const SAFEFLOW_PLAN: SafeFlowPlan = {
  fire: {
    buildingId: "engineering",
    floor: "3층 동편",
    zone: "3층 동편 실험동 · 중앙 계단",
    detail: "연기 감지기 3대 · AI Vision 확인",
  },

  phases: [
    {
      id: "detect",
      label: "화재 감지",
      detail: "공학관 3층 동편 · 연기 감지기 3대",
      t: 4,
    },
    {
      id: "risk",
      label: "위험 구역 분석",
      detail: "연기 확산 예측 · 동편 실험동과 중앙 계단",
      t: 10,
    },
    {
      id: "crowd",
      label: "인원 위치 분석",
      detail: "공학관 9개 층 재실 분포 스캔",
      t: 16,
    },
    {
      id: "route",
      label: "안전 경로 산출",
      detail: "안전 경로 2개 확보 · 고위험 경로 3개 회피",
      t: 24,
    },
    {
      id: "coordinate",
      label: "물리 시스템 연동",
      detail: "출입문 · 사이니지 · 안내로봇 · 비상 방송",
      t: 42,
    },
    {
      id: "activate",
      label: "대응 활성화",
      detail: "대피 유도 시작 · 집결지 인원 확인",
      t: 48,
    },
  ],

  routes: [
    {
      id: "route-safe-gate-b",
      kind: "safe",
      label: "남측 비상계단 → B출입구",
      detail: "주차장 집결지 방면 · 연기 유입 없음",
      people: 78,
      points: [
        [560, 308],
        [610, 336],
        [660, 368],
        [690, 386],
      ],
    },
    {
      id: "route-safe-west-stair",
      kind: "safe",
      label: "서편 비상계단 → 학생회관 광장",
      detail: "보조 집결지 방면 · 저층 인원 분산",
      people: 46,
      points: [
        [516, 279],
        [470, 320],
        [430, 344],
      ],
    },
    {
      id: "route-blocked-east",
      kind: "blocked",
      label: "동편 연결통로 (도서관 방면)",
      detail: "화점 인접 · 연기 직접 노출",
      people: 68,
      points: [
        [560, 192],
        [632, 224],
        [700, 202],
      ],
    },
    {
      id: "route-blocked-center",
      kind: "blocked",
      label: "중앙 계단 → 중앙 보행로",
      detail: "연기 확산 경로 · 저층 정체 예상",
      people: 41,
      points: [
        [517, 221],
        [430, 215],
        [330, 230],
      ],
    },
    {
      id: "route-blocked-west-outer",
      kind: "blocked",
      label: "서편 외곽로 (체육관 방면)",
      detail: "소방 진입 동선 · 보행 통제 구간",
      people: 15,
      points: [
        [474, 250],
        [380, 296],
        [240, 330],
      ],
    },
  ],

  /**
   * Evacuation times the improvement rate is measured between: the drill
   * baseline for this building against what the SafeFlow routing achieves.
   */
  evacuation: {
    baselineSec: 260,
    safeflowSec: 180,
  },
};
