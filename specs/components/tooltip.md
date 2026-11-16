# Tooltip

> 마우스를 올리거나 키보드 초점이 오면 트리거 옆에 뜨는 짧은 설명입니다. 아이콘 버튼 · 줄인 글이 무엇인지 보여 주는 **보조**로 씁니다.

손가락으로 누르면 열리지 않으므로, 이름 · 막힌 이유처럼 꼭 알아야 하는 것은 툴팁에만 두지 않습니다. 폰에서도 읽어야 하는 설명은 같은 모양의 [Help Bubble](help-bubble.md)(눌러서 엽니다)을 씁니다. 앱에도 둡니다 — 하드웨어 키보드 초점 · 마우스에서만 열리고, 손가락 누름 · 길게 누르기로는 열지 않습니다.

툴팁은 [Help Bubble](help-bubble.md) 과 같은 말풍선(짙은 바탕 · 13 · 모서리 12 · 화살표 · 최대 280)을 마우스 · 키보드로 여는 것입니다.

수치 원본은 [`help-bubble.yaml`](help-bubble.yaml)의 `opens: hover` 입니다 — 모양은 Help Bubble 과 한 벌입니다. 툴팁만의 수치 파일(`tooltip.yaml` · 내보낸 `tooltip.json`)은 두지 않습니다 — 같은 말풍선을 두 곳에 정의하지 않기 위해서입니다. 웹 · 앱의 검사도 툴팁을 `help-bubble` 의 `opens: hover` 로 잽니다.

