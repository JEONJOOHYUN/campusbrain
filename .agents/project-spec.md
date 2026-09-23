# CampusBrain — 전체 명세 (project-spec)

> 출처: 최초 세션 PART B. 기능이나 중요한 설계가 바뀌면 이 문서를 갱신한다.

# 원칙

CampusBrain은 실제 센서·로봇·설비를 연결하는 상용 시스템이 아니다. Physical AI 스마트 캠퍼스의 개념과 작동 방식을 웹에서 체험하는 인터랙티브 프로토타입이다.

- 화려한 화면보다 실제로 탐색·조작할 수 있는 경험을 우선한다.
- 작게 구현 → 브라우저 확인 → 수정 → 다음 기능 순서로 진행한다. 처음부터 모든 페이지를 만들지 않는다.
- 기존 코드는 먼저 분석하고, 이유 없이 갈아엎지 않는다.
- 불필요한 라이브러리를 추가하지 않는다. 3D, 차트, 애니메이션 등 큰 의존성은 먼저 필요성을 설명한다.
- 실제 Physical AI가 동작하는 것처럼 허위 표현하지 않는다. 연동이 없는 기능과 수치는 UI에 `Simulation` 또는 `Prototype`으로 표시한다.

# 서비스 개념

CampusBrain은 대학 캠퍼스를 하나의 지능형 공간으로 운영하는 Physical AI Smart Campus Operating Platform이다.

카메라, IoT 센서, 디지털 사이니지, 로봇, 엘리베이터, 조명, 냉난방 데이터를 AI가 통합 분석한다고 가정한다. AI는 현재 상태를 이해하고, 미래 상황을 예측한 뒤, 필요한 물리 시스템에 대응 명령을 내린다.

Physical Space → Camera / Sensor / IoT → CampusBrain AI → Perception → Prediction → Decision → Physical Action → Signage / Robot / Elevator / HVAC / Lighting / Door

- 메시지: "공간이 사람을 이해하는 순간." / "The Campus That Thinks."
- 주 사용자: 대학 시설관리자, 스마트캠퍼스 운영 담당자
- 핵심 UX: 관리자 CRUD가 아니다. AI가 현실 공간을 인식 → 예측 → 판단 → 행동하는 과정을 사용자가 직접 체험하는 것이다.
  - 예: 공학관 혼잡도 증가 → AI Vision이 인원 흐름 감지 → 10분 후 91% 예측 → 대응 결정 → 우회 사이니지, 엘리베이터 분산, 청소로봇 경로 변경 → 혼잡도 감소

# Simulation Mode (핵심 기능)

상단에 항상 `SIMULATION MODE` 배지와 시나리오 선택기(Normal / Crowd / Event / Emergency)를 표시한다.

시나리오를 바꾸면 KPI, Digital Twin, AI Insight, Robot Task, Signage, AI Activity Log가 같은 데이터에서 함께 바뀌어야 한다. 숫자만 바꾸는 것으로 끝내지 않는다.

- Normal: 평상시 운영
- Crowd: 특정 건물에 학생이 몰림 → 우회 사이니지 활성화, 엘리베이터 분산, 청소로봇 이동 제한
- Event: 졸업작품전 → 행사장 안내 사이니지 변경, 방문객 동선 추천, 혼잡 구역 우회, 안내로봇 활성화
- Emergency / SafeFlow: 화재 발생 → Fire Detection → Risk Area Analysis → Crowd Position Analysis → Safe Route Calculation → Emergency Action
  - AI Action: 사이니지 대피 방향 변경, 안전 출입문 개방, 위험지역 접근 제한, 안내로봇 이동, 비상 방송, 최적 대피경로 표시
  - 가장 강한 데모 기능으로 만든다.

# MVP 범위

구현: Landing, Dashboard(Overview), Digital Twin, AI Insight, Simulation Mode, Crowd Flow, Smart Signage, Robot Monitoring, Energy, Emergency/SafeFlow, AI Reports(AI Activity Log 포함)

구현하지 않음: 실제 CCTV·IoT·로봇·엘리베이터·화재 시스템 연동, AI Vision 학습, 실제 ML 모델, 로그인/회원가입, 결제, 권한 관리, 실제 DB. 모두 프론트엔드 시뮬레이션 데이터로 대체한다.

# 사이트 구조 (사이드바 기반 관리자 UI)

