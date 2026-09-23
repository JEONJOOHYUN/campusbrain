"use client";

import { SCENARIOS, SCENARIO_ORDER } from "@/data/scenarios";
import { useSimulation } from "@/components/simulation/simulation-provider";
import { cn } from "@/lib/utils";

export function ScenarioSwitcher() {
  const { state, setScenario } = useSimulation();

  return (
    <div
      role="group"
      aria-label="시뮬레이션 시나리오"
      className="flex items-center gap-0.5 rounded-lg border border-line bg-card p-0.5"
    >
      {SCENARIO_ORDER.map((id) => {
        const def = SCENARIOS[id];
        const active = state.scenario === id;
        return (
          <button
            key={id}
            type="button"
            disabled={!def.available}
            aria-pressed={active}
            title={def.available ? def.headline : "준비 중"}
            onClick={() => setScenario(id)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted hover:text-fg enabled:hover:bg-white/5",
              !def.available && "cursor-not-allowed opacity-40",
            )}
          >
            {def.label}
          </button>
        );
      })}
    </div>
  );
}
