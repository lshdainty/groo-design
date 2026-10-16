// Progress 페이지의 그림 — specs/components/progress.md 의 `[그림: …](../../site/components/specs/progress.tsx#<id>)` 자리.
// 막대(미터)의 높이 · 모서리 · 색 · 글자 · 사이 · 채움 전환은 progress.yaml 을 푼 값(loadingKit().progress)으로 그린다.
// 진행(올리기)의 원은 progress-circle.yaml 이다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { Verdict, rc, type Mode } from './kit';
import { comma } from './loading-look';
import type { PgPart } from './loading-view';
import { ProgressPlayground } from './loading-playground';
import { CardBox, Circle, L, LdPhone, Meter, SCREEN, cardStack, type Fig } from './loading-screens';
import { Legend, Note, Pin, Scaled, Shot } from './overlay-screens';

const pg = (brand: 'desk' | 'hr' = 'desk') => L(brand).progress;
const px = (v: string) => parseFloat(v);
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[760px] flex-col gap-4 md:flex-row">{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const won = (n: number) => `${comma(n)}원`;

// 10월 예산 · 목표 — 식비 예산 · 넘친 교통 예산 · 여행 자금 · 달성한 카드 실적(코드 예제와 같은 값)
const BARS: { label: string; value: number; max: number; meaning: 'limit' | 'goal' }[] = [
  { label: '식비 예산', value: 350000, max: 400000, meaning: 'limit' },
  { label: '교통 예산', value: 120000, max: 100000, meaning: 'limit' },
  { label: '여행 자금', value: 1200000, max: 2000000, meaning: 'goal' },
  { label: '현대카드 M 전월 실적', value: 390000, max: 300000, meaning: 'goal' },
];
function Budget({ mode = 'auto', brand = 'desk' }: { mode?: Mode; brand?: 'desk' | 'hr' }) {
  return (
    <div style={cardStack()}>
      <CardBox mode={mode}>
        <div className="flex flex-col" style={{ gap: 24 }}>
          {BARS.map((b) => (
            <Meter key={b.label} brand={brand} mode={mode} {...b} />
          ))}
        </div>
      </CardBox>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <LdPhone key={mode} mode={mode} title="10월 예산 · 목표" scale={0.62} h={560}>
          <Budget mode={mode} />
        </LdPhone>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => <ProgressPlayground kits={{ desk: L('desk'), hr: L('hr') }} screens={{ desk: SCREEN('desk'), hr: SCREEN('hr') }} />;

// ── Anatomy ───────────────────────────────────────────────
const line: CSSProperties = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 2 };
// 막대 묶음의 높이 — 이름 줄 + 사이 + 막대 + 사이 + 금액 줄
const anatomyH = () => {
  const p = pg();
  return px(p.label.lineHeight) + p.gap + p.track.height + p.gap + px(p.amount.lineHeight);
};
const Anatomy: Fig = ({ caption }) => {
  const pins: Partial<Record<PgPart, ReactNode>> = { label: <Pin n="ⓐ" />, status: <Pin n="ⓑ" />, track: <Pin n="ⓒ" />, fill: <Pin n="ⓓ" />, amount: <Pin n="ⓔ" /> };
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-2xl pk-surface" style={{ padding: '36px 40px 28px' }}>
          {/* 1.5배로 그렸다 */}
          <Scaled w={300} h={anatomyH()} s={1.5}>
            <Meter label="식비 예산" value={350000} max={400000} width={300} zone={{ label: line, status: line, amount: line, track: line }} pins={pins} />
          </Scaled>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Label — 무엇이 얼마나 찼나'],
            ['ⓑ', 'Status — 비율 · "N원 초과" · "달성"'],
            ['ⓒ', 'Track — 막대 바탕'],
            ['ⓓ', 'Fill — 값만큼, 넘쳐도 끝까지'],
            ['ⓔ', 'Amount — 현재 / 목표'],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 이름 · 오른쪽 글 · 막대 · 금액 줄 — 사이 gap, 막대 높이(분홍 자). 1.5배로 그렸다
const LAYOUT_ZOOM = 1.5;
function Ruler({ top, h, label, side }: { top: number; h: number; label: string; side: 'left' | 'right' }) {
  return (
    <span aria-hidden className="pointer-events-none absolute flex items-center" style={{ top, height: h, [side]: -18, flexDirection: side === 'left' ? 'row-reverse' : 'row', zIndex: 4 }}>
      <span style={{ width: 10, height: h, background: MARK, boxShadow: `inset 0 0 0 1px ${MARK_LINE}` }} />
      <span className="whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE, margin: '0 4px' }}>
        {label}
      </span>
    </span>
  );
}
const Layout: Fig = ({ caption }) => {
  const p = pg();
  const labelLh = px(p.label.lineHeight);
  const amountLh = px(p.amount.lineHeight);
  const W = 300;
  const z = LAYOUT_ZOOM;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-2xl pk-surface" style={{ padding: '32px 64px' }}>
          <div className="relative">
            <Scaled w={W} h={anatomyH()} s={z}>
              <Meter label="식비 예산" value={350000} max={400000} width={W} />
            </Scaled>
            <Ruler top={labelLh * z} h={p.gap * z} label={String(p.gap)} side="left" />
            <Ruler top={(labelLh + p.gap) * z} h={p.track.height * z} label={String(p.track.height)} side="right" />
            <Ruler top={(labelLh + p.gap + p.track.height) * z} h={p.gap * z} label={String(p.gap)} side="left" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12px] leading-4 pk-muted">
          <span>
            이름 {px(p.label.fontSize)} / {labelLh} · {p.label.fontWeight}
          </span>
          <span>
            오른쪽 글 {px(p.status.fontSize)} / {px(p.status.lineHeight)} · 숫자 폭 같게 · 이름과 적어도 {p.headerGap}
          </span>
          <span>막대 {p.track.height} · 모서리 full</span>
          <span>
            금액 줄 {px(p.amount.fontSize)} / {amountLh}
          </span>
        </div>
        <Note>요약 머리든 목록 줄이든 같은 막대다 — 크게 보일 것은 막대가 아니라 위의 금액이다. 트랙이 페이지 바탕과 같은 색이라 흰 면(카드 · 시트) 위에 둔다(그림은 1.5배)</Note>
      </div>
    </Figure>
  );
};

