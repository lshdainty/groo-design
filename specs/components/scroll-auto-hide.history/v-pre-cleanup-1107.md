# Scroll Auto Hide

> 스크롤 상자 맨 위에 붙은 영역이 아래로 스크롤하면 그 거리만큼 숨고, 위로 스크롤하면 같은 거리만큼 드러난다 — 폰 가계부 · 할 일 원장의 머리(월 · 총액 · 주 달력), 거래 검색 · 카드 혜택 화면의 거르는 줄처럼 목록을 넓게 보고 싶은 자리. 상단 바와 탭은 숨지 않는다.

구조는 당근 [SEED Breeze Scroll Auto Hide](https://seed-design.io/breeze/components/scroll-auto-hide)(Apache-2.0)를 그대로 따른다 — "아래로 스크롤할 때 고정 영역을 숨기고, 위로 스크롤하면 같은 거리만큼 다시 드러난다 … 필터, 탭, 보조 헤더처럼 콘텐츠 공간을 더 넓게 쓰고 싶은 영역". 스크롤하는 동안 거리를 1:1 로 따라가고, 끝나면 50% 를 기준으로 200ms 에 다 숨거나 다 드러나며, 높이를 바꾸지 않고 `translate3d()` 로만 옮긴다. 모션 줄이기면 자동 숨김을 끄고, 숨은 영역 안으로 초점이 오면 드러낸다(2026-10-10 사용자 결정 15A). 사용자가 스크롤바를 묻는 14번에 "당근에 자동으로 접히고 펴지는 컴포넌트 … 그거 사용하면 될 것 같아" 라고 한 컴포넌트다 — 스크롤바가 아니라 이것이어서 따로 물어 정했다. groo 에 처음 두는 스펙이다.

수치 원본은 [`scroll-auto-hide.yaml`](scroll-auto-hide.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 폰 가계부 10월 — 내리면 월 · 총액 · 주 달력이 숨고 목록이 화면을 다 쓴다, 조금 올리면 드러난다 — 라이트 · 다크](../../site/components/specs/scroll-auto-hide.tsx#hero)

### 직접 골라 보기

화면을 직접 스크롤하거나 "내렸다 조금 올리기" 를 누르면 머리가 따라 숨고 드러나며, 멈추면 50% 를 기준으로 스냅한다. "숨은 머리로 초점 옮기기" 와 모션 줄이기 스위치도 있다 — 아래 글이 숨은 높이 · 목록이 보이는 높이를 잰다.

[그림: 플레이그라운드](../../site/components/specs/scroll-auto-hide.tsx#playground)

## Anatomy

[그림: 스크롤 상자 안 맨 위의 숨는 영역(sticky top 0) — 위로 옮겨 숨고, 높이는 그대로](../../site/components/specs/scroll-auto-hide.tsx#anatomy)

| ⓐ Scroll Container | 스크롤 상자 — 쓰는 쪽. 상단 바 · 탭 아래부터다. |
| ⓑ Root | 숨는 영역 — 상자 맨 위에 붙고(`sticky` · `top: 0`) 스크롤 거리만큼 위로 옮겨 숨는다. 바탕은 쓰는 쪽. |
| ⓒ Content | 그 아래 목록 — 머리가 숨으면 화면을 다 쓴다. |

[표: 부위](scroll-auto-hide.yaml#slots)

## Properties

### 따라가고, 멈추면 스냅

스크롤하는 동안 영역은 스크롤 거리를 그대로 따라간다 — 아래로 내린 만큼 숨고, 위로 올린 만큼 드러난다(목록 쪽에서 보면 머리가 목록과 함께 밀려 올라가고, 거꾸로 올리면 바로 내려온다). 스크롤이 끝나면 영역 높이의 50% 를 기준으로 다 숨거나 다 드러난다 — 200ms `motion-ease-enter`(SEED 의 200ms · `cubic-bezier(0, 0, 0.15, 1)` 과 같은 값). 영역은 `translate3d()` 로 옮기기만 하고 높이를 바꾸지 않는다 — 목록이 접히는 만큼 당겨지지 않아 튀지 않는다. ScrollTimeline 이 있는 브라우저는 스크롤과 이동을 브라우저가 직접 잇고, 없으면 scroll 이벤트로 같은 동작을 한다(SEED).

[그림: 900 내림 → 머리 227 다 숨음 · 160 올림 → 67 남아 50% 아래라 다 드러남](../../site/components/specs/scroll-auto-hide.tsx#follow)

[표: 숨는 영역](scroll-auto-hide.yaml#base.shown)

[표: 상태](scroll-auto-hide.yaml#matrix)

[표: 모션](scroll-auto-hide.yaml#motion)

### 모션 줄이기 · 초점

기기에서 동작 줄이기를 켜면 자동 숨김을 끈다 — 위치가 움직이지 않게 머리는 늘 보이고 목록이 그 아래에서 스크롤한다(SEED). 숨은 영역 안으로 키보드 초점이 오면(`Tab` 으로 "소비 요약" 에) 바로 다 드러낸다 — 보이지 않는 단추에 초점이 머물지 않는다.

[그림: 모션 줄이기 — 머리가 늘 보임 · 숨은 머리의 "소비 요약" 에 초점 → 다 드러남](../../site/components/specs/scroll-auto-hide.tsx#reduced)

[표: 모션 줄이기](scroll-auto-hide.yaml#motionSetting)

### 바탕 · 겹침

바탕과 z-index 는 쓰는 쪽이 정한다(SEED) — 바탕이 없으면 숨는 동안 아래 줄이 비친다. 원장 머리는 목록과 같은 흰 면(`bg-layer-default`)이고, z-index 는 스크롤 상자 안의 겹침 값 2 다 — [List](list.md) 줄 뒤 붙이개의 단추 · 링크(z 1) 위에 놓인다(지금 웹 원장 머리는 5 — `shared/ui/groo/ledger.tsx:58`). 층 토큰(`z-sticky`)이 아니다([z-index](../z-index.md) 의 "쓰는 법").

## Guidelines

### 어디에 쓰나 — 원장 머리 · 거르는 줄

폰 가계부 · 할 일 원장의 머리(월 이동 · 총액 · 소비 요약 · 주 달력 — 펼친 월 달력 · 소비 요약 카드 포함)가 Desk 웹 · 앱 모두 이 규칙으로 숨는다. 필터를 걸면 같은 자리에 나오는 필터 칩 줄도 같은 머리다. SEED 가 말하는 다른 자리(목록 위 필터 줄 · 보조 머리)도 이 규칙이다. 머리 안의 소비 요약과 월 달력은 하나만 펼친다([Collapsible](collapsible.md) — 사용자 결정 11A).

거래 검색 화면의 거르는 줄(전체 · 지출 · 수입 칩 — 40)과 카드 혜택 화면의 거르는 줄(카드 이름 검색칸 + 칩 두 줄 — 140)도 이것이다 — 바 아래 스크롤 상자 맨 위에 두고, 내리면 숨고 올리면 드러난다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-5 C). 손을 떼면 50% 를 기준으로 스냅하므로 40 줄은 20, 140 줄은 70 이상 올려야 다 드러난다(반 이상 나오면) — 그보다 적게 올리고 손을 떼면 다시 숨는다. 웹 거래 검색 화면도 같다. 검색칸이 든 바 자체(검색 화면의 제목 자리)는 숨지 않는다.

[그림: 거래 검색 · 카드 혜택 — 거르는 줄 40 · 140, 내림 · 조금 올림 · 반 넘게 올림](../../site/components/specs/scroll-auto-hide.tsx#filter-guide)

[그림: 원장 머리 — 월 · 총액 · 소비 요약 · 주 달력이 한 덩어리로 숨는다 · 필터를 걸면 필터 칩 줄](../../site/components/specs/scroll-auto-hide.tsx#place-guide)

### 숨지 않는 것

상단 바(Top Navigation)는 스크롤해도 그 자리에 있고 숨지 않는다 — 가계부 묶음의 Line Tabs 도 그 아래에 남는다(2026-10-04 결정). 경계는 이렇다 — **화면을 오가는 탭(1차 Line)은 상단 바와 함께 남고, 그 아래의 원장 머리 · 거르는 줄 · 2차 Chip Tabs 는 숨어도 된다.** SEED Breeze 문서의 첫 문장은 "필터, 탭, 보조 헤더" 를 숨는 자리로 들지만, 같은 문서의 미리보기는 탭(추천 · 구독)을 스크롤 상자 밖에 두고 필터 칩 줄만 숨긴다 — groo 는 그 미리보기와 같은 배치다(2026-10-22 사용자 결정 8B — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L). 하단 탭 바(Bottom Navigation)는 제 규칙으로 줄어든다(아래로 20 · 위로 28 · 맨 위 40) — 이 컴포넌트가 아니다. 시트 · 대화상자의 머리도 숨기지 않는다. 지금처럼 일정 거리를 지나면 높이를 접는 것(15B — 목록이 당겨지고, 손가락을 따라가지 않고, 줄이기에서도 움직이며, 접힌 단추에 초점이 들어간다)과 숨기지 않는 것(15C)은 고르지 않았다.

[그림: 숨는 머리 · 그대로인 상단 바 · Line Tabs · 따로 줄어드는 탭 바](../../site/components/specs/scroll-auto-hide.tsx#keep-guide)

### 스크롤 상자 안에

숨는 영역은 스크롤 상자 안 맨 위에 둔다(`position: sticky; top: 0`) — 화면 전체(문서)가 스크롤되면 상단 바 · 탭 아래를 스크롤 상자로 나눈다. 영역의 `transform` 은 숨기는 데 쓰므로 다른 `transform` 은 자식에 건다.

## 코드

레시피 `recipes/shadcn/components/ui/scroll-auto-hide.tsx` 를 쓴다(SEED Breeze 의 `ScrollAutoHide` 를 옮긴 새 부품 — `npx @seed-design/cli add breeze:scroll-auto-hide` 의 코드를 groo 토큰으로). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ScrollAutoHide` — 숨는 영역. `scrollContainerRef`(스크롤 상자의 ref — 필수) · `asChild`(자식 하나를 루트로), 나머지는 `div` 속성. `sticky` · `top: 0` · 1:1 따라가기 · 50% 스냅(200ms `motion-ease-enter`) · 모션 줄이기면 끔 · 초점이 들어오면 드러냄은 부품이 맡는다. 바탕 · z-index 는 `className` 으로 쓰는 쪽이.

### 가계부 원장 머리

[그림: 폰 가계부 — 머리가 숨고 드러나는 원장(웹 · 앱 같은 동작)](../../site/components/specs/scroll-auto-hide.tsx#ex-ledger)

```tsx
import { useRef } from "react"
import { ScrollAutoHide } from "@/components/ui/scroll-auto-hide"

const scrollRef = useRef<HTMLDivElement>(null)

{/* 상단 바 · 탭 아래부터가 스크롤 상자 — 숨는 머리는 그 안 맨 위 */}
<div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
  <ScrollAutoHide scrollContainerRef={scrollRef} className="z-[2] bg-bg-layer-default">
    {ledgerHeader}
  </ScrollAutoHide>
  {transactionList}
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 아래로 스크롤 | 내린 거리만큼 머리가 위로 숨는다 — 다 숨으면 그대로 |
| 위로 스크롤 | 올린 거리만큼 드러난다 — 맨 위에서는 다 보인다 |
| 스크롤이 끝남 | 절반 넘게 숨었으면 다 숨고, 아니면 다 드러난다 — 200ms |
| 숨은 머리 안으로 `Tab` | 바로 다 드러난다 |
| 모션 줄이기 | 자동 숨김을 끈다 — 머리는 늘 보인다 |
| 하단 탭 바 | 제 규칙으로 줄어든다(따로) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 2.4.11** Focus Not Obscured — Minimum(AA) | 숨은 영역 안으로 초점이 오면 바로 다 드러낸다 ✓ — 지금은 접힌 "소비 요약" 에 초점이 들어가 보이지 않는다 |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 자동 숨김을 끈다 ✓ — 지금은 줄이기에서도 220ms 로 접힌다 |
| **WCAG 1.3.2** Meaningful Sequence | 숨겨도 읽는 차례 · DOM 은 그대로 — 옮기기만 한다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 숨는 영역은 누르는 것이 아니다. 안의 단추는 그 단추의 규칙 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 |
| **ARIA** | 역할이 없다 — 숨는 영역은 그 안 내용의 역할 그대로(머리 · 단추). 숨겨도 `aria-hidden` · `inert` 를 걸지 않는다(초점이 오면 드러나므로) |

## Do / Don't

### ✅ Do

- 목록을 넓게 봐야 하는 화면의 보조 머리(원장 머리 · 거래 검색 · 카드 혜택의 거르는 줄)에.
- 스크롤 거리를 1:1 로 따라가고, 끝나면 50% 로 스냅.
- 높이를 바꾸지 않고 옮기기만 — 바탕을 칠한다.
- 모션 줄이기면 끄고, 초점이 오면 드러낸다.

### ❌ Don't

- 상단 바 · 화면을 오가는 1차 Line Tabs · 시트 머리를 숨기기.
- 일정 거리를 지나면 높이를 접어 목록을 당기기.
- 숨은 단추에 초점을 남기기 · 줄이기에서도 움직이기.
- 바탕 없이 숨겨 아래 줄이 비치게.

## Specification

`scroll-auto-hide.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 숨는 머리를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — scroll-auto-hide.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#scroll-auto-hide)

## SEED 와 다른 점

- **동작 · 값은 SEED 그대로다** — 1:1 · 50% 스냅 · 200ms enter · 모션 줄이기면 끔 · 초점이 오면 드러냄 · `translate3d` · `sticky` · `top: 0`.
- **이름을 groo 토큰으로** — 200ms 는 `motion-duration-d4`, `cubic-bezier(0, 0, 0.15, 1)` 은 `motion-ease-enter`(값이 같다, v104).
- **바탕 · z-index 를 원장 머리 값으로 정해 둔다** — 흰 면 · 2. SEED 는 쓰는 쪽에 맡긴다.

## Migration notes

### 2026-10-22 — 숨지 않는 탭의 경계

"Line Tabs 는 숨지 않는다"(10-10 15A)는 그대로 두고 경계 한 줄을 더했다 — 화면을 오가는 1차 탭은 상단 바와 함께 남고, 원장 머리 · 거르는 줄 · 2차 Chip Tabs 는 숨어도 된다(SEED Breeze 미리보기와 같은 배치). 사용자 결정 8B — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L. 고르지 않은 안: 그대로(8A). 값 변경 없음.

### 2026-10-16 — 거르는 줄도(Q-017-5 C)

사용자가 [구현 질문 Q-017 · Q-018 비교 페이지](https://claude.ai/artifact/6R7NBc4ByvxGyLy6E6tvKf)에서 정했다 — 거래 검색 · 카드 혜택 화면의 거르는 줄은 Scroll Auto Hide 다(C). 본문 맨 위에 두어 목록과 함께 올라가기(A) · 바 아래 고정(B)은 고르지 않았다. 비교 페이지가 140 줄은 30 올리면 21% 라 다시 숨고 70 을 올려야 남는 것까지 그렸다.

- **Desk 앱** — `search_screen.dart:319-345`(칩 줄 40)와 `card_screen.dart`(검색칸 + 칩 두 줄 140)가 AppBar `bottom` 에 있다 — 바 아래 스크롤 상자 맨 위의 숨는 영역으로 옮긴다.
- **Desk 웹** — 거래 검색 화면을 새로 만들 때(Top Navigation 2026-10-16) 같은 짜임으로.

### 2026-10-10 — 새로 둔다(SEED Breeze Scroll Auto Hide)

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H) 15번에서 정했다 — 스크롤하면 숨는 머리는 SEED Breeze Scroll Auto Hide(15A — 폰 가계부 · 할 일 원장 머리가 스크롤 거리를 1:1 로 따라 숨고 드러나며 멈추면 50% 스냅 200ms enter, 모션 줄이기면 늘 보임, 숨은 영역에 초점이 오면 드러냄, `translate3d` · `sticky top 0`, 바탕은 쓰는 쪽). 상단 바 · 탭은 숨지 않고 하단 탭 바는 따로 줄어든다. 지금처럼 높이 접기(15B)와 숨기지 않기(15C)는 고르지 않았다. 비교 페이지 그림은 주 달력까지 함께 숨긴다 — 지금은 총액만 접는다.

제품은 앱 적용 단계에서 옮긴다(2026-10-09 조사).

- **Desk 웹 원장 머리** — `shared/ui/groo/ledger.tsx:69-82` 의 `LedgerCollapse` 가 72px(`use-ledger-scroll.ts` `COMPACT_ENTER`)를 지나면 총액 · 인사이트 · 소비 요약을 max-height 340 → 0 + 투명도 220ms 로 접고, 24px(`COMPACT_EXIT`) 아래로 와야 다시 편다 — 목록이 그만큼 당겨지고 손가락을 따라가지 않으며, 모션 줄이기에서도 그대로 움직인다(조사 C11 · D9). 접힌 영역은 `pointer-events: none` 뿐이라 `Tab` 으로 보이지 않는 "소비 요약" 에 초점이 간다. 주 달력은 늘 남는다. `ScrollAutoHide` 로 — 월 · 총액 · 주 달력까지 한 덩어리.
- **Desk 앱 원장 머리** — 같은 자리를 `AnimatedSize` 220ms easeOut 으로 접는다(`features/expense/presentation/expense_screen.dart:424-432`, C11). 같은 동작(1:1 · 50% 스냅 200ms · 줄이기면 늘 보임 · 초점이 오면 드러냄)으로.
