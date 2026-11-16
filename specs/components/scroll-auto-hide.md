# Scroll Auto Hide

> 스크롤 상자 맨 위에 붙은 영역이 아래로 스크롤하면 그 거리만큼 숨고, 위로 스크롤하면 같은 거리만큼 드러나는 규칙입니다. 폰 가계부 · 할 일 원장의 머리(월 · 총액 · 주 달력), 거래 검색 · 카드 혜택 화면의 거르는 줄처럼 목록을 넓게 보고 싶은 자리에 씁니다. 상단 바와 탭은 숨지 않습니다.

스크롤하는 동안 거리를 1:1 로 따라가고, 끝나면 50% 를 기준으로 200ms 에 다 숨거나 다 드러나며, 높이를 바꾸지 않고 `translate3d()` 로만 옮깁니다. 모션 줄이기면 자동 숨김을 끄고, 숨은 영역 안으로 초점이 오면 드러냅니다.

수치 원본은 [`scroll-auto-hide.yaml`](scroll-auto-hide.yaml)입니다.

[그림: 폰 가계부 10월 — 내리면 총액 · 소비 요약이 숨고 달 줄 · 주 달력 아래로 목록이 넓어지고, 조금 올리면 드러납니다 — 라이트 · 다크](../../site/components/specs/scroll-auto-hide.tsx#hero)

### 직접 골라 보기

화면을 직접 스크롤하거나 "내렸다 조금 올리기" 를 누르면 머리가 따라 숨고 드러나며, 멈추면 50% 를 기준으로 스냅합니다. "숨은 머리로 초점 옮기기" 와 모션 줄이기 스위치도 있습니다 — 아래 글이 숨은 높이 · 목록이 보이는 높이를 잽니다.

[그림: 플레이그라운드](../../site/components/specs/scroll-auto-hide.tsx#playground)

## Anatomy

[그림: 스크롤 상자 안 맨 위의 숨는 영역(sticky top 0) — 위로 옮겨 숨고, 높이는 그대로](../../site/components/specs/scroll-auto-hide.tsx#anatomy)

| ⓐ Scroll Container | 스크롤 상자 — 쓰는 쪽입니다. 상단 바 · 탭 아래부터의 overflow 상자, 또는 창(문서)입니다(아래 "스크롤 상자 안에"). |
| ⓑ Root | 숨는 영역 — 상자 맨 위에 붙고(`sticky` · `top: 0`) 스크롤 거리만큼 위로 옮겨 숨습니다. 바탕은 쓰는 쪽이 정합니다. |
| ⓒ Content | 그 아래 목록 — 머리가 숨으면 화면을 다 씁니다. |

[표: 부위](scroll-auto-hide.yaml#slots)

## Properties

### 따라가고, 멈추면 스냅

스크롤하는 동안 영역은 스크롤 거리를 그대로 따라갑니다 — 아래로 내린 만큼 숨고, 위로 올린 만큼 드러납니다(목록 쪽에서 보면 머리가 목록과 함께 밀려 올라가고, 거꾸로 올리면 바로 내려옵니다). 스크롤이 끝나면 영역 높이의 50% 를 기준으로 다 숨거나 다 드러납니다 — 200ms(`motion-duration-d4`) `motion-ease-enter`(`cubic-bezier(0, 0, 0.15, 1)`)입니다. 영역은 `translate3d()` 로 옮기기만 하고 높이를 바꾸지 않습니다 — 목록이 접히는 만큼 당겨지지 않아 튀지 않습니다. ScrollTimeline 이 있는 브라우저는 스크롤과 이동을 브라우저가 직접 잇고, 없으면 scroll 이벤트로 같은 동작을 합니다.

[그림: 900 내림 → 숨는 부분 72 다 숨음 · 40 올림 → 32 남아 50% 아래라 다 드러남](../../site/components/specs/scroll-auto-hide.tsx#follow)

[표: 숨는 영역](scroll-auto-hide.yaml#base.shown)

[표: 상태](scroll-auto-hide.yaml#matrix)

[표: 모션](scroll-auto-hide.yaml#motion)

### 모션 줄이기 · 초점

기기에서 동작 줄이기를 켜면 자동 숨김을 끕니다 — 위치가 움직이지 않게 머리는 늘 보이고 목록이 그 아래에서 스크롤합니다. 숨은 영역 안으로 키보드 초점이 오면(`Tab` 으로 "소비 요약" 에) 바로 다 드러냅니다 — 보이지 않는 단추에 초점이 머물지 않게 하기 위해서입니다.

[그림: 모션 줄이기 — 머리가 늘 보임 · 숨은 머리의 "소비 요약" 에 초점 → 다 드러남](../../site/components/specs/scroll-auto-hide.tsx#reduced)

[표: 모션 줄이기](scroll-auto-hide.yaml#motionSetting)

### 남는 부분 · 위에 붙은 줄

원장처럼 숨는 영역의 아래쪽 일부가 남아야 하면 두 가지를 더합니다(웹 `keepRef` · 앱 같은 자리). 둘 다 쓰지 않으면 영역 전체가 숨습니다.

- **남는 부분(`keepRef`)** — 숨는 거리는 영역 전체 높이가 아니라 남는 부분의 윗변까지입니다. 남는 부분(주 달력)은 영역과 함께 올라가 위에 붙은 줄 바로 아래에서 멈춥니다.
- **위에 붙은 줄 보정** — 영역 위에 이미 붙어 있는 줄(달 이동 줄)이 있으면, 영역이 그 줄 아래에 붙는 순간부터 거리를 셉니다.
- **남는 부분 안의 초점은 머리를 드러내지 않습니다** — 숨은 채 주 달력 칸을 누르면 초점이 그 안으로 가는데, 그때 머리를 드러내면 칸이 밀려 누름이 빗나가기 때문입니다. 숨은 부분 안으로 오는 초점은 위 규칙대로 드러냅니다.

### 바탕 · 겹침

바탕과 z-index 는 쓰는 쪽이 정합니다 — 바탕이 없으면 숨는 동안 아래 줄이 비칩니다. 원장 머리는 목록과 같은 흰 면(`bg-layer-default`)이고, z-index 는 스크롤 상자 안의 겹침 값 2 입니다 — [List](list.md) 줄 뒤 붙이개의 단추 · 링크(z 1) 위에 놓입니다. 층 토큰(`z-sticky`)이 아닙니다([z-index](../z-index.md) 의 "쓰는 법").

## Guidelines

### 어디에 쓰나 — 원장 머리 · 거르는 줄

폰 가계부 · 할 일 원장의 머리는 위쪽만 이 규칙으로 숨습니다 — 가계부는 총액 · 지난달 비교 줄 · [소비 요약](펼친 소비 요약 카드 포함), 할 일은 오늘 상태 · 별빛 줄 · [밤하늘](펼친 밤하늘 포함). **달 이동 줄과 주 달력(요일 · 펼침 꺾쇠 · 펼친 월 달력 포함)은 남습니다** — 달 줄은 상단 바 아래에 붙고(`sticky`), 주 달력은 그 바로 아래에서 고른 날을 보입니다. 목록을 내리면 고른 날이 화면 맨 위 날짜 묶음을 따라갑니다(스크롤 스파이) — 고른 날이 든 주가 주 달력에 섭니다. Desk 웹 · 앱이 같습니다. 필터를 걸면 달 줄 아래에 필터 칩 줄이 서고, 달 줄 + 칩 줄이 함께 남습니다 — 필터 칩 줄은 숨지 않습니다. 목록 위 필터 줄 · 보조 머리 같은 다른 자리도 이 규칙입니다. 머리 안의 소비 요약과 월 달력은 하나만 펼칩니다([Collapsible](collapsible.md)).

펼친 월 달력은 목록을 내리기 시작하면 고른 주로 접힙니다 — 화면 맨 위에 보이던 날짜 묶음의 자리(y)는 그대로 둡니다(접힌 높이만큼 목록이 튀지 않게).

거래 검색 화면의 거르는 줄(전체 · 지출 · 수입 칩 — 48: 칩 36 + 위아래 6)과 카드 혜택 화면의 거르는 줄(카드 이름 검색칸 + 칩 두 줄 — 140)도 이 규칙입니다 — 바 아래 스크롤 상자 맨 위에 두고, 내리면 숨고 올리면 드러납니다. 손을 떼면 50% 를 기준으로 스냅하므로 48 줄은 24, 140 줄은 70 이상 올려야 다 드러납니다(반 이상 나오면) — 그보다 적게 올리고 손을 떼면 다시 숨습니다. 웹 거래 검색 화면도 같습니다. 검색칸이 든 바 자체(검색 화면의 제목 자리)는 숨지 않습니다.

[그림: 거래 검색 · 카드 혜택 — 거르는 줄 48 · 140, 내림 · 조금 올림 · 반 넘게 올림](../../site/components/specs/scroll-auto-hide.tsx#filter-guide)

[그림: 원장 머리 — 총액 · 비교 줄 · 소비 요약만 숨고 달 줄 · 주 달력은 남는다 · 필터를 걸면 달 줄 아래 칩 줄이 남는다](../../site/components/specs/scroll-auto-hide.tsx#place-guide)

### 숨지 않는 것

상단 바(Top Navigation)는 스크롤해도 그 자리에 있고 숨지 않습니다 — 가계부 묶음의 Line Tabs 도 그 아래에 남습니다. 경계는 이렇습니다 — **화면을 오가는 탭(1차 Line)은 상단 바와 함께 남고, 그 아래의 원장 머리 · 거르는 줄 · 2차 Chip Tabs 는 숨어도 됩니다.** 탭은 스크롤 상자 밖에 두고, 그 아래 필터 칩 줄만 숨깁니다. 하단 탭 바(Bottom Navigation)는 제 규칙으로 줄어듭니다(아래로 20 · 위로 28 · 맨 위 40) — 이 컴포넌트가 아닙니다. 시트 · 대화상자의 머리도 숨기지 않습니다. 일정 거리를 지나면 높이를 접는 방식은 쓰지 않습니다 — 목록이 당겨지고, 손가락을 따라가지 않고, 줄이기에서도 움직이며, 접힌 단추에 초점이 들어가기 때문입니다.

[그림: 숨는 머리 · 그대로인 상단 바 · Line Tabs · 따로 줄어드는 탭 바](../../site/components/specs/scroll-auto-hide.tsx#keep-guide)

### 스크롤 상자 안에

숨는 영역은 스크롤 상자 안 맨 위에 둡니다(`position: sticky; top: 0`). 영역의 `transform` 은 숨기는 데 쓰므로 다른 `transform` 은 자식에 겁니다.

**스크롤 상자는 창(문서)일 수도 있습니다** — 담다 웹 폰처럼 화면 전체가 문서 스크롤이면(브라우저 주소창이 스크롤 따라 숨게) 상단 바 · 탭 아래를 따로 나누지 않고 창을 스크롤 상자로 씁니다. 그때 스크롤 위치는 `document.scrollingElement.scrollTop`, `scroll` · `scrollend` 는 `document`(창)에서 받습니다. 영역은 문서 흐름 맨 위(상단 바 · 탭 아래)에 sticky 로 붙고, `top` 은 0 이 아니라 그 위에 붙은 상단 바 · 탭의 높이 합입니다 — 숨는 영역은 그 아래로 들어가 가려집니다.

## 코드

레시피 `recipes/shadcn/components/ui/scroll-auto-hide.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ScrollAutoHide` — 숨는 영역. `scrollContainerRef`(스크롤 상자의 ref — 필수. 창이 스크롤 상자면 `document.scrollingElement` 를 가리킨다) · `asChild`(자식 하나를 루트로) · `keepRef`(영역 안에서 숨지 않고 남는 아래 부분, 위 "남는 부분 · 위에 붙은 줄"), 나머지는 `div` 속성입니다. 위에 고정 줄이 따로 있으면 `style.top` 에 그 높이를 줍니다 — 남는 부분이 그 줄 바로 아래에 서고, 스크롤한 거리는 붙는 순간부터 셉니다. `sticky` · `top: 0` · 1:1 따라가기 · 50% 스냅(200ms `motion-ease-enter`) · 모션 줄이기면 끔 · 초점이 들어오면 드러냄은 부품이 맡습니다. 바탕 · z-index 는 쓰는 쪽이 `className` 으로 정합니다.

### 가계부 원장 머리

[그림: 폰 가계부 — 머리가 숨고 드러나는 원장(웹 · 앱 같은 동작)](../../site/components/specs/scroll-auto-hide.tsx#ex-ledger)

```tsx
import { useRef } from "react"
import { ScrollAutoHide } from "@/components/ui/scroll-auto-hide"

const scrollRef = useRef<HTMLDivElement>(null)
const keepRef = useRef<HTMLDivElement>(null)

{/* 상단 바 · 탭 아래부터가 스크롤 상자 — 숨는 머리는 그 안 맨 위 */}
<div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
  {/* 달 이동 줄 — 숨지 않고 위에 붙는다 */}
  <div className="sticky top-0 z-[3] bg-bg-layer-default">{monthBar}</div>
  {/* 총액 · 비교 줄 · 소비 요약은 숨고, 주 달력(keepRef)은 달 줄 바로 아래에 남는다 */}
  <ScrollAutoHide
    scrollContainerRef={scrollRef}
    keepRef={keepRef}
    style={{ top: monthBarHeight }}
    className="z-[2] bg-bg-layer-default"
  >
    {summary}
    <div ref={keepRef}>{weekCalendar}</div>
  </ScrollAutoHide>
  {transactionList}
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 아래로 스크롤 | 내린 거리만큼 머리가 위로 숨습니다 — 다 숨으면 그대로입니다 |
| 위로 스크롤 | 올린 거리만큼 드러납니다 — 맨 위에서는 다 보입니다 |
| 스크롤이 끝남 | 절반 넘게 숨었으면 다 숨고, 아니면 다 드러납니다 — 200ms |
| 숨은 머리 안으로 `Tab` | 바로 다 드러납니다 |
| 모션 줄이기 | 자동 숨김을 끕니다 — 머리는 늘 보입니다 |
| 하단 탭 바 | 제 규칙으로 줄어듭니다(따로) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 숨은 영역 안으로 초점이 오면 바로 다 드러냅니다 ✓ |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 자동 숨김을 끕니다 ✓ |
| **WCAG 1.3.2** Meaningful Sequence | 숨겨도 읽는 차례 · DOM 은 그대로입니다 — 옮기기만 합니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 숨는 영역은 누르는 것이 아닙니다. 안의 단추는 그 단추의 규칙을 따릅니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 |
| **ARIA** | 역할이 없습니다 — 숨는 영역은 그 안 내용의 역할 그대로입니다(머리 · 단추). 숨겨도 `aria-hidden` · `inert` 를 걸지 않습니다(초점이 오면 드러나므로) |

## Do / Don't

### ✅ Do

- 목록을 넓게 봐야 하는 화면의 보조 머리(원장 머리 · 거래 검색 · 카드 혜택의 거르는 줄)에 씁니다.
- 스크롤 거리를 1:1 로 따라가고, 끝나면 50% 로 스냅합니다.
- 높이를 바꾸지 않고 옮기기만 합니다 — 바탕을 칠합니다.
- 모션 줄이기면 끄고, 초점이 오면 드러냅니다.

### ❌ Don't

- 상단 바 · 화면을 오가는 1차 Line Tabs · 시트 머리를 숨기기.
- 일정 거리를 지나면 높이를 접어 목록을 당기기.
- 숨은 단추에 초점을 남기기 · 줄이기에서도 움직이기.
- 바탕 없이 숨겨 아래 줄이 비치게.

## Specification

`scroll-auto-hide.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 숨는 머리를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — scroll-auto-hide.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-auto-hide)
