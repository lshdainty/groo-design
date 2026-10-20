import * as React from "react";
import { ChevronDown, Search, SearchX, type LucideProps } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";

import { cn } from "@/lib/utils";
import {
  CATEGORY_ICON_COMPONENTS,
  CATEGORY_ICON_GROUPS,
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
  findCategoryIcon,
  searchCategoryIcons,
  type CategoryIcon,
} from "@/lib/category-icons";
import { BottomSheet, BottomSheetBody, BottomSheetContent, BottomSheetTrigger } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { InputButton, useInputButtonSurface, type InputButtonProps } from "@/components/ui/input-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResultSection } from "@/components/ui/result-section";
import { useScrollFog } from "@/components/ui/scroll-fog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/*
 * Groo Icon Picker — 카테고리 · 저축 목표에 붙일 아이콘을 고르는 칸(2026-10-09). 수치 원본은 specs/components/icon-picker.yaml, 세트는
 * specs/components/category-icons.yaml(→ lib/category-icons.ts). 트리거 · 시트 · 팝오버 · 찾기 칸의 나머지 값은 각 레시피(input-button ·
 * bottom-sheet · popover · input)가 그대로다. SEED 에는 아이콘 고르기 부품이 없다 — 세트 · 칸 · 고른 표시 · 키보드 · 한국어 찾기는
 * groo 가 정했다(사용자 결정 15A · 16A · 17A). 옛 Icon Picker(40 정사각 트리거 · 팝오버 320 · lucide 전체 · 영어 이름 · "없음")를 대신한다.
 *
 *   IconPicker   트리거 + 여는 자리 + 찾기 + 격자. value(저장된 lucide 이름 — null · "" 이면 태그) · onValueChange(id — 고르면, 닫는 것은
 *                스스로 한다) · size(트리거 — "responsive" 기본 · "large" · "medium") · disabled · id, 나머지는 Input Button 의 속성.
 *                Field 안이면 라벨이 이름이 되고 오류 · 막힘을 받는다(Input Button)
 *
 * 트리거: Input Button — 앞 붙이개에 지금 아이콘, 값에 그 한국어 이름("커피"), 뒤 chevron-down. 이름은 "아이콘 커피"(Field 라벨 + 값).
 *   아이콘이 없는 항목(null · "")은 태그 + "태그", 세트 밖에 저장된 아이콘은 그 아이콘(lucide-react/dynamic) + "지금 아이콘" — 지우지도
 *   바꾸지도 않는다(격자에 고른 칸이 없고, 고르지 않고 닫으면 그대로). 서버 시드의 home 은 세트의 house(집)로 본다(lucideAliases).
 * 여는 자리: 1280 미만 Bottom Sheet(제목 "아이콘" · 닫기), 이상 Popover(머리 없이 · 이름 "아이콘" · 폭 408 = 칸 48 × 7 + 사이 4 × 6 +
 *   좌우 24 × 2). 고르면 바로 닫힌다("완료" 없음) — 초점은 트리거로. 묶음 머리 · 격자가 든 스크롤 상자는 끝 흐림(Scroll Fog overlayBody —
 *   위 20 · 아래 80 늘 켜짐 + 본문 안 여백 그만큼, 2026-10-03 규칙)을 건다 — 맨 위에서 첫 묶음 머리, 끝까지 내리면 마지막 줄이 흐림
 *   밖에 선다. 찾기 칸은 스크롤 상자 밖이라 흐리지 않는다.
 * 찾기: 위에 붙은 Input 밑줄형(시트 large 40 · 팝오버 medium 34 · 앞 돋보기 · 지우기 · "아이콘 이름 검색" · 이름 "아이콘 검색") — 목록과
 *   따로 두어 스크롤해도 그 자리다. 치는 대로 세트를 거른다(이름 · 찾는 말 · id — 소문자 · 공백 없이 부분 일치). 결과는 세트 차례 그대로
 *   묶음 머리 없이, 개수는 화면 밖(aria-live polite)에서 치기를 멈추면 한 번 "검색 결과 2개". 0건이면 격자 자리에 Result Section medium
 *   "'{검색어}'에 대한 아이콘이 없어요"(role=status 가 알린다).
 * 격자: role="listbox"(이름 "아이콘") — 묶음은 role="group" + 머리(14 · 500 · fg-neutral-subtle, 위 12 · 아래 8)가 이름. 칸 48 · 모서리 12 ·
 *   아이콘 24(fg-neutral · 선 2)을 시트 6열 · 팝오버 7열로 두고(사이 최소 4 — 남는 폭은 칸 사이에 고르게, 시트 본문이 308 보다 좁은 폰은
 *   들어가는 만큼) 줄 사이 4. 스크롤 상자 맨 위(흐림 여백 20 아래)가 첫 묶음 머리(위 12)이고, 찾는 동안은 머리 대신 격자 위
 *   12(searchGap) — 어느 쪽이든 찾기 칸에서 머리 글 · 격자까지 32 다(흐림 여백은 본문 안에 더한다 — bottom-sheet.yaml).
 *   칸 이름은 한국어 이름(role="option" · aria-selected), 마우스는 같은 글의 툴팁(Tooltip — 네이티브 title 은 쓰지 않는다).
 *   고른 칸은 안쪽 2px stroke-neutral-contrast(::after — 아이콘이 밀리지 않는다, Select Box v113) + 선 2.5, 바탕은 칠하지 않는다.
 *   호버 · 누름 바탕 bg-layer-floating-pressed, 누르면 칸 2px 거리 축소(48 → 0.958, 모션 줄이기면 하지 않는다), 키보드 포커스에만 바깥 링 2px · 띄움 2px.
 * 키보드: 격자에 Tab 하나(고른 칸, 없으면 첫 칸 — roving tabindex). ← → 는 차례대로(줄 끝에서 다음 줄 · 다음 묶음으로, 끝에서 멈춘다 — RTL 은
 *   반대), ↑ ↓ 는 보이는 위아래 줄의 가장 가까운 칸(묶음 머리를 넘는다), Home · End 는 그 줄의 처음 · 끝, Enter · Space 로 고른다.
 *   찾기 칸에서 ↓ 는 격자의 첫 칸으로. 열면 초점은 고른 칸(없으면 첫 칸)이고 고른 칸이 보이게 가운데로 스크롤한다 — 폰에서 키보드가 올라와
 *   격자를 가리지 않게 찾기 칸은 눌러야 친다. Esc 는 찾는 말이 있으면 지우고(초점은 찾기 칸) 비었으면 닫는다(값은 그대로).
 */

