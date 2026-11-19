# Image Frame

> 그림 한 장을 보이는 틀입니다. 카드 그림 · 규정 그림 · 사진처럼 그림을 비율 상자에 꽉 채워 보일 때 씁니다. 사람은 [Avatar](avatar.md), 은행 · 증권 · 카드 같은 물건의 첫 글자 타일은 [Logo Tile](logo-tile.md), 그림이 아닌 비율 상자(동영상 · 지도)는 [Aspect Ratio](aspect-ratio.md) 를 씁니다.

틀은 비율 상자 · 그림(cover) · 안쪽 1px 투명 윤곽 · 대체 그림 · 네 모서리의 그림 위 요소로 이뤄집니다. 그림 위에는 안쪽 1px 투명 윤곽을 늘 그립니다. 불러오는 동안은 같은 모서리의 [Skeleton](skeleton.md), 없거나 못 불러오면 [Content Placeholder](content-placeholder.md) 입니다. 모서리는 틀의 폭으로 고릅니다. 카드 그림은 ISO 카드 비율 1.586 에 세로 그림 돌리기와 그림 없는 카드의 면을 더합니다.

수치 원본은 [`image-frame.yaml`](image-frame.yaml)(틀)과 [`card-art.yaml`](card-art.yaml)(카드 그림 · 카드 면)입니다. 카드 면의 색은 [`institution-colors.yaml`](institution-colors.yaml)(기관 색 표 — [Logo Tile](logo-tile.md) 과 함께 씁니다)입니다.

