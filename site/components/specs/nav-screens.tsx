// 화면 틀 · 이동 묶음의 그림 조각(서버) — 폰 · 데스크톱 화면, 그 안의 목록 · 카드. 부품은 NavKit(nav-look — YAML)으로 그린다.
// 화면 속 목록 · 카드 · 표는 아직 스펙이 없거나 다른 스펙의 것이라 역할 색으로 간단히 그린다(kit).
import type { CSSProperties, ReactNode } from 'react';
import { MARK, MARK_LINE } from '../foundations/ui';
import { menuKit } from './menu-look';
import { loadingKit } from './loading-look';
import { tabsLook } from './tabs-look';
import { LineTabsView } from './tabs-view';
import { Phone, Row, WebWindow, cardStack, rc, type Mode } from './kit';
import { cardLook, tableLook } from './data-look';
import { CardHeaderView, CardSurface, StatView } from './data-card-view';
import { TableView, type TBadge, type TCol, type TRow } from './data-table-view';
import { ASSET_ROWS, DESK_NAV, DESK_TABS, HR_NAV, LEDGER_ROWS, MONEY_TABS, NOTICE_ROWS, addLabelFor, type NavRow } from './nav-data';
import { navKit } from './nav-look';
import { ncv, tabBottom, type Brand, type NavKit, type SideGroup, type TabSize, type TopAction } from './nav-shared';
import { SideNav, SidePanelView, type SideNavProps, type SidePanelViewProps } from './nav-side-view';
import { FabView, NavGlyph, TabBar, TopNavBar, type TabBarProps, type TopNavBarProps } from './nav-view';
import { buttonLook } from './button-look';
import { ButtonView, type IconName } from './button-view';
import { textFieldLook } from './text-field-look';
import { TfInputView } from './text-field-view';

export type Fig = (p: { caption?: string }) => ReactNode;
export const NK = (brand: Brand = 'desk'): NavKit => navKit(brand);
export const PHONE = 360;
export const modeKo = (m: Mode) => (m === 'dark' ? '다크' : m === 'light' ? '라이트' : '');

// ── 부품 줄임 ─────────────────────────────────────────────
export function Bar({ brand = 'desk', ...p }: Omit<TopNavBarProps, 'look'> & { brand?: Brand }) {
  return <TopNavBar look={NK(brand).top} {...p} />;
}
export function Pill({ brand = 'desk', tab = 'home', addLabel, items, ...p }: Omit<TabBarProps, 'look' | 'items' | 'addLabel' | 'current'> & { brand?: Brand; tab?: string; addLabel?: string; items?: TabBarProps['items'] }) {
  return <TabBar look={NK(brand).tab} items={items ?? DESK_TABS} current={tab} addLabel={addLabel ?? addLabelFor(tab)} {...p} />;
}
export function Side({ brand = 'desk', groups, logo, ...p }: Omit<SideNavProps, 'look' | 'bubble' | 'logo' | 'brand' | 'groups'> & { brand?: Brand; groups?: SideGroup[]; logo?: string }) {
  const k = NK(brand);
  return <SideNav look={k.side} bubble={menuKit(brand).bubble} logo={logo ?? (brand === 'hr' ? 'Porest HR' : 'Porest Desk')} brand={k.tone['bg-brand-solid']} groups={groups ?? (brand === 'hr' ? HR_NAV : DESK_NAV)} {...p} />;
}
export function SidePanel({ brand = 'desk', ...p }: Omit<SidePanelViewProps, 'look'> & { brand?: Brand }) {
  return <SidePanelView look={NK(brand).panel} {...p} />;
}
export function Fab({ brand = 'desk', ...p }: Omit<Parameters<typeof FabView>[0], 'look'> & { brand?: Brand }) {
  return <FabView look={NK(brand).fab} {...p} />;
}

