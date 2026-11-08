# Bottom Navigation

> 폰 화면 아래에 떠 있는 탭 바(하단 탭 바) — Desk 앱 · Desk 웹 768 미만의 주 메뉴다. 칸은 다섯을 넘지 않고 어느 화면에서나 같다(Desk 는 홈 · 가계부 · + · 캘린더 · 전체 — 아래 "Desk 에서는"). 가운데 + 는 탭이 아니라 그 화면의 추가 동작이다. 다른 이동 부품([Top Navigation](top-navigation.md) · [Side Navigation](side-navigation.md) · [Side Panel](side-panel.md) · [Tabs](tabs.md))과 고르는 표는 DESIGN.md Layout 의 "이동 부품 고르기" 한 곳이다.

규칙은 당근 [SEED Bottom Navigation](https://seed-design.io/components/bottom-navigation)(Apache-2.0)을 따른다 — "앱의 루트 페이지 하단에 고정되어 있는 네비게이션 바로, 다섯 개의 상위 탭 간 이동을 제공합니다." 5칸을 넘지 않고, 라벨은 한글 5자 이내 · 글자 크기 설정을 따르지 않으며, 칸은 최대 480 안에 모으고, 알림 배지는 2칸까지 · "99+", 더 나눌 구분은 화면 위 Tabs 로 둔다. SEED 는 디자인 문서 · 그림뿐이라(rootage · 코드 없음) 바의 모양은 groo 가 지켜 온 **떠 있는 알약**을 고쳐 쓴다 — 바탕을 불투명하게 · 줄어들 때도 칸마다 이름 · 줄어든 바를 누르면 펴짐(2026-10-04 사용자 결정 4B). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다. groo 에 처음 두는 스펙이다 — 지금 Desk 웹 · 앱의 탭 바(`tabbar.tsx` · `p_tab_bar.dart`)를 정리한다.

수치 원본은 [`bottom-navigation.yaml`](bottom-navigation.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 홈 · 가계부 화면의 탭 바(펼침 · 줄어듦) — 라이트 · 다크](../../site/components/specs/bottom-navigation.tsx#hero)

### 직접 골라 보기

지금 탭 · 크기(펼침 · 줄어듦) · 알림 점 · 화면(홈의 "거래 추가" · 캘린더의 "일정 추가") · 안전 영역(홈 표시줄 있음 · 없음)을 고르면 스펙대로 그린 바와 그 코드가 바뀐다. 목록을 아래로 스크롤하면 바가 줄어들고, 위로 올리거나 바를 누르면 펴진다.

[그림: 플레이그라운드](../../site/components/specs/bottom-navigation.tsx#playground)

## Anatomy

[그림: 바는 탭 칸 넷과 가운데 + 로, 칸은 아이콘 · 라벨 — 화면 아래에 떠 있는 알약](../../site/components/specs/bottom-navigation.tsx#anatomy)

| ⓐ Root | 바 — 떠 있는 알약. 칸 다섯을 똑같이 나누고 넓은 화면에서는 480 으로 가운데에 선다. |
| ⓑ Item | 탭 칸 — 아이콘 + 라벨. 누르면 그 탭으로. |
| ⓒ Label | 라벨 — 11 / 15, 한글 5자 이내. 줄어든 바에서는 보이지 않지만 이름으로 남는다. |
| ⓓ Add Button | 가운데 + — 브랜드 원 44. 그 화면의 추가(거래 추가 · 일정 추가). |
| ⓔ Notification | 알림 — 탭 아이콘 오른쪽 위(Notification Badge). 2칸까지. |

[표: 부위](bottom-navigation.yaml#slots)

## Properties

### 바 — 펼침 · 줄어듦

펼친 바는 높이 66 · 화면 끝에서 좌우 14 · 아래 14(홈 표시줄이 있으면 안전 영역 − 6 = 28)이다. 아래로 스크롤하면 줄어든다 — 높이 48 · 좌우 36 · 라벨은 보이지 않게(이름은 남는다) · + 는 36. 바탕은 불투명한 떠 있는 표면(`bg-layer-floating`)이고 흐림(blur)을 두지 않는다 — 뒤로 짙은 카드 · 브랜드 카드가 지나가도 라벨 대비가 그대로다. 그림자는 `shadow-s3`, 안쪽 1px `stroke-neutral-subtle` 로 흰 화면 위에서도 가장자리가 잡힌다.

[그림: 펼침 66 · 줄어듦 48 — 좌우 14 · 36, 아래 자리(홈 표시줄 있음 · 없음)](../../site/components/specs/bottom-navigation.tsx#size)

[표: 크기](bottom-navigation.yaml#size)

[표: 바](bottom-navigation.yaml#base.enabled@root)

### 칸 · 아이콘 · 라벨

칸은 바 폭을 똑같이 나눈다. 바 66 · + 원 44(줄어든 바 36) · 아이콘 24 는 px 다 — 글자 크기와 상관없이 같다(03-G 1A). 아이콘은 lucide 선 아이콘 24, 라벨은 11 / 15 · 500 이고 글자 크기 설정을 따르지 않는다(SEED — 커지면 칸 밖으로 넘친다). 라벨은 한 줄, 한글 5자 이내로 쓴다.

[표: 칸](bottom-navigation.yaml#base.enabled@item)

[표: 아이콘](bottom-navigation.yaml#base.enabled@icon)

[표: 라벨](bottom-navigation.yaml#base.enabled@label)

### 지금 탭

지금 탭은 아이콘 · 라벨이 짙은 글자색(`fg-neutral`)이고 아이콘 선이 2.5 다. 다른 탭은 `fg-neutral-subtle` · 선 2 다. 브랜드 색으로 칠하지 않는다 — Tabs · Chip 의 "고름 = 짙은 색" 과 같고, 브랜드 색은 가운데 + 하나에만 남아 더 잘 보인다. 굵기 · 크기는 바꾸지 않는다.

[그림: 지금 탭 — 짙은 색 + 선 2.5 · 다른 탭 fg-neutral-subtle + 선 2, Desk · HR · 다크](../../site/components/specs/bottom-navigation.tsx#selected)

[표: 고름](bottom-navigation.yaml#selected)

### 가운데 +

가운데 칸은 탭이 아니라 그 화면의 추가 동작이다 — 브랜드 원 44(`bg-brand-solid`) + 흰 + 24, 라벨은 없다. 이름은 화면마다 다르다 — 홈 · 가계부 · 전체에서는 "거래 추가", 캘린더에서는 "일정 추가". 누르면 그 추가(시트)를 연다. 줄어든 바에서는 원 36 · + 20 이다.

[그림: 가운데 + — 원 44 · + 24, 이름은 화면마다("거래 추가" · "일정 추가")](../../site/components/specs/bottom-navigation.tsx#add)

[표: 가운데 +](bottom-navigation.yaml#base.enabled@addButton)

### 본문 아래 여백

바가 본문을 덮으므로 본문 스크롤의 맨 아래에 여백을 둔다 — 바의 아래 자리 + 66 + 24. 끝까지 내리면 마지막 줄이 바 위 24 에서 끝난다. 바가 줄어도 여백은 그대로 둔다(줄 때마다 본문이 밀리지 않게). [Scroll Fog](scroll-fog.md) 는 탭 바 위 목록에 걸지 않는다.

[그림: 끝까지 내린 목록 — 마지막 줄이 바 위 24 · 여백 없이 바에 덮인 줄](../../site/components/specs/bottom-navigation.tsx#inset)

[표: 본문 아래 여백](bottom-navigation.yaml#base.enabled@bodyInset)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 — 마우스 호버 모양도 없다 |
| `pressed` | 탭 칸은 2px 거리 축소만 — 색은 그대로(손을 떼기 전에 고른 것처럼 보이지 않게). + 는 `bg-brand-solid-pressed` + 축소 |
| `focused` | 웹 — 키보드 포커스에만 링. 칸은 안쪽 2px, + 는 원 바깥 2px |

[그림: 누름 · 키보드 포커스 — 칸 · +](../../site/components/specs/bottom-navigation.tsx#states)

[표: 상태](bottom-navigation.yaml#matrix)

[표: 모션](bottom-navigation.yaml#motion)

## Guidelines

### 다섯 칸 — 어느 화면에서나 같다

칸은 다섯을 넘지 않고, 어느 화면에서도 칸이 바뀌지 않는다 — 다른 탭으로 늘 한 번에 간다. 더 나눌 구분은 탭 바 칸을 늘리지 않고 그 탭 화면 위의 [Tabs](tabs.md)(Line)로 둔다(SEED — "더 많은 구분이 필요하다면 화면 상단에 Tabs 를 사용"). 탭 바 칸을 화면마다 바꾸거나(← · 4칸) 6칸 이상으로 늘리지 않는다.

### Desk 에서는

아래는 부품 규칙이 아니라 Desk 의 화면 배치다(2026-10-22 사용자 결정 9B — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L). 탭 바는 홈 · 가계부 · + · 캘린더 · 전체 다섯이다. 가계부 · 자산 · 통계 · 예산은 탭 바 칸이 아니라 가계부 화면 위의 [Tabs](tabs.md)(Line)다 — 웹은 고른 탭을 주소에 둔다.

[그림: 가계부 — 탭 바는 그대로 · 위 Line Tabs(가계부 · 자산 · 통계 · 예산)](../../site/components/specs/bottom-navigation.tsx#money-guide)

### 줄어들기 — 이름은 남고, 누르면 펴진다

아래로 20 이상 스크롤하면 바가 줄어들고, 위로 28 이상 스크롤하거나 맨 위 40 안으로 오면 펴진다(스크롤 방향이 바뀌면 다시 센다). 줄어든 바에서도 칸마다 이름이 남아 보조 기술이 읽는다. 줄어든 바를 누르면 펴진다 — 칸을 누르면 그 탭으로 가면서 바도 펴진다(앱도 같다). 가로로 스크롤하는 줄 · 시트 안의 스크롤은 세지 않는다. 폰 원장 머리가 스크롤에 숨는 것([Scroll Auto Hide](scroll-auto-hide.md), 2026-10-10)과는 따로다 — 바는 이 규칙대로 줄고 펴진다.

[그림: 아래로 스크롤 — 48 로 줄어듦 · 위로 · 맨 위 · 누르면 펴짐](../../site/components/specs/bottom-navigation.tsx#compact-guide)

### 탭을 옮길 때 — 탭마다 기억

탭마다 마지막 화면과 스크롤 위치를 기억한다 — 홈을 600 내려 두고 캘린더를 다녀와도 홈은 600 이고, 가계부 칸은 마지막에 보던 통계로 돌아온다. 웹도 앱과 같다 — 웹은 돌아온 화면의 목록이 그려진 뒤 스크롤을 돌려놓고, 돌려놓지 못하면(그 자리까지 내용이 없으면) 맨 위에서 시작한다(2026-10-16 사용자 결정 — 구현 세션 질문 Q-018-4 A). 지금 탭을 다시 누르면 그 탭의 첫 화면으로 가고 맨 위로 올라간다(같은 주소를 쌓지 않는다 — 지금 주소를 고쳐 쓴다). 다른 화면으로 들어갈 때의 초점 · 문서 제목은 [Top Navigation](top-navigation.md) 의 "화면을 옮길 때" 다.

| 누르는 것 | 동작 |
|---|---|
| 다른 탭 | 그 탭의 마지막 화면 · 스크롤 위치로(웹은 목록이 그려진 뒤) |
| 지금 탭(첫 화면) | 맨 위로 |
| 지금 탭(그 아래 화면) | 그 탭의 첫 화면으로 · 맨 위 — 주소를 고쳐 쓴다 |

앱 기기 뒤로 — 홈이 아닌 탭 첫 화면(가계부 묶음 포함)에서는 홈으로, 홈에서는 앱을 닫는다. 탭을 지나온 순서는 쌓지 않는다(2026-09-12 사용자 결정 — 2026-10-22 결정 7B 로 스펙에 적었다, https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L). 그 아래 화면에서는 [Top Navigation](top-navigation.md) 의 ← 와 같은 곳이다. 웹은 브라우저 기록대로다(정하지 않았다).

[그림: 탭마다 스크롤 기억 · 지금 탭을 다시 누르면 맨 위](../../site/components/specs/bottom-navigation.tsx#retap-guide)

### 가운데 + 는 화면의 추가

+ 는 그 화면의 추가 하나다 — 홈 · 가계부 · 전체는 거래 추가, 캘린더는 일정 추가. 이름이 화면마다 바뀌므로 버튼 이름도 같이 바꾼다(앱도 이름을 단다). + 를 탭 칸처럼 라벨을 단 칸으로 두거나, 탭 바에서 빼서 떠 있는 버튼으로 옮기지 않는다. 탭 바가 있는 화면에는 [Floating Action Button](floating-action-button.md) 을 두지 않는다 — 추가는 + 가 맡는다.

[그림: + 의 이름 — 홈 "거래 추가" · 캘린더 "일정 추가"](../../site/components/specs/bottom-navigation.tsx#add-guide)

### 라벨 — 짧게, 이름만

라벨은 한글 5자 이내의 명사다(SEED). 개수 · 새 소식은 라벨에 붙이지 않고 알림 배지로 — 배지는 2칸까지만 단다(SEED "3개 이상의 탭에 Badge 가 표시되지 않도록"). 지금 탭 바에 배지를 다는 칸은 없다.

### 다른 것과 함께

- **스낵바** — 탭 바 위 8 에 뜬다([Snackbar](snackbar.md) — 탭 바를 `SnackbarAvoidOverlap` 으로 감싼다).
- **바닥 고정 버튼 · 입력 화면** — 탭 바가 있는 화면에 바닥 고정 버튼을 두지 않는다 — 탭 바가 바닥을 덮는다. 탭 바가 없는 화면(할 일 · 더치페이)은 바닥 버튼 · [Floating Action Button](floating-action-button.md) 을 둘 수 있다. 입력은 시트로 띄우고(시트 · 딤이 탭 바를 덮는다), 화면 키보드가 열리면 탭 바를 가린다.
- **안전 영역** — 바의 아래 여백 6 만 홈 표시줄 영역에 걸치고 누르는 칸은 그 위에서 끝난다(Layout 의 Safe Area).

[그림: 스낵바는 탭 바 위 8 · 시트가 탭 바를 덮음](../../site/components/specs/bottom-navigation.tsx#stack-guide)

## 코드

레시피 `recipes/shadcn/components/ui/bottom-navigation.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `BottomNavigation` — 바(`<nav aria-label="주 메뉴">`). `compact` · `defaultCompact` · `onCompactChange`(손으로 다룰 때), `scrollRoot`(줄어들기를 셀 스크롤 상자 — 기본은 셸 안의 세로 스크롤 모두). 줄어든 바를 누르면 펴진다.
- `BottomNavigationItem` — 탭 칸(`<a>`). `href`(그 탭의 첫 화면) · `resumeHref`(그 탭의 마지막 화면 — 셸이 탭마다 기억한 주소. 다른 탭에서 누르면 여기로, 없으면 `href`) · `icon`(lucide 아이콘) · `label`(5자 이내) · `current`(지금 탭 — `aria-current="page"`) · `notification`(점 — 이름에 "새 소식" 을 덧붙인다) · `onReselect`(지금 탭을 다시 눌렀을 때 — 기본은 그 탭의 첫 화면으로 주소를 고쳐 쓰고 맨 위로).
- `BottomNavigationAddButton` — 가운데 +(`<button type="button">`). `aria-label` 필수("거래 추가" · "일정 추가").
- `BOTTOM_NAVIGATION_INSET` — 본문 아래 여백 CSS 식(`calc(max(14px, env(safe-area-inset-bottom) - 6px) + 90px)`). 셸이 본문 스크롤의 `padding-bottom` 에 쓴다.

앱은 같은 값을 Dart 로 둔다(`PTabBar` — 칸은 `Semantics(button: true, selected: current, label)`, + 도 이름을 단다).

### Desk 셸 — 다섯 칸

[그림: 홈 — 다섯 칸 · 지금 탭 홈](../../site/components/specs/bottom-navigation.tsx#ex-shell)

```tsx
import { CalendarDays, ClipboardList, House, Menu } from "lucide-react"
import { BottomNavigation, BottomNavigationAddButton, BottomNavigationItem } from "@/components/ui/bottom-navigation"
import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"

<SnackbarAvoidOverlap>
  <BottomNavigation>
    {/* 다른 탭에서 누르면 그 탭의 마지막 화면(resumeHref — 셸이 탭마다 기억), 지금 탭을 다시 누르면 첫 화면(href) · 맨 위 */}
    <BottomNavigationItem href="/desk" resumeHref={lastPath.home} icon={<House />} label="홈" current={tab === "home"} />
    <BottomNavigationItem href="/desk/ledger" resumeHref={lastPath.ledger} icon={<ClipboardList />} label="가계부" current={tab === "ledger"} />
    {/* 탭이 아니라 이 화면의 추가 — 이름은 화면마다 */}
    <BottomNavigationAddButton aria-label={tab === "calendar" ? "일정 추가" : "거래 추가"} onClick={openAdd} />
    <BottomNavigationItem href="/desk/calendar" resumeHref={lastPath.calendar} icon={<CalendarDays />} label="캘린더" current={tab === "calendar"} />
    <BottomNavigationItem href="/desk/more" resumeHref={lastPath.more} icon={<Menu />} label="전체" current={tab === "more"} />
  </BottomNavigation>
</SnackbarAvoidOverlap>
```

### 본문 아래 여백

```tsx
import { BOTTOM_NAVIGATION_INSET } from "@/components/ui/bottom-navigation"

{/* 마지막 줄이 바 위 24 에서 끝난다 — 바가 줄어도 그대로 */}
<main id="main" className="overflow-y-auto" style={{ paddingBottom: BOTTOM_NAVIGATION_INSET }}>…</main>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 탭 칸 누르기 | 그 탭의 마지막 화면 · 스크롤 위치로. 지금 탭이면 첫 화면 · 맨 위로(주소를 고쳐 쓴다) |
| + 누르기 | 그 화면의 추가(거래 · 일정)를 연다 |
| 아래로 스크롤(20 이상) | 바가 48 로 줄어든다 — 라벨은 보이지 않고 이름은 남는다 |
| 위로 스크롤(28 이상) · 맨 위 40 안 | 펴진다 |
| 줄어든 바 누르기 | 펴진다 — 칸을 눌렀으면 그 칸의 일도 한다(다른 탭이면 그 탭으로, 지금 탭이면 첫 화면 · 맨 위로 — 2026-10-15 구현 세션 질문 Q-014 정리, 웹 · 앱 이미 그렇다) |
| `Tab` | 홈 → 가계부 → + → 캘린더 → 전체. `Enter` 로 이동 · 추가 |
| 화면 키보드가 열림 | 탭 바를 가린다 |
| 모션 줄이기 | 줄어들기 · 펴지기가 바로 바뀐다 · 누름 축소 없음 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 지금 탭 라벨 `fg-neutral` 바(`bg-layer-floating`) 위 16.41 · 다크 11.62, 다른 탭 `fg-neutral-subtle` 5.50 · 5.27 ✓ — 바탕이 불투명해 뒤로 지나가는 내용과 상관없다(지금은 82% 바탕이라 짙은 카드 위에서 3.82 · 줄면 2.74) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 16.41 · 11.62 / 5.50 · 5.27 ✓. + 의 흰 아이콘 `bg-brand-solid` 위 Desk 8.38 · 8.36 · HR 8.17 · 8.36 ✓ — 원과 바(다크 Desk · HR 1.50)는 흰 + 가 알린다. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 1.4.1** Use of color | 지금 탭은 색(2.99 · 2.20)만이 아니라 선 굵기(2.5 · 2)로도 다르다. 보조 기술에는 `aria-current="page"` |
| **WCAG 1.4.4** Resize text | 라벨은 글자 크기 설정을 따르지 않는다(SEED) — 칸 밖으로 넘치지 않게. 탭 이름은 화면의 다른 자리(Top Navigation 제목)에서 커진다 ⚠ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 약 61 × 54 · 줄어듦 약 53 × 48 · + 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 펼침 칸 54 ✓ · 줄어듦 칸 48 ✓ — 줄어든 바는 칸이 바 높이를 다 채운다(위아래 안쪽 여백 0) · + 44 ✓ |
| **WCAG 4.1.2** Name, Role, Value | 줄어든 바의 칸도 이름이 있다(라벨이 보이지 않게만 남는다). + 이름은 화면마다("거래 추가" · "일정 추가") ✓ |
| **ARIA** | 바 `<nav aria-label="주 메뉴">` · 칸은 링크 + 지금 탭 `aria-current="page"`, 아이콘은 `aria-hidden`. + 는 `<button type="button">`. 알림 점은 `aria-hidden` 이고 칸 이름 뒤에 "새 소식". 앱은 바 `Semantics(container: true, label)` — 이름 "주 메뉴" 는 번역 문구(`navMainMenu` · en "Main menu", 코드에 한국어 상수를 두지 않는다 — 2026-10-16 사용자 결정 틀 앱 02-003) · 칸 `Semantics(button: true, selected, label)`. 칸 뒤의 "새 소식" 도 번역 문구다 |

## Do / Don't

### ✅ Do

- 다섯 칸을 어느 화면에서나 그대로 — 구분이 더 필요하면 화면 위 Tabs.
- 지금 탭은 짙은 색 + 선 2.5, 브랜드 색은 + 에만.
- + 의 이름을 화면마다 단다(웹 · 앱).
- 줄어도 이름을 남기고, 누르면 편다.
- 탭마다 마지막 화면 · 스크롤을 기억하고(웹도), 지금 탭을 다시 누르면 맨 위로.

### ❌ Don't

- 화면 아래에 붙은 바 · 흐린 반투명 바.
- 지금 탭을 브랜드 색으로.
- + 를 라벨 붙은 칸으로 · 떠 있는 버튼으로 빼기.
- 화면마다 칸을 바꾸기(← · 4칸) · 6칸 이상.
- 지금 탭을 다시 누를 때마다 같은 주소를 쌓기.
- 웹에서만 탭을 옮길 때마다 첫 화면 맨 위로 — 앱과 같게 기억한다.
- 탭 바 위 목록에 끝 흐림(Scroll Fog).

## Specification

`bottom-navigation.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Bottom Navigation 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — bottom-navigation.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#bottom-navigation)

## SEED 와 다른 점

- **떠 있는 알약**(사용자 결정 2026-10-04, 4B) — SEED 는 화면 아래에 붙은 바(48 + 안전 영역 · 위 1px 선 · 안쪽 최대 480)다. groo 는 지금 모양(66 · 좌우 14)을 지키고, 바탕을 불투명하게 · 줄어도 이름을 남기고 · 줄어든 바를 누르면 펴지게 고쳤다.
- **줄어든다** — SEED 에 없는 동작이다(아래로 20 · 위로 28 · 맨 위 40 — 지금 Desk 웹 · 앱 값).
- **선 아이콘 + 짙은 색 · 선 굵기** — SEED 는 채움(Fill) 아이콘 + 색 톤이다. lucide 에는 채움 모양이 없어 v106 대로 굵기 · 색으로 고름을 보인다. SEED 그림의 안 고른 색(아이콘 #B0B3BA 2.10:1 · 라벨 #868B94 3.42:1)은 대비가 모자라 `fg-neutral-subtle`(5.50)이다.
- **가운데 + 는 브랜드 원 44, 라벨 없음** — SEED 의 가운데 글쓰기 버튼은 글로벌 앱의 탭 칸 하나(둥근 사각 24 + 라벨)다. 이름은 화면마다 단다.
- **그림자 · 안쪽 테두리** — SEED 는 위 1px 선(1 기기 픽셀)뿐이다. groo 는 떠 있는 바라 `shadow-s3` + 안쪽 1px `stroke-neutral-subtle` 이다(지금 손으로 쓴 값의 가장 가까운 토큰 — 새 토큰 없음).
- **탭은 링크 + `aria-current`, 탭마다 스크롤 기억 · 다시 누르면 맨 위** — SEED 문서는 역할 · 이름 · 키보드 · 다시 누르기를 적지 않았다.
- **z-index 는 specs/z-index.md 의 L1**(`z-sticky` 50).

## Migration notes

### 2026-10-22 — 기기 뒤로 · Desk 배치 소제목 · 이동 부품 표 링크

앱 기기 뒤로(탭 첫 화면 → 홈, 홈 → 닫기, 탭 이력 없음 — 2026-09-12 사용자 결정, 앱 `branch_back_to_home.dart` 에 이미 구현)를 "탭을 옮길 때" 에 적었다(7B). 다섯 칸의 이름 · 가계부 묶음은 "Desk 에서는" 소제목 아래로 — 부품 규칙(다섯 칸 이하 · 늘 같은 칸)은 위에 남는다(9B). 머리말의 다른 이동 부품 안내는 DESIGN.md Layout 의 "이동 부품 고르기" 링크로(6B). "탭 바가 있는 화면에 바닥 고정 버튼을 두지 않는다" 는 그대로 두고 까닭 · 범위(탭 바가 없는 화면은 둘 수 있다)를 밝혔다(남은 규칙 R20 — 그대로). 사용자 결정 — https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L. 문장 이동 · 덧붙임만, 값 변경 없음.

### 2026-10-21 — 단위(03-G 1A)

웹 + 원 `size-11` · 아이콘 `size-6`(rem)이 글자 200% 에서 88 로 커져 바(66) 밖으로 넘쳤다. 레시피를 `size-[44px]` · `[36px]` · `[24px]` · `[20px]` 로. 비교 페이지 https://claude.ai/artifact/A3oCdxNvDwkNBPFPE36bmF.

### 2026-10-16 — 웹도 탭마다 기억

구현 세션 질문 Q-018-4 를 사용자가 정했다([비교 페이지](https://claude.ai/artifact/6R7NBc4ByvxGyLy6E6tvKf)) — 웹 하단 탭도 앱처럼 그 탭의 마지막 화면 + 스크롤로 돌아온다(A). 목록이 그려진 뒤 돌려놓고, 못 하면 맨 위다. 늘 맨 위 · 첫 화면(B) · 마지막 화면만(C)은 고르지 않았다. 가계부 묶음 안의 1차 탭(가계부 · 자산 · 통계 · 예산)을 오갈 때의 기억은 [Tabs](tabs.md) 7A 대로다(정리).

- **Desk 웹** — 칸의 `href` 가 늘 그 탭의 첫 화면이다(가계부 칸은 `/desk/expense`). 탭마다 마지막 경로 · 스크롤(경로별)을 기억하고, 돌아오면 데이터가 그려진 뒤 돌려놓는다. 하단 탭을 옮길 때는 초점만 그 화면의 제목으로 옮기고(`focusScreenTitle({ resetScroll: false })` — Top Navigation 레시피) 스크롤은 기억한 자리로 돌려놓는다 — 지금 임시 셸은 경로가 바뀔 때마다 맨 위로 보낸다.

### 2026-10-08 — 글자 값을 고정 px 토큰으로

YAML 의 라벨 글자가 rem 토큰(`$text-t1`)을 가리키고 "글자 크기 설정을 따르지 않는 px" 는 비고에만 있었다 — YAML 대로 만들면 글자 크기 200% 에서 라벨이 칸 밖으로 넘친다. 레시피(`text-t1-static`) · 비고(앱 `TextScaler.noScaling`)와 같게 값 자리를 `-static` 토큰(`$text-t1-static`)으로 고쳤다 크기 · 모습은 그대로다. `-static` 은 같은 글자 토큰의 px 판이다(Typography v104 — 내보낼 때 생긴다). Notification Badge · Wheel Picker 에 대한 사용자 결정([비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 3)을 같은 꼴의 이 자리에도 따랐다.

### 2026-10-04 — 떠 있는 알약을 Bottom Navigation 으로 정한다

사용자가 [화면 틀 · 이동 비교 페이지](https://claude.ai/artifact/B6tsgbw356Kf2Zumvm2v6a)에서 정했다 — 바는 떠 있는 알약을 지키고 고친다(4B — 바탕 불투명 `bg-layer-floating` · 흐림 걷음, 줄어들 때(48)도 칸마다 이름, 줄어든 바를 누르면 펴짐 — 앱도), 지금 탭은 짙은 색 + 선 2.5 · 다른 탭 `fg-neutral-subtle` + 선 2(5A), 가운데 + 는 브랜드 원 44 · 라벨 없음 · 이름은 화면마다(6B — 앱도 이름을 단다), 가계부 묶음은 탭 바 그대로 · 위 Line Tabs(7A). 그리고 "따라오는 것" — 5칸 이하 · 라벨 한글 5자 이내 · 라벨 11 / 15 고정 크기 · 최대 480 · 탭마다 스크롤 기억 · 지금 탭을 다시 누르면 맨 위 + 첫 화면 · 탭은 링크 + `aria-current`(앱 selected) · 바 이름 "주 메뉴". 붙은 바(4A) · 브랜드 색 고름(5B) · 라벨 붙은 + 칸(6A) · + 를 떠 있는 버튼으로(6C) · 탭 바 칸 바꿈(7B)은 고르지 않았다.

제품은 앱 적용 단계에서 옮긴다(2026-10-04 조사 — Desk 웹은 크로미움, Desk 앱은 위젯 테스트로 쟀다).

- **반투명 바** — 표면 82% + 흐림 20 · 채도 1.7(웹 `shared/ui/groo/tabbar.tsx:111-128` · 앱 `shared/widgets/p_tab_bar.dart:159-224`). 짙은 · 브랜드 카드가 뒤로 지나가면 라벨 대비가 4.04 · 3.82, 줄어든 바 3.1 · 2.74, 다크 3.28 · 3.02 까지 떨어진다(F22). 불투명 `bg-layer-floating` + `shadow-s3` 로.
- **줄어든 바의 칸 이름이 없다** — 웹은 라벨을 지워 네 칸이 이름 없는 버튼(52.8 × 40), 앱은 60 × 22 이고(웹 `tabbar.tsx:186` · 앱 `p_tab_bar.dart:309-329`, F5), 앱은 줄어든 바에서 탭을 눌러도 펴지지 않는다(`p_tab_bar.dart:216-223` — 바깥 GestureDetector 가 InkWell 에 진다, F11).
- **낭독** — 웹 `nav` 에 이름이 없고 탭에 `aria-current` 가 없으며, + · ← 안의 SVG 가 이름 없는 그림으로 드러난다(`tabbar.tsx:155-272`, F17). 앱은 탭이 버튼 · 선택 상태 없이 라벨 + 누르기뿐이고, + 와 가계부 ← 에 이름이 0 이다(`p_tab_bar.dart:283-409`, F6).
- **지금 탭이 브랜드 색 · 굵기 600** — `--fg-brand-strong`(웹 `tabbar.tsx:172-176`), 앱은 색만. 짙은 색 + 선 2.5 · 굵기 500 그대로로. 아이콘 22 → 24, 라벨 10.5 → 11.
- **가계부 묶음의 칸 바꿈** — 가계부 · 자산 · 통계 · 예산에 들어가면 바가 ← · 가계부 · 자산 · 통계 · 예산으로 바뀌고(웹 `widgets/layout/ui/AppTabBar.tsx:24-109` · 앱 `p_tab_bar.dart:375-409`), ← 는 홈으로 새로 이동한다(`AppTabBar.tsx:51` push · 앱 `goBranch(0)`). 칸 바꿈 · 모드 전환 안무를 걷고 가계부 화면 위 Line Tabs 로.
- **다시 누르기 · 스크롤** — 웹은 지금 탭을 다시 누르면 같은 주소가 쌓이고(히스토리 2 → 3 → 4) 맨 위로 가지 않으며, 탭을 옮겨도 앞 탭의 스크롤을 끌고 간다(`AppTabBar.tsx:53-58` · `AppLayout.tsx:93`, F3 · F10). 앱은 탭마다 기억하지만 다시 눌러도 맨 위로 가지 않는다(`mobile_scaffold.dart:146-168`). 탭마다 기억 + 다시 누르면 맨 위 · 첫 화면으로.
- **+ 이름** — 웹은 `fabFor`(`widgets/layout/model/fab.ts:25-30`)로 "거래 추가" · "일정 추가" 를 주고, 앱은 이름이 0 이다. 앱도 같은 이름을.
