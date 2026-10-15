# Snackbar

> 화면 아래에 잠깐 떴다 사라지는 띠(토스트) — 방금 한 일의 결과("거래를 저장했어요."), 뒤에서 끝난 일, 다시 하면 되는 가벼운 실패를 알린다. 조치해야 끝나는 오류 · 계속 보여야 할 경고 · 결정은 여기 두지 않는다 — 그 자리의 [Callout](callout.md) · 페이지의 [Page Banner](page-banner.md) · [Result Section](result-section.md) · [Alert Dialog](alert-dialog.md) 다.

구조는 당근 [SEED Snackbar](https://seed-design.io/react/components/snackbar)(Apache-2.0)를 따른다 — 짙은 띠 · 아이콘(성공 · 실패에만) · 글 · 액션 하나, 화면 아래 가운데에 한 번에 하나. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). 옛 Sonner(토스트) 스펙을 대신한다.

수치 원본은 [`snackbar.yaml`](snackbar.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 저장 · 삭제 되돌리기 · 관심 종목 실패 — 라이트 · 다크](../../site/components/specs/snackbar.tsx#hero)

### 직접 골라 보기

톤 · 액션 · 글 길이를 고르고 띄우면 스펙대로 그린 띠가 아래에서 뜨고, 시간이 지나면 사라진다. 마우스를 올리거나 키보드로 옮기면 멈춘다.

[그림: 플레이그라운드](../../site/components/specs/snackbar.tsx#playground)

## Anatomy

[그림: 띠는 아이콘 · 글 · 액션으로, 화면 아래 자리에 하나](../../site/components/specs/snackbar.tsx#anatomy)

| ⓐ Region | 자리 — 화면 아래 가운데. 탭 바 · 플로팅 버튼 · 바닥 버튼 위 8. |
| ⓑ Container | 띠 — 짙은 바탕(다크는 밝은 띠) · 최대 464. |
| ⓒ Icon | 아이콘 — 성공(체크) · 실패(느낌표)에만. |
| ⓓ Message | 글 — 무엇이 됐는지 먼저. 줄이지 않는다. |
| ⓔ Action | 액션 — 하나, 동작 이름("되돌리기"). 누르면 닫힌다. |

[표: 부위](snackbar.yaml#slots)

## Properties

### 띠

최소 44 · 여백 10 + 글 좌우 6(글은 띠 가장자리에서 16) · 모서리 8 · 그림자 없음. 글 14 / 19, 아이콘 24, 액션 14 · 700. 폭은 화면에서 좌우 8 을 뺀 만큼이고 최대 464 — 넓은 화면에서는 가운데에 선다. 글이 길면 줄을 바꾸고 자르지 않는다 — 두 줄 안에서 끝나게 쓴다.

[그림: 띠의 여백 · 글 · 아이콘 · 액션](../../site/components/specs/snackbar.tsx#layout)

[표: 공통](snackbar.yaml#base.enabled)

### Tone

`neutral`(기본)은 아이콘이 없다. 성공을 눈에 띄게 알릴 때만 `positive`(체크), 가볍게 실패했을 때 `critical`(느낌표) — 아이콘 색만 바뀐다. 짙은 띠 위에서 보이게 아이콘 · 액션은 반전 짝 색(`fg-*-inverted`)이다.

[그림: 톤 셋 — 아이콘 없음 · 체크 · 느낌표](../../site/components/specs/snackbar.tsx#tones)

[표: 톤](snackbar.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 보임 |
| `pressed` | 액션 — 글만 2px 거리 축소 |
| `focused` | 웹 — 키보드 포커스에만 띠 글자색 링. 띠 · 닫기는 안쪽 4, 액션은 바깥 2 — 어느 링이든 띠 위에 그린다(페이지 위로 나가면 보이지 않는다) |

[표: 상태](snackbar.yaml#matrix)

[표: 모션](snackbar.yaml#motion)

## Guidelines

### 스낵바에 알리는 것

| 이런 일 | 쓰는 것 |
|---|---|
| 방금 한 일의 결과(저장 · 삭제 · 복사 · 옮김) | **Snackbar** — 되돌릴 수 있으면 "되돌리기" |
| 뒤에서 끝난 일(내보내기 · 동기화) | **Snackbar** |
| 다시 하면 되는 가벼운 실패(관심 종목에 넣지 못함) | **Snackbar** `critical` + "다시 시도"(켜고 끄는 단추의 실패는 되돌린 뒤 이 띠 — [Toggle](toggle.md) 20A) |
| 입력값이 틀림 | [Field](field.md) 의 오류 문구(칸 아래) |
| 저장 · 제출이 실패함 | 폼 맨 위 [Callout](callout.md) `critical` — 폼은 연 채로 |
| 화면을 불러오지 못함 | 그 자리 [Result Section](result-section.md) + "다시 시도" |
| 페이지 전체의 상태(연결 끊김 · 만료 예정) | [Page Banner](page-banner.md) |
| 되돌릴 수 없는 결정 | [Alert Dialog](alert-dialog.md) |

[그림: 스낵바는 결과 · 가벼운 실패 — 조치가 필요한 오류는 그 자리에](../../site/components/specs/snackbar.tsx#role-guide)

### 오류는 자리에서

모든 실패를 한곳에서 스낵바로 띄우지 않는다 — 서버가 보낸 글 · 영어 · 코드가 그대로 나가고, 같은 실패가 둘 · 넷씩 뜬다. 각 화면이 실패한 자리에서 알린다: 불러오기 실패는 Result Section, 저장 실패는 폼 맨 위 Callout, 칸 오류는 칸 아래. 스낵바는 그 자리에 둘 곳이 없는 가벼운 실패에만 쓴다.

[그림: 오류는 자리에서 — 전역 토스트를 두지 않는다](../../site/components/specs/snackbar.tsx#error-guide)

### 자리 — 화면 아래 가운데

어느 폭이든 화면 아래 가운데다. 탭 바([Bottom Navigation](bottom-navigation.md)) · 떠 있는 버튼([Floating Action Button](floating-action-button.md)) · 바닥 고정 버튼이 있으면 그 위 8 에 서고, 안전 영역(홈 표시줄)을 피한다. 시트 · 대화상자가 열려 있어도 그 위에 뜬다(z L6). 다만 시트 · 대화상자 안에서 한 일의 결과 · 오류는 그 안에 Callout 으로 알리고, 스낵바는 시트가 닫힌 뒤에 띄운다 — 시트 위의 띠를 누르면 시트가 바깥 누름으로 닫히고 액션이 먹지 않는다.

[그림: 폰은 탭 바 위 · 데스크톱은 아래 가운데 최대 464](../../site/components/specs/snackbar.tsx#placement-guide)

### 시간 · 한 번에 하나

액션이 없으면 4초, 있으면 6초. 마우스를 올리거나, 손가락으로 누르고 있거나, 키보드 초점이 들어오면 멈추고, 떠나면 처음부터 다시 센다. 한 번에 하나만 — 새 띠가 오면 지금 띠를 바로 바꾼다(쌓지 않는다). 되돌리기 같은 액션은 스낵바에만 두지 않는다 — 시간이 지나면 사라지므로 같은 일을 할 다른 길(목록 · 상세)이 있어야 한다.

[그림: 시간 — 4초 · 액션 6초 · 머무는 동안 멈춤](../../site/components/specs/snackbar.tsx#timing-guide)

### 글

해요체 문장에 마침표(Writing v106) — 무엇이 됐는지 먼저: "거래를 저장했어요." · "관심 종목에 넣지 못했어요. 다시 시도해주세요." 시스템 말("처리가 완료되었습니다") · "실패" 로 끝나는 말 · 서버가 보낸 글 · 영어 · 코드를 쓰지 않는다. 액션은 구체적인 동작 이름 한두 마디("되돌리기" · "잔액 고치기") — "확인" · "취소" 로 뭉뚱그리지 않는다.

[그림: 글 — 결과 먼저 · 마침표 · 액션은 동작 이름](../../site/components/specs/snackbar.tsx#writing-guide)

## 코드

레시피 `recipes/shadcn/components/ui/snackbar.tsx` 를 쓴다. 앱 맨 위에 `SnackbarProvider` 를 한 번 두고, 띄울 때는 `useSnackbar()` 의 `show` 를 부른다. 탭 바 · 바닥 버튼처럼 띠가 피해야 할 것은 `SnackbarAvoidOverlap` 으로 감싼다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 결과 알리기

[그림: 거래 저장](../../site/components/specs/snackbar.tsx#ex-basic)

```tsx
import { useSnackbar } from "@/components/ui/snackbar"

const snackbar = useSnackbar()

await saveTransaction(draft)
snackbar.show({ message: "거래를 저장했어요." })
```

### 되돌리기 — 액션이 있으면 6초

[그림: 거래 삭제 · 되돌리기](../../site/components/specs/snackbar.tsx#ex-action)

```tsx
snackbar.show({
  message: "거래를 삭제했어요.",
  action: { label: "되돌리기", onClick: () => restoreTransaction(id) },
})

// 가볍게 실패 — 다시 하면 되는 일만. 저장 · 불러오기 실패는 그 자리에서 알린다.
// 켜고 끄는 단추(관심 등록)는 되돌린 뒤 같은 요청을 다시 보내는 "다시 시도" 를 단다(Toggle 20A)
snackbar.show({
  tone: "critical",
  message: "관심 종목에 넣지 못했어요. 다시 시도해주세요.",
  action: { label: "다시 시도", onClick: () => setWatched(stock.id, true) },
})
```

### 피할 자리 — 탭 바 · 바닥 버튼

```tsx
import { SnackbarAvoidOverlap, SnackbarProvider } from "@/components/ui/snackbar"

<SnackbarProvider>
  <App />
  <SnackbarAvoidOverlap>
    <TabBar />
  </SnackbarAvoidOverlap>
</SnackbarProvider>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 나타남 | 150ms 로 가운데에서 커지며 나타난다(모션 줄이기면 투명도만). 초점은 옮기지 않는다 |
| 시간 | 4초 · 액션이 있으면 6초 뒤 100ms 로 사라진다 |
| 마우스를 올림 · 손가락으로 누르고 있음 · 키보드 초점 | 멈춘다 — 떠나면 처음부터 다시 센다 |
| 새 띠가 옴 | 지금 띠를 바로 바꾼다 — 한 번에 하나 |
| 액션 누르기 | 액션을 하고 닫는다 |
| `Tab` | 띠 → 액션 → 보조 기술용 닫기(초점이 오면 보인다) |
| `Esc` · 밀기 · 글 누르기 | 닫히지 않는다 — 닫기 버튼 · 시간 · 액션으로만 |
| 띠 안에 초점이 있을 때 닫힘 | 초점은 띠에 들어오기 전 자리로 돌아간다 |
| 시트 · 대화상자가 열린 동안 | 그 위에 그린다. 띠를 눌러도 그 창은 닫히지 않는다(바깥 누르기가 아니다). 그 안에서 한 일의 결과는 그 안 Callout 으로, 스낵바는 닫힌 뒤에 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 글 `fg-neutral-inverted` 띠(`bg-neutral-inverted`) 위 16.41 · 다크 13.42, 액션 `fg-brand-inverted` Desk 6.90 · 7.76 · HR 7.05 · 4.69 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘 `fg-positive-inverted` 6.87 · 4.70, `fg-critical-inverted` 6.89 · 4.68, 띠 면 페이지 위 16.41 · 13.42 ✓. 포커스 링은 띠 글자색으로 띠 위에 그린다 ✓ |
| **WCAG 2.2.1** Timing adjustable | 머무는 동안 멈추고 떠나면 처음부터. 액션은 6초 — 같은 일을 할 다른 길을 둔다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 액션 글 + 좌우 8 × 44 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 액션 높이 44 ✓ · 폭은 글에 따라 ⚠ |
| **WCAG 4.1.3** Status messages | 자리는 `aria-live="polite"`, 띠는 `role="status"` + `aria-atomic="true"` — 초점을 옮기지 않고 읽힌다. 조치가 필요한 오류는 스낵바가 아니라 자리에서(`role="alert"`) |
| **ARIA** | 아이콘은 장식(`aria-hidden`) — 성공 · 실패는 글이 말한다. 사라지는 동안은 `aria-hidden` |

## Do / Don't

### ✅ Do

- 방금 한 일의 결과를 한 문장으로 — "거래를 저장했어요."
- 되돌릴 수 있는 삭제에 "되돌리기" — 그리고 다른 길도 둔다.
- 탭 바 · 바닥 버튼은 `SnackbarAvoidOverlap` 으로 피한다.

### ❌ Don't

- 모든 실패를 한곳에서 스낵바로 — 서버 글 그대로 · 중복.
- 조치가 필요한 오류 · 계속 보여야 할 경고를 스낵바에.
- 띠를 여러 장 쌓기.
- 시트 · 대화상자 안의 결과를 스낵바로 — 그 안 Callout.
- "확인" 액션.

## Specification

`snackbar.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Snackbar 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — snackbar.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#snackbar)

## SEED 와 다른 점

- **아이콘 · 액션 색은 반전 짝 역할**(v115 — `fg-positive-inverted` · `fg-critical-inverted` · `fg-brand-inverted`) — SEED 는 밝은 바탕용 색을 그대로 써 짙은 띠 위에서 대비가 모자란다(다크 아이콘 2.5:1 · 액션 2.67:1).
- **액션이 있으면 6초**(사용자 결정 2026-10-02) — SEED 는 늘 4초.
- **글은 문장이면 마침표**(Writing v106) — SEED 는 한 문장이면 뺀다.
- **모션 줄이기면 투명도만**(v104) — SEED 는 그대로 돈다.
- **보조 기술용 닫기는 키보드 초점이 오면 보인다** — SEED 는 안 보이는 채로 Tab 이 선다.
- **포커스 링은 띠 글자색** — porest 브랜드 링은 짙은 띠 위에서 3:1 에 못 미친다.
- **아이콘은 lucide 선 아이콘**(v106).
- **z-index 는 specs/z-index.md 의 L6**(`z-snackbar` 400).
- **띠 안에서 닫히면 초점을 돌려준다** — 띠에 들어오기 전 자리로. SEED 는 body 로 떨어뜨려 키보드 사용자가 처음부터 다시 찾아야 한다.
- **아래 자리는 안전 영역과 피할 자리 중 큰 쪽** — SEED 는 둘을 더해, 안전 영역을 품은 탭 바 위에서는 그만큼 더 뜬다.

## Migration notes

### 2026-10-02 — SEED Snackbar 로 새로 둔다(옛 Sonner 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/8t85WkZ3HLhMu8KibW3Vk1)에서 정했다 — 알림을 일로 나누고(결과 · 가벼운 실패만 스낵바), 오류는 자리에서 알리고(전역 오류 토스트를 걷는다), SEED 모양 + 반전 짝 색, 아래 가운데, 액션이 있으면 6초, 마침표는 v106 그대로. 옛 Sonner(흰 카드 · 그림자 · 아이콘 넷 · 글 16/600 · 위 가운데 · 3장 쌓기)는 걷었다 — 옛 스펙은 `sonner.history/v-pre-seed-feedback.*`. 2026-09-22 의 "글은 자르지 않는다" 는 그대로 둔다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹** — sonner 37곳(위 가운데) + 손으로 만든 토스트 2(반복 거래 · 별빛, 아래 가운데 · 역할 없음). 전역 오류 토스트가 서버 글을 그대로(11곳은 화면이 또 띄운다). 시트가 열린 동안 띠를 누르면 시트가 닫히고 액션이 먹지 않는다. 키보드 초점에서 멈추지 않는다. 더치페이 "송금 요청을 보냈어요" 는 아무것도 보내지 않는다.
- **Desk 앱** — showPSnackBar 36(아래). 전역 오류 스낵바(값을 바꾸는 요청만, 영어 대체 문구 "Server error"), 높이를 줄인 시트 4곳에서 띠가 시트 뒤에 그려져 안 보인다, 대화상자 위로는 딤 아래. 액션 스낵바가 스크린리더가 켜져도 6초 뒤 사라진다.
- **HR 웹** — sonner 46(위 가운데, 앱 테마가 아니라 OS 테마, 스타일 클래스가 먹지 않는다). 전역 오류 토스트가 GET 까지 · 재시도마다(실패 한 번에 최대 4), 19곳은 화면이 또 띄운다. 저장 성공을 알리지 않는 화면이 많다(30파일).
