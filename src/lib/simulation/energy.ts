import {
  BUILDING_POWER_KW,
  ENERGY_ACTIONS,
  ENERGY_AUTO_CONTROL_TODAY,
  ENERGY_MIX,
  type EnergySystem,
} from "@/data/energy";
import type { BuildingId, SimulationState } from "@/types";

/* ------------------------------------------------------------------ *
 * Energy is derived, never typed in: a building's live draw is its
 * rated peak x the `energy` metric the engine produced, so this page
 * moves with every scenario like the rest of the dashboard. Numbers
 * only — the wording is the UI's job, same as `report.ts`.
 * ------------------------------------------------------------------ */

export interface BuildingEnergy {
  id: BuildingId;
  name: string;
  code: string;
  /** Rated peak draw, kW. */
  ratedKw: number;
  /** Live draw, kW. */
  drawKw: number;
  /** The engine's energy metric, 0-100. */
  load: number;
  /** Share of the campus total, 0-100. */
  share: number;
}

export interface SystemEnergy {
  system: EnergySystem;
  /** Share of every building's draw, 0-100. */
  share: number;
  drawKw: number;
}

export interface EnergySnapshot {
  /** Campus draw right now, kW. */
  totalKw: number;
  /** Campus draw with every building at its rated peak, kW. */
  ratedKw: number;
  /** totalKw as a percentage of ratedKw. */
  loadPct: number;
  buildings: BuildingEnergy[];
  systems: SystemEnergy[];
  /** Estimated saving against the un-optimised baseline, percent. */
  savingPct: number;
  /** kWh saved by the auto-control actions the page lists. */
  sampleSavingKwh: number;
  /** Auto-control actions executed today, of which those are a sample. */
  autoControlToday: number;
}

const SYSTEMS = Object.keys(ENERGY_MIX) as EnergySystem[];

export function deriveEnergy(state: SimulationState): EnergySnapshot {
  const buildings: BuildingEnergy[] = state.buildings.map((b) => ({
    id: b.id,
    name: b.name,
    code: b.code,
    ratedKw: BUILDING_POWER_KW[b.id],
    // Rounded per building, and the total is the sum of those, so an
    // operator adding up the rows lands exactly on the headline figure.
    drawKw: Math.round((BUILDING_POWER_KW[b.id] * b.energy) / 100),
    load: b.energy,
    share: 0,
  }));

  const totalKw = buildings.reduce((sum, b) => sum + b.drawKw, 0);
  const ratedKw = buildings.reduce((sum, b) => sum + b.ratedKw, 0);

  for (const building of buildings) {
    building.share = totalKw > 0 ? (building.drawKw / totalKw) * 100 : 0;
  }

  // Same trick one level down: the last system absorbs the rounding so the
  // three system figures always add back up to the campus total.
  const systems: SystemEnergy[] = SYSTEMS.map((system, index) => ({
    system,
    share: ENERGY_MIX[system] * 100,
    drawKw:
      index === SYSTEMS.length - 1 ? 0 : Math.round(totalKw * ENERGY_MIX[system]),
  }));
  systems[systems.length - 1].drawKw =
    totalKw - systems.slice(0, -1).reduce((sum, s) => sum + s.drawKw, 0);

  return {
    totalKw,
    ratedKw,
    loadPct: ratedKw > 0 ? Math.round((totalKw / ratedKw) * 100) : 0,
    buildings,
    systems,
    savingPct: state.campus.energySaving,
    sampleSavingKwh:
      Math.round(ENERGY_ACTIONS.reduce((sum, a) => sum + a.savingKwh, 0) * 10) / 10,
    autoControlToday: ENERGY_AUTO_CONTROL_TODAY,
  };
}

/** Finds a system's live draw without the UI re-deriving the split. */
export function systemDraw(snapshot: EnergySnapshot, system: EnergySystem): number {
  return snapshot.systems.find((s) => s.system === system)?.drawKw ?? 0;
}
