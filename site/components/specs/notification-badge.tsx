// Notification Badge 페이지의 그림 — specs/components/notification-badge.md 의 `[그림: …](../../site/components/specs/notification-badge.tsx#<id>)` 자리.
// 점 · 숫자는 notification-badge.yaml 을 푼 값(display-look 의 notifLook)으로, 아이콘 버튼은 button.yaml(ghost · iconOnly · medium),
// 탭 · Segmented 의 알림 점은 tabs · segmented-control.yaml(그 view)로 그린다. Desk 는 파랑, HR 은 초록이다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { NotificationPlayground } from './display-playground';
import { DIcon, NotifCountView, NotifDotView, NotificationBadgeView, Reading } from './display-view';
import { BarButton, Board, Header, NotifIcon, Pair, Pin, Preview, Rows, Screen, TX, W, dk, markBox, modeKo, tone, txRow, type Brand } from './display-screens';
import { segmentedLook } from './segmented-control-look';
import { SegmentedView } from './segmented-control-view';
import { Cap } from './select-screens';
import { tabsLook } from './tabs-look';
import { LineTabsView } from './tabs-view';
import { Verdict, rc, type Mode } from './kit';
import { navKit } from './nav-look';
import { TopIconButton } from './nav-view';

type Fig = (p: { caption?: string }) => ReactNode;
const nl = (brand: Brand = 'desk') => dk(brand).notif;
// 상단 바의 아이콘 버튼(button.yaml ghost · iconOnly · medium) — 코드 예시와 같은 버튼
const iconBtn = (brand: Brand = 'desk') => buttonLook({ variant: 'ghost', size: 'medium', layout: 'iconOnly', ghostColor: 'neutral' }, brand);

