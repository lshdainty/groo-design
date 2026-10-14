'use client';
// 상단 바 · 하단 탭 바 · 떠 있는 버튼의 플레이그라운드 — 속성을 고르면 스펙대로 그린 모습과 그 코드가 바뀐다(실제로 누르고 스크롤한다).
// 값은 nav-look 이 YAML 에서 푼 것만 쓴다. 코드는 각 스펙 md 의 "코드" 절과 같은 레시피 API 다.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { SnackbarLook } from './feedback-shared';
import { SnackbarView } from './feedback-view';
import { DESK_TABS, LEDGER_ROWS, TODO_ROWS, addLabelFor } from './nav-data';
import { FONT, ncv, tabBottom, tabInset, type FabLook, type NColor, type NavTone, type TabBarLook, type TopAction, type TopLeading, type TopNavLook, type TopType, type ViewMode } from './nav-shared';
import { FabView, TabBar, TopNavBar } from './nav-view';
import { BRANDS, MODES, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
type Tones = Record<NavTone, NColor>;
const tc = (t: Tones, n: NavTone, mode: ViewMode) => ncv(t[n], mode);

// 플레이그라운드 판 — 위 그림 · 가운데 조작 · 아래 코드
export function NavPlayFrame({ surface, stage, controls, code, wide = false, note }: { surface: string; stage: ReactNode; controls: ReactNode; code: string; wide?: boolean; note?: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-4 py-8" style={{ background: surface }}>
        <div className={`w-full ${wide ? 'max-w-[760px]' : 'max-w-[360px]'}`}>{stage}</div>
        {note && <div className="max-w-[560px] text-center text-[12px] leading-5 text-fd-muted-foreground">{note}</div>}
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 그림 속 폰 화면(브라우저 그림 — 상태 표시줄 · 둥근 모서리)
export function PlayScreen({ tones, mode, h = 520, children, bg = 'bg-layer-default', home = false, style }: { tones: Tones; mode: ViewMode; h?: number; children: ReactNode; bg?: NavTone; home?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 360,
        height: h,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden',
        borderRadius: 24,
        background: tc(tones, bg, mode),
        boxShadow: `inset 0 0 0 1px ${tc(tones, 'stroke-neutral-subtle', mode)}`,
        fontFamily: FONT,
        isolation: 'isolate',
        ...style,
      }}
    >
      <div aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, height: 24, paddingLeft: 22, paddingRight: 22, fontSize: 11, fontWeight: 600, background: tc(tones, 'bg-layer-default', mode), color: tc(tones, 'fg-neutral', mode) }}>
        <span>9:41</span>
        <span style={{ letterSpacing: 1 }}>●●●</span>
      </div>
      {children}
      {home && <span aria-hidden style={{ position: 'absolute', left: '50%', bottom: 8, width: 120, height: 5, marginLeft: -60, borderRadius: 9999, background: tc(tones, 'fg-neutral', mode), zIndex: 200 }} />}
    </div>
  );
}
// 목록 줄 — 앞 타일 · 제목 · 부제 · 금액
export function PlayRow({ tones, mode, title, sub, amount, hue = 'blue', check = false }: { tones: Tones; mode: ViewMode; title: string; sub?: string; amount?: string; hue?: string; check?: boolean }) {
  const h = hue;
  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: 12, paddingTop: 10, paddingBottom: 10 }}>
      {check ? (
        <span aria-hidden style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 6, boxShadow: `inset 0 0 0 1.5px ${tc(tones, 'stroke-neutral-solid', mode)}` }} />
      ) : (
        <span aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, flexShrink: 0, borderRadius: 12, fontSize: 15, fontWeight: 700, background: tc(tones, `chart-${h}-weak` as NavTone, mode), color: tc(tones, `chart-${h}-contrast` as NavTone, mode) }}>
          {title.slice(0, 1)}
        </span>
      )}
      <span style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 }}>
        <span style={{ fontSize: 15, lineHeight: '21px', fontWeight: 500, color: tc(tones, 'fg-neutral', mode), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {sub && <span style={{ fontSize: 13, lineHeight: '18px', color: tc(tones, 'fg-neutral-subtle', mode), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>}
      </span>
      {amount && <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: tc(tones, 'fg-neutral', mode) }}>{amount}</span>}
    </div>
  );
}
const PlayRows = ({ tones, mode, n = 6, from = 0 }: { tones: Tones; mode: ViewMode; n?: number; from?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 24, paddingRight: 24 }}>
    {Array.from({ length: n }, (_, i) => LEDGER_ROWS[(from + i) % LEDGER_ROWS.length]).map(([t, s, a, h], i) => (
      <PlayRow key={i} tones={tones} mode={mode} title={t} sub={s} amount={a} hue={h} />
    ))}
  </div>
);
const surfaceOf = (t: Tones, mode: ViewMode) => (mode === 'auto' ? `var(--p-${t['bg-layer-basement'].name})` : t['bg-layer-basement'][mode]);

