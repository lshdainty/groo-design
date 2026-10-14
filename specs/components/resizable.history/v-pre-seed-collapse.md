# Resizable

> 다중 패널을 사용자가 **드래그로 크기 조절** 가능하게 만드는 layout primitive. 코드 에디터의 sidebar/main, 비교 뷰의 좌·우 패널 등 사용자 조절이 의미 있을 때 사용. `react-resizable-panels` 베이스.

Porest Resizable은 **2 directions(horizontal/vertical) × 2 handle styles(plain/withHandle)** 매트릭스로 정의됩니다. Handle은 `1px` 라인 + 4px hit area(`::after` pseudo로 확장) — 시각은 얇지만 hit area는 사용자 친화. `withHandle` 옵션 시 가운데 12×16 grip icon으로 affordance 강화. 색은 `border-default`(라인) + `surface-default`(grip 박스).

## Anatomy

```
horizontal:
┌──────────────┬──────────────┐
│ Panel A      │ Panel B      │
│              │              │
│ (defaultSize │ (defaultSize │
│   = 50)      │   = 50)      │
│              │              │
└──────────────┴──────────────┘
               ▲
               ⓒ handle (1px line, 4px hit area)

horizontal + withHandle:
┌──────────────┬──┬──────────────┐
│ Sidebar      │▒▒│ Main          │
│              │⋮⋮│               │
│              │  │               │
│              │⋮⋮│               │
│              │  │               │
└──────────────┴──┴──────────────┘
                ▲
                ⓓ grip box (12×16, surface + border + grip icon)
```

| ⓐ PanelGroup | `<div>` (`PanelGroup`) — `flex h-full w-full` + `data-[panel-group-direction=vertical]:flex-col`. direction prop으로 horizontal/vertical 분기. |
| ⓑ Panel | `<div>` (`Panel`) — `defaultSize` prop으로 초기 비율. resizable handle 사이 콘텐츠. |
| ⓒ handle (plain) | `<div>` (`PanelResizeHandle`) — `relative flex w-px items-center justify-center bg-border-default` + `::after` pseudo로 hit area 4px 확장. vertical mode는 `h-px w-full`. |
| ⓓ grip box (withHandle 옵션) | `z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border-default bg-surface-default` + 가운데 `GripVertical` 10×10. vertical mode는 `rotate-90`. |
| ⓔ hit area (`::after`) | `absolute inset-y-0 left-1/2 w-1 -translate-x-1/2` — 1px 라인 좌우로 4px 확장 (drag/hover 친화). vertical mode는 `h-1 w-full -translate-y-1/2`. |

**규칙**

- handle 자체는 항상 `1px` — 두꺼운 라인은 layout 시각 noise. 4px hit area는 `::after` pseudo로 표현(시각엔 안 보이지만 마우스/터치엔 보임).
- `withHandle` 옵션은 affordance 필요할 때만 — 명백한 split layout(좌·우 두 패널)이면 plain 1px로 충분. UI 학습 곡선 낮을 땐 grip 추가.
- 색은 `border-default` 라인 + `surface-default` grip 박스 — Toss 톤 절제. brand primary 색 사용 안 함(layout primitive라 brand 강조 회피).
- focus-visible은 `ring-1 ring-ring ring-offset-1` — handle은 키보드 접근 가능(arrow keys로 size 조절).
- Panel 최소/최대 크기는 `minSize`/`maxSize` props로 제한 가능 — 패널이 0으로 collapse 또는 100% 확장되는 극단 회피.

## Variants

### direction

| Variant | 동작 | 사용처 |
|---|---|---|
| `horizontal` *(default)* | 좌·우 패널 + vertical handle | sidebar + main, 비교 뷰, 코드 에디터. |
| `vertical` | 상·하 패널 + horizontal handle | 코드 + 콘솔, 메인 + 미리보기 split. |

### handle style

| Variant | 시각 | 사용처 |
|---|---|---|
| `plain` *(default)* | 1px line + 4px hit area | 명백한 split layout. 시각 가벼움. |
| `withHandle` | 1px line + 12×16 grip box | affordance 필요 — drag 가능함을 즉시 인식. 코드 에디터, 모달 안 split. |

## Sizes

Resizable은 **size variant 없음** — 부모 컨테이너가 폭/높이 결정. Panel `defaultSize` (prop, %)로 초기 비율, `minSize`/`maxSize`로 제한.

