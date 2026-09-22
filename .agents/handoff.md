# Handoff

마지막 갱신: 2026-09-23 (세션 1)

## Current Goal

Milestone 1 완료. 다음은 Phase 3(Core Dashboard 보강) → Phase 4(Crowd / Signage / Robot / Energy / AI Reports).

## Fixed Decisions

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4. `create-next-app`을 쓰지 않고 설정 파일을 직접 작성했다.
- **추가 런타임 의존성 0개.** dependencies는 next / react / react-dom 뿐.
- shadcn/ui 패키지를 설치하지 않았다. Button / Card / Badge / Progress는 `src/components/ui/`에 직접 작성한 로컬 프리미티브.
  나중에 Select·Tooltip처럼 진짜 Radix 동작이 필요해지면 그때 정식 도입을 제안할 것.
- 아이콘도 의존성 없이 `src/components/icons.tsx`의 인라인 SVG.
- Digital Twin은 인라인 SVG 아이소메트릭. Three.js / R3F 없음.
- 애니메이션은 CSS만. Framer Motion 없음.
- Paperlogy 9종은 `C:\dev\maple-dashboard\fonts\Paperlogy\`에서 복사해 `src/app/fonts/`에 두었다(사용자 승인).

## Implemented Features

- Landing `/` — Hero, 4단계 파이프라인, CTA, 장식용 아이소메트릭 SVG. (스크롤 내러티브 전체는 Phase 6)
- Dashboard 레이아웃 — Sidebar(8개 메뉴, 미구현은 "준비중"), Topbar(시뮬레이션 모드 배지, 시나리오 선택기, 재생/일시정지/리셋, 시뮬 시계).
- Overview `/dashboard` — KPI 6종, Digital Twin, Buildings 리스트, AI Insight, 최근 AI 활동(최근 5건 + 전체 보기 →).
- Digital Twin `/dashboard/twin` — 같은 맵의 넓은 버전 + AI Insight + Buildings.
- Building Detail Panel — 커스텀 Sheet(백드롭, Escape, 포커스 복원). 인원/예상인원/혼잡도/온도/공기질/에너지/로봇/센서/AI 판단/AI Action, 그리고 [혼잡 시뮬레이션 실행].
- Crowd 시나리오 전체 — 82% → 91% 피크 → AI 대응 3건 → 68% 안정화 → RESOLVED.
- Coming soon 페이지 6개: crowd / signage / robots / energy / emergency / reports.

## Current Work

없음. Milestone 1 완료 후 정지. 커밋하지 않았다(사용자 허락 대기).

## Design Decisions

- **화면 텍스트는 전부 한글.** 상태값(NORMAL / CAUTION / CRITICAL, LOW / MODERATE / HIGH, ONLINE, WARNING, RESOLVED),
  코드(ENG-C2, CLN-04), 브랜드명, 단위만 영문으로 남긴다. 코드 주석은 영문 유지. 자세한 규칙은 CLAUDE.md.
- 건물명·로봇명도 한글이다(본관 / 공학관 / 학생회관 / 도서관 / 체육관 / 주차장, 청소로봇 / 안내로봇 / 배송로봇 / 보안로봇).
- 색·상태 톤은 `src/components/dashboard/status.ts` 한 곳에서만 만든다. 맵 SVG는 `tone.css`(CSS 변수)를 쓴다.
- `SimulatedTag`는 예측값과 Confidence에만 붙인다. 관측값에는 붙이지 않는다.
- count-up은 마운트 1회만 동작하고 이후엔 시뮬레이션 값을 그대로 통과시킨다(`src/hooks/use-count-up.ts`).
  시뮬레이션 루프가 이미 값을 보간하므로 서로 싸우지 않게 하기 위함.

## Important Files

- `src/lib/simulation/engine.ts` — `deriveState(scenario, elapsed)`. 모든 화면의 단일 진실 원천.
- `src/data/scenarios.ts` — 시나리오 타임라인. 숫자를 바꾸려면 여기.
- `src/data/buildings.ts` — 건물 6개 + 아이소메트릭 좌표 + baseline 지표.
- `src/data/campus.ts` — 혼잡도 임계값, KPI 기준값.
- `src/components/simulation/simulation-provider.tsx` — 시나리오/재생 상태.
- `src/components/digital-twin/campus-map.tsx` — SVG 맵.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `t`(재생 초) → 지표 목표값 / AI 액션 / 로봇 재배치 / 로그.
  키프레임 사이는 선형 보간하므로 count-up이 자연스럽게 나온다.
- `t`가 음수인 키프레임은 "내가 대시보드를 열기 전에 AI가 이미 한 일". 항상 포함된다.
  최근 AI 활동이 처음부터 비어 있지 않은 이유.
- `timeScale: 10` — 재생 1초 = 시뮬레이션 10초. Crowd는 60초 재생 = 시뮬 10분(14:30 → 14:40).
- 로그 시각은 `t`에서 계산된다. 명세의 예시(14:32 Predict, 14:33 Signage, 14:34 Elevator, 14:35 Robot)와 일치하도록 `t`를 맞춰 두었다.
- 인원 = `capacity × crowd / 100`. 별도 트랙을 두지 않는다. baseline 합계가 정확히 2,418이 되도록 capacity를 정했다.
- Campus Status는 "가장 나쁜 건물"이 아니다. critical 건물이 하나라도 있으면 CRITICAL,
  caution이 3개 이상이면 CAUTION, 그 외 NORMAL. (baseline이 NORMAL이어야 하므로)
- 첫 키프레임이 `t > 0`인 지표 트랙에는 엔진이 `t=0`에 baseline 값을 자동으로 넣는다.
  넣지 않으면 시나리오가 이미 변한 상태로 시작한다.
- 재생 루프는 매 틱 누적이 아니라 "재생 시작 시점 + 경과 실시간"으로 계산한다. 누적하면 종료 시각이 어긋난다.

## Known Issues

- Landing은 Hero / 파이프라인 / CTA만 있다. 명세의 스크롤 내러티브(Problem → … → SafeFlow)는 Phase 6.
- Event / Emergency 시나리오는 `available: false` 스텁이다. 선택기에서 비활성으로 보인다.
- Digital Twin 맵에서 건물 상자의 옆면 경계선 위를 정확히 클릭하면 반응하지 않는 좁은 구간이 있다.
  윗면·옆면 안쪽은 정상. 필요하면 투명한 히트 영역 폴리곤을 덧대면 된다.
- AI 리포트로 가는 `전체 보기 →`는 아직 Coming soon 페이지로 연결된다.

## Pending Tasks

1. Phase 3 — Overview 보강(건물별 상세 지표, Loading/Empty state).
2. Phase 4 — Crowd Flow, Smart Signage, Robot Monitoring, Energy, AI Reports(전체 로그 + 필터 + 실행 리포트).
   `activity.ts`, `signage.ts`는 그때 만든다. 지금은 쓰지 않으므로 만들지 않았다.
3. Phase 5 — Emergency / SafeFlow 6단계.
4. Phase 6 — Landing 완성, 반응형·애니메이션 다듬기.

## Last Session Summary

빈 디렉터리에서 시작해 Foundation + Milestone 1을 구현하고 브라우저에서 끝까지 검증했다.
`tsc --noEmit`, `npm run lint`, `npm run build` 모두 통과.

검증 중 찾아 고친 것 3가지:

1. 첫 키프레임이 `t > 0`인 트랙이 그 값을 과거로 끌고 와서 baseline 인구가 2,466으로 시작했다 → 엔진에서 `t=0` baseline 자동 삽입.
2. **대시보드 레이아웃의 `<Suspense>` + `useSearchParams` 조합에서, `/dashboard`를 직접 로드하면 하이드레이션이 8개 노드에서 멈추고 화면 전체가 클릭에 반응하지 않았다.**
   클라이언트 네비게이션으로 들어오면 정상이라 한참 헤맸다.
   → `export const dynamic = "force-dynamic"` + `<Suspense>` 제거로 해결. 둘 다 되돌리지 말 것.
3. 재생 루프의 틱 누적 오차로 종료 시각이 14:40이 아니라 14:39로 끝났다 → 시작 시점 기준 계산으로 변경.

커밋은 하지 않았다.

### 추가 작업 (같은 세션)

사용자 요청으로 화면 텍스트를 전부 한글화했다. 건물명·로봇명·시나리오 라벨·로그 문구·AI 인사이트·KPI·사이드바까지 포함한다.
상태값과 코드·브랜드명은 영문으로 남겼다.
한글 라벨이 길어지면서 AI 인사이트 카드의 세 지표(현재 / N분 후 예측 / 신뢰도) baseline이 어긋나 라벨 영역에 `min-h-9`를 줬다.
