# Alert Dialog

> 되돌릴 수 없는 일을 하기 전에 묻는 확인창 — 지우기 · 나가기처럼 둘 중 하나를 골라야 할 때(액션 둘 이하), 또는 꼭 알아야 할 일을 알릴 때(버튼 하나). 폰 · 데스크톱 모두 화면 정중앙에 같은 모양으로 뜬다. 입력 · 조회는 [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md), 여러 동작 목록은 Menu Sheet(그 차례에), 지나가는 알림은 Snackbar(그 차례에)다.

구조는 당근 [SEED Alert Dialog](https://seed-design.io/components/alert-dialog)(Apache-2.0)를 따른다 — 딤 · 확인창 · 제목 · 설명 · 버튼, 닫기 버튼 없음. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`alert-dialog.yaml`](alert-dialog.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 삭제 · 작성 중 나가기 · 그룹 삭제 — 라이트 · 다크](../../site/components/specs/alert-dialog.tsx#hero)

### 직접 골라 보기

버튼 배치(나란히 · 세로 · 하나) · 확정 버튼의 무게(Critical · Neutral) · 제목 · 글 길이 · 창 폭을 고르면 스펙대로 그린 확인창과 그 코드가 바뀐다. 실제로 열고 `Esc` 로 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/alert-dialog.tsx#playground)

## Anatomy

[그림: 확인창은 딤 · 확인창 · 제목 · 설명 · 버튼으로 — 닫기 버튼이 없다](../../site/components/specs/alert-dialog.tsx#anatomy)

| ⓐ Overlay | 딤 — 눌러도 닫히지 않는다. |
| ⓑ Container | 확인창 — 화면 정중앙, 최대 272. |
| ⓒ Title | 제목 — 묻는 말. 없어도 된다. |
| ⓓ Description | 설명 — 무엇이 어떻게 되는지 · 되돌릴 수 없다는 사실. 늘 있다. |
| ⓔ Actions | 버튼 — [취소] [확정] 을 반씩, 또는 하나. |

[표: 부위](alert-dialog.yaml#slots)

## Properties

### Layout

| 배치 | 언제 |
|---|---|
| `horizontal` *(기본)* | 버튼 둘을 나란히 반씩 — 취소 왼쪽 · 확정 오른쪽 |
| `vertical` | 한쪽 글이 반 폭을 넘을 때 — 세로로 쌓고 **확정이 위**. 레시피가 저절로 바꾼다 |
| `single` | 알리기만 할 때 — 버튼 하나, 폭 전체 |

[그림: 배치 — 나란히 · 세로 · 하나](../../site/components/specs/alert-dialog.tsx#layout)

[표: 배치](alert-dialog.yaml#layout)

### 크기 · 글

최대 272 에 좌우 32 를 남긴다(화면이 336 보다 좁으면 화면 폭 − 64). 안쪽 20 · 모서리 20, 제목 20 / 27 · 700, 설명 16 / 22 — 설명은 다른 떠 있는 표면과 달리 짙은 `fg-neutral` 이다(꼭 읽어야 할 말이다). 버튼은 1280 미만 Button medium 40, 1280 이상 small 36 이다.

[표: 공통](alert-dialog.yaml#base.enabled)

[표: 모션](alert-dialog.yaml#motion)

## Guidelines

### 되돌릴 수 없을 때만

지우기 · 작성 중 나가기 · 설정 초기화처럼 되돌릴 수 없는 일 앞에서 묻는다. 둘 중 하나를 고르는 자리다 — 동작이 셋 이상이면 Menu Sheet · Menu(그 차례에), 입력이 필요하면 [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md) 다. 확인창 안에 입력칸을 넣지 않는다.

| 이런 일 | 컴포넌트 |
|---|---|
| 되돌릴 수 없는 일의 확인 · 작성 중 나가기 | **Alert Dialog** |
| 꼭 알아야 할 일을 알리기(한 버튼) | **Alert Dialog**(`single`) |
| 입력이 필요한 확인(환불 날짜 · 잠금 해제) | [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md) |
| 동작 셋 이상 | Menu Sheet · Menu(그 차례에) |
| 지나가는 결과 알림 | Snackbar(그 차례에) |

[그림: 쓰임 — 되돌릴 수 없는 확인 · 확인창 안의 입력칸](../../site/components/specs/alert-dialog.tsx#role-guide)

### 확정 버튼 — 되돌릴 수 없으면 Critical

지우는 · 잃는 확정은 `criticalSolid`, 그 밖의 확정은 `neutralSolid`, 취소는 `neutralWeak`. Critical 은 확정에만 — 취소를 빨갛게 칠하지 않는다.

[그림: 확정 — 지우기는 Critical · 취소를 Critical 로](../../site/components/specs/alert-dialog.tsx#tone-guide)

### 닫는 길

닫기 버튼이 없다. 바깥(딤)을 눌러도 닫히지 않는다 — 고르지 않고 지나가지 못하게. `Esc` · 뒤로 가기는 취소와 같다. 버튼을 누르면 닫히고, 확정이 끝날 때까지 닫지 않으려면(서버 응답을 기다릴 때) 확정 버튼에 로딩을 건다.

[그림: 닫기 — 바깥을 눌러도 그대로 · Esc 는 취소](../../site/components/specs/alert-dialog.tsx#dismiss-guide)

### 글

- **제목** — 묻는 말("거래를 삭제할까요?"). 설명으로 충분하면 빼도 된다.
- **설명** — 무엇이 어떻게 되는지 · 되돌릴 수 없다는 사실("삭제한 거래는 되돌릴 수 없어요."). 해요체 · 마침표.
- **버튼** — 동작 이름("삭제" · "나가기" · "그룹 삭제"). "확인" · "예" 로 뭉뚱그리지 않는다. 취소는 "취소"(작성 중 나가기는 "계속 작성").
- "정말 … 하시겠습니까?" 같은 합니다체 · 겁주는 말을 쓰지 않는다.

[그림: 글 — 동작 이름 · "확인" 과 합니다체](../../site/components/specs/alert-dialog.tsx#writing-guide)

## 코드

레시피 `recipes/shadcn/components/ui/alert-dialog.tsx` 를 쓴다(Radix AlertDialog 위). 버튼 배치는 `AlertDialogFooter` 가 글 길이로 정한다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 지우기

[그림: 거래 삭제](../../site/components/specs/alert-dialog.tsx#ex-delete)

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog"

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>거래를 삭제할까요?</AlertDialogTitle>
    <AlertDialogDescription>삭제한 거래는 되돌릴 수 없어요.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction variant="criticalSolid" onClick={remove}>삭제</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 작성 중 나가기

[그림: 작성한 내용이 사라져요](../../site/components/specs/alert-dialog.tsx#ex-leave)

```tsx
<AlertDialogContent>
  <AlertDialogTitle>작성한 내용이 사라져요</AlertDialogTitle>
  <AlertDialogDescription>나가면 입력한 금액과 날짜가 저장되지 않아요.</AlertDialogDescription>
  <AlertDialogFooter>
    <AlertDialogCancel>계속 작성</AlertDialogCancel>
    <AlertDialogAction variant="criticalSolid" onClick={leave}>나가기</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기 | 200ms 로 크게 나타나며 줄어든다(1.3 → 1). 처음 초점은 확인창에 간다. |
| 버튼 | 누르면 닫힌다. 확정이 끝날 때까지 기다리려면 확정 버튼의 로딩으로 막는다. |
| `Esc` · 뒤로 가기(1280 미만) | 취소와 같다 — 닫는다. |
| 바깥(딤) 누르기 | 무시한다. |
| 닫힌 뒤 | 100ms 로 사라지고, 초점은 연 자리로 돌아간다. |
| 대화상자 · 시트 위에서 | 그 위에 뜬다(z-index L5) — 닫으면 아래 표면으로 초점이 돌아간다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 설명 `fg-neutral` 떠 있는 표면 위 16.41 · 다크 11.62 ✓. 버튼 글자는 [Button](button.md) 의 검증 |
| **WCAG 2.4.3** Focus order | 열면 확인창으로, 닫으면 연 자리로. 열린 동안 초점이 확인창 안을 돈다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 버튼 40 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 버튼은 누르는 영역을 44 까지 넓힌다(Button) ✓ |
| **ARIA** | `role="alertdialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby` — 제목이 없으면 `aria-label` 로 묻는 말을 단다 |

## Do / Don't

### ✅ Do

- 되돌릴 수 없는 일 앞에서만 — 둘 중 하나를 고르게.
- 확정은 동작 이름, 지우기는 Critical.
- 설명에 무엇이 어떻게 되는지 적는다.

### ❌ Don't

- 확인창 안에 입력칸.
- "확인" · "예" 같은 버튼 글, 합니다체.
- 취소를 Critical 로.
- 동작 셋 이상을 확인창에.
- 모양을 화면마다 바꾸기(폭 · 정렬 · 버튼 순서) — SEED 도 "임의로 수정하거나 변형" 을 막는다.

## Specification

`alert-dialog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Alert Dialog 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다.

[그림: Specification — alert-dialog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#alert-dialog)

## SEED 와 다른 점

- **1280 이상은 버튼 small 36** — Button 결정(대화상자 바닥 36)을 따랐다. 1280 미만은 SEED 와 같은 medium 40.
- **딤은 groo 0.50 · 다크 0.65**(v102) — SEED 0.455.
- **z-index 는 specs/z-index.md 의 L5**(딤 `z-alert` 300 · 확인창 `z-alert-content` 301) — 열린 대화상자 · 시트 위에 뜬다. SEED 는 모든 모달이 2 + layerIndex 라 DOM 순서에 기댄다.
- **`Esc` 는 취소** — SEED 와 같다. 옛 groo 스펙은 `Esc` 도 막았다.

## Migration notes

### 2026-10-02 — SEED Alert Dialog 로 다시 정한다

사용자가 [비교 페이지](https://claude.ai/artifact/2KE4tDQT6p5GPyhx7Y29vt)에서 정했다 — SEED 모양 · 동작(최대 272 · 모서리 20 · 제목 20 / 27 · 설명 16 / 22 짙은 글자 · 버튼 나란히(길면 세로 · 확정 위) · 바깥 무시 · `Esc` = 취소). 버튼은 Button 결정대로 1280 이상 36. 옛 Alert Dialog(420 · 폰 90% · 모서리 12 · 제목 18 / 600 · 바깥 · `Esc` 모두 막음 · 처음 초점 취소)는 걷었다 — 옛 스펙은 `alert-dialog.history/v-pre-seed-overlay.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사). 확인창 닫는 규칙이 지금 다섯 갈래다.

- **Desk 웹** — ConfirmDialog 35곳(지우기 26). 바깥 · `Esc` 모두 막고, 닫으면 초점이 body 로 떨어진다. 문구의 합니다체 15곳 · "-시-" 4곳. 환불 확인은 설명 안에 날짜 입력칸이 있다(→ Dialog).
- **Desk 앱** — 확인창 35곳이 **바깥 탭으로 닫힌다**(Flutter 기본). 열 때 초점이 어디에도 가지 않는다. 설명이 제목과 같은 색. 관심 그룹 삭제 · 할부 정리 되돌리기의 버튼이 "확인"(웹은 "그룹 삭제" · "되돌리기"). PFormAlertDialog 3곳이 확인창으로 폼을 띄운다(→ Dialog · 시트).
- **HR 웹** — AlertDialog 7곳(모두 삭제)이 **`Esc` 로 닫힌다** · 바깥은 막는다. 삭제 버튼 3.76:1, 설명 4.42:1, "정말 … 삭제하시겠습니까?" 7곳 모두.
