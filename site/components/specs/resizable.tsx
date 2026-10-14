// Resizable 페이지의 그림 — specs/components/resizable.md 의 `[그림: …](../../site/components/specs/resizable.tsx#<id>)` 자리.
// 선 · 손잡이 표시 · 누르는 폭 · 범위 · 위젯 손잡이 · 자리표시는 resizable.yaml 을 푼 값(splitLook · widgetLook — collapse-split)으로,
// 부서 나무는 tree-view.yaml, ⋮ 는 Button ghost · iconOnly, 크기 메뉴는 menu.yaml 로 그린다. 1280 화면의 본문 992 를 실제 px 로 짜고 줄여 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { BODY_W, WIDGETS, type Widget } from './collapse-data';
import { screenTones, splitLook, widgetLook } from './collapse-look';
import { FitScale, HandleView, SplitView, WidgetBoard } from './collapse-split';
import type { SplitState } from './collapse-shared';
import { iconBtn, mk } from './menu-screens';
import { MenuPanel } from './menu-view';
import { ButtonView } from './button-view';
import { Verdict, rc, type Mode } from './kit';
import { Band, Cap, CodePreview, pinAt } from './nav-screens';
import { Legend } from './collapse-screens';
import { ExSplitDemo, ExWidgetDemo, SplitPlayground } from './split-play';
import { CompanyScreen, DeptPanelStatic, OrgChart } from './tree-view';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const S = () => splitLook();
const WL = () => widgetLook();
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;
// 줄인 그림 — 폭 w 를 칸 폭 cw 에 맞춘다(FitScale 은 칸 폭을 잰다)
const Fit = ({ cw, w = BODY_W, children }: { cw: number; w?: number; children: ReactNode }) => (
  <div style={{ width: cw, maxWidth: '100%', flexShrink: 0 }}>
    <FitScale w={w}>{children}</FitScale>
  </div>
);
const frame = (mode: Mode): CSSProperties => ({ borderRadius: 16, overflow: 'hidden', border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, background: rc('bg-layer-default', mode, 'hr') });
const sizeGroups = (cols: number) => [{ label: WL().sizeMenu.label, items: WL().sizeMenu.items.map((i) => ({ value: String(i.columns), label: i.label, description: cols === i.columns ? '지금 크기' : undefined })) }];
// 회사 화면의 나눈 자리(멈춘 그림) — 목록 value% | 손잡이 | 조직도
function CompanySplit({ mode = 'auto', value, state, h = 360, showHit }: { mode?: Mode; value: number; state?: SplitState; h?: number; showHit?: boolean }) {
  return (
    <div style={frame(mode)}>
      <SplitView look={S()} mode={mode} value={value} state={state} height={h} showHit={showHit} left={<DeptPanelStatic mode={mode} w="100%" h={h} style={{ border: 0, borderRadius: 0 }} />} right={<OrgChart mode={mode} />} />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => {
  const w = WL();
  const colW = (BODY_W - w.gap * (w.columns - 1)) / w.columns;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col gap-6">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-3">
            <CompanyScreen mode={mode} cropW={600} H={420} focusHandle />
            <Fit cw={600}>
              <div style={{ padding: 24, background: rc('bg-layer-basement', mode, 'hr') }}>
                <WidgetBoard look={w} tones={screenTones('hr')} mode={mode} widgets={WIDGETS.map((x) => (x.id === 'leave' ? { ...x, cols: 4 } : x))} width={BODY_W - 48} kebab={iconBtn('hr')} dragging={{ id: 'leave', cols: 6, ghostW: colW * 5.4 }} />
              </div>
            </Fit>
          </div>
        ))}
      </div>
    </Figure>
  );
};

