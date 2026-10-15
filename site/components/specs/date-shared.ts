// Date Picker · Time Picker · Wheel Picker 의 모양과 날짜 계산 — 서버(date-look) · 브라우저(date-view · 데모 · 플레이그라운드)가 함께 쓴다.
// 파일 읽기(서버 전용)를 들이지 않는다. 날짜는 시간대 없는 { y, m, d }(m 은 1 ~ 12)로 다루고, 계산은 UTC 로 한다(기기 시간대와 무관하게).
import type { ButtonLook } from './button-look';
import type { ChipLook } from './chip-shared';

export type ViewMode = 'light' | 'dark' | 'auto';
export type Brand = 'desk' | 'hr';

// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type DColor = { name?: string; light: string; dark: string };
export type DType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type DMotion = { duration: string; easing: string };
export type DRing = { width: number; offset: number; color: DColor };

export const dcv = (c: DColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);

// ── Date Picker(date-picker.yaml) ─────────────────────────
export const DP_SELECTIONS = ['single', 'range', 'multiple'] as const;
export type DpSelection = (typeof DP_SELECTIONS)[number];
export const DP_RANGES = ['month', 'twoMonths', 'continuous'] as const;
export type DpVisibleRange = (typeof DP_RANGES)[number];
export const DP_STATES = ['enabled', 'hovered', 'pressed', 'focused', 'today', 'selected', 'inRange', 'outside', 'disabled', 'readOnly'] as const;
export type DpState = (typeof DP_STATES)[number];

// 날짜 한 칸의 상태별 모양 — 원 바탕 · 숫자 색 · 굵기 · 취소선 · 커서. set 은 그 상태가 YAML 에 직접 적은 속성(겹칠 때 그것만 덮는다)
export type DpProp = 'bg' | 'fg' | 'weight' | 'strike' | 'cursor';
export type DpFace = { bg: DColor | null; fg: DColor; weight: number | string; strike: boolean; cursor: string; set: DpProp[] };

export type DateLook = {
  // 팝오버의 달력 폭(칸 48 × 7) · 시트는 시트 폭 − 좌우 여백
  width: number;
  sheetPadX: number;
  bg: DColor;
  header: { height: number };
  title: { text: DType; color: DColor; padX: number; gap: number; radius: number; icon: number; iconColor: DColor };
  nav: { size: number; icon: number; color: DColor; target: number };
  weekday: { height: number; text: DType; color: DColor };
  cell: { height: number; weeks: number };
  // 원 — 칸 위 top, 칸이 shrinkBelow 보다 좁으면 칸 폭 − shrinkBy
  day: { size: number; top: number; shrinkBelow: number; shrinkBy: number; text: DType };
  faces: Record<DpState, DpFace>;
  // 오늘(옅은 원) · 기간 사이 날(띠) 위의 호버 · 누름 — 한 단계 짙은 색(옅은 원 · 띠와 같은 색이면 안 보인다)
  pressOnWeak: DColor;
  band: { height: number; color: DColor };
  monthLabel: { height: number; text: DType; color: DColor; padX: number; gapBelow: number };
  // 연 · 월 휠 — 요일 줄 + 6주 자리(높이)에 Wheel Picker 를 가운데. 칼럼은 연 · 월 폭이 정해져 있다(연 오른쪽 · 월 왼쪽 정렬)
  wheel: { height: number; visible: number; size: 'small' | 'medium'; bg: DColor; columns: { year: { width: number; align: 'right' }; month: { width: number; align: 'left' } } };
  twoMonths: { width: number; gap: number; navTop: number };
  fog: { height: number };
  presets: { gap: number; padBottom: number; variant: 'outlineStrong'; size: 'medium'; height: number };
  // 팝오버 바닥 — 달력 아래 여백
  footer: { padTop: number };
  ring: DRing;
  motion: { bg: DMotion; chevron: DMotion; chevronTurn: number };
};

// ── Wheel Picker(wheel-picker.yaml) ───────────────────────
export const WP_SIZES = ['small', 'medium'] as const;
export type WpSize = (typeof WP_SIZES)[number];
export type WheelLook = {
  defaults: { size: WpSize; visible: number };
  visibleItems: number[];
  sizes: Record<WpSize, { item: number; text: DType }>;
  bg: DColor;
  item: { padX: number; weight: number | string; color: DColor; selected: DColor; disabledSelected: DColor; numerals: string };
  band: { insetX: number; radius: number; color: DColor };
  // 안개 높이 = min(휠 높이 × ratio, 항목 maxItems 칸) · 마스크 단계(gradient-fade-mask 의 알파 · 자리)
  fog: { ratio: number; maxItems: number; stops: { alpha: number; at: number }[] };
  ring: DRing & { radius: number };
  // wheel-picker.md Behavior · motion — 끌기 문턱 · 정착 시간
  motion: { dragThreshold: number; move: number; releaseMin: number; releaseMax: number; perItem: number; maxItems: number; wheelIdle: number; wheelAlign: number; staleVelocity: number };
};

