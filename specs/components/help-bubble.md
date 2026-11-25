# Help Bubble

> 트리거를 누르면 옆에 뜨는 짙은 도움말 말풍선입니다. 화면에 늘 두기에는 길고, 몰라도 일은 할 수 있는 설명(규정 · 계산 방법 · 기능 안내)에 씁니다. 마우스를 올리면 뜨는 짧은 설명은 같은 모양의 [Tooltip](tooltip.md), 화면 안에 늘 보여야 하는 안내는 Callout, 버튼 · 입력이 있는 내용은 [Popover](popover.md) 입니다.

말풍선 · 화살표 · 제목 · 설명 · 닫기 버튼으로 이뤄집니다. [Tooltip](tooltip.md) 도 같은 말풍선을 쓰고, 여는 방식만 다릅니다.

수치 원본은 [`help-bubble.yaml`](help-bubble.yaml)입니다(Tooltip 과 같은 파일).

[그림: 연차 사용 규정 · 거래 검색 안내 — 라이트 · 다크](../../site/components/specs/help-bubble.tsx#hero)

### 직접 골라 보기

설명 · 닫기 버튼 · 위치를 고르면 스펙대로 그린 말풍선과 그 코드가 바뀝니다. 실제로 눌러 열고 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/help-bubble.tsx#playground)

## Anatomy

[그림: 말풍선은 화살표 · 제목 · 설명 · 닫기 버튼으로](../../site/components/specs/help-bubble.tsx#anatomy)

| ⓐ Container | 말풍선 — 짙은 바탕(다크에서는 밝은 바탕), 최대 280 입니다. |
| ⓑ Arrow | 화살표 — 늘 트리거 가운데를 가리킵니다(화면 끝에서도 비키지 않고 말풍선이 밀립니다). 화살표 끝과 트리거 사이는 4 입니다. |
| ⓒ Title | 제목 — 13 · 700. 한 줄로 끝나면 이것만 둡니다. |
| ⓓ Description | 설명 — 13 · 400. 제목을 풀어 줄 때만 둡니다. |
| ⓔ Close Button | 닫기 — 오른쪽 위 모서리. 닫기 전까지 남겨 둘 안내에만 둡니다. |

[표: 부위](help-bubble.yaml#slots)

## Properties

### 말풍선

위아래 10 · 좌우 12, 모서리 12, 그림자 없음. 제목 13 / 18 · 700, 설명 13 / 18 · 400, 제목 ↔ 설명 2 — 한 줄이면 38, 설명이 있으면 58. 폭은 내용만큼이고 최대 280(여백 포함)입니다 — 한 줄에 20자 안팎, 2 ~ 3줄이면 넘지 않습니다.

[그림: 말풍선의 여백 · 화살표 · 간격](../../site/components/specs/help-bubble.tsx#layout)

[표: 공통](help-bubble.yaml#base.enabled)

### 위치

기본은 트리거 위입니다. 자리가 모자라면 반대편으로 뒤집고 옆으로 밉니다 — 화면 가장자리와 16 을 남깁니다. 화살표는 늘 트리거 가운데를 가리키고 말풍선 모서리와 14 를 남깁니다.

큰 글자에서 말풍선이 고른 쪽에도 다 들지 않으면 높이를 그쪽에 남은 공간까지 줄이고, 글은 말풍선 안에서 스크롤합니다. 화면 가장자리는 안전 영역(상태 표시줄 · 홈 표시줄 · 노치)의 경계부터 잽니다.

셋이 부딪히면 아래 순서로 지킵니다.

1. **화살표는 트리거 가운데** — 비켜 그리지 않고, 지우지도 않습니다.
2. **화살표 ↔ 말풍선 모서리 14** — 화살표 가운데가 말풍선 끝에서 20(14 + 화살표 폭의 반 6) 안쪽에 오도록 말풍선을 트리거 쪽으로 밉니다.
3. **화면 가장자리 16** — 위 둘을 지키느라 모자라면 16 보다 가장자리에 붙습니다. 붙는 만큼에 하한은 없어 화면 끝(0)까지 갑니다. 트리거가 화면 끝에 붙어도 누르는 자리가 40 이상이면 가운데가 끝에서 20 이상이라 말풍선은 화면 밖으로 나가지 않습니다.

상단 바 오른쪽 끝의 알림(아이콘 버튼 44 · 화면 끝 6)에서는 말풍선 오른쪽이 화면 끝에서 8, 화면 왼쪽 끝 0 에 붙은 ⓘ 40 에서는 0 입니다. 위 · 아래로 뒤집어도 가로 자리는 같으므로 뒤집기로 풀지 않습니다. 웹 레시피는 트리거 자리를 재어 그쪽 가장자리 여백(`collisionPadding`)을 `min(16, 트리거 가운데 − 20)` 으로 줄입니다.

말풍선은 `specs/z-index.md` 의 L4(`z-tooltip` 210)에 그립니다 — 팝오버 · 메뉴 안에서 열어도 그 위에 뜹니다.

[그림: 위 · 아래 · 옆 — 화살표는 늘 트리거 가운데, 화면 끝에서는 말풍선이 민다](../../site/components/specs/help-bubble.tsx#placement)

### 닫기 버튼

닫기 전까지 남겨 둘 안내(처음 쓰는 기능의 설명처럼 처음부터 열어 두는 말풍선)에만 둡니다. 상자 38 · 아이콘 14 이고 누르는 영역은 44 입니다.

[표: 닫기 버튼](help-bubble.yaml#compound)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 |
| `pressed` | 닫기 버튼 — 아이콘만 2px 거리 축소(바탕 없음) |
| `focused` | 웹 — 닫기 버튼 안쪽 2px 링, 말풍선 글자색 |

[표: 상태](help-bubble.yaml#matrix.closeButton.shown)

[표: 모션](help-bubble.yaml#motion)

## Guidelines

### 도움말을 어디에 두나

| 이런 안내 | 쓰는 것 |
|---|---|
| 아이콘 버튼 · 줄인 글의 짧은 설명(마우스 · 키보드) | [Tooltip](tooltip.md) |
| 몰라도 일은 할 수 있는 설명 — 규정 · 계산 방법 · 기능 안내 | **Help Bubble**(ⓘ 를 눌러서) |
| 일을 하려면 꼭 읽어야 하는 안내 | 화면 안 글 · [Callout](callout.md) |
| 버튼 · 입력이 있는 내용 | [Popover](popover.md) |
| 길거나 확인을 받아야 하는 설명 | [Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md) |

[그림: 도움말의 자리 — 툴팁 · 말풍선 · 화면 안 글 · 팝오버](../../site/components/specs/help-bubble.tsx#role-guide)

결과 · 상태 · 오류처럼 알리는 일(Snackbar · Callout · Page Banner · Result Section · Alert Dialog)을 고르는 표는 [Snackbar 의 "무엇으로 알리나"](snackbar.md) 한 벌입니다. 이 표는 도움말의 자리만 맡습니다.

### 터치에서도 닿는 도움말

[Tooltip](tooltip.md) 은 손가락으로 누르면 열리지 않습니다. 폰에서도 읽어야 하는 설명은 이 말풍선에 둡니다 — 트리거는 ⓘ 아이콘 버튼(이름 "{무엇} 안내")이고, 누르면 열고 다시 누르거나 바깥을 누르면 닫습니다.

[그림: ⓘ 를 눌러 여는 말풍선 — 폰 · 데스크톱](../../site/components/specs/help-bubble.tsx#touch-guide)

### 짧게

제목 한 줄, 설명 2 ~ 3줄이면 충분합니다. 그보다 길면 화면 안 글이나 시트로 옮깁니다. 말풍선 안에 링크 · 버튼을 두지 않습니다(닫기 버튼만) — 누를 것이 있으면 [Popover](popover.md) 입니다.

### 글

제목은 무엇의 설명인지 적습니다 — "연차 사용 규정". 설명은 해요체 문장에 마침표를 찍습니다 — "입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요."

## 코드

레시피 `recipes/shadcn/components/ui/help-bubble.tsx` 를 씁니다(Radix Popover 위). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### ⓘ 를 눌러 여는 규정 안내

[그림: 연차 사용 규정](../../site/components/specs/help-bubble.tsx#ex-info)

```tsx
import { HelpBubble, HelpBubbleContent, HelpBubbleTrigger } from "@/components/ui/help-bubble"

<HelpBubble>
  <HelpBubbleTrigger asChild>
    <Button variant="ghost" ghostColor="neutralSubtle" layout="iconOnly" aria-label="연차 사용 규정 안내">
      <Info />
    </Button>
  </HelpBubbleTrigger>
  <HelpBubbleContent
    title="연차 사용 규정"
    description="입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요."
  />
</HelpBubble>
```

### 처음부터 열어 두는 안내 — 닫기 버튼

[그림: 거래 검색 안내](../../site/components/specs/help-bubble.tsx#ex-close)

```tsx
import { Search } from "lucide-react"
import { HelpBubble, HelpBubbleAnchor, HelpBubbleContent } from "@/components/ui/help-bubble"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

{/* 처음 쓰는 사람에게 한 번 — 닫으면 다시 열지 않습니다. Anchor 는 자리만 잡는다(누르면 원래 동작 — 홈 상단 바의 검색).
    closeOnInteractOutside={false} — 바깥 누르기 · 바깥으로 간 초점(Tab)에 닫히지 않는다. 닫기 버튼 · Esc · 말풍선에서 Tab 으로 나가기로 닫는다 */}
<HelpBubble defaultOpen={!seen} onOpenChange={(open) => !open && markSeen()}>
  <HelpBubbleAnchor asChild>
    <TopNavigationIconButton aria-label="검색" onClick={openSearch}><Search /></TopNavigationIconButton>
  </HelpBubbleAnchor>
  <HelpBubbleContent title="거래를 찾아보세요" description="가맹점 이름 · 메모 · 금액으로 찾을 수 있어요." showCloseButton closeOnInteractOutside={false} side="bottom" />
</HelpBubble>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 · `Enter` · `Space` | 엽니다 · 열려 있으면 닫습니다. 초점은 트리거에 남습니다 — 열릴 때 제목 · 설명을 한 번 알립니다(아래 Accessibility) |
| `Tab`(열린 동안) | 말풍선으로 들어갑니다 — 닫기 버튼이 있으면 그리로, 없으면 말풍선 자체에 초점(둘레 바깥 2 링). 다시 `Tab` 으로 나가면 닫힙니다 |
| `Esc` | 닫습니다. 초점이 말풍선 안에 있었으면 트리거로 |
| 바깥 누르기 | 닫습니다 — 닫기 버튼이 있는 말풍선은 닫기 버튼으로만 닫을 수도 있습니다(남겨 둘 안내). 그때는 초점이 바깥으로 나가도 닫지 않습니다 — `Tab` 만으로 처음 쓰는 사람용 안내가 사라지지 않게 합니다 |
| 닫기 버튼 | 닫고 초점은 트리거로 갑니다 |
| 처음부터 열린 안내 | 초점을 옮기지 않습니다 — 입력 칸의 초점 · 화면 키보드가 그대로입니다. 제목 · 설명은 열림 알림으로 한 번 읽힙니다 |
| 글자 크기 설정 | 제목 · 설명은 글자 크기 설정을 따라 커집니다. 말풍선 최대 폭은 그대로라 줄을 바꿔 높이가 늘어납니다. 화살표 · 닫기 버튼은 크기를 그대로 두고, 닫기는 제목 첫 줄 가운데에 섭니다. |
| 열린 동안 | 비모달 — 뒤 화면을 숨기지 않고 스크롤도 잠그지 않습니다. 스크롤하면 트리거를 따라갑니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 설명 `fg-neutral-inverted` 말풍선(`bg-neutral-inverted`) 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.4** Resize text | 제목 · 설명이 글자 크기 설정을 따라 커지고, 최대 폭 안에서 줄을 바꿔 높이가 늘어납니다 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 말풍선 면 페이지 위 16.41 · 다크 13.42 ✓. 닫기 버튼 초점 링은 말풍선 글자색이라 16.41 · 13.42 ✓ — 브랜드 링은 이 위에서 Desk 1.96 · HR 2.01 이라 쓰지 않습니다 |
| **WCAG 2.1.1** Keyboard | 트리거 · 닫기 버튼 모두 키보드로 닿습니다 |
| **WCAG 2.4.7** Focus Visible | 닫기 버튼은 안쪽 링(말풍선 글자색), 닫기 버튼이 없는 말풍선은 둘레 바깥 링(`stroke-focus-ring`) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 44 ✓ · ⓘ 트리거는 Button 규칙(보이는 40 · 누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼 44 ✓ |
| **WCAG 4.1.3** Status messages | 열릴 때 제목 · 설명을 초점을 옮기지 않고 알립니다(웹 `aria-live="polite"` 자리 — 트리거 옆에 늘 두고 열릴 때 글을 넣습니다 · 앱 `Semantics(liveRegion: true)`). 누르거나 처음부터 열려도 같습니다 — 스크린 리더 사용자는 손가락 · 초점이 트리거에 머문 채 내용을 듣습니다 |
| **ARIA** | 트리거 `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`, 말풍선 `role="dialog"`(aria-modal 없음) + 제목 `aria-labelledby` · 설명 `aria-describedby`. 닫기 버튼 이름 "닫기". 화살표는 장식 |

## Do / Don't

### ✅ Do

- 폰에서도 읽어야 하는 설명은 ⓘ 를 눌러 여는 말풍선으로.
- 제목 한 줄 · 설명 2 ~ 3줄.
- 처음부터 열어 두는 안내에만 닫기 버튼.

### ❌ Don't

- 말풍선 안에 링크 · 버튼(닫기 버튼 말고) — 누를 것이 있으면 Popover.
- 일을 하려면 꼭 읽어야 하는 안내를 말풍선 뒤에 숨기기.
- 한 화면에 처음부터 열린 말풍선 여럿.

## Specification

`help-bubble.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Help Bubble · Tooltip 을 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적었습니다.

[그림: Specification — help-bubble.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#help-bubble)
