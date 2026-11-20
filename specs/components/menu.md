# Menu

> 트리거에 붙어 열리는 동작 목록입니다. 줄을 누르면 바로 실행하고 닫힙니다. 1280 이상에서 쓰고, 같은 목록을 1280 미만에서는 [Menu Sheet](menu-sheet.md) 로 띄웁니다. 값을 고르는 일(테마 · 정렬 · 보기)은 Menu 가 아니라 [Select](select.md) · [Segmented Control](segmented-control.md) · [Radio](radio-group.md) 로 합니다.

메뉴는 묶음 · 묶음 이름 · 줄(앞 아이콘 · 이름 · 설명 · 뒤 아이콘)로 이루고, 선은 묶음 사이에만 긋습니다. 크기는 하나입니다 — 손가락으로 누르는 1280 미만은 Menu Sheet 가 맡습니다.

수치 원본은 [`menu.yaml`](menu.yaml)입니다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그립니다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보입니다.

[그림: 메모 화면 머리 ⋮ 메뉴 · 직원 표 줄 ⋮ 메뉴 — 라이트 · 다크](../../site/components/specs/menu.tsx#hero)

### 직접 골라 보기

아이콘 · 설명 · 묶음 이름 · 위험한 동작 · 막힌 줄을 고르면 스펙대로 그린 메뉴와 그 코드가 바뀝니다. 실제로 열고, 키보드로 옮기고, 눌러 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/menu.tsx#playground)

## Anatomy

[그림: 메뉴는 묶음 · 묶음 이름 · 선 · 줄로, 줄은 앞 아이콘 · 이름 · 설명 · 뒤 아이콘으로](../../site/components/specs/menu.tsx#anatomy)

| ⓐ Content | 메뉴 — 트리거 아래 8(모자라면 위 · 옆). 폭 200, 글이 길면 줄을 바꿉니다. |
| ⓑ Group | 묶음 — 줄 여럿. 묶음 사이에만 선을 긋습니다. |
| ⓒ Group Label | 묶음 이름 — 있을 때만. 누를 수 없습니다. |
| ⓓ Divider | 선 — 묶음 사이에만. 줄 사이에는 없습니다. |
| ⓔ Item | 줄 — 앞 아이콘 · 이름 · 설명 · 뒤 아이콘. 누르면 실행하고 닫힙니다. |
| ⓕ Highlight | 호버 · 누름 바탕 — 줄 폭 전체에서 좌우 8 들어오며 둥글어지는 알약. 키보드 포커스 링은 다 들어온 자리(좌우 8 · 모서리 12)에 그립니다. |

[표: 부위](menu.yaml#slots)

## Properties

### 줄 · 묶음 · 선

줄은 위아래 10 · 좌우 16 이고 이름 14 / 19, 아이콘 18, 아이콘 ↔ 이름 8 입니다 — 한 줄이면 39, 설명이 있으면 57 입니다. 글이 길면 말줄임 없이 줄을 바꿉니다(단어 단위). 메뉴는 위아래 8 을 두고, 묶음 사이는 8 + 선 1 + 8 입니다. 선은 좌우 16 들입니다.

호버 · 누름 바탕(`bg-layer-floating-pressed`)과 선(`stroke-neutral-subtle`)은 불투명한 색이고, Select 목록과 같습니다. 메뉴는 트리거의 오른쪽 끝에 맞추는 것(`end`)이 기본입니다 — 표 줄 끝 · 머리 오른쪽 ⋮ 의 메뉴가 표 · 화면 밖으로 나가지 않게 하기 위해서입니다.

[그림: 줄 · 묶음 · 선의 여백](../../site/components/specs/menu.tsx#layout)

[표: 공통](menu.yaml#base.enabled)

### Tone

되돌릴 수 없는 동작(삭제 · 나가기)은 `critical` 입니다 — 이름과 아이콘만 빨갛고 설명은 그대로입니다. 맨 아래 묶음에 따로 둡니다.

[그림: 위험한 동작 — 이름 · 아이콘만 빨강](../../site/components/specs/menu.tsx#tone)

[표: 위험한 동작](menu.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 바탕 없음 |
| `hovered` | 웹 — 마우스를 올린 줄에 알약 바탕(누름과 같은 색). 키보드 위치는 따로 움직입니다 |
| `pressed` | 알약 바탕 + 아이콘 · 글만 2px 거리 축소 |
| `focused` | 웹 — 키보드로 옮긴 줄에 알약 자리 2px 링. 바탕은 칠하지 않습니다 |
| `disabled` | 전용 색 — 눌러도 실행하지 않고 닫히지 않습니다. 화살표 키가 건너뜁니다 |

호버와 키보드 포커스를 다르게 그립니다 — 마우스가 한 줄 위에 있고 키보드 위치가 다른 줄에 있으면 둘 다 보입니다.

알약은 제자리에서 색만 나타나지 않습니다. 마우스를 올리거나 누르면 줄 폭 전체에서 좌우 0 → 8 들어오며 모서리 0 → 12 로 둥글어지고, 색과 함께 150ms 에 끝납니다. 떠날 때는 거꾸로 펴지며 투명해집니다. 키보드 포커스 링은 다 들어온 자리에 고정이라, 들어오는 중인 알약과 잠깐 폭이 다를 수 있습니다. [List](list.md) 의 누름 바탕 · [Searchable List](searchable-list.md) 의 강조 바탕도 같은 움직임입니다(들임 6).

[그림: 호버는 알약 바탕 · 키보드는 링 · 누름은 축소 · 막힌 줄](../../site/components/specs/menu.tsx#states)

[표: 상태](menu.yaml#matrix)

[표: 모션](menu.yaml#motion)

## Guidelines

### 메뉴에는 실행하는 동작만

Menu 는 누르면 바로 실행되는 명령 목록입니다. 값을 고르는 일은 메뉴에 두지 않습니다 — 메뉴에는 고른 표시(체크 · 라디오)가 없고, 고른 값을 저장하거나 화면에 반영하는 일은 그 값의 컴포넌트가 합니다.

| 이런 일 | 쓰는 것 |
|---|---|
| 들어간 화면 · 표 줄의 동작(수정 · 복사 · 삭제 · 내보내기) — 목록 줄에는 두지 않습니다(아래 "줄의 동작") | **Menu**(1280 미만 [Menu Sheet](menu-sheet.md)) |
| 폼에 넣을 값 고르기(결제 수단 · 카테고리) | [Select](select.md) · [Input Button](input-button.md) |
| 같은 내용의 보기 바꾸기 2 ~ 4개(목록 · 달력) | [Segmented Control](segmented-control.md) |
| 값 고르기 — 테마처럼 누르는 순간 바뀌는 설정 · 정렬 · 보기 | 테마는 [List](list.md) 의 라디오 줄, 정렬 · 보기는 [Segmented Control](segmented-control.md) · [Select](select.md) — 고르는 표는 Select 의 "고르는 컴포넌트 고르기" |
| 되돌릴 수 없는 확인 | 메뉴를 닫은 뒤 [Alert Dialog](alert-dialog.md) |

[그림: 메뉴는 실행만 — 테마 같은 값은 설정의 List 라디오 줄](../../site/components/specs/menu.tsx#role-guide)

메뉴 줄에 지금 값을 붙이지 않습니다. 계정 메뉴의 "화면 테마" 줄이 테마 고르기를 여는 자리여도 줄 끝에 "시스템" · "다크" 같은 값 글을 두지 않습니다. 메뉴 줄은 실행하는 동작의 이름뿐이고, 지금 값은 연 자리(라디오 줄)가 보입니다.

### 줄의 동작 — 목록 줄에는 ⋮ 를 두지 않는다

좁은 목록 줄([List](list.md) 줄 — 한두 줄 글 + 타일 · 값)에는 줄 끝 ⋮ 를 두지 않습니다. 줄을 누르면 한 단계 들어갑니다(상세 · 수정). 그 항목의 동작은 들어간 화면에 둡니다.

| 들어간 화면의 동작 | 두는 자리 |
|---|---|
| 하나(삭제) | 바닥 왼쪽 [삭제] — Button `ghost` + `critical`([Button](button.md) 의 "모달 footer" 꼴). 1280 미만 [Bottom Sheet](bottom-sheet.md) 도 같은 꼴입니다 |
| 여럿 | 머리 오른쪽 ⋮ 하나 — 이름 "{항목 이름} 더보기"(Button `ghost` · `iconOnly`) → Menu(1280 미만 [Menu Sheet](menu-sheet.md)) |

- 폰 목록의 [밀기](swipe-actions.md)는 같은 동작의 지름길로 남습니다 — 트레이의 동작은 모두 들어간 화면에도 있습니다.
- 줄에 ⋮ 를 둘 수 있는 건 **콘텐츠가 높은 카드의 머리**뿐입니다 — 사진 · 여러 줄 · 버튼이 든 카드 하나가 항목 하나일 때입니다([Card](card.md) 의 "머리 동작은 하나").
- 수정 · 삭제 아이콘을 줄마다 늘 보이게 늘어놓지 않습니다 — 줄마다 버튼이 둘셋씩 늘고, 아이콘만으로는 뜻을 다 전하지 못합니다.
- **표 줄은 이 규칙 밖입니다** — 데스크톱 데이터 표([Table](table.md))는 줄 끝 ⋮ 를 둡니다(동작이 둘 이상일 때). 줄의 동작이 하나면 ⋮ 대신 줄 끝 글 단추입니다(Button `ghost` small — 파괴적이면 `critical`). 768 미만에서 표가 [List](list.md) 줄로 바뀌면 위 목록 줄 규칙을 따릅니다.
- 들어갈 상세가 없는 목록 줄의 동작이 하나면 줄 끝 글 단추입니다 — [List](list.md) 의 "줄의 동작은 들어간 화면에".

[그림: 줄의 동작 — 줄은 ⋮ 없이 누르면 들어간다 · 들어간 화면 머리 ⋮ · 줄 끝 ⋮ · 늘 보이는 아이콘 묶음](../../site/components/specs/menu.tsx#row-guide)

### 묶음과 순서

가장 많이 쓰는 동작을 위에, 위험한 동작은 맨 아래 묶음에 따로 둡니다. 줄이 7개를 넘으면 묶음으로 나눕니다 — 선은 묶음 사이에만 긋습니다. 묶음 이름은 묶음이 무엇인지 말해야 할 때만 둡니다.

- 아이콘은 모든 줄에 두거나 모두 뺍니다. 아이콘만 두고 이름을 빼지 않습니다.
- 앞 아이콘과 뒤 아이콘을 한 줄에 함께 두지 않습니다. 뒤 아이콘은 바깥 링크처럼 방향을 알릴 때만 둡니다.
- 설명은 이름만으로 무엇을 하는지 모를 줄에만 한 줄로 둡니다 — 모든 줄에 두지 않습니다.

[그림: 묶음과 순서 — 자주 쓰는 것 위 · 위험한 것 맨 아래](../../site/components/specs/menu.tsx#group-guide)

### 1280 에서 Menu Sheet 로

같은 목록이 1280 미만에서는 [Menu Sheet](menu-sheet.md) 로 뜹니다 — 같은 줄 · 같은 순서 · 같은 막힘입니다. 메뉴는 마우스용(줄 39)이고, 손가락으로 누르는 화면은 시트(줄 52)가 맡습니다. 앱은 Menu 를 두지 않고 Menu Sheet 를 씁니다. 코드는 폭을 보고 둘 중 하나를 그리는 `ResponsiveMenu` 로 짭니다.

예외 — 사이드바에서 여는 목록은 Menu Sheet 로 바꾸지 않습니다. 사이드바가 보이는 768 ~ 1279 에서도 누른 자리 옆에 이 표면으로 뜹니다. 접힌 사이드바의 하위 목록은 아이콘 옆 펼침 메뉴(폭 200 · 줄 44 — [Side Navigation](side-navigation.md))이고, 그루 이음 사이드바 바닥 계정 줄의 계정 메뉴(내 정보 · 비밀번호 바꾸기 · 화면 테마 · 로그아웃)는 줄 오른쪽 · 아래 끝 맞춤 Menu 입니다. 768 ~ 1279 에서는 줄을 39 가 아니라 44 로 둡니다 — 펼침 메뉴와 같은 까닭(이 폭에 터치 태블릿이 섞입니다)입니다. 사이드바 옆에 붙어 뜨는 목록이 화면 아래 시트로 바뀌면 누른 자리와 떨어지기 때문입니다. 사이드바가 없는 768 미만(옆 패널 안 계정 줄)은 Menu Sheet 입니다.

[그림: 1280 에서 — 메뉴 ↔ 메뉴 시트](../../site/components/specs/menu.tsx#responsive-guide)

### 글

이름은 동사로 짧게(2 ~ 6자) 씁니다 — "수정" · "복사해 새로 쓰기" · "삭제". 한 메뉴 안에서는 말투와 형식을 맞추고, 줄임말 · 영어 섞기를 피합니다. 설명은 한 줄 문장(해요체 · 마침표)입니다 — "새 비밀번호를 메일로 보내요."

## 코드

레시피 `recipes/shadcn/components/ui/menu.tsx` 를 씁니다(Radix DropdownMenu 위, 비모달). 들어간 화면 머리의 ⋮ 처럼 폭마다 바뀌는 자리는 `ResponsiveMenu`(1280 이상 Menu · 미만 Menu Sheet)로 짜고, 늘 1280 이상인 자리(데스크톱 표의 줄)만 `Menu` 를 바로 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 들어간 화면 머리 ⋮ — 1280 에서 Menu Sheet 로 바뀐다

메모 목록 줄을 누르면 메모 화면으로 들어가고, 동작이 여럿(고정 · 수정 · 복사 · 삭제)이라 머리 오른쪽 ⋮ 하나에 모읍니다.

[그림: 메모 화면 머리 ⋮](../../site/components/specs/menu.tsx#ex-header)

```tsx
import {
  ResponsiveMenu, ResponsiveMenuContent, ResponsiveMenuGroup, ResponsiveMenuItem, ResponsiveMenuTrigger,
} from "@/components/ui/menu"

// 들어간 화면(메모)의 머리 오른쪽 — 목록 줄에는 ⋮ 를 두지 않는다
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

표 줄의 ⋮ 는 "줄의 동작" 규칙 밖이고 [Table](table.md) 의 규칙을 따릅니다.

[그림: 직원 표 줄 ⋮](../../site/components/specs/menu.tsx#ex-description)

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
| 트리거 누르기 | 엽니다 · 열려 있으면 닫습니다. 마우스로 열면 초점은 메뉴에 가고 링은 그리지 않습니다 |
| 트리거에서 `Enter` · `Space` · `↓` | 열고 첫 줄로 — `↑` 면 마지막 줄로 |
| `↓` · `↑` | 다음 · 이전 줄 — 끝에서 처음으로 돕니다. 막힌 줄은 건너뜁니다 |
| `Home` · `End` | 첫 줄 · 마지막 줄 |
| 글자 | 그 글자로 시작하는 줄로 — 한글은 첫 글자로 찾습니다(입력기가 조합 중이면 키가 오지 않아 동작하지 않을 수 있습니다) |
| 줄 누르기 · `Enter` · `Space` | 메뉴를 닫고 초점을 트리거로 돌린 뒤 실행합니다(닫히는 100ms 뒤) — 실행이 확인창 · 대화상자를 열어도 메뉴와 겹치지 않고, 그 창을 닫으면 초점이 ⋮ 로 돌아옵니다 |
| `Esc` | 닫습니다. 초점은 트리거로 |
| `Tab` | 닫고 다음 요소로 갑니다 |
| `Shift+Tab` | 닫고 트리거로 갑니다 |
| 바깥 누르기 | 닫습니다 — 비모달이라 뒤 화면을 숨기지 않고 스크롤도 잠그지 않습니다. 다른 칸 · 버튼을 눌렀으면 초점은 그곳에, 빈 자리를 눌렀으면 트리거로 |
| 마우스 호버 | 그 줄에 알약 바탕만 — 키보드 위치는 옮기지 않습니다 |
| 막힌 줄 누르기 | 실행하지 않고 닫히지 않습니다 |
| 실행이 확인을 부를 때 | 메뉴가 닫힌 뒤 [Alert Dialog](alert-dialog.md) 를 엽니다 — 닫히는 메뉴와 열리는 확인창이 겹치지 않게(위 "줄 누르기" 의 순서) |
| 글자 크기 설정 | 이름 · 설명 · 묶음 이름은 글자 크기 설정을 따라 커집니다. 메뉴 폭은 그대로라 줄을 바꾸고 줄 높이가 늘어납니다 — 말줄임하지 않습니다. 앞 · 뒤 아이콘은 px 로 그대로이고, 줄이 여러 줄이면 줄 전체의 세로 가운데에 섭니다. |
| 1280 아래로 줄면 | 열린 채 [Menu Sheet](menu-sheet.md) 로 바뀝니다(`ResponsiveMenu`). 묶음 이름은 시트에 자리가 없어 묶음 상자로만 나눕니다 |
| 대화상자 · 시트 안에서 | 그 위(L3)에 뜹니다. `Esc` · 바깥 누르기는 메뉴만 닫습니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 떠 있는 표면(`bg-layer-floating`) 위 16.41 · 다크 11.62, 설명 · 묶음 이름 `fg-neutral-subtle` 5.50 · 5.27, 위험 `fg-critical` 5.06 · 5.27 ✓. 막힌 줄은 예외(비활성) |
| **WCAG 1.4.4** Resize text | 이름 · 설명 · 묶음 이름이 글자 크기 설정을 따라 커지고, 폭이 정해진 메뉴 안에서 줄을 바꿔 모두 보입니다 ✓. 넘치면 메뉴 안에서 스크롤합니다 |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 Desk 8.38 · 5.28 · HR 8.17 · 5.26 ✓ — 호버 알약(1.06)은 장식이고, 위치는 링이 알립니다 |
| **WCAG 2.1.1** Keyboard | 열기 · 옮기기 · 실행 · 닫기 모두 키보드로 됩니다 |
| **WCAG 2.4.7** Focus visible | 키보드로 옮긴 줄에 늘 링 — 바탕색만으로 알리지 않습니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 39 × 184 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 39 ⚠ — 마우스용(1280 이상). 손가락으로 누르는 화면은 [Menu Sheet](menu-sheet.md)(줄 52) ✓ |
| **ARIA** | 트리거 `aria-haspopup="menu"` · `aria-expanded` · `aria-controls`, 메뉴 `role="menu"` + 트리거로 `aria-labelledby`, 줄 `role="menuitem"`(막히면 `aria-disabled="true"`), 묶음 `role="group"`(이름이 있으면 `aria-labelledby`). 선은 장식입니다. ⋮ 의 이름은 "{항목 · 화면 이름} 더보기"(표 줄은 "{줄 이름} 더보기") |

## Do / Don't

### ✅ Do

- 목록 줄은 ⋮ 없이 누르면 들어가고, 동작은 들어간 화면에 — 하나(삭제)면 바닥 왼쪽 [삭제], 여럿이면 머리 ⋮ 하나.
- 위험한 동작은 맨 아래 묶음에 `critical` 로.
- 이름은 동사로 짧게 — 한 메뉴 안에서 말투를 맞추기.
- 1280 미만에서는 같은 목록을 Menu Sheet 로.

### ❌ Don't

- 값을 고르는 데 메뉴를 쓰기 — 테마는 List 라디오 줄, 정렬 · 보기는 Segmented Control · Select.
- 좁은 목록 줄 끝마다 ⋮ — 줄에 ⋮ 를 둘 수 있는 건 콘텐츠가 높은 카드 머리뿐입니다(표 줄은 [Table](table.md)).
- 수정 · 삭제 아이콘을 줄마다 늘 늘어놓기.
- 일부 줄에만 아이콘.
- 메뉴 안에 메뉴(하위 메뉴) · 단축키 표기 · 체크 줄.
- 이름 없는 ⋮.

## Specification

`menu.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Menu 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — menu.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#menu)
