'use client';
// 스펙대로 그린 사이드바(Side Navigation)와 옆 패널(Side Panel) — NavKit(nav-look)의 side · panel 값만 받아 그린다.
// 사이드바: 머리(마크 · 이름 · 접기 버튼) · 내용(묶음 · 항목 · 하위 항목 — 넘치면 이 안에서만 스크롤, 머리 아래 선 · 아래 끝 흐림) · 바닥.
// 접히면(56) 이름은 보이지 않게만 남고, 하위가 없는 항목은 이름 말풍선(Help Bubble 툴팁), 부모는 옆 펼침 메뉴(Menu 표면)다.
// live 면 실제로 접고 · 펼치고 · 마우스를 올리면(200ms) 말풍선 · 펼침 메뉴가 뜨고(떠나면 100ms) 키보드로도 연다.
// live 가 아니면 멈춘 그림 — states 로 항목마다 상태를, tip · flyout 으로 뜬 것을 정한다(자리는 접힌 칸 높이로 셈한다).
// 인라인 스타일은 늘 긴 이름(paddingTop …)으로 쓴다(사이트 #154).
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent as RFocusEvent, type HTMLAttributes, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import type { BubbleLook } from './menu-shared';
import { BubbleView } from './menu-view';
import { OvCloseButton, useReducedMotion, type CloseState } from './overlay-view';
import { fogMaskStyle } from './overlay-shared';
import { collapsedTop, FONT, ncv, nsv, parentOf, pressRatio, srOnly, textOf, toMs, type NColor, type SideGroup, type SideItem, type SideNavLook, type SidePanelLook, type ViewMode } from './nav-shared';
import { NavGlyph, useFocusRing, usePress } from './nav-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
export type SideState = 'hovered' | 'pressed' | 'focused' | 'disabled';
export type SidePart = 'root' | 'header' | 'logo' | 'trigger' | 'content' | 'group' | 'groupLabel' | 'item' | 'icon' | 'label' | 'chevron' | 'sub' | 'footer' | 'flyout' | 'tooltip' | 'divider' | 'fog';
export type SideZone = Partial<Record<SidePart, CSSProperties>>;
const resetBox: CSSProperties = { marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0, borderWidth: 0, borderStyle: 'none', background: 'transparent', color: 'inherit', textAlign: 'left', WebkitTapHighlightColor: 'transparent' };

// 서비스 마크 — 브랜드 채움 둥근 사각(그림 장식 — 실제 로고가 아니다)
export function ServiceMark({ size, color, mode = 'auto' }: { size: number; color: NColor; mode?: ViewMode }) {
  return <span aria-hidden style={{ display: 'block', flexShrink: 0, width: size, height: size, borderRadius: Math.round(size * 0.3), background: ncv(color, mode) }} />;
}

export type SideNavProps = {
  look: SideNavLook;
  bubble: BubbleLook;
  mode?: ViewMode;
  logo: string;
  brand: NColor;
  groups: SideGroup[];
  current?: string;
  collapsed?: boolean;
  // 펼친 부모(값) — 주지 않으면 지금 화면의 부모만
  open?: string[];
  height?: number | string;
  width?: number;
  // 내용이 위 끝에서 떨어졌는지 · 얼마나(멈춘 그림)
  scrollTop?: number;
  states?: Partial<Record<string, SideState>>;
  triggerState?: 'hovered' | 'pressed' | 'focused';
  // 멈춘 그림 — 말풍선이 뜬 항목 · 펼침 메뉴가 열린 부모(접혔을 때) · 그 메뉴 줄의 상태
  tip?: string;
  flyout?: string;
  flyoutStates?: Partial<Record<string, 'hovered' | 'pressed' | 'focused'>>;
  footer?: ReactNode;
  // 서랍(Side Panel 본문) — 머리 · 바닥 · 면 · 선 없이 내용만, 펼친 모양
  drawer?: boolean;
  live?: boolean;
  onCollapse?: (next: boolean) => void;
  onNavigate?: (value: string) => void;
  zone?: SideZone;
  pins?: Partial<Record<SidePart, ReactNode>>;
  // 부위 칠 · 핀을 이 항목에만(Anatomy)
  markItem?: string;
  markSub?: string;
  style?: CSSProperties;
};

