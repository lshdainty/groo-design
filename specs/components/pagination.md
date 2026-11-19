# Pagination

> 여러 쪽으로 나뉜 목록의 쪽을 오가는 줄입니다 — 쪽 단위로 훑는 목록(주로 데스크톱 768 이상) 아래 가운데에 둡니다. 몇 쪽인지 한눈에 보이고, 쪽이 바뀌어도 칸 자리가 흔들리지 않습니다. 폰(768 미만)의 긴 목록은 쪽을 나누지 않고 끝없이 불러옵니다(아래 "폰은 끝없이 불러오기"). 데이터 표는 [Table Pagination](table-pagination.md) 입니다.

여러 페이지로 나뉜 콘텐츠를 오가는 탐색 줄로, 이전 · 다음 버튼 · 쪽 번호 · 생략으로 이루어집니다. 번호 · 화살표 칸 40 × 40 을 사이 없이 잇고, 지금 쪽은 짙게 채우며, 칸 수는 화면 폭으로 고정입니다(480 이상 9칸 · 미만 7칸).

수치 원본은 [`pagination.yaml`](pagination.yaml)(넘김 줄)과 [`infinite-list.yaml`](infinite-list.yaml)(폰의 끝없이 불러오기 — 목록 끝 자리)입니다.

[그림: 카드 혜택(데스크톱) 5 / 12쪽 · 첫 쪽 · 좁은 화면 7칸 — 라이트 · 다크](../../site/components/specs/pagination.tsx#hero)

### 직접 골라 보기

전체 쪽 수 · 지금 쪽 · 화면 폭(480 이상 · 미만)을 고르면 스펙대로 그린 줄과 그 코드가 바뀝니다. 실제로 누르면 칸 자리는 그대로이고 생략(…)만 옮겨 갑니다. 첫 · 마지막 쪽에서는 화살표 자리가 비고, 키보드로 끝 쪽에 닿으면 초점이 지금 쪽 번호로 옮겨 갑니다.

[그림: 플레이그라운드](../../site/components/specs/pagination.tsx#playground)

## Anatomy

[그림: 넘김 줄은 이전 · 쪽 번호 · 생략 · 다음으로, 칸 40 이 붙어 있고 지금 쪽은 짙게 채웁니다](../../site/components/specs/pagination.tsx#anatomy)

| ⓐ Root | 넘김 줄 — 목록 아래 가운데. 칸을 사이 없이 잇습니다. |
| ⓑ Previous · Next | 이전 · 다음 — 아이콘만 40 × 40. 첫 · 마지막 쪽에서는 그 자리가 빈 칸입니다. |
| ⓒ Page | 쪽 번호 — 40 × 40, 14 / 19 · 700. 지금 쪽은 짙게 채웁니다. |
| ⓓ Ellipsis | 생략 — 40 상자 + 점 셋. 누르지 않습니다. |

[표: 부위](pagination.yaml#slots)

## Properties

### 칸

번호 · 화살표 · 생략 칸은 모두 40 × 40 이고 사이 없이 붙습니다. 번호는 14 / 19 · 700 · `fg-neutral` · 숫자 폭을 같게, 화살표는 아이콘만(chevron 16), 모서리는 8 입니다. 번호 · 아이콘 · 칸은 글자 크기 설정을 따르지 않는 틀입니다. 바탕은 누를 때 · 마우스를 올릴 때만 보입니다.

[표: 쪽 번호](pagination.yaml#base.enabled@item)

[표: 번호 글자](pagination.yaml#base.enabled@label)

[표: 이전 · 다음](pagination.yaml#base.enabled@arrow)

[표: 넘김 줄](pagination.yaml#base.enabled@root)

### 지금 쪽

지금 쪽은 짙은 채움(`bg-neutral-inverted`) + 반전 글자(`fg-neutral-inverted`)입니다 — 다크에서는 밝은 칸에 짙은 글자입니다. 브랜드 색으로 칠하지 않습니다. 보조 기술에는 `aria-current="page"` 로 알립니다.

[그림: 지금 쪽 — 짙은 채움, 라이트 · 다크](../../site/components/specs/pagination.tsx#current)

[표: 지금 쪽](pagination.yaml#current)

### 칸 수 — 9 · 7

칸 수는 화면 폭으로 고정입니다 — 480 이상 9칸, 480 미만 7칸(화살표 둘 포함). 쪽이 바뀌어도 줄의 폭과 칸 자리는 그대로이고 생략(…)만 옮겨 갑니다. 전체 쪽이 칸 수보다 적으면 모든 번호를 보입니다.

| 지금 쪽 | 9칸(480 이상) | 7칸(480 미만) |
|---|---|---|
| 앞쪽 | ‹ 1 2 3 4 5 … N › | ‹ 1 2 3 4 … › |
| 가운데 | ‹ 1 … p−1 p p+1 … N › | ‹ … p−1 p p+1 … › |
| 뒤쪽 | ‹ 1 … N−4 N−3 N−2 N−1 N › | ‹ … N−3 N−2 N−1 N › |

7칸의 가운데 구간에서는 첫 · 마지막 번호가 없습니다 — 앞뒤 쪽을 바로 고르는 것을 먼저 둡니다.

[그림: 9칸 · 7칸 — 앞쪽 · 가운데 · 뒤쪽, 칸 자리는 그대로](../../site/components/specs/pagination.tsx#slots)

[표: 칸 수](pagination.yaml#count)

### 끝 쪽 — 빈 칸

첫 쪽에서는 이전 자리에, 마지막 쪽에서는 다음 자리에 40 빈 칸을 둡니다 — 막힌 화살표를 그리지 않고 자리만 지킵니다. 키보드로 "다음" 을 눌러 마지막 쪽에 닿으면 누르던 버튼이 빈 칸이 되므로, 초점을 지금 쪽 번호로 옮깁니다(초점이 화면 맨 앞으로 떨어지지 않게).

[그림: 첫 쪽 — 이전 자리 빈 칸 · 마지막 쪽 — 초점이 지금 쪽으로](../../site/components/specs/pagination.tsx#ends)

### 누르는 영역 — 40 의 예외

칸은 40 입니다 — 누르는 영역은 위아래만 44 로 넓히고(보이지 않는 여백 2 씩), 옆은 칸 폭 40 그대로입니다. 칸이 붙어 있어 옆으로 넓히면 이웃 칸과 겹치기 때문입니다. 이것은 "누르는 영역은 늘 44 이상" 규칙의 예외입니다 — groo 폰은 끝없이 불러오기라 넘김 줄은 주로 마우스로 누릅니다. WCAG 2.5.8(AA, 24) 은 통과하고 2.5.5(AAA, 44) 는 옆으로 미달입니다.

[그림: 누르는 영역 — 40 × 44(분홍), 칸끼리 붙어 옆으로는 넓히지 않습니다](../../site/components/specs/pagination.tsx#hit-area)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음(지금 쪽은 짙은 채움) |
| `hovered` | 웹 — `bg-layer-default-pressed`(지금 쪽은 `bg-neutral-inverted-pressed`), 축소 없음 |
| `pressed` | 같은 바탕 + 2px 거리 축소(40 이면 0.95) |
| `focused` | 웹 — 키보드 포커스에만 칸 바깥 2px 링 |
| `disabled` | 목록을 다시 받는 동안 — 번호 · 화살표 `fg-disabled`, 지금 쪽은 `bg-disabled` |

[그림: 상태 — 호버 · 누름 · 포커스 · 막힘 × 다른 쪽 · 지금 쪽](../../site/components/specs/pagination.tsx#states)

[표: 상태 — 다른 쪽](pagination.yaml#matrix@item)

[표: 상태 — 지금 쪽](pagination.yaml#matrix.current.current@item)

[표: 모션](pagination.yaml#motion)

## Guidelines

### 언제 쪽을 나누나

동작 상황으로 고릅니다 — "늘 데스크톱은 Pagination" 이 아닙니다. 데스크톱처럼 쪽 단위로 훑는 자리는 Pagination 이 좋을 수 있지만, 스크롤로 내려가는 환경(폰 · 긴 목록)은 끝에 닿으면 저절로 더 불러오는 쪽이 동작상 자연스럽습니다. 가계부처럼 달이 자연스러운 묶음인 목록은 달 이동이 쪽 넘김입니다.

| 이런 목록 | 쓰는 것 |
|---|---|
| 쪽 단위로 훑는 자리 — 데스크톱(검색 결과 · 카드 혜택 격자) | **Pagination** 이 좋을 수 있습니다 — 몇 쪽인지 · 어디쯤인지 보이고 주소로 돌아옵니다 |
| 스크롤로 내려가는 환경 — 폰 · 긴 목록 | 끝없이 불러오기 — 아래 |
| 자연스러운 묶음이 있는 목록(가계부 거래 — 달) | 묶음 옮기기가 쪽 넘김 — 달 하나가 한 쪽이고, 넘김 줄을 따로 두지 않습니다 |
| 데이터 표(직원 · 휴가 내역 · 회비) | [Table Pagination](table-pagination.md) — 줄 수 · 범위 |
| 전체가 화면 3 ~ 4개 분량 이하 | 쪽을 나누지 않고 한 번에 |
| 단계를 거치는 흐름(가져오기 · 처음 쓰기) | 쪽 넘김이 아니라 단계 버튼 |

1쪽 이하면 넘김 줄을 그리지 않습니다. 같은 목록이 폰에서는 끝없이 불러오고 데스크톱에서는 쪽을 나눌 수 있습니다(카드 혜택처럼). 이 표는 고르는 참고입니다 — 화면마다 동작으로 고릅니다. 화면 틀 쪽 표는 DESIGN.md Layout "화면 틀" 의 "목록 넘기기" 에 있습니다.

[그림: 쓰는 자리 — 데스크톱 목록 넘김 · 폰 끝없이 · 표는 Table Pagination](../../site/components/specs/pagination.tsx#role-guide)

### 쪽을 넘기면

쪽을 넘기면 목록의 위 끝이 화면 위에 오게 스크롤하고, 보조 기술에 "2페이지, 전체 12페이지" 를 한 번 알립니다(숨은 상태 글). 초점은 누른 칸에 남습니다 — 끝 쪽에 닿아 그 칸이 빈 칸이 되면 지금 쪽 번호로 옮깁니다. 넘기는 동안 목록은 [Skeleton](skeleton.md) 의 "다른 내용을 받을 때" 를 따릅니다(바뀔 줄만 기다리고, 옛 쪽의 줄을 남기지 않습니다).

[그림: 다음을 누름 — 목록 맨 위 · "2페이지" 알림 · 초점은 누른 칸](../../site/components/specs/pagination.tsx#change-guide)

### 쪽은 주소에 — 칸은 링크

웹 화면의 목록은 쪽을 주소에 둡니다(`?page=3`) — 칸이 링크(`<a>`)라 새 탭에서 열고 주소를 나눌 수 있고, 뒤로 가기가 앞 쪽으로 돌아옵니다(쪽마다 방문 기록이 쌓입니다). 주소가 없는 자리(대화상자 · 시트 안 목록)만 칸이 버튼입니다. 어느 쪽이든 모양 · 키보드 · 이름은 같습니다.

### 폰은 끝없이 불러오기

768 미만의 긴 목록은 쪽을 나누지 않습니다 — 목록 끝이 화면 아래에서 300 안으로 오면 다음 쪽을 받아 아래에 잇습니다. 목록 맨 아래 한 자리가 지금 상태를 보입니다(`infinite-list.yaml`).

| 상태 | 목록 끝 자리 |
|---|---|
| 받는 중 | [Progress Circle](progress-circle.md) 24 가운데 — 1초가 지나야 보입니다(시간표는 [Skeleton](skeleton.md) 의 "기다리는 동안") |
| 못 불러옴 | "더 불러오지 못했어요." + [Button](button.md) `neutralWeak` small "다시 시도" — 이미 받은 줄은 그대로 둡니다 |
| 끝 | "모두 봤어요."(목록마다 "카드를 모두 봤어요." 처럼) — 한 쪽으로 끝나는 짧은 목록에는 두지 않습니다 |

폰 목록은 둘로 가릅니다 — 목록 화면의 긴 목록은 끝없이 불러옵니다(위). 카드 · 띠 안의 몇 줄 미리보기는 머리의 "전체 보기" 로 목록 화면에 보냅니다([Card](card.md) 의 머리 동작). 목록 끝에 줄을 덧붙이는 "더 보기" 버튼은 두지 않습니다 — 끝없이 불러오기와 두 벌이 됩니다. 데스크톱은 쪽 넘김입니다. 첫 쪽을 못 불러오면 목록 자리가 [Result Section](result-section.md) 의 실패입니다. 끝없이 불러오는 목록이 길어져도 맨 위로 가는 길은 상단 바 · 탭 바(지금 탭 다시 누르기)가 맡습니다.

[그림: 목록 끝 — 받는 중 원 24 · 못 불러옴 + 다시 시도 · 끝 "모두 봤어요."](../../site/components/specs/pagination.tsx#infinite-guide)

[표: 목록 끝 자리](infinite-list.yaml#status)

[표: 목록 끝 자리 — 공통](infinite-list.yaml#base.enabled)

### 글 · 이름

넘김 줄의 이름은 "페이지 탐색"(목록이 둘 이상이면 "카드 혜택 페이지 탐색" 처럼), 칸 이름은 "N페이지", 화살표는 "이전 페이지" · "다음 페이지" 입니다. 영어("pagination" · "More pages" · "Page x of y")를 쓰지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/pagination.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Pagination` — 넘김 줄(`<nav aria-label="페이지 탐색">`). `totalPages`(1 이하면 그리지 않습니다) · `page` · `defaultPage`(1) · `onPageChange(page, { reason })`(`reason` — `"page-item"` · `"previous"` · `"next"`) · `getHref(page)`(주면 칸이 링크 — 쪽이 주소에 있을 때) · `scrollTarget`(목록 상자 — 쪽이 바뀌면 그 위 끝으로 스크롤) · `disabled` · `aria-label`. 칸 수는 `breakpoint-sm`(480)으로 9 · 7 을 스스로 고릅니다. 쪽이 바뀌면 숨은 상태 글로 "N페이지, 전체 M페이지" 를 알리고, 끝 쪽에서 초점을 지금 쪽 번호로 옮깁니다.
- `paginationItems(page, totalPages, slots)` — 칸 배열(`{ type: "page" | "ellipsis" | "previous" | "next" | "empty", page? }`)을 돌려주는 규칙 함수입니다. 앱도 같은 규칙으로 씁니다.
- `InfiniteListEnd` — 폰 목록 끝 자리. `status`(`"loading"` · `"error"` · `"end"`) · `onRetry` · `endText`(기본 "모두 봤어요.") · `onReachEnd`(목록 끝이 300 안으로 오면 한 번 부릅니다 — `status` 가 `"loading"` 이면 "다음 쪽이 있다" 는 뜻입니다. 목록이 자라거나 300 밖으로 나갔다 다시 오면 또 부를 수 있고, `"error"` · `"end"` 이거나 "다시 시도" 를 누른 직후에는 부르지 않습니다).

### 데스크톱 목록 — 쪽은 주소에

[그림: 카드 혜택 — 5 / 12쪽](../../site/components/specs/pagination.tsx#ex-desktop)

```tsx
import { useSearchParams } from "react-router-dom"
import { Pagination } from "@/components/ui/pagination"

const [params] = useSearchParams()
const page = Number(params.get("page") ?? 1)

<section ref={listRef} aria-labelledby="card-list-title">…</section>
{/* 칸은 링크 — 쪽마다 방문 기록이 쌓여 뒤로 가기가 앞 쪽으로 온다 */}
<Pagination totalPages={totalPages} page={page} getHref={(p) => `?page=${p}`} scrollTarget={listRef} aria-label="카드 혜택 페이지 탐색" />
```

### 폰 목록 — 끝없이 불러오기

[그림: 폰 카드 혜택 — 목록 끝의 원 · 끝 글](../../site/components/specs/pagination.tsx#ex-infinite)

```tsx
import { InfiniteListEnd } from "@/components/ui/pagination"

<ul>{cards.map((c) => <CardRow key={c.id} card={c} />)}</ul>
<InfiniteListEnd
  status={isError ? "error" : hasNextPage ? "loading" : "end"}
  onReachEnd={fetchNextPage}
  onRetry={fetchNextPage}
  endText="카드를 모두 봤어요."
/>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 번호 누르기 | 그 쪽으로 넘깁니다 — 목록 위 끝으로 스크롤하고 "N페이지, 전체 M페이지" 를 알립니다. 칸 자리는 그대로, 생략만 옮겨 갑니다 |
| 이전 · 다음 누르기 | 앞 · 뒤 쪽으로 넘깁니다. 끝 쪽에 닿으면 그 칸이 빈 칸이 되고 초점은 지금 쪽 번호로 옮깁니다 |
| `Tab` | 이전 → 번호들 → 다음. 생략 · 빈 칸은 건너뜁니다. `Enter`(링크) · `Enter` · `Space`(버튼)로 넘깁니다 |
| 마우스 호버 | 누름과 같은 바탕 — 축소 없음 |
| 창 폭이 480 을 넘나듦 | 9칸 ↔ 7칸 |
| 목록을 받는 동안 | 넘김 줄을 막습니다(`disabled`) — 두 번 넘기지 않게 |
| 폰 — 목록 끝이 300 안으로 | 다음 쪽을 받습니다 — 목록 끝에 원, 못 받으면 "다시 시도", 끝이면 끝 글 |
| 글자 크기 설정 | 쪽 번호는 커지지 않습니다(`t4-static`) — 칸 40 · 줄 폭이 그대로인 틀이라, 커지면 칸을 넘기 때문입니다. 화살표 · 생략 아이콘과 칸도 px 그대로입니다. 폰 목록 끝의 "더 불러오지 못했어요." · 끝 글 · "다시 시도" 는 커집니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 번호 `fg-neutral` 흰 면 위 16.41 · 다크 13.42 · 회색 페이지 위 15.20 · 15.20, 지금 쪽 `fg-neutral-inverted` on `bg-neutral-inverted` 16.41 · 13.42(누름 7.11 · 7.70) ✓. 끝 글 `fg-neutral-subtle` 5.50 · 6.09 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 화살표 `fg-neutral` 16.41 · 13.42 ✓, 지금 쪽 칸 면 16.41 · 13.42 ✓. 키보드 포커스 링 흰 면 위 Desk 8.38 · 6.10 · HR 8.17 · 6.07 · 회색 페이지 위 7.76 · 6.90 · 7.56 · 6.88 ✓. 호버 바탕은 장식입니다(회색 페이지 위에서는 거의 안 보여 축소가 함께 알립니다) |
| **WCAG 1.4.4** Resize text | 쪽 번호는 예외입니다 — 칸이 붙은 줄이라 글자 크기 설정을 따르지 않습니다(웹 `text-t4-static` · 앱 `TextScaler.noScaling`). 지금 쪽은 칸 이름 "N페이지" 와 `role="status"` 의 "N페이지, 전체 M페이지" 로 읽히고, 넘긴 쪽의 목록 글은 커집니다. 폰 목록 끝의 글 · 버튼은 커집니다 ✓ |
| **WCAG 1.4.1** Use of color | 지금 쪽은 채움 면(16.41)으로 알리고 `aria-current="page"` ✓ |
| **WCAG 2.4.3** Focus order | 끝 쪽에서 누르던 화살표가 빈 칸이 되면 초점을 지금 쪽 번호로 옮깁니다 — body 로 떨어지지 않습니다 ✓ |
| **WCAG 4.1.3** Status messages | 쪽이 바뀌면 "N페이지, 전체 M페이지" 를 `role="status"` 로 알립니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 40 × 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | ⚠ 칸 40 — 위아래만 44, 옆은 40(칸이 붙어 넓히지 않습니다). "누르는 영역 44" 의 예외로 둡니다(폰은 끝없이 불러오기). 폰 목록 끝의 "다시 시도" 는 44 ✓ |
| **ARIA** | `<nav aria-label="페이지 탐색">`, 칸은 링크(쪽이 주소에 있을 때) 또는 `<button type="button">` — 이름 "N페이지", 지금 쪽 `aria-current="page"`, 화살표 "이전 페이지" · "다음 페이지". 생략 · 빈 칸은 `aria-hidden`. 끝없이 불러오기 — 받는 동안 목록에 `aria-busy`, 끝 글은 글로 읽힙니다 |

## Do / Don't

### ✅ Do

- 데스크톱 목록 아래 가운데에 두고, 칸 40 을 붙이고 지금 쪽은 짙게 채웁니다.
- 칸 수를 화면 폭으로 고정하고(9 · 7), 끝 쪽은 빈 칸으로 자리를 지킵니다.
- 쪽을 넘기면 목록 맨 위로 스크롤하고 "N페이지" 를 알립니다.
- 쪽은 주소에 두고, 칸은 링크로 만듭니다.
- 폰은 끝없이 불러오고, 끝 글 · 다시 시도 · 받는 중을 보입니다.
- 달처럼 자연스러운 묶음이 있는 목록은 묶음 옮기기를 쪽 넘김으로 씁니다(가계부 거래 — 달 이동).

### ❌ Don't

- 지금 쪽을 테두리만 두르거나 브랜드 색으로 칠하지 않습니다.
- 칸 사이를 띄우거나 이전 · 다음에 글자를 넣지 않습니다.
- 끝 쪽에서 막힌 화살표를 그리거나 초점을 잃게 하지 않습니다.
- 화면 3 ~ 4개 분량 이하의 목록을 쪽으로 나누거나 1쪽뿐인 넘김 줄을 그리지 않습니다.
- 폰에 쪽 넘김이나 목록 끝에 줄을 덧붙이는 "더 보기" 버튼을 두지 않습니다(카드 · 띠 미리보기는 머리 "전체 보기").
- 표 아래에 이 넘김 줄을 두지 않습니다(표는 Table Pagination).

## Specification

`pagination.yaml` · `infinite-list.yaml` 의 규칙을 조건마다 빠짐없이 그립니다 — 웹 · 앱이 Pagination 과 목록 끝 자리를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — pagination.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#pagination)

[그림: Specification — infinite-list.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#infinite-list)
