# Date Picker

> 날짜 · 기간 · 여러 날을 고르는 달력. 날짜 칸([Input Button](input-button.md))을 누르면 1280 미만은 아래 시트 · 이상은 칸 아래 팝오버로 열리고, "완료" 로 넣는다. 날짜를 치는 칸은 두지 않는다. 시각은 [Time Picker](time-picker.md) 를 날짜 칸 옆에 나란히, 달만 고를 때는 [Wheel Picker](wheel-picker.md) 다.

구조는 당근 [SEED Date Picker](https://seed-design.io/components/date-picker)(Apache-2.0)를 따른다 — 머리(연 · 월 제목 · 이전 · 다음) · 요일 줄 · 날짜 칸(원 · 숫자) · 기간 띠, 하루 · 기간 · 여러 날, 한 달 · 두 달 · 이어지는 달. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). 옛 Calendar 스펙을 대신한다.

수치 원본은 [`date-picker.yaml`](date-picker.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 일정 날짜 · 통계 기간 · 저축 기한 — 라이트 · 다크](../../site/components/specs/date-picker.tsx#hero)

### 직접 골라 보기

고르기(하루 · 기간 · 여러 날) · 여는 자리(시트 · 팝오버) · 막힌 날 · 빠른 기간을 고르면 스펙대로 그린 달력과 그 코드가 바뀐다. 실제로 날짜를 누르고 "완료" 로 칸에 넣을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/date-picker.tsx#playground)

## Anatomy

[그림: 달력은 머리 · 요일 줄 · 날짜 칸, 기간이면 띠와 빠른 기간 칩 줄](../../site/components/specs/date-picker.tsx#anatomy)

| ⓐ Presets | 빠른 기간 — 기간 달력 위 칩 한 줄. 누르면 달력에 칠한다. |
| ⓑ Header | 머리 — 왼쪽 연 · 월 제목, 오른쪽 이전 · 다음. |
| ⓒ Title | 연 · 월 제목 — 누르면 날짜 자리에 연 · 월 휠이 뜬다. |
| ⓓ Nav Button | 이전 · 다음 — 한 달씩. |
| ⓔ Weekday | 요일 줄 — "일" … "토". |
| ⓕ Cell | 날짜 칸 — 칸 전체가 누르는 자리. |
| ⓖ Day | 날짜 원 · 숫자 — 오늘 · 고름 · 막힘을 그린다. |
| ⓗ Range Band | 기간 띠 — 시작 · 끝 원 사이. |
| ⓘ Footer | 바닥 — "완료"(기간은 "초기화" + "완료"). 시트 · 팝오버의 바닥이다. |

[표: 부위](date-picker.yaml#slots)

## Properties

### 머리 · 요일 · 날짜 칸

머리 · 요일 줄 · 날짜 줄은 모두 48 이다. 날짜 칸은 달력 폭을 7로 나눈 폭에 높이 48 이고 칸 전체가 누르는 자리다 — 원 42 는 칸 위 3 에 놓여 원 · 띠끼리 6 떨어진다. 숫자는 16 / 22 · 500, 요일은 14 / 19 · 500 `fg-neutral-subtle`. 제목은 16 / 22 · 700 에 셰브론 20, 이전 · 다음은 Button ghost 40(아이콘 18)을 오른쪽 끝에 붙인다.

달력은 늘 6주다 — 앞뒤 달 날짜를 흐리게 채워 달을 넘겨도 머리 · 바닥이 움직이지 않는다. 앞뒤 달 날짜는 보이기만 하고 누르지 못한다(보조 기술에도 숨긴다) — 다른 달은 이전 · 다음 · 화살표 키로 넘긴다.

[그림: 칸 48 · 원 42 · 숫자 16 · 머리 48 · 6주 — 앞뒤 달은 흐리게](../../site/components/specs/date-picker.tsx#layout)

[표: 공통](date-picker.yaml#base.enabled)

팝오버의 달력은 336(칸 48 × 7), 시트는 시트 폭에서 좌우 24 를 뺀 폭이다(360 화면 312). 칸이 44 보다 좁으면(320 화면) 원을 칸 폭 − 2 로 줄인다.

글자 크기 설정은 글자(숫자 · 요일 · 제목)만 따른다. 칸 · 머리 · 요일 줄은 최소 48 이고 글이 더 크면 그만큼만 늘어나며, 원 42 · 이전 · 다음 40 은 px 그대로다(SEED — dateCell minHeight). 웹 · 앱이 같은 모양이다. 글자 200% 에서 달력은 396(머리 48 · 요일 48 · 칸 50 × 6) — 시트 안에 6주가 다 들고 제목이 한 줄로 보인다. 대가 — 두 자리 숫자(32px)가 원 42 를 채워 이웃 숫자와 약 6 떨어진다(SEED 와 같은 값)(2026-10-21 사용자 결정 — 03-C 1B, 비교 페이지 https://claude.ai/artifact/3nWUZCYpPh2Cg3uXc3DKtp).

### Selection

| 값 | 쓰는 곳 |
|---|---|
| `single` | 날짜 하나 — 일정 · 거래 · 할 일 마감 · 저축 기한 · 환불일 |
| `range` | 기간 — 통계 · 가계부 필터 · 내보내기 · 검색 · 업무 보고 · 공지 · 유효기간 |
| `multiple` | 여러 날 — 따로 고른 날들. 지금 쓰는 곳은 없다(SEED 와 같게 둔다) |

[표: 고르기](date-picker.yaml#selection)

### Visible Range

하루 · 여러 날은 한 달(`month`)이다. 기간은 여는 자리에 따라 바뀐다 — 1280 미만 시트는 달이 위아래로 이어지고(`continuous`, 스크롤로 달을 넘긴다 · 요일 줄이 위에 붙는다 · 아래 안개 96), 1280 이상 팝오버는 두 달을 나란히(`twoMonths`, 사이 24 — 팝오버 폭 744 는 Popover 최대 480 의 예외다).

[그림: 한 달 · 두 달 나란히 · 이어지는 달](../../site/components/specs/date-picker.tsx#visible-ranges)

[표: 보이는 범위](date-picker.yaml#visibleRange)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 숫자 `fg-neutral-muted` · 원 없음 |
| `hovered` | 웹 — 마우스를 올린 날짜에 옅은 원(`bg-neutral-weak-alpha-pressed` — SEED 투명 색, 바탕 1.15 · 다크 1.77). 오늘 · 기간 사이 날 위에서는 불투명 `bg-neutral-weak-pressed` |
| `pressed` | 터치 — 누르는 동안 같은 원. 날짜는 줄지 않는다 |
| `focused` | 키보드 초점이 온 날짜의 원 둘레 안쪽 2px 링 — 웹 · 앱(앱은 하드웨어 키보드 · 스위치 접근일 때만) |
| `today` | 옅은 원(`bg-neutral-weak`) + 숫자 700 · `fg-neutral` |
| `selected` | 짙은 원(`bg-neutral-inverted`) + 숫자 `fg-neutral-inverted` — 하루 · 여러 날의 고른 날, 기간의 시작 · 끝 |
| `inRange` | 기간의 사이 날 — 원 없이 띠(`bg-neutral-weak`) |
| `outside` | 앞뒤 달 — 흐린 숫자(`fg-disabled`), 누르지 못함 |
| `disabled` | 고를 수 없는 날 — 흐린 숫자 + 취소선. 초점은 간다(`aria-disabled`) |
| `readOnly` | 확정된 시작일(기간 늘리기) — 흐린 채움(`stroke-neutral-solid`) + 숫자 `fg-neutral-inverted`, 누르지 못함. 그 앞의 날은 끝이 될 수 없어 막힌 날로 그린다 |

[그림: 보통 · 호버 · 오늘 · 고름 · 기간 · 앞뒤 달 · 막힘 · 읽기 전용 · 키보드 초점 — 라이트 · 다크](../../site/components/specs/date-picker.tsx#states)

[표: 상태](date-picker.yaml#matrix)

#### 상태가 겹칠 때

- 고름이 이긴다 — 오늘을 고르면 짙은 원이다. 오늘의 굵기(700)는 남는다.
- 기간 안의 오늘은 원 없이 띠 위에 굵은 숫자다.
- 막힌 날이 기간 안에 있으면 띠는 그대로 깔리고 숫자만 흐린 취소선이다. 미완성 기간(시작만 고름)의 시작일이 막힌 날이어도 시작 원 위에는 취소선을 긋지 않는다.
- 오늘인데 막힌 날은 원 없이 굵은 숫자 + 취소선, 고른 날인데 막힌 날은 고른 모양 + 취소선이다.
- 막힌 날 · 읽기 전용 · 앞뒤 달에는 호버 원이 없다.

[표: 모션](date-picker.yaml#motion)

## Guidelines

### 날짜는 고르게 한다

날짜를 치는 칸은 두지 않는다 — 날짜 칸은 [Input Button](input-button.md) 이고, 누르면 이 달력이 열린다. 고르는 동안 칸 값은 그대로이고 "완료" 를 누를 때 들어간다. 바깥 · 끌어내리기 · `Esc` 로 닫으면 고르던 것은 버린다. 열 때는 칸의 값에서 시작한다 — 비었으면 오늘이 든 달을 열고 오늘을 짚기만 한다(고른 것처럼 칠하지 않는다). "완료" 는 하루를 고르기 전, 기간의 끝을 고르기 전에는 막힌다.

[그림: 칸을 누르면 시트 · 팝오버의 달력, "완료" 로 칸에 들어간다](../../site/components/specs/date-picker.tsx#confirm-guide)

### 기간 — 칸 하나, 달력 하나

기간은 시작 · 종료 두 칸으로 나누지 않는다 — 칸 하나("9월 28일~10월 6일")를 누르면 한 달력에서 시작과 끝을 고른다.

- 첫 탭이 시작, 시작 뒤의 날을 누르면 끝 — 사이가 띠로 이어진다.
- 시작보다 앞을 누르면 그날이 새 시작이다(둘을 바꾸지 않는다).
- 같은 날을 두 번 누르면 하루짜리 기간이다. 하루짜리를 막아야 하는 자리는 "2일 이상" 같은 제약을 둔다.
- 기간이 완성된 뒤 다시 누르면 새로 시작한다.
- 끝을 고르는 동안 미리 칠해 보이지 않는다. 시작을 고르는 순간 제약에 걸린 날이 한꺼번에 막힌 날로 바뀔 수 있다 — 그런 제약(최소 · 최대 기간)은 달력 위 [Callout](callout.md) 으로 미리 알린다.

[그림: 첫 탭 시작 · 둘째 탭 끝 · 앞을 누르면 새 시작](../../site/components/specs/date-picker.tsx#range-guide)

### 빠른 기간

기간 달력 위에 칩 한 줄을 둔다. 누르면 그 기간을 달력에 칠하고(그 달로 옮긴다) "완료" 로 넣는다 — 하나 고르기라 고른 칩은 짙게 채워지고, 달력에서 다른 날을 누르면 칩 고름이 풀린다. 이름과 범위는 아래 한 벌이고, 화면은 이 안에서 고른다(이름이 같으면 어디서나 같은 기간이다).

| 이름 | 기간(오늘이 2026년 10월 2일이면) |
|---|---|
| 이번 주 | 일요일 ~ 토요일(9월 27일 ~ 10월 3일) |
| 이번 달 | 1일 ~ 말일(10월 1일 ~ 31일) |
| 지난 달 | 지난달 1일 ~ 말일(9월 1일 ~ 30일) |
| 최근 7일 · 30일 | 오늘을 넣은 7일 · 30일(9월 26일 ~ 10월 2일) |
| 최근 3개월 · 6개월 · 1년 | 이번 달을 넣은 석 달 · 여섯 달 · 열두 달의 1일 ~ 이번 달 말일(8월 1일 ~ 10월 31일) |
| 올해 | 1월 1일 ~ 12월 31일 |

달력 단위다 — 끝은 그 단위의 마지막 날이고, 앞으로의 날(예정 거래 · 일정)도 들어간다. 주는 달력처럼 일요일부터다. 칩을 누르면 그 기간의 시작이 든 달로 옮긴다. 기간의 시작 · 끝이 고를 수 있는 범위 밖이거나 막힌 날이면 그 칩을 막는다 — 잘라서 넣지 않는다(이름이 같으면 같은 기간이어야 한다). 사이에 막힌 날이 있는 것은 괜찮다(손으로 고를 때와 같다).

[그림: 기간 시트의 칩 줄 — 이번 달을 누르면 10월 전체가 칠해진다](../../site/components/specs/date-picker.tsx#presets)

### 연 · 월 옮기기

제목을 누르면 요일 줄과 날짜 자리에 연 | 월 휠이 뜬다(Wheel Picker medium · 7칸). 셰브론이 위로 돌고 이전 · 다음은 막힌다. 제목을 다시 누르면 고른 달로 옮긴다. 연의 범위는 자리마다 정하고(기본 오늘 ± 100년), 월은 돌아간다.

[그림: 제목을 누르면 연 · 월 휠](../../site/components/specs/date-picker.tsx#month-year)

### 고를 수 없는 날

자리마다 고를 수 있는 범위가 다르다(환불일은 거래일 ~ 오늘, 할 일 마감은 오늘부터). 그 밖의 날은 막힌 날로 그린다 — 흐린 숫자 + 취소선, 키보드 초점은 간다. 이미 확정돼 바꿀 수 없는 시작일(진행 중인 기간 늘리기)은 읽기 전용 — 채움을 남겨 흐리게 그린다. 달력 전체가 보기 전용이면 날짜마다가 아니라 달력 전체를 읽기 전용으로 둔다.

### 여러 날

`multiple` 은 누를 때마다 고르고 풀린다 — 고른 날은 따로 그린 원이고 띠로 잇지 않는다. 최대 개수가 있으면 달력 위에 남은 개수를 보이고, 다 고르면 고르지 않은 날이 막힌 날(취소선)이 된다 — 고른 날은 풀 수 있다. 칸에는 가장 이른 날 + 나머지 개수("10월 14일 (수) 외 2개" — Select 여럿 고르기와 같은 꼴). 지금 쓰는 곳은 없다.

### 글

칸에 들어가는 값은 International Design(v106)의 표기다 — 올해는 "10월 15일 (목)", 다른 해는 "2027년 1월 3일 (일)", 기간은 "10월 1일~10월 31일"(물결표를 앞뒤에 붙여 쓴다 — International Design, 올해가 아닌 날이 끼면 양쪽에 연도). 시트 제목은 고를 값의 종류("날짜 선택" · "기간 선택"), 칸이 비면 placeholder 도 같은 말이다.

## 코드

레시피 `recipes/shadcn/components/ui/date-picker.tsx` 를 [Input Button](input-button.md) 이 연 시트 · 팝오버 안에 둔다. 값은 쓰는 쪽이 가진다 — 달력은 고르던 값(draft)을 보이고, "완료" 가 칸에 넣는다. 여는 자리는 `useInputButtonSurface()`(1280 미만 `"sheet"` · 이상 `"popover"`)가 정한다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 날짜 하나 — "완료" 로 넣는다

[그림: 일정 날짜 — 시트 · 팝오버](../../site/components/specs/date-picker.tsx#ex-single)

```tsx
import { CalendarDays } from "lucide-react"
import { DatePicker, formatDateValue } from "@/components/ui/date-picker"
import { InputButton, useInputButtonSurface } from "@/components/ui/input-button"

const surface = useInputButtonSurface()
const [draft, setDraft] = React.useState(date)

<InputButton value={formatDateValue(date)} placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={() => { setDraft(date); setOpen(true) }} />

// 열면 고른 날(없으면 오늘)로 초점을 옮긴다
<DatePicker selection="single" value={draft} onValueChange={setDraft} autoFocus />
<Button disabled={!draft} onClick={() => { setDate(draft); setOpen(false) }}>완료</Button>
```

### 기간 — 칩 줄 · 이어지는 달 · 두 달

[그림: 통계 기간 — 시트는 이어지는 달, 팝오버는 두 달](../../site/components/specs/date-picker.tsx#ex-range)

```tsx
// 이어지는 달은 시트 높이를 채운다(시트 h-[90dvh]), 두 달은 팝오버 폭 744 — PopoverContent className={DATE_PICKER_TWO_MONTHS_POPOVER}
<DatePicker
  selection="range"
  visibleRange={surface === "sheet" ? "continuous" : "twoMonths"}
  autoFocus
  presets={["thisWeek", "thisMonth", "lastMonth", "last3Months", "thisYear"]}
  value={draft}
  onValueChange={setDraft}
/>
<Button variant="neutralWeak" onClick={() => setDraft(undefined)}>초기화</Button>
<Button disabled={!draft?.end} onClick={apply}>완료</Button>
```

### 고를 수 있는 범위 — 환불일

[그림: 환불일 — 거래일부터 오늘까지만](../../site/components/specs/date-picker.tsx#ex-constraints)

```tsx
<DatePicker selection="single" min={transactionDate} max={today} value={draft} onValueChange={setDraft} />
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 날짜 누르기 | 하루 — 고른다(다시 눌러도 풀리지 않는다). 기간 — 위 "기간" 의 순서. 여러 날 — 고르고 풀린다. 칸 값은 "완료" 전까지 그대로 |
| 막힌 날 · 앞뒤 달 누르기 | 아무 일도 없다 |
| 이전 · 다음 | 한 달씩 — 6주라 높이는 그대로 |
| 제목 누르기 | 연 · 월 휠을 열고 닫는다. 닫으면 고른 달로 옮기고 그 달 1일이 다음 `Tab` 자리 |
| 빠른 기간 칩 | 그 기간을 칠하고 그 달로 옮긴다. 달력에서 다른 날을 누르면 칩 고름이 풀린다 |
| 열 때 | 고른 날(없으면 오늘)이 든 달 — 초점은 그 날짜로 간다(input-button.md) |
| 이어지는 달 스크롤 | 보이는 달이 바뀌면 그 달 1일이 다음 `Tab` 자리 |

### 키보드

WAI-ARIA Grid 다 — 날짜 하나만 `Tab` 순서에 들고 방향키로 옮긴다. 웹 · 앱이 같다 — 앱도 하드웨어 키보드 · 스위치 접근에서 아래 키를 받고, 열 때 초점은 고른 날(없으면 오늘)로 간다. 링은 키보드일 때만 그린다(2026-10-21 사용자 결정 — 03-C 4A).

| 키 | 동작 |
|---|---|
| `←` `→` | 하루 전 · 뒤 |
| `↑` `↓` | 한 주 전 · 뒤 |
| `Home` `End` | 그 주의 일요일 · 토요일 |
| `PageUp` `PageDown` | 한 달 전 · 뒤(같은 날, 없으면 말일) — 두 달 보기는 두 달 |
| `Shift` + `PageUp` `PageDown` | 한 해 전 · 뒤 |
| `Enter` `Space` | 초점이 있는 날을 고른다(막힌 날은 무시) |
| `Tab` | 달력 밖(다음 요소 — "완료")으로 |

보이는 달 밖으로 옮기면 달이 따라 넘어가고 "2026년 11월" 을 읽는다(두 달 보기는 "2026년 10월~2026년 11월").

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 숫자 `fg-neutral-muted` 바탕 위 7.11 · 다크 6.67 · 기간 띠 위 6.58 · 5.93, 고른 날 16.41 · 13.42 ✓. 막힌 날 · 앞뒤 달은 누를 수 없는 표시라 기준 밖(막힌 날은 취소선이 함께 알린다) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고른 날 짙은 원 ✓. 오늘의 옅은 원은 바탕과 1.08 · 1.13 — 그래서 숫자 굵기로도 알린다. 호버 원(투명)은 바탕과 1.15 · 1.77, 오늘 원과 1.06 · 1.57 로 갈린다. 초점 링 `stroke-focus-ring` ✓ |
| **WCAG 1.4.1** Use of color | 오늘은 굵기, 막힌 날은 취소선 — 색만으로 알리지 않는다 ✓ |
| **WCAG 2.1.1** Keyboard | 위 키보드 표 — 모든 날을 키로 고른다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 날짜 칸 44.6 × 48(360 화면) · 48 × 48(팝오버) ✓ · 이전 · 다음 40(누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 날짜 칸 ✓(320 화면은 38.9 × 48 ⚠) · 이전 · 다음 44 ✓ |
| **WCAG 4.1.3** Status messages | 보이는 달이 바뀌면 `aria-live="polite"` 로 "2026년 11월" 을 읽는다 ✓ |
| **ARIA** | 달력 `role="group"` 이름 "날짜 선택"(또는 칸 라벨), 달마다 `role="grid"` + 제목으로 `aria-labelledby`, 기간 · 여러 날은 `aria-multiselectable`. 요일은 `columnheader`(이름 "일요일"). 날짜 버튼 이름 "2026년 10월 15일 목요일", 오늘 `aria-current="date"`, 고른 날 · 기간 사이 칸 `aria-selected`, 막힌 날 · 읽기 전용 `aria-disabled`(읽기 전용은 이름 끝에 ", 읽기 전용 시작일"). 앞뒤 달은 숫자만 `aria-hidden`(칸은 남겨 요일 짝을 지킨다). 이전 · 다음 이름 "이전 달" · "다음 달", 제목 버튼 `aria-expanded`. 이름은 한국어 · 영어 두 벌(앱 언어를 따른다) |

## Do / Don't

### ✅ Do

- 날짜 칸을 누르면 달력이 열리게 — 날짜를 치게 하지 않는다.
- 기간은 칸 하나에 "9월 28일~10월 6일", 달력 하나에서 시작 · 끝을 고른다.
- 최소 · 최대 기간 같은 제약은 고르기 전에 Callout 으로 알린다.
- 빠른 기간은 정해진 이름 · 범위 한 벌에서 고른다.

### ❌ Don't

- 날짜 칸을 치는 칸으로 두기(지금 세 제품 66곳).
- 고른 날 · 오늘을 브랜드 색으로 채우기 — 고른 날은 짙은 회색, 오늘은 옅은 원 + 굵기.
- 막힌 날을 흐림(불투명도)으로만 그리기 — 흐린 색 + 취소선.
- 같은 "이번 달" 을 화면마다 다른 기간으로 쓰기.
- 날짜를 누르는 순간 칸에 넣고 닫기 — "완료" 로 넣는다.

## Specification

[그림: Date Picker — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#date-picker)

## SEED 와 다른 점

- **오늘은 옅은 원 + 숫자 700** — groo 옅은 원(`bg-neutral-weak`)은 바탕과 1.08:1 이라 굵기로도 알린다. 기간 안 · 고른 날이어도 굵기는 남는다(SEED 는 옅은 원만, 기간 안에서는 사라진다).
- **앞뒤 달을 흐리게 채우고 늘 6주** — SEED 는 비우고 4 ~ 6주라 달을 넘길 때 시트 머리 · 바닥이 48 · 96 씩 움직인다. 흐린 날은 누르지 못하고 보조 기술에 숨긴다.
- **팝오버 달력 336(칸 48 × 7) · 두 달 696** — SEED 는 부모 폭.
- **좁은 칸에서 원을 줄인다** — 칸이 44 보다 좁으면 원은 칸 폭 − 2(SEED 는 320 화면에서 이웃 원이 겹친다).
- **색은 groo 역할 짝** — 고른 날 `bg-neutral-inverted`, 읽기 전용 시작일 `stroke-neutral-solid`(SEED palette gray-600), 기간 사이 숫자 `fg-neutral-muted`(SEED 코드와 같다 — 그림은 fg-neutral).
- **호버 · 누름은 SEED 와 같은 투명 색**(`bg-neutral-weak-alpha-pressed`) — 오늘 · 기간 사이 날 위만 불투명 `bg-neutral-weak-pressed` 다(투명 색을 띠에 얹으면 또 다른 색이 된다).
- **빠른 기간 칩 줄** — SEED 에는 가이드가 없다("오늘로 이동" 예제뿐).
- **Week 보기는 두지 않는다** — 쓰는 곳이 없다.
- **열 때 초점은 고른 날(없으면 오늘)** — SEED 는 정하지 않았다(Tab 자리는 고른 날, 없으면 1일).

## Migration notes

### 2026-10-21 — 큰 글자 · 호버 · 앱 키 · 캘린더 화면(03-C)

구현 조사 03-C(2026-10-16 ~ 17)를 보고 사용자가 정했다(비교 페이지 https://claude.ai/artifact/3nWUZCYpPh2Cg3uXc3DKtp).

- **큰 글자(1B)** — 글자만 배율, 칸 · 머리 · 요일 줄은 최소 48 · 원 42 · 이전 · 다음 40 은 px(SEED). 웹은 rem 이던 칸이 200% 에서 96 으로 커져 시트를 넘고 제목이 "202…" 로 잘렸다 — 레시피 `min-h-[48px]` · 이전 · 다음 `h-[40px] w-[40px]`. 앱은 칸 48 고정을 최소 48 로. 거절: 웹 rem 그대로 · 달력 글자 모두 -static.
- **호버 · 누름 원(2B)** — 불투명 `bg-layer-floating-pressed` 가 다크에서 오늘 원(`bg-neutral-weak`)과 같은 색이었다. SEED 투명 색 `bg-neutral-weak-alpha-pressed` 로(추천 A "늘 bg-neutral-weak-pressed" 가 아니다). 오늘 · 기간 위는 그대로 불투명 `bg-neutral-weak-pressed`.
- **앱 방향키(4A)** — 앱도 웹과 같은 키 · 열 때 초점 · 키보드일 때만 링. 앱 `PDatePicker` 에 Focus · 키 처리와 테스트를 더한다(이어지는 달은 스크롤 위치를 따라간다).
- **캘린더 화면 격자(5A)** — 피커가 아니지만 같은 규칙을 쓴다: 이웃 달 날짜는 숫자만 `fg-disabled`(일정 · 금액은 이번 달과 같게 읽힌다), 꺼진 캘린더 줄은 체크로만 알리고 흐리게 하지 않는다(불투명도 금지 — DESIGN State). 웹 `calendar-month-view.tsx:206 · 233 · 252` · `calendar-source-toggle.tsx:138 · 169` 의 불투명도를 걷는다.

### 2026-10-03 — SEED Date Picker 로 새로 둔다(옛 Calendar 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/9bPrBNHaYc7gRPweKRadUw)에서 정했다 — 달력 모양 SEED(칸 48 · 원 42 · 숫자 16), 오늘은 옅은 원 + 굵기, 앞뒤 달은 흐리게 채우고 6주(누르지 못함), 연 · 월 휠, 기간은 달력 하나(시트 이어지는 달 · 팝오버 두 달), 빠른 기간 칩 한 벌(달력 단위), 여러 날 · 읽기 전용도 둔다. 옛 Calendar(react-day-picker · 원 40 · 고른 날 브랜드 채움 · 오늘 2px 테두리 · 앞뒤 달 tertiary · 막힌 날 불투명도 0.5)는 걷었다 — 옛 스펙은 `calendar.history/v-pre-seed-date.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **세 제품 모두** — 날짜 칸이 치는 칸이다(Desk 웹 14 · 앱 19 · HR 19, 네이티브 date 6 따로). 달력은 누르면 바로 들어가고 닫힌다. 기간 달력은 한 곳도 없다(두 칸).
- **Desk 웹** — 앞뒤 달이 이번 달과 같은 색, 다크에서 고른 날 · 오늘 테두리 1.96:1, 이름이 영어("Go to the Previous Month" · "Today, …"), 월 셀렉트가 브라우저 언어(Jan…Dec), 폰에서도 팝오버(시트 위로 뜬다), 빠른 기간 세 벌이 같은 이름에 다른 기간.
- **Desk 앱** — 다크에서 고른 날 2.75:1, 낭독기에 날짜가 "8" 로만 읽힌다(버튼 아님 · 이전 · 다음 이름 없음), 날짜 상한이 2030-01-01(일정 · 할 일 · 저축 · 더치페이)로 박혀 있다, 일정 화면이 2020 ~ 2030 밖에서 깨진다.
- **HR 웹** — 칸에 치면 값이 깨진다("2" → "2001-02-01", 업무 보고 필터는 지울 수 없다, 일정 종료일은 칠 때마다 토스트), 한국어 화면에 영어 달력, 오늘 회색 사각 1.06:1, UTC 로 읽어 하루 전을 칠한다.
- 앱 적용 때 화면마다 정할 자리 — 자리별 고를 수 있는 범위(거래 · 일정의 미래, 할 일 · 저축 상한), HR 보기용 작은 달력(일 보기 옆 · 근무 미입력 위젯), 일정 화면 격자(피커가 아니다 — 오늘 = 채운 원은 캘린더 화면 차례에), 통계의 월 · 분기 · 년 보기.
