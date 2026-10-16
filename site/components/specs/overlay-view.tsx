'use client';
// 시트 · 대화상자 · 확인창 · 팝오버의 판 — OverlayLook(overlay-look 이 bottom-sheet · dialog · alert-dialog · popover.yaml 에서 푼 값)만 받아 그린다.
// 멈춘 그림(닫기 상태 · 스크롤 상태를 준다)과 실제로 여닫는 표면(overlay-live)이 같은 판을 쓴다.
// 판은 자리를 정하지 않는다 — 딤 위 아래쪽(시트) · 가운데(대화상자 · 확인창) · 트리거 옆(팝오버)은 감싸는 쪽이 정한다.
import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { Hand, MousePointer2, X } from 'lucide-react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import { fogMaskStyle, ocv, type AlertLayout, type AlertLook, type DialogLook, type OvClose, type OvColor, type OvFog, type OvHeader, type OvRing, type OvScroll, type OvText, type PopoverLook, type SheetLook, type ViewMode } from './overlay-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// 모션 줄이기면 누름 축소 · 이동 · 확대를 뺀다(색 전환 · 서서히 나타남만)
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

const typeOf = (t: OvText, mode: ViewMode): CSSProperties => ({ margin: 0, fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight, color: ocv(t.color, mode) });

// 그림 속 부위 칠 — Anatomy · 여백 그림이 부위마다 분홍 칠을 얹는다
export type OvPart = 'root' | 'header' | 'title' | 'description' | 'close' | 'closeTarget' | 'body' | 'footer' | 'handle' | 'handleTarget';
export type OvMarks = Partial<Record<OvPart, CSSProperties>>;
// 그림 속 덧그림 — 부위 안(그 부위 기준 absolute)에 핀 · 수치 띠 · 손가락 표시를 얹는다
export type OvDecor = Partial<Record<'root' | 'header' | 'body' | 'footer', ReactNode>>;

// ── 닫기 버튼 ─────────────────────────────────────────────
// 시트는 28 원(바탕 · 아이콘 14), 대화상자 · 팝오버는 52 투명 상자(아이콘 22). 누르는 영역(시트 44 · 상자 52)이 버튼이고 보이는 원 · 상자는 그 가운데다.
export type CloseState = 'enabled' | 'pressed' | 'focused';
export function OvCloseButton({ look, ring, mode = 'auto', state, onClick, marks }: { look: OvClose; ring: OvRing; mode?: ViewMode; state?: CloseState; onClick?: () => void; marks?: OvMarks }) {
  const live = !!onClick && !state;
  const [press, setPress] = useState(false);
  const [focusRing, setFocusRing] = useState(false);
  const reduce = useReducedMotion();
  const shown: CloseState = state ?? (press ? 'pressed' : 'enabled');
  const focused = state === 'focused' || (live && focusRing);
  const circle = look.kind === 'circle';
  // 보이는 원 · 상자의 자리 — 원은 top · right 가 원의 자리, 상자는 아이콘의 자리라 상자가 (상자 − 아이콘) / 2 만큼 바깥으로 나온다
  const inset = circle ? 0 : (look.size - look.icon) / 2;
  const hit = Math.max(look.target, look.size);
  const grow = (hit - look.size) / 2;
  const scale = shown === 'pressed' && !reduce ? look.scale : 1;
  const visible: CSSProperties = {
    position: 'absolute',
    left: grow,
    top: grow,
    width: look.size,
    height: look.size,
    boxSizing: 'border-box',
    borderRadius: look.radius,
    background: shown === 'pressed' ? ocv(look.bgPressed, mode) : look.bg ? ocv(look.bg, mode) : 'transparent',
    display: 'grid',
    placeItems: 'center',
    transform: scale === 1 ? undefined : `scale(${scale})`,
    transition: `background-color ${look.motion.color.duration} ${look.motion.color.easing}, transform ${look.motion.scale.duration} ${look.motion.scale.easing}`,
    outline: focused ? `${ring.width}px solid ${ocv(ring.color, mode)}` : 'none',
    outlineOffset: ring.offset,
    ...marks?.close,
  };
  const box: CSSProperties = {
    position: 'absolute',
    top: look.top - inset - grow,
    right: look.right - inset - grow,
    width: hit,
    height: hit,
    margin: 0,
    padding: 0,
    border: 0,
    background: 'transparent',
    cursor: live ? 'pointer' : undefined,
    WebkitTapHighlightColor: 'transparent',
    zIndex: 1,
    ...marks?.closeTarget,
  };
  const inner = (
    <span style={visible}>
      <X aria-hidden size={look.icon} strokeWidth={circle ? 2.5 : 2} style={{ color: ocv(look.color, mode) }} />
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
      type="button"
      aria-label="닫기"
      style={box}
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      onFocus={(e) => setFocusRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocusRing(false)}
      className="outline-none"
    >
      {inner}
    </button>
  );
}

