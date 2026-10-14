'use client';
// 스펙대로 그린 Tabs — TabsLook(tabs.yaml) · ChipTabsLook(chip-tabs.yaml + chip.yaml)만 받아 그린다.
// live 면 실제 탭이다: 누르거나 ← → · Home · End 로 옮기면 바로 고르고(자동 — 끝에서 처음으로, 막힌 탭은 건너뛴다),
// Tab 은 고른 탭 하나에만 선다. 막대는 목록에 하나 있고 고른 탭의 자리 · 폭으로 미끄러진다(left · width).
// Hug · Chip Tabs 는 고른 탭이 화면 밖이면 스크롤 여유를 두고 그쪽으로 스크롤한다.
// 알림 점은 안 고른 탭에만 그린다(고르면 — 내용을 보면 — 사라진다). 고른 탭이 막히면 막대도 막힌 색이다.
// live 가 아니면 멈춘 그림이다 — states 로 탭마다 누름 · 포커스 · 비활성을 그린다.
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { ChipView, useReducedMotion } from './chip-view';
import { faceOf, nextEnabled, pressRatio, tcv, type ChipTabsLook, type ChipTabsSize, type ChipTabsVariant, type TabItem, type TabsLayout, type TabsLook, type TabsSize, type TabsState, type ViewMode } from './tabs-shared';
import { fogMaskStyle } from './overlay-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
// Anatomy 핀 — 부위 위로 이만큼 띄운다(그림 장식)
const PIN_GAP = 12;

// 보조 기술에만 읽히는 글 — 알림 점은 점만으로 알리지 않는다
export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };

// 탭 · 내용 칸의 id — aria-controls · aria-labelledby 로 잇는다
export const tabId = (base: string, value: string) => `${base}-tab-${value}`;
export const panelId = (base: string, value: string) => `${base}-panel-${value}`;

// 부위 — Anatomy 의 칠 · 핀
export type TabsPart = 'list' | 'trigger' | 'label' | 'indicator' | 'notification';

function PinAbove({ pin, inset, line }: { pin?: ReactNode; inset: number; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      {pin}
      <span style={{ width: 1, height: PIN_GAP + inset, background: line }} />
    </span>
  );
}
function PinBelow({ pin, line }: { pin?: ReactNode; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      <span style={{ width: 1, height: PIN_GAP, background: line }} />
      {pin}
    </span>
  );
}
function PinLeft({ pin, line }: { pin?: ReactNode; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      {pin}
      <span style={{ width: PIN_GAP, height: 1, background: line }} />
    </span>
  );
}

// 알림 점 — Line 은 글 오른쪽 위(글 끝에서 gap, 글 위쪽에 맞춘다 — 탭 폭을 넓히지 않는다)
function TopDot({ look, mode, zone, pin, pinTop, pinLine }: { look: TabsLook; mode: ViewMode; zone?: CSSProperties; pin?: ReactNode; pinTop: number; pinLine: string }) {
  const n = look.notification;
  return (
    <span
      aria-hidden
      data-tabs-dot
      style={{ position: 'absolute', top: 0, left: `calc(100% + ${n.gap}px)`, width: n.size, height: n.size, borderRadius: n.radius, background: tcv(n.color, mode), ...zone }}
    >
      <PinAbove pin={pin} inset={pinTop} line={pinLine} />
    </span>
  );
}

// ── Line 탭 하나 ─────────────────────────────────────────
type LineTabProps = {
  look: TabsLook;
  mode: ViewMode;
  layout: TabsLayout;
  size: TabsSize;
  item: TabItem;
  selected: boolean;
  live: boolean;
  state?: TabsState;
  tabIndex?: number;
  ids?: { tab: string; panel?: string };
  // 막대를 이 탭 안에 그린다 — 재기 전(서버 HTML)에만. 잰 뒤에는 목록의 막대가 미끄러진다
  innerBar: boolean;
  squeeze?: boolean;
  srNew?: string;
  onSelect?: () => void;
  onKey?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  refCb?: (el: HTMLElement | null) => void;
  zone?: Partial<Record<TabsPart, CSSProperties>>;
  pins?: Partial<Record<TabsPart, ReactNode>>;
  pinLine: string;
};

