'use client';
// 스펙대로 그린 Menu · Menu Sheet · Help Bubble · Tooltip — MenuLook · MenuSheetLook · BubbleLook(menu-look 이 YAML 에서 푼 값)만 받아 그린다.
// 멈춘 그림은 줄마다 상태(호버 · 키보드 · 누름 · 막힘)를 주고, 실제로 쓰는 자리(…Control)는 열고 · 옮기고 · 닫는다.
//   Menu        트리거 아래 8(모자라면 위), 비모달 — ↑↓ 순환 · Home · End · 글자로 찾기 · Enter · Space 실행 · Esc · Tab · 바깥 누르기로 닫기,
//               마우스 호버는 알약만(키보드 위치는 그대로), 키보드 위치는 알약 자리 링. 고르면 닫고 트리거로 초점을 돌려준 뒤 실행한다.
//   Menu Sheet  Bottom Sheet 와 같은 딤 · 모션 · 끌어 닫기(overlay-live 의 시트) — 줄을 누르면 시트를 닫고 실행한다. 보조 기술용 닫기는 키보드 초점이 오면 보인다.
//   Help Bubble 누르면 열고 닫는다(비모달). Tab 으로 들어가고 다시 Tab 으로 나가면 닫힌다. Esc · 바깥 누르기 · 닫기 버튼.
//   Tooltip     마우스는 열림 지연 뒤, 키보드 초점은 바로 연다. 트리거와 말풍선을 모두 벗어나면 닫힘 지연 뒤 닫는다. 하나가 열린 동안 옆으로 옮기면 바로 · 모션 없이.
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDownUp,
  Camera,
  Check,
  Copy,
  Download,
  ExternalLink,
  FolderInput,
  FolderOutput,
  ImageIcon,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Pencil,
  Pin,
  Plus,
  Sun,
  Trash2,
  Undo2,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { bubbleArrowPath, mcv, menuItems, placeBubble, pressRatio, toMs, type BubbleLook, type BubbleSide, type MType, type MenuGroup, type MenuIcon, type MenuItem, type MenuItemState, type MenuLook, type MenuSheetLayout, type MenuSheetLook, type ViewMode } from './menu-shared';
import { ModalLayer, tabbables } from './overlay-live';
import type { OverlayLook } from './overlay-shared';
import { useReducedMotion } from './overlay-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const FONT = "'Pretendard Variable', Pretendard, sans-serif";

const ICONS: Record<MenuIcon, LucideIcon> = {
  pin: Pin,
  pencil: Pencil,
  copy: Copy,
  trash: Trash2,
  'folder-input': FolderInput,
  'folder-output': FolderOutput,
  'arrow-down-up': ArrowDownUp,
  'external-link': ExternalLink,
  undo: Undo2,
  plus: Plus,
  users: Users,
  'log-out': LogOut,
  image: ImageIcon,
  camera: Camera,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  check: Check,
  key: KeyRound,
  download: Download,
};
export function MenuIconView({ name, size, color, style }: { name: MenuIcon; size: number; color?: string; style?: CSSProperties }) {
  const I = ICONS[name];
  return <I aria-hidden strokeWidth={2} style={{ flexShrink: 0, width: size, height: size, color, ...style }} />;
}

const typeStyle = (t: MType): CSSProperties => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight });

// 누르는 동안의 콘텐츠 축소 — 줄 상자(폭 · 높이)에서 기준 길이를 잰다
function useRowSize(on: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on]);
  return [ref, size] as const;
}

// 키보드로 옮긴 자리인지 — 초점이 :focus-visible 일 때만 링을 그린다
const focusVisible = (el: Element) => {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
};

// ── Menu — 줄 ────────────────────────────────────────────
export type MenuPart = 'item' | 'pill' | 'ring' | 'icon' | 'label' | 'desc' | 'suffix';
export type MenuItemMarks = Partial<Record<MenuPart, CSSProperties>>;
type RowHandlers = Pick<HTMLAttributes<HTMLDivElement>, 'onPointerEnter' | 'onPointerLeave' | 'onPointerDown' | 'onPointerUp' | 'onPointerCancel' | 'onClick'>;