// 한도 · 목표 — 쓸수록 차는 막대(넘치면 위험 색 + "N원 초과") · 모을수록 차는 막대(닿으면 "달성")
const Meanings: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {(
        [
          ['limit — 한도(기본)', '예산 · 카드 한도 — 쓸수록 찬다', BARS[0], BARS[1]],
          ['goal — 목표', '저축 목표 · 카드 실적 — 모을수록 찬다', BARS[2], BARS[3]],
        ] as const
      ).map(([t, cap, a, b]) => (
        <Shot key={t} strong={t} cap={cap}>
          <div className="flex w-[276px] flex-col gap-6 rounded-2xl px-6 py-5 pk-surface">
            <Meter {...a} />
            <Meter {...b} />
          </div>
        </Shot>
      ))}
    </div>
  </Figure>
);

// 보통 · 넘침 · 달성 — 라이트 · 다크
const STATE_ROWS = [
  ['enabled', BARS[0], '0 ~ 100% — 채움 브랜드, 오른쪽 글 비율'],
  ['over', BARS[1], '한도를 넘음 — 끝까지 위험 색, "N원 초과"'],
  ['reached', BARS[3], '목표에 닿음 — 끝까지, 글 "달성" 만'],
] as const;
const States: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-5">
      {STATE_ROWS.map(([st, b, cap]) => (
        <div key={st} className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-4">
            {(['light', 'dark'] as const).map((mode) => (
              <div key={mode} className="w-[280px] rounded-2xl px-6 py-5" style={{ background: rc('bg-layer-default', mode) }}>
                <Meter mode={mode} {...b} />
              </div>
            ))}
          </div>
          <span className="text-center text-[12px] leading-4 pk-muted">
            <code className="pk-text">{st}</code> — {cap} · 라이트 · 다크
          </span>
        </div>
      ))}
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
// 막대는 미터 — 진행(올리기)은 원
const LoadingGuide: Fig = ({ caption }) => {
  const p = pg();
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="얼마나 찼나는 막대, 올리는 진행은 값 있는 원 — 둘을 섞지 않는다" bg={BASEMENT}>
          <div className="flex w-[300px] flex-col gap-5 rounded-2xl px-6 py-5 pk-surface">
            <Meter {...BARS[0]} />
            <div className="flex items-center gap-3">
              <span className="flex-1 text-[15px] font-medium pk-text">10월 카드 명세서.pdf</span>
              <Circle size="24" value={60} label="10월 카드 명세서 올리는 중" />
            </div>
          </div>
        </Verdict>
        <Verdict ok={false} note="올리기 · 불러오기를 막대로 — 막대는 범위가 정해진 값이 얼마나 찼는지만 보인다. 값을 모른 채 흐르는 막대도 두지 않는다" bg={BASEMENT}>
          <div className="flex w-[300px] flex-col gap-2 rounded-2xl px-6 py-5 pk-surface">
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] font-medium pk-text">10월 카드 명세서.pdf</span>
              <span className="text-[13px] tabular-nums pk-muted">60%</span>
            </div>
            <span className="block" style={{ height: p.track.height, borderRadius: p.track.radius, background: rc('bg-neutral-weak') }}>
              <span className="block h-full" style={{ width: '60%', borderRadius: p.fill.radius, background: rc('fg-brand') }} />
            </span>
            <span className="text-[12px] pk-muted">올리는 중…</span>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 넘친 한도 — 끝까지 + 위험 색 + "N원 초과" · 넘친 만큼 이은 막대
