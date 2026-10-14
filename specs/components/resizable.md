# Resizable

> 화면 안의 크기를 손으로 바꾸는 손잡이 — HR 관리 화면의 목록 | 상세 나누기(목록 폭)와 HR 대시보드 편집 모드의 위젯 크기. 768 이상의 데스크톱에서만 쓴다. 폰은 나누지 않는다 — 목록 → 상세 · 탭이고, 옆 패널은 [Side Panel](side-panel.md)(1280 미만은 Bottom Sheet)이다.

SEED 에는 Resizable 이 없다 — 모바일 앱 중심이라 끌어서 나누는 패널이 없다. 그래서 값은 모두 porest 가 정했다(2026-10-10 사용자 결정 12B · 13A) — 나누기는 남기고 고친다(보이는 선 1px + 가운데 손잡이 표시 · 누르는 폭 16 · 이름 "목록 너비" · `←` `→` 5% · `Home` · `End` · 목록 20 ~ 40% · 화면마다 폭 기억 · 한 번 누르면 25 ↔ 40), 위젯 크기도 남기고 고친다(모서리 손잡이 대비 3 이상 · 토큰 색 자리표시 · ⋮ "크기"). 키보드는 [WAI-ARIA APG Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) 다. 옛 Resizable 스펙(가로 · 세로 · 손잡이 상자 12 × 16 · 누르는 폭 4 · hover 변화 없음)과 DESIGN.md v71 의 반대되던 글(손잡이 4 ~ 6px · hover 브랜드 색 · ±1% · "localStorage 권장")을 대신한다.

