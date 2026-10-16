'use client';
// Tabs 플레이그라운드 — 모양(Line · Chip Tabs) · 폭 · 크기 · 탭 수 · 알림 점 · 막힌 탭을 고르면 스펙대로 그린 탭과 그 코드가 바뀐다.
// 실제로 누르고 ← → · Home · End 로 옮길 수 있다. 코드는 tabs.md 의 "코드" 절과 같은 API(Tabs · TabsList · TabsTrigger · ChipTabsList · ChipTabsTrigger)로 쓴다.
import { useId, useMemo, useState } from 'react';
import { BRANDS, MODES, PlayFrame, Seg } from './select-playground';
import { BROKER_TABS, CATEGORY_TABS, SCREEN_TABS, STATS_TABS, VIEW_TABS, cleanId } from './tabs-data';
import { Skeleton } from './tabs-demos';
import { tcv, type ChipTabsLook, type ChipTabsSize, type ChipTabsVariant, type TabItem, type TabsLayout, type TabsLook, type TabsSize, type ViewMode } from './tabs-shared';
import { ChipTabsView, LineTabsView, TabPanel } from './tabs-view';

type Kind = 'line' | 'chip';
const KINDS = [
  ['line', 'Line'],
  ['chip', 'Chip Tabs'],
] as const;
// 탭 수마다 화면 — 2 설정 > 카테고리 · 3 통계 · 4 이상 금액 가리기(앞에서부터)
const LINE_COUNTS = [2, 3, 4, 5, 6, 9] as const;
const CHIP_COUNTS = [2, 3] as const;
function lineSet(n: number): { aria: string; items: TabItem[] } {
  if (n === 2) return { aria: '카테고리', items: CATEGORY_TABS };
  if (n === 3) return { aria: '통계', items: STATS_TABS };
  return { aria: '금액 가리기', items: SCREEN_TABS.slice(0, n) };
}
// 5개까지 Fill, 6개부터 Hug(tabs.md "폭")
const autoLayout = (n: number): TabsLayout => (n >= 6 ? 'hug' : 'fill');

const attr = (cond: boolean, s: string) => (cond ? [s] : []);
const trig = (tag: string, it: TabItem, pad: string) => `${pad}<${tag} ${[`value="${it.value}"`, ...attr(!!it.notification, 'notification={hasNew}'), ...attr(!!it.disabled, 'disabled')].join(' ')}>${it.label}</${tag}>`;

function lineCode(o: { layout: TabsLayout; size: TabsSize; aria: string; items: TabItem[]; look: TabsLook }) {
  const list = [...attr(o.layout !== o.look.defaults.layout, `layout="${o.layout}"`), ...attr(o.size !== o.look.defaults.size, `size="${o.size}"`), `aria-label="${o.aria}"`];
  return [
    'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"',
    '',
    '<Tabs value={tab} onValueChange={setTab}>',
    `  <TabsList ${list.join(' ')}>`,
    ...o.items.map((it) => trig('TabsTrigger', it, '    ')),
    '  </TabsList>',
    ...o.items.map((it) => `  <TabsContent value="${it.value}">…</TabsContent>`),
    '</Tabs>',
  ].join('\n');
}
function chipCode(o: { variant: ChipTabsVariant; size: ChipTabsSize; items: TabItem[]; look: ChipTabsLook; broker: TabItem }) {
  const list = [...attr(o.variant !== o.look.defaults.variant, `variant="${o.variant}"`), ...attr(o.size !== o.look.defaults.size, `size="${o.size}"`), `aria-label="${o.broker.label} 보기"`];
  return [
    'import { ChipTabsList, ChipTabsTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"',
    '',
    '<Tabs value={broker} onValueChange={setBroker}>',
    '  <TabsList size="medium" aria-label="증권사">',
    ...BROKER_TABS.map((b) => `    <TabsTrigger value="${b.value}">${b.label}</TabsTrigger>`),
    '  </TabsList>',
    `  <TabsContent value="${o.broker.value}">`,
    '    <Tabs value={view} onValueChange={setView}>',
    `      <ChipTabsList ${list.join(' ')}>`,
    ...o.items.map((it) => trig('ChipTabsTrigger', it, '        ')),
    '      </ChipTabsList>',
    ...o.items.map((it) => `      <TabsContent value="${it.value}">…</TabsContent>`),
    '    </Tabs>',
    '  </TabsContent>',
    '  …',
    '</Tabs>',
  ].join('\n');
}

