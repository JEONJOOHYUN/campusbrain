<div align="center">

# CAMPUSBRAIN

**Physical AI Campus Operating System**

공간이 사람을 이해하는 순간.

AI가 캠퍼스를 보고, 상황을 예측하고, 공간을 움직입니다.

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Runtime deps](https://img.shields.io/badge/runtime%20deps-3-49D17D?style=flat-square)

</div>

---

> [!IMPORTANT]
> **이것은 상용 시스템이 아닙니다.** 실제 CCTV·IoT 센서·로봇·엘리베이터·화재 설비와
> 연결되어 있지 않으며, 화면의 모든 수치는 시뮬레이션 데이터입니다.
> 그 사실을 숨기지 않는 것이 이 프로젝트의 설계 원칙입니다 — 헤더에 `SIMULATION MODE`
> 배지가 항상 떠 있고, 예측값·신뢰도처럼 모델링된 수치에는 `시뮬레이션` 태그가 붙습니다.

<br>

## 무엇을 하는 프로젝트인가

대학 캠퍼스를 **Physical AI가 운영하면 어떤 모습인지**를, 웹에서 직접 조작해 체험하는
인터랙티브 프로토타입입니다.

관리자용 CRUD 화면이 아닙니다. 보여주려는 것은 네 단계 루프입니다.

```
물리 공간  →  카메라 · 센서 · IoT  →  CampusBrain AI
                                        │
                        관측 → 예측 → 판단 → 실행
                                        │
        사이니지 · 로봇 · 엘리베이터 · 출입문 · 냉난방
```

핵심은 **마지막 화살표**입니다. 대부분의 대시보드는 "예측했습니다, 담당자에게 알림을
보냈습니다"에서 끝납니다. 여기서는 AI가 직접 물리 시스템을 움직입니다. 승인 버튼이
없습니다. 사이니지 문구가 바뀌고, 엘리베이터가 분산되고, 청소로봇이 경로를 비키고,
비상시에는 출입문이 열립니다.

<br>

## 시나리오 4종

가상 캠퍼스 6개소(본관 · 공학관 · 학생회관 · 도서관 · 체육관 · 주차장)에서 상황을
재생합니다. 각 시나리오는 **60초 재생 = 시뮬레이션 10분**(14:30 → 14:40)입니다.

| | 이야기 | AI가 하는 일 | 결과 |
|:--|:--|:--|:--|
| **평상시** | 조용한 화요일 오후 | 빈 강의실 ECO 전환, 청소 일정 재배정 | `NORMAL` |
| **혼잡** | 수업 종료, 공학관에 몰림 | 82% → **91% 예측** → 우회 사이니지 · 엘리베이터 분산 · 로봇 경로 변경 | 68% `NORMAL` |
| **행사** | 졸업작품전 외부 방문객 | 광장 **88% 예측** → 동선을 중앙 보행로로 분산 · 안내로봇 2대 투입 | 74% `CAUTION` |
| **비상** | 공학관 3층 동편 화재 | 감지 → 위험구역 → 인원위치 → **안전경로 산출** → 물리 5종 → 대피 | 9% · SafeFlow |

시나리오를 바꾸면 **대시보드 8개 화면이 같은 데이터에서 함께 움직입니다.** KPI, 디지털 트윈,
인원 흐름, 사이니지 12면, 로봇 14대, 에너지, AI 리포트가 전부. 숫자만 갈아 끼우는 것이
아닙니다.

### SafeFlow — 가장 강한 데모

비상 시나리오는 6단계를 순서대로 완료하고, 맵에 화재 마커 · 위험 구역 · 차단 경로 3개 ·
안전 경로 2개가 단계별로 켜집니다.

```
화재 감지 → 위험 구역 분석 → 인원 위치 분석 → 안전 경로 산출 → 물리 시스템 연동 → 대응 활성화
```

차단된 경로의 **124명**(68 + 41 + 15)이 안전 경로 2개(78 + 46)로 그대로 재배분됩니다.
양쪽 합이 같은 것은 우연이 아니라 계산입니다. 대피 개선율 31%도 `(260 − 180) / 260`으로
화면에서 검산할 수 있습니다.

<br>

## 화면

| 경로 | 화면 | 내용 |
|:--|:--|:--|
| `/` | **Landing** | Hero + 스크롤 8섹션 (Problem → Perception → Prediction → Decision → Physical Action → Use Cases → SafeFlow → CTA) |
| `/dashboard` | **개요** | KPI 6종 · 디지털 트윈 · 건물 목록 · AI 인사이트 · 최근 AI 활동 |
| `/dashboard/twin` | **디지털 트윈** | 넓은 아이소메트릭 맵 · 건물 클릭 시 상세 패널 |
| `/dashboard/crowd` | **인원 흐름** | 구역별 혼잡도 · 추세 · 유입 흐름 곡선 |
| `/dashboard/signage` | **스마트 사이니지** | 디스플레이 12면 미리보기 · AI 메시지 변경 이력 |
| `/dashboard/robots` | **로봇 관제** | 로봇 14대 · 건물별 배치 · AI 재배치 현황 |
| `/dashboard/energy` | **에너지** | 계통 3종 · 건물별 전력 · AI 자동 제어 |
| `/dashboard/emergency` | **비상 대응** | SafeFlow 6단계 · 대피 경로 · 종료 요약 |
| `/dashboard/reports` | **AI 리포트** | 시나리오 실행 리포트 · AI 활동 로그 전체 |

<br>

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 랜딩 페이지가 열립니다.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # next build
```

### 데모 경로

발표자가 클릭할 순서입니다. 랜딩 페이지 하단 CTA에도 링크로 박혀 있습니다.

1. **소개** — 랜딩에서 관측 → 예측 → 판단 → 실행을 훑는다
2. **개요** — 캠퍼스 전체 상태 확인 (인원 2,418 · `NORMAL`)
3. **디지털 트윈** — 맵에서 **공학관** 클릭 → 상세 패널
4. **혼잡 시뮬레이션 실행** — 패널 하단 버튼에서 바로 재생
5. **AI 예측 → 물리 제어** — 91% 예측이 뜨고 사이니지 · 엘리베이터 · 로봇이 순서대로 작동
6. **비상 시뮬레이션 실행** — 같은 패널의 두 번째 버튼
7. **SafeFlow** — 6단계 완료 · 대피 경로 · 인원 유도 124명
8. **AI 리포트** — 대응 기록과 실행 요약 확인

> [!TIP]
> 건물 상세 패널 하단에는 **그 건물을 focus로 갖는 시나리오**가 전부 뜹니다.
> 공학관은 2개(혼잡 · 비상), 학생회관은 1개(행사). 맵 하나로 데모 전체를 조종할 수 있습니다.
> 세 시나리오를 모두 돌리면 재생만 3분이므로, 시간이 빠듯하면 **혼잡 + 비상** 두 개를 권합니다.

<br>

## 어떻게 만들어졌나

### 단일 진실 원천

화면 어디에도 숫자를 적지 않습니다. 모든 값이 `deriveState(scenario, elapsed)` 하나에서
나옵니다. 시나리오는 키프레임 타임라인이고, 사이 값은 엔진이 선형 보간합니다 — 그래서
count-up이 자연스럽게 나옵니다.

```
src/data/scenarios.ts        키프레임 타임라인 (숫자를 바꾸려면 여기)
        ↓
src/lib/simulation/engine.ts deriveState(scenario, elapsed)
        ↓
   kpi.ts · report.ts · safeflow.ts · energy.ts   (파생 레이어)
        ↓
              모든 화면
```

**랜딩 페이지도 마찬가지입니다.** 랜딩의 "센서 171대"는 건물 6개 `sensors`의 합이고,
"91%"는 혼잡 시나리오의 `insight.prediction`이며, 예측 곡선은 엔진을 `t=0..12`로
샘플링해 그립니다. 대시보드와 랜딩이 다른 숫자를 말하는 것이 구조적으로 불가능합니다.

### 런타임 의존성 3개

`next` · `react` · `react-dom`. 그게 전부입니다.

| 보통 쓰는 것 | 여기서는 |
|:--|:--|
| Three.js / R3F | 인라인 SVG 아이소메트릭 (960 × 560) |
| Recharts / Chart.js | 직접 그린 SVG |
| shadcn/ui · Radix | `src/components/ui/` 로컬 프리미티브 6종 |
| lucide-react | `src/components/icons.tsx` 인라인 SVG |
| Framer Motion | CSS `@keyframes` + `animation-timeline: view()` |

애니메이션은 전부 CSS이고 `prefers-reduced-motion`을 존중합니다. 랜딩의 스크롤 연출은
`@supports (animation-timeline: view())` 안에서만 동작하므로, 미지원 브라우저에서는
내용이 그냥 보입니다. **JavaScript 옵저버가 없습니다.**

### 정직함이 제약으로 박혀 있다

- **예측치는 실제 도달하는 피크와 같은 값이어야 한다.** 인사이트 카드가 해소된 뒤 그
  숫자를 "최고치"로 재사용하기 때문에, 회피한 값을 넣으면 카드가 거짓말을 하게 됩니다.
- **비상 시나리오는 캠퍼스 상태를 `CRITICAL`로 고정한다.** 혼잡 스케일이 재는 것은
  혼잡뿐이라, 대피가 끝나 건물이 텅 비면 불타는 캠퍼스를 `NORMAL`로 읽게 됩니다.
- **에너지 반올림은 행의 합과 헤드라인이 항상 맞도록 한다.** 건물 kW를 각각 반올림하고
  그 합을 캠퍼스 합계로 씁니다.
- **컴포넌트에 개수를 적지 않는다.** AI Action의 `5 / 5`도 타임라인에서 셉니다.

<br>

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              Landing (섹션 조립)
│   ├── globals.css           디자인 토큰 · 키프레임 · .reveal
│   └── dashboard/            8개 라우트 + layout
├── components/
│   ├── landing/              스크롤 8섹션
│   ├── dashboard/            Sidebar · Topbar · MobileNav · KPI · status.ts
│   ├── digital-twin/         CampusMap / CampusMapView · 건물 상세 패널
│   ├── simulation/           SimulationProvider · 시나리오 선택기 · 재생 컨트롤
│   ├── crowd/ signage/ robots/ energy/ emergency/ reports/
│   └── ui/                   Button · Card · Badge · Progress · Skeleton · EmptyState
├── data/                     ★ 모든 숫자가 사는 곳
│   ├── scenarios.ts          키프레임 타임라인 4종
│   ├── safeflow.ts           화재 대응 계획 (6단계 · 경로 5개)
│   ├── buildings.ts campus.ts robots.ts signage.ts energy.ts activity.ts
├── lib/simulation/
│   ├── engine.ts             deriveState — 단일 진실 원천
│   ├── kpi.ts report.ts safeflow.ts energy.ts clock.ts
└── types/index.ts
```

<br>

## 데이터 한눈에

| | |
|:--|:--|
| 건물 | 6개소 (수용 합계 4,546명) |
| 센서 | 171대 |
| 디지털 사이니지 | 12면 (1면 점검 중) |
| 로봇 | 14대 (청소 · 안내 · 배송 · 보안) |
| 평상시 재실 인원 | 2,418명 |
| 시나리오 키프레임 | 평상시 7 · 혼잡 13 · 행사 17 · 비상 19 |
| AI 대응 | 혼잡 3건 · 행사 4건 · 비상 5건 |
| 사전 활동 로그 | 23건 (오늘 AI 대응 47의 근거) |

<br>

## 화면 언어

사용자에게 보이는 텍스트는 **전부 한글**입니다. 영문으로 남기는 것은 다음뿐입니다.

- 상태값 — `NORMAL` `CAUTION` `CRITICAL` `LOW` `MODERATE` `HIGH` `ONLINE` `RESOLVED` `ACTIVATED`
- 센서 · 로봇 · 건물 코드 — `ENG-C2` `CLN-04` `SGN-09`
- 브랜드명 — `CAMPUSBRAIN` `SafeFlow` `Physical AI Campus Operating System` `The Campus That Thinks.`
- 단위 — `AQI` `°C` `%` `kW`

코드 주석 · 변수명 · 타입명은 영문을 유지합니다.

<br>

## 반응형

데스크톱 우선으로 만든 뒤 **375px에서 9개 화면을 전부**, **414 / 768 / 1024 / 1440px에서
주요 화면**을 확인했습니다. 가로 스크롤과 잘린 텍스트가 없습니다.

- 사이드바는 `lg` 이상에서만. 그 아래는 Topbar 안의 가로 스크롤 메뉴가 대신합니다.
- 건물 상세 패널은 모바일에서 풀스크린 시트가 됩니다.
- 디지털 트윈 맵은 종횡비를 유지한 채 축소됩니다.

<br>

## 폰트

- **Paperlogy** — `--font-sans`. 9종 굵기를 100~900에 매핑하고 저장소에서 직접 서빙합니다(CDN 의존 없음).
- **Geist Mono** — `--font-mono`. 숫자 · 시각 · 상태값에 붙는 `.tnum` 클래스가 이 폰트를 씁니다.

<br>

---

<div align="center">

### The Campus That Thinks.

<sub>대학 프로젝트이며 상용 제품이 아닙니다.<br>
설계 결정과 제약은 <a href="./CLAUDE.md"><code>CLAUDE.md</code></a>,
진행 상황은 <a href="./.agents/handoff.md"><code>.agents/handoff.md</code></a>에 있습니다.</sub>

</div>
