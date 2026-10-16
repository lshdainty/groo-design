'use client';
// 스펙대로 그린 Text Field — TfLook(field · input · textarea.yaml 을 푼 값)만 받아 그린다.
// state 를 주면 그 상태로 멈춘 그림(글은 span — 캐럿까지 그린다), 안 주면 실제 입력칸(쓰고 · 지우고 · 포커스할 수 있다).
// 치수 · 색은 CSS 변수로 싣고 global.css 의 .ptf 가 그린다 — 반응형(1280 에서 large → medium)과 포커스(:has(:focus))를 CSS 가 맡는다.
// 색은 사이트 모드를 따르면(auto) --p-<토큰> 변수, 모드를 정하면 그 모드의 값이다.
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Calendar, CircleAlert, CircleX, Hash, Info, Link2, Lock, Mail, Search, Smartphone, Tag, User, type LucideIcon } from 'lucide-react';
import type { TfColor, TfFieldLook, TfIcon, TfInputLook, TfInputSize, TfSizeProp, TfState, TfTextareaLook, TfVariant } from './text-field-shared';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';

const ICONS: Record<TfIcon, LucideIcon> = { search: Search, calendar: Calendar, user: User, mail: Mail, lock: Lock, link: Link2, hash: Hash, tag: Tag, info: Info, smartphone: Smartphone };

export type ViewMode = 'light' | 'dark' | 'auto';
export const cv = (c: TfColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('ko', { granularity: 'grapheme' }) : null;
const graphemes = (v: string) => (segmenter ? Array.from(segmenter.segment(v), (s) => s.segment) : Array.from(v));
export const countGraphemes = (v: string) => graphemes(v).length;
const sliceGraphemes = (v: string, max: number) => {
  const g = graphemes(v);
  return g.length > max ? g.slice(0, max).join('') : v;
};
// 금액 — 숫자만 남기고 천 단위 쉼표
const formatAmount = (v: string) => {
  const digits = v.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits).toLocaleString('ko-KR') : '';
};

// 크기 변수 — large(-l) · medium(-m). 반응형이면 둘이 다르고, 아니면 같다(CSS 가 1280 에서 -m 으로 바꾼다)
function sizeVars(prefix: string, l: Record<string, string | number>, m: Record<string, string | number>) {
  const out: Record<string, string> = {};
  for (const k of Object.keys(l)) {
    const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);
    out[`--${prefix}-${k}-l`] = px(l[k]);
    out[`--${prefix}-${k}-m`] = px(m[k]);
  }
  return out;
}
const inputSizeVars = (s: TfInputSize) => ({ h: s.minHeight, r: s.radius, px: s.padX, py: s.padY, gap: s.gap, fs: s.text.fontSize, lh: s.text.lineHeight, icon: s.icon, clear: s.clear });

function Caret() {
  return <span aria-hidden className="ptf-caret" />;
}

// ── 한 줄 입력칸 ──────────────────────────────────────────
export type TfInputViewProps = {
  look: TfInputLook;
  variant?: TfVariant;
  size?: TfSizeProp;
  mode?: ViewMode;
  // 멈춘 그림 — 없으면 실제 입력칸
  state?: TfState | 'invalid-focused';
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  prefixIcon?: TfIcon;
  suffixIcon?: TfIcon;
  clearable?: boolean;
  // 실제 입력칸 — 금액이면 쓰는 동안 쉼표를 넣고 숫자 키보드
  format?: 'amount';
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email';
  maxGraphemes?: number;
  onCount?: (n: number) => void;
  onValue?: (v: string) => void;
  id?: string;
  ariaLabel?: string;
  describedBy?: string;
  required?: boolean;
  width?: number | string;
  // 칸 안의 글을 짙게 · 옅게 강조하는 그림(분홍 칠)
  zone?: CSSProperties;
  // 지우기 버튼의 누르는 영역을 칠해 보이기(그림 전용) — 칠 · 선 색
  hitMark?: { fill: string; line: string };
  // 실제 입력칸에 더 거는 속성 · 참조 — 콤보박스(Searchable List 의 role · aria-activedescendant · 화살표 키)
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputRef?: Ref<HTMLInputElement>;
  // 지우기 버튼을 누른 뒤(값을 비우고 입력칸에 초점)
  onClear?: () => void;
};

