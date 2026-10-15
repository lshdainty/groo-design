'use client';
// 스펙대로 그린 Chart — ChartLook(chart.yaml 을 푼 값)만 받아 그린다. 선 · 막대 · 도넛 · 열지도 · 지표 타일 · 툴팁 · 도넛 범례.
// live 면 실제로 가리키고(마우스 · 터치 · ← → · 열지도는 ↑ ↓ 도) 툴팁을 띄우고, 타일을 눌러 계열을 켜고 끈다. active 를 주면 그 자리에 멈춘 그림이다.
// 축 글자 폭은 글자 수로 정해 셈한다(빌드 · 브라우저가 같은 답 — 링크로 들어와도 모양이 같다).
// 인라인 스타일은 단축 속성(padding)과 개별 속성을 섞지 않는다(PR #154).
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { donutThickness, formatAxisWon, formatWon, heatStep, niceTicks, pressRatio, shadowOf, textWidth, type ChartHue, type ChartLook, type ViewMode } from './data-shared';
import { srOnly, useReducedMotion } from './data-card-view';
import { dcv } from './display-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const pad4 = (t: number, r: number, b: number, l: number): CSSProperties => ({ paddingTop: t, paddingRight: r, paddingBottom: b, paddingLeft: l });

// ── 툴팁 ───────────────────────────────────────────────────
export type TipRow = { label: string; value: string; color: string };
export type TooltipPart = 'root' | 'head' | 'row' | 'swatch' | 'value';
export function ChartTooltipView({ look, mode = 'auto', head, rows, style, marks, pins }: { look: ChartLook; mode?: ViewMode; head: string; rows: TipRow[]; style?: CSSProperties; marks?: Partial<Record<TooltipPart, CSSProperties>>; pins?: Partial<Record<TooltipPart, ReactNode>> }) {
  const t = look.tooltip;
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: t.gap,
        minWidth: t.minW,
        boxSizing: 'border-box',
        ...pad4(t.padY, t.padX, t.padY, t.padX),
        borderRadius: t.radius,
        background: dcv(t.bg, mode),
        boxShadow: shadowOf(t.shadow, mode),
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        ...marks?.root,
        ...style,
      }}
    >
      {pins?.root}
      <span style={{ position: 'relative', fontFamily: t.head.fontFamily, fontSize: t.head.fontSize, lineHeight: t.head.lineHeight, fontWeight: t.head.fontWeight, color: dcv(t.head.fg, mode), ...marks?.head }}>
        {pins?.head}
        {head}
      </span>
      {rows.map((r, i) => (
        <span key={r.label} style={{ position: 'relative', display: 'flex', alignItems: 'center', fontFamily: t.row.fontFamily, fontSize: t.row.fontSize, lineHeight: t.row.lineHeight, ...(i === 0 ? marks?.row : undefined) }}>
          {i === 0 && pins?.row}
          <span style={{ position: 'relative', width: t.swatch.size, height: t.swatch.size, borderRadius: t.swatch.radius, background: r.color, flexShrink: 0, marginRight: t.row.gap, ...(i === 0 ? marks?.swatch : undefined) }}>{i === 0 && pins?.swatch}</span>
          <span style={{ color: dcv(t.row.fg, mode), fontWeight: t.row.fontWeight, marginRight: t.row.minGap }}>{r.label}</span>
          <span style={{ position: 'relative', marginLeft: 'auto', color: dcv(t.row.valueFg, mode), fontWeight: t.row.valueWeight, fontVariantNumeric: 'tabular-nums', ...(i === 0 ? marks?.value : undefined) }}>
            {i === 0 && pins?.value}
            {r.value}
          </span>
        </span>
      ))}
    </div>
  );
}

