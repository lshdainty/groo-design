// Tabs 페이지의 그림 — specs/components/tabs.md 의 `[그림: …](../../site/components/specs/tabs.tsx#<id>)` 자리.
// 탭은 tabs.yaml · chip-tabs.yaml 을 푼 값(tabsLook · chipTabsLook)으로, Chip Tabs 의 칩은 chip.yaml(ChipView) 그대로,
// Segmented 는 segmented-control.yaml(segmentedLook), 폼 칸 · 버튼은 field · input · button.yaml 로 그린다.
// 화면 속 목록 · 그래프는 아직 스펙이 없어 역할 색 토큰으로 간단히 그린다(kit).
// 폰 화면은 틀 바깥 360(스펙의 "360 폰" 수치를 그대로 잰다) — Line 목록은 화면 끝까지 닿는다.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { chipLook } from './chip-look';
import { ChipView } from './chip-view';
import { segmentedLook } from './segmented-control-look';
import { SegmentedView } from './segmented-control-view';
import { Cap, F, Surface, cta, tf } from './select-screens';
import { TfInputView } from './text-field-view';
import { PHONE_W, Phone, Row, Verdict, WebWindow, rc, type Mode } from './kit';
import { APPROVAL, BROKER_TABS, CATEGORY_TABS, LEAVE_TABS, MINE, MONTHS, SCREEN_TABS, SPEND, STATS_TABS, STOCKS, VIEW_TABS, won } from './tabs-data';
import { HideAmountsDemo, LeaveDemo, StatsDemo, StocksDemo, TabsDemoFrame } from './tabs-demos';
import { chipTabsLook, tabsLook, TABS_STATES, type TabItem, type TabsLook, type TabsState } from './tabs-look';
import { TabsPlayground } from './tabs-playground';
import { LedgerScreen as MoneyScreen } from './nav-screens';
import { ChipTabLabel, ChipTabsView, LineTabsView, type ChipTabsViewProps, type LineTabsViewProps } from './tabs-view';

type Fig = (p: { caption?: string }) => ReactNode;
type Brand = 'desk' | 'hr';
const tl = (brand: Brand = 'desk') => tabsLook(brand);
const ctl = (brand: Brand = 'desk') => chipTabsLook(brand);
const px = (v: string) => parseFloat(v);
// 그림의 폰 화면 폭 — kit 의 폰 폭(360)을 틀 바깥으로 둔다
const SCREEN = PHONE_W;
const STATE_KO: Record<TabsState, string> = { enabled: '기본', pressed: '누름', focused: '포커스(키보드)', disabled: '비활성' };

// ── 조각 ─────────────────────────────────────────────────
// 멈춘 Line 목록 · Chip Tabs 줄 — 수치 · 색은 tabsLook · chipTabsLook 에서
function T({ brand = 'desk', ...p }: Omit<LineTabsViewProps, 'look' | 'live'> & { brand?: Brand }) {
  return <LineTabsView look={tl(brand)} live={false} {...p} />;
}
function CT({ brand = 'desk', ...p }: Omit<ChipTabsViewProps, 'look' | 'live'> & { brand?: Brand }) {
  return <ChipTabsView look={ctl(brand)} live={false} {...p} />;
}
// 멈춘 Segmented — 같은 내용 거르기 자리(쓰임 비교)
function Seg({ items, value, mode = 'auto' }: { items: TabItem[]; value: string; mode?: Mode }) {
  return <SegmentedView look={segmentedLook()} live={false} items={items} value={value} mode={mode} />;
}

// 폰 화면 — 흰 바탕 · 화면 폭 360
function Screen({ title, mode = 'auto', scale = 0.62, h = 440, back = false, children }: { title?: string; mode?: Mode; scale?: number; h?: number; back?: boolean; children: ReactNode }) {
  return (
    <Phone title={title} back={back} mode={mode} scale={scale} h={h} bg="bg-layer-default" screenW={SCREEN}>
      {children}
    </Phone>
  );
}
// 화면 안 내용 — 좌우는 화면 여백
function Body({ children, top = 16, gap }: { children: ReactNode; top?: number; gap?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingTop: top, paddingLeft: tl().gutter, paddingRight: tl().gutter, gap }}>
      {children}
    </div>
  );
}
function Muted({ children, mode = 'auto', size = 13 }: { children: ReactNode; mode?: Mode; size?: number }) {
  return (
    <span style={{ fontSize: size, lineHeight: 1.4, color: rc('fg-neutral-subtle', mode) }}>
      {children}
    </span>
  );
}
function Strong({ children, mode = 'auto', size = 22 }: { children: ReactNode; mode?: Mode; size?: number }) {
  return (
    <span className="font-bold tabular-nums" style={{ fontSize: size, lineHeight: 1.35, color: rc('fg-neutral', mode) }}>
      {children}
    </span>
  );
}
// 그림을 줄여 그린다 — 자리는 줄인 크기만큼만 차지한다
function Scaled({ w, h, s, children }: { w: number; h: number; s: number; children: ReactNode }) {
  return (
    <div className="shrink-0" style={{ width: w * s, height: h * s }}>
      <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}

function Pin({ n }: { n: string }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
      {n}
    </span>
  );
}
const dashed = (offset = 0): CSSProperties => ({ outlineStyle: 'dashed', outlineWidth: 1, outlineColor: MARK_LINE, outlineOffset: offset });
const markBox: CSSProperties = { ...dashed(), background: MARK };
// 치수 띠 — 분홍 띠 + 숫자(디자인 도구의 간격 표시)
function Band({ style, label, side = 'top' }: { style: CSSProperties; label?: string; side?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'end' }) {
  const tag: CSSProperties =
    side === 'top'
      ? { left: '50%', bottom: '100%', transform: 'translate(-50%, -3px)' }
      : side === 'bottom'
        ? { left: '50%', top: '100%', transform: 'translate(-50%, 3px)' }
        : side === 'left'
          ? { right: '100%', top: '50%', transform: 'translate(-4px, -50%)' }
          : side === 'right'
            ? { left: '100%', top: '50%', transform: 'translate(4px, -50%)' }
            : side === 'end'
              ? { right: 4, top: '50%', transform: 'translateY(-50%)' }
              : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  return (
    <span aria-hidden className="absolute" style={{ background: MARK, ...style }}>
      {label && (
        <span className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, ...tag }}>
          {label}
        </span>
      )}
    </span>
  );
}

