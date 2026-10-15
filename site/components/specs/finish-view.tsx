'use client';
// 스펙대로 그린 마무리 묶음 — Quantity Picker · Attachment Input · Footer · Avatar 의 사진 바꾸기 자리.
// 모양은 finish-look 이 YAML 에서 푼 값(QpLook · AtLook · FtLook · AvEditLook)만 받는다. 치수 · 색은 CSS 변수로 싣고 global.css 의
// .pqp · .pat · .pft 가 그린다 — 반응형(1280 에서 large → medium) · 올림 · 누름 · 키보드 포커스를 CSS 가 맡는다.
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
// 인라인 스타일은 단축 속성(padding · margin · inset)과 개별 속성을 한 객체에 섞지 않는다 — 링크로 들어올 때 React 가 단축 값을 지운다(#154).
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowUpRight, CircleAlert, File as FileIcon, FileSpreadsheet, FileText, Image as ImageIcon, Minus, Paperclip, Plus, RotateCw, Trash2, X } from 'lucide-react';
import { ButtonView } from './button-view';
import { ProgressCircleView, ScrollFogView } from './loading-view';
import { PcArc } from './pc-arc';
import { PicLayer } from './image-view';
import type { PicKind } from './image-shared';
import { AvatarView } from './display-view';
import type { AvatarLook } from './display-shared';
import {
  FONT,
  copyrightText,
  formatFileSize,
  icv,
  qpPressScale,
  splitExt,
  typeStyle,
  type AtEntry,
  type AtLook,
  type AvEditLook,
  type FtLinkSize,
  type FtLook,
  type IColor,
  type QpButtonState,
  type QpLook,
  type QpSizeProp,
  type ViewMode,
} from './finish-shared';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };
const px = (n: number) => `${n}px`;
// 그림 표시 분홍(foundations/ui 의 MARK · MARK_LINE 과 같은 값) — 그 파일은 서버 모듈이라 브라우저 그림이 들이지 않는다
export const MARK = 'rgba(236, 72, 153, 0.22)';
export const MARK_LINE = '#DB2777';