// ── 지표 타일(선 · 막대 범례) ──────────────────────────────
export type TileItem = { key: string; label: string; hue: ChartHue; total: string };
type TileState = 'enabled' | 'hovered' | 'pressed' | 'focused';
export function LegendTilesView({ look, mode = 'auto', items, hidden = [], onHiddenChange, live = false, states, id, ariaLabel = '계열', marks, pins, stretch = true }: { look: ChartLook; mode?: ViewMode; items: TileItem[]; hidden?: string[]; onHiddenChange?: (h: string[]) => void; live?: boolean; states?: Record<string, TileState>; id?: string; ariaLabel?: string; marks?: Partial<Record<'tile' | 'dot' | 'name' | 'total', CSSProperties>>; pins?: Partial<Record<'tile' | 'dot' | 'name' | 'total', ReactNode>>; stretch?: boolean }) {
  const t = look.tile;
  const [hover, setHover] = useState<string | null>(null);
  const [press, setPress] = useState<string | null>(null);
  const [ring, setRing] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const reduce = useReducedMotion();
  const toggle = (key: string, label: string) => {
    const off = hidden.includes(key);
    const next = off ? hidden.filter((k) => k !== key) : [...hidden, key];
    if (next.length >= items.length) {
      setSaid('계열을 하나는 남겨야 해요.');
      return;
    }
    onHiddenChange?.(next);
    setSaid(`${label} ${off ? '보임' : '숨김'}`);
  };
  return (
    <div id={id} role="group" aria-label={ariaLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: t.gap }}>
      {items.map((it, i) => {
        const off = hidden.includes(it.key);
        // 켠 계열이 하나만 남은 타일 — 끌 수 없다: 색 그대로 · 커서 not-allowed · 축소 없음(Q-012-3 C)
        const locked = !off && items.length - hidden.length <= 1;
        const st = states?.[it.key] ?? (press === it.key && !locked ? 'pressed' : hover === it.key ? 'hovered' : 'enabled');
        const focused = states?.[it.key] === 'focused' || ring === it.key;
        const h = parseFloat(t.name.lineHeight) + t.totalGap + parseFloat(t.total.lineHeight) + t.padY * 2;
        const ratio = st === 'pressed' && !reduce ? pressRatio(t.press, 140, h) : 1;
        // 끈 타일만 호버 바탕 — 누름은 색 없이 축소만(마우스로 누르면 호버 바탕은 남는다, Q-012-2)
        const hoverOn = states?.[it.key] ? states[it.key] === 'hovered' : hover === it.key;
        const bg = off ? (hoverOn ? dcv(t.hoverBg, mode) : dcv(t.hiddenBg, mode)) : dcv(look.subtle[it.hue], mode);
        return (
          <button
            key={it.key}
            type="button"
            aria-pressed={!off}
            aria-disabled={locked || undefined}
            tabIndex={live ? 0 : -1}
            onClick={live ? () => toggle(it.key, it.label) : undefined}
            onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(it.key) : undefined}
            onPointerLeave={live ? () => (setHover(null), setPress(null)) : undefined}
            onPointerDown={live ? () => setPress(it.key) : undefined}
            onPointerUp={live ? () => setPress(null) : undefined}
            onFocus={live ? (e) => e.currentTarget.matches(':focus-visible') && setRing(it.key) : undefined}
            onBlur={live ? () => setRing(null) : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: stretch ? '1 1 0%' : '0 0 auto',
              minWidth: 100,
              boxSizing: 'border-box',
              ...pad4(t.padY, t.padX, t.padY, t.padX),
              borderWidth: 0,
              borderRadius: t.radius,
              background: bg,
              boxShadow: off ? `inset 0 0 0 ${t.hiddenBorderW}px ${dcv(t.hiddenBorder, mode)}` : 'none',
              cursor: locked ? t.lockedCursor : live ? 'pointer' : 'default',
              textAlign: 'left',
              transform: ratio !== 1 ? `scale(${ratio})` : undefined,
              transitionProperty: 'background-color, transform',
              transitionDuration: `${t.color.duration}, ${t.press.motion.duration}`,
              transitionTimingFunction: `${t.color.easing}, ${t.press.motion.easing}`,
              outline: focused ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
              outlineOffset: look.ring.offset,
              WebkitTapHighlightColor: 'transparent',
              ...(i === 0 ? marks?.tile : undefined),
            }}
          >
            {i === 0 && pins?.tile}
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: t.dotGap, fontFamily: t.name.fontFamily, fontSize: t.name.fontSize, lineHeight: t.name.lineHeight, fontWeight: t.name.fontWeight, color: dcv(t.name.fg, mode), ...(i === 0 ? marks?.name : undefined) }}>
              <span aria-hidden style={{ position: 'relative', width: t.dot, height: t.dot, borderRadius: 9999, background: dcv(look.series[it.hue], mode), flexShrink: 0, ...(i === 0 ? marks?.dot : undefined) }}>{i === 0 && pins?.dot}</span>
              {i === 0 && pins?.name}
              {it.label}
            </span>
            <span style={{ position: 'relative', marginTop: t.totalGap, fontFamily: t.total.fontFamily, fontSize: t.total.fontSize, lineHeight: t.total.lineHeight, fontWeight: t.total.fontWeight, color: dcv(t.total.fg, mode), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...(i === 0 ? marks?.total : undefined) }}>
              {i === 0 && pins?.total}
              {it.total}
            </span>
          </button>
        );
      })}
      {live && (
        <span role="status" style={srOnly}>
          {said}
        </span>
      )}
    </div>
  );
}

// ── 추이(선 · 막대) ────────────────────────────────────────
export type TrendSeries = { key: string; label: string; hue: ChartHue; values: (number | null)[]; axis?: 'left' | 'right' };
export type TrendPart = 'tick' | 'grid' | 'series' | 'crosshair' | 'point' | 'tooltip' | 'box';
export type TrendChartProps = {
  look: ChartLook;
  mode?: ViewMode;
  kind?: 'line' | 'bar';
  series: TrendSeries[];
  // 가로축 — count 자리(그 달 끝까지 둘 수 있다), 값은 앞에서부터. 눈금 글자 · 툴팁 머리(자리마다 — 서버 그림이 넘기므로 함수가 아니라 글)
  count: number;
  xLabels: string[];
  xTicks?: number[];
  heads: string[];
  dual?: boolean;
  hidden?: string[];
  height?: number;
  // 고정 폭(그림) — 없으면 상자 폭을 잰다
  width?: number;
  active?: number | null;
  live?: boolean;
  label: string;
  legendId?: string;
  // 처음 그릴 때 그어지는 모션(300ms 한 번 — 모션 줄이기면 바로)
  animate?: boolean;
  marks?: Partial<Record<TrendPart, CSSProperties>>;
  pins?: Partial<Record<TrendPart, ReactNode>>;
  // 나쁜 예 — 축 선 · 세로 격자 · 툴팁 테두리
  bad?: { axisLines?: boolean; vgrid?: boolean; borderTip?: boolean; clipNegative?: boolean };
  // 그림 — 툴팁을 숨김
  noTip?: boolean;
};

