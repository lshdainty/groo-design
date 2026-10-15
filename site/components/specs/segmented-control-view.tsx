'use client';
// 스펙대로 그린 Segmented Control — SegLook(segmented-control.yaml 을 푼 값)만 받아 그린다.
// live 면 실제 라디오 묶음이다: 누르거나 ← → ↑ ↓ 로 옮기면 바로 고른다(막힌 칸은 건너뛰고 끝에서 처음으로).
// Tab 은 고른 칸 하나에만 선다. 고른 알약은 트랙에 하나 있고 고른 칸으로 미끄러진다(translateX).
// 칸은 트랙 폭을 칸 수로 똑같이 나누고(최소 폭 없음), 글이 길면 단어 단위로 줄을 바꿔 모든 칸이 가장 높은 칸에 맞춘다.
// live 가 아니면 멈춘 그림이다 — states 로 칸마다 호버 · 누름 · 포커스 · 비활성을 그린다.
// 알림 점은 안 고른 칸에만 그린다(고르면 사라진다).
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { useReducedMotion } from './chip-view';
import { scv, segFaceOf, segPressRatio, type SegItem, type SegLook, type SegState, type ViewMode } from './segmented-control-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const PIN_GAP = 12;
const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };

export type SegPart = 'root' | 'item' | 'label' | 'indicator' | 'notification';

function PinAbove({ pin, inset, line }: { pin?: ReactNode; inset: number; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      {pin}
      <span style={{ width: 1, height: PIN_GAP + inset, background: line }} />
    </span>
  );
}
function PinBelow({ pin, inset, line }: { pin?: ReactNode; inset: number; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      <span style={{ width: 1, height: PIN_GAP + inset, background: line }} />
      {pin}
    </span>
  );
}
function PinLeft({ pin, line }: { pin?: ReactNode; line: string }) {
  if (!pin) return null;
  return (
    <span aria-hidden style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
      {pin}
      <span style={{ width: PIN_GAP, height: 1, background: line }} />
    </span>
  );
}

type ItemProps = {
  look: SegLook;
  mode: ViewMode;
  item: SegItem;
  selected: boolean;
  live: boolean;
  state?: SegState;
  disabled: boolean;
  tabIndex?: number;
  srNew: string;
  onSelect?: () => void;
  onKey?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  refCb?: (el: HTMLButtonElement | null) => void;
  zone?: Partial<Record<SegPart, CSSProperties>>;
  pins?: Partial<Record<SegPart, ReactNode>>;
  pinLine: string;
};

function SegItemView({ look, mode, item, selected, live, state, disabled, tabIndex, srNew, onSelect, onKey, refCb, zone, pins, pinLine }: ItemProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const shown: SegState = live ? (disabled ? 'disabled' : press ? 'pressed' : hover ? 'hovered' : 'enabled') : (state ?? 'enabled');
  const focused = live ? ring && !disabled : state === 'focused';
  const face = segFaceOf(look, selected, shown);
  const ringOn = focused && segFaceOf(look, selected, 'focused').ring;
  // 멈춘 누름 — 그린 칸의 폭으로 배율을 셈한다(재기 전에는 높이로)
  useIsoLayoutEffect(() => {
    if (live || shown !== 'pressed' || !ref.current) return;
    setBox({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
  }, [live, shown]);
  const scale = face.scale && !reduce ? segPressRatio(look.press, box?.w ?? look.item.minH, box?.h ?? look.item.minH) : 1;
  const m = look.motion;
  const css: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    minWidth: 0,
    minHeight: look.item.minH,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: look.item.padY,
    paddingBottom: look.item.padY,
    paddingLeft: look.item.padX,
    paddingRight: look.item.padX,
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: look.item.radius,
    background: face.bg ? scv(face.bg, mode) : 'transparent',
    boxShadow: face.border ? `inset 0 0 0 ${face.border.width}px ${scv(face.border.color, mode)}` : 'none',
    color: scv(face.fg, mode),
    fontFamily: FONT,
    fontSize: look.text.fontSize,
    lineHeight: look.text.lineHeight,
    fontWeight: look.text.fontWeight,
    textAlign: look.align as CSSProperties['textAlign'],
    // 줄바꿈은 단어 단위(v114) — 한 줄보다 긴 낱말만 칸 끝에서 끊는다
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
    cursor: face.cursor,
    userSelect: 'none',
    outlineStyle: ringOn ? 'solid' : 'none',
    outlineWidth: look.ring.width,
    outlineColor: scv(look.ring.color, mode),
    outlineOffset: look.ring.offset,
    transition: m.props.map((p) => `${p} ${m.color.duration} ${m.color.easing}`).join(', '),
    WebkitTapHighlightColor: 'transparent',
    ...zone?.item,
  };
  const n = look.notification;
  // 알림 점 — 고른 칸에는 없다
  const dot = !!item.notification && !selected;
  const label = (
    <span
      data-seg-label
      style={{
        position: 'relative',
        display: 'block',
        minWidth: 0,
        maxWidth: '100%',
        transform: scale !== 1 ? `scale(${scale})` : 'none',
        transition: `transform ${m.scale.duration} ${m.scale.easing}`,
        ...zone?.label,
      }}
    >
      {item.label}
      {dot && (
        <span aria-hidden data-seg-dot style={{ position: 'absolute', top: 0, left: `calc(100% + ${n.gap}px)`, width: n.size, height: n.size, borderRadius: n.radius, background: scv(n.color, mode), ...zone?.notification }}>
          <PinAbove pin={pins?.notification} inset={look.item.padY} line={pinLine} />
        </span>
      )}
      <PinAbove pin={pins?.label} inset={look.item.padY} line={pinLine} />
    </span>
  );
  const data = { 'data-seg-item': item.value, 'data-selected': selected ? 'true' : 'false', 'data-state': focused ? 'focused' : shown };
  if (!live)
    return (
      <span
        ref={(el) => {
          ref.current = el;
        }}
        {...data}
        style={css}
      >
        {label}
        {dot && <span style={srOnly}>{srNew}</span>}
        <PinBelow pin={pins?.item} inset={look.root.padding} line={pinLine} />
      </span>
    );
  return (
    <button
      ref={(el) => {
        ref.current = el;
        refCb?.(el);
      }}
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      tabIndex={tabIndex}
      {...data}
      style={css}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => (setHover(false), setPress(false))}
      onPointerDown={(e) => {
        if (e.button !== 0 || disabled) return;
        setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
        setPress(true);
      }}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onFocus={(e) => setRing(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => (setRing(false), setPress(false))}
      onKeyDown={(e) => {
        // 라디오는 Space 로 고른다(Enter 는 폼 제출 자리)
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === ' ' && !e.repeat) {
          setBox({ w: e.currentTarget.offsetWidth, h: e.currentTarget.offsetHeight });
          setPress(true);
        }
        onKey?.(e);
      }}
      onKeyUp={(e) => e.key === ' ' && setPress(false)}
      onClick={onSelect}
    >
      {label}
      {dot && <span style={srOnly}>{srNew}</span>}
    </button>
  );
}

