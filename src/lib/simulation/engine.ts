import { BASELINE_METRICS, BUILDINGS } from "@/data/buildings";
import { ROBOTS } from "@/data/robots";
import { SCENARIOS } from "@/data/scenarios";
import type {
  ActivityLogEntry,
  AiAction,
  AiActionBlueprint,
  AiInsight,
  BuildingId,
  BuildingMetrics,
  BuildingState,
  RobotBase,
  RobotState,
  ScenarioDefinition,
  SimulationScenario,
  SimulationState,
} from "@/types";
import { clamp } from "@/lib/utils";
import { scenarioClock } from "./clock";
import { buildingStatusOf, crowdLevelOf, deriveCampusKpi } from "./kpi";

type MetricKey = keyof BuildingMetrics;

const METRIC_KEYS: MetricKey[] = ["crowd", "energy", "temperature", "airQuality"];

interface TrackPoint {
  t: number;
  v: number;
}

interface TimedLog {
  t: number;
  entry: Omit<ActivityLogEntry, "id" | "time" | "scenario">;
}

interface TimedAction {
  t: number;
  blueprint: AiActionBlueprint;
}

interface TimedRobotPatch {
  t: number;
  patch: { id: string } & Partial<Pick<RobotBase, "task" | "location" | "status">>;
}

interface CompiledScenario {
  tracks: Map<string, TrackPoint[]>;
  logs: TimedLog[];
  actions: TimedAction[];
  robotPatches: TimedRobotPatch[];
}

const cache = new WeakMap<ScenarioDefinition, CompiledScenario>();

/**
 * Flatten a scenario's keyframes into per-metric tracks plus ordered event
 * lists. Pure and cached, so `deriveState` stays cheap enough to run on
 * every animation frame.
 */
function compile(def: ScenarioDefinition): CompiledScenario {
  const cached = cache.get(def);
  if (cached) return cached;

  const tracks = new Map<string, TrackPoint[]>();
  const logs: TimedLog[] = [];
  const actions: TimedAction[] = [];
  const robotPatches: TimedRobotPatch[] = [];

  const frames = [...def.keyframes].sort((a, b) => a.t - b.t);

  for (const frame of frames) {
    if (frame.metrics) {
      for (const [buildingId, metrics] of Object.entries(frame.metrics)) {
        if (!metrics) continue;
        for (const key of METRIC_KEYS) {
          const value = metrics[key];
          if (typeof value !== "number") continue;
          const trackKey = `${buildingId}:${key}`;
          const points = tracks.get(trackKey) ?? [];
          points.push({ t: frame.t, v: value });
          tracks.set(trackKey, points);
        }
      }
    }
    if (frame.log) logs.push({ t: frame.t, entry: frame.log });
    if (frame.action) actions.push({ t: frame.t, blueprint: frame.action });
    if (frame.robot) robotPatches.push({ t: frame.t, patch: frame.robot });
  }

  // A track whose first keyframe is later than t=0 must still start from the
  // building's baseline, otherwise the scenario would begin already changed.
  for (const [trackKey, points] of tracks) {
    if (points[0].t <= 0) continue;
    const [buildingId, metric] = trackKey.split(":") as [BuildingId, MetricKey];
    const baseline = BASELINE_METRICS[buildingId];
    if (!baseline) continue;
    points.unshift({ t: 0, v: baseline[metric] });
  }

  const compiled: CompiledScenario = { tracks, logs, actions, robotPatches };
  cache.set(def, compiled);
  return compiled;
}

/** Linear sample of a track; holds the end values outside its range. */
function sample(points: TrackPoint[] | undefined, t: number, fallback: number): number {
  if (!points || points.length === 0) return fallback;
  if (t <= points[0].t) return points[0].v;

  const last = points[points.length - 1];
  if (t >= last.t) return last.v;

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t;
      if (span === 0) return b.v;
      return a.v + ((t - a.t) / span) * (b.v - a.v);
    }
  }
  return last.v;
}