const AXIS_GAP = 8;
export function TrendChartView({ look, mode = 'auto', kind = 'line', series, count, xLabels, xTicks, heads, dual = false, hidden = [], height = 200, width: fixedW, active: frozen, live = false, label, legendId, animate = false, marks, pins, bad, noTip = false }: TrendChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const boxRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  const [act, setAct] = useState<number | null>(null);
  const [ring, setRing] = useState(false);
  const [drawn, setDrawn] = useState(!animate);
  const reduce = useReducedMotion();
  useIsoLayoutEffect(() => {
    if (fixedW) return;
    const el = boxRef.current;
    if (!el) return;
    const on = () => setMeasured(el.clientWidth);
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixedW]);
  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);
  const W = fixedW ?? measured ?? 320;
  const visible = series.filter((s) => !hidden.includes(s.key));
  const left = visible.filter((s) => (s.axis ?? 'left') === 'left' || !dual);
  const right = dual ? visible.filter((s) => s.axis === 'right') : [];
  const range = (ss: TrendSeries[]) => {
    const vals = ss.flatMap((s) => s.values.filter((v): v is number => v !== null));
    return [Math.min(0, ...vals), Math.max(0, ...vals)];
  };
  const [lMin, lMax] = range(left.length ? left : series.filter((s) => (s.axis ?? 'left') === 'left' || !dual));
  const [rMin, rMax] = range(right.length ? right : dual ? series.filter((s) => s.axis === 'right') : []);
  const lTicks = niceTicks(lMin, lMax);
  const rTicks = dual ? niceTicks(rMin, rMax) : [];
  const tk = look.tick;
  const fs = parseFloat(tk.type.fontSize);
  const lw = Math.max(...lTicks.map((v) => textWidth(formatAxisWon(v), fs)));
  const rw = dual ? Math.max(...rTicks.map((v) => textWidth(formatAxisWon(v), fs))) : 0;
  // 나쁜 예 — 지금 자산 화면처럼 가장 긴 눈금 글자가 상자 밖으로 7px 나가 빼기(−)만 잘린다
  const padL = bad?.clipNegative ? lw + AXIS_GAP - 7 : lw + AXIS_GAP;
  const padR = dual ? rw + AXIS_GAP : AXIS_GAP;
  const padT = 8;
  const padB = parseFloat(tk.type.lineHeight) + AXIS_GAP;
  const iw = Math.max(40, W - padL - padR);
  const ih = height - padT - padB;
  const band = iw / count;
  const xAt = (i: number) => (kind === 'bar' ? padL + band * (i + 0.5) : count === 1 ? padL + iw / 2 : padL + (iw * i) / (count - 1));
  const yScale = (ticks: number[]) => (v: number) => padT + ih * (1 - (v - ticks[0]) / (ticks[ticks.length - 1] - ticks[0] || 1));
  const yL = yScale(lTicks);
  const yR = dual ? yScale(rTicks) : yL;
  const yOf = (s: TrendSeries) => (dual && s.axis === 'right' ? yR : yL);
  const active = frozen !== undefined && frozen !== null ? frozen : act;
  const lastIndex = Math.max(...series.map((s) => s.values.length)) - 1;
  const tickColor = (axis: 'left' | 'right') => {
    if (!dual) return dcv(tk.fg, mode);
    const s = series.find((x) => (x.axis ?? 'left') === axis);
    return s ? dcv(look.series[s.hue], mode) : dcv(tk.fg, mode);
  };
  // 선 — monotone 곡선(값이 있는 자리까지)
  const pathOf = (s: TrendSeries) => {
    const pts = s.values.map((v, i) => (v === null ? null : ([xAt(i), yOf(s)(v)] as [number, number]))).filter((p): p is [number, number] => p !== null);
    if (pts.length < 2) return '';
    const n = pts.length;
    const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
    const sl = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
    const m = pts.map((_, i) => (i === 0 ? sl[0] : i === n - 1 ? sl[n - 2] : sl[i - 1] * sl[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / sl[i - 1] + (dx[i] + 2 * dx[i - 1]) / sl[i])));
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += ` C${pts[i][0] + h},${pts[i][1] + m[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - m[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
    }
    return d;
  };
  const move = (dir: 1 | -1) => setAct((a) => Math.max(0, Math.min(lastIndex, (a ?? (dir === 1 ? -1 : lastIndex + 1)) + dir)));
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!live) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      move(e.key === 'ArrowRight' ? 1 : -1);
    } else if (e.key === 'Escape') setAct(null);
  };
  const pick = (clientX: number) => {
    const el = boxRef.current;
    if (!el) return;
    const x = clientX - el.getBoundingClientRect().left;
    const i = kind === 'bar' ? Math.floor((x - padL) / band) : Math.round(((x - padL) / iw) * (count - 1));
    setAct(Math.max(0, Math.min(lastIndex, i)));
  };
  const ticksX = xTicks ?? Array.from({ length: count }, (_, i) => i);
  const tipRows = active === null ? [] : visible.filter((s) => s.values[active] !== null && s.values[active] !== undefined).map((s) => ({ label: s.label, value: formatWon(s.values[active] as number), color: dcv(look.series[s.hue], mode) }));
  const tipX = active === null ? 0 : xAt(active);
  const tipLeft = active === null ? 0 : tipX > padL + iw * 0.55 ? tipX - 12 : tipX + 12;
  const drawMs = reduce ? '0ms' : look.motion.draw.duration;
  const barW = Math.min(look.bar.maxW, (band * 0.6 - look.bar.gap * (visible.length - 1)) / Math.max(1, visible.length));
  const zero = lTicks.includes(0) ? yL(0) : padT + ih;
  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      aria-describedby={legendId}
      tabIndex={live ? 0 : undefined}
      onKeyDown={onKey}
      onFocus={live ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={live ? () => (setRing(false), setAct(null)) : undefined}
      onPointerMove={live ? (e) => e.pointerType === 'mouse' && pick(e.clientX) : undefined}
      onPointerDown={live ? (e) => e.pointerType !== 'mouse' && pick(e.clientX) : undefined}
      onPointerLeave={live ? (e) => e.pointerType === 'mouse' && setAct(null) : undefined}
      style={{ position: 'relative', width: fixedW ?? '100%', height, outline: ring ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none', outlineOffset: look.ring.offset, borderRadius: 4, touchAction: 'pan-y', fontFamily: tk.type.fontFamily, ...marks?.box }}
    >
      {pins?.box}
      <svg aria-hidden width={W} height={height} viewBox={`0 0 ${W} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {visible.map((s) => (
            <linearGradient key={s.key} id={`${uid}${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dcv(look.series[s.hue], mode)} stopOpacity={look.line.areaFrom / 100} />
              <stop offset="100%" stopColor={dcv(look.series[s.hue], mode)} stopOpacity={look.line.areaTo / 100} />
            </linearGradient>
          ))}
        </defs>
        {/* 가로 격자 — 점선, 세로 격자 · 축 선 없음 */}
        {lTicks.map((v) => (
          <line key={`g${v}`} x1={padL} x2={padL + iw} y1={yL(v)} y2={yL(v)} stroke={dcv(look.grid.color, mode)} strokeWidth={look.grid.width} strokeDasharray={look.grid.dash.join(' ')} style={v === lTicks[1] ? marks?.grid : undefined} />
        ))}
        {bad?.vgrid && ticksX.map((i) => <line key={`v${i}`} x1={xAt(i)} x2={xAt(i)} y1={padT} y2={padT + ih} stroke={dcv(look.grid.color, mode)} strokeWidth={1} />)}
        {bad?.axisLines && (
          <>
            <line x1={padL} x2={padL} y1={padT} y2={padT + ih} stroke={dcv(look.tick.fg, mode)} strokeWidth={1} />
            <line x1={padL} x2={padL + iw} y1={padT + ih} y2={padT + ih} stroke={dcv(look.tick.fg, mode)} strokeWidth={1} />
          </>
        )}
        {/* 세로축 눈금 글자 — 이중 축이면 계열 색 */}
        {lTicks.map((v) => (
          <text key={`l${v}`} x={padL - AXIS_GAP} y={yL(v)} dy="0.35em" textAnchor="end" fontSize={fs} fontWeight={tk.type.fontWeight} fill={tickColor('left')} style={{ fontVariantNumeric: 'tabular-nums', ...(v === lTicks[lTicks.length - 1] ? marks?.tick : undefined) }}>
            {formatAxisWon(v)}
          </text>
        ))}
        {rTicks.map((v) => (
          <text key={`r${v}`} x={padL + iw + AXIS_GAP} y={yR(v)} dy="0.35em" textAnchor="start" fontSize={fs} fontWeight={tk.type.fontWeight} fill={tickColor('right')} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatAxisWon(v)}
          </text>
        ))}
        {/* 가로축 글자 — 날짜 · 기간 */}
        {ticksX.map((i) => (
          <text key={`x${i}`} x={xAt(i)} y={height - 2} textAnchor={kind === 'line' && i === 0 ? 'start' : kind === 'line' && i === count - 1 ? 'end' : 'middle'} fontSize={fs} fill={dcv(tk.fg, mode)} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {xLabels[i]}
          </text>
        ))}
        {/* 가리킴 선 — 세로 점선 */}
        {active !== null && kind === 'line' && <line x1={tipX} x2={tipX} y1={padT} y2={padT + ih} stroke={dcv(look.crosshair.color, mode)} strokeWidth={look.crosshair.width} strokeDasharray={look.crosshair.dash.join(' ')} style={marks?.crosshair} />}
        {active !== null && kind === 'bar' && <rect x={padL + band * active} y={padT} width={band} height={ih} fill={dcv(look.tile.hoverBg, mode)} />}
        {kind === 'line' &&
          visible.map((s) => {
            const d = pathOf(s);
            if (!d) return null;
            const lastI = s.values.reduce<number>((acc, v, i) => (v === null ? acc : i), 0);
            const area = `${d} L${xAt(lastI)},${yOf(s)(0)} L${xAt(0)},${yOf(s)(0)} Z`;
            return (
              <g key={s.key} style={marks?.series}>
                <path d={area} fill={`url(#${uid}${s.key})`} stroke="none" style={{ opacity: drawn ? 1 : 0, transition: `opacity ${drawMs} ${look.motion.draw.easing}` }} />
                <path d={d} fill="none" stroke={dcv(look.series[s.hue], mode)} strokeWidth={look.line.width} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1} style={{ transition: `stroke-dashoffset ${drawMs} ${look.motion.draw.easing}` }} />
              </g>
            );
          })}
        {kind === 'bar' &&
          visible.map((s, si) =>
            s.values.map((v, i) => {
              if (v === null) return null;
              const x = padL + band * i + band / 2 - (barW * visible.length + look.bar.gap * (visible.length - 1)) / 2 + si * (barW + look.bar.gap);
              const y = yOf(s)(Math.max(0, v));
              const h = Math.abs(yOf(s)(v) - yOf(s)(0));
              const r = Math.min(look.bar.radius, h / 2, barW / 2);
              const neg = v < 0;
              const top = neg ? yOf(s)(0) : y;
              const path = neg
                ? `M${x},${top} H${x + barW} V${top + h - r} Q${x + barW},${top + h} ${x + barW - r},${top + h} H${x + r} Q${x},${top + h} ${x},${top + h - r} Z`
                : `M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`;
              return <path key={`${s.key}${i}`} d={path} fill={dcv(look.series[s.hue], mode)} style={{ transformOrigin: `0 ${zero}px`, transform: drawn ? 'scaleY(1)' : 'scaleY(0)', transition: `transform ${drawMs} ${look.motion.draw.easing}`, ...(i === 0 && si === 0 ? marks?.series : undefined) }} />;
            }),
          )}
        {/* 가리킨 점 — 가리킨 자리에만(계열 색 + 카드 면 색 테두리) */}
        {active !== null &&
          kind === 'line' &&
          visible.map((s) => {
            const v = s.values[active];
            if (v === null || v === undefined) return null;
            return <circle key={`p${s.key}`} cx={tipX} cy={yOf(s)(v)} r={look.point.size / 2 - look.point.ring / 2} fill={dcv(look.series[s.hue], mode)} stroke={dcv(look.point.ringColor, mode)} strokeWidth={look.point.ring} style={marks?.point} />;
          })}
      </svg>
      {pins?.tick}
      {pins?.series}
      {pins?.crosshair}
      {pins?.point}
      {active !== null && !noTip && tipRows.length > 0 && (
        <div style={{ position: 'absolute', top: padT, left: tipLeft, transform: tipX > padL + iw * 0.55 ? 'translateX(-100%)' : undefined, zIndex: 2 }}>
          {pins?.tooltip}
          <ChartTooltipView look={look} mode={mode} head={heads[active] ?? ''} rows={tipRows} style={{ ...(bad?.borderTip ? { boxShadow: 'none', borderWidth: 1, borderStyle: 'solid', borderColor: dcv(look.grid.color, mode), borderRadius: 4 } : undefined), ...marks?.tooltip }} />
        </div>
      )}
    </div>
  );
}

