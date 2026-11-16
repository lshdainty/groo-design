# Table Pagination

> 데이터 표 아래의 쪽 넘김 한 줄입니다. 한 번에 몇 줄을 볼지("10개 씩 보기")와 지금 범위("11-20 / 총 237개")를 고르고, 이전 · 다음으로 넘깁니다. 표가 아닌 목록은 [Pagination](pagination.md) 을, 표 자체는 [Table](table.md) 을 씁니다.

표에서는 번호로 뛰는 일보다 정렬 · 거르기로 찾거나 차례로 훑는 일이 많아 [Pagination](pagination.md) 과 따로 둡니다. 줄 수 고르기(Rows Per Page) · 범위 고르기(Page Range) · 이전 · 다음으로 이뤄지며, 고르기 둘은 [Select](select.md) medium, 이전 · 다음은 [Pagination](pagination.md) 의 화살표 칸입니다.

수치 원본은 [`table-pagination.yaml`](table-pagination.yaml)입니다.

[그림: HR 사용자 표 · 휴가 내역 표 아래의 줄 — 라이트 · 다크](../../site/components/specs/table-pagination.tsx#hero)

### 직접 골라 보기

전체 수(앎 · 모름 · 0개) · 줄 수 · 지금 범위를 바꾸면 줄과 코드가 함께 바뀝니다. 줄 수를 바꾸면 첫 범위로 돌아가고, 마지막 범위에서는 다음이 막힙니다.

[그림: 플레이그라운드](../../site/components/specs/table-pagination.tsx#playground)

## Anatomy

[그림: 줄은 왼쪽 줄 수 고르기 + "씩 보기", 오른쪽 범위 고르기 + "/ 총 N개" + 이전 · 다음](../../site/components/specs/table-pagination.tsx#anatomy)

| ⓐ Rows Per Page | 줄 수 고르기 — "10개" · "25개" · "50개" + "씩 보기" 입니다. |
| ⓑ Page Range | 범위 고르기 — "11-20" + "/ 총 237개" 입니다. 목록은 최대 높이 240 입니다. |
| ⓒ Previous · Next | 이전 · 다음 — 40 × 40 화살표이며, 끝에서는 막힙니다. |

[표: 부위](table-pagination.yaml#slots)

## Properties

### 줄

줄은 높이 40 · 한 줄 · 양 끝 정렬입니다. 왼쪽 묶음과 오른쪽 묶음 사이, 범위 묶음과 화살표 사이는 16 입니다. 고르기 둘은 Select medium(40 · 최소 폭 96)이고, 고르기와 글 사이는 8, 글은 14 / 19 · 400 입니다. 고르기는 화면 폭과 상관없이 medium 입니다 — 줄이 한 높이 40 을 지키도록 [Select](select.md) 의 "1280 미만 large 52" 규칙의 예외로 둡니다. 줄은 표 아래 12 에 두며, 이 12 는 넘김 줄이 갖습니다. Table 의 `pagination` 자리는 좌우 24 만 두고 위 여백을 더하지 않으므로, 자리에 넣어도 표 바로 뒤에 두어도 간격은 12 입니다.

[그림: 줄의 간격 — 40 · 사이 16 · 8 · 화살표 40 둘](../../site/components/specs/table-pagination.tsx#layout)

[표: 공통](table-pagination.yaml#base.enabled)

### 전체 수

전체 수를 알면 범위를 고르기로 두고 "/ 총 N개" 를 붙입니다. 모르면(다음이 있는지만 알면) 범위를 글로만 보입니다 — "11-20". 수는 세 자리마다 쉼표를 넣습니다("1,240").

[그림: 전체를 앎 — 고르기 + "/ 총 237개" · 모름 — "11-20" 글만](../../site/components/specs/table-pagination.tsx#total)

[표: 전체 수](table-pagination.yaml#total)

### 이전 · 다음 — 끝에서 막힙니다

이전 · 다음은 [Pagination](pagination.md) 의 화살표 칸(40 × 40 · 아이콘 16)입니다. 끝에서는 숨기지 않고 막습니다(`fg-disabled`) — Pagination 은 빈 칸으로 둡니다. 표가 비면(0개 — `total: empty`) 둘 다 막히고 범위 고르기도 막혀 "0-0"(`fg-disabled`)으로 보입니다. 줄 수는 그대로 바꿀 수 있습니다. 막힘(`disabled`) 상태는 끝 쪽 화살표 하나에만 쓰고, 빈 표는 전체 수의 값으로 따로 둡니다 — 마지막 범위에서 범위 글까지 흐려지지 않게 하기 위해서입니다. 칸 40 은 Pagination 과 같은 예외로, 누르는 영역이 위아래만 44 입니다.

[그림: 첫 범위 — 이전 막힘 · 빈 표 "0-0 / 총 0개"](../../site/components/specs/table-pagination.tsx#ends)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 화살표 바탕 없음 |
| `hovered` | 웹 — 화살표에 `bg-layer-default-pressed`, 축소 없음 |
| `pressed` | 같은 바탕 + 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 링(고르기는 Select 의 링) |
| `disabled` | 끝 쪽의 화살표 — `fg-disabled`. 빈 표(0개)는 `total: empty`(화살표 둘 · 범위 "0-0" 막힘) |

[표: 상태 — 화살표](table-pagination.yaml#matrix@arrow)

[표: 모션](table-pagination.yaml#motion)

## Guidelines

### 표 아래에만 둡니다

데이터 표 아래에 두고, 표 위에는 두지 않습니다. 표가 아닌 목록 · 카드 격자는 [Pagination](pagination.md) 을 씁니다. 표의 줄이 줄 수 하나(10)보다 적게 늘 들어맞으면 넘김 줄을 두지 않습니다.

[그림: 표 아래 · 표 위에 둔 줄](../../site/components/specs/table-pagination.tsx#place-guide)

### 줄 수 · 범위

줄 수는 10 · 25 · 50 셋이 기본이며, 3 ~ 4개를 넘지 않습니다. 줄 수를 바꾸면 첫 범위로 돌아갑니다. 범위 목록은 최대 높이 240 으로 열리고 지금 범위가 보이게 스크롤됩니다 — 범위가 200개를 넘으면 첫 · 마지막 · 지금 둘레만 둡니다. 거르기 · 정렬을 바꾸면 첫 범위로 돌아가고, 줄이 줄어 지금 범위가 없어지면 마지막 범위로 옮깁니다("Page 3 of 2" 가 되지 않게 합니다).

[그림: 줄 수 목록 · 범위 목록(최대 240)](../../site/components/specs/table-pagination.tsx#options-guide)

### 한 줄 — 좁으면 표와 함께 가로로

줄은 줄바꿈하지 않습니다. 좁은 화면에서는 표와 줄을 같은 가로 스크롤 상자 안에 두고, 줄만 따로 접거나 글을 줄이지 않습니다. 768 미만에서는 표가 [List](list.md) 줄로 바뀌므로 이 줄을 두지 않고 끝없이 불러옵니다([Table](table.md) 의 "768 미만은 List 줄로").

[그림: 좁은 화면 — 표와 줄이 함께 가로 스크롤](../../site/components/specs/table-pagination.tsx#narrow-guide)

### 넘기면

넘기면 표의 맨 위가 보이게 스크롤하고 "11-20, 총 237개" 를 한 번 알립니다(숨은 상태 글). 초점은 누른 화살표에 남습니다. 끝에 닿아 막혀도 막힌 버튼에 초점이 남아(`aria-disabled`), 키보드가 그 자리를 잃지 않습니다.

### 글 · 이름

"{n}개" + "씩 보기", 범위는 "11-20", 전체는 "/ 총 237개" 로 씁니다. 이름은 줄 "표 페이지 탐색", 고르기 "페이지당 표시 개수" · "표시 범위", 화살표 "이전 페이지" · "다음 페이지" 입니다. 영어("row(s)" · "Page x of y" · "Go to … page")를 쓰지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/table-pagination.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `TablePagination` — 줄(`role="group"` · `aria-label="표 페이지 탐색"`)입니다. `totalItems`(알면) — 또는 `hasPreviousPage` · `hasNextPage` · `currentPageItemCount`(모르면). `value` · `defaultValue`(`{ page, pageSize }`) · `onValueChange(value, { reason })`(`reason` — `"previous"` · `"next"` · `"page-range"` · `"page-size"` · `"constraint"` — 줄이 줄어 범위를 옮겼을 때) · `pageSizeOptions`(기본 `[10, 25, 50]`) · `scrollTarget`(표 상자 — 넘기면 그 위 끝으로) · `disabled` 를 받습니다.

### HR 사용자 표

[그림: 사용자 21명 — 10개 씩 · 11-20](../../site/components/specs/table-pagination.tsx#ex-table)

```tsx
import { TablePagination } from "@/components/ui/table-pagination"

<div className="overflow-x-auto">
  <Table ref={tableRef}>…</Table>
  <TablePagination
    totalItems={users.length}
    value={{ page, pageSize }}
    onValueChange={(v) => { setPage(v.page); setPageSize(v.pageSize) }}
    scrollTarget={tableRef}
  />
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 줄 수 고르기 | 그 줄 수로 바꾸고 첫 범위로 돌아갑니다 |
| 범위 고르기 | 그 범위로 옮깁니다 — 목록은 최대 240, 열면 지금 범위가 보입니다 |
| 이전 · 다음 | 앞 · 뒤 범위로 옮깁니다. 끝에서는 막힙니다(초점은 남습니다) |
| 줄이 줄어 지금 범위가 없어짐 | 마지막 범위로 옮깁니다(`reason: "constraint"`) |
| 넘김 | 표 맨 위로 스크롤하고 "11-20, 총 237개" 를 알립니다 |
| `Tab` | 줄 수 → 범위 → 이전 → 다음 |
| 좁은 화면 | 표와 함께 가로 스크롤합니다 — 768 미만은 표 대신 List 줄 · 끝없이 불러오기 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | "씩 보기" · "/ 총 N개" `fg-neutral` 흰 면 위 16.41 · 다크 13.42 ✓. 고르기는 [Select](select.md) 의 검증을 따릅니다. 막힌 범위 "0-0" 은 예외입니다(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 화살표 `fg-neutral` 16.41 · 13.42 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 4.1.3** Status messages | 넘기면 "11-20, 총 237개" 를 `role="status"` 로 알립니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 고르기 40 · 화살표 40 × 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | ⚠ 화살표는 위아래만 44(Pagination 과 같은 예외), 고르기 높이 40(Select medium — 폭과 상관없이) — 표는 데스크톱 마우스로 다루기 때문입니다 |
| **ARIA** | 줄 `role="group"` · `aria-label="표 페이지 탐색"`, 고르기 `combobox`(Select) 이름 "페이지당 표시 개수" · "표시 범위", 화살표 `<button type="button">` "이전 페이지" · "다음 페이지" — 막히면 `aria-disabled="true"` 입니다 |

## Do / Don't

### ✅ Do

- 데이터 표 아래에 한 줄로 둡니다 — 좁으면 표와 함께 가로로 스크롤합니다.
- 줄 수는 10 · 25 · 50 으로 두고, 바꾸면 첫 범위로 돌아갑니다.
- 끝에서는 화살표를 막고, 줄이 줄면 범위를 옮깁니다.
- 넘기면 표 맨 위를 보이고 범위를 알립니다.

### ❌ Don't

- 표 위에 두거나 두 줄로 접지 않습니다.
- 표에 번호 넘김(Pagination)을 쓰지 않습니다.
- "Page 3 of 2" 처럼 없는 범위에 머물지 않습니다.
- 글 · 이름을 영어로 쓰지 않습니다.
- 1280 미만에서 고르기만 52 로 키우지 않습니다 — 줄은 한 높이 40 입니다.

## Specification

[그림: Specification — table-pagination.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#table-pagination)
