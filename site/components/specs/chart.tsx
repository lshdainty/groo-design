// Chart 페이지의 그림 — specs/components/chart.md 의 `[그림: …](../../site/components/specs/chart.tsx#<id>)` 자리.
// 차트 부품(축 · 격자 · 계열 · 툴팁 · 지표 타일 · 도넛 · 열지도)은 chart.yaml 을 푼 값(chartLook — data-chart-view)으로, 카드는 card.yaml,
// 표로 보기는 table.yaml, 빈 · 실패는 result-section.yaml 로 그린다. 금액은 지어낸 Desk 통계다(돈은 원까지 — 줄임은 축만).
// 열지도의 가장 큰 칸에는 고리를 두르지 않는다(사용자 결정 2026-10-08 — 키보드 포커스 링과 헷갈린다).
import type { ReactNode } from 'react';
import { Panel } from '../foundations/ui';
import { CardHeaderView, CardSurface } from './data-card-view';
import { DAY_HEADS, DAY_LABELS, categoryRows, trendSeries } from './data-chart-data';
import { ChartPlayground, ExChartStatusDemo, ExDonutDemo, ExTrendDemo } from './data-chart-play';
import { DonutLegendView, DonutView, HeatmapView, LegendTilesView, TrendChartView, type TrendSeries } from './data-chart-view';
import { contrastPair } from './data-contrast';
import { HEAT_DAYS, HEAT_DAYS_FULL, HEAT_ROWS, HUE_KO, MONTH_DAYS, PALETTE_DEMO, TODAY_DAY, TREND, TREND_MONTH, TREND_TOTAL, TREND_YEAR } from './data-data';
import { CHL, CL, DimH, DimV, MODES, ModeLabel, PINK, TL, TREND_TILES, Tip, dayHead, dayLabel, pinkFill, won, type Fig } from './data-screens';
import { assignChartColors, donutFits, donutThickness, formatDay, type ChartHue } from './data-shared';
import { TableView, type TCol, type TRow } from './data-table-view';
import { Reading } from './display-view';
import { resultSectionLook } from './feedback-look';
import { ResultSectionView } from './feedback-view';
import { Verdict, rc } from './kit';
import { loadingKit } from './loading-look';
import { SkeletonView } from './loading-view';
import { Cap, CodePreview, Legend, pinAt } from './nav-screens';

