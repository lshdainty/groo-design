'use client';
// 스펙대로 그린 List — ListLook(list.yaml · list-header.yaml 을 푼 값)만 받아 그린다.
// 줄마다 state 를 주면 그 상태로 멈춘 그림, 안 주면 실제로 호버 · 누름 · 키보드 포커스에 반응하고 눌러서 바꾼다.
// 색은 라이트(-l) · 다크(-d) 값을 둘 다 싣고 CSS(global.css 의 .plst)가 사이트 모드에 맞춰 고른다.
// 한 줄은 두 층이다 — 바탕 층(누름 · 호버 · 강조, 줄지 않는다) · 콘텐츠 층(앞 · 본문 · 뒤, 누르면 이 층만 준다).
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import {
  Bell,
  Bus,
  Calendar,
  Check,
  ChevronRight,
  CircleHelp,
  Coffee,
  CreditCard,
  Download,
  Ellipsis,
  ExternalLink,
  Gift,
  Globe,
  House,
  Info,
  Languages,
  Lock,
  LogOut,
  Megaphone,
  Moon,
  Palette,
  Pencil,
  PiggyBank,
  Receipt,
  Shield,
  ShoppingBag,
  Smartphone,
  Star,
  Trash2,
  TrendingUp,
  User,
  Utensils,
  Wallet,
  Stethoscope,
  Plane,
  type LucideIcon,
} from 'lucide-react';
import { ButtonView, type IconName as ButtonIcon } from './button-view';
import { CheckboxView } from './checkbox-view';
import { RadioView } from './radio-group-view';
import { SwitchView } from './switch-view';
import { AvatarView } from './display-view';
import type { HeaderVariant, ListFace, ListIcon, ListLook, ListState, PrefixSpec, RowSpec } from './list-shared';

const ICONS: Record<ListIcon, LucideIcon> = {
  bell: Bell,
  globe: Globe,
  user: User,
  wallet: Wallet,
  stethoscope: Stethoscope,
  plane: Plane,
  lock: Lock,
  moon: Moon,
  coffee: Coffee,
  bus: Bus,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  help: CircleHelp,
  calendar: Calendar,
  smartphone: Smartphone,
  'log-out': LogOut,
  palette: Palette,
  languages: Languages,
  download: Download,
  shield: Shield,
  'credit-card': CreditCard,
  'piggy-bank': PiggyBank,
  receipt: Receipt,
  megaphone: Megaphone,
  gift: Gift,
  house: House,
  'trending-up': TrendingUp,
  star: Star,
  more: Ellipsis,
  pencil: Pencil,
  trash: Trash2,
  info: Info,
  check: Check,
  external: ExternalLink,
};
// 작은 버튼(ButtonView) 이 아는 아이콘 이름으로
const BUTTON_ICON: Partial<Record<ListIcon, ButtonIcon>> = { bell: 'bell', more: 'more', star: 'star', pencil: 'pencil', trash: 'trash', download: 'download', calendar: 'calendar' };

export type ViewMode = 'light' | 'dark' | 'auto';
const pickL = (mode: ViewMode) => (mode === 'dark' ? 'dark' : 'light');
const pickD = (mode: ViewMode) => (mode === 'light' ? 'light' : 'dark');

// 모션 줄이기면 콘텐츠 축소를 뺀다(바탕 색 전환은 그대로)
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

type RowProps = {
  look: ListLook;
  row: RowSpec;
  mode: ViewMode;
  live: boolean;
  // 라디오 묶음 — 고른 값 · 고르기 · 화살표로 옮기기
  selected?: boolean;
  onSelect?: () => void;
  onArrow?: (dir: 1 | -1) => void;
  tabIndex?: number;
  registerRef?: (el: HTMLDivElement | null) => void;
  // 그림의 줄 폭(재기 전 첫 그림 · 서버 그림에서 누름 배율을 셈한다)
  width: number;
  // 바탕 층 모서리를 바꿔 그릴 때(카드 안의 동심 모서리)
  bgRadius?: number;
  // 콘텐츠 층 여백을 바꿔 그릴 때(나쁜 예 — 줄마다 다른 여백)
  padX?: number;
};

