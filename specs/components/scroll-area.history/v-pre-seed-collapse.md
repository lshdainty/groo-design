# Scroll Area

> 고정 폭·고정 높이 컨테이너 안에서 콘텐츠가 넘칠 때 **커스텀 스크롤바**로 스크롤을 제공하는 wrapper. native scrollbar 톤 차이(Win vs macOS)를 통일하고 dark mode·brand 색에 맞춘 스크롤바 시각 제공. Radix `ScrollArea` 베이스 — viewport + scrollbar(track + thumb) 합성.

Porest Scroll Area는 **2 orientations(vertical/horizontal) × 단일 시각 톤** 매트릭스로 정의됩니다. 스크롤바는 `6px` 폭의 얇은 thumb(`border-strong` 색) + transparent track — 콘텐츠 위에 살짝 떠 있는 톤(porest-desk-front 정합). site/preview-html 전역 native scrollbar에도 동일 톤이 글로벌로 적용되어 React `ScrollArea`와 native overflow 영역이 한 톤으로 통일됨. 외곽 wrapper(border/radius)는 사용처가 결정(spec 외 범위), Scroll Area 자체는 viewport + scrollbar만.

## Anatomy

```
┌─────────────────────────────┐ ─┐
│ ⓑ Viewport                  │  │
│ ┌─────────────────────────┐ │  │
│ │ ⓒ children              │ │  │ ⓐ root (h-72 w-48)
│ │ (overflow-hidden)       │ │  │
│ │                         │ │  │
│ └─────────────────────────┘ │  │
│                          ▲▒ │  │  ← ⓓ vertical scrollbar (6px thumb)
└─────────────────────────────┘ ─┘
                            ▲
                            ⓔ thumb (border-strong)
```

| ⓐ root | `<div>` (Radix `ScrollAreaPrimitive.Root`) — `relative overflow-hidden` + 사용처 `h-*`/`w-*` className. |
| ⓑ viewport | Radix `ScrollAreaPrimitive.Viewport` — `h-full w-full rounded-[inherit]`. 실제 스크롤이 동작하는 영역. |
| ⓒ children | 사용처가 결정 — list/grid/text 등. 내부 padding은 자식이 담당(`p-[var(--spacing-lg)]` 등). |
| ⓓ scrollbar | Radix `ScrollAreaPrimitive.ScrollAreaScrollbar` — `flex touch-none select-none transition-colors duration-[var(--motion-duration-fast)]`. vertical: `h-full w-1.5 border-l border-l-transparent`. horizontal: `h-1.5 flex-col border-t border-t-transparent`. |
| ⓔ thumb | Radix `ScrollAreaPrimitive.ScrollAreaThumb` — `relative flex-1 rounded-full bg-border-strong`. 콘텐츠 위치 따라 자동 크기·위치 계산. |
| ⓕ corner | Radix `ScrollAreaPrimitive.Corner` — vertical + horizontal 둘 다 있을 때 우하단 만나는 모서리. transparent 기본. |

**규칙**

- 외곽 wrapper(border/radius)는 사용처가 결정 — Scroll Area 자체는 `border` 없음. `<ScrollArea className="border border-border-default rounded-md">` 패턴.
- viewport `rounded-[inherit]`로 부모 라운드 상속 — 외곽 라운드 깨지지 않게.
- thumb 색은 `border-strong` — `border-default`(1.4:1)보다 강한 시각 식별. 다크 모드에서도 충분한 대비.
- thumb은 `rounded-full` pill — 부드러운 시각 톤. 사각형 thumb은 native 스크롤바 톤이라 회피.
- scrollbar 폭은 `6px` (`w-1.5`/`h-1.5`) — 콘텐츠 위에 살짝 떠 있는 얇은 톤. Toss/porest-desk-front 정합.
- 콘텐츠가 viewport보다 작으면 scrollbar 자동 hide — Radix 기본 동작.
- **전역 native scrollbar 정합**: site/preview-html `@layer base`에 `::-webkit-scrollbar` 6px + `border-strong` pill + transparent track + Firefox `scrollbar-width: thin` + `scrollbar-color`가 모든 overflow 요소에 자동 적용. React `ScrollArea`와 native overflow 영역이 한 톤으로 시각 통일.
- **scrollbar-hide utility**: `.scrollbar-hide` className으로 스크롤바 완전 숨김 opt-in — filter chip carousel, hero banner 등 시각 noise 회피.

## Variants (orientation)

| Variant | 동작 | 사용처 |
|---|---|---|
| `vertical` *(default)* | 세로 스크롤 + 우측 scrollbar | 고정 높이 list, sidebar, dropdown menu 안 긴 옵션. |
| `horizontal` | 가로 스크롤 + 하단 scrollbar | 카드 갤러리, table 가로 스크롤, image strip. |
| `both` | 둘 다 (`<ScrollArea><ScrollBar orientation="vertical" /><ScrollBar orientation="horizontal" /></ScrollArea>`) | 큰 table, 마인드맵 canvas 등. corner 자동 표시. |

## Sizes

Scroll Area는 **size variant 없음** — 사용처 className(`h-*`, `w-*`, `max-h-*`)으로 폭/높이 결정.

