import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "인원 흐름 — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="인원 흐름"
      description="지도 위에 인원 흐름과 이동선을 시각화하고, 구역별 LOW / MODERATE / HIGH / CRITICAL 상태와 예측을 보여줍니다."
      phase="4단계 · Physical AI 기능"
    />
  );
}
