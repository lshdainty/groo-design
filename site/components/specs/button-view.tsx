'use client';
// 스펙대로 그린 버튼 — ButtonLook(button.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 고정해 보여 주고, 'live' 면 실제로 호버 · 누름 · 키보드 포커스에 반응한다.
import { useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  EllipsisVertical,
  Eye,
  EyeOff,
  Filter,
  Heart,
  Info,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { ButtonLook, ButtonState } from './button-look';
import { PcArc } from './pc-arc';

const ICONS = {
  plus: Plus,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'chevron-down': ChevronDown,
  'arrow-right': ArrowRight,
  search: Search,
  trash: Trash2,
  share: Share2,
  heart: Heart,
  bell: Bell,
  more: Ellipsis,
  check: Check,
  x: X,
  pencil: Pencil,
  filter: Filter,
  sliders: SlidersHorizontal,
  download: Download,
  settings: Settings,
  star: Star,
  calendar: Calendar,
  'more-vertical': EllipsisVertical,
  info: Info,
  eye: Eye,
  'eye-off': EyeOff,
  'rotate-ccw': RotateCcw,
  moon: Moon,
  upload: Upload,
};
export type IconName = keyof typeof ICONS;

export function Icon({ name, size, color }: { name: IconName; size: number; color?: string }) {
  const C = ICONS[name];
  return <C size={size} strokeWidth={2.2} color={color} aria-hidden style={{ flexShrink: 0 }} />;
}

export type ButtonViewProps = {
  look: ButtonLook;
  // auto 면 사이트의 라이트 · 다크 전환을 따른다(색 값을 둘 다 싣고 CSS 가 고른다 — global.css 의 .pbtn)
  mode?: 'light' | 'dark' | 'auto';
  state?: ButtonState | 'live';
  label?: ReactNode;
  prefix?: IconName;
  suffix?: IconName;
  icon?: IconName;
  // 아이콘만 있는 버튼에 이름 대신 직접 그린 아이콘(알림 점 · 숫자를 감싼 아이콘처럼) — 크기는 부르는 쪽이 이 버튼의 아이콘 크기(faces.*.icon)로 맞춘다
  iconNode?: ReactNode;
  fill?: boolean;
  width?: number | string;
  flush?: 'left' | 'right';
  // 긴 라벨을 말줄임으로 자른다(나쁜 예를 그릴 때)
  truncate?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  style?: CSSProperties;
  // 메뉴 · 말풍선 · 툴팁을 여는 트리거 — 버튼 요소와 aria · 키 · 포인터 처리를 넘긴다(버튼의 호버 · 누름 · 링은 그대로)
  buttonRef?: Ref<HTMLButtonElement>;
  rootProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export function ButtonView({ look, mode = 'auto', state = 'live', label, prefix, suffix, icon, iconNode, fill, width, flush, truncate, ariaLabel, onClick, style, buttonRef, rootProps }: ButtonViewProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [focusRing, setFocusRing] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  const live = state === 'live';
  const shown: ButtonState = live ? (press ? 'pressed' : hover ? 'hovered' : 'enabled') : state;
  // 치수는 모드와 상관없다 — 라이트 값으로
  const f = look.faces[mode === 'dark' ? 'dark' : 'light'][shown];
  const iconOnly = look.combo.layout === 'iconOnly';
  const focused = state === 'focused' || (live && focusRing);
  const loading = shown === 'loading';
  const disabled = shown === 'disabled';
  // 가장자리 맞춤(flush) ghost 는 텍스트 버튼 — 배경 없이 글자색으로만 반응한다(button.md)
  const flushText = !!flush && look.combo.variant === 'ghost';
  // 색은 라이트(-l) · 다크(-d) 둘 다 — 모드를 정했으면 둘 다 그 모드 값
  const tone = (m: 'light' | 'dark') => {
    const t = look.faces[m][shown];
    return {
      bg: flushText ? 'transparent' : t.bg,
      fg: flushText && !disabled ? (shown === 'enabled' && !focused ? look.faces[m].enabled.fg : look.textPressedFg[m]) : t.fg,
      bd: t.border ?? 'transparent',
      ring: look.faces[m].focused.ring.color,
      track: t.progress.track,
      range: t.progress.range,
    };
  };
  const L = tone(mode === 'dark' ? 'dark' : 'light');
  const D = tone(mode === 'light' ? 'light' : 'dark');
  const vars = Object.fromEntries(
    (['bg', 'fg', 'bd', 'ring', 'track', 'range'] as const).flatMap((k) => [
      [`--pb-${k}-l`, L[k]],
      [`--pb-${k}-d`, D[k]],
    ]),
  ) as CSSProperties;

  // 누름 축소 — 기준 길이 max(높이, 폭 ÷ n, 최소) 에서 축소량만큼(Feedback 의 눌림 피드백)
  let scale: number | undefined;
  if (shown === 'pressed') {
    const w = size?.w ?? f.height * 2;
    const h = size?.h ?? f.height;
    const basis = Math.max(h, w / look.press.widthDivisor, look.press.minBasis);
    scale = (basis - look.press.distance) / basis;
  }

  const box: CSSProperties = {
    position: 'relative',
    display: fill ? 'flex' : 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    flexShrink: 0,
    height: f.height,
    width: fill ? '100%' : iconOnly ? f.width ?? f.height : width,
    // 여백은 한 속성으로 끝까지 적는다 — padding 뒤에 paddingLeft: undefined 를 두면 서버 HTML 에서는 빠지지만,
    // 브라우저가 그릴 때(다른 페이지에서 링크로 들어올 때) React 가 그 값을 ''로 지워 좌우 여백이 0 이 된다.
    padding: iconOnly ? f.padX : `0 ${flush === 'right' ? 0 : f.padX}px 0 ${flush === 'left' ? 0 : f.padX}px`,
    gap: f.gap,
    borderRadius: f.radius,
    border: f.borderWidth ? `${f.borderWidth}px solid var(--pb-bd)` : 'none',
    fontFamily: f.fontFamily,
    fontSize: f.fontSize,
    lineHeight: f.lineHeight,
    fontWeight: f.fontWeight,
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : loading ? 'progress' : 'pointer',
    outline: focused ? `${f.ring.width}px solid var(--pb-ring)` : 'none',
    outlineOffset: f.ring.offset,
    transform: scale ? `scale(${scale})` : undefined,
    transition: `background-color ${f.duration.color} ${f.easing.color}, color ${f.duration.color} ${f.easing.color}, transform ${f.duration.scale} ${f.easing.scale}`,
    WebkitTapHighlightColor: 'transparent',
    ...vars,
    ...style,
  };
  const inner = loading ? 'transparent' : undefined;

  return (
    <button
      {...rootProps}
      ref={buttonRef}
      type="button"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={live ? 0 : -1}
      className="pbtn"
      data-mode={mode}
      style={box}
      onPointerEnter={
        live
          ? (e) => {
              rootProps?.onPointerEnter?.(e);
              setHover(true);
            }
          : rootProps?.onPointerEnter
      }
      onPointerLeave={
        live
          ? (e) => {
              rootProps?.onPointerLeave?.(e);
              setHover(false);
              setPress(false);
            }
          : rootProps?.onPointerLeave
      }
      onPointerDown={
        live
          ? (e) => {
              rootProps?.onPointerDown?.(e);
              const r = e.currentTarget.getBoundingClientRect();
              setSize({ w: r.width, h: r.height });
              setPress(true);
            }
          : rootProps?.onPointerDown
      }
      onPointerUp={
        live
          ? (e) => {
              rootProps?.onPointerUp?.(e);
              setPress(false);
            }
          : rootProps?.onPointerUp
      }
      onFocus={
        live
          ? (e) => {
              rootProps?.onFocus?.(e);
              setFocusRing(e.currentTarget.matches(':focus-visible'));
            }
          : rootProps?.onFocus
      }
      onBlur={
        live
          ? (e) => {
              rootProps?.onBlur?.(e);
              setFocusRing(false);
            }
          : rootProps?.onBlur
      }
      onClick={
        live
          ? (e) => {
              rootProps?.onClick?.(e);
              onClick?.();
            }
          : undefined
      }
    >
      {prefix && !iconOnly && <Icon name={prefix} size={f.icon} color={inner} />}
      {iconOnly && (icon || iconNode) ? (
        (iconNode ?? (icon && <Icon name={icon} size={f.icon} color={inner} />))
      ) : (
        <span style={{ color: inner, ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 } : {}) }}>{label}</span>
      )}
      {suffix && !iconOnly && <Icon name={suffix} size={f.icon} color={inner} />}
      {loading && (
        // 로딩 원 — Progress Circle(값 없는 원 · inherit): 크기 · 두께 · 색은 button.yaml 의 progressCircle, 움직임은 progress-circle.yaml
        <span aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', width: f.progress.size, height: f.progress.size, marginLeft: -f.progress.size / 2, marginTop: -f.progress.size / 2 }}>
          <PcArc size={f.progress.size} thickness={f.progress.thickness} track="var(--pb-track)" range="var(--pb-range)" />
        </span>
      )}
    </button>
  );
}