function MenuRow({
  look,
  mode,
  item,
  pill,
  ring,
  pressed,
  id,
  live,
  handlers,
  rowRef,
  marks,
  decor,
}: {
  look: MenuLook;
  mode: ViewMode;
  item: MenuItem;
  pill: boolean;
  ring: boolean;
  pressed: boolean;
  id?: string;
  live: boolean;
  handlers?: RowHandlers;
  rowRef?: (el: HTMLDivElement | null) => void;
  marks?: MenuItemMarks;
  decor?: ReactNode;
}) {
  const disabled = !!item.disabled;
  const crit = item.tone === 'critical';
  const [ref, size] = useRowSize(pressed && !disabled);
  const reduce = useReducedMotion();
  const scale = pressed && !disabled && size && !reduce ? pressRatio(look.press, size.w, size.h) : 1;
  const c = look.item.color;
  const fg = disabled ? c.disabled : crit ? c.critical : c.label;
  const ic = disabled ? c.disabled : crit ? c.critical : c.icon;
  const de = disabled ? c.disabled : c.desc;
  const su = disabled ? c.disabled : crit ? c.critical : c.suffix;
  const hl = look.highlight;
  const on = pill && !disabled;
  const m = hl.motion;
  return (
    <div
      ref={(el) => {
        ref.current = el;
        rowRef?.(el);
      }}
      id={id}
      role={live ? 'menuitem' : undefined}
      tabIndex={live ? -1 : undefined}
      aria-disabled={live && disabled ? true : undefined}
      data-menu-item={item.value}
      {...(live && handlers ? handlers : {})}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        padding: `${look.item.padY}px ${look.item.padX}px`,
        cursor: disabled ? look.item.cursorDisabled : look.item.cursor,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        ...marks?.item,
      }}
    >
      {/* 알약 — 호버 · 누름 바탕. 줄 폭 전체(0 · 모서리 0)에서 좌우 8 · 모서리 12 로 들어오며 둥글어지고(Q-009-3 B), 꺼지면 가장자리로 펴지며 투명해진다 */}
      <span
        aria-hidden
        data-menu-pill=""
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: on ? hl.insetX : 0,
          right: on ? hl.insetX : 0,
          borderRadius: on ? hl.radius : 0,
          background: on ? mcv(hl.bg, mode) : 'transparent',
          transition: `background-color ${m.duration} ${m.easing}, left ${m.duration} ${m.easing}, right ${m.duration} ${m.easing}, border-radius ${m.duration} ${m.easing}`,
          ...marks?.pill,
        }}
      />
      {/* 키보드 위치 — 알약 자리에 안쪽 링, 바탕은 칠하지 않는다 */}
      {ring && !disabled && (
        <span
          aria-hidden
          data-menu-ring=""
          style={{ position: 'absolute', top: 0, bottom: 0, left: hl.insetX, right: hl.insetX, borderRadius: hl.radius, outline: `${look.ring.width}px solid ${mcv(look.ring.color, mode)}`, outlineOffset: look.ring.offset, ...marks?.ring }}
        />
      )}
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: look.item.gap,
          transform: scale === 1 ? 'none' : `scale(${scale})`,
          transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}`,
        }}
      >
        {item.icon && <MenuIconView name={item.icon} size={look.item.icon} color={mcv(ic, mode)} style={marks?.icon} />}
        <span style={{ display: 'flex', flex: '1 1 0%', minWidth: 0, flexDirection: 'column', gap: look.item.descGap }}>
          <span style={{ ...typeStyle(look.item.label), color: mcv(fg, mode), ...marks?.label }}>{item.label}</span>
          {item.description && <span style={{ ...typeStyle(look.item.desc), color: mcv(de, mode), ...marks?.desc }}>{item.description}</span>}
        </span>
        {item.suffixIcon && <MenuIconView name={item.suffixIcon} size={look.item.suffix} color={mcv(su, mode)} style={marks?.suffix} />}
      </span>
      {decor}
    </div>
  );
}

// ── Menu — 판 ────────────────────────────────────────────
export type MenuPanelDecor = { root?: ReactNode; items?: Record<string, ReactNode>; groups?: Record<number, ReactNode>; labels?: Record<number, ReactNode>; dividers?: Record<number, ReactNode> };
export type MenuPanelMarks = { root?: CSSProperties; groups?: Record<number, CSSProperties>; labels?: Record<number, CSSProperties>; dividers?: Record<number, CSSProperties>; items?: Record<string, MenuItemMarks> };
type LivePanel = {
  idBase: string;
  hover: string | null;
  kbd: string | null;
  press: string | null;
  handlers: (item: MenuItem) => RowHandlers;
  rowRef: (value: string, el: HTMLDivElement | null) => void;
};
export type MenuPanelProps = {
  look: MenuLook;
  mode?: ViewMode;
  groups: MenuGroup[];
  // 멈춘 그림 — 줄마다 상태
  states?: Record<string, MenuItemState>;
  live?: LivePanel;
  width?: number | string;
  maxHeight?: number | string;
  marks?: MenuPanelMarks;
  decor?: MenuPanelDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
};

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(function MenuPanel({ look, mode = 'auto', groups, states, live, width, maxHeight, marks, decor, rootProps, style }, ref) {
  const c = look.content;
  const g = look.groupLabel;
  const d = look.divider;
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: width ?? c.width,
        maxHeight,
        padding: `${c.padY}px 0`,
        borderRadius: c.radius,
        background: mcv(c.bg, mode),
        boxShadow: mcv(c.shadow, mode),
        overflowY: live ? 'auto' : 'visible',
        overscrollBehavior: 'contain',
        fontFamily: FONT,
        textAlign: 'left',
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {groups.map((group, gi) => {
        const labelId = live && group.label ? `${live.idBase}-g${gi}` : undefined;
        return (
          <div key={gi} role={live ? 'group' : undefined} aria-labelledby={labelId} style={{ position: 'relative', ...marks?.groups?.[gi] }}>
            {gi > 0 && (
              <div aria-hidden data-menu-divider="" style={{ position: 'relative', height: d.height, margin: `${d.marginY}px ${d.marginX}px`, background: mcv(d.color, mode), ...marks?.dividers?.[gi] }}>
                {decor?.dividers?.[gi]}
              </div>
            )}
            {group.label && (
              <div id={labelId} role={live ? 'presentation' : undefined} style={{ position: 'relative', padding: `${g.padY}px ${g.padX}px`, ...typeStyle(g.text), color: mcv(g.color, mode), ...marks?.labels?.[gi] }}>
                {group.label}
                {decor?.labels?.[gi]}
              </div>
            )}
            {group.items.map((item) => {
              const st = states?.[item.value];
              const shown = st === 'disabled' ? { ...item, disabled: true } : item;
              const pill = live ? live.hover === item.value || live.press === item.value : st === 'hovered' || st === 'pressed';
              const ring = live ? live.kbd === item.value : st === 'focused';
              const pressed = live ? live.press === item.value : st === 'pressed';
              return (
                <MenuRow
                  key={item.value}
                  look={look}
                  mode={mode}
                  item={shown}
                  pill={pill}
                  ring={ring}
                  pressed={pressed}
                  id={live ? `${live.idBase}-${item.value}` : undefined}
                  live={!!live}
                  handlers={live?.handlers(item)}
                  rowRef={live ? (el) => live.rowRef(item.value, el) : undefined}
                  marks={marks?.items?.[item.value]}
                  decor={decor?.items?.[item.value]}
                />
              );
            })}
            {decor?.groups?.[gi]}
          </div>
        );
      })}
      {decor?.root}
    </div>
  );
});

// ── 실제 메뉴 ──────────────────────────────────────────────
// 트리거는 부르는 쪽이 그린다 — ref 와 aria · 키 · 포인터 처리를 받아 버튼에 붙인다
export type TriggerRender = (p: { ref: (el: HTMLElement | null) => void; props: ButtonHTMLAttributes<HTMLButtonElement> }) => ReactNode;
type Phase = 'enter' | 'open' | 'exit';

// 그림 속 화면(container) 안이면 그 안쪽 상자(absolute), 아니면 화면(fixed)
function stageBox(container?: HTMLElement | null) {
  if (container) {
    const r = container.getBoundingClientRect();
    return { left: r.left + container.clientLeft, top: r.top + container.clientTop, width: container.clientWidth, height: container.clientHeight };
  }
  return { left: 0, top: 0, width: document.documentElement.clientWidth, height: window.innerHeight };
}
function nextTabbable(after: HTMLElement, skip: HTMLElement | null) {
  const all = tabbables(document.body).filter((el) => !skip?.contains(el));
  return all.find((el) => after.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !after.contains(el)) ?? null;
}
// 첫 글자 — 한글은 초성(ㄱ ~ ㅎ)으로도 찾는다
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
function startsWithKey(label: string, key: string) {
  const first = label.trim().charAt(0);
  if (first.toLowerCase() === key.toLowerCase()) return true;
  const code = first.charCodeAt(0) - 0xac00;
  return code >= 0 && code < 11172 && CHO[Math.floor(code / 588)] === key;
}

export function MenuControl({
  look,
  mode = 'auto',
  groups,
  onAction,
  trigger,
  container,
  align: alignProp,
}: {
  look: MenuLook;
  mode?: ViewMode;
  groups: MenuGroup[];
  // 고른 줄 — 메뉴가 닫힌 뒤 부른다(확인창은 이때 연다)
  onAction?: (value: string) => void;
  trigger: TriggerRender;
  container?: HTMLElement | null;
  // 트리거에 맞추는 쪽 — 기본은 YAML(content.align, 줄 끝 ⋮ 은 끝). 왼쪽에 놓인 트리거는 start
  align?: 'start' | 'end';
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const triggerId = `mt${uid}`;
  const menuId = `mm${uid}`;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('exit');
  const [pos, setPos] = useState<{ left: number; top: number; maxHeight: number; side: 'below' | 'above'; originX: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [kbd, setKbd] = useState<string | null>(null);
  const [press, setPress] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const rows = useRef(new Map<string, HTMLDivElement>());
  const openedBy = useRef<{ by: 'pointer' | 'keyboard'; at: 'first' | 'last' | null }>({ by: 'pointer', at: null });
  const timer = useRef<number | undefined>(undefined);
  const items = menuItems(groups);
  const enabled = items.filter((i) => !i.disabled);
  const c = look.content;
  const align = alignProp ?? c.align;
  const exitMs = reduce ? 0 : toMs(c.motion.close.duration);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 열고 닫는 단계 — 열면 그리고 한 프레임 뒤 open(전환이 걸리게), 닫으면 exit 를 그린 뒤 걷는다
  useEffect(() => {
    if (open) {
      setMounted(true);
      setPhase('enter');
      let r2 = 0;
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setPhase('open'))));
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setPhase('exit');
    const t = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);

  // 자리 — 트리거 아래 8(남은 높이가 하한보다 좁으면 위로), 높이는 min(480, 남은 화면) · 하한 200, 가장자리와 8
  const place = useCallback(() => {
    const a = triggerRef.current;
    const p = panelRef.current;
    if (!a || !p) return;
    const box = stageBox(container);
    const r = a.getBoundingClientRect();
    const ax = r.left - box.left;
    const ay = r.top - box.top;
    const w = p.offsetWidth;
    const natural = p.scrollHeight;
    const below = box.height - (ay + r.height) - c.offset - c.edge;
    const above = ay - c.offset - c.edge;
    const want = Math.min(natural, c.maxHeight);
    let side: 'below' | 'above' = 'below';
    if (below < want && below < c.minHeight && above > below) side = 'above';
    const room = side === 'below' ? below : above;
    const maxHeight = Math.max(c.minHeight, Math.min(c.maxHeight, room));
    const h = Math.min(natural, maxHeight);
    let left = align === 'end' ? ax + r.width - w : ax;
    left = Math.max(c.edge, Math.min(left, box.width - c.edge - w));
    const top = side === 'below' ? ay + r.height + c.offset : ay - c.offset - h;
    const originX = Math.max(0, Math.min(w, ax + r.width / 2 - left));
    setPos((prev) => (prev && prev.left === left && prev.top === top && prev.maxHeight === maxHeight && prev.side === side ? prev : { left, top, maxHeight, side, originX }));
  }, [container, align, c]);

  useIsoLayoutEffect(() => {
    if (!mounted) return;
    place();
    const ro = new ResizeObserver(place);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [mounted, place]);

  const focusRow = useCallback((v: string | null) => {
    if (!v) return;
    rows.current.get(v)?.focus({ preventScroll: false });
  }, []);

  // 열린 뒤 초점 — 마우스로 열면 메뉴(링 없음), 키보드로 열면 첫 줄(↑ 면 마지막 줄)
  useEffect(() => {
    if (!mounted || !open) return;
    const r = requestAnimationFrame(() => {
      const { by, at } = openedBy.current;
      if (by === 'keyboard' && at && enabled.length) {
        const v = at === 'first' ? enabled[0].value : enabled[enabled.length - 1].value;
        setKbd(v);
        focusRow(v);
      } else panelRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open]);

  // 바깥을 누르면 닫는다(비모달 — 뒤 화면은 그대로 눌린다). 트리거는 트리거가 맡는다
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openMenu = (by: 'pointer' | 'keyboard', at: 'first' | 'last' | null) => {
    openedBy.current = { by, at };
    setHover(null);
    setPress(null);
    setKbd(null);
    setOpen(true);
  };
  // 닫기 — refocus 면 트리거로 초점을 돌려준다(Esc · 줄 고르기)
  const close = (refocus: boolean) => {
    setOpen(false);
    setHover(null);
    setPress(null);
    setKbd(null);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const run = (item: MenuItem) => {
    if (item.disabled) return;
    close(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onAction?.(item.value), exitMs);
  };

  const move = (dir: 1 | -1 | 'first' | 'last') => {
    if (!enabled.length) return;
    const idx = kbd ? enabled.findIndex((i) => i.value === kbd) : -1;
    let next: number;
    if (dir === 'first') next = 0;
    else if (dir === 'last') next = enabled.length - 1;
    else if (idx === -1) next = dir === 1 ? 0 : enabled.length - 1;
    else next = (idx + dir + enabled.length) % enabled.length;
    const v = enabled[next].value;
    setKbd(v);
    focusRow(v);
  };
  const typeahead = (key: string) => {
    const start = kbd ? enabled.findIndex((i) => i.value === kbd) : -1;
    for (let n = 1; n <= enabled.length; n++) {
      const it = enabled[(start + n) % enabled.length];
      if (startsWithKey(it.label, key)) {
        setKbd(it.value);
        focusRow(it.value);
        return;
      }
    }
  };

  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ';
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      move(e.key === 'Home' ? 'first' : 'last');
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const it = items.find((i) => i.value === kbd);
      if (it) run(it);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    } else if (e.key === 'Tab') {
      // 비모달 — 닫고 다음 자리로(Shift 면 트리거로)
      e.preventDefault();
      const t = triggerRef.current;
      const next = !e.shiftKey && t ? nextTabbable(t, panelRef.current) : t;
      close(false);
      next?.focus();
    } else if (printable) {
      typeahead(e.key);
    }
  };

  // 줄 — 마우스 호버는 알약만(키보드 위치는 그대로), 누르는 동안 알약 + 축소. 막힌 줄은 아무 일도 없다
  const handlers = (item: MenuItem): RowHandlers => ({
    onPointerEnter: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && !item.disabled) setHover(item.value);
    },
    onPointerLeave: () => {
      setHover((h) => (h === item.value ? null : h));
      setPress((p) => (p === item.value ? null : p));
    },
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (item.disabled || e.button !== 0) return;
      setPress(item.value);
    },
    onPointerUp: () => setPress((p) => (p === item.value ? null : p)),
    onPointerCancel: () => setPress(null),
    onClick: () => run(item),
  });

  const triggerProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onPointerDown: (e) => {
      if (e.button !== 0 || e.ctrlKey) return;
      if (open) close(false);
      else {
        openMenu('pointer', null);
        // 트리거가 초점을 가져가지 않게 — 초점은 메뉴로 간다
        e.preventDefault();
      }
    },
    onKeyDown: (e) => {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        if (open && (e.key === 'Enter' || e.key === ' ')) close(false);
        else openMenu('keyboard', e.key === 'ArrowUp' ? 'last' : 'first');
      }
    },
    // 보조 기술의 누르기(포인터 · 키가 없는 click)
    onClick: (e) => {
      if (e.detail !== 0) return;
      if (open) close(false);
      else openMenu('keyboard', 'first');
    },
  };

  const shown = phase === 'open';
  const panel =
    mounted &&
    createPortal(
      <MenuPanel
        ref={panelRef}
        look={look}
        mode={mode}
        groups={groups}
        live={{ idBase: menuId, hover, kbd, press, handlers, rowRef: (v, el) => (el ? rows.current.set(v, el) : rows.current.delete(v)) }}
        maxHeight={pos?.maxHeight}
        rootProps={{
          id: menuId,
          role: 'menu',
          'aria-labelledby': triggerId,
          tabIndex: -1,
          onKeyDown: onPanelKey,
          // 줄을 눌러도 초점은 그대로(키보드 위치가 바뀌지 않게)
          onMouseDown: (e) => e.preventDefault(),
        }}
        style={{
          position: container ? 'absolute' : 'fixed',
          left: pos?.left ?? 0,
          top: pos?.top ?? 0,
          zIndex: c.z,
          visibility: pos ? 'visible' : 'hidden',
          transformOrigin: `${pos?.originX ?? 0}px ${pos?.side === 'above' ? '100%' : '0'}`,
          opacity: shown ? 1 : 0,
          transform: reduce || shown ? 'scale(1)' : `scale(${c.motion.from})`,
          transition: phase === 'enter' ? 'none' : `opacity ${(shown ? c.motion.open : c.motion.close).duration} ${(shown ? c.motion.open : c.motion.close).easing}, transform ${(shown ? c.motion.open : c.motion.close).duration} ${(shown ? c.motion.open : c.motion.close).easing}`,
          pointerEvents: shown ? 'auto' : 'none',
        }}
      />,
      container ?? document.body,
    );

  return (
    <>
      {trigger({ ref: (el) => void (triggerRef.current = el), props: triggerProps })}
      {panel}
    </>
  );
}

// ── Menu Sheet ───────────────────────────────────────────
export type SheetItemState = 'hovered' | 'pressed' | 'focused' | 'disabled';
export type MenuSheetPart = 'root' | 'handle' | 'header' | 'title' | 'description' | 'list' | 'close';
export type MenuSheetMarks = Partial<Record<MenuSheetPart, CSSProperties>> & { groups?: Record<number, CSSProperties>; items?: Record<string, CSSProperties> };
export type MenuSheetDecor = { root?: ReactNode; header?: ReactNode; groups?: Record<number, ReactNode>; items?: Record<string, ReactNode> };

function SheetRow({
  look,
  mode,
  item,
  layout,
  last,
  state,
  live,
  onSelect,
  mark,
  decor,
}: {
  look: MenuSheetLook;
  mode: ViewMode;
  item: MenuItem;
  layout: MenuSheetLayout;
  last: boolean;
  state?: SheetItemState;
  live: boolean;
  onSelect?: (value: string) => void;
  mark?: CSSProperties;
  decor?: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const disabled = !!item.disabled || state === 'disabled';
  const pressed = !disabled && (state === 'pressed' || (live && press));
  const hovered = !disabled && (state === 'hovered' || (live && hover));
  const on = pressed || hovered;
  const focused = state === 'focused' || (live && ring);
  const [ref, size] = useRowSize(pressed);
  const reduce = useReducedMotion();
  const scale = pressed && size && !reduce ? pressRatio(look.press, size.w, size.h) : 1;
  const it = look.item;
  const c = it.color;
  const crit = item.tone === 'critical';
  const only = layout === 'textOnly';
  const fg = disabled ? c.disabled : crit ? (on ? it.on.critical : c.critical) : c.label;
  const ic = disabled ? c.disabled : crit ? (on ? it.on.critical : c.critical) : c.icon;
  const de = disabled ? c.disabled : on ? it.on.desc : c.desc;
  const line = last ? 'none' : `inset 0 -${look.divider.height}px 0 ${mcv(look.divider.color, mode)}`;
  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: only ? it.textOnly.justify : 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: it.minHeight,
    margin: 0,
    padding: `${it.padY}px ${it.padX}px`,
    border: 0,
    borderRadius: 0,
    background: on ? mcv(it.pressed, mode) : 'transparent',
    boxShadow: line,
    color: mcv(fg, mode),
    textAlign: only ? (it.textOnly.align as CSSProperties['textAlign']) : 'left',
    cursor: disabled ? it.cursorDisabled : it.cursor,
    outline: focused ? `${look.ring.width}px solid ${mcv(look.ring.color, mode)}` : 'none',
    outlineOffset: look.ring.offset,
    transition: `background-color ${it.motion.duration} ${it.motion.easing}`,
    WebkitTapHighlightColor: 'transparent',
    fontFamily: FONT,
    ...mark,
  };
  const inner = (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: it.gap,
        minWidth: 0,
        flex: only ? '0 1 auto' : '1 1 0%',
        transform: scale === 1 ? 'none' : `scale(${scale})`,
        transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}`,
      }}
    >
      {!only && item.icon && <MenuIconView name={item.icon} size={it.icon} color={mcv(ic, mode)} />}
      <span style={{ display: 'flex', flexDirection: 'column', gap: it.descGap, minWidth: 0 }}>
        <span style={{ ...typeStyle(it.label), color: mcv(fg, mode) }}>{item.label}</span>
        {!only && item.description && <span style={{ ...typeStyle(it.desc), color: mcv(de, mode) }}>{item.description}</span>}
      </span>
    </span>
  );
  if (!live)
    return (
      <div ref={(el) => void (ref.current = el)} style={style}>
        {inner}
        {decor}
      </div>
    );
  return (
    <button
      ref={(el) => void (ref.current = el)}
      type="button"
      disabled={disabled}
      data-menu-item={item.value}
      style={style}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => (setHover(false), setPress(false))}
      onPointerDown={(e) => e.button === 0 && setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => setRing(focusVisible(e.currentTarget))}
      onBlur={() => setRing(false)}
      onClick={() => !disabled && onSelect?.(item.value)}
    >
      {inner}
    </button>
  );
}

