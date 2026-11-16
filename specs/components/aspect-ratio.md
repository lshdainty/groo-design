# Aspect Ratio

> 폭이 정해지면 비율로 높이가 정해지는 상자로, 동영상 · 지도 · 바깥 페이지처럼 그림이 아니면서 비율만 지키면 되는 자리에 씁니다. 사진 · 카드 그림 · 규정 그림은 [Image Frame](image-frame.md) 을 씁니다(그 안의 비율 상자가 이것입니다).

모서리 · 윤곽 · 바탕 · 불러오는 동안 · 대체 그림이 없고, 자식 하나가 상자를 채웁니다. 기본 비율은 4:3 이고, 비율은 Image Frame 과 같은 여덟 가지입니다.

수치 원본은 [`aspect-ratio.yaml`](aspect-ratio.yaml)입니다.

[그림: 비율 상자 — 4:3 기본 · 16:9 동영상 · 카드 1.586 — 라이트 · 다크](../../site/components/specs/aspect-ratio.tsx#hero)

### 직접 골라 보기

비율과 부모 폭을 고르면 스펙대로 그린 상자와 그 코드가 바뀝니다. 폭을 바꾸면 높이가 비율대로 따라갑니다.

[그림: 플레이그라운드](../../site/components/specs/aspect-ratio.tsx#playground)

## Anatomy

[그림: 비율 상자와 그 상자를 채운 자식 하나](../../site/components/specs/aspect-ratio.tsx#anatomy)

| ⓐ Root | 비율 상자 — 폭은 부모, 높이는 폭 ÷ 비율. 모서리 · 바탕이 없습니다. |
| ⓑ Child | 자식 하나 — 상자를 채웁니다. 동영상은 가운데를 남겨 자릅니다(cover). |

[표: 부위](aspect-ratio.yaml#slots)

## Properties

### Ratio

비율은 여덟 가지입니다 — 1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3 과 카드 1.586. 기본은 4:3 입니다. 이 밖의 비율(3:4 · 21:9 · 황금비 같은 숫자)을 만들지 않습니다 — 비율이 늘면 한 화면의 그림 · 상자가 제각각이 되기 때문입니다.

YAML 의 비율 값은 모두 `"W / H"` 글입니다(`"1 / 1"` · `"16 / 9"` · `"1.586 / 1"`). 브라우저가 계산값으로 쓰는 꼴(`getComputedStyle` 의 `aspect-ratio`)이라 검사기가 글 그대로 맞추고, 앱은 `/` 로 나눠 W ÷ H 를 씁니다.

[그림: 같은 폭에 여덟 비율](../../site/components/specs/aspect-ratio.tsx#ratio)

[표: 비율](aspect-ratio.yaml#ratio)

[표: 공통](aspect-ratio.yaml#base.enabled)

### State

상태는 `enabled` 하나입니다 — 상자일 뿐이라 누르지 않고 초점이 서지 않습니다. 누르면 무언가 되는 자리는 감싼 버튼 · 링크가 상태를 가집니다.

## Guidelines

### 그림은 Image Frame, 그 밖이 Aspect Ratio

사진 · 카드 그림 · 규정 그림처럼 그림 파일을 보이는 자리는 [Image Frame](image-frame.md) 을 씁니다 — 모서리(폭으로) · 투명 윤곽 · 불러오는 동안의 스켈레톤 · 대체 그림 · 그림 위 배지를 함께 가집니다. Aspect Ratio 에 `<img>` 를 넣고 모서리 · 바탕을 손으로 두르면 그 넷이 화면마다 갈립니다. Aspect Ratio 는 동영상 · 지도 · 바깥 페이지 · 차트처럼 비율만 지키면 되는 자리에 씁니다.

그림 안에서 좌표를 잡는 상자(별숲 히어로 안의 별자리 상자 1.45)는 이 부품의 대상이 아닙니다 — 그림이 정합니다. 높이가 정해진 띠(별숲 히어로 168 / 208)도 비율로 맞추지 않으며, 여덟 비율 밖의 비율을 더하지 않습니다.

[그림: 카드 그림은 Image Frame · 동영상은 Aspect Ratio — Aspect Ratio 에 그림을 넣고 모서리를 손으로 두른 화면](../../site/components/specs/aspect-ratio.tsx#which-guide)

### 한 목록 · 격자는 한 비율

같은 목록 · 격자 안에서는 비율을 하나로 맞춥니다 — 칸마다 비율이 다르면 줄 높이가 들쭉날쭉해지기 때문입니다. 한 화면 전체에 쓰는 비율의 수는 정하지 않습니다 — 상세 위 16:9 · 아래 1:1 격자 · 카드 1.586 이 한 화면에 함께 날 수 있습니다.

[그림: 한 격자는 한 비율 · 칸마다 다른 비율](../../site/components/specs/aspect-ratio.tsx#ratio-guide)

## 코드

레시피 `recipes/shadcn/components/ui/aspect-ratio.tsx` 를 씁니다. `AspectRatio` 는 `ratio`(`"1:1"` · `"2:1"` · `"16:9"` · `"4:3"` · `"6:7"` · `"4:5"` · `"2:3"` · `"card"`, 기본 `"4:3"`)와 자식 하나를 받습니다. 폭은 부모가 정하고, 그 밖은 `div` 속성입니다. 앱은 `AspectRatio(aspectRatio: …)` 에 같은 여덟 값을 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

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
| 부모 폭이 바뀜 | 높이가 비율대로 다시 정해집니다 |
| 내용이 오기 전 | 상자가 먼저 자리를 잡습니다 — 내용이 와도 줄이 밀리지 않습니다 |
| 누르기 · 키보드 | 없습니다 — 자식(동영상 · 지도)의 동작입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 상자는 역할 · 이름이 없고, 자식이 말합니다(동영상의 `aria-label` · 자막, 지도의 이름) |
| **WCAG 1.4.10** Reflow | 부모 폭이 줄면 높이가 비율대로 줄어듭니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않습니다 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다 |
| **ARIA** | 없습니다 — 자식이 말합니다 |

## Do / Don't

### ✅ Do

- 동영상 · 지도 · 바깥 페이지처럼 그림이 아닌 자리의 비율에 씁니다.
- 여덟 비율 안에서 고르고, 같은 목록 · 격자는 하나로 맞춥니다.
- 부모가 폭을 정합니다.

### ❌ Don't

- 사진 · 카드 그림을 Aspect Ratio 로 그리지 않습니다 — 모서리 · 윤곽 · 대체 그림이 빠집니다(Image Frame 을 씁니다).
- 상자에 모서리 · 바탕 · 테두리를 손으로 두르지 않습니다.
- 3:4 · 21:9 · 임의의 숫자 비율을 쓰지 않습니다.

## Specification

`aspect-ratio.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다. 웹 · 앱이 Aspect Ratio 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — aspect-ratio.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#aspect-ratio)
