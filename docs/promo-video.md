# CampusBrain — 3분 광고영상 제작 대본

> 러닝타임 **3:00** · 28컷 · 실사(AI 생성) + 웹 화면 인서트
> 메시지: **공간이 사람을 이해하는 순간.** / **The Campus That Thinks.**

이 문서는 영상을 만들기 위한 제작 대본입니다. 실사 컷은 AI 영상 생성기로 뽑고,
웹 컷은 실제 프로토타입을 화면 녹화해서 붙입니다. 어느 도구를 쓸지는 아래
**0-1. 실사 컷을 어디서 생성하나**를 보세요.

---

## 0. 먼저 읽을 것

### 반드시 넣어야 하는 고지

마지막 3초에 **고지 자막이 반드시 들어가야 합니다.**

```
본 영상은 컨셉 프로토타입입니다.
실제 CCTV · IoT · 로봇 · 소방 설비와 연동되어 있지 않으며,
화면의 모든 수치는 시뮬레이션 데이터입니다.
```

프로젝트 전체가 "실제로 동작하는 것처럼 허위 표현하지 않는다"는 원칙 위에 있습니다.
광고영상이 그 원칙을 깨면 프로토타입에 박아 둔 `SIMULATION MODE` 배지가 무의미해집니다.

### 실사 컷 제작 시 주의

- **실존 대학의 이름 · 로고 · 상징물이 보이지 않게 합니다.** 가상의 캠퍼스입니다.
- **식별 가능한 실존 인물이 나오지 않게 합니다.** AI 생성 인물만 씁니다.
- 화재 연출(Act 6)은 **연기 감지기 LED와 경보음까지만**. 불길·부상자·공포 연출은 넣지
  않습니다. SafeFlow의 메시지는 "침착하게 유도된다"이지 "재난이 무섭다"가 아닙니다.
- 음악은 저작권 확인된 트랙만 씁니다.

### 실사 컷 공통 룩 (모든 프롬프트 앞에 붙일 것)

AI 영상 생성기는 클립마다 룩이 튑니다. 아래 블록을 **모든 프롬프트 앞에 그대로** 붙여
일관성을 잡으세요.

```
STYLE: cinematic corporate film, shot on 35mm, shallow depth of field,
anamorphic, natural daylight, cool blue-grey color grade with warm skin
tones, modern university campus in East Asia, contemporary concrete-and-
glass architecture, autumn afternoon around 2:30pm, students in muted
neutral clothing (grey, navy, beige, white), no visible logos or brand
names, no text on signs unless specified, steady camera, 24fps, 16:9
```

### 0-1. 실사 컷을 어디서 생성하나

> 2026년 9월 기준. 이 바닥은 분기마다 바뀌니 결제 전에 현재 요금을 직접 확인하세요.
> **Sora 2는 쓸 수 없습니다** — 2026-04-26 deprecated, API가 2026-09-24에 종료됐습니다.

| 도구 | 이 영상에 맞는 이유 | 대략 비용 |
|:--|:--|:--|
| **Kling 3.0** ← 메인 | 현재 품질 1위. **동양인 얼굴이 가장 자연스럽다** — 한국 대학 캠퍼스 광고에서 이게 결정적이다. 한국어 UI. 가장 저렴해서 재생성을 많이 돌릴 수 있다 | 10초 클립 약 $0.84 · 무료 티어 있음(워터마크) |
| **Runway Gen-4.5** ← 보조 | 카메라 무빙 컨트롤이 가장 정밀하다. 드론·크레인 컷과 S07 전환용 샷에만 쓴다 | Standard 월 $12~15 · Unlimited 월 $76~95 |
| **Google Veo 3.1** | 마케팅용 리얼리즘이 좋지만 동양인 얼굴이 약간 어색하다는 평이 있다. Google AI Pro 구독에 포함돼 이미 쓰고 있다면 추가 비용 0 | Google AI Pro 월 $19.99 (크레딧 1,000) |

**컷별 배분 추천**

| 컷 | 도구 | 이유 |
|:--|:--|:--|
| S01 · S10 · S11 · S19 · S24 | **Kling** | 학생 얼굴과 군중이 나온다. 얼굴 품질이 전부 |
| S02 · S03 · S04 · S16 · S17 · S18 · S21 | **Kling** | 기기 클로즈업. 어느 도구든 되지만 굳이 나눌 이유 없음 |
| S06 · S07 · S26 | **Runway** | 드론 하강 · 크레인 상승 같은 카메라 무빙이 컷의 전부 |