function Row({ look, row, mode, live, selected, onSelect, onArrow, tabIndex, registerRef, width, bgRadius, padX }: RowProps) {
  const { kind, title, detail, prefix, suffix, highlighted = false, disabled = false, align = 'center', titleBadge, detailNode, suffixNode, excluded } = row;
  const clickable = kind !== 'view';
  const control = kind === 'switch' || kind === 'check' || kind === 'radio';
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const [ring, setRing] = useState(false);
  const [own, setOwn] = useState(!!row.checked);
  const [size, setSize] = useState({ w: width, h: 0 });
  const liRef = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const isLive = live && !row.state;

  useEffect(() => {
    const el = liRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const on = kind === 'radio' ? !!selected : own;
  const shown: ListState = row.state ?? (disabled ? 'disabled' : !clickable || !isLive ? 'enabled' : press ? 'pressed' : hover ? 'hovered' : 'enabled');
  // 포커스는 링만 더한다 — 호버 · 누름과 겹칠 수 있다
  const focused = shown === 'focused' || (isLive && ring && !disabled);
  const st: ListState = shown === 'focused' ? 'enabled' : !clickable && shown !== 'disabled' ? 'enabled' : shown;
  const hl = highlighted ? 'highlighted' : 'none';
  const L = look.faces[hl][pickL(mode)][st];
  const D = look.faces[hl][pickD(mode)][st];
  const f: ListFace = L;
  const tile = prefix && 'tile' in prefix ? look.tiles[prefix.tile] : undefined;
  const vars = {
    '--pl-bg-l': L.bg.color,
    '--pl-bg-d': D.bg.color,
    '--pl-title-l': L.title.color,
    '--pl-title-d': D.title.color,
    '--pl-detail-l': L.detail.color,
    '--pl-detail-d': D.detail.color,
    '--pl-stext-l': L.suffix.color,
    '--pl-stext-d': D.suffix.color,
    '--pl-sicon-l': L.suffix.iconColor,
    '--pl-sicon-d': D.suffix.iconColor,
    '--pl-icon-l': L.prefix.iconColor,
    '--pl-icon-d': D.prefix.iconColor,
    '--pl-ring-l': look.faces[hl][pickL(mode)].focused.ring.color,
    '--pl-ring-d': look.faces[hl][pickD(mode)].focused.ring.color,
    '--pl-tile-bg-l': L.tile.bg ?? tile?.bg[pickL(mode)] ?? 'transparent',
    '--pl-tile-bg-d': D.tile.bg ?? tile?.bg[pickD(mode)] ?? 'transparent',
    '--pl-tile-fg-l': L.tile.fg ?? tile?.fg[pickL(mode)] ?? 'currentColor',
    '--pl-tile-fg-d': D.tile.fg ?? tile?.fg[pickD(mode)] ?? 'currentColor',
  } as CSSProperties;

  // 누름 — 콘텐츠 층만 2px 거리. 기준 길이 max(높이, 폭 ÷ n, 최소)
  const h = size.h || f.pad.y * 2 + parseFloat(f.title.lineHeight ?? f.title.fontSize);
  const basis = Math.max(h, size.w / look.press.widthDivisor, look.press.minBasis);
  const scale = f.scale && clickable && !reduce ? (basis - look.press.distance) / basis : 1;

  const toggle = () => {
    if (!isLive || disabled) return;
    if (kind === 'radio') onSelect?.();
    else if (kind === 'switch' || kind === 'check') setOwn((v) => !v);
  };

  // 끼운 컨트롤의 모습 — 줄이 눌리거나 올려지면 체크 · 라디오는 누름 색(축소 없음, 호버와 같은 색), 스위치는 그대로
  const markState = disabled || row.markDisabled ? 'disabled' : focused && control ? 'focused' : (st === 'pressed' || st === 'hovered') && kind !== 'switch' ? 'hovered' : 'enabled';
  const mark =
    kind === 'switch' ? (
      <SwitchView look={look.marks.switch} mode={mode} checked={on} state={markState} passive ariaLabel={title} />
    ) : kind === 'check' ? (
      <CheckboxView look={look.marks.check} mode={mode} checked={on ? 'checked' : 'unchecked'} state={markState} ariaLabel={title} />
    ) : kind === 'radio' ? (
      <RadioView look={look.marks.radio} mode={mode} checked={on ? 'checked' : 'unchecked'} state={markState} ariaLabel={title} tabIndex={-1} />
    ) : null;
  const markAt = row.markPosition ?? (kind === 'check' ? 'prefix' : 'suffix');

  // 끼운 컨트롤은 줄이 누른다 — 누름 · 포커스가 컨트롤로 새지 않게 포인터를 줄로 흘린다
  const markBox = mark && (
    <span aria-hidden className="flex" style={{ pointerEvents: 'none' }}>
      {mark}
    </span>
  );
  const prefixNode = control && markAt === 'prefix' ? markBox : prefix ? <Prefix spec={prefix} f={f} look={look} mode={mode} twoLine={!!(detail || detailNode)} /> : null;
  // 합계에 안 드는 줄 — 제목 · 금액만 설명 글자색(fg-neutral-subtle)
  const suffixMark = control && markAt === 'suffix' ? markBox : null;
  // 뒤 붙이개가 글 값 하나뿐인가(레시피는 suffix 에 글을 그대로 넘기면 value text) — 본문이 제목 낱말 폭이 된 뒤에야 줄고 줄 끝에서 끊는다(Q-001 A)
  const textOnly = !!suffix?.text && !suffix.chevron && !suffix.amount && !suffix.buttons?.length && !suffix.icon && !suffixMark && !suffixNode;

  const role = kind === 'switch' ? 'switch' : kind === 'check' ? 'checkbox' : kind === 'radio' ? 'radio' : kind === 'link' ? 'link' : kind === 'button' ? 'button' : undefined;
  const contentStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: look.alignItems[align],
    padding: `${f.pad.y}px ${padX ?? f.pad.x}px`,
    fontFamily: f.title.fontFamily,
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transition: `transform ${f.motion.content.duration} ${f.motion.content.easing}`,
    cursor: disabled ? 'not-allowed' : clickable ? f.cursor : 'default',
    outline: 'none',
    userSelect: clickable ? 'none' : undefined,
    WebkitTapHighlightColor: 'transparent',
    textAlign: 'left',
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isLive || disabled) return;
    if (kind === 'radio' && ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      onArrow?.(e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (e.key === ' ' || (e.key === 'Enter' && (kind === 'button' || kind === 'link'))) {
      e.preventDefault();
      if (!e.repeat) setPress(true);
    }
  };
  const onKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setPress(false);
      if (isLive && !disabled && (e.key === ' ' || kind === 'button' || kind === 'link')) toggle();
    }
  };

  return (
    <li ref={liRef} className="plst" data-mode={mode} style={{ ...vars, position: 'relative', listStyle: 'none' }}>
      {/* 바탕 층 — 줄지 않는다 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: f.bg.insetX,
          right: f.bg.insetX,
          borderRadius: f.bg.radius && bgRadius !== undefined ? bgRadius : f.bg.radius,
          background: 'var(--pl-bg)',
          transition: ['background-color', 'left', 'right', 'border-radius'].map((p) => `${p} ${f.motion.bg.duration} ${f.motion.bg.easing}`).join(', '),
          pointerEvents: 'none',
        }}
      />
      {/* 콘텐츠 층 — 누르는 줄은 이 층 전체가 누르는 영역 */}
      <div
        ref={registerRef}
        role={role}
        aria-checked={control ? on : undefined}
        aria-disabled={clickable && disabled ? true : undefined}
        tabIndex={clickable && isLive && !disabled ? (tabIndex ?? 0) : undefined}
        style={contentStyle}
        onPointerEnter={isLive && clickable ? (e) => e.pointerType === 'mouse' && setHover(true) : undefined}
        onPointerLeave={isLive && clickable ? () => (setHover(false), setPress(false)) : undefined}
        onPointerDown={
          isLive && clickable && !disabled
            ? (e) => {
                setPress(true);
                // 레시피와 같이 — 콘텐츠가 줄어 가장자리를 누른 포인터가 밖에 남아도 click 이 이 줄로(터치는 브라우저가 이미 잡는다)
                if (e.pointerType !== 'touch') e.currentTarget.setPointerCapture?.(e.pointerId);
              }
            : undefined
        }
        onPointerUp={isLive && clickable ? () => setPress(false) : undefined}
        onPointerCancel={isLive && clickable ? () => setPress(false) : undefined}
        onClick={isLive && clickable ? toggle : undefined}
        onKeyDown={isLive && clickable ? onKey : undefined}
        onKeyUp={isLive && clickable ? onKeyUp : undefined}
        onFocus={isLive && clickable ? (e) => setRing(e.currentTarget.matches(':focus-visible')) : undefined}
        onBlur={
          isLive && clickable
            ? (e) => {
                if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                setRing(false);
                setPress(false);
              }
            : undefined
        }
      >
        {prefixNode && <span style={{ display: 'flex', flexShrink: 0, alignItems: 'center', paddingRight: f.prefix.padRight }}>{prefixNode}</span>}
        {/* 본문 — 남는 폭을 쓰고 먼저 양보한다. 제목의 가장 긴 낱말 + 뒤 여백 아래로는 줄지 않는다(list.yaml body.minWidth min-content —
            Q-001 A · 2026-10-30 결정 B). 제목은 keep-all 이라 min-content 가 그 낱말이다. 제목 · 설명은 저마다 크기를 건다 */}
        <span style={{ display: 'flex', flex: 1, fontSize: f.title.fontSize, minWidth: f.body.minWidth, flexDirection: 'column', alignItems: 'flex-start', gap: f.body.gap, paddingRight: f.body.padRight }}>
          {titleBadge ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: look.titleGap, maxWidth: '100%', minWidth: 0 }}>
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: f.title.fontSize, lineHeight: f.title.lineHeight, fontWeight: f.title.fontWeight, color: excluded ? 'var(--pl-detail)' : 'var(--pl-title)', transition: `color ${f.motion.bg.duration} ${f.motion.bg.easing}` }}>{title}</span>
              {titleBadge}
            </span>
          ) : (
            <span style={{ fontSize: f.title.fontSize, lineHeight: f.title.lineHeight, fontWeight: f.title.fontWeight, overflowWrap: f.title.overflowWrap as CSSProperties['overflowWrap'], wordBreak: f.title.wordBreak as CSSProperties['wordBreak'], color: excluded ? 'var(--pl-detail)' : 'var(--pl-title)', transition: `color ${f.motion.bg.duration} ${f.motion.bg.easing}` }}>{title}</span>
          )}
          {detailNode ? (
            <span style={{ display: 'flex', maxWidth: '100%', minWidth: 0, fontSize: f.detail.fontSize, lineHeight: f.detail.lineHeight, fontWeight: f.detail.fontWeight, color: 'var(--pl-detail)' }}>{detailNode}</span>
          ) : (
            detail && (
              <span style={{ fontSize: f.detail.fontSize, lineHeight: f.detail.lineHeight, fontWeight: f.detail.fontWeight, overflowWrap: f.detail.overflowWrap as CSSProperties['overflowWrap'], color: 'var(--pl-detail)', transition: `color ${f.motion.bg.duration} ${f.motion.bg.easing}` }}>{detail}</span>
            )
          )}
        </span>
        {(suffix || suffixMark || suffixNode) && (
          <span style={{ display: 'flex', ...(textOnly ? { flexShrink: f.suffix.textShrink, minWidth: 0, overflowWrap: f.suffix.textOverflowWrap as CSSProperties['overflowWrap'] } : { flexShrink: f.suffix.shrink }), alignItems: 'center', gap: f.suffix.gap, fontSize: f.suffix.fontSize, lineHeight: f.suffix.lineHeight, fontWeight: f.suffix.fontWeight, color: 'var(--pl-stext)' }}>
            {suffix?.text}
            {suffix?.amount && (
              <span style={{ fontSize: f.title.fontSize, lineHeight: f.title.lineHeight, fontWeight: 700, color: excluded ? 'var(--pl-detail)' : 'var(--pl-title)', fontVariantNumeric: 'tabular-nums', textDecoration: excluded === 'refunded' ? 'line-through' : 'none' }}>{suffix.amount}</span>
            )}
            {suffix?.buttons?.map((b) => (
              // 작은 버튼은 줄 위로 올라 따로 눌린다
              <span key={b} style={{ position: 'relative', zIndex: 1 }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                <ButtonView look={look.marks.iconButton} mode={mode} icon={BUTTON_ICON[b] ?? 'more'} ariaLabel={b} state={disabled ? 'disabled' : 'live'} />
              </span>
            ))}
            {suffix?.icon && (() => {
              const I = ICONS[suffix.icon];
              return <I aria-hidden size={f.suffix.iconSize} strokeWidth={2} style={{ color: 'var(--pl-sicon)', flexShrink: 0 }} />;
            })()}
            {suffix?.chevron && <ChevronRight aria-hidden size={f.suffix.iconSize} strokeWidth={2} style={{ color: 'var(--pl-sicon)', flexShrink: 0 }} />}
            {suffixNode}
            {suffixMark}
          </span>
        )}
        {/* 키보드 포커스 링 — 누르는 줄의 안쪽 2px(컨트롤 줄은 컨트롤의 링) */}
        {focused && !control && <span aria-hidden style={{ position: 'absolute', inset: 0, outline: `${f.ring.width}px solid var(--pl-ring)`, outlineOffset: f.ring.offset, pointerEvents: 'none' }} />}
      </div>
    </li>
  );
}