export function TfInputView({
  look,
  variant = 'outline',
  size = 'responsive',
  mode = 'auto',
  state,
  invalid: invalidProp = false,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  value: valueProp,
  defaultValue = '',
  placeholder,
  prefix,
  suffix,
  prefixIcon,
  suffixIcon,
  clearable = false,
  format,
  inputMode,
  maxGraphemes,
  onCount,
  onValue,
  id,
  ariaLabel,
  describedBy,
  required,
  width,
  zone,
  hitMark,
  inputProps,
  inputRef: inputRefProp,
  onClear,
}: TfInputViewProps) {
  const live = state === undefined;
  const invalid = invalidProp || state === 'invalid' || state === 'invalid-focused';
  const disabled = disabledProp || state === 'disabled';
  const readOnly = readOnlyProp || state === 'readonly';
  const focusedFrozen = state === 'focused' || state === 'invalid-focused';
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const inputRef = useRef<HTMLInputElement>(null);
  const composing = useRef(false);

  useIsoLayoutEffect(() => {
    onCount?.(countGraphemes(value));
  }, [value, onCount]);

  const L = look.sizes[variant][size === 'medium' ? 'medium' : 'large'];
  const M = look.sizes[variant][size === 'large' ? 'large' : 'medium'];
  const c = look.color;
  const bg = variant === 'outline' && (disabled || readOnly) ? cv(c.bgDisabled, mode) : 'transparent';
  const valueColor = disabled ? cv(c.disabled, mode) : variant === 'underline' && readOnly ? cv(c.underlineReadonly, mode) : cv(c.value, mode);
  const phColor = disabled ? cv(c.placeholderDisabled, mode) : variant === 'underline' && readOnly ? cv(c.underlineReadonly, mode) : cv(c.placeholder, mode);
  const vars = {
    ...sizeVars('ptf', inputSizeVars(L), inputSizeVars(M)),
    '--ptf-bd': cv(c.border, mode),
    '--ptf-focus': cv(c.focus, mode),
    '--ptf-invalid': cv(c.invalid, mode),
    '--ptf-bg': bg,
    '--ptf-value': valueColor,
    '--ptf-ph': phColor,
    '--ptf-affix': disabled ? cv(c.disabled, mode) : cv(c.affix, mode),
    '--ptf-icon-c': disabled ? cv(c.disabled, mode) : cv(c.icon, mode),
    '--ptf-clear-c': cv(c.clear, mode),
    '--ptf-caret-c': cv(c.caret, mode),
    '--ptf-hit': `${look.clearHit}px`,
    ...(hitMark ? { '--ptf-hit-fill': hitMark.fill, '--ptf-hit-line': `1px dashed ${hitMark.line}` } : {}),
    '--ptf-base': `${look.stroke.base}px`,
    '--ptf-active': `${look.stroke.active}px`,
    '--ptf-dur': look.motion.duration,
    '--ptf-ease': look.motion.easing,
  } as CSSProperties;

  const set = (raw: string) => {
    let v = format === 'amount' ? formatAmount(raw) : raw;
    if (maxGraphemes != null && !composing.current) v = sliceGraphemes(v, maxGraphemes);
    if (valueProp === undefined) setInner(v);
    onValue?.(v);
  };
  const showClear = clearable && value !== '' && !disabled && !readOnly;
  const PI = prefixIcon ? ICONS[prefixIcon] : null;
  const SI = suffixIcon ? ICONS[suffixIcon] : null;

  return (
    <div
      className="ptf ptf-box"
      data-variant={variant}
      data-live={live || undefined}
      data-state={focusedFrozen ? 'focused' : undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      style={{ ...vars, width: width ?? '100%' }}
      onMouseDown={(e) => {
        if (!live || disabled) return;
        const t = e.target as HTMLElement;
        if (t.closest('input, button')) return;
        e.preventDefault();
        inputRef.current?.focus();
      }}
    >
      {PI && (
        <span className="ptf-affix ptf-icon" aria-hidden>
          <PI strokeWidth={2} />
        </span>
      )}
      {prefix && <span className="ptf-affix ptf-text">{prefix}</span>}
      {live ? (
        <input
          {...inputProps}
          ref={(el) => {
            inputRef.current = el;
            if (typeof inputRefProp === 'function') inputRefProp(el);
            else if (inputRefProp) (inputRefProp as { current: HTMLInputElement | null }).current = el;
          }}
          id={id}
          className="ptf-input"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          inputMode={format === 'amount' ? 'numeric' : inputMode}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          onChange={(e) => set(e.target.value)}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={(e) => {
            composing.current = false;
            set((e.target as HTMLInputElement).value);
          }}
        />
      ) : (
        <span className="ptf-input ptf-frozen" style={zone}>
          {!value && focusedFrozen && <Caret />}
          {value ? <span>{value}</span> : placeholder ? <span style={{ color: 'var(--ptf-ph)' }}>{placeholder}</span> : null}
          {value && focusedFrozen && <Caret />}
        </span>
      )}
      {suffix && <span className="ptf-affix ptf-text">{suffix}</span>}
      {SI && (
        <span className="ptf-affix ptf-icon" aria-hidden>
          <SI strokeWidth={2} />
        </span>
      )}
      {showClear &&
        (live ? (
          <button
            type="button"
            className="ptf-affix ptf-clear"
            aria-label="지우기"
            tabIndex={-1}
            onClick={() => {
              set('');
              inputRef.current?.focus();
              onClear?.();
            }}
          >
            <CircleX strokeWidth={2} aria-hidden />
          </button>
        ) : (
          <span className="ptf-affix ptf-clear" aria-hidden>
            <CircleX strokeWidth={2} />
          </span>
        ))}
    </div>
  );
}

// ── 여러 줄 입력칸 ────────────────────────────────────────
export type TfTextareaViewProps = {
  look: TfTextareaLook;
  input: TfInputLook;
  size?: TfSizeProp;
  mode?: ViewMode;
  state?: TfState;
  autoSize?: boolean;
  // 자동 높이의 최대(px) · 고정 높이(px)
  maxHeight?: number;
  height?: number;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  maxGraphemes?: number;
  onCount?: (n: number) => void;
  onValue?: (v: string) => void;
  id?: string;
  ariaLabel?: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  width?: number | string;
};

export function TfTextareaView({
  look,
  input,
  size = 'responsive',
  mode = 'auto',
  state,
  autoSize = true,
  maxHeight,
  height,
  value: valueProp,
  defaultValue = '',
  placeholder,
  maxGraphemes,
  onCount,
  onValue,
  id,
  ariaLabel,
  describedBy,
  invalid: invalidProp = false,
  disabled: disabledProp = false,
  readOnly: readOnlyProp = false,
  width,
}: TfTextareaViewProps) {
  const live = state === undefined;
  const invalid = invalidProp || state === 'invalid';
  const disabled = disabledProp || state === 'disabled';
  const readOnly = readOnlyProp || state === 'readonly';
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const ref = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);
  const L = look.sizes[size === 'medium' ? 'medium' : 'large'];
  const M = look.sizes[size === 'large' ? 'large' : 'medium'];
  const c = input.color;

  useIsoLayoutEffect(() => {
    onCount?.(countGraphemes(value));
  }, [value, onCount]);

  // 자동 높이 — 내용 높이에 맞추고 최대 높이에서 멈춘다(그림 폭이 바뀌어도 다시 잰다).
  // 끄면 자랄 때 넣은 높이 · 넘침을 걷어 고정 높이(--ptt-min)로 돌아간다(textarea.md 2026-10-08)
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!autoSize) {
      el.style.removeProperty('height');
      el.style.removeProperty('overflow-y');
      return;
    }
    const fit = () => {
      el.style.height = 'auto';
      const full = el.scrollHeight;
      const limit = maxHeight ?? Infinity;
      el.style.height = `${Math.min(full, limit)}px`;
      el.style.overflowY = full > limit ? 'auto' : 'hidden';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, autoSize, maxHeight]);

  const pick = (s: typeof L) => ({ r: s.radius, px: s.padX, py: s.padY, fs: s.text.fontSize, lh: s.text.lineHeight, min: autoSize ? s.minAuto : s.minFixed });
  const vars = {
    ...sizeVars('ptt', pick(L), pick(M)),
    '--ptf-bd': cv(c.border, mode),
    '--ptf-focus': cv(c.focus, mode),
    '--ptf-invalid': cv(c.invalid, mode),
    '--ptf-bg': disabled || readOnly ? cv(c.bgDisabled, mode) : 'transparent',
    '--ptf-value': disabled ? cv(c.disabled, mode) : cv(c.value, mode),
    '--ptf-ph': disabled ? cv(c.placeholderDisabled, mode) : cv(c.placeholder, mode),
    '--ptf-caret-c': cv(c.caret, mode),
    '--ptf-base': `${input.stroke.base}px`,
    '--ptf-active': `${input.stroke.active}px`,
    '--ptf-dur': input.motion.duration,
    '--ptf-ease': input.motion.easing,
  } as CSSProperties;

  const set = (raw: string) => {
    const v = maxGraphemes != null && !composing.current ? sliceGraphemes(raw, maxGraphemes) : raw;
    if (valueProp === undefined) setInner(v);
    onValue?.(v);
  };

  return (
    <div
      className="ptt ptf-box ptt-box"
      data-variant="outline"
      data-live={live || undefined}
      data-state={state === 'focused' ? 'focused' : undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      style={{ ...vars, width: width ?? '100%' }}
    >
      {live ? (
        <textarea
          ref={ref}
          id={id}
          className="ptt-value"
          rows={autoSize ? 3 : 2}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          style={{ height: autoSize ? undefined : height, maxHeight: autoSize ? maxHeight : undefined, overflowY: autoSize ? 'hidden' : 'auto' }}
          onChange={(e) => set(e.target.value)}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={(e) => {
            composing.current = false;
            set((e.target as HTMLTextAreaElement).value);
          }}
        />
      ) : (
        <div className="ptt-value ptf-frozen-area" style={{ height: autoSize ? undefined : height, maxHeight: autoSize ? maxHeight : undefined, overflow: 'hidden' }}>
          {!value && state === 'focused' && <Caret />}
          {value ? value : placeholder ? <span style={{ color: 'var(--ptf-ph)' }}>{placeholder}</span> : null}
          {value && state === 'focused' && <Caret />}
        </div>
      )}
    </div>
  );
}

