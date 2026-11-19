# Select Box

> 테두리 상자로 선택지를 보여 주고 하나 · 여럿을 고르게 하는 컴포넌트입니다. 설명 · 그림 · 딸린 입력이 붙는 선택지를 비교해 고르고, 저장 · 다음 같은 버튼으로 반영하는 자리에 씁니다.

하나 고르기(Radio Select Box) · 여럿 고르기(Check Select Box) · 묶음(Select Box Group)으로 이뤄집니다.

수치 원본은 [`select-box.yaml`](select-box.yaml)입니다.

[그림: 반복 거래 종료 · 내보내기 · 필터 — 라이트 · 다크](../../site/components/specs/select-box.tsx#hero)

### 직접 골라 보기

고르기 방식 · 컨트롤 · 열 수 · 앞 · 설명 · 펼침 · 상태를 고르면 스펙대로 그린 상자와 그 코드가 바뀝니다. 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/select-box.tsx#playground)

## Anatomy

[그림: 상자는 앞 · 제목 · 설명 · 컨트롤로 이뤄지고, 고르면 아래로 펼침이 열립니다](../../site/components/specs/select-box.tsx#anatomy)

| ⓐ Prefix | 앞 — 아이콘 22 · 그림(테마 미리보기 같은)입니다. 없어도 됩니다. |
| ⓑ Title | 제목 — 16 · 500 이고 짧게 씁니다. 옆에 배지를 둘 수 있습니다. |
| ⓒ Description | 설명 — 13 · 진한 회색이고 두 줄까지입니다(100% 기준 — 큰 글자에서 줄 수로 자르지 않습니다). |
| ⓓ Control | 오른쪽 컨트롤 — 하나 고르기는 라디오, 여럿은 칸 없는 체크이고, 테두리만으로 충분하면 두지 않습니다. |
| ⓔ Footer | 펼침 — 고른 상자 아래로 열리는 딸린 입력 · 안내입니다. |

상자 하나가 선택지 하나입니다. 펼침을 뺀 상자 전체가 누르는 영역이고, 고른 상자는 테두리가 2px 짙은 색으로 바뀝니다(바탕은 그대로). 누르면 바탕이 바뀌고 누르는 자리(콘텐츠 + 컨트롤)만 2px 거리로 줍니다(기초 Feedback).

[표: 부위](select-box.yaml#slots)

## Properties

### Control

| 컨트롤 | 언제 |
|---|---|
| 라디오(`RadioSelectBox`) | 하나만 고릅니다 — 고른 것과 안 고른 것이 모두 보입니다 |
| 칸 없는 체크(`CheckSelectBox`) | 여럿을 고릅니다 — 상자가 칸 노릇을 하므로 칸을 또 두지 않습니다(Checkbox 의 Ghost 모양 — 꺼지면 옅은 체크). 일부 선택(indeterminate)은 없습니다 — 부모 · 자식 묶음은 Checkbox 를 씁니다 |
| 없음(`control="none"`) | 테두리만으로 고른 것이 보일 때 — 3열처럼 좁을 때, 시각적 소음을 줄이고 싶을 때입니다. 하나 · 여럿 모두 씁니다. 여럿이면 몇 개까지 고를 수 있는지 미리 적습니다 |

컨트롤은 늘 오른쪽입니다(List 의 라디오 · 스위치 줄과 같은 자리). 칸 없는 체크는 Checkbox 의 Ghost 칸(체크 14)이고, 호버에 색을 바꾸지 않습니다. '없음' 이어도 라디오 · 체크는 화면 밖에 그대로 있어 키보드와 화면 읽기 프로그램이 씁니다.

[그림: 컨트롤 — 라디오 · 칸 없는 체크 · 없음](../../site/components/specs/select-box.tsx#control)

### Layout · Columns

1열로 쌓으면 가로형(앞 · 본문 · 컨트롤이 한 줄, 세로 가운데), 2 ~ 3열이면 세로형(앞이 위, 컨트롤은 위 오른쪽)입니다. 열 수는 묶음이 정하고(`columns`), 상자마다 `layout` 으로 바꿀 수 있습니다. 2열 이상이면 상자 높이를 가장 긴 상자에 맞춥니다 — 같은 줄뿐 아니라 묶음의 모든 줄이 같은 높이입니다. 3열은 폭이 좁으니 정보를 줄입니다 — 제목과 짧은 설명만 두고, 컨트롤은 두지 않습니다(없음).

[그림: 1열 가로형 · 2열 · 3열 세로형](../../site/components/specs/select-box.tsx#layout)

[표: 배치](select-box.yaml#grid.layout)

### Density — 낮은 상자

세로형(2 ~ 3열)에는 낮은 꼴(`density="compact"`)이 있습니다 — 위아래 20 → 12, 앞(위) ↔ 글 10 → 4 입니다. 좌우 16 · 앞 아이콘 22 · 글자 · 테두리 · 컨트롤 자리 · 열 · 줄 사이는 그대로입니다. 제목만 있는 상자는 94 → 72 로 낮아집니다(위아래 + 앞 22 + 사이 + 제목 줄 22). 묶음이 정하고(`RadioSelectBoxGroup` · `CheckSelectBoxGroup` 의 `density`) 가로형에는 걸리지 않습니다. 언제 쓰는지는 Guidelines 의 "낮은 상자는 선택지가 많을 때만" 에 있습니다.

[그림: 밀도 — 기본(위아래 20 · 앞 ↔ 글 10) · 낮은 상자(12 · 4)](../../site/components/specs/select-box.tsx#density)

[표: 밀도 — 세로형](select-box.yaml#grid.density.layout.vertical)

모든 상자에 공통인 값입니다(상태마다 바뀌는 값은 아래 State):

[표: 공통](select-box.yaml#base.enabled)

### State

상자는 고름 · 고르지 않음과, 그 위에 호버 · 포커스 · 누름 · 비활성이 곱해집니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 테두리 1px `stroke-neutral-weak` — 고르면 2px `stroke-neutral-contrast` |
| `hovered` | 웹. 누름과 같은 바탕 `bg-layer-default-pressed` |
| `focused` | 웹. 키보드 포커스에만 상자 바깥 링 2px · 띄움 2px. 라디오 · 체크는 자기 링을 끕니다 — 링이 두 겹이 되지 않습니다 |
| `pressed` | 호버와 같은 바탕 + 누르는 자리만 2px 거리 축소. 컨트롤은 따로 줄지 않습니다 — 라디오는 자기 누름 색이 되고(고른 라디오는 한 단계 짙게), 칸 없는 체크는 바탕이 없습니다 |
| `disabled` | 제목 · 설명 · 앞 아이콘이 `fg-disabled`, 테두리는 1px 옅은 선(고른 채 막히면 2px 옅은 선). 불투명도로 흐리게 하지 않습니다 |

[그림: 상태 — 고름 × 호버 · 포커스 · 누름 · 비활성(그 순간을 멈춰 그렸습니다)](../../site/components/specs/select-box.tsx#states)

[표: 고름](select-box.yaml#grid.selected)

[표: 고른 채 막혔을 때](select-box.yaml#states.selected)

상태마다 `enabled` 에서 바뀌는 값입니다:

[표: 호버 hovered](select-box.yaml#base.hovered)

[표: 포커스 focused](select-box.yaml#base.focused)

[표: 누름 pressed](select-box.yaml#base.pressed)

[표: 비활성 disabled](select-box.yaml#base.disabled)

[그림: 직접 눌러 보기 — 하나 고르기 · 여럿 고르기(Tab 으로 포커스, 화살표 · Space 로 고릅니다)](../../site/components/specs/select-box.tsx#live)

[표: 모션](select-box.yaml#motion)

### Prefix

앞에는 아이콘 22(`fg-neutral`)를 둡니다. 세로형에서는 위에 섭니다. 아이콘 대신 그림(미리보기 같은)을 둘 때는 상자 안에서 크기를 정해 씁니다 — 22 를 따르지 않습니다.

[그림: 앞 — 아이콘 22 · 세로형에서는 위 · 없음](../../site/components/specs/select-box.tsx#prefix)

### Footer

고른 상자 아래로 딸린 입력 · 안내를 펼칩니다(`footer`) — "횟수 지정" 의 반복 횟수, "고정 시간" 의 부여 시간처럼 그 선택지를 고를 때만 필요한 칸입니다. 고르지 않은 상자의 칸은 숨깁니다(닫히면 보이지 않고 Tab 도 닿지 않습니다). 펼침 안쪽 여백은 좌우 20 · 아래 16 으로 컴포넌트가 정합니다. 고르지 않았을 때만 보이거나(`footerVisibility="when-not-selected"`) 늘 보이게(`"always"`) 할 수도 있습니다.

[그림: 펼침 — 횟수 지정을 고르면 반복 횟수 칸이 열립니다](../../site/components/specs/select-box.tsx#footer)

### Group

하나 고르기 묶음은 `RadioSelectBoxGroup`(radiogroup), 여럿은 `CheckSelectBoxGroup`(fieldset)입니다. 둘 다 이름이 있어야 합니다 — 묶음을 [Field](field.md) 로 감싸면 Field 의 라벨이 이름이 되고(`aria-labelledby` 를 Field 가 잇습니다), 아니면 `aria-label` · `aria-labelledby` 를 줍니다. 묶음의 칸 이름 · 설명 · 오류는 묶음이 아니라 Field 가 그립니다. 오류는 상자를 바꾸지 않고 묶음 아래 글로 알립니다(Checkbox 와 같은 규칙 — Field 의 꼬리).

[그림: 묶음 — 칸 이름 · 상자 · 묶음 아래 오류 글](../../site/components/specs/select-box.tsx#group)

## Guidelines

### 상자 전체가 누르는 영역

상자 전체를 하나의 누르는 영역으로 둡니다 — 안쪽 일부만 눌리게 짜지 않습니다. 더 알릴 것은 설명이나 고른 뒤 열리는 펼침에 씁니다.

[그림: 상자 전체가 누르는 영역(분홍) · 체크박스와 글자만 눌리는 상자](../../site/components/specs/select-box.tsx#touch-guide)

### 고르기만 — 반영은 버튼으로

Select Box 는 고르는 도구이고 그 자체로 무언가를 실행하지 않습니다. 고른 값은 저장 · 확인 · 다음 · 내보내기 같은 버튼으로 반영합니다. 누르는 순간 바뀌는 하나 고르기(테마처럼)는 List 의 라디오 줄로 그리고, 앞에 미리보기를 둡니다. 누르면 바로 무언가를 하는 자리("빠르게 맞추기" 같은)는 버튼입니다.

[그림: 상자로 고르고 내보내기 버튼으로 반영 · 누르는 순간 실행되는 상자](../../site/components/specs/select-box.tsx#submit-guide)

권한을 주는 여럿 고르기도 같습니다 — HR 관리 > 역할 및 권한의 사용자 역할은 칸 없는 체크 상자(이름 + 역할 설명)를 고르고 아래 "저장" 한 번으로 반영합니다(아래 코드 "여럿 고르고 저장"). 폰 · 데스크톱이 같은 모양이고, 역할이 늘어도 상자를 쌓습니다(검색 시트 · 팝오버를 두지 않습니다). 누를 때마다 저장하면 권한이 실수 한 번에 바로 바뀌고, 빨리 두 번 누르면 앞 변경을 모르는 목록을 보낼 수 있기 때문입니다.

### 간결하게

제목은 짧게, 설명은 두 줄까지 씁니다(글자 100% 기준 — 큰 글자에서는 자르지 않고 상자가 늘어납니다) — 선택지를 빠르게 견주게 합니다. 선택지마다의 설명을 드롭다운 아래 한 문단에 몰아 쓰지 않습니다.

[그림: 짧은 제목과 설명 · 길게 쓴 설명](../../site/components/specs/select-box.tsx#concise-guide)

### 여러 열은 같은 높이

2열 이상이면 가장 긴 내용을 담은 상자에 높이를 맞춥니다(묶음의 모든 줄이 같은 높이). 열 수는 화면 폭에 맞춥니다. 마지막 줄에 빈 칸이 생겨(5개를 2열에 두는 것처럼) 어색하면 1열로 쌓는 것을 권합니다 — 설명이 짧은 2열처럼 빈 칸이 어색하지 않으면 그대로 둘 수 있습니다. 화면마다 고릅니다.

[그림: 같은 높이 · 들쭉날쭉한 높이와 빈 칸](../../site/components/specs/select-box.tsx#height-guide)

### 낮은 상자는 선택지가 많을 때만

한 시트 · 한 단계에 상자가 많아 100% 글자에서 모두 한 화면에 보여야 할 때만 낮은 상자(`density="compact"`)를 씁니다 — 자산 추가 1단계의 종류 아홉(계좌 여섯 · 카드 둘 · 투자 하나, 2열 · 앞 아이콘 · 컨트롤 없음)처럼 기본 높이면 마지막 상자가 화면 아래 흐림 속에 숨는 자리입니다. 선택지가 2 ~ 4개면 기본 높이로 둡니다 — 낮출 까닭이 없고, 누르는 자리만 작아집니다. 낮춰도 넘치는 자리(글자 200% · 작은 화면)는 본문 스크롤 + 끝 흐림 그대로입니다([Bottom Sheet](bottom-sheet.md) 의 "90% 를 넘으면 페이지" — 보통은 들어맞는 시트가 큰 글자로 넘친 것). 한 묶음 안에서 기본 상자와 낮은 상자를 섞지 않습니다.

| 자리 | 밀도 |
|---|---|
| 선택지 2 ~ 4개 · 설명이 붙는 상자 · 가로형(1열) | 기본 |
| 한 시트에 세로형 상자가 많아 기본 높이로는 마지막 상자가 화면 밖(자산 종류 아홉) | 낮은 상자 |

### 여럿 고르기의 최대 개수

컨트롤이 없는 상자로 여럿을 고르게 하면 몇 개까지 고를 수 있는지 미리 적습니다. 다 고른 뒤 또 고르면 고르지 않고 [Snackbar](snackbar.md) 로 알립니다.

[그림: 최대 개수 안내 — "2개까지 고를 수 있어요."](../../site/components/specs/select-box.tsx#max-guide)

### 다른 컴포넌트와 나누기

| 이런 자리 | 컴포넌트 |
|---|---|
| 설명 · 그림 · 딸린 입력이 붙는 선택지를 비교해 고릅니다(버튼으로 반영) — 정보 양이 먼저, 개수와 상관없이 | **Select Box** |
| 하나를 켜고 끕니다(설명이 붙어도) | Checkbox(저장 때 적용) · Switch(누르는 순간) |
| 화면 폭 목록에서 고릅니다 · 누르는 순간 바뀌는 고르기 | List 의 라디오 · 체크 줄 |
| 짧은 키워드로 거르거나 붙입니다 | Chip |
| 한 줄 설명으로 줄일 수 있습니다 · 자리가 좁습니다 | Select |
| 누르면 바로 무언가를 합니다 | Button |

[그림: 고정 금액 사용은 Checkbox · 거래 종류 필터는 Select Box · 금액 가리기 카드는 Chip](../../site/components/specs/select-box.tsx#edge-guide)

선택지 개수 · 글 길이로 고르는 판단 순서는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 한 곳입니다 — 설명이 붙으면 개수와 상관없이 Select Box, 한 줄 설명으로 줄일 수 있으면 Select 입니다. Chip 과는 이렇게 견줍니다.

| | Select Box | [Chip](chip.md)(고르기) |
|---|---|---|
| 정보 밀도 | 설명 · 그림 · 딸린 입력까지 | 핵심 키워드 하나 |
| 공간 | 다른 칸과 폭 · 줄을 맞춥니다 | 글 길이만큼 — 폭이 들쭉날쭉합니다 |
| 확정 | 버튼으로 반영(저장 · 다음) | 폼이면 버튼, 필터 바면 바로 |

## 코드

레시피 `recipes/shadcn/components/ui/select-box.tsx` 를 씁니다 — `RadioSelectBoxGroup` · `RadioSelectBox` · `CheckSelectBoxGroup` · `CheckSelectBox`. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 하나 고르기

[그림: 하나 고르기 — 반복 거래 종료](../../site/components/specs/select-box.tsx#ex-radio)

```tsx
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<RadioSelectBoxGroup value={end} onValueChange={setEnd} aria-label="종료">
  <RadioSelectBox value="none" label="무기한" description="중지할 때까지 계속 반복" />
  <RadioSelectBox value="count" label="횟수 지정" description="정한 횟수만큼 반복" />
  <RadioSelectBox value="date" label="종료일 지정" description="정한 날까지 반복" />
</RadioSelectBoxGroup>
```

### 펼침

[그림: 펼침 — 고르면 반복 횟수 칸이 열립니다](../../site/components/specs/select-box.tsx#ex-footer)

```tsx
import { Input } from "@/components/ui/input"

<RadioSelectBox
  value="count"
  label="횟수 지정"
  description="정한 횟수만큼 반복"
  footer={<Input aria-label="반복 횟수" defaultValue={12} />}
/>
```

### 여럿 고르기

[그림: 여럿 고르기 — 권한](../../site/components/specs/select-box.tsx#ex-check)

```tsx
import { CheckSelectBox, CheckSelectBoxGroup } from "@/components/ui/select-box"

<CheckSelectBoxGroup aria-label="휴가 권한">
  <CheckSelectBox label="휴가 조회" description="본인 휴가 내역을 조회할 수 있는 권한입니다." defaultChecked />
  <CheckSelectBox label="휴가 신청" description="OT, 경조 휴가 등 휴가를 신청할 수 있는 권한입니다." />
</CheckSelectBoxGroup>
```

### 여러 열 · 앞 · 컨트롤 없음

[그림: 3열 · 앞 아이콘 · 컨트롤 없음 — 파일 형식](../../site/components/specs/select-box.tsx#ex-columns)

```tsx
import { Braces, FileText, Sheet } from "lucide-react"
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

<RadioSelectBoxGroup columns={3} defaultValue="csv" aria-label="파일 형식">
  <RadioSelectBox value="csv" control="none" prefix={<FileText />} label="CSV" description="구글시트" />
  <RadioSelectBox value="xlsx" control="none" prefix={<Sheet />} label="Excel" description="엑셀" />
  <RadioSelectBox value="json" control="none" prefix={<Braces />} label="JSON" description="백업용" />
</RadioSelectBoxGroup>
```

### 낮은 상자 — 자산 종류

[그림: 낮은 상자 — 자산 추가 1단계, 2열 · 앞 아이콘 · 컨트롤 없음](../../site/components/specs/select-box.tsx#ex-compact)

```tsx
import { CalendarDays, Coins, Landmark, Percent, PiggyBank, Wallet } from "lucide-react"
import { RadioSelectBox, RadioSelectBoxGroup } from "@/components/ui/select-box"

{/* 한 시트에 종류 아홉(계좌 여섯 · 카드 둘 · 투자 하나) — 묶음마다 낮은 상자로, 100% 글자에서 모두 보이게 */}
<RadioSelectBoxGroup columns={2} density="compact" value={kind} onValueChange={setKind} aria-label="계좌">
  <RadioSelectBox value="checking" control="none" prefix={<Landmark />} label="입출금" />
  <RadioSelectBox value="deposit" control="none" prefix={<PiggyBank />} label="예금" />
  <RadioSelectBox value="savings" control="none" prefix={<CalendarDays />} label="적금" />
  <RadioSelectBox value="overdraft" control="none" prefix={<Percent />} label="마이너스 통장" />
  <RadioSelectBox value="cash" control="none" prefix={<Wallet />} label="현금" />
  <RadioSelectBox value="loan" control="none" prefix={<Coins />} label="대출" />
</RadioSelectBoxGroup>
```

### 비활성

[그림: 비활성 — 고른 채 · 고르지 않은 채](../../site/components/specs/select-box.tsx#ex-states)

```tsx
<RadioSelectBoxGroup defaultValue="fixed" aria-label="가변 부여 여부">
  <RadioSelectBox value="fixed" label="고정 시간" description="정책에 등록된 부여 시간을 사용합니다." disabled />
  <RadioSelectBox value="flex" label="가변 시간" description="사용자 또는 관리자가 입력한 시간 값으로 부여합니다." disabled />
</RadioSelectBoxGroup>
```

### 여럿 고르고 저장 — HR 역할

[그림: HR 사용자 역할 — 이름 + 설명 상자 여럿, 아래 "저장"(바뀐 것이 없으면 막힘) — 데스크톱 · 폰 같은 모양](../../site/components/specs/select-box.tsx#ex-roles)

```tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { CheckSelectBox, CheckSelectBoxGroup } from "@/components/ui/select-box"

const roles = [
  { code: "ADMIN", name: "관리자", description: "관리자 권한으로 시스템 운영에 필요한 전체 권한이 부여되어 있습니다." },
  { code: "USER", name: "일반 사용자", description: "일반 사용자 권한으로 시스템 관리에 필요한 권한을 제외한 일반적인 읽기, 쓰기 권한이 부여되어 있습니다." },
  { code: "APPROVER", name: "승인권자", description: "휴가 신청 항목에 대해 승인/반려를 할 수 있는 권한이 부여되어 있습니다." },
]
const saveUserRoles = (codes: string[]) => Promise.resolve(codes) // 사용자 역할 저장 요청 — 성공하면 토스트 "역할을 저장했어요"

const [saved, setSaved] = useState<string[]>(["USER", "APPROVER"])
const [picked, setPicked] = useState<string[]>(saved)
const added = picked.filter((c) => !saved.includes(c)).length
const removed = saved.filter((c) => !picked.includes(c)).length
const toggle = (code: string, on: boolean) =>
  setPicked((list) => (on ? [...list, code] : list.filter((c) => c !== code)))

<Field label="역할" description="여럿 고를 수 있어요. 저장을 눌러야 바뀌어요.">
  <CheckSelectBoxGroup>
    {roles.map((r) => (
      <CheckSelectBox
        key={r.code}
        label={r.name}
        description={r.description}
        checked={picked.includes(r.code)}
        onCheckedChange={(on) => toggle(r.code, on)}
      />
    ))}
  </CheckSelectBoxGroup>
</Field>
<div className="flex items-center justify-end gap-x3">
  <span className="text-t4 text-fg-neutral-subtle">
    {added + removed > 0 ? `더함 ${added} · 뺌 ${removed} — 아직 저장 안 됨` : "바뀐 것 없음"}
  </span>
  {/* 바뀐 것이 없으면 막는다 — 저장은 한 번, 누를 때마다 저장하지 않는다 */}
  <Button disabled={added + removed === 0} onClick={() => saveUserRoles(picked).then(() => setSaved(picked))}>
    저장
  </Button>
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | 펼침을 뺀 상자 어디를 눌러도 고릅니다(하나 고르기는 바뀌고, 여럿은 켜고 끕니다). 펼침 안의 입력은 그 입력만 받습니다. `disabled` 면 무시합니다. |
| Hover(웹) | 누름과 같은 바탕입니다. |
| Keyboard `Tab` | 하나 고르기 묶음은 고른 상자 하나로 들어오고, 여럿은 상자마다 들어옵니다. |
| Keyboard `↑` `↓` `←` `→` | 하나 고르기 묶음 안에서 옮기며 고릅니다(Radix). |
| Keyboard `Home` · `End` | 하나 고르기 묶음은 받지 않습니다 — 초점도 고른 상자도 그대로, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도). 첫 · 끝 상자로는 화살표로 갑니다 — 진짜 라디오 · WAI-ARIA APG Radio Group 과 같습니다. 펼침 안의 입력칸에서는 글 처음 · 끝으로 가는 그대로입니다. |
| Keyboard `Space` | 고르거나 켜고 끕니다. 누르고 있는 동안은 누름 모습입니다. |
| Keyboard `Enter` | 폼을 제출합니다 — 진짜 input 처럼 폼의 기본 버튼을 누릅니다. 고르지 않습니다(Checkbox · Radio 와 같습니다). |
| 반영 | 저장 · 다음 같은 버튼이 합니다 — 상자를 고르는 것만으로 반영하지 않습니다. |
| 글자 크기 설정 | 제목 · 설명이 커지고 줄을 바꿔 받습니다 — 상자는 높이를 정하지 않아 글을 따라 늘어납니다. 앞 아이콘 · 라디오 · 체크는 px 그대로입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 10.32:1 이상, 설명 `fg-neutral-muted` — 흰 바탕 7.11 · 7.70(라이트 · 다크), 누름 바탕 6.70 · 5.93, 시트 바탕 7.11 · 6.67 ✓. 막힌 상자의 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.4** Resize text | 제목 · 설명이 글자 크기 설정을 따르고, 상자가 글을 따라 늘어나 잘리지 않습니다 ✓. 라디오 · 체크 · 앞 아이콘은 px 그대로입니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고른 테두리 `stroke-neutral-contrast` 16.41 · 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 고르지 않은 테두리(1.23 · 1.56)는 상태를 알리지 않는 틀입니다 — 고름은 2px 짙은 테두리와 라디오 · 체크가 알립니다 |
| **WCAG 1.4.1** Use of color | 고름은 색과 함께 테두리 두께(1 → 2px) · 라디오 · 체크로도 알립니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 상자 바깥 링 2px · 띄움 2px(`stroke-focus-ring`) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 가장 작은 상자(가로형 · 제목만) 54 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 펼침을 뺀 상자 전체 — 54 ✓ |
| **ARIA** | 하나 고르기 묶음은 `role="radiogroup"`, 여럿은 `<fieldset>` — 둘 다 이름(`aria-label` · `aria-labelledby`)이 있어야 합니다. 상자의 라디오 · 체크가 `<label>` 에 묶여 제목 + 설명이 이름입니다. 컨트롤이 '없음' 이어도 라디오 · 체크는 화면 밖에 남습니다 |
| **Reduced motion** | 모션 줄이기면 누르는 자리의 축소를 뺍니다. 펼침은 높이가 바로 바뀌고 투명도만 150ms 입니다(기초 Motion) |

## Do / Don't

### ✅ Do

- 설명 · 그림 · 딸린 입력이 붙는 선택지를 Select Box 로 견주게 합니다.
- 고른 값은 저장 · 다음 같은 버튼으로 반영합니다.
- 고를 때만 필요한 칸은 그 상자의 펼침에 둡니다.
- 여러 열이면 상자 높이를 가장 긴 상자에 맞춥니다.
- 한 시트에 세로형 상자가 많아 마지막 상자가 화면 밖이면 낮은 상자(`density="compact"`)로 모두 보이게 합니다.

### ❌ Don't

- 상자를 눌러 바로 무언가를 실행하기.
- 상자 안 일부(체크박스 · 글자)만 눌리게 짜기.
- 고른 상자를 바탕 색만으로 알리기.
- 선택지마다의 설명을 아래 한 문단에 몰아 쓰기.
- 선택지 2 ~ 4개에 낮은 상자 · 한 묶음에서 기본 상자와 낮은 상자 섞기 · 위아래를 12 보다 더 줄이기.

## Specification

`select-box.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Select Box 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — select-box.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#select-box)
