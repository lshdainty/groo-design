# Card

> 회색 바닥 위에 놓는 흰 면 하나 — 한 가지 내용(오늘 쓴 돈 · 예산 · 차트 · 표 · 지표)을 묶어 화면을 나눈다. 폰과 데스크톱, 라이트와 다크가 같은 규칙이다. 줄을 늘어놓는 것은 카드 안의 [List](list.md), 줄과 열을 견주는 것은 카드 안의 [Table](table.md), 고르는 상자는 [Select Box](select-box.md) 다.

SEED 에는 카드 컴포넌트가 없다. 그래도 SEED 가 그린 카드는 모두 같다 — 바닥(`bg.layer-basement`) 위 흰 면(`bg.layer-default`)에 1px `stroke.neutral-weak` 테두리, 그림자는 없다(React List 카드 예제 · 디자인 문서 그림 · 대시보드의 요약 타일과 차트 카드). SEED Elevation 은 카드를 "Level 1 layer-default — Card, List, TextField처럼 페이지를 구성하는 개별 콘텐츠 블록" 에 두고, 그림자는 "화면 전체에서 주목도가 높은 몇 안 되는 요소" 에만 쓴다(당근 SEED, Apache-2.0). 카드 사이 8 은 Divider 문서의 "Basement 레이어 위에 Default 레이어를 올려 8px Gap", 누름은 Feedback 의 규칙이다. 카드 머리 · 여백 · 지표 카드 · 순자산 카드 · 증감 표기는 SEED 에 없어 porest 가 정했다(2026-10-08 사용자 결정). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Card 스펙(그림자 기본 · 변형 넷 · 모서리 12)을 대신한다.

