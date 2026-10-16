'use client';
// Chart 의 플레이그라운드와 코드 미리보기 — 고르면 스펙대로 그린 차트와 그 코드가 바뀐다(타일로 계열을 켜고 끄고, 짚으면 툴팁).
// 값은 chart.yaml 을 푼 ChartLook 만 쓴다(data-look). 코드는 chart.md 의 "코드" 절과 같은 레시피 API 다.
import { useMemo, useState, type ReactNode } from 'react';
import { CardHeaderView, CardSurface } from './data-card-view';
import { DonutLegendView, DonutView, HeatmapView, LegendTilesView, TrendChartView } from './data-chart-view';
import { HEAT_DAYS, HEAT_DAYS_FULL, HEAT_ROWS, MONTHLY, TODAY_DAY, TREND, TREND_MONTH } from './data-data';
import { DAY_HEADS, DAY_LABELS, categoryRows, dayHead, monthlySeries, total, trendSeries } from './data-chart-data';
import { dcv, formatWon, type CardLook, type ChartLook, type ViewMode } from './data-shared';
import type { ResultSectionLook } from './feedback-shared';
import { ResultSectionView } from './feedback-view';
import type { SkeletonLook } from './loading-shared';
import { SkeletonView } from './loading-view';
import { NavPlayFrame } from './nav-playground';
import { MODES, Seg } from './select-playground';
import type { TableLook } from './data-shared';
import { TableView, type TCol, type TRow } from './data-table-view';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
function Said({ text }: { text: string }) {
  return (
    <span role="status" className="inline-flex min-h-[26px] items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      {text || '—'}
    </span>
  );
}
type Kind = 'line' | 'bar' | 'donut' | 'heatmap';
type Data = 'shown' | 'empty' | 'failure' | 'loading';
export function ChartPlayground({ look, card, sk, result }: { look: ChartLook; card: CardLook; sk: SkeletonLook; result: ResultSectionLook }) {
  const [kind, setKind] = useState<Kind>('line');
  const [dual, setDual] = useState(true);
  const [n, setN] = useState<2 | 3>(2);
  const [data, setData] = useState<Data>('shown');
  const [hidden, setHidden] = useState<string[]>([]);
  const [cell, setCell] = useState(117);
  const [mode, setMode] = useState<ViewMode>('auto');
  const [said, setSaid] = useState('');
  const useDual = dual && n === 2;
  const series = kind === 'bar' ? monthlySeries(n, useDual) : trendSeries(n, useDual);
  const tiles = series.map((s) => ({ key: s.key, label: s.label, hue: s.hue, total: total(s) }));
  const cat = categoryRows(look);
  const title = kind === 'donut' ? `${TREND_MONTH}월 카테고리별 지출` : kind === 'heatmap' ? '요일 · 시간대별 지출' : kind === 'bar' ? '월별 수입 · 지출' : `${TREND_MONTH}월 수입 · 지출`;
  const body = (): ReactNode => {
    if (data === 'loading') return <SkeletonView look={sk} mode={mode} radius="16" height={kind === 'donut' ? 160 : 200} />;
    if (data === 'empty') return <ResultSectionView look={result} mode={mode} kind="empty" size="medium" inCard icon="receipt-text" title={`이번 달 ${kind === 'donut' ? '지출' : '기록'}이 없어요`} />;
    if (data === 'failure') return <ResultSectionView look={result} mode={mode} kind="failure" size="medium" inCard title="차트를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도', onClick: () => (setData('shown'), setSaid('다시 불러왔어요.')) }} live />;
    if (kind === 'donut')
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutView look={look} mode={mode} slices={cat.slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount={formatWon(cat.sum)} label={`${TREND_MONTH}월 카테고리별 지출, 합계 ${formatWon(cat.sum)}`} legendId="pg-cat" live />
          </div>
          <DonutLegendView look={look} mode={mode} rows={cat.rows} id="pg-cat" live onPick={(k) => setSaid(`${cat.rows.find((r) => r.key === k)?.label} 하위 카테고리로`)} />
        </>
      );
    if (kind === 'heatmap')
      return (
        <div style={{ overflowX: 'auto', paddingTop: 56 }}>
          <HeatmapView look={look} mode={mode} rows={HEAT_ROWS} columns={HEAT_DAYS} columnsFull={HEAT_DAYS_FULL} cell={cell} live label="10월 요일 × 시간대 지출 — 가장 많이 쓴 때는 토요일 저녁 240,000원" />
        </div>
      );
    return (
      <>
        <LegendTilesView look={look} mode={mode} items={tiles} hidden={hidden} onHiddenChange={setHidden} live id="pg-legend" />
        <TrendChartView look={look} mode={mode} kind={kind} series={series} count={kind === 'bar' ? MONTHLY.length : TODAY_DAY} xLabels={kind === 'bar' ? MONTHLY.map((m) => m.label) : DAY_LABELS} heads={kind === 'bar' ? MONTHLY.map((m, i) => (i === MONTHLY.length - 1 ? `${TREND_MONTH}월 1일~${TODAY_DAY}일` : m.label)) : DAY_HEADS} dual={useDual} hidden={hidden} live animate label={`${title}, ${tiles.map((t) => `${t.label} ${t.total}`).join(' · ')}`} legendId="pg-legend" height={200} />
      </>
    );
  };
  const code = useMemo(() => {
    if (kind === 'donut')
      return ['import { Pie, PieChart } from "recharts"', 'import { Chart, ChartDonutCenter, ChartDonutLegend, assignChartColors } from "@/components/ui/chart"', '', 'const slices = assignChartColors(categories, { colorOf: (c) => c.savedColor })', '', '<Chart label="10월 카테고리별 지출, 합계 1,240,000원" legendId="cat-legend" height={160}>', '  <PieChart><Pie data={slices} dataKey="amount" innerRadius={58} outerRadius={80} paddingAngle={0} /></PieChart>', '  <ChartDonutCenter label="10월 지출" amount="1,240,000원" />', '</Chart>', '<ChartDonutLegend id="cat-legend" items={…} />'].join('\n');
    if (kind === 'heatmap')
      return ['import { ChartHeatmap } from "@/components/ui/chart"', '', '<ChartHeatmap', '  label="10월 요일 × 시간대 지출 — 가장 많이 쓴 때는 토요일 저녁 18~22시 240,000원"', '  rows={[{ key: "evening", label: "저녁", sub: "18~22시" }, …]}', '  columns={["월", "화", "수", "목", "금", "토", "일"].map((d) => ({ key: d, label: d }))}', '  values={spendByBand}', `  textMinCellWidth={${look.heat.threshold}}`, '  tooltipLabel={(row, col) => `${col.full} ${row.label} ${row.sub}`}', '/>'].join('\n');
    const C = kind === 'bar' ? 'BarChart' : 'AreaChart';
    const S = kind === 'bar' ? 'Bar' : 'Area';
    return [
      `import { ${S}, ${C}, CartesianGrid, XAxis, YAxis } from "recharts"`,
      'import { Chart, ChartLegendTiles, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, formatAxisWon } from "@/components/ui/chart"',
      '',
      `<ChartLegendTiles id="trend-legend" items={[${series.map((s) => `{ key: "${s.key}", label: "${s.label}", color: "${s.hue}", total: "${total(s)}" }`).join(', ')}]} hidden={hidden} onHiddenChange={setHidden} />`,
      `<Chart label="…" legendId="trend-legend" height={200}>`,
      `  <${C} data={${kind === 'bar' ? 'months' : 'daysUntilToday'}}>`,
      ...(useDual ? ['    {/* 이중 축이면 격자도 축 하나에 건다 — 없으면 recharts 가 격자를 두 줄만 긋는다 */}', '    <CartesianGrid {...chartGridProps} yAxisId="income" />'] : ['    <CartesianGrid {...chartGridProps} />']),
      `    <XAxis dataKey="${kind === 'bar' ? 'month' : 'day'}" {...chartAxisProps()} />`,
      useDual ? '    <YAxis yAxisId="income" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "blue" })} />' : '    <YAxis tickFormatter={formatAxisWon} {...chartAxisProps()} />',
      ...(useDual ? ['    <YAxis yAxisId="expense" orientation="right" tickFormatter={formatAxisWon} {...chartAxisProps({ color: "red" })} />'] : []),
      '    <ChartTooltip content={<ChartTooltipContent headFormatter={formatDay} valueFormatter={formatWon} />} />',
      ...series.map((s) => `    {!hidden.has("${s.key}") && <${S}${useDual ? ` yAxisId="${s.key === 'expense' ? 'expense' : 'income'}"` : ''} dataKey="${s.key}" name="${s.label}" ${kind === 'bar' ? 'fill' : 'stroke'}="var(--color-chart-${s.hue})" />}`),
      `  </${C}>`,
      '</Chart>',
    ].join('\n');
  }, [kind, series, useDual, look.heat.threshold]);
  return (
    <NavPlayFrame
      surface={dcv(card.floor, mode)}
      wide
      stage={
        <div className="flex flex-col items-center gap-4" style={{ fontFamily: FONT }}>
          <div style={{ width: '100%', maxWidth: kind === 'heatmap' ? 760 : 560 }}>
            <CardSurface look={card} mode={mode}>
              <CardHeaderView look={card} mode={mode} title={title} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: look.tile.gap }}>{body()}</div>
            </CardSurface>
          </div>
          <Said text={said} />
        </div>
      }
      note={kind === 'heatmap' ? `칸 폭이 ${look.heat.threshold} 이상이면 원까지(${parseFloat(look.heat.value.fontSize)} · ${look.heat.value.fontWeight}), 좁으면 세기 색만 — 칸을 가리키거나 누르면 툴팁, ← → ↑ ↓ 로 옮긴다. 가장 큰 칸에 고리를 두르지 않는다.` : '타일을 누르면 계열을 켜고 끈다(마지막 하나는 남는다). 차트를 가리키거나 누르면 · ← → 로 툴팁. 계열이 셋이면 축 하나.'}
      controls={
        <>
          <Seg label="종류" value={kind} options={[['line', '선'], ['bar', '막대'], ['donut', '도넛'], ['heatmap', '열지도']]} onChange={(v) => (setKind(v as Kind), setHidden([]))} />
          <Seg label="축" value={useDual ? 'dual' : 'single'} options={n === 3 ? [['single', '하나 — 계열 셋']] : [['single', '하나'], ['dual', '둘(왼쪽 수입 · 오른쪽 지출)']]} onChange={(v) => setDual(v === 'dual')} />
          <Seg label="계열 수" value={String(n)} options={[['2', '둘'], ['3', '셋']]} onChange={(v) => (setN(Number(v) as 2 | 3), setHidden([]))} />
          <Seg label="데이터" value={data} options={[['shown', '있음'], ['empty', '비었음'], ['failure', '실패'], ['loading', '불러오는 중']]} onChange={(v) => setData(v as Data)} />
          <Seg label="열지도 칸 폭" value={String(cell)} options={look.heat.widths.filter(([w]) => w <= 1280).map(([w, c]) => [String(c), `${c}(${w})`] as const)} onChange={(v) => setCell(Number(v))} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ── 코드 미리보기 — chart.md 의 코드 그대로 ─────────────────
export function ExTrendDemo({ look, card }: { look: ChartLook; card: CardLook }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const series = trendSeries(2, true);
  const tiles = series.map((s) => ({ key: s.key, label: s.label, hue: s.hue, total: total(s) }));
  return (
    <CardSurface look={card}>
      <CardHeaderView look={card} title={`${TREND_MONTH}월 수입 · 지출`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: look.tile.gap }}>
        <LegendTilesView look={look} items={tiles} hidden={hidden} onHiddenChange={setHidden} live id="ex-trend-legend" />
        <TrendChartView look={look} series={series} count={TODAY_DAY} xLabels={DAY_LABELS} heads={DAY_HEADS} dual hidden={hidden} live animate label={`${TREND_MONTH}월 수입 · 지출 추이, ${tiles.map((t) => `${t.label} ${t.total}`).join(' · ')}`} legendId="ex-trend-legend" height={200} />
      </div>
    </CardSurface>
  );
}
export function ExDonutDemo({ look, card }: { look: ChartLook; card: CardLook }) {
  const cat = categoryRows(look);
  const [said, setSaid] = useState('');
  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: '100%' }}>
        <CardSurface look={card}>
          <CardHeaderView look={card} title={`${TREND_MONTH}월 카테고리별 지출`} />
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
            <DonutView look={look} slices={cat.slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount={formatWon(cat.sum)} label={`${TREND_MONTH}월 카테고리별 지출, 합계 ${formatWon(cat.sum)}`} legendId="ex-cat-legend" live />
          </div>
          <DonutLegendView look={look} rows={cat.rows} id="ex-cat-legend" live onPick={(k) => setSaid(`${cat.rows.find((r) => r.key === k)?.label} 하위 카테고리로`)} />
        </CardSurface>
      </div>
      <Said text={said} />
    </div>
  );
}
export function ExChartStatusDemo({ look, card, result, table }: { look: ChartLook; card: CardLook; result: ResultSectionLook; table: TableLook }) {
  const [kind, setKind] = useState<'table' | 'empty' | 'failure'>('table');
  const [said, setSaid] = useState('');
  const series = trendSeries(2, true);
  const cols: TCol[] = [
    { key: 'day', label: '날짜' },
    { key: 'income', label: '수입', align: 'end' },
    { key: 'expense', label: '지출', align: 'end' },
  ];
  const rows: TRow[] = TREND.map((d, i) => ({ id: `d${i}`, name: dayHead(i), cells: { day: dayHead(i), income: formatWon(d.income), expense: formatWon(d.expense) } }));
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-1">
        {(['table', 'empty', 'failure'] as const).map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={`rounded-md border px-2.5 py-1 text-[12px] ${kind === k ? 'border-fd-foreground bg-fd-foreground text-fd-background' : 'border-fd-border bg-fd-background text-fd-foreground'}`}>
            {k === 'table' ? '표로 보기' : k === 'empty' ? '비었음' : '실패'}
          </button>
        ))}
      </div>
      <div style={{ width: '100%' }}>
        <CardSurface look={card} body={kind === 'table' ? 'list' : 'content'}>
          <CardHeaderView look={card} title={`${TREND_MONTH}월 수입 · 지출`} body={kind === 'table' ? 'list' : 'content'} />
          {kind === 'table' ? (
            <>
              <div style={{ paddingLeft: card.surface.pad, paddingRight: card.surface.pad, paddingBottom: 8 }}>
                <TrendChartView look={look} series={series} count={TODAY_DAY} xLabels={DAY_LABELS} heads={DAY_HEADS} dual label={`${TREND_MONTH}월 수입 · 지출 추이`} height={160} />
              </div>
              <TableView look={table} caption={`${TREND_MONTH}월 날짜별 수입 · 지출`} columns={cols} rows={rows} minWidth={320} />
            </>
          ) : kind === 'empty' ? (
            <ResultSectionView look={result} kind="empty" size="medium" inCard icon="receipt-text" title="이번 달 기록이 없어요" />
          ) : (
            <ResultSectionView look={result} kind="failure" size="medium" inCard title="추이를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도', onClick: () => (setKind('table'), setSaid('다시 불러왔어요.')) }} live />
          )}
        </CardSurface>
      </div>
      <Said text={said} />
    </div>
  );
}
