'use client';
// 스펙대로 그린 Icon Picker — IconPickerLook(icon-picker.yaml)과 아이콘 세트(category-icons.yaml)만 받아 그린다.
// 격자는 listbox — 묶음(group + 머리) · 칸 48 · 아이콘 24, 고른 칸은 안쪽 2px 짙은 테두리 + 선 2.5. 격자에 Tab 하나(roving),
// ← → 차례 · ↑ ↓ 보이는 위아래 줄의 가까운 칸(묶음을 넘는다) · Home · End 그 줄 · Enter · Space 고르기.
// 찾기 칸(Input 밑줄형)은 치는 대로 거르고 치기를 멈추면 결과 수를 화면 밖으로 알린다 — 0건이면 Result Section.
// 찾기 칸은 스크롤 상자 밖(여는 자리 본문 위에 붙는다 — IpSearchView), 묶음 머리 · 격자는 끝 흐림 상자 안(본문 — IpListView)이다.
// 실제 격자의 칸은 마우스를 올리면(지연 뒤) · 키보드 초점이 오면(바로) 칸 이름 툴팁(groo Tooltip — menu-view)을 띄운다. 네이티브 title 은 쓰지 않는다.
// 트리거(Input Button)와 여는 자리(1280 미만 Bottom Sheet · 이상 Popover)는 select-view · overlay-view 의 그림을 쓴다.
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react';
import { Tag, type LucideIcon } from 'lucide-react';
import { CATEGORY_GLYPHS } from './category-glyphs';
import { IP_COUNT, findIcon, gridColumns, gridRows, icv, pressRatio, searchIcons, typeStyle, type CategoryIcon, type CategoryIconSet, type IconPickerLook, type IpState, type ViewMode } from './input-shared';
import type { ResultSectionLook } from './feedback-shared';
import { ResultSectionView } from './feedback-view';
import type { BubbleLook } from './menu-shared';
import { TooltipControl, TooltipGroup } from './menu-view';
import type { TfInputLook } from './text-field-shared';
import { TfInputView } from './text-field-view';
import { useReducedMotion } from './toggle-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const glyphOf = (id: string | null | undefined): LucideIcon => (id && CATEGORY_GLYPHS[id]) || Tag;

// 아이콘 하나 — 저장 값(lucide 이름)으로
export function CategoryGlyph({ id, size, stroke = 2, color, style }: { id: string | null | undefined; size: number; stroke?: number; color?: string; style?: CSSProperties }) {
  const G = glyphOf(id);
  return <G aria-hidden size={size} strokeWidth={stroke} color={color} style={{ display: 'block', flexShrink: 0, ...style }} />;
}