export type SegmentedViewProps = {
  look: SegLook;
  mode?: ViewMode;
  items: SegItem[];
  live?: boolean;
  value?: string;
  defaultValue?: string;
  onValue?: (v: string) => void;
  // 트랙 전체를 막는다
  disabled?: boolean;
  states?: Record<string, SegState>;
  ariaLabel?: string;
  ariaLabelledby?: string;
  srNew?: string;
  zone?: Partial<Record<SegPart, CSSProperties>>;
  itemZone?: Record<string, Partial<Record<SegPart, CSSProperties>>>;
  itemPins?: Record<string, Partial<Record<SegPart, ReactNode>>>;
  pins?: Partial<Record<SegPart, ReactNode>>;
  pinLine?: string;
  style?: CSSProperties;
};

const ARROWS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

export function SegmentedView({
  look,
  mode = 'auto',
  items,
  live = true,
  value,
  defaultValue,
  onValue,
  disabled = false,
  states,
  ariaLabel,
  ariaLabelledby,
  srNew = '새 소식',
  zone,
  itemZone,
  itemPins,
  pins,
  pinLine = 'currentColor',
  style,
}: SegmentedViewProps) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const cur = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [animate, setAnimate] = useState(false);
  // 처음 그릴 때는 알약이 날아오지 않게 — 그린 뒤부터 미끄러진다
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const n = items.length;
  const idx = items.findIndex((it) => it.value === cur);
  const on = (i: number) => !disabled && !items[i].disabled;
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    if (v !== cur) onValue?.(v);
  };
  const move = (from: number, dir: 1 | -1) => {
    for (let k = 1; k <= n; k++) {
      const i = (((from + dir * k) % n) + n) % n;
      if (on(i)) {
        select(items[i].value);
        refs.current[i]?.focus();
        return;
      }
    }
  };
  const stop = idx >= 0 && on(idx) ? idx : items.findIndex((_, i) => on(i));
  const r = look.root;
  const ind = look.indicator;
  return (
    <div
      role={live ? 'radiogroup' : undefined}
      aria-label={live ? ariaLabel : undefined}
      aria-labelledby={live ? ariaLabelledby : undefined}
      aria-disabled={live && disabled ? true : undefined}
      data-seg-root={n}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        boxSizing: 'border-box',
        width: '100%',
        paddingTop: r.padding,
        paddingRight: r.padding,
        paddingBottom: r.padding,
        paddingLeft: r.padding,
        borderRadius: r.radius,
        background: scv(r.bg, mode),
        ...zone?.root,
        ...style,
      }}
    >
      <PinLeft pin={pins?.root} line={pinLine} />
      {idx >= 0 && (
        <span
          aria-hidden
          data-seg-indicator
          style={{
            position: 'absolute',
            top: ind.inset,
            bottom: ind.inset,
            left: ind.inset,
            width: `calc((100% - ${ind.inset * 2}px) / ${n})`,
            transform: `translateX(${idx * 100}%)`,
            borderRadius: ind.radius,
            background: scv(ind.bg, mode),
            boxShadow: `inset 0 0 0 ${ind.borderWidth}px ${scv(ind.border, mode)}`,
            transition: animate ? `transform ${ind.motion.duration} ${ind.motion.easing}` : 'none',
            pointerEvents: 'none',
            ...zone?.indicator,
          }}
        >
          <PinBelow pin={pins?.indicator} inset={ind.inset} line={pinLine} />
        </span>
      )}
      {items.map((it, i) => (
        <SegItemView
          key={it.value}
          look={look}
          mode={mode}
          item={it}
          selected={i === idx}
          live={live}
          state={states?.[it.value] ?? (disabled || it.disabled ? 'disabled' : undefined)}
          disabled={disabled || !!it.disabled}
          tabIndex={i === stop ? 0 : -1}
          srNew={srNew}
          onSelect={() => select(it.value)}
          onKey={(e) => {
            if (!ARROWS.includes(e.key)) return;
            e.preventDefault();
            move(i, e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1);
          }}
          refCb={(el) => void (refs.current[i] = el)}
          zone={itemZone?.[it.value]}
          pins={itemPins?.[it.value]}
          pinLine={pinLine}
        />
      ))}
    </div>
  );
}