// ── Field — 머리 · 입력 · 꼬리 ─────────────────────────────
export type TfFieldControl = { id: string; labelId: string; describedBy?: string; invalid: boolean; required: boolean; onCount: (n: number) => void };

export type TfFieldViewProps = {
  look: TfFieldLook;
  mode?: ViewMode;
  label?: ReactNode;
  labelWeight?: 'medium' | 'bold';
  indicator?: 'required' | 'optional';
  headerAction?: ReactNode;
  description?: ReactNode;
  descriptionIcon?: TfIcon;
  errorMessage?: ReactNode;
  invalid?: boolean;
  // 글자 수 — max 가 있으면 꼬리 오른쪽에. count 를 주면 그 수로 멈춘 그림, 아니면 입력칸이 알려 준다
  max?: number;
  count?: number;
  // 입력 — 요소를 주거나, 실제 입력칸이면 id · 설명 · 글자 수를 받는 함수
  children: ReactNode | ((ctl: TfFieldControl) => ReactNode);
  // 묶음(Checkbox · Radio) — 라벨이 <label for> 대신 <span id> 이고 묶음이 aria-labelledby 로 가리킨다(field.tsx 와 같다)
  group?: boolean;
  width?: number | string;
  // 부위마다 분홍 칠(Anatomy)
  marks?: Partial<Record<'header' | 'input' | 'footer', CSSProperties>>;
};