const Playground: Fig = () => (
  <SplitPlayground look={S()} wlook={WL()} tones={screenTones('hr')} kit={mk('hr')} kebab={iconBtn('hr')} left={<DeptPanelStatic w="100%" h={380} style={{ border: 0, borderRadius: 0 }} />} right={<OrgChart />} />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const s = S();
  const w = WL();
  const k = 3;
  const H = 120;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-start justify-center gap-8 pt-5">
          {/* 나누기 — 손잡이 둘레를 3배로 */}
          <div style={{ position: 'relative', width: 80 * k, height: H * k, overflow: 'visible' }}>
            <div style={{ width: 80, height: H, transform: `scale(${k})`, transformOrigin: 'top left', display: 'flex', background: 'var(--p-bg-layer-default)', borderRadius: 4 }}>
              <div style={{ flex: 1, background: 'var(--p-bg-layer-default)' }} />
              <HandleView look={s} value={s.panel.def} showHit />
              <div style={{ flex: 1, background: 'var(--p-bg-layer-default)' }} />
            </div>
            {pinAt('ⓐ', { left: 4, top: 4 })}
            {pinAt('ⓑ', { left: 40 * k - 10 - 26, top: 18 })}
            {pinAt('ⓒ', { left: 40 * k + 14, top: (H / 2) * k - 10 })}
            {pinAt('ⓓ', { left: 40 * k - 10, top: H * k - 24 })}
            <Band style={{ left: 32 * k, width: s.handle.width * k, top: -14, height: 6 }} label={`${s.handle.width}`} tag="above" />
          </div>
          {/* 위젯 모서리 — 3배로 */}
          <div style={{ position: 'relative', width: 90 * k, height: 70 * k }}>
            <div style={{ width: 90, height: 70, transform: `scale(${k})`, transformOrigin: 'top left', position: 'relative', borderRadius: 16, border: '1px solid var(--p-stroke-neutral-weak)', background: 'var(--p-bg-layer-default)', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', right: 0, bottom: 0, width: w.handle.size, height: w.handle.size, background: 'rgba(236, 72, 153, 0.18)', outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 }}>
                <span style={{ position: 'absolute', right: w.mark.right, bottom: w.mark.bottom, width: w.mark.size, height: w.mark.size, boxSizing: 'border-box', borderRightWidth: w.mark.borderW, borderBottomWidth: w.mark.borderW, borderTopWidth: 0, borderLeftWidth: 0, borderStyle: 'solid', borderColor: 'var(--p-stroke-neutral-solid)' }} />
              </span>
            </div>
            {pinAt('ⓔ', { right: w.handle.size * k + 6, bottom: w.handle.size * k - 22 })}
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <Fit cw={420} w={520}>
            <div style={{ position: 'relative', padding: 16, background: 'var(--p-bg-layer-basement)' }}>
              <WidgetBoard look={w} tones={screenTones('hr')} widgets={[{ id: 'a', title: '내 휴가', cols: 4, rows: 2, body: '남은 연차 11.5일' }, { id: 'b', title: '팀 일정', cols: 8, rows: 2, body: '10월 12일 점검' }]} width={488} dragging={{ id: 'a', cols: 6, ghostW: 200 }} />
              {pinAt('ⓕ', { left: 8, top: 8 })}
            </div>
          </Fit>
          <div style={{ position: 'relative', paddingTop: 12 }}>
            <MenuPanel look={mk('hr').menu} groups={sizeGroups(6)} />
            {pinAt('ⓖ', { left: -10, top: 2 })}
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', `Panel — 목록 ${s.panel.def}%(${s.panel.min} ~ ${s.panel.max}%)`],
            ['ⓑ', `Line — ${s.line.width}px stroke-neutral-weak · 올리거나 초점 · 끄는 동안 stroke-neutral-solid`],
            ['ⓒ', `Grip — ${s.grip.w} × ${s.grip.h} · 모서리 ${s.grip.radius}`],
            ['ⓓ', `Handle — 누르는 폭 ${s.handle.width}(분홍) · 이름 "${s.handle.name}"`],
            ['ⓔ', `Widget Handle — 누르는 ${w.handle.size} × ${w.handle.size}(분홍) · 표식 ${w.mark.size} · 선 ${w.mark.borderW} · 끝에서 ${w.mark.right}`],
            ['ⓕ', `Placeholder — 옅은 브랜드 바탕 + ${w.placeholder.borderW}px ${w.placeholder.borderStyle} · 모서리 ${w.placeholder.radius}`],
            ['ⓖ', `Size Menu — ⋮ → "${w.sizeMenu.label}" · 지금 크기 줄에 설명`],
          ]}
        />
      </div>
    </Panel>
  );
};

