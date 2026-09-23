import { BUILDING_BY_ID } from "@/data/buildings";
import { scenarioClock } from "./clock";
import type {
  AiActionBlueprint,
  BuildingId,
  SafeFlowFire,
  SafeFlowPhase,
  SafeFlowPhaseId,
  SafeFlowRoute,
  SimulationState,
} from "@/types";

/* ------------------------------------------------------------------ *
 * SafeFlow is derived, never typed in: the plan says what the campus
 * does about a fire, the scenario timeline says when, and this turns
 * the two into "where is the run right now". Numbers only — the wording
 * is the UI's job, same as `report.ts` and `energy.ts`.
 * ------------------------------------------------------------------ */

export interface SafeFlowPhaseState extends SafeFlowPhase {
  /** 1-based position, so a card can show "3 / 6" without counting. */
  step: number;
  done: boolean;
  /** The step running right now: the first one not yet done. */
  active: boolean;
  /** Simulated clock at which it completed. Null until then. */
  at: string | null;
}

/** A planned physical action, whether or not it has fired yet. */
export interface SafeFlowAction extends AiActionBlueprint {
  /** Playback second at which it fires. */
  t: number;
  fired: boolean;
  /** Simulated clock at which it fired. Null until then. */
  at: string | null;
}

export interface SafeFlowOutcome {
  /** People moved off the high-risk routes and onto the safe ones. */
  redirected: number;
  avoidedRoutes: number;
  /** Evacuation time cut, in percent. */
  improvementPct: number;
  baselineSec: number;
  safeflowSec: number;
}

export interface SafeFlowSnapshot {
  fire: SafeFlowFire & { buildingName: string };
  phases: SafeFlowPhaseState[];
  /** Phases completed, and how many there are in total. */
  completed: number;
  total: number;
  /** True once playback has moved past the detection moment. */
  started: boolean;
  /** True once the last phase is done. */
  activated: boolean;
  /** Which phases the run has passed, for the map layers to switch on. */
  reached: Record<SafeFlowPhaseId, boolean>;
  safeRoutes: SafeFlowRoute[];
  blockedRoutes: SafeFlowRoute[];
  actions: SafeFlowAction[];
  /** People still inside the burning building, read from the engine. */
  occupants: number;
  outcome: SafeFlowOutcome;
}

function sumPeople(routes: SafeFlowRoute[]): number {
  return routes.reduce((total, route) => total + route.people, 0);
}

/**
 * Where a SafeFlow run stands at the current playback position. Returns
 * null for scenarios that carry no fire-response plan, so a quiet campus
 * can never render an evacuation.
 */
export function deriveSafeFlow(state: SimulationState): SafeFlowSnapshot | null {
  const plan = state.definition.safeflow;
  if (!plan) return null;

  const t = state.elapsed;
  const clockAt = (at: number) =>
    scenarioClock(state.definition.clockStart, at, state.definition.timeScale);

  const doneCount = plan.phases.filter((phase) => t >= phase.t).length;

  const phases: SafeFlowPhaseState[] = plan.phases.map((phase, index) => {
    const done = t >= phase.t;
    return {
      ...phase,
      step: index + 1,
      done,
      active: !done && index === doneCount,
      at: done ? clockAt(phase.t) : null,
    };
  });

  const reached = Object.fromEntries(
    plan.phases.map((phase) => [phase.id, t >= phase.t]),
  ) as Record<SafeFlowPhaseId, boolean>;

  // The planned actions are read straight off the timeline, so the card can
  // show all five from the start and tick them off as the run fires them.
  const actions: SafeFlowAction[] = state.definition.keyframes
    .filter((frame) => frame.action)
    .sort((a, b) => a.t - b.t)
    .map((frame) => {
      const fired = t >= frame.t;
      return {
        ...(frame.action as AiActionBlueprint),
        t: frame.t,
        fired,
        at: fired ? clockAt(frame.t) : null,
      };
    });

  const safeRoutes = plan.routes.filter((route) => route.kind === "safe");
  const blockedRoutes = plan.routes.filter((route) => route.kind === "blocked");

  const fireBuildingId: BuildingId = plan.fire.buildingId;
  const { baselineSec, safeflowSec } = plan.evacuation;

  return {
    fire: { ...plan.fire, buildingName: BUILDING_BY_ID[fireBuildingId].name },
    phases,
    completed: doneCount,
    total: plan.phases.length,
    started: t > 0,
    activated: doneCount === plan.phases.length,
    reached,
    safeRoutes,
    blockedRoutes,
    actions,
    occupants:
      state.buildings.find((b) => b.id === fireBuildingId)?.population ?? 0,
    outcome: {
      // The two sides of the plan balance, so either one is the number of
      // people the AI actually moved. Counting the blocked routes says it
      // the way the operator saw it happen.
      redirected: sumPeople(blockedRoutes),
      avoidedRoutes: blockedRoutes.length,
      improvementPct: Math.round(((baselineSec - safeflowSec) / baselineSec) * 100),
      baselineSec,
      safeflowSec,
    },
  };
}
