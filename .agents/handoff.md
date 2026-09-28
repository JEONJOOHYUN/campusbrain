# Handoff

마지막 갱신: 2026-09-28 (세션 7)

## Current Goal

**명세에 적힌 것이 전부 끝났다.** Phase 1~6 + 선택 항목이던 행사 시나리오까지.
스텁은 하나도 없다 — 시나리오 4종 모두 `available: true`, 사이드바 8개 메뉴 전부 동작.
`typecheck` / `lint` / `build` 3종 통과, 프로덕션 빌드에서 직접 로드도 확인했다.

세션 7에서 저장소 바깥 산출물 두 개가 더해졌다.

- `README.md` — 저장소 첫 화면. 없던 것을 새로 썼다.
- **3분 광고영상** — 대본은 `docs/promo-video.md`, 완성본과 작업 파일은
  `C:\dev\campusbrain-video\`(저장소 밖). 아래 `광고영상` 절 참고.

**지금 당장 해야 할 일은 없다.** 다음에 손댈 만한 것은 `Known Issues` 와
영상 폴더 README 의 `아직 남은 것` 에 모아 두었다. 전부 선택 사항이다.

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
- **Event 시나리오** — 졸업작품전. 학생회관 광장 71% → 88% 피크 → AI 대응 4건 → 74%.
  아래 "Event 시나리오" 절 참고.
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

## Event 시나리오 (세션 6)

졸업작품전. **혼잡과 다른 점은 "몰리는 걸 막는" 게 아니라 "어디로 걸을지를 정하는"
것이다.** 방문객은 주차장에 차를 대고 공학관 3층 전시장으로 향한다. 그냥 두면
전부 학생회관 광장 한 곳을 통과하므로, AI가 절반을 중앙 보행로(본관 경유)로 쪼개고
놀고 있던 안내로봇 2대를 그 경로에 투입한다.

- `focusBuildingId: "student-center"` / `flowFromBuildingId: "parking"`.
  전시장은 공학관이지만 **AI가 막는 혼잡은 학생회관 광장**이라 focus가 거기다.
  맵의 유입 곡선은 주차장 → 학생회관으로 그려진다.
- 예측 88%는 **실제로 도달하는 피크와 같은 값**이다(t=24). 인사이트 카드가 해소 후
  그 숫자를 "최고치"로 재사용하기 때문이다 — 혼잡·비상과 같은 규칙.
- AI 대응 4건: 행사 안내 사이니지(3면) / 광장 우회 안내(1면) / 안내로봇 2대 투입 /
  전시장 전용 엘리베이터. 사이니지는 6면이 바뀐다(주차장 게이트·엘리베이터 홀 포함).
- 로봇 패치 2건은 `buildingId`까지 옮긴다. GDE-01 본관→공학관, GDE-04 도서관→주차장.
  둘 다 `대기` → `안내 중`이라 "안내로봇 활성화"가 로봇 페이지에서 실제로 보인다.
- **끝나도 CAUTION으로 남는다.** 행사일은 원래 붐빈다. AI가 없앤 건 집중이지
  방문객이 아니다. 끝에 caution인 세 번째 건물(본관 71%)은 **AI가 그리로 보냈기 때문에**
  붐비는 것이다. 혼잡 시나리오가 NORMAL로 끝나는 것과 의도적으로 다르다.
- 최종: 인원 3,030 / 혼잡 구역 5 / AI 대응 51(47+4) / 리포트 71%→88%→74%.

## 광고영상 (저장소 밖)

3분짜리 홍보영상을 만들어 두었다. **작업물은 저장소에 없다** — 500MB가 넘어서
`C:\dev\campusbrain-video` 에 따로 있다. 저장소에는 대본만 있다(`docs/promo-video.md`).

- 완성본: `out/campusbrain-ad.mp4` (1920×1080 · 정확히 180초)
- 28컷 = 실사 스톡 10(Pexels) + 제품 화면 9 + 합성 5 + 타이포 카드 4
- 나레이션 11줄은 네이버 클로바 더빙, 음악은 Pixabay. 둘 다 상업 이용 가능
- 빌드: `node build.js`(영상) / `node mix.js`(소리). 자세한 건 그 폴더 README

**제품 화면 캡처에 썼던 임시 패치는 되돌려 놓았다.** 다시 찍으려면
`simulation-provider.tsx` 에 `?t=<초>` 를 읽는 코드를 넣었다 빼야 한다.
그게 없으면 헤드리스 브라우저가 시나리오 중간 시점을 찍을 수 없다.
방법과 함정(count-up 때문에 숫자가 틀리게 찍히는 것 등)은 영상 폴더 README 에 있다.

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
- 건물 상세 패널의 하단 버튼은 **그 건물을 focus로 갖는 실행 가능한 시나리오 전부**를
  띄운다. 공학관은 2개(혼잡·비상), 학생회관은 1개(행사), 나머지는 0개라 푸터가 없다.
  시나리오를 하나 하드코딩하지 않는다.

## Simulation Decisions

- 시나리오 = 키프레임 타임라인. `deriveState(scenario, elapsed)`가 단일 진실 원천.
- `timeScale: 10` — 재생 1초 = 시뮬 10초. 네 시나리오 모두 60초 재생 = 14:30 → 14:40.
- 인원 = `capacity × crowd / 100`. baseline 합계가 정확히 2,418.
- Campus Status는 "가장 나쁜 건물"이 아니다. 비상 시나리오에서는 CRITICAL로 고정한다.
- 집결지 건물은 `t=28`에 baseline 값을 박아 둔다(엔진의 t=0 자동 앵커 때문).
- **예측치는 실제 도달하는 피크와 같은 값이어야 한다**(혼잡 91 · 행사 88 · 비상 89).
  인사이트 카드가 해소된 뒤 그 숫자를 "최고치"로 재사용하기 때문에, 회피한 값을 넣으면
  카드가 거짓말을 하게 된다.
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
- `src/components/digital-twin/building-detail-panel.tsx` — 하단 시나리오 실행 버튼은
  `SCENARIO_ORDER`를 `focusBuildingId`로 걸러서 만든다.

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

코드는 거의 건드리지 않았다. 저장소에 없던 문서 두 개를 쓰고, 그 다음 시간 대부분을
광고영상을 실제로 만드는 데 썼다.

1. **`README.md`** — 저장소에 첫 화면이 없었다. 프로젝트가 무엇을 보여주려는지,
   시나리오 4종, 화면 9개, 발표자가 클릭할 데모 경로를 적었다. 수치는 전부
   `src/data/` 에서 직접 세어 넣었다(센서 171, 수용 4,546, 키프레임 7/13/17/19 등).
2. **`docs/promo-video.md`** — 3분 광고 제작 대본. 28컷 샷 리스트, 나레이션 11줄,
   웹 화면 녹화 체크리스트, 그리고 영상에 나오는 모든 숫자의 출처 표.
3. **영상 제작** — ffmpeg 를 winget 으로 깔고 실제로 180초 MP4 를 만들었다.
   자세한 건 `광고영상` 절.

코드 변경은 **없다.** 제품 화면 캡처를 위해 `simulation-provider.tsx` 에 `?t=<초>`
패치를 잠깐 넣었지만 끝나고 되돌렸고, `git status` 는 깨끗하다.

### 영상 만들며 배운 것 (다시 할 때 시간 아끼려면)

- **제품 화면은 헤드리스 Chrome 으로 2배 배율 PNG 를 찍어 정지 컷으로 쓴다.**
  `zoompan` 으로 느린 줌인을 넣었더니 UI 글자가 떨렸다. 정수 픽셀 크롭 때문이다.
- **`--force-prefers-reduced-motion` 없이 찍으면 숫자가 틀린다.** `useCountUp` 이
  `requestAnimationFrame` 을 쓰는데 가상 시간에서 중간값에 멈춘다. 실제로
  잔류 인원이 68명 대신 4명으로 찍혔다.
- **같은 그림을 페이드아웃 후 페이드인하면 깜빡임으로 보인다.** 40초 지점이 그랬다.
- **스톡은 제목만 보고 고르면 안 된다.** 첫 시도에서 10개 중 5개가 엉뚱했다
  (공항 전광판, 가정용 로봇청소기, 초등학교 교실…). 프레임을 뽑아 보고 골라야 한다.

### 이전 세션 (세션 6)

선택 항목이던 행사(졸업작품전) 시나리오를 구현했다. 새 페이지 없이 타임라인 하나를
추가한 것이 전부고, 나머지 화면은 `available` 과 `deriveState` 만 보고 있어서 그냥
동작했다. 건물 상세 패널의 시나리오 실행 버튼도 `focusBuildingId` 기준으로 일반화했다.