- /                      Landing
- /dashboard             Overview
- /dashboard/twin        Digital Twin
- /dashboard/crowd       Crowd Flow
- /dashboard/signage     Smart Signage
- /dashboard/robots      Robot Control
- /dashboard/energy      Energy
- /dashboard/emergency   Emergency
- /dashboard/reports     AI Reports

# Landing

회사소개 페이지가 아니라 미래형 Physical AI 플랫폼의 인상을 전달한다.

Hero:
- CAMPUSBRAIN
- Physical AI Campus Operating System
- 공간이 사람을 이해하는 순간.
- AI가 캠퍼스를 보고, 상황을 예측하고, 공간을 움직입니다.
- 버튼: [Explore CampusBrain] [View Simulation]
- 캠퍼스 Digital Twin 또는 네트워크 형태의 비주얼을 함께 배치한다.

스크롤 섹션: Problem → Perception → Prediction → Decision → Physical Action → Use Cases → SafeFlow → CTA

설명을 늘어놓기보다 큰 타이포그래피와 시각 연출 중심으로 구성한다.

# Dashboard (Overview)

KPI:
- Campus Status: NORMAL
- Current Population: 2,418
- AI Actions Today: 47
- Active Robots: 12
- Crowded Areas: 3
- Energy Saving: 18.4%

레이아웃:
- 중앙: 캠퍼스 Digital Twin
- 우측 또는 하단: AI Insight, Recent AI Activity(최근 5건, `View all →` → /dashboard/reports)

건물: Main Building, Engineering Hall, Student Center, Library, Gymnasium, Parking Area

건물별 표시 예: Engineering Hall — Population 624 / Crowd 82% / Energy 74% / Status CAUTION

# Digital Twin

첫 버전은 SVG/CSS/HTML 기반 Isometric Campus Map 또는 2D Interactive Map으로 충분하다. 3D는 필수가 아니다.

건물을 클릭하면 Side Panel(Sheet)이 열린다.
- 표시 항목: 현재 인원, 예상 인원, 혼잡도, 온도, 공기질, 에너지, 연결 센서, 로봇 상태, AI 판단
- 예: Engineering Hall
  - Current Crowd 82% / Prediction 91% in 10 min
  - AI Insight: "수업 종료 시간과 이동 흐름을 분석한 결과, 10분 내 1층 로비 혼잡이 예상됩니다."
  - AI Action: ✓ Alternative route signage ✓ Elevator distribution ✓ Cleaning robot reroute

# AI Insight

숫자만 보여주지 않고 Observe → Predict → Decide → Act 과정을 보여준다.

예:
- 제목: Engineering Hall congestion increasing
- Current 82% / 10 min prediction 91% / Confidence 94%
- Recommended Action: Redirect visitors through west corridor.

Confidence와 예측값에는 Simulation 표시를 붙인다.

# Crowd Flow

지도 위에 사람 흐름과 이동선을 시각화한다.

- 지역 상태: LOW / MODERATE / HIGH / CRITICAL
- 예: Student Center — Current 76%, Trend ↑14%, Prediction 89% within 15 min
- Crowd 시나리오에서는 혼잡도가 점진적으로 오르고, AI가 대응한 뒤 내려간다.

# Smart Signage

관리자가 편성하는 게 아니라, AI가 상황에 따라 콘텐츠를 자동으로 바꾼다.

- Normal: "Welcome to Campus / Today's Events"
- Crowd: "Student Center Congested / ← Alternative Route"
- Emergency: "FIRE DETECTED / ← SAFE EXIT"

페이지 구성:
- 디스플레이 목록(설치 위치, 온라인 상태)
- 각 디스플레이의 현재 메시지 미리보기
- AI가 메시지를 바꾸면 변경 시각과 변경 사유(어떤 AI 판단 때문인지)를 함께 표시

# Robot Monitoring

- 로봇 종류: Cleaning / Guide / Delivery / Security
- 카드 예: Guide Robot 03 — Location Engineering Hall 1F / Battery 78% / Status Guiding Visitors / Task Graduation Exhibition Guidance
- 원격 조종은 만들지 않는다. 시나리오에 따라 작업이 바뀌는 모습만 보여준다.

# Energy