// ── 그림 장식 ─────────────────────────────────────────────
export function Pin({ n, style }: { n: string; style?: CSSProperties }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE, ...style }}>
      {n}
    </span>
  );
}
export const pinAt = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 30, ...style }}>
    <Pin n={n} />
  </span>
);
export const markBox: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1, background: MARK };
export const markLine: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
// 치수 띠 — 분홍 띠 + 숫자(자리 absolute)
export function Band({ style, label, vertical = false, tag = 'center' }: { style: CSSProperties; label?: string; vertical?: boolean; tag?: 'center' | 'above' | 'below' | 'left' | 'right' }) {
  const t: CSSProperties =
    tag === 'above'
      ? { position: 'absolute', left: '50%', bottom: '100%', transform: 'translate(-50%, -2px)' }
      : tag === 'below'
        ? { position: 'absolute', left: '50%', top: '100%', transform: 'translate(-50%, 2px)' }
        : tag === 'left'
          ? { position: 'absolute', right: '100%', top: '50%', transform: 'translate(-3px, -50%)' }
          : tag === 'right'
            ? { position: 'absolute', left: '100%', top: '50%', transform: 'translate(3px, -50%)' }
            : {};
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center justify-center" style={{ background: MARK, zIndex: 25, ...style }}>
      {label && (
        <span className="whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, writingMode: vertical ? 'vertical-rl' : undefined, ...t }}>
          {label}
        </span>
      )}
    </span>
  );
}
export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex max-w-[600px] flex-wrap justify-center gap-x-5 gap-y-1.5 text-[12px] leading-4 pk-muted">
      {items.map(([n, t]) => (
        <span key={n} className="whitespace-nowrap">
          <b className="pk-text">{n}</b> {t}
        </span>
      ))}
    </div>
  );
}
// 그림 아래 한 줄(모드를 따른다)
export function Cap({ children, strong, mode = 'auto', w }: { children?: ReactNode; strong?: ReactNode; mode?: Mode; w?: number }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4" style={{ color: mode === 'auto' ? undefined : rc('fg-neutral-subtle', mode), maxWidth: w }}>
      {strong && <b className={mode === 'auto' ? 'text-[13px] pk-text' : 'text-[13px]'} style={mode === 'auto' ? undefined : { color: rc('fg-neutral', mode) }}>{strong}</b>}
      <span className={mode === 'auto' ? 'pk-muted' : undefined}>{children}</span>
    </span>
  );
}
export function Shot({ children, cap, strong, mode = 'auto', w }: { children: ReactNode; cap?: ReactNode; strong?: ReactNode; mode?: Mode; w?: number }) {
  return (
    <div className="flex min-w-0 max-w-full flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto">{children}</div>
      {(cap || strong) && <Cap strong={strong} mode={mode} w={w}>{cap}</Cap>}
    </div>
  );
}
// 줄여 그린다 — 자리(폭 · 높이)도 같이
export function Scaled({ w, h, s, children, style }: { w: number; h: number; s: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="shrink-0" style={{ width: w * s, height: h * s, ...style }}>
      <div style={{ width: w, height: h, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}
// 판 — 모드의 바탕 위에(라이트 · 다크를 나란히)
export function Board({ children, mode = 'auto', bg = 'bg-layer-default', pad = 16, className = '', style, brand = 'desk' }: { children: ReactNode; mode?: Mode; bg?: string; pad?: number; className?: string; style?: CSSProperties; brand?: Brand }) {
  return (
    <div className={`rounded-xl ${className}`} style={{ background: rc(bg, mode, brand), paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad, ...style }}>
      {children}
    </div>
  );
}
// 보조 기술이 읽는 글(그림)
export function Reading({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'ok' | 'bad' }) {
  const c = tone === 'ok' ? '#15803D' : tone === 'bad' ? '#B91C1C' : undefined;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-card px-2 py-1 text-[12px] leading-4 text-fd-foreground">
      <span aria-hidden className="text-[10px] font-bold text-fd-muted-foreground">읽는 글</span>
      <span style={{ color: c }}>{children}</span>
    </span>
  );
}

// ── 폰 ──────────────────────────────────────────────────
// 그림 속 폰 — 화면 폭 360, 위 상태 표시줄 · 상단 바(bar), 탭 바는 tabs. 안전 영역(아래)은 safe
export function NPhone({ mode = 'auto', brand = 'desk', bar, children, tabs = false, tab = 'home', tabSize = 'regular', safe = 0, h = 600, scale = 1, bg = 'bg-layer-default', overlay, bottom, home = false }: { mode?: Mode; brand?: Brand; bar?: ReactNode; children?: ReactNode; tabs?: boolean; tab?: string; tabSize?: TabSize; safe?: number; h?: number; scale?: number; bg?: string; overlay?: ReactNode; bottom?: ReactNode; home?: boolean }) {
  return (
    <Phone screenW={PHONE} mode={mode} brand={brand} bar={bar ?? null} tabs={tabs} tab={tab} tabSize={tabSize} safe={safe} h={h} scale={scale} bg={bg} bottom={bottom} overlay={(overlay || home) && <>{overlay}{home && <HomeIndicator mode={mode} />}</>}>
      {children}
    </Phone>
  );
}
// 홈 표시줄(안전 영역의 그림 — 기기가 그린다)
export function HomeIndicator({ mode = 'auto' }: { mode?: Mode }) {
  return <span aria-hidden className="absolute bottom-2 left-1/2 block h-[5px] w-[120px] -translate-x-1/2 rounded-full" style={{ background: rc('fg-neutral', mode), zIndex: 120 }} />;
}

// 목록 줄 — 가계부 거래
export function TxRows({ mode = 'auto', n = 6, from = 0, rows = LEDGER_ROWS, pad = 24 }: { mode?: Mode; n?: number; from?: number; rows?: NavRow[]; pad?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: pad, paddingRight: pad }}>
      {rows.slice(from, from + n).map(([t, s, a, hue]) => (
        <Row key={t + from} mode={mode} title={t} sub={s} amount={a} hue={hue} />
      ))}
    </div>
  );
}
export function DayHead({ mode = 'auto', day = '10월 2일 (금)', total = '−19,050원', pad = 24 }: { mode?: Mode; day?: string; total?: string; pad?: number }) {
  return (
    <div className="flex items-center justify-between pb-1 pt-3 text-[13px]" style={{ paddingLeft: pad, paddingRight: pad, color: rc('fg-neutral-subtle', mode) }}>
      <span>{day}</span>
      <span className="tabular-nums">{total}</span>
    </div>
  );
}
// 홈의 이번 달 요약 — 지표 카드(card.yaml — 회색 바닥 위 흰 면 + 1px 테두리 · 여백 24 · 라벨 · 큰 숫자 · 증감)
export function SpendCard({ mode = 'auto', style }: { mode?: Mode; style?: CSSProperties }) {
  const c = cardLook();
  return (
    <CardSurface look={c} mode={mode} style={style}>
      <StatView look={c} mode={mode} label="10월 지출" value="1,240,000원" delta={{ direction: 'down', value: '82,000원', text: '지난달보다' }} />
    </CardSurface>
  );
}
// 목록 카드 — 머리(제목 + 전체 보기) 아래 줄이 카드 가장자리까지(줄이 제 좌우 24 를 가진다 · 카드 아래 12)
export function TxCard({ mode = 'auto', title = '최근 거래', action = '전체 보기', children, style }: { mode?: Mode; title?: string; action?: string; children: ReactNode; style?: CSSProperties }) {
  const c = cardLook();
  return (
    <CardSurface look={c} mode={mode} body="list" style={style}>
      <CardHeaderView look={c} mode={mode} title={title} action={action || undefined} body="list" heading="span" />
      {children}
    </CardSurface>
  );
}
// 띠 화면 — 회색 바닥 위 화면 폭 흰 띠(묶음마다 하나), 띠 사이 8 · 맨 위 8 · 띠 안 위 4 · 아래 8(DESIGN.md Layout 의 "화면 바탕", 2026-10-16 Q-019-3 C)
export function FloorBands({ mode = 'auto', children }: { mode?: Mode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      {(Array.isArray(children) ? children : [children]).map((c, i) => (
        <div key={i} className="pb-2 pt-1" style={{ background: rc('bg-layer-default', mode) }}>
          {c}
        </div>
      ))}
    </div>
  );
}
// 알림 줄 — 둥근 사각 아이콘 타일 + 제목 · 설명
export function NoticeRows({ mode = 'auto', n = 5, pad = 24 }: { mode?: Mode; n?: number; pad?: number }) {
  const hues = ['blue', 'orange', 'green', 'violet', 'red'];
  return (
    <div className="flex flex-col" style={{ paddingLeft: pad, paddingRight: pad }}>
      {NOTICE_ROWS.slice(0, n).map(([t, s], i) => (
        <Row key={t} mode={mode} title={t} sub={s} hue={hues[i % hues.length]} />
      ))}
    </div>
  );
}
// 가계부 화면 위 Line Tabs(Fill · medium) — 가계부 · 자산 · 통계 · 예산
export function MoneyTabs({ mode = 'auto', value = 'ledger' }: { mode?: Mode; value?: string }) {
  return <LineTabsView look={tabsLook('desk')} mode={mode} layout="fill" size="medium" live={false} value={value} items={MONEY_TABS} ariaLabel="가계부 보기" />;
}

