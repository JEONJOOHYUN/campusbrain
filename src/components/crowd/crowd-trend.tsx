"use client";

import { cn } from "@/lib/utils";

/**
 * Crowd movement over the trend window, in percentage points — the engine
 * measures the same wall-clock distance in every scenario, so the arrow
 * means the same thing no matter how fast playback runs. The window itself
 * is stated once per screen rather than on every row.
 */
export function CrowdTrend({
  value,
  className,
}: {
  /** Percentage points, positive while filling up. */
  value: number;
  className?: string;
}) {
  const rising = value > 0;
  const falling = value < 0;

  return (
    <span
      className={cn(
        "tnum text-xs font-semibold",
        rising && "text-warning",
        falling && "text-success",
        !rising && !falling && "text-muted",
        className,
      )}
    >
      {rising ? "↑" : falling ? "↓" : "→"} {Math.abs(value)}%p
    </span>
  );
}
