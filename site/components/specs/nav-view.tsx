'use client';
// 스펙대로 그린 상단 바 · 하단 탭 바 · 떠 있는 버튼 — NavKit(nav-look 이 YAML 에서 푼 값)만 받아 그린다.
// live 면 실제 버튼이다(마우스를 올리면 바탕 · 누르면 바탕 + 2px 축소 · 키보드 포커스에만 링). live 가 아니면 멈춘 그림이고
// state 로 상태를 정해 그린다. 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
// 인라인 스타일은 늘 긴 이름(paddingTop …)으로 쓴다 — 짧은 이름과 섞이면 링크로 들어올 때 값이 지워진다(사이트 #154).
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from 'react';
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock,
  CreditCard,
  Download,
  Ellipsis,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Heart,
  House,
  LayoutGrid,
  ListTodo,
  Megaphone,
  Menu,
  NotebookPen,
  PanelLeft,
  Pencil,
  PieChart,
  Plane,
  Plus,
  Search,
  Settings,
  Share2,
  Shield,
  SlidersHorizontal,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import { ButtonView } from './button-view';
import { useReducedMotion } from './overlay-view';
import { FONT, ncv, nsv, pressRatio, srOnly, tabBottom, textOf, type FabLook, type FabState, type NavIcon, type TabBarLook, type TabItem, type TabSize, type TopAction, type TopLeading, type TopNavLook, type TopState, type TopTone, type TopType, type ViewMode } from './nav-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const NAV_GLYPHS: Record<NavIcon, LucideIcon> = {
  house: House,
  ledger: ClipboardList,
  calendar: CalendarDays,
  menu: Menu,
  plus: Plus,
  bell: Bell,
  search: Search,
  settings: Settings,
  eye: Eye,
  'eye-off': EyeOff,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  x: X,
  more: Ellipsis,
  'panel-left': PanelLeft,
  grid: LayoutGrid,
  wallet: Wallet,
  trend: TrendingUp,
  pie: PieChart,
  target: Target,
  todo: ListTodo,
  users: Users,
  memo: NotebookPen,
  card: CreditCard,
  plane: Plane,
  briefcase: Briefcase,
  heart: Heart,
  shield: Shield,
  megaphone: Megaphone,
  pencil: Pencil,
  user: User,
  clock: Clock,
  'file-text': FileText,
  filter: Filter,
  download: Download,
  book: BookOpen,
  help: CircleHelp,
  share: Share2,
  sliders: SlidersHorizontal,
  star: Star,
};
export function NavGlyph({ name, size, color, strokeWidth = 2, style }: { name: NavIcon; size: number; color?: string; strokeWidth?: number; style?: CSSProperties }) {
  const I = NAV_GLYPHS[name];
  return <I aria-hidden size={size} strokeWidth={strokeWidth} color={color} style={{ display: 'block', flexShrink: 0, ...style }} />;
}

// 키보드 포커스에만 링 — :focus-visible 을 따른다
export function useFocusRing() {
  const [ring, setRing] = useState(false);
  return {
    ring,
    onFocus: (e: { currentTarget: Element }) => setRing(e.currentTarget.matches(':focus-visible')),
    onBlur: () => setRing(false),
  };
}
// 마우스 호버 · 누름 — 멈춘 그림은 state 로 정한다
export function usePress() {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  return {
    hover,
    press,
    handlers: {
      onPointerEnter: (e: { pointerType: string }) => e.pointerType === 'mouse' && setHover(true),
      onPointerLeave: () => {
        setHover(false);
        setPress(false);
      },
      onPointerDown: () => setPress(true),
      onPointerUp: () => setPress(false),
      onPointerCancel: () => setPress(false),
    },
  };
}

const resetBox: CSSProperties = { marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, borderWidth: 0, borderStyle: 'none', background: 'transparent', color: 'inherit', WebkitTapHighlightColor: 'transparent' };

