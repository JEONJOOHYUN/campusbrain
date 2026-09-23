/* ------------------------------------------------------------------ *
 * CampusBrain — shared domain types
 * Every screen reads these; nothing renders a number it invented.
 * ------------------------------------------------------------------ */

export type SimulationScenario = "normal" | "crowd" | "event" | "emergency";

export type BuildingId =
  | "main"
  | "engineering"
  | "student-center"
  | "library"
  | "gymnasium"
  | "parking";

export type BuildingStatus = "normal" | "caution" | "critical";
export type CrowdLevel = "low" | "moderate" | "high" | "critical";

/* --- Buildings ---------------------------------------------------- */

/** Isometric footprint drawn by the Digital Twin SVG. */
export interface BuildingShape {
  /** Centre of the ground tile, in SVG user units. */
  x: number;
  y: number;
  /** Half-width / half-depth of the ground tile. */
  w: number;
  d: number;
  /** Extruded height in SVG units. */
  h: number;
}

export interface BuildingBase {
  id: BuildingId;
  name: string;
  /** Sensor-network identifier, shown in mono. */
  code: string;
  floors: number;
  /** Design occupancy — population is derived from capacity x crowd. */
  capacity: number;
  sensors: number;
  shape: BuildingShape;
}

export interface BuildingMetrics {
  /** 0-100 */
  crowd: number;
  /** 0-100 */
  energy: number;
  /** degrees Celsius */
  temperature: number;
  /** air quality index, lower is better */
  airQuality: number;
}

export interface BuildingState extends BuildingBase, BuildingMetrics {
  population: number;
  status: BuildingStatus;
  crowdLevel: CrowdLevel;
  /**
   * Crowd change over the trend lookback window, in percentage points.
   * Positive means filling up. Zero at the start of a run.
   */
  crowdTrend: number;
  /** Crowd forecast from the active AI insight, or null when none applies. */
  prediction: number | null;
  /** Minutes ahead the prediction looks. */
  predictionHorizon: number | null;
  robots: RobotState[];
}

/* --- Robots ------------------------------------------------------- */

export type RobotKind = "cleaning" | "guide" | "delivery" | "security";

export interface RobotBase {
  id: string;
  name: string;
  kind: RobotKind;
  buildingId: BuildingId;
  battery: number;
  location: string;
  status: string;
  task: string;
  /** Docked robots do not count towards Active Robots. */
  charging?: boolean;
}

export interface RobotState extends RobotBase {
  /** True while the active scenario has re-tasked this robot. */
  retasked: boolean;
}

/* --- Signage ------------------------------------------------------ */

export type SignageKind =
  | "welcome"
  | "event"
  | "wayfinding"
  | "alert"
  | "evacuation";

/** What a display is showing. The UI renders this as the sign itself. */
export interface SignageMessage {
  kind: SignageKind;
  headline: string;
  sub?: string;
  /** Direction arrow drawn beside the text, for wayfinding messages. */
  arrow?: "left" | "right" | "up" | "down";
}

export interface SignageBase {
  id: string;
  name: string;
  buildingId: BuildingId;
  location: string;
  /** Offline displays keep their last message and are shown dimmed. */
  online: boolean;
  /** What the display shows until the AI overrides it. */
  baseMessage: SignageMessage;
}

export interface SignageState extends SignageBase {
  message: SignageMessage;
  /** True while the AI is showing something other than `baseMessage`. */
  overridden: boolean;
  /** Simulated clock of the override, e.g. "14:33". Null while baseline. */
  changedAt: string | null;
  /** Which AI decision caused the change. Null while baseline. */
  changeReason: string | null;
}

/* --- AI insight --------------------------------------------------- */

export type ActivityStage = "observe" | "predict" | "decide" | "act";

export interface AiInsightStep {
  stage: ActivityStage;
  label: string;
  detail: string;
  /** Playback second at which this step completes. */
  t: number;
  done: boolean;
}

export interface AiInsightBlueprint {
  id: string;
  buildingId: BuildingId;
  title: string;
  summary: string;
  /** Forecast value the AI settles on, e.g. 91 (%). */
  prediction: number;
  horizonMin: number;
  confidence: number;
  recommendation: string;
  severity: ActivitySeverity;
  /** Playback second at which the insight card appears. */
  appearsAt: number;
  /**
   * Playback second at which the forecast stops being forward-looking: the AI
   * response has worked, so `prediction` becomes the peak that was reached
   * rather than a number the operator should still act on.
   */
  resolvesAt?: number;
  /** Shown once resolved, e.g. "Peak 91% contained — stabilised at 68%". */
  resolution?: string;
  steps: Omit<AiInsightStep, "done">[];
}

export interface AiInsight extends Omit<AiInsightBlueprint, "steps"> {
  /** Live value read from the building, never hard-coded in the UI. */
  current: number;
  resolved: boolean;
  steps: AiInsightStep[];
}

/* --- AI actions --------------------------------------------------- */

