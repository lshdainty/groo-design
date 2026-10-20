// Side Panel 페이지의 그림 — specs/components/side-panel.md 의 `[그림: …](../../site/components/specs/side-panel.tsx#<id>)` 자리.
// 패널 · 딤 · 머리 · 닫기 · 본문 끝 흐림은 side-panel.yaml 을 푼 값(navKit().panel — nav-side-view 의 SidePanelView)으로,
// 주 메뉴의 항목은 side-navigation.yaml, 상단 바는 top-navigation.yaml, 시트는 bottom-sheet.yaml, 바닥 버튼은 button.yaml 로 그린다.
// 화면 속 목록 · 설정 줄은 역할 색으로 간단히 그린 대역이다(지어낸 내용).
import type { ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { menuKit } from './menu-look';
import { Sheet, Verdict, rc, type Mode } from './kit';
import { HR_NAV_CODE } from './nav-data';
import { SidePanelPlayground } from './nav-side-playground';
import { Band, Bar, Cap, CodePreview, Desktop, HrDrawer, HrLeavePhone, Legend, NK, NPhone, PHONE, Side, SidePanel, Tap, Wide, markBox, markLine, pinAt, type Fig } from './nav-screens';

const P = (brand: 'desk' | 'hr' = 'desk') => NK(brand).panel;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
const SETTINGS = ['카드 결제 예정', '예산을 넘었을 때', '일정 알림', '더치페이 요청', '증권 연결이 끊겼을 때', '공지사항', '주간 리포트', '월간 리포트', '새 기능 소식', '로그인 알림'];
// 설정 줄(그림) — 이름 + 켬 표시
function SettingRows({ mode = 'auto', n = 5 }: { mode?: Mode; n?: number }) {
  return (
    <div className="flex flex-col">
      {SETTINGS.slice(0, n).map((r, i) => (
        <div key={r} className="flex items-center justify-between text-[16px]" style={{ minHeight: 52, color: rc('fg-neutral', mode), boxShadow: i < n - 1 ? `inset 0 -1px 0 ${rc('stroke-neutral-subtle', mode)}` : undefined }}>
          {r}
          <span className="block rounded-full" style={{ width: 40, height: 24, background: rc(i % 3 === 2 ? 'stroke-neutral-weak' : 'bg-brand-solid', mode) }} />
        </div>
      ))}
    </div>
  );
}
const formFooter = (mode: Mode = 'auto') => (
  <>
    <ButtonView look={buttonLook({ variant: 'neutralWeak', size: P().footer.buttonSize })} mode={mode} label="취소" state="enabled" />
    <ButtonView look={buttonLook({ variant: 'brandSolid', size: P().footer.buttonSize })} mode={mode} label="저장" state="enabled" />
  </>
);
// 1280 데스크톱 화면 + 오른쪽 패널(조회 · 폼)
function DeskWithPanel({ mode = 'auto', size = 'medium', s = 0.33, form = false, scrolled = false, cw, ch, description = true }: { mode?: Mode; size?: 'small' | 'medium' | 'large'; s?: number; form?: boolean; scrolled?: boolean; cw?: number; ch?: number; description?: boolean }) {
  const k = NK();
  return (
    <Desktop mode={mode} w={1280} h={720} s={s} cw={cw} ch={ch}>
      <div className="relative h-full w-full" style={{ background: rc('bg-layer-basement', mode) }}>
        <div className="flex h-full">
          <Side mode={mode} current="ledger" />
          <div className="flex min-w-0 flex-1 flex-col">
            <Bar mode={mode} type="desktop" actions={[{ icon: 'bell', label: '알림' }, { icon: 'settings', label: '설정' }]} primary={{ label: '내역 추가', icon: 'plus' }} />
            <div style={{ paddingTop: k.top.desktop.navToTitle, paddingLeft: k.margin, fontSize: 26, lineHeight: '35px', fontWeight: 700, color: rc('fg-neutral', mode) }}>설정</div>
          </div>
        </div>
        <SidePanel mode={mode} side="right" width={P().widths[size]} title="알림 설정" description={description ? '알림을 받을 때를 골라요.' : undefined} close={!form} footer={form ? formFooter(mode) : undefined} scrolled={scrolled} fog>
          <SettingRows mode={mode} n={10} />
        </SidePanel>
      </div>
    </Desktop>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <HrLeavePhone mode={mode} scale={0.4} h={600} expanded overlay={<HrDrawer mode={mode} />} />
          <DeskWithPanel mode={mode} s={0.33} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <SidePanelPlayground
    looks={{ desk: P('desk'), hr: P('hr') }}
    sides={{ desk: NK('desk').side, hr: NK('hr').side }}
    bubbles={{ desk: menuKit('desk').bubble, hr: menuKit('hr').bubble }}
    tops={{ desk: NK('desk').top, hr: NK('hr').top }}
    tones={{ desk: NK('desk').tone, hr: NK('hr').tone }}
    cancel={{ desk: buttonLook({ variant: 'neutralWeak', size: P().footer.buttonSize }, 'desk'), hr: buttonLook({ variant: 'neutralWeak', size: P().footer.buttonSize }, 'hr') }}
    save={{ desk: buttonLook({ variant: 'brandSolid', size: P().footer.buttonSize }, 'desk'), hr: buttonLook({ variant: 'brandSolid', size: P().footer.buttonSize }, 'hr') }}
  />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const p = P();
  const W = 560;
  const H = 620;
  const pw = p.widths.small;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative" style={{ marginLeft: 24, marginRight: 30 }}>
          <div className="relative overflow-hidden" style={{ width: W, height: H, background: rc('bg-layer-basement') }}>
            <div style={{ paddingTop: 24, paddingLeft: 24, fontSize: 22, fontWeight: 700, color: rc('fg-neutral') }}>설정</div>
            <SidePanel side="right" width={pw} title="알림 설정" description="알림을 받을 때를 골라요." footer={formFooter()} close fog={false} zone={{ header: markLine, body: markLine, footer: markLine, root: { outline: '2px dashed #DB2777', outlineOffset: -2 } }}>
              <SettingRows n={6} />
            </SidePanel>
          </div>
          {pinAt('ⓐ', { left: (W - pw) / 2 - 10, top: H / 2 - 10 })}
          {pinAt('ⓑ', { right: -28, top: H / 2 - 10 })}
          {pinAt('ⓒ', { left: W - pw - 28, top: p.header.padTop + 4 })}
          {pinAt('ⓓ', { left: W - pw - 28, top: 220 })}
          {pinAt('ⓔ', { left: W - pw - 28, top: H - 50 })}
        </div>
        <Legend
          items={[
            ['ⓐ', 'Overlay — 딤'],
            ['ⓑ', 'Container — 높이 전체 · 모서리 없음'],
            ['ⓒ', 'Header'],
            ['ⓓ', 'Body'],
            ['ⓔ', 'Footer'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Side_: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center gap-2">
        <HrLeavePhone scale={0.46} h={600} expanded overlay={<HrDrawer />} />
        <Cap w={170}>왼쪽 — 화면 폭의 {Math.round(P().leftRatio * 100)}%(HR 폰 주 메뉴)</Cap>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DeskWithPanel s={0.3} />
        <Cap w={360}>오른쪽 — 1280 이상의 보조 작업, medium {P().widths.medium}</Cap>
      </div>
    </div>
  </Figure>
);

const Size: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-5">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-1.5">
          <DeskWithPanel s={0.36} size={size} description={false} />
          <Cap>
            {size} {P().widths[size]}
            {size === P().defaults.size ? ' (기본)' : ''} — 화면의 {Math.round(P().maxRatio * 100)}% 를 넘지 않는다
          </Cap>
        </div>
      ))}
    </div>
  </Figure>
);

const Layout: Fig = ({ caption }) => {
  const p = P();
  const pw = p.widths.small;
  const H = 520;
  const ctop = p.close.top - (p.close.size - p.close.icon) / 2;
  const cright = p.close.right - (p.close.size - p.close.icon) / 2;
  const frame = (scrolled: boolean, marks: boolean) => (
    <div className="relative overflow-hidden" style={{ width: pw, height: H, background: rc('bg-layer-basement') }}>
      <SidePanel side="right" width={pw} title="알림 설정" description="알림을 받을 때를 골라요." footer={formFooter()} close dim={false} alone scrolled={scrolled} zone={marks ? { title: markBox, description: markBox, body: markLine } : undefined}>
        <div style={{ marginTop: scrolled ? -90 : 0 }}>
          <SettingRows n={8} />
        </div>
      </SidePanel>
      {marks && (
        <>
          <Band style={{ left: 0, top: 0, width: p.header.padX, height: p.header.padTop }} label={`${p.header.padX}`} />
          <Band style={{ left: p.header.padX, top: 0, width: 120, height: p.header.padTop }} label={`${p.header.padTop}`} />
          <span aria-hidden className="absolute" style={{ right: cright, top: ctop, width: p.close.size, height: p.close.size, ...markBox, zIndex: 120 }} />
          <Band style={{ right: 0, top: p.close.top + p.close.icon / 2 - 2, width: p.close.right, height: 4 }} label={`${p.close.right}`} tag="below" />
          <Band style={{ left: 0, bottom: p.footer.padBottom + 36 + p.footer.padTop, width: p.body.padX, height: 60 }} label={`${p.body.padX}`} />
          <Band style={{ right: 0, bottom: 0, width: 120, height: p.footer.padBottom }} label={`${p.footer.padBottom}`} />
          <Band style={{ right: 0, bottom: p.footer.padBottom + 36, width: 120, height: p.footer.padTop }} label={`${p.footer.padTop}`} />
        </>
      )}
      {scrolled && <span aria-hidden className="absolute" style={{ left: -4, right: -4, top: 128 - 3, height: 6, outline: '1px dashed #DB2777', borderRadius: 3, zIndex: 130 }} />}
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          {frame(false, true)}
          <Cap w={480}>
            머리 위 {p.header.padTop} · 좌우 {p.header.padX} · 아래 {p.header.padBottom}, 제목 {parseFloat(p.title.fontSize)} / {parseFloat(p.title.lineHeight)} · {p.title.fontWeight} · 설명 {parseFloat(p.description.fontSize)} / {parseFloat(p.description.lineHeight)} · 사이 {p.header.gap}. 닫기 상자 {p.close.size} · 아이콘 {p.close.icon}(위 {p.close.top} · 오른쪽 {p.close.right}). 본문 좌우 {p.body.padX}, 바닥 위 {p.footer.padTop} · 아래 {p.footer.padBottom} · 버튼 사이 {p.footer.gap}
          </Cap>
        </div>
        <div className="flex flex-col items-center gap-2">
          {frame(true, false)}
          <Cap>본문을 위로 스크롤하면 머리 아래 {p.divider.h}px 선(점선 자리)</Cap>
        </div>
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
const RoleGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Pair>
        <Verdict ok note="768 미만 — 왼쪽 패널은 주 메뉴(HR 폰)">
          <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer />} />
        </Verdict>
        <Verdict ok note="1280 미만 — 같은 보조 작업은 Bottom Sheet">
          <NPhone scale={0.4} h={600} bar={<Bar title="설정" />} overlay={<Sheet title="알림 설정"><div className="px-6"><SettingRows n={4} /></div></Sheet>}>
            <SettingRows n={2} />
          </NPhone>
        </Verdict>
      </Pair>
      <Pair stack>
        <Verdict ok note="1280 이상 — 옆에 둘 까닭이 있으면 오른쪽 패널(목록을 보며 한 줄의 상세)">
          <Wide>
            <DeskWithPanel s={0.36} />
          </Wide>
        </Verdict>
      </Pair>
    </div>
  </Plate>
);

const DrawerGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Pair>
        <Verdict ok note="지금 묶음(휴가)이 펼쳐진 채 열린다 — 지금 항목이 보인다">
          <div className="relative">
            <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer />} />
            <Tap x={0.4 * (P('hr').body.padXLeft + NK('hr').side.content.padX + NK('hr').side.sub.padLeft + 28)} y={0.4 * (40 + P('hr').header.minH + P('hr').fog.padTop + NK('hr').side.content.padTop + NK('hr').side.group.pad * 2 + parseFloat(NK('hr').side.group.type.lineHeight) + NK('hr').side.item.minH * 5.5)} note="휴가 신청" />
          </div>
        </Verdict>
        <Verdict ok note="휴가 신청을 누르면 이동하고 닫힌다 — 다음 화면의 제목에 초점">
          <HrLeavePhone scale={0.4} h={600} title="휴가 신청" />
        </Verdict>
      </Pair>
      <Pair>
        <Verdict ok={false} note="지금 묶음이 접힌 채 연다 — 어디에 있는지 다시 찾아야 한다">
          <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer open={[]} />} />
        </Verdict>
        <Verdict ok={false} note="이동한 뒤에도 서랍이 열려 있다">
          <HrLeavePhone scale={0.4} h={600} title="휴가 신청" expanded overlay={<HrDrawer current="leave-apply" />} />
        </Verdict>
      </Pair>
    </div>
  </Plate>
);