// 보조 기술용 닫기 — 평소에는 보이지 않고(보조 기술은 읽는다), 키보드 초점이 오면 이 모양으로 보인다
function SheetClose({ look, mode, onClose, shown: forced }: { look: MenuSheetLook; mode: ViewMode; onClose?: () => void; shown?: boolean }) {
  const [focus, setFocus] = useState(false);
  const [on, setOn] = useState(false);
  const shown = forced ?? focus;
  const cl = look.close;
  const style: CSSProperties = shown
    ? {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        width: '100%',
        height: 'auto',
        minHeight: cl.minHeight,
        margin: `${cl.marginTop}px 0 0`,
        padding: `0 ${cl.padX}px`,
        overflow: 'visible',
        clipPath: 'none',
        whiteSpace: 'normal',
        border: 0,
        borderRadius: cl.radius,
        background: mcv(on ? cl.bgPressed : cl.bg, mode),
        ...typeStyle(cl.text),
        color: mcv(cl.text.color, mode),
        cursor: 'pointer',
        outline: `${look.ring.width}px solid ${mcv(look.ring.color, mode)}`,
        outlineOffset: look.ring.closeOffset,
      }
    : {
        position: 'absolute',
        display: 'block',
        boxSizing: 'border-box',
        width: 1,
        height: 1,
        minHeight: 0,
        margin: -1,
        padding: 0,
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
        border: 0,
        borderRadius: 0,
        background: 'transparent',
        ...typeStyle(cl.text),
        color: mcv(cl.text.color, mode),
        cursor: 'pointer',
        outline: 'none',
        outlineOffset: 0,
      };
  if (!onClose)
    return (
      <span aria-hidden style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        닫기
      </span>
    );
  return (
    <button
      type="button"
      data-menu-sheet-close=""
      style={style}
      onFocus={(e) => setFocus(focusVisible(e.currentTarget))}
      onBlur={() => (setFocus(false), setOn(false))}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(true)}
      onPointerLeave={() => setOn(false)}
      onPointerDown={() => setOn(true)}
      onPointerUp={(e) => e.pointerType !== 'mouse' && setOn(false)}
      onClick={onClose}
    >
      닫기
    </button>
  );
}

