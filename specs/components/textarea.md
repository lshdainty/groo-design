# Textarea

> 여러 줄 글을 받는 입력칸입니다. 메모 본문 · 휴가 사유 · 설명 · 탈퇴 사유처럼 길게 쓰는 값을 받고, 쓴 만큼 높이가 자랍니다. 한 줄 값은 [Input](input.md) 을 씁니다.

칸은 상자(Container)와 입력으로 이뤄지고, 모양은 상자형(outline) 하나입니다. 상자 · 테두리 · 상태는 Input 의 상자형과 같고, 다른 것은 높이 · 위아래 여백 · 자라는 방식입니다. 라벨 · 설명 · 오류 · 글자 수는 [Field](field.md) 가 둘레에 그립니다.

수치 원본은 [`textarea.yaml`](textarea.yaml)입니다.

[그림: 메모 · 휴가 사유 — 라이트 · 다크](../../site/components/specs/textarea.tsx#hero)

### 직접 골라 보기

크기 · 자동 높이 · 최대 높이 · 상태 · 글자 수를 바꾸면 칸과 코드가 함께 바뀝니다. 글을 써서 칸이 자라는 모습을 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/textarea.tsx#playground)

## Anatomy

[그림: 칸은 상자와 입력으로 이뤄집니다](../../site/components/specs/textarea.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리입니다. 넘치는 글은 상자 안에서 스크롤합니다. |
| ⓑ Value · Placeholder | 입력 — 쓴 글이고, 비어 있으면 예시 글(placeholder)입니다. 위아래 · 좌우 여백은 입력이 가집니다. |

[표: 부위](textarea.yaml#slots)

## Properties

### Auto Size

자동 높이가 기본입니다. 3줄(large 94 · medium 82)에서 시작해 쓴 만큼 자랍니다. 최대 높이는 기본으로 없고 자리마다 정할 수 있으며, 정하면 그 높이부터 칸 안에서 스크롤합니다. 손잡이(resize)는 두지 않습니다.

자동 높이를 끄면(`autoSize={false}`) 높이를 자리마다 정합니다. 2줄(large 72 · medium 62)보다 낮게 두지 않고, 넘치는 글은 칸 안에서 스크롤합니다. 이때 높이는 반드시 정합니다. 켜 둔 채 자란 칸에서 자동 높이를 끄면 자랄 때 넣은 높이를 걷어 고정 높이로 돌아가고, 넘치는 글은 스크롤됩니다.

[그림: 자동 높이 — 3줄에서 자람 · 최대 높이에서 멈추고 스크롤 · 고정 높이](../../site/components/specs/textarea.tsx#autosize)

[표: 높이](textarea.yaml#compound)

[표: 자동 높이](textarea.yaml#autoSize)

### Size

Input 과 같습니다. `large`(글자 16 · 모서리 12 · 여백 위아래 14 · 좌우 16)는 폰 · 앱에, `medium`(14 · 8 · 12 · 14)은 1280 이상 데스크톱 웹에서만 씁니다. 웹의 기본은 `responsive`(1280 미만 large · 이상 medium)이고, 앱은 늘 large 입니다.

[표: 크기](textarea.yaml#size)

### State

Input 의 상자형과 같습니다. 포커스는 안쪽 2px `stroke-neutral-contrast`(마우스 · 터치도 같습니다), 오류는 안쪽 2px `stroke-critical-solid`(포커스해도 그대로입니다)이고, 비활성 · 읽기 전용은 `bg-disabled` 바탕입니다(흐리게 하지 않습니다). 비활성 글자는 `fg-disabled` 입니다. 읽기 전용은 포커스 표시가 없고(이유와 2.4.7 판정은 [Input](input.md) 에 있습니다), 캐럿은 글자색, 고른 글은 기기 기본 하이라이트입니다.

[그림: 상태 — 기본 · 포커스 · 오류 · 비활성 · 읽기 전용](../../site/components/specs/textarea.tsx#states)

[표: 상태](textarea.yaml#matrix)

[표: 모션](textarea.yaml#motion)

## Guidelines

### 긴 글은 Textarea 로

한 줄을 넘을 수 있는 글(사유 · 설명 · 메모)은 Textarea 로 받습니다. 한 줄 칸에 200자를 받으면 쓴 글을 한눈에 볼 수 없기 때문입니다. 최대 길이가 있으면 Field 의 글자 수를 붙입니다.

[그림: 긴 글 — 자라는 Textarea 와 글자 수 · 한 줄 칸에 받은 탈퇴 사유](../../site/components/specs/textarea.tsx#long-guide)

### 시트 · 대화상자 안에서는 최대 높이

시트나 대화상자처럼 높이가 정해진 곳에서는 최대 높이를 정합니다. 칸이 끝없이 자라면 저장 버튼이 화면 밖으로 밀립니다.

[그림: 최대 높이 — 시트 안에서 칸이 멈추고 스크롤 · 칸이 자라 저장 버튼을 밀어낸 시트](../../site/components/specs/textarea.tsx#max-guide)

### 예시 글은 최소 높이 안에

예시 글(placeholder)은 빈 칸의 최소 높이(3줄) 안에 들게 씁니다. 칸은 쓴 글로 자라고 예시 글로는 자라지 않습니다. 앱에서는 넘치는 예시 줄이 소리 없이 잘리고, 웹에서는 브라우저가 예시 글만큼 칸을 키워(`field-sizing`) 웹 · 앱의 모습이 갈립니다. 예시가 길면 줄여 쓰고, 꼭 필요한 안내는 Field 설명으로 옮깁니다.

### 입력 중인 글의 줄바꿈 — 앱 예외

화면 글은 낱말 단위로 줄을 바꾸지만(웹 keep-all · 앱 U+2060), 앱 입력칸에서 **쓰고 있는 글**은 글자 단위로 바꿉니다. 표시 단계에서 낱말 단위로 바꾸면 캐럿 · 선택 · 한글 조합(IME) 자리가 어긋나고, 값에 U+2060 을 넣으면 저장 · 검색 · 글자 수가 오염되기 때문입니다. 읽기 표시 · 예시 글은 낱말 단위 그대로입니다. 글자 200% 에서는 쓰는 동안만 웹과 줄바꿈 자리가 달라집니다. [Input](input.md) 도 같습니다.

## 코드

레시피 `recipes/shadcn/components/ui/textarea.tsx`(Textarea)를 [Field](field.md) 안에 둡니다. `className` 은 입력에(최대 · 고정 높이 `max-h-*` · `h-*` 도 여기에), 상자에는 `rootClassName` 을 줍니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 기본

[그림: 기본 — 자동 높이와 글자 수](../../site/components/specs/textarea.tsx#ex-basic)

```tsx
import { Field } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

<Field label="휴가 사유" maxGraphemeCount={1000}>
  <Textarea placeholder="예: 가족 행사 참석" />
</Field>
```

### 최대 높이

[그림: 최대 높이 — 240 에서 멈추고 스크롤](../../site/components/specs/textarea.tsx#ex-max)

```tsx
<Field label="메모">
  <Textarea className="max-h-60" />
</Field>
```

### 고정 높이

[그림: 고정 높이 — 넘치면 칸 안에서 스크롤](../../site/components/specs/textarea.tsx#ex-fixed)

```tsx
<Field label="공지 본문">
  <Textarea autoSize={false} className="h-60" />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 포커스 — 테두리가 2px 짙어집니다. |
| 쓰기 · 붙여넣기 | 자동 높이면 글에 맞춰 바로 자랍니다(움직임 없이). 최대 높이에 닿으면 멈추고 스크롤이 생깁니다. |
| 자동 높이를 끌 때 | 자랄 때 넣은 높이 · 넘침 설정을 걷어 고정 높이(2줄 이상)로 돌아갑니다. 넘치는 글은 칸 안에서 스크롤됩니다. |
| 폭이 바뀔 때 | 줄이 다시 감기고 높이를 다시 맞춥니다. |
| 쓰기(최대 글자 수) | 최대에 닿으면 더 들어가지 않습니다. 한글은 조합이 끝난 뒤 자릅니다. |
| `Enter` | 줄을 바꿉니다. 폼을 제출하지 않습니다. |
| Disabled | 포커스 · 입력을 받지 않습니다. 커서는 not-allowed 입니다. |
| Readonly | 포커스 · 복사 · 스크롤은 되고 입력은 되지 않습니다. 포커스 표시가 없습니다(Input 과 같습니다). |
| 글자 크기 설정 | 값 · placeholder 가 커지고 줄을 바꿔 받습니다. 최소 높이(3줄 · 2줄)는 px 이고, 글이 커지면 자동 높이 칸은 내용을 따라 늘어나며 고정 칸은 안에서 스크롤합니다. 폭은 그대로입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42, 읽기 전용 바탕 위 값 15.20 · 10.32 ✓. placeholder `fg-placeholder` 4.18 · 4.13(시트 다크 3.58) — 4.5:1 에 못 미치는 것을 알고 쓰는 값입니다. 비활성 `fg-disabled` 는 기준 밖입니다(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 테두리 16.41 · 13.42, 오류 5.06 · 6.08 ✓. 기본 1px 테두리(1.23 · 1.56)는 라벨 · placeholder 와 함께 칸을 알립니다 |
| **WCAG 1.4.4** Resize text | 값 · placeholder 가 글자 크기 설정을 따라 커지고, 칸이 내용을 따라 늘어나거나(자동 높이) 안에서 스크롤해(고정) 글이 잘리지 않습니다 ✓ |
| **WCAG 1.4.10** Reflow | 자동 높이라 가로 스크롤 없이 글이 감깁니다 |
| **WCAG 2.4.7** Focus visible | 편집 칸은 포커스하면 테두리가 2px 짙어집니다 ✓. 읽기 전용은 포커스 표시가 없습니다 ⚠ — 이유는 [Input](input.md) 의 같은 줄에 있습니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 최소 높이 62 이상 ✓ |
| **ARIA** | 이름은 Field 의 라벨입니다. 오류면 `aria-invalid`, 설명 · 오류 · 글자 수는 `aria-describedby` 로 잇습니다(Field 가 잇습니다) |

## Do / Don't

### ✅ Do

- 긴 글은 Textarea 로 받고, 최대 길이가 있으면 글자 수를 붙입니다.
- 시트 · 대화상자 안에서는 최대 높이를 정합니다.
- 자동 높이를 끄면 높이를 정합니다(2줄 이상).

### ❌ Don't

- 긴 글을 한 줄 칸으로 받지 않습니다.
- 손잡이로 높이를 바꾸게 하지 않습니다.
- 고정 높이를 2줄보다 낮게 두지 않습니다.
- 비활성 칸을 불투명도로 흐리게 그리지 않습니다.

## Specification

`textarea.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다. 웹 · 앱은 Textarea 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — textarea.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#textarea)
