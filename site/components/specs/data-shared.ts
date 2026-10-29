// 데이터 표시 묶음(Table · Card · Chart · Searchable List · Swipe Actions)의 모양 — 서버(data-look)와 브라우저(data-*-view · 플레이그라운드)가
// 함께 쓰는 상수 · 타입 · 규칙 함수. 파일 읽기(서버 전용)를 들이지 않는다.
// 규칙 함수(차트 색 배정 · 돈 · 축 글자 · 열지도 단계 · 정렬 차례)는 스펙 md 의 "코드" 절과 같은 답을 낸다 — 경계 값은 look 이 YAML 에서 읽어 넘긴다.
import type { ButtonLook } from './button-look';
import type { CheckLook } from './checkbox-shared';
import type { AvatarLook, AvatarSize, BadgeLook, DColor, DType, ViewMode } from './display-shared';
import { dcv } from './display-shared';
import type { ResultSectionLook } from './feedback-shared';
import type { ImageFrameLook, LogoTileLook, LtSize } from './image-shared';
import type { ListLook } from './list-shared';
import type { SkeletonLook } from './loading-shared';
import type { RadioLook } from './radio-group-shared';
import type { TfInputLook } from './text-field-shared';

export { dcv, type DColor, type DType, type ViewMode };
export const FONT = "'Pretendard Variable', Pretendard, sans-serif";

// 모드마다 다른 토큰을 쓰는 색(순자산 카드의 끝 색 — 라이트 brand-900 · 다크 brand-300-dark, 열지도의 짙은 칸 글자 — 라이트 흰 · 다크 fg-neutral).
// 사이트 모드를 따를 때는 .pdat(global.css)가 -l · -d 를 고른다 — 변수 이름은 split 의 두 토큰
export type SplitColor = DColor & { split?: [string, string] };
export type DMotion = { duration: string; easing: string };
// 누름 — Motion 의 눌림 피드백(2px 거리 · 기준 길이 max(높이, 폭 ÷ n, 최소))
export type DPress = { distance: number; widthDivisor: number; minBasis: number; motion: DMotion };
export type DRing = { width: number; offset: number; color: DColor };
export type DShadow = { name: string; light: string; dark: string };

export const pressRatio = (p: Pick<DPress, 'distance' | 'widthDivisor' | 'minBasis'>, w: number, h: number) => {
  const basis = Math.max(h, w / p.widthDivisor, p.minBasis);
  return (basis - p.distance) / basis;
};
// 색 값 하나 — 모드를 정하면 그 값, 사이트를 따르면 CSS 변수(split 이면 .pdat 가 고르는 --pd-<slot>)
export function sv(c: SplitColor, mode: ViewMode, slot = 's'): string {
  if (c.split && mode === 'auto') return `var(--pd-${slot})`;
  return dcv(c, mode);
}
// split 색을 쓰는 요소에 붙이는 변수 — 한 요소에 둘까지(s · t)
export function splitVars(mode: ViewMode, pairs: { slot?: 's' | 't'; c: SplitColor }[]): { className?: string; 'data-mode'?: string; style: Record<string, string> } {
  const style: Record<string, string> = {};
  let any = false;
  for (const { slot = 's', c } of pairs) {
    if (!c.split || mode !== 'auto') continue;
    any = true;
    style[`--pd-${slot}-l`] = `var(--p-${c.split[0]})`;
    style[`--pd-${slot}-d`] = `var(--p-${c.split[1]})`;
  }
  return any ? { className: 'pdat', 'data-mode': 'auto', style } : { style };
}
export const shadowOf = (s: DShadow, mode: ViewMode) => (mode === 'auto' ? `var(--p-${s.name})` : mode === 'dark' ? s.dark : s.light);