- 표시 데이터: 전체·건물별 전력, 냉난방, 조명, 예상 절감량, AI 자동 제어 횟수
- 예: Unused Classroom Detected — Building C / Room 304
  - Occupancy 0, Lighting ON, HVAC ON
  - Action: Lighting OFF, HVAC ECO MODE
  - Estimated Saving 2.4 kWh

# Emergency / SafeFlow (핵심 데모)

[Simulate Emergency]를 누르면 6단계가 순서대로 진행된다.
1/6 Fire detected → 2/6 Risk area analyzing → 3/6 Crowd locations analyzing → 4/6 Safe routes calculating → 5/6 Physical systems coordinating → 6/6 Emergency response activated

진행 후 Digital Twin에 표시할 것: 화재 위치, 위험 구역, 사람 위치, 차단 경로, 안전 대피경로(경로 드로잉 애니메이션)

AI Action Card: ✓ Exit Gate B opened ✓ East Corridor restricted ✓ Emergency signage activated ✓ Guide Robot 02 dispatched ✓ Emergency broadcast activated

종료 요약: 124 people redirected / 3 high-risk routes avoided / Estimated evacuation improvement 31%. 이 수치들은 Simulation 값임을 표시한다.

# AI Reports / AI Activity Log

용어:
- AI Activity Log: AI가 감지·예측·판단·실행한 개별 이벤트의 시간순 기록. 데이터이자 컴포넌트 이름이다.
- AI Reports: 사이드바 메뉴이자 페이지(/dashboard/reports). 전체 Activity Log와 시나리오 실행 리포트를 보여준다.

같은 로그 데이터를 두 곳에서 쓴다.
- Overview: 최근 5건 compact 버전
- AI Reports: 전체 기록 + 필터 + 상세

로그 항목 타입:

```ts
type ActivityCategory = "crowd" | "energy" | "robot" | "signage" | "emergency";
type ActivityStage = "observe" | "predict" | "decide" | "act";

interface ActivityLogEntry {
  id: string;
  time: string;              // 시뮬레이션 기준 시각, 예: "14:32"
  scenario: SimulationScenario;
  category: ActivityCategory;
  stage: ActivityStage;
  severity: "info" | "warning" | "critical";
  title: string;
  location?: string;
  target?: string;
}
```

로그 예:
- 14:32 [Crowd · Predict] Engineering Hall crowd prediction triggered
- 14:33 [Signage · Act] Alternative route signage activated
- 14:34 [Crowd · Act] Elevator distribution changed
- 14:35 [Robot · Act] Cleaning Robot 04 rerouted

필터: Category(Crowd / Energy / Robot / Signage / Emergency), Scenario(Normal / Crowd / Event / Emergency)

시뮬레이션이 진행되는 동안 새 로그가 타임라인 상단에 실시간으로 추가되는 것처럼 보이게 한다.

시나리오 실행 리포트:
- 시나리오를 끝까지 실행하면 요약 카드가 생성된다.
- 예: Crowd Scenario Report (Simulation)
  - Trigger: Engineering Hall 82% → predicted 91%
  - AI Actions: 3 (Signage 1 · Elevator 1 · Robot 1)
  - Result: Peak 91% → 68%
  - Duration: 08:00 (simulated)
- Emergency 리포트에는 SafeFlow 결과 수치를 포함한다.
- 리포트 수치는 시뮬레이션 데이터에서 계산하고 Simulation 라벨을 붙인다.
- 리포트는 브라우저 세션 동안만 유지한다. 저장 기능은 만들지 않는다.

# UI / Design

- 스타일: Dark Futuristic Enterprise Dashboard. Desktop First + Responsive.
- 게임 UI처럼 만들지 않는다. Glassmorphism을 남발하지 않는다.
- Gradient는 Hero와 AI 상태 표현에만 제한적으로 쓴다.
- Card에는 여백을 충분히 주고, KPI 숫자는 크게 표시한다.
- 키워드: Physical AI, Digital Twin, Smart City, Command Center, Enterprise, Minimal, Futuristic, Data Driven

색상:

| 토큰 | 값 |
|---|---|
| Background | #070B14 |
| Surface | #0D1321 |
| Card | #111827 |
| Border | #1F2937 |
| Primary | #4F8CFF |
| AI Accent | #7C6CFF |
| Cyan | #36D9D0 |
| Success | #49D17D |
| Warning | #F4B860 |
| Danger | #F05252 |
| Text Primary | #F8FAFC |
| Text Secondary | #94A3B8 |