const Wrap = ({ children, gap = 'gap-6' }: { children: ReactNode; gap?: string }) => <div className={`flex flex-wrap items-start justify-center ${gap}`}>{children}</div>;
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col gap-4 md:flex-row">{children}</div>;
const Col = ({ children, cap, strong, w }: { children: ReactNode; cap?: ReactNode; strong?: ReactNode; w?: number }) => (
  <div className="flex min-w-0 max-w-full flex-col items-center gap-2">
    <div className="max-w-full overflow-x-auto">{children}</div>
    {(cap || strong) && (
      <Cap strong={strong} w={w}>
        {cap}
      </Cap>
    )}
  </div>
);
// 차트를 담은 카드 — 머리 + (타일 ↔ 차트 8) + 차트
function ChartBox({ title, children, width = 420, mode = 'auto' }: { title?: string; children: ReactNode; width?: number | string; mode?: 'light' | 'dark' | 'auto' }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode} width={width}>
      {title && <CardHeaderView look={c} mode={mode} title={title} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: CHL().tile.gap }}>{children}</div>
    </CardSurface>
  );
}
const inner = (w: number) => w - CL().surface.pad * 2 - CL().surface.borderW * 2;
const TREND_LABEL = `${TREND_MONTH}월 수입 · 지출 추이, 수입 ${won(TREND_TOTAL.income)} · 지출 ${won(TREND_TOTAL.expense)}`;
function Trend({ w = 420, mode = 'auto', hidden, active, dual = true, noTip, tiles = true }: { w?: number; mode?: 'light' | 'dark' | 'auto'; hidden?: string[]; active?: number | null; dual?: boolean; noTip?: boolean; tiles?: boolean }) {
  const series = trendSeries(2, dual);
  return (
    <>
      {tiles && <LegendTilesView look={CHL()} mode={mode} items={TREND_TILES} hidden={hidden} />}
      <TrendChartView look={CHL()} mode={mode} series={series} count={TODAY_DAY} xLabels={DAY_LABELS} heads={DAY_HEADS} dual={dual} hidden={hidden} active={active} width={inner(w)} height={200} label={TREND_LABEL} noTip={noTip} />
    </>
  );
}
function Donut({ mode = 'auto', n = 10, active }: { mode?: 'light' | 'dark' | 'auto'; n?: number; active?: string | null }) {
  const cat = categoryRows(CHL());
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <DonutView look={CHL()} mode={mode} slices={cat.slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount={won(cat.sum)} label={`${TREND_MONTH}월 카테고리별 지출, 합계 ${won(cat.sum)}`} active={active} />
      </div>
      <DonutLegendView look={CHL()} mode={mode} rows={cat.rows.slice(0, n)} />
    </>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col gap-2">
          <ModeLabel mode={mode} />
          <div className="flex flex-wrap items-start justify-center gap-3 rounded-xl" style={{ background: rc('bg-layer-basement', mode), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
            <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} mode={mode} width={360}>
              <Trend mode={mode} w={360} active={TODAY_DAY - 1} />
            </ChartBox>
            <ChartBox title={`${TREND_MONTH}월 카테고리별 지출`} mode={mode} width={360}>
              <Donut mode={mode} n={6} />
            </ChartBox>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <ChartPlayground look={CHL()} card={CL()} sk={loadingKit('desk').skeleton} result={resultSectionLook('desk')} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const w = 440;
  const p = CL().surface.pad + CL().surface.borderW;
  const headH = parseFloat(CL().title.lineHeight) + CL().header.padBottom;
  const t = CHL().tile;
  const tileH = t.padY * 2 + parseFloat(t.name.lineHeight) + t.totalGap + parseFloat(t.total.lineHeight);
  const chartTop = p + headH + tileH + t.gap;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Wrap gap="gap-5">
          <div style={{ position: 'relative', paddingLeft: 12, paddingTop: 6 }}>
            <div style={{ position: 'relative' }}>
              <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={w}>
                <Trend w={w} active={4} />
              </ChartBox>
              {pinAt('ⓐ', { left: p - 12, top: p + headH - 10 })}
              {pinAt('ⓑ', { left: p - 12, top: chartTop + 8 })}
              {pinAt('ⓒ', { left: p + 120, top: chartTop + 54 })}
              {pinAt('ⓓ', { left: p + 60, top: chartTop + 20 })}
              {pinAt('ⓔ', { left: p + 210, top: chartTop + 150 })}
              {pinAt('ⓕ', { left: p + 300, top: chartTop + 2 })}
            </div>
          </div>
          <div style={{ position: 'relative', paddingLeft: 12, paddingTop: 6 }}>
            <div style={{ position: 'relative' }}>
              <ChartBox title={`${TREND_MONTH}월 카테고리별 지출`} width={340}>
                <Donut n={4} />
              </ChartBox>
              {pinAt('ⓖ', { left: 160, top: p + headH + 70 })}
              {pinAt('ⓗ', { left: p - 12, top: p + headH + CHL().donut.diameter + 18 })}
            </div>
          </div>
        </Wrap>
        <Legend
          items={[
            ['ⓐ', 'Legend Tile'],
            ['ⓑ', 'Tick Label'],
            ['ⓒ', 'Grid Line'],
            ['ⓓ', 'Series'],
            ['ⓔ', 'Crosshair · Point'],
            ['ⓕ', 'Tooltip'],
            ['ⓖ', 'Donut Center'],
            ['ⓗ', 'Legend List'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── Properties ────────────────────────────────────────────
const Palette: Fig = ({ caption }) => {
  const look = CHL();
  const colored = assignChartColors(PALETTE_DEMO, look.order);
  const sum = colored.reduce((s, c) => s + c.amount, 0);
  const saved = new Set(PALETTE_DEMO.filter((c) => c.saved).map((c) => c.saved));
  const slices = colored.map((c) => ({ key: c.key, label: c.label, hue: c.color, amount: c.amount }));
  const rows = slices.map((s) => ({ key: s.key, label: `${s.label}${PALETTE_DEMO.find((c) => c.key === s.key)?.saved ? '' : ` — 색 없음 → ${HUE_KO[s.hue]}`}`, hue: s.hue, percent: `${Math.round((s.amount / sum) * 1000) / 10}%`, amount: won(s.amount) }));
  return (
    <Panel caption={caption}>
      <Wrap>
        <ChartBox title={`${TREND_MONTH}월 카테고리별 지출`} width={380}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
            <DonutView look={look} slices={slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount={won(sum)} label="카테고리별 지출" />
          </div>
          <DonutLegendView look={look} rows={rows} />
        </ChartBox>
        <Col strong="배정 순서" cap="저장된 색(점선)은 건너뛰고 아직 쓰지 않은 색부터 — 구독은 남색, 의료는 노랑. 회색은 &quot;기타&quot; 전용" w={260}>
          <div className="flex flex-col gap-1.5 rounded-xl" style={{ background: rc('bg-layer-default'), paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, width: 260 }}>
            {look.order.map((h, i) => {
              const used = saved.has(h);
              const got = colored.find((c) => c.color === h && !PALETTE_DEMO.find((x) => x.key === c.key)?.saved);
              return (
                <div key={h} className="flex items-center gap-2 text-[13px] leading-[18px]">
                  <span className="w-4 text-right tabular-nums pk-muted">{i + 1}</span>
                  <span aria-hidden style={{ width: 14, height: 14, borderRadius: 4, background: rc(`chart-${h}`), outline: used ? `1.5px dashed ${PINK}` : undefined, outlineOffset: 2 }} />
                  <span className="pk-text">{HUE_KO[h]}</span>
                  <span className="pk-muted">{h === 'gray' ? '"기타" 전용' : used ? `저장됨 — ${PALETTE_DEMO.find((x) => x.saved === h)?.label}` : got ? `→ ${got.label}` : '—'}</span>
                </div>
              );
            })}
          </div>
        </Col>
      </Wrap>
    </Panel>
  );
};

// 순자산 추이 — 음수(빚이 더 많은 달)가 있는 축 하나, 눈금 글자가 잘리지 않게
const NET: TrendSeries[] = [{ key: 'net', label: '순자산', hue: 'blue', values: [-26372000, -19500000, -12000000, -4800000, 3200000, 11800000] }];
const AxisFig: Fig = ({ caption }) => {
  const look = CHL();
  const months = ['5월', '6월', '7월', '8월', '9월', '10월'];
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="축 하나 — 눈금 회색" cap={`눈금 ${parseFloat(look.tick.type.fontSize)} / ${parseFloat(look.tick.type.lineHeight)} · fg-neutral-subtle · 고정폭 숫자, 가로 점선(${look.grid.dash.join(' · ')}) 격자만 — 세로 격자 · 축 선 없음. "−3,000만" 까지 세로축 폭 안`} w={420}>
          <ChartBox title="순자산 추이" width={420}>
            <TrendChartView look={look} series={NET} count={6} xLabels={months} heads={months} width={inner(420)} height={200} label="순자산 추이, 10월 11,800,000원" />
          </ChartBox>
        </Col>
        <Col strong="음수 축 글자가 잘린 것" cap="세로축 폭을 짧게 잡아 빼기(−)가 상자 밖으로 — 지금 자산 화면" w={300}>
          <ChartBox title="순자산 추이" width={320}>
            <div style={{ overflow: 'hidden' }}>
              <TrendChartView look={look} series={NET} count={6} xLabels={months} heads={months} width={inner(320)} height={200} label="순자산 추이" bad={{ clipNegative: true }} />
            </div>
          </ChartBox>
        </Col>
      </Wrap>
    </Panel>
  );
};

const DualAxis: Fig = ({ caption }) => {
  const look = CHL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <Col>
          <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={560}>
            <Trend w={560} />
          </ChartBox>
        </Col>
        <Cap w={560}>
          왼쪽 수입(blue {contrastPair('chart-blue', 'bg-layer-default')}) · 오른쪽 지출(red {contrastPair('chart-red', 'bg-layer-default')}) — 눈금 글자가 그 축의 계열 색. 두 값은 타일 · 툴팁이 숫자로 보인다. 계열이 셋이거나 단위가 같은 두 계열은 축 하나
        </Cap>
      </div>
    </Panel>
  );
};

const TooltipFig: Fig = ({ caption }) => {
  const look = CHL();
  const t = look.tooltip;
  const d = TREND[TODAY_DAY - 1];
  return (
    <Panel caption={caption}>
      <Wrap>
        <Col strong="가리킨 자리" cap={`세로 점선 · 점 ${look.point.size}(계열 색 + 카드 면 색 테두리 ${look.point.ring}) · 툴팁 — 점은 가리킨 자리에만`} w={380}>
          <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={420}>
            <Trend w={420} active={TODAY_DAY - 1} tiles={false} />
          </ChartBox>
        </Col>
        <Col strong="툴팁" cap={`bg-layer-floating · shadow-s3 · 모서리 ${t.radius} · 위아래 ${t.padY} · 좌우 ${t.padX} · 테두리 없음. 머리 ${parseFloat(t.head.fontSize)} fg-neutral-subtle, 줄 "■ 라벨 값" — 네모 ${t.swatch.size} · 라벨 ${parseFloat(t.row.fontSize)} fg-neutral-muted · 값 ${t.row.valueWeight} 원까지`} w={300}>
          {/* 1.25 배 — 안쪽 여백은 분홍 칠, 글 자리는 점선 상자. 치수 글은 흰 판의 여백 안에 둔다(잘리지 않게) */}
          <div className="rounded-xl" style={{ position: 'relative', background: rc('bg-layer-default'), paddingTop: 40, paddingBottom: 32, paddingLeft: 72, paddingRight: 32 }}>
            <div style={{ position: 'relative', display: 'inline-block', zoom: 1.25 }}>
              <Tip head={formatDay(TREND_YEAR, TREND_MONTH, TODAY_DAY)} rows={[{ label: '수입', value: won(d.income), color: rc('chart-blue') }, { label: '지출', value: won(d.expense), color: rc('chart-red') }]} />
              <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, right: 0, top: 0, height: t.padY, background: pinkFill, borderTopLeftRadius: t.radius, borderTopRightRadius: t.radius }} />
              <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, right: 0, bottom: 0, height: t.padY, background: pinkFill, borderBottomLeftRadius: t.radius, borderBottomRightRadius: t.radius }} />
              <span aria-hidden className="pointer-events-none absolute" style={{ left: 0, top: t.padY, bottom: t.padY, width: t.padX, background: pinkFill }} />
              <span aria-hidden className="pointer-events-none absolute" style={{ right: 0, top: t.padY, bottom: t.padY, width: t.padX, background: pinkFill }} />
              <span aria-hidden className="pointer-events-none absolute" style={{ left: t.padX, right: t.padX, top: t.padY, bottom: t.padY, outline: `1px dashed ${PINK}` }} />
              <DimV at={{ left: -10, top: 0 }} h={t.padY} label={`${t.padY}`} side="left" />
              <DimH at={{ left: 0, top: -8 }} w={t.padX} label={`${t.padX}`} below={false} />
            </div>
          </div>
        </Col>
      </Wrap>
    </Panel>
  );
};

const LegendTiles: Fig = ({ caption }) => {
  const look = CHL();
  const t = look.tile;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wrap>
          <Col strong="둘 다 켬" cap={`켠 타일 — chart-{색}-subtle 바탕, 점 ${t.dot} + 이름 ${parseFloat(t.name.fontSize)} · 합계 ${parseFloat(t.total.fontSize)} / ${parseFloat(t.total.lineHeight)} · ${t.total.fontWeight}`} w={340}>
            <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={380}>
              <Trend w={380} />
            </ChartBox>
          </Col>
          <Col strong="지출 끔" cap={`끈 타일 — 흰 면 + 안쪽 ${t.hiddenBorderW}px stroke-neutral-weak, 그 계열의 선이 사라진다(마지막 하나는 끌 수 없다)`} w={340}>
            <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={380}>
              <Trend w={380} hidden={['expense']} />
            </ChartBox>
          </Col>
        </Wrap>
        <Cap w={560}>타일 사이 {t.gap} · 타일 ↔ 차트 {t.gap} · 높이 {t.padY * 2 + parseFloat(t.name.lineHeight) + t.totalGap + parseFloat(t.total.lineHeight)} — 누르면 aria-pressed 가 바뀐다. 차트 아래 점 범례는 두지 않는다</Cap>
      </div>
    </Panel>
  );
};

