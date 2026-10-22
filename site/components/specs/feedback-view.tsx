'use client';
// 스펙대로 그린 알림 메시지 넷 — feedback-look(snackbar · callout · page-banner · result-section.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 멈춘 그림, 안 주면 실제 컴포넌트다(누름 · 호버 · 키보드 포커스 · 닫기 · 액션이 동작한다).
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
// 인라인 스타일은 한 속성을 한 이름으로만 적는다 — padding 뒤에 paddingLeft 를 두면(undefined 여도) 링크로 들어올 때 값이 지워진다(PR #154).
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { Bell, ChevronRight, CircleAlert, CircleCheck, FileUp, FunnelX, Info, Landmark, ReceiptText, Search, SearchX, Sparkles, Star, Trash2, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { ButtonView } from './button-view';
import {
  FONT,
  fcv,
  ms,
  pressRatio,
  type BannerVariant,
  type CalloutLook,
  type FbIcon,
  type FbInteraction,
  type FbState,
  type FbTone,
  type FbType,
  type PageBannerLook,
  type ResultKind,
  type ResultSectionLook,
  type ResultSize,
  type SnackState,
  type SnackTone,
  type SnackbarLook,
  type ViewMode,
} from './feedback-shared';

const ICONS: Record<FbIcon, LucideIcon> = {
  'circle-check': CircleCheck,
  'circle-alert': CircleAlert,
  info: Info,
  'triangle-alert': TriangleAlert,
  'chevron-right': ChevronRight,
  x: X,
  'receipt-text': ReceiptText,
  search: Search,
  'search-x': SearchX,
  bell: Bell,
  'file-up': FileUp,
  star: Star,
  trash: Trash2,
  landmark: Landmark,
  sparkles: Sparkles,
  'funnel-x': FunnelX,
};

export function FbIconView({ name, size, strokeWidth = 2, color, style }: { name: FbIcon; size: number; strokeWidth?: number; color?: string; style?: CSSProperties }) {
  const I = ICONS[name];
  return <I aria-hidden size={size} strokeWidth={strokeWidth} style={{ display: 'block', flexShrink: 0, color, ...style }} />;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

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

const type = (t: FbType): CSSProperties => ({ fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight });
// 한국어 줄바꿈 — 단어 단위(Typography v114)
const WRAP: CSSProperties = { wordBreak: 'keep-all', overflowWrap: 'break-word' };
// 보조 기술만 읽는 자리
const SR_ONLY: CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 };

// ── Anatomy 핀 — 부위 위 · 왼쪽에 번호 + 선(그림 장식) ──────────
const PIN_GAP = 12;
export function PinAbove({ pin, inset = 0, line, gap = PIN_GAP }: { pin?: ReactNode; inset?: number; line: string; gap?: number }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
      {pin}
      <span style={{ width: 1, height: gap + inset, background: line }} />
    </span>
  );
}
export function PinBelow({ pin, inset = 0, line, gap = PIN_GAP }: { pin?: ReactNode; inset?: number; line: string; gap?: number }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
      <span style={{ width: 1, height: gap + inset, background: line }} />
      {pin}
    </span>
  );
}
export function PinLeft({ pin, line, gap = PIN_GAP }: { pin?: ReactNode; line: string; gap?: number }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
      {pin}
      <span style={{ width: gap, height: 1, background: line }} />
    </span>
  );
}

function setRef<T>(r: Ref<T> | undefined, el: T | null) {
  if (typeof r === 'function') r(el);
  else if (r) (r as { current: T | null }).current = el;
}

// 누름 · 호버 · 키보드 포커스 — 실제 요소가 쓰는 작은 상태 묶음
function usePress() {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const handlers = {
    onPointerEnter: (e: { pointerType: string }) => e.pointerType === 'mouse' && setHover(true),
    onPointerLeave: () => (setHover(false), setPress(false)),
    onPointerDown: (e: { button: number; currentTarget: HTMLElement }) => {
      if (e.button !== 0) return;
      setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
      setPress(true);
    },
    onPointerUp: () => setPress(false),
    onPointerCancel: () => setPress(false),
    onFocus: (e: { currentTarget: HTMLElement }) => setRing(e.currentTarget.matches(':focus-visible')),
    onBlur: () => (setRing(false), setPress(false)),
    onKeyDown: (e: { key: string; repeat: boolean; currentTarget: HTMLElement }) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
        setPress(true);
      }
    },
    onKeyUp: () => setPress(false),
  };
  return { hover, press, ring, box, handlers };
}

// ══ Snackbar ═════════════════════════════════════════════
export type SnackAction = { label: string; onClick?: () => void };
export type SnackFocusPart = 'root' | 'action' | 'close';
export type SnackPart = 'root' | 'icon' | 'content' | 'message' | 'action' | 'target';

export type SnackbarViewProps = {
  look: SnackbarLook;
  mode?: ViewMode;
  tone?: SnackTone;
  message: ReactNode;
  action?: SnackAction;
  // 멈춘 그림 — enabled · pressed(액션 누름) · focused(focus 의 자리에 링). 없으면 실제 띠(SnackbarRegion 이 띄운다)
  state?: SnackState;
  focus?: SnackFocusPart;
  // 실제 띠 — 액션을 누르면 하고 닫는다 · 보조 기술용 닫기
  onAction?: () => void;
  onClose?: () => void;
  exiting?: boolean;
  rootRef?: Ref<HTMLDivElement>;
  // 그림 — 부위마다 칠 · 핀
  zone?: Partial<Record<SnackPart, CSSProperties>>;
  pins?: Partial<Record<SnackPart, ReactNode>>;
  pinLine?: string;
  // 띠 폭 — 기본은 자리 폭(최대 464)
  width?: number | string;
  style?: CSSProperties;
};

