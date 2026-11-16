# Tag Group

> 여러 메타 정보(카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액)를 " · " 로 이어 한 줄로 보이는 글줄입니다 — "식비 · 신한카드 · 오후 2:10". 읽기만 하며, 대상의 상태 · 분류 라벨은 [Badge](badge.md), 고르는 값은 [Chip](chip.md) 을 씁니다.

DESIGN.md Caption 절의 "닉네임 · 시간" 메타 줄과 [List](list.md) 줄의 설명 줄을 이 컴포넌트로 그립니다.

수치 원본은 [`tag-group.yaml`](tag-group.yaml)입니다.

[그림: 가계부 줄 · 공지 · 카드 상세의 메타 줄 — 라이트 · 다크](../../site/components/specs/tag-group.tsx#hero)

### 직접 골라 보기

크기, 항목 수, 항목마다의 톤 · 굵기 · 아이콘, 줄바꿈 · 말줄임과 폭을 바꾸면 줄과 코드, 보조 기술이 읽는 글이 함께 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/tag-group.tsx#playground)

## Anatomy

[그림: 항목(아이콘 + 글) · 구분 " · "](../../site/components/specs/tag-group.tsx#anatomy)

| ⓐ Item | 항목 — 글 하나입니다. 6 ~ 10자로 씁니다. |
| ⓑ Icon | 아이콘 — 항목의 앞 또는 뒤에 하나를 둡니다. 없어도 됩니다. |
| ⓒ Separator | 구분 " · " — 점 그림이 아니라 글자입니다. 앞 항목에 붙습니다. |

[표: 부위](tag-group.yaml#slots)

## Properties

### Size

`t2` 12 / 16 *(기본)* · `t3` 13 / 18 · `t4` 14 / 19 입니다. 아이콘은 12 · 13 · 14 로 글자에 맞추고, 글과의 사이는 2 입니다. 크기는 묶음에 하나이며 한 줄 안에서 섞지 않습니다. 글은 글자 크기 설정을 따릅니다.

[그림: 크기 — t2 · t3 · t4](../../site/components/specs/tag-group.tsx#size)

[표: 크기](tag-group.yaml#size)

[표: 공통](tag-group.yaml#base.enabled)

### Tone · Weight

톤과 굵기는 항목마다 고릅니다. 기본은 흐린 글자(`neutralSubtle` — `fg-neutral-subtle`) · 400 입니다. 금액 · 핵심 수치처럼 앞세울 항목은 되도록 하나만 `neutral`(본문 글자) · `bold` 로 둡니다 — 여럿을 진하게 하면 앞세움이 사라지기 때문입니다. `brand` 는 아껴 씁니다. 구분 " · " 는 톤과 관계없이 늘 `fg-disabled` 로, 글보다 한 단계 흐립니다.

[그림: 톤 셋 · 굵기 둘 — 금액 하나만 진하게](../../site/components/specs/tag-group.tsx#tone)

[표: 톤](tag-group.yaml#tone)

[표: 굵기](tag-group.yaml#weight)

### Icon

아이콘은 항목의 앞(prefix) 또는 뒤(suffix)에 하나만 두고, 앞뒤 모두 두지 않습니다. 아이콘은 글자색을 따릅니다. 갈래(분할) · 눈(조회)처럼 뜻이 있는 아이콘은 그 항목의 읽을 글(`srLabel` — "분할 2건" · "조회 12")이 뜻을 전합니다.

[그림: 앞 아이콘 · 뒤 아이콘 — 분할 2 · 조회 12](../../site/components/specs/tag-group.tsx#icon)

### Overflow

| 값 | 넘칠 때 |
|---|---|
| `wrap` *(기본)* | 낱말 단위로 줄을 바꿉니다. 구분은 앞 항목에 붙어 줄 끝에 남고, 다음 줄은 항목으로 시작합니다. 아이콘은 붙은 낱말과 한 줄에 남습니다 — 앞 아이콘은 첫 낱말, 뒤 아이콘은 마지막 낱말과 줄바꿈 없이 묶습니다(NBSP 만으로는 아이콘 앞뒤가 줄바꿈 자리가 되기 때문입니다) |
| `truncate` | 한 줄 — 항목 글이 각자 말줄임(…)합니다. 줄어드는 정도는 항목마다 정합니다(`shrink` — 0 은 줄지 않고, 1 이상은 넘친 폭을 '글 폭 × shrink' 비율로 나눠 함께 줄어듭니다). 줄어드는 항목도 첫 글자 + "…"(2.1em) 까지만 줄어듭니다 |

말줄임하면 정보를 읽기 어려워지는 자리(가게 이름 · 주소)는 줄바꿈이 낫습니다. 목록 줄처럼 높이가 늘면 안 되는 자리만 `truncate` 로 두고, 꼭 보여야 할 항목(금액)은 `shrink={0}` 으로 둡니다. 말줄임으로 줄이는 것은 **이름 항목**(카테고리 · 계좌 · 태그)뿐입니다. 잘리면 뜻이 없는 항목(금액 · 시각 · 주기 문장)은 줄이지 않고, 줄이 모자라면 항목째 다음 줄로 넘깁니다("연회비 1,…" 이나 앞 두 낱말만 남은 주기는 쓰지 않습니다).

`shrink` 는 차례가 아닙니다. 브라우저 · Flutter 모두 넘친 폭을 줄어드는 항목에 '글 폭 × shrink' 비율로 나눠 한꺼번에 줄입니다. 수가 클수록, 글이 길수록 많이 줄어들 뿐, 큰 수의 항목이 다 줄어든 뒤에 다음 항목이 줄어드는 것이 아닙니다. 그래서 줄어드는 항목에는 최소 폭이 있습니다 — 첫 글자 + "…" 가 남는 2.1em(t3 100% 에서 27.3)입니다. 그보다 짧은 항목(두 글자 이하)은 넓히지 않고 글 폭 그대로 둡니다. 최소 폭이 없으면 좁은 줄에서 짧은 시각 · 개수까지 함께 줄어 글자 조각("오" 6.7px)만 남기 때문입니다. 모든 항목이 최소 폭까지 줄어도 넘치면 줄 끝이 말줄임 없이 잘리므로(200% · 폭 260 에서 21), 꼭 보일 항목은 `shrink={0}` 으로 앞에 둡니다.

**말줄임 뒤의 틈은 그대로 둡니다.** 잘린 항목은 칸 폭이 먼저 정해지고 그 안에서 글자 단위로 잘린 뒤 "…" 가 붙습니다. 그래서 다음 글자가 들어가지 못한 폭(글자 하나 미만)이 "…" 뒤에 남아, "…" 와 다음 " · " 사이가 다른 자리보다 조금 넓습니다(100% 에서 10 ~ 21 · 글자 200% 에서 21 ~ 40, 보통 틈은 구분 하나 9.8 · 19.7). 잘린 글을 재서 그 칸에 박아 틈을 없애지 않습니다. 웹(CSS 말줄임)과 앱(Flutter 말줄임) 모두 같은 틈이 생깁니다.

[그림: 줄바꿈 · 한 줄 말줄임 · 줄어드는 정도 · 최소 폭](../../site/components/specs/tag-group.tsx#overflow)

[표: 줄바꿈 · 말줄임](tag-group.yaml#overflow)

### State

상태는 `enabled` 하나이며 누르지 않습니다. 막힌 줄 안에 있으면 그 줄의 규칙(List 의 비활성 — 모든 글 `fg-disabled`)을 따릅니다. 끝낸 줄(끝낸 할 일 — 줄은 막히지 않고 누를 수 있습니다) 안에서도 항목 글을 톤 · 굵기와 상관없이 모두 `fg-disabled` 로 둡니다(앱 `PTagTone.disabled`). 구분 " · " 는 원래대로 `fg-disabled` 입니다. 같은 줄의 배지는 [Badge](badge.md) 의 "끝낸 항목 안" 을 따릅니다.

## Guidelines

### 메타 정보는 Tag Group 으로 보입니다

시간 · 개수 · 길이 · 거리 · 금액 · 자산 같은 메타 정보는 Tag Group 으로 보입니다. 대상의 상태 · 분류(예정 · 승인 · 연체)는 [Badge](badge.md) 를 씁니다. 한 줄에 둘이 함께 있으면 배지는 제목 옆에, Tag Group 은 설명 줄에 둡니다.

[그림: 제목 옆 배지 · 설명 줄 Tag Group](../../site/components/specs/tag-group.tsx#role-guide)

### 조사 · 접속어를 빼고 짧게 씁니다

항목은 6 ~ 10자로 쓰고, 조사 · 접속어 · 단위의 군말을 뺍니다("신한카드로 결제함" 이 아니라 "신한카드"). 문장이 되면 Tag Group 이 아니라 설명 글입니다. 같은 자리의 항목은 화면마다 같은 순서로 둡니다(가계부 줄 — 분류 · 자산 · 시각).

[그림: 짧은 항목 · 문장이 된 항목](../../site/components/specs/tag-group.tsx#writing-guide)

### 구분은 " · " 글자입니다

항목 사이는 글자 " · "(가운뎃점 앞뒤 띄어쓰기)로 가릅니다. 2px 점 그림 · "•" · "|" · 띄어쓰기만으로 가르지 않습니다. 구분은 글보다 한 단계 흐린 `fg-disabled` 입니다.

[그림: " · " 글자 · 2px 점 · "•"](../../site/components/specs/tag-group.tsx#separator-guide)

### 한 묶음은 한 크기입니다

크기는 묶음에 하나이며, 항목마다 크기를 바꾸지 않습니다. 강조는 톤 · 굵기로 합니다.

[그림: 한 크기 · 섞인 크기](../../site/components/specs/tag-group.tsx#size-guide)

### 끊어 읽게 합니다

구분 " · " 는 보조 기술에 숨기고, 그 자리에 보이지 않는 ", " 를 둡니다. 화면 읽기 프로그램이 "식비, 신한카드, 오후 2:10" 으로 끊어 읽고, "식비신한카드오후 2:10" 처럼 붙여 읽지 않습니다. 아이콘이 뜻을 가진 항목은 읽을 글을 따로 줍니다("분할 2건" · "조회 12").

[그림: 보조 기술이 읽는 글 — 항목마다 쉼표](../../site/components/specs/tag-group.tsx#reading-guide)

### 쓰는 자리

| 자리 | 크기 · 넘침 |
|---|---|
| [List](list.md) 줄의 설명 줄(거래 · 할 일 · 메모 · 이체) | `t3` · `truncate`(줄 높이 유지) — 금액처럼 꼭 보일 항목은 줄지 않게 둡니다 |
| 카드 · 상세 머리의 메타(카드 종류 · 혜택 · 공지 날짜 · 조회) | `t2` · `wrap` |
| 작성자 · 시각("김민수 · 3분 전") | `t2` · `wrap` |

## 코드

레시피 `recipes/shadcn/components/ui/tag-group.tsx` 의 `TagGroup` · `TagGroupItem` 을 씁니다. `TagGroup` 은 `size`(`"t2"` 기본 · `"t3"` · `"t4"`) · `truncate`(기본 `false` = 줄바꿈)와 항목의 기본 `tone` · `weight` 를 받고, 항목 사이에 " · "(보조 기술에는 ", ")를 스스로 넣습니다. 빈 항목(`null` · `false` · `""`)은 건너뜁니다. `TagGroupItem` 은 `tone`(`"neutralSubtle"` · `"neutral"` · `"brand"`) · `weight`(`"regular"` · `"bold"`) · `prefixIcon` 또는 `suffixIcon`(하나만) · `shrink`(`truncate` 일 때 줄어드는 정도, 기본 1 — 0 은 줄지 않습니다) · `srLabel`(보조 기술이 읽을 글 — 주면 보이는 글 · 아이콘은 숨깁니다)을 받습니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

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

### 줄어드는 정도

[그림: 좁은 폭 — 긴 자산 이름만 줄어든다](../../site/components/specs/tag-group.tsx#ex-truncate)

```tsx
<TagGroup size="t3" truncate>
  <TagGroupItem shrink={1}>교통</TagGroupItem>
  <TagGroupItem shrink={2}>신한카드 체크카드(1234)</TagGroupItem>
  <TagGroupItem shrink={0}>오후 2:10</TagGroupItem>
</TagGroup>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 누르기 · 호버 · 키보드 | 없습니다 — 포커스가 서지 않습니다. 줄이 눌리면 그 줄의 동작입니다 |
| 폭이 좁음(`wrap`) | 낱말 단위로 줄을 바꿉니다 — 구분은 앞 줄 끝에 남습니다 |
| 폭이 좁음(`truncate`) | 한 줄 그대로 두고, 줄어드는 항목이 '글 폭 × `shrink`' 비율로 함께 말줄임합니다 — 첫 글자 + "…"(2.1em)에서 멈춥니다. 구분 · `shrink={0}` 항목은 줄지 않습니다. 모두 최소 폭이어도 넘치면 줄 끝이 잘립니다 |
| 글자 크기 설정 | 글이 커집니다(`wrap` 이면 줄이 늘고, `truncate` 면 더 일찍 말줄임합니다) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 기본 `fg-neutral-subtle` 흰 바탕 5.50 · 다크 6.09, 회색 바탕 5.09 · 6.89 ✓. `neutral` 16.41 · 13.42, `brand` Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. 구분 " · " `fg-disabled` 3.16 · 4.13 은 장식입니다(보조 기술에 숨김) |
| **WCAG 1.3.1** Info and Relationships | 항목 사이에 보이지 않는 ", " 를 두어 항목이 붙어 읽히지 않습니다 ✓ |
| **WCAG 1.4.1** Use of color | 앞세운 항목은 색과 함께 굵기로도 다릅니다 |
| **WCAG 1.4.4** Resize text | 글이 커지고, 줄바꿈 · 말줄임으로 넘치지 않습니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않습니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다 |
| **ARIA** | 묶음은 `<span>` 이며 역할이 없습니다(목록 역할을 주지 않아 "목록, 항목 3개" 를 줄마다 읽지 않게 합니다). 구분은 `aria-hidden`, 보이지 않는 ", " 는 sr-only 글입니다. 아이콘은 `aria-hidden` 이고, `srLabel` 이 있으면 보이는 글을 숨기고 그 글을 읽습니다. 말줄임해도 글 전체를 읽습니다. 앱은 묶음을 의미 노드 하나로 합쳐 항목을 ", " 로 잇습니다 |

## Do / Don't

### ✅ Do

- 메타 정보를 " · " 로 이어 짧게 씁니다.
- 앞세울 항목은 되도록 하나만 진하게 합니다.
- 한 묶음은 한 크기로 둡니다.
- 항목마다 끊어 읽게 합니다.

### ❌ Don't

- 2px 점 · "•" · "|" 로 가르지 않습니다.
- 항목을 문장으로 쓰거나 조사를 붙여 길게 쓰지 않습니다.
- 상태 · 분류를 Tag Group 에 넣지 않습니다 — 배지로 보입니다.
- 영어 · 코드값 항목("Day 2 of 3" · "9:00 AM")을 쓰지 않습니다.

## Specification

[그림: Specification — tag-group.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#tag-group)
