# Aspect Ratio

> 폭이 정해지면 비율로 높이가 정해지는 상자 하나. 모서리 · 윤곽 · 바탕 · 불러오는 동안 · 대체 그림이 없고, 자식 하나가 상자를 채운다. 동영상 · 지도 · 바깥 페이지처럼 그림이 아니면서 비율만 지키면 되는 자리에 쓴다 — 사진 · 카드 그림 · 규정 그림은 [Image Frame](image-frame.md) 이다(그 안의 비율 상자가 이것이다).

구조는 당근 [SEED Aspect Ratio](https://seed-design.io/react/components/aspect-ratio)(Apache-2.0)를 따른다 — "가로(width)가 정해지면 비율에 따라 세로(height)가 자동으로 결정되는 레이아웃 컨테이너", 기본 4:3, 자식 하나, 모서리 0. SEED 에는 이 부품의 디자인 문서가 없고 React 문서뿐이다. 비율은 Image Frame 과 같은 여덟 가지다 — 맨 아래 "SEED 와 다른 점"(2026-10-04 사용자 결정). 옛 Aspect Ratio(Radix · 권장 16:9 · 4:3 · 1:1 · 3:4 · 21:9 · 2:1 · 자식이 모서리 · 바탕을 맡음)를 대신한다.

수치 원본은 [`aspect-ratio.yaml`](aspect-ratio.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 비율 상자 — 4:3 기본 · 16:9 동영상 · 카드 1.586 — 라이트 · 다크](../../site/components/specs/aspect-ratio.tsx#hero)

### 직접 골라 보기

비율과 부모 폭을 고르면 스펙대로 그린 상자와 그 코드가 바뀐다. 폭을 바꾸면 높이가 비율대로 따라간다.

[그림: 플레이그라운드](../../site/components/specs/aspect-ratio.tsx#playground)

## Anatomy

[그림: 비율 상자와 그 상자를 채운 자식 하나](../../site/components/specs/aspect-ratio.tsx#anatomy)

| ⓐ Root | 비율 상자 — 폭은 부모, 높이는 폭 ÷ 비율. 모서리 · 바탕이 없다. |
| ⓑ Child | 자식 하나 — 상자를 채운다. 동영상은 가운데를 남겨 자른다(cover). |

[표: 부위](aspect-ratio.yaml#slots)

## Properties

### Ratio

비율은 여덟 가지다 — SEED 의 일곱(1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3)과 카드 1.586. 기본은 4:3 이다. 이 밖의 비율(옛 3:4 · 21:9 · 황금비 같은 숫자)을 만들지 않는다 — 비율이 늘면 한 화면의 그림 · 상자가 제각각이 된다.

YAML 의 비율 값은 모두 `"W / H"` 글이다(`"1 / 1"` · `"16 / 9"` · `"1.586 / 1"`) — 브라우저가 계산값으로 쓰는 꼴(`getComputedStyle` 의 `aspect-ratio`)이라 검사기가 글 그대로 맞추고, 앱은 `/` 로 나눠 W ÷ H 를 쓴다.

[그림: 같은 폭에 여덟 비율](../../site/components/specs/aspect-ratio.tsx#ratio)

[표: 비율](aspect-ratio.yaml#ratio)

[표: 공통](aspect-ratio.yaml#base.enabled)

### State

상태는 `enabled` 하나다 — 상자일 뿐이라 누르지 않고 초점이 서지 않는다. 누르면 무언가 되는 자리는 감싼 버튼 · 링크가 상태를 가진다.

## Guidelines

### 그림은 Image Frame, 그 밖이 Aspect Ratio

사진 · 카드 그림 · 규정 그림처럼 그림 파일을 보이는 자리는 [Image Frame](image-frame.md) 이다 — 모서리(폭으로) · 투명 윤곽 · 불러오는 동안의 스켈레톤 · 대체 그림 · 그림 위 배지를 함께 가진다. Aspect Ratio 에 `<img>` 를 넣고 모서리 · 바탕을 손으로 두르면 그 넷이 화면마다 갈린다(지금 카드 그림 모서리가 12 · 6 · 4 · 8 로 갈린 까닭이다). Aspect Ratio 는 동영상 · 지도 · 바깥 페이지 · 차트처럼 비율만 지키면 되는 자리에 쓴다.

[그림: 카드 그림은 Image Frame · 동영상은 Aspect Ratio — Aspect Ratio 에 그림을 넣고 모서리를 손으로 두른 화면](../../site/components/specs/aspect-ratio.tsx#which-guide)

### 한 목록 · 격자는 한 비율

같은 목록 · 격자 안에서는 비율을 하나로 맞춘다 — 칸마다 비율이 다르면 줄 높이가 들쭉날쭉해진다. 한 화면 전체에 쓰는 비율의 수는 정하지 않는다 — 상세 위 16:9 · 아래 1:1 격자 · 카드 1.586 이 한 화면에 함께 날 수 있다.

[그림: 한 격자는 한 비율 · 칸마다 다른 비율](../../site/components/specs/aspect-ratio.tsx#ratio-guide)

## 코드

레시피 `recipes/shadcn/components/ui/aspect-ratio.tsx` 를 쓴다 — `AspectRatio` 는 `ratio`(`"1:1"` · `"2:1"` · `"16:9"` · `"4:3"` · `"6:7"` · `"4:5"` · `"2:3"` · `"card"`, 기본 `"4:3"`)와 자식 하나를 받는다. 폭은 부모가 정하고, 그 밖은 `div` 속성이다. 앱은 `AspectRatio(aspectRatio: …)` 에 같은 여덟 값을 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 동영상 — 16:9

[그림: 안내 동영상 16:9](../../site/components/specs/aspect-ratio.tsx#ex-video)

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio="16:9">
  <video src={guide.url} controls preload="metadata" className="size-full object-cover" aria-label="자산 연결 안내 동영상" />
</AspectRatio>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 부모 폭이 바뀜 | 높이가 비율대로 다시 정해진다 |
| 내용이 오기 전 | 상자가 먼저 자리를 잡는다 — 내용이 와도 줄이 밀리지 않는다 |
| 누르기 · 키보드 | 없다 — 자식(동영상 · 지도)의 동작이다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 상자는 역할 · 이름이 없다 — 자식이 말한다(동영상의 `aria-label` · 자막, 지도의 이름) |
| **WCAG 1.4.10** Reflow | 부모 폭이 줄면 높이가 비율대로 줄어든다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | 없다(SEED 와 같다 — 자식이 말한다) |

## Do / Don't

### ✅ Do

- 동영상 · 지도 · 바깥 페이지처럼 그림이 아닌 자리의 비율.
- 여덟 비율 안에서 — 같은 목록 · 격자는 하나로.
- 부모가 폭을 정한다.

### ❌ Don't

- 사진 · 카드 그림을 Aspect Ratio 로 — 모서리 · 윤곽 · 대체 그림이 빠진다(Image Frame 이다).
- 상자에 모서리 · 바탕 · 테두리를 손으로 두르기.
- 3:4 · 21:9 · 임의의 숫자 비율.

## Specification

`aspect-ratio.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Aspect Ratio 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — aspect-ratio.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#aspect-ratio)

## SEED 와 다른 점

- **비율을 여덟 가지로 묶는다** — SEED React 는 아무 숫자나 받는다(Figma 의 Image Frame 은 일곱 가지다). groo 는 그 일곱에 카드 1.586 을 더해 Image Frame 과 같은 여덟 가지만 쓴다.
- **그림에는 쓰지 않는다** — SEED 도 그림은 Image Frame 이지만 Aspect Ratio 예제에 `<img>` 를 넣는다. groo 는 그림을 모두 Image Frame 으로 그린다.

## Migration notes

### 2026-10-22 — 한 목록 · 격자는 한 비율

"한 화면에 쓰는 비율은 한두 가지다"(31dbaa9 — 10-04 이미지 비교 페이지에 없다)를 걷고, 까닭(줄 높이가 들쭉날쭉)이 닿는 "같은 목록 · 격자 안에서는 하나로" 만 남겼다 — 한 화면 전체의 비율 수는 정하지 않는다(남은 규칙 R6). 사용자 결정 — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L. 값 변경 없음.

### 2026-10-08 — 비율 값을 "W / H" 글 하나로

YAML 이 `1` · `2` · `1.586` 은 숫자로, `16 / 9` · `4 / 3` · `6 / 7` · `4 / 5` · `2 / 3` 은 글로 읽혀(YAML 은 나누기를 하지 않는다) 제품 검사기가 여덟 중 숫자 셋만 쟀다(desk-front #428). 화면은 같았고 잃은 것은 검사뿐이다. 여덟 모두 브라우저 계산값과 같은 꼴의 글(`"1 / 1"` · `"2 / 1"` · `"16 / 9"` · `"4 / 3"` · `"6 / 7"` · `"4 / 5"` · `"2 / 3"` · `"1.586 / 1"`)로 적었다 — 검사기는 글 그대로 맞춘다(제품의 재는 법도 숫자 비교에서 글 비교로 바꾼다). 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 4.

### 2026-10-04 — SEED Aspect Ratio 로 다시 쓴다

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X)의 "따라오는 것" 에서 정했다 — 비율은 SEED 일곱 + 카드 1.586, 기본 4:3, 3:4 · 21:9 는 걷는다. 그림은 새로 둔 [Image Frame](image-frame.md) 이 맡는다. 옛 스펙(Radix `AspectRatio` · 권장 비율 여섯 · 자식이 모서리 `radius-md` · 바탕 `surface-input` · `object-fit` 을 정함)은 `aspect-ratio.history/v-pre-seed-image.*` 다.

| 옛 | 새 |
|---|---|
| 권장 16:9 · 4:3 · 1:1 · 3:4 · 21:9 · 2:1, 숫자 자유 | 1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3 · 카드 1.586, 기본 4:3 |
| 이미지 · 카드 썸네일 · 아바타 격자의 비율 | 그림은 Image Frame, 사람은 Avatar — 이 부품은 그림이 아닌 자리만 |
| 자식이 모서리 8 · 바탕 · fit 을 정함 | 상자는 모서리 0 · 바탕 없음, 동영상은 cover |

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **groo 의 이 부품을 쓰는 곳이 없다** — Desk 웹은 CSS `aspect-ratio` 를 손으로 쓴다(카드 그림 틀 `pages/card-benefit/ui/CardBenefitPage.tsx:191-226` · `CardBenefitDetailDialog.tsx:92-101`, 스켈레톤 셋, 통계의 정사각 `pages/stats/ui/StatsPage.tsx:1790`). 앱은 Flutter `AspectRatio` 를 여덟 곳에 쓴다 — 카드 그림(`features/card/presentation/card_benefit_detail_sheet.dart:308 · 625` · 진입 없는 `card_detail_screen.dart:64 · 261`), 별숲 그림(`features/constellation/presentation/my_sky_card.dart:145` · `night_sky_hero.dart:119`), 통계(`features/stats/presentation/stats_screen.dart:926 · 1709`). 카드 그림은 Image Frame 으로, 그림이 아닌 통계 · 나의 별숲 자리(1:1)는 이 부품의 여덟 비율로 옮긴다. 별숲 히어로 안의 별자리 상자(1.45)는 그림 안 좌표 상자라 이 부품의 대상이 아니다 — 그림이 정한다(바깥 히어로는 높이 168 / 208 고정, 2026-10-21 사용자 결정 — 03-G 결정 6 A — 4:3 으로 맞추거나 아홉째 비율을 더하지 않는다).
- 옛 스펙의 "기존 `aspect-ratio.tsx` 는 Radix 그대로" 는 레시피 이야기였다 — 제품에는 그 부품이 없었다.