// ── 상단 바의 아이콘 버튼 · 글 버튼 ─────────────────────────
export type TopPart = 'root' | 'leading' | 'title' | 'trailing' | 'icon' | 'text' | 'dot' | 'primary';
export type TopZone = Partial<Record<TopPart, CSSProperties>>;

export function TopIconButton({
  look,
  mode = 'auto',
  icon,
  label,
  notification = false,
  pressed,
  disabled = false,
  state,
  live = false,
  onClick,
  zone,
  pin,
  dotPin,
  ariaExpanded,
  ariaHaspopup,
  buttonRef,
  rootProps,
}: {
  look: TopNavLook;
  mode?: ViewMode;
  icon: NavIcon;
  label: string;
  notification?: boolean;
  // 켜고 끄는 단추 — aria-pressed. 켬은 선 굵게(pressedStroke), 색은 켬 · 끔 모두 fg(19B)
  pressed?: boolean;
  disabled?: boolean;
  state?: TopState;
  live?: boolean;
  onClick?: () => void;
  zone?: TopZone;
  pin?: ReactNode;
  dotPin?: ReactNode;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'dialog' | 'menu';
  // 툴팁 · 말풍선 트리거 — 단추 요소와 aria · 포인터 처리를 넘긴다(단추의 호버 · 누름 · 링은 그대로)
  buttonRef?: (el: HTMLButtonElement | null) => void;
  rootProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const I = look.icon;
  const off = disabled || state === 'disabled';
  const shown: TopState = live ? (off ? 'disabled' : p.press ? 'pressed' : p.hover ? 'hovered' : 'enabled') : (state ?? (off ? 'disabled' : 'enabled'));
  const focused = live ? f.ring && !off : state === 'focused';
  const bg = shown === 'pressed' ? ncv(I.pressBg, mode) : shown === 'hovered' ? ncv(I.hoverBg, mode) : 'transparent';
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, I.size, I.size) : 1;
  const box: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: I.size,
    height: I.size,
    borderRadius: I.radius,
    background: bg,
    color: ncv(off ? I.disabledFg : I.fg, mode),
    cursor: live ? (off ? 'not-allowed' : 'pointer') : undefined,
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transition: `background-color ${look.color.duration} ${look.color.easing}, transform ${look.press.motion.duration} ${look.press.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.icon,
  };
  const glyph = (
    <span style={{ position: 'relative', display: 'block', width: I.icon, height: I.icon }}>
      <NavGlyph name={icon} size={I.icon} strokeWidth={pressed ? I.pressedStroke : I.stroke} />
      {notification && (
        <span aria-hidden data-nav-dot style={{ position: 'absolute', top: look.dot.top, right: look.dot.right, width: look.dot.size, height: look.dot.size, borderRadius: 9999, background: ncv(look.dot.color, mode), ...zone?.dot }}>
          {dotPin}
        </span>
      )}
    </span>
  );
  if (!live)
    return (
      <span aria-hidden data-nav-icon-button style={box}>
        {glyph}
        {pin}
      </span>
    );
  const h = p.handlers;
  return (
    <button
      {...rootProps}
      ref={buttonRef}
      type="button"
      data-nav-icon-button
      aria-label={label}
      aria-pressed={pressed}
      aria-disabled={off || undefined}
      aria-expanded={ariaExpanded ?? rootProps?.['aria-expanded']}
      aria-haspopup={ariaHaspopup ?? rootProps?.['aria-haspopup']}
      style={box}
      className="outline-none"
      onClick={(e) => {
        rootProps?.onClick?.(e);
        if (!off) onClick?.();
      }}
      onFocus={(e) => {
        rootProps?.onFocus?.(e);
        f.onFocus(e);
      }}
      onBlur={(e) => {
        rootProps?.onBlur?.(e);
        f.onBlur();
      }}
      onPointerEnter={(e) => {
        rootProps?.onPointerEnter?.(e);
        h.onPointerEnter(e);
      }}
      onPointerLeave={(e) => {
        rootProps?.onPointerLeave?.(e);
        h.onPointerLeave();
      }}
      onPointerDown={(e) => {
        rootProps?.onPointerDown?.(e);
        h.onPointerDown();
      }}
      onPointerUp={(e) => {
        rootProps?.onPointerUp?.(e);
        h.onPointerUp();
      }}
      onPointerCancel={(e) => {
        rootProps?.onPointerCancel?.(e);
        h.onPointerCancel();
      }}
    >
      {glyph}
      {pin}
    </button>
  );
}

export function TopTextButton({ look, mode = 'auto', label, disabled = false, state, live = false, onClick, zone, pin }: { look: TopNavLook; mode?: ViewMode; label: string; disabled?: boolean; state?: TopState; live?: boolean; onClick?: () => void; zone?: TopZone; pin?: ReactNode }) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [w, setW] = useState(0);
  const T = look.text;
  const off = disabled || state === 'disabled';
  const shown: TopState = live ? (off ? 'disabled' : p.press ? 'pressed' : p.hover ? 'hovered' : 'enabled') : (state ?? (off ? 'disabled' : 'enabled'));
  const focused = live ? f.ring && !off : state === 'focused';
  useIsoLayoutEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth);
  }, [label]);
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, w || T.height, T.height) : 1;
  const style: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: T.height,
    paddingLeft: T.padX,
    paddingRight: T.padX,
    borderRadius: T.radius,
    background: shown === 'pressed' ? ncv(T.pressBg, mode) : shown === 'hovered' ? ncv(T.hoverBg, mode) : 'transparent',
    ...textOf(T.type, ncv(off ? T.disabledFg : T.fg, mode)),
    whiteSpace: 'nowrap',
    cursor: live ? (off ? 'not-allowed' : 'pointer') : undefined,
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transition: `background-color ${look.color.duration} ${look.color.easing}, transform ${look.press.motion.duration} ${look.press.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.text,
  };
  if (!live)
    return (
      <span ref={ref} aria-hidden style={style}>
        {label}
        {pin}
      </span>
    );
  return (
    <button ref={(el) => void (ref.current = el)} type="button" aria-disabled={off || undefined} style={style} className="outline-none" onClick={off ? undefined : onClick} onFocus={f.onFocus} onBlur={f.onBlur} {...p.handlers}>
      {label}
      {pin}
    </button>
  );
}

