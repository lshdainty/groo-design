# Popover

> 트리거에 붙어 떠 있는 표면입니다. 1280 이상에서 부가 정보 · 짧은 동작 · 고르는 패널(Input Button 의 달력 · 시각 · 목록)을 띄우고, 같은 내용을 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 띄웁니다. 비모달이라 뒤 화면을 막지 않습니다. 폼 · 상세는 [Dialog](dialog.md), 줄의 동작 목록은 [Menu](menu.md), 짧은 도움말 말풍선은 [Help Bubble](help-bubble.md) 입니다.

표면 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥으로 이루어지고, 머리 · 본문 · 바닥 여백은 Dialog 와 같습니다.

수치 원본은 [`popover.yaml`](popover.yaml)입니다.

[그림: 연차 사용 규정 · 날짜 고르기 — 라이트 · 다크](../../site/components/specs/popover.tsx#hero)

### 직접 골라 보기

머리 · 바닥 · 본문 길이 · 트리거 자리(화면 위 · 아래 · 가장자리)를 고르면 스펙대로 그린 팝오버와 그 코드가 바뀝니다. 실제로 열고 Tab 으로 빠져나가 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/popover.tsx#playground)

## Anatomy

[그림: 팝오버는 표면 · 머리 · 본문 · 바닥으로 — 트리거와 8 떨어집니다](../../site/components/specs/popover.tsx#anatomy)

| ⓐ Container | 표면 — 트리거 아래(모자라면 위), 폭 320 ~ 480, 그림자 s3. |
| ⓑ Header | 머리 — 제목 · 설명 · 닫기. 없어도 됩니다(고르는 패널). |
| ⓒ Body | 본문 — 넘치면 이 안에서 스크롤합니다. 넘칠 수 있는 본문은 끝을 흐립니다([Scroll Fog](scroll-fog.md) — Dialog 와 같습니다). |
| ⓓ Footer | 바닥 — 버튼(Button small), 오른쪽 정렬. 없어도 됩니다. |

[표: 부위](popover.yaml#slots)

## Properties

### 크기 · 자리

폭은 320 ~ 480 이고 화면 가장자리에서 16 을 남깁니다. 높이는 600 과 남은 공간 중 작은 쪽까지이고, 넘치면 본문이 스크롤합니다. 트리거와 8 떨어져 아래에 뜨고, 아래 공간이 모자라면 위로, 옆으로 넘치면 화면 안으로 밉니다. 모서리 20 · 그림자 s3 입니다 — 시트 · 대화상자와 달리 딤이 없어 그림자로 뜹니다. 바닥 버튼은 Button small(36)입니다.

층은 [z-index](../z-index.md) 의 L3(`z-floating` 200)입니다 — 페이지에서도, 대화상자 · 시트(L2) 안에서도 그 위에 뜨고, 확인창(L5) 아래에 놓입니다.

[그림: 자리 — 아래 · 모자라면 위 · 가장자리에서 민다](../../site/components/specs/popover.tsx#placement)

[표: 공통](popover.yaml#base.enabled)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 |
| `pressed` | 닫기 버튼 — `bg-layer-floating-pressed` + 2px 거리 축소 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |

[표: 상태](popover.yaml#matrix)

[표: 모션](popover.yaml#motion)

## Guidelines

### 트리거에 붙는 짧은 것

팝오버는 그 트리거에 대한 것만 담습니다 — 칸 옆 안내 · 그 칸에 넣을 값 고르기(달력 · 시각 · 아이콘 격자 · 목록) · 짧은 동작, 그리고 그 버튼이 여는 목록 하나(Desk 데스크톱 머리 벨의 알림 목록 — 아래). 같은 내용이 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 뜹니다(Input Button 이 폭으로 고릅니다). 폼 · 상세는 [Dialog](dialog.md), 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 줄의 동작 목록은 [Menu](menu.md) 입니다. 어느 떠 있는 표면을 쓸지 일곱을 견준 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 한 벌입니다.

**폼을 두지 않는 까닭** — 팝오버는 비모달이라 바깥 누르기 · `Tab` 으로 닫히고, 닫히면 입력이 사라집니다. "바뀐 값이 있으면 닫기 전에 묻는다"([Field](field.md))와 함께 설 수 없습니다. 그래서 저장해야 남는 입력은 칸 하나라도 Dialog 입니다(1280 미만은 같은 폼이 시트로). 고르면 바로 들어가는 것(달력 · 시각 · 목록 · 아이콘)만 팝오버에 둡니다 — 고르는 순간 값이 칸에 들어가 잃을 것이 없기 때문입니다. 경계는 칸 수가 아니라 닫히면 잃는지입니다.

[그림: 쓰임 — 칸 옆 안내 · 고르는 패널 · 팝오버에 폼](../../site/components/specs/popover.tsx#role-guide)

### 비모달 — 뒤 화면을 막지 않는다

열면 초점이 팝오버 안으로 가지만 가두지 않습니다 — 마지막 칸에서 Tab 을 누르면 페이지로 나가고 팝오버는 닫힙니다. 딤 · 스크롤 잠금이 없고 뒤 화면을 숨기지 않습니다. `Esc` 로 닫으면 초점이 트리거로 돌아가고, 바깥을 눌러 닫으면 누른 자리로 갑니다(그 자리가 초점을 받지 못하면 트리거로).

[그림: 닫기 — 바깥 · Esc · Tab 으로 빠져나가기](../../site/components/specs/popover.tsx#dismiss-guide)

### 알림 목록 — 벨 아래(1280 이상) · 시트(미만)

Desk 데스크톱 머리의 벨을 누르면 1280 이상에서는 벨 아래 팝오버로, 768 ~ 1279 에서는 [Bottom Sheet](bottom-sheet.md) 로 알림 목록을 엽니다 — 이 스펙의 1280 경계 그대로입니다. 목록이 길고 개수가 정해지지 않았어도 트리거(벨) 하나가 여는 목록이라 팝오버에 둡니다 — 폼 · 상세는 담지 않습니다. 폭은 380, 높이는 이 스펙대로 600 과 남은 공간 중 작은 쪽까지이고, 넘치면 본문(목록)만 스크롤하며 끝을 흐립니다. 머리는 제목 "알림" · 설명 "읽지 않은 알림 N개" · 닫기, 바닥은 "알림 설정" · "모두 읽음"(Button small)이며 시트도 같은 내용입니다(시트의 바닥 버튼은 large 반씩). 줄을 누르면 읽음으로 표시하고 이동하지 않습니다. 폰(768 미만)의 벨은 알림 화면으로 갑니다.

줄 끝에는 ⋮ 하나를 둡니다 — Button `ghost` · `ghostColor="neutralSubtle"` · `iconOnly` · `xsmall`(보이는 32 · 누르는 44), 이름 "{알림 제목} 더보기". 시각 옆에 놓고 줄의 읽음 버튼과 형제로 둡니다 — 줄 버튼 안에 넣지 않아 따로 눌리고 따로 읽힙니다. 누르면 1280 미만은 [Menu Sheet](menu-sheet.md)(제목 = 알림 제목), 이상은 [Menu](menu.md) 로 위험 줄 "삭제" 하나를 엽니다. 메뉴가 다 닫힌 뒤 [Alert Dialog](alert-dialog.md) "알림 삭제" · "삭제한 알림은 되돌릴 수 없어요." [취소][삭제] 를 열고, 지우기는 확인에서만 나갑니다. 지우다 실패하면 확인창을 닫고 critical 스낵바 + [다시 시도] 로 알립니다 — [다시 시도] 는 다시 묻지 않고 바로 요청합니다(Alert Dialog 의 "요청이 실패하면"). 줄 밀기로 지우지 않습니다. 폰의 알림 화면 · 벨 시트 · 벨 팝오버가 모두 같습니다.

[그림: 알림 목록 — 1280 벨 아래 팝오버 · 1024 Bottom Sheet · 알림 0개](../../site/components/specs/popover.tsx#notification-guide)

[표: 알림 목록](popover.yaml#base.enabled@notificationList)

### 머리는 있을 때 제목 + 닫기

안내 팝오버는 머리에 제목과 닫기 버튼을 둡니다. 고르는 패널(달력 · 목록)은 머리 없이 본문만 둡니다 — 무엇을 고르는지는 트리거가 말합니다. 바닥 버튼은 고른 것을 넣을 때("완료")만 둡니다.

### 글

제목은 무엇에 대한 안내인지("연차 사용 규정") 적고, 본문은 해요체 짧은 문장으로 씁니다. 긴 안내 · 단계가 있는 설명은 팝오버가 아니라 페이지 · 도움말입니다.

## 코드

레시피 `recipes/shadcn/components/ui/popover.tsx` 를 씁니다(Radix Popover 위). Input Button 의 고르는 패널은 `useInputButtonSurface()` 가 1280 이상일 때만 팝오버로 엽니다([Input Button](input-button.md)). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 안내

[그림: 연차 사용 규정](../../site/components/specs/popover.tsx#ex-info)

```tsx
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

{/* 1280 이상 — 1280 미만에서는 같은 내용을 Bottom Sheet 로 띄운다(useInputButtonSurface() 로 고른다) */}
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="xsmall" layout="iconOnly" aria-label="연차 사용 규정"><Info /></Button>
  </PopoverTrigger>
  <PopoverContent title="연차 사용 규정">
    <PopoverBody>입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.</PopoverBody>
  </PopoverContent>
</Popover>
```

### 알림 목록 — 1280 이상 팝오버 · 미만 시트

[그림: 알림 목록 — 벨 아래 팝오버](../../site/components/specs/popover.tsx#ex-notifications)

```tsx
import { Bell } from "lucide-react"
import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetFooter, BottomSheetTrigger } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"
import { useInputButtonSurface } from "@/components/ui/input-button"
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from "@/components/ui/popover"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

const surface = useInputButtonSurface() // 1280 미만 "sheet" · 이상 "popover"
const bell = (
  <TopNavigationIconButton notification={unread > 0} aria-label={unread > 0 ? "알림, 새 알림 있음" : "알림"}>
    <Bell />
  </TopNavigationIconButton>
)
const description = unread > 0 ? `읽지 않은 알림 ${unread}개` : "새 알림이 없어요"

{/* 같은 내용 — 넓으면 벨 아래 팝오버(폭 380), 좁으면 아래 시트. 줄을 누르면 읽음 표시 */}
{surface === "popover" ? (
  <Popover>
    <PopoverTrigger asChild>{bell}</PopoverTrigger>
    <PopoverContent title="알림" description={description} align="end" className="w-[380px]">
      <PopoverBody scrollFog>{notificationList}</PopoverBody>
      <PopoverFooter>
        <Button variant="neutralWeak" size="small" onClick={openNotificationSettings}>알림 설정</Button>
        <Button variant="neutralSolid" size="small" onClick={markAllRead} disabled={unread === 0}>모두 읽음</Button>
      </PopoverFooter>
    </PopoverContent>
  </Popover>
) : (
  <BottomSheet>
    <BottomSheetTrigger asChild>{bell}</BottomSheetTrigger>
    <BottomSheetContent title="알림" description={description}>
      <BottomSheetBody scrollFog>{notificationList}</BottomSheetBody>
      <BottomSheetFooter>
        <Button variant="neutralWeak" onClick={openNotificationSettings}>알림 설정</Button>
        <Button variant="neutralSolid" onClick={markAllRead} disabled={unread === 0}>모두 읽음</Button>
      </BottomSheetFooter>
    </BottomSheetContent>
  </BottomSheet>
)}
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 | 열고 닫습니다. 150ms 로 트리거 쪽에서 커지며 나타납니다. |
| 열린 뒤 | 초점이 팝오버 안으로(머리 닫기 버튼이 아니라 내용) 갑니다. |
| Tab | 팝오버 안을 지나 마지막에서 페이지로 나가면 닫힙니다(초점은 나간 자리에 남습니다). |
| Shift+Tab | 거꾸로 — 내용 첫 칸 다음은 머리 닫기 버튼, 그다음 트리거입니다(팝오버는 열린 채). 보이는 순서(닫기는 위)와 같고, 닫기 버튼에 키보드로 닿는 길이 남습니다. |
| `Esc` | 닫고, 초점은 트리거로 돌아갑니다. |
| 바깥 누르기 | 닫습니다 — 초점은 누른 자리로 갑니다(누른 곳이 초점을 받지 못하면 트리거로). |
| 대화상자 · 시트 안에서 | 그 위에 뜹니다(z-index L3) — 대화상자가 닫히면 함께 닫힙니다. |
| 글자 크기 설정 | 제목 · 설명 · 본문 글이 커집니다. 폭은 최대 폭을 넘지 않고 줄을 바꿔 높이가 늘어나며, 최대 높이를 넘으면 본문이 스크롤합니다. 닫기 상자 · 아이콘은 px 그대로이고 제목 첫 줄 가운데에 섭니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 표면 경계는 그림자 s3(딤 없음) — 표면을 알리는 유일한 표시가 아닙니다(머리 · 내용이 알립니다). 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 1.4.4** Resize text | 제목 · 설명 · 본문이 글자 크기 설정을 따르고, 최대 폭 안에서 줄을 바꿔 받아 잘리지 않습니다(넘치면 본문 스크롤) ✓ |
| **WCAG 1.4.13** Content on Hover or Focus | 누를 때 열리고(호버로 열지 않습니다) 바깥 · `Esc` 로 닫힙니다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 52 ✓ · 알림 줄 ⋮ 보이는 32(누르는 44) ✓ |
| **ARIA** | `role="dialog"`(`aria-modal` 없음), 제목 `aria-labelledby`(있을 때), 트리거 `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`. 머리 없는 고르는 패널은 `aria-label` 로 이름을 답니다 |

## Do / Don't

### ✅ Do

- 트리거에 대한 짧은 안내 · 값 고르기 · 그 버튼이 여는 목록(벨의 알림)을 1280 이상에서 팝오버로 띄웁니다 — 1280 미만은 같은 내용을 시트로 띄웁니다.
- 열면 초점을 안으로, 닫으면 트리거로 옮깁니다.
- 안내 팝오버에는 제목과 닫기를 둡니다.

### ❌ Don't

- 팝오버에 폼 · 상세를 두지 않습니다(Dialog) — 저장해야 남는 입력은 칸 하나라도 그렇습니다. 바깥 누르기 · `Tab` 으로 닫혀 입력이 사라집니다.
- 호버로 열지 않습니다(도움말 말풍선은 [Help Bubble](help-bubble.md)).
- 팝오버 위에 팝오버를 띄우지 않습니다(고르는 패널 안의 작은 패널은 예외 — 달력의 월 · 연도).
- 1280 미만에서 팝오버를 쓰지 않습니다(시트).

## Specification

`popover.yaml` 의 규칙을 조건마다 빠짐없이 그립니다 — 웹 · 앱이 Popover 를 만들 때 이 값을 그대로 씁니다.

[그림: Specification — popover.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#popover)
