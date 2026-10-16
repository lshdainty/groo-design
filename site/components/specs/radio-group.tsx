// Radio 페이지의 그림 — specs/components/radio-group.md 의 `[그림: …](../../site/components/specs/radio-group.tsx#<id>)` 자리.
// 동그라미 · 라벨은 radio-group.yaml 을 푼 값(radioLook)으로, 화면 예시는 kit 의 Desk 화면 조각으로 그린다.
// 오늘 제품에는 라벨만 있는 Radio 가 없다 — 선택지는 캘린더 일정의 반복 선택지를 빌렸다(radio-group.md Guidelines).
import type { CSSProperties, ReactNode } from 'react';
import { Calendar } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { axisDesc, axisValues, loadComponentSpec } from '@/lib/component-spec';
import { radioGroupGap, radioLook, radioParts, RADIO_CHECKED, RADIO_STATES, type RadioChecked, type RadioCombo, type RadioState } from './radio-group-look';
import { RadioView, RadioGroupView, RadioFieldView } from './radio-group-view';
import { RadioPlayground } from './radio-group-playground';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { Phone, Sheet, Verdict, rc, type Mode } from './kit';
import { selectBoxLook } from './select-box-look';
import { SelectBoxGroupView } from './select-box-view';
import { selectLook } from './select-look';
import { textFieldLook } from './text-field-look';
import { formatDay } from './date-shared';

type Fig = (p: { caption?: string }) => ReactNode;
const spec = () => loadComponentSpec('radio-group');
const SIZES = () => axisValues(spec(), 'size');
const GAP = radioGroupGap;
const REPEAT = ['반복 없음', '매일', '매주', '매월', '매년'];

// 한 Radio — 조합 · 선택 여부 · 상태 · 모드(고정 그림)
function R(p: RadioCombo & { checked?: RadioChecked; state?: RadioState | 'live'; label?: ReactNode; mode?: Mode; brand?: 'desk' | 'hr'; ariaLabel?: string; style?: CSSProperties }) {
  const { size, tone, weight, brand, checked, state, ...rest } = p;
  const look = radioLook({ size, tone, weight }, brand ?? 'desk');
  return <RadioView look={look} checked={checked ?? 'unchecked'} state={state ?? 'enabled'} {...rest} />;
}
// 한 묶음 — 실제로 눌러 볼 수 있다(state='enabled' 면 멈춘 그림)
function G(p: RadioCombo & { items?: string[]; initial?: number; disabled?: number[]; mode?: Mode; brand?: 'desk' | 'hr'; ariaLabel?: string; ariaLabelledby?: string; ariaDescribedby?: string; state?: 'live' | 'enabled' }) {
  const { size, tone, weight, brand, items = REPEAT, ...rest } = p;
  return <RadioGroupView look={radioLook({ size, tone, weight }, brand ?? 'desk')} items={items} gap={GAP()} {...rest} />;
}