export function TabsPlayground({ looks, chips }: { looks: Record<'desk' | 'hr', TabsLook>; chips: Record<'desk' | 'hr', ChipTabsLook> }) {
  const base = looks.desk;
  const chipBase = chips.desk;
  const [kind, setKind] = useState<Kind>('line');
  const [count, setCountRaw] = useState(3);
  const [layout, setLayout] = useState<TabsLayout>(autoLayout(3));
  const [size, setSize] = useState<TabsSize>(base.defaults.size);
  const [variant, setVariant] = useState<ChipTabsVariant>(chipBase.defaults.variant);
  const [chipSize, setChipSize] = useState<ChipTabsSize>(chipBase.defaults.size);
  const [noti, setNotiRaw] = useState<'none' | 'one'>('none');
  // 알림 점은 그 탭을 고르면(내용을 보면) 사라진다 — 다시 켤 때까지
  const [seen, setSeen] = useState(false);
  const [dis, setDis] = useState<'none' | 'one' | 'all'>('none');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<'desk' | 'hr'>('desk');
  const [broker, setBroker] = useState('namu');
  const id = cleanId(useId());
  const look = looks[brand];
  const chip = chips[brand];
  const counts: readonly number[] = kind === 'line' ? LINE_COUNTS : CHIP_COUNTS;
  const n = counts.includes(count) ? count : counts[counts.length - 1];
  const setCount = (c: number) => {
    setCountRaw(c);
    setSeen(false);
    if (kind === 'line') setLayout(autoLayout(c));
  };
  const switchKind = (k: Kind) => {
    setKind(k);
    setSeen(false);
    if (k === 'chip' && count > CHIP_COUNTS[CHIP_COUNTS.length - 1]) setCountRaw(3);
  };
  const setNoti = (v: 'none' | 'one') => {
    setNotiRaw(v);
    setSeen(false);
  };
  // 알림 점은 둘째 탭, 막힌 탭은 마지막 탭(또는 목록 전체)
  const decorate = (items: TabItem[], withSeen: boolean) =>
    items.map((it, i) => ({ ...it, notification: noti === 'one' && i === 1 && !(withSeen && seen), disabled: dis === 'all' || (dis === 'one' && i === items.length - 1) }));
  const line = lineSet(n);
  const lineItems = decorate(line.items, true);
  const chipItems = decorate(VIEW_TABS.slice(0, n), true);
  const brokerItem = BROKER_TABS.find((b) => b.value === broker) ?? BROKER_TABS[0];
  // 코드는 점을 본 뒤에도 notification={hasNew} 를 그대로 보인다(값이 false 가 될 뿐이다)
  const code = useMemo(
    () => (kind === 'line' ? lineCode({ layout, size, aria: line.aria, items: decorate(line.items, false), look: base }) : chipCode({ variant, size: chipSize, items: decorate(VIEW_TABS.slice(0, n), false), look: chipBase, broker: brokerItem })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, layout, size, line.aria, n, noti, dis, base, variant, chipSize, chipBase, brokerItem],
  );
  const surface = tcv(look.tone['bg-layer-default'], mode);
  const key = JSON.stringify([kind, n, noti, dis, brand, layout, size, variant, chipSize]);
  const [tab, setTab] = useState<string | undefined>(undefined);
  const items = kind === 'line' ? lineItems : chipItems;
  // 고른 탭 — 막힌 탭은 고를 수 없다. 목록 전체가 막히면 고른 채 그대로 둔다(막대가 막힌 색이 된다)
  const cur = dis === 'all' ? (items.find((it) => it.value === tab)?.value ?? items[0].value) : (items.find((it) => it.value === tab && !it.disabled)?.value ?? items.find((it) => !it.disabled)?.value);
  const pick = (v: string) => {
    setTab(v);
    if (noti === 'one' && items.findIndex((it) => it.value === v) === 1) setSeen(true);
  };
  const panelPad = { paddingTop: 20, paddingBottom: 8, paddingLeft: look.gutter, paddingRight: look.gutter };
  // 내용 칸 — 탭마다 하나(안 고른 칸은 숨긴다). Chip Tabs 는 증권사 칸마다 따로 id 를 둔다
  const panels = (base: string, prefix = '') =>
    items.map((it) => (
      <TabPanel key={it.value} idBase={base} value={it.value} active={cur === it.value} style={panelPad}>
        <div className="pb-3 text-[15px] font-bold" style={{ color: tcv(look.tone['fg-neutral'], mode) }}>
          {prefix}
          {it.label}
        </div>
        <Skeleton look={look} mode={mode} widths={['80%', '55%']} />
      </TabPanel>
    ));

  const stage = (
    <div key={key} className="-mx-4 sm:mx-0" style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
      {kind === 'line' ? (
        <>
          <LineTabsView look={look} mode={mode} layout={layout} size={size} items={lineItems} value={cur} onValue={pick} ariaLabel={line.aria} idBase={`${id}-line`} />
          {panels(`${id}-line`)}
        </>
      ) : (
        <>
          <LineTabsView look={look} mode={mode} size="medium" items={BROKER_TABS} value={broker} onValue={setBroker} ariaLabel="증권사" idBase={`${id}-broker`} />
          {BROKER_TABS.map((b) => (
            <TabPanel key={b.value} idBase={`${id}-broker`} value={b.value} active={broker === b.value}>
              <ChipTabsView look={chip} mode={mode} variant={variant} size={chipSize} items={chipItems} value={cur} onValue={pick} ariaLabel={`${b.label} 보기`} idBase={`${id}-chip-${b.value}`} />
              {panels(`${id}-chip-${b.value}`, `${b.label} `)}
            </TabPanel>
          ))}
        </>
      )}
    </div>
  );

  const hint = kind === 'line' && layout === 'fill' && n >= 6 ? '6개부터는 Hug 로 둔다 — Fill 에 욱여넣으면 글이 칸을 넘는다.' : kind === 'line' && layout === 'hug' && n <= 5 ? '5개 이하 Hug 는 데스크톱의 넓은 카드 · 페이지 자리다.' : undefined;
  const notiHint = noti === 'one' ? (seen ? '둘째 탭을 봐서 점이 사라졌다 — 다시 보려면 알림 점을 껐다 켠다.' : '고른 탭에는 점이 없다 — 둘째 탭을 고르면 사라진다.') : undefined;
  return (
    <PlayFrame
      surface={surface}
      code={code}
      stage={stage}
      controls={
        <>
          <Seg label="모양" value={kind} options={KINDS} onChange={switchKind} />
          {kind === 'line' ? (
            <div className="flex flex-col gap-1.5">
              <Seg label="폭 layout" value={layout} options={(['fill', 'hug'] as const).map((l) => [l, `${l === 'fill' ? 'Fill' : 'Hug'}${l === base.defaults.layout ? '(기본)' : ''}`] as const)} onChange={setLayout} />
              {hint && <span className="text-[12px] text-fd-muted-foreground">{hint}</span>}
            </div>
          ) : (
            <Seg label="변형 variant" value={variant} options={(['solid', 'outline'] as const).map((v) => [v, `${v === 'solid' ? 'Solid' : 'Outline'}${v === chipBase.defaults.variant ? '(기본)' : ''}`] as const)} onChange={setVariant} />
          )}
          {kind === 'line' ? (
            <Seg label="크기 size" value={size} options={(['small', 'medium'] as const).map((s) => [s, `${s} ${base.sizes[s].h}${s === base.defaults.size ? '(기본)' : ''}`] as const)} onChange={setSize} />
          ) : (
            <Seg label="크기 size" value={chipSize} options={(['medium', 'large'] as const).map((s) => [s, `${s} ${chipBase.chip.sizes[chipBase.sizes[s]].h}${s === chipBase.defaults.size ? '(기본)' : ''}`] as const)} onChange={setChipSize} />
          )}
          <Seg label="탭 수" value={String(n)} options={counts.map((c) => [String(c), `${c}개`] as const)} onChange={(v) => setCount(Number(v))} />
          <div className="flex flex-col gap-1.5">
            <Seg label="알림 점 notification" value={noti} options={[['none', '없음'], ['one', '둘째 탭']] as const} onChange={setNoti} />
            {notiHint && <span className="text-[12px] text-fd-muted-foreground">{notiHint}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Seg label="막힌 탭 disabled" value={dis} options={[['none', '없음'], ['one', '마지막 탭'], ['all', '목록 전체']] as const} onChange={setDis} />
            {dis === 'all' && <span className="text-[12px] text-fd-muted-foreground">고른 탭이 막히면 막대도 막힌 색이다.</span>}
          </div>
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}
