# Tabs

> 다른 구역으로 옮기는 탭입니다. 화면 · 구역 맨 위의 1차 탭은 Line(밑줄 막대)을, 그 안의 2차 탭은 Chip Tabs(칩 모양)를 씁니다.

같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 자리는 [Segmented Control](segmented-control.md), 폼 값은 [Select](select.md) 의 "고르는 컴포넌트 고르기"(판단 순서), 목록 조건을 걸고 푸는 자리는 [Chip](chip.md) 의 필터 바를 씁니다. 화면 사이를 오가는 부품(하단 탭 바 · 사이드바 · 상단 바)은 DESIGN.md Layout 의 "이동 부품 고르기" 표 하나에서 고릅니다.

수치 원본은 [`tabs.yaml`](tabs.yaml)(Line)과 [`chip-tabs.yaml`](chip-tabs.yaml)(Chip Tabs — 칩 하나는 [`chip.yaml`](chip.yaml) 그대로)입니다.

[그림: 증권 · 통계 · 휴가 — 라이트 · 다크](../../site/components/specs/tabs.tsx#hero)

### 직접 골라 보기

모양(Line · Chip Tabs) · 폭 · 크기 · 탭 수 · 알림 점 · 막힌 탭을 바꾸면 탭과 코드가 함께 바뀝니다. 탭을 누르고 방향키로 옮겨 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/tabs.tsx#playground)

## Anatomy

[그림: 탭은 목록 · 탭 · 글 · 막대로 이뤄지고, 새 소식이 있는 탭 하나에 알림 점을 답니다](../../site/components/specs/tabs.tsx#anatomy)

| ⓐ List | 목록 — 놓인 화면 · 구역 폭을 채우고, 바닥에 1px 구획 선을 긋습니다. 바탕은 불투명합니다. |
| ⓑ Tab | 탭 하나 — 누르는 자리입니다. 고르든 안 고르든 바탕이 없습니다. |
| ⓒ Label | 글 — 이름만 한 줄로 씁니다. 고르면 글자색만 짙어집니다(굵기 그대로). |
| ⓓ Indicator | 막대 — 고른 탭 아래 2px 입니다. 다른 탭을 고르면 미끄러져 옮깁니다. |
| ⓔ Notification | 알림 점 — 새 소식이 있는 탭 하나에만, 글 오른쪽 위에 답니다. |

[표: 부위](tabs.yaml#slots)

## Properties

### Layout

탭이 5개 이하이고 글이 짧으면 **Fill** 을 씁니다. 칸을 똑같이 나눠 목록을 꽉 채우고, 막대는 칸에서 좌우 16 씩 들입니다. 6개 이상이거나 글이 길면 **Hug** 를 씁니다. 탭이 글만큼 넓어지고(글 + 좌우 10), 목록 좌우는 16 이며, 넘치면 가로로 스크롤합니다. 목록 좌우 16 에 탭의 좌우 10 이 더해져 Hug 의 첫 글은 26 에서 시작하고, 본문 글의 화면 여백 24 와 거의 맞습니다. Hug 에서는 고른 탭이 늘 보이도록, 화면 밖 탭을 고르면 16 여유를 두고 그쪽으로 스크롤합니다. 데스크톱의 넓은 카드 · 페이지처럼 칸을 나누면 탭이 지나치게 넓어지는 자리는 개수가 적어도 Hug 로 둡니다. 글은 줄바꿈 · 말줄임하지 않습니다.

좌우 안전 영역이 있는 화면(가로로 돌린 폰 · 옆에 상태 칸이 있는 폴더블)에서는 탭 줄 전체 — 바탕 · 아래 선 · 칸 — 를 안전 영역 안에 둡니다. 좌우 안전 영역은 뒷배경입니다. Fill 은 안전 영역 안의 폭을 나누고, Hug 는 목록 좌우 16 을 안전 영역 경계부터 잽니다. 넘치지 않는 줄은 스크롤로 끝 칸을 가져올 수 없기 때문입니다(Layout 의 "Safe Area").

Fill 에서 글이 칸을 넘으면(영어처럼 글이 길어지는 언어에서 자주 그렇습니다) Hug 로 바꾸지 않고 Fill 모양 그대로 목록만 가로로 스크롤합니다(목록은 늘 overflow-x auto 입니다). 이때도 고른 탭은 Hug 처럼 가장자리와 16 을 두고 드러냅니다(scroll-padding 16 — 목록 좌우 여백은 0 그대로입니다). 다만 첫 탭이 화면 끝 0 에서 시작하고 막대가 칸에서 16 들어간 모양 그대로라, 잘린 끝 탭이 "더 있다" 는 단서가 약합니다. 그래서 개수 · 글 길이로 미리 알 수 있으면 처음부터 Hug 로 둡니다. 탭 줄 높이 40 · 44 는 px 최소 높이라, 글이 커지면 필요한 만큼만 늘어납니다.

[그림: 폭 — Fill(칸을 나눔) · Hug(글만큼, 넘치면 스크롤)](../../site/components/specs/tabs.tsx#layout)

[표: 폭](tabs.yaml#layout)

### Size

`small` 40 · 글 14 *(기본)*, `medium` 44 · 글 16 입니다. 탭의 위아래 · 좌우 여백은 모두 10 이고, 글을 아래로 붙여(아래 10) 막대와 글 사이가 크기와 관계없이 같습니다. 글은 고르든 안 고르든 700 입니다. 어느 크기를 쓸지는 화면의 다른 글과의 조합과 주목도로 고릅니다.

[그림: 크기 — small 40 · medium 44](../../site/components/specs/tabs.tsx#size)

[표: 크기](tabs.yaml#size)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 안 고른 글 `fg-neutral-subtle`, 고른 글 `fg-neutral` + 아래 막대 |
| `pressed` | 탭을 2px 거리로 축소만 하고 색은 그대로 둡니다. 글자색이 이미 고름을 알리므로, 누르는 동안 색이 바뀌면 손을 떼기 전에 고른 것처럼 보이기 때문입니다(Foundation Feedback). 마우스 호버 모양도 없습니다. 고름은 손을 뗄 때(click)이고, 누른 채 밖으로 끌어내면 고르지 않습니다. 키보드는 방향키로 바로 고릅니다(Behavior) |
| `focused` | 키보드 포커스에만 링 2px — 탭 **안쪽**(이웃 탭 · 바닥 선에 걸리지 않게) |
| `disabled` | 글 `fg-disabled` · 커서 not-allowed · 축소 없음. 방향키로 옮길 때 건너뜁니다 |

[그림: 상태 — 기본 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/tabs.tsx#states)

[표: 상태 — 안 고름](tabs.yaml#matrix)

[표: 상태 — 고름](tabs.yaml#matrix.selected.selected)

[표: 모션](tabs.yaml#motion)

### Chip Tabs

1차 Line 탭 안의 2차 탭입니다. 칩 하나는 [Chip](chip.md) 그대로입니다 — `solid` 는 Chip Solid, `outline` 은 Chip Outline Strong, 크기는 Chip medium 36 *(기본)* · large 40 입니다. 고르면 짙은 채움(`bg-neutral-inverted` · `fg-neutral-inverted`)이고 Outline 은 테두리를 지웁니다. 누름 · 호버 · 포커스 · 비활성도 Chip 과 같습니다(비활성은 흐리게 하지 않습니다). 목록은 바탕 · 바닥 선 없이 한 줄 가로 스크롤이고, 칩 사이 8 · 좌우 화면 여백 24 · 위아래 8 입니다. 좌우 24 는 Chip 의 가로 스크롤 줄(필터 바 · 제안 줄)과 같아, 칩 줄은 어디서나 첫 칩이 화면 여백에서 시작합니다. 목록의 양 끝은 [Scroll Fog](scroll-fog.md) 로 늘 흐립니다(좌우 20 — 여백 24 가 더 넓어 처음 · 끝 칩은 흐려지지 않습니다).

- 화면 전체 내용을 바꾸면 **Solid**, 일부 내용만 바꾸면 **Outline** 을 씁니다.
- **large** 는 화면 전체를 바꾸는 탭에, **medium** 은 좁은 자리 · 스크롤 중간의 서브 내용에 씁니다.
- 알림 점은 글 **뒤** 6 에 둡니다(칩 안이라 오른쪽 위가 아닙니다).
- 칩 하나가 보이는 목록 폭(화면 여백 안)보다 길면(큰 글자 · 긴 이름) 그 폭에서 멈추고 글 끝을 "…" 로 줄입니다. 알림 점은 남깁니다. 탭의 이름과 보조 기술이 읽는 글은 글 전체입니다. Chip 의 "줄보다 긴 칩" 규칙과 같습니다. Line 탭의 글은 줄바꿈 · 말줄임하지 않습니다(Fill 에서 넘치면 Hug).

[그림: Chip Tabs — Solid · Outline × medium · large](../../site/components/specs/tabs.tsx#chip-tabs)

[표: Chip Tabs — 변형](chip-tabs.yaml#variant)

[표: Chip Tabs — 크기](chip-tabs.yaml#size)

[표: Chip Tabs — 목록 · 알림 점](chip-tabs.yaml#base)

## Guidelines

### 탭은 다른 구역으로 옮길 때

탭은 **탐색**입니다. 누르면 탭 아래 내용 전체가 다른 구역으로 바뀝니다. 화면 · 구역의 맨 위에 둡니다. 같은 내용을 거르거나 · 정렬하거나 · 다르게 보는 **조작**은 그 내용 바로 위의 [Segmented Control](segmented-control.md) 을 씁니다. 방향키로 옮기기만 해도 고르므로(아래 Behavior), 바로 저장되거나 되돌리기 어려운 값은 탭에 두지 않습니다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 다른 구역 · 페이지로 옮김(1차) | **Tabs** — Line |
| 1차 탭 안에서 다시 나눔(2차) | **Tabs** — Chip Tabs |
| 같은 내용 2 ~ 4가지 거르기 · 정렬 · 보기 | [Segmented Control](segmented-control.md) |
| 2 ~ 4개 짧은 폼 값 · 거르기의 한 축 | [Chip](chip.md)(하나 고르기) |
| 목록 조건을 여럿 걸고 풂 | [Chip](chip.md)(필터 바) |
| 5개 이상 · 글이 긴 폼 값 | [Select](select.md) · Radio · Checkbox |
| 켜고 끄는 단추 하나 | [Toggle](toggle.md) — 아이콘 단추 |

[그림: 쓰임 — 구역 이동은 탭 · 같은 내용 조작은 Segmented · 폼 값을 탭으로](../../site/components/specs/tabs.tsx#role-guide)

### 탭 바보다 더 나눌 때 — 화면 위 Line

폰의 [Bottom Navigation](bottom-navigation.md) 은 다섯 칸이 어느 화면에서나 같습니다. 더 나눌 구분은 탭 바 칸을 바꾸지 않고 그 탭 화면의 맨 위 1차 Line 으로 둡니다. 화면 맨 위 1차 Line 은 어디서나 [Top Navigation](top-navigation.md) 바로 아래에 붙어 함께 고정됩니다. 숨는 것은 그 아래 스크롤 상자의 [Scroll Auto Hide](scroll-auto-hide.md) 뿐이고, 화면을 오가는 1차 탭은 상단 바와 함께 남습니다([Scroll Auto Hide](scroll-auto-hide.md) 의 "숨지 않는 것").

#### Desk 에서는

아래는 부품 규칙이 아니라 Desk 의 화면 배치입니다. Desk 의 가계부 탭은 화면 위 Line 넷(가계부 · 자산 · 통계 · 예산 — Fill · `medium` 44)입니다. 머리 제목은 넷 모두 "가계부" 입니다(탭 바 칸의 이름이고, 고른 탭은 Line 이 알립니다. 문서 제목만 "{탭 이름} - 그루 담다" 입니다). 화면 위 Line 은 가계부 묶음과 카테고리의 지출 · 수입에 둡니다. 데스크톱(768 이상)에서는 넷이 [Side Navigation](side-navigation.md) 의 항목이라 이 탭 줄이 없습니다.

웹과 앱은 짜임이 다르지만 쓰는 사람이 겪는 동작은 같습니다.

- **웹** — 넷은 각자의 경로입니다(`/desk/expense` · `/desk/asset` · `/desk/stats` · `/desk/budget` — 사이드바 항목도 같은 경로라 `?tab=` 을 두지 않습니다). 탭을 고르면 그 경로로 지금 주소를 고쳐 쓰고(`replace` — 뒤로 가기가 탭을 되짚지 않습니다), 다른 탭을 다녀오면 그 탭의 스크롤로 돌아옵니다(경로마다 기억하고 목록이 그려진 뒤 돌려놓으며, 돌려놓지 못하면 맨 위입니다). 기억 · 복원은 화면이 맡습니다.
- **앱** — 넷은 한 화면 안의 Tabs 입니다(`TabsSwipeArea`). 탭마다 상태(스크롤 · 필터)가 남고, 옆으로 밀어 넘깁니다. 경로 넷(`/expense?…` 등)은 그 탭을 여는 입구로 그대로 받습니다. 뒤로 버튼 동작은 그 한 화면에 한 번입니다.

그 안에서 다시 나누는 탭(통계의 카테고리 · 추이 · 비교)은 폰에서 2차가 되어 아래 "두 단" 규칙을 따릅니다. 2차는 Chip Tabs 이고, 통계 화면에 필터 칩이 함께 있으면 Line 입니다. 데스크톱에서는 1차 Line 그대로입니다. 앱 통계 안의 2차 탭은 밀어 넘기지 않습니다. 옆으로 밀면 1차(예산)로 넘어가고, 2차는 눌러서만 바꿉니다(아래 "내용 바꾸기").

[그림: 폰 가계부 — 상단 바 아래 Line 넷 · 탭 바는 그대로](../../site/components/specs/tabs.tsx#money-guide)

### 두 단 — 1차 Line · 2차 Chip Tabs

탭 안에서 다시 나누면 1차는 Line, 2차는 Chip Tabs 로 둡니다. 두 단이 같은 모양이면 어느 줄이 큰 갈래인지 보이지 않기 때문입니다. 화면에 필터 바(거르는 칩)가 함께 있으면 2차도 Line 으로 둡니다. Chip Tabs 와 필터 칩이 같은 모양이면 무엇이 탭인지 알 수 없기 때문입니다.

[그림: 두 단 — 1차 Line · 2차 Chip Tabs · 필터 바와 겹친 Chip Tabs](../../site/components/specs/tabs.tsx#two-tier-guide)

### 폭 — 5개까지 Fill, 6개부터 Hug

짧은 2 ~ 5개는 Fill 로 칸을 나누고, 6개 이상이거나 글이 길어 칸을 넘으면 Hug 로 둡니다. Fill 을 억지로 좁혀 글을 자르거나 줄이지 않습니다.

[그림: 폭 — 6개는 Hug · Fill 에 6개를 욱여넣기](../../site/components/specs/tabs.tsx#fill-hug-guide)

### 글 — 이름만, 알림 점은 하나

탭 글은 이름만 씁니다. "진행 중 3" 처럼 개수를 붙이지 않습니다. 수가 바뀔 때마다 탭 폭이 흔들리고, 탭이 "얼마나 있나" 를 알리는 자리가 되기 때문입니다. 개수가 필요하면 내용 안에서 보입니다. 새 소식은 그 탭 하나에만 알림 점(6)을 달고, 내용을 보면 지웁니다. 여러 탭에 동시에 달지 않습니다. 글은 명사로 짧게 쓰고, 한 묶음의 말투를 맞춥니다.

[그림: 글 — 이름만 · 알림 점 하나 · 글에 개수 · 여러 탭에 점](../../site/components/specs/tabs.tsx#label-guide)

### 내용 바꾸기 — 바로, 상태를 남깁니다

탭을 고르면 내용 칸이 애니메이션 없이 바로 바뀝니다(막대만 200ms 로 미끄러집니다). 탭마다 스크롤 · 입력 같은 상태를 남겨, 다른 탭을 다녀와도 그대로입니다. 내용 칸 안의 입력 · 스크롤은 부품이 남기고, 페이지 전체가 스크롤되는 화면이면 화면이 탭마다 스크롤 위치를 기억했다가 돌려놓습니다(웹 가계부 묶음처럼 탭이 경로이면 경로마다 기억하고, 목록이 그려진 뒤 돌려놓습니다). 탭을 바꿔도 초점은 고른 탭에 남습니다. 폰에서 화면 전체를 바꾸는 1차 탭만 내용을 옆으로 밀어 넘길 수 있습니다(가로로 스크롤하는 영역 위에서는 넘기지 않습니다). 웹은 1차 탭을 주소에 남겨, 뒤로 가기 · 링크 · 새로고침이 같은 탭으로 돌아옵니다. 탭을 바꿀 때는 지금 주소를 고쳐 씁니다(방문 기록을 쌓지 않습니다). 그래서 뒤로 가기가 탭을 하나씩 되짚지 않고 이전 화면으로 갑니다.

[그림: 내용 — 폰 1차 탭 밀어 넘기기 · 웹 주소의 탭](../../site/components/specs/tabs.tsx#content-guide)

## 코드

레시피 `recipes/shadcn/components/ui/tabs.tsx` 를 씁니다(Radix Tabs 위 — 방향키로 옮기면 바로 고릅니다). 목록에 보이는 제목이 없으면 `aria-label` 로 이름을 답니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### Line — Fill

[그림: Line Fill — 통계](../../site/components/specs/tabs.tsx#ex-fill)

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs value={tab} onValueChange={setTab}>
  <TabsList aria-label="통계">
    <TabsTrigger value="category">카테고리</TabsTrigger>
    <TabsTrigger value="trend">추이</TabsTrigger>
    <TabsTrigger value="compare">비교</TabsTrigger>
  </TabsList>
  <TabsContent value="category">…</TabsContent>
  <TabsContent value="trend">…</TabsContent>
  <TabsContent value="compare">…</TabsContent>
</Tabs>
```

### Line — Hug · 알림 점

[그림: Line Hug — 금액 가리기 · 휴가 승인](../../site/components/specs/tabs.tsx#ex-hug)

```tsx
{/* value 는 글이 아니라 바뀌지 않는 id — 글에 빈칸이 있으면 탭 · 내용 칸의 id 연결이 깨진다 */}
<Tabs value={screen} onValueChange={setScreen}>
  <TabsList layout="hug" aria-label="금액 가리기">
    {SCREENS.map((s) => (
      <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
    ))}
  </TabsList>
  …
</Tabs>

<Tabs value={tab} onValueChange={setTab}>
  <TabsList layout="hug" size="medium" aria-label="휴가 신청">
    <TabsTrigger value="mine">신청 내역</TabsTrigger>
    <TabsTrigger value="approval" notification={hasPending}>승인 내역</TabsTrigger>
  </TabsList>
  …
</Tabs>
```

### 두 단 — Chip Tabs

[그림: 두 단 — 증권](../../site/components/specs/tabs.tsx#ex-two-tier)

```tsx
import { ChipTabsList, ChipTabsTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs value={broker} onValueChange={setBroker}>
  <TabsList size="medium" aria-label="증권사">
    <TabsTrigger value="namu">나무증권</TabsTrigger>
    <TabsTrigger value="toss">토스증권</TabsTrigger>
  </TabsList>
  <TabsContent value="namu">
    <Tabs value={view} onValueChange={setView}>
      <ChipTabsList variant="solid" aria-label="나무증권 보기">
        <ChipTabsTrigger value="holding">보유</ChipTabsTrigger>
        <ChipTabsTrigger value="watch">관심</ChipTabsTrigger>
        <ChipTabsTrigger value="discover">발견</ChipTabsTrigger>
      </ChipTabsList>
      <TabsContent value="holding">…</TabsContent>
      …
    </Tabs>
  </TabsContent>
  …
</Tabs>
```

### 밀어 넘기기 · 주소 — 폰 · 웹의 1차 탭

폰에서 화면 전체를 바꾸는 1차 탭만 내용 칸을 `TabsSwipeArea` 로 감쌉니다(2차 탭 · Segmented Control 에는 두지 않습니다). 웹은 값을 주소에 두고, 탭을 바꿀 때 지금 주소를 고쳐 씁니다(`replace`).

```tsx
import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsSwipeArea, TabsTrigger } from "@/components/ui/tabs"

const [params, setParams] = useSearchParams()
const tab = params.get("tab") ?? "category"

<Tabs value={tab} onValueChange={(v) => setParams((p) => { p.set("tab", v); return p }, { replace: true })}>
  <TabsList aria-label="통계">
    <TabsTrigger value="category">카테고리</TabsTrigger>
    <TabsTrigger value="trend">추이</TabsTrigger>
    <TabsTrigger value="compare">비교</TabsTrigger>
  </TabsList>
  <TabsSwipeArea>
    <TabsContent value="category">…</TabsContent>
    <TabsContent value="trend">…</TabsContent>
    <TabsContent value="compare">…</TabsContent>
  </TabsSwipeArea>
</Tabs>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click · Tap | 손을 뗄 때 그 탭을 고르고 내용 칸을 바로 바꿉니다. 누르는 동안은 축소만 하고, 누른 채 밖으로 끌어내면 고르지 않습니다. 막대가 200ms 로 미끄러집니다. Chip Tabs 도 같습니다. |
| `←` `→` | 이웃 탭으로 옮기며 **바로 고릅니다**(자동). 끝에서 처음으로 돌고, 막힌 탭은 건너뜁니다. |
| `Home` · `End` | 첫 · 마지막 탭(막히지 않은)으로 옮기며 고릅니다. |
| `Tab` | 목록에서는 고른 탭 하나에만 섭니다. 다음 `Tab` 은 내용 칸으로 갑니다. |
| 폰 1차 탭 밀어 넘기기 | 내용을 옆으로 밀면 이웃 탭으로 넘어갑니다. 내용은 손을 따라 움직이고, 막대는 지금 탭에 있다가 손을 떼고 넘어가면 200ms 로 옮깁니다. 칸 폭의 25% 를 넘기거나 빠르게 튕기면 넘어가고, 아니면 제자리로 돌아옵니다. 2차 탭 · Segmented 에는 없습니다. |
| 화면 밖 탭을 고름(Hug · Chip Tabs) | 그 탭이 보이게 목록만 스크롤합니다. Hug 는 16, Chip Tabs 는 화면 여백 24 를 남깁니다. |
| 다른 탭을 다녀옴 | 탭마다 스크롤 · 입력 상태가 남아 있습니다. |
| 웹 1차 탭 | 주소에 남습니다(지금 주소를 고쳐 쓰고 기록을 쌓지 않습니다). 뒤로 가기 · 링크 · 새로고침이 같은 탭을 엽니다. |
| Disabled | 누를 수 없고, 커서는 not-allowed 이며, 방향키 이동에서 건너뜁니다. |
| 글자 크기 설정 | Line 탭 글이 커지고, 목록 · 탭은 최소 높이라 따라 높아집니다. 글은 줄바꿈 · 말줄임하지 않고 탭이 넓어지며, 넘치면 목록이 가로로 스크롤합니다. Chip Tabs 는 한 줄 부품이라 칩 글이 커지고 칩 높이가 따라 늘며, 목록 폭보다 길면 끝을 "…" 로 줄입니다. 막대 · 알림 점은 px 그대로입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral-subtle` 목록 위 5.50 · 6.09, 고른 글 `fg-neutral` 16.41 · 13.42 ✓. 비활성 `fg-disabled` 는 기준 밖입니다(비활성 UI). Chip Tabs 는 [Chip](chip.md) 의 검증과 같습니다 |
| **WCAG 1.4.4** Resize text | Line 탭 글 · Chip Tabs 글이 글자 크기 설정을 따라 커집니다 ✓ — 목록이 넘치면 가로로 스크롤하고, 줄인 칩 글은 이름 전체를 보조 기술이 읽습니다. 알림 점은 글이 아니라 대상이 아닙니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고름은 막대 2px `fg-neutral`(목록 바탕과 16.41 · 13.42)로 알립니다 ✓. 바닥 구획 선(1.15 · 1.30)은 목록을 알리는 유일한 표시가 아닙니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. 알림 점 `fg-brand` 목록 바탕과 Desk 8.38 · 6.10 · HR 8.17 · 6.07, 칩 바탕(`bg-neutral-weak`)과 7.76 · 4.69 · 7.56 · 4.67 ✓ — 고른 탭에는 그리지 않습니다 |
| **WCAG 1.4.1** Use of color | 고름은 글자색만이 아니라 막대로도 알립니다 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px — 탭 안쪽 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | small 40 · medium 44 ✓(가로는 탭 폭 — Hug 도 글 + 20) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | medium 44 ✓ · small 40 ✗(40 — 목록 높이가 곧 누르는 높이입니다) |
| **앱(Flutter)** | Flutter 는 tab · tabBar 역할을 Android · iOS 화면 읽기에 전달하지 않습니다. 그래서 앱 탭은 이름 끝에 "탭 n/m"(영어 "Tab n of m")을 붙이고 선택됨 상태를 둡니다 — Flutter Material `TabBar` 와 같은 방식입니다. 탭이 버튼으로 읽히지 않도록 버튼 역할은 두지 않습니다. Line 탭 · Chip Tabs 가 같습니다 |
| **ARIA** | 목록 `role="tablist"`(이름은 보이는 제목 또는 `aria-label`), 탭 `role="tab"` + `aria-selected` · `aria-controls`, 내용 칸 `role="tabpanel"` + `aria-labelledby`(포커스할 것이 없는 칸은 `tabindex="0"`). 고른 탭만 `tabindex="0"`(로빙). 막힌 탭 `disabled`. 알림 점은 보조 기술에 "새 소식" 을 덧붙입니다(점만으로 알리지 않습니다. 앱은 컴포넌트가 이 글을 가집니다) |

## Do / Don't

### ✅ Do

- 다른 구역으로 옮기는 자리에 탭을 쓰고, 화면 · 구역 맨 위에 둡니다.
- 두 단이면 1차는 Line, 2차는 Chip Tabs 로 둡니다.
- 5개까지는 Fill, 6개부터 · 긴 글은 Hug 로 둡니다.
- 글은 이름만 쓰고, 새 소식은 한 탭에 알림 점 하나로 알립니다.
- 고른 표시는 중립색 막대로 둡니다 — Desk · HR 이 같습니다.

### ❌ Don't

- 폼 값 · 바로 저장되는 설정을 탭으로 받지 않습니다(Chip · Select 를 씁니다).
- 같은 내용을 거르는 2 ~ 4개를 탭으로 두지 않습니다(Segmented Control 을 씁니다).
- 고른 탭을 브랜드 색 · 굵기로 바꾸지 않습니다.
- 탭 글에 개수를 붙이거나 여러 탭에 알림 점을 달지 않습니다.
- Chip Tabs 와 필터 칩을 한 화면에 같은 모양으로 두지 않습니다.

## Specification

`tabs.yaml` · `chip-tabs.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다. 웹 · 앱은 Tabs 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다. Chip Tabs 의 칩 하나는 [Chip](chip.md) 의 Specification 을 따릅니다.

[그림: Specification — tabs.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#tabs)

[그림: Specification — chip-tabs.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chip-tabs)
