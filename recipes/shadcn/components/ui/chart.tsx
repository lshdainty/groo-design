"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableRowHeader } from "@/components/ui/table";

/*
 * Porest Chart — 색은 DESIGN.md v110 · v111, 부품은 SEED Layout 의 대시보드 그림(2026-10-08). 수치 원본은 specs/components/chart.yaml.
 * SEED 에는 차트 컴포넌트도 차트 색도 없다 — 이중 축 · 계열 색 눈금 · 가로 격자 · 세로 점선 가리킴 · "■ 라벨 값" 툴팁 · 위 지표 타일은
 * SEED 그림을, 색 배정 · 범례 · 열지도 · 빈 · 실패 · 접근성은 porest 가 정했다. recharts(3.x) 위에 짰다.
 * 옛 Chart(shadcn ChartContainer · 16:9 · 아래 점 범례 · 테두리 툴팁)를 대신한다.
 *
 *   Chart               차트 상자 — label(필수, role="img" 의 요약 이름 — "10월 수입 · 지출 추이, 수입 4,200,000원 · …") · height(px) ·
 *                       legendId(대체가 되는 범례의 id → aria-describedby). 자식은 recharts 차트 하나(ResponsiveContainer 로 감싼다) +
 *                       ChartDonutCenter. 라이브러리가 svg 에 다는 role="application" · 이름 없는 tabindex 를 걷는다
 *   chartAxisProps      XAxis · YAxis 에 펼쳐 넣는 값 — 눈금 11 · fg-neutral-subtle(이중 축이면 { color } 로 그 계열 색) · 축 선 · 눈금 선 없음
 *   chartGridProps      CartesianGrid — 가로 점선(3 · 3) stroke-neutral-subtle 만
 *   ChartLegendTiles    선 · 막대 차트 위 지표 타일(role="group") — items({ key, label, color, total }) · hidden(숨긴 key) · onHiddenChange.
 *                       타일은 <button aria-pressed>, 마지막 하나는 끌 수 없다(aria-disabled). id 는 legendId 로 쓴다
 *   ChartTooltip · ChartTooltipContent   툴팁 — 떠 있는 표면 · 머리(headFormatter) · 줄 "■ 라벨 값"(valueFormatter, 기본 원까지).
 *                       ChartTooltip 은 가리킴 선(세로 점선)과 이 내용을 기본으로 단다
 *   ChartDonutLegend    도넛 범례 — 카테고리 목록 items({ key, label, color, percent, amount, onClick? }) — onClick 이 있는 줄만 누르는 줄
 *   ChartDonutCenter    도넛 가운데 합계 — label · amount(원까지). 구멍에 들어가지 않으면 그리지 않고 onFitChange(false) — 쓰는 쪽이 목록 위에 합계를 둔다
 *   ChartHeatmap        요일 × 시간 열지도 — label(요약 이름) · rows · columns · values · formatValue(기본 원까지) · valueLabel(툴팁 줄 이름, 기본 "지출") ·
 *                       textMinCellWidth(기본 112) · tooltipLabel(row, column)
 *   ChartDataTable      표로 보기 — caption · columns · rows, visuallyHidden(기본 true — 숨긴 표, false 면 차트 아래 펼친 표)
 *   assignChartColors   저장된 색 먼저, 나머지는 그 차트에서 쓰지 않은 색부터 배정 순서 — 10개를 넘으면 상위 9 + 회색 "기타"(groupOthers)
 *   formatAxisWon       눈금 글자 — "400만" · "1.2만" · "−3,000만"(만 · 억 · 조, 소수 한 자리, 빼기 U+2212)
 *   chartDonutThickness 도넛 두께 = 지름 ÷ 10 + 6(정수로 — 120 → 18 · 160 → 22 · 180 → 24, 2026-10-15 사용자 결정 Q-012-5 C)
 *   chartDonutRadii     지름에서 Pie 의 { innerRadius, outerRadius } — <Pie {...chartDonutRadii(160)}>
 *
 * 색: 차트 10색(라이트 팔레트 700 · 다크 800-dark — var(--color-chart-{색})). 배정 순서 blue → green → orange → violet → pink → indigo → red →
 *   yellow → brown, 회색은 "기타" 전용(색이 없다고 주지 않는다). 수입 blue · 지출 red.
 * 축 · 격자: 눈금 11 / 15 · 고정폭 숫자 · fg-neutral-subtle(이중 축의 눈금은 그 계열 색 — 글자 기준 4.5 를 넘는다). 가로 점선 격자만 —
 *   세로 격자 · 축 선 · 눈금 선 없음. 돈 축만 "만" 으로 줄인다(formatAxisWon). 오늘 뒤 날짜는 데이터에 넣지 않는다(0 으로 그리지 않는다).
 * 계열: 차트의 바로 아래 자식에 기본값을 넣는다(쓰는 쪽이 준 값이 이긴다) — Area · Line 선 2 · monotone · 점 없음(가리킨 자리에만
 *   계열 색 점 r 4 + 카드 면 색 테두리 2 = 10), Area 의 면은 같은 색 25% → 0% 세로 그라디언트 · Bar 최대 폭 28 · 위 모서리 4 ·
 *   Pie 조각 사이 0 · 12시에서 시계 방향. 그려짐은 300ms 한 번(ease-out) — 모션 줄이기면 바로(라이브러리 기본 "auto" — 강제로 켜지 않는다).
 * 툴팁: bg-layer-floating · shadow-s3 · 모서리 12 · 위아래 10 · 좌우 12 · 최소 128 · 테두리 없음. 머리 12 · fg-neutral-subtle, 줄은 색 네모 8
 *   (모서리 2) ↔ 라벨 6 · 라벨 13 fg-neutral-muted ↔ 값 12 이상 · 값 13 · 700 · fg-neutral · 고정폭 숫자(오른쪽). 보조 기술에는 숨긴다 —
 *   같은 값은 범례 · 표로 보기가 준다. 가리킴 선은 1px 점선(3 · 3) stroke-neutral-weak.
 * 키보드: 차트 상자(Tab 한 칸, role="img")에서 ← · → 로 날짜 · 막대를 옮기며 툴팁을 띄운다 — 처음 누르면 첫 날짜, Esc 로 닫고 상자를 떠나면
 *   닫는다(대화상자 안이어도 Esc 는 툴팁만 닫는다). 포커스 링은 키보드 포커스에만 상자 바깥 2px(띄움 2). 마우스 · 터치로 짚은 자리가 먼저다.
 * 지표 타일: 모서리 12 · 위아래 10 · 좌우 12 · 높이 62 · 폭 100 이상 · 타일 사이 8 · 아래 차트와 8. 점 8 ↔ 이름 6 · 이름 13 fg-neutral-muted,
 *   아래 2 에 합계 16 / 22 · 700 · fg-neutral. 켠 계열 바탕 chart-{색}-subtle(테두리 없음), 끈 계열 흰 면 + 안쪽 1px stroke-neutral-weak
 *   (끈 타일만 호버에 bg-layer-default-pressed). 누르면 색 없이 2px 거리 축소(Q-012-2), 키보드 포커스에만 바깥 2px 링.
 *   마지막 하나(켠 계열이 하나)는 끌 수 없다 — 색 그대로 · aria-disabled · 커서 not-allowed · 축소 없음(Q-012-3 C, v106 비활성 커서).
 * 도넛 범례 줄: 44 이상 · 색 네모 10 ↔ 8 · 이름 14 fg-neutral · % 14 fg-neutral-subtle · 금액 14 · 700 · "원". 누르는 줄은 List 줄과 같다 —
 *   카드 본문(여백 24) 안에서 줄을 카드 끝까지 내고(글자는 그대로 24 에 선다), 호버 · 누름 바탕 bg-layer-default-pressed 는 좌우 6 들어온
 *   모서리 10(카드 16 − 6 — List 의 동심 모서리). 키보드 포커스에만 안쪽 2px 링. 가운데 합계 16 / 22 · 700 + 위 라벨 12.
 * 열지도: 왼쪽 시간대 라벨 열 56(이름 13 · 700 + 시간 11 · fg-neutral-subtle) + 칸, 위 요일 머리 12 · fg-neutral-subtle. 칸은 정사각형 ·
 *   모서리 4 · 사이 6. 세기 다섯 — bg-brand-solid 를 카드 면에 18 · 35 · 55 · 75 · 100% 섞는다(가장 큰 값의 8 · 22 · 45 · 75% 에서 끊는다),
 *   값이 없으면 bg-neutral-weak. 가장 큰 칸에 고리를 두르지 않는다(사용자 결정 22A — 포커스 링과 헷갈린다).
 *   칸 폭(ResizeObserver 로 잰다)이 textMinCellWidth(112) 이상일 때만 칸에 원까지(11 / 15 · 700 · 고정폭 숫자, 빈 칸은 "—" fg-neutral-subtle),
 *   좁으면 글 없이 세기 색만 — 글자를 줄이거나 돈을 줄여 쓰지 않는다. 칸 글자색은 단계마다 한 번 정한다 — 그 단계 바탕 위 fg-neutral 이
 *   4.5 를 넘으면 fg-neutral, 아니면 static-white(Desk 라이트 75 · 100% · HR 라이트 100% 가 흰 글자, 다크는 모두 fg-neutral).
 *   툴팁(머리 tooltipLabel · 줄 "■ {valueLabel} 값", 네모는 그 칸의 세기 색)은 가리키면(마우스) · 누르면(터치 — 다른 곳을 누를 때까지) ·
 *   키보드로 옮기면 뜬다 — 글이 보이는 넓은 칸에서도. 키보드: 상자(Tab 한 칸)에서 ← → 요일 · ↑ ↓ 시간대(처음 누르면 첫 칸), 지금 칸에
 *   바깥 2px 링(띄움 2), Esc · 떠나면 닫는다. 툴팁은 화면 위 떠 있는 층(z-floating 200, 포털)이라 카드 모서리에 잘리지 않는다.
 * 보조 기술: 차트 · 열지도 상자는 role="img" + 요약 이름, 범례(지표 타일 · 목록)가 대체(legendId → aria-describedby), 날짜마다 값은 표로 보기.
 */

