'use client';
// 스펙대로 그린 Color Swatch — SwatchLook(color-swatch.yaml 을 푼 값)만 받아 그린다.
// 차트 10색을 원 40 칸에 진하게 칠해 5 × 2(색상환 차례)로 늘어놓고 하나를 고른다 — radiogroup, 묶음에 Tab 하나 + 2차원 화살표.
// 고른 칸은 2 띄운 2px 짙은 고리 + 가운데 체크(라이트 흰 · 다크 짙은 글자). 팔레트 밖 색 · 색 없는 항목은 격자 앞 "지금 색" · "자동" 칸 —
// 놓인 자리가 divider.stackBelow 보다 좁으면 그 칸을 격자 위 줄에 두고 선을 가로로 긋는다(사이는 그대로).
// states 를 주면 그 칸들을 그 상태로 멈춘 그림, live 면 실제로 누르고 화살표로 옮긴다 — 마우스를 올리면 칸 이름 툴팁(porest Tooltip — menu-view).
import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { CURRENT, icv, pressRatio, typeStyle, type SwatchCurrent, type SwatchLook, type SwatchState, type ViewMode } from './input-shared';
import type { BubbleLook } from './menu-shared';
import { TooltipControl, TooltipGroup } from './menu-view';
import { useReducedMotion } from './toggle-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export type SwatchPart = 'group' | 'swatch' | 'check' | 'ring' | 'current' | 'label' | 'divider';

export type SwatchGroupViewProps = {
  look: SwatchLook;
  mode?: ViewMode;
  // 고른 값 — 색 이름(red …) 또는 "current"(지금 색 칸). 없으면 아무것도 안 고름
  value?: string;
  onValueChange?: (v: string) => void;
  current?: SwatchCurrent;
  disabled?: boolean;
  live?: boolean;
  // 멈춘 그림 — 칸마다 상태
  states?: Record<string, SwatchState>;
  labelledBy?: string;
  ariaLabel?: string;
  describedBy?: string;
  // 읽는 말이 바뀔 때(플레이그라운드의 화면 읽기 줄) — 초점이 간 칸
  onFocusName?: (text: string) => void;
  // 지금 색 칸을 위 줄에 쌓을지 — auto 면 놓인 자리의 폭을 재서 stackBelow 보다 좁을 때(멈춘 그림은 정해 준다)
  stack?: boolean | 'auto';
  // 칸 툴팁의 말풍선(help-bubble.yaml — menuKit().bubble) — live 이고 look.tooltip 이면 칸 이름을 띄운다
  tip?: BubbleLook;
  marks?: Partial<Record<SwatchPart, CSSProperties>>;
  pins?: Partial<Record<SwatchPart, ReactNode>>;
};

type Cell = { key: string; name: string; bg: string; check: string; dashed?: boolean };

