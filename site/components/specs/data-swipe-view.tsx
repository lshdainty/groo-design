'use client';
// 스펙대로 그린 Swipe Actions — SwipeKitLook(swipe-actions.yaml · md 의 제스처 판정을 푼 값)만 받아 그린다.
// 트레이(SwipeTrayView)는 원형 배지 + 아래 라벨, 파괴적 동작이 가장 안쪽(왼쪽). 줄(SwipeRowView)은 실제로 밀린다 —
// 데드존 8 · 축 1.5배 · 열기 40% · 닫기 25%(swipe-actions.md), 한 번에 한 줄만(SwipeGroup), 열린 줄을 누르면 닫기만, Esc 로 닫으면 초점은 줄로.
// 인라인 스타일은 단축 속성과 개별 속성을 섞지 않는다(PR #154).
import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Archive, Pencil, Pin, Share2, Trash2, type LucideIcon } from 'lucide-react';
import { trayWidth, type SwipeKind, type SwipeKitLook, type ViewMode } from './data-shared';
import { srOnly, useReducedMotion } from './data-card-view';
import { dcv } from './display-shared';

const ICONS: Record<string, LucideIcon> = { pin: Pin, pencil: Pencil, trash: Trash2, archive: Archive, share: Share2 };
export type SwipeAct = { value: string; kind: SwipeKind; label: string; icon: string; disabled?: boolean };
export type SwipeActState = 'enabled' | 'hovered' | 'pressed' | 'focused' | 'disabled';
export type SwipePart = 'track' | 'action' | 'badge' | 'icon' | 'label';

