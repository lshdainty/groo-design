# Scroll Area

> 스크롤되는 자리의 규칙 — 스크롤은 브라우저 기본이고 스크롤바 모양은 전역 한 벌(6px 알약)이다. 안에 초점 가는 것이 없는 스크롤 상자는 상자 자신이 초점과 이름을 받고, 시트 · 대화상자 · 팝오버 안의 상자는 끝에서 뒤 화면을 끌고 가지 않는다. 끝을 흐려 더 있다는 것을 알리는 일은 [Scroll Fog](scroll-fog.md) 다.

SEED 에는 Scroll Area · 스크롤바 규칙이 없다 — 스크롤 끝 흐림(Scroll Fog)만 있다. 그래서 모양은 porest 가 정했다(2026-10-10 사용자 결정 14A — "당근 스크롤에 모양 자체는 없는 거라면 모양은 A") — 기본 스크롤 + 전역 한 벌(6px 알약 · thumb `stroke-neutral-solid` · track 투명), Firefox 는 `thin` + `scrollbar-color` 를 `@supports not selector(::-webkit-scrollbar)` 안에. 내용 위에 겹쳐 뜨는 Radix ScrollArea 는 걷는다. 옛 Scroll Area 스펙(Radix 베이스 · `border-strong` thumb · 전역 webkit + Firefox 를 한 곳에)과 DESIGN.md v71 의 다른 글(hover 때만 · 6 ~ 8px · 불투명도 0.4 ~ 1)을 대신한다. 스크롤하면 숨는 머리는 [Scroll Auto Hide](scroll-auto-hide.md) 다(사용자가 14번 답에서 말한 "자동으로 접히고 펴지는" SEED 컴포넌트 — 스크롤바가 아니다).

