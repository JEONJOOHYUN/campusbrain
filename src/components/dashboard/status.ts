import type { EnergySystem } from "@/data/energy";
import { BATTERY_THRESHOLDS } from "@/data/robots";
import type { BadgeTone } from "@/components/ui/badge";
import type {
  ActivityCategory,
  ActivitySeverity,
  ActivityStage,
  AiActionKind,
  BuildingStatus,
  CampusStatus,
  CrowdLevel,
  RobotKind,
  SignageKind,
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

const INFO: Tone = {
  text: "text-primary",
  bg: "bg-primary/10",
  border: "border-primary/40",
  dot: "bg-primary",
  css: "var(--color-primary)",
};

const ACCENT: Tone = {
  text: "text-ai",
  bg: "bg-ai/10",
  border: "border-ai/40",
  dot: "bg-ai",
  css: "var(--color-ai)",
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

/**
 * What a display is showing, not how urgent the campus is — but the two
 * scales meet at the top: an evacuation sign is a CRITICAL sign.
 */
export function signageTone(kind: SignageKind): Tone {
  switch (kind) {
    case "evacuation":
      return CRITICAL;
    case "alert":
      return CAUTION;
    case "wayfinding":
      return INFO;
    case "event":
      return ACCENT;
    default:
      return CALM;
  }
}

export const SIGNAGE_KIND_LABEL: Record<SignageKind, string> = {
  welcome: "환영",
  event: "행사 안내",
  wayfinding: "길 안내",
  alert: "경고",
  evacuation: "대피",
};

export function severityTone(severity: ActivitySeverity): Tone {
  if (severity === "critical") return CRITICAL;
  if (severity === "warning") return CAUTION;
  return NORMAL;
}

/**
 * Which system is drawing the power. Categories, not severities — so they
 * deliberately avoid the amber/red the status scale owns.
 */
export function energySystemTone(system: EnergySystem): Tone {
  switch (system) {
    case "hvac":
      return INFO;
    case "lighting":
      return CALM;
    default:
      return ACCENT;
  }
}

export const ENERGY_SYSTEM_LABEL: Record<EnergySystem, string> = {
  hvac: "냉난방",
  lighting: "조명",
  equipment: "장비",
};

/** Remaining charge, not campus health — but they read on the same scale. */
export function batteryTone(battery: number): Tone {
  if (battery >= BATTERY_THRESHOLDS.ok) return NORMAL;
  if (battery >= BATTERY_THRESHOLDS.low) return CAUTION;
  return CRITICAL;
}

/** What a robot is for. Kinds are categories, so they borrow no status colour. */
export const ROBOT_KIND_LABEL: Record<RobotKind, string> = {
  cleaning: "청소",
  guide: "안내",
  delivery: "배송",
  security: "보안",
};

export const ROBOT_KIND_BADGE: Record<RobotKind, BadgeTone> = {
  cleaning: "cyan",
  guide: "primary",
  delivery: "ai",
  security: "neutral",
};

export const CROWD_LEVEL_BADGE: Record<CrowdLevel, BadgeTone> = {
  low: "cyan",
  moderate: "success",
  high: "warning",
  critical: "danger",
};

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

/** Which physical system an AI action reached for. */
export const AI_ACTION_KIND_LABEL: Record<AiActionKind, string> = {
  signage: "사이니지",
  elevator: "엘리베이터",
  robot: "로봇",
  door: "출입문",
  hvac: "냉난방",
  broadcast: "방송",
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