export type MenuSheetSurfaceProps = {
  look: MenuSheetLook;
  mode?: ViewMode;
  title?: ReactNode;
  description?: ReactNode;
  groups: MenuGroup[];
  layout?: MenuSheetLayout;
  states?: Record<string, SheetItemState>;
  // 멈춘 그림에서 보조 기술용 닫기를 보인 모습(키보드 초점)
  closeShown?: boolean;
  // 실제 시트 — 줄을 누르면 부른다 · 닫기
  live?: boolean;
  onSelect?: (value: string) => void;
  onClose?: () => void;
  // 안전 영역(그림 속 기기의 홈 표시줄 · 실제 화면은 env(safe-area-inset-bottom)) — 아래 여백에 더한다
  safe?: number | string;
  maxHeight?: number | string;
  titleId?: string;
  descId?: string;
  marks?: MenuSheetMarks;
  decor?: MenuSheetDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
};

export const MenuSheetSurface = forwardRef<HTMLDivElement, MenuSheetSurfaceProps>(function MenuSheetSurface(
  { look, mode = 'auto', title, description, groups, layout = 'textWithIcon', states, closeShown, live = false, onSelect, onClose, safe = 0, maxHeight, titleId, descId, marks, decor, rootProps, style },
  ref,
) {
  const r = look.radius;
  const h = look.handle;
  const p = look.pad;
  const bottom = typeof safe === 'number' ? `${p.bottom + safe}px` : `calc(${p.bottom}px + ${safe})`;
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: look.maxWidth,
        maxHeight,
        margin: '0 auto',
        padding: `${p.top}px ${p.x}px ${bottom}`,
        borderRadius: `${r}px ${r}px 0 0`,
        background: mcv(look.bg, mode),
        fontFamily: FONT,
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {/* 손잡이 — 늘 있다. 보조 기술에는 숨긴다 */}
      <span aria-hidden data-menu-handle="" style={{ position: 'absolute', left: '50%', top: h.top, width: h.width, height: h.height, marginLeft: -h.width / 2, borderRadius: h.radius, background: mcv(h.color, mode), ...marks?.handle }} />
      {(title || description) && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: look.header.gap, flex: 'none', paddingBottom: look.header.padBottom, textAlign: look.header.align as CSSProperties['textAlign'], ...marks?.header }}>
          {title && (
            <div id={titleId} style={{ ...typeStyle(look.title), color: mcv(look.title.color, mode), ...marks?.title }}>
              {title}
            </div>
          )}
          {description && (
            <div id={descId} style={{ ...typeStyle(look.description), color: mcv(look.description.color, mode), ...marks?.description }}>
              {description}
            </div>
          )}
          {decor?.header}
        </div>
      )}
      <div data-ov-body="" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: look.group.gap, minHeight: 0, overflowY: live ? 'auto' : 'visible', overscrollBehavior: 'contain', ...marks?.list }}>
        {groups.map((g, gi) => (
          // 묶음 상자는 모서리 밖으로 넘친 링을 자른다 — 그림 속 표시(decor)는 자르지 않게 상자 밖에 둔다
          <div key={gi} style={{ position: 'relative', flex: 'none' }}>
            <div role={live ? 'group' : undefined} style={{ position: 'relative', borderRadius: look.group.radius, background: mcv(look.group.bg, mode), overflow: 'hidden', ...marks?.groups?.[gi] }}>
              {g.items.map((item, i) => (
                <SheetRow key={item.value} look={look} mode={mode} item={item} layout={layout} last={i === g.items.length - 1} state={states?.[item.value]} live={live} onSelect={onSelect} mark={marks?.items?.[item.value]} decor={decor?.items?.[item.value]} />
              ))}
            </div>
            {decor?.groups?.[gi]}
          </div>
        ))}
        {(live || closeShown) && <SheetClose look={look} mode={mode} onClose={live ? onClose : undefined} shown={live ? undefined : closeShown} />}
      </div>
      {decor?.root}
    </div>
  );
});