// ── 도넛 ───────────────────────────────────────────────────
export type Slice = { key: string; label: string; hue: ChartHue; amount: number };
export function DonutView({ look, mode = 'auto', slices, diameter, thickness, centerLabel, centerAmount, label, legendId, active: frozen, live = false, marks, pins, bad }: { look: ChartLook; mode?: ViewMode; slices: Slice[]; diameter?: number; thickness?: number; centerLabel?: string; centerAmount?: string; label: string; legendId?: string; active?: string | null; live?: boolean; marks?: Partial<Record<'slice' | 'center' | 'centerLabel', CSSProperties>>; pins?: Partial<Record<'slice' | 'center' | 'centerLabel', ReactNode>>; bad?: { gaps?: boolean } }) {
  const d = diameter ?? look.donut.diameter;
  const w = thickness ?? donutThickness(look, d);
  const r = (d - w) / 2;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.amount, 0) || 1;
  const [act, setAct] = useState<string | null>(null);
  const active = frozen !== undefined ? frozen : act;
  let off = 0;
  const c = look.donut.center;
  const lb = look.donut.label;
  // 가운데 글이 안쪽 원에 들어가는지 — 들어가지 않으면 가운데 글을 빼고 범례 위 합계로(부르는 쪽)
  const inner = d - w * 2;
  const fits = !centerAmount || textWidth(centerAmount, parseFloat(c.fontSize)) <= inner - 12;
  const hit = slices.find((s) => s.key === active);
  return (
    <div role="img" aria-label={label} aria-describedby={legendId} style={{ position: 'relative', width: d, height: d, flexShrink: 0 }}>
      <svg aria-hidden width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        {slices.map((s, i) => {
          const len = (circ * s.amount) / total;
          const gap = bad?.gaps ? 2 : 0;
          const el = (
            <circle
              key={s.key}
              cx={d / 2}
              cy={d / 2}
              r={r}
              fill="none"
              stroke={dcv(look.series[s.hue], mode)}
              strokeWidth={active === s.key ? w + 2 : w}
              strokeDasharray={`${Math.max(0, len - gap)} ${circ - Math.max(0, len - gap)}`}
              strokeDashoffset={-off}
              onPointerEnter={live ? () => setAct(s.key) : undefined}
              onPointerLeave={live ? () => setAct(null) : undefined}
              style={{ cursor: live ? 'pointer' : undefined, ...(i === 0 ? marks?.slice : undefined) }}
            />
          );
          off += len;
          return el;
        })}
      </svg>
      {pins?.slice}
      {centerAmount && fits && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {centerLabel && (
            <span style={{ position: 'relative', fontFamily: lb.fontFamily, fontSize: lb.fontSize, lineHeight: lb.lineHeight, color: dcv(lb.fg, mode), ...marks?.centerLabel }}>
              {pins?.centerLabel}
              {centerLabel}
            </span>
          )}
          <span style={{ position: 'relative', fontFamily: c.fontFamily, fontSize: c.fontSize, lineHeight: c.lineHeight, fontWeight: c.fontWeight, color: dcv(c.fg, mode), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...marks?.center }}>
            {pins?.center}
            {centerAmount}
          </span>
        </div>
      )}
      {hit && (
        <div style={{ position: 'absolute', left: '50%', top: -8, transform: 'translate(-50%, -100%)', zIndex: 2 }}>
          <ChartTooltipView look={look} mode={mode} head={hit.label} rows={[{ label: `${Math.round((hit.amount / total) * 1000) / 10}%`, value: formatWon(hit.amount), color: dcv(look.series[hit.hue], mode) }]} />
        </div>
      )}
    </div>
  );
}

