# Content Placeholder

> 이미지가 없거나 불러오지 못했을 때 그 자리를 채우는 대체 그림입니다 — 옅은 면 가운데에 무엇이 없는지 말하는 선 아이콘을 둡니다. 카드 그림 · 혜택 그림 · 첨부 사진처럼 이미지가 들어갈 틀이 비었을 때 쓰며, 보통은 [Image Frame](image-frame.md) 이 제 대체 그림으로 그립니다.

불러오는 동안에는 같은 모서리의 [Skeleton](skeleton.md) 을, 사람의 사진이 없으면 [Avatar](avatar.md) 의 이니셜을, 물건 타일의 그림이 없으면 [Logo Tile](logo-tile.md) 의 첫 글자를 씁니다. 구조는 면 · 그림 둘이고, 그림은 틀 높이의 50%(16 ~ 160)이며, 제 모서리가 없습니다.

수치 원본은 [`content-placeholder.yaml`](content-placeholder.yaml)입니다.

[그림: 카드 그림 · 혜택 그림 · 첨부 사진이 없을 때 — 라이트 · 다크](../../site/components/specs/content-placeholder.tsx#hero)

### 직접 골라 보기

틀 크기 · 비율 · 그림(아이콘)을 고르면 대체 그림과 코드가 함께 바뀝니다. 틀을 줄이고 늘리면 그림이 16 ~ 160 사이에서 따라갑니다.

[그림: 플레이그라운드](../../site/components/specs/content-placeholder.tsx#playground)

## Anatomy

[그림: 대체 그림은 틀을 채운 면과 가운데 그림](../../site/components/specs/content-placeholder.tsx#anatomy)

| ⓐ Root | 자리 — 담는 틀(이미지 틀)을 채웁니다. 모서리는 틀이 자릅니다. |
| ⓑ Glyph | 그림 — 가운데, 정사각. 무엇이 없는지 말하는 선 아이콘입니다. |

[표: 부위](content-placeholder.yaml#slots)

## Properties

### 크기 — 그림은 틀 높이의 절반

틀(이미지가 들어갈 자리)을 그대로 채우고, 그림은 틀 높이의 50% 정사각으로 가운데에 둡니다 — 16 보다 작아지지 않고 160 보다 커지지 않습니다. 틀 폭이 그보다 좁으면 폭에 맞춥니다. 40 썸네일이면 20, 화면 폭 4:3 사진(360 × 270)이면 135, 그보다 크면 160 입니다.

[그림: 40 썸네일 · 120 카드 · 화면 폭 4:3 사진 · 좁고 긴 틀](../../site/components/specs/content-placeholder.tsx#sizes)

[표: 공통](content-placeholder.yaml#base)

### 색

면은 `bg-neutral-weak`(Skeleton 의 면과 같은 색), 그림은 `stroke-neutral-weak`(Bottom Sheet 손잡이와 같은 역할)입니다. 면 위 1.14 · 다크 1.20 으로 옅습니다 — 그림은 "여기에 그림이 있을 자리" 를 알리는 장식이고, 무엇이 없는지는 대체 글이 말하기 때문입니다.

[그림: 흰 카드 위 · 다크 — 옅은 면과 그림](../../site/components/specs/content-placeholder.tsx#colors)

### 그림 — 무엇이 없는지

기본은 lucide `image` 입니다. 자리가 무엇인지 아이콘으로 말할 수 있으면 그 아이콘을 씁니다 — 카드 그림 `credit-card`, 영수증 사진 `receipt`, 문서 `file-text`. 선 굵기는 24 격자 기준 1.5 이고, 그림이 커지면 같은 비율로 굵어집니다(Result Section 의 아이콘과 같은 결).

[그림: 그림 — 사진 · 카드 · 영수증 · 문서](../../site/components/specs/content-placeholder.tsx#glyphs)

## Guidelines

### 불러오는 동안은 Skeleton

이미지를 불러오는 동안은 같은 모서리 · 같은 크기의 [Skeleton](skeleton.md) 을 씁니다 — 이 그림은 다 불러왔는데 없거나 실패했을 때만 보입니다. 불러오는 중과 없음이 같은 그림이면 기다려야 하는지 알 수 없기 때문입니다. 그림 자리의 스켈레톤 면은 **처음부터** 깝니다 — 영역의 시간표(0 ~ 1초는 틀만)를 기다리지 않고, 빈 칸을 두지 않습니다. 받아 둔 그림(붙는 순간 이미 받은 그림)은 스켈레톤 없이 바로 보입니다. 그림 자리가 시간표에서 따르는 것은 10초 실패입니다 — 10초가 지나도 안 오면 이 그림입니다([Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) · [Image Frame](image-frame.md) 의 State).

[그림: 불러오는 중은 스켈레톤 · 실패는 대체 그림 — 둘을 같은 그림으로 보인 화면](../../site/components/specs/content-placeholder.tsx#loading-guide)

### 깨진 이미지 · 빈 칸을 두지 않습니다

불러오지 못하면 이 그림으로 바꿉니다 — 브라우저의 깨진 이미지 아이콘과 대체 글이 그대로 보이거나, 투명한 빈 칸이 남거나, 다른 곳의 기본 그림(외부 주소)으로 바뀌지 않게 합니다.

[그림: 실패 — 대체 그림 · 깨진 이미지 아이콘 · 빈 칸](../../site/components/specs/content-placeholder.tsx#broken-guide)

### 틀이 모양을 정합니다

제 모서리 · 테두리 · 그림자가 없습니다 — 담는 틀(카드 · 썸네일)이 자르고 두릅니다. 그래서 같은 대체 그림이 둥근 썸네일에도 화면 폭 사진에도 맞습니다.

### 대신 보이는 것 고르기

내용이 아직 없거나 · 없거나 · 못 받았을 때 그 자리에 무엇을 보일지는 이 절 한 곳에서 고릅니다 — [Skeleton](skeleton.md) · [Result Section](result-section.md) · [Image Frame](image-frame.md) · [Avatar](avatar.md) · [Logo Tile](logo-tile.md) · [Chart](chart.md) 는 이 절을 가리키고 제 값 · 모양만 둡니다. 기다리는 시간 · 덮개(무엇으로 기다리나)는 [Skeleton 의 "무엇으로 기다리나"](skeleton.md#무엇으로-기다리나) 한 표에 있고 여기서 다시 적지 않습니다. 비어 있음의 글 · 버튼은 [Result Section 의 "비어 있는 까닭마다"](result-section.md#비어-있는-까닭마다) 에 있습니다.

**① 영역(목록 · 카드 · 차트) — 상황 → 보이는 것**

| 상황 | 보이는 것 | 글 · 버튼 | 어디서 |
|---|---|---|---|
| 0 ~ 1초 | 틀만 — 머리 · 필터 · 탭은 그리고 데이터 자리는 비운 채 높이만 지킨다 | — | Skeleton 시간표 |
| 1초 ~ (구조를 안다) | **Skeleton** — 곧 올 줄 · 숫자 · 차트 자리 모양대로 | 5초에 "평소보다 오래 걸리고 있어요." | Skeleton "무엇으로 기다리나" |
| 다 옴 · 하나도 없음(처음) | **Result Section `empty`** — 아이콘이 그 내용을 말한다 | 제목 "아직 기록한 거래가 없어요" · 설명은 할 일 · 첫 버튼 "거래 추가" | Result Section |
| 다 옴 · 이 기간에 없음 | Result Section `empty` | 제목 "10월 거래가 없어요" · 그 화면에서 만들 수 있으면 첫 버튼 | Result Section |
| 다 옴 · 걸러서 0건 | Result Section `empty` — 걸러진 아이콘 | 제목 "조건에 맞는 거래가 없어요" · 설명 "조건을 바꾸거나 지워 보세요." · 버튼 없음(필터 바 맨 앞 지우기가 맡는다) | Result Section |
| 검색 0건 | Result Section `empty` `medium` | "'{검색어}'에 대한 … 없어요" | [Icon Picker](icon-picker.md) · [Searchable List](searchable-list.md) |
| 못 받음 · 10초 | **Result Section `failure`** | "…를 불러오지 못했어요" + "다시 시도" — 이미 보인 내용은 지우지 않습니다 | Result Section |
| 보던 내용이 있는데 다시 받기 실패 | 내용 그대로 + [Snackbar](snackbar.md) | "새로 고치지 못했어요." — 스켈레톤으로 돌아가지 않습니다 | Skeleton "같은 내용을 다시 받을 때" |

**② 그림 자리 — 무엇이 · 언제 무엇으로**

| 무엇 | 부품 | 받는 중 | 없음 | 실패 |
|---|---|---|---|---|
| 사진 · 카드 그림 · 규정 그림 | [Image Frame](image-frame.md) | 같은 모서리의 스켈레톤 면 — 처음부터(받아 둔 그림은 바로) | **이 그림(Content Placeholder)** — 옅은 면 + 자리를 말하는 그림(카드 · 영수증 · 문서). 아는 카드사의 그림 없는 카드는 카드 면 | 이 그림 |
| 사람 | [Avatar](avatar.md) | 이니셜이 먼저 · 사진이 오면 덮는다 | 이니셜 + 이름 색 | 이니셜 |
| 은행 · 증권 · 카드 · 회사(물건) | [Logo Tile](logo-tile.md) | 첫 글자가 먼저 · 그림이 오면 덮는다 | 첫 글자 + 기관 색(표에 없으면 이름 색) | 첫 글자 |
| 카테고리 · 기능(분류) | [List](list.md) 타일 | — 그림을 받지 않는다(아이콘) | — | — |
| 차트 자리 | [Chart](chart.md) | 차트 자리만 스켈레톤(모서리 16), 머리 · 타일 이름은 그린다 | Result Section `medium` `empty` | Result Section `medium` `failure` |

무엇을 Image Frame 으로 담는지(사람 · 물건 · 그림 · 분류 · 비율 상자)는 [Image Frame 의 "무엇을 Image Frame 으로"](image-frame.md#무엇을-image-frame-으로) 에 있습니다.

**③ 비슷한 것끼리**

| | Skeleton | Content Placeholder | Result Section `empty` | Result Section `failure` | 이니셜 · 첫 글자 |
|---|---|---|---|---|---|
| 뜻 | 곧 온다 | 그림이 없다 · 못 받았다 | 내용이 없다 | 못 받았다 | 이름은 안다 |
| 모양 | 자리 모양의 회색 면(반짝임) | 옅은 면 + 가운데 선 그림(틀 높이 50%, 16 ~ 160) | 아이콘 40 · 제목 · 설명 · 버튼 | 위험 색 느낌표 · "다시 시도" | 이름 색 원 · 타일 + 첫 글자 |
| 크기 · 자리 | 올 내용과 같은 크기 | 담는 틀 그대로 | 영역 가운데 | 영역 가운데 | 자리 크기 그대로 |
| 누를 것 | 없음 | 없음(틀이 받는다) | 첫 버튼 · 없을 수도 | 다시 시도 | 없음 |
| 끝나는 때 | 내용 · 결과가 오면 | 바뀌지 않는다 | 내용이 생기면 | 다시 받으면 | 그림이 오면 덮인다 |
| 보조 기술 | 숨김 · 영역 `aria-busy` | 대체 글을 자리 이름으로 | `role="status"` | `role="status"` — 무엇이 안 됐는지 | 혼자면 이름, 이름 옆이면 장식 |

**예외 · 주의**

- **받아 둔 그림은 스켈레톤 없이 바로** — 붙는 순간 이미 받은 그림은 그대로 보입니다.
- **이니셜 · 첫 글자는 스켈레톤이 아닙니다** — 이름은 이미 와 있습니다. 그림이 오면 덮습니다(Avatar · Logo Tile 의 규칙).
- **있고 없고가 갈리는 섹션은 스켈레톤에 넣지 않습니다** — 뜰지 알 수 없기 때문입니다([Skeleton](skeleton.md) 의 "틀은 먼저").
- **버튼은 그 화면이 할 수 있을 때만** — 보기만 하는 화면 · 걸러서 0건은 버튼 없이 둘 수 있습니다.
- **카드 · 띠 안의 결과는 `medium` · 좌우 0** — 카드 여백 24 가 맡습니다. 화면 전체는 `large` 입니다.
- **숫자 자리를 "—" · "0원" 으로 채우지 않습니다** — 기다리는 중이면 스켈레톤, 정말 0 이면 "0원" 입니다.
- **자산 · 카드 로고의 글자 모노그램 · 아는 카드사의 그림 없는 카드는 이 그림이 아닙니다** — 앞은 [Logo Tile](logo-tile.md) 의 첫 글자, 뒤는 기관 색 면에 회사 · 카드 이름을 쓴 카드 면([Image Frame](image-frame.md) 의 카드 그림)입니다. 모르는 카드사만 이 그림(`credit-card`)입니다.

[그림: 같은 띠의 네 상태 — 불러오는 중 · 처음 · 걸러서 0건 · 불러오지 못함](../../site/components/specs/content-placeholder.tsx#standin-guide)

## 코드

레시피 `recipes/shadcn/components/ui/content-placeholder.tsx` 를 씁니다. 그림 틀은 [Image Frame](image-frame.md) 이 이 그림을 대체 그림으로 쓰므로(아이콘은 `fallbackIcon`, 대체 글은 그림의 `alt`), 따로 부르는 것은 Image Frame 이 아닌 틀을 짤 때뿐입니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `ContentPlaceholder` — `icon`(lucide 아이콘 — 기본 `ImageIcon`), `label`(대체 글 — 주면 `role="img"` + 이름, 안 주면 보조 기술에 숨깁니다). 크기 · 비율 · 모서리는 담는 틀이 정합니다.

### 카드 그림 — 불러오지 못하면

[그림: 카드 그림이 없을 때 · 불러오지 못했을 때](../../site/components/specs/content-placeholder.tsx#ex-basic)

```tsx
import { CreditCard } from "lucide-react"
import { ImageFrame } from "@/components/ui/image-frame"

{/* 틀 — 비율 · 모서리(폭 112 → 8)는 Image Frame 이 정하고, 없거나 못 불러오면 이 그림을 그린다. 대체 글은 alt 를 이어받는다 */}
<ImageFrame ratio="card" width={112} src={card.imageUrl} alt={`${card.name} 카드 그림`} fallbackIcon={<CreditCard />} />
```

카드 그림은 보통 `CardArt` 로 그립니다 — 아는 카드사는 카드 면, 모르는 카드사만 이 그림입니다([Image Frame](image-frame.md) 의 "카드 그림").

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 이미지가 없음 | 처음부터 이 그림 |
| 불러오는 중 | 같은 모서리의 Skeleton — 이 그림이 아닙니다 |
| 불러오지 못함 | 이 그림으로 바꿉니다 — 깨진 아이콘 · 빈 칸 · 외부 그림을 보이지 않습니다 |
| 누르기 | 틀이 누르는 것이면 틀이 받습니다 — 그림은 누르지 않습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 이미지가 뜻을 가졌으면(대체 글이 있으면) 그 글을 자리 이름으로 남깁니다 — `role="img"` + `aria-label`. 장식 이미지였으면 자리도 숨깁니다 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 그림은 장식 — 면 위 1.14 · 다크 1.20, 기준 밖. 무엇이 없는지는 대체 글이 말합니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없습니다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없습니다 — 해당 없음 |
| **ARIA** | 그림 아이콘은 늘 `aria-hidden`. 앱은 `Semantics(label: 대체 글, image: true)` — 장식이면 `ExcludeSemantics` |

## Do / Don't

### ✅ Do

- 없거나 불러오지 못한 이미지 자리를 옅은 면 + 그림으로 채웁니다.
- 그림은 자리를 말하는 아이콘을 씁니다 — 카드 · 영수증 · 문서.
- 불러오는 동안은 같은 모서리의 스켈레톤을 씁니다.
- 대체 글이 있던 이미지면 그 글을 자리 이름으로 남깁니다.

### ❌ Don't

- 깨진 이미지 아이콘 · 대체 글을 그대로 · 투명한 빈 칸.
- 외부 주소의 기본 그림으로 바꾸기.
- 불러오는 중과 실패를 같은 그림으로.
- 대체 그림에 제 모서리 · 테두리 · 그림자.

## Specification

`content-placeholder.yaml` 의 규칙을 하나도 빼지 않고 그립니다 — 웹 · 앱이 대체 그림을 만들 때 이 값을 그대로 씁니다.

[그림: Specification — content-placeholder.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#content-placeholder)
