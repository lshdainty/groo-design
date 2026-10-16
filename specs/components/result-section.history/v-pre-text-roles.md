# Result Section

> 화면이나 그 영역 가운데에 놓는 결과 — 비어 있음 · 불러오기 실패 · 완료 · 찾을 수 없는 페이지 · 화면 오류를 한 틀로 그린다. 불러오기에 실패했는데 "내역이 없어요" 처럼 비어 있음으로 보이지 않게, 실패는 아이콘 · 글 · "다시 시도" 로 다르게 보인다.

구조는 당근 [SEED Result Section](https://seed-design.io/react/components/result-section)(Apache-2.0)을 따른다 — 아이콘 · 제목 · 설명 · 버튼 둘, 크기 둘(화면 전체 · 일부). SEED 는 조합 예제 하나뿐이라 porest 는 수치를 스펙으로 둔다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). porest 에 처음 두는 컴포넌트다.

수치 원본은 [`result-section.yaml`](result-section.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 이번 달 거래 없음 · 불러오기 실패 · 가져오기 완료 — 라이트 · 다크](../../site/components/specs/result-section.tsx#hero)

### 직접 골라 보기

결과(비어 있음 · 실패 · 완료) · 크기 · 버튼을 고르면 스펙대로 그린 결과와 그 코드가 바뀐다.

[그림: 플레이그라운드](../../site/components/specs/result-section.tsx#playground)

## Anatomy

[그림: 결과는 아이콘 · 제목 · 설명 · 버튼 둘](../../site/components/specs/result-section.tsx#anatomy)

| ⓐ Asset | 아이콘 — 40. 비어 있음은 그 내용을 말하는 아이콘, 실패는 느낌표, 완료는 체크. |
| ⓑ Title | 제목 — 무슨 상태인지 한 줄. |
| ⓒ Description | 설명 — 왜 · 무엇을 하면 되는지, 최대 두 줄. |
| ⓓ First Button | 첫 버튼 — 해결 · 다음 동작(다시 시도 · 거래 추가). |
| ⓔ Second Button | 둘째 버튼 — 보조 동작(홈으로 · 다른 파일 가져오기). 글 버튼. |

[표: 부위](result-section.yaml#slots)

## Properties

### 크기

`large`(기본)는 화면 전체를 차지하는 결과 — 제목 22 / 30, 설명 16 / 22(사이 12), 버튼 위 28. `medium` 은 카드 · 섹션 · 시트 안의 결과 — 제목 16 / 22, 설명 14 / 19(사이 8), 버튼 위 24. 둘 다 좌우 48 · 위아래 16 이고 놓인 자리의 가운데에 선다. 아이콘 40 과 제목 사이 16. 카드 안에서는 좌우 여백이 0 이다 — 카드의 안 여백 24 가 가장자리를 맡는다([Card](card.md), 사용자 결정 2026-10-09). 둘 다 두면 72 가 되어 좁은 카드에서 제목이 두 줄로 넘어간다.

[그림: large · medium](../../site/components/specs/result-section.tsx#sizes)

[표: 크기](result-section.yaml#size)

[표: 공통](result-section.yaml#base.enabled)

### Kind

`empty`(비어 있음 · 처음 — 회색 아이콘) · `failure`(불러오기 실패 · 화면 오류 — 위험 색 느낌표, 첫 버튼은 "다시 시도") · `done`(완료 — 성공 색 체크).

[그림: 비어 있음 · 실패 · 완료](../../site/components/specs/result-section.tsx#kinds)

[표: 결과](result-section.yaml#kind)

## Guidelines

### 실패를 비어 있음으로 보이지 않는다

불러오기에 실패하면 "내역이 없어요" 가 아니라 실패를 보인다 — 비어 있다고 믿으면 사람은 기록을 다시 넣거나 떠난다. 실패는 `failure` 로, 무엇을 불러오지 못했는지와 "다시 시도" 를 둔다. 이미 불러온 내용이 있으면 지우지 않고, 다시 불러오기 실패는 [Snackbar](snackbar.md) 로 가볍게 알린다.

불러오기가 끝나지 않아도 실패다 — 요청 제한(10초)이 지나면 기다리던 자리가 이 `failure` 로 바뀐다. 언제 스켈레톤 · 원 · 안내 글을 보이고 언제 실패로 바꾸는지(시간표), 요청 제한 · 다시 시도는 [Skeleton 의 "기다리는 동안"](skeleton.md#기다리는-동안) 한 곳에 있다.

[그림: 실패 — 비어 있음과 다르게 · 다시 시도](../../site/components/specs/result-section.tsx#failure-guide)

### 버튼 — 해결 하나, 보조 하나

첫 버튼은 그 상태를 푸는 동작(다시 시도 · 거래 추가 · 가계부로 가기), 둘째는 보조(홈으로 · 다른 파일 가져오기)다. 실패 화면에서 떠나는 길은 화면의 성격에 맞춘다 — 직전 단계로 고치러 가면 뒤로, 시트 · 대화상자면 닫기, 돌아갈 곳이 없으면 "홈으로", 같은 일을 다시 하면 "다시 시도". 화면 전체의 핵심 동작은 결과 안 버튼 대신 바닥 버튼(Button large 48)으로 둘 수 있다.

[그림: 버튼 — 다시 시도 · 홈으로 · 바닥 버튼](../../site/components/specs/result-section.tsx#buttons-guide)

### 찾을 수 없는 페이지 · 화면 오류

없는 주소는 몰래 다른 곳으로 돌리지 않고 `large` 결과로 알린다 — "페이지를 찾을 수 없어요" + "홈으로". 화면이 그리다 멈추면 빈 화면 대신 "문제가 생겼어요" + "다시 시도" 를 보인다.

### 글

제목은 상태 한 줄(큰 글씨라 마침표 없이) — "이번 달 거래가 없어요" · "거래를 불러오지 못했어요". 설명은 해요체 문장에 마침표, 최대 두 줄 — 비어 있으면 무엇을 하면 되는지("거래를 기록하면 여기에 모여요."), 실패면 할 수 있는 일("잠시 뒤 다시 시도해 주세요."). 서버가 보낸 글 · 예외 · 영어를 보이지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/result-section.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 비어 있음

[그림: 이번 달 거래 없음](../../site/components/specs/result-section.tsx#ex-empty)

```tsx
import { ResultSection } from "@/components/ui/result-section"

<ResultSection
  kind="empty"
  icon={<ReceiptText />}
  title="이번 달 거래가 없어요"
  description="거래를 기록하면 여기에 모여요."
  primaryAction={{ label: "거래 추가", onClick: openAddTx }}
/>
```

### 불러오기 실패 — 다시 시도

[그림: 거래를 불러오지 못함](../../site/components/specs/result-section.tsx#ex-failure)

```tsx
{query.isError && !query.data ? (
  <ResultSection
    kind="failure"
    size="medium"
    title="거래를 불러오지 못했어요"
    description="잠시 뒤 다시 시도해 주세요."
    primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }}
  />
) : (
  <TransactionList items={query.data} />
)}
```

### 완료 · 찾을 수 없는 페이지

[그림: 가져오기 완료 · 404](../../site/components/specs/result-section.tsx#ex-done)

```tsx
<ResultSection
  kind="done"
  title="1,204건을 가져왔어요"
  description="건너뛴 줄 3 · 실패 0"
  primaryAction={{ label: "가계부로 가기", onClick: goLedger }}
  secondaryAction={{ label: "다른 파일 가져오기", onClick: reset }}
/>

<ResultSection kind="empty" icon={<SearchX />} title="페이지를 찾을 수 없어요" primaryAction={{ label: "홈으로", href: "/" }} />
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 불러오는 중 → 결과 | 투명도로 바뀐다(150ms). 결과는 보조 기술에 알린다(`role="status"`) — 실패는 무엇이 안 됐는지까지. 10초 안에 오지 않으면 실패다([Skeleton 의 시간표](skeleton.md#기다리는-동안)) |
| 다시 시도 | 다시 불러온다 — 그동안 버튼에 로딩을 걸고, 시간표를 처음부터 다시 센다(10초) |
| 이미 불러온 내용이 있는데 다시 불러오기 실패 | 내용을 지우지 않는다 — [Snackbar](snackbar.md) 로 가볍게 알린다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 16.41 · 13.42(바탕 `bg-layer-default`), 설명 `fg-neutral-muted` 7.11 · 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 아이콘은 장식 — 상태는 제목이 말한다(실패 `fg-critical` 5.06 · 6.08, 완료 `fg-positive`) |
| **WCAG 1.3.1** Info and relationships | 제목은 제목 태그(화면 전체면 그 화면의 제목 단계) |
| **WCAG 4.1.3** Status messages | 결과로 바뀌면 `role="status"` 로 알린다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 첫 버튼 40 · 둘째 버튼 36 ✓ |
| **ARIA** | 아이콘 `aria-hidden`. 버튼은 Button 그대로 |

## Do / Don't

### ✅ Do

- 불러오기 실패는 `failure` + "다시 시도".
- 비어 있으면 무엇을 하면 되는지 한 줄 + 첫 동작.
- 없는 주소 · 화면 오류도 같은 틀로.

### ❌ Don't

- 실패를 "내역이 없어요" 로.
- 버튼 셋 이상.
- 예외 · 서버 글 · 영어를 설명에.
- 이미 보이는 내용을 지우고 실패 화면으로 덮기.

## Specification

`result-section.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Result Section 을 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — result-section.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#result-section)

## SEED 와 다른 점

- **스펙(YAML)으로 둔다** — SEED 는 rootage · CSS 가 없고 조합 예제 하나다.
- **결과 셋(empty · failure · done)의 아이콘 색을 정한다** — SEED 는 예제에서만 보인다.
- **애니메이션 에셋(Lottie)은 두지 않는다** — 아이콘 40(lucide 선 아이콘, v106).
- **제목은 제목 태그, 결과가 바뀌면 보조 기술에 알린다** — SEED 는 `span` 이고 알리지 않는다.
- **404 · 화면 오류도 이 틀로** — SEED 에는 없는 쓰임이다.

## Migration notes

### 2026-10-02 — 새로 둔다(SEED Result Section)

사용자가 [비교 페이지](https://claude.ai/artifact/8t85WkZ3HLhMu8KibW3Vk1)에서 정했다 — 빈 화면 · 불러오기 실패(다시 시도) · 완료 · 404 · 화면 오류를 한 틀로, 실패는 빈 화면과 다르게.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 공용 빈 화면이 없다(8가지 · 약 86곳). 불러오기에 실패하면 대시보드 · 거래 · 자산 · 예산 · 통계 · 할 일 · 메모 · 알림이 "없어요" 로 보이고, 토스 증권은 "증권 계정을 연결해 주세요" 를 띄운다. "다시 시도" 버튼 0, 오류 경계 0(화면 오류에 빈 화면), 없는 주소는 몰래 홈으로.
- **Desk 앱** — PEmptyState 15 + 손 다섯 가지, 오류 글에 예외 원문(`ApiException(…)`) 33곳, 통계 · 캘린더는 실패가 빈 화면, "다시 시도" 는 4화면뿐, 404 는 go_router 의 영어 화면.
- **HR 웹** — shadcn Empty 27 + 손 8, 불러오기 실패는 장식 없는 "오류가 발생했습니다." 29곳 · 붉은 글 6곳, 정책 · 권한은 실패가 빈 화면, 404 는 영어(antd), 화면 오류에 빈 화면.
