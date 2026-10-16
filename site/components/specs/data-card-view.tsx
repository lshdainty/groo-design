'use client';
// 스펙대로 그린 Card — CardLook(card.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 멈춘 그림, live 면 실제로 호버 · 누름 · 키보드 포커스에 반응한다(누르는 카드 · 머리 동작).
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다. 순자산 카드의 끝 색은 모드마다 다른 토큰이라 .pdat 가 고른다.
// 인라인 스타일은 단축 속성(padding)과 개별 속성을 섞지 않는다 — 링크로 들어올 때 값이 지워진다(PR #154).
import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { pressRatio, splitVars, sv, type CardLook, type CardPress, type CardState, type CardStatSize, type DeltaDir, type ViewMode } from './data-shared';
import { dcv } from './display-shared';

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
export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };
const pad = (t: number, r: number, b: number, l: number): CSSProperties => ({ paddingTop: t, paddingRight: r, paddingBottom: b, paddingLeft: l });

// 그림 표시(Anatomy · 치수) — 부위마다 칠 · 번호
export type CardPart = 'root' | 'header' | 'title' | 'action' | 'content' | 'list';
export type CardMarks = Partial<Record<CardPart, CSSProperties>>;
export type CardPins = Partial<Record<CardPart, ReactNode>>;

// 누름 · 호버 · 포커스를 스스로 쥐는 손잡이 — 멈춘 그림이면 state 를 그대로
function usePress(live: boolean, frozen?: CardState) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const state: CardState = frozen ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled');
  const focused = frozen === 'focused' || (live && ring);
  const handlers = live
    ? {
        onPointerEnter: (e: { pointerType: string }) => e.pointerType === 'mouse' && setHover(true),
        onPointerLeave: () => (setHover(false), setPress(false)),
        onPointerDown: () => setPress(true),
        onPointerUp: () => setPress(false),
        onPointerCancel: () => setPress(false),
        onFocus: (e: { currentTarget: HTMLElement }) => setRing(e.currentTarget.matches(':focus-visible')),
        onBlur: () => (setRing(false), setPress(false)),
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) setPress(true);
        },
        onKeyUp: () => setPress(false),
      }
    : {};
  return { state, focused, handlers };
}

// ── 카드 면 ────────────────────────────────────────────────
export type CardSurfaceProps = {
  look: CardLook;
  mode?: ViewMode;
  press?: CardPress;
  body?: 'content' | 'list' | 'accordion';
  state?: CardState;
  live?: boolean;
  label?: string;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
  marks?: CardMarks;
  pins?: CardPins;
  style?: CSSProperties;
  // 나쁜 예 — 그림자 · 위로 뜨기 · 여백 16 처럼 스펙에 없는 모양을 덧칠할 때
  override?: CSSProperties;
};

