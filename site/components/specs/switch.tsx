// Switch 페이지의 그림 — specs/components/switch.md 의 `[그림: …](../../site/components/specs/switch.tsx#<id>)` 자리.
// 스위치 · 라벨은 switch.yaml 을 푼 값(switchLook)으로, 화면 예시는 kit 의 Desk 화면 조각으로 그린다.
// 예시는 누르는 순간 적용되는 제품 화면 — Desk 알림 설정 · 일정의 "종일". 설정 줄은 List(list.yaml)의 스위치 줄로 그린다.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { axisValues, loadComponentSpec } from '@/lib/component-spec';
import { switchLook, switchParts, SWITCH_CHECKED, SWITCH_STATES, type SwitchChecked, type SwitchCombo, type SwitchState } from './switch-look';
import { SwitchView } from './switch-view';
import { SwitchPlayground } from './switch-playground';
import { buttonLook } from './button-look';
import { ButtonView } from './button-view';
import { Card, Phone, Sheet, Verdict, cardStack, rc, type Mode } from './kit';
import { listLook, type RowSpec } from './list-look';
import { ListView } from './list-view';

type Fig = (p: { caption?: string }) => ReactNode;
const spec = () => loadComponentSpec('switch');
const SIZES = () => axisValues(spec(), 'size');
const DEFAULT_SIZE = () => String(spec().defaults?.size);