수치 원본은 [`resizable.yaml`](resizable.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: HR 관리 > 회사 1280 — 부서 나무 25% | 조직도, 손잡이에 초점 · 대시보드 편집 모드의 위젯 크기 — 라이트 · 다크](../../site/components/specs/resizable.tsx#hero)

### 직접 골라 보기

손잡이를 끌거나, 한 번 눌러 25 ↔ 40 으로 바꾸거나, 초점을 두고 `←` `→` · `Home` · `End` · `Enter` 를 눌러 보라 — 아래 글이 왼쪽 · 오른쪽 폭과 읽기를 따라간다. "화면 다시 열기" 는 기억한 폭으로 연다. 위젯은 모서리를 끌거나 ⋮ → 크기를 골라 보라.

[그림: 플레이그라운드](../../site/components/specs/resizable.tsx#playground)

## Anatomy

[그림: 나누기 — 목록 패널 · 선 1px · 가운데 손잡이 4 × 24 · 누르는 폭 16 / 위젯 — 모서리 손잡이 24 · 표식 9 · 끄는 동안 자리표시](../../site/components/specs/resizable.tsx#anatomy)

| ⓐ Panel | 목록 패널 — 왼쪽, 폭이 바뀐다(20 ~ 40%). 상세 패널은 남는 폭이다. |
| ⓑ Line | 선 — 1px `stroke-neutral-weak`. 올리거나 초점 · 끄는 동안 짙어진다. |
| ⓒ Grip | 손잡이 표시 — 선 가운데 4 × 24 `stroke-neutral-solid`. |
| ⓓ Handle | 손잡이 — 선 가운데로 누르는 폭 16. 이름 "목록 너비". |
| ⓔ Widget Handle | 위젯 모서리 손잡이 — 오른쪽 아래 24 × 24, 표식 9 × 9. |
| ⓕ Placeholder | 끄는 동안 자리표시 — 위젯이 놓일 칸. |
| ⓖ Size Menu | 위젯 머리 ⋮ 와 그 "크기" 메뉴 — 끌지 않는 대안. |

[표: 부위](resizable.yaml#slots)

## Properties

### 패널 나누기(`split`)

HR 관리 > 역할 · 사용자 · 회사 · 부서 사용자는 목록 | 상세로 나뉘고, 그 사이 손잡이로 목록 폭을 바꾼다. 목록은 기본 25%(1280 에서 본문 992 의 248)이고 20 ~ 40% 사이에서만 바뀐다 — 오른쪽 상세는 60% 아래로 줄지 않는다. 지금 회사 · 부서 사용자는 오른쪽 최소가 없어 `End` 한 번에 조직도 · 사용자 칸이 0폭이 된다. 나누기를 걷고 25 / 75 로 고정하는 안(12A)은 고르지 않았다 — 긴 부서 이름 · 깊은 나무를 볼 때 목록을 넓힌다.

[그림: 목록 25% 기본 · 20% 최소 · 40% 최대 — 오른쪽은 60% 아래로 줄지 않는다](../../site/components/specs/resizable.tsx#split)

[표: 나눈 자리 · 목록 패널](resizable.yaml#kind@group+panel)

### 손잡이

선은 1px `stroke-neutral-weak`(흰 면 위 1.23 · 다크 1.56)로 경계만 긋고, 가운데의 손잡이 표시 4 × 24 `stroke-neutral-solid`(4.18 · 다크 4.13 — WCAG 1.4.11 의 3 이상)가 끌 수 있는 자리를 알린다. 마우스를 올리거나 키보드 초점 · 끄는 동안에는 선 전체가 손잡이 표시와 같은 색으로 짙어진다. 누르는 폭은 선 가운데로 양쪽 8 — 16 이다. 768 이상 데스크톱의 마우스 경계라 44 가 아니다(사용자 결정 12B — 지금 5). 손잡이를 끌지 않고 한 번 눌렀다 떼면(3px 안) 기본 25 ↔ 넓게 40 으로 바뀐다 — 끌기를 못 하는 사람의 대안(WCAG 2.5.7)이다.

[그림: 선 1px · 손잡이 표시 4 × 24 · 누르는 폭 16 — 기본 · 호버 · 포커스 · 끄는 중](../../site/components/specs/resizable.tsx#handle)

[표: 손잡이](resizable.yaml#kind@handle)

[표: 선 · 손잡이 표시](resizable.yaml#kind@line+grip)

### 위젯 크기(`widget`)

HR 대시보드 편집 모드에서 위젯의 크기를 바꾼다 — 크기 · 위치는 편집 모드에서만 바꾸고 저장 단추로 서버에 저장한다(지금과 같다). 오른쪽 아래 모서리 손잡이는 누르는 자리 24 × 24 · 표식 9 × 9 꺾쇠 2px `stroke-neutral-solid`(카드 면 위 4.18 · 다크 4.13)다. 끄는 동안에는 놓일 칸에 자리표시(옅은 브랜드 바탕 + 1px 브랜드 점선 · 모서리 16)를 보이고, 위젯은 그림자 `shadow-s3` 로 포인터를 따라온다. 끌지 못하는 사람은 위젯 ⋮ 의 "크기" 에서 고른다(아래). 크기를 위젯마다 고정하는 안(13B)은 고르지 않았다.

[그림: 대시보드 편집 — 모서리를 끄는 동안 자리표시 6칸 · ⋮ → 크기](../../site/components/specs/resizable.tsx#widget)

[표: 위젯 격자](resizable.yaml#kind@group)

[표: 모서리 손잡이 · 표식](resizable.yaml#kind@widgetHandle+widgetMark)

[표: 자리표시 · 따라오는 위젯](resizable.yaml#kind@placeholder+ghost)

[표: ⋮ · 크기 메뉴](resizable.yaml#kind@moreButton+sizeMenu)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 선 `stroke-neutral-weak` + 손잡이 표시 `stroke-neutral-solid` |
| `hovered` | 웹 — 선 전체가 `stroke-neutral-solid` · 커서 `col-resize` |
| `focused` | 웹 — 누르는 폭 16 둘레에 링 2px(모서리 4) · 선이 짙어진다 |
| `pressed` | 끄는 동안 — 선이 짙고, 화면 전체 커서 `col-resize` · 글을 고르지 않는다. 위젯은 자리표시 + 따라오는 위젯 |

[표: 상태 — 나누기](resizable.yaml#matrix@line+focusRing)

[표: 상태 — 위젯](resizable.yaml#states.kind)

[표: 모션](resizable.yaml#motion)

## Guidelines

### 데스크톱에서만

나누기는 768 이상에서만 쓴다 — 768 미만은 나누지 않고 역할 · 사용자는 목록 → 상세, 회사는 탭이다(지금과 같다). 손으로 끄는 패널을 폰에 두지 않는다 — 옆에 띄우는 작업은 [Side Panel](side-panel.md)(1280 미만은 Bottom Sheet), 여러 줄 칸은 자동 높이다([Textarea](textarea.md) — 끌어 늘이는 손잡이 없음).

### 끌지 않아도 된다

끌기는 지름길이다 — 손잡이를 한 번 누르면 25 ↔ 40, 키보드는 `←` `→` 5% · `Home` 20% · `End` 40% · `Enter` 25 ↔ 40 이다. 위젯은 ⋮ → "크기" 에서 작게 — 4칸 · 보통 — 6칸 · 넓게 — 8칸 · 가득 — 12칸을 고른다(높이는 그대로). 메뉴는 실행만이라 체크 · 라디오를 두지 않고, 지금 크기 줄에는 설명 "지금 크기" 를 단다([Menu](menu.md)).

[그림: 끌지 않는 길 — 손잡이 한 번 누르기 25 → 40 · 위젯 ⋮ → 크기 메뉴](../../site/components/specs/resizable.tsx#alt-guide)

### 화면마다 폭을 기억한다

끌거나 누른 목록 폭은 화면마다 브라우저에 기억한다(localStorage — 키는 화면 이름) — 다시 열면 그 폭이다. 사이드바의 손으로 접은 상태처럼 사용자의 기기에 남긴다. 위젯 크기는 지금처럼 저장 단추로 서버에 저장한다.

[그림: 회사 화면을 35% 로 넓히고 다시 열기 — 기억한 35%](../../site/components/specs/resizable.tsx#persist-guide)

### 글

손잡이의 이름은 바뀌는 것을 말한다 — "목록 너비". 위젯 ⋮ 는 "{위젯} 더보기", 크기 줄은 "작게 — 4칸" 처럼 크기와 칸 수를 함께 쓴다.

## 코드

레시피 `recipes/shadcn/components/ui/resizable.tsx` 를 쓴다(react-resizable-panels 위에 짜도 된다 — 손잡이 모양 · 키보드 · 누르기 · 기억은 레시피가 맞춘다). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ResizablePanelGroup` — 나눈 자리. `storageKey`(화면마다 폭을 기억할 이름 — 필수)를 받고 가로로만 나눈다. 768 미만에서는 쓰지 않는다(화면이 목록 → 상세 · 탭으로 바꾼다).
- `ResizablePanel` — 목록 패널. `defaultSize`(기본 25) · `minSize`(20) · `maxSize`(40) · `id`. 오른쪽 상세 패널은 `ResizablePanel` 하나 더 — 크기를 적지 않는다(남는 폭).
- `ResizableHandle` — 손잡이. `label`(이름 — 필수, "목록 너비") · `toggleSize`(누르기 · `Enter` 로 오가는 넓은 폭 — 기본 40). 선 · 손잡이 표시 · 누르는 폭 16 · `role="separator"`(`aria-valuenow` · `aria-valuemin` · `aria-valuemax` · `aria-orientation` · `aria-controls`) · `←` `→` 5% · `Home` · `End` 를 손잡이가 맡는다.
- `WidgetResizeHandle` — 위젯 모서리 손잡이(누르는 24 · 표식 9 꺾쇠). 대시보드 격자(react-grid-layout)의 `resizeHandle` 로 넘긴다 — 보조 기술에는 숨긴다. 끄는 동안 자리표시 · 따라오는 위젯의 모양은 레시피의 CSS 가 이 스펙 값으로 덮는다. ⋮ 의 "크기" 는 [Menu](menu.md) 로 짠다.

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

### HR 대시보드 — 위젯 ⋮ 의 크기

[그림: 내 휴가 위젯 ⋮ → 크기 — 작게 · 보통(지금 크기) · 넓게 · 가득](../../site/components/specs/resizable.tsx#ex-widget)

```tsx
import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuTrigger } from "@/components/ui/menu"

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label={`${widget.title} 더보기`}>
      <EllipsisVertical />
    </Button>
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>크기</MenuGroupLabel>
      {/* 끌지 않는 대안 — 누르면 바로 그 폭, 높이는 그대로. 메뉴는 실행만이라 체크가 없다 */}
      {[
        { label: "작게 — 4칸", columns: 4 },
        { label: "보통 — 6칸", columns: 6 },
        { label: "넓게 — 8칸", columns: 8 },
        { label: "가득 — 12칸", columns: 12 },
      ].map((size) => (
        <MenuItem
          key={size.columns}
          label={size.label}
          description={widget.columns === size.columns ? "지금 크기" : undefined}
          onSelect={() => resizeWidget(widget.id, size.columns)}
        />
      ))}
    </MenuGroup>
  </MenuContent>
</Menu>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 손잡이 끌기 | 목록 폭이 포인터를 따라 20 ~ 40% 사이에서 바뀐다 — 놓으면 그 폭을 기억한다 |
| 손잡이 한 번 누르기(3px 안) · `Enter` | 기본 25 ↔ 넓게 40 |
| `←` · `→` | 5% 좁히기 · 넓히기 — 끝에서 멈춘다 |
| `Home` · `End` | 20% · 40% |
| 마우스 올리기 · 초점 | 선이 짙어진다 · 커서 `col-resize` |
| 다시 열기 | 그 화면에 기억한 폭 — 없으면 25 |
| 위젯 모서리 끌기(편집 모드) | 놓일 칸에 자리표시 · 위젯이 따라온다 — 놓으면 그 칸. 저장 단추로 서버에 |
| 위젯 ⋮ → 크기 | 고른 폭(4 · 6 · 8 · 12칸)으로 바로 — 높이는 그대로 · 초점은 ⋮ 로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 손잡이 표시 · 위젯 표식 `stroke-neutral-solid` 흰 면 위 4.18 · 다크 4.13 ✓ · 자리표시 점선 `stroke-brand-solid` 바닥 위 HR 4.69 · 다크 7.05 ✓. 선 `stroke-neutral-weak`(1.23 · 1.56)는 경계일 뿐 — 손잡이는 표시가 알린다. 키보드 포커스 링 HR 5.06 · 6.23 ✓ |
| **WCAG 2.1.1** Keyboard | 손잡이 `←` `→` `Home` `End` `Enter` ✓ · 위젯 크기는 ⋮ 메뉴 ✓ |
| **WCAG 2.5.7** Dragging Movements | 끌지 않고 손잡이를 한 번 눌러 25 ↔ 40 · 위젯은 ⋮ "크기" ✓ |
| **WCAG 2.4.7** Focus visible | 누르는 폭 16 둘레 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 손잡이 16 × 패널 높이 ⚠ — 데스크톱 마우스 경계(사용자 결정 12B), 같은 일을 키보드 · 누르기로 한다 · 위젯 모서리 24 × 24 ✓ · ⋮ 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 손잡이 16 ✗ · 위젯 모서리 24 ✗ — 대안 ⋮ "크기" 44 ✓ |
| **WCAG 4.1.2** Name, Role, Value | 손잡이 `role="separator"` · 이름 "목록 너비" · `aria-orientation="vertical"` · `aria-valuenow`(목록 %) · `aria-valuemin` 20 · `aria-valuemax` 40 · `aria-controls`(목록 패널) ✓. 위젯 모서리 손잡이는 마우스 · 터치용(보조 기술에 숨긴다) — 대안은 ⋮ |
| **Reduced motion** | 폭이 바뀌는 모션이 없다(끄는 동안 1:1 · 키보드 · 누르기는 바로) — 그대로 |

## Do / Don't

### ✅ Do

- 768 이상 목록 | 상세에서 목록 폭만 — 20 ~ 40%, 오른쪽은 60% 아래로 줄지 않게.
- 손잡이 표시를 3 이상의 대비로 보이고, 이름 "목록 너비" 를 단다.
- 끌지 않는 길 — 한 번 누르기 25 ↔ 40 · 키보드 5% · 위젯 ⋮ "크기".
- 화면마다 넓힌 폭을 기억한다.

### ❌ Don't

- 폰에 끄는 패널 · 세로 나누기 · 셋 이상 나누기.
- 손잡이를 배경과 같은 색(1.11)으로 · 누르는 폭 5 · 이름 없는 손잡이.
- 오른쪽 패널을 0폭까지 밀기 · 키보드 한 번에 10%.
- 브랜드 색 손잡이 · 빨간 자리표시 · 끌기로만 바뀌는 위젯 크기.

## Specification

`resizable.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — HR 웹이 나누기 · 위젯 크기를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — resizable.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#resizable)

## SEED 와 다른 점

- **SEED 에는 Resizable 이 없다** — 모바일 앱 중심이라 끌어서 나누는 패널이 없다. 손잡이 · 범위 · 키보드 · 기억 · 위젯 크기는 모두 porest 가 정했다(키보드는 APG Window Splitter).

## Migration notes

### 2026-10-10 — 남기고 고친다

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 정했다 — HR 관리 화면 나누기는 남기고 고친다(12B — 선 `stroke-neutral-weak` + 손잡이 표시 대비 3 이상 · 누르는 폭 16 · 이름 "목록 너비" · `←` `→` 5% · `Home` / `End` · 목록 20 ~ 40% · 오른쪽 60% 아래로 안 줄임 · 화면마다 폭 기억 · 손잡이 누르기로 25 ↔ 40), 대시보드 위젯 크기도 남기고 고친다(13A — 손잡이 대비 3 이상 · 자리표시 토큰 색 · ⋮ "크기"). 나누기를 걷는 안(12A)과 크기 고정(13B)은 고르지 않았다. 비교 페이지 그림의 "크기" 메뉴는 라디오 체크로 그렸는데, Menu 는 실행만이라(2026-10-02 결정) 지금 크기 줄에 설명 "지금 크기" 를 단다. 위젯 ⋮ 는 표 · 줄의 ⋮ 와 같은 Button `ghost` · `iconOnly` · `medium`(40 · 44)이다(그림은 36). 위젯을 옮기는 일의 끌지 않는 대안은 이번 묶음 밖이다. 옛 스펙은 `resizable.history/v-pre-seed-collapse.*` 에 남겼다.

| 옛 Resizable | 새 Resizable |
|---|---|
| 가로 · 세로 · 손잡이 상자(withHandle) 변형 | 가로 나누기 하나(768 이상) + 위젯 크기 |
| 선 1px `border-default` · 손잡이 상자 12 × 16 `surface-default` | 선 1px `stroke-neutral-weak` · 손잡이 표시 4 × 24 `stroke-neutral-solid`(3 이상) |
| 누르는 폭 4(`::after`) | 16 |
| hover · 끌기 모양 변화 없음 | 올리기 · 초점 · 끌기에 선이 짙어진다 |
| 키보드 라이브러리 기본(10%) · 링 1px | `←` `→` 5% · `Home` · `End` · `Enter` 25 ↔ 40 · 링 2px |
| 크기 제한은 사용처 · 저장 언급 없음 | 목록 20 ~ 40% · 화면마다 기억 |
| (DESIGN v71) 손잡이 4 ~ 6px · hover 브랜드 색 · ±1% · snap 25 / 50 / 75% · "localStorage 권장" | 이 스펙으로 바꿨다 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — HR 은 1280 × 800 렌더로 쟀다). Desk 웹 · 앱 · SSO 에는 나누기가 없다.

- **HR 손잡이(R1 ~ R4)** — 선 · 손잡이 상자가 모두 `bg-border` #EEEEEE 라 패널 바탕 #FAFAFA 위 1.11(다크 1.34), 손잡이 상자 12 × 16 · 아이콘 10, 누르는 폭 5px, 이름 · `aria-orientation` 0, 키보드 한 번에 10%, hover · 끌기 모양 변화 0 이다(`shared/ui/shadcn/resizable.tsx:42-49`, D7). 회사 · 부서 사용자는 오른쪽 최소가 없어 `End` 한 번에 조직도 · 사용자 칸이 0폭이 된다(`features/admin-company/ui/CompanyContent.tsx:116-140` · `features/admin-users-department/ui/DepartmentContent.tsx:137-178`, D7). 넓힌 폭은 저장하지 않는다(`autoSaveId` 0). 역할 · 사용자는 20 ~ 40% 가 맞다(`features/admin-authority/ui/RoleManagementPanel.tsx:282-310` · `UserManagementPanel.tsx:124-152`).
- **HR 대시보드 위젯(R5)** — 손잡이 20 × 20 · 표식 5 × 5 꺾쇠 2px `rgba(0,0,0,.4)` 가 흰 카드 위 2.85 · 다크 1.14, 끄는 동안 자리표시가 라이브러리 기본 빨강 20%, 키보드로는 바꿀 수 없다(`features/dashboard/ui/DashboardContent.tsx:206-240`, D17).
- **곁가지** — HR `package-lock.json` 의 `react-grid-layout` 1.5.3 은 npm 이 내려 둔 판이다("ships stray files … an ip_fetcher binary"). 1.5.4 는 그 파일만 뺀 같은 코드라 올린다 — 이 결정과 상관없이.
- **스펙 글** — DESIGN.md v71 Resizable 이 이 스펙과 반대였다(조사 S7) — "펼치고 접기 · 나누기" 절로 바꿨다.

### 이전 기록

- **2026-05 — shadcn 그대로.** `bg-border-default` 선 + `surface-default` 손잡이 상자로 토큰 이름만 맞췄다. 이번에 모두 바뀌었다.
