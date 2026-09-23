import type { Metadata } from "next";
import { RobotDeployment } from "@/components/robots/robot-deployment";
import { RobotFleet } from "@/components/robots/robot-fleet";
import { RobotSummary } from "@/components/robots/robot-summary";

export const metadata: Metadata = { title: "로봇 관제 — CampusBrain" };

export default function RobotsPage() {
  return (
    <div className="space-y-4">
      <RobotSummary />
      <RobotDeployment />
      <RobotFleet />
    </div>
  );
}
