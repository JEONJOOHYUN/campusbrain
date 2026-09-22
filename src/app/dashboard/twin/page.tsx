import type { Metadata } from "next";
import { AiInsightCard } from "@/components/dashboard/ai-insight-card";
import { BuildingList } from "@/components/dashboard/building-list";
import { TwinPanel } from "@/components/digital-twin/twin-panel";

export const metadata: Metadata = {
  title: "디지털 트윈 — CampusBrain",
};

export default function TwinPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <TwinPanel tall />
      <div className="space-y-4">
        <AiInsightCard />
        <BuildingList />
      </div>
    </div>
  );
}
