'use client';
// 스펙대로 그린 Resizable — SplitLook · WidgetLook(resizable.yaml 을 푼 값)만 받아 그린다.
// 나누기: 보이는 선 1px + 가운데 손잡이 표시 · 누르는 폭 16 · role=separator(이름 "목록 너비") · 끌기 · 한 번 누르기(3px 안) 25 ↔ 40 ·
// ← → 5% · Home · End · Enter · 목록 20 ~ 40%(오른쪽은 60% 아래로 줄지 않는다) · 화면마다 폭을 기억(localStorage).
// 위젯 크기: 오른쪽 아래 모서리 손잡이(누르는 24 · 표식 9) · 끄는 동안 자리표시 + 따라오는 위젯 · 끌지 않는 대안은 ⋮ 의 "크기".
// state 를 주면 그 상태로 멈춘 그림이다. 인라인 스타일은 단축 속성과 개별 속성을 섞지 않는다(PR #154).
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { icv, shadowOf, tc, type SplitLook, type SplitState, type Tones, type ViewMode, type WidgetLook } from './collapse-shared';
import type { Widget } from './collapse-data';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { KebabTrigger } from './menu-demos';
import type { MenuKit } from './menu-shared';
import { MenuControl } from './menu-view';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
// 기억한 폭 — 없거나 읽지 못하면 null(사생활 창 · 막힌 저장소)
export function readSaved(key: string): number | null {
  try {
    const v = Number(window.localStorage.getItem(`porest-split:${key}`));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}
function save(key: string, v: number) {
  try {
    window.localStorage.setItem(`porest-split:${key}`, String(v));
  } catch {
    /* 저장하지 못해도 폭은 바뀐다 */
  }
}

// 그림 폭에 맞춰 줄인다 — 1280 화면의 본문(992)처럼 실제 px 로 짠 것을 칸 폭에 맞게. 끄는 셈은 비율이라 배율과 상관없다
export function FitScale({ w, children, max = 1 }: { w: number; children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.6);
  const [h, setH] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const k = Math.min(max, el.clientWidth / w);
      setS(k);
      if (inner.current) setH(inner.current.offsetHeight * k);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, [w, max]);
  return (
    <div ref={ref} style={{ width: '100%', height: h, overflow: 'hidden' }}>
      <div ref={inner} style={{ width: w, transform: `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

// ── 손잡이 ────────────────────────────────────────────────
export type HandleProps = {
  look: SplitLook;
  mode?: ViewMode;
  value: number;
  live?: boolean;
  state?: SplitState;
  controls?: string;
  // 그림 표시 — 누르는 폭 16
  showHit?: boolean;
  onPointerDown?: (e: RPointerEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  dragging?: boolean;
  onFocusChange?: (f: boolean) => void;
  style?: CSSProperties;
  decor?: ReactNode;
};
export function HandleView({ look, mode = 'auto', value, live = false, state: frozen, controls, showHit, onPointerDown, onKeyDown, dragging = false, onFocusChange, style, decor }: HandleProps) {
  const [hover, setHover] = useState(false);
  const [ring, setRing] = useState(false);
  const st: SplitState = frozen ?? (dragging ? 'pressed' : ring ? 'focused' : hover ? 'hovered' : 'enabled');
  const active = st !== 'enabled';
  const focused = st === 'focused' || (live && ring);
  return (
    <div
      role="separator"
      aria-label={look.handle.name}
      aria-orientation="vertical"
      aria-valuenow={round1(value)}
      aria-valuemin={look.panel.min}
      aria-valuemax={look.panel.max}
      aria-controls={controls}
      tabIndex={live ? 0 : undefined}
      onPointerDown={live ? onPointerDown : undefined}
      onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
      onPointerLeave={live ? () => setHover(false) : undefined}
      onKeyDown={live ? onKeyDown : undefined}
      onFocus={live ? (e) => (setRing(e.currentTarget.matches(':focus-visible')), onFocusChange?.(true)) : undefined}
      onBlur={live ? () => (setRing(false), onFocusChange?.(false)) : undefined}
      data-split-handle=""
      style={{
        position: 'relative',
        flexShrink: 0,
        width: look.handle.width,
        alignSelf: 'stretch',
        cursor: look.handle.cursor,
        touchAction: 'none',
        outline: focused ? `${look.ring.width}px solid ${icv(look.ring.color, mode)}` : 'none',
        outlineOffset: look.ring.offset,
        borderRadius: look.ring.radius,
        background: showHit ? 'rgba(236, 72, 153, 0.18)' : undefined,
        ...style,
      }}
    >
      <span aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: (look.handle.width - look.line.width) / 2, width: look.line.width, background: icv(active ? look.line.activeColor : look.line.color, mode), transitionProperty: 'background-color', transitionDuration: look.line.motion.duration, transitionTimingFunction: look.line.motion.easing }} />
      <span aria-hidden style={{ position: 'absolute', top: '50%', left: (look.handle.width - look.grip.w) / 2, width: look.grip.w, height: look.grip.h, marginTop: -look.grip.h / 2, borderRadius: look.grip.radius, background: icv(look.grip.color, mode) }} />
      {decor}
    </div>
  );
}

// ── 나눈 자리 ─────────────────────────────────────────────
export type SplitViewProps = {
  look: SplitLook;
  mode?: ViewMode;
  // 화면 이름 — 폭을 기억하는 열쇠
  storageKey?: string;
  // 멈춘 그림 · 밖에서 쥘 때의 목록 폭(%)
  value?: number;
  onValueChange?: (v: number, how: string) => void;
  live?: boolean;
  state?: SplitState;
  height: number;
  left: ReactNode;
  right: ReactNode;
  showHit?: boolean;
  onFocusChange?: (f: boolean) => void;
  handleDecor?: ReactNode;
  style?: CSSProperties;
};
export function SplitView({ look, mode = 'auto', storageKey, value: valueProp, onValueChange, live = false, state, height, left, right, showHit, onFocusChange, handleDecor, style }: SplitViewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [own, setOwn] = useState(look.panel.def);
  const value = valueProp ?? own;
  const [dragging, setDragging] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  // 기억한 폭으로 연다
  useEffect(() => {
    if (!live || !storageKey || valueProp !== undefined) return;
    const v = readSaved(storageKey);
    const c = v !== null ? round1(clamp(v, look.panel.min, look.panel.max)) : look.panel.def;
    setOwn(c);
    onValueChange?.(c, v !== null ? '다시 열기 — 기억한 폭' : '처음 — 기본 폭');
    // 여는 때 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, storageKey]);
  const set = useCallback(
    (v: number, how: string) => {
      const c = round1(clamp(v, look.panel.min, look.panel.max));
      setOwn(c);
      onValueChange?.(c, how);
      if (storageKey) save(storageKey, c);
    },
    [look.panel.min, look.panel.max, onValueChange, storageKey],
  );
  const toggle = (how: string) => set(Math.abs(value - look.panel.toggle) < 0.05 ? look.panel.def : look.panel.toggle, how);
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    const g = groupRef.current;
    if (!g) return;
    e.preventDefault();
    const rect = g.getBoundingClientRect();
    const x0 = e.clientX;
    const v0 = value;
    let moved = false;
    const target = e.currentTarget;
    target.setPointerCapture?.(e.pointerId);
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - x0;
      // 화면 px 를 그림 px 로 — 줄여 그렸으면 rect 폭이 이미 줄어 있다(비율로 셈한다)
      if (!moved && Math.abs(dx) * (g.offsetWidth / rect.width) <= look.handle.dragStart) return;
      if (!moved) {
        moved = true;
        setDragging(true);
        document.body.style.cursor = look.handle.cursor;
        document.body.style.userSelect = 'none';
      }
      set(v0 + (dx / rect.width) * 100, '끌기');
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      setDragging(false);
      if (!moved) toggle('누르기');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (k === 'ArrowLeft') set(value - look.handle.step, '←');
    else if (k === 'ArrowRight') set(value + look.handle.step, '→');
    else if (k === 'Home') set(look.panel.min, 'Home');
    else if (k === 'End') set(look.panel.max, 'End');
    else if (k === 'Enter') toggle('Enter');
    else return;
    e.preventDefault();
  };
  return (
    <div ref={groupRef} data-split-group="" style={{ display: 'flex', width: '100%', height, ...style }}>
      <div id={`split-list-${uid}`} style={{ width: `${value}%`, minWidth: 0, overflow: 'hidden', flexShrink: 0 }}>
        {left}
      </div>
      <HandleView look={look} mode={mode} value={value} live={live} state={state} controls={`split-list-${uid}`} showHit={showHit} onPointerDown={onPointerDown} onKeyDown={onKeyDown} dragging={dragging} onFocusChange={onFocusChange} decor={handleDecor} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>{right}</div>
    </div>
  );
}

// ── 위젯 크기(대시보드 편집 모드) ───────────────────────────
// 위젯 칸 — 면(카드) · 머리(제목 + ⋮) · 모서리 손잡이(편집 모드)
function WidgetCard({ look, tones, mode, w, edit, children, menu, cornerState, onCornerDown, style, showHit }: { look: WidgetLook; tones: Tones; mode: ViewMode; w: Widget; edit: boolean; children?: ReactNode; menu?: ReactNode; cornerState?: 'enabled' | 'pressed'; onCornerDown?: (e: RPointerEvent<HTMLSpanElement>) => void; style?: CSSProperties; showHit?: boolean }) {
  const m = look.mark;
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', height: '100%', borderRadius: look.placeholder.radius, borderWidth: 1, borderStyle: 'solid', borderColor: tc(tones, 'stroke-neutral-weak', mode), background: tc(tones, 'bg-layer-default', mode), ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 8, paddingRight: 8, paddingBottom: 4, paddingLeft: 20, minHeight: 56 }}>
        <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700, color: tc(tones, 'fg-neutral', mode) }}>{w.title}</span>
        {menu}
      </div>
      <div style={{ paddingLeft: 20, paddingRight: 20, fontSize: 13, lineHeight: '18px', color: tc(tones, 'fg-neutral-subtle', mode) }}>{children ?? w.body}</div>
      {edit && (
        <span
          aria-hidden
          onPointerDown={onCornerDown}
          data-widget-corner={w.id}
          style={{ position: 'absolute', right: 0, bottom: 0, width: look.handle.size, height: look.handle.size, cursor: look.handle.cursor, touchAction: 'none', ...(showHit ? { background: 'rgba(236, 72, 153, 0.18)', outline: '1px dashed #DB2777', outlineOffset: -1 } : {}) }}
        >
          <span style={{ position: 'absolute', right: m.right, bottom: m.bottom, width: m.size, height: m.size, boxSizing: 'border-box', borderRightWidth: m.borderW, borderBottomWidth: m.borderW, borderTopWidth: 0, borderLeftWidth: 0, borderStyle: 'solid', borderColor: icv(m.color, mode), opacity: cornerState === 'pressed' ? 1 : 1 }} />
        </span>
      )}
    </div>
  );
}

export type WidgetBoardProps = {
  look: WidgetLook;
  tones: Tones;
  mode?: ViewMode;
  widgets: Widget[];
  live?: boolean;
  edit?: boolean;
  // 멈춘 그림 — 끄는 중인 위젯과 그 칸(자리표시)
  dragging?: { id: string; cols: number; ghostW: number };
  width?: number;
  menuKit?: MenuKit;
  kebab?: ButtonLook;
  // ⋮ 를 열어 둔 그림(멈춘 그림)
  menuOpen?: { id: string; node: ReactNode };
  showHit?: boolean;
  onChange?: (ws: Widget[], how: string) => void;
};
export function WidgetBoard({ look, tones, mode = 'auto', widgets: init, live = false, edit = true, dragging: frozenDrag, width = 960, menuKit, kebab, menuOpen, showHit, onChange }: WidgetBoardProps) {
  const [ws, setWs] = useState(init);
  const [drag, setDragState] = useState<{ id: string; cols: number; ghostW: number } | null>(null);
  const dragRef = useRef<{ id: string; cols: number; ghostW: number } | null>(null);
  const setDrag = (v: { id: string; cols: number; ghostW: number } | null) => {
    dragRef.current = v;
    setDragState(v);
  };
  const boardRef = useRef<HTMLDivElement>(null);
  const d = frozenDrag ?? drag;
  const colW = (width - look.gap * (look.columns - 1)) / look.columns;
  const spanW = (c: number) => colW * c + look.gap * (c - 1);
  const resize = (id: string, cols: number, how: string) => {
    const next = ws.map((w) => (w.id === id ? { ...w, cols } : w));
    setWs(next);
    onChange?.(next, how);
  };
  const onCornerDown = (w: Widget) => (e: RPointerEvent<HTMLSpanElement>) => {
    if (!live) return;
    e.preventDefault();
    const board = boardRef.current;
    if (!board) return;
    const k = board.getBoundingClientRect().width / width;
    const x0 = e.clientX;
    const w0 = spanW(w.cols);
    const minCols = Math.min(...look.sizeMenu.items.map((i) => i.columns));
    const move = (ev: PointerEvent) => {
      const ghostW = clamp(w0 + (ev.clientX - x0) / k, spanW(minCols), width);
      const cols = clamp(Math.round((ghostW + look.gap) / (colW + look.gap)), minCols, look.columns);
      setDrag({ id: w.id, cols, ghostW });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const cur = dragRef.current;
      setDrag(null);
      if (cur) resize(w.id, cur.cols, '끌기');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div ref={boardRef} data-widget-board="" style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${look.columns}, minmax(0, 1fr))`, gridAutoRows: look.rowHeight, gap: look.gap, width }}>
      {ws.map((w) => {
        const isDrag = d?.id === w.id;
        const menu =
          menuOpen?.id === w.id ? (
            menuOpen.node
          ) : live && menuKit && kebab ? (
            <MenuControl
              look={menuKit.menu}
              mode={mode}
              groups={[{ label: look.sizeMenu.label, items: look.sizeMenu.items.map((i) => ({ value: String(i.columns), label: i.label, description: w.cols === i.columns ? '지금 크기' : undefined })) }]}
              onAction={(v) => resize(w.id, Number(v), '⋮ → 크기')}
              trigger={(r) => <KebabTrigger look={kebab} mode={mode} label={`${w.title} 더보기`} render={r} />}
            />
          ) : kebab ? (
            <ButtonView look={kebab} mode={mode} icon="more-vertical" ariaLabel={`${w.title} 더보기`} state="enabled" />
          ) : null;
        return (
          // 끄는 동안 — 칸은 놓일 크기(자리표시)로 바뀌고 다른 위젯이 밀린다, 위젯은 그림자로 포인터를 따라온다
          <div key={w.id} data-widget={w.id} style={{ position: 'relative', zIndex: menuOpen?.id === w.id ? 3 : undefined, gridColumn: `span ${isDrag ? d.cols : w.cols}`, gridRow: `span ${w.rows}` }}>
            {isDrag && (
              <span aria-hidden data-widget-placeholder="" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, boxSizing: 'border-box', background: icv(look.placeholder.bg, mode), borderWidth: look.placeholder.borderW, borderStyle: look.placeholder.borderStyle as CSSProperties['borderStyle'], borderColor: icv(look.placeholder.border, mode), borderRadius: look.placeholder.radius, zIndex: 0 }} />
            )}
            <div style={{ position: isDrag ? 'absolute' : 'relative', top: 0, left: 0, height: '100%', width: isDrag ? d.ghostW : '100%', zIndex: isDrag ? 2 : 1, boxShadow: isDrag ? shadowOf(look.ghost.shadow, mode) : undefined, borderRadius: look.ghost.radius }}>
              <WidgetCard look={look} tones={tones} mode={mode} w={w} edit={edit} menu={menu} cornerState={isDrag ? 'pressed' : 'enabled'} onCornerDown={onCornerDown(w)} showHit={showHit} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
