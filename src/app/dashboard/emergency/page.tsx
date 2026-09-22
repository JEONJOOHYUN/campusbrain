import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "비상 대응 / SafeFlow — CampusBrain" };

export default function Page() {
  return (
    <ComingSoon
      title="비상 대응 / SafeFlow"
      description="화재 감지부터 안전 대피경로 산출까지 6단계 SafeFlow 시나리오를 실행합니다. 가장 핵심적인 데모 기능입니다."
      phase="5단계 · Milestone 2"
    />
  );
}