export function CardSurface({ look, mode = 'auto', press = 'none', body = 'content', state: frozen, live = false, label, onClick, width = '100%', height, children, marks, pins, style, override }: CardSurfaceProps) {
  const s = look.surface;
  const clickable = press !== 'none';
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const reduce = useReducedMotion();
  const { state, focused, handlers } = usePress(live && clickable, clickable ? frozen : undefined);
  // 멈춘 누름 그림도 실제 크기로 배율을 셈한다
  useEffect(() => {
    const el = ref.current;
    if (el && frozen === 'pressed') setSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, [frozen]);
  const pressed = state === 'pressed';
  const tinted = clickable && (state === 'hovered' || pressed);
  const shrink = press === 'whole' && pressed && !reduce;
  const ratio = shrink ? pressRatio(look.press, size?.w ?? (typeof width === 'number' ? width : 320), size?.h ?? 120) : 1;
  const padding = body === 'list' ? pad(0, 0, look.list.padBottom, 0) : body === 'accordion' ? pad(0, 0, look.accordion.padBottom, 0) : pad(s.pad, s.pad, s.pad, s.pad);
  const role = clickable && live ? 'button' : undefined;
  return (
    <div
      ref={ref}
      role={role}
      aria-label={role ? label : undefined}
      tabIndex={clickable && live ? 0 : undefined}
      onClick={clickable && live ? onClick : undefined}
      onPointerDown={() => {
        if (!clickable || !live) return;
        // 누름 배율은 누르는 순간 잰다 — 기준 길이 max(높이, 폭 ÷ n, 최소)
        const el = ref.current;
        if (el) setSize({ w: el.offsetWidth, h: el.offsetHeight });
        handlers.onPointerDown?.();
      }}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onKeyDown={(e) => {
        handlers.onKeyDown?.(e);
        if (clickable && live && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if (!e.repeat) onClick?.();
        }
      }}
      onKeyUp={handlers.onKeyUp}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width,
        height,
        ...padding,
        background: dcv(tinted ? s.pressBg : s.bg, mode),
        borderWidth: s.borderW,
        borderStyle: 'solid',
        borderColor: dcv(s.border, mode),
        borderRadius: s.radius,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : undefined,
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'background-color, transform',
        transitionDuration: `${look.press.motion.duration}, ${look.press.motion.duration}`,
        transitionTimingFunction: `${look.press.motion.easing}, ${look.press.motion.easing}`,
        outline: focused ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
        outlineOffset: look.ring.offset,
        userSelect: clickable ? 'none' : undefined,
        WebkitTapHighlightColor: 'transparent',
        textAlign: 'left',
        ...marks?.root,
        ...style,
        ...override,
      }}
    >
      {pins?.root}
      {children}
    </div>
  );
}

// ── 머리 ──────────────────────────────────────────────────
// 목록 카드(list)는 머리가 제 여백(위 24 · 좌우 24 · 아래 4)을 갖고, 글 카드는 카드 여백 안에서 아래 8 만
export function CardHeaderView({ look, mode = 'auto', title, action, body = 'content', heading = 'h3', live = false, actionState, actionHit = false, marks, pins, onAction }: { look: CardLook; mode?: ViewMode; title: string; action?: string; body?: 'content' | 'list' | 'accordion'; heading?: 'h2' | 'h3' | 'span'; live?: boolean; actionState?: CardState; actionHit?: boolean; marks?: CardMarks; pins?: CardPins; onAction?: () => void }) {
  const h = look.header;
  const ac = look.accordion.header;
  const box = body === 'list' ? pad(h.list.top, h.list.x, h.list.bottom, h.list.x) : body === 'accordion' ? pad(ac.top, ac.x, ac.bottom, ac.x) : pad(0, 0, h.padBottom, 0);
  const T = heading;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: h.gap, ...box, ...marks?.header }}>
      {pins?.header}
      <T style={{ position: 'relative', marginTop: 0, marginBottom: 0, fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: dcv(look.title.fg, mode), minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...marks?.title }}>
        {pins?.title}
        {title}
      </T>
      {action && <CardActionView look={look} mode={mode} label={action} title={title} live={live} state={actionState} marks={marks} pins={pins} showHit={actionHit} onClick={onAction} />}
    </div>
  );
}

