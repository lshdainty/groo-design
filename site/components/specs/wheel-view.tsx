'use client';
// 스펙대로 그린 Wheel Picker · Time Picker — WheelLook · TimeLook(wheel-picker · time-picker.yaml 을 푼 값)만 받아 그린다.
// live 면 실제로 굴러간다(wheel-picker.md Behavior): 손가락은 브라우저 스크롤 · 스냅, 마우스는 3px 넘게 끌면 끌기(놓을 때 최대 3칸 · 220 ~ 360ms),
// 휠 · 트랙패드는 마지막 입력 120ms 뒤 160ms 로 맞춘다, 보이는 항목을 누르면 가운데로, ↑ ↓ Home End. 값은 멈춘 뒤 한 번만 정해진다.
// 띠에 걸친 글자만 고른 색으로 칠한다 — 띠 자리에 같은 항목을 한 벌 더 깔고(고른 색) 스크롤을 따라 옮긴다(돋보기).
// 멈춘 그림은 at(소수 — 굴리는 중의 자리)으로 그린다.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { dcv, fogHeight, fogMask, minuteOptions, type DType, type Time, type TimeLook, type ViewMode, type WheelLook, type WpSize } from './date-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const mod = (a: number, n: number) => ((a % n) + n) % n;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduce;
}

export type WheelOption = { value: string; label: string };
export type WheelColumnSpec = {
  key: string;
  // 읽는 이름 — 연도 · 월 · 오전/오후 · 시 · 분
  name: string;
  options: WheelOption[];
  // 고른 항목(번호)
  index: number;
  loop?: boolean;
  align?: 'left' | 'center' | 'right';
  // 칼럼 폭을 정할 때(달력의 연 · 월 휠 — 연 120 · 월 96). 없으면 가장 긴 글 + 좌우 여백
  width?: number;
  // 멈춘 뒤 한 번 — 번호와 지나온 칸 수(반복 칼럼에서 11 ↔ 12 처럼 경계를 넘었는지 알 수 있게)
  onSettle?: (index: number, steps: number) => void;
  // 굴리는 동안 가운데를 지나는 항목
  onPass?: (index: number) => void;
  // 멈춘 그림 — 가운데에 놓인 자리(소수면 굴리는 중)
  at?: number;
};

const textOf = (t: DType, weight: number | string): CSSProperties => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: weight });
const justify = (a: WheelColumnSpec['align']) => (a === 'left' ? 'flex-start' : a === 'right' ? 'flex-end' : 'center');

// 칼럼 폭 — 가장 긴 글 + 좌우 여백(숫자는 폭이 같아 자리 수가 같은 글은 한 번만)
function Sizer({ options, padX, text, weight }: { options: WheelOption[]; padX: number; text: DType; weight: number | string }) {
  const seen = new Map<string, string>();
  for (const o of options) seen.set(o.label.replace(/\d/g, '0'), o.label);
  return (
    <div aria-hidden style={{ height: 0, overflow: 'hidden', visibility: 'hidden' }}>
      {[...seen.values()].map((l) => (
        <div key={l} style={{ ...textOf(text, weight), paddingLeft: padX, paddingRight: padX, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          {l}
        </div>
      ))}
    </div>
  );
}

type ColumnProps = {
  look: WheelLook;
  mode: ViewMode;
  size: WpSize;
  visible: number;
  col: WheelColumnSpec;
  live: boolean;
  disabled: boolean;
  // 멈춘 그림의 키보드 링
  ring?: boolean;
  style?: CSSProperties;
};

// ── 멈춘 칼럼 ─────────────────────────────────────────────
function StaticColumn({ look, mode, size, visible, col, disabled, ring, style }: ColumnProps) {
  const item = look.sizes[size].item;
  const text = look.sizes[size].text;
  const half = Math.floor(visible / 2);
  const n = col.options.length;
  const at = col.at ?? col.index;
  const from = Math.floor(at) - half - 1;
  const idx = Array.from({ length: visible + 3 }, (_, k) => from + k);
  const label = (i: number) => (col.loop ? col.options[mod(i, n)]?.label : col.options[i]?.label) ?? '';
  const row = (i: number, color: string) => (
    <div key={i} style={{ height: item, display: 'flex', alignItems: 'center', justifyContent: justify(col.align), paddingLeft: look.item.padX, paddingRight: look.item.padX, whiteSpace: 'nowrap', ...textOf(text, look.item.weight), fontVariantNumeric: look.item.numerals, color }}>
      {label(i)}
    </div>
  );
  const sel = dcv(disabled ? look.item.disabledSelected : look.item.selected, mode);
  return (
    <div style={{ position: 'relative', flex: 'none', width: col.width, ...style }}>
      {col.width === undefined && <Sizer options={col.options} padX={look.item.padX} text={text} weight={look.item.weight} />}
      <div style={{ position: 'relative', height: item * visible, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: (half + from - at) * item }}>{idx.map((i) => row(i, dcv(look.item.color, mode)))}</div>
      </div>
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: half * item, height: item, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: (from - at) * item }}>{idx.map((i) => row(i, sel))}</div>
      </div>
      {ring && <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: half * item, height: item, borderRadius: look.ring.radius, outline: `${look.ring.width}px solid ${dcv(look.ring.color, mode)}`, outlineOffset: look.ring.offset, pointerEvents: 'none' }} />}
    </div>
  );
}