function Cap({ children, strong }: { children: ReactNode; strong?: ReactNode }) {
  return (
    <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
      {strong && <b className="text-[13px] pk-text">{strong}</b>}
      {children}
    </span>
  );
}
function Surface({ mode = 'auto', children, className = '' }: { mode?: Mode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl px-6 py-6 ${className}`} style={{ background: rc('bg-layer-default', mode) }}>
      {children}
    </div>
  );
}
function Title({ children, mode = 'auto', id }: { children: ReactNode; mode?: Mode; id?: string }) {
  return (
    <span id={id} className="mb-1 block text-[13px] font-bold" style={{ color: rc('fg-neutral-muted', mode) }}>
      {children}
    </span>
  );
}
const KO: Record<RadioChecked, string> = { unchecked: '선택 안 됨', checked: '선택' };
const STATE_KO: Record<RadioState, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', disabled: '비활성' };

// ── Overview ──────────────────────────────────────────────
const HERO: [string, RadioCombo, RadioState][] = [
  ['neutral', { tone: 'neutral' }, 'enabled'],
  ['brand', { tone: 'brand' }, 'enabled'],
  ['비활성', {}, 'disabled'],
];
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3">
      {(['light', 'dark'] as Mode[]).map((mode) => (
        <Surface key={mode} mode={mode}>
          <div className="grid grid-cols-3 gap-4">
            {HERO.map(([name, combo, st]) => (
              <div key={name} className="flex flex-col items-center gap-3">
                <div className="flex gap-4">
                  {RADIO_CHECKED.map((ch) => (
                    <R key={ch} {...combo} checked={ch} mode={mode} state={st} ariaLabel={KO[ch]} />
                  ))}
                </div>
                <span className="text-[11px] font-medium" style={{ color: rc('fg-neutral-subtle', mode) }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Surface>
      ))}
    </div>
  </Panel>
);

const Playground: Fig = () => <RadioPlayground parts={{ desk: radioParts('desk'), hr: radioParts('hr') }} gap={GAP()} />;

// ── Anatomy ───────────────────────────────────────────────
function Pin({ n, children, below }: { n: string; children: ReactNode; below?: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center ${below ? '-bottom-11 flex-col-reverse' : '-top-11'}`}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
          {n}
        </span>
        <span className="h-5 w-px" style={{ background: MARK_LINE }} />
      </span>
      {children}
    </span>
  );
}
const Anatomy: Fig = ({ caption }) => {
  const look = radioLook({ size: 'large' });
  const f = look.faces.checked.light.enabled;
  const d = look.faces.checked.dark.enabled;
  const vars = { '--pr-bg-l': f.mark.bg, '--pr-bg-d': d.mark.bg, '--pr-dot-l': f.dot.color, '--pr-dot-d': d.dot.color, '--pr-lb-l': f.label.color, '--pr-lb-d': d.label.color, '--pr-ring-l': look.faces.checked.light.focused.ring.color, '--pr-ring-d': look.faces.checked.dark.focused.ring.color } as CSSProperties;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-16 pb-8 pt-16">
        <div className="prad" data-mode="auto" style={{ ...vars, transform: 'scale(1.6)', transformOrigin: 'center', margin: '18px 60px 64px' }}>
          <span className="relative inline-flex items-center" style={{ gap: f.row.gap }}>
            <Pin n="ⓐ" below>
              <span
                className="inline-grid place-items-center"
                style={{ width: f.mark.size, height: f.mark.size, borderRadius: 9999, background: 'var(--pr-bg)', outline: `${f.ring.width}px solid var(--pr-ring)`, outlineOffset: f.ring.offset }}
              >
                <Pin n="ⓑ">
                  <span style={{ display: 'block', width: f.dot.size, height: f.dot.size, borderRadius: 9999, background: 'var(--pr-dot)' }} />
                </Pin>
              </span>
            </Pin>
            <Pin n="ⓒ">
              <span style={{ fontSize: f.label.fontSize, lineHeight: f.label.lineHeight, fontWeight: f.label.fontWeight, color: 'var(--pr-lb)' }}>라벨</span>
            </Pin>
            <span className="absolute -left-10 top-1/2 flex -translate-y-1/2 flex-row-reverse items-center">
              <span className="h-px w-5" style={{ background: MARK_LINE }} />
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
                ⓓ
              </span>
            </span>
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Radiomark'],
            ['ⓑ', 'Dot'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Focus ring'],
          ].map(([n, t]) => (
            <span key={n}>
              <b className="pk-text">{n}</b> {t}
            </span>
          ))}
        </div>
      </div>
    </Figure>
  );
};

// ── Size ──────────────────────────────────────────────────
const Sizes: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-end gap-14 rounded-xl pk-surface px-12 py-8">
      {SIZES().map((s) => {
        const f = radioLook({ size: s }).faces.checked.light.enabled;
        return (
          <div key={s} className="flex flex-col items-center gap-4">
            <span className="relative flex items-center">
              <span className="absolute -left-3 top-0 w-1.5 border-y border-l" style={{ height: f.row.minHeight, borderColor: MARK_LINE }} />
              <span className="flex items-center" style={{ minHeight: f.row.minHeight, background: MARK }}>
                <R size={s} checked="checked" label="라벨" />
              </span>
            </span>
            <Cap strong={s}>
              동그라미 {f.mark.size} · 점 {f.dot.size} · 라벨 {f.label.fontSize} · 줄 {f.row.minHeight}
            </Cap>
          </div>
        );
      })}
    </div>
  </Figure>
);

