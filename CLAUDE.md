# CampusBrain

Physical AI 스마트 캠퍼스 인터랙티브 프로토타입.
전체 명세는 `.agents/project-spec.md`, 이어받을 내용은 `.agents/handoff.md`.

## 반드시 지킬 것

- 실제 센서·로봇·설비 연동이 없다. 예측·신뢰도 등 모델링된 수치에는 `SimulatedTag`를 붙이고,
  헤더의 `SIMULATION MODE` 배지를 제거하지 않는다.
- 컴포넌트에 숫자를 직접 적지 않는다. 모든 값은 `src/data/`에 정의하고
  `deriveState(scenario, elapsed)`로 파생시킨다.
- 시나리오는 `src/data/scenarios.ts`의 키프레임 타임라인에만 둔다. 사이 값은 엔진이 보간한다.
- 의존성을 추가하지 않는다. 필요하면 먼저 이유를 설명하고 묻는다.
  (현재 런타임 의존성: next, react, react-dom 뿐)
- shadcn/ui 패키지 대신 `src/components/ui/`의 로컬 프리미티브를 쓴다.
- 애니메이션은 CSS transition/keyframes만. Framer Motion 금지. `prefers-reduced-motion` 존중.
- 폰트: Paperlogy(`--font-sans`) + Geist Mono(`--font-mono`).
  숫자·시각·상태값에는 `.tnum` 클래스를 붙인다.
- 색은 `globals.css`의 CSS 변수와 Tailwind 토큰만 쓴다. 컴포넌트에 hex를 적지 않는다.
- 빈 상태는 `EmptyState`, 로딩 자리는 `Skeleton`을 쓴다. 새로 만들지 않는다.
- 사용자 허락 없이 commit / push 하지 않는다. Conventional Commits 형식.

## 화면 언어

- 사용자에게 보이는 텍스트는 전부 한글로 쓴다. 새 문구를 추가할 때도 마찬가지다.
- 영문으로 남기는 것: 상태값(`NORMAL` / `CAUTION` / `CRITICAL`, `LOW` / `MODERATE` / `HIGH`,
  `ONLINE`, `WARNING`, `RESOLVED`), 센서·로봇·건물 코드(`ENG-C2`, `CLN-04`),
  브랜드명(`CAMPUSBRAIN`, `Physical AI Campus Operating System`, `The Campus That Thinks.`),
  단위(`AQI`, `°C`, `%`).
- 코드 주석·변수명·타입명은 영문을 유지한다.

## 건드리면 깨지는 것

- `src/app/dashboard/layout.tsx`의 `export const dynamic = "force-dynamic"`를 지우지 말 것.
  대시보드는 매 렌더마다 `?scenario=`를 읽는다.
- 대시보드 레이아웃을 `<Suspense>`로 감싸지 말 것.
  `useSearchParams`와 겹치면 직접 로드 시 하이드레이션이 멈춘다(2026-09-23 확인).
- 같은 이유로 `src/app/dashboard/` 아래에 `loading.tsx`를 두지 말 것.
  route 단위 Suspense 경계가 생기고, 레이아웃의 `useSearchParams`와 겹쳐
  **8개 페이지 전부가 직접 로드 시 스켈레톤에서 멈춘다**(2026-09-23 확인, dev/prod 동일).
  대시보드는 서버 데이터 페칭이 없고 프로바이더에서 즉시 파생되므로 로딩 구간 자체가 없다.
- `<Link>` 안에 `<Button>`을 넣지 말 것. `<a>` 안의 `<button>`은 잘못된 마크업이다.
  링크를 버튼처럼 보이게 하려면 `buttonClasses()`를 `<Link className={...}>`에 쓴다.

## 검증

`npm run typecheck`, `npm run lint`, `npm run build` 세 개를 모두 통과시키고,
브라우저에서 Milestone 흐름을 직접 클릭해 확인한다.
데모 흐름: 소개 → Dashboard → 공학관 선택 → 혼잡 시뮬 → 비상 시뮬 → SafeFlow → AI 리포트.
