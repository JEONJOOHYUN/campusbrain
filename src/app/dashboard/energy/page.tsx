import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "에너지 — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="에너지"
      description="건물별 전력·냉난방·조명 사용량과 AI 자동 제어에 따른 예상 절감량을 보여줍니다."
      phase="4단계 · Physical AI 기능"
    />
  );
}
