# Color Swatch

> 카테고리 · 태그 · 라벨 · 저축 목표 · 캘린더에 붙일 색을 고르는 묶음 — 차트 10색을 원 칸에 진하게 칠해 5 × 2 로 늘어놓고 하나를 고른다. 고른 색은 그 항목의 차트 · 타일 · 점에 그대로 칠해진다. 이름이 붙은 선택지를 고르는 것은 [Chip](chip.md) · [Select](select.md) 다.

SEED 에는 색을 고르는 부품이 없다 — 사용자가 색을 정하는 화면이 SEED 문서에 나오지 않고, "색상 선택" 은 글자 칩(Chip Group "사이즈/색상 선택")과 색 점 12 + 이름(Wheel Picker 예 — 항목마다 `ariaLabel`)뿐이다(당근 SEED, Apache-2.0). 그래서 칸의 칠 · 크기 · 고른 표시 · 키보드 · 새 항목의 첫 색은 porest 가 정했다(2026-10-09 사용자 결정) — 색은 v110 차트 10색, 고른 고리는 [Select Box](select-box.md) 의 짙은 테두리(v113)와 같은 색이다. 옛 Color Swatch 스펙(폭을 나눈 정사각 칸 · `currentColor` 테두리 · 마우스 1.05배)을 대신한다.

