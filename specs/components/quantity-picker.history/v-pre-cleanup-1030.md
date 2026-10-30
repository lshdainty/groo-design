# Quantity Picker

> 작은 정수를 한 단계씩 늘리고 줄이는 컨트롤 — 승인 필요 횟수(0 ~ 3) · 반복 간격 · 부여 시간(0 ~ 7시간)처럼 흔한 값이 열 단계 안쪽인 수를 받는다. 흔한 값이 더 멀거나 돈 · 소수면 [Input](input.md) 의 숫자 칸, 날짜 부분(1 ~ 31일)이나 띄엄띄엄 이름 붙은 값(할부)은 [Select](select.md), 범위 안의 자리(임계값)는 [Slider](slider.md) 다.

구조는 당근 [SEED Quantity Picker](https://seed-design.io/components/quantity-picker)(rootage `quantity-picker.json` · `quantity-picker-button.json`, @seed-design/react 2.1.0 · react-headless `useQuantityPicker` — Apache-2.0)를 따른다 — 테두리 상자 안에 줄이기(−) · 선 · 값 · 선 · 늘리기(+), 세 크기(36 · 40 · 52), 값 칸은 보기만, 끝에 닿은 버튼은 막힘, 지우기(Removable) · 로딩. 웹의 기본 크기(responsive) · 누르는 자리 44 · 끝의 `aria-disabled` 는 groo 가 정했다(2026-10-15 사용자 결정 — 마무리 1A · 2A · 3A). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. groo 에 처음 두는 부품이다 — 지금 세 제품에는 `[−] 값 [+]` 컨트롤이 없고 작은 정수도 모두 숫자 칸이다.

수치 원본은 [`quantity-picker.yaml`](quantity-picker.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 휴가 정책 수정 — 데스크톱 대화상자(medium 40) · 폰 시트(large 52), 라이트 · 다크](../../site/components/specs/quantity-picker.tsx#hero)

### 직접 골라 보기

크기 · 폭(hug · fill) · 단위 · 범위 · 지우기 · 로딩 · 오류 · 막힘을 고르면 스펙대로 그린 컨트롤과 그 코드가 바뀐다. − · + 를 눌러 끝에서 막히는 것, 값이 바뀌면 화면 읽기에 들리는 글("4회")을 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/quantity-picker.tsx#playground)

## Anatomy

[그림: 상자 안에 줄이기 · 선 · 값 · 선 · 늘리기 — 값은 보기만, 누르는 자리는 두 버튼](../../site/components/specs/quantity-picker.tsx#anatomy)

| ⓐ Root | 테두리 상자 — 1px `stroke-neutral-weak` · `bg-layer-default`. 이름이 있는 묶음(`role="group"`)이다. |
| ⓑ Decrement Button | 줄이기(−) — 정사각, 상자 높이와 같다. 최소에서 막힌다. 지우기를 켜면 최소에서 휴지통이 된다. |
| ⓒ Divider | 선 — 1px × 16 `stroke-neutral-subtle`. 버튼과 값을 가른다. |
| ⓓ Value Display | 값 — 지금 값과 단위("3회"). 누르지도 치지도 못한다. |
| ⓔ Increment Button | 늘리기(+) — 최대에서 막힌다. |

누르는 자리는 두 버튼뿐이다(SEED — "Value Display는 터치에 반응하지 않습니다"). 버튼은 따로 눌리고 따로 준다 — 누른 버튼만 2px 거리로 줄어든다(SEED `scaleScope: self` · 기초 Feedback v104).

[표: 부위](quantity-picker.yaml#slots)

## Properties

### Size

SEED 의 세 크기를 그대로 둔다(사용자 결정 1A) — `small` 36 · `medium` 40 · `large` 52, 모서리 8 · 8 · 12, 아이콘 16 · 18 · 22, 값 16 / 22 · 16 / 22 · 18 / 24(500). 크기는 **옆 입력과 같은 높이**로 고른다(SEED — "다른 입력 요소와 함께 배치할 때는 사이즈를 맞춰"). 폼의 기본은 [Input](input.md) 처럼 `responsive` 다 — 1280 미만 large 52 · 이상 medium 40. 앱은 늘 large 다. `small` 36 은 표 칸 · 목록 줄 안에만 쓴다(HR 업무 보고 소요시간).

36 · 40 버튼은 누르는 자리를 44 로 넓힌다 — 보이는 상자 둘레에 보이지 않는 여백을 4 · 2 씩 더한다(기초 Iconography — "40px 버튼은 보이지 않는 여백을 2px 씩 더한다"). 52 는 그대로 52 다. Button 의 크기(large 48)를 따르는 안(1B)과 40 하나(1C)는 고르지 않았다 — 폰 폼에서 옆 칸(52)과 4 · 12 어긋난다.

[그림: 세 크기 — 폰 폼 52 · 데스크톱 폼 40 · 표 칸 36, 옆 Input · Select 와 높이가 같다 · 누르는 자리 44(분홍)](../../site/components/specs/quantity-picker.tsx#size)

[표: 크기](quantity-picker.yaml#grid.size)

### Layout

`hug`(기본)는 내용에 맞춘 폭이다 — 값 칸은 **가장 긴 값의 폭**을 잡아 두어("99회" · "24h") 값이 바뀌어도 상자 폭이 흔들리지 않는다(SEED 의 숨겨 둔 자리 글 · 고정폭 숫자). `fill` 은 부모 Flex 의 남은 폭을 채운다 — 늘어나는 것은 값 칸뿐이고 두 버튼은 정사각 그대로다(SEED).

[그림: hug — 가장 긴 값 "99회" 의 폭 · fill — 폰 폼의 칸 폭을 채운다](../../site/components/specs/quantity-picker.tsx#layout)

[표: 폭](quantity-picker.yaml#layout)

### 끝 — 최소 · 최대

값이 최소에 닿으면 줄이기가, 최대에 닿으면 늘리기가 막힌 모습(`fg-disabled`)이 된다 — 올려도 눌러도 바탕이 생기지 않는다. 막힌 버튼은 `aria-disabled` 라 **초점이 남는다** — 키보드로 0 까지 줄여도 초점이 본문으로 빠지지 않고 그 버튼에서 "사용할 수 없음" 이 들리며, `Tab` 한 번이면 늘리기다(따라오는 것). 컨트롤 전체를 막는 `disabled` 와 다르다.

[그림: 최소 0 — 줄이기 막힘(초점 링이 남는다) · 범위 안 · 최대 3 — 늘리기 막힘](../../site/components/specs/quantity-picker.tsx#edge)

[표: 최소](quantity-picker.yaml#matrix.edge.min@decrement)

[표: 최대](quantity-picker.yaml#matrix.edge.max@increment)

### 지우기(Removable)

`removable` 이면 값이 최소일 때 줄이기 자리가 지우기 버튼(휴지통 `trash-2`)이 된다 — 값을 더 줄이는 동작이 곧 항목을 지우는 자리(SEED). 누르면 `onRemove` 를 부르고 값은 바꾸지 않는다. 버튼 이름도 함께 바뀐다 — 무엇을 지우는지("{항목 이름} 지우기", `removeAriaLabel` 필수). 지금 세 제품에 이 자리는 없다 — SEED 와 1:1 로 두어 생기면 바로 쓴다(사용자 결정 3A).

[그림: 수량 2개 → 1개 — 최소에서 줄이기가 휴지통, 이름 "{항목 이름} 지우기"](../../site/components/specs/quantity-picker.tsx#removable)

[표: 지우기](quantity-picker.yaml#matrix.removable.on.edge.min@decrement+icon)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 버튼 · 아이콘 `fg-neutral` · 값 `fg-neutral` 500 |
| `hovered` | 웹 — 올린 버튼에 누름과 같은 바탕 `bg-layer-default-pressed`(v106), 축소 없음 |
| `focused` | 키보드 포커스에만 버튼 바깥 링 2px · 띄움 2px |
| `pressed` | 누른 버튼에 `bg-layer-default-pressed` + 그 버튼만 2px 거리 축소(v104) |
| `loading` | 기다리는 버튼에 누름 바탕 + 아이콘 자리에 값 없는 원(16 · 18 · 22, 두께 2) — 그 버튼의 누르기를 버린다(`aria-busy`). 서버에 바로 반영하는 수량이 응답을 기다릴 때(SEED) |
| `invalid` | 상자 테두리 안쪽 2px `stroke-critical-solid` — 값이 허용 범위를 벗어났다(범위가 데이터로 바뀌어 지금 값이 밖일 때). 오류 글은 Field 가 칸 아래에 |
| `disabled` | 아이콘 · 값 `fg-disabled`, 두 버튼 모두 `disabled` — 초점을 받지 않는다. 흐리게 하지 않는다(v106) |

로딩 원은 SEED 값 그대로 트랙 `gray-500` · 호 `fg-neutral` 이다 — groo Button 의 `ghost` 로딩 원과 같은 값이다(누름 바탕 위 투명 버튼이라 같은 자리). Progress Circle 의 `neutral` 톤(트랙 `stroke-neutral-subtle` · 호 `stroke-neutral-solid`)이 아니라 `inherit` 로 이 값을 넘긴다.

[그림: 상태 — 기본 · 호버 · 포커스 · 누름 · 로딩 · 오류 · 막힘(세 크기)](../../site/components/specs/quantity-picker.tsx#states)

[표: 상태 — 상자 · 버튼 · 포커스 링](quantity-picker.yaml#matrix@root+button+focusRing)

[표: 상태 — 아이콘 · 값 · 로딩 원](quantity-picker.yaml#matrix@icon+value+progressCircle)

[표: 공통 — 선](quantity-picker.yaml#base.enabled@divider)

[표: 모션](quantity-picker.yaml#motion)

## Guidelines

### 언제 쓰나

| 이런 값 | 쓰는 것 |
|---|---|
| 작은 정수를 한 단계씩, 흔한 값이 열 단계 안쪽(승인 필요 횟수 0 ~ 3 · 반복 간격 1 ~ 3 · 부여 시간 0 ~ 7시간 · 업무 보고 소요시간) | **Quantity Picker** |
| 정수지만 흔한 값이 열 단계보다 멀다(반복 거래 "총 n회" — 기본 12 · 흔한 24 · 36) | [Input](input.md) — 숫자 키보드 · 뒤 단위 "회" |
| 돈 · 소수 · 큰 수(금액 · 보유 수량 0.05 · 3.75g) | [Input](input.md) |
| 날짜 부분(반복 일자 · 카드 결제일 1 ~ 31 · 월) | [Select](select.md) |
| 띄엄띄엄이거나 이름 붙은 값(할부 — 일시불 · 2 ~ 12 · 18 · 24개월) | [Select](select.md) |
| 범위 안의 자리가 중요한 값(예산 알림 임계값 50 ~ 100%) | [Slider](slider.md) |

[그림: 승인 필요 횟수는 Quantity Picker · 반복 거래 "총 12회" 는 숫자 칸 · 할부는 Select](../../site/components/specs/quantity-picker.tsx#when-guide)

### 열 단계 안쪽만 — 값 칸은 치지 못한다

값 칸은 보기만 한다 — 누르지도 치지도 못하고, 누르고 있어도 반복하지 않으며, 화살표 키로 바꾸는 spinbutton 도 아니다(SEED, 사용자 결정 2A). 그래서 먼 값은 멀다 — 반복 거래 "총 n회" 를 12 에서 36 으로 바꾸려면 + 를 스물네 번 눌러야 한다. 흔한 값이 열 단계보다 먼 자리는 Quantity Picker 를 쓰지 않고 숫자 칸(Input)을 둔다 — 두 글자면 된다. 칠 수 있는 값 칸(2B)과 길게 누르면 빨리 오르기(2C — 12 → 36 에 2.6초, 0.1초 늦게 떼면 37)는 고르지 않았다.

[그림: 12 → 36 — 숫자 칸은 두 글자 · Quantity Picker 는 + 스물네 번](../../site/components/specs/quantity-picker.tsx#steps-guide)

### 옆 칸과 같은 높이

한 폼 안에서는 옆 Input · Select 와 같은 크기다 — 웹 폼은 `responsive`(1280 미만 52 · 이상 40), 앱은 52. 표 칸 · 목록 줄 안은 `small` 36 이다. 버튼 줄의 높이(48)에 맞추지 않는다.

[그림: 폰 폼 — 반복 간격 Quantity Picker 52 와 반복 단위 Select 52 가 한 줄 · 48 로 어긋난 줄](../../site/components/specs/quantity-picker.tsx#size-guide)

### 위 끝을 데이터로 건다

범위를 칠 수 없으니 범위 밖 값이 들어오지 않는다 — 최소 · 최대를 데이터에 맞게 건다. 승인 필요 횟수의 최대는 고를 수 있는 승인자 수다 — 그러면 신청 화면이 따로 줄여 맞출 필요가 없다. 범위가 바뀌어 지금 값이 밖이 되면(승인자가 줄었다) 값을 저절로 고치지 않고 `invalid` 와 Field 오류 글로 알린다.

[그림: 승인 필요 횟수 0 ~ 3(승인자 3명) — 최대에서 늘리기 막힘 · 승인자가 2명으로 줄어 3 이 범위 밖 — 오류 테두리 + 오류 글](../../site/components/specs/quantity-picker.tsx#range-guide)

### 단위는 값 칸에, 제출은 정수

단위는 값 칸의 글로 붙인다(`getValueText` — "3회" · "8h") — 라벨에 "(회)" 를 붙이지 않는다. 화면 읽기도 바뀐 값을 단위와 함께 읽는다("4회"). 폼에 내는 값은 단위 없는 정수다(숨은 입력 `name`).

### 글

칸 이름은 무엇을 세는지 명사로("승인 필요 횟수" · "반복 간격"), 설명은 끝값의 뜻을 한 문장으로("0 이면 승인 없이 바로 써요."). 버튼 이름은 "줄이기" · "늘리기", 지우기는 무엇을 지우는지("{항목 이름} 지우기"). 오류 글은 범위와 할 일을 쓴다("승인자는 2명이에요. 횟수를 2회 이하로 줄여주세요.").

## 코드

레시피 `recipes/shadcn/components/ui/quantity-picker.tsx` 를 [Field](field.md) 안에 둔다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `QuantityPicker` — `value` · `defaultValue`(수) · `onValueChange(value)` · `min`(기본 `0`) · `max`(기본 `Number.MAX_SAFE_INTEGER` — 데이터로 건다) · `step`(기본 `1`) · `size`(`"small"` · `"medium"` · `"large"` · `"responsive"` — 기본 `"responsive"`) · `layout`(`"hug"` 기본 · `"fill"`) · `getValueText(value)`(값 칸 · 읽기 글 — 기본은 숫자 그대로) · `loading`(`boolean` · `{ decrement?: boolean; increment?: boolean }` — `true` 면 두 버튼) · `disabled` · `readOnly` · `invalid` · `name`(숨은 입력 — 단위 없는 정수) · `decrementAriaLabel`(기본 `"줄이기"`) · `incrementAriaLabel`(기본 `"늘리기"`) · `aria-label` · `aria-labelledby`. 지우기는 `removable` + `onRemove()` + `removeAriaLabel`(셋을 함께 — `removable` 이면 둘 다 필수인 타입). 루트는 `role="group"` 이고, Field 안이면 Field 의 라벨이 이름 · 설명 · 오류가 설명이 되며(`useFieldGroup`) Field 의 `disabled` · `readOnly` · `invalid` 를 받는다(`useFieldGroupState`). 끝에 닿은 버튼은 `aria-disabled`(초점이 남는다), 막힘은 `disabled` 다. 값 칸은 `aria-live="polite"` · `aria-atomic` 이고 누르기를 받지 않는다. 화살표 키 · 길게 누르기 반복은 두지 않는다.

### 폼 — 승인 필요 횟수

[그림: HR 휴가 정책 — 승인 필요 횟수 0 ~ 3, Field 설명](../../site/components/specs/quantity-picker.tsx#ex-basic)

```tsx
import { useState } from "react"
import { Field } from "@/components/ui/field"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const approverCount = 3 // 고를 수 있는 승인자 수 — 위 끝을 데이터로 건다
const [approvals, setApprovals] = useState(0)

<Field label="승인 필요 횟수" description="0 이면 승인 없이 바로 써요.">
  <QuantityPicker
    min={0}
    max={approverCount}
    value={approvals}
    onValueChange={setApprovals}
    getValueText={(v) => `${v}회`}
    name="approvalCount"
  />
</Field>
```

### 표 칸 — 소요시간

[그림: HR 업무 보고 표 — 줄 수정 중 소요시간 small 36](../../site/components/specs/quantity-picker.tsx#ex-table)

```tsx
import { useState } from "react"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const [hours, setHours] = useState(8)

{/* 표 칸 안 — 옆 칸 이름이 없어 aria-label 로 이름을 준다 */}
<QuantityPicker size="small" min={0} max={24} value={hours} onValueChange={setHours} getValueText={(v) => `${v}h`} aria-label="소요시간" />
```

### 지우기 · 로딩

[그림: 최소에서 지우기 · 서버 응답을 기다리는 늘리기](../../site/components/specs/quantity-picker.tsx#ex-server)

```tsx
import { useState } from "react"
import { QuantityPicker } from "@/components/ui/quantity-picker"

const itemName = "점심 도시락" // 목록 줄의 항목 이름
const [count, setCount] = useState(1)
const [pending, setPending] = useState<"decrement" | "increment" | null>(null)
const save = (next: number) => Promise.resolve(next) // 서버에 바로 반영하는 요청
const removeItem = () => {} // 항목을 지운다 — 지운 뒤 초점은 다음 항목으로

// 누른 쪽만 기다린다 — 다른 쪽 버튼은 그대로 눌린다
const change = (next: number) => {
  setPending(next > count ? "increment" : "decrement")
  save(next).then(
    () => setCount(next),
    () => {},
  ).finally(() => setPending(null))
}

<QuantityPicker
  min={1}
  max={9}
  value={count}
  onValueChange={change}
  getValueText={(v) => `${v}개`}
  loading={{ decrement: pending === "decrement", increment: pending === "increment" }}
  removable
  onRemove={removeItem}
  removeAriaLabel={`${itemName} 지우기`}
  aria-label="수량"
/>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| − · + 누르기 · `Enter` · `Space` | 한 단계(`step` — 기본 1) 바꾼다. 값 칸이 바뀐 값을 단위와 함께 한 번 읽는다("4회") |
| 누르고 있기 | 한 번만 — 반복하지 않는다 |
| 끝에 닿음 | 그쪽 버튼이 막힌 모습(`aria-disabled`) — 초점은 남고, 누르면 아무 일도 없다 |
| 지우기(최소 · `removable`) | `onRemove` — 값은 바꾸지 않는다. 항목이 사라지면 초점은 쓰는 쪽이 다음 항목(없으면 목록 머리)으로 옮긴다 |
| 로딩 | 기다리는 버튼의 누르기를 버린다(`aria-busy`). 다른 쪽 버튼은 그쪽에 로딩을 주지 않았으면 그대로 눌린다 |
| 값 칸 | 누르기 · 치기 · 초점 없음 — `Tab` 이 건너뛴다 |
| `Tab` | 줄이기 → 늘리기(값 칸은 건너뛴다) |
| 화살표 키 | 없다 — spinbutton 이 아니다(SEED) |
| Disabled | 두 버튼 `disabled` — 누르기 · 초점 불가, `Tab` 에서 빠진다. 숨은 입력도 막혀 제출되지 않는다 |
| ReadOnly | 두 버튼 `aria-disabled` — 초점은 받고 값은 바뀌지 않으며, 값은 제출된다 |
| 폼 제출 | 숨은 입력(`name`)이 단위 없는 정수를 낸다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 흰 면 16.41 · 다크 13.42(시트 11.62) ✓. 막힘 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral` 16.41 · 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 로딩 원 호 `fg-neutral` 누름 바탕 위 15.48 · 10.32 ✓(트랙 `gray-500` 2.98 · 2.08 은 장식). 오류 테두리 `stroke-critical-solid` 5.06 · 6.08 ✓. 기본 1px 테두리 `stroke-neutral-weak`(1.23 · 1.56) · 선(1.15 · 1.30)은 칸을 알리는 유일한 표시가 아니다 — 두 버튼 아이콘과 라벨이 알린다(Input 과 같다). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 끝의 막힘은 색과 함께 `aria-disabled` 로, 오류는 테두리 두께(1 → 2px)와 Field 오류 글로도 알린다 ✓ |
| **WCAG 2.1.1** Keyboard | `Tab` 으로 두 버튼, `Enter` · `Space` 로 한 단계 ✓ — 화살표 키는 없다(값을 바꾸는 길은 두 버튼 하나뿐이라 키 하나만 익히면 된다) |
| **WCAG 2.4.3** Focus order | 끝에 닿아도 초점이 그 버튼에 남는다(`aria-disabled`) — 본문으로 떨어지지 않는다 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 버튼 바깥 링 2px · 띄움 2px ✓ |
| **WCAG 4.1.3** Status messages | 값 칸 `aria-live="polite"` · `aria-atomic` — 바뀐 값을 단위와 함께 한 번 읽는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 세 크기 모두 버튼 36 이상 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | small 36 · medium 40 은 보이지 않는 여백으로 44 ✓(4 · 2 씩 — 표 칸은 위아래 16 안이라 이웃과 겹치지 않는다) · large 52 ✓. 값 칸은 누르는 자리가 아니다 |
| **WCAG 4.1.2** Name, Role, Value | 루트 `role="group"` + 이름(Field 라벨 `aria-labelledby` · `aria-label`), 버튼 이름 "줄이기" · "늘리기"(지우기면 `removeAriaLabel`), 끝 `aria-disabled`, 로딩 `aria-busy`. 앱은 버튼을 `Semantics(button: true, enabled: …)` 로, 값은 `liveRegion` 으로 읽는다 ✓ |
| **Reduced motion** | 누른 버튼의 축소를 뺀다 · 로딩 원은 고정된 3/4 호(Progress Circle) |

## Do / Don't

### ✅ Do

- 흔한 값이 열 단계 안쪽인 작은 정수에 쓴다.
- 옆 칸과 같은 높이로 — 폼은 `responsive`, 표 칸은 small.
- 최소 · 최대를 데이터로 걸고, 끝에서는 그 버튼만 막는다(초점은 남긴다).
- 단위는 값 칸 글로, 제출은 정수로.
- 지우기를 켜면 무엇을 지우는지 이름을 단다.

### ❌ Don't

- 값 칸을 치게 하기 · 누르고 있으면 빨리 오르게 하기 · 화살표 키로 바꾸는 spinbutton.
- 흔한 값이 먼 정수(12 → 36) · 돈 · 소수 · 날짜 부분 · 띄엄띄엄 이름 붙은 값에 쓰기.
- 버튼 줄 높이(48)에 맞추기 · 한 폼 안에서 옆 칸과 다른 크기.
- 끝에 닿은 버튼에 `disabled` 속성을 걸어 초점을 떨어뜨리기.
- 불투명도로 흐린 막힘 · 이름 없는 묶음 · 라벨에 "(회)".

## Specification

`quantity-picker.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Quantity Picker 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — quantity-picker.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#quantity-picker)

## SEED 와 다른 점

- **웹 폼의 기본 크기는 `responsive`**(1280 미만 large 52 · 이상 medium 40) — SEED react 의 기본은 small 36 이다. 옆 Input 과 같은 규칙이다(사용자 결정 1A). 표 칸 · 줄 안은 small.
- **36 · 40 버튼의 누르는 자리 44** — 보이지 않는 여백을 4 · 2 씩 더한다(기초 Iconography). SEED 는 버튼 크기 그대로다.
- **누름 · 호버 바탕은 불투명한 `bg-layer-default-pressed`** — SEED bg.transparent-pressed 는 투명도가 있어 검사기가 받지 않는다(v102 · button.yaml).
- **끝에 닿은 버튼은 `aria-disabled` 만** — SEED headless 는 `disabled` 속성도 건다(`useQuantityPicker.ts` 235 · 250) — 키보드로 끝까지 누르면 초점이 빠질 수 있다. groo 는 초점을 남긴다(따라오는 것).
- **웹 호버 · 키보드 포커스 링을 적는다**(v106) — SEED rootage 에는 없다(SEED react 는 공용 포커스 링).
- **`getValueText(value)` 는 수 하나를 받는다** — SEED 는 (글, 수) 둘이다. 쓰는 쪽에서는 같다.
- 로딩 원 · 지우기 · fill 은 SEED 그대로다(사용자 결정 3A).

## Migration notes

### 2026-10-15 — SEED Quantity Picker 로 새로 둔다

사용자가 [마무리 비교 페이지](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z)에서 정했다 — SEED 세 크기 36 · 40 · 52(1A — 웹 기본 responsive, 표 칸 36, 36 · 40 버튼은 누르는 자리 44), 값 칸은 치지 못한다(2A — 한 번에 1, 흔한 값이 열 단계보다 먼 자리는 숫자 칸), SEED 능력을 그대로 둔다(3A — 지우기 · 로딩). 그리고 "따라오는 것" — 루트 `role="group"` + 이름 필수 · 버튼 이름 "줄이기 · 늘리기" · 끝은 `aria-disabled`(초점이 남는다) · 값 칸 `aria-live="polite"` · `aria-atomic` · 단위 글은 표시만(`getValueText`) · 제출은 정수(숨은 입력) · 누름 = `bg-layer-default-pressed` + 버튼만 2px 축소 · 오류 2px `stroke-critical-solid` · 막힘 `fg-disabled` · `hug` · `fill`. Button 크기 48(1B) · 40 하나(1C) · 칠 수 있는 값 칸(2B) · 길게 누르기(2C) · 능력 걷기(3B)는 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-15 조사 — 각 레포 origin/main 을 코드로 읽었다). 지금 세 제품 어디에도 `[−] 값 [+]` 는 없다 — 작은 정수는 모두 숫자 칸(웹 `inputMode="numeric"` · HR `type="number"` · 앱 `PTextInput(numbersOnly)`) 아니면 Select 다.

- **HR 휴가 정책 — 승인 필요 횟수(Q1)** — `type="number"` · 최소 0 · **최대 없음** · 빈칸이면 0(`features/admin-vacation-policy/ui/VacationPolicyFormDialog.tsx:866-890`, 입력 `:874-883`). 신청 화면이 승인자 고르기 칸 수를 `min(정책값, 고를 수 있는 승인자 수)` 로 따로 줄인다(`features/vacation-application/ui/ApplicationFormDialog.tsx:101-102 · 656-657`). Quantity Picker 0 ~ 고를 수 있는 승인자 수로 — 신청 화면의 보정이 필요 없어진다.
- **HR 휴가 정책 — 반복 간격(Q2)** — 최소 1 · 최대 100(브라우저 속성뿐) · `value={field.value || 1}` 이라 칸을 비우면 곧바로 1 로 돌아와 "1" 뒤에 이어 쳐진다(`VacationPolicyFormDialog.tsx:941-960`, 입력 `:948-956` — 코드로 본 것). Quantity Picker 1 ~ 100 으로 — 치는 칸이 없어 이 결함이 사라진다.
- **HR 휴가 정책 — 최대 부여 횟수(Q3)** — 최소 1 · **최대 없음** · 필수(`VacationPolicyFormDialog.tsx:1079-1097`, 입력 `:1086-1093` · 검사 `:190-196`). Quantity Picker 로 — 위 끝은 HR 적용 때 정한다(비교 페이지는 99 로 그렸다).
- **HR 부여 시간 — 일 · 시간 · 분(Q6) 세 벌** — 일 `type="number"`(0 ~ 365 속성뿐) · 시간 Select 0 ~ 7 · 분 Select 0 · 30 을 세 화면이 복사해 쓴다(`VacationPolicyFormDialog.tsx:694-790` — 일 `:722-733` · 시간 `:737-753` · 분 `:758-771`, `ApplicationFormDialog.tsx:350-421 · 501-572`, `features/vacation-application/ui/VacationGrantDialog.tsx:353-425`). 공용 부품 하나로 묶으며 시간은 Quantity Picker 0 ~ 7("n시간"), 분(둘뿐)은 Segmented Control. 일은 정책마다 흔한 값이 열 단계 안쪽인지 적용 때 보고, 멀면 숫자 칸으로 둔다(위 Guidelines).
- **HR 업무 보고 표 — 소요시간(Q7)** — 줄 수정 중 표 칸의 `type="number"` 0 ~ 24(속성뿐) · `parseInt`(`features/work-report/ui/ReportTable.tsx:300-317`, 입력 `:303-313`). small 36 으로 — 값 칸이 가장 긴 값("24h")의 폭을 잡아 열 최소 100(안쪽 68)보다 넓어지므로 열이 늘어난다. 단위 글은 보기 상태와 같게("{n}h"). 같은 값이 엑셀 가져오기 미리보기 표에서는 맨 `<input>` 이다(`ExcelImportDialog.tsx:438-444`).
- **Desk 더치페이 비율(Q5)** — 뒤 글은 "%" 인데 계산은 가중치다 — 1 · 1 · 2 를 넣으면 25 · 25 · 50% 가 되고, 소수 · 상한 없음(웹 `features/dutch-pay/ui/DutchPayFromTxDialog.tsx:578-605 · 172-186`, 앱 `features/dutch_pay/presentation/dutch_pay_from_tx_dialog.dart:883-900 · 214-226`). 먼저 정할 일이다 — 정수 몫으로 바꾸면 Quantity Picker("2인분"), 아니면 단위 글을 계산에 맞게 고친다.
- **쓰지 않는 자리** — Desk 반복 거래 "총 n회"(Q4)는 숫자 칸 그대로다(2A — 기본 12 · 흔한 24 · 36). 대신 웹은 상한이 없고(`features/recurring-transaction/ui/RecurringAddDialog.tsx:751-763` · `RecurringFromTxDialog.tsx:272-284`) 앱은 3자리 999 까지라(`features/recurring/presentation/recurring_settings_drawer.dart:585-595`) 서버 `maxOccurrences` 에 범위가 없다 — 웹 · 앱 상한을 맞춘다. 반복 일자(Q9 — 웹 칸은 비우면 `Number('') || 1` 로 1 이 되어 이어 쳐진다, `RecurringAddDialog.tsx:688-703`)는 카드 결제일처럼 Select 1 ~ 31 로, 할부(Q8 — 일시불 · 2 ~ 12 · 18 · 24)는 Select 그대로다.