// 도넛 범례 — 카테고리 목록(색 네모 10 · 이름 14 · % 14 · 금액 14 · 700 + "원"). 하위가 있는 줄만 누르는 줄(List — 화살표)
export type LegendRow = { key: string; label: string; hue: ChartHue; percent: string; amount: string; pressable?: boolean };
export function DonutLegendView({ look, mode = 'auto', rows, id, live = false, states, padX = 0, bleed, onPick, marks, pins, bad }: { look: ChartLook; mode?: ViewMode; rows: LegendRow[]; id?: string; live?: boolean; states?: Record<string, TileState>; padX?: number; bleed?: number; onPick?: (key: string) => void; marks?: Partial<Record<'row' | 'swatch' | 'percent' | 'amount', CSSProperties>>; pins?: Partial<Record<'row' | 'swatch' | 'percent' | 'amount', ReactNode>>; bad?: { noWon?: boolean } }) {
  const l = look.legendList;
  const [hover, setHover] = useState<string | null>(null);
  const [press, setPress] = useState<string | null>(null);
  const [ring, setRing] = useState<string | null>(null);
  // 누르는 줄이 하나라도 있으면 화살표 자리를 모든 줄에 — 금액이 위아래로 맞는다
  const anyPress = rows.some((r) => r.pressable);
  // 카드 본문 안이면(기본) 카드 여백만큼 양옆으로 나가 줄이 제 여백을 갖는다 — 누름 바탕이 카드 끝에서 들임만큼 선다
  const bx = bleed ?? l.bleed;
  const px = bx > 0 ? bx : padX;
  return (
    <ul id={id} aria-label="카테고리" style={{ listStyle: 'none', marginTop: 0, marginBottom: 0, marginLeft: -bx, marginRight: -bx, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, display: 'flex', flexDirection: 'column' }}>
      {rows.map((row, i) => {
        const st = states?.[row.key] ?? (press === row.key ? 'pressed' : hover === row.key ? 'hovered' : 'enabled');
        const tinted = row.pressable && (st === 'hovered' || st === 'pressed');
        const focused = states?.[row.key] === 'focused' || ring === row.key;
        const content = (
          <>
            <span aria-hidden style={{ position: 'relative', width: l.swatch, height: l.swatch, borderRadius: look.tooltip.swatch.radius, background: dcv(look.series[row.hue], mode), flexShrink: 0, ...(i === 0 ? marks?.swatch : undefined) }}>{i === 0 && pins?.swatch}</span>
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: dcv(l.fg, mode) }}>{row.label}</span>
            <span style={{ position: 'relative', color: dcv(l.sub, mode), fontVariantNumeric: 'tabular-nums', ...(i === 0 ? marks?.percent : undefined) }}>
              {i === 0 && pins?.percent}
              {row.percent}
            </span>
            <span style={{ position: 'relative', minWidth: 96, textAlign: 'right', fontWeight: 700, color: dcv(l.fg, mode), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...(i === 0 ? marks?.amount : undefined) }}>
              {i === 0 && pins?.amount}
              {bad?.noWon ? row.amount.replace(/원$/, '') : row.amount}
            </span>
            {row.pressable ? <ChevronRight aria-hidden size={16} strokeWidth={2} style={{ color: dcv(l.sub, mode), flexShrink: 0, marginLeft: -2 }} /> : anyPress ? <span aria-hidden style={{ width: 14, flexShrink: 0 }} /> : null}
          </>
        );
        const rowStyle: CSSProperties = {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: l.gap,
          minHeight: l.minH,
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: px,
          paddingRight: px,
          borderWidth: 0,
          borderRadius: l.bgRadius,
          background: 'transparent',
          fontFamily: l.type.fontFamily,
          fontSize: l.type.fontSize,
          lineHeight: l.type.lineHeight,
          textAlign: 'left',
          cursor: row.pressable && live ? 'pointer' : 'default',
          outline: focused ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
          outlineOffset: -look.ring.width,
          WebkitTapHighlightColor: 'transparent',
          ...(i === 0 ? marks?.row : undefined),
        };
        // 누름 · 호버 바탕 — 줄 좌우에서 들인 층(List 와 같다). 글 · 포커스 링은 줄 그대로
        const bgLayer = row.pressable && (
          <span aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: l.bgInsetX, right: l.bgInsetX, borderRadius: l.bgRadius, background: tinted ? dcv(l.hoverBg, mode) : 'transparent', transition: `background-color ${look.motion.color.duration} ${look.motion.color.easing}`, pointerEvents: 'none' }} />
        );
        return (
          <li key={row.key} style={{ position: 'relative' }}>
            {i === 0 && pins?.row}
            {bgLayer}
            {row.pressable ? (
              <button
                type="button"
                tabIndex={live ? 0 : -1}
                aria-label={`${row.label} ${row.percent} ${row.amount}, 하위 카테고리 보기`}
                onClick={live ? () => onPick?.(row.key) : undefined}
                onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(row.key) : undefined}
                onPointerLeave={live ? () => (setHover(null), setPress(null)) : undefined}
                onPointerDown={live ? () => setPress(row.key) : undefined}
                onPointerUp={live ? () => setPress(null) : undefined}
                onFocus={live ? (e) => e.currentTarget.matches(':focus-visible') && setRing(row.key) : undefined}
                onBlur={live ? () => setRing(null) : undefined}
                style={rowStyle}
              >
                {content}
              </button>
            ) : (
              <div style={rowStyle}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ── 열지도 ─────────────────────────────────────────────────
export type HeatRowSpec = { key: string; label: string; sub: string; values: number[] };
export type HeatPart = 'cell' | 'value' | 'label' | 'head' | 'tooltip' | 'box';
export type HeatmapProps = {
  look: ChartLook;
  mode?: ViewMode;
  brand?: 'desk' | 'hr';
  rows: HeatRowSpec[];
  columns: string[];
  columnsFull: string[];
  // 칸 폭 — 주면 그 폭으로(그림), 없으면 상자 폭에서 셈한다(실제)
  cell?: number;
  active?: [number, number] | null;
  live?: boolean;
  label: string;
  // 툴팁 줄 이름("지출")
  series?: string;
  marks?: Partial<Record<HeatPart, CSSProperties>>;
  pins?: Partial<Record<HeatPart, ReactNode>>;
  // 나쁜 예 — 줄여 쓴 돈 · 줄어드는 글자 · 늘 색만
  bad?: { abbreviate?: boolean; shrink?: boolean; colorOnly?: boolean };
};

export function HeatmapView({ look, mode = 'auto', brand = 'desk', rows, columns, columnsFull, cell: fixedCell, active: frozen, live = false, label, series = '지출', marks, pins, bad }: HeatmapProps) {
  const h = look.heat;
  const boxRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  const [act, setAct] = useState<[number, number] | null>(null);
  const [ring, setRing] = useState(false);
  useIsoLayoutEffect(() => {
    if (fixedCell) return;
    const el = boxRef.current;
    if (!el) return;
    const on = () => setMeasured(el.clientWidth);
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixedCell]);
  const cols = columns.length;
  const cell = fixedCell ?? Math.max(16, Math.floor(((measured ?? 520) - h.labelCol - h.gap * cols) / cols));
  const max = Math.max(...rows.flatMap((r) => r.values));
  const showText = !bad?.colorOnly && (cell >= h.threshold || !!bad?.abbreviate || !!bad?.shrink);
  const fgSteps = h.fg[brand];
  const active = frozen !== undefined ? frozen : act;
  const bgOf = (step: number) => (step < 0 ? dcv(h.empty, mode) : `color-mix(in srgb, ${dcv(h.stepBg.over, mode)} ${h.steps[step]}%, ${dcv(h.stepBg.base, mode)})`);
  // 단계마다 글자색 — 라이트 · 다크가 다른 토큰이면 .pdat 가 고른다
  const fgStyle = (step: number): { className?: string; 'data-mode'?: string; style: CSSProperties } => {
    if (step < 0) return { style: { color: dcv(h.emptyFg, mode) } };
    const f = fgSteps[step];
    const tone = (t: string, dark: boolean) => (t === 'static-white' ? '#FFFFFF' : dark ? h.name.fg.dark : h.name.fg.light);
    if (mode === 'auto') {
      if (f.light === f.dark) return { style: { color: f.light === 'static-white' ? 'var(--p-static-white)' : `var(--p-${h.name.fg.name})` } };
      return { className: 'pdat', 'data-mode': 'auto', style: { ['--pd-s-l' as string]: `var(--p-${f.light === 'static-white' ? 'static-white' : h.name.fg.name})`, ['--pd-s-d' as string]: `var(--p-${f.dark === 'static-white' ? 'static-white' : h.name.fg.name})`, color: 'var(--pd-s)' } };
    }
    return { style: { color: tone(mode === 'dark' ? f.dark : f.light, mode === 'dark') } };
  };
  const abbreviate = (v: number) => formatAxisWon(v);
  const textOf = (v: number) => (v <= 0 ? '—' : bad?.abbreviate ? abbreviate(v) : formatWon(v));
  const fsOf = (txt: string) => (bad?.shrink ? (txt.length <= 5 ? 11.5 : txt.length <= 8 ? 10 : 8) : parseFloat(h.value.fontSize));
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!live) return;
    const d: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    if (d[e.key]) {
      e.preventDefault();
      setAct((a) => {
        if (!a) return [0, 0];
        return [Math.max(0, Math.min(rows.length - 1, a[0] + d[e.key][0])), Math.max(0, Math.min(cols - 1, a[1] + d[e.key][1]))];
      });
    } else if (e.key === 'Escape') setAct(null);
  };
  const tip = active ? { r: rows[active[0]], c: active[1] } : null;
  const tipStep = tip ? heatStep(tip.r.values[tip.c], max, h.cuts) : -1;
  const tipLeft = active ? h.labelCol + h.gap + active[1] * (cell + h.gap) + cell / 2 : 0;
  const tipTop = active ? parseFloat(h.head.lineHeight) + h.gap + active[0] * (cell + h.gap) : 0;
  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      tabIndex={live ? 0 : undefined}
      onKeyDown={onKey}
      onFocus={live ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={live ? () => (setRing(false), setAct(null)) : undefined}
      onPointerLeave={live ? (e) => e.pointerType === 'mouse' && setAct(null) : undefined}
      style={{ position: 'relative', width: fixedCell ? 'max-content' : '100%', outline: ring ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none', outlineOffset: look.ring.offset, borderRadius: 4, ...marks?.box }}
    >
      {pins?.box}
      <div aria-hidden style={{ display: 'grid', gridTemplateColumns: `${h.labelCol}px repeat(${cols}, ${cell}px)`, columnGap: h.gap, rowGap: h.gap, alignItems: 'center' }}>
        <span />
        {columns.map((c, i) => (
          <span key={c} style={{ position: 'relative', textAlign: 'center', fontFamily: h.head.fontFamily, fontSize: h.head.fontSize, lineHeight: h.head.lineHeight, color: dcv(h.head.fg, mode), ...(i === 0 ? marks?.head : undefined) }}>
            {i === 0 && pins?.head}
            {c}
          </span>
        ))}
        {rows.map((r, ri) => (
          <RowCells key={r.key}>
            <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...(ri === 0 ? marks?.label : undefined) }}>
              {ri === 0 && pins?.label}
              <span style={{ fontFamily: h.name.fontFamily, fontSize: h.name.fontSize, lineHeight: h.name.lineHeight, fontWeight: h.name.fontWeight, color: dcv(h.name.fg, mode) }}>{r.label}</span>
              <span style={{ fontFamily: h.time.fontFamily, fontSize: h.time.fontSize, lineHeight: h.time.lineHeight, color: dcv(h.time.fg, mode), whiteSpace: 'nowrap' }}>{r.sub}</span>
            </span>
            {r.values.map((v, ci) => {
              const step = heatStep(v, max, h.cuts);
              const txt = textOf(v);
              const fg = fgStyle(step);
              const first = ri === 0 && ci === 0;
              return (
                <span
                  key={ci}
                  className={fg.className}
                  data-mode={fg['data-mode']}
                  onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setAct([ri, ci]) : undefined}
                  onPointerDown={live ? () => setAct([ri, ci]) : undefined}
                  style={{
                    position: 'relative',
                    width: cell,
                    height: cell,
                    borderRadius: h.radius,
                    background: bgOf(step),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: h.value.fontFamily,
                    fontSize: fsOf(txt),
                    lineHeight: h.value.lineHeight,
                    fontWeight: h.value.fontWeight,
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    cursor: live ? 'pointer' : undefined,
                    ...fg.style,
                    ...(first ? marks?.cell : undefined),
                  }}
                >
                  {first && pins?.cell}
                  {showText && <span style={{ position: 'relative', ...(ri === 0 && ci === 1 ? marks?.value : undefined) }}>{ri === 0 && ci === 1 && pins?.value}{txt}</span>}
                </span>
              );
            })}
          </RowCells>
        ))}
      </div>
      {tip && (
        <div style={{ position: 'absolute', left: tipLeft, top: tipTop - 6, transform: 'translate(-50%, -100%)', zIndex: 3, ...marks?.tooltip }}>
          {pins?.tooltip}
          <ChartTooltipView look={look} mode={mode} head={`${columnsFull[tip.c]} ${tip.r.label} ${tip.r.sub}`} rows={[{ label: series, value: tip.r.values[tip.c] > 0 ? formatWon(tip.r.values[tip.c]) : '없음', color: bgOf(tipStep) }]} />
        </div>
      )}
      {live && (
        <span aria-live="polite" style={srOnly}>
          {tip ? `${columnsFull[tip.c]} ${tip.r.label} ${tip.r.sub}, ${series} ${tip.r.values[tip.c] > 0 ? formatWon(tip.r.values[tip.c]) : '없음'}` : ''}
        </span>
      )}
    </div>
  );
}
// 한 줄의 칸들 — 격자(display: contents)
function RowCells({ children }: { children: ReactNode }) {
  return <div style={{ display: 'contents' }}>{children}</div>;
}