// ── Time Picker(time-picker.yaml) ─────────────────────────
export type TpColumnKey = 'period' | 'hour' | 'minute';
export type TimeLook = {
  height: number;
  // 날짜 칸 옆 시각 칸의 폭(time-picker.md "날짜와 함께" — large 에서 "오후 12:30" 이 잘리지 않는 폭)
  fieldWidth: number;
  visible: number;
  size: WpSize;
  steps: number[];
  defaultStep: number;
  columns: Record<TpColumnKey, { align: 'left' | 'center' | 'right'; loop: boolean; name: string }>;
};

// 서버에서 풀어 브라우저 그림으로 넘기는 한 벌
export type DateKit = {
  brand: Brand;
  date: DateLook;
  wheel: WheelLook;
  time: TimeLook;
  chip: ChipLook;
  // 이전 · 다음 — Button ghost iconOnly medium
  nav: ButtonLook;
};

// 안개 높이(소수점 그대로 — 7칸 123.2)
export const fogHeight = (w: WheelLook, size: WpSize, visible: number) => Math.min(w.sizes[size].item * visible * w.fog.ratio, w.sizes[size].item * w.fog.maxItems);

// 위아래 안개 마스크 — gradient-fade-mask 의 단계를 위(투명 → 불투명)와 아래(불투명 → 투명)에 둔다
export function fogMask(w: WheelLook, height: number, fog: number) {
  const top = w.fog.stops.map((s) => `rgba(0,0,0,${s.alpha}) ${(fog * s.at) / 100}px`);
  const bottom = [...w.fog.stops].reverse().map((s) => `rgba(0,0,0,${s.alpha}) ${height - (fog * s.at) / 100}px`);
  return `linear-gradient(to bottom, ${[...top, ...bottom].join(', ')})`;
}

// ── 날짜 계산 ─────────────────────────────────────────────
export type Day = { y: number; m: number; d: number };
export type Month = { y: number; m: number };
export type RangeValue = { start?: Day; end?: Day };
export type DateValue = Day | RangeValue | Day[] | undefined;

export const TODAY: Day = { y: 2026, m: 10, d: 2 };
export const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
export const WEEK_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

export const dkey = (a: Day) => a.y * 10000 + a.m * 100 + a.d;
export const sameDay = (a?: Day, b?: Day) => !!a && !!b && dkey(a) === dkey(b);
export const cmpDay = (a: Day, b: Day) => dkey(a) - dkey(b);
const utc = (a: Day) => Date.UTC(a.y, a.m - 1, a.d);
const fromUtc = (t: number): Day => {
  const x = new Date(t);
  return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate() };
};
export const addDays = (a: Day, n: number) => fromUtc(utc(a) + n * 86400000);
export const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const weekdayOf = (a: Day) => new Date(utc(a)).getUTCDay();
export const mkey = (a: Month) => a.y * 12 + (a.m - 1);
export const fromMkey = (k: number): Month => ({ y: Math.floor(k / 12), m: (k - Math.floor(k / 12) * 12) + 1 });
export const addMonth = (a: Month, n: number) => fromMkey(mkey(a) + n);
export const monthOf = (a: Day): Month => ({ y: a.y, m: a.m });
// 한 달 · 한 해 옮기기 — 같은 날, 없으면 말일
export function addMonthsClamp(a: Day, n: number): Day {
  const mo = addMonth(monthOf(a), n);
  return { ...mo, d: Math.min(a.d, daysIn(mo.y, mo.m)) };
}
export const startOfWeek = (a: Day) => addDays(a, -weekdayOf(a));
export const endOfWeek = (a: Day) => addDays(a, 6 - weekdayOf(a));
export const daysBetween = (a: Day, b: Day) => Math.round((utc(b) - utc(a)) / 86400000);

// 한 달의 칸 — 주마다 7칸, 일요일 시작. six 면 늘 6주(앞뒤 달 날짜로 채운다), natural 이면 그 달의 주 수(앞뒤는 빈 칸)
export type GridCell = { day: Day; outside: boolean } | null;
export function monthGrid(mo: Month, weeks: 'six' | 'natural'): GridCell[][] {
  const first = { ...mo, d: 1 };
  const lead = weekdayOf(first);
  const n = daysIn(mo.y, mo.m);
  const rows = weeks === 'six' ? 6 : Math.ceil((lead + n) / 7);
  const out: GridCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < 7; c++) {
      const day = addDays(first, r * 7 + c - lead);
      const outside = day.m !== mo.m || day.y !== mo.y;
      row.push(outside && weeks === 'natural' ? null : { day, outside });
    }
    out.push(row);
  }
  return out;
}

