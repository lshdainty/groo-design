# Chart

> 숫자의 흐름 · 비율 · 세기를 그림으로 보이는 차트 — 수입 · 지출 추이(선), 기간별 합(막대), 카테고리 비율(도넛), 요일 × 시간 세기(열지도). 차트는 카드 본문 안에 두고, 같은 숫자를 범례 · 툴팁의 글로도 읽을 수 있게 한다. 숫자 하나는 [Card](card.md) 의 지표 카드, 줄과 열은 [Table](table.md) 이다.

SEED 에는 차트 컴포넌트도 차트 색도 없다 — 팔레트 7가족과 장식용 배너 색뿐이다. SEED 문서가 가진 차트는 Layout 의 High Density 대시보드 그림 한 장이다: 선 그래프 두 계열, 좌우 이중 축의 눈금 글자를 계열 색으로, 가로 격자만, 가리킨 자리의 세로 점선과 "■ 라벨 값" 툴팁, 차트 위의 지표 타일(범례 겸 합계). 그리고 Inclusive Design 의 원칙 — "색상만으로 정보를 전달하지 않고, 텍스트, 아이콘 등 다른 시각적 요소와 함께 제공합니다" · 대체 텍스트 · 애니메이션 줄이기(당근 SEED, Apache-2.0). 색은 porest 가 v110 · v111 에서 정했고, 축 · 툴팁 · 범례 · 빈 · 실패 · 접근성은 이 그림과 원칙 위에서 porest 가 정했다(2026-10-08 사용자 결정). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. 옛 Chart 스펙(shadcn ChartContainer · 16:9 · 아래 점 범례 · 테두리 툴팁)을 대신한다.

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

차트를 짚으면(마우스 · 터치 · 키보드) 그 자리에 세로 점선과 점(10 — 계열 색 + 카드 면 색 테두리 2)이 서고 툴팁이 뜬다. 툴팁은 떠 있는 표면이다 — `bg-layer-floating` · `shadow-s3` · 모서리 12 · 위아래 10 · 좌우 12, 테두리 없음. 머리는 날짜 · 기간(12 · `fg-neutral-subtle`), 줄은 "■ 라벨 값" — 색 네모 8 + 라벨 13 · `fg-neutral-muted` + 값 13 · 700 · `fg-neutral`(오른쪽, 고정폭 숫자, 돈은 원까지)이다(SEED 그림). 점은 가리킨 자리에만 찍는다.

