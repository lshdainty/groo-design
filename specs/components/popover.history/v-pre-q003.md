# Popover

> 트리거에 붙어 떠 있는 표면. 1280 이상에서 부가 정보 · 짧은 동작 · 고르는 패널(Input Button 의 달력 · 시각 · 목록)을 띄운다 — 같은 내용을 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 띄운다. 비모달이라 뒤 화면을 막지 않는다. 폼 · 상세는 [Dialog](dialog.md), 줄의 동작 목록은 Menu(그 차례에), 짧은 도움말 말풍선은 Help Bubble(그 차례에)이다.

구조는 당근 [SEED Popover](https://seed-design.io/react/components/popover)(Apache-2.0 — 디자인 문서는 없고 React 문서 · rootage 만 있다)를 따른다 — 표면 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥, 머리 · 본문 · 바닥 여백은 Dialog 와 같다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`popover.yaml`](popover.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 연차 사용 규정 · 날짜 고르기 — 라이트 · 다크](../../site/components/specs/popover.tsx#hero)

### 직접 골라 보기

머리 · 바닥 · 본문 길이 · 트리거 자리(화면 위 · 아래 · 가장자리)를 고르면 스펙대로 그린 팝오버와 그 코드가 바뀐다. 실제로 열고 Tab 으로 빠져나가 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/popover.tsx#playground)

## Anatomy

[그림: 팝오버는 표면 · 머리 · 본문 · 바닥으로 — 트리거와 8 떨어진다](../../site/components/specs/popover.tsx#anatomy)

| ⓐ Container | 표면 — 트리거 아래(모자라면 위), 폭 320 ~ 480, 그림자 s3. |
| ⓑ Header | 머리 — 제목 · 설명 · 닫기. 없어도 된다(고르는 패널). |
| ⓒ Body | 본문 — 넘치면 이 안에서 스크롤. 넘칠 수 있는 본문은 끝을 흐린다([Scroll Fog](scroll-fog.md) — Dialog 와 같다). |
| ⓓ Footer | 바닥 — 버튼, 오른쪽 정렬. 없어도 된다. |

[표: 부위](popover.yaml#slots)

## Properties

### 크기 · 자리

폭은 320 ~ 480 이고 화면 가장자리에서 16 을 남긴다. 높이는 600 과 남은 공간 중 작은 쪽까지 — 넘치면 본문이 스크롤한다. 트리거와 8 떨어져 아래에 뜨고, 아래 공간이 모자라면 위로, 옆으로 넘치면 화면 안으로 민다. 모서리 20 · 그림자 s3 — 시트 · 대화상자와 달리 딤이 없어 그림자로 뜬다.

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

팝오버는 그 트리거에 대한 것만 담는다 — 칸 옆 안내 · 그 칸에 넣을 값 고르기(달력 · 시각 · 아이콘 격자 · 목록) · 짧은 동작. 같은 내용이 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 뜬다(Input Button 이 폭으로 고른다). 폼 · 상세는 [Dialog](dialog.md), 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 줄의 동작 목록은 Menu(그 차례에)다.

[그림: 쓰임 — 칸 옆 안내 · 고르는 패널 · 팝오버에 폼](../../site/components/specs/popover.tsx#role-guide)

### 비모달 — 뒤 화면을 막지 않는다

열면 초점이 팝오버 안으로 가지만 가두지 않는다 — 마지막 칸에서 Tab 을 누르면 페이지로 나가고 팝오버는 닫힌다. 딤 · 스크롤 잠금이 없고 뒤 화면을 숨기지 않는다. `Esc` 로 닫으면 초점이 트리거로 돌아가고, 바깥을 눌러 닫으면 누른 자리로 간다(그 자리가 초점을 받지 못하면 트리거로).

[그림: 닫기 — 바깥 · Esc · Tab 으로 빠져나가기](../../site/components/specs/popover.tsx#dismiss-guide)

### 머리는 있을 때 제목 + 닫기

안내 팝오버는 머리에 제목과 닫기 버튼을 둔다. 고르는 패널(달력 · 목록)은 머리 없이 본문만 — 무엇을 고르는지는 트리거가 말한다. 바닥 버튼은 고른 것을 넣을 때("완료")만.

### 글

제목은 무엇에 대한 안내인지("연차 사용 규정"), 본문은 해요체 짧은 문장. 긴 안내 · 단계가 있는 설명은 팝오버가 아니라 페이지 · 도움말이다.

## 코드

레시피 `recipes/shadcn/components/ui/popover.tsx` 를 쓴다(Radix Popover 위). Input Button 의 고르는 패널은 `useInputButtonSurface()` 가 1280 이상일 때만 팝오버로 연다([Input Button](input-button.md)). 아래 미리보기는 스펙 값으로 그린 모습이다.

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

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 | 열고 닫는다. 150ms 로 트리거 쪽에서 커지며 나타난다. |
| 열린 뒤 | 초점이 팝오버 안으로(머리 닫기 버튼이 아니라 내용) 간다. |
| Tab | 팝오버 안을 지나 마지막에서 페이지로 나가면 닫힌다(초점은 나간 자리에 남는다). |
| `Esc` | 닫고, 초점은 트리거로 돌아간다. |
| 바깥 누르기 | 닫는다 — 초점은 누른 자리로 간다(누른 곳이 초점을 받지 못하면 트리거로). |
| 대화상자 · 시트 안에서 | 그 위에 뜬다(z-index L3) — 대화상자가 닫히면 함께 닫힌다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 표면 경계는 그림자 s3(딤 없음) — 표면을 알리는 유일한 표시가 아니다(머리 · 내용이 알린다). 키보드 포커스 링 Desk 8.38 · 5.28 · HR 5.06 · 5.39 ✓ |
| **WCAG 1.4.13** Content on Hover or Focus | 누를 때 열리고(호버로 열지 않는다) 바깥 · `Esc` 로 닫힌다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 52 ✓ |
| **ARIA** | `role="dialog"`(`aria-modal` 없음), 제목 `aria-labelledby`(있을 때), 트리거 `aria-haspopup="dialog"` · `aria-expanded` · `aria-controls`. 머리 없는 고르는 패널은 `aria-label` 로 이름을 단다 |

## Do / Don't

### ✅ Do

- 트리거에 대한 짧은 안내 · 값 고르기를 1280 이상에서 팝오버로 — 1280 미만은 같은 내용을 시트로.
- 열면 초점을 안으로, 닫으면 트리거로.
- 안내 팝오버는 제목 + 닫기.

### ❌ Don't

- 팝오버에 폼 · 상세(Dialog).
- 호버로 열기(도움말 말풍선은 Help Bubble — 그 차례에).
- 팝오버 위에 팝오버(고르는 패널 안의 작은 패널은 예외 — 달력의 월 · 연도).
- 1280 미만에서 팝오버(시트).

## Specification

`popover.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Popover 를 만들 때 이 값을 그대로 쓴다.

[그림: Specification — popover.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#popover)

## SEED 와 다른 점

- **바닥 버튼은 Button small 36** — SEED 예제는 medium 40. Button 결정을 따랐다.
- **반투명 색을 불투명 짝으로**(v102) — 닫기 버튼 누름 `bg-layer-floating-pressed`.
- **1280 미만에서는 쓰지 않는다** — 같은 내용을 Bottom Sheet 로(Input Button 의 경계). SEED Popover 는 폭 규칙이 없다.
- **z-index 는 specs/z-index.md 의 L3(`z-floating` 200)** — SEED 99999. 대화상자 · 시트(L2) 위, 확인창(L5) 아래.

## Migration notes

### 2026-10-02 — SEED Popover 로 다시 정한다

사용자가 [비교 페이지](https://claude.ai/artifact/2KE4tDQT6p5GPyhx7Y29vt)에서 SEED 모양을 골랐다 — 폭 320 ~ 480 · 최대 높이 600 · 모서리 20 · 그림자 s3 · 트리거와 8 · 머리 제목 20 / 27 + 닫기 · 비모달(초점은 안으로, 가두지 않음). 옛 Popover(288 · 모서리 8 · 1px 테두리 · shadow-md · 안쪽 12)는 걷었다 — 옛 스펙은 `popover.history/v-pre-seed-overlay.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — Popover 부품 6종(날짜 14 · 시각 6 · 아이콘 2 · 캘린더 3)이 360 폭에서도 팝오버로 뜬다(→ 1280 미만은 시트). 날짜 팝오버는 이름이 없고 첫 초점이 영어 "Go to the Previous Month" 버튼이다. 손으로 만든 월 고르기(데스크톱 5곳) · 알림 팝오버는 z-index 가 auto 라 다른 층 아래로 들어가고 `Esc` 로 닫히지 않는다.
- **HR 웹** — Popover 14곳(규정 안내 12 · 일정 필터 · 역할 고르기) + 날짜 · 시각 피커 21곳. 규정 안내는 이름이 없다.
- 앱 적용 때 화면마다 정할 자리 — HR 규정 안내 12(Popover · Help Bubble), 알림 팝오버 · 데스크톱 필터(Popover · Dialog · Side Panel).