const Weight: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-end gap-12 rounded-xl pk-surface px-12 py-8">
      {axisValues(spec(), 'weight').map((w) => (
        <div key={w} className="flex flex-col items-center gap-3">
          <R weight={w} checked="checked" label="매월" />
          <Cap strong={w}>{axisDesc(spec(), 'weight', w)}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

const Tones: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-12 rounded-xl pk-surface px-12 py-8">
      {(
        [
          ['neutral', 'neutral', 'desk', '기본 — 짙은 회색'],
          ['brand · Desk', 'brand', 'desk', '서비스 핵심 흐름에서만'],
          ['brand · HR', 'brand', 'hr', 'HR 은 초록'],
        ] as const
      ).map(([name, tone, brand, note]) => (
        <div key={name} className="flex flex-col items-center gap-3">
          <div className="flex flex-col" style={{ gap: GAP() }}>
            {['반복 없음', '매월', '매년'].map((t, i) => (
              <R key={t} tone={tone} brand={brand} checked={i === 1 ? 'checked' : 'unchecked'} label={t} />
            ))}
          </div>
          <Cap strong={name}>{note}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

// ── State ─────────────────────────────────────────────────
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3">
      {(
        [
          ['neutral', { tone: 'neutral' }],
          ['brand', { tone: 'brand' }],
        ] as [string, RadioCombo][]
      ).map(([name, combo]) => (
        <div key={name} className="overflow-x-auto rounded-xl pk-surface p-5">
          <div className="mb-3 text-[12px] font-bold pk-text">{name}</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[96px]" />
                {RADIO_STATES.map((s) => (
                  <th key={s} className="pb-2 text-center text-[12px] font-medium pk-muted">
                    {STATE_KO[s]}
                    <br />
                    <span className="font-mono text-[10px]">{s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RADIO_CHECKED.map((ch) => (
                <tr key={ch}>
                  <td className="py-2 pr-2 text-[12px] pk-text">{KO[ch]}</td>
                  {RADIO_STATES.map((s) => (
                    <td key={s} className="py-2 text-center">
                      <R {...combo} checked={ch} state={s} ariaLabel={`${KO[ch]} ${STATE_KO[s]}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </Panel>
);

const Live: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-wrap items-start gap-12 rounded-xl pk-surface px-12 py-8">
      <div className="flex flex-col">
        <Title id="live-a">반복 — neutral</Title>
        <G ariaLabelledby="live-a" initial={3} />
      </div>
      <div className="flex flex-col">
        <Title id="live-b">반복 — brand · 막힌 선택지</Title>
        <G ariaLabelledby="live-b" tone="brand" initial={0} disabled={[4]} />
      </div>
    </div>
  </Figure>
);

const Group: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="rounded-xl pk-surface px-12 py-8">
      <Title id="group-a">반복</Title>
      <G ariaLabelledby="group-a" initial={0} />
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
const TouchTarget: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-8">
      {SIZES().map((s) => (
        <div key={s} className="flex flex-col items-center gap-4 rounded-xl pk-surface px-10 py-8">
          <div className="flex flex-col" style={{ gap: GAP() }}>
            {REPEAT.slice(0, 3).map((t, i) => (
              <span key={t} className="relative inline-flex">
                <span className="absolute -inset-x-2 top-1/2 z-0 h-11 -translate-y-1/2 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}`, opacity: i % 2 ? 0.55 : 1 }} />
                <R size={s} label={t} checked={i === 0 ? 'checked' : 'unchecked'} style={{ position: 'relative', zIndex: 1 }} />
              </span>
            ))}
          </div>
          <Cap strong={s}>줄마다 높이 44 — 이웃 줄과 겹치지 않는다</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

// 좋은 예 · 나쁜 예 — 좁은 폭(폰)에서는 위아래로 쌓는다(나란히 두면 상자가 115 까지 줄어 글이 끊긴다)
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[620px] flex-col gap-4 sm:flex-row">{children}</div>;

const GroupGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="제목을 위에 두고 선택지를 세로로 — 처음 값(반복 없음)을 골라 둔다">
        <div className="flex w-[220px] flex-col">
          <Title id="gg-a">반복</Title>
          <G ariaLabelledby="gg-a" items={REPEAT.slice(0, 4)} initial={0} state="enabled" />
        </div>
      </Verdict>
      <Verdict ok={false} note="가로로 늘어놓기 — 줄이 바뀌면 어느 라벨이 어느 동그라미인지 흐려진다. 한 줄에서 고르려면 Segmented">
        <div className="flex w-[240px] flex-col">
          <Title>반복</Title>
          <div className="flex flex-wrap" style={{ columnGap: 16 }}>
            {REPEAT.map((t, i) => (
              <R key={t} label={t} checked={i === 0 ? 'checked' : 'unchecked'} />
            ))}
          </div>
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

function RepeatSheet({ tone, brandBtn }: { tone: string; brandBtn: boolean }) {
  return (
    <Phone
      title="일정"
      h={520}
      scale={0.66}
      overlay={
        <Sheet title="반복" footer={<ButtonView look={buttonLook({ variant: brandBtn ? 'brandSolid' : 'neutralSolid', size: 'large' })} label="저장" fill />}>
          <G tone={tone} initial={3} ariaLabel="반복" state="enabled" />
        </Sheet>
      }
    >
      <div className="p-5" />
    </Phone>
  );
}
const ToneGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="선택은 짙은 회색 — 화면의 주 액션(저장)이 먼저 읽힌다">
        <RepeatSheet tone="neutral" brandBtn={false} />
      </Verdict>
      <Verdict ok={false} note="선택마다 브랜드 색을 깔면 브랜드 색이 흩어진다">
        <RepeatSheet tone="brand" brandBtn />
      </Verdict>
    </Pair>
  </Panel>
);

// 반복 거래 "종료" — 설명 · 입력칸이 붙는 선택은 Select Box(select-box.yaml 의 값으로 그린다)
function Inp({ children, w = 64 }: { children: ReactNode; w?: number }) {
  return (
    <span className="inline-block rounded-lg px-2 py-1 text-center text-[13px] tabular-nums" style={{ minWidth: w, border: `1px solid ${rc('stroke-neutral-weak')}`, background: rc('bg-layer-default'), color: rc('fg-neutral') }}>
      {children}
    </span>
  );
}
// 종료일은 타이핑하지 않고 달력으로 고른다 — Input Button 모양(값 + 달력 아이콘)
function InpBtn({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 text-[13px] tabular-nums" style={{ border: `1px solid ${rc('stroke-neutral-weak')}`, background: rc('bg-layer-default'), color: rc('fg-neutral') }}>
      {children}
      <Calendar aria-hidden size={13} strokeWidth={2} style={{ color: rc('fg-neutral-muted') }} />
    </span>
  );
}
const END_DAY = { y: 2027, m: 3, d: 31 };
const END = [
  { t: '무기한', d: '중지할 때까지 계속 반복' },
  { t: '횟수 지정', input: <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: rc('fg-neutral') }}>총 <Inp>12</Inp> 회</span> },
  { t: '종료일 지정', input: <InpBtn>{formatDay(END_DAY)}</InpBtn> },
];
const SelectBoxGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="Select Box — 설명은 제목 아래, 입력칸은 고른 상자 아래로 펼쳐진다">
        <div className="flex w-[280px] flex-col">
          <Title id="rg-sb-end">종료</Title>
          <SelectBoxGroupView
            look={selectBoxLook('desk')}
            kind="radio"
            value="count"
            ariaLabelledby="rg-sb-end"
            boxes={[
              { value: 'none', title: '무기한', description: '중지할 때까지 계속 반복' },
              { value: 'count', title: '횟수 지정', description: '정한 횟수만큼 반복', footer: { before: '총', value: '12', after: '회', aria: '반복 횟수' } },
              { value: 'date', title: '종료일 지정', description: '정한 날까지 반복', footer: { button: formatDay(END_DAY), aria: '종료일', look: selectLook('desk') } },
            ]}
          />
        </div>
      </Verdict>
      <Verdict ok={false} note="Radio 줄 안에 설명 · 입력칸 — 입력칸이 라디오의 일부로 읽히고, 누르는 영역이 겹친다">
        <div className="flex w-[240px] flex-col">
          <Title>종료</Title>
          {END.map((o, i) => (
            <div key={o.t} className="flex flex-col py-1.5">
              <R label={o.t} checked={i === 1 ? 'checked' : 'unchecked'} />
              <div className="pl-7 text-[13px]" style={{ color: rc('fg-neutral-muted') }}>
                {o.d ?? o.input}
              </div>
            </div>
          ))}
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

function RepeatError({ bordered = false }: { bordered?: boolean }) {
  const red = rc('stroke-critical-solid');
  return (
    <div className="flex w-[220px] flex-col">
      <Title>반복</Title>
      <div className="flex flex-col" style={{ gap: GAP() }}>
        {REPEAT.slice(0, 4).map((t) => (
          <span key={t} className="relative inline-flex">
            <R label={t} />
            {bordered && <span aria-hidden className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full" style={{ boxShadow: `inset 0 0 0 1px ${red}` }} />}
          </span>
        ))}
      </div>
      <span className="mt-2 text-[12px]" style={{ color: rc('fg-critical') }}>
        반복을 골라 주세요.
      </span>
    </div>
  );
}
const ErrorFig: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="동그라미는 그대로, 묶음 아래 글로 무엇을 할지 알린다">
        <RepeatError />
      </Verdict>
      <Verdict ok={false} note="동그라미마다 빨간 테두리 — 모든 선택지가 틀린 것처럼 보인다">
        <RepeatError bordered />
      </Verdict>
    </Pair>
  </Panel>
);

// ── 코드 예시(미리보기) ───────────────────────────────────
function Preview({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="not-prose mt-6 mb-0">
      <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-10 rounded-t-xl border border-b-0 border-fd-border px-6 py-8" style={{ background: rc('bg-layer-default') }}>
        {children}
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExBasic: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G items={REPEAT.slice(0, 3)} initial={0} ariaLabel="반복" />
  </Preview>
);
const ExSizes: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <div className="flex flex-col" style={{ gap: GAP() }}>
      <R size="medium" label="medium" checked="checked" />
      <R size="large" label="large" />
      <R size="large" weight="bold" label="large · bold" />
    </div>
  </Preview>
);
const ExTones: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G items={['매월', '매년']} initial={0} ariaLabel="반복 — neutral" />
    <G items={['매월', '매년']} initial={0} tone="brand" ariaLabel="반복 — brand" />
  </Preview>
);
const ExControlled: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <G items={['반복 없음', '매월', '매년']} initial={1} disabled={[2]} ariaLabel="반복 — 선택지 하나가 막힘" />
    <G items={['반복 없음', '매월', '매년']} initial={1} disabled={[0, 1, 2]} ariaLabel="반복 — 묶음 전체가 막힘" />
  </Preview>
);
// Field 로 감싼 묶음 — 라벨이 묶음의 이름, 오류 글이 설명이 되고 묶음에 aria-invalid(radio-group.md "코드" 의 오류 예)
const ExError: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <RadioFieldView field={textFieldLook('desk').field} look={radioLook({})} gap={GAP()} label="반복" errorMessage="반복을 골라 주세요." items={['반복 없음', '매월']} width={280} />
  </Preview>
);

export const radioGroupFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  weight: Weight,
  tones: Tones,
  states: States,
  live: Live,
  group: Group,
  'touch-target': TouchTarget,
  'group-guide': GroupGuide,
  'tone-guide': ToneGuide,
  'selectbox-guide': SelectBoxGuide,
  error: ErrorFig,
  'ex-basic': ExBasic,
  'ex-sizes': ExSizes,
  'ex-tones': ExTones,
  'ex-controlled': ExControlled,
  'ex-error': ExError,
};
