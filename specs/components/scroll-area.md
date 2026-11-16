# Scroll Area

> 스크롤되는 자리의 규칙입니다. 스크롤은 브라우저 기본이고 스크롤바 모양은 전역 한 벌(6px 알약)입니다. 안에 초점 가는 것이 없는 스크롤 상자는 상자 자신이 초점과 이름을 받고, 시트 · 대화상자 · 팝오버 안의 상자는 끝에서 뒤 화면을 끌고 가지 않습니다. 끝을 흐려 더 있다는 것을 알리는 일은 [Scroll Fog](scroll-fog.md) 가 맡습니다.

스크롤은 기본 스크롤에 전역 스크롤바 한 벌(6px 알약 · thumb `stroke-neutral-solid` · track 투명)을 씁니다. Firefox 는 `thin` + `scrollbar-color` 를 `@supports not selector(::-webkit-scrollbar)` 안에 둡니다. 내용 위에 겹쳐 뜨는 Radix ScrollArea 는 쓰지 않습니다. 스크롤하면 숨는 머리는 [Scroll Auto Hide](scroll-auto-hide.md) 입니다 — 스크롤바가 아닙니다.

수치 원본은 [`scroll-area.yaml`](scroll-area.yaml)입니다.

[그림: 카드 상세 대화상자 본문 · HR 달력 일 보기 — 6px 알약 스크롤바, 라이트 · 다크](../../site/components/specs/scroll-area.tsx#hero)

### 직접 골라 보기

놓인 면(흰 면 · 바닥 · 떠 있는 표면) · 다크 · 상자 안 초점 가는 것의 유무 · 시트 안 여부를 고르고 스크롤해 보세요 — 스크롤바 대비 · 읽기(상자 이름) · 끝에 닿았을 때 뒤 화면이 따라오는지가 함께 보입니다.

[그림: 플레이그라운드](../../site/components/specs/scroll-area.tsx#playground)

## Anatomy

[그림: 스크롤 상자 · 스크롤바 6 · 막대(알약) · 투명 바탕](../../site/components/specs/scroll-area.tsx#anatomy)

| ⓐ Box | 스크롤 상자 — `overflow` 를 둔 요소입니다. 문서 전체도 같습니다. |
| ⓑ Scrollbar | 스크롤바 — 세로 6 · 가로 6 입니다. 전역 한 벌입니다. |
| ⓒ Thumb | 막대 — 알약, `stroke-neutral-solid` 입니다. |
| ⓓ Track | 바탕 — 투명입니다. |

[표: 부위](scroll-area.yaml#slots)

## Properties

### 스크롤바 — 전역 한 벌

스크롤은 브라우저 기본입니다 — 휠 · 키보드 · 끌기 · 관성을 가로채지 않습니다. 모양만 전역으로 한 벌 둡니다 — 세로 · 가로 6px, 막대는 알약 `stroke-neutral-solid`(흰 면 4.18 · 바닥 3.87 · 떠 있는 표면 4.18, 다크 4.13 · 4.68 · 3.58 — 모두 3 이상), 바탕은 투명입니다. 넘치면 늘 보입니다 — 맥 · 폰의 겹침 스크롤바는 OS 설정대로입니다. 막대는 올리거나 끌어도 모양이 바뀌지 않습니다.

Firefox 는 `::-webkit-scrollbar` 를 모르므로 `scrollbar-width: thin` + `scrollbar-color` 로 같은 색을 겁니다 — 이 두 줄은 반드시 `@supports not selector(::-webkit-scrollbar)` 안에 둡니다. 크로미움은 `scrollbar-width` · `scrollbar-color` 가 걸린 요소에서 `::-webkit-scrollbar` 를 쓰지 않아, 한 곳에 함께 쓰면 6px 이 10px(thin) · 15px(color 만)로 바뀌기 때문입니다.

[그림: 같은 대화상자 본문 — 흰 면 · 바닥 · 떠 있는 표면 위 막대 대비, 라이트 · 다크](../../site/components/specs/scroll-area.tsx#scrollbar)

[표: 스크롤바](scroll-area.yaml#base.enabled)

### 놓인 자리

| 자리 | `context` | 규칙 |
|---|---|---|
| 화면 · 카드 안 — 문서 스크롤 · 높이를 정한 상자 | `page` *(기본)* | 전역 스크롤바 그대로 |
| 시트 · 대화상자 · 팝오버 · 옆 패널 안 — 본문과 그 안의 상자 | `overlay` | `overscroll-behavior: contain` — 끝에 닿아도 뒤 화면이 따라 스크롤되지 않습니다 |
| 가로 줄 — 칩 줄 · 탭 · 가로 카드 줄 | `row` | 스크롤바를 숨깁니다 — 끝은 Scroll Fog `row` 흐림이 알립니다 |

세로 스크롤바는 숨기지 않습니다 — 숨기는 것은 가로 줄뿐입니다(Scroll Fog 의 규칙). 폰 웹 본문 · 시트 본문에서도 세로 스크롤바를 숨기지 않습니다(폭 0 · `scrollbar-hide` 를 쓰지 않습니다). 부품이 스크롤을 제 모양으로 쓰는 자리 — [Wheel Picker](wheel-picker.md) 의 휠 · [Date Picker](date-picker.md) 의 이어지는 달 — 는 제 안개를 가진 자리라 그 스펙대로 스크롤바를 숨깁니다.

[그림: 시트 안 상자 — 끝에서 뒤 화면이 따라오지 않는다 · 칩 줄은 스크롤바 없이 흐림](../../site/components/specs/scroll-area.tsx#context)

[표: 놓인 자리](scroll-area.yaml#context)

### 초점 가는 것이 없는 상자

안에 버튼 · 링크 · 칸이 없는 스크롤 상자(글 · 표 · 일정 칸)는 키보드로 닿을 길이 없습니다 — 상자 자신이 초점을 받습니다(`tabindex="0"`). 초점을 두고 `↑` `↓` · `PageUp` · `PageDown` · `Home` · `End` 로 스크롤합니다. 이름이 있어야 무엇의 상자인지 읽히므로 `role="region"` 과 이름("10월 9일 일정" · "휴가 정책")을 함께 답니다 — 역할 없는 `div` 에는 `aria-label` 을 쓸 수 없습니다(ARIA 1.2). 키보드 포커스 링은 상자 안쪽 2px 입니다. 안에 초점 가는 것이 있으면 달지 않습니다 — 그것에 초점이 가면 브라우저가 스크롤합니다.

[그림: HR 달력 일 보기 — "10월 9일 일정, 스크롤 영역" · 초점 링 안쪽, ↓ 로 스크롤](../../site/components/specs/scroll-area.tsx#focus)

[표: 초점](scroll-area.yaml#focusable)

[표: 초점 — 상태](scroll-area.yaml#matrix.focusable.none@box+focusRing)

## Guidelines

### 부분 스크롤은 적게

화면 전체가 스크롤되는 것이 기본입니다 — 카드 · 상자 안에 높이를 정한 스크롤을 만들면 손가락이 어느 쪽을 움직이는지 모르고, 끝에 닿은 뒤 화면이 따라 움직입니다. 높이를 정한 상자가 꼭 필요하면(일정 칸 · 긴 약관) 끝을 [Scroll Fog](scroll-fog.md) `box` 로 흐리고, 위 규칙(초점 · 이름 · contain)을 지킵니다. [Accordion](accordion.md) · [Collapsible](collapsible.md) 의 펼친 내용 안에는 스크롤 상자를 두지 않습니다.

### 내용 위에 겹쳐 뜨는 막대를 쓰지 않습니다

Radix ScrollArea 처럼 마우스를 올리기 전에는 보이지 않는 막대는 스크롤할 수 있다는 표시가 없고, 옅은 색이면 늘 보인다고 해도 안 보입니다. 기본 스크롤 + 전역 스크롤바를 씁니다.

[그림: 겹쳐 뜨는 막대(올리기 전 없음) · 전역 한 벌(늘 보임)](../../site/components/specs/scroll-area.tsx#overlay-guide)

## 코드

전역 스크롤바는 컴포넌트가 아니라 CSS 한 벌입니다 — `recipes/shadcn/styles/groo-shadcn-bridge.css` 에 둡니다(줄바꿈의 `html` 규칙과 같은 자리 — 이 bridge 를 부르는 화면이 함께 받습니다). 사이트 · 미리보기의 전역 규칙도 이 계약을 따릅니다. 레시피 `recipes/shadcn/components/ui/scroll-area.tsx` 는 기본 스크롤 상자입니다.

- `ScrollArea` — 기본 스크롤 상자(`div`). `orientation`(`"vertical"` 기본 · `"horizontal"` · `"both"` — 넘치는 방향만 `overflow: auto`) · `label`(주면 `role="region"` · `tabIndex={0}` · `aria-label` — 안에 초점 가는 것이 없으면 필수) · `contain`(`overscroll-behavior: contain` — 시트 · 대화상자 · 팝오버 안), 나머지는 `div` 속성입니다. 스크롤바는 그리지 않습니다(전역 CSS). `ScrollBar` 는 두지 않습니다.
- 끝을 흐리는 상자는 [Scroll Fog](scroll-fog.md) 의 `ScrollFog` 가 곧 스크롤 상자입니다 — 같은 규칙을 `div` 속성(`role="region"` · `tabIndex={0}` · `aria-label`)과 `className`(`overscroll-contain` — 시트 · 대화상자 · 팝오버 안)으로 받습니다. 시트 · 대화상자 · 팝오버의 본문(`DialogBody` · `BottomSheetBody` · `ResponsiveDialogBody` · `PopoverBody`)은 스스로 `contain` 입니다 — 레시피가 본문에 겁니다.

### 전역 스크롤바

```css
/* 전역 스크롤바 — Scroll Area. 크로미움 · 사파리는 webkit, Firefox 만 표준 두 줄 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-stroke-neutral-solid); border-radius: var(--radius-full); }
::-webkit-scrollbar-corner { background: transparent; }

/* 크로미움은 scrollbar-width · scrollbar-color 가 걸리면 webkit 규칙을 버린다 — 반드시 이 안에 */
@supports not selector(::-webkit-scrollbar) {
  * { scrollbar-width: thin; scrollbar-color: var(--color-stroke-neutral-solid) transparent; }
}

/* 가로 줄만 — 세로 스크롤바에는 쓰지 않는다 */
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

### 초점 가는 것이 없는 상자 — HR 달력 일 보기

[그림: 10월 9일 일정 상자 — 초점 링 안쪽 · 오전 8시까지 내린 모습](../../site/components/specs/scroll-area.tsx#ex-calendar)

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

{/* 안에 초점 가는 것이 없다 — 이름을 주면 region + tabindex 0 */}
<ScrollArea label="10월 9일 일정" className="h-[380px]">
  {dayTimeline}
</ScrollArea>
```

### 대화상자 안 상자 — 휴가 정책

[그림: 휴가 신청 대화상자 — 정책 상자 끝에서 대화상자 본문이 따라 스크롤되지 않는다](../../site/components/specs/scroll-area.tsx#ex-dialog)

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

{/* 대화상자 안 — 끝에 닿아도 본문이 따라 움직이지 않게 contain */}
<ScrollArea label="휴가 정책" contain className="max-h-[300px]">
  <p>{vacationPolicy}</p>
</ScrollArea>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 휠 · 터치 · 키보드 | 브라우저 그대로 — 가로채지 않습니다 |
| 막대 끌기 · 바탕 누르기 | 브라우저 그대로 |
| 초점 가는 것이 없는 상자 | `Tab` 으로 상자에 초점 → `↑` `↓` · `PageUp` · `PageDown` · `Home` · `End` 로 스크롤 |
| 시트 · 대화상자 · 팝오버 안 상자의 끝 | 뒤 화면 · 본문이 따라 스크롤되지 않습니다(`contain`) |
| 가로 줄 | 스크롤바 없이 — 끝은 흐림, 칸마다 `Tab` 이면 브라우저가 따라 스크롤 |
| 모션 줄이기 | 스크롤 모션은 OS 설정대로 — 손대지 않습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 막대 `stroke-neutral-solid` 흰 면 4.18 · 바닥 3.87 · 떠 있는 표면 4.18, 다크 4.13 · 4.68 · 3.58 ✓ |
| **WCAG 2.1.1** Keyboard | 초점 가는 것이 없는 상자는 `tabindex="0"` 로 키보드 스크롤 ✓ |
| **WCAG 2.4.7** Focus visible | 상자 안쪽 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 막대 6 — 스크롤은 휠 · 터치 · 키보드가 주이고 막대 끌기는 보조입니다(해당 없음에 가깝습니다) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 위와 같습니다 |
| **WCAG 4.1.2** Name, Role, Value | 초점을 받는 상자는 `role="region"` + 이름 ✓ — 이름 없는 `div` 에 `aria-label` 을 달지 않습니다 |
| **ARIA** | 스크롤바는 브라우저 것이라 따로 읽지 않습니다. 크로미움은 이름 없는 스크롤 상자도 `Tab` 정지점으로 만듭니다 — 이름을 달아 무엇인지 알립니다 |

## Do / Don't

### ✅ Do

- 기본 스크롤 + 전역 스크롤바 한 벌을 씁니다 — Firefox 두 줄은 `@supports not selector(::-webkit-scrollbar)` 안에 둡니다.
- 세로 스크롤바는 늘 보입니다 — 숨기는 것은 가로 줄뿐입니다.
- 초점 가는 것이 없는 상자에 `tabindex="0"` + `role="region"` + 이름을 답니다.
- 시트 · 대화상자 · 팝오버 안 상자에 `overscroll-behavior: contain` 을 겁니다.

### ❌ Don't

- 내용 위에 겹쳐 뜨는 막대(Radix ScrollArea) · 올렸을 때만 보이는 막대.
- `scrollbar-width` · `scrollbar-color` 를 webkit 규칙과 한 곳에(크롬에서 6px 이 10 · 15px 로).
- 옅은 막대(#EEEEEE 1.11) · 회색 바탕(track) · 화면마다 다른 굵기.
- 폰 본문 · 시트 본문의 세로 스크롤바 숨기기.
- 펼친 아코디언 안 · 카드 안에 높이를 정한 스크롤을 쉽게 만들기.

## Specification

`scroll-area.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹이 스크롤 상자를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — scroll-area.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-area)