// ── 색 ───────────────────────────────────────────────────────
export type ChartColor = "blue" | "green" | "orange" | "violet" | "pink" | "indigo" | "red" | "yellow" | "brown" | "gray";

/** 색이 없는 항목의 배정 순서(v110) — 회색은 "기타" 전용이라 없다 */
const CHART_ORDER: readonly ChartColor[] = ["blue", "green", "orange", "violet", "pink", "indigo", "red", "yellow", "brown"];

const chartVar = (color: ChartColor) => `var(--color-chart-${color})`;

// Tailwind 는 소스의 글자 그대로를 읽으므로 열을 다 적는다
const DOT_BG: Record<ChartColor, string> = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  orange: "bg-chart-orange",
  violet: "bg-chart-violet",
  pink: "bg-chart-pink",
  indigo: "bg-chart-indigo",
  red: "bg-chart-red",
  yellow: "bg-chart-yellow",
  brown: "bg-chart-brown",
  gray: "bg-chart-gray",
};
const SUBTLE_BG: Record<ChartColor, string> = {
  blue: "bg-chart-blue-subtle",
  green: "bg-chart-green-subtle",
  orange: "bg-chart-orange-subtle",
  violet: "bg-chart-violet-subtle",
  pink: "bg-chart-pink-subtle",
  indigo: "bg-chart-indigo-subtle",
  red: "bg-chart-red-subtle",
  yellow: "bg-chart-yellow-subtle",
  brown: "bg-chart-brown-subtle",
  gray: "bg-chart-gray-subtle",
};

export type ChartColored<T> = T & {
  /** 차트 색 이름 — 범례 · 타일 */
  color: ChartColor;
  /** var(--color-chart-{색}) — recharts 의 fill · stroke(Pie 는 data 의 fill 을 쓴다) */
  fill: string;
};

export interface AssignChartColorsOptions<T> {
  /** 저장된 색 — 카테고리 · 계좌에 사용자가 고른 색. 없으면 null */
  colorOf?: (item: T) => ChartColor | null | undefined;
  /** 10개를 넘을 때 상위 9 뒤의 항목을 하나로 묶은 "기타"(회색) — 항목은 큰 순서로 넘긴다 */
  groupOthers?: (rest: T[]) => T;
}

/**
 * 저장된 색 먼저, 나머지는 그 차트에서 아직 쓰지 않은 색부터 배정 순서로(사용자 결정 9A) — 저장된 색과 같은 색이 두 번 나오지 않는다.
 * 10개를 넘으면 상위 9 + 회색 "기타". 회색은 "기타" 에만 — 색이 없다고 주지 않는다.
 */
