# Handoff

마지막 갱신: 2026-09-23 (세션 5)

## Current Goal

**Phase 6(Polish) 완료. 명세의 Phase 목록이 전부 끝났다.**

Landing 스크롤 8섹션, 반응형, 데모 흐름 완주, 잔여 이슈 정리까지 했다.
`typecheck` / `lint` / `build` 3종 통과, 프로덕션 빌드에서도 직접 로드를 확인했다.

남은 선택 항목은 **행사(졸업작품전) 시나리오** 하나뿐이다. `EVENT`는 여전히
`available: false` 스텁이고, 명세 Phase 목록에는 없다. 랜딩 Use Cases에도
"준비 중"으로 정직하게 노출된다.

## Fixed Decisions

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4. `create-next-app`을 쓰지 않고 설정 파일을 직접 작성했다.
- **추가 런타임 의존성 0개.** dependencies는 next / react / react-dom 뿐.
- shadcn/ui 패키지를 설치하지 않았다. Button / Card / Badge / Progress / Skeleton / EmptyState는
  `src/components/ui/`의 로컬 프리미티브. 아이콘도 `src/components/icons.tsx`의 인라인 SVG.
- Digital Twin은 인라인 SVG 아이소메트릭(960x560). Three.js / R3F 없음.
- 애니메이션은 CSS만. Framer Motion 없음. 맵의 반복 모션만 SVG SMIL을 쓴다.
- Paperlogy 9종은 `src/app/fonts/`에 있다.
- **캠퍼스는 가상 6개소**: 본관 / 공학관 / 학생회관 / 도서관 / 체육관 / 주차장.

## Environment

- Python이 동작하지 않는다(스텁만 설치됨). 일괄 치환은 **node** 스크립트로 쓸 것.
- Bash 도구의 heredoc에 **아포스트로피가 들어가면 파싱이 깨진다**.
  정규식보다 `indexOf` / `split().join()` 같은 문자열 조작이 안전하다.
- **`git stash pop` 뒤에는 파일이 CRLF가 된다.** node로 치환할 때
  `.split("\r\n").join("\n")`로 먼저 정규화하지 않으면 여러 줄 매칭이 전부 실패한다.
- 브라우저 프리뷰는 `C:\dev\.claude\launch.json`의 **campusbrain-dev**(3002) /
  **campusbrain-prod**(3003). prod는 `npm run build` 뒤 **반드시 재시작**해야
  새 빌드를 집는다(`reused: true`면 옛 빌드를 그대로 서빙한다).

## Implemented Features

- **Landing `/`** — Hero + 체인 한 줄 + 스크롤 8섹션 + CTA. 아래 "Landing" 절 참고.
- Dashboard 레이아웃 — Sidebar(lg 이상), MobileNav(lg 미만), Topbar.
- Overview `/dashboard` — KPI 6종, Digital Twin, Buildings, AI Insight, 최근 AI 활동.
- Digital Twin `/dashboard/twin` — 넓은 맵 + AI Insight + Buildings.
- Building Detail Panel — 커스텀 Sheet(백드롭, Escape, 포커스 복원).
- Crowd 시나리오 — 82% → 91% 피크 → AI 대응 3건 → 68% 안정화 → RESOLVED.
- 인원 흐름 / 스마트 사이니지 / 로봇 관제 / 에너지 / AI 리포트.
- Emergency / SafeFlow — 6단계, 경로 5개, 물리 시스템 5종, 260→180초(31%).

## Landing (Phase 6에서 만든 것)

`src/app/page.tsx`가 조립하고, 섹션은 `src/components/landing/`에 하나씩 있다.

| # | 파일 | 내용 | 숫자 출처 |
|---|---|---|---|
| — | `campus-visual.tsx` | Hero 장식 SVG(기존) | 없음(장식) |
| 1 | `problem-section.tsx` | 센서 171 / 사이니지 12 / 로봇 14 / 인원 2,418 | `BUILDINGS` 합계, `SIGNAGE.length`, `ROBOTS.length`, `deriveState("normal",0)` |
| 2 | `perception-section.tsx` | 평상시 맵 + 건물 6개 센서 판독 | `deriveState("normal",0)` |
| 3 | `prediction-section.tsx` | 87% → 91% 예측 곡선 | 엔진을 t=0..12로 샘플링 + `SCENARIOS.crowd.insight` |
| 4 | `decision-section.tsx` | 관측→예측→판단→실행 4단계 + AI 권고 | `insight.steps`, `insight.recommendation` |
| 5 | `action-section.tsx` | 바뀐 사이니지 5장(`SignageScreen`) + AI Action 3건 + 91→68 | `deriveState("crowd",60)`, `buildScenarioReport` |
| 6 | `use-cases-section.tsx` | 시나리오 4장 카드 | `SCENARIOS` / `SCENARIO_ORDER` |
| 7 | `safeflow-section.tsx` | 6단계 + 비상 맵 + 경로 5개 + 04:20→03:00 | `deriveState("emergency",60)` + `deriveSafeFlow` |
| 8 | `page.tsx` 안 | CTA + 발표자용 데모 경로 5단계 | — |

