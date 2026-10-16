'use client';
// Tabs 페이지의 실제로 누르는 미리보기 — 코드 절(Line Fill · Line Hug · 두 단)과 플레이그라운드가 쓴다.
// 탭은 tabs.yaml · chip-tabs.yaml(tabs-view) 그대로다. 내용 칸은 안 고른 칸을 숨기기만 해 탭마다 스크롤 · 고름이 남는다.
// 화면 속 목록 · 막대 그래프는 아직 스펙이 없다 — 역할 색 토큰으로 간단히 그린다.
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { ChipTabsView, LineTabsView, TabPanel } from './tabs-view';
import { APPROVAL, BROKER_TABS, LEAVE_TABS, MINE, MONTHS, SCREEN_TABS, SPEND, STATS_TABS, STOCKS, VIEW_TABS, cleanId, won, type Hue } from './tabs-data';
import { tcv, type ChipTabsLook, type TabItem, type TabsLayout, type TabsLook, type TabsSize, type TabsTone, type ViewMode } from './tabs-shared';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
const t = (look: TabsLook, name: TabsTone, mode: ViewMode) => tcv(look.tone[name], mode);
// ── 조각 ─────────────────────────────────────────────────
// 줄 — 앞 동그라미(카테고리 색) · 제목 · 부제 · 뒤 값
export function DemoRow({ look, mode, title, sub, amount, hue = 'blue', trailing }: { look: TabsLook; mode: ViewMode; title: string; sub?: string; amount?: string; hue?: Hue; trailing?: ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[14px] font-bold" style={{ background: t(look, `chart-${hue}-weak` as TabsTone, mode), color: t(look, `chart-${hue}-contrast` as TabsTone, mode) }}>
        {title.slice(0, 1)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-medium" style={{ color: t(look, 'fg-neutral', mode) }}>
          {title}
        </span>
        {sub && (
          <span className="truncate text-[13px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
            {sub}
          </span>
        )}
      </span>
      {amount && (
        <span className="text-[15px] font-bold tabular-nums" style={{ color: t(look, 'fg-neutral', mode) }}>
          {amount}
        </span>
      )}
      {trailing}
    </li>
  );
}

// 자리 표시 줄 — 내용이 무엇인지보다 "바뀐다" 를 보이는 자리
export function Skeleton({ look, mode, widths = ['80%', '60%', '70%'] }: { look: TabsLook; mode: ViewMode; widths?: string[] }) {
  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      {widths.map((w, i) => (
        <span key={i} className="block h-2.5 rounded-full" style={{ width: w, background: t(look, 'bg-neutral-weak', mode) }} />
      ))}
    </div>
  );
}

// 코드 미리보기 판 — 회색 판 위 흰 화면(폭 w). 탭 목록은 화면 끝까지 닿는다
export function TabsDemoFrame({ look, children, w = 360, mode = 'auto' }: { look: TabsLook; children: ReactNode; w?: number; mode?: ViewMode }) {
  return (
    <figure className="not-prose my-6">
      <div className="rounded-2xl bg-[#E9E9EC] p-4 dark:bg-fd-muted sm:p-6">
        <div className="mx-auto w-full overflow-hidden rounded-xl" style={{ maxWidth: w, background: t(look, 'bg-layer-default', mode), fontFamily: FONT }}>
          {children}
        </div>
      </div>
    </figure>
  );
}

// 화면 제목 줄
function ScreenTitle({ look, mode, children }: { look: TabsLook; mode: ViewMode; children: ReactNode }) {
  return (
    <div className="flex h-12 items-center text-[17px] font-bold" style={{ paddingLeft: look.gutter, paddingRight: look.gutter, color: t(look, 'fg-neutral', mode) }}>
      {children}
    </div>
  );
}

