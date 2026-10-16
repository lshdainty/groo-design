'use client';
// 스펙대로 그린 Chip — ChipLook(chip.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 멈춘 그림, 안 주면 실제로 호버 · 누름 · 키보드 포커스에 반응한다(버튼 · 라디오 · 체크박스).
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
// 테두리는 안쪽 1px(box-shadow inset), 키보드 포커스는 바깥 링(outline), 누르는 영역은 칩 안의 투명한 층을 세로로 넓힌다.
import { Children, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  Bell,
  Bus,
  CalendarDays,
  ChevronDown,
  Coffee,
  CreditCard,
  Film,
  RotateCcw,
  Search,
  ShoppingBag,
  Stethoscope,
  Tag,
  User,
  Utensils,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ccv, faceOf, pressRatio, type ChipColor, type ChipIcon, type ChipLook, type ChipPart, type ChipSize, type ChipState, type ChipVariant, type ViewMode } from './chip-shared';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';
import { fogMaskStyle } from './overlay-shared';

const ICONS: Record<ChipIcon, LucideIcon> = {
  'chevron-down': ChevronDown,
  x: X,
  'rotate-ccw': RotateCcw,
  calendar: CalendarDays,
  tag: Tag,
  'credit-card': CreditCard,
  utensils: Utensils,
  coffee: Coffee,
  bus: Bus,
  'shopping-bag': ShoppingBag,
  film: Film,
  stethoscope: Stethoscope,
  'arrow-up-right': ArrowUpRight,
  'arrow-down-left': ArrowDownLeft,
  'arrow-left-right': ArrowLeftRight,
  banknote: Banknote,
  user: User,
  bell: Bell,
  search: Search,
};

export function ChipIconView({ name, size, color, style }: { name: ChipIcon; size: number; color?: string; style?: CSSProperties }) {
  const I = ICONS[name];
  return <I aria-hidden size={size} strokeWidth={2} style={{ display: 'block', flexShrink: 0, color, ...style }} />;
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

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
// Anatomy 핀 — 칩 위로 이만큼 띄운다(그림 장식)
const PIN_GAP = 12;

function setRef<T>(r: Ref<T> | undefined, el: T | null) {
  if (typeof r === 'function') r(el);
  else if (r) (r as { current: T | null }).current = el;
}

// 칩의 겉 — 크기 · 색 · 링 · 축소. 칩(ChipView)과 입력값 칩(InputChipView)이 같이 쓴다
function chipBox(look: ChipLook, size: ChipSize, mode: ViewMode, face: { bg: ChipColor; fg: ChipColor; border: { color: ChipColor; width: number } | null; cursor: string }, o: { iconOnly: boolean; ring: boolean; scale: number }): CSSProperties {
  const sz = look.sizes[size];
  const m = look.motion;
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    boxSizing: 'border-box',
    height: sz.h,
    minWidth: o.iconOnly ? undefined : sz.minW,
    width: o.iconOnly ? sz.iconOnlyW : undefined,
    maxWidth: look.maxWidth,
    margin: 0,
    padding: o.iconOnly ? 0 : `0 ${sz.padX}px`,
    gap: look.gap,
    border: 0,
    borderRadius: look.radius,
    background: ccv(face.bg, mode),
    color: ccv(face.fg, mode),
    boxShadow: face.border ? `inset 0 0 0 ${face.border.width}px ${ccv(face.border.color, mode)}` : 'none',
    fontFamily: FONT,
    fontSize: look.text.fontSize,
    lineHeight: look.text.lineHeight,
    fontWeight: look.text.fontWeight,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: face.cursor,
    userSelect: 'none',
    outline: o.ring ? `${look.ring.width}px solid ${ccv(look.ring.color, mode)}` : 'none',
    outlineOffset: look.ring.offset,
    transform: o.scale !== 1 ? `scale(${o.scale})` : undefined,
    transition: `background-color ${m.color.duration} ${m.color.easing}, color ${m.color.duration} ${m.color.easing}, box-shadow ${m.color.duration} ${m.color.easing}, transform ${m.scale.duration} ${m.scale.easing}`,
    WebkitTapHighlightColor: 'transparent',
  };
}

