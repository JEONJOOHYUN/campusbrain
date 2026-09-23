import type { Metadata } from "next";
import { AiInsightCard } from "@/components/dashboard/ai-insight-card";
import { SAFEFLOW_LEGEND, TwinPanel } from "@/components/digital-twin/twin-panel";
import { EmergencySummary } from "@/components/emergency/emergency-summary";
import { EvacuationRoutes } from "@/components/emergency/evacuation-routes";
import { SafeFlowActions } from "@/components/emergency/safeflow-actions";
import { SafeFlowPanel } from "@/components/emergency/safeflow-panel";
import { SafeFlowSummary } from "@/components/emergency/safeflow-summary";

export const metadata: Metadata = { title: "비상 대응 / SafeFlow — CampusBrain" };

export default function EmergencyPage() {
  return (
    <div className="space-y-4">
      <EmergencySummary />

      <SafeFlowPanel />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <TwinPanel
          title="SafeFlow 대피 경로"
          description="화재 위치와 위험 구역, 차단한 경로, 안전 대피경로를 함께 표시합니다."
          legend={SAFEFLOW_LEGEND}
        />
        <AiInsightCard />
      </div>

      <SafeFlowActions />

      <div className="grid gap-4 xl:grid-cols-2">
        <EvacuationRoutes />
        <SafeFlowSummary />
      </div>
    </div>
  );
}
