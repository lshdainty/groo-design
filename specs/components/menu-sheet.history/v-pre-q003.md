# Menu Sheet

> 화면 아래에서 올라오는 동작 목록. 1280 미만에서 [Menu](menu.md) 대신 뜬다 — 같은 줄 · 같은 순서. 줄 끝 ⋮ · 머리의 더보기 버튼이 열고, 폰의 [스와이프](swipe-actions.md)는 같은 동작의 지름길로 남는다. 입력 폼 · 상세 · 고르기는 [Bottom Sheet](bottom-sheet.md), 되돌릴 수 없는 확인은 [Alert Dialog](alert-dialog.md) 다.

구조는 당근 [SEED Swipeable Menu Sheet](https://seed-design.io/react/components/swipeable-menu-sheet)(Apache-2.0)를 따른다 — 딤 · 시트 · 손잡이 · 머리(제목 · 설명) · 묶음 · 줄. 딤 · 끌어내리기 · 안전 영역 · 모션은 [Bottom Sheet](bottom-sheet.md) 와 같고, 다른 것은 손잡이가 늘 있고 위 닫기 버튼이 없다는 것이다. 값은 porest 토큰이고, SEED 와 다른 자리는 맨 아래 "SEED 와 다른 점" 에 적었다(2026-10-02 사용자 결정).

수치 원본은 [`menu-sheet.yaml`](menu-sheet.yaml)이다. 수치 표 자리(`[표: …]`)와 그림 자리(`[그림: …]`)는 사이트가 그 파일로 그린다 — GitHub 에서는 그 파일 · 그림 코드로 가는 링크로 보인다.

[그림: 메모 줄 ⋮ 의 메뉴 시트 · 머리 더보기 — 라이트 · 다크](../../site/components/specs/menu-sheet.tsx#hero)

### 직접 골라 보기

아이콘 · 머리 · 묶음 수 · 줄 설명 · 위험한 동작 · 막힌 줄을 고르면 스펙대로 그린 시트와 그 코드가 바뀐다. 실제로 열고, 끌어내리고, 눌러 닫을 수 있다.

[그림: 플레이그라운드](../../site/components/specs/menu-sheet.tsx#playground)

## Anatomy

[그림: 메뉴 시트는 딤 · 시트 · 손잡이 · 머리 · 묶음 · 줄로](../../site/components/specs/menu-sheet.tsx#anatomy)

| ⓐ Overlay | 딤 — 누르면 닫힌다. |
| ⓑ Container | 시트 — 위 두 모서리만 둥글다(20). 넓은 화면에서는 480 으로 가운데에 선다. |
| ⓒ Handle | 손잡이 — 늘 있다. 끌어내리면 닫힌다. |
| ⓓ Header | 머리 — 무엇의 동작인지 제목(가운데) · 설명. 없어도 된다. |
| ⓔ Group | 묶음 — 옅은 회색 상자(모서리 16). 묶음 사이는 간격만. |
| ⓕ Item | 줄 — 앞 아이콘 · 이름 · 설명. 줄 사이에 선, 묶음의 마지막 줄 아래에는 없다. |

[표: 부위](menu-sheet.yaml#slots)

## Properties

### 머리 · 묶음 · 줄

시트는 위 24(손잡이 자리) · 좌우 화면 여백 24 · 아래 16 + 안전 영역이다. 머리는 가운데 정렬 — 제목 18 / 24 · 700, 설명 14 / 19, 그 아래 16. 묶음은 옅은 회색 상자(모서리 16)이고 묶음 사이는 10 이다. 줄은 최소 52 · 위아래 14 · 좌우 16 이고 이름 16 / 22, 아이콘 22, 아이콘 ↔ 이름 14 다.

[그림: 머리 · 묶음 · 줄의 여백](../../site/components/specs/menu-sheet.tsx#layout)

[표: 공통](menu-sheet.yaml#base.enabled)

### Layout

아이콘을 쓰면(`textWithIcon`) 글은 왼쪽 정렬이고, 아이콘 없이 글만 쓰면(`textOnly`) 가운데 정렬이다 — 그때는 줄 설명을 두지 않는다. 한 시트에서 둘을 섞지 않는다.

[그림: 아이콘 + 글 · 글만](../../site/components/specs/menu-sheet.tsx#layouts)

[표: 정렬](menu-sheet.yaml#layout)

### Tone

되돌릴 수 없는 동작(삭제 · 나가기)은 `critical` — 이름과 아이콘만 빨갛고 설명은 그대로다. 맨 아래 묶음에 따로 둔다. 마우스를 올리거나 누르는 동안은 이름 · 아이콘을 한 단계 짙은 `fg-critical-contrast` 로 바꾼다 — 누름 바탕 위에서 `fg-critical` 은 라이트 4.39 · 다크 3.91 로 4.5:1 에 못 미친다.

[표: 위험한 동작](menu-sheet.yaml#tone)

### State

| 상태 | 모습 |
|---|---|
| `enabled` | 묶음 바탕 그대로 |
| `hovered` | 웹 — 마우스를 올린 줄의 바탕(누름과 같은 색). 설명은 `fg-neutral-muted` 로 |
| `pressed` | 줄 바탕 `bg-neutral-weak-pressed` + 아이콘 · 글만 2px 거리 축소. 설명은 `fg-neutral-muted` 로 — 누름 바탕 위에서 `fg-neutral-subtle` 은 다크 3.91 이다(List 의 강조 줄과 같은 규칙) |
| `focused` | 웹 — 키보드 포커스에만 줄 안쪽 링. 보조 기술용 닫기는 이때 보인다 |
| `disabled` | 전용 색 — 눌러도 실행하지 않는다 |

[그림: 누름 · 키보드 포커스 · 막힌 줄](../../site/components/specs/menu-sheet.tsx#states)

[표: 상태](menu-sheet.yaml#matrix)

[표: 모션](menu-sheet.yaml#motion)

## Guidelines

### 1280 미만의 동작 목록

[Menu](menu.md) 와 같은 목록을 1280 미만에서 시트로 띄운다 — 손가락으로 누르기 좋은 줄 52 에, 화면 아래라 엄지가 닿는다. 코드는 `ResponsiveMenu` 하나로 짜면 폭을 보고 둘 중 하나를 그린다. 입력 · 고르기 · 상세처럼 실행이 아닌 일은 [Bottom Sheet](bottom-sheet.md) 다.

| 이런 일 | 1280 미만 | 1280 이상 |
|---|---|---|
| 줄 · 화면의 동작 | **Menu Sheet** | [Menu](menu.md) |
| 입력 폼 · 상세 · 고르기 | [Bottom Sheet](bottom-sheet.md) | [Dialog](dialog.md) · [Popover](popover.md) |
| 되돌릴 수 없는 확인 | [Alert Dialog](alert-dialog.md) | [Alert Dialog](alert-dialog.md) |

예외 — 접힌 사이드바(768 ~ 1279)의 하위 목록은 이 시트가 아니라 누른 아이콘 옆 펼침 메뉴다([Side Navigation](side-navigation.md) — 사용자 결정 2026-10-08).

[그림: 1280 에서 — 메뉴 시트 ↔ 메뉴](../../site/components/specs/menu-sheet.tsx#responsive-guide)

### 스와이프의 대신 길

폰 목록의 줄은 밀어서 동작을 꺼내는 [스와이프](swipe-actions.md)를 지름길로 둔다. 같은 동작을 줄 끝 ⋮ 로도 열어 이 시트에 띄운다 — 키보드 · 스크린리더 · 미는 법을 모르는 사람이 가는 길이다. 시트의 줄은 트레이와 같은 동작 · 같은 이름이고, 확인도 같은 Alert Dialog 를 띄운다.

[그림: 스와이프는 지름길 · ⋮ 는 같은 동작의 시트](../../site/components/specs/menu-sheet.tsx#swipe-guide)

### 묶음 · 아이콘 · 설명

- 묶음은 줄이 3개 이상일 때부터 — 최대 3묶음, 한 묶음에는 2개 이상(위험한 동작 묶음은 하나여도 된다). 줄이 적으면 하나씩 따로 두지 말고 한 묶음으로.
- 아이콘은 모든 줄에 두거나 모두 뺀다 — 이름만으로 모자랄 때만 쓴다.
- 줄 설명은 이름이 추상적이라 잘못 누를 수 있을 때만.
- 스크롤이 생기지 않게 묶음 · 줄 수를 줄인다.

[그림: 묶음 — 3개부터 · 최대 3묶음 · 아이콘은 모두 또는 없음](../../site/components/specs/menu-sheet.tsx#group-guide)

### 글

제목은 무엇의 동작인지 — 줄 이름("주간 회의 메모")이나 화면 이름. 설명만 두지 않는다. 줄 이름은 [Menu](menu.md) 와 같다(동사로 짧게, 2 ~ 6자).

## 코드

레시피 `recipes/shadcn/components/ui/menu-sheet.tsx` 를 쓴다(vaul 위 — Bottom Sheet 와 같은 바탕). 줄의 동작은 [Menu](menu.md) 의 `ResponsiveMenu` 로 짜면 1280 미만에서 이 시트를 그린다. 늘 시트인 자리(폰 전용 화면의 머리 더보기)만 `MenuSheet` 를 바로 쓴다. 아래 미리보기는 스펙 값으로 그린 모습이다.

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
| 열기 | 300ms 로 아래에서 올라온다. 처음 초점은 시트(첫 줄 위)에 간다 |
| 줄 누르기 | 시트를 닫고 실행한다 — 확인이 필요한 동작은 닫힌 뒤 [Alert Dialog](alert-dialog.md) 를 연다. 초점은 트리거로 돌아간다 |
| 막힌 줄 누르기 | 실행하지 않고 닫히지 않는다 |
| 바깥(딤) 누르기 · `Esc` · 뒤로 가기 | 닫는다 |
| 손잡이 누르기 | 닫는다(스냅 높이가 없는 [Bottom Sheet](bottom-sheet.md) 와 같다) |
| 줄을 누른 채 끌기 | 줄 밖에서 떼거나 10px 넘게 끌면 실행하지 않는다(끌어 닫기와 헷갈리지 않게) |
| 아래로 끌기 | [Bottom Sheet](bottom-sheet.md) 와 같다 — 놓을 때 빠르게(0.4px/ms 넘게) 끌었거나 높이의 25% 이상 내려왔으면 닫고, 아니면 제자리로. 열린 뒤 0.5초는 끌리지 않는다 |
| `Tab` · `Shift+Tab` | 줄 → 보조 기술용 닫기 → 첫 줄로 돈다(시트 안에 가둔다). 닫기는 초점이 올 때 보인다 |
| 닫힌 뒤 | 200ms 로 내려가고, 초점은 연 자리(트리거)로 돌아간다 |
| 열린 동안 | 뒤 화면을 보조 기술에서 숨기고 스크롤을 잠근다 |

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast(글자 ≥ 4.5:1) | 이름 `fg-neutral` 묶음 바탕(`bg-neutral-weak`) 위 15.20 · 다크 10.32, 설명 `fg-neutral-subtle` 5.09 · 4.68, 위험 `fg-critical` 4.68 · 4.68 ✓. 누름 · 호버 바탕(`bg-neutral-weak-pressed`) 위에서는 위험 4.39 · 3.91, 설명 4.77 · 3.91 ⚠ — 누르는 동안(터치) · 마우스를 올린 동안만이고 SEED 도 같은 자리다(SEED 는 쉴 때도 위험 3.41). 막힌 줄은 예외(비활성) |
| **WCAG 1.4.11** Non-text contrast(≥ 3:1) | 키보드 포커스 링 묶음 바탕 위 Desk 7.76 · 4.69 · HR 4.69 · 4.79 ✓. 줄 사이 선(1.14 · 1.20) · 묶음 바탕은 장식 — 줄은 이름이 알린다 |
| **WCAG 2.1.1** Keyboard | 줄은 버튼 — `Tab` 으로 닿고 `Enter` · `Space` 로 실행한다. `Esc` 로 닫는다 |
| **WCAG 2.4.7** Focus visible | 줄 안쪽 링 · 보조 기술용 닫기도 초점이 오면 보인다 |
| **WCAG 2.5.8** Target Size — Minimum(AA ≥ 24×24) | 줄 52 ✓ |
| **WCAG 2.5.5** Target Size — Enhanced(AAA ≥ 44×44) | 줄 52 ✓ · 닫기 52 ✓ |
| **WCAG 2.5.1** Pointer Gestures | 끌어내리기 말고도 딤 누르기 · 닫기 · `Esc` · 뒤로 가기로 닫힌다 ✓ |
| **ARIA** | 시트 `role="dialog"` + `aria-modal="true"`, 제목이 있으면 `aria-labelledby` · 설명 `aria-describedby`(제목이 없으면 트리거 이름으로 `aria-label`). 트리거 `aria-haspopup="dialog"` · `aria-expanded`. 줄은 `<button type="button">`(막히면 `disabled`), 손잡이는 보조 기술에 숨긴다 |

## Do / Don't

### ✅ Do

- 1280 미만의 줄 · 화면 동작을 시트로 — 1280 이상은 같은 목록을 Menu 로.
- 스와이프가 있는 줄에도 ⋮ 를 두고 같은 동작을 시트로.
- 위험한 동작은 맨 아래 묶음에 `critical` 로.
- 묶음은 줄이 3개 이상일 때부터, 최대 3묶음.

### ❌ Don't

- 입력 · 고르기 · 상세를 메뉴 시트로(Bottom Sheet).
- 아이콘 줄과 글만 줄을 한 시트에 섞기.
- 위 닫기 버튼 · 바닥 취소 버튼 — 딤 · 끌기 · 뒤로 가기로 닫는다.
- 스크롤이 생길 만큼 긴 목록.

## Specification

`menu-sheet.yaml` 의 규칙을 하나도 빼지 않고 조건마다 그린다 — 웹 · 앱이 Menu Sheet 를 만들 때 이 값을 그대로 쓴다. 조건이 없는 `Base` 가 모든 조합에 걸리고, 뒤의 규칙이 앞의 같은 값을 덮는다. 상태는 `enabled` 에서 바뀌는 값만 적었다.

[그림: Specification — menu-sheet.yaml 의 규칙 전부](../../site/components/specs/spec-sheet.tsx#menu-sheet)

## SEED 와 다른 점

- **좌우 여백은 화면 여백 24** — SEED 16(Bottom Sheet 와 같다).
- **딤은 porest 0.50 · 다크 0.65**(v102) — SEED 0.455.
- **줄 사이 선은 `stroke-neutral-weak`** — SEED `stroke.neutral-muted` 는 투명도가 있고, 그 자리의 불투명한 짝 중 `stroke-neutral-subtle` 은 다크에서 묶음 바탕과 같은 색이라 선이 사라진다.
- **줄을 누르면 시트가 닫힌다** — SEED 코드는 닫지 않고 쓰는 쪽이 닫는다. porest 는 Menu 와 같게 닫고 실행한다(1280 에서 바뀌어도 같은 동작).
- **막힌 줄을 둔다** — SEED 는 Figma 에만 있고 코드 · 색이 없다. Menu 와 같은 규칙(전용 색 · 누르지 못함)으로 채운다 — 1280 에서 Menu 와 바뀌어도 같은 줄이 막혀 있어야 한다.
- **보조 기술용 닫기는 키보드 초점이 오면 보인다** — SEED 는 안 보이는 채로 Tab 이 선다(기초의 "초점은 늘 보인다").
- **트리거에 `aria-haspopup="dialog"` · `aria-expanded`** — SEED 는 문서에 적고 실제로는 붙이지 않는다.
- **z-index 는 specs/z-index.md 의 L2**(딤 `z-modal` 100 · 시트 `z-modal-content` 101).

## Migration notes

### 2026-10-02 — SEED Menu Sheet 로 새로 둔다

사용자가 [비교 페이지](https://claude.ai/artifact/QoxJ7ZmQCedRWfPQrDvFgA)에서 정했다 — 1280 미만의 줄 동작은 Menu Sheet(SEED 모양 — 위 20 · 손잡이 · 제목 18 가운데 · 묶음 16 · 줄 52), 폰 스와이프는 지름길로 남기고 같은 동작을 ⋮ → Menu Sheet 로도. 전에는 1280 미만에 메뉴 시트가 없었다.

제품은 앱 적용 단계에서 옮긴다(2026-10-02 조사).

- **Desk 웹** — 모바일 줄 동작은 스와이프 트레이 11곳뿐이다. 닫힌 트레이는 보조 기술에서 숨겨져 있고 여는 키가 없다 — 키보드 · 스크린리더는 줄을 눌러 상세 화면에서 같은 동작을 찾는다(→ 줄 끝 ⋮ + Menu Sheet). 열린 트레이를 `Esc` 로 닫으면 초점이 숨겨진 삭제 버튼에 남는다.
- **Desk 앱** — 스와이프 12곳, 스크린리더용 동작(custom semantics action) 0 이라 TalkBack 으로 열 수 없다(→ ⋮ + Menu Sheet). 캘린더 공유 멤버 ⋮ 는 드롭다운 메뉴(→ Menu Sheet).
- **HR 웹** — 모바일 줄 동작이 없다(데스크톱 행 ⋮ 를 폰에서도 그대로).
