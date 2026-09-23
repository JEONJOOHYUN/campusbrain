import type { Metadata } from "next";
import { CrowdSummary } from "@/components/crowd/crowd-summary";
import { ZoneGrid } from "@/components/crowd/zone-grid";
import { AiInsightCard } from "@/components/dashboard/ai-insight-card";
import { TwinPanel } from "@/components/digital-twin/twin-panel";

export const metadata: Metadata = { title: "인원 흐름 — CampusBrain" };

export default function CrowdPage() {
  return (
    <div className="space-y-4">
      <CrowdSummary />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <TwinPanel
          title="인원 흐름"
          description="건물 색은 혼잡 상태, 곡선은 AI가 감지한 유입 흐름입니다."
        />
        <AiInsightCard />
      </div>

      <ZoneGrid />
    </div>
  );
}