// lucide-react 가 아는 이름 — 세트 밖 저장 값을 그릴 수 있는지(없는 이름이면 태그)
const LUCIDE_NAMES = new Set<string>(iconNames);

/** 저장 값으로 아이콘 하나를 그린다 — 세트 안은 세트의 컴포넌트, 세트 밖은 lucide-react/dynamic, 빈 값 · 모르는 이름은 태그 */
function CategoryGlyph({ id, ...props }: { id: string } & LucideProps) {
  const entry = findCategoryIcon(id);
  const Tag = CATEGORY_ICON_COMPONENTS[DEFAULT_CATEGORY_ICON];
  const Known = entry ? CATEGORY_ICON_COMPONENTS[entry.id] : undefined;
  if (Known) return <Known aria-hidden {...props} />;
  if (id !== "" && LUCIDE_NAMES.has(id)) {
    return <DynamicIcon aria-hidden {...props} name={id as IconName} fallback={Tag ? () => <Tag aria-hidden {...props} /> : undefined} />;
  }
  return Tag ? <Tag aria-hidden {...props} /> : null;
}

// 칸 — 48 · 모서리 12 · 아이콘 24. 고른 칸은 안쪽 2px(::after) + 선 2.5. 호버 · 누름 바탕 + 2px 거리 축소, 키보드 포커스에만 바깥 링
const CELL = [
  "relative flex size-12 shrink-0 cursor-pointer select-none items-center justify-center rounded-r3 bg-transparent text-fg-neutral scroll-m-1",
  "[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0 [&_svg]:[stroke-width:2] aria-selected:[&_svg]:[stroke-width:2.5]",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-solid after:border-transparent after:content-['']",
  "aria-selected:after:border-stroke-neutral-contrast",
  "hover:bg-bg-layer-floating-pressed active:bg-bg-layer-floating-pressed",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "[--press-basis:48] active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

// 격자 — 칸 48 · 사이 최소 4(남는 폭은 칸 사이에 고르게) · 줄 사이 4. 시트 6열 · 팝오버 7열(icon-picker.yaml surface).
// 시트 본문이 308(48 × 6 + 4 × 5)보다 좁은 폰은 들어가는 만큼만 둔다 — 본문(@container)의 폭으로 가른다
const GRID = "grid justify-between gap-x-x1 gap-y-x1";
const GRID_COLUMNS = {
  sheet: "grid-cols-[repeat(auto-fill,48px)] @min-[308px]:grid-cols-[repeat(6,48px)]",
  popover: "grid-cols-[repeat(7,48px)]",
} as const;

// 묶음 머리 — List Header mediumWeak(14 · 500 · fg-neutral-subtle), 위 12 · 아래 8
const GROUP_HEADER = "pb-x2 pt-x3 font-sans text-t4 font-medium text-fg-neutral-subtle";

// 결과 수를 알리기까지 — 치기를 멈춘 뒤 한 번(글자마다 읽지 않게)
const ANNOUNCE_DELAY = 500;

const cellsOf = (listbox: HTMLElement | null) => (listbox ? Array.from(listbox.querySelectorAll<HTMLElement>('[role="option"]')) : []);

// 스크롤하는 조상 — 시트 본문 · 팝오버 본문
function scrollParentOf(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p);
    if (overflowY === "auto" || overflowY === "scroll") return p;
  }
  return null;
}

