// Menu 페이지의 그림 — specs/components/menu.md 의 `[그림: …](../../site/components/specs/menu.tsx#<id>)` 자리.
// 메뉴는 menu.yaml 을 푼 값(menuKit().menu — menu-view 의 MenuPanel)으로, 시트는 menu-sheet.yaml, 버튼은 button.yaml,
// 테마 고르기는 segmented-control.yaml 로 그린다. 화면 틀(창 · 폰)과 뒤 화면의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { MousePointer2 } from 'lucide-react';
import { Panel, MARK, MARK_LINE } from '../foundations/ui';
import { MemoMenuDemo, MenuPlayground, PeopleMenuDemo } from './menu-demos';
import { DELETE, DUPLICATE, EDIT, GUIDE_ITEM, MEMO_MENU, PERSON_MENU, PIN, SHARED_CAL_MENU, THEMES, THEME_MENU, TX_MENU } from './menu-data';
import type { MenuGroup } from './menu-look';
import { Anchored, Board, DesktopMemoMenu, IconButton, Menu, MemoWindow, PeopleWindow, PhoneMemoSheet, Scaled, iconBtn, mk, modeName } from './menu-screens';
import { Legend, Note, Shot, overlayKit, pinStyle } from './overlay-screens';
import { segmentedLook } from './segmented-control-look';
import { SegmentedView } from './segmented-control-view';
import { Cap } from './select-screens';
import { Verdict, WebWindow, rc, type Mode } from './kit';
import { cardFace } from './card-face';

type Fig = (p: { caption?: string }) => ReactNode;
const px = (v: string) => parseFloat(v);
const dashed: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 };
const markBox: CSSProperties = { ...dashed, background: MARK };
const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';

