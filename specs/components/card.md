# Card

> 회색 바닥 위에 놓는 흰 면 하나입니다. 한 가지 내용(오늘 쓴 돈 · 예산 · 차트 · 표 · 지표)을 묶어 데스크톱(768 이상) 화면을 나눌 때 씁니다.

라이트와 다크가 같은 규칙입니다. 폰(Desk · HR)에는 카드 화면이 없습니다(띠 · 흰 화면 — 아래 "면"). 줄을 늘어놓는 것은 카드 안의 [List](list.md), 줄과 열을 견주는 것은 카드 안의 [Table](table.md), 고르는 상자는 [Select Box](select-box.md) 입니다.

수치 원본은 [`card.yaml`](card.yaml)입니다.

[그림: Desk 홈 — 순자산 · 지표 둘 · 오늘 쓴 돈(데스크톱 카드 · 폰 띠) — 라이트 · 다크](../../site/components/specs/card.tsx#hero)

### 직접 골라 보기

내용(글 · 목록 · 지표 · 순자산) · 누름 · 폭(폰 · 데스크톱) · 증감 방향을 고르면 스펙대로 그린 카드와 그 코드가 바뀝니다. 누르는 카드를 고르면 실제로 눌러 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/card.tsx#playground)

## Anatomy

[그림: 카드는 면 · 머리(제목 + 전체 보기) · 본문으로 이뤄지고, 목록을 담으면 줄이 가장자리까지 간다](../../site/components/specs/card.tsx#anatomy)

| ⓐ Root | 카드 면 — 바닥 위 흰 면 + 1px 테두리, 모서리 16, 그림자 없음. |
| ⓑ Header | 머리 — 제목과 오른쪽 동작 한 줄입니다. 없어도 됩니다. |
| ⓒ Title | 제목 — 16 / 22 · 700. 무엇의 카드인지 알립니다. |
| ⓓ Header Action | 머리 동작 — "전체 보기" 글 버튼(14 · 700 · `fg-neutral-muted`), 보이는 36 · 누르는 영역 44. |
| ⓔ Content | 본문 — 글 · 숫자 · 차트 · 표. 카드 여백 안에 둡니다. |
| ⓕ List | 카드 안 목록 — [List](list.md) 줄이 가장자리까지, 누름 바탕 모서리 10. |

[표: 부위](card.yaml#slots)

## Properties

### 면 — 바닥 위 흰 면 + 테두리

카드는 바닥(`bg-layer-basement`) 위 흰 면(`bg-layer-default`)에 1px `stroke-neutral-weak` 테두리입니다. 그림자는 없습니다 — 면과 바닥이 라이트 1.08 · 다크 1.13 으로 거의 같아 선이 경계를 맡습니다. 라이트 · 다크가 같은 규칙이고, 폰도 바닥이 회색입니다. 흰 바탕 위에 카드를 두거나, 흰 바탕에 평면 묶음 · 흰 위 흰 그림자 카드(raised)를 두지 않습니다.

카드는 데스크톱(768 이상) 화면의 구역입니다. Desk 폰(앱 · 768 미만 웹)에는 카드 화면이 없습니다 — 폰 화면은 띠 · 흰 화면이고(띠 안 값은 카드 안과 같습니다), 어느 화면이 어느 쪽인지는 DESIGN.md Layout 의 "화면 바탕" 한 곳에 적습니다. HR 폰도 같습니다 — 폰은 띠 + 줄이나 흰 면 하나이고 카드를 두지 않습니다.

[그림: 바닥 위 테두리 카드 — 데스크톱 라이트 · 다크, 폰은 카드 없이 띠(그루 이음 휴가 현황)](../../site/components/specs/card.tsx#surface)

[표: 면](card.yaml#base.enabled@root)

### 모서리 · 사이

모서리는 16 입니다 — 카드 안 목록의 동심 모서리(16 − 6 = 10)와 [Skeleton](skeleton.md) 의 카드 면 16 이 이 값을 전제합니다. 위아래로 쌓은 카드 사이는 8, 데스크톱 격자에서 나란한 칸 사이는 `layout-gutter` 24 입니다. 폰의 카드 묶음은 화면 가장자리 24(`spacing-global-gutter`) 안에 둡니다 — 카드 안의 제목 · 숫자 · 목록 줄 글자는 모두 화면 끝에서 48(24 + 카드 안 24)에 한 줄로 섭니다.

[그림: 모서리 16 · 데스크톱 한 칸에 쌓은 카드 사이 8 · 데스크톱 격자 24](../../site/components/specs/card.tsx#radius-gap)

### 여백

카드 안 여백은 폭과 상관없이 24 입니다 — [List](list.md) 줄의 좌우 24, [Bottom Sheet](bottom-sheet.md) 의 머리 · 본문 24 와 같은 값이라 카드 · 줄 · 시트가 한 자리에 글자를 세웁니다(카드 24 = List 줄 24 = 시트 24).

목록을 담은 카드는 좌우 여백을 두지 않습니다 — 줄이 제 좌우 24 · 위아래 12 를 가지므로 줄이 카드 가장자리까지 갑니다(시트 본문에 List 를 둘 때와 같습니다). 머리는 위 24 · 좌우 24 · 아래 4, 카드 아래 여백은 12 입니다 — 마지막 줄의 아래 12 와 합쳐 보이는 24 로 위와 같습니다.

[그림: 여백 24 — 데스크톱 카드 · 폰 띠 · 시트가 같은 24(폭과 상관없이), 목록 카드 아래 12 + 줄 12](../../site/components/specs/card.tsx#padding)

[표: 본문](card.yaml#body)

### 머리

머리는 제목 16 / 22 · 700 · `fg-neutral` 하나에 오른쪽 동작 하나입니다. 동작은 "전체 보기" 같은 글 버튼입니다 — 14 · 700 · `fg-neutral-muted`, 꺾쇠 없이 보이는 상자 36(좌우 14 · 누를 때 바탕 · 모서리 8)에 누르는 영역 44 입니다(DESIGN.md Typography 의 "글자 역할"). 머리 줄 끝에서는 오른쪽 14 만큼 바깥으로 내어 글자 끝이 카드 여백 24 에 섭니다. 앱도 같습니다 — 보이는 자리 · 머리 줄 높이는 그대로 두고 누르는 영역만 위아래 4 넓힙니다(머리 줄 밖의 점도 받습니다 — 44 × 44 의 앱 풀이). 폰 · 데스크톱 · 웹 · 앱이 같은 머리입니다 — 작은 회색 머리 · 18 제목은 두지 않습니다. 머리 아래 본문까지 8, 목록 카드는 4 입니다(줄이 제 위 여백을 가집니다).

큰 글자에서 오른쪽 동작이 머리 폭의 절반을 넘으면 제목 아래 줄 오른쪽 끝으로 내립니다 — 제목은 한 줄 전체 폭으로 읽히고 머리가 버튼 한 줄(36)만큼 높아집니다. 평소(100% · 130%)는 한 줄 그대로입니다. [Button](button.md) 짝의 반 폭 판정과 같고, 카드 머리 · 아코디언 목록 머리 · List Header 가 같은 규칙입니다. 판정 — 동작의 보이는 상자 폭(글 + 좌우 14 · 14)에서 끝 블리드 14(머리 여백으로 내어 걸리는 몫)를 빼고 사이 8 를 더한 값이 머리 안쪽 폭의 절반 이하면 한 줄, 넘으면 내립니다. 레시피의 flex 줄바꿈(제목 최소 50%)이 그대로 이 셈입니다 — 예: 머리 안쪽 300 이면 동작 보이는 상자 156 까지 한 줄 · 157 부터 내려갑니다(카드 머리 · 아코디언 목록 머리 156 / 157 · List Header 는 사이가 10 이라 154 / 155). 글자 200% 에서 360 화면의 "모두 펼치기"(154)는 한 줄, 320 화면의 "전체 보기"(130)는 한 줄 · "모두 펼치기" 는 내려갑니다. 웹 · 앱 모두 이 셈으로 판정합니다.

[그림: 머리 — 제목 16 · 700 + 전체 보기(보이는 36 · 누르는 44)](../../site/components/specs/card.tsx#header)

[표: 머리](card.yaml#base.enabled@header)

[표: 제목](card.yaml#base.enabled@title)

[표: 머리 동작](card.yaml#base.enabled@headerAction)

### 누름

카드 전체가 한 곳으로 가면(`whole` — 자산 하나 · 예산 하나) 누르는 동안 면이 `bg-layer-default-pressed` 로 바뀌고 카드 전체가 2px 거리만큼 줄어듭니다 — 마우스는 올릴 때 같은 색입니다. 테두리 · 글자색은 그대로이고 그림자 · 위로 뜨기는 없습니다. 카드를 누르면 열리는데 안에 대등한 동작(관심 등록 · ⋮)이 더 있으면(`peers`) 면 색만 바뀌고 카드는 줄지 않습니다 — 안의 버튼이 각자 제 누름을 가집니다. 전체가 줄어들면 무엇이 눌린 것인지 흐려지기 때문입니다. 보기만 하는 카드(`none`)는 바뀌지 않습니다. 순자산 카드(`hero`)를 누르면 2px 축소만 합니다 — 브랜드 채움 그라디언트에는 누름 색 짝이 없습니다(색은 `-pressed` 짝이 있는 표면에서만 바뀝니다).

[그림: 누름 — 카드 전체(색 + 2px) · 대등한 동작이 있는 카드(색만)](../../site/components/specs/card.tsx#press)

[표: 누름](card.yaml#press)

### 카드 안 목록

목록을 담으면 [List](list.md) 줄을 카드에 바로 넣습니다(`body="list"`). 누름 · 호버 바탕은 좌우 6 들어와 모서리 10 입니다 — 카드 16 − 6(List 의 동심 모서리). 줄 사이 선은 기본으로 두지 않습니다. 표도 같습니다 — 표는 첫 칸 앞 · 끝 칸 뒤 24 를 스스로 가지므로 `body="list"` 로 카드 가장자리까지 두고, 줄 선이 카드 끝까지 갑니다([Table](table.md)). 머리가 없는 목록 카드(768 미만 표를 바꾼 List 줄 등)는 위에도 12 를 두어 첫 줄의 12 와 합쳐 보이는 24 — 아래와 같습니다. 회색 바닥 위의 목록은 흰 면에 담습니다 — 데스크톱은 카드, Desk 폰은 띠 · 흰 화면(DESIGN.md Layout 의 "화면 바탕")입니다. 누름 바탕이 바닥과 같은 밝기라 회색 위에서는 보이지 않기 때문입니다(List 의 "목록을 두는 바탕").

[그림: 오늘 쓴 돈 — 머리 + List 줄, 가운데 줄을 누른 순간](../../site/components/specs/card.tsx#list-card)

[표: 카드 안 목록](card.yaml#base.enabled@list)

### 카드 안 아코디언

카드 상세의 혜택 · 유의사항처럼 상세를 접어 둔 목록은 [Accordion](accordion.md) `inline` 을 카드에 바로 넣습니다(`body="accordion"` — 웹 · 앱이 같습니다). 트리거가 제 좌우 24 · 위아래 16 을 가지므로 카드 좌우 여백은 0 이고, 머리는 목록 카드와 같습니다(위 24 · 좌우 24 · 아래 4). 카드 아래 여백은 8 입니다 — 마지막 트리거의 아래 16 과 합쳐 보이는 24 입니다. 머리 오른쪽 동작 자리에는 Accordion 의 "모두 펼치기" 를 둡니다 — 건수는 제목에 붙입니다("혜택 · 12건"). 누름 바탕은 목록 카드와 같은 동심 모서리 10 입니다.

[그림: 혜택 · 12건 — 카드 머리 + 모두 펼치기, 트리거가 가장자리까지 · 카드 아래 8](../../site/components/specs/card.tsx#accordion-card)

### 지표 카드

숫자 하나를 보이는 카드입니다 — 라벨 13 · 500 · `fg-neutral-subtle`, 아래 4 에 큰 숫자 700 · 고정폭 숫자, 아래 4 에 증감 줄을 둡니다. 카드 하나에 숫자 하나면 24(`large`)입니다. 폰(HR · Desk 띠 화면)은 지표 카드 없이 한 묶음의 지표를 한 띠 안에 위아래로 쌓습니다(`large` — DESIGN.md Layout "화면 바탕"). 둘씩 나란히 놓으면 360 폭에서 칸 안쪽이 101(여백 16 이어도 117)인데 "1,240,000원" 20 / 700 은 120 이라 들어가지 않기 때문입니다. 데스크톱 격자에 셋 · 넷씩 나란히 놓을 때만 20(`small`)이고, 여백은 그대로 24 입니다. 돈은 줄이지 않고 원까지 씁니다. 숫자가 굴러가며 바뀌는 애니메이션은 두지 않습니다 — 금액은 처음부터 그 값으로 보입니다.

카드보다 긴 금액(큰 글자 · 큰 수)은 **쉼표 뒤에서만** 줄을 바꿉니다 — 세 자리 묶음을 가르지 않습니다("−123,456,789, / 012원"). 금액 글을 만드는 함수가 보이는 글의 쉼표 뒤마다 웹 `<wbr>` · 앱 U+200B 를 넣고, 읽는 이름 · 복사에는 넣지 않습니다. 글자를 줄여 맞추지 않습니다(DESIGN.md Typography 줄바꿈 규칙의 예외). 줄이 하나 늘 수 있습니다.

[그림: 지표 — 폰은 띠 하나에 쌓는다(24) · 데스크톱 격자 넷(20), 여백은 모두 24](../../site/components/specs/card.tsx#stat)

[그림: 큰 글자 — 카드보다 긴 금액은 쉼표 뒤에서만 줄을 바꾼다(폭 360 · 글자 200%)](../../site/components/specs/card.tsx#big-text)

[표: 지표 크기](card.yaml#stat)

[표: 라벨](card.yaml#base.enabled@statLabel)

[표: 숫자](card.yaml#base.enabled@statValue)

### 증감 표기

지난달 · 지난 기간에 견준 변화는 방향으로 칠합니다 — 어디서나 오르면 ▲ `fg-critical`(빨강), 내리면 ▼ `fg-informative`(파랑)입니다(증권과 같은 관례). 늘 ▲ · ▼ 와 값을 함께 쓰고, 그 뒤에 기준을 옅은 글로 둡니다 — "▲ 12.00% 지난달보다". 부호는 화살표가 말합니다 — "+12.00%" · "−12.00%" 를 화살표와 같이 쓰지 않습니다. 좋은지 나쁜지는 색이 아니라 글이 말합니다 — 지출이 늘었으면 "지난달보다 12.00% 더 썼어요". 변화가 없으면 화살표 없이 "변화 없음" 입니다. 하나뿐인 예외는 짙은 브랜드 채움(순자산 카드) 위입니다 — 흰 ▲ · ▼ + 글입니다. 보조 기술에는 문장으로 읽힙니다("지난달보다 12.00% 늘었어요" — 화살표는 숨깁니다).

**지난 기간 대비 % 는 늘 소수 둘째 자리입니다** — 지출 · 수입 · 순자산 · 주식 어디서나 "▲ 12.00%" · "▼ 1.80%" 입니다. 자리 규칙은 DESIGN.md International Design 의 "퍼센트" 표 한 곳에 있습니다.

[그림: 증감 — ▲ 빨강 · ▼ 파랑 · 변화 없음, 지출 · 수입 · 순자산 · 주식이 같은 규칙](../../site/components/specs/card.tsx#delta)

[표: 증감](card.yaml#delta)

[표: 증감 값](card.yaml#base.enabled@delta)

[표: 증감 글](card.yaml#base.enabled@deltaText)

### 순자산 카드

Desk 홈 맨 위의 순자산은 브랜드 색으로 채운 카드입니다(`hero`) — 135° 그라디언트, 흰 글자. 라이트는 `bg-brand-solid`(#0147AD) → brand-900(#002460), 다크도 짙은 채움입니다 — `bg-brand-solid`(#1049A4) → brand-300-dark(#1F3A69). 흰 글자는 두 모드 모두 그라디언트 어디서나 4.5 이상입니다. 라벨 13 · 500, 금액 32 / 42 · 700, 아래 글 13 입니다. 모두 흰 글자이고 흐리게(불투명도) 두지 않습니다. 금액이 카드보다 길면 지표 숫자처럼 쉼표 뒤에서만 줄을 바꿉니다. 증감도 흰 글자에 ▲ · ▼ + 글입니다 — 빨강 · 파랑은 브랜드 채움 위 1.66 · 1.65 라 읽히지 않습니다. 증감 방향 색의 하나뿐인 예외입니다. 오른쪽 위 장식 빛(흰 22% → 투명)은 남깁니다. 모서리 16 · 사이 · 여백 24 는 다른 카드와 같습니다.

Desk 폰에서는 순자산도 띠입니다 — 화면 폭 · 모서리 0 · 테두리 없음이고, 그라디언트 · 흰 글자 · 안 24 · 장식 빛은 이 절 그대로입니다. 본문은 늘 글 · 숫자(`content`)입니다 — 목록 · 아코디언을 담지 않으므로 목록 카드의 아래 12 를 받지 않고 사방 24 입니다. 증감 줄의 위 4 는 아래 글 줄이 주고 증감 자체는 위 여백을 두지 않습니다. 홈 맨 위에 하나입니다 — 자산 화면의 순자산 요약은 `hero` 가 아니라 흰 띠 · 카드(`default`)입니다.

[그림: 순자산 — 라이트 #0147AD → #002460 · 다크 #1049A4 → #1F3A69, 흰 글자](../../site/components/specs/card.tsx#hero-card)

[표: 순자산 카드](card.yaml#grid.variant)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 흰 면 + 테두리 |
| `hovered` | 웹 · 누르는 카드 — 면 `bg-layer-default-pressed`(누름과 같은 색). 머리 동작은 제 상자에 같은 바탕 |
| `pressed` | 같은 면 + 카드 전체 2px 거리 축소(`whole`) · 축소 없음(`peers`). 머리 동작은 제 상자만 |
| `focused` | 웹 — 키보드 포커스에만 카드 · 머리 동작 바깥 2px 링(띄움 2) |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스](../../site/components/specs/card.tsx#states)

[표: 상태 — 카드 전체](card.yaml#matrix.press.whole@root)

[표: 상태 — 대등한 동작이 있는 카드](card.yaml#matrix.press.peers@root)

[표: 상태 — 머리 동작](card.yaml#matrix@headerAction)

[표: 모션](card.yaml#motion)

## Guidelines

### 회색 바닥 위에만

카드는 `bg-layer-basement` 바닥 위에 둡니다. 흰 바탕(시트 · 대화상자 · 흰 화면 · 흰 띠) 위에서는 카드로 묶지 않습니다 — 면이 바탕과 같아 테두리만 남기 때문입니다. 시트 · 대화상자 안의 요약은 [List](list.md) 의 키-값 줄이나 [Callout](callout.md) 입니다. 띠 안을 나누는 것은 구역 제목 · 여백 · 선입니다 — 흰 면 위에 그대로 두는 예외(Accordion `separated` · Callout · Select Box)와 까닭은 DESIGN.md Layout 의 "화면 바탕" 에 있습니다.

[그림: 바닥 위 카드 · 흰 바탕 위 카드](../../site/components/specs/card.tsx#floor-guide)

### 그림자를 두지 않습니다

카드의 경계는 테두리입니다 — 그림자 카드 · 흰 위 흰 그림자 카드(raised) · 마우스를 올리면 그림자가 커지는 카드를 두지 않습니다. 그림자는 떠 있는 몇 안 되는 요소(떠 있는 탭 바 · 떠 있는 버튼 · 메뉴 · 팝오버)에만 씁니다(Elevation).

[그림: 테두리 카드 · 그림자 카드 · raised](../../site/components/specs/card.tsx#shadow-guide)

### 카드 안에 카드를 두지 않습니다

카드 안을 나누려면 머리 · 간격 · [Divider](divider.md) 로 나눕니다 — 카드 안에 테두리 상자를 또 두면 어느 것이 한 덩어리인지 흐려집니다. 예외는 띠 안 카드의 예외와 같은 셋입니다 — Accordion `separated` · [Callout](callout.md) · [Select Box](select-box.md)(DESIGN.md Layout 의 "화면 바탕"). 지표 여럿은 카드 하나에 넣지 않고 지표 카드를 따로 둡니다 — 데스크톱은 격자로 둡니다(폰 띠 화면은 HR · Desk 모두 카드 없이 한 묶음의 지표를 한 띠 안에 쌓습니다).

[그림: 카드 안 카드 · 지표 카드를 따로(데스크톱 칸마다 하나)](../../site/components/specs/card.tsx#nest-guide)

### 머리 동작은 하나, 누르는 영역 44

머리 오른쪽 동작은 하나입니다("전체 보기" · "관리"). 글 버튼은 보이는 상자가 36 이라도 누르는 영역이 44 입니다 — 글자 높이(18.6)짜리 링크로 두지 않습니다. 이름은 "{제목} 전체 보기" 처럼 무엇의 동작인지 넣습니다.

카드 · 띠 안의 몇 줄 미리보기(오늘 쓴 돈 · 최근 거래)는 머리의 "전체 보기" 로 목록 화면에 보냅니다 — 미리보기 끝에 줄을 덧붙이는 "더 보기" 버튼은 두지 않습니다. 긴 목록은 목록 화면에서 끝없이 불러옵니다([Pagination](pagination.md) 의 "폰 목록").

콘텐츠가 높은 카드 — 사진 · 여러 줄 · 버튼이 든 카드 하나가 항목 하나일 때(글 · 구매 내역 카드처럼) — 는 그 항목의 동작을 머리 오른쪽 ⋮ 하나("{항목 이름} 더보기" — Button `ghost` · `iconOnly`)로 둘 수 있습니다. 목록에서 ⋮ 를 둘 수 있는 자리는 이것뿐입니다 — 좁은 목록 줄에는 두지 않고 줄을 눌러 들어간 화면에 둡니다([Menu](menu.md) 의 "줄의 동작").

[그림: 머리 동작 — 누르는 영역 44 · 글자만큼인 링크](../../site/components/specs/card.tsx#header-guide)

### 증감은 방향 색 + ▲ · ▼ + 글

증감 색은 방향입니다 — 지출이 늘어도 ▲ 빨강, 수입이 줄어도 ▼ 파랑입니다. 같은 화면의 주식(▲ 빨강 = 올랐다)과 뜻이 엇갈리지 않게 하기 위해서입니다. 좋고 나쁨은 글이 말하고, 색만으로 알리지 않습니다(▲ · ▼ 와 값이 늘 함께). 증감 값에 "+-12.5%" 처럼 부호를 겹쳐 쓰지 않습니다.

[그림: 방향 색 · 좋고 나쁨 색(지출 ▲ 빨강 · 순자산 ▲ 초록)](../../site/components/specs/card.tsx#delta-guide)

### 기다리는 동안 · 실패

카드 면 · 머리 · 라벨은 처음부터 그리고, 서버에서 올 숫자 · 줄 자리만 [Skeleton](skeleton.md) 으로 둡니다. 카드 하나가 통째로 기다리면 카드 면 모양 스켈레톤(모서리 16)입니다. 카드의 데이터를 못 불러오면 그 카드 안에 [Result Section](result-section.md) `medium` + "다시 시도" 를 둡니다 — 다른 카드는 그대로 보입니다. 카드 안의 Result Section 은 좌우 여백이 0 입니다 — 카드 24 만 둡니다. 목록 카드(`body="list"`)는 줄마다 24 를 갖고 카드 여백이 없으니, 목록을 못 불러와 Result Section 을 카드에 바로 두면 Result Section 이 좌우 24 를 갖습니다 — 어느 카드에서나 글이 24 에 섭니다. 제 여백 48 을 그대로 두면 72 가 되어 좁은 카드에서 제목이 두 줄로 넘어갑니다. 데이터 하나가 실패했다고 화면 전체를 스켈레톤으로 되돌리지 않습니다 — 같은 요청을 끝없이 다시 보내게 됩니다.

[그림: 구역마다 기다림 · 실패(Desk 폰 — 띠마다) — 순자산 실패 + 다시 시도, 나머지는 보임](../../site/components/specs/card.tsx#status-guide)

### 글

제목은 짧은 명사구입니다("오늘 쓴 돈" · "이번 달 예산"). 머리 동작은 "전체 보기" · "관리" 처럼 동사구로 짧게 씁니다. 지표 라벨은 무엇의 숫자인지("이번 달 지출"), 증감 글은 기준("지난달보다")을 적습니다.

## 코드

레시피 `recipes/shadcn/components/ui/card.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `Card` — 카드 면. `variant`(`"default"` 기본 · `"hero"`) · `body`(`"content"` 기본 · `"list"` — 좌우 여백 0, 머리 24 · `"accordion"` — 좌우 0, 아래 8, 머리 24) · `press`(`"none"` 기본 · `"whole"` · `"peers"`) · `onClick` · `href`(주면 `press` 를 `"whole"` 로 봅니다 — 카드 전체가 버튼 · 링크). `"peers"` 는 카드를 누르는 자리를 카드 위에 깐 링크(`CardLink`)로 만들고, 안의 버튼은 그 위에 놓습니다 — 버튼을 눌러도 카드가 열리지 않습니다. 여백은 폭과 상관없이 24 입니다.
- `CardHeader` — 머리. `CardTitle`(`as` — 기본 `h2`) · `CardAction`(머리 동작 — `href` · `onClick`, 글만 · `aria-label` 기본 "{제목} {글}").
- `CardContent` — 본문(여백 안). 목록 카드는 `CardContent` 없이 `List` 를 바로 넣습니다. 머리 설명(`CardDescription`) · 아래 버튼 줄(`CardFooter`)은 두지 않습니다 — 머리는 제목 하나, 버튼은 본문 끝에 둡니다.
- `CardLink` — `peers` 카드의 누르는 자리(카드 전체를 덮는 링크 · 버튼, 이름은 카드 제목).
- `CardStat` — 지표. `label` · `value`(글 — 쓰는 쪽이 원까지 만듭니다) · `size`(`"large"` 기본 · `"small"`) · `delta`.
- `Delta` — 증감 줄. `direction`(`"up"` · `"down"` · `"flat"`) · `value`("12.00%") · `text`("지난달보다") · `srText`(보조 기술 문장 — 기본 "{text} {value} 늘었어요 · 줄었어요", `flat` 은 "{text} 변화가 없어요", 화살표는 숨깁니다). `flat` 은 화살표도 기준 글도 없이 "변화 없음" 만 보입니다 — "변화 없음 지난달보다" 가 되지 않게 기준 글은 숨긴 문장에만 들어갑니다. `value` 앞의 부호(+ · − · ±)는 떼고 보입니다 — 방향은 화살표가 말합니다("+-12.5%" 가 아니라 "▼ 12.5%"). 표 · 차트의 증감 칸도 이것을 씁니다.
- `CardHeroLabel` · `CardHeroAmount` · `CardHeroDetail` — `variant="hero"` 의 흰 글자 셋. 장식 빛은 카드가 그립니다.

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
      delta={{ direction: "up", value: "12.00%", text: "지난달보다", srText: "지난달보다 12.00% 더 썼어요" }} />
  </Card>
  <Card>
    <CardStat label="이번 달 수입" value="4,200,000원"
      delta={{ direction: "down", value: "3%", text: "지난달보다" }} />
  </Card>
</div>
```

### 누르는 카드

[그림: 예산 카드 — 카드 전체가 예산 상세로 · 관심 등록 버튼이 있는 종목 카드](../../site/components/specs/card.tsx#ex-press)

```tsx
import { Star } from "lucide-react"
import { Card, CardContent, CardLink } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"

{/* 한 곳으로 — 색 + 2px 축소 */}
<Card href={`/desk/budget/${budget.id}`}>
  <CardContent>…</CardContent>
</Card>

{/* 카드를 누르면 열리고 관심 등록 버튼이 따로 — 색만, 축소 없음 */}
<Card press="peers">
  {/* 관심 등록 버튼은 제목 줄 오른쪽 — 켜고 끄는 아이콘 단추(Toggle). 상자 40 이 줄 높이를 밀지 않게 위 · 오른쪽 8 을 당긴다 */}
  <div className="flex items-start justify-between gap-x2">
    <CardLink href={`/desk/stocks/${stock.code}`}>{stock.name}</CardLink>
    <Toggle className="-mr-x2 -mt-x2 shrink-0" aria-label="관심 등록" pressed={watched} onPressedChange={setWatched} icon={<Star />} />
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
  <CardHeroDetail><Delta direction="up" value="1.80%" text="지난달보다" /></CardHeroDetail>
</Card>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 카드 누르기(`whole`) | 그 한 곳으로 갑니다 — 누르는 동안 면 색 + 2px 축소. 마우스는 올릴 때 같은 색입니다 |
| 카드 누르기(`peers`) | 카드의 링크로 갑니다 — 면 색만 바뀝니다. 안의 버튼을 누르면 그 버튼만 반응하고 카드는 열리지 않으며, 누르는 동안에도 카드 면은 바뀌지 않습니다(앱도 같습니다 — 반응하는 것은 실제로 누른 대상입니다) |
| 머리 동작 누르기 | 그 목록 · 화면으로 갑니다 — 상자 바탕 + 글자 2px 축소 |
| `Tab` | 누르는 카드(`whole`) 하나 → 다음 카드. `peers` 는 카드 링크 → 안의 버튼 차례입니다. 보기만 하는 카드는 건너뛰고 안의 버튼 · 줄로 갑니다 |
| `Enter` · `Space` | 누르는 카드는 누르기와 같습니다(링크는 `Enter`) |
| 글자 크기 설정 | 제목 · 지표 라벨 · 숫자 · 증감 · 본문 · 머리 동작 글이 커집니다. 카드 폭은 그대로이고 줄을 바꿔 높이가 늘어납니다. 머리 동작은 한 줄을 지키고 상자(최소 높이)가 글을 따라 늘어납니다 |
| 모션 줄이기 | 축소하지 않습니다 — 색만 바뀝니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 숫자 `fg-neutral` 카드 면 위 16.41 · 다크 13.42, 누름 면 위 15.48 · 10.32 ✓. 라벨 · 증감 글 `fg-neutral-subtle` 5.50 · 6.09 ✓. 머리 동작 `fg-neutral-muted` 7.11 · 7.70(누름 바탕 위 6.70 · 5.93) ✓. 증감 ▲ `fg-critical` 5.06 · 다크 6.08, ▼ `fg-informative` 5.09 · 6.12 ✓. 순자산 흰 글자 — 라이트 8.38(#0147AD) ~ 14.78(#002460) · 다크 8.36(#1049A4) ~ 11.25(#1F3A69), 장식 빛 위 가장 낮은 자리 4.88 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 카드 테두리(바닥 위 1.14 · 다크 1.76)는 장식입니다 — 카드는 제목 · 내용으로 읽힙니다. 누르는 카드는 이름(제목)으로 알 수 있습니다. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.4** Resize text | 카드의 글(제목 · 숫자 · 증감 · 본문 · 머리 동작)이 글자 크기 설정을 따라 커지고, 카드가 줄을 바꿔 받습니다 ✓ |
| **WCAG 1.4.1** Use of color | 증감은 ▲ · ▼ 모양과 값 · 글이 함께 알립니다 — 색만으로 알리지 않습니다 ✓ |
| **WCAG 1.3.1** Info and relationships | 카드 제목은 제목 태그(`h2` 기본 — 화면 제목 아래 단계) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 머리 동작 44 · 누르는 카드 전체 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 머리 동작 44 × 44 이상 ✓ · 누르는 카드는 카드 전체 ✓ |
| **ARIA** | 보기만 하는 카드는 역할이 없습니다(`div` · 묶음은 제목으로). 누르는 카드는 `<a>` · `<button>` 하나입니다 — 카드 안 버튼과 겹쳐 두지 않습니다(`peers` 는 카드 링크 + 버튼이 형제). 머리 동작 이름 "{제목} 전체 보기". 증감의 ▲ · ▼ 는 `aria-hidden`, 문장은 숨긴 글입니다 |

## Do / Don't

### ✅ Do

- 회색 바닥 위 흰 면 + 1px `stroke-neutral-weak`, 모서리 16, 그림자 없음. 폰(Desk 앱 · 768 미만 웹 · HR 폰)은 카드 없이 띠 · 흰 화면입니다(위 "면").
- 쌓은 카드 사이 8, 데스크톱 격자 칸 사이 24.
- 머리는 제목 16 · 700 + 동작 하나(누르는 영역 44).
- 카드 안 여백 24 — 폭과 상관없이, List 줄 · 시트와 같습니다. 목록 카드는 List 줄을 가장자리까지, 머리 위 · 좌우 24 · 아래 12.
- 폰에서 지표 여럿은 한 띠 안에 쌓습니다(카드를 나누지 않습니다).
- 증감은 어디서나 ▲ 빨강 · ▼ 파랑 + 값 + 글로 씁니다.
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

`card.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Card 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — card.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#card)
