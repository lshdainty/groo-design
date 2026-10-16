// Button 페이지의 그림 — specs/components/button.md 의 `[그림: …](../../site/components/specs/button.tsx#<id>)` 자리.
// 버튼은 button.yaml 을 푼 값(buttonLook)으로 그린다. 화면 예시는 kit 의 Desk · HR 화면 조각.
import type { CSSProperties, ReactNode } from 'react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { axisDesc, axisValues, loadComponentSpec } from '@/lib/component-spec';
import { buttonLook, buttonParts, BUTTON_STATES, type ButtonCombo } from './button-look';
import { ButtonPlayground } from './button-playground';
import { ButtonView, Icon, LoadingDemo, PressLockDemo, type IconName } from './button-view';
import { rc, Card, Row, Phone, Field, cardStack, type Mode } from './kit';

type Fig = (p: { caption?: string }) => ReactNode;
const spec = () => loadComponentSpec('button');
const VARIANTS = () => axisValues(spec(), 'variant');
const SIZES = () => axisValues(spec(), 'size');
const GHOST = () => axisValues(spec(), 'ghostColor');

// 한 버튼 — 조합 · 상태 · 모드
function B(p: ButtonCombo & { label?: string; prefix?: IconName; suffix?: IconName; icon?: IconName; state?: (typeof BUTTON_STATES)[number] | 'live'; mode?: Mode; fill?: boolean; width?: number | string; flush?: 'left' | 'right'; brand?: 'desk' | 'hr' }) {
  const { variant, size, layout, ghostColor, brand, ...rest } = p;
  const look = buttonLook({ variant, size, layout: layout ?? (p.icon ? 'iconOnly' : 'withText'), ghostColor }, brand ?? 'desk');
  return <ButtonView look={look} label={p.label ?? '라벨'} ariaLabel={p.icon ? p.label ?? '버튼' : undefined} {...rest} />;
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

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="flex flex-col gap-3">
      {(['light', 'dark'] as Mode[]).map((mode) => (
        <Surface key={mode} mode={mode} className="flex flex-wrap items-center justify-center gap-3">
          {VARIANTS().map((v) => (
            <B key={v} variant={v} mode={mode} label={v === 'brandSolid' ? '거래 추가' : v === 'criticalSolid' ? '삭제' : v === 'neutralWeak' ? '취소' : v === 'ghost' ? '더보기' : '저장'} />
          ))}
        </Surface>
      ))}
    </div>
  </Panel>
);

// ── Anatomy ───────────────────────────────────────────────
function Pin({ n, children }: { n: string; children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className="absolute -top-11 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
          {n}
        </span>
        <span className="h-5 w-px" style={{ background: MARK_LINE }} />
      </span>
      {children}
    </span>
  );
}
// 버튼이 아닌 그림 조각도 라이트 · 다크 전환을 따르게 — 두 모드 값을 싣고 CSS(.pauto)가 고른다
function autoTone(look: ReturnType<typeof buttonLook>) {
  const l = look.faces.light, d = look.faces.dark;
  return {
    '--pa-bg-l': l.enabled.bg,
    '--pa-bg-d': d.enabled.bg,
    '--pa-fg-l': l.enabled.fg,
    '--pa-fg-d': d.enabled.fg,
    '--pa-ring-l': l.focused.ring.color,
    '--pa-ring-d': d.focused.ring.color,
    background: 'var(--pa-bg)',
    color: 'var(--pa-fg)',
  } as CSSProperties;
}

