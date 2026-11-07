# Chart

> 숫자의 흐름 · 비율 · 세기를 그림으로 보이는 차트 — 수입 · 지출 추이(선), 기간별 합(막대), 카테고리 비율(도넛), 요일 × 시간 세기(열지도). 차트는 카드 본문 안에 두고, 같은 숫자를 범례 · 툴팁의 글로도 읽을 수 있게 한다. 숫자 하나는 [Card](card.md) 의 지표 카드, 줄과 열은 [Table](table.md) 이다.

SEED 에는 차트 컴포넌트도 차트 색도 없다 — 팔레트 7가족과 장식용 배너 색뿐이다. SEED 문서가 가진 차트는 Layout 의 High Density 대시보드 그림 한 장이다: 선 그래프 두 계열, 좌우 이중 축의 눈금 글자를 계열 색으로, 가로 격자만, 가리킨 자리의 세로 점선과 "■ 라벨 값" 툴팁, 차트 위의 지표 타일(범례 겸 합계). 그리고 Inclusive Design 의 원칙 — "색상만으로 정보를 전달하지 않고, 텍스트, 아이콘 등 다른 시각적 요소와 함께 제공합니다" · 대체 텍스트 · 애니메이션 줄이기(당근 SEED, Apache-2.0). 색은 groo 가 v110 · v111 에서 정했고, 축 · 툴팁 · 범례 · 빈 · 실패 · 접근성은 이 그림과 원칙 위에서 groo 가 정했다(2026-10-08 사용자 결정). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Chart 스펙(shadcn ChartContainer · 16:9 · 아래 점 범례 · 테두리 툴팁)을 대신한다.