// ── 머리(제목 · 설명) ─────────────────────────────────────
// divider — 본문이 위로 스크롤되면 머리 아래 1px 선. 머리 아래 끝(= 본문 위 끝)에 그린다 — 본문은 끝 흐림 마스크를 받으므로 본문 안에 그리면 흐림에 지워진다
function Head({ hd, title, description, t, d, mode, close, titleId, descId, marks, decor, divider }: { hd: OvHeader; title: ReactNode; description?: ReactNode; t: OvText; d: OvText; mode: ViewMode; close: boolean; titleId?: string; descId?: string; marks?: OvMarks; decor?: ReactNode; divider?: OvScroll['divider'] & { on: boolean } }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: hd.gap,
        flex: 'none',
        padding: `${hd.padTop}px ${close ? hd.padRightClose : hd.padX}px ${hd.padBottom}px ${hd.padX}px`,
        boxShadow: divider ? (divider.on ? `inset 0 -${divider.height}px 0 ${ocv(divider.color, mode)}` : 'inset 0 0 0 transparent') : undefined,
        transition: divider ? `box-shadow ${divider.motion.duration} ${divider.motion.easing}` : undefined,
        ...marks?.header,
      }}
    >
      <div id={titleId} style={{ ...typeOf(t, mode), ...marks?.title }}>
        {title}
      </div>
      {description && (
        <div id={descId} style={{ ...typeOf(d, mode), ...marks?.description }}>
          {description}
        </div>
      )}
      {decor}
    </div>
  );
}

// 본문 스크롤의 상태 — 위로 스크롤됨(머리 아래 선). 끝 흐림은 상태가 아니라 축이다(fog — 걸면 늘 켜져 있다, 2026-10-03)
export type ScrollState = { scrolled: boolean };

// 실제 본문 — 스크롤 · 크기가 바뀔 때마다 스크롤됨 · 넘침을 잰다. 넘침은 키보드로 스크롤하게 본문에 초점을 줄지만 정한다(흐림과는 상관없다)
export function useBodyScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState({ scrolled: false, overflow: false });
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const overflow = el.scrollHeight > el.clientHeight + 1;
      const scrolled = el.scrollTop > 0;
      setS((p) => (p.overflow === overflow && p.scrolled === scrolled ? p : { overflow, scrolled }));
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    const watch = () => {
      ro.disconnect();
      ro.observe(el);
      for (const c of Array.from(el.children)) ro.observe(c);
    };
    watch();
    // 본문이 바뀌면(길이 · 항목) 다시 잰다
    const mo = new MutationObserver(() => {
      watch();
      measure();
    });
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      el.removeEventListener('scroll', measure);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);
  return { ref, state: s };
}

