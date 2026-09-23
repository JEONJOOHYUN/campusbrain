import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Shared furniture for the landing narrative.
 *
 * Every section is a full-width band with the same rhythm: a numbered
 * eyebrow, one large statement, then the evidence. The spec asks for big
 * typography over paragraphs, so the shell keeps the prose slot narrow on
 * purpose — there is nowhere to put an essay.
 * ------------------------------------------------------------------ */

export function LandingSection({
  id,
  index,
  stage,
  code,
  title,
  lead,
  tone = "text-primary",
  band = false,
  children,
  className,
}: {
  id: string;
  /** Position in the narrative, rendered as 01–08. */
  index: number;
  /** Korean stage name — the thing the AI is doing here. */
  stage: string;
  /** The pipeline's own vocabulary, kept in the spec's English. */
  code: string;
  title: ReactNode;
  lead?: string;
  tone?: string;
  /** Alternating background, so the sections separate while scrolling. */
  band?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 border-t border-line",
        band && "bg-surface/40",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="reveal">
          <div className="flex items-center gap-3">
            <span className="tnum text-xs font-medium tracking-[0.2em] text-muted/50">
              {String(index).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-line" aria-hidden />
            <span className={cn("text-sm font-semibold tracking-tight", tone)}>
              {stage}
            </span>
            <span className="tnum text-[10px] font-medium uppercase tracking-[0.18em] text-muted/50">
              {code}
            </span>
          </div>

          <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h2>

          {lead && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{lead}</p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

/**
 * Staggers a reveal against its siblings. The shell shifts where in the
 * viewport the animation finishes rather than delaying it, because a delay
 * on a scroll-driven timeline fights the scroll position.
 */
export function revealStep(step: number) {
  return { "--reveal-step": step } as React.CSSProperties;
}

/** A single large figure with its label — the landing's unit of evidence. */
export function Figure({
  value,
  unit,
  label,
  detail,
  tone = "text-fg",
  className,
  style,
}: {
  value: string | number;
  unit?: string;
  label: string;
  detail?: string;
  tone?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={cn("reveal", className)} style={style}>
      <div className="flex items-baseline gap-1">
        <span className={cn("tnum text-5xl font-bold tracking-tight sm:text-6xl", tone)}>
          {value}
        </span>
        {unit && <span className="text-lg font-medium text-muted">{unit}</span>}
      </div>
      <div className="mt-3 text-sm font-semibold tracking-tight text-fg">{label}</div>
      {detail && <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>}
    </div>
  );
}