function assignChartColors<T extends object>(items: readonly T[], { colorOf, groupOthers }: AssignChartColorsOptions<T> = {}): ChartColored<T>[] {
  const over = items.length > 10;
  const head = over ? items.slice(0, 9) : [...items];
  const rest = over ? items.slice(9) : [];
  const saved = head.map((item) => colorOf?.(item) ?? null);
  const used = new Set(saved.filter((c): c is ChartColor => c != null));
  const free = CHART_ORDER.filter((c) => !used.has(c));
  let next = 0;
  const out: ChartColored<T>[] = head.map((item, i) => {
    let color = saved[i];
    if (color == null) {
      // 쓰지 않은 색이 다 떨어지면(저장된 색이 많을 때) 배정 순서를 처음부터 다시 쓴다
      color = free[next] ?? CHART_ORDER[(next - free.length) % CHART_ORDER.length] ?? "blue";
      next++;
    }
    return { ...item, color, fill: chartVar(color) };
  });
  if (over) {
    if (groupOthers) {
      out.push({ ...groupOthers(rest), color: "gray", fill: chartVar("gray") });
    } else {
      if (import.meta.env.DEV) console.warn('[assignChartColors] 10개가 넘으면 groupOthers 로 상위 9 뒤를 "기타" 하나로 묶는다.');
      for (const item of rest) out.push({ ...item, color: "gray", fill: chartVar("gray") });
    }
  }
  return out;
}

// ── 숫자 ─────────────────────────────────────────────────────
const MINUS = "\u2212";
const round1 = (x: number) => Math.floor(x * 10 + 0.5) / 10;

/** 눈금 글자 — 1만 미만은 쉼표 정수, 그 위는 만 · 억 · 조에 소수 한 자리(.0 은 버린다). 빼기는 U+2212 */
function formatAxisWon(value: number): string {
  if (!Number.isFinite(value)) return "";
  const sign = value < 0 ? MINUS : "";
  const n = Math.abs(value);
  if (n < 10000) return sign + Math.round(n).toLocaleString("ko-KR");
  let scaled = n / 10000;
  let unit = "만";
  for (const bigger of ["억", "조"]) {
    if (round1(scaled) < 10000) break;
    scaled /= 10000;
    unit = bigger;
  }
  return sign + round1(scaled).toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + unit;
}

/** 도넛 두께 — 지름 ÷ 10 + 6 을 정수로(120 → 18 · 160 → 22 · 180 → 24). 문턱 없이 지름을 따라 고르게 굵어진다 */
function chartDonutThickness(diameter: number): number {
  return Math.round(diameter / 10 + 6);
}

/** 도넛 지름에서 Pie 의 반지름 — 차트 높이를 지름과 같게 두고 <Pie {...chartDonutRadii(160)}> 로 펼친다 */
function chartDonutRadii(diameter: number): { innerRadius: number; outerRadius: number } {
  const outerRadius = diameter / 2;
  return { innerRadius: outerRadius - chartDonutThickness(diameter), outerRadius };
}

// 돈은 줄이지 않고 원까지(툴팁 · 열지도 칸의 기본)
const formatWon = (value: number) => (value < 0 ? MINUS : "") + Math.round(Math.abs(value)).toLocaleString("ko-KR") + "원";

// ── 축 · 격자 ─────────────────────────────────────────────────
export interface ChartAxisOptions {
  /** 이중 축 — 그 축이 맡은 계열의 색. 주지 않으면 fg-neutral-subtle */
  color?: ChartColor;
}

/** XAxis · YAxis 에 펼친다 — 눈금 11 · fg-neutral-subtle(이중 축이면 계열 색) · 축 선 · 눈금 선 없음 · 눈금과 그리는 자리 사이 8 */
function chartAxisProps({ color }: ChartAxisOptions = {}) {
  return {
    axisLine: false,
    tickLine: false,
    tickMargin: 8,
    tick: { fill: color ? chartVar(color) : "var(--color-fg-neutral-subtle)", fontSize: 11 },
  } as const;
}

/** CartesianGrid 에 펼친다 — 가로 점선(3 · 3) stroke-neutral-subtle 만 */
const chartGridProps = {
  vertical: false,
  strokeDasharray: "3 3",
  stroke: "var(--color-stroke-neutral-subtle)",
} as const;

// ── 계열 기본값 ───────────────────────────────────────────────
// 가리킨 자리의 점 — r 4 + 테두리 2(바깥 지름 10), 테두리는 카드 면 색
const ACTIVE_DOT = { r: 4, strokeWidth: 2, stroke: "var(--color-bg-layer-default)" } as const;
const DRAW = { animationDuration: 300, animationEasing: "ease-out" } as const;

type AnyProps = Record<string, unknown>;

// 차트의 바로 아래 계열에 기본값을 넣는다 — 쓰는 쪽이 준 값이 이긴다. Area 의 면은 같은 색 25% → 0% 세로 그라디언트
function withSeriesDefaults(chart: React.ReactElement<AnyProps>, idPrefix: string) {
  const gradients: React.ReactElement[] = [];
  const pick = (props: AnyProps, defaults: AnyProps) => {
    const out: AnyProps = {};
    for (const [key, value] of Object.entries(defaults)) if (props[key] === undefined) out[key] = value;
    return out;
  };
  const children = React.Children.map(chart.props.children as React.ReactNode, (child, index) => {
    if (!React.isValidElement<AnyProps>(child)) return child;
    const props = child.props;
    if (child.type === RechartsPrimitive.Area) {
      const extra = pick(props, { type: "monotone", strokeWidth: 2, dot: false, activeDot: ACTIVE_DOT, ...DRAW });
      if (props.fill === undefined && typeof props.stroke === "string") {
        const id = `${idPrefix}area${index}`;
        gradients.push(
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: props.stroke, stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: props.stroke, stopOpacity: 0 }} />
          </linearGradient>,
        );
        extra.fill = `url(#${id})`;
        extra.fillOpacity = 1;
      }
      return React.cloneElement(child, extra);
    }
    if (child.type === RechartsPrimitive.Line) {
      return React.cloneElement(child, pick(props, { type: "monotone", strokeWidth: 2, dot: false, activeDot: ACTIVE_DOT, ...DRAW }));
    }
    if (child.type === RechartsPrimitive.Bar) {
      return React.cloneElement(child, pick(props, { maxBarSize: 28, radius: [4, 4, 0, 0], ...DRAW }));
    }
    if (child.type === RechartsPrimitive.Pie) {
      return React.cloneElement(child, pick(props, { paddingAngle: 0, stroke: "none", startAngle: 90, endAngle: -270, ...DRAW }));
    }
    return child;
  });
  const content = gradients.length > 0 ? [<defs key={`${idPrefix}defs`}>{gradients}</defs>, ...(children ?? [])] : children;
  return React.cloneElement(chart, undefined, content);
}

