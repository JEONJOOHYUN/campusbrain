# Handoff

마지막 갱신: 2026-09-23 (세션 2)

## Current Goal

Phase 3 완료. 다음은 **Phase 4** — Crowd Flow / Smart Signage / Robot Monitoring / Energy / AI Reports.
엔진 확장과 데이터 파일은 준비돼 있으므로 남은 건 페이지 5개다.

## Fixed Decisions

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4. `create-next-app`을 쓰지 않고 설정 파일을 직접 작성했다.
- **추가 런타임 의존성 0개.** dependencies는 next / react / react-dom 뿐.
- shadcn/ui 패키지를 설치하지 않았다. Button / Card / Badge / Progress / Skeleton / EmptyState는
  `src/components/ui/`의 로컬 프리미티브. 아이콘도 `src/components/icons.tsx`의 인라인 SVG.
  나중에 Select·Tooltip처럼 진짜 Radix 동작이 필요해지면 그때 정식 도입을 제안할 것.
- Digital Twin은 인라인 SVG 아이소메트릭(960x560). Three.js / R3F 없음.
- 애니메이션은 CSS만. Framer Motion 없음.
- Paperlogy 9종은 `C:\dev\maple-dashboard\fonts\Paperlogy\`에서 복사해 `src/app/fonts/`에 두었다(사용자 승인).
- **캠퍼스는 가상 6개소**: 본관 / 공학관 / 학생회관 / 도서관 / 체육관 / 주차장.

## Environment

- Python이 동작하지 않는다(스텁만 설치됨). 일괄 치환은 **node** 스크립트로 쓸 것.
- Bash 도구를 거치면 백슬래시가 소실될 때가 있다. 정규식보다 `indexOf` / `split().join()` 같은
  문자열 조작이 안전하다.

## Implemented Features

- Landing `/` — Hero, 4단계 파이프라인, CTA, 장식용 아이소메트릭 SVG. (스크롤 내러티브는 Phase 6)
- Dashboard 레이아웃 — Sidebar(8개 메뉴, 미구현은 "준비중"), Topbar(시뮬레이션 배지, 시나리오 선택기, 재생/일시정지/리셋, 시뮬 시계).
- Overview `/dashboard` — KPI 6종, Digital Twin, Buildings 리스트, AI Insight, 최근 AI 활동(5건 + 전체 보기 →).
- Digital Twin `/dashboard/twin` — 넓은 맵 + AI Insight + Buildings.
- Building Detail Panel — 커스텀 Sheet(백드롭, Escape, 포커스 복원).
  인원/예상인원/혼잡도/온도/공기질/에너지/로봇/센서/AI 판단/AI Action + [혼잡 시뮬레이션 실행].
- Crowd 시나리오 — 82% → 91% 피크 → AI 대응 3건 → 68% 안정화 → RESOLVED.
- Loading / Empty state — `dashboard/loading.tsx`(Overview 골격 스켈레톤), `Skeleton`, `EmptyState`.
  하드코딩돼 있던 빈 상태 3곳(최근 AI 활동 / 건물 로봇 / AI 판단)을 `EmptyState`로 통일했다.
- Coming soon 페이지 6개: crowd / signage / robots / energy / emergency / reports.

## Phase 4를 위해 준비된 것 — 아직 어느 화면도 쓰지 않는다

죽은 코드가 아니라 페이지를 기다리는 코드다. 타입·린트·빌드는 통과 상태.

- `BuildingState.crowdTrend` — 최근 2 시뮬분 대비 혼잡도 증감(pt). Crowd Flow의 `↑14%`용.
  `CROWD_TREND_LOOKBACK_MIN`(campus.ts)을 timeScale로 나눠 계산하므로 재생 속도와 무관하다.
- `SimulationState.signage` — 로봇과 같은 방식으로 `ScenarioKeyframe.signage` 패치를 적용해
  현재 메시지 · 변경 시각 · **변경 사유**까지 파생한다. Crowd에 4대(t=21) + 1대(t=27) 변경이 들어 있다.
- `src/lib/simulation/report.ts` — `buildScenarioReport(state)`가 트리거/피크/최종/대응 건수/
  시뮬 소요시간을 **숫자로만** 돌려준다. 문구는 UI가 만든다. `formatSimDuration`도 여기.
- `src/data/signage.ts` — 디스플레이 12대. 체육관 SGN-11은 offline 케이스.
- `src/data/activity.ts` — 오늘 08:05~14:22 아카이브 23건. `ACTIVITY_ARCHIVE`는 최신순.
  AI 리포트에서 라이브 로그 아래에 붙여 "오늘 AI 대응 47"을 뒷받침한다.
- `src/data/energy.ts` — `BUILDING_POWER_KW`, `ENERGY_MIX`, `ENERGY_ACTIONS`, `ENERGY_AUTO_CONTROL_TODAY`.
  에너지 수치는 `정격 kW × 엔진이 만든 energy%`로 파생한다.

## Design Decisions

- **화면 텍스트는 전부 한글.** 상태값(NORMAL / CAUTION / CRITICAL, LOW / MODERATE / HIGH, ONLINE,
  WARNING, RESOLVED), 코드(ENG-C2, CLN-04), 브랜드명, 단위만 영문. 코드 주석은 영문 유지.
- 색·상태 톤은 `src/components/dashboard/status.ts` 한 곳에서만 만든다. 맵 SVG는 `tone.css`를 쓴다.
- `SimulatedTag`는 예측값과 Confidence에만 붙인다. 관측값에는 붙이지 않는다.
- count-up은 마운트 1회만 동작하고 이후엔 시뮬레이션 값을 그대로 통과시킨다(`use-count-up.ts`).
  시뮬레이션 루프가 이미 값을 보간하므로 서로 싸우지 않게 하기 위함.
- 컴포넌트에 개수를 적지 않는다. "AI가 N개 건물을 관측"도 `state.buildings.length`에서 받는다.

## Important Files

- `src/lib/simulation/engine.ts` — `deriveState(scenario, elapsed)`. 모든 화면의 단일 진실 원천.
- `src/data/scenarios.ts` — 시나리오 타임라인. 숫자를 바꾸려면 여기.
- `src/data/buildings.ts` — 건물 6개 + 아이소메트릭 좌표 + baseline 지표.
- `src/data/campus.ts` — 혼잡 임계값, KPI 기준값, 추세 lookback.
- `src/components/simulation/simulation-provider.tsx` — 시나리오/재생 상태.
- `src/components/digital-twin/campus-map.tsx` — SVG 맵.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `t`(재생 초) → 지표 목표값 / AI 액션 / 로봇 재배치 / 사이니지 / 로그.
  키프레임 사이는 선형 보간하므로 count-up이 자연스럽게 나온다.
- `t`가 음수인 키프레임은 "대시보드를 열기 전에 AI가 이미 한 일". 항상 포함된다.
  최근 AI 활동이 처음부터 비어 있지 않은 이유.
- `timeScale: 10` — 재생 1초 = 시뮬 10초. Crowd는 60초 재생 = 시뮬 10분(14:30 → 14:40).
- 인원 = `capacity × crowd / 100`. baseline 합계가 정확히 2,418이 되도록 capacity를 정했다.
- Campus Status는 "가장 나쁜 건물"이 아니다. critical이 하나라도 있으면 CRITICAL,
  caution이 3개 이상이면 CAUTION, 그 외 NORMAL.
- 첫 키프레임이 `t > 0`인 트랙에는 엔진이 `t=0`에 baseline 값을 자동으로 넣는다.
  넣지 않으면 시나리오가 이미 변한 상태로 시작한다.
- 재생 루프는 매 틱 누적이 아니라 "재생 시작 시점 + 경과 실시간"으로 계산한다. 누적하면 종료 시각이 어긋난다.
- `report.ts`의 피크 계산은 키프레임 값만 훑는다. 보간이 선형이라 극값은 항상 키프레임 위에 있다.
- 맵의 유입 흐름 출발지는 `ScenarioDefinition.flowFromBuildingId`에서 온다.

## Known Issues

- Landing은 Hero / 파이프라인 / CTA만 있다. 명세의 스크롤 내러티브는 Phase 6.
- Event / Emergency 시나리오는 `available: false` 스텁이다. 선택기에서 비활성으로 보인다.
- Digital Twin 맵에서 건물 상자의 옆면 경계선 위를 정확히 클릭하면 반응하지 않는 좁은 구간이 있다.
  윗면·옆면 안쪽은 정상. 투명한 히트 영역 폴리곤을 덧대면 해결된다.
- AI 리포트로 가는 `전체 보기 →`는 아직 Coming soon 페이지로 연결된다.

## Pending Tasks

1. **Phase 4** — Crowd Flow, Smart Signage, Robot Monitoring, Energy, AI Reports(전체 로그 + 필터 + 실행 리포트).
   데이터·파생 로직 준비 완료. 페이지를 만들면서 `nav-items.ts`의 `ready`를 켜고 ComingSoon 페이지를 지울 것.
2. Phase 5 — Emergency / SafeFlow 6단계.
3. Phase 6 — Landing 완성, 반응형·애니메이션 다듬기.

## Last Session Summary

Phase 3을 닫고(Skeleton · EmptyState · loading.tsx) Phase 4 토대를 깔았다:
`crowdTrend`, `SignageState`, `flowFromBuildingId`, `report.ts`, 데이터 3종(signage · activity · energy).

작업 중 타입이 잡아준 것 하나 — 맵이 유입 흐름 출발지를 `"main"`으로 하드코딩하고 있었다.
시나리오가 소유하도록 `ScenarioDefinition.flowFromBuildingId`로 옮기고, 곡선 제어점도 좌표에서 파생시켰다.

`tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과. 브라우저에서 평상시·혼잡 재생 확인.
**커밋하지 않았다.**
