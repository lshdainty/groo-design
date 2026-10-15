# Notification Badge

> 안 읽은 알림 · 확인하지 않은 새 것이 있다는 신호 — 점(있음)과 숫자(몇 개). 아이콘 버튼 · 탭 글에 붙고, 보면 사라진다. 대상의 상태 · 분류를 글로 보이는 것은 [Badge](badge.md) 다.

구조는 당근 [SEED Notification Badge](https://seed-design.io/components/notification-badge)(Apache-2.0)를 따른다 — 점(Small) · 숫자 알약(Large), 아이콘 · 글에 붙는 자리, 크기 · 자리는 고정. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-03 사용자 결정). porest 에 처음 두는 컴포넌트다 — Tabs · Chip Tabs · Segmented Control 의 알림 점도 이 점이다.

수치 원본은 [`notification-badge.yaml`](notification-badge.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: Desk 상단 바 알림 · 탭 · Segmented 의 알림 점 — 라이트 · 다크](../../site/components/specs/notification-badge.tsx#hero)

### 직접 골라 보기

크기(점 · 숫자) · 붙는 자리(아이콘 · 글) · 숫자를 고르면 스펙대로 그린 배지와 그 코드, 보조 기술이 읽는 이름이 바뀐다. 0 이면 사라지고 100 이상이면 "99+" 다.

[그림: 플레이그라운드](../../site/components/specs/notification-badge.tsx#playground)

## Anatomy

[그림: 점(small)과 숫자 알약(large) — 아이콘 상자 위에 겹쳐 놓인다](../../site/components/specs/notification-badge.tsx#anatomy)

| ⓐ Dot | 점 — 6, 새 것이 있는지만. |
| ⓑ Count Container | 숫자 알약 — 높이 18, 폭은 숫자만큼. |
| ⓒ Count Label | 숫자 — 1 ~ 99, 100 이상은 "99+". |

[표: 부위](notification-badge.yaml#slots)

## Properties

### Size

`small`(점 6) *(기본)* 은 새 것이 있는지만 중요할 때 — 탭 · Segmented · 상단 바. `large`(숫자 18)는 몇 개인지가 판단에 필요할 때만 쓴다 — 하단 탭 바의 칸처럼(2칸까지). 상단 바([Top Navigation](top-navigation.md))에는 점만 둔다 — 숫자 알약은 아이콘 오른쪽으로 자라 맨 오른쪽 버튼에서 "99+" 가 화면 밖으로 8.5 나간다(2026-10-04). 숫자는 11 / 15 · 700 이고 글자 크기 설정을 따르지 않는다(커지면 아이콘을 덮는다 — SEED 와 같다).

점은 브랜드 글자색(`fg-brand` — 다크에서 밝은 짝)이고, 숫자 알약은 브랜드 채움(`bg-brand-solid`) + 흰 숫자다. Desk 는 파랑, HR 은 초록이다. 알림은 오류가 아니다 — 빨강은 오류 · 위험에 남긴다.

[그림: 크기 — 점 6 · 숫자 1 · 12 · 99+, Desk · HR — 라이트 · 다크](../../site/components/specs/notification-badge.tsx#size)

[표: 크기](notification-badge.yaml#size)

[표: 공통](notification-badge.yaml#base.enabled)

### Attach

자리는 붙는 대상의 상자에서 잰다 — 아이콘이면 아이콘 상자(버튼 상자가 아니다), 글이면 글 상자다. 위치 · 크기는 고정이다 — 화면마다 옮기지 않는다(SEED).

- **아이콘 · 점** — 아이콘 상자 오른쪽 위 안쪽 1. 24 아이콘이면 x 17 ~ 23 · y 1 ~ 7(아이콘 크기가 달라도 같은 식 — 18 아이콘이면 x 11 ~ 17).
- **아이콘 · 숫자** — 알약의 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14). 24 아이콘이면 (16, 14) — 위로 4, 오른쪽으로 튀어나오고 숫자가 길수록 오른쪽으로 자란다. 본문의 아이콘 버튼(Button `iconOnly` medium 40 · 아이콘 18)이면 (10, 14)다. 두 자리 · "99+" 는 버튼 오른쪽 밖으로 나갈 수 있다.
- **상단 바** — [Top Navigation](top-navigation.md) 의 아이콘 버튼은 상자 44 · 아이콘 24 다(2026-10-04) — 점은 x 17 ~ 23 · y 1 ~ 7. 상단 바에는 점만 둔다.
- **글** — 마지막 글자 뒤 2, 위는 글 줄 상자의 위 끝. 탭 · 칸 폭과 줄 높이를 바꾸지 않는다. Chip Tabs 만 칩 안 글 뒤 6 · 세로 가운데에 흐름으로 놓는다(SEED Chip Tabs — 값은 [Tabs](tabs.md)).

[그림: 붙는 자리 — 24 아이콘의 점 · 숫자 좌표와 글 끝 2](../../site/components/specs/notification-badge.tsx#placement)

[표: 붙는 대상](notification-badge.yaml#attach)

[표: 아이콘에 붙을 때 — 크기마다](notification-badge.yaml#compound)

### 숫자

| 개수 | 보이는 것 |
|---|---|
| 0 | 배지가 없다(점도 숫자도) |
| 1 ~ 99 | 그 숫자 |
| 100 이상 | "99+" |

숫자의 상한은 SEED 의 두 문서 가운데 Bottom Navigation 의 "99+" 다(Notification Badge 문서의 "최대 4자 · 999+" 가 아니다). 보조 기술이 읽는 이름에는 줄이지 않은 수를 넣는다("새 알림 128개").

### State

상태는 `enabled` 하나다 — 배지는 누르지 않는다(붙은 버튼 · 탭이 누른다). 나타나고 사라질 때 모션이 없다(SEED).

## Guidelines

### 핵심 상태에만 — 보면 사라진다

안 읽은 알림 · 승인할 결재처럼 사용자가 확인해야 할 새 것이 있을 때만 단다. 사용자가 그 내용을 보면(알림 목록을 열면 · 그 탭을 고르면) 바로 사라진다 — "확인했다" 는 신호다. 늘 있는 상태 · 개수(거래 3건 · 걸린 필터 2개)는 알림 배지가 아니다.

[그림: 새 알림이 있을 때만 — 목록을 열면 사라진다](../../site/components/specs/notification-badge.tsx#when-guide)

### 한 화면에 아껴서

강한 색이라 여럿이면 눈이 피로하고 무엇이 중요한지 흐려진다. 한 화면에 하나 둘만, 탭은 여러 탭에 동시에 달지 않고, 하단 탭 바는 셋 이상에 달지 않는다(SEED).

[그림: 상단 바 하나 · 탭마다 점](../../site/components/specs/notification-badge.tsx#overuse-guide)

### 점이 기본, 숫자는 필요할 때

몇 개인지가 판단에 필요할 때만 숫자를 쓴다 — 대부분은 점이면 된다. 개수가 아닌 말("연결됨" · "새로")을 알림 배지 자리에 얹지 않는다 — 말은 버튼 글이나 [Badge](badge.md) 다.

[그림: 점 · 숫자 · 알림 자리에 얹은 말](../../site/components/specs/notification-badge.tsx#count-guide)

### 알림은 브랜드 색

점 · 숫자는 브랜드 색이다(Desk 파랑 · HR 초록). 빨강(위험 색)은 오류 · 넘침 · 위험에 남긴다 — 알림을 빨강으로 칠하면 오류 표시와 같은 색이 된다.

[그림: 브랜드 색 점 · 빨간 점](../../site/components/specs/notification-badge.tsx#color-guide)

### 이름에 넣는다

점 · 숫자는 보조 기술에 숨기고, 붙은 버튼 · 탭의 이름에 넣는다.

| 붙은 곳 | 이름 |
|---|---|
| 아이콘 버튼 · 점 | "알림, 새 알림 있음" |
| 아이콘 버튼 · 숫자 | "알림, 새 알림 3개"(줄이지 않은 수 — "새 알림 128개") |
| 탭 · 점 | 탭 글 뒤 "새 소식"(Tabs) · "새 내용"(Segmented Control) |
| 글 · 숫자 | 글 뒤 "새 소식 N개" — "승인 내역, 새 소식 3개"(줄이지 않은 수) |

수가 바뀌어도 소리로 알리지 않는다(라이브 영역 없음) — 버튼에 초점이 오면 새 이름을 읽는다. 꼭 바로 알려야 하는 새 알림은 [Snackbar](snackbar.md) 다.

[그림: 보조 기술이 읽는 이름 — "알림, 새 알림 3개"](../../site/components/specs/notification-badge.tsx#name-guide)

### 쓰는 자리

| 자리 | 크기 · 붙는 곳 |
|---|---|
| Desk 상단 바 알림(웹 · 앱) | `small` · 아이콘(24) — 상단 바는 점만([Top Navigation](top-navigation.md)) |
| 하단 탭 바의 칸 | `small` · `large` · 아이콘(24) — 2칸까지([Bottom Navigation](bottom-navigation.md)). 지금 다는 칸은 없다 |
| 탭 · Chip Tabs · Segmented Control 의 새 소식 | `small` · 글(값은 [Tabs](tabs.md) · [Segmented Control](segmented-control.md) 스펙) |
| HR | 알림 기능이 아직 없다 — 생기면 같은 규칙 |

필터 칩 줄의 개수("필터 2")는 두지 않는다 — 걸린 조건 칩의 글이 곧 조건이다([Chip](chip.md) 의 필터 바).

## 코드

레시피 `recipes/shadcn/components/ui/notification-badge.tsx` 를 쓴다 — `NotificationBadge` 가 붙을 대상(아이콘 · 글)을 감싸고 그 상자 위에 점 · 숫자를 놓는다. `size`(`"small"` 기본 · `"large"`) · `attach`(`"icon"` 기본 · `"text"`) · `visible`(small — 점을 보일지, 기본 `true`) · `count`(large — 0 이하면 숨김, 100 이상이면 "99+"). 점 · 숫자는 `aria-hidden` 이라 이름은 붙은 버튼에 직접 단다. 숫자 표기는 `formatNotificationCount(count)`(0 이하 `null` · 100 이상 `"99+"`)로 앱과 맞춘다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 상단 바 알림 — 점

[그림: Desk 상단 바 — 알림 점](../../site/components/specs/notification-badge.tsx#ex-dot)

```tsx
import { Bell } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

{/* 상단 바는 Top Navigation 의 아이콘 버튼(44 · 24) — notification 이 이 점(small)을 붙인다 */}
<TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={openNotifications}>
  <Bell />
</TopNavigationIconButton>
```

### 숫자 — 몇 개인지 보여야 할 때

상단 바가 아닌 자리(본문의 아이콘 버튼 · 하단 탭 바의 칸)에서만 — 상단 바는 점만 둔다.

[그림: 알림 3 · 99+](../../site/components/specs/notification-badge.tsx#ex-count)

```tsx
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/ui/notification-badge"

<Button variant="ghost" layout="iconOnly" aria-label={unread > 0 ? `알림, 새 알림 ${unread}개` : "알림"} onClick={openNotifications}>
  <NotificationBadge size="large" count={unread}>
    <Bell />
  </NotificationBadge>
</Button>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 새 것이 생김 | 모션 없이 나타난다. 반복 모션(깜빡임 · 퍼짐)을 걸지 않는다 |
| 사용자가 봄(목록을 엶 · 탭을 고름) | 바로 사라진다 |
| 수가 바뀜 | 숫자만 바뀐다(폭은 숫자를 따른다). 소리로 알리지 않는다 |
| 누르기 | 배지는 누르지 않는다 — 붙은 버튼 · 탭의 동작이다 |
| 글자 크기 설정 | 숫자는 커지지 않는다(아이콘을 덮지 않게) |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 숫자 흰 글자 on `bg-brand-solid` — Desk 8.38 · 다크 8.36 · HR 5.06 · 5.06 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 점 `fg-brand` 흰 표면 위 Desk 8.38 · 다크 6.10 · HR 5.06 · 6.23 ✓(SEED 의 채움 색이면 다크 1.73 · 2.86 으로 묻힌다). 숫자 알약 면은 다크 표면과 Desk 1.73 · HR 2.86 — 흰 숫자가 알린다 |
| **WCAG 1.4.1** Use of color | 점 · 숫자는 소리로는 이름에 들어간다("새 알림 있음") — 색만으로 알리지 않는다 |
| **WCAG 4.1.2** Name, Role, Value | 붙은 버튼 · 탭의 이름에 알림이 있다 ✓ — 점 · 숫자 자신은 `aria-hidden` |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 배지는 누르지 않는다. 붙은 아이콘 버튼은 40(누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 붙은 아이콘 버튼의 누르는 영역 44 ✓ |
| **ARIA** | 점 · 숫자 `aria-hidden="true"`. 아이콘 버튼 이름 "알림, 새 알림 3개" · "알림, 새 알림 있음", 탭은 글 뒤 숨은 글 "새 소식". 라이브 영역 없음 |

## Do / Don't

### ✅ Do

- 확인해야 할 새 것이 있을 때만, 보면 바로 지운다.
- 대부분은 점 — 숫자는 몇 개인지가 필요할 때만.
- 점 · 숫자를 붙은 버튼 · 탭의 이름에 넣는다.
- 브랜드 색으로.

### ❌ Don't

- 0 을 보이기 · "999+".
- 한 화면 여러 곳에 · 여러 탭에 동시에.
- 걸린 필터 수 · 항목 수 같은 늘 있는 개수를 알림 배지로.
- 말("연결됨")을 알림 배지 자리에.
- 빨간 점 — 빨강은 오류다.

## Specification

`notification-badge.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Notification Badge 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — notification-badge.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#notification-badge)

## SEED 와 다른 점

- **점은 브랜드 글자색**(`fg-brand` — 다크에서 밝은 짝) — SEED 는 점도 채움 색(bg.brand-solid)이다. porest 다크에서 채움 색 점은 표면과 Desk 1.73 · HR 2.86:1 로 묻힌다. 숫자 알약은 SEED 대로 채움 색 + 흰 숫자다.
- **숫자 상한은 "99+"** — SEED Bottom Navigation 문서를 따른다(Notification Badge 문서는 "최대 4자 · 999+" 로 두 문서가 다르다).
- **이름에 넣는다** — SEED 는 점 · 숫자에 이름이 없고 붙은 탭 · 버튼의 이름도 그대로라 소리로 알 수 없다. porest 는 붙은 버튼 · 탭의 이름에 "새 알림 3개" · "새 소식" 을 넣는다.
- **점 둘레 링이 없다** — SEED Top Navigation 그림의 바탕색 링(3)은 CSS 에 없다. porest 도 두지 않는다(6 전체가 색).
- 크기 · 자리 · 숫자 글자(글자 크기 설정을 따르지 않음) · 모션 없음은 SEED 와 같다.

## Migration notes

### 2026-10-08 — 글자 값을 고정 px 토큰으로

YAML 의 숫자(large) 글자가 rem 토큰(`$text-t1`)을 가리키고 "글자 크기 설정을 따르지 않는 px" 는 비고에만 있었다 — YAML 대로 만들면 글자 크기 200% 에서 숫자가 22 / 30 으로 커져 알약이 37 × 30 이 되고 아이콘보다 커진다. 레시피 · 제품(웹 `-static` 클래스 · 앱 `TextScaler.noScaling`) · SEED rootage 와 같게 값 자리를 `-static` 토큰(`$text-t1-static`)으로 고쳤다. 크기 · 모습은 그대로다. `-static` 은 같은 글자 토큰의 px 판이다(Typography v104 — 내보낼 때 생긴다). 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 3.

### 2026-10-04 — 상단 바는 점만, 아이콘 24

[Top Navigation](top-navigation.md) 을 정하며 상단 바의 아이콘 버튼이 상자 44 · 아이콘 24 가 됐다(화면 틀 · 이동 결정 1A) — 점 자리는 위 식 그대로 x 17 ~ 23 · y 1 ~ 7 이다. 상단 바에는 점만 둔다(따라오는 것 — 숫자 "99+" 는 맨 오른쪽 버튼에서 화면 밖으로 나간다). 숫자는 하단 탭 바의 칸처럼 몇 개인지가 판단에 필요한 자리에 남긴다.

### 2026-10-03 — 새로 둔다(SEED Notification Badge)

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — 점 · 숫자의 색은 브랜드(4A — 점 `fg-brand`, 숫자 `bg-brand-solid` + 흰 글자), 크기 · 자리는 SEED(점 6 · 숫자 18 · 0 은 안 보임 · 99+), 이름은 버튼에(따라오는 것). 옛 DESIGN.md Badge 절의 "동적 count badge 는 `aria-live`" 규칙은 걷었다(수는 버튼 이름에, 소리로 알리지 않는다).

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사).

- **Desk 웹 상단 바** — 점 7 × 7 에 2px 표면 테두리를 둘러 빨강이 3 × 3 이다(`widgets/layout/ui/PorestTopBar.tsx:54-68` · `:65`). 모바일 머리는 6 × 6(`MobileHeader.tsx:47-61`). 둘 다 `aria-hidden` 이고 버튼 이름은 "알림" 뿐 — 새 알림이 있는지 소리로 알 수 없다. 빨강(`--fg-expense`)을 브랜드 점 6 으로.
- **Desk 앱 상단 바** — 7 × 7 빨강 · 의미 노드 없음(`shared/widgets/mobile_header.dart:82-118`), 버튼은 툴팁 "알림" 뿐.
- **필터 개수** — 웹 16 알약 · `aria-hidden`(`pages/expense/ui/ExpensePage.tsx:1916-1929`), 앱 `PBadge` 23 × 17 · 버튼 이름 없이 "3" 으로만 읽힘(`features/expense/presentation/expense_screen.dart:874-901 · 929-936`, `features/todo/presentation/todo_screen.dart:699-707`), HR 버튼 안 "필터 3"(`work-report/ui/ReportHeader.tsx:43-58`). 필터 바는 Chip 결정대로 개수를 걷는다.
- **상세 빠른 동작 위의 말** — 44 원 버튼 위 브랜드 알약에 "2개" · "연결됨" · "1건" 을 얹어 버튼 이름 앞에 붙어 "2개 내역 분할" · "연결됨 반복 설정" 으로 읽힌다(웹 `shared/ui/porest/detail.tsx:211-215` ← `TxDetailDialog.tsx:318-357`, 앱 `shared/widgets/p_detail.dart:292`). 알림이 아니다 — 버튼 글 · 설명으로 옮긴다.
- **죽은 코드** — 웹 `features/notification/ui/NotificationBell.tsx:78-82`("99+" 10px · 빨강, 쓰는 곳 0) · `shared/ui/sidebar.tsx:628-647` `SidebarMenuBadge` · `porest.css:121 · 190` `.side__item .count`.
- **HR** — 알림 기능이 없다. 생기면 같은 규칙(초록 점).