// ── 글(International Design v106 — date-picker.md 의 "글") ────
export const monthTitle = (a: Month) => `${a.y}년 ${a.m}월`;
// 달만 고른 칸 값 — "2026년 10월"
export const monthValue = monthTitle;
// 읽는 이름 — "2026년 10월 15일 목요일"
export const dayName = (a: Day) => `${a.y}년 ${a.m}월 ${a.d}일 ${WEEK_NAMES[weekdayOf(a)]}`;
// 칸 값 — 올해는 "10월 15일 (목)", 다른 해는 "2027년 1월 3일 (일)"
export const formatDay = (a: Day, today: Day = TODAY) => `${a.y === today.y ? '' : `${a.y}년 `}${a.m}월 ${a.d}일 (${WEEK[weekdayOf(a)]})`;
// 기간 — "10월 1일~10월 31일"(물결표를 앞뒤에 붙여 쓴다 — International Design), 다른 해가 섞이면 양쪽에 연도
export function formatRange(r: { start: Day; end: Day }, today: Day = TODAY) {
  const year = r.start.y !== today.y || r.end.y !== today.y;
  const f = (a: Day) => `${year ? `${a.y}년 ` : ''}${a.m}월 ${a.d}일`;
  return `${f(r.start)}~${f(r.end)}`;
}
// 여러 날 — 스펙에 칸 표기가 없어 Select 의 여럿 고른 값 표기("첫 값 외 N개")를 따른다
export const formatDays = (days: Day[], today: Day = TODAY) => (days.length <= 1 ? (days[0] ? formatDay(days[0], today) : '') : `${formatDay(days[0], today)} 외 ${days.length - 1}개`);

// 칸에 넣을 글 — 고르기에 따라. 기간은 끝까지 골라야 글이 된다
export function formatValue(sel: DpSelection, v: DateValue, today: Day = TODAY): string | undefined {
  if (!v) return undefined;
  if (sel === 'single') return formatDay(v as Day, today);
  if (sel === 'range') {
    const r = v as RangeValue;
    return r.start && r.end ? formatRange({ start: r.start, end: r.end }, today) : undefined;
  }
  const days = v as Day[];
  return days.length ? formatDays(days, today) : undefined;
}
// "완료" 를 눌러도 되는지 — 하루는 고른 뒤, 기간은 끝을 고른 뒤
export function isComplete(sel: DpSelection, v: DateValue) {
  if (!v) return false;
  if (sel === 'single') return true;
  if (sel === 'range') return !!(v as RangeValue).start && !!(v as RangeValue).end;
  return (v as Day[]).length > 0;
}

// ── 빠른 기간(date-picker.md "빠른 기간" — 달력 단위, 주는 일요일부터) ──────
export const PRESETS = [
  ['thisWeek', '이번 주'],
  ['thisMonth', '이번 달'],
  ['lastMonth', '지난 달'],
  ['last7Days', '최근 7일'],
  ['last30Days', '최근 30일'],
  ['last3Months', '최근 3개월'],
  ['last6Months', '최근 6개월'],
  ['last1Year', '최근 1년'],
  ['thisYear', '올해'],
] as const;
export type PresetName = (typeof PRESETS)[number][0];
export const presetLabel = (p: PresetName) => PRESETS.find(([n]) => n === p)![1];
export function presetRange(p: PresetName, today: Day = TODAY): { start: Day; end: Day } {
  const mo = monthOf(today);
  const monthStart = (a: Month) => ({ ...a, d: 1 });
  const monthEnd = (a: Month) => ({ ...a, d: daysIn(a.y, a.m) });
  // 이번 달을 넣은 n 달 — n − 1 달 전 1일 ~ 이번 달 말일
  const months = (n: number) => ({ start: monthStart(addMonth(mo, -(n - 1))), end: monthEnd(mo) });
  switch (p) {
    case 'thisWeek':
      return { start: startOfWeek(today), end: endOfWeek(today) };
    case 'thisMonth':
      return { start: monthStart(mo), end: monthEnd(mo) };
    case 'lastMonth':
      return { start: monthStart(addMonth(mo, -1)), end: monthEnd(addMonth(mo, -1)) };
    case 'last7Days':
      return { start: addDays(today, -6), end: today };
    case 'last30Days':
      return { start: addDays(today, -29), end: today };
    case 'last3Months':
      return months(3);
    case 'last6Months':
      return months(6);
    case 'last1Year':
      return months(12);
    case 'thisYear':
      return { start: { y: today.y, m: 1, d: 1 }, end: { y: today.y, m: 12, d: 31 } };
  }
}

// ── 시각(time-picker.md — 화면은 12시간, 값은 24시간) ────────
export type Time = { hour: number; minute: number };
export const formatTime = (t: Time) => `${t.hour < 12 ? '오전' : '오후'} ${((t.hour + 11) % 12) + 1}:${String(t.minute).padStart(2, '0')}`;
// 분 간격에 맞춰 반올림 — 시각 전체로(23:59 · 5분 → 0:00)
export function roundToStep(t: Time, step: number): Time {
  const total = (Math.round((t.hour * 60 + t.minute) / step) * step) % 1440;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}
export const minuteOptions = (step: number) => Array.from({ length: 60 / step }, (_, i) => i * step);
