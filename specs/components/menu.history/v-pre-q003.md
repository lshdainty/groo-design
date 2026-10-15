# Menu

> 트리거에 붙어 열리는 동작 목록 — 줄을 누르면 바로 실행하고 닫힌다. 1280 이상에서 쓰고, 같은 목록을 1280 미만에서는 [Menu Sheet](menu-sheet.md) 로 띄운다. 값을 고르는 일(테마 · 정렬 · 보기)은 Menu 가 아니라 [Select](select.md) · [Segmented Control](segmented-control.md) · [Radio](radio-group.md) 다.

구조는 당근 [SEED Menu](https://seed-design.io/react/components/menu)(Apache-2.0)를 따른다 — 메뉴 · 묶음 · 묶음 이름 · 줄(앞 아이콘 · 이름 · 설명 · 뒤 아이콘), 묶음 사이에만 선. 크기는 SEED small 하나다(1280 미만은 Menu Sheet 가 맡는다). 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정). 옛 Dropdown Menu 를 대신하고, Context Menu · Menubar 는 걷었다.

수치 원본은 [`menu.yaml`](menu.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 메모 줄 ⋮ 메뉴 · 직원 줄 ⋮ 메뉴 — 라이트 · 다크](../../site/components/specs/menu.tsx#hero)

### 직접 골라 보기

아이콘 · 설명 · 묶음 이름 · 위험한 동작 · 막힌 줄을 고르면 스펙대로 그린 메뉴와 그 코드가 바뀐다. 실제로 열고, 키보드로 옮기고, 눌러 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/menu.tsx#playground)

## Anatomy

[그림: 메뉴는 묶음 · 묶음 이름 · 선 · 줄로, 줄은 앞 아이콘 · 이름 · 설명 · 뒤 아이콘으로](../../site/components/specs/menu.tsx#anatomy)

| ⓐ Content | 메뉴 — 트리거 아래 8(모자라면 위 · 옆). 폭 200, 글이 길면 줄을 바꾼다. |
| ⓑ Group | 묶음 — 줄 여럿. 묶음 사이에만 선을 긋는다. |
| ⓒ Group Label | 묶음 이름 — 있을 때만. 누를 수 없다. |
| ⓓ Divider | 선 — 묶음 사이에만. 줄 사이에는 없다. |
| ⓔ Item | 줄 — 앞 아이콘 · 이름 · 설명 · 뒤 아이콘. 누르면 실행하고 닫힌다. |
| ⓕ Highlight | 호버 · 누름 바탕 — 좌우 8 들인 알약. 키보드 포커스 링도 이 자리에 그린다. |

[표: 부위](menu.yaml#slots)

## Properties

### 줄 · 묶음 · 선

줄은 위아래 10 · 좌우 16 이고 이름 14 / 19, 아이콘 18, 아이콘 ↔ 이름 8 이다 — 한 줄이면 39, 설명이 있으면 57. 글이 길면 말줄임 없이 줄을 바꾼다(단어 단위). 메뉴는 위아래 8 을 두고, 묶음 사이는 8 + 선 1 + 8 이다. 선은 좌우 16 들인다.

[그림: 줄 · 묶음 · 선의 여백](../../site/components/specs/menu.tsx#layout)

[표: 공통](menu.yaml#base.enabled)

### Tone

되돌릴 수 없는 동작(삭제 · 나가기)은 `critical` — 이름과 아이콘만 빨갛고 설명은 그대로다. 맨 아래 묶음에 따로 둔다.

[그림: 위험한 동작 — 이름 · 아이콘만 빨강](../../site/components/specs/menu.tsx#tone)

[표: 위험한 동작](menu.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 |
| `hovered` | 웹 — 마우스를 올린 줄에 알약 바탕(누름과 같은 색). 키보드 위치는 따로 움직인다 |
| `pressed` | 알약 바탕 + 아이콘 · 글만 2px 거리 축소 |
| `focused` | 웹 — 키보드로 옮긴 줄에 알약 자리 2px 링. 바탕은 칠하지 않는다 |
| `disabled` | 전용 색 — 눌러도 실행하지 않고 닫히지 않는다. 화살표 키가 건너뛴다 |

호버와 키보드 포커스를 다르게 그린다 — 마우스가 한 줄 위에 있고 키보드 위치가 다른 줄에 있으면 둘 다 보인다.

[그림: 호버는 알약 바탕 · 키보드는 링 · 누름은 축소 · 막힌 줄](../../site/components/specs/menu.tsx#states)

[표: 상태](menu.yaml#matrix)

[표: 모션](menu.yaml#motion)

## Guidelines

### 메뉴에는 실행하는 동작만

Menu 는 누르면 바로 실행되는 명령 목록이다. 값을 고르는 일은 메뉴에 두지 않는다 — 메뉴에는 고른 표시(체크 · 라디오)가 없고, 고른 값을 저장하거나 화면에 반영하는 일은 그 값의 컴포넌트가 한다.

| 이런 일 | 쓰는 것 |
|---|---|
| 줄 · 화면의 동작(수정 · 복사 · 삭제 · 내보내기) | **Menu**(1280 미만 [Menu Sheet](menu-sheet.md)) |
| 폼에 넣을 값 고르기(결제 수단 · 카테고리) | [Select](select.md) · [Input Button](input-button.md) |
| 같은 내용의 보기 바꾸기 2 ~ 4개(목록 · 달력) | [Segmented Control](segmented-control.md) |
| 설정 값 고르기(테마 · 정렬) | [Segmented Control](segmented-control.md) · [Select](select.md) · [List](list.md) 의 라디오 줄 |
| 되돌릴 수 없는 확인 | 메뉴를 닫은 뒤 [Alert Dialog](alert-dialog.md) |

[그림: 메뉴는 실행만 — 테마 같은 값은 설정의 Segmented Control](../../site/components/specs/menu.tsx#role-guide)

### 줄의 동작 — ⋮ 하나와 메뉴

데스크톱 목록 · 표의 줄에서 동작은 줄 끝 ⋮ 하나로 연다 — 버튼 이름은 "{줄 이름} 더보기"(Button `ghost` · `iconOnly`). 줄 자체를 누르면 상세 · 수정이 열린다. 수정 · 삭제 아이콘을 줄마다 늘 보이게 늘어놓지 않는다 — 줄마다 버튼이 둘셋씩 늘고, 아이콘만으로는 뜻을 다 전하지 못한다. 1280 미만에서는 같은 ⋮ 가 [Menu Sheet](menu-sheet.md) 를 열고, 폰의 [스와이프](swipe-actions.md)는 같은 동작의 지름길로 남는다.

[그림: 줄의 동작 — ⋮ 하나 + 메뉴 · 늘 보이는 아이콘 묶음](../../site/components/specs/menu.tsx#row-guide)

### 묶음과 순서

가장 많이 쓰는 동작을 위에, 위험한 동작은 맨 아래 묶음에 따로 둔다. 줄이 7개를 넘으면 묶음으로 나눈다 — 선은 묶음 사이에만 긋는다. 묶음 이름은 묶음이 무엇인지 말해야 할 때만 둔다.

- 아이콘은 모든 줄에 두거나 모두 뺀다. 아이콘만 두고 이름을 빼지 않는다.
- 앞 아이콘과 뒤 아이콘을 한 줄에 함께 두지 않는다. 뒤 아이콘은 바깥 링크처럼 방향을 알릴 때만.
- 설명은 이름만으로 무엇을 하는지 모를 줄에만 한 줄로 — 모든 줄에 두지 않는다.

[그림: 묶음과 순서 — 자주 쓰는 것 위 · 위험한 것 맨 아래](../../site/components/specs/menu.tsx#group-guide)

### 1280 에서 Menu Sheet 로

같은 목록이 1280 미만에서는 [Menu Sheet](menu-sheet.md) 로 뜬다 — 같은 줄 · 같은 순서 · 같은 막힘. 메뉴는 마우스용(줄 39)이고, 손가락으로 누르는 화면은 시트(줄 52)가 맡는다. 코드는 폭을 보고 둘 중 하나를 그리는 `ResponsiveMenu` 로 짠다.

예외 하나 — 접힌 사이드바(768 ~ 1279)의 하위 목록은 Menu Sheet 로 바꾸지 않고 누른 아이콘 옆 펼침 메뉴(이 표면 · 폭 200 · 줄 44)로 띄운다([Side Navigation](side-navigation.md) — 사용자 결정 2026-10-08).

[그림: 1280 에서 — 메뉴 ↔ 메뉴 시트](../../site/components/specs/menu.tsx#responsive-guide)

### 글

이름은 동사로 짧게(2 ~ 6자) — "수정" · "복사해 새로 쓰기" · "삭제". 한 메뉴 안에서는 말투와 형식을 맞추고, 줄임말 · 영어 섞기를 피한다. 설명은 한 줄 문장(해요체 · 마침표)이다 — "새 비밀번호를 메일로 보내요."

## 코드

레시피 `recipes/shadcn/components/ui/menu.tsx` 를 쓴다(Radix DropdownMenu 위, 비모달). 줄의 동작처럼 폭마다 바뀌는 자리는 `ResponsiveMenu`(1280 이상 Menu · 미만 Menu Sheet)로 짜고, 늘 1280 이상인 자리(데스크톱 표의 머리)만 `Menu` 를 바로 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

### 줄의 ⋮ — 1280 에서 Menu Sheet 로 바뀐다

[그림: 메모 줄 ⋮](../../site/components/specs/menu.tsx#ex-row)

```tsx
import {
  ResponsiveMenu, ResponsiveMenuContent, ResponsiveMenuGroup, ResponsiveMenuItem, ResponsiveMenuTrigger,
} from "@/components/ui/menu"

<ResponsiveMenu>
  <ResponsiveMenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="주간 회의 메모 더보기">
      <EllipsisVertical />
    </Button>
  </ResponsiveMenuTrigger>
  {/* title — Menu Sheet 의 제목(1280 이상 메뉴에는 머리가 없다) */}
  <ResponsiveMenuContent title="주간 회의 메모">
    <ResponsiveMenuGroup>
      <ResponsiveMenuItem icon={<Pin />} label="고정" onSelect={pin} />
      <ResponsiveMenuItem icon={<Pencil />} label="수정" onSelect={edit} />
      <ResponsiveMenuItem icon={<Copy />} label="복사해 새로 쓰기" onSelect={duplicate} />
    </ResponsiveMenuGroup>
    <ResponsiveMenuGroup>
      {/* 확인이 필요한 동작 — 메뉴가 닫힌 뒤 Alert Dialog 를 연다 */}
      <ResponsiveMenuItem icon={<Trash2 />} label="삭제" tone="critical" onSelect={askDelete} />
    </ResponsiveMenuGroup>
  </ResponsiveMenuContent>
</ResponsiveMenu>
```

### 설명 · 막힌 줄 — 데스크톱 표

[그림: 직원 줄 ⋮](../../site/components/specs/menu.tsx#ex-description)

```tsx
import { Menu, MenuContent, MenuGroup, MenuItem, MenuTrigger } from "@/components/ui/menu"

<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="김하늘 더보기">
      <EllipsisVertical />
    </Button>
  </MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuItem label="수정" onSelect={edit} />
      {/* 설명 — 이름만으로 무엇을 하는지 모를 줄에만 */}
      <MenuItem label="비밀번호 초기화" description="새 비밀번호를 메일로 보내요." onSelect={reset} />
      <MenuItem label="휴가 내역 내보내기" disabled={!hasVacations} onSelect={exportVacations} />
    </MenuGroup>
    <MenuGroup>
      <MenuItem label="삭제" tone="critical" onSelect={askDelete} />
    </MenuGroup>
  </MenuContent>
</Menu>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 트리거 누르기 | 연다 · 열려 있으면 닫는다. 마우스로 열면 초점은 메뉴에 가고 링은 그리지 않는다 |
| 트리거에서 `Enter` · `Space` · `↓` | 열고 첫 줄로 — `↑` 면 마지막 줄로 |
| `↓` · `↑` | 다음 · 이전 줄 — 끝에서 처음으로 돈다. 막힌 줄은 건너뛴다 |
| `Home` · `End` | 첫 줄 · 마지막 줄 |
| 글자 | 그 글자로 시작하는 줄로 — 한글은 첫 글자로 찾는다(입력기가 조합 중이면 키가 오지 않아 동작하지 않을 수 있다 — SEED 도 같다) |
| 줄 누르기 · `Enter` · `Space` | 메뉴를 닫고 초점을 트리거로 돌린 뒤 실행한다(닫히는 100ms 뒤) — 실행이 확인창 · 대화상자를 열어도 메뉴와 겹치지 않고, 그 창을 닫으면 초점이 ⋮ 로 돌아온다 |
| `Esc` | 닫는다. 초점은 트리거로 |
| `Tab` | 닫고 다음 요소로 간다 |
| `Shift+Tab` | 닫고 트리거로 간다 |
| 바깥 누르기 | 닫는다 — 비모달이라 뒤 화면을 숨기지 않고 스크롤도 잠그지 않는다. 다른 칸 · 버튼을 눌렀으면 초점은 그곳에, 빈 자리를 눌렀으면 트리거로 |
| 마우스 호버 | 그 줄에 알약 바탕만 — 키보드 위치는 옮기지 않는다 |
| 막힌 줄 누르기 | 실행하지 않고 닫히지 않는다 |
| 실행이 확인을 부를 때 | 메뉴가 닫힌 뒤 [Alert Dialog](alert-dialog.md) 를 연다 — 닫히는 메뉴와 열리는 확인창이 겹치지 않게(위 "줄 누르기" 의 순서) |
| 1280 아래로 줄면 | 열린 채 [Menu Sheet](menu-sheet.md) 로 바뀐다(`ResponsiveMenu`). 묶음 이름은 시트에 자리가 없어 묶음 상자로만 나눈다 |
| 대화상자 · 시트 안에서 | 그 위(L3)에 뜬다. `Esc` · 바깥 누르기는 메뉴만 닫는다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 · 묶음 이름 `fg-neutral-subtle` 5.50 · 5.27, 위험 `fg-critical` 5.06 · 5.27 ✓. 막힌 줄은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 Desk 8.38 · 5.28 · HR 5.06 · 5.39 ✓ — 호버 알약(1.06)은 장식, 위치는 링이 알린다 |
| **WCAG 2.1.1** Keyboard | 열기 · 옮기기 · 실행 · 닫기 모두 키보드로 된다 |
| **WCAG 2.4.7** Focus visible | 키보드로 옮긴 줄에 늘 링 — 바탕색만으로 알리지 않는다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 39 × 184 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 39 ⚠ — 마우스용(1280 이상). 손가락으로 누르는 화면은 [Menu Sheet](menu-sheet.md)(줄 52) ✓ |
| **ARIA** | 트리거 `aria-haspopup="menu"` · `aria-expanded` · `aria-controls`, 메뉴 `role="menu"` + 트리거로 `aria-labelledby`, 줄 `role="menuitem"`(막히면 `aria-disabled="true"`), 묶음 `role="group"`(이름이 있으면 `aria-labelledby`). 선은 장식이다. ⋮ 의 이름은 "{줄 이름} 더보기" |

## Do / Don't

### ✅ Do

- 줄의 동작은 줄 끝 ⋮ 하나로 열고, 줄을 누르면 상세 · 수정.
- 위험한 동작은 맨 아래 묶음에 `critical` 로.
- 이름은 동사로 짧게 — 한 메뉴 안에서 말투를 맞춘다.
- 1280 미만에서는 같은 목록을 Menu Sheet 로.

### ❌ Don't

- 값을 고르는 데 메뉴를 쓰기 — 테마 · 정렬은 Segmented Control · Select.
- 수정 · 삭제 아이콘을 줄마다 늘 늘어놓기.
- 일부 줄에만 아이콘.
- 메뉴 안에 메뉴(하위 메뉴) · 단축키 표기 · 체크 줄.
- 이름 없는 ⋮.

## Specification

`menu.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Menu 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — menu.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#menu)

## SEED 와 다른 점

- **크기는 small 하나** — SEED medium(240 · 줄 46)은 터치 화면용인데, porest 는 1280 미만에서 Menu Sheet 를 쓴다(시트 · 대화상자 결정 1).
- **호버 · 누름 바탕은 불투명한 `bg-layer-floating-pressed`** · **선은 `stroke-neutral-subtle`** — SEED 의 투명도 있는 색(`bg.transparent-pressed` · `stroke.neutral-muted`)을 검사기가 받지 않는다(v102). Select 목록과 같다.
- **위험 색은 porest `fg-critical`** — 떠 있는 표면 위 5.06 · 5.27 이라 SEED critical(라이트 3.76)의 대비 문제가 없다.
- **설명 · 묶음 이름은 porest `fg-neutral-subtle`** — 5.50 · 5.27(SEED 3.42).
- **줄은 단어 단위로 줄을 바꾼다**(v114) — SEED 는 음절에서도 바꾼다.
- **z-index 는 specs/z-index.md 의 L3**(`z-floating` 200) — SEED 99999 는 Alert Dialog 위로 뜬다.
- **1280 에서 Menu Sheet 와 바뀌는 `ResponsiveMenu`** — SEED 는 둘을 따로 쓴다.
- **트리거 끝에 맞춘다** — SEED 기본은 가운데(`bottom`)라 줄 끝 ⋮ 의 메뉴가 표 밖으로 100 넘게 나간다. porest 는 오른쪽 끝(`end`)이 기본이다.

## Migration notes

### 2026-10-02 — SEED Menu 로 새로 둔다(옛 Dropdown Menu 를 대신)

사용자가 [비교 페이지](https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA)에서 여덟 가지를 모두 SEED 쪽으로 정했다 — Menu small · 1280 미만 Menu Sheet · 데스크톱 줄의 동작은 ⋮ + Menu · 폰 스와이프는 지름길로 남기고 ⋮ 도 · 메뉴는 실행만 · 비모달 키보드 · 쓰지 않는 능력 걷기 · 툴팁은 Help Bubble 모양의 보조. 옛 Dropdown Menu(160 · 줄 32 · 1px 테두리 · 모서리 8, 체크 · 라디오 · 단축키 · 하위 메뉴)는 걷었다 — 옛 스펙은 `dropdown-menu.history/v-pre-seed-menu.*`. 세 제품 모두 쓰는 곳이 없던 Context Menu · Menubar · Hover Card 도 걷었다(`context-menu.history` · `menubar.history` · `hover-card.history`).

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사 — Desk 웹 · HR 은 크로미움에 띄워 쟀고, Desk 앱은 위젯 테스트로 쟀다).

- **Desk 웹** — 메뉴는 상단 바 테마 메뉴 하나(모달, 지금 값이 어디에도 안 보인다 → 걷고 설정의 Segmented Control 로). 데스크톱 관리 화면 11곳이 줄마다 수정 · 삭제 아이콘을 늘 보이고 그중 6개는 이름 · 툴팁이 없다(→ ⋮ + Menu). 메뉴 초점 표시가 바탕색뿐이라 1.12 · 1.15:1, 위험 항목 다크 3.00. 사이드바 아래 사용자 버튼(⇕)은 메뉴처럼 보이는데 눌러도 아무 일이 없다.
- **Desk 앱** — PDropdownMenu 1곳(캘린더 공유 멤버 ⋮ — 이름 없음, 글자 15/600, 막힌 항목이 활성과 같은 색, 긴 이름 말줄임).
- **HR 웹** — 행 ⋮ 7곳(이름 0/7, 128 폭에서 "비밀번호 초기화" · 영어 이름이 두 줄로 접혀 줄이 32 ↔ 52), 초점 표시 1.06, 위험 3.76. 이동 메뉴 · 빵부스러기 메뉴는 모달, 행 ⋮ 는 비모달로 섞였다. 빵부스러기 … 는 이름이 "More Show more" 이고 16×16. 역할 목록 삭제 버튼은 늘 투명한데 눌린다.
- 앱 적용 때 화면마다 정할 자리 — Desk 앱 캘린더 공유 멤버 ⋮(Menu Sheet + 동사 이름 · 또는 웹처럼 권한 Select + 삭제 버튼), Desk 웹 사용자 버튼(⇕) · HR SpeedDial, HR 접힌 사이드바 · 빵부스러기(2026-10-04 · 10-08 정했다 — 접힌 사이드바의 하위는 1280 미만에서도 [Side Navigation](side-navigation.md) 의 펼침 메뉴(이 스펙의 1280 경계의 예외), 빵부스러기는 걷었다).