// ── 차트 상자 ─────────────────────────────────────────────────
type ChartContextValue = { hole: number | null };
const ChartContext = React.createContext<ChartContextValue>({ hole: null });

// 키보드 Esc 를 대화상자 · 시트보다 먼저 받는다 — Radix 는 문서에서 받으므로 창(window)에서 막는다(막힌 Esc 는 닫지 않는다)
function useEscapeFirst(active: boolean, target: React.RefObject<HTMLElement | null>, onEscape: () => void) {
  const handler = React.useRef(onEscape);
  React.useLayoutEffect(() => {
    handler.current = onEscape;
  });
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.isComposing || e.target !== target.current) return;
      e.preventDefault();
      handler.current();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [active, target]);
}

const CHART_ROOT = [
  "relative w-full rounded-r2 font-sans",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
  "[&_.recharts-cartesian-axis-tick-value]:tabular-nums",
  // 가리킨 점의 테두리는 카드 면 색(라이브러리 기본 흰색을 덮는다) · 늘 찍는 점은 두지 않는다
  "[&_.recharts-active-dot_.recharts-dot]:stroke-bg-layer-default [&_.recharts-line-dots]:hidden [&_.recharts-area-dots]:hidden",
  "[&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_.recharts-sector]:outline-none",
].join(" ");

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 요약 이름 — "{기간} {무엇} — {핵심 값}"(role="img" 의 이름) */
  label: string;
  /** 높이(px) — 쓰는 자리가 정한다(고정 비율을 두지 않는다) */
  height?: number;
  /** 대체가 되는 범례(지표 타일 · 목록)의 id — aria-describedby */
  legendId?: string;
  /** recharts 차트 하나 + ChartDonutCenter */
  children: React.ReactNode;
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ label, height, legendId, className, style, children, onKeyDown, onBlur, ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const idPrefix = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const all = React.Children.toArray(children);
    const overlays = all.filter((c) => React.isValidElement(c) && c.type === ChartDonutCenter);
    const chart = all.find((c): c is React.ReactElement<AnyProps> => React.isValidElement(c) && c.type !== ChartDonutCenter);
    const data = chart?.props.data;
    const navigable = chart != null && chart.type !== RechartsPrimitive.PieChart && Array.isArray(data) && data.length > 0;

    // 도넛 구멍 — Pie 의 innerRadius(숫자)로 가운데 합계가 들어가는지 잰다
    const pie = chart
      ? React.Children.toArray(chart.props.children as React.ReactNode).find(
          (c): c is React.ReactElement<AnyProps> => React.isValidElement(c) && c.type === RechartsPrimitive.Pie,
        )
      : undefined;
    const inner = pie?.props.innerRadius;
    const hole = typeof inner === "number" ? inner * 2 : null;
    const ctx = React.useMemo(() => ({ hole }), [hole]);

    // 라이브러리가 svg 에 다는 role="application" · tabindex 를 걷는다 — 차트 상자가 이름 있는 role="img" 하나다
    React.useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const strip = () => {
        root.querySelectorAll("svg.recharts-surface").forEach((svg) => {
          if (svg.hasAttribute("tabindex")) svg.removeAttribute("tabindex");
          if (svg.hasAttribute("role")) svg.removeAttribute("role");
        });
      };
      strip();
      const observer = new MutationObserver(strip);
      observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["tabindex", "role"] });
      return () => observer.disconnect();
    }, []);

    // 키보드 — 상자에서 ← · → 를 라이브러리의 키보드 처리로 넘긴다(라이브러리는 svg 를 감싼 .recharts-wrapper 에서 받는다)
    const keyboard = React.useRef({ started: false });
    const [tipOpen, setTipOpen] = React.useState(false);
    const send = (event: Event) => rootRef.current?.querySelector(".recharts-wrapper")?.dispatchEvent(event);
    const hide = () => {
      setTipOpen(false);
      send(new FocusEvent("focusout", { bubbles: true }));
    };
    useEscapeFirst(tipOpen, rootRef, hide);

    return (
      <ChartContext.Provider value={ctx}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="img"
          aria-label={label}
          aria-describedby={legendId}
          tabIndex={navigable ? 0 : undefined}
          data-slot="chart"
          className={cn(CHART_ROOT, className)}
          style={{ height, ...style }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented || e.target !== e.currentTarget || !navigable) return;
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            if (!tipOpen) {
              setTipOpen(true);
              if (!keyboard.current.started) {
                // 처음 — 첫 날짜에 띄운다
                keyboard.current.started = true;
                send(new FocusEvent("focusin", { bubbles: true }));
              } else {
                // 다시 — 닫기 전 자리에 띄운다
                send(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
              }
              return;
            }
            send(new KeyboardEvent("keydown", { key: e.key, bubbles: true, cancelable: true }));
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (e.target === e.currentTarget && tipOpen) hide();
          }}
          {...props}
        >
          {chart != null && (
            <RechartsPrimitive.ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: height ?? 1 }}>
              {withSeriesDefaults(chart, idPrefix)}
            </RechartsPrimitive.ResponsiveContainer>
          )}
          {overlays}
        </div>
      </ChartContext.Provider>
    );
  },
);
Chart.displayName = "Chart";

// ── 툴팁 ─────────────────────────────────────────────────────
// 가리킴 선 — 선 · 영역 차트는 points, 막대 차트는 그 칸의 가운데에 세로 점선
function ChartCrosshair(props: { points?: { x: number; y: number }[]; x?: number; y?: number; width?: number; height?: number }) {
  const { points, x, y, width, height } = props;
  let line: [number, number, number, number] | null = null;
  if (points && points.length >= 2 && points[0] && points[1]) line = [points[0].x, points[0].y, points[1].x, points[1].y];
  else if (x != null && y != null && width != null && height != null) line = [x + width / 2, y, x + width / 2, y + height];
  if (!line) return null;
  return (
    <line
      data-slot="chart-crosshair"
      x1={line[0]}
      y1={line[1]}
      x2={line[2]}
      y2={line[3]}
      strokeWidth={1}
      strokeDasharray="3 3"
      pointerEvents="none"
      className="stroke-stroke-neutral-weak"
    />
  );
}

type TooltipPayloadEntry = {
  name?: React.ReactNode;
  value?: unknown;
  dataKey?: unknown;
  color?: string;
  fill?: string;
  payload?: Record<string, unknown>;
  hide?: boolean;
};