// 본문 — 위로 스크롤되면 머리 아래 1px 선(안쪽 그림자). 머리가 없으면 선을 그리지 않는다.
// 끝 흐림(fog — 축 scrollFog=on)을 걸면 위 · 아래가 늘 흐리고(gradient-fade-mask 마스크) 본문 안에 그만큼 여백 · 스크롤 여유를 둔다 — 넘쳤는지 재지 않는다.
// 멈춘 그림은 state 와 offset(위로 올린 만큼)을 준다. 여백은 낱낱 속성으로만 쓴다(줄임 속성과 섞지 않는다 — 링크로 들어올 때 지워진다)
function Body({
  scroll,
  fog,
  padX,
  padTop = 0,
  trail = 0,
  hasHead,
  state,
  focusable = false,
  offset = 0,
  live,
  mode,
  bodyRef,
  children,
  mark,
  style,
  decor,
}: {
  scroll?: OvScroll;
  fog?: OvFog;
  padX: number;
  padTop?: number;
  // 바닥이 없을 때 본문 아래 여백(YAML body.paddingBottom — 바닥이 없을 때만)
  trail?: number;
  hasHead: boolean;
  state: ScrollState;
  // 넘쳐서 키보드로 스크롤해야 하면 본문이 초점을 받는다
  focusable?: boolean;
  offset?: number;
  live: boolean;
  mode: ViewMode;
  bodyRef?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
  mark?: CSSProperties;
  style?: CSSProperties;
  decor?: ReactNode;
}) {
  return (
    <div
      ref={bodyRef}
      data-ov-body=""
      data-fog={fog ? '' : undefined}
      tabIndex={live && focusable ? 0 : undefined}
      style={{
        position: 'relative',
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: live ? 'auto' : 'hidden',
        overscrollBehavior: 'contain',
        boxSizing: 'border-box',
        paddingTop: fog ? Math.max(padTop, fog.padTop) : padTop,
        paddingRight: padX,
        paddingBottom: fog ? fog.padBottom : trail,
        paddingLeft: padX,
        scrollPaddingTop: fog ? fog.scrollTop : undefined,
        scrollPaddingBottom: fog ? fog.scrollBottom : undefined,
        ...(fog ? fogMaskStyle(fog.mask, { top: fog.top, bottom: fog.bottom }) : {}),
        outline: 'none',
        ...mark,
        ...style,
      }}
    >
      {offset ? <div style={{ marginTop: -offset }}>{children}</div> : children}
      {decor}
    </div>
  );
}

// ── Bottom Sheet ──────────────────────────────────────────
export type SheetSurfaceProps = {
  look: SheetLook;
  mode?: ViewMode;
  title: ReactNode;
  description?: ReactNode;
  // 닫기 버튼 — 기본 있음(조회 · 고르기 · 시트의 입력 폼 모두)
  close?: boolean;
  closeState?: CloseState;
  onClose?: () => void;
  // 손잡이 — 스냅 높이를 둘 때만
  handle?: boolean;
  onHandle?: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  // 본문 좌우 여백 — 목록은 줄이 화면 여백(24)을 가지므로 빼고 줄 폭 전체로 둔다
  bodyPad?: boolean;
  // 본문 끝 흐림(축 scrollFog) — 넘칠 수 있는 본문(목록 · 긴 폼)에 건다. 걸면 늘 켜져 있다
  fog?: boolean;
  // 본문 위에 붙는 칸 — 스크롤 상자(본문) 밖이라 흐리지 않고 스크롤해도 그 자리다(목록 위 찾기 칸). 좌우 여백은 본문과 같다
  top?: ReactNode;
  // 넘친 본문이 Tab 을 받을지 — 칸이 초점을 받아 스스로 보이게 스크롤되는 격자(roving)는 끈다(Tab 하나)
  bodyTabStop?: boolean;
  // 멈춘 그림 — 본문을 위로 올린 만큼
  offset?: number;
  // 안전 영역(그림 속 기기의 홈 표시줄 · 실제 화면은 env(safe-area-inset-bottom)) — 바닥 아래에 더한다
  safe?: number | string;
  maxHeight?: number | string;
  titleId?: string;
  descId?: string;
  marks?: OvMarks;
  decor?: OvDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
  bodyRef?: (el: HTMLDivElement | null) => void;
  bodyStyle?: CSSProperties;
};

