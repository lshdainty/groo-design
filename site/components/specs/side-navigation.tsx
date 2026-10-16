// Side Navigation 페이지의 그림 — specs/components/side-navigation.md 의 `[그림: …](../../site/components/specs/side-navigation.tsx#<id>)` 자리.
// 사이드바 · 펼침 메뉴는 side-navigation.yaml 을 푼 값(navKit().side — nav-side-view 의 SideNav)으로, 이름 말풍선은 help-bubble.yaml(menu-view 의 BubbleView),
// 데스크톱 머리 · 폰 상단 바는 top-navigation.yaml, 주 메뉴 서랍은 side-panel.yaml 로 그린다. 본문은 역할 색으로 간단히 그린 대역이다(지어낸 내용).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { menuKit } from './menu-look';
import { Card, Verdict, rc, type Mode } from './kit';
import { cardLook } from './data-look';
import { DESK_NAV, DESK_NAV_CODE } from './nav-data';
import { SideNavPlayground } from './nav-side-playground';
import {
  AccountRow,
  Band,
  Cap,
  CodePreview,
  DeskHeader,
  DeskMain,
  Desktop,
  HrDrawer,
  HrLeaveMain,
  HrLeavePhone,
  Legend,
  NK,
  Scaled,
  ScreenTitle,
  Shell,
  Side,
  markBox,
  markLine,
  modeKo,
  pinAt,
  type Fig,
} from './nav-screens';
import { collapsedTop, type SideGroup } from './nav-shared';
import { NavGlyph } from './nav-view';