수치 원본은 [`chart.yaml`](chart.yaml)이고, 색 값은 DESIGN.md 의 v110(차트 10색) · v111(옅은 바탕)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 수입 · 지출 추이(이중 축 · 지표 타일) · 카테고리 도넛(목록 범례) — 라이트 · 다크](../../site/components/specs/chart.tsx#hero)

### 직접 골라 보기

종류(선 · 막대 · 도넛 · 열지도) · 축(하나 · 둘) · 계열 수 · 데이터(있음 · 비었음 · 실패)를 고르면 스펙대로 그린 차트와 그 코드가 바뀐다. 지표 타일을 누르면 계열이 켜지고 꺼지고, 차트를 짚으면 툴팁이 뜬다.

[그림: 플레이그라운드](../../site/components/specs/chart.tsx#playground)

## Anatomy

[그림: 선 차트는 위 지표 타일 · 그리는 자리 · 눈금 글자 · 가로 격자 · 가리킴 선 · 툴팁, 도넛은 조각 · 가운데 합계 · 목록 범례](../../site/components/specs/chart.tsx#anatomy)

| ⓐ Legend Tile | 지표 타일 — 선 · 막대 차트 위. 점 + 이름 + 합계, 누르면 계열을 켜고 끈다. |
| ⓑ Tick Label | 눈금 글자 — 11 · `fg-neutral-subtle`(이중 축이면 계열 색). |
| ⓒ Grid Line | 가로 격자 — 점선 `stroke-neutral-subtle`. 세로 격자 · 축 선 없음. |
| ⓓ Series | 계열 — 차트 10색(v110). |
| ⓔ Crosshair · Point | 가리킴 — 세로 점선 + 가리킨 점. |
| ⓕ Tooltip | 툴팁 — 떠 있는 표면, 머리 + "■ 라벨 값" 줄. |
| ⓖ Donut Center | 도넛 가운데 — 합계(돈은 원까지). |
| ⓗ Legend List | 도넛 범례 — 카테고리 목록 줄(색 네모 + 이름 + % + 금액). |

[표: 부위](chart.yaml#slots)

## Properties

### 색

계열 색은 차트 10색이다 — 라이트 팔레트 700 · 다크 800-dark(v110). 저장된 색이 있는 항목(카테고리 · 계좌)은 그 색이고, 색이 없는 항목은 **그 차트에서 아직 쓰지 않은 색부터** 배정 순서(blue → green → orange → violet → pink → indigo → red → yellow → brown)로 받는다 — 저장된 색과 같은 색이 두 번 나오지 않는다(사용자 결정). 회색은 "기타" 전용이다 — 항목이 10개를 넘으면 상위 9 + 회색 "기타" 로 묶고, 색이 없다고 회색을 주지 않는다. 수입은 blue, 지출은 red 다.

[그림: 저장된 빨강(경조사) · 색 없는 구독 · 의료 — 쓰지 않은 남색 · 노랑을 받는다](../../site/components/specs/chart.tsx#palette)

[표: 색 · 배정 순서](chart.yaml#palette)

[표: 계열](chart.yaml#base.enabled@series)

### 축 · 격자

눈금 글자는 11 / 15 · `fg-neutral-subtle` · 고정폭 숫자다. 돈 축은 "만" 단위로 줄인다(400만 · 1.2만 — 줄임은 축 · 개수만, International Design). 빼기는 U+2212 이고, 세로축의 폭은 가장 긴 글자("−3,000만")가 잘리지 않게 잡는다. 격자는 가로 점선(3 · 3) `stroke-neutral-subtle` 만 긋는다 — 세로 격자 · 가로축 · 세로축 선은 없다. 가로축은 오늘에서 끝난다 — 오늘 뒤 날짜를 0 으로 그리지 않는다.

[그림: 축 — 눈금 11 · 가로 점선 격자 · 축 선 없음 · 음수 축 글자가 잘리지 않음](../../site/components/specs/chart.tsx#axis)

[표: 눈금 글자](chart.yaml#base.enabled@tickLabel)

[표: 격자](chart.yaml#base.enabled@gridLine)

### 이중 축

수입 · 지출 추이처럼 두 계열의 크기가 열 배 넘게 다르면 왼쪽 · 오른쪽 축을 따로 둔다(사용자 결정 — SEED 그림과 같다). 이때 눈금 글자는 그 축이 맡은 계열의 색이다(왼쪽 수입 blue · 오른쪽 지출 red — 글자 기준 4.5 를 넘는다). 축이 하나면 눈금 글자는 회색이다. 두 선의 높이를 서로 견주지 않도록 툴팁 · 지표 타일이 두 값을 숫자로 보인다. 계열이 셋 이상이거나 단위가 같은 두 계열은 축 하나다.

[그림: 이중 축 — 왼쪽 0 ~ 400만(blue) · 오른쪽 0 ~ 40만(red)](../../site/components/specs/chart.tsx#dual-axis)

[표: 축](chart.yaml#axis)

### 툴팁

차트를 짚으면(마우스 · 터치 · 키보드) 그 자리에 세로 점선과 점(10 — 계열 색 + 카드 면 색 테두리 2)이 서고 툴팁이 뜬다. 툴팁은 떠 있는 표면이다 — `bg-layer-floating` · `shadow-s3` · 모서리 12 · 위아래 10 · 좌우 12, 테두리 없음. 머리는 날짜 · 기간(12 · `fg-neutral-subtle`), 줄은 "■ 라벨 값" — 색 네모 8 + 라벨 13 · `fg-neutral-subtle`(글자 역할 D5) + 값 13 · 700 · `fg-neutral`(오른쪽, 고정폭 숫자, 돈은 원까지)이다(SEED 그림). 점은 보통 가리킨 자리에만 찍는다(점이 적은 추이는 아래 "어느 차트를 쓰나").

**늘 찍는 점 — `dots`** — 점이 적은 추이(달마다 순자산처럼 몇 점뿐인 선)는 값마다 점을 늘 찍어 어디에 값이 있는지 보인다. 선 차트의 선택 하나로 켠다 — 이름은 웹 · 앱 모두 `dots`, 기본은 꺼짐이다. 늘 찍는 점은 가리킨 점에서 카드 면 색 테두리를 뺀 계열 색 원이고, 짚으면 가리킨 점이 그 위에 선다. 점이 적은 추이는 채움을 빼고 선 + 점으로 그린다("어느 차트를 쓰나")(2026-10-25 05-3 — 앱 `PLineChart.dots` 가 먼저 생겼다, 웹은 화면 `className` 으로 덮던 것을 같은 이름의 선택으로 옮긴다).

[그림: 툴팁 — "10월 8일 (목)" · ■ 수입 120,000원 · ■ 지출 86,400원](../../site/components/specs/chart.tsx#tooltip)

[표: 툴팁](chart.yaml#base.enabled@tooltip)

[표: 툴팁 머리](chart.yaml#base.enabled@tooltipHead)

[표: 툴팁 줄](chart.yaml#base.enabled@tooltipRow)

[표: 색 네모](chart.yaml#base.enabled@swatch)

[표: 가리킨 점](chart.yaml#base.enabled@point)

[표: 가리킴 선](chart.yaml#base.enabled@crosshair)

### 선 · 막대 범례 — 지표 타일

선 · 막대 차트의 범례는 차트 위의 지표 타일이다(사용자 결정 — SEED 그림). 타일 하나가 계열 하나 — 점 8(계열 색) + 이름 13 · `fg-neutral-subtle`(덧붙인 정보 — 글자 역할 D5), 아래 합계 16 / 22 · 700 · `fg-neutral`. 켠 계열은 바탕이 그 색의 옅은 바탕(`chart-{색}-subtle`, v111), 끈 계열은 흰 면 + 1px `stroke-neutral-weak` 이다. 타일을 누르면 그 계열을 켜고 끈다 — 키보드로도(`Enter` · `Space`). 마우스를 올리면 끈 타일만 바탕이 `bg-layer-default-pressed` 가 되고, 누르면 색 없이 2px 거리 축소만 한다 — 바탕이 이미 켬 · 끔을 말하므로 누름에 색을 쓰지 않는다(SEED Feedback Color, Q-012-2). 마지막 하나는 끌 수 없다 — 그 타일은 켠 색 그대로 두고(회색으로 바꾸지 않는다) `aria-disabled` 로 막는다. 마우스를 올리면 커서가 금지 표시(`not-allowed` — v106 비활성 커서)이고 눌러도 축소하지 않는다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-012-3, 안 C). 타일 사이 8, 타일과 차트 사이 8. 차트 아래 점 범례는 두지 않는다.

[그림: 지표 타일 — 수입 켬 · 지출 끔, 누르면 선이 사라진다](../../site/components/specs/chart.tsx#legend-tiles)

[표: 계열 켬 · 끔](chart.yaml#legend)

[표: 지표 타일](chart.yaml#base.enabled@legendTile)

[그림: 끌 수 없는 마지막 타일 — 수입만 켜져 있다, 커서 금지 표시 · 누름 없음](../../site/components/specs/chart.tsx#legend-locked)

### 도넛 — 목록 범례 · 가운데 합계

도넛의 범례는 카테고리 목록이다 — 줄마다 색 네모 10 + 이름 14 + % 14 · `fg-neutral-subtle` + 금액 14 · 700 + "원". 하위 카테고리가 있는 줄은 누르는 줄이다(통계의 카테고리 → 하위로). 가운데는 합계 — 조각의 합(16 / 22 · 700) + 위 라벨(12) — 돈은 가운데서도 줄이지 않는다("73.3만" 이 아니라 "733,000원"). 가운데에 들어가지 않으면 가운데 글을 빼고 목록 위에 합계를 둔다. 조각 사이는 0 이다. 두께는 지름에서 나온다 — **지름 ÷ 10 + 6** 을 정수로 반올림한다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-012-5, 안 C). 데스크톱 대시보드 160 은 22, 폰 120 은 18, 자산 180 은 24 다. 문턱이 없어 지름이 바뀌어도 고리가 고르게 굵어지고(160 에서 4 가 튀지 않는다), 화면이 새 지름을 쓰면 두께를 따로 정하지 않는다. 레시피 `chartDonutRadii(지름)` 이 그 두께로 `innerRadius` · `outerRadius` 를 준다.

[그림: 카테고리 도넛 — 가운데 1,240,000원 · 목록 범례 9 + 기타](../../site/components/specs/chart.tsx#donut)

[표: 도넛 범례](chart.yaml#base.enabled@legendList)

[표: 도넛 가운데](chart.yaml#base.enabled@donutCenter)

[그림: 도넛 두께 = 지름 ÷ 10 + 6 — 지름 112 · 120 · 140 · 160 · 176 · 180, 가운데 합계가 구멍에 드는지](../../site/components/specs/chart.tsx#donut-thickness)

[표: 종류](chart.yaml#grid.kind)

### 열지도

요일 × 시간처럼 두 축의 세기는 열지도다 — 왼쪽 시간대 라벨 열 56 + 요일 일곱 칸이고, 칸은 정사각형 · 모서리 4 · 사이 6 이다. 세기는 다섯 단계 — 브랜드 채움을 카드 면에 18 · 35 · 55 · 76 · 100% 섞은 지금 제품 단계다(가장 큰 칸 값의 8 · 22 · 45 · 75% 에서 끊는다). 값이 없는 칸은 `bg-neutral-weak` 다. 가장 큰 칸에 고리를 두르지 않는다(사용자 결정) — 가장 짙은 단계가 큰 값을 말하고, 같은 단계 칸이 여럿이면 툴팁 · 표로 보기에서 값을 읽는다. 고리는 키보드 포커스 링(`stroke-focus-ring` — 같은 브랜드 파랑)과 헷갈린다.

칸에 금액을 적는 것은 칸 폭이 112 이상일 때뿐이다 — 원까지, 11 / 15 · 700 · 고정폭 숫자로 쓴다("123,456,789원" 이 84, "99,999,999,999원" 이 107 이라 999억까지 들어간다). 2026-10-08 칸 폭은 1440 에서 140 · 1280 에서 117 이라 글이 보이고, 1024(81) · 768(44) · 폰 390(35)에서는 글 없이 세기 색만 칠한다. 좁다고 돈을 줄여 쓰거나("3.5만") 글자를 줄여 맞추지 않는다(사용자 결정) — 값은 칸을 가리키거나(웹) 누르면(터치) 뜨는 툴팁과 표로 보기에서 읽는다. 툴팁은 머리 "수요일 저녁 18~22시" · 줄 "■ 지출 35,000원"(네모는 그 칸의 세기 색)이고, 넓은 칸에서도 뜬다. 툴팁은 칸 위 8 에 칸 가운데로 뜨고, 화면에 자리가 모자랄 때만 칸 아래 8 로 뒤집는다 — 떠 있는 층이라 카드 · 열지도 상자에 갇히지 않으므로 첫 줄 칸도 카드 머리 위로 뜬다. 좌우는 화면 끝에서 8 안으로 밀어 넣는다(Q-012-6).

칸 글자색은 단계마다 칸 바탕 위 4.5 를 넘는 쪽으로 정해 둔다 — Desk 라이트 18 ~ 55% 는 `fg-neutral`(5.69 이상) · 76 · 100% 는 흰 글자(4.74 · 8.38), HR(v121 그루 초록) 라이트는 18 ~ 55% 가 `fg-neutral`(5.94 이상) · 76 · 100% 가 흰 글자(4.52 · 8.17), 다크는 둘 다 모두 `fg-neutral`(7.74 이상)이다. 넷째 단계는 75% 였다 — 그루 초록에서 흰 글자 4.40 · `fg-neutral` 3.73 으로 어느 쪽도 4.5 에 못 미쳐, 두 브랜드 함께 76% 로 올렸다(2026-10-22 사용자 결정 B — [열지도 넷째 칸](https://claude.ai/artifact/JftMz8DQo6yKaGJ5kS9N53). 이음만 76% · 이음만 67% + 검정 글자 · 4.40 받아들이기는 고르지 않았다). 값이 없는 칸의 "—" 는 `fg-neutral-subtle`(5.09 · 다크 4.68)이다.

[그림: 열지도 — 1280 칸 117 원까지(11 · 700 · 단계마다 글자색) · 1024 칸 81 색만 + 누른 칸 툴팁](../../site/components/specs/chart.tsx#heatmap)

[표: 열지도 칸](chart.yaml#base.enabled@heatmapCell)

[표: 열지도 금액](chart.yaml#base.enabled@heatmapValue)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 계열 · 타일 · 범례 줄 그대로 |
| `hovered` | 가리킴 — 세로 점선 · 점 · 툴팁. 끈 타일 · 범례 줄은 `bg-layer-default-pressed`(켠 타일은 바탕 그대로) |
| `pressed` | 타일 — 색 없이 2px 거리 축소(마우스면 끈 타일의 호버 바탕이 남는다). 범례 줄 — 누름 바탕 |
| `focused` | 웹 — 키보드 포커스에만 링(타일 바깥 · 범례 줄 안쪽 · 차트 상자 바깥) |
| `disabled` | 끌 수 없는 마지막 타일 — 켠 색 그대로 · 커서 `not-allowed` · 누름 없음(`aria-disabled`) |

[그림: 상태 — 가리킴 · 끈 타일 호버 · 누름 · 포커스](../../site/components/specs/chart.tsx#states)

[표: 상태 — 지표 타일](chart.yaml#matrix@legendTile)

[표: 상태 — 끈 타일](chart.yaml#matrix.legend.hidden@legendTile)

[표: 상태 — 도넛 범례 줄](chart.yaml#matrix@legendList)

[표: 모션](chart.yaml#motion)

## Guidelines

### 어느 차트를 쓰나

"무엇을 보이려나" 로 고른다 — 차트가 아닌 [Card](card.md) 의 지표 카드 · [Table](table.md) 도 같은 자리에서 고른다. SEED 에는 차트 고르기 가이드가 없어 groo 가 처음 쓰는 표다 — 그래서 금지가 아니라 권장이다. 이미 정한 것(이중 축 · 지표 타일 · 열지도 칸 112 · 넷째 단계 76%)은 표 칸에 그대로 들어간다(2026-10-22 사용자 결정 5B — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt).

**① 상황 → 고를 것**

| 보이려는 것 | 고를 것 | Desk 예 | 이럴 때는 다른 것 |
|---|---|---|---|
| 날짜를 따라 오르내리는 흐름 | **선**(영역) | 10월 수입 · 지출 추이 · 순자산 추이 | 점이 셋 이하 → 지표 카드 · 막대 · 점이 적은 추이는 채움 없이 선 + 점으로 그려도 된다(달마다 순자산 — 2026-10-23 I-05 Q2) |
| 기간마다의 합을 견준다 · 음수가 섞인다 | **막대** | 월별 순저축 · 예산 이행률 | 날짜가 30칸을 넘는 흐름 → 선 |
| 한 기간 전체를 나눈 몫(2 ~ 10 + 기타) | **도넛** + 목록 범례 | 10월 카테고리별 지출 | 음수 · 다른 단위가 섞임 · 자산과 빚 → 막대 · 목록(아래 "도넛은 한 전체의 몫") |
| 두 축(요일 × 시간대)의 세기 | **열지도** | 요일 · 시간대별 지출 | 축이 하나 → 막대 |
| 숫자 하나 · 둘과 그 변화 | **지표 카드** + 증감([Card](card.md)) | 이번 달 지출 ▲ 12% 지난달보다 | 흐름을 봐야 → 선 |
| 값을 정확히 읽고 견준다 · 열이 셋 이상 | **표**([Table](table.md)) | 날짜별 수입 · 지출 — 차트의 "표로 보기" | — |

**② 비슷한 것끼리**

| | 선 | 막대 | 도넛 | 열지도 | 지표 카드 |
|---|---|---|---|---|---|
| 묻는 말 | 어떻게 변했나 | 어느 기간이 많나 | 전체 중 얼마나 | 언제 많나 | 지금 얼마 · 얼마나 변했나 |
| 가로축 | 날짜 — 오늘에서 끝난다 | 기간 | 없다 | 요일 × 시간대 | 없다 |
| 계열 | 셋까지 권장(아래 "계열은 셋까지") | 셋까지 권장 · 쌓기 포함 | 한 계열(조각 2 ~ 10 + 기타) | 한 값 | 숫자 하나 |
| 범례 | 위 지표 타일(켜고 끔) | 위 지표 타일 | 목록 범례(색 · % · 금액) | 없음 — 세기 다섯 | 라벨 |
| 음수 | 된다 | 된다(아래 모서리) | 안 된다 | 안 된다 | 된다(−) |
| 폰 360 | 높이만 낮게 | 막대 수를 줄인다 | 지름 120 — 합계가 안 들면 목록 위 | 칸 30 — 색만 | 한 줄에 하나 |
| 값 읽기 | 툴팁 · 표로 보기 | 툴팁 · 표로 보기 | 목록 범례 금액 | 툴팁 · 표로 보기 | 숫자 그대로 |

**지표 카드와 지표 타일은 다르다** — 지표 카드([Card](card.md))는 숫자 하나를 보이는 카드이고, 지표 타일(위 "선 · 막대 범례")은 선 · 막대 차트 위의 범례다(합계 + 누르면 계열을 켜고 끈다).

[그림: 무엇을 보이려나 — 선 흐름 · 막대 기간 합 · 도넛 몫 · 열지도 세기 · 지표 카드 숫자 하나](../../site/components/specs/chart.tsx#which-guide)

### 계열은 셋까지

선 · 막대 한 차트의 계열은 셋까지를 권한다 — 넷이 넘으면 선이 엉켜 어느 선이 무엇인지 범례를 오간다. 넷 이상이 필요하면 한 기간의 몫(도넛) · 표로 바꿀 수 있는지 먼저 본다. 꼭 필요하면 까닭을 적고 둘 수 있다. 같은 기간을 위아래 두 차트로 나누지는 않는다 — 크기가 열 배 다른 두 계열은 이중 축이다(위 "이중 축", 사용자 결정 10A). 지금 차트는 모두 계열 둘 이하다(2026-10-22 사용자 결정 6B — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt).

[그림: 한 차트의 계열 — 셋 · 다섯](../../site/components/specs/chart.tsx#series-guide)

### 도넛은 한 전체의 몫

도넛은 한 전체를 나눈 몫이다 — 0 보다 큰 같은 단위 값만 조각이 된다. 자산과 빚을 한 도넛에 넣지 않는다 — 큰 조각(대출)과 가운데 숫자가 맞지 않고, "전체 중 얼마나" 가 무엇의 전체인지 흐려진다. 가운데는 조각의 합이다 — 순자산처럼 조각의 합이 아닌 숫자는 순자산 카드 · 지표 카드로 둔다. 0 이하 값은 조각이 못 된다 — 빠지면 % 가 틀리므로, 음수가 섞이면 막대 · 목록이다. 자산 화면의 모양(지금 웹 자산 도넛은 자산 + 빚 조각 · 가운데 순자산)은 이관 때 화면 비교로 고른다(2026-10-22 사용자 결정 8B — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt).

[그림: 도넛에 넣는 것 — 한 전체(자산)의 몫 · 자산 + 빚 조각에 가운데 순자산](../../site/components/specs/chart.tsx#donut-guide)

### 색 없는 항목은 쓰지 않은 색부터

색을 저장하지 않은 항목에 순번 색을 그대로 주지 않는다 — 7번째 조각이 빨강을 받으면 저장된 빨강(경조사)과 같은 색이 둘이 된다. 저장된 색을 먼저 칠하고, 남은 항목은 그 차트에서 쓰지 않은 색부터 배정 순서로 준다. 회색은 "기타" 에만 — 색이 없다는 이유로 회색을 주지 않는다. 같은 카테고리의 색은 다른 카테고리가 생기면 바뀔 수 있다 — 늘 같은 색이어야 하면 카테고리에 색을 저장한다.

[그림: 쓰지 않은 색부터 · 순번 그대로(빨강 둘) · 회색](../../site/components/specs/chart.tsx#order-guide)

### 오늘 뒤는 그리지 않는다

기간이 이번 달이면 가로축은 오늘에서 끝난다 — 오늘 뒤 날짜를 0 으로 그리면 선이 바닥으로 떨어져 "이번 달 지출이 줄었다" 로 읽힌다. 남은 날의 자리는 비워 둔다(축 눈금은 그 달 끝까지 둘 수 있다).

[그림: 오늘(8일)에서 끝난 선 · 31일까지 0 으로 떨어진 선](../../site/components/specs/chart.tsx#future-guide)

### 돈은 줄이지 않는다 — 축만 "만"

축 눈금은 "400만" 처럼 줄인다. 툴팁 · 지표 타일 · 도넛 가운데 · 열지도 칸 · 범례 · 대체 표의 돈은 원까지 쓴다("1,240,000원"). 좁은 자리에 원까지 들어가지 않으면 줄이지 않고 글을 뺀다 — 열지도 칸은 세기 색만 남기고(값은 툴팁 · 표로 보기), 도넛 가운데는 목록 위 합계로 옮긴다(2026-10-08). 빼기는 U+2212 하나다 — 같은 차트 안에서 "-" 와 "−" 를 섞지 않는다.

[그림: 축 "400만" · 툴팁 원까지 · 도넛 가운데 "73.3만" 으로 줄인 것](../../site/components/specs/chart.tsx#number-guide)

### 색만으로 알리지 않는다

계열은 늘 이름과 함께다 — 지표 타일 · 목록 범례 · 툴팁이 이름을 보인다. 선이 둘이면 범례 순서와 선의 위아래가 같게 둔다. 다크의 빨강 · 주황은 둘 다 산호색이라 가장 가깝다(v110) — 한 차트에 둘이 이웃하면 이름이 가른다.

**가까운 색 짝** — 차트 10색(v110) 가운데 서로 가장 가까운 짝을 잰 값이다(ΔE00 — 작을수록 가깝다).

| 짝 | 라이트 | 다크 | |
|---|---|---|---|
| 주황 · 빨강 | 11.3 | 9.7 | 가장 가깝다 — 다크는 둘 다 산호색 |
| 파랑 · 남색 | 11.6 | 11.5 | |
| 보라 · 남색 | 11.7 | 12.8 | |
| 주황 · 갈색 | 12.5 | 14.0 | |
| 배정 순서의 이웃(노랑 · 갈색) | 16.0 | 18.2 | 순서에서 가장 가까운 이웃 — 나머지 이웃은 17.5 ~ 60.2 |

배정 순서(파랑 → 초록 → 주황 → 보라 → 분홍 → 남색 → 빨강 → 노랑 → 갈색)는 이웃끼리 떨어져 있어, 색 없는 항목만 있는 도넛에서는 가까운 짝이 붙지 않는다. 붙는 것은 저장된 색끼리이거나 색을 정해 두는 두 계열을 고를 때다. **색을 정해 두는 두 계열(수입 · 지출처럼)은 위 짝을 고르지 않는다.** 저장된 색끼리 이웃하면 이름 · 범례 순서가 가른다. 값 · 배정 순서는 그대로다(2026-10-22 사용자 결정 7B — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt).

[그림: 두 계열의 색 — 수입 파랑 · 지출 빨강(먼 짝) · 주황 · 빨강(가까운 짝)](../../site/components/specs/chart.tsx#pair-guide)

한 계열을 둘로 쪼갠 쌓은 막대(통계의 고정 · 변동 — 한 색을 짙게 + 22% 옅게, 2026-10-21)는 지금 이 스펙의 계열 색(차트 10색 하나씩)에 없는 표현이다 — 이관 때 따로 정한다.

### 기다리는 동안 · 비었을 때 · 실패

카드 머리 · 지표 타일 이름 · 범례 틀은 그리고, 차트 자리만 [Skeleton](skeleton.md)(모서리 16)이다. 비었으면 차트 자리에 [Result Section](result-section.md) `medium`("이번 달 지출이 없어요"), 못 불러왔으면 `failure` + "다시 시도" — 빈 축 · 회색 고리 · 0 으로 그린 막대로 대신하지 않는다. 시간표는 [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) 이다.

[그림: 차트 자리 스켈레톤 · 비었음 · 실패 + 다시 시도](../../site/components/specs/chart.tsx#status-guide)

### 모션

처음 그릴 때 막대가 자라고 선이 그어지는 모션(300ms)은 한 번만이다. 모션 줄이기를 켠 사람에게는 바로 그린다 — 차트 라이브러리의 기본(`"auto"`)을 두고, 모션을 강제로 켜지 않는다. 계열을 켜고 끌 때 · 기간을 바꿀 때도 같다.

### 보조 기술 — 요약 이름 · 목록 범례 · 표로 보기

차트 상자는 `role="img"` 와 요약 이름이다 — "10월 수입 · 지출 추이, 수입 4,200,000원 · 지출 1,240,000원". 지표 타일 · 목록 범례는 글로 읽히는 대체다(차트 그림은 장식처럼 건너뛴다). 날짜마다 값을 읽어야 하는 차트(추이 · 열지도)는 "표로 보기" 를 둔다 — 같은 값을 [Table](table.md) 로(숨긴 표 또는 펼치는 표). 키보드로 차트에 들어가면 ← → 로 날짜를 옮기며 툴팁을 띄운다(열지도는 ← → 로 요일 · ↑ ↓ 로 시간대, 포커스 링이 차트 상자에 보인다).

[그림: 요약 이름 · 목록 범례가 대체 · 표로 보기](../../site/components/specs/chart.tsx#a11y-guide)

### 글

요약 이름은 "{기간} {무엇} — {핵심 값}" 문장이다. 계열 이름은 짧은 명사("수입" · "지출"), 빈 결과는 해요체("이번 달 지출이 없어요"). 툴팁 머리의 날짜는 International Design 의 표기("10월 8일 (목)" · "오후 4시").

## 코드

레시피 `recipes/shadcn/components/ui/chart.tsx` 를 쓴다(recharts 위). 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Chart` — 차트 상자. `label`(필수 — 요약 이름, `role="img"` 의 이름) · `height`(px) · `legendId`(대체가 되는 범례의 id — `aria-describedby`). 자식은 recharts 차트(`ResponsiveContainer` 를 안에서 감싼다).
- `chartAxisProps` · `chartGridProps` — recharts `XAxis` · `YAxis` · `CartesianGrid` 에 펼쳐 넣는 값(눈금 11 · `fg-neutral-subtle` · 축 선 · 눈금 선 없음 · 가로 점선 격자 3 3 · `stroke-neutral-subtle`). 이중 축은 `chartAxisProps({ color: "red" })` 처럼 계열 색을 준다.
- `ChartLegendTiles` — 지표 타일 묶음(`role="group"`). `items`(`{ key, label, color, total }[]` — `color` 는 차트 색 이름, `total` 은 원까지 만든 글) · `hidden`(숨긴 key 의 집합) · `onHiddenChange`. 타일은 `<button aria-pressed>` 이고 마지막 하나는 막는다(`aria-disabled` · 커서 `not-allowed`).
- `ChartTooltip` · `ChartTooltipContent` — 툴팁. `headFormatter(label)` · `valueFormatter(value, key)` · 줄은 "■ 라벨 값".
- `ChartDonutLegend` — 도넛 목록 범례(`List`). `items`(`{ key, label, color, percent, amount, onClick? }[]` — `onClick` 이 있는 줄만 누르는 줄).
- `chartDonutRadii(diameter)` — 도넛 지름에서 `{ innerRadius, outerRadius }`(두께 = 지름 ÷ 10 + 6, 정수로). `<Pie {...chartDonutRadii(160)}>` 처럼 펼쳐 넣는다. `chartDonutThickness(diameter)` 는 두께만.
- `ChartDonutCenter` — 가운데 합계. `label` · `amount` · `onFitChange(fits)`(구멍에 들어가지 않으면 그리지 않고 `false` 를 알린다 — 쓰는 쪽이 목록 위에 합계를 둔다).
- `ChartHeatmap` — 열지도. `label`(필수 — 요약 이름, `role="img"` 의 이름) · `rows`(`{ key, label, sub }[]` — 시간대, "저녁" · "18~22시") · `columns`(`{ key, label }[]` — 요일) · `values`(`number[][]`, 줄 × 칸) · `formatValue`(기본 원까지 — "35,000원") · `textMinCellWidth`(기본 112 — 칸 폭이 이보다 좁으면 칸에 글을 두지 않는다) · `tooltipLabel(row, column)`(툴팁 머리 — "수요일 저녁 18~22시") · `valueLabel`(툴팁 줄 이름 — 기본 "지출"). 세기 다섯 단계와 단계마다 글자색은 안에서 정한다. 칸 폭은 `ResizeObserver` 로 재고, 가리키면 · 누르면 · 키보드(← → ↑ ↓)로 툴팁을 띄운다.
- `ChartDataTable` — 표로 보기. `columns` · `rows`, `visuallyHidden`(기본 `true` — 숨긴 표, `false` 면 차트 아래 펼친 표).
- `assignChartColors(items, { colorOf, groupOthers })` — 저장된 색 먼저, 나머지는 쓰지 않은 색부터 배정 순서, 10개를 넘으면 상위 9 + 회색 "기타"(`groupOthers(rest)` 가 "기타" 항목을 만든다). 돌려준 항목에 `color` 와 `fill` 이 붙어 `<Pie data>` 에 바로 넣는다.
- `formatAxisWon(value)` — 눈금 글자("400만" · "1.2만" · "−3,000만").

### 수입 · 지출 추이 — 이중 축

[그림: 10월 수입 · 지출 — 지표 타일 둘 · 이중 축 · 오늘에서 끝남](../../site/components/specs/chart.tsx#ex-trend)

```tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Chart, ChartLegendTiles, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, formatAxisWon,
} from "@/components/ui/chart"

<ChartLegendTiles
  id="trend-legend"
  items={[
    { key: "income", label: "수입", color: "blue", total: "4,200,000원" },
    { key: "expense", label: "지출", color: "red", total: "1,240,000원" },
  ]}
  hidden={hidden}
  onHiddenChange={setHidden}
/>
<Chart label="10월 수입 · 지출 추이, 수입 4,200,000원 · 지출 1,240,000원" legendId="trend-legend" height={200}>
  {/* 오늘까지만 — 남은 날을 0 으로 채우지 않는다 */}
  <AreaChart data={daysUntilToday}>
    {/* 이중 축이면 격자도 축 하나에 건다 — 없으면 recharts 가 격자를 두 줄만 긋는다 */}
    <CartesianGrid {...chartGridProps} yAxisId="income" />
    <XAxis dataKey="day" {...chartAxisProps()} />
    <YAxis yAxisId="income" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "blue" })} />
    <YAxis yAxisId="expense" orientation="right" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "red" })} />
    <ChartTooltip content={<ChartTooltipContent headFormatter={formatDay} valueFormatter={formatWon} />} />
    {!hidden.has("income") && <Area yAxisId="income" dataKey="income" name="수입" stroke="var(--color-chart-blue)" />}
    {!hidden.has("expense") && <Area yAxisId="expense" dataKey="expense" name="지출" stroke="var(--color-chart-red)" />}
  </AreaChart>
</Chart>
```

### 카테고리 도넛 — 목록 범례

[그림: 카테고리 — 가운데 합계 · 목록 범례(누르면 하위로)](../../site/components/specs/chart.tsx#ex-donut)

```tsx
import { Pie, PieChart } from "recharts"
import { Chart, ChartDonutCenter, ChartDonutLegend, assignChartColors, chartDonutRadii } from "@/components/ui/chart"

const slices = assignChartColors(categories, { colorOf: (c) => c.savedColor })

<Chart label="10월 카테고리별 지출, 합계 1,240,000원" legendId="cat-legend" height={160}>
  <PieChart>
    <Pie data={slices} dataKey="amount" {...chartDonutRadii(160)} paddingAngle={0} />
  </PieChart>
  <ChartDonutCenter label="10월 지출" amount="1,240,000원" />
</Chart>
<ChartDonutLegend
  id="cat-legend"
  items={slices.map((s) => ({ key: s.id, label: s.name, color: s.color, percent: s.percentText, amount: s.amountText, onClick: s.hasChildren ? () => openChildren(s.id) : undefined }))}
/>
```

### 표로 보기 · 비었음 · 실패

[그림: 표로 보기 · 비었음 · 실패 + 다시 시도](../../site/components/specs/chart.tsx#ex-status)

```tsx
import { ReceiptText } from "lucide-react"
import { ResultSection } from "@/components/ui/result-section"
import { ChartDataTable } from "@/components/ui/chart"

{query.isError ? (
  <ResultSection kind="failure" size="medium" title="추이를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요."
    primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }} />
) : rows.length === 0 ? (
  <ResultSection kind="empty" size="medium" icon={<ReceiptText />} title="이번 달 기록이 없어요" />
) : (
  <>
    <TrendChart rows={rows} />
    <ChartDataTable caption="10월 날짜별 수입 · 지출" columns={["날짜", "수입", "지출"]} rows={rows.map(toWonRow)} />
  </>
)}
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 마우스를 올림 · 터치로 짚음 | 그 날짜 · 막대에 세로 점선 · 점 · 툴팁. 터치는 손을 떼도 남고, 다른 곳을 짚으면 옮긴다 |
| 열지도 칸을 가리킴 · 누름 | 그 칸의 툴팁 — 머리 "수요일 저녁 18~22시", 줄 "■ 지출 35,000원". 칸 위 8(화면에 모자랄 때만 아래). 칸 폭 112 미만이라 칸에 글이 없을 때 값을 읽는 자리다 |
| 지표 타일 누르기 | 그 계열을 켜고 끈다(`aria-pressed`) — 마지막 하나는 끌 수 없다(`aria-disabled` · 커서 `not-allowed` · 축소 없음, 눌러도 아무 일 없음) |
| 도넛 범례 줄 누르기 | 하위 카테고리가 있는 줄만 — 그 카테고리의 하위 도넛으로 |
| `Tab` | 지표 타일 → 차트 상자 → 범례 줄 차례 |
| 차트 상자에서 ← · → | 날짜 · 막대를 옮기며 툴팁을 띄운다 · `Esc` 로 툴팁을 닫는다. 열지도는 ← · → 요일, ↑ · ↓ 시간대 |
| 칸 폭이 바뀜(창 크기 · 회전) | 열지도 칸이 112 를 넘나들면 칸 글을 보이고 감춘다 — 글자 크기는 그대로 |
| 처음 그림 | 막대가 자라고 선이 그어진다(300ms 한 번) — 모션 줄이기면 바로 |
| 기간을 바꿈 | 머리 · 타일 이름은 바로, 차트 자리만 기다린다(옛 기간의 값은 남기지 않는다) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 눈금 `fg-neutral-subtle` 5.50 · 다크 6.09 ✓. 이중 축 눈금 blue 5.09 · red 5.06 · 다크 6.12 · 6.08 ✓. 툴팁 머리 · 줄 이름 `fg-neutral-subtle` 5.50 · 다크(떠 있는 면 위) 5.27 ✓. 지표 타일 이름 `fg-neutral-subtle` `chart-{색}-subtle` 위 4.77 이상 · 다크 4.68 이상(회색 타일) · 합계 10.32 이상 ✓. 열지도 글자 Desk 5.69 · 4.74 · 8.38 · 다크 7.74 이상, HR 5.94 · 4.52 · 8.17 · 다크 7.74 이상, 빈 칸 "—" 5.09 · 4.68 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 계열 색 카드 면 위 4.55(노랑) ~ 5.50 · 다크 6.07 ~ 7.70 ✓. 지표 타일의 점 옅은 바탕 위 4.06 이상 ✓. 격자는 장식(1.15). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓ |
| **WCAG 1.4.1** Use of color | 계열은 이름(타일 · 목록 범례 · 툴팁)과 함께 — 색만으로 가르지 않는다. 열지도의 좁은 칸은 세기 색만이지만 같은 값을 툴팁 · 표로 보기가 글로 준다 ✓ |
| **WCAG 1.1.1** Non-text content | 차트 상자 `role="img"` + 요약 이름, 범례 목록 · "표로 보기" 가 대체 ✓ |
| **WCAG 2.1.1** Keyboard | 타일 · 범례 줄은 버튼, 차트는 ← · → 로 날짜를 옮긴다(열지도는 ↑ · ↓ 도) ✓ |
| **WCAG 2.3.3** Animation from interactions | 모션 줄이기면 바로 그린다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 지표 타일 높이 62 · 범례 줄 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 타일 · 범례 줄 44 이상 ✓ |
| **ARIA** | 차트 상자 `role="img"` · `aria-label`(요약) · `aria-describedby`(범례). 라이브러리가 붙이는 `role="application"` · 이름 없는 `tabindex` 를 걷는다. 지표 타일 묶음 `role="group"` + 이름, 타일 `aria-pressed`. 툴팁은 보조 기술에 숨기고 같은 값을 표 · 범례로 |

## Do / Don't

### ✅ Do

- 차트 10색(v110) — 저장된 색 먼저, 나머지는 쓰지 않은 색부터, 회색은 "기타".
- 눈금 11 · `fg-neutral-subtle`, 이중 축이면 계열 색, 가로 점선 격자만.
- 선 · 막대 범례는 위 지표 타일(켜고 끄기), 도넛 범례는 목록(금액 "원").
- 툴팁은 떠 있는 표면 + "■ 라벨 값", 돈은 원까지.
- 열지도 칸은 폭 112 이상에서만 원까지(11 · 700), 좁으면 세기 색만 — 값은 툴팁 · 표로 보기.
- 오늘에서 끝나는 가로축, 음수 축 글자가 잘리지 않게.
- `role="img"` + 요약 이름, 범례 목록이 대체, 모션 줄이기면 바로.
- "무엇을 보이려나" 로 고른다 — 숫자 하나 · 둘은 지표 카드, 정확히 견줄 값은 표.
- 선 · 막대의 계열은 셋까지 — 넷 이상이면 도넛 · 표를 먼저 본다.
- 도넛은 한 전체의 몫 — 가운데는 조각의 합.
- 색을 정해 두는 두 계열은 먼 짝(수입 파랑 · 지출 빨강).

### ❌ Don't

- 순번 색을 그대로 — 저장된 색과 같은 색 둘 · 색 없는 항목에 회색.
- 축 하나에 크기가 열 배 다른 두 계열 · 차트를 둘로 나눠 같은 기간을 위아래로.
- 차트 아래 점 범례 · 테두리 툴팁.
- 오늘 뒤 날짜를 0 으로, 도넛 가운데 돈을 "73.3만" 으로.
- 열지도 칸 돈을 "3.5만" 으로 줄이거나, 칸에 맞춰 글자를 줄이기.
- 실패를 빈 축 · 회색 고리로, 모션을 강제로 켜기.
- 이름 없는 `role="application"` 차트.
- 숫자 둘을 막대 둘로 — 높이를 견주려 눈금을 읽어야 한다.
- 자산과 빚을 한 도넛에 · 가운데에 조각의 합이 아닌 숫자(순자산).
- 두 계열에 가까운 짝(주황 · 빨강 — 다크 9.7).

## Specification

`chart.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Chart 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — chart.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chart)

## SEED 와 다른 점

- **groo 가 정한 자리가 대부분이다** — SEED 에는 차트 컴포넌트 · 색 · 규칙이 없다. 이중 축 · 계열 색 눈금 · 가로 격자 · 세로 점선 가리킴 · "■ 라벨 값" 툴팁 · 위 지표 타일은 SEED 대시보드 그림을 따랐다.
- **계열 색은 groo 차트 10색(700 · 800-dark)** — SEED 그림의 blue-600 · green-500 은 흰 바탕 2.84 · 2.18 로 3:1 에 못 미친다. SEED 팔레트에는 남색 · 분홍 · 갈색 가족이 없다(v110).
- **이중 축의 눈금 글자는 계열 색 그대로** — SEED 그림은 계열 색을 옅게 썼다. groo 는 글자 기준 4.5 를 넘는 700 · 800-dark 다.
- **지표 타일의 바탕은 `chart-{색}-subtle`** — SEED 그림의 팔레트 100 과 같은 자리(v111).
- **도넛 범례 · 열지도 · 빈 · 실패 · 표로 보기** — SEED 에 없다.
- **숫자 줄임은 축만, 소수 한 자리("1.2만")** — SEED 는 유효 숫자 셋("1.23만")이다(International Design).

## Migration notes

### 2026-10-30 — 늘 찍는 점은 `dots` 한 이름

2026-10-23 결정(아래)은 "변형은 만들지 않는다, 화면이 덮는다" 였다. 앱은 차트 안을 화면이 덮을 길이 없어 `PLineChart` 에 `dots`(기본 꺼짐 · 지름 6 · 계열 색 · 테두리 없음 — desk-app b02a31b3)를 두었고, 이 이름을 웹 · 앱이 함께 쓰는 선택으로 적었다(Properties "툴팁" 아래 "늘 찍는 점", `chart.yaml` `point.size` 비고). 값 · 토큰 변경 없음. 레시피 `Chart` 는 아직 늘 찍는 점을 숨긴다(`[&_.recharts-line-dots]:hidden`) — 레시피 · 웹 ds 에 `dots` 를 옮기는 일은 따로 남았다. 옛 스펙은 `chart.history/v-pre-cleanup-1030.*`.

### 2026-10-23 — 점이 적은 추이는 선 + 점도 된다

"어느 차트를 쓰나" 의 선 줄에 "점이 적은 추이는 채움 없이 선 + 점으로 그려도 된다" 를 더하고, 툴팁의 "점은 가리킨 자리에만" 을 "보통은" 으로 누그러뜨렸다(chart.yaml `point.size` 비고도). 자산 순자산 추이(달마다 몇 점)를 실제 차트로 그리되 채움을 빼고 선과 점이 보이게 하자는 사용자 결정(I-05 https://claude.ai/artifact/WRqqZhbQYdBCcnyEKhzeVW Q2)에서 나왔다 — 변형 · 값은 만들지 않았다(한 화면의 모양은 그 화면 지시서에). 레시피는 늘 찍는 점을 숨기므로(`[&_.recharts-line-dots]:hidden`) 그 화면은 `className` 으로 덮는다.

### 2026-10-22 — 어느 차트를 쓰나 · 계열 셋까지 · 가까운 색 짝 · 도넛은 한 전체의 몫

머리 한 줄("추이(선) · 기간별 합(막대) · 비율(도넛) · 세기(열지도)")뿐이던 차트 고르기를 Guidelines 맨 앞 "어느 차트를 쓰나" 로 넓혔다 — 상황 표 · 견주기 표에 지표 카드 · 표까지(5B). 6ca9937(2026-10-08)에서 걷힌 두 가이드를 권장 말투로 되살렸다 — 선 · 막대 한 차트의 계열은 셋까지 권장 · 넷 이상이면 도넛 · 표를 먼저(6B — 옛 "1 ~ 3 · Don't 5개 이상" 금지는 되살리지 않았다), 가까운 색 짝은 잰 ΔE00 표 + "색을 정해 두는 두 계열은 가까운 짝을 고르지 않는다"(7B — 값 · 배정 순서는 그대로, 옛 "분배 권장" 순서는 다시 두지 않는다). 도넛은 한 전체의 몫 — 자산과 빚을 섞지 않고 가운데는 조각의 합(8B). 사용자 결정 — https://claude.ai/artifact/KPp9Lpd3v5KMgNrDn7pZmt. 고르지 않은 안: 머리 한 줄 그대로(5A) · 계열 상한 없음(6A) · 옛 금지 되살림(6C) · 한 줄 그대로(7A) · 도넛 그대로(8A) · 자산 화면 모양을 지금 정함(8C). 값 · 토큰 변경 없음.

제품이 이관 때 볼 것

- **웹 자산 도넛** — 현금 · 투자 · 카드 빚 · 대출 빚(절댓값)을 한 도넛에 넣고 가운데에 순자산(자산 − 빚)을 쓴다. 0 이하 항목은 조각에서 빠진다(`pages/asset/ui/AssetPage.tsx:307-355` — `filter(amt > 0)`). 이 절에 걸린다 — 자산 화면의 모양은 이관 때 화면 비교 페이지로 고른다. 앱 자산 화면에는 도넛이 없다.
- **통계 고정 · 변동 쌓은 막대** — 한 색을 짙게 + 22% 옅게로 두 계열을 가른다(`pages/stats/ui/FixedVariableTab.tsx:43-48 · 474-481`, 2026-10-21). 계열 색(차트 10색 하나씩)에 없는 표현이라 이관 때 따로 묻는다.

### 2026-10-16 — 범례 이름 · 툴팁 줄 이름을 subtle 로(글자 역할 D5)

사용자가 [글자 역할 비교 페이지](https://claude.ai/artifact/X9n6tDZbKSP7GeLtodtz8N)에서 보조 글의 규칙을 정했다(D5 A) — `fg-neutral-subtle` 은 덧붙인 정보(축 · 시각 · 단위 · 이름표), `fg-neutral-muted` 는 문장으로 된 보조 글. 지표 타일 이름 · 툴팁 줄 이름이 muted 에서 subtle 로 바뀌어 차트 안 글자(축 · 툴팁 머리 · 이름)가 한 색이 된다. 모두 subtle(D5 B) · 지금대로(D5 C)는 고르지 않았다. 옛 스펙은 `chart.history/v-pre-text-roles.*`.

### 2026-10-15 — 구현 세션 질문(Q-012-2 · 3 · 5 · 6)

사용자가 [비교 페이지](https://claude.ai/artifact/HCRX5Ds7svjfCLi9Aogpmt)에서 정했다(2026-10-15 사용자 결정 — 구현 세션 질문 Q-012-3 · Q-012-5, 정리 Q-012-2 · Q-012-6 은 "추천대로").

- **Q-012-3 끌 수 없는 마지막 타일 → 안 C(not-allowed)** — 켠 색은 그대로 두고 커서만 금지 표시, 누름 축소 없음. v106 비활성 커서와 같은 표시다. YAML 에 `disabled` 상태(`legend: shown` 규칙)를 더했다. 커서 화살표(A — 지금 웹 · 옛 레시피 `aria-disabled:cursor-default`) · 손 모양 그대로(B)는 고르지 않았다.
- **Q-012-5 도넛 두께 → 안 C(지름 ÷ 10 + 6, 정수로)** — 120 → 18 · 160 → 22 · 180 → 24 가 그대로 맞는다. YAML `series` 에 `thickness`(식) · `thicknessPerDiameter 0.1` · `thicknessOffset 6` · `diameter 160` · `diameterPhone 120` 을 적고 레시피에 `chartDonutRadii` · `chartDonutThickness` 를 더했다. 160 에서 뚝 바뀌는 계단(A — 지금 앱) · 지름 비율(B)은 고르지 않았다.
- **Q-012-2 끈 타일 호버 · 누름** — 호버 바탕은 `legend: hidden` 규칙으로 옮겼다(켠 타일은 바탕 그대로). 누름은 색 없이 축소만이다 — 옛 레시피만 끈 타일에 누름 바탕(`active:bg-…`)을 주던 것을 걷었다. 웹 · 앱은 이미 그렇다.
- **Q-012-6 열지도 툴팁 자리** — `kind: heatmap` 규칙에 툴팁 `placement`(칸 위) · `offset 8` · `viewportMargin 8` 을 적었다. 화면에 모자랄 때만 아래로 — 떠 있는 층이라 첫 줄 칸도 위로 뜬다. 레시피 · 웹은 이미 그렇다.

제품이 바꿀 것

- **웹** — 마지막 타일 `aria-disabled:cursor-default` → `cursor-not-allowed`(`chart-variants.ts`). 도넛은 화면마다 손으로 적은 두께 대신 지름에서 식으로(대시보드 160 · 120 · 자산 180 은 값이 그대로). 카탈로그 견본 `chart.demo.tsx` 가 120 에서도 22 를 쓰는 것을 18 로.
- **앱** — 도넛 두께 `diameter >= 160 ? 22 : 18`(`p_chart_values.dart`) → `(diameter / 10 + 6).round()`. 대시보드 112 는 18 → 17, 통계 176 은 28 → 24 로 바뀐다. 열지도 툴팁을 떠 있는 층(Overlay)으로 띄워 화면 기준으로 뒤집는다 — 지금은 열지도 상자 기준이라 첫 줄이 늘 아래로 뒤집힌다(`p_chart_parts.dart`). 마지막 타일의 커서는 폰이라 해당 없다(누름 없음은 이미 그렇다).

### 2026-10-08 — 축 · 툴팁 · 범례 · 접근성을 정한다

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)에서 정했다 — 색 없는 항목은 쓰지 않은 색부터(9A — 회색은 "기타" 전용), 추이 차트는 이중 축 유지(10A — 눈금 글자는 계열 색), 선 · 막대 범례는 차트 위 지표 타일(11A — 점 + 이름 + 합계, 바탕 `chart-*-subtle`, 누르면 계열 켜고 끔). 그리고 "따라오는 것" — 축 글자 11 `fg-neutral-subtle` · 가로 점선 격자 `stroke-neutral-subtle` · 툴팁 `bg-layer-floating` · s3 · 모서리 12 · "■ 라벨 값" · 도넛 범례는 카테고리 목록 + 금액 "원" · 오늘 뒤 날짜 안 그림 · 음수 축 글자 안 잘림 · `role="img"` + 요약 이름 · 범례 목록이 대체 · 모션 줄이기면 바로 · 빈 · 실패는 작은 Result Section · 열지도 글자 4.5. 회색(9B) · 색 필수(9C) · 축 하나(10B) · 차트 둘(10C) · 아래 점 범례(11B)는 고르지 않았다. 스펙을 쓰다 나온 것(같은 비교 페이지 19) — 열지도 칸의 돈은 칸 폭 112 이상에서만 원까지, 좁으면 세기 색만(19B — 값은 툴팁 · 표로 보기, 글자를 줄여 맞추지 않는다). 늘 색만(19A) · 축처럼 줄여 쓰기(19C)는 고르지 않았다. 구현을 앞두고 나온 것(같은 비교 페이지 22) — 가장 큰 칸에 고리를 두르지 않는다(22A — 지금 웹의 고리는 칸 색에 묻히고 포커스 링과 겹친다). 고리 있음(22B)은 고르지 않았다. 따라오는 것으로 — 세기 다섯(초안의 넷을 지금 제품대로 바로잡음) · 툴팁은 넓은 칸에서도 · 화살표 키로 칸을 옮긴다. 옛 스펙은 `chart.history/v-pre-seed-data.*` 에 남겼다.

**옛 스펙 안의 어긋남을 걷었다** — 배정 순서가 규칙(v110 순서)과 "분배 권장"(옛 red → green → blue …) 두 벌이었다. "모든 차트 색은 흰 글자와 4.5:1" 은 다크에서 틀렸다 — 800-dark 위 흰 글자는 2.4 안팎이다(v110). 차트 색 위에 글자를 얹으면 `fg-neutral-inverted`(Avatar 이니셜과 같다)다. Layout 예시(HR 부서별 인원 · 직급 도넛 · 연간 출근율 · RadialBar KPI)는 제품에 없었다. 툴팁 모서리 4 · 테두리 · 아래 점 범례 · 16:9 · 툴팁 표시 세 가지(점 · 선 · 점선)를 걷었다.

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트 · 코드로 봤다).

- **차트 색이 세 제품 세 벌** — 웹은 10-06 토큰 가져오기로 v110 이 들어왔다(`shared/styles/groo-tokens.css:263-282 · 1002-1011`). 앱은 옛 v21 상수(`app/theme/colors.dart:69-89` · `core/format/chart_palette.dart` — 빨강 #C73838 · 다크 #ECA0A0)라 "식비" 가 웹 #BE490D / #FF8758 · 앱 #B36418 / #E8B266 이다(D3). HR 은 recharts 데모 색(#0088FE · #00C49F · #FFBB28 · #FF8042 · #8884D8 — `features/vacation-history/ui/VacationTypeStatsContent.tsx:8-23`) 고정이라 흰 바탕 1.69 ~ 3.53, 다크에서도 격자 #CCCCCC · 축 #888888(3.54)이다(`MonthVacationStatsContent.tsx:56-87`, D7). 앱 · HR 을 v110 으로 — HR 휴가 유형은 차트 색 이름에 잇는다.
- **순번 색이 저장된 색과 부딪친다** — 색 없는 카테고리(구독)에 7번째 순번 색(빨강)을 줘 저장된 빨강(경조사)과 겹친다 — 홈 · 통계 도넛에 #D72323 조각이 둘(`pages/dashboard/ui/DashboardPage.tsx:339-346` · `pages/stats/ui/StatsPage.tsx:265-272` · 앱 `features/dashboard/presentation/dashboard_screen.dart:961-971`, D4). 10개를 넘으면 순번이 한 바퀴 돌아 회색이 일반 조각에 간다. `assignChartColors` 로.
- **이름 없는 차트** — recharts 3.8 기본값으로 모든 차트 SVG 가 `role="application"` · `tabindex=0` 인데 이름 · `<title>` · 대체 글 · 초점 링이 0 이다(웹 · HR). 앱 차트 파일 5개는 `Semantics(` 0(D8). `role="img"` + 요약 이름으로.
- **모션 줄이기 무시** — 공용 `Donut` 과 예산 막대가 `isAnimationActive` 를 참으로 박았다(`shared/ui/groo/charts.tsx:671` · `pages/budget/ui/BudgetPage.tsx:1191`, D11). 렌더로 확인 — 줄이기 상태에서도 조각이 120ms 사이에 바뀐다. 기본 `"auto"` 로.
- **오늘 뒤 날짜를 0 으로** — 일별 추이가 10/9 ~ 10/31 을 0 으로 채운다(`StatsPage.tsx:2085-2121`, D12). 오늘까지만.
- **이중 축** — 수입 0 ~ 400만 · 지출 0 ~ 40만, 눈금 글자가 계열 색이다(웹 `StatsPage.tsx:2268-2295` · 앱 `stats_screen.dart` `useDualAxis`, D13). 그대로 두고, 툴팁 · 지표 타일이 두 값을 숫자로 보이게 한다.
- **음수 축 글자가 잘린다** — 자산 순자산 차트 세로축 "−3,000만" · "−2,000만" 이 SVG 밖으로 7px(−1,000만 4px) 나가 빼기가 안 보인다(`pages/asset/ui/AssetPage.tsx:151-235` — `YAxis` 폭, D6).
- **돈을 줄여 쓴다 · 빼기 두 벌** — 통계 도넛 가운데 "73.3만" · 자산 도넛 가운데 "−2,637.2만"(`formatChartAxis` — `StatsPage.tsx:1366` · `AssetPage.tsx:366`, 앱은 홈 · 통계 도넛 가운데 — `dashboard_screen.dart:1103` · `stats_screen.dart:1318`), 순자산 툴팁 "-26,140,000원" 은 ASCII 빼기(축은 "−")다(D22). 가운데 · 툴팁은 원까지, U+2212 하나로.
- **범례 · 툴팁** — 세 제품 모두 HTML 손 범례다. 웹 도넛 범례 금액에 "원" 이 없다(`.cat-legend`), HR 은 점 범례다. 툴팁은 웹 모서리 12 · 테두리 1px · `shadow-md`, HR 8 · 테두리, 앱은 터치 자리 옆 12(`shared/widgets/p_chart_tooltip.dart`)다(D30). 선 · 막대는 지표 타일, 도넛은 목록 범례, 툴팁은 떠 있는 표면으로.
- **열지도 흰 글자 2.88 · 줄인 돈 · 줄어드는 글자** — 라이트 55% 칸 위 흰 글자 2.88 · 다크 3.54 다(`StatsPage.tsx:202-221`). 칸 값은 축 줄임 함수로 "3.5만" 이고(`heatCellLabel` → `formatChartAxis` — `StatsPage.tsx:1770` · 앱 `stats_screen.dart:1792`), 글자 수에 따라 데스크톱 11.5 → 10 · 폰 10 → 9 → 8 로 줄인다(`StatsPage.tsx:1772-1780`, 앱은 `FittedBox` 로 줄인다 — `stats_screen.dart:1720`). 칸 이름 · 원까지의 값은 `title` 에만 있어 터치로는 못 본다(`StatsPage.tsx:1784-1788`, D17). 웹만 가장 큰 칸에 2px 고리를 두르고 앱에는 없다(`StatsPage.tsx:1801-1803`) — 고리 색(`--fg-brand-strong`)과 칸 색(`--border-brand`)이 둘 다 `--color-primary` 라 고리는 칸에 묻히고 바깥 25% 띠만 보인다. 고리는 걷는다. 단계마다 글자색을 정하고, 칸 폭 112 이상에서만 원까지(11 · 700 — 오늘 1280 이상), 좁은 칸은 세기 색만 + 툴팁 · 표로 보기로 옮긴다.
- **다크 브랜드 채움 1.73** — 예산 이번 달 막대 · 자산 구성의 투자 조각이 다크 `bg-brand-solid`(#1049A4)라 카드 면 대비 1.73 이다(`BudgetPage.tsx:1195-1200` · `AssetPage.tsx:423`, D19). 계열은 차트 10색에서 고른다.
- **같은 화면의 다른 파랑** — 홈 수입 숫자는 브랜드 #0147AD, 수입 막대는 #1D6EC9 다(`DashboardPage.tsx:237-240 · 1278-1290`, D31). 수입은 chart-blue 하나로.
- **빈 · 실패** — 홈 막대 차트가 비면 축 0 ~ 1 만 남고, 도넛은 회색 고리 + "카테고리 데이터가 없습니다"(데스크톱) / "…없어요"(폰) 두 문체, 통계 · 예산은 실패도 빈 상태로 보인다(D2 · D28). HR 은 합쇼체 빈 상태. Result Section 으로.
- **HR 차트 두 개** — 유형 도넛 가운데 두 줄이 붙고(위 글 아래 끝 · 아래 글 위 끝 거의 0), 월 막대 축(시간)과 툴팁(일)의 단위가 다르며 "월" 이 코드에 박혔다(`VacationTypeStatsContent.tsx:150-185` · `MonthVacationStatsContent.tsx:56-87`, D24).
- **쓰지 않는 것** — 웹 손 SVG `LineChart` · `BarChart`(`shared/ui/groo/charts.tsx:89-569`)는 쓰는 곳이 0 이다(D29). `chart-palette.ts` 머리 주석의 "base hex" 가 옛 값이다(`shared/lib/groo/chart-palette.ts:1-13`, D32).
