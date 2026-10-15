# Tabs

> 다른 구역으로 옮기는 탭. 화면 · 구역 맨 위의 1차 탭은 Line(밑줄 막대), 그 안의 2차 탭은 Chip Tabs(칩 모양)다. 같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 자리는 [Segmented Control](segmented-control.md), 2 ~ 4개 짧은 폼 값은 [Chip](chip.md) · 5개 이상은 [Select](select.md), 목록 조건을 걸고 푸는 자리는 Chip 의 필터 바다.

구조는 당근 [SEED Tabs](https://seed-design.io/components/tabs)(Apache-2.0)를 따른다 — Line 타입(목록 · 탭 · 글 · 막대)과 Chip 타입(칩 모양 탭), 1차 Line · 2차 Chip. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`tabs.yaml`](tabs.yaml)(Line)과 [`chip-tabs.yaml`](chip-tabs.yaml)(Chip Tabs — 칩 하나는 [`chip.yaml`](chip.yaml) 그대로)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 증권 · 통계 · 휴가 — 라이트 · 다크](../../site/components/specs/tabs.tsx#hero)

### 직접 골라 보기

모양(Line · Chip Tabs) · 폭 · 크기 · 탭 수 · 알림 점 · 막힌 탭을 고르면 스펙대로 그린 탭과 그 코드가 바뀐다. 실제로 누르고 화살표로 옮길 수 있다.

[그림: 플레이그라운드](../../site/components/specs/tabs.tsx#playground)

## Anatomy

[그림: 탭은 목록 · 탭 · 글 · 막대로, 새 소식이 있는 탭 하나에 알림 점을 단다](../../site/components/specs/tabs.tsx#anatomy)

| ⓐ List | 목록 — 놓인 화면 · 구역 폭을 채우고, 바닥에 1px 구획 선을 긋는다. 바탕은 불투명하다. |
| ⓑ Tab | 탭 하나 — 누르는 자리. 고르든 안 고르든 바탕이 없다. |
| ⓒ Label | 글 — 이름만, 한 줄. 고르면 글자색만 짙어진다(굵기 그대로). |
| ⓓ Indicator | 막대 — 고른 탭 아래 2px. 다른 탭을 고르면 미끄러져 옮긴다. |
| ⓔ Notification | 알림 점 — 새 소식이 있는 탭 하나에만, 글 오른쪽 위. |

[표: 부위](tabs.yaml#slots)

## Properties

### Layout

탭이 5개 이하이고 글이 짧으면 **Fill** — 칸을 똑같이 나눠 목록을 꽉 채우고, 막대는 칸에서 좌우 16 씩 들인다. 6개 이상이거나 글이 길면 **Hug** — 탭이 글만큼 넓어지고(글 + 좌우 10), 목록 좌우 16 · 넘치면 가로로 스크롤한다. Hug 에서는 고른 탭이 늘 보이게, 화면 밖 탭을 고르면 16 여유를 두고 그쪽으로 스크롤한다. 데스크톱의 넓은 카드 · 페이지처럼 칸을 나누면 탭이 지나치게 넓어지는 자리는 개수가 적어도 Hug 로 둔다. 글은 줄바꿈 · 말줄임하지 않는다 — Fill 에서 글이 칸을 넘으면 Hug 로 바꾼다(영어처럼 글이 길어지는 언어에서 자주 그렇다).

[그림: 폭 — Fill(칸을 나눈다) · Hug(글만큼, 넘치면 스크롤)](../../site/components/specs/tabs.tsx#layout)

[표: 폭](tabs.yaml#layout)

### Size

`small` 40 · 글 14 *(기본)* · `medium` 44 · 글 16. 탭의 위아래 · 좌우는 둘 다 10 이고, 글을 아래로 붙여(아래 10) 막대와 글 사이가 크기와 관계없이 같다. 글은 고르든 안 고르든 700 이다. 어느 크기를 쓸지는 화면의 다른 글과의 조합 · 주목도로 고른다(SEED).

[그림: 크기 — small 40 · medium 44](../../site/components/specs/tabs.tsx#size)

[표: 크기](tabs.yaml#size)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 안 고른 글 `fg-neutral-subtle`, 고른 글 `fg-neutral` + 아래 막대 |
| `pressed` | 탭을 2px 거리로 축소만 한다 — 색은 그대로다. 글자색이 이미 고름을 말하므로, 누르는 동안 색이 바뀌면 손을 떼기 전에 고른 것처럼 보인다(Foundation Feedback). 마우스 호버 모양도 없다 |
| `focused` | 키보드 포커스에만 링 2px — 탭 **안쪽**(이웃 탭 · 바닥 선에 걸리지 않게) |
| `disabled` | 글 `fg-disabled` · 커서 not-allowed · 축소 없음. 화살표로 옮길 때 건너뛴다 |

[그림: 상태 — 기본 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/tabs.tsx#states)

[표: 상태 — 안 고름](tabs.yaml#matrix)

[표: 상태 — 고름](tabs.yaml#matrix.selected.selected)

[표: 모션](tabs.yaml#motion)

### Chip Tabs

1차 Line 탭 안의 2차 탭이다. 칩 하나는 [Chip](chip.md) 그대로 — `solid` 는 Chip Solid, `outline` 은 Chip Outline Strong, 크기는 Chip medium 36 *(기본)* · large 40 이다. 고르면 짙은 채움(`bg-neutral-inverted` · `fg-neutral-inverted`)이고, 누름 · 호버 · 포커스 · 비활성도 Chip 과 같다. 목록은 바탕 · 바닥 선 없이 한 줄 가로 스크롤이고, 칩 사이 8 · 좌우 화면 여백 24(Chip 의 가로 스크롤 줄과 같다) · 위아래 8 이다. 목록의 양 끝은 [Scroll Fog](scroll-fog.md) 로 늘 흐린다(좌우 20 — 여백 24 가 더 넓어 처음 · 끝 칩은 흐리지 않는다).

- 화면 전체 내용을 바꾸면 **Solid**, 일부 내용만 바꾸면 **Outline**(SEED).
- **large** 는 화면 전체를 바꾸는 탭, **medium** 은 좁은 자리 · 스크롤 중간의 서브 내용(SEED).
- 알림 점은 글 **뒤** 6 에 둔다(칩 안이라 오른쪽 위가 아니다).

[그림: Chip Tabs — Solid · Outline × medium · large](../../site/components/specs/tabs.tsx#chip-tabs)

[표: Chip Tabs — 변형](chip-tabs.yaml#variant)

[표: Chip Tabs — 크기](chip-tabs.yaml#size)

[표: Chip Tabs — 목록 · 알림 점](chip-tabs.yaml#base)

## Guidelines

### 탭은 다른 구역으로 옮길 때

탭은 **탐색**이다 — 누르면 탭 아래 내용 전체가 다른 구역으로 바뀐다. 화면 · 구역의 맨 위에 둔다. 같은 내용을 거르거나 · 정렬하거나 · 다르게 보는 **조작**은 그 내용 바로 위의 [Segmented Control](segmented-control.md) 이다. 화살표로 옮기기만 해도 고르므로(아래 Behavior), 바로 저장되거나 되돌리기 어려운 값은 탭에 두지 않는다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 다른 구역 · 페이지로 옮긴다(1차) | **Tabs** — Line |
| 1차 탭 안에서 다시 나눈다(2차) | **Tabs** — Chip Tabs |
| 같은 내용 2 ~ 4가지 거르기 · 정렬 · 보기 | [Segmented Control](segmented-control.md) |
| 2 ~ 4개 짧은 폼 값 · 거르기의 한 축 | [Chip](chip.md)(하나 고르기) |
| 목록 조건을 여럿 걸고 푼다 | [Chip](chip.md)(필터 바) |
| 5개 이상 · 글이 긴 폼 값 | [Select](select.md) · Radio · Checkbox |
| 켜고 끄는 단추 하나 | [Toggle](toggle.md) — 아이콘 단추 |

[그림: 쓰임 — 구역 이동은 탭 · 같은 내용 조작은 Segmented · 폼 값을 탭으로](../../site/components/specs/tabs.tsx#role-guide)

### 탭 바보다 더 나눌 때 — 화면 위 Line

폰의 [Bottom Navigation](bottom-navigation.md) 은 다섯 칸이 어느 화면에서나 같다 — 더 나눌 구분은 탭 바 칸을 바꾸지 않고 그 탭 화면의 맨 위 1차 Line 으로 둔다(SEED Bottom Navigation — "더 많은 구분이 필요하다면 화면 상단에 Tabs 를 사용"). Desk 의 가계부 탭은 화면 위 Line 넷(가계부 · 자산 · 통계 · 예산 — Fill · `medium` 44)이다. 목록은 [Top Navigation](top-navigation.md) 바로 아래에 붙어 함께 고정되고(SEED Tabs `stickyList`), 웹은 고른 탭을 주소에 둔다(넷은 각자의 주소 — 바꿀 때 지금 주소를 고쳐 쓴다). 데스크톱(768 이상)에서는 넷이 [Side Navigation](side-navigation.md) 의 항목이라 이 탭 줄이 없다.

그 안에서 다시 나누는 탭(통계의 카테고리 · 추이 · 비교)은 폰에서 2차가 되어 아래 "두 단" 규칙(2026-10-02)을 따른다 — 2차는 Chip Tabs 이고, 통계 화면에 필터 칩이 함께 있으면 Line 이다. 데스크톱에서는 1차 Line 그대로다. 앱 적용 때 통계 화면을 이 규칙에 맞춘다.

[그림: 폰 가계부 — 상단 바 아래 Line 넷 · 탭 바는 그대로](../../site/components/specs/tabs.tsx#money-guide)

### 두 단 — 1차 Line · 2차 Chip Tabs

탭 안에서 다시 나누면 1차는 Line, 2차는 Chip Tabs 로 둔다 — 두 단이 같은 모양이면 어느 줄이 큰 갈래인지 보이지 않는다. 화면에 필터 바(거르는 칩)가 함께 있으면 2차도 Line 으로 둔다 — Chip Tabs 와 필터 칩이 같은 모양이면 무엇이 탭인지 알 수 없다.

[그림: 두 단 — 1차 Line · 2차 Chip Tabs · 필터 바와 겹친 Chip Tabs](../../site/components/specs/tabs.tsx#two-tier-guide)

### 폭 — 5개까지 Fill, 6개부터 Hug

짧은 2 ~ 5개는 Fill 로 칸을 나누고, 6개 이상이거나 글이 길어 칸을 넘으면 Hug 로 둔다. Fill 을 억지로 좁혀 글을 자르거나 줄이지 않는다.

[그림: 폭 — 6개는 Hug · Fill 에 6개를 욱여넣기](../../site/components/specs/tabs.tsx#fill-hug-guide)

### 글 — 이름만, 알림 점은 하나

탭 글은 이름만 쓴다 — "진행 중 3" 처럼 개수를 붙이지 않는다. 수가 바뀔 때마다 탭 폭이 흔들리고, 탭이 "얼마나 있나" 를 알리는 자리가 된다. 개수가 필요하면 내용 안에서 보인다. 새 소식은 그 탭 하나에만 알림 점(6)을 달고, 내용을 보면 지운다 — 여러 탭에 동시에 달지 않는다. 글은 명사로 짧게, 한 묶음의 말투를 맞춘다.

[그림: 글 — 이름만 · 알림 점 하나 · 글에 개수 · 여러 탭에 점](../../site/components/specs/tabs.tsx#label-guide)

### 내용 바꾸기 — 바로, 상태를 남긴다

탭을 고르면 내용 칸이 애니메이션 없이 바로 바뀐다(막대만 200ms 로 미끄러진다). 탭마다 스크롤 · 입력 같은 상태를 남겨, 다른 탭을 다녀와도 그대로다 — 내용 칸 안의 입력 · 스크롤은 부품이 남기고, 페이지 전체가 스크롤되는 화면이면 화면이 탭마다 스크롤 위치를 기억했다가 돌려놓는다. 폰에서 화면 전체를 바꾸는 1차 탭만 내용을 옆으로 밀어 넘길 수 있다(가로로 스크롤하는 영역 위에서는 넘기지 않는다). 웹은 1차 탭을 주소에 남긴다 — 뒤로 가기 · 링크 · 새로고침이 같은 탭으로 돌아온다. 탭을 바꿀 때는 지금 주소를 고쳐 쓴다(방문 기록을 쌓지 않는다) — 뒤로 가기가 탭을 하나씩 되짚지 않고 이전 화면으로 간다.

[그림: 내용 — 폰 1차 탭 밀어 넘기기 · 웹 주소의 탭](../../site/components/specs/tabs.tsx#content-guide)

## 코드

레시피 `recipes/shadcn/components/ui/tabs.tsx` 를 쓴다(Radix Tabs 위 — 화살표로 옮기면 바로 고른다). 목록에 보이는 제목이 없으면 `aria-label` 로 이름을 단다. 아래 미리보기는 스펙 값으로 그린 모습이다.

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

폰에서 화면 전체를 바꾸는 1차 탭만 내용 칸을 `TabsSwipeArea` 로 감싼다(2차 탭 · Segmented Control 에는 두지 않는다). 웹은 값을 주소에 두고, 탭을 바꿀 때 지금 주소를 고쳐 쓴다(`replace`).

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
| Click · Tap | 그 탭을 고르고 내용 칸을 바로 바꾼다. 막대가 200ms 로 미끄러진다. |
| `←` `→` | 이웃 탭으로 옮기며 **바로 고른다**(자동). 끝에서 처음으로 돌고, 막힌 탭은 건너뛴다. |
| `Home` · `End` | 첫 · 마지막 탭(막히지 않은)으로 옮기며 고른다. |
| `Tab` | 목록에서는 고른 탭 하나에만 선다. 다음 `Tab` 은 내용 칸으로 간다. |
| 폰 1차 탭 밀어 넘기기 | 내용을 옆으로 밀면 이웃 탭으로 넘어간다 — 내용은 손을 따라 움직이고, 막대는 지금 탭에 있다가 손을 떼고 넘어가면 200ms 로 옮긴다. 칸 폭의 25% 를 넘기거나 빠르게 튕기면 넘어가고, 아니면 제자리로. 2차 탭 · Segmented 에는 없다. |
| 화면 밖 탭을 고름(Hug · Chip Tabs) | 그 탭이 보이게 목록만 스크롤한다 — Hug 는 16, Chip Tabs 는 화면 여백 24 를 남긴다. |
| 다른 탭을 다녀옴 | 탭마다 스크롤 · 입력 상태가 남아 있다. |
| 웹 1차 탭 | 주소에 남는다(지금 주소를 고쳐 쓰고 기록을 쌓지 않는다) — 뒤로 가기 · 링크 · 새로고침이 같은 탭을 연다. |
| Disabled | 누를 수 없다 · 커서 not-allowed · 화살표 이동에서 건너뛴다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral-subtle` 목록 위 5.50 · 6.09, 고른 글 `fg-neutral` 16.41 · 13.42 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI). Chip Tabs 는 [Chip](chip.md) 의 검증 그대로 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고름은 막대 2px `fg-neutral`(목록 바탕과 16.41 · 13.42)로 알린다 ✓. 바닥 구획 선(1.15 · 1.30)은 목록을 알리는 유일한 표시가 아니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 알림 점 `fg-brand` 목록 바탕과 Desk 8.38 · 6.10 · HR 5.06 · 6.23, 칩 바탕(`bg-neutral-weak`)과 7.76 · 4.69 · 4.69 · 4.79 ✓ — 고른 탭에는 그리지 않는다 |
| **WCAG 1.4.1** Use of color | 고름은 글자색만이 아니라 막대로도 알린다 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px — 탭 안쪽 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | small 40 · medium 44 ✓(가로는 탭 폭 — Hug 도 글 + 20) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | medium 44 ✓ · small 40 ✗(40 — 목록 높이가 곧 누르는 높이다. SEED 와 같다) |
| **ARIA** | 목록 `role="tablist"`(이름은 보이는 제목 또는 `aria-label`), 탭 `role="tab"` + `aria-selected` · `aria-controls`, 내용 칸 `role="tabpanel"` + `aria-labelledby`(포커스할 것이 없는 칸은 `tabindex="0"`). 고른 탭만 `tabindex="0"`(로빙). 막힌 탭 `disabled`. 알림 점은 보조 기술에 "새 소식" 을 덧붙인다(점만으로 알리지 않는다) |

## Do / Don't

### ✅ Do

- 다른 구역으로 옮기는 자리에 탭을 쓰고, 화면 · 구역 맨 위에 둔다.
- 두 단이면 1차 Line · 2차 Chip Tabs.
- 5개까지 Fill, 6개부터 · 긴 글은 Hug.
- 글은 이름만, 새 소식은 한 탭에 알림 점 하나.
- 고른 표시는 중립색 막대 — Desk · HR 이 같다.

### ❌ Don't

- 폼 값 · 바로 저장되는 설정을 탭으로(Chip · Select).
- 같은 내용을 거르는 2 ~ 4개를 탭으로(Segmented Control).
- 고른 탭을 브랜드 색 · 굵기로 바꾸기.
- 탭 글에 개수 붙이기 · 여러 탭에 알림 점.
- Chip Tabs 와 필터 칩을 한 화면에 같은 모양으로.

## Specification

`tabs.yaml` · `chip-tabs.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Tabs 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다. Chip Tabs 의 칩 하나는 [Chip](chip.md) 의 Specification 이다.

[그림: Specification — tabs.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#tabs)

[그림: Specification — chip-tabs.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chip-tabs)

## SEED 와 다른 점

- **목록 바닥 선을 불투명 구획 선으로**(v102) — SEED `stroke.neutral-muted`(반투명) → `stroke-neutral-subtle`.
- **Line 의 막대 들임 · Hug 목록 좌우는 SEED 처럼 16** — porest 의 화면 여백 24(`spacing-global-gutter`)를 쓰지 않는다. 탭이 제 좌우 10 을 더해 Hug 의 첫 글이 26 에서 시작해 본문 글의 24 와 거의 맞는다.
- **Chip Tabs 목록 좌우는 화면 여백 24** — SEED 16. Chip 의 가로 스크롤 줄(필터 바 · 제안 줄)과 같게, 칩 줄은 어디서나 첫 칩이 화면 여백에서 시작한다. 위아래 8 은 SEED 에 없는 값이다.
- **Chip Tabs 의 칩은 porest Chip 그대로** — 비활성은 흐리게 하지 않고(v106), Outline 을 고르면 테두리를 지운다(SEED Chip Tabs 와 같다).
- **알림 점은 브랜드 글자색**(`fg-brand` — Desk · HR 이 다르다)이고, 보조 기술에 "새 소식" 을 덧붙인다(SEED 는 점만 그린다). SEED 의 `bg.brand-solid` 짝은 porest 다크에서 바탕과 1.73 · 2.86:1 이라 점이 안 보인다. 고른 탭에는 점을 그리지 않는다(내용을 보면 사라진다).
- **웹은 1차 탭을 주소에 남긴다** — SEED 에 없는 규칙이다(사용자 결정 2026-10-02). 내용은 SEED 기본처럼 바로 바꾸고 상태를 남긴다.

## Migration notes

### 2026-10-04 — 가계부 묶음은 화면 위 Line

[화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a) 7A — 하단 탭 바는 어느 화면에서나 홈 · 가계부 · + · 캘린더 · 전체 그대로이고, 가계부 · 자산 · 통계 · 예산은 가계부 화면 위 1차 Line 이다(웹은 주소에). 지금 웹 · 앱이 탭 바 칸을 ← · 가계부 · 자산 · 통계 · 예산으로 바꾸던 것(7B)은 걷는다 — [Bottom Navigation](bottom-navigation.md) 의 Migration notes. 그 아래 통계의 카테고리 · 추이 · 비교는 폰에서 2차라 "두 단" 규칙대로다(2026-10-08 — 새 결정 없이 규칙으로 풀었다).

### 2026-10-02 — SEED Tabs 로 다시 정한다

사용자가 [비교 페이지](https://claude.ai/artifact/F9C58e2o31ErMFjbu9jf4o)에서 정했다 — Tabs 는 구역 이동(1차 Line · 2차 Chip Tabs), 같은 내용 조작은 [Segmented Control](segmented-control.md) · Line 은 40 · 44 · 글 700 고정 · 고르면 글자색만 짙어지고 2px 중립색 막대가 미끄러진다(누름은 축소만) · 5개까지 Fill · 6개부터 Hug · 화살표로 옮기면 바로 고른다 · 내용은 바로 바꾸고 상태를 남긴다(폰 1차 탭 밀어 넘기기 · 웹 1차 탭은 주소에) · 글에 개수 없음 · 알림 점 하나. 옛 Tabs 의 세 모양(container · underline · pills)과 수동 활성화를 걷었다 — 옛 스펙은 `tabs.history/v-pre-seed-tabs.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사 — 세 제품 코드를 읽고 Desk 웹 · HR 은 크로미움에 띄워 쟀다). 탭처럼 생긴 자리 104곳(Desk 웹 49 · 앱 45 · HR 10) 중 구역 이동은 33곳이고, 같은 내용 조작 34곳은 Segmented Control · Chip, 폼 값 32곳은 Chip · Select 로 간다.

- **Desk 웹** — Radix Tabs 41곳이 모두 `tablist` 로 읽히지만 내용 칸이 없어 `aria-controls` 가 없는 id 를 가리킨다. 폼 값 탭(언어 · 이메일 주기)은 화살표마다 언어가 바뀌고 서버에 저장된다. 고른 표시가 회색 트랙 · 브랜드 채움 · 브랜드 밑줄 · status-info 채움 넷이고, 회색 트랙의 고른 칸은 트랙과 1.12 · 1.15:1 이다. 관심 그룹 탭은 스크롤이 없어 그룹 5개면 편집 버튼이 밀려난다. 탭 값이 화면 안 상태라 다른 메뉴를 다녀오거나 새로고침하면 처음 탭이다(주소에 남는 것은 증권사 경로 · 설정 `?section` 둘).
- **Desk 앱** — `PTabs` 37 · `PSegmented` 2 · 손으로 만든 것 6, 의미 구조가 없고 키보드로 고른 탭에 닿지 못한다. 가계부 · 자산 · 통계 · 예산 사이를 오가면 통계 탭이 처음으로 돌아가고, 내보내기 ↔ 가져오기를 바꾸면 고른 파일이 사라진다. 계좌 종류 6칸 탭은 "마이너스통장" 이 말줄임된다(→ Select).
- **HR 웹** — Radix Tabs 6 정의 · 8곳, 내용 칸을 갖춘 진짜 탭은 여기뿐이다. 라이트에서 고른 · 안 고른 글자색이 같고, 회사 화면(모바일) 영어 글이 칸을 넘친다.
- 앱 적용 때 화면마다 정할 자리 — 더치페이(진행 중 · 완료 · 친구), 관심 그룹, 호가 · 체결, 달력 · 목록, 차트 기간 5 · 캘린더 보기 5, HR 회사 모바일, HR 캘린더 필터 팝오버.
