# Segmented Control

> 같은 내용을 2 ~ 4가지로 바로 거르거나 · 정렬하거나 · 다르게 보는 컨트롤. 그 내용 바로 위에, 한 화면에 하나 둔다. 다른 구역으로 옮기면 [Tabs](tabs.md), 2 ~ 4개 짧은 폼 값은 [Chip](chip.md), 목록 조건을 여럿 걸고 풀면 Chip 의 필터 바다.

구조는 당근 [SEED Segmented Control](https://seed-design.io/components/segmented-control)(Apache-2.0)을 따른다 — 트랙 · 칸 · 글 · 고른 알약. 칸 폭만 porest 가 다시 정했고(칸이 트랙을 똑같이 나눈다), 나머지 값은 porest 토큰이다. SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`segmented-control.yaml`](segmented-control.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 · 할 일 — 라이트 · 다크](../../site/components/specs/segmented-control.tsx#hero)

### 직접 골라 보기

칸 수 · 고른 칸 · 알림 점 · 막힌 칸 · 긴 글을 고르면 스펙대로 그린 컨트롤과 그 코드가 바뀐다. 실제로 누르고 화살표로 옮길 수 있다.

[그림: 플레이그라운드](../../site/components/specs/segmented-control.tsx#playground)

## Anatomy

[그림: 트랙 · 칸 · 글 · 고른 알약 · 알림 점](../../site/components/specs/segmented-control.tsx#anatomy)

| ⓐ Track | 트랙 — 알약. 놓인 자리 폭을 채우고, 칸이 그 폭을 똑같이 나눈다. |
| ⓑ Segment | 칸 — 누르는 자리. 모든 칸이 같은 폭 · 같은 높이다. |
| ⓒ Label | 글 — 짧게. 길면 단어 단위로 줄을 바꾸고 모든 칸이 가장 높은 칸에 맞춘다. |
| ⓓ Indicator | 고른 알약 — 고른 칸 뒤에 깔리고, 다른 칸을 고르면 미끄러져 옮긴다. |
| ⓔ Notification | 알림 점 — 새 내용이 있는 칸에만, 글 오른쪽 위. |

[표: 부위](segmented-control.yaml#slots)

## Properties

크기 · 변형이 하나다. 트랙 안쪽 4 + 칸 34 = 42, 글 16 · 700(고르든 안 고르든), 칸 좌우 12. 칸은 트랙 폭을 칸 수로 똑같이 나누고 최소 폭이 없어, 폰(콘텐츠 폭 312)에서도 4개가 들어간다. 넓은 화면에서는 트랙이 놓인 자리를 채우므로 자리를 좁혀 둔다.

[그림: 폭 — 폰에서 2 · 3 · 4개](../../site/components/specs/segmented-control.tsx#width)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 트랙 `bg-neutral-weak` 위 안 고른 글 `fg-neutral-subtle`, 고른 칸은 흰 알약(`bg-layer-default` + 안쪽 짙은 1px `stroke-neutral-contrast`) 위 `fg-neutral` |
| `hovered` | 웹 — 누름과 같은 바탕(축소 없음) |
| `pressed` | 안 고른 칸 `bg-neutral-weak-pressed` + 1px `stroke-neutral-weak`(글은 `fg-neutral-muted`), 고른 칸 `bg-layer-default-pressed` + 짙은 1px 그대로. 칸 바탕은 그대로 두고 안의 글만 2px 거리로 축소한다 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px — 칸 바깥 |
| `disabled` | 글 `fg-disabled` · 커서 not-allowed — 흐리게 하지 않는다(v106). 고른 채 막히면 칸에 `bg-disabled` + 짙은 1px `stroke-neutral-solid` 를 남긴다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 비활성 × 안 고름 · 고름](../../site/components/specs/segmented-control.tsx#states)

[표: 상태 — 안 고름](segmented-control.yaml#matrix)

[표: 상태 — 고름](segmented-control.yaml#matrix.selected.selected)

[표: 공통](segmented-control.yaml#base.enabled)

[표: 모션](segmented-control.yaml#motion)

## Guidelines

### 같은 내용을 바로 바꿀 때

Segmented Control 은 **조작**이다 — 고르면 화면의 그 내용만 바로 거르거나 · 정렬하거나 · 다르게 보인다(가계부 목록을 전체 · 지출 · 수입으로, 할 일을 오늘 · 이번 주 · 전체 · 완료로, 프리셋을 많이 쓴 순 · 최근 사용 · 이름순으로). 다른 구역 · 페이지로 옮기는 **탐색**에는 쓰지 않는다 — 그건 [Tabs](tabs.md) 다. 저장할 폼 값도 아니다 — 폼 값은 [Chip](chip.md) · [Select](select.md).

[그림: 쓰임 — 같은 내용을 다르게 보기 · 다른 구역으로 옮기기](../../site/components/specs/segmented-control.tsx#role-guide)

### 내용 바로 위에, 한 화면에 하나

자기가 바꾸는 내용 바로 위에 둔다 — 떨어져 있으면 무엇을 바꾸는지 알 수 없다. 한 화면에 하나만 둔다. 같은 모양이 둘이면 어느 것이 어느 내용을 바꾸는지 헷갈린다 — 둘째 축은 Chip(하나 고르기) · Select 로 둔다.

[그림: 자리 — 내용 바로 위 하나 · 한 화면에 둘](../../site/components/specs/segmented-control.tsx#placement-guide)

### 2 ~ 4개, 글은 짧게

칸은 2 ~ 4개다. 5개 이상이면 Chip 의 하나 고르기 줄 · Select 로 둔다. 글은 짧게("이름순" · "최근 사용") — 칸에 비해 글이 길면 줄이 바뀌어 모든 칸이 높아진다. 그러면 다른 컴포넌트를 쓴다.

[그림: 글 — 짧게 · 길어서 두 줄](../../site/components/specs/segmented-control.tsx#label-guide)

## 코드

레시피 `recipes/shadcn/components/ui/segmented-control.tsx` 를 쓴다(라디오 묶음 — 화살표로 옮기면 바로 고른다). 이름은 `aria-label` 로 단다. 늘 하나가 골라져 있어야 하므로 `value`(또는 `defaultValue`)를 준다. 아래 미리보기는 스펙 값으로 그린 모습이다.

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
| Click · Tap | 그 칸을 고르고 내용을 바로 바꾼다. 고른 알약이 200ms 로 미끄러진다. 고른 칸을 다시 눌러도 그대로다. |
| `←` `→` · `↑` `↓` | 이웃 칸으로 옮기며 **바로 고른다**(라디오). 막힌 칸은 건너뛴다. |
| `Tab` | 고른 칸 하나에만 선다. |
| 마우스 호버 | 누름과 같은 바탕(축소 없음). |
| Disabled | 칸 하나 또는 트랙 전체를 막는다 — 누를 수 없다 · 커서 not-allowed · 화살표 이동에서 건너뛴다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 안 고른 글 `fg-neutral-subtle` 트랙 위 5.09 · 4.68, 올리거나 누르는 동안 `fg-neutral-muted` 6.17 · 4.95, 고른 글 `fg-neutral` 알약 위 16.41 · 13.42 · 누름 15.48 · 10.32 ✓. 비활성 `fg-disabled` 는 기준 밖(비활성 UI) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 고른 칸은 알약의 짙은 1px `stroke-neutral-contrast`(트랙과 15.20 · 10.32) ✓ — SEED 의 옅은 1px(1.14 · 1.20)을 바꿨다. 고른 채 막힘 `stroke-neutral-solid` 은 `bg-disabled` 위 3.87 · 3.18 ✓(비활성이라 기준 밖). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 알림 점 `fg-brand` 트랙 위 Desk 7.76 · 4.69 · HR 4.69 · 4.79 ✓ — 고른 칸에는 그리지 않는다 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에 링 2px · 띄움 2px — 칸 바깥 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 34 × 칸 폭 ✓(폰 4개면 칸 폭 76) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 34 ✗(SEED 와 같다) |
| **ARIA** | 트랙 `role="radiogroup"` + `aria-label`, 칸은 라디오(`aria-checked`) — 고른 칸만 `tabindex="0"`. 막힌 칸 `disabled`. 알림 점은 보조 기술에 "새 내용" 을 덧붙인다(점만으로 알리지 않는다) |

## Do / Don't

### ✅ Do

- 같은 내용을 2 ~ 4가지로 바로 바꾸는 자리에 쓰고, 그 내용 바로 위에 둔다.
- 한 화면에 하나.
- 글은 짧게.
- 늘 하나를 골라 둔다.

### ❌ Don't

- 다른 구역 · 페이지로 옮기는 데 쓰기(Tabs).
- 저장할 폼 값으로 쓰기(Chip · Select).
- 한 화면에 둘 이상.
- 5개 이상 · 긴 글.

## Specification

`segmented-control.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Segmented Control 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — segmented-control.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#segmented-control)

## SEED 와 다른 점

- **칸이 트랙 폭을 똑같이 나눈다** — SEED 는 칸 최소 86 · 좌우 24 라 4개(352)가 360 · 375 폰에 들어가지 않는다(SEED 안에서 2 ~ 4개를 허용하는 규칙과 어긋난다). porest 는 최소 폭 없이 칸 수로 나누고 좌우 12 다 — 높이 · 글 · 알약은 SEED 그대로(사용자 결정 2026-10-02).
- **반투명 색을 불투명 짝으로**(v102) — 트랙 `bg-neutral-weak`, 안 고른 칸 누름 테두리 `stroke-neutral-weak`. 고른 알약은 SEED `palette.gray-00`(라이트 흰 · 다크 검정) 대신 `bg-layer-default` — 다크에서도 트랙보다 어둡다. 고른 칸 누름은 `bg-layer-default-pressed`.
- **고른 알약의 테두리를 짙게** — SEED 의 옅은 1px(`stroke.neutral-muted`)는 트랙과 1.14:1 이라 고른 칸이 WCAG 1.4.11 에 못 미친다. 짙은 1px `stroke-neutral-contrast`(15.20 · 10.32:1)로 바꿨다 — Chip(Outline Weak 고름) · Select Box 의 고른 표시와 같은 말이다. 고른 채 막히면 `stroke-neutral-solid`(사용자 결정 2026-10-02).
- **안 고른 칸을 올리거나 누르는 동안 글을 `fg-neutral-muted` 로** — 누름 바탕 위 `fg-neutral-subtle` 이 다크에서 3.91:1 이라서다(List 의 강조 줄과 같은 방법).
- **줄바꿈은 단어 단위**(v114) — SEED 는 글자 단위(`overflow-wrap: break-word`)다.
- **알림 점은 브랜드 글자색**(`fg-brand`)이고, 보조 기술에 "새 내용" 을 덧붙인다. SEED 의 `bg.brand-solid` 짝은 porest 다크에서 트랙과 1.33 · 2.20:1 이라 쓰지 않는다. 고른 칸에는 점을 그리지 않는다.

## Migration notes

### 2026-10-02 — 새로 둔다(SEED Segmented Control)

사용자가 [비교 페이지](https://claude.ai/artifact/F9C58e2o31ErMFjbu9jf4o)에서 Tabs 와 나눠(구역 이동은 Tabs · 같은 내용 조작은 Segmented Control) SEED 모양을 고르고, 칸 폭만 "트랙에 맞춰 똑같이 나눈다"(B)로 정했다. 옛 Tabs 의 container · pills 모양이 하던 거르기 · 정렬 · 보기 자리를 맡는다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사). 같은 내용 조작 34곳(Desk 웹 17 · 앱 16 · HR 1) 중 2 ~ 4개는 Segmented Control, 그보다 많으면 Chip(하나 고르기) · Select 로 간다.

- **Desk 웹 · 앱** — 회색 트랙 탭(웹 26 · 앱 23)이 높이 28 ~ 34 · 모서리 2 ~ 8 · 글 12 ~ 13 · 500 이고, 고른 칸과 트랙이 1.12 · 1.15:1 이다. 다크에서는 고른 칸이 트랙보다 어둡다. 할 일 "오늘 · 이번 주 · 전체 · 완료" 처럼 4개를 폰에 쓰는 자리가 있다.
- **Desk 증권(토스 발견)** — 보유 · 관심 · 발견 + 급상승 · 급하락 · 거래량 + 국내 · 미국이 같은 회색 트랙으로 셋 쌓인다 — 한 화면 하나 규칙에 걸려 앱 적용 때 나눈다.
- **HR 웹** — 보기 전환 버튼 묶음 1곳이 고른 상태를 알리지 않고 칸마다 Tab 이 선다.
