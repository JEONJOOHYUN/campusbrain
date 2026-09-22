"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { PlaybackControls } from "@/components/simulation/playback-controls";
import { ScenarioSwitcher } from "@/components/simulation/scenario-switcher";
import { SimulationModeBadge } from "@/components/simulation/simulation-mode-badge";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { statusTone } from "@/components/dashboard/status";
import { cn } from "@/lib/utils";

export function Topbar() {
  const pathname = usePathname();
  const { state } = useSimulation();

  const current =
    [...NAV_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    NAV_ITEMS[0];

  const tone = statusTone(state.campus.status);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-fg">
            {current.label}
          </h1>
          <p className="truncate text-xs text-muted">{state.definition.headline}</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-md border px-2.5 py-1",
            tone.border,
            tone.bg,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-soft", tone.dot)} />
          <span className={cn("tnum text-[11px] font-semibold tracking-wider", tone.text)}>
            {state.campus.status}
          </span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <SimulationModeBadge />
          <ScenarioSwitcher />
          <PlaybackControls />
        </div>
      </div>
    </header>
  );
}