// 홈(탭 첫 화면) — 큰 제목 · 검색 · 알림 점
export const HOME_ACTIONS: TopAction[] = [
  { icon: 'search', label: '검색' },
  { icon: 'bell', label: '알림, 새 알림 있음', notification: true },
];
// scrolled — 목록을 내린 화면(요약 카드가 위로 지나갔다)
export function HomeScreen({ mode = 'auto', h = 600, scale = 0.62, tabSize = 'regular', bar, scrolled = false }: { mode?: Mode; h?: number; scale?: number; tabSize?: TabSize; bar?: ReactNode; scrolled?: boolean }) {
  return (
    <NPhone mode={mode} h={h} scale={scale} tabs tab="home" tabSize={tabSize} bg="bg-layer-basement" bar={bar ?? <Bar mode={mode} type="root" title="홈" actions={HOME_ACTIONS} />}>
      <div style={{ ...cardStack(), transform: scrolled ? 'translateY(-210px)' : undefined }}>
        <SpendCard mode={mode} />
        <TxCard mode={mode}>
          <TxRows mode={mode} n={7} />
        </TxCard>
      </div>
    </NPhone>
  );
}
// 알림(그 아래 화면) — ← · 제목 · "모두 읽음"
export function NoticeScreen({ mode = 'auto', h = 600, scale = 0.62, bar }: { mode?: Mode; h?: number; scale?: number; bar?: ReactNode }) {
  return (
    <NPhone mode={mode} h={h} scale={scale} bg="bg-layer-basement" bar={bar ?? <Bar mode={mode} title="알림" actions={[{ kind: 'text', label: '모두 읽음' }]} />}>
      <FloorBands mode={mode}>
        <NoticeRows mode={mode} />
      </FloorBands>
    </NPhone>
  );
}
// 가계부(탭 첫 화면) — 큰 제목 + 위 Line Tabs, 탭 바는 그대로
export function LedgerScreen({ mode = 'auto', h = 600, scale = 0.62, tabSize = 'regular', value = 'ledger', from = 0 }: { mode?: Mode; h?: number; scale?: number; tabSize?: TabSize; value?: string; from?: number }) {
  return (
    <NPhone mode={mode} h={h} scale={scale} tabs tab="ledger" tabSize={tabSize} bg={value === 'assets' ? 'bg-layer-basement' : 'bg-layer-default'} bar={<Bar mode={mode} type="root" title="가계부" actions={[{ icon: 'search', label: '검색' }]} />}>
      <MoneyTabs mode={mode} value={value} />
      {value === 'assets' ? (
        // 자산은 카드 화면 — 회색 바닥 위 카드(화면 바탕 2026-10-16). 거래는 흰 화면이라 둘을 밀면 바탕이 바뀐다
        <div style={cardStack()}>
          <TxCard mode={mode} title="계좌" action="관리">
            <TxRows mode={mode} n={4} rows={ASSET_ROWS} />
          </TxCard>
        </div>
      ) : (
        <>
          <DayHead mode={mode} />
          <TxRows mode={mode} n={7} from={from} />
        </>
      )}
    </NPhone>
  );
}

