# Checkbox

> 사용자가 하나 이상의 옵션을 고르게 하는 컴포넌트. 여러 항목 가운데 여러 개를 고르거나, 저장하기 전에 켜고 끌 것을 모아 둘 때 쓴다.

구조는 당근 [SEED Checkbox](https://seed-design.io/components/checkbox)(Apache-2.0)를 따른다 — 칸(Checkmark) · 칸 + 라벨(Checkbox) · 묶음(Checkbox Group). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-09-30 사용자 결정).

수치 원본은 [`checkbox.yaml`](checkbox.yaml) 이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 선택 안 됨 · 선택 · 일부 선택 — Square 의 neutral · brand 와 Ghost, 위는 라이트 아래는 다크](../../site/components/specs/checkbox.tsx#hero)

### 직접 골라 보기

크기 · 모양 · 톤 · 굵기 · 상태를 고르면 스펙대로 그린 Checkbox 와 그 코드가 바뀐다. 칸은 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/checkbox.tsx#playground)

## Anatomy

[그림: Checkbox 는 칸(Checkmark)과 라벨로 이뤄진다 — 칸은 따로 떼어 목록 행에 넣어 쓸 수 있다](../../site/components/specs/checkbox.tsx#anatomy)

| ⓐ Checkmark | 칸 — 배경 · 테두리 · 모양. 체크 · 가로줄 아이콘이 들어간다. 따로 떼어 목록 행 · 표 머리에 쓴다. |
| ⓑ Icon | 체크(선택) · 가로줄(일부 선택). lucide `Check` · `Minus`, 선 3. |
| ⓒ Label | 무엇을 고르는지. 칸과 함께 눌린다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움(v106). |

[표: 부위](checkbox.yaml#slots)

## Properties

### Size

두 가지다. 칸 · 라벨 · 줄 높이가 함께 정해진다.

- `medium`(칸 20 · 라벨 14 · 줄 32) — 기본. 화면 안의 목록 · 설정.
- `large`(칸 24 · 라벨 16 · 줄 36) — 한 화면의 중심 선택, 모바일에서 홀로 서는 선택.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힌다(기초 Inclusive — 44 는 반드시).

[그림: 크기 두 가지 — 칸 · 라벨 · 줄 높이](../../site/components/specs/checkbox.tsx#sizes)

[표: 크기](checkbox.yaml#size)

칸 모양마다 아이콘 크기가 다르다 — Ghost 는 칸이 없어 아이콘이 크다.

[표: 크기별 아이콘 — Square](checkbox.yaml#grid.size.shape.square)

[표: 크기별 아이콘 — Ghost](checkbox.yaml#grid.size.shape.ghost)

모든 조합에 공통인 값:

[표: 공통](checkbox.yaml#base)

### Weight

라벨 굵기다. 강조하거나 묶음의 부모처럼 한 단계 위에 설 때 `bold`.

[그림: 라벨 굵기 — regular · bold](../../site/components/specs/checkbox.tsx#weight)

[표: 굵기](checkbox.yaml#weight)

### Tone

선택했을 때의 색이다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 쓴다 — 버튼에서 정한 "브랜드 색은 꼭 필요한 곳에만" 과 같다. Radio · Switch 도 같은 규칙이다.

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/checkbox.tsx#tones)

### Shape

- `square` — 칸 + 체크. 여러 개를 고르는 목록, 사용자가 알고 골라야 하는 선택(기본).
- `ghost` — 칸 없이 체크만. 선택 안 됨도 옅은 체크로 보인다. 필수가 아니고 셋 이하일 때.

Desk 할 일 완료의 동그라미 체크는 Checkbox 의 모양이 아니다 — 할 일 목록 컴포넌트 차례에 정한다(사용자 결정).

[그림: 모양 두 가지 — Square · Ghost](../../site/components/specs/checkbox.tsx#shapes)

### State

체크 여부(선택 안 됨 · 선택 · 일부 선택)와 상호작용 상태가 곱해진다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 누름 색과 같다(v106), 축소는 없다 |
| `focused` | 웹. 키보드 포커스에만 링 2px · 띄움 2px(v106) |
| `pressed` | 누름 색 + 칸 세로 2px 거리 축소(v104). 라벨은 줄지 않는다 |
| `disabled` | 전용 색(`bg-disabled` · `fg-disabled`, v106). 불투명도로 흐리게 하지 않는다 |

[그림: 체크 여부 × 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸다](../../site/components/specs/checkbox.tsx#states)

[표: 상태 매트릭스 — Square · 선택 안 됨](checkbox.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — Square · neutral · 선택](checkbox.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — Ghost · neutral · 선택](checkbox.yaml#matrix.shape.ghost.checked.checked)

[그림: 직접 눌러 보기 — 칸이나 라벨을 누르면 바뀐다(Tab 으로 포커스)](../../site/components/specs/checkbox.tsx#live)

[표: 모션](checkbox.yaml#motion)

### Group

여러 항목을 묶어 세로로 쌓는다. 줄 사이는 12 다 — 줄 높이 32 · 36 에 더하면 44 · 48 마다 한 줄이 서서, 묶음 안에서도 줄마다 누르는 영역 44 를 온전히 받는다(사용자 결정). 줄은 칸 + 라벨만큼만 차지하고 묶음 폭으로 늘이지 않는다. 부모 Checkbox 를 맨 위에 둘 수 있다 — 부모를 고르면 자식이 모두 선택되고, 자식을 일부만 고르면 부모는 일부 선택(가로줄)이 된다.

[그림: 묶음 — 부모를 눌러 보거나 자식을 하나씩 눌러 보면 부모가 따라 바뀐다](../../site/components/specs/checkbox.tsx#group)

[표: 묶음](checkbox.yaml#base@group)

## Guidelines

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역이다 — 위아래로 44 까지 넓히고, 묶음에서는 줄 사이 12 가 이 영역이 서로 겹치지 않게 한다. 목록처럼 칸(Checkmark)만 행에 넣어 쓸 때는 **행 전체**가 눌려야 한다.

[그림: 누르는 영역(분홍) — Checkbox 는 칸 + 라벨, 목록 행은 행 전체](../../site/components/specs/checkbox.tsx#touch-target)

### 묶음 쓰기

항목이 여럿이면 묶음으로 둔다. 모두를 한 번에 고를 일이 있으면 부모를 맨 위에 둔다.

[그림: Desk 데이터 내보내기 — 아무것도 · 모두 · 일부 골랐을 때의 부모](../../site/components/specs/checkbox.tsx#group-guide)

### 모양 고르기

필수가 아니고 셋 이하면 `ghost`, 필수이거나 사용자가 알고 골라야 하면 `square` 다.

[그림: 모양 고르기](../../site/components/specs/checkbox.tsx#shape-guide)

### 선택 색

선택 색은 짙은 회색이 기본이다. 브랜드 색은 서비스 핵심 흐름에만 — 체크가 많은 화면에 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어진다.

[그림: 선택 색](../../site/components/specs/checkbox.tsx#tone-guide)

### 오류

칸 모양은 바꾸지 않는다. 묶음 아래에 무엇을 해야 하는지 글로 알린다(사용자 결정 — SEED 와 같다). 오늘 제품의 체크 오류는 모두 묶음 단위(하나 이상 고르기)다. 묶음을 [Field](field.md) 로 감싸면 그 꼬리가 오류 글 자리이고, 라벨은 묶음의 이름으로 이어진다(2026-10-01). Field 의 오류 · 막힘도 칸에 닿는다 — 오류면 칸마다 `aria-invalid`, 막히면 묶음 `aria-disabled` 와 칸마다 `disabled` 다(2026-10-08). 묶음(`role="group"`)에는 `aria-invalid` · `aria-required` 를 달지 않는다 — 그 역할은 받지 않는다(SEED 와 같다).

[그림: 오류는 묶음 아래 글로](../../site/components/specs/checkbox.tsx#error)

### Checkbox 와 Switch

둘 다 켜고 끄는 선택을 보인다.

| | Checkbox | Switch |
|---|---|---|
| 값이 적용될 때 | 저장 같은 액션을 해야 적용(권장) | 누르는 순간 적용 — 저장해야 적용되는 값에는 쓰지 않는다 |
| 항목 구성 | 한 묶음에 여러 항목 | 항목마다 따로 |
| 하위 항목 | 부모가 모두를 고르고 풀 수 있다 | 부모와 하위 사이 관계 없음 |

[그림: 저장해야 적용되는 폼은 Checkbox, 바로 적용되는 설정은 Switch](../../site/components/specs/checkbox.tsx#vs-switch)

## 코드

레시피 `recipes/shadcn/components/ui/checkbox.tsx` 를 쓴다 — `Checkbox`(칸 + 라벨) · `Checkmark`(칸) · `CheckboxGroup`(묶음). 아래 미리보기는 스펙 값으로 그린 모습이다.

### 기본

[그림: 기본 — medium · square · neutral](../../site/components/specs/checkbox.tsx#ex-basic)

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<Checkbox label="단종된 카드도 보기" />
```

### 크기 · 굵기

[그림: 크기 · 굵기](../../site/components/specs/checkbox.tsx#ex-sizes)

```tsx
<Checkbox size="medium" label="medium" />
<Checkbox size="large" label="large" />
<Checkbox size="large" weight="bold" label="large · bold" />
```

### 모양 · 톤

[그림: 모양 · 톤](../../site/components/specs/checkbox.tsx#ex-variants)

```tsx
<Checkbox defaultChecked label="neutral" />
<Checkbox defaultChecked tone="brand" label="brand" />
<Checkbox defaultChecked shape="ghost" label="ghost" />
```

### 묶음 · 일부 선택

[그림: 묶음 · 일부 선택](../../site/components/specs/checkbox.tsx#ex-group)

```tsx
const all = ["tx", "budget", "memo"] as const
const [picked, setPicked] = useState<string[]>(["tx"])
const parent = picked.length === all.length ? true : picked.length ? "indeterminate" : false

<CheckboxGroup aria-label="내보낼 데이터">
  <Checkbox weight="bold" label="전체" checked={parent}
    onCheckedChange={(v) => setPicked(v === true ? [...all] : [])} />
  <Checkbox label="거래 내역" checked={picked.includes("tx")}
    onCheckedChange={(v) => setPicked((p) => (v ? [...p, "tx"] : p.filter((x) => x !== "tx")))} />
  {/* 예산 · 메모도 같은 방식 */}
</CheckboxGroup>
```

### 비활성

[그림: 비활성](../../site/components/specs/checkbox.tsx#ex-disabled)

```tsx
<Checkbox disabled label="이 카드 기억하기" />
<Checkbox disabled defaultChecked label="이 카드 기억하기" />
```

### 칸만(목록 행)

목록 줄은 List 의 `ListCheckItem` 을 쓴다 — 줄의 여백 · 글자 · 누름이 정해져 있다. 표처럼 행을 따로 짜야 할 때만 아래처럼 행을 `<label>` 로 감싸 행 어디를 눌러도 선택되게 하고, `group/checkbox` 를 달아 행을 누르거나 올려도 칸이 누름 색 · 축소로 반응하게 한다.

[그림: 칸만 — 행 전체가 누르는 영역](../../site/components/specs/checkbox.tsx#ex-checkmark)

```tsx
import { Checkmark } from "@/components/ui/checkbox"

<label className="group/checkbox flex cursor-pointer items-center gap-x3 px-x6 py-x3">
  <Checkmark checked={selected} onCheckedChange={setSelected} aria-label="9월 25일 월급 선택" />
  <span className="flex-1">월급</span>
  <span>+3,200,000원</span>
</label>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap(칸 · 라벨) | 선택 ↔ 선택 안 됨. 일부 선택이면 선택으로. `disabled` 면 무시. |
| Keyboard `Space` | 포커스 상태에서 누르기와 같다. |
| Keyboard `Enter` | 폼을 제출한다 — 진짜 `<input type="checkbox">` 처럼 폼의 기본 버튼(첫 제출 버튼)을 누른다. 칸은 바뀌지 않는다. 기본 버튼이 없거나 막혀 있으면 아무것도 하지 않는다. Radix 는 Enter 를 막기만 해서 레시피가 연다(사용자 결정 2026-10-08 — SEED 와 같다). 칸만(`Checkmark`) 쓰는 자리 · List 의 체크 줄 · Select Box 여럿 고르기도 같다. |
| Keyboard `Tab` | 다음 포커스로. 묶음 안의 항목도 하나씩 들어간다. |
| 부모(일부 선택) | 누르면 자식을 모두 선택. 다 선택이면 모두 해제. |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠진다. 묶음에 `disabled` 를 주거나 막힌 Field 로 감싸면 칸이 모두 막힌다(묶음 `aria-disabled`). |

**Form 안** — `<input type="checkbox">`(또는 Radix 의 숨은 input)는 폼 제출에 들어간다. 여러 개의 결과는 배열이다. 검증은 `onSubmit` 또는 묶음을 떠날 때 — 누르는 동안 오류를 띄우지 않는다.

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 흰 표면 16:1+ ✓ |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 선택 안 된 칸 테두리 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 선택 채움 `bg-neutral-inverted` 16:1+ ✓ · Ghost 선택 안 됨은 `fg-placeholder` 5.5:1 ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 20 · 24 + 라벨까지 묶은 줄 32 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 위아래 44 로 넓힌다 ✓. 묶음 안에서도 줄 사이 12 라 줄마다 44 · 48 을 받는다(줄 사이가 4 면 이웃과 겹쳐 36 · 40 이 된다) — 목록 행에서 칸만 쓰면 행 전체 |
| **ARIA** | `role="checkbox"` + `aria-checked="true · false · mixed"`(mixed = 일부 선택). 라벨은 `<label>` 로 묶거나 `aria-labelledby`. 칸만 쓰면 `aria-label` 필수. 묶음은 `<fieldset>` + `<legend>`(또는 `role="group"` + `aria-labelledby`), 오류 글은 묶음에 `aria-describedby`. 오류면 칸마다 `aria-invalid`, 막히면 묶음 `aria-disabled` + 칸마다 `disabled` — `role="group"` 은 `aria-invalid` · `aria-required` 를 받지 않아 묶음에는 달지 않는다(Field 로 감싸면 레시피가 건다). |
| **Reduced motion** | 모션 줄이기면 누름 축소를 빼고 색만 바꾼다(기초 Motion). |

## Do / Don't

### ✅ Do

- 모든 Checkbox 에 라벨을 둔다(보이는 글자 또는 `aria-label`).
- 여러 개 고르기는 Checkbox, 하나만 고르기는 Radio, 바로 적용되는 켜기 · 끄기는 Switch.
- 부모 · 자식 묶음에서 일부만 고르면 부모는 일부 선택으로 둔다.
- 목록 행에 칸만 넣으면 행 전체가 눌리게 한다.
- 약관 보기 같은 링크는 라벨 옆이나 아래에 둔다 — 라벨은 고르는 글만.

### ❌ Don't

- 바로 적용되는 켜기 · 끄기에 Checkbox — "알림 받기" 는 Switch 다.
- 하나만 고르는 묶음에 Checkbox — Radio 를 쓴다.
- 선택 색을 브랜드로 깔아 두기 — 브랜드 색은 핵심 흐름에서만.
- 오류를 칸 색만으로 알리기 — 묶음 아래 글로 알린다.
- 라벨 안에 링크 · 버튼 — 줄의 누르는 영역(44)이 덮어 눌리지 않는다. 라벨 옆이나 아래에 따로 둔다(사용자 결정 2026-10-08).

## Specification

`checkbox.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Checkbox 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — checkbox.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#checkbox)

## SEED 와 다른 점

- **선택 안 된 칸의 테두리는 `stroke-neutral-solid`**(3:1 이상, v109). SEED 는 옅은 선(stroke.neutral-weak)이지만 porest 는 칸을 선으로 알아봐야 한다(1.4.11).
- 투명한 누름(SEED bg.transparent-pressed) · 비활성 테두리(stroke.neutral-muted)는 불투명한 가장 가까운 역할(`bg-layer-default-pressed` · `stroke-neutral-weak`)로 — 8자리 hex 를 lint 가 거부한다.
- Ghost 의 누름 바탕(SEED palette.gray-200 · carrot-200)은 역할 색 `bg-neutral-weak` · `bg-brand-weak-pressed` 로.
- **묶음 줄 사이는 12**(사용자 결정) — SEED 는 4 다. 4 면 이웃 줄의 누르는 영역(44)과 겹쳐 한 줄이 실제로 36 · 40 만 받는다. porest 는 기초에서 44 를 반드시로 정했다(Inclusive Design).
- 웹의 `hovered` · `focused` 를 더한다(v106).
- 아이콘은 lucide(선 3) — SEED 는 채운 체크 아이콘.

## Migration notes

### 2026-10-08 — Enter · 묶음 상태 · 라벨 안 링크

앱 적용(desk-front #428 ~ #430 · desk-app #407 ~ #410)이 남긴 문제를 사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6)에서 정했다.

- **Enter**(B1) — 스펙은 "Enter 는 폼 제출에 둔다" 인데 Radix 는 Enter 를 막기만 해 아무 일도 없었다. 레시피의 칸(`Checkmark`)이 Enter 를 받아 폼의 기본 버튼을 누른다 — 진짜 input · SEED 와 같다. 칸은 바뀌지 않고, 고르기는 Space 다. `Checkmark` 를 쓰는 List 의 체크 줄 · Select Box 여럿 고르기도 같이 바뀌었다.
- **묶음 상태**(9) — Field 의 오류 · 막힘이 묶음에 닿지 않았다(막힌 Field 안의 칸이 눌렸다). 오류는 칸마다 `aria-invalid`, 막힘은 묶음 `aria-disabled` + 칸마다 `disabled` 로 건다. 필수는 묶음에 걸지 않는다(`role="group"` 은 받지 않는다) — 고르지 않고 내면 오류 글이 알린다. `CheckboxGroup` 에 `disabled` 를 더했다.
- **라벨 안 링크**(C1) — 줄의 누르는 영역이 라벨 안 링크를 덮는다. 레시피는 그대로 두고 Don't 에 적었다 — 링크는 라벨 옆 · 아래에.

### 2026-09-30 — 묶음 줄 사이 12 · 모션 표

Radio 를 옮기다 드러난 것을 Checkbox 에도 맞췄다(porest-design#143 뒤).

| 옛 | 새 |
|---|---|
| 묶음 줄 사이 4(SEED 값) — 이웃 줄과 44 영역이 겹쳐 한 줄이 36 · 40 만 받았다 | 줄 사이 12(`spacing-x3`) — 줄마다 44 · 48. 사용자 결정(기초의 "44 를 반드시") |
| 줄 맞춤을 적지 않음 — 레시피는 줄을 묶음 폭으로 늘이고 미리보기는 내용만큼 | 줄은 칸 + 라벨만큼만(`alignSelf: flex-start`), 네 곳 모두 |
| 모션 표: 아이콘 scale 0.8 → 1 · 불투명도(옛 스펙에서 온 값 — 레시피 · 미리보기 어디에도 구현된 적이 없다) | 색 전환(채움 · 테두리 · 아이콘 색) + 누름 축소 — 구현 그대로이고 SEED Checkmark 와 같다 |
| 칸(버튼) 위 커서 기본 화살표 | 손가락(`cursor-pointer`) — 라벨 위와 같게 |

### 2026-09-30 — SEED Checkbox 구조로

사용자가 비교 페이지(https://claude.ai/artifact/SERp881jg537tG3nMxeUEB)에서 정했다 — 틀은 SEED(Checkmark · Checkbox · Checkbox Group, 크기 medium 20 · large 24 + 라벨 14 · 16 + 줄 32 · 36) · 선택 색은 neutral 기본 + brand 선택(Radio · Switch 도 같은 규칙) · 모양은 Square + Ghost(할 일 동그라미는 할 일 목록 차례에) · 오류는 묶음 아래 글만.

| 옛 | 새 |
|---|---|
| `sm`(16) · `md`(18, 기본) · `lg`(20) | `medium`(20, 기본) · `large`(24) |
| 선택 = `primary`(브랜드) 채움 | 선택 = `bg-neutral-inverted`(짙은 회색), `tone="brand"` 면 `bg-brand-solid` |
| 선택 안 됨 테두리 `border-strong` · 바탕 `surface-default` · 호버 `surface-input` | 테두리 `stroke-neutral-solid` · 바탕 투명 · 호버 = 누름 `bg-layer-default-pressed` |
| 비활성 50% 흐림 | `bg-disabled` · `fg-disabled`(v106) |
| 오류 `aria-invalid` 빨간 테두리 | 없음 — 묶음 아래 안내 글 |
| 라벨은 쓰는 쪽이(`label-md` 14/500 · `gap-2`) | `Checkbox` 가 라벨까지 — t4 14/400(굵게는 `weight="bold"` 700) |
| 칸 컴포넌트 이름 `Checkbox` | 칸은 `Checkmark`, `Checkbox` 는 칸 + 라벨 |

제품은 앱 적용 단계에서 옮긴다 — Desk 웹 공용 Checkbox 6곳 · 앱 PCheckbox 5곳 · HR 웹 shadcn 기본 체크박스 19곳. Desk 의 손으로 그린 흉내(더치페이 참여자 · "나도 포함" · 캘린더 보이기 — 캘린더는 칸 색이 캘린더마다 제 색이라 캘린더 차례에)와 HR 의 일부 선택 없음(권한 "전체" 가 빈칸에 체크)도 그때.

다른 컴포넌트 — Table 의 선택 열(`table.md` ⓙ · `table-examples.mjs`)은 칸(`Checkmark`)을 쓰고 행 전체가 누르는 영역이 된다. Table 차례에 옮긴다. 메뉴의 체크 항목(Dropdown · Context · Menubar 의 CheckboxItem)은 이 컴포넌트가 아니다.

### 2026-09-29 — 수치를 YAML 로

수치 표를 `checkbox.yaml` 로 옮겼다(값은 그대로). 이전 md 는 `checkbox.history/v-pre-yaml-numbers.md`.