수치 원본은 [`card.yaml`](card.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: Desk 홈 — 순자산 · 지표 둘 · 오늘 쓴 돈(데스크톱 · 폰) — 라이트 · 다크](../../site/components/specs/card.tsx#hero)

### 직접 골라 보기

내용(글 · 목록 · 지표 · 순자산) · 누름 · 폭(폰 · 데스크톱) · 증감 방향을 고르면 스펙대로 그린 카드와 그 코드가 바뀐다. 누르는 카드를 고르면 실제로 눌러 볼 수 있다.

[그림: 플레이그라운드](../../site/components/specs/card.tsx#playground)

## Anatomy

[그림: 카드는 면 · 머리(제목 + 전체 보기) · 본문으로 이뤄지고, 목록을 담으면 줄이 가장자리까지 간다](../../site/components/specs/card.tsx#anatomy)

| ⓐ Root | 카드 면 — 바닥 위 흰 면 + 1px 테두리, 모서리 16, 그림자 없음. |
| ⓑ Header | 머리 — 제목과 오른쪽 동작 한 줄. 없어도 된다. |
| ⓒ Title | 제목 — 16 / 22 · 700. 무엇의 카드인지. |
| ⓓ Header Action | 머리 동작 — "전체 보기" 14 · 500 + chevron 16, 누르는 영역 44. |
| ⓔ Content | 본문 — 글 · 숫자 · 차트 · 표. 카드 여백 안. |
| ⓕ List | 카드 안 목록 — [List](list.md) 줄이 가장자리까지, 누름 바탕 모서리 10. |

[표: 부위](card.yaml#slots)

## Properties

### 면 — 바닥 위 흰 면 + 테두리

카드는 바닥(`bg-layer-basement`) 위 흰 면(`bg-layer-default`)에 1px `stroke-neutral-weak` 테두리다. 그림자는 없다 — 면과 바닥이 라이트 1.08 · 다크 1.13 으로 거의 같아 선이 경계를 맡는다. 데스크톱 · 폰 · 라이트 · 다크가 같은 규칙이고, 폰도 바닥이 회색이다 — 흰 바탕 위에 카드를 두거나, 흰 바탕에 평면 묶음 · 흰 위 흰 그림자 카드(raised)를 두지 않는다(사용자 결정).

[그림: 바닥 위 테두리 카드 — 데스크톱 · 폰 · 다크](../../site/components/specs/card.tsx#surface)

[표: 면](card.yaml#base.enabled@root)

### 모서리 · 사이

모서리는 16 이다 — 카드 안 목록의 동심 모서리(16 − 6 = 10)와 [Skeleton](skeleton.md) 의 카드 면 16 이 이 값을 전제한다. 위아래로 쌓은 카드 사이는 8(SEED "8px Gap"), 데스크톱 격자에서 나란한 칸 사이는 `layout-gutter` 24 다(v101). 폰의 카드 묶음은 화면 가장자리 24(`spacing-global-gutter` — v101) 안에 둔다 — 카드 안의 제목 · 숫자 · 목록 줄 글자는 모두 화면 끝에서 48(24 + 카드 안 24)에 한 줄로 선다.

[그림: 모서리 16 · 쌓은 카드 사이 8 · 데스크톱 격자 24](../../site/components/specs/card.tsx#radius-gap)

### 여백

카드 안 여백은 폭과 상관없이 24 다 — [List](list.md) 줄의 좌우 24, [Bottom Sheet](bottom-sheet.md) 의 머리 · 본문 24 와 같은 값이라 카드 · 줄 · 시트가 한 자리에 글자를 세운다(카드 24 = List 줄 24 = 시트 24, 사용자 결정 — 시트와 같게). SEED 도 같은 원칙이다 — 카드 · 줄 · 시트가 모두 16 이다. porest 는 화면 가장자리 규칙(2026-09-14 — 24)을 따라 모두 24 다.

목록을 담은 카드는 좌우 여백을 두지 않는다 — 줄이 제 좌우 24 · 위아래 12 를 가지므로 줄이 카드 가장자리까지 간다(시트 본문에 List 를 둘 때와 같다). 머리는 위 24 · 좌우 24 · 아래 4, 카드 아래 여백은 12 — 마지막 줄의 아래 12 와 합쳐 보이는 24 로 위와 같다. 옛 16 · 24(768 에서 바뀜)는 SEED 이전 card.md v4(2026-05 — 화면 끝이 20 이던 때)의 값이다.

[그림: 여백 24 — 글 카드 · 목록 카드 · 시트가 같은 24(폭과 상관없이), 목록 카드 아래 12 + 줄 12](../../site/components/specs/card.tsx#padding)

[표: 본문](card.yaml#body)

### 머리

머리는 제목 16 / 22 · 700 · `fg-neutral` 하나에 오른쪽 동작 하나다. 동작은 "전체 보기" 같은 글 버튼 — 14 · 500 · `fg-neutral-subtle` + chevron-right 16, 보이는 상자 32(누를 때 바탕 · 모서리 8)에 누르는 영역 44 다. 폰 · 데스크톱 · 웹 · 앱이 같은 머리다 — 작은 회색 머리 · 18 제목은 두지 않는다(사용자 결정). 머리 아래 본문까지 8, 목록 카드는 4(줄이 제 위 여백을 가진다).

[그림: 머리 — 제목 16 · 700 + 전체 보기(보이는 32 · 누르는 44)](../../site/components/specs/card.tsx#header)

[표: 머리](card.yaml#base.enabled@header)

[표: 제목](card.yaml#base.enabled@title)

[표: 머리 동작](card.yaml#base.enabled@headerAction)

### 누름

카드 전체가 한 곳으로 가면(`whole` — 자산 하나 · 예산 하나) 누르는 동안 면이 `bg-layer-default-pressed` 로 바뀌고 카드 전체가 2px 거리만큼 준다 — 마우스는 올릴 때 같은 색이다(SEED Feedback). 테두리 · 글자색은 그대로이고 그림자 · 위로 뜨기는 없다. 카드를 누르면 열리는데 안에 대등한 동작(좋아요 · 고정 · ⋮)이 더 있으면(`peers`) 면 색만 바뀌고 카드는 줄지 않는다 — 안의 버튼이 각자 제 누름을 가진다(SEED — "전체가 줄어들면 무엇이 눌린 것인지 모호해집니다"). 보기만 하는 카드(`none`)는 바뀌지 않는다. 순자산 카드(`hero`)를 누르면 2px 축소만 한다 — 브랜드 채움 그라디언트에는 누름 색 짝이 없다(SEED Feedback — 색은 `-pressed` 짝이 있는 표면에서만 바뀐다).

[그림: 누름 — 카드 전체(색 + 2px) · 대등한 동작이 있는 카드(색만)](../../site/components/specs/card.tsx#press)

[표: 누름](card.yaml#press)

### 카드 안 목록

목록을 담으면 [List](list.md) 줄을 카드에 바로 넣는다(`body="list"`). 누름 · 호버 바탕은 좌우 6 들어와 모서리 10 이다 — 카드 16 − 6(List 의 동심 모서리). 줄 사이 선은 기본으로 두지 않는다. 표도 같다 — 표는 첫 칸 앞 · 끝 칸 뒤 24 를 스스로 가지므로 `body="list"` 로 카드 가장자리까지 두고, 줄 선이 카드 끝까지 간다([Table](table.md)). 머리가 없는 목록 카드(768 미만 표를 바꾼 List 줄 등)는 위에도 12 를 두어 첫 줄의 12 와 합쳐 보이는 24 — 아래와 같다. 회색 바닥 위의 목록은 늘 카드에 담는다 — 누름 바탕이 바닥과 같은 밝기라 보이지 않는다(List 의 "목록을 두는 바탕").

[그림: 오늘 쓴 돈 — 머리 + List 줄, 가운데 줄을 누른 순간](../../site/components/specs/card.tsx#list-card)

[표: 카드 안 목록](card.yaml#base.enabled@list)

### 카드 안 아코디언

카드 상세의 혜택 · 유의사항처럼 상세를 접어 둔 목록은 [Accordion](accordion.md) `inline` 을 카드에 바로 넣는다(`body="accordion"` — 2026-10-10 사용자 결정 6A, 웹 · 앱 같다). 트리거가 제 좌우 24 · 위아래 16 을 가지므로 카드 좌우 여백은 0 이고, 머리는 목록 카드와 같다(위 24 · 좌우 24 · 아래 4). 카드 아래 여백은 8 — 마지막 트리거의 아래 16 과 합쳐 보이는 24 다. 머리 오른쪽 동작 자리에는 Accordion 의 "모두 펼치기" 를 둔다 — 건수는 제목에 붙인다("혜택 · 12건"). 누름 바탕은 목록 카드와 같은 동심 모서리 10 이다.

[그림: 혜택 · 12건 — 카드 머리 + 모두 펼치기, 트리거가 가장자리까지 · 카드 아래 8](../../site/components/specs/card.tsx#accordion-card)

### 지표 카드

숫자 하나를 보이는 카드다 — 라벨 13 · 500 · `fg-neutral-subtle`, 아래 4 에 큰 숫자 700 · 고정폭 숫자, 아래 4 에 증감 줄. 카드 하나에 숫자 하나면 24(`large`)다. 폰에서는 지표 카드를 한 줄에 하나 둔다 — 둘씩 놓으면 360 폭에서 칸 안쪽이 101(여백 16 이어도 117)인데 "1,240,000원" 20 / 700 은 120 이라 들어가지 않는다(실측). 데스크톱 격자에 셋 · 넷씩 나란히 놓을 때만 20(`small`)이고, 여백은 그대로 24 다. 돈은 줄이지 않고 원까지 쓴다. 숫자가 굴러가며 바뀌는 애니메이션은 두지 않는다 — 금액은 처음부터 그 값으로 보인다.

[그림: 지표 카드 — 폰은 한 줄에 하나(24) · 데스크톱 격자 넷(20), 여백은 모두 24](../../site/components/specs/card.tsx#stat)

[표: 지표 크기](card.yaml#stat)

[표: 라벨](card.yaml#base.enabled@statLabel)

[표: 숫자](card.yaml#base.enabled@statValue)

### 증감 표기

지난달 · 지난 기간에 견준 변화는 방향으로 칠한다 — 어디서나 오르면 ▲ `fg-critical`(빨강), 내리면 ▼ `fg-informative`(파랑)이다(증권과 같은 관례, 사용자 결정). 늘 ▲ · ▼ 와 값을 함께 쓰고, 그 뒤에 기준을 옅은 글로 둔다 — "▲ 12% 지난달보다". 부호는 화살표가 말한다 — "+12%" · "−12%" 를 화살표와 같이 쓰지 않는다. 좋은지 나쁜지는 색이 아니라 글이 말한다 — 지출이 늘었으면 "지난달보다 12% 더 썼어요". 변화가 없으면 화살표 없이 "변화 없음" 이다. 하나뿐인 예외는 짙은 브랜드 채움(순자산 카드) 위 — 흰 ▲ · ▼ + 글이다. 보조 기술에는 문장으로 읽힌다("지난달보다 12% 늘었어요" — 화살표는 숨긴다).

[그림: 증감 — ▲ 빨강 · ▼ 파랑 · 변화 없음, 지출 · 수입 · 순자산 · 주식이 같은 규칙](../../site/components/specs/card.tsx#delta)

[표: 증감](card.yaml#delta)

[표: 증감 값](card.yaml#base.enabled@delta)

[표: 증감 글](card.yaml#base.enabled@deltaText)

### 순자산 카드

Desk 홈 · 자산 맨 위의 순자산은 브랜드 색으로 채운 카드다(`hero`) — 135° 그라디언트, 흰 글자. 라이트는 `bg-brand-solid`(#0147AD) → brand-900(#002460 — 지금 제품의 #012B68 은 팔레트에 없어 가장 가까운 단계, ΔE00 2.4, 사용자 결정), 다크도 짙은 채움이다 — `bg-brand-solid`(#1049A4) → brand-300-dark(#1F3A69). 흰 글자는 두 모드 모두 그라디언트 어디서나 4.5 이상이다(사용자 결정 — 다크에서 밝은 그라디언트 위 흰 글자 2.38 ~ 2.84 를 고친다). 라벨 13 · 500, 금액 32 / 42 · 700(v100 — 지금 800), 아래 글 13. 모두 흰 글자이고 흐리게(불투명도) 두지 않는다. 증감도 흰 글자에 ▲ · ▼ + 글이다 — 빨강 · 파랑은 브랜드 채움 위 1.66 · 1.65 라 읽히지 않는다. 증감 방향 색의 하나뿐인 예외다(사용자 결정). 오른쪽 위 장식 빛(흰 22% → 투명)은 남긴다. 모서리 16 · 사이 · 여백 24 는 다른 카드와 같다(사용자 결정 — 지금 제품의 20 을 16 으로). 한 화면에 하나만 둔다.

[그림: 순자산 — 라이트 #0147AD → #002460 · 다크 #1049A4 → #1F3A69, 흰 글자](../../site/components/specs/card.tsx#hero-card)

[표: 순자산 카드](card.yaml#grid.variant)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 흰 면 + 테두리 |
| `hovered` | 웹 · 누르는 카드 — 면 `bg-layer-default-pressed`(누름과 같은 색 — v106). 머리 동작은 제 상자에 같은 바탕 |
| `pressed` | 같은 면 + 카드 전체 2px 거리 축소(`whole`) · 축소 없음(`peers`). 머리 동작은 제 상자만 |
| `focused` | 웹 — 키보드 포커스에만 카드 · 머리 동작 바깥 2px 링(띄움 2) |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스](../../site/components/specs/card.tsx#states)

[표: 상태 — 카드 전체](card.yaml#matrix.press.whole@root)

[표: 상태 — 대등한 동작이 있는 카드](card.yaml#matrix.press.peers@root)

[표: 상태 — 머리 동작](card.yaml#matrix@headerAction)

[표: 모션](card.yaml#motion)

## Guidelines

### 회색 바닥 위에만

카드는 `bg-layer-basement` 바닥 위에 둔다. 흰 바탕(시트 · 대화상자 · 흰 화면) 위에서는 카드로 묶지 않는다 — 면이 바탕과 같아 테두리만 남는다. 시트 · 대화상자 안의 요약은 [List](list.md) 의 키-값 줄이나 [Callout](callout.md) 이다.

[그림: 바닥 위 카드 · 흰 바탕 위 카드](../../site/components/specs/card.tsx#floor-guide)

### 그림자를 두지 않는다

카드의 경계는 테두리다 — 그림자 카드 · 흰 위 흰 그림자 카드(raised) · 마우스를 올리면 그림자가 커지는 카드를 두지 않는다. 그림자는 떠 있는 몇 안 되는 요소(떠 있는 탭 바 · 떠 있는 버튼 · 메뉴 · 팝오버)에만 쓴다(Elevation).

[그림: 테두리 카드 · 그림자 카드 · raised](../../site/components/specs/card.tsx#shadow-guide)

### 카드 안에 카드를 두지 않는다

카드 안을 나누려면 머리 · 간격 · [Divider](divider.md) 로 나눈다 — 카드 안에 테두리 상자를 또 두면 어느 것이 한 덩어리인지 흐려진다. 지표 여럿은 카드 하나에 넣지 않고 지표 카드를 따로 둔다 — 폰은 한 줄에 하나, 데스크톱은 격자로.

[그림: 카드 안 카드 · 지표 카드를 따로(폰은 한 줄에 하나)](../../site/components/specs/card.tsx#nest-guide)

### 머리 동작은 하나, 누르는 영역 44

머리 오른쪽 동작은 하나다("전체 보기" · "관리"). 글 버튼은 보이는 상자가 32 라도 누르는 영역이 44 다 — 글자 높이(18.6)짜리 링크로 두지 않는다. 이름은 "{제목} 전체 보기" 처럼 무엇의 동작인지 넣는다.

[그림: 머리 동작 — 누르는 영역 44 · 글자만큼인 링크](../../site/components/specs/card.tsx#header-guide)

### 증감은 방향 색 + ▲ · ▼ + 글

증감 색은 방향이다 — 지출이 늘어도 ▲ 빨강, 수입이 줄어도 ▼ 파랑이다. 같은 화면의 주식(▲ 빨강 = 올랐다)과 뜻이 엇갈리지 않는다. 좋고 나쁨은 글이 말하고, 색만으로 알리지 않는다(▲ · ▼ 와 값이 늘 함께). 증감 값에 "+-12.5%" 처럼 부호를 겹쳐 쓰지 않는다.

[그림: 방향 색 · 좋고 나쁨 색(지출 ▲ 빨강 · 순자산 ▲ 초록)](../../site/components/specs/card.tsx#delta-guide)

### 기다리는 동안 · 실패

카드 면 · 머리 · 라벨은 처음부터 그리고, 서버에서 올 숫자 · 줄 자리만 [Skeleton](skeleton.md) 이다. 카드 하나가 통째로 기다리면 카드 면 모양 스켈레톤(모서리 16)이다. 카드의 데이터를 못 불러오면 그 카드 안에 [Result Section](result-section.md) `medium` + "다시 시도" 를 둔다 — 다른 카드는 그대로 보인다. 카드 안의 Result Section 은 좌우 여백이 0 이다 — 카드 24 만 둔다(사용자 결정 23B). 목록 카드(`body="list"`)는 줄마다 24 를 갖고 카드 여백이 없으니, 목록을 못 불러와 Result Section 을 카드에 바로 두면 Result Section 이 좌우 24 를 갖는다 — 어느 카드에서나 글이 24 에 선다. 제 여백 48 을 그대로 두면 72 가 되어 좁은 카드에서 제목이 두 줄로 넘어간다. 데이터 하나가 실패했다고 화면 전체를 스켈레톤으로 되돌리지 않는다(같은 요청을 끝없이 다시 보내게 된다).

[그림: 카드마다 기다림 · 실패 — 순자산 실패 + 다시 시도, 나머지는 보임](../../site/components/specs/card.tsx#status-guide)

### 글

제목은 짧은 명사구("오늘 쓴 돈" · "이번 달 예산"). 머리 동작은 "전체 보기" · "관리" 처럼 동사구로 짧게. 지표 라벨은 무엇의 숫자인지("이번 달 지출"), 증감 글은 기준("지난달보다")이다.

## 코드

레시피 `recipes/shadcn/components/ui/card.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Card` — 카드 면. `variant`(`"default"` 기본 · `"hero"`) · `body`(`"content"` 기본 · `"list"` — 좌우 여백 0, 머리 24 · `"accordion"` — 좌우 0, 아래 8, 머리 24) · `press`(`"none"` 기본 · `"whole"` · `"peers"`) · `onClick` · `href`(주면 `press` 를 `"whole"` 로 본다 — 카드 전체가 버튼 · 링크). `"peers"` 는 카드를 누르는 자리를 카드 위에 깐 링크(`CardLink`)로 만들고, 안의 버튼은 그 위에 놓는다 — 버튼을 눌러도 카드가 열리지 않는다. 여백은 폭과 상관없이 24 다.
- `CardHeader` — 머리. `CardTitle`(`as` — 기본 `h2`) · `CardAction`(머리 동작 — `href` · `onClick`, 자식 글 뒤에 chevron 을 붙인다 · `aria-label` 기본 "{제목} {글}").
- `CardContent` — 본문(여백 안). 목록 카드는 `CardContent` 없이 `List` 를 바로 넣는다. 머리 설명(`CardDescription`) · 아래 버튼 줄(`CardFooter`)은 두지 않는다 — 머리는 제목 하나, 버튼은 본문 끝에 둔다.
- `CardLink` — `peers` 카드의 누르는 자리(카드 전체를 덮는 링크 · 버튼, 이름은 카드 제목).
- `CardStat` — 지표. `label` · `value`(글 — 쓰는 쪽이 원까지 만든다) · `size`(`"large"` 기본 · `"small"`) · `delta`.
- `Delta` — 증감 줄. `direction`(`"up"` · `"down"` · `"flat"`) · `value`("12%") · `text`("지난달보다") · `srText`(보조 기술 문장 — 기본 "{text} {value} 늘었어요 · 줄었어요", `flat` 은 "{text} 변화가 없어요", 화살표는 숨긴다). `flat` 은 화살표도 기준 글도 없이 "변화 없음" 만 보인다 — "변화 없음 지난달보다" 가 되지 않게 기준 글은 숨긴 문장에만 들어간다. `value` 앞의 부호(+ · − · ±)는 떼고 보인다 — 방향은 화살표가 말한다("+-12.5%" 가 아니라 "▼ 12.5%"). 표 · 차트의 증감 칸도 이것을 쓴다.
- `CardHeroLabel` · `CardHeroAmount` · `CardHeroDetail` — `variant="hero"` 의 흰 글자 셋. 장식 빛은 카드가 그린다.

### 목록 카드 — 오늘 쓴 돈

[그림: 오늘 쓴 돈 — 머리 + List 줄 셋](../../site/components/specs/card.tsx#ex-list)

```tsx
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { List } from "@/components/ui/list"

<Card body="list">
  <CardHeader>
    <CardTitle>오늘 쓴 돈</CardTitle>
    <CardAction href="/desk/ledger">전체 보기</CardAction>
  </CardHeader>
  {/* 줄은 List 그대로 — 누름 바탕 모서리 10(동심 모서리)은 List 의 기본값 */}
  <List aria-label="오늘 쓴 돈">{today.map(renderExpenseRow)}</List>
</Card>
```

### 지표 카드 — 폰은 한 줄에 하나

[그림: 폰 — 지표 카드가 한 줄에 하나(이번 달 지출 ▲ · 이번 달 수입 ▼), 데스크톱은 둘씩](../../site/components/specs/card.tsx#ex-stat)

```tsx
import { Card, CardStat } from "@/components/ui/card"

{/* 폰은 한 줄에 하나(쌓은 카드 사이 8), 768 이상은 둘씩(격자 24) — 숫자 24. 1280 이상에서 넷씩 두면 size="small"(20) */}
<div className="grid gap-2 md:grid-cols-2 md:gap-6">
  <Card>
    <CardStat label="이번 달 지출" value="1,240,000원"
      delta={{ direction: "up", value: "12%", text: "지난달보다", srText: "지난달보다 12% 더 썼어요" }} />
  </Card>
  <Card>
    <CardStat label="이번 달 수입" value="4,200,000원"
      delta={{ direction: "down", value: "3%", text: "지난달보다" }} />
  </Card>
</div>
```

### 누르는 카드

[그림: 예산 카드 — 카드 전체가 예산 상세로 · 고정 버튼이 있는 메모 카드](../../site/components/specs/card.tsx#ex-press)

```tsx
import { Pin } from "lucide-react"
import { Card, CardContent, CardLink } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"

{/* 한 곳으로 — 색 + 2px 축소 */}
<Card href={`/desk/budget/${budget.id}`}>
  <CardContent>…</CardContent>
</Card>

{/* 카드를 누르면 열리고 고정 버튼이 따로 — 색만, 축소 없음 */}
<Card press="peers">
  {/* 고정 버튼은 제목 줄 오른쪽 — 켜고 끄는 아이콘 단추(Toggle). 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다 */}
  <div className="flex items-start justify-between gap-x2">
    <CardLink href={`/desk/memo/${memo.id}`}>{memo.title}</CardLink>
    <Toggle className="-mr-x2 -mt-x2 shrink-0" aria-label={`${memo.title} 고정`} pressed={memo.pinned} onPressedChange={(pinned) => setPinned(memo.id, pinned)} icon={<Pin />} />
  </div>
  <CardContent>…</CardContent>
</Card>
```

### 순자산 카드

[그림: 순자산 — 라이트 · 다크](../../site/components/specs/card.tsx#ex-hero)

```tsx
import { Card, CardHeroAmount, CardHeroDetail, CardHeroLabel, Delta } from "@/components/ui/card"

<Card variant="hero">
  <CardHeroLabel>순자산</CardHeroLabel>
  <CardHeroAmount>42,898,100원</CardHeroAmount>
  {/* 히어로 위 증감은 흰 글자 — Delta 가 hero 안에서 색을 흰색으로 바꾼다 */}
  <CardHeroDetail><Delta direction="up" value="1.8%" text="지난달보다" /></CardHeroDetail>
</Card>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 카드 누르기(`whole`) | 그 한 곳으로 — 누르는 동안 면 색 + 2px 축소. 마우스는 올릴 때 같은 색 |
| 카드 누르기(`peers`) | 카드의 링크로 — 면 색만. 안의 버튼을 누르면 그 버튼만 반응하고 카드는 열리지 않는다 |
| 머리 동작 누르기 | 그 목록 · 화면으로 — 상자 바탕 + 글자 2px 축소 |
| `Tab` | 누르는 카드(`whole`) 하나 → 다음 카드. `peers` 는 카드 링크 → 안의 버튼 차례. 보기만 하는 카드는 건너뛰고 안의 버튼 · 줄로 |
| `Enter` · `Space` | 누르는 카드는 누르기와 같다(링크는 `Enter`) |
| 모션 줄이기 | 축소하지 않는다 — 색만 바뀐다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 숫자 `fg-neutral` 카드 면 위 16.41 · 다크 13.42, 누름 면 위 15.48 · 10.32 ✓. 라벨 · 머리 동작 · 증감 글 `fg-neutral-subtle` 5.50 · 6.09(누름 바탕 위 5.18 · 4.68) ✓. 증감 ▲ `fg-critical` 5.06 · 다크 6.08, ▼ `fg-informative` 5.09 · 6.12 ✓. 순자산 흰 글자 — 라이트 8.38(#0147AD) ~ 14.78(#002460) · 다크 8.36(#1049A4) ~ 11.25(#1F3A69), 장식 빛 위 가장 낮은 자리 4.88 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 카드 테두리(바닥 위 1.14 · 다크 1.76)는 장식 — 카드는 제목 · 내용으로 읽힌다. 누르는 카드는 이름(제목)으로 알 수 있다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
| **WCAG 1.4.1** Use of color | 증감은 ▲ · ▼ 모양과 값 · 글이 함께 — 색만으로 알리지 않는다 ✓ |
| **WCAG 1.3.1** Info and relationships | 카드 제목은 제목 태그(`h2` 기본 — 화면 제목 아래 단계) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 머리 동작 44 · 누르는 카드 전체 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 머리 동작 44 × 44 이상 ✓ · 누르는 카드는 카드 전체 ✓ |
| **ARIA** | 보기만 하는 카드는 역할이 없다(`div` · 묶음은 제목으로). 누르는 카드는 `<a>` · `<button>` 하나 — 카드 안 버튼과 겹쳐 두지 않는다(`peers` 는 카드 링크 + 버튼이 형제). 머리 동작 이름 "{제목} 전체 보기". 증감의 ▲ · ▼ 는 `aria-hidden`, 문장은 숨긴 글 |

## Do / Don't

### ✅ Do

- 회색 바닥 위 흰 면 + 1px `stroke-neutral-weak`, 모서리 16, 그림자 없음 — 폰도 같다.
- 쌓은 카드 사이 8, 데스크톱 격자 칸 사이 24.
- 머리는 제목 16 · 700 + 동작 하나(누르는 영역 44).
- 카드 안 여백 24 — 폭과 상관없이, List 줄 · 시트와 같다. 목록 카드는 List 줄을 가장자리까지, 머리 위 · 좌우 24 · 아래 12.
- 폰의 지표 카드는 한 줄에 하나.
- 증감은 ▲ 빨강 · ▼ 파랑 + 값 + 글, 어디서나.
- 순자산 카드는 다크도 짙은 채움 + 흰 글자.

### ❌ Don't

- 그림자 카드 · raised · 마우스를 올리면 뜨는 카드.
- 흰 바탕 위 카드 · 폰만 평면 묶음.
- 모서리 12 · 8 · 20(순자산 카드도 16), 카드 사이 12 · 20.
- 카드 여백 16(폰) · 카드 안 목록 줄 16 · 폰에서 지표 카드 둘씩.
- 작은 회색 머리 · 18 제목, 글자만큼인 "전체 보기" 링크.
- 좋고 나쁨으로 칠한 증감(지출 ▲ 빨강 · 순자산 ▲ 초록) · 색 없는 증감 · "+-12.5%".
- 숫자가 굴러가는 애니메이션, 돈을 "73.3만" 으로.
- 다크에서 밝은 그라디언트 위 흰 글자, 흐린(불투명도) 흰 글자.
- 카드 안 카드.

## Specification

`card.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Card 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — card.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#card)

## SEED 와 다른 점

- **porest 가 정한 자리가 많다** — SEED 에 카드 컴포넌트가 없어 여백 · 머리 · 지표 카드 · 순자산 카드 · 증감 표기는 porest 규칙이다. 면 · 테두리 · 바닥 · 카드 사이 8 · 누름은 SEED 를 따랐다.
- **모서리 16 하나** — SEED 는 문서 예 16 · React 예 14(r3_5)로 갈리고 카드 모서리 토큰이 없다. porest 는 List 동심 모서리 · Skeleton 카드 면과 같은 16 이다.
- **누름 색은 불투명한 `bg-layer-default-pressed`** — SEED 와 같은 자리(Feedback 의 `-pressed` 짝)이고 값은 porest(v102).
- **카드 머리는 제목 16 · 700** — SEED 의 카드 머리 예는 React List 카드의 ListHeader(14 · 500 · `fg.neutral-subtle`) 하나다(사용자 결정 — 작은 회색 머리는 고르지 않았다).
- **카드 안 여백 24** — SEED 는 카드 · 줄 · 시트가 모두 16 으로 같은 원칙이다. porest 는 화면 가장자리 규칙(2026-09-14 — 24)으로 카드 · 줄 · 시트가 모두 24 다. 목록 카드의 줄도 좌우 24(List — 24 보다 좁히지 않는다).
- **순자산 카드(브랜드 채움)** — SEED 에는 채운 카드 예가 없다.
- **증감 색** — SEED 에 증감 규칙이 없다. porest 는 방향 색(▲ 빨강 · ▼ 파랑)이다.

## Migration notes

### 2026-10-10 — 카드 안 아코디언

사용자가 [펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H)에서 카드 상세의 혜택 · 유의사항을 웹 · 앱 모두 접는 목록으로 정했다(6A — 둘 다 펼친 목록 6B 는 고르지 않았다). 그래서 본문에 `accordion` 을 더했다 — 좌우 0 · 아래 8 · 머리는 목록 카드와 같다. 지금 웹은 카드 상세 혜택을 `ul.divide-y` 의 Radix Collapsible 로 접고(`widgets/card-detail/ui/AvailableBenefitsList.tsx:49-94`), 앱은 혜택 상세 본문까지 다 펼쳐 보이며 유의사항만 주황 상자 안에서 접는다(`features/card/presentation/card_detail_screen.dart:153-236`, 조사 D15). 둘 다 이 카드 안 `inline` 아코디언으로 옮긴다.

### 2026-10-08 — SEED 면 · Feedback 으로 다시 쓴다

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)에서 정했다 — 면은 SEED(4A — 바닥 `bg-layer-basement` 위 `bg-layer-default` + 1px `stroke-neutral-weak`, 그림자 없음, 폰도 같은 규칙), 모서리 16 · 카드 사이 8(5A — 데스크톱 격자 칸 사이는 `layout-gutter`), 머리 16 / 22 · 700 + "전체 보기" 14 · 500 · chevron 16 · 누르는 영역 44(6B), 순자산 카드는 다크도 짙은 채움(7A — #1049A4 → #1F3A69 · 흰 글자 · 금액 700), 증감은 방향 색(8B — ▲ `fg-critical` · ▼ `fg-informative` · 늘 ▲▼ + 글). 그리고 "따라오는 것" — 누름은 SEED Feedback(`-pressed` 색 + 2px 축소, 대등한 동작이 여럿이면 축소하지 않음, 그림자 상승 걷음) · 변형 정리 · 지표 카드(라벨 13 · 500 · 큰 숫자 20 ~ 24 · 700 · 증감 줄, 굴림 애니메이션 없음). 그림자 카드 · raised(4B) · 흰 바닥 테두리 카드(4C) · 모서리 12(5B · 5C) · 작은 회색 머리(6A) · 18 머리(6C) · 다크 짙은 글자 히어로(7B) · 일반 카드 히어로(7C) · 좋고 나쁨 색(8A) · 색 없는 증감(8C)은 고르지 않았다. 옛 스펙은 `card.history/v-pre-seed-data.*` 에 남겼다.

**변형을 둘로 줄인다** — `default` · `hero`.

| 옛 변형 | 새 자리 | 왜 |
|---|---|---|
| `shadow`(기본 — 흰 면 + `shadow-sm`) | `default`(테두리) | 면과 바닥이 1.08 이라 아주 옅은 그림자 하나가 경계를 맡았다. 그림자는 다크에서 거의 안 보인다(Elevation) |
| `bordered`(1px `border-subtle`) | `default` | 테두리 카드가 기본이 됐다 — 테두리 색은 `stroke-neutral-weak`(카드 외곽 역할) |
| `muted`(`bg-muted` 채움) | 걷음 — 시트 · 대화상자 안 요약은 [List](list.md) 키-값 줄 · [Callout](callout.md) `neutral` | 바닥(`bg-layer-basement`)과 같은 색이라 카드가 사라진다(조사 S5) |
| `brand`(`bg-brand-subtle` + `border-brand`) | 걷음 — "지금 요금제" 같은 고른 표시는 [Select Box](select-box.md) 의 고른 상자 · 안내는 [Callout](callout.md) `informative` | 고름 · 강조를 카드 색으로 알리면 Select Box · List 강조와 겹친다 |
| 제품의 `raised`(흰 위 흰 + `shadow-lg`) | 걷음 — 바닥 위 `default` | 흰 바탕 위 흰 카드를 그림자만으로 갈랐다(1.0) · 스펙에 없었다 |

| 옛 Card | 새 Card |
|---|---|
| 모서리 12(DESIGN.md Card 절은 8) | 16 |
| 여백 16 · 24(문턱 768 — 웹은 736) | 24 — 폭과 상관없이(List 줄 · 시트와 같다). 목록 카드는 좌우 0 + 머리 위 · 좌우 24 · 아래 12 |
| 제목 `title-md` 18 / 600 · 설명 14 | 16 / 22 · 700 + 머리 동작 하나 |
| 누르면 `shadow-md` 또는 1px 위로 | 면 `bg-layer-default-pressed` + 2px 축소(대등한 동작이 있으면 색만) |
| 카드 격자 사이 12 | 쌓으면 8 · 데스크톱 격자 24 |
| 비활성 불투명도 0.5 | 걷음 — 카드는 막히지 않는다(안의 버튼이 막힌다) |

**스펙을 쓰다 나온 것(같은 비교 페이지 14 · 15 · 16 · 20)** — 카드 안 여백은 시트와 같은 24 를 폭과 상관없이(14B — 목록 카드는 머리 위 · 좌우 24 · 아래 12, 폰의 지표 카드는 한 줄에 하나), 순자산 카드 라이트 끝은 brand-900 #002460(15A — 지금 #012B68 은 팔레트에 없다), 순자산 카드 위 증감은 흰 ▲ · ▼ + 글(16A — 방향 색의 하나뿐인 예외), 순자산 카드 모서리 16(20A). 초안 그대로(14A — 카드 16 · 목록 카드 머리 24) · 카드 안 목록 16(14C) · 화면 끝 16(14D) · brand-800(15B) · 빨강 ▲(16B) · 20(20B)은 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹 `Card`(115곳)** — 기본 `shadow`(inline `--shadow-sm`) · `bordered` 7 · `brand` 4 · `muted` 2 · **`raised` 12**(`shared/ui/card.tsx:28-56`). 데스크톱 카드 면 #FFFFFF 가 #F5F6FA 위 1.08(다크 1.13) · 모서리 12 · 테두리 0. 여백 문턱이 `min-[736px]`(`:83 · 126 · 142`)이라 750 폭 폰 틀에서 데스크톱 여백 24 가 나온다(D25). `CardTitle` 이 `text-title-md leading-none`(`:98`)이라 18 / 600 · 줄 높이 18 이다. 여백 24 하나 · `default` 로.
- **Desk 웹 머리 제목 두 벌 · 머리 동작 18.6** — 홈 18 / 600(`CardTitle`), 통계 · 예산 · 자산 16 / 600(`shared/ui/porest/section.tsx:75` 가 `text-body-lg` 로 덮음), 폰 평면 머리 16 / 700(`.flat-group__head` — `shared/styles/porest.css:490-501`). 머리 동작 "전체 보기 · 자세히 · 예산 관리 · 관리 · 캘린더" 는 13 / 500 글 버튼 높이 18.6 ~ 19.5(`porest.css:513-530`, D21). 16 · 700 + 누르는 영역 44 로.
- **Desk 웹 · 앱 폰 '카드 다이어트'** — 폰은 흰 바탕 위 평면 묶음(`Section` 의 모바일 분기 · 앱 `PFlatSection` 15 / 700 — `shared/widgets/p_flat_section.dart`) + 흰 위 흰 `raised` 카드다. 바닥을 회색으로 두고 묶음마다 카드(목록 카드)로 바꾼다 — 줄은 List 그대로.
- **Desk 앱 `PCard`(50곳)** — `raised` 18 · `bordered` 15 · `brand` 6 · `muted` 5, 기본 여백 16 · 모서리 12(`shared/widgets/p_card.dart`). 주석은 "shadow 패딩 24(spacing-xl)" 인데 코드는 16 이다 — 24 로. 통계 `_Card` 는 면 없는 껍데기다(`features/stats/presentation/stats_screen.dart:649-656`).
- **순자산 카드 다크 대비** — 웹 `.dark .balance-hero` 가 `--color-primary-light`(#7AA9F6) → `--color-primary`(`shared/styles/porest.css:369-375`)라 흰 글자가 머리 2.58 · 금액 32 / 800 **2.7** · 부제 2.84 · 자산 / 부채 3.09 · 3.17 이다. 앱은 같은 짝(`app/theme/tokens.dart:333-334`)으로 흰 2.38 · 흰 72% 머리 라벨 **1.9** 다. 라이트 끝 #012B68 은 `color-mix(bg-brand 60%, #000)`(`porest.css:353-358` · 앱 `tokens.dart:271-273`) — brand-900 으로. 머리 라벨의 불투명도 0.72(`porest.css:391-394`) · 부제 0.78(`:416-422`)을 걷고, 증감 색(초록 · 빨강 80% 섞기 — `:431-444`, 앱 `heroChgUp` · `heroChgDown` — `app/theme/colors.dart:62-65`)은 흰 글자 + ▲ · ▼ 로.
- **HR 카드** — shadcn `Card` 가 흰 바탕 위 흰 면(1.0)에 테두리 + `shadow-sm` · 모서리 12 · 여백 24(`shared/ui/shadcn/card.tsx:10 · 23 · 68 · 78`), 대시보드 위젯 틀은 모서리 12 · 테두리 · 그림자 · 머리 12 + 아래 선 · 제목 14 / 600(`features/dashboard/ui/WidgetWrapper.tsx:14-41`). 페이지 바닥을 회색으로, 카드는 `default` 로.
- **HR 통계 카드 "+-12.5%"** — 음수가 "+-12.5%" 로 찍히고 화살표는 늘 오르는 초록(#00A63E 3.22)이다(`features/vacation-history/ui/VacationRequestStatsItem.tsx:72-73`). "지난 달 대비 -1일 감소" #FB2C36(3.81 · 4.28) · "1일 증가" #00C951(**2.22**)(`VacationStatsItem.tsx:33 · 69-71`). 아이콘 타일 파스텔(#DBEAFE …)이 다크에서도 그대로다. `CardStat` + `Delta` 로 — ▲ 빨강 · ▼ 파랑 + 값 + 글, 타일은 List 의 타일 색(`chart-*-weak`).
- **Desk 웹 통계 비교 카드** — ▲ 빨강(지출 늘었음) · ▼ 파랑(`pages/stats/ui/StatsPage.tsx` 비교 KPI)으로 이미 방향 색이다. 글을 붙이고 `Delta` 로 맞춘다. 쓰는 곳이 없는 `shared/ui/hero-stat-card.tsx`(D29)는 걷는다.
- **빼기 두 벌** — 같은 히어로 안에 "-26,371,800"(ASCII) · "−42,898,100"(`DashboardPage.tsx:1188-1250`, D22). U+2212 하나로.
- **화면 단위 실패가 끝없는 재요청이 된다** — 홈 · 자산은 API 하나만 실패해도 `isLoading` 으로 화면 전체를 스켈레톤으로 바꿨다 되돌리며 실패한 쿼리를 다시 마운트해, 10초에 21번(폰 홈 42번) 같은 요청을 보낸다(`pages/dashboard/ui/DashboardPage.tsx:974-978` · `pages/asset/ui/AssetPage.tsx:1159-1160`, D1). 틀과 카드 면은 남기고 카드마다 기다림 · 실패(Result Section + 다시 시도)로.
