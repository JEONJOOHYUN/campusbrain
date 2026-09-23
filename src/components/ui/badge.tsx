import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "ai"
  | "cyan"
  | "success"
  | "warning"
  | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "border-line bg-white/5 text-muted",
  primary: "border-primary/40 bg-primary/10 text-primary",
  ai: "border-ai/40 bg-ai/10 text-ai",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Mono + tabular numerals, for status codes and readings. */
  mono?: boolean;
}

export function Badge({
  className,
  tone = "neutral",
  mono = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5",
        TONES[tone],
        mono && "tnum tracking-wider",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Honesty label. Every predicted or modelled number on screen wears one of
 * these — CampusBrain is a prototype, not a live building system.
 */
export function SimulatedTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-ai/30 bg-ai/10 px-1.5 py-px",
        "text-[10px] font-medium uppercase tracking-[0.12em] text-ai",
        className,
      )}
    >
      시뮬레이션
    </span>
  );
}
