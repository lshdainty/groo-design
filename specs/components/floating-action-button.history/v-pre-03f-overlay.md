# Floating Action Button

> 화면 위에 떠 있는 그 화면의 주 동작 하나 — 오른쪽 아래의 브랜드 원 56 에 흰 아이콘 24. 폰(768 미만)의 탭 바가 없는 화면(할 일 · 더치페이)에 둔다. 탭 바가 있는 화면의 추가는 [Bottom Navigation](bottom-navigation.md) 가운데 + 가, 데스크톱의 주 동작은 화면 머리의 [Button](button.md) 이 맡는다.

구조는 당근 [SEED Floating Action Button](https://seed-design.io/components/floating-action-button)(Apache-2.0)을 따른다 — "화면 상에 떠 있으며 주요 액션을 실행하는 버튼" 이고 "화면 내 주요 액션으로 하나만 존재할 수 있습니다". 오른쪽 아래 · 화면 끝과 아래 고정 요소에서 20 · 원 56 · 아이콘 24(SEED 의 아이콘만 모양 — `extended=false`). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). groo 에 처음 두는 스펙이다 — 지금 Desk 웹 · 앱의 52 원(`Fab` · `PFloatingActionButton`)을 정리한다.

수치 원본은 [`floating-action-button.yaml`](floating-action-button.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 할 일 · 더치페이 — 오른쪽 아래 56 원, 라이트 · 다크](../../site/components/specs/floating-action-button.tsx#hero)

### 직접 골라 보기

아이콘 · 아래 고정 요소(없음 · 바닥 버튼) · 안전 영역(홈 표시줄 있음 · 없음) · 스낵바를 고르면 스펙대로 그린 화면과 그 코드가 바뀐다. 목록을 스크롤해도 버튼은 그 자리에 있다.

[그림: 플레이그라운드](../../site/components/specs/floating-action-button.tsx#playground)

## Anatomy

[그림: 원 56 · 아이콘 24, 화면 끝 · 아래에서 20 + 안전 영역](../../site/components/specs/floating-action-button.tsx#anatomy)

| ⓐ Container | 원 56 — 브랜드 채움 · 그림자 s3. |
| ⓑ Icon | 흰 선 아이콘 24 — 보이는 글은 없다. |

[표: 부위](floating-action-button.yaml#slots)

## Properties

### 모양

원 56 · 브랜드 채움(`bg-brand-solid` — Desk 파랑 · HR 초록) · 흰 아이콘 24(`static-white`, 선 2.5) · 그림자 `shadow-s3`. 글을 붙이지 않는다 — 무엇을 하는 버튼인지는 아이콘과 이름(`aria-label`)이 말한다. 색을 바꾸지 않는다(SEED — "색상 변경이 불가능합니다").

[그림: 모양 — 56 원 · 아이콘 24, Desk · HR · 다크](../../site/components/specs/floating-action-button.tsx#shape)

[표: 버튼](floating-action-button.yaml#base.enabled@root)

[표: 아이콘](floating-action-button.yaml#base.enabled@icon)

### 자리

오른쪽 아래다 — 화면 끝에서 20, 아래 끝에서 20. 아래에 고정된 것(바닥 버튼)이 있으면 그 위 끝에서 20 이다. 안전 영역이 있으면 그만큼 더 띄운다(Layout 의 Safe Area — 여백은 안전 영역 경계부터). 스크롤해도 그 자리에 있고 숨거나 접히지 않는다.

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

떠 있는 버튼은 그 화면에서 가장 많이 하는 일 하나다(할 일 추가 · 더치페이 만들기). 화면에 둘 이상 두지 않고, 덜 중요한 동작을 떠 있게 하지 않는다 — 그런 동작은 상단 바 · 화면 안 버튼이다. 아이콘만으로 뜻이 통하는 동작에만 쓴다(추가 + 처럼).

[그림: 하나 — 오른쪽 아래 하나 · 둘을 띄운 화면](../../site/components/specs/floating-action-button.tsx#single-guide)

### 탭 바 · 데스크톱과 겹치지 않게

| 화면 | 주 동작 |
|---|---|
| 폰 · 탭 바가 있는 화면(홈 · 가계부 · 캘린더 · 전체) | 탭 바 가운데 + — 떠 있는 버튼을 두지 않는다 |
| 폰 · 탭 바가 없는 화면(할 일 · 더치페이) | **Floating Action Button** |
| 데스크톱(768 이상) | 화면 머리의 [Button](button.md)(데스크톱 머리의 주 버튼 · 본문 제목 옆) — 떠 있는 버튼을 두지 않는다 |

[그림: 폰 할 일 — 떠 있는 버튼 · 데스크톱 할 일 — 머리의 버튼](../../site/components/specs/floating-action-button.tsx#where-guide)

### 스낵바는 위에

떠 있는 버튼이 있으면 [Snackbar](snackbar.md) 는 그 위 8 에 뜬다(SEED — "Snackbar는 항상 Floating Action Button 위에 표시됩니다") — 버튼을 `SnackbarAvoidOverlap` 으로 감싼다. 목록의 마지막 줄이 버튼에 가리지 않게 목록 아래에 버튼 높이만큼 여백을 둔다(56 + 20 + 20).

[그림: 스낵바는 버튼 위 8 · 마지막 줄 아래 여백](../../site/components/specs/floating-action-button.tsx#stack-guide)

### 이름

보이는 글이 없으니 이름(`aria-label`)이 곧 버튼의 글이다 — 동작 이름("할 일 추가" · "더치페이 만들기"). "추가" · "+" 처럼 무엇을 하는지 모를 이름을 쓰지 않는다.

### 두지 않는 것

- **글이 붙은 모양(Extended)과 스크롤에 따라 접기** — 늘 아이콘만 56 이다(사용자 결정 11B).
- **메뉴를 여는 떠 있는 버튼(스피드 다이얼)** — HR 대시보드에 하나 있다. 앱 적용 때 화면과 함께 정한다.
- **Contextual Floating Button**(SEED — 조건부로 여럿 뜨는 보조 버튼) — 쓸 자리가 아직 없어 들이지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/floating-action-button.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `FloatingActionButton` — 원 56(`<button type="button">`). `icon`(lucide 아이콘) · `aria-label` 필수 · `offsetBottom`(아래 고정 요소의 높이 — 기본 0, 그 위 20 에 선다). 자리(오른쪽 아래 · 20 · 안전 영역)는 스스로 잡는다. 그 밖은 `<button>` 속성.

앱은 같은 값을 Dart 로 둔다(`PFloatingActionButton` — 56 · `tooltip` 대신 `Semantics(button: true, label)`).

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
| 누르기 | 그 화면의 주 동작(추가 시트 · 새 화면) |
| 스크롤 | 그 자리에 그대로 — 숨거나 접히지 않는다 |
| 스낵바가 뜸 | 버튼 위 8 에 뜬다 |
| 화면 키보드가 열림 | 버튼을 가린다 |
| `Tab` | 화면 내용 다음 차례 — 마우스 호버에 누름 색 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 흰 아이콘 `bg-brand-solid` 위 Desk 8.38 · 다크 8.36 · HR 5.06 · 5.06 ✓. 원 면은 화면과 Desk 7.76 · 다크 1.96 · HR 4.69 · 3.24 — 다크에서는 흰 아이콘이 버튼을 알린다. 키보드 포커스 링 Desk 7.76 · 6.90 · HR 4.69 · 7.05 ✓ |
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 목록 아래에 버튼 높이만큼 여백을 둬 마지막 줄이 버튼 밑에 남지 않는다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 56 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 56 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `aria-label` 필수 — 동작 이름("할 일 추가") ✓ |
| **ARIA** | `<button type="button">`(폼 안에서 제출되지 않게) · 아이콘 `aria-hidden`. 앱은 `Semantics(button: true, label)` |

## Do / Don't

### ✅ Do

- 탭 바 없는 폰 화면의 주 동작 하나 — 오른쪽 아래.
- 화면 끝 · 아래 고정 요소에서 20 + 안전 영역.
- 이름은 동작 이름으로.
- 스낵바는 버튼 위에.

### ❌ Don't

- 글을 붙이거나 스크롤에 접기.
- 화면에 둘 이상 · 덜 중요한 동작 · 브랜드 아닌 색.
- 탭 바가 있는 화면 · 데스크톱에 떠 있는 버튼.
- 홈 표시줄에 걸친 자리(안전 영역 무시).

## Specification

`floating-action-button.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Floating Action Button 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — floating-action-button.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#floating-action-button)

## SEED 와 다른 점

- **아이콘만 56 하나** — SEED 코드 기본은 글이 붙은 48(`extended`)이고 스크롤하면 라벨을 숨길 수 있다. groo 는 늘 아이콘만이다(사용자 결정 11B).
- **groo 브랜드 채움** — SEED 는 당근 주황 하나다. Desk 파랑 · HR 초록, 흰 아이콘(대비 8.38 · 5.06 — SEED 주황 위 흰색은 2.94).
- **그림자는 groo `shadow-s3`** — SEED shadow.s3 와 같은 자리(v105).
- **누름 · 호버는 `bg-brand-solid-pressed` + 2px 거리 축소**(v104 · v106).
- **`type="button"`** — SEED 는 `type` 이 없어 폼 안에서 제출된다.
- **여백 20 은 안전 영역 경계부터** — SEED 문서의 20(예제는 16)을 따르고, 안전 영역을 더한다(SEED Safe Area 그림).
- **Menu 타입 · Contextual Floating Button 은 두지 않는다** — 쓸 자리가 아직 없다.
- **z-index 는 specs/z-index.md 의 L1**(`z-sticky` 50).

## Migration notes

### 2026-10-04 — SEED Floating Action Button(아이콘만)으로 새로 둔다

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — SEED 아이콘만 56(11B: 원 56 · 아이콘 24 · `bg-brand-solid` · 흰 아이콘 · 화면에 하나 · 오른쪽 아래, 화면 끝 · 아래 고정 요소에서 20 + 안전 영역 · 이름은 `aria-label`). 글이 붙은 Extended · 스크롤 접힘(11A)과 지금 52(11C)는 고르지 않았다. 탭 바 가운데 + 를 떠 있는 버튼으로 빼는 안(6C)도 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사).

- **Desk 웹** — `shared/ui/groo/fab.tsx:12-33`(할 일 `TodoPage.tsx:734` · 더치페이 `DutchPayPage.tsx:576`, 폰 전체 화면). 52 원 · + 22 · `shadow-lg` · 아래 24 · 오른쪽 18 고정 · z 20 이라 홈 표시줄(34)과 10 겹친다(`fab.tsx:22`, F23). 56 · 24 · 20 + 안전 영역 · z-sticky 로.
- **Desk 앱** — `shared/widgets/p_floating_action_button.dart:10-47`(할 일 `todo_screen.dart:272` · 더치페이 `dutch_pay_screen.dart:60`). 52 · elevation 6 · 아이콘 22 · 오른쪽 16 · 아래 16 + 안전 영역, 이름은 tooltip 뿐이고 버튼 표시가 없다(`PButton` 처럼 Semantics 가 없다).
- **HR 대시보드 SpeedDial** — `shared/ui/speed-dial/SpeedDial.tsx:45` · `DashboardContent.tsx:244`(아래 32 · 오른쪽 32 · z 50, 메뉴 조사 M7). 메뉴를 여는 떠 있는 버튼이라 이 스펙 밖이다 — 앱 적용 때 정한다.
- **쓰지 않는 것** — 앱 `PSpeedDial`(호출 0, F27).
