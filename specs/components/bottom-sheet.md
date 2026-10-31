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
| ⓗ Back Button | 뒤로 — 머리 왼쪽 ←. 한 시트 안 두 단계 흐름의 2단계에만 단다(그림에는 없다 — 아래 "두 단계 시트의 머리 ←"). 닫기 버튼은 그대로 있다. |
| ⓘ Header Action | 머리 오른쪽 동작 — 닫기 왼쪽의 ⋮ 하나. 들어간 시트에서 동작이 여럿일 때만 단다(그림에는 없다 — 아래 "머리 오른쪽 동작"). |

[표: 부위](bottom-sheet.yaml#slots)

## Properties

### 머리 · 본문 · 바닥

머리는 위 24 · 아래 16 이고 제목 22 / 30 · 700, 설명 16 / 22 다. 좌우는 화면 여백 24 이고, 닫기 버튼이 있으면 제목 오른쪽을 64 비운다. 바닥은 위 12 · 아래 16 이고 그 아래에 안전 영역(홈 표시줄)을 더한다. 바닥 버튼은 Button large 48 — 하나면 폭 전체, 둘이면 반씩 나눈다. 확인을 여는 [삭제] 는 예외로 왼쪽에 `ghost` + `critical` 글자만큼 두고, 주 버튼이 남은 폭을 채운다([Button](button.md) 의 "모달 footer" 꼴).

[그림: 머리 · 본문 · 바닥의 여백](../../site/components/specs/bottom-sheet.tsx#layout)

[표: 공통](bottom-sheet.yaml#base.enabled)

### 머리 → 첫 칸

머리 아래는 본문 여백 그대로다 — 끝 흐림을 끄면 16, 켜면 위 흐림 20 을 더해 36. 끝 흐림을 끄면 그 20 도 함께 사라지니, 첫 칸 위 값을 화면이 따로 더하지 않는다. 예외는 **칸 이름 없이 바로 시작하는 제목 칸**(메모 · 일정 폼)이다 — 칸 이름이 차지하던 자리를 대신해 위 12 · 아래 8 을 더한다(28). 끝 흐림을 켠 시트에서는 위 20 이 이미 그 자리이므로 위 4 만 더한다(40). 라벨 있는 칸 · 목록 · 값 줄로 시작하면 더하지 않는다.

### 본문 끝 흐림

개수가 데이터에 따라 느는 목록 · 긴 글을 보여 주는 본문, 그리고 390 × 844 · 글자 100% · 보통 값에서 시트 90% 에 닿는 본문은 [Scroll Fog](scroll-fog.md) 를 건다(`scrollFog`) — 위 20 · 아래 80 이 늘 흐리고, 본문 안에 그만큼 여백을 둬 끝까지 내리면 흐림이 빈 여백 위에 놓인다(SEED Bottom Sheet 의 권장). 넘쳤는지 재서 켜고 끄지 않는다 — 걸 본문인지는 내용의 종류로 정하고, 칸 두셋처럼 늘 들어맞는 본문과, 가장 나쁜 값에서만 넘치는 본문(프리셋 상세)에는 걸지 않는다. 호출하는 화면이 정한다 — 틀이 정하지 않는다. 걸지 않아도 넘치면 본문은 스크롤된다. 1280 이상의 [Dialog](dialog.md) 에서도 같다.

[그림: 넘칠 수 있는 본문 — 늘 켜진 끝 흐림(위 20 · 아래 80) · 끝까지 내린 모습](../../site/components/specs/bottom-sheet.tsx#scroll)

[표: 본문 끝 흐림](bottom-sheet.yaml#scrollFog)

### 손잡이

기본으로 없다 — 손잡이가 없어도 조회 · 고르기 시트는 아래로 끌어 닫힌다. 시트가 절반 · 가득 같은 스냅 높이를 가질 때만 손잡이를 단다(그때는 반드시). 손잡이를 누르면 다음(더 높은) 스냅 높이로 올라가고, 가장 높은 높이에서 누르면 닫힌다(SEED).

[그림: 손잡이 — 스냅 높이를 둘 때만](../../site/components/specs/bottom-sheet.tsx#handle)

[표: 손잡이](bottom-sheet.yaml#handle)

### 머리 ← — 두 단계 시트의 2단계

한 시트 안에서 두 단계로 나아가는 흐름(1단계 종류 고르기 → 2단계 폼)은 2단계 머리 왼쪽에 ← 를 단다(`back`). 보이는 원 40 · 아이콘 24 · 누르는 영역 44 이고, 아이콘이 화면 여백 24 에 오도록 원을 8 바깥에 둔다. 세로는 제목 첫 줄 가운데다. 제목은 원 오른쪽 4 에서 시작한다 — 화면 여백에서 36 들어간다. 원 바탕은 누를 때만 `bg-neutral-weak-pressed` 이고, 닫기 버튼과 달리 거리 축소는 없다. 쓰는 법은 Guidelines 의 "두 단계 시트의 머리 ←".

[표: 머리 ←](bottom-sheet.yaml#back)

### 머리 오른쪽 동작 — ⋮ 하나

들어간 시트(상세 · 수정)에서 그 항목의 동작이 여럿이면 머리 오른쪽에 ⋮ 하나를 둔다(`headerAction`) — 누르면 [Menu Sheet](menu-sheet.md) 가 동작 목록을 연다. 자리는 닫기 버튼 왼쪽 사이 4 이고(닫기 버튼이 없으면 닫기 자리인 오른쪽 끝), 세로는 닫기 원과 가운데를 맞춘다. 단추는 [Button](button.md) `ghost` 아이콘만(보이는 36 · 누르는 44)이고, 이름은 "{항목 이름} 더보기"("거래 더보기")다. 제목은 단추 자리를 비운 남은 폭에서 줄을 바꾸고 단추와 겹치지 않는다. 초점 차례는 제목 → 동작 → 닫기다(← 가 있으면 맨 앞). 머리 동작은 **하나만** 둔다 — 둘째 동작을 머리에 나란히 늘어놓지 않고 ⋮ 의 메뉴에 넣는다(2026-10-25 I-20 — 웹 `headerAction` · 앱 `PBottomSheetContent.headerAction`).

[표: 머리 오른쪽 동작](bottom-sheet.yaml#headerAction)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 열림 — 딤 위 시트 |
| `pressed` | 닫기 버튼 — 원 바탕 `bg-neutral-weak-pressed` + 2px 거리 축소. 머리 ← — 원 바탕 `bg-neutral-weak-pressed`(축소 없음) |
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
| 보통은 들어맞는데 작은 화면(360 × 568) · 큰 글자 · 키보드로 넘친 것 | Bottom Sheet 그대로 — 본문만 스크롤 + 끝 흐림 | 머리 · 바닥은 그대로 보인다. 거는 기준은 위 "본문 끝 흐림" |
| 개수가 데이터에 따라 느는 목록(알림 · 검색 결과) | 시트 + 끝 흐림 — 길어질 수 있으면 페이지를 먼저 생각 | 시트에 둔다면 Scroll Fog 는 넘쳤는지 재지 않고 늘 건다 |

[그림: 높이 — 내용만큼 · 90% 를 넘는 시트](../../site/components/specs/bottom-sheet.tsx#height-guide)

### 두 단계 시트의 머리 ←

종류를 먼저 고르고(1단계) 그 종류의 폼을 쓰는(2단계) 흐름은 한 시트 안에서 단계를 바꾼다 — 2단계 머리 왼쪽 ← 가 1단계로 한 단계 되돌린다(자산 추가 — "무엇을 추가할까요?" → "입출금 추가"). 저장 전 본인 확인(가린 금액 보기 인증)처럼 시트 안에 끼어든 한 단계도 같은 ← 로 앞 단계에 돌아간다(저장하지 않는다). 수정처럼 1단계가 없는 시트에는 ← 가 없다. 오른쪽 위 닫기 버튼은 그대로 두고, ← 는 시트를 닫지 않는다.

- **쓴 값이 있으면 묻고 버린다** — 2단계에서 쓴 값이 있으면 ← 를 누를 때 "작성한 내용이 사라져요" 를 먼저 묻고, [나가기] 면 1단계로 돌아가며 그 값을 버린다. 종류가 바뀌면 폼의 칸이 달라지므로 앞 종류에서 쓴 값을 들고 가지 않는다(2026-10-29 사용자 결정 — "종류가 바뀐다는 건 폼의 입력 데이터를 초기화하는 게 맞음"). 쓴 값이 없으면 묻지 않고 돌아간다.
- **종류는 1단계에서만 바꾼다** — 2단계 폼 맨 위에 "종류" 고르기 칸을 두지 않는다. 다른 묶음(계좌 → 카드)으로 바꾸면 칸이 달라져 쓴 값을 어떻게 할지 따로 정해야 하고 폼이 칸 하나만큼 길어진다.
- **같은 시트 안의 단계에만** — 단계가 셋을 넘는 흐름은 시트가 아니라 페이지다("90% 를 넘으면 페이지" 표). 페이지의 ← 는 [Top Navigation](top-navigation.md) 의 것이고, 이 ← 는 시트 머리에서 한 단계만 되돌린다.
- **1280 이상의 대화상자도 같다** — 같은 흐름을 [Dialog](dialog.md) 로 띄우면 머리 왼쪽에 같은 값의 ← 를 단다.

### 입력 폼은 실수로 닫히지 않게

입력 폼 시트는 바깥을 눌러도, 아래로 끌어도 닫히지 않는다 — 손잡이를 달지 않는다. 위 닫기 버튼 · 뒤로 가기 · `Esc` 로 닫고, 바뀐 값이 있으면 닫기 전에 "작성한 내용이 사라져요" 를 묻는다([Field](field.md) 의 규칙). 조회 · 고르기 시트는 바깥 누르기 · 끌어내리기로 닫힌다.

[그림: 닫기 — 입력 폼은 바깥 · 끌기로 닫히지 않는다 · 조회는 닫힌다](../../site/components/specs/bottom-sheet.tsx#dismiss-guide)

### 닫기 버튼과 바닥 버튼

시트의 입력 폼은 위 닫기 버튼 + 바닥 [저장] 하나다 — 바닥에 [취소] 를 따로 두지 않는다(닫기 버튼과 취소를 함께 두지 않는다). 조회 · 고르기도 위 닫기 버튼이고, 바닥 버튼은 고른 것을 넣을 때("완료" · "적용")만 둔다. 둘을 나란히 둘 때는 보조(초기화)를 왼쪽, 주 버튼을 오른쪽에 반씩.

목록 줄을 눌러 들어간 시트(상세 · 수정)에서 동작이 삭제 하나뿐이면 바닥 왼쪽에 [삭제](`ghost` + `critical`)를 둔다 — 주 버튼([저장] · [수정])이 있으면 그 버튼이 남은 폭을 채우고, 없는 조회 시트는 [삭제] 하나만 왼쪽에 선다. 입력 폼 시트(태그 · 거래 수정)도 같다 — 바닥 왼쪽 [삭제] + 오른쪽 [저장] 으로, [Button](button.md) 의 모달 footer("삭제는 왼쪽 ghost + critical, 저장은 오른쪽")와 같은 꼴이다(2026-10-25 I-10). 바닥의 왼쪽 자리는 이 [삭제] 의 자리다 — 다른 버튼을 두지 않는다(앱 `PBottomSheetContent.footerRow` 는 이 [삭제] + 주 버튼 줄을 그리는 자리, 웹 · 레시피는 `BottomSheetFooter` 안에 [삭제] 를 먼저 둔다). 동작이 여럿이면 바닥이 아니라 머리 ⋮(위 "머리 오른쪽 동작") → [Menu Sheet](menu-sheet.md) 다. 목록 줄에는 ⋮ 를 두지 않는다([Menu](menu.md) 의 "줄의 동작", 2026-10-25 사용자 결정).

[그림: 바닥 왼쪽 삭제 — 상세(삭제 · 수정) · 수정이 없는 조회(삭제 하나)](../../site/components/specs/bottom-sheet.tsx#delete-guide)

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
| 머리 ⋮ 누르기 | 그 항목의 동작 목록 [Menu Sheet](menu-sheet.md) 를 연다(시트 위에 뜬다). 고른 동작이 확인을 열면 메뉴 시트가 닫힌 뒤 연다. |
| 머리 ← 누르기 | 두 단계 시트의 2단계 — 같은 시트 안에서 1단계로 한 단계 되돌린다(시트는 닫지 않는다). 2단계에 쓴 값이 있으면 먼저 "작성한 내용이 사라져요" 를 묻고, 돌아가면 그 값을 버린다. |
| 닫힌 뒤 | 200ms 로 내려가고, 초점은 연 자리(트리거)로 돌아간다. |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠근다. 초점은 시트 안을 돈다. |
| 키보드(폰) | 입력에 초점이 가면 시트가 키보드 위로 올라간다. |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 제목 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 `fg-neutral-muted` 7.11 · 다크 6.67 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 닫기 버튼은 아이콘 `fg-neutral`(16.41 · 11.62)이 버튼을 알린다 — 원 바탕(1.08 · 1.13)은 장식. 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ |
| **WCAG 2.4.3** Focus order | 열면 시트로, 닫으면 연 자리로 초점이 간다. 열린 동안 초점이 뒤 화면으로 나가지 않는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 닫기 버튼 44 · 머리 ← 44 · 머리 ⋮ 44 · 손잡이 44 · 바닥 버튼 48 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 닫기 버튼(보이는 원 28)은 누르는 영역 44 ✓ · 머리 ←(보이는 원 40)는 44 ✓ · 머리 ⋮(보이는 36)는 44 ✓ — 닫기와 겹치는 자리는 닫기가 받는다 · 바닥 버튼 48 ✓ |
| **ARIA** | `role="dialog"` + `aria-modal="true"`, 제목 `aria-labelledby` · 설명 `aria-describedby`, 닫기 버튼 이름 "닫기", 머리 ← 이름 "뒤로"(초점 차례 맨 앞 — ← → 제목 → 동작 → 닫기), 머리 ⋮ 이름 "{항목 이름} 더보기", 손잡이는 보조 기술에 숨긴다 |

## Do / Don't

### ✅ Do

- 1280 미만의 폼 · 상세 · 고르기를 시트로 — 1280 이상은 같은 내용을 Dialog 로.
- 입력 폼은 바깥 · 끌기로 닫지 않고, 바뀐 값이 있으면 닫기 전에 묻는다.
- 시트의 입력 폼은 위 닫기 + 바닥 저장 하나.
- 들어간 시트의 동작이 삭제 하나면 바닥 왼쪽 [삭제] `ghost` + `critical`.
- 처음부터 화면 높이의 90% 를 넘게 짠 내용은 페이지로 — 작은 화면 · 큰 글자로 넘친 것은 본문만 스크롤(끝 흐림은 위 "본문 끝 흐림" 기준).
- 한 시트 안 두 단계 흐름의 2단계는 머리 왼쪽 ← 로 1단계에 돌아간다 — 쓴 값이 있으면 묻고 버린다, 닫기 버튼은 그대로.

### ❌ Don't

- 닫기 버튼과 바닥 취소를 함께.
- 스냅 높이가 없는데 손잡이를 장식으로.
- 되돌릴 수 없는 확인을 시트로(Alert Dialog).
- 처음부터 화면을 넘게 짠 내용을 시트에 — 시트를 90% 로 늘려 버티기(페이지).
- 입력 폼 시트 위에 또 입력 폼 시트를 겹치기 — 그 위에는 고르기 시트(Input Button)와 확인창만 뜬다.
- 2단계 폼 맨 위에 "종류" 칸을 둬 단계를 건너 종류를 바꾸기 · 단계가 셋을 넘는 흐름을 시트 머리 ← 로 잇기(페이지) · ← 를 두고 닫기 버튼을 걷기.

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

### 2026-10-30 — 머리 오른쪽 동작 · 바닥 왼쪽 [삭제] 의 자리

구현 검수(I-10 · I-20)에서 정해 웹 · 앱 ds 가 먼저 만든 것을 적었다. ① 머리 오른쪽 동작(`headerAction`) — 2026-10-25 "동작이 여럿이면 들어간 화면 머리 ⋮" 의 시트 쪽 자리. yaml 에 축 `headerAction`(hidden · shown)과 부위 `headerAction` 을 더했다 — 값(Button ghost 아이콘만 36 · 닫기 왼쪽 4 · 닫기 원 가운데 · 누르는 44 · 이름 "{항목 이름} 더보기" · 초점 제목 → 동작 → 닫기 · 제목 오른쪽 80)은 구현한 웹(`headerAction` — 67de7f1c) · 앱(`PBottomSheetContent.headerAction`)에서 옮겼다. 레시피 `BottomSheetContent` · `DialogContent` · `ResponsiveDialogContent` 에 `headerAction` 을 더했다. ② 입력 폼 시트의 바닥 왼쪽 [삭제] — Button 모달 footer 와 같은 꼴(I-10 태그 수정), 바닥 왼쪽 자리는 [삭제] 의 자리다. 앱 `footerRow` 를 `deleteAction` 처럼 좁힐지는 정하지 않았다(이름 · API 는 그대로). 새 토큰 없음. 옛 스펙은 `bottom-sheet.history/v-pre-cleanup-1030.*`.

### 2026-10-29 — 두 단계 시트 머리 ←

사용자 결정 17-1 Q3 = A — 자산 추가처럼 한 시트 안에서 1단계(종류 고르기) → 2단계(폼)로 가는 흐름은 2단계 머리 왼쪽 ← 로 1단계에 돌아가 종류를 다시 고른다. 쓴 값이 있으면 "작성한 내용이 사라져요" 를 묻고 돌아가며 그 값을 버린다(사용자: "종류가 바뀐다는 건 폼의 입력 데이터를 초기화하는 게 맞음"). 고르지 않은 안: B(← 없이 2단계 폼 맨 위 "종류" 칸) — 다른 묶음으로 바꿀 때 쓴 값의 규칙을 새로 정해야 하고(그때 앱은 묻지 않고 지웠다) 폼이 칸 하나만큼 길어진다. 설명 https://claude.ai/artifact/2wHgeNPdst2q6LQzdD1AvS. yaml 에 축 `back`(hidden · shown)과 부위 `backButton` 을 더했다 — 값(원 40 · 아이콘 24 · 누르는 44 · 아이콘이 여백 24 · 제목 앞 4 · 제목 첫 줄 가운데 · 누름 `bg-neutral-weak-pressed`)은 구현한 Desk 웹(`onBack`) · 앱(`PBottomSheetContent.onBack`)에서 옮겼다. 레시피 `BottomSheetContent` · `DialogContent` · `ResponsiveDialogContent` 에 `onBack` 을 더했다. 새 토큰 없음.

### 2026-10-25 — 바닥 왼쪽 [삭제]

사용자 결정 — 목록 줄에는 ⋮ 를 두지 않고 줄을 누르면 들어간다. 들어간 시트의 동작이 하나(삭제)면 바닥 왼쪽 [삭제] `ghost` + `critical`(Button 모달 footer 꼴), 여럿이면 머리 ⋮ → Menu Sheet([Menu](menu.md) 의 "줄의 동작"). Anatomy · 여백 · "닫기 버튼과 바닥 버튼" 에 한 줄씩, yaml `footer.gap` 비고에 같은 말. 그림 delete-guide(상세 삭제 · 수정 · 삭제 하나)를 더했다. 값 변경 없음.

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