**돈 아끼는 순서**

1. **Kling 무료 티어**로 프롬프트를 다듬는다. 워터마크가 붙지만 구도와 분위기는 확인된다
2. 프롬프트가 확정된 컷만 **유료로 재생성**한다
3. 카메라 무빙 3컷만 Runway를 한 달 끊어서 처리한다

14컷 × 재생성 4회 ≈ 56회 생성. Kling 종량으로 약 $47, Runway Unlimited 한 달이면
무제한이라 재생성 부담이 없습니다. 둘 중 어느 쪽이든 10만 원 안쪽에서 끝납니다.

### 클립 길이 현실

Kling·Runway·Veo 모두 **한 번에 5~10초**만 만듭니다. 이 대본의 실사 컷은 전부
10초 이하로 끊어 두었으니 한 컷 = 한 클립으로 생성하면 됩니다. 마음에 드는 게 나올
때까지 컷당 **3~5회는 재생성**해야 한다고 잡아 두세요.

### 웹 화면 녹화 방법

- 해상도 **1920 × 1080**, 브라우저 전체화면(`F11`), 북마크바 숨김
- 녹화: Windows 11 기본 **Xbox Game Bar** (`Win` + `G`) — 설치 불필요
- **마우스 커서가 보이지 않게** 녹화합니다. Game Bar 설정에서 끌 수 있습니다
- 시나리오 재생은 60초 = 시뮬 10분입니다. 편집에서 **2~3배속**으로 압축해 쓰세요
- `prefers-reduced-motion`이 켜져 있으면 애니메이션이 죽습니다. Windows 설정 →
  접근성 → 시각 효과 → **애니메이션 효과 켜기** 확인

---

## 1. 구성

| Act | 시간 | 길이 | 내용 |
|:--|:--|:--|:--|
| 1 | 0:00 – 0:28 | 28s | **문제** — 다 재고 있지만 아무것도 하지 않는다 |
| 2 | 0:28 – 0:52 | 24s | **관측** — 흩어진 센서가 한 장의 공간이 된다 |
| 3 | 0:52 – 1:16 | 24s | **예측** — 지금 82%, 10분 뒤 91% |
| 4 | 1:16 – 1:34 | 18s | **판단** — 예측만으로는 아무 일도 없다 |
| 5 | 1:34 – 2:04 | 30s | **실행** — AI가 직접 공간을 움직인다 ★ |
| 6 | 2:04 – 2:40 | 36s | **SafeFlow** — 불이 나면 공간이 먼저 대피시킨다 ★★ |
| 7 | 2:40 – 3:00 | 20s | **CTA** |

---

## ACT 1 — 문제 (0:00 – 0:28)

> 사운드: 앰비언스만. 음악 없음. 웅성거림, 발소리.

### S01 · 0:00–0:06 · 실사

혼잡한 강의동 복도. 학생들이 어깨를 부딪히며 느리게 흐르다 한 지점에서 멈춰 선다.

```
Crowded university corridor at peak hour, dozens of students shuffling
shoulder to shoulder, the flow slowing to a standstill near a narrow
staircase entrance, handheld documentary feel, slight motion blur on
passing figures, no dialogue
```

**자막:** 없음

### S02 · 0:06–0:11 · 실사

천장의 CCTV 클로즈업. 작은 LED가 규칙적으로 깜빡인다. 아무 일도 일어나지 않는다.

```
Extreme close-up of a ceiling-mounted security camera in a university
corridor, small green LED blinking steadily, blurred crowd moving far
below in the background, static locked-off shot, clinical and indifferent
```

**자막:** 없음

### S03 · 0:11–0:16 · 실사

로비의 대형 디지털 사이니지. 같은 환영 문구가 무한 반복된다. 지나가는 학생 아무도
쳐다보지 않는다.

```
Large digital signage display in a university lobby looping the same
static welcome slide, students walking past without a single glance,
slow dolly-in on the screen, reflections of passing figures on the glass
```

**자막:** 없음

### S04 · 0:16–0:22 · 실사

청소로봇이 인파에 갇혀 제자리에서 멈춰 있다. 사람들이 로봇을 비켜 지나간다.