// ── 칸 ───────────────────────────────────────────────────
export type IpCellProps = {
  look: IconPickerLook;
  mode?: ViewMode;
  entry: CategoryIcon;
  selected?: boolean;
  // 멈춘 그림의 상태 — 없으면 실제 칸
  state?: IpState;
  tabStop?: boolean;
  onPick?: () => void;
  onKey?: (e: KeyboardEvent<HTMLDivElement>) => void;
  cellRef?: (el: HTMLDivElement | null) => void;
  autofocus?: boolean;
  // 칸 툴팁의 트리거 — TooltipControl 이 넘긴 ref · 속성(호버 · 초점 · 누름 처리, 열린 동안 aria-describedby)
  tip?: { ref: (el: HTMLElement | null) => void; props: ButtonHTMLAttributes<HTMLButtonElement> };
  mark?: CSSProperties;
  pin?: ReactNode;
};
// 툴팁이 넘긴 처리는 단추용 타입이다 — 칸(div)의 이벤트를 그대로 넘긴다(쓰는 것은 pointerType · currentTarget 뿐)
type BtnPointer = PointerEvent<HTMLButtonElement>;
type BtnFocus = FocusEvent<HTMLButtonElement>;
export function IpCellView({ look, mode = 'auto', entry, selected = false, state, tabStop = false, onPick, onKey, cellRef, autofocus, tip, mark, pin }: IpCellProps) {
  const live = state === undefined;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const reduce = useReducedMotion();
  const shown: IpState = live ? (press ? 'pressed' : ring ? 'focused' : hover ? 'hovered' : 'enabled') : state;
  const bg = shown === 'pressed' || (live && press) ? icv(look.cell.pressBg, mode) : shown === 'hovered' || (live && hover) ? icv(look.cell.hoverBg, mode) : 'transparent';
  const k = (shown === 'pressed' || (live && press)) && !reduce ? pressRatio(look.press, look.cell.size, look.cell.size) : 1;
  const focused = shown === 'focused' || (live && ring);
  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: look.cell.size,
    height: look.cell.size,
    borderRadius: look.cell.radius,
    background: bg,
    // 고른 칸 — 안쪽에 덧그린다(아이콘이 밀리지 않는다)
    boxShadow: selected ? `inset 0 0 0 ${look.selected.borderWidth}px ${icv(look.selected.borderColor, mode)}` : 'none',
    color: icv(look.icon.color, mode),
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineOffset: look.ring.offset,
    outlineColor: icv(look.ring.color, mode),
    transform: k === 1 ? 'none' : `scale(${k})`,
    transitionProperty: 'background-color, transform',
    transitionDuration: `${look.colorMotion.duration}, ${look.press.motion.duration}`,
    transitionTimingFunction: `${look.colorMotion.easing}, ${look.press.motion.easing}`,
    cursor: live ? 'pointer' : undefined,
    WebkitTapHighlightColor: 'transparent',
    ...mark,
  };
  const glyph = <CategoryGlyph id={entry.id} size={look.icon.size} stroke={selected ? look.icon.selectedStroke : look.icon.stroke} />;
  if (!live)
    return (
      <span aria-hidden data-ip-cell={entry.id} style={style}>
        {glyph}
        {pin}
      </span>
    );
  return (
    <div
      ref={(el) => {
        cellRef?.(el);
        tip?.ref(el);
      }}
      role="option"
      aria-selected={selected}
      aria-label={entry.name}
      aria-describedby={tip?.props['aria-describedby']}
      tabIndex={tabStop ? 0 : -1}
      data-ip-cell={entry.id}
      data-autofocus={autofocus ? '' : undefined}
      style={style}
      onClick={onPick}
      onKeyDown={onKey}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHover(true);
        tip?.props.onPointerEnter?.(e as unknown as BtnPointer);
      }}
      onPointerLeave={(e) => {
        setHover(false);
        setPress(false);
        tip?.props.onPointerLeave?.(e as unknown as BtnPointer);
      }}
      onPointerDown={(e) => {
        if (e.button === 0) setPress(true);
        tip?.props.onPointerDown?.(e as unknown as BtnPointer);
      }}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => {
        setRing(e.currentTarget.matches(':focus-visible'));
        tip?.props.onFocus?.(e as unknown as BtnFocus);
      }}
      onBlur={(e) => {
        setRing(false);
        tip?.props.onBlur?.(e as unknown as BtnFocus);
      }}
    >
      {glyph}
    </div>
  );
}