export function SnackbarView({ look, mode = 'auto', tone = 'neutral', message, action, state, focus = 'root', onAction, onClose, exiting = false, rootRef, zone, pins, pinLine = 'currentColor', width, style }: SnackbarViewProps) {
  const live = state === undefined;
  const reduce = useReducedMotion();
  const act = usePress();
  const [closeRing, setCloseRing] = useState(false);
  const [rootRing, setRootRing] = useState(false);
  const ringColor = fcv(look.ring.color, mode);
  // 링은 띠 글자색 — 띠 · 닫기는 안쪽(offset), 액션은 바깥(actionOffset). 어느 쪽이든 띠 위에 그린다
  const ring = (on: boolean, offset = look.ring.offset): CSSProperties => (on ? { outline: `${look.ring.width}px solid ${ringColor}`, outlineOffset: offset } : { outline: 'none' });
  const pressedNow = live ? act.press : state === 'pressed';
  const textRef = useRef<HTMLElement | null>(null);
  const [frozenBox, setFrozenBox] = useState<{ w: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    if (live || state !== 'pressed' || !textRef.current) return;
    setFrozenBox({ w: textRef.current.offsetWidth, h: textRef.current.offsetHeight });
  }, [live, state]);
  const box = live ? act.box : frozenBox;
  const lh = parseFloat(look.action.lineHeight);
  // 액션 누름 — 글만 2px 거리(모션 줄이기면 주지 않는다)
  const scale = pressedNow && !reduce ? pressRatio(look.press, box?.w ?? lh * 3, box?.h ?? lh) : 1;
  const icon = tone === 'neutral' ? null : tone;
  const fg = fcv(look.message.color, mode);

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: width ?? '100%',
    maxWidth: look.root.maxWidth,
    minHeight: look.root.minHeight,
    padding: look.root.pad,
    borderRadius: look.root.radius,
    background: fcv(look.root.bg, mode),
    boxShadow: look.root.shadow,
    color: fg,
    fontFamily: FONT,
    textAlign: 'left',
    pointerEvents: 'auto',
    ...ring(live ? rootRing : state === 'focused' && focus === 'root'),
    ...zone?.root,
    ...style,
  };
  // 아이콘 24 — 오른쪽 여백 2 를 안에 둔 상자(글은 띠 가장자리에서 40)
  const iconEl = icon && (
    <span style={{ position: 'relative', display: 'flex', flexShrink: 0, ...zone?.icon }}>
      <FbIconView name={look.icon.glyph[icon]} size={look.icon.size} color={fcv(look.icon.color[icon], mode)} style={{ boxSizing: 'border-box', paddingRight: look.icon.padRight }} />
      <PinAbove pin={pins?.icon} inset={look.root.pad} line={pinLine} />
    </span>
  );
  const actionText: CSSProperties = {
    position: 'relative',
    display: 'block',
    flexShrink: 0,
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: look.action.radius,
    background: 'transparent',
    ...type(look.action),
    fontFamily: FONT,
    color: fcv(look.action.color, mode),
    whiteSpace: 'nowrap',
    cursor: live ? 'pointer' : 'default',
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transition: `transform ${look.motion.press.duration} ${look.motion.press.easing}`,
    WebkitTapHighlightColor: 'transparent',
    ...ring(live ? act.ring : state === 'focused' && focus === 'action', look.ring.actionOffset),
    ...zone?.action,
  };
  // 누르는 영역 — 글 + 좌우 targetPadX × targetH(띠 높이 안에서 위아래로)
  const target = (
    <span
      aria-hidden
      data-snack-target
      style={{ position: 'absolute', left: -look.action.targetPadX, right: -look.action.targetPadX, top: '50%', height: look.action.targetH, transform: 'translateY(-50%)', ...zone?.target }}
    />
  );
  const actionEl =
    action &&
    (live ? (
      <button
        ref={(el) => void (textRef.current = el)}
        type="button"
        data-snack-action
        style={actionText}
        {...act.handlers}
        onClick={() => {
          action.onClick?.();
          onAction?.();
        }}
      >
        {action.label}
        {target}
      </button>
    ) : (
      <span ref={(el) => void (textRef.current = el)} data-snack-action style={actionText}>
        {action.label}
        {(zone?.target || pins?.target) && target}
        <PinAbove pin={pins?.action} inset={look.root.pad + (parseFloat(look.message.lineHeight) - lh) / 2} line={pinLine} />
      </span>
    ));
  const closeVisible = live ? closeRing : state === 'focused' && focus === 'close';
  // 보조 기술용 닫기 — 평소에는 숨기고, 키보드 초점이 오면 띠 오른쪽 끝에 X 로 보인다(띠 높이 · 오른쪽 여백 안에 들어간다)
  const closeStyle: CSSProperties = closeVisible
    ? {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: look.close.size,
        height: look.close.size,
        padding: 0,
        margin: `${look.close.margin}px ${look.close.margin}px ${look.close.margin}px 0`,
        overflow: 'visible',
        clip: 'auto',
        whiteSpace: 'nowrap',
        border: 0,
        borderRadius: look.close.radius,
        background: 'transparent',
        color: fcv(look.close.color, mode),
        cursor: 'pointer',
        ...ring(true),
      }
    : SR_ONLY;
  const closeGlyph = <FbIconView name="x" size={look.close.icon} />;
  return (
    <div
      ref={rootRef}
      role={live ? 'status' : undefined}
      aria-atomic={live ? true : undefined}
      aria-hidden={live ? exiting || undefined : undefined}
      tabIndex={live ? 0 : undefined}
      data-snackbar={tone}
      data-state={live ? undefined : state}
      style={rootStyle}
      onFocus={live ? (e) => e.target === e.currentTarget && setRootRing(e.currentTarget.matches(':focus-visible')) : undefined}
      onBlur={live ? (e) => e.target === e.currentTarget && setRootRing(false) : undefined}
    >
      <PinLeft pin={pins?.root} line={pinLine} />
      {iconEl}
      <div data-snack-content style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: look.content.gap, flex: '1 1 auto', minWidth: 0, padding: `0 ${look.content.padX}px`, ...zone?.content }}>
        <span data-snack-message style={{ position: 'relative', minWidth: 0, ...type(look.message), color: fg, ...WRAP, ...zone?.message }}>
          {message}
          <PinAbove pin={pins?.message} inset={look.root.pad} line={pinLine} />
        </span>
        {actionEl}
      </div>
      {live && (
        <button
          type="button"
          aria-label="닫기"
          data-snack-close
          style={closeStyle}
          onFocus={(e) => setCloseRing(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setCloseRing(false)}
          onClick={onClose}
        >
          {closeVisible ? closeGlyph : '닫기'}
        </button>
      )}
      {!live && closeVisible && (
        <span aria-hidden style={{ ...closeStyle, cursor: 'default' }}>
          {closeGlyph}
        </span>
      )}
    </div>
  );
}
// ── 실제로 띄우는 자리 — 한 번에 하나, 4초 · 액션 6초, 머무는 동안 멈추고 떠나면 처음부터 ──────────
export type SnackSpec = { tone?: SnackTone; message: string; action?: SnackAction };
type LiveSnack = SnackSpec & { id: number };
export type SnackRun = { id: number; started: number; duration: number; paused: boolean } | null;
export type SnackbarHost = {
  cur: LiveSnack | null;
  exiting: boolean;
  show: (s: SnackSpec) => void;
  dismiss: () => void;
  run: SnackRun;
  setRun: (r: SnackRun) => void;
};

