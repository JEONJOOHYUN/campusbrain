"use client";

import { IconArrowRight } from "@/components/icons";
import { signageTone } from "@/components/dashboard/status";
import type { SignageMessage } from "@/types";
import { cn } from "@/lib/utils";

/** The arrow is content on the sign, so it points where the message says. */
const ARROW_ROTATION: Record<NonNullable<SignageMessage["arrow"]>, string> = {
  right: "rotate-0",
  left: "rotate-180",
  up: "-rotate-90",
  down: "rotate-90",
};

/**
 * A mock of the physical display — what a person standing in front of it
 * would read. Dimmed and labelled when the panel is offline, because an
 * offline sign still holds its last message but renders nothing.
 */
export function SignageScreen({
  message,
  online,
  className,
}: {
  message: SignageMessage;
  online: boolean;
  className?: string;
}) {
  const tone = signageTone(message.kind);

  return (
    <div
      className={cn(
        "relative aspect-[16/9] overflow-hidden rounded-lg border bg-background",
        online ? tone.border : "border-line",
        className,
      )}
    >
      {/* Colour wash keyed to the message kind, so a change is visible from
          across the room before any text is read. */}
      <div
        className={cn("absolute inset-0", online ? tone.bg : "bg-white/2")}
        aria-hidden
      />
      <div
        className={cn("absolute inset-x-0 top-0 h-0.5", online ? tone.dot : "bg-line")}
        aria-hidden
      />

      <div
        className={cn(
          "relative flex h-full items-center gap-3 px-4",
          !online && "opacity-25",
        )}
      >
        {message.arrow && (
          <IconArrowRight
            width={34}
            height={34}
            strokeWidth={2}
            className={cn(
              "shrink-0 transition-transform",
              online ? tone.text : "text-muted",
              ARROW_ROTATION[message.arrow],
            )}
          />
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-bold leading-snug",
              online ? "text-fg" : "text-muted",
            )}
          >
            {message.headline}
          </p>
          {message.sub && (
            <p className="mt-1 text-[11px] leading-snug text-muted">{message.sub}</p>
          )}
        </div>
      </div>

      {!online && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="tnum rounded-md border border-line bg-background/90 px-2 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted">
            화면 꺼짐
          </span>
        </div>
      )}
    </div>
  );
}
