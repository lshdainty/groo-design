# Table

> 줄과 열로 된 데이터를 견주어 읽는 표 — HR 의 사용자 · 휴가 · 회비 · 신청 내역, Desk 의 가져오기 미리보기 · 일별 시세처럼 같은 모양의 줄을 열마다 맞춰 본다. 768 이상에서 표로 그리고, 768 미만에서는 같은 줄을 [List](list.md) 의 줄로 바꾼다. 표 아래 쪽 넘김은 [Table Pagination](table-pagination.md), 한 줄짜리 항목을 늘어놓는 목록은 처음부터 [List](list.md) 다.

SEED 에는 표 컴포넌트가 없다. SEED 팀이 코드로 그린 표는 문서 사이트의 표 하나다 — "SEED 테이블 디자인의 단일 소스" 라고 적은 문서 사이트 부품(`TableRoot`, 제품 컴포넌트가 아니다)으로, 머리 14 / 20 · 500 · 짙은 글자 · 바탕 없음 · 높이 41, 본문 14 / 20 · 400 · 높이 45, 줄 선은 마지막 줄까지, 세로 선 · 줄무늬가 없다. 디자인 문서의 그림(Table Pagination 문서의 데이터 표)이 선택 칸 · 썸네일과 두 줄 칸 · 정렬 표시 ↑↓ · 숫자 오른쪽 · ⋮ 열 · 줄 72 를 보인다. 이 둘이 porest 표의 바탕이고(당근 SEED, Apache-2.0), 정렬 동작 · 선택 · 일괄 작업 바 · 머리 고정 · 좁은 화면 · 빈 · 실패처럼 SEED 가 적지 않은 자리는 porest 가 정했다(2026-10-08 사용자 결정). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Table 스펙(작은 대문자 회색 머리 · 회색 머리 바탕 · 칸 8 · 금액 고정폭 글꼴)을 대신한다.