# 화면 언어

> 구현 결정 (세션 1, 사용자 요청): 사용자에게 보이는 텍스트는 전부 한글로 쓴다.
> 영문으로 남기는 것은 상태값(NORMAL / CAUTION / CRITICAL, LOW / MODERATE / HIGH, ONLINE, WARNING, RESOLVED),
> 센서·로봇·건물 코드(ENG-C2, CLN-04), 브랜드명(CAMPUSBRAIN, Physical AI Campus Operating System,
> The Campus That Thinks.), 단위(AQI, °C, %)뿐이다. 코드 주석과 식별자는 영문을 유지한다.
> 이 명세 본문에 영문으로 적힌 UI 예시 문구(Welcome to Campus, Exit Gate B opened 등)도 화면에서는 한글로 옮긴다.

# Typography

Sans(한글·영문 전체): Paperlogy(페이퍼로지)
- 굵기 9종: 1Thin(100), 2ExtraLight(200), 3Light(300), 4Regular(400), 5Medium(500), 6SemiBold(600), 7Bold(700), 8ExtraBold(800), 9Black(900)
- 파일은 `src/app/fonts/`에 두고, `next/font/local`의 src 배열에 weight 100~900으로 매핑한다.
  - 예: Paperlogy-1Thin → 100, Paperlogy-9Black → 900
  - ttf/otf만 있으면 그대로 쓴다. 변환 도구를 추가하지 않는다.
- CSS 변수 `--font-sans`로 연결한다. 외부 CDN에 의존하지 않는다.
- 사용 가이드:
  - Hero 대형 타이포: 800~900
  - 섹션 제목: 700
  - 카드 제목: 600
  - UI 라벨: 500
  - 본문: 400
  - 보조 텍스트·장식용 대형 숫자: 200~300
- 폰트 파일이 없으면 임의로 대체하지 말고 사용자에게 요청한다.

Data / System: Geist Mono(`next/font/google`)
- 숫자, 시각, 상태값(NORMAL, CRITICAL 등), 센서 ID에는 Geist Mono와 `tabular-nums`를 쓴다.

# Animation

Physical AI의 반응을 설명하는 용도로만 쓴다.

- 허용: 숫자 count-up, 상태 pulse, AI scanning, Digital Twin 경로 애니메이션, Crowd flow, 대피경로 드로잉, 카드 전환
- 금지: 의미 없이 계속 회전하는 요소, 과도한 parallax, 모든 요소의 hover 애니메이션, 게임 UI 같은 과한 효과
- `prefers-reduced-motion`을 존중한다.
- Framer Motion은 프로젝트에 없으면 추가하기 전에 필요성을 설명한다.

# 컴포넌트

shadcn/ui는 필요한 것만 쓴다. 후보: Button, Card, Badge, Tabs, Tooltip, Dialog, Sheet, Progress, Select, Dropdown Menu, Separator.

모든 HTML을 shadcn 컴포넌트로 감싸지 않는다.

> 구현 결정 (세션 1, 사용자 승인): 추가 의존성 0개 목표에 맞춰 shadcn/ui 패키지를 설치하지 않았다.
> Button / Card / Badge / Progress는 같은 스타일의 로컬 프리미티브로 `src/components/ui/`에 직접 작성했고,
> 건물 상세 Sheet도 커스텀이다. Select·Tooltip처럼 진짜 Radix 동작(포커스 트랩, 팝오버 위치 계산)이
> 필요해지는 시점에 정식 도입을 다시 제안한다.

# 기술 스택

- Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui
- 상태: React state/Context가 우선이다. 복잡해질 때만 Zustand를 제안한다.
- 차트: 필요하면 Recharts만 쓴다.
- Digital Twin: CSS/SVG로 만든다. Three.js / R3F는 초기에 쓰지 않고, 부족하다고 판단될 때 먼저 제안한다.

# 데이터 구조

모든 시뮬레이션 데이터는 `src/data/`에서만 관리한다: campus.ts, buildings.ts, robots.ts, signage.ts, scenarios.ts, activity.ts, energy.ts

