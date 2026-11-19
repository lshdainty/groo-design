/*
 * Groo Chart 의 축 셈 — 컴포넌트가 아닌 순수 셈(값 축 · 눈금 폭 · 여백 · 가로 눈금 건너뛰기 · 같은 기간 차트 묶음).
 * 컴포넌트와 눈금 글자(formatAxisWon)는 components/ui/chart.tsx 에 있고, 쓰는 쪽은 chart.tsx 에서 함께 가져온다.
 * 규칙 원본은 specs/components/chart.md "축 · 격자".
 *
 *   niceStep · niceAxis          1 · 2 · 5 × 10ⁿ 간격 · 0 을 포함하는 눈금
 *   niceValueAxis                값 축 하나 — <YAxis {...niceValueAxis(값들, formatAxisWon, chartValueIntervals(높이))} />
 *   niceDualValueAxes            이중 축 — 두 축의 0 위 · 아래 칸 수를 맞춰 눈금이 같은 높이에 선다
 *   chartValueIntervals          세로 눈금 글이 겹치지 않고 들어가는 칸 수(차트 높이에서)
 *   measureTextWidth             눈금 글자 가운데 가장 긴 것의 폭(11px 고정 — 글자 크기 설정을 따르지 않는다)
 *   chartTopMargin · CHART_X_AXIS_HEIGHT   세로축 끝 글 자리 — 위 여백 · 가로 눈금 줄 높이
 *   chartXTickFullLabels · chartXTickInterval · chartXTickLabels · chartXEndReserve   가로 눈금 건너뛰기 · 연도 · 끝 글 자리
 *   createChartXGroup            같은 화면 · 같은 기간 차트 묶음 — 가장 좁은 차트로 건너뛰기를 한 번 센다
 *
 * 눈금 글은 글자 크기 설정을 따르지 않으므로(`-static`) 글자 크기 · 줄 높이는 고정값으로 센다.
 */

// ── 눈금 글자 ─────────────────────────────────────────────────
/** 눈금 글자 크기 — `--text-t1-static`(11px). SVG 글자는 var() 를 속성으로 못 받아 같은 값을 적는다 */
export const CHART_TICK_SIZE = "11px";

/** 눈금 글 줄 높이(px) — `--text-t1-static--line-height` 15 */
export const CHART_TICK_LINE = 15;

/** 눈금 글자 사이 최소 거리 — `spacing-x2`(8). recharts 기본값 5 를 쓰지 않는다 */
export const CHART_TICK_GAP = 8;

/**
 * 눈금 글자 옆 여백 — recharts 가 세로축 폭에서 따로 덜어 가는 것의 합. 눈금 선 길이(tickSize 기본 6) + tickMargin 8 = 14 에
 * 올림 오차 2 를 더한다
 */
const AXIS_PAD = 16;

// 레이아웃이 없는 환경(서버 렌더 · jsdom)의 추정치 — 한글 11, 그 밖 7
const estimate = (s: string): number => [...s].reduce((w, c) => w + (c > "ᄀ" ? 11 : 7), 0);