// ── 돈 · 숫자(International Design) ─────────────────────────
// 빼기는 U+2212 하나 — 돈은 줄이지 않고 원까지
export const MINUS = '−';
export const comma = (n: number) => Math.round(Math.abs(n)).toLocaleString('ko-KR');
export const formatWon = (n: number) => `${n < 0 ? MINUS : ''}${comma(n)}원`;
// 축 눈금 — 만 · 억 · 조, 소수 한 자리, .0 은 버린다(1만 미만은 쉼표 정수). 레시피 formatAxisWon 과 같은 답
export function formatAxisWon(v: number): string {
  const sign = v < 0 ? MINUS : '';
  const n = Math.abs(v);
  if (n < 10000) return `${sign}${comma(n)}`;
  let scaled = n / 10000;
  let unit = '만';
  for (const bigger of ['억', '조']) {
    if (Math.round(scaled * 10) / 10 < 10000) break;
    scaled /= 10000;
    unit = bigger;
  }
  const r = Math.round(scaled * 10) / 10;
  const s = r.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  return `${sign}${s}${unit}`;
}
// 날짜 — "10월 8일 (목)"(International Design 의 요일 형식)
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
export const DOW_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
export function formatDay(y: number, m: number, d: number) {
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${m}월 ${d}일 (${DOW[w]})`;
}

// 글자 폭(어림) — 숫자 · 쉼표 · 한글 · 빼기. 축 글자 상자를 잘리지 않게 잡는 데 쓴다
export function textWidth(s: string, size: number) {
  let w = 0;
  for (const ch of s) {
    if (/[0-9]/.test(ch)) w += 0.6;
    else if (ch === ',' || ch === '.') w += 0.28;
    else if (ch === '−' || ch === '-') w += 0.62;
    else if (/[가-힣]/.test(ch)) w += 0.98;
    else if (ch === ' ') w += 0.27;
    else w += 0.6;
  }
  return Math.ceil(w * size);
}

// 눈금 — 0 부터 넷으로 나눈 보기 좋은 값(1 · 2 · 2.5 · 5 × 10^k). 음수가 있으면 아래로도
export function niceTicks(min: number, max: number, steps = 4) {
  const span = Math.max(Math.abs(max), Math.abs(min), 1);
  const raw = (max - Math.min(0, min)) / steps || span / steps;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? 10 * p;
  const lo = Math.min(0, Math.floor(min / step) * step);
  const hi = Math.max(0, Math.ceil(max / step) * step);
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(Math.round(v));
  return out;
}

// ══ Table ══════════════════════════════════════════════════
export const TABLE_ROWS = ['text', 'rich'] as const;
export type TableRowKind = (typeof TABLE_ROWS)[number];
export const TABLE_ALIGNS = ['start', 'end'] as const;
export type TableAlign = (typeof TABLE_ALIGNS)[number];
export type SortDir = 'ascending' | 'descending';
export type SortState = 'none' | 'sortable' | SortDir;
export const TABLE_STATES = ['enabled', 'hovered', 'pressed', 'focused'] as const;
export type TableState = (typeof TABLE_STATES)[number];

// 두 단계 정렬 — 그 열이 지금 정렬된 열이면 반대로, 아니면 그 열의 처음 방향(숫자 · 날짜 열 내림, 글 열 오름)
export function nextSort(current: SortDir | 'none', first: SortDir): SortDir {
  if (current === 'none') return first;
  return current === 'ascending' ? 'descending' : 'ascending';
}

export type TableLook = {
  // 표 · List 줄이 갈리는 폭(width 축 "768 이상") · ⋮ 가 Menu · Menu Sheet 로 갈리는 폭
  breakpoint: number;
  menuBreakpoint: number;
  // 첫 칸 앞 · 끝 칸 뒤 — 카드 여백과 같다
  edge: number;
  head: { minH: number; padY: number; padX: number; type: DType; fg: DColor; line: DColor; lineW: number; stickyBg: DColor; z: number };
  row: { minH: Record<TableRowKind, number>; line: DColor; lineW: number; hoverBg: DColor; pressBg: DColor; motion: DMotion };
  cell: { padY: number; padX: number; type: DType; fg: DColor };
  detail: { type: DType; fg: DColor; gap: number };
  thumb: { size: number; gap: number; avatar: AvatarSize; logo: LtSize };
  // 등락률 칸 — 증감 표기(▲ fg-critical · ▼ fg-informative · 그대로 fg-neutral-subtle)
  delta: Record<DeltaDir, DColor>;
  sort: { gap: number; icon: number; muted: DColor; strong: DColor; bg: DColor; touchH: number };
  check: { look: CheckLook; size: number; touch: number; colW: number };
  more: { look: ButtonLook; size: number; touch: number; colW: number };
  bulk: { minH: number; padL: number; padR: number; radius: number; bg: DColor; gap: number; marginBottom: number; text: DType; fg: DColor; action: ButtonLook; clear: ButtonLook };
  ring: DRing;
  badge: BadgeLook;
  avatar: AvatarLook;
  list: ListLook;
  sk: SkeletonLook;
  result: ResultSectionLook;
  logo: LogoTileLook;
  frame: ImageFrameLook;
  // 768 미만 List 줄의 오른쪽 숫자 — t5 · 고정폭 숫자(table.yaml width narrow)
  narrowValue: DType;
};

// ══ Card ═══════════════════════════════════════════════════
export const CARD_PRESSES = ['none', 'whole', 'peers'] as const;
export type CardPress = (typeof CARD_PRESSES)[number];
export const CARD_STATS = ['large', 'small'] as const;
export type CardStatSize = (typeof CARD_STATS)[number];
export const DELTAS = ['up', 'down', 'flat'] as const;
export type DeltaDir = (typeof DELTAS)[number];
export const CARD_STATES = ['enabled', 'hovered', 'pressed', 'focused'] as const;
export type CardState = (typeof CARD_STATES)[number];

export type CardLook = {
  // 카드를 놓는 바닥 — bg-layer-basement
  floor: DColor;
  surface: { bg: DColor; border: DColor; borderW: number; radius: number; pad: number; gap: number; pressBg: DColor };
  // 데스크톱 격자 칸 사이(layout-gutter)
  gutter: number;
  header: { gap: number; padBottom: number; list: { top: number; x: number; bottom: number } };
  title: DType & { fg: DColor };
  action: { h: number; padL: number; padR: number; radius: number; type: DType; fg: DColor; touch: number; bg: DColor; press: DPress };
  content: { gap: number };
  list: { itemRadius: number; padBottom: number; look: ListLook };
  // 카드 안 아코디언(body accordion) — 아래 여백 · 머리 여백(트리거가 제 좌우 24 · 위아래 16 을 가진다)
  accordion: { padBottom: number; header: { top: number; x: number; bottom: number } };
  stat: {
    label: DType & { fg: DColor };
    value: { weight: number; fg: DColor; marginTop: number; sizes: Record<CardStatSize, DType> };
    delta: { type: DType; marginTop: number; colors: Record<DeltaDir, DColor> };
    deltaText: DType & { fg: DColor; gap: number };
  };
  hero: {
    start: DColor;
    end: SplitColor;
    angle: number;
    glow: { size: number; right: number; top: number; color: string; stop: number };
    fg: DColor;
    pad: number;
    radius: number;
    label: DType;
    amount: DType & { marginTop: number };
    detail: DType & { marginTop: number };
  };
  press: DPress;
  ring: DRing;
};

// ══ Chart ══════════════════════════════════════════════════
export const CHART_HUES = ['blue', 'green', 'orange', 'violet', 'pink', 'indigo', 'red', 'yellow', 'brown', 'gray'] as const;
export type ChartHue = (typeof CHART_HUES)[number];
export const CHART_KINDS = ['line', 'bar', 'donut', 'heatmap'] as const;
export type ChartKind = (typeof CHART_KINDS)[number];

// 열지도 칸 글자색 — 단계마다 라이트 · 다크(값은 토큰 이름)
export type HeatFg = { light: string; dark: string };
export type ChartLook = {
  // 배정 순서(palette 축 차례 — 회색은 "기타" 전용이라 끝)
  order: ChartHue[];
  series: Record<ChartHue, DColor>;
  subtle: Record<ChartHue, DColor>;
  tick: { type: DType; fg: DColor };
  grid: { width: number; dash: number[]; color: DColor };
  line: { width: number; areaFrom: number; areaTo: number };
  bar: { maxW: number; radius: number; gap: number };
  // 두께 = 지름 × perDiameter + offset 을 정수로(chart.yaml series — Q-012-5 C). thickness · phone.thickness 는 그 식으로 푼 값
  donut: { perDiameter: number; offset: number; thickness: number; diameter: number; phone: { diameter: number; thickness: number }; center: DType & { fg: DColor }; label: DType & { fg: DColor } };
  point: { size: number; ring: number; ringColor: DColor };
  crosshair: { width: number; color: DColor; dash: number[] };
  tooltip: { minW: number; padY: number; padX: number; radius: number; bg: DColor; shadow: DShadow; gap: number; z: number; head: DType & { fg: DColor }; row: DType & { fg: DColor; gap: number; minGap: number; valueFg: DColor; valueWeight: number }; swatch: { size: number; radius: number } };
  tile: { radius: number; padY: number; padX: number; gap: number; name: DType & { fg: DColor }; total: DType & { fg: DColor }; dot: number; dotGap: number; totalGap: number; hiddenBg: DColor; hiddenBorder: DColor; hiddenBorderW: number; hoverBg: DColor; press: DPress; color: DMotion; lockedCursor: string };
  // 누름 · 호버 바탕은 List 규칙 — 좌우 들임(list.yaml background.insetX) · 카드 안 동심 모서리(card.yaml list.itemRadius)
  // bleed — 카드 본문 안의 범례가 카드 여백(24)만큼 양옆으로 나가 줄이 가장자리까지 간다(List 줄처럼 줄이 제 24 를 가진다)
  legendList: { minH: number; type: DType; gap: number; swatch: number; fg: DColor; sub: DColor; hoverBg: DColor; bgInsetX: number; bgRadius: number; bleed: number };
  heat: {
    radius: number;
    gap: number;
    labelCol: number;
    steps: number[];
    cuts: number[];
    stepBg: { base: DColor; over: DColor };
    empty: DColor;
    emptyFg: DColor;
    threshold: number;
    value: DType;
    fg: { desk: HeatFg[]; hr: HeatFg[] };
    head: DType & { fg: DColor };
    name: DType & { fg: DColor };
    time: DType & { fg: DColor };
    // 2026-10-08 화면 폭 → 칸 폭(실측)
    widths: [number, number][];
  };
  ring: DRing;
  motion: { draw: DMotion; color: DMotion };
  // 카드 면(열지도 칸을 섞는 바탕 · 가리킨 점의 테두리)
  surface: DColor;
};

// 색을 배정한다 — 저장된 색 먼저, 나머지는 그 차트에서 아직 쓰지 않은 색부터 배정 순서로. 10개를 넘으면 상위 9 + 회색 "기타"(레시피 assignChartColors)
export type ColorItem = { key: string; label: string; amount: number; saved?: ChartHue };
export type ColoredItem = ColorItem & { color: ChartHue; other?: boolean };
export function assignChartColors(items: ColorItem[], order: readonly ChartHue[] = CHART_HUES): ColoredItem[] {
  const sorted = [...items].sort((a, b) => b.amount - a.amount);
  const top = sorted.length > 10 ? sorted.slice(0, 9) : sorted;
  const rest = sorted.length > 10 ? sorted.slice(9) : [];
  const used = new Set<ChartHue>(top.flatMap((i) => (i.saved && i.saved !== 'gray' ? [i.saved] : [])));
  const free = order.filter((h) => h !== 'gray' && !used.has(h));
  let k = 0;
  const out: ColoredItem[] = top.map((i) => ({ ...i, color: i.saved && i.saved !== 'gray' ? i.saved : (free[k++] ?? 'gray') }));
  if (rest.length) out.push({ key: 'other', label: '기타', amount: rest.reduce((s, i) => s + i.amount, 0), color: 'gray', other: true });
  return out;
}
// 열지도 단계 — 가장 큰 칸 값의 cuts% 에서 끊는다(0 이면 빈 칸 -1)
export function heatStep(v: number, max: number, cuts: number[]) {
  if (v <= 0 || max <= 0) return -1;
  const r = (v / max) * 100;
  const i = cuts.findIndex((c) => r < c);
  return i === -1 ? cuts.length : i;
}

// ══ Searchable List ════════════════════════════════════════
export const SEARCH_SIZES = ['large', 'medium'] as const;
export type SearchSize = (typeof SEARCH_SIZES)[number];
export type SearchPlacement = 'sheet' | 'inline';
export type SearchPrefix = 'none' | 'logo' | 'cardArt' | 'avatar';
export type SearchLook = {
  gap: number;
  // 1280 미만 large · 이상 medium(웹)
  breakpoint: number;
  field: { look: TfInputLook; marginX: number; heights: Record<SearchSize, number> };
  // 줄 — 위아래 · 좌우 · 최소 높이(라디오가 없는 줄도 48 — selectionMark off)
  option: { padY: number; padX: number; minHeight: number };
  title: DType & { fg: DColor };
  detail: DType & { fg: DColor };
  highlight: { insetX: number; radius: number; bg: DColor };
  prefix: { logo: LtSize; cardArt: number; avatar: { one: AvatarSize; two: AvatarSize } };
  radio: RadioLook;
  radioSize: number;
  debounce: number;
  skeletonRows: number;
  list: ListLook;
  sk: SkeletonLook;
  result: ResultSectionLook;
  logo: LogoTileLook;
  frame: ImageFrameLook;
  avatar: AvatarLook;
  badge: BadgeLook;
  // 강조를 화살표로 옮길 때는 전환 없이, 마우스로 올리면 색 전환
  color: DMotion;
  press: DPress;
};

// ══ Swipe Actions ══════════════════════════════════════════
export const SWIPE_KINDS = ['neutral', 'primary', 'destructive'] as const;
export type SwipeKind = (typeof SWIPE_KINDS)[number];
export type SwipeKindFace = { badge: DColor; border: { width: number; color: DColor } | null; icon: DColor; label: DColor };
export type SwipeKitLook = {
  badge: { size: number; radius: number };
  icon: number;
  label: DType;
  gap: number;
  // 칸 — 첫 칸(앞 간격 포함) · 다음 칸 · 앞 간격
  first: { width: number; lead: number };
  rest: { width: number; lead: number };
  rowMin: number;
  kinds: Record<SwipeKind, SwipeKindFace>;
  disabled: { badge: DColor; icon: DColor; label: DColor };
  brightness: number;
  ring: DRing;
  motion: DMotion;
  // 제스처 판정(swipe-actions.md 의 "제스처 판정" 표)
  gesture: { deadzone: number; axis: number; open: number; close: number };
  breakpoint: number;
};
// 트레이 폭 — 칸 폭의 합(첫 칸 + 다음 칸들)
export const trayWidth = (s: Pick<SwipeKitLook, 'first' | 'rest'>, n: number) => (n <= 0 ? 0 : s.first.width + s.rest.width * (n - 1));

// 도넛 두께(서버 · 클라이언트 그림이 함께 쓴다) — 지름 ÷ 10 + 6 을 정수로(chart.yaml series.thicknessPerDiameter · thicknessOffset, Q-012-5 C)
export const donutThickness = (look: ChartLook, diameter: number) => Math.round(diameter * look.donut.perDiameter + look.donut.offset);
export const donutFits = (look: ChartLook, amount: string, diameter?: number, thickness?: number) => {
  const d = diameter ?? look.donut.diameter;
  return textWidth(amount, parseFloat(look.donut.center.fontSize)) <= d - (thickness ?? donutThickness(look, d)) * 2 - 12;
};
