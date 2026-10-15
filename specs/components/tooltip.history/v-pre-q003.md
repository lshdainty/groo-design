# Tooltip

> 마우스를 올리거나 키보드 초점이 오면 트리거 옆에 뜨는 짧은 설명 — 아이콘 버튼 · 줄인 글이 무엇인지 보여 주는 **보조**다. 손가락으로 누르면 열리지 않으므로 이름 · 막힌 이유처럼 꼭 알아야 하는 것은 툴팁에만 두지 않는다. 폰에서도 읽어야 하는 설명은 같은 모양의 [Help Bubble](help-bubble.md)(눌러서)이다.

구조는 당근 [SEED Help Bubble Tooltip](https://seed-design.io/react/components/help-bubble-tooltip)(Apache-2.0)을 따른다 — [Help Bubble](help-bubble.md) 과 같은 말풍선(짙은 바탕 · 13 · 모서리 12 · 화살표 · 최대 280)을 마우스 · 키보드로 여는 것이다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`help-bubble.yaml`](help-bubble.yaml)의 `opens: hover` 다 — 모양은 Help Bubble 과 한 벌이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 아이콘 버튼 · 접힌 사이드바의 툴팁 — 라이트 · 다크](../../site/components/specs/tooltip.tsx#hero)

### 직접 골라 보기

글 길이 · 위치를 고르면 스펙대로 그린 툴팁과 그 코드가 바뀐다. 마우스를 올리거나 `Tab` 으로 초점을 옮겨 열 수 있다.

[그림: 플레이그라운드](../../site/components/specs/tooltip.tsx#playground)

## Anatomy

[그림: 툴팁은 말풍선 · 화살표 · 글 하나](../../site/components/specs/tooltip.tsx#anatomy)

| ⓐ Container | 말풍선 — [Help Bubble](help-bubble.md) 과 같다. 누를 것이 없다. |
| ⓑ Arrow | 화살표 — 늘 트리거 가운데를 가리킨다. |
| ⓒ Title | 글 — 한 줄로 짧게. |

## Properties

### 말풍선

모양 · 여백 · 위치는 [Help Bubble](help-bubble.md) 과 같다 — 위아래 10 · 좌우 12, 모서리 12, 글 13 / 18, 최대 280, 화살표 끝과 트리거 사이 4. 툴팁은 글 하나만 둔다(굵게 — Help Bubble 의 제목 자리).

[표: 말풍선](help-bubble.yaml#base.enabled)

### 여는 방식

마우스를 올리면 200ms 뒤에 열고, 트리거와 말풍선을 모두 벗어나면 100ms 뒤에 닫는다 — 말풍선 위로 포인터를 옮겨도 닫히지 않는다. 키보드 초점이 오면 바로 연다. 하나가 열린 뒤 옆 트리거로 옮기면 기다리지 않고 모션 없이 바로 바꿔 연다. 손가락으로 누르면 열지 않는다.

[그림: 마우스 200ms · 키보드 바로 · 이어서 옮기면 바로](../../site/components/specs/tooltip.tsx#timing)

[표: 여는 방식](help-bubble.yaml#opens)

[표: 모션](help-bubble.yaml#motion)

## Guidelines

### 툴팁은 보조다

툴팁은 마우스 · 키보드에서만 열린다. 그래서 툴팁에만 있는 정보는 손가락으로 쓰는 사람에게 없다.

- **이름은 `aria-label`** — 아이콘 버튼의 이름은 늘 `aria-label` 에 둔다. 툴팁은 그 이름을 마우스 · 키보드 사용자에게 **보여 주는** 것이지 이름을 대신하지 않는다.
- **막힌 이유는 가까운 글로** — 막힌 버튼은 초점을 받지 못해 키보드로 툴팁을 열 수 없다. 왜 안 되는지는 버튼 가까이 글로 보인다("복사할 지난달 예산이 없어요.").
- **폰에서도 읽어야 하면 [Help Bubble](help-bubble.md)** — ⓘ 를 눌러 여는 말풍선.
- **네이티브 `title` 은 쓰지 않는다** — 터치 · 키보드에서 뜨지 않고 모양도 브라우저마다 다르다. 이름은 `aria-label`, 설명은 툴팁 · 보이는 글.

[그림: 이름은 aria-label · 막힌 이유는 가까운 글 · 툴팁에만 두지 않는다](../../site/components/specs/tooltip.tsx#assist-guide)

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

한 줄이 원칙이다 — "검색" · "금액 가리기" · "필터 초기화". 최대 280 을 넘기면 줄을 바꾸지만, 두 줄이 넘는 설명은 [Help Bubble](help-bubble.md) 로 옮긴다. 이름이면 명사 · 동사구 그대로, 문장이면 해요체에 마침표.

## 코드

레시피 `recipes/shadcn/components/ui/tooltip.tsx` 를 쓴다(Radix Tooltip 위 — 모양은 Help Bubble 과 같은 클래스). 화면에 `TooltipProvider` 를 한 번 두면 이어서 여는 툴팁이 기다리지 않는다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 아이콘 버튼의 이름

[그림: 아이콘 버튼 툴팁](../../site/components/specs/tooltip.tsx#ex-icon)

```tsx
import { Eye, EyeOff } from "lucide-react"
import { TopNavigationIconButton } from "@/components/ui/top-navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

{/* Desk 웹 데스크톱 머리의 아이콘 버튼(금액 가리기 · 알림 · 설정) */}
<Tooltip>
  <TooltipTrigger asChild>
    {/* 이름은 aria-label — 툴팁은 그 이름을 마우스 · 키보드 사용자에게 보여 준다.
        켜고 끄는 단추는 이름이 고정이라 툴팁도 그대로다 — 켬은 aria-pressed 가 알린다 */}
    <TopNavigationIconButton aria-label="금액 가리기" aria-pressed={hidden} onClick={toggleHidden}>{hidden ? <EyeOff /> : <Eye />}</TopNavigationIconButton>
  </TooltipTrigger>
  <TooltipContent>금액 가리기</TooltipContent>
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
| 마우스를 올림 | 200ms 뒤 연다 |
| 마우스가 트리거 · 말풍선을 벗어남 | 100ms 뒤 닫는다 — 말풍선 위로 옮기는 동안은 열어 둔다 |
| 키보드 초점(`Tab`) | 바로 연다. 초점이 떠나면 닫는다 — 그동안 포인터가 지나가도 닫지 않는다 |
| `Esc` | 닫는다. 초점은 트리거에 그대로 |
| 트리거 누르기 | 툴팁을 열지도 닫지도 않는다 — 누름은 트리거의 동작이다. 마우스를 올려 기다리던 열기는 거둔다 |
| 손가락으로 누르기 | 열지 않는다 |
| 이어서 옆 트리거로 | 하나가 열려 있거나 닫힌 지 300ms 안에 다른 트리거로 옮기면 기다리지 않고 모션 없이 바로(`help-bubble.yaml` 의 `skipDelay`) |
| 스크롤 | 트리거를 따라간다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.1.1** Non-text Content | 아이콘 버튼의 이름은 `aria-label` — 툴팁이 없어도 이름이 있다 |
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 글 `fg-neutral-inverted` 말풍선(`bg-neutral-inverted`) 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 말풍선 면 페이지 위 16.41 · 다크 13.42 ✓ |
| **WCAG 1.4.13** Content on Hover or Focus | 닫을 수 있다(`Esc`) · 말풍선 위로 옮겨도 남는다 · 벗어나기 전까지 사라지지 않는다 ✓ |
| **WCAG 2.1.1** Keyboard | 키보드 초점으로 바로 열린다 ✓ — 막힌 버튼은 초점을 받지 못하므로 이유는 가까운 글로 |
| **ARIA** | 말풍선 `role="tooltip"`, 트리거에 `aria-describedby`. 트리거의 이름은 툴팁이 아니라 `aria-label` · 보이는 글 |

## Do / Don't

### ✅ Do

- 아이콘 버튼에는 `aria-label` 과 같은 글의 툴팁.
- 한 줄로 짧게.
- 막힌 이유는 버튼 가까이 글로.
- 화면에 `TooltipProvider` 한 번.

### ❌ Don't

- 이름 · 막힌 이유 · 꼭 알아야 하는 정보를 툴팁에만.
- 네이티브 `title`.
- 툴팁 안에 링크 · 버튼.
- 글자가 이미 보이는 버튼에 같은 말의 툴팁.

## Specification

툴팁은 [Help Bubble](help-bubble.md) 과 같은 `help-bubble.yaml` 을 쓴다 — `opens: hover` 의 규칙이 툴팁이다.

[그림: Specification — help-bubble.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#help-bubble)

## SEED 와 다른 점

- **말풍선 위로 포인터를 옮겨도 닫히지 않는다**(WCAG 1.4.13) — SEED 는 기본으로 닫히고 `keepOpenOnContentHover` 를 켜야 남는다.
- **바탕은 porest `bg-neutral-inverted`** — Help Bubble 과 같다.
- **z-index 는 specs/z-index.md 의 L4**(`z-tooltip` 210) — SEED 는 포털 없이 99.

## Migration notes

### 2026-10-02 — SEED Help Bubble Tooltip 으로 바꾼다

사용자가 [비교 페이지](https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA)에서 정했다 — 툴팁 모양은 SEED Help Bubble(짙은 바탕 · 13 · 모서리 12 · 화살표 · 최대 280, 옛 반전 13 · 모서리 2 · 화살표 없음 · 그림자에서), 쓰임은 SEED(마우스 200 / 100ms · 키보드 바로 · 터치에 기대지 않음 · 이름은 aria-label · 막힌 이유는 가까운 글 · `title` 걷음). 옛 스펙은 `tooltip.history/v-pre-seed-tooltip.*` — 수치 파일(`tooltip.yaml`)은 `help-bubble.yaml` 로 합쳤다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 툴팁은 접힌 사이드바 하나(지연 0ms, 태블릿 터치로 탭하면 안 뜬다). 네이티브 `title` 29곳 — 아이콘 버튼의 유일한 이름 7곳, 막힌 버튼의 이유 2곳(예산 "복사할 지난달 예산이 없어요"), 키보드로 못 닿는 설명 4곳. 데스크톱 줄의 아이콘 6개는 이름도 툴팁도 없다.
- **Desk 앱** — PTooltip 17(반전 13 · 모서리 2) · Material 기본 툴팁 9(회색 14 · 모서리 4), 길게 누르면 뜬다. 아이콘 버튼 37 중 20 이 이름이 없다.
- **HR 웹** — 툴팁은 브랜드 파랑 12 · 모서리 6 · 화살표(바탕 대비 4.95 · 4.73), 지연 늘 0(Provider 가 겹친다). 네이티브 `title` 11곳.
- 차트 · 데이터 툴팁(웹 7 · 앱 8 · HR 2)은 이 스펙이 아니다 — porest 차트 부품으로 따로 정하고 말풍선 모양만 맞춘다.