// ── 데스크톱 ─────────────────────────────────────────────
// 브라우저 창 — 실제 px(w × h)로 그린 화면을 s 배로. 창 장식(위 막대)은 줄이지 않는다
// cw · ch 를 주면 창은 그만큼만 보인다(화면은 w × h 로 짜고 왼쪽 위를 자른다)
export function Desktop({ mode = 'auto', w, h, s, url = 'desk.porest.app', cw, ch, children }: { mode?: Mode; w: number; h: number; s: number; url?: string; cw?: number; ch?: number; children: ReactNode }) {
  const vw = cw ?? w;
  const vh = ch ?? h;
  return (
    <WebWindow mode={mode} w={Math.round(vw * s)} h={Math.round(vh * s) + 32} url={url}>
      <Scaled w={vw} h={vh} s={s}>
        <div style={{ width: vw, height: vh, overflow: 'hidden' }}>
          <div style={{ width: w, height: h }}>{children}</div>
        </div>
      </Scaled>
    </WebWindow>
  );
}
// 데스크톱 틀 — 사이드바 + (머리) + 본문. Desk 는 머리(desktop 상단 바), HR 은 머리 없음
export function Shell({ mode = 'auto', brand = 'desk', side, header, children, bodyBg = 'bg-layer-basement', style }: { mode?: Mode; brand?: Brand; side?: ReactNode; header?: ReactNode; children?: ReactNode; bodyBg?: string; style?: CSSProperties }) {
  return (
    <div className="flex h-full w-full" style={{ background: rc(bodyBg, mode, brand), ...style }}>
      {side}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {header}
        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
// 데스크톱 머리 — 왼쪽 검색칸 · 오른쪽 주 버튼 + 알림 · 설정(금액 가리기 눈은 두지 않는다 — 2026-10-16 Q-017-3c = Q-018-3 B)
export const DESK_HEADER_ACTIONS: TopAction[] = [
  { icon: 'bell', label: '알림, 새 알림 있음', notification: true },
  { icon: 'settings', label: '설정' },
];
// 검색칸 — Text Field outline medium 40 · 앞 돋보기 · 지우기(값이 있을 때). 상단 바 안이라 폰에서도 medium(top-navigation.yaml searchField)
export function SearchBox({ mode = 'auto', value, placeholder = '거래 검색', focused = false }: { mode?: Mode; value?: string; placeholder?: string; focused?: boolean }) {
  return <TfInputView look={textFieldLook().input} mode={mode} size="medium" state={focused ? 'focused' : 'enabled'} value={value} placeholder={placeholder} prefixIcon="search" clearable ariaLabel="거래 검색" width="100%" />;
}
export function DeskHeader({ mode = 'auto', live = false, state, search = true, value }: { mode?: Mode; live?: boolean; state?: 'hovered' | 'pressed'; search?: boolean; value?: string }) {
  return (
    <Bar
      mode={mode}
      type="desktop"
      search={search ? <SearchBox mode={mode} value={value} /> : undefined}
      actions={DESK_HEADER_ACTIONS.map((a, i) => (i === 0 && state ? { ...a, state } : a))}
      primary={{ label: '내역 추가', icon: 'plus' }}
      live={live}
    />
  );
}
// 본문 맨 위 화면 제목(h1 — text-screen-title) — 머리 아래 nav-to-title. description · actions 를 주면 한 줄 제목 줄(Q-018-2 A) —
// 제목(설명은 그 아래 t3 · fg-neutral-subtle) 왼쪽, 동작 버튼(Button neutralOutline small) 오른쪽 · 제목 덩어리 아래 끝 맞춤
export function ScreenTitle({ mode = 'auto', brand = 'desk', children, top, style, description, actions }: { mode?: Mode; brand?: Brand; children: ReactNode; top?: number; style?: CSSProperties; description?: string; actions?: [IconName, string][] }) {
  const k = NK(brand);
  const t = k.top.desktop.screenTitle;
  const r = k.top.screenRow;
  const title = <span style={{ display: 'block', fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight, color: rc('fg-neutral', mode, brand) }}>{children}</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: r.gap, paddingTop: top ?? k.top.desktop.navToTitle, paddingLeft: k.margin, paddingRight: k.margin, ...style }}>
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        {title}
        {description && (
          <span style={{ display: 'block', marginTop: r.descriptionGap, fontFamily: r.description.fontFamily, fontSize: r.description.fontSize, lineHeight: r.description.lineHeight, fontWeight: r.description.fontWeight, color: ncv(r.descriptionFg, mode), wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
            {description}
          </span>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end', gap: r.actionsGap }}>
          {actions.map(([icon, label]) => (
            <ButtonView key={label} look={buttonLook({ variant: 'neutralOutline', size: r.buttonSize }, brand)} mode={mode} state="enabled" prefix={icon} label={label} />
          ))}
        </div>
      )}
    </div>
  );
}
export const LEDGER_TITLE = { description: '모든 거래 내역', actions: [['filter', '필터 · 3'], ['download', '내보내기']] as [IconName, string][] };
// 데스크톱 본문 — 작은 지표 카드 셋(데스크톱 격자 · stat small) + 거래 목록 카드. 칸 사이는 layout-gutter(card.yaml root.gap 비고)
export function DeskMain({ mode = 'auto', title = '가계부', rows = 6, top }: { mode?: Mode; title?: string; rows?: number; top?: number }) {
  const row = title === '가계부' ? LEDGER_TITLE : undefined;
  const k = NK('desk');
  const c = cardLook();
  const stat = (label: string, value: string) => (
    <CardSurface look={c} mode={mode}>
      <StatView look={c} mode={mode} label={label} value={value} size="small" />
    </CardSurface>
  );
  return (
    <div className="flex flex-col">
      <ScreenTitle mode={mode} top={top} description={row?.description} actions={row?.actions}>{title}</ScreenTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: c.gutter, paddingTop: 20, paddingLeft: k.margin, paddingRight: k.margin }}>
        {stat('10월 지출', '1,240,000원')}
        {stat('10월 수입', '3,200,000원')}
        {stat('남은 예산', '310,000원')}
        <div style={{ gridColumn: '1 / -1' }}>
          <TxCard mode={mode}>
            <TxRows mode={mode} n={rows} />
          </TxCard>
        </div>
      </div>
    </div>
  );
}
// HR 본문 — 휴가 현황 표
export function HrLeaveMain({ mode = 'auto', title = '휴가 현황', rows = 5 }: { mode?: Mode; title?: string; rows?: number }) {
  const k = NK('hr');
  const head = ['날짜', '종류', '일수', '상태'];
  const data = [
    ['2026-09-21', '연차', '1일', '승인'],
    ['2026-09-04', '반차(오후)', '0.5일', '승인'],
    ['2026-08-18', '연차', '2일', '승인'],
    ['2026-07-31', '병가', '1일', '승인'],
    ['2026-07-10', '연차', '1일', '반려'],
    ['2026-06-12', '연차', '1일', '승인'],
  ].slice(0, rows);
  return (
    <div className="flex flex-col">
      <ScreenTitle mode={mode} brand="hr" top={k.margin}>{title}</ScreenTitle>
      <div style={{ paddingTop: 20, paddingLeft: k.margin, paddingRight: k.margin }}>
        <MiniTable mode={mode} brand="hr" title="휴가 내역" head={head} rows={data} />
      </div>
    </div>
  );
}
// 표(그림) — 카드(머리 제목 · 표가 가장자리까지) 안의 Table(table.yaml — 머리 41 · 줄 45 · 첫 칸 앞 24 · 머리 14 / 500 짙은 글, 바탕 없음).
// 상태 열은 Badge(medium weak), 숫자 열(일수 · 금액)은 오른쪽 · 고정폭 숫자. above 는 표 위, children 은 표 아래(넘김 줄)
const STATUS_TONE: Record<string, TBadge['tone']> = { 재직: 'positive', 승인: 'positive', 휴직: 'warning', 대기: 'informative', 반려: 'critical' };
const NUMERIC = /^[+−-]?[\d,.]+(일|원|시간|개|%)$/;
// 표 상자(table.yaml root)는 표와 넘김 줄을 함께 담아 넘치면 함께 가로로 민다. bare 면 카드 없이 표 상자만(줄인 그림 · 스크롤한 그림)
// empty — 줄이 없을 때 본문 자리의 비었음(Result Section medium — table.yaml 상태)
export function MiniTable({ mode = 'auto', brand = 'desk', title, head, rows, minWidth, above, children, bare = false, scrollLeft, empty }: { mode?: Mode; brand?: Brand; title: string; head: string[]; rows: string[][]; minWidth?: number; above?: ReactNode; children?: ReactNode; bare?: boolean; scrollLeft?: number; empty?: string }) {
  const c = cardLook();
  const cols: TCol[] = head.map((h, i) => ({ key: String(i), label: h, align: rows.length > 0 && rows.every((r) => NUMERIC.test(r[i] ?? '')) ? 'end' : 'start' }));
  const data: TRow[] = rows.map((r, j) => ({ id: `r${j}`, name: r[0], cells: Object.fromEntries(r.map((v, i) => [String(i), head[i] === '상태' && STATUS_TONE[v] ? { badge: { label: v, tone: STATUS_TONE[v] } } : v])) }));
  const box = (
    <div style={{ overflowX: scrollLeft ? 'hidden' : 'auto' }}>
      <div style={{ minWidth, marginLeft: scrollLeft ? -scrollLeft : undefined }}>
        {above}
        <TableView look={tableLook(brand)} mode={mode} caption={title} columns={cols} rows={data} minWidth={minWidth} status={rows.length === 0 && empty ? { kind: 'empty', title: empty } : undefined} />
        {children}
      </div>
    </div>
  );
  if (bare) return box;
  return (
    <CardSurface look={c} mode={mode} body="list">
      <CardHeaderView look={c} mode={mode} title={title} body="list" heading="span" />
      {box}
    </CardSurface>
  );
}
// 표 카드의 높이 — 머리(위 24 + 제목 줄 + 아래 4) + 표 머리 41 + 줄 45 × n + 표 아래 넘김 줄(위 12 + 40) + 카드 아래 12 + 테두리. 줄인 그림의 자리를 잡을 때
export function tableCardH(n: number, paging = true, brand: Brand = 'hr') {
  const c = cardLook();
  const t = tableLook(brand);
  const pg = navKit(brand).table;
  const header = c.header.list.top + parseFloat(c.title.lineHeight ?? c.title.fontSize) + c.header.list.bottom;
  return c.surface.borderW * 2 + header + t.head.minH + t.row.minH.text * n + (paging ? pg.marginTop + pg.height : 0) + c.list.padBottom;
}
// 넘김 줄 자리 — 표와 같은 상자 안, 표 아래 12 · 좌우는 표의 첫 칸 앞 · 끝 칸 뒤와 같은 24(table.yaml root.paddingX)
// above — 나쁜 예(표 위에 둔 줄)
export function PagingSlot({ children, brand = 'hr', above = false }: { children: ReactNode; brand?: Brand; above?: boolean }) {
  const e = tableLook(brand).edge;
  const g = navKit(brand).table.marginTop;
  return <div style={{ marginTop: above ? 0 : g, marginBottom: above ? g : 0, paddingLeft: e, paddingRight: e }}>{children}</div>;
}