// ── 트레이 ─────────────────────────────────────────────────
// actions 는 뜻의 차례 그대로 — 그리는 쪽이 뒤집어 파괴적인 것을 가장 안쪽(왼쪽)에 둔다
export function SwipeTrayView({ look, mode = 'auto', actions, height, rowLabel, open = true, live = false, states, onAction, marks, pins, bad }: { look: SwipeKitLook; mode?: ViewMode; actions: SwipeAct[]; height: number; rowLabel: string; open?: boolean; live?: boolean; states?: Record<string, SwipeActState>; onAction?: (a: SwipeAct) => void; marks?: Partial<Record<SwipePart, CSSProperties>>; pins?: Partial<Record<SwipePart, ReactNode>>; bad?: { square?: boolean; darkSolid?: boolean; noBorder?: boolean; blueLabel?: boolean; fill?: boolean } }) {
  const shown = [...actions].reverse();
  const [press, setPress] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [ring, setRing] = useState<string | null>(null);
  return (
    <div aria-hidden={!open} style={{ display: 'flex', height: Math.max(height, look.rowMin), flexShrink: 0, background: bad?.fill ? dcv(look.kinds.destructive.badge, mode) : 'transparent', ...marks?.track }}>
      {pins?.track}
      {shown.map((a, i) => {
        const st: SwipeActState = a.disabled ? 'disabled' : (states?.[a.value] ?? (press === a.value ? 'pressed' : hover === a.value ? 'hovered' : ring === a.value ? 'focused' : 'enabled'));
        const k = look.kinds[a.kind];
        const w = i === 0 ? look.first : look.rest;
        const dim = st === 'pressed' || st === 'hovered' ? look.brightness : 1;
        const disabled = st === 'disabled';
        const badgeBg = disabled ? dcv(look.disabled.badge, mode) : bad?.darkSolid && a.kind !== 'neutral' ? (a.kind === 'destructive' ? `var(--p-bg-critical-solid)` : `var(--p-bg-informative-solid)`) : dcv(k.badge, mode);
        const iconC = disabled ? dcv(look.disabled.icon, mode) : bad?.darkSolid && a.kind !== 'neutral' ? '#FFFFFF' : dcv(k.icon, mode);
        const labelC = disabled ? dcv(look.disabled.label, mode) : bad?.blueLabel && a.kind === 'primary' ? dcv(look.kinds.primary.badge, mode) : dcv(k.label, mode);
        // 중립 배지의 안쪽 1px 은 막혀도 남는다 — v106 막힘 테두리 색이 stroke-neutral-weak(Q-012-4)
        const border = k.border && !bad?.noBorder ? `inset 0 0 0 ${k.border.width}px ${dcv(k.border.color, mode)}` : 'none';
        const I = ICONS[a.icon] ?? Pencil;
        const first = i === 0;
        return (
          <button
            key={a.value}
            type="button"
            aria-label={`${a.label}: ${rowLabel}`}
            disabled={disabled}
            tabIndex={live && open ? 0 : -1}
            onClick={live && !disabled ? () => onAction?.(a) : undefined}
            onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(a.value) : undefined}
            onPointerLeave={live ? () => (setHover(null), setPress(null)) : undefined}
            onPointerDown={live ? (e) => (e.stopPropagation(), setPress(a.value)) : undefined}
            onPointerUp={live ? () => setPress(null) : undefined}
            onFocus={live ? (e) => e.currentTarget.matches(':focus-visible') && setRing(a.value) : undefined}
            onBlur={live ? () => setRing(null) : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: look.gap,
              width: w.width,
              height: '100%',
              boxSizing: 'border-box',
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: w.lead,
              paddingRight: 0,
              margin: 0,
              borderWidth: 0,
              background: 'transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              outline: st === 'focused' ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
              outlineOffset: look.ring.offset,
              WebkitTapHighlightColor: 'transparent',
              ...(first ? marks?.action : undefined),
            }}
          >
            {first && pins?.action}
            <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: look.badge.size, height: look.badge.size, borderRadius: bad?.square ? 12 : look.badge.radius, background: badgeBg, boxShadow: border, filter: dim !== 1 ? `brightness(${dim})` : undefined, flexShrink: 0, ...(first ? marks?.badge : undefined) }}>
              {first && pins?.badge}
              <I aria-hidden size={look.icon} strokeWidth={2} style={{ color: iconC, ...(first ? marks?.icon : undefined) }} />
            </span>
            <span style={{ position: 'relative', fontFamily: look.label.fontFamily, fontSize: look.label.fontSize, lineHeight: look.label.lineHeight, fontWeight: look.label.fontWeight, color: labelC, filter: dim !== 1 ? `brightness(${dim})` : undefined, whiteSpace: 'nowrap', ...(first ? marks?.label : undefined) }}>
              {first && pins?.label}
              {a.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── 한 번에 한 줄 ──────────────────────────────────────────
const Group = createContext<{ open: string | null; setOpen: (id: string | null) => void } | null>(null);
export function SwipeGroup({ children, scrollRoot }: { children: ReactNode; scrollRoot?: HTMLElement | null }) {
  const [open, setOpen] = useState<string | null>(null);
  // 목록을 스크롤하면 열린 줄이 닫힌다
  useEffect(() => {
    const el: HTMLElement | Window = scrollRoot ?? window;
    const on = () => setOpen(null);
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, [scrollRoot]);
  return <Group.Provider value={{ open, setOpen }}>{children}</Group.Provider>;
}

// ── 미는 줄 ────────────────────────────────────────────────
export function SwipeRowView({ look, mode = 'auto', actions, rowLabel, rowHeight, children, onAction, onRowClick, initialOffset = 0, enabled = true, bg = 'var(--p-bg-layer-default)', onSaid }: { look: SwipeKitLook; mode?: ViewMode; actions: SwipeAct[]; rowLabel: string; rowHeight: number; children: ReactNode; onAction?: (a: SwipeAct) => void; onRowClick?: () => void; initialOffset?: number; enabled?: boolean; bg?: string; onSaid?: (s: string) => void }) {
  const id = useId();
  const group = useContext(Group);
  const tw = trayWidth(look, actions.length);
  const [offset, setOffset] = useState(initialOffset);
  const [dragging, setDragging] = useState(false);
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const g = useRef<{ x: number; y: number; start: number; axis: 'none' | 'x' | 'y'; moved: boolean; pid: number } | null>(null);
  const suppress = useRef(false);
  const isOpen = offset >= tw - 0.5;
  // 다른 줄이 열리면 닫는다
  useEffect(() => {
    if (group && group.open !== id && offset > 0 && !dragging) setOffset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.open]);
  const settle = (to: number) => {
    setOffset(to);
    if (to > 0) group?.setOpen(id);
    else if (group?.open === id) group.setOpen(null);
  };
  if (!enabled) return <div>{children}</div>;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: Math.max(rowHeight, look.rowMin) }}>
      {/* 트레이 — 줄 뒤 오른쪽, 바탕을 칠하지 않는다. 닫혀 있으면 보조 기술 · Tab 에서 숨는다 */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'stretch' }}>
        <SwipeTrayView
          look={look}
          mode={mode}
          actions={actions}
          height={Math.max(rowHeight, look.rowMin)}
          rowLabel={rowLabel}
          open={isOpen}
          live
          onAction={(a) => {
            // 트레이를 먼저 닫고 실행한다(확인이 있으면 닫은 뒤 확인 창)
            settle(0);
            window.setTimeout(() => onAction?.(a), reduce ? 0 : parseFloat(look.motion.duration));
          }}
        />
      </div>
      <div
        ref={rowRef}
        tabIndex={-1}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Escape' && offset > 0) {
            e.stopPropagation();
            settle(0);
            rowRef.current?.focus();
            onSaid?.('닫았어요.');
          }
        }}
        onPointerDown={(e) => {
          g.current = { x: e.clientX, y: e.clientY, start: offset, axis: 'none', moved: false, pid: e.pointerId };
        }}
        onPointerMove={(e) => {
          const s = g.current;
          if (!s || s.pid !== e.pointerId) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (s.axis === 'none') {
            // 데드존 — 이보다 짧은 이동은 누르기로 본다
            if (Math.abs(dx) < look.gesture.deadzone && Math.abs(dy) < look.gesture.deadzone) return;
            // 축 확정 — 가로가 세로의 1.5배를 넘을 때만 가로로
            s.axis = Math.abs(dx) > Math.abs(dy) * look.gesture.axis ? 'x' : 'y';
            if (s.axis === 'x') {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              group?.setOpen(id);
            }
          }
          if (s.axis !== 'x') return;
          s.moved = true;
          // 끄는 동안은 손가락을 1:1 로 — 최대 이동은 트레이 폭
          setOffset(Math.max(0, Math.min(tw, s.start - dx)));
        }}
        onPointerUp={(e) => {
          const s = g.current;
          g.current = null;
          if (!s || s.pid !== e.pointerId) return;
          if (s.axis === 'x') {
            setDragging(false);
            suppress.current = true;
            const wasOpen = s.start >= tw - 0.5;
            if (wasOpen) settle(tw - offset >= tw * look.gesture.close ? 0 : tw);
            else settle(offset >= tw * look.gesture.open ? tw : 0);
            onSaid?.(offset >= tw * look.gesture.open ? '열렸어요.' : '닫혔어요.');
          }
        }}
        onPointerCancel={() => {
          g.current = null;
          setDragging(false);
          settle(offset >= tw * look.gesture.open ? tw : 0);
        }}
        onClickCapture={(e) => {
          // 끌고 난 뒤의 click · 열린 줄의 누르기는 줄로 가지 않는다 — 열린 줄은 닫기만
          if (suppress.current) {
            suppress.current = false;
            e.stopPropagation();
            e.preventDefault();
            return;
          }
          if (offset > 0) {
            e.stopPropagation();
            e.preventDefault();
            settle(0);
            onSaid?.('닫았어요.');
          }
        }}
        onClick={onRowClick}
        style={{
          position: 'relative',
          zIndex: 1,
          background: bg,
          transform: `translateX(${-offset}px)`,
          transition: dragging || reduce ? 'none' : `transform ${look.motion.duration} ${look.motion.easing}`,
          touchAction: 'pan-y',
          userSelect: dragging ? 'none' : undefined,
          WebkitUserSelect: dragging ? 'none' : undefined,
          outline: 'none',
        }}
      >
        {children}
      </div>
      <span style={srOnly}>{isOpen ? `${rowLabel} 동작이 열렸어요` : ''}</span>
    </div>
  );
}