function Prefix({ spec, f, look, mode, twoLine }: { spec: PrefixSpec; f: ListFace; look: ListLook; mode: ViewMode; twoLine: boolean }) {
  if ('tile' in spec) {
    const I = ICONS[spec.icon];
    return (
      <span aria-hidden style={{ display: 'inline-grid', placeItems: 'center', width: f.tile.size, height: f.tile.size, borderRadius: f.tile.radius, background: 'var(--pl-tile-bg)', color: 'var(--pl-tile-fg)' }}>
        <I size={f.tile.iconSize} strokeWidth={2} />
      </span>
    );
  }
  // 물건 · 카드 그림 — 그 부품의 그림 그대로(Logo Tile · Image Frame)
  if ('node' in spec) return <>{spec.node}</>;
  // 사람 — Avatar(이니셜 + 이름 색 · 1px 안쪽 테두리). 줄의 제목이 이름이라 아바타는 장식
  if ('person' in spec) return <AvatarView look={look.avatar} mode={mode} size={twoLine ? look.avatarSize.two : look.avatarSize.one} name={spec.person} photo={spec.photo} />;
  const I = ICONS[spec.icon];
  return <I aria-hidden size={f.prefix.iconSize} strokeWidth={2} style={{ color: 'var(--pl-icon)' }} />;
}

