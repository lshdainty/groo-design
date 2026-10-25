# Bottom Sheet

> 화면 아래에서 올라오는 모달. 1280 미만에서 폼 · 상세 · 고르기를 띄운다 — 같은 내용을 1280 이상에서는 [Dialog](dialog.md) 로 띄운다(한 부품이 폭으로 바꾼다 — Responsive Dialog). 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 들어간 화면 머리 ⋮ 의 동작 목록은 [Menu Sheet](menu-sheet.md), 화면 높이의 90% 를 넘는 내용은 페이지다.

구조는 당근 [SEED Bottom Sheet](https://seed-design.io/components/bottom-sheet)(Apache-2.0)를 따른다 — 딤 · 시트 · 머리(제목 · 설명) · 닫기 버튼 · 본문 · 바닥, 손잡이는 고를 때만. 값은 groo 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). 옛 Drawer 스펙을 대신한다.

수치 원본은 [`bottom-sheet.yaml`](bottom-sheet.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 거래 추가 · 기간 · 거래 상세 — 라이트 · 다크](../../site/components/specs/bottom-sheet.tsx#hero)

### 직접 골라 보기

쓰임(입력 폼 · 고르기 · 조회) · 설명 · 바닥 버튼 수 · 손잡이를 고르면 스펙대로 그린 시트와 그 코드가 바뀐다. 실제로 열고 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/bottom-sheet.tsx#playground)

## Anatomy

[그림: 시트는 딤 · 시트 · 머리 · 닫기 · 본문 · 바닥으로, 스냅 높이를 두면 손잡이를 단다](../../site/components/specs/bottom-sheet.tsx#anatomy)

| ⓐ Overlay | 딤 — 시트 뒤 화면 전체. 입력 폼이 아니면 누르면 닫힌다. |
| ⓑ Container | 시트 — 위 두 모서리만 둥글다. 내용만큼 높고 화면 높이의 90% 를 넘지 않는다. 넓은 화면에서는 480 으로 가운데에 선다. |
| ⓒ Header | 머리 — 제목(늘 있다) · 설명(있을 때만). |
| ⓓ Close Button | 닫기 — 오른쪽 위 원. 조회 · 고르기 · 시트의 입력 폼에 둔다. |
| ⓔ Body | 본문 — 넘치면 이 안에서 스크롤한다. 넘칠 수 있는 본문은 끝을 흐린다([Scroll Fog](scroll-fog.md)). |
| ⓕ Footer | 바닥 — 버튼. 하나면 폭 전체, 둘이면 반씩. 확인을 여는 [삭제] 는 왼쪽에 글자만큼. |
| ⓖ Handle | 손잡이 — 스냅 높이를 둘 때만. |

[표: 부위](bottom-sheet.yaml#slots)

## Properties

### 머리 · 본문 · 바닥

머리는 위 24 · 아래 16 이고 제목 22 / 30 · 700, 설명 16 / 22 다. 좌우는 화면 여백 24 이고, 닫기 버튼이 있으면 제목 오른쪽을 64 비운다. 바닥은 위 12 · 아래 16 이고 그 아래에 안전 영역(홈 표시줄)을 더한다. 바닥 버튼은 Button large 48 — 하나면 폭 전체, 둘이면 반씩 나눈다. 확인을 여는 [삭제] 는 예외로 왼쪽에 `ghost` + `critical` 글자만큼 두고, 주 버튼이 남은 폭을 채운다([Button](button.md) 의 "모달 footer" 꼴).

[그림: 머리 · 본문 · 바닥의 여백](../../site/components/specs/bottom-sheet.tsx#layout)

[표: 공통](bottom-sheet.yaml#base.enabled)

### 본문 끝 흐림

목록 · 긴 폼처럼 넘칠 수 있는 본문은 [Scroll Fog](scroll-fog.md) 를 건다(`scrollFog`) — 위 20 · 아래 80 이 늘 흐리고, 본문 안에 그만큼 여백을 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다(SEED Bottom Sheet 의 권장). 넘쳤는지 재서 켜고 끄지 않는다 — 걸 본문인지는 내용의 종류로 정하고, 칸 두셋처럼 늘 들어맞는 본문에는 걸지 않는다. 1280 이상의 [Dialog](dialog.md) 에서도 같다.

[그림: 넘칠 수 있는 본문 — 늘 켜진 끝 흐림(위 20 · 아래 80) · 끝까지 내린 모습](../../site/components/specs/bottom-sheet.tsx#scroll)

[표: 본문 끝 흐림](bottom-sheet.yaml#scrollFog)

### 손잡이

기본으로 없다 — 손잡이가 없어도 조회 · 고르기 시트는 아래로 끌어 닫힌다. 시트가 절반 · 가득 같은 스냅 높이를 가질 때만 손잡이를 단다(그때는 반드시). 손잡이를 누르면 다음(더 높은) 스냅 높이로 올라가고, 가장 높은 높이에서 누르면 닫힌다(SEED).

[그림: 손잡이 — 스냅 높이를 둘 때만](../../site/components/specs/bottom-sheet.tsx#handle)

[표: 손잡이](bottom-sheet.yaml#handle)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 — 딤 위 시트 |
| `pressed` | 닫기 버튼 — 원 바탕 `bg-neutral-weak-pressed` + 2px 거리 축소 |
| `focused` | 키보드 포커스에만 링 2px · 띄움 2px |

[표: 상태](bottom-sheet.yaml#matrix)

[표: 모션](bottom-sheet.yaml#motion)

## Guidelines

### 시트에 띄우는 것

1280 미만에서 지금 화면을 떠나지 않고 할 일 — 입력 폼(거래 추가 · 수정), 고르기(기간 · 정렬 · 날짜 — Input Button 의 시트), 조회(거래 상세). 같은 내용은 1280 이상에서 [Dialog](dialog.md) 로 뜬다 — 머리 · 본문 · 바닥은 같고 표면만 바뀐다. 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md), 들어간 화면 머리 ⋮ 의 동작 목록(수정 · 복사 · 삭제)은 [Menu Sheet](menu-sheet.md) 다 — 목록 줄에는 ⋮ 를 두지 않는다([Menu](menu.md) 의 "줄의 동작").

어느 떠 있는 표면을 쓸지 — 시트 · 대화상자 · 확인창 · 팝오버 · 메뉴 · 메뉴 시트 · 옆 패널을 한눈에 견준 "상황 → 고를 것" 표는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 한 벌이다(2026-10-22 사용자 결정 3C — https://claude.ai/artifact/YRPbWzhgD4EDdKsVioU8Zj). Desk 데스크톱 벨의 알림 목록도 그 표에 있다(768 ~ 1279 시트 · 1280 이상 [Popover](popover.md) — 2026-10-16 사용자 결정 Q-017-3b B).

[그림: 쓰임 — 폼 · 고르기 · 조회는 시트 · 확인은 Alert Dialog](../../site/components/specs/bottom-sheet.tsx#role-guide)

### 90% 를 넘으면 페이지

시트는 내용만큼 높고 화면 높이의 90% 를 넘지 않는다. 처음부터 길게 짠 내용은 시트를 90% 로 늘려 버티지 않고 페이지로 옮긴다 — 뒤로 가기 · 주소가 자연스럽게 따라온다(2026-10-02 사용자 결정). 다만 보통은 들어맞는 시트가 작은 화면 · 큰 글자 · 키보드로 넘치는 것은 페이지로 옮길 일이 아니다 — 본문만 스크롤하고 끝을 흐린다. SEED 도 같은 문서에서 두 상황을 나눈다("스크롤보다는 페이지로 표현하는 것을 권장" / "해상도 등으로 인해 … 90%를 넘는 경우 스크롤이 발생 · Scroll Fog")(2026-10-22 사용자 결정 9B — https://claude.ai/artifact/YRPbWzhgD4EDdKsVioU8Zj).

| 상황 | 쓰는 것 | 주의 |
|---|---|---|
| 처음부터 길게 짠 내용 — 카테고리 전체 관리 · 단계가 셋 넘는 흐름 · 끝없는 목록 | 페이지 | 주소 · 뒤로 가기가 따라온다. 시트를 90% 로 늘려 버티지 않는다 |
| 보통은 들어맞는데 작은 화면(360 × 568) · 큰 글자 · 키보드로 넘친 것 | Bottom Sheet 그대로 — 본문만 스크롤 + 끝 흐림 | 머리 · 바닥은 그대로 보인다. 넘칠 수 있는 본문(목록 · 긴 폼)에 [Scroll Fog](scroll-fog.md) |
| 개수가 데이터에 따라 느는 목록(알림 · 검색 결과) | 시트 + 끝 흐림 — 길어질 수 있으면 페이지를 먼저 생각 | 시트에 둔다면 Scroll Fog 는 넘쳤는지 재지 않고 늘 건다 |

[그림: 높이 — 내용만큼 · 90% 를 넘는 시트](../../site/components/specs/bottom-sheet.tsx#height-guide)

### 입력 폼은 실수로 닫히지 않게

입력 폼 시트는 바깥을 눌러도, 아래로 끌어도 닫히지 않는다 — 손잡이를 달지 않는다. 위 닫기 버튼 · 뒤로 가기 · `Esc` 로 닫고, 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다([Field](field.md) 의 규칙). 조회 · 고르기 시트는 바깥 누르기 · 끌어내리기로 닫힌다.

[그림: 닫기 — 입력 폼은 바깥 · 끌기로 닫히지 않는다 · 조회는 닫힌다](../../site/components/specs/bottom-sheet.tsx#dismiss-guide)

### 닫기 버튼과 바닥 버튼

시트의 입력 폼은 위 닫기 버튼 + 바닥 [저장] 하나다 — 바닥에 [취소] 를 따로 두지 않는다(닫기 버튼과 취소를 함께 두지 않는다). 조회 · 고르기도 위 닫기 버튼이고, 바닥 버튼은 고른 것을 넣을 때("완료" · "적용")만 둔다. 둘을 나란히 둘 때는 보조(초기화)를 왼쪽, 주 버튼을 오른쪽에 반씩.

목록 줄을 눌러 들어간 시트(상세 · 수정)에서 동작이 삭제 하나뿐이면 바닥 왼쪽에 [삭제](`ghost` + `critical`)를 둔다 — 주 버튼([저장] · [수정])이 있으면 그 버튼이 남은 폭을 채우고, 없는 조회 시트는 [삭제] 하나만 왼쪽에 선다. 동작이 여럿이면 바닥이 아니라 머리 ⋮ → [Menu Sheet](menu-sheet.md) 다. 목록 줄에는 ⋮ 를 두지 않는다([Menu](menu.md) 의 "줄의 동작", 2026-10-25 사용자 결정).

[그림: 버튼 — 폼은 위 닫기 + 바닥 저장 · 닫기와 취소를 함께](../../site/components/specs/bottom-sheet.tsx#buttons-guide)

### 글

제목은 무엇을 하는 시트인지 — "거래 추가" · "기간". 설명은 덧붙일 말이 있을 때만 한 문장으로(해요체 · 마침표). 버튼은 동작 이름("저장" · "적용") — "확인" 으로 뭉뚱그리지 않는다.

## 코드

레시피 `recipes/shadcn/components/ui/bottom-sheet.tsx` 를 쓴다(vaul 위). 폼 · 상세는 1280 에서 Dialog 와 바뀌는 `ResponsiveDialog`([Dialog](dialog.md) 의 코드)로 짜고, 늘 시트인 자리(Input Button 의 시트 · 고르기)만 `BottomSheet` 를 바로 쓴다. 본문에 [List](list.md) 를 바로 두면 줄이 제 좌우 여백(24)을 가지므로 본문 좌우 여백을 뺀다(`className="px-0"`). 아래 미리보기는 스펙 값으로 그린 모습이다.

### 고르기 — 기간

[그림: 기간 고르기](../../site/components/specs/bottom-sheet.tsx#ex-pick)

```tsx
import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetFooter } from "@/components/ui/bottom-sheet"

<BottomSheet open={open} onOpenChange={setOpen}>
  <BottomSheetContent title="기간" description="고른 기간의 거래만 보여요.">
    <BottomSheetBody className="px-0">
      <List>…</List>
    </BottomSheetBody>
    <BottomSheetFooter>
      <Button variant="neutralWeak" size="large" onClick={reset}>초기화</Button>
      <Button size="large" onClick={apply}>적용</Button>
    </BottomSheetFooter>
  </BottomSheetContent>
</BottomSheet>
```

### 입력 폼 — 바깥 · 끌기로 닫지 않는다

[그림: 거래 추가](../../site/components/specs/bottom-sheet.tsx#ex-form)

```tsx
{/* form — 바깥 누르기 · 끌어내리기로 닫지 않는다(손잡이 없음). dirty — 닫기 전에 "작성한 내용이 사라져요" 를 묻는다 */}
<BottomSheet open={open} onOpenChange={setOpen} form dirty={isDirty}>
  <BottomSheetContent title="거래 추가">
    <BottomSheetBody>
      <Field label="금액">…</Field>
      <Field label="날짜">…</Field>
    </BottomSheetBody>
    <BottomSheetFooter>
      <Button size="large" type="submit">저장</Button>
    </BottomSheetFooter>
  </BottomSheetContent>
</BottomSheet>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기 | 300ms 로 아래에서 올라온다. 처음 초점은 시트(본문 위)에 간다 — 내용이 첫 자리를 정하면(검색 시트의 검색칸 · 아이콘 고르기의 고른 칸) 시트가 그리로 넘겨준다(`onOpenAutoFocus`, 열린 뒤 다시 옮기지 않는다 — 2026-10-15 구현 세션 질문 Q-007-3 정리). |
| 닫기 버튼 · `Esc` · 뒤로 가기 | 닫는다. 입력 폼에 바뀐 값이 있으면 먼저 묻는다. |
| 바깥(딤) 누르기 | 조회 · 고르기 시트는 닫는다. **입력 폼은 무시한다.** |
| 아래로 끌기 | 조회 · 고르기 시트는 놓을 때 빠르게(0.4px/ms 넘게) 끌었거나 높이의 25% 이상 내려왔으면 닫고, 아니면 제자리로 돌아간다. 열린 뒤 0.5초는 끌리지 않는다. 본문을 스크롤하는 중이면 끌지 않는다. **입력 폼은 끌리지 않는다.** |
| 손잡이 누르기 | 다음(더 높은) 스냅 높이로 — 가장 높은 높이에서 누르면 닫는다. |
| 닫힌 뒤 | 200ms 로 내려가고, 초점은 연 자리(트리거)로 돌아간다. |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠근다. 초점은 시트 안을 돈다. |
| 키보드(폰) | 입력에 초점이 가면 시트가 키보드 위로 올라간다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 다크 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 버튼은 아이콘 `fg-neutral`(16.41 · 11.62)이 버튼을 알린다 — 원 바탕(1.08 · 1.13)은 장식. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 2.4.3** Focus order | 열면 시트로, 닫으면 연 자리로 초점이 간다. 열린 동안 초점이 뒤 화면으로 나가지 않는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 44 · 손잡이 44 · 바닥 버튼 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼(보이는 원 28)은 누르는 영역 44 ✓ · 바닥 버튼 48 ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`, 닫기 버튼 이름 "닫기", 손잡이는 보조 기술에 숨긴다 |

## Do / Don't

### ✅ Do

- 1280 미만의 폼 · 상세 · 고르기를 시트로 — 1280 이상은 같은 내용을 Dialog 로.
- 입력 폼은 바깥 · 끌기로 닫지 않고, 바뀐 값이 있으면 닫기 전에 묻는다.
- 시트의 입력 폼은 위 닫기 + 바닥 저장 하나.
- 들어간 시트의 동작이 삭제 하나면 바닥 왼쪽 [삭제] `ghost` + `critical`.
- 처음부터 화면 높이의 90% 를 넘게 짠 내용은 페이지로 — 작은 화면 · 큰 글자로 넘친 것은 본문만 스크롤 + 끝 흐림.

### ❌ Don't

- 닫기 버튼과 바닥 취소를 함께.
- 스냅 높이가 없는데 손잡이를 장식으로.
- 되돌릴 수 없는 확인을 시트로(Alert Dialog).
- 처음부터 화면을 넘게 짠 내용을 시트에 — 시트를 90% 로 늘려 버티기(페이지).
- 입력 폼 시트 위에 또 입력 폼 시트를 겹치기 — 그 위에는 고르기 시트(Input Button)와 확인창만 뜬다.

## Specification

`bottom-sheet.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Bottom Sheet 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — bottom-sheet.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#bottom-sheet)

## SEED 와 다른 점

- **좌우 여백은 화면 여백 24** — SEED 16. 닫기 버튼도 오른쪽 24.
- **딤은 groo 0.50 · 다크 0.65**(v102) — SEED 0.455.
- **바닥 버튼은 Button large 48** — SEED 예제는 medium 40. groo 모바일 바닥 CTA 규칙이다.
- **입력 폼은 바깥 누르기 · 끌어내리기로 닫지 않는다**(사용자 결정 2026-10-02) — SEED 는 "복잡한 양식 · 결제" 에 닫기 버튼 + 손잡이 제거를 권하고, 끌어 닫기까지 막으려면 따로 끈다.
- **시트의 입력 폼은 위 닫기 + 바닥 저장** — 닫기 버튼과 바닥 취소를 함께 두지 않는다(SEED Dialog 의 규칙을 시트에도).
- **손잡이 누름 색은 두지 않는다** — SEED `palette.gray-500` 의 짝이 groo 역할 색에 없다.
- **z-index 는 specs/z-index.md 의 L2**(딤 `z-modal` 100 · 시트 `z-modal-content` 101) — 그 위에 Popover(L3) · Alert Dialog(L5)가 뜬다.

## Migration notes

### 2026-10-25 — 바닥 왼쪽 [삭제]

사용자 결정 — 목록 줄에는 ⋮ 를 두지 않고 줄을 누르면 들어간다. 들어간 시트의 동작이 하나(삭제)면 바닥 왼쪽 [삭제] `ghost` + `critical`(Button 모달 footer 꼴), 여럿이면 머리 ⋮ → Menu Sheet([Menu](menu.md) 의 "줄의 동작"). Anatomy · 여백 · "닫기 버튼과 바닥 버튼" 에 한 줄씩, yaml `footer.gap` 비고에 같은 말. 그림은 아직 없다(바닥 그림 부품이 폭 전체 · 반씩만 그린다). 값 변경 없음.

### 2026-10-22 — 90% 와 본문 스크롤 · 표면 고르기 표는 한 벌

"그보다 긴 내용은 시트 안 스크롤로 버티지 않는다" 와 "넘칠 수 있는 본문은 Scroll Fog" 가 한 문서에서 부딪쳤다. 결정(90% 를 넘는 내용은 페이지)은 그대로 두고 상황을 둘로 나눴다 — 처음부터 긴 내용은 페이지, 작은 화면 · 큰 글자 · 키보드로 넘친 것은 본문만 스크롤 + 끝 흐림(9B). yaml `maxHeight` 비고도 같은 말로. "이런 일 → 1280 미만 · 이상" 표는 DESIGN.md 의 큰 표 한 벌로 보냈다(3C) — 사용자 결정 https://claude.ai/artifact/YRPbWzhgD4EDdKsVioU8Zj. 값 변경 없음. 앱의 85 ~ 92% 고정 시트 5곳(10-02 조사)은 "처음부터 긴 내용" 쪽이라 이관 때 페이지 · 내용 높이로 고른다.

### 2026-10-16 — 알림 목록

Desk 데스크톱 머리 벨의 알림 목록은 768 ~ 1279 에서 이 시트로 연다 — 1280 이상은 벨 아래 Popover(구현 세션 질문 Q-017-3b B, [Popover](popover.md) 의 "알림 목록"). 머리 "알림" · 설명 "읽지 않은 알림 N개" · 목록(끝 흐림) · 바닥 "알림 설정" · "모두 읽음". 지금 Desk 웹은 이 폭에서도 380 팝오버다(`NotificationsPopover.tsx`).

### 2026-10-15 — 첫 초점은 내용이 정할 수 있다

구현 세션 질문 Q-007-3(정리) — "처음 초점은 시트" 와 Searchable List 의 "열면 검색칸에 초점" 이 어긋나 있었다. 끝 모습(검색칸)은 같고, 시트가 `onOpenAutoFocus` 로 내용에 첫 초점을 넘겨주게 적었다 — 검색칸이 스스로 잡은 뒤 한 프레임 뒤에 다시 잡지 않는다(시트를 읽던 낭독기가 끊기지 않게). 앱은 `PBottomSheet` 가 첫 초점 노드를 받는 자리를 둔다.

### 2026-10-03 — 본문 끝 흐림을 Scroll Fog 로

사용자가 [비교 페이지](https://claude.ai/artifact/4ySVacsdnG4fgraR1HRK3G)에서 끝 흐림을 SEED 의 늘 켜진 마스크([Scroll Fog](scroll-fog.md))로 정했다 — 넘칠 수 있는 본문(목록 · 긴 폼)에 `scrollFog` 를 걸고, 걸면 위 20 · 아래 80 이 늘 흐리다(본문 안 여백도 그만큼). 대화상자와 같은 규칙이다 — 대화상자의 "넘칠 때만 아래 48" 을 이것으로 바꿨다.

### 2026-10-02 — SEED Bottom Sheet 로 새로 둔다(옛 Drawer 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/2KE4tDQT6p5GPyhx7Y29vt)에서 정했다 — 일로 나누기(폼 · 상세는 시트 ↔ 대화상자, 확인은 Alert Dialog, 동작 목록은 Menu Sheet · Menu, 90% 를 넘으면 페이지) · 경계 1280(Input Button 과 같게) · SEED 모양(위 24 · 제목 22 · 닫기 원 · 손잡이는 스냅일 때만) · 입력 폼은 바깥 · 끌기로 닫지 않음 · 닫기 버튼과 취소는 하나만. 옛 Drawer(아래 · 오른쪽 두 방향, 손잡이 늘, 위 20)는 걷었다 — 옛 스펙은 `drawer.history/v-pre-seed-overlay.*`. 오른쪽에서 나오는 패널은 [Side Panel](side-panel.md) 이다(2026-10-04 — 왼쪽 · 오른쪽만, 1280 미만의 오른쪽 패널은 이 시트로).

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹** — ModalShell 53곳이 768 에서 시트(vaul) ↔ 대화상자를 오간다(→ 1280). 열어도 초점이 시트로 들어가지 않아 Tab 이 가려진 뒤 화면을 돌고, 닫으면 초점이 body 로 떨어진다. 손잡이가 장식으로 늘 있고(표면과 1.12:1), 바닥 버튼 아래 안전 영역이 없다. 폼 33곳이 딤 누르기 · 끌어내리기 한 번에 경고 없이 닫힌다.
- **Desk 앱** — showPSheet 55곳, 닫기 버튼에 이름이 없고 딤이 0.541(POverlay 토큰을 안 쓴다). 85 ~ 92% 높이로 고정한 시트 5곳(거래 추가 · 구독 · 카드 상세 · 종목 상세 · 종목 검색).
- **HR 웹** — Sheet 2 + 1(모바일 역할 · 권한 · 사이드바), 닫기 버튼 16×16 "Close".
- 앱 적용 때 화면마다 정할 자리 — 85 ~ 92% 시트 9곳(페이지 · 스냅 높이 · 내용 높이), 밤하늘 · 관측 리포트(Desk 웹 모바일 전체 화면).
