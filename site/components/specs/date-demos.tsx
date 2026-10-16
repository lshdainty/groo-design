'use client';
// Date Picker · Time Picker · Wheel Picker 의 실제로 써 보는 칸 · 플레이그라운드.
// 칸은 Input Button(select-view) · Field(text-field-view), 여는 자리는 1280 미만 아래 시트 · 이상 칸 아래 팝오버(overlay-live — 이 창의 폭으로),
// 달력 · 휠은 date-view · wheel-view 다. 고르는 동안 칸 값은 그대로이고 "완료" 를 누를 때 들어간다(input-button.md) — 바깥 · 끌어내리기 · Esc 는 버린다.
// 플레이그라운드는 그림 속 폰 · 데스크톱 창 안에 열어 둔 채로 시작한다(칸을 누르면 다시 연다).
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { BatteryFull, ChevronLeft, Signal, Wifi } from 'lucide-react';
import { DatePickerView } from './date-view';
import {
  TODAY,
  formatTime,
  formatValue,
  isComplete,
  monthOf,
  monthValue,
  roundToStep,
  type DateKit,
  type DateValue,
  type Day,
  type DpSelection,
  type Month,
  type PresetName,
  type Time,
  type ViewMode,
  type WpSize,
} from './date-shared';
import { ModalLayer, PopoverLayer, useMinWidth } from './overlay-live';
import { ocv, type OvKit, type OvTone } from './overlay-shared';
import { EndButtons, PopoverSurface, SheetButtons, SheetSurface } from './overlay-view';
import { BRANDS, MODES, Seg } from './select-playground';
import type { SelIcon, SelectLook } from './select-shared';
import { InputButtonView, labelFocusOnly } from './select-view';
import type { TfFieldLook } from './text-field-shared';
import { TfFieldView } from './text-field-view';
import { TimePickerView, WheelView, monthYearColumns } from './wheel-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const SAFE = 'env(safe-area-inset-bottom, 0px)';
const tone = (kit: OvKit, name: OvTone, mode: ViewMode) => ocv(kit.ov.tone[name], mode);
type Brand = 'desk' | 'hr';
// 열 때 — 칸이 비었으면 지금 시각을 분 간격에 맞춰 반올림한 자리를 짚는다(time-picker.md)
const nowRounded = (step: number) => {
  const d = new Date();
  return roundToStep({ hour: d.getHours(), minute: d.getMinutes() }, step);
};

// ── 여는 자리(페이지 전체) — 1280 미만 시트 · 이상 칸 아래 팝오버 ─────────
function PickerLayer({
  ov,
  mode,
  open,
  wide,
  onClose,
  anchor,
  title,
  footer,
  tall = false,
  popoverWidth,
  focus = '[data-autofocus]',
  children,
}: {
  ov: OvKit;
  mode: ViewMode;
  open: boolean;
  wide: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
  title: string;
  footer: { sheet: ReactNode; popover: ReactNode };
  // 이어지는 달 — 시트를 화면 높이의 90% 로 연다(달력이 남은 높이를 채운다). 안에서 스크롤하므로 끌어 닫기는 끈다
  tall?: boolean;
  popoverWidth?: number;
  // 열린 뒤 초점 — 달력은 고른 날(없으면 오늘), 시각 · 월 휠은 시 · 연 칼럼
  focus?: string;
  children: ReactNode;
}) {
  const box = anchor?.closest('.psel-box') as HTMLElement | null;
  if (wide)
    return (
      <PopoverLayer open={open} anchor={box} look={ov.ov.popover} mode={mode} align="start" ariaLabel={title} focusSelector={focus} onRequestClose={onClose}>
        {({ ref, rootProps, style, maxHeight, avail }) => (
          <PopoverSurface ref={ref} rootProps={rootProps} style={popoverWidth ? { ...style, maxWidth: popoverWidth } : style} maxHeight={maxHeight} avail={popoverWidth ? undefined : avail} look={ov.ov.popover} mode={mode} footer={footer.popover}>
            {children}
          </PopoverSurface>
        )}
      </PopoverLayer>
    );
  return (
    <ModalLayer open={open} kind="sheet" look={ov.ov} mode={mode} outside="close" drag={!tall} onRequestClose={onClose} labelledBy={undefined} returnFocus={() => anchor} focusSelector={focus}>
      {({ ref, rootProps, style, maxHeight }) => (
        <SheetSurface
          ref={ref}
          rootProps={{ ...rootProps, 'aria-label': title }}
          style={tall ? { ...style, height: maxHeight } : style}
          maxHeight={maxHeight}
          look={ov.ov.sheet}
          mode={mode}
          title={title}
          onClose={onClose}
          footer={footer.sheet}
          safe={SAFE}
          bodyStyle={tall ? { display: 'flex', flexDirection: 'column' } : undefined}
        >
          {children}
        </SheetSurface>
      )}
    </ModalLayer>
  );
}

type FieldBase = { ov: OvKit; sel: SelectLook; field: TfFieldLook; mode?: ViewMode; label: string; placeholder: string; description?: string; size?: 'responsive' | 'large' | 'medium' };

