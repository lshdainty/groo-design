# Table

> 줄과 열로 된 데이터를 견주어 읽는 표입니다. HR 의 사용자 · 휴가 · 회비 · 신청 내역, Desk 의 가져오기 미리보기 · 일별 시세처럼 같은 모양의 줄을 열마다 맞춰 봅니다. 768 이상에서는 표로, 768 미만에서는 같은 줄을 [List](list.md) 의 줄로 그립니다.

표 아래 쪽 넘김은 [Table Pagination](table-pagination.md) 을 쓰고, 한 줄짜리 항목을 늘어놓는 목록은 처음부터 [List](list.md) 를 씁니다.

수치 원본은 [`table.yaml`](table.yaml)입니다.

[그림: HR 사용자 표(데스크톱) · 같은 줄을 List 로(폰) — 라이트 · 다크](../../site/components/specs/table.tsx#hero)

### 직접 골라 보기

줄 종류(한 줄 · 썸네일), 정렬할 열과 방향, 고르기, 폭(데스크톱 · 폰)을 바꾸면 표와 코드가 함께 바뀝니다. 머리를 누르면 정렬이 바뀌고, 체크를 누르면 일괄 작업 바가 나타납니다. 폰 폭을 고르면 같은 줄이 List 줄로 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/table.tsx#playground)

## Anatomy

[그림: 표는 머리 줄 · 본문 줄 · 칸으로 이뤄지고, 정렬 표시 · 상태 배지 · 줄 끝 ⋮ · 선택 칸 · 일괄 작업 바를 붙인다](../../site/components/specs/table.tsx#anatomy)

| ⓐ Root | 표 상자 — 카드 안에 가장자리까지 붙습니다. 표와 넘김 줄을 담고, 넘치면 표만 가로로 밉니다 — 넘김 줄은 보이는 폭에 붙습니다. |
| ⓑ Header Row | 머리 줄 — 41, 바탕 없음, 아래 선입니다. |
| ⓒ Header Cell | 머리 칸 — 열 이름 14 / 20 · 500 입니다. 정렬할 수 있는 열은 칸 전체가 버튼입니다. |
| ⓓ Sort Icon | 정렬 표시 ↑↓ — 정렬할 수 있는 열에 늘 있고, 지금 방향만 짙습니다. |
| ⓔ Row | 본문 줄 — 45(썸네일 · 두 줄 칸이 있으면 72)이며, 아래 선은 마지막 줄까지 긋습니다. |
| ⓕ Cell | 본문 칸 — 14 / 20 · 400 입니다. 숫자는 오른쪽에 맞춥니다. |
| ⓖ Badge | 상태 칸 — [Badge](badge.md) medium weak 입니다. |
| ⓗ More Button | 줄 끝 ⋮ — 보이는 40 · 누르는 44, 이름은 "{줄 이름} 더보기" 입니다. |
| ⓘ Checkbox | 선택 칸 — [Checkbox](checkbox.md) large 24 입니다. 머리는 전체 · 일부를 고릅니다. |
| ⓙ Bulk Bar | 일괄 작업 바 — 고른 줄이 있을 때만 표 위에 나타납니다. |

[표: 부위](table.yaml#slots)

## Properties

### 머리 · 줄

머리 줄은 최소 41(위아래 10 + 글 20 + 선 1), 본문 줄은 최소 45(위아래 12 + 글 20 + 선 1)입니다 — 글자 크기 설정을 따라 글이 커지면 줄이 따라 높아집니다. 칸의 좌우는 16 이고, 표가 카드 안에 가장자리까지 붙으므로 첫 칸 앞 · 끝 칸 뒤만 카드 여백과 같은 24 입니다(카드 머리 제목과 첫 열 글자가 한 줄에 섭니다). 머리 글자는 본문과 같은 14 · 짙은 `fg-neutral` 에 굵기만 500 이며, 작은 대문자 · 회색 · 머리 바탕을 두지 않습니다. 글은 `t4`(14 / 19)에 줄 높이만 20 으로 둡니다. 같은 부위에 따로 적은 줄 높이 · 굵기가 `typography` 의 값을 덮고, 스펙 JSON 은 둘을 접어 14 / 20 · 500 하나로 싣습니다.

줄 선은 1px `stroke-neutral-subtle` 이고 머리 아래 · 줄마다 · 마지막 줄 아래까지 긋습니다 — 마지막 선이 표 끝을 마감합니다. 세로 선 · 줄무늬 · 바깥 테두리는 없습니다.

[그림: 머리 41 · 줄 45 · 첫 칸 24 · 칸 16 · 줄 선은 마지막 줄까지](../../site/components/specs/table.tsx#rows)

[표: 표 상자](table.yaml#base.enabled@root)

[표: 머리 줄](table.yaml#base.enabled@headerRow)

[표: 머리 칸](table.yaml#base.enabled@headerCell)

[표: 본문 줄](table.yaml#base.enabled@row)

[표: 본문 칸](table.yaml#base.enabled@cell)

### 줄 종류 — 45 · 72

줄 높이는 하나, 45 입니다. 칸 하나라도 썸네일(Image Frame 1:1 48)이나 두 줄 글(윗줄 14 + 둘째 줄 13 · `fg-neutral-subtle`)을 두면 그 표의 모든 줄이 72 입니다. 72 는 최소 높이입니다 — 칸은 위아래 12 를 지키고 내용을 세로 가운데에 두며, 내용이 72 를 넘으면(긴 정책 이름이 두 줄을 넘는 결재함 줄) 줄이 자랍니다. 글이 줄 선에 붙지 않게 하기 위해서입니다. [Avatar](avatar.md) 42 · [Logo Tile](logo-tile.md) 40 · 두 줄 글은 12 를 지켜도 72 안에 듭니다. Image Frame 48 썸네일 칸만 위아래 여백이 0 입니다 — 12 를 지키면 48 + 24 + 선 1 = 73 이 되어 72 를 넘기 때문입니다(줄 높이 72 가 먼저입니다). 여백 0 이면 그림 위아래가 11.5 로 줄은 72 그대로이고, 같은 줄의 다른 칸은 12 를 지킵니다. 한 표 안에서 줄 높이를 섞지 않고, 촘촘한 · 넉넉한 두 벌(밀도 변형)을 두지 않습니다. 사람은 [Avatar](avatar.md) 42, 은행 · 카드 같은 물건은 [Logo Tile](logo-tile.md) 40 을 썸네일 자리에 둡니다.

[그림: 한 줄 표 45 · 썸네일 · 두 줄 표 72](../../site/components/specs/table.tsx#row-kinds)

[표: 줄 종류](table.yaml#row)

[표: 둘째 줄](table.yaml#base.enabled@detail)

[표: 썸네일](table.yaml#base.enabled@thumbnail)

### 숫자 열

금액 · 개수 · 비율은 오른쪽에 맞추고 고정폭 숫자(`tabular-nums`)로 둡니다 — 자릿수가 위아래로 맞아 크기를 견줄 수 있습니다. 머리도 오른쪽에 맞춥니다. 고정폭 글꼴(mono)은 쓰지 않습니다. 돈은 줄이지 않고 원까지 적고("1,240,000원"), 빼기는 U+2212(−) 하나를 씁니다(International Design). 날짜는 왼쪽에 맞춥니다 — 같은 형식이라 자리가 맞습니다. 오르내림을 적는 칸(등락률)은 [증감 표기](card.md#증감-표기)대로 ▲ `fg-critical` · ▼ `fg-informative` + 값입니다.

[그림: 숫자 열 — 오른쪽 · 고정폭 숫자 · 머리도 오른쪽, 왼쪽에 둔 숫자](../../site/components/specs/table.tsx#numbers)

[표: 맞춤](table.yaml#align)

### 정렬

정렬할 수 있는 열은 머리 칸 전체가 버튼이고, 열 이름 오른쪽 6 에 ↑↓ 표시(16)를 늘 둡니다. 흐린 `fg-neutral-muted` 둘 가운데 지금 정렬된 방향 하나만 `fg-neutral` 로 짙어집니다. 어느 열을 정렬할 수 있는지 처음부터 보이므로, 마우스를 올려야 화살표가 나타나는 열은 없습니다. 정렬하지 않는 열(이미지 · ⋮ · 긴 설명)은 글만 둡니다.

정렬은 두 단계입니다 — 누를 때마다 내림 ↔ 오름이 바뀌고, 정렬 없음으로 돌아가지 않습니다. 처음 누르면 숫자 · 날짜 열은 내림(큰 값 · 최근 것 먼저), 글 열은 오름(가나다)입니다. 다른 열을 누르면 그 열의 처음 방향으로 옮깁니다.

[그림: 정렬 — 늘 보이는 ↑↓, 지금 방향만 짙게(남은 휴가 ↓)](../../site/components/specs/table.tsx#sort)

[표: 정렬](table.yaml#sort)

### 상태 칸

상태는 [Badge](badge.md) medium(20) · `weak` 이고, 톤이 뜻을 전합니다(재직 `positive` · 휴직 `warning` · 초대 대기 `neutral`). 한 열은 한 변형으로 두고, 글 열처럼 왼쪽에 맞춥니다.

[표: 상태 배지](table.yaml#base.enabled@badge)

### 줄 끝 ⋮

줄의 동작(수정 · 삭제 …)이 둘 이상이면 줄 끝 ⋮ 하나로 엽니다 — [Button](button.md) `ghost` · `iconOnly` · `medium`(보이는 40 · 누르는 44), 이름은 "{줄 이름} 더보기" 입니다. 1280 이상은 [Menu](menu.md), 미만은 [Menu Sheet](menu-sheet.md) 를 엽니다. 열 폭은 80(앞 16 + 40 + 끝 24 — 끝 열이라 카드 여백)이고, 머리 칸에는 글을 쓰지 않습니다 — 보조 기술에는 숨긴 "동작" 이 읽힙니다. 줄을 누르면 상세가 열립니다.

[그림: 줄 끝 ⋮ — 40 · 누르는 44 · 머리 글 없음](../../site/components/specs/table.tsx#more)

줄의 동작이 하나면 ⋮ 대신 줄 끝에 그 동작의 글 단추를 둡니다 — [Button](button.md) `ghost` · `small` 이고, 지우기처럼 되돌릴 수 없으면 `critical`(누르면 [Alert Dialog](alert-dialog.md))입니다. 메뉴 하나를 거치게 하지 않습니다. 데스크톱 표의 줄 끝 ⋮ 는 그대로 두고, 768 미만에서 List 줄로 바뀌면 [Menu](menu.md) 의 목록 줄 규칙을 따릅니다.

[표: 줄 끝 ⋮](table.yaml#base.enabled@moreButton)

### 선택 · 일괄 작업 바

여럿을 골라 한 번에 다루는 표만 첫 열에 [Checkbox](checkbox.md) large(24)를 둡니다. 머리 칸의 체크는 지금 쪽의 줄 전부를 고르고 풀며, 일부만 골랐으면 일부(indeterminate)입니다. 한 줄 이상 고르면 표 위에 일괄 작업 바가 나타납니다 — 바탕 `bg-brand-weak` 한 값, 높이 48 · 모서리 12, 왼쪽에 "3개 선택됨", 오른쪽에 동작([Button](button.md) `ghost` small)과 선택 해제 ✕ 를 둡니다. 바 안 동작은 모두 ghost neutral 입니다 — "삭제" 도 회색 글(아이콘 · 글이 위험을 전합니다)이고, 빨강은 누른 뒤 뜨는 확인창([Alert Dialog](alert-dialog.md) — "3개를 지울까요?" + `criticalSolid`)에서 씁니다. 옅은 브랜드 바탕 위 빨강 글은 라이트 4.44 : 1 로 4.5 에 못 미치기 때문입니다. 고른 줄 자체에는 바탕을 칠하지 않고 체크로 고른 것을 보입니다([List](list.md) 의 여럿 고르기와 같습니다). 브랜드 옅은 바탕은 일괄 작업 바에만 씁니다.

[그림: 선택 열 · 머리 체크 일부 · 일괄 작업 바 — 고른 줄은 바탕 없이 체크로만](../../site/components/specs/table.tsx#selection)

[표: 고르기](table.yaml#selection)

[표: 선택 칸](table.yaml#base.enabled@checkbox)

[표: 일괄 작업 바](table.yaml#base.enabled@bulkBar)

### 머리 고정

줄이 많은 표(25 · 50줄 보기)나 위젯 · 대화상자 안의 표처럼 표 상자에 높이를 정해 상자 안에서 스크롤하면 머리 줄을 상자 맨 위에 붙입니다. 붙은 머리는 카드 면과 같은 `bg-layer-default` 로 칠해 지나가는 줄을 가립니다 — 바탕이 달라 보이지 않습니다. 페이지 전체가 스크롤할 때는 상단 바와 겹치므로 붙이지 않습니다.

[그림: 상자 안에서 스크롤 — 머리는 맨 위에, 줄은 그 아래로](../../site/components/specs/table.tsx#sticky)

### State

줄을 누르면 상세가 열리는 표만 상태가 있습니다. 보기만 하는 표의 줄은 바뀌지 않습니다.

| 상태 | 모습 |
|---|---|
| `enabled` | 줄 바탕 없음 |
| `hovered` | 웹 · 누르는 줄 — 줄 전체가 `bg-layer-default-pressed`(누름과 같은 색). 정렬 버튼도 같습니다 |
| `pressed` | 같은 바탕 — 축소는 없습니다(표의 줄 · 칸은 이웃과 붙어 있어 줄이면 흔들립니다) |
| `focused` | 웹 — 키보드 포커스가 간 링크 · 버튼 · 정렬 버튼에 안쪽 2px 링 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스](../../site/components/specs/table.tsx#states)

[표: 상태 — 줄](table.yaml#matrix@row)

[표: 상태 — 정렬 버튼](table.yaml#matrix.sort.sortable@sortButton)

[표: 모션](table.yaml#motion)

## Guidelines

### 768 미만은 List 줄로

768 미만에서는 표를 그리지 않고 줄마다 [List](list.md) 의 누르는 줄로 바꿉니다 — 폰에서 옆으로 밀거나 열을 숨겨 보지 않습니다. 표마다 줄에 무엇을 둘지 이 규칙으로 정합니다.

| 표 | List 줄 |
|---|---|
| 첫 열(그 줄의 이름) | 제목(16 / 22) |
| 다음으로 중요한 열 1 ~ 2개 | 설명(13 · `fg-neutral-subtle`, " · " 로 잇습니다) |
| 핵심 숫자 하나 또는 상태 | 오른쪽 값 — 숫자는 16 · 고정폭 숫자, 상태는 Badge |
| 나머지 열 | 줄을 눌러 여는 상세 |
| 썸네일 · 사람 · 기관 | 앞 붙이개(Image Frame · Avatar · Logo Tile) |
| 선택 칸 | 앞 체크 24([List](list.md) 의 여럿 고르기) |
| 줄 끝 ⋮ | 줄 끝 ⋮ → [Menu Sheet](menu-sheet.md) — 폰 스와이프는 지름길([Swipe Actions](swipe-actions.md)) |
| 정렬 | 목록 위 정렬 고르기 하나("남은 휴가 많은 순") — [Select](select.md) |
| 넘김 줄 | 끝없이 불러오기([Pagination](pagination.md) 의 "폰은 끝없이 불러오기") |

[그림: HR 사용자 표 → 폰 List — 이름 · 부서 · 상태 · 남은 휴가](../../site/components/specs/table.tsx#narrow-guide)

[표: 좁은 화면](table.yaml#width)

### 선은 줄 사이에만, 마지막 줄까지

줄 사이 1px 선 하나로 줄을 가릅니다 — 마지막 줄 아래까지 긋습니다. 세로 선 · 줄무늬(짝수 줄 바탕) · 머리 바탕 · 작은 대문자 머리를 두지 않습니다. 줄이 길어 따라 읽기 어려우면 줄무늬 대신 열을 줄입니다.

[그림: 줄 선만 · 세로 선 · 줄무늬 · 회색 머리 바탕](../../site/components/specs/table.tsx#line-guide)

### 숫자는 오른쪽, 돈은 원까지

숫자 열은 머리까지 오른쪽에 맞춥니다 — 왼쪽에 두면 자릿수가 어긋나 큰 값을 한눈에 찾지 못합니다. 돈은 줄이지 않습니다("1.2만원" 이 아니라 "12,000원"). 표는 넓은 화면의 자리라 줄일 이유가 없습니다.

[그림: 숫자 열 — 오른쪽 · 왼쪽](../../site/components/specs/table.tsx#number-guide)

### 줄의 동작은 ⋮ 하나

수정 · 삭제 아이콘을 줄마다 늘어놓지 않습니다. 줄 끝 ⋮ 하나에 모으고(동작이 하나면 그 글 단추 하나), 줄 자체를 누르면 상세가 열립니다([Menu](menu.md) 의 "줄의 동작"). 줄 안의 누르는 것(체크 · 줄 · ⋮)은 셋까지 두고, 넷 이상은 피합니다([List](list.md) 의 누르는 자리와 같은 세기).

[그림: ⋮ 하나 · 늘 보이는 아이콘 묶음](../../site/components/specs/table.tsx#actions-guide)

### 표 안 편집 줄은 medium

줄을 그 자리에서 고치는 표(업무 보고 줄 수정)의 편집 칸은 모두 `medium` 40 입니다 — [Input](input.md) · [Select](select.md) · [Input Button](input-button.md) 에 `small` 이 없어서, 한 줄의 칸을 같은 높이로 맞추면 40 입니다. [Quantity Picker](quantity-picker.md) 도 옆 칸에 맞춰 `medium` 입니다(그 문서의 "옆 칸과 같은 높이").

### 표처럼 보이면 table 로

열을 맞춰 줄을 견주는 자리는 `div` 격자가 아니라 `<table>` 로 짭니다 — 일별 시세 · 호가 · 체결도 표입니다. `div` 로 짜면 보조 기술이 열 이름을 읽지 못합니다. 반대로 줄 하나에 한 항목을 보이는 목록(거래 · 할 일)은 표가 아니라 [List](list.md) 입니다.

[그림: 일별 시세 — table · div 격자](../../site/components/specs/table.tsx#grid-guide)

### 불러오는 동안 · 비었을 때 · 실패했을 때

머리 줄은 처음부터 그립니다 — 열 이름은 서버에서 오지 않습니다. 불러오는 동안은 줄 자리만 [Skeleton](skeleton.md)(줄 높이 그대로 · 글 자리 `t4` 19)으로 둡니다. 비었으면 본문 자리에 [Result Section](result-section.md) `medium`("등록된 사용자가 없어요" · 거르기 때문이면 "조건에 맞는 사용자가 없어요" + "필터 초기화")을, 불러오지 못했으면 `failure` + "다시 시도" 를 둡니다 — 실패를 빈 표로 보이지 않습니다. 시간표(1 · 5 · 10초)는 [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) 을 따릅니다.

[그림: 불러오는 동안 줄 스켈레톤 · 비었음 · 실패 + 다시 시도](../../site/components/specs/table.tsx#status-guide)

### 표 아래는 Table Pagination

줄이 한 쪽(10줄)보다 많을 수 있으면 표 아래 12 에 [Table Pagination](table-pagination.md) 을 둡니다 — 표와 같은 상자 안이지만 보이는 폭에 붙어, 열이 넘쳐 표를 가로로 밀어도 그대로 있습니다(줄이 보이는 폭보다 넓으면 표를 끝까지 밀 때 끝이 보입니다). 넘기면 표 맨 위로 스크롤합니다. 12 는 넘김 줄의 위 여백(`table-pagination.yaml` root.marginTop)입니다 — 표의 `pagination` 자리는 좌우 24 만 두고 위 여백을 더하지 않습니다. 그래서 자리에 넣어도 표 바로 뒤에 두어도 12 입니다.

### 글

열 이름은 짧은 명사("이름" · "남은 휴가" · "상태")로 쓰고, 영어("Email") · 마침표 없이, 단위는 칸에 붙입니다("12.5일"). 표 이름은 카드 머리의 제목이고 `<caption>` 에 같은 글을 둡니다. 고른 수는 "3개 선택됨", 선택 칸의 이름은 "{줄 이름} 선택" · 머리는 "모두 선택", ⋮ 는 "{줄 이름} 더보기" 입니다.

## 코드

레시피 `recipes/shadcn/components/ui/table.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Table` — 표 상자(가로 스크롤) + `<table>`. `caption`(필수 — 숨긴 표 이름, 보이는 제목은 카드 머리) · `rowHeight`(`"text"` 기본 45 · `"rich"` 72) · `stickyHeader`(상자가 스스로 스크롤할 때 머리를 붙입니다 — 높이는 `className` 의 `max-h-*`) · `pagination`(표 아래 [Table Pagination](table-pagination.md) 자리 — 표와 같은 가로 스크롤 상자 안이지만 보이는 폭에 붙습니다. 좌우 24. 위 12 는 Table Pagination 이 갖습니다) · `tableClassName`(안쪽 `<table>` 에 붙는 클래스).
- `TableHeader` · `TableBody` · `TableRow` — `<thead>` · `<tbody>` · `<tr>`. `TableRow` 에 `onClick` 을 주면 누르는 줄입니다(호버 · 누름 바탕). 키보드로는 첫 열의 이름 링크(`TableRowHeader` 의 `href` 또는 `onClick`)로 같은 곳에 갑니다.
- `TableHead` — 머리 칸(`<th scope="col">`). `align`(`"start"` 기본 · `"end"`) · `sort`(`"none"` · `"ascending"` · `"descending"` — 주면 정렬할 수 있는 열이 되어 칸 전체가 버튼이고, ↑↓ 를 늘 그리며 `aria-sort` 를 답니다) · `onSortChange(next)`(누를 때마다 내림 ↔ 오름, 두 단계 — `"none"` 으로 돌아가지 않습니다) · `defaultSortDirection`(그 열을 처음 누를 때의 방향 — 기본은 `align="end"`(숫자)면 `"descending"`, 아니면 `"ascending"` 입니다. 날짜 열은 `"descending"` 을 줍니다).
- `TableRowHeader` — 첫 열(`<th scope="row">`, 그 줄의 이름). `href` · `onClick` 을 주면 이름이 링크 · 버튼이 됩니다.
- `TableCell` — 본문 칸(`<td>`). `align`. 숫자는 `align="end"` 가 고정폭 숫자를 겁니다.
- `TableCellContent` — 썸네일 · 두 줄 칸. `media`(Image Frame 48 · Avatar 42 · Logo Tile 40) · `title` · `detail`.
- `TableSelectHead` · `TableSelectCell` — 선택 칸. 머리는 `checked`(`true` · `false` · `"indeterminate"`) · `onCheckedChange`(이름 "모두 선택"), 줄은 `checked` · `onCheckedChange` · `label`(이름 "{label} 선택")을 받습니다. 줄을 누르는 것과 따로입니다.
- `TableMoreHead` · `TableMoreCell` — ⋮ 열. 머리는 숨긴 "동작", 칸은 `label`(이름 "{label} 더보기") · `open` · `onOpenChange` + 자식에 `ResponsiveMenuContent`(1280 이상 Menu · 미만 Menu Sheet — menu.md)를 받습니다.
- `TableBulkBar` — 일괄 작업 바. `count`(0 이면 그리지 않고, "{count}개 선택됨" 을 알립니다) · `onClear`(✕ "선택 해제") · 자식은 동작 버튼(Button `ghost` small)입니다.
- `TableStatusRow` — 본문 자리 한 칸(`colSpan` 전체). 자식은 `ResultSection size="medium"`(비었음 · 실패)입니다. 표가 카드 안이라 Result Section 의 좌우 여백은 0, 칸의 24 만 둡니다(card.md).
- `TableSkeletonRows` — 불러오는 동안의 줄. `rows`(기본 10 — 줄 수 보기) · `columns`(열마다 맞춤 · 폭).
- `useTableLayout()` — `"table"`(768 이상) · `"list"`(미만). 768 미만이면 쓰는 쪽이 같은 데이터를 [List](list.md) 줄로 그립니다(위 "768 미만은 List 줄로").

### HR 사용자 표

[그림: 사용자 — 이름 · 부서 · 남은 휴가(오른쪽) · 상태 · ⋮](../../site/components/specs/table.tsx#ex-basic)

```tsx
import { Badge } from "@/components/ui/badge"
import { ResponsiveMenuContent, ResponsiveMenuItem } from "@/components/ui/menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableMoreCell, TableMoreHead, TableRow, TableRowHeader,
} from "@/components/ui/table"

<Table caption="사용자">
  <TableHeader>
    <TableRow>
      <TableHead sort={sortBy === "name" ? dir : "none"} onSortChange={(d) => sort("name", d)}>이름</TableHead>
      <TableHead>부서</TableHead>
      <TableHead align="end" sort={sortBy === "days" ? dir : "none"} onSortChange={(d) => sort("days", d)}>남은 휴가</TableHead>
      <TableHead>상태</TableHead>
      <TableMoreHead />
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((u) => (
      <TableRow key={u.id} onClick={() => openUser(u.id)}>
        <TableRowHeader href={`/users/${u.id}`}>{u.name}</TableRowHeader>
        <TableCell>{u.department}</TableCell>
        <TableCell align="end">{formatDays(u.remainingDays)}</TableCell>
        <TableCell><Badge tone={u.active ? "positive" : "warning"}>{u.statusLabel}</Badge></TableCell>
        <TableMoreCell label={u.name}>
          <ResponsiveMenuContent title={u.name}>
            <ResponsiveMenuItem label="수정" onSelect={() => edit(u)} />
            <ResponsiveMenuItem label="삭제" tone="critical" onSelect={() => askDelete(u)} />
          </ResponsiveMenuContent>
        </TableMoreCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 고르기 · 일괄 작업

[그림: 업무 보고 — 두 줄 고름(바탕 없이 체크로만) · 일괄 작업 바](../../site/components/specs/table.tsx#ex-select)

```tsx
import { Button } from "@/components/ui/button"
import { Table, TableBulkBar, TableSelectCell, TableSelectHead } from "@/components/ui/table"

<TableBulkBar count={selected.size} onClear={clearSelection}>
  <Button variant="ghost" size="small" onClick={exportSelected}>내보내기</Button>
  <Button variant="ghost" size="small" onClick={askDeleteSelected}>삭제</Button>
</TableBulkBar>
<Table caption="업무 보고">
  <TableHeader>
    <TableRow>
      <TableSelectHead checked={allChecked ? true : someChecked ? "indeterminate" : false} onCheckedChange={toggleAll} />
      …
    </TableRow>
  </TableHeader>
  <TableBody>
    {reports.map((r) => (
      <TableRow key={r.id}>
        <TableSelectCell label={r.title} checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
        …
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 768 미만 — List 줄

[그림: 폰 — 이름 · "개발팀 · 재직" · 12.5일](../../site/components/specs/table.tsx#ex-narrow)

```tsx
import { List, ListButtonItem } from "@/components/ui/list"
import { useTableLayout } from "@/components/ui/table"

const layout = useTableLayout()

{layout === "list" ? (
  <List aria-label="사용자">
    {users.map((u) => (
      <ListButtonItem
        key={u.id}
        title={u.name}
        detail={[u.department, u.statusLabel].join(" · ")}
        suffix={<span className="tabular-nums">{formatDays(u.remainingDays)}</span>}
        onClick={() => openUser(u.id)}
      />
    ))}
  </List>
) : (
  <UserTable users={users} />
)}
```

### 불러오는 동안 · 비었음 · 실패

[그림: 줄 스켈레톤 · 비었음 · 실패 + 다시 시도](../../site/components/specs/table.tsx#ex-status)

```tsx
import { SearchX } from "lucide-react"
import { ResultSection } from "@/components/ui/result-section"
import { TableBody, TableSkeletonRows, TableStatusRow } from "@/components/ui/table"

<TableBody>
  {query.isPending ? (
    <TableSkeletonRows rows={pageSize} columns={[{ width: "40%" }, { width: "30%" }, { align: "end", width: "20%" }]} />
  ) : query.isError ? (
    <TableStatusRow>
      <ResultSection kind="failure" size="medium" title="사용자를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요."
        primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }} />
    </TableStatusRow>
  ) : rows.length === 0 ? (
    <TableStatusRow>
      <ResultSection kind="empty" size="medium" icon={<SearchX />} title="조건에 맞는 사용자가 없어요" secondaryAction={{ label: "필터 초기화", onClick: resetFilters }} />
    </TableStatusRow>
  ) : (
    rows.map(renderRow)
  )}
</TableBody>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 정렬할 수 있는 머리 누르기 | 그 열로 정렬합니다 — 처음은 숫자 · 날짜 열 내림, 글 열 오름입니다. 다시 누르면 반대로, 또 누르면 다시 반대로 바뀝니다(두 단계 — 정렬 없음으로 돌아가지 않습니다). 다른 열을 누르면 그 열의 처음 방향으로 옮깁니다. 정렬을 바꾸면 첫 쪽으로 돌아갑니다(Table Pagination) |
| 줄 누르기(누르는 표) | 상세를 엽니다. 체크 · ⋮ 를 누른 것은 줄 누르기가 아닙니다 |
| 체크 누르기 | 그 줄을 고르거나 풉니다 — 고른 수가 1 이상이면 일괄 작업 바가 나타나고 "{n}개 선택됨" 을 알립니다 |
| 머리 체크 누르기 | 지금 쪽의 줄을 모두 고르거나 풉니다 — 일부 고른 상태면 모두 고릅니다 |
| 일괄 작업 바 ✕ | 고른 것을 모두 풉니다 — 초점은 머리 체크로 옮깁니다 |
| ⋮ 누르기 | 1280 이상 Menu · 미만 Menu Sheet 를 엽니다 — 동작을 고르면 닫고 실행합니다(menu.md) |
| `Tab` | 문서 차례 — 선택 칸이 첫 열이면 머리 체크 → 정렬 버튼, 그다음 줄마다 체크 · 이름 링크 · ⋮ 입니다. 칸 사이를 화살표로 옮기지 않습니다(표는 `grid` 가 아닙니다) |
| 상자 안 스크롤 | 머리는 맨 위에 붙습니다 |
| 768 미만 | 표 대신 List 줄 — 넘김 대신 끝없이 불러옵니다 |
| 글자 크기 설정 | 머리 · 칸 · 둘째 줄 글이 커지고, 머리 · 본문 줄은 최소 높이라 따라 높아집니다. 열이 넘치면 표 상자가 가로로 밉니다. 칸 안 배지 · ↑↓ · 체크 · ⋮ 은 그대로입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 머리 · 칸 `fg-neutral` 카드 면 위 16.41 · 다크 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 둘째 줄 `fg-neutral-subtle` 5.50 · 6.09 ✓. 일괄 작업 바 글 · 동작 `fg-neutral` `bg-brand-weak` 위 Desk 14.42 · 다크 12.07 · HR 14.43 · 다크 12.09 ✓ — 바 안 동작은 모두 ghost neutral 입니다(빨강 글은 라이트 4.44 라 쓰지 않습니다) |
| **WCAG 1.4.4** Resize text | 머리 · 칸 · 둘째 줄 글이 글자 크기 설정을 따라 커지고 줄이 따라 높아집니다 ✓. 칸 안 배지는 기준의 예외로 그대로 두고, 같은 상태는 줄을 눌러 여는 상세에서 크게 읽습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | ↑↓ 흐린 쪽 `fg-neutral-muted` 7.11 · 다크 7.70, 짙은 쪽 `fg-neutral` ✓. 줄 선은 장식입니다(1.15) — 줄은 글의 자리로 읽힙니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 정렬 방향은 짙은 화살표의 모양(↑ · ↓)과 `aria-sort` 로도 알립니다. 고른 줄은 체크로 알립니다 ✓ |
| **WCAG 1.3.1** Info and relationships | `<table>` · `<caption>` · `<th scope="col">` · 첫 열 `<th scope="row">` — 보조 기술이 칸마다 열 이름과 줄 이름을 읽습니다. 표처럼 보이는 `div` 격자를 두지 않습니다 |
| **WCAG 4.1.3** Status messages | 고른 수("3개 선택됨") · 정렬 결과("남은 휴가 내림차순으로 정렬했어요.")를 `role="status"` 로 알립니다 ✓ — 고른 수의 status 는 바가 없을 때도 두어 처음 고를 때 읽힙니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 정렬 버튼 칸 폭 × 41 · 체크 · ⋮ 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 체크 · ⋮ 44 × 44 ✓. 정렬 버튼은 위아래로 44 까지 넓힙니다 ✓. 768 미만은 List 줄(46 이상) ✓ |
| **ARIA** | 정렬된 열의 머리 칸에 `aria-sort="ascending"` · `"descending"` 을 답니다(다른 열에는 달지 않습니다). 정렬 버튼의 이름은 열 이름입니다. ⋮ 열 머리는 숨긴 "동작", ⋮ 는 "{줄 이름} 더보기" 이고, `aria-haspopup` 은 여는 것대로 1280 이상 `"menu"`([Menu](menu.md)) · 미만 `"dialog"`([Menu Sheet](menu-sheet.md))입니다. 체크 이름은 "{줄 이름} 선택" · 머리 "모두 선택"(일부면 `aria-checked="mixed"`)입니다. 일괄 작업 바는 `role="region"` · `aria-label="선택한 항목"` 입니다 |

## Do / Don't

### ✅ Do

- 머리 41 · 줄 45(썸네일 · 두 줄이면 72)로 두고, 머리는 본문과 같은 14 · 짙은 글자 · 500 으로 씁니다.
- 줄 선은 마지막 줄까지 긋고, 세로 선 · 줄무늬는 두지 않습니다.
- 숫자 열은 머리까지 오른쪽 · 고정폭 숫자로 두고, 돈은 원까지 · 빼기는 U+2212 로 씁니다.
- 정렬할 수 있는 열에 ↑↓ 를 늘 두고, 정렬된 열에 `aria-sort` 를 답니다.
- 줄의 동작은 끝 ⋮ 하나로 모으고, 줄을 누르면 상세를 엽니다.
- 768 미만은 List 줄로 바꾸고, 표마다 제목 · 설명 · 오른쪽 값을 정해 둡니다.
- 실패는 Result Section `failure` + 다시 시도로 보입니다.

### ❌ Don't

- 작은 대문자 · 회색 머리, 머리 바탕을 쓰지 않습니다.
- 정렬된 열에만 화살표를 두거나, 마우스를 올려야 화살표가 보이게 하지 않습니다.
- 폰에서 가로로 밀어 보는 표 · 열을 숨긴 표를 쓰지 않습니다.
- 수정 · 삭제 아이콘을 줄마다 늘어놓거나, 이름 없는 ⋮ 를 두지 않습니다.
- 숫자를 왼쪽에 두거나 고정폭 글꼴로 쓰지 않고, 돈을 "1.2만" 으로 줄이지 않습니다.
- 실패를 빈 표("데이터가 없어요")로 보이거나, 줄을 불투명도로 흐리지 않습니다.
- 고른 줄에 바탕을 칠하지 않고(브랜드 옅은 바탕은 일괄 작업 바만), 정렬 없음으로 돌아가는 세 단계 정렬을 쓰지 않습니다.
- `div` 로 표를 짜지 않습니다.

## Specification

[그림: Specification — table.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#table)
