# Divider

> 내용 사이를 나누는 1px 선입니다. 같은 묶음 안은 들인 선, 묶음 사이는 끝까지 선을 쓰고, 크게 다른 내용 사이는 선이 아니라 8 간격(회색 바탕 위 흰 층 사이)으로 나눕니다. 반복되는 목록 줄 사이는 [List](list.md) 의 줄 사이 선(필요할 때만)입니다.

1px 선 · 가로 · 세로 · 들임(16)으로 이루어지고, 나누는 세기는 셋(들인 선 · 끝까지 선 · 8 간격)입니다.

수치 원본은 [`divider.yaml`](divider.yaml)입니다.

[그림: 설정 묶음 · 거래 상세 · 통계 세 칸 — 라이트 · 다크](../../site/components/specs/divider.tsx#hero)

### 직접 골라 보기

방향 · 들임 · 장식 여부를 고르면 스펙대로 그린 선과 그 코드, 보조 기술이 읽는지가 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/divider.tsx#playground)

## Anatomy

[그림: 1px 선 — 끝까지 · 양끝 16 들임 · 세로](../../site/components/specs/divider.tsx#anatomy)

| ⓐ Line | 선 — 1px 입니다. 바깥 여백이 없습니다. |

[표: 부위](divider.yaml#slots)

## Properties

### 색 · 두께

선은 하나입니다 — 1px `stroke-neutral-subtle`(흰 바탕 1.15 · 다크 1.30). 굵은 선 · 짙은 선 · 점선을 두지 않습니다 — 더 세게 나눠야 하면 선이 아니라 간격으로 나눕니다(아래 "세 가지 나누기").

[표: 공통](divider.yaml#base.enabled)

### Orientation

`horizontal` *(기본)* 은 세로로 쌓인 내용 사이에 두고, 부모 폭 전체를 채웁니다. `vertical` 은 가로로 놓인 칸 사이(통계 세 칸 · 버튼 묶음)에 두고, 높이는 부모가 정합니다.

[그림: 가로 · 세로 — 통계 세 칸 사이의 세로선](../../site/components/specs/divider.tsx#orientation)

[표: 방향](divider.yaml#orientation)

### Inset

`full` *(기본)* 은 끝까지 긋고, `inset` 은 양끝 16 을 들입니다(세로선은 위아래 16). 같은 묶음 안을 나눌 때 들이고, 묶음 사이 · 액션 영역 위는 끝까지 긋습니다. 화면 여백(24)에 붙은 목록 줄 사이는 Divider 가 아니라 [List](list.md) 의 줄 사이 선(들임 24 — 줄 글과 맞습니다)입니다.

[그림: 끝까지 · 들임](../../site/components/specs/divider.tsx#inset)

[표: 들임](divider.yaml#compound)

### State

상태가 없습니다 — 정적인 선입니다(누르기 · 포커스 없음).

## Guidelines

### 세 가지 나누기

| 세기 | 쓰는 것 | 자리 |
|---|---|---|
| 약함 | 들인 선(`inset`) | 같은 묶음 안 — 상세의 키-값 줄 묶음 · 카드 안 위아래 |
| 중간 | 끝까지 선(`full`) | 묶음 사이 · 액션 영역(바닥 버튼) 위 · 스크롤되는 본문 위 머리 |
| 강함 | 8 간격 — 선이 아니다 | 크게 다른 내용 사이 — 회색 바탕(`bg-layer-basement`) 위에 흰 층(`bg-layer-default`) 묶음을 8 띄워 놓는다 |

"8px 구분선" 은 없습니다 — 두꺼운 회색 막대를 그리지 않고 바탕 층 사이 간격으로 만듭니다.

세기는 상황에 맞게 고릅니다 — 이 표는 고르는 참고이고 화면 규칙이 아닙니다. 어느 화면이 띠(8 간격)로 나뉘는지는 화면마다 고르고, 화면 이름은 DESIGN.md Layout 의 "화면 바탕" 한 곳에 적습니다. 상황 → 고를 것 · 띠 · 카드 · 흰 화면까지 견준 표는 DESIGN.md Layout 의 "화면을 나누는 법" 에 있습니다.

[그림: 들인 선 · 끝까지 선 · 8 간격 — 한 화면](../../site/components/specs/divider.tsx#strength-guide)

### 꼭 필요할 때만

선을 두기 전에 여백 · 제목 · 바탕 층으로 갈리는지 먼저 봅니다. 반복되는 목록 줄은 줄의 위아래 여백이 줄을 가르므로 선이 없는 것이 기본입니다 — 촘촘한 목록에만 [List](list.md) 의 줄 사이 선(같은 1px `stroke-neutral-subtle`)을 둡니다. 메뉴 묶음 사이 · 대화상자 머리 아래(스크롤될 때)의 선도 같은 값입니다. 8 간격도 같습니다 — 같은 성격의 묶음이 이어지면 띠를 끊지 않고 목록 제목으로 가릅니다.

[그림: 여백으로 갈리는 목록 · 줄마다 선](../../site/components/specs/divider.tsx#needed-guide)

### 마지막에는 두지 않습니다

선은 내용 사이에만 둡니다 — 화면 · 묶음의 마지막 요소 아래, 카드 맨 위 · 맨 아래에는 두지 않습니다. 8 간격도 같습니다 — 첫 띠 위 · 마지막 띠 아래에는 틈 · 선 · 빈 띠를 두지 않습니다. 첫 띠는 머리(상단 바 · 가계부 묶음 탭) 바로 아래에 붙고, 띠가 끝난 아래 회색은 바닥이지 구분선이 아닙니다. 시작과 끝에 틈이 들어가면 화면이 어색해 보이기 때문입니다. 8 간격은 띠와 띠 사이에만 있습니다.

[그림: 마지막 묶음 아래 선이 없는 화면 · 있는 화면](../../site/components/specs/divider.tsx#last-guide)

### 장식이 기본

선은 눈으로 묶음을 가르는 장식이라 보조 기술에 숨깁니다 — 묶음은 제목 · 목록 구조로 알립니다. 문서의 장처럼 보조 기술도 "구분선" 을 알아야 하는 자리만 의미 있는 구분선(`role="separator"`)으로 둡니다.

## 코드

레시피 `recipes/shadcn/components/ui/divider.tsx` 의 `Divider` 를 씁니다. `orientation`(`"horizontal"` 기본 · `"vertical"`) · `inset`(기본 `false` — YAML 의 `full`, `true` 면 `inset`) · `decorative`(기본 `true` — 보조 기술에 숨깁니다, `false` 면 `role="separator"`)를 받습니다. `<hr>` 이 아니라 `<div>` 로 그립니다. 위아래 · 좌우 간격은 쓰는 자리가 정합니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 묶음 사이 · 같은 묶음 안

[그림: 거래 상세 — 키-값 묶음 안은 들인 선, 묶음 사이는 끝까지](../../site/components/specs/divider.tsx#ex-basic)

```tsx
import { Divider } from "@/components/ui/divider"

<div>
  <p className="flex justify-between py-x3">결제 수단<span>생활비 카드</span></p>
  <Divider inset />
  <p className="flex justify-between py-x3">할부<span>3개월</span></p>
</div>
<Divider />
<section aria-labelledby="memo-title">…</section>
```

### 세로 — 칸 사이

[그림: 통계 세 칸 — 수입 · 지출 · 남은 돈](../../site/components/specs/divider.tsx#ex-vertical)

```tsx
<div className="flex items-stretch">
  <p className="flex-1 py-x4 text-center">수입<br />{formatWon(income)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">지출<br />{formatWon(expense)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">남은 돈<br />{formatWon(rest)}</p>
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 모든 인터랙션 | 없습니다 — 정적인 선입니다. 포커스가 서지 않습니다 |
| 세로선의 부모에 높이가 없음 | 선이 0 이 됩니다 — 부모(flex)가 높이를 정해야 합니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 선은 장식입니다(흰 바탕 1.15 · 다크 1.30) — 묶음은 여백 · 제목 · 구조가 알립니다. 선만으로 정보를 나르지 않습니다 |
| **WCAG 1.3.1** Info and Relationships | 묶음은 제목(`h2` …) · 목록(`ul`) · `section` 으로 알립니다 — 선에 기대지 않습니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않습니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다 |
| **ARIA** | 기본 `<div aria-hidden="true">`(장식 — 읽지 않습니다). `decorative={false}` 면 `role="separator"` · 세로선은 `aria-orientation="vertical"` |

## Do / Don't

### ✅ Do

- 같은 묶음 안은 들인 선, 묶음 사이는 끝까지 선을 씁니다.
- 크게 다른 내용은 선 대신 8 간격(바탕 층)으로 나눕니다.
- 선은 꼭 필요할 때만, 내용 사이에만 둡니다.

### ❌ Don't

- 두꺼운 선 · 짙은 선 · 8px 회색 막대를 두지 않습니다.
- 목록 줄마다 선 + 여백을 함께 두지 않습니다.
- 화면 · 묶음 마지막 아래에 선을 두지 않습니다.
- 선 색을 자리마다 다르게 두지 않습니다 — 늘 `stroke-neutral-subtle` 하나입니다.

## Specification

`divider.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Divider 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — divider.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#divider)
