import { CAMPUS, CAMPUS_CAUTION_BUILDING_COUNT, CROWD_THRESHOLDS } from "@/data/campus";
import type {
  BuildingState,
  BuildingStatus,
  CampusKpi,
  CampusStatus,
  CrowdLevel,
  RobotState,
} from "@/types";

export function crowdLevelOf(crowd: number): CrowdLevel {
  if (crowd >= CROWD_THRESHOLDS.critical) return "critical";
  if (crowd >= CROWD_THRESHOLDS.caution) return "high";
  if (crowd >= CROWD_THRESHOLDS.moderate) return "moderate";
  return "low";
}

export function buildingStatusOf(crowd: number): BuildingStatus {
  if (crowd >= CROWD_THRESHOLDS.critical) return "critical";
  if (crowd >= CROWD_THRESHOLDS.caution) return "caution";
  return "normal";
}

/**
 * Campus status is deliberately not "worst building wins": one busy hall at
 * 14:30 is a normal campus. It escalates when congestion spreads, or straight
 * to CRITICAL the moment any single building crosses the critical line.
 */
export function campusStatusOf(buildings: BuildingState[]): CampusStatus {
  if (buildings.some((b) => b.status === "critical")) return "CRITICAL";
  const caution = buildings.filter((b) => b.status === "caution").length;
  return caution >= CAMPUS_CAUTION_BUILDING_COUNT ? "CAUTION" : "NORMAL";
}

export function deriveCampusKpi(
  buildings: BuildingState[],
  robots: RobotState[],
  aiActionCount: number,
): CampusKpi {
  return {
    status: campusStatusOf(buildings),
    population: buildings.reduce((sum, b) => sum + b.population, 0),
    aiActionsToday: CAMPUS.aiActionsBaseline + aiActionCount,
    activeRobots: robots.filter((r) => !r.charging).length,
    crowdedAreas: buildings.filter((b) => b.crowd >= CROWD_THRESHOLDS.crowded).length,
    energySaving: CAMPUS.energySavingBaseline,
  };
}
