// Checkbox 페이지의 그림 — specs/components/checkbox.md 의 `[그림: …](../../site/components/specs/checkbox.tsx#<id>)` 자리.
// 칸 · 라벨은 checkbox.yaml 을 푼 값(checkLook)으로, 화면 예시는 kit 의 Desk · HR 화면 조각으로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { axisDesc, axisValues, loadComponentSpec } from '@/lib/component-spec';
import { checkGroupGap, checkLook, checkParts, CHECK_STATES, CHECKED, type CheckCombo, type CheckState, type Checked } from './checkbox-look';
import { CheckboxView, CheckboxGroupDemo } from './checkbox-view';
import { CheckboxPlayground } from './checkbox-playground';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { switchLook } from './switch-look';
import { SwitchView } from './switch-view';
import { Card, Phone, Sheet, Verdict, cardStack, rc, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const spec = () => loadComponentSpec('checkbox');
const SIZES = () => axisValues(spec(), 'size');
const GROUP_GAP = checkGroupGap;

// 한 Checkbox — 조합 · 체크 여부 · 상태 · 모드
function C(p: CheckCombo & { checked?: Checked; state?: CheckState | 'live'; label?: ReactNode; mode?: Mode; brand?: 'desk' | 'hr'; ariaLabel?: string; style?: CSSProperties; boxStyle?: CSSProperties }) {
  const { size, shape, tone, weight, brand, checked, ...rest } = p;
  const look = checkLook({ size, shape, tone, weight }, brand ?? 'desk');
  return <CheckboxView look={look} defaultChecked={checked ?? 'unchecked'} {...rest} />;
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
const KO: Record<Checked, string> = { unchecked: '선택 안 됨', checked: '선택', indeterminate: '일부 선택' };
const STATE_KO: Record<CheckState, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', disabled: '비활성' };

// ── Overview ──────────────────────────────────────────────
const COMBOS: [string, CheckCombo][] = [
  ['Square · neutral', { shape: 'square', tone: 'neutral' }],
  ['Square · brand', { shape: 'square', tone: 'brand' }],
  ['Ghost · neutral', { shape: 'ghost', tone: 'neutral' }],
];
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3">
      {(['light', 'dark'] as Mode[]).map((mode) => (
        <Surface key={mode} mode={mode}>
          <div className="grid grid-cols-3 gap-4">
            {COMBOS.map(([name, combo]) => (
              <div key={name} className="flex flex-col items-center gap-3">
                <div className="flex gap-4">
                  {CHECKED.map((ch) => (
                    <C key={ch} {...combo} checked={ch} mode={mode} state="enabled" ariaLabel={KO[ch]} />
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

const Playground: Fig = () => <CheckboxPlayground parts={{ desk: checkParts('desk'), hr: checkParts('hr') }} />;

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
  const look = checkLook({ size: 'large' });
  const f = look.faces.checked.light.enabled;
  const d = look.faces.checked.dark.enabled;
  const vars = { '--pc-bg-l': f.box.bg, '--pc-bg-d': d.box.bg, '--pc-ic-l': f.icon.color, '--pc-ic-d': d.icon.color, '--pc-lb-l': f.label.color, '--pc-lb-d': d.label.color, '--pc-ring-l': look.faces.checked.light.focused.ring.color, '--pc-ring-d': look.faces.checked.dark.focused.ring.color } as CSSProperties;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-16 pb-8 pt-16">
        <div className="pchk" data-mode="auto" style={{ ...vars, transform: 'scale(1.6)', transformOrigin: 'center', margin: '18px 60px 64px' }}>
          <span className="relative inline-flex items-center" style={{ gap: f.row.gap }}>
            <Pin n="ⓐ" below>
              <span
                className="inline-grid place-items-center"
                style={{ width: f.box.size, height: f.box.size, borderRadius: f.box.radius, background: 'var(--pc-bg)', color: 'var(--pc-ic)', outline: `${f.ring.width}px solid var(--pc-ring)`, outlineOffset: f.ring.offset }}
              >
                <Pin n="ⓑ">
                  <svg width={f.icon.size} height={f.icon.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </Pin>
              </span>
            </Pin>
            <Pin n="ⓒ">
              <span style={{ fontSize: f.label.fontSize, lineHeight: f.label.lineHeight, fontWeight: f.label.fontWeight, color: 'var(--pc-lb)' }}>라벨</span>
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
            ['ⓐ', 'Checkmark'],
            ['ⓑ', 'Icon'],
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
        const f = checkLook({ size: s }).faces.checked.light.enabled;
        return (
          <div key={s} className="flex flex-col items-center gap-4">
            <span className="relative flex items-center">
              <span className="absolute -left-3 top-0 w-1.5 border-y border-l" style={{ height: f.row.minHeight, borderColor: MARK_LINE }} />
              <span className="flex items-center" style={{ minHeight: f.row.minHeight, background: MARK }}>
                <C size={s} checked="checked" state="enabled" label="라벨" />
              </span>
            </span>
            <Cap strong={s}>
              칸 {f.box.size} · 라벨 {f.label.fontSize} · 줄 {f.row.minHeight}
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
          <C weight={w} checked="checked" state="enabled" label="데이터 내보내기" />
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
          <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
            <C tone={tone} brand={brand} checked="checked" state="enabled" label="거래 내역" />
            <C tone={tone} brand={brand} checked="indeterminate" state="enabled" label="예산" />
            <C tone={tone} brand={brand} checked="unchecked" state="enabled" label="메모" />
          </div>
          <Cap strong={name}>{note}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

const Shapes: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-16 rounded-xl pk-surface px-12 py-8">
      {axisValues(spec(), 'shape').map((sh) => (
        <div key={sh} className="flex flex-col items-center gap-3">
          <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
            <C shape={sh} checked="checked" label="식비" />
            <C shape={sh} checked="unchecked" label="교통" />
            <C shape={sh} checked="checked" label="쇼핑" />
          </div>
          <Cap strong={sh}>{axisDesc(spec(), 'shape', sh)?.split(' — ')[0]}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

// ── State ─────────────────────────────────────────────────
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3">
      {COMBOS.map(([name, combo]) => (
        <div key={name} className="overflow-x-auto rounded-xl pk-surface p-5">
          <div className="mb-3 text-[12px] font-bold pk-text">{name}</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[96px]" />
                {CHECK_STATES.map((s) => (
                  <th key={s} className="pb-2 text-center text-[12px] font-medium pk-muted">
                    {STATE_KO[s]}
                    <br />
                    <span className="font-mono text-[10px]">{s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHECKED.map((ch) => (
                <tr key={ch}>
                  <td className="py-2 pr-2 text-[12px] pk-text">{KO[ch]}</td>
                  {CHECK_STATES.map((s) => (
                    <td key={s} className="py-2 text-center">
                      <C {...combo} checked={ch} state={s} ariaLabel={`${KO[ch]} ${STATE_KO[s]}`} />
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
      <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
        <C label="단종된 카드도 보기" />
        <C label="금액 고정" checked="checked" />
        <C label="이 카드 기억하기" state="disabled" />
      </div>
      <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
        <C tone="brand" label="brand 톤" checked="checked" />
        <C shape="ghost" label="ghost 모양" checked="checked" />
        <C shape="ghost" label="ghost 모양" />
      </div>
    </div>
  </Figure>
);

const Group: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="rounded-xl pk-surface px-12 py-8">
      <CheckboxGroupDemo parent={checkLook({ weight: 'bold' })} child={checkLook({})} parentLabel="전체" items={['거래 내역', '예산', '메모', '할 일']} initial={[0, 1]} gap={GROUP_GAP()} />
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
const TouchTarget: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-8">
      <div className="flex flex-col items-center gap-3 rounded-xl pk-surface px-8 py-7">
        <span className="relative inline-flex">
          <span className="absolute -inset-x-2 -inset-y-1.5 z-0 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
          <C label="단종된 카드도 보기" checked="checked" style={{ position: 'relative', zIndex: 1 }} />
        </span>
        <Cap strong="Checkbox">칸 + 라벨이 한 영역</Cap>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-[300px] overflow-hidden rounded-xl pk-surface">
          {[
            ['월급', '+3,200,000원', true],
            ['점심 식사', '−12,000원', false],
            ['버스', '−1,500원', true],
          ].map(([t, a, on], i) => (
            <div key={String(t)} className="relative flex items-center gap-3 px-5 py-3" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle')}` : undefined }}>
              {i === 0 && <span className="absolute inset-0 z-0" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />}
              <C checked={on ? 'checked' : 'unchecked'} ariaLabel={`${t} 선택`} style={{ position: 'relative', zIndex: 1 }} />
              <span className="relative z-[1] flex-1 text-[15px] pk-text">{t}</span>
              <span className="relative z-[1] text-[15px] font-bold tabular-nums pk-text">{a}</span>
            </div>
          ))}
        </div>
        <Cap strong="목록 행">칸만 쓰면 행 전체가 누르는 영역</Cap>
      </div>
    </div>
  </Figure>
);

function ExportGroup({ picked, bordered = false, message, mode = 'auto', tone = 'neutral', shape = 'square' }: { picked: number[]; bordered?: boolean; message?: string; mode?: Mode; tone?: string; shape?: string }) {
  const items = ['거래 내역', '예산', '메모', '할 일'];
  const all = picked.length === items.length;
  const parent: Checked = all ? 'checked' : picked.length ? 'indeterminate' : 'unchecked';
  const redBox = { border: `1px solid ${rc('stroke-critical-solid', mode)}` } as CSSProperties;
  return (
    <div className="flex flex-col">
      <span className="mb-1 text-[13px] font-bold" style={{ color: rc('fg-neutral-muted', mode) }}>
        내보낼 데이터
      </span>
      <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
        <C tone={tone} shape={shape} weight="bold" checked={parent} state="enabled" mode={mode} label="전체" boxStyle={bordered ? redBox : undefined} />
        {/* 줄 사이 · 묶음 안 선 — Divider(divider.yaml)와 같은 stroke-neutral-subtle */}
        <span className="h-px" style={{ background: rc('stroke-neutral-subtle', mode) }} />
        {items.map((it, i) => (
          <C key={it} tone={tone} shape={shape} checked={picked.includes(i) ? 'checked' : 'unchecked'} state="enabled" mode={mode} label={it} boxStyle={bordered ? redBox : undefined} />
        ))}
      </div>
      {message && (
        <span className="mt-2 text-[12px]" style={{ color: rc('fg-critical', mode) }}>
          {message}
        </span>
      )}
    </div>
  );
}
const GroupGuide: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex gap-3">
      {(
        [
          [[], '아무것도 안 고름', '부모는 선택 안 됨'],
          [[0, 1, 2, 3], '모두 고름', '부모도 선택'],
          [[0, 1], '일부만 고름', '부모는 일부 선택(가로줄)'],
        ] as [number[], string, string][]
      ).map(([picked, t, n]) => (
        <div key={t} className="flex w-[190px] flex-col items-center gap-3 rounded-xl pk-surface px-5 pb-4 pt-5">
          <ExportGroup picked={picked} />
          <Cap strong={t}>{n}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[620px] gap-4">{children}</div>;

const ShapeGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="필수가 아니고 셋 이하 — 가벼운 보기 옵션은 Ghost">
        <div className="flex w-[240px] flex-col">
          <span className="mb-1 text-[13px] font-bold" style={{ color: rc('fg-neutral-muted') }}>
            보기
          </span>
          <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
            <C shape="ghost" checked="checked" label="지난 달 거래 숨기기" />
            <C shape="ghost" label="금액 가리기" />
          </div>
        </div>
      </Verdict>
      <Verdict ok={false} note="하나 이상 꼭 골라야 하는 긴 목록에 Ghost — 고른 것과 안 고른 것이 잘 안 갈린다">
        <div className="flex w-[240px] flex-col">
          <span className="mb-1 text-[13px] font-bold" style={{ color: rc('fg-neutral-muted') }}>
            내보낼 데이터(하나 이상)
          </span>
          <div className="flex flex-col" style={{ gap: GROUP_GAP() }}>
            {['거래 내역', '예산', '메모', '할 일', '캘린더 일정', '자산'].map((t, i) => (
              <C key={t} shape="ghost" checked={i % 2 ? 'unchecked' : 'checked'} label={t} />
            ))}
          </div>
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

function ExportSheet({ tone, brandBtn }: { tone: string; brandBtn: boolean }) {
  return (
    <Phone
      title="설정"
      h={520}
      scale={0.66}
      overlay={
        <Sheet
          title="데이터 내보내기"
          footer={<ButtonView look={buttonLook({ variant: brandBtn ? 'brandSolid' : 'neutralSolid', size: 'large' })} label="내보내기" fill />}
        >
          <ExportGroup picked={[0, 1]} tone={tone} />
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
      <Verdict ok note="체크는 짙은 회색 — 화면의 주 액션(내보내기)이 먼저 읽힌다">
        <ExportSheet tone="neutral" brandBtn={false} />
      </Verdict>
      <Verdict ok={false} note="체크마다 브랜드 색을 깔면 브랜드 색이 흩어진다">
        <ExportSheet tone="brand" brandBtn />
      </Verdict>
    </Pair>
  </Panel>
);

const ErrorFig: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="칸은 그대로, 묶음 아래 글로 무엇을 할지 알린다">
        <div className="w-[220px]">
          <ExportGroup picked={[]} message="내보낼 데이터를 하나 이상 골라 주세요." />
        </div>
      </Verdict>
      <Verdict ok={false} note="칸마다 빨간 테두리 — 묶음 오류에서 모든 칸이 빨개져 무엇이 틀렸는지 흐려진다">
        <div className="w-[220px]">
          <ExportGroup picked={[]} bordered message="내보낼 데이터를 하나 이상 골라 주세요." />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

// 스위치 — switch.yaml 을 푼 값으로(멈춘 그림, 스위치만)
function MiniSwitch({ on, name }: { on: boolean; name: string }) {
  return <SwitchView look={switchLook({})} checked={on} state="enabled" ariaLabel={name} passive />;
}
const VsSwitch: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-3">
        <Phone title="알림" h={500} scale={0.72}>
          <div style={cardStack()}>
            <Card>
              {[
                ['결제일 하루 전', true],
                ['예산 초과', true],
                ['할 일 마감', false],
              ].map(([t, on]) => (
                <div key={String(t)} className="flex items-center justify-between py-2.5">
                  <span className="text-[15px] pk-text">{t}</span>
                  <MiniSwitch on={!!on} name={String(t)} />
                </div>
              ))}
            </Card>
          </div>
        </Phone>
        <Cap strong="Switch">누르는 순간 적용 — 항목마다 따로</Cap>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Phone
          title="설정"
          h={500}
          scale={0.72}
          overlay={
            <Sheet title="데이터 내보내기" footer={<ButtonView look={buttonLook({ variant: 'neutralSolid', size: 'large' })} label="내보내기" fill />}>
              <ExportGroup picked={[0, 1]} />
            </Sheet>
          }
        >
          <div className="p-5" />
        </Phone>
        <Cap strong="Checkbox">골라 두고 내보내기로 적용 — 한 묶음에 여러 항목</Cap>
      </div>
    </div>
  </Figure>
);

// ── 코드 예시(미리보기) ───────────────────────────────────
function Preview({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="not-prose mt-6 mb-0">
      <div className="flex min-h-[110px] flex-wrap items-center justify-center gap-6 rounded-t-xl border border-b-0 border-fd-border px-6 py-8" style={{ background: rc('bg-layer-default') }}>
        {children}
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExBasic: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <C label="단종된 카드도 보기" />
  </Preview>
);
const ExSizes: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <C size="medium" label="medium" checked="checked" />
    <C size="large" label="large" checked="checked" />
    <C size="large" weight="bold" label="large · bold" checked="checked" />
  </Preview>
);
const ExVariants: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <C checked="checked" label="neutral" />
    <C checked="checked" tone="brand" label="brand" />
    <C checked="checked" shape="ghost" label="ghost" />
  </Preview>
);
const ExGroup: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <CheckboxGroupDemo parent={checkLook({ weight: 'bold' })} child={checkLook({})} parentLabel="전체" items={['거래 내역', '예산', '메모']} initial={[0]} gap={GROUP_GAP()} />
  </Preview>
);
const ExDisabled: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <C state="disabled" label="이 카드 기억하기" />
    <C state="disabled" checked="checked" label="이 카드 기억하기" />
  </Preview>
);
const ExCheckmark: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <div className="w-[320px] overflow-hidden rounded-xl border border-fd-border">
      {[
        ['월급', '+3,200,000원', 'checked'],
        ['점심 식사', '−12,000원', 'unchecked'],
      ].map(([t, a, ch], i) => (
        <div key={t} className="flex items-center gap-3 px-6 py-3" style={{ borderTop: i ? `1px solid ${rc('stroke-neutral-subtle')}` : undefined }}>
          <C checked={ch as Checked} ariaLabel={`${t} 선택`} />
          <span className="flex-1 text-[15px] pk-text">{t}</span>
          <span className="text-[15px] font-bold tabular-nums pk-text">{a}</span>
        </div>
      ))}
    </div>
  </Preview>
);

export const checkboxFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  weight: Weight,
  tones: Tones,
  shapes: Shapes,
  states: States,
  live: Live,
  group: Group,
  'touch-target': TouchTarget,
  'group-guide': GroupGuide,
  'shape-guide': ShapeGuide,
  'tone-guide': ToneGuide,
  error: ErrorFig,
  'vs-switch': VsSwitch,
  'ex-basic': ExBasic,
  'ex-sizes': ExSizes,
  'ex-variants': ExVariants,
  'ex-group': ExGroup,
  'ex-disabled': ExDisabled,
  'ex-checkmark': ExCheckmark,
};
