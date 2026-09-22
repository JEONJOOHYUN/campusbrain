import type { Metadata } from "next";
import { AiInsightCard } from "@/components/dashboard/ai-insight-card";
import { BuildingList } from "@/components/dashboard/building-list";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { RecentActivityCard } from "@/components/dashboard/activity-log-list";
import { TwinPanel } from "@/components/digital-twin/twin-panel";

export const metadata: Metadata = {
  title: "개요 — CampusBrain",
};

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <KpiGrid />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <TwinPanel />
          <BuildingList />
        </div>
        <div className="space-y-4">
          <AiInsightCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
