# Tag Group

> 여러 메타 정보(카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액)를 " · " 로 이어 한 줄로 보이는 글줄 — "식비 · 신한카드 · 오후 2:10". 읽기만 한다. 대상의 상태 · 분류 라벨은 [Badge](badge.md), 고르는 값은 [Chip](chip.md) 이다.

구조는 당근 [SEED Tag Group](https://seed-design.io/components/tag-group)(Apache-2.0)를 따른다 — 항목(글 + 아이콘 하나) · 구분 " · ", 크기 셋(t2 · t3 · t4), 항목마다 톤 · 굵기, 줄바꿈 또는 한 줄 말줄임. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). porest 에 처음 두는 컴포넌트다 — DESIGN.md Caption 절의 "닉네임 · 시간" 메타 줄과 [List](list.md) 줄의 설명 줄이 이것이다.

수치 원본은 [`tag-group.yaml`](tag-group.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 줄 · 공지 · 카드 상세의 메타 줄 — 라이트 · 다크](../../site/components/specs/tag-group.tsx#hero)

### 직접 골라 보기

크기 · 항목 수 · 항목마다 톤 · 굵기 · 아이콘 · 줄바꿈 · 말줄임과 폭을 고르면 스펙대로 그린 줄과 그 코드, 보조 기술이 읽는 글이 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/tag-group.tsx#playground)

## Anatomy

[그림: 항목(아이콘 + 글) · 구분 " · "](../../site/components/specs/tag-group.tsx#anatomy)

| ⓐ Item | 항목 — 글 하나. 6 ~ 10자. |
| ⓑ Icon | 아이콘 — 항목의 앞 또는 뒤 하나. 없어도 된다. |
| ⓒ Separator | 구분 " · " — 글자다(점 그림이 아니다). 앞 항목에 붙는다. |

[표: 부위](tag-group.yaml#slots)

## Properties

### Size

`t2` 12 / 16 *(기본)* · `t3` 13 / 18 · `t4` 14 / 19. 아이콘은 12 · 13 · 14 로 글자에 맞추고 글과 사이 2. 크기는 묶음에 하나다 — 한 줄 안에서 섞지 않는다. 글은 글자 크기 설정을 따른다.

[그림: 크기 — t2 · t3 · t4](../../site/components/specs/tag-group.tsx#size)

[표: 크기](tag-group.yaml#size)

[표: 공통](tag-group.yaml#base.enabled)

### Tone · Weight

톤과 굵기는 항목마다 고른다. 기본은 흐린 글자(`neutralSubtle` — `fg-neutral-subtle`) · 400 이고, 금액 · 핵심 수치처럼 앞세울 항목 하나만 `neutral`(본문 글자) · `bold` 로 둔다. `brand` 는 아껴 쓴다. 구분 " · " 는 톤과 관계없이 늘 `fg-disabled` 로 글보다 한 단계 흐리다.

[그림: 톤 셋 · 굵기 둘 — 금액 하나만 진하게](../../site/components/specs/tag-group.tsx#tone)

[표: 톤](tag-group.yaml#tone)

[표: 굵기](tag-group.yaml#weight)

### Icon

아이콘은 항목의 앞(prefix) 또는 뒤(suffix)에 하나만 — 앞뒤 모두 두지 않는다. 글자색을 따른다. 갈래(분할) · 눈(조회)처럼 뜻이 있는 아이콘은 그 항목의 읽을 글(`srLabel` — "분할 2건" · "조회 12")이 뜻을 말한다.

[그림: 앞 아이콘 · 뒤 아이콘 — 분할 2 · 조회 12](../../site/components/specs/tag-group.tsx#icon)

### Overflow

| 값 | 넘칠 때 |
|---|---|
| `wrap` *(기본)* | 낱말 단위로 줄을 바꾼다(v114) — 구분은 앞 항목에 붙어 줄 끝에 남고, 다음 줄은 항목으로 시작한다. 아이콘은 붙은 낱말과 한 줄에 남는다(앞 아이콘은 첫 낱말, 뒤 아이콘은 마지막 낱말과 줄바꿈 없이 묶는다 — NBSP 만으로는 아이콘 앞뒤가 줄바꿈 자리가 된다) |
| `truncate` | 한 줄 — 항목 글이 각자 말줄임(…)한다. 줄어드는 차례를 항목마다 정한다(`shrink` — 0 은 줄지 않고, 수가 클수록 먼저 준다) |

말줄임하면 정보를 읽기 어려워지는 자리(가게 이름 · 주소)는 줄바꿈이 낫다. 목록 줄처럼 높이가 늘면 안 되는 자리만 `truncate` 로 두고, 꼭 보여야 할 항목(금액)은 `shrink={0}` 이다.

[그림: 줄바꿈 · 한 줄 말줄임 · 줄어드는 차례](../../site/components/specs/tag-group.tsx#overflow)

[표: 줄바꿈 · 말줄임](tag-group.yaml#overflow)

### State

상태는 `enabled` 하나다 — 누르지 않는다. 막힌 줄 안에 있으면 그 줄의 규칙(List 의 비활성 — 모든 글 `fg-disabled`)을 따른다.

## Guidelines

### 메타 정보는 Tag Group

시간 · 개수 · 길이 · 거리 · 금액 · 자산 같은 메타 정보는 Tag Group 이다. 대상의 상태 · 분류(예정 · 승인 · 연체)는 [Badge](badge.md) 다(SEED Image Frame — "Badge 는 상태나 분류를 표현할 때만, 시간 · 개수 · 길이 같은 메타 정보에는 쓰지 않는다"). 한 줄에 둘이 함께 있으면 배지는 제목 옆, Tag Group 은 설명 줄이다.

[그림: 제목 옆 배지 · 설명 줄 Tag Group](../../site/components/specs/tag-group.tsx#role-guide)

### 짧게 — 조사 · 접속어를 빼고

항목은 6 ~ 10자로, 조사 · 접속어 · 단위의 군말을 뺀다("신한카드로 결제함" 이 아니라 "신한카드"). 문장이 되면 Tag Group 이 아니라 설명 글이다. 같은 자리의 항목은 화면마다 같은 순서다(가계부 줄 — 분류 · 자산 · 시각).

[그림: 짧은 항목 · 문장이 된 항목](../../site/components/specs/tag-group.tsx#writing-guide)

### 구분은 " · " 글자

항목 사이는 글자 " · "(가운뎃점 앞뒤 띄어쓰기)다 — 2px 점 그림 · "•" · "|" · 띄어쓰기만으로 가르지 않는다. 구분은 글보다 한 단계 흐린 `fg-disabled` 다.

[그림: " · " 글자 · 2px 점 · "•"](../../site/components/specs/tag-group.tsx#separator-guide)

### 한 묶음은 한 크기

크기는 묶음에 하나다 — 항목마다 크기를 바꾸지 않는다. 강조는 톤 · 굵기로 한다.

[그림: 한 크기 · 섞인 크기](../../site/components/specs/tag-group.tsx#size-guide)

### 끊어 읽는다

구분 " · " 는 보조 기술에 숨기고, 그 자리에 보이지 않는 ", " 를 둔다 — 화면 읽기 프로그램이 "식비, 신한카드, 오후 2:10" 으로 끊어 읽는다("식비신한카드오후 2:10" 처럼 붙지 않는다). 아이콘이 뜻을 가진 항목은 읽을 글을 따로 준다("분할 2건" · "조회 12").

[그림: 보조 기술이 읽는 글 — 항목마다 쉼표](../../site/components/specs/tag-group.tsx#reading-guide)

### 쓰는 자리

| 자리 | 크기 · 넘침 |
|---|---|
| [List](list.md) 줄의 설명 줄(거래 · 할 일 · 메모 · 이체) | `t3` · `truncate`(줄 높이 유지) — 금액 같은 꼭 보일 항목은 줄지 않게 |
| 카드 · 상세 머리의 메타(카드 종류 · 혜택 · 공지 날짜 · 조회) | `t2` · `wrap` |
| 작성자 · 시각("김민수 · 3분 전") | `t2` · `wrap` |

## 코드

레시피 `recipes/shadcn/components/ui/tag-group.tsx` 를 쓴다 — `TagGroup` · `TagGroupItem`. `TagGroup` 은 `size`(`"t2"` 기본 · `"t3"` · `"t4"`) · `truncate`(기본 `false` = 줄바꿈)와 항목의 기본 `tone` · `weight` 를 받고, 항목 사이에 " · "(보조 기술에는 ", ")를 스스로 넣는다 — 빈 항목(`null` · `false` · `""`)은 건너뛴다. `TagGroupItem` 은 `tone`(`"neutralSubtle"` · `"neutral"` · `"brand"`) · `weight`(`"regular"` · `"bold"`) · `prefixIcon` 또는 `suffixIcon`(하나만) · `shrink`(`truncate` 일 때 줄어드는 차례, 기본 1) · `srLabel`(보조 기술이 읽을 글 — 주면 보이는 글 · 아이콘은 숨긴다)을 받는다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 목록 줄의 설명 — 한 줄

[그림: 가계부 줄 — 식비 · 신한카드 · 오후 2:10](../../site/components/specs/tag-group.tsx#ex-row)

```tsx
import { TagGroup, TagGroupItem } from "@/components/ui/tag-group"

<TagGroup size="t3" truncate>
  <TagGroupItem>{tx.category}</TagGroupItem>
  <TagGroupItem>{tx.assetName}</TagGroupItem>
  <TagGroupItem shrink={0}>{formatTime(tx.at)}</TagGroupItem>
</TagGroup>
```

### 앞세울 항목 · 아이콘

[그림: 카드 혜택 조건 — 전월 30만원 이상 · 할인형 / 공지 — 인사팀 · 10월 2일 · 조회 12](../../site/components/specs/tag-group.tsx#ex-emphasis)

```tsx
import { Eye } from "lucide-react"

<TagGroup>
  <TagGroupItem tone="neutral" weight="bold">전월 30만원 이상</TagGroupItem>
  <TagGroupItem>할인형</TagGroupItem>
  <TagGroupItem>연회비 2만원</TagGroupItem>
</TagGroup>

<TagGroup>
  <TagGroupItem>인사팀</TagGroupItem>
  <TagGroupItem>10월 2일</TagGroupItem>
  <TagGroupItem prefixIcon={<Eye />} srLabel="조회 12">12</TagGroupItem>
</TagGroup>
```

### 줄어드는 차례

[그림: 좁은 폭 — 긴 자산 이름만 먼저 줄어든다](../../site/components/specs/tag-group.tsx#ex-truncate)

```tsx
<TagGroup size="t3" truncate>
  <TagGroupItem shrink={0}>교통</TagGroupItem>
  <TagGroupItem shrink={2}>신한카드 Deep Dream 체크(1234)</TagGroupItem>
  <TagGroupItem shrink={0}>오후 2:10</TagGroupItem>
</TagGroup>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 누르기 · 호버 · 키보드 | 없다 — 포커스가 서지 않는다. 줄이 눌리면 그 줄의 동작이다 |
| 폭이 좁음(`wrap`) | 낱말 단위로 줄을 바꾼다 — 구분은 앞 줄 끝에 남는다 |
| 폭이 좁음(`truncate`) | 한 줄 그대로, `shrink` 가 큰 항목부터 말줄임 — 구분 · `shrink={0}` 항목은 줄지 않는다 |
| 글자 크기 설정 | 글이 커진다(`wrap` 이면 줄이 늘고, `truncate` 면 더 일찍 말줄임) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 기본 `fg-neutral-subtle` 흰 바탕 5.50 · 다크 6.09, 회색 바탕 5.09 · 6.89 ✓(SEED 의 3.42 가 아니다). `neutral` 16.41 · 13.42, `brand` Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 구분 " · " `fg-disabled` 3.16 · 4.13 은 장식이다(보조 기술에 숨김) |
| **WCAG 1.3.1** Info and Relationships | 항목 사이에 보이지 않는 ", " — 항목이 붙어 읽히지 않는다 ✓ |
| **WCAG 1.4.1** Use of color | 앞세운 항목은 색과 함께 굵기로도 다르다 |
| **WCAG 1.4.4** Resize text | 글이 커지고 줄바꿈 · 말줄임으로 넘치지 않는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | 묶음 `<span>` · 역할 없음(목록 역할을 주지 않는다 — "목록, 항목 3개" 를 줄마다 읽지 않게). 구분 `aria-hidden`, 보이지 않는 ", " 는 sr-only 글. 아이콘 `aria-hidden`, `srLabel` 이 있으면 보이는 글을 숨기고 그 글을 읽는다. 말줄임해도 글 전체를 읽는다. 앱은 묶음을 의미 노드 하나로 합쳐 항목을 ", " 로 잇는다 |

## Do / Don't

### ✅ Do

- 메타 정보를 " · " 로 이어 짧게.
- 앞세울 항목 하나만 진하게.
- 한 묶음은 한 크기.
- 항목마다 끊어 읽게.

### ❌ Don't

- 2px 점 · "•" · "|" 로 가르기.
- 항목을 문장으로 · 조사를 붙여 길게.
- 상태 · 분류를 Tag Group 에 — 배지다.
- 영어 · 코드값 항목("Day 2 of 3" · "9:00 AM").

## Specification

`tag-group.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Tag Group 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — tag-group.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#tag-group)

## SEED 와 다른 점

- **기본 글자가 4.5:1 을 넘는다** — 기본 톤은 porest `fg-neutral-subtle`(흰 바탕 5.50:1)이다. SEED fg.neutral-subtle(#868b94)은 3.42:1 이다.
- **구분 색은 `fg-disabled`** — SEED palette gray-600 의 역할 짝(글보다 한 단계 흐리다).
- **낱말 단위 줄바꿈 · 구분은 앞 줄 끝에** — SEED 웹은 한국어를 음절에서 끊고("3시 / 간 전") 구분 " · " 가 다음 줄 첫머리에 남는다. porest 는 v114(keep-all + break-word)로 낱말 사이에서만 끊고, 구분 앞 공백을 줄이 안 바뀌는 공백으로 둔다.
- **끊어 읽는다** — SEED 는 구분을 숨기기만 해 "500m서초4동3분 전" 처럼 붙어 읽히고, 예제의 `aria-label`(span)은 무시된다. porest 는 보이지 않는 ", " 와 항목의 `srLabel` 을 둔다.
- **구분 기호는 " · " 하나** — SEED 는 `separator` 로 바꿀 수 있다.

## Migration notes

### 2026-10-03 — 새로 둔다(SEED Tag Group)

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)의 "따라오는 것" 으로 정했다 — 메타 줄은 Tag Group(항목 사이 " · " 글자, 12/16 기본 · 13/18 · 14/19, 글자 `fg-neutral-subtle`, 구분 `fg-disabled`, 넘치면 낱말 단위 줄바꿈 또는 한 줄 말줄임, 낭독은 항목마다 끊어). 웹 2px 점 · HR "•" 는 걷는다. DESIGN.md Caption 절의 메타 줄 규칙("닉네임 + · + 시간")은 이 스펙을 가리킨다.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **메타 줄 구분이 세 가지** — Desk 웹은 2 × 2 점 그림(`shared/ui/porest/ledger.tsx:639-652` `LedgerRowSep` · 할 일 `TodoPage.tsx:789-795`, `--border-strong` 3.72 · 4.80), Desk 앱은 " · " 글자 합치기(`features/expense/presentation/widgets/expense_row.dart:199-209` — 할 일만 2px 점 `todo_screen.dart:1266-1282`), HR 은 "•"(`admin-notice/ui/NoticeList.tsx:61 · 63` · `admin-holiday/ui/HolidayList.tsx:69`, 3.07 · 3.96).
- **웹의 글자 "·" 세 벌** — 코드 86줄 · 39파일과 번역 177행에 " · " · "·"(`StatsPage.tsx:1786`) · `&nbsp;·`(`ExpensePage.tsx:2196`)가 섞였다.
- **웹 · 앱 항목이 다르다** — 가계부 줄이 웹은 분류 · 자산 · 시각, 앱은 분류 · 자산 · 할부 N개월이다. 앱 적용 때 한 순서로 맞춘다.
- **아이콘 + 숫자가 숫자만 읽힘** — 분할 개수(웹 `entities/expense/ui/expense-row.tsx:86-103`)는 "2" 로만, HR 공지 조회수(눈 아이콘 + 숫자)는 아이콘 이름이 없다 → `srLabel`("분할 2건" · "조회 12").
- **영어 표기** — HR 일정 칩 "Day 2 of 3 •" · "9:00 AM"(`calendar/ui/month-view/month-event-badge.tsx:118-133` · `agenda-view/agenda-event-card.tsx:85-88`) → "2/3일째" · "오전 9:00"(International Design v106).
