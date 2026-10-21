# Time Picker

> 시각을 고르는 12시간 휠 — 오전·오후 · 시 · 분. 시각 칸([Input Button](input-button.md))을 누르면 1280 미만은 아래 시트 · 이상은 칸 아래 팝오버로 열리고, "완료" 로 넣는다. 날짜와 함께 받으면 [Date Picker](date-picker.md) 의 날짜 칸 옆에 시각 칸을 나란히 둔다. 시각을 치는 칸은 두지 않는다.

구조는 당근 [SEED Time Picker](https://seed-design.io/components/time-picker)(Apache-2.0)를 따른다 — [Wheel Picker](wheel-picker.md) 위의 세 칼럼(오전·오후 → 시 → 분)과 가운데 띠. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). 옛 Time Picker(v72 — 치는 칸 · 24시간)를 대신한다.

수치 원본은 [`time-picker.yaml`](time-picker.yaml)이다. 휠의 크기 · 색 · 띠 · 안개는 [`wheel-picker.yaml`](wheel-picker.yaml)(medium · 5칸)을 따른다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다.

[그림: 일정 시작 시각 — 시트 · 팝오버, 라이트 · 다크](../../site/components/specs/time-picker.tsx#hero)

### 직접 골라 보기

분 간격 · 여는 자리를 고르면 스펙대로 그린 휠과 그 코드가 바뀐다. 실제로 휠을 굴리고 "완료" 로 칸에 넣을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/time-picker.tsx#playground)

## Anatomy

[그림: 휠은 오전·오후 · 시 · 분 세 칼럼과 가운데 띠](../../site/components/specs/time-picker.tsx#anatomy)

| ⓐ Period Column | 오전 · 오후 — 두 칸에서 멈춘다. |
| ⓑ Hour Column | 시 — 1 · 2 … 12, 오른쪽 정렬. 돌아간다. |
| ⓒ Minute Column | 분 — 2자리, 분 간격을 따른다. 돌아간다. |
| ⓓ Indicator | 선택 띠 — 세 칼럼을 가로지르는 가운데 한 줄. |

[표: 부위](time-picker.yaml#slots)

## Properties

### 칼럼

칼럼은 오전·오후 → 시 → 분(한국어 순서)이고, 시 · 분 글자 없이 숫자만 쓴다 — 단위는 칼럼 이름과 자리가 알린다("오후 3 00" = 오후 3시 00분). 시는 오른쪽에 맞춰 한 자리 · 두 자리 수의 끝을 맞춘다. 휠은 220(44 × 5), 글자 26 / 35 · 500 이다.

[그림: 칼럼 · 띠 · 안개](../../site/components/specs/time-picker.tsx#layout)

[표: 공통](time-picker.yaml#base.enabled)

### Minute Step

분 간격은 기본 5 이고, 자리에 따라 1 · 10 · 15 · 30 을 쓴다 — 넓을수록 빨리 고르고 좁을수록 정밀하다. 칼럼에는 그 간격의 분만 있다.

| 간격 | 쓰는 곳 |
|---|---|
| 1 | 분이 중요한 자리 — 방해 금지 시작 · 끝, 알림 |
| 5 | 기본 — 일정 · 거래 · 반복 실행 |
| 10 · 15 | 느슨한 시간대 · 15분 단위 예약 |
| 30 | 근무 · 일정 시간표(HR 일정) |

[표: 분 간격](time-picker.yaml#minuteStep)

## Guidelines

### 칸 표기와 같은 말

칸에는 "오후 3:00"(International Design v106 — 오전 · 오후 12시간, 초 없음)이 들어간다. 휠도 같은 말이라 24시간 휠을 두지 않는다. 값은 24시간({hour, minute})으로 다룬다.

### "완료" 로 넣는다

휠을 굴리는 동안 칸 값은 그대로다 — "완료" 를 누를 때 들어간다. 바깥 · 끌어내리기 · `Esc` 로 닫으면 버린다. 칸이 비었으면 지금 시각을 분 간격에 맞춰 반올림한 자리(9시 13분 → 9시 15분)를 짚어 열기만 한다.

### 시 · 분이 넘어갈 때

시 휠이 11 ↔ 12 를 넘으면 오전 · 오후가 따라 바뀐다(오전 11 → 오후 12). 분 휠은 55 → 00 을 넘어도 시는 그대로다(10시 55분 → 10시 00분).

### 날짜와 함께

날짜와 시각을 함께 받으면 날짜 칸 옆에 시각 칸을 나란히 둔다 — 하나만 바꾸기 쉽고, 종일이면 시각 칸만 걷는다. 시각 칸은 144(large 에서 "오후 12:30" 이 잘리지 않는 폭), 날짜 칸은 글이 다 들어가는 폭 이상이다 — 한 줄에 둘이 들어가지 않으면 시각 칸이 다음 줄로 내려간다 — 다른 해 날짜("2027년 1월 3일 (일)") · 큰 글자 설정 · 좁은 폰에서. 올해 날짜는 360 폭 폰에서 거의 꽉 차므로(가장 긴 "12월 28일 (월)" 이 1px 남는다) 글꼴에 따라 내려갈 수 있다 — 어느 쪽이든 칸 글은 자르지 않는다. 칸마다 Field 로 감싸면 폭 클래스는 Field 에 준다. 칸 글을 말줄임으로 자르지 않는다. 한 칸에 날짜 · 시각을 같이 넣지 않는다.

[그림: 일정 시작 · 종료 — 날짜 칸 + 시각 칸](../../site/components/specs/time-picker.tsx#datetime-guide)

## 코드

레시피 `recipes/shadcn/components/ui/time-picker.tsx` 를 [Input Button](input-button.md) 이 연 시트 · 팝오버 안에 둔다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 시각 — "완료" 로 넣는다

[그림: 일정 시작 시각 — 시트 · 팝오버](../../site/components/specs/time-picker.tsx#ex-time)

```tsx
import { Clock } from "lucide-react"
import { TimePicker, formatTimeValue, roundToStep } from "@/components/ui/time-picker"

<InputButton value={formatTimeValue(time)} placeholder="시간 선택" suffixIcon={<Clock />} onClick={() => { setDraft(time ?? roundToStep(new Date(), 5)); setOpen(true) }} />

<TimePicker minuteStep={5} value={draft} onValueChange={setDraft} />
<Button onClick={() => { setTime(draft); setOpen(false) }}>완료</Button>
```

### 날짜 + 시각 — 두 칸 나란히

[그림: 거래 날짜 · 시각](../../site/components/specs/time-picker.tsx#ex-datetime)

```tsx
{/* 한 줄에 다 들어가지 않으면 시각 칸이 다음 줄로 — 날짜 칸은 글이 다 들어가는 폭 이상 */}
<div className="flex flex-wrap gap-x2">
  <InputButton rootClassName="min-w-max flex-1" value={formatDateValue(date)} placeholder="날짜 선택" suffixIcon={<CalendarDays />} onClick={openDate} />
  <InputButton rootClassName="w-[144px] shrink-0" value={formatTimeValue(time)} placeholder="시간 선택" suffixIcon={<Clock />} onClick={openTime} />
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 굴리기 · 끌기 | 멈춘 뒤 가장 가까운 칸에 맞추고 값이 정해진다(wheel-picker.md) |
| 보이는 항목 누르기 | 그 항목을 가운데로 옮긴다 |
| 시 11 ↔ 12 | 오전 · 오후가 따라 바뀐다 |
| 분 55 → 00 | 시는 그대로다 |
| 오전 · 오후 바꾸기 | 시 · 분은 그대로, 12시간을 더하거나 뺀다 |
| 열 때 | 칸 값(비었으면 지금을 분 간격에 맞춰 반올림한 자리)이 가운데 — 초점은 시 칼럼으로 |

### 키보드

| 키 | 동작 |
|---|---|
| `↑` `↓` | 그 칼럼의 이전 · 다음 항목 |
| `Home` `End` | 처음 · 끝 항목(시는 1 · 12) — 시 칼럼은 오전 · 오후를 바꾸지 않는다(지나간 칸을 세지 않고 그 시로 간다. 화살표로 11 ↔ 12 를 넘을 때만 따라 바뀐다) |
| `Tab` | 다음 칼럼(오전·오후 → 시 → 분 → "완료") |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 고른 항목 `fg-neutral` 띠(`bg-neutral-weak`) 위 15.20 · 다크 10.32 ✓. 위아래 항목 `fg-disabled` 는 고를 값이 아닌 둘레 표시(안개로 흐려진다) — 고른 값은 띠 위 글자와 칸 값이 알린다 |
| **WCAG 2.1.1** Keyboard | 칼럼마다 `Tab` 자리 하나, `↑` `↓` 로 고른다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 항목 44 높이 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 항목 44 높이 ✓ · 폭은 칼럼 글자 폭 + 32(64 이상) ✓ |
| **ARIA** | 휠 `role="group"`(이름 = 칸 라벨, 예: "시작 시각"), 칼럼 `role="spinbutton"` + 이름 "오전/오후" · "시" · "분", `aria-valuetext` "오후" · "3" · "00", `aria-valuemin` · `aria-valuemax` · `aria-valuenow`(번호). 항목은 보조 기술에 숨긴다 |

## Do / Don't

### ✅ Do

- 칸 표기와 같은 오전·오후 · 시 · 분 휠.
- 분 간격은 기본 5, 분이 중요한 자리만 1.
- 날짜 칸 옆에 시각 칸을 나란히.

### ❌ Don't

- 시각을 치는 칸("HH:mm")으로 받기.
- 24시간 휠 — 칸은 "오후 3:00" 인데 휠이 "15 00" 이면 표기가 갈린다.
- 분 칼럼에 60칸을 기본으로 두기(일정 · 거래).
- 휠을 굴리는 대로 칸 값을 바꾸기 — "완료" 로 넣는다.

## Specification

[그림: Time Picker — YAML 규칙 전부](../../site/components/specs/spec-sheet.tsx#time-picker)

## SEED 와 다른 점

- **팝오버도 쓴다** — 1280 이상은 칸 아래 팝오버(Input Button 결정). SEED React 예제는 시트 · 바로 펼침뿐이다(디자인 문서에는 팝오버가 있다).
- **열 때 초점은 시 칼럼** — SEED 예제는 시트 상자에 둔다.
- **색은 groo 역할 짝** — 띠 `bg-neutral-weak`, 고른 글자 `fg-neutral`, 둘레 글자 `fg-disabled`(SEED 와 같은 역할).

## Migration notes

### 2026-10-21 — 시 칼럼의 Home · End(03-C 3A)

오후 3 에서 `End` 가 "오전 12" 로 뒤집혔다 — 끝 항목 12 까지 휠이 지나간 칸 수(stepDelta)만큼 시를 더해서다. 사용자가 "오전 · 오후는 그대로, 1 · 12 로" 를 골랐다(2026-10-21 사용자 결정 — 03-C 3A, https://claude.ai/artifact/3nWUZCYpPh2Cg3uXc3DKtp). 레시피 Wheel Picker 가 `onValueChange` 에 `jump`(Home · End)를 싣고, Time Picker 는 jump 면 고른 값으로 시를 정한다. 앱 `p_wheel_picker.dart` · `p_time_picker.dart` 도 같다. 거절: 지금 그대로 · Home · End 받지 않음 · Home = 12 · End = 11.

### 2026-10-03 — SEED Time Picker 로 새로 둔다(옛 v72 Time Picker 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/9bPrBNHaYc7gRPweKRadUw)에서 정했다 — SEED Time Picker(12시간 · 오전·오후 → 시 → 분 · 44 × 5 · 26px), 분 간격은 기본 5 · 자리마다 1 · 10 · 15 · 30, 날짜와 시각은 두 칸 나란히. 옛 Time Picker(DESIGN.md v72 — `<input type="time">` · "14:30" 24시간)는 걷었다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — `InputTimePicker` 6곳(치는 칸 + 팝오버 목록 2칼럼 · 5분). 시를 누르면 열린 채, 분을 누르면 닫힌다. 열면 초점이 "00" 이고 화살표가 안 된다. 덜 친 값("25:9")을 그대로 넘긴다. 방해 금지 칸은 키마다 저장한다.
- **Desk 앱** — `PTimeInput` 6곳(iOS 휠 · 1분 · [취소][확인]).
- **HR 웹** — `InputTimePicker` 2곳(셀렉트 2개 · 분 60개 · "확인", 셀렉트 이름 없음, `Esc` 뒤 고르던 값이 남는다), 일정 시 8 ~ 18 · 분 0/30 셀렉트.
- 셋 다 24시간이다 — v106 표기(오전 · 오후)는 아직 어디에도 없다.