// 1280 데스크톱 — Desk 가계부(펼친 사이드바 · 머리 · 본문 h1)
export function DeskDesktop({ mode = 'auto', w = 1280, h = 760, s = 0.45, collapsed = false, current = 'ledger', title = '가계부', side, header, children }: { mode?: Mode; w?: number; h?: number; s?: number; collapsed?: boolean; current?: string; title?: string; side?: ReactNode; header?: ReactNode; children?: ReactNode }) {
  return (
    <Desktop mode={mode} w={w} h={h} s={s}>
      <Shell mode={mode} side={side ?? <Side mode={mode} current={current} collapsed={collapsed} />} header={header ?? <DeskHeader mode={mode} />}>
        {children ?? <DeskMain mode={mode} title={title} />}
      </Shell>
    </Desktop>
  );
}
// HR 데스크톱 — 머리 없음, 사이드바 지금 항목 + 본문 제목
export function HrDesktop({ mode = 'auto', w = 1280, h = 640, s = 0.45, collapsed = false, current = 'leave-history', title = '휴가 현황', side, children }: { mode?: Mode; w?: number; h?: number; s?: number; collapsed?: boolean; current?: string; title?: string; side?: ReactNode; children?: ReactNode }) {
  return (
    <Desktop mode={mode} w={w} h={h} s={s} url="hr.porest.app">
      <Shell mode={mode} brand="hr" side={side ?? <Side brand="hr" mode={mode} current={current} collapsed={collapsed} />}>
        {children ?? <HrLeaveMain mode={mode} title={title} />}
      </Shell>
    </Desktop>
  );
}