// 글 — 칩이 줄 폭(look.maxWidth)에 닿을 때만 끝을 말줄임한다. 핀은 바깥 칸에 두어 잘리지 않게
const LABEL_FIT: CSSProperties = { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

// 핀 — 부위 위(칩 위로 PIN_GAP)에 핀 + 세로 선. inset 은 칩 위 끝에서 부위 위 끝까지
function PinAbove({ pin, inset, line }: { pin?: ReactNode; inset: number; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
      {pin}
      <span style={{ width: 1, height: PIN_GAP + inset, background: line }} />
    </span>
  );
}
function PinLeft({ pin, line }: { pin?: ReactNode; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
      {pin}
      <span style={{ width: PIN_GAP, height: 1, background: line }} />
    </span>
  );
}

// 누르는 영역 — 보이는 칩과 따로, 가로 · 세로로 look.touch 까지(칩 안의 층이라 누르면 칩이 눌린다).
// 글이 있는 칩은 최소 폭이 이미 넘어 세로만, 아이콘만 있는 칩은 가로도 넓어진다
function Target({ look, size, style }: { look: ChipLook; size: ChipSize; style?: CSSProperties }) {
  const h = Math.max(look.touch.h, look.sizes[size].h);
  return (
    <span
      aria-hidden
      data-chip-target
      style={{ position: 'absolute', left: '50%', top: '50%', width: '100%', minWidth: look.touch.w, height: h, transform: 'translate(-50%, -50%)', borderRadius: look.radius, ...style }}
    />
  );
}

export type ChipViewProps = {
  look: ChipLook;
  mode?: ViewMode;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  // 멈춘 그림 — 없으면 실제 칩(호버 · 누름 · 키보드 포커스에 반응한다)
  state?: ChipState;
  disabled?: boolean;
  label?: ReactNode;
  prefixIcon?: ChipIcon;
  suffixIcon?: ChipIcon;
  // 아이콘만 있는 칩 — 이름(ariaLabel) 필수
  icon?: ChipIcon;
  ariaLabel?: string;
  // 실제 칩의 뜻 — 버튼(제안 · 여는 칩) · 라디오(하나 고르기) · 체크박스(여럿 고르기) · 탭(Chip Tabs — 고름은 aria-selected)
  role?: 'button' | 'radio' | 'checkbox' | 'tab';
  id?: string;
  haspopup?: 'dialog';
  expanded?: boolean;
  controls?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: Ref<HTMLButtonElement>;
  // 나쁜 예 — 칩 하나만 다른 색(3상태 칩의 "빼고")
  paint?: { bg: ChipColor; fg: ChipColor; border: ChipColor };
  strike?: boolean;
  // 그림 — 부위마다 칠 · 핀, 누르는 영역 보이기(target 에 칠을 주면 그린다)
  zone?: Partial<Record<ChipPart, CSSProperties>>;
  pins?: Partial<Record<ChipPart, ReactNode>>;
  pinLine?: string;
  style?: CSSProperties;
};

export function ChipView({
  look,
  mode = 'auto',
  variant = look.defaults.variant,
  size = look.defaults.size,
  selected = false,
  state,
  disabled: disabledProp = false,
  label,
  prefixIcon,
  suffixIcon,
  icon,
  ariaLabel,
  role = 'button',
  id,
  haspopup,
  expanded,
  controls,
  tabIndex,
  onClick,
  onKeyDown,
  buttonRef,
  paint,
  strike,
  zone,
  pins,
  pinLine = 'currentColor',
  style,
}: ChipViewProps) {
  const live = state === undefined;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const disabled = live ? disabledProp : state === 'disabled';
  const shown: ChipState = live ? (disabled ? 'disabled' : press ? 'pressed' : hover ? 'hovered' : 'enabled') : state;
  const focused = live ? ring && !disabled : state === 'focused';
  const sz = look.sizes[size];
  const iconOnly = !!icon && label === undefined;

  // 멈춘 누름 — 그린 폭으로 축소 배율을 셈한다(재기 전에는 높이로)
  useIsoLayoutEffect(() => {
    if (live || shown !== 'pressed' || !ref.current) return;
    setBox({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [live, shown]);
  const scale = shown === 'pressed' && !reduce ? pressRatio(look.press, box?.w ?? sz.h, sz.h) : 1;

  const base = faceOf(look, variant, selected, shown);
  const face = paint && !disabled ? { ...base, bg: paint.bg, fg: paint.fg, border: { color: paint.border, width: base.border?.width ?? 1 } } : base;
  const css: CSSProperties = { ...chipBox(look, size, mode, face, { iconOnly, ring: focused, scale }), ...zone?.root, ...style };
  const lh = parseFloat(look.text.lineHeight);

  const inner = (
    <>
      {(live || zone?.target) && <Target look={look} size={size} style={zone?.target} />}
      <PinLeft pin={pins?.root} line={pinLine} />
      {iconOnly && icon ? (
        <span style={{ position: 'relative', display: 'flex', ...zone?.icon }}>
          <ChipIconView name={icon} size={sz.icon} />
          <PinAbove pin={pins?.icon} inset={(sz.h - sz.icon) / 2} line={pinLine} />
        </span>
      ) : (
        <>
          {prefixIcon && (
            <span style={{ position: 'relative', display: 'flex', ...zone?.prefix }}>
              <ChipIconView name={prefixIcon} size={sz.prefixIcon} />
              <PinAbove pin={pins?.prefix} inset={(sz.h - sz.prefixIcon) / 2} line={pinLine} />
            </span>
          )}
          <span style={{ position: 'relative', display: 'flex', minWidth: 0, ...zone?.label }}>
            <span style={{ ...LABEL_FIT, textDecoration: strike ? 'line-through' : undefined }}>{label}</span>
            <PinAbove pin={pins?.label} inset={(sz.h - lh) / 2} line={pinLine} />
          </span>
          {suffixIcon && (
            <span style={{ position: 'relative', display: 'flex', ...zone?.suffix }}>
              <ChipIconView name={suffixIcon} size={sz.suffixIcon} />
              <PinAbove pin={pins?.suffix} inset={(sz.h - sz.suffixIcon) / 2} line={pinLine} />
            </span>
          )}
        </>
      )}
    </>
  );
  const data = { 'data-chip': variant, 'data-size': size, 'data-selected': selected ? 'true' : 'false', 'data-state': focused ? 'focused' : shown };

  if (!live)
    return (
      <span ref={(el) => void (ref.current = el)} {...data} style={css}>
        {inner}
      </span>
    );

  const checkable = role === 'radio' || role === 'checkbox';
  return (
    <button
      ref={(el) => {
        ref.current = el;
        setRef(buttonRef, el);
      }}
      type="button"
      id={id}
      role={role === 'button' ? undefined : role}
      aria-checked={checkable ? selected : undefined}
      aria-selected={role === 'tab' ? selected : undefined}
      aria-haspopup={haspopup}
      aria-expanded={haspopup ? !!expanded : undefined}
      aria-controls={controls}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={tabIndex}
      {...data}
      style={css}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => (setHover(false), setPress(false))}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
        setPress(true);
      }}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => (setRing(false), setPress(false))}
      onKeyDown={(e) => {
        // 라디오 · 체크박스는 Space 로만 고른다(Enter 는 폼 제출 자리)
        if (checkable && e.key === 'Enter') e.preventDefault();
        if (e.key === ' ' && !e.repeat) {
          setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
          setPress(true);
        }
        onKeyDown?.(e);
      }}
      onKeyUp={(e) => e.key === ' ' && setPress(false)}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}

// ── 입력값 칩 — 글 + 뒤 지우기 버튼(칩 자체는 버튼이 아니다). 모습은 Outline Weak 고름 ──────────
export type InputChipViewProps = {
  look: ChipLook;
  mode?: ViewMode;
  size?: ChipSize;
  label: string;
  prefixIcon?: ChipIcon;
  // 멈춘 그림 — 없으면 지우기가 실제 버튼. pressed 는 지우기만 누른 모습(칩은 누름이 아니다)
  state?: 'enabled' | 'pressed' | 'focused' | 'disabled';
  disabled?: boolean;
  onRemove?: () => void;
  removeRef?: Ref<HTMLButtonElement>;
  zone?: Partial<Record<ChipPart, CSSProperties>>;
  pins?: Partial<Record<ChipPart, ReactNode>>;
  pinLine?: string;
};

export function InputChipView({ look, mode = 'auto', size = look.defaults.size, label, prefixIcon, state, disabled: disabledProp = false, onRemove, removeRef, zone, pins, pinLine = 'currentColor' }: InputChipViewProps) {
  const live = state === undefined;
  const [ring, setRing] = useState(false);
  const [press, setPress] = useState(false);
  const reduce = useReducedMotion();
  const disabled = live ? disabledProp : state === 'disabled';
  const focused = live ? ring && !disabled : state === 'focused';
  // 지우기 누름 — 지우기만 따로 준다(호버 바탕은 없다). 모션 줄이기면 주지 않는다
  const pressedNow = !disabled && (live ? press : state === 'pressed');
  const removeScale = pressedNow && !reduce ? look.removeScale : 1;
  const sz = look.sizes[size];
  const face = faceOf(look, 'outlineWeak', true, disabled ? 'disabled' : 'enabled');
  const t = look.removeTarget;
  const lh = parseFloat(look.text.lineHeight);
  // 지우기 — 보이는 아이콘은 크기마다, 누르는 영역은 t × t(아이콘 둘레로 넓혀 자리는 아이콘만큼만 차지한다)
  const hit: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
    width: t,
    height: t,
    margin: -(t - sz.removeIcon) / 2,
    padding: 0,
    border: 0,
    borderRadius: look.radius,
    background: 'transparent',
    color: 'currentColor',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transform: removeScale !== 1 ? `scale(${removeScale})` : undefined,
    transition: `transform ${look.motion.scale.duration} ${look.motion.scale.easing}`,
    WebkitTapHighlightColor: 'transparent',
    ...zone?.remove,
  };
  const glyph = <ChipIconView name="x" size={sz.removeIcon} />;
  return (
    <span data-chip="input" data-size={size} data-selected="true" data-state={focused ? 'focused' : disabled ? 'disabled' : pressedNow ? 'pressed' : 'enabled'} style={{ ...chipBox(look, size, mode, { ...face, cursor: 'default' }, { iconOnly: false, ring: focused, scale: 1 }), ...zone?.root }}>
      <PinLeft pin={pins?.root} line={pinLine} />
      {prefixIcon && (
        <span style={{ position: 'relative', display: 'flex', ...zone?.prefix }}>
          <ChipIconView name={prefixIcon} size={sz.prefixIcon} />
        </span>
      )}
      <span style={{ position: 'relative', display: 'flex', minWidth: 0, ...zone?.label }}>
        <span style={LABEL_FIT}>{label}</span>
        <PinAbove pin={pins?.label} inset={(sz.h - lh) / 2} line={pinLine} />
      </span>
      {live ? (
        <button
          ref={removeRef}
          type="button"
          aria-label={`${label} 지우기`}
          disabled={disabled}
          style={hit}
          onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => (setRing(false), setPress(false))}
          onPointerDown={(e) => e.button === 0 && setPress(true)}
          onPointerUp={() => setPress(false)}
          onPointerLeave={() => setPress(false)}
          onPointerCancel={() => setPress(false)}
          onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && setPress(true)}
          onKeyUp={() => setPress(false)}
          onClick={onRemove}
        >
          {glyph}
        </button>
      ) : (
        <span aria-hidden style={hit}>
          {glyph}
          <PinAbove pin={pins?.remove} inset={(sz.h - t) / 2} line={pinLine} />
        </span>
      )}
    </span>
  );
}

