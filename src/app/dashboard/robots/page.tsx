import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "로봇 관제 — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="로봇 관제"
      description="청소 / 안내 / 배송 / 보안 로봇의 위치·배터리·작업 상태를 시나리오에 맞춰 보여줍니다."
      phase="4단계 · Physical AI 기능"
    />
  );
}