export const SheetSurface = forwardRef<HTMLDivElement, SheetSurfaceProps>(function SheetSurface(
  { look, mode = 'auto', title, description, close = true, closeState, onClose, handle = false, onHandle, footer, children, bodyPad = true, fog = false, top, bodyTabStop = true, offset, safe = 0, maxHeight, titleId, descId, marks, decor, rootProps, style, bodyRef, bodyStyle },
  ref,
) {
  const r = look.radius;
  const hd = look.handle;
  const live = !!onClose || !!rootProps;
  const body = useBodyScroll();
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
        borderRadius: `${r}px ${r}px 0 0`,
        background: ocv(look.bg, mode),
        paddingBottom: safe,
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {handle &&
        (onHandle ? (
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={onHandle}
            style={{ position: 'absolute', left: '50%', top: hd.top + hd.height / 2 - hd.target / 2, width: hd.target, height: hd.target, marginLeft: -hd.target / 2, padding: 0, border: 0, background: 'transparent', cursor: 'pointer', zIndex: 1, ...marks?.handleTarget }}
          >
            <span style={{ position: 'absolute', left: (hd.target - hd.width) / 2, top: hd.target / 2 - hd.height / 2, width: hd.width, height: hd.height, borderRadius: hd.radius, background: ocv(hd.color, mode) }} />
          </button>
        ) : (
          <>
            {marks?.handleTarget && <span aria-hidden style={{ position: 'absolute', left: '50%', top: hd.top + hd.height / 2 - hd.target / 2, width: hd.target, height: hd.target, marginLeft: -hd.target / 2, ...marks.handleTarget }} />}
            <span aria-hidden style={{ position: 'absolute', left: '50%', top: hd.top, width: hd.width, height: hd.height, marginLeft: -hd.width / 2, borderRadius: hd.radius, background: ocv(hd.color, mode), ...marks?.handle }} />
          </>
        ))}
      {close && <OvCloseButton look={look.close} ring={look.ring} mode={mode} state={closeState} onClick={closeState ? undefined : onClose} marks={marks} />}
      <Head hd={look.header} title={title} description={description} t={look.title} d={look.description} mode={mode} close={close} titleId={titleId} descId={descId} marks={marks} decor={decor?.header} />
      {top ? (
        <div data-ov-top="" style={{ position: 'relative', flex: 'none', paddingLeft: bodyPad ? look.body.padX : 0, paddingRight: bodyPad ? look.body.padX : 0 }}>
          {top}
        </div>
      ) : null}
      <Body
        fog={fog ? look.fog : undefined}
        padX={bodyPad ? look.body.padX : 0}
        trail={footer ? 0 : look.body.padBottom}
        hasHead
        state={{ scrolled: false }}
        focusable={bodyTabStop && body.state.overflow}
        offset={offset}
        live={live}
        mode={mode}
        bodyRef={(el) => {
          body.ref.current = live ? el : null;
          bodyRef?.(el);
        }}
        mark={marks?.body}
        style={bodyStyle}
        decor={decor?.body}
      >
        {children}
      </Body>
      {footer && (
        <div style={{ position: 'relative', display: 'flex', gap: look.footer.gap, flex: 'none', padding: `${look.footer.padTop}px ${look.footer.padX}px ${look.footer.padBottom}px`, ...marks?.footer }}>
          {footer}
          {decor?.footer}
        </div>
      )}
      {decor?.root}
    </div>
  );
});

