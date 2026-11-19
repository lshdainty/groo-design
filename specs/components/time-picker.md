# Time Picker

> 오전·오후 · 시 · 분을 고르는 12시간 휠입니다. 시각 칸([Input Button](input-button.md))을 누르면 화면 폭 1280 미만에서는 아래 시트로, 1280 이상에서는 칸 아래 팝오버로 열리고, "완료" 를 눌러 값을 넣습니다. 날짜와 함께 받으면 [Date Picker](date-picker.md) 의 날짜 칸 옆에 시각 칸을 나란히 두고, 시각을 직접 입력하는 칸은 두지 않습니다.

수치 원본은 [`time-picker.yaml`](time-picker.yaml)입니다. 휠의 크기 · 색 · 띠 · 안개는 [`wheel-picker.yaml`](wheel-picker.yaml)(medium · 5칸)을 따릅니다.

[그림: 일정 시작 시각 — 시트 · 팝오버, 라이트 · 다크](../../site/components/specs/time-picker.tsx#hero)

### 직접 골라 보기

분 간격과 여는 자리를 바꾸면 휠과 코드가 함께 바뀝니다. 휠을 굴리고 "완료" 로 칸에 넣어 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/time-picker.tsx#playground)

## Anatomy

[그림: 휠은 오전·오후 · 시 · 분 세 칼럼과 가운데 띠](../../site/components/specs/time-picker.tsx#anatomy)

| ⓐ Period Column | 오전 · 오후 — 두 칸에서 멈춥니다. |
| ⓑ Hour Column | 시 — 1 · 2 … 12, 오른쪽 정렬입니다. 끝에서 처음으로 돌아갑니다. |
| ⓒ Minute Column | 분 — 2자리이고 분 간격을 따릅니다. 끝에서 처음으로 돌아갑니다. |
| ⓓ Indicator | 선택 띠 — 세 칼럼을 가로지르는 가운데 한 줄입니다. |

[표: 부위](time-picker.yaml#slots)

## Properties

### 칼럼

칼럼은 오전·오후 → 시 → 분(한국어 순서)이고, "시" · "분" 글자 없이 숫자만 씁니다. 단위는 칼럼 이름과 자리로 알립니다("오후 3 00" = 오후 3시 00분). 시는 오른쪽에 맞춰 한 자리 수와 두 자리 수의 끝을 맞춥니다. 휠 높이는 220(44 × 5), 글자는 26 / 35 · 500 입니다.

[그림: 칼럼 · 띠 · 안개](../../site/components/specs/time-picker.tsx#layout)

[표: 공통](time-picker.yaml#base.enabled)

### Minute Step

분 간격은 기본 1 이고, 자리에 따라 5 · 10 · 15 · 30 을 씁니다. 간격이 넓을수록 빨리 고르고, 좁을수록 정밀합니다. 칼럼에는 그 간격의 분만 둡니다. 휠로만 값을 넣으므로(입력하는 칸이 없습니다) 실제 시각을 그대로 적어야 하는 자리(카드 결제 시각 · 일정)는 1 을 씁니다 — 5 로 두면 "오후 7:57" 을 넣을 방법이 없습니다.

| 간격 | 쓰는 곳 |
|---|---|
| 1 | 기본 — 거래(추가 · 수정 · 환불 · 반복 실행) · 일정 · 할 일 · 알림 · 방해 금지 |
| 5 | 5분 단위면 충분하고 빨리 골라야 하는 자리 |
| 10 · 15 | 느슨한 시간대 · 15분 단위 예약 |
| 30 | 근무 · 일정 시간표(HR 일정) |

[표: 분 간격](time-picker.yaml#minuteStep)

## Guidelines

### 칸 표기와 같은 말

칸에는 International Design 의 시각 표기인 "오후 3:00"(오전 · 오후 12시간, 초 없음)이 들어갑니다. 휠도 같은 표기를 쓰므로 24시간 휠은 두지 않습니다. 값은 24시간({hour, minute})으로 다룹니다.

### "완료" 로 넣습니다

휠을 굴리는 동안 칸의 값은 바뀌지 않고, "완료" 를 누를 때 들어갑니다. 닫기 버튼이나 `Esc` 로 닫으면 고르던 값은 버립니다. 휠을 굴리다 시트가 끌려 닫히지 않도록, 시각 시트는 끌어내리기 · 바깥 누르기로 닫지 않습니다([Bottom Sheet](bottom-sheet.md) 의 휠 시트). 칸이 비어 있으면 지금 시각에 초점만 두고 엽니다. 분 간격이 1 이 아니면 그 간격에 맞춰 반올림한 자리입니다(5 이면 9시 13분 → 9시 15분).

### 놓는 자리

시각 칸은 [Input Button](input-button.md) 이 여는 시트(1280 미만) · 팝오버(1280 이상) 안에 둡니다. 시각 고르기가 화면의 주된 일이면 휠을 화면에 바로 펼칠 수 있고, 이때 확정은 화면의 "다음" · "완료" 입니다. 자리를 고르는 표는 [Date Picker](date-picker.md) 의 "놓는 자리" 하나입니다.

### 시 · 분이 넘어갈 때

시 휠이 11 ↔ 12 를 넘으면 오전 · 오후가 따라 바뀝니다(오전 11 → 오후 12). 분 휠은 55 → 00 을 넘어도 시가 바뀌지 않습니다(10시 55분 → 10시 00분).

### 날짜와 함께

날짜와 시각을 함께 받으면 날짜 칸 옆에 시각 칸을 나란히 둡니다. 하나만 바꾸기 쉽고, 종일이면 시각 칸만 걷으면 됩니다. 시각 칸은 최소 144(large 에서 "오후 12:30" 이 잘리지 않는 폭)이고 글자 크기 설정을 따라 글이 커지면 글만큼 넓어집니다. 날짜 칸은 글이 다 들어가는 폭 이상입니다. 한 줄에 둘이 들어가지 않으면 시각 칸이 다음 줄로 내려갑니다 — 다른 해 날짜("2027년 1월 3일 (일)") · 큰 글자 설정 · 좁은 폰에서 그렇습니다. 올해 날짜는 360 폭 폰에서 거의 꽉 차므로(가장 긴 "12월 28일 (월)" 이 1px 남습니다) 글꼴에 따라 내려갈 수 있습니다. 어느 쪽이든 칸의 글은 자르지 않습니다. 칸마다 Field 로 감싸면 폭 클래스는 Field 에 줍니다. 칸의 글을 말줄임으로 자르지 않고, 한 칸에 날짜와 시각을 같이 넣지 않습니다.

폼에서는 이 두 칸을 나란히 둡니다. 날짜 고르기가 화면의 주된 단계라 달력을 화면에 펼쳤다면([Date Picker](date-picker.md) 의 "놓는 자리"), 시각은 그 아래 칸으로 두고 시트로 엽니다.

[그림: 일정 시작 · 종료 — 날짜 칸 + 시각 칸](../../site/components/specs/time-picker.tsx#datetime-guide)

## 코드

레시피 `recipes/shadcn/components/ui/time-picker.tsx` 를 [Input Button](input-button.md) 이 연 시트 · 팝오버 안에 둡니다(펼친 휠은 화면에 바로 둡니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 시각 — "완료" 로 넣기

[그림: 일정 시작 시각 — 시트 · 팝오버](../../site/components/specs/time-picker.tsx#ex-time)

```tsx
import { Clock } from "lucide-react"
import { TimePicker, formatTimeValue, roundToStep } from "@/components/ui/time-picker"

<InputButton value={formatTimeValue(time)} placeholder="시간 선택" suffixIcon={<Clock />} onClick={() => { setDraft(time ?? roundToStep(new Date(), 5)); setOpen(true) }} />

<TimePicker value={draft} onValueChange={setDraft} />
<Button onClick={() => { setTime(draft); setOpen(false) }}>완료</Button>
```

### 날짜 + 시각 — 두 칸 나란히

[그림: 거래 날짜 · 시각](../../site/components/specs/time-picker.tsx#ex-datetime)

```tsx
{/* 한 줄에 다 들어가지 않으면 시각 칸이 다음 줄로 — 날짜 칸은 글이 다 들어가는 폭 이상 */}
<div className="flex flex-wrap gap-x2">
  <InputButton rootClassName="min-w-max flex-1" value={formatDateValue(date)} placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={openDate} />
  <InputButton rootClassName="w-max min-w-[144px] shrink-0" value={formatTimeValue(time)} placeholder="시간 선택" suffixIcon={<Clock />} onClick={openTime} />
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 굴리기 · 끌기 | 멈춘 뒤 가장 가까운 칸에 맞추고 값을 정합니다([Wheel Picker](wheel-picker.md)) |
| 보이는 항목 누르기 | 그 항목을 가운데로 옮깁니다 |
| 시 11 ↔ 12 | 오전 · 오후가 따라 바뀝니다 |
| 분 55 → 00 | 시는 바뀌지 않습니다 |
| 오전 · 오후 바꾸기 | 시 · 분은 그대로 두고 12시간을 더하거나 뺍니다 |
| 열 때 | 칸의 값(비어 있으면 지금 — 분 간격이 1 이 아니면 반올림한 자리)을 가운데에 두고, 초점을 시 칼럼에 둡니다 |
| 글자 크기 설정 | 휠 항목 글은 [Wheel Picker](wheel-picker.md) 처럼 그대로입니다. 시각 칸(Input Button)의 글은 커지고, 칸은 최소 폭 144 에서 글만큼 넓어지며 한 줄에 날짜 칸과 들어가지 않으면 다음 줄로 내려갑니다 |

### 키보드

| 키 | 동작 |
|---|---|
| `↑` `↓` | 그 칼럼의 이전 · 다음 항목 |
| `Home` `End` | 처음 · 끝 항목(시는 1 · 12). 시 칼럼에서는 오전 · 오후를 바꾸지 않습니다 — 지나간 칸을 세지 않고 그 시로 갑니다. 오전 · 오후는 방향키로 11 ↔ 12 를 넘을 때만 바뀝니다 |
| `Tab` | 다음 칼럼(오전·오후 → 시 → 분 → "완료") |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 고른 항목 `fg-neutral` 은 띠(`bg-neutral-weak`) 위 15.20 · 다크 10.32 ✓. 위아래 항목 `fg-disabled` 는 고를 값이 아닌 둘레 표시입니다(안개로 흐려집니다). 고른 값은 띠 위 글자와 칸의 값으로 알립니다 |
| **WCAG 1.4.4** Resize text | 휠 항목 글은 휠의 칸 높이 · 띠에 맞춘 디자인 틀이라 기준의 예외로 그대로 둡니다. 고른 값은 시각 칸의 글로 글자 크기 설정을 따라 크게 읽습니다 ✓ |
| **WCAG 2.1.1** Keyboard | 칼럼마다 `Tab` 자리 하나, `↑` `↓` 로 고릅니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 항목 높이 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 항목 높이 44 ✓ · 폭은 칼럼 글자 폭 + 32(64 이상) ✓ |
| **앱(Flutter)** | 칼럼은 [Wheel Picker](wheel-picker.md) 의 앱 기준대로 spinbutton 역할 대신 이름("오전/오후" · "시" · "분") + 값 + 올리기 · 내리기(Android 조절 막대 · iOS 조절 가능)로 알립니다 |
| **ARIA** | 휠 `role="group"`(이름 = 칸 라벨, 예: "시작 시각"), 칼럼 `role="spinbutton"` + 이름 "오전/오후" · "시" · "분", `aria-valuetext` "오후" · "3" · "00", `aria-valuemin` · `aria-valuemax` · `aria-valuenow`(번호). 항목은 보조 기술에 숨깁니다 |

## Do / Don't

### ✅ Do

- 칸 표기와 같은 오전·오후 · 시 · 분 휠을 씁니다.
- 분 간격은 기본 1 로 두어 휠만으로 정확한 시각을 넣게 합니다.
- 날짜 칸 옆에 시각 칸을 나란히 둡니다.

### ❌ Don't

- 시각을 직접 입력하는 칸("HH:mm")으로 받지 않습니다.
- 24시간 휠을 쓰지 않습니다 — 칸은 "오후 3:00" 인데 휠이 "15 00" 이면 표기가 갈립니다.
- 휠을 굴리는 대로 칸의 값을 바꾸지 않습니다 — "완료" 로 넣습니다.

## Specification

[그림: Time Picker — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#time-picker)
