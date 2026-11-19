# Input Button

> 입력칸 모양의 버튼입니다. 누르면 달력 · 시각 · 아이콘 격자 · 긴 목록을 시트(1280 미만)나 팝오버(1280 이상)로 열고, 고른 값을 칸에 글로 넣습니다 — 값을 직접 입력하지 않습니다. 짧은 선택지 5개 이상은 [Select](select.md), 직접 입력하는 값은 [Input](input.md) 을 씁니다.

칸은 상자(Container) · 값 · 앞 · 뒤 붙이개 · 지우기 버튼으로 이뤄지고, 라벨 · 설명 · 오류는 [Field](field.md) 가 칸 둘레에 그립니다.

수치 원본은 [`input-button.yaml`](input-button.yaml)입니다.

[그림: 거래 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/input-button.tsx#hero)

### 직접 골라 보기

크기 · 상태 · 붙이개 · 지우기를 바꾸면 칸과 코드가 함께 바뀝니다. 칸을 누르면 이 창의 폭에 맞는 자리(시트 · 팝오버)가 열립니다.

[그림: 플레이그라운드](../../site/components/specs/input-button.tsx#playground)

## Anatomy

[그림: 칸은 상자 · 앞 붙이개 · 값 · 지우기 버튼 · 뒤 붙이개로 이뤄진다](../../site/components/specs/input-button.tsx#anatomy)

| ⓐ Container | 상자 — 테두리 · 바탕 · 모서리입니다. 상자 전체가 누르는 영역인 버튼입니다(배경 층). |
| ⓑ Prefix | 앞 붙이개 — 아이콘 · 글자입니다. 없어도 됩니다. |
| ⓒ Value · Placeholder | 고른 값 — 한 줄이고, 넘치면 말줄임합니다. 고르기 전에는 고를 값의 종류("날짜 선택")를 보입니다. |
| ⓓ Clear Button | 지우기 — 선택 사항인 칸에 값이 있을 때만 보입니다. 상자 위에 따로 눌리는 버튼입니다. |
| ⓔ Suffix | 뒤 붙이개 — 무엇이 열리는지 알리는 아이콘(달력 · 시계 · 아래 화살표)이나 단위 글자입니다. |

[표: 부위](input-button.yaml#slots)

## Properties

### Size

`large`(52)는 폰 · 앱에서, `medium`(40)은 1280 이상 데스크톱 웹(마우스)에서만 씁니다. 웹의 기본은 `responsive` 입니다 — 1280 미만은 large, 이상은 medium 입니다. 앱은 언제나 large 입니다. 크기 · 모서리 · 여백 · 글자는 [Input](input.md) 의 상자형과 같아, 한 폼에 섞여도 줄이 맞습니다.

[그림: 크기 — large · medium, 반응형은 1280 에서 바뀐다](../../site/components/specs/input-button.tsx#size)

[표: 크기](input-button.yaml#size)

### State

상자는 Input 과 같지만, 버튼이라 누름 · 포커스가 다릅니다. 누르면 바탕이 칠해지고 값 · 붙이개만 2px 거리로 줄어듭니다. 포커스는 키보드로 왔을 때만 바깥 링으로 표시합니다(입력 중임을 알리는 Input 의 2px 테두리와 다릅니다).

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak` |
| `pressed` | 바탕 `bg-layer-default-pressed` + 값 · 붙이개 2px 거리 축소(테두리 · 바탕은 그대로). 마우스는 호버에 같은 바탕 |
| `focused` | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` — 링은 상자 모서리를 따릅니다(바깥 반지름 = 상자 + 4, large 16 · medium 12 — DESIGN.md State) |
| `invalid` | 안쪽 2px `stroke-critical-solid` — 눌러도 그대로입니다. 오류 글은 Field 가 칸 아래에 둡니다 |
| `disabled` | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 흐리게 하지 않습니다 |
| `readonly` | 바탕 `bg-disabled` · 값은 진한 글자 그대로. 포커스는 받고 열리지 않습니다 |

[그림: 상태 — 기본 · 누름 · 포커스 · 오류 · 비활성 · 읽기 전용](../../site/components/specs/input-button.tsx#states)

[표: 상태 — 상자](input-button.yaml#matrix@root)

[표: 상태 — 글자 · 아이콘](input-button.yaml#matrix@value+placeholder+prefixIcon+prefixText+suffixText+suffixIcon)

[표: 상태 — 지우기](input-button.yaml#matrix@clearButton)

[표: 포커스 링](input-button.yaml#matrix@focusRing)

[표: 모션](input-button.yaml#motion)

### Prefix · Suffix

칸 안 앞 · 뒤에 글자나 아이콘을 둡니다. 글자(`prefix` · `suffix`)는 값과 같은 크기의 `fg-neutral-subtle`, 아이콘(`prefixIcon` · `suffixIcon`)은 large 20 · medium 16 의 `fg-neutral-muted` 입니다. 아이콘은 lucide 선 아이콘입니다.

- 뒤 아이콘은 누르면 무엇이 열리는지 알립니다 — 달력(`calendar`) · 시계(`clock`) · 목록이나 격자(`chevron-down`). 한 폼 안에서 같은 것을 여는 칸은 같은 아이콘을 씁니다.
- 값의 종류를 아이콘으로 함께 알리고 싶으면 앞 아이콘을 씁니다(고른 카테고리의 아이콘처럼 값에 딸린 아이콘도 됩니다).
- 아이콘만으로 뜻을 알리지 않습니다 — 라벨이 함께 알립니다.

[그림: 붙이개 — 달력 · 시계 · 아래 화살표 · 고른 카테고리 아이콘 · 단위 글자](../../site/components/specs/input-button.tsx#affix)

### Clear Button

선택 사항인 칸에 값이 있으면 한 번에 비우는 버튼(`onClear`)을 둡니다 — large 22 · medium 18 의 `fg-neutral-subtle` 원 X(`circle-x`)입니다. 값 바로 뒤, 뒤 붙이개 앞에 놓습니다(뒤 아이콘이 언제나 오른쪽 끝에 있게). 막혔거나 읽기 전용이면 보이지 않습니다. 누르면 값만 비우고 아무것도 열지 않습니다. 누름도 지우기 버튼만 줄어들고 상자는 눌리지 않습니다.

[그림: 지우기 — 선택 사항인 칸에 값이 있을 때만](../../site/components/specs/input-button.tsx#clear)

## Guidelines

### 혼자 쓰지 않습니다

Input Button 은 언제나 고르는 자리를 엽니다 — 달력 · 시각 휠 · 아이콘 격자 · 목록 시트 · 검색 시트. 누르면 다른 화면으로 가는 줄, 바로 실행되는 버튼, 값을 직접 입력하는 칸으로 쓰지 않습니다. 다른 화면으로 가는 줄은 [List](list.md) 의 줄입니다. [Icon Picker](icon-picker.md) 의 트리거도 Input Button 입니다.

[그림: 혼자 쓰지 않는다 — 고르는 자리를 연다 · 다른 화면으로 가는 칸](../../site/components/specs/input-button.tsx#alone-guide)

### 1280 미만은 시트, 이상은 팝오버

여는 자리는 화면 폭으로 정합니다. 칸 크기가 바뀌는 폭(1280)과 같습니다.

| 폭 | 여는 자리 |
|---|---|
| 1280 미만(폰 · 태블릿 · 앱) | 아래에서 올라오는 시트 — 위에 제목(고를 값의 종류), 확정이 필요하면 아래에 "완료" |
| 1280 이상(데스크톱 웹) | 칸 아래 8 에 붙는 팝오버 — 칸 폭에 왼쪽을 맞추고, 아래가 모자라면 위로 |

시트 · 팝오버의 모양은 [Bottom Sheet](bottom-sheet.md) · [Popover](popover.md) 를 따릅니다. 달력은 [Date Picker](date-picker.md), 시각 휠은 [Time Picker](time-picker.md), 달만 고르는 휠은 [Wheel Picker](wheel-picker.md) 입니다.

[그림: 여는 자리 — 폰의 시트 · 데스크톱의 팝오버](../../site/components/specs/input-button.tsx#open-guide)

### 달력 · 시각은 "완료" 로 넣습니다

달력 · 시각 휠은 고르는 동안 칸의 값이 바뀌지 않습니다. 고른 것은 시트 · 팝오버 안에만 있다가 "완료" 를 누를 때 칸에 들어갑니다. 바깥을 누르거나 끌어내리거나 `Esc` 로 닫으면 고르던 것은 버리고 칸의 값은 그대로 둡니다. 열 때는 칸의 값에서 시작합니다(비었으면 오늘 · 지금을 짚기만 하고 고른 것처럼 칠하지 않습니다). 기간처럼 두 번 고르는 것은 둘을 다 고르기 전에는 "완료" 를 막습니다.

[그림: 완료 — 고른 날이 "완료" 에서 들어간다 · 휠을 굴리는 대로 칸이 바뀐다](../../site/components/specs/input-button.tsx#confirm-guide)

### 목록은 누르면 바로 넣습니다

시트 · 팝오버의 목록(카테고리 격자 · 하나 고르는 목록)은 누르는 순간 고르고 닫힙니다 — "완료" 를 두지 않습니다. 여럿 고르는 목록만 "완료" 로 넣습니다. 고른 것은 체크 · 라디오로 보이고, 열면 고른 것이 보이게 스크롤합니다. 이미 고른 줄을 다시 눌러도 닫습니다 — 값은 그대로이고 요청도 보내지 않습니다. 고른 것을 확인하고 나가는 길이기 때문입니다.

[그림: 목록 — 누르면 고르고 닫힌다](../../site/components/specs/input-button.tsx#list-guide)

### 긴 목록은 검색 시트

스크롤로 찾기 어려운 목록(결재자 · 사람 · 종목 · 카드사)은 시트 · 팝오버 위에 검색칸, 아래에 목록을 둡니다([Searchable List](searchable-list.md) — 검색칸 밑줄형 large 40 · medium 34, 결과는 List 줄 + 오른쪽 라디오). 검색칸은 [Input](input.md) 의 밑줄형입니다 — 시트에 입력이 하나뿐인 목록 위 검색이기 때문입니다. 열면 검색칸에 포커스가 가고, 입력하는 대로 목록이 걸러지고, 고르면 닫힙니다. 칸에 바로 입력하는 Combobox 는 두지 않습니다 — 폰에서는 키보드가 목록을 가리고, 데스크톱도 같은 부품으로 짭니다.

[그림: 검색 시트 — 위 밑줄형 검색칸 + 결재자 목록 · 검색 없는 긴 Select](../../site/components/specs/input-button.tsx#search-guide)

### 값 · placeholder 글

- 고른 값은 고른 자리의 표기 그대로 씁니다 — 날짜 · 시각은 기초 International Design 의 표기, 카테고리는 그 이름("식비 · 점심")입니다.
- placeholder 는 "{값의 종류} 선택"("날짜 선택")입니다. 라벨만 그대로 두지 않습니다. 마침표는 찍지 않습니다.
- 코드값(`ANNUAL` · 아이디)을 글로 내지 않습니다(Writing).

## 코드

레시피 `recipes/shadcn/components/ui/input-button.tsx`(InputButton · useInputButtonSurface)를 [Field](field.md) 안에 둡니다. 값은 쓰는 쪽이 가집니다 — 칸은 값을 보이고 누르면 `onClick` 을 부를 뿐입니다. 여는 자리는 `useInputButtonSurface()` 가 폭으로 정합니다(1280 미만 `"sheet"` · 이상 `"popover"`). 달력은 [Date Picker](date-picker.md) 레시피입니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 날짜 — "완료" 로 넣습니다

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
| Click / Tap · `Enter` · `Space` | 고르는 자리(시트 · 팝오버)를 엽니다. 상자 어디를 눌러도(붙이개 · 여백 포함) 같습니다. |
| 열린 뒤 포커스 | 시트 · 팝오버 안으로 갑니다 — 검색 시트는 검색칸, 달력은 고른 날(없으면 오늘), 목록은 고른 줄. |
| 닫힌 뒤 포커스 | 칸으로 돌아옵니다. |
| 지우기 | 값만 비웁니다(`onClear`) — 열지 않습니다. 포커스는 칸으로 갑니다. Tab 순서에 없습니다. |
| `<label>` 누르기 | 칸으로 포커스만 옮깁니다 — 열지 않습니다(Field). |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| 글자 크기 설정 | 값 · placeholder · 붙이개 글은 글자 크기 설정을 따라 커지고 상자 높이가 따라 늘어납니다. 줄은 하나를 지키고, 넘치면 끝을 "…" 로 줄입니다. 앞 · 뒤 아이콘과 지우기는 px 로 그대로입니다. |
| Disabled | 포커스 · 열기 불가. 커서 not-allowed. |
| Readonly | 포커스는 받고 열리지 않습니다(`aria-disabled`). 값은 그대로 읽힙니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 값 `fg-neutral` 16.41 · 13.42(누름 바탕 위 15.48 · 10.32), 붙이개 글자 5.50 · 6.09(누름 바탕 위 5.18 · 4.68), 읽기 전용 값 15.20 · 10.32 ✓. placeholder 4.18 · 4.13(누름 바탕 위 3.94 · 3.18) — 4.5:1 에 못 미치는 것을 알고 둔 값입니다. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.4** Resize text | 값 · placeholder · 붙이개 글이 글자 크기 설정을 따라 커지고 상자가 따라 높아집니다 ✓. 한 줄 부품이라 넘친 값은 "…" 로 줄이고, 전체 값은 칸 이름(라벨 + 값)으로 읽고 여는 자리(시트 · 팝오버)에서 크게 봅니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 `stroke-focus-ring` Desk 8.38 · 6.10 · HR 8.17 · 6.07, 오류 테두리 5.06 · 6.08, 뒤 아이콘 `fg-neutral-muted` 7.11 · 7.70 ✓. 기본 1px 테두리(1.23 · 1.56)는 칸을 알리는 유일한 표시가 아닙니다 — 라벨 · 뒤 아이콘이 함께 알립니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 바깥 링 2px · 띄움 2px |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 모든 크기 ✓. 지우기 버튼 22 · 18 은 보이는 크기이고, 누르는 영역은 24 이상으로 넓힙니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | large 52 ✓ · medium 40 ⚠ — 1280 이상 데스크톱 웹(마우스)에서만 |
| **ARIA** | 칸은 `<button>` 입니다 — 이름은 Field 의 라벨 + 고른 값(`aria-labelledby` — "날짜, 10월 1일 (목)")이고, 비었으면 라벨 + placeholder 입니다. 라벨이 없으면 `aria-label`(값이 뒤에 이어 읽힙니다). 여는 자리를 `aria-haspopup="dialog"` · `aria-expanded` 로 알립니다. 오류는 `aria-invalid`, 설명 · 오류 · 붙이개 글은 `aria-describedby` 입니다. 버튼에는 `aria-required` 를 달 수 없어 필수 칸은 설명으로 "필수" 를 읽힙니다(화면에 보이는 필수 점은 Field 가 그립니다). 지우기 버튼 이름은 "지우기" 입니다 |

## Do / Don't

### ✅ Do

- 모든 칸을 Field 로 감싸 라벨을 답니다.
- 뒤 아이콘으로 무엇이 열리는지 알립니다(달력 · 시계 · 아래 화살표).
- 1280 미만은 시트, 이상은 팝오버로 엽니다.
- 달력 · 시각은 "완료" 로, 목록은 누르면 바로 넣습니다.
- 긴 목록은 검색 시트로 엽니다.
- 지우기는 선택 사항인 칸에만 둡니다.

### ❌ Don't

- 날짜 · 시각 · 카테고리를 타이핑으로 받기.
- 다른 화면으로 가는 줄 · 바로 실행되는 버튼으로 쓰기.
- 휠을 굴리거나 날을 누르는 대로 칸의 값을 바꾸기.
- 짧은 선택지 5 ~ 10개를 시트로 열기(Select).
- 칸에 바로 입력하는 Combobox 를 따로 만들기.
- 폰에서 medium(40) 쓰기.

## Specification

`input-button.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Input Button 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — input-button.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input-button)
