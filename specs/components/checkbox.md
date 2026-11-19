# Checkbox

> 하나 이상의 옵션을 고르게 하는 컴포넌트입니다. 여러 항목 가운데 여러 개를 고르거나, 저장하기 전에 켜고 끌 것을 모아 둘 때 씁니다.

칸(Checkmark) · 칸 + 라벨(Checkbox) · 묶음(Checkbox Group) 세 가지로 씁니다.

수치 원본은 [`checkbox.yaml`](checkbox.yaml)입니다.

[그림: 선택 안 됨 · 선택 · 일부 선택 — Square 의 neutral · brand 와 Ghost, 위는 라이트 아래는 다크](../../site/components/specs/checkbox.tsx#hero)

### 직접 골라 보기

크기 · 모양 · 톤 · 굵기 · 상태를 고르면 스펙대로 그린 Checkbox 와 그 코드가 바뀝니다. 칸은 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/checkbox.tsx#playground)

## Anatomy

[그림: Checkbox 는 칸(Checkmark)과 라벨로 이뤄지고, 칸은 따로 떼어 목록 행에 넣어 쓸 수 있습니다](../../site/components/specs/checkbox.tsx#anatomy)

| ⓐ Checkmark | 칸 — 배경 · 테두리 · 모양. 체크 · 가로줄 아이콘이 들어갑니다. 따로 떼어 목록 행 · 표 머리에 씁니다. |
| ⓑ Icon | 체크(선택) · 가로줄(일부 선택). lucide `Check` · `Minus`, 선 3. |
| ⓒ Label | 무엇을 고르는지. 칸과 함께 눌립니다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움. |

[표: 부위](checkbox.yaml#slots)

## Properties

### Size

두 가지입니다. 칸 · 라벨 · 줄 높이가 함께 정해집니다.

- `medium`(칸 20 · 라벨 14 · 줄 32) — 기본. 화면 안의 목록 · 설정.
- `large`(칸 24 · 라벨 16 · 줄 36) — 한 화면의 중심 선택, 모바일에서 홀로 서는 선택.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힙니다(기초 Inclusive — 44 는 반드시 지킵니다).

[그림: 크기 두 가지 — 칸 · 라벨 · 줄 높이](../../site/components/specs/checkbox.tsx#sizes)

[표: 크기](checkbox.yaml#size)

칸 모양마다 아이콘 크기가 다릅니다 — Ghost 는 칸이 없어 아이콘이 큽니다.

[표: 크기별 아이콘 — Square](checkbox.yaml#grid.size.shape.square)

[표: 크기별 아이콘 — Ghost](checkbox.yaml#grid.size.shape.ghost)

모든 조합에 공통인 값입니다.

[표: 공통](checkbox.yaml#base)

### Weight

라벨 굵기입니다. 강조하거나 묶음의 부모처럼 한 단계 위에 설 때 `bold` 를 씁니다.

[그림: 라벨 굵기 — regular · bold](../../site/components/specs/checkbox.tsx#weight)

[표: 굵기](checkbox.yaml#weight)

### Tone

선택했을 때의 색입니다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 씁니다 — Button 의 "브랜드 색은 꼭 필요한 곳에만" 과 같습니다. Radio · Switch 도 같은 규칙입니다.

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/checkbox.tsx#tones)

### Shape

- `square` — 칸 + 체크. 여러 개를 고르는 목록, 사용자가 알고 골라야 하는 선택(기본).
- `ghost` — 칸 없이 체크만. 선택 안 됨도 옅은 체크로 보입니다. 필수가 아니고 셋 이하일 때 씁니다.

Desk 할 일 완료도 할 일 줄 앞의 Checkbox `square` 입니다 — 동그라미 체크는 따로 두지 않습니다.

[그림: 모양 두 가지 — Square · Ghost](../../site/components/specs/checkbox.tsx#shapes)

### State

체크 여부(선택 안 됨 · 선택 · 일부 선택)와 상호작용 상태가 곱해집니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 누름 색과 같고, 축소는 없습니다 |
| `focused` | 웹 · 앱. 키보드 포커스에만 링 2px · 띄움 2px. 앱은 하드웨어 키보드로 옮길 때만 그리고 손가락으로 누를 때는 그리지 않습니다 |
| `pressed` | 누름 색 + 칸 세로 2px 거리 축소. 라벨은 줄지 않습니다 |
| `disabled` | 전용 색(`bg-disabled` · `fg-disabled`). 불투명도로 흐리게 하지 않습니다 |

[그림: 체크 여부 × 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸습니다](../../site/components/specs/checkbox.tsx#states)

[표: 상태 매트릭스 — Square · 선택 안 됨](checkbox.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — Square · neutral · 선택](checkbox.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — Ghost · neutral · 선택](checkbox.yaml#matrix.shape.ghost.checked.checked)

[그림: 직접 눌러 보기 — 칸이나 라벨을 누르면 바뀝니다(Tab 으로 포커스)](../../site/components/specs/checkbox.tsx#live)

[표: 모션](checkbox.yaml#motion)

### Group

여러 항목을 묶어 세로로 쌓습니다. 줄 사이는 12 입니다 — 줄 높이 32 · 36 에 더하면 44 · 48 마다 한 줄이 서서, 묶음 안에서도 줄마다 누르는 영역 44 를 온전히 받습니다. 줄은 칸 + 라벨만큼만 차지하고 묶음 폭으로 늘이지 않습니다. 부모 Checkbox 를 맨 위에 둘 수 있습니다 — 부모를 고르면 자식이 모두 선택되고, 자식을 일부만 고르면 부모는 일부 선택(가로줄)이 됩니다.

[그림: 묶음 — 부모를 눌러 보거나 자식을 하나씩 눌러 보면 부모가 따라 바뀝니다](../../site/components/specs/checkbox.tsx#group)

[표: 묶음](checkbox.yaml#base@group)

## Guidelines

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역입니다 — 위아래로 44 까지 넓히고, 묶음에서는 줄 사이 12 가 이 영역이 서로 겹치지 않게 합니다. 목록 · 표의 선택 열처럼 칸(Checkmark)만 행에 넣어 쓸 때는 **행 전체**가 눌려야 합니다.

[그림: 누르는 영역(분홍) — Checkbox 는 칸 + 라벨, 목록 행은 행 전체](../../site/components/specs/checkbox.tsx#touch-target)

### 묶음 쓰기

항목이 여럿이면 묶음으로 둡니다. 모두를 한 번에 고를 일이 있으면 부모를 맨 위에 둡니다.

[그림: Desk 데이터 내보내기 — 아무것도 · 모두 · 일부 골랐을 때의 부모](../../site/components/specs/checkbox.tsx#group-guide)

### 모양 고르기

필수가 아니고 셋 이하면 `ghost`, 필수이거나 사용자가 알고 골라야 하면 `square` 입니다.

[그림: 모양 고르기](../../site/components/specs/checkbox.tsx#shape-guide)

### 선택 색

선택 색은 짙은 회색이 기본입니다. 브랜드 색은 서비스 핵심 흐름에만 씁니다 — 체크가 많은 화면에 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어집니다.

[그림: 선택 색](../../site/components/specs/checkbox.tsx#tone-guide)

### 오류

칸 모양은 바꾸지 않습니다. 묶음 아래에 무엇을 해야 하는지 글로 알립니다. 체크 오류는 묶음 단위(하나 이상 고르기)로 냅니다. 묶음을 [Field](field.md) 로 감싸면 그 꼬리가 오류 글 자리이고, 라벨은 묶음의 이름으로 이어집니다. Field 의 오류 · 막힘도 칸에 닿습니다 — 오류면 칸마다 `aria-invalid`, 막히면 묶음 `aria-disabled` 와 칸마다 `disabled` 입니다. 묶음(`role="group"`)에는 `aria-invalid` · `aria-required` 를 달지 않습니다 — 그 역할은 이 속성을 받지 않습니다.

[그림: 오류는 묶음 아래 글로](../../site/components/specs/checkbox.tsx#error)

### Checkbox 와 Switch

둘 다 켜고 끄는 선택을 보입니다.

| | Checkbox | Switch |
|---|---|---|
| 값이 적용될 때 | 저장 같은 액션을 해야 적용(권장) | 누르는 순간 적용 — 저장해야 적용되는 값에는 쓰지 않습니다 |
| 항목 구성 | 한 묶음에 여러 항목 | 항목마다 따로 |
| 하위 항목 | 부모가 모두를 고르고 풀 수 있습니다 | 부모와 하위 사이 관계 없음 — 위가 꺼지면 아래를 막습니다(값은 그대로) |
| 경계 사례 | 고정 금액으로 기록(켜면 금액 칸이 나와도 저장 때 반영) · 자동 기록 · 상단에 고정 | 결제 알림 · 단종 카드 포함(누르면 목록이 바로 바뀝니다) · 일정의 종일(저장 폼 안이어도 날짜 칸이 바로 바뀝니다) |

누르는 순간 바뀌는 것만 Switch 입니다. 이 표는 Checkbox 와 Switch 가 함께 쓰는 한 벌이고, Switch 문서는 이 표를 가리킵니다. 다른 고르는 컴포넌트와의 표는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기)에 있습니다.

[그림: 저장해야 적용되는 폼은 Checkbox, 바로 적용되는 설정은 Switch](../../site/components/specs/checkbox.tsx#vs-switch)

## 코드

레시피 `recipes/shadcn/components/ui/checkbox.tsx` 를 씁니다 — `Checkbox`(칸 + 라벨) · `Checkmark`(칸) · `CheckboxGroup`(묶음). 메뉴의 체크 항목(Dropdown · Context · Menubar 의 CheckboxItem)은 이 컴포넌트가 아닙니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

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

목록 줄은 List 의 `ListCheckItem` 을 씁니다 — 줄의 여백 · 글자 · 누름이 정해져 있습니다. 표처럼 행을 따로 짜야 할 때만 아래처럼 행을 `<label>` 로 감싸 행 어디를 눌러도 선택되게 하고, `group/checkbox` 를 달아 행을 누르거나 올려도 칸이 누름 색 · 축소로 반응하게 합니다.

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
| Keyboard `Space` | 포커스 상태에서 누르기와 같습니다. |
| Keyboard `Enter` | 폼을 제출합니다 — 진짜 `<input type="checkbox">` 처럼 폼의 기본 버튼(첫 제출 버튼)을 누릅니다. 칸은 바뀌지 않습니다. 기본 버튼이 없거나 막혀 있으면 아무것도 하지 않습니다. Radix 는 Enter 를 막기만 하므로 레시피가 이 동작을 엽니다. 칸만(`Checkmark`) 쓰는 자리 · List 의 체크 줄 · Select Box 여럿 고르기도 같습니다. |
| Keyboard `Tab` | 다음 포커스로. 묶음 안의 항목도 하나씩 들어갑니다. |
| 글자 크기 설정 | 라벨이 커지고 줄을 바꿔 받습니다 — 줄의 최소 높이가 글을 따라 늘어납니다. 칸 · 체크는 크기를 그대로 둡니다 |
| 부모(일부 선택) | 누르면 자식을 모두 선택. 다 선택이면 모두 해제. |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠집니다. 묶음에 `disabled` 를 주거나 막힌 Field 로 감싸면 칸이 모두 막힙니다(묶음 `aria-disabled`). |

**Form 안** — `<input type="checkbox">`(또는 Radix 의 숨은 input)는 폼 제출에 들어갑니다. 여러 개의 결과는 배열입니다. 검증은 `onSubmit` 또는 묶음을 떠날 때 합니다 — 누르는 동안 오류를 띄우지 않습니다.

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 흰 표면 16:1+ ✓ |
| **WCAG 1.4.4** Resize text | 라벨이 글자 크기 설정을 따라 커지고 줄이 따라 늘어납니다 ✓. 칸 · 체크는 컨트롤 모양이라 크기를 그대로 둡니다 |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 선택 안 된 칸 테두리 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 선택 채움 `bg-neutral-inverted` 16:1+ ✓ · Ghost 선택 안 됨은 `fg-placeholder` 4.18:1(다크 4.13:1) ✓ |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`) — 앱도 키보드로 옮길 때만 같은 링 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 20 · 24 + 라벨까지 묶은 줄 32 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 위아래 44 로 넓힙니다 ✓. 묶음 안에서도 줄 사이 12 라 줄마다 44 · 48 을 받습니다(줄 사이가 4 면 이웃과 겹쳐 36 · 40 이 됩니다) — 목록 행에서 칸만 쓰면 행 전체 |
| **ARIA** | `role="checkbox"` + `aria-checked="true · false · mixed"`(mixed = 일부 선택). 라벨은 `<label>` 로 묶거나 `aria-labelledby`. 칸만 쓰면 `aria-label` 필수. 묶음은 `<fieldset>` + `<legend>`(또는 `role="group"` + `aria-labelledby`), 오류 글은 묶음에 `aria-describedby`. 오류면 칸마다 `aria-invalid`, 막히면 묶음 `aria-disabled` + 칸마다 `disabled` — `role="group"` 은 `aria-invalid` · `aria-required` 를 받지 않아 묶음에는 달지 않습니다(Field 로 감싸면 레시피가 겁니다). 앱은 묶음에 이름 노드만 둡니다 — 묶음 제목을 `Semantics(label)` 로 단 노드 하나이고, 묶음 역할(`group`)은 없습니다(Flutter 3.44 에 그 역할이 없습니다). |
| **Reduced motion** | 모션 줄이기면 누름 축소를 빼고 색만 바꿉니다(기초 Motion). |

## Do / Don't

### ✅ Do

- 모든 Checkbox 에 라벨을 둡니다(보이는 글자 또는 `aria-label`).
- 여러 개 고르기는 Checkbox, 하나만 고르기는 Radio, 바로 적용되는 켜기 · 끄기는 Switch 를 씁니다.
- 부모 · 자식 묶음에서 일부만 고르면 부모는 일부 선택으로 둡니다.
- 목록 행에 칸만 넣으면 행 전체가 눌리게 합니다.
- 약관 보기 같은 링크는 라벨 옆이나 아래에 둡니다 — 라벨에는 고르는 글만 둡니다.

### ❌ Don't

- 바로 적용되는 켜기 · 끄기에 Checkbox — "알림 받기" 는 Switch 입니다.
- 하나만 고르는 묶음에 Checkbox — Radio 를 씁니다.
- 선택 색을 브랜드로 깔아 두기 — 브랜드 색은 핵심 흐름에서만.
- 오류를 칸 색만으로 알리기 — 묶음 아래 글로 알립니다.
- 라벨 안에 링크 · 버튼 — 줄의 누르는 영역(44)이 덮어 눌리지 않습니다. 라벨 옆이나 아래에 따로 둡니다.

## Specification

`checkbox.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Checkbox 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — checkbox.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#checkbox)
