# Input

> 한 줄 글 · 숫자를 직접 치는 입력칸(Text Input)입니다. 이름 · 금액 · 제목 · 아이디 · 검색어처럼 짧은 값을 받을 때 씁니다. 여러 줄은 [Textarea](textarea.md), 짧은 목록에서 고르는 값은 [Select](select.md), 달력 · 시트 · 긴 목록에서 고르는 값은 [Input Button](input-button.md) 을 씁니다.

칸은 상자(Container) · 입력 · 앞 · 뒤 붙이개 · 지우기 버튼으로 이뤄집니다. 라벨 · 설명 · 오류 · 글자 수는 [Field](field.md) 가 둘레에서 그립니다.

수치 원본은 [`input.yaml`](input.yaml)입니다.

[그림: 거래 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/input.tsx#hero)

### 직접 골라 보기

모양 · 크기 · 상태 · 앞 · 뒤 붙이개 · 지우기를 고르면 스펙대로 그린 칸과 그 코드가 바뀝니다. 실제로 쓸 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/input.tsx#playground)

## Anatomy

[그림: 칸은 상자 · 입력 · 앞 · 뒤 붙이개 · 지우기 버튼으로 이뤄진다](../../site/components/specs/input.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리입니다. 어디를 눌러도 입력으로 포커스가 갑니다. |
| ⓑ Prefix | 앞 붙이개 — 아이콘(검색 돋보기) · 글자(https:// · 만 · −). 없어도 됩니다. |
| ⓒ Value · Placeholder | 입력 — 쓴 값, 비었으면 예시 글(placeholder)입니다. |
| ⓓ Suffix | 뒤 붙이개 — 단위 글자(원 · % · 일 · 회) · 아이콘. 누르는 단추(비밀 보기 눈 · 복사)는 아래 "뒤 단추" 를 봅니다. |
| ⓔ Clear Button | 지우기 — 값이 있을 때만 보입니다. |

[표: 부위](input.yaml#slots)

## Properties

### Variant

상자(`outline`)가 기본입니다. 화면에 입력이 하나뿐이면 밑줄(`underline`)을 씁니다 — 금액을 먼저 받는 화면, 목록 위 검색, 초대 코드, 잠금 해제 비밀번호. 밑줄은 글자가 한 단계 크고(large 18) 좌우 여백 · 모서리가 없습니다.

[그림: 모양 — 상자 · 밑줄](../../site/components/specs/input.tsx#variant)

[표: 모양](input.yaml#variant)

### Size

`large`(52 · 밑줄 40)는 폰 · 앱에서, `medium`(40 · 밑줄 34)은 1280 이상 데스크톱 웹(마우스)에서만 씁니다. 웹의 기본은 `responsive` 입니다 — 1280 미만은 large, 이상은 medium. 앱은 늘 large 입니다. 한 폼 안에서 크기를 섞지 않습니다. 예외 하나 — 상단 바 안의 검색칸(거래 검색 화면의 제목 자리 · 데스크톱 머리 왼쪽)은 바 56 안이라 폰 · 앱에서도 `medium` 40 입니다([Top Navigation](top-navigation.md) 의 검색칸).

[그림: 크기 — large · medium, 반응형은 1280 에서 바뀐다](../../site/components/specs/input.tsx#size)

[표: large](input.yaml#grid.variant.size.large)

[표: medium](input.yaml#grid.variant.size.medium)

[표: 반응형](input.yaml#grid.variant.size.responsive)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak` |
| `focused` | 안쪽에 2px `stroke-neutral-contrast` 를 덧그립니다 — 마우스 · 터치로 눌러도(캐럿과 함께 지금 쓰는 칸을 알립니다). 내용은 밀리지 않습니다 |
| `invalid` | 안쪽 2px `stroke-critical-solid` — 포커스해도 그대로입니다. 오류 글은 Field 가 칸 아래에 둡니다 |
| `disabled` | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 흐리게 하지 않습니다 |
| `readonly` | 바탕 `bg-disabled` · 값은 진한 글자 그대로, 포커스 테두리 없음(포커스 표시를 두지 않습니다 — 까닭은 아래 Accessibility). 밑줄형은 바탕 대신 글자가 `fg-neutral-muted` 입니다 |

[그림: 상태 — 기본 · 포커스 · 오류 · 오류 + 포커스 · 비활성 · 읽기 전용(상자 · 밑줄)](../../site/components/specs/input.tsx#states)

[표: 상태 — 상자](input.yaml#matrix)

[표: 상태 — 밑줄](input.yaml#matrix.variant.underline)

[표: 모션](input.yaml#motion)

캐럿은 글자색(`fg-neutral`)이고 고른 글은 기기 기본 하이라이트입니다 — 색을 따로 두지 않습니다. 앱도 캐럿을 같은 색으로 둡니다.

### Prefix · Suffix

칸 안 앞 · 뒤에 글자나 아이콘을 둡니다. 글자(`prefix` · `suffix`)는 칸 글자와 같은 크기의 `fg-neutral-subtle`, 아이콘(`prefixIcon` · `suffixIcon`)은 large 20 · medium 16(밑줄 24 · 20)의 `fg-neutral-muted` 입니다.

- 단위는 뒤 글자로 둡니다 — 라벨에 "(원)" 을 붙이거나 칸 밖에 따로 쓰지 않습니다. 단위 글자는 칸의 설명으로도 읽힙니다(화면 읽기 프로그램이 "원" 을 듣습니다).
- 아이콘만으로 뜻을 알리지 않습니다 — 라벨이나 설명에 글로도 씁니다.

[그림: 붙이개 — https:// · 원 · 만 ~ 세 · 검색 돋보기](../../site/components/specs/input.tsx#affix)

### Clear Button

값이 있을 때 한 번에 지우는 버튼(`clearable`)입니다 — large 22 · medium 18 의 `fg-neutral-subtle` 원 X(lucide 선 아이콘 `circle-x`). 막혔거나 읽기 전용이면 보이지 않습니다. 누르면 값을 비우고 입력에 포커스를 둡니다. 검색칸 · 선택 사항인 칸에 둡니다(필수 칸에는 두지 않습니다 — 지울 일이 드물기 때문입니다).

누르는 영역은 44 입니다 — 보이는 원 둘레로 넓혀(기초 Inclusive Design 의 "누르는 영역은 모두 44 × 44 이상") 아이콘 바로 바깥을 눌러도 지웁니다. 상자 밖은 상자가 자르므로 medium(40)에서는 44 × 40 입니다. 넓힌 자리는 입력 글의 오른쪽 끝을 덮습니다 — 그 자리를 누르면 캐럿을 옮기지 않고 지웁니다.

[그림: 지우기 — 값이 있을 때만](../../site/components/specs/input.tsx#clear)

### 뒤 단추 — 눈 · 복사

칸 안 오른쪽 끝에 누르는 단추(비밀 보기 눈 · 복사)를 둘 때는 지우기 버튼과 같은 자리 규칙입니다 — 누르는 영역 44(상자가 자르는 medium 은 44 × 40), 입력 글의 오른쪽 끝을 그만큼 비웁니다. 단위 글자 · 장식 아이콘(위 Suffix)과 달리 이름이 있는 단추입니다("비밀번호 보기" · "복사"). 지우기 버튼처럼 호버 · 누름 바탕 상자를 그리지 않습니다 — 켬 · 끔 같은 상태는 아이콘으로만 보입니다([Toggle](toggle.md) 의 바탕 규칙의 예외).

## Guidelines

### 화면에 입력이 하나뿐이면 밑줄

한 화면이 값 하나를 받으면(금액을 먼저 받는 단계 화면, 목록 위 검색) 밑줄형으로 크게 둡니다. 상자형 칸 하나만 덩그러니 두지 않습니다.

[그림: 밑줄 — 금액을 먼저 받는 화면 · 상자 하나만 둔 화면](../../site/components/specs/input.tsx#underline-guide)

**검색 입구** — 누르면 검색 시트 · 화면을 여는 자리(증권 종목 찾기)는 밑줄 검색칸 모양 그대로 두지만 칸이 아니라 단추입니다. 읽는 이름은 "종목 검색, 단추" 이고 예시 글을 이름으로 쓰지 않습니다(입력칸으로 읽히지 않게). 누르면 시트 안 진짜 입력칸에 초점이 가고 키보드가 오릅니다. 닫으면 초점은 입구로 돌아옵니다.

### 숫자 · 금액

- 숫자 키보드를 띄웁니다(`inputMode="numeric"` · 소수면 `"decimal"`). `type="number"` 는 쓰지 않습니다 — 쉼표를 못 넣고, 휠 · 화살표로 값이 바뀌기 때문입니다.
- 쓰는 동안 천 단위 쉼표를 넣습니다("12,000"). 단위는 뒤 글자("원")입니다.
- 작은 정수라도 흔한 값이 열 단계보다 멀면(반복 거래 "총 12회" — 흔한 24 · 36) 이 숫자 칸입니다. 흔한 값이 열 단계 안쪽이면 [Quantity Picker](quantity-picker.md) 입니다.

[그림: 금액 — 쉼표와 뒤 글자 원 · 쉼표 없이 라벨에 (원)](../../site/components/specs/input.tsx#number-guide)

### 형식이 정해진 값은 한 칸에

전화번호 · 주민등록번호 · 카드 번호처럼 형식이 정해진 값은 칸을 나누지 않습니다 — 한 칸에서 쓰는 대로 형식(하이픈)을 맞춰 줍니다. 두 칸을 나란히 두는 것은 라벨과 값이 짧을 때만입니다(Field › Form 의 구성).

[그림: 형식 — 한 칸에 하이픈을 맞춰 준다 · 세 칸으로 나눈 전화번호](../../site/components/specs/input.tsx#format-guide)

### 고르는 값은 치게 하지 않습니다

날짜 · 시각 · 카테고리 · 자산처럼 정해진 값 중에서 고르는 것은 Input(타이핑)으로 받지 않습니다 — 짧은 선택지는 [Select](select.md) 의 칸 아래 목록으로, 달력 · 시트 · 긴 목록은 입력칸 모양의 버튼 [Input Button](input-button.md) 으로 엽니다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 짧은 글 · 숫자를 직접 친다 | **Input** |
| 작은 정수를 한 단계씩 — 흔한 값이 열 단계 안쪽(승인 필요 횟수 0 ~ 3) | [Quantity Picker](quantity-picker.md) |
| 여러 줄 글을 친다 | Textarea |
| 짧은 선택지 5개 이상에서 값을 고른다 | Select |
| 달력 · 시각 · 시트 · 긴 목록에서 고른다 | Input Button |
| 설명이 붙는 2 ~ 6개를 견줘 고른다 | Select Box |

## 코드

레시피 `recipes/shadcn/components/ui/input.tsx`(Input)를 [Field](field.md) 안에 둡니다. 레시피는 상자(div) + 입력으로 이뤄집니다 — `className` 은 입력에, 상자에는 `rootClassName` 을 줍니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 기본

[그림: 기본 — Field 안의 칸](../../site/components/specs/input.tsx#ex-basic)

```tsx
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field label="제목" description="결재 목록에 이 제목으로 보여요.">
  <Input placeholder="예: 개인 사유" />
</Field>
```

### 붙이개

[그림: 붙이개 — 금액 · 검색](../../site/components/specs/input.tsx#ex-affix)

```tsx
import { Search } from "lucide-react"

<Field label="금액">
  <Input inputMode="numeric" value={formatted} onChange={onAmountChange} suffix="원" />
</Field>

<Input aria-label="메모 검색" prefixIcon={<Search />} placeholder="메모 검색" clearable />
```

### 밑줄

[그림: 밑줄 — 화면에 입력 하나](../../site/components/specs/input.tsx#ex-underline)

```tsx
<Field label="얼마를 썼나요?" labelWeight="bold">
  <Input variant="underline" size="large" inputMode="numeric" suffix="원" autoFocus />
</Field>
```

### 상태

[그림: 상태 — 오류 · 비활성 · 읽기 전용](../../site/components/specs/input.tsx#ex-states)

```tsx
<Field label="이름" invalid errorMessage="이름을 입력해주세요.">
  <Input />
</Field>
<Field label="계좌" disabled>
  <Input defaultValue="국민 123-45-6789" />
</Field>
<Field label="아이디" readOnly>
  <Input defaultValue="groo" />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 상자 어디를 눌러도(붙이개 · 여백 포함) 입력으로 포커스가 가고 테두리가 2px 짙어집니다. |
| Keyboard `Tab` | 다음 칸으로 갑니다. 지우기 버튼은 Tab 순서에 없습니다(값을 지우는 키는 있습니다). |
| `<label>` 누르기 | 연결된 칸으로 포커스가 갑니다(Field 가 잇습니다). |
| 쓰기 | 최대 글자 수(Field `maxGraphemeCount`)에 닿으면 더 들어가지 않습니다 — 한글은 조합이 끝난 뒤 자릅니다. 앱에서 쓰고 있는 글은 글자 단위로 줄을 바꿉니다([Textarea](textarea.md) 의 "입력 중인 글의 줄바꿈"). |
| 글자 크기 설정 | 값 · placeholder · 붙이개 글은 글자 크기 설정을 따라 커지고, 상자 높이가 최소값에서 따라 늘어납니다. 줄은 하나를 지킵니다. 앞 · 뒤 아이콘과 지우기는 px 로 그대로입니다. |
| 값이 칸보다 길 때 | 최대값이나 큰 글자에서 값이 칸보다 길면 칸 안에서 가로로 스크롤합니다 — 캐럿 자리가 보이게 따라갑니다. 칸 폭을 키우거나 글자를 줄이지 않습니다. "금액은 자르지 않는다" 는 보여 주는 값(목록 · 카드의 금액)의 규칙이고, 고치는 중인 입력칸은 칸 안 스크롤을 받아들입니다. |
| 지우기 | 값을 비우고(`onChange` 로 빈 값) 입력에 포커스를 둡니다. 누르는 영역은 원 둘레 44 입니다. |
| `Enter`(폼 안) | 폼을 제출합니다(브라우저 기본). Enter 를 직접 받는 곳은 한글을 조합하는 중(`isComposing`)이면 무시합니다. |
| Disabled | 포커스 · 입력이 되지 않습니다. 커서는 not-allowed 입니다. |
| Readonly | 포커스 · 복사는 되고 입력은 되지 않습니다. 포커스 테두리가 없습니다 — 포커스 표시를 두지 않습니다. |
| 자동 완성 | 브라우저 자동 완성의 바탕색을 지웁니다 — 칸 모양 그대로입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42, 붙이개 글자 `fg-neutral-subtle` 5.50 · 6.09(시트 다크 5.27), 읽기 전용 바탕 위 값 15.20 · 10.32 ✓. placeholder `fg-placeholder` 4.18 · 4.13(시트 다크 3.58, 읽기 전용 바탕 위 3.87 · 3.18) — 4.5:1 에 못 미칩니다. placeholder 는 예시만 두고 칸의 이름은 라벨이 알립니다. 비활성 `fg-disabled` 는 기준 밖입니다(비활성 UI) |
| **WCAG 1.4.4** Resize text | 값 · placeholder · 붙이개 글이 글자 크기 설정을 따라 커지고 상자가 따라 높아집니다 ✓ — 칸보다 긴 값은 칸 안에서 가로로 스크롤해 모두 읽습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 테두리 `stroke-neutral-contrast` 16.41 · 13.42, 오류 `stroke-critical-solid` 5.06 · 6.08 ✓. 기본 1px `stroke-neutral-weak`(1.23 · 1.56)는 칸을 알리는 유일한 표시가 아닙니다 — 라벨 · placeholder 가 칸을 알립니다 |
| **WCAG 2.4.7** Focus visible | 편집 칸 — 포커스하면 테두리가 2px 짙어집니다(키보드 · 마우스 모두) ✓. 읽기 전용 — 포커스 표시가 없습니다 ⚠. 읽기 전용은 값을 보이는 자리라 편집 칸과 같은 표시를 주면 쓸 수 있는 칸으로 읽히기 때문입니다. 다른 컨트롤과 같은 바깥 링도 두지 않습니다. 크로미움은 읽기 전용 칸에 캐럿도 그리지 않아 Tab 으로 들어가도 보이는 변화가 없습니다 — 읽기 전용 칸은 복사 · 읽기를 위해 Tab 순서에 남깁니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓(가장 작은 밑줄 medium 34). 지우기 버튼 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | large 52 ✓ · medium 40 ⚠ — medium 은 1280 이상 데스크톱 웹(마우스)에서만 씁니다. 밑줄 large 40 ⚠ — 칸 폭 전체가 누르는 영역이라 가로는 넉넉합니다. 지우기 버튼 44 ✓(medium 상자 안에서는 44 × 40 ⚠) |
| **ARIA** | 이름은 Field 의 라벨(`<label for>`)이고, 라벨이 없으면 `aria-label` 입니다. 오류면 `aria-invalid`, 필수면 `aria-required`, 설명 · 오류 · 글자 수 · 붙이개 글자는 `aria-describedby` 입니다. 지우기 버튼 이름은 "지우기" 입니다 |

## Do / Don't

### ✅ Do

- 모든 칸을 Field 로 감싸 라벨을 답니다.
- placeholder 는 예시만 둡니다("예: 개인 사유").
- 단위는 뒤 글자로, 금액은 쉼표를 넣어서 보입니다.
- 화면에 입력이 하나뿐이면 밑줄형을 씁니다.
- 한 폼 안에서 크기를 맞춥니다.

### ❌ Don't

- placeholder 를 라벨 대신 쓰지 않습니다.
- 비활성 칸을 흐리게(불투명도) 그리지 않습니다.
- 고르는 값(날짜 · 카테고리)을 타이핑으로 받지 않습니다.
- 형식이 정해진 값을 여러 칸으로 나누지 않습니다.
- `type="number"` 로 금액을 받지 않습니다.
- 폰에서 medium(40)을 쓰지 않습니다.

## Specification

`input.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Input 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — input.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input)