export interface ChartTooltipContentProps {
  /** 머리 — 날짜 · 기간("10월 8일 (목)"). 기본은 받은 라벨 그대로 */
  headFormatter?: (label: React.ReactNode) => React.ReactNode;
  /** 값 — 기본 원까지("4,200,000원", 빼기 U+2212) */
  valueFormatter?: (value: number | string, key: string) => React.ReactNode;
  className?: string;
  // recharts 가 넣는 값
  active?: boolean;
  payload?: readonly TooltipPayloadEntry[];
  label?: React.ReactNode;
}

const TOOLTIP_SURFACE = "flex min-w-[128px] flex-col gap-x1 rounded-r3 bg-bg-layer-floating px-x3 py-x2_5 font-sans text-fg-neutral shadow-[var(--shadow-s3)]";

function TooltipRow({ swatch, name, value }: { swatch: string | undefined; name: React.ReactNode; value: React.ReactNode }) {
  return (
    <div data-slot="chart-tooltip-row" className="flex items-center text-t3">
      <span aria-hidden data-slot="chart-tooltip-swatch" className="mr-x1_5 size-2 shrink-0 rounded-[2px]" style={{ background: swatch }} />
      <span data-slot="chart-tooltip-label" className="text-fg-neutral-muted">
        {name}
      </span>
      <span data-slot="chart-tooltip-value" className="ml-auto pl-x3 font-bold tabular-nums text-fg-neutral">
        {value}
      </span>
    </div>
  );
}

function ChartTooltipContent({ active, payload, label, headFormatter, valueFormatter, className }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((item) => item.value != null && !item.hide);
  if (rows.length === 0) return null;
  const head = headFormatter ? headFormatter(label) : label;
  return (
    <div aria-hidden data-slot="chart-tooltip" className={cn(TOOLTIP_SURFACE, className)}>
      {head != null && head !== "" && (
        <div data-slot="chart-tooltip-head" className="text-t2 text-fg-neutral-subtle">
          {head}
        </div>
      )}
      {rows.map((item, i) => {
        const key = typeof item.dataKey === "string" || typeof item.dataKey === "number" ? String(item.dataKey) : String(item.name ?? i);
        const raw = item.value as number | string;
        const value = valueFormatter ? valueFormatter(raw, key) : typeof raw === "number" ? formatWon(raw) : raw;
        // 선 · 영역 · 막대는 계열 색, 도넛 조각은 그 조각의 fill(assignChartColors)
        const swatch = item.color ?? item.fill ?? (typeof item.payload?.fill === "string" ? item.payload.fill : undefined);
        return <TooltipRow key={key} swatch={swatch} name={item.name} value={value} />;
      })}
    </div>
  );
}
ChartTooltipContent.displayName = "ChartTooltipContent";

type ChartTooltipProps = React.ComponentProps<typeof RechartsPrimitive.Tooltip>;

/** recharts Tooltip — 가리킴 선(세로 점선) · 떠 있는 표면 내용 · 차트 상자 안 겹침(1)을 기본으로 */
function ChartTooltip(props: ChartTooltipProps) {
  return (
    <RechartsPrimitive.Tooltip
      cursor={<ChartCrosshair />}
      content={<ChartTooltipContent />}
      offset={12}
      wrapperStyle={{ zIndex: 1, outline: "none" }}
      {...props}
    />
  );
}
ChartTooltip.displayName = "ChartTooltip";

// ── 지표 타일 ─────────────────────────────────────────────────
export interface ChartLegendItem {
  key: string;
  label: React.ReactNode;
  color: ChartColor;
  /** 합계 — 원까지 만든 글("4,200,000원") */
  total: React.ReactNode;
}

export interface ChartLegendTilesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "hidden"> {
  items: ChartLegendItem[];
  /** 숨긴 계열의 key */
  hidden?: ReadonlySet<string>;
  onHiddenChange?: (hidden: Set<string>) => void;
}

const LEGEND_TILE = [
  "flex min-w-[100px] flex-[1_1_0] cursor-pointer flex-col items-start rounded-r3 border-0 px-x3 py-x2_5 text-start font-sans",
  "[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing),scale_var(--motion-duration-pressed-scale)_var(--motion-ease-pressed-scale)]",
  "active:[scale:calc(1-2/var(--press-basis))] motion-reduce:active:[scale:1] aria-disabled:cursor-not-allowed aria-disabled:active:[scale:1]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");
// 끈 타일 — 호버에만 바탕. 누름은 색 없이 축소만(바탕이 이미 켬 · 끔을 말한다 — SEED Feedback Color)
const LEGEND_TILE_HIDDEN = "bg-bg-layer-default shadow-[inset_0_0_0_1px_var(--color-stroke-neutral-weak)] hover:bg-bg-layer-default-pressed";

