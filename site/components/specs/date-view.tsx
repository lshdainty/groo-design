'use client';
// 스펙대로 그린 Date Picker — DateKit(date-picker · wheel-picker · chip · button.yaml 을 푼 값)만 받아 그린다.
// live 면 실제 달력이다: 날짜 누르기(하루 · 기간 · 여러 날), 이전 · 다음, 제목 → 연 · 월 휠, 빠른 기간 칩, 키보드 Grid(← → ↑ ↓ Home End
// PageUp PageDown · Shift, Enter Space), 하나만 Tab 자리(roving), 보이는 달이 바뀌면 "2026년 11월" 을 읽는다. 멈춘 그림은 hover · press · focus 를 준다.
// 원 크기는 min(42, 칸 폭 − 2) — 칸마다 크기 컨테이너를 두고 칸 폭(100cqi)으로 셈한다(360 화면 칸 44.6 → 42, 320 화면 38.9 → 36.9).
// 앞뒤 달 날짜는 흐린 숫자만 그린다 — 띠 · 오늘 · 고름을 그리지 않고 누르지 못한다(숫자는 보조 기술에 숨긴다).
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { ButtonView } from './button-view';
import { ChipGroupView, ChipRadioGroupLive, ChipView } from './chip-view';
import {
  TODAY,
  WEEK,
  WEEK_NAMES,
  addDays,
  addMonth,
  addMonthsClamp,
  cmpDay,
  dayName,
  dcv,
  dkey,
  endOfWeek,
  fromMkey,
  mkey,
  monthGrid,
  monthOf,
  monthTitle,
  presetLabel,
  presetRange,
  sameDay,
  startOfWeek,
  type DColor,
  type DType,
  type DateKit,
  type DateLook,
  type DateValue,
  type Day,
  type DpProp,
  type DpSelection,
  type DpVisibleRange,
  type Month,
  type PresetName,
  type RangeValue,
  type ViewMode,
} from './date-shared';
import { WheelView, monthYearColumns, useReducedMotion } from './wheel-view';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const textOf = (t: DType, weight?: number | string): CSSProperties => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: weight ?? t.fontWeight });
const HIDDEN: CSSProperties = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };

// ── 한 칸의 상태 ───────────────────────────────────────────
export type DayInfo = {
  day: Day;
  outside: boolean;
  today: boolean;
  selected: boolean;
  inRange: boolean;
  // 기간 띠 — 시작 칸은 원 가운데부터 오른쪽, 끝 칸은 왼쪽부터 원 가운데, 사이 칸은 칸 전체(기간이 다 골라졌을 때만)
  band: 'start' | 'end' | 'mid' | null;
  disabled: boolean;
  readOnly: boolean;
  // 시작만 고른 기간의 시작 — 막힌 날이어도 취소선을 긋지 않는다
  incompleteStart?: boolean;
};

type Ctx = { selection: DpSelection; value: DateValue; today: Day; isDisabled: (d: Day) => boolean; readOnlyStart: boolean };

export function dayInfo(day: Day, outside: boolean, c: Ctx): DayInfo {
  const today = sameDay(day, c.today);
  let selected = false;
  let inRange = false;
  let band: DayInfo['band'] = null;
  let readOnly = false;
  let incompleteStart = false;
  if (c.selection === 'single') selected = sameDay(day, c.value as Day | undefined);
  else if (c.selection === 'multiple') selected = ((c.value as Day[] | undefined) ?? []).some((x) => sameDay(x, day));
  else {
    const r = (c.value as RangeValue | undefined) ?? {};
    selected = sameDay(day, r.start) || sameDay(day, r.end);
    readOnly = c.readOnlyStart && sameDay(day, r.start);
    incompleteStart = !!r.start && !r.end && sameDay(day, r.start);
    if (r.start && r.end && cmpDay(r.start, r.end) < 0) {
      const k = dkey(day);
      if (k === dkey(r.start)) band = 'start';
      else if (k === dkey(r.end)) band = 'end';
      else if (k > dkey(r.start) && k < dkey(r.end)) {
        band = 'mid';
        inRange = true;
      }
    }
  }
  return { day, outside, today, selected, inRange, band, disabled: c.isDisabled(day), readOnly, incompleteStart };
}

