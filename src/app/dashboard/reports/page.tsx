import type { Metadata } from "next";
import { ActivityTimeline } from "@/components/reports/activity-timeline";
import { ScenarioReportCard } from "@/components/reports/scenario-report-card";

export const metadata: Metadata = { title: "AI 리포트 — CampusBrain" };

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <ScenarioReportCard />
      <ActivityTimeline />
    </div>
  );
}
