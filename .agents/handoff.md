# Handoff

마지막 갱신: 2026-09-23 (세션 4)

## Current Goal

Phase 5 완료. `a9cad41`(구현) · `3007838`(문서)로 커밋했고 origin/main에 푸시됐다.
사이드바에 "준비중"은 하나도 남지 않았고, `ComingSoon`을 쓰는 페이지도 없다.

다음은 **Phase 6(Polish)** — 명세에 남은 마지막 단계다. 할 일은 Pending Tasks에 순서대로 적어 두었다.
`EVENT`(행사)는 여전히 `available: false` 스텁이고, 명세의 Phase 목록에는 없는 선택 항목이다.

## Fixed Decisions

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4. `create-next-app`을 쓰지 않고 설정 파일을 직접 작성했다.
- **추가 런타임 의존성 0개.** dependencies는 next / react / react-dom 뿐.
- shadcn/ui 패키지를 설치하지 않았다. Button / Card / Badge / Progress / Skeleton / EmptyState는
  `src/components/ui/`의 로컬 프리미티브. 아이콘도 `src/components/icons.tsx`의 인라인 SVG.
  나중에 Select·Tooltip처럼 진짜 Radix 동작이 필요해지면 그때 정식 도입을 제안할 것.
- Digital Twin은 인라인 SVG 아이소메트릭(960x560). Three.js / R3F 없음.
- 애니메이션은 CSS만. Framer Motion 없음. 맵의 반복 모션만 SVG SMIL을 쓴다(아래 Known Issues).
- Paperlogy 9종은 `C:\dev\maple-dashboard\fonts\Paperlogy\`에서 복사해 `src/app/fonts/`에 두었다(사용자 승인).
- **캠퍼스는 가상 6개소**: 본관 / 공학관 / 학생회관 / 도서관 / 체육관 / 주차장.

## Environment

- Python이 동작하지 않는다(스텁만 설치됨). 일괄 치환은 **node** 스크립트로 쓸 것.
- Bash 도구의 heredoc에 **아포스트로피가 들어가면 파싱이 깨진다**(`the spec's ...`).
  긴 텍스트 조각은 Write 도구로 스크래치패드에 쓰고 node로 합치는 편이 안전하다.
  정규식보다 `indexOf` / `split().join()` 같은 문자열 조작이 여전히 안전하다.
- 브라우저 프리뷰는 `C:\dev\.claude\launch.json`의 **campusbrain-dev**(포트 3002).
  (repo 안의 `campusbrain/.claude/launch.json`에는 3000짜리 `campusbrain` 항목이 따로 있다.)

## Implemented Features

- Landing `/` — Hero, 4단계 파이프라인, CTA, 장식용 아이소메트릭 SVG. (스크롤 내러티브는 Phase 6)
- Dashboard 레이아웃 — Sidebar(8개 메뉴 전부 활성), Topbar(시뮬레이션 배지, 시나리오 선택기, 재생/일시정지/리셋, 시뮬 시계).
- Overview `/dashboard` — KPI 6종, Digital Twin, Buildings 리스트, AI Insight, 최근 AI 활동(5건 + 전체 보기 →).
- Digital Twin `/dashboard/twin` — 넓은 맵 + AI Insight + Buildings.
- Building Detail Panel — 커스텀 Sheet(백드롭, Escape, 포커스 복원).
- Crowd 시나리오 — 82% → 91% 피크 → AI 대응 3건 → 68% 안정화 → RESOLVED.
- Loading / Empty state — `dashboard/loading.tsx`, `Skeleton`, `EmptyState`.
- **인원 흐름 / 스마트 사이니지 / 로봇 관제 / 에너지 / AI 리포트** (Phase 4, 자세한 건 git 로그와 각 컴포넌트 주석)

### Phase 5에서 추가한 것 — Emergency / SafeFlow

- **비상 시나리오** (`scenarios.ts`의 `EMERGENCY`) — 60초 재생 = 14:30→14:40.
  공학관 3층 동편 화재 → 저층 출구 혼잡 89% 예측 → 안전 경로 2개 / 차단 3개 →
  물리 시스템 5종 → 대피 완료(공학관 9%, 주차장 67%).
- **`src/data/safeflow.ts`** — 캠퍼스 화재 대응 계획. 6단계 phase(`t`), 경로 5개(맵 좌표 + 인원),
  화재 위치, 대피 기준 시간. **화면에 나오는 SafeFlow 숫자는 전부 여기서 나온다.**
