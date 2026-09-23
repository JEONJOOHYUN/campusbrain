import { BASELINE_METRICS, BUILDING_BY_ID } from "@/data/buildings";
import type {
  AiActionKind,
  BuildingId,
  ScenarioDefinition,
  SimulationScenario,
  SimulationState,
} from "@/types";

/* ------------------------------------------------------------------ *
 * The summary card a finished scenario run produces. Every field is
 * computed from the scenario timeline, so a report can never disagree
 * with the run the operator just watched. Numbers only — wording is the
 * UI's job, same as everywhere else.
 * ------------------------------------------------------------------ */

export interface ScenarioReport {
  scenario: SimulationScenario;
  label: string;
  headline: string;
  focusBuildingId: BuildingId | null;
  focusBuildingName: string | null;
  /** Focus-building crowd at t=0, the peak reached, and the final value. */
  start: number | null;
  peak: number | null;
  final: number | null;
  /** The forecast that triggered the response, when the scenario had one. */
  predicted: number | null;
  confidence: number | null;
  actionCount: number;
  /** Executed actions grouped by kind, in the order they first fired. */
  actionBreakdown: { kind: AiActionKind; count: number }[];
  logCount: number;
  /** Simulated seconds the run covered, e.g. 600 for ten simulated minutes. */
  durationSimSec: number;
}

/**
 * Highest value a metric track reaches during a run.
 *
 * Values between keyframes are interpolated linearly, so the extremes of
 * the curve are always keyframe values — scanning the keyframes is exact,
 * and far cheaper than sampling the engine second by second.
 */
function crowdRange(
  def: ScenarioDefinition,
  buildingId: BuildingId,
): { start: number; peak: number; final: number } | null {
  const baseline = BASELINE_METRICS[buildingId];
  if (!baseline) return null;

  const points = def.keyframes
    .filter((frame) => typeof frame.metrics?.[buildingId]?.crowd === "number")
    .map((frame) => ({
      t: frame.t,
      v: frame.metrics![buildingId]!.crowd as number,
    }))
    .sort((a, b) => a.t - b.t);

  // Mirrors the engine: a track that only starts later still begins from
  // the building's baseline at t=0.
  if (points.length === 0 || points[0].t > 0) {
    points.unshift({ t: 0, v: baseline.crowd });
  }

  const values = points.map((p) => p.v);
  return {
    start: values[0],
    peak: Math.max(...values),
    final: values[values.length - 1],
  };
}

/**
 * Build the report for a run. Returns null for scenarios that have no
 * timeline yet, so a stub can never produce a summary of nothing.
 */
export function buildScenarioReport(state: SimulationState): ScenarioReport | null {
  const def = state.definition;
  if (def.durationSec <= 0) return null;

  const focusId = def.focusBuildingId;
  const range = focusId ? crowdRange(def, focusId) : null;

  const counts = new Map<AiActionKind, number>();
  for (const action of state.actions) {
    counts.set(action.kind, (counts.get(action.kind) ?? 0) + 1);
  }

  return {
    scenario: state.scenario,
    label: def.label,
    headline: def.headline,
    focusBuildingId: focusId,
    focusBuildingName: focusId ? BUILDING_BY_ID[focusId].name : null,
    start: range?.start ?? null,
    peak: range?.peak ?? null,
    final: range?.final ?? null,
    predicted: def.insight?.prediction ?? null,
    confidence: def.insight?.confidence ?? null,
    actionCount: state.actions.length,
    actionBreakdown: [...counts.entries()].map(([kind, count]) => ({ kind, count })),
    logCount: state.log.length,
    durationSimSec: def.durationSec * def.timeScale,
  };
}

/** "10:00" from 600 simulated seconds. */
export function formatSimDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
