# Accordion

> 콘텐츠를 펼치고 접을 수 있는 vertical disclosure 컴포넌트. FAQ, 상세 정보, 긴 form section을 시각적으로 압축. Radix `Accordion` 베이스(키보드 nav + `ArrowUp/Down` + `Home/End` + animation).

Porest Accordion은 **2 types(single/multiple) × FAQ-style layout** 매트릭스로 정의됩니다. site SoT 정합 — 외곽 wrapper 없이 각 item이 `border-bottom`로만 분리. Trigger는 `text-title-sm` + 500, Content는 `text-body-md` + `text-secondary`. 큰 수직 padding(`spacing-lg` 16)으로 한국어 본문 읽기 편한 여백. 우측 chevron이 open 시 180° 회전.

## Anatomy

```
┌────────────────────────────────────────────┐
│ ⓑ Trigger (title-sm 500, py-lg)      ⓒ ▼  │
│                                            │
│ ⓓ Content (body-md text-secondary, pb-lg)  │
│   open 상태만 표시                          │
├────────────────────────────────────────────┤ ← ⓐ border-bottom border-default
│ ⓑ Trigger                            ⓒ ▼  │
├────────────────────────────────────────────┤
│ ⓑ Trigger                            ⓒ ▼  │
└────────────────────────────────────────────┘
```

| ⓐ AccordionItem | `<div>` — `border-b border-border-default`. 외곽 container 없음. |
| ⓑ AccordionTrigger | `flex flex-1 items-center justify-between py-[var(--spacing-lg)] text-title-sm font-medium text-text-primary text-left transition-[color] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]` + hover `hover:text-text-secondary` (또는 underline 옵션). |
| ⓒ chevron | `ChevronDown` 16×16 + `text-text-secondary` + `transition-transform duration-[var(--motion-duration-base)]`. open(`data-state=open`) 시 `rotate-180`. |
| ⓓ AccordionContent | `overflow-hidden text-body-md text-text-secondary` + Radix animate (`animate-accordion-down/up`). 내부 wrapper `pb-[var(--spacing-lg)] pt-0`. |
| ⓔ focus ring | trigger `focus-visible:ring-2 ring-ring ring-offset-2 rounded-xs`. |

**규칙**

- 외곽 container 없는 FAQ 스타일 — list 안에서 자연스럽게 흐름.
- Trigger 전체가 클릭 가능 — 텍스트와 chevron 모두 포함하는 hit area.
- Item 사이 separator는 `border-bottom`만 — outer border + radius는 site SoT 아님(card-style 원하면 외곽 wrapper로 감쌀 수 있으나 spec 기본은 plain).
- Content 안 `pt-0 pb-lg` — trigger와 content 사이는 자연스러운 흐름(`pt-0`), content와 다음 item 사이는 `pb-lg`로 여유.
- chevron rotation은 `motion-duration-base`(200ms) — 본문 펼침의 자연스러운 속도.

## Variants (type)

| Type | 동작 | 사용처 |
|---|---|---|
| `single` *(default)* | 한 번에 1개만 open. `collapsible` 옵션으로 닫기 허용. | FAQ, 단일 선택 가이드 — 사용자가 한 번에 한 정보만 집중. |
| `multiple` | 여러 개 동시 open 가능. | 비교 가능한 정보, 긴 form section — 사용자가 여러 정보 병렬 확인. |

Type은 Radix `type` prop으로 결정. Accordion 자체 시각 spec은 동일.

## Sizes

Accordion은 **size variant 없음** — 단일 spec. 사용처에서 `max-width` className으로 폭 조정.

