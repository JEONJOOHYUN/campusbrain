"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_SCENARIO, SCENARIOS, isSimulationScenario } from "@/data/scenarios";
import { deriveState } from "@/lib/simulation/engine";
import type { BuildingId, SimulationScenario, SimulationState } from "@/types";

/** Playback updates per second. Smooth enough for count-ups, cheap enough to run. */
const TICK_MS = 50;

interface SimulationContextValue {
  state: SimulationState;
  isPlaying: boolean;
  selectedBuildingId: BuildingId | null;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  setScenario: (scenario: SimulationScenario) => void;
  /** Switch scenario, rewind and start playing — used by [Simulate ...] buttons. */
  runScenario: (scenario: SimulationScenario) => void;
  selectBuilding: (id: BuildingId | null) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

function resolveScenario(raw: string | null): SimulationScenario {
  if (isSimulationScenario(raw) && SCENARIOS[raw].available) return raw;
  return DEFAULT_SCENARIO;
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* The URL is the source of truth for the scenario, so a reload mid-demo
     restores exactly what was on screen. */
  const scenario = resolveScenario(searchParams.get("scenario"));
  const duration = SCENARIOS[scenario].durationSec;

  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<BuildingId | null>(null);

  /** Set by runScenario so the rewind below starts playing instead of pausing. */
  const [pendingAutoPlay, setPendingAutoPlay] = useState(false);

  /* Rewind whenever the scenario changes — including via back/forward. This is
     the "adjust state during render" pattern, which avoids a sync effect. */
  const [renderedScenario, setRenderedScenario] = useState(scenario);
  if (renderedScenario !== scenario) {
    setRenderedScenario(scenario);
    setElapsed(0);
    setIsPlaying(pendingAutoPlay && duration > 0);
    setPendingAutoPlay(false);
  }

  /* The interval below needs the current position without re-subscribing on
     every tick, so it reads this mirror instead of `elapsed`. */
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  /* Playback loop. */
  useEffect(() => {
    if (!isPlaying || duration <= 0) return;
    // Measure from where playback resumed rather than accumulating per tick,
    // so the run always lands exactly on `duration`.
    const base = elapsedRef.current;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const next = Math.min(duration, base + (Date.now() - startedAt) / 1000);
      setElapsed(next);
      if (next >= duration) setIsPlaying(false);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, duration]);

  const pushScenarioToUrl = useCallback(
    (next: SimulationScenario) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("scenario", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const rewind = useCallback((playing: boolean) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setIsPlaying(playing);
  }, []);

  const setScenario = useCallback(
    (next: SimulationScenario) => {
      if (!SCENARIOS[next].available) return;
      if (next === scenario) {
        rewind(false);
        return;
      }
      setPendingAutoPlay(false);
      pushScenarioToUrl(next);
    },
    [scenario, rewind, pushScenarioToUrl],
  );

  const runScenario = useCallback(
    (next: SimulationScenario) => {
      if (!SCENARIOS[next].available) return;
      if (next === scenario) {
        rewind(SCENARIOS[next].durationSec > 0);
        return;
      }
      setPendingAutoPlay(true);
      pushScenarioToUrl(next);
    },
    [scenario, rewind, pushScenarioToUrl],
  );

  const play = useCallback(() => {
    if (duration <= 0) return;
    if (elapsedRef.current >= duration) {
      elapsedRef.current = 0;
      setElapsed(0);
    }
    setIsPlaying(true);
  }, [duration]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    if (duration <= 0) return;
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (elapsedRef.current >= duration) {
      elapsedRef.current = 0;
      setElapsed(0);
    }
    setIsPlaying(true);
  }, [duration, isPlaying]);

  const reset = useCallback(() => rewind(false), [rewind]);

  const state = useMemo(() => deriveState(scenario, elapsed), [scenario, elapsed]);

  const value = useMemo<SimulationContextValue>(
    () => ({
      state,
      isPlaying,
      selectedBuildingId,
      play,
      pause,
      toggle,
      reset,
      setScenario,
      runScenario,
      selectBuilding: setSelectedBuildingId,
    }),
    [
      state,
      isPlaying,
      selectedBuildingId,
      play,
      pause,
      toggle,
      reset,
      setScenario,
      runScenario,
    ],
  );

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used inside <SimulationProvider>");
  return ctx;
}
