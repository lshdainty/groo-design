# Alert Dialog

> 되돌릴 수 없는 일을 하기 전에 묻는 확인창으로, 지우기 · 나가기처럼 둘 중 하나를 골라야 할 때(액션 둘 이하)나 꼭 알아야 할 일을 알릴 때(버튼 하나) 씁니다. 입력 · 조회는 [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md), 여러 동작 목록은 [Menu Sheet](menu-sheet.md), 지나가는 알림은 [Snackbar](snackbar.md) 를 씁니다.

폰 · 데스크톱 모두 화면 정중앙에 같은 모양으로 뜹니다. 딤 · 확인창 · 제목 · 설명 · 버튼으로 짜이고, 닫기 버튼은 없습니다.

수치 원본은 [`alert-dialog.yaml`](alert-dialog.yaml)입니다.

[그림: 거래 삭제 · 작성 중 나가기 · 그룹 삭제 — 라이트 · 다크](../../site/components/specs/alert-dialog.tsx#hero)

### 직접 골라 보기

버튼 배치(나란히 · 세로 · 하나) · 확정 버튼의 무게(Critical · Neutral) · 제목 · 글 길이 · 창 폭을 고르면 스펙대로 그린 확인창과 그 코드가 바뀝니다. 실제로 열고 `Esc` 로 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/alert-dialog.tsx#playground)

## Anatomy

[그림: 확인창은 딤 · 확인창 · 제목 · 설명 · 버튼으로 — 닫기 버튼이 없다](../../site/components/specs/alert-dialog.tsx#anatomy)

| ⓐ Overlay | 딤 — 눌러도 닫히지 않습니다. |
| ⓑ Container | 확인창 — 화면 정중앙, 최대 272. |
| ⓒ Title | 제목 — "{대상} {동작}". 없어도 됩니다. |
| ⓓ Description | 설명 — 무엇이 어떻게 되는지 · 되돌릴 수 없다는 사실. 늘 있습니다. |
| ⓔ Actions | 버튼 — [취소] [확정] 을 반씩, 또는 하나. |

[표: 부위](alert-dialog.yaml#slots)

## Properties

### Layout

| 배치 | 언제 |
|---|---|
| `horizontal` *(기본)* | 버튼 둘을 나란히 반씩 — 취소 왼쪽 · 확정 오른쪽 |
| `vertical` | 한쪽 글이 반 폭을 넘을 때 — 세로로 쌓고 **확정이 위**. 레시피가 저절로 바꾸고, 제품은 짝 버튼 부품(웹 `ResponsivePair` · 앱 `PResponsivePair`, [Button](button.md) "긴 라벨")이 가릅니다 |
| `single` | 알리기만 할 때 — 버튼 하나, 폭 전체. 고를 것이 없는 결과 알림이면 버튼 글은 "확인"(아래 "글") |

[그림: 배치 — 나란히 · 세로 · 하나](../../site/components/specs/alert-dialog.tsx#layout)

[표: 배치](alert-dialog.yaml#layout)

### 크기 · 글

최대 272 에 좌우 32 를 남깁니다(화면이 336 보다 좁으면 화면 폭 − 64). 안쪽 20 · 모서리 20, 제목 20 / 27 · 700, 설명 16 / 22 입니다. 설명은 다른 떠 있는 표면과 달리 짙은 `fg-neutral` 입니다 — 꼭 읽어야 할 말이기 때문입니다. 버튼은 1280 미만 Button medium 40, 1280 이상 small 36 입니다.

높이는 안전 영역 안 화면 높이까지입니다. 글자를 크게 쓰거나 글이 길어 넘치면 확인창 전체 — 제목 · 설명 · 버튼 — 가 한 덩어리로 스크롤됩니다(끝 흐림 없음). 그래서 큰 글자에서는 버튼이 처음에 아래에 숨을 수 있습니다 — 확인창을 끝까지 내려야 "취소 · 확정" 이 나옵니다. Dialog · Bottom Sheet(머리 · 바닥 고정, 본문만 스크롤)와 다른 틀입니다. 넘치지 않게 글을 짧게 쓰는 것이 먼저입니다(아래 "글").

[표: 공통](alert-dialog.yaml#base.enabled)

[표: 모션](alert-dialog.yaml#motion)

## Guidelines

### 되돌릴 수 없거나 꼭 알아야 할 때

확인창은 두 상황에 씁니다 — 되돌릴 수 없는 일 앞에서 묻는 **경고**, 꼭 알아야 할 결과를 알리는 **알림**(`single`). 되돌릴 수 있는 일의 "할까요?" 는 확인창으로 묻지 않습니다 — 하고 나서 [Snackbar](snackbar.md) 의 "되돌리기" 로 돌립니다. 경고는 둘 중 하나를 고르는 자리입니다 — 동작이 셋 이상이면 [Menu Sheet](menu-sheet.md) · [Menu](menu.md), 입력이 필요하면 [Dialog](dialog.md) · [Bottom Sheet](bottom-sheet.md) 를 씁니다. 확인창 안에 입력칸을 넣지 않습니다.

| | 경고 — 되돌릴 수 없는 일 | 알림 — 꼭 알아야 할 결과 |
|---|---|---|
| 예 | 통장 · 거래 삭제, 작성 중 나가기, 설정 초기화 | 하위가 남아 지울 수 없어요 · 연결이 끊겼어요 |
| 배치 | `horizontal`(길면 `vertical`) | `single` |
| 버튼 | [취소] [확정] — 확정은 동작 이름 · 지우기는 `criticalSolid` | [확인] 하나(`neutralSolid`) — 취소를 두지 않습니다 |
| 제목 · 설명 | "{대상} {동작}" + 묻는 말과 무엇이 어떻게 되는지. 이름 있는 대상은 이름으로(아래 "글") | 결과 + 이유와 다음 할 일 |
| 쓰지 않는 때 | 되돌릴 수 있는 일 — Snackbar 의 되돌리기 | 지나가는 결과 — Snackbar |

저장하기 전의 줄(가져오기 미리보기의 줄 · 아직 저장하지 않은 새 줄)을 지울 때는 확인창을 띄우지 않고 바로 지웁니다. 서버에 남은 것이 없어 잃는 것은 그 화면의 입력뿐이고, 다시 넣을 수 있기 때문입니다.

어느 떠 있는 표면을 쓸지 — 시트 · 대화상자 · 확인창 · 팝오버 · 메뉴 · 메뉴 시트 · 옆 패널을 한눈에 견준 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 한 벌입니다. 이 문서에는 고르는 순간 헷갈리는 짝 둘만 둡니다. 결과 · 상태를 알리는 다른 부품(Snackbar · Callout · Page Banner · Result Section)과 고르는 표는 [Snackbar 의 "무엇으로 알리나"](snackbar.md) 한 벌입니다.

### Dialog 와 견주기

| | [Dialog](dialog.md) | Alert Dialog |
|---|---|---|
| 쓰는 일 | 작업 · 조회 · 입력 폼 — 사용자가 내용과 오가며 일합니다 | 되돌릴 수 없는 일의 확인 · 꼭 알아야 할 알림 |
| 사용자 응답 | 고르지 않고 닫고 돌아가도 됩니다 | 고르기 전에는 못 지나갑니다 |
| 닫기 버튼 | 조회는 머리 닫기 · 입력 폼은 바닥 [취소](둘을 함께 두지 않습니다) | 없습니다 — [취소] 가 닫습니다 |
| 크기 | medium · large, 높이는 화면의 80% 까지(본문만 스크롤) | 하나(최대 272), 넘치면 확인창 전체가 스크롤 |
| 바깥(딤) · `Esc` | 조회는 둘 다 닫힘 · 입력 폼은 바깥 무시, `Esc` 는 취소 | 바깥 무시 · `Esc` 와 뒤로 가기는 취소 |
| 1280 미만 | 같은 내용이 Bottom Sheet 로 바뀐다(Responsive Dialog) | 폰에서도 가운데 그대로 |
| 버튼 | 바닥 오른쪽 small — 시트에서는 large | 반씩 나란히(길면 세로 · 확정 위), 1280 미만 medium · 이상 small |

### Menu Sheet 와 견주기

| | Alert Dialog | [Menu Sheet](menu-sheet.md) |
|---|---|---|
| 목적 | 반드시 골라야 하는 일 — 되돌릴 수 없는 동작의 확인 | 그 줄 · 화면에서 할 수 있는 동작 여럿 |
| 동작 수 | 둘 이하(취소 포함) — 알림은 하나 | 둘 이상 |
| 동작 짜임 | 둘 중 하나(삭제할까 · 나갈까) | 여럿 중 하나 |
| 설명 | 무엇이 어떻게 되는지 늘 씁니다 | 없어도 됩니다 — 줄 이름이 말합니다 |
| 자리 | 화면 정중앙 | 화면 아래(1280 이상은 트리거 옆 [Menu](menu.md)) |
| 닫는 길 | 버튼을 눌러야 닫힌다 — 바깥은 무시 | 줄 · 바깥 · 끌기 · 뒤로 가기로 닫힌다 |
| 함께 쓰기 | Menu Sheet 의 "삭제" 를 누르면 시트가 닫힌 뒤 이 확인창이 뜬다 | 위험한 줄은 맨 아래 묶음 · critical |

[그림: 쓰임 — 되돌릴 수 없는 확인 · 확인창 안의 입력칸](../../site/components/specs/alert-dialog.tsx#role-guide)

### 확정 버튼 — 되돌릴 수 없으면 Critical

지우는 · 잃는 확정은 `criticalSolid`, 그 밖의 확정은 `neutralSolid`, 취소는 `neutralWeak` 입니다. Critical 은 확정에만 쓰고, 취소를 빨갛게 칠하지 않습니다. 확정은 이 둘뿐이고 `brandSolid` 확정은 두지 않습니다 — Button 의 `brandSolid` 는 서비스 중심 동작 하나에만 쓰기 때문입니다. 확정과 보조의 중요도 차이도 확정 색으로만 가릅니다 — 확정을 위에 두고 보조를 글 버튼으로 낮추는 배치는 두지 않습니다.

[그림: 확정 — 지우기는 Critical · 취소를 Critical 로](../../site/components/specs/alert-dialog.tsx#tone-guide)

### 닫는 길

닫기 버튼이 없습니다. 바깥(딤)을 눌러도 닫히지 않습니다 — 고르지 않고 지나가지 못하게 하기 위해서입니다. `Esc` · 뒤로 가기는 취소와 같습니다. 버튼을 누르면 닫히고, 확정이 끝날 때까지 닫지 않으려면(서버 응답을 기다릴 때) 확정 버튼에 로딩을 겁니다.

[그림: 닫기 — 바깥을 눌러도 그대로 · Esc 는 취소](../../site/components/specs/alert-dialog.tsx#dismiss-guide)

### 요청이 실패하면

확정한 요청이 실패하면 **확인창을 닫고** critical [Snackbar](snackbar.md) 로 알립니다. [다시 시도] 는 다시 하면 될 수 있는 실패 — 서버 오류(5xx) · 네트워크(요청이 닿지 않음)에만 답니다. [다시 시도] 는 다시 묻지 않고 같은 요청을 바로 합니다 — 사용자는 이미 확인했기 때문입니다. 스낵바는 시트 · 확인창 위에 뜨므로 시트가 열려 있어도 같습니다. 뒤에 시트가 닫혀도 [다시 시도] 는 그대로 동작해야 합니다. 서버 글을 쓰지 않습니다.

- **사유가 있는 거절(4xx — 권한 없음 · 이미 처리됨 · 상태가 바뀜)** — 사유를 우리 글로 한 문장 알리고 [다시 시도] 를 두지 않습니다. 다시 해도 같은 답이기 때문입니다.
- **응답을 받지 못함(요청은 나갔는데 결과를 모름)** — [다시 시도] 를 두지 않고 목록을 다시 받습니다(두 번 들어가지 않게). 글은 Snackbar 의 "…됐는지 확인하지 못했어요." 입니다.

**예외** — 뒤에 폼이 열려 있어 고쳐서 다시 저장하는 흐름(닫힌 회차 저장 확인 · 고쳐 쓰기 확인)은 폼 저장 실패입니다. 확인창을 닫고 폼 맨 위 [Callout](callout.md) 으로 알립니다.

### 글

- **제목** — 경고는 "{대상} {동작}"("메모 삭제"), 알림은 결과("카테고리를 지울 수 없어요")를 씁니다. 설명으로 충분하면 빼도 됩니다.
- **설명** — 무엇이 어떻게 되는지 · 되돌릴 수 없다는 사실("삭제한 거래는 되돌릴 수 없어요."). 알림은 이유와 다음 할 일을 씁니다. 해요체 · 마침표.
- **대상은 이름으로** — 이름 있는 대상은 확인창에서 이름으로 짚습니다 — 제목이든 설명이든. 설명 첫 문장에 큰따옴표로 씁니다 — `"여행 적금" 메모를 삭제할까요? 삭제한 메모는 되돌릴 수 없어요.` 이름 없는 대상(거래 한 건)은 무엇인지 알 만큼 — 날짜 · 금액을 씁니다. 목록에서 엉뚱한 줄을 눌렀으면 알아챌 곳이 확인창뿐이기 때문입니다. 같은 동작은 어디서 불러도(상세 · ⋮ · 스와이프) 같은 글입니다.
- **버튼** — 고르는 확인창(경고)은 동작 이름("삭제" · "나가기" · "그룹 삭제")을 씁니다 — "확인" · "예" 로 뭉뚱그리지 않습니다. 취소는 "취소"(작성 중 나가기는 "계속 작성")입니다. 고를 것이 없는 결과 알림(`single`)의 버튼은 "확인" 하나입니다 — 누르면 닫히기만 해서 지어낼 동작 이름이 없기 때문입니다. 버튼이 일을 하면("다시 저장") 그 동작 이름입니다.
- "정말 … 하시겠습니까?" 같은 합니다체 · 겁주는 말을 쓰지 않습니다.

[그림: 글 — 동작 이름 · "확인" 과 합니다체](../../site/components/specs/alert-dialog.tsx#writing-guide)

## 코드

레시피 `recipes/shadcn/components/ui/alert-dialog.tsx` 를 씁니다(Radix AlertDialog 위). 버튼 배치는 `AlertDialogFooter` 가 글 길이로 정합니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 지우기

[그림: 거래 삭제](../../site/components/specs/alert-dialog.tsx#ex-delete)

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog"

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogTitle>거래 삭제</AlertDialogTitle>
    {/* 이름 없는 대상은 무엇인지 알 만큼 — 날짜 · 금액 */}
    <AlertDialogDescription>{tx.dateLabel} {tx.title} {formatWon(tx.amount)} 거래를 지워요. 삭제한 거래는 되돌릴 수 없어요.</AlertDialogDescription>
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
| 열기 | 200ms 로 크게 나타나며 줄어듭니다(1.3 → 1). 처음 초점은 확인창에 갑니다. |
| 버튼 | 누르면 닫힙니다. 확정이 끝날 때까지 기다리려면 확정 버튼의 로딩으로 막습니다. |
| `Esc` · 뒤로 가기(1280 미만) | 취소와 같습니다 — 닫습니다. |
| 바깥(딤) 누르기 | 무시합니다. |
| 닫힌 뒤 | 100ms 로 사라지고, 초점은 연 자리로 돌아갑니다. 연 자리가 사라졌으면(⋮ 메뉴의 항목 · 지운 줄) 그 줄 → 목록 머리(목록 제목 · 표 머리) → `main` 순으로 남아 있는 첫 곳에 둡니다 — 초점이 문서 맨 앞(`body`)으로 빠지지 않게 하기 위해서입니다. |
| 글자 크기 설정 | 제목 · 설명 · 버튼 글이 커집니다. 폭(최대 272)은 그대로이고 줄을 바꿔 높이가 늘어나며, 화면 높이를 넘으면 확인창 전체가 스크롤됩니다. 버튼 라벨은 한 줄을 지키고, 반 폭을 넘으면 버튼을 세로로 쌓습니다 |
| 대화상자 · 시트 위에서 | 그 위에 뜹니다(z-index L5). 닫으면 아래 표면으로 초점이 돌아갑니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 · 설명 `fg-neutral` 떠 있는 표면 위 16.41 · 다크 11.62 ✓. 버튼 글자는 [Button](button.md) 의 검증 |
| **WCAG 1.4.4** Resize text | 제목 · 설명 · 버튼 글이 글자 크기 설정을 따라 커지고, 폭은 그대로 둔 채 높이가 늘어납니다 — 넘치면 확인창 전체가 스크롤되어 글이 잘리지 않습니다 ✓ |
| **WCAG 2.4.3** Focus order | 열면 확인창으로, 닫으면 연 자리로 갑니다. 열린 동안 초점이 확인창 안을 돕니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 버튼 40 · 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 버튼은 누르는 영역을 44 까지 넓힙니다(Button) ✓ |
| **ARIA** | `role="alertdialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`. 제목이 없으면 `aria-label` 로 묻는 말을 답니다 |

## Do / Don't

### ✅ Do

- 되돌릴 수 없는 일 앞에서(경고) · 꼭 알아야 할 결과를 알릴 때(알림)만 씁니다. 경고는 둘 중 하나를 고르게 합니다.
- 확정은 동작 이름, 지우기는 Critical 입니다. 고를 것이 없는 알림은 [확인] 하나입니다.
- 설명에 무엇이 어떻게 되는지 적고, 대상을 이름으로 짚습니다. 같은 동작은 어디서 불러도 같은 글입니다.
- 줄의 동작이 여럿이면 Menu Sheet · Menu 를 쓰고, 그중 지우기는 시트를 닫은 뒤 확인창을 띄웁니다.

### ❌ Don't

- 확인창 안에 입력칸을 넣지 않습니다.
- 고르는 확인창에 "확인" · "예" 같은 버튼 글이나 합니다체를 쓰지 않습니다.
- 되돌릴 수 있는 일을 확인창으로 묻지 않습니다(Snackbar 의 되돌리기).
- 확정에 Brand 를 쓰거나, 보조를 글 버튼으로 낮추는 배치를 두지 않습니다.
- 취소를 Critical 로 칠하지 않습니다.
- 동작 셋 이상을 확인창에 두지 않습니다.
- 모양(폭 · 정렬 · 버튼 순서)을 화면마다 바꾸지 않습니다.

## Specification

`alert-dialog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다. 웹 · 앱이 Alert Dialog 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다.

[그림: Specification — alert-dialog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#alert-dialog)
