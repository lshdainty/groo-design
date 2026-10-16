# Input OTP

> 메일 · 문자로 받은 일회용 인증 코드(지금은 숫자 6자리)를 넣는 칸 — [Input](input.md) 한 칸이다. 칸을 자릿수만큼 나누지 않는다. 칸 아래 다시 받기 단추가 남은 초를 보이고, 설명 줄이 유효 시간 · 틀릴 수 있는 횟수를 늘 알린다.

SEED 에는 이 컴포넌트가 없다 — Text Input 문서가 "주민등록번호나 전화번호처럼 입력 형식이 정해진 경우, Input을 나누지 말고 값에 포맷을 자동으로 적용해서 추가 인터랙션 없이 한 번에 입력할 수 있도록 해주세요." 라고 적었고, `one-time-code` · `inputmode` · 붙여넣기 · 다시 받기 규칙은 출처에 없다(당근 SEED, Apache-2.0). porest 는 코드 칸을 Input 한 칸으로 두고(2026-10-09 사용자 결정) 숫자만 뽑기 · 자동 채우기 · 다시 받기 · 설명 줄을 정했다. 파일 이름(`input-otp`)은 그대로 두고, 옛 스펙의 칸 6 × 40(숨은 입력 하나)과 DESIGN.md v69 의 "칸마다 입력" 을 대신한다.