export function useSnackbarHost(look: SnackbarLook): SnackbarHost {
  const [cur, setCur] = useState<LiveSnack | null>(null);
  const [exiting, setExiting] = useState(false);
  const [run, setRun] = useState<SnackRun>(null);
  const curRef = useRef<LiveSnack | null>(null);
  const exitingRef = useRef(false);
  const next = useRef<LiveSnack | null>(null);
  const seq = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const exitMs = ms(look.motion.exit.duration);
  const finish = useCallback(() => {
    exitingRef.current = false;
    const n = next.current;
    next.current = null;
    curRef.current = n;
    setExiting(false);
    setCur(n);
    if (!n) setRun(null);
  }, []);
  const beginExit = useCallback(() => {
    exitingRef.current = true;
    setExiting(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(finish, exitMs);
  }, [exitMs, finish]);
  const show = useCallback(
    (s: SnackSpec) => {
      const item = { ...s, id: ++seq.current };
      if (!curRef.current) {
        curRef.current = item;
        setCur(item);
        return;
      }
      // 한 번에 하나 — 지금 것을 바로 내보내고 새 것을 띄운다(내보내는 동안 또 오면 마지막 것만).
      // 지금 것에 액션이 있으면 끝날 때까지 지키고 새 것은 그 뒤에(2026-10-22 1B — 기다리는 것은 하나)
      next.current = item;
      if (curRef.current.action && !exitingRef.current) return;
      if (!exitingRef.current) beginExit();
    },
    [beginExit],
  );
  const dismiss = useCallback(() => {
    if (curRef.current && !exitingRef.current) beginExit();
  }, [beginExit]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { cur, exiting, show, dismiss, run, setRun };
}

// 띄우는 자리 — 놓인 상자(position: relative)의 아래 가운데. 탭 바 · 바닥 버튼은 상자 밖(아래)에 두면 그 위 8 에 선다
export function SnackbarRegion({ host, look, mode = 'auto', label = '알림' }: { host: SnackbarHost; look: SnackbarLook; mode?: ViewMode; label?: string }) {
  const { cur, exiting, dismiss, setRun } = host;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const reduce = useReducedMotion();
  const el = useRef<HTMLDivElement | null>(null);
  // 띠에 들어오기 전 초점 자리 — 띠가 사라질 때 초점이 안에 있으면 돌려준다(body 로 떨어지지 않게)
  const back = useRef<HTMLElement | null>(null);
  const id = cur?.id;
  // 새 띠가 오면 머무름을 처음부터
  useEffect(() => {
    setHover(false);
    setPress(false);
    setFocusIn(false);
  }, [id]);
  const paused = hover || press || focusIn;
  const duration = cur?.action ? look.duration.withAction : look.duration.plain;
  useEffect(() => {
    if (id === undefined || exiting) return;
    setRun({ id, started: performance.now(), duration, paused });
    if (paused) return;
    const t = window.setTimeout(dismiss, duration);
    return () => window.clearTimeout(t);
  }, [id, exiting, paused, duration, dismiss, setRun]);
  // 나타남 · 사라짐 — 가운데를 기준점으로 크기 + 투명도(모션 줄이기면 투명도만)
  useIsoLayoutEffect(() => {
    const node = el.current;
    if (!node || id === undefined) return;
    if (exiting && node.contains(document.activeElement)) {
      const to = back.current;
      if (to?.isConnected) to.focus({ preventScroll: true });
      else (document.activeElement as HTMLElement | null)?.blur();
    }
    const m = exiting ? look.motion.exit : look.motion.enter;
    const s = exiting ? `scale(${look.motion.exit.scale})` : `scale(${look.motion.enter.scale})`;
    const frames: Keyframe[] = exiting
      ? [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: reduce ? 'scale(1)' : s }]
      : [{ opacity: 0, transform: reduce ? 'scale(1)' : s }, { opacity: 1, transform: 'scale(1)' }];
    const a = node.animate(frames, { duration: ms(m.duration), easing: m.easing, fill: 'forwards' });
    return () => a.cancel();
  }, [id, exiting, reduce]);
  return (
    <div
      role="region"
      aria-label={label}
      aria-live="polite"
      data-snack-region
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `0 ${look.region.padX}px ${look.region.padBottom}px`,
        zIndex: look.region.zIndex,
        pointerEvents: 'none',
      }}
    >
      {cur && (
        <SnackbarView
          key={cur.id}
          rootRef={el}
          look={look}
          mode={mode}
          tone={cur.tone}
          message={cur.message}
          action={cur.action}
          exiting={exiting}
          onAction={dismiss}
          onClose={dismiss}
          style={{ transformOrigin: 'center' }}
        />
      )}
      {cur && (
        // 머무름 — 마우스 · 손가락이 띠 위에 있거나 키보드 초점이 띠 안에 있으면 멈춘다(떠나면 처음부터)
        <PauseWatch target={el} back={back} onHover={setHover} onPress={setPress} onFocusIn={setFocusIn} key={`w${cur.id}`} />
      )}
    </div>
  );
}