// 바닥 버튼 — 시트는 하나면 폭 전체, 둘이면 반씩(Button large)
export function SheetButtons({ items, mode = 'auto' }: { items: { label: string; look: ButtonLook; onClick?: () => void; state?: 'enabled' | 'pressed' | 'focused' | 'disabled' | 'loading' }[]; mode?: ViewMode }) {
  return (
    <>
      {items.map((b) => (
        <div key={b.label} style={{ flex: '1 1 0', minWidth: 0 }}>
          <ButtonView look={b.look} mode={mode} label={b.label} fill state={b.state ?? (b.onClick ? 'live' : 'enabled')} onClick={b.onClick} />
        </div>
      ))}
    </>
  );
}

// 대화상자 · 팝오버의 바닥 버튼 — 오른쪽으로 모은다(Button small)
export function EndButtons({ items, mode = 'auto' }: { items: { label: string; look: ButtonLook; onClick?: () => void; state?: 'enabled' | 'pressed' | 'focused' | 'disabled' | 'loading' }[]; mode?: ViewMode }) {
  return (
    <>
      {items.map((b) => (
        <ButtonView key={b.label} look={b.look} mode={mode} label={b.label} state={b.state ?? (b.onClick ? 'live' : 'enabled')} onClick={b.onClick} />
      ))}
    </>
  );
}

// ── Dialog ────────────────────────────────────────────────
export type DialogSurfaceProps = {
  look: DialogLook;
  mode?: ViewMode;
  width?: number | string;
  title: ReactNode;
  description?: ReactNode;
  // 닫기 버튼 — 조회 · 안내만. 입력 폼에는 두지 않는다(바닥 취소)
  close?: boolean;
  closeState?: CloseState;
  onClose?: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  maxHeight?: number | string;
  // 멈춘 그림의 본문 스크롤 — 스크롤됨과 위로 올린 만큼. 없으면 실제로 잰다
  scroll?: ScrollState & { offset?: number };
  // 본문 끝 흐림(축 scrollFog) — 넘칠 수 있는 본문(목록 · 긴 폼)에 건다. 걸면 늘 켜져 있다
  fog?: boolean;
  bodyPad?: boolean;
  // 그림 속 열린 목록 · 팝오버가 판 밖으로 나오게(실제로는 body 에 띄운다) — 판 · 본문이 자르지 않는다
  unclipped?: boolean;
  titleId?: string;
  descId?: string;
  marks?: OvMarks;
  decor?: OvDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
};

export const DialogSurface = forwardRef<HTMLDivElement, DialogSurfaceProps>(function DialogSurface(
  { look, mode = 'auto', width, title, description, close = false, closeState, onClose, footer, children, maxHeight, scroll, fog = false, bodyPad = true, unclipped = false, titleId, descId, marks, decor, rootProps, style },
  ref,
) {
  // 판 밖으로 나오는 그림(unclipped)은 멈춘 판이다 — 본문을 재지 않고(흐림 마스크가 밖을 자른다) 자르지도 않는다
  const live = !scroll && !unclipped;
  const body = useBodyScroll();
  const state = scroll ?? (unclipped ? { scrolled: false } : body.state);
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: width ?? look.sizes[look.defaultSize],
        maxWidth: `calc(100% - ${look.marginX * 2}px)`,
        maxHeight,
        borderRadius: look.radius,
        background: ocv(look.bg, mode),
        // 멈춘 그림은 판 밖의 표시(띠 · 핀 · 열린 목록)를 자르지 않는다 — 본문은 스스로 자른다
        overflow: live ? 'hidden' : 'visible',
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {close && <OvCloseButton look={look.close} ring={look.ring} mode={mode} state={closeState} onClick={closeState ? undefined : onClose} marks={marks} />}
      <Head hd={look.header} title={title} description={description} t={look.title} d={look.description} mode={mode} close={close} titleId={titleId} descId={descId} marks={marks} decor={decor?.header} divider={{ ...look.scroll.divider, on: state.scrolled }} />
      <Body
        scroll={look.scroll}
        fog={fog && !unclipped ? look.scroll.fog : undefined}
        padX={bodyPad ? look.body.padX : 0}
        trail={footer ? 0 : look.body.padBottom}
        hasHead
        state={state}
        focusable={live && body.state.overflow}
        offset={scroll?.offset}
        live={live}
        mode={mode}
        bodyRef={live ? (el) => void (body.ref.current = el) : undefined}
        mark={marks?.body}
        decor={decor?.body}
        style={unclipped ? { overflowY: 'visible', zIndex: 1 } : undefined}
      >
        {children}
      </Body>
      {footer && (
        <div style={{ position: 'relative', display: 'flex', justifyContent: look.footer.justify, gap: look.footer.gap, flex: 'none', padding: `${look.footer.padTop}px ${look.footer.padX}px ${look.footer.padBottom}px`, ...marks?.footer }}>
          {footer}
          {decor?.footer}
        </div>
      )}
      {decor?.root}
    </div>
  );
});