export type ListViewProps = {
  look: ListLook;
  rows: RowSpec[];
  mode?: ViewMode;
  live?: boolean;
  // 줄 사이 선 — 기본 없음
  divider?: 'none' | 'full' | 'inset';
  ariaLabel?: string;
  width?: number | string;
  bgRadius?: number;
  // 줄마다 콘텐츠 좌우 여백을 따로(나쁜 예)
  padX?: (number | undefined)[];
  style?: CSSProperties;
  // 하나 고르기 — 고른 값을 밖에서 쥐거나(value) 바뀔 때 듣는다(onValue). 없으면 목록이 스스로 쥔다
  value?: string;
  onValue?: (v: string) => void;
};

// 목록 — 라디오 줄이 있으면 하나 고르기 묶음(role=radiogroup), 모두 체크 줄이면 여럿 고르기 묶음(fieldset)
export function ListView({ look, rows, mode = 'auto', live = true, divider = 'none', ariaLabel, width = '100%', bgRadius, padX, style, value: valueProp, onValue }: ListViewProps) {
  const radios = rows.filter((r) => r.kind === 'radio');
  const [own, setOwn] = useState(radios.find((r) => r.checked)?.value ?? radios[0]?.value);
  const value = valueProp ?? own;
  const setValue = (v: string | undefined) => {
    setOwn(v);
    if (v !== undefined) onValue?.(v);
  };
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const isGroup = radios.length > 0;
  const isCheckGroup = !isGroup && rows.length > 0 && rows.every((r) => r.kind === 'check');
  const f = look.faces.none[pickL(mode)].enabled;
  const fd = look.faces.none[pickD(mode)].enabled;
  const w = typeof width === 'number' ? width : 360;

  const move = (from: number, dir: 1 | -1) => {
    for (let k = 1; k <= rows.length; k++) {
      const i = (from + dir * k + rows.length) % rows.length;
      const r = rows[i];
      if (r.kind === 'radio' && !r.disabled) {
        setValue(r.value);
        refs.current[i]?.focus();
        return;
      }
    }
  };

  const items: ReactNode[] = [];
  rows.forEach((row, i) => {
    if (i > 0 && divider !== 'none')
      items.push(<li key={`d${i}`} aria-hidden className="plst" data-mode={mode} style={{ listStyle: 'none', height: f.divider.height, background: 'var(--pl-div)', margin: divider === 'inset' ? `0 ${f.pad.x}px` : 0 }} />);
    items.push(
      <Row
        key={i}
        look={look}
        row={row}
        mode={mode}
        live={live}
        width={w}
        bgRadius={bgRadius}
        padX={padX?.[i]}
        selected={row.kind === 'radio' ? row.value === value : undefined}
        onSelect={() => setValue(row.value)}
        onArrow={(dir) => move(i, dir)}
        tabIndex={row.kind === 'radio' ? (row.value === value ? 0 : -1) : undefined}
        registerRef={(el) => {
          refs.current[i] = el;
        }}
      />,
    );
  });
  const vars = { '--pl-div-l': f.divider.color, '--pl-div-d': fd.divider.color } as CSSProperties;
  const common = { className: 'plst', 'data-mode': mode, style: { ...vars, display: 'flex', flexDirection: 'column' as const, width, margin: 0, padding: 0, ...style } };
  const inner = <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>{items}</ul>;
  return isGroup ? (
    <div role="radiogroup" aria-label={ariaLabel} {...common}>
      {inner}
    </div>
  ) : isCheckGroup ? (
    <fieldset aria-label={ariaLabel} {...common} style={{ ...common.style, border: 0, minWidth: 0 }}>
      {inner}
    </fieldset>
  ) : (
    <ul aria-label={ariaLabel} {...common}>
      {items}
    </ul>
  );
}

