# Top Navigation

> 화면 맨 위의 바(상단 바) — 지금 화면의 이름과 이동(뒤로 · 닫기 · 주 메뉴), 화면의 동작 두셋을 둔다. 폰(Desk 앱 · Desk 웹 768 미만 · HR 웹 768 미만)의 모든 화면과 데스크톱(768 이상)의 머리가 이것이다. 탭 사이를 오가는 것은 [Bottom Navigation](bottom-navigation.md), 데스크톱의 메뉴는 [Side Navigation](side-navigation.md), 화면 안에서 구역을 나누는 것은 [Tabs](tabs.md) 다.

구조는 당근 [SEED Top Navigation](https://seed-design.io/components/top-navigation)(Apache-2.0)을 따른다 — "화면 상단에 위치하여 탐색 인터페이스를 제공하는 네비게이션 컴포넌트" 로, 앱의 최상위 탭에서 쓰는 **Root** 와 "2-depth 이상의 화면에서" 쓰는 **Standard** 두 타입, 왼쪽(뒤로 · 닫기) · 가운데(제목) · 오른쪽(아이콘 · 글 버튼) 세 자리. 높이 56 · 아이콘 버튼 44 · 아이콘 24 · 화면 끝 6 은 SEED 값 그대로다. 데스크톱 머리(GNB)는 SEED 에 컴포넌트가 없어 porest 가 같은 규칙으로 더했다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-04 사용자 결정). porest 에 처음 두는 컴포넌트다 — 지금 제품마다 다른 머리(56 · 58 · 48, 아이콘 버튼 36 · 40 · 48)를 대신한다.

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
| `desktop` | 데스크톱(768 이상)의 머리 — Desk | 없음(왼쪽 자리는 검색 입구 — 앱 적용 때) | 없음 — 본문 맨 위 `h1` | 주 버튼 하나 + 아이콘 버튼 |

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

오른쪽 자리에 하나만 둔다("완료" · "모두 읽음") — 높이 44 · 좌우 10 · 16 / 22 · 500. 글 버튼과 아이콘 버튼을 함께 두지 않는다.

[표: 글 버튼](top-navigation.yaml#base.enabled@textButton)

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

768 이상의 Desk 웹은 [Side Navigation](side-navigation.md) 오른쪽 · 본문 위에 머리(`desktop`)를 둔다 — 높이 56, 선 없음, 오른쪽에 주 버튼 하나([Button](button.md) `brandSolid` small — "내역 추가")와 아이콘 버튼 3개까지(금액 가리기 · 알림 · 설정), 맨 끝 아이콘 버튼의 상자가 화면 끝에서 6. 화면 제목은 머리가 아니라 본문 맨 위 `h1` 이다(`text-screen-title` 26 / 35 · 700, 머리 아래 `spacing-nav-to-title` 20). 접기 버튼은 Side Navigation 머리에, 테마는 설정에 있다. HR 은 데스크톱 머리를 두지 않는다 — 접기 버튼은 Side Navigation 머리로, 테마는 설정으로 갔고 위치는 Side Navigation 의 지금 항목이 알린다(빵부스러기는 걷었다). 머리가 없으면 본문은 화면 위 32(`layout-margin` — 본문 좌우 여백과 같다)에서 화면 제목부터 시작한다.

[그림: Desk 데스크톱 — 사이드바 오른쪽 머리 56 · 주 버튼 + 아이콘 셋 · 본문 h1](../../site/components/specs/top-navigation.tsx#desktop-guide)

### HR 폰 — ☰ 와 주 메뉴

HR 웹 768 미만은 하단 탭 바가 없다 — 모든 화면이 `standard` 이고 왼쪽에 ☰ 를 둔다(이름 "주 메뉴"). 누르면 왼쪽 [Side Panel](side-panel.md) 이 열려 [Side Navigation](side-navigation.md) 의 항목을 보인다 — 지금 화면의 묶음이 펼쳐진 채 열리고, 항목을 누르면 이동하고 닫힌다. 사이드바 항목이 아닌 상세 화면은 ☰ 대신 ← 다.

[그림: HR 폰 — ☰ + 휴가 현황, 누르면 왼쪽 주 메뉴](../../site/components/specs/top-navigation.tsx#menu-guide)

### 화면을 옮길 때

다른 화면으로 옮기면(링크 · 탭 · 사이드바 항목) 스크롤을 맨 위로 보내고 초점을 그 화면의 제목(`h1`)으로 옮긴다 — 키보드 · 스크린리더가 새 화면의 처음에서 시작한다. 문서 제목(브라우저 탭)은 화면마다 "{화면 제목} - Porest Desk" · "{화면 제목} - Porest HR" 이다. 뒤로 가기로 돌아오면 그 화면의 스크롤 위치를 돌려놓는다. 하단 탭을 오갈 때의 스크롤은 [Bottom Navigation](bottom-navigation.md) 이 정한다(탭마다 기억).

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
- `TopNavigationActions` — 오른쪽 자리. 자식은 `TopNavigationIconButton` 3개까지 또는 `TopNavigationTextButton` 하나, `desktop` 이면 맨 앞에 `TopNavigationPrimaryButton` 하나.
- `TopNavigationIconButton` — 상자 44 · 아이콘 24. `aria-label` 필수, `notification`(벨의 알림 점 — 이름에 "새 알림 있음" 을 넣는 것은 부르는 쪽), `<button type="button">` 속성. `aria-pressed` 를 주면 켜고 끄는 단추다 — 이름은 그대로 두고, 아이콘은 지금 상태를 넘긴다. 켬은 선 2.5, 끔은 선 2 이고 색은 켬 · 끔 모두 이웃 버튼과 같은 `fg-neutral` 이다 — [Toggle](toggle.md) 의 흐린 끔(`fg-neutral-muted`)은 상단 바에서 쓰지 않는다. 아이콘 줄에서 하나만 흐리면 막힌 단추처럼 보인다(사용자 결정 2026-10-09 19B).
- `TopNavigationTextButton` — 글 버튼(`<button type="button">`).
- `TopNavigationPrimaryButton` — 데스크톱 머리의 주 버튼([Button](button.md) `brandSolid` · `small` 그대로 + 오른쪽 8).
- `ScreenTitle` — 데스크톱 본문 맨 위 제목(`<h1 tabIndex={-1} data-screen-title>` · `text-screen-title`).
- `TopNavigationProvider` — `product`("Porest Desk" · "Porest HR"). `useScreenTitle(title)` 가 문서 제목을 "{title} - {product}" 로 쓴다.
- `focusScreenTitle()` — 셸이 화면을 옮긴 뒤 부른다: 본문 스크롤을 맨 위로, `[data-screen-title]` 에 초점(링은 키보드로 왔을 때만).

앱은 같은 값을 Dart 로 둔다(`PTopNavigation` — `AppBar` 대신, 제목은 `Semantics(header: true)`).

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

### 데스크톱 머리 — Desk

[그림: Desk 데스크톱 머리 — 주 버튼 + 아이콘 셋, 본문 제목](../../site/components/specs/top-navigation.tsx#ex-desktop)

```tsx
import { Bell, Eye, EyeOff, Plus, Settings } from "lucide-react"
import { ScreenTitle, TopNavigation, TopNavigationActions, TopNavigationIconButton, TopNavigationPrimaryButton } from "@/components/ui/top-navigation"

<TopNavigation type="desktop">
  <TopNavigationActions>
    <TopNavigationPrimaryButton onClick={openAddTransaction}><Plus />내역 추가</TopNavigationPrimaryButton>
    {/* 켜고 끄는 단추 — 이름은 고정, 아이콘은 지금 상태(가렸으면 eye-off — Toggle) */}
    <TopNavigationIconButton aria-label="금액 가리기" aria-pressed={hidden} onClick={toggleHidden}>{hidden ? <EyeOff /> : <Eye />}</TopNavigationIconButton>
    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}><Bell /></TopNavigationIconButton>
    <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>
  </TopNavigationActions>
</TopNavigation>
<main id="main">
  <ScreenTitle>가계부</ScreenTitle>
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
| 마우스 호버(웹) | 버튼에 누름과 같은 바탕 — 축소 없음 |
| `Tab` | 왼쪽 버튼 → 오른쪽 버튼 순서. 제목은 `Tab` 으로 서지 않는다(`tabindex="-1"` — 화면을 옮길 때 초점만 받는다) |
| 화면을 옮김 | 스크롤 맨 위 + 초점을 새 화면의 제목으로 · 문서 제목을 바꾼다 |
| 글자 크기 설정 | 제목 · 글 버튼은 1.2배까지 커진다 — 바 높이는 56 그대로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 글 버튼 `fg-neutral` 바(`bg-layer-default`) 위 16.41 · 다크 13.42, 누름 바탕 위 15.48 · 10.32 ✓. 막힌 글은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-neutral` 16.41 · 13.42 ✓. 알림 점 `fg-brand` Desk 8.38 · 6.10 · HR 5.06 · 6.23 ✓. 키보드 포커스 링 같은 값 ✓ — 누름 바탕(바와 1.06 · 다크 1.30)은 장식 |
| **WCAG 1.4.1** Use of color | 알림 점은 이름에도 들어간다("알림, 새 알림 있음") ✓ |
| **WCAG 2.4.2** Page Titled | 문서 제목이 화면마다 "{화면 제목} - Porest Desk" ✓ |
| **WCAG 2.4.3** Focus order | 화면을 옮기면 초점이 새 화면의 제목으로 — 앞 화면에서 누른 자리에 남지 않는다 ✓ |
| **WCAG 2.4.6** Headings and Labels | 제목은 화면의 `h1` ✓(SEED 웹은 제목이 `span` 이다) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 아이콘 버튼 44 · 글 버튼 높이 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 아이콘 버튼 44 × 44 ✓ · 글 버튼 44 × (글 + 20) ✓ |
| **ARIA** | 바는 `header`(`banner` — `main` 밖). 아이콘 버튼 `aria-label` 필수("뒤로" · "닫기" · "주 메뉴" · "검색" · "알림"), 아이콘 SVG 는 `aria-hidden`. ☰ 는 `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`. 알림 점은 `aria-hidden` 이고 버튼 이름에 넣는다. 앱은 제목 `Semantics(header: true)` · 버튼 `Semantics(button: true, label)` |

## Do / Don't

### ✅ Do

- 높이 56 · 아이콘 버튼 44 · 아이콘 24 · 화면 끝 6 — 폰 · 데스크톱이 같다.
- 탭 첫 화면은 왼쪽 큰 제목, 그 아래 화면은 ← + 제목.
- ← 는 들어온 화면으로, 앞 화면이 없을 때만 상위 화면으로.
- 오른쪽은 아이콘 둘(셋까지) 또는 글 버튼 하나 — 넘치면 ⋯.
- 화면을 옮기면 맨 위 + 초점을 제목으로, 문서 제목도 바꾼다.

### ❌ Don't

- 스크롤하면 선 · 그림자 긋기, 데스크톱 머리 아래 늘 있는 선.
- 가운데 제목 · 투명 바 · 스크롤에 숨는 바.
- 본문용 아이콘 버튼(40 · 18)을 바에 쓰기.
- ← 가 늘 같은 화면(예: "전체")으로 새로 이동하기.
- 일반 화면에 ✕, 아이콘 버튼과 글 버튼을 함께.
- 상단 바에 알림 숫자.

## Specification

`top-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Top Navigation 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — top-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#top-navigation)

## SEED 와 다른 점

- **제목은 늘 왼쪽**(사용자 결정 2026-10-04) — SEED 는 iOS(cupertino) 가운데 · Android 왼쪽 두 테마다. porest 는 Android 자리(← 다음 56)만 두고, titleMinGap 8 을 늘 지킨다(SEED 웹은 적용하지 않아 긴 제목이 버튼 상자와 10 겹친다).
- **Root 제목 22 / 30 · 700(`text-t8`)** — SEED 는 Root 를 그림(약 22)과 Figma 에만 두고 코드 · rootage 에 값이 없다.
- **선 · 그림자 없음** — SEED 안에서 Top Navigation 문서("별도의 시각적인 장치를 표시하지 않습니다" · 코드도 divider 를 2.0 에서 걷었다)와 Elevation 문서("그림자나 라인(스타일)을 추가하여 '구분감'을 줍니다")가 갈린다. porest 는 Top Navigation 쪽이다(결정 3 — DESIGN.md Elevation 문장도 고쳤다).
- **누름 바탕은 불투명한 `bg-layer-default-pressed` · 2px 거리 축소** — SEED 의 투명도 있는 bg.transparent-pressed 를 검사기가 받지 않는다(v102). SEED 웹 App Bar 는 누름 바탕 · 축소가 없고 모서리가 4 다 — porest 는 rootage(r2 8 · scaleScope self)를 따른다.
- **포커스 링은 상자 안쪽** — SEED 웹 App Bar 와 같다(버튼끼리 붙어 바깥 링이 이웃에 걸린다).
- **투명 톤 · 막 없음** — 쓸 자리가 생기면 정한다.
- **글 버튼에 iOS 최대 폭 96 이 없다** — 제목이 늘 왼쪽이라 SEED Android 와 같다.
- **알림은 점만** — SEED 는 Small · Large 둘 다 쓴다. 숫자는 맨 오른쪽 버튼에서 화면 밖으로 나간다.
- **← 의 동작을 정한다** — SEED 는 History · Hierarchy 를 사용처 정책으로 남기고, 웹 snippet 은 `pop()` 만 한다. porest 는 History 를 기본으로, 앞 화면이 없을 때만 상위 화면(주소를 고쳐 씀)이다.
- **제목이 `h1` 이고 바가 `header` 다** — SEED 웹 App Bar 는 `div` · 제목 `span` 이라 랜드마크 · 제목이 없다.
- **데스크톱 머리를 더한다** — SEED 는 GNB 를 Layout 의 영역 이름으로만 둔다(그림 약 56 + 선).
- **z-index 는 specs/z-index.md 의 L1**(`z-sticky` 50).

## Migration notes

### 2026-10-04 — SEED Top Navigation 으로 새로 둔다

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — 아이콘 버튼은 SEED(상자 44 · 아이콘 24 · 화면 끝 6 · 붙은 버튼, 1A — 본문 Button 40 · 18 과 따로), 제목은 SEED Root + Standard(루트 22 왼쪽 · 하위 ← 다음 18 왼쪽, 2A — 600 은 700 으로), 상단 바 아래는 스크롤해도 표시 없음(3A — 데스크톱 머리의 늘 있던 선도 걷는다). 그리고 "따라오는 것" — 높이 56 모든 화면 · 오른쪽 2개 권장 · 3개까지 · ⋯ · 글 버튼 하나 · 선 아이콘 · 알림은 점만 · ← 는 History(앞 화면이 없으면 상위) · ✕ 는 모달 · 독립 흐름만 · 투명 바 없음 · 랜드마크 · 문서 제목 · 화면을 옮기면 맨 위 + 제목에 초점. 가운데 제목(2C) · 루트 24(2B) · 40 · 18 아이콘 버튼(1B) · 스크롤하면 선(3B)은 고르지 않았다. HR 데스크톱 머리는 걷는다(빵부스러기 결정 9B).

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **머리 높이가 셋** — 셸 56(웹 `widgets/layout/ui/MobileHeader.tsx:36-74` · 앱 `shared/widgets/mobile_header.dart:24-119`) · 웹 하위 화면 58(`shared/ui/porest/mobile-back-header.tsx:12-77`, sticky z 10) · HR 48(`widgets/layout/ui/LayoutHeader.tsx:8-19` · `Layout.tsx:16-31`). 모두 56 으로.
- **아이콘 버튼이 자리마다 다르다** — 셸 36 원 · 20(`size="iconLg"`), 웹 데스크톱 36 · 16(코드는 18 인데 버튼 규칙이 16 으로 누른다 — `PorestTopBar.tsx:51 · 61` · `button-variants.ts:60`), 앱 동작 40 · 16 · 앱 검색 48 · 20, ← 34 × 34(웹) · 38 × 56(앱 `shared/widgets/p_back_button.dart:17-49`) · HR 접기 28. 모두 상자 44 · 아이콘 24 로.
- **제목** — 루트 24 / 700(웹 · 앱) → 22 / 30, 하위 18 / 600(웹 x 46 · 앱 x 46) → 18 / 24 · 700 · x 56. 앱 머리 주석은 22 인데 실제 24 다(`mobile_header.dart:14-16 · 56`).
- **← 가 늘 "전체" 로 새로 이동한다** — `MobileBackHeader` 의 `to` 기본값 `/desk/more`(push), 호출 14곳 중 `to` 를 준 곳이 0(`mobile-back-header.tsx:14 · 48`) — 홈 벨 → 알림 → ← 가 전체로 간다(F8). History 로.
- **설정 하위 화면의 ← 에 이름이 없고 제목이 `h2`**(`pages/settings/ui/SettingsPage.tsx:504-521 · 523`, F7). 설정 하위 · 밤하늘 · 리포트는 기기 · 브라우저 뒤로가 페이지를 떠난다(`SettingsPage.tsx:388-395` · `NightSkyPanel.tsx:70` · `ForestReport.tsx:523`, F9).
- **데스크톱 머리** — Desk 웹 `header.top` 이 `main` 안에 있고 아래 1px 선이 늘 있다(`widgets/layout/ui/PorestTopBar.tsx:22-89` · `shared/styles/porest.css:214-268`). 접기 버튼은 Side Navigation 머리로, 테마는 설정으로(메뉴 결정 ④), 아이콘은 금액 가리기 · 알림 · 설정 셋 + "내역 추가"(지금 80.7 × 32 · 12 / 500 → Button small). HR 헤더(접기 28 "Toggle Sidebar" · 빵부스러기 · 테마 36 "Toggle theme")는 걷는다.
- **알림 점** — 데스크톱 7 × 7 에 2px 테두리를 둘러 빨강 3 × 3 이 아이콘 위로 4 튀어나오고(`PorestTopBar.tsx:62-67`, F20), 폰 6 · 앱 7 빨강이다(`mobile_header.dart:82-118`). 브랜드 점 6 · 아이콘 상자 x 17 ~ 23 · y 1 ~ 7 로(Notification Badge).
- **랜드마크 · 문서 제목** — 웹 머리가 `main` 안이라 `banner` 가 0, 모바일 웹은 `main` 0, 본문 바로가기 0, 문서 제목 고정("POREST Desk" · HR "porest" · `lang="en"` — `index.html:2 · 7`, F16). 앱 셸 제목은 머리말(header)이 아니다(F6).
- **화면을 옮겨도 스크롤 위치가 따라온다** — 웹 셸의 스크롤 상자가 하나라 900 내려 둔 가계부에서 캘린더로 가면 캘린더가 900 에서 열린다(`widgets/layout/ui/AppLayout.tsx:93 · 122`, F3). 화면을 옮기면 맨 위 + 제목에 초점으로.
- **가짜 검색 입구** — 웹 데스크톱 readOnly 검색칸(`PorestTopBar.tsx:27-42`)과 폰 검색 아이콘(`MobileHeader.tsx:63-70`)이 "준비 중" 화면으로 간다(F21). 앱은 진짜 검색이다. 데스크톱 머리 왼쪽 자리와 함께 앱 적용 때 정한다.