수치 원본은 [`table.yaml`](table.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 사용자 표(데스크톱) · 같은 줄을 List 로(폰) — 라이트 · 다크](../../site/components/specs/table.tsx#hero)

### 직접 골라 보기

줄 종류(한 줄 · 썸네일) · 정렬할 열과 방향 · 고르기 · 폭(데스크톱 · 폰)을 고르면 스펙대로 그린 표와 그 코드가 바뀐다. 머리를 누르면 정렬이 바뀌고, 체크를 누르면 일괄 작업 바가 뜬다. 폰 폭을 고르면 같은 줄이 List 줄로 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/table.tsx#playground)

## Anatomy

[그림: 표는 머리 줄 · 본문 줄 · 칸으로 이뤄지고, 정렬 표시 · 상태 배지 · 줄 끝 ⋮ · 선택 칸 · 일괄 작업 바를 붙인다](../../site/components/specs/table.tsx#anatomy)

| ⓐ Root | 표 상자 — 카드 안에 가장자리까지 붙는다. 표와 넘김 줄을 담고, 넘치면 함께 가로로 민다. |
| ⓑ Header Row | 머리 줄 — 41, 바탕 없음, 아래 선. |
| ⓒ Header Cell | 머리 칸 — 열 이름 14 / 20 · 500. 정렬할 수 있는 열은 칸 전체가 버튼이다. |
| ⓓ Sort Icon | 정렬 표시 ↑↓ — 정렬할 수 있는 열에 늘 있고, 지금 방향만 짙다. |
| ⓔ Row | 본문 줄 — 45(썸네일 · 두 줄 칸이 있으면 72), 아래 선은 마지막 줄까지. |
| ⓕ Cell | 본문 칸 — 14 / 20 · 400. 숫자는 오른쪽. |
| ⓖ Badge | 상태 칸 — [Badge](badge.md) medium weak. |
| ⓗ More Button | 줄 끝 ⋮ — 보이는 40 · 누르는 44, 이름 "{줄 이름} 더보기". |
| ⓘ Checkbox | 선택 칸 — [Checkbox](checkbox.md) large 24. 머리는 전체 · 일부. |
| ⓙ Bulk Bar | 일괄 작업 바 — 고른 줄이 있을 때만 표 위에. |

[표: 부위](table.yaml#slots)

## Properties

### 머리 · 줄

머리 줄은 41(위아래 10 + 글 20 + 선 1), 본문 줄은 45(위아래 12 + 글 20 + 선 1)다 — SEED 문서 표 그대로. 칸의 좌우는 16 이고, 표가 카드 안에 가장자리까지 붙으므로 첫 칸 앞 · 끝 칸 뒤만 카드 여백과 같은 24 다(카드 머리 제목과 첫 열 글자가 한 줄에 선다). 머리 글자는 본문과 같은 14 · 짙은 `fg-neutral` 에 굵기만 500 이다 — 작은 대문자 · 회색 · 머리 바탕을 두지 않는다. 글은 `t4`(14 / 19)에 줄 높이만 20 으로 둔다.

줄 선은 1px `stroke-neutral-subtle` 이고 머리 아래 · 줄마다 · 마지막 줄 아래까지 긋는다 — 마지막 선이 표 끝을 마감한다. 세로 선 · 줄무늬 · 바깥 테두리는 없다.

[그림: 머리 41 · 줄 45 · 첫 칸 24 · 칸 16 · 줄 선은 마지막 줄까지](../../site/components/specs/table.tsx#rows)

[표: 표 상자](table.yaml#base.enabled@root)

[표: 머리 줄](table.yaml#base.enabled@headerRow)

[표: 머리 칸](table.yaml#base.enabled@headerCell)

[표: 본문 줄](table.yaml#base.enabled@row)

[표: 본문 칸](table.yaml#base.enabled@cell)

### 줄 종류 — 45 · 72

줄 높이는 하나다 — 45. 칸 하나라도 썸네일(Image Frame 1:1 48)이나 두 줄 글(윗줄 14 + 둘째 줄 13 · `fg-neutral-subtle`)을 두면 그 표의 모든 줄이 72 다(SEED 그림). 한 표 안에서 줄 높이를 섞지 않고, 촘촘한 · 넉넉한 두 벌(밀도 변형)을 두지 않는다. 사람은 [Avatar](avatar.md) 42, 은행 · 카드 같은 물건은 [Logo Tile](logo-tile.md) 40 을 썸네일 자리에 둔다.

[그림: 한 줄 표 45 · 썸네일 · 두 줄 표 72](../../site/components/specs/table.tsx#row-kinds)

[표: 줄 종류](table.yaml#row)

[표: 둘째 줄](table.yaml#base.enabled@detail)

[표: 썸네일](table.yaml#base.enabled@thumbnail)

### 숫자 열

금액 · 개수 · 비율은 오른쪽에 맞추고 고정폭 숫자(`tabular-nums`)로 둔다 — 자릿수가 위아래로 맞아 크기를 견준다. 머리도 오른쪽이다. 고정폭 글꼴(mono)은 쓰지 않는다. 돈은 줄이지 않고 원까지("1,240,000원"), 빼기는 U+2212(−) 하나다(International Design). 날짜는 왼쪽이다 — 같은 형식이라 자리가 맞는다. 오르내림을 적는 칸(등락률)은 [증감 표기](card.md#증감-표기)대로 ▲ `fg-critical` · ▼ `fg-informative` + 값이다.

[그림: 숫자 열 — 오른쪽 · 고정폭 숫자 · 머리도 오른쪽, 왼쪽에 둔 숫자](../../site/components/specs/table.tsx#numbers)

[표: 맞춤](table.yaml#align)

### 정렬

정렬할 수 있는 열은 머리 칸 전체가 버튼이고, 열 이름 오른쪽 6 에 ↑↓ 표시(16)를 늘 둔다 — 흐린 `fg-neutral-muted` 둘에서 지금 정렬된 방향 하나만 `fg-neutral` 로 짙어진다(SEED 그림). 어느 열을 정렬할 수 있는지 처음부터 보이므로, 마우스를 올려야 화살표가 나타나는 열은 없다. 정렬하지 않는 열(이미지 · ⋮ · 긴 설명)은 글만이다.

정렬은 두 단계다 — 누를 때마다 내림 ↔ 오름이 바뀌고, 정렬 없음으로 돌아가지 않는다(사용자 결정). 처음 누르면 숫자 · 날짜 열은 내림(큰 값 · 최근 것 먼저), 글 열은 오름(가나다)이다. 다른 열을 누르면 그 열의 처음 방향으로 옮긴다.

[그림: 정렬 — 늘 보이는 ↑↓, 지금 방향만 짙게(남은 휴가 ↓)](../../site/components/specs/table.tsx#sort)

[표: 정렬](table.yaml#sort)

### 상태 칸

상태는 [Badge](badge.md) medium(20) · `weak` 이고 톤이 뜻을 말한다(재직 `positive` · 휴직 `warning` · 초대 대기 `neutral`). 한 열은 한 변형이고, 글 열처럼 왼쪽에 맞춘다.

[표: 상태 배지](table.yaml#base.enabled@badge)

### 줄 끝 ⋮

줄의 동작(수정 · 삭제 …)은 줄 끝 ⋮ 하나로 연다 — [Button](button.md) `ghost` · `iconOnly` · `medium`(보이는 40 · 누르는 44), 이름 "{줄 이름} 더보기". 1280 이상은 [Menu](menu.md), 미만은 [Menu Sheet](menu-sheet.md) 다. 열 폭은 80(앞 16 + 40 + 끝 24 — 끝 열이라 카드 여백)이고 머리 칸에는 글을 쓰지 않는다 — 보조 기술에는 숨긴 "동작" 이 읽힌다. 줄을 누르면 상세가 열린다.

[그림: 줄 끝 ⋮ — 40 · 누르는 44 · 머리 글 없음](../../site/components/specs/table.tsx#more)

[표: 줄 끝 ⋮](table.yaml#base.enabled@moreButton)

### 선택 · 일괄 작업 바

여럿을 골라 한 번에 다루는 표만 첫 열에 [Checkbox](checkbox.md) large(24)를 둔다. 머리 칸의 체크는 지금 쪽의 줄 전부를 고르고 풀며, 일부만 골랐으면 일부(indeterminate)다. 한 줄 이상 고르면 표 위에 일괄 작업 바가 뜬다 — 바탕 `bg-brand-weak` 한 값, 높이 48 · 모서리 12, 왼쪽에 "3개 선택됨", 오른쪽에 동작([Button](button.md) `ghost` small)과 선택 해제 ✕. 고른 줄 자체에는 바탕을 칠하지 않는다 — 체크가 고른 것을 말한다([List](list.md) 의 여럿 고르기와 같다, 사용자 결정). 브랜드 옅은 바탕은 일괄 작업 바에만 있다.

[그림: 선택 열 · 머리 체크 일부 · 일괄 작업 바 — 고른 줄은 바탕 없이 체크로만](../../site/components/specs/table.tsx#selection)

[표: 고르기](table.yaml#selection)

[표: 선택 칸](table.yaml#base.enabled@checkbox)

[표: 일괄 작업 바](table.yaml#base.enabled@bulkBar)

### 머리 고정

줄이 많은 표(25 · 50줄 보기)나 위젯 · 대화상자 안의 표처럼 표 상자에 높이를 정해 상자 안에서 스크롤하면 머리 줄을 상자 맨 위에 붙인다. 붙은 머리는 카드 면과 같은 `bg-layer-default` 로 칠해 지나가는 줄을 가린다 — 바탕이 달라 보이지 않는다. 페이지 전체가 스크롤할 때는 붙이지 않는다(상단 바와 겹친다).

[그림: 상자 안에서 스크롤 — 머리는 맨 위에, 줄은 그 아래로](../../site/components/specs/table.tsx#sticky)

### State

줄을 누르면 상세가 열리는 표만 상태가 있다. 보기만 하는 표의 줄은 바뀌지 않는다.

| 상태 | 모습 |
|---|---|
| `enabled` | 줄 바탕 없음 |
| `hovered` | 웹 · 누르는 줄 — 줄 전체가 `bg-layer-default-pressed`(누름과 같은 색 — v106). 정렬 버튼도 같다 |
| `pressed` | 같은 바탕 — 축소는 없다(표의 줄 · 칸은 이웃과 붙어 있어 줄이면 흔들린다) |
| `focused` | 웹 — 키보드 포커스가 간 링크 · 버튼 · 정렬 버튼에 안쪽 2px 링 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스](../../site/components/specs/table.tsx#states)

[표: 상태 — 줄](table.yaml#matrix@row)

[표: 상태 — 정렬 버튼](table.yaml#matrix.sort.sortable@sortButton)

[표: 모션](table.yaml#motion)

## Guidelines

### 768 미만은 List 줄로

768 미만에서는 표를 그리지 않고 줄마다 [List](list.md) 의 누르는 줄로 바꾼다 — 폰에서 옆으로 밀거나 열을 숨겨 보지 않는다(사용자 결정). 표마다 줄에 무엇을 둘지 이 규칙으로 정한다.

| 표 | List 줄 |
|---|---|
| 첫 열(그 줄의 이름) | 제목(16 / 22) |
| 다음으로 중요한 열 1 ~ 2개 | 설명(13 · `fg-neutral-subtle`, " · " 로 잇는다) |
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

줄 사이 1px 선 하나로 줄을 가른다 — 마지막 줄 아래까지. 세로 선 · 줄무늬(짝수 줄 바탕) · 머리 바탕 · 작은 대문자 머리를 두지 않는다. 줄이 길어 따라 읽기 어려우면 줄무늬 대신 열을 줄인다.

[그림: 줄 선만 · 세로 선 · 줄무늬 · 회색 머리 바탕](../../site/components/specs/table.tsx#line-guide)

### 숫자는 오른쪽, 돈은 원까지

숫자 열은 머리까지 오른쪽이다 — 왼쪽에 두면 자릿수가 어긋나 큰 값을 한눈에 못 찾는다. 돈은 줄이지 않는다("1.2만원" 이 아니라 "12,000원"). 표는 넓은 화면의 자리라 줄일 이유가 없다.

[그림: 숫자 열 — 오른쪽 · 왼쪽](../../site/components/specs/table.tsx#number-guide)

### 줄의 동작은 ⋮ 하나

수정 · 삭제 아이콘을 줄마다 늘어놓지 않는다 — 줄 끝 ⋮ 하나에 모으고, 줄 자체를 누르면 상세가 열린다([Menu](menu.md) 의 "줄의 동작"). 줄 안의 누르는 것(체크 · 줄 · ⋮)은 셋을 넘지 않는다.

[그림: ⋮ 하나 · 늘 보이는 아이콘 묶음](../../site/components/specs/table.tsx#actions-guide)

### 표처럼 보이면 table 로

열을 맞춰 줄을 견주는 자리는 `div` 격자가 아니라 `<table>` 로 짠다 — 일별 시세 · 호가 · 체결도 표다. `div` 로 짜면 보조 기술이 열 이름을 읽지 못한다. 반대로 줄 하나에 한 항목을 보이는 목록(거래 · 할 일)은 표가 아니라 [List](list.md) 다.

[그림: 일별 시세 — table · div 격자](../../site/components/specs/table.tsx#grid-guide)

### 불러오는 동안 · 비었을 때 · 실패했을 때

머리 줄은 처음부터 그린다 — 열 이름은 서버에서 오지 않는다. 불러오는 동안은 줄 자리만 [Skeleton](skeleton.md)(줄 높이 그대로 · 글 자리 `t4` 19)이다. 비었으면 본문 자리에 [Result Section](result-section.md) `medium`("등록된 사용자가 없어요" · 거르기 때문이면 "조건에 맞는 사용자가 없어요" + "필터 초기화"), 불러오지 못했으면 `failure` + "다시 시도" 다 — 실패를 빈 표로 보이지 않는다. 시간표(1 · 5 · 10초)는 [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) 이다.

[그림: 불러오는 동안 줄 스켈레톤 · 비었음 · 실패 + 다시 시도](../../site/components/specs/table.tsx#status-guide)

### 표 아래는 Table Pagination

줄이 한 쪽(10줄)보다 많을 수 있으면 표 아래 12 에 [Table Pagination](table-pagination.md) 을 둔다 — 표와 같은 상자 안이라 열이 넘쳐 가로로 밀 때 함께 밀린다. 넘기면 표 맨 위로 스크롤한다.

### 글

열 이름은 짧은 명사("이름" · "남은 휴가" · "상태") — 영어("Email") · 마침표 없이, 단위는 칸에("12.5일"). 표 이름은 카드 머리의 제목이고 `<caption>` 에 같은 글을 둔다. 고른 수는 "3개 선택됨", 선택 칸의 이름은 "{줄 이름} 선택" · 머리는 "모두 선택", ⋮ 는 "{줄 이름} 더보기" 다.

## 코드

레시피 `recipes/shadcn/components/ui/table.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Table` — 표 상자(가로 스크롤) + `<table>`. `caption`(필수 — 숨긴 표 이름, 보이는 제목은 카드 머리) · `rowHeight`(`"text"` 기본 45 · `"rich"` 72) · `stickyHeader`(상자가 스스로 스크롤할 때 머리를 붙인다 — 높이는 `className` 의 `max-h-*`) · `pagination`(표 아래 [Table Pagination](table-pagination.md) 자리 — 표와 같은 가로 스크롤 상자 안, 위 12 · 좌우 24) · `tableClassName`(안쪽 `<table>` 에 붙는 클래스).
- `TableHeader` · `TableBody` · `TableRow` — `<thead>` · `<tbody>` · `<tr>`. `TableRow` 에 `onClick` 을 주면 누르는 줄이다(호버 · 누름 바탕) — 키보드로는 첫 열의 이름 링크(`TableRowHeader` 의 `href` 또는 `onClick`)로 같은 곳에 간다.
- `TableHead` — 머리 칸(`<th scope="col">`). `align`(`"start"` 기본 · `"end"`) · `sort`(`"none"` · `"ascending"` · `"descending"` — 주면 정렬할 수 있는 열, 칸 전체가 버튼이고 ↑↓ 를 늘 그린다 · `aria-sort` 를 단다) · `onSortChange(next)`(누를 때마다 내림 ↔ 오름, 두 단계 — `"none"` 으로 돌아가지 않는다) · `defaultSortDirection`(그 열을 처음 누를 때의 방향 — 기본은 `align="end"`(숫자)면 `"descending"`, 아니면 `"ascending"`. 날짜 열은 `"descending"` 을 준다).
- `TableRowHeader` — 첫 열(`<th scope="row">`, 그 줄의 이름). `href` · `onClick` 을 주면 이름이 링크 · 버튼이 된다.
- `TableCell` — 본문 칸(`<td>`). `align`. 숫자는 `align="end"` 가 고정폭 숫자를 건다.
- `TableCellContent` — 썸네일 · 두 줄 칸. `media`(Image Frame 48 · Avatar 42 · Logo Tile 40) · `title` · `detail`.
- `TableSelectHead` · `TableSelectCell` — 선택 칸. 머리는 `checked`(`true` · `false` · `"indeterminate"`) · `onCheckedChange`(이름 "모두 선택"), 줄은 `checked` · `onCheckedChange` · `label`(이름 "{label} 선택"). 줄을 누르는 것과 따로다.
- `TableMoreHead` · `TableMoreCell` — ⋮ 열. 머리는 숨긴 "동작", 칸은 `label`(이름 "{label} 더보기") · `open` · `onOpenChange` + 자식에 `ResponsiveMenuContent`(1280 이상 Menu · 미만 Menu Sheet — menu.md).
- `TableBulkBar` — 일괄 작업 바. `count`(0 이면 그리지 않는다 · "{count}개 선택됨" 을 알린다) · `onClear`(✕ "선택 해제") · 자식은 동작 버튼(Button `ghost` small).
- `TableStatusRow` — 본문 자리 한 칸(`colSpan` 전체). 자식은 `ResultSection size="medium"`(비었음 · 실패) — 표가 카드 안이라 Result Section 의 좌우 여백은 0, 칸의 24 만 둔다(card.md).
- `TableSkeletonRows` — 불러오는 동안의 줄. `rows`(기본 10 — 줄 수 보기) · `columns`(열마다 맞춤 · 폭).
- `useTableLayout()` — `"table"`(768 이상) · `"list"`(미만). 768 미만이면 쓰는 쪽이 같은 데이터를 [List](list.md) 줄로 그린다(위 "768 미만은 List 줄로").

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
  <Button variant="ghost" ghostColor="critical" size="small" onClick={askDeleteSelected}>삭제</Button>
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
| 정렬할 수 있는 머리 누르기 | 그 열로 정렬 — 처음은 숫자 · 날짜 열 내림, 글 열 오름. 다시 누르면 반대로, 또 누르면 다시 반대로(두 단계 — 정렬 없음으로 돌아가지 않는다). 다른 열을 누르면 그 열의 처음 방향으로 옮긴다. 정렬을 바꾸면 첫 쪽으로 돌아간다(Table Pagination) |
| 줄 누르기(누르는 표) | 상세를 연다. 체크 · ⋮ 를 누른 것은 줄 누르기가 아니다 |
| 체크 누르기 | 그 줄을 고르거나 푼다 — 고른 수가 1 이상이면 일괄 작업 바가 뜨고 "{n}개 선택됨" 을 알린다 |
| 머리 체크 누르기 | 지금 쪽의 줄을 모두 고르거나 푼다 — 일부 고른 상태면 모두 고른다 |
| 일괄 작업 바 ✕ | 고른 것을 모두 푼다 — 초점은 머리 체크로 |
| ⋮ 누르기 | 1280 이상 Menu · 미만 Menu Sheet — 동작을 고르면 닫고 실행(menu.md) |
| `Tab` | 문서 차례 — 선택 칸이 첫 열이면 머리 체크 → 정렬 버튼, 그다음 줄마다 체크 · 이름 링크 · ⋮. 칸 사이를 화살표로 옮기지 않는다(표는 `grid` 가 아니다) |
| 상자 안 스크롤 | 머리는 맨 위에 붙는다 |
| 768 미만 | 표 대신 List 줄 — 넘김 대신 끝없이 불러오기 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 머리 · 칸 `fg-neutral` 카드 면 위 16.41 · 다크 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 둘째 줄 `fg-neutral-subtle` 5.50 · 6.09 ✓. 일괄 작업 바 글 `fg-neutral` `bg-brand-weak` 위 Desk 14.42 · 다크 12.07 · HR 14.79 · 다크 11.68 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | ↑↓ 흐린 쪽 `fg-neutral-muted` 7.11 · 다크 7.70, 짙은 쪽 `fg-neutral` ✓. 줄 선은 장식(1.15) — 줄은 글의 자리로 읽힌다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 정렬 방향은 짙은 화살표의 모양(↑ · ↓)과 `aria-sort` 로도 알린다. 고른 줄은 체크로 ✓ |
| **WCAG 1.3.1** Info and relationships | `<table>` · `<caption>` · `<th scope="col">` · 첫 열 `<th scope="row">` — 보조 기술이 칸마다 열 이름과 줄 이름을 읽는다. 표처럼 보이는 `div` 격자를 두지 않는다 |
| **WCAG 4.1.3** Status messages | 고른 수("3개 선택됨") · 정렬 결과("남은 휴가 내림차순으로 정렬했어요.")를 `role="status"` 로 ✓ — 고른 수의 status 는 바가 없을 때도 두어 처음 고를 때 읽힌다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 정렬 버튼 칸 폭 × 41 · 체크 · ⋮ 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 체크 · ⋮ 44 × 44 ✓. 정렬 버튼은 위아래로 44 까지 넓힌다 ✓. 768 미만은 List 줄(46 이상) ✓ |
| **ARIA** | 정렬된 열의 머리 칸에 `aria-sort="ascending"` · `"descending"`(다른 열에는 달지 않는다). 정렬 버튼의 이름은 열 이름. ⋮ 열 머리는 숨긴 "동작", ⋮ 는 "{줄 이름} 더보기" · `aria-haspopup="menu"`. 체크 이름 "{줄 이름} 선택" · 머리 "모두 선택"(일부면 `aria-checked="mixed"`). 일괄 작업 바는 `role="region"` · `aria-label="선택한 항목"` |

## Do / Don't

### ✅ Do

- 머리 41 · 줄 45(썸네일 · 두 줄이면 72), 머리는 본문과 같은 14 · 짙은 글자 · 500.
- 줄 선은 마지막 줄까지 — 세로 선 · 줄무늬 없이.
- 숫자 열은 머리까지 오른쪽 · 고정폭 숫자, 돈은 원까지 · 빼기는 U+2212.
- 정렬할 수 있는 열에 ↑↓ 를 늘, 정렬된 열에 `aria-sort`.
- 줄의 동작은 끝 ⋮ 하나, 줄을 누르면 상세.
- 768 미만은 List 줄 — 표마다 제목 · 설명 · 오른쪽 값을 정해 둔다.
- 실패는 Result Section `failure` + 다시 시도.

### ❌ Don't

- 작은 대문자 · 회색 머리, 머리 바탕.
- 정렬된 열에만 화살표 · 마우스를 올려야 보이는 화살표.
- 폰에서 가로로 밀어 보는 표 · 열을 숨긴 표.
- 줄마다 늘어놓은 수정 · 삭제 아이콘, 이름 없는 ⋮.
- 숫자를 왼쪽에 · 고정폭 글꼴로, 돈을 "1.2만" 으로.
- 실패를 빈 표("데이터가 없어요")로 · 줄을 불투명도로 흐리기.
- 고른 줄에 바탕을 칠하기(브랜드 옅은 바탕은 일괄 작업 바만) · 정렬 없음으로 돌아가는 세 단계 정렬.
- `div` 로 짠 표.

## Specification

`table.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Table 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — table.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#table)

## SEED 와 다른 점

- **porest 가 정한 자리가 많다** — SEED 에 표 컴포넌트가 없어 정렬 동작 · `aria-sort` · 선택 · 일괄 작업 바 · 머리 고정 · 좁은 화면 · 빈 · 실패 · `caption` · `scope` 는 porest 규칙이다. 머리 · 줄 · 선 · 글은 문서 사이트 표, ↑↓ · 72 · 숫자 오른쪽 · ⋮ 열은 디자인 그림을 따랐다.
- **줄 선은 불투명한 `stroke-neutral-subtle`** — SEED 안에서 문서 표(`stroke.neutral-muted`, 마지막 줄까지)와 토큰 설명("테이블 row = `stroke.neutral-subtle`")이 갈리고 둘 다 투명도가 있다. porest 의 불투명 짝은 둘 다 `stroke-neutral-subtle` 이다(v102). 마지막 줄 아래 선은 문서 표를 따른다(Divider 문서의 "마지막 요소 하단에는 표시하지 않습니다" 와 갈리는 자리).
- **머리 굵기 500** — 문서 표 값. SEED 그림은 굵게(700 안팎) 보이고 Layout 그림은 더 가늘다.
- **첫 칸 앞 · 끝 칸 뒤 24** — 표가 카드(카드 여백 24) 안에 가장자리까지 붙는다. SEED 문서 표는 사방 16 이다.
- **상태 배지 왼쪽** — SEED 그림은 가운데. 글 열과 같은 맞춤으로 둔다.
- **줄 호버 바탕은 `bg-layer-default-pressed`** — 누르는 줄만. SEED 문서 표는 모든 줄에 `bg.neutral-weak`(한 단계 진하다)다.
- **768 미만은 List 줄** — SEED 문서 표 · Table Pagination 예제는 감싸개가 가로로 밀린다(사용자 결정 — 가로 스크롤 · 열 숨김은 고르지 않았다).

## Migration notes

### 2026-10-08 — SEED 문서 표 · 그림으로 다시 쓴다

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)에서 정했다 — 머리 · 줄은 SEED 문서 표(1A — 머리 41 · 14 / 20 · 500 · 짙은 글자 · 바탕 없음, 줄 45, 줄 선 `stroke-neutral-subtle` 마지막 줄까지, 썸네일 · 두 줄 줄 72), 정렬 표시는 늘 보이는 ↑↓(2A — 지금 방향만 짙게, 머리는 버튼 + `aria-sort`), 768 미만은 List 줄(3B). 그리고 "따라오는 것" — 숫자 열 오른쪽 + 고정폭 숫자(머리도) · mono 걷음 · U+2212, 줄 끝 ⋮(보이는 40 · 누르는 44 · "{줄} 더보기", 머리 글 없음), 선택 체크 24, 일괄 작업 바 `bg-brand-weak` 하나, `table` · `caption` · `scope` · `aria-sort`, `div` 격자 표는 `table` 로, 머리 고정, 줄 스켈레톤 · 표 자리 Result Section + 다시 시도. 작은 대문자 회색 머리 · 머리 바탕(1B) · HR 그대로(1C) · 정렬된 열에만 화살표(2B) · 가로 스크롤 + 첫 열 고정(3A) · 열 숨김(3C)은 고르지 않았다. 스펙을 쓰다 나온 것(같은 비교 페이지 18 · 21) — 정렬은 두 단계(18A — 누를 때마다 내림 ↔ 오름, 숫자 · 날짜 열은 처음 내림, 정렬 없음까지 세 단계(18B)는 고르지 않았다), 고른 줄은 체크로만(21A — 바탕 + 체크(21B)는 고르지 않았다). 옛 스펙은 `table.history/v-pre-seed-data.*` 에 남겼고, DESIGN.md 의 Data Table 절(v71)은 이 스펙으로 합쳤다.

| 옛 Table | 새 Table |
|---|---|
| 머리 40 · 12 / 600 · 대문자 · `text-tertiary` · 머리 바탕 `bg-page` | 41 · 14 / 20 · 500 · `fg-neutral` · 바탕 없음 |
| 칸 사방 8 · 글 15 | 위아래 12 · 좌우 16(첫 칸 앞 · 끝 칸 뒤 24) · 14 / 20 |
| 줄 선 `border-default` · 호버 `surface-input` 50% · 고른 줄 바탕 | `stroke-neutral-subtle` 마지막 줄까지 · 누르는 줄만 `bg-layer-default-pressed` · 고른 줄은 체크로만 |
| 정렬 — 정렬된 열에만 ↑ / ↓, 나머지는 호버 때 ↕ · 오름 → 내림 → 없음 | 정렬할 수 있는 열에 ↑↓ 늘, 지금 방향만 짙게 · 내림 ↔ 오름 두 단계(숫자 · 날짜는 처음 내림) |
| 금액 `font-mono tabular-nums` | 고정폭 숫자만 — 고정폭 글꼴 걷음 |
| 일괄 작업 바 `primary` 10%(DESIGN 8%) · 모서리 4 | `bg-brand-weak` 한 값 · 48 · 모서리 12 |
| 좁은 화면 — 열 숨김 또는 카드 | 768 미만 List 줄 |

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — HR · Desk 웹은 크로미움에 띄워 쟀고, Desk 앱은 코드로 봤다).

- **HR 표 10개가 shadcn 기본값 그대로** — 머리 48 · 14 / 500 · `muted-foreground` #787878(흰 바탕 **4.42** · 다크 4.13 — 4.5 미달), 칸 16, 줄 65(두 줄 73), 줄 선 #EEEEEE · 마지막 줄 선 없음(`[&_tr:last-child]:border-0`), 호버 바탕은 표 면과 1.03(`shared/ui/shadcn/table.tsx:64 · 79 · 93`). 사용자(`features/admin-users-management/ui/UserTable.tsx:91-306`) · 휴가 내역(`features/vacation-history/ui/VacationHistoryContent.tsx:86-280`) · 회비(`features/culture-dues/ui/DuesTableContent.tsx:77-306`) · 신청 내역(`features/vacation-application/ui/ApplicationTableContent.tsx:47-184`) · 업무 보고(`features/work-report/ui/ReportTable.tsx:137-399`) · 업무 코드(`features/admin-work-code/ui/WorkCodeList.tsx:57` · `WorkDivisionList.tsx:57`) · 위젯 표(`features/dashboard/ui/widgets/UserVacationStats/UserVacationStatsContent.tsx:21-50`) · 대화상자 안 표(`features/admin-holiday/ui/BulkGenerateHolidayDialog.tsx:327` · `features/work-report/ui/ExcelImportDialog.tsx:332`). 머리 41 · 줄 45 로.
- **HR 표 — 정렬 · `aria-sort` · `scope` · `caption` 0** — 열 머리 "Email" 이 영어다(`UserTable.tsx`). 정렬할 수 있는 열을 표마다 정하고 ↑↓ 를 단다.
- **HR 숫자가 왼쪽** — 회비 표의 금액 · 총액이 `text-align: start` · 기본 숫자이고 입금 파랑 / 출금 빨강 글자색이다(`DuesTableContent.tsx`). 오른쪽 + 고정폭 숫자로 — 입금 · 출금은 글("입금" · "출금")이나 부호로도 알린다.
- **HR 줄 ⋮ 에 이름이 없다** — 32 × 32 · 아이콘 16 · 이름 ""(Tab 순서 "초대" → "" → "" …, `UserTable.tsx` · `DuesTableContent.tsx:200` · `ApplicationTableContent.tsx:142` · `VacationHistoryContent.tsx:131` · `ReportTable.tsx:354-363`). Button `ghost` `iconOnly` medium 40(누르는 44) · "{줄 이름} 더보기" 로.
- **HR 360 폭은 가로 스크롤만** — 표 최소 폭 800 ~ 1500(`min-w-[…]`)이 246 ~ 296 상자 안에서 밀린다. 768 미만 대체 레이아웃 0(`useIsMobile` + Table 파일 0). 표마다 List 줄 대응을 정해 바꾼다.
- **HR 빈 표 세 가지** — antd `Empty`(사용자 표 `UserTable.tsx:20 · 254` — 기본 영어 문구로 보인다) · shadcn `Empty`(회비) · 표 안 높이 250 `Empty`(신청 내역 `ApplicationTableContent.tsx:62-75`), 실패는 `QueryAsyncBoundary` 의 "오류가 발생했습니다."(다시 시도 0). Result Section `medium` + 다시 시도로.
- **HR 위젯에서만 머리 고정** — 휴가 내역 위젯(`VacationHistoryContent.tsx:94 · 176`)만 `stickyHeader`. 상자가 스스로 스크롤하는 표는 모두 머리를 붙인다.
- **Desk 웹 `<table>` 2** — 가져오기 미리보기(`widgets/data-transfer/ui/DataImportSection.tsx:495-591` — 머리 12 · 700, 금액만 오른쪽, **오류 줄 불투명도 .4 · 중복 줄 .5** `:530-537` — v106 "불투명도로 흐리지 않는다")와 내보내기 미리보기(`DataExportSection.tsx:593-634 · 738-755`). 오류 · 중복 줄은 흐리지 않고 상태 배지("오류" · "중복")로 가른다.
- **Desk 웹 `div` 격자 표 3** — 일별 시세(`features/stock/ui/daily-quote-table.tsx:70-212` — 머리 11 / 600 · 줄 35.8 · 하락률 "-1.00%" 가 ASCII 빼기 `:190`) · 호가(`pages/stocks/ui/TossStocksPage.tsx:115-336`) · 체결(`:338-445` — 머리 10.5 / 600 · 줄 25). 표 의미(`table` · `role=row`)가 0 이다. `<table>` 로, 등락률은 ▲ · ▼ + 값으로.
- **Desk 앱 Material `DataTable` 2** — 가져오기 · 내보내기(`features/import/presentation/import_view.dart:510-` · `features/export/presentation/export_screen.dart:679-`) — 머리 36 · 줄 32 ~ 44 · 가로 스크롤 · 숫자 맞춤 지정 0(`DataColumn(numeric:)`). 폰이라 List 줄로.
- **넘김** — HR 표 아래 넘김 줄은 [Table Pagination](table-pagination.md) 의 Migration notes 에 있다.
