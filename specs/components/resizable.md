# Resizable

> 화면 안의 크기를 손으로 바꾸는 손잡이입니다 — HR 관리 화면의 목록 | 상세 나누기(목록 폭)에 씁니다. 768 이상의 데스크톱에서만 씁니다. 폰은 나누지 않습니다 — 목록 → 상세 · 탭이고, 옆 패널은 [Side Panel](side-panel.md)(1280 미만은 Bottom Sheet)입니다.

나누기는 보이는 선 1px + 가운데 손잡이 표시 · 누르는 폭 16 · 이름 "목록 너비" · `←` `→` 5% · `Home` · `End` · 목록 20 ~ 40% · 화면마다 폭 기억 · 한 번 누르면 25 ↔ 40 으로 정합니다. 대시보드 위젯 크기 바꾸기는 이 컴포넌트로 하지 않습니다. 키보드는 [WAI-ARIA APG Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) 를 따릅니다.

수치 원본은 [`resizable.yaml`](resizable.yaml)입니다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그립니다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보입니다.

[그림: HR 관리 > 회사 1280 — 부서 나무 25% | 조직도, 손잡이에 초점 — 라이트 · 다크](../../site/components/specs/resizable.tsx#hero)

### 직접 골라 보기

손잡이를 끌거나, 한 번 눌러 25 ↔ 40 으로 바꾸거나, 초점을 두고 `←` `→` · `Home` · `End` · `Enter` 를 눌러 봅니다 — 아래 글이 왼쪽 · 오른쪽 폭과 읽기를 따라갑니다. "화면 다시 열기" 는 기억한 폭으로 엽니다.

[그림: 플레이그라운드](../../site/components/specs/resizable.tsx#playground)

## Anatomy

[그림: 나누기 — 목록 패널 · 선 1px · 가운데 손잡이 4 × 24 · 누르는 폭 16](../../site/components/specs/resizable.tsx#anatomy)

| ⓐ Panel | 목록 패널 — 왼쪽이며 폭이 바뀝니다(20 ~ 40%). 상세 패널은 남는 폭입니다. |
| ⓑ Line | 선 — 1px `stroke-neutral-weak`. 올리거나 초점 · 끄는 동안 짙어집니다. |
| ⓒ Grip | 손잡이 표시 — 선 가운데 4 × 24 `stroke-neutral-solid`. |
| ⓓ Handle | 손잡이 — 선 가운데로 누르는 폭 16. 이름은 "목록 너비" 입니다. |

[표: 부위](resizable.yaml#slots)

## Properties

### 패널 나누기(`split`)

HR 관리 > 역할 · 사용자 · 회사 · 부서 사용자는 목록 | 상세로 나뉘고, 그 사이 손잡이로 목록 폭을 바꿉니다. 목록은 기본 25%(1280 에서 본문 992 의 248)이고 20 ~ 40% 사이에서만 바뀝니다 — 오른쪽 상세는 60% 아래로 줄지 않습니다. 목록을 넓히는 것은 긴 부서 이름 · 깊은 나무를 볼 때입니다.

[그림: 목록 25% 기본 · 20% 최소 · 40% 최대 — 오른쪽은 60% 아래로 줄지 않습니다](../../site/components/specs/resizable.tsx#split)

[표: 나눈 자리 · 목록 패널](resizable.yaml#kind@group+panel)

### 손잡이

선은 1px `stroke-neutral-weak`(흰 면 위 1.23 · 다크 1.56)로 경계만 긋고, 가운데의 손잡이 표시 4 × 24 `stroke-neutral-solid`(4.18 · 다크 4.13 — WCAG 1.4.11 의 3 이상)가 끌 수 있는 자리를 알립니다. 마우스를 올리거나 키보드 초점 · 끄는 동안에는 선 전체가 손잡이 표시와 같은 색으로 짙어집니다. 누르는 폭은 선 가운데로 양쪽 8 — 16 입니다. 768 이상 데스크톱의 마우스 경계라 44 가 아닙니다. 손잡이를 끌지 않고 한 번 눌렀다 떼면(3px 안) 기본 25 ↔ 넓게 40 으로 바뀝니다 — 끌기를 못 하는 사람의 대안(WCAG 2.5.7)입니다.

[그림: 선 1px · 손잡이 표시 4 × 24 · 누르는 폭 16 — 기본 · 호버 · 포커스 · 끄는 중](../../site/components/specs/resizable.tsx#handle)

[표: 손잡이](resizable.yaml#kind@handle)

[표: 선 · 손잡이 표시](resizable.yaml#kind@line+grip)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 선 `stroke-neutral-weak` + 손잡이 표시 `stroke-neutral-solid` |
| `hovered` | 웹 — 선 전체가 `stroke-neutral-solid` · 커서 `col-resize` |
| `focused` | 웹 — 누르는 폭 16 둘레에 링 2px(모서리 4) · 선이 짙어집니다 |
| `pressed` | 끄는 동안 — 선이 짙고, 화면 전체 커서 `col-resize` · 글을 고르지 않습니다 |

[표: 상태 — 나누기](resizable.yaml#matrix@line+focusRing)

[표: 모션](resizable.yaml#motion)

## Guidelines

### 데스크톱에서만

나누기는 768 이상에서만 씁니다 — 768 미만은 나누지 않고 역할 · 사용자는 목록 → 상세, 회사는 탭입니다. 손으로 끄는 패널을 폰에 두지 않습니다 — 옆에 띄우는 작업은 [Side Panel](side-panel.md)(1280 미만은 Bottom Sheet), 여러 줄 칸은 자동 높이입니다([Textarea](textarea.md) — 끌어 늘이는 손잡이가 없습니다).

### 끌지 않아도 됩니다

끌기는 지름길입니다 — 손잡이를 한 번 누르면 25 ↔ 40, 키보드는 `←` `→` 5% · `Home` 20% · `End` 40% · `Enter` 25 ↔ 40 입니다.

[그림: 끌지 않는 길 — 손잡이 한 번 누르기 25 → 40](../../site/components/specs/resizable.tsx#alt-guide)

### 화면마다 폭을 기억합니다

끌거나 누른 목록 폭은 화면마다 브라우저에 기억합니다(localStorage — 키는 화면 이름) — 다시 열면 그 폭입니다. 사이드바의 손으로 접은 상태처럼 사용자의 기기에 남깁니다.

[그림: 회사 화면을 35% 로 넓히고 다시 열기 — 기억한 35%](../../site/components/specs/resizable.tsx#persist-guide)

### 글

손잡이의 이름은 바뀌는 것을 말합니다 — "목록 너비".

## 코드

레시피 `recipes/shadcn/components/ui/resizable.tsx` 를 씁니다(react-resizable-panels 위에 짜도 됩니다 — 손잡이 모양 · 키보드 · 누르기 · 기억은 레시피가 맞춥니다). 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ResizablePanelGroup` — 나눈 자리. `storageKey`(화면마다 폭을 기억할 이름 — 필수)를 받고 가로로만 나눕니다. 768 미만에서는 쓰지 않습니다(화면이 목록 → 상세 · 탭으로 바꿉니다).
- `ResizablePanel` — 목록 패널. `defaultSize`(기본 25) · `minSize`(20) · `maxSize`(40) · `id`. 오른쪽 상세 패널은 `ResizablePanel` 을 하나 더 두고 크기를 적지 않습니다(남는 폭).
- `ResizableHandle` — 손잡이. `label`(이름 — 필수, "목록 너비") · `toggleSize`(누르기 · `Enter` 로 오가는 넓은 폭 — 기본 40). 선 · 손잡이 표시 · 누르는 폭 16 · `role="separator"`(`aria-valuenow` · `aria-valuemin` · `aria-valuemax` · `aria-orientation` · `aria-controls`) · `←` `→` 5% · `Home` · `End` 를 손잡이가 맡습니다.

### HR 관리 — 부서 나무 | 조직도

[그림: 회사 1280 — 목록 25%(부서 나무) | 조직도, 손잡이 "목록 너비"](../../site/components/specs/resizable.tsx#ex-split)

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

{/* 768 이상만 — 목록 20 ~ 40%(오른쪽은 60% 아래로 줄지 않는다), 화면마다 폭을 기억 */}
<ResizablePanelGroup storageKey="hr-admin-company">
  <ResizablePanel id="company-tree" defaultSize={25} minSize={20} maxSize={40}>
    {departmentTree}
  </ResizablePanel>
  <ResizableHandle label="목록 너비" toggleSize={40} />
  <ResizablePanel>{orgChart}</ResizablePanel>
</ResizablePanelGroup>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 손잡이 끌기 | 목록 폭이 포인터를 따라 20 ~ 40% 사이에서 바뀝니다 — 놓으면 그 폭을 기억합니다 |
| 손잡이 한 번 누르기(3px 안) · `Enter` | 기본 25 ↔ 넓게 40 |
| `←` · `→` | 5% 좁히기 · 넓히기 — 끝에서 멈춥니다 |
| `Home` · `End` | 20% · 40% |
| 마우스 올리기 · 초점 | 선이 짙어집니다 · 커서 `col-resize` |
| 다시 열기 | 그 화면에 기억한 폭 — 없으면 25 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 손잡이 표시 `stroke-neutral-solid` 흰 면 위 4.18 · 다크 4.13 ✓. 선 `stroke-neutral-weak`(1.23 · 1.56)는 경계일 뿐입니다 — 손잡이는 표시가 알립니다. 키보드 포커스 링 HR 8.17 · 6.07 ✓ |
| **WCAG 2.1.1** Keyboard | 손잡이 `←` `→` `Home` `End` `Enter` ✓ |
| **WCAG 2.5.7** Dragging Movements | 끌지 않고 손잡이를 한 번 눌러 25 ↔ 40 ✓ |
| **WCAG 2.4.7** Focus visible | 누르는 폭 16 둘레 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 손잡이 16 × 패널 높이 ⚠ — 데스크톱 마우스 경계이고, 같은 일을 키보드 · 누르기로 합니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 손잡이 16 ✗ — 대안은 키보드 · 한 번 누르기입니다 |
| **WCAG 4.1.2** Name, Role, Value | 손잡이 `role="separator"` · 이름 "목록 너비" · `aria-orientation="vertical"` · `aria-valuenow`(목록 %) · `aria-valuemin` 20 · `aria-valuemax` 40 · `aria-controls`(목록 패널) ✓ |
| **Reduced motion** | 폭이 바뀌는 모션이 없습니다(끄는 동안 1:1 · 키보드 · 누르기는 바로) — 그대로 둡니다 |

## Do / Don't

### ✅ Do

- 768 이상 목록 | 상세에서 목록 폭만 바꿉니다 — 20 ~ 40%, 오른쪽은 60% 아래로 줄지 않게 합니다.
- 손잡이 표시를 3 이상의 대비로 보이고, 이름 "목록 너비" 를 답니다.
- 끌지 않는 길을 둡니다 — 한 번 누르기 25 ↔ 40 · 키보드 5%.
- 화면마다 넓힌 폭을 기억합니다.

### ❌ Don't

- 폰에 끄는 패널을 두거나, 세로로 나누거나, 셋 이상으로 나누지 않습니다.
- 손잡이를 배경과 거의 같은 색(대비 1.11)으로 두거나, 누르는 폭을 5 로 좁히거나, 이름 없는 손잡이를 두지 않습니다.
- 오른쪽 패널을 0폭까지 밀거나, 키보드 한 번에 10% 씩 옮기지 않습니다.
- 손잡이를 브랜드 색으로 칠하지 않습니다.
- 대시보드 위젯 크기 바꾸기에 쓰지 않습니다.

## Specification

`resizable.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — HR 웹이 나누기를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — resizable.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#resizable)