// 띠 요소에 머무름 이벤트를 단다 — 띠 그림(SnackbarView)은 실제 · 멈춘 그림이 같은 것이라 여기서 붙인다
function PauseWatch({
  target,
  back,
  onHover,
  onPress,
  onFocusIn,
}: {
  target: { current: HTMLDivElement | null };
  back: { current: HTMLElement | null };
  onHover: (v: boolean) => void;
  onPress: (v: boolean) => void;
  onFocusIn: (v: boolean) => void;
}) {
  useEffect(() => {
    const node = target.current;
    if (!node) return;
    const enter = () => onHover(true);
    const leave = () => onHover(false);
    // 누르고 있는 동안 — 띠 밖에서 떼도 끝난다
    const release = () => onPress(false);
    const down = () => {
      onPress(true);
      window.addEventListener('pointerup', release, { once: true });
      window.addEventListener('pointercancel', release, { once: true });
    };
    // 키보드 초점만 — 마우스로 누른 초점은 멈추지 않는다(:focus-visible). 밖에서 들어온 초점은 그 자리를 기억한다
    const focusin = (e: Event) => {
      const from = (e as globalThis.FocusEvent).relatedTarget as HTMLElement | null;
      if (!from || !node.contains(from)) back.current = from;
      onFocusIn((e.target as HTMLElement).matches(':focus-visible'));
    };
    const focusout = (e: Event) => {
      const to = (e as globalThis.FocusEvent).relatedTarget as Node | null;
      if (!to || !node.contains(to)) onFocusIn(false);
    };
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', leave);
    node.addEventListener('pointerdown', down);
    node.addEventListener('focusin', focusin);
    node.addEventListener('focusout', focusout);
    return () => {
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerleave', leave);
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('focusin', focusin);
      node.removeEventListener('focusout', focusout);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [target, back, onHover, onPress, onFocusIn]);
  return null;
}

// ══ Callout ══════════════════════════════════════════════
export type FbLink = { label: string; href?: string; onClick?: () => void };
export type CalloutPart = 'root' | 'icon' | 'title' | 'description' | 'link' | 'suffix' | 'close' | 'sep';
export type CalloutViewProps = {
  look: CalloutLook;
  mode?: ViewMode;
  tone?: FbTone;
  interaction?: FbInteraction;
  title?: ReactNode;
  description: ReactNode;
  link?: FbLink;
  // 앞 아이콘 — 없으면 톤 기본, null 이면 그리지 않는다
  icon?: FbIcon | null;
  // 멈춘 그림 — hovered · pressed 는 Actionable 상자(닫기는 pressPart), focused 는 focusPart 의 자리에 링
  state?: FbState;
  part?: 'root' | 'link' | 'close';
  onClick?: () => void;
  onDismiss?: () => void;
  role?: 'alert' | 'status';
  rootRef?: Ref<HTMLElement>;
  zone?: Partial<Record<CalloutPart, CSSProperties>>;
  pins?: Partial<Record<CalloutPart, ReactNode>>;
  pinLine?: string;
  style?: CSSProperties;
};

export function CalloutView({ look, mode = 'auto', tone = 'neutral', interaction = 'display', title, description, link, icon, state, part = 'root', onClick, onDismiss, role, rootRef, zone, pins, pinLine = 'currentColor', style }: CalloutViewProps) {
  const live = state === undefined;
  const reduce = useReducedMotion();
  const root = usePress();
  const close = usePress();
  const [linkRing, setLinkRing] = useState(false);
  const face = look.faces[tone];
  const fg = fcv(face.fg, mode);
  const actionable = interaction === 'actionable';
  const dismissible = interaction === 'dismissible';
  const frozen = (p: 'root' | 'link' | 'close', st: FbState) => !live && state === st && part === p;
  const rootPressed = actionable && (live ? root.press : frozen('root', 'pressed'));
  const rootHover = actionable && (live ? root.hover : frozen('root', 'hovered'));
  const closePressed = dismissible && (live ? close.press : frozen('close', 'pressed'));
  const closeHover = dismissible && (live ? close.hover : frozen('close', 'hovered'));
  const ringOn = (p: 'root' | 'link' | 'close') => (live ? (p === 'root' ? actionable && root.ring : p === 'link' ? linkRing : close.ring) : state === 'focused' && part === p);
  const ring = (on: boolean): CSSProperties => (on ? { outline: `${look.ring.width}px solid ${fcv(look.ring.color, mode)}`, outlineOffset: look.ring.offset } : { outline: 'none' });
  const boxRef = useRef<HTMLElement | null>(null);
  const [frozenBox, setFrozenBox] = useState<{ w: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    if (live || !rootPressed || !boxRef.current) return;
    setFrozenBox({ w: boxRef.current.offsetWidth, h: boxRef.current.offsetHeight });
  }, [live, rootPressed]);
  const b = live ? root.box : frozenBox;
  const scale = rootPressed && !reduce ? pressRatio(look.press, b?.w ?? 320, b?.h ?? look.root.minHeight) : 1;
  const closeScale = closePressed && !reduce ? pressRatio(look.press, look.close.size, look.close.size) : 1;
  const transition = `background-color ${look.motion.color.duration} ${look.motion.color.easing}, transform ${look.motion.press.duration} ${look.motion.press.easing}`;
  const glyph = icon === null ? null : (icon ?? look.toneIcon[tone]);

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: look.root.gap,
    boxSizing: 'border-box',
    width: '100%',
    minHeight: look.root.minHeight,
    margin: 0,
    padding: look.root.pad,
    border: 0,
    borderRadius: look.root.radius,
    background: fcv(rootPressed || rootHover ? face.pressed : face.bg, mode),
    color: fg,
    fontFamily: FONT,
    ...type(look.description),
    textAlign: 'left',
    cursor: actionable ? 'pointer' : 'default',
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transition,
    WebkitTapHighlightColor: 'transparent',
    ...ring(ringOn('root')),
    ...zone?.root,
    ...style,
  };
  const sep = <span style={{ whiteSpace: 'pre-wrap', ...zone?.sep }}>{'  '}</span>;
  const linkStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    ...type(look.link),
    color: fg,
    textDecorationLine: 'underline',
    textUnderlineOffset: look.link.underlineOffset,
    borderRadius: look.link.ringRadius,
    cursor: 'pointer',
    ...ring(ringOn('link')),
    ...zone?.link,
  };
  const linkEl =
    link &&
    !actionable &&
    (live ? (
      <a
        href={link.href ?? '#'}
        style={linkStyle}
        onFocus={(e) => setLinkRing(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setLinkRing(false)}
        onClick={(e) => {
          // 문서 안 미리보기 — 실제로 옮겨 가지 않는다
          e.preventDefault();
          link.onClick?.();
        }}
      >
        {link.label}
      </a>
    ) : (
      <span style={linkStyle}>
        {link.label}
        <PinAbove pin={pins?.link} inset={look.root.pad} line={pinLine} />
      </span>
    ));
  // 한 문단 — Display · Dismissible 은 문단(p), 상자 전체가 버튼인 Actionable 은 그 안의 span
  const Text = actionable ? 'span' : 'p';
  const body = (
    <Text data-callout-content style={{ position: 'relative', display: 'block', flex: '1 1 auto', minWidth: 0, margin: 0, ...type(look.description), ...WRAP }}>
      {title && (
        <>
          <span data-callout-title style={{ position: 'relative', ...type(look.title), ...zone?.title }}>
            {title}
            <PinAbove pin={pins?.title} inset={look.root.pad} line={pinLine} />
          </span>
          {sep}
        </>
      )}
      <span data-callout-description style={{ position: 'relative', ...type(look.description), ...zone?.description }}>
        {description}
        <PinAbove pin={pins?.description} inset={look.root.pad} line={pinLine} />
      </span>
      {linkEl && (
        <>
          {sep}
          {linkEl}
        </>
      )}
    </Text>
  );
  const iconEl = glyph && (
    <span style={{ position: 'relative', display: 'flex', flexShrink: 0, ...zone?.icon }}>
      <FbIconView name={glyph} size={look.icon} />
      <PinAbove pin={pins?.icon} inset={0} line={pinLine} />
    </span>
  );
  const suffixEl = actionable && (
    <span style={{ position: 'relative', display: 'flex', flexShrink: 0, ...zone?.suffix }}>
      <FbIconView name="chevron-right" size={look.suffixIcon} />
      <PinAbove pin={pins?.suffix} inset={0} line={pinLine} />
    </span>
  );
  // 닫기 — 투명 상자 40, 바깥 여백 −12 로 줄 높이를 늘리지 않는다. 호버 · 누름은 톤의 누름 바탕
  const closeStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: look.close.size,
    height: look.close.size,
    margin: look.close.margin,
    padding: 0,
    border: 0,
    borderRadius: look.close.radius,
    background: closePressed || closeHover ? fcv(face.pressed, mode) : 'transparent',
    color: fg,
    cursor: 'pointer',
    transform: closeScale !== 1 ? `scale(${closeScale})` : undefined,
    transition,
    WebkitTapHighlightColor: 'transparent',
    ...ring(ringOn('close')),
    ...zone?.close,
  };
  const closeEl =
    dismissible &&
    (live ? (
      <button type="button" aria-label="닫기" style={closeStyle} {...close.handlers} onClick={onDismiss}>
        <FbIconView name="x" size={look.close.icon} />
      </button>
    ) : (
      <span aria-hidden style={closeStyle}>
        <FbIconView name="x" size={look.close.icon} />
        <PinAbove pin={pins?.close} inset={(look.close.size - look.close.icon) / 2 + look.close.margin} line={pinLine} />
      </span>
    ));
  const inner = (
    <>
      <PinLeft pin={pins?.root} line={pinLine} />
      {iconEl}
      {body}
      {suffixEl}
      {closeEl}
    </>
  );
  const data = { 'data-callout': tone, 'data-interaction': interaction, 'data-state': live ? undefined : state };
  if (actionable && live)
    return (
      <button
        ref={(el) => {
          boxRef.current = el;
          setRef(rootRef, el);
        }}
        type="button"
        {...data}
        style={rootStyle}
        {...root.handlers}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  return (
    <div
      ref={(el) => {
        boxRef.current = el;
        setRef(rootRef, el);
      }}
      role={role}
      {...data}
      style={rootStyle}
    >
      {inner}
    </div>
  );
}

