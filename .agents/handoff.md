# Handoff

마지막 갱신: 2026-09-23 (세션 3)

## Current Goal

Phase 4 완료(`b5d686d`로 푸시됨). 다음은 **Phase 5** — Emergency / SafeFlow 6단계.
사이드바에서 "준비중"이 남은 메뉴는 비상 대응 하나뿐이다.

Phase 4와 달리 **데이터·파생 로직이 준비돼 있지 않다.** 시나리오 타임라인부터 직접 짜야 한다.
자세한 건 Pending Tasks 1번.

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
- 브라우저 프리뷰는 `.claude/launch.json`의 **campusbrain-dev**(포트 3002).

## Implemented Features

- Landing `/` — Hero, 4단계 파이프라인, CTA, 장식용 아이소메트릭 SVG. (스크롤 내러티브는 Phase 6)
- Dashboard 레이아웃 — Sidebar(8개 메뉴, 비상 대응만 "준비중"), Topbar(시뮬레이션 배지, 시나리오 선택기, 재생/일시정지/리셋, 시뮬 시계).
- Overview `/dashboard` — KPI 6종, Digital Twin, Buildings 리스트, AI Insight, 최근 AI 활동(5건 + 전체 보기 →).
- Digital Twin `/dashboard/twin` — 넓은 맵 + AI Insight + Buildings.
- Building Detail Panel — 커스텀 Sheet(백드롭, Escape, 포커스 복원).
- Crowd 시나리오 — 82% → 91% 피크 → AI 대응 3건 → 68% 안정화 → RESOLVED.
- Loading / Empty state — `dashboard/loading.tsx`, `Skeleton`, `EmptyState`.

### Phase 4에서 추가한 페이지 5개

- **인원 흐름 `/dashboard/crowd`** — 요약 4칸(캠퍼스 인원 / 혼잡 구역 / 최고 혼잡 / AI 예측),
  `TwinPanel`을 제목만 바꿔 재사용, 구역 카드 6개. 카드에는 혼잡도 · 레벨 배지 · `crowdTrend`(`↑5%p`) ·
  임계값 눈금을 얹은 Progress · 인원/수용/상태/센서 · 예측 칩.
  추세 창("최근 2분") 문구는 카드마다 반복하지 않고 그리드 헤더에 한 번만 둔다.
- **스마트 사이니지 `/dashboard/signage`** — 요약 4칸, **AI 메시지 변경 이력**, 디스플레이 12장.
  `SignageScreen`이 실제 화면을 흉내 내고(종류별 색, `arrow`는 `IconArrowRight` 회전),
  오프라인은 디밍 + "화면 꺼짐". 변경 이력은 **변경 사유로 묶는다** — 한 번의 AI 판단이
  화면마다 다른 문구로 나가기 때문에(SGN-05는 받는 쪽이라 "서편 복도 개방") 12줄 나열보다 정확하다.
- **로봇 관제 `/dashboard/robots`** — 요약 4칸, 건물별 배치, 종류 필터 칩 + 로봇 카드 14장.
  재배치된 로봇은 보라 테두리 + "AI가 작업을 재배치했습니다". 원격 조종 UI는 없다(명세대로).
- **에너지 `/dashboard/energy`** — 요약 5칸, 건물별 전력, 시스템별 전력(스택 바), AI 자동 제어 기록 5건.
- **AI 리포트 `/dashboard/reports`** — 시나리오 실행 리포트 + 전체 활동 로그(분류·시나리오 필터).
  Overview의 `전체 보기 →`가 이제 실제 페이지로 간다.

## Design Decisions

- **화면 텍스트는 전부 한글.** 상태값(NORMAL / CAUTION / CRITICAL, LOW / MODERATE / HIGH, ONLINE,
  WARNING, RESOLVED), 코드(ENG-C2, CLN-04), 브랜드명, 단위만 영문. 코드 주석은 영문 유지.
