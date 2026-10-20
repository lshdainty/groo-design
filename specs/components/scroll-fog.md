# Scroll Fog

> 스크롤되는 영역의 끝을 흐려 뒤에 더 있다는 것을 알린다 — 가로로 넘기는 칩 줄, 시트 · 대화상자의 긴 본문, 바닥 고정 버튼이 있는 긴 화면. 색을 덮는 막이 아니라 투명도 마스크라 어느 바탕에서도 맞고, 스크롤 위치와 상관없이 늘 켜져 있다.

구조는 당근 [SEED Scroll Fog](https://seed-design.io/components/scroll-fog)(Apache-2.0)를 따른다 — 스크롤 상자에 거는 마스크(`gradient-fade-mask` 16단계, v104), 기본 깊이 20, 흐린 쪽에 그 깊이만큼 여백, 늘 켜짐. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). groo 에 처음 두는 부품이다 — 시트 · 대화상자의 "본문이 넘칠 때만 아래 48 흐림"(2026-10-02)을 이 규칙이 대신한다.

수치 원본은 [`scroll-fog.yaml`](scroll-fog.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 칩 필터 줄 · 카테고리 고르기 시트 — 라이트 · 다크](../../site/components/specs/scroll-fog.tsx#hero)

### 직접 골라 보기

자리(가로 줄 · 시트 본문 · 바닥 버튼 화면 · 상자) · 바탕 색을 고르고 스크롤하면 스펙대로 그린 흐림과 그 코드가 바뀐다. 처음 · 가운데 · 끝 어디서나 흐림이 그대로인 것을 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/scroll-fog.tsx#playground)

## Anatomy

[그림: 스크롤 상자 · 흐림(깊이) · 여백 — 처음 · 끝에서는 흐림이 빈 여백 위에 놓인다](../../site/components/specs/scroll-fog.tsx#anatomy)

| ⓐ Scroll Area | 스크롤 상자 — 넘친 내용이 이 안에서 스크롤된다. 마스크를 이 상자에 건다. 스크롤바 · 초점 · 이름 규칙은 [Scroll Area](scroll-area.md). |
| ⓑ Fog | 흐림 — 정한 쪽 가장자리에서 깊이만큼 투명에서 불투명으로. |
| ⓒ Padding | 여백 — 흐린 쪽에 깊이 이상. |

[표: 부위](scroll-fog.yaml#slots)

## Properties

### 마스크 — 색이 아니다

`gradient-fade-mask`(알파 0 → 1, 16단계)를 스크롤 상자에 `mask-image` 로 건다 — 흐린 쪽마다 상자 전체 크기의 층 하나에 방향을 붙이고(단계는 그 쪽 깊이에 맞춰 깊이 안에서 불투명에 닿는다) 겹친 층을 곱한다(`mask-composite: intersect`, SEED 와 같다). 상자가 두 깊이의 합보다 낮아도 양 끝이 함께 흐리다. 바탕색을 덧칠하지 않으므로 흰 면 · 회색 바탕 · 다크 어디서나 같은 값이다. 내용이 흐려질 뿐 그 위에 무엇을 얹지 않아, 흐린 자리의 칩 · 줄도 그대로 눌린다.

[그림: 같은 흐림이 흰 면 · 회색 바탕 · 다크에서 — 색 막(바탕색 그라디언트)은 바탕이 바뀌면 띠가 보인다](../../site/components/specs/scroll-fog.tsx#mask)

[표: 공통](scroll-fog.yaml#base)

### Use — 자리마다 방향 · 깊이

| 자리 | `use` | 방향 | 깊이 · 여백 |
|---|---|---|---|
| 칩 필터 바 · 제안 칩 줄 · [Chip Tabs](tabs.md) · 가로 카드 줄 | `row` | 좌 · 우 | 흐림 20 · 여백은 화면 여백 24 |
| 시트 · 대화상자 · 팝오버 · [Side Panel](side-panel.md) 의 넘칠 수 있는 본문 | `overlayBody` | 위 · 아래 | 위 20 · 아래 80 |
| 바닥 고정 버튼이 있는 화면 전체 스크롤 | `page` | 위 · 아래 | 위 20 · 아래 80 — 바닥 버튼 위에서 끝난다 |
| 카드 · 상자 안의 높이를 정한 스크롤 | `box` *(기본)* | 넘치는 방향의 양 끝 | 20 |

SEED 의 권장 그대로다 — 가로 스크롤은 좌우 20(정보가 촘촘해 깊게 흐리지 않는다), 세로 스크롤은 위 20 · 아래 80(아래가 깊어야 더 있다는 것이 잘 보인다), 그 밖은 최소 20.

[그림: 자리마다 — 칩 줄 좌우 20 · 시트 본문 위 20 아래 80 · 바닥 버튼 화면 · 상자 20](../../site/components/specs/scroll-fog.tsx#uses)

[표: 자리](scroll-fog.yaml#use)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 늘 켜짐 — 스크롤 위치 · 넘침과 상관없이 |

## Guidelines

### 늘 켜 둔다

스크롤을 시작하고 멈출 때마다 흐림이 나타났다 사라지면 화면이 깜빡인다(SEED). 그래서 흐림은 스크롤 위치 · 넘침을 재지 않고 늘 켜 둔다 — 처음 · 끝에 닿아도 그대로다. 넘친 쪽만 흐리는 방식은 두지 않는다(사용자 결정).

[그림: 처음 · 가운데 · 끝 — 흐림은 그대로, 끝에서는 빈 여백 위](../../site/components/specs/scroll-fog.tsx#always-guide)

### 깊이만큼 여백

흐린 쪽에는 깊이 이상의 여백을 둔다 — 끝까지 스크롤했을 때 마지막 줄 · 칩이 흐림 아래 남지 않고, 흐림은 빈 여백 위에 놓인다. 깊이를 정하면 그것이 그쪽의 최소 여백이다(SEED). 키보드로 옮긴 요소도 흐림 아래 멈추지 않게 스크롤 여유를 같은 만큼 둔다.

[그림: 아래 여백 80 · 여백 없이 흐림에 덮인 마지막 줄](../../site/components/specs/scroll-fog.tsx#padding-guide)

### 어디에 거나

넘칠 수 있는 영역에 건다 — 가로로 넘기는 줄, 목록 · 긴 폼처럼 길이가 데이터에 따라 늘어나는 시트 · 대화상자 본문, 바닥 고정 버튼 위로 스크롤되는 긴 화면. 걸 자리인지는 내용의 종류로 미리 정한다 — 넘쳤는지 재서 켜고 끄지 않는다.

- 칸 두셋처럼 늘 들어맞는 시트 · 대화상자 본문에는 걸지 않는다 — 스크롤이 생기지 않으니 아래 80 이 빈자리만 늘린다.
- 탭 바 위의 목록 화면 · 일반 페이지 스크롤에는 걸지 않는다 — 화면 끝이 곧 영역의 끝이고, 탭 바 위 80 이 늘 흐려진다. 탭 바 위 목록은 아래 여백으로 마지막 줄을 바 위에 올린다([Bottom Navigation](bottom-navigation.md) 의 "본문 아래 여백").
- 부품이 제 안개를 가진 자리 — [Wheel Picker](wheel-picker.md) 의 위아래(min(40%, 3칸)) · [Date Picker](date-picker.md) 이어지는 달의 아래 96 · [Side Navigation](side-navigation.md) 내용의 아래 24 — 는 그 스펙을 따른다. 겹쳐 걸지 않는다.
- 흐림은 힌트일 뿐이다 — 스크롤 · 키보드 스크롤 · 초점 이동은 그대로 둔다. 가로 줄만 스크롤바를 숨긴다 — 세로 스크롤바는 전역 한 벌 그대로다([Scroll Area](scroll-area.md), 2026-10-10).

[그림: 거는 자리 · 걸지 않는 자리 — 칩 줄 · 긴 시트 본문 · 짧은 폼 · 탭 바 위 목록](../../site/components/specs/scroll-fog.tsx#where-guide)

## 코드

레시피 `recipes/shadcn/components/ui/scroll-fog.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ScrollFog` — `use`(`"box"` 기본 · `"row"` · `"overlayBody"` · `"page"`)가 방향 · 깊이 · 안쪽 여백 · 스크롤 여유를 정한다. 이 상자가 곧 스크롤 상자다 — 높이 · 폭은 부르는 쪽이 정하고, 그 밖은 `div` 속성. 안쪽 여백은 안쪽 감싸개에 둔다(흐림 아래에 여백이 깔리게).
- 시트 · 대화상자 · 팝오버의 본문은 `scrollFog` 를 주어 켠다 — `DialogBody` · `BottomSheetBody` · `ResponsiveDialogBody` · `PopoverBody`, `use="overlayBody"` 와 같다.
- 칩 줄(`ChipGroup layout="scroll"`)과 `ChipTabsList` 는 늘 `row` 흐림이다 — 따로 켜지 않는다.

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
| 스크롤 | 흐림은 그대로 — 내용만 지나간다 |
| 처음 · 끝 | 흐림이 빈 여백 위에 놓인다 — 사라지지 않는다 |
| 누르기 | 흐린 자리의 내용도 눌린다 — 마스크는 누르기를 막지 않는다 |
| 키보드 | `Tab` 으로 옮긴 요소가 흐림 밖에 보이게 스크롤한다(스크롤 여유 — 가로 줄 24 · 본문 위 20 · 아래 80) |
| 모션 줄이기 | 움직임이 없다 — 그대로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 흐림 안의 글은 옅어진다 — 깊이만큼 여백이 있어 어떤 글도 흐림 안에 머물지 않는다(스크롤하면 흐림 밖으로 온다) ✓ |
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 스크롤 여유를 깊이만큼 둬 키보드 초점이 흐림 아래 멈추지 않는다 ✓ |
| **WCAG 2.1.1** Keyboard | 스크롤 상자는 키보드로 스크롤된다 — 안에 초점 가는 요소가 없으면 상자에 `tabindex="0"` · `role="region"` 과 이름을 준다([Scroll Area](scroll-area.md) — 역할 없는 `div` 에는 이름을 달 수 없다) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 흐림 자체는 누르는 것이 아니다 — 해당 없음(흐린 자리의 칩 · 줄은 그대로 눌린다) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 |
| **ARIA** | 흐림은 장식 — 역할 · 이름이 없다 |

## Do / Don't

### ✅ Do

- 가로 칩 줄 · 넘칠 수 있는 시트 본문 · 바닥 버튼 위 긴 화면에.
- 늘 켜 두고, 흐린 쪽에 깊이만큼 여백.
- 마스크로 — 바탕색이 바뀌어도 그대로.

### ❌ Don't

- 스크롤 위치에 따라 흐림을 켜고 끄기 · 넘친 쪽만 흐리기.
- 바탕색 그라디언트를 덮어 흐리기(색 막) — 바탕이 바뀌면 띠가 보인다.
- 여백 없이 흐려 마지막 줄을 흐림 아래 남기기.
- 칸 두셋뿐인 본문 · 탭 바 위 목록 화면에.
- 부품이 제 안개를 가진 자리(Wheel Picker · Date Picker 이어지는 달)에 겹쳐 걸기.

## Specification

`scroll-fog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Scroll Fog 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — scroll-fog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-fog)

## SEED 와 다른 점

- **자리마다 방향 · 깊이를 정해 둔다**(`use`) — SEED 는 숫자 권장(기본 20 · 세로 위 20 · 아래 80 · 가로 20 · 또는 영역의 15 ~ 20%)만 두고 쓰는 쪽이 고른다. groo 는 비율로 정하는 안을 두지 않는다.
- **가로 줄의 여백은 화면 여백 24** — 흐림 20 보다 넓어 처음 · 끝 칩은 흐리지 않는다(SEED Chip Tabs 예제는 20).
- **키보드 초점이 흐림 아래 가려지지 않게 스크롤 여유를 깊이만큼 둔다** — SEED 는 정하지 않았다.
- **시트 · 대화상자 본문의 흐림도 이 규칙이다** — SEED Dialog 의 안의 흐림(넘칠 때만 아래 48)은 따르지 않는다.

## Migration notes

### 2026-10-08 — 마스크를 쪽마다 한 층 + intersect 로(레시피)

YAML 은 "흐린 쪽마다 하나씩 겹친다(`mask-composite: intersect`)" 인데 레시피는 처음 흐림 · 가운데 불투명 · 끝 흐림 세 층을 겹치지 않게 이어 붙였다(`mask-composite` 기본 add). 상자가 두 깊이의 합(`overlayBody` 는 100)보다 낮으면 가운데 층이 0 이 되고 두 흐림이 겹친 자리에서 더해져 덜 흐렸다. 레시피 · 예제 · 미리보기를 YAML · SEED 대로 바꿨다 — 흐린 쪽마다 상자 전체 크기의 층 하나(단계는 그 쪽 깊이의 몫), 두 층을 곱한다(`-webkit-mask-composite` 는 옛 이름 `source-in`). 그보다 큰 상자의 모습은 그대로다. 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 6.

### 2026-10-03 — 새로 둔다(SEED Scroll Fog)

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — SEED 의 늘 켜진 마스크(`gradient-fade-mask`, v104), 가로 좌우 20 · 세로 위 20 · 아래 80(기본 20), 그 깊이만큼 여백. 넘친 쪽만 흐리는 안(가로 20 · 세로 48)은 고르지 않았다. 그래서 2026-10-02 의 대화상자 · 팝오버 규칙 "본문이 넘칠 때만 아래 48 흐림"([Dialog](dialog.md) · [Popover](popover.md))을 이 규칙으로 바꿨고, [Chip](chip.md) · [Chip Tabs](tabs.md) 의 "끝 흐림은 Scroll Fog 차례에" 는 `row` 흐림이 됐다.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사). 세 제품 모두 끝 흐림이 없다 — 칩 필터 줄 · 2차 탭은 잘린 채 끝나고, 시트 · 대화상자의 긴 본문은 넘쳐도 알리지 않는다.

- 앱 적용 때 화면마다 정할 자리 — 넘칠 수 있는 시트 · 대화상자 본문(거래 상세 · 카테고리 고르기 · 반복 거래 목록), 바닥 고정 버튼이 있는 긴 화면(가져오기 · 약관).