// ══ Page Banner ═══════════════════════════════════════════
export type BannerPart = 'root' | 'icon' | 'title' | 'description' | 'button' | 'suffix' | 'close' | 'content' | 'sep';
export type PageBannerViewProps = {
  look: PageBannerLook;
  mode?: ViewMode;
  tone?: FbTone;
  variant?: BannerVariant;
  interaction?: FbInteraction;
  title?: ReactNode;
  description: ReactNode;
  button?: { label: string; onClick?: () => void };
  icon?: FbIcon | null;
  // 멈춘 그림 — hovered · pressed 는 part(root: Actionable 띠 · button · close), focused 는 part 의 자리에 안쪽 링
  state?: FbState;
  part?: 'root' | 'button' | 'close';
  onClick?: () => void;
  onDismiss?: () => void;
  role?: 'alert' | 'status';
  rootRef?: Ref<HTMLElement>;
  zone?: Partial<Record<BannerPart, CSSProperties>>;
  pins?: Partial<Record<BannerPart, ReactNode>>;
  pinLine?: string;
  style?: CSSProperties;
};

export function PageBannerView({ look, mode = 'auto', tone = 'neutral', variant = 'weak', interaction = 'display', title, description, button, icon, state, part = 'root', onClick, onDismiss, role, rootRef, zone, pins, pinLine = 'currentColor', style }: PageBannerViewProps) {
  const live = state === undefined;
  const reduce = useReducedMotion();
  const root = usePress();
  const btn = usePress();
  const close = usePress();
  const face = look.faces[variant][tone];
  const fg = fcv(face.fg, mode);
  const actionable = interaction === 'actionable';
  const dismissible = interaction === 'dismissible';
  const display = interaction === 'display';
  const frozen = (p: 'root' | 'button' | 'close', st: FbState) => !live && state === st && part === p;
  const rootPressed = actionable && (live ? root.press : frozen('root', 'pressed'));
  const rootHover = actionable && (live ? root.hover : frozen('root', 'hovered'));
  const btnPressed = display && (live ? btn.press : frozen('button', 'pressed'));
  const closePressed = dismissible && (live ? close.press : frozen('close', 'pressed'));
  const ringOn = (p: 'root' | 'button' | 'close') => (live ? (p === 'root' ? actionable && root.ring : p === 'button' ? btn.ring : close.ring) : state === 'focused' && part === p);
  // 화면 끝까지 차는 띠라 링은 안쪽(offset 음수). 색은 바탕마다 — 옅은 바탕은 stroke-focus-ring, 짙은 바탕은 띠 글자색
  const ring = (on: boolean): CSSProperties => (on ? { outline: `${look.ring.width}px solid ${fcv(face.ring, mode)}`, outlineOffset: look.ring.offset } : { outline: 'none' });
  const wrapRef = useRef<HTMLElement | null>(null);
  const btnRef = useRef<HTMLElement | null>(null);
  const [frozenBox, setFrozenBox] = useState<{ w: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const t = rootPressed ? wrapRef.current : btnPressed ? btnRef.current : null;
    if (live || !t) return;
    setFrozenBox({ w: t.offsetWidth, h: t.offsetHeight });
  }, [live, rootPressed, btnPressed]);
  // 누름 — Actionable 은 안의 내용만(바탕은 그대로), 버튼 · 닫기는 각자
  const wb = live ? root.box : frozenBox;
  const contentScale = rootPressed && !reduce ? pressRatio(look.press, wb?.w ?? 320, wb?.h ?? look.root.minHeight) : 1;
  const bb = live ? btn.box : frozenBox;
  const btnScale = btnPressed && !reduce ? pressRatio(look.press, bb?.w ?? 80, bb?.h ?? look.button.targetH) : 1;
  const closeScale = closePressed && !reduce ? pressRatio(look.press, look.close.size, look.close.size) : 1;
  const scaleT = `transform ${look.motion.press.duration} ${look.motion.press.easing}`;
  const glyph = icon === null ? null : (icon ?? look.toneIcon[tone]);

  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: look.root.minHeight,
    margin: 0,
    padding: `${look.root.padY}px ${look.root.padX}px`,
    border: 0,
    borderRadius: look.root.radius,
    background: fcv(rootPressed || rootHover ? face.pressed : face.bg, mode),
    color: fg,
    fontFamily: FONT,
    textAlign: 'left',
    cursor: actionable ? 'pointer' : 'default',
    transition: `background-color ${look.motion.color.duration} ${look.motion.color.easing}`,
    WebkitTapHighlightColor: 'transparent',
    ...ring(ringOn('root')),
    ...zone?.root,
    ...style,
  };
  // 안의 내용 — 아이콘은 첫 줄 가운데(위 2), 화살표 · 닫기는 띠 가운데
  const wrapStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: look.root.gap,
    flex: '1 1 auto',
    minWidth: 0,
    transform: contentScale !== 1 ? `scale(${contentScale})` : undefined,
    transition: scaleT,
  };
  const sep = <span style={{ whiteSpace: 'pre-wrap', ...zone?.sep }}>{'  '}</span>;
  const btnStyle: CSSProperties = {
    position: 'relative',
    display: 'block',
    flexShrink: 0,
    boxSizing: 'border-box',
    margin: -look.button.pad,
    padding: look.button.pad,
    border: 0,
    borderRadius: look.button.radius,
    background: 'transparent',
    ...type(look.button),
    fontFamily: FONT,
    color: fg,
    whiteSpace: 'nowrap',
    cursor: live ? 'pointer' : 'default',
    transform: btnScale !== 1 ? `scale(${btnScale})` : undefined,
    transition: scaleT,
    WebkitTapHighlightColor: 'transparent',
    ...ring(ringOn('button')),
    ...zone?.button,
  };
  const btnEl =
    button &&
    display &&
    (live ? (
      <button
        ref={(el) => void (btnRef.current = el)}
        type="button"
        data-banner-button
        style={btnStyle}
        {...btn.handlers}
        onClick={(e) => {
          e.stopPropagation();
          button.onClick?.();
        }}
      >
        {button.label}
      </button>
    ) : (
      <span ref={(el) => void (btnRef.current = el)} data-banner-button style={btnStyle}>
        {button.label}
        <PinBelow pin={pins?.button} inset={0} line={pinLine} />
      </span>
    ));
  const iconEl = glyph && (
    <span style={{ position: 'relative', display: 'flex', flexShrink: 0, marginTop: look.icon.marginTop, ...zone?.icon }}>
      <FbIconView name={glyph} size={look.icon.size} />
      <PinAbove pin={pins?.icon} inset={look.root.padY + look.icon.marginTop} line={pinLine} />
    </span>
  );
  const contentEl = (
    <span data-banner-content style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: look.content.justify as CSSProperties['justifyContent'], gap: look.content.gap, flex: '1 1 auto', minWidth: 0, ...zone?.content }}>
      <span data-banner-body style={{ position: 'relative', minWidth: 0, ...type(look.description), ...WRAP }}>
        {title && (
          <>
            <span data-banner-title style={{ position: 'relative', ...type(look.title), ...zone?.title }}>
              {title}
              <PinAbove pin={pins?.title} inset={look.root.padY} line={pinLine} />
            </span>
            {sep}
          </>
        )}
        <span data-banner-description style={{ position: 'relative', ...type(look.description), ...zone?.description }}>
          {description}
          <PinAbove pin={pins?.description} inset={look.root.padY} line={pinLine} />
        </span>
      </span>
      {btnEl}
    </span>
  );
  const suffixEl = actionable && (
    <span style={{ position: 'relative', display: 'flex', flexShrink: 0, alignSelf: 'center', ...zone?.suffix }}>
      <FbIconView name="chevron-right" size={look.suffixIcon} />
      <PinAbove pin={pins?.suffix} inset={0} line={pinLine} />
    </span>
  );
  const closeStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: look.close.size,
    height: look.close.size,
    margin: look.close.margin,
    padding: 0,
    border: 0,
    borderRadius: look.close.radius,
    background: 'transparent',
    color: fg,
    cursor: 'pointer',
    transform: closeScale !== 1 ? `scale(${closeScale})` : undefined,
    transition: scaleT,
    WebkitTapHighlightColor: 'transparent',
    ...ring(ringOn('close')),
    ...zone?.close,
  };
  const closeEl =
    dismissible &&
    (live ? (
      <button type="button" aria-label="닫기" style={closeStyle} {...close.handlers} onClick={onDismiss}>
        <FbIconView name="x" size={look.close.icon} />
      </button>
    ) : (
      <span aria-hidden style={closeStyle}>
        <FbIconView name="x" size={look.close.icon} />
        <PinAbove pin={pins?.close} inset={(look.close.size - look.close.icon) / 2 + look.close.margin} line={pinLine} />
      </span>
    ));
  const inner = (
    <span
      ref={(el) => void (wrapRef.current = el)}
      style={wrapStyle}
    >
      {iconEl}
      {contentEl}
      {suffixEl}
      {closeEl}
    </span>
  );
  const data = { 'data-banner': `${variant}-${tone}`, 'data-interaction': interaction, 'data-state': live ? undefined : state };
  if (actionable && live)
    return (
      <button ref={(el) => setRef(rootRef, el)} type="button" {...data} style={rootStyle} {...root.handlers} onClick={onClick}>
        {inner}
      </button>
    );
  return (
    <div ref={(el) => setRef(rootRef, el)} role={role} {...data} style={rootStyle}>
      <PinLeft pin={pins?.root} line={pinLine} />
      {inner}
    </div>
  );
}