// 머리 동작 — 글 버튼(SEED Text Button): 보이는 상자 36 · 누르는 영역 44, 이름 "{제목} {글}"
export function CardActionView({ look, mode = 'auto', label, title, live = false, state: frozen, marks, pins, showHit = false, onClick }: { look: CardLook; mode?: ViewMode; label: string; title?: string; live?: boolean; state?: CardState; marks?: CardMarks; pins?: CardPins; showHit?: boolean; onClick?: () => void }) {
  const a = look.action;
  const ref = useRef<HTMLButtonElement>(null);
  const [w, setW] = useState(88);
  const reduce = useReducedMotion();
  const { state, focused, handlers } = usePress(live, frozen);
  const tinted = state === 'hovered' || state === 'pressed';
  const ratio = state === 'pressed' && !reduce ? pressRatio(a.press, w, a.h) : 1;
  const ext = (a.touch - a.h) / 2;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={title ? `${title} ${label}` : label}
      tabIndex={live ? 0 : -1}
      onClick={live ? onClick : undefined}
      onPointerDown={() => {
        if (ref.current) setW(ref.current.offsetWidth);
        handlers.onPointerDown?.();
      }}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onKeyDown={handlers.onKeyDown}
      onKeyUp={handlers.onKeyUp}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        height: a.h,
        // 줄 끝 글 버튼 — 오른쪽 여백만큼 바깥으로 내어 글자 끝이 카드 여백에 선다(card.yaml headerAction.paddingRight 비고)
        marginRight: -a.padR,
        boxSizing: 'border-box',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: a.padL,
        paddingRight: a.padR,
        borderWidth: 0,
        borderRadius: a.radius,
        background: tinted ? dcv(a.bg, mode) : 'transparent',
        color: dcv(a.fg, mode),
        fontFamily: a.type.fontFamily,
        fontSize: a.type.fontSize,
        lineHeight: a.type.lineHeight,
        fontWeight: a.type.fontWeight,
        cursor: live ? 'pointer' : 'default',
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'background-color, transform',
        transitionDuration: `${a.press.motion.duration}, ${a.press.motion.duration}`,
        transitionTimingFunction: `${a.press.motion.easing}, ${a.press.motion.easing}`,
        outline: focused ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
        outlineOffset: look.ring.offset,
        WebkitTapHighlightColor: 'transparent',
        ...marks?.action,
      }}
    >
      {/* 누르는 영역 44 — 보이는 36 위아래로 4 씩, 옆은 글 폭(44 보다 좁으면 44) */}
      <span aria-hidden style={{ position: 'absolute', top: -ext, bottom: -ext, left: 0, right: 0, minWidth: a.touch, ...(showHit ? { background: 'rgba(236, 72, 153, 0.18)', outline: '1px dashed #DB2777', outlineOffset: -1 } : {}) }} />
      {pins?.action}
      <span style={{ position: 'relative' }}>{label}</span>
    </button>
  );
}

// ── 지표 · 증감 ────────────────────────────────────────────
export type DeltaSpec = { direction: DeltaDir; value: string; text: string; srText?: string };
// 값 앞의 부호(+ · − · ±)는 뗀다 — 방향은 화살표가 말한다("+12%" 가 아니라 "▲ 12%", card.md Delta)
export const unsigned = (v: string) => v.replace(/^[+\-−±]\s*/, '');
// 보조 기술이 읽는 문장 — 기본 "{text} {value} 늘었어요 · 줄었어요", 그대로면 "{text} 변화가 없어요". 화살표는 숨긴다
export const deltaSentence = (d: DeltaSpec) => d.srText ?? (d.direction === 'flat' ? `${d.text} 변화가 없어요` : `${d.text} ${unsigned(d.value)} ${d.direction === 'up' ? '늘었어요' : '줄었어요'}`);

export function DeltaView({ look, mode = 'auto', delta, onHero = false, marks, style }: { look: CardLook; mode?: ViewMode; delta: DeltaSpec; onHero?: boolean; marks?: { value?: CSSProperties; text?: CSSProperties }; style?: CSSProperties }) {
  const d = look.stat.delta;
  const t = look.stat.deltaText;
  const white = onHero ? dcv(look.hero.fg, mode) : undefined;
  const c = white ?? dcv(d.colors[delta.direction], mode);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: t.gap, fontFamily: d.type.fontFamily, whiteSpace: 'nowrap', ...style }}>
      <span aria-hidden style={{ fontSize: d.type.fontSize, lineHeight: d.type.lineHeight, fontWeight: d.type.fontWeight, fontVariantNumeric: 'tabular-nums', color: c, ...marks?.value }}>
        {delta.direction === 'flat' ? '변화 없음' : `${delta.direction === 'up' ? '▲' : '▼'} ${unsigned(delta.value)}`}
      </span>
      {delta.direction !== 'flat' && (
        <span aria-hidden style={{ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight, color: white ?? dcv(t.fg, mode), ...marks?.text }}>
          {delta.text}
        </span>
      )}
      <span style={srOnly}>{deltaSentence(delta)}</span>
    </span>
  );
}