// ── 상단 바 ──────────────────────────────────────────────
// 사진 위 투명 바(tone transparent) — 바탕 없음 · 제목 · 아이콘 · 글 버튼 흰 글자. 누름 · 호버 바탕은 열린 일이라 칠하지 않는다(축소만)
const CLEAR = { name: undefined, light: 'transparent', dark: 'transparent' };
export function toneLook(look: TopNavLook, tone: TopTone = 'layer'): TopNavLook {
  if (tone === 'layer') return look;
  const { fg, disabledFg } = look.transparent;
  return {
    ...look,
    bg: CLEAR,
    title: { ...look.title, fg },
    icon: { ...look.icon, fg, hoverBg: CLEAR, pressBg: CLEAR, disabledFg },
    text: { ...look.text, fg, hoverBg: CLEAR, pressBg: CLEAR, disabledFg },
  };
}
export type TopNavBarProps = {
  look: TopNavLook;
  // layer(기본) · transparent — 사진 위 투명 바
  tone?: TopTone;
  mode?: ViewMode;
  type?: TopType;
  leading?: TopLeading | null;
  leadingState?: TopState;
  title?: ReactNode;
  actions?: TopAction[];
  // 오른쪽 자리에 직접 그린 것(다른 그림이 쓰던 버튼) — 아이콘 버튼 뒤에 붙는다
  trailing?: ReactNode;
  // 검색칸(Text Field outline medium — 부르는 쪽이 그린다). standard 는 제목 자리(← 다음 6 부터 오른쪽 자리 앞 8 까지), desktop 은 머리 왼쪽 look.search.desktopWidth
  search?: ReactNode;
  primary?: { label: string; icon?: 'plus'; state?: 'enabled' | 'hovered' | 'pressed' | 'focused' };
  live?: boolean;
  width?: number | string;
  // 위 안전 영역(상태 표시줄) — 바가 그만큼 높아지고 내용은 그 아래 높이에 놓인다
  safeTop?: number;
  onLeading?: () => void;
  onAction?: (i: number) => void;
  onPrimary?: () => void;
  leadingExpanded?: boolean;
  zone?: TopZone;
  pins?: Partial<Record<TopPart, ReactNode>>;
  // 아이콘 버튼 하나에만 핀(오른쪽 자리의 i 번째)
  actionPins?: Record<number, ReactNode>;
  dotPin?: ReactNode;
  // 기본은 그림(div) — 미리보기에서 header 로
  as?: 'div' | 'header';
  ariaLabel?: string;
  style?: CSSProperties;
};
export function TopNavBar({
  look: baseLook,
  tone = 'layer',
  mode = 'auto',
  type = 'standard',
  leading = type === 'standard' ? 'back' : null,
  leadingState,
  title,
  actions = [],
  trailing,
  search,
  primary,
  live = false,
  width = '100%',
  safeTop = 0,
  onLeading,
  onAction,
  onPrimary,
  leadingExpanded,
  zone,
  pins,
  actionPins,
  dotPin,
  as = 'div',
  ariaLabel,
  style,
}: TopNavBarProps) {
  const look = toneLook(baseLook, tone);
  const desktop = type === 'desktop';
  const tt = type === 'root' ? look.types.root : look.types.standard;
  const padL = desktop ? look.desktop.padLeft : look.padX;
  const padR = desktop ? look.desktop.padRight : look.padX;
  const hasLeading = !desktop && type === 'standard' && !!leading;
  // 제목의 시작 — 화면 끝에서 left(루트 16 · 하위 56). 바의 여백 · 왼쪽 버튼을 뺀 나머지를 제목 앞에 둔다
  const titleLeft = tt.left - padL - (hasLeading ? look.icon.size : 0);
  const Root = as;
  return (
    <Root
      aria-label={ariaLabel}
      data-nav-top={type}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        boxSizing: 'border-box',
        width,
        height: safeTop + look.height,
        paddingTop: safeTop,
        paddingLeft: padL,
        paddingRight: padR,
        background: ncv(look.bg, mode),
        boxShadow: 'none',
        fontFamily: FONT,
        flexShrink: 0,
        ...zone?.root,
        ...style,
      }}
    >
      {pins?.root}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', height: look.height, minWidth: 0 }}>
        {hasLeading && (
          <span style={{ position: 'relative', display: 'flex', flexShrink: 0, ...zone?.leading }}>
            <TopIconButton look={look} mode={mode} icon={look.leading[leading!].icon} label={look.leading[leading!].label} state={leadingState} live={live} onClick={onLeading} ariaExpanded={leading === 'menu' ? !!leadingExpanded : undefined} ariaHaspopup={leading === 'menu' ? 'dialog' : undefined} />
            {pins?.leading}
          </span>
        )}
        {desktop ? (
          search ? (
            <span data-nav-search style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: `0 1 ${look.search.desktopWidth}px`, minWidth: 0, marginRight: 'auto', paddingRight: look.title.gap, ...zone?.title }}>
              {search}
              {pins?.title}
            </span>
          ) : (
            <span style={{ flex: '1 1 auto' }} />
          )
        ) : search ? (
          <span data-nav-search style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0, marginLeft: titleLeft, marginRight: actions.length || trailing ? look.title.gap : 0, ...zone?.title }}>
            {search}
            {pins?.title}
          </span>
        ) : (
          <span
            data-nav-title
            style={{
              position: 'relative',
              flex: '1 1 auto',
              minWidth: 0,
              marginLeft: titleLeft,
              marginRight: actions.length || trailing ? look.title.gap : 0,
              ...textOf({ ...tt.text, fontWeight: look.title.weight }, ncv(look.title.fg, mode)),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...zone?.title,
            }}
          >
            {title}
            {pins?.title}
          </span>
        )}
        {(actions.length > 0 || primary || trailing) && (
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0, ...zone?.trailing }}>
            {pins?.trailing}
            {primary && (
              <span style={{ position: 'relative', display: 'flex', marginRight: look.desktop.primaryGap, ...zone?.primary }}>
                <ButtonView look={look.primary} mode={mode} label={primary.label} prefix={primary.icon} state={live ? 'live' : (primary.state ?? 'enabled')} onClick={onPrimary} />
                {pins?.primary}
              </span>
            )}
            {actions.map((a, i) =>
              a.kind === 'text' ? (
                <TopTextButton key={i} look={look} mode={mode} label={a.label} disabled={a.disabled} state={a.state} live={live} onClick={() => onAction?.(i)} zone={zone} pin={actionPins?.[i]} />
              ) : (
                <TopIconButton key={i} look={look} mode={mode} icon={a.icon} label={a.label} notification={a.notification} pressed={a.pressed} disabled={a.disabled} state={a.state} live={live} onClick={() => onAction?.(i)} zone={zone} pin={actionPins?.[i]} dotPin={a.notification ? dotPin : undefined} />
              ),
            )}
            {trailing}
          </span>
        )}
      </div>
    </Root>
  );
}