// 수치 띠 — 부위 안의 자리(absolute)에 분홍 띠 + 숫자
function Band({ style, label }: { style: CSSProperties; label?: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center justify-center" style={{ background: MARK, zIndex: 4, ...style }}>
      {label && <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>{label}</span>}
    </span>
  );
}
// 높이 표시 — 부위 오른쪽 바깥의 괄호와 수
function HeightTag({ label, gap = 12 }: { label: string; gap?: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center" style={{ top: 0, bottom: 0, left: `calc(100% + ${gap}px)`, zIndex: 4 }}>
      <span style={{ alignSelf: 'stretch', width: 6, borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}`, borderRight: `1px solid ${MARK_LINE}` }} />
      <span className="ml-1 whitespace-nowrap text-[11px] font-bold leading-4" style={{ color: MARK_LINE }}>
        {label}
      </span>
    </span>
  );
}

// ── Overview ──────────────────────────────────────────────
// Desk 메모 줄 ⋮(마우스가 고정 위) · HR 직원 줄 ⋮ — 라이트 줄 · 다크 줄
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col items-center gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <Scaled w={400} h={380} s={0.66}>
            <MemoWindow mode={mode} open={0} states={{ pin: 'hovered' }} />
          </Scaled>
          <Scaled w={460} h={420} s={0.66}>
            <PeopleWindow mode={mode} h={420} open={0} />
          </Scaled>
        </div>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <MenuPlayground kits={{ desk: mk('desk'), hr: mk('hr') }} ovs={{ desk: overlayKit('desk'), hr: overlayKit('hr') }} kebabs={{ desk: iconBtn('desk'), hr: iconBtn('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
// Desk 거래 줄의 ⋮ 메뉴 — 묶음 · 묶음 이름 · 선 · 줄 · 알약(마우스가 복사해 새로 쓰기 위). 아래는 줄의 부위
const Anatomy: Fig = ({ caption }) => {
  const m = mk().menu;
  const rowMid = (m.item.height - 20) / 2;
  const refund = TX_MENU[1].items[0];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <Board style={{ padding: '36px 44px' }}>
          <Menu
            groups={TX_MENU}
            states={{ duplicate: 'hovered' }}
            marks={{ groups: { 0: dashed }, labels: { 1: markBox }, items: { edit: { item: dashed } } }}
            decor={{
              root: pinStyle('ⓐ', { left: -10, bottom: -10 }),
              groups: { 0: pinStyle('ⓑ', { right: -30, top: -4 }) },
              labels: { 1: pinStyle('ⓒ', { left: -30, top: (m.groupLabel.height - 20) / 2 }) },
              dividers: { 1: pinStyle('ⓓ', { right: -m.divider.marginX - 30, top: -10 }) },
              items: { edit: pinStyle('ⓔ', { left: -30, top: rowMid }), duplicate: pinStyle('ⓕ', { right: -30, top: rowMid }) },
            }}
          />
        </Board>
        <Legend
          items={[
            ['ⓐ', 'Content'],
            ['ⓑ', 'Group'],
            ['ⓒ', 'Group Label'],
            ['ⓓ', 'Divider — 묶음 사이에만'],
            ['ⓔ', 'Item'],
            ['ⓕ', 'Highlight — 호버 · 누름 바탕, 키보드 링도 이 자리'],
          ]}
        />
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Board style={{ padding: '28px 40px' }}>
            <Menu
              groups={[{ items: [refund] }]}
              marks={{ items: { refund: { icon: markBox, label: markBox, desc: markBox } } }}
              decor={{
                items: {
                  refund: (
                    <>
                      {pinStyle('1', { left: m.item.padX - 2, top: -16 })}
                      {pinStyle('2', { left: m.item.padX + m.item.icon + m.item.gap + 6, top: -16 })}
                      {pinStyle('3', { right: -30, bottom: m.item.padY - 4 })}
                    </>
                  ),
                },
              }}
            />
          </Board>
          <Board style={{ padding: '28px 40px' }}>
            <Menu groups={[{ items: [{ value: 'settings', label: '설정' }, GUIDE_ITEM] }]} marks={{ items: { guide: { suffix: markBox } } }} decor={{ items: { guide: pinStyle('4', { right: -30, top: rowMid }) } }} />
          </Board>
        </div>
        <Legend
          items={[
            ['1', '앞 아이콘 — 쓰면 모든 줄에'],
            ['2', '이름'],
            ['3', '설명 — 꼭 필요한 줄에만'],
            ['4', '뒤 아이콘 — 바깥 링크처럼 방향을 알릴 때만(앞 아이콘과 한 줄에 두지 않는다)'],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 줄 · 묶음 · 선의 여백 ─────────────────────────────────
const LAYOUT_MENU: MenuGroup[] = [{ items: [EDIT, { value: 'refund', label: '환불 기록', description: '돌려받은 돈을 붙여요.', icon: 'undo' }] }, { items: [DELETE] }];
// 판 바깥 왼쪽의 수(메뉴 위아래 여백)
const SideTag = ({ label, style }: { label: string; style: CSSProperties }) => (
  <span aria-hidden className="pointer-events-none absolute flex items-center whitespace-nowrap text-[10px] font-bold leading-3" style={{ right: 'calc(100% + 6px)', color: MARK_LINE, zIndex: 4, ...style }}>
    {label}
  </span>
);
const Layout: Fig = ({ caption }) => {
  const m = mk().menu;
  const it = m.item;
  const d = m.divider;
  const c = m.content;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {/* 넓은 화면에서는 1.5 배로 키워 띠 · 수가 겹치지 않게 — 좁은 화면은 이 칸 안에서 가로로 민다 */}
        <div className="max-w-full overflow-x-auto">
        <div className="md:[zoom:1.5]">
          <Board style={{ padding: '20px 116px 20px 36px' }}>
            <Menu
              groups={LAYOUT_MENU}
              states={{ delete: 'hovered' }}
              marks={{ items: { edit: { icon: markBox } } }}
              decor={{
                root: (
                  <>
                    <Band style={{ left: 0, right: 0, top: 0, height: c.padY }} />
                    <Band style={{ left: 0, right: 0, bottom: 0, height: c.padY }} />
                    <SideTag label={String(c.padY)} style={{ top: 0, height: c.padY }} />
                    <SideTag label={String(c.padY)} style={{ bottom: 0, height: c.padY }} />
                  </>
                ),
                items: {
                  edit: (
                    <>
                      <Band style={{ left: 0, top: 0, bottom: 0, width: it.padX }} label={String(it.padX)} />
                      <Band style={{ left: it.padX, right: it.padX, top: 0, height: it.padY }} label={String(it.padY)} />
                      <Band style={{ left: it.padX, right: it.padX, bottom: 0, height: it.padY }} />
                      <Band style={{ left: it.padX + it.icon, top: it.padY, bottom: it.padY, width: it.gap }} />
                      <HeightTag label={`${it.height}`} />
                    </>
                  ),
                  refund: <HeightTag label={`${it.heightDesc} 설명이 있으면`} />,
                  delete: (
                    <>
                      <Band style={{ left: 0, top: 0, bottom: 0, width: m.highlight.insetX }} label={String(m.highlight.insetX)} />
                      <HeightTag label={`${it.height}`} />
                    </>
                  ),
                },
                dividers: {
                  1: (
                    <>
                      <Band style={{ left: 0, right: 0, bottom: '100%', height: d.marginY }} />
                      <Band style={{ left: 0, right: 0, top: '100%', height: d.marginY }} />
                      <Band style={{ right: '100%', top: -d.marginY, height: d.marginY * 2 + d.height, width: d.marginX }} label={String(d.marginX)} />
                      <span aria-hidden className="pointer-events-none absolute flex items-center whitespace-nowrap text-[11px] font-bold leading-4" style={{ left: `calc(100% + ${d.marginX + 12}px)`, top: -8, color: MARK_LINE }}>
                        {`${d.marginY} + 선 ${d.height} + ${d.marginY}`}
                      </span>
                    </>
                  ),
                },
              }}
            />
          </Board>
        </div>
        </div>
        <Note>
          메뉴 폭 {c.width} · 위아래 {c.padY} · 모서리 {c.radius} — 줄 위아래 {it.padY} · 좌우 {it.padX}, 아이콘 {it.icon}(분홍) · 사이 {it.gap}, 이름 {px(it.label.fontSize)} / {px(it.label.lineHeight)}, 설명 {px(it.desc.fontSize)} / {px(it.desc.lineHeight)}(사이 {it.descGap}) → 한 줄 {it.height} · 설명이 있으면 {it.heightDesc}
          <br />
          묶음 사이 {d.marginY} + 선 {d.height} + {d.marginY} · 선 좌우 {d.marginX} 들임 — 알약 좌우 {m.highlight.insetX} 들임 · 모서리 {m.highlight.radius}(삭제 줄 — 마우스가 올라간 모습) · 묶음 이름 {px(m.groupLabel.text.fontSize)} / {px(m.groupLabel.text.lineHeight)} · 위아래 {m.groupLabel.padY} → {m.groupLabel.height}
        </Note>
      </div>
    </Panel>
  );
};

// ── Tone ──────────────────────────────────────────────────
// Desk 공유 캘린더 ⋮ — 나가기는 이름 · 아이콘만 빨강, 설명은 그대로
const Tone: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-wrap justify-center gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-2">
          <Board mode={mode} pad={28}>
            <Menu groups={SHARED_CAL_MENU} mode={mode} />
          </Board>
          <Cap>{modeName(mode)}</Cap>
        </div>
      ))}
    </div>
  </Panel>
);

// ── State ─────────────────────────────────────────────────
// 마우스(알약)와 키보드(링)가 서로 다른 줄에 함께 · 누름(알약 + 축소) · 막힌 줄 — 라이트 · 다크
function Cursor() {
  return (
    <span aria-hidden className="pointer-events-none absolute" style={{ right: 34, top: '50%', marginTop: -4, zIndex: 5 }}>
      <MousePointer2 size={18} fill="#1A1F2E" color="#FFFFFF" strokeWidth={1.5} />
    </span>
  );
}
function KeyCap({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex h-5 min-w-5 items-center justify-center rounded px-1 text-[11px] font-bold leading-none" style={{ left: -40, top: '50%', marginTop: -10, zIndex: 5, background: '#FFFFFF', color: '#1A1F2E', boxShadow: '0 0 0 1px #C9CED8, 0 1px 0 1px #C9CED8' }}>
      {children}
    </span>
  );
}
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-6">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex flex-wrap items-start justify-center gap-4">
          <div className="flex w-[300px] max-w-full flex-col items-center gap-2">
            <Board mode={mode} style={{ padding: '24px 40px 24px 56px' }}>
              <Menu groups={MEMO_MENU} mode={mode} states={{ edit: 'hovered', delete: 'focused' }} decor={{ items: { edit: <Cursor />, delete: <KeyCap>↓</KeyCap> } }} />
            </Board>
            <Cap strong={`${modeName(mode)} — 마우스 · 키보드`}>마우스는 수정 위(알약) · 키보드 위치는 삭제(링) — 둘이 따로 보인다</Cap>
          </div>
          <div className="flex w-[300px] max-w-full flex-col items-center gap-2">
            <Board mode={mode} brand="hr" style={{ padding: '24px 40px 24px 56px' }}>
              <Menu brand="hr" groups={PERSON_MENU(false)} mode={mode} states={{ edit: 'pressed' }} />
            </Board>
            <Cap strong={`${modeName(mode)} — 누름 · 막힘`}>수정을 누르는 동안 알약 + 내용 축소 · 휴가 내역 내보내기는 막힌 줄(전용 색)</Cap>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

// ── Guidelines ────────────────────────────────────────────
// 메뉴는 실행만 — 테마는 설정의 Segmented Control
function ThemeSettings({ mode = 'auto' }: { mode?: Mode }) {
  const seg = segmentedLook('desk');
  return (
    <WebWindow mode={mode} w={400} h={250}>
      <div style={{ height: '100%', boxSizing: 'border-box', padding: '22px 28px', background: rc('bg-layer-basement', mode) }}>
        <div style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, color: rc('fg-neutral', mode), paddingBottom: 14 }}>설정</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, boxSizing: 'border-box', borderRadius: cardFace().radius, borderWidth: cardFace().borderW, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', mode), paddingTop: cardFace().pad, paddingRight: cardFace().pad, paddingBottom: cardFace().pad, paddingLeft: cardFace().pad, background: rc('bg-layer-default', mode) }}>
          <span style={{ fontSize: 15, lineHeight: '20px', fontWeight: 500, color: rc('fg-neutral', mode) }}>화면 모드</span>
          <SegmentedView look={seg} mode={mode} items={THEMES} value="dark" live={false} ariaLabel="화면 모드" />
        </div>
      </div>
    </WebWindow>
  );
}
function ThemeMenuWindow({ mode = 'auto' }: { mode?: Mode }) {
  const m = mk().menu;
  const groups: MenuGroup[] = [{ items: THEME_MENU[0].items.map((i) => (i.value === 'dark' ? { ...i, suffixIcon: 'check' } : i)) }];
  return (
    <WebWindow mode={mode} w={400} h={250}>
      <div style={{ height: '100%', boxSizing: 'border-box', padding: '16px 20px', background: rc('bg-layer-basement', mode) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700, color: rc('fg-neutral', mode) }}>홈</span>
          <Anchored offset={m.content.offset} trigger={<IconButton icon="moon" label="화면 모드" mode={mode} />} menu={<Menu groups={groups} mode={mode} />} />
        </div>
      </div>
    </WebWindow>
  );
}
const RoleGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="테마처럼 값을 고르는 일은 설정 화면의 Segmented Control — 지금 값이 늘 보이고, 고르면 바로 반영된다" bg={BASEMENT}>
        <Scaled w={400} h={250} s={0.64}>
          <ThemeSettings />
        </Scaled>
      </Verdict>
      <Verdict ok={false} note="메뉴에 체크를 달아 값을 고르게 한다 — 메뉴는 누르면 실행하고 닫히는 동작 목록이다(고른 표시가 없다)" bg={BASEMENT}>
        <Scaled w={400} h={250} s={0.64}>
          <ThemeMenuWindow />
        </Scaled>
      </Verdict>
    </Pair>
  </Panel>
);

// 줄의 동작 — ⋮ 하나 + 메뉴 · 늘 보이는 아이콘 묶음
const RowGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="줄 끝 ⋮ 하나(이름 “{줄 이름} 더보기”) — 누르면 메뉴, 줄을 누르면 상세 · 수정" bg={BASEMENT}>
        <Scaled w={400} h={430} s={0.64}>
          <MemoWindow open={1} h={430} />
        </Scaled>
      </Verdict>
      <Verdict ok={false} note="수정 · 삭제 아이콘을 줄마다 늘 — 버튼이 줄마다 늘고, 아이콘만으로는 뜻을 다 전하지 못한다" bg={BASEMENT}>
        <Scaled w={400} h={430} s={0.64}>
          <MemoWindow trailing="icons" h={430} />
        </Scaled>
      </Verdict>
    </Pair>
  </Panel>
);

// 묶음과 순서 — 자주 쓰는 것 위 · 위험한 것 맨 아래 묶음
const GroupGuide: Fig = ({ caption }) => {
  const mixed: MenuGroup[] = [{ items: [PIN, { ...EDIT, icon: undefined }, DUPLICATE] }, { items: [{ ...DELETE, icon: undefined }] }];
  return (
    <Panel caption={caption}>
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Verdict ok note="가장 많이 쓰는 동작을 위에, 위험한 동작은 맨 아래 묶음에 따로" bg={BASEMENT}>
          <Menu groups={MEMO_MENU} />
        </Verdict>
        <Verdict ok={false} note="위험한 동작이 맨 위 — 습관처럼 누르는 첫 자리에 삭제가 온다" bg={BASEMENT}>
          <Menu groups={[{ items: [DELETE, PIN, EDIT, DUPLICATE] }]} />
        </Verdict>
        <Verdict ok={false} note="일부 줄에만 아이콘 — 모든 줄에 두거나 모두 뺀다" bg={BASEMENT}>
          <Menu groups={mixed} />
        </Verdict>
        <Verdict ok={false} note="줄마다 선 — 선은 묶음 사이에만 긋고, 줄 사이에는 없다" bg={BASEMENT}>
          <Menu groups={[PIN, EDIT, DUPLICATE, DELETE].map((i) => ({ items: [i] }))} />
        </Verdict>
      </div>
    </Panel>
  );
};

// 1280 에서 — 같은 목록이 Menu ↔ Menu Sheet
const ResponsiveGuide: Fig = ({ caption }) => {
  const k = mk();
  return (
    <Panel caption={caption}>
      <div className="flex flex-wrap items-start justify-center gap-6">
        <Shot strong={`${k.menu.breakpoint} 이상 — Menu`} cap={`마우스용 · 줄 ${k.menu.item.height} · 폭 ${k.menu.content.width}`}>
          <DesktopMemoMenu />
        </Shot>
        <Shot strong={`${k.menu.breakpoint} 미만 — Menu Sheet`} cap={`손가락용 · 줄 ${k.sheet.item.minHeight} · 같은 줄 · 같은 순서`}>
          <PhoneMemoSheet />
        </Shot>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기(실제로 열고 닫는다) ────────────────────────
const ExRow: Fig = () => <MemoMenuDemo kit={mk()} ov={overlayKit()} kebab={iconBtn()} />;
const ExDescription: Fig = () => <PeopleMenuDemo kit={mk('hr')} ov={overlayKit('hr')} kebab={iconBtn('hr')} />;

export const menuFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  tone: Tone,
  states: States,
  'role-guide': RoleGuide,
  'row-guide': RowGuide,
  'group-guide': GroupGuide,
  'responsive-guide': ResponsiveGuide,
  'ex-row': ExRow,
  'ex-description': ExDescription,
};
