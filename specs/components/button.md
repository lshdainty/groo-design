# Button

> 명확한 액션을 쉽게 실행하게 돕는 기본 인터랙션 컴포넌트입니다. 폼 제출 · 대화상자 닫기 · 다음 단계처럼 사용자가 무엇을 하는지 분명한 동작에 씁니다.

크기 4 · 배치 2 · 변형 7 · 상태 6 으로 이뤄집니다.

수치 원본은 [`button.yaml`](button.yaml)입니다.

[그림: 변형 일곱 가지 — 위는 라이트, 아래는 다크](../../site/components/specs/button.tsx#hero)

### 직접 골라 보기

변형 · 크기 · 배치 · 상태를 고르면 스펙대로 그린 버튼과 그 코드가 바뀝니다. 버튼은 실제로 눌러 볼 수 있습니다(호버 · 누름 · Tab 포커스).

[그림: 플레이그라운드](../../site/components/specs/button.tsx#playground)

## Anatomy

[그림: Button 은 Label 을 감싼 Container 로 이뤄지고, 앞 · 뒤 아이콘을 가질 수 있습니다 — 부위를 보이려고 앞 · 뒤 아이콘을 함께 그렸습니다(실제로는 함께 쓰지 않습니다)](../../site/components/specs/button.tsx#anatomy)

| ⓐ Container | 배경 · 테두리 · 모양입니다. 글자와 아이콘은 이 색(currentColor)을 따릅니다. |
| ⓑ Prefix Icon | 라벨 앞 아이콘 — 동작의 뜻을 돕습니다. 선택입니다. |
| ⓒ Label | 무엇을 하는지 동사로 씁니다. 한 줄입니다(`white-space: nowrap`). |
| ⓓ Suffix Icon | 라벨 뒤 아이콘 — chevron 처럼 동작을 돕습니다. 선택입니다. |
| ⓔ Focus ring | 키보드 포커스에만 2px 링 · 2px 띄움을 그립니다. |

[표: 부위](button.yaml#slots)

## Properties

### Size

네 가지입니다. **크기는 이름이 아니라 높이로 고릅니다.**

- `small`(36) · `medium`(40) — 화면 안에서 두루 씁니다. 모달 footer 는 `small` 입니다.
- `large`(48) — CTA 입니다. 모바일 하단 고정 버튼 · 모바일 모달 footer 에 씁니다.
- `xsmall`(32) — 좁은 자리에서 쓰는 알약 모양입니다.

[그림: 크기 네 가지 — 높이 32 · 36 · 40 · 48](../../site/components/specs/button.tsx#sizes)

[그림: 크기마다의 치수 — 좌우 여백 · 아이콘과 글자 사이 · 높이](../../site/components/specs/button.tsx#size-spec)

누르는 영역은 보이는 크기와 따로 가로 · 세로 44 까지 넓힙니다. 44 는 반드시 지킵니다.

[그림: 보이는 크기가 44 보다 작아도 누르는 영역(분홍)은 44 입니다](../../site/components/specs/button.tsx#hit-area)

[표: 크기](button.yaml#size)

글자와 함께 쓸 때(`withText`):

[표: 크기별 여백 · 글자 · 아이콘 — 글자](button.yaml#grid.size.layout.withText)

아이콘만 쓸 때(`iconOnly`):

[표: 크기별 여백 · 아이콘 — 아이콘만](button.yaml#grid.size.layout.iconOnly)

모든 조합에 공통인 값:

[표: 공통](button.yaml#base)

### Layout

라벨과 아이콘의 조합입니다 — 글자만 · 앞 아이콘 + 글자 · 글자 + 뒤 아이콘 · 아이콘만.

[그림: 배치 네 가지](../../site/components/specs/button.tsx#layouts)

- **앞 · 뒤 아이콘을 함께 쓰지 않습니다.** 앞은 동작의 뜻을 돕고(추가의 `+`), 뒤는 동작을 돕습니다(다음의 chevron).
- 아이콘은 꼭 필요할 때만 씁니다 — 많으면 라벨을 읽기 어려워집니다.
- **아이콘만**은 아이콘만으로 뜻을 전해 접근성이 떨어집니다. 꼭 필요할 때만 쓰고, 이름(`aria-label` 또는 옆 Tooltip)을 반드시 답니다. 정사각이고, 아이콘 버튼의 보이는 크기 기본은 `medium`(40)입니다.
- **상단 바의 아이콘 버튼은 이 Button 이 아닙니다** — [Top Navigation](top-navigation.md) 의 아이콘 버튼(상자 44 = 누르는 영역 · 아이콘 24 · 버튼끼리 붙음)입니다. 본문 안의 아이콘 버튼은 그대로 `medium` · `iconOnly`(40 · 18)입니다.

### Variant

일곱 가지입니다. 화면에서 강조하려는 정도에 따라 고릅니다.

[그림: 변형 일곱 가지 — 라이트는 흰 표면, 다크는 다크 표면 위](../../site/components/specs/button.tsx#variants)

| 변형 | 생김새 | 쓰는 곳 |
|---|---|---|
| `brandSolid` | 브랜드 색 채움 | 서비스의 핵심 액션 하나 — Desk "거래 추가", HR "휴가 신청". 한 화면에 하나 |
| `neutralSolid` | 짙은 회색 채움 | 대부분의 CTA — 저장 · 확인 · 다음. 한 화면에 하나 |
| `criticalSolid` | 빨강 채움 | 삭제 · 초기화처럼 되돌릴 수 없는 작업의 **확정**. 주로 [Alert Dialog](alert-dialog.md) |
| `neutralWeak` | 옅은 회색 채움 | CTA 를 뺀 대부분의 액션. CTA 옆에서는 보조(취소 · 닫기) |
| `brandOutline` | 테두리 + 브랜드 글자 | Solid 보다 낮은 위계. Solid 와 함께 쓰지 않고 `neutralOutline` 과 짝 |
| `neutralOutline` | 테두리 + 본문 글자 | 가장 낮은 위계의 보조 액션. Solid 와 함께 쓰지 않고 `brandOutline` 과 짝 |
| `ghost` | 배경 없음 | 메뉴 · 툴바 · 목록 행의 가벼운 액션. 글자색을 바꿀 수 있습니다(아래) |

[표: 변형별 색](button.yaml#grid.variant)

`ghost` 는 글자색을 바꿀 수 있습니다 — 배경 · 누름은 그대로입니다.

[그림: ghost 글자색 네 가지](../../site/components/specs/button.tsx#ghost-colors)

| `ghostColor` | 쓰는 곳 |
|---|---|
| `neutral`(기본) | 대부분의 ghost |
| `neutralSubtle` | 목록 행 · 툴바의 보조 아이콘 액션, 가장자리 텍스트 버튼(flush) |
| `brand` | 강조하는 가벼운 액션 — 본문 속 "자세히 보기" |
| `critical` | 확인 창을 여는 **삭제** — 모달 footer · 시트 바닥 왼쪽. 확정은 확인 창의 `criticalSolid` |

[표: ghost 글자색](button.yaml#compound)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 기본 |
| `hovered` | 웹. 누름 색과 같고, 축소는 없습니다 |
| `focused` | 웹 · 앱. 키보드 포커스에만 링 2px · 띄움 2px. 앱은 키보드로 옮길 때만 그리고 손가락으로 누를 때는 그리지 않습니다 |
| `pressed` | 누름 색 + 세로 2px 거리 축소(기초 Feedback 의 눌림 피드백) |
| `loading` | 누름 색 위 로딩 원. 라벨 자리는 그대로(폭 유지) |
| `disabled` | 전용 색(`bg-disabled` · `fg-disabled`). 불투명도로 흐리게 하지 않습니다 |

[그림: 변형 × 상태 — 호버 · 포커스 · 누름은 그 순간을 멈춰 그렸습니다](../../site/components/specs/button.tsx#states)

[표: 변형별 상태 변화](button.yaml#states.variant)

**로딩**

- `loading` 이면 로딩 원(크기는 Size 표)을 라벨 자리 가운데 둡니다. 라벨은 글자 · 아이콘 색만 투명하게 해서 버튼 폭이 그대로입니다 — 버튼이 자식을 따로 감싸지 않으므로 부르는 쪽의 `[&>span]` · `[&>svg]` 규칙이 그대로 먹습니다.
- 로딩 중에는 **누르기를 자동으로 막습니다**(두 번 제출 방지) — 포인터 · Enter · Space 누르기를 삼키고(`onClick` 을 부르지 않습니다), 누름 축소도 없습니다. 포커스는 그대로 두고 `aria-busy="true"` 를 답니다.
- 로딩 원 색은 변형마다 다릅니다(Solid 는 흰 원, Brand Outline 은 옅은 브랜드 트랙 위 브랜드 선 색 `stroke-brand-solid` — Progress Circle brand 톤과 같고 다크에서는 밝은 짝, 나머지는 회색 트랙 위 본문색).

[그림: 직접 눌러 보기 — 위는 누름 · 호버 · 키보드 포커스(Tab), 아래는 누르면 잠시 로딩이 됩니다](../../site/components/specs/button.tsx#live-states)

### Width

- **내용 맞춤**(기본) — 라벨 길이만큼입니다.
- **채움** — 컨테이너 폭을 채웁니다(`w-full`). 모바일 하단 고정 CTA · 폼의 마지막 제출에 씁니다.
- 최소 너비는 두지 않습니다. 둘을 나란히 채울 때는 비율로 나눕니다(아래 배치).

[그림: 내용 맞춤(Hug)과 채움(Fill)](../../site/components/specs/button.tsx#width)

## Guidelines

### Hierarchy

시각적 주목도는 배경 대비로 정해집니다. 화면에서 강조하려는 정도에 따라 변형을 고릅니다.

[그림: 강 · 중 · 약 — 대비가 강한 배경일수록 먼저 눈에 들어옵니다](../../site/components/specs/button.tsx#hierarchy)

| 강조 | 변형 | 화면 안 개수 | 쓰는 곳 |
|---|---|---|---|
| **강** — 대비가 강한 배경 | `brandSolid` · `neutralSolid` · `criticalSolid` | 1개 | 가장 중요한 CTA |
| **중** — 대비가 약한 배경 | `neutralWeak` | 여러 개 | 대부분의 액션, 강 버튼과 짝 |
| **약** — 투명한 배경 | `brandOutline` · `neutralOutline` · `ghost` | 여러 개 | 중요도가 낮은 보조 액션 |

### 상황에 따라 알맞은 변형 쓰기

화면 안의 중요도에 따라 고릅니다. 같은 저장이라도 그 화면의 CTA 면 `neutralSolid`, 서비스의 중심 동작이면 `brandSolid` 입니다.

[그림: 변형마다 쓰는 자리 — 핵심 액션 · 대부분의 CTA · 되돌릴 수 없는 확정 · 여러 번 나오는 보조 액션](../../site/components/specs/button.tsx#usage)

### 브랜드 색은 꼭 필요한 곳에만

브랜드 색은 로고 · 대표 버튼 · 핵심 메시지 같은 브랜드 상징에 모아 씁니다. 많이 쓰면 뜻과 강조가 흩어집니다.

- `brandSolid` 는 **서비스의 중심 동작 하나**에만 씁니다 — Desk "거래 추가", HR "휴가 신청"처럼. 어떤 화면이 여기에 드는지는 화면마다 정합니다.
- 저장 · 확인 · 다음 같은 대부분의 CTA 는 `neutralSolid` 입니다.

[그림: 브랜드 색은 한 화면에 하나 — 나머지는 중립색](../../site/components/specs/button.tsx#brand-color)

### 예외 — 증권 매매 단추

증권 종목 상세의 [매도] · [매수] 한 쌍만 국내 통념을 따릅니다 — [매도] `brandSolid`(파랑) · [매수] `criticalSolid`(빨강), `large` 한 줄에 반씩 · 사이 8. 국내 증권 앱 사용자가 매수 빨강 · 매도 파랑을 이미 익혀 있어 그 기대를 지킵니다. 이 자리에서 `criticalSolid` 는 "되돌릴 수 없는 확정" 이 아니고 `brandSolid` 는 "서비스의 중심 동작" 이 아닙니다 — 이 한 쌍 밖으로 넓히지 않습니다.

### 버튼 조합

- **Solid 조합** — `neutralWeak` + `neutralSolid`(또는 `brandSolid`). 위계가 분명하고 부담이 적습니다.
- **Outline 조합** — `neutralOutline` + `brandOutline`. 강조가 낮은 보조 액션을 한 화면에 여러 번 둘 때 씁니다.
- Outline 은 Solid 와 함께 쓰지 않습니다.

[그림: Solid 조합 — 옅은 회색(보조) + 짙은 회색 · 브랜드(CTA)](../../site/components/specs/button.tsx#combo-solid)

[그림: Outline 조합과 섞지 말아야 할 조합](../../site/components/specs/button.tsx#combo-outline)

### 버튼 배치

- 닫기 · 초기화처럼 Dismiss 뜻의 `neutralWeak` 와 CTA 를 나란히 채울 때는 **3:7** 로 나눕니다 — 위계가 분명해집니다. 모달 footer 는 [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md) 의 폭 나누기(균등)를 따릅니다.
- 비슷한 위계의 `neutralWeak` 둘은 나란히 둘 수 있습니다.
- **셋 이상 나란히 두는 것은 피합니다** — 중요도가 비슷해 보여 고르기 어렵고, 큰 글자에서 라벨이 잘립니다. 더 있으면 아이콘만 버튼(더보기)으로 넘깁니다.
- 인접한 버튼 사이는 8(`spacing-x2`)입니다.

[그림: 3:7 — Dismiss 와 CTA 를 화면 하단에 채울 때](../../site/components/specs/button.tsx#placement)

[그림: 나란히 둘 수 있는 것과 없는 것](../../site/components/specs/button.tsx#side-by-side)

**놓는 바탕** — `neutralWeak` 의 채움과 비활성 채움(`bg-disabled`)은 라이트에서 회색 바닥(`bg-layer-basement`)과 같은 색(gray-200)입니다. 흰 표면(카드 · 흰 띠 · 흰 화면 · 시트 · 모달 — `bg-layer-default` · `bg-layer-floating`) 위에 두고, 회색 바닥에 바로 둘 땐 `neutralOutline` 을 씁니다 — 바닥 위의 `neutralWeak` 는 채움이 사라져 글자만 남습니다(1.00:1). 데스크톱 화면 제목 줄의 버튼이 그 자리입니다. 기초 규칙은 DESIGN.md Elevation 의 "바닥 위의 채움" 입니다.

[그림: neutralWeak 를 놓는 바탕 — 라이트에서만 생기는 문제라 라이트로 그렸습니다](../../site/components/specs/button.tsx#surface)

**모달 footer**

- 오른쪽에 `[취소 neutralWeak] [저장 neutralSolid]` 를 둡니다 — 웹은 `small`(36), 모바일 전체 폭은 `large`(48)입니다.
- 확인 창을 여는 **삭제**는 왼쪽에 `ghost` + `critical` 글자로 둡니다. 삭제의 **확정**은 [Alert Dialog](alert-dialog.md) 의 `criticalSolid` 입니다.
- 1280 미만 [Bottom Sheet](bottom-sheet.md) 바닥도 같은 꼴입니다 — [삭제] 는 왼쪽 `ghost` + `critical`(`large` · 글자만큼의 폭), 주 버튼([저장] · [수정])이 남은 폭을 채웁니다.
- 목록 줄을 눌러 들어간 화면(상세 · 수정)에서 동작이 삭제 하나뿐이면 이 바닥 왼쪽 [삭제] 로 둡니다 — 머리 ⋮ 는 동작이 여럿일 때입니다([Menu](menu.md) 의 "줄의 동작").
- 모달 footer 의 버튼을 `neutralOutline` 둘로 두지 않습니다 — 전체 폭 버튼 둘이 테두리로 서면 위계가 흐려집니다.

[그림: Desk 웹의 모달 footer — 상세(삭제 · 수정)와 편집 폼(취소 · 저장)](../../site/components/specs/button.tsx#modal-footer)

### 라벨

기초 Writing 을 따릅니다 — 사용자가 할 행동을 동사로, 해요체 없이 짧게, 마침표 없이 씁니다.

- "다음" 보다 "저장" · "주문 확인"처럼 무엇을 하는지 알게 씁니다.
- 같은 동작에는 같은 말을 씁니다.

[그림: 라벨은 사용자가 할 행동으로](../../site/components/specs/button.tsx#label)

### 긴 라벨

긴 라벨 · 번역 · 큰 글자로 나란한 두 버튼이 넘치면 **세로로 쌓습니다**(주 버튼이 위). 한 줄에 억지로 줄이지 않습니다.

짝 버튼은 어느 한 버튼의 라벨이 짝 폭의 절반을 넘으면 둘 다 세로로 쌓고, 라벨은 한 줄을 지킵니다(버튼 안에서 줄을 바꾸지 않습니다). 그래서 글자 크기 200% 에서는 가장 긴 라벨이 한 줄을 지키느라 버튼 밖으로 넘칠 수 있습니다(약 170).

**날짜 기간이 든 라벨도 한 줄입니다.** 통계 기간 버튼처럼 라벨이 날짜 기간이면 줄을 바꾸지 않고 날짜를 줄입니다 — 해가 다른 직접 기간은 점 · 두 자리 연도 "25. 11. 10.~26. 11. 10."(영어 "Nov 10, '25–Nov 10, '26" — en dash 앞뒤를 붙입니다)입니다. 네 자리 점 표기("2025. 11. 10.~2026. 11. 10.")는 큰 글자에서 버튼이 화면 밖으로 나가고, 두 줄로 바꾸면 버튼 높이가 바뀌기 때문입니다. 표기는 DESIGN.md International Design 의 "날짜" 를 따릅니다.

**큰 글자에서 높이** — 크기마다의 높이(32 · 36 · 40 · 48)는 최소 높이입니다. 글자가 커져 라벨이 상자보다 높아지면 상자가 글을 따라 커지고 글을 자르지 않습니다(앱 200% 에서 36 · 40 · 48 → 54 · 58 · 72, 100% 는 그대로). 웹은 높이가 rem 이라 이미 그렇습니다. 칩과 같은 규칙입니다. 같은 200% 에서 웹(72 · 80 · 96)이 앱보다 큽니다.

이 판정은 부품 하나가 맡습니다 — 웹 `ResponsivePair` · 앱 `PResponsivePair`(자식 둘 — 보조 버튼 · 주 버튼 순서, 쌓이면 주 버튼이 위). 시트 · 확인창 바닥의 짝 버튼도 이 부품을 씁니다 — 같은 판정을 바닥마다 따로 적지 않습니다.

[그림: 넘칠 땐 세로로](../../site/components/specs/button.tsx#long-label)

### 아이콘

아이콘은 버튼의 동작을 눈으로 보이게 돕습니다. 앞(Prefix)은 액션의 뜻을, 뒤(Suffix)는 chevron 처럼 동작을 돕습니다. 라벨을 읽기 어려워지지 않게 꼭 필요할 때만 쓰고, 앞 · 뒤를 함께 쓰지 않습니다.

[그림: 아이콘을 쓰는 자리와 쓰지 말아야 할 자리](../../site/components/specs/button.tsx#icon)

### 로딩

저장처럼 시간이 걸리는 액션은 누른 버튼을 로딩으로 바꿉니다. 라벨을 바꾸거나 비활성으로 돌리지 않습니다.

`loading` 은 `disabled` 보다 먼저입니다 — 저장 중에 부르는 쪽이 버튼을 막아도(폼 검사가 다시 돌아 `disabled` 가 켜져도) 누름 색 위 로딩 원을 보입니다. 막힌 모양으로 바뀌면 저장이 멈춘 것처럼 읽히기 때문입니다.

[그림: 로딩은 그 자리에서 — 폭은 그대로](../../site/components/specs/button.tsx#loading)

## Button 과 Chip

Button 은 액션을 실행합니다. 선택 · 필터는 [Chip](chip.md)(같은 내용을 2 ~ 4가지로 바로 다르게 보면 [Segmented Control](segmented-control.md))이 맡습니다.

| | Button | Chip |
|---|---|---|
| 목적 | 액션 실행 | 정보 표현 + 선택 |
| 예 | 완료 · 제출 · 다음 · 삭제 | 필터(서초4동 외 34) · 옵션(0 ~ 6개월) |
| 라벨 | 보면 동작을 예상할 수 있음 | 지금 켜진 조건 · 정보 |
| 쓰는 모양 | 하나로도 | 둘 이상 묶어서 |

[그림: Button 은 실행, 고르기는 지금 켜진 조건](../../site/components/specs/button.tsx#chip)

## 반반 바 · 가장자리 맞춤

**반반 바(split bar)** — 액션 **둘**이 무게가 같고 한 묶음으로 읽힐 때, 본문 폭을 채운 네모 바를 반으로 갈라 각 칸에 하나씩 둡니다(예: 내역 분할의 `항목 추가` · `균등 분할`).

- 컨테이너: `display:flex; width:100%; background:var(--color-bg-layer-basement); border:1px solid var(--color-stroke-neutral-weak); border-radius:var(--radius-r2); overflow:hidden`.
- 각 칸: `flex:1` 의 `ghost` 버튼, 모서리 없음(컨테이너가 깎습니다).
- 칸 사이는 1px `stroke-neutral-weak` 구분선을 **글자 높이만큼만** 긋습니다 — 끝까지 그으면 두 칸이 벽으로 막힌 것처럼 보입니다.
- **얇게 — `xsmall` 높이(32).** 목록에 줄을 더하는 성격이라 본문 행보다 무거우면 안 됩니다. 알약 모양은 쓰지 않습니다(segmented 와 헷갈립니다).
- **선택이 아니라 실행입니다.** 눌린 상태(`data-state=on`)가 없습니다. 셋 이상으로 나누지 않습니다.

[그림: 반반 바 — 내역 분할의 항목 추가 · 균등 분할](../../site/components/specs/button.tsx#split-bar)

**가장자리 맞춤(flush)** — 버튼의 한쪽 가로 여백을 없애 컨테이너 가장자리 선에 맞춥니다.

- `flush="left" | "right"` — 그 방향 가로 여백을 0 으로 합니다.
- 대상: `ghost` + 앞 아이콘이 컨테이너 가장자리의 첫 · 끝 요소일 때입니다. 글자만 있는 ghost 에는 쓰지 않습니다.
- flush ghost 는 **텍스트 버튼**입니다 — 누름 · 호버에 배경을 깔지 않고 글자색으로만 반응합니다(`neutralSubtle` → 누르면 `fg-neutral`). 한쪽 여백만 0 이라 채움 상자가 좌우 비대칭이 되기 때문입니다.
- 그래서 flush 는 `ghostColor` 를 덮습니다 — 빨간 글자를 지켜야 하는 삭제(`critical`)에는 쓰지 않습니다.
- **아이콘만 있는 단추(`iconOnly`)는 여백을 0 으로 하지 않고 상자째 번집니다** — 줄의 첫 · 끝에 선 아이콘 단추(달 줄의 ‹ › · 줄 끝 닫기)는 상자를 바깥으로 (상자 − 아이콘) ÷ 2 만큼 내어(음수 여백) 아이콘이 화면 여백 선에 닿게 합니다 — small 36 · 아이콘 16 이면 10, 앱 40 · 아이콘 18 이면 11. 상자가 대칭으로 남으므로 누름 · 호버 바탕은 보통 단추처럼 깝니다. 누르는 영역 44 도 같이 번집니다(줄 안이면 [List](list.md) 의 "줄 끝 작은 버튼" 처럼 줄보다 이깁니다). 번지지 않으면 아이콘이 여백 선 안쪽으로 10 남짓 들어가 글 · 목록 줄과 왼쪽 · 오른쪽 선이 어긋나기 때문입니다.

[그림: 가장자리 맞춤 — 앞 아이콘이 목록의 왼쪽 선(분홍)에 맞습니다](../../site/components/specs/button.tsx#flush)

## 코드

레시피 `recipes/shadcn/components/ui/button.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

레시피의 cva 는 groo 스케일 이름(`text-t4` · `px-x4` · `rounded-r2`)을 씁니다. 기본 tailwind-merge 는 `text-t4` 를 글자색으로 읽어 앞의 `text-fg-neutral-inverted` 를 지우고(짙은 버튼의 흰 글자가 사라집니다), `px-x4` 를 여백으로 읽지 못해 `p-0` 덮어쓰기가 먹지 않습니다. 레시피 `lib/utils.ts` 처럼 spacing · radius · text 스케일을 `extendTailwindMerge` 에 등록합니다.

### 기본

[그림: 기본 — neutralSolid · medium](../../site/components/specs/button.tsx#ex-basic)

```tsx
import { Button } from "@/components/ui/button"

<Button>저장</Button>
```

### 변형

[그림: 변형](../../site/components/specs/button.tsx#ex-variants)

```tsx
<Button variant="brandSolid">거래 추가</Button>
<Button variant="neutralSolid">저장</Button>
<Button variant="neutralWeak">취소</Button>
<Button variant="criticalSolid">삭제</Button>
<Button variant="brandOutline">자세히</Button>
<Button variant="neutralOutline">건너뛰기</Button>
<Button variant="ghost">더보기</Button>
```

### 크기

[그림: 크기](../../site/components/specs/button.tsx#ex-sizes)

```tsx
<Button size="xsmall">라벨</Button>
<Button size="small">라벨</Button>
<Button size="medium">라벨</Button>
<Button size="large">라벨</Button>
```

### 아이콘

[그림: 아이콘](../../site/components/specs/button.tsx#ex-icons)

```tsx
import { ChevronRight, Plus, Search } from "lucide-react"

<Button variant="brandSolid"><Plus />거래 추가</Button>
<Button variant="neutralWeak">전체 보기<ChevronRight /></Button>
<Button variant="ghost" ghostColor="neutralSubtle" layout="iconOnly" aria-label="검색">
  <Search />
</Button>
```

### ghost 글자색

[그림: ghost 글자색](../../site/components/specs/button.tsx#ex-ghost)

```tsx
<Button variant="ghost">편집</Button>
<Button variant="ghost" ghostColor="neutralSubtle">더보기</Button>
<Button variant="ghost" ghostColor="brand">자세히 보기</Button>
<Button variant="ghost" ghostColor="critical">삭제</Button>
```

### 비활성 · 로딩

[그림: 비활성 · 로딩 — 오른쪽을 눌러 보면 잠시 로딩이 됩니다](../../site/components/specs/button.tsx#ex-states)

```tsx
const [saving, setSaving] = useState(false)

<Button disabled>저장</Button>
<Button loading={saving} onClick={async () => { setSaving(true); await save(); setSaving(false) }}>
  저장
</Button>
```

### 채움

[그림: 채움 — 화면 하단 CTA](../../site/components/specs/button.tsx#ex-fill)

```tsx
<Button size="large" className="w-full">저장</Button>
```

### 모달 footer

[그림: 모달 footer — 삭제는 왼쪽, 취소 · 저장은 오른쪽](../../site/components/specs/button.tsx#ex-footer)

```tsx
<footer className="flex items-center gap-2">
  <Button variant="ghost" ghostColor="critical" size="small" className="mr-auto">삭제</Button>
  <Button variant="neutralWeak" size="small">취소</Button>
  <Button size="small">저장</Button>
</footer>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Click / Tap | `onClick` 을 부릅니다. `disabled` · `loading` 이면 무시합니다. |
| 누른 동작이 끝나기 전 | 다시 눌러도 무시합니다 — `onClick` 이 Promise 를 돌려주면 이행 · 거부될 때까지 다음 누름(포인터 · Enter · Space)을 버립니다. 시간 창은 없습니다. 비동기 동작은 Promise 를 돌려줍니다(`mutateAsync`) — 돌려주지 않으면 잠그지 않습니다. 앱은 `Future` 가 끝날 때까지입니다 |
| Keyboard `Enter` · `Space` | 클릭과 같습니다(포커스 상태에서). |
| Keyboard `Tab` | 다음 포커스로 옮깁니다. Shift+Tab 은 거꾸로입니다. |
| `asChild` | `<Slot>` 으로 요소를 바꿉니다(예: `<a>`). `loading` 과 함께 쓰지 않습니다(Slot 은 자식 하나만 받습니다). |
| Disabled | 누르기 · 키보드가 막히고, 포커스에서 빠집니다. |

[그림: 누른 동작이 끝날 때까지 한 번 — 빠르게 여러 번 눌러도(Enter · Space 도) 동작은 한 번만 불리고, 끝나기 전의 누름은 버립니다](../../site/components/specs/button.tsx#press-lock)

**Form 안** — `type="submit"` 을 적어야 제출합니다. `type="button"` 은 제출하지 않습니다.

**앱** — 버튼(`PButton`)도 포커스를 받아 Tab 순서에 듭니다. 하드웨어 키보드로 옮길 때만 웹과 같은 링(2px · 띄움 2px · `stroke-focus-ring`)을 그리고 — Flutter 의 `FocusHighlightMode.traditional` — 손가락으로 누를 때는 그리지 않습니다(DESIGN.md State › 앱의 키보드 포커스).

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** 글자 대비(4.5:1) | 흰 글자 × `bg-brand-solid` · `bg-critical-solid`, `fg-neutral-inverted` × `bg-neutral-inverted`(누름 포함), `fg-neutral` × `bg-neutral-weak` — `npm run lint:all` 의 role 짝이 잽니다 |
| **WCAG 1.4.3** 비활성 | `fg-disabled` — 비활성 컴포넌트 글자는 대비 예외(1.4.3 incidental) |
| **WCAG 1.4.11** UI 대비(3:1) | 포커스 링 `stroke-focus-ring` × 표면. Brand Outline 의 로딩 원 `stroke-brand-solid` × 표면 — 라이트 Desk 8.38 · HR 8.17, 다크 Desk 6.10 · HR 6.07 |
| **WCAG 2.5.8** Target Size — Minimum(AA, 24×24) | 네 크기 모두 통과 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA, 44×44) | 보이는 크기는 `large` 48 만 넘지만, 누르는 영역을 44 까지 넓혀 모두 통과 |
| **WCAG 2.4.7** Focus visible | 키보드 포커스에만 링(`focus-visible`) — 앱도 키보드로 옮길 때만 같은 링 |
| **ARIA** | `<button>` 기본. 아이콘만이면 `aria-label` 필수. 로딩이면 `aria-busy="true"`. `asChild` 로 `<a>` 를 쓸 때 `role="button"` 을 따로 달지 않습니다 |
| **모션 줄이기** | 축소를 하지 않습니다 — 누름은 색으로만 |

## Do / Don't

### ✅ Do

- 강조 버튼(`brandSolid` · `neutralSolid` · `criticalSolid`)은 한 화면에 하나.
- 모달 footer 는 `[취소 neutralWeak] [저장 neutralSolid]`, 삭제는 왼쪽 `ghost` + `critical`.
- 되돌릴 수 없는 작업의 확정은 확인 창의 `criticalSolid`.
- 증권 매매 한 쌍만 예외 — [매도] `brandSolid` · [매수] `criticalSolid`(국내 통념).
- 아이콘만 있는 버튼에는 이름을 답니다.
- 모바일 하단 CTA 는 `large` + 채움 + 안전 영역(`pb-safe`).

### ❌ Don't

- 강조 버튼을 한 화면에 여럿.
- 셋 이상을 한 줄에 — 피하고, 더 있으면 더보기로.
- `brandSolid` 를 일반 저장 · 확인에 — 브랜드 색이 흩어집니다.
- Outline 을 Solid 와 섞기.
- 앞 · 뒤 아이콘을 함께.
- `disabled` 버튼에 호버 · 누름 반응.

## Specification

`button.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 버튼을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — button.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#button)