- **랜딩에 적힌 숫자는 하나도 없다.** 전부 `src/data/` + 엔진에서 파생한다.
  대시보드와 같은 값을 **같은 형식으로** 보여야 한다(대피 시간은 `formatSimDuration`).
- 스크롤 연출은 `globals.css`의 `.reveal` 하나. `animation-timeline: view()`를
  `@supports` + `prefers-reduced-motion: no-preference` 안에서만 쓴다.
  미지원 브라우저는 그냥 보이고, reduce면 아예 걸리지 않는다. **JS·옵저버 없음.**
  형제 간 시차는 `--reveal-step`(= `revealStep(i)`)으로 `animation-range`를 밀어서 준다.
  delay가 아니라 range를 미는 이유는, 스크롤 타임라인에서 delay는 스크롤 위치와 싸우기 때문이다.

## Design Decisions

- **화면 텍스트는 전부 한글.** 상태값·코드·브랜드명·단위만 영문.
  랜딩 섹션의 `PROBLEM` / `PERCEPTION` 같은 라벨은 명세가 쓰는 파이프라인 어휘라 영문으로 두고,
  그 옆에 한글 단계명(문제 / 관측 / 예측 / 판단 / 실행 / 활용 / 비상)을 항상 같이 쓴다.
- 색·상태 톤은 `src/components/dashboard/status.ts` 한 곳에서만 만든다.
- 분류를 뜻하는 색에는 amber/red를 쓰지 않는다. 그 둘은 상태 스케일이 소유한다.
- `SimulatedTag`는 예측값과 Confidence, 실행 리포트, SafeFlow 종료 요약,
  랜딩의 예측 차트와 인원 유도 카드에 붙인다.
- 컴포넌트에 개수를 적지 않는다.
- `TwinPanel`은 `legend` prop을 받는다. 비상 페이지는 `SAFEFLOW_LEGEND`를 넘긴다.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `deriveState(scenario, elapsed)`가 단일 진실 원천.
- `timeScale: 10` — 재생 1초 = 시뮬 10초. 세 시나리오 모두 60초 재생 = 14:30 → 14:40.
- 인원 = `capacity × crowd / 100`. baseline 합계가 정확히 2,418.
- Campus Status는 "가장 나쁜 건물"이 아니다. 비상 시나리오에서는 CRITICAL로 고정한다.
- 집결지 건물은 `t=28`에 baseline 값을 박아 둔다(엔진의 t=0 자동 앵커 때문).
- 비상 시나리오의 예측치(89%)는 실제 도달하는 피크와 같은 값이다.
- SafeFlow 수치는 계산이지 입력이 아니다. 124 = 68+41+15 = 78+46. 31% = (260−180)/260.
- **에너지 반올림** — 건물 kW를 각각 반올림하고 그 합을 캠퍼스 합계로 쓴다.

## Important Files

- `src/lib/simulation/engine.ts` — `deriveState(scenario, elapsed)`.
- `src/lib/simulation/report.ts` — `buildScenarioReport(state)` / `formatSimDuration`.
- `src/lib/simulation/safeflow.ts` — `deriveSafeFlow(state)`.
- `src/lib/simulation/energy.ts` — `deriveEnergy(state)`.
- `src/data/scenarios.ts` — 시나리오 타임라인. 숫자를 바꾸려면 여기.
- `src/data/safeflow.ts` — 화재 대응 계획. phase의 `t`는 `EMERGENCY` 키프레임과 맞춰야 한다.
- `src/components/simulation/simulation-provider.tsx` — 시나리오/재생 상태. URL이 진실 원천.
- `src/components/digital-twin/campus-map.tsx` — **`CampusMap`(프로바이더 연결) /
  `CampusMapView`(순수)** 둘로 나뉘어 있다. 랜딩은 스냅샷을 `CampusMapView`에 넘긴다.
- `src/components/ui/button.tsx` — `Button` 과 `buttonClasses()`.
- `src/components/dashboard/mobile-nav.tsx` — lg 미만에서 사이드바를 대신한다.

## Responsive

데스크톱 우선으로 만든 뒤 Phase 6에서 375 / 768 / 1024 / 1440 네 폭을 전부 확인했다.
**9개 화면(랜딩 + 대시보드 8) 모두 가로 스크롤 0.**

