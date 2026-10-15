# Swipe Actions

> 폰(768 미만) 목록 줄을 왼쪽으로 밀면 오른쪽에서 동작 버튼이 드러나는 지름길 — 줄을 열어 상세로 들어가지 않고도 수정 · 삭제 같은 잦은 동작에 바로 닿는다. iOS 메일 · 메시지의 스와이프와 같은 동작이다. 같은 동작은 늘 줄 끝 ⋮ → [Menu Sheet](menu-sheet.md) 로도 연다.

SEED 에는 줄 밀기가 없다 — 디자인 문서에 "스와이프" 가 한 번도 나오지 않고, 줄의 동작은 늘 보이는 버튼(List 끝 버튼 1 ~ 3개 · 표 그림의 ⋮ 열)으로 둔다. 원칙은 하나다 — "복잡한 제스처(예: 핀치 줌, 드래그)는 단순한 터치 동작으로도 수행 가능하도록 대체 방법을 제공합니다."(Inclusive Design, 당근 SEED, Apache-2.0). porest 는 미는 지름길을 남기고 같은 동작을 줄 끝 ⋮ 로도 열어(2026-10-02 사용자 결정) 그 원칙을 지킨다. 크기 · 판정 · 색은 porest 가 정했고, 2026-10-08 에 다크 배지 · 중립 배지 · 라벨 색 · 줄 높이 · `Esc` 뒤 초점을 고쳤다.

줄 자체를 다시 만들지 않는다 — **기존 줄을 감싸는 컨테이너**다. 줄의 모양 · 누르기는 그대로 두고 뒤에 동작 트레이를 붙인다. 그래서 거래 줄이든 할 일 줄이든 감싸기만 하면 같은 제스처를 얻는다. **동작은 고정 목록이 아니다** — 항목마다 할 수 있는 일이 달라서(문자함은 수정이 없고, 메모는 고정이 있다) 부르는 쪽이 1 ~ 3개를 조립한다. 스펙은 동작의 모양과 배치를 정하고, 무엇을 넣을지는 정하지 않는다.

