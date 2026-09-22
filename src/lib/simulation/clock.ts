const DAY_SECONDS = 24 * 60 * 60;

/** "14:30" -> seconds since midnight. */
export function parseClock(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
}

/** Seconds since midnight -> "14:30", wrapping across midnight. */
export function formatClock(seconds: number): string {
  const wrapped = ((Math.floor(seconds) % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS;
  const h = Math.floor(wrapped / 3600);
  const m = Math.floor((wrapped % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Simulated wall clock for a playback position.
 * Negative `elapsed` reads backwards, which is how backlog log entries get
 * timestamps from before the operator opened the dashboard.
 */
export function scenarioClock(
  clockStart: string,
  elapsed: number,
  timeScale: number,
): string {
  return formatClock(parseClock(clockStart) + elapsed * timeScale);
}

/** Playback seconds -> "MM:SS" of simulated duration. */
export function formatDuration(elapsed: number, timeScale: number): string {
  const total = Math.max(0, Math.round(elapsed * timeScale));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
