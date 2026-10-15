# Help Bubble

> 트리거를 누르면 옆에 뜨는 짙은 도움말 말풍선 — 화면에 늘 두기에는 길고, 몰라도 일은 할 수 있는 설명(규정 · 계산 방법 · 기능 안내). 마우스를 올리면 뜨는 짧은 설명은 같은 모양의 [Tooltip](tooltip.md) 이고, 화면 안에 늘 보여야 하는 안내는 Callout(그 차례에), 버튼 · 입력이 있는 내용은 [Popover](popover.md) 다.

구조는 당근 [SEED Help Bubble](https://seed-design.io/react/components/help-bubble)(Apache-2.0)를 따른다 — 말풍선 · 화살표 · 제목 · 설명 · 닫기 버튼. [Tooltip](tooltip.md) 도 같은 말풍선을 쓴다(SEED 도 두 컴포넌트가 스펙 하나를 쓴다) — 여는 방식만 다르다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`help-bubble.yaml`](help-bubble.yaml)이다(Tooltip 과 같은 파일). 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 연차 사용 규정 · 금액 가리기 안내 — 라이트 · 다크](../../site/components/specs/help-bubble.tsx#hero)

### 직접 골라 보기

설명 · 닫기 버튼 · 위치를 고르면 스펙대로 그린 말풍선과 그 코드가 바뀐다. 실제로 눌러 열고 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/help-bubble.tsx#playground)

## Anatomy

[그림: 말풍선은 화살표 · 제목 · 설명 · 닫기 버튼으로](../../site/components/specs/help-bubble.tsx#anatomy)

| ⓐ Container | 말풍선 — 짙은 바탕(다크에서는 밝은 바탕), 최대 280. |
| ⓑ Arrow | 화살표 — 늘 트리거 가운데를 가리킨다. 화살표 끝과 트리거 사이 4. |
| ⓒ Title | 제목 — 13 · 700. 한 줄로 끝나면 이것만. |
| ⓓ Description | 설명 — 13 · 400. 제목을 풀어 줄 때만. |
| ⓔ Close Button | 닫기 — 오른쪽 위 모서리. 닫기 전까지 남겨 둘 안내에만. |

[표: 부위](help-bubble.yaml#slots)

## Properties

### 말풍선

위아래 10 · 좌우 12, 모서리 12, 그림자 없음. 제목 13 / 18 · 700, 설명 13 / 18 · 400, 제목 ↔ 설명 2 — 한 줄이면 38, 설명이 있으면 58. 폭은 내용만큼이고 최대 280(여백 포함)이다 — 한 줄에 20자 안팎, 2 ~ 3줄이면 넘지 않는다.

[그림: 말풍선의 여백 · 화살표 · 간격](../../site/components/specs/help-bubble.tsx#layout)

[표: 공통](help-bubble.yaml#base.enabled)

### 위치

기본은 트리거 위다. 자리가 모자라면 반대편으로 뒤집고 옆으로 민다 — 화면 가장자리와 16 을 남긴다. 화살표는 늘 트리거 가운데를 가리키고 말풍선 모서리와 14 를 남긴다(트리거가 작아 모자라면 말풍선을 민다).

[그림: 위 · 아래 · 옆 — 화살표는 늘 트리거 가운데](../../site/components/specs/help-bubble.tsx#placement)

### 닫기 버튼

닫기 전까지 남겨 둘 안내(처음 쓰는 기능의 설명처럼 처음부터 열어 두는 말풍선)에만 둔다. 상자 38 · 아이콘 14 이고 누르는 영역은 44 다.

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
| 일을 하려면 꼭 읽어야 하는 안내 | 화면 안 글 · Callout(그 차례에) |
| 버튼 · 입력이 있는 내용 | [Popover](popover.md) |
| 길거나 확인을 받아야 하는 설명 | [Bottom Sheet](bottom-sheet.md) · [Dialog](dialog.md) |

[그림: 도움말의 자리 — 툴팁 · 말풍선 · 화면 안 글 · 팝오버](../../site/components/specs/help-bubble.tsx#role-guide)

### 터치에서도 닿는 도움말

[Tooltip](tooltip.md) 은 손가락으로 누르면 열리지 않는다. 폰에서도 읽어야 하는 설명은 이 말풍선에 둔다 — 트리거는 ⓘ 아이콘 버튼(이름 "{무엇} 안내")이고, 누르면 열고 다시 누르거나 바깥을 누르면 닫는다.

[그림: ⓘ 를 눌러 여는 말풍선 — 폰 · 데스크톱](../../site/components/specs/help-bubble.tsx#touch-guide)

### 짧게

제목 한 줄, 설명 2 ~ 3줄이면 충분하다. 그보다 길면 화면 안 글이나 시트로 옮긴다. 말풍선 안에 링크 · 버튼을 두지 않는다(닫기 버튼만) — 누를 것이 있으면 [Popover](popover.md) 다.

### 글

제목은 무엇의 설명인지 — "연차 사용 규정". 설명은 해요체 문장에 마침표 — "입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요."

## 코드

레시피 `recipes/shadcn/components/ui/help-bubble.tsx` 를 쓴다(Radix Popover 위). 아래 미리보기는 스펙 값으로 그린 모습이다.

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

[그림: 금액 가리기 안내](../../site/components/specs/help-bubble.tsx#ex-close)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { HelpBubble, HelpBubbleAnchor, HelpBubbleContent } from "@/components/ui/help-bubble"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"

{/* 처음 쓰는 사람에게 한 번 — 닫으면 다시 열지 않는다. Anchor 는 자리만 잡는다(누르면 원래 동작 — 상단 바의 금액 가리기).
    closeOnInteractOutside={false} — 바깥 누르기 · 바깥으로 간 초점(Tab)에 닫히지 않는다. 닫기 버튼 · Esc · 말풍선에서 Tab 으로 나가기로 닫는다 */}
<HelpBubble defaultOpen={!seen} onOpenChange={(open) => !open && markSeen()}>
  <HelpBubbleAnchor asChild>
    <TopNavigationIconButton aria-label="금액 가리기" aria-pressed={hidden} onClick={toggleHidden}>{hidden ? <EyeOff /> : <Eye />}</TopNavigationIconButton>
  </HelpBubbleAnchor>
  <HelpBubbleContent title="금액을 가릴 수 있어요" description="누르면 화면의 금액이 모두 가려져요." showCloseButton closeOnInteractOutside={false} side="bottom" />
</HelpBubble>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 · `Enter` · `Space` | 연다 · 열려 있으면 닫는다. 초점은 트리거에 남는다 |
| `Tab`(열린 동안) | 말풍선으로 들어간다 — 닫기 버튼이 있으면 그리로, 없으면 말풍선 자체에 초점(둘레 바깥 2 링). 다시 `Tab` 으로 나가면 닫힌다 |
| `Esc` | 닫는다. 초점이 말풍선 안에 있었으면 트리거로 |
| 바깥 누르기 | 닫는다 — 닫기 버튼이 있는 말풍선은 닫기 버튼으로만 닫을 수도 있다(남겨 둘 안내). 그때는 초점이 바깥으로 나가도 닫지 않는다 — `Tab` 만으로 처음 쓰는 사람용 안내가 사라지지 않게 |
| 닫기 버튼 | 닫고 초점은 트리거로 |
| 열린 동안 | 비모달 — 뒤 화면을 숨기지 않고 스크롤도 잠그지 않는다. 스크롤하면 트리거를 따라간다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 설명 `fg-neutral-inverted` 말풍선(`bg-neutral-inverted`) 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 말풍선 면 페이지 위 16.41 · 다크 13.42 ✓. 닫기 버튼 초점 링은 말풍선 글자색이라 16.41 · 13.42 ✓ — 브랜드 링은 이 위에서 Desk 1.96 · HR 3.24 라 쓰지 않는다 |
| **WCAG 2.1.1** Keyboard | 트리거 · 닫기 버튼 모두 키보드로 닿는다 |
| **WCAG 2.4.7** Focus Visible | 닫기 버튼은 안쪽 링(말풍선 글자색), 닫기 버튼이 없는 말풍선은 둘레 바깥 링(`stroke-focus-ring`) ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 44 ✓ · ⓘ 트리거는 Button 규칙(보이는 40 · 누르는 영역 44) ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼 44 ✓ |
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

`help-bubble.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Help Bubble · Tooltip 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — help-bubble.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#help-bubble)

## SEED 와 다른 점

- **바탕은 porest `bg-neutral-inverted`**(SEED neutral-solid 의 역할 짝) — 다크에서는 밝은 말풍선에 짙은 글자(SEED 와 같은 방향).
- **닫기 버튼의 누르는 영역은 44** — SEED 38(기초의 "누르는 영역 44").
- **닫기 버튼의 초점 링은 말풍선 글자색** — porest 브랜드 링은 짙은 말풍선 위에서 3:1 에 못 미친다(SEED 링은 파랑이라 닿는다).
- **z-index 는 specs/z-index.md 의 L4**(`z-tooltip` 210) — 팝오버 · 메뉴 안에서 열어도 그 위에 뜬다. SEED 는 포털 없이 99 로 그려 둘레 상자가 자를 수 있다.

## Migration notes

### 2026-10-08 — "처음부터 열어 두는 안내" 예

코드 예에 `closeOnInteractOutside={false}` 가 빠져 있었다 — 예대로 쓰면 바깥을 누르거나 Tab 으로 다른 칸에 가는 순간 처음 쓰는 사람용 안내가 사라졌다(Behavior 표와 다르다, desk-front #428). 예에 더했다. 레시피 · 사이트의 살아 있는 그림은 이미 그렇게 동작한다. SEED 의 같은 예(HelpBubbleAnchor + defaultOpen + showCloseButton)도 `closeOnInteractOutside={false}` 를 준다. 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 2.

### 2026-10-02 — SEED Help Bubble 로 새로 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA)에서 정했다 — 툴팁과 도움말 말풍선은 SEED 모양 하나(짙은 바탕 · 13 · 모서리 12 · 화살표 · 최대 280), 툴팁은 마우스 · 키보드의 보조이고 터치에서 도움말이 필요하면 눌러서 여는 Help Bubble. 전에는 눌러서 여는 도움말이 따로 없었다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 눌러서 여는 도움말 0(ⓘ 는 늘 보이는 안내 상자 4곳뿐). 키보드로 못 닿는 글자 · 배지에 붙은 설명이 네이티브 `title` 에만 4곳("기본 캘린더는 숨길 수 없습니다" · "자동 기록" · "하루 전 알림" · "단종 포함") — 터치 · 키보드에서 안 보인다.
- **Desk 앱** — 눌러서 여는 도움말 0.
- **HR 웹** — 규정 안내 Popover 12곳(→ 화면마다 Help Bubble · Popover 를 고른다), 쓰는 곳이 없는 ⓘ 툴팁 부품 2.