[그림: 아이콘 버튼 · 접힌 사이드바의 툴팁 — 라이트 · 다크](../../site/components/specs/tooltip.tsx#hero)

### 직접 골라 보기

글 길이 · 위치를 바꾸면 툴팁과 코드가 함께 바뀝니다. 마우스를 올리거나 `Tab` 으로 초점을 옮겨 열어 볼 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/tooltip.tsx#playground)

## Anatomy

[그림: 툴팁은 말풍선 · 화살표 · 글 하나](../../site/components/specs/tooltip.tsx#anatomy)

| ⓐ Container | 말풍선 — [Help Bubble](help-bubble.md) 과 같습니다. 누를 것이 없습니다. |
| ⓑ Arrow | 화살표 — 늘 트리거 가운데를 가리킵니다. |
| ⓒ Title | 글 — 한 줄로 짧게 씁니다. |

## Properties

### 말풍선

모양 · 여백 · 위치는 [Help Bubble](help-bubble.md) 과 같습니다 — 위아래 10 · 좌우 12, 모서리 12, 글 13 / 18, 최대 280, 화살표 끝과 트리거 사이 4. 툴팁은 글 하나만 둡니다(굵게 — Help Bubble 의 제목 자리).

[표: 말풍선](help-bubble.yaml#base.enabled)

### 여는 방식

마우스를 올리면 200ms 뒤에 열고, 트리거와 말풍선을 모두 벗어나면 100ms 뒤에 닫습니다 — 말풍선 위로 포인터를 옮겨도 닫히지 않습니다. 키보드 초점이 오면 바로 엽니다. 하나가 열린 뒤 옆 트리거로 옮기면 기다리지 않고 모션 없이 바로 바꿔 엽니다. 손가락으로 누르면 열지 않습니다.

[그림: 마우스 200ms · 키보드 바로 · 이어서 옮기면 바로](../../site/components/specs/tooltip.tsx#timing)

[표: 여는 방식](help-bubble.yaml#opens)

[표: 모션](help-bubble.yaml#motion)

## Guidelines

### 툴팁은 보조입니다

툴팁은 마우스 · 키보드에서만 열립니다. 그래서 툴팁에만 있는 정보는 손가락으로 쓰는 사람에게 닿지 않습니다.

- **이름은 `aria-label`** — 아이콘 버튼의 이름은 늘 `aria-label` 에 둡니다. 툴팁은 그 이름을 마우스 · 키보드 사용자에게 **보여 주는** 것이지 이름을 대신하지 않습니다.
- **막힌 이유는 가까운 글로** — 막힌 버튼은 초점을 받지 못해 키보드로 툴팁을 열 수 없습니다. 왜 안 되는지는 버튼 가까이 글로 보입니다("복사할 지난달 예산이 없어요.").
- **폰에서도 읽어야 하면 [Help Bubble](help-bubble.md)** — ⓘ 를 눌러 여는 말풍선을 씁니다.
- **네이티브 `title` 은 쓰지 않습니다** — 터치 · 키보드에서 뜨지 않고 모양도 브라우저마다 다르기 때문입니다. 이름은 `aria-label`, 설명은 툴팁 · 보이는 글에 둡니다.

[그림: 이름은 aria-label · 막힌 이유는 가까운 글 · 툴팁에만 두지 않습니다](../../site/components/specs/tooltip.tsx#assist-guide)

### 어디에 쓰나

| 자리 | 툴팁 |
|---|---|
| 아이콘만 있는 버튼(툴바 · 머리) | 이름을 보여 준다 — `aria-label` 과 같은 글 |
| 접힌 사이드바의 아이콘 | 메뉴 이름을 보여 준다 |
| 줄여 보인 글(말줄임) | 다 보여 준다 |
| 글자가 이미 보이는 버튼 | 두지 않는다 — 같은 말을 두 번 |
| 막힌 버튼의 이유 | 두지 않는다 — 가까운 글로 |
| 링크 · 버튼이 든 설명 | 두지 않는다 — [Popover](popover.md) |

### 짧게

한 줄이 원칙입니다 — "검색" · "알림" · "필터 초기화". 최대 280 을 넘기면 줄을 바꾸지만, 두 줄이 넘는 설명은 [Help Bubble](help-bubble.md) 로 옮깁니다. 이름이면 명사 · 동사구 그대로, 문장이면 해요체에 마침표를 찍습니다.

## 코드

레시피 `recipes/shadcn/components/ui/tooltip.tsx` 를 씁니다(Radix Tooltip 위 — 모양은 Help Bubble 과 같은 클래스). 화면에 `TooltipProvider` 를 한 번 두면 이어서 여는 툴팁이 기다리지 않습니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 아이콘 버튼의 이름

[그림: 아이콘 버튼 툴팁](../../site/components/specs/tooltip.tsx#ex-icon)

```tsx
import { Settings } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

{/* Desk 웹 데스크톱 머리의 아이콘 버튼(알림 · 설정) */}
<Tooltip>
  <TooltipTrigger asChild>
    {/* 이름은 aria-label — 툴팁은 그 이름을 마우스 · 키보드 사용자에게 보여 준다 */}
    <TopNavigationIconButton aria-label="설정" onClick={openSettings}><Settings /></TopNavigationIconButton>
  </TooltipTrigger>
  <TooltipContent>설정</TooltipContent>
</Tooltip>
```

### 막힌 버튼 — 이유는 툴팁이 아니라 가까운 글

[그림: 막힌 버튼과 이유](../../site/components/specs/tooltip.tsx#ex-disabled)

```tsx
<div className="flex flex-col gap-1.5">
  <Button variant="neutralWeak" disabled={!hasLastMonth} aria-describedby="copy-reason">
    지난달 예산 복사
  </Button>
  {!hasLastMonth && (
    <p id="copy-reason" className="text-t3 text-fg-neutral-subtle">복사할 지난달 예산이 없어요.</p>
  )}
</div>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 마우스를 올림 | 200ms 뒤 엽니다 |
| 마우스가 트리거 · 말풍선을 벗어남 | 100ms 뒤 닫습니다 — 말풍선 위로 옮기는 동안은 열어 둡니다 |
| 키보드 초점(`Tab`) | 바로 엽니다. 초점이 떠나면 닫습니다 — 그동안 포인터가 지나가도 닫지 않습니다 |
| `Esc` | 닫습니다. 초점은 트리거에 그대로 있습니다 |
| 트리거 누르기 | 툴팁을 열지도 닫지도 않습니다 — 누름은 트리거의 동작입니다. 마우스를 올려 기다리던 열기는 거둡니다 |
| 손가락으로 누르기 | 열지 않습니다 |
| 이어서 옆 트리거로 | 하나가 열려 있거나 닫힌 지 300ms 안에 다른 트리거로 옮기면 기다리지 않고 모션 없이 바로 엽니다(`help-bubble.yaml` 의 `skipDelay`) |
| 스크롤 | 트리거를 따라갑니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 아이콘 버튼의 이름은 `aria-label` 입니다 — 툴팁이 없어도 이름이 있습니다 |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 글 `fg-neutral-inverted` 말풍선(`bg-neutral-inverted`) 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 말풍선 면 페이지 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.13** Content on Hover or Focus | 닫을 수 있고(`Esc`), 말풍선 위로 옮겨도 남고, 벗어나기 전까지 사라지지 않습니다 ✓ |
| **WCAG 2.1.1** Keyboard | 키보드 초점으로 바로 열립니다 ✓ — 막힌 버튼은 초점을 받지 못하므로 이유는 가까운 글로 보입니다 |
| **ARIA** | 말풍선 `role="tooltip"`, 트리거에 `aria-describedby`. 트리거의 이름은 툴팁이 아니라 `aria-label` · 보이는 글입니다 |

## Do / Don't

### ✅ Do

- 아이콘 버튼에는 `aria-label` 과 같은 글의 툴팁을 둡니다.
- 한 줄로 짧게 씁니다.
- 막힌 이유는 버튼 가까이 글로 보입니다.
- 화면에 `TooltipProvider` 를 한 번 둡니다.

### ❌ Don't

- 이름 · 막힌 이유 · 꼭 알아야 하는 정보를 툴팁에만 두지 않습니다.
- 네이티브 `title` 을 쓰지 않습니다.
- 툴팁 안에 링크 · 버튼을 두지 않습니다.
- 글자가 이미 보이는 버튼에 같은 말의 툴팁을 두지 않습니다.

## Specification

툴팁은 [Help Bubble](help-bubble.md) 과 같은 `help-bubble.yaml` 을 씁니다 — `opens: hover` 의 규칙이 툴팁입니다.

[그림: Specification — help-bubble.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#help-bubble)
