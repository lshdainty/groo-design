# Badge

> 대상의 상태 · 분류를 한두 낱말로 보이는 작은 라벨("예정" · "연체" · "승인"). 누르지 않는다 — 고르고 거르는 것은 [Chip](chip.md), 실행은 [Button](button.md), 시간 · 개수 · 길이 같은 메타 정보는 [Tag Group](tag-group.md), 안 읽은 알림은 [Notification Badge](notification-badge.md) 다.

구조는 당근 [SEED Badge](https://seed-design.io/components/badge)(Apache-2.0)를 따른다 — 둥근 사각 상자 · 앞 아이콘 · 글, 변형 셋(weak · solid · outline) × 톤 여섯, 크기 둘. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). 옛 Badge(알약 · 11 / 600 · solid · soft · outline 12변형 · 누르는 배지)를 대신한다.

수치 원본은 [`badge.yaml`](badge.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 줄의 상태 · 카드 상세 머리 · 캘린더 공유 권한 — 라이트 · 다크](../../site/components/specs/badge.tsx#hero)

### 직접 골라 보기

변형 · 톤 · 크기 · 앞 아이콘 · 글 길이를 고르면 스펙대로 그린 배지와 그 코드가 바뀐다. 줄 안 · 상세 머리 두 자리에 놓아 본다.

[그림: 플레이그라운드](../../site/components/specs/badge.tsx#playground)

## Anatomy

[그림: 배지는 상자 · 앞 아이콘 · 글로, 여럿이면 사이 4](../../site/components/specs/badge.tsx#anatomy)

| ⓐ Container | 상자 — 둥근 사각(4 · 6). 글만큼 넓어지고 최대 폭이 없다. |
| ⓑ Prefix Icon | 앞 아이콘 — 글자색을 따른다. 없어도 된다. |
| ⓒ Label | 글 — 한두 낱말, 한 줄. |

[표: 부위](badge.yaml#slots)

## Properties

### Variant

세 가지다. 같은 톤이면 weak → outline → solid 순으로 강해진다.

| 변형 | 모양 | 쓰는 자리 |
|---|---|---|
| `weak` *(기본)* | 옅은 바탕(`bg-{톤}-weak`) + 진한 글자(`fg-{톤}-contrast`) · 500 | 반복되는 목록 · 분류 · 부가 정보 — 줄마다 있어도 무겁지 않다 |
| `outline` | 투명 + 안쪽 1px 옅은 선(`stroke-{톤}-weak`) + 의미 색 글자(`fg-{톤}`) · 700 | 상세 · 본문의 중간 강조 — 권한 · 카드 종류처럼 한 화면에 몇 개 |
| `solid` | 채움(`bg-{톤}-solid`) + 흰 글자 · 700 | 드물게 — 사진 위, 강하게 알려야 할 상태 |

중립(`neutral`)만 짝이 다르다 — weak 는 `bg-neutral-weak` + `fg-neutral-muted`, solid 는 `bg-neutral-inverted` + `fg-neutral-inverted`(다크에서 밝은 면 + 짙은 글자), outline 은 `stroke-neutral-weak` + `fg-neutral-muted`.

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
| `brand` | 브랜드와 닿는 자리만 — 아껴 쓴다 | 요금제(Pro) · 본인 표시(나) |

[표: weak — 옅은 바탕](badge.yaml#grid.tone.variant.weak)

[표: solid — 채움](badge.yaml#grid.tone.variant.solid)

[표: outline — 옅은 선](badge.yaml#grid.tone.variant.outline)

outline 의 의미 색 테두리 넷(`stroke-informative-weak` · `-positive-weak` · `-warning-weak` · `-critical-weak`)은 이 결정으로 새로 둔 역할 색이다(v117 — 팔레트 300 · 다크 400).

### Size

`medium` 20 *(기본)* · `large` 24. medium 은 목록 줄 · 표 · 이름 옆, large 는 상세 머리 · 카드 제목 옆이다. 글은 medium `t1` 11 / 15 · large `t2` 12 / 16, 앞 아이콘 12 · 14 와 글 사이 2. 글은 글자 크기 설정을 따르고(최소 높이는 그대로 두고 상자가 글을 따라 커진다), 줄을 바꾸지 않는다.

[그림: 크기 — medium 20 은 줄 안, large 24 는 상세 머리](../../site/components/specs/badge.tsx#size)

[표: 크기](badge.yaml#size)

[표: 공통](badge.yaml#base.enabled)

### State

상태는 `enabled` 하나다 — 배지는 누르지 않아 호버 · 누름 · 포커스가 없다(SEED).

**끝낸 항목 안 배지는 꺼진 모양** — 끝낸 할 일 줄처럼 항목이 끝나 줄 전체를 흐린 색으로 둘 때, 그 안의 배지도 꺼진 모양이다 — 바탕 `bg-disabled` · 글 `fg-disabled`(List 막힌 줄의 타일과 같은 짝)로, 변형 · 톤과 상관없이 같다. 불투명도로 흐리지 않는다(v106). 배지만 진한 색으로 남으면 끝낸 줄에서 배지가 가장 먼저 읽힌다(2026-10-25 I-10 앱 — 앱 `PBadge.disabled`, 웹은 화면 `className` 으로 덮던 것을 같은 이름의 prop 으로 옮긴다).

## Guidelines

### 상태 · 분류만 배지로

배지는 대상이 **어떤 상태인지 · 무엇으로 분류되는지**를 한두 낱말로 보인다. 시간 · 개수 · 길이 · 금액 같은 메타 정보는 배지가 아니라 [Tag Group](tag-group.md)(" · " 로 이은 회색 줄)이다(SEED Image Frame — "Badge 는 상태나 분류를 표현할 때만").

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

### 누르지 않는다

배지는 누르는 것처럼 생기지 않았고, 누르는 동작이 없다. 누르면 무언가 되는 라벨이 필요하면 [Chip](chip.md)(고르기 · 거르기 — 알약) 또는 [Button](button.md) 이다. 배지의 뜻을 더 설명해야 하면 배지 옆에 ⓘ [Help Bubble](help-bubble.md) 을 둔다 — 배지 안에 버튼을 넣지 않는다.

[그림: 누르는 것은 알약 Chip — 둥근 사각 배지는 누르지 않는다](../../site/components/specs/badge.tsx#press-guide)

### 반복되는 줄은 weak

목록처럼 같은 모양이 되풀이되는 자리는 `weak` 다 — 줄마다 채운 배지가 있으면 화면이 무거워지고 정작 눈에 띄어야 할 것이 묻힌다. `solid` 는 드물게 쓴다 — 사진 위, 그리고 강하게 알려야 할 상태(연체 · 해지됨)(SEED Solid — "이미지 위 … 또한 강한 주목도가 필요한 경우 사용할 수 있습니다"). `outline` 은 상세 · 본문의 중간 강조에 쓴다. 한 목록 안에서는 한 변형으로 맞추고 뜻은 톤으로 가른다.

[그림: 목록은 weak — 줄마다 solid 인 목록](../../site/components/specs/badge.tsx#weak-guide)

### 흰 표면 위에서

중립 weak 의 바탕(`bg-neutral-weak`)은 회색 바탕(`bg-layer-basement`)과 같은 색이라 거기서는 상자가 사라진다 — 배지는 흰 표면(`bg-layer-default`) · 시트 위에 둔다. 회색 바탕 위에 둬야 하면 outline 을 쓴다.

[그림: 흰 표면 위 weak · 회색 바탕 위 weak](../../site/components/specs/badge.tsx#surface-guide)

### 한 대상에 둘까지

한 대상(한 줄 · 한 카드)에는 배지를 둘까지 둔다(SEED). 셋 이상 필요하면 중요한 것만 남기고 나머지는 상세에서 보인다. 둘이면 사이 4 — 줄바꿈하지 않는다.

[그림: 줄 하나에 배지 둘까지 · 배지 넷](../../site/components/specs/badge.tsx#count-guide)

### 색은 뜻으로, 브랜드는 아껴서

톤은 뜻을 나타낸다 — 완료는 positive, 거절 · 넘침은 critical 처럼 위 표대로 고른다. 뜻이 없는 분류(카드 종류 · 시장)는 neutral 이다. brand 는 요금제 · 본인 표시처럼 브랜드와 닿는 자리에만 쓴다 — 브랜드 색 배지가 흔해지면 브랜드 버튼(주요 동작)과 다툰다. 같은 뜻은 어느 화면에서나 같은 변형 · 톤이다("달성" 이 웹은 브랜드 · 앱은 초록이면 안 된다).

[그림: 달성은 positive — 브랜드 색으로 칠한 "달성"](../../site/components/specs/badge.tsx#tone-guide)

### 합계에 안 드는 줄

예정 · 환불 거래처럼 합계에 들지 않는 줄은 줄 전체를 흐리지 않는다 — 그 줄을 가르는 단서가 배지이므로 배지는 보통 대비 그대로 두고, 제목 · 금액만 옅게(환불은 금액에 취소선) 한다. 규칙은 [List — 합계에 안 드는 줄](list.md#합계에-안-드는-줄)에 있다.

### 글

- 한두 낱말 · 명사로 짧게 — "예정" · "연체 3" · "한도 초과". 문장이 되면 배지가 아니다.
- 상태는 "~됨" · "~중" 처럼 지금 상태를 말하고, 같은 뜻은 같은 말로("달성" · "달성!" 을 섞지 않는다).
- 영어 · 코드값을 그대로 내지 않는다 — "NEW" 는 "새로", `ROLE_ADMIN` 은 "관리자", 정책 코드는 정책 이름(Writing v106). 요금제 이름 Pro · Free 는 이름이라 그대로 둔다.
- 대문자 · 자간을 따로 주지 않는다.

[그림: 글 — 한두 낱말 · 코드값 · 영어 대문자](../../site/components/specs/badge.tsx#writing-guide)

## 코드

레시피 `recipes/shadcn/components/ui/badge.tsx` 를 쓴다 — `Badge` · `BadgeGroup`. 기본은 `variant="weak"` · `tone="neutral"` · `size="medium"` 이고, 글은 `children`, 앞 아이콘은 `prefixIcon`(lucide, 크기는 배지가 정한다)이다. `<span>` 으로 그려 글 안 · 줄 안 어디에나 놓인다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 목록 줄의 상태 — weak

[그림: 가계부 줄 — 예정 · 연체](../../site/components/specs/badge.tsx#ex-row)

```tsx
import { Badge } from "@/components/ui/badge"

<span className="flex items-center gap-x1_5">
  <span className="truncate">넷플릭스</span>
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
| 누르기 · 호버 · 키보드 | 없다 — 포커스가 서지 않는다. 배지가 놓인 줄 · 카드가 눌리면 그 동작이다 |
| 글이 길 때 | 줄을 바꾸지 않는다. 부모가 폭을 막을 때(flex 줄 안 · 폭이 정해진 칸)만 글이 한 줄 말줄임(…) — 글 전체는 보조 기술이 읽는다 |
| 글자 크기 설정 | 글이 커지면 상자가 따라 커진다(최소 높이 20 · 24 는 그대로) |
| 상태가 바뀜 | 배지 글 · 색이 바로 바뀐다(모션 없음) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | weak — 중립 6.58 · 다크 5.93, 의미 색 5.65 ~ 5.72 · 7.78 ~ 7.84, 브랜드 Desk 8.74 · 5.48 · HR 8.49 · 5.47. solid — 흰 글자 5.06 ~ 5.09 · 5.77 ~ 5.79, 브랜드 Desk 8.38 · 8.36 · HR 8.17 · 8.36, 중립 16.41 · 13.42. outline(흰 표면 위) — 의미 색 5.06 ~ 5.09 · 6.07 ~ 6.12, 중립 7.11 · 7.70, 브랜드 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ — 11 · 12px 라 큰 글자 기준을 쓰지 않는다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 상자 바탕(weak 1.08 ~ 1.30) · 옅은 선(1.51 ~ 1.73, 중립 1.23 · 1.56)은 배지를 알리는 유일한 표시가 아니다 — 글이 알린다(SEED 와 같다) |
| **WCAG 1.4.1** Use of color | 뜻은 글에 있다 — 색(톤)은 거드는 것이다. "연체" 를 빨간 점만으로 알리지 않는다 |
| **WCAG 1.4.4** Resize text | 글이 글자 크기 설정을 따라 커지고 상자가 함께 커진다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | `<span>` · 역할 없음 — 글이 앞뒤 글(줄 이름)과 이어 읽힌다("넷플릭스 예정 구독 현대카드"). 앞 아이콘은 `aria-hidden`. 말줄임해도 글 전체를 읽는다 |

## Do / Don't

### ✅ Do

- 상태 · 분류를 한두 낱말로.
- 반복되는 목록은 weak, 한 목록 안은 한 변형으로.
- 뜻에 맞는 톤 — 브랜드는 아껴서.
- 흰 표면 위에, 한 대상에 둘까지.

### ❌ Don't

- 배지를 누르게 하기 · 지우기 버튼 달기 — Chip 이다.
- 시간 · 개수 · 길이를 배지로 — Tag Group 이다.
- 알약 모양 배지 — 알약은 누르는 Chip 의 모양이다.
- 배지가 든 줄을 불투명도로 흐리기 — 배지까지 흐려진다.
- 영어 대문자 · 코드값 배지("NEW" · `ROLE_ADMIN`).

## Specification

`badge.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Badge 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — badge.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#badge)

## SEED 와 다른 점

- **기본은 weak · neutral · medium** — SEED React 기본은 solid · neutral · medium 이다. SEED 디자인 문서가 반복 목록 · 분류 · 부가 정보에 weak 를 권하므로 그쪽을 기본으로 둔다.
- **중립 solid 는 역할 색** — `bg-neutral-inverted` + `fg-neutral-inverted`(SEED 는 palette gray-800 + fg.on-neutral-solid).
- **warning solid 는 주황 + 흰 글자** — SEED 는 노랑 + 검정 81.6% 글자. groo 의 주의 색은 주황(v108)이고, 흰 글자가 5.06 · 5.79:1 이다(Page Banner 와 같다).
- **의미 색 옅은 선의 다크는 팔레트 400** — SEED 는 300. groo 다크 표면은 SEED 보다 밝아 300 이 1.38 ~ 1.40:1(시트 위 1.19 ~ 1.21)로 묻힌다. 400 은 1.71 ~ 1.73:1 — SEED 다크(1.77)와 같은 관계다(v117).
- **중립 outline 테두리는 `stroke-neutral-weak`** — SEED stroke.neutral-muted 는 투명도가 있는 색이라 groo 에 없다.
- **대비는 WCAG AA** — SEED 의 흰 글자 on 주황(2.94) · 의미 색 solid(3.8 ~ 4.0) · 라이트 outline(3.8 ~ 4.1)처럼 4.5:1 에 못 미치는 짝이 없다.
- **Action(정보 아이콘 버튼)은 두지 않는다** — SEED React 3(2026-10-01)의 배지 안 정보 버튼은 누르는 영역이 12 · 14 이고, 누르지 않는 배지 안에 따로 눌리는 것이 생긴다. 설명은 배지 옆 ⓘ Help Bubble 이다.

## Migration notes

### 2026-10-30 — 끝낸 항목 안 배지

구현 검수(I-10 할 일 "끝낸 줄")에서 앱 ds 가 먼저 만든 `PBadge.disabled`(바탕 `bg-disabled` · 글 `fg-disabled` · 변형 · 톤 무시)를 State 에 적고, "비활성이 없다" 던 `badge.yaml` 머리 주석 · `states` 설명을 고쳤다. YAML 에 상태 `disabled` 는 아직 두지 않았다 — 사이트 그림 로더(`display-look.ts` 가 상태를 `enabled` 하나로 묶는다) · 레시피 · 웹 ds prop 을 함께 옮길 일이라 따로 남았다. 새 토큰 없음. 옛 스펙은 `badge.history/v-pre-cleanup-1030.*`.


### 2026-10-22 — solid 는 드물게

"`solid` 는 한 화면에서 꼭 눈에 띄어야 할 상태 하나 · 사진 위에만"(b1dfc58 — 10-03 비교 페이지에 "하나" 가 없다)을 SEED 말투의 권장 "드물게 — 사진 위, 그리고 강하게 알려야 할 상태(연체 · 해지됨)" 로 낮췄다(남은 규칙 R1). "한 대상에 둘까지"(SEED 와 같은 숫자 · 셋 이상의 대안이 붙어 있다)는 그대로다(R2). 사용자 결정 — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L. 값 변경 없음.

### 2026-10-03 — SEED Badge 로 새로 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — 모양은 SEED 둥근 사각(1A — medium 20 · 모서리 4 · 11/15, large 24 · 모서리 6 · 12/16, weak 500 · solid · outline 700, 알약은 Chip 에만), 체계는 SEED variant × tone, outline 테두리는 옅은 선(2A — `stroke-*-weak` 토큰 넷을 새로, v117), 합계에 안 드는 줄은 배지를 또렷하게(3A — List 규칙). 옛 Badge(알약 · `text-badge` 11/600 · solid 3 · soft 4 · outline 5 · 누르는 배지 · 지우는 태그)는 걷었다 — 옛 스펙은 `badge.history/v-pre-seed-display.*`. 누르는 배지 · 지우는 태그는 Chip(`ChipToggle` · `InputChip`)이다. DESIGN.md 의 옛 Badge 절(18 · 22 · 28 세 크기 · 채운 의미 색 넷)도 이 스펙으로 바꿨다.

| 옛 이름(웹 `Badge` · 앱 `PBadge` · HR shadcn) | 새 이름 |
|---|---|
| default · primary · HR default | `solid` + `brand`(브랜드와 닿는 자리만 — 아니면 `solid` `neutral`) |
| secondary | `weak` `neutral` |
| destructive · danger | `solid` `critical` |
| soft — info · success · warning · error(웹) · softInfo · softSuccess · softWarning · softError(앱) | `weak` `informative` · `positive` · `warning` · `critical` |
| softBrand(앱) | `weak` `brand` |
| outline | `outline` `neutral` |
| outline-info · -success · -warning · -error · outlineSuccess … | `outline` `informative` · `positive` · `warning` · `critical` |

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **세 벌** — 웹 `Badge` 19.2 · 알약 · 11/600(`shared/ui/badge.tsx:17-71`, 호출 23), 앱 `PBadge` 17(테두리 있으면 19) · 알약 · 11/700(`shared/widgets/p_badge.dart:14-163`, 호출 31), HR shadcn 22 · 모서리 6 · 12/500(`shared/ui/shadcn/badge.tsx:7-46`, 호출 49). 손으로 만든 배지가 웹 약 40 · 앱 약 15곳이다(모서리 2 · 4 · 알약, 글자 9.5 ~ 12, 굵기 600 ~ 800) — 모두 이 Badge 로. 9.5 · 10 · 10.5 · 11.5px 글자(웹 `CardBenefitPage.tsx:214 · 274 · 495` "단종" · `groo.css:1454-1462` "NEW" · `DutchPayPage.tsx:1860-1910` "결제자")는 medium 11 로 올린다.
- **흐린 줄 안의 배지** — 예정 · 환불 거래의 "예정" · "환불됨" 이 줄 전체 불투명도 0.6 에 함께 흐려져 웹 2.30 · 다크 2.77, 앱 2.39 · 2.87:1 이다(웹 `shared/ui/groo/ledger.tsx:555 · 692-708`, 앱 `features/expense/presentation/widgets/expense_row.dart:84-86 · 124-164`). List 의 "합계에 안 드는 줄" 규칙으로 바꾼다.
- **옅은 배지가 4.5:1 아래** — 웹 info · success · warning · error 4.03 · 4.04 · 3.71 · 3.75(`badge.tsx:36-42`), 앱 soft 3.93 ~ 4.25(`p_badge.dart:141-150`), 할 일 우선순위 3.83 ~ 4.16(웹 `TodoPage.tsx:93-117` · 앱 `todo_meta.dart:49-64`). weak(`fg-*-contrast`)는 5.65 이상이다.
- **다크 outline 테두리가 라이트 색 그대로** — 2.89 ~ 3.12:1(웹 `badge.tsx:46-53` · 앱 `p_badge.dart:153-160`). 브랜드 채움 배지는 다크 표면과 1.73:1.
- **정의 없는 색** — 웹 "현재 기기"(`widgets/account-settings/ui/DevicesSection.tsx:244-258`) · "남은 원금 정리됨"(`AssetDetailDialog.tsx:984-990`)이 없는 토큰(`--border-success` · `--fg-success`)을 불러 테두리 · 색 없는 보통 글자로 보인다. 앱은 outlineSuccess 다.
- **같은 뜻 다른 모양** — "달성"(웹 브랜드 옅은 사각 · 앱 초록 알약 "달성!"), 증권 "기본" · "Pro 시작"(웹 solid · 앱 soft), "연체"(웹 안에서도 사각 · 알약 두 모양 — `DashboardPage.tsx:1862-1875 · 2805-2817`).
- **HR 결재 상태에 다크 짝이 없다** — `shared/lib/vacationStatus.tsx:18-43`(`dark:` 0개)이라 다크 화면에 밝은 알약이 뜬다(바탕 : 표면 13 ~ 15:1). 입금 · 출금 · 통계 "대기" · 현재 결재자도 같다(`culture-dues/ui/DuesTableContent.tsx:181-186` · `VacationRequestStatsItem.tsx:85-138`). 톤으로 옮기면 다크 짝이 생긴다 — 대기 `neutral` · 진행 `informative` · 승인 `positive` · 반려 `critical` · 취소 `neutral`(SEED 톤 표대로 — 앱 적용 때 확인).
- **HR 흰 글자 미달** — 가입 상태 노랑 1.91 · 초록 2.22 · 빨강 3.81, 근무 시간 2.13 ~ 3.75(`admin-users-management/ui/UserTable.tsx:137-170`), destructive 3.76(`badge.tsx:17`), 증감 초록 글자 2.22(`vacation-history/ui/VacationStatsItem.tsx:21`). 근무 시간처럼 뜻 없는 분류 색은 톤이 아니라 글(또는 Tag Group)로 가른다.
- **영어 · 코드값** — HR 역할 코드 `ROLE_ADMIN` 배지(`admin-authority/ui/MobileRoleSelector.tsx:124` · `UserRoleAssignment.tsx:74`) → "관리자", 휴가 정책 코드값 배지(`admin-vacation-plan/ui/VacationPlanPolicyDialog.tsx:122-125`) → 정책 이름, "3 포함된 정책"(`:85-87`) → "정책 3개", 웹 "NEW"(`widgets/constellation/ui/CollectionCard.tsx:132-148`) → "새로", 매수 유의 코드값 폴백(`TossStocksPage.tsx:1157`) → 이름을 못 찾으면 배지를 빼고 기록. 요금제 이름 Pro · Free 는 그대로.
- **누르는 것처럼 보이는 배지** — 웹 `Badge` 의 호버 색(누르지 않는데), 웹 `AssetFilterBadge`(글 + ×, `ExpensePage.tsx:1365-1407`)는 Chip(입력값)으로, 상세 빠른 동작 위의 "연결됨" · "2개"(`shared/ui/groo/detail.tsx:211-215`)는 버튼 이름에 붙어 "연결됨 반복 설정" 으로 읽힌다 — 개수는 Notification Badge 규칙, 말은 버튼 글로.