```
Small autonomous cleaning robot stuck motionless in the middle of a busy
corridor, students stepping around it, the robot's status light pulsing
uselessly, low angle at robot height
```

**자막:** 없음

### S05 · 0:22–0:28 · 타이포 카드

검은 화면. 흰 텍스트가 두 줄로 나뉘어 나타난다.

**자막 (1행 → 2행 순차):**
```
캠퍼스는 이미 모든 것을 재고 있습니다.
아무도 그것을 쓰지 않을 뿐입니다.
```

**나레이션:** 없음 (침묵이 더 강합니다)

---

## ACT 2 — 관측 (0:28 – 0:52)

> 사운드: 여기서 음악이 들어옵니다. 낮은 신스 패드, 점진적으로 쌓임.

### S06 · 0:28–0:35 · 실사

드론 하이앵글. 캠퍼스 전경. 학생들의 이동이 위에서 보면 흐르는 선처럼 보인다.

```
High aerial drone shot slowly descending over a modern university campus,
six distinct buildings around a central walkway, streams of students
moving along paths like flowing lines, late afternoon sun, long shadows,
smooth cinematic descent
```

**나레이션:** "캠퍼스에는 이미 수백 개의 눈이 있습니다."

### S07 · 0:35–0:42 · 트랜지션 ★ 시그니처 컷

실사 드론 샷이 그대로 **디지털 트윈으로 변환**된다. 건물이 아이소메트릭 블록으로,
학생 동선이 흐름 곡선으로. 영상 전체에서 가장 중요한 한 컷입니다.

**제작 방법:** 실사 드론 샷 마지막 프레임과 웹 디지털 트윈(`/dashboard/twin`)의
같은 각도를 맞춰 놓고, 편집에서 **디졸브 + 글리치 와이프**로 넘깁니다.
트윈 맵은 아이소메트릭 960×560이므로 드론 샷도 비슷한 부감 각도로 생성하세요.

**나레이션:** "CampusBrain은 그것을 한 장의 공간으로 만듭니다."

### S08 · 0:42–0:47 · 웹

**녹화:** `/dashboard/twin?scenario=normal` · 재생 정지 상태
건물 6개소와 혼잡도 수치가 보이도록 맵 전체를 잡습니다. 천천히 줌인.

**자막:** `건물 6개소 · 평상시 재실 2,418명`

### S09 · 0:47–0:52 · 웹

**녹화:** 같은 화면의 건물 목록 패널. 건물별 센서 수와 온도 · 공기질이 보이게.

**자막:** `센서 171대`

**나레이션:** "카메라, 재실 센서, 온도계, 공기질계가 하나로 합쳐집니다."

---

## ACT 3 — 예측 (0:52 – 1:16)

> 사운드: 리듬이 붙기 시작. 시계 초침 같은 퍼커션.

### S10 · 0:52–0:58 · 실사

강의실 문이 열리고 학생들이 쏟아져 나온다.

```
Lecture hall doors swinging open, a wave of students pouring out into the
corridor all at once, camera at chest height in the middle of the flow,
people passing close to the lens on both sides, energetic but not chaotic
```

### S11 · 0:58–1:04 · 실사

여러 갈래의 흐름이 한 복도로 합류한다. 속도감 있는 트래킹.

```
Multiple streams of students converging into a single corridor from three
directions, smooth tracking shot moving backwards ahead of the crowd,
increasing density toward the lens, sense of building pressure
```

**나레이션:** "수업이 끝나는 순간, 흐름은 이미 시작됩니다."

### S12 · 1:04–1:10 · 웹 ★

**녹화:** `/dashboard?scenario=crowd` 를 열고 재생. 재생 12초 시점에
**AI 인사이트 카드가 나타나는 순간**을 잡습니다. 카드가 `animate-rise`로 떠오릅니다.

화면에 나오는 값: `현재 87%` · `10분 후 예측 91%` · `신뢰도 94%`

**자막:** `공학관 · 10분 후 91% 예측`

### S13 · 1:10–1:16 · 웹

**녹화:** 랜딩 페이지 `/` 의 **03 예측** 섹션. 예측 곡선이 스크롤과 함께 그려집니다.
실선(관측) → 점선(예측)으로 갈라지는 부분을 잡으세요.

**나레이션:** "AI는 10분 뒤의 혼잡을 미리 계산합니다."

---

## ACT 4 — 판단 (1:16 – 1:34)