수치 원본은 [`color-swatch.yaml`](color-swatch.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카테고리 추가 — 색상 5 × 2(데스크톱 대화상자 · 폰 시트), 라이트 · 다크](../../site/components/specs/color-swatch.tsx#hero)

### 직접 골라 보기

고른 색 · 지금 색 칸(없음 · 팔레트 밖 · 색 없음) · 막힘을 고르면 스펙대로 그린 묶음과 그 코드가 바뀐다. 칸을 누르거나, 칸에 초점을 두고 ← → ↑ ↓ 로 옮겨 볼 수 있다 — 화면 읽기 프로그램이 읽는 말("빨강, 라디오, 1/10")이 함께 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/color-swatch.tsx#playground)

## Anatomy

[그림: 묶음은 색 칸 10 · 고른 고리 · 체크로 이뤄지고, 고칠 때는 앞에 지금 색 칸을 둔다](../../site/components/specs/color-swatch.tsx#anatomy)

| ⓐ Group | 묶음 — 5 × 2 격자, 이름은 [Field](field.md) 라벨("색상"). |
| ⓑ Swatch | 색 칸 — 원 40 · 누르는 44, 차트 색으로 채운다. 이름은 색 이름("빨강"). |
| ⓒ Check | 체크 16 — 고른 칸 가운데, 라이트 흰 · 다크 짙은 글자. |
| ⓓ Ring | 고른 고리 — 칸 바깥 2 띄운 2px 짙은 선. |
| ⓔ Current | 지금 색 칸 — 팔레트 밖 색("지금 색") · 색 없음("자동"). 고칠 때만, 격자 앞. |

[표: 부위](color-swatch.yaml#slots)

## Properties

### 색 — 차트 색 그대로 진하게

칸은 v110 차트 색(라이트 700 · 다크 800-dark)으로 꽉 채운다 — 칸이 곧 그 항목의 차트 · 아이콘 · 점에 칠해질 색이다(사용자 결정 12C). 옅게 섞은 칸 · v111 옅은 바탕 칸은 쓰지 않는다 — 옅은 칸끼리는 서로 거의 같아(지금 웹 OKLab ΔE 0.012) 남색 · 보라 · 분홍이 헷갈린다. 진한 칸끼리는 가장 가까운 짝도 또렷하고, 흰 표면과 4.55 이상 · 다크 표면과 6.07 이상이다. 웹 · 앱이 같은 v110 색을 쓴다.

[그림: 10색 — 라이트 700 · 다크 800-dark, 칸마다 이름 · 대비](../../site/components/specs/color-swatch.tsx#colors)

[표: 색](color-swatch.yaml#color)

### 크기 · 배치

칸은 원 40(누르는 44)이고 폭과 상관없이 5개씩 두 줄 · 사이 12 다 — 데스크톱 대화상자에서도 폰 시트에서도 같은 크기 · 같은 줄이다(사용자 결정 13B). 차례는 색상환(빨강 → 주황 → 노랑 → 초록 → 파랑 → 남색 → 보라 → 분홍 → 갈색 → 회색)이라 ↑ ↓ 가 늘 같은 칸으로 간다. 폭을 나눈 네모(지금 88.8 · 62)는 쓰지 않는다.

[그림: 원 40 · 5 × 2 · 사이 12 — 데스크톱 476 · 폰 342 에서 같다](../../site/components/specs/color-swatch.tsx#size)

[표: 묶음](color-swatch.yaml#base.enabled@group)

[표: 색 칸](color-swatch.yaml#base.enabled@swatch)

### 고른 표시

고른 칸은 바깥 2 를 띄운 2px 짙은 고리(`stroke-neutral-contrast` — Select Box 의 고른 테두리와 같은 색) + 가운데 체크 16(선 2.5)이다(사용자 결정 13B). 체크는 `fg-neutral-inverted` 라 라이트는 흰색, 다크는 짙은 글자다 — 다크 800-dark 칸 위 흰 체크는 1.88 ~ 2.39 라 읽히지 않는다(아바타 이니셜과 같은 규칙). 칸 위 체크는 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70 이다. 색과 함께 고리 · 체크 모양으로도 알린다.

[그림: 고른 칸 — 고리(띄움 2 · 2px) + 체크, 라이트 흰 · 다크 짙은 체크](../../site/components/specs/color-swatch.tsx#selected)

[표: 체크](color-swatch.yaml#base.enabled@check)

[표: 고리](color-swatch.yaml#base.enabled@ring)

### 지금 색 · 자동

고치는 항목의 색이 팔레트 밖이거나(가져오기가 만드는 #9E9E9E) 색이 없으면 격자 앞에 칸 하나를 따로 둔다 — 세로 선으로 격자와 가르고, 처음에는 그 칸이 골라져 있다(사용자 결정 14B). 칸 · 선 · 격자를 합친 폭은 321 이라, 그보다 좁은 자리(360 폰 본문 312)에서는 그 칸을 격자 위 줄에 두고 가로 선으로 가른다 — 390 폰 · 대화상자는 옆으로 둔다.

- **지금 색** — 팔레트 밖의 저장된 색을 그대로 칠한다(두 모드 같은 값). 체크는 흰색 · 짙은 글자 가운데 그 색 위 대비가 큰 쪽이다.
- **자동** — 색이 없는 항목이다. 차트가 그 항목에 줄 색(아직 쓰지 않은 색 — 데이터 결정 9A)을 점선 원으로 보인다.

격자에서 색을 고르면 그 색으로 바뀌고, 지금 색 칸을 다시 고르면 저장 값을 그대로 둔다. 아무것도 고르지 않고 저장하면 색은 바뀌지 않는다 — 몰래 빨강으로 바꾸지 않는다.

[그림: 지금 색(#9E9E9E) · 자동(점선) — 격자 앞 칸 + 세로 선](../../site/components/specs/color-swatch.tsx#current)

[표: 지금 색 칸](color-swatch.yaml#current)

[표: 지금 색 칸 아래 글](color-swatch.yaml#base.enabled@currentLabel)

[표: 세로 선](color-swatch.yaml#base.enabled@divider)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 색 그대로 |
| `hovered` | 웹 — 바뀌지 않는다(칸의 색이 곧 값이다). 커서만 pointer |
| `focused` | 키보드 포커스에만 고리 바깥 링 2px(띄움 6) |
| `pressed` | 칸 2px 거리 축소(v104) |
| `disabled` | 색은 그대로 두고 누르기만 막는다 — 고른 칸은 고리를 `stroke-neutral-solid` 로 남긴다 |

[그림: 상태 — 기본 · 포커스 · 누름 · 막힘 × 안 고름 · 고름](../../site/components/specs/color-swatch.tsx#states)

[표: 상태 — 안 고름](color-swatch.yaml#matrix)

[표: 상태 — 고름](color-swatch.yaml#matrix.selected.selected)

[표: 모션](color-swatch.yaml#motion)

## Guidelines

### 새 항목은 쓰지 않은 첫 색

새 카테고리 · 태그 · 라벨 · 저축 목표는 같은 목록이 아직 쓰지 않은 첫 색을 골라 두고 시작한다 — v110 배정 순서(파랑 → 초록 → 주황 → 보라 → 분홍 → 남색 → 빨강 → 노랑 → 갈색)이고 회색은 "기타" 전용이라 주지 않는다. 아홉 색을 모두 쓰고 있으면 파랑부터 다시 준다(Chart 의 배정과 같다). 늘 빨강으로 시작하지 않는다 — 기본 지출 카테고리 여덟이 이미 여덟 색을 쓰고 식비가 빨강이라, 아홉 번째가 식비와 같은 색이 된다(사용자 결정 14B — 데이터 결정 9A 를 새 항목에도). 색을 꼭 고르게 하지 않는다 — 고르지 않아도 첫 색으로 저장된다.

[그림: 기본 카테고리 여덟 + 아홉 번째 — 쓰지 않은 갈색으로 시작 · 늘 빨강](../../site/components/specs/color-swatch.tsx#new-guide)

### 고르지 않으면 바꾸지 않는다

고치기 화면은 저장된 색을 고른 채 연다. 저장된 색이 팔레트 밖 · 없음이면 지금 색 칸이 골라져 있다 — 이름만 고쳐 저장해도 색은 그대로다. 저장된 옛 hex 는 이름표다 — 웹 · 앱은 짝 표로 저장 값 ↔ 색 이름을 잇고(DESIGN.md v110 "저장된 색은 옮기지 않는다"), 칸은 그 색 이름의 v110 색을 그린다.

[그림: 가져온 분류(#9E9E9E) 고치기 — 지금 색이 골라져 있다 · 몰래 빨강](../../site/components/specs/color-swatch.tsx#edit-guide)

### 칸마다 색 이름

칸의 이름은 색 이름이다 — 빨강 · 주황 · 노랑 · 초록 · 파랑 · 남색 · 보라 · 분홍 · 갈색 · 회색. "색상 1" · "#c73838" 을 이름으로 두지 않는다. 묶음의 이름은 칸 이름(Field 라벨 "색상")이다. 칸 아래에 이름 글을 늘어놓지는 않는다 — 보조 기술과 마우스 툴팁이 읽는다.

### 다른 컴포넌트와 나누기

| 이런 자리 | 쓰는 것 |
|---|---|
| 항목에 붙일 색을 고른다(카테고리 · 태그 · 라벨 · 캘린더 · 저축 목표 · 메모) | **Color Swatch** |
| 이름이 붙은 2 ~ 4개를 고른다 | [Chip](chip.md) |
| 이름이 붙은 5개 이상 | [Select](select.md) |
| 색을 보이기만 한다(범례 · 줄 앞 점) | 차트 색 점 · [List](list.md) 의 타일 |

## 코드

레시피 `recipes/shadcn/components/ui/color-swatch.tsx` 를 [Field](field.md) 안에 둔다. 색 이름(`ChartColor` — `"red"` … `"gray"`)은 Chart 레시피의 것을 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ColorSwatchGroup` — 묶음(radiogroup · 5 × 2). `value` · `defaultValue`(`ChartColor` 또는 `"current"` — 지금 색 칸, `null` 이면 고른 칸 없음) · `onValueChange(value)` · `currentColor`(팔레트 밖 저장 색 hex — 주면 "지금 색" 칸) · `autoColor`(색 없는 항목에 차트가 줄 `ChartColor` — 주면 "자동" 칸) · `disabled` · `aria-label`(Field 밖에서만). Field 안이면 라벨이 묶음 이름, 설명 · 오류가 설명이 된다(Field 의 `useFieldGroup`). 칸 이름 · 차례 · 2차원 화살표는 스스로 그린다.
- `firstUnusedColor(used)` — v110 배정 순서에서 `used` 에 없는 첫 색. 아홉 색을 다 쓰면 파랑부터, 회색은 주지 않는다.
- `COLOR_NAMES` — 색 이름(`{ red: "빨강", … }`), `COLOR_SWATCH_ORDER` — 색상환 차례.

### 새 카테고리 — 쓰지 않은 첫 색

[그림: 카테고리 추가 — 갈색이 골라진 채 열린다](../../site/components/specs/color-swatch.tsx#ex-new)

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

[그림: 가져온 분류 고치기 — "지금 색" 이 골라져 있고 격자에서 고르면 바뀐다](../../site/components/specs/color-swatch.tsx#ex-edit)

```tsx
import { ColorSwatchGroup } from "@/components/ui/color-swatch"
import { Field } from "@/components/ui/field"

<Field label="색상">
  {/* 고르지 않고 저장하면 "current" — 저장 값(#9E9E9E)을 그대로 둔다 */}
  <ColorSwatchGroup value={picked} onValueChange={setPicked} currentColor="#9E9E9E" />
</Field>
```

### 색 없는 항목 — 자동

[그림: 색 없는 구독 고치기 — "자동"(점선 갈색) 이 골라져 있다](../../site/components/specs/color-swatch.tsx#ex-auto)

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
| Click · Tap | 그 칸을 고른다 — 고리 + 체크가 옮겨 간다. 고른 칸을 다시 눌러도 그대로다(라디오) |
| `Tab` | 묶음에 한 번 — 고른 칸(없으면 첫 칸)에 선다 |
| `←` `→` | 차례대로 옮기며 고른다 — 줄 끝에서 다음 줄로, 지금 색 칸은 차례의 맨 앞(RTL 은 반대) |
| `↑` `↓` | 위아래 줄의 같은 칸으로 옮기며 고른다 |
| `Home` · `End` | 첫 칸 · 마지막 칸 |
| `Space` | 초점의 칸을 고른다 |
| 저장 | 고른 색 이름을 저장 값으로(짝 표) — "current" 면 저장 값을 그대로 둔다 |
| Disabled | 누르기 · 키보드 불가 — 색은 그대로 보인다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 칸 흰 표면 위 4.55(노랑) ~ 5.50 · 다크 표면 6.07 ~ 7.70(시트 5.26 ~ 6.67) ✓. 고른 고리 `stroke-neutral-contrast` 16.41 · 13.42(시트 11.62) ✓. 체크 칸 위 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 지금 색 칸의 저장 색은 대비를 보장하지 못한다 — 이름("지금 색")과 아래 글이 알린다 |
| **WCAG 1.4.1** Use of color | 고름은 색이 아니라 고리 · 체크로 알린다 · 칸마다 색 이름 ✓ |
| **WCAG 2.1.1** Keyboard | 묶음에 `Tab` 하나 · 2차원 화살표 · `Space` ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 고리 바깥 링 2px(띄움 6) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 영역 44 × 44 ✓ — 칸 사이 12 라 이웃과 겹치지 않는다 |
| **ARIA** | 묶음 `role="radiogroup"` + 이름(Field 라벨 — `aria-labelledby`), 칸 `role="radio"` · `aria-checked` · 이름 = 색 이름("빨강") · 지금 색 칸 "지금 색" · "자동". 고른 칸만 `tabindex="0"`. 앱은 칸마다 `Semantics(inMutuallyExclusiveGroup: true, checked: …, label: "빨강")` + 키보드 포커스 |

## Do / Don't

### ✅ Do

- 차트 10색을 원 40 칸에 진하게 칠해 5 × 2 · 색상환 차례로.
- 고른 칸은 고리 + 체크 — 체크는 다크에서 짙은 글자.
- 새 항목은 쓰지 않은 첫 색으로 시작한다.
- 팔레트 밖 · 색 없는 항목은 "지금 색" · "자동" 칸으로 — 고르지 않으면 그대로.
- 칸마다 색 이름, 묶음 이름은 Field 라벨.

### ❌ Don't

- 옅게 섞은 칸 · 옅은 바탕 칸.
- 폭을 나눈 네모 · 44 둥근 네모 · 줄바꿈으로 차례가 바뀌는 격자.
- 새 항목을 늘 빨강으로 · 고치면 몰래 빨강으로 저장.
- 색을 꼭 고르게 하기.
- "색상 N" · hex 를 칸 이름으로.
- 다크에서 흰 체크.

## Specification

`color-swatch.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Color Swatch 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — color-swatch.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#color-swatch)

## SEED 와 다른 점

- **porest 가 정한 컴포넌트다** — SEED 에는 색 고르기 부품 · 화면이 없다. SEED 가 가진 가장 가까운 것은 Wheel Picker 예의 "색 점 12 + 이름" 이고, 칸마다 이름을 다는 것만 같다.
- **2차원 화살표** — SEED 는 격자 고르기의 키보드 규칙이 없다(SEED 문서 사이트의 팔레트 칸은 칸마다 Tab 이다). porest 는 radiogroup 에 위아래 줄 이동을 더했다.
- **색은 v110 차트 10색** — SEED 팔레트는 사용자가 고르는 색 세트를 두지 않는다.

## Migration notes

### 2026-10-09 — 진한 원 칸 · 지금 색 칸으로 다시 쓴다

사용자가 [입력 비교 페이지](https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj)에서 정했다 — 칸은 진한 색(12C — v110 700 · 다크 800-dark, 체크는 라이트 흰 · 다크 `fg-neutral-inverted`), 원 40(누르는 44) · 5 × 2 고정 · 고르면 2px 짙은 고리(띄움 2) + 체크 · ↑ ↓ 는 위아래 줄(13B), 새 항목은 쓰지 않은 첫 색 · 편집은 고르지 않으면 바꾸지 않고 팔레트 밖 색은 "지금 색" 칸(14B). 그리고 "따라오는 것" — 색 이름 · 색상환 차례 5 × 2 · radiogroup 2차원 화살표 · 웹 · 앱 같은 v110 색 · HR 부서 색은 HR 적용 때. 옅게 섞기(12A) · v111 weak(12B) · 폭 나누기 네모(13A) · 44 둥근 네모(13C) · 늘 빨강(14A)은 고르지 않았고, 색 필수는 데이터 결정(9C)에서 고르지 않았다. 옛 스펙은 `color-swatch.history/v-pre-seed-input.*` 에 남겼다.

| 옛 Color Swatch | 새 Color Swatch |
|---|---|
| 정사각 칸 · 폭 ÷ N(5 ~ 10열) · 모서리 `radius-tile` 12 · 사이 8 | 원 40 · 늘 5 × 2 · 사이 12 |
| 칸 = 팔레트 literal(`--swatch-bg`) — 제품은 18% 섞은 옅은 칸 | v110 차트 색 그대로(700 · 800-dark) |
| 고름 = 2px `currentColor` 테두리 + 흰 체크(선 2.6) | 띄움 2 · 2px `stroke-neutral-contrast` 고리 + 체크 16(선 2.5, `fg-neutral-inverted`) |
| 마우스 1.05배 · 막힘 불투명도 0.5 | 확대 없음 · 누름 2px 축소 · 막힘은 색 그대로 + 회색 고리 |
| 크기 sm · md · lg(체크 12 · 14 · 16) | 크기 하나 |
| Tab 으로 칸 사이 이동 | radiogroup — Tab 하나 · 2차원 화살표 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트 · 코드로, HR 은 코드 · 계산으로 봤다). 색 고르기는 웹 8곳(7파일 — `shared/ui/color-swatch.tsx` 의 `ColorSwatchGroup`) · 앱 8곳(`shared/widgets/p_color_picker.dart` 의 `PColorPicker`) · HR 1곳이다.

- **웹 자리** — 카테고리(`widgets/category-manage/ui/CategoryEditDialog.tsx:305-315`) · 저축 목표(`widgets/asset-full/ui/SavingGoalAddDialog.tsx:432-442`) · 캘린더 라벨(`widgets/calendar-manage/ui/CalendarLabelsSection.tsx:523-532`) · 할 일 태그(`widgets/calendar-manage/ui/TodoTagManager.tsx:523-532`) · 메모 태그(`widgets/memo-manage/ui/MemoTagManager.tsx:529-538`) · 메모 색(`pages/memo/ui/MemoPage.tsx:1178-1188`) · 공유 캘린더 둘(`CalendarShareSection.tsx:680-689 · 955-964`).
- **앱 자리** — 카테고리(`features/category/presentation/category_edit_dialog.dart:469`) · 저축 목표(`features/saving_goal/presentation/saving_goal_edit_dialog.dart:308`) · 메모(`features/memo/presentation/memo_edit_dialog.dart:256`) · 할 일 태그(`features/todo/presentation/todo_tag_management_screen.dart:585`) · 메모 태그(`memo_tag_management_screen.dart:589`) · 캘린더 라벨 · 공유(`features/calendar/presentation/calendar_labels_screen.dart:536` · `calendar_share_screen.dart:499 · 785`).
- **옅은 칸** — 웹은 `color-mix(… 18%, transparent)`(`shared/lib/porest/chart-palette.ts:147-151`)라 칸이 대화상자와 1.25 ~ 1.34 이고 칸끼리 OKLab ΔE 가 최소 0.012(남색 · 보라) · 가운데 0.033 이다. 체크 14 는 칸 위 3.63 ~ 4.32. 앱은 13 · 22% 에 옛 상수 색이라 더 옅다(최소 0.006 — `core/format/chart_palette.dart:141-150`, D17). 칸은 데스크톱 88.8 · 폰 62 로 폭을 나눈다.
- **몰래 빨강** — 색이 없거나 팔레트 밖(가져오기의 #9E9E9E — `porest-desk-back` `ImportServiceImpl.java:71`)인 카테고리 · 목표 · 라벨 · 태그를 열면 빨강이 골라져 있고, 이름만 고쳐 저장해도 `#c73838` 이 나간다(웹 `CategoryEditDialog.tsx:74-78 · 114-126` · `CalendarLabelsSection.tsx:404-408` · `TodoTagManager.tsx:405-409` · `MemoTagManager.tsx:411-415`, 앱 `category_edit_dialog.dart:91-96` "첫 색으로 정규화" · `saving_goal_edit_dialog.dart:103-106`, D6). 앱 태그 · 라벨은 팔레트 밖 색을 그대로 두되 어느 칸도 고르지 않아(`todo_tag_management_screen.dart:447-450`) 웹과 다르다. 지금 색 칸으로.
- **새 항목은 늘 빨강** — 웹 · 앱 카테고리 · 목표 · 라벨 · 태그(`CategoryEditDialog.tsx:75` · `SavingGoalAddDialog.tsx:91-93` · `category_edit_dialog.dart:94-96`, D18), 메모 · 캘린더는 파랑(`MemoPage.tsx:73` · `CalendarShareSection.tsx:897`). 서버가 심는 기본 지출 카테고리 여덟이 이미 여덟 색을 쓰고 식비가 빨강이다(`ExpenseCategoryServiceImpl.java:196-208`) — `firstUnusedColor` 로.
- **이름 · 키보드** — 웹 칸 이름이 "색상 1 ~ 10"(5곳) · "색상 #c73838"(메모) · "#c73838"(캘린더 둘)이고 묶음 이름 0/8 · 첫 → 는 초점만 옮기고 ↓ 는 다음 칸으로 간다(`color-swatch.tsx:55`, D24). 앱 칸은 `GestureDetector` 라 이름 · 고른 상태 · 키보드 초점이 0 이다(`p_color_picker.dart:47-63`, D7).
- **HR 부서 색** — 부서 폼의 색이 Select(없음 + `chart-1` ~ `chart-5` · 점 16 + "파란색 · 녹색 · 노란색 · 보라색 · 빨간색")이고 토큰 이름을 저장한다(`features/admin-company/ui/DepartmentFormDialog.tsx:213-262` · 조직도 띠 `DepartmentChartPanel.tsx:29-56`). "노란색" 이 실제 주황(#E88C30)이고 점이 흰 바탕 2.52 · 2.55 다(D25). HR 적용 때 같은 10색 · 이 묶음으로 옮긴다.
- **일정 색 칸** — 2026-09-25 에 걷었다(일정 색 = 캘린더 색 — `EventForm.tsx:268-269`).

### 이전 기록

- **2026-05 — 처음 둠.** desk-front `CategoryEditDialog` 의 "색상" 격자에서 끌어올렸다(정사각 칸 · `currentColor` 테두리 · 흰 체크 · 마우스 1.05배). 이번에 모두 바뀌었다.