// ── 실제 칼럼 ─────────────────────────────────────────────
function LiveColumn({ look, mode, size, visible, col, disabled, style }: ColumnProps) {
  const item = look.sizes[size].item;
  const text = look.sizes[size].text;
  const half = Math.floor(visible / 2);
  const n = col.options.length;
  const loop = !!col.loop;
  // 반복 칼럼은 앞뒤로 화면 12개치를 깔고, 끝에 가까워지면 몰래 가운데 벌로 되돌린다(SEED 와 같은 방식)
  const copies = loop ? 2 * Math.ceil((12 * visible) / n) + 1 : 1;
  const mid = Math.floor(copies / 2);
  const total = n * copies;
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement | null>(null);
  const clone = useRef<HTMLDivElement | null>(null);
  // 지금 멈춘 자리(깔린 목록의 번호) · 지나는 자리
  const cur = useRef(mid * n + col.index);
  const pass = useRef(cur.current);
  const st = useRef({ dragging: false, animating: false, wheeling: false, touching: false, programmatic: false, justDragged: false, goal: 0 });
  const timers = useRef<{ settle?: number; wheel?: number; raf?: number }>({});
  const [hydrated, setHydrated] = useState(false);
  const [ring, setRing] = useState(false);
  const [shown, setShown] = useState(col.index);
  const cb = useRef(col);
  cb.current = col;

  // 돋보기 — 띠 자리의 고른 색 한 벌을 스크롤만큼 옮긴다
  const paint = () => {
    const el = scroller.current;
    if (el && clone.current) clone.current.style.transform = `translateY(${-el.scrollTop}px)`;
  };
  const snap = (on: boolean) => {
    if (scroller.current) scroller.current.style.scrollSnapType = on ? 'y mandatory' : 'none';
  };
  // 이벤트가 늘 지금의 함수를 부르게 — 렌더마다 갈아 끼운다
  const api = useRef({ settle: () => {}, animate: (_t: number, _ms: number) => {} });
  // 멈춘 뒤 — 칸에 맞아 있으면 값을 정한다(한 번). 반복 칼럼은 가운데 벌로 되돌린다
  api.current.settle = () => {
    const el = scroller.current;
    const s = st.current;
    if (!el || s.dragging || s.animating || s.wheeling || s.touching) return;
    const i = Math.max(0, Math.min(total - 1, Math.round(el.scrollTop / item)));
    if (Math.abs(el.scrollTop - i * item) > 0.5) {
      // 칸 사이에서 멈췄다(스냅이 꺼진 채 끝난 스크롤) — 가까운 칸으로 맞춘 뒤 다시
      api.current.animate(i, look.motion.wheelAlign);
      return;
    }
    const steps = i - cur.current;
    cur.current = i;
    pass.current = i;
    const value = mod(i, n);
    if (loop && Math.abs(i - (mid * n + value)) >= n) {
      const back = mid * n + value;
      el.scrollTop = back * item;
      cur.current = back;
      pass.current = back;
      paint();
    }
    setShown(value);
    const programmatic = s.programmatic;
    s.programmatic = false;
    if (!programmatic && steps !== 0) cb.current.onSettle?.(value, steps);
  };
  // 프로그램 이동 — ease-out cubic(모션 줄이기면 바로). 스냅은 움직이는 동안 끈다
  api.current.animate = (target: number, ms: number) => {
    const el = scroller.current;
    if (!el) return;
    const s = st.current;
    if (timers.current.raf) cancelAnimationFrame(timers.current.raf);
    const from = el.scrollTop;
    const to = Math.max(0, Math.min(total - 1, target)) * item;
    s.goal = Math.max(0, Math.min(total - 1, target));
    const done = () => {
      s.animating = false;
      snap(true);
      api.current.settle();
    };
    if (reduce || ms <= 0 || Math.abs(to - from) < 0.5) {
      snap(false);
      el.scrollTop = to;
      paint();
      done();
      return;
    }
    s.animating = true;
    snap(false);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / ms));
      el.scrollTop = from + (to - from) * easeOut(p);
      paint();
      if (p < 1) timers.current.raf = requestAnimationFrame(step);
      else done();
    };
    timers.current.raf = requestAnimationFrame(step);
  };

  // 처음 — 서버 그림은 목록을 옮겨(transform) 고른 항목을 가운데에 그려 두었다. 붙으면 옮김을 걷고 스크롤로 같은 자리에 둔다
  // (옮긴 채로 스크롤을 주면 스크롤 높이가 줄어 있어 끝에서 잘리므로, 옮김을 걷은 다음 그림 전에 준다)
  useIsoLayoutEffect(() => {
    setHydrated(true);
  }, []);
  useIsoLayoutEffect(() => {
    const el = scroller.current;
    if (!hydrated || !el) return;
    el.scrollTop = cur.current * item;
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // 바깥에서 값이 바뀌면(오전 · 오후가 시를 따라 바뀔 때) 그 자리로 — 만지는 동안은 덮어쓰지 않는다
  useEffect(() => {
    const s = st.current;
    if (!hydrated || s.dragging || s.animating || s.wheeling || s.touching) return;
    if (mod(cur.current, n) === col.index) return;
    let d = col.index - mod(cur.current, n);
    if (loop && Math.abs(d) > n / 2) d -= Math.sign(d) * n;
    s.programmatic = true;
    api.current.animate(cur.current + d, look.motion.releaseMin);
  }, [col.index, hydrated, n, loop, look.motion.releaseMin]);

  // 스크롤 — 돋보기를 따라 옮기고, 지나는 항목을 알리고, 멈추면 정한다(scrollend · 없으면 120ms 무변화)
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const hasEnd = 'onscrollend' in window;
    const later = () => {
      window.clearTimeout(timers.current.settle);
      timers.current.settle = window.setTimeout(() => api.current.settle(), look.motion.wheelIdle);
    };
    const onScroll = () => {
      paint();
      const c = Math.round(el.scrollTop / item);
      if (c !== pass.current) {
        pass.current = c;
        cb.current.onPass?.(mod(c, n));
      }
      if (!hasEnd) later();
    };
    const onEnd = () => api.current.settle();
    const onTouchStart = () => {
      st.current.touching = true;
      setRing(false);
    };
    const onTouchEnd = () => {
      st.current.touching = false;
      later();
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    if (hasEnd) el.addEventListener('scrollend', onEnd);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (hasEnd) el.removeEventListener('scrollend', onEnd);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, n, look.motion.wheelIdle]);
  useEffect(
    () => () => {
      const t = timers.current;
      window.clearTimeout(t.settle);
      window.clearTimeout(t.wheel);
      if (t.raf) cancelAnimationFrame(t.raf);
    },
    [],
  );

  // 마우스 휠 · 트랙패드 — 기본 스크롤, 마지막 입력 120ms 뒤 가까운 칸으로 160ms
  const onWheel = () => {
    if (disabled) return;
    const s = st.current;
    s.wheeling = true;
    setRing(false);
    snap(false);
    window.clearTimeout(timers.current.wheel);
    timers.current.wheel = window.setTimeout(() => {
      s.wheeling = false;
      const el = scroller.current;
      if (el) api.current.animate(Math.round(el.scrollTop / item), look.motion.wheelAlign);
    }, look.motion.wheelIdle);
  };

  // 마우스로 끌기 — 3px 넘게 움직이면 끈다. 놓을 때 빠르기로 최대 3칸 더, 220 + 칸마다 40ms(최대 360). 끈 직후의 누름은 삼킨다
  const drag = useRef<{ id: number; y0: number; top0: number; moved: boolean; samples: { y: number; t: number }[] } | null>(null);
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setRing(false);
    if (disabled || e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = scroller.current;
    if (!el) return;
    drag.current = { id: e.pointerId, y0: e.clientY, top0: el.scrollTop, moved: false, samples: [{ y: e.clientY, t: e.timeStamp }] };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y0;
    if (!d.moved) {
      if (Math.abs(dy) <= look.motion.dragThreshold) return;
      d.moved = true;
      if (timers.current.raf) cancelAnimationFrame(timers.current.raf);
      st.current.animating = false;
      st.current.dragging = true;
      snap(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    el.scrollTop = Math.max(0, Math.min((total - 1) * item, d.top0 - dy));
    paint();
    d.samples.push({ y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    const el = scroller.current;
    if (!d || !el || !d.moved) return;
    st.current.dragging = false;
    st.current.justDragged = true;
    window.setTimeout(() => (st.current.justDragged = false), 0);
    const a = d.samples[0];
    const b = d.samples[d.samples.length - 1];
    const m = look.motion;
    // 놓기 직전 움직임이 묵었으면(80ms) 빠르기 0
    const v = e.timeStamp - b.t > m.staleVelocity || b.t <= a.t ? 0 : (b.y - a.y) / (b.t - a.t);
    const near = Math.round(el.scrollTop / item);
    // 손이 위로 가면(v < 0) 목록은 아래 항목으로 — 놓을 때 빠르기 × 180ms 만큼 더(최대 3칸)
    const extra = Math.max(-m.maxItems, Math.min(m.maxItems, Math.round((-v * 180) / item)));
    const target = Math.max(0, Math.min(total - 1, near + extra));
    // 220 + 넘어가는 칸마다 40(놓은 자리에서 맞출 칸까지 — 소수 칸도), 상한 360
    const moved = Math.abs(target * item - el.scrollTop) / item;
    api.current.animate(target, Math.min(m.releaseMax, m.releaseMin + m.perItem * moved));
  };

  // 보이는 항목 누르기 — 가운데로 200ms ease-out cubic(Q-005 A — 모션 줄이기면 바로), 멈춘 뒤 정한다
  const onItem = (i: number) => {
    if (disabled || st.current.justDragged) return;
    const el = scroller.current;
    if (!el || i === Math.round(el.scrollTop / item)) return;
    api.current.animate(i, look.motion.move);
  };

  // 키보드 — ↑ ↓ 한 칸(누르기와 같은 200ms, 누르고 있으면 바로바로 이어서), Home End 처음 · 끝
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const el = scroller.current;
    if (!el) return;
    // 옮기는 중이면 가던 자리에서 이어 간다(빠르게 거듭 누름)
    const c = st.current.animating ? st.current.goal : cur.current;
    const base = c - mod(c, n);
    let t: number | null = null;
    if (e.key === 'ArrowUp') t = loop || c > 0 ? c - 1 : c;
    else if (e.key === 'ArrowDown') t = loop || c < total - 1 ? c + 1 : c;
    else if (e.key === 'Home') t = base;
    else if (e.key === 'End') t = base + n - 1;
    if (t === null) return;
    e.preventDefault();
    setRing(e.currentTarget.matches(':focus-visible'));
    api.current.animate(t, e.repeat ? 0 : look.motion.move);
  };

  const opt = col.options[shown];
  const label = (i: number) => col.options[mod(i, n)].label;
  const rowStyle = (color: string): CSSProperties => ({
    height: item,
    display: 'flex',
    alignItems: 'center',
    justifyContent: justify(col.align),
    paddingLeft: look.item.padX,
    paddingRight: look.item.padX,
    whiteSpace: 'nowrap',
    ...textOf(text, look.item.weight),
    fontVariantNumeric: look.item.numerals,
    color,
    scrollSnapAlign: 'center',
  });
  const first = hydrated ? 0 : cur.current * item;
  const sel = dcv(disabled ? look.item.disabledSelected : look.item.selected, mode);
  const base = dcv(look.item.color, mode);
  return (
    <div
      role="spinbutton"
      tabIndex={disabled ? -1 : 0}
      aria-label={col.name}
      aria-valuenow={shown}
      aria-valuemin={0}
      aria-valuemax={n - 1}
      aria-valuetext={opt?.label}
      aria-disabled={disabled || undefined}
      data-wheel-column={col.key}
      onKeyDown={onKeyDown}
      onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setRing(false)}
      style={{ position: 'relative', flex: 'none', width: col.width, outline: 'none', cursor: disabled ? 'default' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', ...style }}
    >
      {col.width === undefined && <Sizer options={col.options} padX={look.item.padX} text={text} weight={look.item.weight} />}
      <div
        ref={scroller}
        tabIndex={-1}
        className="pdp-noscroll"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
          st.current.dragging = false;
        }}
        onClickCapture={(e) => {
          if (st.current.justDragged) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        style={{
          position: 'relative',
          height: item * visible,
          overflowY: hydrated && !disabled ? 'scroll' : 'hidden',
          overscrollBehavior: 'contain',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          touchAction: 'pan-y',
        }}
      >
        <div aria-hidden style={{ paddingTop: half * item, paddingBottom: half * item, transform: first ? `translateY(${-first}px)` : undefined }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={rowStyle(base)} onClick={() => onItem(i)}>
              {label(i)}
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: half * item, height: item, overflow: 'hidden', pointerEvents: 'none' }}>
        <div ref={clone} style={hydrated ? undefined : { transform: `translateY(${-first}px)` }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={rowStyle(sel)}>
              {label(i)}
            </div>
          ))}
        </div>
      </div>
      {ring && <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: half * item, height: item, borderRadius: look.ring.radius, outline: `${look.ring.width}px solid ${dcv(look.ring.color, mode)}`, outlineOffset: look.ring.offset, pointerEvents: 'none' }} />}
    </div>
  );
}