// ── Popover ───────────────────────────────────────────────
export type PopoverSurfaceProps = {
  look: PopoverLook;
  mode?: ViewMode;
  // 폭 — 기본은 내용만큼(320 ~ 480). avail 을 주면 그보다 넓지 않게(화면 − 좌우 가장자리)
  width?: number | string;
  avail?: number;
  title?: ReactNode;
  description?: ReactNode;
  close?: boolean;
  closeState?: CloseState;
  onClose?: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  maxHeight?: number | string;
  scroll?: ScrollState & { offset?: number };
  // 본문 끝 흐림(Scroll Fog overlayBody — Dialog 와 같다). 넘칠 수 있는 본문에 건다. 걸면 늘 켜져 있다
  fog?: boolean;
  // 본문 좌우 여백 — 줄이 화면 여백을 가지는 목록(사람)은 뺀다
  bodyPad?: boolean;
  // 본문 위에 붙는 칸 — 스크롤 상자 밖(흐리지 않는다). 머리가 없으면 본문 위 여백이 이 칸 위로 간다
  top?: ReactNode;
  // 넘친 본문이 Tab 을 받을지 — 칸이 초점을 받는 격자(roving)는 끈다
  bodyTabStop?: boolean;
  titleId?: string;
  descId?: string;
  ariaLabel?: string;
  marks?: OvMarks;
  decor?: OvDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
};

export const PopoverSurface = forwardRef<HTMLDivElement, PopoverSurfaceProps>(function PopoverSurface(
  { look, mode = 'auto', width, avail, title, description, close, closeState, onClose, footer, children, maxHeight, scroll, fog = false, bodyPad = true, top, bodyTabStop = true, titleId, descId, marks, decor, rootProps, style },
  ref,
) {
  const live = !scroll;
  const body = useBodyScroll();
  const state = scroll ?? body.state;
  const hasHead = title !== undefined;
  const showClose = close ?? hasHead;
  const cap = (n: number) => (avail !== undefined ? Math.min(n, avail) : n);
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: width ?? 'max-content',
        minWidth: cap(look.minWidth),
        maxWidth: cap(look.maxWidth),
        maxHeight: maxHeight ?? look.maxHeight,
        borderRadius: look.radius,
        background: ocv(look.bg, mode),
        boxShadow: ocv(look.shadow, mode),
        overflow: live ? 'hidden' : 'visible',
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {hasHead && showClose && <OvCloseButton look={look.close} ring={look.ring} mode={mode} state={closeState} onClick={closeState ? undefined : onClose} marks={marks} />}
      {hasHead && <Head hd={look.header} title={title} description={description} t={look.title} d={look.description} mode={mode} close={showClose} titleId={titleId} descId={descId} marks={marks} decor={decor?.header} divider={{ ...look.scroll.divider, on: state.scrolled }} />}
      {top ? (
        <div data-ov-top="" style={{ position: 'relative', flex: 'none', paddingTop: hasHead ? 0 : look.body.padTop, paddingLeft: bodyPad ? look.body.padX : 0, paddingRight: bodyPad ? look.body.padX : 0 }}>
          {top}
        </div>
      ) : null}
      <Body
        scroll={look.scroll}
        fog={fog ? look.scroll.fog : undefined}
        padX={bodyPad ? look.body.padX : 0}
        // 머리가 없는 고르는 패널 — 본문 위 여백(YAML body.paddingTop — 머리가 없을 때만). 위에 붙는 칸이 있으면 그 칸 위로 간다
        padTop={hasHead || top ? 0 : look.body.padTop}
        trail={footer ? 0 : look.body.padBottom}
        hasHead={hasHead}
        state={state}
        focusable={live && bodyTabStop && body.state.overflow}
        offset={scroll?.offset}
        live={live}
        mode={mode}
        bodyRef={live ? (el) => void (body.ref.current = el) : undefined}
        mark={marks?.body}
        decor={decor?.body}
      >
        {children}
      </Body>
      {footer && (
        <div style={{ position: 'relative', display: 'flex', justifyContent: look.footer.justify, gap: look.footer.gap, flex: 'none', padding: `${look.footer.padTop}px ${look.footer.padX}px ${look.footer.padBottom}px`, ...marks?.footer }}>
          {footer}
          {decor?.footer}
        </div>
      )}
      {decor?.root}
    </div>
  );
});

