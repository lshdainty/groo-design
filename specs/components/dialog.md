# Dialog

> 1280 이상에서 화면 정중앙에 뜨는 대화상자입니다. 입력 폼 · 상세처럼 지금 화면을 떠나지 않고 할 일을 띄우며, 같은 내용을 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 띄웁니다(폭에 따라 한 부품이 모양을 바꿉니다 — Responsive Dialog). 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 트리거에 붙는 짧은 내용은 [Popover](popover.md), 화면 높이를 넘는 긴 내용은 페이지로 둡니다.

딤 · 대화상자 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥으로 이루어지고, 본문만 스크롤됩니다.

수치 원본은 [`dialog.yaml`](dialog.yaml)입니다.

[그림: 휴가 신청 · 거래 상세 — 라이트 · 다크](../../site/components/specs/dialog.tsx#hero)

### 직접 골라 보기

크기 · 쓰임(입력 폼 · 조회) · 설명 · 본문 길이 · 창 폭(1280 위 · 아래)을 고르면 스펙대로 그린 대화상자(1280 미만이면 시트)와 그 코드가 바뀝니다. 실제로 열고 닫고 본문을 스크롤할 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/dialog.tsx#playground)

## Anatomy

[그림: 대화상자는 딤 · 대화상자 · 머리 · 본문 · 바닥으로, 넘칠 수 있는 본문은 끝이 늘 흐리고 스크롤하면 머리 아래 선이 생깁니다](../../site/components/specs/dialog.tsx#anatomy)

| ⓐ Overlay | 딤 — 대화상자 뒤 화면 전체입니다. 조회 대화상자는 누르면 닫힙니다(입력 폼은 무시합니다). |
| ⓑ Container | 대화상자 — 화면 정중앙, medium 480 · large 800, 높이는 화면의 80% 까지입니다. |
| ⓒ Header | 머리 — 제목 · 설명입니다. 조회 · 안내 대화상자만 오른쪽에 닫기 버튼을 둡니다. 두 단계 흐름의 2단계는 왼쪽에 ←(아래 "두 단계 흐름의 머리 ←"), 동작이 여럿인 상세는 닫기 왼쪽에 ⋮ 하나(아래 "머리 오른쪽 동작")를 둡니다. |
| ⓓ Body | 본문 — 넘치면 이 안에서만 스크롤합니다(머리 · 바닥은 그대로). 넘칠 수 있는 본문은 끝을 흐립니다([Scroll Fog](scroll-fog.md)). |
| ⓔ Footer | 바닥 — 버튼, 오른쪽 정렬입니다. |

[표: 부위](dialog.yaml#slots)

## Properties

### Size

`medium` 480 *(기본)* 은 일반 입력 폼 · 상세에, `large` 800 은 복잡한 설정 · 많은 조회에 씁니다. 높이는 내용만큼이고 화면 높이의 80% 를 넘지 않습니다. 넘치는 만큼 본문이 스크롤됩니다.

[그림: 크기 — medium 480 · large 800](../../site/components/specs/dialog.tsx#size)

[표: 크기](dialog.yaml#size)

### 머리 · 본문 · 바닥

머리는 위 24 · 좌우 24 · 아래 16, 제목 22 / 30 · 700 · 설명 16 / 22 · 사이 6 입니다. 본문은 좌우 24 입니다. 바닥은 위 16 · 좌우 24 · 아래 24 에 버튼을 오른쪽으로 모읍니다 — Button small 36, [취소] [저장] 순서입니다. 위로 스크롤하면 머리 아래 1px 선이 생깁니다.

딤은 `overlay-dim-light`(0.50) · 다크 `overlay-dim-dark`(0.65)이고, 대화상자는 그림자 없이 딤과 표면 색으로 뜹니다. 딤과 대화상자는 [z-index](../z-index.md) 의 L2(딤 `z-modal` 100 · 대화상자 `z-modal-content` 101)에 놓여, 그 안에서 연 Popover(L3) · Alert Dialog(L5)가 위에 뜹니다.

[표: 공통](dialog.yaml#base.enabled)

### 본문 끝 흐림

목록 · 긴 폼처럼 넘칠 수 있는 본문은 [Scroll Fog](scroll-fog.md) 를 겁니다(`scrollFog`). 위 20 · 아래 80 이 늘 흐리고, 본문 안에 그만큼 여백을 둬 끝까지 내리면 흐림이 빈 여백 위에 놓입니다. 넘쳤는지 재서 켜고 끄지 않습니다 — 걸 본문인지는 내용의 종류로 정하고, 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않습니다. 1280 미만의 시트에서도 같습니다([Bottom Sheet](bottom-sheet.md)).

[그림: 본문 스크롤 — 늘 켜진 끝 흐림(위 20 · 아래 80) · 머리 아래 선](../../site/components/specs/dialog.tsx#scroll)

[표: 본문 끝 흐림](dialog.yaml#scrollFog)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 — 딤 위 대화상자 |
| `scrolled` | 본문이 위로 스크롤됨 — 머리 아래 1px `stroke-neutral-subtle` |
| `pressed` | 닫기 버튼 — `bg-layer-floating-pressed` + 2px 거리 축소 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |

[표: 상태](dialog.yaml#matrix)

[표: 모션](dialog.yaml#motion)

## Guidelines

### 한 부품이 폭으로 바뀝니다

폼 · 상세는 한 부품(`ResponsiveDialog`)으로 짭니다 — 1280 이상에서 Dialog, 미만에서 [Bottom Sheet](bottom-sheet.md) 입니다. 머리 · 본문 · 바닥은 같고, 닫는 자리만 표면에 맞춰 바뀝니다(아래 "닫기 버튼과 취소"). 경계는 [Input Button](input-button.md) 과 같은 1280 이라, 대화상자 안의 날짜 칸은 늘 팝오버로, 시트 안의 날짜 칸은 늘 시트로 열립니다 — 표면이 엇갈려 겹치지 않습니다.

[그림: 같은 폼 — 1280 이상 대화상자 · 미만 시트](../../site/components/specs/dialog.tsx#responsive-guide)

### 입력 폼은 실수로 닫히지 않게

입력 폼 대화상자는 바깥(딤)을 눌러도 닫히지 않습니다. 바닥 [취소] · `Esc` 로 닫고(1280 미만의 시트는 뒤로 가기로도), 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻습니다([Field](field.md) 의 규칙). 조회 · 안내 대화상자는 바깥 누르기 · `Esc` 로 닫힙니다.

저장 중에는 닫히지 않습니다 — 바닥 [저장] 이 로딩인 동안은 [취소] · `Esc` · 바깥 · 머리 ← 를 무시합니다(시트와 같은 규칙 — [Bottom Sheet](bottom-sheet.md) 의 "입력 폼은 실수로 닫히지 않게"). 쓰기 실패는 폼 맨 위 [Callout](callout.md) 이라 그 자리가 남아 있어야 하기 때문입니다. 두 단계 흐름의 초점 · 끝난 뒤 · 한 번만 보이는 비밀도 시트와 같습니다.

[그림: 닫기 — 입력 폼은 바깥을 눌러도 닫히지 않습니다](../../site/components/specs/dialog.tsx#dismiss-guide)

### 닫기 버튼과 취소 — 하나만

| 대화상자 | 닫는 자리 |
|---|---|
| 입력 폼(저장 · 신청처럼 주 작업이 있다) | 바닥 [취소] [저장] — 머리 닫기 버튼 없음 |
| 조회 · 안내 | 머리 닫기 버튼 — 바닥 버튼은 다른 동작(수정 · 삭제)이 있을 때만 |

닫기 버튼과 바닥 취소를 함께 두지 않습니다. 1280 미만의 시트에서는 입력 폼도 위 닫기 버튼 + 바닥 [저장] 입니다([Bottom Sheet](bottom-sheet.md)).

[그림: 닫는 자리 — 폼은 바닥 취소 · 조회는 머리 닫기 · 둘을 함께](../../site/components/specs/dialog.tsx#close-guide)

### 머리 없는 조회 — 공지 팝업

저절로 뜨는 조회 대화상자(그루 이음의 로그인 뒤 공지 팝업)는 "조회는 머리 닫기" 의 예외입니다. 1280 이상 `medium` 480 · 미만 [Bottom Sheet](bottom-sheet.md)(`ResponsiveDialog`)입니다.

- **머리가 없습니다** — 대화상자는 제목을 본문 맨 위에 둡니다(제목 = 공지 제목, `t8` 700). 시트는 머리가 늘 제목이라 공지 제목이 머리입니다. 이름은 대화상자면 `aria-label`, 시트면 머리 제목입니다.
- **머리 닫기 버튼이 없습니다** — 바닥 [오늘은 그만 보기](`neutralWeak`) · [닫기](`neutralSolid`)가 닫습니다. 바깥 · `Esc` · 끌어내리기는 [닫기] 와 같습니다(이번에만 닫습니다).
- **여럿이면 한 창에서 넘깁니다** — 공지가 둘 이상이면 ‹ n / N › 넘김 줄(Button `ghost` · `medium` · `iconOnly` 둘 + 가운데 "n / N" — `aria-live="polite"`)을 둡니다. 대화상자는 바닥 왼쪽, 시트는 바닥 버튼 위 가운데입니다. 첫 · 끝에서는 그쪽 버튼이 막힙니다. 넘기면 본문은 맨 위로 갑니다.
- 못 불러오면 띄우지 않습니다 — 직접 연 것이 아니라 실패를 알리지 않습니다(실패는 공지 화면이 알립니다).

### 두 단계 흐름의 머리 ←

한 부품 안에서 1단계(종류 고르기) → 2단계(폼)로 가는 흐름은 1280 이상의 대화상자에서도 2단계 머리 왼쪽에 ← 를 답니다. 시트와 같은 부품(`onBack`) · 같은 값(보이는 원 40 · 아이콘 24 꺾쇠 `chevron-left` — 페이지 머리 ← 와 같은 모양 · 누르는 영역 44 · 아이콘이 왼쪽 24 · 제목은 원 오른쪽 4 에서 · 제목 첫 줄 가운데)입니다. 수치 원본은 [`bottom-sheet.yaml`](bottom-sheet.yaml) 의 축 `back` 하나입니다. ← 는 1단계로 한 단계 되돌리고, 쓴 값이 있으면 "작성한 내용이 사라져요" 를 묻고 돌아가며 그 값을 버립니다. 입력 폼 대화상자라 머리 닫기 버튼은 없고 바닥 [취소] 가 닫습니다 — ← 는 닫지 않습니다. 규칙 전문은 [Bottom Sheet](bottom-sheet.md) 의 "두 단계 시트의 머리 ←" 에 있습니다.

### 머리 오른쪽 동작 — ⋮ 하나

들어간 상세에서 그 항목의 동작이 여럿이면 머리 오른쪽에 ⋮ 하나를 둡니다(`headerAction`). 시트와 같은 부품 · 같은 규칙입니다([Bottom Sheet](bottom-sheet.md) 의 "머리 오른쪽 동작"). 누르면 [Menu](menu.md) 가 열립니다. 자리는 닫기 버튼 왼쪽 사이 4 이고, 닫기가 없는 입력 폼은 오른쪽 끝입니다. 단추는 Button `ghost` 아이콘만(보이는 36 · 누르는 44), 이름 "{항목 이름} 더보기", 세로는 제목 첫 줄 가운데(닫기 아이콘과 같습니다)입니다. 제목 · 설명은 단추 자리를 비운 남은 폭에서 줄을 바꿉니다. 초점 차례는 제목 → 동작 → 닫기이고, 머리 동작은 하나만 둡니다(웹 `DialogContent.headerAction`).

[표: 머리 오른쪽 동작](dialog.yaml#headerAction)

### Alert Dialog 와 견주기

어느 떠 있는 표면을 쓸지 일곱을 한눈에 견준 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 에 있습니다.

| | Dialog | [Alert Dialog](alert-dialog.md) |
|---|---|---|
| 쓰는 일 | 작업 · 조회 · 입력 폼 — 내용과 오가며 일합니다 | 되돌릴 수 없는 일의 확인 · 꼭 알아야 할 알림 |
| 사용자 응답 | 고르지 않고 닫고 돌아가도 됩니다 | 고르기 전에는 못 지나갑니다 |
| 닫기 버튼 | 조회는 머리 닫기 · 입력 폼은 바닥 [취소](둘을 함께 두지 않습니다) | 없습니다 — [취소] 가 닫습니다 |
| 크기 | medium · large, 높이는 화면의 80% 까지(본문만 스크롤) | 하나(최대 272), 넘치면 확인창 전체가 스크롤 |
| 바깥(딤) · `Esc` | 조회는 둘 다 닫힘 · 입력 폼은 바깥 무시, `Esc` 는 취소 | 바깥 무시 · `Esc` 와 뒤로 가기는 취소 |
| 1280 미만 | 같은 내용이 Bottom Sheet 로 바뀝니다(Responsive Dialog) | 폰에서도 가운데 그대로 |
| 버튼 | 바닥 오른쪽 small — 시트에서는 large | 반씩 나란히(길면 세로 · 확정 위), 1280 미만 medium · 이상 small |

### 대화상자에 두지 않는 것

- 되돌릴 수 없는 확인 → [Alert Dialog](alert-dialog.md).
- 트리거에 붙는 짧은 내용(안내 · 고르기 패널) → [Popover](popover.md).
- 화면 높이를 넘는 긴 내용 · 단계가 많은 일 → 페이지.
- 대화상자 위에 대화상자 — 겹쳐도 되는 건 그 안에서 연 Alert Dialog · Popover 뿐입니다.

### 글

제목은 하는 일입니다 — "휴가 신청" · "거래 상세". 설명은 덧붙일 말이 있을 때만 한 문장(해요체 · 마침표)으로 씁니다. 바닥 버튼은 동작 이름("신청" · "저장")이고, "확인" 으로 뭉뚱그리지 않습니다.

## 코드

레시피 `recipes/shadcn/components/ui/dialog.tsx` 를 씁니다(Radix Dialog 위). 폼 · 상세는 `ResponsiveDialog` 입니다 — 1280 에서 Dialog 와 Bottom Sheet 를 바꾸고, `form` 이면 닫는 자리도 표면에 맞춰 바꿉니다(대화상자는 바닥 취소, 시트는 위 닫기). `form` 이 아니면(조회 · 안내) 두 표면 모두 위 닫기 버튼입니다. 본문에 [List](list.md) 를 바로 두면 줄이 제 좌우 여백(24)을 가지므로 본문 좌우 여백을 뺍니다(`className="px-0"`). 넘칠 수 있는 본문은 `scrollFog` 를 줍니다(위 20 · 아래 80 끝 흐림 — [Scroll Fog](scroll-fog.md)). 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 입력 폼

[그림: 휴가 신청](../../site/components/specs/dialog.tsx#ex-form)

```tsx
import { Button } from "@/components/ui/button"
import { ResponsiveDialog, ResponsiveDialogBody, ResponsiveDialogCancel, ResponsiveDialogContent, ResponsiveDialogFooter } from "@/components/ui/dialog"

{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다. dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}
<ResponsiveDialog open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <ResponsiveDialogContent title="휴가 신청" description="승인되면 알려드려요.">
    <ResponsiveDialogBody>
      <Field label="휴가 종류">…</Field>
      <Field label="기간">…</Field>
    </ResponsiveDialogBody>
    <ResponsiveDialogFooter>
      {/* 1280 이상에서만 그린다 — 시트에서는 위 닫기 버튼이 맡는다 */}
      <ResponsiveDialogCancel>취소</ResponsiveDialogCancel>
      <Button onClick={submit}>신청</Button>
    </ResponsiveDialogFooter>
  </ResponsiveDialogContent>
</ResponsiveDialog>
```

### 조회

[그림: 거래 상세](../../site/components/specs/dialog.tsx#ex-view)

```tsx
{/* 조회 — 머리 닫기 버튼(시트에서는 오른쪽 위 원), 바깥 누르기로도 닫힌다. 길이가 데이터에 따라 느는 본문이라 scrollFog */}
<ResponsiveDialog open={open} onOpenChange={setOpen}>
  <ResponsiveDialogContent title="거래 상세">
    <ResponsiveDialogBody scrollFog className="px-0">
      <List>…</List>
    </ResponsiveDialogBody>
  </ResponsiveDialogContent>
</ResponsiveDialog>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기 | 200ms 로 크게 나타나며 줄어듭니다(1.3 → 1). 처음 초점은 대화상자에 갑니다. |
| 바닥 취소 · 닫기 버튼 · `Esc` | 닫습니다. 입력 폼에 바뀐 값이 있으면 먼저 묻습니다. 뒤로 가기로 닫는 것은 1280 미만(시트)뿐입니다 — 데스크톱 브라우저의 뒤로 가기는 페이지를 떠나기 때문입니다. |
| 바깥(딤) 누르기 | 조회 · 안내는 닫습니다. **입력 폼은 무시합니다.** |
| 머리 ⋮ 누르기 | 그 항목의 동작 목록 [Menu](menu.md) 를 엽니다(대화상자 위 L3). |
| 머리 ← 누르기 | 두 단계 흐름의 2단계 — 같은 대화상자 안에서 1단계로 한 단계 되돌립니다(닫지 않습니다). 쓴 값이 있으면 먼저 "작성한 내용이 사라져요" 를 묻고, 돌아가면 그 값을 버립니다. |
| 본문 스크롤 | 본문만 스크롤합니다 — 위로 스크롤되면 머리 아래 선이 생깁니다. 끝 흐림(`scrollFog`)은 걸었으면 늘 그대로입니다. |
| 닫힌 뒤 | 100ms 로 사라지고, 초점은 연 자리(트리거)로 돌아갑니다. |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠급니다. 초점은 대화상자 안을 돕니다. |
| 글자 크기 설정 | 제목 · 설명 · 본문 · 바닥 버튼 글은 글자 크기 설정을 따라 커지고 줄을 바꿉니다. 폭은 그대로이고 머리가 늘어나며, 넘치는 본문은 본문 안에서 스크롤합니다. 닫기 · ⋮ · ← 는 크기를 그대로 두고 제목 첫 줄 가운데에 섭니다. |
| 창 폭이 1280 을 넘나듦 | 열린 채 표면이 바뀝니다(대화상자 ↔ 시트). 값은 폼(부모)이 들고 있어 그대로입니다 — 입력칸의 값을 대화상자 · 시트 안에만 두지 않습니다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 아이콘 `fg-neutral-subtle` 5.50 · 5.27 ✓. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 2.4.3** Focus order | 열면 대화상자로, 닫으면 연 자리로 초점이 갑니다. 열린 동안 초점이 뒤 화면으로 나가지 않습니다 |
| **WCAG 1.4.4** Resize text | 제목 · 설명 · 본문 · 바닥 버튼 글이 글자 크기 설정을 따라 커집니다 — 폭은 그대로 두고 줄을 바꿔 머리가 늘어나고, 높이가 화면의 80% 를 넘으면 본문이 스크롤됩니다 ✓. 닫기 · ⋮ · ← 아이콘은 글이 아니라 크기를 그대로 둡니다 |
| **WCAG 1.4.10** Reflow | 1280 미만은 시트로 바뀌고, 대화상자 높이는 화면의 80% 까지입니다 — 넘치면 본문이 스크롤됩니다(머리 · 바닥이 화면 밖으로 나가지 않습니다) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 52 · 머리 ⋮ 36 · 바닥 버튼 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼 52 ✓ · 머리 ⋮ · 바닥 버튼은 누르는 영역을 44 까지 넓힙니다(Button) ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`(있을 때만), 닫기 버튼 이름 "닫기", 머리 ← 이름 "뒤로"(초점 차례 맨 앞), 머리 ⋮ 이름 "{항목 이름} 더보기"(제목 → 동작 → 닫기) |

## Do / Don't

### ✅ Do

- 폼 · 상세는 한 부품으로 짭니다 — 1280 이상 대화상자, 미만 시트.
- 입력 폼은 바닥 [취소] [저장], 조회는 머리 닫기 버튼으로 닫습니다.
- 입력 폼은 바깥 누르기로 닫지 않고, 바뀐 값이 있으면 닫기 전에 묻습니다.
- 긴 내용은 본문만 스크롤합니다 — 머리 · 바닥은 늘 보입니다.
- 두 단계 흐름의 2단계는 머리 왼쪽 ← 로 1단계에 돌아갑니다(시트와 같은 값).

### ❌ Don't

- 머리 닫기 버튼과 바닥 취소를 함께 두지 않습니다.
- 되돌릴 수 없는 확인을 Dialog 로 띄우지 않습니다(Alert Dialog).
- 높이 상한 없이 내용을 늘려 제목 · 버튼이 화면 밖으로 나가게 하지 않습니다.
- 대화상자 위에 대화상자를 띄우지 않습니다 — 단계가 많으면 페이지 · 단계로 나눕니다.

## Specification

`dialog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Dialog 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다. 1280 미만의 모습은 [Bottom Sheet](bottom-sheet.md) 의 Specification 입니다.

[그림: Specification — dialog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#dialog)
