# Switch

> 특정 설정이나 상태를 바로 켜고 끄는 컴포넌트. 누르는 순간 적용되는 설정에 쓴다 — 알림 받기, 앱 잠금처럼.

구조는 당근 [SEED Switch](https://seed-design.io/components/switch)(Apache-2.0)를 따른다 — 스위치(Switchmark) · 스위치 + 라벨(Switch). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-09-30 사용자 결정).

수치 원본은 [`switch.yaml`](switch.yaml) 이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 끔 · 켬 — neutral · brand · 비활성, 위는 라이트 아래는 다크](../../site/components/specs/switch.tsx#hero)

### 직접 골라 보기

크기 · 톤 · 상태를 고르면 스펙대로 그린 Switch 와 그 코드가 바뀐다. 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/switch.tsx#playground)

## Anatomy

[그림: Switch 는 스위치(Switchmark)와 라벨로 이뤄진다 — 스위치는 트랙과 엄지다](../../site/components/specs/switch.tsx#anatomy)

| ⓐ Switchmark | 스위치 — 트랙. 켜면 색이 찬다. 따로 떼어 설정 줄에 끼워 쓴다. |
| ⓑ Thumb | 엄지 — 켜면 오른쪽으로 가고 커진다. 색 말고도 자리 · 크기로 켬 · 끔이 갈린다. |
| ⓒ Label | 무엇을 켜고 끄는지. 스위치와 함께 눌린다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움(v106). |

[표: 부위](switch.yaml#slots)

## Properties

### Size

크기 이름은 트랙 높이다. 트랙 · 엄지 · 라벨이 함께 정해진다.

- `16`(트랙 26 × 16 · 라벨 13) — 촘촘한 자리. 줄 높이는 24 다(누르는 영역의 바닥).
- `24`(트랙 38 × 24 · 라벨 14) — 기본. 화면 안의 설정 · 폼.
- `32`(트랙 52 × 32 · 라벨 16) — 제목이 큰 줄, 모바일에서 홀로 서는 스위치.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힌다(기초 Inclusive — 44 는 반드시).

[그림: 크기 세 가지 — 트랙 · 엄지 · 라벨](../../site/components/specs/switch.tsx#sizes)

[표: 크기](switch.yaml#grid.size)

글자 칸은 크기 / 줄 높이다. 라벨의 굵기는 크기와 상관없이 아래 공통 값(500)이다.

켜면 엄지가 트랙 폭에서 트랙 높이를 뺀 만큼 옆으로 간다.

[표: 크기별 엄지 — 켬](switch.yaml#grid.size.checked.checked)

모든 조합에 공통인 값:

[표: 공통](switch.yaml#base)

### Tone

켰을 때의 색이다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 쓴다 — Checkbox · Radio 와 같은 규칙이다(사용자 결정). SEED 도 Switch 는 Neutral 로 쓴다. 다크에서 neutral 의 켜짐은 밝은 트랙이 되어 꺼짐보다 또렷하다.

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/switch.tsx#tones)

### State

켬 · 끔과 상호작용 상태가 곱해진다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 색이 바뀌지 않는다 — 켜짐 색이 상태를 뜻해서다(v104) |
| `focused` | 웹. 키보드 포커스에만 링 2px · 띄움 2px(v106) |
| `pressed` | 색은 그대로, 스위치만 세로 2px 거리 축소(v104). 손을 떼기 전에 상태가 바뀐 것처럼 보이지 않게 |
| `disabled` | 전용 색(v106). 켜진 채 막히면 켜진 모양 그대로 회색 — 채운 트랙 + 밝은 엄지. 꺼진 채 막히면 옅은 트랙 + 옅은 테두리 + 회색 엄지. 라벨도 `fg-disabled` |

[그림: 켬 · 끔 × 상태 — 포커스 · 누름은 그 순간을 멈춰 그렸다](../../site/components/specs/switch.tsx#states)

[표: 상태 매트릭스 — neutral · 끔](switch.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — neutral · 켬](switch.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — brand · 켬](switch.yaml#matrix.tone.brand.checked.checked)

[그림: 직접 눌러 보기 — 스위치나 라벨을 누르면 바뀐다(Tab 으로 포커스, Space 로 바꾼다)](../../site/components/specs/switch.tsx#live)

[표: 모션](switch.yaml#motion)

## Guidelines

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역이다. 설정 줄처럼 스위치만(Switchmark) 끼워 쓸 때는 **그 줄 전체**가 눌려야 한다 — 스위치만 누르게 두지 않는다.

[그림: 누르는 영역(분홍) — Switch 는 스위치 + 라벨, 설정 줄은 줄 전체](../../site/components/specs/switch.tsx#touch-target)

### 누르는 순간 적용될 때만

Switch 는 누르는 순간 결과가 나타나는 설정에만 쓴다. 저장 · 실행을 눌러야 적용되는 켜고 끄기는 Checkbox 다(사용자 결정 — SEED 와 같다). 누르면 화면이 바로 바뀌는 것(일정의 "종일" — 날짜 칸이 바뀐다)은 값이 저장 때 들어가더라도 Switch 다.

[그림: 알림 설정은 Switch, 저장해야 적용되는 폼의 옵션은 Checkbox](../../site/components/specs/switch.tsx#immediate-guide)

누르면 스위치가 바로 바뀐다 — 서버 응답을 기다리지 않는다. 저장에 실패하면 되돌리고 무엇이 안 됐는지 알린다.

### 따로 움직이는 기능에만

스위치 하나는 기능 하나를 켜고 끈다. "모두 켜기" 같은 부모 스위치를 두지 않는다 — 전체를 고르고 풀 일이 있으면 Checkbox 의 부모 · 자식 묶음을 쓴다. 위 설정이 꺼져서 아래 설정을 쓸 수 없을 때는 아래 스위치를 **막는다**(값은 그대로 둔다).

[그림: 푸시 알림을 끄면 아래 줄은 값을 지닌 채 막힌다](../../site/components/specs/switch.tsx#dependent-guide)

### 막힌 줄은 라벨까지

스위치를 막으면 라벨(과 설명)도 비활성 색으로 바꾼다. 스위치만 회색이면 줄 전체가 막혔는지 알 수 없다 — 켜진 채 막힌 트랙은 꺼진 트랙과 비슷한 회색이라(다크에서는 같은 값이다) 스위치만 봐서는 "막힌 켬" 인지 읽기 어렵다.

[그림: 막힌 줄 — 라벨도 비활성 색](../../site/components/specs/switch.tsx#disabled-guide)

### 켜짐 색

켜짐 색은 짙은 회색이 기본이다. 브랜드 색은 서비스 핵심 흐름에만 — 설정 화면의 스위치마다 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어진다.

[그림: 켜짐 색](../../site/components/specs/switch.tsx#tone-guide)

### 설정 줄

"라벨 왼쪽 · 스위치 오른쪽" 줄(제목 · 설명 · 아이콘이 붙는다)은 Switch 가 아니라 **List** 의 스위치 줄(`ListSwitchItem`)이다(사용자 결정 — SEED 와 같다). 줄의 여백 · 글자 · 누름은 [List](list.md) 가 정하고, Switch 는 그 줄에 스위치만(Switchmark 32) 끼운다.

- 줄 전체가 누르는 영역이다 — 줄이 `<label>` 이라 줄의 제목이 스위치의 이름이 된다.
- 줄을 누르면 줄의 콘텐츠가 함께 줄고, 스위치는 따로 줄지 않는다(기초 Feedback v104 — SEED 도 List 안의 스위치 축소를 끈다).

### Switch 와 Checkbox

둘 다 켜고 끄는 선택을 보인다.

| | Checkbox | Switch |
|---|---|---|
| 값이 적용될 때 | 저장 같은 액션을 해야 적용(권장) | 누르는 순간 적용 — 저장해야 적용되는 값에는 쓰지 않는다 |
| 항목 구성 | 한 묶음에 여러 항목 | 항목마다 따로 |
| 하위 항목 | 부모가 모두를 고르고 풀 수 있다 | 부모와 하위 사이 관계 없음 |

## 코드

레시피 `recipes/shadcn/components/ui/switch.tsx` 를 쓴다 — `Switch`(스위치 + 라벨) · `Switchmark`(스위치). 아래 미리보기는 스펙 값으로 그린 모습이다.

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

목록 줄은 List 의 `ListSwitchItem` 을 쓴다 — 줄의 여백 · 글자 · 누름이 정해져 있다. 줄을 따로 짜야 할 때만 `Switchmark` 를 쓰고, 줄을 `<label>` 로 감싸 줄 어디를 눌러도 바뀌게 한다 — 줄의 글자가 스위치의 이름이 된다.

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
| Click / Tap(스위치 · 라벨) | 켬 ↔ 끔. 바로 적용한다. `disabled` 면 무시. |
| Keyboard `Space` · `Enter` | 포커스 상태에서 누르기와 같다(Radix). |
| Keyboard `Tab` | 다음 포커스로. |
| 실패 | 저장에 실패하면 스위치를 되돌리고 무엇이 안 됐는지 알린다. |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠진다. 값은 그대로 보인다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 표면 16.4:1(다크 13.4:1) ✓ |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 꺼진 트랙 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 켜진 트랙 `bg-neutral-inverted` × 표면 16.4:1(다크 13.4:1) ✓ · 엄지 × 트랙 — 끔 4.2:1(다크 4.1:1), 켬 16.4:1(다크 13.4:1) ✓. 다크의 brand 트랙은 표면과 1.7:1(Desk) · 2.9:1(HR)이라 트랙만으로는 3:1 이 안 된다 — 켜짐은 흰 엄지의 자리와 크기가 알린다 |
| **WCAG 1.4.1** Use of color | 켬 · 끔은 색만으로 갈리지 않는다 — 엄지의 자리(왼쪽 · 오른쪽)와 크기(0.8 · 1)가 함께 바뀐다 ✓ |
| 비활성 | 대비 기준(1.4.3 · 1.4.11)의 예외다. 켜진 채 막힌 트랙(`fg-disabled`)은 꺼진 트랙(`stroke-neutral-solid`)과 비슷한 회색이고 다크에서는 같은 값이다 — 켬 · 끔은 엄지의 자리 · 크기로, 막힘은 라벨의 비활성 색으로 읽힌다. 그래서 막을 때는 라벨까지 바꾼다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 최소 높이 24 · 24 · 32 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 44 로 넓힌다 ✓ — 스위치만 쓰면 그 줄 전체 |
| **ARIA** | Radix 가 `role="switch"` + `aria-checked` 를 단다. `Switch` 는 `<label htmlFor>` 로 스위치와 라벨을 잇는다. 스위치만 쓰면 이름은 줄을 `<label>` 로 묶거나 `aria-labelledby` · `aria-label` — 반드시. |
| **Reduced motion** | 모션 줄이기면 누름 축소를 뺀다 — 엄지의 이동(150ms)과 색 전환은 그대로다(기초 Motion). |

## Do / Don't

### ✅ Do

- 누르는 순간 적용되는 설정에 쓴다.
- 모든 스위치에 이름을 둔다(보이는 라벨 또는 `aria-label`).
- 설정 줄에서는 줄 전체가 눌리게 한다.
- 막을 때는 라벨까지 비활성 색으로 바꾼다.
- 자세히 보기 같은 링크는 라벨 옆이나 아래에 둔다 — 라벨은 켜고 끄는 글만.

### ❌ Don't

- 저장을 눌러야 적용되는 폼의 옵션에 Switch — Checkbox 를 쓴다.
- "예 · 아니오" 를 고르는 선택 목록 — 켜고 끄는 것이면 Switch 나 Checkbox 다.
- 부모 스위치로 아래 스위치를 한꺼번에 켜고 끄기 — 부모 · 자식은 Checkbox 묶음.
- 확인이 필요한 위험한 동작에 Switch — 버튼 + 확인 창을 쓴다.
- 스위치를 줄여 그리기 — 작은 자리에는 `16` 을 쓴다.
- 라벨 안에 링크 · 버튼 — 줄의 누르는 영역(44)이 덮어 눌리지 않는다. 라벨 옆이나 아래에 따로 둔다(사용자 결정 2026-10-08, Checkbox · Radio 와 같다).

## Specification

`switch.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Switch 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — switch.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#switch)

## SEED 와 다른 점

- **기본 크기는 `24`**(사용자 결정) — SEED 는 `32`. 제품의 스위치가 모두 높이 24 이고 줄 제목이 13 ~ 14 라서다.
- **비활성은 전용 색**(v106 · 사용자 결정) — 켜진 채 막히면 켜진 모양 그대로 `fg-disabled` 채움 + `bg-disabled` 엄지, 꺼진 채 막히면 `bg-disabled` 트랙 + `stroke-neutral-weak` 안쪽 선 + `fg-disabled` 엄지. SEED 는 트랙 38% · 라벨 58% 불투명도로 흐리게 한다.
- **꺼진 트랙은 `stroke-neutral-solid`**(표면과 3:1 이상, v109). SEED 는 palette.gray-600(흰 바탕 2.1:1)이다.
- 웹의 `focused` 를 더한다(v106).
- 줄 안의 맞춤은 가운데다 — SEED 는 긴 라벨의 첫 줄에 스위치를 맞춘다.

## Migration notes

### 2026-10-08 — 라벨 안 링크는 Don't

줄(`Switch`)의 누르는 영역(`::before` 44)이 라벨을 덮어 라벨 안 링크 · 버튼은 눌리지 않는다. 사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) C 에서 레시피는 그대로 두고 Don't 에 적기로 정했다 — 링크는 라벨 옆 · 아래에(Checkbox · Radio 와 같다).

### 2026-09-30 — SEED Switch 구조로

사용자가 비교 페이지(https://claude.ai/artifact/VrKxQ5whsBsqGB9JZgMJk8)에서 정했다 — 틀은 SEED(Switchmark · Switch, 크기 16 · 24 · 32, 끄면 엄지가 0.8 로 작아지고 그림자 없음) · 기본 크기 24 · 비활성은 켜진 모양 그대로 색만 · 누르는 순간 적용될 때만 Switch(저장해야 적용되면 Checkbox) · 설정 줄은 List 차례에. 켜짐 색(neutral 기본 + brand)은 Checkbox 때 정한 규칙이다.

| 옛 | 새 |
|---|---|
| 크기 하나 44 × 24 · 엄지 20 | `16`(26 × 16 · 12) · `24`(38 × 24 · 20, 기본) · `32`(52 × 32 · 26) |
| 엄지 크기 고정 · 그림자 `shadow-md` | 끄면 0.8 로 작아진다 · 그림자 없음 |
| 켬 = `primary`(브랜드) · 엄지 흰색 고정 | 켬 = `bg-neutral-inverted`(짙은 회색) · 엄지 `fg-neutral-inverted`. `tone="brand"` 면 `bg-brand-solid` · 엄지 흰색 |
| 끔 = `border-strong` | `stroke-neutral-solid`(값은 같다 — 역할 이름으로) |
| 비활성 50% 흐림 | 전용 색 — 위 "SEED 와 다른 점" |
| 트랙에 투명 테두리 2px(포커스 자리) | 테두리 없음 · 안쪽 여백 2 · 2 · 3, 포커스는 바깥 링 |
| 라벨은 쓰는 쪽이 | `Switch` 가 라벨까지 — 스위치 왼쪽 · 라벨 오른쪽, 14/500 |
| 컴포넌트 이름 `Switch`(트랙만) | 트랙은 `Switchmark`, `Switch` 는 스위치 + 라벨 |
| 전환 `motion-duration-fast` · `ease-out` | 엄지 `motion-duration-d3` · 색 `motion-duration-d1`(20ms 뒤) · `motion-ease-easing` + 누름 축소 |

제품은 앱 적용 단계에서 옮긴다 — Desk 웹 23개 · 앱 26개(모두 44 × 24 하나), HR 웹은 쓰는 화면이 없다. 그때 같이 고칠 것:

- **저장해야 적용되는 자리를 Checkbox 로** — 웹 10 · 앱 12곳: 자산 "전체 자산 합계에 포함" · "금액 숨기기", 반복 설정 "자동 기록" · "하루 전 알림", 메모 "상단에 고정", 내보내기 "민감 정보 가리기", 가져오기 옵션 둘. 거꾸로 카드 혜택 화면의 "단종 카드 포함" 체크박스는 누르는 순간 목록이 바뀌므로 Switch 로.
- **설정 줄** — 49개 중 42개가 "라벨 왼쪽 · 스위치 오른쪽" 줄인데 화면마다 손으로 짜서 제목(12 ~ 16) · 설명(11 ~ 12) · 간격(6 ~ 12) · 누르는 범위(줄 전체 13 · 스위치만 36)가 다르다. List 차례에 정한다. 앱의 `PSwitchTile` 은 쓰는 곳이 없다.
- **이름** — 웹 17개 · 앱 7개가 스위치에 이름이 없다.
- **누르는 영역** — 웹 13개가 높이 24, 앱 12개가 줄 높이를 지키려고 24 로 줄였다. 앱은 "단종 포함" 스위치를 절반으로 줄여 그린다(`16` 으로).
- **바로 바뀌기** — 웹 알림 설정은 서버 응답을 기다리며 화면 전체를 막는다. 앱은 바로 바꾸지만 실패하면 말없이 되돌린다.
- **HR** — 켜고 끄기를 "예 · 아니오" 선택 목록으로 한다(공지 상단 고정 · 공휴일 매년 반복 · 휴가 정책 셋 · 음력 여부).