- **`src/lib/simulation/safeflow.ts`** — `deriveSafeFlow(state)`. `report.ts` / `energy.ts`와 같은 규칙
  (숫자만 돌려주고 문구는 UI가 정한다). 비상이 아닌 시나리오에서는 `null`.
- **비상 대응 `/dashboard/emergency`** — 요약 4칸, SafeFlow 6단계 패널([비상 시뮬레이션 실행]),
  맵(비상 범례) + AI 인사이트, AI Action 카드 5장, 대피 경로 5개, 종료 요약.
- **맵 비상 레이어** (`campus-map.tsx`) — 화재 마커(어두운 후광 + 확산 링), 위험 구역(앰버 파선 다이아몬드),
  차단 경로 3개(붉은 파선 + ✕), 안전 대피경로 2개(드로잉 애니메이션 + 이동하는 인원 점 + 집결지 마커).
  레이어는 각 phase가 끝나는 순간 켜진다(`reached.detect` / `risk` / `crowd` / `route` / `coordinate`).
- **AI 리포트** — 실행 리포트 하단에 SafeFlow 블록(인원 유도 / 회피 경로 / 개선율). `buildScenarioReport`는 그대로다.

## Design Decisions

- **화면 텍스트는 전부 한글.** 상태값(NORMAL / CAUTION / CRITICAL, LOW / MODERATE / HIGH, ONLINE,
  WARNING, RESOLVED, ACTIVE, ACTIVATED, COMPLETE), 코드(ENG-C2, CLN-04), 브랜드명(SafeFlow 포함),
  단위만 영문. 코드 주석은 영문 유지.
- 색·상태 톤은 `src/components/dashboard/status.ts` 한 곳에서만 만든다. 맵 SVG는 `tone.css`를 쓴다.
- 계통·로봇 종류처럼 **분류**를 뜻하는 색에는 amber/red를 쓰지 않는다. 그 둘은 상태 스케일이 소유한다.
  비상 레이어는 상태 스케일 쪽이라 red(화재·차단) / amber(위험 구역) / green(안전 경로)을 그대로 쓴다.
- `SimulatedTag`는 예측값과 Confidence, 시나리오 실행 리포트 전체, SafeFlow 종료 요약에만 붙인다.
- count-up은 마운트 1회만 동작하고 이후엔 시뮬레이션 값을 그대로 통과시킨다(`use-count-up.ts`).
- 컴포넌트에 개수를 적지 않는다. AI Action의 `5 / 5`도 타임라인에서 센다.
- `TwinPanel`은 `legend` prop을 받는다. 기본은 NORMAL/CAUTION/CRITICAL,
  비상 페이지는 `SAFEFLOW_LEGEND`(점 / 영역 / 파선 / 실선 스와치)를 넘긴다.
- 대피 경로 카드에는 "차단 경로 인원이 그대로 안전 경로로 재배분된다"는 한 줄을 둔다.
  78+46과 68+41+15가 **같은 124명**이라, 다섯 줄을 더해 248로 읽는 걸 막는다.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `t`(재생 초) → 지표 목표값 / AI 액션 / 로봇 재배치 / 사이니지 / 로그.
  키프레임 사이는 선형 보간하므로 count-up이 자연스럽게 나온다.
- `t`가 음수인 키프레임은 "대시보드를 열기 전에 AI가 이미 한 일". 항상 포함된다.
- `timeScale: 10` — 재생 1초 = 시뮬 10초. 세 시나리오 모두 60초 재생 = 14:30 → 14:40.
- 인원 = `capacity × crowd / 100`. baseline 합계가 정확히 2,418이 되도록 capacity를 정했다.
- Campus Status는 "가장 나쁜 건물"이 아니다. critical이 하나라도 있으면 CRITICAL,
  caution이 3개 이상이면 CAUTION, 그 외 NORMAL.
  **비상 시나리오(`definition.safeflow !== null`)에서는 CRITICAL로 고정한다.** 이 스케일이 재는 건
  혼잡뿐이라, 대피가 끝나면 불타는 캠퍼스가 NORMAL로 읽히기 때문이다(`kpi.ts`).
- 첫 키프레임이 `t > 0`인 트랙에는 엔진이 `t=0`에 baseline 값을 자동으로 넣는다.
  그래서 **집결지 건물은 `t=28`에 baseline 값을 한 번 박아 둔다.** 그러지 않으면 주차장·학생회관이
  대피 시작 전부터 t=0부터 서서히 차오른다.