// ── 패널 나누기 ───────────────────────────────────────────
const Split: Fig = ({ caption }) => {
  const s = S();
  const cols: [string, number][] = [
    [`기본 ${s.panel.def}%`, s.panel.def],
    [`최소 ${s.panel.min}%`, s.panel.min],
    [`최대 ${s.panel.max}% — 오른쪽 ${100 - s.panel.max}%`, s.panel.max],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {cols.map(([t, v]) => (
          <div key={t} className="flex w-full flex-col items-center gap-1.5">
            <Fit cw={560}>
              <CompanySplit value={v} h={300} />
            </Fit>
            <Cap strong={t}>{`목록 ${Math.round((BODY_W * v) / 100)}px · 1280 화면의 본문 ${BODY_W} 기준`}</Cap>
          </div>
        ))}
        <Cap w={620}>목록은 {s.panel.min} ~ {s.panel.max}% 사이에서만 바뀐다 — 오른쪽 상세가 {100 - s.panel.max}% 아래로 줄지 않아 조직도 · 사용자 칸이 0폭이 되지 않는다. {s.breakpoint} 미만은 나누지 않는다(목록 → 상세 · 탭)</Cap>
      </div>
    </Panel>
  );
};

// ── 손잡이 ────────────────────────────────────────────────
const Handle: Fig = ({ caption }) => {
  const s = S();
  const k = 3;
  const states: [SplitState, string][] = [
    ['enabled', '기본 — 선은 옅고 표시만'],
    ['hovered', '호버(웹) — 선이 짙어진다'],
    ['focused', `포커스(키보드) — 링 ${s.ring.width}px`],
    ['pressed', '끄는 중 — 화면 전체 col-resize'],
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Wide>
              <div className="flex gap-4 rounded-xl p-4" style={{ background: rc('bg-layer-basement', mode, 'hr') }}>
                {states.map(([st, t]) => (
                  <div key={st} className="flex flex-col items-center gap-2">
                    <div style={{ width: 40 * k, height: 70 * k }}>
                      <div style={{ width: 40, height: 70, transform: `scale(${k})`, transformOrigin: 'top left', display: 'flex', background: rc('bg-layer-default', mode, 'hr') }}>
                        <div style={{ flex: 1 }} />
                        <HandleView look={s} mode={mode} value={s.panel.def} state={st} showHit={st === 'enabled'} />
                        <div style={{ flex: 1 }} />
                      </div>
                    </div>
                    <span className="max-w-[120px] text-center text-[11px] leading-4" style={{ color: rc('fg-neutral-subtle', mode, 'hr') }}>
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </Wide>
            <Cap strong={modeKo(mode)}>{`${k}배로 그렸다 — 선 ${s.line.width}px · 표시 ${s.grip.w} × ${s.grip.h} · 누르는 폭 ${s.handle.width}(분홍)`}</Cap>
          </div>
        ))}
        <Cap w={620}>
          선 stroke-neutral-weak 는 경계만 긋고, 가운데 표시 stroke-neutral-solid 가 끌 수 있는 자리를 알린다. 끌지 않고 한 번 눌렀다 떼면({s.handle.dragStart}px 안) 기본 {s.panel.def} ↔ 넓게 {s.panel.toggle} — 768 이상 데스크톱의 마우스 경계라 누르는 폭이 {s.handle.width} 이다
        </Cap>
      </div>
    </Panel>
  );
};