const ChartLegendTiles = React.forwardRef<HTMLDivElement, ChartLegendTilesProps>(
  ({ items, hidden, onHiddenChange, id, className, "aria-label": ariaLabel = "범례", ...props }, ref) => {
    const off = hidden ?? new Set<string>();
    const shown = items.filter((item) => !off.has(item.key)).length;
    return (
      // 묶음의 이름은 바깥, 대체 글(aria-describedby 가 가리키는 id)은 안쪽 — 차트의 설명이 "수입 4,200,000원 지출 1,240,000원" 이 되게
      <div ref={ref} role="group" aria-label={ariaLabel} data-slot="chart-legend-tiles" className={className} {...props}>
        <div id={id} className="mb-x2 flex flex-wrap gap-x2">
          {items.map((item) => {
            const on = !off.has(item.key);
            const locked = on && shown <= 1;
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={on}
                aria-disabled={locked || undefined}
                data-slot="chart-legend-tile"
                data-key={item.key}
                className={cn(LEGEND_TILE, on ? SUBTLE_BG[item.color] : LEGEND_TILE_HIDDEN)}
                onPointerDown={(e) => {
                  const el = e.currentTarget;
                  el.style.setProperty("--press-basis", String(Math.max(el.offsetHeight, el.offsetWidth / 4, 24)));
                }}
                onClick={() => {
                  // 마지막 하나는 끌 수 없다
                  if (locked) return;
                  const next = new Set(off);
                  if (on) next.add(item.key);
                  else next.delete(item.key);
                  onHiddenChange?.(next);
                }}
              >
                <span className="flex items-center gap-x1_5 text-t3 text-fg-neutral-muted">
                  <span aria-hidden data-slot="chart-legend-dot" className={cn("size-2 shrink-0 rounded-full", DOT_BG[item.color])} />
                  {item.label}
                </span>
                <span data-slot="chart-legend-total" className="mt-x0_5 text-t5 font-bold tabular-nums text-fg-neutral">
                  {item.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartLegendTiles.displayName = "ChartLegendTiles";

// ── 도넛 ─────────────────────────────────────────────────────
export interface ChartDonutLegendItem {
  key: string;
  label: React.ReactNode;
  color: ChartColor;
  /** "31%" */
  percent: React.ReactNode;
  /** 원까지 — "384,400원" */
  amount: React.ReactNode;
  /** 하위 카테고리가 있는 줄만 — 누르는 줄 */
  onClick?: () => void;
}

export interface ChartDonutLegendProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  items: ChartDonutLegendItem[];
}

const LEGEND_ROW = "flex min-h-11 w-full items-center gap-x2 text-start font-sans text-t4";
// 누르는 줄 — List 줄처럼 카드 끝까지(본문 여백 24 를 되돌린다), 바탕 층(::before)은 좌우 6 들어온 모서리 10(카드 16 − 6)
const LEGEND_ROW_PRESSABLE = [
  "relative isolate -mx-x6 w-[calc(100%+var(--spacing-x6)*2)] cursor-pointer border-0 bg-transparent px-x6",
  "before:pointer-events-none before:absolute before:inset-y-0 before:inset-x-x1_5 before:-z-10 before:rounded-r2_5 before:bg-transparent before:content-['']",
  "before:[transition:background-color_var(--motion-duration-color-transition)_var(--motion-ease-easing)]",
  "hover:before:bg-bg-layer-default-pressed active:before:bg-bg-layer-default-pressed",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring",
].join(" ");

function DonutLegendBody({ item }: { item: ChartDonutLegendItem }) {
  return (
    <>
      <span aria-hidden data-slot="chart-donut-swatch" className={cn("size-2.5 shrink-0 rounded-[2px]", DOT_BG[item.color])} />
      <span data-slot="chart-donut-label" className="min-w-0 flex-1 text-fg-neutral">
        {item.label}
      </span>
      <span data-slot="chart-donut-percent" className="tabular-nums text-fg-neutral-subtle">
        {item.percent}
      </span>
      <span data-slot="chart-donut-amount" className="font-bold tabular-nums text-fg-neutral">
        {item.amount}
      </span>
    </>
  );
}

const ChartDonutLegend = React.forwardRef<HTMLUListElement, ChartDonutLegendProps>(({ items, className, ...props }, ref) => (
  <ul ref={ref} role="list" data-slot="chart-donut-legend" className={cn("m-0 flex list-none flex-col p-0", className)} {...props}>
    {items.map((item) => (
      <li key={item.key} data-slot="chart-donut-legend-item" className="flex">
        {item.onClick ? (
          <button type="button" className={cn(LEGEND_ROW, LEGEND_ROW_PRESSABLE)} onClick={item.onClick}>
            <DonutLegendBody item={item} />
          </button>
        ) : (
          <div className={LEGEND_ROW}>
            <DonutLegendBody item={item} />
          </div>
        )}
      </li>
    ))}
  </ul>
));
ChartDonutLegend.displayName = "ChartDonutLegend";

export interface ChartDonutCenterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 위 라벨 — "10월 지출"(12 · fg-neutral-subtle) */
  label?: React.ReactNode;
  /** 합계 — 원까지(16 / 22 · 700). 줄여 쓰지 않는다 */
  amount: React.ReactNode;
  /** 구멍에 들어가는지 — 들어가지 않으면 가운데 글을 그리지 않는다. 쓰는 쪽이 목록 위에 합계를 둔다 */
  onFitChange?: (fits: boolean) => void;
}

// 가운데 글 묶음의 모서리와 구멍 가장자리 사이 — 조각에 붙지 않게
const HOLE_INSET = 4;

function ChartDonutCenter({ label, amount, onFitChange, className, ...props }: ChartDonutCenterProps) {
  const { hole } = React.useContext(ChartContext);
  const textRef = React.useRef<HTMLDivElement>(null);
  const [fits, setFits] = React.useState(true);
  const report = React.useRef(onFitChange);
  const last = React.useRef(true);
  React.useLayoutEffect(() => {
    report.current = onFitChange;
  });
  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || hole == null) return;
    const check = () => {
      // 글 묶음(폭 × 높이)의 모서리가 구멍(원) 안에 들어가는지
      const next = Math.hypot(el.scrollWidth / 2, el.scrollHeight / 2) <= hole / 2 - HOLE_INSET;
      if (next === last.current) return;
      last.current = next;
      setFits(next);
      report.current?.(next);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hole, label, amount]);
  return (
    <div
      aria-hidden
      data-slot="chart-donut-center"
      data-fits={fits || undefined}
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", !fits && "invisible", className)}
      {...props}
    >
      <div ref={textRef} className="flex w-max flex-col items-center text-center font-sans">
        {label != null && <span className="text-t2 text-fg-neutral-subtle">{label}</span>}
        <span className="whitespace-nowrap text-t5 font-bold tabular-nums text-fg-neutral">{amount}</span>
      </div>
    </div>
  );
}
ChartDonutCenter.displayName = "ChartDonutCenter";

// ── 열지도 ───────────────────────────────────────────────────
export interface ChartHeatmapRow {
  key: string;
  /** 시간대 이름 — "저녁"(13 · 700) */
  label: React.ReactNode;
  /** 시간 — "18~22시"(11 · fg-neutral-subtle) */
  sub?: React.ReactNode;
}

export interface ChartHeatmapColumn {
  key: string;
  /** 요일 — "수"(12 · fg-neutral-subtle) */
  label: React.ReactNode;
}

export interface ChartHeatmapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 요약 이름 — role="img" 의 이름("10월 요일 · 시간대별 지출, 가장 많은 때 토요일 저녁") */
  label: string;
  rows: ChartHeatmapRow[];
  columns: ChartHeatmapColumn[];
  /** 줄 × 칸 — 0 · null 은 값 없음 */
  values: (number | null | undefined)[][];
  /** 칸 · 툴팁의 값 — 기본 원까지("35,000원") */
  formatValue?: (value: number) => string;
  /** 툴팁 줄의 이름 — 기본 "지출"("■ 지출 35,000원") */
  valueLabel?: string;
  /** 칸 폭이 이보다 좁으면 칸에 글을 두지 않는다 — 기본 112 */
  textMinCellWidth?: number;
  /** 툴팁 머리 — 기본 "{요일} {시간대} {시간}" */
  tooltipLabel?: (row: ChartHeatmapRow, column: ChartHeatmapColumn) => React.ReactNode;
}

// 세기 다섯 — bg-brand-solid 를 카드 면에 섞은 비율과 끊는 자리(가장 큰 값에 대한 비율)
const HEAT_MIX = [0.18, 0.35, 0.55, 0.75, 1] as const;
const HEAT_STEP_BG = [
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_18%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_35%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_55%,var(--color-bg-layer-default))]",
  "bg-[color-mix(in_srgb,var(--color-bg-brand-solid)_75%,var(--color-bg-layer-default))]",
  "bg-bg-brand-solid",
] as const;
const HEAT_STEP_SWATCH = [
  "color-mix(in srgb, var(--color-bg-brand-solid) 18%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 35%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 55%, var(--color-bg-layer-default))",
  "color-mix(in srgb, var(--color-bg-brand-solid) 75%, var(--color-bg-layer-default))",
  "var(--color-bg-brand-solid)",
] as const;

