# Divider

> 내용 사이를 나누는 1px 선. 같은 묶음 안은 들인 선, 묶음 사이는 끝까지 선이고, 크게 다른 내용 사이는 선이 아니라 8 간격(회색 바탕 위 흰 층 사이)이다. 반복되는 목록 줄 사이는 [List](list.md) 의 줄 사이 선(필요할 때만)이다.

구조는 당근 [SEED Divider](https://seed-design.io/components/divider)(Apache-2.0)를 따른다 — 1px 선 · 가로 · 세로 · 들임(16), 나누는 세기 셋(들인 선 · 끝까지 선 · 8 간격). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). 옛 Separator 를 대신한다 — 이름도 SEED 대로 Divider 다.

수치 원본은 [`divider.yaml`](divider.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 설정 묶음 · 거래 상세 · 통계 세 칸 — 라이트 · 다크](../../site/components/specs/divider.tsx#hero)

### 직접 골라 보기

방향 · 들임 · 장식 여부를 고르면 스펙대로 그린 선과 그 코드, 보조 기술이 읽는지가 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/divider.tsx#playground)

## Anatomy

[그림: 1px 선 — 끝까지 · 양끝 16 들임 · 세로](../../site/components/specs/divider.tsx#anatomy)

| ⓐ Line | 선 — 1px. 바깥 여백이 없다. |

[표: 부위](divider.yaml#slots)

## Properties

### 색 · 두께

선은 하나다 — 1px `stroke-neutral-subtle`(흰 바탕 1.15 · 다크 1.30). SEED 의 기본 선(neutral-muted, 1.15)과 같은 진하기라 새 토큰 없이 둔다. 굵은 선 · 짙은 선 · 점선을 두지 않는다 — 더 세게 나눠야 하면 선이 아니라 간격이다(아래 "세 가지 나누기").

[표: 공통](divider.yaml#base.enabled)

### Orientation

`horizontal` *(기본)* 은 세로로 쌓인 내용 사이 — 부모 폭 전체. `vertical` 은 가로로 놓인 칸 사이(통계 세 칸 · 버튼 묶음) — 높이는 부모가 정한다.

[그림: 가로 · 세로 — 통계 세 칸 사이의 세로선](../../site/components/specs/divider.tsx#orientation)

[표: 방향](divider.yaml#orientation)

### Inset

`full` *(기본)* 은 끝까지, `inset` 은 양끝 16 을 들인다(세로선은 위아래 16). 같은 묶음 안을 나눌 때 들인다 — 묶음 사이 · 액션 영역 위는 끝까지다. 화면 여백(24)에 붙은 목록 줄 사이는 Divider 가 아니라 [List](list.md) 의 줄 사이 선(들임 24 — 줄 글과 맞는다)이다.

[그림: 끝까지 · 들임](../../site/components/specs/divider.tsx#inset)

[표: 들임](divider.yaml#compound)

### State

상태가 없다 — 정적인 선이다(누르기 · 포커스 없음).

## Guidelines

### 세 가지 나누기

| 세기 | 쓰는 것 | 자리 |
|---|---|---|
| 약함 | 들인 선(`inset`) | 같은 묶음 안 — 상세의 키-값 줄 묶음 · 카드 안 위아래 |
| 중간 | 끝까지 선(`full`) | 묶음 사이 · 액션 영역(바닥 버튼) 위 · 스크롤되는 본문 위 머리 |
| 강함 | 8 간격 — 선이 아니다 | 크게 다른 내용 사이 — 회색 바탕(`bg-layer-basement`) 위에 흰 층(`bg-layer-default`) 묶음을 8 띄워 놓는다 |

"8px 구분선" 은 없다 — 두꺼운 회색 막대를 그리지 않고 바탕 층 사이 간격으로 만든다(SEED).

[그림: 들인 선 · 끝까지 선 · 8 간격 — 한 화면](../../site/components/specs/divider.tsx#strength-guide)

### 꼭 필요할 때만

선을 두기 전에 여백 · 제목 · 바탕 층으로 갈리는지 먼저 본다. 반복되는 목록 줄은 줄의 위아래 여백이 줄을 가르므로 선이 없는 것이 기본이다 — 촘촘한 목록에만 [List](list.md) 의 줄 사이 선(같은 1px `stroke-neutral-subtle`). 메뉴 묶음 사이 · 대화상자 머리 아래(스크롤될 때)의 선도 같은 값이다.

[그림: 여백으로 갈리는 목록 · 줄마다 선](../../site/components/specs/divider.tsx#needed-guide)

### 마지막에는 두지 않는다

선은 내용 사이에만 둔다 — 화면 · 묶음의 마지막 요소 아래, 카드 맨 위 · 맨 아래에는 두지 않는다.

[그림: 마지막 묶음 아래 선이 없는 화면 · 있는 화면](../../site/components/specs/divider.tsx#last-guide)

### 장식이 기본

선은 눈으로 묶음을 가르는 장식이라 보조 기술에 숨긴다 — 묶음은 제목 · 목록 구조로 알린다. 문서의 장처럼 보조 기술도 "구분선" 을 알아야 하는 자리만 의미 있는 구분선(`role="separator"`)으로 둔다.

## 코드

레시피 `recipes/shadcn/components/ui/divider.tsx` 를 쓴다 — `Divider`. `orientation`(`"horizontal"` 기본 · `"vertical"`) · `inset`(기본 `false` — YAML 의 `full`, `true` 면 `inset`) · `decorative`(기본 `true` — 보조 기술에 숨긴다, `false` 면 `role="separator"`)를 받는다. `<hr>` 이 아니라 `<div>` 로 그린다. 위아래 · 좌우 간격은 쓰는 자리가 정한다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 묶음 사이 · 같은 묶음 안

[그림: 거래 상세 — 키-값 묶음 안은 들인 선, 묶음 사이는 끝까지](../../site/components/specs/divider.tsx#ex-basic)

```tsx
import { Divider } from "@/components/ui/divider"

<div>
  <p className="flex justify-between py-x3">결제 수단<span>신한카드</span></p>
  <Divider inset />
  <p className="flex justify-between py-x3">할부<span>3개월</span></p>
</div>
<Divider />
<section aria-labelledby="memo-title">…</section>
```

### 세로 — 칸 사이

[그림: 통계 세 칸 — 수입 · 지출 · 남은 돈](../../site/components/specs/divider.tsx#ex-vertical)

```tsx
<div className="flex items-stretch">
  <p className="flex-1 py-x4 text-center">수입<br />{formatWon(income)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">지출<br />{formatWon(expense)}</p>
  <Divider orientation="vertical" inset />
  <p className="flex-1 py-x4 text-center">남은 돈<br />{formatWon(rest)}</p>
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 모든 인터랙션 | 없다 — 정적인 선. 포커스가 서지 않는다 |
| 세로선의 부모에 높이가 없음 | 선이 0 이 된다 — 부모(flex)가 높이를 정해야 한다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 선은 장식이다(흰 바탕 1.15 · 다크 1.30) — 묶음은 여백 · 제목 · 구조가 알린다. 선만으로 정보를 나르지 않는다 |
| **WCAG 1.3.1** Info and Relationships | 묶음은 제목(`h2` …) · 목록(`ul`) · `section` 으로 — 선에 기대지 않는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | 기본 `<div aria-hidden="true">`(장식 — 읽지 않는다). `decorative={false}` 면 `role="separator"` · 세로선은 `aria-orientation="vertical"` |

## Do / Don't

### ✅ Do

- 같은 묶음 안은 들인 선, 묶음 사이는 끝까지 선.
- 크게 다른 내용은 선 대신 8 간격(바탕 층).
- 선은 꼭 필요할 때만, 내용 사이에만.

### ❌ Don't

- 두꺼운 선 · 짙은 선 · 8px 회색 막대.
- 목록 줄마다 선 + 여백을 함께.
- 화면 · 묶음 마지막 아래의 선.
- 선 색을 자리마다 다르게(`border-default` · `border-subtle` …).

## Specification

`divider.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Divider 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — divider.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#divider)

## SEED 와 다른 점

- **색은 `stroke-neutral-subtle` 하나** — SEED 는 기본 neutral-muted(투명도 있는 검정 6.3%) · 반복 항목용 neutral-subtle(4.7%) 둘이다. porest 의 `stroke-neutral-subtle`(#EDEFF3)이 SEED 기본과 같은 진하기(흰 바탕 1.15)라 새 토큰 없이 한 색으로 둔다.
- **기본이 장식** — SEED 는 `<hr>`(보조 기술이 "구분선" 으로 읽는다)가 기본이고 장식은 `as="div"` 로 바꿔야 한다. porest 는 장식이 기본이고 의미 있는 구분선만 `role="separator"` 다(SEED 포용적 디자인의 "장식 요소는 숨긴다" 를 기본으로).
- **들임(inset)은 코드에 있다** — SEED 디자인 문서는 "Figma 에서만" 이라 쓰지만 React · Lynx 에 있다. porest 도 둔다(16).

## Migration notes

### 2026-10-03 — SEED Divider 로(옛 Separator 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)의 "따라오는 것" 으로 정했다 — 선 하나 `stroke-neutral-subtle`(SEED 기본과 같은 진하기 — 새 토큰 없이), 반복 줄 사이는 List 규칙, 크게 다른 내용 사이는 선이 아니라 8 간격, 들임 16, 기본은 장식. 옛 Separator(`border-default` 1px · Radix · `decorative` 기본)와 DESIGN.md Divider 절(`divider-light` · `divider-dark` 1px `border-default`)을 대신한다 — 옛 스펙은 `separator.history/v-pre-seed-display.*`. 레시피 이름도 `Separator` → `Divider` 로 바꾼다(부르는 곳은 레시피 차례에 옮긴다).

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **`subtle` 과 `default` 가 같은 값** — 웹 `index.css:68-69 · 288-289`, 앱 `app/theme/tokens.dart:230-231 · 324-325` 에서 둘 다 `#E5E8EF` · 다크 `#353B4D` 라 `LedgerDivider subtle`(`shared/ui/porest/ledger.tsx:103`)이 아무것도 바꾸지 않는다. 구분선은 `stroke-neutral-subtle` 하나로(라이트 1.23 → 1.15).
- **나누는 방법이 제각각** — 웹: `Separator` 6 · `LedgerDivider` 5 · 인라인 `borderTop/Bottom` 48 · `border-t/b` 52 · `divide-y` 10 · 1px 높이 div 8 · `porest.css` 6. 앱: `PDivider` 26 · 날 `Divider` 9 · `Border(top/bottom)` 48 · 세로 1px 6. HR: `Separator` 10 · 메뉴 구분선 10(#eeeeee 1.16 · 다크 #353535 1.33). 모두 Divider · List 줄 사이 선으로.
- **같은 줄이 화면마다 다르게 나뉜다** — 웹 `LedgerRow` 가 가계부에서는 선이 없고 할 일 · 메모에서는 들인 선이다(List 규칙으로 맞춘다).
- **스펙끼리 어긋났다** — 옛 separator.md · DESIGN.md 는 `border-default`(1.23), list.md 의 줄 사이 선은 `stroke-neutral-subtle`(1.15)이었다. 이제 하나다.