- 재생 루프는 매 틱 누적이 아니라 "재생 시작 시점 + 경과 실시간"으로 계산한다.
- `report.ts`의 피크 계산은 키프레임 값만 훑는다. 보간이 선형이라 극값은 항상 키프레임 위에 있다.
- 비상 시나리오의 예측치(89%)는 **실제 도달하는 피크와 같은 값**이다. 해소 후 인사이트 카드가
  그 숫자를 "최고치"로 보여주기 때문에, 회피한 값을 넣으면 카드가 거짓말을 하게 된다.
  회피 이야기는 SafeFlow 쪽 수치(고위험 경로 3개)가 담당한다.
- SafeFlow 수치는 계산이지 입력이 아니다. 인원 유도 124 = 차단 경로 3개의 합(68+41+15) =
  안전 경로 2개의 합(78+46). 개선율 31% = (260−180)/260.
- 로봇 패치는 `buildingId`도 바꿀 수 있다. 안내로봇 02가 학생회관에서 공학관으로 실제로 이동하는데,
  이게 없으면 카드의 위치와 "건물별 배치"가 어긋난다.
- 맵의 유입 흐름 출발지는 `ScenarioDefinition.flowFromBuildingId`에서 온다. 비상은 유출이라 `null`이고,
  대피경로는 SafeFlow 레이어가 따로 그린다.
- **에너지 반올림** — 건물 kW를 각각 반올림하고 그 합을 캠퍼스 합계로 쓴다. 계통 3종은 마지막
  항목이 나머지를 흡수한다. 그래서 화면의 행을 더하면 항상 헤드라인 숫자와 정확히 맞는다.

## Important Files

- `src/lib/simulation/engine.ts` — `deriveState(scenario, elapsed)`. 모든 화면의 단일 진실 원천.
- `src/lib/simulation/report.ts` — `buildScenarioReport(state)` / `formatSimDuration`.
- `src/lib/simulation/safeflow.ts` — `deriveSafeFlow(state)`.
- `src/lib/simulation/energy.ts` — `deriveEnergy(state)`.
- `src/data/scenarios.ts` — 시나리오 타임라인. 숫자를 바꾸려면 여기.
- `src/data/safeflow.ts` — 화재 대응 계획(6단계 · 경로 · 대피 시간). phase의 `t`는 `EMERGENCY` 키프레임과 맞춰야 한다.
- `src/data/buildings.ts` / `campus.ts` / `robots.ts` / `signage.ts` / `energy.ts` / `activity.ts`
- `src/components/simulation/simulation-provider.tsx` — 시나리오/재생 상태.
- `src/components/digital-twin/campus-map.tsx` — SVG 맵 + SafeFlow 레이어.

## Known Issues

- Landing은 Hero / 파이프라인 / CTA만 있다. 명세의 스크롤 내러티브는 Phase 6.
- Event 시나리오는 `available: false` 스텁이다. 선택기에서 비활성으로 보인다.
- `src/components/dashboard/coming-soon.tsx`는 이제 아무도 쓰지 않는다. 행사 페이지를 만들 때
  다시 쓸 수 있어 남겨 두었다. 안 쓸 거면 지워도 된다.
- Digital Twin 맵에서 건물 상자의 옆면 경계선 위를 정확히 클릭하면 반응하지 않는 좁은 구간이 있다.
  윗면·옆면 안쪽은 정상. 투명한 히트 영역 폴리곤을 덧대면 해결된다.
- 평상시 시나리오는 `focusBuildingId` · `insight`가 없어서 실행 리포트에 트리거·결과 칸이 빠진다.
  없는 값을 지어내지 않는 의도된 동작이다.
- 브라우저 도구 스크린샷 아티팩트 두 가지. **DOM은 정상이고 `get_page_text`는 항상 맞는다.**
  - `animate-rise`가 걸린 카드가 흐리게 찍힌다.
  - **SafeFlow 레이어가 켜진 상태에서 스크롤한 뒤 찍으면 화면 전체가 검게 나올 때가 있다.**
    맵의 SMIL 반복 애니메이션(대피 인원 점·화재 링) 때문으로 보인다. 뷰포트를 820px 정도로 좁히고
    `scrollIntoView` 후 2초 기다렸다 찍으면 제대로 나온다.
- DOM에 `div#S:0` 숨은 복사본이 보이는 것은 Next.js 스트리밍 아티팩트다.

