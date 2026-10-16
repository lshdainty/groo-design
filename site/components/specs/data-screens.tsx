// 데이터 표시 묶음(Table · Card · Chart · Searchable List · Swipe Actions) 페이지가 같이 쓰는 그림 조각(서버, 빌드 때).
// 부품은 data-look 이 YAML 에서 푼 값으로(data-*-view), 목록 줄은 list.yaml(ListView), 화면 틀은 kit · nav-screens 로 그린다.
// 화면 예시의 글 · 금액은 지어낸 것이다(data-data). 돈은 원까지 · 빼기는 U+2212.
import type { CSSProperties, ReactNode } from 'react';
import { tokenValue } from '@/lib/component-spec';
import { MARK, MARK_LINE } from '../foundations/ui';
import { CardActionView, CardHeaderView, CardSurface, HeroCardView, StatView, type CardMarks, type CardPins, type DeltaSpec } from './data-card-view';
import { ChartTooltipView, DonutLegendView, DonutView, HeatmapView, LegendTilesView, TrendChartView, type LegendRow, type Slice, type TileItem, type TrendSeries } from './data-chart-view';
import { APPROVERS, BANK_GROUPS, CATEGORIES, HAS_CHILDREN, HEAT_DAYS, HEAT_DAYS_FULL, HEAT_ROWS, HR_USERS, MONTHLY, NET_WORTH, STATS, TODAY, TODAY_DAY, TREND, TREND_MONTH, TREND_TOTAL, TREND_YEAR, days, type HrUser, type Spend } from './data-data';
import { assignChartColors, cardLook, chartLook, dataTones, formatWon, searchLook, swipeKit, tableLook, type CardState, type ChartHue, type DataTone, type ViewMode } from './data-look';
import { formatDay } from './data-shared';
import { DAY_HEADS, DAY_LABELS } from './data-chart-data';
import { TableView, type TCol, type TRow } from './data-table-view';
import { institutions, logoFace, logoTileLook } from './image-look';
import { LogoTileView } from './image-view';
import { imageFrameLook } from './image-look';
import { AvatarView } from './display-view';
import type { AvatarSize } from './display-shared';
import { avatarLook } from './display-look';
import { Phone, rc, type Mode } from './kit';
import { listLook } from './list-look';
import type { ListState, RowSpec } from './list-shared';
import { ListView } from './list-view';
import { Desktop, DeskHeader, ScreenTitle, Shell, Side } from './nav-screens';

export type Fig = (p: { caption?: string }) => ReactNode;
export type Brand = 'desk' | 'hr';
export const TL = (brand: Brand = 'hr') => tableLook(brand);
export const CL = () => cardLook();
export const CHL = (brand: Brand = 'desk') => chartLook(brand);
export const SL = () => searchLook();
export const SW = () => swipeKit();
export const TONES = (brand: Brand = 'desk') => dataTones(brand);
export const tone = (name: DataTone | string, mode: Mode = 'auto', brand: Brand = 'desk') => rc(name, mode, brand);
export const MODES = ['light', 'dark'] as const;
export const modeKo = (m: Mode) => (m === 'dark' ? '다크' : m === 'light' ? '라이트' : '');
// 화면 끝 — spacing-global-gutter(앱 화면 끝 24)
export const EDGE = parseFloat(String(tokenValue('$spacing-global-gutter')));
export const SCREEN_W = 360;
export const won = formatWon;