// ── 날짜 칸 ───────────────────────────────────────────────
export function DateFieldDemo({
  kit,
  ov,
  sel,
  field,
  mode = 'auto',
  label,
  placeholder,
  description,
  size = 'responsive',
  selection = 'single',
  initial,
  presets,
  min,
  max,
  readOnlyStart,
  today = TODAY,
  onValue,
}: FieldBase & { kit: DateKit; selection?: DpSelection; initial?: DateValue; presets?: PresetName[]; min?: Day; max?: Day; readOnlyStart?: boolean; today?: Day; onValue?: (v: DateValue) => void }) {
  const wide = useMinWidth(ov.ov.breakpoint);
  const [value, setValue] = useState<DateValue>(initial);
  const [draft, setDraft] = useState<DateValue>(undefined);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement | null>(null);
  const text = formatValue(selection, value, today);
  const range = selection === 'range';
  const visible = range ? (wide ? 'twoMonths' : 'continuous') : 'month';
  const ready = isComplete(selection, draft);
  // 닫힌 뒤 초점은 칸으로(input-button.md) — 시트는 ModalLayer 가 돌려주고, 팝오버는 여기서
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const commit = () => {
    if (!ready) return;
    setValue(draft);
    onValue?.(draft);
    close();
  };
  const reset = () => setDraft(selection === 'multiple' ? [] : undefined);
  const items = (b: OvKit['sheet']) => [...(range ? [{ label: '초기화', look: b.weak, onClick: reset }] : []), { label: '완료', look: b.solid, onClick: commit, state: ready ? undefined : ('disabled' as const) }];
  return (
    <div onClick={labelFocusOnly}>
      <TfFieldView look={field} mode={mode} label={label} description={description}>
        {(ctl) => (
          <InputButtonView
            look={sel}
            mode={mode}
            size={size}
            id={ctl.id}
            describedBy={ctl.describedBy}
            ariaLabel={`${label}, ${text ?? placeholder}`}
            buttonRef={btn}
            value={text}
            placeholder={placeholder}
            suffixIcon="calendar"
            haspopup="dialog"
            expanded={open}
            onClick={() => {
              setDraft(value);
              setOpen(true);
            }}
          />
        )}
      </TfFieldView>
      <PickerLayer
        ov={ov}
        mode={mode}
        open={open}
        wide={wide}
        onClose={close}
        anchor={btn.current}
        title={placeholder}
        tall={visible === 'continuous'}
        popoverWidth={visible === 'twoMonths' ? kit.date.twoMonths.width + ov.ov.popover.body.padX * 2 : undefined}
        footer={{ sheet: <SheetButtons mode={mode} items={items(ov.sheet)} />, popover: <EndButtons mode={mode} items={items(ov.dialog)} /> }}
      >
        <DatePickerView
          kit={kit}
          mode={mode}
          live
          autoFocus
          selection={selection}
          visibleRange={visible}
          value={draft}
          onValue={setDraft}
          today={today}
          min={min}
          max={max}
          readOnlyStart={readOnlyStart}
          presets={range ? presets : undefined}
          presetLayout={wide ? 'wrap' : 'scroll'}
          width={wide ? undefined : '100%'}
          fill={visible === 'continuous'}
          ariaLabel={label}
        />
      </PickerLayer>
    </div>
  );
}

// ── 시각 칸 ───────────────────────────────────────────────
// bare — Field 없이(날짜 칸과 짝일 때 — 라벨은 날짜 칸 위 하나, 이 칸은 label 을 보조 기술 이름으로만 쓴다)
export function TimeFieldDemo({ kit, ov, sel, field, mode = 'auto', label, placeholder, description, size = 'responsive', step = kit.time.defaultStep, initial, bare = false }: FieldBase & { kit: DateKit; step?: number; initial?: Time; bare?: boolean }) {
  const wide = useMinWidth(ov.ov.breakpoint);
  const [value, setValue] = useState<Time | undefined>(initial);
  const [draft, setDraft] = useState<Time>(initial ?? { hour: 9, minute: 15 });
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement | null>(null);
  const text = value ? formatTime(value) : undefined;
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const commit = () => {
    setValue(draft);
    close();
  };
  const button = (ctl?: { id: string; describedBy?: string }) => (
    <InputButtonView
      look={sel}
      mode={mode}
      size={size}
      id={ctl?.id}
      describedBy={ctl?.describedBy}
      ariaLabel={`${label}, ${text ?? placeholder}`}
      buttonRef={btn}
      value={text}
      placeholder={placeholder}
      suffixIcon="clock"
      haspopup="dialog"
      expanded={open}
      onClick={() => {
        setDraft(value ?? nowRounded(step));
        setOpen(true);
      }}
    />
  );
  return (
    <div onClick={labelFocusOnly}>
      {bare ? (
        button()
      ) : (
        <TfFieldView look={field} mode={mode} label={label} description={description}>
          {(ctl) => button(ctl)}
        </TfFieldView>
      )}
      <PickerLayer
        ov={ov}
        mode={mode}
        open={open}
        wide={wide}
        onClose={close}
        anchor={btn.current}
        title={placeholder}
        focus='[data-wheel-column="hour"]'
        footer={{ sheet: <SheetButtons mode={mode} items={[{ label: '완료', look: ov.sheet.solid, onClick: commit }]} />, popover: <EndButtons mode={mode} items={[{ label: '완료', look: ov.dialog.solid, onClick: commit }]} /> }}
      >
        <TimePickerView wheel={kit.wheel} time={kit.time} mode={mode} live value={draft} onValue={setDraft} step={step} ariaLabel={label} />
      </PickerLayer>
    </div>
  );
}