// ── 차트 상자의 머리 — 표로 보기(숨긴 표 · 펼친 표) ─────────
export function ChartDataTableView({ look, mode = 'auto', caption, columns, rows, hidden = true }: { look: ChartLook; mode?: ViewMode; caption: string; columns: string[]; rows: string[][]; hidden?: boolean }) {
  const t = look.legendList;
  const line = dcv(look.grid.color, mode);
  const sty: CSSProperties = hidden ? srOnly : { width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: t.type.fontFamily, fontSize: t.type.fontSize, lineHeight: '20px', color: dcv(t.fg, mode) };
  return (
    <table style={sty}>
      <caption style={srOnly}>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={c} scope="col" style={{ textAlign: i === 0 ? 'left' : 'right', fontWeight: 500, paddingTop: 10, paddingBottom: 10, paddingLeft: i === 0 ? 0 : 16, paddingRight: 0, borderBottom: `1px solid ${line}` }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            {r.map((v, i) =>
              i === 0 ? (
                <th key={i} scope="row" style={{ textAlign: 'left', fontWeight: 400, paddingTop: 12, paddingBottom: 12, paddingLeft: 0, paddingRight: 0, borderBottom: `1px solid ${line}` }}>
                  {v}
                </th>
              ) : (
                <td key={i} style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 0, borderBottom: `1px solid ${line}` }}>
                  {v}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