// ══ Top Navigation ═════════════════════════════════════════
// 금액 가리기는 켜고 끄는 단추 — 이름은 고정, 아이콘은 지금 상태(보임 eye · 가림 eye-off), 켬은 aria-pressed(Toggle · 19B)
const TOP_ICONS: { icon: 'search' | 'bell' | 'settings' | 'eye'; label: string; jsx: string; on: string }[] = [
  { icon: 'search', label: '검색', jsx: 'Search', on: 'openSearch' },
  { icon: 'bell', label: '알림', jsx: 'Bell', on: 'openNotifications' },
  { icon: 'settings', label: '설정', jsx: 'Settings', on: 'openSettings' },
  { icon: 'eye', label: '금액 가리기', jsx: 'Eye', on: 'toggleHidden' },
];
const TITLES: Record<'root' | 'standard', [string, string]> = {
  root: ['홈', '이번 달 카드 결제 예정 금액 모아 보기'],
  standard: ['알림', '현대카드 M 결제 예정 금액과 받을 혜택 자세히 보기'],
};
type Right = 'none' | '1' | '2' | '3' | '4' | 'text';

export function TopNavPlayground({ looks, tones }: { looks: Record<Brand, TopNavLook>; tones: Record<Brand, Tones> }) {
  const [type, setType] = useState<TopType>('root');
  const [leading, setLeading] = useState<TopLeading>('back');
  const [right, setRight] = useState<Right>('2');
  const [dot, setDot] = useState<'on' | 'off'>('on');
  const [long, setLong] = useState<'short' | 'long'>('short');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const [said, setSaid] = useState('');
  const [hidden, setHidden] = useState(false);
  const look = looks[brand];
  const t = tones[brand];
  const desktop = type === 'desktop';
  const kind = type === 'root' ? 'root' : 'standard';
  const title = TITLES[kind][long === 'long' ? 1 : 0];
  const textBtn = right === 'text' && !desktop;
  const count = right === 'text' || right === 'none' ? 0 : Number(right);
  const overflow = count > 3;
  const shown = overflow ? TOP_ICONS.slice(0, 2) : TOP_ICONS.slice(0, desktop ? Math.max(count, 0) : count);
  const actions: TopAction[] = textBtn
    ? [{ kind: 'text', label: '모두 읽음' }]
    : [
        ...shown.map((a) =>
          a.icon === 'eye'
            ? { icon: hidden ? ('eye-off' as const) : ('eye' as const), label: a.label, pressed: hidden }
            : { icon: a.icon, label: a.icon === 'bell' && dot === 'on' ? '알림, 새 알림 있음' : a.label, notification: a.icon === 'bell' && dot === 'on' },
        ),
        ...(overflow ? [{ icon: 'more' as const, label: `${desktop ? '가계부' : title.split(' ')[0]} 더보기` }] : []),
      ];
  const code = useMemo(() => {
    const comps = new Set(['TopNavigation']);
    const icons = new Set<string>();
    const lines: string[] = [];
    const act: string[] = [];
    if (desktop) {
      comps.add('TopNavigationActions').add('TopNavigationPrimaryButton').add('ScreenTitle');
      icons.add('Plus');
      act.push('    <TopNavigationPrimaryButton onClick={openAddTransaction}><Plus />내역 추가</TopNavigationPrimaryButton>');
    }
    if (textBtn) {
      comps.add('TopNavigationActions').add('TopNavigationTextButton');
      act.push('    <TopNavigationTextButton onClick={markAllRead} disabled={!hasUnread}>모두 읽음</TopNavigationTextButton>');
    } else {
      for (const a of shown) {
        comps.add('TopNavigationActions').add('TopNavigationIconButton');
        icons.add(a.jsx);
        if (a.icon === 'bell' && dot === 'on') act.push(`    <TopNavigationIconButton notification={hasUnread} aria-label={hasUnread ? "알림, 새 알림 있음" : "알림"} onClick={${a.on}}><${a.jsx} /></TopNavigationIconButton>`);
        else if (a.icon === 'eye') {
          icons.add('EyeOff');
          act.push(`    <TopNavigationIconButton aria-label="${a.label}" aria-pressed={hidden} onClick={${a.on}}>{hidden ? <EyeOff /> : <Eye />}</TopNavigationIconButton>`);
        } else act.push(`    <TopNavigationIconButton aria-label="${a.label}" onClick={${a.on}}><${a.jsx} /></TopNavigationIconButton>`);
      }
      if (overflow) {
        icons.add('Ellipsis');
        act.push(`    {/* 넘치면 덜 쓰는 것을 ⋯ 하나에 — 1280 이상 Menu · 미만 Menu Sheet */}`, `    <TopNavigationIconButton aria-label="${actions.at(-1)!.label}" aria-haspopup="menu" onClick={openMore}><Ellipsis /></TopNavigationIconButton>`);
      }
    }
    if (!desktop) {
      if (type === 'standard') {
        const L = leading === 'back' ? 'TopNavigationBackButton' : leading === 'close' ? 'TopNavigationCloseButton' : 'TopNavigationMenuButton';
        comps.add(L);
        lines.push(leading === 'back' ? '  <TopNavigationBackButton fallbackHref="/desk" />' : leading === 'close' ? '  <TopNavigationCloseButton onClick={closeFlow} dirty={isDirty} />' : '  <TopNavigationMenuButton aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(true)} />');
      }
      comps.add('TopNavigationTitle');
      lines.push(`  <TopNavigationTitle>${title}</TopNavigationTitle>`);
    }
    if (act.length) lines.push('  <TopNavigationActions>', ...act, '  </TopNavigationActions>');
    const imp = `${icons.size ? `import { ${[...icons].sort().join(', ')} } from "lucide-react"\n` : ''}import { ${[...comps].sort().join(', ')} } from "@/components/ui/top-navigation"\n\n`;
    const open = desktop ? '<TopNavigation type="desktop">' : type === 'root' ? '<TopNavigation type="root">' : '<TopNavigation>';
    const tail = desktop ? '\n<main id="main">\n  <ScreenTitle>가계부</ScreenTitle>\n  …\n</main>' : '';
    return `${imp}${open}\n${lines.join('\n')}\n</TopNavigation>${tail}`;
  }, [desktop, textBtn, shown, dot, overflow, actions, type, leading, title]);
  const tap = (what: string) => setSaid(what);
  const onAction = (i: number) => {
    const a = actions[i];
    if (a.kind !== 'text' && a.pressed !== undefined) {
      setHidden((h) => !h);
      setSaid(`금액 가리기, ${hidden ? '안 눌림' : '눌림'}`);
    } else tap(a.label);
  };
  const stage = desktop ? (
    <div style={{ overflow: 'hidden', borderRadius: 16, boxShadow: `inset 0 0 0 1px ${tc(t, 'stroke-neutral-subtle', mode)}`, background: tc(t, 'bg-layer-basement', mode), fontFamily: FONT }}>
      <TopNavBar look={look} mode={mode} type="desktop" actions={actions} primary={{ label: '내역 추가', icon: 'plus' }} live onAction={onAction} onPrimary={() => tap('내역 추가')} />
      <div style={{ paddingTop: look.desktop.navToTitle, paddingLeft: look.desktop.padLeft, paddingBottom: 24, ...{ fontFamily: look.desktop.screenTitle.fontFamily, fontSize: look.desktop.screenTitle.fontSize, lineHeight: look.desktop.screenTitle.lineHeight, fontWeight: look.desktop.screenTitle.fontWeight }, color: tc(t, 'fg-neutral', mode) }}>가계부</div>
    </div>
  ) : (
    <PlayScreen tones={t} mode={mode} h={300}>
      <TopNavBar look={look} mode={mode} type={type} leading={leading} title={title} actions={actions} live onLeading={() => tap(look.leading[leading].label)} onAction={onAction} />
      <PlayRows tones={t} mode={mode} n={4} />
    </PlayScreen>
  );
  return (
    <NavPlayFrame
      surface={surfaceOf(t, mode)}
      wide={desktop}
      stage={stage}
      note={said ? `누른 버튼 — ${said}` : '버튼에 마우스를 올리면 바탕, 누르면 바탕 + 2px 축소, Tab 으로 오면 상자 안쪽 링이다.'}
      controls={
        <>
          <Seg label="타입" value={type} options={[['root', 'Root — 탭 첫 화면'], ['standard', 'Standard — 그 아래'], ['desktop', '데스크톱 머리']]} onChange={(v) => setType(v as TopType)} />
          {type === 'standard' ? <Seg label="왼쪽 버튼" value={leading} options={[['back', '← 뒤로'], ['close', '✕ 닫기'], ['menu', '☰ 주 메뉴']]} onChange={(v) => setLeading(v as TopLeading)} /> : <div className="text-[12px] leading-5 text-fd-muted-foreground">왼쪽 버튼은 Standard 만 둔다 — Root 는 큰 제목, 데스크톱 머리는 제목이 본문 h1 이다.</div>}
          <Seg label="오른쪽" value={right} options={desktop ? [['none', '주 버튼만'], ['1', '아이콘 1'], ['2', '아이콘 2'], ['3', '아이콘 3'], ['4', '넷 → ⋯']] : [['none', '없음'], ['1', '아이콘 1'], ['2', '아이콘 2'], ['3', '아이콘 3'], ['4', '넷 → ⋯'], ['text', '글 버튼']]} onChange={(v) => setRight(v as Right)} />
          <Seg label="알림 점(벨)" value={dot} options={[['on', '있음'], ['off', '없음']]} onChange={setDot} />
          {!desktop && <Seg label="제목" value={long} options={[['short', '짧게'], ['long', '길게 — 말줄임']]} onChange={setLong} />}
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Seg label="서비스" value={brand} options={BRANDS} onChange={setBrand} />
        </>
      }
      code={code}
    />
  );
}

