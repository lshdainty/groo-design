# Segmented Control

> 같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 컨트롤입니다. 그 내용 바로 위에, 한 화면에 하나 둡니다. 다른 구역으로 옮기면 [Tabs](tabs.md), 2 ~ 4개 짧은 폼 값은 [Chip](chip.md), 목록 조건을 여럿 걸고 풀면 Chip 의 필터 바를 씁니다.

트랙 · 칸 · 글 · 고른 알약으로 이뤄지고, 칸이 트랙을 똑같이 나눕니다.

수치 원본은 [`segmented-control.yaml`](segmented-control.yaml)입니다.

[그림: 가계부 · 할 일 — 라이트 · 다크](../../site/components/specs/segmented-control.tsx#hero)

### 직접 골라 보기

칸 수 · 고른 칸 · 알림 점 · 막힌 칸 · 긴 글을 고르면 스펙대로 그린 컨트롤과 그 코드가 바뀝니다. 실제로 누르고 화살표로 옮길 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/segmented-control.tsx#playground)

## Anatomy

[그림: 트랙 · 칸 · 글 · 고른 알약 · 알림 점](../../site/components/specs/segmented-control.tsx#anatomy)

| ⓐ Track | 트랙 — 알약입니다. 놓인 자리 폭을 채우고, 칸이 그 폭을 똑같이 나눕니다. |
| ⓑ Segment | 칸 — 누르는 자리입니다. 모든 칸이 같은 폭 · 같은 높이입니다. |
| ⓒ Label | 글 — 짧게 씁니다. 길면 단어 단위로 줄을 바꾸고 모든 칸이 가장 높은 칸에 맞춥니다. |
| ⓓ Indicator | 고른 알약 — 고른 칸 뒤에 깔리고, 다른 칸을 고르면 미끄러져 옮깁니다. |
| ⓔ Notification | 알림 점 — 새 소식이 있는 칸에만, 글 오른쪽 위에 둡니다. |

[표: 부위](segmented-control.yaml#slots)

## Properties

크기 · 변형이 하나입니다. 트랙 안쪽 4 + 칸 34 = 42, 글 16 · 700(고르든 안 고르든 — 글자 크기 설정을 따르지 않는 `t5-static`), 칸 좌우 12 입니다. 칸은 트랙 폭을 칸 수로 똑같이 나누고 최소 폭이 없어, 폰(콘텐츠 폭 312)에서도 4개가 들어갑니다. 넓은 화면에서는 트랙이 놓인 자리를 채우므로 자리를 좁혀 둡니다. 320 보다 좁은 화면(페이지 확대)에서도 글은 위 규칙대로 낱말 사이에서 줄을 바꾸고(모든 칸이 가장 높은 칸에 맞춤), 칸이 **가장 긴 낱말**보다 좁아질 때만 낱말 안에서 꺾지 않고 줄 전체를 가로로 스크롤합니다(Layout 의 "지원 폭").

[그림: 폭 — 폰에서 2 · 3 · 4개](../../site/components/specs/segmented-control.tsx#width)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 트랙 `bg-neutral-weak-alpha`(투명 — 어느 바탕에서나 보입니다) 위 안 고른 글 `fg-neutral-subtle`(다크는 `fg-neutral-muted` — 투명 트랙 위 4.5:1 을 지키려고), 고른 칸은 흰 알약(`bg-layer-default` + 안쪽 짙은 1px `stroke-neutral-contrast`) 위 `fg-neutral` |
| `hovered` | 웹 — 누름과 같은 바탕(축소 없음) |
| `pressed` | 안 고른 칸 `bg-neutral-weak-pressed` + 1px `stroke-neutral-weak`(글은 `fg-neutral-muted`), 고른 칸 `bg-layer-default-pressed` + 짙은 1px 그대로. 칸 바탕은 그대로 두고 안의 글만 2px 거리로 축소합니다 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px — 칸 바깥 |
| `disabled` | 글 `fg-disabled` · 커서 not-allowed — 흐리게 하지 않습니다. 고른 채 막히면 칸에 `bg-disabled` + 짙은 1px `stroke-neutral-solid` 를 남깁니다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/segmented-control.tsx#states)

[표: 상태 — 안 고름](segmented-control.yaml#matrix)

[표: 상태 — 고름](segmented-control.yaml#matrix.selected.selected)

[표: 공통](segmented-control.yaml#base.enabled)

[표: 모션](segmented-control.yaml#motion)

## Guidelines

### 같은 내용을 바로 바꿀 때

Segmented Control 은 **조작**입니다 — 고르면 화면의 그 내용만 바로 거르거나 · 정렬하거나 · 다르게 보입니다(프리셋을 많이 쓴 순 · 최근 사용 · 이름순으로, 더치페이를 진행 중 · 완료 · 친구로). 다른 구역 · 페이지로 옮기는 **탐색**에는 쓰지 않습니다 — 그건 [Tabs](tabs.md) 입니다. 저장할 폼 값도 아닙니다 — 폼 값은 [Chip](chip.md) · [Select](select.md) 를 씁니다.

[그림: 쓰임 — 같은 내용을 다르게 보기 · 다른 구역으로 옮기기](../../site/components/specs/segmented-control.tsx#role-guide)

비슷한 셋은 이렇게 견줍니다. 폼 값 · 설정 값을 고르는 표는 Select 의 ["고르는 컴포넌트 고르기"](select.md#고르는-컴포넌트-고르기) 한 곳에 있습니다.

| | Segmented Control | [Chip](chip.md) 필터 바 | [Tabs](tabs.md) |
|---|---|---|---|
| 핵심 용도 | 같은 내용을 거르기 · 정렬 · 다르게 보기 | 조건을 여럿 걸고 풀기 | 다른 구역 · 화면으로 옮기기 |
| 위치 | 바꾸는 내용 바로 위 | 목록 위 한 줄(가로 스크롤 · 끝 흐림) | 화면 · 구역 맨 위 |
| 영향 범위 | 그 내용만 | 그 목록만 | 아래 전체 |
| 개수 | 2 ~ 4 | 정해지지 않음 · 개수가 바뀜 | 1차 Fill 5개까지 |
| 한 화면에 | 하나 — 둘째 축은 Chip 하나 고르기 · Select | 하나 | 1차 하나 + 2차 Chip Tabs |

### 내용 바로 위에, 한 화면에 하나

자기가 바꾸는 내용 바로 위에 둡니다 — 떨어져 있으면 무엇을 바꾸는지 알 수 없습니다. 한 화면에 하나만 둡니다. 같은 모양이 둘이면 어느 것이 어느 내용을 바꾸는지 헷갈립니다 — 둘째 축은 Chip(하나 고르기) · Select 로 둡니다.

[그림: 자리 — 내용 바로 위 하나 · 한 화면에 둘](../../site/components/specs/segmented-control.tsx#placement-guide)

### 머리 오른쪽에 둘 때

카드 · 구역 머리의 오른쪽(제목과 같은 줄)에 두면 트랙이 자리를 채우지 않고 **내용 폭**입니다 — 모든 칸이 가장 긴 칸 글에 칸 좌우 여백을 더한 같은 폭이고, 트랙은 그 칸들에 안쪽 여백을 더한 폭입니다(셈은 `segmented-control.yaml` 의 `root.width` 비고). 칸 글은 글자 크기를 따르지 않으므로 큰 글자에서도 폭이 그대로입니다. 제목은 머리 폭의 절반 이상을 지킵니다 — 그 자리가 남지 않으면 Segmented 가 머리 아래 줄 오른쪽 끝으로 내려갑니다. [List](list.md) 목록 제목 · Card 머리 동작의 반 폭 판정과 같은 결입니다(예: 통계 고정 탭 월별 "지출 · 수입"). 머리 오른쪽에 둬도 "자기가 바꾸는 내용 바로 위" 입니다 — 머리 아래가 곧 그 내용일 때만 둡니다.

### 2 ~ 4개, 글은 짧게

칸은 2 ~ 4개입니다. 5개 이상이면 Chip 의 하나 고르기 줄 · Select 로 둡니다. 글은 짧게 씁니다("이름순" · "최근 사용") — 칸에 비해 글이 길면 줄이 바뀌어 모든 칸이 높아집니다. 그러면 다른 컴포넌트를 씁니다.

예외 하나 — 증권 차트의 기간(1일 · 1주 · 1개월 · 3개월 · 1년)만 5칸이고 칸 좌우는 4 입니다. 짧은 글 다섯이 한 줄에 서야 차트와 함께 읽히기 때문입니다. 다른 자리로 넓히지 않습니다 — 5개 이상은 위 규칙대로 Chip · Select 입니다.

[그림: 글 — 짧게 · 길어서 두 줄](../../site/components/specs/segmented-control.tsx#label-guide)

## 코드

레시피 `recipes/shadcn/components/ui/segmented-control.tsx` 를 씁니다(라디오 묶음 — 화살표로 옮기면 바로 고릅니다). 이름은 `aria-label` 로 답니다. 늘 하나가 골라져 있어야 하므로 `value`(또는 `defaultValue`)를 줍니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

[그림: 보기 — 할 일](../../site/components/specs/segmented-control.tsx#ex-basic)

```tsx
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"

<SegmentedControl aria-label="할 일 보기" value={view} onValueChange={setView}>
  <SegmentedControlItem value="today">오늘</SegmentedControlItem>
  <SegmentedControlItem value="week">이번 주</SegmentedControlItem>
  <SegmentedControlItem value="all">전체</SegmentedControlItem>
  <SegmentedControlItem value="done">완료</SegmentedControlItem>
</SegmentedControl>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click · Tap | 그 칸을 고르고 내용을 바로 바꿉니다. 고른 알약이 200ms 로 미끄러집니다. 고른 칸을 다시 눌러도 그대로입니다. |
| `←` `→` · `↑` `↓` | 이웃 칸으로 옮기며 **바로 고릅니다**(라디오). 막힌 칸은 건너뜁니다. |
| `Home` · `End` | 받지 않습니다 — 초점도 고른 칸도 그대로, 화면도 스크롤되지 않습니다(`PageUp` · `PageDown` 도). 첫 · 끝 칸으로는 화살표로 갑니다 — 진짜 라디오 · WAI-ARIA APG Radio Group 과 같습니다. Tabs 는 Home · End 로 옮기며 고릅니다. |
| `Tab` | 고른 칸 하나에만 섭니다. |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| Disabled | 칸 하나 또는 트랙 전체를 막습니다 — 누를 수 없고 · 커서 not-allowed · 화살표 이동에서 건너뜁니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral-subtle` 트랙 위 — 트랙이 투명해 놓인 바탕에 따라 다릅니다: 라이트 흰 면 4.95 · 회색 바닥 4.59, 다크 바닥 4.68 ✓ · 다크는 `fg-neutral-muted` 로 한 단계 짙게 — 다크 카드(`bg-layer-default`) 5.18 · 다크 시트(`bg-layer-floating`) 4.50 · 다크 바닥 5.93 ✓(subtle 이면 4.09 · 3.56). 올리거나 누르는 동안 `fg-neutral-muted` 6.17 · 4.95, 고른 글 `fg-neutral` 알약 위 16.41 · 13.42 · 누름 15.48 · 10.32 ✓. 비활성 `fg-disabled` 는 기준 밖입니다(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고른 칸은 알약의 짙은 1px `stroke-neutral-contrast`(트랙과 라이트 13.71 ~ 14.79 · 다크 7.84 ~ 10.33) ✓. 고른 채 막힘 `stroke-neutral-solid` 은 `bg-disabled` 위 3.87 · 3.18 ✓(비활성이라 기준 밖). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. 알림 점 `fg-brand` 트랙 위 Desk 라이트 7.00 ~ 7.55 · 다크 3.56 ~ 4.69 · HR 라이트 6.82 ~ 7.36 · 다크 3.55 ~ 4.67 ✓ — 고른 칸에는 그리지 않습니다 |
| **WCAG 1.4.4** Resize text | 칸 글은 예외입니다 — `t5-static` 16 이라 글자 크기 설정을 따르지 않습니다(웹 `text-t5-static` · 앱 `TextScaler.noScaling`). 칸이 트랙을 나눠 폰 4칸이 76(글 자리 52)이라, 글자를 따라 키우면 200% 에서 "오 / 늘" · "이 / 번 / 주" 처럼 한 글자씩 세로로 쪼개지기 때문입니다. 하단 탭 라벨과 같은 대가입니다(DESIGN.md 의 -static 목록). 고른 칸이 바꾼 아래 내용은 커지는 글로 보입니다. 알림 점도 px 그대로입니다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px · 띄움 2px — 칸 바깥에 그립니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 34 × 칸 폭 ✓(폰 4개면 칸 폭 76) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 34 ✗ |
| **ARIA** | 트랙 `role="radiogroup"` + `aria-label`, 칸은 라디오(`aria-checked`) — 고른 칸만 `tabindex="0"`. 막힌 칸 `disabled`. 알림 점은 보조 기술에 "새 소식" 을 덧붙입니다(점만으로 알리지 않습니다 — Tabs · Chip Tabs · 하단 탭 바와 같은 말) |

## Do / Don't

### ✅ Do

- 같은 내용을 2 ~ 4가지로 바로 바꾸는 자리에 쓰고, 그 내용 바로 위에 두기.
- 한 화면에 하나.
- 글은 짧게.
- 늘 하나를 골라 두기.

### ❌ Don't

- 다른 구역 · 페이지로 옮기는 데 쓰기(Tabs).
- 저장할 폼 값으로 쓰기(Chip · Select).
- 한 화면에 둘 이상.
- 5개 이상 · 긴 글.

## Specification

`segmented-control.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Segmented Control 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — segmented-control.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#segmented-control)
