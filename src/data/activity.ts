import type { ActivityLogEntry } from "@/types";

/* ------------------------------------------------------------------ *
 * Everything the AI did earlier today, before the operator opened the
 * dashboard. The live scenario log covers 14:30 onwards; this is the
 * record behind it, and it is what makes "오늘 AI 대응 47" real rather
 * than a number on a card.
 *
 * These are normal-operations events, so they carry scenario "normal" —
 * a what-if run of another scenario does not rewrite the day's history.
 * Written oldest first for readability; exported newest first to match
 * the live log's ordering.
 * ------------------------------------------------------------------ */

type ArchiveEntry = Omit<ActivityLogEntry, "id" | "scenario">;

const ENTRIES: ArchiveEntry[] = [
  {
    time: "08:05",
    category: "energy",
    stage: "act",
    severity: "info",
    title: "일출 기준 외부 조명 일괄 소등",
    location: "캠퍼스 전체",
    target: "가로등 86개",
  },
  {
    time: "08:12",
    category: "crowd",
    stage: "observe",
    severity: "info",
    title: "1교시 등교 인원 유입 시작",
    location: "정문 · 후문",
    target: "분당 +52명",
  },
  {
    time: "08:30",
    category: "energy",
    stage: "decide",
    severity: "info",
    title: "강의 시간표 기준 냉난방 선가동 계획 수립",
    location: "본관 · 공학관",
  },
  {
    time: "08:41",
    category: "robot",
    stage: "act",
    severity: "info",
    title: "청소로봇 01 야간 충전 종료 · 작업 투입",
    location: "본관 2층",
    target: "CLN-01",
  },
  {
    time: "09:02",
    category: "signage",
    stage: "act",
    severity: "info",
    title: "1교시 강의실 변경 안내 송출",
    location: "공학관 1층",
    target: "디스플레이 3대",
  },
  {
    time: "09:18",
    category: "emergency",
    stage: "observe",
    severity: "info",
    title: "소방 설비 자가진단 완료 — 이상 없음",
    location: "건물 6개소",
    target: "감지기 412개",
  },
  {
    time: "09:44",
    category: "energy",
    stage: "act",
    severity: "info",
    title: "빈 강의실 감지 — 조명 OFF · 냉난방 ECO",
    location: "공학관 512호",
    target: "1.8 kWh 절감",
  },
  {
    time: "10:07",
    category: "crowd",
    stage: "observe",
    severity: "info",
    title: "도서관 재실률 58% 도달",
    location: "도서관",
  },
  {
    time: "10:23",
    category: "robot",
    stage: "act",
    severity: "info",
    title: "배송로봇 02 반납 도서 운반 시작",
    location: "도서관 1층",
    target: "DLV-02",
  },
  {
    time: "10:51",
    category: "energy",
    stage: "act",
    severity: "info",
    title: "일사량 증가 감지 — 남측 블라인드 자동 조절",
    location: "본관 · 도서관",
    target: "냉방 부하 7% 감소",
  },
  {
    time: "11:12",
    category: "crowd",
    stage: "predict",
    severity: "info",
    title: "점심 시간 학생회관 혼잡 예측 — 12:10경 78%",
    location: "학생회관",
    target: "신뢰도 89%",
  },
  {
    time: "11:30",
    category: "signage",
    stage: "act",
    severity: "info",
    title: "푸드코트 코너별 대기 시간 안내 시작",
    location: "학생회관 1층",
    target: "SGN-08",
  },
  {
    time: "11:58",
    category: "robot",
    stage: "decide",
    severity: "info",
    title: "청소 일정을 점심 시간 이후로 재배정",
    location: "학생회관 1층",
    target: "CLN-03",
  },
  {
    time: "12:14",
    category: "crowd",
    stage: "observe",
    severity: "warning",
    title: "학생회관 재실률 79% — 예측 범위 내",
    location: "학생회관 푸드코트",
  },
  {
    time: "12:26",
    category: "crowd",
    stage: "act",
    severity: "info",
    title: "학생회관 2층 좌석 개방 안내",
    location: "학생회관",
    target: "좌석 120석",
  },
  {
    time: "12:47",
    category: "energy",
    stage: "act",
    severity: "info",
    title: "체육관 무인 구간 냉난방 정지",
    location: "체육관 보조경기장",
    target: "3.1 kWh 절감",
  },
  {
    time: "13:05",
    category: "robot",
    stage: "act",
    severity: "info",
    title: "보안로봇 03 배터리 24% — 도킹 복귀",
    location: "본관 지하1층 도크",
    target: "SEC-03",
  },
  {
    time: "13:22",
    category: "crowd",
    stage: "observe",
    severity: "info",
    title: "점심 인원 분산 완료 — 학생회관 63%",
    location: "학생회관",
  },
  {
    time: "13:40",
    category: "signage",
    stage: "act",
    severity: "info",
    title: "오후 강의 안내로 사이니지 전환",
    location: "캠퍼스 전체",
    target: "디스플레이 12대",
  },
  {
    time: "13:55",
    category: "energy",
    stage: "observe",
    severity: "info",
    title: "누적 절감량 목표 대비 104% 달성",
    location: "캠퍼스 전체",
    target: "18.4%",
  },
  {
    time: "14:08",
    category: "crowd",
    stage: "observe",
    severity: "info",
    title: "공학관 재실률 74%로 상승",
    location: "공학관",
  },
  {
    time: "14:16",
    category: "robot",
    stage: "act",
    severity: "info",
    title: "배송로봇 03 배터리 31% — 도킹 복귀",
    location: "공학관 지하1층 도크",
    target: "DLV-03",
  },
  {
    time: "14:22",
    category: "energy",
    stage: "act",
    severity: "info",
    title: "빈 강의실 감지 — 조명 OFF · 냉난방 ECO",
    location: "본관 304호",
    target: "2.4 kWh 절감",
  },
];

/** Newest first, so it can be appended straight under the live log. */
export const ACTIVITY_ARCHIVE: ActivityLogEntry[] = ENTRIES.map((entry, index) => ({
  ...entry,
  id: `archive-${index}`,
  scenario: "normal" as const,
})).reverse();