수치 원본은 [`input-otp.yaml`](input-otp.yaml)이고, 칸의 상자 · 글자 · 상태는 [`input.yaml`](input.yaml), 라벨 · 설명 · 오류는 [`field.yaml`](field.yaml)이 원본이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 이용 해지 > 본인 확인 — 인증 코드 칸 · 설명 · 다시 받기(52초), 라이트 · 다크](../../site/components/specs/input-otp.tsx#hero)

### 직접 골라 보기

크기(large · medium) · 상태(포커스 · 오류 · 막힘) · 다시 받기의 때(처음 · 남은 초 · 다시 받기)를 고르면 스펙대로 그린 칸과 그 코드가 바뀐다. 칸에 "123 456" · "인증 코드: 123456" 을 붙여 보면 숫자만 남고, 시계를 빨리 돌리면 다시 받기가 풀린다.

[그림: 플레이그라운드](../../site/components/specs/input-otp.tsx#playground)

## Anatomy

[그림: 라벨 · 코드 칸 · 설명 줄 · 다시 받기 단추](../../site/components/specs/input-otp.tsx#anatomy)

| ⓐ Label | 칸 이름 — [Field](field.md) 의 라벨 "인증 코드". |
| ⓑ Field | 코드 칸 — Input 상자형 한 칸, 숫자만. |
| ⓒ Description | 설명 줄 — "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." 늘 보인다. 오류가 나면 오류 글이 대신한다. |
| ⓓ Resend | 다시 받기 — 칸 아래 왼쪽, 보낸 뒤 60초 동안 남은 초를 붙이고 막힌다. |

[표: 부위](input-otp.yaml#slots)

## Properties

### 한 칸

코드 칸은 [Input](input.md) 상자형 한 칸이다 — `large` 52(폰 · 앱) · `medium` 40(1280 이상 데스크톱 웹), 웹의 기본은 `responsive`. 상자 · 글자 · 포커스 · 오류 · 막힘은 Input 그대로이고, 숫자는 고정폭 숫자(`tabular-nums`)로 다른 칸처럼 왼쪽에 쓴다 — 고정폭 글꼴 · 글자 사이 띄움 · 가운데 맞춤을 두지 않는다. 자릿수는 placeholder("6자리 숫자")가 알린다.

[그림: 크기 — large 52(폰 · 앱) · medium 40(1280 이상 데스크톱 웹)](../../site/components/specs/input-otp.tsx#size)

[표: 크기](input-otp.yaml#size)

[표: 칸](input-otp.yaml#base.enabled@field)

### 숫자만 받는다

치기 · 붙여넣기 · 자동 채우기 모두 글에서 숫자만 뽑아 앞 6자리를 쓴다 — "123 456" · "123-456" · " 123456" · "인증 코드: 123456" 이 모두 123456 이 된다. 붙인 글의 숫자가 6자리 이상이면 칸의 값을 그 코드로 바꾸고(칸에 "12" 가 있어도 "인증 코드: 654321" → 654321), 그보다 짧으면 커서 자리에 넣고 숫자만 남긴다. 전각 숫자(１２３)는 보통 숫자로 바꾼다(NFKC). `maxLength` 를 걸지 않는다 — 브라우저가 먼저 자르면 붙인 글의 숫자를 잃는다(지금 웹 "123 456" → "12345"). 숫자 키보드(`inputmode="numeric"`)를 띄우고, 받은 코드를 키보드 위에 제안하도록 `autocomplete="one-time-code"`(앱 `AutofillHints.oneTimeCode`)를 둔다. 코드가 메일로 오면 OS 가 제안하지 않을 수 있어 붙여넣기가 늘 되는 길이다.

[그림: 붙여넣기 — "123 456" · "인증 코드: 123456" 이 123456 으로](../../site/components/specs/input-otp.tsx#paste)

[표: 입력](input-otp.yaml#base.enabled@value)

### 다시 받기

칸 아래 12 에 [Button](button.md) `neutralWeak` · medium(40)을 왼쪽에 둔다. 보내기 전에는 "코드 받기", 보낸 뒤 60초 동안은 "다시 받기(52초)" 처럼 남은 초를 붙이고 막는다(전용 색 — 흐리게 하지 않는다), 60초가 지나면 "다시 받기" 다(사용자 결정 11B — 서버의 다시 받기 60초). 칸 옆에 두지 않는다 — 칸(52 · 40)과 단추 높이가 맞지 않는다. 코드를 보내면 초점을 칸으로 옮긴다 — 막히는 단추에 초점이 남아 본문으로 빠지지 않게.

[그림: 다시 받기 — 코드 받기 · 다시 받기(52초) 막힘 · 다시 받기](../../site/components/specs/input-otp.tsx#resend)

[표: 다시 받기의 때](input-otp.yaml#resend)

[표: 다시 받기](input-otp.yaml#base.enabled@resend)

### 설명 줄

설명은 늘 "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." 다 — 서버 규칙(유효 10분 · 5번 틀리면 다시 받기)이 메일에만 있고 화면에는 없던 것을 칸 아래에 둔다(사용자 결정 11B). 남은 시간을 시계로 세지 않는다. 서버 규칙이 바뀌면 이 글도 바꾼다. 틀렸을 때는 [Field](field.md) 의 규칙대로 오류 글이 이 줄을 대신하고, 칸을 고치기 시작하면 돌아온다(사용자 결정 2026-10-09 18A — 오류 글과 설명 줄을 함께 보이는 예외는 고르지 않았다).

[표: 설명](input-otp.yaml#base.enabled@description)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak`(Input) |
| `focused` | 안쪽 2px `stroke-neutral-contrast` — 마우스 · 터치로 눌러도 |
| `invalid` | 안쪽 2px `stroke-critical-solid` · 오류 글이 설명 줄을 대신한다(Field) |
| `disabled` | 바탕 `bg-disabled` · 글자 `fg-disabled` — 흐리게 하지 않는다 |

[그림: 상태 — 기본 · 포커스 · 오류 · 막힘](../../site/components/specs/input-otp.tsx#states)

[표: 상태](input-otp.yaml#matrix)

## Guidelines

### 칸을 나누지 않는다

코드를 자릿수만큼 칸으로 나누지 않는다 — 한 칸이라 붙여넣기 · 지우기 · 고치기가 보통 글 칸처럼 되고, 칸 크기 · 포커스 · 막힘 규칙을 따로 지킬 일이 없다(사용자 결정 10A — SEED Text Input 의 "Input을 나누지 말고"). 6칸 모양을 한 칸 위에 그리지도 않는다.

[그림: 한 칸 — 붙여넣기 · 지우기가 글 칸처럼 · 6칸으로 나눈 칸(쓰지 않는다)](../../site/components/specs/input-otp.tsx#split-guide)

### 저절로 보내지 않는다

6자리를 채워도 바로 확인하지 않는다 — 확인 단추를 누른다. 확인 단추는 켜 두고, 6자리가 안 되면 누를 때 오류("인증 코드 6자리를 입력해주세요.")로 알린다([Field](field.md) 의 "제출과 검증").

### 오류는 칸 아래

틀린 코드 · 지난 코드는 Field 의 오류로 칸 아래에 알린다(`aria-invalid` · `aria-describedby` · 알림 — 기초 Inclusive Design). 서버가 보낸 글을 그대로 보이지 않고 화면 글로 바꾼다 — 무엇이 안 됐는지와 할 일("코드가 맞지 않거나 시간이 지났어요. 확인하거나 다시 받아주세요."). 다시 받기는 60초 동안 막혀 있으므로 "코드를 방금 보냈어요" 오류는 생기지 않는다.

[그림: 오류 — 칸 2px 빨강 · 오류 글이 설명을 대신 · 다시 받기는 그대로](../../site/components/specs/input-otp.tsx#error-guide)

### 글

라벨은 "인증 코드" — 띄어 쓴 한 꼴로(서버 글 "인증코드" 도 화면에서는 "인증 코드"). placeholder 는 "6자리 숫자", 단추는 "코드 받기" · "다시 받기" · "다시 받기(52초)" — 괄호는 앞 글자에 붙인다(International Design). 보냈다는 알림은 [Snackbar](snackbar.md) "메일로 코드를 보냈어요." 다.

## 코드

레시피 `recipes/shadcn/components/ui/input-otp.tsx` 를 [Field](field.md) 안에 둔다 — 칸은 레시피 `input.tsx`(Input) 위에 짠다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `InputOTP` — 코드 칸. Input 의 속성(`size` · `disabled` · `id` · `placeholder` …)에 `value` · `defaultValue`(숫자 글) · `onValueChange(value)`(숫자만 · 최대 `length` 자 — 붙여넣기도 이 값으로) · `length`(기본 6)를 받는다. `inputMode="numeric"` · `autoComplete="one-time-code"` · `placeholder="6자리 숫자"`(기본) · 고정폭 숫자를 스스로 건다 — `type` · `maxLength` · `inputMode` · `autoComplete` · `onChange` 는 받지 않는다. Field 안이면 라벨 · 설명 · 오류 · 막힘을 Input 처럼 받는다.
- `InputOTPResend` — 다시 받기 단추(Button `neutralWeak` medium). `sentAt`(마지막으로 보낸 때 — `Date.now()` 의 수, 아직 안 보냈으면 `null`) · `onResend()` · `cooldownSeconds`(기본 60) · `codeInputId`(보낸 뒤 초점을 옮길 코드 칸의 id) · `className`. `null` 이면 "코드 받기", 보낸 뒤 `cooldownSeconds` 안이면 "다시 받기({n}초)" + 막힘, 지나면 "다시 받기" — 남은 초는 단추가 스스로 센다. 누르는 즉시 초점이 코드 칸으로 가고, `onResend` 가 Promise 를 돌려주면 끝날 때까지 다시 누를 수 없다. Button 의 속성(`disabled` …)을 받는다.

### 본인 확인 — 메일로 코드 받기

[그림: 이용 해지 본인 확인 — 코드 칸 · 설명 · 다시 받기(52초) · 확인](../../site/components/specs/input-otp.tsx#ex-basic)

```tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputOTP, InputOTPResend } from "@/components/ui/input-otp"

const [code, setCode] = useState("")
const [sentAt, setSentAt] = useState<number | null>(null)
const [error, setError] = useState<string | null>(null)

<Field label="인증 코드" description="10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." invalid={error !== null} errorMessage={error}>
  <InputOTP
    id="withdraw-code"
    value={code}
    onValueChange={(value) => {
      setCode(value)
      setError(null) // 고치기 시작하면 설명 줄로 돌아온다
    }}
  />
</Field>
<InputOTPResend className="mt-x3" sentAt={sentAt} codeInputId="withdraw-code" onResend={() => sendCode().then(() => setSentAt(Date.now()))} />
<Button size="large" onClick={confirm}>확인</Button>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 치기 | 숫자만 들어간다 — 6자리에서 멈춘다 |
| 붙여넣기 · 자동 채우기 | 붙인 글에서 숫자만 뽑아 앞 6자리 — "인증 코드: 123456" → 123456 |
| 6자리를 채움 | 아무것도 보내지 않는다 — 확인 단추를 누른다 |
| "코드 받기" · "다시 받기" | 코드를 보내고 초점을 칸으로 옮긴다. 단추는 60초 동안 "다시 받기({n}초)" 로 막힌다 · 보냈다고 Snackbar |
| 남은 초 | 1초마다 줄고, 0 이 되면 "다시 받기" 로 풀린다 |
| 확인 — 6자리가 안 됨 | Field 오류 "인증 코드 6자리를 입력해주세요." · 초점은 칸으로 |
| 확인 — 틀림 · 지남 | Field 오류(칸 2px 빨강 · 오류 글이 설명 줄을 대신) · 화면 읽기 프로그램에 한 번 알린다 |
| 칸 고치기 | 오류를 지우고 설명 줄로 돌아온다 |
| Disabled | 포커스 · 입력 불가(Input) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | Input · Field 의 검증 그대로 — 값 `fg-neutral` 16.41 · 13.42, placeholder · 설명 `fg-placeholder` · `fg-neutral-subtle` 5.50 · 6.09(시트 다크 5.27), 오류 `fg-critical` 5.06 · 6.08 ✓. 다시 받기 글 `fg-neutral` · `bg-neutral-weak` 위 15.20 · 10.32 ✓ — 막힌 동안 `fg-disabled` 는 기준 밖 |
| **WCAG 1.3.5** Identify input purpose | `autocomplete="one-time-code"` ✓ |
| **WCAG 3.3.1** Error identification | 틀린 코드를 글로 알리고 칸에 `aria-invalid` ✓ |
| **WCAG 2.2.1** Timing adjustable | 유효 시간(10분)을 설명 줄로 미리 알리고, 지나면 다시 받을 수 있다 ✓ |
| **WCAG 2.4.3** Focus order | 보낸 뒤 초점을 칸으로 — 막힌 단추에 남지 않는다 ✓ |
| **WCAG 4.1.3** Status messages | 오류는 Field 의 알림 자리(polite), 보냈다는 알림은 Snackbar(`role="status"`) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 52 · 40 · 단추 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 large 52 ✓ · medium 40 ⚠(1280 이상 데스크톱 웹만 — Input 과 같다). 단추는 누르는 영역 44 ✓ |
| **ARIA** | `<input type="text" inputmode="numeric" autocomplete="one-time-code">` 하나 — 이름은 Field 라벨(`<label for>`), 설명 · 오류는 `aria-describedby`. 다시 받기의 남은 초는 단추 이름에 들어 있어 초점이 오면 읽힌다(1초마다 알리지 않는다) |

## Do / Don't

### ✅ Do

- Input 한 칸으로 받는다 — 라벨 "인증 코드" · placeholder "6자리 숫자".
- 붙여넣기 · 자동 채우기에서 숫자만 뽑는다 · `one-time-code` · 숫자 키보드.
- 다시 받기 단추에 남은 초를 붙이고 그동안 막는다 — 보내면 초점을 칸으로.
- 유효 시간 · 틀릴 수 있는 횟수를 설명 줄에 늘 둔다.
- 오류는 Field 로 칸 아래에, 화면 글로.

### ❌ Don't

- 칸을 자릿수만큼 나누기 · 6칸 모양을 그리기.
- `maxLength` 로 먼저 자르기.
- 6자리를 채우면 저절로 확인하기.
- 10:00 시계로 남은 시간을 세기 · 아무 표시 없이 두기.
- 서버가 보낸 글을 그대로 보이기.
- 칸 옆에 높이가 다른 단추 두기.

## Specification

`input-otp.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 인증 코드 칸을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다. 칸의 나머지 값은 `input.yaml`, 라벨 · 설명 · 오류는 `field.yaml` 이다.

[그림: Specification — input-otp.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input-otp)

## SEED 와 다른 점

- **porest 가 정한 컴포넌트다** — SEED 에는 OTP 부품이 없다(Figma 에 비공개 PIN Field 가 상태만 있다). 칸은 SEED Text Input 그대로이고 "Input을 나누지 말고" 를 따랐다.
- **숫자만 뽑기 · `one-time-code` · 숫자 키보드 · 다시 받기 · 설명 줄** — SEED 에 규칙이 없다(문서 · 예제 · 코드에 `inputMode` · `one-time-code` 0회). SEED 에서 가장 가까운 것은 `maxGraphemeCount` 로 글자 수를 세는 예("6글자까지 입력 가능합니다")다.

## Migration notes

### 2026-10-09 — Input 한 칸으로 다시 쓴다

사용자가 [입력 비교 페이지](https://claude.ai/artifact/CwVJDATSmLtwQoH67wh1zj)에서 정했다 — 한 칸(10A — SEED "Input을 나누지 말고 … 한 번에", Text Field large 52 · medium 40, 붙여넣기는 숫자만 뽑는다), 다시 받기 단추에 남은 초 + 칸 아래 늘 설명 줄(11B — "다시 받기(60초)" 동안 막힘). 그리고 "따라오는 것" — 숫자만 뽑기 · `one-time-code` · `inputmode="numeric"` · Field 오류 연결 · 자동 확인 없음 · "인증 코드" 띄어쓰기 한 꼴 · 단추 높이는 칸에 맞춘다(칸 아래로 옮겨 맞출 일을 없앴다). 6칸(10B) · 6칸 모양 + 한 입력(10C) · 표시 없음(11A) · 10:00 시계(11C)는 고르지 않았다. 스펙을 쓰다 나온 것(같은 비교 페이지 18) — 틀리면 오류 글이 설명 줄을 대신하고 칸을 고치기 시작하면 돌아온다(18A — Field 규칙 그대로). 오류 글과 설명 줄을 함께 보이는 예외(18B)는 고르지 않았다. 설명 줄은 Writing v106 대로 보조 용언을 붙이고 마침표를 찍었다("입력해주세요 · … 받아요."). 옛 스펙은 `input-otp.history/v-pre-seed-input.*` 에 남겼다.

| 옛 Input OTP | 새 Input OTP |
|---|---|
| 칸 6 × 40 · 사이 4 · 18 / 600 고정폭 글꼴 · 숨은 입력 하나(DESIGN v69 는 칸마다 입력 · `maxlength="1"`) | Input 한 칸 — large 52 · medium 40 · 고정폭 숫자 |
| 빈 칸 `surface-input` · 찬 칸 `surface-default` · 포커스 바깥 2px `border-focus` | 투명 바탕 · 안쪽 1px · 포커스 안쪽 2px `stroke-neutral-contrast`(Input) |
| 오류 `error` 테두리 + 30% 링 · "코드가 올바르지 않습니다. 다시 입력해주세요." | 안쪽 2px `stroke-critical-solid` + Field 오류 · 해요체 |
| 막힘 불투명도 0.5 | `bg-disabled` · `fg-disabled` |
| 3-3 구분 줄 · 만료 카운트다운 Do | 구분 없음 · 설명 줄(10분 · 5번) + 다시 받기 남은 초 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — Desk 웹은 크로미움에서 진짜 클립보드로 붙여 봤고, Desk 앱 · 서버는 코드로 봤다). 코드 칸은 Desk 이용 해지의 본인 확인 하나다 — "비밀번호가 없으신가요? 메일로 코드 받기". 옛 스펙의 6칸 부품은 네 제품 어디서도 쓰지 않는다(웹은 스펙 JSON `shared/ds/spec/input-otp.json` 만). HR 에는 없고, SSO 는 비밀번호 찾기가 임시 비밀번호 메일 · 가입이 초대 링크라 코드 칸이 없다. Desk 2단계 인증은 걷혔다.

- **붙여넣기가 숫자를 잃는다** — 웹(`features/user/ui/WithdrawDialog.tsx:295-301`)은 `maxLength={6}` 을 브라우저가 먼저 적용하고 그 뒤에 숫자만 남겨 "123 456" · "123-456" · " 123456" → "12345", "인증 코드: 123456" → "" 다(D5). 메일에는 코드가 28 / 700 · 자간 6 한 덩어리로 찍힌다(`porest-sso-back` `EmailServiceImpl.java:117-126`). 앱(`features/settings/presentation/withdrawal_sheet.dart:427-470`)은 `numbersOnly` 가 길이 제한보다 먼저라 붙여넣기가 맞다(`shared/widgets/p_text_input.dart:108-117`).
- **시간 · 다시 받기 · 시도 표시 0** — 서버는 유효 10분 · 5번 틀리면 다시 받기 · 다시 받기 60초(`ReauthServiceImpl.java:41-46 · 69-75`)인데 화면에는 아무것도 없고, 60초 안에 다시 받으면 서버 글 "코드를 방금 보냈어요. 잠시 뒤에 다시 받아 주세요" 가 칸 아래 빨갛게 뜬다(D15). `one-time-code` 0 · 오류의 `aria-invalid` · `aria-describedby` · 알림 0(웹), 앱 `autofillHints` 0.
- **칸 40 옆 단추 36** — 웹 "코드 받기 · 다시 받기" 83 × 36 이 칸 40 옆이다(`WithdrawDialog.tsx:293-312`, D27). 칸 아래 Button medium 40 으로.
- **글** — 화면 "인증 코드" ↔ 서버 "인증코드"(`messages_ko.properties:18-21` — 합쇼 · 해요가 섞인 서버 글 셋). 화면 글은 "인증 코드" · 해요체로.
- **6자리 전 확인 막힘** — 웹 "해지하기" 가 6자리 전에는 꺼져 있다. Field 규칙대로 켜 두고 누를 때 알린다.
