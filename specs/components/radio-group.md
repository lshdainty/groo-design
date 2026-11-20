# Radio Group

> 여러 옵션 가운데 하나만 고르게 하는 컴포넌트입니다. 선택지를 모두 펼쳐 두고, 저장하기 전에 하나를 고를 때 씁니다.

Radio 는 세 부품으로 이뤄집니다 — 동그라미(Radiomark) · 동그라미 + 라벨(Radio) · 묶음(Radio Group).

수치 원본은 [`radio-group.yaml`](radio-group.yaml)입니다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그립니다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보입니다.

[그림: 선택 안 됨 · 선택 — neutral · brand, 위는 라이트 아래는 다크](../../site/components/specs/radio-group.tsx#hero)

### 직접 골라 보기

크기 · 톤 · 굵기 · 상태를 고르면 스펙대로 그린 Radio 와 그 코드가 바뀝니다. 묶음 안에서 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/radio-group.tsx#playground)

## Anatomy

[그림: Radio 는 동그라미(Radiomark)와 라벨로 이뤄집니다 — 동그라미는 따로 떼어 쓸 수 있습니다](../../site/components/specs/radio-group.tsx#anatomy)

| ⓐ Radiomark | 동그라미 — 배경 · 테두리입니다. 라벨을 따로 짜는 자리(Select Box 의 오른쪽 동그라미 같은)에서 따로 씁니다. |
| ⓑ Dot | 가운데 점 — 선택을 나타냅니다. 선택 안 됨에는 보이지 않습니다. |
| ⓒ Label | 무엇을 고르는지 적습니다. 동그라미와 함께 눌립니다. |
| ⓓ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움을 그립니다. |

[표: 부위](radio-group.yaml#slots)

## Properties

### Size

두 가지입니다. 동그라미 · 점 · 라벨 · 줄 높이가 함께 정해집니다 — Checkbox 와 같은 크기라 한 폼에 함께 서도 줄이 맞습니다.

- `medium`(동그라미 20 · 점 8 · 라벨 14 · 줄 32) — 기본. 화면 안의 폼 · 설정.
- `large`(동그라미 24 · 점 10 · 라벨 16 · 줄 36) — 한 화면의 중심 선택, 모바일에서 홀로 서는 선택.

누르는 영역은 라벨까지 묶어 가로 · 세로 44 까지 넓힙니다(기초 Inclusive — 44 는 반드시 지킵니다).

[그림: 크기 두 가지 — 동그라미 · 라벨 · 줄 높이](../../site/components/specs/radio-group.tsx#sizes)

[표: 크기](radio-group.yaml#size)

모든 조합에 공통인 값:

[표: 공통](radio-group.yaml#base)

### Weight

라벨 굵기입니다. 강조가 필요할 때 `bold` 를 씁니다.

[그림: 라벨 굵기 — regular · bold](../../site/components/specs/radio-group.tsx#weight)

[표: 굵기](radio-group.yaml#weight)

### Tone

선택했을 때의 색입니다. **`neutral`(짙은 회색)이 기본**이고, 브랜드 색(`brand`)은 서비스 핵심 흐름에서만 씁니다 — Checkbox 와 같은 규칙입니다. 선택하면 테두리 없이 원을 채우고, 가운데에 채움과 대비되는 점이 섭니다(neutral 은 `fg-neutral-inverted`, brand 는 흰색).

[그림: 톤 두 가지 — neutral · brand(Desk · HR)](../../site/components/specs/radio-group.tsx#tones)

### State

선택 여부(선택 안 됨 · 선택)와 상호작용 상태가 곱해집니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 누름 색과 같고, 축소는 없습니다 |
| `focused` | 웹 · 앱. 키보드 포커스에만 링 2px · 띄움 2px. 앱은 하드웨어 키보드로 옮길 때만 그리고, 손가락으로 누를 때는 그리지 않습니다 |
| `pressed` | 누름 색 + 동그라미 세로 2px 거리 축소. 라벨은 줄지 않습니다. 선택 안 됨의 누름 색은 불투명한 `bg-layer-default-pressed` 입니다 |
| `disabled` | 전용 색 — 선택 안 됨은 `bg-disabled` + 테두리 `stroke-neutral-weak`, 선택은 채운 원 그대로 `bg-disabled` + 점 `fg-disabled` 로 색만 바뀝니다(Checkbox 와 같습니다). 불투명도로 흐리게 하지 않습니다 |

선택 안 된 동그라미의 테두리는 `stroke-neutral-solid`(표면과 3:1 이상)입니다 — 동그라미를 선으로 알아봐야 하기 때문입니다(WCAG 1.4.11).

[그림: 선택 여부 × 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸습니다](../../site/components/specs/radio-group.tsx#states)

[표: 상태 매트릭스 — neutral · 선택 안 됨](radio-group.yaml#matrix.checked.unchecked)

[표: 상태 매트릭스 — neutral · 선택](radio-group.yaml#matrix.checked.checked)

[표: 상태 매트릭스 — brand · 선택](radio-group.yaml#matrix.tone.brand.checked.checked)

[그림: 직접 눌러 보기 — 동그라미나 라벨을 누르면 바뀝니다(Tab 으로 들어가 화살표로 옮깁니다)](../../site/components/specs/radio-group.tsx#live)

[표: 모션](radio-group.yaml#motion)

### Group

선택지를 묶어 세로로 쌓습니다. 하나를 고르면 앞에 고른 것은 풀립니다. 줄 사이는 12 입니다 — 줄 높이 32 · 36 에 더하면 44 · 48 마다 한 줄이 서서, 묶음 안에서도 줄마다 누르는 영역 44 를 온전히 받습니다(줄 사이가 4 면 이웃 줄의 누르는 영역과 겹쳐 한 줄이 36 · 40 만 받습니다). 줄은 동그라미 + 라벨만큼만 차지하고 묶음 폭으로 늘이지 않습니다. 가로로 늘어놓지 않습니다 — 짧은 선택지를 한 줄에서 고르게 하려면 Segmented · Chip 을 씁니다.

[그림: 묶음 — 하나를 누르면 앞에 고른 것이 풀립니다](../../site/components/specs/radio-group.tsx#group)

[표: 묶음](radio-group.yaml#base@group)

## Guidelines

이 절의 그림은 캘린더 일정의 반복 선택지(반복 없음 · 매일 · 매주 · 매월)를 예로 그립니다.

### 누르는 영역

라벨을 포함한 줄 전체가 누르는 영역입니다. 동그라미 20 · 24 만으로는 작습니다 — 라벨까지 묶고 위아래로 44 까지 넓힙니다. 묶음에서는 줄 사이 12 가 이 영역이 서로 겹치지 않게 합니다.

[그림: 누르는 영역(분홍) — 동그라미 + 라벨이 한 영역](../../site/components/specs/radio-group.tsx#touch-target)

### 묶음 쓰기

묶음 위에 무엇을 고르는지 제목을 두고, 선택지는 세로로 쌓습니다. 선택지 개수는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 판단 순서를 따릅니다 — 2 ~ 4개 · 글이 길 때 Radio, 5개 이상은 Select 입니다. 처음부터 하나를 골라 둘 수 있으면 골라 둡니다(보통 가장 흔한 것).

[그림: 제목 + 세로 묶음 · 가로로 늘어놓지 않습니다](../../site/components/specs/radio-group.tsx#group-guide)

### 선택 색

선택 색은 짙은 회색이 기본입니다. 브랜드 색은 서비스 핵심 흐름에만 씁니다 — 선택 컨트롤마다 브랜드 색을 깔면 브랜드 색 버튼이 설 자리가 없어지기 때문입니다.

[그림: 선택 색](../../site/components/specs/radio-group.tsx#tone-guide)

### 설명 · 딸린 입력

선택지마다 설명이 붙거나, 고르면 입력칸이 따라 나와야 하면 Radio 가 아니라 **Select Box** 를 씁니다. Radio 에는 라벨 하나만 있습니다(길면 줄이 바뀝니다) — 설명 줄이나 딸린 입력 자리가 없습니다. 줄 안에 입력칸을 넣으면 화면 읽기 프로그램이 입력칸을 라디오의 일부로 읽습니다.

[그림: 반복 거래 "종료" — 설명 · 입력칸이 붙는 선택은 Select Box](../../site/components/specs/radio-group.tsx#selectbox-guide)

### 오류

동그라미 모양은 바꾸지 않습니다. 묶음 아래에 무엇을 해야 하는지 글로 알립니다(Checkbox 와 같습니다). 오류 상태는 따로 두지 않습니다. 묶음을 [Field](field.md) 로 감싸면 그 꼬리가 오류 글 자리이고, 라벨은 묶음의 이름으로 이어집니다. Field 의 오류 · 필수 · 막힘도 묶음에 닿습니다 — 묶음(`role="radiogroup"`)에 `aria-invalid` · `aria-required`, 막히면 묶음에 `aria-disabled` 와 선택지마다 `disabled` 를 겁니다. 묶음에 직접 준 값이 Field 의 값보다 우선합니다. 처음부터 하나를 골라 두면 오류가 날 일이 없습니다 — 오류 글은 골라 둘 수 없는 선택(사용자가 꼭 스스로 골라야 하는)에만 씁니다.

[그림: 오류는 묶음 아래 글로](../../site/components/specs/radio-group.tsx#error)

### Radio 와 다른 선택 컨트롤

선택지 개수 · 설명 · 글 길이로 어느 컴포넌트로 고를지 정하는 표는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 한 곳에 있습니다. 여기에는 비슷한 셋을 견주는 표만 둡니다.

| | Radio | [Checkbox](checkbox.md) | [Chip](chip.md) |
|---|---|---|---|
| 사용자의 인식 | 하나의 정답을 고릅니다 | 해당되는 것에 모두 체크합니다 | 특징을 고르거나 분류합니다 |
| 고르는 수 | 하나 | 여럿 | 하나 · 여럿 다(칩 묶음이 정합니다) |
| 글 | 문장도 됩니다 — 줄이 바뀝니다 | 문장도 됩니다 | 명사 하나 — 줄바꿈하지 않습니다 |
| 놓는 모양 | 세로만 | 세로 · 부모가 맨 위 | 가로 — 줄바꿈 또는 한 줄 스크롤 |
| 주 쓰임 | 폼 값 제출 | 포함 · 제외 · 동의 | 폼 값(2 ~ 4) · 거르기(필터 바) · 제안 |
| Desk 예 | 공개 범위 | 내보낼 데이터 · 약관 동의 | 거래 종류 · 카테고리 필터 · 빠른 금액 |

설명 · 딸린 입력이 붙으면 [Select Box](select-box.md), 화면 폭 목록에서 누르는 순간 바뀌는 고르기는 [List](list.md) 의 라디오 줄(`ListRadioItem`)을 씁니다. 여러 개를 고르면 Checkbox, 켜고 끄기 하나를 바로 적용하면 Switch 를 씁니다.

## 코드

레시피 `recipes/shadcn/components/ui/radio-group.tsx` 를 씁니다 — `RadioGroup`(묶음) · `Radio`(동그라미 + 라벨) · `Radiomark`(동그라미). `Radio` · `Radiomark` 는 `RadioGroup` 안에서만 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

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

한 묶음 안에서 톤을 섞지 않습니다.

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

묶음을 [Field](field.md) 로 감쌉니다 — 라벨이 묶음의 이름, 오류 글이 묶음의 설명(`aria-describedby`)이 되고, 묶음에 `aria-invalid` 가 걸립니다. 동그라미는 바꾸지 않습니다.

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

화면 폭 목록의 줄은 List 의 `ListRadioItem` 을 씁니다 — 줄의 여백 · 글자 · 누름이 정해져 있습니다. 라벨을 따로 짜야 할 때만 `Radiomark` 를 쓰고, 줄을 `<label>` 로 감싸 줄 어디를 눌러도 고르게 합니다. `group/radio` 를 달면 줄을 누르거나 올려도 동그라미가 누름 색 · 축소로 반응합니다. 직접 짠 줄은 묶음 폭을 다 씁니다(`Radio` 줄만 내용만큼 차지합니다).

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
| Click / Tap(동그라미 · 라벨) | 그 선택지를 고릅니다. 앞에 고른 것은 풀립니다. 이미 고른 것을 다시 눌러도 풀리지 않습니다. `disabled` 면 무시합니다. |
| Keyboard `Tab` | 묶음에 들어가고 나갑니다 — 고른 선택지(없으면 첫 선택지)로 들어갑니다. 묶음 안에서는 화살표로 옮깁니다. |
| Keyboard `↑` `↓` `←` `→` | 이전 · 다음 선택지로 옮기며 고릅니다. 막힌 선택지는 건너뜁니다. |
| Keyboard `Home` · `End` | 받지 않습니다 — 초점도 고른 선택지도 그대로이고, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도 같습니다). 첫 · 끝 선택지로는 화살표로 갑니다 — 진짜 라디오 · WAI-ARIA APG Radio Group 과 같습니다. 라디오를 담는 묶음(Chip 하나 고르기 · Segmented Control · Select Box 하나 고르기 · List 라디오 줄)이 모두 같습니다. [Tabs](tabs.md) 는 Home · End 로 옮기며 고릅니다. |
| Keyboard `Space` | 포커스된 선택지를 고릅니다. |
| Keyboard `Enter` | 폼을 제출합니다 — 진짜 `<input type="radio">` 처럼 폼의 기본 버튼(첫 제출 버튼)을 누릅니다. 고르지 않습니다. 기본 버튼이 없거나 막혀 있으면 아무것도 하지 않습니다. Radix 의 선택지는 Enter 를 막기만 하므로 묶음이 받습니다. 동그라미만(`Radiomark`) 쓰는 List 의 라디오 줄 · Select Box 하나 고르기도 같습니다. |
| Disabled(묶음) | 모든 선택지가 막힙니다 — 묶음에 `aria-disabled` 를 겁니다. 막힌 Field 로 감싸도 같습니다. |
| Disabled(선택지) | 그 선택지만 막힙니다 — 골라 둔 채로 막을 수 있습니다(채운 원 그대로 색만 바뀝니다). |
| 글자 크기 설정 | 라벨이 커지고 줄을 바꿔 받습니다 — 줄은 최소 높이라 글을 따라 늘어납니다. 동그라미 · 점은 컨트롤 모양이라 px 그대로이고, 라벨이 여러 줄이면 라벨 전체의 세로 가운데에 섭니다. |

**Form 안** — Radix 의 숨은 `<input type="radio">` 가 폼 제출에 들어갑니다(`name` 은 묶음에 줍니다). 검증은 `onSubmit` 에서 합니다 — 누르는 동안 오류를 띄우지 않습니다.

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(라벨 ≥ 4.5:1) | 라벨 `fg-neutral` × 흰 표면 16:1+ ✓ |
| **WCAG 1.4.4** Resize text | 라벨이 글자 크기 설정을 따르고 줄을 바꿔 받아 잘리지 않습니다 ✓. 동그라미 · 점은 px 그대로입니다(컨트롤 모양 — 선택 상태는 보조 기술의 `aria-checked` 로도 읽힙니다) |
| **WCAG 1.4.11** Non-text contrast(UI ≥ 3:1) | 선택 안 된 동그라미 테두리 `stroke-neutral-solid` × 표면 4.2:1(다크 4.1:1) ✓ · 선택 채움 `bg-neutral-inverted` × 표면 16.4:1(다크 13.4:1) ✓ · 가운데 점 × 채움 — neutral 16.4:1(다크 13.4:1), brand Desk 8.4:1 · HR 8.2:1 ✓. 다크의 brand 채움은 표면과 1.7:1(Desk · HR)이라 채움만으로는 3:1 이 되지 않습니다 — 선택은 가운데 흰 점(표면과 14.5:1)과 테두리가 사라지는 모양이 알립니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링 2px · 띄움 2px(`stroke-focus-ring`)를 그립니다 — 앱도 키보드로 옮길 때만 같은 링을 그립니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 동그라미 20 · 24 + 라벨까지 묶은 줄 32 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 라벨까지 묶어 위아래 44 로 넓힙니다 ✓. 묶음 안에서도 줄 사이 12 라 줄마다 44 · 48 을 받습니다(줄 사이가 4 면 이웃과 겹쳐 36 · 40 이 됩니다) — 동그라미만 쓰면 그 줄 전체가 누르는 영역입니다 |
| **ARIA** | Radix 가 `role="radiogroup"`(묶음) + `role="radio"` · `aria-checked`(선택지)를 답니다. 묶음 제목은 `aria-labelledby`(또는 `<fieldset>` + `<legend>`), 오류 글은 묶음에 `aria-describedby` 로 잇습니다. 오류 · 필수는 묶음의 `aria-invalid` · `aria-required`, 막히면 묶음 `aria-disabled` + 선택지마다 `disabled` 입니다 — Field 로 감싸면 레시피가 겁니다. 동그라미만 쓰면 `<label>` 로 감싸거나 `aria-label` 을 꼭 답니다. 앱은 묶음에 이름 노드만 둡니다 — 묶음 제목을 `Semantics(label)` 로 단 노드 하나이고, 묶음 역할(`radiogroup`)은 없습니다(Flutter 에 그 역할이 없습니다). |
| **Reduced motion** | 모션 줄이기면 누름 축소를 빼고 색만 바꿉니다(기초 Motion). |

## Do / Don't

### ✅ Do

- 묶음 위에 무엇을 고르는지 제목을 둡니다.
- 선택지는 세로로 쌓습니다.
- 골라 둘 수 있으면 처음부터 하나를 골라 둡니다.
- 하나만 고르기는 Radio, 여러 개 고르기는 Checkbox, 바로 적용되는 켜기 · 끄기는 Switch 를 씁니다.
- 선택지를 설명하는 링크는 라벨 옆이나 아래에 둡니다 — 라벨에는 고르는 글만 둡니다.

### ❌ Don't

- 선택지를 가로로 늘어놓지 않습니다 — 짧은 선택지를 한 줄에서 고르게 하려면 Segmented · Chip 을 씁니다.
- 라디오 줄 안에 입력칸 · 버튼을 넣지 않습니다 — 설명 · 딸린 입력이 붙으면 Select Box 를 씁니다.
- 선택지가 5개 이상이면 Radio 로 펼치지 않습니다 — Select 로 접습니다(Select 의 판단 순서).
- 선택 색을 브랜드로 깔아 두지 않습니다 — 브랜드 색은 핵심 흐름에서만 씁니다.
- 오류를 동그라미 색만으로 알리지 않습니다 — 묶음 아래 글로 알립니다.
- 라벨 안에 링크 · 버튼을 넣지 않습니다 — 줄의 누르는 영역(44)이 덮어 눌리지 않습니다. 라벨 옆이나 아래에 따로 둡니다.

## Specification

`radio-group.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Radio 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — radio-group.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#radio-group)
