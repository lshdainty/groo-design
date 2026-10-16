# Image Frame

> 그림 한 장을 보이는 틀 — 비율 상자에 그림을 꽉 채우고, 그림 위에 안쪽 1px 투명 윤곽을 늘 그린다. 불러오는 동안은 같은 모서리의 [Skeleton](skeleton.md), 없거나 못 불러오면 [Content Placeholder](content-placeholder.md) 다. 카드 그림 · 규정 그림 · 앞으로의 사진이 모두 이것이다. 사람은 [Avatar](avatar.md), 은행 · 증권 · 카드 같은 물건의 첫 글자 타일은 [Logo Tile](logo-tile.md), 그림이 아닌 비율 상자(동영상 · 지도)는 [Aspect Ratio](aspect-ratio.md) 다.

구조는 당근 [SEED Image Frame](https://seed-design.io/components/image-frame)(Apache-2.0)을 따른다 — "사용자가 업로드한 이미지를 표시하기 위한 컴포넌트" 로, 비율 상자 · 그림(cover) · 안쪽 1px 윤곽 · 대체 그림 · 네 모서리의 그림 위 요소. 모서리는 SEED 대로 폭으로 고른다("가로 크기 24까지 r1, 48까지 r1.5, 그 이상은 r2 적용"). 카드 그림(ISO 카드 1.586 · 세로 그림 돌리기 · 그림 없는 카드의 면)은 porest 가 더했다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). porest 에 처음 두는 부품이다 — 옛 [Aspect Ratio](aspect-ratio.md) 와 화면마다 손으로 짠 그림 틀을 대신한다.

수치 원본은 [`image-frame.yaml`](image-frame.yaml)(틀)과 [`card-art.yaml`](card-art.yaml)(카드 그림 · 카드 면)이다. 카드 면의 색은 [`institution-colors.yaml`](institution-colors.yaml)(기관 색 표 — [Logo Tile](logo-tile.md) 과 함께 쓴다). 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카드 혜택 격자 · 목록 줄의 카드 그림 · HR 규정 그림 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#hero)

### 직접 골라 보기

비율 · 폭 · 그림(사진 · 흰 그림 · 세로 카드 · 그림 없는 카드) · 상태(불러오는 중 · 다 받음 · 실패) · 그림 위 요소를 고르면 스펙대로 그린 틀과 그 코드가 바뀐다. 폭을 줄이고 늘리면 모서리가 4 · 6 · 8 로 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/image-frame.tsx#playground)

## Anatomy

[그림: 틀 · 그림 · 안쪽 1px 윤곽, 네 모서리의 그림 위 자리에 배지와 장수 글](../../site/components/specs/image-frame.tsx#anatomy)

| ⓐ Root | 틀 — 비율 상자. 폭은 부르는 쪽, 높이는 폭 ÷ 비율. 모서리로 자른다. |
| ⓑ Image | 그림 — 틀을 꽉 채운다(cover). 세로 카드 그림은 돌려서 채운다. |
| ⓒ Stroke | 안쪽 1px 윤곽 — 그림 위에 늘. 흰 그림이 흰 바탕에 묻히지 않게. |
| ⓓ Skeleton · Fallback | 불러오는 동안은 스켈레톤, 없거나 실패하면 대체 그림 — 그림 자리에. |
| ⓔ Floater | 그림 위 자리 — 네 모서리, 모서리에서 6. 배지(solid) · 장수 글(Indicator). |

[표: 부위](image-frame.yaml#slots)

## Properties

### Ratio

비율은 여덟 가지다 — SEED 의 일곱(1:1 · 2:1 · 16:9 · 4:3 · 6:7 · 4:5 · 2:3)과 카드 1.586(ISO 카드 85.6 × 53.98 — porest). 기본은 4:3 이다. 틀은 그림이 오기 전에 비율로 자리를 잡아, 그림이 와도 줄이 밀리지 않는다. 카드 그림은 목록 · 격자 · 상세 모두 1.586 이다 — 최대 높이를 걸어 비율을 바꾸지 않는다.

[그림: 같은 폭에 여덟 비율 — 카드 1.586 은 porest](../../site/components/specs/image-frame.tsx#ratio)

[표: 비율](image-frame.yaml#ratio)

[표: 틀](image-frame.yaml#base.loaded@root)

[표: 그림](image-frame.yaml#base.loaded@image)

### 모서리 — 폭으로

모서리는 틀의 폭으로 고른다 — 24 이하 4(`radius-r1`), 48 이하 6(`radius-r1_5`), 그 위 8(`radius-r2`), 좌우가 화면 끝에 닿는 그림은 0. 작은 그림일수록 모서리를 줄인다 — 24 그림에 8 을 주면 폭의 1/3 이 둥글어 알약처럼 보인다. 고정 폭(목록 · 썸네일)은 그 폭으로, 부모 폭을 채우는 틀은 8 이다. 불러오는 동안의 스켈레톤 · 대체 그림도 같은 모서리다(틀이 자른다).

[그림: 폭으로 고른 모서리 — 24 → 4 · 40 → 6 · 56 → 8 · 150 → 8 · 화면 폭 0](../../site/components/specs/image-frame.tsx#radius)

[표: 모서리](image-frame.yaml#radius)

### 윤곽

그림 위에 안쪽 1px 윤곽을 늘 그린다 — `stroke-neutral-overlay`(v118 — 검정 4.7% · 다크 흰 5%, SEED stroke.neutral-subtle 의 값). 투명한 선이라 흰 그림 둘레는 살짝 잡히고(흰 바탕 위 1.11:1) 어두운 그림 위에서는 보이지 않는다. 불투명한 선(`stroke-neutral-subtle`)을 두르면 어두운 사진 · 카드 둘레에 옅은 테가 생긴다. 끄는 속성이 없다 — 스켈레톤 · 대체 그림 · 카드 면 위에도 같은 선이다.

[그림: 흰 그림 · 어두운 그림 위 투명 윤곽 — 라이트 · 다크, 모서리 4배](../../site/components/specs/image-frame.tsx#stroke)

[표: 윤곽](image-frame.yaml#base.loaded@stroke)

### Fit

사진 · 카드 그림은 꽉 채우고 가운데를 남겨 자른다(`cover` — SEED 의 사진은 늘 이것이다). 로고처럼 잘리면 안 되는 그림은 잘리지 않게 넣고(`contain`) 둘레를 흰 판으로 채운다 — 판은 두 모드 모두 흰색이라 다크에서도 그림의 검은 부분이 사라지지 않는다.

[그림: cover — 사진 · contain — 흰 판 위 로고](../../site/components/specs/image-frame.tsx#fit)

[표: 맞춤](image-frame.yaml#fit)

### State

| 상태 | 모습 |
|---|---|
| `loaded` | 그림이 왔다 — 스켈레톤을 걷고 그림이 투명도로 나타난다(150ms) |
| `loading` | 불러오는 중 — 같은 모서리의 스켈레톤(면 + 반짝임). 면은 처음부터 깐다 — 빈 칸이 없다 |
| `fallback` | 그림이 없거나 · 못 불러오거나 · 10초가 지나도 안 옴 — Content Placeholder(틀 높이의 50% 아이콘). 아는 카드사의 카드 그림은 카드 면 |

스켈레톤의 반짝임은 화면의 다른 스켈레톤과 한 박자로 지나고 모션 줄이기면 멈춘다. 10초는 [Skeleton 의 시간표](skeleton.md#기다리는-동안)의 요청 제한과 같다 — 그 뒤에 그림이 와도 다시 바꾸지 않는다(화면이 다시 튀지 않게, 다음에 열 때 다시 받는다).

[그림: 불러오는 중 · 다 받음 · 없음 · 실패 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#states)

[표: 상태](image-frame.yaml#matrix)

[표: 모션](image-frame.yaml#motion)

### 그림 위 요소

그림 위에는 네 모서리(위 시작 · 위 끝 · 아래 시작 · 아래 끝)에 하나씩, 틀 하나에 둘까지 얹는다 — 틀 가장자리에서 6. 얹는 것은 둘이다(SEED 의 쓰임을 따른다).

| 요소 | 쓰는 것 | 예 |
|---|---|---|
| 배지 | 상태 · 분류 — [Badge](badge.md) `solid`(medium 20). 그림 위는 늘 solid(SEED Badge — "이미지 위에 Badge 가 겹치는 경우 … Solid") | "단종" |
| Indicator | 보기 전에 알면 좋은 메타 — 장수 · 길이. 알약 · 검정 65%(`overlay-dim-dark`) 바탕 · 흰 11/15 500 · 좌우 6 · 위아래 2 · 높이 19 | "1 / 12"(지금 장 / 전체) · "+9"(나머지 장수) |

틀의 짧은 변이 80 이상일 때만 얹는다 — 그보다 작은 틀(목록 56 · 썸네일 40)은 배지 · 장수를 줄의 글로 둔다. Indicator 바탕은 두 모드 모두 검정 65% 다 — 그림은 모드를 따르지 않는다. 흰 그림 위에서도 흰 글자가 7.00:1 이다.

[그림: 네 모서리 자리 — 위 시작 배지 "단종" · 아래 끝 Indicator "1 / 12" · "+9"](../../site/components/specs/image-frame.tsx#overlay)

[표: 그림 위 자리](image-frame.yaml#base.loaded@floater)

[표: Indicator](image-frame.yaml#base.loaded@indicator)

### 카드 그림

카드 그림은 비율 `card`(1.586)의 Image Frame 이다 — 목록 56 · 혜택 격자 · 상세가 모두 같은 비율이다. 그림의 반이 세로 카드다(dev 활성 카드에서 무작위로 고른 그림 150장 중 80장, 0.62 ~ 0.64).

- **세로 그림은 돌린다** — 그림의 원래 폭이 높이보다 작으면 시계 방향으로 90° 돌려 가로 틀을 채운다(돌린 뒤 cover — 카드 전체가 거의 그대로 들어간다). 방향은 다 받은 뒤 원래 크기로 정하고, 그때까지는 스켈레톤이다(돌기 전 모습이 보이지 않는다). 가로 · 정사각 그림은 그대로다. 실물 카드를 옆으로 눕힌 모습이 되고, 목록 · 격자의 크기는 카드마다 같다.
- **그림이 없으면** — 아는 카드사(기관 색 표에 있는 회사)는 카드 면이다: 기관 색 한 색 + 왼쪽 아래 회사 이름 · 카드 이름(폭 96 미만의 작은 면은 회사 첫 글자만 가운데). 글자색은 표의 글자색(흰 글자가 4.5:1 에 못 미치는 색은 짙은 글자)이라 78곳 모두 4.52:1 이상이다. 광택 띠 · 그라디언트를 두지 않는다. 모르는 카드사는 대체 그림(`credit-card`)이다 — 브랜드 파랑 · 회색 면으로 회사 색인 척하지 않는다.
- **글이 안 들면 첫 글자 면** — 큰 글자에서 회사 줄 + 카드 이름 한 줄 + 아래 여백이 면 높이보다 크면 회사 · 카드 이름 대신 회사 첫 글자 면(작은 면과 같은 모양)으로 바꾼다. 폭 96 ~ 123 면이 글자 200% 에서 그렇다(78 > 60.5 ~ 77.6). 글자는 배율을 따르고 여백 · 면은 그대로이며, 같은 격자에서도 글자 배율에 따라 면 모양이 바뀐다. 카드 이름은 칸 아래 글이 말한다(2026-10-17 사용자 결정 — [03-D 비교 페이지](https://claude.ai/artifact/7TVGy8o47HBg4R3SefDmf6) 결정 3 A).
- **상세에는 카드 이름을 글로** — 그림이 떠도 카드 이름을 그림 아래(또는 제목)에 글로 둔다. 그림 속 글 · `alt` 에만 이름을 두지 않는다.

[그림: 세로 카드 그림을 시계 방향 90° — 목록 56 · 격자 · 상세](../../site/components/specs/image-frame.tsx#card-rotate)

[그림: 그림 없는 카드 — 아는 카드사의 면(작게 · 가운데 · 크게) · 모르는 카드사의 대체 그림 — 라이트 · 다크](../../site/components/specs/image-frame.tsx#card-face)

[그림: 큰 글자 × 좁은 면 — 글이 안 들면 첫 글자 면(폭 96 · 110 · 124 · 150, 글자 100 · 130 · 200%)](../../site/components/specs/image-frame.tsx#card-face-scale)

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

[그림: 사람은 Avatar · 물건은 Logo Tile · 그림은 Image Frame · 분류는 List 타일](../../site/components/specs/image-frame.tsx#which-guide)

### 투명 윤곽 하나

그림 둘레는 투명 윤곽 하나로 잡는다 — 불투명한 선 · 그림자 · 두꺼운 테를 두르지 않는다. 흰 카드 그림이 흰 카드 위에 묻히던 자리(9월 24일 dev 캡처의 흰 "SELECT" 카드)가 이것으로 잡힌다.

[그림: 투명 윤곽 · 불투명한 테 — 어두운 카드 둘레에 옅은 테가 생긴다](../../site/components/specs/image-frame.tsx#stroke-guide)

### 불러오는 동안도 같은 모서리

스켈레톤 · 대체 그림은 다 받은 그림과 같은 모서리 · 같은 크기다 — 그림이 와도 모서리가 바뀌지 않는다. 틀 밖에서 그림 자리의 스켈레톤을 그릴 때(목록 줄이 통째로 기다릴 때)도 [Skeleton](skeleton.md) 의 `radius` 를 그 폭의 모서리(4 · 6 · 8)로 준다.

[그림: 같은 모서리 · 스켈레톤 16 이 그림 8 로 바뀌는 줄](../../site/components/specs/image-frame.tsx#radius-guide)

### 세로 카드는 돌려서 채운다

세로 카드 그림을 가로 틀에 그대로 채우면 높이의 29 ~ 41% 만 보인다(지금 — 가운데 띠만 보인다). 잘리지 않게 넣으면 작아지고, 세로 틀을 따로 두면 목록 · 격자의 크기가 카드마다 달라진다. 돌려서 채운다.

[그림: 돌려서 채움 · 가운데만 잘린 지금](../../site/components/specs/image-frame.tsx#rotate-guide)

### 그림 없는 카드는 카드사 색으로

아는 카드사는 그 색 면에 이름을 쓴다 — 목록에서 카드사가 색으로 갈린다. 모르는 카드사에 브랜드 파랑을 칠하면 그 회사의 색처럼 보인다. 대체 그림(`credit-card`)으로 둔다.

[그림: 아는 카드사는 기관 색 면 · 모르는 카드사는 대체 그림 · 모르는 회사를 브랜드 파랑으로 칠한 화면](../../site/components/specs/image-frame.tsx#face-guide)

### 상세에는 카드 이름을 글로

그림이 뜨면 카드 이름이 화면에서 사라지지 않게 한다 — 그림 아래나 제목에 이름을 글로 둔다. 제목이 "카드 상세" 뿐이고 이름이 그림 속에만 있으면 읽을 수 없는 그림에서는 이름을 모른다.

[그림: 그림 아래 카드 이름 · 그림만 있는 상세](../../site/components/specs/image-frame.tsx#name-guide)

### 그림 위는 둘까지, 역할대로

상태 · 분류는 배지, 장수 · 길이는 Indicator 다 — 바꿔 쓰지 않는다(SEED — "Badge 와 Indicator 를 혼동하지 않고"). 셋 이상 얹지 않는다. 관심(하트) 버튼 · 콘텐츠 종류 아이콘은 두지 않는다 — 쓸 자리가 없다.

[그림: 배지 하나 · Indicator 하나 — 셋을 얹은 그림 · 장수를 배지에 넣은 그림](../../site/components/specs/image-frame.tsx#overlay-guide)

### 여러 장은 끝이 보이는 가로 줄

그림 여러 장은 [Scroll Fog](scroll-fog.md) `row` 가로 줄에 틀을 사이 8 로 잇는다 — 다음 장이 20 이상 보이게 폭을 잡아 넘길 수 있음을 알린다(SEED 그림 — 4:5 · 사이 8 · 다음 장 20). 한 장씩 크게 볼 때는 오른쪽 아래 Indicator "1 / 12", 묶음 썸네일은 "+9" 다. 화살표 · 점 · 자동 넘김은 두지 않는다 — Carousel 은 걷었다(2026-10-04).

[그림: 가로 줄 4:5 · 사이 8 · 다음 장 보임 + "1 / 12" — 화살표 · 점 · 자동 넘김](../../site/components/specs/image-frame.tsx#gallery-guide)

### 흐리게 · 크게 하지 않는다

상태는 그림을 불투명도로 흐리지 않고 배지로 알린다(v106) — 단종 카드는 "단종" 배지다. 마우스를 올려 그림 · 카드를 키우지 않는다(누를 것이 없는 카드가 커지고, 모션 줄이기도 무시된다).

[그림: 단종은 배지 · 흐린 그림 · 마우스에 1.05배 커지는 카드](../../site/components/specs/image-frame.tsx#dim-guide)

### 이름 옆이면 장식, 혼자면 이름

그림 옆에 이름이 있으면 그림은 장식이다(`alt=""` — 이름을 한 번만 읽는다). 그림만 있으면 그림이 이름을 가진다(`alt` 에 무엇인지). 그림이 실패해도 그 이름은 대체 그림이 이어받는다. 그림 속 글이 내용을 말하지 않는 규정 그림 · 장식 그림은 `alt=""` 다. 파일 이름 · "Image" · "logo" 를 이름으로 두지 않는다.

[그림: 이름 옆 그림은 장식 · 이름을 두 번 읽는 카드 혜택](../../site/components/specs/image-frame.tsx#alt-guide)

## 코드

레시피 `recipes/shadcn/components/ui/image-frame.tsx` 를 쓴다 — `ImageFrame` · `ImageFrameFloater` · `ImageFrameIndicator` · `CardArt` 와 규칙 함수 `imageFrameRadius(width)`. 기관 색은 `recipes/shadcn/lib/institution-colors.ts`(`institution-colors.yaml` 에서 만든 표와 찾기 함수 `institutionColor(name)` — [Logo Tile](logo-tile.md) 과 함께 쓴다)다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ImageFrame` — `src`(없으면 처음부터 대체 그림) · `alt`(필수 — 이름 옆이면 `""`, 대체 그림이 이 글을 이름으로 이어받는다) · `ratio`(`"1:1"` · `"2:1"` · `"16:9"` · `"4:3"` 기본 · `"6:7"` · `"4:5"` · `"2:3"` · `"card"`) · `width`(고정 폭 px — 모서리를 고른다. 없으면 부모 폭을 채우고 모서리 8) · `bleed`(화면 폭 — 모서리 0) · `fit`(`"cover"` 기본 · `"contain"`) · `fallbackIcon`(대체 그림 아이콘 — 기본 `ImageIcon`) · `fallback`(대체 그림을 통째로 바꿀 때 — `CardArt` 가 카드 면을 넣는다) · `loading`(`"lazy"` 기본 · `"eager"`) · `srcSet` · `sizes`. 자식은 `ImageFrameFloater` 둘까지. `ratio="card"` 면 세로 그림을 돌린다. 그 밖은 바깥 `div` 속성이다.
- `ImageFrameFloater` — `placement`(`"top-start"` · `"top-end"` · `"bottom-start"` · `"bottom-end"`, 필수)와 자식 하나(`Badge variant="solid"` 또는 `ImageFrameIndicator`).
- `ImageFrameIndicator` — 보이는 글(`children` — "1 / 12" · "+9")과 읽는 글(`label`, 필수 — "사진 12장 중 1번째" · "사진 9장 더 있음").
- `CardArt` — `issuer`(카드사 이름 — 기관 색 · 첫 글자 · 모르는 회사 가르기) · `name`(카드 이름) · `src` · `width` · `decorative`(기본 `true` — 옆에 이름이 있을 때. `false` 면 "카드사 카드 이름" 을 읽는다) · `loading`, 자식은 `ImageFrameFloater`. 크기(small · medium · large)는 폭으로 고른다.
- `imageFrameRadius(width)` — `"4"` · `"6"` · `"8"` — 틀 밖에서 같은 모서리가 필요할 때([Skeleton](skeleton.md) 의 `radius`).

앱은 같은 규칙을 Dart 로 두고(돌리기 — 원래 크기로 정한 뒤 `RotatedBox(quarterTurns: 1)` + `BoxFit.cover`), 기관 색 표도 같은 YAML 에서 만든다.

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
| 불러오기 시작 | 틀이 비율로 자리를 잡고 스켈레톤 면 · 반짝임이 보인다 — 빈 칸이 없다 |
| 다 받음 | 스켈레톤을 걷고 그림이 투명도로 나타난다(150ms — 모션 줄이기면 바로). 카드 그림은 이때 방향을 정해 돌린다 |
| 그림이 없음 · 못 불러옴 | 대체 그림(카드 그림은 카드 면 또는 대체 그림) — 깨진 그림 아이콘 · `alt` 글 · 빈 칸이 보이지 않는다 |
| 10초가 지나도 안 옴 | 실패와 같다 — 그 뒤에 와도 다시 바꾸지 않는다 |
| 화면에 들어옴 | 그때 받는다(`lazy`) — 첫 화면의 큰 그림만 바로 받는다 |
| 누르기 · 키보드 | 틀은 누르지 않는다 — 감싼 버튼 · 링크(목록 줄 · 격자 칸)의 동작. 그림 위 요소도 누르지 않는다 |
| 마우스 올림 | 바뀌지 않는다 — 키우지 않는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | `alt` 는 필수 — 이름 옆 그림 · 장식 그림은 `""`, 혼자인 그림은 무엇인지. 실패하면 대체 그림이 `alt` 를 이름으로 이어받는다(`role="img"` + `aria-label`). 카드 그림은 `decorative` 가 기본이고, 혼자면 "카드사 카드 이름" ✓ |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | Indicator 흰 글자 on 검정 65% — 흰 그림 위 7.00 · 검은 그림 위 21 ✓. 카드 면 글자 — 기관 색 표 78곳 모두 4.52 이상(라이트 · 다크) ✓. 배지는 [Badge](badge.md) 의 solid ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 윤곽(흰 바탕 위 1.11 · 다크 1.17) · 스켈레톤 면(1.08 · 1.30) · 대체 그림 아이콘(1.14 · 1.20)은 장식이다 — 그림 · 이름 글이 내용을 알린다 |
| **WCAG 1.4.1** Use of color | 카드사 색은 거드는 것이다 — 카드사 이름이 줄 · 면의 글에 있다 |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 반짝임이 멈추고 그림은 바로 나타난다 ✓ — 마우스에 키우지 않는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 틀 · 그림 위 요소는 누르지 않는다(감싼 줄 · 칸의 규칙) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | 틀은 역할이 없다 — 그림 `<img alt>`. 불러오는 동안 스켈레톤은 `aria-hidden`. Indicator 의 보이는 글("1 / 12")은 `aria-hidden` 이고 `label`("사진 12장 중 1번째")을 숨은 글로 읽는다. 배지는 글 그대로 읽힌다. 앱은 `Semantics(label: alt, image: true)` — 장식이면 `ExcludeSemantics` |

## Do / Don't

### ✅ Do

- 그림은 여덟 비율의 Image Frame 으로 — 기본 4:3, 카드는 1.586.
- 모서리는 폭으로(4 · 6 · 8 · 화면 폭 0), 불러오는 동안도 같은 모서리.
- 투명 윤곽은 늘.
- 세로 카드 그림은 시계 방향으로 돌려 채운다.
- 그림 없는 카드 — 아는 카드사는 기관 색 면, 모르면 대체 그림.
- 상세에는 카드 이름을 글로.
- 그림 위는 배지(상태) · Indicator(장수) 둘까지.

### ❌ Don't

- 불투명한 테 · 그림자로 그림 둘레 두르기.
- 크기와 상관없이 모서리 하나(8)로.
- 세로 카드를 잘리지 않게 작게 넣거나 세로 틀로 바꾸기.
- 모르는 카드사를 브랜드 파랑 · 회색 면으로 칠하기, 카드 면에 광택 띠.
- 깨진 그림 아이콘 · 빈 칸 · 파일 이름 `alt`.
- 단종 · 상태를 불투명도로 흐리기, 마우스에 키우기.
- 그림 위에 셋 이상 · 하트 버튼 · 점 지시자 · 화살표 · 자동 넘김.

## Specification

`image-frame.yaml` · `card-art.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Image Frame · 카드 그림을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `loaded` 에서 바뀌는 값만 적었다.

[그림: Specification — image-frame.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#image-frame)

[그림: Specification — card-art.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#card-art)

## SEED 와 다른 점

- **윤곽은 늘 그린다** — SEED 는 CSS · React 의 기본이 꺼짐(rootage JSON 기본 · 디자인 그림은 켬)이고 Figma 코드 생성은 윤곽을 옮기지 않는다. porest 는 끄는 속성을 두지 않는다. 값은 SEED stroke.neutral-subtle 그대로 `stroke-neutral-overlay`(v118)다.
- **모서리를 폭으로 저절로 고른다** — SEED React 는 기본 r2(8) 하나라 24 · 48 그림은 쓰는 쪽이 손으로 내린다.
- **불러오는 동안은 스켈레톤, 실패는 대체 그림** — SEED React 는 받는 중에도 대체 그림을 바로 보여 "불러오는 중" 과 "없음" 이 같다(SEED 디자인 문서는 스켈레톤이라 적었다 — 그쪽을 따른다). 10초가 지나면 실패로 바꾼다(Skeleton 시간표).
- **실패해도 이름이 남는다** — SEED 는 실패하면 `img` 를 숨겨 아무것도 읽히지 않는다.
- **그림 위는 배지 · Indicator 둘, 네 모서리만** — Reaction Button(하트) · 콘텐츠 종류 아이콘은 쓸 자리가 없어 두지 않는다. SEED React Floater 는 9자리를 받는다.
- **Indicator 바탕은 `overlay-dim-dark`(검정 65%)** — SEED static-black-alpha-800(63.5%)에 맞는 토큰이 porest 에 없어 가장 가까운 딤을 두 모드에 쓴다(토큰을 더하지 않았다). Indicator 를 읽는 글(`label`)로 무엇의 수인지 알린다 — SEED 는 "+9" 만 읽힌다.
- **카드 그림을 더한다** — 비율 1.586 · 세로 그림 돌리기 · 그림 없는 카드의 기관 색 면. SEED 는 사진을 늘 cover 로 채우고 실물 그림 규칙이 없다.

## Migration notes

### 2026-10-17 — 큰 글자에서 글이 안 드는 카드 면

사용자가 [03-D 목록 · 카드 · 표 비교 페이지](https://claude.ai/artifact/7TVGy8o47HBg4R3SefDmf6) 결정 3 에서 첫 글자 면(A)을 골랐다 — 면 글자는 배율을 따르지 않게(B) · 회사 이름만(C)은 고르지 않았다(`card-art.yaml` label.fit). 지금 웹 `card-art.tsx` · 앱 `p_card_art.dart:164` 는 스펙 값 그대로라 폭 96 ~ 123 면 · 글자 200% 에서 글이 면 위로 밀려 잘리고(웹) RenderFlex 가 17 넘친다(앱). 판단은 면 높이 < (회사 줄 높이 + 카드 이름 한 줄 높이) × 글자 배율 + 아래 여백 — 웹은 틀의 높이 컨테이너 쿼리(줄 높이가 rem 이라 `calc(2.1875rem + 8px)` · large `calc(2.5rem + 14px)`), 앱은 `LayoutBuilder` 에서 같은 식. 레시피(`image-frame.tsx` 의 `CardFace`)는 아직 폭으로만 가른다. 지금 Desk 화면에는 medium 96 ~ 123 을 쓰는 곳이 없다(웹 카드 혜택 폰 목록 56 · 데스크톱 격자 280 이상) — 폭 360 에 격자 셋(칸 96)을 두면 생긴다. 옛 스펙은 `card-art.history/v-pre-app-type-03d.yaml`.

### 2026-10-08 — 비율 값을 "W / H" 글 하나로

YAML 이 `1` · `2` · `1.586` 은 숫자로, `16 / 9` · `4 / 3` · `6 / 7` · `4 / 5` · `2 / 3` 은 글로 읽혀(YAML 은 나누기를 하지 않는다) 제품 검사기가 여덟 중 숫자 셋만 쟀다(desk-front #428). 화면은 같았고 잃은 것은 검사뿐이다. 여덟 모두 브라우저 계산값과 같은 꼴의 글(`"1 / 1"` · `"2 / 1"` · `"16 / 9"` · `"4 / 3"` · `"6 / 7"` · `"4 / 5"` · `"2 / 3"` · `"1.586 / 1"`)로 적었다 — 검사기는 글 그대로 맞춘다(제품의 재는 법도 숫자 비교에서 글 비교로 바꾼다). Image Frame · 카드 그림(`card-art.yaml`)의 비율도 같은 꼴로 고쳤다. 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 4.

### 2026-10-04 — SEED Image Frame 으로 새로 둔다

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X)에서 정했다 — 틀은 SEED Image Frame + 투명 윤곽(1A — 새 토큰 `stroke-neutral-overlay`, v118 · Avatar 윤곽도 이 색), 모서리는 SEED 폭 기준(2A — 24 이하 4 · 48 이하 6 · 그 위 8 · 화면 폭 0, 스켈레톤의 썸네일도 이 값), 세로 카드 그림은 90° 돌려 가로 틀에(3A), 그림 없는 카드는 카드사 색 + 대비 고침(4B — 기관 색 표 하나), 그림 위는 배지(solid) · 장수(Indicator)만(8A). 불투명한 윤곽 · 모서리 8 하나 · 넣고 둘레 바탕 · 세로 틀 · 아는 회사도 회색 대체 그림 · 하트는 고르지 않았다. 여러 장의 Carousel 은 걷었다(7A — `carousel.history/v-pre-seed-image.*`).

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다. dev 실데이터는 카드 9,503장 · 그림 표본 150장).

- **세로 카드 그림이 가운데만 보인다** — 표본 150장 중 80장이 세로(0.62 ~ 0.64)인데 모든 틀이 가로 cover 라 높이의 29 ~ 41% 만 보인다(웹 `pages/card-benefit/ui/CardBenefitPage.tsx:191-226 · 416-445` · `CardBenefitDetailDialog.tsx:92-121` · `widgets/asset-full/ui/AssetEditDialog.tsx:934-939 · 1042-1047`, 앱 `features/card/presentation/card_benefits_screen.dart:578-590` · `card_benefit_detail_sheet.dart:307-318` · `features/asset/presentation/card_add_dialog.dart:866-878 · 1043-1052`). `CardArt` 로 돌린다.
- **상세 그림 틀이 2.16:1** — 웹 상세 대화상자가 최대 높이 220 을 걸어 1280 에서 476 × 220 이다(`CardBenefitDetailDialog.tsx:92-101`). 1.586 그대로 두고 폭을 줄인다(폰 상세와 같은 312, 가운데).
- **상세에 카드 이름이 없다** — 그림이 뜨면 제목 "카드 상세" 뿐이고 이름은 웹 `alt` 에만(`CardBenefitDetailDialog.tsx:79-130 · 620`), 앱은 이름 없는 그림 노드다(`card_benefit_detail_sheet.dart:33 · 294-344`). 모르는 회사의 앱 대체 아트는 글 · 의미가 0 이다(`:362-380`).
- **그림 없는 카드(82%)의 글자가 약하다** — 웹 단색 + 흰 18% 광택 + 흰 글자로 NH농협카드 3.39(광택 위 2.73) · 하나 4.20 · 롯데 4.38(`entities/card/lib/cardBrand.ts:27-38` · `CardBenefitPage.tsx:227-300` · `CardBenefitDetailDialog.tsx:132-229`), 앱 그라데이션 3.56 ~ 3.85(`features/card/presentation/widgets/card_brand.dart:57-72`). 기관 색 한 색 + 표의 글자색으로.
- **모르는 카드사(44곳)** — 웹은 브랜드 파랑(진짜 회사 색처럼 보인다 — `cardBrand.ts` 의 `CARD_FALLBACK_GRADIENT`), 앱은 회색 + 카드 아이콘이고 상세에 이름이 없다. 대체 그림(`credit-card`) + 이름 글로.
- **카드사 색 표가 둘** — 같은 회사가 다른 색이다(하나 #008485 · #008C74, NH농협 #00A651 · #00A149 — `shared/lib/porest/bank-colors.ts` ↔ `cardBrand.ts`, 앱도 같은 두 벌). `institution-colors.yaml` 하나로.
- **윤곽이 0** — 흰 카드 그림이 흰 바탕에 묻힌다(9월 24일 캡처). 투명 윤곽으로.
- **모서리가 12 · 6 · 4 · 8 로 갈린다** — 웹 격자 · 상세 12, 웹 폰 목록 6 · 앱 4(`card_benefits_screen.dart:509-597`), 편집 미리보기 8 · 카탈로그 4. 폭으로 고른다(목록 56 · 격자 · 상세 8, 카탈로그 44 는 6).
- **불러오는 동안 빈 칸** — 앱 그림 7곳 모두 `loadingBuilder` 가 없고, 웹은 카드 혜택만 회색 상자다. 스켈레톤으로.
- **실패하면 깨진 그림** — 웹 자산 편집의 카드 미리보기 · 카탈로그 목록(`AssetEditDialog.tsx:934 · 1042`, `onError` 없음). 대체 그림으로.
- **단종 카드를 흐린다** — 웹 0.65 · 0.6(`CardBenefitPage.tsx:175 · 400`), 앱 0.6 · 0.7(`card_benefits_screen.dart:416` · `card_benefit_detail_sheet.dart:305` · `card_add_dialog.dart:1034`). 흐림을 걷고 "단종" 배지(격자 · 상세는 그림 위 시작, 목록은 이름 옆).
- **이름을 두 번 읽는다** — 웹 카드 혜택 칸의 `alt` 가 옆 이름과 같다(`CardBenefitPage.tsx:203 · 434 · 447-458`). 옆에 이름이 있으면 `alt=""`.
- **한 쪽 60장을 한 번에 받는다** — `loading="lazy"` 가 0이다(`CardBenefitPage.tsx:46`). `lazy` 가 기본이다.
- **HR 규정 그림** — 16장(16.3MB)을 한 번에 받고, `alt` 가 파일 이름("rule_1_1")이며, 정사각 그림을 높이 192 틀에 잘라 58.5 ~ 93% 만 보이고, 마우스에 카드가 1.05배 커진다(모션 줄이기도 무시 — `features/culture-regulation/ui/RuleVacation.tsx:14 · 23 · 42 · 66` · `RuleAttire.tsx` · `RuleEducation.tsx` · `RuleCulture.tsx` 같은 자리, `public/rule_*.png` 중 4장은 확장자만 .png 인 JPEG). Image Frame 1:1 · `lazy` · 확대를 걷고 · 제목 · 설명이 내용을 말하므로 장식(`alt=""`).
- **진입 없는 그림** — 웹 카드 정보 머리(`widgets/card-detail/ui/CardInfoHeader.tsx:24-42`, 라우트 `/desk/card/:assetRowId` 를 여는 곳이 0), 앱 `/cards` · `/cards/:id`(`features/card/presentation/card_detail_screen.dart:60-80`, 1.6). 살릴 때 이 규칙으로.
- **첨부 썸네일** — 영수증 · 메모 첨부의 사진 썸네일(80 · 모서리 12 · 같은 투명 윤곽)은 [Attachment Input](attachment-input.md) 이 그린다(2026-10-15 마무리 4A — 앱 첨부 `features/file/presentation/file_attachment_section.dart` 는 붙은 곳이 0 이라 새로 연다). 확대 보기 · 갤러리는 기능을 정할 때 이 규칙으로 정한다.