// 금액 — 쉼표 뒤에서만 줄을 바꾼다(card.yaml statValue · heroAmount lineBreak, 2026-10-17 03-D 결정 2 B). 금액 글을 만드는 쪽이 쉼표 뒤마다
// <wbr> 을 넣는다 — 글자가 아니라 읽는 이름 · 복사에 남지 않는다. 묶음 하나가 칸보다 길 때만 v114 의 칸 끝 끊기가 남는다
export function commaBreaks(v: string): ReactNode {
  const parts = v.split(',');
  return parts.map((p, i) => (
    <Fragment key={i}>
      {p}
      {i < parts.length - 1 && (
        <>
          ,<wbr />
        </>
      )}
    </Fragment>
  ));
}
const AMOUNT_BREAK: CSSProperties = { whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'keep-all', maxWidth: '100%' };

export function StatView({ look, mode = 'auto', label, value, size = 'large', delta, marks }: { look: CardLook; mode?: ViewMode; label: string; value: string; size?: CardStatSize; delta?: DeltaSpec; marks?: { label?: CSSProperties; value?: CSSProperties; delta?: CSSProperties } }) {
  const st = look.stat;
  const v = st.value.sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
      <span style={{ fontFamily: st.label.fontFamily, fontSize: st.label.fontSize, lineHeight: st.label.lineHeight, fontWeight: st.label.fontWeight, color: dcv(st.label.fg, mode), ...marks?.label }}>{label}</span>
      <span style={{ marginTop: st.value.marginTop, fontFamily: v.fontFamily, fontSize: v.fontSize, lineHeight: v.lineHeight, fontWeight: st.value.weight, color: dcv(st.value.fg, mode), fontVariantNumeric: 'tabular-nums', ...AMOUNT_BREAK, ...marks?.value }}>{commaBreaks(value)}</span>
      {delta && <DeltaView look={look} mode={mode} delta={delta} style={{ marginTop: st.delta.marginTop, ...marks?.delta }} />}
    </div>
  );
}

