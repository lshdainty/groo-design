# Radio Group

> 여러 옵션 가운데 하나만 고르게 하는 컴포넌트. 선택지를 모두 펼쳐 두고 저장하기 전에 하나를 고를 때 쓴다.

구조는 당근 [SEED Radio](https://seed-design.io/components/radio)(Apache-2.0)를 따른다 — 동그라미(Radiomark) · 동그라미 + 라벨(Radio) · 묶음(Radio Group). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-09-30 사용자 결정).

수치 원본은 [`radio-group.yaml`](radio-group.yaml) 이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 선택 안 됨 · 선택 — neutral · brand, 위는 라이트 아래는 다크](../../site/components/specs/radio-group.tsx#hero)

### 직접 골라 보기

크기 · 톤 · 굵기 · 상태를 고르면 스펙대로 그린 Radio 와 그 코드가 바뀐다. 묶음 안에서 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/radio-group.tsx#playground)

## Anatomy

[그림: Radio 는 동그라미(Radiomark)와 라벨로 이뤄진다 — 동그라미는 따로 떼어 쓸 수 있다](../../site/components/specs/radio-group.tsx#anatomy)

| ⓐ Radiomark | 동그라미 — 배경 · 테두리. 라벨을 따로 짜는 자리(Select Box 의 오른쪽 동그라미 같은)에서 따로 쓴다. |
| ⓑ Dot | 가운데 점 — 선택을 나타낸다. 선택 안 됨에는 보이지 않는다. |
| ⓒ Label | 무엇을 고르는지. 동그라미와 함께 눌린다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움(v106). |

[표: 부위](radio-group.yaml#slots)

## Properties

### Size

두 가지다. 동그라미 · 점 · 라벨 · 줄 높이가 함께 정해진다 — Checkbox 와 같은 크기라 한 폼에 함께 서도 줄이 맞는다.

- `medium`(동그라미 20 · 점 8 · 라벨 14 · 줄 32) — 기본. 화면 안의 폼 · 설정.
- `large`(동그라미 24 · 점 10 · 라벨 16 · 줄 36) — 한 화면의 중심 선택, 모바일에서 홀로 서는 선택.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힌다(기초 Inclusive — 44 는 반드시).

[그림: 크기 두 가지 — 동그라미 · 라벨 · 줄 높이](../../site/components/specs/radio-group.tsx#sizes)

[표: 크기](radio-group.yaml#size)

모든 조합에 공통인 값:

[표: 공통](radio-group.yaml#base)

### Weight

라벨 굵기다. 강조가 필요할 때 `bold`.

[그림: 라벨 굵기 — regular · bold](../../site/components/specs/radio-group.tsx#weight)

[표: 굵기](radio-group.yaml#weight)

### Tone

선택했을 때의 색이다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 쓴다 — Checkbox 와 같은 규칙이다(사용자 결정). SEED 도 Radio 는 Neutral 을 기본으로 둔다. 선택하면 테두리 없이 원을 채우고 가운데에 채움과 대비되는 점이 선다(neutral 은 `fg-neutral-inverted`, brand 는 흰색).

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/radio-group.tsx#tones)

### State

선택 여부(선택 안 됨 · 선택)와 상호작용 상태가 곱해진다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 누름 색과 같다(v106), 축소는 없다 |
| `focused` | 웹. 키보드 포커스에만 링 2px · 띄움 2px(v106) |
| `pressed` | 누름 색 + 동그라미 세로 2px 거리 축소(v104). 라벨은 줄지 않는다 |
| `disabled` | 전용 색(`bg-disabled` · `fg-disabled`, v106). 선택도 채운 원 그대로 색만 바뀐다 — 불투명도로 흐리게 하지 않는다 |

[그림: 선택 여부 × 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸다](../../site/components/specs/radio-group.tsx#states)

[표: 상태 매트릭스 — neutral · 선택 안 됨](radio-group.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — neutral · 선택](radio-group.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — brand · 선택](radio-group.yaml#matrix.tone.brand.checked.checked)

[그림: 직접 눌러 보기 — 동그라미나 라벨을 누르면 바뀐다(Tab 으로 들어가 화살표로 옮긴다)](../../site/components/specs/radio-group.tsx#live)

[표: 모션](radio-group.yaml#motion)

### Group

선택지를 묶어 세로로 쌓는다. 하나를 고르면 앞에 고른 것은 풀린다. 줄 사이는 12 다 — 줄 높이 32 · 36 에 더하면 44 · 48 마다 한 줄이 서서, 묶음 안에서도 줄마다 누르는 영역 44 를 온전히 받는다(사용자 결정). 줄은 동그라미 + 라벨만큼만 차지하고 묶음 폭으로 늘이지 않는다. 가로로 늘어놓지 않는다(사용자 결정) — 짧은 선택지를 한 줄에서 고르게 하려면 Segmented · Chip 을 쓴다.

[그림: 묶음 — 하나를 누르면 앞에 고른 것이 풀린다](../../site/components/specs/radio-group.tsx#group)

[표: 묶음](radio-group.yaml#base@group)

## Guidelines

오늘 제품에는 라벨만 있는 Radio 가 없다 — 라디오 동그라미가 나오는 곳은 반복 거래의 "종료" 하나뿐이고, 설명과 입력칸이 붙어 있어 Select Box 로 옮긴다(아래 "설명 · 딸린 입력"). 이 절의 그림은 캘린더 일정의 반복 선택지(반복 없음 · 매일 · 매주 · 매월 · 매년)를 빌려 Radio 로 그렸다 — 제품의 그 자리는 지금 토글 묶음이다.

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역이다. 동그라미 20 · 24 만으로는 작다 — 라벨까지 묶고 위아래로 44 까지 넓힌다. 묶음에서는 줄 사이 12 가 이 영역이 서로 겹치지 않게 한다.

[그림: 누르는 영역(분홍) — 동그라미 + 라벨이 한 영역](../../site/components/specs/radio-group.tsx#touch-target)

### 묶음 쓰기

묶음 위에 무엇을 고르는지 제목을 두고, 선택지는 세로로 쌓는다. 선택지는 둘에서 다섯 개 — 여섯 개 이상이면 Select 로 접는다. 처음부터 하나를 골라 둘 수 있으면 골라 둔다(보통 가장 흔한 것).

[그림: 제목 + 세로 묶음 · 가로로 늘어놓지 않는다](../../site/components/specs/radio-group.tsx#group-guide)

### 선택 색

선택 색은 짙은 회색이 기본이다. 브랜드 색은 서비스 핵심 흐름에만 — 선택 컨트롤마다 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어진다.

[그림: 선택 색](../../site/components/specs/radio-group.tsx#tone-guide)

### 설명 · 딸린 입력

선택지마다 설명이 붙거나, 고르면 입력칸이 따라 나와야 하면 Radio 가 아니라 **Select Box** 다(사용자 결정 — SEED 와 같다). Radio 에는 라벨 하나만 있다(길면 줄이 바뀐다) — 설명 줄이나 딸린 입력 자리가 없다. 줄 안에 입력칸을 넣으면 화면 읽기 프로그램이 입력칸을 라디오의 일부로 읽는다.

[그림: 반복 거래 "종료" — 설명 · 입력칸이 붙는 선택은 Select Box](../../site/components/specs/radio-group.tsx#selectbox-guide)

### 오류

동그라미 모양은 바꾸지 않는다. 묶음 아래에 무엇을 해야 하는지 글로 알린다(Checkbox 와 같다). 묶음을 [Field](field.md) 로 감싸면 그 꼬리가 오류 글 자리이고, 라벨은 묶음의 이름으로 이어진다(2026-10-01). Field 의 오류 · 필수 · 막힘도 묶음에 닿는다 — 묶음(`role="radiogroup"`)에 `aria-invalid` · `aria-required`, 막히면 묶음 `aria-disabled` 와 선택지마다 `disabled` 다(2026-10-08, SEED 와 같다). 처음부터 하나를 골라 두면 오류가 날 일이 없다 — 골라 둘 수 없는 선택(사용자가 꼭 스스로 골라야 하는)에만 쓴다.

[그림: 오류는 묶음 아래 글로](../../site/components/specs/radio-group.tsx#error)

### Radio 와 다른 선택 컨트롤

| 고르는 것 | 컨트롤 |
|---|---|
| 하나 — 선택지 2~5개, 라벨만, 저장해야 적용 | **Radio** |
| 하나 — 설명 · 아이콘 · 딸린 입력이 붙는 선택지 | Select Box |
| 하나 — 선택지 6개 이상, 또는 자리가 좁을 때 | Select |
| 하나 — 화면 폭 목록에서(기본 통화처럼 그 화면이 고르기 하나) | List 의 라디오 줄(`ListRadioItem`) |
| 하나 — 짧은 선택지를 한 줄에서, 바로 바뀌는 보기 전환 | Segmented · Chip |
| 여러 개 | Checkbox |
| 켜고 끄기 하나, 바로 적용 | Switch |

## 코드

레시피 `recipes/shadcn/components/ui/radio-group.tsx` 를 쓴다 — `RadioGroup`(묶음) · `Radio`(동그라미 + 라벨) · `Radiomark`(동그라미). `Radio` · `Radiomark` 는 `RadioGroup` 안에서만 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 기본

[그림: 기본 — medium · neutral](../../site/components/specs/radio-group.tsx#ex-basic)

```tsx
import { Radio, RadioGroup } from "@/components/ui/radio-group"

<RadioGroup defaultValue="none" aria-label="반복">
  <Radio value="none" label="반복 없음" />
  <Radio value="daily" label="매일" />
  <Radio value="weekly" label="매주" />
</RadioGroup>
```

### 크기 · 굵기

[그림: 크기 · 굵기](../../site/components/specs/radio-group.tsx#ex-sizes)

```tsx
<RadioGroup defaultValue="medium" aria-label="크기">
  <Radio value="medium" size="medium" label="medium" />
  <Radio value="large" size="large" label="large" />
  <Radio value="bold" size="large" weight="bold" label="large · bold" />
</RadioGroup>
```

### 톤

[그림: 톤](../../site/components/specs/radio-group.tsx#ex-tones)

```tsx
<RadioGroup defaultValue="monthly" aria-label="반복">
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" />
</RadioGroup>

<RadioGroup defaultValue="monthly" aria-label="반복">
  <Radio value="monthly" tone="brand" label="매월" />
  <Radio value="yearly" tone="brand" label="매년" />
</RadioGroup>
```

한 묶음 안에서 톤을 섞지 않는다.

### 값 다루기 · 비활성

[그림: 값 다루기 · 비활성](../../site/components/specs/radio-group.tsx#ex-controlled)

```tsx
const [repeat, setRepeat] = useState("monthly")

<RadioGroup value={repeat} onValueChange={setRepeat} aria-labelledby="repeat-title">
  <Radio value="none" label="반복 없음" />
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" disabled />
</RadioGroup>

// 묶음에 disabled 를 주면 모든 선택지가 막힌다 — 고른 선택지는 채운 원 그대로 색만 바뀐다
<RadioGroup value={repeat} onValueChange={setRepeat} aria-labelledby="repeat-title" disabled>
  <Radio value="none" label="반복 없음" />
  <Radio value="monthly" label="매월" />
  <Radio value="yearly" label="매년" />
</RadioGroup>
```

### 오류

묶음을 [Field](field.md) 로 감싼다 — 라벨이 묶음의 이름, 오류 글이 묶음의 설명(`aria-describedby`)이 되고, 묶음에 `aria-invalid` 가 걸린다. 동그라미는 바꾸지 않는다.

[그림: 오류 — 묶음 아래 글](../../site/components/specs/radio-group.tsx#ex-error)

```tsx
<Field label="반복" invalid errorMessage="반복을 골라 주세요.">
  <RadioGroup>
    <Radio value="none" label="반복 없음" />
    <Radio value="monthly" label="매월" />
  </RadioGroup>
</Field>
```

### 동그라미만

화면 폭 목록의 줄은 List 의 `ListRadioItem` 을 쓴다 — 줄의 여백 · 글자 · 누름이 정해져 있다. 라벨을 따로 짜야 할 때만 `Radiomark` 를 쓰고, 줄을 `<label>` 로 감싸 줄 어디를 눌러도 고르게 한다. `group/radio` 를 달면 줄을 누르거나 올려도 동그라미가 누름 색 · 축소로 반응한다. 직접 짠 줄은 묶음 폭을 다 쓴다(`Radio` 줄만 내용만큼 차지한다).

```tsx
import { Radiomark, RadioGroup } from "@/components/ui/radio-group"

<RadioGroup defaultValue="none" aria-label="반복">
  <label className="group/radio flex cursor-pointer items-center gap-x3 px-x6 py-x3">
    <span className="flex-1">반복 없음</span>
    <Radiomark value="none" />
  </label>
</RadioGroup>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap(동그라미 · 라벨) | 그 선택지를 고른다. 앞에 고른 것은 풀린다. 이미 고른 것을 다시 눌러도 풀리지 않는다. `disabled` 면 무시. |
| Keyboard `Tab` | 묶음에 들어가고 나간다 — 고른 선택지(없으면 첫 선택지)로 들어간다. 묶음 안에서는 화살표로 옮긴다. |
| Keyboard `↑` `↓` `←` `→` | 이전 · 다음 선택지로 옮기며 고른다. 막힌 선택지는 건너뛴다. |
| Keyboard `Space` | 포커스된 선택지를 고른다. |
| Keyboard `Enter` | 폼을 제출한다 — 진짜 `<input type="radio">` 처럼 폼의 기본 버튼(첫 제출 버튼)을 누른다. 고르지 않는다. 기본 버튼이 없거나 막혀 있으면 아무것도 하지 않는다. Radix 의 선택지는 Enter 를 막기만 해서 묶음이 받는다(사용자 결정 2026-10-08 — SEED 와 같다). 동그라미만(`Radiomark`) 쓰는 List 의 라디오 줄 · Select Box 하나 고르기도 같다. |
| Disabled(묶음) | 모든 선택지가 막힌다 — 묶음 `aria-disabled`. 막힌 Field 로 감싸도 같다. |
| Disabled(선택지) | 그 선택지만 막힌다 — 골라 둔 채로 막을 수 있다(채운 원 그대로 색만). |

**Form 안** — Radix 의 숨은 `<input type="radio">` 가 폼 제출에 들어간다(`name` 을 묶음에). 검증은 `onSubmit` — 누르는 동안 오류를 띄우지 않는다.

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 흰 표면 16:1+ ✓ |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 선택 안 된 동그라미 테두리 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 선택 채움 `bg-neutral-inverted` × 표면 16.4:1(다크 13.4:1) ✓ · 가운데 점 × 채움 — neutral 16.4:1(다크 13.4:1), brand Desk 8.4:1 · HR 5.1:1 ✓. 다크의 brand 채움은 표면과 1.7:1(Desk) · 2.9:1(HR)이라 채움만으로는 3:1 이 안 된다 — 선택은 가운데 흰 점(표면과 14.5:1)과 테두리가 사라지는 모양이 알린다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 동그라미 20 · 24 + 라벨까지 묶은 줄 32 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 위아래 44 로 넓힌다 ✓. 묶음 안에서도 줄 사이 12 라 줄마다 44 · 48 을 받는다(줄 사이가 4 면 이웃과 겹쳐 36 · 40 이 된다) — 동그라미만 쓰면 그 줄 전체 |
| **ARIA** | Radix 가 `role="radiogroup"`(묶음) + `role="radio"` · `aria-checked`(선택지)를 단다. 묶음 제목은 `aria-labelledby`(또는 `<fieldset>` + `<legend>`), 오류 글은 묶음에 `aria-describedby`. 오류 · 필수는 묶음의 `aria-invalid` · `aria-required`, 막히면 묶음 `aria-disabled` + 선택지마다 `disabled` — Field 로 감싸면 레시피가 건다. 동그라미만 쓰면 `<label>` 로 감싸거나 `aria-label` 필수. |
| **Reduced motion** | 모션 줄이기면 누름 축소를 빼고 색만 바꾼다(기초 Motion). |

## Do / Don't

### ✅ Do

- 묶음 위에 무엇을 고르는지 제목을 둔다.
- 선택지는 세로로 쌓는다.
- 골라 둘 수 있으면 처음부터 하나를 골라 둔다.
- 하나만 고르기는 Radio, 여러 개 고르기는 Checkbox, 바로 적용되는 켜기 · 끄기는 Switch.
- 선택지를 설명하는 링크는 라벨 옆이나 아래에 둔다 — 라벨은 고르는 글만.

### ❌ Don't

- 선택지를 가로로 늘어놓기 — 짧은 선택지를 한 줄에서 고르게 하려면 Segmented · Chip.
- 라디오 줄 안에 입력칸 · 버튼 넣기 — 설명 · 딸린 입력이 붙으면 Select Box.
- 선택지 여섯 개 이상 — Select 로 접는다.
- 선택 색을 브랜드로 깔아 두기 — 브랜드 색은 핵심 흐름에서만.
- 오류를 동그라미 색만으로 알리기 — 묶음 아래 글로 알린다.
- 라벨 안에 링크 · 버튼 — 줄의 누르는 영역(44)이 덮어 눌리지 않는다. 라벨 옆이나 아래에 따로 둔다(사용자 결정 2026-10-08).

## Specification

`radio-group.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Radio 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — radio-group.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#radio-group)

## SEED 와 다른 점

- **선택 안 된 동그라미의 테두리는 `stroke-neutral-solid`**(3:1 이상, v109). SEED 는 옅은 선(stroke.neutral-weak)이지만 porest 는 동그라미를 선으로 알아봐야 한다(1.4.11).
- **비활성은 Checkbox 와 같게**(사용자 결정) — 선택 안 됨은 `bg-disabled` + `stroke-neutral-weak`, 선택은 채운 원 그대로 `bg-disabled` + `fg-disabled` 점. SEED 는 팔레트 gray-300 을 쓰고, 선택이면 채움을 빼고 테두리 + 커진 점(8 → 10)으로 그린다.
- 투명한 누름(SEED bg.transparent-pressed)은 불투명한 가장 가까운 역할(`bg-layer-default-pressed`)로 — 8자리 hex 를 lint 가 거부한다.
- **묶음은 세로만**(사용자 결정) — SEED 는 가로를 피하라고 하되, 꼭 가로로 놓아야 하면 간격을 넉넉히 두라고 한다. porest 는 가로 자리에 Segmented · Chip 을 쓴다.
- **묶음 줄 사이는 12**(사용자 결정) — SEED 는 4 다. 4 면 이웃 줄의 누르는 영역(44)과 겹쳐 한 줄이 실제로 36 · 40 만 받는다. porest 는 기초에서 44 를 반드시로 정했다(Inclusive Design).
- 웹의 `hovered` · `focused` 를 더한다(v106).

## Migration notes

### 2026-10-08 — Enter · 묶음 상태 · 오류 예 · 라벨 안 링크

앱 적용(desk-front #428 ~ #430 · desk-app #407 ~ #410)이 남긴 문제를 사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6)에서 정했다.

- **Enter**(B1) — 스펙은 "Enter 는 폼 제출에 둔다" 인데 Radix 는 Enter 를 막기만 해 아무 일도 없었다. Radix 의 선택지는 `onKeyDown` 을 덮어쓰므로 묶음이 Enter 를 받아 폼의 기본 버튼을 누른다 — 진짜 input · SEED 와 같다. 고르기는 Space · 화살표 그대로다. `Radiomark` 를 담는 List(`ListRadioGroup`) · Select Box(`RadioSelectBoxGroup`) 묶음도 같은 처리(`submitOnRadioEnter`)를 쓴다.
- **묶음 상태**(9) — Field 의 오류 · 필수 · 막힘이 묶음에 닿지 않았다(묶음 `aria-required` 는 늘 "false"). 묶음에 `aria-invalid` · `aria-required` · `aria-disabled` 를, 막히면 선택지마다 `disabled` 를 건다. 묶음에 직접 준 값이 이긴다.
- **오류 예**(9) — "코드" 절의 오류 예가 Field 전의 꼴(`text-t2` 글을 손으로 잇기)이었다. Field 판으로 바꿨다.
- **라벨 안 링크**(C1) — 줄의 누르는 영역이 라벨 안 링크를 덮는다. 레시피는 그대로 두고 Don't 에 적었다 — 링크는 라벨 옆 · 아래에.

### 2026-09-30 — SEED Radio 구조로

사용자가 비교 페이지(https://claude.ai/artifact/Y19vXuAFz7rjMtTukR3Xt4)에서 정했다 — 틀은 SEED(Radiomark · Radio · Radio Group, 크기 medium 20 · large 24 + 라벨 14 · 16 + 줄 32 · 36) · 세로만(가로 배치 없음) · 묶음 줄 사이 12(SEED 는 4 — 누르는 영역 44 를 지키려고 넓혔다, Checkbox 묶음도 같은 값으로) · 선택 모양은 SEED(채운 원 + 가운데 점 8 · 10) · 비활성 선택은 채운 원 + 회색 점(Checkbox 와 같게) · 설명 · 딸린 입력이 붙는 선택은 Select Box. 선택 색(neutral 기본 + brand)과 오류(묶음 아래 글)는 Checkbox 때 정한 규칙이다.

| 옛 | 새 |
|---|---|
| 크기 하나 18 | `medium`(20, 기본) · `large`(24) |
| 선택 = `border-primary` 테두리 + 가운데 점 16(`primary`) | 선택 = 테두리 없이 채운 원(`bg-neutral-inverted`, `tone="brand"` 면 `bg-brand-solid`) + 가운데 점 8 · 10 |
| 선택 안 됨 테두리 `border-strong` | `stroke-neutral-solid`(값은 같다 — 역할 이름으로) · 호버 = 누름 `bg-layer-default-pressed` |
| 비활성 50% 흐림 | 전용 색 — `bg-disabled` · `stroke-neutral-weak` · `fg-disabled`(v106) |
| 묶음 줄 사이 8(`gap-sm`) · 짧은 둘은 가로(사이 16 · 24) | 줄 사이 12(`spacing-x3`) · 세로만 |
| 라벨은 쓰는 쪽이(`Label` 14/500 · `gap-md`) · 옵션마다 설명 줄(caption) | `Radio` 가 라벨까지 — t4 14/400(굵게는 `weight="bold"` 700). 설명이 붙으면 Select Box |
| 동그라미 컴포넌트 이름 `RadioGroupItem` | 동그라미는 `Radiomark`, `Radio` 는 동그라미 + 라벨 |
| 전환 `motion-duration-fast` · `ease-out` | `motion-duration-color-transition` · `motion-ease-easing`(v104 이름) + 누름 축소 |

제품은 앱 적용 단계에서 옮긴다 — 라디오 동그라미가 나오는 곳은 반복 거래의 "종료" 하나다(웹 추가 대화상자 · 거래에서 반복 만들기 대화상자, 앱 반복 설정). 셋 다 그 화면 안에서 손으로 그렸고(웹은 17 · 2px 고리 + 점 7, 앱은 17 · 채운 원 + 흰 점 6), 설명 · 입력칸이 붙어 Select Box([`select-box.md`](select-box.md))로 옮긴다. 앱의 공용 `PRadio` · `PRadioTile` 은 쓰는 곳이 없다(점이 14 로 옛 스펙 16 과도 달랐다). HR 웹에는 라디오가 없다.