// HR 폰 — ☰ + 휴가 현황(모든 화면이 standard, 왼쪽 ☰)
export function HrLeavePhone({ mode = 'auto', h = 600, scale = 0.62, overlay, title = '휴가 현황', expanded = false }: { mode?: Mode; h?: number; scale?: number; overlay?: ReactNode; title?: string; expanded?: boolean }) {
  const rows: [string, string, string][] = [
    ['연차', '2026-09-21 · 1일', '승인'],
    ['반차(오후)', '2026-09-04 · 0.5일', '승인'],
    ['연차', '2026-08-18 · 2일', '승인'],
    ['병가', '2026-07-31 · 1일', '승인'],
    ['연차', '2026-07-10 · 1일', '반려'],
  ];
  return (
    <NPhone mode={mode} brand="hr" h={h} scale={scale} overlay={overlay} bg="bg-layer-basement" bar={<Bar brand="hr" mode={mode} leading="menu" leadingExpanded={expanded} title={title} />}>
      <div style={cardStack()}>
        <CardSurface look={cardLook()} mode={mode}>
          <StatView look={cardLook()} mode={mode} label="남은 연차" value="11.5일" />
        </CardSurface>
        <TxCard mode={mode} title="휴가 내역" action="">
          <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
            {rows.map(([t, sub, st]) => (
              <Row key={sub} mode={mode} title={t} sub={sub} hue={st === '반려' ? 'red' : 'green'} trailing={<span className="text-[13px]" style={{ color: rc(st === '반려' ? 'fg-neutral-subtle' : 'fg-neutral-muted', mode, 'hr') }}>{st}</span>} />
            ))}
          </div>
        </TxCard>
      </div>
    </NPhone>
  );
}
// HR 주 메뉴 서랍 — 왼쪽 Side Panel(80%)에 사이드바와 같은 항목
export function HrDrawer({ mode = 'auto', current = 'leave-history', h = 600, open, groups, fog = true }: { mode?: Mode; current?: string; h?: number; open?: string[]; groups?: SideGroup[]; fog?: boolean }) {
  const k = NK('hr');
  return (
    <SidePanel brand="hr" mode={mode} side="left" width={PHONE * k.panel.leftRatio} title="Porest HR" fog={fog} safeTop={40}>
      <Side brand="hr" mode={mode} drawer current={current} open={open} groups={groups} />
    </SidePanel>
  );
}

