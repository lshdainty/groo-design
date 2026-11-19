# Notification Badge

> 안 읽은 알림 · 확인하지 않은 새 것이 있다는 신호입니다 — 점(있음)과 숫자(몇 개). 아이콘 버튼 · 탭 글에 붙고, 사용자가 보면 사라집니다. 대상의 상태 · 분류를 글로 보이는 것은 [Badge](badge.md) 입니다.

점(small)과 숫자 알약(large) 두 가지이며, 아이콘 · 글에 붙는 자리와 크기는 고정입니다. Tabs · Chip Tabs · Segmented Control 의 알림 점도 이 점입니다.

수치 원본은 [`notification-badge.yaml`](notification-badge.yaml)입니다.

[그림: Desk 상단 바 알림 · 탭 · Segmented 의 알림 점 — 라이트 · 다크](../../site/components/specs/notification-badge.tsx#hero)

### 직접 골라 보기

크기(점 · 숫자) · 붙는 자리(아이콘 · 글) · 숫자를 고르면 스펙대로 그린 배지와 그 코드, 보조 기술이 읽는 이름이 바뀝니다. 0 이면 사라지고 100 이상이면 "99+" 입니다.

[그림: 플레이그라운드](../../site/components/specs/notification-badge.tsx#playground)

## Anatomy

[그림: 점(small)과 숫자 알약(large) — 아이콘 상자 위에 겹쳐 놓입니다](../../site/components/specs/notification-badge.tsx#anatomy)

| ⓐ Dot | 점 — 6, 새 것이 있는지만 알립니다. |
| ⓑ Count Container | 숫자 알약 — 높이 18, 폭은 숫자만큼입니다. |
| ⓒ Count Label | 숫자 — 1 ~ 99, 100 이상은 "99+" 입니다. |

[표: 부위](notification-badge.yaml#slots)

## Properties

### Size

`small`(점 6) *(기본)* 은 새 것이 있는지만 중요할 때 씁니다 — 탭 · Segmented · 상단 바. `large`(숫자 18)는 몇 개인지가 판단에 필요할 때만 씁니다 — 하단 탭 바의 칸처럼(2칸까지). 상단 바([Top Navigation](top-navigation.md))에는 점만 둡니다 — 숫자 알약은 아이콘 오른쪽으로 자라서, 맨 오른쪽 버튼에서는 "99+" 가 화면 밖으로 8.5 나가기 때문입니다. 숫자는 11 / 15 · 700(`text-t1-static` — 같은 글자 토큰의 px 판)이고 글자 크기 설정을 따르지 않습니다. 커지면 아이콘을 덮기 때문입니다.

점은 브랜드 글자색(`fg-brand` — 다크에서 밝은 짝)이고, 숫자 알약은 브랜드 채움(`bg-brand-solid`) + 흰 숫자입니다. 점을 채움 색으로 칠하지 않는 것은 다크에서 `bg-brand-solid` 점이 표면과 Desk · HR 1.73:1 로 묻히기 때문입니다. 점 둘레에는 링을 두지 않고 6 전체를 색으로 칠합니다. Desk 는 파랑, HR 은 초록입니다. 알림은 오류가 아닙니다 — 빨강은 오류 · 위험에 남깁니다.

[그림: 크기 — 점 6 · 숫자 1 · 12 · 99+, Desk · HR — 라이트 · 다크](../../site/components/specs/notification-badge.tsx#size)

[표: 크기](notification-badge.yaml#size)

[표: 공통](notification-badge.yaml#base.enabled)

### Attach

자리는 붙는 대상의 상자에서 잽니다 — 아이콘이면 아이콘 상자(버튼 상자가 아닙니다), 글이면 글 상자입니다. 위치 · 크기는 고정이며 화면마다 옮기지 않습니다.

- **아이콘 · 점** — 아이콘 상자 오른쪽 위 안쪽 1. 24 아이콘이면 x 17 ~ 23 · y 1 ~ 7 입니다(아이콘 크기가 달라도 같은 식 — 18 아이콘이면 x 11 ~ 17).
- **아이콘 · 숫자** — 알약의 왼쪽 아래 꼭짓점이 (아이콘 폭 − 8, 14). 24 아이콘이면 (16, 14) 이라 위로 4, 오른쪽으로 튀어나오고 숫자가 길수록 오른쪽으로 자랍니다. 본문의 아이콘 버튼(Button `iconOnly` medium 40 · 아이콘 18)이면 (10, 14)입니다. 두 자리 · "99+" 는 버튼 오른쪽 밖으로 나갈 수 있습니다.
- **상단 바** — [Top Navigation](top-navigation.md) 의 아이콘 버튼은 상자 44 · 아이콘 24 입니다 — 점은 x 17 ~ 23 · y 1 ~ 7. 상단 바에는 점만 둡니다.
- **글** — 마지막 글자 뒤 2, 위는 글 줄 상자의 위 끝. 탭 · 칸 폭과 줄 높이를 바꾸지 않습니다. Chip Tabs 만 칩 안 글 뒤 6 · 세로 가운데에 흐름으로 놓습니다(값은 [Tabs](tabs.md)).

[그림: 붙는 자리 — 24 아이콘의 점 · 숫자 좌표와 글 끝 2](../../site/components/specs/notification-badge.tsx#placement)

[표: 붙는 대상](notification-badge.yaml#attach)

[표: 아이콘에 붙을 때 — 크기마다](notification-badge.yaml#compound)

### 숫자

| 개수 | 보이는 것 |
|---|---|
| 0 | 배지가 없습니다(점도 숫자도) |
| 1 ~ 99 | 그 숫자 |
| 100 이상 | "99+" |

숫자의 상한은 "99+" 입니다 — "999+" 처럼 늘리지 않습니다. 보조 기술이 읽는 이름에는 줄이지 않은 수를 넣습니다("새 알림 128개").

### State

상태는 `enabled` 하나입니다 — 배지는 누르지 않습니다(붙은 버튼 · 탭이 누릅니다). 나타나고 사라질 때 모션이 없습니다.

## Guidelines

### 핵심 상태에만 — 보면 사라진다

안 읽은 알림 · 승인할 결재처럼 사용자가 확인해야 할 새 것이 있을 때만 답니다. 사용자가 그 내용을 보면(알림 목록을 열면 · 그 탭을 고르면) 바로 사라집니다 — "확인했다" 는 신호입니다. 늘 있는 상태 · 개수(거래 3건 · 걸린 필터 2개)는 알림 배지가 아닙니다.

[그림: 새 알림이 있을 때만 — 목록을 열면 사라집니다](../../site/components/specs/notification-badge.tsx#when-guide)

### 한 화면에 아껴서

강한 색이라 여럿이면 눈이 피로하고 무엇이 중요한지 흐려집니다. 한 화면에는 되도록 적게, 가장 급한 알림에만 답니다. 탭은 여러 탭에 동시에 달지 않고, 하단 탭 바는 셋 이상에 달지 않습니다.

[그림: 상단 바 하나 · 탭마다 점](../../site/components/specs/notification-badge.tsx#overuse-guide)

### 점이 기본, 숫자는 필요할 때

몇 개인지가 판단에 필요할 때만 숫자를 씁니다 — 대부분은 점이면 됩니다. 개수가 아닌 말("연결됨" · "새로")을 알림 배지 자리에 얹지 않습니다 — 말은 버튼 글이나 [Badge](badge.md) 입니다.

[그림: 점 · 숫자 · 알림 자리에 얹은 말](../../site/components/specs/notification-badge.tsx#count-guide)

### 알림은 브랜드 색

점 · 숫자는 브랜드 색입니다(Desk 파랑 · HR 초록). 빨강(위험 색)은 오류 · 넘침 · 위험에 남깁니다 — 알림을 빨강으로 칠하면 오류 표시와 같은 색이 됩니다.

[그림: 브랜드 색 점 · 빨간 점](../../site/components/specs/notification-badge.tsx#color-guide)

### 이름에 넣는다

점 · 숫자는 보조 기술에 숨기고, 붙은 버튼 · 탭의 이름에 넣습니다.

| 붙은 곳 | 이름 |
|---|---|
| 아이콘 버튼 · 점 | "알림, 새 알림 있음" |
| 아이콘 버튼 · 숫자 | "알림, 새 알림 3개"(줄이지 않은 수 — "새 알림 128개") |
| 탭 · 점 | 탭 글 뒤 "새 소식"(Tabs · Segmented Control 이 같은 말을 씁니다) |
| 글 · 숫자 | 글 뒤 "새 소식 N개" — "승인 내역, 새 소식 3개"(줄이지 않은 수) |

수가 바뀌어도 소리로 알리지 않습니다(라이브 영역 없음) — 버튼에 초점이 오면 새 이름을 읽습니다. 꼭 바로 알려야 하는 새 알림은 [Snackbar](snackbar.md) 로 알립니다.

[그림: 보조 기술이 읽는 이름 — "알림, 새 알림 3개"](../../site/components/specs/notification-badge.tsx#name-guide)

### 쓰는 자리

| 자리 | 크기 · 붙는 곳 |
|---|---|
| Desk 상단 바 알림(웹 · 앱) | `small` · 아이콘(24) — 상단 바는 점만([Top Navigation](top-navigation.md)) |
| 하단 탭 바의 칸 | `small` · `large` · 아이콘(24) — 2칸까지([Bottom Navigation](bottom-navigation.md)) |
| 탭 · Chip Tabs · Segmented Control 의 새 소식 | `small` · 글(값은 [Tabs](tabs.md) · [Segmented Control](segmented-control.md) 스펙) |
| HR | Desk 와 같은 규칙(브랜드 색 초록) |

필터 칩 줄의 개수("필터 2")는 두지 않습니다 — 걸린 조건 칩의 글이 곧 조건입니다([Chip](chip.md) 의 필터 바).

## 코드

레시피 `recipes/shadcn/components/ui/notification-badge.tsx` 를 씁니다 — `NotificationBadge` 가 붙을 대상(아이콘 · 글)을 감싸고 그 상자 위에 점 · 숫자를 놓습니다. `size`(`"small"` 기본 · `"large"`) · `attach`(`"icon"` 기본 · `"text"`) · `visible`(small — 점을 보일지, 기본 `true`) · `count`(large — 0 이하면 숨김, 100 이상이면 "99+"). 점 · 숫자는 `aria-hidden` 이라 이름은 붙은 버튼에 직접 답니다. 숫자 표기는 `formatNotificationCount(count)`(0 이하 `null` · 100 이상 `"99+"`)로 앱과 맞춥니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

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

상단 바가 아닌 자리(본문의 아이콘 버튼 · 하단 탭 바의 칸)에서만 씁니다 — 상단 바는 점만 둡니다.

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
| 새 것이 생김 | 모션 없이 나타납니다. 반복 모션(깜빡임 · 퍼짐)을 걸지 않습니다 |
| 사용자가 봄(목록을 엶 · 탭을 고름) | 바로 사라집니다 |
| 수가 바뀜 | 숫자만 바뀝니다(폭은 숫자를 따릅니다). 소리로 알리지 않습니다 |
| 누르기 | 배지는 누르지 않습니다 — 붙은 버튼 · 탭의 동작입니다 |
| 글자 크기 설정 | 점 · 숫자는 글자 크기 설정을 따르지 않습니다 — 커지면 아이콘을 덮기 때문입니다. 같은 수는 붙은 버튼 · 탭의 이름으로 읽습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 숫자 흰 글자 on `bg-brand-solid` — Desk 8.38 · 다크 8.36 · HR 8.17 · 8.36 ✓ |
| **WCAG 1.4.4** Resize text | 숫자는 아이콘 위 표식이라 예외로 그대로 둡니다 — 같은 수를 붙은 버튼 · 탭의 이름("알림, 새 알림 3개")으로 읽고, 목록을 열면 크게 봅니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 점 `fg-brand` 흰 표면 위 Desk 8.38 · 다크 6.10 · HR 8.17 · 6.07 ✓(채움 색 `bg-brand-solid` 이면 다크에서 Desk · HR 1.73 으로 묻힙니다). 숫자 알약 면은 다크 표면과 Desk · HR 1.73 이라 흰 숫자가 알립니다 |
| **WCAG 1.4.1** Use of color | 점 · 숫자는 이름에도 들어갑니다("새 알림 있음") — 색만으로 알리지 않습니다 |
| **WCAG 4.1.2** Name, Role, Value | 붙은 버튼 · 탭의 이름에 알림이 있습니다 ✓ — 점 · 숫자 자신은 `aria-hidden` |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 해당 없음 — 배지는 누르지 않습니다. 붙은 아이콘 버튼은 40(누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 해당 없음 — 붙은 아이콘 버튼의 누르는 영역 44 ✓ |
| **ARIA** | 점 · 숫자 `aria-hidden="true"`. 아이콘 버튼 이름 "알림, 새 알림 3개" · "알림, 새 알림 있음", 탭은 글 뒤 숨은 글 "새 소식". 라이브 영역 없음 |

## Do / Don't

### ✅ Do

- 확인해야 할 새 것이 있을 때만 달고, 보면 바로 지웁니다.
- 대부분은 점으로 — 숫자는 몇 개인지가 필요할 때만 씁니다.
- 점 · 숫자를 붙은 버튼 · 탭의 이름에 넣습니다.
- 브랜드 색으로 칠합니다.

### ❌ Don't

- 0 을 보이거나 "999+" 로 늘리지 않습니다.
- 여러 탭에 동시에 · 하단 탭 바 셋 이상에 달지 않습니다.
- 걸린 필터 수 · 항목 수 같은 늘 있는 개수를 알림 배지로 보이지 않습니다.
- 말("연결됨")을 알림 배지 자리에 얹지 않습니다.
- 빨간 점을 쓰지 않습니다 — 빨강은 오류입니다.

## Specification

`notification-badge.yaml` 의 규칙을 조건마다 빠짐없이 그립니다 — 웹 · 앱이 Notification Badge 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — notification-badge.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#notification-badge)
