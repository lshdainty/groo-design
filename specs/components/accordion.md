# Accordion

> 관련 정보를 세로로 묶어 두고 항목마다 머리를 눌러 상세를 펼치는 목록 — 카드 혜택 · 유의사항처럼 상세가 길어 다 펼쳐 두면 화면이 몇 배로 길어지는 자리에 쓴다. 하나만 접고 펴는 자리는 [Collapsible](collapsible.md), 단계가 있는 고르는 나무는 [Tree View](tree-view.md), 하위 줄을 접는 목록은 [List](list.md) 의 하위 줄이다.

구조는 당근 [SEED Accordion](https://seed-design.io/components/accordion)(rootage `accordion.json` · `accordion-item.json`, @seed-design/react 2.0.0 — Apache-2.0)을 따른다 — 트리거(앞 아이콘 · 제목 · 설명 · 꺾쇠)와 펼친 내용, 변형 둘(`inline` · `separated`), 회전 · 펼침 300ms, 누르면 좌우 6 들어온 바탕 + 콘텐츠만 축소. 크기는 SEED medium 하나이고, 여럿 열기 · "모두 펼치기" · 상세 없는 항목 · 카드 상세의 쓰임은 porest 가 정했다(2026-10-10 사용자 결정). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Accordion 스펙(Radix 베이스 · 아래 선만 · 꺾쇠 16 · 하나만 여는 모드 · 불투명도 막힘)을 대신한다.

수치 원본은 [`accordion.yaml`](accordion.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카드 혜택 상세 시트(separated) · 카드 상세 "혜택" 카드(inline) — 라이트 · 다크](../../site/components/specs/accordion.tsx#hero)

### 직접 골라 보기

변형(inline · separated) · 설명 · 앞 아이콘 · 상세 없는 항목 · 막힘 · 모션 줄이기를 고르면 스펙대로 그린 아코디언과 그 코드가 바뀐다. 트리거를 눌러 펼치고, 초점을 두고 `↓` `↑` · `Home` · `End` · `Enter` 를 눌러 볼 수 있다 — "모두 펼치기" 도 함께 있다.

[그림: 플레이그라운드](../../site/components/specs/accordion.tsx#playground)

## Anatomy

[그림: 트리거는 앞 아이콘 · 제목 · 설명 · 꺾쇠, 펼치면 아래에 내용 — 목록 머리 오른쪽에 모두 펼치기](../../site/components/specs/accordion.tsx#anatomy)

| ⓐ Trigger | 트리거 — 줄 전체가 누르는 자리. 머리말(`h3`) 안의 단추다. |
| ⓑ Prefix Icon | 앞 아이콘 — 22, 있을 때만. |
| ⓒ Title | 제목 — 16 / 22 · 500. 무엇의 상세인지 — 늘 줄을 바꾼다. |
| ⓓ Description | 설명 — 13 / 18 · 500 · 옅은 색. 제목 아래 한 줄 요약, 있을 때만. |
| ⓔ Chevron | 꺾쇠 — 20. 접혀 있으면 아래, 펼치면 위. |
| ⓕ Panel | 펼친 내용 — 14 / 22 · `fg-neutral-muted`. 안에서 스크롤하지 않는다. |
| ⓖ Divider | 항목 사이 선 — `inline` 만, 좌우 24 들인다. |
| ⓗ Expand All | 모두 펼치기 — 목록 머리 오른쪽 글 단추. 펼치면 "모두 접기". |

한 트리거는 두 층이다 — **바탕 층**(누름 · 호버 바탕)과 **콘텐츠 층**(앞 아이콘 · 본문 · 꺾쇠). 누르면 바탕이 좌우 6 들어와 모서리 10 으로 둥글어지고, 콘텐츠 층만 2px 거리로 준다 — [List](list.md) 줄과 같은 짜임이다(기초 Feedback v104 — "목록 줄 · 아코디언은 콘텐츠만").

[표: 부위](accordion.yaml#slots)

## Properties

### Variant

SEED 의 두 변형을 그대로 둔다(사용자 결정 1B).

- **`inline`**(기본) — 연속 목록 + 항목 사이 선. 화면 · 카드 안에서 목록으로 읽히는 자리 — 카드 상세의 혜택 · 유의사항. 선은 [List](list.md) 의 들인 선과 같다 — 1px `stroke-neutral-subtle` · 좌우 24 · 첫 항목 위와 마지막 항목 아래에는 긋지 않는다.
- **`separated`** — 항목마다 [Card](card.md) 면(1px `stroke-neutral-weak` · 모서리 16 · 사이 8 · 그림자 없음). 항목 하나하나가 따로 읽히는 정보 묶음 — 카드 혜택 상세 시트 · 대화상자. 면은 놓인 표면 그대로다(시트 · 대화상자의 `bg-layer-floating`). SEED 의 모서리 12 · 사이 12 는 카드에서 거절된 값이라 쓰지 않는다(데이터 표시 5A).

두 변형 모두 트리거 · 눌림 · 꺾쇠 · 펼침은 같고 면만 다르다. 모든 아코디언을 카드 모양으로 하는 안(1C)과 지금처럼 자리마다 짜는 안(1A)은 고르지 않았다.

[그림: inline — 카드 안 연속 목록 + 들인 선 24 · separated — 항목마다 Card 면 16 · 사이 8](../../site/components/specs/accordion.tsx#variant)

[표: 변형](accordion.yaml#variant)

### Size

크기는 SEED medium 하나다 — 폰 · 데스크톱이 같다(사용자 결정 2A). 트리거는 위아래 16 · 좌우 24(화면 가장자리 규칙 — SEED 16), 제목 16 / 22 · 500 `fg-neutral`, 설명 13 / 18 · 500 `fg-neutral-subtle`(제목 아래 2), 꺾쇠 20 `fg-neutral-subtle`, 앞 아이콘 22 — 앞 아이콘 · 본문 · 꺾쇠 사이는 12 다. 제목만이면 54, 설명이 있으면 74 이고, 제목이 줄을 바꾸면 늘어난다. List 줄 · 카드 머리와 같은 16 이라 한 화면 안에서 글 크기가 갈리지 않는다. 데스크톱에서 커지는 SEED large(제목 20 · 설명 16 · 꺾쇠 24)와 지금의 14 는 고르지 않았다.

[그림: 제목만 54 · 설명 있음 74 · 28자 제목이 두 줄 — 폰 시트 390 · 데스크톱 대화상자 480](../../site/components/specs/accordion.tsx#size)

[표: 설명 있음 · 없음](accordion.yaml#description)

[표: 트리거](accordion.yaml#base.enabled@trigger)

[표: 콘텐츠 층](accordion.yaml#base.enabled@content)

[표: 앞 아이콘](accordion.yaml#base.enabled@prefixIcon)

[표: 본문](accordion.yaml#base.enabled@body)

[표: 제목](accordion.yaml#base.enabled@title)

[표: 설명](accordion.yaml#base.enabled@description)

[표: 꺾쇠](accordion.yaml#base.enabled@chevron)

### 펼친 내용

펼친 내용은 트리거와 같은 좌우 24, 아래 16 안에 둔다 — 위 여백은 0 이라 트리거 아래 16 에 바로 이어진다. 글은 `text-article-note`(14 / 22 — 긴 글 보조) · `fg-neutral-muted` 다. SEED 의 AccordionContent 는 여백 · 글자가 없어 쓰는 쪽이 정하는데, porest 는 혜택 상세처럼 긴 설명이 대부분이라 이 글 모양을 기본으로 둔다. 앞 아이콘이 있어도 펼친 내용은 24 에서 시작한다 — 줄 폭을 쓴다. 내용이 길어도 패널 안에서 스크롤하지 않는다 — 페이지 · 시트 본문이 스크롤한다(SEED "Content Panel 내 스크롤 지양").

[그림: 펼친 내용 — 0 / 24 / 16 · 14 / 22 · 7줄 상세가 그대로 펼쳐진다](../../site/components/specs/accordion.tsx#panel)

[표: 펼친 내용](accordion.yaml#base.enabled@panel)

[표: 펼친 내용의 글](accordion.yaml#base.enabled@panelText)

### 상세가 없는 항목

목록 가운데 상세가 없는 항목(혜택 "대중교통" — 요약뿐)은 **트리거가 아닌 그냥 줄**이다(사용자 결정 5A) — 꺾쇠가 없고, 머리말 · 단추로 감싸지 않아 `Tab` 이 건너뛰며, 글만 읽힌다. 위아래 16 · 좌우 24 · 글 크기가 다른 항목과 같아 높이와 글 시작이 같다. 누르거나 올려도 바탕이 생기지 않는다. 막힌 트리거(5B — "사용할 수 없음" 으로 읽혀 혜택이 막힌 것처럼 들린다)와 꺾쇠만 뒤집히는 줄(5C — 눌러도 열리는 것이 없다)은 고르지 않았다.

[그림: 혜택 다섯 가운데 대중교통 · 편의점이 그냥 줄 — 같은 높이 · 같은 글 시작, 꺾쇠 없음](../../site/components/specs/accordion.tsx#no-detail)

[표: 상세 있음 · 없음](accordion.yaml#detail)

### 모두 펼치기

여럿을 함께 열고(사용자 결정 4A), 목록 머리 오른쪽에 "모두 펼치기" 글 단추를 둔다 — porest 확장이다(SEED 에 없다). 상세가 있는 항목을 모두 펼치고, 모두 펼쳐져 있으면 글이 "모두 접기" 로 바뀐다. 모양은 [Card](card.md) 머리 동작과 같다 — 14 · 500 · `fg-neutral-subtle` + 아이콘 16(펼치기 `chevrons-up-down` · 접기 `chevrons-down-up`), 보이는 32 · 누르는 44. 머리가 카드 머리면 그 오른쪽 동작 자리에, 시트 · 대화상자면 목록 머리 줄(제목 16 / 22 · 700 + 건수 — 카드 머리와 같은 글, 높이 32 · 아래 8)의 오른쪽에 둔다. 하나만 여는 모드(4C — 다른 항목을 열면 앞 항목이 닫힌다)와 단추 없이 하나씩 여는 안(4B)은 고르지 않았다.

[그림: 혜택 상세 · 12건 — 모두 펼치기 · 모두 접기, 보이는 32 · 누르는 44](../../site/components/specs/accordion.tsx#expand-all)

[표: 목록 머리](accordion.yaml#base.enabled@header)

[표: 목록 머리 제목](accordion.yaml#base.enabled@headerTitle)

[표: 모두 펼치기](accordion.yaml#base.enabled@expandAll)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 · 꺾쇠 아래(펼침이면 위) |
| `hovered` | 웹 — 누름과 같은 바탕(v106) — 좌우 6 들어온 `bg-layer-default-pressed`, 모서리 10 |
| `focused` | 웹 — 키보드 포커스에만 트리거 안쪽 링 2px. `separated` 는 항목 모서리를 따라 14 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소(v104) |
| `disabled` | 앞 아이콘 · 제목 · 설명 · 꺾쇠가 모두 `fg-disabled` — 흐리게 하지 않는다(v106). 상세가 없는 항목을 막힌 트리거로 그리지 않는다 |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘(inline · separated)](../../site/components/specs/accordion.tsx#states)

[표: 상태 — 바탕 · 콘텐츠 · 포커스 링](accordion.yaml#matrix@background+content+focusRing)

[표: 상태 — 글 · 꺾쇠](accordion.yaml#matrix@prefixIcon+title+description+chevron)

[표: separated 의 포커스 링](accordion.yaml#matrix.variant.separated@focusRing)

[표: 펼침](accordion.yaml#open)

[표: 모션](accordion.yaml#motion)

꺾쇠는 180° 돌고 내용은 높이로 펼쳐지고 접힌다 — 둘 다 300ms `motion-ease-easing`(SEED d6, 사용자 결정 3A). 모션 줄이기면 높이를 움직이지 않고 내용이 150ms 서서히 나타나고 사라지며, 꺾쇠는 바로 뒤집힌다(v104). 200ms(3B)와 움직임 없음(3C)은 고르지 않았다.

[그림: 펼침 300ms — 7줄 상세가 밀려 내려간다 · 모션 줄이기 150ms 서서히](../../site/components/specs/accordion.tsx#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 관련 상세를 여럿 묶고, 다 펼치면 화면이 몇 배로 길어진다(카드 혜택 · 유의사항) | **Accordion** — 항목 2개 이상 |
| 상세 하나를 접고 편다(분할 내역 · 빠르게 맞추기 · 상세 검색 조건) | [Collapsible](collapsible.md) — 같은 트리거 모양 |
| 부모 · 하위 두 단계 목록에서 줄은 편집, 하위만 접는다(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 |
| 여러 단계에서 하나를 고른다(부서) | [Tree View](tree-view.md) |
| 짧아서 늘 보여도 되는 내용 | 접지 않는다 — 그냥 보인다 |

항목은 2개 이상이다 — 하나를 접고 펴는 것은 Collapsible 이다(SEED Don't — 단일 Item). 처음에는 모두 접혀 있다.

[그림: 혜택 열둘은 Accordion · 분할 내역 하나는 Collapsible · 카테고리는 List 하위 줄](../../site/components/specs/accordion.tsx#when-guide)

### 여럿을 함께 연다

두 혜택을 나란히 견주며 읽을 수 있게 다른 항목을 닫지 않는다. 열 개를 한 번에 펼쳐 비교할 때는 "모두 펼치기" 를 누른다 — 열 번 누르지 않는다. 다른 항목을 열면 앞 항목이 닫히는 하나만 열기는 두지 않는다 — 닫히는 항목 때문에 누른 자리가 위로 밀려 올라간다.

[그림: 혜택 12건 — 모두 펼치기 한 번으로 열 항목, 시트 본문이 그만큼 길어진다](../../site/components/specs/accordion.tsx#multi-guide)

### 펼쳐도 그 자리에

펼쳐도 화면을 저절로 스크롤하지 않고 초점도 트리거에 그대로 둔다 — 내용이 길면 페이지 · 시트 본문이 스크롤한다(SEED — "자동 스크롤 및 포커스 이동은 기본값으로 지원하지 않습니다"). 패널 안에 높이를 정해 스크롤 상자를 만들지 않는다 — 스크롤이 겹쳐 손가락이 어느 쪽을 움직이는지 모른다(SEED "Content Panel 내 스크롤 지양").

[그림: 첫 항목을 펼쳐도 트리거가 그 자리 — 시트 본문이 스크롤, 패널 안 스크롤 상자는 두지 않는다](../../site/components/specs/accordion.tsx#scroll-guide)

### 카드 상세의 혜택 · 유의사항

카드 상세 화면의 혜택 · 유의사항은 웹 · 앱 모두 카드 안의 `inline` 아코디언이다(사용자 결정 6A — 지금 앱은 혜택 상세 본문까지 다 펼쳐 보인다). 카드 머리(제목 "혜택 · 12건" · 오른쪽 모두 펼치기) 아래 트리거가 카드 가장자리까지 가고, 카드 아래 여백은 8 이다 — 마지막 트리거의 아래 16 과 합쳐 보이는 24([Card](card.md) `body="accordion"`). 혜택 상세 시트 · 대화상자는 `separated` 다(1B). 유의사항은 설명 없이 제목만 있는 트리거다(펼치면 상세). 앱 유의사항의 주황 상자를 둘지는 이번 결정 밖이다 — 비교 페이지는 웹과 같은 카드 면으로 그렸다. 둘 다 펼친 목록(6B)은 고르지 않았다.

[그림: 카드 상세 — 카드 요약 · 혜택 12건 · 유의사항 5건, 처음 모습의 전체 길이](../../site/components/specs/accordion.tsx#card-guide)

### 제목은 자르지 않는다

제목 · 설명은 늘 줄을 바꿔 다 보인다(단어 단위 — v114). 84자 유의사항 제목도 한 줄 말줄임으로 자르지 않는다 — 펼쳐도 상세(다른 글)만 나와 잘린 제목은 어디에서도 다 읽을 수 없다. 잘린 글을 펼치는 "더 보기" 도 두지 않는다(사용자 결정 10A).

[그림: 84자 유의사항 제목 — 줄을 바꿔 다 보인다 · 한 줄 말줄임](../../site/components/specs/accordion.tsx#wrap-guide)

### 글

제목은 무엇의 상세인지 명사로("커피" · "연회비 · 카드 발급 후 첫 달 실적 기준"), 설명은 그 항목의 한 줄 요약이다("스타벅스 · 투썸플레이스 · 이디야 50% 할인"). 펼친 내용의 줄바꿈 문자는 그대로 줄을 바꾼다 — 상세가 "■ …" 줄들로 오는 자리. 모두 펼치기의 글은 "모두 펼치기" · "모두 접기" 다.

## 코드

레시피 `recipes/shadcn/components/ui/accordion.tsx` 를 쓴다(Radix Accordion `type="multiple"` 위에 짜도 된다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Accordion` — 아코디언. `variant`(`"inline"` 기본 · `"separated"`) · `values` · `defaultValues` · `onValuesChange(values)`(펼친 항목의 `value` 목록 — 늘 여럿을 함께 연다, 하나만 여는 모드는 없다) · `disabled`(전체) · `id`(모두 펼치기가 가리킨다), 나머지는 `div` 속성. 처음에는 모두 접힘(`defaultValues` 없음).
- `AccordionItem` — 항목. `value`(필수) · `disabled`.
- `AccordionTrigger` — `title`(필수) · `description` · `prefixIcon` · `headingLevel`(`2` ~ `6`, 기본 `3`). 머리말 안의 단추(`aria-expanded` · `aria-controls`)를 그리고, 꺾쇠 20 은 트리거가 그린다. 트리거 사이 `↓` `↑`(돌아가며) · `Home` · `End` 를 받는다.
- `AccordionContent` — 펼친 내용. 0 / 24 / 16 · 14 / 22 · `fg-neutral-muted` · 줄바꿈 문자를 지킨다. 접혀 있으면 그리지 않는다. 높이 300ms · 모션 줄이기면 150ms 서서히.
- `AccordionPlainItem` — 상세가 없는 항목. `title`(필수) · `description` · `prefixIcon`. 단추 · 머리말 · 꺾쇠가 없고 높이 · 글 시작은 트리거와 같다.
- `AccordionHeader` — 시트 · 대화상자의 목록 머리. `title`(필수 — 건수를 붙인다) · 자식(오른쪽 — 모두 펼치기). 카드 안이면 쓰지 않고 `CardHeader` 가 그 자리다.
- `AccordionExpandAll` — 모두 펼치기. `controls`(아코디언의 `id`) · `values` · `expandable`(상세가 있는 항목의 `value` 목록) · `onValuesChange(values)`. 모두 펼쳐져 있으면 "모두 접기" — 글 · 아이콘은 단추가 정한다. 아코디언과 같은 `values` 를 쥔다.

### 혜택 상세 — 시트 · 대화상자(separated)

[그림: 혜택 상세 · 12건 — 커피를 펼친 시트, 대중교통은 그냥 줄](../../site/components/specs/accordion.tsx#ex-sheet)

```tsx
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionExpandAll,
  AccordionHeader,
  AccordionItem,
  AccordionPlainItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const [open, setOpen] = useState<string[]>([]) // 처음에는 모두 접힘
const expandable = benefits.filter((b) => b.detail).map((b) => b.id)

<AccordionHeader title={`혜택 상세 · ${benefits.length}건`}>
  <AccordionExpandAll controls="benefit-detail" values={open} expandable={expandable} onValuesChange={setOpen} />
</AccordionHeader>
<Accordion id="benefit-detail" variant="separated" values={open} onValuesChange={setOpen}>
  {benefits.map((b) =>
    b.detail ? (
      <AccordionItem key={b.id} value={b.id}>
        <AccordionTrigger title={b.category} description={b.summary} />
        <AccordionContent>{b.detail}</AccordionContent>
      </AccordionItem>
    ) : (
      // 상세가 없으면 그냥 줄 — 막힌 트리거로 그리지 않는다
      <AccordionPlainItem key={b.id} title={b.category} description={b.summary} />
    ),
  )}
</Accordion>
```

### 카드 상세 — 혜택(inline)

[그림: 카드 상세 "혜택 · 12건" 카드 — 모두 펼치기 · 들인 선 24 · 카드 아래 8](../../site/components/specs/accordion.tsx#ex-card)

```tsx
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionExpandAll,
  AccordionItem,
  AccordionPlainItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

const [open, setOpen] = useState<string[]>([])
const expandable = benefits.filter((b) => b.detail).map((b) => b.id)

{/* 카드 제목이 h2 라 트리거는 h3(기본) — 트리거가 카드 가장자리까지, 카드 아래 8 */}
<Card body="accordion">
  <CardHeader>
    <CardTitle>혜택 · {benefits.length}건</CardTitle>
    <AccordionExpandAll controls="card-benefits" values={open} expandable={expandable} onValuesChange={setOpen} />
  </CardHeader>
  <Accordion id="card-benefits" values={open} onValuesChange={setOpen}>
    {benefits.map((b) =>
      b.detail ? (
        <AccordionItem key={b.id} value={b.id}>
          <AccordionTrigger title={b.category} description={b.summary} />
          <AccordionContent>{b.detail}</AccordionContent>
        </AccordionItem>
      ) : (
        <AccordionPlainItem key={b.id} title={b.category} description={b.summary} />
      ),
    )}
  </Accordion>
</Card>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 · `Enter` · `Space` | 그 항목만 펼치고 접는다 — 다른 항목은 그대로(여럿). 초점은 트리거에 그대로, 저절로 스크롤하지 않는다 |
| `↓` · `↑` | 다음 · 앞 트리거로 — 끝에서 처음으로 돌아간다. 상세가 없는 줄 · 막힌 트리거는 건너뛴다 |
| `Home` · `End` | 첫 · 끝 트리거 |
| `Tab` | 트리거 → 펼친 내용 안의 초점 가는 것 → 다음 트리거. 상세가 없는 줄은 건너뛴다 |
| 모두 펼치기 | 상세가 있는 항목을 모두 펼친다 → 글이 "모두 접기". 하나라도 접혀 있으면 다시 "모두 펼치기". 초점은 단추에 그대로 |
| 상세가 없는 줄 | 누르기 · 키보드 없음 — 바탕도 생기지 않는다 |
| Disabled | 누르기 · 키보드 불가, 화살표 이동에서 빠진다. 펼친 채 막히면 내용은 그대로 보인다 |
| 모션 줄이기 | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 흰 면 16.41 · 다크 13.42(시트 11.62), 설명 · 모두 펼치기 `fg-neutral-subtle` 5.50 · 6.09(시트 5.27, 누름 바탕 5.18 · 4.68), 펼친 내용 `fg-neutral-muted` 7.11 · 7.70(시트 6.67) ✓. 막힘 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 `fg-neutral-subtle` 5.50 · 6.09 ✓. 사이 선(1.15 · 1.30) · `separated` 테두리(1.23 · 1.56)는 묶음을 나눌 뿐이다 — 펼침은 꺾쇠 · 내용이 알린다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 펼침은 꺾쇠 방향과 보이는 내용으로 알린다 ✓ |
| **WCAG 2.1.1** Keyboard | `Tab` · `Enter` · `Space` · `↓` `↑` · `Home` · `End` ✓ |
| **WCAG 2.4.3** Focus order | 펼쳐도 초점은 트리거에 — 펼친 내용은 트리거 바로 뒤 차례 ✓ |
| **WCAG 2.4.7** Focus visible | 트리거 안쪽 링 2px — 카드 · 시트의 `overflow: hidden` 에 잘리지 않는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 트리거 줄 전체 54 이상 · 모두 펼치기 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 트리거 54 이상 · 모두 펼치기 44(보이는 32 위아래 6 씩) ✓ |
| **WCAG 4.1.2** Name, Role, Value | 트리거는 `heading > button` — 이름은 제목 + 설명, `aria-expanded` · `aria-controls`(펼친 내용의 `id`). 모두 펼치기는 `aria-controls`(아코디언 `id`)이고 이름은 보이는 글("모두 펼치기" · "모두 접기") ✓ |
| **ARIA** | APG Accordion — 머리말 단계는 놓인 자리를 따른다(기본 `h3`). 펼친 내용에 `role="region"` 을 두지 않는다 — 함께 열리는 항목이 많아 랜드마크가 늘어난다(APG). 상세가 없는 줄은 머리말 · 단추가 아닌 글이다. 앱은 트리거를 `Semantics(button: true, expanded: …)` 로, 접힌 내용은 의미 트리에서 뺀다 — 이름은 제목 + 설명뿐이다 |
| **Reduced motion** | 높이 움직임 없이 150ms 서서히(v104) · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 상세가 긴 항목 여럿을 묶어 화면을 짧게 — 항목은 둘 이상.
- 트리거 줄 전체를 누르게 하고, 제목은 줄을 바꿔 다 보인다.
- 여럿을 함께 열고, 목록 머리 오른쪽에 모두 펼치기.
- 상세가 없는 항목은 그냥 줄로 — 높이 · 글 시작은 같게.
- 펼쳐도 초점 · 스크롤을 그대로 두고, 길면 페이지가 스크롤하게.

### ❌ Don't

- 꺾쇠만 누르게 하기 · 글 단추로 트리거 만들기.
- 다른 항목을 열면 앞 항목을 닫기.
- 상세가 없는 항목을 막힌 트리거로 · 꺾쇠만 뒤집히게.
- 패널 안에 스크롤 상자 · 펼칠 때 저절로 스크롤 · 초점 옮기기.
- 제목 · 설명을 말줄임 · 줄 수로 자르기.
- 늘 보여도 되는 짧은 내용을 접기 · 항목 하나짜리 아코디언.
- 불투명도로 흐린 막힘 · 펼침 상태 없는 트리거(앱은 의미 노드에 펼침 상태).

## Specification

`accordion.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Accordion 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — accordion.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#accordion)

## SEED 와 다른 점

- **트리거 좌우 24**(`spacing-global-gutter` — porest 화면 가장자리 규칙). SEED 는 16.
- **`inline` 사이 선은 List 의 들인 선 — 좌우 24**. SEED 는 12(색은 같은 `stroke-neutral-subtle`).
- **`separated` 면은 porest Card 면 — 모서리 16 · 사이 8**. SEED 는 12 · 12(medium) — 데이터 표시 라운드에서 카드에 거절된 값이다.
- **누름 바탕은 불투명한 `bg-layer-default-pressed`** — SEED bg.transparent-pressed 는 투명도가 있어 검사기가 받지 않는다(v102). 들임 6 · 모서리 10 · 콘텐츠만 축소는 SEED 그대로다.
- **크기는 medium 하나** — SEED large(PC 대응 — 제목 20 · 설명 16 · 꺾쇠 24 · 위아래 20)는 두지 않는다. SEED react 의 `responsive` 도 없다.
- **늘 여럿을 함께 열고 "모두 펼치기" 를 둔다** — SEED react 의 기본은 하나만이고 모두 펼치기가 없다.
- **상세가 없는 항목은 그냥 줄** — SEED 에 규칙이 없다.
- **펼친 내용의 글 모양을 정한다**(`text-article-note` · `fg-neutral-muted` · 0 / 24 / 16) — SEED AccordionContent 는 여백 · 글자가 없다.
- **포커스 링(웹)은 porest 가 정했다** — 트리거 안쪽 2px(`separated` 는 모서리 14). SEED 는 아코디언의 포커스 링을 적지 않았다.

## Migration notes

### 2026-10-10 — SEED Accordion 으로 다시 쓴다

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 정했다 — SEED 두 변형(1B — inline 기본 · separated 는 Card 면 16 · 1px · 사이 8), SEED medium 하나(2A — 제목 16 / 22 · 500 · 설명 13 / 18 · 꺾쇠 20 · 54 · 74, 폰 · 데스크톱 같음), 꺾쇠 180° · 높이 300ms `ease-easing` · 모션 줄이기면 150ms 서서히(3A), 여럿 + "모두 펼치기"(4A — 누르는 44 · 펼치면 "모두 접기"), 상세 없는 항목은 그냥 줄(5A), 카드 상세 혜택은 웹 · 앱 모두 접는 목록(6A), 잘린 글은 자르지 않는다(10A). 그리고 "따라오는 것" — `heading > button`(기본 h3) · `aria-expanded` · `aria-controls` · `Enter` `Space` · `↓` `↑` 돌아가며 · `Home` `End` · 트리거 전체가 누르는 자리 · 항목 2개 이상 · 펼칠 때 자동 스크롤 · 초점 이동 없음 · 패널 안 스크롤 없음 · 줄 좌우 24 · 선은 List 선 · 눌림은 List 눌림 · 꺾쇠 `fg-neutral-subtle` · 제목은 늘 줄바꿈 · 막힘은 전용 색 · 앱 의미 노드(단추 + 펼침 상태, 접힌 내용은 읽지 않는다). 지금 제품 모양(1A) · separated 만(1C) · medium + 데스크톱 large(2B) · 지금 14(2C) · 200ms(3B) · 움직임 없음(3C) · 단추 없음(4B) · 하나만(4C) · 막힌 트리거(5B) · 꺾쇠만 뒤집힘(5C) · 둘 다 펼친 목록(6B)은 고르지 않았다. 옛 스펙은 `accordion.history/v-pre-seed-collapse.*` 에 남겼다.

| 옛 Accordion | 새 Accordion |
|---|---|
| Radix Accordion 베이스 · 하나만(`single` 기본) · 여럿 | 늘 여럿 + 모두 펼치기 — 하나만 여는 모드는 없다 |
| 외곽 없이 아래 선만(`border-default`) · 끝까지 | `inline` 들인 선 24(마지막 선 없음) · `separated` Card 면 |
| 트리거 위아래 16 · 좌우 0 · `title-sm` 16 · 500 | 위아래 16 · 좌우 24 · 제목 16 / 22 · 500 + 설명 13 / 18 · 500 · 54 · 74 |
| 꺾쇠 16 `text-secondary` · 200ms(`motion-duration-base` — 옛 이름) | 꺾쇠 20 `fg-neutral-subtle` · 300ms `ease-easing`(d6) |
| 호버는 글자색 · 바탕 없음 | 누름 · 호버 바탕(들임 6 · 모서리 10) + 콘텐츠만 2px |
| 펼친 내용 `body-md` · `text-secondary` · 아래 16 | `text-article-note` 14 / 22 · `fg-neutral-muted` · 0 / 24 / 16 |
| 포커스 링 바깥 2px 띄움 | 트리거 안쪽 2px — 카드 · 시트에 잘리지 않는다 |
| 막힘 불투명도 0.5 | 전용 색 `fg-disabled` · 상세가 없는 항목은 그냥 줄 |
| "헤딩은 사용처에서 H3/H4 wrap 권장" | 트리거가 머리말을 그린다 — `headingLevel`(기본 3) |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트, HR 은 렌더로 쟀다). 아코디언 부품을 쓰는 곳은 셋 다 0 이고, 자리마다 손으로 짰다.

- **웹 카드 혜택 상세(대화상자 · 폰 서랍)** — 항목마다 카드(모서리 8 · 1px #EDEFF3 1.15) · 안쪽 14 / 16 · 제목 14 / 700 · 값 12.5 / 700 브랜드(눈금 밖 글자) · 꺾쇠 16 바꿔치기 · 움직임 0 · `aria-expanded` 0 · 머리말 0(`pages/card-benefit/ui/CardBenefitDetailDialog.tsx:262-470`, D4 · D22). 키보드 포커스 링이 카드 셸 `overflow: hidden` 에 통째로 잘려 보이지 않는다(`:262-267 · 399-402`, D1). 상세가 없는 2건은 꺾쇠만 위로 뒤집힌다(`:472`, D5). 모두 펼치기는 accent sm 90.6 × 32 · 12 / 500 이다. `separated` · 모두 펼치기 44 로.
- **웹 카드 상세 혜택 · 유의사항** — `ul.divide-y` 줄마다 Radix Collapsible · 끝까지 선 #EDEFF3 · 호버 `bg-muted/40`(1.03) · 배지 + 14 / 500 · tw-animate 200ms ease-out · 머리말 0(`widgets/card-detail/ui/AvailableBenefitsList.tsx:49-94` · `CardCautionList.tsx:23-58`). 상세가 없으면 `<button disabled>` 라 "사용할 수 없음" 으로 읽힌다(`AvailableBenefitsList.tsx:60` · `CardCautionList.tsx:34`, D5). 혜택 본문은 왼쪽 60 인데 제목은 16 이라 44 어긋난다(`AvailableBenefitsList.tsx:83`, D16). 유의사항 제목은 `truncate` 라 84자 가운데 데스크톱 612 / 751px · 폰 282 / 751px 만 보인다(`CardCautionList.tsx:37`, D11). 카드 안 `inline`(`Card body="accordion"`) · 제목 줄바꿈으로.
- **앱 혜택 시트** — `PCard bordered`(모서리 12) · 제목 14 bold · 요약 13 bold `fgBrand` · 조건 배지가 다음 줄 · 꺾쇠 16 150ms linear · 본문 `SizeTransition` 200ms(`features/card/presentation/card_benefit_detail_sheet.dart:164-210 · 479-590`). 트리거 의미 노드에 단추 · 펼침 상태가 없고 접힌 상세 본문까지 이름으로 읽는다(`:498-590` · `shared/widgets/p_collapsible.dart:94-100`, D2). 본문 왼쪽 24 ↔ 트리거 16(`:578-583`, D16), 상세가 없으면 꺾쇠만 돈다(`:568-590`, D5).
- **앱 카드 상세** — 혜택은 접지 않고 상세 본문까지 다 보이고, 유의사항은 주황 상자 안 caption 줄이며 상자 전체가 한 덩어리로 읽힌다(`features/card/presentation/card_detail_screen.dart:153-236 · 399-410`, D15 · D2). 웹과 같은 카드 안 `inline` 으로 — 유의사항 트리거도 단추 + 펼침 상태로 읽힌다. 주황 상자를 둘지는 이번 결정 밖이다.
- **모션 줄이기** — 펼침이 줄이기를 따르는 곳이 0 이다(웹 `reducedMotion: reduce` 렌더 · 앱 `disableAnimations` 위젯 테스트 모두 그대로 움직였다, D9). 시간도 0 · 150 · 200ms 로 제각각이다.
- **쓰지 않는 것** — 앱 `shared/widgets/p_accordion.dart`(`PAccordion` · `PAccordionMultiple` — 옛 스펙을 옮긴 것, 쓰는 곳 0)는 이 스펙으로 다시 만들거나 걷는다(D21). 웹에는 `accordion.tsx` · `@radix-ui/react-accordion` 이 없다(조사 S1 — 옛 스펙이 적은 "기존 accordion.tsx" 는 없었다).
- **스펙 글** — DESIGN.md v70 Accordion(트리거 바탕 · 테두리 · 호버 바탕 · 투명도 펼침 · `region`)이 이 스펙과 반대였다(조사 S6) — "펼치고 접기 · 나누기" 절로 바꿨다.

### 이전 기록

- **2026-05 — site 에 맞춤.** 외곽 없이 아래 선만 · `title-sm` 트리거 · `body-md` 내용 · 꺾쇠 16 · 200ms 로 정리했다(옛 preview 의 카드형 외곽을 걷음). 이번에 모두 바뀌었다.
