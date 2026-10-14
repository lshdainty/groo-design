'use client';
// 스펙대로 그린 Accordion · Collapsible — AccLook · ColLook(accordion · collapsible.yaml 을 푼 값)만 받아 그린다.
// 트리거는 두 층이다 — 바탕 층(누름 · 호버 바탕, 좌우 들임 + 모서리 · 줄지 않는다)과 콘텐츠 층(앞 아이콘 · 본문 · 꺾쇠, 누르면 이 층만 준다).
// state 를 주면 그 상태로 멈춘 그림, live 면 실제로 호버 · 누름 · 키보드 포커스에 반응하고 눌러서 펼치고 접는다(높이 300ms · 모션 줄이기면 150ms 서서히).
// 멈춘 그림은 머리말을 div 로 그리고 초점을 받지 않는다(문서의 머리말 차례를 어지럽히지 않게) — 살아 있는 그림만 h3 > button 이다.
// 인라인 스타일은 단축 속성(padding)과 개별 속성을 섞지 않는다 — 링크로 들어올 때 값이 지워진다(PR #154).
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Armchair, Bus, ChevronDown, ChevronsDownUp, ChevronsUpDown, Clapperboard, Coffee, CreditCard, Fuel, Globe, ShoppingBag, Stethoscope, Store, Tv, Smartphone, type LucideIcon } from 'lucide-react';
import { useReducedMotion } from './data-card-view';
import { icv, pressRatio, type AccIcon, type AccItem, type AccLook, type TriggerMarks, type ColLook, type ColSurface, type IColor, type TriggerLook, type TriggerState, type ViewMode } from './collapse-shared';

export { useReducedMotion };
export type { AccIcon, AccItem, TriggerMarks } from './collapse-shared';
const ACC_ICONS: Record<AccIcon, LucideIcon> = { pay: CreditCard, coffee: Coffee, bus: Bus, phone: Smartphone, store: Store, film: Clapperboard, fuel: Fuel, globe: Globe, shop: ShoppingBag, clinic: Stethoscope, tv: Tv, lounge: Armchair };

const pad = (t: number, r: number, b: number, l: number): CSSProperties => ({ paddingTop: t, paddingRight: r, paddingBottom: b, paddingLeft: l });
const ms = (v: string) => parseFloat(v);


// ── 펼친 내용 ─────────────────────────────────────────────
// 접히면 그리지 않는다(hidden — 보조 기술도 읽지 않는다). 펼칠 때 높이 0fr → 1fr, 모션 줄이기면 높이는 바로 · 불투명도만 서서히
export function PanelView({
  look,
  open,
  live,
  reduce,
  id,
  labelledBy,
  children,
  style,
  innerStyle,
}: {
  look: TriggerLook;
  open: boolean;
  live: boolean;
  reduce?: boolean;
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}) {
  const sysReduce = useReducedMotion();
  const red = reduce ?? sysReduce;
  const [inDom, setInDom] = useState(open);
  const [full, setFull] = useState(open);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!live) {
      setInDom(open);
      setFull(open);
      return;
    }
    if (open) {
      setInDom(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setFull(true))));
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setFull(false);
    const t = window.setTimeout(() => setInDom(false), ms(red ? look.motion.reduced.duration : look.motion.height.duration));
    return () => window.clearTimeout(t);
  }, [open, live, red, look.motion.height.duration, look.motion.reduced.duration]);
  const h = look.motion.height;
  const r = look.motion.reduced;
  return (
    <div
      id={id}
      aria-labelledby={labelledBy}
      hidden={!inDom}
      data-panel-open={open ? 'true' : 'false'}
      style={{
        display: inDom ? 'grid' : 'none',
        gridTemplateRows: red || full ? '1fr' : '0fr',
        opacity: red ? (full ? 1 : 0) : 1,
        transitionProperty: red ? 'opacity' : 'grid-template-rows',
        transitionDuration: red ? r.duration : h.duration,
        transitionTimingFunction: red ? r.easing : h.easing,
        ...style,
      }}
    >
      <div style={{ minHeight: 0, overflow: 'hidden' }}>
        <div style={innerStyle}>{children}</div>
      </div>
    </div>
  );
}