// 목록 제목 — 목록 밖, 바로 위. 오른쪽에 작은 버튼을 둘 수 있다
export function ListHeaderView({ look, variant = 'mediumWeak', title, action, mode = 'auto', width = '100%' }: { look: ListLook; variant?: HeaderVariant; title: string; action?: string; mode?: ViewMode; width?: number | string }) {
  const L = look.header[variant][pickL(mode)];
  const D = look.header[variant][pickD(mode)];
  return (
    <div
      className="plst"
      data-mode={mode}
      style={
        {
          '--pl-hd-l': L.color,
          '--pl-hd-d': D.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: L.gap,
          width,
          boxSizing: 'border-box',
          padding: `${L.padY}px ${L.padX}px`,
          fontFamily: L.fontFamily,
          fontSize: L.fontSize,
          lineHeight: L.lineHeight,
          fontWeight: L.fontWeight,
          color: 'var(--pl-hd)',
        } as CSSProperties
      }
    >
      <span>{title}</span>
      {/* 글 버튼 — 위아래로 블리드해 줄 높이를 바꾸지 않고, 오른쪽 여백만큼 바깥으로 내어 글자 끝이 줄 여백에 선다(list-header.yaml action) */}
      {action && <ButtonView look={look.marks.headerAction} mode={mode} label={action} style={{ marginTop: -look.marks.headerAction.faces.light.enabled.padY, marginBottom: -look.marks.headerAction.faces.light.enabled.padY, marginRight: -look.marks.headerAction.faces.light.enabled.padX }} />}
    </div>
  );
}
