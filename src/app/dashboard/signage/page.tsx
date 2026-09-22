import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "스마트 사이니지 — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="스마트 사이니지"
      description="AI가 상황에 따라 디스플레이 메시지를 자동으로 바꾸고, 변경 시각과 판단 근거를 함께 기록합니다."
      phase="4단계 · Physical AI 기능"
    />
  );
}