// ── Top Navigation 코드 — Desk 데스크톱 머리(주 버튼 + 아이콘 셋). 금액 가리기는 켜고 끄는 단추 ─────
export function DeskHeaderLive({ look }: { look: TopNavLook }) {
  const [hidden, setHidden] = useState(false);
  const actions: TopAction[] = [
    { icon: hidden ? 'eye-off' : 'eye', label: '금액 가리기', pressed: hidden },
    { icon: 'bell', label: '알림, 새 알림 있음', notification: true },
    { icon: 'settings', label: '설정' },
  ];
  return <TopNavBar look={look} type="desktop" actions={actions} primary={{ label: '내역 추가', icon: 'plus' }} live as="header" onAction={(i) => i === 0 && setHidden((h) => !h)} />;
}

// ══ Bottom Navigation ══════════════════════════════════════
export function BottomNavPlayground({ look, top, tones }: { look: TabBarLook; top: TopNavLook; tones: Tones }) {
  const [tab, setTab] = useState('home');
  const [dot, setDot] = useState<'off' | 'on'>('off');
  const [safe, setSafe] = useState<'on' | 'off'>('on');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [compact, setCompact] = useState(false);
  const [said, setSaid] = useState('');
  const scroller = useRef<HTMLDivElement | null>(null);
  const memory = useRef<Record<string, number>>({});
  const track = useRef({ last: 0, acc: 0, dir: 0 });
  const safeArea = safe === 'on' ? 34 : 0;
  const add = addLabelFor(tab);
  const items = DESK_TABS.map((it) => (it.value === 'more' ? { ...it, notification: dot === 'on' } : it));
  // 줄어들기 — 아래로 shrink 이상 · 위로 expand 이상 · 맨 위 top 안(bottom-navigation.md 의 Behavior)
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const y = el.scrollTop;
    const d = y - track.current.last;
    track.current.last = y;
    if (!d) return;
    const dir = d > 0 ? 1 : -1;
    if (dir !== track.current.dir) track.current.acc = 0;
    track.current.dir = dir;
    track.current.acc += Math.abs(d);
    if (y <= look.scroll.top) setCompact(false);
    else if (dir > 0 && track.current.acc >= look.scroll.shrink) setCompact(true);
    else if (dir < 0 && track.current.acc >= look.scroll.expand) setCompact(false);
  };
  const select = (v: string) => {
    const el = scroller.current;
    setCompact(false);
    if (v === tab) {
      // 지금 탭을 다시 누름 — 맨 위 + 그 탭의 첫 화면
      el?.scrollTo({ top: 0, behavior: 'smooth' });
      setSaid(`${DESK_TABS.find((x) => x.value === v)?.label} — 다시 누름: 맨 위로`);
      return;
    }
    if (el) memory.current[tab] = el.scrollTop;
    setTab(v);
    setSaid(`${DESK_TABS.find((x) => x.value === v)?.label} — 마지막 스크롤 자리로`);
  };
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = memory.current[tab] ?? 0;
    track.current = { last: el.scrollTop, acc: 0, dir: 0 };
  }, [tab]);
  const code = useMemo(() => {
    const cur = (v: string) => `current={tab === "${v}"}`;
    const dotAttr = dot === 'on' ? ' notification={hasNews}' : '';
    return [
      'import { CalendarDays, ClipboardList, House, Menu } from "lucide-react"',
      'import { BottomNavigation, BottomNavigationAddButton, BottomNavigationItem } from "@/components/ui/bottom-navigation"',
      'import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"',
      '',
      '<SnackbarAvoidOverlap>',
      '  <BottomNavigation>',
      `    <BottomNavigationItem href="/desk" icon={<House />} label="홈" ${cur('home')} />`,
      `    <BottomNavigationItem href="/desk/ledger" icon={<ClipboardList />} label="가계부" ${cur('ledger')} />`,
      '    {/* 탭이 아니라 이 화면의 추가 — 이름은 화면마다 */}',
      '    <BottomNavigationAddButton aria-label={tab === "calendar" ? "일정 추가" : "거래 추가"} onClick={openAdd} />',
      `    <BottomNavigationItem href="/desk/calendar" icon={<CalendarDays />} label="캘린더" ${cur('calendar')} />`,
      `    <BottomNavigationItem href="/desk/more" icon={<Menu />} label="전체" ${cur('more')}${dotAttr} />`,
      '  </BottomNavigation>',
      '</SnackbarAvoidOverlap>',
      '',
      '{/* 마지막 줄이 바 위 24 에서 끝난다 — 바가 줄어도 그대로 */}',
      '<main id="main" className="overflow-y-auto" style={{ paddingBottom: BOTTOM_NAVIGATION_INSET }}>…</main>',
    ].join('\n');
  }, [dot]);
  const titles: Record<string, string> = { home: '홈', ledger: '가계부', calendar: '캘린더', more: '전체' };
  const bar = <TopNavBar look={top} mode={mode} type="root" title={titles[tab]} actions={[{ icon: 'search', label: '검색' }]} />;
  return (
    <NavPlayFrame
      surface={surfaceOf(tones, mode)}
      stage={
        <PlayScreen tones={tones} mode={mode} h={560} home={safe === 'on'}>
          {bar}
          <div ref={scroller} onScroll={onScroll} tabIndex={0} role="region" aria-label={`${titles[tab]} 목록`} style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', paddingBottom: tabInset(look, safeArea), outline: 'none' }}>
            <PlayRows tones={tones} mode={mode} n={16} from={['home', 'ledger', 'calendar', 'more'].indexOf(tab) * 2} />
          </div>
          <TabBar look={look} mode={mode} items={items} current={tab} addLabel={add} size={compact ? 'compact' : 'regular'} safe={safeArea} live onSelect={select} onAdd={() => setSaid(`+ — ${add}`)} onExpand={() => setCompact(false)} />
        </PlayScreen>
      }
      note={said || `목록을 아래로 ${look.scroll.shrink} 이상 내리면 바가 줄어들고, 위로 ${look.scroll.expand} 이상 · 맨 위 ${look.scroll.top} 안이면 펴진다. 줄어든 바를 누르면 펴진다.`}
      controls={
        <>
          <Seg label="지금 탭" value={tab} options={[['home', '홈'], ['ledger', '가계부'], ['calendar', '캘린더'], ['more', '전체']]} onChange={select} />
          <Seg label="크기" value={compact ? 'compact' : 'regular'} options={[['regular', `펼침 ${look.sizes.regular.h}`], ['compact', `줄어듦 ${look.sizes.compact.h}`]]} onChange={(v) => setCompact(v === 'compact')} />
          <Seg label="알림 점(전체)" value={dot} options={[['off', '없음'], ['on', '있음']]} onChange={setDot} />
          <Seg label="안전 영역" value={safe} options={[['on', '홈 표시줄 있음'], ['off', '없음']]} onChange={setSafe} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <div className="text-[12px] leading-5 text-fd-muted-foreground">
            + 의 이름 — <b className="text-fd-foreground">{add}</b>(캘린더 탭이면 일정 추가). 바의 아래 자리 {tabBottom(look, compact ? 'compact' : 'regular', safeArea)} · 본문 아래 여백 {tabInset(look, safeArea)}.
          </div>
        </>
      }
      code={code}
    />
  );
}