[표: 크기와 색](accordion.yaml#base.closed)

[표: 전환](accordion.yaml#motion)

## States

### Trigger

[표: 트리거 상태](accordion.yaml#matrix)

### Content

| State | 동작 | 시각 |
|---|---|---|
| `closed` | unmounted (Radix `data-state=closed`) | `animate-accordion-up` (height 0으로 축소) |
| `open` | rendered (Radix `data-state=open`) | `animate-accordion-down` (height auto로 확장) |

motion: Radix CSS variable `--radix-accordion-content-height`로 정확한 높이 계산. `motion-duration-base` (200ms) + `motion-ease-out`.

## Layout

**FAQ pattern (기본)**

- `max-w-lg` 또는 `max-w-2xl` 본문 폭. 단독 sectioning element 안에 배치.
- 4–8개 item 권장. 그 이상은 카테고리 분리 또는 검색.
- Trigger는 명사형(짧음) 또는 의문형 — "접근성 가이드 어디 있나요?" / "주요 기능".

**Within Card**

- Card 안에 Accordion 배치 시 Card padding이 외곽 — Accordion은 plain FAQ로 유지(card-style 외곽 wrapper 회피).

**Settings / Form sections**

- `multiple` type — 여러 section 동시 펼침. 긴 form을 시각적으로 압축.

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Trigger click | open/close 토글. `collapsible: true` 시 single type도 닫기 가능. |
| `Enter` / `Space` (trigger focus) | 토글. |
| `Tab` | trigger 사이 focus 이동. content 안 focusable element도 순서대로. |
| `ArrowDown` / `ArrowUp` | trigger 사이 focus 이동 (Radix). |
| `Home` / `End` | 첫/마지막 trigger focus. |
| Animation | open 시 height 0→auto 부드럽게 (Radix CSS variable + keyframes). |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast (trigger × bg-page) | `text-primary` 14:1+ ✓ |
| **WCAG 1.4.3** Color contrast (content × bg-page) | `text-secondary` 9.2:1 ✓ |
| **WCAG 1.4.11** Non-text contrast (border-bottom × bg-page) | `border-default` 1.4:1 — 약함이나 여백/타이포로 시각 식별 보강. focus 시 `ring-2 ring-ring` 4.5:1+ ✓ |
| **WCAG 2.1.1** Keyboard | `Tab`/`Enter`/`Space`/`Arrow`/`Home`/`End` 모두 가능 ✓ |
| **WCAG 2.4.7** Focus Visible | `focus-visible:ring-2 ring-ring ring-offset-2 rounded-xs` ✓ |
| **WCAG 2.5.5** Target Size (AAA, 44×44) | trigger 높이 ≈ 24+16+16 = 56px ✓ — 큰 수직 padding으로 충족. |
| **WCAG 2.5.8** Target Size Minimum (AA, 24×24) | ✓ |
| **ARIA** | Radix가 `role="region"` (content) + `aria-controls` / `aria-expanded` (trigger) + `role="button"` (trigger) 자동. 헤딩 시맨틱은 사용처에서 H3/H4 wrap 권장. |

## Do / Don't

### ✅ Do

- FAQ / settings / 긴 form section처럼 **압축이 의미 있는** 곳에 사용.
- Trigger 텍스트는 짧고 명확하게 — "주요 기능" / "디자인 철학" (의문형도 OK).
- single type은 사용자 한 정보 집중, multiple type은 비교/병렬 확인.
- chevron 회전은 시각적 affordance — open/close 상태 즉시 식별.
- Content 안에 markdown/link/list 등 풍부한 텍스트 OK — body-md `line-height: 1.6` 가독성 보장.

### ❌ Don't

- 콘텐츠가 짧을 때 accordion 사용 — 그냥 visible로 충분. 인터랙션 비용↑.
- Content 안에 form input — focus order 혼란 + 사용자 입력 중 펼침 변경 위험.
- 외곽 border + radius-md card wrapper(legacy preview) — site SoT는 plain FAQ. 카드 안에 넣을 땐 Card가 외곽 담당.
- 너무 많은 item(10+) — 시각 noise. 카테고리 분리 또는 검색 도입.
- chevron 외 다른 아이콘(+ / -) — 사용자 학습 비용. chevron 표준 유지.

## Migration notes

- 기존 `accordion.tsx`는 Tailwind 기본 `py-4 pb-4 pt-0` — `py-[var(--spacing-lg)] pb-[var(--spacing-lg)] pt-0`(16) 토큰 직접 인용.
- Trigger `transition-all hover:underline` → `transition-[color] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] hover:text-text-secondary` — motion 토큰 + hover state 정합. underline은 옵션(선언 없으면 색 변화만).
- Chevron `transition-transform duration-200` → `duration-[var(--motion-duration-base)] ease-[var(--motion-ease-out)]` motion 토큰 직접 인용.
- Trigger `text-title-sm font-medium` (16/500) 유지 — 한국어 가독성.
- Content `text-body-md text-text-secondary` 유지 — 본문보다 약간 절제된 secondary 톤.
- Examples inline px(`padding:16px 0`, `padding:0 0 16px`) → `var(--spacing-lg)` 토큰.
- Examples `transition:transform 200ms` → motion 토큰.
- Trigger에 `focus-visible:ring` 추가 (WCAG 2.4.7).
- **preview-html `.acc-*` 정합** — 기존 외곽 `border 1px + radius-md + overflow-hidden` + open `surface-input` 채움 + `text-caption` 콘텐츠 (card-style legacy) → site SoT(plain FAQ + border-b only + body-md content) 정합. brand vignette도 동일 시각 적용.
