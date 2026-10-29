# Dialog

> 1280 이상에서 화면 정중앙에 뜨는 대화상자. 입력 폼 · 상세처럼 지금 화면을 떠나지 않고 할 일을 띄운다 — 같은 내용을 1280 미만에서는 [Bottom Sheet](bottom-sheet.md) 로 띄운다(한 부품이 폭으로 바꾼다 — Responsive Dialog). 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 트리거에 붙는 짧은 내용은 [Popover](popover.md), 화면 높이를 넘는 긴 내용은 페이지다.

구조는 당근 [SEED Dialog](https://seed-design.io/components/dialog) · Responsive Dialog(Apache-2.0)를 따른다 — 딤 · 대화상자 · 머리(제목 · 설명 · 닫기) · 본문 · 바닥, 본문만 스크롤. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`dialog.yaml`](dialog.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 휴가 신청 · 거래 상세 — 라이트 · 다크](../../site/components/specs/dialog.tsx#hero)

### 직접 골라 보기

크기 · 쓰임(입력 폼 · 조회) · 설명 · 본문 길이 · 창 폭(1280 위 · 아래)을 고르면 스펙대로 그린 대화상자(1280 미만이면 시트)와 그 코드가 바뀐다. 실제로 열고 닫고 본문을 스크롤할 수 있다.

[그림: 플레이그라운드](../../site/components/specs/dialog.tsx#playground)

## Anatomy

[그림: 대화상자는 딤 · 대화상자 · 머리 · 본문 · 바닥으로, 넘칠 수 있는 본문은 끝이 늘 흐리고 스크롤하면 머리 아래 선이 생긴다](../../site/components/specs/dialog.tsx#anatomy)

| ⓐ Overlay | 딤 — 대화상자 뒤 화면 전체. 조회 대화상자는 누르면 닫힌다(입력 폼은 무시). |
| ⓑ Container | 대화상자 — 화면 정중앙, medium 480 · large 800, 높이는 화면의 80% 까지. |
| ⓒ Header | 머리 — 제목 · 설명. 조회 · 안내 대화상자만 오른쪽에 닫기 버튼. 두 단계 흐름의 2단계는 왼쪽에 ←(아래 "두 단계 흐름의 머리 ←"). |
| ⓓ Body | 본문 — 넘치면 이 안에서만 스크롤한다(머리 · 바닥은 그대로). 넘칠 수 있는 본문은 끝을 흐린다([Scroll Fog](scroll-fog.md)). |
| ⓔ Footer | 바닥 — 버튼, 오른쪽 정렬. |

[표: 부위](dialog.yaml#slots)

## Properties

### Size

`medium` 480 *(기본)* — 일반 입력 폼 · 상세, `large` 800 — 복잡한 설정 · 많은 조회. 높이는 내용만큼이고 화면 높이의 80% 를 넘지 않는다. 넘치는 만큼 본문이 스크롤된다.

[그림: 크기 — medium 480 · large 800](../../site/components/specs/dialog.tsx#size)

[표: 크기](dialog.yaml#size)

### 머리 · 본문 · 바닥

머리는 위 24 · 좌우 24 · 아래 16, 제목 22 / 30 · 700 · 설명 16 / 22 · 사이 6. 본문은 좌우 24. 바닥은 위 16 · 좌우 24 · 아래 24 에 버튼을 오른쪽으로 모은다 — Button small 36, [취소] [저장] 순서. 위로 스크롤하면 머리 아래 1px 선이 생긴다.

[표: 공통](dialog.yaml#base.enabled)

### 본문 끝 흐림

목록 · 긴 폼처럼 넘칠 수 있는 본문은 [Scroll Fog](scroll-fog.md) 를 건다(`scrollFog`) — 위 20 · 아래 80 이 늘 흐리고, 본문 안에 그만큼 여백을 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다. 넘쳤는지 재서 켜고 끄지 않는다 — 걸 본문인지는 내용의 종류로 정하고, 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않는다. 1280 미만의 시트에서도 같다([Bottom Sheet](bottom-sheet.md)).

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

### 한 부품이 폭으로 바뀐다

폼 · 상세는 한 부품(`ResponsiveDialog`)으로 짠다 — 1280 이상에서 Dialog, 미만에서 [Bottom Sheet](bottom-sheet.md) 다. 머리 · 본문 · 바닥은 같고, 닫는 자리만 표면에 맞춰 바뀐다(아래 "닫기 버튼과 취소"). 경계는 [Input Button](input-button.md) 과 같은 1280 이라, 대화상자 안의 날짜 칸은 늘 팝오버로, 시트 안의 날짜 칸은 늘 시트로 열린다 — 표면이 엇갈려 겹치지 않는다.

[그림: 같은 폼 — 1280 이상 대화상자 · 미만 시트](../../site/components/specs/dialog.tsx#responsive-guide)

### 입력 폼은 실수로 닫히지 않게

입력 폼 대화상자는 바깥(딤)을 눌러도 닫히지 않는다. 바닥 [취소] · `Esc` 로 닫고(1280 미만의 시트는 뒤로 가기로도), 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다([Field](field.md) 의 규칙). 조회 · 안내 대화상자는 바깥 누르기 · `Esc` 로 닫힌다.

[그림: 닫기 — 입력 폼은 바깥을 눌러도 닫히지 않는다](../../site/components/specs/dialog.tsx#dismiss-guide)

### 닫기 버튼과 취소 — 하나만

| 대화상자 | 닫는 자리 |
|---|---|
| 입력 폼(저장 · 신청처럼 주 작업이 있다) | 바닥 [취소] [저장] — 머리 닫기 버튼 없음 |
| 조회 · 안내 | 머리 닫기 버튼 — 바닥 버튼은 다른 동작(수정 · 삭제)이 있을 때만 |

닫기 버튼과 바닥 취소를 함께 두지 않는다. 1280 미만의 시트에서는 입력 폼도 위 닫기 버튼 + 바닥 [저장] 이다([Bottom Sheet](bottom-sheet.md)).

[그림: 닫는 자리 — 폼은 바닥 취소 · 조회는 머리 닫기 · 둘을 함께](../../site/components/specs/dialog.tsx#close-guide)

### 두 단계 흐름의 머리 ←

한 부품 안에서 1단계(종류 고르기) → 2단계(폼)로 가는 흐름은 1280 이상의 대화상자에서도 2단계 머리 왼쪽에 ← 를 단다 — 시트와 같은 부품(`onBack`) · 같은 값(보이는 원 40 · 아이콘 24 · 누르는 영역 44 · 아이콘이 왼쪽 24 · 제목은 원 오른쪽 4 에서 · 제목 첫 줄 가운데)이다. 수치 원본은 [`bottom-sheet.yaml`](bottom-sheet.yaml) 의 축 `back` 하나다. ← 는 1단계로 한 단계 되돌리고, 쓴 값이 있으면 "작성한 내용이 사라져요" 를 묻고 돌아가며 그 값을 버린다. 입력 폼 대화상자라 머리 닫기 버튼은 없고 바닥 [취소] 가 닫는다 — ← 는 닫지 않는다. 규칙 전문은 [Bottom Sheet](bottom-sheet.md) 의 "두 단계 시트의 머리 ←"(2026-10-29 사용자 결정 17-1 Q3).

### Alert Dialog 와 견주기

SEED Dialog 문서의 비교 표 네 줄(쓰는 일 · 사용자 응답 · 닫기 버튼 · 크기)에 groo 에서 갈리는 세 줄을 더했다(2026-10-22 사용자 결정 1C — https://claude.ai/artifact/YRPbWzhgD4EDdKsVioU8Zj). 어느 떠 있는 표면을 쓸지 일곱을 한눈에 견준 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 한 벌이다(3C).

| | Dialog | [Alert Dialog](alert-dialog.md) |
|---|---|---|
| 쓰는 일 | 작업 · 조회 · 입력 폼 — 사용자가 내용과 오가며 일한다 | 되돌릴 수 없는 일의 확인 · 꼭 알아야 할 알림 |
| 사용자 응답 | 고르지 않고 닫고 돌아가도 된다 | 고르기 전에는 못 지나간다 |
| 닫기 버튼 | 조회는 머리 닫기 · 입력 폼은 바닥 [취소](둘을 함께 두지 않는다) | 없다 — [취소] 가 닫는다 |
| 크기 | medium · large, 높이는 화면의 80% 까지(본문만 스크롤) | 하나(최대 272), 넘치면 확인창 전체가 스크롤 |
| 바깥(딤) · `Esc` *(groo)* | 조회는 둘 다 닫힘 · 입력 폼은 바깥 무시, `Esc` 는 취소 | 바깥 무시 · `Esc` 와 뒤로 가기는 취소 |
| 1280 미만 *(groo)* | 같은 내용이 Bottom Sheet 로 바뀐다(Responsive Dialog) | 폰에서도 가운데 그대로 |
| 버튼 *(groo)* | 바닥 오른쪽 small — 시트에서는 large | 반씩 나란히(길면 세로 · 확정 위), 1280 미만 medium · 이상 small |

### 대화상자에 두지 않는 것

- 되돌릴 수 없는 확인 → [Alert Dialog](alert-dialog.md).
- 트리거에 붙는 짧은 내용(안내 · 고르기 패널) → [Popover](popover.md).
- 화면 높이를 넘는 긴 내용 · 단계가 많은 일 → 페이지.
- 대화상자 위에 대화상자 — 겹쳐도 되는 건 그 안에서 연 Alert Dialog · Popover 뿐이다.

### 글

제목은 하는 일 — "휴가 신청" · "거래 상세". 설명은 덧붙일 말이 있을 때만 한 문장(해요체 · 마침표). 바닥 버튼은 동작 이름("신청" · "저장") — "확인" 으로 뭉뚱그리지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/dialog.tsx` 를 쓴다(Radix Dialog 위). 폼 · 상세는 `ResponsiveDialog` — 1280 에서 Dialog 와 Bottom Sheet 를 바꾸고, `form` 이면 닫는 자리도 표면에 맞춰 바꾼다(대화상자는 바닥 취소, 시트는 위 닫기). `form` 이 아니면(조회 · 안내) 두 표면 모두 위 닫기 버튼이다. 본문에 [List](list.md) 를 바로 두면 줄이 제 좌우 여백(24)을 가지므로 본문 좌우 여백을 뺀다(`className="px-0"`). 넘칠 수 있는 본문은 `scrollFog` 를 준다(위 20 · 아래 80 끝 흐림 — [Scroll Fog](scroll-fog.md)). 아래 미리보기는 스펙 값으로 그린 모습이다.

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
| 열기 | 200ms 로 크게 나타나며 줄어든다(1.3 → 1). 처음 초점은 대화상자에 간다. |
| 바닥 취소 · 닫기 버튼 · `Esc` | 닫는다. 입력 폼에 바뀐 값이 있으면 먼저 묻는다. 뒤로 가기로 닫는 것은 1280 미만(시트)뿐이다 — 데스크톱 브라우저의 뒤로 가기는 페이지를 떠난다. |
| 바깥(딤) 누르기 | 조회 · 안내는 닫는다. **입력 폼은 무시한다.** |
| 머리 ← 누르기 | 두 단계 흐름의 2단계 — 같은 대화상자 안에서 1단계로 한 단계 되돌린다(닫지 않는다). 쓴 값이 있으면 먼저 "작성한 내용이 사라져요" 를 묻고, 돌아가면 그 값을 버린다. |
| 본문 스크롤 | 본문만 스크롤 — 위로 스크롤되면 머리 아래 선. 끝 흐림(`scrollFog`)은 걸었으면 늘 그대로다. |
| 닫힌 뒤 | 100ms 로 사라지고, 초점은 연 자리(트리거)로 돌아간다. |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠근다. 초점은 대화상자 안을 돈다. |
| 창 폭이 1280 을 넘나듦 | 열린 채 표면이 바뀐다(대화상자 ↔ 시트). 값은 폼(부모)이 들고 있어 그대로다 — 입력칸의 값을 대화상자 · 시트 안에만 두지 않는다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 아이콘 `fg-neutral-subtle` 5.50 · 5.27 ✓. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 2.4.3** Focus order | 열면 대화상자로, 닫으면 연 자리로 초점이 간다. 열린 동안 초점이 뒤 화면으로 나가지 않는다 |
| **WCAG 1.4.10** Reflow | 1280 미만은 시트로 바뀌고, 대화상자 높이는 화면의 80% 까지 — 넘치면 본문이 스크롤된다(머리 · 바닥이 화면 밖으로 나가지 않는다) |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 52 · 바닥 버튼 36 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼 52 ✓ · 바닥 버튼은 누르는 영역을 44 까지 넓힌다(Button) ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`(있을 때만), 닫기 버튼 이름 "닫기", 머리 ← 이름 "뒤로"(초점 차례 맨 앞) |

## Do / Don't

### ✅ Do

- 폼 · 상세는 한 부품으로 — 1280 이상 대화상자, 미만 시트.
- 입력 폼은 바닥 [취소] [저장], 조회는 머리 닫기 버튼.
- 입력 폼은 바깥 누르기로 닫지 않고, 바뀐 값이 있으면 닫기 전에 묻는다.
- 긴 내용은 본문만 스크롤 — 머리 · 바닥은 늘 보인다.
- 두 단계 흐름의 2단계는 머리 왼쪽 ← 로 1단계에 돌아간다(시트와 같은 값).

### ❌ Don't

- 머리 닫기 버튼과 바닥 취소를 함께.
- 되돌릴 수 없는 확인을 Dialog 로(Alert Dialog).
- 높이 상한 없이 내용을 늘려 제목 · 버튼이 화면 밖으로.
- 대화상자 위에 대화상자 — 단계가 많으면 페이지 · 단계로.

## Specification

`dialog.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Dialog 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다. 1280 미만의 모습은 [Bottom Sheet](bottom-sheet.md) 의 Specification 이다.

[그림: Specification — dialog.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#dialog)

## SEED 와 다른 점

- **바뀌는 폭은 1280**(사용자 결정 2026-10-02) — SEED Responsive Dialog 는 md(768). groo 는 Input Button 의 시트 · 팝오버 경계(1280)와 하나로 맞췄다.
- **바닥 버튼은 Button small 36** — SEED 예제는 medium 40. Button 을 정할 때 "40 은 대화상자에 비해 굵다" 로 고른 값을 지켰다(2026-10-02 다시 확인).
- **딤은 groo 0.50 · 다크 0.65**(v102) — SEED 0.455.
- **입력 폼은 바깥을 눌러도 닫히지 않고, 머리 닫기 버튼을 두지 않는다** — SEED 도 같은 쪽을 권한다(snippet 의 바깥 닫기 기본값 · "입력 폼에서는 헤더 X 지양"). groo 는 규칙으로 못박았다.
- **반투명 색을 불투명 짝으로**(v102) — 머리 아래 선 `stroke-neutral-subtle`, 닫기 버튼 누름 `bg-layer-floating-pressed`.
- **본문 끝 흐림은 Scroll Fog**(2026-10-03) — 넘칠 수 있는 본문에 늘 켜진 위 20 · 아래 80. SEED Dialog 는 본문이 넘칠 때만 아래 48 을 흐린다.
- **z-index 는 specs/z-index.md 의 L2**(딤 `z-modal` 100 · 대화상자 `z-modal-content` 101) — 그 안에서 연 Popover(L3) · Alert Dialog(L5)가 위에 뜬다(SEED 는 모두 2 + layerIndex).

## Migration notes

### 2026-10-29 — 두 단계 흐름의 머리 ←

사용자 결정 17-1 Q3 = A — 한 부품 안 두 단계 흐름(자산 추가 — 종류 고르기 → 폼)의 2단계 머리 왼쪽 ← 를 1280 이상의 대화상자에도 같은 값으로 둔다. 고르지 않은 안 B(2단계 폼 맨 위 "종류" 칸)와 결정 전문은 [Bottom Sheet](bottom-sheet.md) 의 같은 날 Migration notes. 수치는 `bottom-sheet.yaml` 의 축 `back` 한 벌이고 `dialog.yaml` 은 고치지 않았다. 레시피 `DialogContent` · `ResponsiveDialogContent` 에 `onBack` 을 더했다.

### 2026-10-22 — 대화상자 위 대화상자의 갈 곳

Don't "대화상자 위에 대화상자" 는 그대로 두고 옛 문장의 대안 "단계가 많으면 페이지 · 단계로" 를 함께 적었다(남은 규칙 R18 — 그대로, https://claude.ai/artifact/Mag1tEv51MdQHdy1o8hY3L). 값 변경 없음.

### 2026-10-22 — Alert Dialog 와 견주는 표

SEED Dialog 문서의 "Dialog vs Alert Dialog" 네 줄에 groo 의 세 줄(바깥 · `Esc` · 1280 미만 모양 · 버튼)을 더한 표를 두었다 — 폰에서 Dialog 는 시트가 되고 확인창만 가운데에 남는 것이 SEED 에 없는 차이다(사용자 결정 1C — https://claude.ai/artifact/YRPbWzhgD4EDdKsVioU8Zj). 떠 있는 표면 일곱을 고르는 큰 표는 DESIGN.md 한 벌로(3C). 값 변경 없음.

### 2026-10-03 — 본문 끝 흐림을 Scroll Fog 로

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 끝 흐림을 SEED 의 늘 켜진 마스크([Scroll Fog](scroll-fog.md))로 정해, 2026-10-02 의 "본문이 넘칠 때만 아래 48 흐림" 을 바꿨다 — 넘칠 수 있는 본문(목록 · 긴 폼)에 `scrollFog` 를 걸고, 걸면 위 20 · 아래 80 이 늘 흐리다(본문 안 여백도 그만큼). 넘친 쪽만 흐리는 안은 고르지 않았다. 상태 `overflow` 와 부위 `fade` 를 걷고 축 `scrollFog` · 부위 `fog` 를 두었다.

### 2026-10-02 — SEED Dialog 로 다시 정한다

사용자가 [비교 페이지](https://claude.ai/artifact/2KE4tDQT6p5GPyhx7Y29vt)에서 정했다 — 일로 나누기(폼 · 상세는 한 부품이 폭으로 시트 ↔ 대화상자) · 경계 1280 · 입력 폼은 바깥으로 닫지 않음 · 닫기 버튼과 취소는 하나만 · SEED 모양(medium 480 · large 800 · 최대 80% · 모서리 20 · 제목 22 / 30 · 본문만 스크롤 + 흐림 · 머리 아래 선). 바닥 버튼은 Button 결정대로 small 36. 옛 Dialog(sm 420 · md 520 · lg 720 · 86vh · 모서리 12 · 제목 18 / 600 · 머리 X + 바닥 취소)는 걷었다 — 옛 스펙은 `dialog.history/v-pre-seed-overlay.*`.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — ModalShell 53곳(768 에서 시트 ↔ 대화상자 → 1280). 열어도 초점이 안으로 들어가지 않고 Tab 이 가려진 뒤 화면을 돌며, 닫으면 초점이 body 로 떨어진다. ModalShell 의 `aria-describedby` 가 없는 id 를 가리킨다. 폼 33곳이 바깥 누르기로 경고 없이 닫힌다. 상세 바닥의 삭제(dangerSoft)는 4.01:1.
- **Desk 앱** — 시트가 대부분이고 프리셋 저장만 가운데 대화상자(PFormAlertDialog)다(→ 시트). 폼 29곳이 경고 없이 닫힌다.
- **HR 웹** — Dialog 30곳 중 18곳이 높이 상한이 없어 긴 내용이면 제목과 버튼이 화면 밖으로 나간다(데스크톱 y −161 · 모바일 y −671). 트리거 없이 연 21곳은 닫으면 초점이 body 로 떨어진다. 닫기 버튼 16×16 "Close", 딤 0.80, 설명 4.42:1.
- 앱 적용 때 화면마다 정할 자리 — HR 전체 화면 Dialog 3(페이지 · 시트 · Side Panel), 데스크톱 필터(Dialog · Popover · Side Panel), 반복 거래 상세의 바닥 액션 3개.
