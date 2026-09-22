import {
  IconCrowd,
  IconEmergency,
  IconEnergy,
  IconOverview,
  IconReports,
  IconRobot,
  IconSignage,
  IconTwin,
} from "@/components/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof IconOverview;
  /** False until the page is built — rendered as "Soon" in the sidebar. */
  ready: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "개요", icon: IconOverview, ready: true },
  { href: "/dashboard/twin", label: "디지털 트윈", icon: IconTwin, ready: true },
  { href: "/dashboard/crowd", label: "인원 흐름", icon: IconCrowd, ready: false },
  { href: "/dashboard/signage", label: "스마트 사이니지", icon: IconSignage, ready: false },
  { href: "/dashboard/robots", label: "로봇 관제", icon: IconRobot, ready: false },
  { href: "/dashboard/energy", label: "에너지", icon: IconEnergy, ready: false },
  { href: "/dashboard/emergency", label: "비상 대응", icon: IconEmergency, ready: false },
  { href: "/dashboard/reports", label: "AI 리포트", icon: IconReports, ready: false },
];
