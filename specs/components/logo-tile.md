# Logo Tile

> 물건 하나를 보이는 각진 타일 — 은행 · 증권 · 카드 · 코인 · 금 같은 자산과 회사를 기관 색 면 + 이름의 첫 글자로 그리고, 그림(카드 그림 · 로고)이 있으면 그림이 오는 대로 덮는다. 사람은 [Avatar](avatar.md)(원), 카테고리 · 기능은 [List](list.md) 의 타일(옅은 색 + 아이콘), 사진 · 카드 그림 자체는 [Image Frame](image-frame.md) 이다.

SEED 에는 이 부품이 없다 — 가게 · 업체는 원 Avatar(Identity Placeholder `business`)이고 로고 · 브랜드 마크의 규칙은 출처에 없다. groo 는 사람만 Avatar 로 두기로 했고(2026-10-03), 물건은 이 타일이다. 모양 · 크기는 List 의 타일(40 · 모서리 크기 × 0.3), 첫 글자와 이름 색은 Avatar 의 규칙, 윤곽은 Image Frame 의 투명 윤곽이다(2026-10-04 사용자 결정). 지금 제품의 자산 로고(웹 `AssetLogo` · 앱 `AssetLogo`)와 HR 회사 로고를 대신한다.

수치 원본은 [`logo-tile.yaml`](logo-tile.yaml)이고, 기관 색은 [`institution-colors.yaml`](institution-colors.yaml)(78곳 — 그림 없는 카드의 면과 함께 쓴다)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 자산 줄 · 계좌 관리 · 자산 상세 머리 — 라이트 · 다크](../../site/components/specs/logo-tile.tsx#hero)

### 직접 골라 보기

이름 · 크기 · 그림(없음 · 카드 그림 · 로고)과 그림이 오는 순간을 고르면 스펙대로 그린 타일과 그 코드가 바뀐다. 이름을 바꾸면 기관 색 · 글자색 · 첫 글자가 규칙대로 바뀐다(표에 없는 이름은 이름 색).

[그림: 플레이그라운드](../../site/components/specs/logo-tile.tsx#playground)

## Anatomy

[그림: 타일 · 첫 글자 · 그림 판 · 안쪽 1px 윤곽](../../site/components/specs/logo-tile.tsx#anatomy)

| ⓐ Container | 타일 — 정사각, 모서리 크기 × 0.3. 기관 색 면 또는 이름 색 면. |
| ⓑ Initial | 첫 글자 — 이름의 첫 글자 하나. 그림이 없거나 · 오기 전이거나 · 실패했을 때. |
| ⓒ Plate · Image | 그림 판 · 그림 — 그림이 오면 첫 글자를 덮는다. 카드는 옅은 판, 로고는 흰 판. |
| ⓓ Stroke | 안쪽 1px 투명 윤곽 — 늘. 짙은 타일이 다크 표면에 묻히지 않게. |

[표: 부위](logo-tile.yaml#slots)

## Properties

### Size

크기는 List 의 타일과 같다 — 40 *(기본 — 목록 줄)* · 48(상세 머리) · 32(좁은 줄 · 카드 옆 회사 표시). 모서리는 크기 × 0.3(12 · 14 · 10), 첫 글자는 크기의 40%(16 · 19 · 13)다. 이 밖의 크기를 만들지 않는다 — 지금 32 · 36 · 40 · 48 · 52 와 모서리 12 고정이 섞여 있다.

[그림: 32 · 40 · 48 — 모서리 × 0.3 · 첫 글자 40%](../../site/components/specs/logo-tile.tsx#size)

[표: 크기](logo-tile.yaml#size)

[표: 공통](logo-tile.yaml#base.enabled)

### 면과 첫 글자

**이름** 은 기관이 있으면 기관 이름("신한"), 없으면 자산 이름("비상금")이다. 첫 글자 · 기관 색 찾기 · 이름 색 · 보조 기술의 이름이 모두 이 이름에서 나온다. 기관 색 표는 기관 이름으로만 찾는다 — 사용자가 지은 자산 이름 · HR 의 회사 이름은 표를 보지 않고 이름 색이다(표의 짧은 별칭 "우리" · "하나" · "국민" · "기업" 이 "우리 아이 적금" · "하나투어" 에 걸리지 않게).

- **기관 색 면**(`institution`) — 기관 이름이 [기관 색 표](institution-colors.yaml)에 있으면 그 색이다(찾기 — 공백을 빼고 같은 이름 · 별칭, 아니면 이름에 든 가장 긴 이름). 글자는 그 색 위 흰 글자가 4.5:1 이상이면 흰색(`static-white`), 아니면 짙은 글자(라이트 `fg-neutral` · 다크 `fg-neutral-inverted`)다 — 표의 `text` 가 그 답이다. 흰 · 짙은 글자 모두 모자라던 중간 밝기의 다섯 곳은 표가 명도만 고쳐 두었다. 기관 색은 모드를 따르지 않는다.
- **이름 색 면**(`name`) — 기관이 없거나 기관이 아닌 이름, 또는 표에 없는 기관이면 [Avatar](avatar.md) 와 같은 함수로 이름 색을 고른다(코드 포인트 합 % 10 → 차트 10색, 웹 · 앱이 같다). 글자는 `fg-neutral-inverted`(라이트 흰 · 다크 짙은 글자)다.
- **첫 글자** — 이름의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자 — "신한" → "신", "KB국민" → "K", "Upbit" → "U". 700 · 줄 높이 1. 두 글자 · 약칭을 넣지 않는다.

[그림: 기관 색 면 — 흰 글자 · 짙은 글자, 이름 색 면 — 라이트 · 다크](../../site/components/specs/logo-tile.tsx#face)

[표: 면](logo-tile.yaml#face)

[그림: 기관 색 표 — 78곳의 색 · 글자색 · 대비](../../site/components/specs/logo-tile.tsx#institution-colors)

### 그림

그림이 있으면 첫 글자 위에 판을 깔고 그림을 얹는다 — 판 안쪽 4.

- **카드 그림**(`card`) — 옅은 판(`bg-neutral-weak`) 위에 카드 전체가 보이게 — 판 안(크기 − 8)에 카드 비율(1.586)의 Image Frame 을 두고, 세로 그림은 시계 방향으로 90° 돌려 채운다. 정사각에 잘라 넣으면 카드의 63% 만 보인다.
- **로고 그림**(`logo`) — 흰 판(`static-white` — 두 모드 같다) 위에 잘리지 않게(`contain`). 다크에서도 로고의 검은 부분이 사라지지 않는다. 지금 자산에는 로고 그림이 없고, HR 회사 로고가 이것이다.

[그림: 카드 그림 — 옅은 판 위 카드 전체(세로는 돌림) · 로고 그림 — 흰 판](../../site/components/specs/logo-tile.tsx#image)

[표: 그림](logo-tile.yaml#image)

### 그림이 늦을 때 · 실패할 때

줄의 이름 · 금액은 이미 와 있고 그림만 늦게 온다 — 그래서 첫 글자 타일을 먼저 그리고, 그림이 오면 그 위를 덮는다(Avatar 와 같다 — 스켈레톤을 따로 두지 않는다). 그림을 못 불러오면 첫 글자 그대로다. 줄이 깜빡이지 않고, 빈 칸 · 깨진 그림이 보이지 않는다.

[그림: 첫 글자 먼저 → 그림이 오면 덮기 → 실패하면 첫 글자 그대로](../../site/components/specs/logo-tile.tsx#loading)

### State

상태는 `enabled` 하나다 — 타일은 누르지 않는다. 누르면 무언가 되는 자리는 타일을 감싼 줄 · 버튼이 누름 · 포커스를 가진다. 막힌 줄에서도 타일은 그대로다(아바타 · 사진처럼) — 줄의 글이 비활성 색이 된다.

## Guidelines

### 물건은 타일, 사람은 원

은행 · 증권 · 카드 · 코인 · 금 · 회사는 이 타일이다 — 원 아바타로 그리지 않는다. 카테고리 · 기능(거래 줄 · 알림 종류)은 기관이 아니라 분류라 List 의 타일(옅은 색 + 아이콘)이다. 한 목록 안에서 섞지 않는다 — 자산 목록은 로고 타일, 거래 목록은 카테고리 타일.

[그림: 사람은 원 Avatar · 물건은 Logo Tile · 분류는 List 타일](../../site/components/specs/logo-tile.tsx#thing-guide)

### 흰 글자가 모자라면 짙은 글자

기관 색 위 흰 글자가 4.5:1 에 못 미치면 짙은 글자다 — 지금 노랑 일곱 곳만 짙은 글자이고 유안타 2.54 · 대신 2.59 · NH농협 3.19 같은 열 곳은 흰 글자라 읽기 어렵다. 글자색을 화면이 고르지 않는다 — 표의 `text` 를 쓴다.

[그림: 표의 글자색 · 흰 글자가 모자란 지금(유안타 · 대신 · NH농협)](../../site/components/specs/logo-tile.tsx#contrast-guide)

### 투명 윤곽으로 둘레를 잡는다

짙은 남색 타일(케이뱅크 · 삼성증권 · BoA …)은 다크 표면과 1.5:1 아래, 노랑 타일은 흰 표면과 1.3:1 아래라 타일이 사라지고 글자만 뜬다. 투명 윤곽(`stroke-neutral-overlay`)이 둘레를 잡는다 — 타일 색을 바꾸지 않는다.

[그림: 다크의 짙은 남색 · 흰 바탕의 노랑 — 윤곽 있음 · 없음](../../site/components/specs/logo-tile.tsx#stroke-guide)

### 같은 기관은 같은 색

같은 회사는 어느 화면 · 어느 플랫폼에서나 한 색이다 — 기관 색은 표 하나에서, 이름 색은 Avatar 와 같은 함수에서만 온다. 자산을 만들 때 저장해 둔 색(`asset.color`)이 아니라 표에서 찾는다 — 저장된 값은 표와 다를 수 있다(하나카드 #008C74). 화면 · 플랫폼마다 해시 · 색 표를 따로 두지 않는다.

[그림: 같은 자산이 웹 · 앱에서 같은 색 · 웹 #9a6500 · 앱 #423fa6 로 갈린 지금](../../site/components/specs/logo-tile.tsx#color-guide)

### 이름 옆이면 장식, 혼자면 이름

타일 옆에는 대개 이름이 있다 — 그때 타일은 장식이라 보조 기술에 숨긴다(첫 글자 "신" 도, 그림도 읽지 않는다 — "신 신한 주거래" 가 아니다). 이름 없이 타일만 있으면 타일이 이름을 가진다 — 그림이 있어도 없어도 같은 이름이다.

[그림: 이름 옆 타일은 숨김 · 혼자인 타일은 이름](../../site/components/specs/logo-tile.tsx#name-guide)

### 이번에 정하지 않은 것

- 종목 타일(나라 색 · 한글 한 글자 · 심볼 두 글자)은 증권 화면 차례에 정한다.
- 가맹점 · 구독 로고는 그림 출처가 없다 — 지금처럼 카테고리 타일이다.

## 코드

레시피 `recipes/shadcn/components/ui/logo-tile.tsx` 를 쓴다 — `LogoTile`. 기관 색은 `recipes/shadcn/lib/institution-colors.ts`(`institution-colors.yaml` 에서 만든 표와 `institutionColor(name)` — 같은 이름 · 별칭, 아니면 든 가장 긴 이름, 없으면 `null`)이고, 첫 글자 · 이름 색은 Avatar 의 `avatarInitial(name)` · `avatarHue(name)` 을 그대로 쓴다. `LogoTile` 은 `name`(필수 — 기관 이름, 없으면 자산 이름) · `face`(`"institution"` 기본 — 기관 색 표에서 찾고 없으면 이름 색 · `"name"` — 표를 보지 않고 이름 색, 기관이 없는 자산 · 기관이 아닌 회사) · `size`(`32` · `40` 기본 · `48`) · `src`(그림 — 없으면 첫 글자만) · `imageType`(`"card"` · `"logo"` 기본 — 그림의 종류) · `decorative`(기본 `true` — 옆에 이름이 있을 때. `false` 면 `role="img"` + 이름)를 받는다. 앱은 같은 표 · 규칙 함수를 Dart 로 두고 아래 예시 이름으로 같은 답이 나오는지 시험한다. 아래 미리보기는 스펙 값으로 그린 모습이다.

| 이름 | 찾은 기관 · 면 | 글자 |
|---|---|---|
| 신한 | 신한 · #0046FF | "신" 흰 글자 6.33 |
| NH농협카드 올원 | NH농협카드 · #00A651 | "N" 짙은 글자 5.14 · 다크 4.54 |
| IBK기업은행 | IBK기업(든 가장 긴 이름) · #004098 | "I" 흰 글자 9.60 |
| 비상금(`face="name"` — 기관 없음) | 표를 보지 않는다 → 이름 색 indigo(코드 포인트 합 % 10 = 5) | "비" `fg-neutral-inverted` |

### 자산 줄 — 40

[그림: 자산 목록 — 은행 · 증권 · 코인 · 비상금](../../site/components/specs/logo-tile.tsx#ex-asset-row)

```tsx
import { ListButtonItem } from "@/components/ui/list"
import { LogoTile } from "@/components/ui/logo-tile"

{/* 이름은 기관 이름, 없으면 자산 이름(그때는 표를 보지 않는다) — 옆에 이름이 있어 타일은 장식(decorative 기본) */}
<ListButtonItem
  prefix={<LogoTile name={asset.institution ?? asset.assetName} face={asset.institution ? "institution" : "name"} />}
  title={asset.assetName}
  detail={[asset.institution, asset.typeLabel].filter(Boolean).join(" · ")}
  suffix={formatWon(asset.balance)}
  onClick={() => openAsset(asset.id)}
/>
```

### 카드 자산 — 카드 그림

[그림: 카드 자산 줄 — 첫 글자 "삼" 먼저, 그림이 오면 카드 전체](../../site/components/specs/logo-tile.tsx#ex-card)

```tsx
<LogoTile name={asset.cardCatalog.companyName} src={asset.cardCatalog.imgUrl} imageType="card" />
```

### 상세 머리 — 48

[그림: 자산 상세 머리 — 48 타일 · 자산 이름 · 기관](../../site/components/specs/logo-tile.tsx#ex-detail)

```tsx
<LogoTile size={48} name={asset.institution ?? asset.assetName} face={asset.institution ? "institution" : "name"} />
```

### 회사 로고 — 32 · 흰 판

[그림: HR 회사별 인원 — 회사 로고 32, 로고가 없는 회사는 첫 글자](../../site/components/specs/logo-tile.tsx#ex-company)

```tsx
{/* 회사는 기관이 아니다 — 표를 보지 않고, 로고 그림이 없거나 못 불러오면 회사 이름의 첫 글자 · 이름 색 */}
<span className="flex items-center gap-x2">
  <LogoTile size={32} name={company.name} face="name" src={company.logoUrl} imageType="logo" />
  <h3>{company.name}</h3>
</span>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 처음 그릴 때 | 첫 글자 타일 — 이름을 아니까 바로 그린다 |
| 그림이 옴 | 판과 그림이 첫 글자를 덮는다(전환 없이 바로 — Avatar 와 같다) |
| 그림을 못 불러옴 · 그림 없음 | 첫 글자 그대로 — 깨진 그림 · 빈 칸이 보이지 않는다 |
| 이름이 바뀜 | 기관 색 · 글자색 · 첫 글자가 규칙대로 바로 바뀐다 |
| 누르기 | 타일 자체는 누르지 않는다 — 감싼 줄 · 버튼의 동작 |
| 막힌 줄 | 그대로 — 줄의 글이 비활성 색 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 기관 색 면의 첫 글자 — 표의 글자색으로 78곳 모두 4.52 이상(짙은 글자는 다크 #242938 로 잰 값) ✓. 이름 색 면 `fg-neutral-inverted` — 라이트 4.55 ~ 5.50 · 다크 6.07 ~ 7.70 ✓(Avatar) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 타일 둘레 · 윤곽은 장식 — 타일 옆 이름 글이 물건을 알린다. 윤곽은 다크의 짙은 남색 타일 둘레를 1.14(윤곽 : 타일)로, 흰 바탕의 노랑 타일 둘레를 1.11 로 잡는다 |
| **WCAG 1.4.1** Use of color | 기관 색은 거드는 것이다 — 기관 이름이 줄의 글에 있다 |
| **WCAG 1.1.1** Non-text Content | 이름 옆 타일은 장식(`aria-hidden` — 첫 글자도, 그림 `alt=""` 도) — 이름을 한 번만 읽는다. 혼자인 타일은 `role="img"` + 이름(`aria-label="신한"`), 그림이 있어도 실패해도 같은 이름 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 누르지 않는다(감싼 줄의 규칙) |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 누르지 않는다 |
| **ARIA** | 장식이면 타일 전체 `aria-hidden`. 혼자면 `role="img"` + `aria-label` 하나 — 안의 첫 글자 · 그림은 읽지 않는다. 앱은 `Semantics(label: 이름, image: true)` · 장식이면 `ExcludeSemantics` |

## Do / Don't

### ✅ Do

- 은행 · 증권 · 카드 · 코인 · 금 · 회사는 각진 타일로.
- 크기는 32 · 40 · 48, 모서리는 크기 × 0.3.
- 기관 색은 표에서, 글자색은 표의 `text` 로.
- 첫 글자 먼저 그리고 그림이 오면 덮기.
- 이름 옆 타일은 장식으로 숨긴다.

### ❌ Don't

- 물건을 원 아바타로, 사람을 각진 타일로.
- 흰 글자를 모든 기관 색에 — 유안타 · 대신 · NH 는 4.5:1 에 못 미친다.
- 화면 · 플랫폼마다 다른 색 표 · 다른 해시.
- 그림을 정사각에 잘라 넣기(카드의 63% 만 보인다) · 불러오는 동안 빈 칸.
- 첫 글자 두 자 · 로마자 소문자, 첫 글자를 읽게 두기("신 신한").

## Specification

`logo-tile.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Logo Tile 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 기관 색 78곳은 `institution-colors.yaml` 이다.

[그림: Specification — logo-tile.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#logo-tile)

## SEED 와 다른 점

- **groo 에만 있는 부품이다** — SEED 는 가게 · 업체를 원 Avatar(Identity Placeholder `business`)로 그리고, 물건은 사진(Image Frame)뿐이며 로고 · 브랜드 마크 · 색 바탕 아이콘 타일의 규칙이 없다. 가장 가까운 SEED 값은 첨부 파일 썸네일(48 · 모서리 8 · 옅은 면 · 아이콘 24)이다.
- **사람만 원, 물건은 각진 타일** — groo 결정(2026-10-03). 모양 · 크기는 List 타일(groo), 첫 글자 · 이름 색은 Avatar(groo), 윤곽만 SEED(Image Frame 의 stroke.neutral-subtle)다.
- **로고 그림은 잘리지 않게 흰 판 위** — SEED 의 그림은 모두 cover 라 로고를 맞추는 규칙이 없다.

## Migration notes

### 2026-10-08 — 기관 고르기도 로고 타일 줄

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj) 13A 로 정했다 — 계좌 · 투자 추가의 은행 · 증권사 고르기는 위 검색 + 분류 머리(List Header) + 로고 타일 40 줄 + 오른쪽 라디오다([Searchable List](searchable-list.md)). 지금 Desk 웹의 분류별 칩 34개(고르면 기관 색 채움 — `widgets/asset-full/ui/AssetEditDialog.tsx:1119-1245`)를 걷는다 — 기관 색은 칩 채움이 아니라 타일이 보인다.

### 2026-10-04 — 새로 둔다(물건 로고 타일)

사용자가 [이미지 비교 페이지](https://claude.ai/artifact/G351nuKcYX2xhorvA5UD6X)에서 정했다 — 브랜드 채움 + 대비 고침(5A — 기관 색 면, 흰 글자가 4.5:1 에 못 미치면 짙은 글자, 투명 윤곽, 모서리 × 0.3 · 크기는 List 타일, 첫 글자 · 이름 색은 Avatar 규칙), 그림이 늦으면 첫 글자 먼저(6B), 색 표는 하나(자산 70 + 카드사 — `institution-colors.yaml`), HR 회사 로고도 이 타일(흰 판 + 윤곽, 모르는 회사는 첫 글자). 옅은 바탕 타일 · 진짜 로고 그림 · 그림이 늦을 때의 스켈레톤은 고르지 않았다.

| 지금 | 새 |
|---|---|
| 모서리 12 고정(32 에서 37.5%) · 웹 관리 줄 11 · 앱 계좌 추가 미리보기 8 | 크기 × 0.3 — 10 · 12 · 14 |
| 크기 32 · 36 · 40 · 48 · 52 | 32 · 40 · 48 |
| 글자 웹 12 / 14 / 16 · 800, 앱 12 / 13 / 16 · 700 | 크기의 40%(13 · 16 · 19) · 700 |
| 첫 글자 웹 `charAt(0)` · 앱 글자 단위, 로마자 그대로 | 글자 단위 첫 글자 · 로마자 대문자(Avatar) |
| 흰 글자(노랑 일곱 곳만 #191919) | 표의 글자색 — 흰 글자가 4.5:1 에 못 미치면 짙은 글자(18곳) |
| 기관 없는 자산: 웹 `oklch(.55 .12 해시)` · 앱 `HSL(해시, .45, .45)` | Avatar 의 이름 색(차트 10색) + `fg-neutral-inverted` |
| 카드 그림: 정사각 cover(63%) · 불러오는 동안 빈 칸 | 옅은 판 위 카드 전체(세로는 돌림) · 첫 글자 먼저 |

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹 `AssetLogo`**(`entities/asset/ui/asset-logo.tsx:23-87`) — 모서리 `var(--radius-tile)` 12 고정(`:44 · 66`), 글자 800, 첫 글자 `charAt(0)`(`:53`), 카드 그림은 정사각 cover 에 불러오는 동안 투명 빈 칸(`:35-50`), 모노그램 글자를 읽고 그림이 뜨면 침묵한다(`:39 · 84`). 해시는 `oklch(.55 .12 h)`(`:5-10 · 56-60`). 색 우선순위가 저장된 `asset.color` → 표 → 해시라 만들 때 저장한 옛 색이 남는다 — 표에서 찾는다(저장된 값은 그대로 두고 읽지 않는다 — 옛 앱은 계속 저장된 값을 그리고, 강제 업데이트는 필요 없다).
- **Desk 앱 `AssetLogo`**(`features/asset/presentation/widgets/asset_logo.dart:17-72`) — `ClipRRect(12)` 고정(`:28 · 59`) · 700 · 13, 그림은 `loadingBuilder` 없이 빈 칸(`:27-36`), 해시 `HSL(hash & 0xFF, .45, .45)`(`shared/brand/bank_colors.dart:553-560`)는 색상의 절반이 흰 글자 4.5 미만(최저 2.58)이다. 같은 자산이 웹 · 앱에서 다른 색이다("비상금" 웹 #9a6500 · 앱 #423fa6).
- **흰 글자 미달 열 곳** — 유안타 2.54 · 대신 2.59 · 한화투자 2.63 · 빗썸 2.65 · 제주 2.89 · NH농협 · NH투자 3.19 · 코인원 3.33 · SC제일 3.68 · 키움 3.96(`shared/lib/groo/bank-colors.ts:52-555` — 앱 표도 같다). 표의 글자색으로(SC제일 · 키움 · 코인원 · 기타 금은방 · 롯데카드는 색을 조금 고쳤다 — ΔE 0.9 ~ 3.8).
- **다크에서 묻히는 짙은 남색 15곳**(BoA 1.02 · 현대차증권 1.05 · 케이뱅크 1.12 …)과 흰 바탕의 노랑(카카오뱅크 · 카카오페이증권 1.28) — 투명 윤곽으로.
- **크기 · 모서리가 자리마다** — 웹 계좌 관리 줄 36 · 11(`widgets/asset-full/ui/AccountManager.tsx:368-375`), 앱 계좌 · 투자 추가 미리보기 52 · 8(`features/asset/presentation/account_add_dialog.dart:633-689` · `investment_add_dialog.dart:1182-1240`), 웹 같은 자리는 52 · 12. 줄은 40, 상세 머리는 48, 미리보기는 48 로.
- **카드 추가 · 편집의 카탈로그 목록 썸네일** — 44 × 28 의 카드 그림(웹 `AssetEditDialog.tsx:1042-1060` · 앱 `card_add_dialog.dart:1030-1060`)은 Image Frame 카드 그림이다. 표에 없는 회사(BC 등)를 웹은 `--color-chart-brown` 갈색으로, 앱은 `borderDefault` 로 칠한다 — 카드 면 규칙(모르면 대체 그림)으로.
- **HR 회사 로고**(`features/admin-users-management/ui/UserCompanyStatsItem.tsx:17-61` ← `UserCompanyCard.tsx:17` · `features/dashboard/ui/widgets/UserCompanyStatsWidget.tsx:26`) — 번들 SVG 6개를 32 · 바탕 · 테두리 없이 그려 다크 카드(#202020)에서 로고의 검은 부분이 사라지고, 표에 없는 회사는 깨진 그림 아이콘 + "새회사 logo" 글이 32 칸을 넘친다. `alt` "{회사} logo" 가 바로 위 제목과 겹쳐 두 번 읽힌다(`:22-24`). Logo Tile 32 · `logo`(흰 판 + 윤곽) · 회사는 기관이 아니라 `face="name"`(로고가 없으면 회사 이름의 첫 글자 · 이름 색) · 이름 옆이라 장식으로.
- **물건이 아닌 타일은 List 의 타일** — 카테고리 · 이체 · 알림 종류의 타일 세부(아이콘 20 · 없는 아이콘 · 이체 회색)는 [List](list.md) 의 Migration notes 에 있다.