> 사운드: 잠깐 비웁니다. 타이포 카드에서 정적.

### S14 · 1:16–1:24 · 웹

**녹화:** 랜딩 `/` 의 **04 판단** 섹션. 관측 → 예측 → 판단 → 실행 4단계가
순차로 점등되는 구간.

**자막:** 각 단계 라벨이 화면에 이미 있으므로 추가 자막 없음

### S15 · 1:24–1:34 · 타이포 카드 + 실사 인서트

검은 화면에 텍스트. 중간에 S01의 멈춰 선 복도가 0.5초 플래시백으로 끼어듭니다.

**자막:**
```
예측만으로는
아무 일도 일어나지 않습니다.
```

**나레이션:** "대부분의 시스템은 여기서 멈춥니다. 담당자에게 알림을 보내고, 끝."

---

## ACT 5 — 실행 (1:34 – 2:04) ★ 핵심

> 사운드: 음악이 터집니다. 각 물리 시스템이 작동할 때마다 짧은 임팩트음.
> 편집: 실사와 웹을 **스플릿 스크린**으로 붙입니다. 왼쪽 실사, 오른쪽 웹.

### S16 · 1:34–1:40 · 스플릿 (실사 ↔ 웹)

**왼쪽 실사** — 복도의 사이니지 문구가 실제로 바뀐다.

```
Digital signage panel in a university corridor changing its message in
real time, the screen content switching with a soft transition, a large
directional arrow appearing and pointing left, students in the foreground
turning their heads toward it
```

**오른쪽 웹** — `/dashboard/signage?scenario=crowd` 재생 21초. 사이니지 카드가
`우회 경로 사이니지`로 바뀌며 `AI 변경 중` 배지가 붙는 순간.

**자막:** `사이니지 4면 변경 — 14:33`

### S17 · 1:40–1:46 · 스플릿

**왼쪽 실사** — 엘리베이터 홀. 층 표시등이 분산 운행으로 바뀐다.

```
Elevator hall in a university building, four elevator floor indicators
above the doors, the displays changing to show a split service pattern,
a small status screen beside them updating, students waiting and glancing
up as the numbers change
```

**오른쪽 웹** — AI Action 카드 `엘리베이터 분산` 이 체크되는 순간.

**자막:** `2·3호기 5~9층 전용 — 14:34`

### S18 · 1:46–1:52 · 스플릿

**왼쪽 실사** — 청소로봇이 방향을 틀어 복도를 비켜 준다. (S04의 응답)

```
Autonomous cleaning robot turning away from a busy corridor and moving
toward a side passage, its path light sweeping in the new direction,
students walking freely through the space it just vacated, low angle
```

**오른쪽 웹** — `/dashboard/robots?scenario=crowd` 의 `청소로봇 04` 카드가
`경로 변경 중`으로 바뀌는 순간.

**자막:** `청소로봇 04 → 지하1층 — 14:35`

### S19 · 1:52–1:58 · 실사 (풀스크린)

학생들이 두 갈래로 자연스럽게 갈라진다. 아무도 안내를 받는다고 느끼지 않는다.

```
Students naturally splitting into two streams at a corridor junction,
half continuing straight and half turning toward a newly opened side
corridor, the flow visibly loosening, no congestion, wide static shot
from above the junction
```

**나레이션:** "사이니지가 바뀌고, 엘리베이터가 나뉘고, 로봇이 비켜섭니다.
사람이 승인 버튼을 누르는 단계는 없습니다."

### S20 · 1:58–2:04 · 웹

**녹화:** `/dashboard/reports?scenario=crowd` 시나리오 완주 후 리포트 카드.
`결과 91% → 68%` 와 `피크 대비 23%p 완화` 가 보이게.

**자막:** `91% → 68%`

---

## ACT 6 — SafeFlow (2:04 – 2:40) ★★ 클라이맥스

> 사운드: 음악이 한 번 뚝 끊기고 경보음. 이후 낮고 단단한 톤으로 재시작.
> **불길 · 부상자 · 공포 연출 금지.** 침착함이 이 파트의 톤입니다.

### S21 · 2:04–2:10 · 실사

연기 감지기의 LED가 녹색에서 적색으로 바뀐다. 클로즈업.

```
Extreme close-up of a ceiling smoke detector, its indicator LED switching
from steady green to pulsing red, thin wisp of haze drifting past in the
background, corridor lights shifting to emergency tone, no flames
```