// ── 실제 크기로 그리고 칸 폭에 맞춰 줄인다 ───────────────────
// 그림은 w(폰 390 · 데스크톱 1280)로 그리고, 놓인 칸이 그보다 좁으면 그 비율로 줄인다(넓으면 max 배 — 기본 1, 키우지 않는다)
export function Fit({ w, children, max = 1, style, label }: { w: number; children: ReactNode; max?: number; style?: CSSProperties; label?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ s: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = Math.min(max, o.clientWidth / w);
      setBox({ s: Math.round(s * 1000) / 1000, h: i.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [w, max]);
  const s = box?.s ?? 1;
  return (
    <div ref={outer} data-fit={w} aria-label={label} style={{ width: '100%', maxWidth: w * max, height: box ? box.h * s : undefined, overflow: 'hidden', ...style }}>
      <div ref={inner} style={{ width: w, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>
        {children}
      </div>
    </div>
  );
}

// ── Quantity Picker ───────────────────────────────────────
function qpVars(look: QpLook, size: QpSizeProp, mode: ViewMode, invalid: boolean): CSSProperties {
  const l = look.sizes[size === 'responsive' ? look.responsive.below : size];
  const m = look.sizes[size === 'responsive' ? look.responsive.above : size];
  const c = (x: IColor) => icv(x, mode);
  const v: Record<string, string> = {};
  for (const [k, a, b] of [
    ['h', l.h, m.h],
    ['r', l.radius, m.radius],
    ['ic', l.icon, m.icon],
    ['ext', l.extend, m.extend],
  ] as const) {
    v[`--pqp-${k}-l`] = px(a);
    v[`--pqp-${k}-m`] = px(b);
  }
  v['--pqp-fs-l'] = l.text.fontSize;
  v['--pqp-fs-m'] = m.text.fontSize;
  v['--pqp-lh-l'] = l.text.lineHeight;
  v['--pqp-lh-m'] = m.text.lineHeight;
  v['--pqp-ps-l'] = String(qpPressScale(look, l.h));
  v['--pqp-ps-m'] = String(qpPressScale(look, m.h));
  Object.assign(v, {
    '--pqp-bg': c(look.root.bg),
    '--pqp-bw': px(look.root.borderW),
    '--pqp-bd': c(look.root.border),
    '--pqp-iw': px(look.root.invalidW),
    '--pqp-ibd': c(look.root.invalid),
    '--pqp-icc': c(look.icon.color),
    '--pqp-dis': c(look.icon.disabled),
    '--pqp-hov': c(look.button.hoverBg),
    '--pqp-prs': c(look.button.pressedBg),
    '--pqp-load': c(look.button.loadingBg),
    '--pqp-dw': px(look.divider.w),
    '--pqp-dh': px(look.divider.h),
    '--pqp-dc': c(look.divider.color),
    '--pqp-vc': c(invalid ? look.value.color : look.value.color),
    '--pqp-vdis': c(look.value.disabled),
    '--pqp-vfw': String(look.value.weight),
    '--pqp-vpx': px(look.value.padX),
    '--pqp-rw': px(look.ring.width),
    '--pqp-ro': px(look.ring.offset),
    '--pqp-ring': c(look.ring.color),
    '--pqp-dur': look.color.duration,
    '--pqp-ease': look.color.easing,
    '--pqp-sdur': look.press.motion.duration,
    '--pqp-sease': look.press.motion.easing,
  });
  return v as CSSProperties;
}

export type QpPart = 'root' | 'decrement' | 'divider' | 'value' | 'increment';
export type QpViewProps = {
  look: QpLook;
  mode?: ViewMode;
  size?: QpSizeProp;
  layout?: 'hug' | 'fill';
  value: number;
  min?: number;
  max?: number;
  step?: number;
  // 값 칸 글 = 값 + unit("3회" · "8h") — getValueText 의 그림판(서버 그림은 함수를 넘기지 못한다)
  unit?: string;
  // 값 칸의 폭을 잡는 가장 긴 글 — 없으면 최대값의 글
  placeholder?: string;
  removable?: boolean;
  removeLabel?: string;
  loading?: 'decrement' | 'increment' | 'both';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  // 멈춘 그림 — 누르지 않는 그림. 버튼마다 상태를 줄 수 있다
  frozen?: boolean;
  states?: Partial<Record<'decrement' | 'increment', QpButtonState>>;
  // 바깥에서 값을 쥐면 — 없으면 그림이 스스로 쥔다
  onValueChange?: (v: number) => void;
  onRemove?: () => void;
  ariaLabel?: string;
  labelledBy?: string;
  describedBy?: string;
  name?: string;
  // 누르는 자리(분홍) 보이기
  showHit?: boolean;
  pins?: Partial<Record<QpPart, ReactNode>>;
  marks?: Partial<Record<QpPart, CSSProperties>>;
  style?: CSSProperties;
};

export function QpView({
  look,
  mode = 'auto',
  size = look.defaults.size,
  layout = look.defaults.layout,
  value,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  unit = '',
  placeholder,
  removable = false,
  removeLabel,
  loading,
  invalid = false,
  disabled = false,
  readOnly = false,
  frozen = false,
  states,
  onValueChange,
  onRemove,
  ariaLabel,
  labelledBy,
  describedBy,
  name,
  showHit = false,
  pins,
  marks,
  style,
}: QpViewProps) {
  const [own, setOwn] = useState(value);
  const v = onValueChange ? value : own;
  const set = (n: number) => (onValueChange ? onValueChange(n) : setOwn(n));
  const lo = v <= min;
  const hi = v >= max;
  const text = `${v}${unit}`;
  // 값 칸 폭 — getValueText(min) · getValueText(max) 가운데 긴 글(max 를 주지 않으면 max 글은 빼고 min 과 지금 값)
  const ph = placeholder ?? [`${min}${unit}`, max === Number.MAX_SAFE_INTEGER ? text : `${max}${unit}`].reduce((a, c) => (c.length >= a.length ? c : a));
  const rm = removable && lo;
  const loadDec = loading === 'decrement' || loading === 'both';
  const loadInc = loading === 'increment' || loading === 'both';
  const live = !frozen;
  const button = (part: 'decrement' | 'increment') => {
    const dec = part === 'decrement';
    const atEdge = dec ? lo && !rm : hi;
    const busy = dec ? loadDec : loadInc;
    const ariaDisabled = atEdge || readOnly;
    const st = states?.[part];
    const sz = look.sizes[size === 'responsive' ? look.responsive.below : size];
    const Glyph = dec ? (rm ? Trash2 : Minus) : Plus;
    const label = dec ? (rm ? (removeLabel ?? `${look.names.decrement}`) : look.names.decrement) : look.names.increment;
    return (
      <button
        type="button"
        className="pqp-b"
        data-live={live || undefined}
        data-state={st}
        aria-label={label}
        aria-disabled={ariaDisabled ? true : undefined}
        aria-busy={busy || st === 'loading' ? true : undefined}
        disabled={disabled}
        tabIndex={frozen ? -1 : undefined}
        onClick={() => {
          if (frozen || ariaDisabled || busy || disabled) return;
          if (dec && rm) return onRemove?.();
          set(dec ? Math.max(min, v - step) : Math.min(max, v + step));
        }}
        style={marks?.[part]}
      >
        {busy || st === 'loading' ? (
          <span aria-hidden className="pqp-pc" style={{ display: 'inline-flex' }}>
            {/* 아이콘 자리의 값 없는 원 — 크기는 아이콘과 같다(반응형이면 CSS 변수 --pqp-ic) */}
            <PcArc size={sz.progress} thickness={look.progress.thickness} track={icv(look.progress.track, mode)} range={icv(look.progress.range, mode)} style={{ width: 'var(--pqp-ic)', height: 'var(--pqp-ic)' }} />
          </span>
        ) : (
          <Glyph aria-hidden strokeWidth={2} />
        )}
        {pins?.[part]}
      </button>
    );
  };
  return (
    <div
      role="group"
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className="pqp"
      data-size={size}
      data-layout={layout}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-hit={showHit || undefined}
      style={{ ...qpVars(look, size, mode, invalid), ...marks?.root, ...style }}
    >
      {button('decrement')}
      <span aria-hidden className="pqp-d" style={{ position: 'relative', ...marks?.divider }}>
        {pins?.divider}
      </span>
      <span className="pqp-v" style={marks?.value}>
        <span aria-hidden data-ph="">
          {ph}
        </span>
        <span aria-live="polite" aria-atomic="true">
          {text}
        </span>
        {pins?.value}
      </span>
      <span aria-hidden className="pqp-d" />
      {button('increment')}
      {pins?.root}
      {name && <input type="hidden" name={name} value={v} disabled={disabled} />}
    </div>
  );
}

// ── Attachment Input ──────────────────────────────────────
export function atVars(look: AtLook, mode: ViewMode): CSSProperties {
  const c = (x: IColor) => icv(x, mode);
  return {
    '--pat-ts': px(look.trigger.size),
    '--pat-tr': px(look.trigger.radius),
    '--pat-tbw': px(look.trigger.borderW),
    '--pat-tbd': c(look.trigger.border),
    '--pat-tg': px(look.trigger.gap),
    '--pat-tic': px(look.trigger.icon),
    '--pat-ticc': c(look.trigger.iconColor),
    '--pat-hov': c(look.trigger.hoverBg),
    '--pat-prs': c(look.trigger.pressedBg),
    '--pat-cc': c(look.count.color),
    '--pat-cm': c(look.count.max),
    '--pat-dis': c(look.disabled),
    '--pat-ih': px(look.item.h),
    '--pat-ir': px(look.item.radius),
    '--pat-ibw': px(look.item.borderW),
    '--pat-iw': px(look.item.imageW),
    '--pat-fw': px(look.item.fileW),
    '--pat-fpx': px(look.item.filePadX),
    '--pat-fgap': px(look.item.gap),
    '--pat-isc': c(look.item.imageStroke),
    '--pat-fbd': c(look.item.fileBorder),
    '--pat-ths': px(look.thumb.size),
    '--pat-thr': px(look.thumb.radius),
    '--pat-thbg': c(look.thumb.bg),
    '--pat-thi': px(look.thumb.icon),
    '--pat-thic': c(look.thumb.iconColor),
    '--pat-mw': px(look.meta.width),
    '--pat-nc': c(look.name.color),
    '--pat-sc': c(look.size.color),
    '--pat-xs': px(look.remove.size),
    '--pat-xbg': c(look.remove.bg),
    '--pat-xbw': px(look.remove.borderW),
    '--pat-xbd': c(look.remove.border),
    '--pat-xo': px(look.remove.offset),
    '--pat-xis': px(look.remove.icon),
    '--pat-xic': c(look.remove.iconColor),
    '--pat-xe': px(look.remove.extend),
    '--pat-xhov': c(look.remove.hoverBg),
    '--pat-xprs': c(look.remove.pressedBg),
    '--pat-mr': px(look.mask.size / 2),
    '--pat-mo': px(look.mask.offset),
    '--pat-rw': px(look.ring.width),
    '--pat-ro': px(look.ring.offset),
    '--pat-ring': c(look.ring.color),
    '--pat-dur': look.color.duration,
    '--pat-ease': look.color.easing,
    '--pat-sdur': look.press.motion.duration,
    '--pat-sease': look.press.motion.easing,
    '--pat-dzh': px(look.dropzone.h),
    '--pat-dzg': px(look.dropzone.gap),
    '--pat-dzpx': px(look.dropzone.padX),
    '--pat-dzr': px(look.dropzone.radius),
    '--pat-dzbw': px(look.dropzone.borderW),
    '--pat-dzbd': c(look.dropzone.border),
    '--pat-dzdbd': c(look.dropzone.dragBorder),
    '--pat-dzdbg': c(look.dropzone.dragBg),
    '--pat-dzxbd': c(look.dropzone.disabledBorder),
    '--pat-dzlc': c(look.dropzone.labelColor),
    '--pat-hitf': MARK,
    '--pat-hitl': MARK_LINE,
  } as CSSProperties;
}
// 누른 · 끄는 부품의 배율 — 기준 길이 max(높이, 폭 ÷ 4, 24) 에서 축소량만큼
const atScale = (look: AtLook, w: number, h: number) => {
  const basis = Math.max(h, w / look.press.widthDivisor, look.press.minBasis);
  return String((basis - look.press.distance) / basis);
};

export type AtPartState = 'hovered' | 'pressed' | 'focused';
// 첨부 타일 — 아이콘 24 + "n/최대". 다 차면 aria-disabled(초점은 남는다)
export function AtTriggerView({
  look,
  mode = 'auto',
  count,
  max,
  accept = 'image',
  label = '영수증',
  disabled = false,
  readOnly = false,
  state,
  frozen = false,
  onPress,
  pins,
  style,
}: {
  look: AtLook;
  mode?: ViewMode;
  count: number;
  max?: number;
  accept?: 'image' | 'file';
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  state?: AtPartState;
  frozen?: boolean;
  onPress?: () => void;
  pins?: ReactNode;
  style?: CSSProperties;
}) {
  const full = max !== undefined && count >= max;
  const blocked = full || readOnly;
  const Glyph = accept === 'image' ? ImageIcon : Paperclip;
  const name = `${label} 첨부${max !== undefined ? `, ${count}/${max}` : ''}`;
  return (
    <button
      type="button"
      className="pat-t"
      data-live={!frozen || undefined}
      data-state={state}
      aria-label={name}
      aria-disabled={blocked ? true : undefined}
      disabled={disabled}
      tabIndex={frozen ? -1 : undefined}
      onClick={() => !blocked && !frozen && onPress?.()}
      style={{ ...atVars(look, mode), ['--pat-ps' as string]: atScale(look, look.trigger.size, look.trigger.size), ...style }}
    >
      <Glyph aria-hidden strokeWidth={2} />
      {max !== undefined && (
        <span aria-hidden className="pat-count" style={typeStyle(look.count.text)}>
          <span>{count}</span>
          <span data-max="">/{max}</span>
        </span>
      )}
      {pins}
    </button>
  );
}

// 파일 이름 — 글자 단위로 줄을 바꿔 네 줄까지. 넘치면 셋째 줄 끝을 "…" 로 줄이고 넷째 줄에 확장자를 남긴다.
// 줄 수는 브라우저에서 잰다(글 폭은 글꼴이 정한다). raw — SEED 레시피 그대로(줄을 자르지 않고 칸 끝에서 끊는다 — 넘침이 요점)
export function AtFileName({ look, mode = 'auto', name, raw = false, color, onLines }: { look: AtLook; mode?: ViewMode; name: string; raw?: boolean; color?: IColor; onLines?: (n: number) => void }) {
  const probe = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<number | null>(null);
  const lh = parseFloat(look.name.text.lineHeight);
  useIsoLayoutEffect(() => {
    const el = probe.current;
    if (!el) return;
    const measure = () => {
      const n = Math.round(el.offsetHeight / lh);
      setLines(n);
      onLines?.(n);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [name, lh]);
  const t: CSSProperties = { ...typeStyle(look.name.text), color: icv(color ?? look.name.color, mode), display: 'block', width: look.meta.width };
  // 줄바꿈 — YAML 의 name.wordBreak(글자 단위 break-all — 11D). raw 는 SEED 레시피 그대로 — 줄을 자르지 않는다(넘침이 요점)
  const wrap: CSSProperties = raw || look.name.wordBreak === 'break-all' ? { wordBreak: 'break-all', overflowWrap: 'normal' } : { wordBreak: 'keep-all', overflowWrap: 'break-word' };
  const cut = !raw && lines !== null && lines > look.name.maxLines;
  const { base, ext } = splitExt(name);
  // 첫 줄만 오른쪽 maskClear 를 비운다 — × 둘레 구멍이 첫 줄 끝 글자를 파먹지 않게(오른쪽 float maskClear × 줄 높이)
  const clear = <span aria-hidden data-mask-clear="" style={{ float: 'right', width: look.name.maskClear, height: lh }} />;
  return (
    <span aria-hidden data-lines={lines ?? undefined} data-cut={cut || undefined} style={{ position: 'relative', display: 'block' }}>
      <span ref={probe} style={{ ...t, ...wrap, position: 'absolute', visibility: 'hidden', pointerEvents: 'none', top: 0, left: 0 }}>
        {clear}
        {name}
      </span>
      {cut ? (
        <>
          <span style={{ ...t, ...wrap, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: look.name.maxLines - 1 }}>
            {clear}
            {base}
          </span>
          <span style={{ ...t, whiteSpace: 'nowrap' }}>{ext}</span>
        </>
      ) : (
        <span style={{ ...t, ...wrap, ...(raw ? {} : { overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: look.name.maxLines }) }}>
          {!raw && clear}
          {name}
        </span>
      )}
    </span>
  );
}

const STATUS_KO: Record<AtEntry['status'], string> = { pending: '', success: '', uploading: '올리는 중', error: '올리지 못했어요' };
export const entryName = (e: AtEntry) => [e.name, formatFileSize(e.size), e.status === 'uploading' ? `${STATUS_KO.uploading} ${Math.round((e.progress ?? 0) * 100)}%` : STATUS_KO[e.status]].filter(Boolean).join(', ');

export type AtItemViewProps = {
  look: AtLook;
  mode?: ViewMode;
  entry: AtEntry;
  badge?: string;
  // 지우기 × — 없애면(읽기 전용이 아닌데 × 를 빼는 그림은 끄는 중 뿐) 구멍도 없다
  removable?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  frozen?: boolean;
  state?: { item?: 'focused'; remove?: AtPartState; action?: 'pressed' | 'focused' };
  onRemove?: () => void;
  onRetry?: () => void;
  // 순서를 바꿀 수 있는 항목 — 항목이 버튼(role) · 키 · 끌기를 받는다(쓰는 쪽이 넘긴다)
  itemProps?: HTMLAttributes<HTMLDivElement> & { 'data-reorder'?: string };
  showHit?: boolean;
  raw?: boolean;
  pins?: Partial<Record<'item' | 'remove' | 'badge' | 'thumb' | 'name' | 'size' | 'action', ReactNode>>;
  style?: CSSProperties;
};

const FILE_GLYPH = { pdf: FileText, sheet: FileSpreadsheet, file: FileIcon };
export function AtItemView({ look, mode = 'auto', entry, badge, removable = true, readOnly = false, disabled = false, dragging = false, frozen = false, state, onRemove, onRetry, itemProps, showHit = false, raw = false, pins, style }: AtItemViewProps) {
  const image = entry.kind === 'image';
  const w = image ? look.item.imageW : look.item.fileW;
  const showX = removable && !dragging;
  const xBlocked = readOnly;
  // 사진의 읽기 전용 · 끄는 중은 불투명도(13B — SEED 그대로), 파일 카드는 글 · 아이콘만 막힌 색
  const fade = image ? (dragging ? look.imageFade.dragging : readOnly ? look.imageFade.readonly : 1) : 1;
  const dim = !image && (dragging || readOnly);
  const label = entryName(entry);
  const pc = look.circle;
  const ratio = entry.progress ?? 0;
  const progress = (tone: 'staticWhite' | 'neutral') => (
    <ProgressCircleView look={pc} mode={mode} size="24" tone={tone} value={Math.round(ratio * 100)} label={`${entry.name} 올리는 중`} />
  );
  const retry = (color: IColor, fill: boolean) => (
    <button
      type="button"
      className="pat-act"
      data-live={!frozen || undefined}
      data-state={state?.action}
      aria-label={`${entry.name} ${look.action.label}`}
      disabled={disabled}
      tabIndex={frozen ? -1 : undefined}
      onClick={() => !frozen && onRetry?.()}
      style={{ ...typeStyle(look.action.text), color: icv(color, mode), gap: look.action.gap, width: fill ? '100%' : undefined, ['--pat-aps' as string]: atScale(look, w, look.item.h) }}
    >
      <RotateCw aria-hidden size={look.action.icon} strokeWidth={2} />
      <span>{look.action.label}</span>
      {pins?.action}
    </button>
  );
  const role = itemProps?.role ? {} : { role: 'group', 'aria-label': label };
  return (
    <div
      className="pat-it"
      data-kind={entry.kind}
      data-x={showX || undefined}
      data-dragging={dragging || undefined}
      data-readonly={readOnly || undefined}
      data-state={state?.item}
      data-hit={showHit || undefined}
      {...role}
      {...itemProps}
      style={{
        ...atVars(look, mode),
        width: w,
        opacity: fade === 1 ? undefined : fade,
        ['--pat-dps' as string]: atScale(look, w, look.item.h),
        ['--pat-fdur' as string]: look.imageFade.motion.duration,
        ['--pat-fease' as string]: look.imageFade.motion.easing,
        ...style,
        ...itemProps?.style,
      }}
    >
      <div className="pat-face">
        {image ? (
          <>
            {entry.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" src={entry.previewUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <span style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                <PicLayer kind={(entry.pic ?? 'receipt') as PicKind} frame={1} />
              </span>
            )}
            {entry.status === 'uploading' && (
              <span className="pat-cover" style={{ background: icv(look.dim.uploading, mode) }}>
                {progress('staticWhite')}
              </span>
            )}
            {entry.status === 'error' && (
              <span className="pat-cover" style={{ background: look.dim.error }}>
                {retry(look.action.imageColor, true)}
              </span>
            )}
            {badge && (
              <span className="pat-badge" style={{ ...typeStyle(look.badge.text), height: look.badge.h, paddingLeft: look.badge.padX, paddingRight: look.badge.padX, borderRadius: look.badge.radius, background: look.badge.bg, color: icv(look.badge.fg, mode) }}>
                {badge}
                {pins?.badge}
              </span>
            )}
            <span aria-hidden className="pat-stroke" style={{ boxShadow: `inset 0 0 0 ${look.item.borderW}px ${icv(look.item.imageStroke, mode)}` }} />
          </>
        ) : (
          <>
            <span aria-hidden className="pat-stroke" style={{ boxShadow: `inset 0 0 0 ${look.item.borderW}px ${icv(look.item.fileBorder, mode)}` }} />
            {entry.status === 'error' ? (
              <span className="pat-card" style={{ paddingLeft: look.item.filePadX, paddingRight: look.item.filePadX }}>
                {retry(look.action.fileColor, true)}
              </span>
            ) : (
              <span className="pat-card" style={{ paddingLeft: look.item.filePadX, paddingRight: look.item.filePadX, gap: look.item.gap }}>
                <span className="pat-thumb" style={{ position: 'relative' }}>
                  {entry.status === 'uploading'
                    ? progress('neutral')
                    : (() => {
                        const G = FILE_GLYPH[entry.glyph ?? 'file'];
                        return <G aria-hidden strokeWidth={2} style={{ width: look.thumb.icon, height: look.thumb.icon, color: icv(dim ? look.disabled : look.thumb.iconColor, mode) }} />;
                      })()}
                  {pins?.thumb}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', width: look.meta.width, minWidth: 0, position: 'relative' }}>
                  <AtFileName look={look} mode={mode} name={entry.name} raw={raw} color={dim ? look.disabled : undefined} />
                  <span aria-hidden style={{ ...typeStyle(look.size.text), color: icv(dim ? look.disabled : look.size.color, mode), whiteSpace: 'nowrap', position: 'relative' }}>
                    {formatFileSize(entry.size)}
                    {pins?.size}
                  </span>
                  {pins?.name}
                </span>
              </span>
            )}
          </>
        )}
      </div>
      {showX && (
        <button
          type="button"
          className="pat-x"
          data-live={!frozen || undefined}
          data-state={state?.remove}
          aria-label={`${entry.name} 지우기`}
          aria-disabled={xBlocked ? true : undefined}
          disabled={disabled}
          tabIndex={frozen ? -1 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (!frozen && !xBlocked) onRemove?.();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{ ['--pat-xps' as string]: atScale(look, look.remove.size, look.remove.size) }}
        >
          <X aria-hidden strokeWidth={2.5} />
          {pins?.remove}
        </button>
      )}
      {pins?.item}
    </div>
  );
}

// 항목 줄 — 첨부 타일 + 항목을 한 줄로, 넘치면 가로 스크롤(스크롤바 숨김 · 좌우 끝 흐림). 화면 여백까지 넓힌다(bleed)
export function AtRowView({ look, children, at = 'start', live = true, bleed = true, fog = true, ariaLabel, style, scrollRef, onScroll }: { look: AtLook; children: ReactNode; at?: 'start' | 'end'; live?: boolean; bleed?: boolean; fog?: boolean; ariaLabel?: string; style?: CSSProperties; scrollRef?: (el: HTMLDivElement | null) => void; onScroll?: () => void }) {
  const b = bleed ? look.items.bleed : 0;
  return (
    <ScrollFogView
      look={look.fogLook}
      use="row"
      live={live}
      at={at}
      fog={fog}
      pad={bleed}
      ariaLabel={ariaLabel}
      scrollRef={scrollRef}
      onScroll={onScroll}
      style={{ marginLeft: -b, marginRight: -b, marginTop: -look.items.padTop, ...style }}
      innerStyle={{ gap: look.items.gap, paddingTop: look.items.padTop, alignItems: 'flex-start' }}
    >
      {children}
    </ScrollFogView>
  );
}

// 드롭존 — 높이 120 · 1px 실선 · 안내 + 파일 선택(Button neutralWeak small). 상자 전체를 누르는 자리로 두지 않는다
export function AtDropzoneView({
  look,
  mode = 'auto',
  drag = false,
  disabled = false,
  buttonState,
  onPick,
  dropProps,
  pins,
  style,
}: {
  look: AtLook;
  mode?: ViewMode;
  drag?: boolean;
  disabled?: boolean;
  buttonState?: 'enabled' | 'hovered' | 'pressed' | 'focused' | 'disabled' | 'live';
  onPick?: () => void;
  dropProps?: HTMLAttributes<HTMLDivElement>;
  pins?: Partial<Record<'root' | 'label' | 'button', ReactNode>>;
  style?: CSSProperties;
}) {
  return (
    <div className="pat-dz" data-drag={(drag && !disabled) || undefined} data-disabled={disabled || undefined} {...dropProps} style={{ ...atVars(look, mode), ...style }}>
      <span className="pat-dzl" style={{ ...typeStyle(look.dropzone.label), position: 'relative' }}>
        {look.dropzone.text}
        {pins?.label}
      </span>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <ButtonView look={look.pick.wide} mode={mode} label={look.pick.label} state={disabled ? 'disabled' : (buttonState ?? 'live')} onClick={onPick} />
        {pins?.button}
      </span>
      {pins?.root}
    </div>
  );
}
// 1280 미만 · 앱 — 드롭존 없이 파일 선택(Button large · 칸 폭 · 앞 아이콘 upload)
export function AtPickButtonView({ look, mode = 'auto', disabled = false, state, onPick }: { look: AtLook; mode?: ViewMode; disabled?: boolean; state?: 'enabled' | 'pressed' | 'focused' | 'live'; onPick?: () => void }) {
  return <ButtonView look={look.pick.narrow} mode={mode} label={look.pick.label} prefix="upload" fill state={disabled ? 'disabled' : (state ?? 'live')} onClick={onPick} />;
}

// ── Footer ────────────────────────────────────────────────
export type FtLink = { label: string; href?: string; external?: boolean; key?: string };
export type FtBlocks = {
  brand?: { name: string; description?: string };
  columns?: { title: string; links: FtLink[] }[];
  divider?: boolean;
  policy?: FtLink[];
  text?: string[];
  // 사업자 정보 · 연락처 — 값이 없다. 자리표시 글만(지어내지 않는다)
  business?: string[][];
  contact?: string[][];
  copyright?: { owner: string; year: number };
  // 소셜 — 자리표시 버튼 수
  social?: number;
};
// porest-home 처럼 색 · 글꼴을 바꿔 그릴 때(짜임 · 간격 · 글 크기는 그대로)
export type FtSkin = { font: string; ink: string; ink2: string; ink3: string; line: string; brand: string; bg: string };

export function FtLinkView({ look, mode = 'auto', link, size, state, skin, frozen = false, underline = false }: { look: FtLook; mode?: ViewMode; link: FtLink; size: FtLinkSize; state?: 'hovered' | 'pressed' | 'focused'; skin?: FtSkin; frozen?: boolean; underline?: boolean }) {
  const l = look.link[size];
  const fg = skin ? (size === 'large' ? skin.ink : skin.ink2) : icv(l.color, mode);
  const hv = skin ? (size === 'large' ? skin.ink3 : skin.ink) : icv(l.hover, mode);
  return (
    <a
      href={link.href ?? '#'}
      className="pft-a"
      data-live={!frozen || undefined}
      data-state={state}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener' : undefined}
      tabIndex={frozen ? -1 : undefined}
      onClick={(e) => {
        // 그림 속 링크 — 문서 사이트를 떠나지 않는다
        e.preventDefault();
      }}
      style={{
        ...typeStyle(l.text),
        fontFamily: skin?.font ?? l.text.fontFamily,
        gap: look.link.gap,
        textDecorationLine: underline ? 'underline' : undefined,
        ['--pft-c' as string]: fg,
        ['--pft-h' as string]: hv,
        ['--pft-is' as string]: px(l.icon),
        ['--pft-rw' as string]: px(look.ring.width),
        ['--pft-ro' as string]: px(look.ring.offset),
        ['--pft-rr' as string]: px(look.ring.radius),
        ['--pft-ring' as string]: skin ? skin.brand : icv(look.ring.color, mode),
        ['--pft-dur' as string]: look.color.duration,
        ['--pft-ease' as string]: look.color.easing,
      }}
    >
      {link.label}
      {link.external && (
        <>
          <ArrowUpRight aria-hidden strokeWidth={2} />
          <span style={srOnly}>(새 탭)</span>
        </>
      )}
    </a>
  );
}

// 자리표시 칸 — 값이 없는 블록(사업자 정보 · 연락처 · 소셜). 그림 표시 분홍 점선으로 "값이 아니라 자리" 임을 드러낸다
function Slot({ children, round = false, size }: { children?: ReactNode; round?: boolean; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: size,
        height: size,
        paddingLeft: round ? 0 : 4,
        paddingRight: round ? 0 : 4,
        borderRadius: round ? 9999 : 4,
        background: MARK,
        outline: `1px dashed ${MARK_LINE}`,
        outlineOffset: -1,
      }}
    >
      {children}
    </span>
  );
}

export function FooterView({
  look,
  mode = 'auto',
  width,
  blocks,
  topLine = true,
  states,
  skin,
  frozen = false,
  pins,
  marks,
  socialSlot,
  underline = false,
  slots = true,
}: {
  look: FtLook;
  mode?: ViewMode;
  // 그리는 폭 — 1280 미만이면 narrow(좌우 24 · 소셜은 저작권 아래)
  width: number;
  blocks: FtBlocks;
  topLine?: boolean;
  states?: Record<string, 'hovered' | 'pressed' | 'focused'>;
  skin?: FtSkin;
  frozen?: boolean;
  pins?: Partial<Record<'brand' | 'sitemap' | 'column' | 'divider' | 'policy' | 'text' | 'business' | 'copyright' | 'social' | 'navigation' | 'info' | 'root', ReactNode>>;
  marks?: Partial<Record<'root' | 'navigation' | 'info' | 'brand' | 'sitemap' | 'column' | 'divider', CSSProperties>>;
  socialSlot?: ReactNode;
  // 나쁜 예 — 링크에 밑줄
  underline?: boolean;
  // 사업자 정보 · 연락처를 자리표시 칸(분홍 점선)으로 — false 면 글 그대로(나쁜 예의 가짜 값)
  slots?: boolean;
}) {
  const narrow = width < look.breakpoint;
  const c = (x: IColor, home?: string) => home ?? icv(x, mode);
  const font = skin?.font;
  const T = (t: FtLook['brandName']['text']) => ({ ...typeStyle(t), fontFamily: font ?? t.fontFamily });
  const st = (k: string) => states?.[k];
  const key = (l: FtLink) => l.key ?? l.label;
  const padX = narrow ? look.root.padXNarrow : look.root.padXWide;
  const lineColor = c(look.topLine.color, skin?.line);
  return (
    <footer style={{ width, boxSizing: 'border-box', background: skin ? skin.bg : 'transparent', position: 'relative' }}>
      {topLine && <div aria-hidden style={{ height: look.topLine.h, background: lineColor }} />}
      <div
        style={{
          boxSizing: 'border-box',
          maxWidth: look.root.maxW,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop: look.root.padY,
          paddingBottom: look.root.padY,
          paddingLeft: padX,
          paddingRight: padX,
          display: 'flex',
          flexDirection: 'column',
          gap: look.root.gap,
          position: 'relative',
          ...marks?.root,
        }}
      >
        {(blocks.brand || blocks.columns) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: look.nav.gap, alignItems: 'flex-start', position: 'relative', ...marks?.navigation }}>
            {blocks.brand && (
              <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: look.brand.basis, minWidth: look.brand.minW, display: 'flex', flexDirection: 'column', gap: look.brand.gap, position: 'relative', ...marks?.brand }}>
                <span style={{ ...T(look.brandName.text), color: c(look.brandName.color, skin?.brand) }}>{blocks.brand.name}</span>
                {blocks.brand.description && <span style={{ ...T(look.brandIntro.text), color: c(look.brandIntro.color, skin?.ink3), maxWidth: look.brandIntro.maxW }}>{blocks.brand.description}</span>}
                {pins?.brand}
              </div>
            )}
            {blocks.columns && (
              <nav aria-label={look.sitemap.name} style={{ display: 'flex', flexWrap: 'wrap', gap: look.sitemap.gap, position: 'relative', ...marks?.sitemap }}>
                {blocks.columns.map((col, ci) => {
                  const id = `ft-col-${col.title}`;
                  return (
                    <div key={col.title} style={{ minWidth: look.column.minW, display: 'flex', flexDirection: 'column', gap: look.column.gap, position: 'relative', ...(ci === 0 ? marks?.column : undefined) }}>
                      <span id={frozen ? undefined : id} style={{ ...T(look.columnTitle.text), color: c(look.columnTitle.color, skin?.ink2) }}>
                        {col.title}
                      </span>
                      <ul aria-labelledby={frozen ? undefined : id} style={{ listStyle: 'none', marginTop: 0, marginBottom: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: look.columnLinks.gap }}>
                        {col.links.map((l) => (
                          <li key={key(l)}>
                            <FtLinkView look={look} mode={mode} link={l} size="large" state={st(key(l))} skin={skin} frozen={frozen} underline={underline} />
                          </li>
                        ))}
                      </ul>
                      {ci === 0 && pins?.column}
                    </div>
                  );
                })}
                {pins?.sitemap}
              </nav>
            )}
            {pins?.navigation}
          </div>
        )}
        {blocks.divider && (
          <div aria-hidden style={{ height: look.divider.h, background: lineColor, position: 'relative', ...marks?.divider }}>
            {pins?.divider}
          </div>
        )}
        {(blocks.policy || blocks.text || blocks.business || blocks.contact || blocks.copyright || blocks.social) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: look.info.gap, position: 'relative', ...marks?.info }}>
            {blocks.policy && (
              <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: look.policy.colGap, rowGap: look.policy.rowGap, position: 'relative' }}>
                {blocks.policy.map((l) => (
                  <FtLinkView key={key(l)} look={look} mode={mode} link={l} size="medium" state={st(key(l))} skin={skin} frozen={frozen} underline={underline} />
                ))}
                {pins?.policy}
              </div>
            )}
            {blocks.text?.map((t, i) => (
              <p key={i} style={{ ...T(look.infoText.text), color: c(look.infoText.color, skin?.ink3), marginTop: 0, marginBottom: 0, position: 'relative' }}>
                {t}
                {i === 0 && pins?.text}
              </p>
            ))}
            {[blocks.business, blocks.contact].map(
              (group, gi) =>
                group && (
                  <p key={gi} style={{ ...T(look.infoText.text), color: c(look.infoText.color, skin?.ink3), marginTop: 0, marginBottom: 0, position: 'relative' }}>
                    {group.map((line, li) => (
                      <span key={li} style={{ display: 'block' }}>
                        {line.map((item, ii) => (
                          <span key={ii}>
                            {ii > 0 && look.infoText.sep}
                            {slots ? <Slot>{item}</Slot> : item}
                          </span>
                        ))}
                      </span>
                    ))}
                    {gi === 0 && pins?.business}
                  </p>
                ),
            )}
            {(blocks.copyright || blocks.social) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: narrow ? 'column' : 'row', justifyContent: 'space-between', alignItems: narrow ? 'flex-start' : 'center', gap: look.bottom.gap, position: 'relative' }}>
                {blocks.copyright && (
                  <p style={{ ...T(look.copyright.text), color: c(look.copyright.color, skin?.ink2), marginTop: 0, marginBottom: 0, position: 'relative' }}>
                    {copyrightText(look.copyright.format, blocks.copyright.owner, blocks.copyright.year)}
                    {pins?.copyright}
                  </p>
                )}
                {blocks.social !== undefined && (
                  <span style={{ display: 'inline-flex', gap: look.social.gap, position: 'relative' }}>
                    {socialSlot ??
                      Array.from({ length: blocks.social }, (_, i) => (
                        <Slot key={i} round size={look.social.button.faces.light.enabled.height}>
                          <span style={{ fontSize: 10, lineHeight: '12px', color: c(look.infoText.color) }}>소셜</span>
                        </Slot>
                      ))}
                    {pins?.social}
                  </span>
                )}
              </div>
            )}
            {pins?.info}
          </div>
        )}
        {pins?.root}
      </div>
    </footer>
  );
}

