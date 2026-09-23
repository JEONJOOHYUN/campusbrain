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
 *
 * An emergency run overrides all of that. Crowd is the only thing this scale
 * measures, and a finished evacuation leaves the building nearly empty — so
 * without the override the campus would read NORMAL while it is on fire.
 */
export function campusStatusOf(
  buildings: BuildingState[],
  emergency = false,
): CampusStatus {
  if (emergency) return "CRITICAL";
  if (buildings.some((b) => b.status === "critical")) return "CRITICAL";
  const caution = buildings.filter((b) => b.status === "caution").length;
  return caution >= CAMPUS_CAUTION_BUILDING_COUNT ? "CAUTION" : "NORMAL";
}

export function deriveCampusKpi(
  buildings: BuildingState[],
  robots: RobotState[],
  aiActionCount: number,
  /** True while the running scenario is executing a fire-response plan. */
  emergency = false,
): CampusKpi {
  return {
    status: campusStatusOf(buildings, emergency),
    population: buildings.reduce((sum, b) => sum + b.population, 0),
    aiActionsToday: CAMPUS.aiActionsBaseline + aiActionCount,
    activeRobots: robots.filter((r) => !r.charging).length,
    crowdedAreas: buildings.filter((b) => b.crowd >= CROWD_THRESHOLDS.crowded).length,
    energySaving: CAMPUS.energySavingBaseline,
  };
}
