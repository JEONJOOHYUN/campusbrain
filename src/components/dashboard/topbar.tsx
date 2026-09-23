"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBrain } from "@/components/icons";
import { MobileNav } from "@/components/dashboard/mobile-nav";
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-4 py-3 sm:px-6">
        {/* The sidebar carries the brand on wide screens; below lg this is
            the only way back to the landing page. */}
        <Link
          href="/"
          aria-label="CampusBrain 홈"
          className="shrink-0 text-primary transition-colors hover:text-fg lg:hidden"
        >
          <IconBrain width={20} height={20} />
        </Link>

        <div className="min-w-0 flex-1 lg:flex-none">
          <h1 className="truncate text-base font-bold tracking-tight text-fg">
            {current.label}
          </h1>
          {/* The switcher below already names the scenario on a phone. */}
          <p className="hidden truncate text-xs text-muted sm:block">
            {state.definition.headline}
          </p>
        </div>

        <SimulationModeBadge />

        <div
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1",
            tone.border,
            tone.bg,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-soft", tone.dot)} />
          <span className={cn("tnum text-[11px] font-semibold tracking-wider", tone.text)}>
            {state.campus.status}
          </span>
        </div>

        {/* Own row below lg: the badge, the switcher and the transport will
            not share a line with the page title on a phone. */}
        <div className="flex w-full items-center gap-x-3 lg:ml-auto lg:w-auto">
          <ScenarioSwitcher />
          <PlaybackControls className="ml-auto lg:ml-0" />
        </div>
      </div>

      <MobileNav />
    </header>
  );
}
