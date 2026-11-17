# Field

> 입력 하나를 감싸는 둘레입니다. 칸 이름(라벨) · 필수 또는 선택 표시 · 설명 · 오류 · 글자 수를 한 모양으로 붙이며, Text Input · Textarea 와 Checkbox · Radio · Select Box 묶음을 감쌉니다.

머리(Header) · 입력(Input) · 꼬리(Footer)로 이루어집니다.

수치 원본은 [`field.yaml`](field.yaml)입니다.

[그림: 카테고리 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/field.tsx#hero)

### 직접 골라 보기

라벨 굵기 · 필수 표시 · 보조 액션 · 설명 · 오류 · 글자 수를 고르면 스펙대로 그린 Field 와 그 코드가 바뀝니다. 칸에 실제로 쓸 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/field.tsx#playground)

## Anatomy

[그림: Field 는 머리 · 입력 · 꼬리로 이뤄진다](../../site/components/specs/field.tsx#anatomy)

| ⓐ Header | 머리 — 라벨, 필수 점 또는 "선택", 오른쪽의 보조 액션(Slider 는 이 자리에 지금 값)입니다. |
| ⓑ Input | 입력 — Text Input · Textarea · [Select](select.md) · [Input Button](input-button.md), Checkbox · Radio · Select Box 묶음입니다. |
| ⓒ Footer | 꼬리 — 왼쪽에 설명 또는 오류, 오른쪽에 글자 수입니다. |

머리 · 입력 · 꼬리는 8 간격으로 쌓습니다. 머리와 꼬리는 좌우로 2 들어와 입력칸의 둥근 모서리와 글자 줄이 맞습니다.

[표: 부위](field.yaml#slots)

## Properties

### Header

라벨은 16 · 500(`labelWeight="bold"` 면 700) `fg-neutral` 입니다. 명사형으로 쓰고 마침표를 찍지 않습니다. 한 줄이 좋고, 길어도 두 줄까지입니다. 라벨은 칸과 잇습니다 — 입력이면 `<label for>`, 묶음이면 묶음의 `aria-labelledby`(Field 가 알아서 잇습니다).

라벨 오른쪽에는 필수 · 선택 표시가 붙습니다. 필수는 빨간 점(6, `fg-critical`), 선택은 "선택" 글(14 `fg-neutral-subtle`)입니다 — 둘을 한 화면에 섞지 않습니다(아래 Guidelines › 필수 입력 표시하기).

머리 오른쪽에는 보조 액션을 둘 수 있습니다 — "예시 보기" 처럼 칸을 채우는 데 돕는 작은 텍스트 버튼(Button ghost · neutralSubtle · xsmall)입니다. 글자만 있는 단추라 가장자리 맞춤(`flush`)은 쓰지 않습니다 — [Button](button.md) 의 "가장자리 맞춤" 은 앞 아이콘이 있는 ghost 만입니다. 머리 높이(22)를 바꾸지 않게 위아래로 넘칩니다.

머리는 줄을 바꿀 수 있습니다 — 큰 글자 · 좁은 칸에서 라벨 옆에 액션이 들 자리가 모자라면 액션이 라벨 아래 줄 오른쪽 끝으로 내려가고, 라벨은 낱말 단위로 줄을 바꿉니다(Typography 의 줄바꿈 규칙). "모자라다" 는 카드 머리 · 아코디언 목록 머리 · [List](list.md) 의 목록 제목과 같은 반 폭 판정입니다 — 라벨이 머리 안쪽 폭의 절반을 지키고도 액션(+ 사이 10)이 남은 폭에 들면 한 줄이고, 안 들면 내립니다. 라벨 글이 길어 한 줄에 다 안 들어가는 것만으로는 내리지 않습니다 — 라벨이 제 자리(절반 이상)에서 줄을 바꿉니다. 웹 · 레시피는 라벨 최소 50% + 줄바꿈(`field.yaml` header · label)으로, 앱 `PField` 는 같은 셈을 레이아웃에서 합니다. 라벨을 한 글자 폭으로 눌러 세우지 않습니다.

같은 자리에 [Slider](slider.md) 는 지금 값(머리 값 글 — 줄 높이 22 라 넘치지 않습니다)을 둡니다. 이 자리는 버튼만이 아니라 자리라서 버튼 하나 또는 머리 값 하나를 두고, 둘을 함께 두지 않습니다. 앱도 이 자리에 위젯을 받습니다.

[그림: 머리 — 라벨 굵기 medium · bold, 필수 점, "선택", 보조 액션](../../site/components/specs/field.tsx#header)

[표: 라벨 굵기](field.yaml#labelWeight)

### Input

Field 는 어떤 입력이든 감쌉니다 — 칸 이름 · 설명 · 오류를 입력마다 따로 짜지 않습니다. 들어가는 입력은 Text Input([Input](input.md) — 인증 코드 칸 [Input OTP](input-otp.md) 도) · [Textarea](textarea.md) · 고르는 칸([Select](select.md) · [Input Button](input-button.md) — [Icon Picker](icon-picker.md) 도) · [Slider](slider.md) · [Quantity Picker](quantity-picker.md)(라벨이 묶음의 이름) · [Attachment Input](attachment-input.md)(설명에 형식 · 크기 · 개수, 거절은 오류 글)과 Checkbox · Radio · Select Box · [Color Swatch](color-swatch.md) 묶음입니다. 고르는 칸은 버튼이라 라벨을 눌러도 포커스만 옮깁니다(목록 · 시트를 열지 않습니다).

[그림: 입력 — 한 줄 · 여러 줄 · 선택 상자 묶음을 같은 둘레로](../../site/components/specs/field.tsx#input-slot)

### Footer

꼬리 왼쪽에는 설명이나 오류가, 오른쪽에는 글자 수가 옵니다.

**라벨 숨기기**(`labelHidden`) — 자리 글이 이름을 대신하는 칸(시트 맨 위 제목 칸)은 머리 줄째 화면에서 숨깁니다. 읽는 이름은 그대로이고(`<label for>`), 칸 위에 간격이 한 칸 더 생기지 않습니다. `headerAction` 이 있으면 머리가 보여야 하므로 무시합니다.

- **설명** — 칸을 채우는 데 필요한 안내입니다(14 `fg-neutral-subtle`). 앞에 아이콘 16 을 둘 수 있습니다. 설명 · 오류 글은 낱말 단위로 줄을 바꿉니다(낱말 가운데서 끊지 않습니다).
- **오류** — 설명 자리를 대신합니다(14 `fg-critical` + 아이콘 16). 둘을 함께 보이지 않습니다. 행동 지시형으로 짧게 씁니다 — "휴대폰 번호 10~11자리로 입력해주세요.".
- **글자 수** — 최대 길이가 있는 칸에만 "쓴 수/최대" 로 붙입니다. 쓴 수는 `fg-neutral`(비면 `fg-neutral-subtle`), 오류면 둘 다 `fg-critical` 입니다. 자소 단위로 세고(국기 이모지도 한 글자) 입력은 최대에서 멈춥니다. 천 단위에 쉼표를 찍습니다("10,000/10,000"). 서버 한도가 UTF-16 이면 입력 상한은 그 단위로 막습니다 — 이모지가 많은 글은 숫자가 남아도 멈출 수 있고, 드문 경우라 받아들입니다. 글자 수는 [Textarea](textarea.md) 처럼 길게 쓰는 칸에 붙입니다 — 한 줄 칸은 한도만 두어도 됩니다.
  - **분모는 규칙 값, 입력 상한은 넓힐 수 있습니다** — 분모는 이름 규칙의 최대(`counterMax`)입니다. 규칙이 생기기 전에 저장된 긴 값을 지키려고 입력 상한(최대 글자 수)은 그보다 넓게 둘 수 있습니다 — 분모를 넘으면 글자 수와 오류가 `fg-critical` 이 되고 저장을 막습니다. 값은 자르지 않습니다(웹 `Field` · 앱 `PField` 의 `counterMax`).

[그림: 꼬리 — 설명 · 오류(설명을 대신한다) · 글자 수](../../site/components/specs/field.tsx#footer)

모든 Field 에 공통인 값입니다.

[표: 공통](field.yaml#base.enabled)

### State

Field 의 상태는 오류(`invalid`) 하나입니다 — 꼬리의 오류 글이 설명을 대신하고 글자 수가 빨개집니다. 라벨은 그대로입니다(색만으로 칸을 가리지 않습니다). 칸의 테두리는 입력이 바꿉니다(빨간 2px — Input · Textarea). 비활성 · 읽기 전용은 Field 에 주면 입력이 받습니다.

[표: 오류 invalid](field.yaml#base.invalid)

## Guidelines

### Form 의 구성

폼은 네 겹입니다.

- **Input** — 실제로 값을 넣는 요소(Text Input · Textarea · 묶음)입니다.
- **Field** — 머리 · 입력 · 꼬리를 하나로 묶습니다.
- **Fieldset** — 여러 Field 를 한 구역으로 묶습니다. 컴포넌트로 따로 두지 않습니다 — 구역 제목(List Header 의 목록 제목)과 Field 들로 짭니다.
- **Form** — 값을 검증하고 제출합니다(`form.tsx` — react-hook-form 을 Field 에 잇습니다).

폼 틀은 화면이 정합니다(시트 · 대화상자 · 페이지). Field 는 24 간격으로 쌓습니다. 라벨과 값이 짧은 두 칸은 16 간격으로 나란히 둘 수 있습니다(768 미만은 한 줄에 하나). 형식이 정해진 값(전화번호 · 주민등록번호)은 칸을 나누지 말고 한 칸에서 형식을 맞춰 줍니다.

[그림: 폼 — Field 24 간격, 짧은 두 칸은 16 간격으로 나란히 · 전화번호를 세 칸으로 나눈 폼](../../site/components/specs/field.tsx#layout-guide)

### 제출과 검증

저장 · 신청 버튼은 켜 둡니다. 누르면 비거나 틀린 칸마다 오류를 보이고, 첫 오류 칸으로 포커스를 옮깁니다(제출 시 검증 — 기본). 다 채울 때까지 버튼을 끄면 무엇이 빠졌는지 알 수 없기 때문입니다.

잘못 넣으면 위험한 칸(보안 · 금융 — 비밀번호 확인 · 계좌번호 · 송금액)만 칸을 떠날 때 바로 알립니다(인라인 검증). 입력하는 동안 글자마다 오류를 띄우지 않습니다.

[그림: 제출 시 검증 — 버튼을 누르면 칸마다 오류 · 버튼만 꺼져 이유를 모르는 폼](../../site/components/specs/field.tsx#submit-guide)

[그림: 인라인 검증 — 비밀번호 확인 칸을 떠나면 바로 알린다](../../site/components/specs/field.tsx#inline-guide)

### 입력 상한 — 칸이 스스로 올리는 오류

금액 칸처럼 넣을 수 있는 값에 상한이 있는 칸은, 넘는 입력을 받지 않고(값은 그대로) 칸 아래에 `critical` 오류를 그립니다 — 예 "금액은 100억원까지 입력할 수 있어요." 다음 유효한 입력에서 사라집니다. 토스트 · 스낵바로 알리지 않습니다. 웹 · 앱이 같습니다.

- **Field 가 그립니다** — 칸이 올린 오류도 설명 자리에 그리고, 칸에 `aria-invalid` · `aria-describedby` 를 걸고 정중하게(`polite`) 한 번 알립니다(웹 `setControlError` · 앱 `onLimit`).
- **줄이는 입력은 늘 받습니다** — 상한 전에 저장된 초과 값도 지워 나가며 고칠 수 있게 합니다. 상한 위 값으로는 저장을 막고, 깎아서 저장하지 않습니다.
- **오류는 지금 값에서 다시 셉니다** — 칸 밖에서 값이 바뀌어도(다른 칸 · 고르기로 채움) 다시 계산합니다. 최근 일이 이깁니다 — 입력을 거절하면 상한 오류, 저장을 누르면 폼 검증 오류가 그 자리를 갖습니다.
- **상한 안내가 있는 칸은 모두 막습니다** — 상한 안내를 띄우는 칸(잔액 · 신용한도 · 마이너스 한도 · 이월 · 예수금 · 직접 입력 평가액 …)은 상한 위 값이면 저장을 막습니다. 상한 안내가 없는 칸(매수원가)은 막지 않습니다.
- **보이고 고칠 수 있는 칸만 셉니다** — 종류가 바뀌어 숨은 칸, 잠긴 칸(이월 · 청구분 잠김)은 상한 검사에 넣지 않습니다. 빠져나갈 길이 없는 막힘을 만들지 않기 위해서입니다. 숨은 칸의 값은 요청에 싣지 않습니다.

맞음을 알릴 때(아이디 중복 확인)는 설명 자리에 글로 씁니다 — 칸의 테두리를 초록으로 바꾸지 않습니다. 확인하는 동안도 설명 자리에 "확인하는 중" 을 씁니다.

### 이탈 시 안내

작성 · 수정 화면에서 값을 바꾼 채 나가려 하면(뒤로 · 닫기 · 취소 · `Esc`) "작성한 내용이 사라져요" 확인을 띄웁니다([Alert Dialog](alert-dialog.md)). 값을 바꾸지 않았거나 자동 저장이면 묻지 않습니다. 입력 폼 시트 · 대화상자는 바깥 누르기 · 끌어내리기로 아예 닫히지 않습니다([Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md)).

[그림: 이탈 시 안내 — 작성한 내용이 사라져요 · 바뀐 값이 없으면 바로 닫는다](../../site/components/specs/field.tsx#leave-guide)

### 필수 입력 표시하기

한 화면 칸의 2/3 이상이 필수면 선택 칸에만 "선택" 을 붙이고, 그렇지 않으면 필수 칸에만 빨간 점을 붙입니다. 한 폼 안에서 둘을 섞지 않습니다. 칸이 하나뿐이면 아무것도 붙이지 않습니다.

[그림: 필수 입력 표시 — "선택" 만 · 점만 · 둘을 섞은 폼](../../site/components/specs/field.tsx#indicator-guide)

### 라벨 · 설명 · 오류 글

- 라벨은 명사형으로, 마침표 없이 씁니다 — "휴대폰 번호". 칸 안의 placeholder 는 예시만 씁니다(값을 쓰면 사라져 칸 이름 노릇을 못 하기 때문입니다).
- 설명은 칸을 채우는 데 필요한 것만 한두 줄로 씁니다.
- 오류는 무엇을 하면 되는지 짧게 씁니다 — "이름을 입력해주세요.", "휴대폰 번호 10~11자리로 입력해주세요.". "잘못된 입력입니다" 처럼 이유만 말하지 않습니다.
- 단위는 라벨에 "(원)" 으로 붙이지 않고 칸 안 뒤 글자로 둡니다(Input › 앞 · 뒤 붙이개).

[그림: 글 — 명사형 라벨과 행동 지시형 오류 · placeholder 를 라벨로 쓴 칸과 이유만 말하는 오류](../../site/components/specs/field.tsx#text-guide)

### 단일 화면 폼 · 단계별 폼

무언가를 만들거나 고치는 화면은 한 화면에 Field 를 쌓습니다 — 만들기와 고치기는 같은 구성으로 둡니다. 앞 단계에서 고른 것에 따라 더 받을 것이 있거나 한 화면이 복잡해지면 단계로 나눕니다(한 단계에 입력 하나면 그 칸은 밑줄형 — Input › Variant).

[그림: 단일 화면 폼(거래 추가) · 단계별 폼(금액 → 카테고리)](../../site/components/specs/field.tsx#flow-guide)

### 다른 컴포넌트와 나누기

| 이런 자리 | 컴포넌트 |
|---|---|
| 짧은 글 · 숫자를 직접 친다 | Text Input(Input) |
| 작은 정수를 한 단계씩 — 흔한 값이 열 단계 안쪽 | [Quantity Picker](quantity-picker.md) |
| 사진 · 파일을 붙인다 | [Attachment Input](attachment-input.md) |
| 여러 줄 글을 친다 | Textarea |
| 짧은 선택지 5개 이상에서 값을 고른다 | [Select](select.md) |
| 달력 · 시각 · 아이콘 격자 · 긴 목록에서 고른다 | [Input Button](input-button.md) |
| 설명이 붙는 2 ~ 6개를 견줘 고른다 | Select Box |
| 하나를 켜고 끈다 · 여럿을 고른다 | Checkbox(저장 때) · Switch(누르는 순간) |
| 짧은 키워드로 거르거나 붙인다 | [Chip](chip.md) |

## 코드

레시피 `recipes/shadcn/components/ui/field.tsx`(Field)와 `form.tsx`(Form · FormField — react-hook-form)를 씁니다. FormField 는 Controller 와 Field 를 묶은 것이고, 라벨 · 설명 · 오류는 Field 의 속성으로 줍니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 라벨 · 설명 · 글자 수

[그림: 라벨 · 설명 · 글자 수](../../site/components/specs/field.tsx#ex-basic)

```tsx
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field label="카테고리 이름" description="목록과 통계에 이 이름으로 보여요." maxGraphemeCount={12}>
  <Input placeholder="예: 반려동물, 부수입" />
</Field>
```

### 필수 · 선택

[그림: 필수 점 · "선택"](../../site/components/specs/field.tsx#ex-indicator)

```tsx
// 칸의 2/3 미만이 필수 — 필수 칸에만 점
<Field label="이름" showRequiredIndicator>
  <Input />
</Field>

// 칸의 2/3 이상이 필수 — 선택 칸에만 "선택"(필수 칸은 required 로 aria-required 만)
<Field label="휴대폰 번호" indicator="선택">
  <Input inputMode="tel" />
</Field>
```

### 오류

[그림: 오류 — 설명 자리를 대신한다](../../site/components/specs/field.tsx#ex-error)

```tsx
<Field label="아이디" description="영문 · 숫자 20자까지" maxGraphemeCount={20} invalid errorMessage="이미 쓰고 있는 아이디예요.">
  <Input defaultValue="groo" />
</Field>
```

### 보조 액션

[그림: 보조 액션 — 예시 보기](../../site/components/specs/field.tsx#ex-action)

```tsx
import { Button } from "@/components/ui/button"

<Field
  label="카테고리 이름"
  headerAction={<Button type="button" variant="ghost" ghostColor="neutralSubtle" size="xsmall">예시 보기</Button>}
>
  <Input placeholder="예: 반려동물, 부수입" />
</Field>
```

### 묶음

[그림: 묶음 — Select Box 묶음의 칸 이름 · 오류](../../site/components/specs/field.tsx#ex-group)

```tsx
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<Field label="종료" invalid errorMessage="종료를 골라주세요.">
  <RadioSelectBoxGroup value={end} onValueChange={setEnd}>
    <RadioSelectBox value="none" label="무기한" description="중지할 때까지 계속 반복" />
    <RadioSelectBox value="count" label="횟수 지정" description="정한 횟수만큼 반복" />
  </RadioSelectBoxGroup>
</Field>
```

### react-hook-form

[그림: 제출하면 칸마다 오류 — 직접 눌러 보기](../../site/components/specs/field.tsx#ex-form)

```tsx
import { useForm } from "react-hook-form"
import { Form, FormField } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const form = useForm({ defaultValues: { title: "", reason: "" } })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    <FormField
      control={form.control}
      name="title"
      label="제목"
      required
      rules={{ required: "제목을 입력해주세요." }}
      render={({ field }) => <Input placeholder="예: 개인 사유" {...field} />}
    />
    <FormField
      control={form.control}
      name="reason"
      label="휴가 사유"
      required
      maxGraphemeCount={1000}
      rules={{ required: "휴가 사유를 입력해주세요." }}
      render={({ field }) => <Textarea {...field} />}
    />
    <Button type="submit" variant="brandSolid">신청</Button>
  </form>
</Form>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 라벨 누르기 | 입력으로 포커스가 갑니다(`<label for>`). 묶음이면 라벨은 이름만 줍니다. |
| 막힘 · 오류 · 필수(묶음) | Checkbox · Radio 묶음에도 닿습니다 — 막히면 묶음 `aria-disabled` + 칸마다 `disabled`, 오류는 radiogroup 의 `aria-invalid` · 체크박스는 칸마다 `aria-invalid`, 필수는 radiogroup 의 `aria-required` 입니다(체크박스 묶음 `role="group"` 은 `aria-invalid` · `aria-required` 를 받지 않습니다). 묶음에 직접 준 값이 이깁니다. Select Box · Chip 묶음은 라벨 · 설명(오류 글)만 잇습니다. |
| 쓰기 | 글자 수가 바뀝니다. 최대에 닿으면 더 들어가지 않습니다 — 한글은 조합이 끝난 뒤 자릅니다. |
| 제출 | 비거나 틀린 칸마다 오류를 보이고 첫 오류 칸으로 포커스를 옮깁니다. 버튼은 켜 둡니다. |
| 칸을 떠날 때 | 위험한 칸(보안 · 금융)만 바로 검증합니다. |
| 오류가 생길 때 | 오류 글이 설명을 대신하고, 화면 읽기 프로그램에 한 번 알립니다(polite). |
| 나가기 | 작성 · 수정 화면에서 값이 바뀌었으면 "작성한 내용이 사라져요" 를 묻습니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.3.1** Info and Relationships | 라벨은 칸과 잇습니다(`<label for>` · 묶음은 `aria-labelledby`), 설명 · 오류 · 글자 수는 `aria-describedby` |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 흰 바탕(`bg-layer-default`) 라이트 · 다크 — 라벨 `fg-neutral` 16.41 · 13.42, 설명 · "선택" · 글자 수 최대 `fg-neutral-subtle` 5.50 · 6.09, 오류 `fg-critical` 5.06 · 6.08. 시트 바탕(`bg-layer-floating`) 다크에서 `fg-neutral-subtle` · `fg-critical` 5.27 ✓ |
| **WCAG 1.4.1** Use of color | 오류는 색과 함께 아이콘 · 글로 알립니다. 필수 점은 색만이 아니라 모양(점)이고, 필수는 `aria-required` 로도 알립니다 |
| **WCAG 3.3.1** Error Identification | 오류 글이 무엇이 잘못됐는지 글로 말합니다. 칸에는 `aria-invalid` |
| **WCAG 3.3.2** Labels or Instructions | 모든 칸에 라벨을 둡니다 — placeholder 를 이름으로 쓰지 않습니다 |
| **WCAG 3.3.3** Error Suggestion | 오류는 고칠 방법을 씁니다(행동 지시형) |
| **WCAG 4.1.3** Status Messages | 오류가 생기면 Field 가 둔 화면 밖 알림 자리(`aria-live="polite"`)가 한 번 읽습니다 |
| **ARIA** | 필수 점은 `aria-hidden` 이고 필수는 칸의 `aria-required` 가 알립니다 — `required` 속성은 쓰지 않습니다(브라우저 기본 말풍선이 오류 글 대신 뜨지 않게) |

## Do / Don't

### ✅ Do

- 모든 입력을 Field 로 감싸 라벨 · 설명 · 오류를 한 모양으로 둡니다.
- 필수는 2/3 규칙대로 점이나 "선택" 하나만 씁니다.
- 저장 버튼을 켜 두고, 누르면 칸마다 오류를 보입니다.
- 오류는 설명 자리에 행동 지시형으로 씁니다.
- 작성 · 수정 화면은 나가기 전에 묻습니다.

### ❌ Don't

- placeholder 를 라벨 대신 쓰지 않습니다.
- 다 채울 때까지 버튼만 꺼 두지 않습니다.
- 오류 때 라벨 · 입력한 글자를 빨갛게 바꾸지 않습니다(테두리와 오류 글이 알립니다).
- 설명과 오류를 함께 보이지 않습니다.
- 한 폼에 필수 점과 "선택" 을 섞지 않습니다.
- 입력하는 동안 글자마다 오류를 띄우지 않습니다.

## Specification

`field.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Field 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — field.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#field)