// ══ Result Section ════════════════════════════════════════
export type ResultPart = 'root' | 'asset' | 'title' | 'description' | 'actions' | 'primary' | 'secondary';
export type ResultAction = { label: string; onClick?: () => void; loading?: boolean };
export type ResultSectionViewProps = {
  look: ResultSectionLook;
  mode?: ViewMode;
  kind?: ResultKind;
  size?: ResultSize;
  // 비어 있음은 그 내용을 말하는 아이콘, 실패 · 완료는 기본(느낌표 · 체크)
  icon?: FbIcon;
  title: ReactNode;
  description?: ReactNode;
  primary?: ResultAction;
  secondary?: ResultAction;
  // 실제 결과 — 제목은 제목 태그(h2 · h3), 버튼은 누를 수 있다. 없으면 멈춘 그림
  heading?: 2 | 3 | 4;
  live?: boolean;
  zone?: Partial<Record<ResultPart, CSSProperties>>;
  pins?: Partial<Record<ResultPart, ReactNode>>;
  pinLine?: string;
  // 놓인 자리를 채운다(가로 · 세로 가운데) — 카드 · 화면 안에서
  grow?: boolean;
  // 그림 — 묶음 안에 덧그리는 치수 표시
  overlay?: ReactNode;
  // 카드 안 — 좌우 여백 0(카드 안 여백 24 · 표 칸의 24 가 가장자리를 맡는다, result-section.yaml root.paddingX 비고)
  inCard?: boolean;
  style?: CSSProperties;
};