// 상태가 겹칠 때(date-picker.md) — 칸의 바탕 모양은 하나: 읽기 전용 > 고름 > 막힘 > 기간 사이 > 오늘 > 보통(그 상태가 YAML 에 적은 속성으로).
// 오늘의 굵기는 늘 남는다(고른 날 · 기간 안 · 막힌 날에서도). 취소선은 막힌 날이면 고른 날에도 긋고, 시작만 고른 기간의 시작 · 읽기 전용에는 긋지 않는다.
// 호버 · 누름 원은 보통 날 bg-neutral-weak-alpha-pressed(YAML — SEED 투명 색), 오늘 · 기간 사이 날은 한 단계 짙은 색 — 고른 날 · 막힌 날 · 읽기 전용 · 앞뒤 달에는 없다
type Face = { bg: DColor | null; fg: DColor; weight: number | string; strike: boolean; cursor: string };
export function faceFor(look: DateLook, info: DayInfo, hovered = false, pressed = false): Face {
  const F = look.faces;
  const apply = (f: Face, s: keyof typeof F) => {
    const x = F[s];
    const out = { ...f };
    for (const p of x.set as DpProp[]) (out as Record<DpProp, unknown>)[p] = x[p];
    return out;
  };
  const base: Face = { bg: F.enabled.bg, fg: F.enabled.fg, weight: F.enabled.weight, strike: F.enabled.strike, cursor: F.enabled.cursor };
  if (info.outside) return apply(base, 'outside');
  const tone = info.readOnly ? 'readOnly' : info.selected ? 'selected' : info.disabled ? 'disabled' : info.inRange ? 'inRange' : info.today ? 'today' : 'enabled';
  const f = apply(base, tone);
  if (info.today) f.weight = F.today.weight;
  f.strike = info.disabled && !info.readOnly && !info.incompleteStart && (tone === 'disabled' ? F.disabled.strike : true);
  if (info.selected && info.disabled) f.cursor = F.disabled.cursor;
  if (hovered || pressed) {
    if (tone === 'enabled') f.bg = (pressed ? F.pressed : F.hovered).bg;
    else if (tone === 'today' || tone === 'inRange') f.bg = look.pressOnWeak;
  }
  return f;
}

export type CellMarks = { cell?: CSSProperties; circle?: CSSProperties; band?: CSSProperties };

// 날짜 칸 — 칸 전체가 누르는 자리(버튼), 원은 칸 위 3 · 가로 가운데, 띠는 원 높이
export function DayCell({
  look,
  mode,
  info,
  live,
  tabStop = false,
  autoFocus = false,
  hovered = false,
  pressed = false,
  ring = false,
  marks,
  handlers,
}: {
  look: DateLook;
  mode: ViewMode;
  info: DayInfo;
  live: boolean;
  tabStop?: boolean;
  autoFocus?: boolean;
  hovered?: boolean;
  pressed?: boolean;
  ring?: boolean;
  marks?: CellMarks;
  handlers?: {
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
    onFocus: (visible: boolean) => void;
    onBlur: () => void;
    onPointerEnter: (mouse: boolean) => void;
    onPointerLeave: () => void;
    onPointerDown: (mouse: boolean) => void;
    onPointerUp: () => void;
  };
}) {
  const f = faceFor(look, info, hovered, pressed);
  const d = look.day;
  // 원 — min(42, 칸 폭 − 2). 칸이 크기 컨테이너라 100cqi 가 칸 폭이다
  const size = `min(${d.size}px, calc(100cqi - ${d.shrinkBy}px))`;
  const circle: CSSProperties = {
    position: 'absolute',
    top: d.top,
    left: 0,
    right: 0,
    margin: '0 auto',
    width: size,
    height: size,
    boxSizing: 'border-box',
    borderRadius: 9999,
    background: f.bg ? dcv(f.bg, mode) : 'transparent',
    display: 'grid',
    placeItems: 'center',
    ...textOf(d.text, f.weight),
    fontVariantNumeric: 'tabular-nums',
    color: dcv(f.fg, mode),
    textDecoration: f.strike ? 'line-through' : 'none',
    transition: `background-color ${look.motion.bg.duration} ${look.motion.bg.easing}`,
    outline: ring ? `${look.ring.width}px solid ${dcv(look.ring.color, mode)}` : 'none',
    outlineOffset: look.ring.offset,
    ...marks?.circle,
  };
  const band = info.band && !info.outside && (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: d.top,
        height: size,
        left: info.band === 'start' ? '50%' : 0,
        right: info.band === 'end' ? '50%' : 0,
        background: dcv(look.band.color, mode),
        ...marks?.band,
      }}
    />
  );
  const cellStyle: CSSProperties = { position: 'relative', height: look.cell.height, containerType: 'inline-size', ...marks?.cell };
  const hit: CSSProperties = { position: 'absolute', inset: 0, margin: 0, padding: 0, border: 0, background: 'transparent', cursor: f.cursor, outline: 'none', WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit' };
  // 앞뒤 달 — 칸(gridcell)은 남기고 숫자만 보조 기술에 숨긴다(칸째 숨기면 그 주의 칸 수가 줄어 요일을 잘못 짝짓는다)
  if (!live || info.outside)
    return (
      <div role={live ? 'gridcell' : undefined} style={cellStyle}>
        {band}
        <span aria-hidden style={{ ...hit, cursor: live ? f.cursor : undefined }}>
          <span style={circle}>{info.day.d}</span>
        </span>
      </div>
    );
  const h = handlers!;
  return (
    <div role="gridcell" aria-selected={info.selected || info.inRange ? true : undefined} style={cellStyle}>
      {band}
      <button
        type="button"
        data-day={dkey(info.day)}
        data-autofocus={autoFocus ? '' : undefined}
        tabIndex={tabStop ? 0 : -1}
        aria-label={`${dayName(info.day)}${info.readOnly ? ', 읽기 전용 시작일' : ''}`}
        aria-current={info.today ? 'date' : undefined}
        aria-disabled={info.disabled || info.readOnly ? true : undefined}
        style={hit}
        onClick={h.onClick}
        onKeyDown={h.onKeyDown}
        onFocus={(e) => h.onFocus(e.currentTarget.matches(':focus-visible'))}
        onBlur={h.onBlur}
        onPointerEnter={(e) => h.onPointerEnter(e.pointerType === 'mouse')}
        onPointerLeave={h.onPointerLeave}
        onPointerDown={(e) => e.button === 0 && h.onPointerDown(e.pointerType === 'mouse')}
        onPointerUp={h.onPointerUp}
        onPointerCancel={h.onPointerUp}
      >
        <span aria-hidden style={circle}>
          {info.day.d}
        </span>
      </button>
    </div>
  );
}