- 색·상태 톤은 `src/components/dashboard/status.ts` 한 곳에서만 만든다. 맵 SVG는 `tone.css`를 쓴다.
  Phase 4에서 여기에 `signageTone` / `batteryTone` / `energySystemTone`과
  `ROBOT_KIND_*` / `ENERGY_SYSTEM_LABEL` / `AI_ACTION_KIND_LABEL` / `CROWD_LEVEL_BADGE`가 들어왔다.
  Badge 톤 이름을 타입으로 참조할 수 있게 `badge.tsx`가 `BadgeTone`을 export 한다.
- 계통·로봇 종류처럼 **분류**를 뜻하는 색에는 amber/red를 쓰지 않는다. 그 둘은 상태 스케일이 소유한다.
- `SimulatedTag`는 예측값과 Confidence, 그리고 시나리오 실행 리포트 전체에만 붙인다.
- count-up은 마운트 1회만 동작하고 이후엔 시뮬레이션 값을 그대로 통과시킨다(`use-count-up.ts`).
- 컴포넌트에 개수를 적지 않는다. 필터 칩의 개수도 전부 상태에서 센다.

## Important Files

- `src/lib/simulation/engine.ts` — `deriveState(scenario, elapsed)`. 모든 화면의 단일 진실 원천.
- `src/lib/simulation/report.ts` — `buildScenarioReport(state)` / `formatSimDuration`. 숫자만 돌려준다.
- `src/lib/simulation/energy.ts` — `deriveEnergy(state)`. report.ts와 같은 규칙.
- `src/data/scenarios.ts` — 시나리오 타임라인. 숫자를 바꾸려면 여기.
- `src/data/buildings.ts` / `campus.ts` / `robots.ts` / `signage.ts` / `energy.ts` / `activity.ts`
- `src/components/simulation/simulation-provider.tsx` — 시나리오/재생 상태.
- `src/components/digital-twin/campus-map.tsx` — SVG 맵.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `t`(재생 초) → 지표 목표값 / AI 액션 / 로봇 재배치 / 사이니지 / 로그.
  키프레임 사이는 선형 보간하므로 count-up이 자연스럽게 나온다.
- `t`가 음수인 키프레임은 "대시보드를 열기 전에 AI가 이미 한 일". 항상 포함된다.
- `timeScale: 10` — 재생 1초 = 시뮬 10초. Crowd는 60초 재생 = 시뮬 10분(14:30 → 14:40).
- 인원 = `capacity × crowd / 100`. baseline 합계가 정확히 2,418이 되도록 capacity를 정했다.
- Campus Status는 "가장 나쁜 건물"이 아니다. critical이 하나라도 있으면 CRITICAL,
  caution이 3개 이상이면 CAUTION, 그 외 NORMAL.
- 첫 키프레임이 `t > 0`인 트랙에는 엔진이 `t=0`에 baseline 값을 자동으로 넣는다.
- 재생 루프는 매 틱 누적이 아니라 "재생 시작 시점 + 경과 실시간"으로 계산한다.
- `report.ts`의 피크 계산은 키프레임 값만 훑는다. 보간이 선형이라 극값은 항상 키프레임 위에 있다.
- 맵의 유입 흐름 출발지는 `ScenarioDefinition.flowFromBuildingId`에서 온다.
- **에너지 반올림** — 건물 kW를 각각 반올림하고 그 합을 캠퍼스 합계로 쓴다. 계통 3종은 마지막
  항목이 나머지를 흡수한다. 그래서 화면의 행을 더하면 항상 헤드라인 숫자와 정확히 맞는다.

## Known Issues

- Landing은 Hero / 파이프라인 / CTA만 있다. 명세의 스크롤 내러티브는 Phase 6.
- Event / Emergency 시나리오는 `available: false` 스텁이다. 선택기에서 비활성으로 보인다.
- Digital Twin 맵에서 건물 상자의 옆면 경계선 위를 정확히 클릭하면 반응하지 않는 좁은 구간이 있다.
  윗면·옆면 안쪽은 정상. 투명한 히트 영역 폴리곤을 덧대면 해결된다.