**자막:** `14:30 · 공학관 3층 동편 · 연기 감지기 3대`

### S22 · 2:10–2:16 · 웹

**녹화:** `/dashboard/emergency?scenario=emergency` 재생. SafeFlow 6단계가
차례로 체크되는 구간을 잡습니다. 단계 카드가 하나씩 켜집니다.

```
화재 감지 → 위험 구역 분석 → 인원 위치 분석 → 안전 경로 산출 → 물리 시스템 연동 → 대응 활성화
```

**나레이션:** "감지에서 대응까지, 여섯 단계가 자동으로 진행됩니다."

### S23 · 2:16–2:24 · 웹 ★

**녹화:** 같은 화면의 맵. 가장 중요한 웹 컷입니다.
화재 마커 → 위험 구역(앰버 파선) → 차단 경로 3개에 ✕ → **안전 경로 2개가
그려지는 애니메이션**까지. 경로 위로 인원 점이 이동합니다.

> 촬영 팁: 맵이 확실히 보이도록 창을 조금 좁혀 맵이 화면을 채우게 한 뒤,
> 해당 구간만 따로 한 번 더 녹화해서 붙이는 게 안전합니다.

**자막:** `고위험 경로 3개 차단 · 안전 경로 2개 확보`

### S24 · 2:24–2:32 · 실사

대피 사이니지의 화살표, 안내로봇의 유도, 학생들이 **침착하게** 이동한다.
뛰지 않습니다.

```
Emergency wayfinding signage showing a large green directional arrow,
a guide robot with a lit indicator leading a small group of students
calmly along a corridor toward an exit, everyone walking at a steady
pace, orderly and unhurried, emergency lighting, thin haze in the air,
no flames, no panic
```

**나레이션:** "출입문이 열리고, 사이니지가 방향을 바꾸고, 안내로봇이 움직입니다."

### S25 · 2:32–2:40 · 웹

**녹화:** `/dashboard/emergency` 하단 **SafeFlow 종료 요약**.

화면 값: `인원 유도 124명` · `회피한 고위험 경로 3개` · `대피 개선율 31% (04:20 → 03:00)`

**자막:** `124명 유도 · 대피 시간 31% 단축`

**나레이션:** "차단된 경로의 124명이 그대로 안전 경로로 재배분됩니다."

---

## ACT 7 — CTA (2:40 – 3:00)

### S26 · 2:40–2:50 · 실사

해질녘 캠퍼스. 학생들이 여유롭게 걷는다. 아무 일도 없었던 것처럼.

```
University campus at golden hour, students walking unhurried across an
open plaza in small groups, warm low sunlight, long shadows, calm and
ordinary, slow wide crane shot rising gently
```

**나레이션:** "공간이 사람을 이해하는 순간."

### S27 · 2:50–2:57 · 로고

검은 화면. 로고가 페이드 인.

```
CAMPUSBRAIN
Physical AI Campus Operating System

The Campus That Thinks.
```

> 로고 색은 프로토타입과 맞춥니다 — `CAMPUS`는 흰색, `BRAIN`은
> 파랑(`#4f8cff`) → 보라(`#7c6cff`) → 청록(`#36d9d0`) 그라디언트.
> 배경 `#070b14`. 폰트는 Paperlogy Black(900).

### S28 · 2:57–3:00 · 고지

```
본 영상은 컨셉 프로토타입입니다.
실제 CCTV · IoT · 로봇 · 소방 설비와 연동되어 있지 않으며,
화면의 모든 수치는 시뮬레이션 데이터입니다.
```

---

## 2. 나레이션 전문

녹음용으로 한 번에 모아 둡니다. 전체 약 95단어, 3분 영상에 여유 있는 분량입니다.

