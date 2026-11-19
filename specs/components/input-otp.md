# Input OTP

> 메일 · 문자로 받은 일회용 인증 코드(숫자 6자리)를 넣는 칸으로, [Input](input.md) 한 칸입니다. 칸을 자릿수만큼 나누지 않습니다. 칸 아래의 다시 받기 버튼이 남은 초를 보이고, 설명 줄이 유효 시간과 틀릴 수 있는 횟수를 언제나 알립니다.

수치 원본은 [`input-otp.yaml`](input-otp.yaml)이고, 칸의 상자 · 글자 · 상태는 [`input.yaml`](input.yaml), 라벨 · 설명 · 오류는 [`field.yaml`](field.yaml)이 원본입니다.

[그림: 이용 해지 > 본인 확인 — 인증 코드 칸 · 설명 · 다시 받기(52초), 라이트 · 다크](../../site/components/specs/input-otp.tsx#hero)

### 직접 골라 보기

크기(large · medium) · 상태(포커스 · 오류 · 막힘) · 다시 받기의 때(처음 · 남은 초 · 다시 받기)를 바꾸면 칸과 코드가 함께 바뀝니다. 칸에 "123 456" · "인증 코드: 123456" 을 붙여 보면 숫자만 남고, 시계를 빨리 돌리면 다시 받기가 풀립니다.

[그림: 플레이그라운드](../../site/components/specs/input-otp.tsx#playground)

## Anatomy

[그림: 라벨 · 코드 칸 · 설명 줄 · 다시 받기 단추](../../site/components/specs/input-otp.tsx#anatomy)

| ⓐ Label | 칸 이름 — [Field](field.md) 의 라벨 "인증 코드" 입니다. |
| ⓑ Field | 코드 칸 — Input 상자형 한 칸이고, 숫자만 받습니다. |
| ⓒ Description | 설명 줄 — "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." 를 언제나 보입니다. 오류가 나면 오류 글이 대신합니다. |
| ⓓ Resend | 다시 받기 — 칸 아래 왼쪽에 둡니다. 보낸 뒤 60초 동안 남은 초를 붙이고 막힙니다. |

메일로 보내는 코드는 예외로 다시 받기 아래에 스팸함 안내 한 줄을 둘 수 있습니다 — 아래 "설명 줄" 을 봅니다.

[표: 부위](input-otp.yaml#slots)

## Properties

### 한 칸

코드 칸은 [Input](input.md) 상자형 한 칸입니다 — `large` 52(폰 · 앱) · `medium` 40(1280 이상 데스크톱 웹)이고, 웹의 기본은 `responsive` 입니다. 상자 · 글자 · 포커스 · 오류 · 막힘은 Input 그대로입니다. 다만 막힌 칸의 자리 글은 `fg-placeholder` 그대로 둡니다 — Input · Textarea 는 막히면 자리 글도 `fg-disabled` 이지만, 코드 칸은 막혀도 "6자리 숫자" 를 켜진 칸과 같은 색으로 두고, 막힌 칸은 바탕(`bg-disabled`) · 커서로 가릅니다. 다크에서는 두 색이 같은 값(#838997)이라 차이가 없고, 라이트에서만 4.18 ↔ 3.16 으로 갈립니다.

숫자는 고정폭 숫자(`tabular-nums`)로 다른 칸처럼 왼쪽에 씁니다 — 고정폭 글꼴 · 글자 사이 띄움 · 가운데 맞춤을 두지 않습니다. 자릿수는 placeholder("6자리 숫자")가 알립니다.

[그림: 크기 — large 52(폰 · 앱) · medium 40(1280 이상 데스크톱 웹)](../../site/components/specs/input-otp.tsx#size)

[표: 크기](input-otp.yaml#size)

[표: 칸](input-otp.yaml#base.enabled@field)

### 숫자만 받습니다

입력 · 붙여넣기 · 자동 채우기 모두 글에서 숫자만 뽑아 앞 6자리를 씁니다 — "123 456" · "123-456" · " 123456" · "인증 코드: 123456" 이 모두 123456 이 됩니다. 붙인 글의 숫자가 6자리 이상이면 칸의 값을 그 코드로 바꾸고(칸에 "12" 가 있어도 "인증 코드: 654321" → 654321), 그보다 짧으면 커서 자리에 넣고 숫자만 남깁니다. 전각 숫자(１２３)는 보통 숫자로 바꿉니다(NFKC). `maxLength` 를 걸지 않습니다 — 브라우저가 먼저 자르면 붙인 글의 숫자를 잃기 때문입니다("123 456" → "12345"). 숫자 키보드(`inputmode="numeric"`)를 띄우고, 받은 코드를 키보드 위에 제안하도록 `autocomplete="one-time-code"`(앱 `AutofillHints.oneTimeCode`)를 둡니다. 코드가 메일로 오면 OS 가 제안하지 않을 수 있어, 붙여넣기가 언제나 되는 길입니다.

[그림: 붙여넣기 — "123 456" · "인증 코드: 123456" 이 123456 으로](../../site/components/specs/input-otp.tsx#paste)

[표: 입력](input-otp.yaml#base.enabled@value)

### 다시 받기

칸 아래 12 에 [Button](button.md) `neutralWeak` · medium(40)을 왼쪽에 둡니다. 보내기 전에는 "코드 받기", 보낸 뒤 60초 동안은 "다시 받기(52초)" 처럼 남은 초를 붙이고 막습니다(전용 색 — 흐리게 하지 않습니다). 60초가 지나면 "다시 받기" 입니다. 60초는 서버의 다시 받기 간격과 같습니다. 칸 옆에 두지 않습니다 — 칸(52 · 40)과 버튼 높이가 맞지 않기 때문입니다. 코드를 보내면 초점을 칸으로 옮깁니다 — 막히는 버튼에 초점이 남아 본문으로 빠지지 않게 합니다.

[그림: 다시 받기 — 코드 받기 · 다시 받기(52초) 막힘 · 다시 받기](../../site/components/specs/input-otp.tsx#resend)

[표: 다시 받기의 때](input-otp.yaml#resend)

[표: 다시 받기](input-otp.yaml#base.enabled@resend)

### 설명 줄

설명은 언제나 "10분 안에 입력해주세요 · 5번 틀리면 다시 받아요." 입니다 — 서버 규칙(유효 10분 · 5번 틀리면 다시 받기)을 칸 아래에서 알립니다. 남은 시간을 시계로 세지 않습니다. 서버 규칙이 바뀌면 이 글도 바꿉니다. 틀렸을 때는 [Field](field.md) 의 규칙대로 오류 글이 이 줄을 대신하고, 칸을 고치기 시작하면 설명 줄이 돌아옵니다. 오류 글과 설명 줄을 함께 보이지 않습니다.

메일로 보내는 코드는 [코드 받기] 아래에 스팸함 안내 한 줄("메일함에 코드가 안 보이면 스팸함도 확인해주세요.")을 둘 수 있습니다 — 설명 줄과 같은 글자 · 색이고, 코드를 보낸 뒤에만 보입니다. 설명 줄은 하나이고 유효 시간 · 횟수 글이 차지하기 때문입니다.

[표: 설명](input-otp.yaml#base.enabled@description)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak`(Input) |
| `focused` | 안쪽 2px `stroke-neutral-contrast` — 마우스 · 터치로 눌러도 |
| `invalid` | 안쪽 2px `stroke-critical-solid` · 오류 글이 설명 줄을 대신합니다(Field) |
| `disabled` | 바탕 `bg-disabled` · 글자 `fg-disabled` — 흐리게 하지 않습니다 |

[그림: 상태 — 기본 · 포커스 · 오류 · 막힘](../../site/components/specs/input-otp.tsx#states)

[표: 상태](input-otp.yaml#matrix)

## Guidelines

### 칸을 나누지 않습니다

코드를 자릿수만큼 칸으로 나누지 않습니다 — 한 칸이라 붙여넣기 · 지우기 · 고치기가 보통 글 칸처럼 되고, 칸 크기 · 포커스 · 막힘 규칙을 따로 지킬 일이 없습니다. 6칸 모양을 한 칸 위에 그리지도 않습니다.

[그림: 한 칸 — 붙여넣기 · 지우기가 글 칸처럼 · 6칸으로 나눈 칸(쓰지 않는다)](../../site/components/specs/input-otp.tsx#split-guide)

### 저절로 보내지 않습니다

6자리를 채워도 바로 확인하지 않습니다 — 확인 버튼을 누릅니다. 확인 버튼은 켜 두고, 6자리가 안 되면 누를 때 오류("인증 코드 6자리를 입력해주세요.")로 알립니다([Field](field.md) 의 "제출과 검증").

### 오류는 칸 아래

틀린 코드 · 지난 코드는 Field 의 오류로 칸 아래에 알립니다(`aria-invalid` · `aria-describedby` · 알림 — 기초 Inclusive Design). 서버가 보낸 글을 그대로 보이지 않고 화면 글로 바꿉니다 — 무엇이 안 됐는지와 할 일("코드가 맞지 않거나 시간이 지났어요. 확인하거나 다시 받아주세요.")을 적습니다. 다시 받기는 60초 동안 막혀 있으므로 "코드를 방금 보냈어요" 오류는 생기지 않습니다.

[그림: 오류 — 칸 2px 빨강 · 오류 글이 설명을 대신 · 다시 받기는 그대로](../../site/components/specs/input-otp.tsx#error-guide)

### 글

라벨은 "인증 코드" 로 띄어 쓴 한 꼴입니다(서버 글 "인증코드" 도 화면에서는 "인증 코드"). placeholder 는 "6자리 숫자", 버튼은 "코드 받기" · "다시 받기" · "다시 받기(52초)" 이고, 괄호는 앞 글자에 붙입니다(International Design). 보냈다는 알림은 [Snackbar](snackbar.md) "메일로 코드를 보냈어요." 입니다.

## 코드

레시피 `recipes/shadcn/components/ui/input-otp.tsx` 를 [Field](field.md) 안에 둡니다 — 칸은 레시피 `input.tsx`(Input) 위에 짭니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `InputOTP` — 코드 칸입니다. Input 의 속성(`size` · `disabled` · `id` · `placeholder` …)에 `value` · `defaultValue`(숫자 글) · `onValueChange(value)`(숫자만 · 최대 `length` 자 — 붙여넣기도 이 값으로) · `length`(기본 6)를 받습니다. `inputMode="numeric"` · `autoComplete="one-time-code"` · `placeholder="6자리 숫자"`(기본) · 고정폭 숫자를 스스로 겁니다 — `type` · `maxLength` · `inputMode` · `autoComplete` · `onChange` 는 받지 않습니다. 막힌 칸의 자리 글은 입력에 `placeholder:text-fg-placeholder` 를 덧붙여 Input 의 막힘 색을 덮습니다. Field 안이면 라벨 · 설명 · 오류 · 막힘을 Input 처럼 받습니다.
- `InputOTPResend` — 다시 받기 버튼(Button `neutralWeak` medium)입니다. `sentAt`(마지막으로 보낸 때 — `Date.now()` 의 수, 아직 안 보냈으면 `null`) · `onResend()` · `cooldownSeconds`(기본 60) · `codeInputId`(보낸 뒤 초점을 옮길 코드 칸의 id) · `className` 을 받습니다. `null` 이면 "코드 받기", 보낸 뒤 `cooldownSeconds` 안이면 "다시 받기({n}초)" + 막힘, 지나면 "다시 받기" 입니다 — 남은 초는 버튼이 스스로 셉니다. 누르는 즉시 초점이 코드 칸으로 가고, `onResend` 가 Promise 를 돌려주면 끝날 때까지 다시 누를 수 없습니다. Button 의 속성(`disabled` …)을 받습니다.

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
| 입력 | 숫자만 들어갑니다 — 6자리에서 멈춥니다 |
| 붙여넣기 · 자동 채우기 | 붙인 글에서 숫자만 뽑아 앞 6자리 — "인증 코드: 123456" → 123456 |
| 6자리를 채움 | 아무것도 보내지 않습니다 — 확인 버튼을 누릅니다 |
| "코드 받기" · "다시 받기" | 코드를 보내고 초점을 칸으로 옮깁니다. 버튼은 60초 동안 "다시 받기({n}초)" 로 막히고, 보냈다고 Snackbar 로 알립니다 |
| 남은 초 | 1초마다 줄고, 0 이 되면 "다시 받기" 로 풀립니다 |
| 확인 — 6자리가 안 됨 | Field 오류 "인증 코드 6자리를 입력해주세요." · 초점은 칸으로 |
| 확인 — 틀림 · 지남 | Field 오류(칸 2px 빨강 · 오류 글이 설명 줄을 대신) · 화면 읽기 프로그램에 한 번 알립니다 |
| 칸 고치기 | 오류를 지우고 설명 줄로 돌아옵니다 |
| 글자 크기 설정 | 값 · placeholder · 설명 · 오류 · 버튼 글은 글자 크기 설정을 따라 커지고, 칸 · 버튼 높이가 따라 늘어납니다. 칸은 한 줄을 지킵니다(Input). |
| Disabled | 포커스 · 입력 불가(Input) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | Input · Field 의 검증 그대로 — 값 `fg-neutral` 16.41 · 13.42, 설명 `fg-neutral-subtle` 5.50 · 6.09(시트 다크 5.27), 오류 `fg-critical` 5.06 · 6.08 ✓. placeholder `fg-placeholder` 4.18 · 4.13(시트 다크 3.58) — 4.5:1 에 못 미치는 것을 알고 둔 값입니다. 다시 받기 글 `fg-neutral` · `bg-neutral-weak` 위 15.20 · 10.32 ✓ — 막힌 동안 `fg-disabled` 는 기준 밖 |
| **WCAG 1.4.4** Resize text | 값 · placeholder · 설명 · 오류 · 다시 받기 글이 글자 크기 설정을 따라 커집니다 ✓ — 6자리 숫자는 칸 한 줄에 들고, 설명 · 오류는 줄을 바꿉니다 |
| **WCAG 1.3.5** Identify input purpose | `autocomplete="one-time-code"` ✓ |
| **WCAG 3.3.1** Error identification | 틀린 코드를 글로 알리고 칸에 `aria-invalid` ✓ |
| **WCAG 2.2.1** Timing adjustable | 유효 시간(10분)을 설명 줄로 미리 알리고, 지나면 다시 받을 수 있습니다 ✓ |
| **WCAG 2.4.3** Focus order | 보낸 뒤 초점을 칸으로 — 막힌 버튼에 남지 않습니다 ✓ |
| **WCAG 4.1.3** Status messages | 오류는 Field 의 알림 자리(polite), 보냈다는 알림은 Snackbar(`role="status"`) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 52 · 40 · 버튼 40 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 large 52 ✓ · medium 40 ⚠(1280 이상 데스크톱 웹만 — Input 과 같습니다). 버튼은 누르는 영역 44 ✓ |
| **ARIA** | `<input type="text" inputmode="numeric" autocomplete="one-time-code">` 하나입니다 — 이름은 Field 라벨(`<label for>`), 설명 · 오류는 `aria-describedby` 입니다. 다시 받기의 남은 초는 버튼 이름에 들어 있어 초점이 오면 읽힙니다(1초마다 알리지 않습니다) |

## Do / Don't

### ✅ Do

- Input 한 칸으로 받습니다 — 라벨 "인증 코드" · placeholder "6자리 숫자".
- 붙여넣기 · 자동 채우기에서 숫자만 뽑고, `one-time-code` · 숫자 키보드를 씁니다.
- 다시 받기 버튼에 남은 초를 붙이고 그동안 막습니다 — 보내면 초점을 칸으로 옮깁니다.
- 유효 시간 · 틀릴 수 있는 횟수를 설명 줄에 언제나 둡니다.
- 오류는 Field 로 칸 아래에, 화면 글로 알립니다.

### ❌ Don't

- 칸을 자릿수만큼 나누기 · 6칸 모양을 그리기.
- `maxLength` 로 먼저 자르기.
- 6자리를 채우면 저절로 확인하기.
- 10:00 시계로 남은 시간을 세기 · 아무 표시 없이 두기.
- 서버가 보낸 글을 그대로 보이기.
- 칸 옆에 높이가 다른 버튼 두기.

## Specification

`input-otp.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 인증 코드 칸을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다. 칸의 나머지 값은 `input.yaml`, 라벨 · 설명 · 오류는 `field.yaml` 입니다.

[그림: Specification — input-otp.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#input-otp)
