import type { Metadata } from "next";
import { SignageChangeLog } from "@/components/signage/signage-change-log";
import { SignageGrid } from "@/components/signage/signage-grid";
import { SignageSummary } from "@/components/signage/signage-summary";

export const metadata: Metadata = { title: "스마트 사이니지 — CampusBrain" };

export default function SignagePage() {
  return (
    <div className="space-y-4">
      <SignageSummary />
      <SignageChangeLog />
      <SignageGrid />
    </div>
  );
}
