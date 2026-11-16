# Scroll Fog

> 스크롤되는 영역의 끝을 흐려 뒤에 더 있다는 것을 알리는 마스크입니다. 가로로 넘기는 칩 줄, 시트 · 대화상자의 긴 본문, 바닥 고정 버튼이 있는 긴 화면에 씁니다. 색을 덮는 막이 아니라 투명도 마스크라 어느 바탕에서도 맞고, 스크롤 위치와 상관없이 늘 켜져 있습니다.

스크롤 상자에 마스크(`gradient-fade-mask` 16단계)를 걸고, 기본 깊이는 20, 흐린 쪽에는 그 깊이만큼 여백을 두며, 늘 켜 둡니다.

수치 원본은 [`scroll-fog.yaml`](scroll-fog.yaml)입니다.

[그림: 칩 필터 줄 · 카테고리 고르기 시트 — 라이트 · 다크](../../site/components/specs/scroll-fog.tsx#hero)

### 직접 골라 보기

자리(가로 줄 · 시트 본문 · 바닥 버튼 화면 · 상자) · 바탕 색을 고르고 스크롤하면 스펙대로 그린 흐림과 그 코드가 바뀝니다. 처음 · 가운데 · 끝 어디서나 흐림이 그대로인 것을 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/scroll-fog.tsx#playground)

## Anatomy

[그림: 스크롤 상자 · 흐림(깊이) · 여백 — 처음 · 끝에서는 흐림이 빈 여백 위에 놓입니다](../../site/components/specs/scroll-fog.tsx#anatomy)

| ⓐ Scroll Area | 스크롤 상자 — 넘친 내용이 이 안에서 스크롤됩니다. 마스크를 이 상자에 겁니다. 스크롤바 · 초점 · 이름 규칙은 [Scroll Area](scroll-area.md) 를 따릅니다. |
| ⓑ Fog | 흐림 — 정한 쪽 가장자리에서 깊이만큼 투명에서 불투명으로 바뀝니다. |
| ⓒ Padding | 여백 — 흐린 쪽에 깊이 이상 둡니다. |

[표: 부위](scroll-fog.yaml#slots)

## Properties

### 마스크 — 색이 아닙니다

`gradient-fade-mask`(알파 0 → 1, 16단계)를 스크롤 상자에 `mask-image` 로 겁니다. 흐린 쪽마다 상자 전체 크기의 층 하나에 방향을 붙이고(단계는 그 쪽 깊이에 맞춰 깊이 안에서 불투명에 닿습니다), 겹친 층을 곱합니다(`mask-composite: intersect`). 상자가 두 깊이의 합보다 낮아도 양 끝이 함께 흐립니다. 바탕색을 덧칠하지 않으므로 흰 면 · 회색 바탕 · 다크 어디서나 같은 값입니다. 내용이 흐려질 뿐 그 위에 무엇을 얹지 않아, 흐린 자리의 칩 · 줄도 그대로 눌립니다.

[그림: 같은 흐림이 흰 면 · 회색 바탕 · 다크에서 — 색 막(바탕색 그라디언트)은 바탕이 바뀌면 띠가 보입니다](../../site/components/specs/scroll-fog.tsx#mask)

[표: 공통](scroll-fog.yaml#base)

### Use — 자리마다 방향 · 깊이

| 자리 | `use` | 방향 | 깊이 · 여백 |
|---|---|---|---|
| 칩 필터 바 · 제안 칩 줄 · [Chip Tabs](tabs.md) · 가로 카드 줄 | `row` | 좌 · 우 | 흐림 20 · 여백은 화면 여백 24 |
| 시트 · 대화상자 · 팝오버 · [Side Panel](side-panel.md) 의 넘칠 수 있는 본문 | `overlayBody` | 위 · 아래 | 위 20 · 아래 80 |
| 바닥 고정 버튼이 있는 화면 전체 스크롤 | `page` | 위 · 아래 | 위 20 · 아래 80 — 바닥 버튼 위에서 끝난다 |
| 카드 · 상자 안의 높이를 정한 스크롤 | `box` *(기본)* | 넘치는 방향의 양 끝 | 20 |

가로 스크롤은 좌우 20 입니다 — 정보가 촘촘해 깊게 흐리지 않습니다. 세로 스크롤은 위 20 · 아래 80 입니다 — 아래가 깊어야 더 있다는 것이 잘 보입니다. 그 밖은 최소 20 입니다.

깊이는 자리마다 정해 두고, 영역 크기의 비율로 정하지 않습니다. 자리마다 정한 깊이가 웹 · 앱을 같은 값으로 묶고, 비율로 정하면 같은 자리도 상자 높이에 따라 깊이가 달라지기 때문입니다. 가로 줄의 여백은 화면 여백 24 라 흐림 20 보다 넓어, 처음 · 끝 칩은 흐리지 않습니다.

[그림: 자리마다 — 칩 줄 좌우 20 · 시트 본문 위 20 아래 80 · 바닥 버튼 화면 · 상자 20](../../site/components/specs/scroll-fog.tsx#uses)

[표: 자리](scroll-fog.yaml#use)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 늘 켜짐 — 스크롤 위치 · 넘침과 상관없이 |

## Guidelines

### 늘 켜 둡니다

스크롤을 시작하고 멈출 때마다 흐림이 나타났다 사라지면 화면이 깜빡입니다. 그래서 흐림은 스크롤 위치 · 넘침을 재지 않고 늘 켜 둡니다 — 처음 · 끝에 닿아도 그대로입니다. 넘친 쪽만 흐리는 방식은 두지 않습니다.

[그림: 처음 · 가운데 · 끝 — 흐림은 그대로, 끝에서는 빈 여백 위](../../site/components/specs/scroll-fog.tsx#always-guide)

### 깊이만큼 여백

흐린 쪽에는 깊이 이상의 여백을 둡니다. 끝까지 스크롤했을 때 마지막 줄 · 칩이 흐림 아래 남지 않고, 흐림은 빈 여백 위에 놓입니다. 깊이를 정하면 그것이 그쪽의 최소 여백입니다. 키보드로 옮긴 요소도 흐림 아래 멈추지 않게 스크롤 여유를 같은 만큼 둡니다.

[그림: 아래 여백 80 · 여백 없이 흐림에 덮인 마지막 줄](../../site/components/specs/scroll-fog.tsx#padding-guide)

### 어디에 거나

넘칠 수 있는 영역에 겁니다 — 가로로 넘기는 줄, 목록 · 긴 폼처럼 길이가 데이터에 따라 늘어나는 시트 · 대화상자 본문, 바닥 고정 버튼 위로 스크롤되는 긴 화면입니다. 걸 자리인지는 내용의 종류로 미리 정합니다 — 넘쳤는지 재서 켜고 끄지 않습니다.

- 칸 두셋처럼 늘 들어맞는 시트 · 대화상자 본문에는 걸지 않습니다 — 스크롤이 생기지 않으니 아래 80 이 빈자리만 늘립니다.
- 탭 바 위의 목록 화면 · 일반 페이지 스크롤에는 걸지 않습니다 — 화면 끝이 곧 영역의 끝이고, 탭 바 위 80 이 늘 흐려집니다. 탭 바 위 목록은 아래 여백으로 마지막 줄을 바 위에 올립니다([Bottom Navigation](bottom-navigation.md) 의 "본문 아래 여백").
- 부품이 제 안개를 가진 자리 — [Wheel Picker](wheel-picker.md) 의 위아래(min(40%, 3칸)) · [Date Picker](date-picker.md) 이어지는 달의 아래 96 · [Side Navigation](side-navigation.md) 내용의 아래 24 — 는 그 스펙을 따릅니다. 겹쳐 걸지 않습니다.
- 흐림은 힌트일 뿐입니다 — 스크롤 · 키보드 스크롤 · 초점 이동은 그대로 둡니다. 가로 줄만 스크롤바를 숨기고, 세로 스크롤바는 전역 한 벌 그대로입니다([Scroll Area](scroll-area.md)).

[그림: 거는 자리 · 걸지 않는 자리 — 칩 줄 · 긴 시트 본문 · 짧은 폼 · 탭 바 위 목록](../../site/components/specs/scroll-fog.tsx#where-guide)

## 코드

레시피 `recipes/shadcn/components/ui/scroll-fog.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ScrollFog` — `use`(`"box"` 기본 · `"row"` · `"overlayBody"` · `"page"`)가 방향 · 깊이 · 안쪽 여백 · 스크롤 여유를 정합니다. 이 상자가 곧 스크롤 상자입니다 — 높이 · 폭은 부르는 쪽이 정하고, 그 밖은 `div` 속성입니다. 안쪽 여백은 안쪽 감싸개에 둡니다(흐림 아래에 여백이 깔리게).
- 시트 · 대화상자 · 팝오버의 본문은 `scrollFog` 를 주어 켭니다 — `DialogBody` · `BottomSheetBody` · `ResponsiveDialogBody` · `PopoverBody` 이며, `use="overlayBody"` 와 같습니다.
- 칩 줄(`ChipGroup layout="scroll"`)과 `ChipTabsList` 는 늘 `row` 흐림입니다 — 따로 켜지 않습니다.

### 시트 · 대화상자 본문 — 긴 목록

[그림: 카테고리 고르기 — 끝까지 내렸을 때 아래 80 은 빈 여백 위](../../site/components/specs/scroll-fog.tsx#ex-sheet)

```tsx
import { ResponsiveDialogBody } from "@/components/ui/dialog"
import { ListRadioGroup, ListRadioItem } from "@/components/ui/list"

{/* 길이가 데이터에 따라 늘어나는 목록 — 위 20 · 아래 80 흐림과 같은 여백 */}
<ResponsiveDialogBody scrollFog className="px-0">
  <ListRadioGroup value={categoryId} onValueChange={setCategoryId} aria-label="카테고리">
    {categories.map((c) => <ListRadioItem key={c.id} value={c.id} title={c.name} />)}
  </ListRadioGroup>
</ResponsiveDialogBody>
```

### 칩 줄 · 상자

[그림: 필터 칩 줄 · 카드 안 긴 설명](../../site/components/specs/scroll-fog.tsx#ex-row)

```tsx
import { ScrollFog } from "@/components/ui/scroll-fog"

{/* 칩 줄은 따로 켜지 않는다 — layout="scroll" 이면 늘 좌우 20 */}
<ChipGroup layout="scroll" aria-label="필터">…</ChipGroup>

{/* 카드 안 높이를 정한 스크롤 — 넘치는 방향 양 끝 20 */}
<ScrollFog className="max-h-60" tabIndex={0} role="region" aria-label="이용 약관">
  <p>{terms}</p>
</ScrollFog>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 스크롤 | 흐림은 그대로입니다 — 내용만 지나갑니다 |
| 처음 · 끝 | 흐림이 빈 여백 위에 놓입니다 — 사라지지 않습니다 |
| 누르기 | 흐린 자리의 내용도 눌립니다 — 마스크는 누르기를 막지 않습니다 |
| 키보드 | `Tab` 으로 옮긴 요소가 흐림 밖에 보이게 스크롤합니다(스크롤 여유 — 가로 줄 24 · 본문 위 20 · 아래 80) |
| 모션 줄이기 | 움직임이 없어 그대로입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 흐림 안의 글은 옅어집니다 — 깊이만큼 여백이 있어 어떤 글도 흐림 안에 머물지 않습니다(스크롤하면 흐림 밖으로 옵니다) ✓ |
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 스크롤 여유를 깊이만큼 둬 키보드 초점이 흐림 아래 멈추지 않습니다 ✓ |
| **WCAG 2.1.1** Keyboard | 스크롤 상자는 키보드로 스크롤됩니다 — 안에 초점 가는 요소가 없으면 상자에 `tabindex="0"` · `role="region"` 과 이름을 줍니다([Scroll Area](scroll-area.md) — 역할 없는 `div` 에는 이름을 달 수 없습니다) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 흐림 자체는 누르는 것이 아닙니다 — 해당 없음(흐린 자리의 칩 · 줄은 그대로 눌립니다) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 |
| **ARIA** | 흐림은 장식입니다 — 역할 · 이름이 없습니다 |

## Do / Don't

### ✅ Do

- 가로 칩 줄 · 넘칠 수 있는 시트 본문 · 바닥 버튼 위 긴 화면에.
- 늘 켜 두고, 흐린 쪽에 깊이만큼 여백.
- 마스크로 — 바탕색이 바뀌어도 그대로.

### ❌ Don't

- 스크롤 위치에 따라 흐림을 켜고 끄기 · 넘친 쪽만 흐리기.
- 바탕색 그라디언트를 덮어 흐리기(색 막) — 바탕이 바뀌면 띠가 보입니다.
- 여백 없이 흐려 마지막 줄을 흐림 아래 남기기.
- 칸 두셋뿐인 본문 · 탭 바 위 목록 화면에.
- 부품이 제 안개를 가진 자리(Wheel Picker · Date Picker 이어지는 달)에 겹쳐 걸기.

## Specification

`scroll-fog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Scroll Fog 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — scroll-fog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-fog)