const Anatomy: Fig = ({ caption }) => {
  const look = buttonLook({ variant: 'neutralSolid', size: 'large' });
  const f = look.faces.light.enabled;
  const ring = look.faces.light.focused.ring;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-xl pk-surface px-16 pb-8 pt-16">
        <div className="relative" style={{ transform: 'scale(1.5)', transformOrigin: 'center', margin: '16px 60px 44px' }}>
          <span
            className="pauto relative inline-flex items-center"
            style={{
              ...autoTone(look),
              height: f.height,
              padding: `0 ${f.padX}px`,
              gap: f.gap,
              borderRadius: f.radius,
              fontSize: f.fontSize,
              fontWeight: f.fontWeight,
              outline: `${ring.width}px solid var(--pa-ring)`,
              outlineOffset: ring.offset,
            }}
          >
            <Pin n="ⓑ">
              <Icon name="plus" size={f.icon} />
            </Pin>
            <Pin n="ⓒ">
              <span>라벨</span>
            </Pin>
            <Pin n="ⓓ">
              <Icon name="chevron-right" size={f.icon} />
            </Pin>
            <span className="absolute -bottom-10 left-3 flex flex-col items-center">
              <span className="h-5 w-px" style={{ background: MARK_LINE }} />
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
                ⓐ
              </span>
            </span>
            <span className="absolute -right-10 top-1/2 flex -translate-y-1/2 items-center">
              <span className="h-px w-5" style={{ background: MARK_LINE }} />
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: MARK_LINE }}>
                ⓔ
              </span>
            </span>
          </span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4 text-center text-[12px] leading-4 pk-muted">
          {[
            ['ⓐ', 'Container'],
            ['ⓑ', 'Prefix Icon'],
            ['ⓒ', 'Label'],
            ['ⓓ', 'Suffix Icon'],
            ['ⓔ', 'Focus ring'],
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
    <div className="flex items-end gap-8 rounded-xl pk-surface px-10 py-8">
      {SIZES().map((s) => {
        const h = buttonLook({ size: s }).faces.light.enabled.height;
        return (
          <div key={s} className="flex flex-col items-center gap-3">
            <B size={s} label="라벨" />
            <Cap strong={s}>높이 {h}</Cap>
          </div>
        );
      })}
    </div>
  </Figure>
);

// 크기 하나의 치수 — 디자인 도구의 간격 표시처럼
function Measured({ size }: { size: string }) {
  const look = buttonLook({ size });
  const f = look.faces.light.enabled;
  const band = (w: number, label: string) => (
    <span className="relative flex h-full shrink-0 items-center justify-center" style={{ width: w, background: MARK }}>
      <span className="absolute -bottom-6 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
        {label}
      </span>
    </span>
  );
  return (
    <div className="flex flex-col items-center gap-9">
      <div className="relative flex items-center">
        <span
          className="pauto flex items-center overflow-visible"
          style={{ ...autoTone(look), height: f.height, borderRadius: f.radius, fontSize: f.fontSize, fontWeight: f.fontWeight, lineHeight: f.lineHeight }}
        >
          {band(f.padX, `${f.padX}`)}
          <span className="relative flex items-center" style={{ outline: `1px dashed ${MARK_LINE}` }}>
            <Icon name="plus" size={f.icon} />
          </span>
          {band(f.gap, `${f.gap}`)}
          <span>라벨</span>
          {band(f.padX, `${f.padX}`)}
        </span>
        <span className="absolute -left-9 top-0 flex h-full items-center">
          <span className="flex h-full w-3 flex-col items-center justify-center" style={{ borderTop: `1px solid ${MARK_LINE}`, borderBottom: `1px solid ${MARK_LINE}` }}>
            <span className="h-full w-px" style={{ background: MARK_LINE }} />
          </span>
          <span className="ml-1 rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
            {f.height}
          </span>
        </span>
      </div>
      <Cap strong={size}>
        아이콘 {f.icon} · 글자 {f.fontSize} · 모서리 {f.radius === '9999px' ? '알약' : f.radius}
      </Cap>
    </div>
  );
}
const SizeSpec: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="grid grid-cols-2 gap-x-20 gap-y-10 rounded-xl pk-surface px-16 pb-8 pt-10">
      {SIZES().map((s) => (
        <Measured key={s} size={s} />
      ))}
    </div>
  </Figure>
);

