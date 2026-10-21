# Top Navigation

> 화면 맨 위의 바(상단 바) — 지금 화면의 이름과 이동(뒤로 · 닫기 · 주 메뉴), 화면의 동작 두셋을 둔다. 폰(Desk 앱 · Desk 웹 768 미만 · HR 웹 768 미만)의 모든 화면과 데스크톱(768 이상)의 머리가 이것이다. 탭 사이를 오가는 것은 [Bottom Navigation](bottom-navigation.md), 데스크톱의 메뉴는 [Side Navigation](side-navigation.md), 화면 안에서 구역을 나누는 것은 [Tabs](tabs.md) 다.

구조는 당근 [SEED Top Navigation](https://seed-design.io/components/top-navigation)(Apache-2.0)을 따른다 — "화면 상단에 위치하여 탐색 인터페이스를 제공하는 네비게이션 컴포넌트" 로, 앱의 최상위 탭에서 쓰는 **Root** 와 "2-depth 이상의 화면에서" 쓰는 **Standard** 두 타입, 왼쪽(뒤로 · 닫기) · 가운데(제목) · 오른쪽(아이콘 · 글 버튼) 세 자리. 높이 56 · 아이콘 버튼 44 · 아이콘 24 · 화면 끝 6 은 SEED 값 그대로다. 데스크톱 머리(GNB)는 SEED 에 컴포넌트가 없어 groo 가 같은 규칙으로 더했다. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). groo 에 처음 두는 컴포넌트다 — 지금 제품마다 다른 머리(56 · 58 · 48, 아이콘 버튼 36 · 40 · 48)를 대신한다.

수치 원본은 [`top-navigation.yaml`](top-navigation.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 홈(Root) · 알림(Standard) · 가계부 데스크톱 머리 — 라이트 · 다크](../../site/components/specs/top-navigation.tsx#hero)

### 직접 골라 보기

타입(Root · Standard · 데스크톱 머리) · 왼쪽 버튼(← · ✕ · ☰) · 오른쪽(아이콘 0 ~ 3 · 글 버튼) · 알림 점 · 제목 길이를 고르면 스펙대로 그린 바와 그 코드가 바뀐다. 제목을 길게 하면 오른쪽 자리 앞 8 에서 말줄임된다.

[그림: 플레이그라운드](../../site/components/specs/top-navigation.tsx#playground)

## Anatomy

[그림: 바는 왼쪽 자리 · 제목 · 오른쪽 자리로, 아이콘 버튼 상자 44 가 화면 끝에서 6 · 버튼끼리 붙는다](../../site/components/specs/top-navigation.tsx#anatomy)

| ⓐ Root | 바 — 화면 폭 · 높이 56. 위 안전 영역만큼 높아지고 바탕은 화면 끝까지. 스크롤해도 맨 위에 그대로 있다. |
| ⓑ Leading | 왼쪽 자리 — Standard 만. ← · ✕ · ☰ 아이콘 버튼 하나. |
| ⓒ Title | 제목 — 화면 이름 한 줄(`h1`). 넘치면 말줄임. |
| ⓓ Trailing | 오른쪽 자리 — 아이콘 버튼 2개 권장 · 3개까지, 또는 글 버튼 하나. |
| ⓔ Icon Button | 아이콘 버튼 — 상자 44 = 누르는 영역, 아이콘 24. 버튼끼리 붙는다. |
| ⓕ Notification | 알림 점 — 벨 아이콘 오른쪽 위 6. |

[표: 부위](top-navigation.yaml#slots)

## Properties

### Type

| 타입 | 쓰는 화면 | 왼쪽 | 제목 | 오른쪽 |
|---|---|---|---|---|
| `root` | 탭 첫 화면(홈 · 가계부 · 캘린더 · 전체) | 없음 | 큰 제목 22 / 30 · 화면 끝에서 16 | 아이콘 버튼 |
| `standard` | 그 아래 화면 · HR 폰의 모든 화면 | ← · ✕ · ☰ | 18 / 24 · 화면 끝에서 56 | 아이콘 버튼 또는 글 버튼 하나 |
| `desktop` | 데스크톱(768 이상)의 머리 — Desk | 검색칸 — 거래 검색 화면의 입구 | 없음 — 본문 맨 위 `h1` | 주 버튼 하나 + 아이콘 버튼 둘(알림 · 설정) |

탭 첫 화면은 큰 제목으로 "이 탭의 맨 위" 가 보이고, 그 아래 화면은 ← 와 작은 제목이다(SEED Root · Standard). 제목은 늘 왼쪽이다 — 가운데 제목(iOS)은 두지 않는다. 굵기는 둘 다 700 이다(지금 하위 화면의 600 은 쓰지 않는 굵기다 — v100).

[그림: 타입 — Root 큰 제목 · Standard ← + 제목 + 글 버튼 · 데스크톱 머리](../../site/components/specs/top-navigation.tsx#types)

[표: 타입](top-navigation.yaml#type)

### 제목

한 줄이다 — 길면 말줄임(…)하고, 오른쪽 자리 앞 8 을 늘 비운다(SEED titleMinGap). 글자 크기 설정을 1.2배까지 따른다(SEED) — 더 커져도 바 높이를 넘지 않는다. 제목은 화면의 `h1` 이다 — 화면을 옮기면 초점이 이 제목으로 온다(아래 "화면을 옮길 때").

[그림: 제목 — 왼쪽 16 · 56, 긴 제목은 오른쪽 자리 앞 8 에서 말줄임](../../site/components/specs/top-navigation.tsx#title)

[표: 제목](top-navigation.yaml#base.enabled@title)

### 아이콘 버튼

상자 44 가 곧 누르는 영역이고 아이콘은 24 다 — 맨 끝 버튼의 상자가 화면 끝에서 6(아이콘은 16)이고, 버튼끼리는 붙는다(아이콘 중심 간격 44). 본문 안의 아이콘 버튼([Button](button.md) `medium` · `iconOnly` — 보이는 40 · 아이콘 18)과 다른 부품이다. 바탕은 누를 때 · 마우스를 올릴 때만 보인다. 아이콘은 lucide 선 아이콘이다(v106 — 상단은 선 아이콘).

[그림: 아이콘 버튼 — 상자 44 · 아이콘 24 · 화면 끝 6 · 붙은 버튼, 본문 Button 40 · 18 과 나란히](../../site/components/specs/top-navigation.tsx#icon-button)

[표: 아이콘 버튼](top-navigation.yaml#base.enabled@iconButton)

### 글 버튼

오른쪽 자리에 하나만 둔다("완료" · "모두 읽음") — 높이 44 · 좌우 10 · 16 / 22 · 500. 글 버튼과 아이콘 버튼을 함께 두지 않는다. 글 버튼 글은 한두 마디로 쓴다 — 큰 글자 · 긴 글 버튼에서 제목이 밀리는 것은 이 쓰기 규칙(아이콘 둘 · 셋까지 · 글 버튼 한두 마디)으로 막고, 코드는 SEED 그대로 둔다(제목 최소 폭을 두지 않는다). 영어 문구도 짧게 — "Mark all as read" 가 아니라 "Read all"(2026-10-21 사용자 결정 — 03-G 결정 2 A).

[표: 글 버튼](top-navigation.yaml#base.enabled@textButton)

### 검색칸

거래 검색 화면의 제목 자리와 데스크톱 머리의 왼쪽 자리에는 검색칸을 둔다 — [Text Field](input.md) 상자형(`outline`) `medium` 40 · 앞 돋보기 · 지우기 버튼. 바 56 안이라 폰에서도 `medium` 이다(`large` 52 를 두지 않는다). 검색 화면에서는 ← 다음 6 에서 시작해 오른쪽 자리 앞 8 까지 늘어난다 — 화면 이름 대신 칸이 서므로 보이지 않는 `h1` "검색" 을 둔다(SEED — "Standard Top Navigation 의 경우 Title 영역을 Slot 으로 구성"). 데스크톱 머리에서는 본문 여백 32 에서 시작하는 폭 360 이다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-3a C · Q-017-5 정리).

[그림: 검색칸 — 검색 화면의 제목 자리 · 데스크톱 머리 왼쪽 360](../../site/components/specs/top-navigation.tsx#search-field)

[표: 검색칸](top-navigation.yaml#base.enabled@searchField)

### 왼쪽 버튼

`standard` 의 왼쪽 자리다. ← 는 들어온 화면으로 돌아가고, ✕ 는 모달 · 독립 흐름을 닫고, ☰ 는 주 메뉴(왼쪽 [Side Panel](side-panel.md))를 연다 — ☰ 는 HR 폰에서만 쓴다(Desk 폰은 [Bottom Navigation](bottom-navigation.md)). 아래 "← 와 ✕" · "← 는 들어온 화면으로" 를 따른다.

[표: 왼쪽 버튼](top-navigation.yaml#leadingIcon)

### 알림 점

벨 아이콘에 [Notification Badge](notification-badge.md) small(점 6 · `fg-brand`)을 붙인다 — 24 아이콘 상자의 x 17 ~ 23 · y 1 ~ 7. 상단 바에는 점만 둔다 — 숫자 알약(large)은 아이콘 오른쪽으로 자라 맨 오른쪽 버튼에서 "99+" 가 화면 밖으로 8.5 나간다. 새 알림이 있는지는 버튼 이름에 넣는다("알림, 새 알림 있음").

[표: 알림 점](top-navigation.yaml#base.enabled@notification)

### 바

높이 56 은 폰 · 데스크톱 모든 화면이 같다. 위 안전 영역(상태 표시줄)만큼 바가 높아지고 내용은 그 아래 56 에 놓인다 — 바탕은 화면 끝까지, 버튼 · 제목은 안전 영역 안이다(Layout 의 Safe Area). 바탕은 불투명한 `bg-layer-default` 이고 스크롤해도 선 · 그림자를 긋지 않는다.

[표: 바](top-navigation.yaml#base.enabled@root)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 버튼 바탕 없음 |
| `hovered` | 웹 — 누름과 같은 바탕 `bg-layer-default-pressed`, 축소 없음 |
| `pressed` | 상자 바탕 `bg-layer-default-pressed` + 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 상자 안쪽 2px 링 |
| `disabled` | 아이콘 · 글 `fg-disabled` — 흐리게 하지 않는다 |

[그림: 상태 — 기본 · 호버 · 누름 · 포커스 · 막힘](../../site/components/specs/top-navigation.tsx#states)

[표: 상태 — 아이콘 버튼](top-navigation.yaml#matrix@iconButton)

[표: 상태 — 글 버튼](top-navigation.yaml#matrix@textButton)

[표: 모션](top-navigation.yaml#motion)

## Guidelines

### 탭 첫 화면은 큰 제목, 그 아래는 ← 와 제목

하단 탭의 첫 화면(홈 · 가계부 · 캘린더 · 전체)은 `root` 다 — 왼쪽 큰 제목, 뒤로 버튼이 없다. 거기서 들어간 화면은 `standard` 다 — ← 와 제목. 같은 화면이 어떤 때는 큰 제목, 어떤 때는 ← 로 바뀌지 않게 화면마다 타입을 정해 둔다. 제목은 짧은 화면 이름이다 — "알림" · "카드 혜택".

[그림: 홈(Root) → 알림(Standard) — 큰 제목 22 · ← + 18](../../site/components/specs/top-navigation.tsx#type-guide)

### 오른쪽은 둘까지 — 넘치면 ⋯

오른쪽 아이콘 버튼은 2개를 권장하고 3개까지 둔다(SEED) — 더 있으면 자주 쓰는 것만 남기고 나머지를 ⋯ 하나에 모은다(1280 이상 [Menu](menu.md), 미만 [Menu Sheet](menu-sheet.md) — 이름 "{화면 이름} 더보기"). 글 버튼은 하나만, 아이콘 버튼과 섞지 않는다. 제목이 오른쪽 자리에 밀려 읽히지 않을 만큼 늘어놓지 않는다.

[그림: 오른쪽 — 아이콘 둘 · 넷을 늘어놓은 바 · ⋯ 에 모은 바](../../site/components/specs/top-navigation.tsx#trailing-guide)

### 탭 첫 화면의 오른쪽 — 홈은 검색 · 알림, 나머지는 검색

Desk 폰(앱 · 웹 768 미만)의 탭 첫 화면은 오른쪽에 홈 = 검색 · 알림, 가계부 · 캘린더 · 전체 = 검색을 둔다 — 어느 탭에서나 머리에 검색이 있어 탭을 옮기지 않고 검색으로 간다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-2a A). 검색은 어느 탭에서 누르든 같은 거래 검색 화면으로 가고, 벨은 알림 화면(`standard` — ← · "알림" · "모두 읽음")으로 간다. 웹도 같은 자리다 — 웹은 거래 검색 화면을 먼저 만들고 입구를 단다. "준비 중" 으로 가는 입구는 두지 않는다(Q-017-3a C).

금액 가리기는 탭 첫 화면의 머리에 두지 않는다 — 홈 · 자산 순자산 카드의 눈이 그 자리다. 그 눈은 그 카드가 가려졌는지를 그리고, 누르면 금액 가리기 설정의 그 화면 묶음(홈 · 자산)으로 간다(Q-017-2b A — 켜고 끄는 단추가 아니다, [Toggle](toggle.md) 의 "금액 가리기 눈은 Toggle 이 아니다").

[그림: 탭 첫 화면 넷 — 홈 검색 · 알림 · 가계부 · 캘린더 · 전체 검색](../../site/components/specs/top-navigation.tsx#root-guide)

### 거래 검색 화면 — 제목 자리 검색칸 · 숨는 거르는 줄

거래 검색 화면은 `standard` 다 — ← · 제목 자리의 검색칸 · 오른쪽 고급 필터 아이콘 버튼 하나. 검색칸 아래 거르는 줄(전체 · 지출 · 수입 [Chip](chip.md) — 줄 40)은 바 아래 스크롤 상자 맨 위의 [Scroll Auto Hide](scroll-auto-hide.md) 다 — 목록을 내리면 숨고, 올려서 반 넘게 나오면 다 드러난다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-5 C). 카드 혜택 화면의 거르는 줄(카드 이름 검색칸 + 칩 두 줄 — 140)도 같다. 바 자체는 숨지 않는다. 웹의 거래 검색 화면도 앱과 같은 화면이다 — 데스크톱(768 이상)에서는 머리 왼쪽 검색칸이 그 화면의 입력이다(Q-017-3a C). 검색 조건은 넷이다 — 키워드(검색칸) · 유형(전체 · 지출 · 수입 칩 줄) · 금액 범위(최소 · 최대) · 기간(시작 · 종료 — [Input Button](input-button.md) 으로 여는 [Date Picker](date-picker.md) 기간 고르기, 브라우저 날짜 칸을 쓰지 않는다). 금액 · 기간은 고급 필터 안에 있다. 카테고리 · 자산 조건은 두지 않는다 — 가계부 화면의 필터가 맡는다(웹 · 앱 같다, 2026-10-21 사용자 결정 — I-01 결과 확인 결정 5A · 고치기 W2).

[그림: 거래 검색 — ← · 제목 자리 검색칸 · 고급 필터, 거르는 줄은 내리면 숨는다](../../site/components/specs/top-navigation.tsx#search-guide)

### ← 와 ✕

두 버튼은 다른 동작이다(SEED — 표는 원문 그대로).

| 구분 | 뒤로가기 (Back) | 닫기 (Close) |
|---|---|---|
| 이동 방식 | 이전 화면으로 이동 | 현재 레이어/플로우 종료 |
| 적용 위치 | 일반 페이지, 계층 구조 화면 | 모달, 독립 플로우 |
| UX 의미 | 한 단계 뒤로 가기 | 이 플로우를 끝내고 나가기 |
| 아이콘 | < (Chevron Left) | X (Close) |
| 예상 행동 | 이전 단계 유지 | 현재 상태/입력 값이 폐기될 수 있음 |

✕ 는 모달 · 독립 흐름(여러 단계를 거치는 가져오기 · 처음 쓰기)을 닫을 때만 쓴다 — 일반 화면에 ✕ 를 두지 않는다. 입력한 값이 있는 흐름을 ✕ 로 닫으면 "작성한 내용이 사라져요" 를 묻는다([Field](field.md) 의 규칙). 시트 · 대화상자의 닫기는 그 부품의 닫기 버튼이다([Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md)).

[그림: ← 는 들어온 화면으로 · ✕ 는 흐름을 닫고 처음 자리로](../../site/components/specs/top-navigation.tsx#back-close-guide)

### ← 는 들어온 화면으로(History)

← 는 사용자가 실제로 지나온 화면으로 돌아간다(SEED 의 History Back — 웹 `history.back()` · 앱 `pop`). 주소로 바로 들어왔거나(알림 · 북마크 · 새 탭) 앱 안에 앞 화면이 없으면 그 화면의 상위 화면으로 간다(Hierarchy) — 이때는 지금 주소를 고쳐 쓴다(뒤로 가기를 눌러 다시 이 화면으로 오지 않게). 상위 화면은 화면마다 정해 둔다(경로 설정). 기기 · 브라우저의 뒤로 가기와 ← 는 같은 곳으로 간다.

| 들어온 길 | ← 를 누르면 |
|---|---|
| 앱 안에서 눌러 들어옴(홈 벨 → 알림) | 들어온 화면(홈) |
| 주소로 바로 · 알림을 눌러 · 새 탭 | 상위 화면 — 주소를 고쳐 쓴다 |

[그림: ← — 들어온 화면으로 · 앞 화면이 없으면 상위 화면](../../site/components/specs/top-navigation.tsx#history-guide)

### 스크롤해도 선을 긋지 않는다

바는 스크롤해도 맨 위에 그대로 있고, 목록이 그 밑으로 지나가도 선 · 그림자를 긋지 않는다(SEED Top Navigation — "고정된 영역과 스크롤되는 영역을 구분하기 위해 별도의 시각적인 장치를 표시하지 않습니다"). 데스크톱 머리 아래 늘 있던 1px 선도 걷는다. 바는 스크롤 방향에 따라 숨지 않는다 — 원장 머리처럼 스크롤하면 숨는 보조 머리는 바 아래 스크롤 상자 안의 [Scroll Auto Hide](scroll-auto-hide.md) 다(2026-10-10). 한 표면 안에서 머리와 본문이 따로 스크롤되는 [Dialog](dialog.md) · [Side Panel](side-panel.md) · [Side Navigation](side-navigation.md) 은 그 부품의 규칙대로 본문이 스크롤되면 머리 아래 1px 선을 긋는다.

[그림: 스크롤한 목록 — 바 아래 선 · 그림자 없음 · 늘 있던 선](../../site/components/specs/top-navigation.tsx#scroll-guide)

### 데스크톱 머리(Desk)

768 이상의 Desk 웹은 [Side Navigation](side-navigation.md) 오른쪽 · 본문 위에 머리(`desktop`)를 둔다 — 높이 56, 선 없음. 왼쪽은 검색칸(본문 여백 32 에서 · 폭 360 — 거래 검색 화면의 입구, Q-017-3a C), 오른쪽은 주 버튼 하나([Button](button.md) `brandSolid` small — "내역 추가")와 아이콘 버튼 둘(알림 · 설정)이고 맨 끝 아이콘 버튼의 상자가 화면 끝에서 6 이다. 금액 가리기 눈은 머리에 두지 않는다 — 홈 · 자산 순자산 카드의 눈이 맡는다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-017-3c = Q-018-3 B). 접기 버튼은 Side Navigation 머리에, 테마는 설정에 있다. HR 은 데스크톱 머리를 두지 않는다 — 접기 버튼은 Side Navigation 머리로, 테마는 설정으로 갔고 위치는 Side Navigation 의 지금 항목이 알린다(빵부스러기는 걷었다). 머리가 없으면 본문은 화면 위 32(`layout-margin` — 본문 좌우 여백과 같다)에서 화면 제목부터 시작한다.

벨을 누르면 알림 목록이 뜬다 — 1280 이상은 벨 아래 [Popover](popover.md), 768 ~ 1279 는 [Bottom Sheet](bottom-sheet.md) 다(Q-017-3b B — Popover 의 "1280 미만은 Bottom Sheet" 그대로). 머리 "알림" · "모두 읽음" · 목록 · 바닥 "알림 설정" 은 두 표면이 같다. 폰(768 미만)의 벨은 알림 화면으로 간다.

[그림: Desk 데스크톱 — 사이드바 오른쪽 머리 56 · 검색칸 · 주 버튼 + 알림 · 설정 · 본문 h1](../../site/components/specs/top-navigation.tsx#desktop-guide)

[그림: 벨 — 1280 Popover · 1024 Bottom Sheet](../../site/components/specs/top-navigation.tsx#notification-guide)

### 데스크톱 화면 제목 — 한 줄

화면 제목은 머리가 아니라 본문 맨 위 `h1` 이다(`text-screen-title` 26 / 35 · 700, 머리 아래 `spacing-nav-to-title` 20). 모든 데스크톱 화면에 하나 둔다 — 홈 · 캘린더도 "홈" · "캘린더" 다(Q-018-2 정리 — 위치는 사이드바의 지금 항목과 이 제목이 알린다). 제목 줄은 한 줄이다 — 제목(설명 — 화면 부제는 그 아래 16 / 22 · 400 · `fg-neutral-muted`, 2026-10-16 사용자 결정 글자 역할 D6)이 왼쪽, 그 화면의 동작 버튼([Button](button.md) small · `neutralOutline` — 회색 바닥 위라 neutralWeak 은 바닥과 같은 색이다, 2026-10-16 사용자 결정 174-3 A · 기초 웹 01-040 B)이 오른쪽이고 버튼은 제목 덩어리 아래 끝에 맞춘다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-018-2 A). 글이 길면 설명이 줄을 바꾸고 버튼은 그 자리에 남는다. 화면을 옮기면 초점이 이 제목으로 온다(아래 "화면을 옮길 때").

[그림: 제목 줄 — 가계부 · 설명 + 필터 · 내보내기, 768 의 긴 영어 설명](../../site/components/specs/top-navigation.tsx#screen-title-guide)

[표: 화면 제목 줄](top-navigation.yaml#base.enabled@screenTitle+screenDescription+screenActions)

### HR 폰 — ☰ 와 주 메뉴

HR 웹 768 미만은 하단 탭 바가 없다 — 모든 화면이 `standard` 이고 왼쪽에 ☰ 를 둔다(이름 "주 메뉴"). 누르면 왼쪽 [Side Panel](side-panel.md) 이 열려 [Side Navigation](side-navigation.md) 의 항목을 보인다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힌다. 사이드바 항목이 아닌 상세 화면은 ☰ 대신 ← 다.

[그림: HR 폰 — ☰ + 휴가 현황, 누르면 왼쪽 주 메뉴](../../site/components/specs/top-navigation.tsx#menu-guide)

### 화면을 옮길 때

다른 화면으로 옮기면(링크 · 탭 · 사이드바 항목) 스크롤을 맨 위로 보내고 초점을 그 화면의 제목(`h1`)으로 옮긴다 — 키보드 · 스크린리더가 새 화면의 처음에서 시작한다. 문서 제목(브라우저 탭)은 화면마다 "{화면 제목} - 그루 담다" · "{화면 제목} - 그루 이음" 이다. 뒤로 가기로 돌아오면 그 화면의 스크롤 위치를 돌려놓는다. 하단 탭을 오갈 때는 [Bottom Navigation](bottom-navigation.md) 이 정한다(탭마다 마지막 화면 · 스크롤을 기억 — 웹도), 가계부 묶음의 1차 탭을 오갈 때는 [Tabs](tabs.md) 가 정한다(탭마다 기억 — 초점은 고른 탭에 남는다).

[그림: 가계부 900 에서 캘린더로 — 캘린더는 맨 위에서, 초점은 제목](../../site/components/specs/top-navigation.tsx#route-guide)

### 글

제목은 화면 이름 — 명사로 짧게("알림" · "카드 혜택"), 마침표 없이. 아이콘 버튼의 이름은 동작이나 대상("검색" · "알림" · "설정"), 더보기는 "{화면 이름} 더보기". 글 버튼은 동사로 짧게("완료" · "모두 읽음").

## 코드

레시피 `recipes/shadcn/components/ui/top-navigation.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `TopNavigation` — 바(`<header>`, `main` 밖). `type`(`"root"` · `"standard"` 기본 · `"desktop"`). 자식은 아래 부품.
- `TopNavigationBackButton` — ← (이름 "뒤로"). 누르면 앱 안에 앞 화면이 있으면 `navigate(-1)`, 없으면 `fallbackHref`(그 화면의 상위 화면 주소, 필수)로 지금 주소를 고쳐 간다(`replace`). `onClick` 을 주면 그것을 부른다(앱은 `pop`).
- `TopNavigationCloseButton` — ✕ (이름 "닫기"). `onClick` 필수 — 흐름의 처음 자리로. `dirty` 면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다.
- `TopNavigationMenuButton` — ☰ (이름 "주 메뉴", `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`). HR 폰의 주 메뉴 Side Panel 을 연다.
- `TopNavigationTitle` — 제목(`<h1 tabIndex={-1} data-screen-title>`). 한 줄 말줄임.
- `TopNavigationSearch` — 검색칸 자리. 자식은 [Input](input.md) 하나(`size="medium"` · `prefixIcon` 돋보기 · `clearable`). `standard` 에서는 제목 자리 — ← 다음 6 부터 오른쪽 자리 앞 8 까지 늘어나고 보이지 않는 `h1`(`title`, 기본 "검색")을 스스로 둔다. `desktop` 에서는 머리 왼쪽 폭 360.
- `TopNavigationActions` — 오른쪽 자리. 자식은 `TopNavigationIconButton` 3개까지 또는 `TopNavigationTextButton` 하나, `desktop` 이면 맨 앞에 `TopNavigationPrimaryButton` 하나.
- `TopNavigationIconButton` — 상자 44 · 아이콘 24. `aria-label` 필수, `notification`(벨의 알림 점 — 이름에 "새 알림 있음" 을 넣는 것은 부르는 쪽), `<button type="button">` 속성. `aria-pressed` 는 그 자리에서 켜지고 꺼지는 단추에만 준다 — 이름은 그대로 두고, 아이콘은 지금 상태를 넘긴다. 켬은 선 2.5, 끔은 선 2 이고 색은 켬 · 끔 모두 이웃 버튼과 같은 `fg-neutral` 이다 — [Toggle](toggle.md) 의 흐린 끔(`fg-neutral-muted`)은 상단 바에서 쓰지 않는다. 아이콘 줄에서 하나만 흐리면 막힌 단추처럼 보인다(사용자 결정 2026-10-09 19B). 다른 화면으로 가는 버튼에는 `aria-pressed` 를 달지 않는다 — 낭독기가 "눌림" 을 읽고 누르면 화면이 바뀐다.
- `TopNavigationTextButton` — 글 버튼(`<button type="button">`).
- `TopNavigationPrimaryButton` — 데스크톱 머리의 주 버튼([Button](button.md) `brandSolid` · `small` 그대로 + 오른쪽 8).
- `ScreenTitle` — 데스크톱 본문 맨 위 제목(`<h1 tabIndex={-1} data-screen-title>` · `text-screen-title`). `description`(제목 아래 설명 — t3 `fg-neutral-subtle`) · `actions`(그 화면의 동작 버튼 — Button small)를 주면 한 줄 제목 줄(제목 덩어리 왼쪽 · 버튼 오른쪽 아래 끝 맞춤)로 그린다. `ref` 는 늘 `h1` 이다.
- `TopNavigationProvider` — `product`("그루 담다" · "그루 이음"). `useScreenTitle(title)` 가 문서 제목을 "{title} - {product}" 로 쓴다.
- `focusScreenTitle()` — 셸이 화면을 옮긴 뒤 부른다: 본문 스크롤을 맨 위로, `[data-screen-title]` 에 초점(링은 키보드로 왔을 때만). `{ resetScroll: false }` 면 초점만 옮긴다 — 하단 탭 · 가계부 묶음 탭을 오갈 때 셸이 기억한 스크롤을 돌려놓는다(목록이 그려진 뒤).

앱은 같은 값을 Dart 로 둔다(`PTopNavigation` — `AppBar` 대신, 제목은 `Semantics(header: true, headingLevel: 1)` — iOS 는 `header` 를, 안드로이드는 `headingLevel` 을 읽는다). 앱에는 랜드마크가 없어 이 제목이 화면 읽기의 첫 정거장이다 — DESIGN.md Layout 의 "랜드마크"(2026-10-16 사용자 결정 — 틀 앱 02-004).

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

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 스크롤 | 바는 맨 위에 그대로 — 선 · 그림자 · 숨김 없음 |
| ← 누르기 · 기기 뒤로 | 들어온 화면으로. 앱 안에 앞 화면이 없으면 상위 화면으로(주소를 고쳐 쓴다) |
| ✕ 누르기 | 흐름을 닫고 처음 자리로 — 입력한 값이 있으면 먼저 묻는다 |
| ☰ 누르기 | 왼쪽 Side Panel(주 메뉴)을 연다 — 지금 묶음이 펼쳐진 채 |
| 아이콘 · 글 버튼 누르기 | 그 동작. 누르는 동안 바탕 + 2px 축소 |
| 벨 누르기 | 폰 — 알림 화면으로. 데스크톱 — 1280 이상 벨 아래 Popover · 768 ~ 1279 Bottom Sheet 로 알림 목록 |
| 검색칸에 치기 | 검색 화면 — 결과가 바로 바뀐다. 데스크톱 머리 — `Enter` 로 거래 검색 화면에 간다(그 화면에서는 칸이 지금 검색어) |
| 마우스 호버(웹) | 버튼에 누름과 같은 바탕 — 축소 없음 |
| `Tab` | 왼쪽 버튼 → 오른쪽 버튼 순서. 제목은 `Tab` 으로 서지 않는다(`tabindex="-1"` — 화면을 옮길 때 초점만 받는다) |
| 화면을 옮김 | 스크롤 맨 위 + 초점을 새 화면의 제목으로 · 문서 제목을 바꾼다 |
| 글자 크기 설정 | 제목 · 글 버튼은 1.2배까지 커진다 — 바 56 · 아이콘 버튼 44 · 아이콘 24 는 px 그대로(03-G 1A) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 글 버튼 `fg-neutral` 바(`bg-layer-default`) 위 16.41 · 다크 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 막힌 글은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral` 16.41 · 13.42 ✓. 알림 점 `fg-brand` Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 키보드 포커스 링 같은 값 ✓ — 누름 바탕(바와 1.06 · 다크 1.30)은 장식 |
| **WCAG 1.4.1** Use of color | 알림 점은 이름에도 들어간다("알림, 새 알림 있음") ✓ |
| **WCAG 2.4.2** Page Titled | 문서 제목이 화면마다 "{화면 제목} - 그루 담다" ✓ |
| **WCAG 2.4.3** Focus order | 화면을 옮기면 초점이 새 화면의 제목으로 — 앞 화면에서 누른 자리에 남지 않는다 ✓ |
| **WCAG 2.4.6** Headings and Labels | 제목은 화면의 `h1` ✓(SEED 웹은 제목이 `span` 이다). 검색 화면은 보이지 않는 `h1` "검색" · 데스크톱은 모든 화면에 본문 `h1` 하나(홈 · 캘린더도) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 아이콘 버튼 44 · 글 버튼 높이 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 아이콘 버튼 44 × 44 ✓ · 글 버튼 44 × (글 + 20) ✓ |
| **ARIA** | 바는 `header`(`banner` — `main` 밖). 아이콘 버튼 `aria-label` 필수("뒤로" · "닫기" · "주 메뉴" · "검색" · "알림"), 아이콘 SVG 는 `aria-hidden`. ☰ 와 데스크톱 벨은 `aria-haspopup="dialog"` · `aria-expanded`(☰ 는 `aria-controls` 도). 검색칸은 `aria-label`("거래 검색"). 다른 화면으로 가는 버튼에 `aria-pressed` 를 달지 않는다. 알림 점은 `aria-hidden` 이고 버튼 이름에 넣는다. 앱은 제목 `Semantics(header: true, headingLevel: 1)` · 버튼 `Semantics(button: true, label)` — 이름은 모두 번역 문구다(코드에 한국어 상수를 두지 않는다). 알림 벨의 이름은 새 알림이 있으면 "알림, 새 알림 있음"(en "Notifications, new notifications") · 없으면 "알림"(2026-10-16 사용자 결정 — 틀 앱 02-003) |

## Do / Don't

### ✅ Do

- 높이 56 · 아이콘 버튼 44 · 아이콘 24 · 화면 끝 6 — 폰 · 데스크톱이 같다.
- 탭 첫 화면은 왼쪽 큰 제목, 그 아래 화면은 ← + 제목.
- ← 는 들어온 화면으로, 앞 화면이 없을 때만 상위 화면으로.
- 오른쪽은 아이콘 둘(셋까지) 또는 글 버튼 하나 — 넘치면 ⋯.
- 화면을 옮기면 맨 위 + 초점을 제목으로, 문서 제목도 바꾼다.
- 탭 첫 화면 오른쪽은 홈 = 검색 · 알림, 나머지 = 검색. 데스크톱 머리는 검색칸 · 주 버튼 · 알림 · 설정.
- 데스크톱 화면 제목 줄은 한 줄 — 제목 · 설명 왼쪽, 동작 버튼 오른쪽.

### ❌ Don't

- 스크롤하면 선 · 그림자 긋기, 데스크톱 머리 아래 늘 있는 선.
- 가운데 제목 · 투명 바 · 스크롤에 숨는 바.
- 본문용 아이콘 버튼(40 · 18)을 바에 쓰기.
- ← 가 늘 같은 화면(예: "전체")으로 새로 이동하기.
- 일반 화면에 ✕, 아이콘 버튼과 글 버튼을 함께.
- 상단 바에 알림 숫자.
- 금액 가리기 눈을 머리에(폰 탭 첫 화면 · 데스크톱) — 순자산 카드의 눈이 맡는다.
- 누르면 "준비 중" 화면으로 가는 검색 입구 · 다른 화면으로 가는 버튼에 `aria-pressed`.

## Specification

`top-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Top Navigation 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — top-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#top-navigation)

## SEED 와 다른 점

- **제목은 늘 왼쪽**(사용자 결정 2026-10-04) — SEED 는 iOS(cupertino) 가운데 · Android 왼쪽 두 테마다. groo 는 Android 자리(← 다음 56)만 두고, titleMinGap 8 을 늘 지킨다(SEED 웹은 적용하지 않아 긴 제목이 버튼 상자와 10 겹친다).
- **Root 제목 22 / 30 · 700(`text-t8`)** — SEED 는 Root 를 그림(약 22)과 Figma 에만 두고 코드 · rootage 에 값이 없다.
- **선 · 그림자 없음** — SEED 안에서 Top Navigation 문서("별도의 시각적인 장치를 표시하지 않습니다" · 코드도 divider 를 2.0 에서 걷었다)와 Elevation 문서("그림자나 라인(스타일)을 추가하여 '구분감'을 줍니다")가 갈린다. groo 는 Top Navigation 쪽이다(결정 3 — DESIGN.md Elevation 문장도 고쳤다).
- **누름 바탕은 불투명한 `bg-layer-default-pressed` · 2px 거리 축소** — SEED 의 투명도 있는 bg.transparent-pressed 를 검사기가 받지 않는다(v102). SEED 웹 App Bar 는 누름 바탕 · 축소가 없고 모서리가 4 다 — groo 는 rootage(r2 8 · scaleScope self)를 따른다.
- **포커스 링은 상자 안쪽** — SEED 웹 App Bar 와 같다(버튼끼리 붙어 바깥 링이 이웃에 걸린다).
- **투명 톤 · 막 없음** — 쓸 자리가 생기면 정한다.
- **글 버튼에 iOS 최대 폭 96 이 없다** — 제목이 늘 왼쪽이라 SEED Android 와 같다.
- **알림은 점만** — SEED 는 Small · Large 둘 다 쓴다. 숫자는 맨 오른쪽 버튼에서 화면 밖으로 나간다.
- **← 의 동작을 정한다** — SEED 는 History · Hierarchy 를 사용처 정책으로 남기고, 웹 snippet 은 `pop()` 만 한다. groo 는 History 를 기본으로, 앞 화면이 없을 때만 상위 화면(주소를 고쳐 씀)이다.
- **제목이 `h1` 이고 바가 `header` 다** — SEED 웹 App Bar 는 `div` · 제목 `span` 이라 랜드마크 · 제목이 없다.
- **데스크톱 머리를 더한다** — SEED 는 GNB 를 Layout 의 영역 이름으로만 둔다(그림 약 56 + 선). 왼쪽 검색칸은 SEED React App Bar 의 `AppBarSlot` 예(머리 안 검색 막대)와 같은 자리다.
- **검색칸은 상단 바 안에서 늘 `medium` 40** — Text Field 의 "`medium` 은 1280 이상" 의 예외다(바 56 안에 `large` 52 를 두지 않는다).
- **z-index 는 specs/z-index.md 의 L1**(`z-sticky` 50).

## Migration notes

### 2026-10-21 — 틀 부품 단위 · 제목이 밀릴 때(03-G)

구현 조사 03-G 를 보고 사용자가 정했다(https://claude.ai/artifact/A3oCdxNvDwkNBPFPE36bmF). **결정 1 A** — 바 · 아이콘 버튼 · 아이콘은 px(SEED 치수 토큰), 글자만 정해진 배율. 웹 Tailwind 기본 간격(`h-14` · `size-11` · `size-6` — rem)이 글자 200% 에서 바를 112 로 키웠다. 레시피는 `[&_svg]:size-[24px]` 로(바 · 버튼은 이미 px). 앱은 할 일 없음. 거절: 모두 rem · 상자도 1.2배까지. **결정 2 A** — 제목이 밀리는 것은 쓰기 규칙으로(코드 그대로). 거절: 제목 최소 4em + 글 버튼 말줄임.

### 2026-10-16 — 화면 부제(글자 역할 D6)

사용자가 [글자 역할 비교 페이지](https://claude.ai/artifact/X9n6tDZbKSP7GeLtodtz8N)에서 화면 제목 아래 한 줄(부제)을 16 / 22 · 400 · `fg-neutral-muted` 로 정했다(D6 A — 떠 있는 표면 설명과 같은 뜻. 14 · subtle(B) · 두지 않음(C)은 고르지 않았다). Q-018-2 에서 둔 `screenDescription`(13 / 18 · subtle)을 이 값으로 바꾼다. 폰 탭 첫 화면에서 바 아래 부제를 두면 같은 값이다(DESIGN.md Typography 의 "글자 역할" R2). 옛 스펙은 `top-navigation.history/v-pre-text-roles.*`.

### 2026-10-16 — 구현 세션 질문 Q-017 · Q-018(화면 틀)

사용자가 [구현 질문 Q-017 · Q-018 비교 페이지](https://claude.ai/artifact/6R7NBc4ByvxGyLy6E6tvKf)에서 정했다(2026-10-16).

- **탭 첫 화면의 오른쪽**(Q-017-2a A) — 홈 = 검색 · 알림, 가계부 · 캘린더 · 전체 = 검색. 지금대로(홈 = 알림만, B) · 그 탭의 것만(캘린더 · 전체 비움, C)은 고르지 않았다.
- **폰 금액 가리기**(Q-017-2b A) — 순자산 카드의 눈 그대로(누르면 그 화면 묶음의 금액 가리기 설정). 홈 머리에 더하기(B)는 고르지 않았다.
- **웹 검색**(Q-017-3a C) — 웹에도 앱과 같은 거래 검색 화면을 만든 뒤 입구를 둔다(데스크톱 머리 왼쪽 검색칸 · 폰 돋보기). 입구 걷기(A) · 준비 중 화면으로 가는 입구 유지(B)는 고르지 않았다.
- **데스크톱 알림**(Q-017-3b B) — 1280 이상 Popover · 768 ~ 1279 Bottom Sheet. 지금 팝오버를 768 이상 모두(A) · 알림 화면으로(C)는 고르지 않았다.
- **머리의 눈**(Q-017-3c = Q-018-3 B) — 데스크톱 머리에서 뺀다(머리는 검색칸 · 주 버튼 · 알림 · 설정). 이름만 고친 이동 버튼(A) · 진짜 켜고 끄기(C)는 고르지 않았다. 예시 코드의 `aria-pressed` 눈을 걷었다.
- **거르는 줄**(Q-017-5 C) — 검색 · 카드 혜택 화면의 거르는 줄은 Scroll Auto Hide. 본문 맨 위(A) · 바 아래 고정(B)은 고르지 않았다.
- **데스크톱 화면 제목 줄**(Q-018-2 A) — 한 줄(제목 · 설명 아래 왼쪽, 버튼 오른쪽), 글자 24 → 26. 두 줄(B) · 설명 걷기(C)는 고르지 않았다.
- **정리**(추천대로) — 검색 화면의 검색칸은 제목 자리(SEED Standard Title Slot) · 데스크톱 모든 화면에 `h1` 하나(홈 · 캘린더 포함). 테마 단추는 걷고(메뉴 결정 ④) 접기 버튼은 사이드바 머리로, 주 버튼은 "내역 추가".

제품이 할 일.

- **Desk 웹** — 거래 검색 화면(`/desk/search` — 지금은 "검색 기능 준비 중")을 앱 `search_screen.dart` 와 같은 화면으로 새로 만든다: 제목 자리 검색칸 · 고급 필터 · 전체 · 지출 · 수입 칩 줄(Scroll Auto Hide) · 결과 목록(서버 `keyword` 인자는 이미 있다 — `expenseApi.ts:26`). 그 뒤 데스크톱 머리 왼쪽 검색칸(360 · `Enter` 로 그 화면)과 폰 탭 첫 화면 돋보기를 단다. 데스크톱 머리에서 눈(`GrooTopBar.tsx:44-52`)을 걷는다. 알림 팝오버(`NotificationsPopover.tsx` — 화면 고정 top 58 · right 20 · 380 × min(640, 화면 − 80))를 1280 이상 Popover 부품(벨 아래 8 · 높이 600 까지)으로, 768 ~ 1279 는 Bottom Sheet 로. 데스크톱 화면 머리 `.page__head`(h1 24) 15자리를 `ScreenTitle`(26 · `description` · `actions`)로, 홈 · 캘린더에 `h1` 을 더한다.
- **Desk 앱** — 검색 화면의 검색칸을 `PTopNavigation` 의 제목 자리로(지금 `title` 이 `String` 이라 둘 자리가 없다 — 제목 위젯 슬롯 + 보이지 않는 머리말 "검색"), 칩 줄과 카드 혜택 화면의 거르는 줄 140(`card_screen.dart`)을 AppBar `bottom` 에서 Scroll Auto Hide 로.

### 2026-10-04 — SEED Top Navigation 으로 새로 둔다

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — 아이콘 버튼은 SEED(상자 44 · 아이콘 24 · 화면 끝 6 · 붙은 버튼, 1A — 본문 Button 40 · 18 과 따로), 제목은 SEED Root + Standard(루트 22 왼쪽 · 하위 ← 다음 18 왼쪽, 2A — 600 은 700 으로), 상단 바 아래는 스크롤해도 표시 없음(3A — 데스크톱 머리의 늘 있던 선도 걷는다). 그리고 "따라오는 것" — 높이 56 모든 화면 · 오른쪽 2개 권장 · 3개까지 · ⋯ · 글 버튼 하나 · 선 아이콘 · 알림은 점만 · ← 는 History(앞 화면이 없으면 상위) · ✕ 는 모달 · 독립 흐름만 · 투명 바 없음 · 랜드마크 · 문서 제목 · 화면을 옮기면 맨 위 + 제목에 초점. 가운데 제목(2C) · 루트 24(2B) · 40 · 18 아이콘 버튼(1B) · 스크롤하면 선(3B)은 고르지 않았다. HR 데스크톱 머리는 걷는다(빵부스러기 결정 9B).

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **머리 높이가 셋** — 셸 56(웹 `widgets/layout/ui/MobileHeader.tsx:36-74` · 앱 `shared/widgets/mobile_header.dart:24-119`) · 웹 하위 화면 58(`shared/ui/groo/mobile-back-header.tsx:12-77`, sticky z 10) · HR 48(`widgets/layout/ui/LayoutHeader.tsx:8-19` · `Layout.tsx:16-31`). 모두 56 으로.
- **아이콘 버튼이 자리마다 다르다** — 셸 36 원 · 20(`size="iconLg"`), 웹 데스크톱 36 · 16(코드는 18 인데 버튼 규칙이 16 으로 누른다 — `GrooTopBar.tsx:51 · 61` · `button-variants.ts:60`), 앱 동작 40 · 16 · 앱 검색 48 · 20, ← 34 × 34(웹) · 38 × 56(앱 `shared/widgets/p_back_button.dart:17-49`) · HR 접기 28. 모두 상자 44 · 아이콘 24 로.
- **제목** — 루트 24 / 700(웹 · 앱) → 22 / 30, 하위 18 / 600(웹 x 46 · 앱 x 46) → 18 / 24 · 700 · x 56. 앱 머리 주석은 22 인데 실제 24 다(`mobile_header.dart:14-16 · 56`).
- **← 가 늘 "전체" 로 새로 이동한다** — `MobileBackHeader` 의 `to` 기본값 `/desk/more`(push), 호출 14곳 중 `to` 를 준 곳이 0(`mobile-back-header.tsx:14 · 48`) — 홈 벨 → 알림 → ← 가 전체로 간다(F8). History 로.
- **설정 하위 화면의 ← 에 이름이 없고 제목이 `h2`**(`pages/settings/ui/SettingsPage.tsx:504-521 · 523`, F7). 설정 하위 · 밤하늘 · 리포트는 기기 · 브라우저 뒤로가 페이지를 떠난다(`SettingsPage.tsx:388-395` · `NightSkyPanel.tsx:70` · `ForestReport.tsx:523`, F9).
- **데스크톱 머리** — Desk 웹 `header.top` 이 `main` 안에 있고 아래 1px 선이 늘 있다(`widgets/layout/ui/GrooTopBar.tsx:22-89` · `shared/styles/groo.css:214-268`). 접기 버튼은 Side Navigation 머리로, 테마는 설정으로(메뉴 결정 ④), 아이콘은 알림 · 설정 둘 + "내역 추가"(지금 80.7 × 32 · 12 / 500 → Button small) — 금액 가리기 눈은 걷는다(2026-10-16 위). HR 헤더(접기 28 "Toggle Sidebar" · 빵부스러기 · 테마 36 "Toggle theme")는 걷는다.
- **알림 점** — 데스크톱 7 × 7 에 2px 테두리를 둘러 빨강 3 × 3 이 아이콘 위로 4 튀어나오고(`GrooTopBar.tsx:62-67`, F20), 폰 6 · 앱 7 빨강이다(`mobile_header.dart:82-118`). 브랜드 점 6 · 아이콘 상자 x 17 ~ 23 · y 1 ~ 7 로(Notification Badge).
- **랜드마크 · 문서 제목** — 웹 머리가 `main` 안이라 `banner` 가 0, 모바일 웹은 `main` 0, 본문 바로가기 0, 문서 제목 고정("그루 담다" · HR "groo" · `lang="en"` — `index.html:2 · 7`, F16). 앱 셸 제목은 머리말(header)이 아니다(F6).
- **화면을 옮겨도 스크롤 위치가 따라온다** — 웹 셸의 스크롤 상자가 하나라 900 내려 둔 가계부에서 캘린더로 가면 캘린더가 900 에서 열린다(`widgets/layout/ui/AppLayout.tsx:93 · 122`, F3). 화면을 옮기면 맨 위 + 제목에 초점으로.
- **가짜 검색 입구** — 웹 데스크톱 readOnly 검색칸(`GrooTopBar.tsx:27-42`)과 폰 검색 아이콘(`MobileHeader.tsx:63-70`)이 "준비 중" 화면으로 간다(F21). 앱은 진짜 검색이다. → 2026-10-16 정했다(위 — 웹 검색 화면을 만든 뒤 입구를 둔다).