/** 눈금 글자 가운데 가장 긴 것의 폭(여백 없이) — 숨은 글에 눈금과 같은 크기 · 고정폭 숫자를 주고 잰다 */
export function measureTextWidth(labels: readonly string[]): number {
  if (typeof document === "undefined" || labels.length === 0) return Math.max(0, ...labels.map(estimate));
  const span = document.createElement("span");
  span.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;font-size:${CHART_TICK_SIZE};font-weight:400;font-variant-numeric:tabular-nums;`;
  document.body.appendChild(span);
  let max = 0;
  try {
    for (const label of labels) {
      span.textContent = label;
      max = Math.max(max, span.getBoundingClientRect().width);
    }
  } finally {
    span.remove();
  }
  if (max === 0) max = Math.max(0, ...labels.map(estimate));
  return Math.ceil(max);
}

/** 세로축 폭 — 가장 긴 눈금 글자 + 옆 여백. 음수 부호가 붙은 글("−3,000만")도 잘리지 않는다 */
export function measureTickWidth(labels: readonly string[]): number {
  return measureTextWidth(labels) + AXIS_PAD;
}

// ── 값 축 ────────────────────────────────────────────────────
/** [rough] 이상이 되는 가장 가까운 간격(1 · 2 · 5 × 10ⁿ) */
export function niceStep(rough: number): number {
  if (rough <= 0) return 1;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
  const frac = rough / pow10; // [1, 10)
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return niceFrac * pow10;
}

export interface NiceAxis {
  min: number;
  max: number;
  ticks: number[];
}

/**
 * 값 축 하나의 눈금 — 늘 0 을 포함하고(양수는 0 부터, 음수면 0 아래로), 간격은 1 · 2 · 5 × 10ⁿ 만 쓴다(2.5 간격은 만 단위로 줄이면
 * "0.25만" 이 되어 글자가 눈금 위치와 어긋난다). 값이 모두 0 이면 0 ~ 1만이다.
 * 예) 최대 60,881,200 → { min: 0, max: 80,000,000, ticks: [0, 2천만, 4천만, 6천만, 8천만] }
 */
export function niceAxis(dataMin: number, dataMax: number, targetSteps = 4): NiceAxis {
  const lo = Math.min(0, dataMin);
  let hi = Math.max(0, dataMax);
  if (lo === hi) hi = lo + 10_000;
  let step = niceStep((hi - lo) / targetSteps);
  // 2.5 를 빼면 2 와 5 사이가 벌어진다 — 5 를 골랐는데 2 로도 한 칸 더(targetSteps + 1) 안에 들면 2 를 쓴다
  const pow10 = Math.pow(10, Math.floor(Math.log10(step) + 1e-9));
  if (Math.round(step / pow10) === 5) {
    const two = 2 * pow10;
    const span = Math.ceil(hi / two - 1e-9) - Math.floor(lo / two + 1e-9);
    if (span <= targetSteps + 1) step = two;
  }
  const min = Math.round(Math.floor(lo / step + 1e-9) * step);
  const max = Math.round(Math.ceil(hi / step - 1e-9) * step);
  const ticks: number[] = [];
  for (let v = min; v <= max + step * 0.5; v += step) ticks.push(Math.round(v));
  return { min, max, ticks };
}

/** 눈금 글자 — 값과 그 축의 눈금 목록을 받는다(한 축은 한 단위라 눈금 하나의 글자도 축 전체를 보고 정한다) */
export type AxisFormat = (value: number, ticks: readonly number[]) => string;

/** `YAxis` 에 펼치는 값 축 — 그리는 눈금과 폭을 잰 눈금이 같은 목록 · 같은 글자다 */
export interface ValueAxisProps {
  domain: [number, number];
  ticks: number[];
  tickFormatter: (value: number) => string;
  width: number;
  /** 0 — 준 눈금을 하나도 빼지 않고 그린다(recharts 기본은 겹친다고 본 눈금 · 아래 끝 0 을 뺀다). 칸 수는 maxIntervals 로 줄인다 */
  interval: 0;
}

const valueAxisOf = (ticks: number[], format: AxisFormat): ValueAxisProps => {
  const tickFormatter = (v: number) => format(v, ticks);
  return {
    domain: [ticks[0]!, ticks[ticks.length - 1]!],
    ticks,
    tickFormatter,
    width: measureTickWidth(ticks.map(tickFormatter)),
    interval: 0,
  };
};

/** 기본 칸 수 — 네 칸을 겨냥한다 */
const NICE_STEPS = 4;

// 1 · 2 · 5 축을 [maxIntervals] 칸 안에 든 것으로 — 넘치면 겨냥하는 칸 수를 하나씩 줄여 다시 센다. 한 칸 겨냥까지 넘치면 그 축을 쓴다
function fittedAxes<T>(maxIntervals: number, build: (targetSteps: number) => { axes: T; intervals: number }): T {
  for (let t = NICE_STEPS; t > 1; t--) {
    const r = build(t);
    if (r.intervals <= maxIntervals) return r.axes;
  }
  return build(1).axes;
}

/**
 * 값 축 하나 — `<YAxis {...niceValueAxis(값들, formatAxisWon, chartValueIntervals(200))} {...chartAxisProps()} />`.
 * 값은 지금 보이는 계열만 넘긴다(계열을 끄면 남은 계열에 맞게 다시 잡힌다). 폭은 그리는 글자 가운데 가장 긴 것으로 잰다.
 * [maxIntervals] — 세로 눈금 글이 겹치지 않고 들어가는 칸 수(`chartValueIntervals`). 넘치면 눈금 수를 줄여 1 · 2 · 5 축을 다시 센다.
 */
export function niceValueAxis(values: readonly number[], format: AxisFormat, maxIntervals = Infinity): ValueAxisProps {
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const ticks = fittedAxes(maxIntervals, (t) => {
    const a = niceAxis(lo, hi, t);
    return { axes: a.ticks, intervals: a.ticks.length - 1 };
  });
  return valueAxisOf(ticks, format);
}

/**
 * 이중 축(왼쪽 · 오른쪽) — 축마다 간격을 따로 잡고, 0 위 · 아래 칸 수를 둘 가운데 많은 쪽에 맞춘다. 두 축의 눈금이 같은 높이에 서서
 * 한 축에 건 가로 격자에 다른 축 눈금도 맞는다. 칸 수가 적은 축은 위(또는 아래)로 늘어난다.
 * [maxIntervals] — 맞춘 뒤의 칸 수(위 + 아래)가 넘치면 두 축을 함께 더 적은 칸으로 다시 센다.
 */
export function niceDualValueAxes(
  left: readonly number[],
  right: readonly number[],
  format: AxisFormat,
  maxIntervals = Infinity,
): { left: ValueAxisProps; right: ValueAxisProps } {
  const fitted = fittedAxes(maxIntervals, (t) => {
    const axes = [left, right].map((values) => {
      const a = niceAxis(Math.min(0, ...values), Math.max(0, ...values), t);
      const step = a.ticks[1]! - a.ticks[0]!;
      return { step, above: Math.round(a.max / step), below: Math.round(-a.min / step) };
    });
    const above = Math.max(...axes.map((a) => a.above));
    const below = Math.max(...axes.map((a) => a.below));
    return { axes: { above, below, steps: axes.map((a) => a.step) }, intervals: above + below };
  });
  const [l, r] = fitted.steps.map((step) =>
    valueAxisOf(
      // + 0 — 0 칸이 −0 이 되지 않게
      Array.from({ length: fitted.below + fitted.above + 1 }, (_, i) => Math.round((i - fitted.below) * step) + 0),
      format,
    ),
  );
  return { left: l!, right: r! };
}

// ── 여백 ─────────────────────────────────────────────────────
/** 눈금 글과 그리는 자리 사이 — chartAxisProps 의 tickMargin 8 */
const TICK_MARGIN = 8;
/** 세로 눈금 글이 그리는 자리 밖으로 나가는 폭 — ⌈줄 높이 ÷ 2⌉ = 8 */
const TICK_HALF = Math.ceil(CHART_TICK_LINE / 2);

/** 세로축이 보이는 차트의 위 여백 — max(지금 위 여백, ⌈눈금 줄 높이 ÷ 2⌉). 맨 위 눈금 글이 차트 상자 · 지표 타일에 잘리지 않는다 */
export const chartTopMargin = (top: number): number => Math.max(top, TICK_HALF);

/** 가로 눈금 글이 그리는 자리 아래에서 떨어지는 거리 — max(8, ⌈줄 높이 ÷ 2⌉ + 4) = 12. 맨 아래 세로 글과 4 이상 띄운다 */
export const CHART_X_TICK_GAP = Math.max(TICK_MARGIN, TICK_HALF + 4);

/** 가로 눈금 줄 높이 — 위 시작 + 눈금 글 줄 높이 = 27 */
export const CHART_X_AXIS_HEIGHT = CHART_X_TICK_GAP + CHART_TICK_LINE;

/**
 * 세로 눈금 글이 겹치지 않고 들어가는 칸 수 — 눈금 사이가 눈금 글 줄 높이(15) 이상이어야 한다.
 *   그리는 높이 = 차트 높이 − max(위 여백, 8) − 아래 여백 − 가로 눈금 줄(27)
 *   칸 수      = ⌊그리는 높이 ÷ 15⌋
 * 여백은 차트에 준 margin(없으면 Chart 기본 위 8 · 아래 5).
 */
export function chartValueIntervals(height: number, { top = 8, bottom = 5 }: { top?: number; bottom?: number } = {}): number {
  const plot = height - chartTopMargin(top) - bottom - CHART_X_AXIS_HEIGHT;
  return Math.max(0, Math.floor(plot / CHART_TICK_LINE));
}

// ── 가로 눈금 ─────────────────────────────────────────────────
/** 가로 눈금 하나 — 연도 없는 글([label])과 해가 바뀔 때 쓰는 글([yearLabel]), 그 칸의 해([year]). 해가 없으면 연도를 붙이지 않는다 */
export interface ChartXTick {
  label: string;
  yearLabel?: string;
  year?: number;
}

const withYear = (t: ChartXTick, prevYear: number | undefined) =>
  t.yearLabel != null && t.year != null && prevYear != null && t.year !== prevYear ? t.yearLabel : t.label;

/** 모든 눈금이 보일 때의 글 — 해가 바뀌는 첫 눈금에만 연도. 눈금 글자 폭을 재는 기준이다 */
export const chartXTickFullLabels = (ticks: readonly ChartXTick[]): string[] =>
  ticks.map((t, i) => withYear(t, i > 0 ? ticks[i - 1]!.year : undefined));

/**
 * 가로 눈금 간격 — 글자 사이 최소 8 로 몇 칸이 들어가는지 세어, 끝(가장 최근) 눈금을 지키고 앞에서부터 건너뛴다.
 *   들어가는 수 = ⌊그리는 폭 ÷ (가장 긴 글 + 8)⌋, 간격 = ⌈칸 수 ÷ 들어가는 수⌉
 */
export function chartXTickInterval(count: number, plotWidth: number, labelWidth: number): number {
  const fit = Math.max(1, Math.floor(Math.max(0, plotWidth) / (labelWidth + CHART_TICK_GAP)));
  return Math.max(1, Math.ceil(count / fit));
}

/**
 * 보이는 눈금의 글 — 건너뛴 눈금은 null. 끝 눈금에서 [interval] 칸마다 남긴다.
 * 연도는 보이는 눈금 기준이다 — 앞에 보이는 눈금과 해가 다르면 연도를 붙인다(해가 바뀌는 칸이 빠지면 그 뒤 처음 보이는 눈금이 잇는다).
 */
export function chartXTickLabels(ticks: readonly ChartXTick[], interval: number): (string | null)[] {
  let prevYear = ticks[0]?.year;
  return ticks.map((t, i) => {
    if ((ticks.length - 1 - i) % Math.max(1, interval) !== 0) return null;
    const label = withYear(t, prevYear);
    if (t.year != null) prevYear = t.year;
    return label;
  });
}

/**
 * 끝 눈금 글의 자리 — 그리는 자리 오른쪽에 비울 폭. 끝 글 가운데가 그리는 자리 오른쪽 끝에 서므로 글 폭의 절반이 밖으로 나간다.
 *   오른쪽 축이 없으면  max(8, ⌈끝 글 폭 ÷ 2⌉)
 *   오른쪽 축이 있으면  max(0, ⌈끝 글 폭 ÷ 2⌉ − 오른쪽 축 폭) — 축 폭이 먼저 덮고 모자란 만큼만
 * 끝 글 폭은 연도를 단 글과 안 단 글 가운데 넓은 쪽이다.
 */
export function chartXEndReserve(ticks: readonly ChartXTick[], widthOf: (label: string) => number, rightAxisWidth = 0): number {
  const tail = ticks[ticks.length - 1];
  if (!tail) return 0;
  const w = Math.max(widthOf(tail.label), tail.yearLabel != null ? widthOf(tail.yearLabel) : 0);
  const half = Math.ceil(w / 2);
  return rightAxisWidth > 0 ? Math.max(0, half - rightAxisWidth) : Math.max(CHART_TICK_GAP, half);
}

// ── 같은 기간 차트 묶음 ───────────────────────────────────────
/**
 * 같은 화면 · 같은 기간 · 같은 눈금 단위(날 · 달) 차트의 가로 눈금 묶음. 차트마다 자기 그리는 자리로 센 건너뛰기 간격을 알리고,
 * 묶음의 가장 큰 간격(= 가장 좁은 차트의 간격)을 모두 쓴다 — 위아래 차트가 같은 날짜 글을 보인다. 눈금 단위가 다르면 묶지 않는다.
 * 화면이 묶음 하나를 만들어(`createChartXGroup`) 같은 기간 차트마다 `<Chart xGroup={group}>` 로 준다.
 */
export interface ChartXGroup {
  /** 차트 하나가 자기 그리는 자리로 센 간격을 알린다 */
  report(key: string, interval: number): void;
  /** 차트가 사라졌다 — 그 간격을 거둔다 */
  remove(key: string): void;
  /** 알린 간격 가운데 가장 큰 것(아무도 안 알렸으면 undefined) */
  interval(): number | undefined;
  /** 가장 큰 간격이 바뀌면 부른다(그리는 도중이 아니라 그 뒤에) */
  subscribe(listener: () => void): () => void;
  /** 가장 큰 간격이 바뀔 때마다 오르는 판 */
  version(): number;
}

export function createChartXGroup(): ChartXGroup {
  const intervals = new Map<string, number>();
  const listeners = new Set<() => void>();
  let version = 0;
  let last: number | undefined;
  let queued = false;
  const interval = () => (intervals.size ? Math.max(...intervals.values()) : undefined);
  const changed = () => {
    const next = interval();
    if (next === last) return;
    last = next;
    version += 1;
    // 차트가 눈금을 그리는 도중에 알리므로 다른 차트의 다시 그리기는 그 뒤로 미룬다
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      listeners.forEach((l) => l());
    });
  };
  return {
    report(key, value) {
      if (!(value >= 1) || intervals.get(key) === value) return;
      intervals.set(key, value);
      changed();
    },
    remove(key) {
      if (intervals.delete(key)) changed();
    },
    interval,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    version: () => version,
  };
}