const S = (brand: 'desk' | 'hr' = 'desk') => NK(brand).side;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
// 사이드바 하나를 판 위에 — 높이를 정하고 위 · 아래를 자른다
function SideBox({ children, h, label, mode = 'auto', style }: { children: ReactNode; h: number; label?: ReactNode; mode?: Mode; style?: CSSProperties }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <div className="relative" style={{ height: h, background: rc('bg-layer-basement', mode), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle', mode)}`, ...style }}>
        {children}
      </div>
      {label && <Cap mode={mode === 'auto' ? 'auto' : mode}>{label}</Cap>}
    </div>
  );
}
// 긴 이름 하나 — 줄바꿈 그림
const withLong = (groups: SideGroup[], value: string, label: string): SideGroup[] => groups.map((g) => ({ ...g, items: g.items.map((i) => (i.value === value ? { ...i, label } : i)) }));

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <Desktop mode={mode} w={1280} h={720} s={0.46} cw={640} ch={600}>
            <Shell mode={mode} side={<Side mode={mode} current="ledger" />} header={<DeskHeader mode={mode} />}>
              <DeskMain mode={mode} />
            </Shell>
          </Desktop>
          <Desktop mode={mode} w={1024} h={720} s={0.46} cw={360} ch={600} url="hr.porest.app">
            <Shell mode={mode} brand="hr" side={<Side brand="hr" mode={mode} current="leave-history" collapsed />}>
              <HrLeaveMain mode={mode} />
            </Shell>
          </Desktop>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <SideNavPlayground looks={{ desk: S('desk'), hr: S('hr') }} bubbles={{ desk: menuKit('desk').bubble, hr: menuKit('hr').bubble }} tones={{ desk: NK('desk').tone, hr: NK('hr').tone }} />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const s = S();
  // 펼친 사이드바에서 항목의 위 끝 — 머리 + 내용 위 여백 + 묶음 이름 + 앞 항목(증권은 펼쳐 하위 둘)
  const order = ['home', 'assets', 'stocks', 'namu', 'toss'];
  const itemTop = (v: string) => s.header.minH + s.content.padTop + s.group.pad * 2 + parseFloat(s.group.type.lineHeight) + order.indexOf(v) * s.item.minH;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative" style={{ marginLeft: 30, marginRight: 40 }}>
          <SideBox h={640}>
            <Side
              current="namu"
              height={640}
              open={['stocks']}
              markItem="assets"
              markSub="toss"
              footer={<HelpLinkRow />}
              zone={{ root: markLine, header: markLine, trigger: markBox, content: markLine, group: markLine, item: markBox, sub: markBox, footer: markLine }}
            />
            {/* 핀 — 내용 상자는 넘친 것을 자르므로 사이드바 바깥(판 위)에 둔다 */}
            {pinAt('ⓑ', { left: -30, top: s.header.minH / 2 - 10 })}
            {pinAt('ⓒ', { right: -30, top: s.trigger.top + s.trigger.size / 2 - 10 })}
            {pinAt('ⓓ', { right: -30, top: s.header.minH + 6 })}
            {pinAt('ⓔ', { left: -30, top: s.header.minH + s.content.padTop + 4 })}
            {pinAt('ⓕ', { right: -30, top: itemTop('assets') + s.item.minH / 2 - 10 })}
            {pinAt('ⓖ', { right: -30, top: itemTop('toss') + s.item.minH / 2 - 10 })}
            {pinAt('ⓗ', { left: -30, top: 640 - s.footer.pad - s.item.minH / 2 - 10 })}
            {pinAt('ⓐ', { right: -30, top: 640 - 24 })}
          </SideBox>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 흰 면 + 오른쪽 1px'],
            ['ⓑ', 'Header'],
            ['ⓒ', 'Trigger'],
            ['ⓓ', 'Content'],
            ['ⓔ', 'Group'],
            ['ⓕ', 'Item'],
            ['ⓖ', 'Sub Item'],
            ['ⓗ', 'Footer'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
function Ruler({ parts, s }: { parts: [number, string][]; s: number }) {
  return (
    <div className="flex" style={{ height: 18 }}>
      {parts.map(([w, label], i) => (
        <span key={i} className="flex items-center justify-center text-[10px] font-bold text-white" style={{ width: w * s, background: i % 2 ? '#DB2777' : 'rgba(219, 39, 119, 0.55)', boxShadow: 'inset -1px 0 0 #ffffff' }}>
          {label}
        </span>
      ))}
    </div>
  );
}
const Collapse: Fig = ({ caption }) => {
  const s = S();
  const sc = 0.4;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <Desktop w={1280} h={600} s={sc}>
            <Shell side={<Side current="ledger" />} header={<DeskHeader />}>
              <DeskMain />
            </Shell>
          </Desktop>
          <Ruler s={sc} parts={[[s.width, `${s.width}`], [1280 - s.width, `본문 ${1280 - s.width}`]]} />
          <Cap>1280 — 펼침 {s.width}(기본)</Cap>
        </div>
        <div className="flex flex-col gap-1.5">
          <Desktop w={1024} h={600} s={sc}>
            <Shell side={<Side current="ledger" collapsed />} header={<DeskHeader />}>
              <DeskMain />
            </Shell>
          </Desktop>
          <Ruler s={sc} parts={[[s.collapsedWidth, `${s.collapsedWidth}`], [1024 - s.collapsedWidth, `본문 ${1024 - s.collapsedWidth}`]]} />
          <Cap>1024 — 접힘 {s.collapsedWidth}(768 ~ 1279 의 기본). 이름 · 묶음 이름 · 꺾쇠 · 하위가 숨고 묶음 사이에 선</Cap>
        </div>
      </div>
    </Figure>
  );
};

const Header: Fig = ({ caption }) => {
  const s = S();
  const z = 1.5;
  const T = s.trigger;
  const grow = (T.touch - T.size) / 2;
  const box = (collapsed: boolean) => {
    const w = collapsed ? s.collapsedWidth : s.width;
    const right = collapsed ? T.rightCollapsed : T.right;
    return (
      <div className="relative overflow-hidden" style={{ width: w * z, height: s.header.minH * z, background: rc('bg-layer-default'), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle')}` }}>
        <div style={{ width: w, transform: `scale(${z})`, transformOrigin: 'left top' }}>
          <Side collapsed={collapsed} height={s.header.minH} zone={{ trigger: markBox }} />
        </div>
        <span aria-hidden className="absolute" style={{ right: (right - grow) * z, top: (T.top - grow) * z, width: T.touch * z, height: T.touch * z, outline: '1px dashed #DB2777', outlineOffset: -1, borderRadius: 4 }} />
      </div>
    );
  };
  const markX = (s.header.pad + s.logo.marginLeft) * z;
  return (
    <Figure caption={caption}>
      <div className="flex items-end justify-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {box(false)}
            <Band style={{ left: 0, top: 4, width: markX, height: 4 }} label={`${s.header.pad + s.logo.marginLeft}`} tag="below" />
            <Band style={{ right: 0, top: (T.top + T.size / 2) * z - 2, width: T.right * z, height: 4 }} label={`${T.right}`} tag="above" />
            <Band style={{ left: -12, top: 0, width: 6, height: s.header.minH * z }} label={`${s.header.minH}`} vertical tag="left" />
          </div>
          <Cap w={300}>펼침 — 마크 {s.logo.size} · 이름 {parseFloat(s.logo.type.fontSize)} / {parseFloat(s.logo.type.lineHeight)} · {s.logo.weight}, 접기 버튼 {T.size} · 아이콘 {T.icon} · 누르는 영역 {T.touch}(점선)</Cap>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {box(true)}
            <Band style={{ right: 0, top: (T.top + T.size / 2) * z - 2, width: T.rightCollapsed * z, height: 4 }} label={`${T.rightCollapsed}`} tag="above" />
          </div>
          <Cap w={160}>접힘 — 버튼만 {s.collapsedWidth} 의 가운데</Cap>
        </div>
      </div>
    </Figure>
  );
};

const Items: Fig = ({ caption }) => {
  const s = S();
  const z = 1.25;
  const groups = withLong(DESK_NAV, 'stats', '통계 · 분석 리포트 모아 보기');
  const top = s.header.minH + s.content.padTop;
  const groupH = s.group.pad * 2 + parseFloat(s.group.type.lineHeight);
  const itemTop = top + groupH;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative overflow-hidden" style={{ width: s.width * z, height: 470 * z, background: rc('bg-layer-default'), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle')}` }}>
          <div style={{ width: s.width, transform: `scale(${z})`, transformOrigin: 'left top' }}>
            <Side current="ledger" groups={groups} height={470} markItem="home" zone={{ item: markLine, icon: markBox, label: markBox, groupLabel: markBox }} />
          </div>
          <Band style={{ right: 6 * z, top: itemTop * z, width: 6, height: s.item.minH * z }} label={`${s.item.minH}`} vertical tag="left" />
          <Band style={{ left: (s.content.padX + s.item.padX + s.icon.size) * z, top: (itemTop + s.item.minH - 8) * z, width: s.item.gap * z, height: 4 }} label={`${s.item.gap}`} tag="below" />
          <Band style={{ left: 0, top: (top + 4) * z, width: (s.content.padX + s.group.pad) * z, height: 4 }} label={`${s.content.padX + s.group.pad}`} tag="below" />
        </div>
        <Cap w={420}>
          묶음 이름 {parseFloat(s.group.type.fontSize)} / {parseFloat(s.group.type.lineHeight)} · {s.group.weight} · 항목 최소 {s.item.minH} · 좌우 {s.item.padX} · 모서리 {s.item.radius} · 아이콘 {s.icon.size} · 사이 {s.item.gap} · 이름 {parseFloat(s.label.type.fontSize)} / {parseFloat(s.label.type.lineHeight)} · {s.label.weight}. 긴 이름은 줄을 바꾼다(통계)
        </Cap>
      </div>
    </Figure>
  );
};

const Current: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-5">
          <SideBox mode={mode} h={430} label={`${modeKo(mode)} · Desk — 가계부`}>
            <Side mode={mode} current="ledger" height={430} />
          </SideBox>
          <SideBox mode={mode} h={430} label={`${modeKo(mode)} · HR — 휴가 › 휴가 현황(부모 펼침)`}>
            <Side brand="hr" mode={mode} current="leave-history" height={430} />
          </SideBox>
        </div>
      ))}
    </div>
  </Figure>
);