export function SwatchGroupView({ look, mode = 'auto', value, onValueChange, current, disabled = false, live = false, states, labelledBy, ariaLabel, describedBy, onFocusName, stack = 'auto', tip, marks, pins }: SwatchGroupViewProps) {
  const reduce = useReducedMotion();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [press, setPress] = useState<string | null>(null);
  const [ring, setRing] = useState<string | null>(null);
  // 놓인 자리의 폭 — 묶음(늘어난 블록)의 폭을 잰다. 옆으로 둘 폭(stackBelow)보다 좁으면 쌓는다
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [narrow, setNarrow] = useState(false);
  useIsoLayoutEffect(() => {
    if (stack !== 'auto' || !current) return;
    const el = rootRef.current;
    if (!el) return;
    const on = () => setNarrow(el.clientWidth < look.divider.stackBelow);
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stack, !!current, look.divider.stackBelow]);
  const stacked = !!current && (stack === 'auto' ? narrow : stack);
  const checkInk = icv(look.check.color, mode);
  const grid: Cell[] = look.colors.map((c) => ({ key: c.key, name: c.name, bg: icv(c.color, mode), check: checkInk }));
  const cur: Cell | null = !current
    ? null
    : current.kind === 'custom'
      ? { key: CURRENT, name: look.names.current, bg: current.hex, check: mode === 'auto' ? 'auto' : look.custom.check[mode] }
      : { key: CURRENT, name: look.names.auto, bg: icv(look.colors.find((c) => c.key === current.color)!.color, mode), check: checkInk, dashed: true };
  // 차례 — 지금 색 칸이 맨 앞, 그다음 격자(줄마다 columns 개)
  const order = [...(cur ? [cur] : []), ...grid];
  const tabStop = order.find((c) => c.key === value)?.key ?? order[0].key;
  const readout = (c: Cell) => `${c.name}, 라디오, ${order.indexOf(c) + 1}/${order.length}${c.key === value ? ', 선택됨' : ''}`;

  const pick = (c: Cell) => {
    onValueChange?.(c.key);
  };
  const move = (from: Cell, e: KeyboardEvent<HTMLButtonElement>) => {
    const i = order.indexOf(from);
    const gi = grid.findIndex((g) => g.key === from.key);
    let to: Cell | undefined;
    switch (e.key) {
      case 'ArrowRight':
        to = order[(i + 1) % order.length];
        break;
      case 'ArrowLeft':
        to = order[(i - 1 + order.length) % order.length];
        break;
      case 'ArrowDown':
        to = gi >= 0 ? grid[gi + look.columns] ?? grid[gi % look.columns] : undefined;
        break;
      case 'ArrowUp':
        to = gi >= 0 ? grid[gi - look.columns] ?? grid[grid.length - look.columns + (gi % look.columns)] : undefined;
        break;
      // 하나 고르기 묶음은 화살표만 — Home · End · PageUp · PageDown 은 받지 않는다(화면도 스크롤되지 않는다 — 2026-10-17 사용자 결정 03-E 결정 3 후속)
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        e.preventDefault();
        return;
      case ' ':
        e.preventDefault();
        pick(from);
        return;
      case 'Enter':
        // 고르지 않고 폼을 보낸다(Radio Group 과 같다) — 단추의 누름(click)을 막는다
        e.preventDefault();
        e.currentTarget.closest('form')?.requestSubmit();
        return;
      default:
        return;
    }
    e.preventDefault();
    if (!to) return;
    refs.current[to.key]?.focus();
    // 라디오 묶음 — 옮기며 고른다
    pick(to);
  };

  const cell = (c: Cell) => {
    const selected = c.key === value;
    const st: SwatchState = disabled ? 'disabled' : (states?.[c.key] ?? (live ? (press === c.key ? 'pressed' : ring === c.key ? 'focused' : 'enabled') : 'enabled'));
    const k = st === 'pressed' && !reduce ? pressRatio(look.press, look.size, look.size) : 1;
    const ringColor = icv(disabled ? look.ring.disabledColor : look.ring.color, mode);
    // 고른 고리(띄움 2 · 2px)는 외곽선 — 사이 2 는 놓인 표면이 비친다. 키보드 포커스 링(띄움 6 · 2px)은 그 바깥에 따로 두른다
    const focusOut = look.focus.offset + look.focus.width;
    const ext = (look.touch - look.size) / 2;
    const style: CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      width: look.size,
      height: look.size,
      flexShrink: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      borderRadius: 9999,
      background: c.bg,
      borderWidth: c.dashed ? look.auto.borderWidth : 0,
      borderStyle: c.dashed ? 'dashed' : 'none',
      borderColor: c.dashed ? icv(look.auto.borderColor, mode) : 'transparent',
      outlineStyle: selected ? 'solid' : 'none',
      outlineWidth: look.ring.width,
      outlineOffset: look.ring.offset,
      outlineColor: ringColor,
      transform: k === 1 ? 'none' : `scale(${k})`,
      transitionProperty: 'transform',
      transitionDuration: look.press.motion.duration,
      transitionTimingFunction: look.press.motion.easing,
      cursor: !live ? undefined : disabled ? 'not-allowed' : 'pointer',
      WebkitTapHighlightColor: 'transparent',
      ...(c.key === value ? marks?.swatch : undefined),
    };
    const inner = (
      <>
        <span aria-hidden style={{ position: 'absolute', top: -ext, right: -ext, bottom: -ext, left: -ext, borderRadius: 9999 }} />
        {st === 'focused' && <span aria-hidden data-swatch-focus style={{ position: 'absolute', top: -focusOut, right: -focusOut, bottom: -focusOut, left: -focusOut, borderRadius: 9999, borderWidth: look.focus.width, borderStyle: 'solid', borderColor: icv(look.focus.color, mode), pointerEvents: 'none' }} />}
        {selected &&
          (c.check === 'auto' ? (
            <>
              {/* 지금 색 위 체크 — 모드마다 대비가 큰 쪽(사이트 모드를 따른다) */}
              <Check aria-hidden size={look.check.size} strokeWidth={look.check.stroke} color={look.custom.check.light} className="dark:hidden" style={{ position: 'relative', flexShrink: 0 }} />
              <Check aria-hidden size={look.check.size} strokeWidth={look.check.stroke} color={look.custom.check.dark} className="hidden dark:block" style={{ position: 'relative', flexShrink: 0 }} />
            </>
          ) : (
            <Check aria-hidden size={look.check.size} strokeWidth={look.check.stroke} color={c.check} style={{ position: 'relative', display: 'block', flexShrink: 0 }} />
          ))}
      </>
    );
    if (!live)
      return (
        <span key={c.key} aria-hidden data-swatch={c.key} style={style}>
          {inner}
          {c.key === value && pins?.swatch}
        </span>
      );
    const own = {
      onPointerDown: (e: PointerEvent<HTMLButtonElement>) => e.button === 0 && setPress(c.key),
      onPointerUp: () => setPress(null),
      onPointerLeave: () => setPress(null),
      onPointerCancel: () => setPress(null),
      onFocus: (e: FocusEvent<HTMLButtonElement>) => {
        setRing(e.currentTarget.matches(':focus-visible') ? c.key : null);
        onFocusName?.(readout(c));
      },
      onBlur: () => setRing((r) => (r === c.key ? null : r)),
    };
    const button = (tipRef?: (el: HTMLElement | null) => void, tipProps?: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button
        key={c.key}
        ref={(el) => {
          refs.current[c.key] = el;
          tipRef?.(el);
        }}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={c.name}
        aria-describedby={tipProps?.['aria-describedby']}
        disabled={disabled}
        tabIndex={c.key === tabStop ? 0 : -1}
        data-swatch={c.key}
        style={style}
        onClick={() => pick(c)}
        onKeyDown={(e) => move(c, e)}
        onPointerEnter={tipProps?.onPointerEnter}
        onPointerDown={(e) => {
          own.onPointerDown(e);
          tipProps?.onPointerDown?.(e);
        }}
        onPointerUp={own.onPointerUp}
        onPointerLeave={(e) => {
          own.onPointerLeave();
          tipProps?.onPointerLeave?.(e);
        }}
        onPointerCancel={own.onPointerCancel}
        onFocus={(e) => {
          own.onFocus(e);
          tipProps?.onFocus?.(e);
        }}
        onBlur={(e) => {
          own.onBlur();
          tipProps?.onBlur?.(e);
        }}
      >
        {inner}
      </button>
    );
    // 칸 툴팁 — 칸 이름(색 이름). 막힌 묶음에는 띄우지 않는다(누를 수 없는 칸)
    if (!tip || !look.tooltip || disabled) return button();
    return <TooltipControl key={c.key} look={tip} mode={mode} text={c.name} side="top" trigger={(r) => button(r.ref, r.props)} />;
  };

  const gridEl = (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${look.columns}, ${look.size}px)`, gap: look.gap, width: look.width, flexShrink: 0, ...marks?.group }}>
      {grid.map(cell)}
    </div>
  );
  const D = look.divider;
  const body = (
    <div
      ref={rootRef}
      role={live ? 'radiogroup' : undefined}
      aria-labelledby={live ? labelledBy : undefined}
      aria-label={live && !labelledBy ? ariaLabel : undefined}
      aria-describedby={live ? describedBy : undefined}
      aria-disabled={live && disabled ? true : undefined}
      aria-hidden={live ? undefined : true}
      data-swatch-group
      data-stacked={stacked ? '' : undefined}
      style={{ position: 'relative', display: 'flex', flexDirection: stacked ? 'column' : 'row', alignItems: 'flex-start' }}
    >
      {pins?.group}
      {cur && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: look.currentLabel.gap, flexShrink: 0, ...marks?.current }}>
            {cell(cur)}
            <span aria-hidden style={{ ...typeStyle(look.currentLabel.text), color: icv(look.currentLabel.fg, mode), whiteSpace: 'nowrap', ...marks?.label }}>
              {cur.name}
            </span>
            {pins?.current}
          </div>
          {/* 선 — 옆으로 두면 세로(격자 높이), 쌓으면 가로(격자 폭). 사이는 둘 다 gap */}
          <span
            aria-hidden
            data-swatch-divider={stacked ? 'row' : 'column'}
            style={
              stacked
                ? { width: look.width, height: D.width, marginTop: D.gap, marginBottom: D.gap, background: icv(D.color, mode), flexShrink: 0, ...marks?.divider }
                : { alignSelf: 'stretch', width: D.width, marginLeft: D.gap, marginRight: D.gap, background: icv(D.color, mode), flexShrink: 0, height: look.size * 2 + look.gap, ...marks?.divider }
            }
          />
        </>
      )}
      {gridEl}
    </div>
  );
  return live && tip && look.tooltip ? <TooltipGroup>{body}</TooltipGroup> : body;
}