// ── Avatar — 사진 바꾸기 자리 ─────────────────────────────
// 108 아바타 + 아래 늘 보이는 "사진 바꾸기" · "사진 지우기"(사진이 있을 때만). 올리는 중은 아바타 위 딤 + 값 있는 원 24, 두 버튼 막힘.
// 실패는 아래 오류 글(Field 의 오류 줄 모양 — 아이콘 + 글)
export function AvatarEditView({
  avatar,
  edit,
  mode = 'auto',
  name,
  photo,
  src,
  progress,
  error,
  errorStyle,
  onChange,
  onRemove,
  states,
  frozen = false,
}: {
  avatar: AvatarLook;
  edit: AvEditLook;
  mode?: ViewMode;
  name: string;
  photo?: number;
  src?: string;
  progress?: number;
  error?: string;
  errorStyle?: { color: string; text: CSSProperties; icon: number; iconGap: number };
  onChange?: () => void;
  onRemove?: () => void;
  states?: { change?: 'hovered' | 'pressed' | 'focused'; remove?: 'hovered' | 'pressed' | 'focused' };
  frozen?: boolean;
}) {
  const d = avatar.sizes['108'].d;
  const uploading = progress !== undefined;
  const has = photo !== undefined || !!src;
  const st = (k: 'change' | 'remove') => (uploading ? 'disabled' : (states?.[k] ?? (frozen ? 'enabled' : 'live')));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT }}>
      <span style={{ position: 'relative', display: 'inline-flex', width: d, height: d }}>
        {src ? (
          <span role="img" aria-label={name} style={{ position: 'relative', display: 'inline-flex', width: d, height: d, borderRadius: 9999, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 9999, boxShadow: `inset 0 0 0 ${avatar.border.width}px ${icv(avatar.border.color, mode)}` }} />
          </span>
        ) : (
          <AvatarView look={avatar} mode={mode} size="108" name={name} photo={photo} decorative={false} />
        )}
        {uploading && (
          <span style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 9999, background: icv(edit.dim, mode), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProgressCircleView look={edit.circle} mode={mode} size="24" tone="staticWhite" value={Math.round((progress ?? 0) * 100)} label={edit.progressName} />
          </span>
        )}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: edit.gap, marginTop: edit.marginTop }}>
        <ButtonView look={edit.change.look} mode={mode} label={edit.change.label} state={st('change')} onClick={onChange} />
        {has && <ButtonView look={edit.remove.look} mode={mode} label={edit.remove.label} state={st('remove')} onClick={onRemove} />}
      </div>
      {error && errorStyle && (
        <span role="alert" style={{ display: 'flex', marginTop: edit.gap, ...errorStyle.text, color: errorStyle.color }}>
          <CircleAlert aria-hidden size={errorStyle.icon} strokeWidth={2} style={{ flexShrink: 0, marginRight: errorStyle.iconGap, marginTop: `calc((${String(errorStyle.text.lineHeight)} - ${errorStyle.icon}px) / 2)` }} />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
