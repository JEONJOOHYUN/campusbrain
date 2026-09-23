import { cn } from "@/lib/utils";

/**
 * "Nothing here, and that is fine" — used wherever the simulation genuinely
 * has no rows yet: no AI activity logged, no robot stationed in a building,
 * no log matching a filter. One component so those never drift apart.
 */
export function EmptyState({
  icon,
  title,
  description,
  size = "md",
  className,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** `sm` is a single bordered row, for use inside a list. */
  size?: "sm" | "md";
  className?: string;
  /** Optional action, e.g. a button that runs a scenario. */
  children?: React.ReactNode;
}) {
  if (size === "sm") {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border border-line bg-card/60 px-3 py-3",
          className,
        )}
      >
        {icon && <span className="shrink-0 text-muted/70">{icon}</span>}
        <div className="min-w-0">
          <p className="text-xs text-muted">{title}</p>
          {description && (
            <p className="mt-0.5 text-[11px] text-muted/70">{description}</p>
          )}
        </div>
        {children && <div className="ml-auto shrink-0">{children}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      {icon && (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white/5 text-muted/70">
          {icon}
        </span>
      )}
      <p className="text-sm font-medium text-fg">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
