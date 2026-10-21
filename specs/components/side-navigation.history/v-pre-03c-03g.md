# Side Navigation

> 데스크톱(768 이상)의 주 메뉴 — 화면 왼쪽의 세로 띠(사이드바)에 서비스의 최상위 화면들을 묶어 둔다. 1280 이상은 펼침 240, 768 ~ 1279 는 아이콘만 56 으로 저절로 접히고, 손으로 접고 펼 수 있다. 768 미만에서는 없다 — Desk 웹은 [Bottom Navigation](bottom-navigation.md), HR 은 ☰ 로 여는 왼쪽 [Side Panel](side-panel.md) 에 같은 항목을 담는다. 화면 맨 위의 바는 [Top Navigation](top-navigation.md) 이다.

구조는 당근 [SEED Side Navigation](https://seed-design.io/components/side-navigation)(Apache-2.0)을 따른다 — "서비스의 최상위 메뉴 간 이동을 돕고 앱의 전체 구조를 탐색할 수 있게 하는 컴포넌트" 로, 머리(Header) · 접기 버튼(Trigger) · 내용(Content) · 묶음(Group) · 항목(Menu Item) · 하위 항목(Menu Sub Item) · 바닥(Footer). 폭 240 · 56 · 머리 64 · 항목 44 · 아이콘 20 · 이름 14 / 19 · 500 · 모서리 10 은 SEED 값 그대로다(SEED 는 rootage 없이 레시피에 px 로 둔다). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). 옛 Sidebar 스펙(shadcn — 256 · 48 · 항목 32)을 대신한다.

수치 원본은 [`side-navigation.yaml`](side-navigation.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: Desk 가계부 · HR 휴가 현황 — 펼침 240 · 접힘 56, 라이트 · 다크](../../site/components/specs/side-navigation.tsx#hero)

### 직접 골라 보기

창 폭(768 ~ 1279 · 1280 이상) · 손으로 접기 · 지금 화면 · 하위가 있는 항목 · 긴 이름 · 서비스(Desk · HR)를 고르면 스펙대로 그린 사이드바와 그 코드가 바뀐다. 접힌 사이드바에서 항목에 마우스를 올리면 이름 말풍선이, 하위가 있는 항목은 펼침 메뉴가 열린다.

[그림: 플레이그라운드](../../site/components/specs/side-navigation.tsx#playground)

## Anatomy

[그림: 사이드바는 머리(로고 · 접기 버튼) · 내용(묶음 이름 · 항목 · 하위 항목) · 바닥으로, 흰 면 + 오른쪽 1px 선](../../site/components/specs/side-navigation.tsx#anatomy)

| ⓐ Root | 사이드바 — 화면 왼쪽, 높이 전체. 흰 면 + 오른쪽 1px 선. 본문과 따로 스크롤된다. |
| ⓑ Header | 머리 — 서비스 마크 · 이름과 접기 버튼. 고정. |
| ⓒ Trigger | 접기 버튼 — 펼침 ↔ 접힘. |
| ⓓ Content | 내용 — 묶음과 항목. 넘치면 이 안에서만 스크롤하고, 머리 아래 선 · 아래 끝 흐림이 생긴다. |
| ⓔ Group | 묶음 — 이름(있을 때만)과 항목 여럿. |
| ⓕ Item | 항목 — 아이콘 + 이름. 하위가 있으면 꺾쇠. |
| ⓖ Sub Item | 하위 항목 — 아이콘 없이 이름만. |
| ⓗ Footer | 바닥 — 보조 링크(설명서 · 문의). 고정, 비면 없다. 계정은 두지 않는다. |

[표: 부위](side-navigation.yaml#slots)

## Properties

### 펼침 · 접힘

1280 이상은 펼침(240)이 기본이고, 768 ~ 1279 는 아이콘만(56)으로 저절로 접힌다 — 좁은 화면에서 본문을 넓게 둔다(SEED "md: 공간 효율을 위해 Collapsed 로 자동 전환"). 머리의 접기 버튼으로 어느 폭에서나 손으로 접고 펼 수 있고, 손으로 접은 상태는 기억한다(아래 "폭으로 · 손으로"). 접히면 이름 · 묶음 이름 · 꺾쇠 · 하위 항목이 보이지 않고, 묶음 사이에 1px 선이 남는다.

[그림: 펼침 240 · 접힘 56 — 1280 · 1024 의 본문 폭](../../site/components/specs/side-navigation.tsx#collapse)

[표: 펼침 · 접힘](side-navigation.yaml#collapsed)

[표: 사이드바](side-navigation.yaml#base.enabled@root)

### 머리 · 접기 버튼

머리는 높이 64 · 안쪽 8 이고, 왼쪽에 서비스 마크 24 + 이름(16 / 22 · 700 — "그루 담다" · "그루 이음"), 오른쪽에 접기 버튼이다. 접기 버튼은 상자 40 · 아이콘 18(`fg-neutral-subtle`) · 모서리 8 이고 누르는 영역은 44 다. 접히면 로고는 숨고 접기 버튼이 56 의 가운데에 선다. 로고는 누르지 않는다 — 홈은 첫 항목이다.

[그림: 머리 — 마크 · 이름 · 접기 버튼 40, 접히면 버튼만 가운데](../../site/components/specs/side-navigation.tsx#header)

[표: 머리](side-navigation.yaml#base.enabled@header)

[표: 로고](side-navigation.yaml#base.enabled@logo)

[표: 접기 버튼](side-navigation.yaml#base.enabled@trigger)

### 묶음 · 항목

묶음 이름은 14 / 19 · 700 · `fg-neutral-muted`, 묶음 사이는 8 이다. 항목은 최소 44 · 좌우 8 · 모서리 10, 아이콘 20(`fg-neutral-subtle`) · 아이콘 ↔ 이름 12 · 이름 14 / 19 · 500(`fg-neutral-muted`)이다. 이름이 길면 말줄임하지 않고 줄을 바꾼다(SEED 문서 — "말줄임(...) 처리 대신 자동 줄바꿈(Word-wrap)") — 항목이 그만큼 늘어난다. 그래도 이름은 짧게 쓴다("상품 정보 관리" 대신 "상품 관리" — SEED).

[그림: 묶음 · 항목 · 긴 이름의 줄바꿈](../../site/components/specs/side-navigation.tsx#items)

[표: 항목](side-navigation.yaml#base.enabled@item)

[표: 항목 아이콘](side-navigation.yaml#base.enabled@itemIcon)

[표: 항목 이름](side-navigation.yaml#base.enabled@itemLabel)

[표: 묶음 이름](side-navigation.yaml#base.enabled@groupLabel)

### 지금 항목

지금 화면의 항목은 옅은 회색 바탕(`bg-neutral-weak-pressed`) + 짙은 아이콘 · 이름(`fg-neutral`)이다. 바탕은 SEED 의 옅은 선택 바탕보다 한 단계 짙어, 다크에서도 마우스를 올린 바탕(`bg-layer-default-pressed`)과 갈린다(사용자 결정 2026-10-08). 굵기(500) · 크기는 바꾸지 않는다(SEED). 지금 항목에 마우스를 올리거나 눌러도 바탕은 그대로이고, 누르면 아이콘 · 이름만 줄어든다. 펼침 메뉴의 지금 화면 줄도 같은 바탕이다. 하위가 지금 화면이면 하위 항목이 지금 항목이고 부모는 저절로 펼쳐진다 — 접힌 사이드바에서는 하위가 지금인 부모가 지금 항목이다.

[그림: 지금 항목 — 옅은 회색 + 짙은 글자, 하위가 지금이면 부모가 펼쳐진 채](../../site/components/specs/side-navigation.tsx#current)

[표: 지금 항목](side-navigation.yaml#current)

### 하위 항목

하위가 있는 항목(부모)은 누르면 하위 목록을 펼치고 접기만 한다 — 그 자체로 어떤 화면으로도 가지 않는다(SEED). 오른쪽 꺾쇠 16 이 접혀 있으면 아래, 펼치면 위를 가리킨다. 하위 항목은 아이콘 없이 이름만이고 부모 이름과 같은 자리(40)에서 시작한다. 하위가 없는 항목은 누르면 바로 그 화면으로 간다.

[그림: 부모는 펼치기만 — 꺾쇠 · 하위 항목 40 · 지금 하위](../../site/components/specs/side-navigation.tsx#sub-items)

[표: 하위 항목](side-navigation.yaml#base.enabled@subItem)

[표: 꺾쇠](side-navigation.yaml#base.enabled@chevron)

### 스크롤 — 머리 아래 선 · 끝 흐림

머리 · 바닥은 고정이고 내용만 스크롤된다. 내용이 위 끝에서 떨어지면 머리 아래에 1px 선(`stroke-neutral-subtle`)이 생기고, 내용 아래 끝 24 는 늘 흐리다(`gradient-fade-mask` — 끝까지 내리면 흐림이 빈 여백 위에 놓인다). 이 흐림은 사이드바의 제 안개다([Scroll Fog](scroll-fog.md) 의 "부품이 제 안개를 가진 자리").

[그림: 스크롤한 사이드바 — 머리 아래 선 · 아래 끝 흐림 24](../../site/components/specs/side-navigation.tsx#scroll)

[표: 내용](side-navigation.yaml#base.enabled@content)

[표: 머리 아래 선](side-navigation.yaml#base.enabled@divider)

[표: 끝 흐림](side-navigation.yaml#base.enabled@fog)

### 접혔을 때 — 말풍선 · 펼침 메뉴

접힌 사이드바에서 하위가 없는 항목에 마우스를 올리거나 키보드 초점이 오면 오른쪽에 이름 말풍선이 뜬다([Help Bubble](help-bubble.md) 의 툴팁). 하위가 있는 항목은 오른쪽에 펼침 메뉴가 열려 하위 목록을 보인다 — 표면은 [Menu](menu.md) 와 같고(`bg-layer-floating` · 모서리 20 · `shadow-s3` · 폭 200), 맨 위에 부모 이름, 줄은 높이 44 다. 마우스를 올리면 200ms 뒤에 열리고 떠나면 100ms 뒤에 닫히며, 누르거나 `Enter` · `Space` 로도 연다. 지금 화면의 줄은 지금 항목과 같은 바탕이다. 1280 미만이어도 [Menu Sheet](menu-sheet.md) 로 바꾸지 않는다 — 아래 "접힌 사이드바의 하위".

[그림: 접힌 사이드바 — 자산 말풍선 · 증권 펼침 메뉴(나무증권 · 토스증권)](../../site/components/specs/side-navigation.tsx#flyout)

[표: 펼침 메뉴](side-navigation.yaml#base.enabled@flyout)

[표: 펼침 메뉴의 줄](side-navigation.yaml#base.enabled@flyoutItem)

[표: 펼침 메뉴의 묶음 이름](side-navigation.yaml#base.enabled@flyoutLabel)

[표: 이름 말풍선](side-navigation.yaml#base.enabled@tooltip)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음(지금 항목은 옅은 회색 `bg-neutral-weak-pressed`) |
| `hovered` | 웹 — `bg-layer-default-pressed`(지금 항목은 바탕 그대로), 축소 없음 |
| `pressed` | 같은 바탕 + 아이콘 · 이름만 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 항목 안쪽 2px 링 |
| `open` | 하위가 펼쳐짐 — 꺾쇠가 위로 |
| `disabled` | 아이콘 · 이름 `fg-disabled`, 누르지 못한다 |

[그림: 상태 — 호버 · 누름 · 포커스 · 지금 · 막힘](../../site/components/specs/side-navigation.tsx#states)

[표: 상태 — 항목](side-navigation.yaml#matrix@item)

[표: 상태 — 지금 항목](side-navigation.yaml#matrix.current.current@item)

[표: 모션](side-navigation.yaml#motion)

## Guidelines

### 폭으로 · 손으로

| 창 폭 | 기본 | 손으로 |
|---|---|---|
| 1280 이상 | 펼침 240 | 접을 수 있다 — 접은 상태를 기억해 다음에도 접힌 채 연다 |
| 768 ~ 1279 | 접힘 56 | 펼 수 있다 — 본문이 그만큼 좁아진다. 다시 열면 접힌 채다 |
| 768 미만 | 없다 | Desk 는 하단 탭 바, HR 은 ☰ → 왼쪽 주 메뉴(Side Panel) |

기본은 창 폭으로 정하고, 창 폭이 1280 을 넘나들면 다시 정한다 — 처음 열 때도 폭을 본다(SEED 코드는 넘나들 때만 본다). 손으로 접은 것은 브라우저에 기억한다(localStorage) — 서버 쿠키가 아니다.

[그림: 폭으로 — 1440 펼침 · 1024 접힘 · 1024 에서 손으로 펼침](../../site/components/specs/side-navigation.tsx#width-guide)

### 768 미만 — 같은 항목을 다른 그릇에

768 미만에서 사이드바는 없다. Desk 웹은 앱과 같은 [Bottom Navigation](bottom-navigation.md) 이고, HR 은 [Top Navigation](top-navigation.md) 의 ☰ 로 여는 왼쪽 [Side Panel](side-panel.md) 에 같은 묶음 · 항목을 펼친 모양으로 담는다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힌다.

[그림: HR 1280 사이드바 · 폰 ☰ 주 메뉴 — 같은 항목](../../site/components/specs/side-navigation.tsx#mobile-guide)

### 접힌 사이드바의 하위 — 옆 펼침 메뉴(Menu 경계의 예외)

768 ~ 1279 의 접힌 사이드바에서 하위가 있는 항목은 누른 아이콘 옆 8 에 펼침 메뉴를 띄운다 — [Menu](menu.md) 표면 · 폭 200 · 줄 44 · 지금 화면 줄 표시. 이 폭은 Menu 가 [Menu Sheet](menu-sheet.md) 로 바뀌는 1280 미만이지만, 사이드바의 하위 목록은 시트로 바꾸지 않는다 — Menu 의 "1280 미만은 Menu Sheet" 규칙의 예외다(사용자 결정 2026-10-08 — Menu Sheet 는 고르지 않았다). 줄을 Menu 의 39 가 아니라 44 로 두는 것은 이 폭에 터치 태블릿이 섞여서다. 마우스는 200ms 뒤 열고 100ms 뒤 닫으며, 누르거나 키보드로도 연다(Behavior).

### 부모는 펼치기만, 지금 화면이면 저절로

하위가 있는 항목은 이동하지 않고 펼치기만 한다 — "증권" 을 누르면 나무증권 · 토스증권이 펼쳐질 뿐이다. 하위 하나가 지금 화면이면 부모는 사용자가 손대지 않아도 펼쳐진 채다(SEED). 부모에 따로 갈 화면이 필요하면 하위 첫 줄에 둔다("전체 보기").

[그림: 증권 — 이동 + 펼침 · 펼치기만](../../site/components/specs/side-navigation.tsx#parent-guide)

### 하위가 사람마다 다르면 — 둘 이상일 때만 부모

하위가 사용자마다 달라지는 항목(Desk 증권 — 연결한 증권사)은 하위가 둘 이상일 때만 부모다(펼치기만, 하위 = 연결한 증권사). 하나 · 없으면 하위 없는 단독 항목이 되어 누르면 바로 그 화면으로 간다 — 꺾쇠가 없다(SEED Standalone Menu — "하위 항목이 없는 경우 … 아이템 클릭 시 즉시 해당 페이지로 이동"). 증권 화면은 연결이 하나면 그 증권사를, 없으면 연결 안내를 연다. 구독이 없으면 항목을 두지 않는다(지금 그대로 — Pro 는 증권뿐). 하위 하나짜리 나무는 만들지 않는다 — 고를 것이 없다(2026-10-16 구현 세션 질문 Q-017-4 정리). 접힌 사이드바에서는 둘 이상이면 펼침 메뉴, 하나 · 없으면 이름 말풍선이다.

[그림: 증권사 0 · 1 · 2 · 3 — 단독 항목 · 부모](../../site/components/specs/side-navigation.tsx#dynamic-guide)

### 위치는 사이드바가 알린다

데스크톱에서 지금 어디에 있는지는 사이드바의 지금 항목(부모는 저절로 펼침)과 본문 맨 위 제목이 알린다 — 빵부스러기(Breadcrumb)는 두지 않는다(SEED 에도 없다 — 2026-10-04 결정 9). 지금 HR 의 경로 19개는 모두 사이드바 항목이라 빵부스러기가 같은 정보를 두 번 보였다. 사이드바에 없는 깊은 화면(사용자 상세 같은)이 생기면 그 화면이 어디로 돌아가는지는 그때 정한다.

[그림: HR 휴가 현황 — 사이드바 지금 항목(휴가 › 휴가 현황) + 본문 제목, 빵부스러기 없음](../../site/components/specs/side-navigation.tsx#position-guide)

### 묶음 · 이름

- 묶음은 성격이 다른 항목을 나눌 때만 — 묶음 이름은 짧은 명사("기록" · "관리"). 회사 이름처럼 바뀌는 말을 묶음 이름으로 두지 않는다.
- 같은 이름의 묶음과 항목을 두지 않는다(묶음 "관리자" 안의 항목 "관리자").
- 항목 이름은 화면 이름과 같게 — 사이드바 "통계 · 분석" 과 화면 제목 "통계" 처럼 갈리지 않게.
- 아이콘은 모든 항목에 두고(하위 항목은 없음), lucide 선 아이콘 20 이다.

### 바닥 — 보조 링크만, 비면 그리지 않는다

바닥에는 보조 링크(설명서 · 문의 — SEED Footer "'가이드북', '지원센터'와 같이 서비스의 보조적인 링크")만 둔다 — 비면 그리지 않는다. 계정(아바타 · 이름)은 바닥에 두지 않는다 — Desk 는 계정이 하나라 바꿀 일이 없고 설정 · 로그아웃은 머리의 ⚙ 가 맡는다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-018-1 C). 지금 Desk 웹에는 보조 링크가 없어 바닥을 그리지 않는다. HR 은 데스크톱 머리(⚙)가 없어 바닥의 계정 메뉴가 로그아웃 길이다 — HR 적용 때 정한다. 누르는 것으로 보이는 줄은 반드시 무언가를 한다.

[그림: 바닥 — 지금(눌러도 아무 일 없는 이름 줄) · 뒤(바닥을 그리지 않는다)](../../site/components/specs/side-navigation.tsx#footer-guide)

### 두지 않는 것

shadcn Sidebar 에 있던 것 가운데 다음은 두지 않는다 — SEED 에 없고 groo 화면에 쓸 자리가 없다.

| shadcn | 두지 않는 까닭 |
|---|---|
| `⌘` / `Ctrl` + `B` 단축키 | 브라우저 · 화면 읽기 프로그램의 단축키와 겹치고, 알 길이 없다. 접기 버튼이 있다 |
| 쿠키로 기억(`sidebar_state`) | 기억은 브라우저(localStorage)에 — 지금 쿠키는 쓰기만 하고 읽지 않는다 |
| `floating` · `inset` 모양 | 떠 있는 상자 · 본문 상자(HR inset — 모서리 12 · 그림자)를 걷고 흰 면 + 선 하나로 |
| `offcanvas`(화면 밖으로 숨김) · 오른쪽 사이드바 | 접힘은 아이콘만(56) 하나, 왼쪽만. 768 미만의 서랍은 Side Panel |
| 768 미만 자동 Sheet | 768 미만은 Desk 하단 탭 바 · HR ☰ + Side Panel |

## 코드

레시피 `recipes/shadcn/components/ui/side-navigation.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `SideNavigation` — 사이드바(`<nav aria-label="주 메뉴">`). `collapsed` · `defaultCollapsed` · `onCollapsedChange`(손으로 다룰 때). 주지 않으면 창 폭(768 ~ 1279 접힘 · 1280 이상 펼침) + 손으로 접은 기억(`localStorage` 의 `groo:side-navigation-collapsed`)으로 정한다.
- `SideNavigationHeader` — 머리. `logo`(마크 + 서비스 이름). 접기 버튼(이름 "사이드바" · `aria-expanded` · `aria-controls`)을 스스로 그린다.
- `SideNavigationContent` — 내용(스크롤 · 머리 아래 선 · 끝 흐림). 768 미만의 주 메뉴 서랍(Side Panel)에는 이것만 넣는다 — `SideNavigation` 밖에서 쓰면 스스로 `<nav aria-label="주 메뉴">` 가 되고, 펼친 모양으로 그린다(서랍의 스크롤 · 흐림은 Side Panel 본문이 맡는다). `onNavigate`(항목을 눌러 이동할 때 — 서랍을 닫는다).
- `SideNavigationGroup` — 묶음. `label`(있을 때만).
- `SideNavigationItem` — 항목. 하위가 없으면 링크 — `href` · `icon` · `label` · `current`(`aria-current="page"`) · `disabled`. 자식으로 `SideNavigationSubItem` 을 둘 이상 주면 부모(버튼 — `aria-expanded` · `aria-controls`, 하위가 `current` 면 저절로 펼침, `defaultOpen`)가 된다. 하위가 하나 이하이면 부모를 만들지 않고 `href` 의 단독 링크로 그린다(`href` 가 없으면 그 하나의 `href` — 하위가 지금이면 지금 항목) — 하위가 사람마다 다른 항목(증권)을 그대로 넘겨도 된다. 접히면 하위가 없는 항목은 이름 말풍선, 부모는 펼침 메뉴를 스스로 그린다.
- `SideNavigationSubItem` — 하위 항목(링크). `href` · `label` · `current` · `disabled`.
- `SideNavigationFooter` — 바닥 — 보조 링크(설명서 · 문의). 비면 그리지 않는다. 계정을 넣지 않는다.

앱은 사이드바가 없다(늘 폰 틀).

### Desk — 묶음 둘 · 하위가 있는 증권

[그림: Desk 가계부 — 워크스페이스 · 기록, 증권 하위](../../site/components/specs/side-navigation.tsx#ex-desk)

```tsx
import { CalendarDays, ClipboardList, LayoutGrid, Wallet, TrendingUp } from "lucide-react"
import {
  SideNavigation, SideNavigationContent, SideNavigationGroup,
  SideNavigationHeader, SideNavigationItem, SideNavigationSubItem,
} from "@/components/ui/side-navigation"

<SideNavigation>
  <SideNavigationHeader logo={<ServiceLogo name="그루 담다" />} />
  <SideNavigationContent>
    <SideNavigationGroup label="워크스페이스">
      <SideNavigationItem href="/desk" icon={<LayoutGrid />} label="홈" current={path === "/desk"} />
      <SideNavigationItem href="/desk/assets" icon={<Wallet />} label="자산" current={path === "/desk/assets"} />
      {/* 증권 — 구독이 없으면 두지 않는다. 연결한 증권사가 둘 이상이면 부모(펼치기만), 하나 · 없으면 /desk/stocks 단독 링크 */}
      {subscribed && (
        <SideNavigationItem href="/desk/stocks" icon={<TrendingUp />} label="증권" current={path.startsWith("/desk/stocks")}>
          {brokers.map((b) => (
            <SideNavigationSubItem key={b.id} href={`/desk/stocks/${b.id}`} label={b.name} current={broker === b.id} />
          ))}
        </SideNavigationItem>
      )}
      <SideNavigationItem href="/desk/ledger" icon={<ClipboardList />} label="가계부" current={path === "/desk/ledger"} />
    </SideNavigationGroup>
    <SideNavigationGroup label="기록">
      <SideNavigationItem href="/desk/calendar" icon={<CalendarDays />} label="캘린더" current={path === "/desk/calendar"} />
    </SideNavigationGroup>
  </SideNavigationContent>
  {/* 바닥 — Desk 는 보조 링크가 없어 두지 않는다(계정은 바닥에 두지 않는다) */}
</SideNavigation>
```

### 768 ~ 1279 — 접힌 사이드바

[그림: 1024 — 접힘 56, 자산 말풍선 · 증권 펼침 메뉴](../../site/components/specs/side-navigation.tsx#ex-collapsed)

```tsx
{/* 폭으로 저절로 접힌다 — 같은 코드. 손으로 정하려면 collapsed · onCollapsedChange */}
<SideNavigation>…</SideNavigation>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 항목 누르기 | 그 화면으로 — 초점 · 스크롤은 Top Navigation 의 "화면을 옮길 때" |
| 부모 누르기 · `Enter` · `Space` | 하위를 펼치고 접는다 — 이동하지 않는다. 하위가 300ms 로 펼쳐지고 꺾쇠도 같은 시간에 돈다(Accordion 과 같다) |
| 접기 버튼 | 펼침 ↔ 접힘 200ms. 1280 이상에서 접으면 기억한다 |
| 창 폭이 1280 을 넘나듦 | 기본으로 다시 — 1280 이상 펼침(접어 둔 기억이 있으면 접힘), 미만 접힘 |
| 내용 스크롤 | 머리 아래 선이 나타난다 · 아래 끝 흐림은 늘 |
| 접힌 항목에 마우스(하위 없음) | 200ms 뒤 이름 말풍선 · 떠나면 100ms 뒤 닫힘. 키보드 초점이면 바로 |
| 접힌 부모에 마우스 | 200ms 뒤 펼침 메뉴(다른 펼침 메뉴가 열려 있으면 바로) · 메뉴로 옮겨 가는 동안 닫히지 않는다 · 떠나면 100ms 뒤 닫힘 |
| 접힌 부모 누르기 · `Enter` · `Space` | 펼침 메뉴를 열고 닫는다 — 키보드로 열면 첫 줄로 초점, 마우스 · 터치로 열면 초점을 옮기지 않는다 |
| 펼침 메뉴에서 `Esc` · 바깥 누르기 · `Tab` 으로 나감 | 닫는다 — `Esc` 면 초점은 부모로 |
| `Tab` | 접기 버튼 → 항목 차례(펼쳐진 하위 포함) → 바닥 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 · 묶음 이름 `fg-neutral-muted` 면(`bg-layer-default`) 위 7.11 · 다크 7.70, 호버 바탕 위 6.70 · 5.93, 지금 항목 `fg-neutral` 옅은 회색 위 14.26 · 8.62 ✓. 펼침 메뉴 줄 16.41 · 11.62(지금 줄 14.26 · 8.62) · 묶음 이름 5.50 · 5.27 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral-subtle` 5.50 · 6.09(호버 바탕 위 5.18 · 4.68), 접기 버튼 같은 값 ✓(SEED gray-600 은 1.97). 키보드 포커스 링 Desk 8.38 · 6.10 · HR 5.06 · 6.23(지금 항목 위 Desk 7.28 · 3.91 · HR 4.40 · 4.00) ✓. 면 · 오른쪽 선(본문과 1.08 · 1.07)은 장식 |
| **WCAG 1.4.1** Use of color | ⚠ 지금 항목은 한 단계 짙은 옅은 바탕(면 위 1.15 · 다크 1.56, 호버 바탕과 1.09 · 1.20 — 펼침 메뉴의 지금 줄도 같다)과 글자 · 아이콘의 진하기(다른 항목과 2.31 · 1.74 / 2.99 · 2.20)로 알린다. 굵기는 바꾸지 않는다. 보조 기술에는 `aria-current="page"`. 사용자 결정 2026-10-08 — 굵기는 그대로, 낭독은 aria-current |
| **WCAG 1.4.13** Content on Hover or Focus | 말풍선 · 펼침 메뉴 — 옮겨 가는 동안 닫히지 않고(hoverable), `Esc` 로 닫히며(dismissible), 떠날 때까지 남는다 ✓ |
| **WCAG 2.1.1** Keyboard | 항목 · 부모 · 접기 버튼 · 펼침 메뉴 모두 `Tab` · `Enter` · `Space` · `Esc` ✓ |
| **WCAG 2.4.1** Bypass Blocks | 본문 바로가기 링크가 사이드바를 건너뛴다(Layout 의 랜드마크) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 항목 · 하위 항목 · 펼침 메뉴 줄 44, 접기 버튼 40(누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 항목 224 × 44 · 접힘 40 × 44 ✓ · 접기 버튼 누르는 영역 44 ✓ · 펼침 메뉴 줄 44 ✓ |
| **ARIA** | `<nav aria-label="주 메뉴">`, 묶음은 목록(`<ul aria-labelledby>` — 묶음 이름), 항목 링크 + 지금 화면 `aria-current="page"`, 부모 `<button aria-expanded aria-controls>`, 접기 버튼 이름 "사이드바" + `aria-expanded` · `aria-controls`. 접히면 이름 · 묶음 이름은 보이지 않게만 남는다(말풍선은 이름과 같은 글이라 설명으로 잇지 않는다). 펼침 메뉴는 디스클로저 — `role="menu"` 를 쓰지 않고, 내용은 부모로 `aria-labelledby`. 접힌 부모가 지금 화면의 하위를 품으면 부모(버튼)는 지금 항목 바탕만 칠하고 `aria-current` 를 두지 않는다 — 지금 화면은 펼침 메뉴 안의 그 링크가 `aria-current="page"` 로 알린다 |

## Do / Don't

### ✅ Do

- 1280 이상 펼침 · 768 ~ 1279 접힘 — 손으로 접은 것은 기억.
- 부모는 펼치기만, 하위가 지금이면 저절로 펼침. 하위가 사람마다 다르면 둘 이상일 때만 부모.
- 긴 이름은 줄을 바꾼다 — 그래도 짧게.
- 흰 면 + 오른쪽 선 하나, 지금 항목은 한 단계 짙은 옅은 회색(`bg-neutral-weak-pressed`) + 짙은 글자 — 굵기는 그대로.
- 접힌 사이드바 — 하위 없는 항목은 이름 말풍선, 부모는 아이콘 옆 펼침 메뉴(1280 미만이어도).

### ❌ Don't

- 768 ~ 1279 에서 펼친 채 두기(본문 512 까지 좁아진다).
- 부모를 눌러 이동하면서 펼치기.
- 이름 말줄임 · 묶음 이름 대문자 변환 · 회사 이름을 묶음 이름으로.
- 떠 있는 상자 · 본문 상자(inset) · 그림자.
- 빵부스러기로 위치를 한 번 더.
- 접힌 사이드바의 하위를 Menu Sheet 로 띄우기 · 지금 항목을 굵게(700).
- 아무 일도 하지 않는 로고 버튼 · 사용자 버튼 · 바닥의 계정 줄(Desk).
- 하위 하나짜리 부모 — 하나면 단독 항목.

## Specification

`side-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹이 Side Navigation 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — side-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#side-navigation)

## SEED 와 다른 점

- **흰 면 + 오른쪽 선** — SEED 기본 `tone=neutral` 은 회색 면(gray-100)이다. groo 본문이 회색(`bg-page`)이라 사이드바를 흰 면(`bg-layer-default`)으로 둔다(따라오는 것). `transparent` 톤은 두지 않는다.
- **투명한 상태 색을 불투명 역할로**(v102) — 호버 · 누름 `bg-layer-default-pressed`, 선 `stroke-neutral-subtle`. 지금 항목은 SEED 의 옅은 선택 바탕보다 한 단계 짙은 `bg-neutral-weak-pressed` 다(사용자 결정 2026-10-08 — `bg-neutral-weak` 는 다크에서 호버 바탕과 같은 색 #353B4D 였다). 지금 항목은 마우스를 올리거나 눌러도 바탕이 그대로다 — SEED 는 선택 · 누름 바탕(selected-pressed)이 따로 있지만 groo 에는 그보다 짙은 불투명 역할이 없다.
- **아이콘은 `fg-neutral-subtle`** — SEED palette.gray-600 은 면 위 1.97:1 이다.
- **긴 이름은 줄을 바꾼다** — SEED 문서대로다(SEED 레시피는 한 줄 말줄임).
- **처음 열 때도 폭을 본다** — SEED 코드는 창 폭이 1280 을 넘나들 때만 접고 펴서, 1000 으로 열면 펼친 채다. 768 미만의 서랍도 SEED 코드에는 없다.
- **접기 버튼은 누르는 영역 44 · 이름 "사이드바" + `aria-expanded`** — SEED 는 40 이고 이름만 "사이드바 열기" · "사이드바 닫기" 로 바꾼다. `nav` 에 이름("주 메뉴")을 단다 — SEED 는 이름이 없다.
- **접혔을 때 묶음 사이 1px 선** — SEED 는 묶음 이름 자리를 접어 간격만 남긴다(비교 페이지 8A 그림을 따랐다).
- **펼침 메뉴의 줄은 44 하나** — SEED 는 Menu `size="responsive"`(1280 미만 medium 46 · 이상 small 39)다. groo Menu 는 small 하나뿐이고 1280 미만은 Menu Sheet 라, 사이드바의 펼침 메뉴만 Menu 표면 + 줄 44 로 두고 1280 미만에서도 시트로 바꾸지 않는다 — Menu 경계의 예외(사용자 결정 2026-10-08).
- **아래 끝 흐림은 `gradient-fade-mask` 24** — 깊이는 SEED 레시피와 같다.

## Migration notes

### 2026-10-16 — 바닥 계정 · 증권 부모 · 홈 두 칸

사용자가 [구현 질문 Q-017 · Q-018 비교 페이지](https://claude.ai/artifact/6R7NBc4ByvxGyLy6E6tvKf)에서 정했다(2026-10-16).

- **바닥 계정**(Q-018-1 C) — 두지 않는다. 바닥은 보조 링크만, 비면 그리지 않는다. 설정으로 가는 항목(A) · 계정 메뉴(B) · SEED 처럼 머리에 계정(D)은 고르지 않았다.
- **증권 부모**(Q-017-4 정리) — 연결한 증권사가 둘 이상일 때만 부모(펼치기만), 하나 · 없으면 `/desk/stocks` 단독 링크(꺾쇠 없음), 구독이 없으면 숨김.
- **홈 두 칸 경계**(Q-017-6 A) — Desk 데스크톱 홈의 두 칸도 1280 부터다(사이드바가 펼쳐지는 폭 — DESIGN.md "문턱 — 768 · 1280"). 768 ~ 1279 는 한 칸.

- **Desk 웹** — 바닥 사용자 버튼(⇕ · 임시 브랜치의 설정으로 가는 이름 줄)을 걷는다. 증권은 부모가 이동 + 펼침(`GrooSidebar.tsx:96-101`)이다 — 둘 이상이면 펼치기만 · 하위 링크로. `groo.css` 의 `@media (max-width: 1100px) { .dash-grid … }` 를 1279 로(1280 부터 두 칸), `useDeviceSize` 는 mobile · desktop 둘로(`"tablet"` 을 읽는 코드는 0).

### 2026-10-10 — 하위 펼침 300ms

[펼치고 접기 · 나누기 비교 페이지](https://claude.ai/artifact/9uvjeFyjFXc7TaWnpnnQ6H) 3번에서 사용자가 아코디언의 꺾쇠 · 펼침을 SEED d6 300ms `ease-easing` 으로 정하며 사이드바 하위 펼침도 같게 했다(3A) — 그전의 d4 200ms 는 화면 틀 라운드에서 스펙 초안이 둔 값이었고 사용자가 고른 값이 아니다. 하위 펼침 · 꺾쇠 회전이 300ms 다. 모션 줄이기면 높이 움직임 없이 150ms 서서히, 꺾쇠는 바로다(v104). 사이드바 폭이 바뀌는 펼침 ↔ 접힘은 그대로 200ms 다. 지금 Desk 웹 증권 하위는 꺾쇠 150ms · 하위 목록 움직임 0, HR 은 200ms 이고 모션 줄이기를 따르지 않는다(2026-10-09 조사 §7.1 · D9).

### 2026-10-08 — 펼침 메뉴는 1280 미만에서도 · 지금 항목은 한 단계 짙게

스펙을 쓰다 남은 둘을 사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a) 12 · 13 그림으로 정했다. 접힌 사이드바(768 ~ 1279)의 하위는 누른 아이콘 옆 펼침 메뉴(Menu 표면 · 폭 200 · 줄 44 · 지금 화면 줄 표시)이고, Menu 의 "1280 미만은 Menu Sheet" 규칙의 예외로 적는다 — Menu Sheet(12B)는 고르지 않았다. 지금 항목은 바탕만 한 단계 짙게(`bg-neutral-weak-pressed` — 다크에서 호버 바탕 #353B4D 와 갈린다) 하고 글자는 500 그대로다(SEED) — 굵기 700(13A · 13C)은 고르지 않았다. 색으로만 알리는 1.4.1 ⚠ 는 사용자 결정으로 남긴다(낭독은 `aria-current`). 펼침 메뉴의 지금 줄도 같은 규칙이다. 지금 항목을 누를 때 쓸 더 짙은 불투명 역할이 없어 바탕은 그대로 두고 축소만 한다.

### 2026-10-04 — SEED Side Navigation 으로 새로 둔다(옛 Sidebar 를 대신)

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — 768 ~ 1279 는 아이콘만(56)으로 저절로 접히고 1280 이상은 펼침(240), 손으로 접고 펼 수 있고 손으로 접은 상태는 기억한다(8A). 빵부스러기는 걷고 위치는 사이드바의 지금 항목(부모 자동 펼침) + 본문 제목이 알린다(9B — HR 머리가 없어진다). 그리고 "따라오는 것" — 머리 64 + 접기 버튼 40 · 18 을 머리 안으로 · 항목 44 · 아이콘 20 · 14 / 19 · 500 · 모서리 10 · 묶음 이름 14 / 19 · 700 · 지금 항목 옅은 회색 + 짙은 글자 · 부모는 펼치기만 · 하위가 지금이면 저절로 펼침 · 접힘에서 하위 = 펼침 메뉴, 단독 = 말풍선 · 긴 이름 줄바꿈 · 흰 면 + 오른쪽 선 · HR inset 걷음. 768 ~ 1279 에서 펼친 채(8B)는 고르지 않았다. 접힌 사이드바의 하위 펼침 메뉴는 이 스펙 안에서 Menu 모양으로 정의한다(Navigation Menu 는 걷었다 — `navigation-menu.history/v-pre-seed-nav.*`). 옛 Sidebar(shadcn — 256 · 48 · 모바일 Sheet 288 · 항목 32 · 아이콘 16 · 15 · 모서리 4 · `Ctrl/⌘ + B` · 쿠키 · floating · inset)는 걷었다 — 옛 스펙은 `sidebar.history/v-pre-seed-nav.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀다).

- **Desk 웹** — `widgets/layout/ui/GrooSidebar.tsx:186-263` · `widgets/layout/model/nav.ts:34-61` 위 shadcn `shared/ui/sidebar.tsx`. 256 · 접힘 48 · 항목 32 · 14 / 400 · 아이콘 16 · 지금 항목 #F0F2F7 + 500. 768 · 1024 · 1100 에서도 256 으로 펼쳐져 본문이 512 까지 좁아진다(F24). 주 메뉴가 `nav` 가 아니라 `div` + 목록이다(`sidebar.tsx:216-251`, F16). "증권" 은 누르면 이동 + 펼침이다(`GrooSidebar.tsx:108-112`) — 펼치기만으로. 접힌 로고 버튼 이름이 "" 이고 눌러도 아무 일이 없으며, 사용자 버튼(⇕)도 동작이 없다(`:193-213 · 226-256`, F15).
- **HR 웹** — `widgets/sidebar/ui/AppSidebar.tsx:66-82` · `SidebarContent.tsx:81-190` · `SidebarFooter.tsx:72-134` · `shared/ui/shadcn/treeView.tsx`. 288 inset(본문 상자 모서리 12 · 그림자 — `widgets/layout/ui/Layout.tsx:16-31`) · 접힘 66. 실제 화면인 잎 항목이 `div` + onClick 이라 키보드로 닿지 않고 누르면 초점이 body 로 간다(`treeView.tsx:416-447`, 부모는 Accordion `h3` — `:299-355 · 457`, F1). 묶음 이름 2.54 · 메뉴 글 4.23(F18), 묶음 이름이 회사 이름("SKC")이고 묶음 "관리자" 안에 항목 "관리자" 가 있다(F28).
- **접힘 기억** — 두 웹 모두 쿠키 `sidebar_state` 를 쓰기만 하고 읽지 않아 새로 고치면 펼쳐진다(웹 `sidebar.tsx:60-77` · HR `shadcn/sidebar.tsx:69-86`, F14). localStorage 로.
- **접힌 사이드바** — Desk 는 말풍선만(하위는 숨김), HR 은 말풍선 + 눌러 여는 하위 메뉴(`SidebarContent.tsx:134-172`)다. 말풍선 · 펼침 메뉴로.
- **이름이 영어** — "Toggle Sidebar"(접기 · 레일) · 모바일 시트 "Sidebar" · "Displays the mobile sidebar."(F26). "사이드바" · "주 메뉴" 로.
- 앱 적용 때 정할 자리 — HR 계정 메뉴(바닥 — HR 적용 때), 사이드바 항목 이름과 화면 제목 맞추기("통계 · 분석" · "통계"). Desk 사용자 버튼(⇕)은 2026-10-16 걷기로 정했다(위).