// 앱 막대 오른쪽 — 알림 버튼(24 아이콘 · 40 자리)
function Bell({ mode = 'auto', brand = 'desk', notif, count, visible = true, icon = 'bell' }: { mode?: Mode; brand?: Brand; notif?: 'small' | 'large'; count?: number; visible?: boolean; icon?: 'bell' | 'settings' | 'sliders' }) {
  return (
    <BarButton>
      <NotifIcon icon={icon} notif={notif} count={count} visible={visible} mode={mode} brand={brand} />
    </BarButton>
  );
}
// 가계부(폰) — 앱 막대에 알림 버튼
function LedgerScreen({ mode, brand = 'desk', bell, scale = 0.5, h = 520, tabsDots = false, title = '가계부' }: { mode: Mode; brand?: Brand; bell: ReactNode; scale?: number; h?: number; tabsDots?: boolean; title?: string }) {
  const tabs = tabsLook(brand);
  return (
    <Screen title={title} back={false} mode={mode} scale={scale} h={h} right={bell}>
      <LineTabsView
        look={tabs}
        mode={mode}
        layout="fill"
        live={false}
        value="list"
        items={[
          { value: 'list', label: '내역' },
          { value: 'stats', label: '통계', notification: tabsDots },
          { value: 'budget', label: '예산', notification: tabsDots },
          { value: 'assets', label: '자산', notification: tabsDots },
        ]}
        ariaLabel="가계부 보기"
      />
      <Header title="10월 1일 (목)" mode={mode} brand={brand} />
      <Rows mode={mode} brand={brand} rows={[txRow(TX.lunch, mode, brand), txRow(TX.starbucks, mode, brand), txRow(TX.bus, mode, brand)]} />
    </Screen>
  );
}
// HR 휴가 신청(폰) — 승인 내역 탭에 알림 점
function LeaveScreen({ mode, scale = 0.5, h = 520 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="휴가 신청" mode={mode} scale={scale} h={h}>
      <LineTabsView look={tabsLook('hr')} mode={mode} layout="fill" live={false} value="mine" items={[{ value: 'mine', label: '내 신청' }, { value: 'approval', label: '승인 내역', notification: true }]} ariaLabel="휴가 신청" />
      <Header title="2026년" mode={mode} brand="hr" />
      <Rows
        mode={mode}
        brand="hr"
        rows={[
          { kind: 'button', prefix: { icon: 'calendar' }, title: '연차', detail: '10월 12일 (월) · 1일', suffix: { chevron: true } },
          { kind: 'button', prefix: { icon: 'calendar' }, title: '반차(오전)', detail: '9월 25일 (목) · 0.5일', suffix: { chevron: true } },
        ]}
      />
    </Screen>
  );
}
// Desk 할 일(폰) — Segmented 의 "예정" 칸에 알림 점
function TodoScreen({ mode, scale = 0.5, h = 520 }: { mode: Mode; scale?: number; h?: number }) {
  return (
    <Screen title="할 일" mode={mode} scale={scale} h={h}>
      <div className="px-6 pb-2 pt-1">
        <SegmentedView look={segmentedLook('desk')} mode={mode} live={false} value="today" items={[{ value: 'today', label: '오늘' }, { value: 'upcoming', label: '예정', notification: true }, { value: 'done', label: '완료' }]} ariaLabel="할 일 보기" />
      </div>
      <Rows
        mode={mode}
        rows={[
          { kind: 'check', title: '관리비 이체', detail: '오늘 · 매달', checked: false },
          { kind: 'check', title: '장보기', detail: '오늘', checked: true },
        ]}
      />
    </Screen>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LedgerScreen mode={mode} bell={<Bell mode={mode} />} />
          <TodoScreen mode={mode} />
          <LeaveScreen mode={mode} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <NotificationPlayground kits={{ desk: dk('desk'), hr: dk('hr') }} buttons={{ desk: iconBtn('desk'), hr: iconBtn('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const z = 4;
  const n = nl();
  const icon = (badge: ReactNode) => <span className="relative inline-flex">{badge}</span>;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-8 rounded-xl pk-surface px-10 pb-8 pt-14">
        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-12">
          {icon(
            <NotificationBadgeView look={n} zoom={z} mark={markBox} pin={<Pin n="ⓐ" style={{ left: -6, top: -30 }} />}>
              <DIcon name="bell" size={24 * z} color={tone('fg-neutral')} strokeWidth={1.6} />
            </NotificationBadgeView>,
          )}
          {icon(
            <NotificationBadgeView look={n} size="large" count={3} zoom={z} mark={{ outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }} pin={<><Pin n="ⓑ" style={{ left: -26, top: -26 }} /><Pin n="ⓒ" style={{ right: -26, top: -26 }} /></>}>
              <DIcon name="bell" size={24 * z} color={tone('fg-neutral')} strokeWidth={1.6} />
            </NotificationBadgeView>,
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Dot'],
            ['ⓑ', 'Count Container'],
            ['ⓒ', 'Count Label'],
          ].map(([k, t]) => (
            <span key={k}>
              <b className="pk-text">{k}</b> {t}
            </span>
          ))}
        </div>
        <span className="text-center text-[12px] leading-4 pk-muted">4배로 그렸다 — 24 아이콘 상자 위에 겹쳐 놓인다(아이콘 크기 · 버튼 높이를 바꾸지 않는다)</span>
      </div>
    </Figure>
  );
};

// ── Size ──────────────────────────────────────────────────
const Size: Fig = ({ caption }) => {
  const panel = (mode: 'light' | 'dark') => (
    <div className="flex min-w-0 flex-col gap-2">
      <Board mode={mode} pad={16}>
        <div className="grid items-center gap-x-2 gap-y-3" style={{ gridTemplateColumns: 'max-content repeat(4, 56px)' }}>
          <span />
          {['점', '1', '12', '99+'].map((t) => (
            <span key={t} className="text-center text-[11px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
              {t === '점' ? `small ${nl().dot.size}` : t}
            </span>
          ))}
          {(['desk', 'hr'] as const).map((brand) => (
            <div key={brand} className="contents">
              <span className="text-[12px] font-bold" style={{ color: tone('fg-brand', mode, brand) }}>
                {brand === 'desk' ? 'Desk' : 'HR'}
              </span>
              <span className="flex justify-center">
                <Bell mode={mode} brand={brand} />
              </span>
              {[1, 12, 128].map((c) => (
                <span key={c} className="flex justify-center">
                  <Bell mode={mode} brand={brand} notif="large" count={c} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Board>
      <Cap strong={modeKo(mode)}>{mode === 'light' ? '점은 fg-brand, 숫자는 bg-brand-solid + 흰 숫자' : '다크 — 점은 밝은 짝(fg-brand), 숫자 알약은 같은 채움'}</Cap>
    </div>
  );
  const c = nl().count;
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {panel('light')}
        {panel('dark')}
      </div>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">
        점 {nl().dot.size} · 숫자 알약 높이 {c.h} · 최소 폭 {c.minW} · 좌우 {c.padX} · 숫자 {parseFloat(c.text.fontSize)} / {parseFloat(c.text.lineHeight)} · {c.text.fontWeight} · 숫자 폭 같게({c.numerals}) — 100 이상은 99+, 0 이면 없다. 숫자는 글자 크기 설정을 따르지 않는다
      </p>
    </Panel>
  );
};

// ── 붙는 자리 ─────────────────────────────────────────────
// 24 아이콘 상자를 6배로 — 1px 눈금 위에 점 · 알약의 좌표
const Z = 6;
const ICON = 24;
function Grid({ children, w = ICON * Z, h = ICON * Z }: { children: ReactNode; w?: number; h?: number }) {
  const line = 'rgba(127, 127, 140, 0.18)';
  return (
    <span
      className="relative inline-block"
      style={{
        width: w,
        height: h,
        backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
        backgroundSize: `${Z}px ${Z}px`,
        outline: `1px solid ${MARK_LINE}`,
      }}
    >
      {children}
    </span>
  );
}
function Coord({ children, style }: { children: ReactNode; style: CSSProperties }) {
  return (
    <span aria-hidden className="pointer-events-none absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, ...style }}>
      {children}
    </span>
  );
}
const Placement: Fig = ({ caption }) => {
  const n = nl();
  const c = n.count;
  const dotL = ICON - n.dot.right - n.dot.size;
  const dotR = ICON - n.dot.right;
  const pillL = ICON - c.fromRight;
  const t5 = dk().text.t5;
  const tz = 3;
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[560px] gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[230px] items-center justify-center overflow-x-auto">
            <span className="relative inline-flex" style={{ marginRight: 64 }}>
              <Grid>
                <span className="absolute left-0 top-0">
                  <NotificationBadgeView look={n} zoom={Z} mark={{ outline: `1px solid ${MARK_LINE}` }}>
                    <DIcon name="bell" size={ICON * Z} color={tone('fg-neutral-subtle')} strokeWidth={1.4} />
                  </NotificationBadgeView>
                </span>
              </Grid>
              <Coord style={{ left: dotL * Z, top: -22 }}>
                x {dotL} ~ {dotR}
              </Coord>
              <Coord style={{ left: ICON * Z + 6, top: n.dot.top * Z }}>
                y {n.dot.top} ~ {n.dot.top + n.dot.size}
              </Coord>
            </span>
          </Board>
          <Cap strong="아이콘 · 점(small)">오른쪽 위 안쪽 {n.dot.right} — 아이콘 크기가 달라도 같은 식</Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[230px] items-center justify-center overflow-x-auto">
            <span className="relative inline-flex" style={{ marginTop: (c.h - c.bottom) * Z, marginRight: 60 }}>
              <Grid>
                <span className="absolute left-0 top-0">
                  <NotificationBadgeView look={n} size="large" count={3} zoom={Z}>
                    <DIcon name="bell" size={ICON * Z} color={tone('fg-neutral-subtle')} strokeWidth={1.4} />
                  </NotificationBadgeView>
                </span>
                {/* 알약의 왼쪽 아래 꼭짓점 */}
                <span aria-hidden className="absolute h-2.5 w-2.5 rounded-full" style={{ left: pillL * Z - 5, top: c.bottom * Z - 5, background: MARK_LINE, boxShadow: '0 0 0 2px #fff' }} />
              </Grid>
              <Coord style={{ left: pillL * Z - 12, top: c.bottom * Z + 10 }}>
                ({pillL}, {c.bottom})
              </Coord>
            </span>
          </Board>
          <Cap strong="아이콘 · 숫자(large)">
            왼쪽 아래 꼭짓점 = (아이콘 폭 − {c.fromRight}, {c.bottom}) — 위로 {c.h - c.bottom} 튀어나오고 숫자가 길수록 오른쪽으로 자란다
          </Cap>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <Board className="flex min-h-[230px] items-center justify-center overflow-x-auto">
            <span className="relative inline-flex" style={{ outline: `1px dashed ${MARK_LINE}` }}>
              <NotificationBadgeView look={n} attach="text" zoom={tz}>
                <span style={{ fontSize: parseFloat(t5.fontSize) * tz, lineHeight: `${parseFloat(t5.lineHeight) * tz}px`, fontWeight: 700, color: tone('fg-neutral-subtle') }}>승인 내역</span>
              </NotificationBadgeView>
              <span aria-hidden className="absolute top-0" style={{ left: '100%', width: n.textGap * tz, height: parseFloat(t5.lineHeight) * tz, background: MARK }} />
              <Coord style={{ left: '100%', top: -22 }}>{n.textGap}</Coord>
            </span>
          </Board>
          <Cap strong="글 · 점">마지막 글자 뒤 {n.textGap} · 위는 글 줄 상자의 위 끝 — 탭 폭 · 줄 높이를 바꾸지 않는다(3배)</Cap>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] leading-4 text-fd-muted-foreground">분홍 테두리 — 24 아이콘 상자(6배, 눈금 1px). 자리는 버튼 상자가 아니라 붙는 대상의 상자에서 잰다</p>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 앱 막대 한 줄(그림 조각) — 제목 + 오른쪽 아이콘 버튼들
function AppBar({ title, children, mode = 'auto', brand = 'desk' }: { title: string; children: ReactNode; mode?: Mode; brand?: Brand }) {
  return (
    <div className="flex items-center justify-between rounded-xl pl-5 pr-1" style={{ height: 56, background: tone('bg-layer-default', mode, brand) }}>
      <span className="text-[17px] font-bold leading-6" style={{ color: tone('fg-neutral', mode, brand) }}>
        {title}
      </span>
      <span className="flex items-center">{children}</span>
    </div>
  );
}
function Arrow({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] leading-4 pk-muted">
      <DIcon name="chevron-right" size={14} />
      {children}
    </span>
  );
}
const WhenGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="안 읽은 알림이 있을 때만 — 알림 목록을 열면(보면) 바로 사라진다">
        <W w={300}>
          <div className="flex flex-col gap-2">
            <AppBar title="가계부">
              <Bell />
            </AppBar>
            <Arrow>알림 목록을 열었다가 돌아오면</Arrow>
            <AppBar title="가계부">
              <Bell visible={false} />
            </AppBar>
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note="걸린 필터 수 · 거래 수처럼 늘 있는 개수를 알림 숫자로 — 새 것이 아니라 보아도 사라지지 않는다">
        <W w={300}>
          <div className="flex flex-col gap-2">
            <AppBar title="가계부">
              <BarButton>
                <NotificationBadgeView look={nl()} size="large" count={2}>
                  <DIcon name="sliders" size={24} color={tone('fg-neutral')} />
                </NotificationBadgeView>
              </BarButton>
              <Bell />
            </AppBar>
            <Arrow>필터를 보고 돌아와도</Arrow>
            <AppBar title="가계부">
              <BarButton>
                <NotificationBadgeView look={nl()} size="large" count={2}>
                  <DIcon name="sliders" size={24} color={tone('fg-neutral')} />
                </NotificationBadgeView>
              </BarButton>
              <Bell />
            </AppBar>
          </div>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

const OveruseGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="한 화면에 하나 — 상단 바의 알림만">
        <LedgerScreen mode="auto" bell={<Bell />} scale={0.62} h={470} />
      </Verdict>
      <Verdict ok={false} note="탭마다 점 — 무엇이 중요한지 흐려진다. 탭은 여러 탭에 동시에 달지 않는다">
        <LedgerScreen mode="auto" bell={<Bell />} scale={0.62} h={470} tabsDots />
      </Verdict>
    </Pair>
  </Panel>
);

const CountGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair three>
      <Verdict ok note="대부분은 점 — 새 것이 있는지만">
        <W w={240}>
          <AppBar title="가계부">
            <Bell />
          </AppBar>
        </W>
      </Verdict>
      <Verdict ok note="몇 개인지가 판단에 필요할 때만 숫자">
        <W w={240}>
          <AppBar title="결재" brand="hr">
            <Bell brand="hr" notif="large" count={3} />
          </AppBar>
        </W>
      </Verdict>
      <Verdict ok={false} note='개수가 아닌 말("연결됨")을 알림 자리에 — 버튼 글 · Badge 다'>
        <W w={240}>
          <AppBar title="거래 상세">
            <BarButton>
              <span className="relative inline-flex">
                <DIcon name="repeat" size={24} color={tone('fg-neutral')} />
                <span className="absolute flex" style={{ left: 24 - nl().count.fromRight, top: nl().count.bottom - nl().count.h }}>
                  <NotifCountView look={nl()} count={1} label="연결됨" />
                </span>
              </span>
            </BarButton>
          </AppBar>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

const ColorGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="브랜드 색 — Desk 파랑 · HR 초록. 알림은 오류가 아니다">
        <W w={280}>
          <div className="flex flex-col gap-2">
            <AppBar title="groo desk">
              <Bell />
              <Bell notif="large" count={3} />
            </AppBar>
            <AppBar title="groo hr" brand="hr">
              <Bell brand="hr" />
              <Bell brand="hr" notif="large" count={3} />
            </AppBar>
          </div>
        </W>
      </Verdict>
      <Verdict ok={false} note="빨간 점 · 숫자 — 오류 · 넘침 표시와 같은 색이 된다">
        <W w={280}>
          <div className="flex flex-col gap-2">
            <AppBar title="groo desk">
              <BarButton>
                <span className="relative inline-flex">
                  <DIcon name="bell" size={24} color={tone('fg-neutral')} />
                  <NotifDotView look={nl()} style={{ position: 'absolute', top: nl().dot.top, right: nl().dot.right, background: tone('fg-critical') }} />
                </span>
              </BarButton>
              <BarButton>
                <span className="relative inline-flex">
                  <DIcon name="bell" size={24} color={tone('fg-neutral')} />
                  <span className="absolute flex" style={{ left: 24 - nl().count.fromRight, top: nl().count.bottom - nl().count.h }}>
                    <NotifCountView look={nl()} count={3} style={{ background: rc('bg-critical-solid') }} />
                  </span>
                </span>
              </BarButton>
            </AppBar>
          </div>
        </W>
      </Verdict>
    </Pair>
  </Panel>
);

const NameGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="점 · 숫자는 숨기고 붙은 버튼의 이름에 — 줄이지 않은 수로">
        <div className="flex flex-col items-center gap-3">
          <W w={260}>
            <AppBar title="가계부">
              <Bell notif="large" count={3} />
            </AppBar>
          </W>
          <Reading tone="ok">&ldquo;알림, 새 알림 3개, 버튼&rdquo;</Reading>
          <W w={260}>
            <AppBar title="가계부">
              <Bell notif="large" count={128} />
            </AppBar>
          </W>
          <Reading tone="ok">&ldquo;알림, 새 알림 128개, 버튼&rdquo;</Reading>
        </div>
      </Verdict>
      <Verdict ok={false} note='이름이 "알림" 뿐 — 새 알림이 있는지 소리로 알 수 없다. 숫자만 읽히는 "3" 도 무엇인지 모른다'>
        <div className="flex flex-col items-center gap-3">
          <W w={260}>
            <AppBar title="가계부">
              <Bell notif="large" count={3} />
            </AppBar>
          </W>
          <Reading tone="bad">&ldquo;알림, 버튼&rdquo;</Reading>
          <Reading tone="bad">&ldquo;3, 알림, 버튼&rdquo;</Reading>
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) — notification-badge.md 의 코드 그대로(Button ghost · iconOnly — 아이콘 크기는 버튼이 정한다) ──
function CodeButton({ size, count, visible = true, label }: { size?: 'large'; count?: number; visible?: boolean; label: string }) {
  const look = iconBtn();
  const s = look.faces.light.enabled.icon;
  return (
    <ButtonView
      look={look}
      ariaLabel={label}
      iconNode={
        <NotificationBadgeView look={nl()} size={size} count={count} visible={visible}>
          <DIcon name="bell" size={s} strokeWidth={2.2} />
        </NotificationBadgeView>
      }
    />
  );
}
// 상단 바의 알림 — Top Navigation 의 아이콘 버튼(상자 44 · 아이콘 24, top-navigation.yaml)이 점(small)을 붙인다 — md 코드의 TopNavigationIconButton
const ExDot: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex justify-center">
      <TopIconButton look={navKit().top} icon="bell" label="알림, 새 알림 있음" notification live />
    </div>
  </Preview>
);
const ExCount: Fig = ({ caption }) => (
  <Preview caption={caption} w={320}>
    <div className="flex justify-center gap-10">
      <CodeButton size="large" count={3} label="알림, 새 알림 3개" />
      <CodeButton size="large" count={128} label="알림, 새 알림 128개" />
    </div>
  </Preview>
);

export const notificationBadgeFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  size: Size,
  placement: Placement,
  'when-guide': WhenGuide,
  'overuse-guide': OveruseGuide,
  'count-guide': CountGuide,
  'color-guide': ColorGuide,
  'name-guide': NameGuide,
  'ex-dot': ExDot,
  'ex-count': ExCount,
};
