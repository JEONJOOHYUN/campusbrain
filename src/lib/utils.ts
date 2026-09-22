export type ClassValue = string | false | null | undefined;

/** Minimal class joiner — no runtime dependency needed at this size. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Locale-stable thousands separator so server and client markup agree. */
export function formatCount(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