// 요일 줄 — 보이는 글 "일", 읽는 이름 "일요일"
function WeekdayRow({ look, mode, live, decorative = false, style }: { look: DateLook; mode: ViewMode; live: boolean; decorative?: boolean; style?: CSSProperties }) {
  const w = look.weekday;
  return (
    <div role={live && !decorative ? 'row' : undefined} aria-hidden={decorative || undefined} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', alignItems: 'center', height: w.height, ...style }}>
      {WEEK.map((t, i) => (
        <span key={t} role={live && !decorative ? 'columnheader' : undefined} aria-label={live && !decorative ? WEEK_NAMES[i] : undefined} style={{ textAlign: 'center', ...textOf(w.text), color: dcv(w.color, mode) }}>
          <span aria-hidden={live && !decorative ? true : undefined}>{t}</span>
        </span>
      ))}
    </div>
  );
}

export type DpMarks = Partial<Record<'root' | 'presets' | 'header' | 'title' | 'nav' | 'weekday' | 'grid' | 'wheel' | 'monthLabel' | 'fog', CSSProperties>> & {
  cells?: { day: Day; marks: CellMarks }[];
};

export type DatePickerViewProps = {
  kit: DateKit;
  mode?: ViewMode;
  selection?: DpSelection;
  visibleRange?: DpVisibleRange;
  value?: DateValue;
  onValue?: (v: DateValue) => void;
  today?: Day;
  // 고를 수 있는 범위(양끝 포함) · 막을 날
  min?: Day;
  max?: Day;
  disabledDays?: (d: Day) => boolean;
  // 확정된 시작일(기간 늘리기) — 시작은 바꾸지 못하고 끝만
  readOnlyStart?: boolean;
  // 여러 날의 최대 개수 — 다 고르면 고르지 않은 날이 막힌 날이 된다(고른 날은 풀 수 있다)
  maxCount?: number;
  // 빠른 기간 — 시트는 한 줄 가로 스크롤(화면 끝까지), 팝오버는 줄바꿈
  presets?: PresetName[];
  presetLayout?: 'scroll' | 'wrap';
  preset?: PresetName;
  live?: boolean;
  // 폭 — 기본은 팝오버(336 · 두 달 696), 시트는 '100%'
  width?: number | string;
  // 이어지는 달 — 높이(멈춘 그림) · 부모를 채우기(시트)
  height?: number;
  fill?: boolean;
  // 처음 보이는 달(두 달은 첫 달) · 이어지는 달의 맨 위 달
  view?: Month;
  // 이어지는 달 — 그릴 달 · 맨 위 달 아래로 더 내린 만큼(멈춘 그림)
  months?: Month[];
  scrollOffset?: number;
  // 연 · 월 휠(한 달 보기) — 열어 두기 · 휠의 자리
  wheelOpen?: boolean;
  wheelAt?: { year?: number; month?: number };
  // 멈춘 그림의 호버 · 누름 · 키보드 초점
  hover?: Day;
  press?: Day;
  focus?: Day;
  // 열 때 초점 받을 날짜에 data-autofocus(시트 · 팝오버가 그 자리로 초점을 옮긴다)
  autoFocus?: boolean;
  ariaLabel?: string;
  // 연의 범위(기본 오늘 ± 100년)
  yearRange?: [number, number];
  // 그림 — 머리 없이 요일 줄 + 날짜 칸만(한 달)
  bare?: boolean;
  marks?: DpMarks;
  decor?: ReactNode;
};

