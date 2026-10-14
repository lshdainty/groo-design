# Collapsible

> 콘텐츠 그룹을 open/closed 토글로 펼쳤다 접는 가장 단순한 disclosure primitive. [`Accordion`](accordion.md)이 여러 item + 키보드 navigation을 제공한다면, Collapsible은 **단일 토글** + **사용처가 시각 결정**하는 base primitive. Radix `Collapsible` 베이스 — 스타일 0, 동작만.

Porest Collapsible은 **단일 spec × 시각 자유** 매트릭스입니다. 컴포넌트 자체엔 토큰 없음 — Trigger/Content 시각은 사용처가 결정(파일 list "show more", show extra options 같은 다양한 컨텍스트). [`Accordion`](accordion.md)이 시각 spec(border-b + chevron + padding-lg)을 강제한다면 Collapsible은 자유. 결과적으로 [`Accordion`](accordion.md) 사용처가 spec과 어긋날 때 또는 단일 토글일 때 Collapsible을 선택.

## Anatomy

```
┌─────────────────────────────────────┐
│ ⓑ Trigger (사용처 결정)              │
│ "@kim님이 별표한 저장소        ⇅ ⓒ"  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ⓓ 기본 가시 콘텐츠 (Trigger 밖)      │
│ "@anthropic/claude-code"            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐ ─┐
│ ⓔ CollapsibleContent (open 시 노출)  │  │
│ "@vercel/ai"                         │  │ data-state="open"
└─────────────────────────────────────┘  │
┌─────────────────────────────────────┐  │
│ "@tailwindlabs/tailwindcss"          │  │
└─────────────────────────────────────┘ ─┘
```

| ⓐ root | `<div>` (Radix `Collapsible.Root`) — 스타일 0. 사용처가 layout className. |
| ⓑ Trigger | Radix `Collapsible.Trigger` — `asChild`로 [`Button`](button.md) wrap 권장(icon button + chevron). focus-visible ring은 자식 Button이 담당. |
| ⓒ chevron (선택) | `ChevronsUpDown` 또는 `ChevronDown` 16×16. open 시 회전 효과는 사용처에서 `data-[state=open]:rotate-180`로 추가. |
| ⓓ always-visible | Trigger 밖에 배치되는 콘텐츠. open/closed 상관없이 항상 표시. |
| ⓔ CollapsibleContent | Radix `Collapsible.Content` — `data-state` 자동 부여. open/closed에 따라 mount/unmount. animation은 사용처에서. |

**규칙**

- 시각 spec은 **없음** — Collapsible은 동작 primitive. 색/padding/radius/font 모두 사용처가 결정.
- Trigger는 `asChild`로 [`Button`](button.md)/`<button>` wrap 권장 — focus ring/hover state는 Button이 제공.
- 콘텐츠가 항상 가시 + 추가만 접고 펼치는 패턴이 자연 — [`Accordion`](accordion.md)이 전체 콘텐츠 토글한다면 Collapsible은 "show more" 톤.
- animation은 [`Accordion`](accordion.md) 패턴 재사용 — `data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down`. 사용처에서 className 추가.
- 여러 item이 필요하면 [`Accordion`](accordion.md) — Collapsible 여러 개 stacking보다 Accordion이 키보드 navigation 제공.

## Variants

Collapsible은 **variant 없음** — Trigger/Content 시각은 사용처가 결정.

| Prop | 값 | 동작 |
|---|---|---|
| `defaultOpen` | `false` *(default)* / `true` | 초기 open 상태. |
| `open` (controlled) | `boolean` | controlled component. `onOpenChange` 콜백 필요. |
| `disabled` | `false` *(default)* / `true` | Trigger 비활성. |

## Sizes

Collapsible은 **size variant 없음** — 사용처 시각이 결정.

## States

| State | Radix data | 시각 (사용처 결정) |
|---|---|---|
| `closed` (default) | `data-state="closed"` | Content unmounted. Trigger 그대로. |
| `open` | `data-state="open"` | Content mounted, animation으로 height 0→auto. Trigger chevron 180° 회전(옵션). |
| `disabled` | `aria-disabled="true"` | Trigger 비활성 — `cursor-not-allowed opacity-50`. |

## Layout

**"Show more" pattern**

- 처음에 1–3 item 가시 + Trigger("더 보기") + 펼치면 나머지 표시. file list, comment list 톤.

**Optional fields**