// ── 달만 고르기 ───────────────────────────────────────────
export function MonthFieldDemo({ kit, ov, sel, field, mode = 'auto', label, placeholder, description, size = 'responsive', initial, today = TODAY }: FieldBase & { kit: DateKit; initial?: Month; today?: Day }) {
  const wide = useMinWidth(ov.ov.breakpoint);
  const [value, setValue] = useState<Month | undefined>(initial);
  const [draft, setDraft] = useState<Month>(initial ?? monthOf(today));
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement | null>(null);
  const text = value ? monthValue(value) : undefined;
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const commit = () => {
    setValue(draft);
    close();
  };
  return (
    <div onClick={labelFocusOnly}>
      <TfFieldView look={field} mode={mode} label={label} description={description}>
        {(ctl) => (
          <InputButtonView
            look={sel}
            mode={mode}
            size={size}
            id={ctl.id}
            describedBy={ctl.describedBy}
            ariaLabel={`${label}, ${text ?? placeholder}`}
            buttonRef={btn}
            value={text}
            placeholder={placeholder}
            suffixIcon="calendar"
            haspopup="dialog"
            expanded={open}
            onClick={() => {
              setDraft(value ?? monthOf(today));
              setOpen(true);
            }}
          />
        )}
      </TfFieldView>
      <PickerLayer
        ov={ov}
        mode={mode}
        open={open}
        wide={wide}
        onClose={close}
        anchor={btn.current}
        title={placeholder}
        focus='[data-wheel-column="year"]'
        footer={{ sheet: <SheetButtons mode={mode} items={[{ label: '완료', look: ov.sheet.solid, onClick: commit }]} />, popover: <EndButtons mode={mode} items={[{ label: '완료', look: ov.dialog.solid, onClick: commit }]} /> }}
      >
        <WheelView
          look={kit.wheel}
          mode={mode}
          live
          ariaLabel={label}
          columns={monthYearColumns({ y: draft.y, m: draft.m, from: today.y - 100, to: today.y + 100, onYear: (y) => setDraft((d) => ({ ...d, y })), onMonth: (m) => setDraft((d) => ({ ...d, m })), widths: { year: kit.date.wheel.columns.year.width, month: kit.date.wheel.columns.month.width } })}
        />
      </PickerLayer>
    </div>
  );
}

// 미리보기 판 — 회색 판 위 흰 칸(코드 절의 Live 와 같은 모양)
export function DateLive({ ov, children, w = 360, mode = 'auto', note }: { ov: OvKit; children: ReactNode; w?: number; mode?: ViewMode; note?: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto flex w-full flex-col rounded-xl p-5" style={{ maxWidth: w, background: tone(ov, 'bg-layer-default', mode), gap: 16, fontFamily: FONT }}>
          {children}
        </div>
        {note && <p className="mx-auto mt-3 max-w-[560px] text-center text-[12px] leading-5 text-fd-muted-foreground">{note}</p>}
      </div>
    </figure>
  );
}

