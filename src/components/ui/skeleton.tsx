import { cn } from "@/lib/utils";

/**
 * Placeholder block for content that has not arrived yet. It pulses with the
 * same rhythm as the live status dots, so a loading dashboard still reads as
 * the same system rather than a different screen.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse-soft rounded-md bg-white/8", className)}
    />
  );
}