// ── 하단 탭 바(떠 있는 알약) ─────────────────────────────────
export type TabPart = 'root' | 'item' | 'icon' | 'label' | 'add' | 'dot';
export type TabCellState = 'pressed' | 'focused';
export type TabBarProps = {
  look: TabBarLook;
  mode?: ViewMode;
  items: TabItem[];
  current?: string;
  addLabel: string;
  size?: TabSize;
  // 아래 안전 영역(홈 표시줄) — 바의 아래 자리를 정한다
  safe?: number;
  live?: boolean;
  states?: Partial<Record<string, TabCellState>>;
  addState?: TabCellState;
  onSelect?: (value: string) => void;
  onAdd?: () => void;
  // 줄어든 바를 누르면 펴진다(칸을 눌렀으면 그 탭으로도)
  onExpand?: () => void;
  zone?: Partial<Record<TabPart, CSSProperties>>;
  pins?: Partial<Record<TabPart, ReactNode>>;
  // 이 칸에만 부위 칠 · 핀(Anatomy)
  markItem?: string;
  // 바 둘레(폭) — 바깥 상자가 정한다. absolute 면 감싼 화면의 아래에 붙는다
  place?: 'absolute' | 'flow';
  // 나쁜 예 그림만 — 가운데 + 없이 칸만(가계부 묶음에서 칸을 바꾼 바)
  noAdd?: boolean;
  style?: CSSProperties;
};
export function TabBar({ look, mode = 'auto', items, current, addLabel, size = 'regular', safe = 0, live = false, states, addState, onSelect, onAdd, onExpand, zone, pins, markItem, place = 'absolute', noAdd = false, style }: TabBarProps) {
  const reduce = useReducedMotion();
  const S = look.sizes[size];
  const bottom = tabBottom(look, size, safe);
  const cells = noAdd ? items : [...items.slice(0, 2), null, ...items.slice(2)];
  const t = reduce ? 'none' : `height ${look.motion.duration} ${look.motion.easing}, left ${look.motion.duration} ${look.motion.easing}, right ${look.motion.duration} ${look.motion.easing}, bottom ${look.motion.duration} ${look.motion.easing}, padding ${look.motion.duration} ${look.motion.easing}`;
  const bar: CSSProperties =
    place === 'absolute'
      ? { position: 'absolute', left: S.marginX, right: S.marginX, bottom, marginLeft: 'auto', marginRight: 'auto' }
      : { position: 'relative', marginLeft: S.marginX, marginRight: S.marginX, marginBottom: bottom };
  return (
    <nav
      aria-label={live ? '주 메뉴' : undefined}
      aria-hidden={live ? undefined : true}
      data-nav-tabbar={size}
      onClickCapture={live && size === 'compact' ? () => onExpand?.() : undefined}
      style={{
        ...bar,
        zIndex: look.z,
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: `repeat(${noAdd ? items.length : look.columns}, minmax(0, 1fr))`,
        columnGap: look.gap,
        maxWidth: look.maxWidth,
        height: S.h,
        paddingTop: S.padY,
        paddingBottom: S.padY,
        paddingLeft: S.padX,
        paddingRight: S.padX,
        borderRadius: look.radius,
        background: ncv(look.bg, mode),
        boxShadow: `${nsv(look.shadow, mode)}, inset 0 0 0 ${look.border.width}px ${ncv(look.border.color, mode)}`,
        fontFamily: FONT,
        transition: t,
        ...zone?.root,
        ...style,
      }}
    >
      {pins?.root}
      {cells.map((it) =>
        it ? (
          <TabCell key={it.value} look={look} mode={mode} item={it} size={size} selected={it.value === current} live={live} state={states?.[it.value]} onSelect={onSelect} zone={markItem === undefined || markItem === it.value ? zone : undefined} pins={markItem === undefined || markItem === it.value ? pins : undefined} />
        ) : (
          <AddCell key="add" look={look} mode={mode} size={size} label={addLabel} live={live} state={addState} onAdd={onAdd} zone={zone} pin={pins?.add} />
        ),
      )}
    </nav>
  );
}