// ── 트리거 ────────────────────────────────────────────────
export type TriggerViewProps = {
  look: TriggerLook;
  mode?: ViewMode;
  title: ReactNode;
  description?: ReactNode;
  icon?: AccIcon;
  open?: boolean;
  // 멈춘 그림 — 그 상태로
  state?: TriggerState;
  live?: boolean;
  disabled?: boolean;
  // 상세가 없는 항목 — 그냥 줄(단추 · 머리말 · 꺾쇠 없음, 바탕도 생기지 않는다)
  plain?: boolean;
  ringRadius?: number;
  // 놓인 면의 누름 짝(경고 상자) — 없으면 bg-layer-default-pressed
  pressBg?: IColor;
  padX?: number;
  headingLevel?: number;
  triggerId?: string;
  panelId?: string;
  reduce?: boolean;
  onToggle?: () => void;
  onNav?: (to: 'next' | 'prev' | 'first' | 'last') => void;
  // 초점이 들어오고 나갈 때(화면 읽기 글)
  onFocusChange?: (focused: boolean) => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
  marks?: TriggerMarks;
  decor?: ReactNode;
  // 누르는 영역 표시(Anatomy)
  showHit?: boolean;
};

export function TriggerView({
  look,
  mode = 'auto',
  title,
  description,
  icon,
  open = false,
  state: frozen,
  live = false,
  disabled = false,
  plain = false,
  ringRadius,
  pressBg,
  padX,
  headingLevel,
  triggerId,
  panelId,
  reduce,
  onToggle,
  onNav,
  onFocusChange,
  buttonRef,
  marks,
  decor,
  showHit = false,
}: TriggerViewProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const boxRef = useRef<HTMLElement | null>(null);
  const sysReduce = useReducedMotion();
  const red = reduce ?? sysReduce;
  const isLive = live && !frozen && !plain;
  const off = disabled || frozen === 'disabled';
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const shown: TriggerState = off ? 'disabled' : (frozen ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled'));
  const focused = !plain && (shown === 'focused' || (isLive && ring && !off));
  const tinted = !plain && (shown === 'hovered' || shown === 'pressed');
  const pressed = !plain && shown === 'pressed';
  const desc = description !== undefined && description !== null && description !== '';
  const h0 = desc ? look.minHDesc : look.minH;
  const ratio = pressed && !red ? pressRatio(look.content.press, size?.w ?? 342, size?.h ?? h0) : 1;
  const px = padX ?? look.padX;
  const fg = (c: IColor) => icv(c, mode);
  const Icon = icon ? ACC_ICONS[icon] : null;
  const rot = open ? look.chevron.openRotate : 0;
  const content = (
    <span
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: look.content.gap,
        boxSizing: 'border-box',
        minHeight: h0,
        ...pad(look.padY, px, look.padY, px),
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'transform',
        transitionDuration: look.content.press.motion.duration,
        transitionTimingFunction: look.content.press.motion.easing,
        ...marks?.content,
      }}
    >
      {Icon && (
        <span aria-hidden style={{ display: 'flex', flexShrink: 0, color: fg(off ? look.prefixIcon.disabled : look.prefixIcon.color), ...marks?.prefix }}>
          <Icon size={look.prefixIcon.size} strokeWidth={2} />
        </span>
      )}
      <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: 'column', gap: look.body.gap, ...marks?.body }}>
        <span style={{ fontFamily: look.title.fontFamily, fontSize: look.title.fontSize, lineHeight: look.title.lineHeight, fontWeight: look.title.fontWeight, color: fg(off ? look.title.disabled : look.title.fg), ...marks?.title }}>{title}</span>
        {desc && <span style={{ fontFamily: look.description.fontFamily, fontSize: look.description.fontSize, lineHeight: look.description.lineHeight, fontWeight: look.description.fontWeight, color: fg(off ? look.description.disabled : look.description.fg), ...marks?.description }}>{description}</span>}
      </span>
      {!plain && (
        <span
          aria-hidden
          style={{
            display: 'flex',
            flexShrink: 0,
            color: fg(off ? look.chevron.disabled : look.chevron.color),
            transform: `rotate(${rot}deg)`,
            transitionProperty: 'transform',
            transitionDuration: red ? '0ms' : look.chevron.motion.duration,
            transitionTimingFunction: look.chevron.motion.easing,
            ...marks?.chevron,
          }}
        >
          <ChevronDown size={look.chevron.size} strokeWidth={2} />
        </span>
      )}
    </span>
  );
  const bgLayer = !plain && (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: tinted ? look.bg.insetX : 0,
        right: tinted ? look.bg.insetX : 0,
        borderRadius: tinted ? look.bg.radius : 0,
        background: tinted ? fg(pressBg ?? look.bg.color) : 'transparent',
        transitionProperty: 'background-color, left, right, border-radius',
        transitionDuration: look.bg.motion.duration,
        transitionTimingFunction: look.bg.motion.easing,
        pointerEvents: 'none',
        ...marks?.bg,
      }}
    />
  );
  const ringLayer = focused && (
    <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: ringRadius ?? look.ring.radius, outline: `${look.ring.width}px solid ${fg(look.ring.color)}`, outlineOffset: look.ring.offset, pointerEvents: 'none' }} />
  );
  const hit = showHit && <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'rgba(236, 72, 153, 0.18)', outline: '1px dashed #DB2777', outlineOffset: -1, pointerEvents: 'none' }} />;

  if (plain)
    return (
      <div ref={(el) => void (boxRef.current = el)} style={{ position: 'relative', textAlign: 'left', ...marks?.trigger }}>
        {content}
        {decor}
      </div>
    );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isLive || off) return;
    if (e.key === ' ' || e.key === 'Enter') {
      if (!e.repeat) setPress(true);
      return;
    }
    const to = e.key === 'ArrowDown' ? 'next' : e.key === 'ArrowUp' ? 'prev' : e.key === 'Home' ? 'first' : e.key === 'End' ? 'last' : null;
    if (to && onNav) {
      e.preventDefault();
      onNav(to);
    }
  };
  const button = (
    <button
      ref={(el) => {
        boxRef.current = el;
        buttonRef?.(el);
      }}
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={panelId}
      disabled={live ? off : undefined}
      aria-disabled={!live && off ? true : undefined}
      tabIndex={isLive ? undefined : -1}
      onClick={isLive && !off ? onToggle : undefined}
      onPointerEnter={isLive ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
      onPointerLeave={isLive ? () => (setHover(false), setPress(false)) : undefined}
      onPointerDown={isLive && !off ? () => setPress(true) : undefined}
      onPointerUp={isLive ? () => setPress(false) : undefined}
      onPointerCancel={isLive ? () => setPress(false) : undefined}
      onKeyDown={onKeyDown}
      onKeyUp={isLive ? () => setPress(false) : undefined}
      onFocus={isLive ? (e) => (setRing(e.currentTarget.matches(':focus-visible')), onFocusChange?.(true)) : undefined}
      onBlur={isLive ? () => (setRing(false), setPress(false), onFocusChange?.(false)) : undefined}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        margin: 0,
        ...pad(0, 0, 0, 0),
        borderWidth: 0,
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        textAlign: 'left',
        cursor: off ? look.disabledCursor : isLive ? look.cursor : 'default',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        ...marks?.trigger,
      }}
    >
      {bgLayer}
      {content}
      {ringLayer}
      {hit}
      {decor}
    </button>
  );
  const level = headingLevel ?? look.heading;
  const H = (live ? `h${level}` : 'div') as 'h3';
  return (
    <H data-heading={`h${level}`} style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }}>
      {button}
    </H>
  );
}

