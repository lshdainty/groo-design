# Select

> 짧은 선택지 5개 이상에서 폼에 넣을 값을 고르는 칸입니다. 결제 수단 · 통화 · 휴가 정책 · 반복 단위처럼 한 줄 글(+ 한 줄 설명)로 충분한 선택지를 칸 아래 목록으로 엽니다. 달력 · 시각 · 아이콘 격자 · 검색이 필요한 긴 목록은 [Input Button](input-button.md), 설명 · 그림이 붙는 2 ~ 6개는 [Select Box](select-box.md) 를 씁니다.

Select 는 트리거(Trigger) · 목록(Content) · 선택지(Item) · 묶음(Group) · 묶음 사이 선(Divider)으로 이루어집니다. 라벨 · 설명 · 오류는 [Field](field.md)가 둘레에서 그립니다.

수치 원본은 [`select.yaml`](select.yaml)입니다.

[그림: 거래 추가 · 휴가 신청 — 라이트 · 다크](../../site/components/specs/select.tsx#hero)

### 직접 골라 보기

크기 · 상태 · 여럿 고르기 · 앞 아이콘 · 묶음 · 설명을 고르면 스펙대로 그린 칸과 그 코드가 바뀝니다. 실제로 열고 고를 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/select.tsx#playground)

## Anatomy

[그림: 트리거와 목록 — 목록 안에 선택지 · 묶음 · 묶음 사이 선](../../site/components/specs/select.tsx#anatomy)

| ⓐ Trigger | 트리거 — 고른 값이나 placeholder 를 보이고, 누르면 목록을 엽니다. 상자는 [Input Button](input-button.md) · Text Input 과 같습니다. |
| ⓑ Prefix Icon | 트리거 앞 아이콘 — 없어도 됩니다. 하나를 고르면 그 선택지의 아이콘으로 바뀝니다. |
| ⓒ Value · Placeholder | 고른 값 — 한 줄입니다. 고르기 전에는 고를 값의 종류("결제 수단 선택")를 보입니다. |
| ⓓ Chevron | 셰브론(lucide `chevron-down`) — 목록이 열려 있는지 알립니다. 열리면 180° 돕니다. |
| ⓔ Content | 목록 — 트리거 폭 그대로 트리거 아래에 붙습니다(모자라면 위). |
| ⓕ Group Label | 묶음 제목 — 없어도 됩니다. |
| ⓖ Item | 선택지 — 앞 아이콘 · 글 · 설명(한 줄)입니다. 고른 선택지는 오른쪽에 체크(Indicator, lucide `check` 선 2.5)를 그립니다. |
| ⓗ Divider | 묶음 사이 선 — 묶음이 둘 이상이면 저절로 그립니다. 선택지 사이에는 없습니다. |

[표: 부위](select.yaml#slots)

## Properties

### Size

`large`(트리거 52 · 선택지 46)는 폰 · 앱에서, `medium`(트리거 40 · 선택지 39)은 1280 이상 데스크톱 웹(마우스)에서만 씁니다. 웹의 기본은 `responsive` 입니다 — 1280 미만은 large, 이상은 medium 입니다. 앱은 늘 large 입니다. 예외가 하나 있습니다 — [Table Pagination](table-pagination.md) 의 두 고르기는 줄 한 높이를 지키려고 폭과 상관없이 medium 40 입니다. 트리거와 목록은 같은 크기를 쓰고, 한 폼 안에서 크기를 섞지 않습니다.

[그림: 크기 — large · medium 의 트리거와 목록](../../site/components/specs/select.tsx#size)

[표: 크기 — 트리거](select.yaml#size@trigger+value+placeholder+prefixIcon+chevron)

[표: 크기 — 선택지](select.yaml#size@item+itemIcon+itemLabel+itemDescription+indicator)

[표: 크기 — 묶음 제목](select.yaml#size@groupLabel)

### State

트리거의 상태는 [Input Button](input-button.md) 과 같고, 목록이 열려 있는 동안 셰브론이 180° 돕니다.

| 트리거 | 모습 |
|---|---|
| `enabled` | 투명 바탕 · 안쪽 1px `stroke-neutral-weak` |
| `pressed` | 바탕 `bg-layer-default-pressed` + 값 · 아이콘만 2px 거리로 줄입니다(테두리 · 바탕은 그대로). 마우스는 호버에 같은 바탕 |
| `focused` | 키보드 포커스에만 바깥 링 2px · 띄움 2px `stroke-focus-ring` — 트리거는 버튼이라 마우스 · 터치로 눌러서는 링이 없습니다 |
| `open` | 셰브론 180°(열 때 150ms · 닫을 때 100ms) |
| `invalid` | 안쪽 2px `stroke-critical-solid` — 눌러도 그대로입니다. 오류 글은 Field 가 칸 아래에 |
| `disabled` | 바탕 `bg-disabled` · 글자 · 아이콘 `fg-disabled`. 흐리게 하지 않습니다 |
| `readonly` | 바탕 `bg-disabled` · 값은 진한 글자 그대로. 포커스는 되고 열리지 않습니다 |

[그림: 트리거 상태 — 기본 · 누름 · 포커스 · 열림 · 오류 · 비활성 · 읽기 전용](../../site/components/specs/select.tsx#states)

[표: 트리거 상태](select.yaml#matrix@trigger)

[표: 트리거 글자 · 아이콘](select.yaml#matrix@value+placeholder+prefixIcon+chevron)

[표: 포커스 링](select.yaml#matrix@focusRing)

| 선택지 | 모습 |
|---|---|
| `enabled` | 바탕 없음 |
| `pressed` | 좌우 8 들어온 알약(모서리 12) `bg-layer-floating-pressed` + 콘텐츠 2px 거리 축소. 마우스 호버 · 키보드로 옮긴 선택지는 같은 알약(축소 없음) |
| `selected` | 오른쪽 체크(large 14 · medium 12). 바탕 · 글 굵기는 바꾸지 않습니다 |
| `disabled` | 글 · 설명 · 아이콘 · 체크 모두 `fg-disabled`. 알약이 생기지 않습니다 |

[그림: 선택지 상태 — 기본 · 누름 · 키보드 위치 · 고름 · 비활성](../../site/components/specs/select.tsx#item-states)

[표: 선택지 상태](select.yaml#matrix@item)

[표: 알약 — 모양](select.yaml#base.enabled@highlight)

[표: 알약](select.yaml#matrix@highlight)

[표: 선택지 글자 · 아이콘 · 고른 표시](select.yaml#matrix@itemIcon+itemLabel+itemDescription+indicator)

[표: 모션](select.yaml#motion)

### Selection Mode

하나 고르기가 기본입니다. 여럿 고르기(`multiple`)도 둡니다.

- **하나 고르기** — 고르면 목록이 닫히고 값이 트리거에 들어갑니다. 고른 선택지를 다시 눌러도 풀리지 않습니다 — 목록만 닫히고 값은 그대로이며, 요청도 보내지 않습니다(시트로 열 때도 같습니다). "없음" 이 답이 될 수 있는 칸은 그 답을 선택지로 둡니다(아래 "없음" 을 답으로 받기).
- **여럿 고르기** — 목록이 열린 채로 남아 이어서 고릅니다. 고른 선택지를 다시 누르면 풀립니다. 트리거에는 고른 순서대로 쉼표로 잇고("식비, 교통"), 칸 폭을 넘으면 "첫 값 외 N개" 로 줄입니다.

[그림: 하나 고르기 · 여럿 고르기](../../site/components/specs/select.tsx#selection)

### Prefix Icon

트리거와 선택지 앞에 아이콘을 둘 수 있습니다. 트리거의 아이콘은 어떤 종류의 값을 고르는 자리인지 함께 알리고 싶을 때 씁니다. 트리거에 실제로 그리는 아이콘은 고른 개수로 정합니다.

- **하나를 골랐다** — 그 선택지의 아이콘을 그립니다(트리거에 준 아이콘을 덮습니다). 선택지에 아이콘이 없으면 트리거의 아이콘을 그립니다.
- **둘 이상 골랐다**(여럿 고르기) — 트리거의 아이콘을 그립니다.
- 그릴 아이콘이 없으면 아이콘 없이 그립니다.

선택지 아이콘은 묶음 안에서 모두 두거나 모두 빼고, 아이콘만으로 뜻을 알리지 않습니다.

[그림: 앞 아이콘 — 고른 선택지의 아이콘이 트리거로](../../site/components/specs/select.tsx#prefix-icon)

### Content

목록은 트리거 폭 그대로, 트리거 아래 8 에 붙습니다. 아래가 모자라면 위로 뒤집고, 화면 가장자리와는 8 을 둡니다(안전 영역이 있으면 그 값). 높이는 480 과 **목록이 놓이는 쪽에 남은 화면** 중 작은 값이고(남은 화면이 200 보다 좁아도 200 은 둡니다), 넘치면 목록 안에서 스크롤합니다. 놓이는 쪽은 아래에 다 들어가면 아래, 아니면 트리거 아래 · 위 중 넓은 쪽이고, 남은 화면은 트리거에서 그쪽 화면 가장자리 8(안전 영역이 있으면 그 값)까지입니다. 열면 초점이 목록으로 가 화면 키보드는 내려갑니다 — 남은 화면에 키보드를 세지 않습니다. 480 은 `listMaxHeight` 로 줄일 수 있습니다 — [Table Pagination](table-pagination.md) 의 범위 목록만 240 을 씁니다. 열면 고른 선택지가 보이게 스크롤된 채로 열립니다 — 선택지가 많은 Select 는 목록 안에서 스크롤되는 모습을 가정하고 짭니다.

선택지 글 · 설명은 목록 안에서는 줄바꿈되고(자르지 않습니다 — 선택지는 최소 높이라 글을 따라 늘어납니다), 트리거에서는 한 줄로 말줄임됩니다. 설명 "한 줄" 은 글자 100% 기준의 쓰기 지침입니다.

[그림: 목록 — 아래에 붙는다 · 모자라면 위로 · 길면 안에서 스크롤](../../site/components/specs/select.tsx#content)

[표: 목록](select.yaml#base.enabled@content)

### Group

성격이나 정렬 기준이 다른 선택지는 묶음으로 나눕니다. 묶음에는 제목을 붙일 수 있고(`fg-neutral-subtle`), 묶음이 둘 이상이면 사이에 1px 선(좌우 16 들임)을 저절로 그립니다 — 묶음 사이는 8 + 1 + 8 = 17 입니다. 선택지 사이에는 선을 긋지 않습니다.

[그림: 묶음 — 제목 · 묶음 사이 선](../../site/components/specs/select.tsx#group)

[표: 선택지](select.yaml#base.enabled@item)

[표: 묶음 제목](select.yaml#base.enabled@groupLabel)

[표: 묶음 사이 선](select.yaml#base.enabled@divider)

## Guidelines

### 늘 Field 의 라벨과 함께

Select 는 늘 [Field](field.md) 의 라벨과 함께 씁니다. 라벨이 없으면 고른 뒤에 그 값이 무엇인지 알 수 없습니다 — placeholder 는 고르면 사라지므로 라벨을 대신하지 못합니다.

[그림: 라벨 — 고른 뒤에도 뜻이 보인다 · 라벨 없이 값만](../../site/components/specs/select.tsx#label-guide)

### "없음" 을 답으로 받기

하나 고르기는 고른 선택지를 다시 눌러도 풀리지 않습니다. 칸의 성격에 따라 셋으로 나눕니다.

| 칸 | 어떻게 |
|---|---|
| "없음" 이 답이 될 수 있다 | "없음" 선택지를 둡니다 — 글은 "{칸 이름} 없음" 한 가지 꼴입니다("결제 수단 없음" — "해당 없음" · "선택 안 함" 이 아닙니다). 다른 선택지와 성격이 달라 **맨 앞 따로 묶음**에 둡니다 |
| 하나를 꼭 골라야 한다 | "없음" 을 두지 않습니다. 고르지 않고 제출하면 Field 의 오류로 알립니다("결제 수단을 골라주세요.") |
| 고르지 않은 상태가 있을 수 없다 | "없음" 을 두지 않고 기본값을 미리 골라 둡니다(정렬 기준 · 통화) |

"없음" 을 고르면 값을 고른 것으로 칩니다 — 트리거에 그 글을 보이고, 필수 칸이어도 검증을 통과합니다. 그래서 질문을 건너뛴 것과 없다고 답한 것을 가를 수 있습니다. 저장된 기록을 수정으로 열 때 그 칸의 값이 비어 있으면(null) 트리거에 "{칸 이름} 없음" 을 보입니다 — 저장한 기록의 빈 값은 "없다고 답한 것" 이기 때문입니다. 자리 글(placeholder)은 아직 아무것도 묻지 않은 새로 추가할 때만 보입니다. Select 에는 지우기 버튼을 두지 않습니다(선택 사항인 Input Button 에만 둡니다).

[그림: 없음 — 맨 앞 따로 묶음의 "결제 수단 없음" · 맨 뒤 "해당 없음"](../../site/components/specs/select.tsx#none-guide)

### 여럿 고르기

여럿 고르기는 다시 누르면 풀리므로 고른 것을 되돌리는 선택지가 따로 필요 없습니다. 대신 생김새로는 드러나지 않는 제약을 글로 알립니다.

- **몇 개까지 고를 수 있는지** — Field 설명에 적습니다("최대 3개까지 고를 수 있어요.").
- **꼭 골라야 하면** — 필수 표시를 하고, 하나도 고르지 않고 제출하면 Field 의 오류로 알립니다.
- **다른 선택지를 바꾸는 선택지를 두지 않습니다** — "전체 선택" 이나 나머지를 지우는 "없음" 은 결과를 짐작하기 어렵습니다. 전체 선택이 잦으면 Checkbox 의 부모 · 자식 묶음을 씁니다. 건너뛴 것과 없다고 답한 것을 갈라야 하면 앞에 Checkbox 를 두고("하자 있음"), 체크했을 때만 Select("하자 종류")를 보입니다.

[그림: 여럿 고르기 — 개수는 설명에 · "전체 선택" 선택지](../../site/components/specs/select.tsx#multi-guide)

### 여럿 고른 값 보이기

트리거는 한 줄입니다. 다 보이면 고른 순서대로 쉼표로 잇고("식비, 교통"), 칸 폭을 넘으면 개수로 줄입니다 — 가장 먼저 고른 값을 남기고 나머지 개수를 붙입니다("식비 외 2개"). "외" 는 앞의 값을 **뺀** 개수입니다 — "식비 등 2개" 라고 쓰면 모두 두 개라는 뜻이 되어 틀립니다. 값이 서로 동등해 하나를 보여 주는 것이 도움이 안 되면 전체 개수로 씁니다("3개 고름").

고른 값이 조건으로 묶여 결과가 달라지는 자리(필터)는 쉼표 대신 접속사로 관계를 드러내고("식비 또는 교통"), 어떻게 묶이는지를 Field 설명에도 적습니다.

[그림: 여럿 고른 값 — 쉼표 · "외 N개" · "등 N개"](../../site/components/specs/select.tsx#summary-guide)

### 선택지 순서

사용 빈도 · 크기 · 시간처럼 그 목록이 이미 가진 기준 하나로 일관되게 줄 세웁니다(가나다순을 기본으로 두지 않습니다). 기준이 다른 선택지는 묶음으로 나눠 경계를 드러냅니다.

### 선택지 글

- 명사형으로 짧게 씁니다 — "서울 선택" 처럼 동작이나 부연을 붙이지 않습니다. 선택지 사이에 낱말 · 길이 · 말투를 맞춥니다.
- 코드값(`Y` · `N` · `ANNUAL` · 아이디)을 글로 내지 않습니다(Writing).
- 트리거 폭에서 말줄임 없이 보이는지 확인합니다 — 목록에서는 줄바꿈되어 다 보여도 트리거에서는 잘립니다. 길면 글을 줄이는 것을 먼저 하고, 부연은 선택지 설명(한 줄)에 씁니다. 설명은 트리거에 보이지 않습니다.

[그림: 선택지 글 — 명사형 · 동작을 붙인 글](../../site/components/specs/select.tsx#item-label-guide)

### placeholder

고르기 전의 글은 어떤 종류의 값을 고르는지 알리는 "{값의 종류} 선택" 꼴입니다("결제 수단 선택"). "여기를 눌러 펼쳐 보기" 같은 막연한 글이나 라벨만 그대로 둔 글은 쓰지 않습니다. 마침표는 찍지 않습니다.

[그림: placeholder — 값의 종류 · 막연한 글](../../site/components/specs/select.tsx#placeholder-guide)

### 폰에서도 칸 아래 목록

폰에서도 목록은 칸 아래에 붙습니다 — 시트로 바꾸지 않습니다. 짧은 선택지를 화면을 덮는 시트로 열면 손이 더 가고 폼이 가려지기 때문입니다. 아래가 모자라면 위로 열립니다. 시트가 필요한 것 — 달력 · 시각 · 아이콘 격자 · 검색해 고르는 긴 목록 — 은 Select 가 아니라 [Input Button](input-button.md) 이 엽니다.

[그림: 폰 — 칸 아래 목록 · 짧은 선택지를 시트로](../../site/components/specs/select.tsx#mobile-guide)

### 고르는 컴포넌트 고르기

고르는 컴포넌트를 고르는 표는 여기 한 곳입니다 — Radio · Checkbox · Switch · Chip · Select Box · Segmented Control · Tabs · List · Searchable List · Wheel Picker · Menu 문서는 선택지 개수를 다시 적지 않고 이 절을 가리키며, 자기 짝 비교 표만 둡니다. 선택지 개수의 숫자(2 ~ 4 · 5 이상)도 아래 판단 순서 하나입니다.

**먼저 — 이 자리는 무슨 일을 하나**

| 하는 일 | 고를 것 | Desk 예 |
|---|---|---|
| 폼에 넣을 값을 고른다 — 저장 · 다음을 눌러야 반영 | 아래 판단 순서로 — Select Box · Select · Chip · Radio · Checkbox · Input Button | 거래 추가의 결제 수단 · 반복 종료 · 공개 범위 |
| 보이는 내용을 바로 거르거나 정렬하거나 다르게 본다 | 2 ~ 4가지 고정 보기 → **[Segmented Control](segmented-control.md)**(내용 바로 위, 한 화면 하나) · 조건을 여럿 걸고 푼다 · 개수가 바뀐다 → **[Chip](chip.md) 필터 바** | 할 일 오늘 · 이번 주 · 전체 · 완료 / 거래 검색의 카테고리 · 기간 · 금액 |
| 다른 구역 · 화면으로 옮긴다 | **[Tabs](tabs.md)** — 1차 Line · 2차 Chip Tabs | 가계부 · 자산 · 통계 · 예산 |
| 기능 하나를 켜고 끈다 | 누르는 순간 바뀐다 → **[Switch](switch.md)**(설정 줄이면 List 스위치 줄) · 저장해야 반영 → **[Checkbox](checkbox.md)** | 결제 알림 · 고정 금액으로 기록 |
| 화면 폭 목록에서 하나를 고르고 바로 바뀐다 | **[List](list.md) 라디오 줄** | 기본 통화 · 테마 |
| 누르면 동작을 실행한다 | **[Menu](menu.md)**(1280 이상) · [Menu Sheet](menu-sheet.md)(1280 미만) — 값을 고르는 데 쓰지 않는다 | 거래 상세 머리 ⋮ → 복사해 새로 쓰기 · 삭제 |

[그림: 첫 갈래 — 폼 값 · 보기 거르기 · 구역 옮기기 · 켜고 끄기 · 화면 폭 목록 하나 · 실행](../../site/components/specs/select.tsx#first-guide)

**폼 값 — 위에서부터 판단합니다**

선택지마다 필요한 정보의 양, 선택지 개수, 글 길이로 고릅니다. 위에서부터 판단합니다.

| 순서 | 이런 선택지 | 컴포넌트 | 이럴 때 더 맞다 | 제품의 자리 |
|---|---|---|---|---|
| 1 | 그림 · 여러 줄 설명 · 딸린 입력이 필요하다 | [Select Box](select-box.md) | 나란히 견주고 버튼으로 확정한다 | 반복 거래 종료 · 분배 방식 · 내보내기 형식 · 휴가 부여 방법 |
| 2 | 5개 이상이거나, 한 줄 설명이면 충분하다 | **Select** | 사용자가 답을 이미 안다 · 선택지가 늘어날 수 있다 · 자리가 좁다 | 결제 수단 · 통화 · 휴가 정책 · 계좌 종류 · 반복 단위 · 반복 요일 |
| 3 | 2 ~ 4개, 설명 없이 글이 짧다 | [Chip](chip.md) | 한 줄에서 가볍게 — 고른 값이 곧 화면의 갈래일 때 | 거래 종류 · 우선순위 · 알림 소리 |
| 3 | 2 ~ 4개, 설명 없이 글이 길다 | [Radio](radio-group.md) · [Checkbox](checkbox.md) | "하나의 정답을 고른다" · "해당되는 것에 모두 체크한다" — 서류처럼 차분히 견줄 때 | 공개 범위 · 동의. 예 / 아니오 하나는 Checkbox |
| 4 | 너무 많아 스크롤로 찾기 어렵다 | [Input Button](input-button.md) + 검색 시트([Searchable List](searchable-list.md)) | 이름을 알고 친다 | 결재자 · 사람 · 종목 · 카드사 |

- 요일 7개도 2 — 여럿 고르는 Select 입니다("월, 수, 금").
- 폼 값을 탭(Segmented Control · Tabs)으로 고르지 않습니다 — 탭은 보이는 내용을 바로 거르거나 바꾸는 자리입니다. 폼 값의 탭은 Chip · Select 로 옮깁니다.

**예외 · 주의**

- **저장 폼 안의 Switch** — 값이 저장 때 들어가도 누르면 화면이 바로 바뀌면 Switch 입니다(일정 "종일" — 날짜 칸이 바뀝니다). Switch 규칙(누르는 순간 바뀌는 것만) 안의 경계입니다 — 경계 사례는 [Checkbox](checkbox.md) 의 "Checkbox 와 Switch" 표를 봅니다.
- **거르기 칩은 개수 규칙이 다릅니다** — 폼 값 칩은 2 ~ 4(판단 순서 3), 거르기 칩은 개수가 바뀌거나 5개 이상인 축(카테고리 · 태그)에 씁니다(Chip 필터 바). 2 ~ 4가지로 고정된 보기는 Segmented Control 입니다.
- **늘어날 수 있는 목록** — 지금 셋이어도 사용자가 더할 수 있는 목록(카테고리 · 결제 수단)은 Select 입니다.
- **선택지가 하나**면 Checkbox 입니다 — 설명 · 딸린 입력이 붙어도 같습니다("고정 금액 사용").
- **글이 칸보다 길면** 다른 컴포넌트를 씁니다 — Segmented Control 칸 글이 줄을 바꾸면 Chip · Select 로 옮깁니다.
- **컨트롤을 끼운 줄**(스위치 · 체크 · 라디오)에는 다른 버튼을 두지 않습니다 — 줄 전체가 라벨입니다([List](list.md)).
- **Menu 로 값을 고르지 않습니다** — 테마는 List 라디오 줄, 정렬 · 보기는 Segmented Control · Select 입니다. 고른 표시가 없는 목록으로 값을 고르면 지금 값이 안 보입니다.

[그림: 고르는 컴포넌트 — Select Box · Select · Chip · Radio](../../site/components/specs/select.tsx#pick-guide)

### Select 와 Menu

Menu 는 누르는 순간 실행되는 명령 목록이고, Select 는 폼에 넣을 값을 고르는 입력입니다.

| | Select | Menu |
|---|---|---|
| 목적 | 폼에 넣을 값 고르기 | 동작 실행(정렬 · 삭제 · 공유) |
| 반영 | 고른 뒤 저장 · 제출해야 반영 | 누르면 바로 실행 |
| Field | Field 와 함께(라벨) | Field 없이 버튼에서 연다 |
| 고른 표시 | 오른쪽 체크 | 없다(누르면 닫히고 실행) |

[그림: Select 와 Menu — 폼의 칸 · 더 보기 버튼의 목록](../../site/components/specs/select.tsx#menu-guide)

## 코드

레시피 `recipes/shadcn/components/ui/select.tsx`(Select · SelectGroup · SelectItem)를 [Field](field.md) 안에 둡니다. 레시피는 Radix Popover 위에 목록(`role="listbox"`)을 직접 짭니다 — 여럿 고르기를 받아야 하기 때문입니다. 선택지는 글(`label`)을 속성으로 받습니다 — 목록이 닫혀 있어도 트리거 · 글자로 찾기(typeahead)가 그 글을 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 기본

[그림: 기본 — Field 안의 Select](../../site/components/specs/select.tsx#ex-basic)

```tsx
import { Field } from "@/components/ui/field"
import { Select, SelectItem } from "@/components/ui/select"

<Field label="통화">
  <Select placeholder="통화 선택" value={currency} onValueChange={setCurrency}>
    <SelectItem value="KRW" label="원" description="KRW" />
    <SelectItem value="USD" label="미국 달러" description="USD" />
    <SelectItem value="JPY" label="일본 엔" description="JPY" />
    <SelectItem value="EUR" label="유로" description="EUR" />
    <SelectItem value="CNY" label="중국 위안" description="CNY" />
  </Select>
</Field>
```

### 묶음 · 아이콘 · "없음"

[그림: 묶음 — 결제 수단](../../site/components/specs/select.tsx#ex-group)

```tsx
import { Banknote, CircleSlash, CreditCard, Landmark } from "lucide-react"
import { Select, SelectGroup, SelectItem } from "@/components/ui/select"

<Field label="결제 수단">
  <Select placeholder="결제 수단 선택" value={asset} onValueChange={setAsset}>
    <SelectGroup>
      <SelectItem value="none" label="결제 수단 없음" prefixIcon={<CircleSlash />} />
    </SelectGroup>
    <SelectGroup label="카드">
      <SelectItem value="hyundai-m" label="현대카드 신용카드" prefixIcon={<CreditCard />} />
      <SelectItem value="shinhan-deep" label="신한카드 체크카드" prefixIcon={<CreditCard />} />
    </SelectGroup>
    <SelectGroup label="계좌 · 현금">
      <SelectItem value="kb" label="국민 주계좌" description="123-45-6789" prefixIcon={<Landmark />} />
      <SelectItem value="cash" label="현금" prefixIcon={<Banknote />} />
    </SelectGroup>
  </Select>
</Field>
```

### 여럿 고르기

[그림: 여럿 고르기 — 반복 요일](../../site/components/specs/select.tsx#ex-multiple)

```tsx
<Field label="반복 요일" description="고른 요일마다 거래를 만들어요.">
  <Select multiple placeholder="요일 선택" value={days} onValueChange={setDays}>
    {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
      <SelectItem key={d} value={d} label={`${d}요일`} />
    ))}
  </Select>
</Field>
```

`value` 는 고른 순서대로 쌓입니다. 트리거 글은 `formatValue` 로 바꿉니다 — 기본은 "월요일, 수요일" 이고, 넘치면 "월요일 외 2개" 입니다.

### 상태

[그림: 상태 — 오류 · 비활성 · 읽기 전용](../../site/components/specs/select.tsx#ex-states)

```tsx
<Field label="휴가 정책" invalid errorMessage="휴가 정책을 골라주세요.">
  <Select placeholder="휴가 정책 선택">…</Select>
</Field>
<Field label="통화" disabled>
  <Select defaultValue="KRW">…</Select>
</Field>
<Field label="부서" readOnly>
  <Select defaultValue="design">…</Select>
</Field>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 Click / Tap | 목록을 열고 닫습니다. 포인터로 열면 고른 선택지가 보이게 스크롤만 하고 미리 짚지 않습니다. |
| 트리거 `↓` `↑` `Enter` `Space` | 목록을 열고 고른 선택지(없으면 첫 선택지)를 짚습니다. |
| 트리거 글자 키(닫힌 채) | 하나 고르기면 그 글자로 시작하는 다음 선택지로 값을 바로 바꿉니다(열지 않습니다 — 네이티브 select 와 같습니다). |
| `<label>` 누르기 | 트리거로 포커스만 옮깁니다 — 목록은 열지 않습니다(Field). |
| 목록 `↓` `↑` | 다음 · 이전 선택지로 옮깁니다(막힌 선택지는 건너뜁니다). `Home` · `End` 는 처음 · 끝입니다. 글자 키는 그 글자로 시작하는 선택지로 옮깁니다. |
| 목록 `Enter` · `Space` · 선택지 누르기 | 하나 고르기 — 고르고 닫습니다. 여럿 고르기 — 고르거나 풀고 열어 둡니다. |
| `Esc` · 바깥 누르기 · `Tab` | 닫습니다. 고른 값은 그대로입니다. `Esc` 로 닫으면 트리거로 포커스가 돌아옵니다. |
| 마우스 호버 | 짚은 선택지가 따라갑니다(알약). 터치는 짚지 않습니다 — 손가락 아래 미리 칠한 알약은 눌린 채 멈춘 것처럼 보이기 때문입니다. |
| Disabled | 포커스 · 열기가 되지 않습니다. 커서는 not-allowed 입니다. |
| Readonly | 포커스는 되고 열리지 않습니다. 값은 그대로 읽힙니다. |
| 글자 크기 설정 | 트리거 값 · 선택지 글 · 설명 · 묶음 제목이 커집니다. 트리거는 상자 높이가 글을 따라 늘지만 한 줄을 지키고, 넘치면 끝을 "…" 로 줄입니다. 목록의 선택지는 줄을 바꿔 받고 높이가 늘어납니다(목록 폭은 트리거 폭 그대로). 앞 아이콘 · 셰브론 · 체크는 px 그대로입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 트리거 값 `fg-neutral` 16.41 · 13.42, 읽기 전용 값 15.20 · 10.32. placeholder 4.18 · 4.13(누름 바탕 위 3.94 · 3.18) ⚠ — 4.5:1 에 못 미칩니다(`fg-placeholder` 역할 값 그대로). 목록 글 `fg-neutral` 16.41 · 11.62, 묶음 제목 · 설명 `fg-neutral-subtle` 5.50 · 5.27(알약 위 5.18 · 4.68) ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI)입니다 |
| **WCAG 1.4.4** Resize text | 트리거 값 · 목록 글이 글자 크기 설정을 따릅니다 ✓. 트리거는 한 줄이라 길면 "…" 로 줄지만, 목록을 열면 고른 선택지가 줄바꿈되어 다 보이고, 보조 기술은 콤보박스 값으로 다 읽습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 트리거 키보드 포커스 링 `stroke-focus-ring` Desk 8.38 · 6.10 · HR 8.17 · 6.07, 오류 테두리 5.06 · 6.08, 고른 표시 체크 16.41 · 11.62 ✓. 누름 · 호버 · 키보드 위치 알약은 목록 바탕과 1.06 · 1.13 ⚠ — 짚은 선택지는 화면 읽기 프로그램에 `aria-activedescendant` 로 알립니다. 기본 1px 테두리(1.23 · 1.56)는 라벨 · 셰브론이 칸을 함께 알립니다 |
| **WCAG 2.4.7** Focus visible | 트리거는 키보드 포커스에 링을 그립니다. 목록 안 키보드 위치는 알약입니다(위 1.4.11 의 ⚠) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 트리거 · 선택지 모든 크기 ✓(가장 작은 선택지 medium 39) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 트리거 large 52 ✓ · 선택지 large 46 ✓. medium 40 · 39 ⚠ — 1280 이상 데스크톱 웹(마우스)에서만 씁니다(예외 — Table Pagination 의 고르기) |
| **ARIA** | 트리거 `<button role="combobox" aria-haspopup="listbox" aria-expanded aria-controls>` — 이름은 Field 의 라벨(`<label for>`)이고, 라벨이 없으면 `aria-label` 입니다. 고른 글은 `role="combobox"` 의 값으로 읽힙니다(라벨 + 값). 오류 `aria-invalid`, 필수 `aria-required`, 읽기 전용 `aria-readonly`. 목록 `role="listbox"`(여럿이면 `aria-multiselectable`) · 짚은 선택지는 `aria-activedescendant`, 선택지 `role="option" aria-selected`(막히면 `aria-disabled`), 묶음 `role="group"` + 제목 `aria-labelledby`. **앱은 listbox · option 대신** 아래 꼴을 씁니다 — Flutter `SemanticsRole` 에 listbox · option 이 없기 때문입니다. 하나 고르기 선택지는 `Semantics(button: true, selected: 고름, label: 제목 + 설명)`("원, 선택됨, 버튼"), 여럿 고르기는 `checked: 고름`("체크됨 · 체크 안 됨")을 더합니다. 목록 노드는 역할을 지어내지 않고 이름만 둡니다("목록 안 · n개 중 m번째" 는 스크롤 자식 수로 OS 가 붙입니다). 이 꼴을 앱 테스트로 고정합니다 |

## Do / Don't

### ✅ Do

- 모든 Select 를 Field 로 감싸 라벨을 답니다.
- placeholder 는 "{값의 종류} 선택" 으로 씁니다.
- "없음" 이 답이 될 수 있으면 "{칸 이름} 없음" 을 맨 앞 따로 묶음에 둡니다.
- 여럿 고르기는 최대 개수를 Field 설명에 적습니다.
- 선택지 글은 명사형으로 짧게, 부연은 한 줄 설명에 씁니다.
- 폰에서도 칸 아래 목록을 씁니다 — 시트는 Input Button 으로 엽니다.

### ❌ Don't

- placeholder 를 라벨 대신 쓰기.
- "해당 없음" · "선택 안 함" 처럼 칸마다 다른 "없음" 글, 지우기 버튼으로 "없음" 받기.
- "전체 선택" 처럼 다른 선택지를 바꾸는 선택지.
- 2 ~ 4개 짧은 선택지를 Select 로 숨기기(Chip · Radio), 검색이 필요한 긴 목록을 Select 로.
- 폼 값을 탭으로 고르기.
- 폰에서 medium(40) 쓰기.

## Specification

`select.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Select 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — select.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#select)
