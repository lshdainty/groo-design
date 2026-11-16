# Color Swatch

> 카테고리 · 태그 · 라벨 · 저축 목표 · 캘린더에 붙일 색을 고르는 묶음입니다. 차트 10색을 원 칸에 진하게 칠해 5 × 2 로 늘어놓고 하나를 고르며, 고른 색은 그 항목의 차트 · 타일 · 점에 그대로 칠해집니다. 이름이 붙은 선택지를 고를 때는 [Chip](chip.md) · [Select](select.md) 를 씁니다.

수치 원본은 [`color-swatch.yaml`](color-swatch.yaml)입니다.

[그림: 카테고리 추가 — 색상 5 × 2(데스크톱 대화상자 · 폰 시트), 라이트 · 다크](../../site/components/specs/color-swatch.tsx#hero)

### 직접 골라 보기

고른 색 · 지금 색 칸(없음 · 팔레트 밖 · 색 없음) · 막힘을 고르면 묶음과 코드가 함께 바뀝니다. 칸을 누르거나, 칸에 초점을 두고 ← → ↑ ↓ 로 옮겨 볼 수 있고, 화면 읽기 프로그램이 읽는 말("빨강, 라디오, 1/10")이 함께 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/color-swatch.tsx#playground)

## Anatomy

[그림: 묶음은 색 칸 10 · 고른 고리 · 체크로 이뤄지고, 고칠 때는 앞에 지금 색 칸을 둡니다](../../site/components/specs/color-swatch.tsx#anatomy)

| ⓐ Group | 묶음 — 5 × 2 격자입니다. 이름은 [Field](field.md) 라벨("색상")이고, 줄 칸 폼이면 줄 제목("색상")입니다. |
| ⓑ Swatch | 색 칸 — 원 40 · 누르는 44, 차트 색으로 채웁니다. 이름은 색 이름("빨강")입니다. |
| ⓒ Check | 체크 16 — 고른 칸 가운데에 두고, 라이트는 흰색 · 다크는 짙은 글자 색입니다. |
| ⓓ Ring | 고른 고리 — 칸 바깥 2 를 띄운 2px 짙은 선입니다. |
| ⓔ Current | 지금 색 칸 — 팔레트 밖 색("지금 색") · 색 없음("자동"). 고칠 때만 격자 앞에 둡니다. |

[표: 부위](color-swatch.yaml#slots)

## Properties

### 색 — 차트 색 그대로 진하게

칸은 차트 색(라이트 700 · 다크 800-dark)으로 꽉 채웁니다 — 칸이 곧 그 항목의 차트 · 아이콘 · 점에 칠해질 색입니다. 옅게 섞은 칸 · 옅은 바탕(weak) 칸은 쓰지 않습니다 — 옅은 칸끼리는 서로 거의 같아(OKLab ΔE 0.012) 남색 · 보라 · 분홍이 헷갈리기 때문입니다. 진한 칸끼리는 가장 가까운 짝도 또렷하고, 흰 표면과 4.55 이상 · 다크 표면과 6.07 이상입니다. 웹 · 앱이 같은 차트 색을 씁니다.

[그림: 10색 — 라이트 700 · 다크 800-dark, 칸마다 이름 · 대비](../../site/components/specs/color-swatch.tsx#colors)

[표: 색](color-swatch.yaml#color)

### 크기 · 배치

칸은 원 40(누르는 44)이고 폭과 상관없이 5개씩 두 줄 · 사이 12 입니다 — 데스크톱 대화상자에서도 폰 시트에서도 같은 크기 · 같은 줄입니다. 칸 · 사이는 글자 크기 설정을 따르지 않는 px(-static)이고, 웹도 앱과 같습니다. 색이 곧 값이라 글처럼 읽을 일이 없고, rem 이면 글자 200% 에서 원이 80 으로 커져 40 열 격자에서 서로 겹치기 때문입니다. 차례는 색상환(빨강 → 주황 → 노랑 → 초록 → 파랑 → 남색 → 보라 → 분홍 → 갈색 → 회색)이라 ↑ ↓ 가 늘 같은 칸으로 갑니다. 폭을 나눈 네모는 쓰지 않습니다.

[그림: 원 40 · 5 × 2 · 사이 12 — 데스크톱 476 · 폰 342 에서 같습니다](../../site/components/specs/color-swatch.tsx#size)

[표: 묶음](color-swatch.yaml#base.enabled@group)

[표: 색 칸](color-swatch.yaml#base.enabled@swatch)

### 고른 표시

고른 칸은 바깥 2 를 띄운 2px 짙은 고리(`stroke-neutral-contrast` — [Select Box](select-box.md) 의 고른 테두리와 같은 색) + 가운데 체크 16(선 2.5)입니다. 체크는 `fg-neutral-inverted` 라 라이트는 흰색, 다크는 짙은 글자 색입니다 — 다크 800-dark 칸 위 흰 체크는 1.88 ~ 2.39 라 읽히지 않기 때문입니다(아바타 이니셜과 같은 규칙). 칸 위 체크는 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70 입니다. 색과 함께 고리 · 체크 모양으로도 알립니다.

[그림: 고른 칸 — 고리(띄움 2 · 2px) + 체크, 라이트 흰 · 다크 짙은 체크](../../site/components/specs/color-swatch.tsx#selected)

[표: 체크](color-swatch.yaml#base.enabled@check)

[표: 고리](color-swatch.yaml#base.enabled@ring)

### 지금 색 · 자동

고치는 항목의 색이 팔레트 밖이거나(가져오기가 만드는 #9E9E9E) 색이 없으면 격자 앞에 칸 하나를 따로 둡니다 — 세로 선으로 격자와 가르고, 처음에는 그 칸이 골라져 있습니다. 칸 · 선 · 격자가 한 줄에 들어가지 않으면 그 칸을 격자 위 줄에 두고 가로 선으로 가릅니다 — 판단은 실제 폭으로 합니다. 글자 크기 100% 에서 칸 · 선 · 격자는 321 이라 360 폰 본문(312)은 위 줄, 390 폰(342) · 대화상자는 옆입니다. 칸 아래 "지금 색" 글은 글자 크기 설정을 따라 넓어지므로(200% 에서는 390 폰도 넘칩니다) 321 고정 문턱이 아니라 그 글을 넣은 실제 폭이 놓인 자리보다 넓으면 위 줄로 올립니다 — 글은 줄이지 않습니다.

- **지금 색** — 팔레트 밖의 저장된 색을 그대로 칠합니다(두 모드 같은 값). 체크는 흰색 · 짙은 글자 가운데 그 색 위 대비가 큰 쪽입니다.
- **자동** — 색이 없는 항목입니다. 차트가 그 항목에 줄 색(아직 쓰지 않은 색)을 점선 원으로 보입니다.

격자에서 색을 고르면 그 색으로 바뀌고, 지금 색 칸을 다시 고르면 저장 값을 그대로 둡니다. 아무것도 고르지 않고 저장하면 색은 바뀌지 않습니다 — 몰래 빨강으로 바꾸지 않습니다.

[그림: 지금 색(#9E9E9E) · 자동(점선) — 격자 앞 칸 + 세로 선](../../site/components/specs/color-swatch.tsx#current)

[표: 지금 색 칸](color-swatch.yaml#current)

[표: 지금 색 칸 아래 글](color-swatch.yaml#base.enabled@currentLabel)

[표: 세로 선](color-swatch.yaml#base.enabled@divider)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 색 그대로 |
| `hovered` | 웹 — 바뀌지 않습니다(칸의 색이 곧 값입니다). 커서만 pointer |
| `focused` | 키보드 포커스에만 고리 바깥 링 2px(띄움 6) |
| `pressed` | 칸 2px 거리 축소 |
| `disabled` | 색은 그대로 두고 누르기만 막습니다 — 고른 칸은 고리를 `stroke-neutral-solid` 로 남깁니다 |

[그림: 상태 — 기본 · 포커스 · 누름 · 막힘 × 안 고름 · 고름](../../site/components/specs/color-swatch.tsx#states)

[표: 상태 — 안 고름](color-swatch.yaml#matrix)

[표: 상태 — 고름](color-swatch.yaml#matrix.selected.selected)

[표: 모션](color-swatch.yaml#motion)

## Guidelines

### 새 항목은 쓰지 않은 첫 색

새 카테고리 · 태그 · 라벨 · 저축 목표는 같은 목록이 아직 쓰지 않은 첫 색을 골라 두고 시작합니다 — 차트 배정 순서(파랑 → 초록 → 주황 → 보라 → 분홍 → 남색 → 빨강 → 노랑 → 갈색)이고 회색은 "기타" 전용이라 주지 않습니다. 아홉 색을 모두 쓰고 있으면 파랑부터 다시 줍니다(Chart 의 배정과 같습니다). 늘 빨강으로 시작하지 않습니다 — 기본 지출 카테고리 여덟이 이미 여덟 색을 쓰고 식비가 빨강이라, 아홉 번째가 식비와 같은 색이 되기 때문입니다. 색을 꼭 고르게 하지 않습니다 — 고르지 않아도 첫 색으로 저장됩니다.

[그림: 기본 카테고리 여덟 + 아홉 번째 — 쓰지 않은 갈색으로 시작 · 늘 빨강](../../site/components/specs/color-swatch.tsx#new-guide)

### 고르지 않으면 바꾸지 않습니다

고치기 화면은 저장된 색을 고른 채 엽니다. 저장된 색이 팔레트 밖 · 없음이면 지금 색 칸이 골라져 있습니다 — 이름만 고쳐 저장해도 색은 그대로입니다. 저장된 hex 는 이름표입니다 — 웹 · 앱은 짝 표로 저장 값 ↔ 색 이름을 잇고(DESIGN.md "저장된 색은 옮기지 않는다"), 칸은 그 색 이름의 차트 색을 그립니다.

[그림: 가져온 분류(#9E9E9E) 고치기 — 지금 색이 골라져 있습니다 · 몰래 빨강](../../site/components/specs/color-swatch.tsx#edit-guide)

### 칸마다 색 이름

칸의 이름은 색 이름입니다 — 빨강 · 주황 · 노랑 · 초록 · 파랑 · 남색 · 보라 · 분홍 · 갈색 · 회색. "색상 1" · "#c73838" 을 이름으로 두지 않습니다. 묶음의 이름은 칸 이름(Field 라벨 "색상")입니다 — 폼이 줄 칸이면(색 줄 → 고르기 시트 · 팝오버) 줄 제목 "색상" 이 이름입니다. 줄 제목은 어느 폼이든 "색상" 한 벌입니다(저축 목표 · 메모 · 캘린더의 색 줄도 같습니다). 칸 아래에 이름 글을 늘어놓지는 않습니다 — 보조 기술과 마우스 툴팁이 읽습니다.

### 다른 컴포넌트와 나누기

| 이런 자리 | 쓰는 것 |
|---|---|
| 항목에 붙일 색을 고른다(카테고리 · 태그 · 라벨 · 캘린더 · 저축 목표 · 메모) | **Color Swatch** |
| 이름이 붙은 2 ~ 4개를 고른다 | [Chip](chip.md) |
| 이름이 붙은 5개 이상 | [Select](select.md) |
| 색을 보이기만 한다(범례 · 줄 앞 점) | 차트 색 점 · [List](list.md) 의 타일 |

## 코드

레시피 `recipes/shadcn/components/ui/color-swatch.tsx` 를 [Field](field.md) 안에 둡니다. 색 이름(`ChartColor` — `"red"` … `"gray"`)은 Chart 레시피의 것을 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ColorSwatchGroup` — 묶음(radiogroup · 5 × 2). `value` · `defaultValue`(`ChartColor` 또는 `"current"` — 지금 색 칸, `null` 이면 고른 칸 없음) · `onValueChange(value)` · `currentColor`(팔레트 밖 저장 색 hex — 주면 "지금 색" 칸) · `autoColor`(색 없는 항목에 차트가 줄 `ChartColor` — 주면 "자동" 칸) · `disabled` · `aria-label`(Field 밖에서만). Field 안이면 라벨이 묶음 이름, 설명 · 오류가 설명이 됩니다(Field 의 `useFieldGroup`). 칸 이름 · 차례 · 2차원 화살표는 스스로 그립니다.
- `firstUnusedColor(used)` — 차트 배정 순서에서 `used` 에 없는 첫 색입니다. 아홉 색을 다 쓰면 파랑부터 주고, 회색은 주지 않습니다.
- `COLOR_NAMES` — 색 이름(`{ red: "빨강", … }`)입니다. `COLOR_SWATCH_ORDER` — 색상환 차례입니다.

### 새 카테고리 — 쓰지 않은 첫 색

[그림: 카테고리 추가 — 갈색이 골라진 채 열립니다](../../site/components/specs/color-swatch.tsx#ex-new)

```tsx
import { useState } from "react"
import type { ChartColor } from "@/components/ui/chart"
import { ColorSwatchGroup, firstUnusedColor } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

// 같은 목록이 쓰지 않은 첫 색으로 시작한다 — 늘 빨강이 아니다
const [color, setColor] = useState<ChartColor | "current">(() => firstUnusedColor(usedColors))

<Field label="색상">
  <ColorSwatchGroup value={color} onValueChange={setColor} />
</Field>
```

### 고치기 — 팔레트 밖 색

[그림: 가져온 분류 고치기 — "지금 색" 이 골라져 있고 격자에서 고르면 바뀝니다](../../site/components/specs/color-swatch.tsx#ex-edit)

```tsx
import { ColorSwatchGroup } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

<Field label="색상">
  {/* 고르지 않고 저장하면 "current" — 저장 값(#9E9E9E)을 그대로 둔다 */}
  <ColorSwatchGroup value={picked} onValueChange={setPicked} currentColor="#9E9E9E" />
</Field>
```

### 색 없는 항목 — 자동

[그림: 색 없는 구독 고치기 — "자동"(점선 갈색) 이 골라져 있습니다](../../site/components/specs/color-swatch.tsx#ex-auto)

```tsx
import { ColorSwatchGroup } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

<Field label="색상">
  <ColorSwatchGroup value={picked} onValueChange={setPicked} autoColor={chartColorOf(item.id)} />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click · Tap | 그 칸을 고릅니다 — 고리 + 체크가 옮겨 갑니다. 고른 칸을 다시 눌러도 그대로입니다(라디오) |
| `Tab` | 묶음에 한 번 — 고른 칸(없으면 첫 칸)에 섭니다 |
| `←` `→` | 차례대로 옮기며 고릅니다 — 줄 끝에서 다음 줄로, 지금 색 칸은 차례의 맨 앞(RTL 은 반대) |
| `↑` `↓` | 위아래 줄의 같은 칸으로 옮기며 고릅니다 |
| `Home` · `End` | 받지 않습니다 — 초점도 고른 칸도 그대로, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도). 끝 칸으로는 화살표로 갑니다(← 는 끝에서 처음으로 돕니다) — 하나 고르기 묶음은 화살표만 씁니다(네이티브 라디오 · APG 와 같습니다) |
| `Space` | 초점의 칸을 고릅니다 |
| 저장 | 고른 색 이름을 저장 값으로(짝 표) — "current" 면 저장 값을 그대로 둡니다 |
| Disabled | 누르기 · 키보드 불가 — 색은 그대로 보입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 칸 흰 표면 위 4.55(노랑) ~ 5.50 · 다크 표면 6.07 ~ 7.70(시트 5.26 ~ 6.67) ✓. 고른 고리 `stroke-neutral-contrast` 16.41 · 13.42(시트 11.62) ✓. 체크 칸 위 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. 지금 색 칸의 저장 색은 대비를 보장하지 못하므로 이름("지금 색")과 아래 글이 알립니다 |
| **WCAG 1.4.1** Use of color | 고름은 색이 아니라 고리 · 체크로 알립니다 · 칸마다 색 이름 ✓ |
| **WCAG 2.1.1** Keyboard | 묶음에 `Tab` 하나 · 2차원 화살표 · `Space` ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 고리 바깥 링 2px(띄움 6) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역 44 × 44 ✓ — 칸 사이 12 라 이웃과 겹치지 않습니다 |
| **ARIA** | 묶음 `role="radiogroup"` + 이름(Field 라벨 — `aria-labelledby`), 칸 `role="radio"` · `aria-checked` · 이름 = 색 이름("빨강") · 지금 색 칸 "지금 색" · "자동". 고른 칸만 `tabindex="0"` 입니다. 앱은 칸마다 `Semantics(inMutuallyExclusiveGroup: true, checked: …, label: "빨강")` + 키보드 포커스, 묶음 노드는 `Semantics(role: SemanticsRole.radioGroup, label: Field 라벨)` — 이름은 라벨("색상")만입니다. 칸의 툴팁(색 이름)은 칸의 의미 노드 안에 두거나 의미에서 뺍니다 — 칸 이름이 이미 색 이름이고, 툴팁이 칸 밖에 있으면 첫 칸의 "빨강" 이 묶음 이름에 붙어 고른 색과 상관없이 "색상, 빨강" 으로 읽히기 때문입니다 |

## Do / Don't

### ✅ Do

- 차트 10색을 원 40 칸에 진하게 칠해 5 × 2 · 색상환 차례로 둡니다.
- 고른 칸은 고리 + 체크로 알리고, 체크는 다크에서 짙은 글자 색입니다.
- 새 항목은 쓰지 않은 첫 색으로 시작합니다.
- 팔레트 밖 · 색 없는 항목은 "지금 색" · "자동" 칸으로 보이고, 고르지 않으면 그대로 둡니다.
- 칸마다 색 이름을 달고, 묶음 이름은 Field 라벨입니다.

### ❌ Don't

- 옅게 섞은 칸 · 옅은 바탕 칸.
- 폭을 나눈 네모 · 44 둥근 네모 · 줄바꿈으로 차례가 바뀌는 격자.
- 새 항목을 늘 빨강으로 · 고치면 몰래 빨강으로 저장.
- 색을 꼭 고르게 하기.
- "색상 N" · hex 를 칸 이름으로.
- 다크에서 흰 체크.

## Specification

`color-swatch.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Color Swatch 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — color-swatch.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#color-swatch)
