# Content Placeholder

> 이미지가 없거나 불러오지 못했을 때 그 자리를 채우는 대체 그림 — 옅은 면 가운데에 무엇이 없는지 말하는 선 아이콘. 카드 그림 · 혜택 그림 · 첨부 사진처럼 이미지가 들어갈 틀이 비었을 때 쓴다 — 보통은 [Image Frame](image-frame.md) 이 제 대체 그림으로 그린다. 불러오는 동안에는 같은 모서리의 [Skeleton](skeleton.md) 이고, 사람의 사진이 없으면 [Avatar](avatar.md) 의 이니셜, 물건 타일의 그림이 없으면 [Logo Tile](logo-tile.md) 의 첫 글자다.

구조는 당근 [SEED Content Placeholder](https://seed-design.io/components/content-placeholder)(Apache-2.0)를 따른다 — 면 · 그림, 그림은 틀 높이의 50%(16 ~ 160), 제 모서리 없음. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). groo 에 처음 두는 부품이다 — 옛 [Aspect Ratio](aspect-ratio.md) 스펙의 "이미지 로딩 전 placeholder" 한 줄을 대신한다.

수치 원본은 [`content-placeholder.yaml`](content-placeholder.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 카드 그림 · 혜택 그림 · 첨부 사진이 없을 때 — 라이트 · 다크](../../site/components/specs/content-placeholder.tsx#hero)

### 직접 골라 보기

틀 크기 · 비율 · 그림(아이콘)을 고르면 스펙대로 그린 대체 그림과 그 코드가 바뀐다. 틀을 줄이고 늘리면 그림이 16 ~ 160 사이에서 따라간다.

[그림: 플레이그라운드](../../site/components/specs/content-placeholder.tsx#playground)

## Anatomy

[그림: 대체 그림은 틀을 채운 면과 가운데 그림](../../site/components/specs/content-placeholder.tsx#anatomy)

| ⓐ Root | 자리 — 담는 틀(이미지 틀)을 채운다. 모서리는 틀이 자른다. |
| ⓑ Glyph | 그림 — 가운데, 정사각. 무엇이 없는지 말하는 선 아이콘. |

[표: 부위](content-placeholder.yaml#slots)

## Properties

### 크기 — 그림은 틀 높이의 절반

틀(이미지가 들어갈 자리)을 그대로 채우고, 그림은 틀 높이의 50% 정사각으로 가운데에 둔다 — 16 보다 작아지지 않고 160 보다 커지지 않는다. 틀 폭이 그보다 좁으면 폭에 맞춘다. 40 썸네일이면 20, 화면 폭 4:3 사진(360 × 270)이면 135, 그보다 크면 160 이다.

[그림: 40 썸네일 · 120 카드 · 화면 폭 4:3 사진 · 좁고 긴 틀](../../site/components/specs/content-placeholder.tsx#sizes)

[표: 공통](content-placeholder.yaml#base)

### 색

면은 `bg-neutral-weak`(Skeleton 의 면과 같은 색), 그림은 `stroke-neutral-weak` 다 — SEED 의 그림 색(palette gray-400)과 같은 단계인 groo gray-400 이고, Bottom Sheet 손잡이와 같은 역할이다. 면 위 1.14 · 다크 1.20 으로 옅다 — 그림은 "여기에 그림이 있을 자리" 를 알리는 장식이고, 무엇이 없는지는 대체 글이 말한다.

[그림: 흰 카드 위 · 다크 — 옅은 면과 그림](../../site/components/specs/content-placeholder.tsx#colors)

### 그림 — 무엇이 없는지

기본은 lucide `image` 다. 자리가 무엇인지 아이콘으로 말할 수 있으면 그 아이콘을 쓴다 — 카드 그림 `credit-card`, 영수증 사진 `receipt`, 문서 `file-text`. 선 굵기는 24 격자 기준 1.5 로, 그림이 커지면 같은 비율로 굵어진다(Result Section 의 아이콘과 같은 결, v106).

[그림: 그림 — 사진 · 카드 · 영수증 · 문서](../../site/components/specs/content-placeholder.tsx#glyphs)

## Guidelines

### 불러오는 동안은 Skeleton

이미지를 불러오는 동안은 같은 모서리 · 같은 크기의 [Skeleton](skeleton.md) 이다 — 이 그림은 다 불러왔는데 없거나 실패했을 때만 보인다. 불러오는 중과 없음이 같은 그림이면 기다려야 하는지 알 수 없다. 이미지 틀도 기다리는 영역의 시간표를 따른다([Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안)).

[그림: 불러오는 중은 스켈레톤 · 실패는 대체 그림 — 둘을 같은 그림으로 보인 화면](../../site/components/specs/content-placeholder.tsx#loading-guide)

### 깨진 이미지 · 빈 칸을 두지 않는다

불러오지 못하면 이 그림으로 바꾼다 — 브라우저의 깨진 이미지 아이콘과 대체 글이 그대로 보이거나, 투명한 빈 칸이 남거나, 다른 곳의 기본 그림(외부 주소)으로 바뀌지 않게 한다.

[그림: 실패 — 대체 그림 · 깨진 이미지 아이콘 · 빈 칸](../../site/components/specs/content-placeholder.tsx#broken-guide)

### 틀이 모양을 정한다

제 모서리 · 테두리 · 그림자가 없다 — 담는 틀(카드 · 썸네일)이 자르고 두른다. 그래서 같은 대체 그림이 둥근 썸네일에도 화면 폭 사진에도 맞는다.

### 이 부품이 아닌 것

- 사람의 사진이 없으면 [Avatar](avatar.md) 의 이니셜이다.
- 자산 · 카드 로고의 글자 모노그램(로고를 못 불러오면 이름 첫 글자)은 이것이 아니다 — [Logo Tile](logo-tile.md) 의 첫 글자다.
- 그림이 없는 카드 가운데 아는 카드사의 카드는 이것이 아니다 — 기관 색 면에 회사 · 카드 이름을 쓴 카드 면이다([Image Frame](image-frame.md) 의 카드 그림). 모르는 카드사만 이 그림(`credit-card`)이다.
- 비어 있는 목록 · 화면은 [Result Section](result-section.md) `empty` 다.

## 코드

레시피 `recipes/shadcn/components/ui/content-placeholder.tsx` 를 쓴다. 그림 틀은 [Image Frame](image-frame.md) 이 이 그림을 대체 그림으로 쓰므로(아이콘은 `fallbackIcon`, 대체 글은 그림의 `alt`), 따로 부르는 것은 Image Frame 이 아닌 틀을 짤 때뿐이다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `ContentPlaceholder` — `icon`(lucide 아이콘 — 기본 `ImageIcon`), `label`(대체 글 — 주면 `role="img"` + 이름, 안 주면 보조 기술에 숨긴다). 크기 · 비율 · 모서리는 담는 틀이 정한다.

### 카드 그림 — 불러오지 못하면

[그림: 카드 그림이 없을 때 · 불러오지 못했을 때](../../site/components/specs/content-placeholder.tsx#ex-basic)

```tsx
import { CreditCard } from "lucide-react"
import { ImageFrame } from "@/components/ui/image-frame"

{/* 틀 — 비율 · 모서리(폭 112 → 8)는 Image Frame 이 정하고, 없거나 못 불러오면 이 그림을 그린다. 대체 글은 alt 를 이어받는다 */}
<ImageFrame ratio="card" width={112} src={card.imageUrl} alt={`${card.name} 카드 그림`} fallbackIcon={<CreditCard />} />
```

카드 그림은 보통 `CardArt` 로 그린다 — 아는 카드사는 카드 면, 모르는 카드사만 이 그림이다([Image Frame](image-frame.md) 의 "카드 그림").

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 이미지가 없음 | 처음부터 이 그림 |
| 불러오는 중 | 같은 모서리의 Skeleton — 이 그림이 아니다 |
| 불러오지 못함 | 이 그림으로 바꾼다 — 깨진 아이콘 · 빈 칸 · 외부 그림을 보이지 않는다 |
| 누르기 | 틀이 누르는 것이면 틀이 받는다 — 그림은 누르지 않는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 이미지가 뜻을 가졌으면(대체 글이 있으면) 그 글을 자리 이름으로 남긴다 — `role="img"` + `aria-label`. 장식 이미지였으면 자리도 숨긴다 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 그림은 장식 — 면 위 1.14 · 다크 1.20(SEED 1.22 · 1.50), 기준 밖. 무엇이 없는지는 대체 글이 말한다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없다 — 해당 없음 |
| **ARIA** | 그림 아이콘은 늘 `aria-hidden`. 앱은 `Semantics(label: 대체 글, image: true)` — 장식이면 `ExcludeSemantics` |

## Do / Don't

### ✅ Do

- 없거나 불러오지 못한 이미지 자리를 옅은 면 + 그림으로.
- 그림은 자리를 말하는 아이콘 — 카드 · 영수증 · 문서.
- 불러오는 동안은 같은 모서리의 스켈레톤.
- 대체 글이 있던 이미지면 그 글을 자리 이름으로.

### ❌ Don't

- 깨진 이미지 아이콘 · 대체 글을 그대로 · 투명한 빈 칸.
- 외부 주소의 기본 그림으로 바꾸기.
- 불러오는 중과 실패를 같은 그림으로.
- 대체 그림에 제 모서리 · 테두리 · 그림자.

## Specification

`content-placeholder.yaml` 의 규칙을 하나도 빼지 않고 그린다 — 웹 · 앱이 대체 그림을 만들 때 이 값을 그대로 쓴다.

[그림: Specification — content-placeholder.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#content-placeholder)

## SEED 와 다른 점

- **그림은 lucide 선 아이콘**(기본 `image`, v106) — SEED 의 12가지 그림(당근 서비스별 — 부동산 · 중고차 · 알바 …)은 브랜드 자산이라 쓰지 않는다.
- **그림 색은 `stroke-neutral-weak`**(groo gray-400) — SEED palette gray-400 의 짝. groo 면과 그림이 SEED 보다 조금 옅다(1.14 · 1.20 — SEED 1.22 · 1.50).
- **불러오는 동안에는 보이지 않는다** — SEED React Image Frame 은 불러오는 동안에도 이 그림을 보여 "불러오는 중" 과 "없음" 이 같아진다(SEED 디자인 문서는 로딩을 Skeleton 이라 적었다 — 그쪽을 따른다).
- **대체 글을 자리 이름으로 남긴다** — SEED 는 그림을 숨기기만 한다.

## Migration notes

### 2026-10-03 — 새로 둔다(SEED Content Placeholder)

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)의 "따라오는 것" 에서 정했다 — 이미지 자리는 기다리는 동안 같은 모서리의 스켈레톤, 없거나 실패하면 Content Placeholder(옅은 면 + 그림), 깨진 이미지 아이콘 · 빈 칸은 없앤다.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **Desk 웹** — `<img>` 9곳 중 실패 대체가 있는 곳은 4곳. 5곳은 실패하면 브라우저의 깨진 이미지 아이콘 + 대체 글이 보인다(`widgets/card-detail/ui/CardInfoHeader.tsx:26 · 37` · `AvailableBenefitsList.tsx:64` · `AssetEditDialog.tsx:934 · 1042` — 쓰는 곳 없던 `CardCatalogCombobox.tsx` 의 두 곳은 2026-10-15 Command 와 함께 지웠다). 불러오는 동안은 빈 자리이고(`entities/asset/ui/asset-logo.tsx:32-50` — 투명 40 × 40), 카드 혜택 그림만 회색 상자가 미리 자리를 잡는다(`CardBenefitPage.tsx:191-205`, 페이지 위 1.04:1).
- **Desk 앱** — 이미지 9곳 모두 실패 대체는 있고(`errorBuilder`) 불러오는 동안의 표시는 0곳이다(`loadingBuilder`). 카드 목록은 회색 + 카드 아이콘(`card/card_screen.dart:410-420`), 카드 혜택 · 상세 · 혜택 시트 · 카드 추가(`card_benefits_screen.dart:581-585` · `card_detail_screen.dart:66-75` · `card_benefit_detail_sheet.dart:314-320` · `asset/card_add_dialog.dart:871 · 1046`).
- **HR 웹** — 규정 그림 12곳(`culture-regulation/ui/Rule*.tsx`)에 자리 · 실패 대체가 없다. 프로필 사진 실패 대체가 외부 `github.com/shadcn.png` 다(`features/user-profile/ui/UserEditDialog.tsx:261-269`).
- 자산 · 카드 로고의 글자 모노그램(웹 `asset-logo.tsx:40` · 앱 `asset/widgets/asset_logo.dart:24-37`)은 2026-10-04 [Logo Tile](logo-tile.md) 로 정했다(첫 글자 먼저 · 그림이 오면 덮기 · 실패하면 첫 글자). 그림 틀은 [Image Frame](image-frame.md) 이 이 그림을 대체 그림으로 쓴다.
