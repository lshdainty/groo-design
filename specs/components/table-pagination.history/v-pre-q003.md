# Table Pagination

> 데이터 표 아래의 쪽 넘김 한 줄 — 한 번에 몇 줄을 볼지("10개 씩 보기")와 지금 범위("11-20 / 총 237개")를 고르고, 이전 · 다음으로 넘긴다. 표가 아닌 목록은 [Pagination](pagination.md), 표는 [Table](table.md) 이다.

구조는 당근 [SEED Table Pagination](https://seed-design.io/components/table-pagination)(Apache-2.0)을 따른다 — "데이터 테이블에서 대량의 데이터를 페이지 단위로 나누고, 페이지 이동과 페이지당 표시 행 수를 제어하는 컴포넌트" 로, 줄 수 고르기(Rows Per Page) · 범위 고르기(Page Range) · 이전 · 다음. 표에서는 번호로 뛰는 일보다 정렬 · 거르기로 찾거나 차례로 훑는 일이 많아 Pagination 과 따로 둔다(SEED). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). porest 에 처음 두는 컴포넌트다 — 옛 Pagination 의 "표 오른쪽 아래" 쓰임을 대신한다.

수치 원본은 [`table-pagination.yaml`](table-pagination.yaml)이다. 고르기 둘은 [Select](select.md) medium, 이전 · 다음은 [Pagination](pagination.md) 의 화살표 칸이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 사용자 표 · 휴가 내역 표 아래의 줄 — 라이트 · 다크](../../site/components/specs/table-pagination.tsx#hero)

### 직접 골라 보기

전체 수(앎 · 모름 · 0개) · 줄 수 · 지금 범위를 고르면 스펙대로 그린 줄과 그 코드가 바뀐다. 줄 수를 바꾸면 첫 범위로 돌아가고, 마지막 범위에서는 다음이 막힌다.

[그림: 플레이그라운드](../../site/components/specs/table-pagination.tsx#playground)

## Anatomy

[그림: 줄은 왼쪽 줄 수 고르기 + "씩 보기", 오른쪽 범위 고르기 + "/ 총 N개" + 이전 · 다음](../../site/components/specs/table-pagination.tsx#anatomy)

| ⓐ Rows Per Page | 줄 수 고르기 — "10개" · "25개" · "50개" + "씩 보기". |
| ⓑ Page Range | 범위 고르기 — "11-20" + "/ 총 237개". 목록은 최대 높이 240. |
| ⓒ Previous · Next | 이전 · 다음 — 40 × 40 화살표, 끝에서는 막힌다. |

[표: 부위](table-pagination.yaml#slots)

## Properties

### 줄

높이 40 · 한 줄 · 양 끝 정렬이고, 왼쪽 묶음과 오른쪽 묶음 · 범위 묶음과 화살표 사이는 16 이다. 고르기 둘은 Select medium(40 · 최소 폭 96)이고 고르기와 글 사이는 8, 글은 14 / 19 · 400 이다. 고르기는 화면 폭과 상관없이 medium 이다 — 줄이 한 높이 40 을 지키도록 [Select](select.md) 의 "1280 미만 large 52" 규칙에서 뺐다(사용자 결정 2026-10-08). 표 아래 12 에 둔다.

[그림: 줄의 간격 — 40 · 사이 16 · 8 · 화살표 40 둘](../../site/components/specs/table-pagination.tsx#layout)

[표: 공통](table-pagination.yaml#base.enabled)

### 전체 수

전체 수를 알면 범위를 고르기로 두고 "/ 총 N개" 를 붙인다. 모르면(다음이 있는지만 안다) 범위를 글로만 보인다 — "11-20". 수는 세 자리마다 쉼표다("1,240").

[그림: 전체를 앎 — 고르기 + "/ 총 237개" · 모름 — "11-20" 글만](../../site/components/specs/table-pagination.tsx#total)

[표: 전체 수](table-pagination.yaml#total)

### 이전 · 다음 — 끝에서 막힌다

이전 · 다음은 [Pagination](pagination.md) 의 화살표 칸(40 × 40 · 아이콘 16)이 붙은 것이다. 끝에서는 숨기지 않고 막는다(`fg-disabled`) — Pagination 은 빈 칸이다. 표가 비면(0개) 둘 다 막히고 범위는 "0-0" 이다 — 줄 수는 그대로 바꿀 수 있다. 칸 40 은 Pagination 과 같은 예외로 누르는 영역이 위아래만 44 다.

[그림: 첫 범위 — 이전 막힘 · 빈 표 "0-0 / 총 0개"](../../site/components/specs/table-pagination.tsx#ends)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 화살표 바탕 없음 |
| `hovered` | 웹 — 화살표에 `bg-layer-default-pressed`, 축소 없음 |
| `pressed` | 같은 바탕 + 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 링(고르기는 Select 의 링) |
| `disabled` | 끝 쪽의 화살표 · 빈 표 — `fg-disabled` |

[표: 상태 — 화살표](table-pagination.yaml#matrix@arrow)

[표: 모션](table-pagination.yaml#motion)

## Guidelines

### 표 아래에만

데이터 표 아래에 둔다(SEED — "데이터 테이블 상단에 배치하지 않습니다"). 표가 아닌 목록 · 카드 격자는 [Pagination](pagination.md) 이다. 표의 줄이 줄 수 하나(10)보다 적게 늘 들어맞으면 줄을 두지 않는다.

[그림: 표 아래 · 표 위에 둔 줄](../../site/components/specs/table-pagination.tsx#place-guide)

### 줄 수 · 범위

줄 수는 10 · 25 · 50 셋이 기본이다 — 3 ~ 4개를 넘지 않는다(SEED). 줄 수를 바꾸면 첫 범위로 돌아간다. 범위 목록은 최대 높이 240 으로 열리고 지금 범위가 보이게 스크롤된다 — 범위가 200개를 넘으면 첫 · 마지막 · 지금 둘레만 둔다. 거르기 · 정렬을 바꾸면 첫 범위로 돌아가고, 줄이 줄어 지금 범위가 없어지면 마지막 범위로 옮긴다("Page 3 of 2" 가 되지 않게).

[그림: 줄 수 목록 · 범위 목록(최대 240)](../../site/components/specs/table-pagination.tsx#options-guide)

### 한 줄 — 좁으면 표와 함께 가로로

줄은 줄바꿈하지 않는다. 좁은 화면에서는 표와 줄을 같은 가로 스크롤 상자 안에 둔다(SEED) — 줄만 따로 접거나 글을 줄이지 않는다. 768 미만에서는 표가 [List](list.md) 줄로 바뀌므로 이 줄을 두지 않고 끝없이 불러온다([Table](table.md) 의 "768 미만은 List 줄로" — 2026-10-08).

[그림: 좁은 화면 — 표와 줄이 함께 가로 스크롤](../../site/components/specs/table-pagination.tsx#narrow-guide)

### 넘기면

넘기면 표의 맨 위가 보이게 스크롤하고 "11-20, 총 237개" 를 한 번 알린다(숨은 상태 글). 초점은 누른 화살표에 남는다 — 끝에 닿아 막혀도 막힌 버튼에 초점이 남는다(`aria-disabled` — 키보드가 그 자리를 잃지 않는다).

### 글 · 이름

"{n}개" + "씩 보기", 범위는 "11-20", 전체는 "/ 총 237개" 다. 이름은 줄 "표 페이지 탐색", 고르기 "페이지당 표시 개수" · "표시 범위", 화살표 "이전 페이지" · "다음 페이지"(SEED 문구). 영어("row(s)" · "Page x of y" · "Go to … page")를 쓰지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/table-pagination.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `TablePagination` — 줄(`role="group"` · `aria-label="표 페이지 탐색"`). `totalItems`(알면) — 또는 `hasPreviousPage` · `hasNextPage` · `currentPageItemCount`(모르면). `value` · `defaultValue`(`{ page, pageSize }`) · `onValueChange(value, { reason })`(`reason` — `"previous"` · `"next"` · `"page-range"` · `"page-size"` · `"constraint"` — 줄이 줄어 범위를 옮겼을 때) · `pageSizeOptions`(기본 `[10, 25, 50]`) · `scrollTarget`(표 상자 — 넘기면 그 위 끝으로) · `disabled`.

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
| 줄 수 고르기 | 그 줄 수로 — 첫 범위로 돌아간다 |
| 범위 고르기 | 그 범위로 — 목록은 최대 240, 열면 지금 범위가 보인다 |
| 이전 · 다음 | 앞 · 뒤 범위로. 끝에서는 막힌다(초점은 남는다) |
| 줄이 줄어 지금 범위가 없어짐 | 마지막 범위로 옮긴다(`reason: "constraint"`) |
| 넘김 | 표 맨 위로 스크롤 · "11-20, 총 237개" 를 알린다 |
| `Tab` | 줄 수 → 범위 → 이전 → 다음 |
| 좁은 화면 | 표와 함께 가로 스크롤 — 768 미만은 표 대신 List 줄 · 끝없이 불러오기 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | "씩 보기" · "/ 총 N개" `fg-neutral` 흰 면 위 16.41 · 다크 13.42 ✓. 고르기는 [Select](select.md) 의 검증. 막힌 범위 "0-0" 은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 화살표 `fg-neutral` 16.41 · 13.42 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 4.1.3** Status messages | 넘기면 "11-20, 총 237개" 를 `role="status"` 로 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 고르기 40 · 화살표 40 × 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | ⚠ 화살표는 위아래만 44(Pagination 과 같은 예외), 고르기 높이 40(Select medium — 폭과 상관없이, 사용자 결정 2026-10-08) — 표는 데스크톱 마우스로 다룬다 |
| **ARIA** | 줄 `role="group"` · `aria-label="표 페이지 탐색"`, 고르기 `combobox`(Select) 이름 "페이지당 표시 개수" · "표시 범위", 화살표 `<button type="button">` "이전 페이지" · "다음 페이지" — 막히면 `aria-disabled="true"` |

## Do / Don't

### ✅ Do

- 데이터 표 아래에 한 줄로 — 좁으면 표와 함께 가로 스크롤.
- 줄 수는 10 · 25 · 50, 바꾸면 첫 범위로.
- 끝에서는 막고, 줄이 줄면 범위를 옮긴다.
- 넘기면 표 맨 위 + 범위를 알린다.

### ❌ Don't

- 표 위에 두기 · 두 줄로 접기.
- 표에 번호 넘김(Pagination)을 쓰기.
- "Page 3 of 2" 처럼 없는 범위에 머물기.
- 영어 글 · 이름.
- 1280 미만에서 고르기만 52 로 키우기 — 줄은 한 높이 40 이다.

## Specification

`table-pagination.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 Table Pagination 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — table-pagination.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#table-pagination)

## SEED 와 다른 점

- **화살표 칸은 Pagination 과 같은 porest 값** — 불투명 누름 바탕 · 2px 거리 축소 · 세로 44 누르는 영역(v102 · v104 · v106 의 예외).
- **고르기는 porest Select medium** — 화면 폭과 상관없이 40 이다. Select 의 "1280 미만 large 52" 규칙의 예외다(사용자 결정 2026-10-08 — 줄 한 높이, 52 는 고르지 않았다). 범위 목록의 최대 높이 240 은 SEED 그대로.
- **줄이 줄어 범위가 없어지면 마지막 범위로 옮기고, 넘기면 알린다** — SEED 는 `constraint` 로 범위를 맞추고, 결과 안내는 사용처의 몫이다.
- **막힌 화살표는 `aria-disabled`** — 초점이 그 자리에 남는다. SEED 는 `disabled` 라 끝에 닿으면 초점이 떨어진다.
- **표 아래 12**(`spacing-component-default`) — SEED 는 간격을 적지 않았다.

## Migration notes

### 2026-10-08 — 고르기는 폭과 상관없이 Select medium

스펙을 쓰다 남은 자리를 사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a) 14 그림으로 정했다 — 줄 수 · 범위 고르기는 화면 폭과 상관없이 Select medium 40 이라 줄이 한 높이다. [Select](select.md) 의 "1280 미만 large 52" 규칙의 예외로 적는다 — 1280 미만에서 52 로 키우는 안(14B)은 고르지 않았다.

### 2026-10-04 — SEED Table Pagination 으로 새로 둔다

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — 데이터 표는 Table Pagination(10A — 줄 수 10 · 25 · 50 "{n}개 씩 보기" · 범위 고르기 "11-20 / 총 237개" · 목록 최대 높이 240 · 이전 · 다음은 끝에서 막힘 · 표 아래에만 · 한 줄), 칸 40 은 누르는 영역 44 규칙의 예외. 표 아래에 같은 Pagination 을 두던 porest 옛 쓰임(10B)은 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사 — HR 은 크로미움에 띄워 쟀다).

- **HR 표 셋** — 회비(5줄) · 휴가 현황(5줄) · 사용자(10줄)가 손으로 짠 바닥을 쓴다(`features/culture-dues/ui/DuesTableContent.tsx:250-301` · `features/vacation-history/ui/VacationHistoryContent.tsx:224-275` · `features/admin-users-management/ui/UserTable.tsx:256-306`). 왼쪽 "23 row(s)"(4.42) · 오른쪽 "Page 1 of 5" + 테두리 버튼 넷 32(처음 · 이전 · 다음 · 끝) — 글 · 숨은 이름 모두 영어다(F13 · F26).
- **없는 쪽에 머문다** — 사용자 표는 21명 3쪽에서 20명으로 줄면 "Page 3 of 2" · 0줄이다(`UserTable.tsx:38-41`, 휴가 현황도 같다 — 되돌리기는 `DuesTable.tsx:42-45` 하나, F13). 마지막 범위로 옮긴다.
- **마지막 쪽에서 초점을 잃는다** — "끝" 이 막히며 초점이 body 로 간다(F13). 막힌 버튼에 초점을 남긴다(`aria-disabled`).
- **대시보드 위젯**(`DuesWidget.tsx:30` · `VacationHistoryWidget.tsx:21`)은 넘김 없이 스크롤한다 — 그대로 둔다.