- 사이드바는 `hidden lg:flex`. 그 아래는 Topbar 안의 `MobileNav`(가로 스크롤 스트립)가 맡는다.
- Topbar는 모바일에서 2줄(제목+상태+시뮬 배지 / 시나리오+재생)이고 높이 95px,
  MobileNav 55px을 더해 150px. `SIMULATION MODE` 배지는 sm 미만에서 "시뮬레이션"으로 줄어든다.
- 기존 그리드(KPI 6칸, 사이니지 12장, 로봇 14장, SafeFlow 6단계)는 이미 `sm:`/`md:` 분기가
  있어 손대지 않았다. 실측으로 확인만 했다.
- 검증 방법: 스크린샷 대신 `documentElement.scrollWidth > clientWidth` 와
  "뷰포트 밖으로 나간 요소" 목록을 JS로 뽑는 편이 훨씬 정확하다.

## Known Issues

- Event 시나리오는 `available: false` 스텁이다. 선택기와 랜딩 Use Cases에서 비활성으로 보인다.
- `src/components/ui/skeleton.tsx`는 지금 아무도 쓰지 않는다. `loading.tsx`를 지웠기 때문이다
  (이유는 CLAUDE.md "건드리면 깨지는 것"). 프리미티브는 남겨 두었다.
- 평상시 시나리오는 `focusBuildingId` · `insight`가 없어서 실행 리포트에 트리거·결과 칸이 빠진다.
  없는 값을 지어내지 않는 의도된 동작이다.
- 실행 리포트는 **현재 시나리오의 런만** 보여준다. 시나리오를 바꾸면 사라진다(화면에 명시됨).
- **브라우저 도구 주의사항** (앱 문제가 아니다):
  - 프리뷰 패널이 숨겨져 있으면 페이지가 `document.hidden`이라 렌더가 스로틀된다.
    이때 읽은 `opacity`·경과 시간은 **낡은 값**이다. 재생 진행을 확인하려면 탭을 앞으로 보내거나
    충분히 기다린 뒤 다시 읽을 것.
  - `computer left_click`이 좌표 스케일 때문에 안 맞는 경우가 있다. 요소를 직접
    `.click()` / `dispatchEvent` 하는 편이 확실하다.
  - 맵 SVG(SMIL)가 있는 화면은 스크린샷이 새까맣게 찍힐 때가 있다.
    **DOM은 정상이고 `get_page_text`는 항상 맞는다.**

## Last Session Summary

Phase 6을 계획 승인 뒤 Landing → 반응형 → 데모 흐름 → 잔여 이슈 순으로 진행했다.

1. **맵 분리** — `campus-map.tsx`를 `CampusMap`(연결) / `CampusMapView`(순수)로 쪼갰다.
   대시보드 호출부는 한 줄도 바뀌지 않았다. 랜딩이 실제 맵을 쓸 수 있게 된 유일한 길이었다.
2. **Landing 8섹션** — 위 표대로. `globals.css`에 `.reveal` 추가.
3. **반응형** — 사이드바 `hidden lg:flex`, `MobileNav` 신설, Topbar 재구성,
   `main` 패딩 `px-4 sm:px-6`. 9개 화면 4개 폭 확인.
4. **데모 흐름 완주** — 소개 → Dashboard → 공학관 선택 → 혼잡 시뮬(68%까지 완주) →
   비상 시뮬(6/6 ACTIVATED) → SafeFlow → AI 리포트(SafeFlow 블록 포함)까지 한 번에 통과.

지나가다 고친 것:
- **`dashboard/loading.tsx`가 대시보드 8개 페이지 전부를 직접 로드 시 멈추게 하고 있었다.**
  route 단위 Suspense 경계가 레이아웃의 `useSearchParams`와 겹쳐 boundary가 영영 pending으로
  남는다. `071974e`에도 있던 문제다(stash로 확인). 파일을 지워서 해결했고 CLAUDE.md에 적었다.
- 맵 건물의 클릭 사각지대 → 실루엣 육각형 히트 폴리곤(`silhouettePoints`, `pointerEvents="all"`).
  옆면 이음매를 클릭해도 패널이 열리는 것을 확인했다.
- `<Link><Button>` 중첩을 `<Link className={buttonClasses(...)}>`로 바꿨다.
  (버튼이 안 눌리던 것은 아니다 — 중첩 버튼도 앵커로 버블링해 이동한다. `<a>` 안의 `<button>`이
  잘못된 마크업이고 가운데클릭·새 탭 열기가 깨지기 때문에 고친 것이다.)
- 랜딩의 대피 시간을 대시보드와 같은 `formatSimDuration` 형식(04:20 → 03:00)으로 맞췄다.
- 미사용 `coming-soon.tsx` 삭제.

`npm run typecheck` / `lint` / `build` 모두 통과.
프로덕션 빌드(3003)에서 `/dashboard`, `/dashboard/emergency` 직접 로드를 확인했다.