// ── Alert Dialog ──────────────────────────────────────────
export type AlertAction = { label: string; look: ButtonLook; onClick?: () => void; state?: 'enabled' | 'pressed' | 'focused' | 'disabled' | 'loading' };
export type AlertSurfaceProps = {
  look: AlertLook;
  mode?: ViewMode;
  title?: ReactNode;
  description: ReactNode;
  // 배치 — auto 면 글 길이로 정한다(한쪽 글이 반 폭을 넘으면 세로 · 확정이 위)
  layout?: AlertLayout | 'auto';
  cancel?: AlertAction;
  confirm: AlertAction;
  width?: number | string;
  titleId?: string;
  descId?: string;
  marks?: OvMarks;
  decor?: OvDecor;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  style?: CSSProperties;
  // 고른 배치를 알려 준다(플레이그라운드 · 코드)
  onLayout?: (l: AlertLayout) => void;
};

export const AlertSurface = forwardRef<HTMLDivElement, AlertSurfaceProps>(function AlertSurface(
  { look, mode = 'auto', title, description, layout = 'auto', cancel, confirm, width, titleId, descId, marks, decor, rootProps, style, onLayout },
  ref,
) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [auto, setAuto] = useState<AlertLayout>(cancel ? 'horizontal' : 'single');
  // 반 폭 — (바닥 폭 − 사이) ÷ 2. 버튼의 제 폭(글 + 좌우 여백)이 넘으면 세로로
  useIsoLayoutEffect(() => {
    if (layout !== 'auto') return;
    if (!cancel) return setAuto('single');
    const row = rowRef.current;
    const probe = probeRef.current;
    if (!row || !probe) return;
    const measure = () => {
      const half = (row.clientWidth - look.footer.gap) / 2;
      // 배치 폭(offsetWidth) — 줄여 그린 그림에서도 바닥 폭(clientWidth)과 같은 자로 잰다
      const widths = Array.from(probe.children).map((c) => (c as HTMLElement).offsetWidth);
      setAuto(widths.some((w) => w > half + 0.5) ? 'vertical' : 'horizontal');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    ro.observe(probe);
    return () => ro.disconnect();
  }, [layout, cancel?.label, confirm.label, cancel?.look, confirm.look, look.footer.gap]);
  const shown: AlertLayout = layout === 'auto' ? auto : layout;
  useEffect(() => onLayout?.(shown), [shown, onLayout]);
  const btn = (a: AlertAction) => <ButtonView look={a.look} mode={mode} label={a.label} fill state={a.state ?? (a.onClick ? 'live' : 'enabled')} onClick={a.onClick} />;
  const dir = look.layouts[shown];
  return (
    <div
      ref={ref}
      {...rootProps}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: width ?? `min(${look.maxWidth}px, calc(100% - ${look.marginX * 2}px))`,
        padding: look.padding,
        borderRadius: look.radius,
        background: ocv(look.bg, mode),
        outline: 'none',
        ...marks?.root,
        ...style,
      }}
    >
      {title && (
        <div id={titleId} style={{ ...typeOf(look.title, mode), ...marks?.title }}>
          {title}
        </div>
      )}
      <div id={descId} style={{ ...typeOf(look.description, mode), marginTop: title ? look.description.marginTop : 0, ...marks?.description }}>
        {description}
      </div>
      <div ref={rowRef} style={{ position: 'relative', display: 'flex', flexDirection: dir === 'column' ? 'column' : 'row', gap: look.footer.gap, paddingTop: look.footer.padTop, ...marks?.footer }}>
        {shown === 'single' || !cancel ? (
          <div style={{ flex: '1 1 0', minWidth: 0 }}>{btn(confirm)}</div>
        ) : shown === 'vertical' ? (
          <>
            {btn(confirm)}
            {btn(cancel)}
          </>
        ) : (
          <>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>{btn(cancel)}</div>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>{btn(confirm)}</div>
          </>
        )}
        {layout === 'auto' && cancel && (
          // 재는 줄 — 두 버튼의 제 폭(보이지 않는다)
          <div ref={probeRef} aria-hidden style={{ position: 'absolute', left: 0, top: 0, display: 'flex', gap: look.footer.gap, visibility: 'hidden', pointerEvents: 'none', width: 'max-content' }}>
            <ButtonView look={cancel.look} mode={mode} label={cancel.label} state="enabled" />
            <ButtonView look={confirm.look} mode={mode} label={confirm.label} state="enabled" />
          </div>
        )}
        {decor?.footer}
      </div>
      {decor?.root}
    </div>
  );
});