// ── 위젯 크기 ─────────────────────────────────────────────
const WidgetFig: Fig = ({ caption }) => {
  const w = WL();
  const colW = (BODY_W - 48 - w.gap * (w.columns - 1)) / w.columns;
  const widgets: Widget[] = [
    { id: 'leave', title: '내 휴가', cols: 6, rows: 3, body: '남은 연차 11.5일 · 이번 달 사용 2일' },
    { id: 'team', title: '팀 일정', cols: 4, rows: 3, body: '10월 12일 (월) 클라우드 인프라 점검 외 3건' },
    { id: 'notice', title: '공지사항', cols: 12, rows: 2, body: '10월 연말정산 서류 제출 안내' },
  ];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        {MODES.map((mode) => (
          <div key={mode} className="flex w-full flex-col items-center gap-2">
            <Fit cw={620}>
              <div style={{ position: 'relative', padding: 24, background: rc('bg-layer-basement', mode, 'hr') }}>
                <WidgetBoard
                  look={w}
                  tones={screenTones('hr')}
                  mode={mode}
                  widgets={widgets}
                  width={BODY_W - 48}
                  dragging={{ id: 'team', cols: 6, ghostW: colW * 5.3 + w.gap * 4 }}
                  kebab={iconBtn('hr')}
                  menuOpen={{
                    id: 'leave',
                    node: (
                      <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <ButtonView look={iconBtn('hr')} mode={mode} icon="more-vertical" ariaLabel="내 휴가 더보기" state="pressed" />
                        <span style={{ position: 'absolute', right: 0, top: 44, zIndex: 9 }}>
                          <MenuPanel look={mk('hr').menu} mode={mode} groups={sizeGroups(6)} />
                        </span>
                      </span>
                    ),
                  }}
                />
              </div>
            </Fit>
            <Cap strong={modeKo(mode)}>{`팀 일정을 4칸에서 끄는 중 — 놓일 6칸에 자리표시, 위젯은 그림자 ${w.ghost.shadow.name} 로 따라온다 · 내 휴가 ⋮ → ${w.sizeMenu.label}`}</Cap>
          </div>
        ))}
        <Cap w={620}>
          격자 {w.columns}칸 · 한 줄 {w.rowHeight} · 사이 {w.gap} — 크기 · 위치는 편집 모드에서만 바꾸고 저장 단추로 서버에 저장한다. 모서리 손잡이는 누르는 {w.handle.size} · 표식 {w.mark.size}, 끌지 못하면 ⋮ 의 "{w.sizeMenu.label}"({w.sizeMenu.items.map((i) => i.label).join(' · ')})
        </Cap>
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
const AltGuide: Fig = ({ caption }) => {
  const s = S();
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note={`손잡이를 끌지 않고 한 번 누르면 기본 ${s.panel.def} → 넓게 ${s.panel.toggle}(다시 누르면 ${s.panel.def}) · 키보드 ← → ${s.handle.step}% · Home ${s.panel.min}% · End ${s.panel.max}% · Enter`}>
          <div className="flex flex-col items-center gap-2">
            <Fit cw={420}>
              <CompanySplit value={s.panel.def} h={260} state="hovered" />
            </Fit>
            <span className="text-[18px] pk-muted">↓ 한 번 누르기</span>
            <Fit cw={420}>
              <CompanySplit value={s.panel.toggle} h={260} />
            </Fit>
          </div>
        </Verdict>
        <Verdict ok note={`위젯은 ⋮ → "${WL().sizeMenu.label}" 에서 고른다 — 누르면 바로 그 폭, 높이는 그대로. 메뉴는 실행만이라 체크가 없고 지금 크기 줄에 설명을 단다`}>
          <MenuPanel look={mk('hr').menu} groups={sizeGroups(6)} />
        </Verdict>
      </div>
    </Panel>
  );
};

const PersistGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex w-full flex-col gap-4">
      <Verdict ok note="회사 화면을 35% 로 넓히고 나갔다가 다시 열면 그 폭 — 화면마다 브라우저에 기억한다(사이드바 접힘처럼)">
        <div className="flex flex-col items-center gap-2">
          <Fit cw={420}>
            <CompanySplit value={35} h={240} />
          </Fit>
          <span className="text-[13px] pk-muted">↻ 다시 열기</span>
          <Fit cw={420}>
            <CompanySplit value={35} h={240} />
          </Fit>
        </div>
      </Verdict>
      <Verdict ok={false} note={`기억하지 않기 — 다시 열 때마다 ${S().panel.def}% 로 돌아가 긴 부서 이름을 볼 때마다 다시 넓힌다(지금 HR)`}>
        <div className="flex flex-col items-center gap-2">
          <Fit cw={420}>
            <CompanySplit value={35} h={240} />
          </Fit>
          <span className="text-[13px] pk-muted">↻ 다시 열기</span>
          <Fit cw={420}>
            <CompanySplit value={S().panel.def} h={240} />
          </Fit>
        </div>
      </Verdict>
    </div>
  </Panel>
);

// ── 코드 미리보기(실제로 누를 수 있다) — resizable.md 의 코드 그대로 ──
const ExSplit: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={BODY_W} pad={24} padX={16} bg="bg-layer-basement" brand="hr">
    <ExSplitDemo look={S()} left={<DeptPanelStatic w="100%" h={360} style={{ border: 0, borderRadius: 0 }} />} right={<OrgChart />} />
  </CodePreview>
);
const ExWidget: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={420} pad={24} bg="bg-layer-basement" brand="hr">
    <ExWidgetDemo wlook={WL()} tones={screenTones('hr')} kit={mk('hr')} kebab={iconBtn('hr')} />
  </CodePreview>
);

export const resizableFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  split: Split,
  handle: Handle,
  widget: WidgetFig,
  'alt-guide': AltGuide,
  'persist-guide': PersistGuide,
  'ex-split': ExSplit,
  'ex-widget': ExWidget,
};