// ── Accordion ─────────────────────────────────────────────
export type AccordionViewProps = {
  look: AccLook;
  mode?: ViewMode;
  variant?: 'inline' | 'separated';
  items: AccItem[];
  // 펼친 항목 — 주면 밖에서 쥐고(onOpenChange), 안 주면 스스로 쥔다(defaultOpen)
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (ids: string[]) => void;
  live?: boolean;
  reduce?: boolean;
  headingLevel?: number;
  id?: string;
  width?: number | string;
  style?: CSSProperties;
  // 펼친 내용의 글을 다른 글로(표 · 목록) — 주면 detail 대신
  renderDetail?: (item: AccItem) => ReactNode;
  // 초점이 간 항목(화면 읽기 글) — 나가면 null
  onFocusItem?: (id: string | null) => void;
  // 그림 표시
  dividerMark?: CSSProperties;
  itemStyle?: CSSProperties;
};

export function AccordionView({ look, mode = 'auto', variant = 'inline', items, open: openProp, defaultOpen = [], onOpenChange, live = false, reduce, headingLevel, id, width = '100%', style, renderDetail, onFocusItem, dividerMark, itemStyle }: AccordionViewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [own, setOwn] = useState<string[]>(defaultOpen);
  const open = openProp ?? own;
  const setOpen = useCallback(
    (ids: string[]) => {
      setOwn(ids);
      onOpenChange?.(ids);
    },
    [onOpenChange],
  );
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const triggers = items.filter((it) => it.detail !== null && it.detail !== undefined && it.detail !== '' && !it.disabled);
  const nav = (from: string, to: 'next' | 'prev' | 'first' | 'last') => {
    const ids = triggers.map((t) => t.id);
    if (!ids.length) return;
    const i = ids.indexOf(from);
    const j = to === 'first' ? 0 : to === 'last' ? ids.length - 1 : to === 'next' ? (i + 1) % ids.length : (i - 1 + ids.length) % ids.length;
    refs.current.get(ids[j])?.focus();
  };
  const sep = variant === 'separated';
  const fg = (c: IColor) => icv(c, mode);
  const t = look.panelText;
  return (
    <div
      id={id}
      data-accordion={variant}
      style={{ display: 'flex', flexDirection: 'column', gap: sep ? look.separated.gap : 0, width, boxSizing: 'border-box', fontFamily: look.title.fontFamily, ...style }}
    >
      {items.map((it, i) => {
        const has = it.detail !== null && it.detail !== undefined && it.detail !== '';
        const isOpen = has && open.includes(it.id);
        const tid = `acc-t-${uid}-${it.id}`;
        const pid = `acc-p-${uid}-${it.id}`;
        return (
          <div
            key={it.id}
            data-acc-item={it.id}
            style={{
              position: 'relative',
              ...(sep ? { borderWidth: look.separated.borderW, borderStyle: 'solid', borderColor: fg(look.separated.border), borderRadius: look.separated.radius, overflow: 'hidden' } : {}),
              ...itemStyle,
            }}
          >
            {!sep && i > 0 && <div aria-hidden style={{ height: look.divider.height, marginLeft: look.divider.marginX, marginRight: look.divider.marginX, background: fg(look.divider.color), ...dividerMark }} />}
            <TriggerView
              look={look}
              mode={mode}
              title={it.title}
              description={it.description}
              icon={it.icon}
              open={isOpen}
              state={it.state}
              live={live}
              disabled={it.disabled}
              plain={!has}
              ringRadius={sep ? look.separated.ringRadius : undefined}
              headingLevel={headingLevel}
              triggerId={tid}
              panelId={pid}
              reduce={reduce}
              onToggle={() => setOpen(isOpen ? open.filter((x) => x !== it.id) : [...open, it.id])}
              onNav={(to) => nav(it.id, to)}
              onFocusChange={(f) => onFocusItem?.(f ? it.id : null)}
              buttonRef={(el) => {
                if (el) refs.current.set(it.id, el);
                else refs.current.delete(it.id);
              }}
              marks={it.marks}
              decor={it.decor}
            />
            {has && (
              <PanelView look={look} open={isOpen} live={live} reduce={reduce} id={pid}>
                <div
                  style={{
                    ...pad(look.panel.padTop, look.panel.padX, look.panel.padBottom, look.panel.padX),
                    fontFamily: t.fontFamily,
                    fontSize: t.fontSize,
                    lineHeight: t.lineHeight,
                    fontWeight: t.fontWeight,
                    color: fg(t.fg),
                    whiteSpace: 'pre-line',
                  }}
                >
                  {renderDetail ? renderDetail(it) : it.detail}
                </div>
              </PanelView>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 모두 펼치기 ───────────────────────────────────────────
// 글 단추 — 보이는 32 · 누르는 44(위아래로 6 씩). 모두 펼쳐져 있으면 "모두 접기"
export function ExpandAllView({
  look,
  mode = 'auto',
  allOpen,
  live = false,
  state: frozen,
  controls,
  onClick,
  showHit = false,
  style,
}: {
  look: AccLook;
  mode?: ViewMode;
  allOpen: boolean;
  live?: boolean;
  state?: 'enabled' | 'hovered' | 'pressed' | 'focused';
  controls?: string;
  onClick?: () => void;
  showHit?: boolean;
  style?: CSSProperties;
}) {
  const a = look.expandAll;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [w, setW] = useState(96);
  const ref = useRef<HTMLButtonElement>(null);
  const red = useReducedMotion();
  useEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth);
  }, [allOpen]);
  const st = frozen ?? (press ? 'pressed' : hover ? 'hovered' : 'enabled');
  const tinted = st === 'hovered' || st === 'pressed';
  const focused = st === 'focused' || (live && ring);
  const ratio = st === 'pressed' && !red ? pressRatio(a.press, w, a.h) : 1;
  const Icon = allOpen ? ChevronsDownUp : ChevronsUpDown;
  const ext = (a.touch - a.h) / 2;
  return (
    <button
      ref={ref}
      type="button"
      aria-controls={controls}
      tabIndex={live ? undefined : -1}
      onClick={live ? onClick : undefined}
      onPointerEnter={live ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
      onPointerLeave={live ? () => (setHover(false), setPress(false)) : undefined}
      onPointerDown={live ? () => setPress(true) : undefined}
      onPointerUp={live ? () => setPress(false) : undefined}
      onPointerCancel={live ? () => setPress(false) : undefined}
      onKeyDown={live ? (e) => (e.key === 'Enter' || e.key === ' ') && !e.repeat && setPress(true) : undefined}
      onKeyUp={live ? () => setPress(false) : undefined}
      onFocus={live ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={live ? () => (setRing(false), setPress(false)) : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: a.gap,
        height: a.h,
        boxSizing: 'border-box',
        ...pad(0, a.padR, 0, a.padL),
        margin: 0,
        borderWidth: 0,
        borderRadius: a.radius,
        background: tinted ? icv(a.bg, mode) : 'transparent',
        color: icv(a.fg, mode),
        fontFamily: a.type.fontFamily,
        fontSize: a.type.fontSize,
        lineHeight: a.type.lineHeight,
        fontWeight: a.type.fontWeight,
        cursor: live ? 'pointer' : 'default',
        transform: ratio !== 1 ? `scale(${ratio})` : undefined,
        transitionProperty: 'background-color, transform',
        transitionDuration: `${a.motion.duration}, ${a.press.motion.duration}`,
        transitionTimingFunction: `${a.motion.easing}, ${a.press.motion.easing}`,
        outline: focused ? `${a.ring.width}px solid ${icv(a.ring.color, mode)}` : 'none',
        outlineOffset: a.ring.offset,
        WebkitTapHighlightColor: 'transparent',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {/* 누르는 영역 44 — 보이는 32 위아래로 6 씩 */}
      <span aria-hidden style={{ position: 'absolute', top: -ext, bottom: -ext, left: 0, right: 0, ...(showHit ? { background: 'rgba(236, 72, 153, 0.18)', outline: '1px dashed #DB2777', outlineOffset: -1 } : {}) }} />
      <span style={{ position: 'relative' }}>{allOpen ? a.labels.collapse : a.labels.expand}</span>
      <Icon aria-hidden size={a.icon} strokeWidth={2} style={{ position: 'relative', flexShrink: 0 }} />
    </button>
  );
}

// 시트 · 대화상자의 목록 머리 — 제목(건수) + 오른쪽 모두 펼치기
export function AccHeaderView({ look, mode = 'auto', title, children, live = false, titleId, style }: { look: AccLook; mode?: ViewMode; title: string; children?: ReactNode; live?: boolean; titleId?: string; style?: CSSProperties }) {
  const h = look.header;
  const T = (live ? 'h2' : 'div') as 'h2';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: h.gap, minHeight: h.minH, marginBottom: h.marginBottom, ...style }}>
      <T id={titleId} style={{ margin: 0, minWidth: 0, fontFamily: h.title.fontFamily, fontSize: h.title.fontSize, lineHeight: h.title.lineHeight, fontWeight: h.title.fontWeight, color: icv(h.title.fg, mode) }}>
        {title}
      </T>
      {children}
    </div>
  );
}


// ── Collapsible ───────────────────────────────────────────
export type CollapsibleViewProps = {
  look: ColLook;
  mode?: ViewMode;
  surface?: ColSurface;
  layout?: 'text' | 'rows';
  title: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  live?: boolean;
  state?: TriggerState;
  disabled?: boolean;
  reduce?: boolean;
  headingLevel?: number;
  children?: ReactNode;
  width?: number | string;
  style?: CSSProperties;
  marks?: TriggerMarks & { panel?: CSSProperties; root?: CSSProperties; divider?: CSSProperties };
  decor?: ReactNode;
  showHit?: boolean;
  onFocusChange?: (focused: boolean) => void;
};

// surface card 면 이 컴포넌트가 Card 면을 그린다. warning 은 경고 상자 안의 맨 아래 줄(위 선 · 좌우 16) — 상자는 WarningBoxView 가 그린다
export function CollapsibleView({ look, mode = 'auto', surface = 'default', layout = 'text', title, description, open: openProp, defaultOpen = false, onOpenChange, live = false, state, disabled = false, reduce, headingLevel, children, width = '100%', style, marks, decor, showHit, onFocusChange }: CollapsibleViewProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const fg = (c: IColor) => icv(c, mode);
  const card = surface === 'card';
  const warn = surface === 'warning';
  const padX = warn ? look.warning.padX : look.padX;
  const padBottom = card ? look.card.panelPadBottom : layout === 'rows' ? look.rowsPadBottom : look.panel.padBottom;
  const tid = `col-t-${uid}`;
  const pid = `col-p-${uid}`;
  return (
    <div
      data-collapsible={surface}
      style={{
        position: 'relative',
        width,
        boxSizing: 'border-box',
        fontFamily: look.title.fontFamily,
        ...(card ? { background: fg(look.card.bg), borderWidth: look.card.borderW, borderStyle: 'solid', borderColor: fg(look.card.border), borderRadius: look.card.radius, overflow: 'hidden' } : {}),
        ...marks?.root,
        ...style,
      }}
    >
      {warn && <div aria-hidden style={{ height: look.warning.divider.height, background: fg(look.warning.divider.color), ...marks?.divider }} />}
      <TriggerView
        look={look}
        mode={mode}
        title={title}
        description={description}
        open={open}
        state={state}
        live={live}
        disabled={disabled}
        ringRadius={card ? look.card.ringRadius : warn ? look.warning.ringRadius : undefined}
        pressBg={warn ? look.warning.pressBg : undefined}
        padX={padX}
        headingLevel={headingLevel}
        triggerId={tid}
        panelId={pid}
        reduce={reduce}
        onToggle={() => {
          setOwn(!open);
          onOpenChange?.(!open);
        }}
        marks={marks}
        decor={decor}
        showHit={showHit}
        onFocusChange={onFocusChange}
      />
      <PanelView look={look} open={open} live={live} reduce={reduce} id={pid}>
        <div style={{ ...pad(look.panel.padTop, padX, padBottom, padX), ...marks?.panel }}>{children}</div>
      </PanelView>
    </div>
  );
}

// 경고 상자 — 바탕 · 테두리 · 모서리 12 · 경고 글 여백(위 14 · 좌우 16 · 아래 12), 맨 아래 줄이 Collapsible(surface warning)
export function WarningBoxView({ look, mode = 'auto', message, children, style }: { look: ColLook; mode?: ViewMode; message: ReactNode; children: ReactNode; style?: CSSProperties }) {
  const b = look.warning.box;
  return (
    <div style={{ background: icv(b.bg, mode), borderWidth: b.borderW, borderStyle: 'solid', borderColor: icv(b.border, mode), borderRadius: b.radius, overflow: 'hidden', ...style }}>
      <div style={pad(b.padTop, b.padX, b.padBottom, b.padX)}>{message}</div>
      {children}
    </div>
  );
}