const DismissGuide: Fig = ({ caption }) => {
  const p = P();
  return (
    <Plate caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Pair>
          <Verdict ok note="주 메뉴 — 딤(오른쪽 20%)을 누르면 닫힌다">
            <div className="relative">
              <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer />} />
              <Tap x={PHONE * 0.4 * 0.9} y={600 * 0.4 * 0.55} note="누름" />
            </div>
          </Verdict>
          <Verdict ok note={`주 메뉴 — 손가락으로 왼쪽으로 끌면 닫힌다(빠르게 ${p.drag.velocity}px/ms 넘게 · 폭의 ${Math.round(p.drag.ratio * 100)}% 이상). 마우스로는 끌지 않는다`}>
            <div className="relative">
              <HrLeavePhone scale={0.4} h={600} expanded overlay={<HrDrawer />} />
              <Tap x={PHONE * 0.4 * 0.45} y={600 * 0.4 * 0.5} note="← 끌기" />
            </div>
          </Verdict>
        </Pair>
        <Pair stack>
          <Verdict ok note="입력 폼 — 딤 · 끌기로 닫히지 않는다. 머리 닫기 없이 바닥 [취소] · Esc">
            <Wide>
              <div className="relative">
                <DeskWithPanel s={0.36} form />
                <Tap x={1280 * 0.36 * 0.2} y={32 + 720 * 0.36 * 0.5} note="눌러도 그대로" />
              </div>
            </Wide>
          </Verdict>
        </Pair>
      </div>
    </Plate>
  );
};

// ── 코드 예시(미리보기) — side-panel.md 의 코드 그대로 ──────
const ExDrawer: Fig = ({ caption }) => (
  <CodePreview caption={caption} pad={16} padX={0} w={PHONE} brand="hr" bg="bg-layer-basement">
    <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ width: PHONE, height: 520, background: rc('bg-layer-default', 'auto', 'hr') }}>
      <Bar brand="hr" leading="menu" title="휴가 현황" leadingExpanded />
      <SidePanel brand="hr" side="left" width={PHONE * P('hr').leftRatio} title="그루 이음" fog>
        <Side brand="hr" drawer groups={HR_NAV_CODE} current="leave-history" />
      </SidePanel>
    </div>
  </CodePreview>
);

export const sidePanelFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  side: Side_,
  size: Size,
  layout: Layout,
  'role-guide': RoleGuide,
  'drawer-guide': DrawerGuide,
  'dismiss-guide': DismissGuide,
  'ex-drawer': ExDrawer,
};

