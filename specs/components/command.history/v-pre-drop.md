# Command

> `⌘K` 명령어 팔레트 — 검색 input + 필터링 가능 리스트(그룹/separator/shortcut). 빠른 네비게이션·액션 실행에 사용. `cmdk` 베이스 + 옵션으로 [`Dialog`](dialog.md) wrapping(전역 `CommandDialog`). Combobox 패턴([`Popover`](popover.md) + Command)의 베이스 컴포넌트.

Porest Command는 **단일 spec × 5 sub-components(Input/List/Group/Item/Separator)** 매트릭스로 정의됩니다. Input은 [`Input`](input.md) md spec과 시각 통일(`h-10` + `body-md` + token padding). Item은 옛 Dropdown Menu item과 같은 모양이었다(`rounded-sm` + `body-md` + `padding-sm/md`) — 2026-10-02 [`Menu`](menu.md) 는 SEED 모양으로 바뀌었고, Command 는 그 차례에 다시 정한다. Group heading은 menu label과 동일(`text-label-sm` + 500 + secondary). 다른 menu 계열과 시각 응집 우선.

## Anatomy

```
┌─────────────────────────────────────────┐
│ ⓐ Command (root)                        │
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 ⓑ Input (placeholder / value)    │ │  ← Input.md md spec
│ └─────────────────────────────────────┘ │
│ ─── border-bottom border-default ─────  │
│ ┌─────────────────────────────────────┐ │
│ │ ⓒ List (scrollable, max-h-[300px])  │ │
│ │   ⓓ Group heading "제안"            │ │  ← label-sm + secondary
│ │     ⓔ Item (selected) ✓             │ │  ← rounded-sm + body-md
│ │     ⓔ Item                          │ │
│ │   ⓕ Separator                       │ │
│ │   ⓓ Group heading "설정"            │ │
│ │     ⓔ Item with shortcut    ⌘P      │ │
│ │     ⓔ Item                  ⌘S      │ │
│ │                                     │ │
│ │   ⓖ Empty (when no results)         │ │  ← "결과가 없습니다."
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

| ⓐ Command (root) | `flex h-full w-full flex-col overflow-hidden rounded-md bg-surface-default text-text-primary`. Dialog wrap 시 border/shadow는 Dialog가 담당. |
| ⓑ CommandInput | wrapper `flex items-center border-b border-border-default px-[var(--spacing-md)]` + Search icon 16px 좌측 (`text-text-secondary`) + input `h-10 bg-transparent py-[var(--spacing-sm)] text-body-md outline-none placeholder:text-text-tertiary`. |
| ⓒ CommandList | `max-h-[300px] overflow-y-auto overflow-x-hidden` — 스크롤 영역. |
| ⓓ CommandGroup heading | `px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-sm font-medium text-text-secondary` — dropdown-menu Label과 동일. |
| ⓔ CommandItem | `flex items-center gap-[var(--spacing-sm)] rounded-sm px-[var(--spacing-md)] py-[var(--spacing-sm)] text-body-md text-text-primary cursor-pointer` + `data-[selected=true]:bg-surface-input`. |
| ⓕ CommandSeparator | `my-[var(--spacing-xs)] h-px bg-border-default`. |
| ⓖ CommandEmpty | `py-[var(--spacing-xl)] text-center text-body-sm text-text-secondary` — "결과가 없습니다." 같은 안내. |
| ⓗ CommandShortcut | 우측 정렬 — `margin-left:auto; font-size:var(--text-label-sm); letter-spacing:0.1em; color:var(--color-text-tertiary);` |

**규칙**

- Input wrapper의 좌측 `Search` icon은 16px + `text-secondary` — placeholder와 같은 톤. 강조 아이콘 아님.
- Group padding `px-[var(--spacing-xs)]` (4px) — group은 list 내 내부 여백 컨테이너 역할. group 내 item은 group의 padding과 별개로 자체 `px-[var(--spacing-md)]` (12).
- 선택 상태는 `data-[selected=true]` (cmdk 자동) — 키보드 navigation으로 변경.
- Item 안 icon은 좌측 16px, shortcut은 우측(`margin-left:auto`) — dropdown-menu와 동일 시그니처.

## Variants

Command는 **variant 없음** — 단일 시각. 사용 형태(inline vs CommandDialog)는 wrap 컨테이너로 분기.

### Composition forms

| Form | Wrap | 사용처 |
|---|---|---|
| `inline` | Command 단독 | 사이드바 안 검색, popover 안 search list. Combobox 베이스. |
| `CommandDialog` | Dialog로 wrap | 전역 ⌘K 팔레트. 화면 중앙 떠오름. dialog spec의 shadow-xl 사용. |

## Sizes

Command는 **size variant 없음** — 단일 spec. 폭은 사용처에서 결정(`w-72` popover 내부 / `w-[min(640px,90%)]` dialog).

[표: 부위별 크기](command.yaml#base.enabled)

## States

### Input

[표: Input 상태](command.yaml#matrix@input)

### Item

[표: Item 상태](command.yaml#matrix@item)

선택 상태는 키보드(Arrow keys)로 변경 — hover와 분리. focus state는 cmdk가 selected와 동기화.

## Layout

**Inline Command (사이드바/popover 내부)**

- 좁은 폭(240–320px) — sidebar 검색, command picker.
- max-h-[300px]로 스크롤 영역 제한.
- 외곽 border/shadow는 부모 컨테이너가 담당(popover/sidebar).

**Combobox 베이스 (Popover + Command)**

- Trigger button → click 시 popover 열림 → popover 안에 Command. select 대체.
- 옵션 다수(5+) + 검색 필요할 때 select 대신 사용.

**CommandDialog (전역 ⌘K 팔레트)**

- Dialog wrap + p-0(Dialog 내부 padding 제거) → Command가 모서리까지 차지.
- 화면 중앙 떠오름, overlay-dim 적용.
- `keydown` 핸들러로 `⌘K` 또는 `Ctrl+K` 토글.

**Group + Separator 패턴**

- Group heading은 카테고리 명시 ("제안" / "설정").
- Group 간 separator로 시각 분리.
- 3–7개 group 권장 — 그 이상은 검색으로 좁힘.

## Behavior

| 인터랙션 | 동작 |
|---|---|
| Input typing | cmdk가 fuzzy match로 item 필터링. 결과 없으면 CommandEmpty 노출. |
| `ArrowDown` / `ArrowUp` | 선택 item 이동 (cmdk roving). |
| `Enter` | 선택 item 활성화 (onSelect 호출). |
| `Escape` | CommandDialog 시 dismiss. inline은 부모가 처리. |
| `Home` / `End` | 첫/마지막 item 선택. |
| `⌘K` (CommandDialog) | 전역 토글 — `keydown` 핸들러로 수동 설정. |
| Item click | onSelect 호출 + (보통) CommandDialog dismiss. |

cmdk는 keyboard-first — 마우스 hover는 selection 변경 안 함(키보드 사용 흐름 보호). 사용처에서 활성화하려면 cmdk `onValueChange` 사용.

## Accessibility

| 기준 | 검증 |
|---|---|
| **WCAG 1.4.3** Color contrast (text-primary × surface-default) | 14:1+ ✓ |
| **WCAG 1.4.3** Color contrast (text-secondary heading × surface-default) | 9.2:1 ✓ |
| **WCAG 1.4.3** Color contrast (placeholder × bg) | text-tertiary 4.6:1 ✓ (AA 본문) |
| **WCAG 1.4.11** Non-text contrast (focused item × surface-default) | `surface-input` 채움 1.2:1 — 채움 차이는 약함. cmdk 화살표 키 + 선택 표시(채움)가 시각 식별. |
| **WCAG 2.1.1** Keyboard | `Arrow`/`Enter`/`Home`/`End` 모든 동작 키보드 가능 ✓ |
| **WCAG 2.4.7** Focus Visible | Input은 native focus ring. Item은 selected state(채움)로 표시. |
| **ARIA** | cmdk가 `role="combobox"`(Input) + `role="listbox"`(List) + `role="option"` + `aria-selected` 자동 부여. |

## Command vs DropdownMenu vs Combobox

> 2026-10-02 — Dropdown Menu 는 [Menu](menu.md)(실행만 · 고른 표시 없음)로 바뀌었다. 아래 표는 옛 비교다 — Command 차례에 다시 쓴다.

| 항목 | DropdownMenu | Combobox(Popover+Command) | CommandDialog |
|---|---|---|---|
| Trigger | button click | button click | `⌘K` 또는 어디서나 |
| 검색 input | 없음 | 있음 | 있음 |
| 옵션 수 | 4–7개 | 5–50개 | 무제한 (필터링) |
| 위치 | trigger 기준 (Popper) | trigger 기준 (Popper) | 화면 중앙 (Dialog) |
| 사용처 | 명시적 메뉴 (계정/설정) | select 대체 (검색 가능 옵션 picker) | 전역 빠른 액션 팔레트 |

## Do / Don't

### ✅ Do

- 옵션이 5+ 검색이 필요할 때 — select 대신 Combobox(Popover+Command) 사용.
- 전역 빠른 액션 진입에 — `⌘K` palette는 사용자가 키보드만으로 navigate 가능.
- Group heading으로 카테고리 분리 — 4–5개 그룹까지 자연스러움.
- Empty state 명시 — "결과가 없습니다" 같이 검색 실패 안내.

### ❌ Don't

- 옵션 4개 이하 + 검색 불필요 — DropdownMenu가 가벼움.
- Input wrapper 없이 input만 — Search icon + border-b 시그니처가 검색 affordance.
- Item에 너무 긴 text — 한 줄 권장, 줄바꿈 시 위계 깨짐.
- 선택 상태(`data-[selected=true]`)를 hover로 override — 키보드 사용자 혼란.

## Migration notes

- 기존 `command.tsx`는 Input `h-11 py-3 text-title-sm` — Input.md md spec 정합으로 `h-10 py-[var(--spacing-sm)] text-body-md` 정정. form 내 input과 시각 일관성.
- Item `rounded-xs px-2 py-1.5 text-title-sm` — DropdownMenu/ContextMenu와 통일하기 위해 `rounded-sm px-[var(--spacing-md)] py-[var(--spacing-sm)] text-body-md` 정정.
- Group heading `px-2 py-1.5` Tailwind → `px-[var(--spacing-md)] py-[var(--spacing-sm)]` 토큰 직접 인용.
- Separator `-mx-1 h-px` → `my-[var(--spacing-xs)] h-px` — DropdownMenu/ContextMenu separator와 동일 패턴.
- CommandEmpty `py-6` → `py-[var(--spacing-xl)]` 토큰.
- 예제 inline px 하드코드(padding:0 12px, height:44px 등) → spacing 토큰 직접 인용.
- preview-html `.cmd-*`는 brand vignette용 별도 시각(legacy) — site (tsx + examples)가 단일 SoT.