function LineTab({ look, mode, layout, size, item, selected, live, state, tabIndex, ids, innerBar, squeeze, srNew = '새 소식', onSelect, onKey, refCb, zone, pins, pinLine }: LineTabProps) {
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const disabled = live ? !!item.disabled : state === 'disabled';
  const shown: TabsState = live ? (disabled ? 'disabled' : press ? 'pressed' : 'enabled') : (state ?? 'enabled');
  const focused = live ? ring && !disabled : state === 'focused';
  const face = faceOf(look, selected, shown);
  const L = look.layouts[layout];
  const S = look.sizes[size];

  // 멈춘 누름 — 그린 폭으로 축소 배율을 셈한다(재기 전에는 높이로)
  useIsoLayoutEffect(() => {
    if (live || shown !== 'pressed' || !ref.current) return;
    setBox({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [live, shown]);
  const scale = face.scale && !reduce ? pressRatio(look.press, box?.w ?? S.h, box?.h ?? S.h) : 1;
  const ringOn = focused && faceOf(look, selected, 'focused').ring;

  const css: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: look.trigger.align,
    justifyContent: 'center',
    boxSizing: 'border-box',
    flexGrow: L.grow,
    flexShrink: L.grow ? 1 : 0,
    flexBasis: L.grow ? '0%' : 'auto',
    minWidth: squeeze ? 0 : 'auto',
    minHeight: S.h,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: look.trigger.padY,
    paddingBottom: look.trigger.padY,
    paddingLeft: look.trigger.padX,
    paddingRight: look.trigger.padX,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: 0,
    background: 'transparent',
    color: tcv(face.fg, mode),
    fontFamily: FONT,
    fontSize: S.text.fontSize,
    lineHeight: S.text.lineHeight,
    fontWeight: S.text.fontWeight,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: face.cursor,
    userSelect: 'none',
    outlineStyle: ringOn ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: tcv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    transform: scale !== 1 ? `scale(${scale})` : 'none',
    transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}`,
    WebkitTapHighlightColor: 'transparent',
    ...zone?.trigger,
  };
  // 탭 위 끝에서 글 위 끝까지 — 글은 아래로 붙는다(아래 padY, 남는 높이는 위로)
  const top = S.h - look.trigger.padY - parseFloat(S.text.lineHeight);
  // 알림 점 — 고른 탭에는 없다(내용을 보면 사라진다)
  const dot = !!item.notification && !selected;
  const label = (
    <span
      data-tabs-label
      style={{ position: 'relative', display: 'block', minWidth: 0, maxWidth: '100%', overflow: squeeze ? 'hidden' : 'visible', textOverflow: squeeze ? 'ellipsis' : 'clip', ...zone?.label }}
    >
      {item.label}
      {dot && <TopDot look={look} mode={mode} zone={zone?.notification} pin={pins?.notification} pinTop={top} pinLine={pinLine} />}
      <PinAbove pin={pins?.label} inset={top} line={pinLine} />
    </span>
  );
  const bar = innerBar && selected && (
    <span
      aria-hidden
      data-tabs-indicator="inner"
      style={{ position: 'absolute', left: L.inset, right: L.inset, bottom: 0, height: look.indicator.h, borderRadius: look.indicator.radius, background: tcv(look.indicator.colors[shown], mode), pointerEvents: 'none', ...zone?.indicator }}
    >
      <PinBelow pin={pins?.indicator} line={pinLine} />
    </span>
  );
  const data = { 'data-tab': item.value, 'data-selected': selected ? 'true' : 'false', 'data-state': focused ? 'focused' : shown };

  if (!live)
    return (
      <span
        ref={(el) => {
          ref.current = el;
          refCb?.(el);
        }}
        {...data}
        style={css}
      >
        {bar}
        {label}
        {dot && <span style={srOnly}>{srNew}</span>}
        <PinAbove pin={pins?.trigger} inset={0} line={pinLine} />
      </span>
    );

  return (
    <button
      ref={(el) => {
        ref.current = el;
        refCb?.(el);
      }}
      type="button"
      role="tab"
      id={ids?.tab}
      aria-selected={selected}
      aria-controls={ids?.panel}
      disabled={disabled}
      tabIndex={tabIndex}
      {...data}
      style={css}
      onPointerDown={(e) => {
        if (e.button !== 0 || disabled) return;
        setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
        setPress(true);
      }}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => (setRing(false), setPress(false))}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
          setPress(true);
        }
        onKey?.(e);
      }}
      onKeyUp={() => setPress(false)}
      onClick={onSelect}
    >
      {bar}
      {label}
      {dot && <span style={srOnly}>{srNew}</span>}
    </button>
  );
}

// ── Line 목록 ────────────────────────────────────────────
export type LineTabsViewProps = {
  look: TabsLook;
  mode?: ViewMode;
  layout?: TabsLayout;
  size?: TabsSize;
  items: TabItem[];
  // live 가 아니면 멈춘 그림 — value 를 고른 모습, states 로 탭마다 상태
  live?: boolean;
  value?: string;
  defaultValue?: string;
  onValue?: (v: string) => void;
  states?: Record<string, TabsState>;
  ariaLabel?: string;
  idBase?: string;
  // 처음 스크롤 — Hug 에서 고른 탭을 보이게(기본) 또는 이 값의 탭을 보이게
  scrollTo?: string;
  squeeze?: boolean;
  srNew?: string;
  zone?: Partial<Record<TabsPart, CSSProperties>>;
  // 탭마다 칠 · 핀 — 값 → 부위
  tabZone?: Record<string, Partial<Record<TabsPart, CSSProperties>>>;
  tabPins?: Record<string, Partial<Record<TabsPart, ReactNode>>>;
  pins?: Partial<Record<TabsPart, ReactNode>>;
  pinLine?: string;
  style?: CSSProperties;
};

export function LineTabsView({
  look,
  mode = 'auto',
  layout = look.defaults.layout,
  size = look.defaults.size,
  items,
  live = true,
  value,
  defaultValue,
  onValue,
  states,
  ariaLabel,
  idBase,
  scrollTo,
  squeeze,
  srNew,
  zone,
  tabZone,
  tabPins,
  pins,
  pinLine = 'currentColor',
  style,
}: LineTabsViewProps) {
  const L = look.layouts[layout];
  const S = look.sizes[size];
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const cur = value ?? inner;
  const listRef = useRef<HTMLDivElement | null>(null);
  const tabs = useRef(new Map<string, HTMLElement | null>());
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  const reduce = useReducedMotion();
  const first = useRef(true);

  // 막대 — 고른 탭의 자리 · 폭에서 들임만큼(Fill 16 · Hug 0). 목록이 안 보이면(폭 0) 재지 않는다
  const measure = useCallback(() => {
    const list = listRef.current;
    const el = cur !== undefined ? tabs.current.get(cur) : undefined;
    if (!list || !el || list.clientWidth === 0) return;
    const left = el.offsetLeft + L.inset;
    const width = el.offsetWidth - L.inset * 2;
    setBar((b) => (b && b.left === left && b.width === width ? b : { left, width }));
  }, [cur, L.inset]);
  useIsoLayoutEffect(() => measure(), [measure, layout, size, items]);
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    tabs.current.forEach((el) => el && ro.observe(el));
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [measure, items]);
  // 처음 놓인 뒤부터 미끄러진다(처음부터 0 에서 날아오지 않게)
  useEffect(() => {
    if (!bar || animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [bar, animate]);

  // Hug — 고른 탭(또는 scrollTo 의 탭)이 화면 밖이면 스크롤 여유를 두고 가까운 쪽으로
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const target = first.current && scrollTo ? scrollTo : cur;
    const el = target !== undefined ? tabs.current.get(target) : undefined;
    if (!list || !el || L.overflowX !== 'auto' || list.clientWidth === 0) return;
    const pad = L.scrollPadding;
    const l = el.offsetLeft;
    const r = l + el.offsetWidth;
    let to = list.scrollLeft;
    if (l - pad < list.scrollLeft) to = l - pad;
    else if (r + pad > list.scrollLeft + list.clientWidth) to = r + pad - list.clientWidth;
    to = Math.max(0, to);
    if (Math.abs(to - list.scrollLeft) > 0.5) list.scrollTo({ left: to, behavior: first.current || reduce ? 'auto' : 'smooth' });
    first.current = false;
  }, [cur, layout]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    if (v !== cur) onValue?.(v);
  };
  const picked = items.findIndex((it) => it.value === cur && !it.disabled);
  const stop = picked >= 0 ? picked : items.findIndex((it) => !it.disabled);
  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = nextEnabled(items, i, e.key);
    if (next === undefined) return;
    e.preventDefault();
    select(items[next].value);
    tabs.current.get(items[next].value)?.focus({ preventScroll: true });
  };

  const listCss: CSSProperties = {
    position: 'relative',
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
    // 세로 flex 안에서 줄지 않는다 — 스크롤 칸은 최소 높이가 0 이라 좁은 화면에서 납작해진다
    flexShrink: 0,
    minHeight: S.h,
    paddingLeft: L.padX,
    paddingRight: L.padX,
    background: tcv(look.list.bg, mode),
    boxShadow: `inset 0 -${look.list.lineWidth}px 0 0 ${tcv(look.list.line, mode)}`,
    overflowX: L.overflowX === 'auto' ? 'auto' : 'visible',
    overflowY: L.overflowX === 'auto' ? 'hidden' : 'visible',
    scrollPaddingLeft: L.scrollPadding,
    scrollPaddingRight: L.scrollPadding,
    scrollbarWidth: 'none',
    ...zone?.list,
    ...style,
  };
  const measured = bar !== null;
  // 막대 색 — 고른 탭의 상태(막힌 탭이면 막힌 색)
  const curItem = items.find((it) => it.value === cur);
  const frozen = !live && cur !== undefined ? states?.[cur] : undefined;
  const barState: TabsState = curItem?.disabled || frozen === 'disabled' ? 'disabled' : (frozen ?? 'enabled');
  return (
    <div
      ref={listRef}
      role={live ? 'tablist' : undefined}
      aria-label={live ? ariaLabel : undefined}
      aria-orientation={live ? 'horizontal' : undefined}
      data-tabs-list={layout}
      data-size={size}
      style={listCss}
    >
      <PinLeft pin={pins?.list} line={pinLine} />
      {/* 막대 — 목록의 첫 자식이라 탭이 그 위에 그려진다(키보드 포커스 링이 막대에 가리지 않는다) */}
      {measured && (
        <span
          aria-hidden
          data-tabs-indicator="list"
          style={{
            position: 'absolute',
            left: bar.left,
            width: bar.width,
            bottom: 0,
            height: look.indicator.h,
            borderRadius: look.indicator.radius,
            background: tcv(look.indicator.colors[barState], mode),
            transition: animate ? look.indicator.props.map((p) => `${p} ${look.indicator.motion.duration} ${look.indicator.motion.easing}`).join(', ') : 'none',
            pointerEvents: 'none',
            ...zone?.indicator,
          }}
        >
          <PinBelow pin={pins?.indicator} line={pinLine} />
        </span>
      )}
      {items.map((it, i) => (
        <LineTab
          key={it.value}
          look={look}
          mode={mode}
          layout={layout}
          size={size}
          item={it}
          selected={it.value === cur}
          live={live}
          state={states?.[it.value]}
          tabIndex={i === stop ? 0 : -1}
          ids={idBase ? { tab: tabId(idBase, it.value), panel: panelId(idBase, it.value) } : undefined}
          innerBar={!measured}
          squeeze={squeeze}
          srNew={srNew}
          onSelect={() => select(it.value)}
          onKey={onKey(i)}
          refCb={(el) => void tabs.current.set(it.value, el)}
          zone={tabZone?.[it.value]}
          pins={{ ...tabPins?.[it.value], ...(it.value === cur ? { indicator: pins?.indicator } : {}) }}
          pinLine={pinLine}
        />
      ))}
    </div>
  );
}

// ── 내용 칸 ──────────────────────────────────────────────
// 고른 탭의 내용 — 안 고른 칸은 숨기기만 한다(스크롤 · 입력 상태가 남는다). 포커스할 것이 없어도 Tab 이 선다
export function TabPanel({ idBase, value, active, children, style, className }: { idBase: string; value: string; active: boolean; children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div role="tabpanel" id={panelId(idBase, value)} aria-labelledby={tabId(idBase, value)} tabIndex={0} hidden={!active} className={className} style={style}>
      {children}
    </div>
  );
}

// ── Chip Tabs ────────────────────────────────────────────
export type ChipTabsViewProps = {
  look: ChipTabsLook;
  mode?: ViewMode;
  variant?: ChipTabsVariant;
  size?: ChipTabsSize;
  items: TabItem[];
  live?: boolean;
  value?: string;
  defaultValue?: string;
  onValue?: (v: string) => void;
  ariaLabel?: string;
  idBase?: string;
  srNew?: string;
  // 그림 — 목록 칠
  zone?: CSSProperties;
  style?: CSSProperties;
};

// 알림 점 — Chip Tabs 는 글 뒤(gap), 세로 가운데. 칩 폭이 그만큼 넓어진다
export function ChipTabLabel({ look, mode, item, selected = false, srNew }: { look: ChipTabsLook; mode: ViewMode; item: TabItem; selected?: boolean; srNew: string }) {
  // 고른 칩에는 점이 없다(내용을 보면 사라진다)
  if (!item.notification || selected) return <>{item.label}</>;
  const n = look.notification;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', columnGap: n.gap }}>
      {item.label}
      <span aria-hidden data-tabs-dot style={{ display: 'block', flex: 'none', width: n.size, height: n.size, borderRadius: n.radius, background: tcv(n.color, mode) }} />
      <span style={srOnly}>{srNew}</span>
    </span>
  );
}

export function ChipTabsView({ look, mode = 'auto', variant = look.defaults.variant, size = look.defaults.size, items, live = true, value, defaultValue, onValue, ariaLabel, idBase, srNew = '새 소식', zone, style }: ChipTabsViewProps) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const cur = value ?? inner;
  const listRef = useRef<HTMLDivElement | null>(null);
  const tabs = useRef(new Map<string, HTMLButtonElement | null>());
  const reduce = useReducedMotion();
  const first = useRef(true);
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    if (v !== cur) onValue?.(v);
  };
  // 고른 칩이 화면 밖이면 스크롤 여유를 두고 가까운 쪽으로(Line Hug 와 같다)
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const el = cur !== undefined ? tabs.current.get(cur) : undefined;
    if (!list || !el || list.clientWidth === 0) return;
    const pad = look.scrollPadding;
    const l = el.offsetLeft;
    const r = l + el.offsetWidth;
    let to = list.scrollLeft;
    if (l - pad < list.scrollLeft) to = l - pad;
    else if (r + pad > list.scrollLeft + list.clientWidth) to = r + pad - list.clientWidth;
    to = Math.max(0, to);
    if (Math.abs(to - list.scrollLeft) > 0.5) list.scrollTo({ left: to, behavior: first.current || reduce ? 'auto' : 'smooth' });
    first.current = false;
  }, [cur]);
  const picked = items.findIndex((it) => it.value === cur && !it.disabled);
  const stop = picked >= 0 ? picked : items.findIndex((it) => !it.disabled);
  return (
    <div
      ref={listRef}
      role={live ? 'tablist' : undefined}
      aria-label={live ? ariaLabel : undefined}
      aria-orientation={live ? 'horizontal' : undefined}
      data-chip-tabs={variant}
      style={{
        position: 'relative',
        display: 'flex',
        boxSizing: 'border-box',
        width: '100%',
        flexShrink: 0,
        columnGap: look.gap,
        paddingTop: look.padY,
        paddingBottom: look.padY,
        paddingLeft: look.padX,
        paddingRight: look.padX,
        overflowX: look.overflowX,
        overflowY: 'hidden',
        scrollPaddingLeft: look.scrollPadding,
        scrollPaddingRight: look.scrollPadding,
        scrollbarWidth: 'none',
        // 양 끝은 늘 흐리다(Scroll Fog row — 마스크). 목록 좌우 여백이 흐림보다 넓어 처음 · 끝 칩은 흐리지 않는다
        ...fogMaskStyle(look.mask, { left: look.fog, right: look.fog }),
        ...zone,
        ...style,
      }}
    >
      {items.map((it, i) => (
        <ChipView
          key={it.value}
          look={look.chip}
          mode={mode}
          variant={look.variants[variant]}
          size={look.sizes[size]}
          selected={it.value === cur}
          state={live ? undefined : it.disabled ? 'disabled' : 'enabled'}
          disabled={it.disabled}
          role="tab"
          id={idBase ? tabId(idBase, it.value) : undefined}
          controls={idBase ? panelId(idBase, it.value) : undefined}
          tabIndex={i === stop ? 0 : -1}
          label={<ChipTabLabel look={look} mode={mode} item={it} selected={it.value === cur} srNew={srNew} />}
          buttonRef={(el) => void tabs.current.set(it.value, el)}
          onClick={() => select(it.value)}
          onKeyDown={(e) => {
            const next = nextEnabled(items, i, e.key);
            if (next === undefined) return;
            e.preventDefault();
            select(items[next].value);
            tabs.current.get(items[next].value)?.focus({ preventScroll: true });
          }}
        />
      ))}
    </div>
  );
}