[표: 스크롤바 수치](scroll-area.yaml#base.default)

## States

[표: 상태](scroll-area.yaml#matrix)

**규칙**: hover/active state 시각 효과는 minimal(절제) — 스크롤바는 보조 UI라 강조 회피.

## Layout

**List with fixed height**

- 태그 list, recent items, dropdown menu 안 옵션 — `<ScrollArea className="h-72 w-48 border border-border-default rounded-md">`.
- 내부 padding은 자식 `<div className="p-[var(--spacing-lg)]">` (16) 담당.

**Card gallery (horizontal)**

- 카드 가로 스크롤 — `<ScrollArea className="w-full whitespace-nowrap border border-border-default rounded-md"><div className="flex gap-[var(--spacing-md)] p-[var(--spacing-lg)]">{cards}</div></ScrollArea>`.
- `flex` + `gap` + `p-` 토큰 인용 — 사용처에서 모든 layout 토큰 결정.

**Dialog/Drawer 안 긴 본문**

- modal body가 화면 높이 넘으면 — `<ScrollArea className="max-h-[60vh]">{body}</ScrollArea>`. dialog는 자체로 max-height 있는 경우가 많아 ScrollArea 보조.

**Table with both directions**

- 큰 표 — vertical + horizontal scrollbar 동시. `<ScrollArea><Table />...<ScrollBar orientation="horizontal" /></ScrollArea>`. corner 자동.

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Scroll wheel / Touch swipe | native 스크롤 동작 그대로 — Radix가 가로채지 않음. |
| Thumb drag | thumb을 잡고 드래그 — 콘텐츠 위치 이동. Radix `data-state="dragging"` 자동. |
| Click on track | thumb이 그 위치로 점프(또는 native 스크롤). |
| `Tab` (focusable child) | 자식이 focusable일 때 정상 focus. ScrollArea 자체는 focus 대상 아님. |
| Resize | 부모 폭/높이 변경 시 자동 scrollbar 표시/숨김 재계산. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast (thumb × bg) | `border-strong` 2.5:1+ ✓ (light) / 다크 모드도 `border-strong-dark` 자동 swap. |
| **WCAG 2.1.1** Keyboard | native 스크롤은 키보드 `ArrowUp/Down` (focusable child 포함 시) ✓ — Radix가 native 키보드 동작 보존. |
| **WCAG 2.4.7** Focus Visible | ScrollArea 자체는 focus 대상 아님. 내부 자식이 focusable이면 자식 focus ring. |
| **WCAG 2.5.8** Target Size Minimum (AA, 24×24) | thumb 6px — 미달(⚠). 모바일 친화 환경이면 native 스크롤(wheel/swipe)이 primary, thumb drag은 보조. |
| **ARIA** | Radix가 `role`/`aria-orientation`/`aria-controls` 자동. 시각 스크롤이지만 native 스크롤 동작 보존이라 screen reader 호환. |

## Do / Don't

### ✅ Do

- 고정 높이/폭 컨테이너 — 페이지 일부에 스크롤 필요할 때.
- list/grid/text 등 콘텐츠 자체는 일반 layout — ScrollArea는 wrapper만.
- 외곽 border/radius는 사용처가 결정 — `<ScrollArea className="border border-border-default rounded-md">`.
- 내부 padding은 자식이 — `<ScrollArea><div className="p-[var(--spacing-lg)]">{content}</div></ScrollArea>`.

### ❌ Don't

- 페이지 전체에 ScrollArea — body의 native 스크롤이 이미 충분. ScrollArea는 부분 스크롤용.
- viewport 안에 fixed position 자식 — overflow context 파괴, 시각 깨짐.
- thumb 색을 brand primary로 — 스크롤바는 보조 UI라 brand 강조 회피. `border-strong` 절제 톤 유지.
- `border-default`/`border-strong` 사이의 임의 색 — 색 종류 최소화로 시각 위계 보호.

## Migration notes

- `scroll-area.tsx` scrollbar 두께 정정: `w-2.5`/`h-2.5` (10px) → `w-1.5`/`h-1.5` (**6px**). porest-desk-front `index.css` (`@apply w-1.5 h-1.5`) 정합. 사용자 피드백 — "기본은 두꺼움".
- `p-[1px]` 미세 padding 제거 — 6px 두께에선 시각 차이 거의 없고 thumb 영역 hit area도 충분.
- transition 모션 토큰 직접 인용 추가 — `transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]`.
- shadcn 기본 `bg-border` → `bg-border-strong` 정합 — 콘텐츠 위 시각 식별 강화(border-default 1.4:1은 약함).
- **전역 native scrollbar 톤 추가** — `scripts/build-site.mjs` siteCss() + `scripts/build-preview-html.mjs` `<style>` 둘 다 `@layer base`에 `::-webkit-scrollbar`(6px + border-strong pill + transparent track) + Firefox `scrollbar-width: thin` + `scrollbar-color` 부여. React `ScrollArea`와 native overflow 영역이 한 톤. WCAG/ARIA 영향 없음(semantic 유지, native 스크롤 동작 보존).
- **`.scrollbar-hide` utility 신규** — `scrollbar-width: none; -ms-overflow-style: none; ::-webkit-scrollbar { display: none; }` 조합. filter chip carousel 등 시각 noise 회피용 opt-in. site/preview 둘 다 글로벌 등록.
- preview-html에 별도 `.sa-*` CSS 없음 — preview-html 안 일부 카드(`.kpi-grid`, `.ld-*`)의 native overflow는 전역 thin scrollbar 자동 적용.