function heatStep(value: number | null | undefined, max: number): number {
  if (value == null || !(value > 0) || !(max > 0)) return -1;
  const ratio = value / max;
  return ratio < 0.08 ? 0 : ratio < 0.22 ? 1 : ratio < 0.45 ? 2 : ratio < 0.75 ? 3 : 4;
}

type Rgb = [number, number, number];
const parseRgb = (text: string): Rgb | null => {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(text);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
};
const luminance = ([r, g, b]: Rgb) => {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrastOf = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

type HeatText = "neutral" | "white";

// 단계마다 칸 글자색 — 그 단계 바탕(카드 면 + 브랜드 채움 섞음) 위 fg-neutral 이 4.5 를 넘으면 fg-neutral, 아니면 흰 글자.
// 칸마다 재지 않는다 — 브랜드 · 모드가 바뀔 때(문서의 class · data-theme · 색 모드) 다섯 단계만 다시 정한다
function useHeatText(rootRef: React.RefObject<HTMLElement | null>): HeatText[] {
  const [steps, setSteps] = React.useState<HeatText[]>(["neutral", "neutral", "neutral", "neutral", "neutral"]);
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const compute = () => {
      const probe = root.ownerDocument.createElement("span");
      probe.style.display = "none";
      root.appendChild(probe);
      const read = (value: string) => {
        probe.style.color = "";
        probe.style.color = value;
        return parseRgb(getComputedStyle(probe).color);
      };
      const brand = read("var(--color-bg-brand-solid)");
      const surface = read("var(--color-bg-layer-default)");
      const fg = read("var(--color-fg-neutral)");
      const white = read("var(--color-static-white)");
      probe.remove();
      if (!brand || !surface || !fg || !white) return;
      const next = HEAT_MIX.map((m): HeatText => {
        const bg = surface.map((s, i) => Math.round(s + ((brand[i] ?? s) - s) * m)) as Rgb;
        const onFg = contrastOf(fg, bg);
        return onFg >= 4.5 || onFg >= contrastOf(white, bg) ? "neutral" : "white";
      });
      setSteps((prev) => (prev.join() === next.join() ? prev : next));
    };
    compute();
    const doc = root.ownerDocument;
    const observer = new MutationObserver(compute);
    observer.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", compute);
    return () => {
      observer.disconnect();
      scheme.removeEventListener("change", compute);
    };
  }, [rootRef]);
  return steps;
}

type HeatActive = { row: number; col: number; source: "pointer" | "touch" | "keyboard" };