export type WheelMarks = Partial<Record<'root' | 'band' | 'columns' | 'fogTop' | 'fogBottom', CSSProperties>> & { column?: Record<string, CSSProperties> };

export type WheelViewProps = {
  look: WheelLook;
  mode?: ViewMode;
  size?: WpSize;
  visible?: number;
  columns: WheelColumnSpec[];
  live?: boolean;
  disabled?: boolean;
  // 휠 이름(필수) — role="group"
  ariaLabel: string;
  width?: number | string;
  // 멈춘 그림 — 키보드 링을 그릴 칼럼
  focusColumn?: string;
  marks?: WheelMarks;
  decor?: ReactNode;
  // 칼럼마다 얹는 그림(핀 · 치수) — 칼럼과 같은 폭의 겹 위에, 안개에 가려지지 않게
  columnDecor?: Record<string, ReactNode>;
  // 띠 · 안개 표시를 그림에 얹을 때(안개 자리를 칠한다)
  showFog?: boolean;
  style?: CSSProperties;
};

// 휠 — 바탕 · 띠(좌우 16 들임 · 모서리 8) · 칼럼 묶음(가운데) · 위아래 안개(마스크)
export function WheelView({ look, mode = 'auto', size = look.defaults.size, visible = look.defaults.visible, columns, live = false, disabled = false, ariaLabel, width = '100%', focusColumn, marks, decor, columnDecor, showFog = false, style }: WheelViewProps) {
  const item = look.sizes[size].item;
  const h = item * visible;
  const half = Math.floor(visible / 2);
  const fog = fogHeight(look, size, visible);
  const mask = fogMask(look, h, fog);
  return (
    <div
      role={live ? 'group' : undefined}
      aria-label={live ? ariaLabel : undefined}
      aria-hidden={live ? undefined : true}
      data-wheel=""
      style={{ position: 'relative', width, height: h, background: dcv(look.bg, mode), overflow: live ? 'hidden' : 'visible', ...marks?.root, ...style }}
    >
      <span aria-hidden style={{ position: 'absolute', left: look.band.insetX, right: look.band.insetX, top: half * item, height: item, borderRadius: look.band.radius, background: dcv(look.band.color, mode), ...marks?.band }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', height: h, WebkitMaskImage: mask, maskImage: mask, ...marks?.columns }}>
        {columns.map((c) =>
          live ? (
            <LiveColumn key={`${c.key}:${c.options.length}:${c.options[0]?.value}`} look={look} mode={mode} size={size} visible={visible} col={c} live disabled={disabled} style={marks?.column?.[c.key]} />
          ) : (
            <StaticColumn key={c.key} look={look} mode={mode} size={size} visible={visible} col={c} live={false} disabled={disabled} ring={focusColumn === c.key} style={marks?.column?.[c.key]} />
          ),
        )}
      </div>
      {columnDecor && (
        <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 4 }}>
          {columns.map((c) => (
            <div key={c.key} style={{ position: 'relative', flex: 'none', width: c.width }}>
              {c.width === undefined && <Sizer options={c.options} padX={look.item.padX} text={look.sizes[size].text} weight={look.item.weight} />}
              {columnDecor[c.key]}
            </div>
          ))}
        </div>
      )}
      {showFog && (
        <>
          <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: 0, height: fog, pointerEvents: 'none', ...marks?.fogTop }} />
          <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: fog, pointerEvents: 'none', ...marks?.fogBottom }} />
        </>
      )}
      {decor}
    </div>
  );
}

