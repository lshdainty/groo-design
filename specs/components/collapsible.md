# Collapsible

> 내용 하나를 접고 펴는 자리입니다 — 거래 상세의 분할 내역, 분할 합계가 어긋날 때의 "빠르게 맞추기", HR 업무 보고의 상세 검색 조건에 씁니다. 같은 모양의 항목이 여럿이면 [Accordion](accordion.md) 을 씁니다.

트리거는 Accordion 항목 하나의 모양입니다 — 줄 전체가 트리거이고, 머리 글이 곧 이름이며, 높이 54 · 74, 꺾쇠 20 입니다. 이름은 상태마다 바꾸지 않고 펼침은 `aria-expanded` 가 알립니다(APG Disclosure). 펼친 뒤 초점은 트리거에 그대로 둡니다.

수치 원본은 [`collapsible.yaml`](collapsible.yaml)입니다. 트리거 · 상태 · 모션 값은 [`accordion.yaml`](accordion.yaml)과 같고, 놓인 면(`surface`)만 더 있습니다.

[그림: 거래 상세 분할 내역(흰 면) · 빠르게 맞추기(경고 상자) · HR 상세 검색 조건(카드) — 라이트 · 다크](../../site/components/specs/collapsible.tsx#hero)

### 직접 골라 보기

놓인 면(흰 면 · 카드 · 경고 상자) · 설명 · 막힘 · 모션 줄이기를 고르면 Collapsible 과 코드가 함께 바뀝니다. 트리거를 눌러 펼치거나 초점을 두고 `Enter` · `Space` 를 눌러 볼 수 있고, 옆 글이 읽기(이름 · 펼침)를 따라갑니다.

[그림: 플레이그라운드](../../site/components/specs/collapsible.tsx#playground)

## Anatomy

[그림: 트리거(이름 · 설명 · 꺾쇠) — 줄 전체가 누르는 자리, 펼치면 아래에 내용](../../site/components/specs/collapsible.tsx#anatomy)

| ⓐ Trigger | 트리거 — 줄 전체가 누르는 영역입니다. 머리말(`h3`) 안의 단추입니다. |
| ⓑ Title | 이름 — 16 / 22 · 500. 무엇을 여닫는지 적고, 상태마다 바꾸지 않습니다. |
| ⓒ Description | 설명 — 13 / 18 · 500 · 옅은 색. 합계 · 적용한 필터 수처럼 접혀 있어도 알아야 할 것이 있을 때만 둡니다. |
| ⓓ Chevron | 꺾쇠 — 20. 접혀 있으면 아래, 펼치면 위를 가리킵니다. |
| ⓔ Panel | 펼친 내용 — 트리거와 같은 좌우, 아래 16. 안에서 스크롤하지 않습니다. |

[표: 부위](collapsible.yaml#slots)

## Properties

### 트리거 — Accordion 항목 하나

트리거는 Accordion 항목과 같습니다 — 위아래 16 · 좌우 24, 이름 16 / 22 · 500 `fg-neutral`, 설명 13 / 18 · 500 `fg-neutral-subtle`(이름 아래 2), 꺾쇠 20 `fg-neutral-subtle`, 본문 ↔ 꺾쇠 12. 이름만이면 54, 설명이 있으면 74 입니다. 줄 전체가 누르는 영역이라 높이 18 · 16.5 같은 작은 글 단추 트리거가 생기지 않습니다.

[그림: 이름만 54 · 이름 + 설명 74 — "내역 분할 6개 · 합계 −123,456,789원"](../../site/components/specs/collapsible.tsx#trigger)

[표: 설명 있음 · 없음](collapsible.yaml#description)

[표: 트리거](collapsible.yaml#base.enabled@trigger)

[표: 이름](collapsible.yaml#base.enabled@title)

[표: 설명](collapsible.yaml#base.enabled@description)

[표: 꺾쇠](collapsible.yaml#base.enabled@chevron)

[표: 펼친 내용](collapsible.yaml#base.enabled@panel)

펼친 내용은 트리거와 같은 좌우 안에 두고 아래 16 으로 끝냅니다. 내용이 줄 목록이면(분할 내역 — 줄마다 위아래 12) 아래는 8 입니다(`layout="rows"`). 마지막 줄의 글 아래로 20 이 됩니다.

[표: 펼친 내용 — 글 · 줄 목록](collapsible.yaml#layout)

### Surface

놓인 면에 따라 여백 · 선 · 누름 색이 셋으로 나뉩니다. 트리거의 글 · 꺾쇠 · 높이는 같습니다.

- **`default`** — 흰 면 · 시트 · 대화상자의 줄입니다. 줄 폭 전체이고 좌우 24 입니다 — 거래 상세의 분할 내역.
- **`card`** — Collapsible 자체가 [Card](card.md) 면(1px `stroke-neutral-weak` · 모서리 16)이고 트리거가 그 머리입니다. 펼친 내용은 카드 안 여백 24 로 끝납니다 — HR 업무 보고의 상세 검색 조건(툴바 단추가 아니라 조건 카드의 머리가 됩니다).
- **`warning`** — 경고 상자 안의 아래 줄. 상자(`bg-warning-weak` · 1px `stroke-warning-weak` · 모서리 12 · 경고 글 위 14 · 좌우 16 · 아래 12)의 안쪽 여백에 맞춰 좌우 16, 위에 1px `stroke-warning-weak` 선, 누름 · 호버는 경고 바탕의 누름 짝 `bg-warning-weak-pressed` 입니다 — 분할 합계가 어긋날 때의 "빠르게 맞추기".

[그림: 흰 면 · 카드 · 경고 상자 — 같은 트리거, 여백 · 선 · 누름 색만 다릅니다](../../site/components/specs/collapsible.tsx#surface)

[표: 놓인 면](collapsible.yaml#surface@root+trigger+panel+divider)

[표: 경고 상자](collapsible.yaml#surface@box)

[표: 놓인 면 — 상태](collapsible.yaml#states.surface)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 · 꺾쇠 아래(펼침이면 위) |
| `hovered` | 웹 — 누름과 같은 바탕 — 좌우 6 들어온 `bg-layer-default-pressed`(경고 상자는 `bg-warning-weak-pressed`), 모서리 10 |
| `focused` | 웹 — 키보드 포커스에만 트리거 안쪽 링 2px. 카드 · 경고 상자는 그 모서리를 따릅니다 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소 |
| `disabled` | 이름 · 설명 · 꺾쇠가 `fg-disabled` — 흐리게 하지 않습니다 |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘](../../site/components/specs/collapsible.tsx#states)

[표: 상태](collapsible.yaml#matrix@background+content+title+description+chevron+focusRing)

[표: 펼침](collapsible.yaml#open)

[표: 모션](collapsible.yaml#motion)

펼침 · 꺾쇠는 Accordion 과 같은 300ms `motion-ease-easing` 이고, 모션 줄이기면 높이 움직임 없이 150ms 동안 서서히 나타나고 사라집니다.

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 상세 하나를 접고 편다(분할 내역 · 빠르게 맞추기 · 상세 검색 조건) | **Collapsible** |
| 같은 모양의 상세가 여럿(혜택 · 유의사항) | [Accordion](accordion.md) |
| 줄 자체가 다른 일(편집)을 하고 하위 줄만 접는다(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 44 |
| 잘린 글을 펼친다 | 쓰지 않습니다 — 글을 자르지 않습니다(아래) |

[그림: 상세 하나는 Collapsible · 여럿은 Accordion · 줄이 편집이면 List 하위 줄](../../site/components/specs/collapsible.tsx#when-guide)

### 이름은 고정 — 펼침은 상태가 알립니다

이름은 무엇을 여닫는지 그대로 쓰고 상태마다 바꾸지 않습니다 — "내역 분할 6개" 이지 "합계 123,456,789원" · "펼치기 / 접기" 가 아닙니다. 펼침은 `aria-expanded` 가 알립니다(APG Disclosure). 설명(합계 · 필터 수)은 이름 뒤에 함께 읽힙니다 — 숫자를 이름에 붙여 "필터2" 처럼 읽히게 하지 않습니다. 펼쳐도 초점은 트리거에 그대로 두고 화면을 저절로 스크롤하지 않습니다.

[그림: 읽기 — "내역 분할 6개, 합계 −123,456,789원, 머리말 3, 단추, 펼쳐짐" · 글 단추 "합계 123,456,789원, 단추"](../../site/components/specs/collapsible.tsx#name-guide)

### 잘린 글을 펼치지 않습니다 — 자르지 않습니다

읽어야 하는 글은 자르지 않고 줄을 바꿔 다 보입니다 — HR 사내 규정 카드의 본문, 카드 유의사항의 제목, 부서 이름. 4줄에서 잘라 "더 보기" 로 펼치거나 눌러서 상세를 여는 방식은 두지 않으므로, Collapsible 로 잘린 글을 펼칠 일이 없습니다. 규정 카드는 한 줄의 카드 높이를 그 줄에서 가장 긴 카드에 맞춥니다.

[그림: HR 규정 카드 16 — 한국어 · 영어 모두 자르지 않는다, 줄마다 가장 긴 카드 높이](../../site/components/specs/collapsible.tsx#wrap-guide)

### 원장 머리 — 소비 요약과 월 달력은 하나만

폰 가계부 원장 머리(웹 · 앱)의 "소비 요약" 카드와 "월 달력" 은 하나만 펼칩니다 — 하나를 열면 다른 하나가 닫힙니다. 둘 다 열리면 거래 목록이 화면 아래로 밀려 거의 보이지 않기 때문입니다. 두 단추는 원장 머리의 제 모양 그대로이고 이 스펙의 이름 · 상태 규칙만 따릅니다 — 이름은 "소비 요약" · "월 달력" 으로 고정하고 `aria-expanded` 로 펼침을 알립니다. 할 일 원장의 월 달력 단추도 같은 이름입니다. 머리의 위쪽(총액 · 비교 줄 · 소비 요약)이 스크롤에 따라 숨는 것은 [Scroll Auto Hide](scroll-auto-hide.md) 입니다 — 달 이동 줄 · 주 달력은 남고, 펼친 월 달력은 목록을 내리면 고른 주로 접힙니다(맨 위 날짜 묶음의 자리는 그대로입니다).

[그림: 가계부 10월 — 소비 요약을 열면 월 달력이 닫힙니다, 목록이 보이는 높이](../../site/components/specs/collapsible.tsx#ledger-guide)

### 글

이름은 접힌 내용이 무엇인지 명사구로("내역 분할 6개" · "빠르게 맞추기" · "상세 검색 조건"), 설명은 접혀 있어도 알아야 할 값으로("합계 −123,456,789원" · "2개 필터 적용 중") 씁니다. 돈은 원까지, 빼기는 U+2212 입니다.

## 코드

레시피 `recipes/shadcn/components/ui/collapsible.tsx` 를 씁니다(Radix Collapsible 위에 짜도 됩니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Collapsible` — 접는 자리입니다. `open` · `defaultOpen` · `onOpenChange(open)` · `disabled` · `surface`(`"default"` 기본 · `"card"` · `"warning"`), 나머지는 `div` 속성입니다. `"card"` 는 Collapsible 이 Card 면을 그립니다. `"warning"` 은 경고 상자의 맨 아래 줄입니다 — 상자(`box` — 바탕 · 테두리 · 모서리 12 · 경고 글 여백)는 화면이 그리고, 상자의 `overflow: hidden` 이 아래 줄의 누름 바탕을 모서리에서 자릅니다.
- `CollapsibleTrigger` — `title`(필수 — 고정 이름) · `description` · `headingLevel`(`2` ~ `6`, 기본 `3`). 머리말 안의 단추(`aria-expanded` · `aria-controls`)와 꺾쇠 20 을 그립니다 — Accordion 트리거와 같은 모양입니다.
- `CollapsibleContent` — 펼친 내용입니다. `layout`(`"text"` 기본 · `"rows"` — 줄 목록이면 아래 8), 나머지는 `div` 속성입니다. 좌우는 트리거와 같고 아래 16(`card` 24)입니다. 접혀 있으면 그리지 않습니다. 높이 300ms, 모션 줄이기면 150ms 동안 서서히 바뀝니다.

원장 머리의 "소비 요약" · "월 달력" 은 이 부품이 아니라 원장 머리의 단추입니다 — `aria-expanded` · `aria-controls` 를 달고, 하나를 열면 다른 하나를 닫는 것은 화면이 맡습니다.

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
| 트리거 누르기 · `Enter` · `Space` | 펼치고 접습니다 — 초점은 트리거에 그대로, 저절로 스크롤하지 않습니다 |
| `Tab` | 트리거 → 펼친 내용 안의 초점 가는 것 → 다음 |
| Disabled | 누르기 · 키보드 불가. 펼친 채 막히면 내용은 그대로 보입니다 |
| 글자 크기 설정 | 이름 · 설명 · 펼친 내용이 커지고 줄을 바꿔 받습니다 — 트리거 줄의 높이(최소 높이)가 글을 따라 늘어납니다. 꺾쇠는 크기를 그대로 둡니다 |
| 모션 줄이기 | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 16.41 · 다크 13.42(경고 상자 누름 바탕 위 13.04 · 9.59), 설명 `fg-neutral-subtle` 5.50 · 6.09(경고 상자 4.91 · 5.30) ✓ |
| **WCAG 1.4.4** Resize text | 이름 · 설명 · 펼친 내용이 글자 크기 설정을 따라 커지고 줄을 바꿔 받습니다 ✓. 꺾쇠는 글이 아니라 크기를 그대로 둡니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 `fg-neutral-subtle` 5.50 · 6.09 · 경고 상자 누름 바탕 위 4.37 · 4.35 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 펼침은 꺾쇠 방향과 보이는 내용으로 알립니다 ✓ |
| **WCAG 2.1.1** Keyboard | `Tab` · `Enter` · `Space` ✓ |
| **WCAG 2.4.3** Focus order | 펼쳐도 초점은 트리거에 — 펼친 내용은 트리거 바로 뒤 차례 ✓ |
| **WCAG 2.4.7** Focus visible | 트리거 안쪽 링 2px — 카드 · 상자에 잘리지 않습니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 트리거 줄 전체 54 이상 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 트리거 54 이상 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `heading > button` — 이름은 고정 이름 + 설명, `aria-expanded` · `aria-controls`(펼친 내용의 `id`) ✓ |
| **ARIA** | APG Disclosure — 펼친 내용에 `role="region"` 을 두지 않습니다. 앱은 `Semantics(button: true, expanded: …)` 로 알리고, 접힌 내용은 의미 트리에서 뺍니다 |
| **Reduced motion** | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 상세 하나를 Accordion 항목 모양의 줄 전체 트리거로 접고 폅니다.
- 이름은 무엇을 여닫는지 고정하고, 접혀 있어도 알아야 할 값은 설명에 둡니다.
- 펼쳐도 초점 · 스크롤을 그대로 둡니다.
- 원장 머리의 소비 요약과 월 달력은 하나만 펼칩니다.

### ❌ Don't

- 글 단추 · 꺾쇠만으로 트리거 만들기(누르는 영역 18 · 16.5).
- 상태마다 이름 바꾸기("펼치기 / 접기" · "목록 / 달력") · 숫자를 이름에 붙이기("필터2").
- 잘린 글을 "더 보기" 로 펼치기 — 읽어야 하는 글은 자르지 않습니다.
- 같은 모양의 Collapsible 여럿을 쌓기 — Accordion 을 씁니다.
- 패널 안 스크롤 상자 · 움직임 없이 갑자기 펼치기 · 불투명도 막힘.

## Specification

`collapsible.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Collapsible 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — collapsible.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#collapsible)
