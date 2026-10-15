# Wheel Picker

> 순서가 있는 값을 세로로 굴려 고르는 휠 — 한 칼럼 이상. [Time Picker](time-picker.md) 의 바탕이고, [Date Picker](date-picker.md) 머리의 연 · 월 휠, 달만 고르는 자리(예산 · 홈 · 카드 실적의 달)에 쓴다. 적은 선택지는 [Radio](radio-group.md) · [Segmented Control](segmented-control.md), 긴 목록은 [Select](select.md), 정해진 목록이 아닌 값은 [Input](input.md) 이다.

구조는 당근 [SEED Wheel Picker](https://seed-design.io/components/wheel-picker)(Apache-2.0)를 따른다 — 칼럼 · 항목 · 가운데 선택 띠 · 위아래 안개, 크기 small 36 · medium 44. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). porest 에 처음 두는 컴포넌트다.

수치 원본은 [`wheel-picker.yaml`](wheel-picker.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다.

[그림: 월 고르기 · 시각 · 달력의 연 · 월 휠 — 라이트 · 다크](../../site/components/specs/wheel-picker.tsx#hero)

### 직접 골라 보기

크기 · 보이는 칸 수 · 칼럼을 고르면 스펙대로 그린 휠이 바뀐다. 실제로 굴리고 누를 수 있다.

[그림: 플레이그라운드](../../site/components/specs/wheel-picker.tsx#playground)

## Anatomy

[그림: 휠은 칼럼 · 항목 · 가운데 띠 · 안개](../../site/components/specs/wheel-picker.tsx#anatomy)

| ⓐ Column | 칼럼 — 항목 글 폭만큼. 칼럼 묶음은 휠 가운데. |
| ⓑ Item | 항목 — 짧은 한 줄 글. |
| ⓒ Indicator | 선택 띠 — 가운데 줄. 띠에 걸친 글자만 짙게 칠한다. |
| ⓓ Fog | 안개 — 위아래 끝이 바탕으로 흐려진다. |

[표: 부위](wheel-picker.yaml#slots)

## Properties

### Size

`medium`(44 · 글자 26)이 기본이다 — 시각 · 월 고르기 · 연 · 월 휠. `small`(36 · 글자 20)은 좁은 팝오버에만 쓴다. 글자는 글자 크기 설정을 따르지 않는 px 이다 — 휠 칸이 넘치지 않게.

[그림: small · medium](../../site/components/specs/wheel-picker.tsx#sizes)

[표: 크기](wheel-picker.yaml#size)

### 보이는 칸 수

기본 5칸(220), 달력 머리의 연 · 월 휠은 요일 줄과 6주 자리를 덮는 7칸(308)이다. 홀수만 쓴다 — 가운데 줄이 있어야 한다. 안개는 휠 높이의 40% 와 항목 3칸 중 짧은 쪽이다(5칸 88 · 7칸 123).

[표: 공통](wheel-picker.yaml#base.enabled)

[표: 상태](wheel-picker.yaml#matrix)

## Guidelines

### 휠을 쓰는 자리

순서가 있고 앞뒤 값을 보며 고르는 값 — 시각 · 연 · 월. 날짜 하나는 달력(Date Picker)으로 고르고, 연 · 월 · 일 세 휠로 받지 않는다. 고를 것이 5개 이하면 Radio · Segmented Control, 순서 없는 긴 목록은 Select 다.

### 달만 고르기

예산 · 홈 · 카드 실적처럼 달만 고르는 자리는 연 | 월 두 칼럼 휠을 시트(1280 미만) · 팝오버(이상)로 열고 "완료" 로 넣는다 — 달력의 연 · 월 휠과 같은 모양이다(연 120 오른쪽 · 월 96 왼쪽 정렬, 보이는 칸 5). 4 × 3 월 격자는 두지 않는다.

[그림: 예산 월 — 시트의 연 · 월 휠](../../site/components/specs/wheel-picker.tsx#month-guide)

### 항목

짧은 한 줄 글 — 숫자 · 짧은 낱말. 시 · 분처럼 숫자만으로 읽히는 칼럼은 단위를 칼럼 이름으로 알리고 항목마다 붙이지 않는다. 연 · 월은 날짜 표기 그대로 "2026년" · "10월" 이다(달력의 연 · 월 휠과 같다). 버튼 · 링크 · 여러 줄 글은 넣지 않는다. 아이콘을 쓰면 모든 항목에.

## 코드

레시피 `recipes/shadcn/components/ui/wheel-picker.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 달만 고르기 — "완료" 로 넣는다

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
| 손가락으로 밀기 | 브라우저 스크롤 · 스냅의 관성으로 굴러 가장 가까운 칸에 멈춘다. 멈춘 뒤 값이 정해진다 |
| 마우스로 끌기 | 3px 넘게 움직이면 끈다. 놓을 때 속도로 최대 3칸 더 가고 220 ~ 360ms 로 맞춘다. 끈 직후의 누름은 무시한다 |
| 마우스 휠 · 트랙패드 | 마지막 입력 120ms 뒤 가까운 칸으로 160ms |
| 보이는 항목 누르기 | 그 항목을 가운데로 — 멈춘 뒤 값이 정해진다 |
| 굴리는 동안 | 띠를 지나는 항목만 짙게 — 값은 멈춘 뒤 한 번만 바뀐다 |
| 반복 | 칼럼마다 — 끄면 처음 · 끝에서 멈추고, 켜면 끝 다음에 처음이 이어진다 |
| 막힘 | 값은 그대로, 굴릴 수도 초점이 갈 수도 없다 |
| 모션 줄이기 | 모든 이동을 바로 |

### 키보드

| 키 | 동작 |
|---|---|
| `↑` `↓` | 이전 · 다음 항목(누르고 있으면 이어서) |
| `Home` `End` | 처음 · 끝 항목 |
| `Tab` | 다음 칼럼 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 고른 항목 `fg-neutral` 띠 위 15.20 · 다크 10.32 ✓. 둘레 항목은 고를 값이 아닌 표시(안개로 흐려진다) |
| **WCAG 2.1.1** Keyboard | 칼럼마다 `Tab` 자리, `↑` `↓` `Home` `End` ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | medium 44 · small 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | medium 44 ✓ · small 36 ⚠ |
| **ARIA** | 휠 `role="group"` + 이름(필수), 칼럼 `role="spinbutton"` + 이름 · `aria-valuetext`(항목 글) · `aria-valuemin` 0 · `aria-valuemax` · `aria-valuenow`(번호). 항목은 보조 기술에 숨긴다 |

## Do / Don't

### ✅ Do

- 시각 · 연 · 월처럼 순서가 있는 값.
- 휠이 멈춘 뒤에 값을 정하고, 시트 · 팝오버에서는 "완료" 로 넣는다.
- 칼럼마다 이름(연도 · 월 · 시 · 분).

### ❌ Don't

- 날짜를 연 · 월 · 일 세 휠로 받기 — 달력.
- 순서 없는 긴 목록 — Select.
- 항목에 버튼 · 여러 줄 글.

## Specification

[그림: Wheel Picker — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#wheel-picker)

## SEED 와 다른 점

- **안개 높이는 늘 min(40%, 3칸)** — SEED 는 연 · 월 휠에서 코드 상수 102 를 쓴다(식으로는 123).
- **기본 크기 medium** — SEED rootage 는 small, 코드 · React 는 medium(코드를 따른다).
- **달만 고르기에 쓴다** — SEED 에는 월만 고르는 피커가 없다(연 · 월 휠은 Date Picker 안뿐).
- **링 색은 porest `stroke-focus-ring`**.

## Migration notes

### 2026-10-08 — 글자 값을 고정 px 토큰으로

YAML 의 항목 글자가 rem 토큰(`$text-t10` · `$text-t7`)을 가리키고 "글자 크기 설정을 따르지 않는 px" 는 비고에만 있었다 — YAML 대로 만들면 글자 크기 200% 에서 휠 글자가 52 / 70 으로 커져 44 칸을 넘어 위아래 항목과 겹친다. 레시피 · 제품(웹 `-static` 클래스 · 앱 `TextScaler.noScaling`) · SEED rootage 와 같게 값 자리를 `-static` 토큰(`$text-t10-static` · `$text-t7-static`)으로 고쳤다. 크기 · 모습은 그대로다. `-static` 은 같은 글자 토큰의 px 판이다(Typography v104 — 내보낼 때 생긴다). 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 3.

### 2026-10-03 — SEED Wheel Picker 로 새로 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/9bPrBNHaYc7gRPweKRadUw)에서 정했다 — 시각은 SEED Time Picker(이 휠 위), 달력의 연 · 월은 휠, 달만 고르기도 연 · 월 휠 + "완료".

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 월 피커 두 벌(`MonthPicker` 5곳 — 데스크톱 손 드롭다운 · 폰 Drawer, Esc 안 됨 · 포털 없음 · 이름 없는 연도 이동, 캘린더 머리 피커 — 다른 모양), 네이티브 month 1. 모두 4 × 3 격자를 누르면 바로 들어간다.
- **Desk 앱** — 월 시트 두 벌(72 × 36 · 75 × 34, 하나는 버튼이 아님), 시각은 iOS 휠(CupertinoDatePicker).
- **HR 웹** — 연도 셀렉트 7 · 연 · 월 숫자칸 2.
