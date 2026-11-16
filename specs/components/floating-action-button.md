# Floating Action Button

> 화면 위에 떠 있는 그 화면의 주 동작 하나입니다 — 오른쪽 아래의 브랜드 원 56 에 흰 아이콘 24 를 둡니다. 폰(768 미만)의 탭 바가 없는 화면(할 일 · 더치페이)에 두고, 탭 바가 있는 화면의 추가는 [Bottom Navigation](bottom-navigation.md) 가운데 + 가, 데스크톱의 주 동작은 화면 머리의 [Button](button.md) 이 맡습니다.

화면에 떠 있으며 주요 동작을 실행하는 버튼이고, 화면에 하나만 둡니다. 오른쪽 아래 · 화면 끝과 아래 고정 요소에서 20 · 원 56 · 아이콘 24 의 아이콘만 있는 모양입니다.

수치 원본은 [`floating-action-button.yaml`](floating-action-button.yaml)입니다.

[그림: 할 일 · 더치페이 — 오른쪽 아래 56 원, 라이트 · 다크](../../site/components/specs/floating-action-button.tsx#hero)

### 직접 골라 보기

아이콘 · 아래 고정 요소(없음 · 바닥 버튼) · 안전 영역(홈 표시줄 있음 · 없음) · 스낵바를 고르면 스펙대로 그린 화면과 그 코드가 바뀝니다. 목록을 스크롤해도 버튼은 그 자리에 있습니다.

[그림: 플레이그라운드](../../site/components/specs/floating-action-button.tsx#playground)

## Anatomy

[그림: 원 56 · 아이콘 24, 화면 끝 · 아래에서 20 + 안전 영역](../../site/components/specs/floating-action-button.tsx#anatomy)

| ⓐ Container | 원 56 — 브랜드 채움 · 그림자 s3 입니다. |
| ⓑ Icon | 흰 선 아이콘 24 — 보이는 글은 없습니다. |

[표: 부위](floating-action-button.yaml#slots)

## Properties

### 모양

원 56 · 브랜드 채움(`bg-brand-solid` — Desk 파랑 · HR 초록) · 흰 아이콘 24(`static-white`, 선 2.5) · 그림자 `shadow-s3` 입니다. 원 · 아이콘은 px 이고 글자 크기를 따르지 않습니다. 글을 붙이지 않습니다 — 무엇을 하는 버튼인지는 아이콘과 이름(`aria-label`)이 말합니다. 색을 바꾸지 않습니다.

[그림: 모양 — 56 원 · 아이콘 24, Desk · HR · 다크](../../site/components/specs/floating-action-button.tsx#shape)

[표: 버튼](floating-action-button.yaml#base.enabled@root)

[표: 아이콘](floating-action-button.yaml#base.enabled@icon)

### 자리

오른쪽 아래입니다 — 화면 끝에서 20, 아래 끝에서 20. 아래에 고정된 것(바닥 버튼)이 있으면 그 위 끝에서 20 입니다. 안전 영역이 있으면 그만큼 더 띄웁니다(Layout 의 Safe Area — 여백은 안전 영역 경계부터). 스크롤해도 그 자리에 있고 숨거나 접히지 않습니다. 쌓임 순서는 [z-index](../z-index.md) 의 L1(`z-sticky` 50)입니다.

[그림: 자리 — 화면 끝 20 · 아래 20 + 홈 표시줄 · 바닥 버튼 위 20](../../site/components/specs/floating-action-button.tsx#placement)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 브랜드 채움 |
| `hovered` | 웹 — `bg-brand-solid-pressed`, 축소 없음 |
| `pressed` | `bg-brand-solid-pressed` + 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 원 바깥 2px 링 |

[표: 상태](floating-action-button.yaml#matrix)

[표: 모션](floating-action-button.yaml#motion)

## Guidelines

### 화면에 하나 — 주 동작만

떠 있는 버튼은 그 화면에서 가장 많이 하는 일 하나입니다(할 일 추가 · 더치페이 만들기). 화면에 둘 이상 두지 않고, 덜 중요한 동작을 떠 있게 하지 않습니다 — 그런 동작은 상단 바 · 화면 안 버튼에 둡니다. 아이콘만으로 뜻이 통하는 동작에만 씁니다(추가 + 처럼).

[그림: 하나 — 오른쪽 아래 하나 · 둘을 띄운 화면](../../site/components/specs/floating-action-button.tsx#single-guide)

### 탭 바 · 데스크톱과 겹치지 않게

| 화면 | 주 동작 |
|---|---|
| 폰 · 탭 바가 있는 화면(홈 · 가계부 · 캘린더 · 전체) | 탭 바 가운데 + — 떠 있는 버튼을 두지 않는다 |
| 폰 · 탭 바가 없는 화면(할 일 · 더치페이) | **Floating Action Button** |
| 데스크톱(768 이상) | 화면 머리의 [Button](button.md)(데스크톱 머리의 주 버튼 · 본문 제목 옆) — 떠 있는 버튼을 두지 않는다 |

[그림: 폰 할 일 — 떠 있는 버튼 · 데스크톱 할 일 — 머리의 버튼](../../site/components/specs/floating-action-button.tsx#where-guide)

### 스낵바는 위에

떠 있는 버튼이 있으면 [Snackbar](snackbar.md) 는 늘 그 위 8 에 뜹니다 — 버튼을 `SnackbarAvoidOverlap` 으로 감쌉니다. 감싸기는 이 부품 안에서 하고, 부르는 화면이 따로 감싸지 않습니다. 화면마다 감싸게 두면 빠뜨린 화면에서 띠가 버튼을 덮기 때문입니다. 목록의 마지막 줄이 버튼에 가리지 않게 목록 아래에 버튼 높이만큼 여백을 둡니다(56 + 20 + 20).

[그림: 스낵바는 버튼 위 8 · 마지막 줄 아래 여백](../../site/components/specs/floating-action-button.tsx#stack-guide)

### 이름

보이는 글이 없으니 이름(`aria-label`)이 곧 버튼의 글입니다 — 동작 이름("할 일 추가" · "더치페이 만들기")을 씁니다. "추가" · "+" 처럼 무엇을 하는지 모를 이름을 쓰지 않습니다.

### 두지 않는 것

- **글이 붙은 모양(Extended)과 스크롤에 따라 접기** — 늘 아이콘만 56 입니다.
- **메뉴를 여는 떠 있는 버튼(스피드 다이얼)** — 이 스펙에 두지 않습니다.
- **Contextual Floating Button**(조건부로 여럿 뜨는 보조 버튼) — 쓸 자리가 없어 두지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/floating-action-button.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `FloatingActionButton` — 원 56(`<button type="button">`)입니다. `icon`(lucide 아이콘) · `aria-label` 필수 · `offsetBottom`(아래 고정 요소의 높이 — 기본 0, 그 위 20 에 섭니다)을 받습니다. 자리(오른쪽 아래 · 20 · 안전 영역)는 스스로 잡습니다. 그 밖은 `<button>` 속성입니다. `type="button"` 이라 폼 안에서 제출되지 않습니다.

앱은 같은 값을 Dart 로 둡니다(`PFloatingActionButton` — 56 · `tooltip` 대신 `Semantics(button: true, label)`).

### 할 일 — 추가

[그림: 할 일 — 오른쪽 아래 + · 스낵바](../../site/components/specs/floating-action-button.tsx#ex-todo)

```tsx
import { Plus } from "lucide-react"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"

<SnackbarAvoidOverlap>
  <FloatingActionButton icon={<Plus />} aria-label="할 일 추가" onClick={openAddTodo} />
</SnackbarAvoidOverlap>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 누르기 | 그 화면의 주 동작(추가 시트 · 새 화면)을 엽니다 |
| 스크롤 | 그 자리에 그대로 있습니다 — 숨거나 접히지 않습니다 |
| 스낵바가 뜸 | 버튼 위 8 에 뜹니다 |
| 화면 키보드가 열림 | 버튼을 가립니다 |
| `Tab` | 화면 내용 다음 차례입니다 — 마우스 호버에 누름 색 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 흰 아이콘 `bg-brand-solid` 위 Desk 8.38 · 다크 8.36 · HR 8.17 · 8.36 ✓. 원 면은 화면과 Desk 7.76 · 다크 1.96 · HR 7.56 · 1.96 — 다크에서는 흰 아이콘이 버튼을 알립니다. 키보드 포커스 링 Desk 7.76 · 6.90 · HR 7.56 · 6.88 ✓ |
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 목록 아래에 버튼 높이만큼 여백을 둬 마지막 줄이 버튼 밑에 남지 않습니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 56 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 56 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `aria-label` 필수 — 동작 이름("할 일 추가") ✓ |
| **ARIA** | `<button type="button">`(폼 안에서 제출되지 않게) · 아이콘 `aria-hidden`. 앱은 `Semantics(button: true, label)` |

## Do / Don't

### ✅ Do

- 탭 바 없는 폰 화면의 주 동작 하나를 오른쪽 아래에 둡니다.
- 화면 끝 · 아래 고정 요소에서 20 + 안전 영역만큼 띄웁니다.
- 이름은 동작 이름으로 씁니다.
- 스낵바는 버튼 위에 띄웁니다.

### ❌ Don't

- 글을 붙이거나 스크롤에 접지 않습니다.
- 화면에 둘 이상 · 덜 중요한 동작 · 브랜드 아닌 색으로 두지 않습니다.
- 탭 바가 있는 화면 · 데스크톱에 떠 있는 버튼을 두지 않습니다.
- 홈 표시줄에 걸친 자리(안전 영역 무시)에 두지 않습니다.

## Specification

`floating-action-button.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Floating Action Button 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — floating-action-button.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#floating-action-button)