// ── 격자 ─────────────────────────────────────────────────
export type IpGridProps = {
  look: IconPickerLook;
  set: CategoryIconSet;
  mode?: ViewMode;
  // 놓인 폭 — 주지 않으면 재서 쓴다
  width?: number;
  entries?: CategoryIcon[];
  // 묶음 머리 — 찾는 동안은 없다
  grouped?: boolean;
  value?: string | null;
  live?: boolean;
  onPick?: (id: string) => void;
  // 멈춘 그림 — 칸마다 상태
  states?: Record<string, IpState>;
  // 묶음을 이만큼만(그림을 짧게)
  groups?: string[];
  maxRowsPerGroup?: number;
  // 여는 자리의 열(시트 6 · 팝오버 7) — 넓어도 이보다 많이 두지 않는다
  maxCols?: number;
  ariaLabel?: string;
  // 읽는 말 — 초점이 간 칸("커피, 선택됨")
  onFocusName?: (text: string) => void;
  gridRef?: (api: { focusFirst: () => void } | null) => void;
  // 칸 툴팁의 말풍선(help-bubble.yaml — menuKit().bubble) — live 일 때 칸 이름을 띄운다
  tip?: BubbleLook;
  marks?: Partial<Record<'header' | 'cell' | 'grid', CSSProperties>>;
  pins?: Partial<Record<'header' | 'cell' | 'grid', ReactNode>>;
  pinCell?: string;
};
export function IpGridView({ look, set, mode = 'auto', width, entries: list, grouped = true, value, live = false, onPick, states, groups, maxRowsPerGroup, maxCols, ariaLabel, onFocusName, gridRef, tip, marks, pins, pinCell }: IpGridProps) {
  const base = useId();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  useIsoLayoutEffect(() => {
    if (width !== undefined) return;
    const el = boxRef.current;
    if (!el) return;
    const on = () => setMeasured(el.clientWidth);
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  const W = width ?? measured ?? 312;
  const { cols, gap } = gridColumns(look, W, maxCols);
  const entries = list ?? set.entries;
  const shownGroups = groups ?? set.groups;
  const rows = useMemo(() => {
    const all = gridRows(entries, cols, grouped, shownGroups);
    if (!maxRowsPerGroup) return all;
    const seen = new Map<string, number>();
    return all.filter((r) => {
      const g = r.ids.length ? (entries.find((e) => e.id === r.ids[0])?.group ?? '') : '';
      const n = (seen.get(g) ?? 0) + 1;
      seen.set(g, n);
      return n <= maxRowsPerGroup;
    });
  }, [entries, cols, grouped, shownGroups, maxRowsPerGroup]);
  const flat = rows.flatMap((r) => r.ids);
  const selectedId = findIcon(set, value ?? null)?.id;
  const stop = selectedId && flat.includes(selectedId) ? selectedId : flat[0];
  const cellRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const byId = useMemo(() => new Map(set.entries.map((e) => [e.id, e])), [set.entries]);

  useEffect(() => {
    gridRef?.({ focusFirst: () => flat[0] && cellRefs.current[flat[0]]?.focus() });
    return () => gridRef?.(null);
  });

  const focusId = (id: string | undefined) => id && cellRefs.current[id]?.focus();
  const onKey = (id: string) => (e: KeyboardEvent<HTMLDivElement>) => {
    const r = rows.findIndex((row) => row.ids.includes(id));
    const c = rows[r].ids.indexOf(id);
    const i = flat.indexOf(id);
    let to: string | undefined;
    switch (e.key) {
      case 'ArrowRight':
        to = flat[Math.min(flat.length - 1, i + 1)];
        break;
      case 'ArrowLeft':
        to = flat[Math.max(0, i - 1)];
        break;
      case 'ArrowDown': {
        const row = rows[r + 1];
        to = row ? row.ids[Math.min(c, row.ids.length - 1)] : undefined;
        break;
      }
      case 'ArrowUp': {
        const row = rows[r - 1];
        to = row ? row.ids[Math.min(c, row.ids.length - 1)] : undefined;
        break;
      }
      case 'Home':
        to = rows[r].ids[0];
        break;
      case 'End':
        to = rows[r].ids[rows[r].ids.length - 1];
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onPick?.(id);
        return;
      default:
        return;
    }
    e.preventDefault();
    focusId(to);
  };

  // 묶음마다 — 머리 + 칸 격자(줄은 rows 그대로)
  const sections: { group?: string; rows: string[][] }[] = [];
  for (const row of rows) {
    if (row.group !== undefined || !sections.length) sections.push({ group: row.group, rows: [] });
    sections[sections.length - 1].rows.push(row.ids);
  }
  const gridEl = (
    <div
      ref={boxRef}
      role={live ? 'listbox' : undefined}
      aria-label={live ? (ariaLabel ?? look.title) : undefined}
      aria-hidden={live ? undefined : true}
      data-ip-grid
      style={{ display: 'flex', flexDirection: 'column', width: width ?? '100%', ...marks?.grid }}
    >
      {pins?.grid}
      {sections.map((s, si) => {
        const hid = `${base}g${si}`;
        return (
          <div key={si} role={live && s.group ? 'group' : undefined} aria-labelledby={live && s.group ? hid : undefined}>
            {s.group && (
              <div id={hid} data-ip-header style={{ position: 'relative', paddingTop: look.header.padTop, paddingBottom: look.header.padBottom, ...typeStyle(look.header.text), color: icv(look.header.fg, mode), ...(si === 0 ? marks?.header : undefined) }}>
                {s.group}
                {si === 0 && pins?.header}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${look.cell.size}px)`, columnGap: gap, rowGap: look.grid.rowGap }}>
              {s.rows.flat().map((id) => {
                const e = byId.get(id)!;
                const cellOf = (t?: IpCellProps['tip']) => (
                  <IpCellView
                    key={id}
                    look={look}
                    mode={mode}
                    entry={e}
                    selected={id === selectedId}
                    state={live ? undefined : (states?.[id] ?? 'enabled')}
                    tabStop={id === stop}
                    autofocus={id === stop}
                    onPick={() => onPick?.(id)}
                    onKey={onKey(id)}
                    cellRef={(el) => {
                      cellRefs.current[id] = el;
                      if (el) el.onfocus = () => onFocusName?.(`${e.name}${id === selectedId ? ', 선택됨' : ''}`);
                    }}
                    tip={t}
                    mark={id === pinCell ? marks?.cell : undefined}
                    pin={id === pinCell ? pins?.cell : undefined}
                  />
                );
                // 칸 툴팁 — 칸 이름(한국어). 옆 칸으로 옮기면 앞 말풍선은 바로 걷히고 새 것이 바로 뜬다(TooltipGroup)
                return live && tip ? <TooltipControl key={id} look={tip} mode={mode} text={e.name} side="top" trigger={(r) => cellOf(r)} /> : cellOf();
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
  return live && tip ? <TooltipGroup>{gridEl}</TooltipGroup> : gridEl;
}

// ── 찾기 칸 — 여는 자리 본문 위에 붙는다(스크롤 상자 밖이라 흐리지 않는다) ─────
export type IpGridApi = { focusFirst: () => void };
export type IpSearchProps = {
  look: IconPickerLook;
  input: TfInputLook;
  mode?: ViewMode;
  surface: 'sheet' | 'popover';
  query: string;
  onQuery?: (q: string) => void;
  live?: boolean;
  // 멈춘 그림 — 초점이 간 모습
  focused?: boolean;
  // ↓ — 격자의 첫 칸으로(옮겼으면 true)
  onDown?: () => boolean;
  inputRef?: Ref<HTMLInputElement>;
};
export function IpSearchView({ look, input, mode = 'auto', surface, query, onQuery, live = false, focused = false, onDown, inputRef }: IpSearchProps) {
  return (
    <div data-ip-search="">
      <TfInputView
        look={input}
        mode={mode}
        variant="underline"
        size={surface === 'sheet' ? 'large' : 'medium'}
        prefixIcon="search"
        clearable
        placeholder={look.search.placeholder}
        ariaLabel={look.search.ariaLabel}
        value={query}
        onValue={onQuery}
        state={live ? undefined : focused ? 'focused' : 'enabled'}
        inputRef={inputRef}
        inputProps={{
          autoComplete: 'off',
          spellCheck: false,
          onKeyDown: (e) => {
            // 글자를 조합하는 동안(한글)의 키는 조합의 것이다
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === 'ArrowDown') {
              if (onDown?.()) e.preventDefault();
            } else if (e.key === 'Escape' && query) {
              // 찾는 말이 있으면 지운다 — 비었으면 닫는다(여는 자리가 받는다)
              e.preventDefault();
              onQuery?.('');
            }
          },
        }}
      />
    </div>
  );
}

// 치기를 멈추고 delay 뒤의 글 — 그사이 바뀌면 다시 센다(글자마다 읽지 않게)
function useSettled(text: string, delay: number, key: string) {
  const [said, setSaid] = useState('');
  useEffect(() => {
    if (!text) {
      setSaid('');
      return;
    }
    const t = window.setTimeout(() => setSaid(text), delay);
    return () => window.clearTimeout(t);
  }, [text, delay, key]);
  return said;
}

// ── 목록 — 여는 자리의 본문(스크롤 상자 · 끝 흐림) 안: 묶음 머리 · 격자, 찾는 동안은 결과 격자 · 0건이면 Result Section ─────
export type IpListProps = {
  look: IconPickerLook;
  set: CategoryIconSet;
  result: ResultSectionLook;
  mode?: ViewMode;
  surface: 'sheet' | 'popover';
  value?: string | null;
  query: string;
  onPick?: (id: string) => void;
  live?: boolean;
  width?: number;
  // 멈춘 그림 — 칸 상태 · 묶음 줄 수
  states?: Record<string, IpState>;
  groups?: string[];
  maxRowsPerGroup?: number;
  onFocusName?: (text: string) => void;
  gridRef?: (api: IpGridApi | null) => void;
  // Esc — 찾는 말이 있으면 지우고 찾기 칸으로(여는 자리는 그대로). 없으면 여는 자리가 받아 닫는다
  onEscape?: () => void;
  // 칸 툴팁의 말풍선 — live 일 때
  tip?: BubbleLook;
};
export function IpListView({ look, set, result, mode = 'auto', surface, value, query, onPick, live = false, width, states, groups, maxRowsPerGroup, onFocusName, gridRef, onEscape, tip }: IpListProps) {
  const found = useMemo(() => searchIcons(set, query), [set, query]);
  const searching = query.trim() !== '';
  const said = useSettled(live && searching && found.length ? IP_COUNT.text.replace('{n}', String(found.length)) : '', IP_COUNT.delay, query);
  const emptyTitle = look.empty.title.replace('{검색어}', query.trim());
  const box = useRef<HTMLDivElement | null>(null);
  // 열면 고른 칸이 보이게 — 스크롤 상자(본문)의 가운데로, 처음 한 번. 칸 초점은 여는 자리가 스크롤 없이 준다.
  // 자리는 offsetTop 으로 잰다 — 여는 움직임(크기 · 이동)에 흔들리지 않는다
  useEffect(() => {
    if (!live) return;
    const r = requestAnimationFrame(() => {
      const cell = box.current?.querySelector<HTMLElement>('[data-autofocus]');
      if (!cell) return;
      let scroller = cell.parentElement;
      while (scroller && !/^(auto|scroll)$/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
      if (!scroller) return;
      let y = 0;
      for (let n: HTMLElement | null = cell; n && n !== scroller; n = n.offsetParent as HTMLElement | null) {
        y += n.offsetTop;
        if (!n.offsetParent || !scroller.contains(n.offsetParent)) break;
      }
      scroller.scrollTop = y + cell.offsetHeight / 2 - scroller.clientHeight / 2;
    });
    return () => cancelAnimationFrame(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={box}
      data-ip-list=""
      onKeyDown={
        live && onEscape
          ? (e) => {
              if (e.key === 'Escape' && searching) {
                e.preventDefault();
                onEscape();
              }
            }
          : undefined
      }
    >
      {live && (
        <div role="status" aria-live="polite" aria-atomic="true" data-ip-count="" className="sr-only">
          {said}
        </div>
      )}
      {searching && !found.length ? (
        <div role={live ? 'status' : undefined} style={{ display: 'flex' }}>
          <ResultSectionView look={result} mode={mode} kind="empty" size="medium" icon="search" title={emptyTitle} description={look.empty.description} live={live} />
        </div>
      ) : (
        // 찾는 동안은 묶음 머리가 없다 — 머리 위 여백 대신 searchGap(스크롤 상자 위 여백 + 이만큼 = 찾기 칸 ↔ 격자)
        <div style={{ paddingTop: searching ? look.grid.searchGap : 0 }}>
          <IpGridView
            look={look}
            set={set}
            mode={mode}
            width={width}
            entries={searching ? found : undefined}
            grouped={!searching}
            value={value}
            live={live}
            onPick={onPick}
            states={states}
            groups={groups}
            maxRowsPerGroup={maxRowsPerGroup}
            maxCols={look.surfaces[surface].columns}
            onFocusName={onFocusName}
            gridRef={gridRef}
            tip={tip}
          />
        </div>
      )}
    </div>
  );
}