수치 원본은 [`swipe-actions.yaml`](swipe-actions.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 가계부 줄을 밀어 연 트레이(수정 · 삭제) · 줄 끝 ⋮ — 라이트 · 다크](../../site/components/specs/swipe-actions.tsx#hero)

## Anatomy

[그림: 줄을 왼쪽으로 밀면 뒤에서 동작 칸(원형 배지 + 라벨)이 드러난다 — 첫 칸 앞 20 · 칸 사이 12, 마지막 칸은 화면 끝에](../../site/components/specs/swipe-actions.tsx#anatomy)

| ⓐ Row | 감싸는 목록 줄 — 높이 · 여백 · 바탕 모두 원래 줄의 것. 미는 동안 `translateX(−N)` 만 받는다. 닫혔을 때 초점을 받을 수 있다(`Esc` 로 돌아올 자리). |
| ⓑ Track | 줄 뒤에 드러나는 자리 — 바탕을 칠하지 않는다. 색을 깔면 줄 옆에 상자가 하나 더 생긴 것처럼 보인다. |
| ⓒ Action | 동작 한 칸 — 원형 배지 + 그 아래 라벨, 세로 가운데. 누르는 자리는 칸 전체. |
| ⓓ More Button | 줄 끝 ⋮ — 같은 동작을 Menu Sheet 로 여는 다른 길. |

[표: 부위](swipe-actions.yaml#slots)

## Properties

### Kinds

동작은 셋이다 — 곁 동작(`neutral` — 고정 · 보관 · 공유), 주 동작(`primary` — 수정), 되돌리기 어려운 동작(`destructive` — 삭제). 색은 원형 배지만 갖고 트레이는 칠하지 않는다.

- **배지는 그 동작의 글자색으로 채우고 아이콘은 반전 글자다** — `primary` 는 `fg-informative`, `destructive` 는 `fg-critical`, 아이콘은 `fg-neutral-inverted`. 라이트는 짙은 배지 + 흰 아이콘, 다크는 밝은 배지 + 짙은 아이콘이라 두 모드 모두 배지가 줄 바탕과 3:1 을 넘는다(라이트 5.06 · 5.09 · 다크 6.08 · 6.12). 다크에서 짙은 채움(`bg-critical-solid` · `bg-informative-solid`)을 그대로 쓰면 줄 바탕과 2.51 이다.
- **`neutral` 배지는 옅은 바탕(`bg-neutral-weak`) + 안쪽 1px `stroke-neutral-weak`** — 바탕만으로는 줄과 1.08 · 다크 1.30 이라 둘레를 테두리로 잡는다. 아이콘 `fg-neutral`(15.20 · 10.32)과 라벨이 동작을 말한다.
- **라벨은 배지 밖이라 본문 색이다** — `neutral` · `primary` 는 `fg-neutral-muted`, `destructive` 만 `fg-critical`(라이트 · 다크 한 토큰). 주 동작의 라벨을 파랑으로 칠하지 않는다 — 색은 배지가 말한다.

`destructive` 는 **가장 안쪽(화면에서 가장 왼쪽)** 에 둔다 — 조금만 밀면 바깥쪽 동작부터 드러나므로, 파괴적인 것을 바깥에 두면 제일 먼저 손에 닿는다. 부르는 쪽은 `[고정, 수정, 삭제]` 처럼 **뜻의 차례 그대로** 넘기고, 그리는 쪽이 뒤집는다.

[그림: 종류 — 고정(neutral) · 수정(primary) · 삭제(destructive), 라이트 · 다크](../../site/components/specs/swipe-actions.tsx#kinds)

[표: 종류별 색](swipe-actions.yaml#kind)

### Size

동작 칸은 크기가 하나다. 높이는 줄을 따른다.

- **배지 36 · 아이콘 18** — 줄 높이 안에 원과 라벨이 함께 들어가는 최대치. 40 은 라벨과 합쳐 넘친다(실측).
- **간격은 배지 앞에만** — 첫 칸 앞 20, 칸 사이 12. 뒤에도 두면 마지막 배지와 화면 끝이 벌어져 덜 열린 것처럼 보인다. 마지막 칸은 화면 끝에 붙는다 — 칸 폭은 첫 칸 56 · 다음부터 48, 트레이는 하나 56 · 둘 104 · 셋 152.
- **높이는 줄을 따르되 56 보다 낮으면 56** — 누르는 자리는 배지(36)가 아니라 칸 전체(48 ~ 56 × 줄 높이)다.
- **배지↔라벨 gap 2** — 배지 아래 라벨까지 한 덩어리로 읽히게 붙인다.
- **라벨 12 / 700 / 1.3** — 크기만 `t2` 이고 굵기 · 줄 높이는 이 컴포넌트의 값이다. 칸 폭 48 이 좁아 기본 줄 높이(16)면 두 줄에서 넘친다. 굵기는 버튼 글자와 같은 700 이다(v100 — 600 은 쓰지 않는다).
- 사각 채움이 아니라 원형인 이유 — 줄을 밀었을 때 색 덩어리가 화면을 반 가르지 않고 아이콘만 또렷하게 선다.

[그림: 크기 — 배지 36 · 아이콘 18 · 앞 20 · 사이 12 · 칸 56 · 48](../../site/components/specs/swipe-actions.tsx#size)

[표: 크기](swipe-actions.yaml#size)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 배지 색 그대로 |
| `hovered` | 웹 — 누름과 같은 모습(밝기 88%) |
| `pressed` | 배지 · 라벨 밝기 88% — 움직이지(축소 · 이동) 않는다. 손가락으로 밀어 둔 트레이와 이중으로 움직이면 어지럽다 |
| `focused` | 키보드 포커스에만 칸 안쪽 2px 링 — 트레이 바깥으로 나가면 줄 경계에서 잘린다 |
| `disabled` | 배지 `bg-disabled` · 아이콘 · 라벨 `fg-disabled` — 흐리게 하지 않는다(v106) |

[그림: 상태 — 기본 · 누름 · 포커스 · 막힘](../../site/components/specs/swipe-actions.tsx#states)

[표: 상태](swipe-actions.yaml#matrix)

[표: 공통](swipe-actions.yaml#base.enabled)

[표: 모션](swipe-actions.yaml#motion)

## Guidelines

### 지름길이다 — 같은 동작은 ⋮ 로

미는 법을 모르는 사람 · 키보드 · 스크린리더는 줄 끝 ⋮("{줄 이름} 더보기" — [Button](button.md) `ghost` · `iconOnly` · medium)로 같은 동작에 닿는다 — 1280 미만이라 [Menu Sheet](menu-sheet.md) 가 열린다(2026-10-02). 트레이와 시트는 같은 동작 · 같은 이름 · 같은 차례 · 같은 확인창이다. 스와이프로만 닿는 동작을 만들지 않는다. 줄을 누르면 상세(원래 동작)로 간다.

[그림: 같은 동작 — 밀어 연 트레이 · ⋮ 로 연 Menu Sheet](../../site/components/specs/swipe-actions.tsx#more-guide)

### 동작은 하나에서 셋까지

넷부터는 트레이가 줄 폭을 먹어 무엇을 미는지 안 보인다 — 자주 쓰는 셋까지만 트레이에 두고, 나머지는 ⋮ 에만 둔다. 파괴적 동작은 하나만, 가장 안쪽에.

[그림: 동작 둘 · 넷을 늘어놓은 트레이](../../site/components/specs/swipe-actions.tsx#count-guide)

### 파괴적 동작은 확인을 받는다

`destructive` 는 누른 즉시 실행하지 않고 확인 창([Alert Dialog](alert-dialog.md))을 띄운다 — 스와이프가 삭제까지의 거리를 줄이는 만큼, 줄어든 만큼을 확인 단계로 되돌려 놓는다. 트레이를 **먼저 닫고** 나서 띄운다 — 열어 둔 채 띄우면 취소하고 돌아왔을 때 그대로 열려 있고, 실행한 경우엔 사라진 줄 자리에 트레이만 남는다.

**확인 창의 제목 · 설명은 상세 경로와 같은 문구다** — 같은 계좌를 상세에서 지우든 밀어서 지우든 "계좌 삭제" 다. 결과가 같은 동작이 길에 따라 다른 말로 뜨면 사람은 그것을 다른 일로 읽는다. 이 컴포넌트는 감싼 줄이 무엇인지 모르므로 **문구는 그 줄을 아는 부르는 쪽이 넘긴다**. 확인 버튼은 누른 동작의 라벨 그대로다(`삭제` 를 눌렀으면 확인도 `삭제`) — 방금 누른 버튼의 연장이라 길과 상관없이 같다. ⋮ → Menu Sheet 로 지울 때도 같은 확인 창이다.

[그림: 삭제 — 트레이가 닫히고 상세와 같은 확인 창("계좌 삭제")](../../site/components/specs/swipe-actions.tsx#confirm-guide)

### 끝까지 밀어도 실행하지 않는다

iOS 메일은 끝까지 밀면 바로 지우지만, 그것은 되돌리기가 있기 때문이다. 여기엔 없다 — 밀다가 손이 미끄러져 지워지는 것보다 한 번 더 누르는 게 낫다. 끝까지 밀어도 트레이가 열릴 뿐이다.

### 제스처 판정

목록에서 주 동작은 **세로 스크롤**이다. 가로 제스처는 세로를 방해하지 않는 선에서만 가져간다.

| 항목 | 값 | 이유 |
|---|---|---|
| 데드존 | 8px | 이보다 짧은 이동은 누르기로 본다. 축을 판정하지 않는다. |
| 축 확정 | `abs(dx) > abs(dy) × 1.5`(≈ 33.7° 이내) | 45°(1배)로 잡으면 세로로 훑는 중 손가락이 조금만 기울어도 스크롤이 끊긴다. |
| 세로 스크롤 | `touch-action: pan-y` 로 **브라우저에 남긴다** | `preventDefault` 로 직접 처리하지 않는다 — 관성 · 튕김이 OS 것과 달라진다. |
| 미는 동안 | 글 고르기 · 길게 누름 메뉴 막음 | 가로로 미는 동안 선택 손잡이 · 메뉴가 뜨면 제스처가 죽는다. |
| 열기 | 트레이 폭의 **40%** 이상 밀고 놓으면 열린 채로 | 2개 트레이(104)면 41.6 |
| 닫기 | 열린 채 되돌려 민 거리가 트레이 폭의 **25%** 이상 | 여는 문턱(40%)을 닫는 쪽에 같이 걸면 두 범위가 맞물려 아예 열리지 않는다 |

세로로 확정된 제스처는 손을 뗄 때까지 가로로 되돌리지 않는다 — 판정이 도중에 바뀌면 줄이 스크롤 중에 흔들린다.

### 폰 전용

데스크톱에서는 트레이를 쓰지 않는다 — 마우스로 줄을 미는 건 익숙한 동작이 아니고, 넓은 화면의 줄 동작은 줄 끝 ⋮ → [Menu](menu.md) 다. 판정은 뷰포트 폭이다(768 미만) — 포인터 종류(`pointer: coarse`)로 가르지 않는다(터치 노트북이 데스크톱 화면에서 스와이프를 갖게 된다). 768 이상에서는 감싸기를 걷어내 줄을 그대로 통과시킨다.

| | 폰(768 미만) | 768 이상 |
|---|---|---|
| 트레이 | 밀어서 연다 | 없음 — 줄만 |
| 동작에 닿는 길 | 밀기(지름길) · 줄 끝 ⋮ → Menu Sheet | 줄 끝 ⋮ → Menu Sheet(1280 미만) · Menu(1280 이상) |
| 줄 누르기 | 상세 | 상세 |

[그림: 폰은 트레이 + ⋮ · 데스크톱은 ⋮ + Menu](../../site/components/specs/swipe-actions.tsx#platform-guide)

### RTL

미는 방향이 뒤집힌다 — RTL 에서는 **오른쪽으로** 밀고 트레이가 **왼쪽**에서 나온다. `translateX` 부호와 트레이 정렬을 `:dir(rtl)` 로 가른다. 동작 차례는 그대로다(가장 파괴적인 것이 손가락이 끝까지 간 쪽).

### 글

라벨은 동사로 짧게 — 한글 두 글자("수정" · "삭제" · "고정"). 그보다 길면 줄바꿈된다. 동작의 이름은 "라벨: 줄 제목"("삭제: 스타벅스")이다.

## 코드

레시피 `recipes/shadcn/components/ui/swipe-actions.tsx` 를 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

- `SwipeActions` — 줄을 감싼다. `actions`(1 ~ 3개 — `{ kind, label, icon, disabled, onSelect }`, 뜻의 차례로) · `enabled`(폰일 때만 `true` — 768 이상이면 `false` 로 넘겨 줄만 그린다) · `rowLabel`(동작 이름에 붙는 줄 제목 — "삭제: 스타벅스"). 동작을 누르면 트레이를 닫은 뒤 `onSelect` 를 부른다. 감싼 줄은 `tabIndex={-1}` 로 초점을 받을 수 있고, 열린 트레이를 `Esc` 로 닫으면 초점을 줄로 옮긴다.
- `SwipeActionsMenu` — 줄 끝 ⋮. 같은 `actions` 와 `rowLabel` 을 받아 [Menu](menu.md) 의 `ResponsiveMenu` 로 그린다(이름 "{rowLabel} 더보기" · `destructive` 는 `tone="critical"` · 같은 차례). 트레이와 시트가 한 배열에서 나온다.
- 한 번에 한 줄만 열리기 · 스크롤하면 닫히기는 목록의 조상(`SwipeActionsProvider`)이 맡는다 — 줄 하나는 다른 줄의 상태를 모른다.

### 가계부 줄

[그림: 거래 줄 — 밀면 수정 · 삭제, 끝에 ⋮](../../site/components/specs/swipe-actions.tsx#ex-row)

```tsx
import { Pencil, Trash2 } from "lucide-react"
import { ListButtonItem } from "@/components/ui/list"
import { SwipeActions, SwipeActionsMenu, type SwipeAction } from "@/components/ui/swipe-actions"

const actions: SwipeAction[] = [
  { kind: "primary", label: "수정", icon: <Pencil />, onSelect: () => edit(tx) },
  // 확인 창은 상세에서 지울 때와 같은 문구 — 부르는 쪽이 넘긴다
  { kind: "destructive", label: "삭제", icon: <Trash2 />, onSelect: () => confirmDelete({ title: "거래 삭제", description: `${tx.title} 거래를 지울까요?` }) },
]

<SwipeActions actions={actions} enabled={isPhone} rowLabel={tx.title}>
  <ListButtonItem
    prefix={<CategoryTile category={tx.category} />}
    title={tx.title}
    detail={tx.meta}
    suffix={<><Amount value={tx.amount} /><SwipeActionsMenu actions={actions} rowLabel={tx.title} /></>}
    onClick={() => openDetail(tx)}
  />
</SwipeActions>
```

## Behavior

| 상황 | 동작 |
|---|---|
| 왼쪽으로 끌기 | 줄이 손가락을 따라간다. 최대 이동 = 칸 폭의 합(56 · 104 · 152) — 더 밀어도 움직이지 않는다 |
| 놓음 — 트레이 폭의 40% 미만 | 닫힌다 |
| 놓음 — 40% 이상 | 열린 채로 자리를 잡는다 |
| 열린 채 되돌려 밀기 | 트레이 폭의 25% 이상이면 닫힌다 |
| 열린 채 줄 누르기 | **닫기만** 한다 — 상세로 들어가지 않는다(열어 둔 걸 못 보고 누르는 일이 많다) |
| 동작 누르기 | 트레이를 **먼저 닫고** 실행한다(확인이 있으면 닫은 뒤 확인 창) |
| 다른 줄을 끌기 · 목록 스크롤 | 열린 줄이 닫힌다 — **한 번에 하나만** 열린다 |
| 오른쪽으로 끌기 | 아무 일도 없다(RTL 은 반대) |
| 끝까지 밀기 | 동작을 실행하지 않는다 — 트레이가 열릴 뿐이다 |
| 줄 끝 ⋮ 누르기 | Menu Sheet — 같은 동작 · 같은 확인 창 |
| `Esc`(열린 트레이) | 닫고 초점을 줄로 — 숨긴 트레이 버튼에 초점이 남지 않는다 |
| 열림 · 닫힘 | 150ms(`motion-duration-d3`) 감속(`motion-ease-enter`). 끄는 동안은 손가락을 1:1 로 따라가며 모션이 없다. 모션 줄이기면 바로 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 라벨 `fg-neutral-muted` 줄 바탕 위 7.11 · 다크 7.70, `destructive` 라벨 `fg-critical` 5.06 · 다크 6.08 ✓ |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | `primary` · `destructive` 배지 줄 바탕 위 5.09 · 5.06 · 다크 6.12 · 6.08 ✓, 배지 안 아이콘 같은 값 ✓. `neutral` 배지는 바탕 1.08 · 1.30 · 테두리 1.23 · 1.56 — 둘레는 장식이고 아이콘 `fg-neutral`(15.20 · 10.32)과 라벨이 동작을 말한다 |
| **WCAG 2.1.1** Keyboard | 스와이프는 포인터 제스처라 **줄 끝 ⋮** 로 같은 동작에 닿는다 ✓ — 줄 누르기 → 상세도 남는다 |
| **WCAG 2.5.1** Pointer gestures | 한 손가락 끌기(여러 손가락 · 경로 제스처가 아니다) + ⋮ 한 번 누르기로 같은 동작 ✓ |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 칸 48 ~ 56 × 줄 높이 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 칸 48 ~ 56 × 56 이상 ✓ — 배지(36)가 아니라 칸 전체가 눌린다 |
| **ARIA** | 트레이는 닫힌 동안 `aria-hidden="true"` · 버튼 `tabindex="-1"` — 안 그러면 스크린리더가 줄마다 "수정 삭제" 를 읽는다. 동작 이름은 "라벨: 줄 제목". ⋮ 는 "{줄 이름} 더보기" · `aria-haspopup="menu"`. 앱은 트레이 대신 줄의 맞춤 동작(custom action)을 두지 않는다 — ⋮ 가 그 길이다 |
| **Reduced motion** | 열림 · 닫힘 모션을 끄고 바로 바꾼다. 끌기 따라가기는 모션이 아니라 그대로 |

## Do / Don't

### ✅ Do

- 동작 1 ~ 3개, 파괴적인 것은 가장 안쪽 하나.
- 같은 동작을 줄 끝 ⋮ → Menu Sheet 로도 — 한 배열에서.
- 삭제는 트레이를 닫고 확인 창 — 제목 · 설명은 상세 경로와 같은 문구, 확인 버튼은 누른 동작의 라벨.
- 배지는 동작의 글자색 + 반전 아이콘 — 다크도 줄 바탕과 3:1 을 넘게.
- `Esc` 로 닫으면 초점을 줄로.

### ❌ Don't

- 동작 넷 이상 · 파괴적 동작 여럿.
- 스와이프를 유일한 길로 — 키보드 · 스크린리더가 닿지 못한다.
- 누르는 즉시 삭제 · 끝까지 밀면 실행.
- 길에 따라 다른 확인 문구(상세 "계좌 삭제" · 밀기 "삭제").
- 다크에서 짙은 채움 배지(2.51) · 테두리 없는 중립 배지 · 파랑 주 동작 라벨.
- 트레이 바탕을 칠하기 · 데스크톱에서 트레이.

## Specification

`swipe-actions.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Swipe Actions 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — swipe-actions.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#swipe-actions)

## SEED 와 다른 점

- **porest 에만 있는 패턴이다** — SEED 에는 줄 밀기가 없고 줄의 동작을 늘 보이는 버튼으로 둔다. porest 는 미는 지름길을 남기고 같은 동작을 ⋮ 로도 연다 — SEED 의 "대체 방법" 원칙을 ⋮ 가 맡는다.
- **판정 값은 porest** — 데드존 8 · 축 1.5배 · 열기 40% · 닫기 25%. SEED 가 가진 끌기 판정은 시트 끌어 닫기(크기 25% 또는 속도 0.4 px/ms) 하나다.
- **파괴적 동작 색은 SEED Menu 의 Critical 과 같은 뜻** — 값은 porest 의 `fg-critical`.

## Migration notes

### 2026-10-08 — 다크 배지 · 중립 배지 · 라벨 · Esc 뒤 초점

사용자가 [데이터 표시 비교 페이지](https://claude.ai/artifact/85zjM3PRBiEGnqjXXRrPRj)의 "따라오는 것" 에서 정했다 — ⋮ 이행 · 다크 배지 3:1 이상 · 중립 배지 테두리 · 라벨 색은 스펙대로 · 줄 높이 1.3 · `Esc` 뒤 초점은 줄로. 스펙 안의 어긋남도 걷었다 — 확인 창 제목을 Behavior 는 "상세 경로와 같은 문구", Do / Don't 는 "누른 동작 라벨" 이라 적었다(앞의 것이 2026-08 의 결정이다). 위험 라벨의 다크 대비를 Kinds 는 2.87, Accessibility 는 3.0 으로 적었다 — 이제 `fg-critical` 한 토큰이라 다크 6.08 이다. 옛 스펙은 `swipe-actions.history/v-pre-seed-data.*` 에 남겼다.

| 옛 Swipe Actions | 새 Swipe Actions |
|---|---|
| 배지 `primary` `info` · `destructive` `error` 채움(다크 짙은 채움 — 줄과 2.51) | 배지 `fg-informative` · `fg-critical` + 아이콘 `fg-neutral-inverted` — 다크는 밝은 배지(6.12 · 6.08) |
| `neutral` 배지 `surface-input`(줄과 1.08 · 1.30) | `bg-neutral-weak` + 안쪽 1px `stroke-neutral-weak` |
| 라벨 12 / 600 / 1.3 · 위험 라벨 `error` · 다크 `error-light` | 12 / 700 / 1.3 · `fg-neutral-muted` · 위험 `fg-critical`(한 토큰) |
| 비활성 불투명도 0.4 · 링 `border-focus` | `bg-disabled` · `fg-disabled` · 링 `stroke-focus-ring` |
| 열림 · 닫힘 `motion-duration-fast` · `motion-ease-out` | `motion-duration-d3` · `motion-ease-enter`(같은 150ms · 감속) |
| 문서에 그림 · 코드 없음 | SEED 시대 스펙 모양 — 그림 · 코드 · Specification |

제품은 앱 적용 단계에서 옮긴다(2026-10-08 조사 — Desk 웹은 크로미움 390 터치로 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **⋮ 이행 0곳** — 웹 11(가계부 `pages/expense/ui/ExpensePage.tsx:2225` · 할 일 `TodoMobileLedger.tsx:521` · 메모 `MemoPage.tsx:624` · 캘린더 라벨 · 할 일 태그 · 메모 태그 `CalendarLabelsSection.tsx:228` · `TodoTagManager.tsx:227` · `MemoTagManager.tsx:233` · 예산 · 계좌 · 저축 목표 · 프리셋 · 반복 거래 `BudgetManager.tsx:652` · `AccountManager.tsx:349` · `SavingGoalManager.tsx:104` · `PresetManager.tsx:327` · `RecurringManager.tsx:659`) · 앱 12(`expense_screen.dart:1338` · `todo_screen.dart:1078` · `memo_screen.dart:367` · `calendar_labels_screen.dart:192` · `todo_tag_management_screen.dart:268` · `memo_tag_management_screen.dart:272` · `budget_settings_screen.dart:780` · `account_card_manage_screen.dart:213` · `saving_goal_screen.dart:200` · `preset_screen.dart:199` · `recurring_screen.dart:282` · `sms_inbox_screen.dart:208`) 모두 줄 끝 ⋮ 가 없다. 웹 줄 안 `MoreVertical` · `EllipsisVertical` 0, 앱 Menu Sheet 0. `SwipeActionsMenu` 로 같은 배열에서.
- **다크 배지 2.51 · 중립 배지 1.08** — 다크 위험 #CC0E17 · 주 #0F65BF 가 줄 #242938 위 2.51(웹 · 앱 같음), 앱 중립 배지 #F5F6FA 1.08 · 다크 #353B4D 1.30(`shared/widgets/p_swipe_actions.dart:234-256`, D18). 배지 색 규칙대로.
- **앱 라벨** — 줄 높이 1.5(웹 1.3), 주 동작 라벨이 파랑 #1D6EC9 · 다크 #69ABFF(스펙은 회색). 1.3 · `fg-neutral-muted` 로.
- **웹 `Esc` 뒤 초점** — 닫히지만 초점이 숨은 '삭제' 버튼에 남는다(`shared/ui/swipe-actions.tsx:393-395` — 줄 `rowRef` 에 `tabIndex` 가 없다, D18). 줄에 `tabIndex={-1}` · 닫으면 줄로.
- **앱 스크린리더 길 0** — 트레이가 의미 트리에 없고 맞춤 동작(custom action)도 0 이라 닫힌 트레이의 동작에 닿을 길이 없다. ⋮ 를 두면 맞춤 동작은 두지 않아도 된다. 앱 열린 트레이의 이름은 "삭제" 뿐이다(줄 이름 없음) — "삭제: {줄 제목}" 으로.
- **햅틱 0** — 웹 `vibrate` · 앱 `HapticFeedback` 모두 0. 열림 햅틱은 이번에 정하지 않았다.

### 이전 기록

- **2026-10-02 — 스와이프는 지름길, ⋮ 가 대신 길.** 사용자가 [메뉴 비교 페이지](https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA)에서 정했다 — 미는 지름길은 그대로 두고, 같은 동작을 줄 끝 ⋮ → Menu Sheet 로도 연다. 전에는 대신 길이 "줄 누르기 → 상세" 뿐이라 닫힌 트레이를 키보드 · 스크린리더가 열 길이 없었다. 데스크톱은 같은 ⋮ 가 Menu 를 연다. 옛 스펙은 `swipe-actions.history/v-pre-seed-menu.md`.
- **2026-08 — 확인 창 제목은 상세 경로와 같은 문구.** 제목을 동작 라벨로 고정했더니 같은 계좌를 상세에서 지우면 "계좌 삭제", 밀어서 지우면 "삭제" 로 갈렸다 — 화면 간 갈림을 막으려다 길 간 갈림을 고정한 꼴이었다. 부르는 쪽이 문구를 넘기고, 확인 버튼만 동작 라벨 그대로다. 그 전에는 앱이 `PSwipeActions._run()` 에서 `title: action.label` 로 넘기고, 웹만 `SwipeConfirm.title` 을 부르는 쪽이 채워 네 화면이 갈렸다("거래 삭제" · "할일 삭제" · "메모 삭제" · "계좌 삭제").
- **2026-08 — "관리형 화면은 기존 UI 유지" 를 걷었다.** 같은 일을 두 방법으로 하게 되는 건 줄에 편집 버튼이 이미 보일 때고, 모바일 관리 줄은 화살표만 있지 그 버튼이 없다. 중복을 막는 장치는 "줄 누르기 = 상세(원래 동작)" 다. 적용 대상은 고정 목록이 아니다 — 세로 목록이고 줄마다 할 수 있는 일이 있으면 붙는다.
- **v1 — 72px 사각 트레이**(`swipe-actions.history/v1-rect-tray.md`). 실기기에서 색 덩어리가 화면을 반 갈라 줄보다 트레이가 먼저 눈에 들어왔다. 원형 배지로 바꾸고 트레이 바탕을 걷어 색이 아이콘에만 남게 했다. 처음 붙인 곳은 가계부 · 문자함 · 할 일 · 메모 — 문자함은 수정이 없어 삭제 하나뿐이라 동작이 조립형이어야 했다. 메모는 2열 카드 격자라 세로 목록으로 바꾼 뒤 붙였다(로딩 스켈레톤도 같이 바꿨다).