// 로딩을 눌러 보는 버튼 — 누르면 잠시 로딩이 됐다가 돌아온다(누르기는 그동안 막힌다)
export function LoadingDemo({ look, label, mode = 'auto', ms = 1600 }: { look: ButtonLook; label: string; mode?: 'light' | 'dark' | 'auto'; ms?: number }) {
  const [busy, setBusy] = useState(false);
  return (
    <ButtonView
      look={look}
      mode={mode}
      label={label}
      state={busy ? 'loading' : 'live'}
      onClick={() => {
        if (busy) return;
        setBusy(true);
        setTimeout(() => setBusy(false), ms);
      }}
    />
  );
}

// 누른 동작이 끝날 때까지 한 번(button.yaml root.press) — 누르면 잠깐 걸리는 동작(Promise)을 부르고, 그것이 끝나기 전의 누름은 버린다.
// 잠금은 보이지 않는다(로딩 원을 걸지 않는다) — 부른 횟수 · 버린 누름을 아래 글로 센다. 레시피 button.tsx 의 handleClick 과 같은 셈
export function PressLockDemo({ look, label, ms = 1200 }: { look: ButtonLook; label: string; ms?: number }) {
  const inFlight = useRef(false);
  const [calls, setCalls] = useState(0);
  const [dropped, setDropped] = useState(0);
  const [running, setRunning] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <ButtonView
        look={look}
        label={label}
        onClick={() => {
          if (inFlight.current) {
            setDropped((n) => n + 1);
            return;
          }
          inFlight.current = true;
          setRunning(true);
          setCalls((n) => n + 1);
          void new Promise((done) => setTimeout(done, ms)).finally(() => {
            inFlight.current = false;
            setRunning(false);
          });
        }}
      />
      <span className="text-[12px] leading-4 pk-muted" aria-live="polite">
        부른 횟수 {calls} · 버린 누름 {dropped}
        {running ? ' · 동작이 끝나기를 기다리는 중' : ''}
      </span>
    </div>
  );
}