// ── 밀어 둔 줄(멈춘 그림) — 줄이 트레이 폭만큼 왼쪽으로 가고, 뒤에서 트레이가 드러난다 ──
export function SwipeRowStatic({ look, mode = 'auto', actions, rowLabel, rowHeight, offset, children, states, marks, pins, bad, bg = 'var(--p-bg-layer-default)', rowMark, rowPin }: { look: SwipeKitLook; mode?: ViewMode; actions: SwipeAct[]; rowLabel: string; rowHeight: number; offset?: number; children: ReactNode; states?: Record<string, SwipeActState>; marks?: Partial<Record<SwipePart, CSSProperties>>; pins?: Partial<Record<SwipePart, ReactNode>>; bad?: Parameters<typeof SwipeTrayView>[0]['bad']; bg?: string; rowMark?: CSSProperties; rowPin?: ReactNode }) {
  const tw = trayWidth(look, actions.length);
  const x = offset ?? tw;
  const h = Math.max(rowHeight, look.rowMin);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: h }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, display: 'flex' }}>
        <SwipeTrayView look={look} mode={mode} actions={actions} height={h} rowLabel={rowLabel} open={x >= tw} states={states} marks={marks} pins={pins} bad={bad} />
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: -x, width: '100%', background: bg, display: 'flex', alignItems: 'center', ...rowMark }}>
        {rowPin}
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