const OverGuide: Fig = ({ caption }) => {
  const p = pg();
  const b = BARS[1];
  const extra = ((b.value - b.max) / b.max) * 100;
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`끝까지 칠하고 위험 색 — 얼마나 넘었는지는 오른쪽 글이 말한다("${won(b.value - b.max)} 초과")`} bg={BASEMENT}>
          <div className="w-[300px] rounded-2xl px-6 py-5 pk-surface">
            <Meter {...b} />
          </div>
        </Verdict>
        <Verdict ok={false} note="막대를 100% 너머로 늘이거나 넘친 만큼 다른 색 조각을 잇는다 — 막대의 끝이 무엇인지 흐려진다" bg={BASEMENT}>
          <div className="w-[300px] rounded-2xl px-6 py-5 pk-surface">
            <div className="flex flex-col" style={{ gap: p.gap, width: `${100 / (1 + extra / 100)}%` }}>
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] font-medium pk-text">{b.label}</span>
                <span className="text-[13px] tabular-nums pk-muted">{Math.round((b.value / b.max) * 100)}%</span>
              </div>
              <span className="relative block" style={{ height: p.track.height, borderRadius: p.track.radius, background: rc('bg-neutral-weak') }}>
                <span className="absolute left-0 top-0 block h-full" style={{ width: '100%', borderRadius: `${p.fill.radius}px 0 0 ${p.fill.radius}px`, background: rc('fg-brand') }} />
                <span className="absolute top-0 block h-full" style={{ left: '100%', width: `${extra}%`, borderRadius: `0 ${p.fill.radius}px ${p.fill.radius}px 0`, background: rc('fg-critical') }} />
              </span>
              <span className="text-[12px] tabular-nums pk-muted">
                {won(b.value)} / {won(b.max)}
              </span>
            </div>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 달성 — 글자만 · 초록으로 바꾼 막대
const GoalGuide: Fig = ({ caption }) => {
  const b = BARS[3];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`닿으면 오른쪽 글을 "달성" 으로 — 막대 색은 브랜드 그대로, 넘어도(${Math.round((b.value / b.max) * 100)}%) 끝까지만 차고 금액 줄이 실제 값을 보인다`} bg={BASEMENT}>
          <div className="w-[300px] rounded-2xl px-6 py-5 pk-surface">
            <Meter {...b} />
          </div>
        </Verdict>
        <Verdict ok={false} note="성공 색 · 축하 모양을 더한다 — 막대의 색은 브랜드 · 위험 둘뿐이다" bg={BASEMENT}>
          <div className="w-[300px] rounded-2xl px-6 py-5 pk-surface">
            <Meter {...b} fillStyle={{ background: rc('fg-positive') }} statusStyle={{ color: rc('fg-positive') }} statusText={`${Math.round((b.value / b.max) * 100)}% 달성!`} />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
const ExLimit: Fig = () => (
  <Figure>
    <div className="flex w-[340px] flex-col gap-6 rounded-2xl px-6 py-5 pk-surface">
      <Meter label="식비 예산" value={350000} max={400000} />
      <Meter label="교통 예산" value={120000} max={100000} />
    </div>
  </Figure>
);
const ExGoal: Fig = () => (
  <Figure>
    <div className="flex w-[340px] flex-col gap-6 rounded-2xl px-6 py-5 pk-surface">
      <Meter meaning="goal" label="여행 자금" value={1200000} max={2000000} />
      <Meter meaning="goal" label="현대카드 M 전월 실적" value={390000} max={300000} />
      <Meter meaning="goal" label="오늘 근무" value={6} max={8} unit="시간" />
    </div>
  </Figure>
);

export const progressFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  layout: Layout,
  meanings: Meanings,
  states: States,
  'loading-guide': LoadingGuide,
  'over-guide': OverGuide,
  'goal-guide': GoalGuide,
  'ex-limit': ExLimit,
  'ex-goal': ExGoal,
};