function roundMetric(key: MetricKey, value: number): number {
  if (key === "temperature") return Math.round(value * 10) / 10;
  if (key === "crowd" || key === "energy") return clamp(Math.round(value), 0, 100);
  return Math.round(value);
}

/**
 * The single source of truth: given a scenario and a playback position,
 * produce everything the UI renders. No component computes its own numbers.
 */
export function deriveState(
  scenario: SimulationScenario,
  elapsed: number,
): SimulationState {
  const definition = SCENARIOS[scenario];
  const compiled = compile(definition);
  const duration = definition.durationSec;
  const t = duration > 0 ? clamp(elapsed, 0, duration) : 0;

  const clockAt = (at: number) =>
    scenarioClock(definition.clockStart, at, definition.timeScale);

  /* --- robots ---------------------------------------------------- */
  const robotById = new Map<string, RobotState>(
    ROBOTS.map((r) => [r.id, { ...r, retasked: false }]),
  );
  for (const { t: at, patch } of compiled.robotPatches) {
    if (at > t) continue;
    const current = robotById.get(patch.id);
    if (!current) continue;
    robotById.set(patch.id, { ...current, ...patch, retasked: true });
  }
  const robots = [...robotById.values()];

  /* --- buildings ------------------------------------------------- */
  const insightBlueprint = definition.insight;
  const insightActive =
    insightBlueprint !== null && t >= insightBlueprint.appearsAt;
  const insightResolved =
    insightActive &&
    insightBlueprint.resolvesAt !== undefined &&
    t >= insightBlueprint.resolvesAt;

  const buildings: BuildingState[] = BUILDINGS.map((base) => {
    const baseline = BASELINE_METRICS[base.id];
    const metrics = {} as BuildingMetrics;
    for (const key of METRIC_KEYS) {
      metrics[key] = roundMetric(
        key,
        sample(compiled.tracks.get(`${base.id}:${key}`), t, baseline[key]),
      );
    }

    // A resolved forecast is history, not something to act on — so it stops
    // being shown as this building's live prediction.
    const predicts =
      insightActive && !insightResolved && insightBlueprint?.buildingId === base.id;

    return {
      ...base,
      ...metrics,
      population: Math.round((base.capacity * metrics.crowd) / 100),
      status: buildingStatusOf(metrics.crowd),
      crowdLevel: crowdLevelOf(metrics.crowd),
      prediction: predicts ? insightBlueprint.prediction : null,
      predictionHorizon: predicts ? insightBlueprint.horizonMin : null,
      robots: robots.filter((r) => r.buildingId === base.id),
    };
  });

  /* --- AI actions ------------------------------------------------ */
  const actions: AiAction[] = compiled.actions
    .filter((a) => a.t <= t)
    .map((a) => ({ ...a.blueprint, at: clockAt(a.t) }));

  /* --- activity log (newest first) ------------------------------- */
  const log: ActivityLogEntry[] = compiled.logs
    .filter((l) => l.t <= t)
    .map((l, index) => ({
      ...l.entry,
      id: `${scenario}-${index}`,
      time: clockAt(l.t),
      scenario,
    }))
    .reverse();

  /* --- AI insight ------------------------------------------------ */
  let insight: AiInsight | null = null;
  if (insightActive && insightBlueprint) {
    const focus = buildings.find((b) => b.id === insightBlueprint.buildingId);
    insight = {
      ...insightBlueprint,
      current: focus?.crowd ?? 0,
      resolved: insightResolved,
      steps: insightBlueprint.steps.map((step) => ({ ...step, done: t >= step.t })),
    };
  }

  const campus = deriveCampusKpi(buildings, robots, actions.length);

  return {
    scenario,
    definition,
    elapsed: t,
    duration,
    progress: duration > 0 ? clamp(t / duration, 0, 1) : 0,
    clock: clockAt(t),
    buildings,
    robots,
    campus,
    insight,
    actions,
    log,
    isComplete: duration > 0 && t >= duration,
  };
}