export function ResultSectionView({ look, mode = 'auto', kind = 'empty', size = 'large', icon, title, description, primary, secondary, heading, live = false, zone, pins, pinLine = 'currentColor', grow = true, overlay, inCard = false, style }: ResultSectionViewProps) {
  const sz = look.sizes[size];
  const glyph: FbIcon = kind === 'empty' ? (icon ?? 'search') : (icon ?? look.asset.glyph[kind]);
  const Title = (heading ? `h${heading}` : 'div') as 'h2' | 'div';
  const sec = look.secondary;
  // 둘째 버튼(글 버튼) — 위아래로 블리드해 글 자리만 차지한다
  const bleed = -sec.padY;
  const btn = (which: 'primary' | 'secondary', a: ResultAction) => {
    const b = which === 'primary' ? look.primary : look.secondary;
    const state = live ? (a.loading ? 'loading' : 'live') : 'enabled';
    return (
      <span key={which} style={{ position: 'relative', display: 'flex', margin: which === 'secondary' ? `${bleed}px 0` : 0, ...zone?.[which] }}>
        <ButtonView look={b.look} mode={mode} label={a.label} state={state} onClick={a.onClick} />
        <PinLeft pin={pins?.[which]} line={pinLine} />
      </span>
    );
  };
  return (
    <div
      data-result={kind}
      data-size={size}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: grow ? 1 : 0,
        boxSizing: 'border-box',
        paddingTop: look.root.padY,
        paddingBottom: look.root.padY,
        paddingLeft: inCard ? look.root.padXInCard : look.root.padX,
        paddingRight: inCard ? look.root.padXInCard : look.root.padX,
        textAlign: 'center',
        fontFamily: FONT,
        ...zone?.root,
        ...style,
      }}
    >
      <span style={{ position: 'relative', display: 'flex', marginBottom: look.asset.marginBottom, ...zone?.asset }}>
        <FbIconView name={glyph} size={look.asset.size} strokeWidth={look.asset.strokeWidth} color={fcv(look.asset.color[kind], mode)} />
        <PinLeft pin={pins?.asset} line={pinLine} />
      </span>
      <Title style={{ position: 'relative', margin: 0, ...type(sz.title), fontWeight: look.title.fontWeight, color: fcv(look.title.color, mode), ...WRAP, ...zone?.title }}>
        {title}
        <PinLeft pin={pins?.title} line={pinLine} />
      </Title>
      {description && (
        <p style={{ position: 'relative', margin: `${sz.descGap}px 0 0`, ...type(sz.description), fontWeight: look.description.fontWeight, color: fcv(look.description.color, mode), ...WRAP, ...zone?.description }}>
          {description}
          <PinLeft pin={pins?.description} line={pinLine} />
        </p>
      )}
      {(primary || secondary) && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: look.actions.gap, marginTop: sz.actionsTop, ...zone?.actions }}>
          {primary && btn('primary', primary)}
          {secondary && btn('secondary', secondary)}
        </div>
      )}
      {overlay}
    </div>
  );
}