- form 안 선택적 input — "고급 옵션"/"메타데이터" trigger로 추가 input 그룹 펼침. 기본 평균 사용자는 접힌 상태로 진입.

**Nav side panel**

- 사이드 메뉴의 하위 항목은 [Side Navigation](side-navigation.md) 의 부모 항목이 펼친다(2026-10-04) — Collapsible 로 따로 만들지 않는다. Navigation Menu 는 걷었다.

**Settings detail**

- 설정 row의 상세 옵션 — "알림" trigger + 펼치면 alarm/badge/email sub-toggle. 기본 평균 사용자엔 접힌 상태.

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Trigger click | open/closed 토글. controlled 모드에선 `onOpenChange` 콜백. |
| `Enter` / `Space` (trigger focus) | 토글. |
| `Tab` | Trigger focus 진입. CollapsibleContent 안 focusable 자식도 순서대로. |
| animation | open 시 height 0→auto 부드럽게 — Radix CSS variable `--radix-collapsible-content-height` + keyframes(accordion-down/up 재사용). |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 2.1.1** Keyboard | Trigger focus + `Enter`/`Space` 토글 ✓ |
| **WCAG 2.4.7** Focus Visible | Trigger 자식 Button이 `focus-visible:ring-2 ring-ring ring-offset-2` 제공 ✓ |
| **WCAG 2.5.5** Target Size (AAA, 44×44) | 사용처가 결정 — icon button(size="icon")은 36×36, 모바일 친화에선 44+ 권장. |
| **WCAG 2.5.8** Target Size Minimum (AA, 24×24) | 사용처 결정. icon button 32–36이면 ✓ |
| **ARIA** | Radix가 `aria-expanded` (Trigger) + `aria-controls` (Content) 자동. Content는 `role="region"` 부여 안 함(단순 토글이라 region 아닌 콘텐츠 묶음). |

## Collapsible vs Accordion 사용 가이드

| 항목 | Collapsible | [`Accordion`](accordion.md) |
|---|---|---|
| Item 수 | 1 (단일 토글) | 1+ (multiple item) |
| 시각 spec | 없음 (자유) | 강제 (FAQ 스타일 border-b + chevron + padding-lg) |
| 키보드 nav | 없음 | `ArrowUp/Down`/`Home/End` (item 사이 이동) |
| 사용처 | "show more" / optional fields / settings detail | FAQ / 가이드 / form section 그룹 |
| 자유도 | 높음 — Trigger/Content 시각 자유 | 낮음 — spec 따라야 함 |

**선택 기준**: 단일 토글 + 시각 자유 필요 → Collapsible. 여러 item + 일관된 시각 → [`Accordion`](accordion.md).

## Do / Don't

### ✅ Do

- 단일 토글 — "더 보기"/"고급 옵션"/"메타데이터" 같은 보조 콘텐츠.
- Trigger는 [`Button`](button.md) wrap — focus ring + hover 자동 제공.
- 항상 가시 콘텐츠 + 추가 접힘 콘텐츠 조합 — "기본 + 더 보기" 패턴.
- chevron 회전은 `data-[state=open]:rotate-180` + motion 토큰 — [`Accordion`](accordion.md)과 시각 통일.

### ❌ Don't

- 여러 Collapsible stack — 시각 일관성·키보드 navigation 부재. [`Accordion`](accordion.md) 사용.
- 시각 spec 강제 — Collapsible은 자유. 일관된 시각이 필요하면 [`Accordion`](accordion.md).
- Content 안 critical 정보 — 사용자가 펼치지 않을 가능성. 핵심은 always-visible.
- 콘텐츠 길이 5+ 줄 + animation 없음 — 콘텐츠가 갑자기 펼쳐지면 시각 noise. animation 권장.

## Migration notes

- 기존 `collapsible.tsx`는 Radix Primitive 그대로 export — 스타일 0. 변경 없음(이미 SoT).
- preview-html에 별도 `.col-*` CSS 없음 — site preview/component page에서 직접 렌더. preview-html 안 `.col-trigger`는 combobox용(별도 컴포넌트).
- examples에서 chevron 회전 효과 추가 권장 — `data-[state=open]:rotate-180` + `transition-transform duration-[var(--motion-duration-base)] ease-[var(--motion-ease-out)]` — [`Accordion`](accordion.md) chevron과 시각 통일.
- animation은 [`Accordion`](accordion.md)과 동일한 keyframes 재사용 — `animate-accordion-down`/`animate-accordion-up` + Radix CSS variable `--radix-collapsible-content-height`.
