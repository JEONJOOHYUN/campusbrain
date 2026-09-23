import type { BuildingId } from "@/types";

/* ------------------------------------------------------------------ *
 * Energy figures are derived, not typed in: a building's live draw is
 * its rated peak x the `energy` metric the simulation engine produces,
 * so the Energy page moves with every scenario like everything else.
 * ------------------------------------------------------------------ */

/** Peak electrical draw per building, in kW. */
export const BUILDING_POWER_KW: Record<BuildingId, number> = {
  main: 420,
  engineering: 510,
  "student-center": 280,
  library: 330,
  gymnasium: 190,
  parking: 70,
};

/**
 * How a building's draw splits across systems. Shares sum to 1, and are
 * the same campus-wide — a prototype does not pretend to sub-meter each
 * building differently.
 */
export const ENERGY_MIX = {
  hvac: 0.52,
  lighting: 0.23,
  equipment: 0.25,
} as const;

export type EnergySystem = keyof typeof ENERGY_MIX;

export interface EnergyActionRecord {
  id: string;
  buildingId: BuildingId;
  /** Room or zone the AI acted on. */
  zone: string;
  /** Simulated clock of the action, e.g. "14:22". */
  at: string;
  /** What the sensors reported. */
  detection: string;
  /** What the AI did about it. */
  action: string;
  /** Estimated saving from this single action, in kWh. */
  savingKwh: number;
}

/** The most recent auto-control actions, newest first. */
export const ENERGY_ACTIONS: EnergyActionRecord[] = [
  {
    id: "eng-act-01",
    buildingId: "main",
    zone: "본관 304호",
    at: "14:22",
    detection: "재실 0명 · 조명 ON · 냉난방 ON",
    action: "조명 OFF · 냉난방 ECO 전환",
    savingKwh: 2.4,
  },
  {
    id: "eng-act-02",
    buildingId: "gymnasium",
    zone: "체육관 보조경기장",
    at: "12:47",
    detection: "재실 0명 · 냉난방 가동 중 · 2시간 경과",
    action: "냉난방 정지",
    savingKwh: 3.1,
  },
  {
    id: "eng-act-03",
    buildingId: "library",
    zone: "도서관 남측 열람실",
    at: "10:51",
    detection: "일사량 급증 · 실내 온도 상승",
    action: "블라인드 70% 하강 · 냉방 설정 +0.5°C",
    savingKwh: 5.6,
  },
  {
    id: "eng-act-04",
    buildingId: "engineering",
    zone: "공학관 512호",
    at: "09:44",
    detection: "재실 0명 · 조명 ON · 냉난방 ON",
    action: "조명 OFF · 냉난방 ECO 전환",
    savingKwh: 1.8,
  },
  {
    id: "eng-act-05",
    buildingId: "parking",
    zone: "주차장 B구역",
    at: "08:05",
    detection: "일출 · 외부 조도 기준 충족",
    action: "가로등 86개 일괄 소등",
    savingKwh: 7.2,
  },
];

/**
 * Auto-control actions executed today. The list above is the sample the
 * UI shows; this is how many actually ran.
 */
export const ENERGY_AUTO_CONTROL_TODAY = 132;