// ── 연 · 월 휠(Date Picker 머리 · 달만 고르기) ─────────────────
// 연은 오른쪽 · 반복 없음, 월은 왼쪽 · 반복(SEED 와 같다)
export const yearOptions = (from: number, to: number): WheelOption[] => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: `${from + i}년` }));
export const MONTH_OPTIONS: WheelOption[] = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}월` }));
export function monthYearColumns({ y, m, from, to, onYear, onMonth, at, widths }: { y: number; m: number; from: number; to: number; onYear?: (y: number) => void; onMonth?: (m: number) => void; at?: { year?: number; month?: number }; widths?: { year: number; month: number } }): WheelColumnSpec[] {
  return [
    { key: 'year', name: '연도', options: yearOptions(from, to), index: y - from, align: 'right', width: widths?.year, onSettle: (i) => onYear?.(from + i), at: at?.year },
    { key: 'month', name: '월', options: MONTH_OPTIONS, index: m - 1, loop: true, align: 'left', width: widths?.month, onSettle: (i) => onMonth?.(i + 1), at: at?.month },
  ];
}

// 연 · 월 휠 한 벌 — 서버 그림이 쓴다(칼럼에 함수가 들어 있어 서버에서 만들어 넘기지 못한다)
export function MonthYearWheel({
  look,
  mode = 'auto',
  size,
  visible,
  value,
  from,
  to,
  live = false,
  onValue,
  ariaLabel = '월 선택',
  at,
  focusColumn,
  marks,
  decor,
  columnDecor,
  showFog,
  width,
  widths,
}: {
  look: WheelLook;
  mode?: ViewMode;
  size?: WpSize;
  visible?: number;
  value: { y: number; m: number };
  from: number;
  to: number;
  live?: boolean;
  onValue?: (v: { y: number; m: number }) => void;
  ariaLabel?: string;
  at?: { year?: number; month?: number };
  focusColumn?: string;
  marks?: WheelMarks;
  decor?: ReactNode;
  columnDecor?: Record<string, ReactNode>;
  showFog?: boolean;
  width?: number | string;
  // 연 · 월 칼럼 폭(date-picker.yaml wheel.columns — 연 120 · 월 96)
  widths?: { year: number; month: number };
}) {
  const columns = monthYearColumns({ y: value.y, m: value.m, from, to, onYear: (y) => onValue?.({ ...value, y }), onMonth: (m) => onValue?.({ ...value, m }), at, widths });
  return <WheelView look={look} mode={mode} size={size} visible={visible} columns={columns} live={live} ariaLabel={ariaLabel} focusColumn={focusColumn} marks={marks} decor={decor} columnDecor={columnDecor} showFog={showFog} width={width} />;
}

// ── Time Picker — 오전·오후 → 시 → 분(time-picker.yaml) ───────────
const PERIODS: WheelOption[] = [
  { value: 'am', label: '오전' },
  { value: 'pm', label: '오후' },
];
const HOURS: WheelOption[] = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
export function timeColumns(time: TimeLook, value: Time, step: number, onValue?: (t: Time) => void, at?: Partial<Record<'period' | 'hour' | 'minute', number>>): WheelColumnSpec[] {
  const minutes = minuteOptions(step).map((mm) => ({ value: String(mm), label: String(mm).padStart(2, '0') }));
  const c = time.columns;
  return [
    {
      key: 'period',
      name: c.period.name,
      options: PERIODS,
      index: value.hour < 12 ? 0 : 1,
      loop: c.period.loop,
      align: c.period.align,
      // 오전 · 오후를 바꾸면 시 · 분은 그대로 12시간을 더하거나 뺀다
      onSettle: (i) => onValue?.({ ...value, hour: (value.hour % 12) + (i === 1 ? 12 : 0) }),
      at: at?.period,
    },
    {
      key: 'hour',
      name: c.hour.name,
      options: HOURS,
      index: (value.hour + 11) % 12,
      loop: c.hour.loop,
      align: c.hour.align,
      // 지나온 칸만큼 시각을 옮긴다 — 11 ↔ 12 를 넘으면 오전 · 오후가 따라 바뀐다
      onSettle: (_i, steps) => onValue?.({ ...value, hour: mod(value.hour + steps, 24) }),
      at: at?.hour,
    },
    {
      key: 'minute',
      name: c.minute.name,
      options: minutes,
      index: Math.round(value.minute / step) % minutes.length,
      loop: c.minute.loop,
      align: c.minute.align,
      // 55 → 00 을 넘어도 시는 그대로
      onSettle: (i) => onValue?.({ ...value, minute: i * step }),
      at: at?.minute,
    },
  ];
}

export function TimePickerView({
  wheel,
  time,
  mode = 'auto',
  value,
  onValue,
  step = time.defaultStep,
  live = false,
  disabled = false,
  ariaLabel = '시간 선택',
  at,
  focusColumn,
  marks,
  decor,
  columnDecor,
  showFog,
  width,
}: {
  wheel: WheelLook;
  time: TimeLook;
  mode?: ViewMode;
  value: Time;
  onValue?: (t: Time) => void;
  step?: number;
  live?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  at?: Partial<Record<'period' | 'hour' | 'minute', number>>;
  focusColumn?: string;
  marks?: WheelMarks;
  decor?: ReactNode;
  columnDecor?: Record<string, ReactNode>;
  showFog?: boolean;
  width?: number | string;
}) {
  return <WheelView look={wheel} mode={mode} size={time.size} visible={time.visible} columns={timeColumns(time, value, step, onValue, at)} live={live} disabled={disabled} ariaLabel={ariaLabel} focusColumn={focusColumn} marks={marks} decor={decor} columnDecor={columnDecor} showFog={showFog} width={width} />;
}