// ── 줄 위 표시 ───────────────────────────────────────────
// 화면 속 손가락 · 누름 자리
export function Tap({ x, y, note }: { x: number | string; y: number | string; note?: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex flex-col items-center" style={{ left: x, top: y, zIndex: 140, transform: 'translate(-50%, -50%)' }}>
      <span className="block h-9 w-9 rounded-full border-2" style={{ borderColor: MARK_LINE, background: 'rgba(219, 39, 119, 0.18)' }} />
      {note && (
        <span className="mt-1 whitespace-nowrap rounded px-1.5 text-[11px] font-bold leading-5 text-white" style={{ background: MARK_LINE }}>
          {note}
        </span>
      )}
    </span>
  );
}
export function Arrow({ label }: { label?: string }) {
  return (
    <span aria-hidden className="flex shrink-0 flex-col items-center gap-1 self-center px-1 text-[11px] font-bold pk-muted">
      <NavGlyph name="chevron-right" size={28} strokeWidth={2.5} color="currentColor" />
      {label}
    </span>
  );
}
export const tabZoneH = (safe = 0) => tabBottom(NK().tab, 'regular', safe) + NK().tab.sizes.regular.h;
export const circleLook = (brand: Brand = 'desk') => loadingKit(brand).circle;

// 코드 예시 미리보기 — md 의 코드 블록 바로 위에 붙는다(아래 모서리 없이)
export function CodePreview({ children, caption, w = 360, pad = 24, bg = 'bg-layer-default', brand = 'desk', padX = 8 }: { children: ReactNode; caption?: string; w?: number | string; pad?: number; bg?: string; brand?: Brand; padX?: number }) {
  return (
    <figure className="not-prose mb-0 mt-6">
      <div className="flex min-h-[96px] items-center justify-center overflow-x-auto rounded-t-xl border border-b-0 border-fd-border" style={{ background: rc(bg, 'auto', brand), paddingTop: pad, paddingBottom: pad, paddingLeft: padX, paddingRight: padX }}>
        <div className="w-full" style={{ maxWidth: w }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}

// 사이드바 바닥의 계정 줄(이니셜 원 · 이름) — 두지 않는다(2026-10-16 Q-018-1 C). footer-guide 의 '지금' 그림에만 쓴다
export function AccountRow({ mode = 'auto', brand = 'desk', collapsed = false, name = '김민수' }: { mode?: Mode; brand?: Brand; collapsed?: boolean; name?: string }) {
  const k = NK(brand).side;
  return (
    <div className="flex items-center" style={{ columnGap: k.item.gap, minHeight: k.item.minH, paddingLeft: collapsed ? k.item.padXCollapsed - 4 : k.item.padX, paddingRight: k.item.padX }}>
      <span className="flex shrink-0 items-center justify-center rounded-full text-[12px] font-bold" style={{ width: 28, height: 28, background: rc('chart-blue-weak', mode, brand), color: rc('chart-blue-contrast', mode, brand) }}>
        {name.slice(0, 1)}
      </span>
      {!collapsed && (
        <span className="truncate text-[14px] font-medium" style={{ color: rc('fg-neutral-muted', mode, brand) }}>
          {name}
        </span>
      )}
    </div>
  );
}

// 넓은 그림(창 · 폰 여럿)을 좁은 칸에 — 칸 안에서 가로로 민다(가운데 정렬은 넓을 때만)
export function Wide({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="mx-auto w-max">{children}</div>
    </div>
  );
}
