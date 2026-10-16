# Input

> 한 줄 글 · 숫자를 직접 치는 입력칸(Text Input). 이름 · 금액 · 제목 · 아이디 · 검색어처럼 짧은 값을 받는다. 여러 줄은 [Textarea](textarea.md), 짧은 목록에서 고르는 값은 [Select](select.md), 달력 · 시트 · 긴 목록에서 고르는 값은 [Input Button](input-button.md)이다.

구조는 당근 [SEED Text Input](https://seed-design.io/components/text-input)(Apache-2.0)을 따른다 — 상자(Container) · 입력 · 앞 · 뒤 붙이개 · 지우기 버튼. 라벨 · 설명 · 오류 · 글자 수는 [Field](field.md)가 둘레에서 그린다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정).

수치 원본은 [`input.yaml`](input.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/input.tsx#hero)

### 직접 골라 보기

모양 · 크기 · 상태 · 앞 · 뒤 붙이개 · 지우기를 고르면 스펙대로 그린 칸과 그 코드가 바뀐다. 실제로 쓸 수 있다.

[그림: 플레이그라운드](../../site/components/specs/input.tsx#playground)

## Anatomy

[그림: 칸은 상자 · 입력 · 앞 · 뒤 붙이개 · 지우기 버튼으로 이뤄진다](../../site/components/specs/input.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리. 어디를 눌러도 입력으로 포커스가 간다. |
| ⓑ Prefix | 앞 붙이개 — 아이콘(검색 돋보기) · 글자(https:// · 만 · −). 없어도 된다. |
| ⓒ Value · Placeholder | 입력 — 쓴 값, 비었으면 예시 글(placeholder). |
| ⓓ Suffix | 뒤 붙이개 — 단위 글자(원 · % · 일 · 회) · 아이콘. |
| ⓔ Clear Button | 지우기 — 값이 있을 때만. |

[표: 부위](input.yaml#slots)

## Properties

### Variant

상자(`outline`)가 기본이다. 화면에 입력이 하나뿐이면 밑줄(`underline`)을 쓴다 — 금액을 먼저 받는 화면, 목록 위 검색, 초대 코드, 잠금 해제 비밀번호(SEED). 밑줄은 글자가 한 단계 크고(large 18) 좌우 여백 · 모서리가 없다.

[그림: 모양 — 상자 · 밑줄](../../site/components/specs/input.tsx#variant)

[표: 모양](input.yaml#variant)

### Size

`large`(52 · 밑줄 40)는 폰 · 앱에서, `medium`(40 · 밑줄 34)은 1280 이상 데스크톱 웹(마우스)에서만 쓴다. 웹의 기본은 `responsive` 다 — 1280 미만은 large, 이상은 medium(SEED `lg`). 앱은 늘 large 다. 한 폼 안에서 크기를 섞지 않는다. 예외 하나 — 상단 바 안의 검색칸(거래 검색 화면의 제목 자리 · 데스크톱 머리 왼쪽)은 바 56 안이라 폰 · 앱에서도 `medium` 40 이다([Top Navigation](top-navigation.md) 의 검색칸, 2026-10-16 구현 세션 질문 Q-017-5 정리).

[그림: 크기 — large · medium, 반응형은 1280 에서 바뀐다](../../site/components/specs/input.tsx#size)

[표: large](input.yaml#grid.variant.size.large)

[표: medium](input.yaml#grid.variant.size.medium)

[표: 반응형](input.yaml#grid.variant.size.responsive)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak` |
| `focused` | 안쪽에 2px `stroke-neutral-contrast` 를 덧그린다 — 마우스 · 터치로 눌러도(캐럿과 함께 지금 쓰는 칸을 알린다). 내용은 밀리지 않는다 |
| `invalid` | 안쪽 2px `stroke-critical-solid` — 포커스해도 그대로. 오류 글은 Field 가 칸 아래에 |
| `disabled` | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 흐리게 하지 않는다(v106) |
| `readonly` | 바탕 `bg-disabled` · 값은 진한 글자 그대로, 포커스 테두리 없음(포커스 표시를 두지 않는다 — 사용자 결정, 아래 Accessibility). 밑줄형은 바탕 대신 글자가 `fg-neutral-muted` |

[그림: 상태 — 기본 · 포커스 · 오류 · 오류 + 포커스 · 비활성 · 읽기 전용(상자 · 밑줄)](../../site/components/specs/input.tsx#states)

[표: 상태 — 상자](input.yaml#matrix)

[표: 상태 — 밑줄](input.yaml#matrix.variant.underline)

[표: 모션](input.yaml#motion)

캐럿은 글자색(`fg-neutral`)이고 고른 글은 기기 기본 하이라이트다 — 색을 따로 두지 않는다(SEED 도 정하지 않았다). 앱도 캐럿을 같은 색으로 둔다(사용자 결정 2026-10-08).

### Prefix · Suffix

칸 안 앞 · 뒤에 글자나 아이콘을 둔다. 글자(`prefix` · `suffix`)는 칸 글자와 같은 크기의 `fg-neutral-subtle`, 아이콘(`prefixIcon` · `suffixIcon`)은 large 20 · medium 16(밑줄 24 · 20)의 `fg-neutral-muted` 다.

- 단위는 뒤 글자로 둔다 — 라벨에 "(원)" 을 붙이거나 칸 밖에 따로 쓰지 않는다. 단위 글자는 칸의 설명으로도 읽힌다(화면 읽기 프로그램이 "원" 을 듣는다).
- 아이콘만으로 뜻을 알리지 않는다 — 라벨이나 설명에 글로도 쓴다.

[그림: 붙이개 — https:// · 원 · 만 ~ 세 · 검색 돋보기](../../site/components/specs/input.tsx#affix)

### Clear Button

값이 있을 때 한 번에 지우는 버튼(`clearable`) — large 22 · medium 18 의 `fg-neutral-subtle` 원 X. 막혔거나 읽기 전용이면 보이지 않는다. 누르면 값을 비우고 입력에 포커스를 둔다. 검색칸 · 선택 사항인 칸에 둔다(필수 칸에는 두지 않는다 — 지울 일이 드물다).

누르는 영역은 44 다 — 보이는 원 둘레로 넓혀(기초 Inclusive Design 의 "누르는 영역은 모두 44 × 44 이상") 아이콘 바로 바깥을 눌러도 지운다. 상자 밖은 상자가 자르므로 medium(40)에서는 44 × 40 이다. 넓힌 자리는 입력 글의 오른쪽 끝을 덮는다 — 그 자리를 누르면 캐럿을 옮기지 않고 지운다.

[그림: 지우기 — 값이 있을 때만](../../site/components/specs/input.tsx#clear)

## Guidelines

### 화면에 입력이 하나뿐이면 밑줄

한 화면이 값 하나를 받으면(금액을 먼저 받는 단계 화면, 목록 위 검색) 밑줄형으로 크게 둔다. 상자형 칸 하나만 덩그러니 두지 않는다(SEED).

[그림: 밑줄 — 금액을 먼저 받는 화면 · 상자 하나만 둔 화면](../../site/components/specs/input.tsx#underline-guide)

### 숫자 · 금액

- 숫자 키보드를 띄운다(`inputMode="numeric"` · 소수면 `"decimal"`). `type="number"` 는 쓰지 않는다 — 쉼표를 못 넣고, 휠 · 화살표로 값이 바뀐다.
- 쓰는 동안 천 단위 쉼표를 넣는다("12,000"). 단위는 뒤 글자("원").
- 작은 정수라도 흔한 값이 열 단계보다 멀면(반복 거래 "총 12회" — 흔한 24 · 36) 이 숫자 칸이다. 흔한 값이 열 단계 안쪽이면 [Quantity Picker](quantity-picker.md) 다.

[그림: 금액 — 쉼표와 뒤 글자 원 · 쉼표 없이 라벨에 (원)](../../site/components/specs/input.tsx#number-guide)

### 형식이 정해진 값은 한 칸에

전화번호 · 주민등록번호 · 카드 번호처럼 형식이 정해진 값은 칸을 나누지 않는다 — 한 칸에서 쓰는 대로 형식(하이픈)을 맞춰 준다(SEED). 두 칸을 나란히 두는 것은 라벨과 값이 짧을 때만이다(Field › Form 의 구성).

[그림: 형식 — 한 칸에 하이픈을 맞춰 준다 · 세 칸으로 나눈 전화번호](../../site/components/specs/input.tsx#format-guide)

### 고르는 값은 치게 하지 않는다

날짜 · 시각 · 카테고리 · 자산처럼 정해진 값 중에서 고르는 것은 Input(타이핑)으로 받지 않는다 — 짧은 선택지는 [Select](select.md) 의 칸 아래 목록으로, 달력 · 시트 · 긴 목록은 입력칸 모양의 버튼 [Input Button](input-button.md)으로 연다.

| 이런 자리 | 컴포넌트 |
|---|---|
| 짧은 글 · 숫자를 직접 친다 | **Input** |
| 작은 정수를 한 단계씩 — 흔한 값이 열 단계 안쪽(승인 필요 횟수 0 ~ 3) | [Quantity Picker](quantity-picker.md) |
| 여러 줄 글을 친다 | Textarea |
| 짧은 선택지 5개 이상에서 값을 고른다 | Select |
| 달력 · 시각 · 시트 · 긴 목록에서 고른다 | Input Button |
| 설명이 붙는 2 ~ 6개를 견줘 고른다 | Select Box |

## 코드

레시피 `recipes/shadcn/components/ui/input.tsx`(Input)를 [Field](field.md) 안에 둔다. 아래 미리보기는 스펙 값으로 그린 모습이다.

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
  <Input defaultValue="porest" />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 상자 어디를 눌러도(붙이개 · 여백 포함) 입력으로 포커스가 가고 테두리가 2px 짙어진다. |
| Keyboard `Tab` | 다음 칸으로. 지우기 버튼은 Tab 순서에 없다(값을 지우는 키는 있다). |
| `<label>` 누르기 | 연결된 칸으로 포커스(Field 가 잇는다). |
| 쓰기 | 최대 글자 수(Field `maxGraphemeCount`)에 닿으면 더 들어가지 않는다 — 한글은 조합이 끝난 뒤 자른다. |
| 지우기 | 값을 비우고(`onChange` 로 빈 값) 입력에 포커스를 둔다. 누르는 영역은 원 둘레 44 다. |
| `Enter`(폼 안) | 폼 제출(브라우저 기본). Enter 를 직접 받는 곳은 한글을 조합하는 중(`isComposing`)이면 무시한다. |
| Disabled | 포커스 · 입력 불가. 커서 not-allowed. |
| Readonly | 포커스 · 복사는 되고 입력은 안 된다. 포커스 테두리 없음 — 포커스 표시를 두지 않는다(사용자 결정 2026-10-08). |
| 자동 완성 | 브라우저 자동 완성의 바탕색을 지운다 — 칸 모양 그대로. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42, 붙이개 글자 `fg-neutral-subtle` 5.50 · 6.09(시트 다크 5.27), 읽기 전용 바탕 위 값 15.20 · 10.32 ✓. placeholder `fg-placeholder` 4.18 · 4.13(시트 다크 3.58, 읽기 전용 바탕 위 3.87 · 3.18) — 4.5:1 밑, 사용자가 대가를 알고 SEED 값을 골랐다(2026-10-16 글자 역할 D7, DESIGN v119). 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 포커스 테두리 `stroke-neutral-contrast` 16.41 · 13.42, 오류 `stroke-critical-solid` 5.06 · 6.08 ✓. 기본 1px `stroke-neutral-weak`(1.23 · 1.56)는 칸을 알리는 유일한 표시가 아니다 — 라벨 · placeholder 가 칸을 알린다(SEED 와 같다) |
| **WCAG 2.4.7** Focus visible | 편집 칸 — 포커스하면 테두리가 2px 짙어진다(키보드 · 마우스 모두) ✓. 읽기 전용 — 포커스 표시가 없다 ⚠. 사용자 결정(2026-10-08 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) A1): SEED 처럼 편집 칸의 테두리를 주지 않는다. 읽기 전용은 값을 보이는 자리라 편집 칸과 같은 표시를 주면 쓸 수 있는 칸으로 읽힌다(짙은 테두리 안은 고르지 않았다), 다른 컨트롤과 같은 바깥 링도 두지 않는다. 크로미움은 읽기 전용 칸에 캐럿도 그리지 않아 Tab 으로 들어가도 보이는 변화가 없다는 것을 알고 정했다 — 읽기 전용 칸은 복사 · 읽기를 위해 Tab 순서에 남는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓(가장 작은 밑줄 medium 34). 지우기 버튼 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | large 52 ✓ · medium 40 ⚠ — medium 은 1280 이상 데스크톱 웹(마우스)에서만. 밑줄 large 40 ⚠ — 칸 폭 전체가 누르는 영역이라 가로는 넉넉하다. 지우기 버튼 44 ✓(medium 상자 안에서는 44 × 40 ⚠) |
| **ARIA** | 이름은 Field 의 라벨(`<label for>`) — 라벨이 없으면 `aria-label`. 오류면 `aria-invalid`, 필수면 `aria-required`, 설명 · 오류 · 글자 수 · 붙이개 글자는 `aria-describedby`. 지우기 버튼 이름 "지우기" |

## Do / Don't

### ✅ Do

- 모든 칸을 Field 로 감싸 라벨을 단다.
- placeholder 는 예시만("예: 개인 사유").
- 단위는 뒤 글자로, 금액은 쉼표를 넣어서.
- 화면에 입력이 하나뿐이면 밑줄형.
- 한 폼 안에서 크기를 맞춘다.

### ❌ Don't

- placeholder 를 라벨 대신 쓰기.
- 비활성 칸을 흐리게(불투명도) 그리기.
- 고르는 값(날짜 · 카테고리)을 타이핑으로 받기.
- 형식이 정해진 값을 여러 칸으로 나누기.
- `type="number"` 로 금액 받기.
- 폰에서 medium(40) 쓰기.

## Specification

`input.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Input 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — input.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input)

## SEED 와 다른 점

- **지우기 버튼을 Text Input 에도 둔다** — SEED 는 Input Button 에만 둔다. 값은 SEED Input Button 의 지우기(large 22 · medium 18)를 따랐고, Tab 순서에는 넣지 않는다. 누르는 영역은 기초의 "누르는 영역 44" 대로 원 둘레로 넓힌다.
- **아이콘은 lucide 선 아이콘**(기초 Iconography v106) — 지우기는 `circle-x`, 오류는 `circle-alert`. SEED 는 채운 아이콘이다.
- **상자의 붙이개 · 여백을 눌러도 입력으로 포커스가 간다** — SEED 는 입력이 맨 앞 · 맨 뒤일 때만 그 여백까지 입력이다.
- **붙이개 글자를 입력의 설명으로 잇는다** — 단위가 화면 읽기 프로그램에도 들린다.

## Migration notes

### 2026-10-08 — 앱 적용이 남긴 것

웹 · 앱에 옮기며 드러난 것을 사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6)에서 정했다.

- **지우기 버튼의 누르는 영역 44** — 레시피는 보이는 원(22 · 18)이 곧 누르는 영역이었다(앱은 desk-app #408 에서 44 로 넓혔다). 레시피 · 예제 · 미리보기 · 사이트 그림을 맞췄다.
- **읽기 전용의 포커스는 지금처럼 표시 없음**(A1 — SEED 와 같다). 다른 컨트롤과 같은 바깥 링(A2) · 편집 칸처럼 짙은 테두리(A3)는 고르지 않았다. 까닭과 2.4.7 은 Accessibility 에 적었다.
- **캐럿은 글자색(`fg-neutral`) · 고른 글은 기기 기본**(D1) — 웹은 브라우저 기본 그대로(레시피에 캐럿 색을 적었다), 앱은 테마 primary(브랜드 파랑)였던 캐럿을 `fg-neutral` 로 바꾼다.

### 2026-10-01 — SEED Text Input 으로

사용자가 [비교 페이지](https://claude.ai/artifact/1hPpsfdTEJY7j4GPPx24i5)에서 정했다 — 투명 바탕 + 1px `stroke-neutral-weak` · 포커스 · 오류는 안쪽 2px(`stroke-neutral-contrast` · `stroke-critical-solid`) · 비활성 · 읽기 전용은 `bg-disabled`(흐림 금지) · 크기 large 52 · medium 40 · 웹 기본 반응형(앱 large) · 상자 기본 + 밑줄(화면에 입력 하나) · 라벨 · 오류 · 글자 수는 Field · 고르는 칸은 Input Button(그 차례에). 옛 스펙은 `input.history/v-pre-seed-text-input.*` 에 남겼다.

| 옛 Input | 새 Input |
|---|---|
| 높이 40 하나 · 모서리 4 · 여백 12 / 8 | large 52(모서리 12 · 좌우 16) · medium 40(8 · 14) · 반응형 · 밑줄 40 · 34 |
| 회색 채운 바탕(`surface-input`) + 1px `border-default` | 투명 바탕 + 안쪽 1px `stroke-neutral-weak` |
| 포커스: 브랜드 테두리 + 브랜드 30% 링(키보드만) | 안쪽 2px `stroke-neutral-contrast`(마우스 · 터치도) |
| 오류: 빨간 테두리 + 빨간 30% 링 | 안쪽 2px `stroke-critical-solid`, 포커스해도 그대로 |
| 비활성 흐림 50% · 읽기 전용은 테두리 없음 | 둘 다 `bg-disabled` 바탕 — 비활성은 글자도 `fg-disabled`, 읽기 전용은 값이 진하다 |
| 글자 `body-lg` 16 / 1.6 | large `t5` 16 / 22 · medium `t4` 14 / 19 · 밑줄 `t6` 18 / 24 · `t5` |
| 아이콘은 쓰는 쪽이 절대 위치로(`pl-9`) | `prefixIcon` · `suffixIcon` · `prefix` · `suffix` · `clearable` |
| 상태 6(default · focused · filled · error · disabled · readonly) | 상태 5(enabled · focused · invalid · disabled · readonly) — 값이 있는지(filled)는 모습이 같다 |

레시피는 `<input>` 하나에서 상자(div) + 입력으로 바뀌었다 — `className` 은 입력에, 상자에는 `rootClassName`. 쓰던 곳(Sidebar · Searchable List · Icon Picker)의 검색칸은 `prefixIcon` 으로 옮겼다. Select 의 트리거는 Select · Input Button 차례(2026-10-01)에 같은 상자로 맞췄다. Command 는 2026-10-15 걷었다. [Input OTP](input-otp.md) 는 2026-10-09 이 상자 한 칸으로 다시 썼다.

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사).

- **Desk 웹** — 입력 94(40 · 채운 바탕) · 검색 11(36 · 테두리 투명 · 포커스 때 흰 바탕) · 덮어써서 34 · 32 · 28. 포커스는 브랜드 테두리 + 30% 링, 비활성 흐림 50%, 읽기 전용은 편집 칸과 같다. 오류 테두리는 `aria-invalid` 를 단 13곳에만. 금액 칸 34곳 중 쉼표를 넣는 곳 5, 단위 없는 원화 칸 17 · 라벨에 "(원)" 6, "%" 를 붙인 칸 1(값은 가중치라 뜻이 틀림). 지우기 버튼 2곳(18 · 28 — 손으로). 매월 일자 칸은 지우면 1로 돌아와 비울 수 없다.
- **Desk 앱** — PTextInput 87곳(40 고정 · 모서리 4 · 채운 바탕 · 포커스 1px), 검색 PSearchField 13(36 · 모서리 8 · 테두리 없음). 금액 칸 4곳은 18 · 20 굵은 글자를 40 상자에 넣어 넘친다(줄 높이 41 · 44). 지우기 버튼은 일반 칸 0 / 84 · 검색 2 / 13. 금액 칸 26곳 중 쉼표 1곳. 비활성 칸이 편집 칸과 구분되지 않는 곳 18. 칸 경계 대비 바탕 1.12 · 테두리 1.23.
- **HR 웹** — Input 54(36 · 모서리 6 · 테두리 #eee — 흰 바탕 1.16:1 · 투명), 글자 768 미만 16 · 이상 14. 포커스는 파랑 테두리 + 3px 반투명 링(다크는 회색). 비활성 흐림 50%. 읽기 전용을 흉내 낸 div 상자 4. 숫자는 `type="number"` 14곳 · 소수가 잘리는 칸이 있다. 단위는 칸 밖 글자로.
