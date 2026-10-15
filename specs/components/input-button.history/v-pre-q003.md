# Input Button

> 입력칸 모양의 버튼. 누르면 달력 · 시각 · 아이콘 격자 · 긴 목록을 시트(1280 미만) · 팝오버(1280 이상)로 열고, 고른 값이 칸에 글로 들어간다 — 직접 치지 않는다. 짧은 선택지 5개 이상은 [Select](select.md), 직접 치는 값은 [Input](input.md)이다.

구조는 당근 [SEED Input Button](https://seed-design.io/components/input-button)(React 이름 Field Button, Apache-2.0)을 따른다 — 상자(Container) · 값 · 앞 · 뒤 붙이개 · 지우기 버튼. 라벨 · 설명 · 오류는 [Field](field.md)가 둘레에서 그린다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정).

수치 원본은 [`input-button.yaml`](input-button.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/input-button.tsx#hero)

### 직접 골라 보기

크기 · 상태 · 붙이개 · 지우기를 고르면 스펙대로 그린 칸과 그 코드가 바뀐다. 누르면 이 창의 폭에 맞는 자리(시트 · 팝오버)가 열린다.

[그림: 플레이그라운드](../../site/components/specs/input-button.tsx#playground)

## Anatomy

[그림: 칸은 상자 · 앞 붙이개 · 값 · 지우기 버튼 · 뒤 붙이개로 이뤄진다](../../site/components/specs/input-button.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리. 상자 전체가 누르는 영역인 버튼이다(배경 층). |
| ⓑ Prefix | 앞 붙이개 — 아이콘 · 글자. 없어도 된다. |
| ⓒ Value · Placeholder | 고른 값 — 한 줄, 넘치면 말줄임. 고르기 전에는 고를 값의 종류("날짜 선택"). |
| ⓓ Clear Button | 지우기 — 선택 사항인 칸에 값이 있을 때만. 상자 위에 따로 눌리는 버튼이다. |
| ⓔ Suffix | 뒤 붙이개 — 무엇이 열리는지 알리는 아이콘(달력 · 시계 · 아래 화살표)이나 단위 글자. |

[표: 부위](input-button.yaml#slots)

## Properties

### Size

`large`(52)는 폰 · 앱에서, `medium`(40)은 1280 이상 데스크톱 웹(마우스)에서만 쓴다. 웹의 기본은 `responsive` 다 — 1280 미만은 large, 이상은 medium(SEED `lg`). 앱은 늘 large 다. 크기 · 모서리 · 여백 · 글자는 [Input](input.md) 의 상자형과 같다 — 한 폼에 섞여도 줄이 맞는다.

[그림: 크기 — large · medium, 반응형은 1280 에서 바뀐다](../../site/components/specs/input-button.tsx#size)

[표: 크기](input-button.yaml#size)

### State

상자는 Input 과 같고, 버튼이라 누름 · 포커스가 다르다 — 누르면 바탕이 칠해지고 값 · 붙이개만 2px 거리로 준다. 포커스는 키보드로 왔을 때만 바깥 링이다(입력 중임을 알리는 Input 의 2px 테두리와 다르다).

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak` |
| `pressed` | 바탕 `bg-layer-default-pressed` + 값 · 붙이개 2px 거리 축소(테두리 · 바탕은 그대로). 마우스는 호버에 같은 바탕 |
| `focused` | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` |
| `invalid` | 안쪽 2px `stroke-critical-solid` — 눌러도 그대로. 오류 글은 Field 가 칸 아래에 |
| `disabled` | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 흐리게 하지 않는다(v106) |
| `readonly` | 바탕 `bg-disabled` · 값은 진한 글자 그대로. 포커스는 되고 열리지 않는다 |

[그림: 상태 — 기본 · 누름 · 포커스 · 오류 · 비활성 · 읽기 전용](../../site/components/specs/input-button.tsx#states)

[표: 상태 — 상자](input-button.yaml#matrix@root)

[표: 상태 — 글자 · 아이콘](input-button.yaml#matrix@value+placeholder+prefixIcon+prefixText+suffixText+suffixIcon)

[표: 상태 — 지우기](input-button.yaml#matrix@clearButton)

[표: 포커스 링](input-button.yaml#matrix@focusRing)

[표: 모션](input-button.yaml#motion)

### Prefix · Suffix

칸 안 앞 · 뒤에 글자나 아이콘을 둔다. 글자(`prefix` · `suffix`)는 값과 같은 크기의 `fg-neutral-subtle`, 아이콘(`prefixIcon` · `suffixIcon`)은 large 20 · medium 16 의 `fg-neutral-muted` 다.

- 뒤 아이콘은 누르면 무엇이 열리는지 알린다 — 달력(`calendar`) · 시계(`clock`) · 목록이나 격자(`chevron-down`). 한 폼 안에서 같은 것을 여는 칸은 같은 아이콘을 쓴다.
- 값의 종류를 아이콘으로 함께 알리고 싶으면 앞 아이콘을 쓴다(고른 카테고리의 아이콘처럼 값에 딸린 아이콘도 된다).
- 아이콘만으로 뜻을 알리지 않는다 — 라벨이 함께 알린다.

[그림: 붙이개 — 달력 · 시계 · 아래 화살표 · 고른 카테고리 아이콘 · 단위 글자](../../site/components/specs/input-button.tsx#affix)

### Clear Button

선택 사항인 칸에 값이 있으면 한 번에 비우는 버튼(`onClear`) — large 22 · medium 18 의 `fg-neutral-subtle` 원 X. 값 바로 뒤, 뒤 붙이개 앞에 놓인다(뒤 아이콘이 늘 오른쪽 끝에 있게). 막혔거나 읽기 전용이면 보이지 않는다. 누르면 값만 비우고 아무것도 열지 않는다 — 누름도 지우기 버튼만 준다(상자는 눌리지 않는다).

[그림: 지우기 — 선택 사항인 칸에 값이 있을 때만](../../site/components/specs/input-button.tsx#clear)

## Guidelines

### 혼자 쓰지 않는다

Input Button 은 늘 고르는 자리를 연다 — 달력 · 시각 휠 · 아이콘 격자 · 목록 시트 · 검색 시트. 누르면 다른 화면으로 가는 줄, 바로 실행되는 버튼, 값을 직접 치는 칸으로 쓰지 않는다. 다른 화면으로 가는 줄은 [List](list.md) 의 줄이다.

[그림: 혼자 쓰지 않는다 — 고르는 자리를 연다 · 다른 화면으로 가는 칸](../../site/components/specs/input-button.tsx#alone-guide)

### 1280 미만은 시트, 이상은 팝오버

여는 자리는 화면 폭으로 정한다(SEED Date Picker · Time Picker). 칸 크기가 바뀌는 폭(1280)과 같다.

| 폭 | 여는 자리 |
|---|---|
| 1280 미만(폰 · 태블릿 · 앱) | 아래에서 올라오는 시트 — 위에 제목(고를 값의 종류), 확정이 필요하면 아래에 "완료" |
| 1280 이상(데스크톱 웹) | 칸 아래 8 에 붙는 팝오버 — 칸 폭에 왼쪽을 맞추고, 아래가 모자라면 위로 |

시트 · 팝오버의 모양은 [Bottom Sheet](bottom-sheet.md) · [Popover](popover.md) 를 따른다. 달력은 [Date Picker](date-picker.md), 시각 휠은 [Time Picker](time-picker.md), 달만 고르는 휠은 [Wheel Picker](wheel-picker.md) 다.

[그림: 여는 자리 — 폰의 시트 · 데스크톱의 팝오버](../../site/components/specs/input-button.tsx#open-guide)

### 달력 · 시각은 "완료" 로 넣는다

달력 · 시각 휠은 고르는 동안 칸의 값이 바뀌지 않는다 — 고른 것은 시트 · 팝오버 안에만 있다가 "완료" 를 누를 때 칸에 들어간다. 바깥을 누르거나 끌어내리거나 `Esc` 로 닫으면 고르던 것은 버리고 칸의 값은 그대로다. 열 때는 칸의 값에서 시작한다(비었으면 오늘 · 지금을 짚기만 하고 고른 것처럼 칠하지 않는다). 기간처럼 두 번 고르는 것은 둘을 다 고르기 전에는 "완료" 를 막는다.

[그림: 완료 — 고른 날이 "완료" 에서 들어간다 · 휠을 굴리는 대로 칸이 바뀐다](../../site/components/specs/input-button.tsx#confirm-guide)

### 목록은 누르면 바로

시트 · 팝오버의 목록(카테고리 격자 · 하나 고르는 목록)은 누르는 순간 고르고 닫힌다 — "완료" 를 두지 않는다. 여럿 고르는 목록만 "완료" 로 넣는다. 고른 것은 체크 · 라디오로 보이고, 열면 고른 것이 보이게 스크롤된다.

[그림: 목록 — 누르면 고르고 닫힌다](../../site/components/specs/input-button.tsx#list-guide)

### 긴 목록은 검색 시트

스크롤로 찾기 어려운 목록(결재자 · 사람 · 종목 · 카드사)은 시트 · 팝오버 위에 검색칸, 아래에 목록을 둔다([Searchable List](searchable-list.md)). 검색칸은 [Input](input.md) 의 밑줄형이다 — 시트에 입력이 하나뿐인 목록 위 검색이다(사용자 결정 2026-10-08). 열면 검색칸에 포커스가 가고, 치는 대로 목록이 걸러지고, 고르면 닫힌다. 칸에 바로 치는 Combobox 는 두지 않는다 — 폰에서는 키보드가 목록을 가리고, 데스크톱도 같은 부품으로 짠다.

[그림: 검색 시트 — 위 밑줄형 검색칸 + 결재자 목록 · 검색 없는 긴 Select](../../site/components/specs/input-button.tsx#search-guide)

### 값 · placeholder 글

- 고른 값은 고른 자리의 표기 그대로 쓴다 — 날짜 · 시각은 기초 International Design 의 표기, 카테고리는 그 이름("식비 · 점심").
- placeholder 는 "{값의 종류} 선택"("날짜 선택"). 라벨만 그대로 두지 않는다. 마침표는 찍지 않는다.
- 코드값(`ANNUAL` · 아이디)을 글로 내지 않는다(Writing).

## 코드

레시피 `recipes/shadcn/components/ui/input-button.tsx`(InputButton · useInputButtonSurface)를 [Field](field.md) 안에 둔다. 값은 쓰는 쪽이 가진다 — 칸은 값을 보이고 누르면 `onClick` 을 부를 뿐이다. 여는 자리는 `useInputButtonSurface()` 가 폭으로 정한다(1280 미만 `"sheet"` · 이상 `"popover"`). 달력은 [Date Picker](date-picker.md) 레시피다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 날짜 — "완료" 로 넣는다

[그림: 날짜 — 시트 · 팝오버의 달력](../../site/components/specs/input-button.tsx#ex-date)

```tsx
import { CalendarDays } from "lucide-react"
import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetFooter } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { DatePicker, formatDateValue } from "@/components/ui/date-picker"
import { Field } from "@/components/ui/field"
import { InputButton, useInputButtonSurface } from "@/components/ui/input-button"
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from "@/components/ui/popover"

const surface = useInputButtonSurface()
const [open, setOpen] = React.useState(false)
const [draft, setDraft] = React.useState(date)

const trigger = (
  <InputButton
    placeholder="날짜 선택"
    value={date ? formatDateValue(date) : undefined}
    suffixIcon={<CalendarDays />}
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => {
      setDraft(date) // 열 때 칸의 값에서 시작한다
      setOpen(true)
    }}
  />
)
const calendar = <DatePicker selection="single" value={draft} onValueChange={setDraft} autoFocus />
// 바닥 버튼은 크기를 주지 않는다 — 시트 바닥은 large 48, 팝오버 바닥은 small 36 을 넣는다
const done = <Button disabled={!draft} onClick={() => { setDate(draft); setOpen(false) }}>완료</Button>

<Field label="날짜">
  {surface === "sheet" ? (
    <BottomSheet open={open} onOpenChange={setOpen}>
      {trigger}
      <BottomSheetContent title="날짜 선택">
        <BottomSheetBody>{calendar}</BottomSheetBody>
        <BottomSheetFooter>{done}</BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      {/* 고르는 패널은 머리 없이 — 이름은 aria-label */}
      <PopoverContent aria-label="날짜 선택" align="start">
        <PopoverBody>{calendar}</PopoverBody>
        <PopoverFooter>{done}</PopoverFooter>
      </PopoverContent>
    </Popover>
  )}
</Field>
```

### 목록 — 누르면 바로

[그림: 목록 — 카테고리 격자](../../site/components/specs/input-button.tsx#ex-list)

```tsx
<Field label="카테고리">
  <InputButton
    placeholder="카테고리 선택"
    value={category?.name}
    prefixIcon={category ? <CategoryIcon category={category} /> : undefined}
    suffixIcon={<ChevronDown />}
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => setOpen(true)}
  />
</Field>
{/* 시트의 격자에서 누르면 setCategory(c) · setOpen(false) */}
```

### 검색 시트 · 지우기

[그림: 검색 시트 — 밑줄형 검색칸 · 결재자](../../site/components/specs/input-button.tsx#ex-search)

```tsx
<Field label="참조자" indicator="선택">
  <InputButton
    placeholder="참조자 선택"
    value={cc?.name}
    suffixIcon={<ChevronDown />}
    onClear={() => setCc(undefined)} // 값이 있을 때만 지우기 버튼
    aria-haspopup="dialog"
    aria-expanded={open}
    onClick={() => setOpen(true)}
  />
</Field>
{/* 시트 · 팝오버: Searchable List — 위에 밑줄형 검색칸(<SearchableListInput> = Input variant="underline" · 앞 돋보기), 아래 걸러진 목록 */}
```

### 상태

[그림: 상태 — 오류 · 비활성 · 읽기 전용](../../site/components/specs/input-button.tsx#ex-states)

```tsx
<Field label="날짜" invalid errorMessage="날짜를 골라주세요.">
  <InputButton placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={openPicker} />
</Field>
<Field label="날짜" disabled>
  <InputButton value="10월 1일 (목)" suffixIcon={<CalendarDays />} />
</Field>
<Field label="입사일" readOnly>
  <InputButton value="2024년 3월 4일 (월)" suffixIcon={<CalendarDays />} />
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap · `Enter` · `Space` | 고르는 자리(시트 · 팝오버)를 연다. 상자 어디를 눌러도(붙이개 · 여백 포함) 같다. |
| 열린 뒤 포커스 | 시트 · 팝오버 안으로 간다 — 검색 시트는 검색칸, 달력은 고른 날(없으면 오늘), 목록은 고른 줄. |
| 닫힌 뒤 포커스 | 칸으로 돌아온다. |
| 지우기 | 값만 비운다(`onClear`) — 열지 않는다. 포커스는 칸으로 간다. Tab 순서에 없다. |
| `<label>` 누르기 | 칸으로 포커스만 옮긴다 — 열지 않는다(Field). |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| Disabled | 포커스 · 열기 불가. 커서 not-allowed. |
| Readonly | 포커스는 되고 열리지 않는다. 값은 그대로 읽힌다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42(누름 바탕 위 15.48 · 10.32), placeholder · 붙이개 글자 5.50 · 6.09(누름 바탕 위 5.18 · 4.68), 읽기 전용 값 15.20 · 10.32 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 `stroke-focus-ring` Desk 8.38 · 6.10 · HR 5.06 · 6.23, 오류 테두리 5.06 · 6.08, 뒤 아이콘 `fg-neutral-muted` 7.11 · 7.70 ✓. 기본 1px 테두리(1.23 · 1.56)는 칸을 알리는 유일한 표시가 아니다 — 라벨 · 뒤 아이콘이 함께 알린다(SEED 와 같다) |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 바깥 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓. 지우기 버튼 22 · 18 은 보이는 크기이고 누르는 영역은 24 이상으로 넓힌다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | large 52 ✓ · medium 40 ⚠ — 1280 이상 데스크톱 웹(마우스)에서만 |
| **ARIA** | 칸은 `<button>` — 이름은 Field 의 라벨 + 고른 값(`aria-labelledby` — "날짜, 10월 1일 (목)"), 비었으면 라벨 + placeholder. 라벨이 없으면 `aria-label`(값이 뒤에 이어 읽힌다). 여는 자리를 `aria-haspopup="dialog"` · `aria-expanded` 로 알린다. 오류 `aria-invalid`, 설명 · 오류 · 붙이개 글은 `aria-describedby`. 버튼에는 `aria-required` 를 달 수 없어 필수 칸은 설명으로 "필수" 를 읽힌다(화면에 보이는 필수 점은 Field 가 그린다). 지우기 버튼 이름 "지우기" |

## Do / Don't

### ✅ Do

- 모든 칸을 Field 로 감싸 라벨을 단다.
- 뒤 아이콘으로 무엇이 열리는지 알린다(달력 · 시계 · 아래 화살표).
- 1280 미만은 시트, 이상은 팝오버.
- 달력 · 시각은 "완료" 로, 목록은 누르면 바로 넣는다.
- 긴 목록은 검색 시트로.
- 지우기는 선택 사항인 칸에만.

### ❌ Don't

- 날짜 · 시각 · 카테고리를 타이핑으로 받기.
- 다른 화면으로 가는 줄 · 바로 실행되는 버튼으로 쓰기.
- 휠을 굴리거나 날을 누르는 대로 칸의 값을 바꾸기.
- 짧은 선택지 5 ~ 10개를 시트로 열기(Select).
- 칸에 바로 치는 Combobox 를 따로 만들기.
- 폰에서 medium(40) 쓰기.

## Specification

`input-button.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Input Button 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — input-button.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input-button)

## SEED 와 다른 점

- **누름 · 호버 바탕은 불투명한 `bg-layer-default-pressed`** — SEED `bg.transparent-pressed` 는 투명도가 있어 대비 검사기가 받지 않는다(v102).
- **누르면 값 · 붙이개를 2px 거리로 준다** — SEED rootage 는 `scaleScope: content` 를 적었지만 웹 CSS 에는 없다. porest 는 rootage 대로(기초 Feedback v104).
- **이름에 고른 값을 잇는다** — SEED 는 값 · placeholder 를 읽히지 않고 쓰는 쪽이 `aria-label` 에 "할 일 + 지금 값" 을 적게 한다. porest 는 Field 의 라벨과 값을 `aria-labelledby` 로 이어 저절로 읽힌다.
- **아이콘은 lucide 선 아이콘**(v106) — 지우기는 `circle-x`(SEED 는 채운 원).
- **읽기 전용도 포커스가 간다** — SEED 는 읽기 전용 칸의 버튼을 막는다(`disabled`). porest 는 Text Input · Select 의 읽기 전용처럼 포커스로 값에 닿게 두고 열지 않는다(`aria-disabled`).
- **여는 자리를 고르는 도움(`useInputButtonSurface`)을 둔다** — SEED 는 Date Picker · Time Picker 문서에 규칙만 적었다.

## Migration notes

### 2026-10-08 — 검색 시트의 검색칸은 밑줄형

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj) 17A 로 정했다 — 목록 위 검색칸은 [Input](input.md) 의 밑줄형("화면에 입력이 하나뿐이면 밑줄 — 목록 위 검색", SEED)이다. 검색 시트 · 팝오버의 묶음은 [Searchable List](searchable-list.md) 다(검색칸 밑줄 large 40 · medium 34, 결과는 List 줄 + 오른쪽 라디오, 콤보박스 키보드). 상자형 52 검색칸(17B)은 고르지 않았다 — 검색 시트 그림(`search-guide` · `ex-search`)을 밑줄형으로 다시 그린다.

### 2026-10-01 — 새로 둔다(SEED Input Button)

사용자가 [비교 페이지](https://claude.ai/artifact/HTcwPnshaQH32xjEfqSkMB)에서 정했다 — 고르는 칸을 Select(짧은 선택지 5개 이상 · 칸 아래 목록)와 Input Button(달력 · 시각 · 아이콘 격자 · 긴 목록)으로 나눈다 · 1280 미만 시트 · 이상 팝오버 · 달력 · 시각은 "완료" 로 확정, 목록 시트는 누르면 바로 · 긴 목록은 Input Button + 검색 시트(Combobox 를 두지 않는다) · 상자는 Input 과 같다(52 · 40 · 반응형) · 누름은 바탕 + 콘텐츠 축소 · 키보드 포커스 링. 그전에는 이 자리를 맡는 컴포넌트가 없어 제품마다 Select 트리거 · 버튼 · 입력칸으로 따로 짰다.

레시피는 `input-button.tsx` 를 새로 뒀다. [Icon Picker](icon-picker.md) 의 트리거(40 고정)는 2026-10-09 스펙에서 Input Button 으로 옮겼다(라벨 "아이콘" · 지금 아이콘 · 그 이름) — 레시피는 그 스펙을 따라 옮긴다.

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사).

- **Desk 웹** — 날짜 14 · 시각 6(타이핑 + 28 버튼 "Select date") · 네이티브 날짜 6 · 월 고르기 7. 달력 안 이름이 영어, 날짜 팝오버 안 달력이 회색 판, 이름 없는 아이콘 버튼 9, 거래 · 반복 폼이 날짜 형식을 검사하지 않는다. 폰에서도 팝오버다.
- **Desk 앱** — 날짜 19 · 시각 5(타이핑 + 28). 날짜 시트는 누르면 바로 닫히고 시각 시트는 [취소][확인] 이라 확정 방식이 둘이다. 빈 칸에서 열면 오늘이 고른 날처럼 그려지고(D14), 2030-01-01 이후를 고를 수 없는 칸이 7곳(D7), 칸에 보이는 값과 저장되는 값이 다르다(D4 · D5). 안 쓰는 공용 피커 7.
- **HR 웹** — 날짜 19 · 시간 2(자유 입력 + 24 버튼) · 사람 고르기 7(검색 없는 Select). 날짜 칸 키보드 입력이 깨진다("2" → 2001-02-01 · Invalid Date 저장 · 2026-10-05026), 연도 1900 ~ 2126, 달력이 영어, 결재자 영역에 번역 키가 그대로 보인다.