// ── 딤 · 그림 속 표시 ──────────────────────────────────────
// 그림 속 딤 — 화면(폰 · 창) 위 전체. 시트는 아래, 대화상자 · 확인창은 가운데
export function DimView({ dim, mode = 'auto', place, children, style }: { dim: OvColor; mode?: ViewMode; place: 'end' | 'center' | 'top'; children?: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: place === 'end' ? 'flex-end' : place === 'center' ? 'center' : 'flex-start',
        background: ocv(dim, mode),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// 누르는 손가락 · 끄는 손 · 마우스 — 바깥을 누르거나 끄는 자리를 그림에 표시한다. 아래에 짧은 말(무엇이 일어나는지)
export function GestureMark({ kind, x, y, note, drag = 0, ok }: { kind: 'tap' | 'drag' | 'click'; x: number | string; y: number | string; note?: ReactNode; drag?: number; ok?: boolean }) {
  const Icon = kind === 'click' ? MousePointer2 : Hand;
  return (
    <span aria-hidden className="pointer-events-none absolute flex flex-col items-center" style={{ left: x, top: y, transform: 'translate(-50%, -50%)', zIndex: 5 }}>
      <span className="relative flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: 'rgba(26,31,46,0.62)', boxShadow: '0 0 0 2px rgba(255,255,255,0.9)' }}>
        <Icon size={22} strokeWidth={2} color="#FFFFFF" fill={kind === 'click' ? '#FFFFFF' : 'none'} />
        {kind === 'drag' && drag > 0 && <span className="absolute left-1/2 top-full -translate-x-1/2" style={{ width: 0, height: drag, borderLeft: '2px dashed rgba(26,31,46,0.7)' }} />}
      </span>
      {note && (
        <span className="mt-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold leading-4" style={{ marginTop: kind === 'drag' ? drag + 6 : 6, background: ok === undefined ? 'rgba(26,31,46,0.86)' : ok ? '#0B7A55' : '#C2261D', color: '#FFFFFF' }}>
          {note}
        </span>
      )}
    </span>
  );
}
