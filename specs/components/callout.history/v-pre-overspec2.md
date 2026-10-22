# Callout

> 화면 안, 그 기능 · 내용 가까이에 늘 보이는 안내 상자 — 팁 · 제약 · 주의, 그리고 그 자리에서 난 오류(저장 실패). 페이지 전체의 상태는 [Page Banner](page-banner.md), 잠깐 알릴 결과는 [Snackbar](snackbar.md), 눌러서 여는 도움말은 [Help Bubble](help-bubble.md) 이다.

구조는 당근 [SEED Callout](https://seed-design.io/react/components/callout)(Apache-2.0)을 따른다 — 옅은 톤 바탕 · 아이콘 · 제목 · 본문 · 링크가 한 문단, 상호작용 셋(보이기 · 전체 누르기 · 닫기). 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). 옛 Alert(왼쪽 4px 막대) 스펙을 대신한다 — "Alert" 라는 이름은 모달([Alert Dialog](alert-dialog.md))에만 쓴다.

수치 원본은 [`callout.yaml`](callout.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가져오기 안내 · 분할 합계 주의 · 저장 실패 — 라이트 · 다크](../../site/components/specs/callout.tsx#hero)

### 직접 골라 보기

톤 · 상호작용 · 제목 · 링크를 고르면 스펙대로 그린 상자와 그 코드가 바뀐다. 실제로 누르고 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/callout.tsx#playground)

## Anatomy

[그림: 상자는 아이콘 · 제목 · 본문 · 링크, 뒤 화살표나 닫기](../../site/components/specs/callout.tsx#anatomy)

| ⓐ Container | 상자 — 콘텐츠 폭 전체, 옅은 톤 바탕 · 모서리 10. |
| ⓑ Icon | 앞 아이콘 — 톤 색, 16. |
| ⓒ Title | 제목 — 성격을 나타내는 짧은 말(안내 · 주의 · 새 기능). 없어도 된다. |
| ⓓ Description | 본문 — 제목 뒤에 한 문단으로 이어진다. |
| ⓔ Link | 링크 — 보조 내용으로 갈 때만. |
| ⓕ Chevron · Close | 상자 전체를 누르면 뒤 화살표, 닫을 수 있으면 닫기. |

[표: 부위](callout.yaml#slots)

## Properties

### 상자

안쪽 14 · 최소 50 · 모서리 10 · 아이콘 16 · 사이 12. 제목 · 본문 · 링크는 모두 14 / 19 이고 한 문단으로 흐른다 — 제목은 700, 사이는 띄어쓰기 두 칸, 링크는 밑줄. 여러 줄이면 아이콘 · 화살표 · 닫기는 상자 가운데에 선다.

[그림: 상자의 여백 · 한 문단](../../site/components/specs/callout.tsx#layout)

[표: 공통](callout.yaml#base.enabled)

### Tone

다섯 — `neutral`(일반) · `informative`(정보 · 가이드 · 팁) · `positive`(성공 · 혜택) · `warning`(주의 · 미리 알릴 문제) · `critical`(오류 · 바로 조치할 일). 바탕은 옅은 톤(`bg-*-weak`), 글 · 아이콘 · 링크 · 화살표 · 닫기는 모두 같은 `fg-*-contrast` 색이다.

[그림: 톤 다섯 — 라이트 · 다크](../../site/components/specs/callout.tsx#tones)

[표: 톤](callout.yaml#tone)

### Interaction

`display`(보이기만 — 링크를 둘 수 있다) · `actionable`(상자 전체가 버튼 — 뒤 화살표, 링크는 두지 않는다) · `dismissible`(닫기 버튼 — 한 번 보면 되는 안내에만).

[그림: 보이기 · 전체 누르기 · 닫기](../../site/components/specs/callout.tsx#interactions)

[표: 상호작용](callout.yaml#interaction)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 옅은 톤 바탕 |
| `hovered` | 웹 — Actionable 은 톤의 누름 바탕, 닫기 버튼도 |
| `pressed` | Actionable 은 누름 바탕 + 상자 전체 2px 거리 축소, 닫기는 축소 |
| `focused` | 웹 — 키보드 포커스에만 링(상자 · 링크 · 닫기 둘레) |

[표: 상태](callout.yaml#matrix)

[표: 모션](callout.yaml#motion)

## Guidelines

### 어디에 두나

| 이런 안내 | 쓰는 것 |
|---|---|
| 그 기능 · 내용 가까이의 팁 · 제약 · 주의 | **Callout** — 본문 안, 그 내용 바로 위 |
| 그 자리에서 난 오류(저장 · 제출 실패) | **Callout** `critical` — 폼 맨 위, 폼은 연 채로 |
| 시트 · 대화상자가 열린 채 봐야 할 결과(저장 실패 · 계산 결과) | **Callout** — 그 안 폼 맨 위. 창을 닫으며 끝나는 일은 닫힌 뒤 [Snackbar](snackbar.md) |

다른 알림(Snackbar · Page Banner · Result Section · Alert Dialog)과 고르는 표 · 다섯 부품 견주기는 [Snackbar 의 "무엇으로 알리나"](snackbar.md) 한 벌이다(2026-10-22 사용자 결정 3B · 2B — https://claude.ai/artifact/NuEPiLRH2fJidXdKzcDsCX). 몰라도 일은 할 수 있는 긴 설명은 [Help Bubble](help-bubble.md)(ⓘ), 입력값 하나가 틀리면 [Field](field.md) 의 오류 문구(칸 아래)다.

[그림: Callout 은 그 자리 · Page Banner 는 페이지 맨 위 · Snackbar 는 잠깐](../../site/components/specs/callout.tsx#role-guide)

### 닫기는 한 번 보면 되는 안내에만

새 기능 소개처럼 한 번 읽으면 되는 안내만 닫을 수 있게 한다 — 닫은 뒤 같은 안내를 다시 띄우지 않는다(닫음을 기억한다). 경고 · 오류는 닫지 못한다 — 문제가 남아 있는 동안 보여야 한다.

[그림: 닫기 — 새 기능 안내만 · 경고는 닫지 못한다](../../site/components/specs/callout.tsx#dismiss-guide)

### 링크와 전체 누르기

링크는 보조 내용(자세히 · 약관)으로 갈 때만 쓴다 — 행동을 이끌려고 링크를 두지 않는다. 눌러서 어딘가로 가는 게 상자의 목적이면 상자 전체를 누르게(`actionable`) 하고 링크는 두지 않는다.

### 글

제목은 성격을 나타내는 짧은 말 — "안내" · "주의" · "새 기능". 본문은 제목을 되풀이하지 않고 해요체 문장에 마침표. 오류는 무엇이 안 됐는지와 할 수 있는 일까지 — "저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요." 서버가 보낸 글 · 영어 · 코드를 그대로 쓰지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/callout.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 보이기 — 안내 · 링크

[그림: 가져오기 안내](../../site/components/specs/callout.tsx#ex-display)

```tsx
import { Callout } from "@/components/ui/callout"

<Callout tone="informative" title="안내" link={{ label: "자세히", href: "/guide/import" }}>
  가져온 데이터는 기존 거래에 더해지고 덮어쓰지 않아요.
</Callout>
```

### 저장 실패 — 폼 맨 위

[그림: 거래 저장 실패](../../site/components/specs/callout.tsx#ex-error)

```tsx
{/* 나중에 나타나는 경고 · 위험은 보조 기술에 알린다(role="alert") */}
{saveError && (
  <Callout tone="critical" role="alert">
    저장하지 못했어요. 입력한 내용은 그대로 있어요. 잠시 뒤 다시 저장해 주세요.
  </Callout>
)}
```

### 전체 누르기 · 닫기

[그림: 증권 연결 · 새 기능 안내](../../site/components/specs/callout.tsx#ex-interactive)

```tsx
<Callout tone="neutral" interaction="actionable" onClick={openBrokerConnect}>
  토스증권을 연결하면 보유 주식이 자산에 더해져요.
</Callout>

{/* 한 번 보면 되는 안내 — 닫으면 다시 띄우지 않는다 */}
<Callout tone="informative" title="새 기능" interaction="dismissible" open={!seen} onDismiss={markSeen}>
  반복 거래를 자동으로 기록할 수 있어요.
</Callout>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Actionable 누르기 · `Enter` · `Space` | 상자의 동작을 한다 |
| 링크 누르기 | 그 곳으로 간다 |
| 닫기 | 바로 사라진다. 초점은 다음 요소로 가고, 닫은 것을 기억해 다시 띄우지 않는다 |
| 나중에 나타남(저장 실패) | `role="alert"` 로 보조 기술에 알린다 — 처음부터 있던 안내는 알리지 않는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | `fg-*-contrast` 옅은 톤 바탕 위 5.65 ~ 5.72 · 다크 7.78 ~ 7.84, neutral 15.20 · 10.32 ✓ — 누름 바탕 위에서도 4.5 이상 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 상자 면은 장식 — 뜻은 아이콘 · 글이 말한다. 포커스 링 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 40 ✓ · 링크는 글 높이 19 ⚠(본문 속 링크는 예외) |
| **WCAG 4.1.3** Status messages | 나중에 나타나는 경고 · 위험은 `role="alert"` |
| **ARIA** | Display · Dismissible 은 문단. Actionable 은 `<button type="button">`(이름은 글 전체). 닫기 이름 "닫기", 버튼은 모두 `type="button"`(폼 안에서 제출되지 않게). 아이콘 · 화살표는 장식 |

## Do / Don't

### ✅ Do

- 그 내용 바로 위에, 그 기능의 안내만.
- 저장 실패는 폼 맨 위 `critical` — 폼은 연 채로.
- 눌러서 가는 안내는 상자 전체를 누르게.

### ❌ Don't

- 경고 · 오류를 닫을 수 있게.
- 링크로 행동을 이끌기.
- 페이지 전체의 상태를 Callout 으로 — Page Banner.
- 한 화면에 Callout 여럿을 쌓기.

## Specification

`callout.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Callout 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — callout.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#callout)

## SEED 와 다른 점

- **톤은 다섯** — magic(AI)은 groo 에 AI 기능이 없어 두지 않는다.
- **아이콘은 lucide 선 아이콘**(v106) — SEED 는 채운 아이콘을 권한다.
- **나중에 나타나는 경고 · 위험은 `role="alert"`** — SEED 는 역할이 없어 알리지 않는다.
- **버튼은 모두 `type="button"`** — SEED 링크 · 닫기에는 없어 폼 안에서 제출된다.
- **닫기 버튼의 누름 바탕은 톤의 누름 색**(`bg-*-weak-pressed`) — SEED 투명 누름 색의 불투명 짝.

## Migration notes

### 2026-10-22 — 알림 고르는 표는 한 벌

"어디에 두나" 표의 다른 부품 줄(Page Banner · Snackbar · Help Bubble · Field)을 걷고 Callout 줄만 남겨, 고르는 표 · 다섯 부품 견주기는 Snackbar 문서 한 벌로 링크한다(3B). 시트 · 대화상자가 열린 채 봐야 할 결과는 그 안 Callout 이라는 줄을 더했다(2B) — 사용자 결정 https://claude.ai/artifact/NuEPiLRH2fJidXdKzcDsCX. 값 변경 없음.

### 2026-10-02 — SEED Callout 으로 새로 둔다(옛 Alert 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/8t85WkZ3HLhMu8KibW3Vk1)에서 정했다 — 옅은 톤 바탕 · 모서리 10 · 한 문단 · 톤 다섯 · 닫기는 한 번 보면 되는 안내만, 저장 실패는 폼 맨 위 Callout. 옛 Alert(왼쪽 4px 막대 · 8% 바탕 · 제목 블록)는 걷었다 — 옛 스펙은 `alert.history/v-pre-seed-feedback.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 공용 Alert 2곳 + 손으로 만든 안내 상자 31(경고 · 위험을 일곱 가지로 그린다). 정의 없는 색 토큰(`--fg-danger` · `--bg-danger-subtle` …) 11곳이 회색으로 보이고, 저축 목표 오류 상자는 다크 값이 없다. 화면 소개 카드 넷이 바로 위 머리와 같은 말을 되풀이한다. 만료된 "2026.6까지" 수수료 안내.
- **Desk 앱** — PAlert 5(왼쪽 4px 막대) + 손 상자 20여. 예산 한도 초과를 위험 색으로, 같은 카드 유의사항을 두 모양으로 그린다. 인라인 상자에 보조 기술 알림이 없다.
- **HR 웹** — shadcn Alert 2 + 손 상자 10여. 결재 안내 상자 셋이 번역 키를 그대로 보인다(`application.autoApprovalMessage` …), 반복 부여 안내에 영어 코드(YEARLY · MONTHLY).
