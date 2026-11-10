// Resizable 페이지의 그림 — specs/components/resizable.md 의 `[그림: …](../../site/components/specs/resizable.tsx#<id>)` 자리.
// 선 · 손잡이 표시 · 누르는 폭 · 범위는 resizable.yaml 을 푼 값(splitLook — collapse-split)으로, 부서 나무는 tree-view.yaml 로 그린다.
// 1280 화면의 본문 992 를 실제 px 로 짜고 줄여 그린다. 대시보드 위젯 크기는 걷었다(2026-11-10 사용자 결정 11A).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel } from '../foundations/ui';
import { BODY_W } from './collapse-data';
import { screenTones, splitLook } from './collapse-look';
import { FitScale, HandleView, SplitView } from './collapse-split';
import type { SplitState } from './collapse-shared';
import { Verdict, rc, type Mode } from './kit';
import { Band, Cap, CodePreview, pinAt } from './nav-screens';
import { Legend } from './collapse-screens';
import { ExSplitDemo, SplitPlayground } from './split-play';
import { CompanyScreen, DeptPanelStatic, OrgChart } from './tree-view';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const S = () => splitLook();
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;
// 줄인 그림 — 폭 w 를 칸 폭 cw 에 맞춘다(FitScale 은 칸 폭을 잰다)
const Fit = ({ cw, w = BODY_W, children }: { cw: number; w?: number; children: ReactNode }) => (
  <div style={{ width: cw, maxWidth: '100%', flexShrink: 0 }}>
    <FitScale w={w}>{children}</FitScale>
  </div>
);
const frame = (mode: Mode): CSSProperties => ({ borderRadius: 16, overflow: 'hidden', border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, background: rc('bg-layer-default', mode, 'hr') });
// 회사 화면의 나눈 자리(멈춘 그림) — 목록 value% | 손잡이 | 조직도
function CompanySplit({ mode = 'auto', value, state, h = 360, showHit }: { mode?: Mode; value: number; state?: SplitState; h?: number; showHit?: boolean }) {
  return (
    <div style={frame(mode)}>
      <SplitView look={S()} mode={mode} value={value} state={state} height={h} showHit={showHit} left={<DeptPanelStatic mode={mode} w="100%" h={h} style={{ border: 0, borderRadius: 0 }} />} right={<OrgChart mode={mode} />} />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-3">
          <CompanyScreen mode={mode} cropW={600} H={420} focusHandle />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <SplitPlayground look={S()} tones={screenTones('hr')} left={<DeptPanelStatic w="100%" h={380} style={{ border: 0, borderRadius: 0 }} />} right={<OrgChart />} />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const s = S();
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
        </div>
        <Legend
          items={[
            ['ⓐ', `Panel — 목록 ${s.panel.def}%(${s.panel.min} ~ ${s.panel.max}%)`],
            ['ⓑ', `Line — ${s.line.width}px stroke-neutral-weak · 올리거나 초점 · 끄는 동안 stroke-neutral-solid`],
            ['ⓒ', `Grip — ${s.grip.w} × ${s.grip.h} · 모서리 ${s.grip.radius}`],
            ['ⓓ', `Handle — 누르는 폭 ${s.handle.width}(분홍) · 이름 "${s.handle.name}"`],
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

export const resizableFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  split: Split,
  handle: Handle,
  'alt-guide': AltGuide,
  'persist-guide': PersistGuide,
  'ex-split': ExSplit,
};
