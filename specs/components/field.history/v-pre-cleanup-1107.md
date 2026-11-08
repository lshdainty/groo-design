# Field

> 입력 하나를 감싸는 둘레 — 칸 이름(라벨) · 필수 또는 선택 표시 · 설명 · 오류 · 글자 수를 한 모양으로 붙인다. Text Input · Textarea 와 Checkbox · Radio · Select Box 묶음을 감싼다.

구조는 당근 [SEED Field](https://seed-design.io/components/field)(Apache-2.0)를 따른다 — 머리(Header) · 입력(Input) · 꼬리(Footer). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정). 옛 Label · Form 스펙은 Field 로 합쳤다(맨 아래 Migration notes).

수치 원본은 [`field.yaml`](field.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카테고리 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/field.tsx#hero)

### 직접 골라 보기

라벨 굵기 · 필수 표시 · 보조 액션 · 설명 · 오류 · 글자 수를 고르면 스펙대로 그린 Field 와 그 코드가 바뀐다. 칸에 실제로 쓸 수 있다.

[그림: 플레이그라운드](../../site/components/specs/field.tsx#playground)

## Anatomy

[그림: Field 는 머리 · 입력 · 꼬리로 이뤄진다](../../site/components/specs/field.tsx#anatomy)

| ⓐ Header | 머리 — 라벨, 필수 점 또는 "선택", 오른쪽의 보조 액션(Slider 는 이 자리에 지금 값). |
| ⓑ Input | 입력 — Text Input · Textarea · [Select](select.md) · [Input Button](input-button.md), Checkbox · Radio · Select Box 묶음. |
| ⓒ Footer | 꼬리 — 왼쪽에 설명 또는 오류, 오른쪽에 글자 수. |

머리 · 입력 · 꼬리는 8 간격으로 쌓는다. 머리와 꼬리는 좌우로 2 들어와 입력칸의 둥근 모서리와 글자 줄이 맞는다.

[표: 부위](field.yaml#slots)

## Properties

### Header

라벨은 16 · 500(`labelWeight="bold"` 면 700) `fg-neutral` 이다. 명사형으로 쓰고 마침표를 찍지 않는다. 한 줄이 좋고, 길어도 두 줄까지. 라벨은 칸과 잇는다 — 입력이면 `<label for>`, 묶음이면 묶음의 `aria-labelledby`(Field 가 알아서 잇는다).

라벨 오른쪽에는 필수 · 선택 표시가 붙는다. 필수는 빨간 점(6, `fg-critical`), 선택은 "선택" 글(14 `fg-neutral-subtle`)이다 — 둘을 한 화면에 섞지 않는다(아래 Guidelines › 필수 입력 표시하기).

머리 오른쪽에는 보조 액션을 둘 수 있다 — "예시 보기" 처럼 칸을 채우는 데 돕는 작은 텍스트 버튼(Button ghost · neutralSubtle · xsmall · 오른쪽 `flush`). 머리 높이(22)를 바꾸지 않게 위아래로 넘친다. 머리는 줄을 바꿀 수 있다 — 큰 글자 · 좁은 칸에서 라벨 옆에 액션이 들 자리가 모자라면 액션이 라벨 아래 줄 오른쪽 끝으로 내려가고, 라벨은 낱말 단위로 줄을 바꾼다(Typography v114). 라벨을 한 글자 폭으로 눌러 세우지 않는다(2026-10-29 17-1 앱 — 200% 에서 라벨이 한 글자씩 깨졌다). 같은 자리에 [Slider](slider.md) 는 지금 값(머리 값 글 — 줄 높이 22 라 넘치지 않는다)을 둔다 — 이 자리는 버튼 하나 또는 머리 값 하나이고 둘을 함께 두지 않는다(SEED Field 의 Suffix Slot 처럼 버튼만이 아니라 자리다). 앱도 이 자리에 위젯을 받는다(구현 세션 질문 Q-015-1).

[그림: 머리 — 라벨 굵기 medium · bold, 필수 점, "선택", 보조 액션](../../site/components/specs/field.tsx#header)

[표: 라벨 굵기](field.yaml#labelWeight)

### Input

Field 는 어떤 입력이든 감싼다 — 칸 이름 · 설명 · 오류를 입력마다 따로 짜지 않는다. 지금 들어가는 입력은 Text Input([Input](input.md) — 인증 코드 칸 [Input OTP](input-otp.md) 도) · [Textarea](textarea.md) · 고르는 칸([Select](select.md) · [Input Button](input-button.md) — [Icon Picker](icon-picker.md) 도) · [Slider](slider.md) · [Quantity Picker](quantity-picker.md)(라벨이 묶음의 이름) · [Attachment Input](attachment-input.md)(설명에 형식 · 크기 · 개수, 거절은 오류 글)과 Checkbox · Radio · Select Box · [Color Swatch](color-swatch.md) 묶음이다. 고르는 칸은 버튼이라 라벨을 눌러도 포커스만 옮긴다(목록 · 시트를 열지 않는다).

[그림: 입력 — 한 줄 · 여러 줄 · 선택 상자 묶음을 같은 둘레로](../../site/components/specs/field.tsx#input-slot)

### Footer

꼬리 왼쪽에는 설명이나 오류가, 오른쪽에는 글자 수가 온다.

**라벨 숨기기**(`labelHidden`) — 자리 글이 이름을 대신하는 칸(시트 맨 위 제목 칸)은 머리 줄째 화면에서 숨긴다. 읽는 이름은 그대로이고(`<label for>`), 칸 위에 간격이 한 칸 더 생기지 않는다. `headerAction` 이 있으면 머리가 보여야 하므로 무시한다.

- **설명** — 칸을 채우는 데 필요한 안내(14 `fg-neutral-subtle`). 앞에 아이콘 16 을 둘 수 있다. 설명 · 오류 글은 낱말 단위로 줄을 바꾼다(Typography v114 — 낱말 가운데서 끊지 않는다).
- **오류** — 설명 자리를 대신한다(14 `fg-critical` + 아이콘 16). 둘을 함께 보이지 않는다. 행동 지시형으로 짧게 쓴다 — "휴대폰 번호 10~11자리로 입력해주세요.".
- **글자 수** — 최대 길이가 있는 칸에만 "쓴 수/최대" 로. 쓴 수는 `fg-neutral`(비면 `fg-neutral-subtle`), 오류면 둘 다 `fg-critical` 이다. 자소 단위로 세고(국기 이모지도 한 글자) 입력은 최대에서 멈춘다. 천 단위에 쉼표("10,000/10,000"). 서버 한도가 UTF-16 이면 입력 상한은 그 단위로 막는다 — 이모지가 많은 글은 숫자가 남아도 멈출 수 있고, 드문 경우라 받아들인다. 글자 수는 [Textarea](textarea.md) 처럼 길게 쓰는 칸에 붙인다 — 한 줄 칸은 한도만 두어도 된다.

[그림: 꼬리 — 설명 · 오류(설명을 대신한다) · 글자 수](../../site/components/specs/field.tsx#footer)

모든 Field 에 공통인 값:

[표: 공통](field.yaml#base.enabled)

### State

Field 의 상태는 오류(`invalid`) 하나다 — 꼬리의 오류 글이 설명을 대신하고 글자 수가 빨개진다. 라벨은 그대로다(색만으로 칸을 가리지 않는다). 칸의 테두리는 입력이 바꾼다(빨간 2px — Input · Textarea). 비활성 · 읽기 전용은 Field 에 주면 입력이 받는다.

[표: 오류 invalid](field.yaml#base.invalid)

## Guidelines

### Form 의 구성

폼은 네 겹이다(SEED).

- **Input** — 실제로 값을 넣는 요소(Text Input · Textarea · 묶음).
- **Field** — 머리 · 입력 · 꼬리를 하나로 묶는다.
- **Fieldset** — 여러 Field 를 한 구역으로 묶는다. 컴포넌트로 따로 두지 않는다 — 구역 제목(List Header 의 목록 제목)과 Field 들로 짠다.
- **Form** — 값을 검증하고 제출한다(`form.tsx` — react-hook-form 을 Field 에 잇는다).

Field 는 24 간격으로 쌓는다. 라벨과 값이 짧은 두 칸은 16 간격으로 나란히 둘 수 있다(768 미만은 한 줄에 하나). 형식이 정해진 값(전화번호 · 주민등록번호)은 칸을 나누지 말고 한 칸에서 형식을 맞춰 준다.

[그림: 폼 — Field 24 간격, 짧은 두 칸은 16 간격으로 나란히 · 전화번호를 세 칸으로 나눈 폼](../../site/components/specs/field.tsx#layout-guide)

### 제출과 검증

저장 · 신청 버튼은 켜 둔다. 누르면 비거나 틀린 칸마다 오류를 보이고, 첫 오류 칸으로 포커스를 옮긴다(제출 시 검증 — 기본). 다 채울 때까지 버튼을 끄면 무엇이 빠졌는지 알 수 없다.

잘못 넣으면 위험한 칸(보안 · 금융 — 비밀번호 확인 · 계좌번호 · 송금액)만 칸을 떠날 때 바로 알린다(인라인 검증). 입력하는 동안 글자마다 오류를 띄우지 않는다.

[그림: 제출 시 검증 — 버튼을 누르면 칸마다 오류 · 버튼만 꺼져 이유를 모르는 폼](../../site/components/specs/field.tsx#submit-guide)

[그림: 인라인 검증 — 비밀번호 확인 칸을 떠나면 바로 알린다](../../site/components/specs/field.tsx#inline-guide)

맞음을 알릴 때(아이디 중복 확인)는 설명 자리에 글로 쓴다 — 칸의 테두리를 초록으로 바꾸지 않는다. 확인하는 동안도 설명 자리에 "확인하는 중" 을 쓴다.

### 이탈 시 안내

작성 · 수정 화면에서 값을 바꾼 채 나가려 하면(뒤로 · 닫기 · 취소 · `Esc`) "작성한 내용이 사라져요" 확인을 띄운다([Alert Dialog](alert-dialog.md)). 값을 바꾸지 않았거나 자동 저장이면 묻지 않는다. 입력 폼 시트 · 대화상자는 바깥 누르기 · 끌어내리기로 아예 닫히지 않는다([Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md)).

[그림: 이탈 시 안내 — 작성한 내용이 사라져요 · 바뀐 값이 없으면 바로 닫는다](../../site/components/specs/field.tsx#leave-guide)

### 필수 입력 표시하기

한 화면 칸의 2/3 이상이 필수면 선택 칸에만 "선택" 을 붙이고, 그렇지 않으면 필수 칸에만 빨간 점을 붙인다. 한 폼 안에서 둘을 섞지 않는다(SEED). 칸이 하나뿐이면 아무것도 붙이지 않는다.

[그림: 필수 입력 표시 — "선택" 만 · 점만 · 둘을 섞은 폼](../../site/components/specs/field.tsx#indicator-guide)

### 라벨 · 설명 · 오류 글

- 라벨은 명사형으로, 마침표 없이 — "휴대폰 번호". 칸 안의 placeholder 는 예시만 쓴다(값을 쓰면 사라져 칸 이름 노릇을 못 한다).
- 설명은 칸을 채우는 데 필요한 것만 — 한두 줄.
- 오류는 무엇을 하면 되는지 짧게 — "이름을 입력해주세요.", "휴대폰 번호 10~11자리로 입력해주세요.". "잘못된 입력입니다" 처럼 이유만 말하지 않는다.
- 단위는 라벨에 "(원)" 으로 붙이지 않고 칸 안 뒤 글자로 둔다(Input › 앞 · 뒤 붙이개).

[그림: 글 — 명사형 라벨과 행동 지시형 오류 · placeholder 를 라벨로 쓴 칸과 이유만 말하는 오류](../../site/components/specs/field.tsx#text-guide)

### 단일 화면 폼 · 단계별 폼

무언가를 만들거나 고치는 화면은 한 화면에 Field 를 쌓는다 — 만들기와 고치기는 같은 구성으로 둔다. 앞 단계에서 고른 것에 따라 더 받을 것이 있거나 한 화면이 복잡해지면 단계로 나눈다(한 단계에 입력 하나면 그 칸은 밑줄형 — Input › Variant).

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

레시피 `recipes/shadcn/components/ui/field.tsx`(Field)와 `form.tsx`(Form · FormField — react-hook-form)를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

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
  headerAction={<Button type="button" variant="ghost" ghostColor="neutralSubtle" size="xsmall" flush="right">예시 보기</Button>}
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
| 라벨 누르기 | 입력으로 포커스가 간다(`<label for>`). 묶음이면 라벨은 이름만 준다. |
| 막힘 · 오류 · 필수(묶음) | Checkbox · Radio 묶음에도 닿는다 — 막히면 묶음 `aria-disabled` + 칸마다 `disabled`, 오류는 radiogroup 의 `aria-invalid` · 체크박스는 칸마다 `aria-invalid`, 필수는 radiogroup 의 `aria-required`(체크박스 묶음 `role="group"` 은 `aria-invalid` · `aria-required` 를 받지 않는다 — SEED 와 같다). 묶음에 직접 준 값이 이긴다. |
| 쓰기 | 글자 수가 바뀐다. 최대에 닿으면 더 들어가지 않는다 — 한글은 조합이 끝난 뒤 자른다. |
| 제출 | 비거나 틀린 칸마다 오류를 보이고 첫 오류 칸으로 포커스를 옮긴다. 버튼은 켜 둔다. |
| 칸을 떠날 때 | 위험한 칸(보안 · 금융)만 바로 검증한다. |
| 오류가 생길 때 | 오류 글이 설명을 대신하고, 화면 읽기 프로그램에 한 번 알린다(polite). |
| 나가기 | 작성 · 수정 화면에서 값이 바뀌었으면 "작성한 내용이 사라져요" 를 묻는다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.3.1** Info and Relationships | 라벨은 칸과 잇는다(`<label for>` · 묶음은 `aria-labelledby`), 설명 · 오류 · 글자 수는 `aria-describedby` |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 흰 바탕(`bg-layer-default`) 라이트 · 다크 — 라벨 `fg-neutral` 16.41 · 13.42, 설명 · "선택" · 글자 수 최대 `fg-neutral-subtle` 5.50 · 6.09, 오류 `fg-critical` 5.06 · 6.08. 시트 바탕(`bg-layer-floating`) 다크에서 `fg-neutral-subtle` · `fg-critical` 5.27 ✓ |
| **WCAG 1.4.1** Use of color | 오류는 색과 함께 아이콘 · 글로 알린다. 필수 점은 색만이 아니라 모양(점)이고, 필수는 `aria-required` 로도 알린다 |
| **WCAG 3.3.1** Error Identification | 오류 글이 무엇이 잘못됐는지 글로 말한다. 칸에는 `aria-invalid` |
| **WCAG 3.3.2** Labels or Instructions | 모든 칸에 라벨 — placeholder 를 이름으로 쓰지 않는다 |
| **WCAG 3.3.3** Error Suggestion | 오류는 고칠 방법을 쓴다(행동 지시형) |
| **WCAG 4.1.3** Status Messages | 오류가 생기면 화면 밖 알림 자리(`aria-live="polite"`)가 한 번 읽는다 |
| **ARIA** | 필수 점은 `aria-hidden` 이고 필수는 칸의 `aria-required` 가 알린다 — `required` 속성은 쓰지 않는다(브라우저 기본 말풍선이 오류 글 대신 뜨지 않게) |

## Do / Don't

### ✅ Do

- 모든 입력을 Field 로 감싸 라벨 · 설명 · 오류를 한 모양으로 둔다.
- 필수는 2/3 규칙대로 점이나 "선택" 하나만 쓴다.
- 저장 버튼을 켜 두고, 누르면 칸마다 오류를 보인다.
- 오류는 설명 자리에 행동 지시형으로.
- 작성 · 수정 화면은 나가기 전에 묻는다.

### ❌ Don't

- placeholder 를 라벨 대신 쓰기.
- 다 채울 때까지 버튼만 꺼 두기.
- 오류 때 라벨 · 입력한 글자를 빨갛게 바꾸기(테두리와 오류 글이 알린다).
- 설명과 오류를 함께 보이기.
- 한 폼에 필수 점과 "선택" 을 섞기.
- 입력하는 동안 글자마다 오류 띄우기.

## Specification

`field.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Field 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — field.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#field)

## SEED 와 다른 점

- **보조 액션은 groo Button**(ghost · neutralSubtle · xsmall · 오른쪽 flush) — 머리 높이 22 를 바꾸지 않게 위아래로 5 씩 넘친다(SEED 의 bleedY 와 같은 일).
- **폼 간격을 정했다** — Field 사이 24 · 나란히 둔 두 칸 사이 16(SEED 는 2열 사이 16 만 글로 적었다).
- **오류를 알리는 자리** — Field 가 화면 밖 polite 알림 자리를 둔다(SEED 문서에는 없다).
- **맞음 · 확인 중은 설명 글로** — groo 옛 스펙(v75)의 초록 테두리 · 돌림 표시는 두지 않는다. SEED 에도 없다.
- **Fieldset 은 컴포넌트로 두지 않는다** — 구역 제목(List Header)과 Field 로 짠다.

## Migration notes

### 2026-10-30 — 메시지 · 라벨은 낱말 단위 · 머리는 줄을 바꾼다

구현 검수에서 앱 ds 가 빠뜨린 것을 고치며 정한 규칙을 적었다. ① 설명 · 오류 글과 라벨은 낱말 단위(Typography v114 — 앱 `PField` 메시지에 `keepAll` 이 main 부터 빠져 있었다, 2026-10-25 I-20) ② 머리에 보조 액션이 있을 때 자리가 모자라면 액션이 라벨 아래 줄 오른쪽 끝으로(2026-10-29 17-1 — 200% 에서 라벨이 한 글자씩 깨졌다). `field.yaml` 에 `header.flexWrap` · `label` · `description` · `errorMessage` 의 `wordBreak` 를 더했다 — 새 값이 아니라 v114 를 부위에 적은 것이다. "모자라다" 의 판정은 웹(flex 줄바꿈 — 라벨 글 폭)과 앱(라벨이 머리 폭 절반을 지키고도 액션이 안 들 때)이 아직 다르다 — 하나로 맞출지는 정하지 않았다. 옛 스펙은 `field.history/v-pre-cleanup-1030.*`.


### 2026-10-15 — 머리 오른쪽은 자리다

구현 세션 질문 Q-015-1 을 있는 규칙으로 정리했다. field.yaml 은 머리 오른쪽을 "작은 텍스트 버튼" 으로, slider.yaml 은 "그 자리에 두는 머리 값 글" 로 적어 둘이 어긋났다 — 머리 값을 늘 보이게 둔 것은 2026-10-09 사용자 결정이다. `headerAction` 을 "버튼 하나 또는 Slider 머리 값" 자리로 고쳤고, 위아래 −5 넘침은 버튼일 때만이다. 웹 레시피는 이미 아무 노드나 받는다. 앱은 이 자리에 위젯을 받는 길을 둔다(값을 Field 밖 줄로 옮기는 것은 10-09 결정과 어긋나 안 된다).

### 2026-10-08 — 막힘 · 오류 · 필수를 Checkbox · Radio 묶음에

묶음(`useFieldGroup`)은 라벨 · 설명만 이어 받아, `invalid` · `required` · `disabled` 인 Field 안의 Checkbox · Radio 묶음에 `aria-invalid` · `aria-required` · 막힘이 없었다 — 막힌 Field 안의 칸이 눌렸다(desk-front #430). 사용자가 [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 9 의 "고친 뒤" 대로 정했다. 레시피에 `useFieldGroupState` 를 두고 Checkbox · Radio 묶음이 칸에 나눠 건다(Behavior 표). Select Box · Chip 묶음은 이번에 바꾸지 않았다 — 지금도 라벨 · 설명(오류 글)만 잇는다.

### 2026-10-01 — SEED Field 로, Label · Form 을 합친다

사용자가 [비교 페이지](https://claude.ai/artifact/1hPpsfdTEJY7j4GPPx24i5)에서 정했다 — Field 로 묶는다(Label · Form 스펙을 합치고 Checkbox · Radio · Select Box 묶음의 칸 이름 · 오류도 Field 가) · 라벨 16/500 · 필수 점 / "선택" 2/3 규칙 · 설명 14 · 오류 14 + 아이콘(설명을 대신) · 글자 수(최대가 있는 칸만) · 사이 8 · 저장 버튼은 켜 두고 제출 때 칸마다 오류(위험한 칸만 떠날 때 바로) · 작성 · 수정 화면은 나가기 전에 묻는다.

| 옛 Label · Form | 새 Field |
|---|---|
| 라벨 14 · 500(`label-md`), 오류면 라벨도 빨강 | 16 · 500(bold 700), 오류여도 그대로 |
| 필수 `*` 빨강 또는 "(필수)" · 선택 "(선택)" | 필수 빨간 점 6 · 선택 "선택" 14 — 2/3 규칙, 섞지 않는다 |
| 라벨 ↔ 칸 ↔ 도움말 4 | 머리 ↔ 입력 ↔ 꼬리 8 |
| 도움말 · 오류를 함께(오류 13 · 500) | 오류가 설명을 대신한다(14 · 아이콘 16) |
| 글자 수 없음 | 최대가 있는 칸에 "n/최대"(자소 단위, 최대에서 멈춘다) |
| form-card(그림자 카드 · 640) · 2열 그리드 · 아래 경계선 버튼 줄 | 폼 틀은 화면이 정한다(시트 · 대화상자 · 페이지). Field 사이 24, 짧은 두 칸만 16 간격으로 나란히 |
| Form · FormField · FormItem · FormLabel · FormControl · FormDescription · FormMessage | Form · FormField(Controller + Field) — 라벨 · 설명 · 오류는 Field 의 속성 |
| 검증: 입력값이 맞을 때만 버튼을 켠다(v75 form state) · 맞으면 초록 테두리 | 버튼은 켜 두고 제출 때 칸마다 · 맞음은 설명 글로 |

옛 스펙은 `label.history/` · `form.history/` 에 남겼다. 기초의 State(입력 중 테두리)와 DESIGN*.md 의 Form layout · Form validation 절도 이 값으로 고쳤다.

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사).

- **Desk 웹** — 공용 Field 가 세로 6 간격 래퍼뿐이라(FieldLabel 85곳 · 설명 · 오류 부품 0회) 도움말 · 오류 · 글자 수를 화면마다 손으로 그린다. 라벨 6가지(FieldLabel 12/600 이 85곳), 라벨 연결은 102칸 중 16. placeholder "0" 이 이름인 칸 15. 오류 모양 7가지 — 그중 6곳은 정의되지 않은 `--fg-danger` 를 써서 회색으로 보인다. 필수 `*` 는 3곳뿐(금액 · 카테고리 · 제목은 저장 버튼을 끄는 것으로만 알린다). 나가기 경고 0곳(바깥 클릭 · Esc · 스와이프 · 뒤로가기로 바로 닫힌다).
- **Desk 앱** — 라벨 9가지(대부분 12px, 칸과 연결 안 됨), 저장을 막는 필수 칸 20곳 이상에 표시가 없고 "(선택)" 을 문구 13개에 손으로 붙였다. 오류 모양 5가지 — 오류 문구를 주면 높이 40 고정 칸이 눌린다. 글자 수 손 카운터 5곳(넘겨도 입력된다) · 소리 없이 자르기 2곳. 나가기 경고 25곳 중 1곳(금액 숨기기)뿐.
- **HR 웹** — Field 체계가 둘(새 Field 79칸은 라벨 연결 0 · 오류여도 테두리 그대로이고 라벨과 입력한 글자가 빨개진다, 옛 Form 20칸은 연결됨). `*` 61개 중 필수인데 없음 26 · 선택인데 붙음 9. 버튼만 꺼지고 오류 문구가 안 뜨는 폼 5. 아이디 중복 확인이 제출을 막지 못한다. 글자 수 표시 0(백엔드는 20 · 50 · 100 · 1000자 제한). 공지 수정 대화상자가 본문을 빈칸으로 연다. 나가기 경고 0.