// 이렇게 · 이렇게 하지 않는다 — 좁은 화면에서는 위아래로
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[720px] flex-col gap-4 md:flex-row">{children}</div>;
const Stack = ({ children }: { children: ReactNode }) => <div className="flex w-full flex-col items-center gap-4">{children}</div>;
// 판 — 360 그림이 좁은 화면에서 넘치면 그 안에서 가로로 민다
const Wide = ({ children, className = '' }: { children: ReactNode; className?: string }) => <div className={`max-w-full overflow-x-auto ${className}`}>{children}</div>;

// ── 화면 조각 ─────────────────────────────────────────────
// 증권 — 1차 Line medium(증권사) + 2차 Chip Tabs(보기) + 보유 종목
function StocksScreen({ mode, broker = 'namu', view = 'holding', views = VIEW_TABS, scale, h = 440, extra }: { mode: Mode; broker?: string; view?: string; views?: TabItem[]; scale?: number; h?: number; extra?: ReactNode }) {
  return (
    <Screen title="증권" mode={mode} scale={scale} h={h}>
      <T mode={mode} size="medium" items={BROKER_TABS} value={broker} />
      <CT mode={mode} items={views} value={view} />
      {extra}
      <Body top={4}>
        {STOCKS[broker][view].map((s) => (
          <Row key={s.name} mode={mode} title={s.name} sub={s.sub} amount={s.amount} hue={broker === 'namu' ? 'blue' : 'violet'} />
        ))}
      </Body>
    </Screen>
  );
}
// 통계 — 1차 Line Fill(카테고리 · 추이 · 비교) + 10월 지출
function StatsScreen({ mode, value = 'category', scale, h = 440, rows = 4 }: { mode: Mode; value?: string; scale?: number; h?: number; rows?: number }) {
  const total = SPEND.reduce((s, x) => s + x.amount, 0);
  return (
    <Screen title="통계" mode={mode} scale={scale} h={h}>
      <T mode={mode} items={STATS_TABS} value={value} />
      <Body>
        <Muted mode={mode}>10월 지출</Muted>
        <Strong mode={mode}>{won(total)}</Strong>
        <div className="pt-2">
          {SPEND.slice(0, rows).map((x) => (
            <Row key={x.name} mode={mode} title={x.name} sub={`${Math.round((x.amount / total) * 100)}%`} amount={won(x.amount)} hue={x.hue} />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
// 가계부 — 목록 바로 위 Segmented(전체 · 지출 · 수입)
const LEDGER_ROWS: [string, string, string, string][] = [
  ['점심 식사', '식비 · 현대카드 M', '−12,000원', 'orange'],
  ['급여', '수입 · 국민은행', '+3,200,000원', 'green'],
  ['스타벅스', '카페 · 현대카드 M', '−5,600원', 'brown'],
  ['지하철', '교통 · 국민 체크카드', '−1,450원', 'blue'],
];
export const LEDGER_SEG: TabItem[] = [
  { value: 'all', label: '전체' },
  { value: 'expense', label: '지출' },
  { value: 'income', label: '수입' },
];
function LedgerScreen({ mode, scale, h = 440 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="가계부" mode={mode} scale={scale} h={h}>
      <Body top={12}>
        <Seg mode={mode} items={LEDGER_SEG} value="all" />
        <div className="pt-2">
          {LEDGER_ROWS.map(([title, sub, amount, hue]) => (
            <Row key={title} mode={mode} title={title} sub={sub} amount={amount} hue={hue} />
          ))}
        </div>
      </Body>
    </Screen>
  );
}
// HR 휴가 신청(데스크톱) — 카드 맨 위 Hug medium, 승인 내역에 알림 점
function HrLeaveWindow({ mode, w = 480, value = 'mine', items = LEAVE_TABS }: { mode: Mode; w?: number; value?: string; items?: TabItem[] }) {
  const rows = value === 'mine' ? MINE : APPROVAL;
  const g = tl('hr').gutter;
  return (
    <WebWindow mode={mode} w={w} h={300} url="hr.groo.app">
      <div className="flex h-full flex-col" style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <div className="overflow-hidden rounded-xl" style={{ background: rc('bg-layer-default', mode, 'hr') }}>
          <div className="text-[17px] font-bold" style={{ paddingTop: 18, paddingBottom: 6, paddingLeft: g, paddingRight: g, color: rc('fg-neutral', mode, 'hr') }}>
            휴가 신청
          </div>
          <T brand="hr" mode={mode} layout="hug" size="medium" items={items} value={value} />
          <div style={{ paddingTop: 4, paddingBottom: 8, paddingLeft: g, paddingRight: g }}>
            {rows.map(([a, b, c, d], i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 text-[13px]" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle', mode, 'hr')}` : undefined }}>
                <span className="w-[72px] shrink-0 font-bold" style={{ color: rc('fg-neutral', mode, 'hr') }}>
                  {a}
                </span>
                <span className="min-w-0 flex-1 truncate" style={{ color: rc('fg-neutral-muted', mode, 'hr') }}>
                  {b}
                </span>
                <span className="tabular-nums" style={{ color: rc('fg-neutral-subtle', mode, 'hr') }}>
                  {c}
                </span>
                <span className="w-[56px] shrink-0 text-right" style={{ color: rc(d === '승인' ? 'fg-neutral-subtle' : 'fg-brand', mode, 'hr') }}>
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WebWindow>
  );
}

// ── Overview ──────────────────────────────────────────────
// 증권(두 단) · 통계(Fill) · 휴가 신청(HR 데스크톱 Hug medium · 알림 점) — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-4">
        <StocksScreen mode="light" h={500} />
        <StatsScreen mode="dark" h={500} rows={5} />
      </div>
      <HrLeaveWindow mode="light" w={482} />
    </div>
  </Figure>
);

const Playground: Fig = () => <TabsPlayground looks={{ desk: tl('desk'), hr: tl('hr') }} chips={{ desk: ctl('desk'), hr: ctl('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// 2배로 그린다 — 치수 · 글자를 모두 곱한 look(색은 그대로)
function zoomTabs(l: TabsLook, k: number): TabsLook {
  const sizes = Object.fromEntries(
    Object.entries(l.sizes).map(([s, v]) => [s, { h: v.h * k, text: { ...v.text, fontSize: `${px(v.text.fontSize) * k}px`, lineHeight: `${px(v.text.lineHeight) * k}px` } }]),
  ) as TabsLook['sizes'];
  const layouts = Object.fromEntries(Object.entries(l.layouts).map(([n, v]) => [n, { ...v, padX: v.padX * k, inset: v.inset * k, scrollPadding: v.scrollPadding * k }])) as TabsLook['layouts'];
  return {
    ...l,
    sizes,
    layouts,
    list: { ...l.list, lineWidth: l.list.lineWidth * k },
    trigger: { ...l.trigger, padX: l.trigger.padX * k, padY: l.trigger.padY * k },
    indicator: { ...l.indicator, h: l.indicator.h * k },
    notification: { ...l.notification, size: l.notification.size * k, gap: l.notification.gap * k },
    ring: { ...l.ring, width: l.ring.width * k, offset: l.ring.offset * k },
  };
}
const ANATOMY_W = 250;
const Anatomy: Fig = ({ caption }) => {
  const k = 2;
  const z = zoomTabs(tl(), k);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-10 rounded-xl pk-surface px-10 pb-10 pt-16">
        <div style={{ width: ANATOMY_W * k }}>
          <LineTabsView
            look={z}
            live={false}
            layout="fill"
            size="small"
            items={LEAVE_TABS}
            value="mine"
            zone={{ list: dashed(4) }}
            tabZone={{ mine: { label: markBox }, approval: { trigger: dashed(-1) } }}
            tabPins={{ mine: { label: <Pin n="ⓒ" /> }, approval: { trigger: <Pin n="ⓑ" />, notification: <Pin n="ⓔ" /> } }}
            pins={{ list: <Pin n="ⓐ" />, indicator: <Pin n="ⓓ" /> }}
            pinLine={MARK_LINE}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted sm:grid-cols-5">
          {[
            ['ⓐ', 'List'],
            ['ⓑ', 'Tab'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Indicator'],
            ['ⓔ', 'Notification'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-center text-[12px] pk-muted">2배로 그렸다 — Fill · small, 고른 탭 아래 막대, 둘째 탭에 알림 점</span>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 폭 — Fill(칸을 똑같이 나누고 막대를 들인다) · Hug(글만큼, 넘치면 스크롤) · 데스크톱의 넓은 자리
function FillMarked() {
  const lk = tl();
  const L = lk.layouts.fill;
  const n = STATS_TABS.length;
  const tabW = SCREEN / n;
  const bar = tabW - L.inset * 2;
  const h = lk.sizes[lk.defaults.size].h;
  return (
    <div className="relative" style={{ width: SCREEN, paddingTop: 40, paddingBottom: 34 }}>
      <div className="relative">
        <T items={STATS_TABS} value="category" layout="fill" />
        {/* 칸 경계 */}
        {Array.from({ length: n - 1 }, (_, i) => (
          <span key={i} aria-hidden className="absolute top-0" style={{ left: tabW * (i + 1), height: h, borderLeft: `1px dashed ${MARK_LINE}` }} />
        ))}
        <Band style={{ left: 0, width: tabW, top: -14, height: 3 }} label={`칸 ${Math.round(tabW * 10) / 10}`} />
        <Band style={{ left: 0, width: L.inset, top: h + 6, height: 10 }} label={String(L.inset)} side="bottom" />
        <Band style={{ left: L.inset + bar, width: L.inset, top: h + 6, height: 10 }} label={String(L.inset)} side="bottom" />
        <span aria-hidden className="absolute text-center text-[10px] font-bold leading-4" style={{ left: L.inset, width: bar, top: h + 3, color: MARK_LINE }}>
          막대 {Math.round(bar * 10) / 10}
        </span>
      </div>
    </div>
  );
}
function HugMarked() {
  const lk = tl();
  const L = lk.layouts.hug;
  const P = lk.trigger.padX;
  const h = lk.sizes[lk.defaults.size].h;
  return (
    <div className="relative" style={{ width: 'max-content', paddingTop: 36, paddingBottom: 26 }}>
      <div className="relative">
        <T items={SCREEN_TABS} value="all" layout="hug" style={{ width: 'max-content', overflowX: 'visible', overflowY: 'visible' }} />
        <Band style={{ left: 0, width: L.padX, top: 0, height: h }} label={String(L.padX)} side="top" />
        <Band style={{ left: L.padX, width: P, top: 0, height: h, opacity: 0.6 }} />
        <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: L.padX + P, top: h + 6, color: MARK_LINE }}>
          ↑ 첫 글 {L.padX + P}(목록 {L.padX} + 탭 {P})
        </span>
        {/* 화면 밖 — 가로로 스크롤해 본다 */}
        <span aria-hidden className="absolute top-0 pk-basement" style={{ left: SCREEN, right: 0, height: h, opacity: 0.72 }} />
        <span aria-hidden className="absolute" style={{ left: SCREEN, top: -18, height: h + 30, borderLeft: `1px dashed ${MARK_LINE}` }} />
        <span aria-hidden className="absolute whitespace-nowrap text-[10px] font-bold leading-4" style={{ left: SCREEN + 6, top: -18, color: MARK_LINE }}>
          화면 끝 {SCREEN} — 넘친 탭은 가로 스크롤
        </span>
      </div>
    </div>
  );
}
// HR 권한(데스크톱) — 2개여도 넓은 카드에서는 Hug
function HrAuthorityWindow({ mode = 'auto' }: { mode?: Mode }) {
  const g = tl('hr').gutter;
  const roles: [string, string][] = [
    ['관리자', '구성원 · 휴가 정책 · 권한을 관리해요.'],
    ['팀장', '팀원의 휴가 신청을 승인해요.'],
    ['구성원', '휴가를 신청하고 내역을 봐요.'],
  ];
  return (
    <WebWindow mode={mode} w={560} h={250} url="hr.groo.app">
      <div className="flex h-full flex-col" style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
        <div className="overflow-hidden rounded-xl" style={{ background: rc('bg-layer-default', mode, 'hr') }}>
          <div className="text-[17px] font-bold" style={{ paddingTop: 18, paddingBottom: 6, paddingLeft: g, paddingRight: g, color: rc('fg-neutral', mode, 'hr') }}>
            권한
          </div>
          <T brand="hr" mode={mode} layout="hug" size="medium" items={[{ value: 'role', label: '역할' }, { value: 'user', label: '사용자' }]} value="role" />
          <div style={{ paddingTop: 2, paddingBottom: 8, paddingLeft: g, paddingRight: g }}>
            {roles.map(([a, b], i) => (
              <div key={a} className="flex items-center gap-4 py-2.5 text-[13px]" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle', mode, 'hr')}` : undefined }}>
                <span className="w-[56px] shrink-0 font-bold" style={{ color: rc('fg-neutral', mode, 'hr') }}>
                  {a}
                </span>
                <span style={{ color: rc('fg-neutral-muted', mode, 'hr') }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WebWindow>
  );
}
const Layout: Fig = ({ caption }) => {
  const lk = tl();
  const inset = lk.layouts.fill.inset;
  const bars = [2, 3, 4, 5].map((n) => Math.round((SCREEN / n - inset * 2) * 10) / 10);
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Wide>
            <Surface className="w-max" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 8, paddingBottom: 8 }}>
              <FillMarked />
            </Surface>
          </Wide>
          <Cap strong="Fill — 5개 이하 · 짧은 글">
            칸을 똑같이 나눠 꽉 채우고 막대는 칸에서 좌우 {inset} 씩 들인다 — {SCREEN} 화면 2 · 3 · 4 · 5개면 막대 {bars.join(' · ')}
          </Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Wide className="w-full">
            <Surface className="w-max" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 8, paddingBottom: 8 }}>
              <HugMarked />
            </Surface>
          </Wide>
          <Cap strong="Hug — 6개 이상 · 긴 글">
            탭이 글만큼(글 + 좌우 {lk.trigger.padX}) · 목록 좌우 {lk.layouts.hug.padX} · 넘치면 가로 스크롤 — 고른 탭이 화면 밖이면 {lk.layouts.hug.scrollPadding} 여유를 두고 그쪽으로
          </Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Wide>
            <HrAuthorityWindow />
          </Wide>
          <Cap strong="데스크톱의 넓은 카드 · 페이지 — 2개여도 Hug">칸을 나누면 탭이 지나치게 넓어지는 자리 · HR 권한(역할 · 사용자)</Cap>
        </div>
      </div>
    </Panel>
  );
};

// 크기 — small 40 · medium 44. 첫 탭에 위 · 글 · 아래 띠(글은 아래로 붙는다)
const SIZE_ITEMS: Record<'small' | 'medium', { items: TabItem[]; where: string }> = {
  small: { items: STATS_TABS, where: '기본 — 통계 · 금액 가리기' },
  medium: { items: BROKER_TABS, where: '주목도가 큰 1차 — 증권사 · 휴가 신청' },
};
const Size: Fig = ({ caption }) => {
  const lk = tl();
  return (
    <Panel caption={caption}>
      <Surface>
        <div className="flex flex-col">
          {(['small', 'medium'] as const).map((s, i) => {
            const S = lk.sizes[s];
            const lh = px(S.text.lineHeight);
            const bottom = lk.trigger.padY;
            const top = S.h - bottom - lh;
            const { items, where } = SIZE_ITEMS[s];
            const tabW = SCREEN / items.length;
            return (
              <div key={s} className="flex flex-col gap-4 py-5" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle')}` : undefined }}>
                <div className="flex flex-col gap-0.5">
                  <b className="text-[14px] pk-text">
                    {s} {S.h}
                    {s === lk.defaults.size && <span className="font-normal pk-muted"> (기본)</span>}
                  </b>
                  <span className="text-[12px] leading-4 pk-muted">{where}</span>
                  <span className="text-[12px] leading-4 pk-muted">
                    글 {px(S.text.fontSize)} / {lh} · {S.text.fontWeight}
                  </span>
                  <span className="text-[12px] leading-4 pk-muted">
                    위 {top} · 아래 {bottom} · 좌우 {lk.trigger.padX}
                  </span>
                </div>
                <Wide>
                  <div className="relative" style={{ width: SCREEN, marginLeft: 28, marginRight: 36 }}>
                    <T items={items} value={items[0].value} size={s} />
                    <Band style={{ left: 0, width: tabW, top: 0, height: top, opacity: 0.8 }} label={String(top)} side="left" />
                    <span aria-hidden className="absolute" style={{ left: 0, width: tabW, top, height: lh, ...dashed(-1) }} />
                    <Band style={{ left: 0, width: tabW, top: top + lh, height: bottom, opacity: 0.8 }} label={String(bottom)} side="left" />
                    <Band style={{ right: -14, width: 4, top: 0, height: S.h }} label={String(S.h)} side="right" />
                  </div>
                </Wide>
              </div>
            );
          })}
        </div>
      </Surface>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">
        분홍 띠 — 위아래 여백(글은 아래 {lk.trigger.padY} 에 붙고 남는 높이는 위로) · 점선 — 글 줄 · 글은 고르든 안 고르든 {lk.sizes.small.text.fontWeight}
      </p>
    </Panel>
  );
};

// 상태 넷 × 안 고름 · 고름 — 라이트 · 다크
const States: Fig = ({ caption }) => {
  const table = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto">
        {/* 좁은 화면에서는 상태 이름을 줄 위로 올린다 — 표가 판 안에 들어가게 */}
        <div className="mx-auto grid w-max grid-cols-2 items-center gap-x-3 gap-y-2 sm:grid-cols-[max-content_max-content_max-content] sm:gap-x-4 sm:gap-y-3">
          <span className="hidden sm:block" />
          {['안 고름', '고름'].map((h) => (
            <span key={h} className="text-center">
              <Muted mode={mode} size={12}>
                {h}
              </Muted>
            </span>
          ))}
          {TABS_STATES.map((st) => (
            <Fragment key={st}>
              <span className="col-span-2 pt-1 text-[12px] font-bold leading-4 sm:col-span-1 sm:pt-0" style={{ color: rc('fg-neutral', mode) }}>
                {STATE_KO[st]}
              </span>
              {[false, true].map((on) => (
                <div key={String(on)} className="w-[112px]">
                  <T mode={mode} layout="hug" items={[{ value: 'a', label: '추이' }]} value={on ? 'a' : 'x'} states={{ a: st }} />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>누름은 탭 축소만(색 그대로) · 포커스 링은 탭 안쪽 · 막히면 글 fg-disabled, 고른 채 막히면 막대도 fg-disabled</Cap>
    </div>
  );
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-4">
        {table('light')}
        {table('dark')}
      </div>
    </Panel>
  );
};

// Chip Tabs — 변형 둘 × 크기 둘(라이트 · 다크) · 목록 치수(1차 Line 아래)
const ChipTabsFig: Fig = ({ caption }) => {
  const c = ctl();
  const chip = chipLook();
  const lk = tl();
  const matrix = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Surface mode={mode} className="overflow-x-auto" style={{ paddingLeft: 8, paddingRight: 8 }}>
        <div className="mx-auto grid w-max grid-cols-1 items-center gap-y-1 sm:grid-cols-[max-content_max-content] sm:gap-y-2">
          {(['solid', 'outline'] as const).map((v) =>
            (['medium', 'large'] as const).map((s) => (
              <Fragment key={`${v}-${s}`}>
                <span className="pt-2 text-[12px] leading-4 sm:pr-1 sm:pt-0" style={{ color: rc('fg-neutral', mode) }}>
                  <b>{v === 'solid' ? 'Solid' : 'Outline'}</b>
                  <span className="block" style={{ color: rc('fg-neutral-subtle', mode) }}>
                    {s} {chip.sizes[c.sizes[s]].h}
                    {v === c.defaults.variant && s === c.defaults.size ? ' · 기본' : ''}
                  </span>
                </span>
                <CT mode={mode} variant={v} size={s} items={VIEW_TABS} value="holding" />
              </Fragment>
            )),
          )}
        </div>
      </Surface>
      <Cap strong={mode === 'light' ? '라이트' : '다크'}>고르면 짙은 채움 — Outline 은 고르면 테두리를 지운다</Cap>
    </div>
  );
  const h = chip.sizes[c.sizes[c.defaults.size]].h;
  const dotItems = VIEW_TABS.map((it) => (it.value === 'watch' ? { ...it, notification: true } : it));
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {matrix('light')}
          {matrix('dark')}
        </div>
        <div className="flex flex-col items-center gap-2">
          <Wide>
            <Surface style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 12 }}>
              <div style={{ width: SCREEN }}>
                <T size="medium" items={BROKER_TABS} value="namu" />
                {/* 목록 — 좌우 화면 여백 · 위아래 · 칩 사이 */}
                <div className="relative" style={{ paddingTop: c.padY, paddingBottom: c.padY }}>
                  <Band style={{ left: 0, right: 0, top: 0, height: c.padY, opacity: 0.6 }} label={String(c.padY)} side="end" />
                  <Band style={{ left: 0, right: 0, bottom: 0, height: c.padY, opacity: 0.6 }} label={String(c.padY)} side="end" />
                  <div className="flex items-center">
                    <span aria-hidden className="relative block shrink-0" style={{ width: c.padX, height: h, background: MARK }}>
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                        {c.padX}
                      </span>
                    </span>
                    {dotItems.map((it, i) => (
                      <Fragment key={it.value}>
                        {i > 0 && (
                          <span aria-hidden className="relative block shrink-0" style={{ width: c.gap, height: h, background: i === 1 ? MARK : undefined }}>
                            {i === 1 && (
                              <span className="absolute left-1/2 -translate-x-1/2 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ top: h + c.padY - 2, background: MARK_LINE }}>
                                {c.gap}
                              </span>
                            )}
                          </span>
                        )}
                        <ChipView look={chip} variant={c.variants[c.defaults.variant]} size={c.sizes[c.defaults.size]} selected={i === 0} state="enabled" label={<ChipTabLabel look={c} mode="auto" item={it} srNew="새 소식" />} />
                      </Fragment>
                    ))}
                  </div>
                </div>
                <Body top={4}>
                  {STOCKS.namu.holding.slice(0, 2).map((s) => (
                    <Row key={s.name} title={s.name} sub={s.sub} amount={s.amount} hue="blue" />
                  ))}
                </Body>
              </div>
            </Surface>
          </Wide>
          <Cap strong="1차 Line 아래 2차 Chip Tabs">
            목록 좌우 {c.padX}(화면 여백) · 위아래 {c.padY} · 칩 사이 {c.gap} · 바탕 · 바닥 선 없음 · 고른 칩이 화면 밖이면 {c.scrollPadding} 여유를 두고 스크롤 · 알림 점은 글 뒤 {c.notification.gap}(칩이 그만큼 넓어진다, 고른 칩에는 없다) · 1차 막대는 Fill 이라 칸에서 {lk.layouts.fill.inset} 들인다
          </Cap>
        </div>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 거래 추가(폰) — 거래 종류를 탭(나쁜 예) · 칩(좋은 예)으로
function TxAddScreen({ tabs = false, mode = 'auto' }: { tabs?: boolean; mode?: Mode }) {
  const t = tf();
  const kinds: TabItem[] = [
    { value: 'expense', label: '지출' },
    { value: 'income', label: '수입' },
    { value: 'transfer', label: '이체' },
  ];
  const chip = chipLook();
  return (
    <Phone title="거래 추가" mode={mode} scale={0.62} h={440} bg="bg-layer-default" screenW={SCREEN} bottom={cta('저장', mode)}>
      {tabs && <T mode={mode} items={kinds} value="expense" />}
      <div className="flex flex-col px-6 pt-4" style={{ gap: t.field.form.gapY }}>
        {!tabs && (
          <F mode={mode} label="거래 종류">
            <div className="flex flex-wrap" style={{ gap: chip.group.gap }}>
              {kinds.map((k, i) => (
                <ChipView key={k.value} look={chip} mode={mode} variant="outlineStrong" selected={i === 0} state="enabled" label={k.label} />
              ))}
            </div>
          </F>
        )}
        <F mode={mode} label="금액">
          <TfInputView look={t.input} mode={mode} size="large" state="enabled" value="12,000" suffix="원" />
        </F>
        <F mode={mode} label="메모">
          <TfInputView look={t.input} mode={mode} size="large" state="enabled" value="점심 식사" />
        </F>
      </div>
    </Phone>
  );
}
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Stack>
      <Pair>
        <Verdict ok note="다른 구역으로 옮긴다 — 화면 맨 위 Line 탭, 누르면 아래 내용 전체가 바뀐다">
          <StatsScreen mode="auto" />
        </Verdict>
        <Verdict ok note="같은 내용을 거른다 — 그 목록 바로 위 Segmented Control">
          <LedgerScreen mode="auto" />
        </Verdict>
      </Pair>
      <Pair>
        <Verdict ok note="저장할 폼 값은 Chip(하나 고르기) · Select">
          <TxAddScreen />
        </Verdict>
        <Verdict ok={false} note="폼 값을 탭으로 — 화살표로 옮기기만 해도 골라져 값이 바뀐다">
          <TxAddScreen tabs />
        </Verdict>
      </Pair>
    </Stack>
  </Panel>
);

// 폰 가계부 — 탭 바보다 더 나눌 때는 화면 위 1차 Line(Fill · medium). 탭 바(Bottom Navigation)는 어느 화면에서나 그대로
const MoneyGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="가계부 — 상단 바 바로 아래 Line 넷(가계부 · 자산 · 통계 · 예산), 탭 바는 홈 · 가계부 · + · 캘린더 · 전체 그대로">
        <MoneyScreen scale={0.46} h={600} value="ledger" />
      </Verdict>
      <Verdict ok note="자산을 골라도 탭 바는 바뀌지 않는다 — 지금 탭은 가계부, 캘린더 · 전체로 한 번에 간다">
        <MoneyScreen scale={0.46} h={600} value="assets" />
      </Verdict>
    </Pair>
  </Panel>
);

// 두 단 — 1차 Line · 2차 Chip Tabs, 필터 바(거르는 칩)가 있으면 2차도 Line
function FilterChips({ mode = 'auto' }: { mode?: Mode }) {
  const chip = chipLook();
  return (
    <div className="flex" style={{ gap: chip.group.gap, paddingLeft: tl().gutter, paddingRight: tl().gutter, paddingTop: 4, paddingBottom: 4 }}>
      <ChipView look={chip} mode={mode} variant="solid" selected state="enabled" label="국내" suffixIcon="chevron-down" />
      <ChipView look={chip} mode={mode} variant="solid" state="enabled" label="급상승" suffixIcon="chevron-down" />
    </div>
  );
}
const TwoTierGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Stack>
      <Pair>
        <Verdict ok note="1차 Line(증권사) · 2차 Chip Tabs(보기) — 모양이 달라 큰 갈래가 보인다">
          <StocksScreen mode="auto" />
        </Verdict>
        <Verdict ok={false} note="Chip Tabs 아래 필터 바 — 칩이 같은 모양이라 무엇이 탭인지 알 수 없다. 필터 바가 있으면 2차도 Line 으로">
          <StocksScreen mode="auto" view="discover" extra={<FilterChips />} />
        </Verdict>
      </Pair>
    </Stack>
  </Panel>
);

// 폭 — 6개 이상은 Hug, Fill 에 욱여넣으면 글을 자르게 된다
const SIX = SCREEN_TABS.filter((s) => ['all', 'home', 'asset', 'ledger', 'dutch', 'etc'].includes(s.value));
function HideScreen({ squeeze = false }: { squeeze?: boolean }) {
  return (
    <Screen title="금액 가리기" back h={300}>
      {squeeze ? <T items={SIX} value="all" layout="fill" squeeze /> : <T items={SCREEN_TABS} value="all" layout="hug" />}
      <Body>
        <Strong size={15}>전체</Strong>
        <Line3 />
      </Body>
    </Screen>
  );
}
function Line3({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex flex-col gap-2.5 pt-2">
      {['80%', '60%', '70%'].map((w, i) => (
        <span key={i} className="block h-2.5 rounded-full" style={{ width: w, background: rc('bg-neutral-weak', mode) }} />
      ))}
    </div>
  );
}
const FillHugGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="6개 이상은 Hug — 탭이 글만큼 넓고, 넘치면 가로로 스크롤한다">
        <HideScreen />
      </Verdict>
      <Verdict ok={false} note="Fill 에 6개를 욱여넣기 — 칸이 글보다 좁아 글이 잘린다">
        <HideScreen squeeze />
      </Verdict>
    </Pair>
  </Panel>
);

// 글 — 이름만 · 알림 점 하나 / 개수 · 여러 탭에 점
function CategoryScreen({ counts = false }: { counts?: boolean }) {
  const items = counts ? CATEGORY_TABS.map((c, i) => ({ ...c, label: `${c.label} ${i ? 9 : 23}` })) : CATEGORY_TABS;
  return (
    <Screen title="카테고리" back h={300}>
      <T items={items} value="expense" />
      <Body>
        {['식비', '카페', '교통'].map((c, i) => (
          <Row key={c} title={c} sub={['점심 · 저녁 · 장보기', '커피 · 디저트', '버스 · 지하철 · 택시'][i]} hue={['orange', 'brown', 'blue'][i]} />
        ))}
      </Body>
    </Screen>
  );
}
// 알림 점 — 고른 탭(보유)에는 없다. 새 소식이 있는 탭 하나(관심) · 여러 탭(관심 · 발견)
function DotScreen({ dots }: { dots: string[] }) {
  return <StocksScreen mode="auto" h={330} views={VIEW_TABS.map((it) => ({ ...it, notification: dots.includes(it.value) }))} />;
}
const LabelGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Stack>
      <Pair>
        <Verdict ok note="이름만 — 개수가 필요하면 내용 안에서 보인다">
          <CategoryScreen />
        </Verdict>
        <Verdict ok={false} note='글에 개수 — "지출 23" 처럼 수가 바뀔 때마다 탭 폭이 흔들린다'>
          <CategoryScreen counts />
        </Verdict>
      </Pair>
      <Pair>
        <Verdict ok note="새 소식은 그 탭 하나에 알림 점 — 내용을 보면 지운다(고른 탭에는 없다)">
          <DotScreen dots={['watch']} />
        </Verdict>
        <Verdict ok={false} note="여러 탭에 알림 점 — 새 소식은 한 탭에만 단다">
          <DotScreen dots={['watch', 'discover']} />
        </Verdict>
      </Pair>
    </Stack>
  </Panel>
);

// 내용 — 폰 1차 탭 밀어 넘기기(손을 따라 움직인다) · 웹은 1차 탭을 주소에
function SwipeScreen({ mode = 'auto' }: { mode?: Mode }) {
  const total = SPEND.reduce((s, x) => s + x.amount, 0);
  const shift = Math.round(SCREEN * 0.3);
  const max = Math.max(...MONTHS.map(([, v]) => v));
  return (
    <Screen title="통계" mode={mode} h={440}>
      <T mode={mode} items={STATS_TABS} value="category" />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* 지금 칸(카테고리)이 왼쪽으로 밀려 나가고, 이웃 칸(추이)이 손을 따라 들어온다 */}
        <div className="absolute inset-y-0" style={{ left: -shift, width: SCREEN }}>
          <Body>
            <Muted mode={mode}>10월 지출</Muted>
            <Strong mode={mode}>{won(total)}</Strong>
            <div className="pt-2">
              {SPEND.slice(0, 3).map((x) => (
                <Row key={x.name} mode={mode} title={x.name} amount={won(x.amount)} hue={x.hue} />
              ))}
            </div>
          </Body>
        </div>
        <div className="absolute inset-y-0" style={{ left: SCREEN - shift, width: SCREEN, borderLeft: `1px solid ${rc('stroke-neutral-subtle', mode)}` }}>
          <Body>
            <Muted mode={mode}>달마다 지출</Muted>
            <div className="mt-4 flex h-[150px] items-end gap-3">
              {MONTHS.map(([m, v], i) => (
                <span key={m} className="block w-6 rounded-t-md" style={{ height: Math.round((v / max) * 130), background: rc(i === MONTHS.length - 1 ? 'chart-blue' : 'bg-neutral-weak', mode) }} />
              ))}
            </div>
          </Body>
        </div>
        {/* 손가락 — 왼쪽으로 민다 */}
        <span aria-hidden className="absolute flex items-center gap-1" style={{ left: SCREEN - shift - 34, top: 150 }}>
          <span className="text-[22px] font-bold" style={{ color: MARK_LINE }}>
            ←
          </span>
          <span className="block h-11 w-11 rounded-full" style={{ background: MARK, outline: `2px solid ${MARK_LINE}` }} />
        </span>
      </div>
    </Screen>
  );
}
function UrlWindow({ mode = 'auto' }: { mode?: Mode }) {
  const g = tl().gutter;
  const max = Math.max(...MONTHS.map(([, v]) => v));
  return (
    <WebWindow mode={mode} w={520} h={340} url="desk.groo.app/stats?tab=trend">
      <div className="flex h-full flex-col" style={{ background: rc('bg-layer-default', mode) }}>
        <div className="text-[20px] font-bold" style={{ paddingTop: 20, paddingBottom: 8, paddingLeft: g, paddingRight: g, color: rc('fg-neutral', mode) }}>
          통계
        </div>
        <T mode={mode} layout="hug" size="medium" items={STATS_TABS} value="trend" />
        <div style={{ paddingTop: 16, paddingLeft: g, paddingRight: g }}>
          <Muted mode={mode}>달마다 지출</Muted>
          <div className="mt-4 flex h-[150px] items-end gap-5">
            {MONTHS.map(([m, v], i) => (
              <div key={m} className="flex flex-col items-center gap-1.5">
                <span className="block w-8 rounded-t-md" style={{ height: Math.round((v / max) * 120), background: rc(i === MONTHS.length - 1 ? 'chart-blue' : 'bg-neutral-weak', mode) }} />
                <Muted mode={mode} size={12}>
                  {m}
                </Muted>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WebWindow>
  );
}
const ContentGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">
      <div className="flex flex-col items-center gap-2">
        <SwipeScreen />
        <Cap strong="폰 — 1차 탭만 밀어 넘긴다">내용이 손을 따라 움직이고, 놓으면 이웃 탭으로 넘어간다 · 2차 탭 · Segmented · 가로로 스크롤하는 영역 위에서는 넘기지 않는다</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        {/* 주소 막대를 크게 — 1차 탭이 주소에 남는다 */}
        <span className="rounded-lg px-3 py-1.5 text-[13px] leading-5 pk-surface" style={{ boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}` }}>
          <span className="pk-muted">desk.groo.app/stats</span>
          <b className="rounded px-0.5 pk-text" style={{ background: MARK }}>
            ?tab=trend
          </b>
        </span>
        <Scaled w={520} h={340} s={0.56}>
          <UrlWindow />
        </Scaled>
        <Cap strong="웹 — 1차 탭을 주소에">?tab=trend — 뒤로 가기 · 링크 · 새로고침이 같은 탭(추이)을 연다. 탭마다 스크롤 · 입력은 남는다</Cap>
      </div>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) ───────────────────
const ExFill: Fig = () => (
  <TabsDemoFrame look={tl()}>
    <StatsDemo look={tl()} />
  </TabsDemoFrame>
);
const ExHug: Fig = () => (
  <div className="flex flex-col">
    <TabsDemoFrame look={tl()}>
      <HideAmountsDemo look={tl()} />
    </TabsDemoFrame>
    <TabsDemoFrame look={tl('hr')} w={520}>
      <LeaveDemo look={tl('hr')} />
    </TabsDemoFrame>
  </div>
);
const ExTwoTier: Fig = () => (
  <TabsDemoFrame look={tl()}>
    <StocksDemo look={tl()} chip={ctl()} />
  </TabsDemoFrame>
);

export const tabsFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  size: Size,
  states: States,
  'chip-tabs': ChipTabsFig,
  'role-guide': RoleGuide,
  'money-guide': MoneyGuide,
  'two-tier-guide': TwoTierGuide,
  'fill-hug-guide': FillHugGuide,
  'label-guide': LabelGuide,
  'content-guide': ContentGuide,
  'ex-fill': ExFill,
  'ex-hug': ExHug,
  'ex-two-tier': ExTwoTier,
};