// 고른 칸이 보이게 — 처음 열 때는 가운데로
function centerInScroller(cell: HTMLElement) {
  const scroller = scrollParentOf(cell);
  if (!scroller) return;
  const box = scroller.getBoundingClientRect();
  const rect = cell.getBoundingClientRect();
  scroller.scrollTop += rect.top + rect.height / 2 - (box.top + box.height / 2);
}

// 팝오버 본문 — PopoverBody 와 같은 자리 · 같은 끝 흐림(위 20 · 아래 80 + 본문 안 여백 · 스크롤 여유 그만큼). PopoverBody 는 넘치면
// 스스로 Tab 이 서는데(tabIndex 0), 격자는 칸이 초점을 받아 화살표로 스크롤되므로 Tab 하나 규칙을 지키려 그 칸을 두지 않는다.
// 팝오버가 열릴 때 마운트되므로 흐림도 이 부품이 걸고(useScrollFog) 닫히면 걷는다
function PopoverScroll({ children }: { children: React.ReactNode }) {
  const own = React.useRef<HTMLDivElement>(null);
  useScrollFog(own, "overlayBody");
  return (
    <div
      ref={own}
      data-slot="icon-picker-body"
      data-scroll-fog="overlayBody"
      className="min-h-0 flex-1 overflow-y-auto px-x6 pb-[80px] pt-[20px] scroll-pb-[80px] scroll-pt-[20px]"
    >
      {children}
    </div>
  );
}

export interface IconPickerProps
  extends Omit<InputButtonProps, "value" | "onClick" | "placeholder" | "prefixIcon" | "suffixIcon" | "prefix" | "suffix" | "onClear" | "size"> {
  /** 저장된 lucide 이름 — null · "" 이면 태그로 그린다. 세트 밖 이름은 그대로 그린다("지금 아이콘") */
  value?: string | null;
  /** 고르면 — 닫는 것은 스스로 한다 */
  onValueChange?: (id: string) => void;
  /** 트리거 크기 — "responsive"(기본 — 1280 미만 large 52 · 이상 medium 40) · "large"(앱) · "medium" */
  size?: "responsive" | "large" | "medium";
}