// 끌 수 없는 마지막 타일 — 지출이 꺼져 수입 하나만 켜져 있다. 커서는 스크린샷에 찍히지 않아 실제 크기(약 34)로 겹쳐 그린다
// (그림의 수입 타일에 마우스를 올리면 실제 커서도 not-allowed 다 — Q-012-3 C)
function NoCursor({ left, top }: { left: number; top: number }) {
  return (
    <svg aria-hidden width={34} height={34} viewBox="0 0 34 34" style={{ position: 'absolute', left, top, pointerEvents: 'none', zIndex: 5, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.3))' }}>
      <path d="M1.5 1.5v24.2l6.1-5.9 4 9.4 4-1.7-4-9.3h8.6z" fill="#FFFFFF" stroke="#000000" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={24} cy={24} r={8} fill="#FFFFFF" stroke="#000000" strokeWidth={1.2} />
      <circle cx={24} cy={24} r={6} fill="none" stroke="#D40000" strokeWidth={2.4} />
      <path d="m19.8 28.2 8.4-8.4" stroke="#D40000" strokeWidth={2.4} />
    </svg>
  );
}
const LegendLocked: Fig = ({ caption }) => {
  const t = CHL().tile;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-5">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <ModeLabel mode={mode} />
            <div className="flex flex-wrap items-start justify-center gap-3 rounded-xl" style={{ background: rc('bg-layer-basement', mode), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
              <div style={{ position: 'relative' }}>
                <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} mode={mode} width={420}>
                  <Trend mode={mode} w={420} hidden={['expense']} />
                </ChartBox>
                <NoCursor left={CL().surface.pad + 70} top={CL().surface.pad + parseFloat(CL().title.lineHeight) + CL().header.padBottom + 26} />
              </div>
            </div>
          </div>
        ))}
        <Cap w={560}>
          수입 타일은 켠 색({'chart-{색}-subtle'}) 그대로다 — 회색으로 바꾸지 않는다. 마우스를 올리면 커서가 {t.lockedCursor}(v106 비활성 커서), 누르면 아무 일 없음 · 축소 없음(aria-disabled). 지출 타일을 다시 켜면 둘 다 누를 수 있다
        </Cap>
      </div>
    </Panel>
  );
};