export function SideNav(props: SideNavProps) {
  const { look, bubble, mode = 'auto', logo, brand, groups, current, collapsed = false, open, height = '100%', width, scrollTop = 0, states, triggerState, tip, flyout, flyoutStates, footer, drawer = false, live = false, onCollapse, onNavigate, zone, pins, markItem, markSub, style } = props;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const parentOfCurrent = current ? parentOf(groups, current)?.value : undefined;
  const [openSet, setOpenSet] = useState<string[]>(open ?? (parentOfCurrent ? [parentOfCurrent] : []));
  useEffect(() => {
    if (open) setOpenSet(open);
  }, [open]);
  useEffect(() => {
    // 하위가 지금 화면이면 부모는 저절로 펼친다
    if (live && parentOfCurrent) setOpenSet((s) => (s.includes(parentOfCurrent) ? s : [...s, parentOfCurrent]));
  }, [live, parentOfCurrent]);
  const [scrolled, setScrolled] = useState(scrollTop > 0);
  const [liveTip, setLiveTip] = useState<{ value: string; top: number; height: number } | null>(null);
  const [liveFly, setLiveFly] = useState<{ value: string; top: number; focus: boolean } | null>(null);
  const timers = useRef<{ open?: number; close?: number }>({});
  const W = width ?? (drawer ? undefined : collapsed ? look.collapsedWidth : look.width);
  const C = look.content;
  const col = collapsed && !drawer;

  const clearTimers = () => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
  };
  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    if (!col) {
      setLiveTip(null);
      setLiveFly(null);
    }
  }, [col]);
  // 바깥을 누르면 펼침 메뉴를 닫는다
  useEffect(() => {
    if (!live || !liveFly) return;
    const away = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setLiveFly(null);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [live, liveFly]);

  const place = (el: HTMLElement) => {
    const r = rootRef.current?.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    return { top: r ? b.top - r.top : el.offsetTop, height: b.height };
  };
  const hoverIn = (it: SideItem, el: HTMLElement) => {
    if (!live || !col) return;
    clearTimers();
    const pos = place(el);
    if (it.children?.length) {
      const run = () => {
        setLiveTip(null);
        setLiveFly({ value: it.value, top: pos.top, focus: false });
      };
      // 다른 펼침 메뉴가 열려 있으면 바로
      if (liveFly) run();
      else timers.current.open = window.setTimeout(run, look.flyout.openDelay);
    } else {
      timers.current.open = window.setTimeout(() => {
        setLiveFly(null);
        setLiveTip({ value: it.value, top: pos.top, height: pos.height });
      }, look.tooltip.openDelay);
    }
  };
  const hoverOut = () => {
    if (!live || !col) return;
    window.clearTimeout(timers.current.open);
    timers.current.close = window.setTimeout(() => {
      setLiveTip(null);
      setLiveFly(null);
    }, Math.max(look.tooltip.closeDelay, look.flyout.closeDelay));
  };
  const keepOpen = () => window.clearTimeout(timers.current.close);

  const tipValue = live ? liveTip?.value : tip;
  const flyValue = live ? liveFly?.value : flyout;
  const tipTop = live ? (liveTip?.top ?? 0) : tip ? collapsedTop(look, groups, tip) : 0;
  const flyTop = live ? (liveFly?.top ?? 0) : flyout ? collapsedTop(look, groups, flyout) : 0;
  const allItems = groups.flatMap((g) => g.items);
  const tipItem = allItems.find((i) => i.value === tipValue);
  const flyItem = allItems.find((i) => i.value === flyValue);
  const itemRight = C.padX + look.item.widthCollapsed;

  const onScroll = () => setScrolled((contentRef.current?.scrollTop ?? 0) > 0);
  const toggleOpen = (v: string) => setOpenSet((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const root: CSSProperties = drawer
    ? { position: 'relative', display: 'flex', flexDirection: 'column', fontFamily: FONT, ...style }
    : {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: W,
        height,
        flexShrink: 0,
        background: ncv(look.bg, mode),
        boxShadow: `inset -${look.border.width}px 0 0 ${ncv(look.border.color, mode)}`,
        fontFamily: FONT,
        transition: reduce ? 'none' : `width ${look.motion.duration} ${look.motion.easing}`,
        ...zone?.root,
        ...style,
      };
  const fog = drawer ? {} : fogMaskStyle(look.fog.mask, { bottom: look.fog.bottom });
  return (
    <div ref={rootRef} data-nav-side={col ? 'collapsed' : 'expanded'} style={root}>
      {pins?.root}
      {!drawer && (
        <SideHeader look={look} mode={mode} logo={logo} brand={brand} collapsed={col} scrolled={live ? scrolled : scrollTop > 0} live={live} triggerState={triggerState} onToggle={() => onCollapse?.(!col)} zone={zone} pins={pins} />
      )}
      <div
        ref={contentRef}
        onScroll={live ? onScroll : undefined}
        style={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'hidden',
          overflowY: live && !drawer ? 'auto' : 'hidden',
          scrollPaddingTop: C.scrollTop,
          scrollPaddingBottom: C.scrollBottom,
          ...fog,
          ...zone?.content,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: col ? C.gapCollapsed : C.gap,
            paddingTop: C.padTop,
            paddingLeft: C.padX,
            paddingRight: C.padX,
            paddingBottom: drawer ? 0 : C.padBottom,
            transform: !live && scrollTop ? `translateY(${-scrollTop}px)` : 'none',
          }}
        >
          {groups.map((g, gi) => (
            <div key={gi} role={live ? 'group' : undefined} aria-label={live ? g.label : undefined} style={{ position: 'relative', display: 'flex', flexDirection: 'column', ...(gi === 0 ? zone?.group : undefined) }}>
              {gi === 0 && pins?.group}
              {col && gi > 0 && <span aria-hidden style={{ display: 'block', height: look.groupDivider.h, marginTop: look.groupDivider.marginY, marginBottom: look.groupDivider.marginY, marginLeft: look.groupDivider.marginX, marginRight: look.groupDivider.marginX, background: ncv(look.groupDivider.color, mode), ...zone?.divider }} />}
              {g.label && (
                <span style={col ? srOnly : { position: 'relative', display: 'block', paddingTop: look.group.pad, paddingBottom: look.group.pad, paddingLeft: look.group.pad, paddingRight: look.group.pad, ...textOf({ ...look.group.type, fontWeight: look.group.weight }, ncv(look.group.fg, mode)), wordBreak: 'keep-all', overflowWrap: 'break-word', ...(gi === 0 ? zone?.groupLabel : undefined) }}>
                  {g.label}
                  {gi === 0 && !col && pins?.groupLabel}
                </span>
              )}
              {g.items.map((it) => {
                const isOpen = openSet.includes(it.value);
                const childCurrent = !!it.children?.some((s) => s.value === current);
                const isCurrent = it.value === current || (col && childCurrent);
                const marks = markItem === it.value;
                return (
                  <div key={it.value} style={{ display: 'flex', flexDirection: 'column' }}>
                    <SideItemRow
                      look={look}
                      mode={mode}
                      item={it}
                      collapsed={col}
                      current={isCurrent}
                      open={isOpen}
                      live={live}
                      state={it.disabled ? 'disabled' : states?.[it.value]}
                      flyoutOpen={flyValue === it.value}
                      onActivate={() => {
                        if (it.children?.length) {
                          if (col) {
                            const el = rootRef.current?.querySelector<HTMLElement>(`[data-side-item="${it.value}"]`);
                            setLiveTip(null);
                            setLiveFly((f) => (f?.value === it.value ? null : { value: it.value, top: el ? place(el).top : 0, focus: false }));
                          } else toggleOpen(it.value);
                        } else onNavigate?.(it.value);
                      }}
                      onKeyOpen={() => {
                        if (!col || !it.children?.length) return false;
                        const el = rootRef.current?.querySelector<HTMLElement>(`[data-side-item="${it.value}"]`);
                        clearTimers();
                        setLiveTip(null);
                        setLiveFly({ value: it.value, top: el ? place(el).top : 0, focus: true });
                        return true;
                      }}
                      onHover={(el) => hoverIn(it, el)}
                      onLeave={hoverOut}
                      onFocusTip={(el) => {
                        // 키보드 초점이면 바로 말풍선
                        if (!live || !col || it.children?.length || !el.matches(':focus-visible')) return;
                        clearTimers();
                        setLiveTip({ value: it.value, ...place(el) });
                      }}
                      onBlurTip={() => live && setLiveTip((t) => (t?.value === it.value ? null : t))}
                      zone={marks ? zone : undefined}
                      pins={marks ? pins : undefined}
                    />
                    {it.children && !col && (
                      <div
                        id={`side-sub-${it.value}`}
                        style={{
                          display: 'grid',
                          // 모션 줄이기면 높이는 바로 바뀌고 하위만 서서히 나타나고 사라진다(side-navigation.yaml 하위 펼침 — v104)
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          opacity: isOpen ? 1 : 0,
                          // 접을 때는 서서히 사라진 뒤에 높이를 거둔다(높이 칸의 전환을 사라지는 시간만큼 늦춘다)
                          transition: reduce
                            ? `opacity ${look.sub.reduce.duration} ${look.sub.reduce.easing}${isOpen ? '' : `, grid-template-rows 0ms linear ${look.sub.reduce.duration}`}`
                            : `grid-template-rows ${look.sub.motion.duration} ${look.sub.motion.easing}, opacity ${look.sub.motion.duration} ${look.sub.motion.easing}`,
                        }}
                      >
                        <div style={{ minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          {it.children.map((s) => (
                            <SideSubRow
                              key={s.value}
                              look={look}
                              mode={mode}
                              label={s.label}
                              current={s.value === current}
                              live={live && isOpen}
                              state={s.disabled ? 'disabled' : states?.[s.value]}
                              onActivate={() => onNavigate?.(s.value)}
                              zone={markSub === s.value ? zone : undefined}
                              pin={markSub === s.value ? pins?.sub : undefined}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {pins?.content}
        {pins?.fog}
      </div>
      {footer && !drawer && (
        <div style={{ position: 'relative', flexShrink: 0, paddingTop: look.footer.pad, paddingBottom: look.footer.pad, paddingLeft: look.footer.pad, paddingRight: look.footer.pad, ...zone?.footer }}>
          {footer}
          {pins?.footer}
        </div>
      )}
      {col && tipItem && (
        <span
          role={live ? 'tooltip' : undefined}
          onPointerEnter={keepOpen}
          onPointerLeave={hoverOut}
          style={{ position: 'absolute', left: itemRight + bubble.bodyOffset, top: tipTop + look.item.minH / 2, transform: 'translateY(-50%)', zIndex: look.flyout.z + 10, ...zone?.tooltip }}
        >
          <BubbleView look={bubble} mode={mode} title={tipItem.label} side="right" />
          {pins?.tooltip}
        </span>
      )}
      {col && flyItem?.children && (
        <SideFlyout
          look={look}
          mode={mode}
          parent={flyItem}
          current={current}
          left={itemRight + look.flyout.offset}
          top={flyTop}
          live={live}
          focusFirst={!!liveFly?.focus}
          states={flyoutStates}
          onEnter={keepOpen}
          onLeave={hoverOut}
          onClose={(back) => {
            setLiveFly(null);
            if (back) rootRef.current?.querySelector<HTMLElement>(`[data-side-item="${flyItem.value}"]`)?.focus();
          }}
          onNavigate={(v) => {
            setLiveFly(null);
            onNavigate?.(v);
          }}
          zone={zone?.flyout}
          pin={pins?.flyout}
        />
      )}
    </div>
  );
}

function SideHeader({ look, mode, logo, brand, collapsed, scrolled, live, triggerState, onToggle, zone, pins }: { look: SideNavLook; mode: ViewMode; logo: string; brand: NColor; collapsed: boolean; scrolled: boolean; live: boolean; triggerState?: 'hovered' | 'pressed' | 'focused'; onToggle: () => void; zone?: SideZone; pins?: Partial<Record<SidePart, ReactNode>> }) {
  const H = look.header;
  const L = look.logo;
  const T = look.trigger;
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const shown = live ? (p.press ? 'pressed' : p.hover ? 'hovered' : undefined) : triggerState;
  const focused = live ? f.ring : triggerState === 'focused';
  const scale = shown === 'pressed' && !reduce ? pressRatio({ distance: look.press.distance, widthDivisor: look.press.widthDivisor, minBasis: look.press.minBasis }, T.size, T.size) : 1;
  const grow = (T.touch - T.size) / 2;
  const visible: CSSProperties = {
    position: 'absolute',
    left: grow,
    top: grow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: T.size,
    height: T.size,
    boxSizing: 'border-box',
    borderRadius: T.radius,
    background: shown === 'pressed' ? ncv(T.pressBg, mode) : shown === 'hovered' ? ncv(T.hoverBg, mode) : 'transparent',
    color: ncv(T.fg, mode),
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transition: `background-color ${look.divider.motion.duration} ${look.divider.motion.easing}, transform ${look.press.motion.duration} ${look.press.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.trigger,
  };
  const box: CSSProperties = {
    ...resetBox,
    position: 'absolute',
    top: T.top - grow,
    right: (collapsed ? T.rightCollapsed : T.right) - grow,
    width: T.touch,
    height: T.touch,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    cursor: live ? 'pointer' : undefined,
    transition: reduce ? 'none' : `right ${look.motion.duration} ${look.motion.easing}`,
  };
  const glyph = (
    <span style={visible}>
      <NavGlyph name="panel-left" size={T.icon} />
      {pins?.trigger}
    </span>
  );
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        minHeight: H.minH,
        paddingTop: H.pad,
        paddingBottom: H.pad,
        paddingLeft: H.pad,
        paddingRight: H.pad,
        boxShadow: `inset 0 -${look.divider.h}px 0 ${scrolled ? ncv(look.divider.color, mode) : 'transparent'}, inset -${look.border.width}px 0 0 ${ncv(look.border.color, mode)}`,
        transition: `box-shadow ${look.divider.motion.duration} ${look.divider.motion.easing}`,
        ...zone?.header,
      }}
    >
      {pins?.header}
      {!collapsed && (
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', columnGap: L.gap, marginLeft: L.marginLeft, minWidth: 0, ...textOf({ ...L.type, fontWeight: L.weight }, ncv(L.fg, mode)), whiteSpace: 'nowrap', ...zone?.logo }}>
          <ServiceMark size={L.size} color={brand} mode={mode} />
          {logo}
          {pins?.logo}
        </span>
      )}
      {live ? (
        <button type="button" aria-label="사이드바" aria-expanded={!collapsed} style={box} className="outline-none" onClick={onToggle} onFocus={f.onFocus} onBlur={f.onBlur} {...p.handlers}>
          {glyph}
        </button>
      ) : (
        <span aria-hidden style={box}>
          {glyph}
        </span>
      )}
    </div>
  );
}

function SideItemRow({ look, mode, item, collapsed, current, open, live, state, flyoutOpen, onActivate, onKeyOpen, onHover, onLeave, onFocusTip, onBlurTip, zone, pins }: { look: SideNavLook; mode: ViewMode; item: SideItem; collapsed: boolean; current: boolean; open: boolean; live: boolean; state?: SideState; flyoutOpen: boolean; onActivate: () => void; onKeyOpen: () => boolean; onHover: (el: HTMLElement) => void; onLeave: () => void; onFocusTip: (el: HTMLElement) => void; onBlurTip: () => void; zone?: SideZone; pins?: Partial<Record<SidePart, ReactNode>> }) {
  const p = usePress();
  const f = useFocusRing();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [w, setW] = useState(0);
  const I = look.item;
  const disabled = state === 'disabled' || !!item.disabled;
  const shown: SideState | undefined = live ? (disabled ? 'disabled' : p.press ? 'pressed' : p.hover || flyoutOpen ? 'hovered' : undefined) : state;
  const focused = live ? f.ring && !disabled : state === 'focused';
  useIsoLayoutEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth);
  }, [collapsed]);
  const bg = current ? ncv(I.currentBg, mode) : shown === 'pressed' ? ncv(I.pressBg, mode) : shown === 'hovered' ? ncv(I.hoverBg, mode) : 'transparent';
  const iconFg = disabled ? look.icon.disabledFg : current ? look.icon.currentFg : look.icon.fg;
  const labelFg = disabled ? look.label.disabledFg : current ? look.label.currentFg : look.label.fg;
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, Math.max(0, (w || (collapsed ? I.widthCollapsed : 200)) - I.padX * 2), look.label.padY * 2 + parseFloat(look.label.type.lineHeight)) : 1;
  const parent = !!item.children?.length;
  const style: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    columnGap: I.gap,
    boxSizing: 'border-box',
    width: collapsed ? I.widthCollapsed : '100%',
    minHeight: I.minH,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: collapsed ? I.padXCollapsed : I.padX,
    paddingRight: collapsed ? I.padXCollapsed : I.padX,
    borderRadius: I.radius,
    background: bg,
    textDecoration: 'none',
    cursor: live ? (disabled ? 'not-allowed' : 'pointer') : undefined,
    transition: `background-color ${look.divider.motion.duration} ${look.divider.motion.easing}`,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.item,
  };
  const inner = (
    <>
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', columnGap: I.gap, flex: '1 1 auto', minWidth: 0, transform: scale === 1 ? 'none' : `scale(${scale})`, transformOrigin: 'left center', transition: `transform ${look.press.motion.duration} ${look.press.motion.easing}` }}>
        <span style={{ position: 'relative', display: 'block', flexShrink: 0, ...zone?.icon }}>
          <NavGlyph name={item.icon} size={look.icon.size} color={ncv(iconFg, mode)} />
          {pins?.icon}
        </span>
        <span
          style={
            collapsed
              ? srOnly
              : { position: 'relative', flex: '1 1 auto', minWidth: 0, paddingTop: look.label.padY, paddingBottom: look.label.padY, ...textOf({ ...look.label.type, fontWeight: look.label.weight }, ncv(labelFg, mode)), wordBreak: 'keep-all', overflowWrap: 'break-word', ...zone?.label }
          }
        >
          {item.label}
          {!collapsed && pins?.label}
        </span>
      </span>
      {parent && !collapsed && (
        <span style={{ position: 'relative', display: 'block', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: reduce ? 'none' : `transform ${look.chevron.motion.duration} ${look.chevron.motion.easing}`, ...zone?.chevron }}>
          <NavGlyph name="chevron-down" size={look.chevron.size} color={ncv(look.chevron.fg, mode)} />
          {pins?.chevron}
        </span>
      )}
      {pins?.item}
    </>
  );
  if (!live)
    return (
      <span ref={ref} aria-hidden data-side-item={item.value} style={style}>
        {inner}
      </span>
    );
  const common = {
    'data-side-item': item.value,
    style,
    className: 'outline-none',
    onFocus: (e: RFocusEvent<HTMLElement>) => {
      f.onFocus(e);
      onFocusTip(e.currentTarget);
    },
    onBlur: () => {
      f.onBlur();
      onBlurTip();
    },
    onPointerEnter: (e: RPointerEvent<HTMLElement>) => {
      p.handlers.onPointerEnter(e);
      onHover(e.currentTarget);
    },
    onPointerLeave: () => {
      p.handlers.onPointerLeave();
      onLeave();
    },
    onPointerDown: p.handlers.onPointerDown,
    onPointerUp: p.handlers.onPointerUp,
    onPointerCancel: p.handlers.onPointerCancel,
  };
  if (parent)
    return (
      <button
        ref={(el) => void (ref.current = el)}
        type="button"
        aria-expanded={collapsed ? flyoutOpen : open}
        aria-controls={collapsed ? undefined : `side-sub-${item.value}`}
        aria-label={collapsed ? item.label : undefined}
        {...common}
        onClick={onActivate}
        onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
          if ((e.key === 'Enter' || e.key === ' ') && onKeyOpen()) e.preventDefault();
        }}
      >
        {inner}
      </button>
    );
  return (
    <a
      ref={(el) => void (ref.current = el)}
      href={item.href ?? '#'}
      aria-current={current ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      {...common}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onActivate();
      }}
    >
      {inner}
    </a>
  );
}

function SideSubRow({ look, mode, label, current, live, state, onActivate, zone, pin }: { look: SideNavLook; mode: ViewMode; label: string; current: boolean; live: boolean; state?: SideState; onActivate: () => void; zone?: SideZone; pin?: ReactNode }) {
  const p = usePress();
  const f = useFocusRing();
  const disabled = state === 'disabled';
  const shown = live ? (p.press ? 'pressed' : p.hover ? 'hovered' : undefined) : state;
  const focused = live ? f.ring : state === 'focused';
  const I = look.item;
  const style: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: look.sub.minH,
    paddingTop: look.label.padY,
    paddingBottom: look.label.padY,
    paddingLeft: look.sub.padLeft,
    paddingRight: I.padX,
    borderRadius: I.radius,
    background: current ? ncv(I.currentBg, mode) : shown === 'pressed' ? ncv(I.pressBg, mode) : shown === 'hovered' ? ncv(I.hoverBg, mode) : 'transparent',
    ...textOf({ ...look.label.type, fontWeight: look.label.weight }, ncv(disabled ? look.label.disabledFg : current ? look.label.currentFg : look.label.fg, mode)),
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
    textDecoration: 'none',
    cursor: live ? 'pointer' : undefined,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    ...zone?.sub,
  };
  if (!live)
    return (
      <span aria-hidden style={style}>
        {label}
        {pin}
      </span>
    );
  return (
    <a
      href="#"
      aria-current={current ? 'page' : undefined}
      style={style}
      className="outline-none"
      onClick={(e) => {
        e.preventDefault();
        onActivate();
      }}
      onFocus={f.onFocus}
      onBlur={f.onBlur}
      {...p.handlers}
    >
      {label}
    </a>
  );
}

// 접힌 사이드바의 옆 펼침 메뉴 — Menu 표면 · 폭 200 · 맨 위 부모 이름 · 줄 44 · 지금 화면 줄은 지금 항목과 같은 바탕
function SideFlyout({ look, mode, parent, current, left, top, live, focusFirst, states, onEnter, onLeave, onClose, onNavigate, zone, pin }: { look: SideNavLook; mode: ViewMode; parent: SideItem; current?: string; left: number; top: number; live: boolean; focusFirst: boolean; states?: Partial<Record<string, 'hovered' | 'pressed' | 'focused'>>; onEnter: () => void; onLeave: () => void; onClose: (back: boolean) => void; onNavigate: (v: string) => void; zone?: CSSProperties; pin?: ReactNode }) {
  const Fl = look.flyout;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(!live);
  useEffect(() => {
    if (!live) return;
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [live]);
  useEffect(() => {
    if (live && focusFirst) ref.current?.querySelector<HTMLElement>('a')?.focus();
  }, [live, focusFirst]);
  const labelId = `side-fly-${parent.value}`;
  return (
    <div
      ref={ref}
      role={live ? 'group' : undefined}
      aria-labelledby={live ? labelId : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose(true);
        }
      }}
      onBlur={(e) => {
        if (live && !ref.current?.contains(e.relatedTarget as Node) && !(e.relatedTarget as HTMLElement | null)?.dataset?.sideItem) onClose(false);
      }}
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: Fl.z,
        boxSizing: 'border-box',
        width: Fl.width,
        paddingTop: Fl.padY,
        paddingBottom: Fl.padY,
        borderRadius: Fl.radius,
        background: ncv(Fl.bg, mode),
        boxShadow: nsv(Fl.shadow, mode),
        transformOrigin: 'left top',
        transform: shown || reduce ? 'none' : 'scale(0.95)',
        opacity: shown ? 1 : 0,
        transition: reduce ? 'none' : `transform ${Fl.motion.open.duration} ${Fl.motion.open.easing}, opacity ${Fl.motion.open.duration} ${Fl.motion.open.easing}`,
        ...zone,
      }}
    >
      {pin}
      <div id={labelId} style={{ paddingTop: Fl.label.padY, paddingBottom: Fl.label.padY, paddingLeft: Fl.label.padX, paddingRight: Fl.label.padX, ...textOf({ ...Fl.label.type, fontWeight: Fl.label.weight }, ncv(Fl.label.fg, mode)) }}>{parent.label}</div>
      {parent.children!.map((s) => (
        <FlyoutRow key={s.value} look={look} mode={mode} label={s.label} current={s.value === current} live={live} state={states?.[s.value]} onActivate={() => onNavigate(s.value)} />
      ))}
    </div>
  );
}

function FlyoutRow({ look, mode, label, current, live, state, onActivate }: { look: SideNavLook; mode: ViewMode; label: string; current: boolean; live: boolean; state?: 'hovered' | 'pressed' | 'focused'; onActivate: () => void }) {
  const p = usePress();
  const f = useFocusRing();
  const R = look.flyout.item;
  const shown = live ? (p.press ? 'pressed' : p.hover ? 'hovered' : undefined) : state;
  const focused = live ? f.ring : state === 'focused';
  const pill: CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: R.insetX,
    right: R.insetX,
    borderRadius: R.radius,
    background: current ? ncv(R.currentBg, mode) : shown ? ncv(R.hoverBg, mode) : 'transparent',
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: ncv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
  };
  const style: CSSProperties = {
    ...resetBox,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: R.minH,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: R.padX,
    paddingRight: R.padX,
    ...textOf({ ...R.type, fontWeight: R.weight }, ncv(R.fg, mode)),
    textDecoration: 'none',
    cursor: live ? 'pointer' : undefined,
  };
  const inner = (
    <>
      <span aria-hidden style={pill} />
      <span style={{ position: 'relative' }}>{label}</span>
    </>
  );
  if (!live) return <span style={style}>{inner}</span>;
  return (
    <a
      href="#"
      aria-current={current ? 'page' : undefined}
      style={style}
      className="outline-none"
      onClick={(e) => {
        e.preventDefault();
        onActivate();
      }}
      onFocus={f.onFocus}
      onBlur={f.onBlur}
      {...p.handlers}
    >
      {inner}
    </a>
  );
}

// ── 옆 패널 ─────────────────────────────────────────────
export type PanelPart = 'overlay' | 'root' | 'header' | 'title' | 'description' | 'close' | 'body' | 'footer' | 'divider';
export type PanelZone = Partial<Record<PanelPart, CSSProperties>>;
export type SidePanelViewProps = {
  look: SidePanelLook;
  mode?: ViewMode;
  side?: 'left' | 'right';
  // 폭 — 오른쪽 패널의 크기(480 · 720 · 960) 또는 왼쪽 서랍의 화면 폭 × 0.8 을 부르는 쪽이 정한다
  width: number;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  // 닫기 버튼 — 입력 폼이면 그리지 않는다
  close?: boolean;
  closeState?: CloseState;
  onClose?: () => void;
  scrolled?: boolean;
  fog?: boolean;
  // 본문 좌우 — 왼쪽 서랍은 항목(좌우 8)이 들어와 아이콘이 제목과 같은 자리에 선다
  bodyPadX?: number;
  dim?: boolean;
  // 위 · 아래 안전 영역(그림 속 폰)
  safeTop?: number;
  safeBottom?: number;
  // 움직임 — 열림 정도(0 닫힘 ~ 1 열림)와 끌어 옮긴 거리
  offset?: number;
  open?: boolean;
  bodyRef?: (el: HTMLDivElement | null) => void;
  onBodyScroll?: () => void;
  panelRef?: (el: HTMLDivElement | null) => void;
  panelProps?: HTMLAttributes<HTMLDivElement>;
  zone?: PanelZone;
  pins?: Partial<Record<PanelPart, ReactNode>>;
  live?: boolean;
  onDim?: () => void;
  // 그림이 패널만 잘라 보일 때 — 화면 폭의 80% 상한을 걷는다(패널 폭 그대로)
  alone?: boolean;
};
export function SidePanelView({ look, mode = 'auto', side = 'right', width, title, description, children, footer, close = true, closeState, onClose, scrolled = false, fog = false, bodyPadX, dim = true, safeTop = 0, safeBottom = 0, offset = 0, open = true, bodyRef, onBodyScroll, panelRef, panelProps, zone, pins, live = false, onDim, alone = false }: SidePanelViewProps) {
  const reduce = useReducedMotion();
  const H = look.header;
  const left = side === 'left';
  const dir = left ? -1 : 1;
  const motion = open ? look.motion.open : look.motion.close;
  const dimMotion = open ? look.motion.dimOpen : look.motion.dimClose;
  const fogStyle = fog ? fogMaskStyle(look.fog.mask, { top: look.fog.top, bottom: look.fog.bottom }) : {};
  const padX = bodyPadX ?? (left ? look.body.padXLeft : look.body.padX);
  const closeTarget = Math.max(look.close.target, look.close.size);
  return (
    <>
      {dim && (
        <div
          aria-hidden
          onClick={onDim}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: look.z.dim, background: ncv(look.dim, mode), opacity: open ? 1 : 0, transition: reduce ? `opacity ${look.motion.reduce.duration} linear` : `opacity ${dimMotion.duration} ${dimMotion.easing}`, ...zone?.overlay }}
        >
          {pins?.overlay}
        </div>
      )}
      <div
        ref={panelRef}
        {...panelProps}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: left ? 0 : undefined,
          right: left ? undefined : 0,
          zIndex: look.z.surface,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width,
          maxWidth: alone ? 'none' : `${look.maxRatio * 100}%`,
          paddingBottom: safeBottom,
          background: ncv(look.bg, mode),
          fontFamily: FONT,
          transform: reduce ? 'none' : open ? `translateX(${offset * dir}px)` : `translateX(${dir * 100}%)`,
          opacity: reduce ? (open ? 1 : 0) : 1,
          transition: reduce ? `opacity ${look.motion.reduce.duration} linear` : offset ? 'none' : `transform ${motion.duration} ${motion.easing}`,
          outline: 'none',
          ...zone?.root,
        }}
      >
        {pins?.root}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            rowGap: H.gap,
            flexShrink: 0,
            boxSizing: 'border-box',
            minHeight: H.minH + safeTop,
            paddingTop: H.padTop + safeTop,
            paddingBottom: H.padBottom,
            paddingLeft: H.padX,
            paddingRight: close ? closeTarget : H.padX,
            boxShadow: `inset 0 -${look.divider.h}px 0 ${scrolled ? ncv(look.divider.color, mode) : 'transparent'}`,
            transition: `box-shadow ${look.divider.motion.duration} ${look.divider.motion.easing}`,
            ...zone?.header,
          }}
        >
          {pins?.header}
          <div data-panel-title style={{ position: 'relative', marginTop: 0, marginBottom: 0, ...textOf(look.title, ncv(look.title.color, mode)), ...zone?.title }}>
            {title}
            {pins?.title}
          </div>
          {description && (
            <div style={{ position: 'relative', ...textOf(look.description, ncv(look.description.color, mode)), ...zone?.description }}>
              {description}
              {pins?.description}
            </div>
          )}
          {close && (
            <span style={{ position: 'absolute', top: safeTop, right: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <span style={{ pointerEvents: 'auto' }}>
                <OvCloseButton look={look.close} ring={{ width: look.ring.width, offset: look.ring.offset, color: look.ring.color }} mode={mode} state={live ? undefined : (closeState ?? 'enabled')} onClick={live ? onClose : undefined} marks={zone?.close ? { close: zone.close } : undefined} />
              </span>
              {pins?.close}
            </span>
          )}
        </div>
        <div
          ref={bodyRef}
          onScroll={onBodyScroll}
          tabIndex={live ? -1 : undefined}
          style={{
            position: 'relative',
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: live ? 'auto' : 'hidden',
            overflowX: 'hidden',
            paddingTop: fog ? look.fog.padTop : 0,
            paddingBottom: fog ? look.fog.padBottom : footer ? 0 : look.body.padBottom,
            paddingLeft: padX,
            paddingRight: padX,
            scrollPaddingTop: fog ? look.fog.top : 0,
            scrollPaddingBottom: fog ? look.fog.bottom : 0,
            outline: 'none',
            ...fogStyle,
            ...zone?.body,
          }}
        >
          {children}
          {pins?.body}
        </div>
        {footer && (
          <div style={{ position: 'relative', display: 'flex', justifyContent: look.footer.justify, columnGap: look.footer.gap, flexShrink: 0, paddingTop: look.footer.padTop, paddingBottom: look.footer.padBottom, paddingLeft: look.footer.padX, paddingRight: look.footer.padX, ...zone?.footer }}>
            {footer}
            {pins?.footer}
          </div>
        )}
      </div>
    </>
  );
}

export { toMs };
