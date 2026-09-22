import type {
  ActivityCategory,
  ActivitySeverity,
  ActivityStage,
  BuildingStatus,
  CampusStatus,
  CrowdLevel,
} from "@/types";

export interface Tone {
  text: string;
  bg: string;
  border: string;
  dot: string;
  /** CSS colour usable in SVG fills and inline styles. */
  css: string;
}

const NORMAL: Tone = {
  text: "text-success",
  bg: "bg-success/10",
  border: "border-success/40",
  dot: "bg-success",
  css: "var(--status-normal)",
};

const CAUTION: Tone = {
  text: "text-warning",
  bg: "bg-warning/10",
  border: "border-warning/40",
  dot: "bg-warning",
  css: "var(--status-caution)",
};

const CRITICAL: Tone = {
  text: "text-danger",
  bg: "bg-danger/10",
  border: "border-danger/40",
  dot: "bg-danger",
  css: "var(--status-critical)",
};

const CALM: Tone = {
  text: "text-cyan",
  bg: "bg-cyan/10",
  border: "border-cyan/40",
  dot: "bg-cyan",
  css: "var(--color-cyan)",
};

export function statusTone(status: CampusStatus | BuildingStatus): Tone {
  switch (status) {
    case "CRITICAL":
    case "critical":
      return CRITICAL;
    case "CAUTION":
    case "caution":
      return CAUTION;
    default:
      return NORMAL;
  }
}

export function crowdTone(level: CrowdLevel): Tone {
  switch (level) {
    case "critical":
      return CRITICAL;
    case "high":
      return CAUTION;
    case "moderate":
      return NORMAL;
    default:
      return CALM;
  }
}

export function severityTone(severity: ActivitySeverity): Tone {
  if (severity === "critical") return CRITICAL;
  if (severity === "warning") return CAUTION;
  return NORMAL;
}

export const CROWD_LEVEL_LABEL: Record<CrowdLevel, string> = {
  low: "LOW",
  moderate: "MODERATE",
  high: "HIGH",
  critical: "CRITICAL",
};

export const BUILDING_STATUS_LABEL: Record<BuildingStatus, string> = {
  normal: "NORMAL",
  caution: "CAUTION",
  critical: "CRITICAL",
};

export const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  crowd: "혼잡",
  energy: "에너지",
  robot: "로봇",
  signage: "사이니지",
  emergency: "비상",
};

export const STAGE_LABEL: Record<ActivityStage, string> = {
  observe: "관측",
  predict: "예측",
  decide: "판단",
  act: "실행",
};