[그림: 카드 혜택 격자 · 목록 줄의 카드 그림 · HR 규정 그림 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#hero)

### 직접 골라 보기

비율 · 폭 · 그림(사진 · 흰 그림 · 세로 카드 · 그림 없는 카드) · 상태(불러오는 중 · 다 받음 · 실패) · 그림 위 요소를 고르면 스펙대로 그린 틀과 그 코드가 바뀝니다. 폭을 줄이고 늘리면 모서리가 4 · 6 · 8 로 바뀝니다.

[그림: 플레이그라운드](../../site/components/specs/image-frame.tsx#playground)

## Anatomy

[그림: 틀 · 그림 · 안쪽 1px 윤곽, 네 모서리의 그림 위 자리에 배지와 장수 글](../../site/components/specs/image-frame.tsx#anatomy)

| ⓐ Root | 틀 — 비율 상자입니다. 폭은 부르는 쪽, 높이는 폭 ÷ 비율이고, 모서리로 자릅니다. |
| ⓑ Image | 그림 — 틀을 꽉 채웁니다(cover). 세로 카드 그림은 돌려서 채웁니다. |
| ⓒ Stroke | 안쪽 1px 윤곽 — 그림 위에 늘 그립니다. 흰 그림이 흰 바탕에 묻히지 않게 합니다. |
| ⓓ Skeleton · Fallback | 불러오는 동안은 스켈레톤, 없거나 실패하면 대체 그림을 그림 자리에 둡니다. |
| ⓔ Floater | 그림 위 자리 — 네 모서리, 모서리에서 6 입니다. 배지(solid) · 장수 글(Indicator)을 둡니다. |

[표: 부위](image-frame.yaml#slots)

## Properties

### Ratio

비율은 여덟 가지입니다 — 1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3 과 카드 1.586(ISO 카드 85.6 × 53.98). 기본은 4:3 입니다. 틀은 그림이 오기 전에 비율로 자리를 잡아, 그림이 와도 줄이 밀리지 않습니다. 카드 그림은 목록 · 격자 · 상세 모두 1.586 입니다 — 최대 높이를 걸어 비율을 바꾸지 않습니다.

비율 값은 여덟 모두 브라우저 계산값과 같은 꼴의 글(`"1 / 1"` · `"2 / 1"` · `"16 / 9"` · `"4 / 3"` · `"6 / 7"` · `"4 / 5"` · `"2 / 3"` · `"1.586 / 1"`)로 적습니다. 검사기는 이 글을 그대로 맞춥니다.

[그림: 같은 폭에 여덟 비율 — 카드 1.586 은 ISO 카드](../../site/components/specs/image-frame.tsx#ratio)

[표: 비율](image-frame.yaml#ratio)

[표: 틀](image-frame.yaml#base.loaded@root)

[표: 그림](image-frame.yaml#base.loaded@image)

### 모서리 — 폭으로

모서리는 틀의 폭으로 고릅니다 — 24 이하 4(`radius-r1`), 48 이하 6(`radius-r1_5`), 그 위 8(`radius-r2`), 좌우가 화면 끝에 닿는 그림은 0 입니다. 작은 그림일수록 모서리를 줄입니다 — 24 그림에 8 을 주면 폭의 1/3 이 둥글어 알약처럼 보이기 때문입니다. 고정 폭(목록 · 썸네일)은 그 폭으로, 부모 폭을 채우는 틀은 8 입니다. 불러오는 동안의 스켈레톤 · 대체 그림도 같은 모서리입니다(틀이 자릅니다).

[그림: 폭으로 고른 모서리 — 24 → 4 · 40 → 6 · 56 → 8 · 150 → 8 · 화면 폭 0](../../site/components/specs/image-frame.tsx#radius)

[표: 모서리](image-frame.yaml#radius)

### 윤곽

그림 위에 안쪽 1px 윤곽을 늘 그립니다 — `stroke-neutral-overlay`(검정 4.7% · 다크 흰 5%)입니다. 투명한 선이라 흰 그림 둘레는 살짝 잡히고(흰 바탕 위 1.11:1) 어두운 그림 위에서는 보이지 않습니다. 불투명한 선(`stroke-neutral-subtle`)을 두르면 어두운 사진 · 카드 둘레에 옅은 테가 생깁니다. 끄는 속성이 없습니다 — 스켈레톤 · 대체 그림 · 카드 면 위에도 같은 선입니다.

[그림: 흰 그림 · 어두운 그림 위 투명 윤곽 — 라이트 · 다크, 모서리 4배](../../site/components/specs/image-frame.tsx#stroke)

[표: 윤곽](image-frame.yaml#base.loaded@stroke)

### Fit

사진 · 카드 그림은 꽉 채우고 가운데를 남겨 자릅니다(`cover`). 로고처럼 잘리면 안 되는 그림은 잘리지 않게 넣고(`contain`) 둘레를 흰 판으로 채웁니다 — 판은 두 모드 모두 흰색이라 다크에서도 그림의 검은 부분이 사라지지 않습니다.

[그림: cover — 사진 · contain — 흰 판 위 로고](../../site/components/specs/image-frame.tsx#fit)

[표: 맞춤](image-frame.yaml#fit)

### State

| 상태 | 모습 |
|---|---|
| `loaded` | 그림이 왔습니다 — 스켈레톤을 걷고 그림이 투명도로 나타납니다(150ms) |
| `loading` | 불러오는 중 — 같은 모서리의 스켈레톤(면 + 반짝임). 면은 처음부터 깝니다(영역 시간표의 0 ~ 1초 틀만을 기다리지 않습니다) — 빈 칸이 없습니다. 붙는 순간 이미 받은 그림은 스켈레톤 없이 바로 `loaded` 입니다 |
| `fallback` | 그림이 없거나 · 못 불러오거나 · 10초가 지나도 안 옴 — Content Placeholder(틀 높이의 50% 아이콘). 아는 카드사의 카드 그림은 카드 면입니다 |

스켈레톤의 반짝임은 화면의 다른 스켈레톤과 한 박자로 지나고 모션 줄이기면 멈춥니다. 10초는 [Skeleton 의 시간표](skeleton.md#기다리는-동안)의 요청 제한과 같습니다 — 그림 자리가 시간표에서 따르는 것은 이 10초뿐입니다. 그 뒤에 그림이 와도 다시 바꾸지 않습니다(화면이 다시 튀지 않게, 다음에 열 때 다시 받습니다). 그림 · 사람 · 물건 자리에 무엇이 대신 보이는지는 [Content Placeholder 의 "대신 보이는 것 고르기"](content-placeholder.md#대신-보이는-것-고르기) 한 곳에서 고릅니다.

[그림: 불러오는 중 · 다 받음 · 없음 · 실패 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#states)

[표: 상태](image-frame.yaml#matrix)

[표: 모션](image-frame.yaml#motion)

### 그림 위 요소

그림 위에는 네 모서리(위 시작 · 위 끝 · 아래 시작 · 아래 끝)에 하나씩, 틀 하나에 둘까지 얹습니다 — 틀 가장자리에서 6 입니다. 얹는 것은 둘입니다.

| 요소 | 쓰는 것 | 예 |
|---|---|---|
| 배지 | 상태 · 분류 — [Badge](badge.md) `solid`(medium 20). 그림 위의 배지는 늘 solid 입니다 | "단종" |
| Indicator | 보기 전에 알면 좋은 메타 — 장수 · 길이. 알약 · 검정 65%(`overlay-dim-dark`) 바탕 · 흰 11/15 500 · 좌우 6 · 위아래 2 · 높이 19 | "1 / 12"(지금 장 / 전체) · "+9"(나머지 장수) |

틀의 짧은 변이 80 이상일 때만 얹습니다 — 그보다 작은 틀(목록 56 · 썸네일 40)은 배지 · 장수를 줄의 글로 둡니다. Indicator 바탕은 두 모드 모두 검정 65% 입니다 — 그림은 모드를 따르지 않기 때문입니다. 흰 그림 위에서도 흰 글자가 7.00:1 입니다.

[그림: 네 모서리 자리 — 위 시작 배지 "단종" · 아래 끝 Indicator "1 / 12" · "+9"](../../site/components/specs/image-frame.tsx#overlay)

[표: 그림 위 자리](image-frame.yaml#base.loaded@floater)

[표: Indicator](image-frame.yaml#base.loaded@indicator)

### 카드 그림

카드 그림은 비율 `card`(1.586)의 Image Frame 입니다 — 목록 56 · 혜택 격자 · 상세가 모두 같은 비율입니다. 상세의 그림은 폭 312 로 가운데에 둡니다(웹 대화상자도 폰 상세와 같은 312). 카드 그림의 절반가량은 세로 카드(0.62 ~ 0.64)입니다.

- **세로 그림은 돌립니다** — 그림의 원래 폭이 높이보다 작으면 시계 방향으로 90° 돌려 가로 틀을 채웁니다(돌린 뒤 cover — 카드 전체가 거의 그대로 들어갑니다). 방향은 다 받은 뒤 원래 크기로 정하고, 그때까지는 스켈레톤입니다(돌기 전 모습이 보이지 않습니다). 가로 · 정사각 그림은 그대로입니다. 실물 카드를 옆으로 눕힌 모습이 되고, 목록 · 격자의 크기는 카드마다 같습니다.
- **그림이 없으면** — 아는 카드사(기관 색 표에 있는 회사)는 카드 면입니다: 기관 색 한 색 + 왼쪽 아래 회사 이름 · 카드 이름(폭 96 미만의 작은 면은 회사 첫 글자만 가운데). 글자색은 표의 글자색(흰 글자가 4.5:1 에 못 미치는 색은 짙은 글자)이라 78곳 모두 4.52:1 이상입니다. 광택 띠 · 그라디언트를 두지 않습니다. 모르는 카드사는 대체 그림(`credit-card`)입니다 — 브랜드 파랑 · 회색 면으로 회사 색인 척하지 않습니다.
- **상세에는 카드 이름을 글로** — 그림이 떠도 카드 이름을 그림 아래(또는 제목)에 글로 둡니다. 그림 속 글 · `alt` 에만 이름을 두지 않습니다.

[그림: 세로 카드 그림을 시계 방향 90° — 목록 56 · 격자 · 상세](../../site/components/specs/image-frame.tsx#card-rotate)

[그림: 그림 없는 카드 — 아는 카드사의 면(작게 · 가운데 · 크게) · 모르는 카드사의 대체 그림 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#card-face)

[표: 카드 면 — 크기](card-art.yaml#size)

[표: 카드 면 — 공통](card-art.yaml#base.enabled)

## Guidelines

### 무엇을 Image Frame 으로

| 보이려는 것 | 쓰는 것 |
|---|---|
| 사람 | [Avatar](avatar.md) — 원, 사진 또는 이니셜 |
| 은행 · 증권 · 카드 · 코인 · 금 · 회사(물건) | [Logo Tile](logo-tile.md) — 각진 타일, 기관 색 + 첫 글자(그림이 있으면 덮는다) |
| 사진 · 카드 그림 · 규정 그림 | **Image Frame** |
| 카테고리 · 기능 | [List](list.md) 의 타일 — 옅은 색 + 아이콘 |
| 그림이 아닌 비율 상자(동영상 · 지도) | [Aspect Ratio](aspect-ratio.md) |

영수증 · 메모 첨부의 사진 썸네일(80 · 모서리 12 · 같은 투명 윤곽)은 [Attachment Input](attachment-input.md) 이 그립니다.

[그림: 사람은 Avatar · 물건은 Logo Tile · 그림은 Image Frame · 분류는 List 타일](../../site/components/specs/image-frame.tsx#which-guide)

### 투명 윤곽 하나

그림 둘레는 투명 윤곽 하나로 잡습니다 — 불투명한 선 · 그림자 · 두꺼운 테를 두르지 않습니다. 흰 카드 그림도 이 윤곽으로 흰 카드 위에서 묻히지 않습니다.

[그림: 투명 윤곽 · 불투명한 테 — 어두운 카드 둘레에 옅은 테가 생긴다](../../site/components/specs/image-frame.tsx#stroke-guide)

### 불러오는 동안도 같은 모서리

스켈레톤 · 대체 그림은 다 받은 그림과 같은 모서리 · 같은 크기입니다 — 그림이 와도 모서리가 바뀌지 않습니다. 틀 밖에서 그림 자리의 스켈레톤을 그릴 때(목록 줄이 통째로 기다릴 때)도 [Skeleton](skeleton.md) 의 `radius` 를 그 폭의 모서리(4 · 6 · 8)로 줍니다.

[그림: 같은 모서리 · 스켈레톤 16 이 그림 8 로 바뀌는 줄](../../site/components/specs/image-frame.tsx#radius-guide)

### 세로 카드는 돌려서 채웁니다

세로 카드 그림을 가로 틀에 그대로 채우면 높이의 29 ~ 41% 만 보입니다(가운데 띠만 보입니다). 잘리지 않게 넣으면 작아지고, 세로 틀을 따로 두면 목록 · 격자의 크기가 카드마다 달라집니다. 돌려서 채웁니다.

[그림: 돌려서 채움 · 가운데만 잘린 그림](../../site/components/specs/image-frame.tsx#rotate-guide)

### 그림 없는 카드는 카드사 색으로

아는 카드사는 그 색 면에 이름을 씁니다 — 목록에서 카드사가 색으로 갈립니다. 모르는 카드사에 브랜드 파랑을 칠하면 그 회사의 색처럼 보입니다. 대체 그림(`credit-card`)으로 둡니다.

[그림: 아는 카드사는 기관 색 면 · 모르는 카드사는 대체 그림 · 모르는 회사를 브랜드 파랑으로 칠한 화면](../../site/components/specs/image-frame.tsx#face-guide)

### 상세에는 카드 이름을 글로

그림이 뜨면 카드 이름이 화면에서 사라지지 않게 합니다 — 그림 아래나 제목에 이름을 글로 둡니다. 제목이 "카드 상세" 뿐이고 이름이 그림 속에만 있으면, 그림을 읽을 수 없을 때 이름을 알 수 없습니다.

[그림: 그림 아래 카드 이름 · 그림만 있는 상세](../../site/components/specs/image-frame.tsx#name-guide)

### 그림 위는 둘까지, 역할대로

상태 · 분류는 배지, 장수 · 길이는 Indicator 입니다 — 바꿔 쓰지 않습니다. 셋 이상 얹지 않습니다. 관심(하트) 버튼 · 콘텐츠 종류 아이콘은 두지 않습니다 — 쓸 자리가 없습니다.

[그림: 배지 하나 · Indicator 하나 — 셋을 얹은 그림 · 장수를 배지에 넣은 그림](../../site/components/specs/image-frame.tsx#overlay-guide)

### 여러 장은 끝이 보이는 가로 줄

그림 여러 장은 [Scroll Fog](scroll-fog.md) `row` 가로 줄에 틀을 사이 8 로 잇습니다 — 다음 장이 20 이상 보이게 폭을 잡아 넘길 수 있음을 알립니다. 한 장씩 크게 볼 때는 오른쪽 아래 Indicator "1 / 12", 묶음 썸네일은 "+9" 입니다. 화살표 · 점 · 자동 넘김은 두지 않습니다.

[그림: 가로 줄 4:5 · 사이 8 · 다음 장 보임 + "1 / 12" — 화살표 · 점 · 자동 넘김](../../site/components/specs/image-frame.tsx#gallery-guide)

### 흐리게 · 크게 하지 않습니다

상태는 그림을 불투명도로 흐리지 않고 배지로 알립니다 — 단종 카드는 "단종" 배지입니다(격자 · 상세는 그림 위 시작, 목록은 이름 옆). 마우스를 올려 그림 · 카드를 키우지 않습니다 — 누를 것이 없는 카드가 커지고, 모션 줄이기도 무시되기 때문입니다.

[그림: 단종은 배지 · 흐린 그림 · 마우스에 1.05배 커지는 카드](../../site/components/specs/image-frame.tsx#dim-guide)

### 이름 옆이면 장식, 혼자면 이름

그림 옆에 이름이 있으면 그림은 장식입니다(`alt=""` — 이름을 한 번만 읽습니다). 그림만 있으면 그림이 이름을 가집니다(`alt` 에 무엇인지). 그림이 실패해도 그 이름은 대체 그림이 이어받습니다. 그림 속 글이 내용을 말하지 않는 규정 그림 · 장식 그림은 `alt=""` 입니다. 파일 이름 · "Image" · "logo" 를 이름으로 두지 않습니다.

[그림: 이름 옆 그림은 장식 · 이름을 두 번 읽는 카드 혜택](../../site/components/specs/image-frame.tsx#alt-guide)

## 코드

레시피 `recipes/shadcn/components/ui/image-frame.tsx` 를 씁니다 — `ImageFrame` · `ImageFrameFloater` · `ImageFrameIndicator` · `CardArt` 와 규칙 함수 `imageFrameRadius(width)` 입니다. 기관 색은 `recipes/shadcn/lib/institution-colors.ts`(`institution-colors.yaml` 에서 만든 표와 찾기 함수 `institutionColor(name)` — [Logo Tile](logo-tile.md) 과 함께 씁니다)입니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ImageFrame` — `src`(없으면 처음부터 대체 그림) · `alt`(필수 — 이름 옆이면 `""`, 대체 그림이 이 글을 이름으로 이어받습니다) · `ratio`(`"1:1"` · `"2:1"` · `"16:9"` · `"4:3"` 기본 · `"6:7"` · `"4:5"` · `"2:3"` · `"card"`) · `width`(고정 폭 px — 모서리를 고른다. 없으면 부모 폭을 채우고 모서리 8) · `bleed`(화면 폭 — 모서리 0) · `fit`(`"cover"` 기본 · `"contain"`) · `fallbackIcon`(대체 그림 아이콘 — 기본 `ImageIcon`) · `fallback`(대체 그림을 통째로 바꿀 때 — `CardArt` 가 카드 면을 넣는다) · `loading`(`"lazy"` 기본 · `"eager"`) · `srcSet` · `sizes`. 자식은 `ImageFrameFloater` 둘까지입니다. `ratio="card"` 면 세로 그림을 돌립니다. 그 밖은 바깥 `div` 속성입니다.
- `ImageFrameFloater` — `placement`(`"top-start"` · `"top-end"` · `"bottom-start"` · `"bottom-end"`, 필수)와 자식 하나(`Badge variant="solid"` 또는 `ImageFrameIndicator`).
- `ImageFrameIndicator` — 보이는 글(`children` — "1 / 12" · "+9")과 읽는 글(`label`, 필수 — "사진 12장 중 1번째" · "사진 9장 더 있음").
- `CardArt` — `issuer`(카드사 이름 — 기관 색 · 첫 글자 · 모르는 회사 가르기) · `name`(카드 이름) · `src` · `width` · `decorative`(기본 `true` — 옆에 이름이 있을 때. `false` 면 "카드사 카드 이름" 을 읽는다) · `loading`, 자식은 `ImageFrameFloater`. 크기(small · medium · large)는 폭으로 고릅니다.
- `imageFrameRadius(width)` — `"4"` · `"6"` · `"8"` — 틀 밖에서 같은 모서리가 필요할 때([Skeleton](skeleton.md) 의 `radius`) 씁니다.

앱은 같은 규칙을 Dart 로 두고(돌리기 — 원래 크기로 정한 뒤 `RotatedBox(quarterTurns: 1)` + `BoxFit.cover`), 기관 색 표도 같은 YAML 에서 만듭니다.

### 목록 줄 — 카드 그림 56

[그림: 카드 혜택 목록 — 카드 그림 56 · 이름 · 카드사](../../site/components/specs/image-frame.tsx#ex-list)

```tsx
import { CardArt } from "@/components/ui/image-frame"
import { ListButtonItem } from "@/components/ui/list"

{/* 옆에 이름이 있다 — 그림은 장식(decorative 기본) */}
<ListButtonItem
  prefix={<CardArt width={56} src={card.imgUrl} issuer={card.companyName} name={card.name} />}
  title={card.name}
  detail={`${card.typeLabel} · ${card.companyName}`}
  onClick={() => openCard(card.id)}
/>
```

### 격자 — 단종 배지

[그림: 카드 혜택 격자 — 단종 카드는 흐리지 않고 위 시작에 배지](../../site/components/specs/image-frame.tsx#ex-grid)

```tsx
import { Badge } from "@/components/ui/badge"
import { CardArt, ImageFrameFloater } from "@/components/ui/image-frame"

<CardArt src={card.imgUrl} issuer={card.companyName} name={card.name}>
  {card.discontinued && (
    <ImageFrameFloater placement="top-start">
      <Badge variant="solid">단종</Badge>
    </ImageFrameFloater>
  )}
</CardArt>
<p className="text-t4 font-bold">{card.name}</p>
```

### 상세 — 그림과 카드 이름 글

[그림: 카드 상세 — 그림 312 아래 카드 이름 · 카드사](../../site/components/specs/image-frame.tsx#ex-detail)

```tsx
<div className="flex flex-col gap-x3">
  <CardArt width={312} src={card.imgUrl} issuer={card.companyName} name={card.name} loading="eager" />
  <div>
    <h2 className="text-t7 font-bold">{card.name}</h2>
    <p className="text-t4 text-fg-neutral-subtle">{card.companyName}</p>
  </div>
</div>
```

### 규정 그림 — 1:1 · 장식

[그림: HR 규정 카드 — 1:1 그림 · 제목 · 설명](../../site/components/specs/image-frame.tsx#ex-rule)

```tsx
import { ImageFrame } from "@/components/ui/image-frame"

{/* 제목 · 설명이 내용을 말한다 — 그림은 장식. 늦게 받는다(lazy 기본) */}
<ImageFrame ratio="1:1" src="/rule_1_1.png" alt="" />
<h3>{t("rule.vacation.daysTitle")}</h3>
```

### 여러 장 — 가로 줄 · 장수

[그림: 사진 가로 줄 4:5 · 한 장 크게 "1 / 12"](../../site/components/specs/image-frame.tsx#ex-gallery)

```tsx
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@/components/ui/image-frame"
import { ScrollFog } from "@/components/ui/scroll-fog"

{/* 안에 초점 가는 것이 없으면 줄이 키보드로 스크롤되게 tabIndex · 이름(Scroll Fog) */}
<ScrollFog use="row" tabIndex={0} aria-label="사진">
  <div className="flex gap-x2">
    {photos.map((p) => <ImageFrame key={p.id} ratio="4:5" width={144} src={p.url} alt={p.description} />)}
  </div>
</ScrollFog>

<ImageFrame bleed ratio="1:1" src={photos[i].url} alt={photos[i].description}>
  <ImageFrameFloater placement="bottom-end">
    <ImageFrameIndicator label={`사진 ${photos.length}장 중 ${i + 1}번째`}>{`${i + 1} / ${photos.length}`}</ImageFrameIndicator>
  </ImageFrameFloater>
</ImageFrame>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 불러오기 시작 | 틀이 비율로 자리를 잡고 스켈레톤 면 · 반짝임이 보입니다 — 빈 칸이 없습니다 |
| 다 받음 | 스켈레톤을 걷고 그림이 투명도로 나타납니다(150ms — 모션 줄이기면 바로). 카드 그림은 이때 방향을 정해 돌립니다 |
| 그림이 없음 · 못 불러옴 | 대체 그림(카드 그림은 카드 면 또는 대체 그림) — 깨진 그림 아이콘 · `alt` 글 · 빈 칸이 보이지 않습니다 |
| 10초가 지나도 안 옴 | 실패와 같습니다 — 그 뒤에 와도 다시 바꾸지 않습니다 |
| 화면에 들어옴 | 그때 받습니다(`lazy`) — 첫 화면의 큰 그림만 바로 받습니다 |
| 누르기 · 키보드 | 틀은 누르지 않습니다 — 감싼 버튼 · 링크(목록 줄 · 격자 칸)의 동작입니다. 그림 위 요소도 누르지 않습니다 |
| 마우스 올림 | 바뀌지 않습니다 — 키우지 않습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | `alt` 는 필수입니다 — 이름 옆 그림 · 장식 그림은 `""`, 혼자인 그림은 무엇인지. 실패하면 대체 그림이 `alt` 를 이름으로 이어받습니다(`role="img"` + `aria-label`). 카드 그림은 `decorative` 가 기본이고, 혼자면 "카드사 카드 이름" 입니다 ✓ |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | Indicator 흰 글자 on 검정 65% — 흰 그림 위 7.00 · 검은 그림 위 21 ✓. 카드 면 글자 — 기관 색 표 78곳 모두 4.52 이상(라이트 · 다크) ✓. 배지는 [Badge](badge.md) 의 solid ✓ |
| **WCAG 1.4.4** Resize text | Indicator 글("1 / 12" · "+9")은 사진 위 표식이라 예외로 글자 크기 설정을 따르지 않습니다 — 같은 수는 숨은 글(`label`)로 읽습니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 윤곽(흰 바탕 위 1.11 · 다크 1.17) · 스켈레톤 면(1.08 · 1.30) · 대체 그림 아이콘(1.14 · 1.20)은 장식입니다 — 그림 · 이름 글이 내용을 알립니다 |
| **WCAG 1.4.1** Use of color | 카드사 색은 거드는 것입니다 — 카드사 이름이 줄 · 면의 글에 있습니다 |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 반짝임이 멈추고 그림은 바로 나타납니다 ✓ — 마우스에 키우지 않습니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 틀 · 그림 위 요소는 누르지 않습니다(감싼 줄 · 칸의 규칙) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않습니다 |
| **ARIA** | 틀은 역할이 없습니다 — 그림 `<img alt>`. 불러오는 동안 스켈레톤은 `aria-hidden`. Indicator 의 보이는 글("1 / 12")은 `aria-hidden` 이고 `label`("사진 12장 중 1번째")을 숨은 글로 읽습니다. 배지는 글 그대로 읽힙니다. 앱은 `Semantics(label: alt, image: true)` — 장식이면 `ExcludeSemantics` 입니다 |

## Do / Don't

### ✅ Do

- 그림은 여덟 비율의 Image Frame 으로 둡니다 — 기본 4:3, 카드는 1.586.
- 모서리는 폭으로 고르고(4 · 6 · 8 · 화면 폭 0), 불러오는 동안도 같은 모서리로 둡니다.
- 투명 윤곽은 늘 그립니다.
- 세로 카드 그림은 시계 방향으로 돌려 채웁니다.
- 그림 없는 카드 — 아는 카드사는 기관 색 면, 모르면 대체 그림으로 둡니다.
- 상세에는 카드 이름을 글로 둡니다.
- 그림 위는 배지(상태) · Indicator(장수) 둘까지 얹습니다.

### ❌ Don't

- 불투명한 테 · 그림자로 그림 둘레를 두르지 않습니다.
- 크기와 상관없이 모서리 하나(8)로 두지 않습니다.
- 세로 카드를 잘리지 않게 작게 넣거나 세로 틀로 바꾸지 않습니다.
- 모르는 카드사를 브랜드 파랑 · 회색 면으로 칠하거나, 카드 면에 광택 띠를 두지 않습니다.
- 깨진 그림 아이콘 · 빈 칸 · 파일 이름 `alt` 를 두지 않습니다.
- 단종 · 상태를 불투명도로 흐리거나, 마우스에 키우지 않습니다.
- 그림 위에 셋 이상 · 하트 버튼 · 점 지시자 · 화살표 · 자동 넘김을 두지 않습니다.

## Specification

`image-frame.yaml` · `card-art.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Image Frame · 카드 그림을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `loaded` 에서 바뀌는 값만 적습니다.

[그림: Specification — image-frame.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#image-frame)

[그림: Specification — card-art.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#card-art)
