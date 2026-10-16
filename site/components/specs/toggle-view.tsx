'use client';
// 스펙대로 그린 Toggle — 켜고 끄는 아이콘 단추. ToggleLook(toggle.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 멈춘 그림, 안 주면 실제 단추(<button aria-pressed> — 누르면 바로 켬 ↔ 끔).
// 보이는 상자 40 · 누르는 영역 44 — 상자 둘레 2 씩은 보이지 않는 자리(레시피의 ::before 와 같다). 바탕은 누름 · 호버에만 칠하고
// 켬 · 끔은 아이콘(모양 · 굵기 · 색)만 바뀐다. 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react';
import { Bell, BellOff, Eye, EyeOff, Heart, Pin, PinOff, Star, StarOff, type LucideIcon } from 'lucide-react';
import { icv, pressRatio, type ToggleIcon, type ToggleLook, type ToggleState, type ToggleTone, type ViewMode } from './input-shared';

// 아이콘은 이름으로 넘긴다(서버 그림 → 브라우저 그림) — 이름 목록은 input-shared 의 TOGGLE_ICONS
const GLYPHS: Record<ToggleIcon, LucideIcon> = { star: Star, 'star-off': StarOff, pin: Pin, 'pin-off': PinOff, eye: Eye, 'eye-off': EyeOff, bell: Bell, 'bell-off': BellOff, heart: Heart };

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

export type ToggleViewProps = {
  look: ToggleLook;
  mode?: ViewMode;
  // 켬(aria-pressed="true")
  pressed?: boolean;
  // 끔일 때의 아이콘 · 켬일 때의 아이콘(없으면 같은 아이콘 — 모으기 단추)
  icon: ToggleIcon;
  pressedIcon?: ToggleIcon;
  tone?: ToggleTone;
  // 멈춘 그림 — 없으면 실제 단추
  state?: ToggleState;
  disabled?: boolean;
  ariaLabel: string;
  onPressedChange?: (pressed: boolean) => void;
  // 상태를 그리는 이동 단추(순자산 카드의 금액 가리기 눈 — Toggle 이 아니다, 2026-10-16 Q-017-2b A · 3c B) — aria-pressed 를 두지 않고
  // 누르면 onActivate(설정으로 간다). 아이콘은 icon(그 카드가 가려졌는지), 선은 끔 굵기 그대로
  link?: boolean;
  onActivate?: () => void;
  // 누르는 영역(44)을 점선으로 보이기(그림 전용)
  showHit?: { fill: string; line: string };
  // 툴팁 · 말풍선 트리거 — 단추 요소와 aria · 포인터 처리를 넘긴다
  buttonRef?: Ref<HTMLButtonElement>;
  rootProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  style?: CSSProperties;
  // 상자 안쪽에 더 그릴 것(Anatomy 핀)
  decor?: ReactNode;
};

export function ToggleView({ look, mode = 'auto', pressed: pressedProp = false, icon, pressedIcon, tone = 'default', state, disabled = false, ariaLabel, onPressedChange, link = false, onActivate, showHit, buttonRef, rootProps, style, decor }: ToggleViewProps) {
  const pressed = link ? false : pressedProp;
  const live = state === undefined;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const reduce = useReducedMotion();
  const inner = useRef<HTMLButtonElement | null>(null);
  const off = disabled || state === 'disabled';
  const shown: ToggleState = live ? (off ? 'disabled' : press ? 'pressed' : hover ? 'hovered' : 'enabled') : state;
  const focused = live ? ring && !off : state === 'focused';
  const inverted = tone === 'inverted';
  // 바탕 — 누름 · 호버에만(브랜드 채움 위는 짝이 없어 칠하지 않는다)
  const bg = inverted ? 'transparent' : shown === 'pressed' ? icv(look.pressBg, mode) : shown === 'hovered' ? icv(look.hoverBg, mode) : 'transparent';
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, look.size, look.size) : 1;
  const fg = shown === 'disabled' ? look.fg.disabled : inverted ? look.fg.inverted : pressed ? look.fg.on : look.fg.off;
  const Glyph = GLYPHS[pressed && pressedIcon ? pressedIcon : icon];
  const ext = (look.touch - look.size) / 2;
  const box: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    width: look.size,
    height: look.size,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: look.radius,
    background: bg,
    color: icv(fg, mode),
    cursor: live ? (off ? 'not-allowed' : 'pointer') : undefined,
    outlineStyle: focused ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineOffset: look.ring.offset,
    outlineColor: icv(inverted ? look.ringInverted : look.ring.color, mode),
    transform: scale === 1 ? 'none' : `scale(${scale})`,
    transitionProperty: 'background-color, transform',
    transitionDuration: `${look.colorMotion.duration}, ${look.press.motion.duration}`,
    transitionTimingFunction: `${look.colorMotion.easing}, ${look.press.motion.easing}`,
    WebkitTapHighlightColor: 'transparent',
    // 누르는 영역 보이기(그림) — 보이는 상자 바깥 둘레만 칠한다(상자 안은 그대로 보이게)
    boxShadow: showHit ? `0 0 0 ${ext}px ${showHit.fill}` : undefined,
    ...style,
  };
  const hit = <span aria-hidden data-toggle-hit style={{ position: 'absolute', top: -ext, right: -ext, bottom: -ext, left: -ext, borderRadius: look.radius + ext, ...(showHit ? { outline: `1px dashed ${showHit.line}` } : {}) }} />;
  const glyph = <Glyph aria-hidden size={look.icon} strokeWidth={pressed ? look.stroke.on : look.stroke.off} style={{ position: 'relative', display: 'block', flexShrink: 0 }} />;
  if (!live)
    return (
      <span aria-hidden data-toggle={pressed ? 'on' : 'off'} style={box}>
        {hit}
        {glyph}
        {decor}
      </span>
    );
  return (
    <button
      {...rootProps}
      ref={(el) => {
        inner.current = el;
        if (typeof buttonRef === 'function') buttonRef(el);
        else if (buttonRef) (buttonRef as { current: HTMLButtonElement | null }).current = el;
      }}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={link ? undefined : pressed}
      disabled={off}
      data-toggle={pressed ? 'on' : 'off'}
      style={box}
      onPointerEnter={(e) => {
        rootProps?.onPointerEnter?.(e);
        if (e.pointerType === 'mouse') setHover(true);
      }}
      onPointerLeave={(e) => {
        rootProps?.onPointerLeave?.(e);
        setHover(false);
        setPress(false);
      }}
      onPointerDown={(e) => {
        rootProps?.onPointerDown?.(e);
        if (e.button === 0) setPress(true);
      }}
      onPointerUp={(e) => {
        rootProps?.onPointerUp?.(e);
        setPress(false);
      }}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => {
        rootProps?.onFocus?.(e);
        setRing(e.currentTarget.matches(':focus-visible'));
      }}
      onBlur={(e) => {
        rootProps?.onBlur?.(e);
        setRing(false);
      }}
      onClick={(e) => {
        rootProps?.onClick?.(e);
        // 손을 뗄 때 바로 바뀐다 — 요청을 기다리지 않는다. 이동 단추는 켜고 끄지 않고 onActivate
        if (link) onActivate?.();
        else onPressedChange?.(!pressed);
      }}
    >
      {hit}
      {glyph}
      {decor}
    </button>
  );
}