export type AiActionKind =
  | "signage"
  | "elevator"
  | "robot"
  | "door"
  | "hvac"
  | "broadcast";

export interface AiActionBlueprint {
  id: string;
  kind: AiActionKind;
  buildingId: BuildingId;
  label: string;
  detail: string;
}

export interface AiAction extends AiActionBlueprint {
  /** Simulated clock at which the action fired, e.g. "14:33". */
  at: string;
}

/* --- SafeFlow (emergency) ----------------------------------------- */

/** The six steps of a SafeFlow run, in order. */
export type SafeFlowPhaseId =
  | "detect"
  | "risk"
  | "crowd"
  | "route"
  | "coordinate"
  | "activate";

export interface SafeFlowPhase {
  id: SafeFlowPhaseId;
  label: string;
  detail: string;
  /** Playback second at which this step completes. */
  t: number;
}

/** Where the fire is, as the detectors report it. */
export interface SafeFlowFire {
  buildingId: BuildingId;
  /** Floor and wing, e.g. "3층 동편". */
  floor: string;
  /** The area the AI marks as unsafe. */
  zone: string;
  /** How it was detected. */
  detail: string;
}

export type SafeFlowRouteKind = "safe" | "blocked";

export interface SafeFlowRoute {
  id: string;
  kind: SafeFlowRouteKind;
  label: string;
  detail: string;
  /**
   * People the AI moved onto this route (safe) or off it (blocked). The two
   * sides balance: everyone taken off a blocked route is put on a safe one.
   */
  people: number;
  /** Waypoints in the Digital Twin's 960 x 560 SVG space. */
  points: [number, number][];
}

export interface SafeFlowPlan {
  fire: SafeFlowFire;
  phases: SafeFlowPhase[];
  routes: SafeFlowRoute[];
  /** Evacuation times the improvement is measured between, in seconds. */
  evacuation: { baselineSec: number; safeflowSec: number };
}

/* --- Activity log ------------------------------------------------- */

export type ActivityCategory =
  | "crowd"
  | "energy"
  | "robot"
  | "signage"
  | "emergency";

export type ActivitySeverity = "info" | "warning" | "critical";

export interface ActivityLogEntry {
  id: string;
  /** Simulated clock, e.g. "14:32". */
  time: string;
  scenario: SimulationScenario;
  category: ActivityCategory;
  stage: ActivityStage;
  severity: ActivitySeverity;
  title: string;
  location?: string;
  target?: string;
}

/* --- Campus KPI --------------------------------------------------- */

export type CampusStatus = "NORMAL" | "CAUTION" | "CRITICAL";

export interface CampusKpi {
  status: CampusStatus;
  population: number;
  aiActionsToday: number;
  activeRobots: number;
  crowdedAreas: number;
  energySaving: number;
}

/* --- Scenario definition ------------------------------------------ */

export interface ScenarioKeyframe {
  /** Playback second. */
  t: number;
  /** Metric targets; values between keyframes are interpolated. */
  metrics?: Partial<Record<BuildingId, Partial<BuildingMetrics>>>;
  /** An AI action that becomes active at this moment. */
  action?: AiActionBlueprint;
  /** A robot re-tasking that takes effect at this moment. */
  robot?: { id: string } & Partial<
    Pick<RobotBase, "task" | "location" | "status" | "buildingId">
  >;
  /** A signage push that takes effect at this moment. */
  signage?: {
    ids: string[];
    message: SignageMessage;
    /** Why the AI changed it — shown next to the change time. */
    reason: string;
  };
  /** An activity log entry emitted at this moment. */
  log?: Omit<ActivityLogEntry, "id" | "time" | "scenario">;
}

export interface ScenarioDefinition {
  id: SimulationScenario;
  label: string;
  headline: string;
  description: string;
  /** Playback length in real seconds. */
  durationSec: number;
  /** Simulated seconds elapsed per real second of playback. */
  timeScale: number;
  /** Simulated wall clock at t=0, "HH:MM". */
  clockStart: string;
  focusBuildingId: BuildingId | null;
  /**
   * Where the inbound crowd is coming from, drawn on the Digital Twin as a
   * flow arrow towards the insight's building. Null draws no flow.
   */
  flowFromBuildingId: BuildingId | null;
  insight: AiInsightBlueprint | null;
  /** Fire-response plan this scenario executes. Null outside an emergency run. */
  safeflow: SafeFlowPlan | null;
  keyframes: ScenarioKeyframe[];
  /** False while the scenario is still a stub. */
  available: boolean;
}

/* --- Derived simulation state ------------------------------------- */

export interface SimulationState {
  scenario: SimulationScenario;
  definition: ScenarioDefinition;
  /** Playback seconds elapsed. */
  elapsed: number;
  duration: number;
  /** 0-1 */
  progress: number;
  clock: string;
  buildings: BuildingState[];
  robots: RobotState[];
  signage: SignageState[];
  campus: CampusKpi;
  insight: AiInsight | null;
  actions: AiAction[];
  log: ActivityLogEntry[];
  isComplete: boolean;
}