function TabCell({ look, mode, item, size, selected, live, state, onSelect, zone, pins }: { look: TabBarLook; mode: ViewMode; item: TabItem; size: TabSize; selected: boolean; live: boolean; state?: TabCellState; onSelect?: (v: string) => void; zone?: Partial<Record<TabPart, CSSProperties>>; pins?: Partial<Record<TabPart, ReactNode>> }) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const S = look.sizes[size];
  const pressed = live ? p.press : state === 'pressed';
  const focused = live ? f.ring : state === 'focused';
  useIsoLayoutEffect(() => {
    if (ref.current) setBox({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [size]);
  const scale = pressed && !reduce ? pressRatio(look.press, box?.w ?? 60, box?.h ?? S.h - S.padY * 2) : 1;
  const fg = ncv(selected ? look.icon.selFg : look.icon.fg, mode);
  const lfg = ncv(selected ? look.label.selFg : look.label.fg, mode);
  const name = `${item.label}${item.notification ? ', 새 소식' : ''}`;
  const inner = (
    <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', rowGap: look.item.gap, transform: scale === 1 ? 'none' : `scale(${scale})`, transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}` }}>
      <span style={{ position: 'relative', display: 'block', width: look.icon.size, height: look.icon.size, ...zone?.icon }}>
        <NavGlyph name={item.icon} size={look.icon.size} color={fg} strokeWidth={selected ? look.icon.selStroke : look.icon.stroke} />
        {item.notification && <span aria-hidden style={{ position: 'absolute', top: look.dot.top, right: look.dot.right, width: look.dot.size, height: look.dot.size, borderRadius: 9999, background: ncv(look.dot.color, mode), ...zone?.dot }}>{pins?.dot}</span>}
        {pins?.icon}
      </span>
      <span style={S.labels ? { position: 'relative', ...textOf({ ...look.label.type, fontWeight: look.label.weight }, lfg), whiteSpace: 'nowrap', ...zone?.label } : srOnly}>
        {item.label}
        {S.labels && pins?.label}
      </span>
    </span>
  );
  const cell: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    borderRadius: look.ring.radius,
    textDecoration: 'none',
    cursor: live ? 'pointer' : undefined,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.item,
  };
  if (!live)
    return (
      <span ref={ref} style={cell}>
        {inner}
        {pins?.item}
      </span>
    );
  return (
    <a
      ref={(el) => void (ref.current = el)}
      href={item.href ?? '#'}
      aria-current={selected ? 'page' : undefined}
      aria-label={name !== item.label ? name : undefined}
      style={cell}
      className="outline-none"
      onClick={(e) => {
        e.preventDefault();
        onSelect?.(item.value);
      }}
      onFocus={f.onFocus}
      onBlur={f.onBlur}
      {...p.handlers}
    >
      {inner}
    </a>
  );
}

function AddCell({ look, mode, size, label, live, state, onAdd, zone, pin }: { look: TabBarLook; mode: ViewMode; size: TabSize; label: string; live: boolean; state?: TabCellState; onAdd?: () => void; zone?: Partial<Record<TabPart, CSSProperties>>; pin?: ReactNode }) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const S = look.sizes[size];
  const pressed = live ? p.press : state === 'pressed';
  const focused = live ? f.ring : state === 'focused';
  const scale = pressed && !reduce ? pressRatio(look.press, S.add, S.add) : 1;
  const circle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: S.add,
    height: S.add,
    borderRadius: 9999,
    background: ncv(pressed ? look.add.pressBg : look.add.bg, mode),
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transition: `background-color ${look.press.motion.duration} ${look.press.motion.easing}, transform ${look.press.motion.duration} ${look.press.motion.easing}, width ${look.motion.duration} ${look.motion.easing}, height ${look.motion.duration} ${look.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.addOffset,
    ...zone?.add,
  };
  const inner = (
    <span style={circle}>
      <NavGlyph name="plus" size={S.addIcon} color={ncv(look.add.iconColor, mode)} strokeWidth={look.add.iconStroke} />
      {pin}
    </span>
  );
  const cell: CSSProperties = { ...resetBox, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, cursor: live ? 'pointer' : undefined };
  if (!live) return <span style={cell}>{inner}</span>;
  return (
    <button type="button" aria-label={label} style={cell} className="outline-none" onClick={onAdd} onFocus={f.onFocus} onBlur={f.onBlur} {...p.handlers}>
      {inner}
    </button>
  );
}

// ── 떠 있는 버튼 ─────────────────────────────────────────
export function FabView({ look, mode = 'auto', icon = 'plus', label, state, live = false, onClick, place = 'flow', right, bottom, zone, pin }: { look: FabLook; mode?: ViewMode; icon?: NavIcon; label: string; state?: FabState; live?: boolean; onClick?: () => void; place?: 'flow' | 'absolute'; right?: number; bottom?: number; zone?: { root?: CSSProperties; icon?: CSSProperties }; pin?: ReactNode }) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const shown: FabState = live ? (p.press ? 'pressed' : p.hover ? 'hovered' : 'enabled') : (state ?? 'enabled');
  const focused = live ? f.ring : state === 'focused';
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, look.size, look.size) : 1;
  const style: CSSProperties = {
    ...resetBox,
    position: place === 'absolute' ? 'absolute' : 'relative',
    right: place === 'absolute' ? (right ?? look.right) : undefined,
    bottom: place === 'absolute' ? (bottom ?? look.bottom) : undefined,
    zIndex: place === 'absolute' ? look.z : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: look.size,
    height: look.size,
    borderRadius: look.radius,
    background: ncv(shown === 'enabled' || shown === 'focused' ? look.bg : look.pressBg, mode),
    boxShadow: nsv(look.shadow, mode),
    cursor: live ? 'pointer' : undefined,
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transition: `background-color ${look.color.duration} ${look.color.easing}, transform ${look.press.motion.duration} ${look.press.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.root,
  };
  const glyph = (
    <span style={{ position: 'relative', display: 'block', ...zone?.icon }}>
      <NavGlyph name={icon} size={look.icon.size} color={ncv(look.icon.color, mode)} strokeWidth={look.icon.stroke} />
    </span>
  );
  if (!live)
    return (
      <span aria-hidden data-nav-fab style={style}>
        {glyph}
        {pin}
      </span>
    );
  return (
    <button type="button" data-nav-fab aria-label={label} style={style} className="outline-none" onClick={onClick} onFocus={f.onFocus} onBlur={f.onBlur} {...p.handlers}>
      {glyph}
      {pin}
    </button>
  );
}
