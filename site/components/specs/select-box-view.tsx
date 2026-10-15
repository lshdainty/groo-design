'use client';
// 스펙대로 그린 Select Box — SbLook(select-box.yaml 을 푼 값)만 받아 그린다.
// 상자마다 state 를 주면 그 상태로 멈춘 그림, 안 주면 실제로 호버 · 누름 · 키보드 포커스에 반응하고 눌러서 고른다.
// 색은 라이트(-l) · 다크(-d) 값을 둘 다 싣고 CSS(global.css 의 .psb)가 사이트 모드에 맞춰 고른다.
// 상자는 세 층이다 — 상자(테두리 · 바탕, 줄지 않는다) · 누르는 자리(콘텐츠 + 컨트롤, 누르면 이 자리만 준다) · 펼침(그 아래).
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { InputButtonView } from './select-view';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Braces,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Clock,
  Coins,
  CreditCard,
  Divide,
  Download,
  FileText,
  Gift,
  Hash,
  Infinity as InfinityIcon,
  Landmark,
  List,
  Percent,
  PiggyBank,
  Repeat,
  Sheet,
  Shield,
  TrendingUp,
  Umbrella,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { CheckboxView } from './checkbox-view';
import { RadioView } from './radio-group-view';
import { SnackbarRegion, useSnackbarHost } from './feedback-view';
import { sbGroupVars, type BoxSpec, type SbFooter, type SbIcon, type SbLayout, type SbLook, type SbState } from './select-box-shared';

const ICONS: Record<SbIcon, LucideIcon> = {
  'file-text': FileText,
  sheet: Sheet,
  braces: Braces,
  infinity: InfinityIcon,
  hash: Hash,
  calendar: Calendar,
  'calendar-range': CalendarRange,
  'calendar-days': CalendarDays,
  'calendar-clock': CalendarClock,
  list: List,
  divide: Divide,
  percent: Percent,
  coins: Coins,
  'arrow-down-left': ArrowDownLeft,
  'arrow-up-right': ArrowUpRight,
  'arrow-left-right': ArrowLeftRight,
  wallet: Wallet,
  'credit-card': CreditCard,
  landmark: Landmark,
  user: User,
  users: Users,
  shield: Shield,
  clock: Clock,
  repeat: Repeat,
  download: Download,
  gift: Gift,
  umbrella: Umbrella,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
};

export type ViewMode = 'light' | 'dark' | 'auto';
const pickL = (mode: ViewMode) => (mode === 'dark' ? 'dark' : 'light');
const pickD = (mode: ViewMode) => (mode === 'light' ? 'light' : 'dark');