> 구현 결정 (세션 2): 명세에 없던 `energy.ts`를 추가했다. 건물별 정격 전력(kW), 시스템별 비중,
> AI 자동제어 이벤트 기록을 담는다. 에너지 페이지의 수치는 `정격 kW x 엔진이 만든 energy%`로
> 파생되므로 다른 화면과 같은 시뮬레이션에서 움직인다.
>
> `activity.ts`는 "오늘 그 전에 AI가 한 일" 정적 아카이브다(08:05~14:22, 23건). 라이브 로그는
> 여전히 시나리오 타임라인에서 나오고, 아카이브는 AI 리포트의 전체 타임라인에만 덧붙는다.
> 평상시 운영 중 일어난 일이므로 scenario는 "normal"로 단다.

```ts
type SimulationScenario = "normal" | "crowd" | "event" | "emergency";
```

- 페이지에 숫자를 직접 적지 않는다.
- 같은 시나리오에서는 모든 UI가 같은 데이터를 쓴다.

# 아키텍처

UI와 Simulation Logic을 분리한다. 권장 골격:
- src/app/ (page.tsx, fonts/, dashboard/)
- src/components/ (dashboard, digital-twin, simulation, charts, ui)
- src/features/ (crowd, emergency, energy, robot, signage, reports)
- src/lib/ (simulation, utils)
- src/data/
- src/types/

규모가 작으면 단순화한다. 불필요한 폴더를 미리 만들지 않는다.

# 프로젝트 문서

- CLAUDE.md: 항상 지킬 핵심 규칙만 짧게 쓴다.
- .agents/project-spec.md: 이 명세. 기능이나 중요한 설계가 바뀌면 갱신한다.
- .agents/handoff.md: 다음 세션에서 이어가기 위한 문서.
  - 항목: Current Goal / Fixed Decisions / Implemented Features / Current Work / Design Decisions / Important Files / Simulation Decisions / Known Issues / Pending Tasks / Last Session Summary
  - 작업 로그 전체가 아니라 반드시 알아야 할 내용만 적는다.

많은 파일을 수정했거나 중요한 결정이 쌓이면 handoff.md를 갱신하고 이렇게 알린다:
"handoff.md를 최신 상태로 정리했습니다. /clear 후 이어서 작업하는 것을 권장합니다."

직접 /clear를 실행했다고 말하지 않는다.

# Git

- 사용자 허락 없이 commit이나 push를 하지 않는다. commit만 허락받았으면 push하지 않는다.
- Conventional Commits 형식을 쓴다.
  - 예: feat: implement campus simulation dashboard / feat: add emergency safeflow simulation / fix: sync crowd scenario dashboard states

# 작업 보고 형식

## 이번 작업
- 구현:
- 수정:
- 디자인:
- 테스트:
- 현재 동작 상태:
- Simulation 상태:
- 알려진 문제:
- 다음 작업:

제안 커밋 메시지:

현재 변경사항을 커밋할까요?
푸시까지 진행할까요?

# 개발 순서

- Phase 1 Foundation: 폴더·Git 분석 → CLAUDE.md, project-spec.md, handoff.md → 디자인 토큰·Global CSS·폰트(Paperlogy, Geist Mono) → Layout·Sidebar
- Phase 2 Milestone 1: Landing → Explore → Dashboard → Digital Twin → Engineering Hall → AI Insight → Simulate Crowd → 상태 변화 → AI Action 표시
- Phase 3 Core Dashboard: KPI, Digital Twin, Building Detail Panel, AI Insight, Recent AI Activity
- Phase 4 Physical AI Features: Crowd Flow, Smart Signage, Robot Monitoring, Energy, AI Reports(전체 로그 + 필터 + 실행 리포트)
- Phase 5 Milestone 2 SafeFlow: Emergency 시나리오, 화재 위치, 위험 구역, 안전 경로, Signage 변경, Robot Dispatch, Emergency 로그와 SafeFlow 리포트
- Phase 6 Polish: Landing 완성, 반응형, 애니메이션, Loading/Empty State, 오류 수정, UI 일관성 검토, build 검사, 최종 데모 검증

# 데모 목표

발표자가 2~3분 동안 직접 조작하며 설명할 수 있어야 한다.

소개 → Dashboard → Engineering Hall 선택 → Crowd Simulation → AI Prediction → Physical Action → Emergency Simulation → SafeFlow → AI Reports에서 대응 기록 확인 → 전체 가치 설명

기능 개수보다 이 데모 흐름의 완성도가 우선이다.
