/** Campus-wide constants the KPI layer builds on. */
export const CAMPUS = {
  name: "CampusBrain University",
  /** AI actions already executed earlier today, before this session started. */
  aiActionsBaseline: 47,
  /** Estimated energy saved vs. the un-optimised baseline, in percent. */
  energySavingBaseline: 18.4,
} as const;

/**
 * Crowd thresholds. One place, so the map colour, the status badge, the KPI
 * count and the log severity can never disagree with each other.
 */
export const CROWD_THRESHOLDS = {
  /** >= moderate — counted as a "Crowded Area" in the KPI row. */
  crowded: 60,
  /** >= high — building status becomes CAUTION. */
  caution: 70,
  /** >= critical — building status becomes CRITICAL. */
  critical: 85,
  /** < moderate — crowd level LOW. */
  moderate: 40,
} as const;

/**
 * Campus status goes CAUTION only once the congestion is spread out; a single
 * busy building is normal for a campus at 14:30.
 */
export const CAMPUS_CAUTION_BUILDING_COUNT = 3;

/**
 * How far back a crowd trend looks, in *simulated* minutes. The engine
 * converts it with the scenario's timeScale, so the arrow always means the
 * same thing on the wall clock no matter how fast playback runs.
 */
export const CROWD_TREND_LOOKBACK_MIN = 2;