// 사이드바의 한 조각(위 · 아래를 잘라) — 내용 위 끝에서 y 만큼
function SideSlice({ children, y, h, w = S().width, mode = 'auto' }: { children: ReactNode; y: number; h: number; w?: number; mode?: Mode }) {
  return (
    <div className="relative overflow-hidden" style={{ width: w, height: h, background: rc('bg-layer-default', mode), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle', mode)}` }}>
      <div style={{ marginTop: -y }}>{children}</div>
    </div>
  );
}
const SubItems: Fig = ({ caption }) => {
  const s = S();
  const y = s.header.minH;
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-4">
        {(
          [
            ['접힘 — 꺾쇠 아래', { current: 'ledger', open: [] as string[] }],
            ['펼침 — 하위 항목 40 에서', { current: 'ledger', open: ['stocks'] }],
            ['지금 하위(나무증권) — 부모는 저절로 펼침', { current: 'namu', open: undefined }],
          ] as const
        ).map(([label, p]) => (
          <div key={label} className="flex w-[190px] flex-col items-center gap-2">
            <Scaled w={s.width} h={300} s={190 / s.width}>
              <SideSlice y={y} h={300}>
                <Side current={p.current} open={p.open as string[] | undefined} height={700} />
              </SideSlice>
            </Scaled>
            <Cap>{label}</Cap>
          </div>
        ))}
      </div>
    </Figure>
  );
};

const Scroll: Fig = ({ caption }) => {
  const s = S();
  const H = 420;
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-8">
        <SideBox h={H} label="맨 위 — 선 없음 · 아래 끝 흐림">
          <Side current="ledger" height={H} />
          <Band style={{ right: -14, bottom: 0, width: 6, height: s.fog.bottom }} label={`${s.fog.bottom}`} vertical tag="right" />
        </SideBox>
        <SideBox h={H} label={`스크롤함 — 머리 아래 ${s.divider.h}px 선`}>
          <Side current="ledger" height={H} scrollTop={120} />
          <span aria-hidden className="absolute" style={{ left: -6, right: -6, top: s.header.minH - 3, height: 6, outline: '1px dashed #DB2777', outlineOffset: 0, borderRadius: 3 }} />
        </SideBox>
      </div>
    </Figure>
  );
};