const ChartHeatmap = React.forwardRef<HTMLDivElement, ChartHeatmapProps>(
  (
    { label, rows, columns, values, formatValue = formatWon, valueLabel = "지출", textMinCellWidth = 112, tooltipLabel, className, onKeyDown, onBlur, ...props },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const firstCellRef = React.useRef<HTMLSpanElement>(null);
    const tipRef = React.useRef<HTMLDivElement>(null);
    const [cellWidth, setCellWidth] = React.useState(0);
    const [active, setActive] = React.useState<HeatActive | null>(null);
    const [tipPosition, setTipPosition] = React.useState<{ left: number; top: number } | null>(null);
    const text = useHeatText(rootRef);
    const max = Math.max(0, ...values.flat().map((v) => (typeof v === "number" && v > 0 ? v : 0)));
    const showText = cellWidth >= textMinCellWidth;

    // 칸 폭 — 창 크기 · 회전에 따라 112 를 넘나들면 글을 보이고 감춘다(글자 크기는 그대로)
    React.useLayoutEffect(() => {
      const cell = firstCellRef.current;
      if (!cell) return;
      setCellWidth(cell.getBoundingClientRect().width);
      const observer = new ResizeObserver(() => setCellWidth(cell.getBoundingClientRect().width));
      observer.observe(cell);
      return () => observer.disconnect();
    }, [columns.length, rows.length]);

    // 툴팁 자리 — 칸 위 8(모자라면 아래), 화면 가장자리와 8. 스크롤 · 크기가 바뀌면 따라간다
    React.useLayoutEffect(() => {
      if (!active) {
        setTipPosition(null);
        return;
      }
      const place = () => {
        const cell = rootRef.current?.querySelector<HTMLElement>(`[data-row="${active.row}"][data-col="${active.col}"]`);
        const tip = tipRef.current;
        if (!cell || !tip) return;
        const c = cell.getBoundingClientRect();
        const w = tip.offsetWidth;
        const h = tip.offsetHeight;
        const left = Math.min(Math.max(8, c.left + c.width / 2 - w / 2), window.innerWidth - 8 - w);
        const above = c.top - 8 - h;
        setTipPosition({ left, top: above >= 8 ? above : c.bottom + 8 });
      };
      place();
      window.addEventListener("scroll", place, true);
      window.addEventListener("resize", place);
      return () => {
        window.removeEventListener("scroll", place, true);
        window.removeEventListener("resize", place);
      };
    }, [active]);

    // 터치로 띄운 툴팁은 다른 곳을 누를 때까지 남는다
    React.useEffect(() => {
      if (active?.source !== "touch") return;
      const onDown = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target : null;
        if (target?.closest('[data-slot="chart-heatmap-cell"]') && rootRef.current?.contains(target)) return;
        setActive(null);
      };
      document.addEventListener("pointerdown", onDown, true);
      return () => document.removeEventListener("pointerdown", onDown, true);
    }, [active?.source]);

    useEscapeFirst(active?.source === "keyboard", rootRef, () => setActive(null));

    const activeRow = active ? rows[active.row] : undefined;
    const activeCol = active ? columns[active.col] : undefined;
    const activeValue = active ? values[active.row]?.[active.col] : undefined;
    const activeStep = active ? heatStep(activeValue, max) : -1;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="img"
        aria-label={label}
        tabIndex={0}
        data-slot="chart-heatmap"
        className={cn(
          "relative grid w-full gap-x1_5 rounded-r2 font-sans",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring",
          className,
        )}
        style={{ gridTemplateColumns: `56px repeat(${columns.length}, minmax(0, 1fr))` }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented || e.target !== e.currentTarget) return;
          const moves: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
          const step = moves[e.key];
          if (!step || rows.length === 0 || columns.length === 0) return;
          e.preventDefault();
          setActive((prev) =>
            prev?.source === "keyboard"
              ? {
                  row: Math.min(rows.length - 1, Math.max(0, prev.row + step[0])),
                  col: Math.min(columns.length - 1, Math.max(0, prev.col + step[1])),
                  source: "keyboard",
                }
              : // 처음 — 첫 칸(마우스로 짚던 칸이 있으면 그 칸)부터
                { row: prev?.row ?? 0, col: prev?.col ?? 0, source: "keyboard" },
          );
        }}
        onBlur={(e) => {
          onBlur?.(e);
          if (e.target === e.currentTarget && active?.source === "keyboard") setActive(null);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse" && active?.source === "pointer") setActive(null);
        }}
        {...props}
      >
        <span aria-hidden />
        {columns.map((column) => (
          <span key={column.key} aria-hidden data-slot="chart-heatmap-column" className="text-center text-t2 text-fg-neutral-subtle">
            {column.label}
          </span>
        ))}
        {rows.map((row, r) => (
          <React.Fragment key={row.key}>
            <span aria-hidden data-slot="chart-heatmap-row" className="flex min-w-0 flex-col justify-center">
              <span className="text-t3 font-bold text-fg-neutral">{row.label}</span>
              {row.sub != null && <span className="text-t1 text-fg-neutral-subtle">{row.sub}</span>}
            </span>
            {columns.map((column, c) => {
              const value = values[r]?.[c];
              const step = heatStep(value, max);
              const isActive = active?.row === r && active.col === c;
              return (
                <span
                  key={column.key}
                  ref={r === 0 && c === 0 ? firstCellRef : undefined}
                  aria-hidden
                  data-slot="chart-heatmap-cell"
                  data-row={r}
                  data-col={c}
                  data-step={step}
                  data-active={isActive ? active.source : undefined}
                  className={cn(
                    "flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-r1 text-t1 font-bold tabular-nums whitespace-nowrap",
                    step < 0 ? "bg-bg-neutral-weak text-fg-neutral-subtle" : HEAT_STEP_BG[step],
                    step >= 0 && (text[step] === "white" ? "text-static-white" : "text-fg-neutral"),
                    // 키보드로 온 칸 — 바깥 2px 링(띄움 2). 가장 큰 칸의 고리는 두지 않는다
                    isActive && active.source === "keyboard" && "outline-2 outline-offset-2 outline-stroke-focus-ring",
                  )}
                  onPointerMove={(e) => {
                    if (e.pointerType === "mouse" && !isActive) setActive({ row: r, col: c, source: "pointer" });
                  }}
                  onPointerDown={(e) => {
                    if (e.pointerType !== "mouse") setActive({ row: r, col: c, source: "touch" });
                  }}
                >
                  {showText ? (step < 0 ? "—" : formatValue(value as number)) : null}
                </span>
              );
            })}
          </React.Fragment>
        ))}
        {active &&
          activeRow &&
          activeCol &&
          createPortal(
            <div
              ref={tipRef}
              aria-hidden
              data-slot="chart-heatmap-tooltip"
              className={cn(TOOLTIP_SURFACE, "pointer-events-none fixed z-(--z-floating)", !tipPosition && "invisible")}
              style={{ left: tipPosition?.left ?? 0, top: tipPosition?.top ?? 0 }}
            >
              <div data-slot="chart-tooltip-head" className="text-t2 text-fg-neutral-subtle">
                {tooltipLabel ? tooltipLabel(activeRow, activeCol) : [activeCol.label, " ", activeRow.label, activeRow.sub != null ? " " : "", activeRow.sub]}
              </div>
              <TooltipRow
                swatch={activeStep < 0 ? "var(--color-bg-neutral-weak)" : HEAT_STEP_SWATCH[activeStep]}
                name={valueLabel}
                value={activeStep < 0 ? "없음" : formatValue(activeValue as number)}
              />
            </div>,
            document.body,
          )}
      </div>
    );
  },
);
ChartHeatmap.displayName = "ChartHeatmap";

// ── 표로 보기 ─────────────────────────────────────────────────
export type ChartDataTableColumn = string | { label: React.ReactNode; align?: "start" | "end" };

export interface ChartDataTableProps {
  /** 표 이름 — "10월 날짜별 수입 · 지출" */
  caption: string;
  /** 열 — 첫 열은 그 줄의 이름(날짜), 나머지는 기본 오른쪽(숫자) */
  columns: ChartDataTableColumn[];
  /** 줄 × 칸 — 돈은 원까지 만든 글 */
  rows: React.ReactNode[][];
  /** 기본 true — 숨긴 표(보조 기술만). false 면 차트 아래 펼친 표 */
  visuallyHidden?: boolean;
  className?: string;
}

function ChartDataTable({ caption, columns, rows, visuallyHidden = true, className }: ChartDataTableProps) {
  const cols = columns.map((column, i) =>
    typeof column === "string" ? { label: column, align: i === 0 ? ("start" as const) : ("end" as const) } : { label: column.label, align: column.align ?? (i === 0 ? "start" : "end") },
  );
  const table = (
    <Table caption={caption} className={visuallyHidden ? undefined : className}>
      <TableHeader>
        <TableRow>
          {cols.map((column, i) => (
            <TableHead key={i} align={column.align}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, r) => (
          <TableRow key={r}>
            {row.map((cell, c) =>
              c === 0 ? (
                <TableRowHeader key={c} align={cols[c]?.align}>
                  {cell}
                </TableRowHeader>
              ) : (
                <TableCell key={c} align={cols[c]?.align}>
                  {cell}
                </TableCell>
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  return visuallyHidden ? (
    <div data-slot="chart-data-table" className={cn("sr-only", className)}>
      {table}
    </div>
  ) : (
    <div data-slot="chart-data-table">{table}</div>
  );
}
ChartDataTable.displayName = "ChartDataTable";

export {
  Chart,
  chartAxisProps,
  chartGridProps,
  ChartLegendTiles,
  ChartTooltip,
  ChartTooltipContent,
  ChartDonutLegend,
  ChartDonutCenter,
  ChartHeatmap,
  ChartDataTable,
  assignChartColors,
  formatAxisWon,
  chartDonutThickness,
  chartDonutRadii,
};
