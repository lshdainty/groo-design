# Accordion

> 관련 정보를 세로로 묶어 두고 항목마다 머리를 눌러 상세를 펼치는 목록으로, 카드 혜택 · 유의사항처럼 상세가 길어 다 펼쳐 두면 화면이 몇 배로 길어지는 자리에 씁니다. 하나만 접고 펴는 자리는 [Collapsible](collapsible.md), 단계가 있는 고르는 나무는 [Tree View](tree-view.md), 하위 줄을 접는 목록은 [List](list.md) 의 하위 줄을 씁니다.

수치 원본은 [`accordion.yaml`](accordion.yaml)입니다.

[그림: 카드 혜택 상세 시트(separated) · 카드 상세 "혜택" 띠(inline) — 라이트 · 다크](../../site/components/specs/accordion.tsx#hero)

### 직접 골라 보기

변형(inline · separated) · 설명 · 앞 아이콘 · 상세 없는 항목 · 막힘 · 모션 줄이기를 고르면 스펙대로 그린 아코디언과 그 코드가 바뀝니다. 트리거를 눌러 펼치고, 초점을 두고 `↓` `↑` · `Home` · `End` · `Enter` 를 눌러 볼 수 있습니다. "모두 펼치기" 도 함께 있습니다.

[그림: 플레이그라운드](../../site/components/specs/accordion.tsx#playground)

## Anatomy

[그림: 트리거는 앞 아이콘 · 제목 · 설명 · 꺾쇠, 펼치면 아래에 내용 — 목록 머리 오른쪽에 모두 펼치기](../../site/components/specs/accordion.tsx#anatomy)

| ⓐ Trigger | 트리거 — 줄 전체가 누르는 자리입니다. 머리말(`h3`) 안의 단추입니다. |
| ⓑ Prefix Icon | 앞 아이콘 — 22, 있을 때만 둡니다. |
| ⓒ Title | 제목 — 16 / 22 · 500. 무엇의 상세인지 적고, 늘 줄을 바꿉니다. |
| ⓓ Description | 설명 — 13 / 18 · 500 · 옅은 색. 제목 아래 한 줄 요약이며 있을 때만 둡니다. |
| ⓔ Chevron | 꺾쇠 — 20. 접혀 있으면 아래, 펼치면 위를 가리킵니다. |
| ⓕ Panel | 펼친 내용 — 14 / 22 · `fg-neutral-muted`. 안에서 스크롤하지 않습니다. |
| ⓖ Divider | 항목 사이 선 — `inline` 만, 좌우 24 들입니다. |
| ⓗ Expand All | 모두 펼치기 — 목록 머리 오른쪽 글 단추입니다. 펼치면 "모두 접기" 가 됩니다. |

한 트리거는 두 층입니다 — **바탕 층**(누름 · 호버 바탕)과 **콘텐츠 층**(앞 아이콘 · 본문 · 꺾쇠). 누르면 바탕이 좌우 6 들어와 모서리 10 으로 둥글어지고, 콘텐츠 층만 2px 거리로 줄어듭니다. [List](list.md) 줄과 같은 짜임입니다.

[표: 부위](accordion.yaml#slots)

## Properties

### Variant

변형은 둘입니다.

- **`inline`**(기본) — 연속 목록 + 항목 사이 선. 화면 · 카드 안에서 목록으로 읽히는 자리에 씁니다(카드 상세의 혜택 · 유의사항). 선은 [List](list.md) 의 들인 선과 같습니다 — 1px `stroke-neutral-subtle` · 좌우 24 · 첫 항목 위와 마지막 항목 아래에는 긋지 않습니다.
- **`separated`** — 항목마다 [Card](card.md) 모양입니다(1px `stroke-neutral-weak` 테두리 · 모서리 16 · 사이 8 · 그림자 없음 — 면은 칠하지 않습니다). 항목 하나하나가 따로 읽히는 정보 묶음에 씁니다(카드 혜택 상세 시트 · 대화상자). 면은 놓인 표면 그대로입니다(시트 · 대화상자의 `bg-layer-floating`). 그래서 `separated` 는 흰 표면(시트 · 대화상자 · 띠 · 흰 화면) 위에만 둡니다 — 회색 바닥 위의 접는 목록은 흰 면(카드 · 띠 — 어느 화면이 어느 쪽인지는 DESIGN.md Layout 의 "화면 바탕") 안의 `inline` 입니다. 띠 안에 테두리 카드를 두지 않는 규칙의 예외입니다.

두 변형 모두 트리거 · 눌림 · 꺾쇠 · 펼침은 같고 면만 다릅니다.

[그림: inline — 카드 안 연속 목록 + 들인 선 24 · separated — 항목마다 Card 면 16 · 사이 8](../../site/components/specs/accordion.tsx#variant)

[표: 변형](accordion.yaml#variant)

### Size

크기는 하나이고, 폰 · 데스크톱이 같습니다. 트리거는 위아래 16 · 좌우 24(화면 가장자리 규칙), 제목 16 / 22 · 500 `fg-neutral`, 설명 13 / 18 · 500 `fg-neutral-subtle`(제목 아래 2), 꺾쇠 20 `fg-neutral-subtle`, 앞 아이콘 22 이며, 앞 아이콘 · 본문 · 꺾쇠 사이는 12 입니다. 제목만이면 54, 설명이 있으면 74 이고, 제목이 줄을 바꾸면 늘어납니다. List 줄 · 카드 머리와 같은 16 이라 한 화면 안에서 글 크기가 갈리지 않습니다.

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

펼친 내용은 트리거와 같은 좌우 24, 아래 16 안에 둡니다. 위 여백은 0 이라 트리거 아래 16 에 바로 이어집니다. 글은 `text-article-note`(14 / 22 — 긴 글 보조) · `fg-neutral-muted` 입니다. 혜택 상세처럼 긴 설명이 대부분이라 이 글 모양을 기본으로 둡니다. 앞 아이콘이 있어도 펼친 내용은 24 에서 시작해 줄 폭을 씁니다. 내용이 길어도 패널 안에서 스크롤하지 않고, 페이지 · 시트 본문이 스크롤합니다.

[그림: 펼친 내용 — 0 / 24 / 16 · 14 / 22 · 7줄 상세가 그대로 펼쳐진다](../../site/components/specs/accordion.tsx#panel)

[표: 펼친 내용](accordion.yaml#base.enabled@panel)

[표: 펼친 내용의 글](accordion.yaml#base.enabled@panelText)

### 상세가 없는 항목

목록 가운데 상세가 없는 항목(혜택 "대중교통" — 요약뿐)은 **트리거가 아닌 그냥 줄**입니다. 꺾쇠가 없고, 머리말 · 단추로 감싸지 않아 `Tab` 이 건너뛰며, 글만 읽힙니다. 위아래 16 · 좌우 24 · 글 크기가 다른 항목과 같아 높이와 글 시작이 같습니다. 누르거나 올려도 바탕이 생기지 않습니다. 막힌 트리거로 그리지 않는 것은 "사용할 수 없음" 으로 읽혀 혜택이 막힌 것처럼 들리기 때문입니다.

[그림: 혜택 다섯 가운데 대중교통 · 편의점이 그냥 줄 — 같은 높이 · 같은 글 시작, 꺾쇠 없음](../../site/components/specs/accordion.tsx#no-detail)

[표: 상세 있음 · 없음](accordion.yaml#detail)

### 모두 펼치기

여럿을 함께 열고, 목록 머리 오른쪽에 "모두 펼치기" 글 단추를 둡니다. 상세가 있는 항목을 모두 펼치고, 모두 펼쳐져 있으면 글이 "모두 접기" 로 바뀝니다. 모양은 [Card](card.md) 머리 동작과 같은 글 버튼입니다 — 14 · 700 · `fg-neutral-muted`, 아이콘 없이 보이는 36(좌우 14) · 누르는 44(DESIGN.md Typography 의 "글자 역할" R16). 머리가 카드 머리면 그 오른쪽 동작 자리에, 시트 · 대화상자면 목록 머리 줄(제목 16 / 22 · 700 + 건수 — 카드 머리와 같은 글, 높이 36 · 아래 8)의 오른쪽에 둡니다.

큰 글자에서 오른쪽 동작이 머리 폭의 절반을 넘으면 제목 아래 줄 오른쪽 끝으로 내립니다. 제목은 한 줄 전체 폭으로 읽히고 머리가 버튼 한 줄(36)만큼 높아집니다. 평소(100% · 130%)는 한 줄 그대로입니다. [Button](button.md) 짝의 반 폭 판정과 같고, 카드 머리 · 아코디언 목록 머리 · List Header 가 같은 규칙입니다. 판정은 이렇습니다 — 동작의 보이는 상자 폭(글 + 좌우 14 · 14)에서 끝 블리드 14(머리 여백으로 내어 걸리는 몫)를 빼고 사이 8 을 더한 값이 머리 안쪽 폭의 절반 이하면 한 줄, 넘으면 내립니다. 레시피의 flex 줄바꿈(제목 최소 50%)이 그대로 이 셈입니다. 예를 들어 머리 안쪽 300 이면 "모두 펼치기" 보이는 상자 156 까지 한 줄 · 157 부터 내려갑니다(카드 머리 · 아코디언 목록 머리 156 / 157 · List Header 는 사이가 10 이라 154 / 155). 200% 에서 360 화면 "모두 펼치기" 154 는 한 줄, 320 화면 "전체 보기" 130 은 한 줄이고 "모두 펼치기" 는 내려갑니다. 웹 · 앱 모두 이 셈으로 판정합니다.

[그림: 혜택 상세 · 12건 — 모두 펼치기 · 모두 접기, 보이는 36 · 누르는 44](../../site/components/specs/accordion.tsx#expand-all)

[표: 목록 머리](accordion.yaml#base.enabled@header)

[표: 목록 머리 제목](accordion.yaml#base.enabled@headerTitle)

[표: 모두 펼치기](accordion.yaml#base.enabled@expandAll)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 · 꺾쇠 아래(펼침이면 위) |
| `hovered` | 웹 — 누름과 같은 바탕. 좌우 6 들어온 `bg-layer-default-pressed`, 모서리 10 |
| `focused` | 웹 — 키보드 포커스에만 트리거 안쪽 링 2px. `separated` 는 항목 모서리를 따라 14 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소 |
| `disabled` | 앞 아이콘 · 제목 · 설명 · 꺾쇠가 모두 `fg-disabled` 입니다. 흐리게 하지 않습니다. 상세가 없는 항목을 막힌 트리거로 그리지 않습니다 |

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 막힘(inline · separated)](../../site/components/specs/accordion.tsx#states)

[표: 상태 — 바탕 · 콘텐츠 · 포커스 링](accordion.yaml#matrix@background+content+focusRing)

[표: 상태 — 글 · 꺾쇠](accordion.yaml#matrix@prefixIcon+title+description+chevron)

[표: separated 의 포커스 링](accordion.yaml#matrix.variant.separated@focusRing)

[표: 펼침](accordion.yaml#open)

[표: 모션](accordion.yaml#motion)

꺾쇠는 180° 돌고 내용은 높이로 펼쳐지고 접힙니다 — 둘 다 300ms `motion-ease-easing` 입니다. 모션 줄이기면 높이를 움직이지 않고 내용이 150ms 서서히 나타나고 사라지며, 꺾쇠는 바로 뒤집힙니다.

[그림: 펼침 300ms — 7줄 상세가 밀려 내려갑니다 · 모션 줄이기 150ms 서서히](../../site/components/specs/accordion.tsx#motion)

## Guidelines

### 언제 쓰나

| 이런 자리 | 쓰는 것 |
|---|---|
| 관련 상세를 여럿 묶고, 다 펼치면 화면이 몇 배로 길어진다(카드 혜택 · 유의사항) | **Accordion** — 항목 2개 이상 |
| 상세 하나를 접고 편다(분할 내역 · 빠르게 맞추기 · 상세 검색 조건) | [Collapsible](collapsible.md) — 같은 트리거 모양 |
| 부모 · 하위 두 단계 목록에서 줄은 편집, 하위만 접는다(카테고리) | [List](list.md) 하위 줄 — 줄 앞 꺾쇠 단추 |
| 여러 단계에서 하나를 고른다(부서) | [Tree View](tree-view.md) |
| 짧아서 늘 보여도 되는 내용 | 접지 않습니다 — 그냥 보입니다 |

항목은 2개 이상입니다. 하나를 접고 펴는 것은 Collapsible 입니다. 처음에는 모두 접혀 있습니다.

[그림: 혜택 열둘은 Accordion · 분할 내역 하나는 Collapsible · 카테고리는 List 하위 줄](../../site/components/specs/accordion.tsx#when-guide)

### 여럿을 함께 연다

두 혜택을 나란히 견주며 읽을 수 있게 다른 항목을 닫지 않습니다. 열 개를 한 번에 펼쳐 비교할 때는 "모두 펼치기" 를 누릅니다 — 열 번 누르지 않습니다. 다른 항목을 열면 앞 항목이 닫히는 하나만 열기는 두지 않습니다. 닫히는 항목 때문에 누른 자리가 위로 밀려 올라가기 때문입니다.

[그림: 혜택 12건 — 모두 펼치기 한 번으로 열 항목, 시트 본문이 그만큼 길어진다](../../site/components/specs/accordion.tsx#multi-guide)

### 펼쳐도 그 자리에

펼쳐도 화면을 저절로 스크롤하지 않고 초점도 트리거에 그대로 둡니다. 내용이 길면 페이지 · 시트 본문이 스크롤합니다. 패널 안에 높이를 정해 스크롤 상자를 만들지 않습니다 — 스크롤이 겹쳐 손가락이 어느 쪽을 움직이는지 알 수 없기 때문입니다.

[그림: 첫 항목을 펼쳐도 트리거가 그 자리 — 시트 본문이 스크롤, 패널 안 스크롤 상자는 두지 않는다](../../site/components/specs/accordion.tsx#scroll-guide)

### 카드 상세의 혜택 · 유의사항

카드 상세 화면의 혜택 · 유의사항은 웹 · 앱 모두 흰 면 안의 `inline` 아코디언입니다. 흰 면은 데스크톱(768 이상)은 카드, 폰(앱 · 768 미만 웹)은 화면 폭 띠이며, 띠 안 값은 카드 안과 같습니다(DESIGN.md Layout 의 "화면 바탕"). 머리(제목 "혜택 · 12건" · 오른쪽 모두 펼치기) 아래 트리거가 카드 가장자리(폰은 화면 끝)까지 가고, 카드 · 띠 아래 여백은 8 입니다. 마지막 트리거의 아래 16 과 합쳐 24 로 보입니다([Card](card.md) `body="accordion"`). 혜택 상세 시트 · 대화상자는 `separated` 입니다. 유의사항은 설명 없이 제목만 있는 트리거입니다(펼치면 상세).

[그림: 카드 상세 — 카드 요약 · 혜택 12건 · 유의사항 5건, 처음 모습의 전체 길이](../../site/components/specs/accordion.tsx#card-guide)

### 제목은 자르지 않습니다

제목 · 설명은 늘 줄을 바꿔(단어 단위) 다 보입니다. 84자 유의사항 제목도 한 줄 말줄임으로 자르지 않습니다 — 펼쳐도 상세(다른 글)만 나와 잘린 제목은 어디에서도 다 읽을 수 없기 때문입니다. 잘린 글을 펼치는 "더 보기" 도 두지 않습니다.

[그림: 84자 유의사항 제목 — 줄을 바꿔 다 보인다 · 한 줄 말줄임](../../site/components/specs/accordion.tsx#wrap-guide)

### 글

제목은 무엇의 상세인지 명사로 씁니다("커피" · "연회비 · 카드 발급 후 첫 달 실적 기준"). 설명은 그 항목의 한 줄 요약입니다("골목커피 · 숲속다방 · 달빛로스터리 50% 할인"). 펼친 내용의 줄바꿈 문자는 그대로 줄을 바꿉니다 — 상세가 "■ …" 줄들로 오는 자리입니다. 모두 펼치기의 글은 "모두 펼치기" · "모두 접기" 입니다.

## 코드

레시피 `recipes/shadcn/components/ui/accordion.tsx` 를 씁니다(Radix Accordion `type="multiple"` 위에 짜도 됩니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Accordion` — 아코디언. `variant`(`"inline"` 기본 · `"separated"`) · `values` · `defaultValues` · `onValuesChange(values)`(펼친 항목의 `value` 목록 — 늘 여럿을 함께 열며, 하나만 여는 모드는 없습니다) · `disabled`(전체) · `id`(모두 펼치기가 가리킵니다), 나머지는 `div` 속성입니다. 처음에는 모두 접힘입니다(`defaultValues` 없음).
- `AccordionItem` — 항목. `value`(필수) · `disabled`.
- `AccordionTrigger` — `title`(필수) · `description` · `prefixIcon` · `headingLevel`(`2` ~ `6`, 기본 `3`). 머리말 안의 단추(`aria-expanded` · `aria-controls`)를 그리고, 꺾쇠 20 은 트리거가 그립니다. 트리거 사이 `↓` `↑`(돌아가며) · `Home` · `End` 를 받습니다.
- `AccordionContent` — 펼친 내용. 0 / 24 / 16 · 14 / 22 · `fg-neutral-muted` · 줄바꿈 문자를 지킵니다. 접혀 있으면 그리지 않습니다. 높이 300ms, 모션 줄이기면 150ms 서서히 나타납니다.
- `AccordionPlainItem` — 상세가 없는 항목. `title`(필수) · `description` · `prefixIcon`. 단추 · 머리말 · 꺾쇠가 없고 높이 · 글 시작은 트리거와 같습니다.
- `AccordionHeader` — 시트 · 대화상자의 목록 머리. `title`(필수 — 건수를 붙입니다) · 자식(오른쪽 — 모두 펼치기). 카드 안이면 쓰지 않고 `CardHeader` 가 그 자리입니다.
- `AccordionExpandAll` — 모두 펼치기. `controls`(아코디언의 `id`) · `values` · `expandable`(상세가 있는 항목의 `value` 목록) · `onValuesChange(values)`. 모두 펼쳐져 있으면 "모두 접기" 이며, 글은 단추가 정합니다. 아코디언과 같은 `values` 를 쥡니다.

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
| 트리거 누르기 · `Enter` · `Space` | 그 항목만 펼치고 접습니다. 다른 항목은 그대로입니다(여럿). 초점은 트리거에 그대로 두고, 저절로 스크롤하지 않습니다 |
| `↓` · `↑` | 다음 · 앞 트리거로 옮깁니다. 끝에서 처음으로 돌아갑니다. 상세가 없는 줄 · 막힌 트리거는 건너뜁니다 |
| `Home` · `End` | 첫 · 끝 트리거 |
| `Tab` | 트리거 → 펼친 내용 안의 초점 가는 것 → 다음 트리거. 상세가 없는 줄은 건너뜁니다 |
| 모두 펼치기 | 상세가 있는 항목을 모두 펼치고 글이 "모두 접기" 가 됩니다. 하나라도 접혀 있으면 다시 "모두 펼치기" 입니다. 초점은 단추에 그대로 둡니다 |
| 상세가 없는 줄 | 누르기 · 키보드 없음 — 바탕도 생기지 않습니다 |
| Disabled | 누르기 · 키보드 불가, 화살표 이동에서 빠집니다. 펼친 채 막히면 내용은 그대로 보입니다 |
| 모션 줄이기 | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 흰 면 16.41 · 다크 13.42(시트 11.62), 설명 `fg-neutral-subtle` 5.50 · 6.09(시트 5.27, 누름 바탕 5.18 · 4.68), 모두 펼치기 `fg-neutral-muted` 7.11 · 7.70(시트 6.67, 누름 바탕 6.70 · 5.93), 펼친 내용 `fg-neutral-muted` 7.11 · 7.70(시트 6.67) ✓. 막힘 `fg-disabled` 는 기준 밖입니다(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 꺾쇠 `fg-neutral-subtle` 5.50 · 6.09 ✓. 사이 선(1.15 · 1.30) · `separated` 테두리(1.23 · 1.56)는 묶음을 나눌 뿐이고, 펼침은 꺾쇠 · 내용이 알립니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 펼침은 꺾쇠 방향과 보이는 내용으로 알립니다 ✓ |
| **WCAG 2.1.1** Keyboard | `Tab` · `Enter` · `Space` · `↓` `↑` · `Home` · `End` ✓ |
| **WCAG 2.4.3** Focus order | 펼쳐도 초점은 트리거에 있고, 펼친 내용은 트리거 바로 뒤 차례입니다 ✓ |
| **WCAG 2.4.7** Focus visible | 트리거 안쪽 링 2px — 카드 · 시트의 `overflow: hidden` 에 잘리지 않습니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 트리거 줄 전체 54 이상 · 모두 펼치기 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 트리거 54 이상 · 모두 펼치기 44(보이는 36 위아래 4 씩) ✓ |
| **WCAG 4.1.2** Name, Role, Value | 트리거는 `heading > button` 입니다. 이름은 제목 + 설명, `aria-expanded` · `aria-controls`(펼친 내용의 `id`). 모두 펼치기는 `aria-controls`(아코디언 `id`)이고 이름은 보이는 글("모두 펼치기" · "모두 접기")입니다 ✓ |
| **ARIA** | APG Accordion — 머리말 단계는 놓인 자리를 따릅니다(기본 `h3`). 펼친 내용에 `role="region"` 을 두지 않습니다 — 함께 열리는 항목이 많아 랜드마크가 늘어나기 때문입니다(APG). 상세가 없는 줄은 머리말 · 단추가 아닌 글입니다. 앱은 트리거를 `Semantics(button: true, expanded: …)` 로 두고, 접힌 내용은 의미 트리에서 뺍니다 — 이름은 제목 + 설명뿐입니다 |
| **Reduced motion** | 높이 움직임 없이 150ms 서서히 · 꺾쇠는 바로 · 누름 축소 없음 |

## Do / Don't

### ✅ Do

- 상세가 긴 항목 여럿을 묶어 화면을 짧게 합니다 — 항목은 둘 이상입니다.
- 트리거 줄 전체를 누르게 하고, 제목은 줄을 바꿔 다 보이게 합니다.
- 여럿을 함께 열고, 목록 머리 오른쪽에 모두 펼치기를 둡니다.
- 상세가 없는 항목은 그냥 줄로 두고, 높이 · 글 시작은 같게 합니다.
- 펼쳐도 초점 · 스크롤을 그대로 두고, 길면 페이지가 스크롤하게 합니다.

### ❌ Don't

- 꺾쇠만 누르게 하거나 글 단추로 트리거를 만들지 않습니다.
- 다른 항목을 열 때 앞 항목을 닫지 않습니다.
- 상세가 없는 항목을 막힌 트리거로 그리거나 꺾쇠만 뒤집히게 하지 않습니다.
- 패널 안에 스크롤 상자를 두거나, 펼칠 때 저절로 스크롤하거나 초점을 옮기지 않습니다.
- 제목 · 설명을 말줄임 · 줄 수로 자르지 않습니다.
- 늘 보여도 되는 짧은 내용을 접거나 항목 하나짜리 아코디언을 만들지 않습니다.
- 불투명도로 흐린 막힘, 펼침 상태 없는 트리거를 두지 않습니다(앱은 의미 노드에 펼침 상태를 둡니다).

## Specification

`accordion.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다. 웹 · 앱이 Accordion 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — accordion.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#accordion)
