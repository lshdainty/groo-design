# Progress Circle

> 작업이 진행 중임을 알리는 원입니다. 값을 모르면 호가 늘었다 줄며 돌고, 값을 알면 12시부터 값만큼 채웁니다. 섹션 하나를 새로 고칠 때 · 목록 끝을 더 불러올 때 · 구조를 미리 그릴 수 없는 화면을 기다릴 때 · 올리기 · 받기에 씁니다. 목록 · 카드처럼 구조가 보이는 자리를 처음 불러올 때는 [Skeleton](skeleton.md) 을, 저장 버튼은 [Button](button.md) 의 로딩을 씁니다. 앱의 당겨서 새로 고침도 이 원입니다(아래 "당겨서 새로 고침").

원은 트랙 · 호로 이루어지고, 크기 24 · 40(두께 3 · 5), 값 없는 원 · 값 있는 원, 톤 neutral · brand · staticWhite · inherit 이 있습니다.

수치 원본은 [`progress-circle.yaml`](progress-circle.yaml)과 [`pull-to-refresh.yaml`](pull-to-refresh.yaml)(당겨서 새로 고침)입니다. 언제 보이고 언제 실패로 바꾸는지는 [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) 한 곳에 있습니다.

[그림: 섹션 새로 고침 · 화면 가운데 · 사진 올리는 중 — 라이트 · 다크](../../site/components/specs/progress-circle.tsx#hero)

### 직접 골라 보기

크기 · 톤 · 값(없음 · 0 ~ 100) · 놓인 면 · 모션 줄이기를 고르면 스펙대로 그린 원과 그 코드가 함께 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/progress-circle.tsx#playground)

## Anatomy

[그림: 원은 트랙과 호, 호는 12시에서 시작하고 끝이 둥글다](../../site/components/specs/progress-circle.tsx#anatomy)

| ⓐ Track | 트랙 — 원 전체, 옅은 색입니다. |
| ⓑ Range | 호 — 진행을 그립니다. 12시에서 시작하고 끝이 둥급니다. |

[표: 부위](progress-circle.yaml#slots)

## Properties

### Size

`24` 는 요소 안(섹션 제목 옆 · 목록 끝 · 올리는 항목 위 · 당겨서 새로 고침)에 두고 두께는 3 입니다. `40` *(기본)* 은 콘텐츠 영역 가운데(구조를 미리 그릴 수 없는 화면 · 시트 · 카드 전체를 기다릴 때)에 두고 두께는 5 입니다. 버튼 안의 원(14 · 14 · 16 · 18, 두께 2)은 [Button](button.md) 이 정합니다 — 원은 `inherit` 로 Button 이 넘긴 크기 · 두께를 따릅니다.

[그림: 24 · 40 — 버튼 안 14 · 16 · 18 은 Button 이 정한다](../../site/components/specs/progress-circle.tsx#sizes)

[표: 크기](progress-circle.yaml#size)

### Tone

| 톤 | 쓰는 곳 |
|---|---|
| `neutral` *(기본)* | 흰 면 · 떠 있는 면 위 어디서나 — 원 `stroke-neutral-solid`(흰 면 위 4.18 · 다크 4.13), 트랙 `stroke-neutral-subtle` |
| `brand` | 브랜드를 보일 자리 하나 — 앱 첫 화면(스플래시)처럼 큰 전환점. 원 `stroke-brand-solid`(다크는 밝은 짝), 트랙 `bg-brand-weak-pressed` |
| `staticWhite` | 어두운 면 위 — 사진 위 딤(올리는 중인 사진) · 짙은 채움. 흰 원 + 흰 30% 트랙 |
| `inherit` | 놓인 부품이 정함 — 기본은 글자색(`currentColor`)과 그 30%. Button 은 변형마다 정함(`button.yaml`) |

`neutral` 의 원은 바탕과 3:1 이 넘는 색입니다 — 옅은 회색 원(흰 화면 위 1.50:1)은 WCAG 1.4.11 에 못 미칩니다. 브랜드 원은 다크에서 채움 색(`bg-brand-solid`)으로 그리면 바탕과 1.73:1 로 묻히므로, 밝은 짝이 있는 `stroke-brand-solid` 를 씁니다. `staticWhite` 의 트랙 흰 30% 는 Button 의 채운 버튼 로딩 원과 같습니다.

[그림: 톤 넷 — 흰 면 · 앱 첫 화면 · 사진 위 딤 · 글자색](../../site/components/specs/progress-circle.tsx#tones)

[표: 톤](progress-circle.yaml#grid.tone)

### 값 없는 원 · 값 있는 원

값을 모르면(`value` 없음) 호가 늘었다 줄며 1.2초에 돕니다 — 머리가 원둘레만큼 늘어나는 동안 꼬리가 따라와 줄입니다. 값을 알면 12시부터 값만큼 채우고, 값이 바뀌면 300ms 로 따라 찹니다. `min` · `max` 를 지킵니다(0 ~ 5 중 3 이면 60%). 처음 그릴 때는 채움이 움직이지 않습니다.

[그림: 값 없는 원 · 값 있는 원 0 · 40 · 100](../../site/components/specs/progress-circle.tsx#modes)

[표: 값](progress-circle.yaml#mode)

[표: 공통](progress-circle.yaml#base)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 보임 |
| `reducedMotion` | 모션 줄이기 — 값 없는 원은 돌지 않는 3/4 호, 값 있는 원은 채움이 바로 바뀜 |

[그림: 모션 줄이기 — 돌지 않는 3/4 호](../../site/components/specs/progress-circle.tsx#reduced-motion)

[표: 상태 — 값 없는 원](progress-circle.yaml#matrix)

[표: 상태 — 값 있는 원](progress-circle.yaml#matrix.mode.determinate)

[표: 모션](progress-circle.yaml#motion)

## Guidelines

### 자리가 범위를 말한다

원이 놓인 자리가 무엇을 기다리는지 말합니다 — 섹션 제목 옆 24 는 그 섹션, 목록 아래 가운데 24 는 다음 묶음, 콘텐츠 영역 가운데 40 은 그 화면 · 시트 · 카드 전체입니다. 틀(머리 · 탭 바 · 사이드바)은 그대로 그리고 원은 콘텐츠 영역에 둡니다. 상황마다 무엇을 보이고 무엇으로 덮는지는 [Skeleton 의 "무엇으로 기다리나"](skeleton.md#무엇으로-기다리나) 표 한 곳에 있습니다.

- 첫 진입은 틀을 그리고 콘텐츠 영역 가운데에 원 40 을 둡니다 — 틀 안의 콘텐츠 영역이 그 화면입니다.
- 예외 — 앱 틀이 생기기 전의 화면(스플래시)은 화면 가운데 로고 묶음(나무 + 서비스 이름) 아래에 원을 둡니다(`brand` 톤, 위 Tone · DESIGN.md "그룹 색 · 로고 칠").
- 덮을 콘텐츠가 없는 자리에 회색 막 + "Loading" 글을 두지 않습니다 — 뒤 화면이 보이지 않고 무엇을 기다리는지도 알 수 없습니다. 뒤를 계속 써도 되는 기다림(섹션 새로 고침)에 화면 전체 덮개를 두지 않습니다 — 자리가 범위를 말합니다.
- 뒤를 계속 써도 되는 기다림에 작은 판(반투명 판)을 두지 않습니다 — 원의 자리(제목 옆 24)가 범위를 말하므로, 판 크기 · 색 토큰을 따로 두지 않습니다.
- 섹션 새로 고침의 원 24 는 섹션 제목 오른쪽에 두고, 보던 내용은 그대로 둡니다.

### 뒤를 만지면 안 되는 처리 — 화면 전체 딤 + 흰 원 40

가져오기 확정 · 이용 해지 처리처럼 끝나기 전에 뒤 화면을 쓰면 안 되는 처리만 화면 전체를 딤(`overlay-dim-light` · `overlay-dim-dark` — 라이트 50% · 다크 65%, 시트 · 대화상자의 딤과 같습니다)으로 덮고 가운데에 흰 원 40(`staticWhite`)을 둡니다. 뒤를 계속 써도 되는 기다림에는 딤도 작은 판도 두지 않습니다. 원은 값 없는 원이고 시간표(1초에 보임)를 따릅니다. 딤 위에는 5초 안내 글("평소보다 오래 걸리고 있어요.")을 두지 않습니다 — 딤 위에 둘 글자색 짝이 없기 때문입니다. 처리가 끝나면 딤을 걷고 결과를 그 자리에서 알립니다([Snackbar](snackbar.md) · [Result Section](result-section.md)). 보조 기술에는 덮는 동안 뒤 화면을 숨기고(`aria-hidden` · 모달처럼) 원의 이름("가져오는 중" · "해지하는 중")으로 알립니다.

[그림: 섹션 제목 옆 24 · 목록 끝 24 · 콘텐츠 가운데 40 — 회색 막 "Loading" · 틀 없는 원](../../site/components/specs/progress-circle.tsx#placement-guide)

### 기다리는 동안 — 시간표는 하나

원도 Skeleton 과 같은 시간표를 따릅니다 — 1초 안에 끝나면 보이지 않고, 5초에 원 아래 "평소보다 오래 걸리고 있어요." 한 줄(가운데 맞춤, 16 띄움)을 두고, 10초에 실패([Result Section](result-section.md) + "다시 시도")로 바꿉니다. 요청 제한 · 다시 시도 · 보조 기술에 알리는 법도 같습니다 — [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안).

[그림: 가운데 원 — 1초에 나타남 · 5초 안내 글 · 10초 실패](../../site/components/specs/progress-circle.tsx#timeline-guide)

### 한 자리에는 되도록 하나 — Skeleton 과 함께

구조가 보이는 넓은 자리(목록 · 카드 · 상세)는 [Skeleton](skeleton.md), 행동 하나를 기다리는 작은 자리는 이 원입니다. 한 자리에는 되도록 하나만 둡니다 — 스켈레톤 위에 원을 얹지 않습니다.

### 올리기 · 받기 — 값 있는 원 24

진행을 알면 값 있는 원 24 를 그 항목에 둡니다 — 사진이면 사진 위 딤(`overlay-dim-light` · 다크 `overlay-dim-dark`) 가운데 `staticWhite`, 파일 · 앱 업데이트면 이름 옆 `neutral` 입니다. 첨부 칸은 [Attachment Input](attachment-input.md)(사진 썸네일 · 파일 카드), 프로필 사진은 [Avatar](avatar.md) 의 "사진 바꾸기" 가 이 규칙대로 그립니다. 다 차면 원을 걷고 결과를 보입니다. 진행이 10초 동안 멈추면 실패입니다(Skeleton 의 요청 제한). 막대([Progress](progress.md))는 진행에 쓰지 않습니다 — 막대는 얼마나 찼는지를 보이는 미터입니다.

[그림: 사진 올리는 중 — 딤 위 흰 원 · 파일 옆 회색 원](../../site/components/specs/progress-circle.tsx#determinate-guide)

### 글

원의 이름은 기다리는 일입니다 — 기본 "불러오는 중", 올리기는 "영수증 사진 올리는 중" 처럼 씁니다. 값 글은 "40%"(반올림한 정수)입니다. 이름 · 값 글은 한국어로 씁니다 — 영어("Loading" · "loading..." · "40 percent") · 세 점("...")을 쓰지 않고, 보이는 글은 "불러오는 중…" 입니다.

## 당겨서 새로 고침

앱 화면(탭)의 목록 · 대시보드를 맨 위에서 아래로 당기면 같은 내용을 다시 받습니다. 지시자는 원판 없는 원 24(`neutral`)입니다 — 머리 바로 아래 높이 88 칸(원 + 위아래 32) 가운데에 겹칩니다. 웹에는 두지 않습니다 — 폰 브라우저는 당기면 페이지를 다시 엽니다.

- **당기는 동안** — 내용이 당긴 만큼 내려오고(손가락 이동 × 0.75), 원이 당긴 비율만큼 채워지며 짙어집니다(값 있는 원). 지시자 칸도 따라 내려와 문턱에서 제자리에 섭니다.
- **문턱** — 당긴 거리 88(손가락으로 약 117)입니다. 넘기면 원이 꽉 찹니다.
- **놓으면** — 문턱을 넘겼으면 원이 돌고(값 없는 원) 내용이 88 로 300ms 에 돌아가 새로 고침이 끝날 때까지 머뭅니다. 끝나면(성공 · 실패 모두) 300ms 에 제자리로 갑니다. 문턱 전에 놓으면 그대로 제자리로 가고 새로 고치지 않습니다. 모션 줄이기면 내용이 미끄러지지 않고 바로 제자리로 갑니다.
- **끝날 때까지** — 새로 고침 함수는 새로 받기가 끝날 때 끝나야 합니다. 기다리지 않으면 원이 0.5초 만에 사라지고 내용은 아직 옛것입니다.
- **보던 내용은 그대로** — 같은 내용을 다시 받는 일이라 스켈레톤으로 바꾸거나 목록을 비우지 않습니다. 실패하면 내용을 둔 채 [Snackbar](snackbar.md) 로 알립니다 — "새로 고치지 못했어요. 잠시 뒤 다시 당겨주세요."
- **어디에** — 서버 데이터를 보이는 탭 화면의 맨 바깥 스크롤에 둡니다. 시트 · 대화상자 안에는 두지 않습니다. 가로로 넘기는 영역 · 끌어서 쓰는 줄(스와이프 · 순서 바꾸기)에서 시작한 끌기는 당기기가 아닙니다.
- **다른 길** — 당기기는 키보드 · 보조 기술로 하기 어렵습니다. 화면이 다시 보이면 저절로 다시 받고, 새로 고침이 꼭 필요한 화면(시세처럼 자주 바뀌는 값)은 머리에 새로 고침 버튼(아이콘만, 이름 "새로 고침")을 함께 둡니다.
- **보조 기술** — 쉬는 동안 · 당기는 동안 지시자는 숨깁니다(안 보이는 원이 "0%" 로 읽히지 않게). 새로 고치는 동안만 "새로 고치는 중" 진행 표시로 읽힙니다.

[그림: 당기는 만큼 채움 · 문턱 88 · 놓으면 돎 · 끝날 때까지 88 — 직접 당겨 보기](../../site/components/specs/progress-circle.tsx#ptr)

[표: 당겨서 새로 고침 — 상태](pull-to-refresh.yaml#matrix)

[표: 당겨서 새로 고침 — 모션](pull-to-refresh.yaml#motion)

## 코드

레시피 `recipes/shadcn/components/ui/progress-circle.tsx` 를 씁니다(SVG). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ProgressCircle` — `size`(`"24"` · `"40"` 기본 · `"inherit"`), `tone`(`"neutral"` 기본 · `"brand"` · `"staticWhite"` · `"inherit"`), `value`(없으면 값 없는 원), `min`(0) · `max`(100), `aria-label`(기본 "불러오는 중"), `valueText`(값 글 — 기본 반올림한 "40%").
- `inherit` 는 부모가 정한 `--progress-size` · `--progress-thickness` · `--progress-track` · `--progress-range` 를 씁니다 — 없으면 글자색과 그 30% 입니다.
- 늘 `role="progressbar"` 입니다. 장식으로 쓸 때(버튼 안 — 버튼이 `aria-busy` 로 알립니다)만 `aria-hidden` 을 줍니다.

### 섹션 새로 고침 · 화면 가운데

[그림: 최근 거래 새로 고침 · 검색 결과 기다림](../../site/components/specs/progress-circle.tsx#ex-basic)

```tsx
import { ProgressCircle } from "@/components/ui/progress-circle"
import { LoadingRegion, useWaitPhase } from "@/components/ui/skeleton"

{/* 섹션 제목 옆 24 — 보던 내용은 그대로, 1초 안에 끝나면 보이지 않는다(시간표) */}
const refreshPhase = useWaitPhase(isRefreshing)

<CardHeader className="flex-row items-center gap-2">
  <CardTitle>최근 거래</CardTitle>
  {refreshPhase !== "quiet" && <ProgressCircle size="24" aria-label="최근 거래 새로 고치는 중" />}
</CardHeader>

{/* 구조를 그릴 수 없는 자리 — 영역 가운데 40, 1초 · 5초 · 10초는 LoadingRegion 이 맡는다 */}
<LoadingRegion pending={results.isPending} failed={results.isError && !results.data} fallback="circle" failure={…}>
  <SearchResults items={results.data} />
</LoadingRegion>
```

### 올리기 — 값 있는 원

[그림: 영수증 사진 올리는 중](../../site/components/specs/progress-circle.tsx#ex-determinate)

```tsx
<div className="relative">
  <img src={preview} alt="" className="size-20 rounded-r2 object-cover" />
  <div className="absolute inset-0 grid place-items-center rounded-r2 bg-[var(--overlay-dim-light)] dark:bg-[var(--overlay-dim-dark)]">
    <ProgressCircle size="24" tone="staticWhite" value={uploaded} max={fileSize} aria-label="영수증 사진 올리는 중" />
  </div>
</div>
```

### 당겨서 새로 고침 — 앱

앱(Flutter)은 Material `RefreshIndicator`(원판 41 · 브랜드 호) 대신 이 모양을 그립니다 — 수치는 `pull-to-refresh.yaml` 에 있습니다. 새로 고침 함수가 새로 받기를 기다리게 둡니다.

```dart
// 새로 받기가 끝날 때 끝나는 Future — 끝날 때까지 원이 돌고 내용은 88 에 머문다
onRefresh: () => ref.refresh(dashboardProvider.future),

// ✗ 기다리지 않는다 — 원이 0.5초 만에 사라진다
onRefresh: () async { ref.invalidate(dashboardProvider); },
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 나타남 | 기다리는 영역의 시간표대로 — 1초 안에 끝나면 보이지 않습니다([Skeleton](skeleton.md#기다리는-동안)) |
| 값 없는 원 | 1.2초에 한 바퀴 돌며 호가 늘었다 줄어듭니다 — 끝나면 걷습니다 |
| 값이 바뀜 | 300ms 로 따라 찹니다 — 처음 그릴 때는 움직이지 않습니다 |
| 값이 `max` | 꽉 찬 원 — 부르는 쪽이 결과로 바꿉니다 |
| 모션 줄이기 | 돌지 않습니다 — 값 없는 원은 고정된 3/4 호, 채움은 바로 바뀝니다 |
| 당겨서 새로 고침 | 위 "당겨서 새로 고침" — 당긴 만큼 채움 · 문턱 88 · 놓으면 돎 · 끝날 때까지 88 |
| 누르기 · 키보드 | 없습니다 — 원은 초점을 받지 않습니다 |
| 글자 크기 설정 | 원의 크기 · 두께는 px 그대로입니다. 5초 안내 글은 커지고 줄을 바꿔 받습니다. `inherit` 는 놓인 부품이 정한 크기를 따릅니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | `neutral` 원 흰 면 위 4.18 · 다크 4.13(떠 있는 면 3.58) · 트랙과 3.63 · 3.18 ✓. `brand` Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. `staticWhite` 딤 위 3.95 · 다크 19.27 ✓. 트랙은 장식 |
| **WCAG 1.4.4** Resize text | 5초 안내 글이 글자 크기 설정을 따릅니다 ✓. 원은 글이 아닌 컨트롤 모양이라 px 그대로이고, 기다리는 일은 원의 이름과 영역의 상태 글로 읽힙니다 |
| **WCAG 2.2.2** Pause, Stop, Hide | 진행을 알리는 반복이라 기준의 예외지만, 10초면 실패로 바뀌어 멈추고 모션 줄이기면 돌지 않습니다 ✓ |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 회전 · 호 · 채움 전환이 멈춥니다 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `role="progressbar"` + 이름(`aria-label` — 기본 "불러오는 중"). 값 있는 원은 `aria-valuenow` · `aria-valuemin` · `aria-valuemax` + `aria-valuetext`("40%"), 값 없는 원은 값 속성을 두지 않습니다 ✓ |
| **WCAG 4.1.3** Status messages | 기다림 · 결과는 영역의 상태 글과 Result Section 이 알립니다([Skeleton](skeleton.md#기다리는-동안)) ✓ |
| **WCAG 2.5.7** Dragging Movements | 당겨서 새로 고침은 지름길입니다 — 화면이 다시 보이면 저절로 받고, 꼭 필요한 화면은 새로 고침 버튼을 둡니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없습니다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없습니다 — 해당 없음 |
| **ARIA** | 버튼 안의 원은 `aria-hidden` 입니다(버튼이 `aria-busy` 로 알립니다). 당겨서 새로 고침의 지시자는 쉴 때 · 당길 때 숨기고 새로 고치는 동안만 "새로 고치는 중" 으로 읽힙니다. 영어 값 글("loading..." · "40 percent")을 쓰지 않습니다 |

## Do / Don't

### ✅ Do

- 행동 하나를 기다리는 작은 자리에 둡니다 — 섹션 새로 고침 24 · 목록 끝 24 · 구조를 그릴 수 없는 화면 가운데 40.
- 틀은 그리고 원은 콘텐츠 영역에 둡니다 — 틀이 생기기 전(스플래시)만 로고 묶음 아래 원 하나입니다.
- 뒤를 만지면 안 되는 처리만 화면 전체를 딤으로 덮고 흰 원 40 을 둡니다.
- 진행을 알면 값 있는 원을 씁니다 — 사진 위면 딤 위 흰 원입니다.
- 당겨서 새로 고침은 새로 받기가 끝날 때까지 돕니다.
- 이름은 한국어로 기다리는 일을 씁니다 — "불러오는 중".

### ❌ Don't

- 덮을 콘텐츠가 없는 자리에 회색 막 + "Loading" 을 두지 않습니다.
- 뒤를 계속 써도 되는 새로 고침에 화면 전체 덮개를 두지 않습니다.
- 앱 틀이 있는데 틀 없이 화면 가운데 원 하나만 두지 않습니다.
- 원과 스켈레톤을 한 자리에 두지 않습니다.
- 원 색이 바탕에 묻히게 하지 않습니다(옅은 회색 1.5:1 · 다크의 브랜드 채움 색 · 채운 원 위 같은 색 호).
- 16 · 32 · 48 같은 다른 크기를 쓰지 않습니다 — 24 · 40(버튼 안은 Button).
- 당긴 뒤 새로 받기를 기다리지 않고 원을 걷거나 목록을 비우지 않습니다.

## Specification

`progress-circle.yaml` 과 `pull-to-refresh.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Progress Circle 과 당겨서 새로 고침을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 기본 상태에서 바뀌는 값만 적습니다.

[그림: Specification — progress-circle.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#progress-circle)

[그림: Specification — pull-to-refresh.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#pull-to-refresh)
