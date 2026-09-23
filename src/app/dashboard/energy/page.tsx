import type { Metadata } from "next";
import { EnergyActions } from "@/components/energy/energy-actions";
import { EnergyBuildings } from "@/components/energy/energy-buildings";
import { EnergySummary } from "@/components/energy/energy-summary";
import { EnergySystems } from "@/components/energy/energy-systems";

export const metadata: Metadata = { title: "에너지 — CampusBrain" };

export default function EnergyPage() {
  return (
    <div className="space-y-4">
      <EnergySummary />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <EnergyBuildings />
        <EnergySystems />
      </div>

      <EnergyActions />
    </div>
  );
}
