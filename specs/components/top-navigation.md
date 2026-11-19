# Top Navigation

> 화면 맨 위의 바(상단 바)입니다. 지금 화면의 이름과 이동(뒤로 · 닫기 · 주 메뉴), 화면의 동작 두셋을 둡니다. 폰(Desk 앱 · Desk 웹 768 미만 · HR 웹 768 미만)의 모든 화면과 데스크톱(768 이상)의 머리에 씁니다.

타입은 앱의 최상위 탭에서 쓰는 **Root** 와 그 아래 화면에서 쓰는 **Standard**, 그리고 같은 규칙으로 만든 데스크톱 머리 **Desktop** 입니다. 바에는 왼쪽(뒤로 · 닫기) · 가운데(제목) · 오른쪽(아이콘 · 글 버튼) 세 자리가 있습니다. 다른 이동 부품([Bottom Navigation](bottom-navigation.md) · [Side Navigation](side-navigation.md) · [Side Panel](side-panel.md) · [Tabs](tabs.md))과 고르는 표는 DESIGN.md Layout 의 "이동 부품 고르기" 에 있습니다.

수치 원본은 [`top-navigation.yaml`](top-navigation.yaml)입니다.

[그림: 홈(Root) · 알림(Standard) · 가계부 데스크톱 머리 — 라이트 · 다크](../../site/components/specs/top-navigation.tsx#hero)

### 직접 골라 보기

타입(Root · Standard · 데스크톱 머리), 왼쪽 버튼(← · ✕ · ☰), 오른쪽(아이콘 0 ~ 3 · 글 버튼), 알림 점, 제목 길이를 바꾸면 바와 코드가 함께 바뀝니다. 제목을 길게 하면 오른쪽 자리 앞 8 에서 말줄임됩니다.

[그림: 플레이그라운드](../../site/components/specs/top-navigation.tsx#playground)

## Anatomy

[그림: 바는 왼쪽 자리 · 제목 · 오른쪽 자리로, 아이콘 버튼 상자 44 가 화면 끝에서 6 · 버튼끼리 붙습니다](../../site/components/specs/top-navigation.tsx#anatomy)

| ⓐ Root | 바 — 화면 폭 · 높이 56 입니다. 위 안전 영역만큼 높아지고 바탕은 화면 끝까지 칠합니다. 스크롤해도 맨 위에 그대로 있습니다. |
| ⓑ Leading | 왼쪽 자리 — Standard 에만 있습니다. ← · ✕ · ☰ 아이콘 버튼 하나를 둡니다. |
| ⓒ Title | 제목 — 화면 이름 한 줄(`h1`)입니다. 넘치면 말줄임합니다. |
| ⓓ Trailing | 오른쪽 자리 — 아이콘 버튼 2개를 권장하고 3개까지 두거나, 글 버튼 하나를 둡니다. |
| ⓔ Icon Button | 아이콘 버튼 — 상자 44 가 누르는 영역이고 아이콘은 24 입니다. 버튼끼리 붙습니다. |
| ⓕ Notification | 알림 점 — 벨 아이콘 오른쪽 위의 6 점입니다. |

[표: 부위](top-navigation.yaml#slots)

## Properties

### Type

| 타입 | 쓰는 화면 | 왼쪽 | 제목 | 오른쪽 |
|---|---|---|---|---|
| `root` | 탭 첫 화면(홈 · 가계부 · 캘린더 · 전체) | 없음 | 큰 제목 22 / 30 · 화면 끝에서 16 | 아이콘 버튼 |
| `standard` | 그 아래 화면 · HR 폰의 모든 화면 | ← · ✕ · ☰ | 18 / 24 · 화면 끝에서 56 | 아이콘 버튼 또는 글 버튼 하나 |
| `desktop` | 데스크톱(768 이상)의 머리 — Desk | 검색칸 — 거래 검색 화면의 입구 | 없음 — 본문 맨 위 `h1` | 주 버튼 하나 + 아이콘 버튼 둘(알림 · 설정) |

탭 첫 화면은 큰 제목으로 "이 탭의 맨 위" 를 보이고, 그 아래 화면은 ← 와 작은 제목을 둡니다. 제목은 늘 왼쪽에 둡니다 — 가운데 제목(iOS 식)은 두지 않습니다. 굵기는 둘 다 700 입니다.

[그림: 타입 — Root 큰 제목 · Standard ← + 제목 + 글 버튼 · 데스크톱 머리](../../site/components/specs/top-navigation.tsx#types)

[표: 타입](top-navigation.yaml#type)

### 제목

제목은 한 줄입니다. 길면 말줄임(…)하고, 오른쪽 자리 앞 8 을 늘 비웁니다. 글자 크기 설정을 1.2배까지 따르고, 더 커져도 바 높이를 넘지 않습니다. 제목은 화면의 `h1` 입니다 — 화면을 옮기면 초점이 이 제목으로 옵니다(아래 "화면을 옮길 때").

[그림: 제목 — 왼쪽 16 · 56, 긴 제목은 오른쪽 자리 앞 8 에서 말줄임](../../site/components/specs/top-navigation.tsx#title)

[표: 제목](top-navigation.yaml#base.enabled@title)

### 아이콘 버튼

상자 44 가 곧 누르는 영역이고 아이콘은 24 입니다. 맨 끝 버튼의 상자는 화면 끝에서 6(아이콘은 16)이고, 버튼끼리는 붙습니다(아이콘 중심 간격 44). 본문 안의 아이콘 버튼([Button](button.md) `medium` · `iconOnly` — 보이는 40 · 아이콘 18)과는 다른 부품입니다. 바탕은 누를 때와 마우스를 올릴 때만 보입니다. 아이콘은 lucide 선 아이콘을 씁니다.

[그림: 아이콘 버튼 — 상자 44 · 아이콘 24 · 화면 끝 6 · 붙은 버튼, 본문 Button 40 · 18 과 나란히](../../site/components/specs/top-navigation.tsx#icon-button)

[표: 아이콘 버튼](top-navigation.yaml#base.enabled@iconButton)

### 글 버튼

오른쪽 자리에 하나만 둡니다("완료" · "모두 읽음") — 높이 44 · 좌우 10 · 16 / 22 · 500 입니다. 글 버튼과 아이콘 버튼을 함께 두지 않습니다. 글 버튼에는 최대 폭을 두지 않습니다(제목이 늘 왼쪽이기 때문입니다). 글 버튼 글은 한두 마디로 씁니다 — 큰 글자 · 긴 글 버튼에서 제목이 밀리는 것은 이 쓰기 규칙(아이콘 둘 · 셋까지 · 글 버튼 한두 마디)으로 막고, 제목 최소 폭은 두지 않습니다. 영어 문구도 짧게 씁니다 — "Mark all as read" 가 아니라 "Read all" 입니다.

[표: 글 버튼](top-navigation.yaml#base.enabled@textButton)

### 검색칸

거래 검색 화면의 제목 자리와 데스크톱 머리의 왼쪽 자리에는 검색칸을 둡니다 — [Text Field](input.md) 상자형(`outline`) `medium` 40 · 앞 돋보기 · 지우기 버튼입니다. 바 56 안이라 폰에서도 `medium` 을 씁니다(`large` 52 를 두지 않습니다). 검색 화면에서는 ← 다음 6 에서 시작해 오른쪽 자리 앞 8 까지 늘어납니다 — 화면 이름 대신 칸이 서므로 보이지 않는 `h1` "검색" 을 둡니다. 데스크톱 머리에서는 본문 여백 32 에서 시작하는 폭 360 입니다. 칸 글자는 제목과 같이 글자 크기 설정을 1.2배까지만 따르고, 1.0 아래로는 줄이지 않습니다 — 더 커지면 칸이 바 56 을 넘기 때문입니다.

[그림: 검색칸 — 검색 화면의 제목 자리 · 데스크톱 머리 왼쪽 360](../../site/components/specs/top-navigation.tsx#search-field)

[표: 검색칸](top-navigation.yaml#base.enabled@searchField)

### 왼쪽 버튼

`standard` 의 왼쪽 자리입니다. ← 는 들어온 화면으로 돌아가고, ✕ 는 모달 · 독립 흐름을 닫고, ☰ 는 주 메뉴(왼쪽 [Side Panel](side-panel.md))를 엽니다. ☰ 는 HR 폰에서만 씁니다(Desk 폰은 [Bottom Navigation](bottom-navigation.md)). 아래 "← 와 ✕" · "← 는 어디로" 를 따릅니다.

[표: 왼쪽 버튼](top-navigation.yaml#leadingIcon)

### 알림 점

벨 아이콘에 [Notification Badge](notification-badge.md) small(점 6 · `fg-brand`)을 붙입니다 — 24 아이콘 상자의 x 17 ~ 23 · y 1 ~ 7 자리입니다. 상단 바에는 점만 둡니다 — 숫자 알약(large)은 아이콘 오른쪽으로 자라, 맨 오른쪽 버튼에서 "99+" 가 화면 밖으로 8.5 나가기 때문입니다. 새 알림이 있는지는 버튼 이름에 넣습니다("알림, 새 알림 있음").

[표: 알림 점](top-navigation.yaml#base.enabled@notification)

### 바

높이 56 은 폰 · 데스크톱 모든 화면이 같습니다. 위 안전 영역(상태 표시줄)만큼 바가 높아지고 내용은 그 아래 56 에 놓입니다 — 바탕은 화면 끝까지, 버튼 · 제목은 안전 영역 안에 둡니다(Layout 의 Safe Area). 바탕은 불투명한 `bg-layer-default` 이고, 스크롤해도 선 · 그림자를 긋지 않습니다.

[표: 바](top-navigation.yaml#base.enabled@root)

### Tone — 사진 위 투명 바

`layer`(기본)는 불투명한 `bg-layer-default` 바이고 모든 화면에 씁니다. `transparent` 는 사진이 화면 위를 채우는 상세(맨 위에 꽉 찬 카드 그림 · 사진)에서 사진 위에 겹쳐 두는 투명 바입니다 — 제목 · 아이콘 · 글 버튼이 흰 글자(`static-white`)이고, 막힌 버튼은 `fg-disabled` 그대로입니다. 본문(사진)은 바 아래가 아니라 화면 맨 위(위 안전 영역 포함)에서 시작합니다. 스크롤해 사진이 바 밑으로 지나가면 바탕이 채워집니다 — `layer` 로 바뀌고(바탕 · 글 · 아이콘 색이 150ms 로) 선은 긋지 않습니다.

아래 두 값은 아직 정하지 않은 자리(열린 일)입니다. 맞는 groo 토큰이 없어, 이 톤을 쓰는 화면을 만들 때 함께 정합니다.

- **바 위 막** — 바 위 검정 35%(`#00000059`)에서 아래 투명으로 흐려지고 바 아래로 20 더 내려오는 막을 둘 자리입니다. 막 없이 흰 글자 · 아이콘을 밝은 사진 위에 두면 대비가 모자라므로, 막 없이 쓰는 화면은 글자 대비를 스스로 확보해야 합니다.
- **누름 · 호버 바탕** — 투명도가 있는 누름 바탕이 필요합니다. groo 의 누름 바탕(`bg-layer-default-pressed`)은 불투명이라 사진 위에서 회색 상자가 됩니다 — 정할 때까지 바탕 없이 2px 거리 축소만 합니다.

[표: 톤](top-navigation.yaml#tone)

[그림: 투명 바 — 맨 위 사진 위 · 스크롤하면 바탕이 채워집니다](../../site/components/specs/top-navigation.tsx#transparent)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 버튼 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`, 축소 없음 |
| `pressed` | 상자 바탕 `bg-layer-default-pressed` + 2px 거리 축소 |
| `focused` | 웹 · 앱 — 키보드 포커스에만 상자 안쪽 2px 링(터치에는 없음) |
| `disabled` | 아이콘 · 글 `fg-disabled` — 흐리게 하지 않습니다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 막힘](../../site/components/specs/top-navigation.tsx#states)

[표: 상태 — 아이콘 버튼](top-navigation.yaml#matrix@iconButton)

[표: 상태 — 글 버튼](top-navigation.yaml#matrix@textButton)

[표: 모션](top-navigation.yaml#motion)

## Guidelines

### 탭 첫 화면은 큰 제목, 그 아래는 ← 와 제목

하단 탭의 첫 화면(홈 · 가계부 · 캘린더 · 전체)은 `root` 입니다 — 왼쪽 큰 제목이 있고 뒤로 버튼이 없습니다. 거기서 들어간 화면은 `standard` 입니다 — ← 와 제목을 둡니다. 같은 화면이 어떤 때는 큰 제목, 어떤 때는 ← 로 바뀌지 않게 화면마다 타입을 정해 둡니다. 제목은 짧은 화면 이름입니다 — "알림" · "카드 혜택".

[그림: 홈(Root) → 알림(Standard) — 큰 제목 22 · ← + 18](../../site/components/specs/top-navigation.tsx#type-guide)

### 오른쪽은 둘까지 — 넘치면 ⋯

오른쪽 아이콘 버튼은 2개를 권장하고 3개까지 둡니다. 더 있으면 자주 쓰는 것만 남기고 나머지를 ⋯ 하나에 모읍니다(1280 이상 [Menu](menu.md), 미만 [Menu Sheet](menu-sheet.md) — 이름 "{화면 이름} 더보기"). 글 버튼은 하나만 두고, 아이콘 버튼과 섞지 않습니다. 제목이 오른쪽 자리에 밀려 읽히지 않을 만큼 늘어놓지 않습니다.

[그림: 오른쪽 — 아이콘 둘 · 넷을 늘어놓은 바 · ⋯ 에 모은 바](../../site/components/specs/top-navigation.tsx#trailing-guide)

### Desk 에서는

아래는 부품 규칙이 아니라 Desk 의 화면 배치입니다. 다른 서비스는 위 규칙(오른쪽은 둘까지 · 넘치면 ⋯)만 따릅니다.

#### 탭 첫 화면의 오른쪽 — 홈은 검색 · 알림, 나머지는 검색

Desk 폰(앱 · 웹 768 미만)의 탭 첫 화면은 오른쪽에 홈 = 검색 · 알림, 가계부 · 캘린더 · 전체 = 검색을 둡니다 — 어느 탭에서나 머리에 검색이 있어 탭을 옮기지 않고 검색으로 갈 수 있습니다. 검색은 어느 탭에서 누르든 같은 거래 검색 화면으로 가고, 벨은 알림 화면(`standard` — ← · "알림" · "모두 읽음")으로 갑니다. 웹도 같은 자리입니다. 검색 입구는 거래 검색 화면으로만 이어 둡니다 — "준비 중" 화면으로 가는 입구는 두지 않습니다.

금액 가리기는 탭 첫 화면의 머리에 두지 않습니다 — 홈 · 자산 순자산 카드의 눈이 그 자리입니다. 그 눈은 그 카드가 가려졌는지를 그리고, 누르면 금액 가리기 설정의 그 화면 묶음(홈 · 자산)으로 갑니다. 켜고 끄는 단추가 아닙니다([Toggle](toggle.md) 의 "금액 가리기 눈은 Toggle 이 아닙니다").

[그림: 탭 첫 화면 넷 — 홈 검색 · 알림 · 가계부 · 캘린더 · 전체 검색](../../site/components/specs/top-navigation.tsx#root-guide)

### 거래 검색 화면 — 제목 자리 검색칸 · 숨는 거르는 줄

거래 검색 화면은 `standard` 입니다 — ← · 제목 자리의 검색칸 · 오른쪽 고급 필터 아이콘 버튼 하나를 둡니다. 검색칸 아래 거르는 줄(전체 · 지출 · 수입 [Chip](chip.md) — 줄 48: 칩 36 + 위아래 6)은 바 아래 스크롤 상자 맨 위의 [Scroll Auto Hide](scroll-auto-hide.md) 입니다 — 목록을 내리면 숨고, 올려서 반 넘게 나오면 다 드러납니다. 카드 혜택 화면의 거르는 줄(카드 이름 검색칸 + 칩 두 줄 — 140)도 같습니다. 바 자체는 숨지 않습니다. 웹의 거래 검색 화면도 앱과 같은 화면이고, 데스크톱(768 이상)에서는 머리 왼쪽 검색칸이 그 화면의 입력입니다.

검색 조건은 넷입니다 — 키워드(검색칸) · 유형(전체 · 지출 · 수입 칩 줄) · 금액 범위(최소 · 최대) · 기간(시작 · 종료 — [Input Button](input-button.md) 으로 여는 [Date Picker](date-picker.md) 기간 고르기, 브라우저 날짜 칸을 쓰지 않습니다). 금액 · 기간은 고급 필터 안에 있습니다. 카테고리 · 자산 조건은 두지 않습니다 — 가계부 화면의 필터가 맡습니다(웹 · 앱이 같습니다).

[그림: 거래 검색 — ← · 제목 자리 검색칸 · 고급 필터, 거르는 줄은 내리면 숨습니다](../../site/components/specs/top-navigation.tsx#search-guide)

### ← 와 ✕

두 버튼은 다른 동작입니다.

| 구분 | ← 뒤로 | ✕ 닫기 |
|---|---|---|
| 하는 일 | 앞 화면으로 돌아갑니다 | 지금 표면 · 흐름을 끝냅니다 |
| 쓰는 곳 | 일반 화면, 단계로 내려간 화면 | 모달, 독립 흐름 |
| 뜻 | 한 단계 뒤로 갑니다 | 이 흐름을 끝내고 나갑니다 |
| 아이콘 | 꺾쇠(chevron-left) | 엑스(x) |
| 입력한 값 | 앞 단계가 그대로 남습니다 | 지금 입력한 값이 사라질 수 있습니다 |

✕ 는 모달 · 독립 흐름(여러 단계를 거치는 가져오기 · 처음 쓰기)을 닫을 때만 씁니다 — 일반 화면에 ✕ 를 두지 않습니다. 입력한 값이 있는 흐름을 ✕ 로 닫으면 "작성한 내용이 사라져요" 를 묻습니다([Field](field.md) 의 규칙). 시트 · 대화상자의 닫기는 그 부품의 닫기 버튼입니다([Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md)).

[그림: ← 는 들어온 화면으로 · ✕ 는 흐름을 닫고 처음 자리로](../../site/components/specs/top-navigation.tsx#back-close-guide)

### ← 는 어디로 — History 기본 · 화면마다 Hierarchy

← 는 기본으로 사용자가 실제로 지나온 화면으로 돌아갑니다(History — 웹 `history.back()` · 앱 `pop`). 주소로 바로 들어왔거나(알림 · 북마크 · 새 탭) 앱 안에 앞 화면이 없으면 그 화면의 상위 화면으로 갑니다 — 이때는 지금 주소를 고쳐 씁니다(뒤로 가기를 눌러 다시 이 화면으로 오지 않게). 상위 화면은 화면마다 정해 둡니다(경로 설정). 기기 · 브라우저의 뒤로 가기와 ← 는 같은 곳으로 갑니다.

| 들어온 길 | ← 를 누르면 |
|---|---|
| 앱 안에서 눌러 들어옴(홈 벨 → 알림) | 들어온 화면(홈) |
| 주소로 바로 · 알림을 눌러 · 새 탭 | 상위 화면 — 주소를 고쳐 씁니다 |

설정처럼 "어디서 왔든 같은 곳" 이 나은 화면은 화면마다 상위 화면으로 가는 방식(Hierarchy Back)을 고를 수 있습니다. 두 방식이 갈리는 것은 지름길로 들어왔을 때뿐입니다 — 들어온 길이 구조와 같으면 같은 곳으로 갑니다. 고르지 않은 화면은 History 입니다.

| | History(기본) | Hierarchy |
|---|---|---|
| ← 를 누르면 | 사용자가 지나온 바로 앞 화면 | 정보 구조의 상위 화면 |
| 들어온 길이 구조와 같을 때 | 같은 곳 | 같은 곳 |
| 지름길로 들어왔을 때(홈 순자산 카드의 눈 → 금액 가리기) | 들어온 화면(홈) | 상위 화면(설정) |
| 주소 · 알림으로 바로 들어왔을 때 | 상위 화면(주소를 고쳐 씁니다 — 위 규칙) | 상위 화면 |
| 어울리는 자리 | 검색 · 추천 · 피드처럼 이어 보는 흐름, 상세에서 상세로 | 설정 · 프로필처럼 고정 구조를 단계로 내려가는 화면 |
| 고르는 때 | 화면마다 고릅니다 — 고르지 않으면 History | 설정 묶음처럼 "어디서 왔든 같은 곳" 이 나은 화면 |

- **대가** — Hierarchy 를 고른 화면은 ← 가 다른 탭의 화면으로 갈 수 있습니다 — 하단 탭 바의 지금 칸이 홈에서 전체로 뜁니다(홈의 눈 → 금액 가리기 → ← → 설정). 고를 때 이것을 함께 봅니다.
- **열린 일** — Hierarchy 화면에서 기기 · 브라우저의 뒤로 가기도 ← 와 같은 곳으로 가는지(웹 브라우저의 뒤로는 방문 기록대로입니다)는 아직 정하지 않았습니다. 레시피 `TopNavigationBackButton` · 앱 `PTopNavigation` 의 ← 에는 "상위로" 를 고르는 값이 아직 없어, ← 는 History 로 움직입니다.

[그림: ← — 들어온 화면으로 · 앞 화면이 없으면 상위 화면](../../site/components/specs/top-navigation.tsx#history-guide)

### 스크롤해도 선을 긋지 않습니다

바는 스크롤해도 맨 위에 그대로 있고, 목록이 그 밑으로 지나가도 선 · 그림자를 긋지 않습니다 — 고정된 바와 스크롤되는 목록을 따로 구분하지 않고 한 면으로 둡니다. 데스크톱 머리 아래에도 선을 긋지 않습니다. 바는 스크롤 방향에 따라 숨지 않습니다 — 원장 머리처럼 스크롤하면 숨는 보조 머리는 바 아래 스크롤 상자 안의 [Scroll Auto Hide](scroll-auto-hide.md) 입니다. 사진 위 투명 바(`transparent`)는 사진이 바 밑으로 지나가면 바탕이 채워지고, 그때도 선을 긋지 않습니다(위 "Tone"). 한 표면 안에서 머리와 본문이 따로 스크롤되는 [Dialog](dialog.md) · [Side Panel](side-panel.md) · [Side Navigation](side-navigation.md) 은 그 부품의 규칙대로 본문이 스크롤되면 머리 아래 1px 선을 긋습니다.

[그림: 스크롤한 목록 — 바 아래 선 · 그림자 없음 · 늘 있는 선](../../site/components/specs/top-navigation.tsx#scroll-guide)

### 데스크톱 머리(Desk)

768 이상의 Desk 웹은 [Side Navigation](side-navigation.md) 오른쪽 · 본문 위에 머리(`desktop`)를 둡니다 — 높이 56, 선 없음입니다. 왼쪽은 검색칸(본문 여백 32 에서 · 폭 360 — 거래 검색 화면의 입구)이고, 오른쪽은 주 버튼 하나([Button](button.md) `brandSolid` small — "내역 추가")와 아이콘 버튼 둘(알림 · 설정)이며, 맨 끝 아이콘 버튼의 상자가 화면 끝에서 6 입니다. 금액 가리기 눈은 머리에 두지 않습니다 — 홈 · 자산 순자산 카드의 눈이 맡습니다. 접기 버튼은 Side Navigation 머리에, 테마는 설정에 있습니다.

HR 은 데스크톱 머리를 두지 않습니다. 접기 버튼은 Side Navigation 머리에, 테마는 사이드바 바닥 계정 메뉴의 "화면 테마"(기기 설정 · 라이트 · 다크)에 있고, 지금 위치는 Side Navigation 의 지금 항목이 알립니다(빵부스러기는 두지 않습니다). 머리가 없으면 본문은 화면 위 32(`layout-margin` — 본문 좌우 여백과 같습니다)에서 화면 제목부터 시작합니다.

벨을 누르면 알림 목록이 뜹니다 — 1280 이상은 벨 아래 [Popover](popover.md), 768 ~ 1279 는 [Bottom Sheet](bottom-sheet.md) 입니다(Popover 의 "1280 미만은 Bottom Sheet" 그대로). 머리 "알림" · "모두 읽음" · 목록 · 바닥 "알림 설정" 은 두 표면이 같습니다. 폰(768 미만)의 벨은 알림 화면으로 갑니다.

[그림: Desk 데스크톱 — 사이드바 오른쪽 머리 56 · 검색칸 · 주 버튼 + 알림 · 설정 · 본문 h1](../../site/components/specs/top-navigation.tsx#desktop-guide)

[그림: 벨 — 1280 Popover · 1024 Bottom Sheet](../../site/components/specs/top-navigation.tsx#notification-guide)

### 데스크톱 화면 제목 — 한 줄

화면 제목은 머리가 아니라 본문 맨 위 `h1` 입니다(`text-screen-title` 26 / 35 · 700, 머리 아래 `spacing-nav-to-title` 20). 모든 데스크톱 화면에 하나 둡니다 — 홈 · 캘린더도 "홈" · "캘린더" 를 둡니다. 지금 위치는 사이드바의 지금 항목과 이 제목이 알립니다. 제목 줄은 한 줄입니다 — 제목(설명 — 화면 부제는 그 아래 16 / 22 · 400 · `fg-neutral-muted`)이 왼쪽, 그 화면의 동작 버튼([Button](button.md) small · `neutralOutline`)이 오른쪽이고, 버튼은 제목 덩어리 아래 끝에 맞춥니다. 버튼을 `neutralOutline` 으로 두는 것은 회색 바닥 위에서 neutralWeak 이 바닥과 같은 색이 되기 때문입니다. 글이 길면 설명이 줄을 바꾸고 버튼은 그 자리에 남습니다. 화면을 옮기면 초점이 이 제목으로 옵니다(아래 "화면을 옮길 때").

[그림: 제목 줄 — 가계부 · 설명 + 필터 · 내보내기, 768 의 긴 영어 설명](../../site/components/specs/top-navigation.tsx#screen-title-guide)

[표: 화면 제목 줄](top-navigation.yaml#base.enabled@screenTitle+screenDescription+screenActions)

### HR 폰 — ☰ 와 주 메뉴

HR 웹 768 미만은 하단 탭 바가 없습니다 — 모든 화면이 `standard` 이고 왼쪽에 ☰ 를 둡니다(이름 "주 메뉴"). 누르면 왼쪽 [Side Panel](side-panel.md) 이 열려 [Side Navigation](side-navigation.md) 의 항목을 보입니다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힙니다. 사이드바 항목이 아닌 상세 화면은 ☰ 대신 ← 를 둡니다.

[그림: HR 폰 — ☰ + 휴가 현황, 누르면 왼쪽 주 메뉴](../../site/components/specs/top-navigation.tsx#menu-guide)

### 화면을 옮길 때

다른 화면으로 옮기면(링크 · 탭 · 사이드바 항목) 스크롤을 맨 위로 보내고 초점을 그 화면의 제목(`h1`)으로 옮깁니다 — 키보드 · 스크린리더가 새 화면의 처음에서 시작합니다. 문서 제목(브라우저 탭)은 화면마다 "{화면 제목} - 그루 담다" · "{화면 제목} - 그루 이음" 입니다. 뒤로 가기로 돌아오면 그 화면의 스크롤 위치를 돌려놓고, 키보드로 왔으면 떠날 때 누른 자리에 초점을 되돌립니다 — 새 화면으로 갈 때는 제목, 뒤로 오면 누른 자리입니다(웹 · 앱이 같습니다). 앱도 화면 이름을 보조 기술에 알립니다 — 웹 문서 제목의 짝입니다. 하단 탭을 오갈 때는 [Bottom Navigation](bottom-navigation.md) 이 정하고(탭마다 마지막 화면 · 스크롤을 기억합니다 — 웹도), 가계부 묶음의 1차 탭을 오갈 때는 [Tabs](tabs.md) 가 정합니다(탭마다 기억하고, 초점은 고른 탭에 남습니다).

[그림: 가계부 900 에서 캘린더로 — 캘린더는 맨 위에서, 초점은 제목](../../site/components/specs/top-navigation.tsx#route-guide)

### 글

제목은 화면 이름입니다 — 명사로 짧게("알림" · "카드 혜택"), 마침표 없이 씁니다. 아이콘 버튼의 이름은 동작이나 대상("검색" · "알림" · "설정")이고, 더보기는 "{화면 이름} 더보기" 입니다. 글 버튼은 동사로 짧게 씁니다("완료" · "모두 읽음").

## 코드

레시피 `recipes/shadcn/components/ui/top-navigation.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `TopNavigation` — 바(`<header>`, `main` 밖). `type`(`"root"` · `"standard"` 기본 · `"desktop"`) · `tone`(`"layer"` 기본 · `"transparent"` — 사진 위 흰 글자 · 아이콘, 바탕 없음). 투명 바는 쓰는 쪽이 사진이 바 밑으로 지나갔는지 보고 `tone` 을 `"layer"` 로 바꿉니다(바탕 · 색은 150ms). 막 · 투명 누름 바탕은 정하지 않은 값이라 그리지 않습니다 — 누르면 축소만 합니다. 자식은 아래 부품입니다.
- `TopNavigationBackButton` — ← (이름 "뒤로"). 누르면 앱 안에 앞 화면이 있으면 `navigate(-1)`, 없으면 `fallbackHref`(그 화면의 상위 화면 주소, 필수)로 지금 주소를 고쳐 갑니다(`replace`). `onClick` 을 주면 그것을 부릅니다(앱은 `pop`).
- `TopNavigationCloseButton` — ✕ (이름 "닫기"). `onClick` 필수 — 흐름의 처음 자리로 갑니다. `dirty` 면 닫기 전에 "작성한 내용이 사라져요" 를 묻습니다.
- `TopNavigationMenuButton` — ☰ (이름 "주 메뉴", `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`). HR 폰의 주 메뉴 Side Panel 을 엽니다.
- `TopNavigationTitle` — 제목(`<h1 tabIndex={-1} data-screen-title>`). 한 줄로 말줄임합니다.
- `TopNavigationSearch` — 검색칸 자리. 자식은 [Input](input.md) 하나(`size="medium"` · `prefixIcon` 돋보기 · `clearable`)입니다. `standard` 에서는 제목 자리입니다 — ← 다음 6 부터 오른쪽 자리 앞 8 까지 늘어나고, 보이지 않는 `h1`(`title`, 기본 "검색")을 스스로 둡니다. `desktop` 에서는 머리 왼쪽 폭 360 입니다.
- `TopNavigationActions` — 오른쪽 자리. 자식은 `TopNavigationIconButton` 3개까지 또는 `TopNavigationTextButton` 하나이고, `desktop` 이면 맨 앞에 `TopNavigationPrimaryButton` 하나를 둡니다.
- `TopNavigationIconButton` — 상자 44 · 아이콘 24. `aria-label` 필수, `notification`(벨의 알림 점 — 이름에 "새 알림 있음" 을 넣는 것은 부르는 쪽), `<button type="button">` 속성. `aria-pressed` 는 그 자리에서 켜지고 꺼지는 단추에만 줍니다 — 이름은 그대로 두고, 아이콘이 지금 상태를 보입니다. 켬은 선 2.5, 끔은 선 2 이고 색은 켬 · 끔 모두 이웃 버튼과 같은 `fg-neutral` 입니다 — [Toggle](toggle.md) 의 흐린 끔(`fg-neutral-muted`)은 상단 바에서 쓰지 않습니다. 아이콘 줄에서 하나만 흐리면 막힌 단추처럼 보이기 때문입니다. 다른 화면으로 가는 버튼에는 `aria-pressed` 를 달지 않습니다 — 낭독기가 "눌림" 을 읽고 누르면 화면이 바뀌기 때문입니다.
- `TopNavigationTextButton` — 글 버튼(`<button type="button">`).
- `TopNavigationPrimaryButton` — 데스크톱 머리의 주 버튼([Button](button.md) `brandSolid` · `small` 그대로 + 오른쪽 8).
- `ScreenTitle` — 데스크톱 본문 맨 위 제목(`<h1 tabIndex={-1} data-screen-title>` · `text-screen-title`). `description`(제목 아래 설명 — 16 / 22 · 400 · `fg-neutral-muted`, 위 "데스크톱 화면 제목 — 한 줄" 과 같습니다) · `actions`(그 화면의 동작 버튼 — Button small)를 주면 한 줄 제목 줄(제목 덩어리 왼쪽 · 버튼 오른쪽 아래 끝 맞춤)로 그립니다. `ref` 는 늘 `h1` 입니다.
- `TopNavigationProvider` — `product`("그루 담다" · "그루 이음"). `useScreenTitle(title)` 가 문서 제목을 "{title} - {product}" 로 씁니다.
- `focusScreenTitle()` — 셸이 화면을 옮긴 뒤 부릅니다. 본문 스크롤을 맨 위로 보내고 `[data-screen-title]` 에 초점을 둡니다(링은 키보드로 왔을 때만). `{ resetScroll: false }` 면 초점만 옮깁니다 — 하단 탭 · 가계부 묶음 탭을 오갈 때 셸이 기억한 스크롤을 돌려놓습니다(목록이 그려진 뒤).

앱은 같은 값을 Dart 로 둡니다(`PTopNavigation` — `AppBar` 대신, 제목은 `Semantics(header: true, headingLevel: 1)` — iOS 는 `header` 를, 안드로이드는 `headingLevel` 을 읽습니다). 앱에는 랜드마크가 없어 이 제목이 화면 읽기의 첫 정거장입니다 — DESIGN.md Layout 의 "랜드마크" 를 따릅니다.

### 탭 첫 화면 — Root

[그림: 홈 — 큰 제목 · 검색 · 알림 점](../../site/components/specs/top-navigation.tsx#ex-root)

```tsx
import { Bell, Search } from "lucide-react"
import { TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationTitle } from "@/components/ui/top-navigation"

<TopNavigation type="root">
  <TopNavigationTitle>홈</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
    {/* 점은 이름에도 넣는다 — 소리로 알 수 있게 */}
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}>
      <Bell />
    </TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>
```

### 그 아래 화면 — ← · 제목 · 글 버튼

[그림: 알림 — ← · 제목 · "모두 읽음"](../../site/components/specs/top-navigation.tsx#ex-standard)

```tsx
import { TopNavigation, TopNavigationActions, TopNavigationBackButton, TopNavigationTextButton, TopNavigationTitle } from "@/components/ui/top-navigation"

{/* 앞 화면이 없으면(주소로 바로 들어옴) 상위 화면 /desk 로 — 주소를 고쳐 쓴다 */}
<TopNavigation>
  <TopNavigationBackButton fallbackHref="/desk" />
  <TopNavigationTitle>알림</TopNavigationTitle>
  <TopNavigationActions>
    <TopNavigationTextButton onClick={markAllRead} disabled={!hasUnread}>모두 읽음</TopNavigationTextButton>
  </TopNavigationActions>
</TopNavigation>
```

### 거래 검색 화면 — 제목 자리 검색칸

[그림: 거래 검색 — ← · 제목 자리 검색칸 · 고급 필터](../../site/components/specs/top-navigation.tsx#ex-search)

```tsx
import { useRef } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollAutoHide } from "@/components/ui/scroll-auto-hide"
import { TopNavigation, TopNavigationActions, TopNavigationBackButton, TopNavigationIconButton, TopNavigationSearch } from "@/components/ui/top-navigation"

const scrollRef = useRef<HTMLDivElement>(null)

{/* 제목 자리에 검색칸 — 보이지 않는 h1 "검색" 은 TopNavigationSearch 가 둔다. 상단 바 안이라 폰에서도 medium 40 */}
<TopNavigation>
  <TopNavigationBackButton fallbackHref="/desk" />
  <TopNavigationSearch>
    <Input size="medium" prefixIcon={<Search />} clearable aria-label="거래 검색" placeholder="거래 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
  </TopNavigationSearch>
  <TopNavigationActions>
    <TopNavigationIconButton aria-label="고급 필터" aria-haspopup="dialog" onClick={openFilters}><SlidersHorizontal /></TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>
{/* 거르는 줄은 바 아래 스크롤 상자 맨 위 — 내리면 숨고, 올려서 반 넘게 나오면 다 드러난다(scroll-auto-hide.md) */}
<div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
  <ScrollAutoHide scrollContainerRef={scrollRef} className="z-[2] bg-bg-layer-default">
    {kindChips}
  </ScrollAutoHide>
  {results}
</div>
```

### 데스크톱 머리 — Desk

[그림: Desk 데스크톱 머리 — 검색칸 · 주 버튼 + 알림 · 설정, 본문 제목 줄](../../site/components/specs/top-navigation.tsx#ex-desktop)

```tsx
import { Bell, Download, Filter, Plus, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScreenTitle, TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationPrimaryButton, TopNavigationSearch } from "@/components/ui/top-navigation"

<TopNavigation type="desktop">
  {/* 왼쪽 — 거래 검색의 입구(폭 360). Enter 로 거래 검색 화면에 간다 */}
  <TopNavigationSearch>
    <Input size="medium" prefixIcon={<Search />} clearable aria-label="거래 검색" placeholder="거래 검색" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && openSearch(query)} />
  </TopNavigationSearch>
  <TopNavigationActions>
    <TopNavigationPrimaryButton onClick={openAddTransaction}><Plus />내역 추가</TopNavigationPrimaryButton>
    {/* 벨 — 1280 이상 Popover · 768 ~ 1279 Bottom Sheet 의 알림 목록(popover.md 의 코드). 금액 가리기 눈은 머리에 두지 않는다 */}
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={toggleNotifications}><Bell /></TopNavigationIconButton>
    <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>
<main id="main">
  {/* 제목 줄 — 제목 · 설명 왼쪽, 그 화면의 동작 버튼(small) 오른쪽 */}
  <ScreenTitle
    description="모든 거래 내역"
    actions={
      <>
        <Button variant="neutralOutline" size="small" onClick={openFilters}><Filter />필터 · 3</Button>
        <Button variant="neutralOutline" size="small" onClick={exportLedger}><Download />내보내기</Button>
      </>
    }
  >
    가계부
  </ScreenTitle>
  …
</main>
```

### HR 폰 — ☰ 로 주 메뉴

[그림: HR 폰 — ☰ · 휴가 현황](../../site/components/specs/top-navigation.tsx#ex-menu)

```tsx
import { TopNavigation, TopNavigationMenuButton, TopNavigationTitle } from "@/components/ui/top-navigation"

<TopNavigation>
  <TopNavigationMenuButton aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(true)} />
  <TopNavigationTitle>휴가 현황</TopNavigationTitle>
</TopNavigation>
{/* 주 메뉴 — Side Panel(왼쪽)에 Side Navigation 의 항목. side-panel.md 의 코드 */}
```

### 사진 위 — 투명 바

[그림: 카드 상세 — 사진 위 투명 바 · 사진이 지나가면 채워진 바](../../site/components/specs/top-navigation.tsx#ex-transparent)

```tsx
import { useEffect, useRef, useState } from "react"
import { Share2 } from "lucide-react"
import { TopNavigation, TopNavigationActions, TopNavigationBackButton, TopNavigationIconButton, TopNavigationTitle } from "@/components/ui/top-navigation"

const scrollRef = useRef<HTMLDivElement>(null)
const photoRef = useRef<HTMLDivElement>(null)
const [overPhoto, setOverPhoto] = useState(true)

{/* 사진 아래 끝이 바(56 + 위 안전 영역) 밑으로 지나가면 layer 로 — 바탕이 채워진다 */}
useEffect(() => {
  const box = scrollRef.current
  const photo = photoRef.current
  if (!box || !photo) return
  const update = () => setOverPhoto(photo.getBoundingClientRect().bottom > box.getBoundingClientRect().top + 56)
  update()
  box.addEventListener("scroll", update, { passive: true })
  return () => box.removeEventListener("scroll", update)
}, [])

<div ref={scrollRef} className="relative h-full overflow-y-auto">
  <TopNavigation tone={overPhoto ? "transparent" : "layer"} className="fixed inset-x-0 top-0">
    <TopNavigationBackButton fallbackHref="/desk/cards" />
    <TopNavigationTitle>{card.name}</TopNavigationTitle>
    <TopNavigationActions>
      <TopNavigationIconButton aria-label="공유" onClick={share}><Share2 /></TopNavigationIconButton>
    </TopNavigationActions>
  </TopNavigation>
  <div ref={photoRef}>{cardPhoto}</div>
  {details}
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 스크롤 | 바는 맨 위에 그대로 있습니다 — 선 · 그림자 · 숨김이 없습니다. 투명 바는 사진이 바 밑으로 지나가면 바탕이 채워집니다(`layer` 로) |
| ← 누르기 · 기기 뒤로 | 들어온 화면으로 갑니다(기본 — History). 앱 안에 앞 화면이 없으면 상위 화면으로 갑니다(주소를 고쳐 씁니다). Hierarchy 를 고른 화면은 상위 화면으로 갑니다 |
| ✕ 누르기 | 흐름을 닫고 처음 자리로 갑니다 — 입력한 값이 있으면 먼저 묻습니다 |
| ☰ 누르기 | 왼쪽 Side Panel(주 메뉴)을 엽니다 — 지금 묶음이 펼쳐진 채 열립니다 |
| 아이콘 · 글 버튼 누르기 | 그 동작을 합니다. 누르는 동안 바탕 + 2px 축소 |
| 벨 누르기 | 폰 — 알림 화면으로 갑니다. 데스크톱 — 1280 이상은 벨 아래 Popover, 768 ~ 1279 는 Bottom Sheet 로 알림 목록을 엽니다 |
| 검색칸에 치기 | 검색 화면 — 결과가 바로 바뀝니다. 데스크톱 머리 — `Enter` 로 거래 검색 화면에 갑니다(그 화면에서는 칸이 지금 검색어입니다) |
| 마우스 호버(웹) | 버튼에 누름과 같은 바탕 — 축소 없음 |
| `Tab` | 왼쪽 버튼 → 오른쪽 버튼 순서입니다. 제목은 `Tab` 으로 서지 않습니다(`tabindex="-1"` — 화면을 옮길 때 초점만 받습니다) |
| 화면을 옮김 | 스크롤을 맨 위로 보내고 초점을 새 화면의 제목으로 옮기며, 문서 제목을 바꿉니다 |
| 글자 크기 설정 | 제목 · 글 버튼 · 검색칸 글은 1.2배까지 커지고, 넘치면 한 줄 "…" 로 줄입니다(검색칸은 칸 안에서 가로로 스크롤합니다) — 바 56 · 아이콘 버튼 44 · 아이콘 24 · 검색칸 높이 40 은 px 그대로입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 글 버튼 `fg-neutral` 바(`bg-layer-default`) 위 16.41 · 다크 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 막힌 글은 예외입니다(비활성). 투명 바의 흰 글자는 사진과 막이 대비를 정합니다 — 막을 정한 뒤 그 화면의 사진 위에서 잽니다 |
| **WCAG 1.4.4** Resize text | 바 안 글(제목 · 글 버튼 · 검색칸)은 바 56 에 맞춘 틀이라 1.2배까지만 커지고 넘치면 한 줄 "…" 로 줄입니다 — 줄인 제목도 보조 기술은 글 전체를 읽습니다. 바 56 · 아이콘은 px 그대로입니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral` 16.41 · 13.42 ✓. 알림 점 `fg-brand` Desk 8.38 · 6.10 · HR 8.17 · 6.07 ✓. 키보드 포커스 링 같은 값 ✓ — 누름 바탕(바와 1.06 · 다크 1.30)은 장식입니다 |
| **WCAG 1.4.1** Use of color | 알림 점은 이름에도 들어갑니다("알림, 새 알림 있음") ✓ |
| **WCAG 2.4.2** Page Titled | 문서 제목이 화면마다 "{화면 제목} - 그루 담다" 입니다 ✓ |
| **WCAG 2.4.3** Focus order | 새 화면으로 옮기면 초점이 그 화면의 제목으로 갑니다 — 앞 화면에서 누른 자리에 남지 않습니다. 뒤로 돌아오면 떠날 때 누른 자리로 갑니다 ✓ |
| **WCAG 2.4.6** Headings and Labels | 제목은 화면의 `h1` 입니다 ✓. 검색 화면은 보이지 않는 `h1` "검색" 을, 데스크톱은 모든 화면에 본문 `h1` 하나를 둡니다(홈 · 캘린더도) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 아이콘 버튼 44 · 글 버튼 높이 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 아이콘 버튼 44 × 44 ✓ · 글 버튼 44 × (글 + 20) ✓ |
| **ARIA** | 바는 `header`(`banner` — `main` 밖)입니다. 아이콘 버튼은 `aria-label` 이 필수이고("뒤로" · "닫기" · "주 메뉴" · "검색" · "알림"), 아이콘 SVG 는 `aria-hidden` 입니다. ☰ 와 데스크톱 벨은 `aria-haspopup="dialog"` · `aria-expanded`(☰ 는 `aria-controls` 도)를 둡니다. 검색칸은 `aria-label`("거래 검색")을 둡니다. 다른 화면으로 가는 버튼에 `aria-pressed` 를 달지 않습니다. 알림 점은 `aria-hidden` 이고 버튼 이름에 넣습니다. 앱은 제목 `Semantics(header: true, headingLevel: 1)` · 버튼 `Semantics(button: true, label)` 이고, 이름은 모두 번역 문구입니다(코드에 한국어 상수를 두지 않습니다). 알림 벨의 이름은 새 알림이 있으면 "알림, 새 알림 있음"(en "Notifications, new notifications"), 없으면 "알림" 입니다 |

## Do / Don't

### ✅ Do

- 높이 56 · 아이콘 버튼 44 · 아이콘 24 · 화면 끝 6 을 폰 · 데스크톱에 똑같이 씁니다.
- 탭 첫 화면은 왼쪽 큰 제목, 그 아래 화면은 ← + 제목으로 둡니다.
- ← 는 들어온 화면으로(기본), 앞 화면이 없을 때만 상위 화면으로 보냅니다 — 설정처럼 "어디서 왔든 같은 곳" 이 나은 화면은 Hierarchy 를 고릅니다.
- 투명 바는 사진이 화면 위를 채우는 상세에서만 쓰고, 스크롤하면 바탕을 채웁니다.
- 오른쪽은 아이콘 둘(셋까지) 또는 글 버튼 하나로 두고, 넘치면 ⋯ 에 모읍니다.
- 화면을 옮기면 맨 위로 보내고 초점을 제목으로 옮기며, 문서 제목도 바꿉니다.
- 탭 첫 화면 오른쪽은 홈 = 검색 · 알림, 나머지 = 검색으로 둡니다. 데스크톱 머리는 검색칸 · 주 버튼 · 알림 · 설정입니다.
- 데스크톱 화면 제목 줄은 한 줄로 둡니다 — 제목 · 설명 왼쪽, 동작 버튼 오른쪽.

### ❌ Don't

- 스크롤할 때 선 · 그림자를 긋지 않고, 데스크톱 머리 아래에도 선을 두지 않습니다.
- 가운데 제목 · 스크롤에 숨는 바를 두지 않습니다.
- 사진이 없는 화면에 투명 바를 쓰지 않고, 사진이 지나간 뒤에도 투명한 채로 두지 않습니다.
- 본문용 아이콘 버튼(40 · 18)을 바에 쓰지 않습니다.
- ← 가 늘 같은 화면(예: "전체")으로 새로 이동하게 하지 않습니다.
- 일반 화면에 ✕ 를 두지 않고, 아이콘 버튼과 글 버튼을 함께 두지 않습니다.
- 상단 바에 알림 숫자를 두지 않습니다.
- 금액 가리기 눈을 머리에(폰 탭 첫 화면 · 데스크톱) 두지 않습니다 — 순자산 카드의 눈이 맡습니다.
- 누르면 "준비 중" 화면으로 가는 검색 입구를 두지 않고, 다른 화면으로 가는 버튼에 `aria-pressed` 를 달지 않습니다.

## Specification

`top-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Top Navigation 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — top-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#top-navigation)