| # | 시점 | 대사 |
|:--|:--|:--|
| 1 | 0:28 | 캠퍼스에는 이미 수백 개의 눈이 있습니다. |
| 2 | 0:35 | CampusBrain은 그것을 한 장의 공간으로 만듭니다. |
| 3 | 0:47 | 카메라, 재실 센서, 온도계, 공기질계가 하나로 합쳐집니다. |
| 4 | 0:58 | 수업이 끝나는 순간, 흐름은 이미 시작됩니다. |
| 5 | 1:10 | AI는 10분 뒤의 혼잡을 미리 계산합니다. |
| 6 | 1:24 | 대부분의 시스템은 여기서 멈춥니다. 담당자에게 알림을 보내고, 끝. |
| 7 | 1:52 | 사이니지가 바뀌고, 엘리베이터가 나뉘고, 로봇이 비켜섭니다. 사람이 승인 버튼을 누르는 단계는 없습니다. |
| 8 | 2:10 | 감지에서 대응까지, 여섯 단계가 자동으로 진행됩니다. |
| 9 | 2:24 | 출입문이 열리고, 사이니지가 방향을 바꾸고, 안내로봇이 움직입니다. |
| 10 | 2:32 | 차단된 경로의 124명이 그대로 안전 경로로 재배분됩니다. |
| 11 | 2:40 | 공간이 사람을 이해하는 순간. |

---

## 3. 웹 화면 녹화 체크리스트

순서대로 한 번에 녹화해 두면 편집이 편합니다.

| 컷 | URL | 조작 | 잡을 것 |
|:--|:--|:--|:--|
| S08·S09 | `/dashboard/twin?scenario=normal` | 정지 | 맵 전체, 건물 목록 |
| S12 | `/dashboard?scenario=crowd` | ▶ 재생 | 12초 시점 인사이트 카드 등장 |
| S13 | `/` | 03 예측 섹션까지 스크롤 | 예측 곡선 |
| S14 | `/` | 04 판단 섹션까지 스크롤 | 4단계 점등 |
| S16 | `/dashboard/signage?scenario=crowd` | ▶ 재생 | 21초 시점 사이니지 변경 |
| S17 | `/dashboard?scenario=crowd` | ▶ 재생 | 27초 시점 엘리베이터 액션 |
| S18 | `/dashboard/robots?scenario=crowd` | ▶ 재생 | 33초 시점 로봇 재배치 |
| S20 | `/dashboard/reports?scenario=crowd` | 완주 후 | 리포트 카드 91% → 68% |
| S22·S23 | `/dashboard/emergency?scenario=emergency` | ▶ 재생 | 6단계 점등 · 맵 레이어 |
| S25 | `/dashboard/emergency` | 완주 후 | 종료 요약 124명 / 31% |

> **한 번에 다 잡으려 하지 마세요.** 시나리오는 언제든 다시 재생할 수 있습니다.
> 컷마다 따로 녹화해서 좋은 테이크만 쓰는 편이 훨씬 빠릅니다.

---

## 4. 편집 노트

- **컷 길이**: Act 1은 길게(6초), Act 5는 짧게(6초씩 스플릿) 잡아 리듬을 만듭니다.
- **속도**: 웹 시나리오 재생은 실제 60초입니다. 편집에서 **2~3배속**으로 줄이세요.
- **색보정**: 실사와 웹의 톤을 맞춥니다. 프로토타입 배경이 `#070b14`(짙은 남색)이므로
  실사도 **쿨한 블루-그레이**로 잡으면 이질감이 없습니다.
- **자막 폰트**: Paperlogy. 프로토타입과 같은 폰트를 쓰면 실사 ↔ 웹 전환이 붙습니다.
- **숫자 자막**은 고정폭으로. 프로토타입이 숫자에 Geist Mono를 쓰는 것과 같은 이유입니다.
- **가장 공들일 컷은 S07(실사 → 디지털 트윈 전환)과 S23(맵 경로 드로잉)** 입니다.
  이 두 컷이 되면 영상이 삽니다.

---

## 5. 영상에 나오는 숫자의 출처

광고에 쓰는 수치는 전부 프로토타입에서 실제로 나오는 값입니다. 지어낸 숫자가 없습니다.

| 영상에 나오는 값 | 출처 |
|:--|:--|
| 건물 6개소 | `src/data/buildings.ts` |
| 센서 171대 | 건물별 `sensors` 합계 |
| 재실 2,418명 | `deriveState("normal", 0)` |
| 82% → 91% → 68% | `SCENARIOS.crowd` 키프레임 |
| 신뢰도 94% | `crowd.insight.confidence` |
| 사이니지 4면 · 엘리베이터 · 로봇 | `crowd` AI Action 3건 |
| SafeFlow 6단계 | `src/data/safeflow.ts` |
| 124명 = 68+41+15 = 78+46 | 차단 경로 합 = 안전 경로 합 |
| 04:20 → 03:00 (31%) | `(260−180)/260` |
