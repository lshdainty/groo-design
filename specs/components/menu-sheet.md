# Menu Sheet

> 화면 아래에서 올라오는 동작 목록입니다. 1280 미만에서 [Menu](menu.md) 대신 뜨고, 같은 줄 · 같은 순서입니다. 들어간 화면 머리의 ⋮ 가 엽니다 — 목록 줄에는 ⋮ 를 두지 않습니다([Menu](menu.md) 의 "줄의 동작"). 폰의 [스와이프](swipe-actions.md)는 같은 동작의 지름길로 남습니다. 입력 폼 · 상세 · 고르기는 [Bottom Sheet](bottom-sheet.md), 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md) 를 씁니다.

시트는 딤 · 시트 · 손잡이 · 머리(제목 · 설명) · 묶음 · 줄로 이룹니다. 딤 · 끌어내리기 · 안전 영역 · 모션은 [Bottom Sheet](bottom-sheet.md) 와 같고, 다른 것은 손잡이가 늘 있고 위 닫기 버튼이 없다는 것입니다. 보이는 닫기 버튼 대신 보조 기술 · 키보드용 닫기를 목록 뒤에 둡니다 — 평소에는 숨기고 키보드 초점이 오면 보입니다. 끌기 · 딤 · 뒤로 가기로 닫히는 시트라 보이는 버튼을 더할 까닭이 없습니다.

수치 원본은 [`menu-sheet.yaml`](menu-sheet.yaml)입니다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그립니다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보입니다.