const IconPicker = React.forwardRef<HTMLButtonElement, IconPickerProps>(({ value, onValueChange, size = "responsive", ...props }, ref) => {
  const surface = useInputButtonSurface();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const listboxRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const headerId = React.useId();

  const stored = value?.trim() ?? "";
  const entry = findCategoryIcon(stored);
  const empty = stored === "";
  // 트리거 — 세트 안은 그 아이콘 + 이름, 빈 값은 태그 + "태그", 세트 밖은 그 아이콘 + "지금 아이콘"
  const shownId = entry ? entry.id : empty ? DEFAULT_CATEGORY_ICON : stored;
  const shownName = entry ? entry.name : empty ? (findCategoryIcon(DEFAULT_CATEGORY_ICON)?.name ?? "태그") : "지금 아이콘";
  const selectedId = entry ? entry.id : empty ? DEFAULT_CATEGORY_ICON : null;

  const searching = query.trim() !== "";
  const results = React.useMemo(() => searchCategoryIcons(query), [query]);
  const groups = React.useMemo(
    () => CATEGORY_ICON_GROUPS.map((group) => ({ group, icons: CATEGORY_ICONS.filter((icon) => icon.group === group) })).filter((g) => g.icons.length > 0),
    [],
  );
  const visible: readonly CategoryIcon[] = searching ? results : groups.flatMap((g) => g.icons);
  // Tab 이 서는 칸 — 옮겨 다닌 칸, 없으면 고른 칸, 그것도 없으면 첫 칸
  const tabbableId =
    activeId != null && visible.some((icon) => icon.id === activeId)
      ? activeId
      : selectedId != null && visible.some((icon) => icon.id === selectedId)
        ? selectedId
        : (visible[0]?.id ?? null);

  // 결과 수 — 치기를 멈추면 한 번. 0건은 Result Section 이 알린다
  React.useEffect(() => {
    if (!searching || results.length === 0) {
      setAnnouncement("");
      return;
    }
    const timer = window.setTimeout(() => setAnnouncement(`검색 결과 ${results.length}개`), ANNOUNCE_DELAY);
    return () => window.clearTimeout(timer);
  }, [searching, results.length, query]);

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActiveId(null);
    }
  };

  const select = (id: string) => {
    onValueChange?.(id);
    changeOpen(false);
  };

  const focusCell = (cell: HTMLElement | undefined) => {
    if (!cell) return;
    const id = cell.getAttribute("data-icon");
    if (id) setActiveId(id);
    cell.focus({ preventScroll: true });
    cell.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  // 열면 초점은 고른 칸(없으면 첫 칸) — 고른 칸이 보이게 가운데로
  const onOpenAutoFocus = (e: Event) => {
    e.preventDefault();
    const cells = cellsOf(listboxRef.current);
    const cell = cells.find((c) => c.getAttribute("data-icon") === tabbableId) ?? cells[0];
    if (!cell) return;
    centerInScroller(cell);
    cell.focus({ preventScroll: true });
  };

  // Esc — 찾는 말이 있으면 지우고 찾기 칸으로(표면은 그대로), 비었으면 닫는다
  const onEscapeKeyDown = (e: KeyboardEvent) => {
    if (query === "") return;
    e.preventDefault();
    setQuery("");
    searchRef.current?.focus();
  };

  const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!cell) return;
    const cells = cellsOf(listboxRef.current);
    const i = cells.indexOf(cell);
    if (i < 0) return;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const r = cell.getBoundingClientRect();
    const sameRow = (c: HTMLElement) => Math.abs(c.getBoundingClientRect().top - r.top) < 2;
    let target: HTMLElement | undefined;
    switch (e.key) {
      case "ArrowRight":
        target = cells[Math.min(cells.length - 1, Math.max(0, i + (rtl ? -1 : 1)))];
        break;
      case "ArrowLeft":
        target = cells[Math.min(cells.length - 1, Math.max(0, i + (rtl ? 1 : -1)))];
        break;
      case "ArrowDown":
      case "ArrowUp": {
        // 보이는 위아래 줄의 가장 가까운 칸 — 묶음 머리를 넘는다
        const down = e.key === "ArrowDown";
        const cx = r.left + r.width / 2;
        let rowTop: number | null = null;
        for (const c of cells) {
          const t = c.getBoundingClientRect().top;
          if (down ? t > r.top + 2 : t < r.top - 2) {
            if (rowTop == null || (down ? t < rowTop : t > rowTop)) rowTop = t;
          }
        }
        if (rowTop == null) break;
        let best = Number.POSITIVE_INFINITY;
        for (const c of cells) {
          const q = c.getBoundingClientRect();
          if (Math.abs(q.top - rowTop) > 2) continue;
          const d = Math.abs(q.left + q.width / 2 - cx);
          if (d < best) {
            best = d;
            target = c;
          }
        }
        break;
      }
      case "Home":
        target = cells.find(sameRow);
        break;
      case "End":
        target = cells.filter(sameRow).pop();
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const id = cell.getAttribute("data-icon");
        if (id) select(id);
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    if (target && target !== cell) focusCell(target);
  };

  const cell = (icon: CategoryIcon) => {
    const Glyph = CATEGORY_ICON_COMPONENTS[icon.id];
    const selected = icon.id === selectedId;
    return (
      <Tooltip key={icon.id}>
        <TooltipTrigger asChild>
          <div
            role="option"
            aria-selected={selected}
            aria-label={icon.name}
            tabIndex={icon.id === tabbableId ? 0 : -1}
            data-slot="icon-picker-cell"
            data-icon={icon.id}
            className={CELL}
            onFocus={() => setActiveId(icon.id)}
            onClick={() => select(icon.id)}
          >
            {Glyph && <Glyph aria-hidden />}
          </div>
        </TooltipTrigger>
        <TooltipContent>{icon.name}</TooltipContent>
      </Tooltip>
    );
  };

  const search = (
    <Input
      ref={searchRef}
      variant="underline"
      size={surface === "sheet" ? "large" : "medium"}
      prefixIcon={<Search />}
      clearable
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="아이콘 이름 검색"
      aria-label="아이콘 검색"
      autoComplete="off"
      spellCheck={false}
      onKeyDown={(e) => {
        // 글자를 조합하는 동안(한글)의 키는 조합의 것이다
        if (e.nativeEvent.isComposing || e.keyCode === 229 || e.key !== "ArrowDown") return;
        e.preventDefault();
        focusCell(cellsOf(listboxRef.current)[0]);
      }}
    />
  );

  const grid = (
    <>
      {searching && results.length === 0 ? (
        <ResultSection
          kind="empty"
          size="medium"
          icon={<SearchX />}
          data-icon-picker="empty"
          title={`'${query.trim()}'에 대한 아이콘이 없어요`}
          description="다른 말로 찾거나 묶음에서 골라주세요."
        />
      ) : (
        <div ref={listboxRef} role="listbox" aria-label="아이콘" data-slot="icon-picker-grid" onKeyDown={onGridKeyDown}>
          {searching ? (
            // 찾는 동안은 묶음 머리가 없다 — 찾기 칸 ↔ 격자 12(searchGap, 묶음 머리 위 여백과 같다)
            <div role="none" className={cn(GRID, GRID_COLUMNS[surface], "pt-x3")}>
              {results.map(cell)}
            </div>
          ) : (
            groups.map(({ group, icons }) => (
              <div key={group} role="group" aria-labelledby={`${headerId}${group}`} data-slot="icon-picker-group">
                <div id={`${headerId}${group}`} role="presentation" data-slot="icon-picker-group-header" className={GROUP_HEADER}>
                  {group}
                </div>
                <div role="none" className={cn(GRID, GRID_COLUMNS[surface])}>
                  {icons.map(cell)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true" data-slot="icon-picker-count">
        {announcement}
      </span>
    </>
  );

  const trigger = (
    <InputButton
      ref={ref}
      size={size}
      value={shownName}
      prefixIcon={<CategoryGlyph id={shownId} />}
      suffixIcon={<ChevronDown />}
      // 버튼의 data-slot(input-button-trigger)은 Input Button 그대로 둔다
      data-icon-picker=""
      data-icon={shownId}
      {...props}
    />
  );

  if (surface === "sheet") {
    return (
      <BottomSheet open={open} onOpenChange={changeOpen}>
        <BottomSheetTrigger asChild>{trigger}</BottomSheetTrigger>
        <BottomSheetContent title="아이콘" data-icon-picker="sheet" onOpenAutoFocus={onOpenAutoFocus} onEscapeKeyDown={onEscapeKeyDown}>
          <div data-slot="icon-picker-search" className="shrink-0 px-global-gutter">
            {search}
          </div>
          {/* 끝 흐림 — 위 20 · 아래 80(본문 안 여백 그만큼). 열 수는 본문 폭(@container)으로 가른다 */}
          <BottomSheetBody scrollFog className="@container">
            {grid}
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheet>
    );
  }
  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        aria-label="아이콘"
        align="start"
        data-icon-picker="popover"
        className="w-[408px]"
        onOpenAutoFocus={onOpenAutoFocus}
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <div data-slot="icon-picker-search" className="shrink-0 px-x6 pt-x6">
          {search}
        </div>
        <PopoverScroll>{grid}</PopoverScroll>
      </PopoverContent>
    </Popover>
  );
});
IconPicker.displayName = "IconPicker";

export { IconPicker };
