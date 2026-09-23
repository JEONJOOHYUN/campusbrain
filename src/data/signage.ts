import type { SignageBase } from "@/types";

/* ------------------------------------------------------------------ *
 * 12 displays across the campus — the number the "일일 행사 사이니지 교체"
 * log refers to. Each one carries the message it shows until the AI
 * overrides it; overrides live in the scenario timeline, never here.
 * ------------------------------------------------------------------ */

const WELCOME = {
  kind: "welcome",
  headline: "캠퍼스에 오신 것을 환영합니다",
  sub: "오늘의 행사 · 졸업작품전 D-3",
} as const;

const TODAY = {
  kind: "event",
  headline: "오늘의 행사",
  sub: "졸업작품전 사전 설치 · 공학관 3층",
} as const;

export const SIGNAGE: SignageBase[] = [
  {
    id: "SGN-01",
    name: "본관 로비 대형",
    buildingId: "main",
    location: "본관 1층 정문 로비",
    online: true,
    baseMessage: { ...WELCOME },
  },
  {
    id: "SGN-02",
    name: "본관 엘리베이터 홀",
    buildingId: "main",
    location: "본관 1층 엘리베이터 홀",
    online: true,
    baseMessage: {
      kind: "wayfinding",
      headline: "엘리베이터 운행 안내",
      sub: "1·2호기 전층 · 대기 약 40초",
    },
  },
  {
    id: "SGN-03",
    name: "중앙 보행로 게이트",
    buildingId: "main",
    location: "중앙 보행로 · 본관–공학관 구간",
    online: true,
    baseMessage: { ...TODAY },
  },
  {
    id: "SGN-04",
    name: "공학관 1층 로비",
    buildingId: "engineering",
    location: "공학관 1층 로비 정면",
    online: true,
    baseMessage: { ...WELCOME },
  },
  {
    id: "SGN-05",
    name: "공학관 서편 복도",
    buildingId: "engineering",
    location: "공학관 1층 서편 복도 입구",
    online: true,
    baseMessage: {
      kind: "wayfinding",
      headline: "강의동 안내",
      sub: "301–318 강의실 · 서편 복도",
      arrow: "left",
    },
  },
  {
    id: "SGN-06",
    name: "공학관 엘리베이터 홀",
    buildingId: "engineering",
    location: "공학관 1층 엘리베이터 홀",
    online: true,
    baseMessage: {
      kind: "wayfinding",
      headline: "엘리베이터 운행 안내",
      sub: "1–4호기 전층 운행",
    },
  },
  {
    id: "SGN-07",
    name: "공학관 중앙 계단",
    buildingId: "engineering",
    location: "공학관 1층 중앙 계단 앞",
    online: true,
    baseMessage: { ...TODAY },
  },
  {
    id: "SGN-08",
    name: "학생회관 푸드코트",
    buildingId: "student-center",
    location: "학생회관 1층 푸드코트",
    online: true,
    baseMessage: {
      kind: "event",
      headline: "오늘의 학식",
      sub: "1코너 대기 약 8분 · 2코너 대기 없음",
    },
  },
  {
    id: "SGN-09",
    name: "학생회관 광장",
    buildingId: "student-center",
    location: "학생회관 앞 광장",
    online: true,
    baseMessage: { ...WELCOME },
  },
  {
    id: "SGN-10",
    name: "도서관 입구",
    buildingId: "library",
    location: "도서관 1층 출입구",
    online: true,
    baseMessage: {
      kind: "event",
      headline: "열람실 잔여석",
      sub: "3층 62석 · 4층 108석",
    },
  },
  {
    id: "SGN-11",
    name: "체육관 입구",
    buildingId: "gymnasium",
    location: "체육관 1층 출입구",
    online: false,
    baseMessage: {
      kind: "event",
      headline: "체육관 이용 안내",
      sub: "정기 점검 · 16:00까지",
    },
  },
  {
    id: "SGN-12",
    name: "주차장 진입로",
    buildingId: "parking",
    location: "주차장 진입 차단기",
    online: true,
    baseMessage: {
      kind: "wayfinding",
      headline: "주차 가능 740면",
      sub: "B구역 여유 · A구역 혼잡",
      arrow: "right",
    },
  },
];

export const SIGNAGE_BY_ID: Record<string, SignageBase> = Object.fromEntries(
  SIGNAGE.map((s) => [s.id, s]),
);