[그림: 메모 화면 머리 ⋮ 의 메뉴 시트 · 메모 목록 머리 더보기 — 라이트 · 다크](../../site/components/specs/menu-sheet.tsx#hero)

### 직접 골라 보기

아이콘 · 머리 · 묶음 수 · 줄 설명 · 위험한 동작 · 막힌 줄을 고르면 스펙대로 그린 시트와 그 코드가 바뀝니다. 실제로 열고, 끌어내리고, 눌러 닫을 수 있습니다.

[그림: 플레이그라운드](../../site/components/specs/menu-sheet.tsx#playground)

## Anatomy

[그림: 메뉴 시트는 딤 · 시트 · 손잡이 · 머리 · 묶음 · 줄로](../../site/components/specs/menu-sheet.tsx#anatomy)

| ⓐ Overlay | 딤 — 누르면 닫힙니다. |
| ⓑ Container | 시트 — 위 두 모서리만 둥급니다(20). 넓은 화면에서는 480 으로 가운데에 섭니다. |
| ⓒ Handle | 손잡이 — 늘 있습니다. 끌어내리면 닫힙니다. |
| ⓓ Header | 머리 — 무엇의 동작인지 제목(가운데) · 설명. 없어도 됩니다. |
| ⓔ Group | 묶음 — 옅은 회색 상자(모서리 16). 묶음 사이는 간격만 둡니다. |
| ⓕ Item | 줄 — 앞 아이콘 · 이름 · 설명. 줄 사이에 선을 긋고, 묶음의 마지막 줄 아래에는 긋지 않습니다. |

[표: 부위](menu-sheet.yaml#slots)

## Properties

### 머리 · 묶음 · 줄

시트는 위 24(손잡이 자리) · 좌우 화면 여백 24 · 아래 16 + 안전 영역입니다. 머리는 가운데 정렬입니다 — 제목 18 / 24 · 700, 설명 14 / 19, 그 아래 16. 묶음은 옅은 회색 상자(모서리 16)이고 묶음 사이는 10 입니다. 줄은 최소 52 · 위아래 14 · 좌우 16 이고 이름 16 / 22, 아이콘 22, 아이콘 ↔ 이름 14 입니다.

줄 사이 선은 `stroke-neutral-weak` 입니다 — `stroke-neutral-subtle` 은 다크에서 묶음 바탕과 같은 색이라 선이 사라지기 때문입니다.

[그림: 머리 · 묶음 · 줄의 여백](../../site/components/specs/menu-sheet.tsx#layout)

[표: 공통](menu-sheet.yaml#base.enabled)

### Layout

아이콘을 쓰면(`textWithIcon`) 글은 왼쪽 정렬이고, 아이콘 없이 글만 쓰면(`textOnly`) 가운데 정렬입니다 — 그때는 줄 설명을 두지 않습니다. 한 시트에서 둘을 섞지 않습니다.

[그림: 아이콘 + 글 · 글만](../../site/components/specs/menu-sheet.tsx#layouts)

[표: 정렬](menu-sheet.yaml#layout)

### Tone

되돌릴 수 없는 동작(삭제 · 나가기)은 `critical` 입니다 — 이름과 아이콘만 빨갛고 설명은 그대로입니다. 맨 아래 묶음에 따로 둡니다. 마우스를 올리거나 누르는 동안은 이름 · 아이콘을 한 단계 짙은 `fg-critical-contrast` 로 바꿉니다 — 누름 바탕 위에서 `fg-critical` 은 라이트 4.39 · 다크 3.91 로 4.5:1 에 못 미치기 때문입니다.

[표: 위험한 동작](menu-sheet.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 묶음 바탕 그대로 |
| `hovered` | 웹 — 마우스를 올린 줄의 바탕(누름과 같은 색). 설명은 `fg-neutral-muted` 로 |
| `pressed` | 줄 바탕 `bg-neutral-weak-pressed` + 아이콘 · 글만 2px 거리 축소. 설명은 `fg-neutral-muted` 로 — 누름 바탕 위에서 `fg-neutral-subtle` 은 다크 3.91 입니다(List 의 강조 줄과 같은 규칙) |
| `focused` | 웹 — 키보드 포커스에만 줄 안쪽 링. 보조 기술용 닫기는 이때 보입니다 |
| `disabled` | 전용 색 — 눌러도 실행하지 않습니다. [Menu](menu.md) 와 같은 규칙이라 1280 에서 Menu 로 바뀌어도 같은 줄이 막혀 있습니다 |

줄 바탕은 묶음 폭 전체에 칠합니다 — [Menu](menu.md) 의 알약처럼 들어오며 둥글어지지 않고 색만 150ms 로 바뀝니다. 1280 에서 Menu 로 바뀌면 알약이 들어옵니다.

[그림: 누름 · 키보드 포커스 · 막힌 줄](../../site/components/specs/menu-sheet.tsx#states)

[표: 상태](menu-sheet.yaml#matrix)

[표: 모션](menu-sheet.yaml#motion)

## Guidelines

### 1280 미만의 동작 목록

[Menu](menu.md) 와 같은 목록을 1280 미만에서 시트로 띄웁니다 — 손가락으로 누르기 좋은 줄 52 에, 화면 아래라 엄지가 닿습니다. 코드는 `ResponsiveMenu` 하나로 짜면 폭을 보고 둘 중 하나를 그립니다. 입력 · 고르기 · 상세처럼 실행이 아닌 일은 [Bottom Sheet](bottom-sheet.md) 를 씁니다.

들어간 화면 · 표 줄의 동작은 1280 미만 Menu Sheet · 이상 [Menu](menu.md) 입니다(목록 줄에는 ⋮ 를 두지 않습니다). 다른 일(입력 폼 · 상세 · 고르기 · 되돌릴 수 없는 확인)에 어느 떠 있는 표면을 쓸지는 DESIGN.md Components 의 "시트 · 대화상자 · 확인창 · 팝오버" 표 한 벌이 정합니다.

예외 — 접힌 사이드바(768 ~ 1279)의 하위 목록은 이 시트가 아니라 누른 아이콘 옆 펼침 메뉴입니다([Side Navigation](side-navigation.md)).

[그림: 1280 에서 — 메뉴 시트 ↔ 메뉴](../../site/components/specs/menu-sheet.tsx#responsive-guide)

### Alert Dialog 와 견주기

확인창과 메뉴 시트는 아래처럼 나눠 쓰고, 함께 쓸 때는 시트가 닫힌 뒤 확인창을 띄웁니다.

| | [Alert Dialog](alert-dialog.md) | Menu Sheet |
|---|---|---|
| 목적 | 반드시 골라야 하는 일 — 되돌릴 수 없는 동작의 확인 | 그 화면 · 항목에서 할 수 있는 동작 여럿 |
| 동작 수 | 둘 이하(취소 포함) — 알림은 하나 | 둘 이상 |
| 동작 짜임 | 둘 중 하나(삭제할까 · 나갈까) | 여럿 중 하나 |
| 설명 | 무엇이 어떻게 되는지 늘 씁니다 | 없어도 됩니다 — 줄 이름이 말합니다 |
| 자리 | 화면 정중앙 | 화면 아래(1280 이상은 트리거 옆 [Menu](menu.md)) |
| 닫는 길 | 버튼을 눌러야 닫힙니다 — 바깥은 무시 | 줄 · 바깥 · 끌기 · 뒤로 가기로 닫힙니다 |
| 함께 쓰기 | Menu Sheet 의 "삭제" 를 누르면 시트가 닫힌 뒤 이 확인창이 뜹니다 | 위험한 줄은 맨 아래 묶음 · critical |

### 스와이프의 대신 길

폰 목록의 줄은 밀어서 동작을 꺼내는 [스와이프](swipe-actions.md)를 지름길로 둡니다. 대신 길은 줄 누르기입니다 — 줄을 누르면 한 단계 들어가고, 들어간 화면에 같은 동작이 다 있습니다. 동작이 여럿이면 머리 ⋮ 가 이 시트를 띄우고, 하나(삭제)면 바닥 왼쪽 [삭제] 입니다. 키보드 · 스크린리더 · 미는 법을 모르는 사람이 가는 길입니다. 시트의 줄은 트레이와 같은 동작 · 같은 이름이고, 확인도 같은 Alert Dialog 를 띄웁니다. 줄 끝 ⋮ 는 두지 않습니다([Menu](menu.md) 의 "줄의 동작").

[그림: 스와이프는 지름길 · 줄을 누르면 들어간 화면 머리 ⋮ 에 같은 동작](../../site/components/specs/menu-sheet.tsx#swipe-guide)

### 묶음 · 아이콘 · 설명

- 묶음은 줄이 3개 이상일 때부터 나눕니다 — 최대 3묶음이고, 모든 묶음이 하나씩이면 안 됩니다. 적어도 한 묶음은 둘 이상입니다. 줄이 적으면 하나씩 따로 두지 말고 한 묶음으로 둡니다.
- 아이콘은 모든 줄에 두거나 모두 뺍니다 — 이름만으로 모자랄 때만 씁니다.
- 줄 설명은 이름이 추상적이라 잘못 누를 수 있을 때만 둡니다.
- 스크롤이 생기지 않게 묶음 · 줄 수를 줄입니다.

[그림: 묶음 — 3개부터 · 최대 3묶음 · 아이콘은 모두 또는 없음](../../site/components/specs/menu-sheet.tsx#group-guide)

### 글

제목은 무엇의 동작인지 말합니다 — 줄 이름("주간 회의 메모")이나 화면 이름. 설명만 두지 않습니다. 줄 이름은 [Menu](menu.md) 와 같습니다(동사로 짧게, 2 ~ 6자).

## 코드

레시피 `recipes/shadcn/components/ui/menu-sheet.tsx` 를 씁니다(vaul 위 — Bottom Sheet 와 같은 바탕). 들어간 화면 머리의 ⋮ 는 [Menu](menu.md) 의 `ResponsiveMenu` 로 짜면 1280 미만에서 이 시트를 그립니다. 늘 시트인 자리(폰 전용 화면의 머리 더보기)만 `MenuSheet` 를 바로 씁니다. 아래 미리보기는 스펙 값으로 그린 모습입니다.

### 머리 더보기 — 늘 시트

[그림: 메모 화면 머리 더보기](../../site/components/specs/menu-sheet.tsx#ex-header)

```tsx
import { MenuSheet, MenuSheetContent, MenuSheetGroup, MenuSheetItem, MenuSheetTrigger } from "@/components/ui/menu-sheet"

<MenuSheet>
  <MenuSheetTrigger asChild>
    <Button variant="ghost" layout="iconOnly" aria-label="메모 더보기">
      <EllipsisVertical />
    </Button>
  </MenuSheetTrigger>
  <MenuSheetContent title="메모">
    <MenuSheetGroup>
      <MenuSheetItem icon={<FolderInput />} label="가져오기" onSelect={importMemos} />
      <MenuSheetItem icon={<FolderOutput />} label="내보내기" onSelect={exportMemos} />
      <MenuSheetItem icon={<ArrowDownUp />} label="정렬 바꾸기" onSelect={openSort} />
    </MenuSheetGroup>
  </MenuSheetContent>
</MenuSheet>
```

### 글만 — 가운데 정렬

[그림: 글만 쓰는 메뉴 시트](../../site/components/specs/menu-sheet.tsx#ex-text-only)

```tsx
<MenuSheetContent title="사진" layout="textOnly">
  <MenuSheetGroup>
    <MenuSheetItem label="앨범에서 고르기" onSelect={pickFromAlbum} />
    <MenuSheetItem label="사진 찍기" onSelect={takePhoto} />
  </MenuSheetGroup>
  <MenuSheetGroup>
    <MenuSheetItem label="사진 지우기" tone="critical" onSelect={askRemovePhoto} />
  </MenuSheetGroup>
</MenuSheetContent>
```

## Behavior

| 인터랙션 | 동작 |
|---|---|
| 열기 | 300ms 로 아래에서 올라옵니다. 처음 초점은 시트(첫 줄 위)에 갑니다 |
| 줄 누르기 | 시트를 닫고 실행합니다 — 확인이 필요한 동작은 닫힌 뒤 [Alert Dialog](alert-dialog.md) 를 엽니다. 초점은 트리거로 돌아갑니다. [Menu](menu.md) 와 같아 1280 에서 바뀌어도 같은 동작입니다 |
| 막힌 줄 누르기 | 실행하지 않고 닫히지 않습니다 |
| 바깥(딤) 누르기 · `Esc` · 뒤로 가기 | 닫습니다 |
| 손잡이 누르기 | 닫습니다(스냅 높이가 없는 [Bottom Sheet](bottom-sheet.md) 와 같습니다) |
| 줄을 누른 채 끌기 | 줄 밖에서 떼거나 10px 넘게 끌면 실행하지 않습니다(끌어 닫기와 헷갈리지 않게) |
| 아래로 끌기 | [Bottom Sheet](bottom-sheet.md) 와 같습니다 — 놓을 때 빠르게(0.4px/ms 넘게) 끌었거나 높이의 25% 이상 내려왔으면 닫고, 아니면 제자리로 돌아갑니다. 열린 뒤 0.5초는 끌리지 않습니다 |
| `Tab` · `Shift+Tab` | 줄 → 보조 기술용 닫기 → 첫 줄로 돕니다(시트 안에 가둡니다). 닫기는 초점이 올 때 보입니다 |
| 닫힌 뒤 | 200ms 로 내려가고, 초점은 연 자리(트리거)로 돌아갑니다 |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠급니다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 묶음 바탕(`bg-neutral-weak`) 위 15.20 · 다크 10.32, 설명 `fg-neutral-subtle` 5.09 · 4.68, 위험 `fg-critical` 4.68 · 4.68 ✓. 누름 · 호버 바탕(`bg-neutral-weak-pressed`) 위에서는 위험 4.39 · 3.91, 설명 4.77 · 3.91 ⚠ — 누르는 동안(터치) · 마우스를 올린 동안뿐입니다. 막힌 줄은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 묶음 바탕 위 Desk 7.76 · 4.69 · HR 7.56 · 4.67 ✓. 줄 사이 선(1.14 · 1.20) · 묶음 바탕은 장식입니다 — 줄은 이름이 알립니다 |
| **WCAG 2.1.1** Keyboard | 줄은 버튼입니다 — `Tab` 으로 닿고 `Enter` · `Space` 로 실행합니다. `Esc` 로 닫습니다 |
| **WCAG 2.4.7** Focus visible | 줄 안쪽 링 · 보조 기술용 닫기도 초점이 오면 보입니다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 52 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 52 ✓ · 닫기 52 ✓ |
| **WCAG 2.5.1** Pointer Gestures | 끌어내리기 말고도 딤 누르기 · 닫기 · `Esc` · 뒤로 가기로 닫힙니다 ✓ |
| **ARIA** | 시트 `role="dialog"` + `aria-modal="true"`, 제목이 있으면 `aria-labelledby` · 설명 `aria-describedby`(제목이 없으면 트리거 이름으로 `aria-label`). 트리거 `aria-haspopup="dialog"` · `aria-expanded`. 줄은 `<button type="button">`(막히면 `disabled`), 손잡이는 보조 기술에 숨깁니다 |

## Do / Don't

### ✅ Do

- 1280 미만의 화면 동작을 시트로 — 1280 이상은 같은 목록을 Menu 로.
- 스와이프가 있는 목록은 줄을 누르면 들어간 화면에 같은 동작을 다 두기(여럿이면 머리 ⋮ → 시트).
- 위험한 동작은 맨 아래 묶음에 `critical` 로.
- 묶음은 줄이 3개 이상일 때부터, 최대 3묶음.

### ❌ Don't

- 입력 · 고르기 · 상세를 메뉴 시트로(Bottom Sheet).
- 아이콘 줄과 글만 줄을 한 시트에 섞기.
- 위 닫기 버튼 · 바닥 취소 버튼 — 딤 · 끌기 · 뒤로 가기로 닫습니다.
- 스크롤이 생길 만큼 긴 목록.
- 좁은 목록 줄 끝마다 ⋮ 를 두고 이 시트를 열기 — 줄은 누르면 들어갑니다([Menu](menu.md) 의 "줄의 동작").

## Specification

`menu-sheet.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그립니다 — 웹 · 앱이 Menu Sheet 를 만들 때 이 값을 그대로 씁니다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮습니다. 상태는 `enabled` 에서 바뀌는 값만 적습니다.

[그림: Specification — menu-sheet.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#menu-sheet)