const Flyout: Fig = ({ caption }) => {
  const s = S();
  const H = 470;
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-6">
        <SideBox h={H} label="자산(하위 없음) — 이름 말풍선" style={{ width: 230 }}>
          <Side collapsed current="ledger" height={H} tip="assets" states={{ assets: 'hovered' }} />
        </SideBox>
        <SideBox h={H} label="증권(부모) — 옆 펼침 메뉴, 지금 화면 줄 표시" style={{ width: 270 }}>
          <Side collapsed current="namu" height={H} flyout="stocks" states={{ stocks: 'hovered' }} />
          <Band style={{ left: s.content.padX + s.item.widthCollapsed, top: collapsedTop(s, DESK_NAV, 'stocks') + 6, width: s.flyout.offset, height: 4 }} label={`${s.flyout.offset}`} tag="above" />
        </SideBox>
      </div>
    </Figure>
  );
};

const STATE_KO = { enabled: '기본', hovered: '호버', pressed: '누름', focused: '포커스', current: '지금', disabled: '막힘' } as const;
const States: Fig = ({ caption }) => {
  const s = S();
  const list = Object.keys(STATE_KO) as (keyof typeof STATE_KO)[];
  const groups = (k: string): SideGroup[] => [{ items: [{ value: k, label: '가계부', icon: 'ledger' }] }];
  return (
    <Figure caption={caption}>
      <div className="flex gap-5">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col gap-1 rounded-xl" style={{ background: rc('bg-layer-default', mode), paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 12 }}>
            <span className="pb-1 pl-2 text-[12px] font-bold" style={{ color: rc('fg-neutral-subtle', mode) }}>{modeKo(mode)}</span>
            {list.map((st) => (
              <div key={st} className="flex items-center gap-2">
                <div style={{ width: 176, marginTop: -s.content.padTop }}>
                  <Side drawer mode={mode} groups={groups(st)} current={st === 'current' ? st : undefined} states={st === 'enabled' || st === 'current' ? undefined : { [st]: st as 'hovered' }} />
                </div>
                <span className="w-[56px] text-[11px] leading-4" style={{ color: rc('fg-neutral-subtle', mode) }}>
                  {STATE_KO[st]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
const WidthGuide: Fig = ({ caption }) => {
  const sc = 0.3;
  const win = (w: number, collapsed: boolean, label: string) => (
    <div className="flex flex-col items-center gap-1.5">
      <Desktop w={w} h={640} s={sc}>
        <Shell side={<Side current="ledger" collapsed={collapsed} />} header={<DeskHeader />}>
          <DeskMain />
        </Shell>
      </Desktop>
      <Cap>{label}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        {win(1440, false, '1440 — 펼침 240(기본) · 손으로 접으면 기억한다')}
        <div className="flex items-start gap-4">
          {win(1024, true, '1024 — 접힘 56(기본)')}
          {win(1024, false, '1024 에서 손으로 펼침 — 본문이 좁아진다')}
        </div>
      </div>
    </Figure>
  );
};

const MobileGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="HR 1280 — 사이드바(펼침 240)">
        <Desktop w={1280} h={640} s={0.36} cw={620} ch={560} url="hr.porest.app">
          <Shell brand="hr" side={<Side brand="hr" current="leave-history" />}>
            <HrLeaveMain />
          </Shell>
        </Desktop>
      </Verdict>
      <Verdict ok note="HR 폰 — ☰ 로 여는 왼쪽 주 메뉴에 같은 묶음 · 항목(지금 묶음 펼침)">
        <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer h={600} />} />
      </Verdict>
    </Pair>
  </Plate>
);

// 바닥의 보조 링크(설명서) — Anatomy 의 바닥 자리 그림. Desk 웹에는 지금 보조 링크가 없어 바닥을 그리지 않는다(Q-018-1 C)
function HelpLinkRow({ mode = 'auto' }: { mode?: Mode }) {
  const s = S();
  return (
    <div className="flex items-center" style={{ columnGap: s.item.gap, minHeight: s.item.minH, paddingLeft: s.item.padX, paddingRight: s.item.padX, color: rc('fg-neutral-muted', mode), fontSize: 14, fontWeight: 500 }}>
      <NavGlyph name="book" size={20} color={rc('fg-neutral-subtle', mode)} />
      설명서
    </div>
  );
}

// 하위가 사람마다 다른 증권 — 연결한 증권사 0 · 1 은 단독 항목(꺾쇠 없음), 2 · 3 은 부모(펼치기만). 이름은 지어낸 것(Q-017-4 정리)
const BROKERS = [
  { value: 'ga', label: '가나증권' },
  { value: 'da', label: '다라투자증권' },
  { value: 'ma', label: '마바사 글로벌증권' },
];
const withBrokers = (n: number): SideGroup[] => [
  {
    label: '워크스페이스',
    items: DESK_NAV[0].items.slice(0, 4).map((i) => (i.value === 'stocks' ? (n >= 2 ? { ...i, children: BROKERS.slice(0, n) } : { value: 'stocks', label: '증권', icon: 'trend' as const }) : i)),
  },
];
const DynamicGuide: Fig = ({ caption }) => {
  const H = 330;
  const cases: [number, string, string][] = [
    [0, 'stocks', '연결 0 — 단독 항목 · 누르면 연결 안내'],
    [1, 'stocks', '연결 1 — 단독 항목 · 누르면 가나증권'],
    [2, 'ga', '연결 2 — 부모(펼치기만) · 하위 둘'],
    [3, 'ma', '연결 3 — 긴 이름은 줄을 바꾼다'],
  ];
  return (
    <Figure caption={caption}>
      <div className="max-w-full overflow-x-auto">
        <div className="mx-auto flex w-max items-start gap-4">
          {cases.map(([n, current, label]) => (
            <SideBox key={n} h={H} label={label}>
              <Side current={current} height={H} groups={withBrokers(n)} open={n >= 2 ? ['stocks'] : []} />
            </SideBox>
          ))}
        </div>
      </div>
    </Figure>
  );
};

// 바닥 — 지금(이름 줄, 눌러도 아무 일 없음) · 뒤(바닥을 그리지 않는다, 설정 · 로그아웃은 머리 ⚙ — Q-018-1 C)
const FooterGuide: Fig = ({ caption }) => {
  const H = 520;
  return (
    <Plate caption={caption}>
      <Pair>
        <Verdict ok note="바닥을 그리지 않는다 — 설정 · 로그아웃은 머리의 ⚙">
          <SideBox h={H}>
            <Side current="ledger" height={H} />
          </SideBox>
        </Verdict>
        <Verdict ok={false} note="누르는 것처럼 보이는 이름 줄 — 눌러도 아무 일이 없다(지금 Desk 웹)">
          <SideBox h={H}>
            <Side current="ledger" height={H} footer={<AccountRow />} />
          </SideBox>
        </Verdict>
      </Pair>
    </Plate>
  );
};

const ParentGuide: Fig = ({ caption }) => {
  const groupsBad: SideGroup[] = DESK_NAV;
  return (
    <Plate caption={caption}>
      <Pair>
        <Verdict ok note="증권을 누르면 나무증권 · 토스증권이 펼쳐질 뿐 — 화면은 그대로(가계부)">
          <Desktop w={1280} h={640} s={0.36} cw={620} ch={560}>
            <Shell side={<Side current="ledger" open={['stocks']} states={{ stocks: 'hovered' }} />} header={<DeskHeader />}>
              <DeskMain />
            </Shell>
          </Desktop>
        </Verdict>
        <Verdict ok={false} note="증권을 누르면 증권 화면으로 이동하면서 펼쳐진다 — 부모가 화면이기도 하다">
          <Desktop w={1280} h={640} s={0.36} cw={620} ch={560}>
            <Shell side={<Side current="stocks" open={['stocks']} groups={groupsBad} />} header={<DeskHeader />}>
              <div className="flex flex-col">
                <ScreenTitle>증권</ScreenTitle>
                <div className="grid grid-cols-2" style={{ gap: cardLook().gutter, paddingTop: 20, paddingLeft: NK().margin, paddingRight: NK().margin }}>
                  {['나무증권', '토스증권'].map((b) => (
                    <Card key={b} title={b} style={{ height: 120 }}>
                      {null}
                    </Card>
                  ))}
                </div>
              </div>
            </Shell>
          </Desktop>
        </Verdict>
      </Pair>
    </Plate>
  );
};

function Crumbs() {
  const k = NK('hr');
  return (
    <div className="flex items-center gap-1.5 text-[14px]" style={{ height: k.top.height, paddingLeft: k.margin, background: rc('bg-layer-default', 'auto', 'hr'), color: rc('fg-neutral-muted', 'auto', 'hr') }}>
      홈 <span style={{ color: rc('fg-neutral-subtle') }}>›</span> 휴가 <span style={{ color: rc('fg-neutral-subtle') }}>›</span> <b style={{ color: rc('fg-neutral', 'auto', 'hr'), fontWeight: 500 }}>휴가 현황</b>
    </div>
  );
}
const PositionGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="사이드바의 지금 항목(휴가 › 휴가 현황 — 부모 펼침) + 본문 제목이 위치를 알린다">
        <Desktop w={1280} h={640} s={0.36} cw={620} ch={560} url="hr.porest.app">
          <Shell brand="hr" side={<Side brand="hr" current="leave-history" />}>
            <HrLeaveMain />
          </Shell>
        </Desktop>
      </Verdict>
      <Verdict ok={false} note="머리에 빵부스러기로 같은 위치를 한 번 더">
        <Desktop w={1280} h={640} s={0.36} cw={620} ch={560} url="hr.porest.app">
          <Shell brand="hr" side={<Side brand="hr" current="leave-history" />} header={<Crumbs />}>
            <HrLeaveMain />
          </Shell>
        </Desktop>
      </Verdict>
    </Pair>
  </Plate>
);

// ── 코드 예시(미리보기) — side-navigation.md 의 코드 그대로 ──────
const ExDesk: Fig = ({ caption }) => (
  <CodePreview caption={caption} pad={16} bg="bg-layer-basement" padX={0} w={S().width}>
    <Side groups={DESK_NAV_CODE} current="ledger" height={460} live />
  </CodePreview>
);
const ExCollapsed: Fig = ({ caption }) => (
  <CodePreview caption={caption} pad={16} bg="bg-layer-basement" padX={0} w={520}>
    <div className="flex justify-center gap-6">
      <div className="flex" style={{ width: 220 }}>
        <Side groups={DESK_NAV_CODE} current="ledger" collapsed height={420} tip="assets" states={{ assets: 'hovered' }} />
      </div>
      <div className="flex" style={{ width: 270 }}>
        <Side groups={DESK_NAV_CODE} current="namu" collapsed height={420} flyout="stocks" states={{ stocks: 'hovered' }} />
      </div>
    </div>
  </CodePreview>
);

export const sideNavigationFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  collapse: Collapse,
  header: Header,
  items: Items,
  current: Current,
  'sub-items': SubItems,
  scroll: Scroll,
  flyout: Flyout,
  states: States,
  'width-guide': WidthGuide,
  'mobile-guide': MobileGuide,
  'parent-guide': ParentGuide,
  'dynamic-guide': DynamicGuide,
  'footer-guide': FooterGuide,
  'position-guide': PositionGuide,
  'ex-desk': ExDesk,
  'ex-collapsed': ExCollapsed,
};