## Pending Tasks

**Phase 6 (Polish) — 명세의 마지막 단계.** 아래 순서대로 가면 된다.

1. **Landing 완성** — 실질적으로 유일하게 새로 "만드는" 일이다.
   지금 `src/app/page.tsx`는 Hero / 4단계 파이프라인 / CTA만 있다. 명세가 요구하는 스크롤 섹션
   8개가 통째로 비어 있다: Problem → Perception → Prediction → Decision → Physical Action →
   Use Cases → **SafeFlow** → CTA.
   - 설명문을 늘어놓지 말 것. 큰 타이포그래피와 시각 연출 중심(명세 Landing 절).
   - 이제 SafeFlow가 있으니 Physical Action / SafeFlow 섹션은 대시보드의 실제 장치를 재사용할 수 있다
     (`CampusMap`, `SignageScreen`, AI Action 카드). 랜딩용으로 숫자를 새로 적지 말고
     `src/data/`에서 끌어올 것.
   - Hero 버튼 2개는 이미 있다: [Explore CampusBrain] [View Simulation].
   - 스크롤 연출도 CSS만. `prefers-reduced-motion`을 반드시 존중할 것.

2. **반응형 점검** — 데스크톱 우선으로 만들어 `xl:` 기준 레이아웃이 대부분이고,
   태블릿·모바일 폭에서는 **한 번도 확인하지 않았다.** 확인할 곳:
   KPI 6칸 / 사이니지 12장 / 로봇 14장 + 필터 칩 / SafeFlow 6단계 그리드 / 대피 경로 행 /
   Topbar(배지·시나리오 선택기·재생 컨트롤이 한 줄에 안 들어간다) / 사이드바.

3. **데모 흐름 최종 검증** — 조각별로는 다 확인했지만 **끊김 없이 한 번에 통과시켜 본 적이 없다.**
   소개 → Dashboard → 공학관 선택 → 혼잡 시뮬 → AI 예측 → 물리 제어 → 비상 시뮬 → SafeFlow →
   AI 리포트에서 대응 기록 확인. 명세 목표는 발표자가 2~3분 안에 직접 조작하는 것이다.

4. **잔여 이슈 정리** (전부 작다, 상세는 Known Issues)
   - 맵 건물 옆면 경계선의 클릭 사각지대 → 투명 히트 영역 폴리곤
   - 미사용이 된 `coming-soon.tsx` → 행사 페이지를 안 만들 거면 삭제
   - 마지막에 `npm run typecheck` / `lint` / `build` 3종 재확인

**선택 — 행사(졸업작품전) 시나리오.** 명세 Phase 목록에는 없다. 넣는다면 Phase 5와 같은 순서
(타임라인 → 필요하면 페이지 → 리포트)지만, 새 페이지 없이 기존 화면들이 그대로 반응한다.

## Last Session Summary

Phase 5(Emergency / SafeFlow)를 계획 승인 후 세 단계로 나눠 만들고 단계마다 브라우저로 확인했다.

1. 시나리오 타임라인 — `EMERGENCY` 키프레임 21개, `data/safeflow.ts`, `lib/simulation/safeflow.ts`,
   `types`에 SafeFlow 타입 5종과 `ScenarioDefinition.safeflow`.
2. 페이지 — `components/emergency/` 5개, 맵 레이어, `globals.css`에 `@keyframes draw`,
   `TwinPanel`의 `legend` prop, 사이드바 `ready: true`.
3. 리포트 — `ScenarioReportCard`에 SafeFlow 블록. `buildScenarioReport`는 손대지 않았다.

지나가다 고친 것 — (a) 집결지 건물이 대피 시작 전부터 차오르던 문제를 `t=28` baseline 앵커로 막았다.
(b) 로봇 패치가 `buildingId`를 못 바꿔서 안내로봇 02의 위치와 배치가 어긋나던 것을 타입 확장으로 고쳤다.
(c) 화재 마커가 붉은 건물 위에서 안 보여 어두운 후광을 깔았다.

`tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과.
비상 시나리오를 개요·사이니지·로봇·리포트·트윈·비상 페이지에서 끝까지 재생해 확인했고,
혼잡 시나리오도 다시 완주시켜 리포트가 3건 / 91%→68%로 그대로인지 확인했다(SafeFlow 블록은 안 나온다).
`a9cad41` feat / `3007838` docs로 커밋하고 origin/main에 푸시했다.