// 한 Switch — 조합 · 켬 · 끔 · 상태 · 모드(state 를 안 주면 멈춘 그림)
function S(p: SwitchCombo & { on?: boolean; state?: SwitchState | 'live'; label?: ReactNode; mode?: Mode; brand?: 'desk' | 'hr'; ariaLabel?: string; passive?: boolean; style?: CSSProperties }) {
  const { size, tone, brand, on = false, state = 'enabled', ...rest } = p;
  const look = switchLook({ size, tone }, brand ?? 'desk');
  return state === 'live' ? <SwitchView look={look} defaultChecked={on} state="live" {...rest} /> : <SwitchView look={look} checked={on} state={state} {...rest} />;
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
const KO: Record<SwitchChecked, string> = { unchecked: '끔', checked: '켬' };
const STATE_KO: Record<SwitchState, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', disabled: '비활성' };

// 설정 줄 — List 의 스위치 줄(제목 · 설명 왼쪽, 스위치 32 오른쪽, 줄 전체가 누르는 영역)
type Setting = { title: string; desc?: string; on: boolean; disabled?: boolean; dimLabel?: boolean };
function SettingRows({ rows, tone, live = false, mode = 'auto' }: { rows: Setting[]; tone?: string; live?: boolean; mode?: Mode }) {
  const lk = listLook();
  // 브랜드 톤 — 줄에 끼우는 스위치만 바꿔 그린다(List 는 톤을 정하지 않는다)
  const look = tone && tone !== 'neutral' ? { ...lk, marks: { ...lk.marks, switch: switchLook({ size: '32', tone }) } } : lk;
  const spec: RowSpec[] = rows.map(({ title, desc, on, disabled = false, dimLabel = disabled }) => ({
    kind: 'switch',
    title,
    detail: desc,
    checked: on,
    disabled: disabled && dimLabel,
    markDisabled: disabled && !dimLabel,
  }));
  return <ListView look={look} rows={spec} mode={mode} live={live} />;
}
const NOTI: [string, string, boolean][] = [
  ['결제 알림', '결제 예정일 D-1, 결제일 당일 알림', true],
  ['예산 알림', '카테고리 예산 80%·100% 도달', true],
  ['주간 리포트', '매주 월요일 오전 9시', false],
];

// ── Overview ──────────────────────────────────────────────
const HERO: [string, SwitchCombo, SwitchState][] = [
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
                  {SWITCH_CHECKED.map((ch) => (
                    <S key={ch} {...combo} on={ch === 'checked'} mode={mode} state={st} ariaLabel={KO[ch]} />
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

const Playground: Fig = () => <SwitchPlayground parts={{ desk: switchParts('desk'), hr: switchParts('hr') }} sizes={SIZES()} defaultSize={DEFAULT_SIZE()} />;

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
  const look = switchLook({ size: '32' });
  const f = look.faces.checked.light.enabled;
  const d = look.faces.checked.dark.enabled;
  const vars = { '--ps-bg-l': f.mark.bg, '--ps-bg-d': d.mark.bg, '--ps-th-l': f.thumb.color, '--ps-th-d': d.thumb.color, '--ps-lb-l': f.label.color, '--ps-lb-d': d.label.color, '--ps-ring-l': look.faces.checked.light.focused.ring.color, '--ps-ring-d': look.faces.checked.dark.focused.ring.color } as CSSProperties;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-16 pb-8 pt-16">
        <div className="pswt" data-mode="auto" style={{ ...vars, transform: 'scale(1.4)', transformOrigin: 'center', margin: '18px 60px 60px' }}>
          <span className="relative inline-flex items-center" style={{ gap: f.row.gap }}>
            <Pin n="ⓐ" below>
              <span
                className="inline-flex items-center justify-end"
                style={{ width: f.mark.width, height: f.mark.height, padding: f.mark.padding, boxSizing: 'border-box', borderRadius: 9999, background: 'var(--ps-bg)', outline: `${f.ring.width}px solid var(--ps-ring)`, outlineOffset: f.ring.offset }}
              >
                <Pin n="ⓑ">
                  <span style={{ display: 'block', width: f.thumb.size, height: f.thumb.size, borderRadius: 9999, background: 'var(--ps-th)' }} />
                </Pin>
              </span>
            </Pin>
            <Pin n="ⓒ">
              <span style={{ fontSize: f.label.fontSize, lineHeight: f.label.lineHeight, fontWeight: f.label.fontWeight, color: 'var(--ps-lb)' }}>라벨</span>
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
            ['ⓐ', 'Switchmark'],
            ['ⓑ', 'Thumb'],
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
    <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6 rounded-xl pk-surface px-8 py-8">
      {SIZES().map((s) => {
        const f = switchLook({ size: s }).faces.checked.light.enabled;
        return (
          <div key={s} className="flex flex-col items-center gap-4">
            <span className="relative flex items-center">
              <span className="absolute -left-3 top-0 w-1.5 border-y border-l" style={{ height: f.row.minHeight, borderColor: MARK_LINE }} />
              <span className="flex items-center" style={{ minHeight: f.row.minHeight, background: MARK }}>
                <S size={s} on label="종일" />
              </span>
            </span>
            <Cap strong={s === DEFAULT_SIZE() ? `${s} · 기본` : s}>
              트랙 {f.mark.width} × {f.mark.height} · 엄지 {f.thumb.size}
              <br />
              라벨 {f.label.fontSize} · 줄 {f.row.minHeight}
            </Cap>
          </div>
        );
      })}
    </div>
  </Figure>
);

const Tones: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-12 rounded-xl pk-surface px-12 py-8">
      {(
        [
          ['neutral', 'neutral', 'desk', '기본 — 라이트는 짙은 회색, 다크는 밝은 회색'],
          ['brand · Desk', 'brand', 'desk', '서비스 핵심 흐름에서만'],
          ['brand · HR', 'brand', 'hr', 'HR 은 초록'],
        ] as const
      ).map(([name, tone, brand, note]) => (
        <div key={name} className="flex flex-col items-center gap-3">
          <div className="flex flex-col gap-3">
            <S tone={tone} brand={brand} on label="푸시 알림" />
            <S tone={tone} brand={brand} label="종일" />
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
        ] as [string, SwitchCombo][]
      ).map(([name, combo]) => (
        <div key={name} className="overflow-x-auto rounded-xl pk-surface p-5">
          <div className="mb-3 text-[12px] font-bold pk-text">{name}</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-[72px]" />
                {SWITCH_STATES.map((s) => (
                  <th key={s} className="pb-2 text-center text-[12px] font-medium pk-muted">
                    {STATE_KO[s]}
                    <br />
                    <span className="font-mono text-[10px]">{s}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SWITCH_CHECKED.map((ch) => (
                <tr key={ch}>
                  <td className="py-2 pr-2 text-[12px] pk-text">{KO[ch]}</td>
                  {SWITCH_STATES.map((s) => (
                    <td key={s} className="py-2 text-center">
                      <S {...combo} on={ch === 'checked'} state={s} ariaLabel={`${KO[ch]} ${STATE_KO[s]}`} />
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
      <div className="flex flex-col gap-3">
        <S state="live" label="종일" />
        <S state="live" on tone="brand" label="brand 톤" />
        <S state="disabled" on label="켜진 채 막힘" />
        <S state="disabled" label="꺼진 채 막힘" />
      </div>
      <div className="w-[320px]">
        <SettingRows rows={NOTI.map(([title, desc, on]) => ({ title, desc, on }))} live />
        <span className="mt-1 block text-[12px] pk-muted">설정 줄(List) — 줄 어디를 눌러도 바뀐다</span>
      </div>
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
const TouchTarget: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center gap-3 rounded-xl pk-surface px-6 py-7">
        <span className="relative inline-flex">
          <span className="absolute -inset-x-2 top-1/2 z-0 h-11 -translate-y-1/2 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
          <S label="종일" on style={{ position: 'relative', zIndex: 1 }} />
        </span>
        <Cap strong="Switch">스위치 + 라벨이 한 영역 — 높이 44 까지</Cap>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-[340px] overflow-hidden rounded-xl pk-surface py-2">
          {NOTI.map(([title, desc, on], i) => (
            <div key={title} className="relative">
              {i === 0 && <span className="pointer-events-none absolute inset-0 z-[1]" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />}
              <SettingRows rows={[{ title, desc, on }]} />
            </div>
          ))}
        </div>
        <Cap strong="설정 줄">스위치만 끼우면 줄 전체가 누르는 영역</Cap>
      </div>
    </div>
  </Figure>
);

// 좁은 화면에서는 위아래로 — 나란히 두면 줄의 본문이 눌려 낱말이 칸 밖으로 넘친다(단어 단위 줄바꿈 v114)
const Pair = ({ children }: { children: ReactNode }) => <div className="flex w-full max-w-[620px] flex-col gap-4 sm:flex-row">{children}</div>;

function NotiPhone({ tone, masterOn = true, forceOff = false }: { tone?: string; masterOn?: boolean; forceOff?: boolean }) {
  return (
    <Phone title="알림 설정" h={500} scale={0.68}>
      <div style={cardStack()}>
        <Card body="list">
          <SettingRows rows={[{ title: '푸시 알림', desc: masterOn ? '모든 알림이 활성화되어 있어요' : '알림이 꺼져 있어요', on: masterOn }]} tone={tone} />
        </Card>
        <Card body="list">
          <SettingRows rows={NOTI.map(([title, desc, on]) => ({ title, desc, on: forceOff ? false : on, disabled: !masterOn && !forceOff }))} tone={tone} />
        </Card>
      </div>
    </Phone>
  );
}
const ImmediateGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="알림 설정 — 누르는 순간 저장된다. Switch 다">
        <NotiPhone />
      </Verdict>
      <Verdict ok={false} note="자산 추가 — 저장을 눌러야 적용되는 옵션에 Switch. 켠 순간 적용된 것처럼 보인다. Checkbox 로">
        <Phone
          title="자산"
          h={500}
          scale={0.68}
          overlay={
            <Sheet title="자산 추가" footer={<ButtonView look={buttonLook({ variant: 'neutralSolid', size: 'large' })} label="저장" fill />}>
              <div className="-mx-6">
                <SettingRows
                  rows={[
                    { title: '전체 자산 합계에 포함', desc: '순자산·총자산 계산에 반영됩니다', on: true },
                    { title: '금액 숨기기', desc: '이 자산의 금액만 가려요', on: false },
                  ]}
                />
              </div>
            </Sheet>
          }
        >
          <div className="p-5" />
        </Phone>
      </Verdict>
    </Pair>
  </Panel>
);

const DependentGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="위 설정을 끄면 아래 줄을 막는다 — 값(켬 · 끔)은 그대로 남아, 다시 켜면 그대로 돌아온다">
        <NotiPhone masterOn={false} />
      </Verdict>
      <Verdict ok={false} note="위 스위치가 아래를 한꺼번에 끈다 — 값이 사라지고, 위와 아래가 부모 · 자식처럼 읽힌다">
        <NotiPhone masterOn={false} forceOff />
      </Verdict>
    </Pair>
  </Panel>
);

const DisabledGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="스위치와 함께 제목 · 설명도 비활성 색 — 줄 전체가 막힌 것으로 읽힌다">
        <div className="w-[280px]">
          <SettingRows rows={[{ title: '주간 리포트', desc: '매주 월요일 오전 9시', on: true, disabled: true }]} />
        </div>
      </Verdict>
      <Verdict ok={false} note="스위치만 회색 — 줄은 눌릴 것처럼 보인다">
        <div className="w-[280px]">
          <SettingRows rows={[{ title: '주간 리포트', desc: '매주 월요일 오전 9시', on: true, disabled: true, dimLabel: false }]} />
        </div>
      </Verdict>
    </Pair>
  </Panel>
);

const ToneGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <Pair>
      <Verdict ok note="켜짐은 neutral — 스위치가 많아도 화면이 조용하다">
        <NotiPhone />
      </Verdict>
      <Verdict ok={false} note="스위치마다 브랜드 색 — 설정 화면 전체에 브랜드 색이 흩어진다">
        <NotiPhone tone="brand" />
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
    <S state="live" on label="종일" />
  </Preview>
);
const ExSizes: Fig = ({ caption }) => (
  <Preview caption={caption}>
    {SIZES().map((s) => (
      <S key={s} size={s} state="live" on label={s} />
    ))}
  </Preview>
);
const ExTones: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <S state="live" on label="neutral" />
    <S state="live" on tone="brand" label="brand" />
  </Preview>
);
const ExControlled: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <S state="live" label="종일" />
    <S state="disabled" label="종일" />
    <S state="disabled" on label="종일" />
  </Preview>
);
const ExSwitchmark: Fig = ({ caption }) => (
  <Preview caption={caption}>
    <div className="w-[340px] overflow-hidden rounded-xl border border-fd-border">
      <SettingRows rows={[{ title: '결제 알림', on: true }]} live />
    </div>
  </Preview>
);

export const switchFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  tones: Tones,
  states: States,
  live: Live,
  'touch-target': TouchTarget,
  'immediate-guide': ImmediateGuide,
  'dependent-guide': DependentGuide,
  'disabled-guide': DisabledGuide,
  'tone-guide': ToneGuide,
  'ex-basic': ExBasic,
  'ex-sizes': ExSizes,
  'ex-tones': ExTones,
  'ex-controlled': ExControlled,
  'ex-switchmark': ExSwitchmark,
};