[표: 크기와 색](resizable.yaml#base)

## States

[표: 상태별로 바뀌는 값](resizable.yaml#states.direction)

**규칙**: hover/dragging 시각 효과 없음 — handle은 layout primitive라 시각 변화 절제. cursor는 OS native로 충분한 affordance.

## Layout

**Sidebar + Main (horizontal)**

- `<ResizablePanelGroup direction="horizontal"><ResizablePanel defaultSize={25} minSize={15}>Sidebar</ResizablePanel><ResizableHandle /><ResizablePanel defaultSize={75}>Main</ResizablePanel></ResizablePanelGroup>` — 25/75 초기, sidebar 최소 15% 제한.
- 외곽 border + radius는 사용처가 결정 — `<ResizablePanelGroup className="rounded-md border border-border-default">`.

**Code + Console (vertical)**

- 상·하 split — 코드 영역 위 + 콘솔/preview 아래. `direction="vertical"` + `defaultSize={60}` (코드 60%) + `{40}` (콘솔 40%).

**Three panels (horizontal)**

- `<Panel /><Handle /><Panel /><Handle /><Panel />` — sidebar + main + right rail 3분할. handle 2개.

**Nested groups**

- 가로 안 세로 — `<PanelGroup direction="horizontal"><Panel>Side</Panel><Handle /><Panel><PanelGroup direction="vertical">{...}</PanelGroup></Panel></PanelGroup>`. IDE-style 다중 split.

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Mouse drag (handle) | 패널 크기 실시간 조절. cursor: `ew-resize`/`ns-resize` (브라우저 native). |
| Touch drag (handle) | 모바일 친화 — touch action으로 동일 동작. |
| `Tab` (handle focus) | handle에 focus 진입 — `focus-visible:ring` 표시. |
| `ArrowLeft/Right` (horizontal handle focus) | 키보드로 size 조절 (`react-resizable-panels` 기본). |
| `ArrowUp/Down` (vertical handle focus) | 키보드로 size 조절. |
| `Enter` (focus) | 사용처가 결정 — 기본 동작 없음. |
| `Escape` (drag 중) | 드래그 취소(라이브러리에 따라). |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast (handle × bg) | `border-default` 1.4:1 — 단독 약함이나 cursor 변화 + grip box(withHandle) 보강. `withHandle` 옵션 권장. |
| **WCAG 2.1.1** Keyboard | `Tab`/`ArrowLeft/Right`/`ArrowUp/Down` (react-resizable-panels 기본) ✓ |
| **WCAG 2.4.7** Focus Visible | `focus-visible:ring-1 ring-ring ring-offset-1` ✓ (1px ring — handle 얇아 작게) |
| **WCAG 2.5.5** Target Size (AAA, 44×44) | handle 1px — 미달(⚠). hit area 4px도 미달. grip box 12×16도 미달. 모바일 우선이면 [`Bottom Sheet`](bottom-sheet.md)로 토글 분리 권장 (사용자가 직접 크기 조절보단 toggle). |
| **WCAG 2.5.8** Target Size Minimum (AA, 24×24) | 미달(⚠). 데스크탑 친화 컴포넌트 — 모바일에선 신뢰성 낮음. |
| **ARIA** | `react-resizable-panels`가 `role="separator"` + `aria-controls` + `aria-valuenow`/`aria-valuemin`/`aria-valuemax` 자동 부여. screen reader가 size 인식. |

## Do / Don't

### ✅ Do

- 사용자가 **크기 조절이 의미 있을 때** — 코드 에디터, 비교 뷰, IDE-style split.
- 좌·우 명백한 split — `plain` handle로 충분. 시각 가벼움.
- 학습 곡선 낮을 때 — `withHandle`로 affordance 강화(drag 가능 인식).
- `minSize`/`maxSize` 제한 — 패널 0/100% collapse 회피.

### ❌ Don't

- 모바일 친화 화면에 — handle hit area 4px는 터치 친화 아님. 모바일은 [`Bottom Sheet`](bottom-sheet.md) 토글로 분리(옆 패널도 1280 미만은 Bottom Sheet — [Side Panel](side-panel.md)).
- 정적 비율로 충분한 곳에 Resizable — 단순 layout은 `grid`/`flex`로 충분. Resizable은 사용자 조절 필요 시만.
- handle 색을 brand primary로 — layout primitive라 brand 강조 회피. `border-default` 절제 톤 유지.
- 깊은 nested(4+ levels) — UI 복잡도 폭발. 2 levels까지 권장.

## Migration notes

- 기존 `resizable.tsx`는 이미 토큰 정합 — `bg-border-default` line + `bg-surface-default` grip box + `focus-visible:ring`. 변경 없음.
- preview-html에 별도 `.rsz-*` CSS 없음 — site preview/component page에서 직접 렌더. preview-html은 layout demo에 정적 grid/flex 사용(Resizable 시각 demo는 site examples가 SoT).
- focus는 `focus-visible:` (키보드 only) — 이미 정합.
- shadcn 기본 `bg-border` → `bg-border-default` 정합 (Porest 토큰명).
- `react-resizable-panels` 라이브러리 의존 — handle/panel ARIA 자동 부여, 시각만 우리 토큰 정합.