// 도넛 두께 = 지름 ÷ 10 + 6(정수로) — 지름 여섯 실제 크기, 가장 나쁜 합계 "12,345,678원" 이 구멍에 드는지
const DONUT_DIAS = [112, 120, 140, 160, 176, 180];
const DonutThickness: Fig = ({ caption }) => {
  const look = CHL();
  const cat = categoryRows(look);
  const worst = '12,345,678원';
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-5">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col gap-2">
            <ModeLabel mode={mode} />
            <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-4 rounded-xl" style={{ background: rc('bg-layer-default', mode), paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }}>
              {DONUT_DIAS.map((d) => {
                const w = donutThickness(look, d);
                const fits = donutFits(look, worst, d);
                return (
                  <div key={d} className="flex flex-col items-center gap-1.5">
                    <DonutView look={look} mode={mode} slices={cat.slices.slice(0, 5)} diameter={d} centerLabel={fits ? `${TREND_MONTH}월 지출` : undefined} centerAmount={fits ? worst : undefined} label={`지름 ${d} 도넛`} />
                    <span className="text-[12px] tabular-nums" style={{ color: rc('fg-neutral-subtle', mode) }}>
                      지름 {d} · 두께 <b style={{ color: rc('fg-neutral', mode) }}>{w}</b> · 구멍 {d - w * 2}
                    </span>
                    <span className="text-[11.5px] font-semibold" style={{ color: rc(fits ? 'fg-positive' : 'fg-critical', mode) }}>
                      {fits ? '가운데 합계' : '가운데 글 뺌 → 목록 위 합계'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <Cap w={560}>
          두께 = 지름 ÷ {Math.round(1 / look.donut.perDiameter)} + {look.donut.offset} 을 정수로 — 문턱이 없어 지름을 따라 고르게 굵어진다(160 에서 튀지 않는다). 데스크톱 {look.donut.diameter} → {look.donut.thickness} · 폰 {look.donut.phone.diameter} → {look.donut.phone.thickness}. 가운데 합계는 가장 나쁜 값 {worst}(16 / 22 · 700)이 구멍에 들어갈 때만 — 아니면 목록 위 합계로
        </Cap>
      </div>
    </Panel>
  );
};

const DonutFig: Fig = ({ caption }) => {
  const look = CHL();
  const d = look.donut;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <ChartBox title={`${TREND_MONTH}월 카테고리별 지출`} width={380}>
          <Donut />
        </ChartBox>
        <Cap w={560}>
          지름 {d.diameter} · 두께 {d.thickness}(폰 {d.phone.diameter} · {d.phone.thickness} — 두께 = 지름 ÷ {Math.round(1 / d.perDiameter)} + {d.offset}) · 조각 사이 0. 가운데 합계 {parseFloat(d.center.fontSize)} / {parseFloat(d.center.lineHeight)} · {d.center.fontWeight} — 돈은 원까지. 범례는 줄마다 색 네모 {look.legendList.swatch} · 이름 · % · 금액 &quot;원&quot;, 상위 9 + 회색 &quot;기타&quot;. 하위가 있는 줄은 누르는 줄(화살표)
        </Cap>
      </div>
    </Panel>
  );
};

// 열지도 — 1280 칸 117 은 원까지, 1024 칸 81 은 세기 색만 + 누른 칸 툴팁. 가장 큰 칸에 고리를 두르지 않는다
const HeatmapFig: Fig = ({ caption }) => {
  const look = CHL();
  const h = look.heat;
  const wide = h.widths.find(([w]) => w === 1280)?.[1] ?? 117;
  const narrow = h.widths.find(([w]) => w === 1024)?.[1] ?? 81;
  const stepsCap = h.steps.map((s, i) => `${s}% ${h.fg.desk[i].light === 'static-white' ? '흰' : 'fg-neutral'}`).join(' · ');
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Col strong={`1280 — 칸 ${wide}(${h.threshold} 이상) · 원까지`} cap={`${parseFloat(h.value.fontSize)} / ${parseFloat(h.value.lineHeight)} · ${h.value.fontWeight} · 고정폭 숫자, 글자색은 단계마다(라이트 ${stepsCap} · 다크는 모두 fg-neutral). 넓은 칸에서도 가리키면 툴팁`} w={560}>
          <ChartBox title="요일 · 시간대별 지출" width={h.labelCol + (wide + h.gap) * 7 + CL().surface.pad * 2 + 2}>
            <HeatmapView look={look} rows={HEAT_ROWS} columns={HEAT_DAYS} columnsFull={HEAT_DAYS_FULL} cell={wide} label="요일 · 시간대별 지출" />
          </ChartBox>
        </Col>
        <Col strong={`1024 — 칸 ${narrow} · 세기 색만`} cap={`칸이 ${h.threshold} 보다 좁으면 글 없이 세기 다섯(${h.steps.join(' · ')}%)만 — 값은 칸을 가리키거나 누르면 뜨는 툴팁 · 표로 보기. 글자를 줄이거나 돈을 줄여 쓰지 않는다`} w={560}>
          <ChartBox title="요일 · 시간대별 지출" width={h.labelCol + (narrow + h.gap) * 7 + CL().surface.pad * 2 + 2}>
            <div style={{ paddingTop: 52 }}>
              <HeatmapView look={look} rows={HEAT_ROWS} columns={HEAT_DAYS} columnsFull={HEAT_DAYS_FULL} cell={narrow} active={[3, 2]} label="요일 · 시간대별 지출" />
            </div>
          </ChartBox>
        </Col>
        <Legend
          items={[
            ['칸', `정사각형 · 모서리 ${h.radius} · 사이 ${h.gap}`],
            ['라벨 열', `${h.labelCol} — 이름 ${parseFloat(h.name.fontSize)} · ${h.name.fontWeight} + 시간 ${parseFloat(h.time.fontSize)}`],
            ['세기', `bg-brand-solid ${h.steps.join(' · ')}%(가장 큰 값의 ${h.cuts.join(' · ')}% 에서 끊음) · 빈 칸 bg-neutral-weak`],
          ]}
        />
      </div>
    </Panel>
  );
};

const States: Fig = ({ caption }) => {
  const look = CHL();
  const ko = { enabled: '기본', hovered: '호버', pressed: '누름', focused: '포커스(웹)' } as const;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <Col strong="가리킴" cap="세로 점선 · 점 · 툴팁">
          <ChartBox width={420}>
            <Trend w={420} active={2} tiles={false} />
          </ChartBox>
        </Col>
        <Wrap gap="gap-4">
          {(['enabled', 'hovered', 'pressed', 'focused'] as const).map((s) => (
            <Col key={s} strong={`끈 타일 — ${ko[s]}`}>
              <div className="rounded-xl" style={{ background: rc('bg-layer-default'), paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12, width: 168 }}>
                <LegendTilesView look={look} items={[TREND_TILES[1]]} hidden={['expense']} states={{ expense: s }} />
              </div>
            </Col>
          ))}
        </Wrap>
        <Wrap gap="gap-4">
          {(['enabled', 'hovered', 'focused'] as const).map((s) => (
            <Col key={s} strong={`범례 줄 — ${ko[s]}`}>
              {/* 카드 안 줄 그대로 — 글은 카드 끝에서 24, 바탕은 들임만큼(List 규칙) */}
              <div style={{ background: rc('bg-layer-default'), borderRadius: CL().surface.radius, paddingTop: 8, paddingBottom: 8, width: 284 }}>
                <DonutLegendView look={look} rows={categoryRows(look).rows.slice(0, 1)} states={{ food: s }} padX={CL().surface.pad} bleed={0} />
              </div>
            </Col>
          ))}
        </Wrap>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const OrderGuide: Fig = ({ caption }) => {
  const look = CHL();
  const items = PALETTE_DEMO;
  const sum = items.reduce((s, c) => s + c.amount, 0);
  const seq: ChartHue[] = [...look.order];
  let k = 6;
  const sequential = items.map((c) => ({ key: c.key, label: c.label, hue: c.saved ?? seq[k++ % 9], amount: c.amount }));
  const grey = items.map((c) => ({ key: c.key, label: c.label, hue: (c.saved ?? 'gray') as ChartHue, amount: c.amount }));
  const good = assignChartColors(items, look.order).map((c) => ({ key: c.key, label: c.label, hue: c.color, amount: c.amount }));
  const view = (slices: typeof good) => (
    <div className="flex items-center gap-3">
      <DonutView look={look} slices={slices} diameter={look.donut.phone.diameter} label="카테고리별 지출" />
      <div style={{ width: 150 }}>
        <DonutLegendView look={look} rows={slices.map((s) => ({ key: s.key, label: s.label, hue: s.hue, percent: `${Math.round((s.amount / sum) * 100)}%`, amount: '' }))} bleed={0} />
      </div>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <Verdict ok note="저장된 색 먼저, 남은 항목은 쓰지 않은 색부터 — 구독 남색 · 의료 노랑">
          {view(good)}
        </Verdict>
        <Verdict ok={false} note="순번 그대로 — 7번째(빨강)가 저장된 빨강(경조사)과 겹친다">
          {view(sequential)}
        </Verdict>
        <Verdict ok={false} note="색 없는 항목에 회색 — &quot;기타&quot; 와 구분되지 않는다">
          {view(grey)}
        </Verdict>
      </div>
    </Panel>
  );
};

const FutureGuide: Fig = ({ caption }) => {
  const look = CHL();
  const full = (zero: boolean): TrendSeries[] => [{ key: 'expense', label: '지출', hue: 'red', values: Array.from({ length: MONTH_DAYS }, (_, i) => (i < TODAY_DAY ? TREND[i].expense : zero ? 0 : null)) }];
  const ticks = [0, 7, 14, 21, 28, 30];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="오늘(8일)에서 끝난 선 — 남은 날의 자리는 비워 둔다(눈금은 달 끝까지 둘 수 있다)">
          <ChartBox width={320}>
            <TrendChartView look={look} series={full(false)} count={MONTH_DAYS} xLabels={DAY_LABELS} xTicks={ticks} heads={DAY_HEADS} width={inner(320)} height={160} label="10월 지출 추이" />
          </ChartBox>
        </Verdict>
        <Verdict ok={false} note="31일까지 0 으로 — 선이 바닥으로 떨어져 &quot;지출이 줄었다&quot; 로 읽힌다">
          <ChartBox width={320}>
            <TrendChartView look={look} series={full(true)} count={MONTH_DAYS} xLabels={DAY_LABELS} xTicks={ticks} heads={DAY_HEADS} width={inner(320)} height={160} label="10월 지출 추이" />
          </ChartBox>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const NumberGuide: Fig = ({ caption }) => {
  const look = CHL();
  const cat = categoryRows(look);
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="축 눈금만 &quot;400만&quot; — 툴팁 · 가운데 · 범례는 원까지">
          <ChartBox width={320}>
            <Trend w={320} active={0} tiles={false} />
          </ChartBox>
        </Verdict>
        <Verdict ok={false} note="도넛 가운데 돈을 &quot;124만&quot; 으로 — 원까지 들어가지 않으면 가운데 글을 빼고 목록 위 합계로">
          <ChartBox width={320}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DonutView look={look} slices={cat.slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount="124만" label="카테고리별 지출" />
            </div>
          </ChartBox>
        </Verdict>
      </Pair>
    </Panel>
  );
};

const StatusGuide: Fig = ({ caption }) => {
  const sk = loadingKit('desk').skeleton;
  const r = resultSectionLook('desk');
  return (
    <Panel caption={caption}>
      <Wrap gap="gap-4">
        <Col strong="불러오는 동안" cap="머리 · 타일 이름은 그리고 차트 자리만 Skeleton(모서리 16)" w={260}>
          <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={300}>
            <div style={{ display: 'flex', gap: CHL().tile.gap }}>
              {TREND_TILES.map((t) => (
                <div key={t.key} style={{ flex: 1, borderRadius: CHL().tile.radius, background: rc(`chart-${t.hue}-subtle`), paddingTop: CHL().tile.padY, paddingBottom: CHL().tile.padY, paddingLeft: CHL().tile.padX, paddingRight: CHL().tile.padX }}>
                  <span style={{ display: 'block', fontSize: 13, lineHeight: '18px', color: rc('fg-neutral-muted') }}>{t.label}</span>
                  <span style={{ display: 'block', marginTop: 2 }}>
                    <SkeletonView look={sk} text="t5" width={80} />
                  </span>
                </div>
              ))}
            </div>
            <SkeletonView look={sk} radius="16" height={160} />
          </ChartBox>
        </Col>
        <Col strong="비었음" cap="빈 축 · 회색 고리 · 0 막대로 대신하지 않는다" w={260}>
          <ChartBox title={`${TREND_MONTH}월 지출`} width={300}>
            <ResultSectionView look={r} kind="empty" size="medium" inCard icon="receipt-text" title="이번 달 지출이 없어요" />
          </ChartBox>
        </Col>
        <Col strong="실패" cap="Result Section failure + 다시 시도" w={260}>
          <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={300}>
            <ResultSectionView look={r} kind="failure" size="medium" inCard title="추이를 불러오지 못했어요" description="잠시 뒤 다시 시도해주세요." primary={{ label: '다시 시도' }} />
          </ChartBox>
        </Col>
      </Wrap>
    </Panel>
  );
};

const A11yGuide: Fig = ({ caption }) => {
  const cols: TCol[] = [
    { key: 'day', label: '날짜' },
    { key: 'income', label: '수입', align: 'end' },
    { key: 'expense', label: '지출', align: 'end' },
  ];
  const rows: TRow[] = TREND.slice(0, 4).map((d, i) => ({ id: `a${i}`, name: dayHead(i), cells: { day: dayHead(i), income: won(d.income), expense: won(d.expense) } }));
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <Wrap gap="gap-4">
          <Col strong="요약 이름 · 목록 범례" w={340}>
            <div className="flex flex-col items-center gap-2">
              <ChartBox title={`${TREND_MONTH}월 수입 · 지출`} width={380}>
                <Trend w={380} />
              </ChartBox>
              <Reading tone="ok">그림, {TREND_LABEL}</Reading>
              <Reading tone="ok">계열, 수입 4,200,000원 눌림 · 지출 1,240,000원 눌림</Reading>
            </div>
          </Col>
          <Col strong="표로 보기" cap="날짜마다 값을 읽어야 하는 차트(추이 · 열지도)는 같은 값을 Table 로 — 숨긴 표 또는 펼치는 표" w={340}>
            <CardSurface look={CL()} body="list" width={380}>
              <CardHeaderView look={CL()} title={`${TREND_MONTH}월 날짜별 수입 · 지출`} body="list" />
              <TableView look={TL('desk')} caption={`${TREND_MONTH}월 날짜별 수입 · 지출`} columns={cols} rows={rows} minWidth={360} />
            </CardSurface>
          </Col>
        </Wrap>
        <Cap w={560}>차트 상자는 role=&quot;img&quot; + 요약 이름(&quot;{'{기간}'} {'{무엇}'} — {'{핵심 값}'}&quot;), 라이브러리가 붙이는 이름 없는 role=&quot;application&quot; 은 걷는다. 키보드로 들어가면 ← → 로 날짜를 옮기며 툴팁</Cap>
      </div>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — chart.md 의 코드 그대로 ────────────
const ExTrend: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={560} pad={24} bg="bg-layer-basement">
    <ExTrendDemo look={CHL()} card={CL()} />
  </CodePreview>
);
const ExDonut: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={400} pad={24} bg="bg-layer-basement">
    <ExDonutDemo look={CHL()} card={CL()} />
  </CodePreview>
);
const ExStatus: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={480} pad={24} bg="bg-layer-basement">
    <ExChartStatusDemo look={CHL()} card={CL()} result={resultSectionLook('desk')} table={TL('desk')} />
  </CodePreview>
);

export const chartFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  palette: Palette,
  axis: AxisFig,
  'dual-axis': DualAxis,
  tooltip: TooltipFig,
  'legend-tiles': LegendTiles,
  'legend-locked': LegendLocked,
  donut: DonutFig,
  'donut-thickness': DonutThickness,
  heatmap: HeatmapFig,
  states: States,
  'order-guide': OrderGuide,
  'future-guide': FutureGuide,
  'number-guide': NumberGuide,
  'status-guide': StatusGuide,
  'a11y-guide': A11yGuide,
  'ex-trend': ExTrend,
  'ex-donut': ExDonut,
  'ex-status': ExStatus,
};