// ── 플레이그라운드 공통 — 그림 속 폰 · 데스크톱 창(판 폭에 맞춰 줄인다) ─────────
function FitScale({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState(1);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setS(Math.min(1, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{ width: w * s, height: h * s, margin: '0 auto' }}>
        <div style={{ width: w, height: h, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
      </div>
    </div>
  );
}

// 판 폭에 맞춰 줄인다 — 높이를 미리 알 수 없는 그림(폼처럼 줄바꿈이 있는 것)은 zoom 으로(자리도 같이 준다)
export function FitZoom({ w, children }: { w: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState(1);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setS(Math.min(1, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="flex w-full justify-center">
      <div style={{ width: w, zoom: s === 1 ? undefined : s }}>{children}</div>
    </div>
  );
}

const FRAME = { light: '#1A1F2E', dark: '#3A3F4C' };
const CHROME = { light: '#E4E6EB', dark: '#2B303D' };
const deco = (mode: ViewMode, c: { light: string; dark: string }, name: string) => (mode === 'auto' ? `var(--p-${name})` : c[mode]);
export const PHONE_SCREEN = 360;
const BORDER = 8;

// 폰 — 상태 막대 · 앱 막대 · 본문(폼). 위에 덮는 판(시트)은 overlay
function PhoneStage({ ov, mode, title, h, children, overlay }: { ov: OvKit; mode: ViewMode; title: string; h: number; children: ReactNode; overlay?: ReactNode }) {
  const fg = tone(ov, 'fg-neutral', mode);
  return (
    <div style={{ position: 'relative', width: PHONE_SCREEN + BORDER * 2, height: h, boxSizing: 'border-box', borderRadius: 36, border: `${BORDER}px solid ${deco(mode, FRAME, 'frame')}`, background: tone(ov, 'bg-layer-default', mode), overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: FONT, color: fg, isolation: 'isolate' }}>
      <div className="flex h-10 shrink-0 items-center justify-between px-6 text-[13px] font-bold">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <Signal size={14} />
          <Wifi size={14} />
          <BatteryFull size={16} />
        </span>
      </div>
      <div className="flex h-12 shrink-0 items-center gap-1 px-3">
        <ChevronLeft size={24} strokeWidth={2} />
        <span className="flex-1 truncate text-[17px] font-bold">{title}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">{children}</div>
      {overlay}
    </div>
  );
}
// 데스크톱 창 — 창 막대 · 페이지(제목 + 폼). 팝오버는 칸 아래 8 에(overlay)
function DesktopStage({ ov, mode, w, h, title, url, children, overlay, onBackground }: { ov: OvKit; mode: ViewMode; w: number; h: number; title: string; url: string; children: ReactNode; overlay?: ReactNode; onBackground?: (e: ReactPointerEvent) => void }) {
  return (
    <div onPointerDown={onBackground} style={{ position: 'relative', width: w, height: h, boxSizing: 'border-box', borderRadius: 12, border: `1px solid ${deco(mode, CHROME, 'chrome')}`, background: tone(ov, 'bg-layer-basement', mode), overflow: 'hidden', fontFamily: FONT, isolation: 'isolate' }}>
      <div className="flex h-8 items-center gap-1.5 px-3" style={{ background: deco(mode, CHROME, 'chrome') }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 rounded px-3 text-[11px] leading-5" style={{ background: deco(mode, { light: '#F5F6FA', dark: '#1E222C' }, 'chrome-url'), color: '#8A91A0' }}>
          {url}
        </span>
      </div>
      <div style={{ position: 'relative', padding: '24px 32px' }}>
        <div className="pb-4 text-[20px] font-bold leading-7" style={{ color: tone(ov, 'fg-neutral', mode) }}>
          {title}
        </div>
        {children}
      </div>
      {overlay}
    </div>
  );
}

// 그림 속에 열어 둔 고르는 자리 — 시트(폰 위) · 팝오버(칸 아래 8). 열면 고른 날 · 시 칼럼으로 초점, 닫으면 칸으로. Esc · 바깥 · 닫기는 버린다
function InlineSurface({
  ov,
  mode,
  kind,
  open,
  title,
  onClose,
  footer,
  tall = false,
  popoverWidth,
  children,
  focusKey,
}: {
  ov: OvKit;
  mode: ViewMode;
  kind: 'sheet' | 'popover';
  open: boolean;
  title: string;
  onClose: () => void;
  footer: ReactNode;
  tall?: boolean;
  popoverWidth?: number;
  children: ReactNode;
  // 사용자가 연 횟수 — 바뀌면 안의 고른 자리로 초점을 옮긴다(처음 그릴 때는 옮기지 않는다)
  focusKey: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open || focusKey === 0) return;
    const r = requestAnimationFrame(() => {
      const el = ref.current?.querySelector<HTMLElement>('[data-autofocus], [role="spinbutton"]');
      el?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(r);
  }, [open, focusKey]);
  if (!open) return null;
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault();
      onClose();
    }
  };
  if (kind === 'popover')
    return (
      <div ref={ref} data-inline-surface="" style={{ position: 'absolute', left: 0, top: `calc(100% + ${ov.ov.popover.offset}px)`, zIndex: 3 }}>
        <PopoverSurface look={ov.ov.popover} mode={mode} footer={footer} style={popoverWidth ? { maxWidth: popoverWidth } : undefined} rootProps={{ role: 'dialog', 'aria-label': title, onKeyDown }}>
          {children}
        </PopoverSurface>
      </div>
    );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div aria-hidden onClick={onClose} style={{ position: 'absolute', inset: 0, background: ocv(ov.ov.sheet.dim, mode) }} />
      <div ref={ref} style={{ position: 'relative', height: tall ? `${ov.ov.sheet.maxHeight * 100}%` : undefined, display: 'flex', flexDirection: 'column' }}>
        <SheetSurface look={ov.ov.sheet} mode={mode} title={title} onClose={onClose} footer={footer} safe={12} style={tall ? { height: '100%' } : undefined} bodyStyle={tall ? { display: 'flex', flexDirection: 'column' } : undefined} rootProps={{ role: 'dialog', 'aria-label': title, onKeyDown }}>
          {children}
        </SheetSurface>
      </div>
    </div>
  );
}

function PlayFrame({ stage, controls, code, status }: { stage: ReactNode; controls: ReactNode; code: string; status?: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex flex-col items-center gap-3 bg-[#E9E9EC] px-4 py-8 dark:bg-fd-muted">
        {stage}
        {status && <p className="max-w-[560px] text-center text-[12px] leading-5 text-fd-muted-foreground" aria-live="polite">{status}</p>}
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 그림 속 칸 — Field + Input Button(폰 large · 데스크톱 medium)
function StageField({ sel, field, mode, label, text, placeholder, icon, size, onOpen, open, btnRef }: { sel: SelectLook; field: TfFieldLook; mode: ViewMode; label: string; text?: string; placeholder: string; icon: SelIcon; size: 'large' | 'medium'; onOpen: () => void; open: boolean; btnRef: { current: HTMLButtonElement | null } }) {
  return (
    <div onClick={labelFocusOnly}>
      <TfFieldView look={field} mode={mode} label={label}>
        {(ctl) => <InputButtonView look={sel} mode={mode} size={size} id={ctl.id} describedBy={ctl.describedBy} ariaLabel={`${label}, ${text ?? placeholder}`} buttonRef={btnRef} value={text} placeholder={placeholder} suffixIcon={icon} haspopup="dialog" expanded={open} onClick={onOpen} />}
      </TfFieldView>
    </div>
  );
}

const SURFACES = [
  ['sheet', '시트(1280 미만)'],
  ['popover', '팝오버(1280 이상)'],
] as const;
const CHIP_SET: PresetName[] = ['thisWeek', 'thisMonth', 'lastMonth', 'last3Months', 'thisYear'];
// 환불일 — 거래일(9월 24일)부터 오늘까지만
const TX_DAY: Day = { y: 2026, m: 9, d: 24 };
const dayCode = (d: Day) => `new Date(${d.y}, ${d.m - 1}, ${d.d})`;

// ── Date Picker 플레이그라운드 ─────────────────────────────
export function DatePickerPlayground({ kits, ovs, sels, field }: { kits: Record<Brand, DateKit>; ovs: Record<Brand, OvKit>; sels: Record<Brand, SelectLook>; field: TfFieldLook }) {
  const [selection, setSelection] = useState<DpSelection>('single');
  const [surface, setSurface] = useState<'sheet' | 'popover'>('sheet');
  const [limit, setLimit] = useState<'none' | 'refund'>('none');
  const [chips, setChips] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [value, setValue] = useState<DateValue>(undefined);
  const [draft, setDraft] = useState<DateValue>(undefined);
  const [open, setOpen] = useState(true);
  const [opened, setOpened] = useState(0);
  const btn = useRef<HTMLButtonElement | null>(null);
  const kit = kits[brand];
  const ov = ovs[brand];
  const sheet = surface === 'sheet';
  const range = selection === 'range';
  const visible = range ? (sheet ? 'continuous' : 'twoMonths') : 'month';
  const placeholder = range ? '기간 선택' : '날짜 선택';
  const label = range ? '기간' : selection === 'multiple' ? '날짜(여러 날)' : '날짜';
  const ready = isComplete(selection, draft);
  const text = formatValue(selection, value);
  const min = limit === 'refund' ? TX_DAY : undefined;
  const max = limit === 'refund' ? TODAY : undefined;
  // 고르기 · 여는 자리를 바꾸면 처음부터(열어 둔 채)
  useEffect(() => {
    setValue(undefined);
    setDraft(undefined);
    setOpen(true);
  }, [selection, surface, limit]);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const commit = () => {
    if (!ready) return;
    setValue(draft);
    close();
  };
  const items = (b: OvKit['sheet']) => [...(range ? [{ label: '초기화', look: b.weak, onClick: () => setDraft(undefined) }] : []), { label: '완료', look: b.solid, onClick: commit, state: ready ? undefined : ('disabled' as const) }];
  const fieldSize = sheet ? 'large' : 'medium';
  const fieldTop = parseFloat(field.label.text.lineHeight) + field.gap + sels[brand].ib.sizes[fieldSize].h;
  const popW = visible === 'twoMonths' ? kit.date.twoMonths.width + ov.ov.popover.body.padX * 2 : kit.date.width + ov.ov.popover.body.padX * 2;
  const stageW = sheet ? PHONE_SCREEN + BORDER * 2 : popW + 64 + 2;
  const presetH = range && chips === 'yes' ? kit.date.presets.height + kit.date.presets.padBottom : 0;
  const popH = ov.ov.popover.body.padTop + presetH + kit.date.header.height + kit.date.weekday.height + kit.date.cell.height * kit.date.cell.weeks + ov.ov.popover.footer.padTop + ov.ov.popover.footer.button.height + ov.ov.popover.footer.padBottom;
  const stageH = sheet ? 760 : 32 + 24 + 44 + fieldTop + ov.ov.popover.offset + popH + 24;
  const picker = (
    <DatePickerView
      key={`${selection}-${surface}-${limit}-${chips}-${brand}`}
      kit={kit}
      mode={mode}
      live
      autoFocus
      selection={selection}
      visibleRange={visible}
      value={draft}
      onValue={setDraft}
      min={min}
      max={max}
      presets={range && chips === 'yes' ? CHIP_SET : undefined}
      presetLayout={sheet ? 'scroll' : 'wrap'}
      width={sheet ? '100%' : undefined}
      fill={visible === 'continuous'}
      ariaLabel={label}
    />
  );
  const fieldEl = (
    <StageField
      sel={sels[brand]}
      field={field}
      mode={mode}
      label={label}
      text={text}
      placeholder={placeholder}
      icon="calendar"
      size={fieldSize}
      open={open}
      btnRef={btn}
      onOpen={() => {
        setDraft(value);
        setOpen(true);
        setOpened((n) => n + 1);
      }}
    />
  );
  const surfaceEl = (
    <InlineSurface
      ov={ov}
      mode={mode}
      kind={surface}
      open={open}
      title={placeholder}
      onClose={close}
      tall={visible === 'continuous'}
      popoverWidth={visible === 'twoMonths' ? popW : undefined}
      focusKey={opened}
      footer={sheet ? <SheetButtons mode={mode} items={items(ov.sheet)} /> : <EndButtons mode={mode} items={items(ov.dialog)} />}
    >
      {picker}
    </InlineSurface>
  );
  const props = [
    `selection="${selection}"`,
    ...(range ? [`visibleRange="${visible}"`] : []),
    'autoFocus',
    ...(range && chips === 'yes' ? [`presets={[${CHIP_SET.map((p) => `"${p}"`).join(', ')}]}`] : []),
    ...(limit === 'refund' ? [`min={transactionDate} // ${dayCode(TX_DAY)}`, 'max={today}'] : []),
    'value={draft}',
    'onValueChange={setDraft}',
  ];
  const where = sheet
    ? visible === 'continuous'
      ? '1280 미만 — <BottomSheetContent className="h-[90dvh]"> 의 본문(이어지는 달은 시트 높이를 채운다)'
      : '1280 미만 — BottomSheetContent 의 본문'
    : visible === 'twoMonths'
      ? '1280 이상 — <PopoverContent className={DATE_PICKER_TWO_MONTHS_POPOVER}> 의 본문(팝오버 폭 744)'
      : '1280 이상 — PopoverContent 의 본문';
  const code = [
    `import { ${visible === 'twoMonths' ? 'DATE_PICKER_TWO_MONTHS_POPOVER, ' : ''}DatePicker } from "@/components/ui/date-picker"`,
    '',
    `// ${where} — useInputButtonSurface(input-button.md)`,
    '<DatePicker',
    ...props.map((p) => `  ${p}`),
    '/>',
    ...(range ? ['<Button variant="neutralWeak" onClick={() => setDraft(undefined)}>초기화</Button>'] : []),
    `<Button disabled={!${range ? 'draft?.end' : selection === 'multiple' ? 'draft?.length' : 'draft'}} onClick={apply}>완료</Button>`,
  ].join('\n');
  const status = open ? (range ? '시작과 끝을 누르면 "완료" 가 켜져요 — 시작보다 앞을 누르면 그날이 새 시작이에요.' : '날짜를 누르고 "완료" 를 누르면 칸에 들어가요. 바깥 · 닫기 · Esc 는 고르던 것을 버려요.') : text ? `칸에 들어간 값: ${text} — 칸을 누르면 그 값에서 다시 열려요.` : '칸을 누르면 다시 열려요.';
  return (
    <PlayFrame
      stage={
        <div className="w-full" data-brand={brand} style={{ maxWidth: stageW }}>
          <FitScale w={stageW} h={stageH}>
            {sheet ? (
              <PhoneStage ov={ov} mode={mode} title="일정 추가" h={stageH} overlay={surfaceEl}>
                {fieldEl}
              </PhoneStage>
            ) : (
              <DesktopStage
                ov={ov}
                mode={mode}
                w={stageW}
                h={stageH}
                title={brand === 'hr' ? '업무 보고' : '통계'}
                url={brand === 'hr' ? 'hr.porest.app' : 'desk.porest.app'}
                onBackground={(e) => {
                  const t = e.target as HTMLElement;
                  if (open && !t.closest('[data-inline-surface]') && !t.closest('.psel-box')) close();
                }}
              >
                <div style={{ position: 'relative', width: 280 }}>
                  {fieldEl}
                  {surfaceEl}
                </div>
              </DesktopStage>
            )}
          </FitScale>
        </div>
      }
      status={status}
      code={code}
      controls={
        <>
          <Seg label="고르기 selection" value={selection} options={[['single', '하루 single'], ['range', '기간 range'], ['multiple', '여러 날 multiple']] as const} onChange={setSelection} />
          <Seg label="여는 자리" value={surface} options={SURFACES} onChange={setSurface} />
          <Seg label="막힌 날" value={limit} options={[['none', '없음'], ['refund', '거래일~오늘(환불일)']] as const} onChange={setLimit} />
          {range ? <Seg label="빠른 기간 presets" value={chips} options={[['yes', '있음'], ['no', '없음']] as const} onChange={setChips} /> : <Note>빠른 기간은 기간(range)에서만 — 달력 위 칩 한 줄.</Note>}
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}
function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
      <span className="font-medium">빠른 기간 presets</span>
      <span>{children}</span>
    </div>
  );
}

// ── Time Picker 플레이그라운드 ─────────────────────────────
export function TimePickerPlayground({ kits, ovs, sels, field }: { kits: Record<Brand, DateKit>; ovs: Record<Brand, OvKit>; sels: Record<Brand, SelectLook>; field: TfFieldLook }) {
  const steps = kits.desk.time.steps;
  const [step, setStep] = useState(kits.desk.time.defaultStep);
  const [surface, setSurface] = useState<'sheet' | 'popover'>('sheet');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const start: Time = { hour: 11, minute: 55 };
  const [value, setValue] = useState<Time | undefined>(undefined);
  const [draft, setDraft] = useState<Time>(start);
  const [open, setOpen] = useState(true);
  const [opened, setOpened] = useState(0);
  const [log, setLog] = useState('');
  const btn = useRef<HTMLButtonElement | null>(null);
  const kit = kits[brand];
  const ov = ovs[brand];
  const sheet = surface === 'sheet';
  useEffect(() => {
    setValue(undefined);
    setDraft(roundToStep(start, step));
    setOpen(true);
    setLog('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, surface]);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => btn.current?.focus());
  };
  const commit = () => {
    setValue(draft);
    close();
  };
  // 고르던 값이 바뀔 때 — 오전 · 오후가 시를 따라 바뀌었는지, 분이 넘어갔는지 알린다
  const onDraft = (t: Time) => {
    setLog(t.hour < 12 !== draft.hour < 12 && t.hour % 12 !== draft.hour % 12 ? `시를 ${((draft.hour + 11) % 12) + 1} → ${((t.hour + 11) % 12) + 1} 로 넘겨 ${t.hour < 12 ? '오전' : '오후'}이 됐어요.` : t.hour === draft.hour && t.minute !== draft.minute && Math.abs(t.minute - draft.minute) > 30 ? `분이 ${String(draft.minute).padStart(2, '0')} → ${String(t.minute).padStart(2, '0')} 로 넘어가도 시는 그대로예요.` : '');
    setDraft(t);
  };
  const fieldSize = sheet ? 'large' : 'medium';
  const fieldTop = parseFloat(field.label.text.lineHeight) + field.gap + sels[brand].ib.sizes[fieldSize].h;
  const popW = Math.max(ov.ov.popover.minWidth, 0);
  const stageW = sheet ? PHONE_SCREEN + BORDER * 2 : 480;
  const popH = ov.ov.popover.body.padTop + kit.time.height + ov.ov.popover.footer.padTop + ov.ov.popover.footer.button.height + ov.ov.popover.footer.padBottom;
  const stageH = sheet ? 600 : 32 + 24 + 44 + fieldTop + ov.ov.popover.offset + popH + 24;
  const surfaceEl = (
    <InlineSurface
      ov={ov}
      mode={mode}
      kind={surface}
      open={open}
      title="시간 선택"
      onClose={close}
      focusKey={opened}
      footer={sheet ? <SheetButtons mode={mode} items={[{ label: '완료', look: ov.sheet.solid, onClick: commit }]} /> : <EndButtons mode={mode} items={[{ label: '완료', look: ov.dialog.solid, onClick: commit }]} />}
    >
      <TimePickerView key={`${step}-${surface}-${brand}`} wheel={kit.wheel} time={kit.time} mode={mode} live value={draft} onValue={onDraft} step={step} ariaLabel="시작 시각" />
    </InlineSurface>
  );
  const fieldEl = (
    <StageField
      sel={sels[brand]}
      field={field}
      mode={mode}
      label="시작 시각"
      text={value ? formatTime(value) : undefined}
      placeholder="시간 선택"
      icon="clock"
      size={fieldSize}
      open={open}
      btnRef={btn}
      onOpen={() => {
        setDraft(value ?? roundToStep(start, step));
        setOpen(true);
        setOpened((n) => n + 1);
      }}
    />
  );
  const code = ['import { TimePicker } from "@/components/ui/time-picker"', '', `// ${sheet ? '1280 미만 — BottomSheetContent 의 본문' : '1280 이상 — PopoverContent 의 본문'}(useInputButtonSurface, input-button.md)`, `<TimePicker${step === kits.desk.time.defaultStep ? '' : ` minuteStep={${step}}`} value={draft} onValueChange={setDraft} autoFocus />`, '<Button onClick={() => { setTime(draft); setOpen(false) }}>완료</Button>'].join('\n');
  const status = log || (open ? `고르는 중: ${formatTime(draft)} — 시를 11 ↔ 12 로 넘기거나 분을 55 → 00 으로 넘겨 보세요.` : value ? `칸에 들어간 값: ${formatTime(value)}` : '칸을 누르면 다시 열려요.');
  void popW;
  return (
    <PlayFrame
      stage={
        <div className="w-full" data-brand={brand} style={{ maxWidth: stageW }}>
          <FitScale w={stageW} h={stageH}>
            {sheet ? (
              <PhoneStage ov={ov} mode={mode} title="일정 추가" h={stageH} overlay={surfaceEl}>
                {fieldEl}
              </PhoneStage>
            ) : (
              <DesktopStage
                ov={ov}
                mode={mode}
                w={stageW}
                h={stageH}
                title="일정 추가"
                url={brand === 'hr' ? 'hr.porest.app' : 'desk.porest.app'}
                onBackground={(e) => {
                  const t = e.target as HTMLElement;
                  if (open && !t.closest('[data-inline-surface]') && !t.closest('.psel-box')) close();
                }}
              >
                <div style={{ position: 'relative', width: 200 }}>
                  {fieldEl}
                  {surfaceEl}
                </div>
              </DesktopStage>
            )}
          </FitScale>
        </div>
      }
      status={status}
      code={code}
      controls={
        <>
          <Seg label="분 간격 minuteStep" value={String(step)} options={steps.map((s) => [String(s), `${s}분${s === kits.desk.time.defaultStep ? '(기본)' : ''}`] as const)} onChange={(v) => setStep(Number(v))} />
          <Seg label="여는 자리" value={surface} options={SURFACES} onChange={setSurface} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
        </>
      }
    />
  );
}

// ── Wheel Picker 플레이그라운드 — 예산 월(연 | 월) ───────────────
export function WheelPickerPlayground({ kits }: { kits: Record<Brand, DateKit> }) {
  const w = kits.desk.wheel;
  const [size, setSize] = useState<WpSize>(w.defaults.size);
  const [visible, setVisible] = useState(w.defaults.visible);
  const [loop, setLoop] = useState<'yes' | 'no'>('yes');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [value, setValue] = useState<Month>(monthOf(TODAY));
  const [passing, setPassing] = useState<string>('');
  const kit = kits[brand];
  const columns = useMemo(() => {
    const wc = kit.date.wheel.columns;
    const cols = monthYearColumns({ y: value.y, m: value.m, from: TODAY.y - 100, to: TODAY.y + 100, onYear: (y) => setValue((v) => ({ ...v, y })), onMonth: (m) => setValue((v) => ({ ...v, m })), widths: { year: wc.year.width, month: wc.month.width } });
    cols[1] = { ...cols[1], loop: loop === 'yes', onPass: (i) => setPassing(`${i + 1}월`) };
    cols[0] = { ...cols[0], onPass: (i) => setPassing(`${TODAY.y - 100 + i}년`) };
    return cols;
  }, [value, loop, kit]);
  const code = [
    'import { WheelPicker, WheelPickerColumn } from "@/components/ui/wheel-picker"',
    '',
    `<WheelPicker aria-label="월 선택"${size === w.defaults.size ? '' : ` size="${size}"`}${visible === w.defaults.visible ? '' : ` visibleItems={${visible}}`}>`,
    `  <WheelPickerColumn aria-label="연도" options={years} align="right" className="w-[${kit.date.wheel.columns.year.width}px]" value={year} onValueChange={setYear} />`,
    `  <WheelPickerColumn aria-label="월" options={months} align="left" className="w-[${kit.date.wheel.columns.month.width}px]"${loop === 'yes' ? ' loop' : ''} value={month} onValueChange={setMonth} />`,
    '</WheelPicker>',
  ].join('\n');
  const ovBg = kit.wheel.bg;
  return (
    <PlayFrame
      stage={
        <div className="w-full max-w-[360px]" data-brand={brand}>
          <div style={{ borderRadius: 20, padding: '24px 0', background: mode === 'auto' ? `var(--p-${ovBg.name})` : ovBg[mode] }}>
            <WheelView key={`${size}-${visible}-${loop}-${brand}`} look={kit.wheel} mode={mode} size={size} visible={visible} live ariaLabel="월 선택" columns={columns} />
          </div>
        </div>
      }
      status={`고른 값: ${monthValue(value)}${passing ? ` · 지나는 항목 ${passing}` : ''} — 값은 휠이 멈춘 뒤 한 번만 바뀌어요.`}
      code={code}
      controls={
        <>
          <Seg label="크기 size" value={size} options={[['medium', `medium ${w.sizes.medium.item}(기본)`], ['small', `small ${w.sizes.small.item}`]] as const} onChange={setSize} />
          <Seg label="보이는 칸 visibleItems" value={String(visible)} options={w.visibleItems.map((n) => [String(n), `${n}칸 · ${w.sizes[size].item * n}${n === w.defaults.visible ? '(기본)' : ''}`] as const)} onChange={(v) => setVisible(Number(v))} />
          <Seg label="월 반복 loop" value={loop} options={[['yes', '켬 — 12월 다음 1월'], ['no', '끔 — 1월 · 12월에서 멈춤']] as const} onChange={setLoop} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