// ── 판 · 글 ───────────────────────────────────────────────
// 바닥 판 — 카드를 놓는 회색 바닥(bg-layer-basement)
export function Floor({ children, mode = 'auto', brand = 'desk', pad = EDGE, gap, style, className = '' }: { children: ReactNode; mode?: Mode; brand?: Brand; pad?: number; gap?: number; style?: CSSProperties; className?: string }) {
  return (
    <div className={`rounded-xl ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: gap ?? CL().surface.gap, background: rc('bg-layer-basement', mode, brand), paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad, boxSizing: 'border-box', ...style }}>
      {children}
    </div>
  );
}
export function ModeLabel({ mode }: { mode: Mode }) {
  return (
    <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>
      {modeKo(mode)}
    </span>
  );
}
// 분홍 치수 · 안내 선 — 그림 장식(토큰이 아니다)
export const PINK = MARK_LINE;
export const pinkFill = MARK;
export function GuideV({ x, top = 0, bottom = 0, style }: { x: number | string; top?: number | string; bottom?: number | string; style?: CSSProperties }) {
  return <span aria-hidden className="pointer-events-none absolute" style={{ left: x, top, bottom, width: 0, borderLeftWidth: 1, borderLeftStyle: 'dashed', borderLeftColor: PINK, zIndex: 20, ...style }} />;
}
export function GuideH({ y, left = 0, right = 0, style }: { y: number | string; left?: number | string; right?: number | string; style?: CSSProperties }) {
  return <span aria-hidden className="pointer-events-none absolute" style={{ top: y, left, right, height: 0, borderTopWidth: 1, borderTopStyle: 'dashed', borderTopColor: PINK, zIndex: 20, ...style }} />;
}
// 치수 — 양끝 막대가 있는 분홍 선 + 숫자 알약. at 은 자리(left · top · right · bottom), 선의 길이는 w · h
export function DimH({ at, w, label, below = true, align = 'center' }: { at: CSSProperties; w: number; label: string; below?: boolean; align?: 'center' | 'start' }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ ...at, width: w, height: 0, zIndex: 25 }}>
      <span className="absolute" style={{ left: 0, right: 0, top: 0, borderTopWidth: 1.5, borderTopStyle: 'solid', borderTopColor: PINK }} />
      <span className="absolute" style={{ left: 0, top: -4, height: 9, borderLeftWidth: 1.5, borderLeftStyle: 'solid', borderLeftColor: PINK }} />
      <span className="absolute" style={{ right: 0, top: -4, height: 9, borderLeftWidth: 1.5, borderLeftStyle: 'solid', borderLeftColor: PINK }} />
      <Pill style={{ left: align === 'start' ? 2 : '50%', top: below ? 5 : undefined, bottom: below ? undefined : 5, transform: align === 'start' ? undefined : 'translateX(-50%)' }}>{label}</Pill>
    </span>
  );
}
export function DimV({ at, h, label, side = 'right' }: { at: CSSProperties; h: number; label: string; side?: 'left' | 'right' }) {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ ...at, height: h, width: 0, zIndex: 25 }}>
      <span className="absolute" style={{ top: 0, bottom: 0, left: 0, borderLeftWidth: 1.5, borderLeftStyle: 'solid', borderLeftColor: PINK }} />
      <span className="absolute" style={{ left: -4, top: 0, width: 9, borderTopWidth: 1.5, borderTopStyle: 'solid', borderTopColor: PINK }} />
      <span className="absolute" style={{ left: -4, bottom: 0, width: 9, borderTopWidth: 1.5, borderTopStyle: 'solid', borderTopColor: PINK }} />
      <Pill style={{ top: '50%', left: side === 'right' ? 6 : undefined, right: side === 'left' ? 6 : undefined, transform: 'translateY(-50%)' }}>{label}</Pill>
    </span>
  );
}
export function Pill({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="absolute whitespace-nowrap rounded px-1.5 text-[10px] font-bold leading-[15px] text-white" style={{ background: PINK, ...style }}>
      {children}
    </span>
  );
}

// ── 카드 ──────────────────────────────────────────────────
export function CardHead(p: Omit<Parameters<typeof CardHeaderView>[0], 'look'>) {
  return <CardHeaderView look={CL()} {...p} />;
}
export function CardAction(p: Omit<Parameters<typeof CardActionView>[0], 'look'>) {
  return <CardActionView look={CL()} {...p} />;
}
// 오늘 쓴 돈 — List 줄(앞 타일 · 제목 · 설명 · 금액). 금액은 빼기 U+2212
export const spendRow = (s: Spend, state?: ListState): RowSpec => ({ kind: 'button', prefix: { tile: s.tile, icon: s.icon }, title: s.title, detail: s.detail, suffix: { amount: won(s.amount) }, state });
export function ListCard({ mode = 'auto', title = '오늘 쓴 돈', action = '전체 보기', rows = TODAY.map((s) => spendRow(s)), width = '100%', live = false, marks, pins, style }: { mode?: Mode; title?: string; action?: string; rows?: RowSpec[]; width?: number | string; live?: boolean; marks?: CardMarks; pins?: CardPins; style?: CSSProperties }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode} body="list" width={width} marks={marks} pins={pins} style={style}>
      <CardHeaderView look={c} mode={mode} title={title} action={action} body="list" live={live} marks={marks} pins={pins} />
      <div style={{ position: 'relative', ...marks?.list }}>
        {pins?.list}
        <ListView look={c.list.look} rows={rows} mode={mode} live={live} bgRadius={c.list.itemRadius} ariaLabel={title} />
      </div>
    </CardSurface>
  );
}
export function StatCard({ mode = 'auto', i = 0, size = 'large', width = '100%', state, press = 'none', live = false, label, amount, delta }: { mode?: Mode; i?: number; size?: 'large' | 'small'; width?: number | string; state?: CardState; press?: 'none' | 'whole' | 'peers'; live?: boolean; label?: string; amount?: number; delta?: DeltaSpec }) {
  const s = STATS[i];
  return (
    <CardSurface look={CL()} mode={mode} width={width} state={state} press={press} live={live} label={label ?? s.label}>
      <StatView look={CL()} mode={mode} label={label ?? s.label} value={won(amount ?? s.amount)} size={size} delta={delta ?? s.delta} />
    </CardSurface>
  );
}
export function NetWorth({ mode = 'auto', width = '100%' }: { mode?: Mode; width?: number | string }) {
  return <HeroCardView look={CL()} mode={mode} label={NET_WORTH.label} amount={won(NET_WORTH.amount)} delta={NET_WORTH.delta} width={width} />;
}

// 폰 — Desk 홈(회색 바닥 위 카드: 순자산 · 지표 둘(한 줄에 하나) · 오늘 쓴 돈)
export function HomePhone({ mode = 'auto', scale = 0.62, h = 760, children }: { mode?: Mode; scale?: number; h?: number; children?: ReactNode }) {
  const c = CL();
  return (
    <Phone title="홈" back={false} mode={mode} scale={scale} h={h} bg="bg-layer-basement" screenW={SCREEN_W} tabs>
      <div style={{ display: 'flex', flexDirection: 'column', gap: c.surface.gap, paddingTop: 8, paddingLeft: EDGE, paddingRight: EDGE }}>
        {children ?? (
          <>
            <NetWorth mode={mode} />
            <StatCard mode={mode} i={0} />
            <StatCard mode={mode} i={1} />
            <ListCard mode={mode} />
          </>
        )}
      </div>
    </Phone>
  );
}

// 데스크톱 — Desk 홈(1280 · 사이드바 · 머리 · 격자 칸 사이 layout-gutter)
export function HomeDesktop({ mode = 'auto', s = 0.42, w = 1280, h = 760, children }: { mode?: Mode; s?: number; w?: number; h?: number; children?: ReactNode }) {
  const c = CL();
  return (
    <Desktop mode={mode} w={w} h={h} s={s}>
      <Shell mode={mode} side={<Side mode={mode} current="home" />} header={<DeskHeader mode={mode} />}>
        <ScreenTitle mode={mode}>홈</ScreenTitle>
        <div style={{ paddingTop: 20, paddingLeft: 32, paddingRight: 32 }}>
          {children ?? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: c.gutter }}>
              <div style={{ gridColumn: 'span 2' }}>
                <NetWorth mode={mode} />
              </div>
              <StatCard mode={mode} i={0} />
              <StatCard mode={mode} i={1} />
              <div style={{ gridColumn: 'span 2' }}>
                <ListCard mode={mode} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <BudgetCard mode={mode} />
              </div>
            </div>
          )}
        </div>
      </Shell>
    </Desktop>
  );
}
// 예산 카드 — 글 카드(머리 + 본문). 누르면 예산 상세(whole)
export function BudgetCard({ mode = 'auto', press = 'none', state, live = false, width = '100%' }: { mode?: Mode; press?: 'none' | 'whole'; state?: CardState; live?: boolean; width?: number | string }) {
  const c = CL();
  const used = 384400;
  const limit = 500000;
  const pct = Math.round((used / limit) * 100);
  return (
    <CardSurface look={c} mode={mode} press={press} state={state} live={live} width={width} label="10월 식비 예산">
      <CardHeaderView look={c} mode={mode} title="10월 식비 예산" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: c.content.gap }}>
        <span style={{ fontFamily: c.stat.value.sizes.large.fontFamily, fontSize: c.stat.value.sizes.large.fontSize, lineHeight: c.stat.value.sizes.large.lineHeight, fontWeight: c.stat.value.weight, color: rc('fg-neutral', mode), fontVariantNumeric: 'tabular-nums' }}>{won(limit - used)} 남았어요</span>
        <span style={{ display: 'block', height: 8, borderRadius: 9999, background: rc('bg-neutral-weak', mode), overflow: 'hidden' }}>
          <span style={{ display: 'block', width: `${pct}%`, height: '100%', borderRadius: 9999, background: rc('fg-neutral', mode) }} />
        </span>
        <span style={{ fontFamily: c.stat.label.fontFamily, fontSize: c.stat.label.fontSize, lineHeight: c.stat.label.lineHeight, color: rc('fg-neutral-subtle', mode), fontVariantNumeric: 'tabular-nums' }}>
          {won(limit)} 중 {won(used)} 썼어요({pct}%)
        </span>
      </div>
    </CardSurface>
  );
}

// ── 표 — HR 사용자 ────────────────────────────────────────
export const USER_COLS = (kind: 'text' | 'rich' = 'text'): TCol[] => [
  { key: 'name', label: '이름', sortable: true },
  ...(kind === 'text' ? [{ key: 'dept', label: '부서' } as TCol] : [{ key: 'dept', label: '부서' } as TCol]),
  { key: 'days', label: '남은 휴가', align: 'end', sortable: true },
  { key: 'status', label: '상태' },
];
export const userRow = (u: HrUser, kind: 'text' | 'rich' = 'text'): TRow => ({
  id: u.id,
  name: u.name,
  cells: {
    name: kind === 'rich' ? { text: u.name, detail: u.email, avatar: u.name, sortValue: u.name } : { text: u.name, sortValue: u.name },
    dept: kind === 'rich' ? { text: u.dept, detail: u.title } : u.dept,
    days: { text: days(u.days), sortValue: u.days },
    status: { badge: { label: u.status, tone: u.tone } },
  },
});
export const USER_MENU = [{ items: [{ value: 'edit', label: '수정', icon: 'pencil' as const }] }, { items: [{ value: 'delete', label: '삭제', icon: 'trash' as const, tone: 'critical' as const }] }];

export function UsersTable({ mode = 'auto', n = 5, kind = 'text', sort = { key: 'days', dir: 'descending' as const }, more = true, pressable = true, width, ...rest }: { mode?: Mode; n?: number; kind?: 'text' | 'rich'; sort?: { key: string; dir: 'ascending' | 'descending' } | null; more?: boolean; pressable?: boolean; width?: number } & Partial<Parameters<typeof TableView>[0]>) {
  return (
    <TableView
      look={TL()}
      mode={mode}
      caption="사용자"
      columns={USER_COLS(kind)}
      rows={HR_USERS.slice(0, n).map((u) => userRow(u, kind))}
      rowKind={kind}
      sort={sort}
      more={more}
      pressable={pressable}
      minWidth={width}
      {...rest}
    />
  );
}
// 표를 담은 카드 — 머리(제목) + 표가 가장자리까지(첫 칸 앞 · 끝 칸 뒤 24 는 표가 가진다)
export function TableCard({ mode = 'auto', title = '사용자', action, children, width = '100%', brand = 'hr' }: { mode?: Mode; title?: string; action?: string; children: ReactNode; width?: number | string; brand?: Brand }) {
  const c = CL();
  void brand;
  return (
    <CardSurface look={c} mode={mode} body="list" width={width}>
      <CardHeaderView look={c} mode={mode} title={title} action={action} body="list" />
      {children}
    </CardSurface>
  );
}
// HR 데스크톱 — 사용자 관리(사이드바 · 화면 제목 · 표 카드)
export function UsersDesktop({ mode = 'auto', s = 0.5, w = 1280, h = 560, children }: { mode?: Mode; s?: number; w?: number; h?: number; children?: ReactNode }) {
  return (
    <Desktop mode={mode} w={w} h={h} s={s} url="hr.porest.app">
      <Shell mode={mode} brand="hr" side={<Side brand="hr" mode={mode} current="users" />}>
        <ScreenTitle mode={mode} brand="hr" top={32}>
          사용자 관리
        </ScreenTitle>
        <div style={{ paddingTop: 20, paddingLeft: 32, paddingRight: 32 }}>
          {children ?? (
            <TableCard mode={mode} title="사용자 12명">
              <UsersTable mode={mode} n={6} />
            </TableCard>
          )}
        </div>
      </Shell>
    </Desktop>
  );
}
// 768 미만 — 같은 줄을 List 로(제목 이름 · 설명 "부서 · 상태" · 오른쪽 남은 휴가)
export function userListRow(u: HrUser, mode: Mode = 'auto', state?: ListState): RowSpec {
  const v = TL().narrowValue;
  return {
    kind: 'button',
    title: u.name,
    detail: `${u.dept} · ${u.status}`,
    suffixNode: <span style={{ fontFamily: v.fontFamily, fontSize: v.fontSize, lineHeight: v.lineHeight, fontWeight: v.fontWeight, color: rc('fg-neutral', mode, 'hr'), fontVariantNumeric: 'tabular-nums' }}>{days(u.days)}</span>,
    state,
  };
}
// 폰 — 같은 줄을 List 로. 정렬은 목록 위 고르기 하나("남은 휴가 많은 순"), 표와 같은 차례
export function UsersPhone({ mode = 'auto', scale = 0.62, h = 600, n = 7, title = '사용자 관리' }: { mode?: Mode; scale?: number; h?: number; n?: number; title?: string }) {
  const users = [...HR_USERS.slice(0, n)].sort((a, b) => b.days - a.days);
  const hd = listLook('hr').header.mediumWeak[mode === 'dark' ? 'dark' : 'light'];
  return (
    // 회색 바닥 위 머리 없는 목록 카드(위아래 12 — card.md). 정렬 고르기는 카드 위 바닥에
    <Phone title={title} mode={mode} scale={scale} h={h} screenW={SCREEN_W} brand="hr" bg="bg-layer-basement">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, paddingTop: hd.padY, paddingBottom: hd.padY, paddingLeft: EDGE, paddingRight: EDGE, fontFamily: hd.fontFamily, fontSize: hd.fontSize, lineHeight: hd.lineHeight, fontWeight: hd.fontWeight, color: rc('fg-neutral-subtle', mode, 'hr') }}>
        남은 휴가 많은 순
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <div style={{ paddingLeft: EDGE, paddingRight: EDGE }}>
        <CardSurface look={CL()} mode={mode} body="list" style={{ paddingTop: CL().list.padBottom }}>
          <ListView look={listLook('hr')} rows={users.map((u) => userListRow(u, mode))} mode={mode} live={false} bgRadius={CL().list.itemRadius} ariaLabel="사용자" />
        </CardSurface>
      </div>
    </Phone>
  );
}

// ── 차트 ──────────────────────────────────────────────────
// 10월 수입 · 지출 — 날마다(오늘 8일까지). 수입 blue(왼쪽) · 지출 red(오른쪽)
export const TREND_SERIES: TrendSeries[] = [
  { key: 'income', label: '수입', hue: 'blue', values: TREND.map((d) => d.income), axis: 'left' },
  { key: 'expense', label: '지출', hue: 'red', values: TREND.map((d) => d.expense), axis: 'right' },
];
export const TREND_TILES: TileItem[] = [
  { key: 'income', label: '수입', hue: 'blue', total: won(TREND_TOTAL.income) },
  { key: 'expense', label: '지출', hue: 'red', total: won(TREND_TOTAL.expense) },
];
export const dayHead = (i: number) => formatDay(TREND_YEAR, TREND_MONTH, i + 1);
export const dayLabel = (i: number) => `${i + 1}일`;
export const TREND_LABEL = `${TREND_MONTH}월 수입 · 지출 추이, 수입 ${won(TREND_TOTAL.income)} · 지출 ${won(TREND_TOTAL.expense)}`;
export function TrendChart(p: Partial<Parameters<typeof TrendChartView>[0]> & { mode?: Mode }) {
  return <TrendChartView look={CHL()} series={TREND_SERIES} count={TODAY_DAY} xLabels={DAY_LABELS} heads={DAY_HEADS} dual label={TREND_LABEL} height={200} {...p} />;
}
export function Tiles(p: Partial<Parameters<typeof LegendTilesView>[0]> & { mode?: Mode }) {
  return <LegendTilesView look={CHL()} items={TREND_TILES} {...p} />;
}
// 카드 속 차트 — 머리 + (지표 타일 ↔ 차트 8) + 차트
export function ChartCard({ mode = 'auto', title, action, children, width = '100%', marks }: { mode?: Mode; title: string; action?: string; children: ReactNode; width?: number | string; marks?: CardMarks }) {
  const c = CL();
  return (
    <CardSurface look={c} mode={mode} width={width} marks={marks}>
      <CardHeaderView look={c} mode={mode} title={title} action={action} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: CHL().tile.gap }}>{children}</div>
    </CardSurface>
  );
}
export function TrendCard({ mode = 'auto', width = '100%', hidden, active, chartW, title = `${TREND_MONTH}월 수입 · 지출` }: { mode?: Mode; width?: number | string; hidden?: string[]; active?: number | null; chartW?: number; title?: string }) {
  return (
    <ChartCard mode={mode} title={title} width={width}>
      <Tiles mode={mode} hidden={hidden} />
      <TrendChart mode={mode} hidden={hidden} active={active} width={chartW} />
    </ChartCard>
  );
}
// 카테고리 — 저장된 색 먼저, 나머지는 쓰지 않은 색부터, 10개를 넘으면 상위 9 + 회색 "기타"
export function categorySlices(items = CATEGORIES): Slice[] {
  return assignChartColors(items, CHL().order).map((i) => ({ key: i.key, label: i.label, hue: i.color as ChartHue, amount: i.amount }));
}
export function legendRows(slices: Slice[]): LegendRow[] {
  const total = slices.reduce((s, x) => s + x.amount, 0);
  return slices.map((s) => ({ key: s.key, label: s.label, hue: s.hue, percent: `${Math.round((s.amount / total) * 1000) / 10}%`, amount: won(s.amount), pressable: HAS_CHILDREN.has(s.key) }));
}
export const CAT_TOTAL = CATEGORIES.reduce((s, c) => s + c.amount, 0);
export function DonutCard({ mode = 'auto', width = '100%', active, n = 10, title = `${TREND_MONTH}월 카테고리별 지출` }: { mode?: Mode; width?: number | string; active?: string | null; n?: number; title?: string }) {
  const slices = categorySlices();
  return (
    <ChartCard mode={mode} title={title} width={width}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <DonutView look={CHL()} mode={mode} slices={slices} centerLabel={`${TREND_MONTH}월 지출`} centerAmount={won(CAT_TOTAL)} label={`${TREND_MONTH}월 카테고리별 지출, 합계 ${won(CAT_TOTAL)}`} legendId="cat-legend" active={active} />
      </div>
      <DonutLegendView look={CHL()} mode={mode} rows={legendRows(slices).slice(0, n)} />
    </ChartCard>
  );
}
export function Heatmap(p: Partial<Parameters<typeof HeatmapView>[0]> & { mode?: Mode }) {
  return <HeatmapView look={CHL()} rows={HEAT_ROWS} columns={HEAT_DAYS} columnsFull={HEAT_DAYS_FULL} label="10월 요일 × 시간대 지출 — 가장 많이 쓴 때는 토요일 저녁 18~22시 240,000원" {...p} />;
}
export function Tip(p: Omit<Parameters<typeof ChartTooltipView>[0], 'look'>) {
  return <ChartTooltipView look={CHL()} {...p} />;
}
export const MONTHLY_SERIES: TrendSeries[] = [
  { key: 'income', label: '수입', hue: 'blue', values: MONTHLY.map((m) => m.income) },
  { key: 'expense', label: '지출', hue: 'red', values: MONTHLY.map((m) => m.expense) },
];

// ── 검색해서 고르기 — 은행(기관 색 표 · 로고 타일 40) ─────────
export const bankPrefix = (name: string, mode: Mode = 'auto', size: '32' | '40' | '48' = '40') => {
  const f = logoFace(name, 'institution', institutions(), logoTileLook());
  return <LogoTileView look={logoTileLook()} frame={imageFrameLook()} mode={mode} size={size} name={name} paint={{ bg: f.bg, fg: f.fg }} />;
};
export const BANK_SEARCH = BANK_GROUPS.map((g) => ({ label: g.label, items: g.items.map((n) => ({ value: n, title: n, keywords: institutions().find((x) => x.name === n)?.aliases ?? [] })) }));
export const bankPrefixes = (mode: Mode = 'auto') => Object.fromEntries(BANK_GROUPS.flatMap((g) => g.items).map((n) => [n, bankPrefix(n, mode)]));
export const personPrefix = (name: string, mode: Mode = 'auto', size: AvatarSize = '42') => <AvatarView look={avatarLook()} mode={mode} size={size} name={name} />;
export const PEOPLE_SEARCH = [{ items: APPROVERS.map((p) => ({ value: p.value, title: p.name, detail: p.team, detailText: p.team })) }];
export const peoplePrefixes = (mode: Mode = 'auto') => Object.fromEntries(APPROVERS.map((p) => [p.value, personPrefix(p.name, mode)]));

export type ViewModeT = ViewMode;