// 모션 줄이기면 누르는 자리의 축소를 빼고, 펼침은 높이를 바로 바꾼다(투명도만)
function useReducedMotion() {
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

type BoxProps = {
  look: SbLook;
  box: BoxSpec;
  kind: 'radio' | 'check';
  control: 'mark' | 'none';
  layout: SbLayout;
  mode: ViewMode;
  live: boolean;
  on: boolean;
  onToggle: () => void;
  onArrow?: (dir: 1 | -1) => void;
  tabIndex?: number;
  registerRef?: (el: HTMLDivElement | null) => void;
  // 그림의 상자 폭(재기 전 첫 그림 · 서버 그림에서 누름 배율을 셈한다)
  width: number;
  // 나쁜 예 — 상자 안 일부(컨트롤 · 글자)만 눌린다
  partialTarget?: boolean;
  // 누르는 영역을 칠해 보인다(가이드 그림 — 분홍)
  zone?: Zone;
};
export type Zone = { fill: string; line: string };

function Box({ look, box, kind, control, layout, mode, live, on, onToggle, onArrow, tabIndex, registerRef, width, partialTarget, zone }: BoxProps) {
  const { title, description, prefix, footer, footerVisibility = 'when-selected', disabled = false } = box;
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [size, setSize] = useState({ w: width, h: 0 });
  const trigRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const isLive = live && !box.state;

  useEffect(() => {
    const el = trigRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shown: SbState = box.state ?? (disabled ? 'disabled' : !isLive ? 'enabled' : press ? 'pressed' : hover ? 'hovered' : 'enabled');
  // 포커스는 링만 더한다 — 호버 · 누름과 겹칠 수 있다
  const focused = shown === 'focused' || (isLive && ring && !disabled);
  const st: SbState = shown === 'focused' ? 'enabled' : shown;
  const sel = on ? 'selected' : 'unselected';
  const L = look.faces[sel][pickL(mode)][st];
  const D = look.faces[sel][pickD(mode)][st];
  const f = L;
  const lay = look.layouts[box.layout ?? layout];
  const vars = {
    '--psb-bg-l': L.bg,
    '--psb-bg-d': D.bg,
    '--psb-bd-l': L.border.color,
    '--psb-bd-d': D.border.color,
    '--psb-title-l': L.label.color,
    '--psb-title-d': D.label.color,
    '--psb-desc-l': L.description.color,
    '--psb-desc-d': D.description.color,
    '--psb-icon-l': L.prefix.color,
    '--psb-icon-d': D.prefix.color,
    '--psb-ring-l': look.faces[sel][pickL(mode)].focused.ring.color,
    '--psb-ring-d': look.faces[sel][pickD(mode)].focused.ring.color,
  } as CSSProperties;

  // 누름 — 누르는 자리만 2px 거리. 기준 길이 max(높이, 폭 ÷ n, 최소)
  const h = size.h || lay.pad.top + lay.pad.bottom + parseFloat(String(f.label.lineHeight ?? f.label.fontSize));
  const basis = Math.max(h, size.w / look.press.widthDivisor, look.press.minBasis);
  const scale = f.scale && !reduce ? (basis - look.press.distance) / basis : 1;

  // 오른쪽 컨트롤 — 상자가 올려지거나 눌리면 컨트롤은 누름 색(축소 없음, 호버와 같은 색). 자기 포커스 링은 없다(링은 상자가)
  const markState = disabled ? 'disabled' : st === 'pressed' || st === 'hovered' ? 'hovered' : 'enabled';
  const mark =
    control === 'none' ? null : kind === 'radio' ? (
      <RadioView look={look.marks.radio} mode={mode} checked={on ? 'checked' : 'unchecked'} state={markState} ariaLabel={title} tabIndex={-1} />
    ) : (
      // 칸 없는 체크 — 상자가 누름 · 호버 바탕을 맡으므로 자기 바탕은 없다
      <CheckboxView look={look.marks.check} mode={mode} checked={on ? 'checked' : 'unchecked'} state={markState} ariaLabel={title} boxStyle={{ background: 'transparent' }} />
    );

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isLive || disabled) return;
    if (kind === 'radio' && ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      onArrow?.(e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (e.key === ' ') {
      e.preventDefault();
      if (!e.repeat) setPress(true);
    }
  };
  const onKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== ' ') return;
    setPress(false);
    if (isLive && !disabled) onToggle();
  };

  // 펼침 — 열 때 높이가 먼저, 닫을 때 투명도가 늦게(내용이 높이보다 먼저 사라지지 않게). 닫히면 보이지 않고 Tab 도 안 닿는다
  const open = footerVisibility === 'always' || (footerVisibility === 'when-selected' ? on : !on);
  const fm = look.motion.footer;
  const footerTransition = reduce
    ? `opacity ${fm.reducedFade} linear, visibility 0s linear ${open ? '0s' : fm.reducedFade}`
    : open
      ? `grid-template-rows ${fm.open.height.duration} ${fm.open.height.easing}, opacity ${fm.open.opacity.duration} ${fm.open.opacity.easing}, visibility 0s`
      : `grid-template-rows ${fm.close.height.duration} ${fm.close.height.easing}, opacity ${fm.close.opacity.duration} ${fm.close.opacity.easing}, visibility 0s linear ${fm.close.opacity.duration}`;

  const pressable = isLive && !partialTarget;
  const zoneStyle: CSSProperties | undefined = zone && { position: 'absolute', inset: 0, background: zone.fill, outline: `1px dashed ${zone.line}`, borderRadius: 'inherit', pointerEvents: 'none' };
  const handlers = {
    onPointerEnter: (e: PointerEvent) => e.pointerType === 'mouse' && setHover(true),
    onPointerLeave: () => (setHover(false), setPress(false)),
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (disabled) return;
      setPress(true);
      // 레시피와 같이 — 누르는 자리가 줄어 가장자리를 누른 포인터가 밖에 남아도 click 이 이 상자로(터치는 브라우저가 이미 잡는다)
      if (e.pointerType !== 'touch') e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    onPointerUp: () => setPress(false),
    onPointerCancel: () => setPress(false),
    onClick: () => !disabled && onToggle(),
  };

  return (
    <div
      className="psb"
      data-mode={mode}
      style={{
        ...vars,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        borderRadius: f.radius,
        background: 'var(--psb-bg)',
        transition: `background-color ${f.motion.bg.duration} ${f.motion.bg.easing}`,
        outline: focused ? `${f.ring.width}px solid var(--psb-ring)` : 'none',
        outlineOffset: f.ring.offset,
      }}
    >
      {/* 테두리 — 상자 안쪽에 그린다. 고르면 1 → 2px 로 굵어져도 내용이 밀리지 않는다 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: `${f.border.width}px solid var(--psb-bd)`,
          transition: `border-color ${look.motion.border.duration} ${look.motion.border.easing}`,
          pointerEvents: 'none',
        }}
      />
      {/* 누르는 자리 — 콘텐츠 + 컨트롤. 남는 높이까지 채운다(빈 아래쪽도 눌린다) */}
      <div
        ref={(el) => {
          trigRef.current = el;
          registerRef?.(el);
        }}
        role={kind === 'radio' ? 'radio' : 'checkbox'}
        aria-checked={on}
        aria-disabled={disabled || undefined}
        tabIndex={isLive && !disabled ? (tabIndex ?? 0) : undefined}
        onKeyDown={isLive ? onKey : undefined}
        onKeyUp={isLive ? onKeyUp : undefined}
        onFocus={isLive ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
        onBlur={
          isLive
            ? (e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                setRing(false);
                setPress(false);
              }
            : undefined
        }
        {...(pressable ? handlers : {})}
        style={{
          position: 'relative',
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: lay.alignItems,
          gap: f.trigger.gap,
          padding: `${lay.pad.top}px ${lay.pad.right}px ${lay.pad.bottom}px ${lay.pad.left}px`,
          cursor: disabled ? 'not-allowed' : isLive && !partialTarget ? f.cursor : 'default',
          userSelect: 'none',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          textAlign: 'left',
          fontFamily: f.label.fontFamily,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transition: `transform ${f.motion.scale.duration} ${f.motion.scale.easing}`,
        }}
      >
        <span style={{ display: 'flex', flex: 1, minWidth: 0, flexDirection: lay.content.direction, alignItems: lay.content.direction === 'row' ? 'center' : 'stretch', gap: lay.content.gap }}>
          {prefix && (() => {
            const I = ICONS[prefix.icon];
            return (
              <span style={{ display: 'flex', flexShrink: 0, color: 'var(--psb-icon)' }}>
                <I aria-hidden size={f.prefix.size} strokeWidth={2} />
              </span>
            );
          })()}
          <span style={{ marginRight: 'auto', display: 'flex', minWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: f.body.gap, paddingRight: f.body.padRight }}>
            <span
              {...(partialTarget && isLive ? handlers : {})}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: f.label.gap, fontSize: f.label.fontSize, lineHeight: f.label.lineHeight, fontWeight: f.label.fontWeight, color: 'var(--psb-title)', cursor: partialTarget && isLive ? 'pointer' : undefined }}
            >
              {title}
              {zone && partialTarget && <span aria-hidden style={{ ...zoneStyle, borderRadius: 4 }} />}
            </span>
            {description && <span style={{ fontSize: f.description.fontSize, lineHeight: f.description.lineHeight, fontWeight: f.description.fontWeight, color: 'var(--psb-desc)' }}>{description}</span>}
          </span>
        </span>
        {mark && (
          <span aria-hidden {...(partialTarget && isLive ? handlers : {})} style={{ position: 'relative', display: 'flex', flexShrink: 0, pointerEvents: partialTarget && isLive ? 'auto' : 'none', cursor: partialTarget && isLive ? 'pointer' : undefined }}>
            {mark}
            {zone && partialTarget && <span aria-hidden style={{ ...zoneStyle, borderRadius: 9999 }} />}
          </span>
        )}
        {zone && !partialTarget && <span aria-hidden style={{ ...zoneStyle, borderRadius: f.radius }} />}
      </div>
      {footer && (
        <div aria-hidden={!open || undefined} style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden', transition: footerTransition }}>
          <div style={{ minHeight: 0, overflow: 'hidden' }}>
            <div style={{ padding: `0 ${f.footer.padX}px ${f.footer.padBottom}px` }}>
              <FooterContent spec={footer} look={look} mode={mode} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 펼침의 내용 — 입력칸(input.yaml 의 기본 모습) · 고르는 칸(Input Button) 또는 안내 글. 펼침의 내용은 쓰는 쪽이 정한다
export function FooterContent({ spec, look, mode }: { spec: SbFooter; look: SbLook; mode: ViewMode }) {
  const f = look.faces.unselected[pickL(mode)].enabled;
  if ('note' in spec) return <span style={{ fontSize: f.description.fontSize, lineHeight: f.description.lineHeight, color: 'var(--psb-desc)' }}>{spec.note}</span>;
  // 고르는 칸 — Input Button large(폰 화면의 칸, 상자는 Input 상자형과 같은 52). 그림이라 열지 않는다
  if ('button' in spec)
    return (
      <span className="flex" style={{ width: spec.width ?? '100%' }}>
        <span className="sr-only">{spec.aria}</span>
        <InputButtonView look={spec.look} mode={mode} size="large" state="enabled" value={spec.button} suffixIcon={spec.icon ?? 'calendar'} />
      </span>
    );
  const i = look.input;
  return (
    <span className="flex items-center" style={{ gap: 8, fontSize: f.description.fontSize, lineHeight: f.description.lineHeight, color: 'var(--psb-title)' }}>
      {spec.before}
      <input
        aria-label={spec.aria}
        defaultValue={spec.value}
        inputMode="numeric"
        className="psb-in"
        style={{
          width: spec.width ?? 72,
          height: i.height,
          padding: `0 ${i.padX}px`,
          boxSizing: 'border-box',
          borderRadius: i.radius,
          border: 0,
          background: 'var(--psb-in-bg)',
          color: 'var(--psb-in-fg)',
          fontSize: i.fontSize,
          lineHeight: i.lineHeight,
          fontFamily: 'inherit',
          fontVariantNumeric: 'tabular-nums',
        }}
      />
      {spec.after}
    </span>
  );
}

export type SelectBoxGroupViewProps = {
  look: SbLook;
  kind: 'radio' | 'check';
  // 오른쪽 컨트롤 — 라디오 · 칸 없는 체크(mark) 또는 없음(테두리만)
  control?: 'mark' | 'none';
  boxes: BoxSpec[];
  columns?: 1 | 2 | 3;
  // 열 수에서 오는 배치를 바꿀 때만
  layout?: SbLayout;
  mode?: ViewMode;
  live?: boolean;
  // 하나 고르기의 처음 값
  value?: string;
  // 여럿 고르기의 최대 개수 — 닿으면 더 고르지 않고 안내를 띄운다
  max?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  width?: number | string;
  // 나쁜 예 — 높이를 맞추지 않는다(들쭉날쭉) · 상자 안 일부만 눌린다
  ragged?: boolean;
  partialTarget?: boolean;
  zone?: Zone;
  style?: CSSProperties;
  // 여럿 고르기 — 고른 것이 바뀔 때(처음 값도 한 번) 알린다. 바깥에서 "저장" 을 막고 풀 때(HR 역할)
  onChecksChange?: (checks: Record<string, boolean>) => void;
};

// 묶음 — 하나 고르기는 radiogroup(화살표로 옮기며 고른다), 여럿은 fieldset. 1 ~ 3열 격자
export function SelectBoxGroupView({ look, kind, control = 'mark', boxes, columns = 1, layout, mode = 'auto', live = true, value: initial, max, ariaLabel, ariaLabelledby, onChecksChange, width = '100%', ragged, partialTarget, zone, style }: SelectBoxGroupViewProps) {
  const [value, setValue] = useState(initial);
  const [checks, setChecks] = useState<Record<string, boolean>>(() => Object.fromEntries(boxes.map((b) => [b.value, !!b.checked])));
  const notify = useRef(onChecksChange);
  notify.current = onChecksChange;
  useEffect(() => {
    notify.current?.(checks);
  }, [checks]);
  // 최대 개수 안내 — Snackbar(snackbar.yaml) 그대로: 4초, 머무는 동안 멈춤, 한 번에 하나
  const snack = useSnackbarHost(look.snackbar);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const lay: SbLayout = layout ?? (columns > 1 ? 'vertical' : 'horizontal');
  const w = typeof width === 'number' ? width : 360;

  const move = (from: number, dir: 1 | -1) => {
    for (let k = 1; k <= boxes.length; k++) {
      const i = (from + dir * k + boxes.length) % boxes.length;
      if (!boxes[i].disabled) {
        setValue(boxes[i].value);
        refs.current[i]?.focus();
        return;
      }
    }
  };
  const toggle = (b: BoxSpec) => {
    if (kind === 'radio') return setValue(b.value);
    setChecks((c) => {
      const next = !c[b.value];
      if (next && max !== undefined && Object.values(c).filter(Boolean).length >= max) {
        snack.show({ message: `${max}개까지 고를 수 있어요.` });
        return c;
      }
      return { ...c, [b.value]: next };
    });
  };
  // 하나 고르기 묶음은 고른 상자 하나로 Tab 이 들어온다(없으면 첫 상자)
  const entry = kind === 'radio' ? Math.max(0, boxes.findIndex((b) => b.value === value && !b.disabled)) : -1;
  const firstEnabled = boxes.findIndex((b) => !b.disabled);

  const vars = sbGroupVars(look, mode);
  const grid: CSSProperties = {
    ...vars,
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridAutoRows: columns > 1 && !ragged ? '1fr' : undefined,
    alignItems: ragged ? 'start' : undefined,
    columnGap: look.group.gapX,
    rowGap: look.group.gapY,
    width,
    margin: 0,
    padding: 0,
    border: 0,
    minWidth: 0,
    boxSizing: 'border-box',
    ...style,
  };
  const items = boxes.map((b, i) => (
    <Box
      key={b.value}
      look={look}
      box={b}
      kind={kind}
      control={control}
      layout={lay}
      mode={mode}
      live={live}
      width={columns > 1 ? (w - look.group.gapX * (columns - 1)) / columns : w}
      on={kind === 'radio' ? b.value === value : !!checks[b.value]}
      onToggle={() => toggle(b)}
      onArrow={(dir) => move(i, dir)}
      tabIndex={kind === 'radio' ? (i === (value === undefined ? firstEnabled : entry) ? 0 : -1) : undefined}
      registerRef={(el) => {
        refs.current[i] = el;
      }}
      partialTarget={partialTarget}
      zone={zone}
    />
  ));
  const group =
    kind === 'radio' ? (
      <div role="radiogroup" aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className="psb" data-mode={mode} style={grid}>
        {items}
      </div>
    ) : (
      <fieldset aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className="psb" data-mode={mode} style={grid}>
        {items}
      </fieldset>
    );
  if (max === undefined) return group;
  // 띠 자리 — 묶음 아래(띠 높이 + 자리 위아래 여백). 띠는 그 아래 가운데에 뜬다
  const sb = look.snackbar;
  return (
    <div className="relative" style={{ width, paddingBottom: sb.root.minHeight + sb.region.padBottom * 2 }}>
      {group}
      <SnackbarRegion host={snack} look={sb} mode={mode} />
    </div>
  );
}
