# Badge

> 대상의 상태 · 분류를 한두 낱말로 보이는 작은 라벨입니다("예정" · "연체" · "승인"). 누르지 않습니다 — 고르고 거르는 것은 [Chip](chip.md), 실행은 [Button](button.md), 시간 · 개수 · 길이 같은 메타 정보는 [Tag Group](tag-group.md), 안 읽은 알림은 [Notification Badge](notification-badge.md) 입니다.

수치 원본은 [`badge.yaml`](badge.yaml)입니다.

[그림: 가계부 줄의 상태 · 카드 상세 머리 · 캘린더 공유 권한 — 라이트 · 다크](../../site/components/specs/badge.tsx#hero)

### 직접 골라 보기

변형 · 톤 · 크기 · 앞 아이콘 · 글 길이를 고르면 스펙대로 그린 배지와 그 코드가 바뀝니다. 줄 안 · 상세 머리 두 자리에 놓아 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/badge.tsx#playground)

## Anatomy

[그림: 배지는 상자 · 앞 아이콘 · 글로, 여럿이면 사이 4](../../site/components/specs/badge.tsx#anatomy)

| ⓐ Container | 상자 — 둥근 사각(4 · 6). 글만큼 넓어지고 최대 폭이 없습니다. |
| ⓑ Prefix Icon | 앞 아이콘 — 글자색을 따릅니다. 없어도 됩니다. |
| ⓒ Label | 글 — 한두 낱말, 한 줄입니다. |

[표: 부위](badge.yaml#slots)

## Properties

### Variant

세 가지입니다. 같은 톤이면 weak → outline → solid 순으로 강해집니다.

| 변형 | 모양 | 쓰는 자리 |
|---|---|---|
| `weak` *(기본)* | 옅은 바탕(`bg-{톤}-weak`) + 진한 글자(`fg-{톤}-contrast`) · 500 | 반복되는 목록 · 분류 · 부가 정보 — 줄마다 있어도 무겁지 않습니다 |
| `outline` | 투명 + 안쪽 1px 옅은 선(`stroke-{톤}-weak`) + 의미 색 글자(`fg-{톤}`) · 700 | 상세 · 본문의 중간 강조 — 권한 · 카드 종류처럼 한 화면에 몇 개 |
| `solid` | 채움(`bg-{톤}-solid`) + 흰 글자 · 700 | 드물게 — 사진 위, 강하게 알려야 할 상태 |

중립(`neutral`)만 짝이 다릅니다 — weak 는 `bg-neutral-weak` + `fg-neutral-muted`, solid 는 `bg-neutral-inverted` + `fg-neutral-inverted`(다크에서 밝은 면 + 짙은 글자), outline 은 `stroke-neutral-weak` + `fg-neutral-muted` 입니다.

[그림: 변형 셋 × 톤 여섯 — 라이트 · 다크](../../site/components/specs/badge.tsx#variant)

[표: 변형 — 굵기 · 테두리](badge.yaml#variant)

### Tone

| 톤 | 쓰는 자리 | groo 예 |
|---|---|---|
| `neutral` *(기본)* | 상태가 따로 없거나 분명하지 않은 것 · 분류 | 예정 · 환불됨 · 기록만 · 일시정지 · 단종 · 기본 · 신용 · 체크 |
| `informative` | 안내 · 권한 제한 · 베타 | 읽기 전용 · 새로 |
| `positive` | 완료 · 승인 · 연결 | 달성 · 승인 · 연결됨 · 정상 속도 |
| `warning` | 곧 문제가 될 것 · 빠진 것 | 만료 임박 · 빠른 속도 · 투자 주의 |
| `critical` | 거절 · 실패 · 넘침 · 제재 | 반려 · 연체 · 한도 초과 |
| `brand` | 브랜드와 닿는 자리만 — 아껴 씁니다 | 요금제(Pro) · 본인 표시(나) |

**D-day — 며칠 남은 일은 어디서나 `warning`.** 다가오는 결제 · 일정의 "D-3" · "3일 남음" 은 배지든 글이든 주황(`warning` — 글은 `fg-warning`)입니다. 아직 문제가 아니라 곧 닥칠 일이라 "만료 임박" 과 같은 톤입니다. 빨강(`critical`)은 연체 · 한도 초과처럼 이미 문제가 된 일에만 씁니다 — 화면마다 갈리지 않습니다. 며칠 전부터 칠할지는 이 규칙이 정하지 않습니다.

[표: weak — 옅은 바탕](badge.yaml#grid.tone.variant.weak)

[표: solid — 채움](badge.yaml#grid.tone.variant.solid)

[표: outline — 옅은 선](badge.yaml#grid.tone.variant.outline)

outline 의 의미 색 테두리 넷(`stroke-informative-weak` · `-positive-weak` · `-warning-weak` · `-critical-weak`)은 팔레트 300 · 다크 400 을 가리키는 역할 색입니다. 다크는 표면이 밝아 300 이면 선이 묻히기 때문에 400 을 씁니다.

### Size

`medium` 20 *(기본)* · `large` 24. medium 은 목록 줄 · 표 · 이름 옆, large 는 상세 머리 · 카드 제목 옆에 씁니다. 글은 medium `t1` 11 / 15 · large `t2` 12 / 16, 앞 아이콘은 12 · 14 이고 글과 사이 2 를 둡니다. 글은 글자 크기 설정을 따르고(최소 높이는 그대로 두고 상자가 글을 따라 커집니다), 줄을 바꾸지 않습니다.

[그림: 크기 — medium 20 은 줄 안, large 24 는 상세 머리](../../site/components/specs/badge.tsx#size)

[표: 크기](badge.yaml#size)

[표: 공통](badge.yaml#base.enabled)

### State

상태는 `enabled` 하나입니다 — 배지는 누르지 않아 호버 · 누름 · 포커스가 없습니다.

**끝낸 항목 안 배지는 꺼진 모양** — 끝낸 할 일 줄처럼 항목이 끝나 줄 전체를 흐린 색으로 둘 때, 그 안의 배지도 꺼진 모양입니다 — 바탕 `bg-disabled` · 글 `fg-disabled`(List 막힌 줄의 타일과 같은 짝)로, 변형 · 톤과 상관없이 같습니다. 불투명도로 흐리지 않습니다. 배지만 진한 색으로 남으면 끝낸 줄에서 배지가 가장 먼저 읽히기 때문입니다. 앱은 `PBadge.disabled`, 웹은 같은 이름의 prop 으로 켭니다.

## Guidelines

### 상태 · 분류만 배지로

배지는 대상이 **어떤 상태인지 · 무엇으로 분류되는지**를 한두 낱말로 보입니다. 시간 · 개수 · 길이 · 금액 같은 메타 정보는 배지가 아니라 [Tag Group](tag-group.md)(" · " 로 이은 회색 줄)입니다.

| 보이려는 것 | 쓰는 것 |
|---|---|
| 상태 한 낱말(예정 · 승인 · 연체) | **Badge** |
| 대상의 종류를 앞세우는 분류 라벨(신용 · 체크 · 할인형) | **Badge** `neutral` weak |
| 설명 줄의 메타 — 카테고리 이름 · 자산 · 시각 · 거리 · 개수 · 금액 | [Tag Group](tag-group.md) |
| 안 읽은 알림이 있음 · 몇 개 | [Notification Badge](notification-badge.md) |
| 고르기 · 거르기 · 넣은 값 빼기 | [Chip](chip.md) |
| 실행 | [Button](button.md) |
| 문장이 되는 안내 | 그냥 글 · [Callout](callout.md) |

[그림: 상태는 배지, 메타는 Tag Group, 고르기는 Chip — 한 줄에 함께](../../site/components/specs/badge.tsx#role-guide)

### 누르지 않습니다

배지는 누르는 것처럼 생기지 않았고, 누르는 동작이 없습니다. 누르면 무언가 되는 라벨이 필요하면 [Chip](chip.md)(고르기 · 거르기 — 알약) 또는 [Button](button.md) 을 씁니다. 배지의 뜻을 더 설명해야 하면 배지 옆에 ⓘ [Help Bubble](help-bubble.md) 을 둡니다 — 배지 안에 버튼을 넣지 않습니다.

[그림: 누르는 것은 알약 Chip — 둥근 사각 배지는 누르지 않는다](../../site/components/specs/badge.tsx#press-guide)

### 반복되는 줄은 weak

목록처럼 같은 모양이 되풀이되는 자리는 `weak` 입니다 — 줄마다 채운 배지가 있으면 화면이 무거워지고 정작 눈에 띄어야 할 것이 묻힙니다. `solid` 는 드물게 씁니다 — 사진 위, 그리고 강하게 알려야 할 상태(연체 · 해지됨)입니다. `outline` 은 상세 · 본문의 중간 강조에 씁니다. 한 목록 안에서는 한 변형으로 맞추고 뜻은 톤으로 가릅니다.

[그림: 목록은 weak — 줄마다 solid 인 목록](../../site/components/specs/badge.tsx#weak-guide)

### 흰 표면 위에서

중립 weak 의 바탕(`bg-neutral-weak`)은 회색 바탕(`bg-layer-basement`)과 같은 색이라 거기서는 상자가 사라집니다 — 배지는 흰 표면(`bg-layer-default`) · 시트 위에 둡니다. 회색 바탕 위에 둬야 하면 outline 을 씁니다.

[그림: 흰 표면 위 weak · 회색 바탕 위 weak](../../site/components/specs/badge.tsx#surface-guide)

### 한 대상에 둘까지

한 대상(한 줄 · 한 카드)에는 배지를 둘까지 둡니다. 셋 이상 필요하면 중요한 것만 남기고 나머지는 상세에서 보입니다. 둘이면 사이 4 — 줄바꿈하지 않습니다.

[그림: 줄 하나에 배지 둘까지 · 배지 넷](../../site/components/specs/badge.tsx#count-guide)

### 색은 뜻으로, 브랜드는 아껴서

톤은 뜻을 나타냅니다 — 완료는 positive, 거절 · 넘침은 critical 처럼 위 표대로 고릅니다. 뜻이 없는 분류(카드 종류 · 시장)는 neutral 입니다. brand 는 요금제 · 본인 표시처럼 브랜드와 닿는 자리에만 씁니다 — 브랜드 색 배지가 흔해지면 브랜드 버튼(주요 동작)과 다툽니다. 같은 뜻은 어느 화면에서나 같은 변형 · 톤입니다("달성" 이 웹은 브랜드 · 앱은 초록이면 안 됩니다).

[그림: 달성은 positive — 브랜드 색으로 칠한 "달성"](../../site/components/specs/badge.tsx#tone-guide)

### 합계에 안 드는 줄

예정 · 환불 거래처럼 합계에 들지 않는 줄은 줄 전체를 흐리지 않습니다 — 그 줄을 가르는 단서가 배지이므로 배지는 보통 대비 그대로 두고, 제목 · 금액만 옅게(환불은 금액에 취소선) 합니다. 규칙은 [List — 합계에 안 드는 줄](list.md#합계에-안-드는-줄)에 있습니다.

### 글

- 한두 낱말 · 명사로 짧게 — "예정" · "연체 3" · "한도 초과". 문장이 되면 배지가 아닙니다.
- 상태는 "~됨" · "~중" 처럼 지금 상태를 말하고, 같은 뜻은 같은 말로 씁니다("달성" · "달성!" 을 섞지 않습니다).
- 영어 · 코드값을 그대로 내지 않습니다 — "NEW" 는 "새로", `ROLE_ADMIN` 은 "관리자", 정책 코드는 정책 이름입니다. 요금제 이름 Pro · Free 는 이름이라 그대로 둡니다.
- 대문자 · 자간을 따로 주지 않습니다.

[그림: 글 — 한두 낱말 · 코드값 · 영어 대문자](../../site/components/specs/badge.tsx#writing-guide)

## 코드

레시피 `recipes/shadcn/components/ui/badge.tsx` 를 씁니다 — `Badge` · `BadgeGroup`. 기본은 `variant="weak"` · `tone="neutral"` · `size="medium"` 이고, 글은 `children`, 앞 아이콘은 `prefixIcon`(lucide, 크기는 배지가 정합니다)입니다. `<span>` 으로 그려 글 안 · 줄 안 어디에나 놓입니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 목록 줄의 상태 — weak

[그림: 가계부 줄 — 예정 · 연체](../../site/components/specs/badge.tsx#ex-row)

```tsx
import { Badge } from "@/components/ui/badge"

<span className="flex items-center gap-x1_5">
  <span className="truncate">가나영상</span>
  <Badge className="shrink-0">예정</Badge>
</span>

<Badge tone="critical">연체 3</Badge>
```

### 상세 머리 — large · 둘

[그림: 카드 상세 머리 — 신용 · 단종](../../site/components/specs/badge.tsx#ex-detail)

```tsx
import { Badge, BadgeGroup } from "@/components/ui/badge"

<BadgeGroup>
  <Badge size="large">신용</Badge>
  <Badge size="large" variant="solid">단종</Badge>
</BadgeGroup>
```

### 권한 — outline · 앞 아이콘

[그림: 캘린더 공유 — 편집 가능 · 읽기 전용](../../site/components/specs/badge.tsx#ex-outline)

```tsx
import { Eye, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

<Badge variant="outline" tone="positive" prefixIcon={<Pencil />}>편집 가능</Badge>
<Badge variant="outline" tone="informative" prefixIcon={<Eye />}>읽기 전용</Badge>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 누르기 · 호버 · 키보드 | 없습니다 — 포커스가 서지 않습니다. 배지가 놓인 줄 · 카드가 눌리면 그 동작입니다 |
| 글이 길 때 | 줄을 바꾸지 않습니다. 부모가 폭을 막을 때(flex 줄 안 · 폭이 정해진 칸)만 글이 한 줄 말줄임(…)됩니다 — 글 전체는 보조 기술이 읽습니다 |
| 글자 크기 설정 | 글이 커지면 상자가 따라 커집니다(최소 높이 20 · 24 는 그대로) |
| 상태가 바뀜 | 배지 글 · 색이 바로 바뀝니다(모션 없음) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | weak — 중립 6.58 · 다크 5.93, 의미 색 5.65 ~ 5.72 · 7.78 ~ 7.84, 브랜드 Desk 8.74 · 5.48 · HR 8.49 · 5.47. solid — 흰 글자 5.06 ~ 5.09 · 5.77 ~ 5.79, 브랜드 Desk 8.38 · 8.36 · HR 8.17 · 8.36, 중립 16.41 · 13.42. outline(흰 표면 위) — 의미 색 5.06 ~ 5.09 · 6.07 ~ 6.12, 중립 7.11 · 7.70, 브랜드 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ — 11 · 12px 라 큰 글자 기준을 쓰지 않습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 상자 바탕(weak 1.08 ~ 1.30) · 옅은 선(1.51 ~ 1.73, 중립 1.23 · 1.56)은 배지를 알리는 유일한 표시가 아닙니다 — 글이 알립니다 |
| **WCAG 1.4.1** Use of color | 뜻은 글에 있습니다 — 색(톤)은 거드는 것입니다. "연체" 를 빨간 점만으로 알리지 않습니다 |
| **WCAG 1.4.4** Resize text | 글이 글자 크기 설정을 따라 커지고 상자가 함께 커집니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않습니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다 |
| **ARIA** | `<span>` · 역할 없음 — 글이 앞뒤 글(줄 이름)과 이어 읽힙니다("가나영상 예정 구독 현대카드"). 앞 아이콘은 `aria-hidden` 입니다. 말줄임해도 글 전체를 읽습니다 |

## Do / Don't

### ✅ Do

- 상태 · 분류를 한두 낱말로.
- 반복되는 목록은 weak, 한 목록 안은 한 변형으로.
- 뜻에 맞는 톤 — 브랜드는 아껴서.
- 흰 표면 위에, 한 대상에 둘까지.

### ❌ Don't

- 배지를 누르게 하기 · 지우기 버튼 달기 — Chip 입니다.
- 시간 · 개수 · 길이를 배지로 — Tag Group 입니다.
- 알약 모양 배지 — 알약은 누르는 Chip 의 모양입니다.
- 배지가 든 줄을 불투명도로 흐리기 — 배지까지 흐려집니다.
- 영어 대문자 · 코드값 배지("NEW" · `ROLE_ADMIN`).
- 뜻 없는 표시를 브랜드 톤으로 — "기본" 은 상태가 아니라 분류라 `neutral` 입니다. `brand` 는 요금제 · 브랜드와 닿는 자리만 씁니다.

## Specification

`badge.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Badge 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — badge.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#badge)
