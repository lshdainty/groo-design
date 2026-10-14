// Scroll Area 페이지의 그림 — specs/components/scroll-area.md 의 `[그림: …](../../site/components/specs/scroll-area.tsx#<id>)` 자리.
// 스크롤바(6px 알약 · 막대 stroke-neutral-solid · 바탕 투명)는 scroll-area.yaml 을 tokens-style 이 .psa 규칙으로 깐 것이고, 상자의 이름 · 초점 ·
// 넘침 막기는 scrollAreaLook(collapse-scroll)이다. 대화상자는 dialog.yaml, 시트는 bottom-sheet.yaml, 칩 줄은 chip.yaml(Scroll Fog row)로 그린다.
// 그림 안 스크롤바는 브라우저가 그린다 — 맥 · 폰의 겹침 스크롤바 설정이면 넘칠 때만 잠깐 보인다(OS 설정대로).
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK_LINE } from '../foundations/ui';
import { contrast } from '@/lib/design-tokens';
import { CATEGORIES, HOUR_H, LONG_DETAIL, VACATION_POLICY } from './collapse-data';
import { screenTones, scrollAreaLook } from './collapse-look';
import { DayTimeline, FocusRegionDemo, ScrollAreaPlay, ScrollBox } from './collapse-scroll';
import { BenefitList, Legend } from './collapse-screens';
import { chipLook } from './chip-look';
import { ChipGroupView, ChipView } from './chip-view';
import { overlayLook } from './overlay-look';
import { DimView, SheetSurface } from './overlay-view';
import { PHONE_SAFE, Phone, Verdict, rc, type Mode } from './kit';
import { Cap, CodePreview, pinAt } from './nav-screens';
import { ocv } from './overlay-shared';

type Fig = (p: { caption?: string }) => ReactNode;
const MODES = ['light', 'dark'] as const;
const modeKo = (m: 'light' | 'dark') => (m === 'dark' ? '다크' : '라이트');
const L = () => scrollAreaLook('desk');
const tones = () => screenTones('desk');
const SURF = ['default', 'basement', 'floating'] as const;
const SURF_KO = { default: '흰 면', basement: '바닥', floating: '떠 있는 표면' };
// 막대 대비 — 놓인 면마다(라이트 · 다크)
function contrasts() {
  const l = L();
  return Object.fromEntries(SURF.map((s) => [s, { light: contrast(l.bar.thumb.light, l.surfaces[s].light), dark: contrast(l.bar.thumb.dark, l.surfaces[s].dark) }])) as Record<(typeof SURF)[number], { light: number; dark: number }>;
}
const Wide = ({ children }: { children: ReactNode }) => <div className="max-w-full overflow-x-auto">{children}</div>;