export function TfFieldView({ look, mode = 'auto', label, labelWeight = 'medium', indicator, headerAction, description, descriptionIcon, errorMessage, invalid = false, max, count: countProp, children, width, marks, group = false }: TfFieldViewProps) {
  const auto = useId();
  const id = `${auto}control`;
  const labelId = `${auto}label`;
  const [counted, setCounted] = useState(0);
  const count = countProp ?? counted;
  const showError = invalid && !!errorMessage;
  const showDesc = !showError && !!description;
  const showCount = max != null;
  const descId = `${auto}desc`;
  const countId = `${auto}count`;
  const describedBy = [showError || showDesc ? descId : null, showCount ? countId : null].filter(Boolean).join(' ') || undefined;
  const f = look;
  const DI = descriptionIcon ? ICONS[descriptionIcon] : null;
  const type = (t: TfFieldLook['label']['text'], weight?: number | string): CSSProperties => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: weight ?? t.fontWeight });
  const iconTop = (lh: string, size: number) => `calc((${lh} - ${size}px) / 2)`;
  const control = typeof children === 'function' ? children({ id, labelId, describedBy, invalid, required: indicator === 'required', onCount: setCounted }) : children;
  const LabelTag = group ? 'span' : 'label';
  const labelLink = group ? { id: labelId } : { htmlFor: typeof children === 'function' ? id : undefined };

  return (
    <div className="flex min-w-0 flex-col" style={{ gap: f.gap, width: width ?? '100%' }}>
      {(label || headerAction) && (
        <div className="flex items-center justify-between" style={{ gap: f.header.gap, paddingInline: f.header.padX, ...marks?.header }}>
          {label && (
            <LabelTag {...labelLink} className="min-w-0" style={{ ...type(f.label.text, f.label.weight[labelWeight]), color: cv(f.label.color, mode) }}>
              {label}
              {indicator === 'required' && (
                <span
                  aria-hidden
                  style={{ display: 'inline-block', verticalAlign: 'top', width: f.required.size, height: f.required.size, marginTop: f.required.marginTop, marginLeft: f.required.marginLeft, borderRadius: 9999, background: cv(f.required.color, mode) }}
                />
              )}
              {indicator === 'optional' && (
                <span style={{ ...type(f.optional.text), lineHeight: f.optional.lineHeight, verticalAlign: 'bottom', paddingLeft: f.optional.padLeft, color: cv(f.optional.color, mode) }}>선택</span>
              )}
            </LabelTag>
          )}
          {headerAction && (
            <span className="ml-auto flex shrink-0 items-center" style={{ marginBlock: f.actionMarginY }}>
              {headerAction}
            </span>
          )}
        </div>
      )}
      <div style={marks?.input}>{control}</div>
      {(showError || showDesc || showCount) && (
        <div className="flex items-start" style={{ gap: f.footer.gap, paddingInline: f.footer.padX, ...marks?.footer }}>
          {showError && (
            <span id={descId} className="flex min-w-0" style={{ ...type(f.error.text), color: cv(f.error.color, mode) }}>
              <CircleAlert aria-hidden size={f.error.icon} strokeWidth={2} style={{ flexShrink: 0, marginRight: f.error.iconGap, marginTop: iconTop(f.error.text.lineHeight, f.error.icon), color: cv(f.error.iconColor, mode) }} />
              <span className="min-w-0">{errorMessage}</span>
            </span>
          )}
          {showDesc && (
            <span id={descId} className="flex min-w-0" style={{ ...type(f.description.text), color: cv(f.description.color, mode) }}>
              {DI && <DI aria-hidden size={f.description.icon} strokeWidth={2} style={{ flexShrink: 0, marginRight: f.description.iconGap, marginTop: iconTop(f.description.text.lineHeight, f.description.icon), color: cv(f.description.iconColor, mode) }} />}
              <span className="min-w-0">{description}</span>
            </span>
          )}
          {showCount && (
            <span id={countId} className="ml-auto shrink-0" style={{ ...type(f.count.text), fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: cv(invalid ? f.count.invalid : count === 0 ? f.count.empty : f.count.color, mode) }}>{count}</span>
              <span style={{ color: cv(invalid ? f.count.invalid : f.count.max, mode) }}>/{max}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// 실제로 쓰는 Field + 입력칸 — 글자 수 · 설명이 이어진다
export function TfLiveField({
  field,
  input,
  mode = 'auto',
  inputProps,
  ...fieldProps
}: Omit<TfFieldViewProps, 'look' | 'children' | 'count'> & { field: TfFieldLook; input: TfInputLook; inputProps?: Omit<TfInputViewProps, 'look' | 'mode'> }) {
  return (
    <TfFieldView look={field} mode={mode} {...fieldProps}>
      {(ctl) => <TfInputView look={input} mode={mode} id={ctl.id} describedBy={ctl.describedBy} invalid={ctl.invalid} required={ctl.required} onCount={ctl.onCount} maxGraphemes={fieldProps.max} {...inputProps} />}
    </TfFieldView>
  );
}

export function TfLiveTextareaField({
  field,
  textarea,
  input,
  mode = 'auto',
  textareaProps,
  ...fieldProps
}: Omit<TfFieldViewProps, 'look' | 'children' | 'count'> & { field: TfFieldLook; textarea: TfTextareaLook; input: TfInputLook; textareaProps?: Omit<TfTextareaViewProps, 'look' | 'input' | 'mode'> }) {
  return (
    <TfFieldView look={field} mode={mode} {...fieldProps}>
      {(ctl) => <TfTextareaView look={textarea} input={input} mode={mode} id={ctl.id} describedBy={ctl.describedBy} invalid={ctl.invalid} onCount={ctl.onCount} maxGraphemes={fieldProps.max} {...textareaProps} />}
    </TfFieldView>
  );
}

// 제출 시 검증 — 버튼은 켜 두고, 누르면 비어 있는 칸마다 오류를 보이고 첫 오류 칸으로 포커스를 옮긴다
export type TfFormSpec = { name: string; label: string; placeholder?: string; multiline?: boolean; max?: number; error: string; indicator?: 'required' | 'optional'; optional?: boolean };
export function TfSubmitDemo({ field, input, textarea, mode = 'auto', fields, submit, cta }: { field: TfFieldLook; input: TfInputLook; textarea: TfTextareaLook; mode?: ViewMode; fields: TfFormSpec[]; submit: string; cta: ButtonLook }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const onSubmit = () => {
    const next = Object.fromEntries(fields.map((f) => [f.name, !f.optional && values[f.name].trim() === '']));
    setErrors(next);
    const first = fields.find((f) => next[f.name]);
    setDone(!first);
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[data-field="${first.name}"] input, [data-field="${first.name}"] textarea`)?.focus());
  };
  const set = (name: string, v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    // 고치면 그 칸의 오류를 걷는다(다시 누를 때 다시 검증)
    if (v.trim() !== '') setErrors((e) => ({ ...e, [name]: false }));
    setDone(false);
  };
  return (
    <div ref={formRef} className="flex flex-col" style={{ gap: field.form.gapY }}>
      {fields.map((f) => (
        <div key={f.name} data-field={f.name}>
          {f.multiline ? (
            <TfLiveTextareaField
              field={field}
              textarea={textarea}
              input={input}
              mode={mode}
              label={f.label}
              indicator={f.indicator}
              max={f.max}
              invalid={!!errors[f.name]}
              errorMessage={f.error}
              textareaProps={{ value: values[f.name], onValue: (v) => set(f.name, v), placeholder: f.placeholder, size: 'responsive' }}
            />
          ) : (
            <TfLiveField
              field={field}
              input={input}
              mode={mode}
              label={f.label}
              indicator={f.indicator}
              max={f.max}
              invalid={!!errors[f.name]}
              errorMessage={f.error}
              inputProps={{ value: values[f.name], onValue: (v) => set(f.name, v), placeholder: f.placeholder, size: 'responsive' }}
            />
          )}
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <ButtonView look={cta} mode={mode} label={submit} fill onClick={onSubmit} />
        <span role="status" className="min-h-5 text-center text-[13px]" style={{ color: cv(field.description.color, mode) }}>
          {done ? `${submit}했어요` : ''}
        </span>
      </div>
    </div>
  );
}
