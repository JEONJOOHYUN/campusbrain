import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "AI 리포트 — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="AI 리포트"
      description="전체 AI 활동 기록과 시나리오 실행 리포트를 필터와 함께 보여줍니다."
      phase="4단계 · Physical AI 기능"
    />
  );
}