// ══ Floating Action Button ═════════════════════════════════
export function FabPlayground({ looks, tops, tones, snack, bottomBtn }: { looks: Record<Brand, FabLook>; tops: Record<Brand, TopNavLook>; tones: Record<Brand, Tones>; snack: SnackbarLook; bottomBtn: Record<Brand, ButtonLook> }) {
  const [icon, setIcon] = useState<'plus' | 'pencil'>('plus');
  const [below, setBelow] = useState<'none' | 'button'>('none');
  const [safe, setSafe] = useState<'on' | 'off'>('on');
  const [toast, setToast] = useState(false);
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const look = looks[brand];
  const t = tones[brand];
  const safeArea = safe === 'on' ? 34 : 0;
  // 바닥 버튼 자리 — 위 12 · Button large · 아래 12(+ 안전 영역)
  const barH = 12 + bottomBtn[brand].faces.light.enabled.height + 12;
  const offset = below === 'button' ? barH : 0;
  const fabBottom = look.bottom + (below === 'button' ? barH + safeArea : safeArea);
  const label = icon === 'plus' ? '할 일 추가' : '메모 쓰기';
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(false), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);
  const code = [
    `import { ${icon === 'plus' ? 'Plus' : 'Pencil'} } from "lucide-react"`,
    'import { FloatingActionButton } from "@/components/ui/floating-action-button"',
    'import { SnackbarAvoidOverlap } from "@/components/ui/snackbar"',
    '',
    '<SnackbarAvoidOverlap>',
    `  <FloatingActionButton icon={<${icon === 'plus' ? 'Plus' : 'Pencil'} />} aria-label="${label}" onClick={${icon === 'plus' ? 'openAddTodo' : 'openNewMemo'}}${offset ? ` offsetBottom={${offset}}` : ''} />`,
    '</SnackbarAvoidOverlap>',
  ].join('\n');
  return (
    <NavPlayFrame
      surface={surfaceOf(t, mode)}
      stage={
        <PlayScreen tones={t} mode={mode} h={560} home={safe === 'on'}>
          <TopNavBar look={tops[brand]} mode={mode} title="할 일" actions={[{ icon: 'search', label: '검색' }]} />
          <div tabIndex={0} role="region" aria-label="할 일 목록" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', paddingBottom: look.size + look.bottom * 2 + (below === 'none' ? safeArea : 0), outline: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 24, paddingRight: 24 }}>
              {TODO_ROWS.map((r) => (
                <PlayRow key={r} tones={t} mode={mode} title={r} check />
              ))}
            </div>
          </div>
          {below === 'button' && (
            <div style={{ flexShrink: 0, paddingTop: 12, paddingBottom: 12 + safeArea, paddingLeft: 24, paddingRight: 24, background: tc(t, 'bg-layer-default', mode) }}>
              <ButtonView look={bottomBtn[brand]} mode={mode} label="완료한 할 일 지우기" fill state="live" />
            </div>
          )}
          <FabView look={look} mode={mode} icon={icon} label={label} live place="absolute" bottom={fabBottom} onClick={() => setToast(true)} />
          {toast && (
            <div style={{ position: 'absolute', left: snack.region.padX, right: snack.region.padX, bottom: fabBottom + look.size + snack.region.padBottom, zIndex: 300, display: 'flex', justifyContent: 'center' }}>
              <SnackbarView look={snack} mode={mode} message={icon === 'plus' ? '할 일을 추가했어요.' : '메모를 저장했어요.'} state="enabled" />
            </div>
          )}
        </PlayScreen>
      }
      note={`버튼을 누르면 스낵바가 버튼 위 ${snack.region.padBottom} 에 뜬다. 목록을 스크롤해도 버튼은 그 자리 — 화면 끝 ${look.right} · 아래 ${look.bottom} + 안전 영역${below === 'button' ? ' · 바닥 버튼 위' : ''}.`}
      controls={
        <>
          <Seg label="아이콘" value={icon} options={[['plus', '+ 할 일 추가'], ['pencil', '연필 메모 쓰기']]} onChange={setIcon} />
          <Seg label="아래 고정 요소" value={below} options={[['none', '없음'], ['button', '바닥 버튼']]} onChange={setBelow} />
          <Seg label="안전 영역" value={safe} options={[['on', '홈 표시줄 있음'], ['off', '없음']]} onChange={setSafe} />
          <Seg label="스낵바" value={toast ? 'on' : 'off'} options={[['off', '없음'], ['on', '띄우기']]} onChange={(v) => setToast(v === 'on')} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Seg label="서비스" value={brand} options={BRANDS} onChange={setBrand} />
        </>
      }
      code={code}
    />
  );
}