const firstDay = (v: DateValue, sel: DpSelection): Day | undefined => {
  if (!v) return undefined;
  if (sel === 'single') return v as Day;
  if (sel === 'range') return (v as RangeValue).start;
  const days = v as Day[];
  return days.length ? [...days].sort(cmpDay)[0] : undefined;
};

// 이어지는 달 — 달 하나의 높이(이름 + 주 수 × 칸 + 아래 여백)
const monthBlock = (look: DateLook, mo: Month) => look.monthLabel.height + monthGrid(mo, 'natural').length * look.cell.height + look.monthLabel.gapBelow;

export function DatePickerView({
  kit,
  mode = 'auto',
  selection = 'single',
  visibleRange = 'month',
  value,
  onValue,
  today = TODAY,
  min,
  max,
  disabledDays,
  readOnlyStart = false,
  maxCount,
  presets,
  presetLayout = 'wrap',
  preset: presetProp,
  live = false,
  width,
  height,
  fill = false,
  view: viewProp,
  months: monthsProp,
  scrollOffset = 0,
  wheelOpen = false,
  wheelAt,
  hover: hoverProp,
  press: pressProp,
  focus: focusProp,
  autoFocus = false,
  ariaLabel = '날짜 선택',
  yearRange,
  bare = false,
  marks,
  decor,
}: DatePickerViewProps) {
  const look = kit.date;
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [years] = useState<[number, number]>(yearRange ?? [today.y - 100, today.y + 100]);
  const picked = firstDay(value, selection);
  const anchor = viewProp ?? monthOf(picked ?? today);
  const [view, setView] = useState<Month>(anchor);
  const [wheel, setWheel] = useState(wheelOpen);
  const [wheelDraft, setWheelDraft] = useState<Month>(anchor);
  const [stop, setStop] = useState<Day>(picked ?? today);
  const [hover, setHover] = useState<Day | undefined>();
  const [press, setPress] = useState<Day | undefined>();
  const [ringKey, setRingKey] = useState<number | null>(null);
  const [preset, setPreset] = useState<PresetName | undefined>(presetProp);
  const [announce, setAnnounce] = useState('');
  const focusReq = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const inYears = (d: Day) => d.y >= years[0] && d.y <= years[1];
  const outOfRange = (d: Day) => (!!min && cmpDay(d, min) < 0) || (!!max && cmpDay(d, max) > 0) || !!disabledDays?.(d) || !inYears(d);
  const picks = selection === 'multiple' ? ((value as Day[] | undefined) ?? []) : [];
  const full = selection === 'multiple' && maxCount !== undefined && picks.length >= maxCount;
  // 확정된 시작일(읽기 전용) 앞의 날은 고를 수 없다 — 막힌 날로 그린다
  const fixedStart = selection === 'range' && readOnlyStart ? (value as RangeValue | undefined)?.start : undefined;
  const isDisabled = (d: Day) => outOfRange(d) || (full && !picks.some((x) => sameDay(x, d))) || (!!fixedStart && cmpDay(d, fixedStart) < 0);
  // 빠른 기간 — 기간의 시작 · 끝이 고를 수 있는 범위 밖이거나 막힌 날이면 칩을 막는다(사이의 막힌 날은 괜찮다 — 손으로 고를 때와 같다).
  // 확정된 시작이 있으면 시작이 다른 기간도 막는다
  const presetBlocked = (p: PresetName) => {
    const r = presetRange(p, today);
    if (fixedStart && !sameDay(fixedStart, r.start)) return true;
    return outOfRange(r.start) || outOfRange(r.end);
  };
  const ctx: Ctx = { selection, value, today, isDisabled, readOnlyStart };

  // 이어지는 달 — 그릴 달(앞뒤 12달) · 맨 위 달
  const months: Month[] = monthsProp ?? Array.from({ length: 25 }, (_, i) => addMonth(anchor, i - 12));
  const topIndex = Math.max(0, months.findIndex((m) => mkey(m) === mkey(anchor)));
  const offsetOf = (i: number) => months.slice(0, i).reduce((s, m) => s + monthBlock(look, m), 0);
  const initialOffset = offsetOf(topIndex) + scrollOffset;

  // 빠른 기간 칩 — 값이 그 기간이 아니게 되면(달력에서 다른 날 · 초기화) 고름이 풀린다
  useEffect(() => {
    if (!live || !preset) return;
    const r = presetRange(preset, today);
    const v = (value as RangeValue | undefined) ?? {};
    if (!(sameDay(v.start, r.start) && sameDay(v.end, r.end))) setPreset(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 초점 옮기기 — 렌더 뒤 그 날짜 버튼으로
  useEffect(() => {
    if (focusReq.current === null) return;
    const el = rootRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focusReq.current}"]`);
    focusReq.current = null;
    el?.focus();
  });

  // 이어지는 달 — 처음 맨 위 달을 요일 줄 바로 아래로. 서버 그림은 그 자리로 당겨(margin) 그려 두었다 —
  // 붙으면 당김을 걷고 그림 전에 스크롤로 같은 자리에 둔다(당긴 채로 스크롤을 주면 스크롤 높이가 줄어 있어 잘린다)
  useIsoLayoutEffect(() => {
    if (live && visibleRange === 'continuous') setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useIsoLayoutEffect(() => {
    if (!hydrated || !scroller.current) return;
    scroller.current.scrollTop = initialOffset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const say = (t: string) => setAnnounce(t);
  const visibleMonths = visibleRange === 'twoMonths' ? [view, addMonth(view, 1)] : [view];
  const lastAllowed = mkey({ y: years[1], m: 12 });
  const firstAllowed = mkey({ y: years[0], m: 1 });

  const pick = (day: Day) => {
    if (!live || isDisabled(day)) return;
    setPreset(undefined);
    setStop(day);
    if (selection === 'single') return onValue?.(day);
    if (selection === 'multiple') {
      const cur = (value as Day[] | undefined) ?? [];
      const has = cur.some((x) => sameDay(x, day));
      return onValue?.((has ? cur.filter((x) => !sameDay(x, day)) : [...cur, day]).sort(cmpDay));
    }
    const r = (value as RangeValue | undefined) ?? {};
    if (readOnlyStart && r.start) {
      // 확정된 시작 — 시작 뒤의 날만 새 끝이 된다
      if (cmpDay(day, r.start) > 0) onValue?.({ start: r.start, end: day });
      return;
    }
    // 첫 탭 시작 · 시작 뒤(같은 날 포함)는 끝 · 시작보다 앞은 새 시작(바꾸지 않는다) · 다 고른 뒤 누르면 새로 시작
    if (!r.start || r.end || cmpDay(day, r.start) < 0) onValue?.({ start: day });
    else onValue?.({ start: r.start, end: day });
  };

  const ensureVisible = (to: Day) => {
    const k = mkey(monthOf(to));
    const v = mkey(view);
    let next: Month | null = null;
    if (visibleRange === 'month' && k !== v) next = monthOf(to);
    if (visibleRange === 'twoMonths') {
      if (k < v) next = monthOf(to);
      else if (k > v + 1) next = fromMkey(k - 1);
    }
    if (next) {
      setView(next);
      say(visibleRange === 'twoMonths' ? `${monthTitle(next)}~${monthTitle(addMonth(next, 1))}` : monthTitle(next));
    }
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, day: Day) => {
    const span = visibleRange === 'twoMonths' ? 2 : 1;
    let to: Day | null = null;
    if (e.key === 'ArrowLeft') to = addDays(day, -1);
    else if (e.key === 'ArrowRight') to = addDays(day, 1);
    else if (e.key === 'ArrowUp') to = addDays(day, -7);
    else if (e.key === 'ArrowDown') to = addDays(day, 7);
    else if (e.key === 'Home') to = startOfWeek(day);
    else if (e.key === 'End') to = endOfWeek(day);
    else if (e.key === 'PageUp') to = addMonthsClamp(day, e.shiftKey ? -12 : -span);
    else if (e.key === 'PageDown') to = addMonthsClamp(day, e.shiftKey ? 12 : span);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(day);
      return;
    } else return;
    e.preventDefault();
    if (!inYears(to)) return;
    if (visibleRange === 'continuous' && (mkey(monthOf(to)) < mkey(months[0]) || mkey(monthOf(to)) > mkey(months[months.length - 1]))) return;
    setStop(to);
    ensureVisible(to);
    focusReq.current = dkey(to);
    setRingKey(dkey(to));
  };

  // 이전 · 다음 — 한 달씩. 새 달의 1일이 다음 Tab 자리(고른 날이 보이면 그 날)
  const go = (n: number) => {
    const next = addMonth(view, n);
    setView(next);
    const shown = visibleRange === 'twoMonths' ? [next, addMonth(next, 1)] : [next];
    if (!shown.some((m) => mkey(m) === mkey(monthOf(stop)))) setStop({ ...next, d: 1 });
    say(visibleRange === 'twoMonths' ? `${monthTitle(next)}~${monthTitle(addMonth(next, 1))}` : monthTitle(next));
  };

  // 제목 — 연 · 월 휠을 열고 닫는다. 닫으면 고른 달로 옮기고 그 달 1일이 다음 Tab 자리
  const toggleWheel = () => {
    if (!wheel) {
      setWheelDraft(view);
      setWheel(true);
      return;
    }
    setWheel(false);
    setView(wheelDraft);
    setStop({ ...wheelDraft, d: 1 });
    say(monthTitle(wheelDraft));
  };

  const onPreset = (p: string) => {
    const name = p as PresetName;
    const r = presetRange(name, today);
    setPreset(name);
    onValue?.(r);
    setStop(r.start);
    if (visibleRange === 'continuous') {
      const i = months.findIndex((m) => mkey(m) === mkey(monthOf(r.start)));
      if (i >= 0 && scroller.current) scroller.current.scrollTo({ top: offsetOf(i), behavior: reduce ? 'auto' : 'smooth' });
    } else if (!visibleMonths.some((m) => mkey(m) === mkey(monthOf(r.start)))) {
      setView(monthOf(r.start));
      say(monthTitle(monthOf(r.start)));
    }
  };

  // 이어지는 달 스크롤 — 맨 위에 걸친 달이 바뀌면 그 달 1일이 다음 Tab 자리, 달 이름을 읽는다
  const topMonth = useRef(topIndex);
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    let i = 0;
    while (i < months.length - 1 && offsetOf(i + 1) <= el.scrollTop + 1) i++;
    if (i === topMonth.current) return;
    topMonth.current = i;
    const mo = months[i];
    if (mkey(monthOf(stop)) !== mkey(mo)) setStop({ ...mo, d: 1 });
    say(monthTitle(mo));
  };

  // ── 그리기 ──────────────────────────────────────────────
  const cellMarks = (d: Day) => marks?.cells?.find((c) => sameDay(c.day, d))?.marks;
  const hoverDay = live ? hover : hoverProp;
  const pressDay = live ? press : pressProp;
  // Tab 자리 — 보이는 달 안이어야 한다(아니면 그 달 1일)
  const stopShown = visibleRange === 'continuous' ? stop : visibleMonths.some((m) => mkey(m) === mkey(monthOf(stop))) ? stop : { ...view, d: 1 };
  const handlersFor = (day: Day) => ({
    onClick: () => pick(day),
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => onKey(e, day),
    onFocus: (visible: boolean) => {
      setStop(day);
      setRingKey(visible ? dkey(day) : null);
    },
    onBlur: () => setRingKey(null),
    onPointerEnter: (mouse: boolean) => mouse && setHover(day),
    onPointerLeave: () => {
      setHover(undefined);
      setPress(undefined);
    },
    onPointerDown: (mouse: boolean) => {
      setRingKey(null);
      if (!mouse) setPress(day);
    },
    onPointerUp: () => setPress(undefined),
  });

  const grid = (mo: Month, weeks: 'six' | 'natural', withHead: boolean, labelledBy?: string, gridStyle?: CSSProperties) => (
    <div role={live ? 'grid' : undefined} aria-labelledby={live ? labelledBy : undefined} aria-multiselectable={live && selection !== 'single' ? true : undefined} style={{ ...marks?.grid, ...gridStyle }}>
      {withHead && <WeekdayRow look={look} mode={mode} live={live} style={marks?.weekday} />}
      {monthGrid(mo, weeks).map((row, r) => (
        <div key={r} role={live ? 'row' : undefined} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {row.map((c, i) =>
            c === null ? (
              <div key={i} role={live ? 'gridcell' : undefined} style={{ height: look.cell.height }} />
            ) : (
              <DayCell
                key={i}
                look={look}
                mode={mode}
                info={dayInfo(c.day, c.outside, ctx)}
                live={live}
                tabStop={!c.outside && sameDay(c.day, stopShown)}
                autoFocus={autoFocus && !c.outside && sameDay(c.day, stopShown)}
                hovered={!c.outside && sameDay(c.day, hoverDay)}
                pressed={!c.outside && sameDay(c.day, pressDay)}
                ring={!c.outside && (live ? ringKey === dkey(c.day) : sameDay(c.day, focusProp))}
                marks={cellMarks(c.day)}
                handlers={live && !c.outside ? handlersFor(c.day) : undefined}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );

  const presetRow = presets?.length ? (
    <div style={{ paddingBottom: look.presets.padBottom, ...marks?.presets }}>
      {live ? (
        <ChipRadioGroupLive look={kit.chip} mode={mode} variant={look.presets.variant} size={look.presets.size} layout={presetLayout} items={presets.map((p) => ({ value: p, label: presetLabel(p), disabled: presetBlocked(p) }))} value={preset ?? ''} onValue={onPreset} ariaLabel="빠른 기간" />
      ) : (
        <ChipGroupView look={kit.chip} mode={mode} layout={presetLayout}>
          {presets.map((p) => (
            <ChipView key={p} look={kit.chip} mode={mode} variant={look.presets.variant} size={look.presets.size} state={presetBlocked(p) ? 'disabled' : 'enabled'} selected={p === preset} label={presetLabel(p)} />
          ))}
        </ChipGroupView>
      )}
    </div>
  ) : null;

  const navBtn = (dir: -1 | 1, disabled: boolean) => (
    <ButtonView
      look={kit.nav}
      mode={mode}
      icon={dir < 0 ? 'chevron-left' : 'chevron-right'}
      ariaLabel={dir < 0 ? '이전 달' : '다음 달'}
      state={!live ? (disabled ? 'disabled' : 'enabled') : disabled ? 'disabled' : 'live'}
      onClick={() => go(dir)}
    />
  );
  const prevOff = wheel || mkey(view) <= firstAllowed;
  const nextOff = wheel || mkey(visibleMonths[visibleMonths.length - 1]) >= lastAllowed;
  const live2 = (
    <div aria-live="polite" aria-atomic="true" style={HIDDEN}>
      {announce}
    </div>
  );
  const rootStyle: CSSProperties = { position: 'relative', boxSizing: 'border-box', background: dcv(look.bg, mode), ...marks?.root };

  // ── 두 달 ──
  if (visibleRange === 'twoMonths') {
    const t = look.twoMonths;
    return (
      <div ref={rootRef} role={live ? 'group' : undefined} aria-label={live ? ariaLabel : undefined} aria-hidden={live ? undefined : true} style={{ ...rootStyle, width: width ?? t.width }}>
        {presetRow}
        <div style={{ position: 'relative', height: look.header.height, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: t.gap, ...marks?.header }}>
          {visibleMonths.map((mo, i) => (
            <span key={i} id={`${uid}-m${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...textOf(look.monthLabel.text), color: dcv(look.monthLabel.color, mode), ...marks?.monthLabel }}>
              {monthTitle(mo)}
            </span>
          ))}
          <span style={{ position: 'absolute', left: 0, top: t.navTop, display: 'flex', ...marks?.nav }}>{navBtn(-1, prevOff)}</span>
          <span style={{ position: 'absolute', right: 0, top: t.navTop, display: 'flex', ...marks?.nav }}>{navBtn(1, nextOff)}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: t.gap }}>
          {visibleMonths.map((mo, i) => (
            <div key={mkey(mo)}>{grid(mo, 'six', true, `${uid}-m${i}`)}</div>
          ))}
        </div>
        {live && live2}
        {decor}
      </div>
    );
  }

  // ── 이어지는 달 ──
  if (visibleRange === 'continuous') {
    const shift = live && hydrated ? 0 : initialOffset;
    return (
      <div
        ref={rootRef}
        role={live ? 'group' : undefined}
        aria-label={live ? ariaLabel : undefined}
        aria-hidden={live ? undefined : true}
        style={{ ...rootStyle, width: width ?? '100%', display: 'flex', flexDirection: 'column', height: fill ? undefined : height, flex: fill ? '1 1 0' : undefined, minHeight: 0 }}
      >
        {presetRow && <div style={{ flex: 'none' }}>{presetRow}</div>}
        <div style={{ position: 'relative', flex: '1 1 0', minHeight: 0 }}>
          <div
            ref={scroller}
            tabIndex={-1}
            className="pdp-noscroll"
            onScroll={live ? onScroll : undefined}
            style={{ height: '100%', overflowY: live && hydrated ? 'auto' : 'hidden', overscrollBehavior: 'contain', scrollbarWidth: 'none', scrollPaddingTop: look.weekday.height, outline: 'none' }}
          >
            <WeekdayRow look={look} mode={mode} live={live} decorative style={{ position: 'sticky', top: 0, zIndex: 1, background: dcv(look.bg, mode), ...marks?.weekday }} />
            <div style={{ marginTop: shift ? -shift : undefined }}>
              {months.map((mo, i) => (
                <section key={mkey(mo)} style={{ paddingBottom: look.monthLabel.gapBelow }}>
                  <div id={`${uid}-c${i}`} style={{ height: look.monthLabel.height, display: 'flex', alignItems: 'center', paddingLeft: look.monthLabel.padX, paddingRight: look.monthLabel.padX, ...textOf(look.monthLabel.text), color: dcv(look.monthLabel.color, mode), ...marks?.monthLabel }}>
                    {monthTitle(mo)}
                  </div>
                  {grid(mo, 'natural', false, `${uid}-c${i}`)}
                </section>
              ))}
            </div>
          </div>
          <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: look.fog.height, background: `linear-gradient(to bottom, transparent, ${dcv(look.bg, mode)})`, pointerEvents: 'none', ...marks?.fog }} />
        </div>
        {live && live2}
        {decor}
      </div>
    );
  }

  // ── 한 달 ──
  const wl = kit.wheel;
  const wheelBlock = look.wheel;
  const wheelPad = (wheelBlock.height - wl.sizes[wheelBlock.size].item * wheelBlock.visible) / 2;
  const titleText = (
    <>
      <span id={`${uid}-t`}>{monthTitle(view)}</span>
      <ChevronDown
        aria-hidden
        size={look.title.icon}
        strokeWidth={2}
        style={{ flexShrink: 0, color: dcv(look.title.iconColor, mode), transform: wheel ? `rotate(${look.motion.chevronTurn}deg)` : 'rotate(0deg)', transition: reduce ? undefined : `transform ${look.motion.chevron.duration} ${look.motion.chevron.easing}` }}
      />
    </>
  );
  const titleStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: look.title.gap,
    height: look.header.height,
    paddingLeft: look.title.padX,
    paddingRight: look.title.padX,
    margin: 0,
    border: 0,
    borderRadius: look.title.radius,
    background: 'transparent',
    ...textOf(look.title.text),
    color: dcv(look.title.color, mode),
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ...marks?.title,
  };
  return (
    <div ref={rootRef} role={live ? 'group' : undefined} aria-label={live ? ariaLabel : undefined} aria-hidden={live ? undefined : true} style={{ ...rootStyle, width: width ?? look.width }}>
      {presetRow}
      {!bare && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: look.header.height, ...marks?.header }}>
        {live ? (
          <TitleButton style={titleStyle} ring={look.ring} mode={mode} expanded={wheel} controls={`${uid}-w`} onClick={toggleWheel}>
            {titleText}
          </TitleButton>
        ) : (
          <span style={titleStyle}>{titleText}</span>
        )}
        <span style={{ display: 'flex', ...marks?.nav }}>
          {navBtn(-1, prevOff)}
          {navBtn(1, nextOff)}
        </span>
      </div>}
      {wheel ? (
        <div id={`${uid}-w`} style={{ height: wheelBlock.height, paddingTop: wheelPad, boxSizing: 'border-box', background: dcv(wheelBlock.bg, mode), ...marks?.wheel }}>
          <WheelView
            look={wl}
            mode={mode}
            size={wheelBlock.size}
            visible={wheelBlock.visible}
            live={live}
            ariaLabel={monthTitle(wheelDraft)}
            columns={monthYearColumns({
              y: wheelDraft.y,
              m: wheelDraft.m,
              from: years[0],
              to: years[1],
              onYear: (y) => setWheelDraft((d) => ({ ...d, y })),
              onMonth: (m) => setWheelDraft((d) => ({ ...d, m })),
              at: wheelAt,
              // date-picker.yaml wheel.columns — 연 120(오른쪽) · 월 96(왼쪽)
              widths: { year: wheelBlock.columns.year.width, month: wheelBlock.columns.month.width },
            })}
          />
        </div>
      ) : (
        grid(view, 'six', true, `${uid}-t`)
      )}
      {live && live2}
      {decor}
    </div>
  );
}

// 제목 버튼 — 바탕 없이 초점 링(모서리 8)만
function TitleButton({ style, ring, mode, expanded, controls, onClick, children }: { style: CSSProperties; ring: DateLook['ring']; mode: ViewMode; expanded: boolean; controls: string; onClick: () => void; children: ReactNode }) {
  const [focus, setFocus] = useState(false);
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      onFocus={(e) => setFocus(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocus(false)}
      style={{ ...style, outline: focus ? `${ring.width}px solid ${dcv(ring.color, mode)}` : 'none', outlineOffset: ring.offset }}
    >
      {children}
    </button>
  );
}