// 실제 메뉴 시트 — overlay-live 의 시트(딤 · 모션 · Esc · 끌어 닫기 · 초점 가두기)에 띄운다. 줄을 누르면 닫고, 닫힌 뒤 실행한다
export function MenuSheetControl({
  look,
  ov,
  mode = 'auto',
  title,
  description,
  groups,
  layout = 'textWithIcon',
  label,
  onAction,
  trigger,
  container,
  open: openProp,
  onOpenChange,
}: {
  look: MenuSheetLook;
  ov: OverlayLook;
  mode?: ViewMode;
  title?: string;
  description?: string;
  groups: MenuGroup[];
  layout?: MenuSheetLayout;
  // 제목이 없을 때 시트의 이름(트리거 이름)
  label: string;
  onAction?: (value: string) => void;
  trigger?: TriggerRender;
  container?: HTMLElement | null;
  // 바깥에서 여닫을 때(ResponsiveMenu)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInner(v);
    onOpenChange?.(v);
  };
  const triggerRef = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const exitMs = toMs(ov.sheet.motion.close.duration);
  const select = (v: string) => {
    setOpen(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onAction?.(v), exitMs);
  };
  const props: ButtonHTMLAttributes<HTMLButtonElement> = { 'aria-haspopup': 'dialog', 'aria-expanded': open, onClick: () => setOpen(!open) };
  return (
    <>
      {trigger?.({ ref: (el) => void (triggerRef.current = el), props })}
      <ModalLayer
        open={open}
        kind="sheet"
        look={ov}
        mode={mode}
        outside="close"
        drag
        container={container}
        onRequestClose={() => setOpen(false)}
        labelledBy={title ? `${id}t` : undefined}
        describedBy={description ? `${id}d` : undefined}
        returnFocus={() => triggerRef.current}
      >
        {({ ref, rootProps, style, maxHeight }) => (
          <MenuSheetSurface
            ref={ref}
            rootProps={{ ...rootProps, 'aria-label': title ? undefined : label }}
            style={style}
            maxHeight={maxHeight}
            look={look}
            mode={mode}
            title={title}
            description={description}
            titleId={`${id}t`}
            descId={`${id}d`}
            groups={groups}
            layout={layout}
            live
            onSelect={select}
            onClose={() => setOpen(false)}
            safe={container ? 0 : 'env(safe-area-inset-bottom, 0px)'}
          />
        )}
      </ModalLayer>
    </>
  );
}