- 평상시 시나리오는 `focusBuildingId` · `insight`가 없어서 실행 리포트에 트리거·결과 칸이 빠진다.
  없는 값을 지어내지 않는 의도된 동작이다(AI 대응 0건 / 소요 시간만 나온다).
- 브라우저 도구로 **재생 중** 스크린샷을 찍으면 `animate-rise`가 걸린 카드가 흐리게 캡처된다.
  DOM의 `opacity`는 1이다. 캡처 아티팩트지 버그가 아니다.
- DOM에 `div#S:0` 숨은 복사본이 보이는 것은 Next.js 스트리밍 아티팩트다. 기존 페이지에도 있다.

## Pending Tasks

1. **Phase 5** — Emergency / SafeFlow. 명세의 핵심 데모이고, ComingSoon을 쓰는 마지막 페이지다.

   **Phase 4와 다른 점 — 데이터·파생 로직이 준비돼 있지 않다.** Phase 4는 세션 2가 깔아 둔
   `crowdTrend` · `SignageState` · `report.ts` · 데이터 3종을 소비하기만 하면 됐지만,
   `EMERGENCY`는 `durationSec: 0` · `keyframes: []`인 빈 스텁이다. 시나리오 타임라인부터 설계해야 한다.
   맵의 대피경로도 `campus-map.tsx`에 새 레이어를 붙이는 작업이다. "페이지만 만들면 되는" 단계가 아니다.

   순서: **시나리오 타임라인 → 페이지 → 리포트**.

   - `scenarios.ts`의 `EMERGENCY`를 키프레임으로 채우고 `available: true`로 바꾼다.
     `durationSec`이 0이면 선택기에서 비활성이고 `buildScenarioReport`도 null을 돌려준다.
   - `/dashboard/emergency` — [Simulate Emergency] → 6단계(화재 감지 → 위험 구역 분석 →
     인원 위치 분석 → 안전 경로 산출 → 물리 시스템 연동 → 대응 활성화).
   - Digital Twin에 화재 위치 / 위험 구역 / 차단 경로 / 안전 대피경로(드로잉 애니메이션).
     기존 유입 흐름 곡선(`flowFromBuildingId`)이 선을 그리는 방식을 참고할 것.
   - AI Action 카드 5종, 종료 요약(인원 유도 / 회피한 고위험 경로 / 대피 개선율)에는 `SimulatedTag`.
   - AI 리포트의 실행 리포트에 SafeFlow 수치를 덧붙인다. `buildScenarioReport`는 그대로 쓴다.

   이미 깔려 있으니 새로 만들지 말 것:
   - `SignageKind`의 `evacuation`, `signageTone`이 CRITICAL로 매핑.
   - `AiActionKind`의 `door` / `broadcast`, 라벨은 `AI_ACTION_KIND_LABEL`.
   - `ActivityCategory`의 `emergency`, `CATEGORY_LABEL`에 "비상"으로 들어가 있다.
2. Phase 6 — Landing 완성, 반응형·애니메이션 다듬기.

## Last Session Summary

Phase 4의 페이지 5개를 한 개씩 만들고 브라우저로 확인하며 닫았다. 데이터·파생 로직은 세션 2에서
준비돼 있었으므로 새로 만든 파생 코드는 `lib/simulation/energy.ts` 하나뿐이다.

지나가다 고친 것 — `zone-card.tsx`가 혼잡 레벨 색을 3중 삼항으로 직접 정하고 있었다.
`CROWD_LEVEL_BADGE`로 옮겨 색 결정을 다시 `status.ts` 한 곳으로 모았다.

`tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과.
평상시·혼잡 시나리오를 5개 페이지 전부에서 끝까지 재생해 확인했다. 에너지 수치는 손으로 검산했다
(510×0.70=357, 합계 1,084, 1084×0.52=564).
**커밋하지 않았다.**
