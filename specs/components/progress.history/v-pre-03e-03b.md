# Progress

> "얼마나 찼나" 를 보이는 막대 — 예산 · 카드 한도처럼 쓸수록 차는 것, 저축 목표 · 카드 실적처럼 모을수록 차는 것. 이름 · 오른쪽 글 · 막대 · 금액 줄이 한 묶음이다. 불러오기나 올리기 · 받기의 진행에는 쓰지 않는다 — 그건 [Progress Circle](progress-circle.md) 이다.

SEED 에는 선형 막대 컴포넌트가 없다 — [Loading 패턴](https://seed-design.io/patterns/loading)에 "Progress Bar" 라는 말만 있고 rootage · React · Figma 어디에도 없다(SEED 는 진행을 값 있는 Progress Circle 로 그린다). 그래서 porest 만의 부품이다 — 높이 하나(8) · 모서리 full · 색 하나(브랜드), 넘친 한도만 위험 색. 값은 porest 토큰이다(2026-10-03 사용자 결정). 옛 Progress 스펙(높이 2 · 4 · 8 · 진행 · 흐르는 막대 · 100% 에서 성공 색)을 대신한다.

수치 원본은 [`progress.yaml`](progress.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 10월 예산 · 목표 — 식비 예산 · 넘친 교통 예산 · 여행 자금 · 달성한 카드 실적 — 라이트 · 다크](../../site/components/specs/progress.tsx#hero)

### 직접 골라 보기

한도 · 목표, 값과 목표, 놓인 면을 고르면 스펙대로 그린 막대와 그 코드가 바뀐다. 값을 옮기면 채움이 따라 찬다.

[그림: 플레이그라운드](../../site/components/specs/progress.tsx#playground)

## Anatomy

[그림: 막대는 이름 · 오른쪽 글 · 트랙 · 채움 · 금액 줄](../../site/components/specs/progress.tsx#anatomy)

| ⓐ Label | 이름 — 무엇이 얼마나 찼나. |
| ⓑ Status | 오른쪽 글 — 비율 · "N원 초과" · "달성". |
| ⓒ Track | 트랙 — 막대 바탕. |
| ⓓ Fill | 채움 — 값만큼, 넘쳐도 끝까지만. |
| ⓔ Amount | 금액 줄 — "현재 / 목표". |

[표: 부위](progress.yaml#slots)

## Properties

### 막대 — 높이 하나 · 색 하나

높이 8 · 모서리 full, 트랙 `bg-neutral-weak`, 채움은 브랜드 글자색(`fg-brand` — 다크는 밝은 짝)이다. 화면의 요약 머리든 목록 줄이든 같다 — 크게 보일 것은 막대가 아니라 위의 금액(제목)이다. 위에 이름(14 · 500)과 오른쪽 글(13), 아래에 금액 줄(12 · `fg-neutral-subtle`)을 두고 사이는 6 이다. 이름과 오른쪽 글은 양 끝에 두고 사이는 적어도 8 — 이름이 길면 줄을 바꿔 오른쪽 글에 붙지 않는다. 트랙이 페이지 바탕과 같은 색이라 흰 면(카드 · 시트) 위에 둔다.

[그림: 이름 · 오른쪽 글 · 막대 8 · 금액 줄 — 사이 6](../../site/components/specs/progress.tsx#layout)

[표: 공통](progress.yaml#base.enabled)

### Meaning — 한도 · 목표

| 값 | 쓰는 곳 | 100% 를 넘으면 |
|---|---|---|
| `limit` *(기본)* | 예산 · 카드 한도(쓸수록 찬다) | 채움을 끝까지 + 위험 색(`fg-critical`) + 오른쪽 글 "N원 초과" |
| `goal` | 저축 목표 · 카드 실적(모을수록 찬다) | 끝까지 + 오른쪽 글 "달성" — 색은 그대로 |

[그림: 한도 · 목표 — 넘친 예산 · 달성한 실적](../../site/components/specs/progress.tsx#meanings)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 0 ~ 100% — 채움 브랜드, 오른쪽 글 비율("88%") |
| `over` | 한도를 넘음(`limit`) — 채움 끝까지 · 위험 색, 오른쪽 글 "20,000원 초과"(위험 색 · 700) |
| `reached` | 목표에 닿음(`goal`) — 채움 끝까지, 오른쪽 글 "달성"(본문 색 · 700). 색은 바꾸지 않는다 |

[그림: 보통 · 넘침 · 달성 — 라이트 · 다크](../../site/components/specs/progress.tsx#states)

[표: 상태](progress.yaml#states.meaning)

[표: 모션](progress.yaml#motion)

## Guidelines

### 막대는 미터다 — 기다림에 쓰지 않는다

막대는 범위가 정해진 값이 얼마나 찼는지를 보인다. 불러오는 동안 · 올리기 · 받기의 진행은 [Progress Circle](progress-circle.md) 이다(값을 모르면 도는 원, 알면 채우는 원). 값을 모른 채 흐르는 막대는 두지 않는다.

[그림: 미터는 막대 · 진행은 원 — 올리기를 막대로 그린 화면](../../site/components/specs/progress.tsx#loading-guide)

### 넘친 한도 — 끝까지 + "N원 초과"

쓴 돈이 한도를 넘으면 채움을 끝까지 칠하고 위험 색으로 바꾼다. 얼마나 넘었는지는 막대가 아니라 오른쪽 글이 말한다 — "20,000원 초과". 막대를 100% 너머로 늘이거나 넘친 만큼 다른 색 조각을 잇지 않는다.

[그림: 넘친 예산 — 끝까지 위험 색 + "20,000원 초과" · 넘친 만큼 이은 막대](../../site/components/specs/progress.tsx#over-guide)

### 목표에 닿으면 글자만

저축 · 실적이 목표에 닿으면 오른쪽 글을 "달성" 으로 바꾼다 — 막대 색은 브랜드 그대로다. 성공 색 · 축하 모양을 더하지 않는다. 넘어도(130%) 막대는 끝까지만 차고, 금액 줄이 실제 값을 보인다.

[그림: 달성 — 글자만 · 초록으로 바꾼 막대](../../site/components/specs/progress.tsx#goal-guide)

### 주의 구간 색은 없다

한도에 가까워져도(85% 같은) 색을 바꾸지 않는다 — 막대의 색은 브랜드 · 위험 둘뿐이다(사용자 결정). 가까워졌다는 알림은 사용자가 정한 예산 알림 기준이 알린다.

### 글

- 이름은 무엇의 막대인지 — "식비 예산" · "여행 자금" · "현대카드 M 전월 실적".
- 오른쪽 글은 반올림한 정수 비율 — "88%". 넘치면 "20,000원 초과", 닿으면 "달성". 마침표 없이.
- 금액 줄은 "현재 / 목표" — "350,000원 / 400,000원". 돈이 아닌 값은 그 단위로("6시간 / 8시간").
- 영어 · 코드값 · 카드사의 원색을 쓰지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/progress.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `Progress` — 이름 줄 · 막대 · 금액 줄 한 묶음. `label`(이름), `value`, `max`, `meaning`(`"limit"` 기본 · `"goal"`), `formatValue`(기본 `"350,000원"` 꼴 — 원 단위).
- `ProgressBar` — 막대만(이름 · 글을 직접 그릴 때). `value` · `max` · `meaning` 과 이름(`aria-label`) · 값 글(`aria-valuetext`)을 꼭 준다.
- 막대는 `role="meter"` 다 — 이름 "{이름} {목표} 중 {현재}", 값 글은 오른쪽 글과 같은 말. 보이는 이름 · 오른쪽 글 · 금액 줄은 보조 기술에 숨긴다(같은 말을 두 번 읽지 않게).

### 예산 — 한도

[그림: 식비 예산 · 넘친 교통 예산](../../site/components/specs/progress.tsx#ex-limit)

```tsx
import { Progress } from "@/components/ui/progress"

<Progress label="식비 예산" value={350000} max={400000} />
{/* 넘치면 — 끝까지 위험 색, 오른쪽 "20,000원 초과" */}
<Progress label="교통 예산" value={120000} max={100000} />
```

### 저축 목표 · 카드 실적 — 목표

[그림: 여행 자금 · 달성한 카드 실적](../../site/components/specs/progress.tsx#ex-goal)

```tsx
<Progress meaning="goal" label="여행 자금" value={1200000} max={2000000} />
<Progress meaning="goal" label="현대카드 M 전월 실적" value={390000} max={300000} />  {/* "달성" — 막대는 끝까지 */}

{/* 돈이 아닌 값 — 단위를 바꾼다 */}
<Progress meaning="goal" label="오늘 근무" value={6} max={8} formatValue={(h) => `${h}시간`} />
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 값이 바뀜 | 채움이 300ms 로 따라 찬다 — 처음 그릴 때는 움직이지 않는다 |
| 한도를 넘음 | 채움 끝까지 · 위험 색, 오른쪽 글 "N원 초과" |
| 목표에 닿음 | 채움 끝까지, 오른쪽 글 "달성" — 색은 그대로 |
| 모션 줄이기 | 채움이 바로 바뀐다 |
| 누르기 | 막대는 누르지 않는다 — 줄 전체가 상세로 가면 [List](list.md) 줄이 맡는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 흰 면 위 16.41 · 다크 13.42, 비율 · 금액 `fg-neutral-subtle` 5.50 · 6.09(떠 있는 면 5.27), "N원 초과" `fg-critical` 5.06 · 6.08 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 채움 : 트랙 Desk 7.76 · 다크 4.69, HR 4.69 · 4.79, 넘침 4.68 · 4.68 ✓. 트랙 : 바탕 1.08 · 1.30 — 장식(막대의 끝은 금액 줄이 말한다) |
| **WCAG 1.4.1** Use of color | 넘침은 색과 함께 "N원 초과" 글, 달성은 글로만 ✓ |
| **WCAG 4.1.2** Name, Role, Value | `role="meter"` + 이름 "식비 예산 400,000원 중 350,000원" + `aria-valuemin` 0 · `aria-valuemax` 목표 · `aria-valuenow`(목표를 넘으면 목표) + `aria-valuetext`("88%" · "20,000원 초과" · "달성") ✓ |
| **WCAG 2.3.3** Animation from Interactions | 모션 줄이기면 채움이 바로 바뀐다 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 누르는 것이 없다 — 해당 없음 |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 누르는 것이 없다 — 해당 없음 |
| **ARIA** | 보이는 글(이름 · 오른쪽 글 · 금액 줄)은 `aria-hidden` — 미터의 이름 · 값 글이 같은 말이다. 미터를 모르는 보조 기술에서도 이름 · 값 글은 읽힌다. 앱은 `Semantics(label: 이름, value: 값 글)` |

## Do / Don't

### ✅ Do

- 막대 하나, 높이 8 · 브랜드 채움 — 요약 머리든 목록 줄이든.
- 넘친 한도는 끝까지 + 위험 색 + "N원 초과".
- 목표에 닿으면 "달성" 글자만.
- 보조 기술에는 미터로 — "식비 예산 400,000원 중 350,000원".

### ❌ Don't

- 높이를 자리마다 다르게(6 · 7 · 10 · 12 · 16).
- 주의 구간 주황 · 달성 초록 · 카드사 원색(장미 · 호박 · 초록).
- 다크에서 채움 색(`bg-brand-solid`) — 트랙에 묻힌다(1.33:1).
- 불러오기 · 올리기 진행을 막대로 · 값 모르는 흐르는 막대.
- 넘친 만큼 막대를 더 그리기.

## Specification

`progress.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 막대를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — progress.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#progress)

## SEED 와 다른 점

- **SEED 에는 선형 막대가 없다** — porest 만의 부품이다. SEED 가 진행에 쓰는 값 있는 Progress Circle(올리기 · 당겨서 새로 고침)은 porest 도 그대로 쓰고, 막대는 "얼마나 찼나" 를 보이는 미터로만 둔다.
- 미터는 `role="meter"` 로 읽힌다 — 진행(`progressbar`)과 나눈다.

## Migration notes

### 2026-10-08 — 이름 ↔ 오른쪽 글 사이를 YAML 에

이름 줄 안의 이름 ↔ 오른쪽 글 사이 8 이 레시피(`gap-x2`)와 그 주석에만 있었다 — YAML 대로 만들면 사이가 0 이라, 이름이 길면 글이 오른쪽 글에 붙는다(desk-front #428). `progress.yaml` 에 이름 줄(`header`)과 그 사이(`$spacing-x2`)를 적었다. 모습은 레시피 그대로다. 사용자 결정 — [비교 페이지](https://claude.ai/artifact/9qbK3fj8SL3RmTeiujoJZ6) 5.

### 2026-10-03 — 미터로 다시 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 정했다 — 색 하나 · 높이 하나(늘 브랜드 글자색, 넘친 예산만 위험 색 + "N원 초과"(끝까지 채움), 달성은 글자만, 높이 8, 트랙 `bg-neutral-weak`). 뜻에 따라 두 벌(주의 구간 · 달성 색) · 높이 둘(요약 10 · 줄 6)은 고르지 않았다. 옛 Progress(높이 2 · 4 · 8 · 진행 · 흐르는 막대 · 100% 에서 성공 색 · 브랜드 채움 색)는 걷었다 — 옛 스펙은 `progress.history/v-pre-seed-loading.*`. 진행(올리기 · 받기)은 값 있는 Progress Circle 24 로 옮긴다.

제품은 앱 적용 단계에서 옮긴다(2026-10-03 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹** — 손 막대 20여 곳의 높이가 6 · 7 · 8 · 10 · 12 이고 역할이 하나도 없다(낭독기에 값이 가지 않는다). 예산 막대(`shared/styles/porest.css:562-582` — 안내 · 주의 · 위험 세 색, 채움 전환이 꺼져 있다 `porest.css:575`), 예산 페이스(`pages/budget/ui/BudgetPage.tsx:881` — 다크에서 채움 색 그대로 1.5:1), 카드 사용(`AssetPage.tsx:1176-1181` — 다크에서 라이트 경고 · 위험 색 2.7 · 2.6), 저축(`AssetPage.tsx:827-845` · `SavingGoalManager.tsx:267` · `SavingGoalAddDialog.tsx:311`), 신용 한도(`AssetDetailDialog.tsx:1336`). 카드 실적은 Tailwind 원색 장미 · 호박 · 초록(70% 에서 바뀜)으로 트랙과 1.91 ~ 3.35:1, "130% 달성" 글 3.22:1(`features/card-performance/ui/CardPerformanceBar.tsx:21-53`).
- **Desk 앱** — `LinearProgressIndicator` 13곳 + 홈 손 막대 1(`dashboard/dashboard_screen.dart:1404-1430` — 의미 없음), 높이 6 · 8 · 10 · 12. 이름 없이 값 "50" 만 읽힌다. 카드 실적은 브랜드 → 성공 색(`card/card_performance_bar.dart:79-81 · 115-120`, 다크 2.51:1)으로 웹과 색 · 문턱이 다르다. 앱 업데이트 받기 막대(`update/update_gate_screen.dart:304-309` · `settings/update_screen.dart:262`)는 값 있는 원으로.
- **HR 웹** — `Progress` 래퍼가 값을 Radix 에 넘기지 않아 모든 막대가 '값 모름'으로 읽힌다(`shared/ui/shadcn/progress.tsx:10-24`). 승인률 · 오늘 근무 시간 2곳(`vacation-application/ui/VacationRequestStatsItem.tsx:131` · `dashboard/ui/widgets/TodayWorkStatus/TodayWorkStatusContent.tsx:54-60` — 초록 2.09 · 주황 2.72:1).
- 앱 적용 때 화면마다 정할 자리 — 예산 페이스(오늘 표시 2 × 18 을 얹은 막대), 할 일 완료 · 더치페이 정산 · 분할 비율 막대(`TodoPage.tsx:600` · `DutchPayPage.tsx:937` · `TxDetailDialog.tsx:720`)가 미터인지, 통계의 막대(차트라 이 막대가 아니다).
