# Side Navigation

> 데스크톱(768 이상)의 주 메뉴입니다. 화면 왼쪽의 세로 띠(사이드바)에 서비스의 최상위 화면들을 묶어 둡니다. 1280 이상은 펼침 240, 768 ~ 1279 는 아이콘만 56 으로 저절로 접히고, 손으로 접고 펼 수 있습니다. 768 미만에서는 없습니다 — Desk 웹은 [Bottom Navigation](bottom-navigation.md), HR 은 ☰ 로 여는 왼쪽 [Side Panel](side-panel.md) 에 같은 항목을 담습니다. 다른 이동 부품([Top Navigation](top-navigation.md) · [Tabs](tabs.md))과 고르는 표는 DESIGN.md Layout 의 "이동 부품 고르기" 한 곳에 있습니다.

수치 원본은 [`side-navigation.yaml`](side-navigation.yaml)입니다.

[그림: Desk 가계부 · HR 휴가 현황 — 펼침 240 · 접힘 56, 라이트 · 다크](../../site/components/specs/side-navigation.tsx#hero)

### 직접 골라 보기

창 폭(768 ~ 1279 · 1280 이상) · 손으로 접기 · 지금 화면 · 하위가 있는 항목 · 긴 이름 · 서비스(Desk · HR)를 고르면 스펙대로 그린 사이드바와 그 코드가 바뀝니다. 접힌 사이드바에서 항목에 마우스를 올리면 이름 말풍선이, 하위가 있는 항목은 펼침 메뉴가 열립니다.

[그림: 플레이그라운드](../../site/components/specs/side-navigation.tsx#playground)

## Anatomy

[그림: 사이드바는 머리(로고 · 접기 버튼) · 내용(묶음 이름 · 항목 · 하위 항목) · 바닥으로, 흰 면 + 오른쪽 1px 선](../../site/components/specs/side-navigation.tsx#anatomy)

| ⓐ Root | 사이드바 — 화면 왼쪽, 높이 전체. 흰 면 + 오른쪽 1px 선입니다. 본문과 따로 스크롤됩니다. |
| ⓑ Header | 머리 — 서비스 마크 · 이름과 접기 버튼입니다. 고정입니다. |
| ⓒ Trigger | 접기 버튼 — 펼침 ↔ 접힘을 바꿉니다. |
| ⓓ Content | 내용 — 묶음과 항목입니다. 넘치면 이 안에서만 스크롤하고, 머리 아래 선 · 아래 끝 흐림이 생깁니다. |
| ⓔ Group | 묶음 — 이름(있을 때만)과 항목 여럿입니다. |
| ⓕ Item | 항목 — 아이콘 + 이름입니다. 하위가 있으면 꺾쇠가 붙습니다. |
| ⓖ Sub Item | 하위 항목 — 아이콘 없이 이름만 둡니다. |
| ⓗ Footer | 바닥 — 보조 링크(설명서 · 문의)입니다. 고정이고, 비면 없습니다. 계정은 두지 않습니다(그루 이음은 예외 — 계정 줄 + 메뉴, 아래 "바닥"). |

[표: 부위](side-navigation.yaml#slots)

## Properties

### 펼침 · 접힘

1280 이상은 펼침(240)이 기본이고, 768 ~ 1279 는 아이콘만(56)으로 저절로 접힙니다 — 좁은 화면에서 본문을 넓게 두기 위해서입니다. 머리의 접기 버튼으로 어느 폭에서나 손으로 접고 펼 수 있고, 손으로 접은 상태는 기억합니다(아래 "폭으로 · 손으로"). 접히면 이름 · 묶음 이름 · 꺾쇠 · 하위 항목이 보이지 않고, 묶음 사이에 1px 선이 남습니다.

[그림: 펼침 240 · 접힘 56 — 1280 · 1024 의 본문 폭](../../site/components/specs/side-navigation.tsx#collapse)

[표: 펼침 · 접힘](side-navigation.yaml#collapsed)

[표: 사이드바](side-navigation.yaml#base.enabled@root)

### 머리 · 접기 버튼

머리는 높이 64 · 안쪽 8 이고(머리 · 접기 버튼 · 항목 최소 44 · 아이콘은 px 입니다 — 글자 크기를 따르지 않습니다), 왼쪽에 서비스 마크 24 + 이름(16 / 22 · 700, "그루 담다" · "그루 이음" — 글자 크기 설정을 따르지 않습니다), 오른쪽에 접기 버튼이 있습니다. 접기 버튼은 상자 40 · 아이콘 18(`fg-neutral-subtle`) · 모서리 8 이고 누르는 영역은 44 입니다. 접히면 로고는 숨고 접기 버튼이 56 의 가운데에 섭니다. 로고는 누르지 않습니다 — 홈은 첫 항목입니다.

[그림: 머리 — 마크 · 이름 · 접기 버튼 40, 접히면 버튼만 가운데](../../site/components/specs/side-navigation.tsx#header)

[표: 머리](side-navigation.yaml#base.enabled@header)

[표: 로고](side-navigation.yaml#base.enabled@logo)

[표: 접기 버튼](side-navigation.yaml#base.enabled@trigger)

### 묶음 · 항목

묶음 이름은 14 / 19 · 700 · `fg-neutral-muted`, 묶음 사이는 8 입니다. 항목은 최소 44 · 좌우 8 · 모서리 10, 아이콘 20(`fg-neutral-subtle`) · 아이콘 ↔ 이름 12 · 이름 14 / 19 · 500(`fg-neutral-muted`)입니다. 이름이 길면 말줄임하지 않고 줄을 바꿉니다 — 항목이 그만큼 늘어납니다. 그래도 이름은 짧게 씁니다("상품 정보 관리" 대신 "상품 관리").

[그림: 묶음 · 항목 · 긴 이름의 줄바꿈](../../site/components/specs/side-navigation.tsx#items)

[표: 항목](side-navigation.yaml#base.enabled@item)

[표: 항목 아이콘](side-navigation.yaml#base.enabled@itemIcon)

[표: 항목 이름](side-navigation.yaml#base.enabled@itemLabel)

[표: 묶음 이름](side-navigation.yaml#base.enabled@groupLabel)

### 지금 항목

지금 화면의 항목은 옅은 회색 바탕(`bg-neutral-weak-pressed`) + 짙은 아이콘 · 이름(`fg-neutral`)입니다. 바탕은 한 단계 짙은 회색이라, 다크에서도 마우스를 올린 바탕(`bg-layer-default-pressed`)과 갈립니다. 굵기(500) · 크기는 바꾸지 않습니다. 지금 항목에 마우스를 올리거나 눌러도 바탕은 그대로이고, 누르면 아이콘 · 이름만 줄어듭니다. 펼침 메뉴의 지금 화면 줄도 같은 바탕입니다. 하위가 지금 화면이면 하위 항목이 지금 항목이고 부모는 저절로 펼쳐집니다 — 접힌 사이드바에서는 하위가 지금인 부모가 지금 항목입니다.

[그림: 지금 항목 — 옅은 회색 + 짙은 글자, 하위가 지금이면 부모가 펼쳐진 채](../../site/components/specs/side-navigation.tsx#current)

[표: 지금 항목](side-navigation.yaml#current)

### 하위 항목

하위가 있는 항목(부모)은 누르면 하위 목록을 펼치고 접기만 합니다 — 그 자체로 어떤 화면으로도 가지 않습니다. 오른쪽 꺾쇠 16 이 접혀 있으면 아래, 펼치면 위를 가리킵니다. 하위 항목은 아이콘 없이 이름만 두고 부모 이름과 같은 자리(40)에서 시작합니다. 하위가 없는 항목은 누르면 바로 그 화면으로 갑니다.

[그림: 부모는 펼치기만 — 꺾쇠 · 하위 항목 40 · 지금 하위](../../site/components/specs/side-navigation.tsx#sub-items)

[표: 하위 항목](side-navigation.yaml#base.enabled@subItem)

[표: 꺾쇠](side-navigation.yaml#base.enabled@chevron)

### 스크롤 — 머리 아래 선 · 끝 흐림

머리 · 바닥은 고정이고 내용만 스크롤됩니다. 내용이 위 끝에서 떨어지면 머리 아래에 1px 선(`stroke-neutral-subtle`)이 생기고, 내용 아래 끝 24 는 늘 흐립니다(`gradient-fade-mask` — 끝까지 내리면 흐림이 빈 여백 위에 놓입니다). 이 흐림은 사이드바의 제 안개입니다([Scroll Fog](scroll-fog.md) 의 "부품이 제 안개를 가진 자리").

[그림: 스크롤한 사이드바 — 머리 아래 선 · 아래 끝 흐림 24](../../site/components/specs/side-navigation.tsx#scroll)

[표: 내용](side-navigation.yaml#base.enabled@content)

[표: 머리 아래 선](side-navigation.yaml#base.enabled@divider)

[표: 끝 흐림](side-navigation.yaml#base.enabled@fog)

### 접혔을 때 — 말풍선 · 펼침 메뉴

접힌 사이드바에서 하위가 없는 항목에 마우스를 올리거나 키보드 초점이 오면 오른쪽에 이름 말풍선이 뜹니다([Help Bubble](help-bubble.md) 의 툴팁). 하위가 있는 항목은 오른쪽에 펼침 메뉴가 열려 하위 목록을 보입니다 — 표면은 [Menu](menu.md) 와 같고(`bg-layer-floating` · 모서리 20 · `shadow-s3` · 폭 200), 맨 위에 부모 이름을 두며, 줄은 높이 44 입니다. 마우스를 올리면 200ms 뒤에 열리고 떠나면 100ms 뒤에 닫히며, 누르거나 `Enter` · `Space` 로도 엽니다. 지금 화면의 줄은 지금 항목과 같은 바탕입니다. 1280 미만이어도 [Menu Sheet](menu-sheet.md) 로 바꾸지 않습니다 — 아래 "접힌 사이드바의 하위".

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
| `disabled` | 아이콘 · 이름 `fg-disabled`, 누르지 못합니다 |

[그림: 상태 — 호버 · 누름 · 포커스 · 지금 · 막힘](../../site/components/specs/side-navigation.tsx#states)

[표: 상태 — 항목](side-navigation.yaml#matrix@item)

[표: 상태 — 지금 항목](side-navigation.yaml#matrix.current.current@item)

[표: 모션](side-navigation.yaml#motion)

## Guidelines

### 폭으로 · 손으로

| 창 폭 | 기본 | 손으로 |
|---|---|---|
| 1280 이상 | 펼침 240 | 접을 수 있습니다 — 접은 상태를 기억해 다음에도 접힌 채 엽니다 |
| 768 ~ 1279 | 접힘 56 | 펼 수 있습니다 — 본문이 그만큼 좁아집니다. 다시 열면 접힌 채입니다 |
| 768 미만 | 없음 | Desk 는 하단 탭 바, HR 은 ☰ → 왼쪽 주 메뉴(Side Panel) |

기본은 창 폭으로 정하고, 창 폭이 1280 을 넘나들면 다시 정합니다 — 처음 열 때도 폭을 봅니다. 손으로 접은 것은 브라우저에 기억합니다(localStorage) — 서버 쿠키가 아닙니다.

[그림: 폭으로 — 1440 펼침 · 1024 접힘 · 1024 에서 손으로 펼침](../../site/components/specs/side-navigation.tsx#width-guide)

### 768 미만 — 같은 항목을 다른 그릇에

768 미만에서 사이드바는 없습니다. Desk 웹은 앱과 같은 [Bottom Navigation](bottom-navigation.md) 을 쓰고, HR 은 [Top Navigation](top-navigation.md) 의 ☰ 로 여는 왼쪽 [Side Panel](side-panel.md) 에 같은 묶음 · 항목을 펼친 모양으로 담습니다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힙니다.

[그림: HR 1280 사이드바 · 폰 ☰ 주 메뉴 — 같은 항목](../../site/components/specs/side-navigation.tsx#mobile-guide)

### 접힌 사이드바의 하위 — 옆 펼침 메뉴(Menu 경계의 예외)

768 ~ 1279 의 접힌 사이드바에서 하위가 있는 항목은 누른 아이콘 옆 8 에 펼침 메뉴를 띄웁니다 — [Menu](menu.md) 표면 · 폭 200 · 줄 44 · 지금 화면 줄 표시입니다. 이 폭은 Menu 가 [Menu Sheet](menu-sheet.md) 로 바뀌는 1280 미만이지만, 사이드바의 하위 목록은 시트로 바꾸지 않습니다 — Menu 의 "1280 미만은 Menu Sheet" 규칙의 예외입니다. 줄을 Menu 의 39 가 아니라 44 로 두는 것은 이 폭에 터치 태블릿이 섞이기 때문입니다. 마우스는 200ms 뒤 열고 100ms 뒤 닫으며, 누르거나 키보드로도 엽니다(Behavior).

### 부모는 펼치기만, 지금 화면이면 저절로

하위가 있는 항목은 이동하지 않고 펼치기만 합니다 — "증권" 을 누르면 나무증권 · 토스증권이 펼쳐질 뿐입니다. 하위 하나가 지금 화면이면 부모는 사용자가 손대지 않아도 펼쳐진 채입니다. 부모에 따로 갈 화면이 필요하면 하위 첫 줄에 둡니다("전체 보기").

[그림: 증권 — 이동 + 펼침 · 펼치기만](../../site/components/specs/side-navigation.tsx#parent-guide)

### 하위가 사람마다 다르면 — 둘 이상일 때만 부모

하위가 사용자마다 달라지는 항목(Desk 증권 — 연결한 증권사)은 하위가 둘 이상일 때만 부모입니다(펼치기만, 하위 = 연결한 증권사). 하나 · 없으면 하위 없는 단독 항목이 되어 누르면 바로 그 화면으로 갑니다 — 꺾쇠가 없습니다. 증권 화면은 연결이 하나면 그 증권사를, 없으면 연결 안내를 엽니다. 구독이 없으면 항목을 두지 않습니다(Pro 전용 항목은 증권뿐입니다). 하위 하나짜리 나무는 만들지 않습니다 — 고를 것이 없기 때문입니다. 접힌 사이드바에서는 둘 이상이면 펼침 메뉴, 하나 · 없으면 이름 말풍선입니다.

[그림: 증권사 0 · 1 · 2 · 3 — 단독 항목 · 부모](../../site/components/specs/side-navigation.tsx#dynamic-guide)

### 위치는 사이드바가 알립니다

데스크톱에서 지금 어디에 있는지는 사이드바의 지금 항목(부모는 저절로 펼침)과 본문 맨 위 제목이 알립니다 — 빵부스러기(Breadcrumb)는 두지 않습니다. 경로가 모두 사이드바 항목이라 빵부스러기는 같은 정보를 두 번 보이기 때문입니다. 사이드바에 없는 하위 페이지(그루 담다 밤하늘 · 증권 종목 상세 · 자산 상세, 그루 이음 공지 상세 같은)는 데스크톱(768 이상)에서 제목 줄 위에 "‹ {부모}" 글 단추를 둡니다 — [Button](button.md) ghost small · 앞 꺾쇠 14 이고, 누르면 적힌 부모로 갑니다(라벨 = 목적지). 폰(768 미만)은 상단 바의 ← 가 들어온 화면으로 돌아갑니다.

[그림: HR 휴가 현황 — 사이드바 지금 항목(휴가 › 휴가 현황) + 본문 제목, 빵부스러기 없음](../../site/components/specs/side-navigation.tsx#position-guide)

### 묶음 · 이름

- 묶음은 성격이 다른 항목을 나눌 때만 둡니다 — 묶음 이름은 짧은 명사("기록" · "관리")입니다. 회사 이름처럼 바뀌는 말을 묶음 이름으로 두지 않습니다.
- 같은 이름의 묶음과 항목을 두지 않습니다(묶음 "관리자" 안의 항목 "관리자").
- 항목 이름은 화면 이름과 같게 씁니다 — 사이드바 "통계 · 분석" 과 화면 제목 "통계" 처럼 갈리지 않게 합니다.
- 아이콘은 모든 항목에 두고(하위 항목은 없음), lucide 선 아이콘 20 입니다.

### 바닥 — 보조 링크만, 비면 그리지 않습니다

바닥에는 보조 링크(설명서 · 문의)만 둡니다 — 비면 그리지 않습니다. 계정(아바타 · 이름)은 바닥에 두지 않습니다 — Desk 는 계정이 하나라 바꿀 일이 없고 설정 · 로그아웃은 머리의 ⚙ 가 맡습니다. Desk 웹에는 보조 링크가 없어 바닥을 그리지 않습니다. 그루 이음은 예외입니다 — 데스크톱 머리(⚙)가 없어 바닥에 계정 줄을 두고, 누르면 메뉴(내 정보 · 비밀번호 바꾸기 · 화면 테마 · 로그아웃)가 열립니다. 이 메뉴는 768 ~ 1279 에서도 Menu Sheet 가 아니라 줄 오른쪽 · 아래 끝 맞춤 [Menu](menu.md) 입니다(줄 44 — 펼침 메뉴와 같은 예외, [Menu](menu.md) 의 "1280 에서 Menu Sheet 로"). 768 미만 옆 패널 안 계정 줄은 Menu Sheet 입니다. 누르는 것으로 보이는 줄은 반드시 무언가를 합니다.

[그림: 바닥 — 바닥을 그리지 않음 · 눌러도 아무 일 없는 이름 줄](../../site/components/specs/side-navigation.tsx#footer-guide)

### 두지 않는 것

shadcn Sidebar 에 있던 것 가운데 다음은 두지 않습니다 — groo 화면에 쓸 자리가 없습니다.

| shadcn | 두지 않는 까닭 |
|---|---|
| `⌘` / `Ctrl` + `B` 단축키 | 브라우저 · 화면 읽기 프로그램의 단축키와 겹치고, 알 길이 없습니다. 접기 버튼이 있습니다 |
| 쿠키로 기억(`sidebar_state`) | 기억은 브라우저(localStorage)에 둡니다 |
| `floating` · `inset` 모양 | 떠 있는 상자 · 본문 상자(inset — 모서리 12 · 그림자) 없이 흰 면 + 선 하나로 둡니다 |
| `offcanvas`(화면 밖으로 숨김) · 오른쪽 사이드바 | 접힘은 아이콘만(56) 하나, 왼쪽만 둡니다. 768 미만의 서랍은 Side Panel 입니다 |
| 768 미만 자동 Sheet | 768 미만은 Desk 하단 탭 바 · HR ☰ + Side Panel 입니다 |

## 코드

레시피 `recipes/shadcn/components/ui/side-navigation.tsx` 를 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

- `SideNavigation` — 사이드바(`<nav aria-label="주 메뉴">`)입니다. `collapsed` · `defaultCollapsed` · `onCollapsedChange`(손으로 다룰 때). 주지 않으면 창 폭(768 ~ 1279 접힘 · 1280 이상 펼침) + 손으로 접은 기억(`localStorage` 의 `groo:side-navigation-collapsed`)으로 정합니다.
- `SideNavigationHeader` — 머리입니다. `logo`(마크 + 서비스 이름). 접기 버튼(이름 "사이드바" · `aria-expanded` · `aria-controls`)을 스스로 그립니다.
- `SideNavigationContent` — 내용(스크롤 · 머리 아래 선 · 끝 흐림)입니다. 768 미만의 주 메뉴 서랍(Side Panel)에는 이것만 넣습니다 — `SideNavigation` 밖에서 쓰면 스스로 `<nav aria-label="주 메뉴">` 가 되고, 펼친 모양으로 그립니다(서랍의 스크롤 · 흐림은 Side Panel 본문이 맡습니다). `onNavigate`(항목을 눌러 이동할 때 — 서랍을 닫습니다).
- `SideNavigationGroup` — 묶음입니다. `label`(있을 때만).
- `SideNavigationItem` — 항목입니다. 하위가 없으면 링크 — `href` · `icon` · `label` · `current`(`aria-current="page"`) · `disabled`. 자식으로 `SideNavigationSubItem` 을 둘 이상 주면 부모(버튼 — `aria-expanded` · `aria-controls`, 하위가 `current` 면 저절로 펼침, `defaultOpen`)가 됩니다. 하위가 하나 이하이면 부모를 만들지 않고 `href` 의 단독 링크로 그립니다(`href` 가 없으면 그 하나의 `href` — 하위가 지금이면 지금 항목) — 하위가 사람마다 다른 항목(증권)을 그대로 넘겨도 됩니다. 접히면 하위가 없는 항목은 이름 말풍선, 부모는 펼침 메뉴를 스스로 그립니다.
- `SideNavigationSubItem` — 하위 항목(링크)입니다. `href` · `label` · `current` · `disabled`.
- `SideNavigationFooter` — 바닥 — 보조 링크(설명서 · 문의)입니다. 비면 그리지 않습니다. 계정을 넣지 않습니다(그루 이음은 계정 줄 + 메뉴).

앱은 사이드바가 없습니다(늘 폰 틀).

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
| 항목 누르기 | 그 화면으로 갑니다 — 초점 · 스크롤은 Top Navigation 의 "화면을 옮길 때" 를 따릅니다 |
| 부모 누르기 · `Enter` · `Space` | 하위를 펼치고 접습니다 — 이동하지 않습니다. 하위가 300ms 로 펼쳐지고 꺾쇠도 같은 시간에 돕니다(Accordion 과 같습니다) |
| 접기 버튼 | 펼침 ↔ 접힘 200ms. 1280 이상에서 접으면 기억합니다 |
| 창 폭이 1280 을 넘나듦 | 기본으로 돌아갑니다 — 1280 이상 펼침(접어 둔 기억이 있으면 접힘), 미만 접힘 |
| 내용 스크롤 | 머리 아래 선이 나타납니다 · 아래 끝 흐림은 늘 있습니다 |
| 접힌 항목에 마우스(하위 없음) | 200ms 뒤 이름 말풍선이 뜨고 · 떠나면 100ms 뒤 닫힙니다. 키보드 초점이면 바로 뜹니다 |
| 접힌 부모에 마우스 | 200ms 뒤 펼침 메뉴가 열립니다(다른 펼침 메뉴가 열려 있으면 바로) · 메뉴로 옮겨 가는 동안 닫히지 않습니다 · 떠나면 100ms 뒤 닫힙니다 |
| 접힌 부모 누르기 · `Enter` · `Space` | 펼침 메뉴를 열고 닫습니다 — 키보드로 열면 첫 줄로 초점을 옮기고, 마우스 · 터치로 열면 초점을 옮기지 않습니다 |
| 펼침 메뉴에서 `Esc` · 바깥 누르기 · `Tab` 으로 나감 | 닫습니다 — `Esc` 면 초점은 부모로 갑니다 |
| `Tab` | 접기 버튼 → 항목 차례(펼쳐진 하위 포함) → 바닥 순서입니다 |
| 글자 크기 설정 | 항목 이름 · 묶음 이름 · 말풍선 · 펼침 메뉴 글이 커지고 줄을 바꿔 받습니다 — 항목은 최소 높이라 글을 따라 늘어나고 사이드바 폭은 그대로입니다. 머리의 로고 이름 · 마크 · 접기 버튼 · 아이콘은 그대로입니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 · 묶음 이름 `fg-neutral-muted` 면(`bg-layer-default`) 위 7.11 · 다크 7.70, 호버 바탕 위 6.70 · 5.93, 지금 항목 `fg-neutral` 옅은 회색 위 14.26 · 8.62 ✓. 펼침 메뉴 줄 16.41 · 11.62(지금 줄 14.26 · 8.62) · 묶음 이름 5.50 · 5.27 ✓ |
| **WCAG 1.4.4** Resize text | 항목 · 묶음 이름 · 펼침 메뉴 글이 글자 크기 설정을 따르고 줄을 바꿔 받아 잘리지 않습니다 ✓. 로고 이름은 예외입니다 — 머리 높이 안에 서는 틀이라 커지지 않습니다. 로고는 서비스를 알리는 브랜드 표시이고, 화면에서 읽을 내용은 항목 · 화면 제목이 커진 글로 보입니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral-subtle` 5.50 · 6.09(호버 바탕 위 5.18 · 4.68), 접기 버튼 같은 값 ✓. 키보드 포커스 링 Desk 8.38 · 6.10 · HR 8.17 · 6.07(지금 항목 위 Desk 7.28 · 3.91 · HR 7.10 · 3.90) ✓. 면 · 오른쪽 선(본문과 1.08 · 1.07)은 장식입니다 |
| **WCAG 1.4.1** Use of color | ⚠ 지금 항목은 한 단계 짙은 옅은 바탕(면 위 1.15 · 다크 1.56, 호버 바탕과 1.09 · 1.20 — 펼침 메뉴의 지금 줄도 같습니다)과 글자 · 아이콘의 진하기(다른 항목과 2.31 · 1.74 / 2.99 · 2.20)로 알립니다. 굵기는 바꾸지 않습니다. 보조 기술에는 `aria-current="page"` 로 알립니다 |
| **WCAG 1.4.13** Content on Hover or Focus | 말풍선 · 펼침 메뉴 — 옮겨 가는 동안 닫히지 않고(hoverable), `Esc` 로 닫히며(dismissible), 떠날 때까지 남습니다 ✓ |
| **WCAG 2.1.1** Keyboard | 항목 · 부모 · 접기 버튼 · 펼침 메뉴 모두 `Tab` · `Enter` · `Space` · `Esc` ✓ |
| **WCAG 2.4.1** Bypass Blocks | 본문 바로가기 링크가 사이드바를 건너뜁니다(Layout 의 랜드마크) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 항목 · 하위 항목 · 펼침 메뉴 줄 44, 접기 버튼 40(누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 항목 224 × 44 · 접힘 40 × 44 ✓ · 접기 버튼 누르는 영역 44 ✓ · 펼침 메뉴 줄 44 ✓ |
| **ARIA** | `<nav aria-label="주 메뉴">`, 묶음은 목록(`<ul aria-labelledby>` — 묶음 이름), 항목 링크 + 지금 화면 `aria-current="page"`, 부모 `<button aria-expanded aria-controls>`, 접기 버튼 이름 "사이드바" + `aria-expanded` · `aria-controls`. 접히면 이름 · 묶음 이름은 보이지 않게만 남습니다(말풍선은 이름과 같은 글이라 설명으로 잇지 않습니다). 펼침 메뉴는 디스클로저입니다 — `role="menu"` 를 쓰지 않고, 내용은 부모로 `aria-labelledby`. 접힌 부모가 지금 화면의 하위를 품으면 부모(버튼)는 지금 항목 바탕만 칠하고 `aria-current` 를 두지 않습니다 — 지금 화면은 펼침 메뉴 안의 그 링크가 `aria-current="page"` 로 알립니다 |

## Do / Don't

### ✅ Do

- 1280 이상은 펼치고 768 ~ 1279 는 접습니다 — 손으로 접은 것은 기억합니다.
- 부모는 펼치기만 하고, 하위가 지금이면 저절로 펼칩니다. 하위가 사람마다 다르면 둘 이상일 때만 부모로 둡니다.
- 긴 이름은 줄을 바꿉니다 — 그래도 짧게 씁니다.
- 흰 면 + 오른쪽 선 하나로 두고, 지금 항목은 한 단계 짙은 옅은 회색(`bg-neutral-weak-pressed`) + 짙은 글자로 알립니다 — 굵기는 그대로입니다.
- 접힌 사이드바에서 하위 없는 항목은 이름 말풍선, 부모는 아이콘 옆 펼침 메뉴로 보입니다(1280 미만이어도).

### ❌ Don't

- 768 ~ 1279 에서 펼친 채 두기(본문이 512 까지 좁아집니다).
- 부모를 눌러 이동하면서 펼치기.
- 이름 말줄임 · 묶음 이름 대문자 변환 · 회사 이름을 묶음 이름으로.
- 떠 있는 상자 · 본문 상자(inset) · 그림자.
- 빵부스러기로 위치를 한 번 더.
- 접힌 사이드바의 하위를 Menu Sheet 로 띄우기 · 지금 항목을 굵게(700).
- 아무 일도 하지 않는 로고 버튼 · 사용자 버튼 · 바닥의 계정 줄(Desk).
- 하위 하나짜리 부모 — 하나면 단독 항목.

## Specification

`side-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹이 Side Navigation 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — side-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#side-navigation)
