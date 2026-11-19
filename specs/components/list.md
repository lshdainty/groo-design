# List

> 가로 줄로 된 내용을 세로로 잇는 컴포넌트입니다. 설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 알림 같은 내용 줄을 모두 이것으로 그립니다. 목록(List) · 한 줄(List Item) · 목록 제목(List Header) · 줄 사이 선(ListDivider)으로 이뤄집니다.

수치 원본은 [`list.yaml`](list.yaml)(목록 · 한 줄)과 [`list-header.yaml`](list-header.yaml)(목록 제목)입니다.

[그림: 설정 · 선택 · 내용 줄 — 가운데는 다크](../../site/components/specs/list.tsx#hero)

### 직접 골라 보기

줄의 종류 · 앞 · 뒤 · 맞춤 · 강조 · 상태를 고르면 스펙대로 그린 줄과 그 코드가 바뀝니다. 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/list.tsx#playground)

## Anatomy

[그림: 한 줄은 앞 붙이개 · 본문(제목 · 설명) · 뒤 붙이개로 이뤄지고, 목록 위에 목록 제목을 둡니다](../../site/components/specs/list.tsx#anatomy)

| ⓐ Prefix | 앞 붙이개 — 설정 · 메뉴 줄은 아이콘 22, 색이 뜻을 가진 내용 줄은 타일 40, 은행 · 카드 같은 물건 줄은 로고 타일 40 입니다. 아바타 · 카드 그림 · 체크 · 라디오도 둡니다. |
| ⓑ Title | 제목 — 16 · 400. 무엇인지 한 줄로 적습니다. |
| ⓒ Detail | 설명 — 13 · 옅은 색. 제목만으로 모자랄 때만 둡니다. |
| ⓓ Suffix | 뒤 붙이개 — 값 글자 · 오른쪽 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼. |
| ⓔ List Header | 목록 제목 — 목록 밖, 바로 위에 둡니다. |

한 줄은 두 층입니다 — **바탕 층**(누름 · 호버 · 강조 바탕)과 **콘텐츠 층**(앞 · 본문 · 뒤). 누르면 바탕 층은 안쪽으로 들어와 둥글어지고, 콘텐츠 층만 2px 거리로 줄어듭니다(기초 Feedback 의 "목록 줄은 콘텐츠만").

[표: 부위](list.yaml#slots)

## Properties

### 줄의 종류

같은 모양이 하는 일에 따라 넷으로 나뉩니다.

- **보기만 하는 줄**(`ListItem`) — 누르지 않습니다. 키-값 · 안내 줄.
- **누르는 줄**(`ListButtonItem`) — 줄 전체가 버튼입니다. 화면을 옮기면 오른쪽 화살표를 답니다.
- **링크 줄**(`ListLinkItem`) — 줄 전체가 링크입니다. 다른 페이지 · 바깥 주소로 갑니다.
- **컨트롤 줄**(`ListSwitchItem` · `ListCheckItem` · `ListRadioItem`) — 줄 전체가 라벨이라 줄 어디를 눌러도 끼운 스위치 · 체크 · 라디오가 바뀝니다.

[그림: 줄의 종류 넷](../../site/components/specs/list.tsx#kinds)

모든 줄에 공통인 값입니다(상태마다 바뀌는 값은 아래 State).

[표: 공통](list.yaml#base.enabled)

### Align

맞춤의 기본은 가운데(`center`)입니다 — 앞 · 뒤가 본문의 세로 가운데에 섭니다. 제목이 두 줄을 넘거나 설명이 길면 위(`top`)로 맞춥니다. 한 목록 안에서는 줄마다 맞춤을 섞지 않습니다.

[그림: 가운데 · 위 맞춤](../../site/components/specs/list.tsx#align)

[표: 맞춤](list.yaml#align)

### Highlight

새 알림처럼 주목이 필요한 줄은 바탕을 옅은 브랜드 색(`bg-brand-weak`)으로 바꿉니다(`highlighted`). 바탕만 바뀌고, 점 · 왼쪽 막대는 두지 않습니다. 읽음 · 안 읽음처럼 상태를 알리는 자리는 제목 · 설명의 글로도 알 수 있게 씁니다.

강조 줄을 올리거나 누르면 바탕이 `bg-brand-weak-pressed` 로 짙어지고, 그동안만 설명 · 값 글자를 한 단계 짙은 `fg-neutral-muted` 로 바꿉니다 — `fg-neutral-subtle` 은 짙은 강조 바탕 위에서 4.32:1 로 글자 기준(4.5:1)에 모자라기 때문입니다. 제목 · 화살표는 그대로입니다.

[그림: 강조 — 안 읽은 알림 둘](../../site/components/specs/list.tsx#highlight)

[표: 강조](list.yaml#grid.highlight)

[표: 강조 — 올리거나 누를 때](list.yaml#states.highlight)

### State

누르는 줄 · 컨트롤 줄은 호버 · 포커스 · 누름 · 비활성을 가집니다. 보기만 하는 줄은 누를 것이 없어 상태가 없고, 링크 줄은 막지 않습니다 — 갈 수 없는 곳이면 줄을 빼거나 누르는 줄로 바꿔 막습니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 — 바탕 없음 |
| `hovered` | 웹. 누름과 같은 바탕 — 좌우 6 들어온 `bg-layer-default-pressed`, 모서리 10 |
| `focused` | 웹 · 앱. 키보드 포커스에만 줄 안쪽 링 2px(앱 `PFocusRingStyle.inset`) — 화면 폭 줄은 바깥 링이 잘리기 때문입니다. 터치에는 없습니다 |
| `pressed` | 호버와 같은 바탕 + 콘텐츠 층만 2px 거리 축소(기준 길이가 폭 ÷ 4 라 세로로는 1px 남짓). 강조 줄은 올리거나 누르는 동안 설명 · 값 글자가 `fg-neutral-muted` |
| `disabled` | 제목 · 설명 · 값 글자 · 앞뒤 아이콘이 모두 `fg-disabled`, 타일은 `bg-disabled`. 불투명도로 흐리게 하지 않습니다 |

[그림: 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸습니다](../../site/components/specs/list.tsx#states)

**모드 때문에 누를 수 없는 줄은 보기 줄 색** — 순서 바꾸기 모드처럼 화면의 모드가 잠시 줄 누르기를 거둔 줄(카테고리의 부모 줄)은 막힌 줄(`disabled`)이 아니라 보기만 하는 줄입니다. 누름 · 호버 · 포커스가 없고, 제목 · 설명 · 타일은 보통 줄의 색 그대로입니다. 줄이 고장 나 못 쓰는 것이 아니라 지금 모드에서 할 일이 다를 뿐이라 `fg-disabled` 로 흐리지 않습니다. 앱은 `PListParentItem.readOnly`(누름 · 포커스 없음 · 보통 줄 색 — 누를 일이 없는 "막힌 줄" 과 다릅니다), 웹은 누르지 않는 줄(보기만 하는 줄의 짜임)로 같은 모습을 그립니다.

상태마다 `enabled` 에서 바뀌는 값입니다.

[표: 호버 hovered](list.yaml#base.hovered)

[표: 포커스 focused](list.yaml#base.focused)

[표: 누름 pressed](list.yaml#base.pressed)

[표: 비활성 disabled](list.yaml#base.disabled)

[그림: 직접 눌러 보기 — 누르는 줄 · 컨트롤 줄(Tab 으로 포커스, Space 로 바꿉니다)](../../site/components/specs/list.tsx#live)

[표: 모션](list.yaml#motion)

### 합계에 안 드는 줄

예정(아직 빠지지 않은 돈) · 환불(취소된 돈) 거래처럼 화면의 합계에 들지 않는 줄은 **불투명도로 흐리지 않습니다** — 줄 전체를 흐리면 그 줄을 가르는 단서인 배지까지 흐려지기 때문입니다. 대신 이렇게 둡니다.

- 제목 · 금액만 `fg-neutral-subtle`(흰 바탕 5.50 · 다크 6.09) — 훑어볼 때 합계에 드는 줄과 갈립니다.
- 환불된 금액은 취소선을 긋습니다. 취소선은 보조 기술이 읽지 않으므로 뜻은 배지 글("환불됨")이 말합니다.
- 상태 [Badge](badge.md)("예정" · "환불됨" · "기록만" — `weak` `neutral`)는 보통 대비 그대로입니다(6.58 · 5.93).
- 앞 타일 · 설명 줄은 보통 줄과 같습니다. 누름 · 호버 · 포커스도 보통 줄과 같습니다(막힌 줄이 아닙니다).

[그림: 합계에 안 드는 줄 — 예정 · 환불, 배지는 또렷하게](../../site/components/specs/list.tsx#excluded-rows)

### Prefix

앞 붙이개는 줄이 무엇인지 먼저 알립니다.

- **아이콘 22**(`fg-neutral`) — 설정 · 메뉴 줄.
- **타일 40**(모서리 12) — 색이 뜻을 가진 내용 줄(거래 · 카테고리 · 알림 종류). 바탕은 카테고리 색의 옅은 바탕(`chart-{색}-weak`)이고, 아이콘 20 은 그 색입니다. 아이콘이 없는 카테고리는 태그 아이콘(lucide `tag`) 하나로 그립니다 — 빈 칸 · 첫 글자를 넣지 않습니다. 이체 줄은 회색(`chart-gray-weak` + `chart-gray`)입니다 — 카테고리가 아니라 돈의 이동이기 때문입니다. 크기를 바꾸면 모서리도 크기 × 0.3 으로 바꿉니다.
- **로고 타일 40**([Logo Tile](logo-tile.md)) — 은행 · 증권 · 카드 · 코인 · 금 같은 물건 줄(자산 · 계좌 관리). 기관 색 + 첫 글자이고, 그림이 있으면 덮습니다. 막힌 줄에서도 그대로입니다.
- **카드 그림 56**([Image Frame](image-frame.md) 의 카드 그림) — 카드 혜택 목록처럼 카드 자체가 줄인 자리. 폭 56 · 카드 비율입니다.
- **아바타**([Avatar](avatar.md) — 한 줄이면 36, 이름 + 설명 두 줄이면 42) · **체크 · 라디오**(컨트롤 줄 — 24).

[그림: 앞 붙이개 — 아이콘 · 타일 · 로고 타일 · 카드 그림 · 아바타 · 체크](../../site/components/specs/list.tsx#prefix)

### Suffix

- **값 글자**(16 · `fg-neutral-subtle`) — 지금 고른 값(기본 통화 "대한민국 원").
- **오른쪽 화살표**(18 · `fg-neutral-subtle`) — 화면을 옮기는 줄에만 답니다.
- **스위치 32** · **체크 24** · **라디오 24** — 컨트롤 줄. 스위치는 제목 16 줄이라 32 입니다(Switch 스펙).
- **작은 버튼** · **금액** — 금액은 16 / 22 · 700 · 고정폭 숫자입니다(DESIGN.md Typography 의 "글자 역할"). 색은 지출 · 이체 `fg-neutral`, 수입만 `fg-brand`("+" 와 함께)입니다 — 금액을 빨갛게 칠하지 않습니다. 빨강은 증감(▲) 한 뜻입니다. 합계에 안 드는 줄(예정 · 환불)은 위 "합계에 안 드는 줄" 처럼 `fg-neutral-subtle` 입니다.

[그림: 뒤 붙이개 — 값 글자 · 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼](../../site/components/specs/list.tsx#suffix)

**바탕이 보이는 줄 끝 버튼은 상자 끝을 끝선에 맞춥니다** — `neutralWeak` · `neutralOutline` 처럼 상자가 보이는 버튼은 줄의 값 끝과 같은 끝선(화면 여백 24)에 상자 끝이 옵니다. 글 끝을 끝선에 맞추려고 14 를 번지게 하는 것은 상자가 안 보이는 글 버튼(`ghost` · List Header 동작)뿐입니다 — 상자가 보이는 버튼을 번지게 하면 상자가 화면 여백을 먹고 줄 값과 끝선이 어긋납니다.

**줄 끝 작은 버튼은 누르는 영역 44 가 줄보다 이깁니다** — 뒤 붙이개의 작은 버튼(문자 함 줄의 [×] · 기기 줄의 [로그아웃] 같은 줄 끝 동작)은 보이는 상자가 44 보다 작아도 누르는 영역 44 를 지키고, 그 44 안을 누르면 줄이 아니라 버튼이 눌립니다. 글 버튼이 줄 여백 쪽으로 번져(블리드) 보이는 글 밖에 놓인 자리도 같습니다 — 버튼 둘레를 눌렀는데 옆의 줄이 대신 열리면 안 됩니다. 웹은 Button 의 누르는 영역(`::before` 44)이 줄 전체를 덮는 누르는 층(누르는 줄 버튼 · 링크의 `::after`) 위에 섭니다 — 뒤 붙이개 안의 버튼 · 링크는 그 층보다 한 단계 위(z-index 1)입니다. 앱은 줄이 `PTouchTargetScope` 로 버튼의 넓힌 영역을 이어 받습니다 — `PButton` 이 공용 `PTouchTarget` 을 써서 스코프가 찾습니다.

**제목 뒤 배지는 줄이 바뀌면 앞 틈 없이** — 제목 뒤에 붙인 배지(기본 · 예정 · 기록만)는 제목과 사이 간격으로 띄우고, 제목이 길거나 글자가 커져 배지가 다음 줄 맨 앞에 서면 앞 틈을 두지 않습니다 — 배지가 제목 글의 왼쪽 선에 맞습니다. 그래서 틈은 배지의 왼쪽 여백이 아니라 제목 · 배지 묶음의 사이 간격으로 줍니다(웹 flex-wrap 의 `gap` · 앱 `Wrap(spacing)` — 줄 맨 앞이면 틈 0). 배지에 왼쪽 여백(웹 `ml-*` · 앱 앞 `Padding`)을 달면 두 줄째 맨 앞 배지가 글보다 안으로 들어갑니다.

#### 값이 길 때

뒤 붙이개는 줄지 않고 본문이 양보합니다(뒤 붙이개 `flexShrink 0` · 본문 `flexGrow 1`). 값이 길어 본문이 눌려도 겹치지 않게 세 가지만 둡니다.

- **본문은 제목의 가장 긴 낱말 폭까지 줄어듭니다** — 그보다 좁아지지 않습니다(`min-width: min-content`, 제목은 낱말 단위 `keep-all`). 뒤 여백 10 은 따로입니다. "장소" 처럼 짧은 제목은 한 줄 그대로 서고, 값이 남은 폭에서 줄을 바꿉니다. 줄 제목은 이름 한두 낱말로 짧게 씁니다. 공백 없는 긴 제목(한 낱말이 줄 안 폭 − 앞 붙이개의 절반을 넘는 것)은 그 절반에서 글자 사이로 끊습니다 — 값이 줄의 절반 아래로 밀리지 않게 하기 위해서입니다.
- **제목은 낱말 단위로만 바꿉니다**(Typography — `keep-all` + `break-word`) — 본문이 가장 긴 낱말보다 좁아지지 않으니 글자 사이에서 끊을 일이 없습니다. 웹 · 앱은 같은 결과를 다른 길로 만듭니다 — 웹은 높이 0 의 자(`::before`)가 본문 최소 폭을, 앱은 낱말 폭을 잰 값이 본문 최소 폭을 정합니다(`list.yaml` title 비고). **설명은 칸 끝에서 끊습니다**(`overflow-wrap: anywhere`) — 평소에는 단어 단위로 바꾸고, 본문 폭이 설명의 낱말 하나보다 좁을 때만 글자 사이에서 끊어 칸 밖으로 넘치지 않습니다. 설명을 [Tag Group](tag-group.md) 으로 그리면 그 스펙대로 한 줄 말줄임입니다 — 잘린 이름의 "…" 뒤 틈이 다른 " · " 자리보다 조금 넓어도 그대로 둡니다(Tag Group 의 "말줄임 뒤 틈").
- **글 값(이메일 · 계좌번호 · 긴 이름 · 장소)은 줄 끝에서 끊습니다** — 본문이 제목 낱말 폭이 된 뒤에도 남는 폭보다 길면 줄 끝에서 줄을 바꿉니다. 본문 위로 넘쳐 덮지 않습니다. 레시피는 `suffix` 에 글을 그대로 넘긴 값 글자만 이렇게 다룹니다. **값은 줄 수와 상관없이 줄 끝 오른쪽 맞춤입니다** — 두 줄 · 세 줄이어도 모든 줄의 오른쪽 끝이 한 줄 값과 같은 세로선에 섭니다(글 맞춤 end, 꺾쇠가 있는 줄은 꺾쇠 앞이 끝선). 값이 제목 옆에 붙어 줄마다 값 자리가 달라 보이면 안 됩니다. 좁은 줄에서 본문 아래로 내려간 값만 왼쪽 맞춤입니다(아래 "큰 글자에서 값을 본문 아래로").

금액 · 화살표 · 스위치 · 작은 버튼은 그대로 한 덩어리입니다 — 금액은 한 줄로 서고, 본문이 그만큼 눌립니다. 값을 줄여 적는 것(억 단위 등)은 그 화면이 정합니다. 값의 폭이나 종류에 따라 값을 아래 줄로 내리거나, 가운데를 잘라 줄이지 않습니다 — 값 폭으로 가르는 규칙은 없습니다. 줄 자체가 좁을 때만 아래 "큰 글자에서 값을 본문 아래로" 가 값을 내립니다.

[그림: 가장 나쁜 값 — 긴 제목 + 큰 금액(320) · 52자 이메일 키-값(360), 겹치지 않습니다](../../site/components/specs/list.tsx#long-values)

[표: 본문 · 뒤 붙이개의 폭](list.yaml#base.enabled@body+title+detail+suffix+suffixText)

#### 큰 글자에서 값을 본문 아래로

**줄 안 폭이 제목 글자 16개(16em)보다 좁을 때만** 값(글 값 · 금액 · 배지)을 본문 아래로 내립니다. 글자를 130 · 200% 로 키우면 긴 값 옆 제목이 한 글자 폭 기둥이 되어 줄 하나가 화면 여러 장 길이가 되기 때문입니다.

- **이것은 위 "값이 길 때" 의 예외이고, 기준이 다릅니다.** 기준은 값의 길이가 아니라 **줄 안 폭**입니다 — 글자 배율 · 화면 폭으로 줄이 좁아질 때만 내립니다. 줄 안 폭이 16em 이상이면 값이 아무리 길어도 위 "값이 길 때" 그대로입니다.
- **줄 안 폭** = 줄 폭 − 좌우 여백(앞 붙이개 · 꺾쇠 단추 자리는 들어갑니다). em 은 제목 글자(t5) 크기라 글자 배율을 따라 커집니다 — 보통 글자에서 256 이라 320 폰(줄 안 272)까지 한 줄이고, 360 폰(줄 안 312)은 글자 약 122% 부터(130% 면 15em) 내려갑니다. 화면이 고르지 않습니다 — 줄이 스스로 잽니다(웹 `16rem` 컨테이너 쿼리 · 앱 `LayoutBuilder` 로 16 × t5 × 글자 배율, 같은 값).
- **모양** — 제목 · 설명 · 값이 위아래로 쌓이고 제목이 줄 안 폭을 다 씁니다. 값은 설명 아래 4(본문 사이 2 + 2)에, 본문 칸 안 왼쪽 맞춤으로 섭니다. 앞 붙이개는 위에 맞춥니다. 금액은 쉼표 뒤에서만 줄을 바꾸고(Typography 의 낱말 단위 줄바꿈의 예외 — 웹 `<wbr>` · 앱 U+200B), 글 값(이메일 · 계좌번호)은 위 "값이 길 때" 처럼 줄 끝에서 끊습니다.
- **목록은 폭이 정해진 부모 안에 둡니다(웹)** — 줄(`li`)이 폭을 재는 컨테이너(`container-type: inline-size`)라, 내용 폭으로 크기를 정하는 부모(`inline-block` · `w-max` · `w-fit` 팝오버 · 가로 flex 의 `auto` 항목) 안에서는 줄 폭이 0 이 됩니다. 블록 · 화면 폭 · 폭을 정한 팝오버(알림 380 처럼) · 시트 안에 둡니다. 앱은 `LayoutBuilder` 라 해당하지 않습니다.
- **뒤 붙이개의 배지는 값 쪽입니다** — 금액 옆 상태 배지처럼 뒤 붙이개에 둔 [Badge](badge.md) 는 누르지 않는 보이기만 하는 글이라 값과 함께 본문 아래로 내려갑니다. 앱 `splitListSuffix` 는 `PBadge` 를 값으로 가르고, 웹은 버튼 · 링크 · 입력 · 아이콘이 아닌 뒤 붙이개를 값으로 내립니다.
- **조작 요소는 줄 끝 그대로입니다** — 화살표 · 스위치 · 체크 · 라디오 · 작은 버튼은 내리지 않습니다. 누르는 자리를 옮기지 않기 위해서입니다. 글자 배율 상한(150% 에서 멈추기)은 두지 않습니다.
- **편집 칸 붙이개도 내려갑니다** — 뒤 붙이개가 입력칸(더치페이 참여자 줄의 금액 칸)이면 큰 글자 · 좁은 줄에서 그 칸이 본문 아래로 내려가 줄 안 폭을 다 씁니다. 칸 폭은 px 입니다(글자 배율로 넓히지 않습니다). 고정 폭 칸 옆에서 이름이 한 글자 폭으로 눌리지 않게 하기 위해서입니다.
  - **문턱은 칸 폭으로 잽니다** — 편집 칸이 있는 줄은 16em 대신 **줄 안 폭 < 앞 자리 + 칸 폭 × 2** 이면 칸을 내립니다(글자 배율과 상관없습니다). 본문은 공백 없는 긴 이름에서 (줄 안 폭 − 앞 자리) ÷ 2 까지 줄어드니, 그 이름에서도 칸이 줄 안에 남으려면 이만큼이 필요합니다. 웹 컨테이너 쿼리 · 앱 `LayoutBuilder` 가 같은 식입니다.
  - **예 — 더치페이 참여자 줄**: 직접 입력 칸 172(한 사람 몫 최대 9,999,999,999원이 다 보이는 폭)는 앞 자리(아바타) 54 와 더해 줄 안 398 · 줄 446 이 문턱입니다. 폰 폭은 모두 이보다 좁아(402 폭 폰 포함) **글자 100% 에서도 금액 칸이 이름 아래 전폭**입니다. 비율 칸 96 은 줄 안 246 이 문턱이라 폰에서도 줄 끝에 남습니다.

[그림: 큰 글자 — 줄 안 폭이 16em 보다 좁으면 값이 본문 아래로(폭 360 · 글자 100 · 130 · 200%)](../../site/components/specs/list.tsx#narrow)

[표: 좁은 줄 — 값을 본문 아래로](list.yaml#width)

### Detail

설명은 제목 아래 2 떨어져 13 으로 씁니다. 제목만으로 무엇인지 알 수 있으면 두지 않습니다. 길어지면 두 줄까지 쓰고, 그 이상이면 맞춤을 위로 바꿉니다. 분류 · 자산 · 시각처럼 여러 메타를 잇는 설명 줄은 [Tag Group](tag-group.md)(`t3` · 한 줄 말줄임)입니다.

[그림: 설명 — 한 줄 · 두 줄](../../site/components/specs/list.tsx#detail)

### 목록 제목(List Header)

목록 밖, 바로 위에 두는 제목입니다. 두 가지입니다.

- `mediumWeak`(기본) — 14 · 500 · `fg-neutral-subtle`. 줄보다 앞서지 않습니다.
- `boldSolid` — 14 · 700 · `fg-neutral`. 화면을 크게 나누는 묶음에만 씁니다.

오른쪽에 작은 버튼(도움말 · 전체 보기)을 둘 수 있습니다 — 글이면 글 버튼(14 · 700 · `fg-neutral-muted` · 보이는 높이 36, 위아래로 블리드해 줄 높이를 바꾸지 않습니다)입니다. Card 머리 동작과 같은 값입니다. 글 버튼이 요청을 보내는 동안("모두 읽음")은 [Button](button.md) `ghost` 의 로딩과 같습니다 — 라벨 자리 가운데 로딩 원(회색 트랙 위 본문색), 라벨은 투명하게 두어 폭이 그대로이고, 누름은 막고 `aria-busy` 를 답니다. 막힌 글(비활성)로 바꾸지 않습니다 — Button 의 "로딩 — 라벨을 바꾸거나 비활성으로 돌리지 않는다" 와 같은 까닭입니다. 웹 · 앱 모두 이 자리를 `ghost` small 의 `loading` 으로 그립니다(앱 `PTextButton` 의 `loading`). 화면 맨 위 제목 · 카드 제목은 목록 제목이 아닙니다 — 카드 제목은 [Card](card.md) 의 머리(16 / 22 · 700)입니다.

오른쪽 작은 버튼은 큰 글자에서 오른쪽 동작이 머리 폭의 절반을 넘으면 제목 아래 줄 오른쪽 끝으로 내립니다 — 제목은 한 줄 전체 폭으로 읽히고 머리가 버튼 한 줄(36)만큼 높아집니다. 평소(100% · 130%)는 한 줄 그대로입니다. [Button](button.md) 짝의 반 폭 판정과 같고, 카드 머리 · 아코디언 목록 머리 · List Header 가 같은 규칙입니다. 판정은 이렇습니다 — 동작의 보이는 상자 폭(글 + 좌우 14 · 14)에서 끝 블리드 14(머리 여백으로 내어 걸리는 몫)를 빼고 사이 10 을 더한 값이 머리 안쪽 폭의 절반 이하면 한 줄, 넘으면 내립니다. 레시피의 flex 줄바꿈(제목 최소 50%)이 그대로 이 셈입니다 — 예를 들어 머리 안쪽 300 이면 오른쪽 버튼 보이는 상자 154 까지 한 줄 · 155 부터 내려갑니다(카드 머리 · 아코디언 목록 머리는 156 / 157, List Header 는 사이가 10 이라 154 / 155). 글자 200% 에서 360 화면의 "모두 펼치기"(154)는 한 줄이고, 320 화면에서는 "전체 보기"(130)는 한 줄 · "모두 펼치기" 는 내려갑니다. 웹 · 앱 모두 이 셈으로 판정합니다.

**제목 태그** — 목록 제목은 머리말입니다(웹 `h2` 기본 · 앱 `headingLevel: 2`) — 화면 제목(1) 아래 단계라 카드 제목과 같은 단계입니다. 카드 · 대화상자 · 시트처럼 자기 제목(2)을 가진 상자 안이면 한 단계 아래(웹 `as="h3"` · 앱 3)로 내립니다. 오른쪽 작은 버튼이 있으면 **제목 태그는 제목 글에만** 걸고 버튼은 제목 밖(나란한 형제)에 둡니다 — 제목을 줄 전체에 걸면 머리말 이름이 "카테고리별 예산 전체 보기" 처럼 버튼 글과 섞여 읽히기 때문입니다. 앱 `PListHeader` 도 제목 글에만 `Semantics(header)` 를 걸고 버튼은 밖에 둡니다. Card 의 `CardTitle` · `CardAction` 과 같은 방식입니다.

[그림: 목록 제목 두 가지](../../site/components/specs/list.tsx#header)

[표: 목록 제목](list-header.yaml#variant)

[표: 목록 제목 — 공통](list-header.yaml#base)

**묶음 사이 · 상자 안의 여백** — 목록 제목의 위 여백은 묶음이 이어지는 자리가 정합니다. 첫 묶음은 기본 그대로 두고, 앞 목록에 이어지는 묶음은 그 사이만큼 위를 늘립니다. 이미 좌우 24 를 가진 상자(칸 묶음 · 대화상자 · 시트 본문) 안에서는 좌우를 0 으로 두어 제목이 그 상자의 글 줄에 섭니다 — 24 를 두 번 들이지 않습니다. 값은 토큰으로만 줍니다(아래 "여백을 바꿀 때"). 웹 · 레시피는 바깥 여백을 `className`(`pt-x4` · `mt-x4` · `px-0`)으로 주고, 앱은 같은 자리를 `PListHeader.topInset` · `inset` 으로 줍니다. 레시피에 같은 이름의 속성을 따로 두지 않습니다 — shadcn 부품은 바깥 여백을 `className` 으로 받기 때문입니다.

### 줄 사이 선(ListDivider)

줄 사이 선은 기본으로 두지 않습니다 — 줄의 위아래 여백이 줄을 가릅니다. 촘촘한 목록 · 설명 없는 긴 목록처럼 구분이 필요할 때만 `ListDivider`(1px · `stroke-neutral-subtle`)를 넣습니다. 줄 폭 전체가 기본이고, 앞 붙이개가 있는 목록은 들일 수 있습니다(좌우 24). 목록 밖의 구분선은 [Divider](divider.md)(같은 색)입니다.

[그림: 구분선 — 없음(기본) · 줄 폭 · 들임](../../site/components/specs/list.tsx#divider)

### 하위 줄 — 접는 부모 줄

카테고리처럼 부모 · 하위 두 단계로 된 목록에서 줄 자체는 편집을 열고 하위 줄만 접을 때는, 부모 줄 앞에 **꺾쇠 단추**를 둡니다(`nest="parent"`). 단추는 보이는 상자가 곧 누르는 영역 44 이고, 줄 앞 4 · 단추 뒤 4 를 지나 앞 붙이개가 52 에서 시작합니다. 꺾쇠는 lucide `chevron-right` 20 `fg-neutral-subtle` 입니다 — 접혀 있으면 오른쪽, 펼치면 아래로 90° 돕니다(300ms — Accordion 과 같습니다). 이름은 "{카테고리} 하위 카테고리" 로 고정하고 펼침은 `aria-expanded` 가 알립니다 — "접기 · 펼치기" 로 바꾸지 않습니다. 하위 줄(`nest="child"`)은 부모의 제목 자리 104(= 4 + 44 + 4 + 타일 40 + 12)에서 시작해 하위 타일이 부모 제목 아래에 섭니다 — 누름 바탕은 줄 폭 그대로입니다. 하위가 없는 부모 줄 · 늘 펼쳐 두는 화면(편집 모드)도 꺾쇠 자리를 같은 폭으로 비워 부모 타일이 모두 52 에 섭니다 — 타일이 두 세로줄(52 · 104)로 정리됩니다. 처음 펼침은 화면이 정합니다 — 카테고리는 모두 펼친 채 엽니다(기본 지출 카테고리의 하위는 0 ~ 6개).

늘 펼쳐 두는 화면(편집 모드)은 이름 있는 스위치 `collapsible={false}` 로 켭니다 — 꺾쇠 단추를 그리지 않고(자리는 같은 폭으로 비웁니다), 하위 줄은 늘 보이며 `aria-expanded` 를 두지 않습니다. [Tree View](tree-view.md) 의 `collapsible` 과 같은 이름 · 같은 뜻입니다. 접을 수 있는 부모 줄(`collapsible` 기본 `true`)은 꺾쇠 단추의 이름 `expandLabel` 이 필수입니다 — 하위가 없는 줄에도 같은 이름을 줍니다(하위가 생기면 바로 단추가 섭니다). 이름을 빠뜨리면 레시피 타입이 막습니다.

[그림: 같은 카테고리 — 보통 화면(접는 줄)과 편집 화면(collapsible={false} — 꺾쇠 자리는 비우고 하위 줄은 늘 보입니다)](../../site/components/specs/list.tsx#nested-fixed)

이 줄은 편집 대화상자를 여는 줄이라 오른쪽 화살표를 달지 않습니다(화살표는 화면을 옮기는 줄에만) — 접힌 부모 줄에 › 가 둘(접힘 · 이동) 생기지 않게 합니다. 여러 단계에서 하나를 고르는 나무는 [Tree View](tree-view.md) 입니다.

[그림: 카테고리 — 줄 앞 꺾쇠 단추 44 · 하위 줄 104 · 하위 없는 줄은 빈 자리(폰 · 데스크톱)](../../site/components/specs/list.tsx#nested)

[표: 단계](list.yaml#nest)

[표: 펼침](list.yaml#expanded)

[표: 꺾쇠 단추 — 상태](list.yaml#states.nest)

[표: 늘 펼침 — collapsible={false}](list.yaml#mode)

### 들인 줄 — 위 스위치에 딸린 값

위 스위치를 켜야 뜻이 있는 값 줄(알림 설정의 방해 금지 시작 · 종료, 메일 발송 주기)은 앞 붙이개 자리에 앞 아이콘만 한 빈 칸(`indent`)을 두어 제목이 위 줄의 제목 세로줄에 섭니다. 하위 줄(`nest="child"`)과 다릅니다 — 하위 줄은 접는 부모의 자식 항목이고, 들인 줄은 같은 설정의 세부 값이라 접지 않습니다. 위 스위치가 꺼지면 막히고 값은 그대로 보입니다. 위 줄에 앞 아이콘이 없으면 들이지 않습니다.

[표: 들인 줄](list.yaml#base.enabled@indent)

## Guidelines

### 모든 줄을 List 로

설정 · 메뉴 · 선택 · 키-값 줄과 거래 · 할 일 · 메모 · 알림 같은 내용 줄을 모두 List 줄로 그립니다. 줄의 여백 · 글자 · 누름 · 구분선은 List 가 정하고, 앞의 타일 · 뒤의 금액처럼 그 화면만의 자리만 화면이 채웁니다.

[그림: 같은 줄로 그린 설정 · 가계부](../../site/components/specs/list.tsx#all-rows)

### 목록 제목으로 묶기

줄이 많으면 목록 제목으로 묶습니다. 같은 묶음은 어느 화면에서나 같은 모양이어야 합니다 — "카테고리별 예산" 이 화면마다 다른 크기로 그려지지 않게 합니다.

[그림: 목록 제목으로 묶은 설정](../../site/components/specs/list.tsx#group-guide)

### 누르는 줄만 누르게

화면을 옮기는 줄에만 오른쪽 화살표를 답니다. 화살표가 있는데 눌리지 않는 줄, 눌리는데 아무 표시가 없는 줄을 만들지 않습니다. 보기만 하는 줄은 호버 · 누름 바탕이 생기지 않습니다.

[그림: 화살표는 화면을 옮기는 줄에만](../../site/components/specs/list.tsx#chevron-guide)

### 줄 안의 누르는 것은 셋 이하

한 줄에 따로 누르는 것(줄 자체 · 작은 버튼)은 셋 이하로 둡니다 — 넷 이상은 피합니다. 넷째가 필요하면 줄을 나누거나 상세 화면으로 옮기는 쪽을 먼저 봅니다. 스위치 · 체크 · 라디오를 끼운 줄에는 다른 버튼을 두지 않습니다(아래 "스위치 · 체크 · 라디오 줄").

[그림: 누르는 자리 하나 · 둘 · 셋 — 그리고 넷](../../site/components/specs/list.tsx#targets-guide)

### 줄의 동작은 들어간 화면에

목록 줄 끝에는 ⋮(더보기)를 두지 않습니다 — 가계부든 카테고리 설정이든 같습니다. 줄을 누르면 한 단계 들어가고(상세 · 수정), 그 항목의 동작은 들어간 화면에 둡니다 — 하나(삭제)면 바닥 왼쪽 [삭제](Button `ghost` + `critical`), 여럿이면 머리 오른쪽 ⋮ → [Menu](menu.md)(1280 미만 [Menu Sheet](menu-sheet.md))입니다. 폰의 [밀기](swipe-actions.md)는 지름길로 남습니다. 줄에 ⋮ 를 둘 수 있는 건 콘텐츠가 높은 카드(사진 · 여러 줄 · 버튼이 든 카드)의 머리뿐이고, 데스크톱 데이터 표의 줄은 이 규칙 밖입니다([Table](table.md)). 규칙 전문은 [Menu](menu.md) 의 "줄의 동작" 에 있습니다.

**들어갈 상세가 없는 줄의 동작 하나는 줄 끝 글 단추** — 줄을 눌러 들어갈 상세가 없는 목록(보기만 하는 줄)에서 그 항목의 동작이 하나면 줄 끝(뒤 붙이개)에 [Button](button.md) `ghost` · `small` 글 단추를 둡니다. 지우기 · 끊기처럼 되돌릴 수 없으면 `critical` 이고, 누르면 [Alert Dialog](alert-dialog.md) 로 묻습니다. 위 "바닥 왼쪽 [삭제]" 는 들어갈 상세가 있을 때입니다 — 상세가 없는 줄에 동작 하나를 두려고 상세 화면을 새로 만들지 않습니다. 동작이 둘 이상이면 상세를 둡니다.

### 스위치 · 체크 · 라디오 줄

스위치 · 체크 · 라디오를 끼우면 줄 전체가 라벨이 됩니다 — 줄 어디를 눌러도 바뀝니다. 이 줄에는 따로 누르는 버튼을 같이 넣지 않습니다. 약관처럼 따로 볼 내용은 제목 안의 링크로 두고, 그 링크를 눌러도 줄의 값이 바뀌지 않게 합니다. 줄을 누르면 줄의 콘텐츠가 함께 줄고, 끼운 스위치 · 체크 · 라디오는 따로 줄지 않습니다.

[그림: 컨트롤 줄 — 줄 어디를 눌러도 바뀝니다](../../site/components/specs/list.tsx#control-guide)

### 하나 고르기 · 여럿 고르기

목록에서 하나를 고르면 라디오(24)를 뒤에, 여럿을 고르면 체크(24)를 앞이나 뒤에 둡니다. 고른 것과 안 고른 것이 모두 보입니다. 한 묶음에서 라디오와 체크를 섞지 않고, 하나 고르기는 두 줄 이상이어야 합니다. 시트 안의 하나 고르기 목록(고르면 닫히는 고르기 시트)은 이미 고른 줄을 다시 눌러도 시트를 닫습니다 — 값은 그대로이고 요청은 나가지 않습니다([Select](select.md) · [Input Button](input-button.md) 의 시트도 같습니다). 화면 안에 놓인 라디오 묶음은 해당하지 않습니다.

거래 · 이체 같은 내용 줄의 **고르기 모드**는 체크(앞) + 앞 타일 + 뒤 값 줄입니다 — 체크 다음에 그 줄의 타일을 앞 붙이개 사이만큼 띄워 잇고, 뒤 값(금액)은 보이기만 합니다. 줄 어디를 눌러도 체크가 바뀌고 따로 누르는 것은 두지 않습니다(위 "스위치 · 체크 · 라디오 줄"). 체크를 뒤에 두는 줄은 뒤 붙이개가 체크 하나입니다. 레시피는 `ListCheckItem` 의 `markPosition="prefix"` + `prefix` + `suffix` 로 그립니다.

[그림: 기본 통화 — 하나 고르기는 라디오](../../site/components/specs/list.tsx#select-guide)

### 순서 바꾸기 모드

줄의 순서를 사용자가 정하는 목록(홈 위젯 차례 · 카테고리 차례)은 순서 바꾸기 모드에서 옮깁니다. 세 길을 함께 둡니다.

- **손잡이** — 줄 앞 붙이개 자리에 끌기 손잡이(`grip-vertical` · 누르는 영역 44)를 두고, 포인터로 끌어 옮깁니다. 손잡이는 이름이 있는 단추입니다("{항목 이름}" 을 넣습니다). 줄 자체는 누르지 않습니다 — 모드 때문에 누를 수 없는 줄은 위 "보기 줄 색" 입니다.
- **키보드** — 손잡이에 초점을 두고 `↑` · `↓` 로 한 칸씩 옮깁니다. 옮긴 뒤에도 초점은 그 손잡이에 남습니다.
- **알림** — 옮길 때마다 바뀐 자리를 `aria-live="polite"` 로 한 번 읽습니다(끌기 · 키보드 모두). 끌기만 되는 목록은 두지 않습니다 — WCAG 2.5.7 Dragging Movements.

### 끌 수 없는 켬 — 칸만 막는다

체크 줄 가운데 늘 켜져 있어야 하는 줄(숨길 수 없는 기본 캘린더)은 **칸만 막힌 켬**(Checkbox `disabled` + `checked` — 회색 칸 · 회색 체크)으로 두고, 제목 · 앞 붙이개(색 점 · 타일) · 배지는 보통 줄과 같은 색입니다(`locked`). 줄 전체를 막는 `disabled` 를 쓰지 않습니다 — 제목이 회색이면 "꺼진 것" 으로 읽히고, 그 줄의 색 점이 사라지기 때문입니다. 끌 수 없는 까닭은 배지(예: "기본")가 말합니다. 줄은 누르지 못하고 포커스에서 빠지며(막힌 칸과 같습니다), 보조 기술은 "개인, 기본, 체크됨, 사용할 수 없음" 으로 읽습니다.

```tsx
<ListCheckItem locked title={<>개인 <Badge>기본</Badge></>} />
```

### 여백을 바꿀 때

줄의 여백은 화면에 맞게 바꿀 수 있습니다 — 단 토큰으로만 바꾸고, 좌우는 24 보다 좁히지 않으며, 한 목록 안에서는 줄마다 같게 둡니다.

예를 들어 큰 숫자 아래 지표를 잇는 보기만 하는 키-값 줄 묶음(예산 · 순자산 띠의 지표, 고정 · 변동 통계)은 위아래를 8(`spacing-x2`)로 좁힙니다. 웹(`[&_[data-slot=list-content]]:py-x2`) · 앱(`PList.verticalPadding`)이 같은 값입니다. 누르는 줄이 아니라 줄 높이가 44 아래여도 됩니다. 상세 안 키-값 줄 · 누르는 줄은 기본 12 그대로입니다.

[그림: 한 목록 안에서 줄마다 여백이 다르면 맞춤이 어긋납니다](../../site/components/specs/list.tsx#spacing-guide)

### 카드 안의 목록

카드 안에 목록을 넣으면 누름 바탕의 모서리를 카드 모서리에서 카드 가장자리 ~ 바탕 거리를 뺀 값으로 맞춥니다(동심 모서리). 기본 10 은 모서리 16 인 카드에 줄을 바로 넣은 경우입니다 — 바탕이 좌우 6 들어오므로 16 − 6 입니다. 카드에 안쪽 여백을 더 두면 그만큼 더 뺍니다. 그대로 두면 바탕의 둥근 정도가 카드와 어긋납니다. 레시피에서는 목록(`List` · `ListRadioGroup` · `ListCheckGroup`)의 `itemRadius` 로 바꿉니다. 목록을 담은 카드의 머리 · 여백은 [Card](card.md) 의 목록 카드입니다 — 카드 안 여백은 줄과 같은 24(머리 위 · 좌우 24, 카드 아래 12 + 줄 12)입니다.

[그림: 카드 안의 목록 — 동심 모서리](../../site/components/specs/list.tsx#concentric-guide)

### 목록을 두는 바탕

목록은 흰 바탕(`bg-layer-default`)이나 시트 · 대화상자(`bg-layer-floating`) 위에 둡니다. 누름 · 호버 바탕(`bg-layer-default-pressed`)이 불투명한 색이라, 회색 바탕(`bg-layer-basement`) 위에서는 바탕과 거의 같아(라이트 1.02:1) 눌러도 보이지 않습니다. 그래서 놓이는 바탕에 따라 고릅니다 — 흰 면(띠 · 카드 · 흰 화면 · 시트 · 대화상자) 위에서는 그대로 두고, 회색 바닥 위에서는 흰 면을 먼저 깝니다. 어느 화면이 띠 · 흰 화면 · 카드인지는 DESIGN.md Layout 의 "화면 바탕" 한 곳에 적습니다.

[그림: 흰 바탕 위의 목록 · 회색 바탕 위의 목록 — 둘 다 가운데 줄을 누른 순간](../../site/components/specs/list.tsx#surface-guide)

### 앞 붙이개 고르기

설정 · 메뉴 줄은 아이콘, 색이 뜻을 가진 내용 줄은 타일입니다. 물건(은행 · 카드 · 증권) 줄은 로고 타일입니다. 한 묶음 안은 같은 종류로 둡니다 — 자산 목록은 로고 타일, 거래 목록은 카테고리 타일입니다. 앞 붙이개가 섞이면 왼쪽 시작선 · 크기가 갈립니다. 다른 물건이 한 결과에 나오면(거래와 자산을 함께 찾는 검색) 목록 제목(거래 · 자산)으로 묶음을 나눕니다.

[그림: 설정은 아이콘, 가계부는 타일](../../site/components/specs/list.tsx#prefix-guide)

[그림: 섞이는 결과 — 목록 제목(거래 · 자산)으로 묶음을 나눔 · 한 목록에 섞음](../../site/components/specs/list.tsx#mix-guide)

### 값 글 — 빈 값 · 사라진 값 · 기관

- **"없음" 이 답인 줄**(계좌·카드 · 카테고리 · 결제 수단) — "{칸 이름} 없음" `fg-placeholder`. [Select](select.md) 의 "없음" 선택지와 같은 글입니다.
- **꼭 고르는 줄**(이체의 보내는 · 받는 계좌) — "없음" 선택지가 없으니 "{칸 이름} 선택" `fg-placeholder`([Input Button](input-button.md) 의 placeholder 글)입니다. 저장을 누르면 줄 아래 Field 오류로 알립니다.
- **같은 값을 가질 수 없는 두 줄**(이체의 보내는 · 받는 계좌) — 받는 계좌 후보에서는 보내는 계좌를 뺍니다. 보내는 계좌 후보는 모두 보이고, 받는 계좌와 같은 것을 고르면 받는 계좌를 비웁니다 — 저장을 누르면 받는 계좌 줄 아래 Field 오류("받는 계좌를 골라주세요.")입니다. 규칙이 비운 칸은 사용자가 바꾼 값이 아니므로 닫기 전에 묻는 "바뀐 값" 에 세지 않습니다.
- **목록에서 사라진 기록 값** — 거래를 고칠 때 이미 지운 계좌 · 카테고리는 기록이니 값을 지우지 않고 "지운 계좌" · "지운 카테고리" 로 보입니다. "없음" 으로 보이면 저장되는 값과 말이 어긋나기 때문입니다. 프리셋 · 문자로 채운 값은 기록이 아니므로 비우고 칸 오류로 알립니다.
- **"{기관} · {이름}"** — 상세 값 줄의 꼴입니다. 기관과 이름이 같으면 한 번만 씁니다("삼성카드"). 폼 값은 이름만 씁니다.

## 코드

레시피 `recipes/shadcn/components/ui/list.tsx` 를 씁니다 — `List` · `ListItem` · `ListButtonItem` · `ListLinkItem` · `ListSwitchItem` · `ListCheckItem` · `ListCheckGroup` · `ListRadioGroup` · `ListRadioItem` · `ListDivider` · `ListHeader` · `ListTile` · `ListParentItem`. 아래 미리보기는 스펙 값으로 그린 모습입니다.

`ListParentItem` 은 하위 줄을 접는 부모 줄입니다 — `ListButtonItem` 의 속성(`title` · `detail` · `prefix` · `suffix` · `onClick` …)에 `collapsible`(기본 `true`) · `expandLabel`(꺾쇠 단추의 고정 이름 — `collapsible` 이면 필수) · `open` · `defaultOpen` · `onOpenChange(open)` 을 더 받고, 자식(`ListButtonItem` …)이 하위 줄이 됩니다. 자식이 없으면 꺾쇠 자리를 비웁니다. `collapsible={false}` 는 늘 펼친 편집 화면입니다 — 꺾쇠 자리를 비우고 하위 줄을 늘 보이며, `expandLabel` · `open` · `defaultOpen` · `onOpenChange` 를 받지 않습니다. 두 갈래는 유니언 타입이라 `collapsible={false}` 없이 `expandLabel` 을 빠뜨리면 타입 오류입니다(`{ collapsible?: true; expandLabel: string; open?; defaultOpen?; onOpenChange? } | { collapsible: false }`). 꺾쇠 단추(`aria-expanded` · `aria-controls`)와 하위 줄 묶음(`ul` — 104 들임 · 높이 300ms)은 줄이 그립니다. 한 목록에 `ListParentItem` 이 있으면 그 목록의 맨 위 단계 줄은 모두 `ListParentItem` 입니다 — 타일 자리를 맞추기 위해서입니다.

라우터의 링크는 `ListLinkItem asChild` 의 자식으로 넣습니다 — 제목 · 설명은 그 링크 안에 그려집니다(`<ListLinkItem asChild title="도움말"><Link to="/help" /></ListLinkItem>`).

### 기본

[그림: 기본 — 보기만 하는 줄](../../site/components/specs/list.tsx#ex-basic)

```tsx
import { List, ListItem } from "@/components/ui/list"

<List>
  <ListItem title="가입일" suffix="2026년 3월 2일" />
  <ListItem title="이메일" suffix="groo@example.com" />
</List>
```

### 누르는 줄

[그림: 누르는 줄 — 화면을 옮깁니다](../../site/components/specs/list.tsx#ex-button)

```tsx
import { ChevronRight, Globe, User } from "lucide-react"
import { List, ListButtonItem, ListHeader } from "@/components/ui/list"

<ListHeader id="settings-general">일반</ListHeader>
<List aria-labelledby="settings-general">
  <ListButtonItem prefix={<User />} title="계정" suffix={<ChevronRight />} onClick={openAccount} />
  <ListButtonItem prefix={<Globe />} title="기본 통화" suffix={<>대한민국 원<ChevronRight /></>} onClick={openCurrency} />
</List>
```

### 컨트롤 줄

[그림: 스위치 줄 — 줄 어디를 눌러도 바뀝니다](../../site/components/specs/list.tsx#ex-switch)

```tsx
import { Bell } from "lucide-react"
import { List, ListSwitchItem } from "@/components/ui/list"

<List>
  <ListSwitchItem
    prefix={<Bell />}
    title="결제 알림"
    detail="결제 예정일 D-1, 결제일 당일 알림"
    checked={on}
    onCheckedChange={setOn}
  />
</List>
```

### 하나 고르기 · 여럿 고르기

[그림: 하나 고르기 · 여럿 고르기](../../site/components/specs/list.tsx#ex-select)

```tsx
import { ListCheckGroup, ListCheckItem, ListRadioGroup, ListRadioItem } from "@/components/ui/list"

<ListRadioGroup value={currency} onValueChange={setCurrency} aria-label="기본 통화">
  <ListRadioItem value="KRW" title="대한민국 원" detail="KRW" />
  <ListRadioItem value="USD" title="미국 달러" detail="USD" />
</ListRadioGroup>

<ListCheckGroup aria-label="내보낼 항목">
  <ListCheckItem title="거래 내역" defaultChecked />
  <ListCheckItem title="예산" />
</ListCheckGroup>
```

### 강조 · 비활성 · 맞춤

[그림: 강조 · 비활성 · 위 맞춤](../../site/components/specs/list.tsx#ex-states)

```tsx
import { Info } from "lucide-react"
import { List, ListButtonItem, ListItem } from "@/components/ui/list"

<List>
  <ListButtonItem highlighted title="예산 80% 도달" detail="식비 예산의 80%를 썼어요" />
  <ListButtonItem disabled title="주간 리포트" detail="푸시 알림이 꺼져 있어요" />
  <ListItem align="top" prefix={<Info />} title="긴 제목은 두 줄을 넘으면 앞 · 뒤를 위로 맞춘다" detail="설명이 길 때도 같다" />
</List>
```

### 하위 줄 — 카테고리

[그림: 지출 카테고리 — 식비 하위 6개 펼침 · 기타는 하위 없음](../../site/components/specs/list.tsx#ex-nested)

```tsx
import { Tag, Utensils } from "lucide-react"
import { List, ListButtonItem, ListParentItem, ListTile } from "@/components/ui/list"

<List aria-label="지출 카테고리">
  {/* 줄을 누르면 편집, 앞 꺾쇠 단추가 하위 줄을 접는다 — 이름은 고정 */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-orange-weak text-chart-orange"><Utensils /></ListTile>}
    title="식비 · 외식 · 배달음식"
    detail="지출 · 하위 6개"
    onClick={() => editCategory(food.id)}
    expandLabel="식비 · 외식 · 배달음식 하위 카테고리"
    defaultOpen
  >
    {food.children.map((c) => (
      <ListButtonItem key={c.id} prefix={renderTile(c)} title={c.name} detail="지출" onClick={() => editCategory(c.id)} />
    ))}
  </ListParentItem>
  {/* 하위가 없으면 꺾쇠 자리만 비운다 — 타일 · 제목이 같은 자리. 이름은 같이 준다(하위가 생기면 단추가 선다) */}
  <ListParentItem
    prefix={<ListTile className="bg-chart-gray-weak text-chart-gray"><Tag /></ListTile>}
    title="기타"
    detail="지출 · 하위 없음"
    onClick={() => editCategory(etc.id)}
    expandLabel="기타 하위 카테고리"
  />
</List>
```

### 하위 줄 — 늘 펼친 편집 화면

[그림: 카테고리 편집 — collapsible={false}, 꺾쇠 자리는 비우고 하위 줄은 늘 보입니다](../../site/components/specs/list.tsx#ex-nested-fixed)

```tsx
import { List, ListButtonItem, ListParentItem } from "@/components/ui/list"

<List aria-label="지출 카테고리 편집">
  {/* 늘 펼친 편집 화면 — 꺾쇠 단추 없이 하위 줄이 늘 보인다(Tree View 의 collapsible 과 같은 뜻) */}
  {categories.map((c) => (
    <ListParentItem
      key={c.id}
      collapsible={false}
      prefix={renderTile(c)}
      title={c.name}
      detail={c.children.length ? `지출 · 하위 ${c.children.length}개` : "지출 · 하위 없음"}
      onClick={() => editCategory(c.id)}
    >
      {c.children.map((k) => (
        <ListButtonItem key={k.id} prefix={renderTile(k)} title={k.name} detail="지출" onClick={() => editCategory(k.id)} />
      ))}
    </ListParentItem>
  ))}
</List>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap(누르는 줄) | 줄 어디를 눌러도 그 줄의 동작입니다 — 누르는 동안 콘텐츠가 줄어 가장자리를 누른 포인터가 영역 밖에 놓여도 그 줄이 눌립니다. 뒤 붙이개의 작은 버튼은 따로 눌립니다. `disabled` 면 무시합니다. |
| Click / Tap(컨트롤 줄) | 줄 어디를 눌러도 끼운 스위치 · 체크 · 라디오가 바뀝니다. 바로 적용(스위치) · 저장 때 적용(체크)은 그 컨트롤의 규칙대로입니다. |
| Hover(웹) | 누르는 줄만 — 누름과 같은 바탕. |
| Keyboard `Tab` | 누르는 줄 · 컨트롤로 갑니다. 보기만 하는 줄은 건너뜁니다. |
| Keyboard `Enter` · `Space` | 누르는 줄은 누르기와 같습니다. 컨트롤 줄은 그 컨트롤의 키(스위치 · 체크 Space, 라디오 화살표)입니다. 체크 · 라디오 줄의 `Enter` 는 폼을 제출합니다 — 진짜 input 처럼 폼의 기본 버튼을 누릅니다(Checkbox · Radio 와 같습니다). 라디오 줄은 묶음(`ListRadioGroup`)이 Radio 와 같은 처리(`submitOnRadioEnter`)로 `Enter` 를 받습니다. 키를 누르고 있는 동안은 포인터로 누를 때와 같은 누름 모습(바탕 · 콘텐츠 축소)입니다. |
| Keyboard `Home` · `End`(라디오 줄) | 하나 고르기 묶음(`ListRadioGroup`)은 받지 않습니다 — 초점도 고른 줄도 그대로이고, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도). 첫 · 끝 줄로는 화살표로 갑니다 — 진짜 라디오 · WAI-ARIA APG Radio Group 과 같습니다. 레시피는 묶음이 캡처 단계에서 그 키를 막습니다(`ignoreRadioJumpKeys`). |
| 글자 크기 설정 | 제목 · 설명 · 값 · 금액은 글자 크기 설정을 따라 커지고 줄을 바꿔 줄 높이가 늘어납니다. "두 줄까지" 같은 쓰기 지침은 보통 글자 기준이라 큰 글자에서 줄 수로 자르지 않습니다. 메타를 잇는 설명 줄(Tag Group)만 한 줄 말줄임입니다. 줄 안 폭이 좁아지면 값을 본문 아래로 내립니다(위 "큰 글자에서 값을 본문 아래로"). 타일 · 아이콘 · 꺾쇠 · 끼운 컨트롤과 배지는 크기를 그대로 두고, 자리는 위 맞춤(가운데 · 위)을 따릅니다. |
| Disabled | 누르기 · 키보드 불가, 포커스에서 빠집니다. 값은 그대로 보입니다. |
| 꺾쇠 단추(하위 줄) | 누르기 · `Enter` · `Space` 로 하위 줄을 펼치고 접습니다 — 줄의 편집은 열리지 않습니다. 초점은 단추에 그대로 남습니다. `Tab` 은 꺾쇠 단추 → 그 줄 → 펼친 하위 줄 → 다음 부모의 꺾쇠 단추입니다. 모션 줄이기면 높이 움직임 없이 150ms 서서히 나타나고 꺾쇠는 바로 돕니다. `collapsible={false}`(늘 펼친 편집 화면)면 단추가 없고 하위 줄이 늘 보입니다 — `Tab` 은 줄 → 하위 줄 → 다음 부모 줄입니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 9.90:1 이상. 설명 · 값 글자 `fg-neutral-subtle` — 흰 바탕 5.50 · 6.09(라이트 · 다크), 누름 바탕 5.18 · 4.68, 강조 바탕 4.83 이상 ✓. 강조 줄을 올리거나 누르는 동안은 `fg-neutral-muted` 5.58 이상 ✓(`fg-neutral-subtle` 이면 4.32 로 미달). 막힌 줄의 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.4** Resize text | 제목 · 설명 · 값 · 금액이 글자 크기 설정을 따라 커지고, 줄이 좁으면 값을 본문 아래로 내려 기둥처럼 쪼개지지 않습니다 ✓. 배지는 예외로 그대로 두고, 배지 글은 줄 이름에 함께 읽힙니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 앞 아이콘 `fg-neutral` · 화살표 `fg-neutral-subtle` 은 글자와 같은 값. 타일 아이콘 `chart-{색}` × `chart-{색}-weak` 3.63 이상(가장 낮은 yellow 라이트) ✓ |
| **WCAG 1.4.1** Use of color | 강조는 바탕 색만 바뀝니다 — 안 읽음 같은 상태는 글로도 알 수 있게 씁니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 줄 안쪽 링 2px(`stroke-focus-ring`). 컨트롤 줄은 끼운 컨트롤이 포커스를 받고 그 컨트롤의 링이 보입니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 높이 46 이상 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 줄은 줄 전체 — 한 줄짜리도 46 ✓ |
| **ARIA** | `List` 는 `<ul>` · 줄은 `<li>` 입니다. 누르는 줄의 버튼 · 링크 이름은 제목 + 설명입니다. 컨트롤 줄은 `<label>` 이 줄 전체라 제목 + 설명이 컨트롤의 이름입니다. 목록 제목이 있으면 `List` 에 `aria-labelledby` 로 잇습니다. **앱은 줄 하나가 한 노드입니다** — 누르는 줄은 제목 · 설명 · 값을 한 이름으로 묶어(`MergeSemantics`, "점심 · 숲길식당, 식비 · 12:10, −9,000원, 버튼") 한 번에 읽고, 차례는 보이는 차례대로 꺾쇠 단추 → 줄 → 하위 줄입니다(하위 줄은 꺾쇠 단추 노드의 자식이 아니라 부모 줄과 나란한 목록). 앞 타일 · 로고 타일은 장식이라 이름에 넣지 않고, 값의 줄바꿈 자리(U+200B)도 넣지 않습니다. 보기만 하는 줄(`ListItem`)도 같습니다 — 넓은 줄 · 좁은 줄 모두 한 번만 읽힙니다. 줄 안의 작은 버튼(뒤 붙이개)만 따로 한 번 더 멈춥니다. 웹은 값이 버튼 밖 글이라 줄마다 두 번 멈춥니다 — 앱만 한 노드로 묶어, 30줄 가계부를 30번 밀면 끝나게 합니다. 하나 고르기(`ListRadioGroup`)는 `role="radiogroup"`, 여럿 고르기(`ListCheckGroup`)는 `<fieldset>` 이고 둘 다 이름(`aria-label` · `aria-labelledby`)이 필수입니다 — 묶음 안의 줄 · 선은 `<div>` 입니다. 줄 사이 선은 `aria-hidden` 이라 줄 수에 들지 않습니다. 하위 줄을 접는 꺾쇠 단추는 이름 "{카테고리} 하위 카테고리"(고정 — `expandLabel`, 접는 줄이면 타입이 빠뜨림을 막습니다) + `aria-expanded` · `aria-controls`(하위 줄 `ul`)입니다 — 누르는 영역 44 ✓ ✓. 늘 펼친 편집 화면(`collapsible={false}`)은 단추 · `aria-expanded` 를 두지 않습니다 — 접히지 않는데 펼침 상태가 남으면 누를 수 있는 것처럼 읽히기 때문입니다(Tree View 와 같습니다). 빈 꺾쇠 자리는 `aria-hidden` 입니다. 목록 제목은 머리말입니다 — 웹 `h2`(상자 안이면 `h3`, 버튼이 있으면 제목 글에만), 앱은 `Semantics(header: true, headingLevel: 2)` 로 답니다 — 안드로이드는 `headingLevel` 이 있어야 제목 이동에 걸립니다(상단 바 제목이 1) |
| **Reduced motion** | 모션 줄이기면 콘텐츠 축소를 뺍니다 — 바탕 색 전환은 그대로입니다(기초 Motion) |

## Do / Don't

### ✅ Do

- 설정 · 메뉴 · 선택 · 키-값 · 내용 줄을 모두 List 로 그립니다.
- 화면을 옮기는 줄에만 오른쪽 화살표를 답니다.
- 줄의 동작은 줄을 눌러 들어간 화면에 둡니다 — 하나면 바닥 [삭제], 여럿이면 머리 ⋮ 입니다.
- 컨트롤 줄은 줄 전체가 눌리게 합니다.
- 막힌 줄은 제목 · 설명 · 아이콘을 모두 비활성 색으로 바꿉니다.
- 끌 수 없는 켬(늘 켜진 체크 줄)은 칸만 막고(`locked`) 제목 · 앞 붙이개는 그대로 둡니다 — 까닭은 배지로 알립니다.
- 줄은 편집을 열고 하위만 접는 목록은 줄 앞 꺾쇠 단추(44 · 고정 이름 + 펼침 상태)로 접습니다.
- 늘 펼쳐 두는 편집 화면은 `collapsible={false}` 로 — 이름 있는 스위치로 켭니다.
- 긴 글 값(이메일 · 계좌번호)은 그대로 두고 줄 끝에서 끊기게 둡니다 — 본문은 제목의 가장 긴 낱말 폭까지 양보합니다.

### ❌ Don't

- 화면마다 줄을 손으로 짜지 않습니다 — 여백 · 글자 · 누름이 화면마다 갈립니다.
- 화살표가 있는데 안 눌리는 줄 · 눌리는데 표시가 없는 줄을 만들지 않습니다.
- 컨트롤 줄에 따로 누르는 버튼을 같이 넣지 않습니다.
- 한 줄에 누르는 것을 넷 이상 두지 않습니다.
- 목록 줄 끝에 ⋮(더보기)를 두지 않습니다 — 줄에 ⋮ 를 둘 수 있는 건 콘텐츠가 높은 카드 머리뿐입니다.
- 한 묶음에서 라디오 · 체크를 섞지 않습니다.
- 끌 수 없는 켬을 상자 없는 체크 · 줄 전체 막힘으로 그리지 않습니다 — 못 바꾼다는 것이 안 보이거나, 켜진 것이 꺼진 것처럼 보입니다.
- 줄 높이를 줄이려고 스위치 · 체크의 누르는 영역을 자르지 않습니다.
- 하위를 접는 꺾쇠를 18 · 24 로 작게 그리거나, 이름을 "접기 · 펼치기" 로 바꾸거나, 접힌 부모 줄에 › 를 둘 달지 않습니다.
- `expandLabel` 을 빼서 늘 펼침을 만들지 않습니다 — 접는 줄은 이름이 필수입니다(타입 오류). 늘 펼침은 `collapsible={false}` 입니다.
- 값이 본문 위로 넘쳐 덮게 두거나, 뒤 붙이개에 최대 폭이나 말줄임을 따로 걸지 않습니다.

## Specification

`list.yaml` · `list-header.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 List 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — list.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#list)

[그림: Specification — list-header.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#list-header)
