import { cn } from "@/lib/utils";

interface ProgressProps {
  /** 0-100 */
  value: number;
  className?: string;
  /** CSS colour for the filled track; defaults to the primary blue. */
  indicatorColor?: string;
  label?: string;
}

export function Progress({ value, className, indicatorColor, label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/8", className)}
    >
      <div
        className="h-full rounded-full transition-[width] duration-200 ease-out"
        style={{
          width: `${pct}%`,
          backgroundColor: indicatorColor ?? "var(--color-primary)",
        }}
      />
    </div>
  );
}