// ── 순자산 카드(hero) ──────────────────────────────────────
export type HeroPart = 'root' | 'glow' | 'label' | 'amount' | 'detail';
// press="whole" — 누르면 2px 거리 축소만 한다. 브랜드 채움 그라디언트에는 누름 색 짝이 없어 면 색은 그대로다(card.md 누름 · SEED Feedback)
// labelEnd — 라벨 줄 오른쪽(순자산 카드의 금액 가리기 눈 — Toggle 이 아니라 상자 · 색만 빌린 설정으로 가는 버튼, 흰 아이콘). 상자 40 은 라벨 줄 높이 안에서 위아래로 넘치고(줄을 밀지 않는다), 오른쪽은 카드 머리 간격만큼 당긴다
export function HeroCardView({ look, mode = 'auto', label, amount, delta, detail, width = '100%', press = 'none', state: frozen, live = false, onClick, marks, pins, override, labelEnd }: { look: CardLook; mode?: ViewMode; label: string; amount: string; delta?: DeltaSpec; detail?: string; width?: number | string; press?: 'none' | 'whole'; state?: CardState; live?: boolean; onClick?: () => void; marks?: Partial<Record<HeroPart, CSSProperties>>; pins?: Partial<Record<HeroPart, ReactNode>>; override?: { end?: string; radius?: number; deltaColor?: 'direction'; dimText?: boolean }; labelEnd?: ReactNode }) {
  const h = look.hero;
  const end = splitVars(mode, [{ slot: 't', c: h.end }]);
  const endColor = override?.end ?? sv(h.end, mode, 't');
  const white = dcv(h.fg, mode);
  const g = h.glow;
  const clickable = press === 'whole';
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const reduce = useReducedMotion();
  const { state, focused, handlers } = usePress(live && clickable, clickable ? frozen : undefined);
  useEffect(() => {
    const el = ref.current;
    if (el && frozen === 'pressed') setSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, [frozen]);
  const ratio = clickable && state === 'pressed' && !reduce ? pressRatio(look.press, size?.w ?? (typeof width === 'number' ? width : 320), size?.h ?? 140) : 1;
  const role = clickable && live ? 'button' : undefined;
  return (
    <div
      ref={ref}
      className={end.className}
      data-mode={end['data-mode']}
      role={role}
      aria-label={role ? `${label} ${amount}` : undefined}
      tabIndex={role ? 0 : undefined}
      onClick={role ? onClick : undefined}
      onPointerDown={() => {
        if (!role) return;
        const el = ref.current;
        if (el) setSize({ w: el.offsetWidth, h: el.offsetHeight });
        handlers.onPointerDown?.();
      }}
      onPointerEnter={handlers.onPointerEnter}
      onPointerLeave={handlers.onPointerLeave}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerCancel}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onKeyDown={(e) => {
        handlers.onKeyDown?.(e);
        if (role && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          if (!e.repeat) onClick?.();
        }
      }}
      onKeyUp={handlers.onKeyUp}
      style={{
        ...end.style,
        position: 'relative',
        boxSizing: 'border-box',
        width,
        ...pad(h.pad, h.pad, h.pad, h.pad),
        borderRadius: override?.radius ?? h.radius,
        overflow: 'hidden',
        background: `linear-gradient(${h.angle}deg, ${dcv(h.start, mode)}, ${endColor})`,
        color: white,
        isolation: 'isolate',
        cursor: clickable ? 'pointer' : undefined,
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'transform',
        transitionDuration: look.press.motion.duration,
        transitionTimingFunction: look.press.motion.easing,
        outline: focused ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
        outlineOffset: look.ring.offset,
        userSelect: clickable ? 'none' : undefined,
        WebkitTapHighlightColor: 'transparent',
        ...marks?.root,
      }}
    >
      {pins?.root}
      {/* 장식 빛 — 오른쪽 위, 카드 밖으로 나간 부분은 모서리가 자른다. 보조 기술에 숨긴다 */}
      <span aria-hidden style={{ position: 'absolute', right: g.right, top: g.top, width: g.size, height: g.size, borderRadius: 9999, background: `radial-gradient(circle, ${g.color} 0%, transparent ${g.stop}%)`, pointerEvents: 'none', zIndex: -1, ...marks?.glow }} />
      {pins?.glow}
      <div style={{ position: 'relative', display: labelEnd ? 'flex' : undefined, alignItems: labelEnd ? 'center' : undefined, justifyContent: labelEnd ? 'space-between' : undefined, columnGap: labelEnd ? look.header.gap : undefined, fontFamily: h.label.fontFamily, fontSize: h.label.fontSize, lineHeight: h.label.lineHeight, fontWeight: h.label.fontWeight, opacity: override?.dimText ? 0.72 : undefined, ...marks?.label }}>
        {pins?.label}
        <span style={{ minWidth: 0 }}>{label}</span>
        {labelEnd && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, height: h.label.lineHeight, marginRight: -look.header.gap }}>{labelEnd}</span>}
      </div>
      <div style={{ position: 'relative', marginTop: h.amount.marginTop, fontFamily: h.amount.fontFamily, fontSize: h.amount.fontSize, lineHeight: h.amount.lineHeight, fontWeight: h.amount.fontWeight, fontVariantNumeric: 'tabular-nums', ...AMOUNT_BREAK, ...marks?.amount }}>
        {pins?.amount}
        {commaBreaks(amount)}
      </div>
      {(delta || detail) && (
        <div style={{ position: 'relative', marginTop: h.detail.marginTop, fontFamily: h.detail.fontFamily, fontSize: h.detail.fontSize, lineHeight: h.detail.lineHeight, fontWeight: h.detail.fontWeight, opacity: override?.dimText ? 0.78 : undefined, ...marks?.detail }}>
          {pins?.detail}
          {delta ? (
            override?.deltaColor === 'direction' ? (
              <DeltaView look={look} mode={mode} delta={delta} />
            ) : (
              <DeltaView look={look} mode={mode} delta={delta} onHero />
            )
          ) : (
            detail
          )}
        </div>
      )}
    </div>
  );
}