// ── 말풍선(Help Bubble · Tooltip) ─────────────────────────
export type BubblePart = 'root' | 'arrow' | 'title' | 'description' | 'close' | 'closeHit' | 'body';
export type BubbleMarks = Partial<Record<BubblePart, CSSProperties>>;
export type BubbleCloseState = 'enabled' | 'pressed' | 'focused';

function BubbleArrow({ look, mode, side, at, end, mark }: { look: BubbleLook; mode: ViewMode; side: BubbleSide; at?: number; end?: number; mark?: CSSProperties }) {
  const { width: w, height: h } = look.arrow;
  const vertical = side === 'top' || side === 'bottom';
  // 화살표 가운데 — 시작 변에서(at) · 끝 변에서(end) · 없으면 가운데
  const along: CSSProperties = end !== undefined ? (vertical ? { right: end - w / 2 } : { bottom: end - w / 2 }) : vertical ? { left: at === undefined ? `calc(50% - ${w / 2}px)` : at - w / 2 } : { top: at === undefined ? `calc(50% - ${w / 2}px)` : at - w / 2 };
  const place: CSSProperties = side === 'top' ? { top: '100%', ...along } : side === 'bottom' ? { bottom: '100%', ...along } : side === 'left' ? { left: '100%', ...along } : { right: '100%', ...along };
  const vw = vertical ? w : h;
  const vh = vertical ? h : w;
  return (
    <svg aria-hidden data-bubble-arrow="" width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`} style={{ position: 'absolute', display: 'block', overflow: 'visible', ...place, ...mark }}>
      <path d={bubbleArrowPath(look, side)} fill={mcv(look.bg, mode)} />
    </svg>
  );
}

function BubbleClose({ look, mode, state, onClose, btnRef, marks }: { look: BubbleLook; mode: ViewMode; state?: BubbleCloseState; onClose?: () => void; btnRef?: Ref<HTMLButtonElement>; marks?: BubbleMarks }) {
  const c = look.close;
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const reduce = useReducedMotion();
  const live = !!onClose && !state;
  const shown: BubbleCloseState = state ?? (press ? 'pressed' : 'enabled');
  const focused = state === 'focused' || (live && ring);
  const scale = shown === 'pressed' && !reduce ? c.scale : 1;
  const grow = (c.hit - c.size) / 2;
  const box: CSSProperties = {
    position: 'absolute',
    top: -grow,
    right: -grow,
    width: c.hit,
    height: c.hit,
    margin: 0,
    padding: 0,
    border: 0,
    background: 'transparent',
    cursor: live ? 'pointer' : 'default',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...marks?.closeHit,
  };
  const visible: CSSProperties = {
    position: 'absolute',
    left: grow,
    top: grow,
    width: c.size,
    height: c.size,
    boxSizing: 'border-box',
    // 링의 모양 — 바탕이 없어 초점 링에만 보인다(closeButton.radius)
    borderRadius: c.radius,
    display: 'grid',
    placeItems: 'center',
    outline: focused ? `${look.ring.width}px solid ${mcv(look.ring.color, mode)}` : 'none',
    outlineOffset: look.ring.offset,
    ...marks?.close,
  };
  const inner = (
    <span style={visible}>
      <X aria-hidden size={c.icon} strokeWidth={2.2} style={{ color: mcv(c.color, mode), transform: scale === 1 ? 'none' : `scale(${scale})`, transition: `transform ${c.motion.duration} ${c.motion.easing}` }} />
    </span>
  );
  if (!live)
    return (
      <span aria-hidden style={box}>
        {inner}
      </span>
    );
  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="닫기"
      data-bubble-close=""
      style={box}
      onClick={onClose}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      onFocus={(e) => setRing(focusVisible(e.currentTarget))}
      onBlur={() => setRing(false)}
    >
      {inner}
    </button>
  );
}

export type BubbleViewProps = {
  look: BubbleLook;
  mode?: ViewMode;
  title: ReactNode;
  description?: ReactNode;
  close?: boolean;
  closeState?: BubbleCloseState;
  onClose?: () => void;
  closeRef?: Ref<HTMLButtonElement>;
  // 말풍선이 트리거의 어느 쪽에 있는지 — 화살표는 반대 변에 붙는다
  side?: BubbleSide;
  // 화살표 가운데의 자리(말풍선 시작 변에서 · 끝 변에서). 없으면 가운데
  arrowAt?: number;
  arrowEnd?: number;
  // 닫기 버튼이 없는 말풍선에 Tab 으로 들어온 모습 — 둘레 바깥 링(focusRing.rootOffset · rootColor)
  rootRing?: boolean;
  arrow?: boolean;
  maxWidth?: number;
  width?: number | string;
  titleId?: string;
  descId?: string;
  marks?: BubbleMarks;
  decor?: ReactNode;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
};

export const BubbleView = forwardRef<HTMLDivElement, BubbleViewProps>(function BubbleView(
  { look, mode = 'auto', title, description, close = false, closeState, onClose, closeRef, side = 'top', arrowAt, arrowEnd, rootRing = false, arrow = true, maxWidth, width, titleId, descId, marks, decor, rootProps, style },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: width ?? 'max-content',
        maxWidth: maxWidth ?? look.maxWidth,
        padding: `${look.padY}px ${look.padX}px`,
        borderRadius: look.radius,
        background: mcv(look.bg, mode),
        textAlign: 'left',
        fontFamily: FONT,
        outline: rootRing ? `${look.ring.width}px solid ${mcv(look.ring.rootColor, mode)}` : 'none',
        outlineOffset: look.ring.rootOffset,
        ...marks?.root,
        ...style,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: look.descGap, marginRight: close ? look.close.size - look.padX + look.close.gap : 0, ...marks?.body }}>
        <span id={titleId} style={{ ...typeStyle(look.title), color: mcv(look.title.color, mode), whiteSpace: 'pre-wrap', ...marks?.title }}>
          {title}
        </span>
        {description && (
          <span id={descId} style={{ ...typeStyle(look.description), color: mcv(look.description.color, mode), ...marks?.description }}>
            {description}
          </span>
        )}
      </div>
      {close && <BubbleClose look={look} mode={mode} state={closeState} onClose={closeState ? undefined : onClose} btnRef={closeRef} marks={marks} />}
      {arrow && <BubbleArrow look={look} mode={mode} side={side} at={arrowAt} end={arrowEnd} mark={marks?.arrow} />}
      {decor}
    </div>
  );
});

// 떠 있는 말풍선 — 트리거를 따라가며(스크롤 · 크기) 자리를 다시 잡는다. 열림은 화살표 끝에서 커지고, 닫힘은 투명도만
function useBubbleLayer(open: boolean, anchor: () => HTMLElement | null, look: BubbleLook, prefer: BubbleSide, container: HTMLElement | null | undefined, instant: boolean) {
  const reduce = useReducedMotion();
  const exitMs = instant || reduce ? 0 : toMs(look.motion.close.duration);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('exit');
  const [pos, setPos] = useState<{ side: BubbleSide; left: number; top: number; arrowAt: number; avail: number } | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setPhase('enter');
      let r2 = 0;
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setPhase('open'))));
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setPhase('exit');
    const t = window.setTimeout(() => {
      setMounted(false);
      setPos(null);
    }, exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);
  const place = useCallback(() => {
    const el = ref.current;
    const a = anchor();
    if (!el || !a) return;
    const box = stageBox(container);
    const r = a.getBoundingClientRect();
    const p = placeBubble({ left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height }, { w: el.offsetWidth, h: el.offsetHeight }, box, look, prefer);
    const avail = Math.max(0, box.width - look.edge * 2);
    setPos((prev) => (prev && prev.side === p.side && prev.left === p.left && prev.top === p.top && prev.arrowAt === p.arrowAt && prev.avail === avail ? prev : { ...p, avail }));
  }, [anchor, container, look, prefer]);
  useIsoLayoutEffect(() => {
    if (!mounted) return;
    place();
    const ro = new ResizeObserver(place);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [mounted, place]);
  const shown = phase === 'open';
  const side = pos?.side ?? prefer;
  const vertical = side === 'top' || side === 'bottom';
  const tip = look.arrow.height;
  // 기준점 — 화살표 끝
  const origin = vertical ? `${pos?.arrowAt ?? 0}px ${side === 'top' ? `calc(100% + ${tip}px)` : `${-tip}px`}` : `${side === 'left' ? `calc(100% + ${tip}px)` : `${-tip}px`} ${pos?.arrowAt ?? 0}px`;
  const still = instant || reduce;
  const m = shown ? look.motion.open : look.motion.close;
  const style: CSSProperties = {
    position: container ? 'absolute' : 'fixed',
    left: pos?.left ?? 0,
    top: pos?.top ?? 0,
    zIndex: look.z,
    visibility: pos ? 'visible' : 'hidden',
    transformOrigin: origin,
    opacity: shown ? 1 : 0,
    transform: still || shown || phase === 'exit' ? 'scale(1)' : `scale(${look.motion.from})`,
    transition: still || phase === 'enter' ? 'none' : `opacity ${m.duration} ${m.easing}, transform ${m.duration} ${m.easing}`,
  };
  return { mounted, ref, pos, style, side, shown };
}

// 눌러서 여는 말풍선(Help Bubble) — 비모달. 트리거를 누르면 열고 닫는다(초점은 트리거에 남는다)
export function HelpBubbleControl({
  look,
  mode = 'auto',
  title,
  description,
  closeButton = false,
  side = 'top',
  defaultOpen = false,
  outsideCloses = true,
  anchorOnly = false,
  container,
  trigger,
  onOpenChange,
}: {
  look: BubbleLook;
  mode?: ViewMode;
  title: string;
  description?: string;
  closeButton?: boolean;
  side?: BubbleSide;
  defaultOpen?: boolean;
  // 바깥을 눌러 닫기 — 닫기 버튼이 있는 남겨 둘 안내는 닫기 버튼으로만
  outsideCloses?: boolean;
  // 자리만 잡는 트리거(Anchor) — 누르면 원래 동작, 말풍선은 열고 닫지 않는다
  anchorOnly?: boolean;
  container?: HTMLElement | null;
  trigger: TriggerRender;
  onOpenChange?: (open: boolean) => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [open, setOpenState] = useState(defaultOpen);
  const setOpen = (v: boolean) => {
    setOpenState(v);
    onOpenChange?.(v);
  };
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const anchor = useCallback(() => triggerRef.current, []);
  const layer = useBubbleLayer(open, anchor, look, side, container, false);
  const [mountedPortal, setMountedPortal] = useState(false);
  const [rootRing, setRootRing] = useState(false);
  useEffect(() => setMountedPortal(true), []);

  // 바깥을 누르면 닫는다 — 트리거는 트리거가 맡는다
  useEffect(() => {
    if (!open || !outsideCloses) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (layer.ref.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, outsideCloses]);

  const enter = () => {
    const first = closeRef.current ?? layer.ref.current;
    first?.focus({ preventScroll: true });
  };
  // 나가기 — Tab 은 트리거 다음 자리로(닫는다. 남겨 둘 안내는 열어 둔다), Shift+Tab 은 트리거로
  const leave = (back: boolean) => {
    const t = triggerRef.current;
    const next = !back && t ? nextTabbable(t, layer.ref.current) : t;
    if (!back && outsideCloses) setOpen(false);
    next?.focus();
  };
  const onBubbleKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    if (e.key !== 'Tab') return;
    const active = document.activeElement;
    const all = layer.ref.current ? tabbables(layer.ref.current) : [];
    // 말풍선 안 — 닫기 버튼까지. 마지막에서 Tab 은 나가며 닫고, 처음에서 Shift+Tab 은 트리거로
    if (!e.shiftKey && active === layer.ref.current && all.length) {
      e.preventDefault();
      all[0].focus();
    } else if (!e.shiftKey) {
      e.preventDefault();
      leave(false);
    } else {
      e.preventDefault();
      leave(true);
    }
  };
  // Anchor 는 말풍선을 여닫지 않는다 — 열린 안내로 Tab 이 들어가고 Esc 로 닫히게만 한다
  const props: ButtonHTMLAttributes<HTMLButtonElement> = anchorOnly
    ? {
        onKeyDown: (e) => {
          if (e.key === 'Escape' && open) {
            e.preventDefault();
            setOpen(false);
          } else if (e.key === 'Tab' && !e.shiftKey && open) {
            e.preventDefault();
            enter();
          }
        },
      }
    : {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? `hb${uid}` : undefined,
        onClick: () => setOpen(!open),
        onKeyDown: (e) => {
          if (e.key === 'Escape' && open) {
            e.preventDefault();
            setOpen(false);
          } else if (e.key === 'Tab' && !e.shiftKey && open) {
            e.preventDefault();
            enter();
          }
        },
      };
  const bubble =
    mountedPortal &&
    layer.mounted &&
    createPortal(
      <BubbleView
        ref={layer.ref}
        look={look}
        mode={mode}
        title={title}
        description={description}
        close={closeButton}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        closeRef={closeRef}
        side={layer.side}
        arrowAt={layer.pos?.arrowAt}
        maxWidth={layer.pos ? Math.min(look.maxWidth, layer.pos.avail) : look.maxWidth}
        titleId={`hb${uid}t`}
        descId={description ? `hb${uid}d` : undefined}
        rootRing={rootRing}
        rootProps={{
          id: `hb${uid}`,
          role: 'dialog',
          'aria-labelledby': `hb${uid}t`,
          'aria-describedby': description ? `hb${uid}d` : undefined,
          tabIndex: -1,
          onKeyDown: onBubbleKey,
          // 말풍선 자체에 키보드 초점이 오면(닫기 버튼이 없을 때) 둘레 바깥 링
          onFocus: (e) => e.target === e.currentTarget && setRootRing(focusVisible(e.currentTarget)),
          onBlur: (e) => e.target === e.currentTarget && setRootRing(false),
        }}
        style={layer.style}
      />,
      container ?? document.body,
    );
  return (
    <>
      {trigger({ ref: (el) => void (triggerRef.current = el), props })}
      {bubble}
    </>
  );
}

// ── 툴팁 ─────────────────────────────────────────────────
// 한 화면의 툴팁 묶음(TooltipProvider) — 하나가 열린 동안 옆 트리거로 옮기면 기다리지 않고 모션 없이 바꿔 연다
// last — 마지막으로 닫힌 툴팁과 그 시각. 그 뒤 이어 열기 시간(skipDelay) 안에 다른 트리거로 옮기면 기다리지 않고 모션 없이 연다
type TipEntry = { id: string; close: (instant: boolean) => void };
type TipGroup = { active: { current: TipEntry | null }; last: { current: { entry: TipEntry; at: number } | null } };
const TipContext = createContext<TipGroup | null>(null);
export function TooltipGroup({ children }: { children: ReactNode }) {
  const active = useRef<TipEntry | null>(null);
  const last = useRef<{ entry: TipEntry; at: number } | null>(null);
  return <TipContext.Provider value={{ active, last }}>{children}</TipContext.Provider>;
}

export function TooltipControl({ look, mode = 'auto', text, side = 'top', container, trigger }: { look: BubbleLook; mode?: ViewMode; text: string; side?: BubbleSide; container?: HTMLElement | null; trigger: TriggerRender }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const group = useContext(TipContext);
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const openT = useRef<number | undefined>(undefined);
  const closeT = useRef<number | undefined>(undefined);
  const anchor = useCallback(() => triggerRef.current, []);
  const layer = useBubbleLayer(open, anchor, look, side, container, instant);
  const [mountedPortal, setMountedPortal] = useState(false);
  useEffect(() => setMountedPortal(true), []);
  useEffect(
    () => () => {
      window.clearTimeout(openT.current);
      window.clearTimeout(closeT.current);
      if (group?.active.current?.id === uid) group.active.current = null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const hide = useCallback(
    (now: boolean) => {
      window.clearTimeout(openT.current);
      window.clearTimeout(closeT.current);
      setInstant(now);
      setOpen(false);
      if (group && group.active.current?.id === uid) {
        group.last.current = { entry: group.active.current, at: performance.now() };
        group.active.current = null;
      }
    },
    [group, uid],
  );
  const show = (now: boolean) => {
    window.clearTimeout(openT.current);
    window.clearTimeout(closeT.current);
    // 열려 있는 옆 툴팁 — 또는 이어 열기 시간 안에 닫힌 옆 툴팁(아직 사라지는 중이면 바로 걷는다)
    const last = group?.last.current;
    const recent = last && last.entry.id !== uid && performance.now() - last.at < look.hover.skip ? last.entry : null;
    const other = group?.active.current ?? recent;
    // 옆 툴팁이 열려 있으면 그것을 바로 닫고 이것을 바로 연다(모션 없이)
    const chained = !!other && other.id !== uid;
    if (chained) other.close(true);
    if (group) group.active.current = { id: uid, close: hide };
    if (chained || now) {
      setInstant(chained);
      setOpen(true);
      return;
    }
    openT.current = window.setTimeout(() => {
      setInstant(false);
      setOpen(true);
    }, look.hover.open);
  };
  const scheduleHide = () => {
    window.clearTimeout(openT.current);
    window.clearTimeout(closeT.current);
    closeT.current = window.setTimeout(() => hide(false), look.hover.close);
  };
  // 열린 동안 Esc — 초점이 어디 있든 닫는다(WCAG 1.4.13)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hide]);

  const props: ButtonHTMLAttributes<HTMLButtonElement> = {
    'aria-describedby': open ? `tt${uid}` : undefined,
    onPointerEnter: (e) => e.pointerType !== 'touch' && show(false),
    onPointerLeave: (e) => e.pointerType !== 'touch' && scheduleHide(),
    // 누름은 트리거의 동작 — 툴팁을 열지도 닫지도 않고, 마우스를 올려 기다리던 열기만 거둔다
    onPointerDown: () => window.clearTimeout(openT.current),
    // 키보드 초점은 바로 연다 — 손가락으로 눌러 생긴 초점(:focus-visible 아님)으로는 열지 않는다
    onFocus: (e) => focusVisible(e.currentTarget) && show(true),
    onBlur: () => hide(false),
  };
  const bubble =
    mountedPortal &&
    layer.mounted &&
    createPortal(
      <BubbleView
        ref={layer.ref}
        look={look}
        mode={mode}
        title={text}
        side={layer.side}
        arrowAt={layer.pos?.arrowAt}
        maxWidth={layer.pos ? Math.min(look.maxWidth, layer.pos.avail) : look.maxWidth}
        rootProps={{ id: `tt${uid}`, role: 'tooltip', onPointerEnter: () => window.clearTimeout(closeT.current), onPointerLeave: scheduleHide }}
        style={layer.style}
      />,
      container ?? document.body,
    );
  return (
    <>
      {trigger({ ref: (el) => void (triggerRef.current = el), props })}
      {bubble}
    </>
  );
}
