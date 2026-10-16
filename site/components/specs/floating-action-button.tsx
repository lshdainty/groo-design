// Floating Action Button 페이지의 그림 — specs/components/floating-action-button.md 의 `[그림: …](../../site/components/specs/floating-action-button.tsx#<id>)` 자리.
// 버튼은 floating-action-button.yaml 을 푼 값(navKit().fab — nav-view 의 FabView)으로, 상단 바는 top-navigation.yaml, 스낵바는 snackbar.yaml,
// 바닥 버튼 · 데스크톱 주 버튼은 button.yaml 로 그린다. 화면 속 목록은 역할 색으로 간단히 그린 대역이다(지어낸 내용).
import type { ReactNode } from 'react';
import { Figure, Panel as Plate } from '../foundations/ui';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { snackbarLook } from './feedback-look';
import { SnackbarView } from './feedback-view';
import { Card, Verdict, rc, type Mode } from './kit';
import { DUTCH_ROWS, TODO_ROWS } from './nav-data';
import { FabPlayground } from './nav-playground';
import { Band, Bar, Cap, CodePreview, Desktop, Fab, HomeIndicator, Legend, NK, NPhone, PHONE, ScreenTitle, Shell, Side, modeKo, pinAt, type Fig } from './nav-screens';

const F = (brand: 'desk' | 'hr' = 'desk') => NK(brand).fab;
const MODES = ['light', 'dark'] as const;
const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[820px] md:flex-row'}`}>{children}</div>;
// 할 일 줄 — 네모 체크 + 이름
function TodoRows({ mode = 'auto', n = 9, from = 0 }: { mode?: Mode; n?: number; from?: number }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
      {Array.from({ length: n }, (_, i) => TODO_ROWS[(from + i) % TODO_ROWS.length]).map((t, i) => (
        <div key={i} className="flex items-center gap-3 text-[15px]" style={{ minHeight: 52, color: rc('fg-neutral', mode) }}>
          <span aria-hidden className="block shrink-0 rounded-md" style={{ width: 22, height: 22, boxShadow: `inset 0 0 0 1.5px ${rc('stroke-neutral-solid', mode)}` }} />
          {t}
        </div>
      ))}
    </div>
  );
}
function DutchRows({ mode = 'auto' }: { mode?: Mode }) {
  return (
    <div className="flex flex-col" style={{ paddingLeft: 24, paddingRight: 24 }}>
      {DUTCH_ROWS.map(([t, s, a], i) => (
        <div key={t} className="flex items-center gap-3" style={{ minHeight: 64 }}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[15px] font-bold" style={{ background: rc(`chart-${['blue', 'orange', 'green', 'violet', 'brown'][i]}-weak`, mode), color: rc(`chart-${['blue', 'orange', 'green', 'violet', 'brown'][i]}-contrast`, mode) }}>
            {t.slice(0, 1)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-medium" style={{ color: rc('fg-neutral', mode) }}>{t}</span>
            <span className="truncate text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>{s}</span>
          </span>
          <span className="text-[15px] font-bold tabular-nums" style={{ color: rc('fg-neutral', mode) }}>{a}</span>
        </div>
      ))}
    </div>
  );
}
// 할 일 폰 — 오른쪽 아래 떠 있는 버튼(안전 영역 safe)
function TodoPhone({ mode = 'auto', scale = 0.5, h = 600, safe = 0, extra, fab = true, brand = 'desk' }: { mode?: Mode; scale?: number; h?: number; safe?: number; extra?: ReactNode; fab?: boolean; brand?: 'desk' | 'hr' }) {
  return (
    <NPhone
      mode={mode}
      brand={brand}
      scale={scale}
      h={h}
      home={safe > 0}
      bar={<Bar brand={brand} mode={mode} title="할 일" actions={[{ icon: 'search', label: '검색' }]} />}
      overlay={
        <>
          {fab && <Fab brand={brand} mode={mode} place="absolute" label="할 일 추가" bottom={F(brand).bottom + safe} />}
          {extra}
        </>
      }
    >
      <TodoRows mode={mode} />
    </NPhone>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {MODES.map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <TodoPhone mode={mode} safe={34} />
          <NPhone mode={mode} scale={0.5} h={600} home bar={<Bar mode={mode} title="더치페이" />} overlay={<Fab mode={mode} place="absolute" label="더치페이 만들기" bottom={F().bottom + 34} />}>
            <DutchRows mode={mode} />
          </NPhone>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => (
  <FabPlayground
    looks={{ desk: F('desk'), hr: F('hr') }}
    tops={{ desk: NK('desk').top, hr: NK('hr').top }}
    tones={{ desk: NK('desk').tone, hr: NK('hr').tone }}
    snack={snackbarLook()}
    bottomBtn={{ desk: buttonLook({ variant: 'neutralSolid', size: 'large' }, 'desk'), hr: buttonLook({ variant: 'neutralSolid', size: 'large' }, 'hr') }}
  />
);

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const f = F();
  const safe = 34;
  const W = 320;
  const H = 280;
  const fabY = H - f.bottom - safe - f.size;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative overflow-visible" style={{ width: W, height: H, marginRight: 40, marginTop: 24 }}>
          <div className="relative h-full w-full overflow-hidden" style={{ background: rc('bg-layer-default'), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle')}`, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
            <div style={{ paddingTop: 8 }}>
              <TodoRows n={4} />
            </div>
            <Fab place="absolute" label="할 일 추가" bottom={f.bottom + safe} zone={{ root: { outline: '1px dashed #DB2777', outlineOffset: 3 }, icon: { outline: '1px dashed #DB2777', outlineOffset: 0, background: 'rgba(236, 72, 153, 0.3)' } }} />
            <HomeIndicator />
            <Band style={{ right: 0, top: fabY + f.size / 2 - 3, width: f.right, height: 6 }} label={`${f.right}`} tag="above" />
            <Band style={{ right: f.right + f.size / 2 - 3, bottom: safe, width: 6, height: f.bottom }} label={`${f.bottom}`} vertical tag="left" />
            <Band style={{ left: 40, bottom: 0, width: 6, height: safe }} label={`안전 영역 ${safe}`} tag="right" />
          </div>
          {pinAt('ⓐ', { right: -32, top: fabY + f.size / 2 - 10 })}
          {pinAt('ⓑ', { right: f.right + f.size / 2 - 10, top: fabY - 30 })}
        </div>
        <Legend
          items={[
            ['ⓐ', `Container — 원 ${f.size} · 브랜드 채움 · 그림자 s3`],
            ['ⓑ', `Icon — 흰 선 아이콘 ${f.icon.size}`],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
const Shape: Fig = ({ caption }) => {
  const cell = (mode: Mode, brand: 'desk' | 'hr', label: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center rounded-xl" style={{ width: 120, height: 120, background: rc('bg-layer-basement', mode, brand) }}>
        <span style={{ transform: 'scale(1.5)' }}>
          <Fab brand={brand} mode={mode} label="할 일 추가" />
        </span>
      </div>
      <Cap>{label}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-4">
        {cell('light', 'desk', 'Desk')}
        {cell('light', 'hr', 'HR')}
        {cell('dark', 'desk', `Desk ${modeKo('dark')}`)}
        {cell('dark', 'hr', `HR ${modeKo('dark')}`)}
      </div>
    </Figure>
  );
};

const Placement: Fig = ({ caption }) => {
  const f = F();
  const btn = buttonLook({ variant: 'neutralSolid', size: 'large' });
  const barH = 12 + btn.faces.light.enabled.height + 12;
  const corner = (safe: number, bottomBar: boolean, label: string) => (
    <div className="flex w-[180px] flex-col items-center gap-2">
      <div className="relative overflow-hidden" style={{ width: 180, height: 260, background: rc('bg-layer-default'), boxShadow: `0 0 0 1px ${rc('stroke-neutral-subtle')}`, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <div style={{ paddingTop: 8 }}>
          <TodoRows n={4} />
        </div>
        {bottomBar && (
          <div className="absolute inset-x-0 bottom-0" style={{ paddingTop: 12, paddingBottom: 12 + safe, paddingLeft: 16, paddingRight: 16, background: rc('bg-layer-default'), boxShadow: `inset 0 1px 0 ${rc('stroke-neutral-subtle')}` }}>
            <ButtonView look={btn} label="완료한 일 지우기" state="enabled" fill />
          </div>
        )}
        <Fab place="absolute" label="할 일 추가" bottom={f.bottom + safe + (bottomBar ? barH : 0)} />
        {safe > 0 && <HomeIndicator />}
        <Band style={{ right: 0, bottom: f.bottom + safe + (bottomBar ? barH : 0) + f.size / 2 - 3, width: f.right, height: 6 }} label={`${f.right}`} tag="above" />
        <Band style={{ right: f.right + f.size / 2 - 3, bottom: safe + (bottomBar ? barH : 0), width: 6, height: f.bottom }} label={`${f.bottom}`} vertical tag="left" />
      </div>
      <Cap>{label}</Cap>
    </div>
  );
  return (
    <Figure caption={caption}>
      <div className="flex items-start gap-4">
        {corner(0, false, `안전 영역 없음 — 오른쪽 ${f.right} · 아래 ${f.bottom}`)}
        {corner(34, false, `홈 표시줄 — 아래 ${f.bottom} + 안전 영역 34`)}
        {corner(34, true, `바닥 버튼 — 그 위 끝에서 ${f.bottom}`)}
      </div>
    </Figure>
  );
};

// ── Guidelines ────────────────────────────────────────────
const SingleGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="화면에 하나 — 가장 많이 하는 일(할 일 추가)만, 오른쪽 아래">
        <TodoPhone scale={0.42} />
      </Verdict>
      <Verdict ok={false} note="둘을 띄운 화면 — 덜 중요한 동작(정렬)은 상단 바 · 화면 안 버튼으로">
        <TodoPhone scale={0.42} extra={<Fab place="absolute" icon="filter" label="정렬" bottom={F().bottom + F().size + 16} />} />
      </Verdict>
    </Pair>
  </Plate>
);

const WhereGuide: Fig = ({ caption }) => (
  <Plate caption={caption}>
    <Pair>
      <Verdict ok note="폰 · 탭 바가 없는 화면(할 일) — 떠 있는 버튼">
        <TodoPhone scale={0.42} safe={34} />
      </Verdict>
      <Verdict ok note="데스크톱 할 일 — 머리의 주 버튼(내역 추가 자리), 떠 있는 버튼을 두지 않는다">
        <Desktop w={1024} h={720} s={0.28}>
          <Shell side={<Side current="todo" collapsed />} header={<Bar type="desktop" actions={[{ icon: 'bell', label: '알림' }, { icon: 'settings', label: '설정' }]} primary={{ label: '할 일 추가', icon: 'plus' }} />}>
            <ScreenTitle>할 일</ScreenTitle>
            <div style={{ paddingTop: 16, paddingLeft: NK().margin, paddingRight: NK().margin }}>
              <Card body="list">
                <TodoRows n={8} />
              </Card>
            </div>
          </Shell>
        </Desktop>
      </Verdict>
    </Pair>
  </Plate>
);

const StackGuide: Fig = ({ caption }) => {
  const f = F();
  const sl = snackbarLook();
  const pad = f.size + f.bottom * 2;
  return (
    <Plate caption={caption}>
      <Pair>
        <Verdict ok note={`스낵바는 버튼 위 ${sl.region.padBottom} — 버튼을 SnackbarAvoidOverlap 으로 감싼다`}>
          <TodoPhone
            scale={0.46}
            extra={
              <div className="absolute flex justify-center" style={{ left: sl.region.padX, right: sl.region.padX, bottom: f.bottom + f.size + sl.region.padBottom, zIndex: 120 }}>
                <SnackbarView look={sl} state="enabled" message="할 일을 지웠어요." action={{ label: '되돌리기' }} />
              </div>
            }
          />
        </Verdict>
        <Verdict ok note={`목록 아래 여백 ${f.size} + ${f.bottom} + ${f.bottom} — 마지막 줄이 버튼에 가리지 않는다`}>
          <NPhone scale={0.46} h={600} bar={<Bar title="할 일" actions={[{ icon: 'search', label: '검색' }]} />} overlay={<Fab place="absolute" label="할 일 추가" />}>
            <div className="flex h-full flex-col justify-end">
              <TodoRows n={9} from={3} />
              <div className="relative" style={{ height: pad }}>
                <span aria-hidden className="absolute" style={{ left: 24, top: 0, bottom: 0, width: 8, background: 'rgba(236, 72, 153, 0.22)' }}>
                  <span className="absolute left-[12px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: '#DB2777' }}>
                    {pad}
                  </span>
                </span>
              </div>
            </div>
          </NPhone>
        </Verdict>
      </Pair>
    </Plate>
  );
};

// ── 코드 예시(미리보기) — floating-action-button.md 의 코드 그대로 ──────
const ExTodo: Fig = ({ caption }) => {
  const f = F();
  const sl = snackbarLook();
  return (
    <CodePreview caption={caption} pad={16} padX={0} w={PHONE} bg="bg-layer-basement">
      <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ width: PHONE, height: 360, background: rc('bg-layer-default') }}>
        <div style={{ paddingTop: 8 }}>
          <TodoRows n={5} />
        </div>
        <div className="absolute flex justify-center" style={{ left: sl.region.padX, right: sl.region.padX, bottom: f.bottom + f.size + sl.region.padBottom, zIndex: 120 }}>
          <SnackbarView look={sl} state="enabled" message="할 일을 추가했어요." />
        </div>
        <Fab place="absolute" label="할 일 추가" live />
      </div>
    </CodePreview>
  );
};

export const floatingActionButtonFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  shape: Shape,
  placement: Placement,
  'single-guide': SingleGuide,
  'where-guide': WhereGuide,
  'stack-guide': StackGuide,
  'ex-todo': ExTodo,
};