// ── Layout ────────────────────────────────────────────────
const Layouts: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-end gap-8 rounded-xl pk-surface px-10 py-8">
      {[
        ['글자만', <B key="a" label="라벨" />],
        ['앞 아이콘 + 글자', <B key="b" label="라벨" prefix="plus" />],
        ['글자 + 뒤 아이콘', <B key="c" label="라벨" suffix="chevron-right" />],
        ['아이콘만', <B key="d" icon="plus" label="추가" />],
      ].map(([t, el]) => (
        <div key={String(t)} className="flex flex-col items-center gap-3">
          {el}
          <Cap>{t}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

// ── Variant ───────────────────────────────────────────────
const Variants: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3">
      {(['light', 'dark'] as Mode[]).map((mode) => (
        <Surface key={mode} mode={mode}>
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-7">
            {VARIANTS().map((v) => (
              <div key={v} className="flex flex-col items-center gap-2.5">
                <B variant={v} mode={mode} label="라벨" />
                <span className="text-[11px] font-medium" style={{ color: rc('fg-neutral-subtle', mode) }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </Surface>
      ))}
    </div>
  </Panel>
);

// 변형마다 — 버튼 · 쓰는 곳(YAML 의 설명)
const VariantCards: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="grid gap-3 sm:grid-cols-2">
      {VARIANTS().map((v) => (
        <div key={v} className="flex items-center gap-4 rounded-xl pk-surface p-4">
          <div className="flex w-[108px] shrink-0 justify-center">
            <B variant={v} label={v === 'criticalSolid' ? '삭제' : v === 'neutralWeak' ? '취소' : '라벨'} />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <code className="text-[13px] font-bold pk-text">{v}</code>
            <span className="text-[12px] leading-[18px] pk-muted">{axisDesc(spec(), 'variant', v)}</span>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

const GhostColors: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-end gap-6 rounded-xl pk-surface px-10 py-8">
      {GHOST().map((g) => (
        <div key={g} className="flex flex-col items-center gap-3">
          <B variant="ghost" ghostColor={g} label={g === 'critical' ? '삭제' : g === 'brand' ? '자세히 보기' : g === 'neutralSubtle' ? '더보기' : '편집'} prefix={g === 'critical' ? 'trash' : g === 'brand' ? undefined : g === 'neutral' ? 'pencil' : undefined} />
          <Cap strong={g}>{axisDesc(spec(), 'ghostColor', g)?.split(' — ')[0]}</Cap>
        </div>
      ))}
    </div>
  </Figure>
);

// ── State ─────────────────────────────────────────────────
const STATE_KO: Record<string, string> = { enabled: '기본', hovered: '호버', focused: '포커스', pressed: '누름', loading: '로딩', disabled: '비활성' };
const States: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="overflow-x-auto rounded-xl pk-surface p-5">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-[120px]" />
            {BUTTON_STATES.map((s) => (
              <th key={s} className="pb-3 text-center text-[12px] font-medium pk-muted">
                {STATE_KO[s]}
                <br />
                <span className="font-mono text-[10px]">{s}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS().map((v) => (
            <tr key={v}>
              <td className="py-2 pr-3 text-[12px] font-medium pk-text">{v}</td>
              {BUTTON_STATES.map((s) => (
                <td key={s} className="px-2 py-2 text-center">
                  <B variant={v} size="small" state={s} label="라벨" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Panel>
);

const LiveStates: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-5 rounded-xl pk-surface px-10 py-8">
      <div className="flex flex-wrap justify-center gap-3">
        {VARIANTS().map((v) => (
          <B key={v} variant={v} label="눌러 보기" />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <LoadingDemo look={buttonLook({ variant: 'neutralSolid' })} label="저장" />
        <LoadingDemo look={buttonLook({ variant: 'brandSolid' })} label="거래 추가" />
        <LoadingDemo look={buttonLook({ variant: 'neutralWeak' })} label="불러오기" />
      </div>
    </div>
  </Figure>
);

// ── 누른 동작이 끝날 때까지 한 번(Behavior) ─────────────────
const PressLock: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-start justify-center gap-10 rounded-xl pk-surface px-10 py-8">
      <PressLockDemo look={buttonLook({ variant: 'neutralSolid' })} label="저장" />
      <PressLockDemo look={buttonLook({ variant: 'brandOutline' })} label="보내기" />
    </div>
  </Figure>
);

// ── Width ─────────────────────────────────────────────────
const Width: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex gap-6">
      <div className="flex flex-col items-center gap-3">
        <Phone title="9월 가계부" h={420} scale={0.8}>
          <div style={cardStack()}>
            <Card title="최근 거래" action="전체 보기">
              <Row title="점심 식사" sub="식비 · 오늘" amount="−12,000원" hue="orange" />
              <Row title="버스" sub="교통 · 오늘" amount="−1,500원" hue="blue" />
              <div className="mt-2 flex justify-center">
                <B variant="neutralWeak" size="small" label="내역 더보기" />
              </div>
            </Card>
          </div>
        </Phone>
        <Cap strong="Hug">글자에 맞춘 폭 — 화면 안의 액션</Cap>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Phone title="거래 입력" h={420} scale={0.8} bg="bg-layer-default" bottom={<B variant="neutralSolid" size="large" fill label="저장" />}>
          <div className="flex flex-col gap-4 px-6 pt-4">
            <Field label="금액" value="12,000원" />
            <Field label="내용" value="점심 식사" />
          </div>
        </Phone>
        <Cap strong="Fill">화면 폭을 채운다 — 아래 고정 CTA</Cap>
      </div>
    </div>
  </Figure>
);

// ── 누르는 영역 44 ────────────────────────────────────────
const HitArea: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex items-center gap-12 rounded-xl pk-surface px-12 py-10">
      {['xsmall', 'small', 'medium'].map((s) => {
        const f = buttonLook({ size: s, layout: 'iconOnly' }).faces.light.enabled;
        return (
          <div key={s} className="flex flex-col items-center gap-4">
            <span className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
              <span className="absolute inset-0 rounded-md" style={{ background: MARK, outline: `1px dashed ${MARK_LINE}` }} />
              <B size={s} icon="search" label="검색" />
            </span>
            <Cap strong={s}>
              보이는 {f.height} · 누르는 44
            </Cap>
          </div>
        );
      })}
    </div>
  </Figure>
);

// ── 플레이그라운드 ────────────────────────────────────────
const Playground: Fig = () => <ButtonPlayground parts={{ desk: buttonParts('desk'), hr: buttonParts('hr') }} />;

export const buttonFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  'size-spec': SizeSpec,
  layouts: Layouts,
  variants: Variants,
  'variant-cards': VariantCards,
  'ghost-colors': GhostColors,
  states: States,
  'live-states': LiveStates,
  'press-lock': PressLock,
  width: Width,
  'hit-area': HitArea,
};
