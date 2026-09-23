"use client";

import { IconPause, IconPlay, IconReset } from "@/components/icons";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { formatDuration } from "@/lib/simulation/clock";
import { cn } from "@/lib/utils";

export function PlaybackControls({ className }: { className?: string }) {
  const { state, isPlaying, toggle, reset } = useSimulation();
  const { definition, elapsed, duration, progress, clock } = state;
  const disabled = duration <= 0;

  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={isPlaying ? "시뮬레이션 일시정지" : "시뮬레이션 재생"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
            isPlaying
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-line bg-card text-muted hover:text-fg",
            disabled && "cursor-not-allowed opacity-40",
          )}
        >
          {isPlaying ? (
            <IconPause width={14} height={14} />
          ) : (
            <IconPlay width={14} height={14} />
          )}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={disabled || elapsed === 0}
          aria-label="시뮬레이션 리셋"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-card text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconReset width={14} height={14} />
        </button>
      </div>

      <div className="hidden w-40 lg:block">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="tnum flex items-baseline gap-2 text-xs">
        <span className="font-semibold text-fg">{clock}</span>
        <span className="hidden text-muted sm:inline">
          {formatDuration(elapsed, definition.timeScale)} /{" "}
          {formatDuration(duration, definition.timeScale)}
        </span>
      </div>
    </div>
  );
}
