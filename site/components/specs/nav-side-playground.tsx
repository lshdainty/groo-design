'use client';
// 사이드바 · 옆 패널의 플레이그라운드 — 속성을 고르면 스펙대로 그린 모습과 그 코드가 바뀐다.
// 사이드바: 창 폭(1440 · 1024)으로 펼침 · 접힘이 정해지고, 접기 버튼으로 손으로 바꾸면 그 상태를 기억한다. 접혔을 때 항목에 마우스를 올리면 말풍선 · 펼침 메뉴.
// 옆 패널: 실제로 열고(초점이 패널로) · Esc · 딤 · 끌어 닫고(손가락 · 펜만 — 입력 폼은 딤 · 끌기로 닫히지 않는다) · 닫으면 초점이 연 자리로 돌아온다.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { BubbleLook } from './menu-shared';
import { DESK_NAV_CODE, HR_NAV, HR_NAV_CODE } from './nav-data';
import { FONT, ncv, type NColor, type NavTone, type SideGroup, type SideNavLook, type SidePanelLook, type TopNavLook, type ViewMode } from './nav-shared';
import { NavPlayFrame, PlayRow, PlayScreen } from './nav-playground';
import { SideNav, SidePanelView } from './nav-side-view';
import { TopNavBar } from './nav-view';
import { BRANDS, MODES, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
type Tones = Record<NavTone, NColor>;
const tc = (t: Tones, n: NavTone, mode: ViewMode) => ncv(t[n], mode);
const surfaceOf = (t: Tones, mode: ViewMode) => (mode === 'auto' ? `var(--p-${t['bg-layer-basement'].name})` : t['bg-layer-basement'][mode]);
const LONG = '통계 · 분석 리포트 모아 보기';

// 그림 속 창 폭을 판 폭에 맞춰 줄인다(누르는 자리는 그대로 맞는다)
function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setS(Math.min(1, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return { ref, s };
}

// ══ Side Navigation ═════════════════════════════════════════
export function SideNavPlayground({ looks, bubbles, tones }: { looks: Record<Brand, SideNavLook>; bubbles: Record<Brand, BubbleLook>; tones: Record<Brand, Tones> }) {
  const [width, setWidth] = useState<'1440' | '1024'>('1440');
  const [hand, setHand] = useState<'auto' | 'expanded' | 'collapsed'>('auto');
  const [current, setCurrent] = useState('ledger');
  const [subs, setSubs] = useState<'on' | 'off'>('on');
  const [long, setLong] = useState<'off' | 'on'>('off');
  const [brand, setBrand] = useState<Brand>('desk');
  const [mode, setMode] = useState<ViewMode>('auto');
  const look = looks[brand];
  const t = tones[brand];
  const collapsed = hand === 'auto' ? width === '1024' : hand === 'collapsed';
  const base: SideGroup[] = brand === 'hr' ? HR_NAV.map((g) => ({ ...g, items: g.items.slice(0, 5) })) : DESK_NAV_CODE;
  const groups: SideGroup[] = base.map((g) => ({
    ...g,
    items: g.items
      .map((it) => (subs === 'off' && it.children ? { ...it, children: undefined } : it))
      .map((it) => (long === 'on' && (it.value === 'assets' || it.value === 'notice') ? { ...it, label: LONG } : it)),
  }));
  const all = groups.flatMap((g) => g.items.flatMap((i) => (i.children ? [i, ...i.children.map((c) => ({ ...c, icon: i.icon }))] : [i])));
  const cur = all.find((i) => i.value === current) ? current : brand === 'hr' ? 'calendar' : 'ledger';
  const curLabel = all.find((i) => i.value === cur)?.label ?? '';
  const W = Number(width);
  const sideW = collapsed ? look.collapsedWidth : look.width;
  const options: [string, string][] = all.filter((i) => !(i as { children?: unknown }).children).map((i) => [i.value, i.label]);
  const code = useMemo(() => {
    const icons = new Set<string>();
    const ICON: Record<string, string> = { grid: 'LayoutGrid', wallet: 'Wallet', trend: 'TrendingUp', ledger: 'ClipboardList', calendar: 'CalendarDays', megaphone: 'Megaphone', plane: 'Plane', briefcase: 'Briefcase', heart: 'Heart', users: 'Users', settings: 'Settings' };
    const lines: string[] = [];
    for (const g of groups) {
      lines.push(`    <SideNavigationGroup label="${g.label}">`);
      for (const it of g.items) {
        icons.add(ICON[it.icon]);
        if (it.children) {
          lines.push(`      <SideNavigationItem icon={<${ICON[it.icon]} />} label="${it.label}">`);
          for (const c of it.children) lines.push(`        <SideNavigationSubItem href="/${brand}/${it.value}/${c.value}" label="${c.label}" current={path === "/${brand}/${it.value}/${c.value}"} />`);
          lines.push('      </SideNavigationItem>');
        } else lines.push(`      <SideNavigationItem href="/${brand}/${it.value}" icon={<${ICON[it.icon]} />} label="${it.label}" current={path === "/${brand}/${it.value}"} />`);
      }
      lines.push('    </SideNavigationGroup>');
    }
    const ctrl = hand === 'auto' ? '' : ' collapsed={collapsed} onCollapsedChange={setCollapsed}';
    return [
      `import { ${[...icons].sort().join(', ')} } from "lucide-react"`,
      'import {',
      `  SideNavigation, SideNavigationContent, SideNavigationGroup, SideNavigationHeader, SideNavigationItem${subs === 'on' ? ', SideNavigationSubItem' : ''},`,
      '} from "@/components/ui/side-navigation"',
      '',
      hand === 'auto' ? `{/* 창 폭 ${width} — ${collapsed ? '768 ~ 1279 는 접힘 56' : '1280 이상은 펼침 240'}. 손으로 접은 상태는 localStorage(groo:side-navigation-collapsed)에 기억 */}` : '{/* 손으로 정했다 — 다음에 열어도 이 상태 */}',
      `<SideNavigation${ctrl}>`,
      `  <SideNavigationHeader logo={<ServiceLogo name="${brand === 'hr' ? '그루 이음' : '그루 담다'}" />} />`,
      '  <SideNavigationContent>',
      ...lines,
      '  </SideNavigationContent>',
      '</SideNavigation>',
    ].join('\n');
  }, [groups, hand, width, collapsed, brand, subs]);
  const H = 520;
  return (
    <NavPlayFrame
      surface={surfaceOf(t, mode)}
      wide
      stage={
        <div style={{ display: 'flex', height: H, overflow: 'visible', borderRadius: 16, boxShadow: `0 0 0 1px ${tc(t, 'stroke-neutral-subtle', mode)}`, background: tc(t, 'bg-layer-basement', mode), fontFamily: FONT }}>
          <SideNav
            look={look}
            bubble={bubbles[brand]}
            mode={mode}
            logo={brand === 'hr' ? '그루 이음' : '그루 담다'}
            brand={t['bg-brand-solid']}
            groups={groups}
            current={cur}
            collapsed={collapsed}
            live
            onCollapse={(next) => setHand(next ? 'collapsed' : 'expanded')}
            onNavigate={(v) => setCurrent(v)}
            style={{ borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
          />
          <div style={{ flex: '1 1 auto', minWidth: 0, paddingTop: 28, paddingLeft: 32, paddingRight: 24 }}>
            <div style={{ fontSize: 26, lineHeight: '35px', fontWeight: 700, color: tc(t, 'fg-neutral', mode) }}>{curLabel}</div>
            <div style={{ marginTop: 12, fontSize: 13, lineHeight: '20px', color: tc(t, 'fg-neutral-subtle', mode) }}>
              창 폭 {W} — 사이드바 {sideW} · 본문 {W - sideW}
              {hand !== 'auto' ? ' · 손으로 정함(기억)' : ''}
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', rowGap: 10 }}>
              {[72, 56, 64, 48].map((w, i) => (
                <span key={i} style={{ display: 'block', height: 44, width: `${w}%`, borderRadius: 12, background: tc(t, 'bg-layer-default', mode) }} />
              ))}
            </div>
          </div>
        </div>
      }
      note={collapsed ? '접힌 사이드바 — 하위가 없는 항목에 마우스를 올리면 200ms 뒤 이름 말풍선, 증권 · 휴가 같은 부모는 옆 펼침 메뉴(누르거나 Enter 로도 연다).' : '부모(증권 · 휴가)는 누르면 펼치기만 한다 — 하위가 지금 화면이면 저절로 펼쳐진다. 접기 버튼으로 손으로 접을 수 있다.'}
      controls={
        <>
          <Seg label="창 폭" value={width} options={[['1440', '1440 — 펼침 기본'], ['1024', '1024 — 접힘 기본']]} onChange={(v) => { setWidth(v); setHand('auto'); }} />
          <Seg label="손으로" value={hand} options={[['auto', '폭으로(기본)'], ['expanded', '펼침'], ['collapsed', '접음']]} onChange={setHand} />
          <Seg label="지금 화면" value={cur} options={options as [string, string][]} onChange={setCurrent} />
          <Seg label="하위 항목" value={subs} options={[['on', '있음(부모)'], ['off', '없음']]} onChange={setSubs} />
          <Seg label="긴 이름" value={long} options={[['off', '짧게'], ['on', '길게 — 줄바꿈']]} onChange={setLong} />
          <Seg label="서비스" value={brand} options={BRANDS} onChange={(v) => { setBrand(v); setCurrent(v === 'hr' ? 'leave-history' : 'ledger'); }} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
      code={code}
    />
  );
}

// ══ Side Panel ═════════════════════════════════════════════
type Body = 'short' | 'long';
function SettingRows({ tones, mode, n }: { tones: Tones; mode: ViewMode; n: number }) {
  const rows = ['카드 결제 예정', '예산을 넘었을 때', '일정 알림', '더치페이 요청', '증권 연결이 끊겼을 때', '공지사항', '주간 리포트', '월간 리포트', '새 기능 소식', '로그인 알림', '할 일 마감', '자산 변동'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {rows.slice(0, n).map((r, i) => (
        <label key={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, fontSize: 16, lineHeight: '22px', color: tc(tones, 'fg-neutral', mode), boxShadow: i < n - 1 ? `inset 0 -1px 0 ${tc(tones, 'stroke-neutral-subtle', mode)}` : undefined }}>
          {r}
          <input type="checkbox" defaultChecked={i % 3 !== 2} style={{ width: 20, height: 20, accentColor: tc(tones, 'bg-brand-solid', mode) }} />
        </label>
      ))}
    </div>
  );
}

export function SidePanelPlayground({ looks, sides, bubbles, tops, tones, cancel, save }: { looks: Record<Brand, SidePanelLook>; sides: Record<Brand, SideNavLook>; bubbles: Record<Brand, BubbleLook>; tops: Record<Brand, TopNavLook>; tones: Record<Brand, Tones>; cancel: Record<Brand, ButtonLook>; save: Record<Brand, ButtonLook> }) {
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [desc, setDesc] = useState<'on' | 'off'>('on');
  const [body, setBody] = useState<Body>('long');
  const [form, setForm] = useState<'off' | 'on'>('off');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [drag, setDrag] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [said, setSaid] = useState('');
  const brand: Brand = side === 'left' ? 'hr' : 'desk';
  const look = looks[brand];
  const t = tones[brand];
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; t: number } | null>(null);
  const screenW = side === 'left' ? 360 : 1280;
  const screenH = side === 'left' ? 560 : 720;
  const { ref: fitRef, s } = useFitScale(screenW);
  const isForm = side === 'right' && form === 'on';
  const width = side === 'left' ? screenW * look.leftRatio : look.widths[size];
  // 여닫기 — 열리면 패널로 초점, 닫히면 연 자리로
  const openPanel = () => {
    setShown(true);
    setScrolled(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };
  const closePanel = (why: string) => {
    setOpen(false);
    setDrag(0);
    setSaid(why);
    window.setTimeout(() => {
      setShown(false);
      // 초점은 연 자리로 — 오른쪽은 "알림 설정", 왼쪽은 상단 바의 ☰
      (side === 'right' ? trigger.current : fitRef.current?.querySelector<HTMLElement>('[aria-haspopup="dialog"]'))?.focus();
    }, parseFloat(look.motion.close.duration));
  };
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closePanel('Esc — 닫았다');
    }
    if (e.key === 'Tab' && panel.current) {
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, [tabindex="0"]')].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  // 붙은 쪽으로 끌기(손가락 · 펜) — 빠르게(px/ms) 끌었거나 폭의 비율 이상 밀면 닫는다. 마우스는 글 고르기와 겹쳐 끌지 않고, 입력 폼은 끌리지 않는다
  const dir = side === 'left' ? -1 : 1;
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' || isForm || (e.target as HTMLElement).closest('a, button, input, label')) return;
    start.current = { x: e.clientX, t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = ((e.clientX - start.current.x) / s) * dir;
    setDrag(Math.max(0, dx));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = Math.max(0, ((e.clientX - start.current.x) / s) * dir);
    const v = dx / Math.max(1, performance.now() - start.current.t);
    start.current = null;
    if (v > look.drag.velocity || dx > width * look.drag.ratio) closePanel(`끌어 닫았다(${Math.round(dx)} · ${v.toFixed(2)}px/ms)`);
    else setDrag(0);
  };
  const title = side === 'left' ? '그루 이음' : '알림 설정';
  const description = desc === 'on' ? (side === 'left' ? undefined : '알림을 받을 때를 골라요.') : undefined;
  const code =
    side === 'left'
      ? [
          'import { SidePanel, SidePanelBody, SidePanelContent } from "@/components/ui/side-panel"',
          'import { SideNavigationContent, SideNavigationGroup, SideNavigationItem, SideNavigationSubItem } from "@/components/ui/side-navigation"',
          '',
          '<SidePanel open={menuOpen} onOpenChange={setMenuOpen}>',
          '  <SidePanelContent side="left" title="그루 이음" id="main-menu">',
          `    <SidePanelBody${body === 'long' ? ' scrollFog' : ''} className="px-x4">`,
          '      {/* 사이드바와 같은 항목 — 지금 묶음은 저절로 펼쳐지고, 항목을 누르면 이동하고 닫힌다 */}',
          '      <SideNavigationContent onNavigate={() => setMenuOpen(false)}>…</SideNavigationContent>',
          '    </SidePanelBody>',
          '  </SidePanelContent>',
          '</SidePanel>',
        ].join('\n')
      : [
          `<SidePanel open={open} onOpenChange={setOpen}${isForm ? ' form dirty={isDirty}' : ''}>`,
          `  <SidePanelContent side="right" size="${size}" title="알림 설정"${description ? ` description="${description}"` : ''}>`,
          `    <SidePanelBody${body === 'long' ? ' scrollFog' : ''}>…</SidePanelBody>`,
          ...(isForm
            ? ['    <SidePanelFooter>', '      <Button variant="neutralWeak" size="small" onClick={() => setOpen(false)}>취소</Button>', '      <Button size="small" onClick={save}>저장</Button>', '    </SidePanelFooter>']
            : []),
          '  </SidePanelContent>',
          '</SidePanel>',
        ].join('\n');
  const screen: ReactNode =
    side === 'left' ? (
      <PlayScreen tones={t} mode={mode} h={screenH} style={{ maxWidth: 'none', width: screenW }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <TopNavBar look={tops.hr} mode={mode} leading="menu" leadingExpanded={open} title="휴가 현황" live onLeading={openPanel} />
        </div>
        <div style={{ paddingLeft: 24, paddingRight: 24 }}>
          {['연차 · 2026-09-21', '반차(오후) · 2026-09-04', '연차 · 2026-08-18', '병가 · 2026-07-31'].map((r) => (
            <PlayRow key={r} tones={t} mode={mode} title={r.split(' · ')[0]} sub={r.split(' · ')[1]} hue="green" />
          ))}
        </div>
      </PlayScreen>
    ) : (
      <div style={{ position: 'relative', width: screenW, height: screenH, overflow: 'hidden', background: tc(t, 'bg-layer-basement', mode), fontFamily: FONT }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, paddingLeft: 32, paddingRight: 24, background: tc(t, 'bg-layer-default', mode) }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: tc(t, 'fg-neutral', mode) }}>그루 담다 · 1280</span>
          <button ref={trigger} type="button" onClick={openPanel} style={{ height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 8, borderWidth: 0, background: tc(t, 'bg-neutral-weak', mode), color: tc(t, 'fg-neutral', mode), fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            알림 설정
          </button>
        </div>
        <div style={{ paddingTop: 20, paddingLeft: 32, fontSize: 26, lineHeight: '35px', fontWeight: 700, color: tc(t, 'fg-neutral', mode) }}>설정</div>
      </div>
    );
  return (
    <NavPlayFrame
      surface={surfaceOf(t, mode)}
      wide={side === 'right'}
      stage={
        <div ref={fitRef} style={{ width: '100%' }}>
          <div style={{ position: 'relative', width: screenW * s, height: screenH * s, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: screenW, height: screenH, transform: `scale(${s})`, transformOrigin: 'left top', overflow: 'hidden', borderRadius: side === 'left' ? 24 : 12, boxShadow: `0 0 0 1px ${tc(t, 'stroke-neutral-subtle', mode)}` }}>
              {screen}
              {shown && (
                <SidePanelView
                  look={look}
                  mode={mode}
                  side={side}
                  width={width}
                  title={title}
                  description={description}
                  close={!isForm}
                  onClose={() => closePanel('닫기 — 닫았다')}
                  live
                  open={open}
                  offset={drag}
                  fog={body === 'long'}
                  scrolled={scrolled}
                  safeTop={side === 'left' ? 24 : 0}
                  onDim={() => (isForm ? setSaid('입력 폼 — 바깥을 눌러도 닫히지 않는다') : closePanel('딤을 눌러 닫았다'))}
                  onBodyScroll={() => setScrolled(true)}
                  panelRef={(el) => void (panel.current = el)}
                  panelProps={{ role: 'dialog', 'aria-modal': true, 'aria-label': title, tabIndex: -1, onKeyDown: onKey, onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: () => setDrag(0) }}
                  footer={
                    isForm ? (
                      <>
                        <ButtonView look={cancel.desk} mode={mode} label="취소" state="live" onClick={() => closePanel('취소 — 닫았다')} />
                        <ButtonView look={save.desk} mode={mode} label="저장" state="live" onClick={() => closePanel('저장 — 닫았다')} />
                      </>
                    ) : undefined
                  }
                >
                  {side === 'left' ? (
                    <SideNav look={sides.hr} bubble={bubbles.hr} mode={mode} logo="그루 이음" brand={t['bg-brand-solid']} groups={body === 'long' ? HR_NAV : HR_NAV_CODE} current="leave-history" drawer live onNavigate={(v) => closePanel(`${v} — 이동하고 닫았다`)} />
                  ) : (
                    <SettingRows tones={t} mode={mode} n={body === 'long' ? 12 : 3} />
                  )}
                </SidePanelView>
              )}
            </div>
          </div>
        </div>
      }
      note={said || (side === 'left' ? '☰ 를 누르면 왼쪽에서 열린다 — 딤 · Esc · 왼쪽으로 끌기(손가락 · 펜)로 닫힌다. 항목을 누르면 이동하고 닫힌다.' : `알림 설정을 누르면 오른쪽에서 열린다(1280 화면을 ${Math.round(s * 100)}% 로 줄여 그렸다).${isForm ? ' 입력 폼은 딤 · 끌기로 닫히지 않는다 — 취소 · Esc.' : ''}`)}
      controls={
        <>
          <Seg label="방향" value={side} options={[['left', '왼쪽 — HR 폰 주 메뉴'], ['right', '오른쪽 — 1280 보조 작업']]} onChange={(v) => { setSide(v); setShown(false); setOpen(false); }} />
          {side === 'right' ? <Seg label="크기" value={size} options={[['small', `small ${look.widths.small}`], ['medium', `medium ${look.widths.medium}`], ['large', `large ${look.widths.large}`]]} onChange={setSize} /> : <div className="text-[12px] leading-5 text-fd-muted-foreground">왼쪽 서랍은 크기와 상관없이 화면 폭의 {Math.round(look.leftRatio * 100)}% 다.</div>}
          {side === 'right' && <Seg label="설명" value={desc} options={[['on', '있음'], ['off', '없음']]} onChange={setDesc} />}
          <Seg label="본문" value={body} options={[['short', '짧게'], ['long', '길게 — 끝 흐림']]} onChange={setBody} />
          {side === 'right' && <Seg label="입력 폼(바닥 버튼)" value={form} options={[['off', '조회'], ['on', '폼 — 취소 · 저장']]} onChange={setForm} />}
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <div className="flex items-end">
            <button type="button" onClick={openPanel} className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[12px] text-fd-foreground hover:bg-fd-accent">
              패널 열기
            </button>
          </div>
        </>
      }
      code={code}
    />
  );
}
