# Wheel Picker

> 순서가 있는 값을 세로로 굴려 고르는 휠이며, 칼럼을 하나 이상 둡니다. [Time Picker](time-picker.md) 의 바탕이고, [Date Picker](date-picker.md) 머리의 연 · 월 휠과 달만 고르는 자리(예산 · 홈 · 카드 실적의 달)에 씁니다. 선택지가 적으면 [Radio](radio-group.md) · [Segmented Control](segmented-control.md), 긴 목록은 [Select](select.md), 정해진 목록이 아닌 값은 [Input](input.md) 을 씁니다.

수치 원본은 [`wheel-picker.yaml`](wheel-picker.yaml)입니다.

[그림: 월 고르기 · 시각 · 달력의 연 · 월 휠 — 라이트 · 다크](../../site/components/specs/wheel-picker.tsx#hero)

### 직접 골라 보기

크기 · 보이는 칸 수 · 칼럼을 바꾸면 휠이 함께 바뀝니다. 휠을 굴리고 항목을 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/wheel-picker.tsx#playground)

## Anatomy

[그림: 휠은 칼럼 · 항목 · 가운데 띠 · 안개](../../site/components/specs/wheel-picker.tsx#anatomy)

| ⓐ Column | 칼럼 — 항목 글 폭만큼입니다. 칼럼 묶음은 휠 가운데에 둡니다. |
| ⓑ Item | 항목 — 짧은 한 줄 글입니다. |
| ⓒ Indicator | 선택 띠 — 가운데 줄입니다. 띠에 걸친 글자만 짙게 칠합니다. |
| ⓓ Fog | 안개 — 위아래 끝이 바탕으로 흐려집니다. |

[표: 부위](wheel-picker.yaml#slots)

## Properties

### Size

`medium`(44 · 글자 26)이 기본이며 시각 · 월 고르기 · 연 · 월 휠에 씁니다. `small`(36 · 글자 20)은 좁은 팝오버에만 씁니다. 휠 칸이 넘치지 않도록 글자는 글자 크기 설정을 따르지 않는 px 로 둡니다.

[그림: small · medium](../../site/components/specs/wheel-picker.tsx#sizes)

[표: 크기](wheel-picker.yaml#size)

### 보이는 칸 수

기본은 5칸(220)이고, 달력 머리의 연 · 월 휠은 요일 줄과 6주 자리를 덮는 7칸(308)입니다. 가운데 줄이 있어야 하므로 홀수만 씁니다. 안개는 휠 높이의 40% 와 항목 3칸 중 짧은 쪽입니다(5칸 88 · 7칸 123).

[표: 공통](wheel-picker.yaml#base.enabled)

[표: 상태](wheel-picker.yaml#matrix)

## Guidelines

### 휠을 쓰는 자리

순서가 있고 앞뒤 값을 보며 고르는 값(시각 · 연 · 월)에 씁니다. 하루를 고를 때는 달력([Date Picker](date-picker.md))이 기본입니다. 요일과 오늘과의 거리가 함께 보이기 때문입니다. 몇 해 앞뒤의 먼 날도 달력 제목을 눌러 연 · 월 휠로 옮긴 뒤 날을 누릅니다. 연 · 월 · 일 세 휠은 피합니다 — 31일이 없는 달을 따로 막아야 하고, 요일과 오늘과의 거리가 보이지 않습니다. 순서가 없거나 고를 것이 적으면 다른 컴포넌트를 씁니다 — Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 판단 순서로 고릅니다.

### 달만 고르기

예산 · 홈 · 카드 실적처럼 달만 고르는 자리는 연 | 월 두 칼럼 휠을 시트(1280 미만) · 팝오버(1280 이상)로 열고 "완료" 로 넣습니다. 달력의 연 · 월 휠과 같은 모양입니다(연 120 오른쪽 · 월 96 왼쪽 정렬, 보이는 칸 5). 4 × 3 월 격자는 두지 않습니다. 시트 · 팝오버의 제목은 "월 선택" 입니다. 캘린더 · 예산 어디서 열어도, 웹 · 앱 모두 같은 말이고 휠의 이름(`aria-label`)과도 같습니다.

[그림: 예산 월 — 시트의 연 · 월 휠](../../site/components/specs/wheel-picker.tsx#month-guide)

### 항목

항목은 숫자 · 짧은 낱말 같은 짧은 한 줄 글입니다. 시 · 분처럼 숫자만으로 읽히는 칼럼은 단위를 칼럼 이름으로 알리고 항목마다 붙이지 않습니다. 연 · 월은 날짜 표기 그대로 "2026년" · "10월" 입니다(달력의 연 · 월 휠과 같습니다). 버튼 · 링크 · 여러 줄 글은 넣지 않습니다. 아이콘을 쓰면 모든 항목에 붙입니다.

## 코드

레시피 `recipes/shadcn/components/ui/wheel-picker.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 달만 고르기 — "완료" 로 넣기

[그림: 예산 월](../../site/components/specs/wheel-picker.tsx#ex-month)

```tsx
import { WheelPicker, WheelPickerColumn } from "@/components/ui/wheel-picker"

<WheelPicker aria-label="월 선택">
  <WheelPickerColumn aria-label="연도" options={years} align="right" className="w-[120px]" value={draft.year} onValueChange={(year) => setDraft({ ...draft, year })} />
  <WheelPickerColumn aria-label="월" options={months} align="left" className="w-[96px]" loop value={draft.month} onValueChange={(month) => setDraft({ ...draft, month })} />
</WheelPicker>
<Button onClick={() => { setMonth(draft); setOpen(false) }}>완료</Button>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 손가락으로 밀기 | 브라우저 스크롤 · 스냅의 관성으로 굴러 가장 가까운 칸에 멈춥니다. 멈춘 뒤 값을 정합니다 |
| 마우스로 끌기 | 3px 넘게 움직이면 끌기로 봅니다. 놓을 때의 속도로 최대 3칸 더 가고 220 ~ 360ms 에 걸쳐 칸에 맞춥니다. 끈 직후의 누름은 무시합니다 |
| 마우스 휠 · 트랙패드 | 마지막 입력 120ms 뒤 가까운 칸으로 옮깁니다 — 160ms |
| 보이는 항목 누르기 | 그 항목을 가운데로 200ms(ease-out cubic)에 옮기고, 멈춘 뒤 값을 정합니다. 웹도 브라우저의 부드러운 스크롤에 맡기지 않습니다 |
| 굴리는 동안 | 띠를 지나는 항목만 짙게 칠합니다. 값은 멈춘 뒤 한 번만 바뀝니다 |
| 반복 | 칼럼마다 정합니다. 끄면 처음 · 끝에서 멈추고, 켜면 끝 다음에 처음이 이어집니다 |
| 막힘 | 값은 그대로 두고, 굴릴 수도 초점을 받을 수도 없습니다 |
| 모션 줄이기 | 모든 이동을 바로 합니다 |

### 키보드

| 키 | 동작 |
|---|---|
| `↑` `↓` | 이전 · 다음 항목 — 누르기와 같은 200ms 입니다(키를 누르고 있으면 바로바로 이어서 옮깁니다) |
| `Home` `End` | 처음 · 끝 항목 |
| `Tab` | 다음 칼럼 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 고른 항목 `fg-neutral` 은 띠 위 15.20 · 다크 10.32 ✓. 둘레 항목은 고를 값이 아닌 표시입니다(안개로 흐려집니다) |
| **WCAG 2.1.1** Keyboard | 칼럼마다 `Tab` 자리, `↑` `↓` `Home` `End` ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | medium 44 · small 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | medium 44 ✓ · small 36 ⚠ |
| **앱(Flutter)** | Flutter 는 spinButton 역할을 제공하지 않습니다(넣으면 디버그에서 오류가 납니다). 칼럼은 역할 없이 이름(칼럼 이름) + 값(항목 글) + 올리기 · 내리기 동작으로 둡니다. Android 는 이것을 조절 막대(SeekBar)로, iOS 는 조절 가능(adjustable)으로 읽어 위아래로 쓸어 값을 바꿉니다 — 모바일에서 spinbutton 에 해당하는 표현입니다. Flutter 가 spinButton 역할을 제공하면 역할을 더합니다 |
| **ARIA** | 휠 `role="group"` + 이름(필수), 칼럼 `role="spinbutton"` + 이름 · `aria-valuetext`(항목 글) · `aria-valuemin` 0 · `aria-valuemax` · `aria-valuenow`(번호). 항목은 보조 기술에 숨깁니다 |

## Do / Don't

### ✅ Do

- 시각 · 연 · 월처럼 순서가 있는 값에 씁니다.
- 휠이 멈춘 뒤에 값을 정하고, 시트 · 팝오버에서는 "완료" 로 넣습니다.
- 칼럼마다 이름(연도 · 월 · 시 · 분)을 붙입니다.

### ❌ Don't

- 날짜를 연 · 월 · 일 세 휠로 받는 것은 피합니다. 먼 날도 달력 제목의 연 · 월 휠로 옮겨 고릅니다.
- 순서 없는 긴 목록에 쓰지 않습니다 — Select 를 씁니다.
- 항목에 버튼 · 여러 줄 글을 넣지 않습니다.

## Specification

[그림: Wheel Picker — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#wheel-picker)