// 대화상자(dialog.yaml medium) — 본문이 스크롤 상자(contain)
function ScrollDialog({ mode = 'auto', h = 380, title = '카드 상세', children }: { mode?: Mode; h?: number; title?: string; children: ReactNode }) {
  const d = overlayLook('desk').dialog;
  return (
    <div style={{ width: d.sizes.medium, borderRadius: d.radius, background: ocv(d.bg, mode), overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ paddingTop: d.header.padTop, paddingLeft: d.header.padX, paddingRight: d.header.padX, paddingBottom: d.header.padBottom, fontFamily: d.title.fontFamily, fontSize: d.title.fontSize, lineHeight: d.title.lineHeight, fontWeight: d.title.fontWeight, color: ocv(d.title.color, mode) }}>{title}</div>
      <ScrollBox look={L()} mode={mode} contain height={h} style={{ paddingLeft: d.body.padX, paddingRight: d.body.padX, paddingBottom: d.body.padBottom }}>
        {children}
      </ScrollBox>
    </div>
  );
}
// HR 달력 일 보기 — 이름 있는 스크롤 상자(초점 · 이름 · 안쪽 링)
function DayBox({ mode = 'auto', h = 340, focused = false, w = 360 }: { mode?: Mode; h?: number; focused?: boolean; w?: number }) {
  return (
    <div style={{ width: w, borderRadius: 16, background: rc('bg-layer-default', mode, 'hr'), border: `1px solid ${rc('stroke-neutral-weak', mode, 'hr')}`, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: '14px 16px 10px', fontSize: 16, fontWeight: 700, color: rc('fg-neutral', mode, 'hr') }}>10월 9일 (금)</div>
      <ScrollBox look={scrollAreaLook('hr')} mode={mode} label="10월 9일 일정" height={h} initialScroll={HOUR_H * 8} focused={focused}>
        <DayTimeline tones={screenTones('hr')} mode={mode} />
      </ScrollBox>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-6">
      {MODES.map((mode) => (
        <div key={mode} className="flex flex-col items-center gap-4 rounded-2xl p-4" style={{ background: rc('bg-layer-basement', mode) }}>
          <ScrollDialog mode={mode} h={340}>
            <BenefitList mode={mode} open={['pay', 'coffee']} />
          </ScrollDialog>
          <DayBox mode={mode} focused />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <ScrollAreaPlay look={L()} tones={tones()} contrast={contrasts()} />;

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = L();
  const k = 6;
  const thumbH = 30;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-start justify-center gap-10">
          <div style={{ position: 'relative', paddingTop: 8 }}>
            <ScrollBox look={l} height={220} style={{ width: 300, borderRadius: 12, background: 'var(--p-bg-layer-default)', outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 }}>
              <p style={{ margin: 0, padding: 16, fontSize: 14, lineHeight: '22px', color: 'var(--p-fg-neutral-muted)', whiteSpace: 'pre-line' }}>{LONG_DETAIL}</p>
            </ScrollBox>
            {pinAt('ⓐ', { left: -10, top: -2 })}
            {pinAt('ⓑ', { right: -26, top: 40 })}
          </div>
          {/* 스크롤바를 {k}배로 — 바탕(투명) 위 알약 막대 */}
          <div style={{ position: 'relative', width: l.bar.width * k, height: 220, borderRadius: 4, outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 }}>
            <span style={{ position: 'absolute', left: 0, top: 24, width: l.bar.width * k, height: thumbH * k * 0.6, borderRadius: 9999, background: 'var(--p-stroke-neutral-solid)' }} />
            {pinAt('ⓒ', { left: l.bar.width * k + 8, top: 40 })}
            {pinAt('ⓓ', { left: l.bar.width * k + 8, top: 170 })}
            <span aria-hidden className="pointer-events-none absolute text-[10px] font-semibold leading-4 text-white" style={{ left: 0, top: -22, background: MARK_LINE, borderRadius: 4, padding: '0 4px', whiteSpace: 'nowrap' }}>
              {l.bar.width}px({k}배)
            </span>
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Box — overflow auto(넘치는 방향만) · 문서 전체도 같다'],
            ['ⓑ', `Scrollbar — 세로 ${l.bar.width} · 가로 ${l.bar.height} · 전역 한 벌`],
            ['ⓒ', `Thumb — 알약 · stroke-neutral-solid`],
            ['ⓓ', `Track — ${l.bar.track}`],
          ]}
        />
        <Cap w={620}>
          Firefox 는 ::-webkit-scrollbar 를 모르므로 scrollbar-width: {l.firefox.width} + scrollbar-color(막대 · {l.firefox.track}) — 이 두 줄은 @supports not selector(::-webkit-scrollbar) 안에만 둔다. 크로미움은 두 속성이 걸리면 webkit 규칙을 버린다
        </Cap>
      </div>
    </Panel>
  );
};

// ── 스크롤바 — 놓인 면마다 대비 ─────────────────────────────
const Scrollbar: Fig = ({ caption }) => {
  const l = L();
  const c = contrasts();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col gap-6">
        {MODES.map((mode) => (
          <div key={mode} className="flex flex-col items-center gap-2">
            <Wide>
              <div className="flex gap-3">
                {SURF.map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <ScrollBox look={l} mode={mode} height={180} style={{ width: 190, borderRadius: 12, background: ocv(l.surfaces[s], mode) }}>
                      <p style={{ margin: 0, padding: 14, fontSize: 13, lineHeight: '20px', color: rc('fg-neutral-muted', mode), whiteSpace: 'pre-line' }}>{LONG_DETAIL}</p>
                    </ScrollBox>
                    <span className="text-[11px] leading-4 pk-muted">
                      {SURF_KO[s]} {c[s][mode].toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Wide>
            <Cap strong={modeKo(mode)}>막대 stroke-neutral-solid — 세 면 모두 3 이상(WCAG 1.4.11). 막대는 올리거나 끌어도 모양이 바뀌지 않는다</Cap>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ── 놓인 자리 ─────────────────────────────────────────────
const Context: Fig = ({ caption }) => {
  const s = overlayLook('desk').sheet;
  const chip = chipLook();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-start justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Phone title="휴가" mode="auto" scale={0.62} h={640} screenW={360} brand="hr"
              overlay={
                <DimView dim={s.dim} place="end">
                  <SheetSurface look={s} title="휴가 신청" safe={PHONE_SAFE} maxHeight={`${s.maxHeight * 100}%`}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--p-fg-neutral)' }}>휴가 정책</div>
                    <ScrollBox look={scrollAreaLook('hr')} label="휴가 정책" contain height={200} style={{ borderRadius: 12, background: 'var(--p-bg-layer-basement)' }}>
                      <p style={{ margin: 0, padding: 14, fontSize: 13, lineHeight: '20px', color: 'var(--p-fg-neutral-muted)', whiteSpace: 'pre-line' }}>{VACATION_POLICY}</p>
                    </ScrollBox>
                  </SheetSurface>
                </DimView>
              }
            >
              <div />
            </Phone>
            <Cap strong="시트 안 상자 — overlay">{`overscroll-behavior: ${L().overscroll} — 상자 끝에 닿아도 시트 · 뒤 화면이 따라 스크롤되지 않는다`}</Cap>
          </div>
          <div className="flex w-[300px] flex-col items-center gap-2">
            <div style={{ width: 300, background: 'var(--p-bg-layer-default)', borderRadius: 12, paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24 }}>
              <ChipGroupView look={chip} layout="scroll" ariaLabel="카테고리">
                {CATEGORIES.slice(0, 7).map((c, i) => (
                  <ChipView key={c.id} look={chip} state="enabled" selected={i === 0} label={c.name} />
                ))}
              </ChipGroupView>
            </div>
            <Cap strong="가로 줄 — row">스크롤바를 숨긴다 — 끝은 Scroll Fog row 흐림이 알린다. 세로 스크롤바는 숨기지 않는다</Cap>
          </div>
        </div>
      </div>
    </Panel>
  );
};

// ── 초점 가는 것이 없는 상자 ────────────────────────────────
const Focus: Fig = ({ caption }) => {
  const l = scrollAreaLook('hr');
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-4">
        <FocusRegionDemo look={l} tones={screenTones('hr')} />
        <Cap w={620}>
          {`글 · 표 · 일정 칸뿐인 상자는 상자 자신이 초점을 받는다 — tabindex ${l.focus.tabIndex} + role="${l.focus.role}" + 이름(역할 없는 div 에는 aria-label 을 쓸 수 없다). 링은 상자 안쪽 ${l.focus.ring.width}px(띄움 ${l.focus.ring.offset}) — 안에 단추 · 링크가 있으면 달지 않는다`}
        </Cap>
      </div>
    </Panel>
  );
};

// ── 겹쳐 뜨는 막대를 쓰지 않는다 ────────────────────────────
const OverlayGuide: Fig = ({ caption }) => {
  const box: CSSProperties = { width: 300, borderRadius: 12, background: 'var(--p-bg-layer-default)' };
  const text = <p style={{ margin: 0, padding: 16, fontSize: 14, lineHeight: '22px', color: 'var(--p-fg-neutral-muted)', whiteSpace: 'pre-line' }}>{LONG_DETAIL}</p>;
  return (
    <Panel caption={caption}>
      <div className="flex w-full flex-col gap-4">
        <Verdict ok note="기본 스크롤 + 전역 한 벌 — 넘치면 6px 알약 막대가 늘 보여 더 있다는 것을 안다">
          <ScrollBox look={L()} height={200} style={box}>
            {text}
          </ScrollBox>
        </Verdict>
        <Verdict ok={false} note="내용 위에 겹쳐 뜨는 막대(Radix ScrollArea) — 마우스를 올리기 전에는 막대가 없고, 옅은 색(#EEEEEE 1.11)이면 늘 보이게 해도 안 보인다">
          <div style={{ ...box, position: 'relative', height: 200, overflow: 'hidden' }}>
            {text}
            {/* 올리기 전 — 막대 없음(겹쳐 뜨는 막대는 내용 위, 투명) */}
            <span aria-hidden style={{ position: 'absolute', right: 2, top: 8, width: 7, height: 60, borderRadius: 9999, background: '#EEEEEE', opacity: 0.9 }} />
          </div>
        </Verdict>
      </div>
    </Panel>
  );
};

// ── 코드 미리보기 — scroll-area.md 의 코드 그대로 ─────────────
const ExCalendar: Fig = ({ caption }) => (
  <CodePreview caption={caption} w={360} pad={24} bg="bg-layer-basement" brand="hr">
    <ScrollBox look={scrollAreaLook('hr')} label="10월 9일 일정" height={380} initialScroll={HOUR_H * 8} style={{ borderRadius: 12 }}>
      <DayTimeline tones={screenTones('hr')} />
    </ScrollBox>
  </CodePreview>
);
const ExDialog: Fig = ({ caption }) => {
  const d = overlayLook('hr').dialog;
  return (
    <CodePreview caption={caption} w={d.sizes.medium} pad={24} bg="bg-layer-basement" brand="hr">
      <div style={{ borderRadius: d.radius, background: 'var(--p-bg-layer-floating)', paddingTop: d.header.padTop, paddingBottom: d.body.padBottom, paddingLeft: d.body.padX, paddingRight: d.body.padX }}>
        <div style={{ fontFamily: d.title.fontFamily, fontSize: d.title.fontSize, lineHeight: d.title.lineHeight, fontWeight: d.title.fontWeight, color: 'var(--p-fg-neutral)', marginBottom: d.header.padBottom }}>휴가 신청</div>
        <ScrollBox look={scrollAreaLook('hr')} label="휴가 정책" contain maxHeight={300} style={{ borderRadius: 12, background: 'var(--p-bg-layer-basement)' }}>
          <p style={{ margin: 0, padding: 14, fontSize: 14, lineHeight: '22px', color: 'var(--p-fg-neutral-muted)', whiteSpace: 'pre-line' }}>{VACATION_POLICY}</p>
        </ScrollBox>
      </div>
    </CodePreview>
  );
};

export const scrollAreaFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  scrollbar: Scrollbar,
  context: Context,
  focus: Focus,
  'overlay-guide': OverlayGuide,
  'ex-calendar': ExCalendar,
  'ex-dialog': ExDialog,
};