// ── 통계 — Line Fill(카테고리 · 추이 · 비교) ──────────────
function CategoryPanel({ look, mode }: { look: TabsLook; mode: ViewMode }) {
  const total = SPEND.reduce((s, x) => s + x.amount, 0);
  return (
    <>
      <div className="text-[13px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
        10월 지출
      </div>
      <div className="pb-2 text-[22px] font-bold tabular-nums" style={{ color: t(look, 'fg-neutral', mode) }}>
        {won(total)}
      </div>
      <ul aria-label="카테고리별 지출" className="flex flex-col">
        {SPEND.map((x) => (
          <DemoRow key={x.name} look={look} mode={mode} title={x.name} sub={`${Math.round((x.amount / total) * 100)}%`} amount={won(x.amount)} hue={x.hue} />
        ))}
      </ul>
    </>
  );
}
function TrendPanel({ look, mode }: { look: TabsLook; mode: ViewMode }) {
  const max = Math.max(...MONTHS.map(([, v]) => v));
  return (
    <>
      <div className="text-[13px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
        달마다 지출
      </div>
      <ul aria-label="달마다 지출" className="mt-4 flex h-[180px] items-end justify-between gap-2">
        {MONTHS.map(([m, v], i) => (
          <li key={m} className="flex flex-1 flex-col items-center gap-1.5" aria-label={`${m} ${won(v)}`}>
            <span aria-hidden className="block w-full max-w-[28px] rounded-t-md" style={{ height: Math.round((v / max) * 140), background: t(look, i === MONTHS.length - 1 ? 'chart-blue' : 'bg-neutral-weak', mode) }} />
            <span aria-hidden className="text-[12px]" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
              {m}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
function ComparePanel({ look, mode }: { look: TabsLook; mode: ViewMode }) {
  const [, prev] = MONTHS[MONTHS.length - 2];
  const [, now] = MONTHS[MONTHS.length - 1];
  const max = Math.max(prev, now);
  return (
    <>
      <div className="text-[15px] font-bold" style={{ color: t(look, 'fg-neutral', mode) }}>
        지난달보다 {won(prev - now)} 덜 썼어요.
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {(
          [
            ['9월', prev, 'bg-neutral-weak'],
            ['10월', now, 'chart-blue'],
          ] as [string, number, TabsTone][]
        ).map(([m, v, tone]) => (
          <div key={m} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span style={{ color: t(look, 'fg-neutral-subtle', mode) }}>{m}</span>
              <span className="tabular-nums" style={{ color: t(look, 'fg-neutral', mode) }}>
                {won(v)}
              </span>
            </div>
            <span aria-hidden className="block h-3 rounded-full" style={{ width: `${(v / max) * 100}%`, background: t(look, tone, mode) }} />
          </div>
        ))}
      </div>
    </>
  );
}

export function StatsDemo({ look, mode = 'auto', layout, size, height = 360 }: { look: TabsLook; mode?: ViewMode; layout?: TabsLayout; size?: TabsSize; height?: number }) {
  const id = cleanId(useId());
  const [tab, setTab] = useState('category');
  // 세로 스크롤바는 숨기지 않는다(scroll-area — 6px 알약, .psa). 모드를 정한 그림은 막대 색을 그 모드 값으로.
  // 탭마다 넘침이 달라(카테고리만 넘친다) 막대가 생기고 없어지며 내용 폭이 6px 흔들린다 — 막대 자리를 늘 둔다(scrollbar-gutter)
  const panel = { height, overflowY: 'auto', scrollbarGutter: 'stable', boxSizing: 'border-box', paddingTop: 20, paddingBottom: 20, paddingLeft: look.gutter, paddingRight: look.gutter, '--psa-thumb': t(look, 'stroke-neutral-solid', mode) } as CSSProperties;
  return (
    <div>
      <ScreenTitle look={look} mode={mode}>
        통계
      </ScreenTitle>
      <LineTabsView look={look} mode={mode} layout={layout} size={size} items={STATS_TABS} value={tab} onValue={setTab} ariaLabel="통계" idBase={id} />
      <TabPanel idBase={id} value="category" active={tab === 'category'} className="psa" style={panel}>
        <CategoryPanel look={look} mode={mode} />
      </TabPanel>
      <TabPanel idBase={id} value="trend" active={tab === 'trend'} className="psa" style={panel}>
        <TrendPanel look={look} mode={mode} />
      </TabPanel>
      <TabPanel idBase={id} value="compare" active={tab === 'compare'} className="psa" style={panel}>
        <ComparePanel look={look} mode={mode} />
      </TabPanel>
    </div>
  );
}

// ── 금액 가리기 — Line Hug(화면 아홉) ──────────────────────
export function HideAmountsDemo({ look, mode = 'auto' }: { look: TabsLook; mode?: ViewMode }) {
  const id = cleanId(useId());
  const [tab, setTab] = useState('all');
  return (
    <div>
      <ScreenTitle look={look} mode={mode}>
        금액 가리기
      </ScreenTitle>
      <LineTabsView look={look} mode={mode} layout="hug" items={SCREEN_TABS} value={tab} onValue={setTab} ariaLabel="금액 가리기" idBase={id} />
      {SCREEN_TABS.map((s) => (
        <TabPanel key={s.value} idBase={id} value={s.value} active={tab === s.value} style={{ paddingTop: 20, paddingBottom: 24, paddingLeft: look.gutter, paddingRight: look.gutter }}>
          <div className="pb-3 text-[15px] font-bold" style={{ color: t(look, 'fg-neutral', mode) }}>
            {s.label}
          </div>
          <Skeleton look={look} mode={mode} />
        </TabPanel>
      ))}
    </div>
  );
}

// ── 휴가 신청(HR) — Line Hug medium, 승인할 신청이 있으면 승인 내역에 알림 점(보면 지운다) ──────────
function LeaveRows({ look, mode, rows, label }: { look: TabsLook; mode: ViewMode; rows: [string, string, string, string][]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col">
      {rows.map(([a, b, c, d], i) => (
        <li key={i} className="flex items-center gap-3 py-3 text-[14px]" style={{ borderTop: i ? `1px solid ${t(look, 'stroke-neutral-subtle', mode)}` : undefined }}>
          <span className="w-[76px] shrink-0 font-bold" style={{ color: t(look, 'fg-neutral', mode) }}>
            {a}
          </span>
          <span className="min-w-0 flex-1 truncate" style={{ color: t(look, 'fg-neutral-muted', mode) }}>
            {b}
          </span>
          <span className="tabular-nums" style={{ color: t(look, 'fg-neutral-subtle', mode) }}>
            {c}
          </span>
          <span className="w-[64px] shrink-0 text-right" style={{ color: t(look, d === '승인' ? 'fg-neutral-subtle' : 'fg-brand', mode) }}>
            {d}
          </span>
        </li>
      ))}
    </ul>
  );
}
export function LeaveDemo({ look, mode = 'auto' }: { look: TabsLook; mode?: ViewMode }) {
  const id = cleanId(useId());
  const [tab, setTab] = useState('mine');
  const [seen, setSeen] = useState(false);
  const items = LEAVE_TABS.map((it) => (it.value === 'approval' ? { ...it, notification: !seen } : it));
  return (
    <div>
      <ScreenTitle look={look} mode={mode}>
        휴가 신청
      </ScreenTitle>
      <LineTabsView
        look={look}
        mode={mode}
        layout="hug"
        size="medium"
        items={items}
        value={tab}
        onValue={(v) => {
          setTab(v);
          if (v === 'approval') setSeen(true);
        }}
        ariaLabel="휴가 신청"
        idBase={id}
      />
      <TabPanel idBase={id} value="mine" active={tab === 'mine'} style={{ paddingTop: 8, paddingBottom: 16, paddingLeft: look.gutter, paddingRight: look.gutter }}>
        <LeaveRows look={look} mode={mode} rows={MINE} label="내 신청" />
      </TabPanel>
      <TabPanel idBase={id} value="approval" active={tab === 'approval'} style={{ paddingTop: 8, paddingBottom: 16, paddingLeft: look.gutter, paddingRight: look.gutter }}>
        <LeaveRows look={look} mode={mode} rows={APPROVAL} label="승인할 신청" />
      </TabPanel>
    </div>
  );
}

// ── 증권 — 1차 Line(증권사) · 2차 Chip Tabs(보유 · 관심 · 발견). 증권사를 다녀와도 고른 보기가 남는다 ──────────
function BrokerPanel({ look, chip, mode, broker, idBase }: { look: TabsLook; chip: ChipTabsLook; mode: ViewMode; broker: TabItem; idBase: string }) {
  const [view, setView] = useState('holding');
  const vid = `${idBase}-${broker.value}`;
  return (
    <>
      <ChipTabsView look={chip} mode={mode} items={VIEW_TABS} value={view} onValue={setView} ariaLabel={`${broker.label} 보기`} idBase={vid} />
      {VIEW_TABS.map((v) => (
        <TabPanel key={v.value} idBase={vid} value={v.value} active={view === v.value} style={{ paddingBottom: 16, paddingLeft: look.gutter, paddingRight: look.gutter }}>
          <ul aria-label={`${broker.label} ${v.label}`} className="flex flex-col">
            {STOCKS[broker.value][v.value].map((s) => (
              <DemoRow key={s.name} look={look} mode={mode} title={s.name} sub={s.sub} amount={s.amount} hue={broker.value === 'namu' ? 'blue' : 'violet'} />
            ))}
          </ul>
        </TabPanel>
      ))}
    </>
  );
}
export function StocksDemo({ look, chip, mode = 'auto' }: { look: TabsLook; chip: ChipTabsLook; mode?: ViewMode }) {
  const id = cleanId(useId());
  const [broker, setBroker] = useState('namu');
  return (
    <div>
      <ScreenTitle look={look} mode={mode}>
        증권
      </ScreenTitle>
      <LineTabsView look={look} mode={mode} size="medium" items={BROKER_TABS} value={broker} onValue={setBroker} ariaLabel="증권사" idBase={id} />
      {BROKER_TABS.map((b) => (
        <TabPanel key={b.value} idBase={id} value={b.value} active={broker === b.value} style={{ minHeight: 260 }}>
          <BrokerPanel look={look} chip={chip} mode={mode} broker={b} idBase={id} />
        </TabPanel>
      ))}
    </div>
  );
}
