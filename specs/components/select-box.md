# Select Box

> 테두리 상자로 선택지를 보여 주고 하나 · 여럿을 고르게 하는 컴포넌트. 설명 · 그림 · 딸린 입력이 붙는 선택지를 비교해 고르고, 저장 · 다음 같은 버튼으로 반영하는 자리에 쓴다.

구조는 당근 [SEED Select Box](https://seed-design.io/components/select-box)(Apache-2.0)를 따른다 — 하나 고르기(Radio Select Box) · 여럿 고르기(Check Select Box) · 묶음(Select Box Group). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-01 사용자 결정).

수치 원본은 [`select-box.yaml`](select-box.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 반복 거래 종료 · 내보내기 · 필터 — 라이트 · 다크](../../site/components/specs/select-box.tsx#hero)

### 직접 골라 보기

고르기 방식 · 컨트롤 · 열 수 · 앞 · 설명 · 펼침 · 상태를 고르면 스펙대로 그린 상자와 그 코드가 바뀐다. 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/select-box.tsx#playground)

## Anatomy

[그림: 상자는 앞 · 제목 · 설명 · 컨트롤로 이뤄지고, 고르면 아래로 펼침이 열린다](../../site/components/specs/select-box.tsx#anatomy)

| ⓐ Prefix | 앞 — 아이콘 22 · 그림(테마 미리보기 같은). 없어도 된다. |
| ⓑ Title | 제목 — 16 · 500. 짧게. 옆에 배지를 둘 수 있다. |
| ⓒ Description | 설명 — 13 · 진한 회색. 두 줄까지. |
| ⓓ Control | 오른쪽 컨트롤 — 하나 고르기는 라디오, 여럿은 칸 없는 체크, 테두리만으로 충분하면 없음. |
| ⓔ Footer | 펼침 — 고른 상자 아래로 열리는 딸린 입력 · 안내. |

상자 하나가 선택지 하나다. 펼침을 뺀 상자 전체가 누르는 영역이고, 고른 상자는 테두리가 2px 짙은 색으로 바뀐다(바탕은 그대로). 누르면 바탕이 바뀌고 누르는 자리(콘텐츠 + 컨트롤)만 2px 거리로 준다(SEED `scaleScope: content` · 기초 Feedback v104).

[표: 부위](select-box.yaml#slots)

## Properties

### Control

| 컨트롤 | 언제 |
|---|---|
| 라디오(`RadioSelectBox`) | 하나만 고른다 — 고른 것과 안 고른 것이 모두 보인다 |
| 칸 없는 체크(`CheckSelectBox`) | 여럿을 고른다 — 상자가 칸 노릇을 하므로 칸을 또 두지 않는다(Checkbox 의 Ghost 모양 — 꺼지면 옅은 체크). 일부 선택(indeterminate)은 없다 — 부모 · 자식 묶음은 Checkbox |
| 없음(`control="none"`) | 테두리만으로 고른 것이 보이면 — 3열처럼 좁을 때, 시각적 소음을 줄이고 싶을 때. 하나 · 여럿 모두 쓴다. 여럿이면 몇 개까지 고를 수 있는지 미리 적는다 |

컨트롤은 늘 오른쪽이다(List 의 라디오 · 스위치 줄과 같은 자리). '없음' 이어도 라디오 · 체크는 화면 밖에 그대로 있어 키보드와 화면 읽기 프로그램이 쓴다.

[그림: 컨트롤 — 라디오 · 칸 없는 체크 · 없음](../../site/components/specs/select-box.tsx#control)

### Layout · Columns

1열로 쌓으면 가로형(앞 · 본문 · 컨트롤이 한 줄, 세로 가운데), 2 ~ 3열이면 세로형(앞이 위, 컨트롤은 위 오른쪽)이다. 열 수는 묶음이 정하고(`columns`), 상자마다 `layout` 으로 바꿀 수 있다. 2열 이상이면 상자 높이를 가장 긴 상자에 맞춘다 — 같은 줄뿐 아니라 묶음의 모든 줄이 같은 높이다(SEED 와 같다). 3열은 폭이 좁으니 정보를 줄인다 — 제목과 짧은 설명만, 컨트롤은 없음.

[그림: 1열 가로형 · 2열 · 3열 세로형](../../site/components/specs/select-box.tsx#layout)

[표: 배치](select-box.yaml#grid.layout)

모든 상자에 공통인 값(상태마다 바뀌는 값은 아래 State):

[표: 공통](select-box.yaml#base.enabled)

### State

상자는 고름 · 고르지 않음과, 그 위에 호버 · 포커스 · 누름 · 비활성이 곱해진다.

| 상태 | 모습 |
|---|---|
| `enabled` | 테두리 1px `stroke-neutral-weak` — 고르면 2px `stroke-neutral-contrast` |
| `hovered` | 웹. 누름과 같은 바탕 `bg-layer-default-pressed`(v106) |
| `focused` | 웹. 키보드 포커스에만 상자 바깥 링 2px · 띄움 2px(v106 · SEED). 라디오 · 체크는 자기 링을 끈다 — 링이 두 겹이 되지 않는다 |
| `pressed` | 호버와 같은 바탕 + 누르는 자리만 2px 거리 축소(v104). 컨트롤은 따로 줄지 않는다 — 라디오는 자기 누름 색이 되고(고른 라디오는 한 단계 짙게, SEED Radiomark pressed), 칸 없는 체크는 바탕이 없다 |
| `disabled` | 제목 · 설명 · 앞 아이콘이 `fg-disabled`, 테두리는 1px 옅은 선(고른 채 막히면 2px 옅은 선). 불투명도로 흐리게 하지 않는다(v106) |

[그림: 상태 — 고름 × 호버 · 포커스 · 누름 · 비활성(그 순간을 멈춰 그렸다)](../../site/components/specs/select-box.tsx#states)

[표: 고름](select-box.yaml#grid.selected)

[표: 고른 채 막혔을 때](select-box.yaml#states.selected)

상태마다 `enabled` 에서 바뀌는 값:

[표: 호버 hovered](select-box.yaml#base.hovered)

[표: 포커스 focused](select-box.yaml#base.focused)

[표: 누름 pressed](select-box.yaml#base.pressed)

[표: 비활성 disabled](select-box.yaml#base.disabled)

[그림: 직접 눌러 보기 — 하나 고르기 · 여럿 고르기(Tab 으로 포커스, 화살표 · Space 로 고른다)](../../site/components/specs/select-box.tsx#live)

[표: 모션](select-box.yaml#motion)

### Prefix

앞에는 아이콘 22(`fg-neutral`)를 둔다. 세로형에서는 위에 선다. 아이콘 대신 그림(미리보기 같은)을 둘 때는 상자 안에서 크기를 정해 쓴다 — 22 를 따르지 않는다.

[그림: 앞 — 아이콘 22 · 세로형에서는 위 · 없음](../../site/components/specs/select-box.tsx#prefix)

### Footer

고른 상자 아래로 딸린 입력 · 안내를 펼친다(`footer`) — "횟수 지정" 의 반복 횟수, "고정 시간" 의 부여 시간처럼 그 선택지를 고를 때만 필요한 칸이다. 고르지 않은 상자의 칸은 숨긴다(닫히면 보이지 않고 Tab 도 닿지 않는다). 펼침 안쪽 여백은 좌우 20 · 아래 16 이다. 고르지 않았을 때만 보이거나(`footerVisibility="when-not-selected"`) 늘 보이게(`"always"`) 할 수도 있다.

[그림: 펼침 — 횟수 지정을 고르면 반복 횟수 칸이 열린다](../../site/components/specs/select-box.tsx#footer)

### Group

하나 고르기 묶음은 `RadioSelectBoxGroup`(radiogroup), 여럿은 `CheckSelectBoxGroup`(fieldset)이다. 둘 다 이름이 있어야 한다 — 묶음을 [Field](field.md) 로 감싸면 Field 의 라벨이 이름이 되고(`aria-labelledby` 를 Field 가 잇는다), 아니면 `aria-label` · `aria-labelledby` 를 준다. 오류는 상자를 바꾸지 않고 묶음 아래 글로 알린다(Checkbox 때 정한 규칙 — Field 의 꼬리).

[그림: 묶음 — 칸 이름 · 상자 · 묶음 아래 오류 글](../../site/components/specs/select-box.tsx#group)

## Guidelines

### 상자 전체가 누르는 영역

상자 전체를 하나의 누르는 영역으로 둔다 — 안쪽 일부만 눌리게 짜지 않는다. 더 알릴 것은 설명이나 고른 뒤 열리는 펼침에 쓴다(SEED).

[그림: 상자 전체가 누르는 영역(분홍) · 체크박스와 글자만 눌리는 상자](../../site/components/specs/select-box.tsx#touch-guide)

### 고르기만 — 반영은 버튼으로

Select Box 는 고르는 도구이고 그 자체로 무언가를 실행하지 않는다. 고른 값은 저장 · 확인 · 다음 · 내보내기 같은 버튼으로 반영한다(SEED, 사용자 결정). 누르는 순간 바뀌는 하나 고르기(테마처럼)는 List 의 라디오 줄로 — 앞에 미리보기를 둔다. 누르면 바로 무언가를 하는 자리("빠르게 맞추기" 같은)는 버튼이다.

[그림: 상자로 고르고 내보내기 버튼으로 반영 · 누르는 순간 실행되는 상자](../../site/components/specs/select-box.tsx#submit-guide)

권한을 주는 여럿 고르기도 같다 — HR 관리 > 역할 및 권한의 사용자 역할은 칸 없는 체크 상자(이름 + 역할 설명)를 고르고 아래 "저장" 한 번으로 반영한다(2026-10-15 마무리 10A — 아래 코드 "여럿 고르고 저장"). 폰 · 데스크톱이 같은 모양이고, 역할이 늘어도 상자를 쌓는다(검색 시트 · 팝오버를 두지 않는다). 누를 때마다 저장하면 권한이 실수 한 번에 바로 바뀌고, 빨리 두 번 누르면 앞 변경을 모르는 목록을 보낼 수 있다.

### 간결하게

제목은 짧게, 설명은 두 줄까지 — 선택지를 빠르게 견주게 한다. 선택지마다의 설명을 드롭다운 아래 한 문단에 몰아 쓰지 않는다(지금 HR 휴가 정책의 "N (고정 시간): …").

[그림: 짧은 제목과 설명 · 길게 쓴 설명](../../site/components/specs/select-box.tsx#concise-guide)

### 여러 열은 같은 높이

2열 이상이면 가장 긴 내용을 담은 상자에 높이를 맞춘다(SEED — 묶음의 모든 줄이 같은 높이). 칸이 비면(5개를 2열에 두는 것처럼) 1열로 쌓거나 열 수를 맞춘다.

[그림: 같은 높이 · 들쭉날쭉한 높이와 빈 칸](../../site/components/specs/select-box.tsx#height-guide)

### 여럿 고르기의 최대 개수

컨트롤이 없는 상자로 여럿을 고르게 하면 몇 개까지 고를 수 있는지 미리 적는다. 다 고른 뒤 또 고르면 고르지 않고 토스트 같은 안내로 알린다(SEED).

[그림: 최대 개수 안내 — "2개까지 고를 수 있어요."](../../site/components/specs/select-box.tsx#max-guide)

### 다른 컴포넌트와 나누기

| 이런 자리 | 컴포넌트 |
|---|---|
| 설명 · 그림 · 딸린 입력이 붙는 선택지 2 ~ 6개를 비교해 고른다(버튼으로 반영) | **Select Box** |
| 하나를 켜고 끈다(설명이 붙어도) | Checkbox(저장 때 적용) · Switch(누르는 순간) |
| 화면 폭 목록에서 고른다 · 누르는 순간 바뀌는 고르기 | List 의 라디오 · 체크 줄 |
| 짧은 키워드로 거르거나 붙인다 | Chip |
| 선택지가 많다(7개 이상) · 자리가 좁다 | Select |
| 누르면 바로 무언가를 한다 | Button |

[그림: 고정 금액 사용은 Checkbox · 거래 종류 필터는 Select Box · 금액 가리기 카드는 Chip](../../site/components/specs/select-box.tsx#edge-guide)

## 코드

레시피 `recipes/shadcn/components/ui/select-box.tsx` 를 쓴다 — `RadioSelectBoxGroup` · `RadioSelectBox` · `CheckSelectBoxGroup` · `CheckSelectBox`. 아래 미리보기는 스펙 값으로 그린 모습이다.

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

[그림: 펼침 — 고르면 반복 횟수 칸이 열린다](../../site/components/specs/select-box.tsx#ex-footer)

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
| Click / Tap | 펼침을 뺀 상자 어디를 눌러도 고른다(하나 고르기는 바뀌고, 여럿은 켜고 끈다). 펼침 안의 입력은 그 입력만. `disabled` 면 무시. |
| Hover(웹) | 누름과 같은 바탕. |
| Keyboard `Tab` | 하나 고르기 묶음은 고른 상자 하나로 들어온다 · 여럿은 상자마다. |
| Keyboard `↑` `↓` `←` `→` | 하나 고르기 묶음 안에서 옮기며 고른다(Radix). |
| Keyboard `Space` | 고른다 · 켜고 끈다. 누르고 있는 동안은 누름 모습이다. |
| Keyboard `Enter` | 폼을 제출한다 — 진짜 input 처럼 폼의 기본 버튼을 누른다. 고르지 않는다(Checkbox · Radio 와 같다, 2026-10-08). |
| 반영 | 저장 · 다음 같은 버튼이 한다 — 상자를 고르는 것만으로 반영하지 않는다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 10.32:1 이상, 설명 `fg-neutral-muted` — 흰 바탕 7.11 · 7.70(라이트 · 다크), 누름 바탕 6.70 · 5.93, 시트 바탕 7.11 · 6.67 ✓. 막힌 상자의 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고른 테두리 `stroke-neutral-contrast` 16.41 · 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 고르지 않은 테두리(1.23 · 1.56)는 상태를 알리지 않는 틀이다 — 고름은 2px 짙은 테두리와 라디오 · 체크가 알린다 |
| **WCAG 1.4.1** Use of color | 고름은 색과 함께 테두리 두께(1 → 2px) · 라디오 · 체크로도 알린다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 상자 바깥 링 2px · 띄움 2px(`stroke-focus-ring`) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 가장 작은 상자(가로형 · 제목만) 54 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 펼침을 뺀 상자 전체 — 54 ✓ |
| **ARIA** | 하나 고르기 묶음은 `role="radiogroup"`, 여럿은 `<fieldset>` — 둘 다 이름(`aria-label` · `aria-labelledby`) 필수. 상자의 라디오 · 체크가 `<label>` 에 묶여 제목 + 설명이 이름이다. 컨트롤이 '없음' 이어도 라디오 · 체크는 화면 밖에 남는다 |
| **Reduced motion** | 모션 줄이기면 누르는 자리의 축소를 뺀다. 펼침은 높이가 바로 바뀌고 투명도만 150ms(기초 Motion) |

## Do / Don't

### ✅ Do

- 설명 · 그림 · 딸린 입력이 붙는 선택지를 Select Box 로 견주게 한다.
- 고른 값은 저장 · 다음 같은 버튼으로 반영한다.
- 고를 때만 필요한 칸은 그 상자의 펼침에 둔다.
- 여러 열이면 상자 높이를 가장 긴 상자에 맞춘다.

### ❌ Don't

- 상자를 눌러 바로 무언가를 실행하기.
- 상자 안 일부(체크박스 · 글자)만 눌리게 짜기.
- 고른 상자를 바탕 색만으로 알리기.
- 선택지마다의 설명을 아래 한 문단에 몰아 쓰기.
- 홀수 개를 2열에 두어 칸을 비우기.

## Specification

`select-box.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Select Box 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — select-box.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#select-box)

## SEED 와 다른 점

- **누름 · 호버 바탕은 불투명한 `bg-layer-default-pressed`** — SEED 의 transparent-pressed 는 투명도가 있어 검사기가 받지 않는다(v102).
- **웹의 호버 · 포커스 상태를 둔다**(v106) — 호버는 누름과 같은 바탕.
- **펼침 안쪽 여백을 컴포넌트가 정한다**(좌우 20 · 아래 16) — SEED 는 쓰는 쪽이 정한다(예제 값이 이것이다).
- **여럿 고르기의 체크는 Checkbox 의 Ghost 칸**(체크 14) — SEED 는 선택 상자 전용 체크(15)이고 호버에 색이 한 단계 진해진다. porest 는 `fg-placeholder` 와 `fg-neutral-subtle` 이 같은 색이라 호버 색 변화가 없다.
- **칸이 비지 않게 한다** — 5개를 2열에 두는 것처럼 빈 칸이 생기면 1열로 쌓거나 열 수를 맞춘다(제품 조사에서 더했다).
- 묶음의 칸 이름 · 설명 · 오류는 묶음이 아니라 [Field](field.md) 가 그린다(2026-10-01 — SEED 의 Select Box Group Field 자리). SEED 의 Fieldset 은 따로 두지 않는다.
- 고른 테두리 `stroke-neutral-contrast` 는 v113 에 더한 역할이다(SEED 와 같은 gray-1000).

## Migration notes

### 2026-10-15 — HR 역할 고르기는 여럿 고르기 상자 + 저장

사용자가 [마무리 비교 페이지](https://claude.ai/artifact/KVyg5Kr95cYUkMT3vsxz1z) 10A 에서 정했다 — HR 관리 > 역할 및 권한 > 사용자 탭의 역할 고르기는 `CheckSelectBox`(이름 t5 500 + 역할 설명 t3) 여럿 + 아래 "저장" 한 번(바뀐 것이 없으면 막힘), 폰 · 데스크톱 같은 모양이다. 데스크톱 팝오버 · 폰 시트 두 벌을 걷는다 — Command(cmdk)를 디자인 시스템과 제품에서 걷는 일의 하나다. List 체크 줄 · 누르는 순간 저장(10B) · Select 여럿 고르기(10C) · 검색 시트 · 팝오버 + 완료(10D)는 고르지 않았다.

- **데스크톱** — 팝오버 250 안 cmdk 검색 + 체크 줄이고, 줄을 누를 때마다 `await` 없이 사용자 전체를 PUT 한다(hr-front `features/admin-authority/ui/UserRoleAssignment.tsx:29-36 · 98-132` · 저장 `UserManagementPanel.tsx:60-87`). 두 번 빨리 누르면 두 번째 요청이 첫 변경을 모르는 목록으로 계산될 수 있다(코드로 읽은 위험). 검색은 역할 이름으로만 된다.
- **폰** — 시트 85vh + 검색칸(이름 · 코드) + 체크 카드(`div onClick` — 키보드로 못 닿는다) + "완료" 로 한 번 저장(`MobileRoleSelector.tsx:46-64 · 80-140 · 140-145`). 저장 오류를 스스로 삼켜 실패해도 시트가 닫힌다.
- **역할 수** — 관리자가 "역할" 탭에서 늘리고 지울 수 있고 상한이 없다. 기본은 넷(porest-sql `hr/data/4. roles.sql` — 관리자 · 일반 사용자 · 승인권자 · 업무 코드 관리자). 비교 페이지는 여덟 개로 그렸다 — 가장 긴 "일반 사용자" 설명도 폰 상자에서 두 줄에 든다. 설명은 1000자까지 쓸 수 있어(`Role.java:52`) 더 길면 두 줄을 넘는다.
- **걷는 것** — `shared/ui/shadcn/command.tsx` · 배럴 재수출(`shared/ui/shadcn/index.ts:39-49`) · `cmdk` 의존, 고아가 되는 번역 키 `authority.noRoleFound`. 같은 시트 모양의 "권한 관리"(`MobilePermissionDrawer.tsx` — 역할 탭)는 그 차례에 이 모양으로 맞춘다.

### 2026-10-08 — Enter 는 폼 제출

Checkbox · Radio 의 Enter 가 폼을 제출하게 됐다(사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) B1, 진짜 input · SEED 와 같다). 여럿 고르기 상자는 `Checkmark` 를 써서 그대로 따라오고, 하나 고르기 묶음(`RadioSelectBoxGroup`)은 Radio 와 같은 처리(`submitOnRadioEnter`)로 Enter 를 받는다. 고르기는 그대로 Space · 화살표다.

### 2026-10-01 — SEED Select Box 로

사용자가 [비교 페이지](https://claude.ai/artifact/8Bgj9uQGe6QvXnntgEYZ7i)에서 정했다 — Select Box 를 새로 두고 Tile 을 걷는다 · 고른 상자는 짙은 테두리 2px(새 역할 `stroke-neutral-contrast`, v113) · 바탕은 그대로, 브랜드 톤 없음 · 컨트롤은 라디오 · 칸 없는 체크 · 없음 · 글자 16/500 · 설명 13 진한 회색 · 고르기만 하고 반영은 버튼으로(테마는 List 라디오 줄).

**Tile 을 걷는다** — 테마 미리보기 카드는 Select Box(앞 그림) 또는 누르는 순간 바뀌면 List 라디오 줄(앞 미리보기)로 그린다. 옛 스펙은 `tile.history/` 에 남겼다.

| 옛 Tile | 새 Select Box |
|---|---|
| 미선택은 1px 옅은 테두리(제품은 투명) · 고르면 1.5px 브랜드 + 옅은 브랜드 바탕 | 미선택 1px `stroke-neutral-weak` · 고르면 2px `stroke-neutral-contrast`(안쪽 덧그림 — 내용이 밀리지 않는다), 바탕은 그대로 |
| 고른 것에만 오른쪽 위 체크 16(브랜드) | 오른쪽 라디오 20 · 칸 없는 체크 · 없음 — 고른 것과 안 고른 것이 모두 보인다 |
| 제목 14 · semi, 설명 11 ~ 12 | 제목 16 · 500, 설명 13 `fg-neutral-muted` |
| 미리보기 40 고정 · 하나 고르기만 | 앞 아이콘 22 · 그림, 하나 · 여럿 고르기, 1 ~ 3열, 펼침 |
| 누르는 순간 적용(테마) | 버튼으로 반영 — 테마처럼 누르는 순간 바뀌는 고르기는 List 라디오 줄 |

제품은 앱 적용 단계에서 옮긴다(2026-10-01 조사). 상자 모양 고르기를 그리는 공용 부품이 사실상 없어 화면마다 손으로 짰다.

- **Desk 웹** — 패턴 6(화면 7곳): 테마(공용 Tile) · 내보내기 기간 · 파일 형식 · 더치페이 분배 방식 · 필터 거래 종류 · 반복 거래 종료(두 화면). 선택 표시가 다섯 가지이고, 넷이 고른 상태를 보조기술에 알리지 않는다(맨 `<button>`). 분배 방식은 고른 것과 안 고른 것의 바탕 대비가 1.02:1 이라 사실상 제목 색으로만 갈린다. 종료는 입력칸이 `role=radio` 안에 있고 radiogroup 이 없다(화살표 · 묶음 이름 없음, 입력칸이 고르기 전에도 보인다). 테마 Tile 은 스펙과 어긋난다 — 미선택이 투명이라 고른 것만 상자로 보이고, 고르면 1 → 1.5px 로 내용이 흔들리고, 제목의 `text-body` 클래스는 CSS 가 생기지 않는다. 내보내기 대화상자(ExportDialog)는 쓰는 곳이 없는 죽은 코드다. 가져오기 출처 드롭다운은 항목마다 '이름 · 설명' 을 한 줄로 이어 붙였다(Select Box 감).
- **Desk 앱** — 상자 6곳 + 후보 8(반복 종료 · 가져오기 출처 · 거래 옮기기 · 고정 금액 · 계좌 종류 · 결제 주기 · 참여자 · 금액 가리기). 선택 모양 다섯 가지, 선택 상태가 Semantics 에 없다. 누르는 영역이 44 보다 작은 곳(필터 거래 종류 41.5 · 금액 가리기 31.5 · 계좌 종류 28)이 있고, 불투명 바탕이 물결을 가린다. PTile 은 tile.yaml 과도 다르다. 구독 Pro 카드는 누를 수 없는데 2px 브랜드 테두리라 고른 상자처럼 보인다. "빠르게 맞추기" 는 상자 모양이지만 누르면 바로 금액을 고치는 실행이다(→ 버튼).
- **HR 웹** — 상자 4 패턴 · 5곳이 모두 손으로 짠 여럿 고르기(권한 · 역할 할당 · 플랜 정책 · 시스템 데일리 체크)이고, 셋은 고르면 체크박스만 바뀌고 상자는 그대로다(체크박스 테두리 #eee 는 흰 바탕 1.16:1). 상자 전체를 누르는 셋은 `div onClick` 이라 키보드로 못 쓰고, 시스템 데일리 체크는 보조기술도 못 쓴다. 하나 고르기 상자는 없다 — 하나 고르기는 전부 드롭다운이다. Select Box 후보 22(강 7): 휴가 정책의 부여 방법 · 가변 부여 여부(고정이면 부여 시간 펼침) · 반복 여부(1회성이면 최대 부여 횟수 펼침) · 분단위 부여 여부, 휴가 신청의 정책, 휴가 부여의 부여일 · 만료일, 공휴일의 음력 여부. 지금은 옵션 설명을 드롭다운 아래 한 문단에 몰아 쓰고("N (고정 시간): …"), Y/N 코드값을 그대로 보인다.
- **경계** — 프리셋 "고정 금액 사용"(켜면 금액 칸)과 자산 "전체 자산 합계에 포함" 은 선택지가 하나라 Checkbox 다(설명 · 딸린 입력이 붙어도). 더치페이 참여자 고르기는 List 의 체크 줄(아바타 앞)이다.