[그림: 툴팁 — "10월 8일 (목)" · ■ 수입 120,000원 · ■ 지출 86,400원](../../site/components/specs/chart.tsx#tooltip)

[표: 툴팁](chart.yaml#base.enabled@tooltip)

[표: 툴팁 머리](chart.yaml#base.enabled@tooltipHead)

[표: 툴팁 줄](chart.yaml#base.enabled@tooltipRow)

[표: 색 네모](chart.yaml#base.enabled@swatch)

[표: 가리킨 점](chart.yaml#base.enabled@point)

[표: 가리킴 선](chart.yaml#base.enabled@crosshair)

### 선 · 막대 범례 — 지표 타일

선 · 막대 차트의 범례는 차트 위의 지표 타일이다(사용자 결정 — SEED 그림). 타일 하나가 계열 하나 — 점 8(계열 색) + 이름 13 · `fg-neutral-muted`, 아래 합계 16 / 22 · 700 · `fg-neutral`. 켠 계열은 바탕이 그 색의 옅은 바탕(`chart-{색}-subtle`, v111), 끈 계열은 흰 면 + 1px `stroke-neutral-weak` 이다. 타일을 누르면 그 계열을 켜고 끈다 — 키보드로도(`Enter` · `Space`). 마지막 하나는 끌 수 없다. 타일 사이 8, 타일과 차트 사이 8. 차트 아래 점 범례는 두지 않는다.

[그림: 지표 타일 — 수입 켬 · 지출 끔, 누르면 선이 사라진다](../../site/components/specs/chart.tsx#legend-tiles)

[표: 계열 켬 · 끔](chart.yaml#legend)

[표: 지표 타일](chart.yaml#base.enabled@legendTile)

### 도넛 — 목록 범례 · 가운데 합계

도넛의 범례는 카테고리 목록이다 — 줄마다 색 네모 10 + 이름 14 + % 14 · `fg-neutral-subtle` + 금액 14 · 700 + "원". 하위 카테고리가 있는 줄은 누르는 줄이다(통계의 카테고리 → 하위로). 가운데는 합계(16 / 22 · 700) + 위 라벨(12) — 돈은 가운데서도 줄이지 않는다("73.3만" 이 아니라 "733,000원"). 가운데에 들어가지 않으면 가운데 글을 빼고 목록 위에 합계를 둔다. 조각 사이는 0, 두께는 지름 160 에서 22(폰 120 에서 18)다.

[그림: 카테고리 도넛 — 가운데 1,240,000원 · 목록 범례 9 + 기타](../../site/components/specs/chart.tsx#donut)

[표: 도넛 범례](chart.yaml#base.enabled@legendList)

[표: 도넛 가운데](chart.yaml#base.enabled@donutCenter)

[표: 종류](chart.yaml#grid.kind)

### 열지도

요일 × 시간처럼 두 축의 세기는 열지도다 — 왼쪽 시간대 라벨 열 56 + 요일 일곱 칸이고, 칸은 정사각형 · 모서리 4 · 사이 6 이다. 세기는 다섯 단계 — 브랜드 채움을 카드 면에 18 · 35 · 55 · 75 · 100% 섞은 지금 제품 단계다(가장 큰 칸 값의 8 · 22 · 45 · 75% 에서 끊는다). 값이 없는 칸은 `bg-neutral-weak` 다. 가장 큰 칸에 고리를 두르지 않는다(사용자 결정) — 가장 짙은 단계가 큰 값을 말하고, 같은 단계 칸이 여럿이면 툴팁 · 표로 보기에서 값을 읽는다. 고리는 키보드 포커스 링(`stroke-focus-ring` — 같은 브랜드 파랑)과 헷갈린다.

칸에 금액을 적는 것은 칸 폭이 112 이상일 때뿐이다 — 원까지, 11 / 15 · 700 · 고정폭 숫자로 쓴다("123,456,789원" 이 84, "99,999,999,999원" 이 107 이라 999억까지 들어간다). 2026-10-08 칸 폭은 1440 에서 140 · 1280 에서 117 이라 글이 보이고, 1024(81) · 768(44) · 폰 390(35)에서는 글 없이 세기 색만 칠한다. 좁다고 돈을 줄여 쓰거나("3.5만") 글자를 줄여 맞추지 않는다(사용자 결정) — 값은 칸을 가리키거나(웹) 누르면(터치) 뜨는 툴팁과 표로 보기에서 읽는다. 툴팁은 머리 "수요일 저녁 18~22시" · 줄 "■ 지출 35,000원"(네모는 그 칸의 세기 색)이고, 넓은 칸에서도 뜬다.

칸 글자색은 단계마다 칸 바탕 위 4.5 를 넘는 쪽으로 정해 둔다 — Desk 라이트 18 ~ 55% 는 `fg-neutral`(5.69 이상) · 75 · 100% 는 흰 글자(4.62 · 8.38), 다크는 모두 `fg-neutral`(7.74 이상)이다. HR 은 라이트 75% 까지 `fg-neutral`(5.23 이상) · 100% 만 흰 글자(5.06)다. 값이 없는 칸의 "—" 는 `fg-neutral-subtle`(5.09 · 다크 4.68)이다.

[그림: 열지도 — 1280 칸 117 원까지(11 · 700 · 단계마다 글자색) · 1024 칸 81 색만 + 누른 칸 툴팁](../../site/components/specs/chart.tsx#heatmap)

[표: 열지도 칸](chart.yaml#base.enabled@heatmapCell)

[표: 열지도 금액](chart.yaml#base.enabled@heatmapValue)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 계열 · 타일 · 범례 줄 그대로 |
| `hovered` | 가리킴 — 세로 점선 · 점 · 툴팁. 끈 타일 · 범례 줄은 `bg-layer-default-pressed` |
| `pressed` | 타일 — 2px 거리 축소. 범례 줄 — 누름 바탕 |
| `focused` | 웹 — 키보드 포커스에만 링(타일 바깥 · 범례 줄 안쪽 · 차트 상자 바깥) |

[그림: 상태 — 가리킴 · 끈 타일 호버 · 누름 · 포커스](../../site/components/specs/chart.tsx#states)

[표: 상태 — 지표 타일](chart.yaml#matrix@legendTile)

[표: 상태 — 끈 타일](chart.yaml#matrix.legend.hidden@legendTile)

[표: 상태 — 도넛 범례 줄](chart.yaml#matrix@legendList)

[표: 모션](chart.yaml#motion)

## Guidelines

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
- `ChartLegendTiles` — 지표 타일 묶음(`role="group"`). `items`(`{ key, label, color, total }[]` — `color` 는 차트 색 이름, `total` 은 원까지 만든 글) · `hidden`(숨긴 key 의 집합) · `onHiddenChange`. 타일은 `<button aria-pressed>` 이고 마지막 하나는 막는다.
- `ChartTooltip` · `ChartTooltipContent` — 툴팁. `headFormatter(label)` · `valueFormatter(value, key)` · 줄은 "■ 라벨 값".
- `ChartDonutLegend` — 도넛 목록 범례(`List`). `items`(`{ key, label, color, percent, amount, onClick? }[]` — `onClick` 이 있는 줄만 누르는 줄).
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
import { Chart, ChartDonutCenter, ChartDonutLegend, assignChartColors } from "@/components/ui/chart"

const slices = assignChartColors(categories, { colorOf: (c) => c.savedColor })

<Chart label="10월 카테고리별 지출, 합계 1,240,000원" legendId="cat-legend" height={160}>
  <PieChart>
    <Pie data={slices} dataKey="amount" innerRadius={58} outerRadius={80} paddingAngle={0} />
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
| 열지도 칸을 가리킴 · 누름 | 그 칸의 툴팁 — 머리 "수요일 저녁 18~22시", 줄 "■ 지출 35,000원". 칸 폭 112 미만이라 칸에 글이 없을 때 값을 읽는 자리다 |
| 지표 타일 누르기 | 그 계열을 켜고 끈다(`aria-pressed`) — 마지막 하나는 끌 수 없다 |
| 도넛 범례 줄 누르기 | 하위 카테고리가 있는 줄만 — 그 카테고리의 하위 도넛으로 |
| `Tab` | 지표 타일 → 차트 상자 → 범례 줄 차례 |
| 차트 상자에서 ← · → | 날짜 · 막대를 옮기며 툴팁을 띄운다 · `Esc` 로 툴팁을 닫는다. 열지도는 ← · → 요일, ↑ · ↓ 시간대 |
| 칸 폭이 바뀜(창 크기 · 회전) | 열지도 칸이 112 를 넘나들면 칸 글을 보이고 감춘다 — 글자 크기는 그대로 |
| 처음 그림 | 막대가 자라고 선이 그어진다(300ms 한 번) — 모션 줄이기면 바로 |
| 기간을 바꿈 | 머리 · 타일 이름은 바로, 차트 자리만 기다린다(옛 기간의 값은 남기지 않는다) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 눈금 `fg-neutral-subtle` 5.50 · 다크 6.09 ✓. 이중 축 눈금 blue 5.09 · red 5.06 · 다크 6.12 · 6.08 ✓. 툴팁 라벨 `fg-neutral-muted` 7.11 · 다크(떠 있는 면 위) 6.67, 머리 `fg-neutral-subtle` 5.50 · 5.27 ✓. 지표 타일 이름 `chart-{색}-subtle` 위 5.93 이상 · 합계 10.32 이상 ✓. 열지도 글자 Desk 5.69 · 4.62 · 8.38 · 다크 7.74 이상, HR 5.23 · 5.06 · 다크 4.69 이상, 빈 칸 "—" 5.09 · 4.68 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 계열 색 카드 면 위 4.55(노랑) ~ 5.50 · 다크 6.07 ~ 7.70 ✓. 지표 타일의 점 옅은 바탕 위 4.06 이상 ✓. 격자는 장식(1.15). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓ |
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

### ❌ Don't

- 순번 색을 그대로 — 저장된 색과 같은 색 둘 · 색 없는 항목에 회색.
- 축 하나에 크기가 열 배 다른 두 계열 · 차트를 둘로 나눠 같은 기간을 위아래로.
- 차트 아래 점 범례 · 테두리 툴팁.
- 오늘 뒤 날짜를 0 으로, 도넛 가운데 돈을 "73.3만" 으로.
- 열지도 칸 돈을 "3.5만" 으로 줄이거나, 칸에 맞춰 글자를 줄이기.
- 실패를 빈 축 · 회색 고리로, 모션을 강제로 켜기.
- 이름 없는 `role="application"` 차트.

## Specification

`chart.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Chart 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — chart.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#chart)

## SEED 와 다른 점

- **porest 가 정한 자리가 대부분이다** — SEED 에는 차트 컴포넌트 · 색 · 규칙이 없다. 이중 축 · 계열 색 눈금 · 가로 격자 · 세로 점선 가리킴 · "■ 라벨 값" 툴팁 · 위 지표 타일은 SEED 대시보드 그림을 따랐다.
- **계열 색은 porest 차트 10색(700 · 800-dark)** — SEED 그림의 blue-600 · green-500 은 흰 바탕 2.84 · 2.18 로 3:1 에 못 미친다. SEED 팔레트에는 남색 · 분홍 · 갈색 가족이 없다(v110).
- **이중 축의 눈금 글자는 계열 색 그대로** — SEED 그림은 계열 색을 옅게 썼다. porest 는 글자 기준 4.5 를 넘는 700 · 800-dark 다.
- **지표 타일의 바탕은 `chart-{색}-subtle`** — SEED 그림의 팔레트 100 과 같은 자리(v111).
- **도넛 범례 · 열지도 · 빈 · 실패 · 표로 보기** — SEED 에 없다.
- **숫자 줄임은 축만, 소수 한 자리("1.2만")** — SEED 는 유효 숫자 셋("1.23만")이다(International Design).

## Migration notes

### 2026-10-08 — 축 · 툴팁 · 범례 · 접근성을 정한다

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)에서 정했다 — 색 없는 항목은 쓰지 않은 색부터(9A — 회색은 "기타" 전용), 추이 차트는 이중 축 유지(10A — 눈금 글자는 계열 색), 선 · 막대 범례는 차트 위 지표 타일(11A — 점 + 이름 + 합계, 바탕 `chart-*-subtle`, 누르면 계열 켜고 끔). 그리고 "따라오는 것" — 축 글자 11 `fg-neutral-subtle` · 가로 점선 격자 `stroke-neutral-subtle` · 툴팁 `bg-layer-floating` · s3 · 모서리 12 · "■ 라벨 값" · 도넛 범례는 카테고리 목록 + 금액 "원" · 오늘 뒤 날짜 안 그림 · 음수 축 글자 안 잘림 · `role="img"` + 요약 이름 · 범례 목록이 대체 · 모션 줄이기면 바로 · 빈 · 실패는 작은 Result Section · 열지도 글자 4.5. 회색(9B) · 색 필수(9C) · 축 하나(10B) · 차트 둘(10C) · 아래 점 범례(11B)는 고르지 않았다. 스펙을 쓰다 나온 것(같은 비교 페이지 19) — 열지도 칸의 돈은 칸 폭 112 이상에서만 원까지, 좁으면 세기 색만(19B — 값은 툴팁 · 표로 보기, 글자를 줄여 맞추지 않는다). 늘 색만(19A) · 축처럼 줄여 쓰기(19C)는 고르지 않았다. 구현을 앞두고 나온 것(같은 비교 페이지 22) — 가장 큰 칸에 고리를 두르지 않는다(22A — 지금 웹의 고리는 칸 색에 묻히고 포커스 링과 겹친다). 고리 있음(22B)은 고르지 않았다. 따라오는 것으로 — 세기 다섯(초안의 넷을 지금 제품대로 바로잡음) · 툴팁은 넓은 칸에서도 · 화살표 키로 칸을 옮긴다. 옛 스펙은 `chart.history/v-pre-seed-data.*` 에 남겼다.

**옛 스펙 안의 어긋남을 걷었다** — 배정 순서가 규칙(v110 순서)과 "분배 권장"(옛 red → green → blue …) 두 벌이었다. "모든 차트 색은 흰 글자와 4.5:1" 은 다크에서 틀렸다 — 800-dark 위 흰 글자는 2.4 안팎이다(v110). 차트 색 위에 글자를 얹으면 `fg-neutral-inverted`(Avatar 이니셜과 같다)다. Layout 예시(HR 부서별 인원 · 직급 도넛 · 연간 출근율 · RadialBar KPI)는 제품에 없었다. 툴팁 모서리 4 · 테두리 · 아래 점 범례 · 16:9 · 툴팁 표시 세 가지(점 · 선 · 점선)를 걷었다.

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트 · 코드로 봤다).

- **차트 색이 세 제품 세 벌** — 웹은 10-06 토큰 가져오기로 v110 이 들어왔다(`shared/styles/porest-tokens.css:263-282 · 1002-1011`). 앱은 옛 v21 상수(`app/theme/colors.dart:69-89` · `core/format/chart_palette.dart` — 빨강 #C73838 · 다크 #ECA0A0)라 "식비" 가 웹 #BE490D / #FF8758 · 앱 #B36418 / #E8B266 이다(D3). HR 은 recharts 데모 색(#0088FE · #00C49F · #FFBB28 · #FF8042 · #8884D8 — `features/vacation-history/ui/VacationTypeStatsContent.tsx:8-23`) 고정이라 흰 바탕 1.69 ~ 3.53, 다크에서도 격자 #CCCCCC · 축 #888888(3.54)이다(`MonthVacationStatsContent.tsx:56-87`, D7). 앱 · HR 을 v110 으로 — HR 휴가 유형은 차트 색 이름에 잇는다.
- **순번 색이 저장된 색과 부딪친다** — 색 없는 카테고리(구독)에 7번째 순번 색(빨강)을 줘 저장된 빨강(경조사)과 겹친다 — 홈 · 통계 도넛에 #D72323 조각이 둘(`pages/dashboard/ui/DashboardPage.tsx:339-346` · `pages/stats/ui/StatsPage.tsx:265-272` · 앱 `features/dashboard/presentation/dashboard_screen.dart:961-971`, D4). 10개를 넘으면 순번이 한 바퀴 돌아 회색이 일반 조각에 간다. `assignChartColors` 로.
- **이름 없는 차트** — recharts 3.8 기본값으로 모든 차트 SVG 가 `role="application"` · `tabindex=0` 인데 이름 · `<title>` · 대체 글 · 초점 링이 0 이다(웹 · HR). 앱 차트 파일 5개는 `Semantics(` 0(D8). `role="img"` + 요약 이름으로.
- **모션 줄이기 무시** — 공용 `Donut` 과 예산 막대가 `isAnimationActive` 를 참으로 박았다(`shared/ui/porest/charts.tsx:671` · `pages/budget/ui/BudgetPage.tsx:1191`, D11). 렌더로 확인 — 줄이기 상태에서도 조각이 120ms 사이에 바뀐다. 기본 `"auto"` 로.
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
- **쓰지 않는 것** — 웹 손 SVG `LineChart` · `BarChart`(`shared/ui/porest/charts.tsx:89-569`)는 쓰는 곳이 0 이다(D29). `chart-palette.ts` 머리 주석의 "base hex" 가 옛 값이다(`shared/lib/porest/chart-palette.ts:1-13`, D32).
