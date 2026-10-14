# Collapsible

> 내용 하나를 접고 펴는 자리 — 거래 상세의 분할 내역, 분할 합계가 어긋날 때의 "빠르게 맞추기", HR 업무 보고의 상세 검색 조건. 트리거는 [Accordion](accordion.md) 항목 하나의 모양이다. 같은 모양의 항목이 여럿이면 Accordion 이다.

SEED 에는 Collapsible 컴포넌트가 없다 — [SEED Accordion](https://seed-design.io/components/accordion) 가이드의 한 줄 "단일 콘텐츠를 접고 펼치는 용도는 해당 아이템에 Collapsible 동작을 활용할 수 있어요" 뿐이다(Apache-2.0). porest 는 그 문장대로 트리거를 Accordion 항목 하나의 모양으로 둔다 — 줄 전체가 트리거, 머리 글이 곧 이름, 54 · 74, 꺾쇠 20(2026-10-10 사용자 결정 9A). 이름은 상태마다 바꾸지 않고 펼침은 `aria-expanded` 가 알린다(APG Disclosure), 펼친 뒤 초점은 트리거에 그대로다. 옛 Collapsible 스펙("스타일 0 · 동작만 — 시각은 사용처" · Button 으로 감싼 트리거 · "더 보기" 쓰임)을 대신한다.

수치 원본은 [`collapsible.yaml`](collapsible.yaml)이다 — 트리거 · 상태 · 모션 값은 [`accordion.yaml`](accordion.yaml)과 같고, 놓인 면(`surface`)만 더 있다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 상세 분할 내역(흰 면) · 빠르게 맞추기(경고 상자) · HR 상세 검색 조건(카드) — 라이트 · 다크](../../site/components/specs/collapsible.tsx#hero)

### 직접 골라 보기

놓인 면(흰 면 · 카드 · 경고 상자) · 설명 · 막힘 · 모션 줄이기를 고르면 스펙대로 그린 Collapsible 과 그 코드가 바뀐다. 트리거를 눌러 펼치고 초점을 두고 `Enter` · `Space` 를 눌러 볼 수 있다 — 옆 글이 읽기(이름 · 펼침)를 따라간다.

[그림: 플레이그라운드](../../site/components/specs/collapsible.tsx#playground)

## Anatomy

[그림: 트리거(이름 · 설명 · 꺾쇠) — 줄 전체가 누르는 자리, 펼치면 아래에 내용](../../site/components/specs/collapsible.tsx#anatomy)

| ⓐ Trigger | 트리거 — 줄 전체가 누르는 자리. 머리말(`h3`) 안의 단추다. |
| ⓑ Title | 이름 — 16 / 22 · 500. 무엇을 여닫는지 — 상태마다 바꾸지 않는다. |
| ⓒ Description | 설명 — 13 / 18 · 500 · 옅은 색. 합계 · 적용한 필터 수처럼 접혀 있어도 알아야 할 것, 있을 때만. |
| ⓓ Chevron | 꺾쇠 — 20. 접혀 있으면 아래, 펼치면 위. |
| ⓔ Panel | 펼친 내용 — 트리거와 같은 좌우, 아래 16. 안에서 스크롤하지 않는다. |

[표: 부위](collapsible.yaml#slots)

## Properties

### 트리거 — Accordion 항목 하나

트리거는 Accordion 항목과 같다 — 위아래 16 · 좌우 24, 이름 16 / 22 · 500 `fg-neutral`, 설명 13 / 18 · 500 `fg-neutral-subtle`(이름 아래 2), 꺾쇠 20 `fg-neutral-subtle`, 본문 ↔ 꺾쇠 12. 이름만이면 54, 설명이 있으면 74 다. 줄 전체가 누르는 자리라 글 단추 18 · 16.5 같은 작은 트리거가 생기지 않는다. 지금의 머리 + 오른쪽 글 단추 배치를 지키고 단추만 44 로 키우는 안(9B — 자리마다 단추 모양이 남는다)과 지금 그대로(9C)는 고르지 않았다.

[그림: 이름만 54 · 이름 + 설명 74 — "내역 분할 6개 · 합계 −123,456,789원"](../../site/components/specs/collapsible.tsx#trigger)

[표: 설명 있음 · 없음](collapsible.yaml#description)

[표: 트리거](collapsible.yaml#base.enabled@trigger)

[표: 이름](collapsible.yaml#base.enabled@title)

[표: 설명](collapsible.yaml#base.enabled@description)

[표: 꺾쇠](collapsible.yaml#base.enabled@chevron)

[표: 펼친 내용](collapsible.yaml#base.enabled@panel)

펼친 내용은 트리거와 같은 좌우 안에 두고 아래 16 으로 끝난다. 내용이 줄 목록이면(분할 내역 — 줄마다 위아래 12) 아래는 8 이다(`layout="rows"`) — 마지막 줄의 글 아래로 20 이 된다.

[표: 펼친 내용 — 글 · 줄 목록](collapsible.yaml#layout)

### Surface

놓인 면에 따라 여백 · 선 · 누름 색이 셋으로 나뉜다. 트리거의 글 · 꺾쇠 · 높이는 같다.

- **`default`** — 흰 면 · 시트 · 대화상자의 줄. 줄 폭 전체이고 좌우 24 — 거래 상세의 분할 내역.
- **`card`** — Collapsible 자체가 [Card](card.md) 면(1px `stroke-neutral-weak` · 모서리 16)이고 트리거가 그 머리다. 펼친 내용은 카드 안 여백 24 로 끝난다 — HR 업무 보고의 상세 검색 조건(툴바 단추가 아니라 조건 카드의 머리가 된다).
- **`warning`** — 경고 상자 안의 아래 줄. 상자(`bg-warning-weak` · 1px `stroke-warning-weak` · 모서리 12 · 경고 글 위 14 · 좌우 16 · 아래 12)의 안쪽 여백에 맞춰 좌우 16, 위에 1px `stroke-warning-weak` 선, 누름 · 호버는 경고 바탕의 누름 짝 `bg-warning-weak-pressed` — 분할 합계가 어긋날 때의 "빠르게 맞추기".

[그림: 흰 면 · 카드 · 경고 상자 — 같은 트리거, 여백 · 선 · 누름 색만 다르다](../../site/components/specs/collapsible.tsx#surface)

[표: 놓인 면](collapsible.yaml#surface@root+trigger+panel+divider)

[표: 경고 상자](collapsible.yaml#surface@box)

[표: 놓인 면 — 상태](collapsible.yaml#states.surface)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 · 꺾쇠 아래(펼침이면 위) |
| `hovered` | 웹 — 누름과 같은 바탕(v106) — 좌우 6 들어온 `bg-layer-default-pressed`(경고 상자는 `bg-warning-weak-pressed`), 모서리 10 |
| `focused` | 웹 — 키보드 포커스에만 트리거 안쪽 링 2px. 카드 · 경고 상자는 그 모서리를 따른다 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소(v104) |
| `disabled` | 이름 · 설명 · 꺾쇠가 `fg-disabled` — 흐리게 하지 않는다(v106) |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘](../../site/components/specs/collapsible.tsx#states)

[표: 상태](collapsible.yaml#matrix@background+content+title+description+chevron+focusRing)

[표: 펼침](collapsible.yaml#open)

[표: 모션](collapsible.yaml#motion)

펼침 · 꺾쇠는 Accordion 과 같은 300ms `motion-ease-easing` 이고(사용자 결정 3A), 모션 줄이기면 높이 움직임 없이 150ms 서서히 나타나고 사라진다.

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 상세 하나를 접고 편다(분할 내역 · 빠르게 맞추기 · 상세 검색 조건) | **Collapsible** |
| 같은 모양의 상세가 여럿(혜택 · 유의사항) | [Accordion](accordion.md) |
| 줄 자체가 다른 일(편집)을 하고 하위 줄만 접는다(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 44 |
| 잘린 글을 펼친다 | 쓰지 않는다 — 글을 자르지 않는다(아래) |

[그림: 상세 하나는 Collapsible · 여럿은 Accordion · 줄이 편집이면 List 하위 줄](../../site/components/specs/collapsible.tsx#when-guide)

### 이름은 고정 — 펼침은 상태가 알린다

이름은 무엇을 여닫는지 그대로 쓰고 상태마다 바꾸지 않는다 — "내역 분할 6개" 이지 "합계 123,456,789원" · "펼치기 / 접기" 가 아니다. 펼침은 `aria-expanded` 가 알린다(APG Disclosure). 설명(합계 · 필터 수)은 이름 뒤에 함께 읽힌다 — 숫자를 이름에 붙여 "필터2" 처럼 읽히게 하지 않는다. 펼쳐도 초점은 트리거에 그대로 두고 화면을 저절로 스크롤하지 않는다.

[그림: 읽기 — "내역 분할 6개, 합계 −123,456,789원, 머리말 3, 단추, 펼쳐짐" · 지금 "합계 123,456,789원, 단추"](../../site/components/specs/collapsible.tsx#name-guide)

### 잘린 글을 펼치지 않는다 — 자르지 않는다

읽어야 하는 글은 자르지 않고 줄을 바꿔 다 보인다 — HR 사내 규정 카드의 본문, 카드 유의사항의 제목, 부서 이름(사용자 결정 10A). 4줄에서 잘라 "더 보기" 로 펼치거나(10B) 눌러서 상세를 여는 것(10C)은 두지 않는다 — 그러니 Collapsible 로 잘린 글을 펼칠 일이 없다. 규정 카드는 한 줄의 카드 높이를 그 줄에서 가장 긴 카드에 맞춘다.

[그림: HR 규정 카드 16 — 한국어 · 영어 모두 자르지 않는다, 줄마다 가장 긴 카드 높이](../../site/components/specs/collapsible.tsx#wrap-guide)

### 원장 머리 — 소비 요약과 월 달력은 하나만

폰 가계부 원장 머리(웹 · 앱)의 "소비 요약" 카드와 "월 달력" 은 하나만 펼친다 — 하나를 열면 다른 하나가 닫힌다(사용자 결정 11A, 지금 앱과 같다). 둘 다 열리면 거래 목록이 화면 아래로 밀려 거의 보이지 않는다. 두 단추는 원장 머리의 제 모양 그대로이고(이번에 정하지 않았다) 이 스펙의 이름 · 상태 규칙만 따른다 — 이름은 "소비 요약" · "월 달력" 으로 고정하고 `aria-expanded` 로 펼침을 알린다. 할 일 원장의 월 달력 단추도 같은 이름이다. 머리가 스크롤에 따라 숨는 것은 [Scroll Auto Hide](scroll-auto-hide.md) 다.

[그림: 가계부 10월 — 소비 요약을 열면 월 달력이 닫힌다, 목록이 보이는 높이](../../site/components/specs/collapsible.tsx#ledger-guide)

### 글

이름은 접힌 내용이 무엇인지 명사구로("내역 분할 6개" · "빠르게 맞추기" · "상세 검색 조건"), 설명은 접혀 있어도 알아야 할 값으로("합계 −123,456,789원" · "2개 필터 적용 중") 쓴다. 돈은 원까지, 빼기는 U+2212 다.

## 코드

레시피 `recipes/shadcn/components/ui/collapsible.tsx` 를 쓴다(Radix Collapsible 위에 짜도 된다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Collapsible` — 접는 자리. `open` · `defaultOpen` · `onOpenChange(open)` · `disabled` · `surface`(`"default"` 기본 · `"card"` · `"warning"`), 나머지는 `div` 속성. `"card"` 는 Collapsible 이 Card 면을 그린다. `"warning"` 은 경고 상자의 맨 아래 줄이다 — 상자(`box` — 바탕 · 테두리 · 모서리 12 · 경고 글 여백)는 화면이 그리고, 상자의 `overflow: hidden` 이 아래 줄의 누름 바탕을 모서리에서 자른다.
- `CollapsibleTrigger` — `title`(필수 — 고정 이름) · `description` · `headingLevel`(`2` ~ `6`, 기본 `3`). 머리말 안의 단추(`aria-expanded` · `aria-controls`)와 꺾쇠 20 을 그린다 — Accordion 트리거와 같은 모양이다.
- `CollapsibleContent` — 펼친 내용. `layout`(`"text"` 기본 · `"rows"` — 줄 목록이면 아래 8), 나머지는 `div` 속성. 좌우는 트리거와 같고 아래 16(`card` 24). 접혀 있으면 그리지 않는다. 높이 300ms · 모션 줄이기면 150ms 서서히.

원장 머리의 "소비 요약" · "월 달력" 은 이 부품이 아니라 원장 머리의 단추다 — `aria-expanded` · `aria-controls` 를 달고, 하나를 열면 다른 하나를 닫는 것은 화면이 쥔다.

### 거래 상세 — 분할 내역

[그림: 1억 넘는 거래를 6건으로 나눈 내역 — 처음 펼침](../../site/components/specs/collapsible.tsx#ex-split)

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible defaultOpen>
  <CollapsibleTrigger title={`내역 분할 ${splits.length}개`} description={`합계 ${formatWon(total)}`} />
  <CollapsibleContent layout="rows">{splits.map(renderSplitRow)}</CollapsibleContent>
</Collapsible>
```

### 분할 — 빠르게 맞추기(경고 상자 안)

[그림: 분할 합계가 3,456,789원 모자랄 때 — 경고 상자 아래 줄의 빠르게 맞추기](../../site/components/specs/collapsible.tsx#ex-warning)

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

{/* 경고 상자(box)는 화면이 그린다 — 경고 글 아래 맨 끝 줄이 Collapsible(좌우 16 · 위 선 · 누름은 경고 바탕의 누름 색) */}
<div className="overflow-hidden rounded-r3 border border-stroke-warning-weak bg-bg-warning-weak">
  <div className="px-x4 pb-x3 pt-x3_5">{shortfallMessage}</div>
  <Collapsible surface="warning">
    <CollapsibleTrigger title="빠르게 맞추기" />
    <CollapsibleContent>{quickFixes}</CollapsibleContent>
  </Collapsible>
</div>
```

### HR 업무 보고 — 상세 검색 조건(카드)

[그림: 업무 보고 1280 — 상세 검색 조건 카드, 2개 필터 적용 중](../../site/components/specs/collapsible.tsx#ex-card)

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible surface="card" open={filtersOpen} onOpenChange={setFiltersOpen}>
  <CollapsibleTrigger
    title="상세 검색 조건"
    description={appliedCount > 0 ? `${appliedCount}개 필터 적용 중` : undefined}
  />
  <CollapsibleContent>{filterFields}</CollapsibleContent>
</Collapsible>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 · `Enter` · `Space` | 펼치고 접는다 — 초점은 트리거에 그대로, 저절로 스크롤하지 않는다 |
| `Tab` | 트리거 → 펼친 내용 안의 초점 가는 것 → 다음 |
| Disabled | 누르기 · 키보드 불가. 펼친 채 막히면 내용은 그대로 보인다 |
| 모션 줄이기 | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 16.41 · 다크 13.42(경고 상자 누름 바탕 위 13.04 · 9.59), 설명 `fg-neutral-subtle` 5.50 · 6.09(경고 상자 4.91 · 5.30) ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 `fg-neutral-subtle` 5.50 · 6.09 · 경고 상자 누름 바탕 위 4.37 · 4.35 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 펼침은 꺾쇠 방향과 보이는 내용으로 알린다 ✓ |
| **WCAG 2.1.1** Keyboard | `Tab` · `Enter` · `Space` ✓ |
| **WCAG 2.4.3** Focus order | 펼쳐도 초점은 트리거에 — 펼친 내용은 트리거 바로 뒤 차례 ✓ |
| **WCAG 2.4.7** Focus visible | 트리거 안쪽 링 2px — 카드 · 상자에 잘리지 않는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 트리거 줄 전체 54 이상 ✓ — 지금의 18 · 16.5 글 단추를 걷는다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 트리거 54 이상 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `heading > button` — 이름은 고정 이름 + 설명, `aria-expanded` · `aria-controls`(펼친 내용의 `id`) ✓ |
| **ARIA** | APG Disclosure — 펼친 내용에 `role="region"` 을 두지 않는다. 앱은 `Semantics(button: true, expanded: …)` 로, 접힌 내용은 의미 트리에서 뺀다 |
| **Reduced motion** | 높이 움직임 없이 150ms 서서히(v104) · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 상세 하나를 Accordion 항목 모양의 줄 전체 트리거로 접고 편다.
- 이름은 무엇을 여닫는지 고정하고, 접혀 있어도 알아야 할 값은 설명으로.
- 펼쳐도 초점 · 스크롤을 그대로 둔다.
- 원장 머리의 소비 요약과 월 달력은 하나만 펼친다.

### ❌ Don't

- 글 단추 · 꺾쇠만으로 트리거 만들기(누르는 영역 18 · 16.5).
- 상태마다 이름 바꾸기("펼치기 / 접기" · "목록 / 달력") · 숫자를 이름에 붙이기("필터2").
- 잘린 글을 "더 보기" 로 펼치기 — 읽어야 하는 글은 자르지 않는다.
- 같은 모양의 Collapsible 여럿을 쌓기 — Accordion 을 쓴다.
- 패널 안 스크롤 상자 · 움직임 없이 갑자기 펼치기 · 불투명도 막힘.

## Specification

`collapsible.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Collapsible 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — collapsible.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#collapsible)

## SEED 와 다른 점

- **SEED 에는 Collapsible 이 없다** — Accordion 가이드의 한 줄대로 항목 하나의 모양을 쓴다. 값은 Accordion 의 porest 값(좌우 24 · 불투명한 누름 바탕 · 안쪽 포커스 링)이다.
- **놓인 면(`surface`)** — 카드 면 · 경고 상자 안에 둘 때의 여백 · 선 · 누름 색은 porest 가 정했다.
- **잘린 글을 펼치지 않는다** · **원장 머리는 하나만 펼친다** — SEED 에 규칙이 없다.

## Migration notes

### 2026-10-10 — 트리거를 Accordion 항목 하나로

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 정했다 — 하나만 접는 자리의 트리거는 Accordion 항목 하나의 모양(9A — 줄 전체 · 머리 글 = 이름 · 54 / 74), 잘린 글은 자르지 않는다(10A — HR 규정 카드 · 유의사항 제목 · 부서 이름), 폰 가계부 요약 ↔ 달력은 하나만(11A). 펼침은 Accordion 과 같은 300ms(3A). 그리고 "따라오는 것" — 이름은 고정 + `aria-expanded`(APG Disclosure) · 펼친 뒤 초점은 트리거에 그대로. 글 단추 + 꺾쇠(9B) · 지금 그대로(9C) · "더 보기"(10B) · 눌러서 상세(10C) · 요약과 달력 둘 다(11B)는 고르지 않았다. 옛 스펙은 `collapsible.history/v-pre-seed-collapse.md` 에 남겼다.

| 옛 Collapsible | 새 Collapsible |
|---|---|
| 스타일 0 — 트리거 · 내용의 모양은 사용처 | 트리거는 Accordion 항목 모양(54 · 74 · 꺾쇠 20) · 놓인 면 셋 |
| 트리거는 `asChild` 로 Button 을 감싼다 | 줄 전체가 트리거 — 머리말 안의 단추 |
| "더 보기" · 고급 옵션 · 설정 상세 쓰임 | 잘린 글은 펼치지 않고 자르지 않는다 — 상세 하나를 접는 자리만 |
| 꺾쇠 회전은 사용처에서 · `animate-accordion-*` 재사용 | 꺾쇠 180° · 높이 300ms `ease-easing` · 모션 줄이기면 150ms 서서히 |
| 막힘 불투명도 0.5 | 전용 색 `fg-disabled` |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사).

- **웹 거래 상세 분할 내역** — 머리 "내역 분할 6개"(h4) 오른쪽 글 단추 "합계 123,456,789원 + 꺾쇠 16" 이 128.9 × 18 이고 이름에 무엇을 여닫는지 · 빼기 부호가 없으며, `aria-expanded` 0 · 움직임 0 이다(`widgets/expense-detail/ui/TxDetailDialog.tsx:646-700` · 상태 `:113`, D4 · D13). 앱은 같은 자리가 높이 18 · 이름 · 상태 0 이다(`features/expense/presentation/tx_detail_dialog.dart:828-880`). `default` 트리거 "내역 분할 6개 · 합계 −123,456,789원" 으로.
- **웹 분할 빠르게 맞추기** — "✦ 빠르게 맞추기 ⌄" 가 103 × 16.5 · 11 / 700 브랜드 · `aria-controls` 0 · 움직임 0 이다(`features/expense-split/ui/SplitTxDialog.tsx:590-640`, D13). 앱은 높이 22 · 이름 · 상태 0(`features/expense_split/presentation/split_tx_dialog.dart:513-545`). `warning` 트리거로.
- **HR 업무 보고 필터** — outline 단추 152 × 36 "필터 2" 가 "필터2" 로 붙어 읽히고 `aria-expanded` 0 · 내용 움직임 0 이다(`features/work-report/ui/ReportHeader.tsx:43-63` → `ReportFilter.tsx:58-231`, D19). 조건 카드의 머리 `card` 트리거 "상세 검색 조건 · 2개 필터 적용 중" 으로.
- **원장 머리** — 웹 가계부는 소비 요약 카드(`txmDrop` 180ms)와 월 달력이 함께 열리고, 앱은 하나를 열면 다른 하나를 닫는다(`pages/expense/ui/ExpensePage.tsx:1972-2020` → `shared/ui/porest/ledger.tsx:202-250` · 앱 `features/expense/presentation/expense_screen.dart:505-507 · 617-619`, D24) — 웹도 하나만. 월 달력 단추의 이름이 가계부는 "목록 / 달력" 으로 잘못 바뀌고 할 일은 "월 전체 보기 / 접기" 이며 `aria-expanded` 0, 앱은 이름 0 이다(`ExpensePage.tsx:2112-2116` · `TodoMobileLedger.tsx:472-476` → `ledger.tsx:394-416` · 앱 `expense_screen.dart:1253-1266`, D10) — "월 달력" + `aria-expanded` 로. 누르는 영역도 소비 요약 39.5 · 월 달력 32 다(D13).
- **잘린 글** — HR 규정 카드 16곳이 `line-clamp-4` 로 데스크톱 4열에서 한국어 3/16 · 영어 6/16 이 잘리고 펼칠 길이 없으며, "지급 시기" 는 같은 문장이 두 번 찍힌다(`features/culture-regulation/ui/RuleVacation.tsx:17 · 27-37` 외 `Rule*.tsx`, D6). 자르지 않고 줄마다 가장 긴 카드에 높이를 맞춘다. 웹 유의사항 제목의 말줄임(D11)은 Accordion, HR 부서 이름의 말줄임(D12)은 [Tree View](tree-view.md) 에서 걷는다.
- **쓰지 않는 것** — SSO `collapsible.tsx` 는 쓰는 곳이 0 이다(D21).

### 이전 기록

- **2026-05 — Radix primitive 그대로.** 스타일 없이 동작만 내보내고 시각은 사용처에 맡겼다. 이번에 트리거 모양을 정했다.