// ── 묶음 — 줄바꿈(폼 · 시트 안) · 한 줄 가로 스크롤(목록 위 필터 바 · 제안 줄) ──────────
export type ChipGroupViewProps = {
  look: ChipLook;
  layout?: 'wrap' | 'scroll';
  mode?: ViewMode;
  children: ReactNode;
  role?: 'radiogroup' | 'group';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  // 가로 스크롤 — 안쪽 좌우는 늘 화면 여백. bleed 면 줄을 둘레 여백만큼 바깥으로 내 화면 끝까지(레시피의 bleed).
  // 양 끝은 늘 흐린다(Scroll Fog row — 마스크, 따로 켜지 않는다)
  bleed?: boolean;
  groupRef?: Ref<HTMLDivElement>;
  tabIndex?: number;
  style?: CSSProperties;
};

export function ChipGroupView({ look, layout = 'wrap', mode = 'auto', children, role, ariaLabel, ariaLabelledby, ariaDescribedby, bleed = true, groupRef, tabIndex, style }: ChipGroupViewProps) {
  const g = look.group;
  const r = look.scrollRow;
  // 묶음도 키보드 포커스에 링을 그린다(입력값 칩을 다 지우면 포커스가 묶음으로 온다) — 모서리 없이 묶음 둘레
  const [ring, setRing] = useState(false);
  const focus = {
    onFocus: (e: FocusEvent<HTMLDivElement>) => e.target === e.currentTarget && setRing(e.currentTarget.matches(':focus-visible')),
    onBlur: (e: FocusEvent<HTMLDivElement>) => e.target === e.currentTarget && setRing(false),
  };
  const outline: CSSProperties = ring ? { outlineWidth: g.ring.width, outlineStyle: 'solid', outlineColor: ccv(g.ring.color, mode), outlineOffset: g.ring.offset } : { outlineStyle: 'none' };
  // 이름이 있는 묶음은 group(하나 고르기는 radiogroup) — 이름만 붙은 div 는 읽히지 않는다
  const aria = { role: role ?? (ariaLabel || ariaLabelledby ? 'group' : undefined), 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, tabIndex };
  // 비었을 때 — 칩 한 줄 높이를 남긴다(링이 납작한 선이 되지 않게)
  const empty = Children.toArray(children).length === 0;
  if (layout === 'wrap')
    return (
      <div
        ref={groupRef}
        {...aria}
        {...focus}
        data-chip-group="wrap"
        data-ring={ring || undefined}
        style={{ display: 'flex', flexWrap: 'wrap', columnGap: g.gap, rowGap: g.rowGap, minHeight: empty ? g.minHeight : undefined, ...outline, ...style }}
      >
        {children}
      </div>
    );
  // 가로 스크롤 줄 — 두 겹. 바깥 묶음(이름 · 링 · bleed)은 부모의 위아래 간격을 그대로 받고, 안쪽 스크롤 칸이 위아래 padY 를 바깥 marginY 로 되돌려
  // 줄 높이는 칩 그대로다. bleed 면 바깥을 화면 여백만큼 내 화면 끝까지 스크롤하고, 첫 칩은 안쪽 padX(화면 여백)에서 시작한다.
  // 스크롤 칸의 양 끝은 늘 흐리다(Scroll Fog row — gradient-fade-mask 마스크, 스크롤 위치와 상관없이). 안쪽 여백이 흐림보다 넓어 처음 · 끝 칩은 흐리지 않는다
  return (
    <div
      ref={groupRef}
      {...aria}
      {...focus}
      data-chip-group="scroll"
      data-ring={ring || undefined}
      style={{ position: 'relative', marginLeft: bleed ? -r.padX : 0, marginRight: bleed ? -r.padX : 0, minHeight: empty ? g.minHeight : undefined, ...outline, ...style }}
    >
      <div
        data-chip-scroll
        style={{
          display: 'flex',
          columnGap: g.gap,
          overflowX: r.overflowX as CSSProperties['overflowX'],
          scrollbarWidth: 'none',
          paddingTop: r.padY,
          paddingBottom: r.padY,
          paddingLeft: r.padX,
          paddingRight: r.padX,
          marginTop: r.marginY,
          marginBottom: r.marginY,
          scrollPaddingLeft: r.scrollPadding,
          scrollPaddingRight: r.scrollPadding,
          ...fogMaskStyle(r.mask, { left: r.fog, right: r.fog }),
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── 실제 묶음 ───────────────────────────────────────────
export type ChipItem = { value: string; label: string; icon?: ChipIcon; disabled?: boolean };
type LiveGroupProps = {
  look: ChipLook;
  mode?: ViewMode;
  variant?: ChipVariant;
  size?: ChipSize;
  items: ChipItem[];
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  layout?: 'wrap' | 'scroll';
};

// 하나 고르기 — radiogroup. 고른 칩을 다시 눌러도 그대로, 화살표로 옮기며 고른다. Tab 은 고른 칩 하나에만 선다
export function ChipRadioGroupLive({ value, defaultValue, onValue, ...p }: LiveGroupProps & { value?: string; defaultValue?: string; onValue?: (v: string) => void }) {
  const [inner, setInner] = useState(defaultValue);
  const cur = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const on = (i: number) => !p.disabled && !p.items[i].disabled;
  const set = (v: string) => {
    if (value === undefined) setInner(v);
    onValue?.(v);
  };
  const move = (from: number, dir: 1 | -1) => {
    const n = p.items.length;
    for (let k = 1; k <= n; k++) {
      const i = (from + dir * k + n) % n;
      if (on(i)) {
        set(p.items[i].value);
        refs.current[i]?.focus();
        return;
      }
    }
  };
  const picked = p.items.findIndex((it, i) => it.value === cur && on(i));
  const stop = picked >= 0 ? picked : p.items.findIndex((_, i) => on(i));
  return (
    <ChipGroupView look={p.look} mode={p.mode} layout={p.layout} role="radiogroup" ariaLabel={p.ariaLabel} ariaLabelledby={p.ariaLabelledby} ariaDescribedby={p.ariaDescribedby}>
      {p.items.map((it, i) => (
        <ChipView
          key={it.value}
          look={p.look}
          mode={p.mode}
          variant={p.variant}
          size={p.size}
          role="radio"
          selected={it.value === cur}
          disabled={p.disabled || it.disabled}
          label={it.label}
          prefixIcon={it.icon}
          tabIndex={i === stop ? 0 : -1}
          buttonRef={(el) => void (refs.current[i] = el)}
          onClick={() => set(it.value)}
          onKeyDown={(e) => {
            const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
            if (!dir) return;
            e.preventDefault();
            move(i, dir);
          }}
        />
      ))}
    </ChipGroupView>
  );
}

// 여럿 고르기 — 체크박스. 다시 누르면 풀린다. 칩마다 Tab 이 선다
export function ChipToggleGroupLive({ value, defaultValue = [], onValue, ...p }: LiveGroupProps & { value?: string[]; defaultValue?: string[]; onValue?: (v: string[]) => void }) {
  const [inner, setInner] = useState(defaultValue);
  const cur = value ?? inner;
  const toggle = (v: string) => {
    const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
    if (value === undefined) setInner(next);
    onValue?.(next);
  };
  return (
    <ChipGroupView look={p.look} mode={p.mode} layout={p.layout} role="group" ariaLabel={p.ariaLabel} ariaLabelledby={p.ariaLabelledby} ariaDescribedby={p.ariaDescribedby}>
      {p.items.map((it) => (
        <ChipView
          key={it.value}
          look={p.look}
          mode={p.mode}
          variant={p.variant}
          size={p.size}
          role="checkbox"
          selected={cur.includes(it.value)}
          disabled={p.disabled || it.disabled}
          label={it.label}
          prefixIcon={it.icon}
          onClick={() => toggle(it.value)}
        />
      ))}
    </ChipGroupView>
  );
}

// 제안 — 누르면 값을 넣는 버튼. 고른 모습이 없다
export function ChipSuggestLive({ onPick, ...p }: LiveGroupProps & { onPick: (v: string) => void }) {
  return (
    <ChipGroupView look={p.look} mode={p.mode} layout={p.layout} ariaLabel={p.ariaLabel} ariaLabelledby={p.ariaLabelledby}>
      {p.items.map((it) => (
        <ChipView key={it.value} look={p.look} mode={p.mode} variant={p.variant} size={p.size} disabled={p.disabled || it.disabled} label={it.label} prefixIcon={it.icon} onClick={() => onPick(it.value)} />
      ))}
    </ChipGroupView>
  );
}

// 입력값 — 지우면 그 값만 뺀다. 포커스는 다음 칩의 지우기(없으면 앞 칩의 지우기, 그것도 없으면 묶음)로
export function InputChipGroupLive({ look, mode, size, items, onRemove, disabled, ariaLabel, ariaLabelledby, ariaDescribedby }: Omit<LiveGroupProps, 'variant' | 'layout'> & { onRemove: (v: string) => void }) {
  const refs = useRef(new Map<string, HTMLButtonElement | null>());
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [focusNext, setFocusNext] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (focusNext === undefined) return;
    (focusNext ? refs.current.get(focusNext) : groupRef.current)?.focus();
    setFocusNext(undefined);
  }, [focusNext, items]);
  const live = (it: ChipItem) => !disabled && !it.disabled;
  const remove = (i: number) => {
    const after = items.slice(i + 1).find(live);
    const before = items.slice(0, i).reverse().find(live);
    onRemove(items[i].value);
    setFocusNext((after ?? before)?.value ?? null);
  };
  return (
    <ChipGroupView
      look={look}
      mode={mode}
      role="group"
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      groupRef={groupRef}
      tabIndex={-1}
    >
      {items.map((it, i) => (
        <InputChipView
          key={it.value}
          look={look}
          mode={mode}
          size={size}
          label={it.label}
          prefixIcon={it.icon}
          disabled={disabled || it.disabled}
          removeRef={(el) => void refs.current.set(it.value, el)}
          onRemove={() => remove(i)}
        />
      ))}
    </ChipGroupView>
  );
}

// ── Field 와 함께 — 라벨이 묶음의 이름(aria-labelledby), 설명 · 오류가 묶음의 설명(aria-describedby) ──────────
export function ChipField({
  field,
  mode = 'auto',
  label,
  description,
  errorMessage,
  invalid = false,
  children,
}: {
  field: TfFieldLook;
  mode?: ViewMode;
  label: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  children: (ids: { labelledBy: string; describedBy?: string }) => ReactNode;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const lid = `${id}-label`;
  const did = `${id}-desc`;
  const showError = invalid && !!errorMessage;
  return (
    <TfFieldView
      look={field}
      mode={mode}
      label={<span id={lid}>{label}</span>}
      description={description && !showError ? <span id={did}>{description}</span> : undefined}
      errorMessage={showError ? <span id={did}>{errorMessage}</span> : undefined}
      invalid={invalid}
    >
      {children({ labelledBy: lid, describedBy: showError || description ? did : undefined })}
    </TfFieldView>
  );
}
