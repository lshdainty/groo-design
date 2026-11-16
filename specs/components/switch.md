# Switch

> 설정이나 상태를 바로 켜고 끄는 컴포넌트입니다. 알림 받기, 앱 잠금처럼 누르는 순간 적용되는 설정에 씁니다.

수치 원본은 [`switch.yaml`](switch.yaml)입니다.

[그림: 끔 · 켬 — neutral · brand · 비활성, 위는 라이트 아래는 다크](../../site/components/specs/switch.tsx#hero)

### 직접 골라 보기

크기 · 톤 · 상태를 고르면 스펙대로 그린 Switch 와 그 코드가 바뀝니다. 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/switch.tsx#playground)

## Anatomy

[그림: Switch 는 스위치(Switchmark)와 라벨로 이뤄지고, 스위치는 트랙과 엄지입니다](../../site/components/specs/switch.tsx#anatomy)

| ⓐ Switchmark | 스위치 — 트랙입니다. 켜면 색이 찹니다. 따로 떼어 설정 줄에 끼워 씁니다. |
| ⓑ Thumb | 엄지 — 켜면 오른쪽으로 가고 커집니다. 색 말고도 자리 · 크기로 켬 · 끔이 갈립니다. |
| ⓒ Label | 무엇을 켜고 끄는지 알립니다. 스위치와 함께 눌립니다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움을 그립니다. |

[표: 부위](switch.yaml#slots)

## Properties

### Size

크기 이름은 트랙 높이입니다. 트랙 · 엄지 · 라벨이 함께 정해집니다.

- `16`(트랙 26 × 16 · 라벨 13) — 촘촘한 자리입니다. 줄 높이는 24 입니다(누르는 영역의 바닥).
- `24`(트랙 38 × 24 · 라벨 14) — 기본입니다. 화면 안의 설정 · 폼에 씁니다.
- `32`(트랙 52 × 32 · 라벨 16) — 제목이 큰 줄, 모바일에서 홀로 서는 스위치에 씁니다.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힙니다(기초 Inclusive — 44 는 반드시 지킵니다). 스위치는 라벨과 세로 가운데로 맞춥니다 — 라벨이 여러 줄이어도 첫 줄이 아니라 가운데입니다.

[그림: 크기 세 가지 — 트랙 · 엄지 · 라벨](../../site/components/specs/switch.tsx#sizes)

[표: 크기](switch.yaml#grid.size)

글자 칸은 크기 / 줄 높이입니다. 라벨의 굵기는 크기와 상관없이 아래 공통 값(500)입니다.

켜면 엄지가 트랙 폭에서 트랙 높이를 뺀 만큼 옆으로 갑니다.

[표: 크기별 엄지 — 켬](switch.yaml#grid.size.checked.checked)

모든 조합에 공통인 값입니다.

[표: 공통](switch.yaml#base)

### Tone

켰을 때의 색입니다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 씁니다 — Checkbox · Radio 와 같은 규칙입니다. 다크에서 neutral 의 켜짐은 밝은 트랙이 되어 꺼짐보다 또렷합니다.

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/switch.tsx#tones)

### State

켬 · 끔과 상호작용 상태가 곱해집니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 색이 바뀌지 않습니다 — 켜짐 색이 상태를 뜻하기 때문입니다 |
| `focused` | 웹 · 앱. 키보드 포커스에만 링 2px · 띄움 2px. 앱은 하드웨어 키보드로 옮길 때만 그리고 손가락으로 누를 때는 그리지 않습니다 |
| `pressed` | 색은 그대로, 스위치만 세로 2px 거리 축소. 손을 떼기 전에 상태가 바뀐 것처럼 보이지 않게 합니다 |
| `disabled` | 전용 색. 켜진 채 막히면 켜진 모양 그대로 회색입니다 — 채운 트랙 + 밝은 엄지. 꺼진 채 막히면 옅은 트랙 + 옅은 테두리 + 회색 엄지입니다. 라벨도 `fg-disabled` |

[그림: 켬 · 끔 × 상태 — 포커스 · 누름은 그 순간을 멈춰 그렸습니다](../../site/components/specs/switch.tsx#states)

[표: 상태 매트릭스 — neutral · 끔](switch.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — neutral · 켬](switch.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — brand · 켬](switch.yaml#matrix.tone.brand.checked.checked)

[그림: 직접 눌러 보기 — 스위치나 라벨을 누르면 바뀝니다(Tab 으로 포커스, Space 로 바꿉니다)](../../site/components/specs/switch.tsx#live)

[표: 모션](switch.yaml#motion)

## Guidelines

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역입니다. 설정 줄처럼 스위치만(Switchmark) 끼워 쓸 때는 **그 줄 전체**가 눌려야 합니다 — 스위치만 누르게 두지 않습니다.

[그림: 누르는 영역(분홍) — Switch 는 스위치 + 라벨, 설정 줄은 줄 전체](../../site/components/specs/switch.tsx#touch-target)

### 누르는 순간 적용될 때만

Switch 는 누르는 순간 결과가 나타나는 설정에만 씁니다. 저장 · 실행을 눌러야 적용되는 켜고 끄기는 Checkbox 입니다. 누르면 화면이 바로 바뀌는 것(일정의 "종일" — 날짜 칸이 바뀝니다)은 값이 저장 때 들어가더라도 Switch 입니다.

[그림: 알림 설정은 Switch, 저장해야 적용되는 폼의 옵션은 Checkbox](../../site/components/specs/switch.tsx#immediate-guide)

누르면 스위치가 바로 바뀝니다 — 서버 응답을 기다리지 않습니다. 저장에 실패하면 되돌리고 무엇이 안 됐는지 알립니다.

### 따로 움직이는 기능에만

스위치 하나는 기능 하나를 켜고 끕니다. "모두 켜기" 같은 부모 스위치를 두지 않습니다 — 전체를 고르고 풀 일이 있으면 Checkbox 의 부모 · 자식 묶음을 씁니다. 위 설정이 꺼져서 아래 설정을 쓸 수 없을 때는 아래 스위치를 **막습니다**(값은 그대로 둡니다).

[그림: 푸시 알림을 끄면 아래 줄은 값을 지닌 채 막힙니다](../../site/components/specs/switch.tsx#dependent-guide)

### 막힌 줄은 라벨까지

스위치를 막으면 라벨(과 설명)도 비활성 색으로 바꿉니다. 스위치만 회색이면 줄 전체가 막혔는지 알 수 없기 때문입니다 — 켜진 채 막힌 트랙은 꺼진 트랙과 비슷한 회색이라(다크에서는 같은 값입니다) 스위치만 봐서는 "막힌 켬" 인지 읽기 어렵습니다.

[그림: 막힌 줄 — 라벨도 비활성 색](../../site/components/specs/switch.tsx#disabled-guide)

### 켜짐 색

켜짐 색은 짙은 회색이 기본입니다. 브랜드 색은 서비스 핵심 흐름에만 씁니다 — 설정 화면의 스위치마다 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어집니다.

[그림: 켜짐 색](../../site/components/specs/switch.tsx#tone-guide)

### 설정 줄

"라벨 왼쪽 · 스위치 오른쪽" 줄(제목 · 설명 · 아이콘이 붙습니다)은 Switch 가 아니라 **List** 의 스위치 줄(`ListSwitchItem`)입니다. 줄의 여백 · 글자 · 누름은 [List](list.md) 가 정하고, Switch 는 그 줄에 스위치만(Switchmark 32) 끼웁니다. 줄 모양의 규칙입니다 — 화면 전체를 List 로 그리라는 말이 아닙니다.

- 줄 전체가 누르는 영역입니다 — 줄이 `<label>` 이라 줄의 제목이 스위치의 이름이 됩니다.
- 줄을 누르면 줄의 콘텐츠가 함께 줄고, 스위치는 따로 줄지 않습니다(기초 Feedback).

### Switch 와 Checkbox

둘 다 켜고 끄는 선택을 보입니다. 값이 적용될 때 · 항목 구성 · 하위 항목 · 경계 사례(결제 알림 · 단종 카드 포함 · 일정 종일은 Switch, 고정 금액으로 기록은 Checkbox)를 견준 표는 [Checkbox 의 "Checkbox 와 Switch"](checkbox.md#checkbox-와-switch) 한 벌입니다.

## 코드

레시피 `recipes/shadcn/components/ui/switch.tsx` 를 씁니다 — `Switch`(스위치 + 라벨) · `Switchmark`(스위치). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 기본

[그림: 기본 — 24 · neutral](../../site/components/specs/switch.tsx#ex-basic)

```tsx
import { Switch } from "@/components/ui/switch"

<Switch defaultChecked label="종일" />
```

### 크기

[그림: 크기](../../site/components/specs/switch.tsx#ex-sizes)

```tsx
<Switch size="16" defaultChecked label="16" />
<Switch size="24" defaultChecked label="24" />
<Switch size="32" defaultChecked label="32" />
```

### 톤

[그림: 톤](../../site/components/specs/switch.tsx#ex-tones)

```tsx
<Switch defaultChecked label="neutral" />
<Switch defaultChecked tone="brand" label="brand" />
```

### 값 다루기 · 비활성

[그림: 값 다루기 · 비활성](../../site/components/specs/switch.tsx#ex-controlled)

```tsx
const [allDay, setAllDay] = useState(false)

<Switch checked={allDay} onCheckedChange={setAllDay} label="종일" />

<Switch disabled label="종일" />
<Switch disabled defaultChecked label="종일" />
```

### 스위치만

목록 줄은 List 의 `ListSwitchItem` 을 씁니다 — 줄의 여백 · 글자 · 누름이 정해져 있습니다. 줄을 따로 짜야 할 때만 `Switchmark` 를 쓰고, 줄을 `<label>` 로 감싸 줄 어디를 눌러도 바뀌게 합니다 — 줄의 글자가 스위치의 이름이 됩니다.

[그림: 스위치만 — 줄 전체가 누르는 영역](../../site/components/specs/switch.tsx#ex-switchmark)

```tsx
import { Switchmark } from "@/components/ui/switch"

<label className="flex cursor-pointer items-center gap-x3 px-x6 py-x3">
  <span className="flex-1">결제 알림</span>
  <Switchmark checked={on} onCheckedChange={setOn} />
</label>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap(스위치 · 라벨) | 켬 ↔ 끔. 바로 적용합니다. `disabled` 면 무시합니다. |
| Keyboard `Space` · `Enter` | 포커스 상태에서 누르기와 같습니다(Radix). |
| Keyboard `Tab` | 다음 포커스로 옮깁니다. |
| 실패 | 저장에 실패하면 스위치를 되돌리고 무엇이 안 됐는지 알립니다. |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠집니다. 값은 그대로 보입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 표면 16.4:1(다크 13.4:1) ✓ |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 꺼진 트랙 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 켜진 트랙 `bg-neutral-inverted` × 표면 16.4:1(다크 13.4:1) ✓ · 엄지 × 트랙 — 끔 4.2:1(다크 4.1:1), 켬 16.4:1(다크 13.4:1) ✓. 다크의 brand 트랙은 표면과 1.7:1(Desk · HR)이라 트랙만으로는 3:1 이 안 됩니다 — 켜짐은 흰 엄지의 자리와 크기가 알립니다 |
| **WCAG 1.4.1** Use of color | 켬 · 끔은 색만으로 갈리지 않습니다 — 엄지의 자리(왼쪽 · 오른쪽)와 크기(0.8 · 1)가 함께 바뀝니다 ✓ |
| 비활성 | 대비 기준(1.4.3 · 1.4.11)의 예외입니다. 켜진 채 막힌 트랙(`fg-disabled`)은 꺼진 트랙(`stroke-neutral-solid`)과 비슷한 회색이고 다크에서는 같은 값입니다 — 켬 · 끔은 엄지의 자리 · 크기로, 막힘은 라벨의 비활성 색으로 읽힙니다. 그래서 막을 때는 라벨까지 바꿉니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`) — 앱도 키보드로 옮길 때만 같은 링을 그립니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 최소 높이 24 · 24 · 32 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 44 로 넓힙니다 ✓ — 스위치만 쓰면 그 줄 전체 |
| **ARIA** | Radix 가 `role="switch"` + `aria-checked` 를 답니다. `Switch` 는 `<label htmlFor>` 로 스위치와 라벨을 잇습니다. 스위치만 쓰면 이름은 줄을 `<label>` 로 묶거나 `aria-labelledby` · `aria-label` 로 반드시 줍니다. |
| **Reduced motion** | 모션 줄이기면 누름 축소를 뺍니다 — 엄지의 이동(150ms)과 색 전환은 그대로입니다(기초 Motion). |

## Do / Don't

### ✅ Do

- 누르는 순간 적용되는 설정에 씁니다.
- 모든 스위치에 이름을 둡니다(보이는 라벨 또는 `aria-label`).
- 설정 줄에서는 줄 전체가 눌리게 합니다.
- 막을 때는 라벨까지 비활성 색으로 바꿉니다.
- 자세히 보기 같은 링크는 라벨 옆이나 아래에 둡니다 — 라벨은 켜고 끄는 글만 둡니다.

### ❌ Don't

- 저장을 눌러야 적용되는 폼의 옵션에 Switch 를 쓰지 않습니다 — Checkbox 를 씁니다.
- "예 · 아니오" 를 고르는 선택 목록으로 켜고 끄지 않습니다 — 켜고 끄는 것이면 Switch 나 Checkbox 입니다.
- 부모 스위치로 아래 스위치를 한꺼번에 켜고 끄지 않습니다 — 부모 · 자식은 Checkbox 묶음입니다.
- 확인이 필요한 위험한 동작에 Switch 를 쓰지 않습니다 — 버튼 + 확인 창을 씁니다.
- 스위치를 줄여 그리지 않습니다 — 작은 자리에는 `16` 을 씁니다.
- 라벨 안에 링크 · 버튼을 넣지 않습니다 — 줄의 누르는 영역(44)이 덮어 눌리지 않습니다. 라벨 옆이나 아래에 따로 둡니다(Checkbox · Radio 와 같습니다).

## Specification

`switch.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Switch 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — switch.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#switch)