수치 원본은 [`scroll-area.yaml`](scroll-area.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카드 상세 대화상자 본문 · HR 달력 일 보기 — 6px 알약 스크롤바, 라이트 · 다크](../../site/components/specs/scroll-area.tsx#hero)

### 직접 골라 보기

놓인 면(흰 면 · 바닥 · 떠 있는 표면) · 다크 · 상자 안 초점 가는 것의 유무 · 시트 안 여부를 고르고 스크롤해 보라 — 스크롤바 대비 · 읽기(상자 이름) · 끝에 닿았을 때 뒤 화면이 따라오는지가 함께 보인다.

[그림: 플레이그라운드](../../site/components/specs/scroll-area.tsx#playground)

## Anatomy

[그림: 스크롤 상자 · 스크롤바 6 · 막대(알약) · 투명 바탕](../../site/components/specs/scroll-area.tsx#anatomy)

| ⓐ Box | 스크롤 상자 — `overflow` 를 둔 요소. 문서 전체도 같다. |
| ⓑ Scrollbar | 스크롤바 — 세로 6 · 가로 6. 전역 한 벌. |
| ⓒ Thumb | 막대 — 알약, `stroke-neutral-solid`. |
| ⓓ Track | 바탕 — 투명. |

[표: 부위](scroll-area.yaml#slots)

## Properties

### 스크롤바 — 전역 한 벌

스크롤은 브라우저 기본이다 — 휠 · 키보드 · 끌기 · 관성을 가로채지 않는다. 모양만 전역으로 한 벌 둔다 — 세로 · 가로 6px, 막대는 알약 `stroke-neutral-solid`(흰 면 4.18 · 바닥 3.87 · 떠 있는 표면 4.18, 다크 4.13 · 4.68 · 3.58 — 모두 3 이상), 바탕은 투명이다. 넘치면 늘 보인다 — 맥 · 폰의 겹침 스크롤바는 OS 설정대로다. 막대는 올리거나 끌어도 모양이 바뀌지 않는다.

Firefox 는 `::-webkit-scrollbar` 를 모르므로 `scrollbar-width: thin` + `scrollbar-color` 로 같은 색을 건다 — 이 두 줄은 반드시 `@supports not selector(::-webkit-scrollbar)` 안에 둔다. 크로미움은 `scrollbar-width` · `scrollbar-color` 가 걸린 요소에서 `::-webkit-scrollbar` 를 쓰지 않아, 한 곳에 함께 쓰면 6px 이 10px(thin) · 15px(color 만)로 바뀐다(크로미움 140 에서 잼 — 옛 스펙의 "webkit 6 + Firefox thin + scrollbar-color" 를 그대로 쓰면 크롬에서 6px 이 사라진다).

[그림: 같은 대화상자 본문 — 흰 면 · 바닥 · 떠 있는 표면 위 막대 대비, 라이트 · 다크](../../site/components/specs/scroll-area.tsx#scrollbar)

[표: 스크롤바](scroll-area.yaml#base.enabled)

### 놓인 자리

| 자리 | `context` | 규칙 |
|---|---|---|
| 화면 · 카드 안 — 문서 스크롤 · 높이를 정한 상자 | `page` *(기본)* | 전역 스크롤바 그대로 |
| 시트 · 대화상자 · 팝오버 · 옆 패널 안 — 본문과 그 안의 상자 | `overlay` | `overscroll-behavior: contain` — 끝에 닿아도 뒤 화면이 따라 스크롤되지 않는다 |
| 가로 줄 — 칩 줄 · 탭 · 가로 카드 줄 | `row` | 스크롤바를 숨긴다 — 끝은 Scroll Fog `row` 흐림이 알린다 |

세로 스크롤바는 숨기지 않는다 — 숨기는 것은 가로 줄뿐이다(Scroll Fog 의 규칙). 폰 웹 본문 · 시트 본문에서 스크롤바를 숨겨 둔 것(`.m-scroll` 0 · `scrollbar-hide`)은 걷는다. 부품이 스크롤을 제 모양으로 쓰는 자리 — [Wheel Picker](wheel-picker.md) 의 휠 · [Date Picker](date-picker.md) 의 이어지는 달 — 는 제 안개를 가진 자리라 그 스펙대로 스크롤바를 숨긴다.

[그림: 시트 안 상자 — 끝에서 뒤 화면이 따라오지 않는다 · 칩 줄은 스크롤바 없이 흐림](../../site/components/specs/scroll-area.tsx#context)

[표: 놓인 자리](scroll-area.yaml#context)

### 초점 가는 것이 없는 상자

안에 버튼 · 링크 · 칸이 없는 스크롤 상자(글 · 표 · 일정 칸)는 키보드로 닿을 길이 없다 — 상자 자신이 초점을 받는다(`tabindex="0"`). 초점을 두고 `↑` `↓` · `PageUp` · `PageDown` · `Home` · `End` 로 스크롤한다. 이름이 있어야 무엇의 상자인지 읽히므로 `role="region"` 과 이름("10월 9일 일정" · "휴가 정책")을 함께 단다 — 역할 없는 `div` 에는 `aria-label` 을 쓸 수 없다(ARIA 1.2). 키보드 포커스 링은 상자 안쪽 2px 다. 안에 초점 가는 것이 있으면 달지 않는다 — 그것에 초점이 가면 브라우저가 스크롤한다.

[그림: HR 달력 일 보기 — "10월 9일 일정, 스크롤 영역" · 초점 링 안쪽, ↓ 로 스크롤](../../site/components/specs/scroll-area.tsx#focus)

[표: 초점](scroll-area.yaml#focusable)

[표: 초점 — 상태](scroll-area.yaml#matrix.focusable.none@box+focusRing)

## Guidelines

### 부분 스크롤은 적게

화면 전체가 스크롤되는 것이 기본이다 — 카드 · 상자 안에 높이를 정한 스크롤을 만들면 손가락이 어느 쪽을 움직이는지 모르고, 끝에 닿은 뒤 화면이 따라 움직인다. 높이를 정한 상자가 꼭 필요하면(일정 칸 · 긴 약관) 끝을 [Scroll Fog](scroll-fog.md) `box` 로 흐리고, 위 규칙(초점 · 이름 · contain)을 지킨다. [Accordion](accordion.md) · [Collapsible](collapsible.md) 의 펼친 내용 안에는 스크롤 상자를 두지 않는다.

### 내용 위에 겹쳐 뜨는 막대를 쓰지 않는다

Radix ScrollArea 처럼 마우스를 올리기 전에는 보이지 않는 막대는 스크롤할 수 있다는 표시가 없고, 옅은 색이면 늘 보인다고 해도 안 보인다(지금 HR 1.11). 기본 스크롤 + 전역 스크롤바를 쓴다. OS 기본 그대로(14C)는 제품 · 기기마다 모양이 달라 고르지 않았다.

[그림: 겹쳐 뜨는 막대(올리기 전 없음) · 전역 한 벌(늘 보임)](../../site/components/specs/scroll-area.tsx#overlay-guide)

## 코드

전역 스크롤바는 컴포넌트가 아니라 CSS 한 벌이다 — `recipes/shadcn/styles/porest-shadcn-bridge.css` 에 둔다(줄바꿈 v114 의 `html` 규칙과 같은 자리 — 이 bridge 를 부르는 화면이 함께 받는다). 사이트 · 미리보기의 전역 규칙도 이 계약을 따른다. 레시피 `recipes/shadcn/components/ui/scroll-area.tsx` 는 Radix 를 걷고 기본 스크롤 상자로 바꾼다.

- `ScrollArea` — 기본 스크롤 상자(`div`). `orientation`(`"vertical"` 기본 · `"horizontal"` · `"both"` — 넘치는 방향만 `overflow: auto`) · `label`(주면 `role="region"` · `tabIndex={0}` · `aria-label` — 안에 초점 가는 것이 없으면 필수) · `contain`(`overscroll-behavior: contain` — 시트 · 대화상자 · 팝오버 안), 나머지는 `div` 속성. 스크롤바는 그리지 않는다(전역 CSS). `ScrollBar` 는 걷는다.
- 끝을 흐리는 상자는 [Scroll Fog](scroll-fog.md) 의 `ScrollFog` 가 곧 스크롤 상자다 — 같은 규칙을 `div` 속성(`role="region"` · `tabIndex={0}` · `aria-label`)과 `className`(`overscroll-contain` — 시트 · 대화상자 · 팝오버 안)으로 받는다. 시트 · 대화상자 · 팝오버의 본문(`DialogBody` · `BottomSheetBody` · `ResponsiveDialogBody` · `PopoverBody`)은 스스로 `contain` 이다 — 레시피가 본문에 건다(지금은 없다).

### 전역 스크롤바

```css
/* 전역 스크롤바 — Scroll Area(2026-10-10). 크로미움 · 사파리는 webkit, Firefox 만 표준 두 줄 */
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
| 휠 · 터치 · 키보드 | 브라우저 그대로 — 가로채지 않는다 |
| 막대 끌기 · 바탕 누르기 | 브라우저 그대로 |
| 초점 가는 것이 없는 상자 | `Tab` 으로 상자에 초점 → `↑` `↓` · `PageUp` · `PageDown` · `Home` · `End` 로 스크롤 |
| 시트 · 대화상자 · 팝오버 안 상자의 끝 | 뒤 화면 · 본문이 따라 스크롤되지 않는다(`contain`) |
| 가로 줄 | 스크롤바 없이 — 끝은 흐림, 칸마다 `Tab` 이면 브라우저가 따라 스크롤 |
| 모션 줄이기 | 스크롤 모션은 OS 설정대로 — 손대지 않는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 막대 `stroke-neutral-solid` 흰 면 4.18 · 바닥 3.87 · 떠 있는 표면 4.18, 다크 4.13 · 4.68 · 3.58 ✓ — 지금 HR Radix #EEEEEE 1.11 · 앱 안드로이드 #BCBCBC 1.9 |
| **WCAG 2.1.1** Keyboard | 초점 가는 것이 없는 상자는 `tabindex="0"` 로 키보드 스크롤 ✓ |
| **WCAG 2.4.7** Focus visible | 상자 안쪽 링 2px ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 막대 6 — 스크롤은 휠 · 터치 · 키보드가 주이고 막대 끌기는 보조다(해당 없음에 가깝다) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 위와 같다 |
| **WCAG 4.1.2** Name, Role, Value | 초점을 받는 상자는 `role="region"` + 이름 ✓ — 이름 없는 `div` 에 `aria-label` 을 달지 않는다 |
| **ARIA** | 스크롤바는 브라우저 것이라 따로 읽지 않는다. 크로미움은 이름 없는 스크롤 상자도 `Tab` 정지점으로 만든다 — 이름을 달아 무엇인지 알린다 |

## Do / Don't

### ✅ Do

- 기본 스크롤 + 전역 스크롤바 한 벌 — Firefox 두 줄은 `@supports not selector(::-webkit-scrollbar)` 안에.
- 세로 스크롤바는 늘 — 숨기는 것은 가로 줄뿐.
- 초점 가는 것이 없는 상자에 `tabindex="0"` + `role="region"` + 이름.
- 시트 · 대화상자 · 팝오버 안 상자에 `overscroll-behavior: contain`.

### ❌ Don't

- 내용 위에 겹쳐 뜨는 막대(Radix ScrollArea) · 올렸을 때만 보이는 막대.
- `scrollbar-width` · `scrollbar-color` 를 webkit 규칙과 한 곳에(크롬에서 6px 이 10 · 15px 로).
- 옅은 막대(#EEEEEE 1.11) · 회색 바탕(track) · 화면마다 다른 굵기.
- 폰 본문 · 시트 본문의 세로 스크롤바 숨기기.
- 펼친 아코디언 안 · 카드 안에 높이를 정한 스크롤을 쉽게 만들기.

## Specification

`scroll-area.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 스크롤 상자를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — scroll-area.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-area)

## SEED 와 다른 점

- **SEED 에는 Scroll Area · 스크롤바 규칙이 없다** — 끝 흐림(Scroll Fog)만 있다. 모양 · Firefox 처리 · 초점 · 이름 · contain 은 모두 porest 가 정했다.

## Migration notes

### 2026-10-10 — 기본 스크롤 + 전역 한 벌

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 정했다 — 기본 스크롤 + 전역 한 벌(14A — 6px 알약 · thumb `stroke-neutral-solid` · track 투명 · Firefox `thin` + color 는 `@supports not selector(::-webkit-scrollbar)` 안), Radix ScrollArea 는 걷는다. 그리고 "따라오는 것" — 세로 스크롤바는 숨기지 않는다(가로 줄만) · 초점 가는 것이 없는 스크롤 상자는 모두 `tabindex="0"` + 이름 · 시트 · 대화상자 · 팝오버 안 상자는 `overscroll-behavior: contain`. Radix 유지(14B) · OS 기본(14C)은 고르지 않았다. 이름을 다는 상자에는 `role="region"` 을 함께 둔다 — 역할 없는 `div` 의 `aria-label` 은 ARIA 1.2 에서 쓸 수 없다. 옛 스펙은 `scroll-area.history/v-pre-seed-collapse.*` 에 남겼다.

| 옛 Scroll Area | 새 Scroll Area |
|---|---|
| Radix ScrollArea — 내용 위 겹친 막대(넘치지 않으면 숨김) | 기본 스크롤 — 스크롤바는 전역 한 벌, `ScrollArea` 는 기본 상자 |
| thumb `border-strong` · 6px · 막대 1px 투명 테두리 · 색 전환 | thumb `stroke-neutral-solid` · 6px · 알약 · 상태 변화 없음 |
| 전역 webkit 6 + Firefox `thin` · `scrollbar-color` 를 한 곳에 | Firefox 두 줄은 `@supports not selector(::-webkit-scrollbar)` 안 |
| "ScrollArea 자체는 focus 대상 아님" | 초점 가는 것이 없는 상자는 `tabindex="0"` + `role="region"` + 이름 |
| `.scrollbar-hide` 는 보이지 않게 하고 싶은 곳에 | 가로 줄에만 — 세로 스크롤바는 숨기지 않는다 |
| (DESIGN v71) hover 때만 · 6 ~ 8px · 불투명도 0.4 ~ 1 · always / hover / scrolling | 이 스펙으로 바꿨다 |

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사 — 웹 · HR 은 스크롤바 숨김을 끄고 크로미움 140 에 띄워 쟀다).

- **Desk 웹** — 전역 webkit 6 · `--border-strong` #767C8B 는 그대로 맞고 Firefox 규칙이 0 이다(`index.css:470-498`, D20) — `@supports` 안에 두 줄을 더한다. 폰 본문 `.m-scroll` 은 스크롤바 0, 서랍 본문은 `scrollbar-hide`(`shared/ui/drawer.tsx:163`) — 세로는 숨기지 않는다. Radix `scroll-area.tsx` 는 실사용 0(유일한 `NotificationBell.tsx:103` 을 아무도 안 쓴다) · `.scroll` CSS 도 쓰는 곳 0 이다(`porest.css:270-288`, D21) — 걷는다. 가로 줄 11곳은 숨김이 맞고 끝 흐림(Scroll Fog `row`)이 아직 없다.
- **HR** — 전역 4px + 보이는 회색 track(#787878 ↔ #F8F8F8 4.16 · 다크 3.63, `index.css:132-160`). Radix ScrollArea 8곳은 막대 10 · thumb 7 `bg-border` #EEEEEE 가 바탕 1.11(다크 1.34)이라 `type="always"` 4곳도 사실상 보이지 않는다(`shared/ui/shadcn/scrollArea.tsx:33-43` · 달력 일정 · 일 · 주 `calendar-agenda-view.tsx:64` · `calendar-day-view.tsx:98 · 206` · `calendar-week-view.tsx:94`, D8). 기본 overflow + 전역 한 벌로 — 일정 상자는 초점 가는 것이 없어 이름("{날짜} 일정")을 단다. `overscroll-behavior` 는 0 이다.
- **Desk 앱** — 전역 스크롤바 테마가 없고 Material `Scrollbar` 3곳만 4dp 네모 #BCBCBC(흰 면 1.9 — `account_add_dialog.dart:732` · `card_add_dialog.dart:979` · `investment_add_dialog.dart:1300`, D18)이다. 앱은 스크롤할 때만 보이는 플랫폼 스크롤바를 두되 막대 색을 `stroke-neutral-solid` · 6 · 알약으로 맞춘다(전역 `ScrollbarTheme` 하나).
- **넘침 막기** — `overscroll-behavior` 는 웹 1곳(`icon-picker.tsx:163` contain)뿐이고 HR · SSO 는 0 이다. 대화상자 안 상자(아이콘 240 · 시간 208 · 자산 기관 260 · 주식 56vh · HR 휴가 신청 · 승인 · 정책 300 · SSO 역할 권한 200)에 `contain` 을.
- **이름 없는 정지점** — 크로미움 140 은 읽기만 하는 스크롤 상자(주식 지표 카드 줄 `summary-strip.tsx:72` · 설치 주소 `DownloadPage.tsx:203` · 가져오기 · 내보내기 표)를 이름 없는 `Tab` 정지점으로 만든다(사파리는 그렇지 않다 — 추정). 이름을 단다.
- **SSO** — 전역 CSS 가 없어 OS 기본이고 `scroll-area.tsx` 는 쓰는 곳이 0 이다(D21) — 전역 한 벌을 받고 부품은 걷는다.
- **스펙 글** — DESIGN.md v71 Scroll Area 가 이 스펙과 달랐다(조사 S4 · S5 · S7) — "펼치고 접기 · 나누기" 절로 바꿨다. 사이트(`scripts/build-site.mjs`) · 미리보기(`scripts/build-preview-html.mjs`)의 전역 규칙 `* { scrollbar-width: thin; scrollbar-color … }` 도 같은 이유로 크롬에서 6px 이 아니다 — 위 계약으로 옮긴다.

### 이전 기록

- **2026-05 — 6px 로 정정 · 전역 톤.** Radix 막대 10 → 6, thumb `border-strong`, 사이트 · 미리보기 전역 webkit + Firefox 를 한 곳에, `.scrollbar-hide` 를 더했다. 이번에 Firefox 자리 · Radix · 초점 규칙이 바뀌었다.
