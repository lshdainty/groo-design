// Color 페이지 — 색 값은 DESIGN*.md colors 블록에서만 온다
import type { CSSProperties, ReactNode } from 'react';
import { BRAND_ROLES, CHART_ORDER, color, colorStep, contrast, design, palette, roleAliases, roleColors, typeScale, type Brand } from '@/lib/design-tokens';
import { Chip, Figure, Swatch, Table, Token } from './ui';
import { cardFace } from '../specs/card-face';

type Mode = 'light' | 'dark';
// 역할 색 한 개 — 모드에 맞는 값(다크는 `-dark` 짝)
function rc(name: string, mode: Mode, brand: Brand = 'desk') {
  if (name === 'static-white') return color('static-white', brand);
  return color(mode === 'dark' ? `${name}-dark` : name, brand);
}
// 글자 크기 · 줄 높이 — v100 스케일 토큰 그대로(그림의 글자도 Typography "글자 역할" 값으로 그린다)
function ts(name: string): CSSProperties {
  const t = typeScale().scale.find((x) => x.name === name);
  if (!t) throw new Error(`글자 토큰 ${name} 이 없다`);
  return { fontSize: t.fontSize, lineHeight: t.lineHeight };
}

// ── 이름 규칙 ─────────────────────────────────────────────
const NAMING: [string, string[]][] = [
  ['Property', ['fg (글자 · 아이콘)', 'bg (배경)', 'stroke (선)']],
  ['Role', ['layer', 'neutral', 'brand', 'critical', 'positive', 'warning', 'informative']],
  ['Variant', ['solid', 'weak', 'contrast', 'muted', 'subtle', 'inverted']],
  ['State', ['pressed']],
];
export function RoleNamingFigure() {
  const parts: [string, string][] = [['bg', 'Property'], ['critical', 'Role'], ['weak', 'Variant'], ['pressed', 'State']];
  return (
    <Figure caption="역할 색 이름 규칙 — 속성 · 역할 · 변형 · 상태 순으로 붙인다">
      <div className="flex w-[548px] flex-col gap-8">
        <div className="grid grid-cols-4 gap-3">
          {NAMING.map(([h, items]) => (
            <div key={h} className="flex flex-col gap-2">
              <div className="rounded-md bg-[#2B3140] px-3 py-2 text-[14px] font-bold text-white">{h}</div>
              {items.map((it) => (
                <code key={it} className="w-fit rounded-md bg-white px-2.5 py-1.5 text-[13px] text-[#1A1F2E] shadow-sm">-{it.split(' ')[0]}{it.includes(' ') && <span className="font-sans text-[11px] text-[#62697A]"> {it.slice(it.indexOf(' ') + 1)}</span>}</code>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white pb-12 pt-8 shadow-sm">
          <div className="flex font-mono text-[30px] text-[#1A1F2E]">
            {parts.map(([p, lab], i) => (
              <div key={p} className="flex">
                {i > 0 && <span>-</span>}
                <div className="relative flex flex-col items-center">
                  <span>{p}</span>
                  <span className="mt-1 h-2 w-full border-x border-b border-[#9DA3B0]" />
                  <span className="absolute top-full mt-2 whitespace-nowrap font-sans text-[13px] text-[#62697A]">{lab}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Figure>
  );
}

// ── 역할별 사용 예 — 라이트 · 다크를 나란히 ─────────────────────
function Pair({ render, caption, tokens }: { render: (m: Mode) => ReactNode; caption: string; tokens: string[] }) {
  return (
    <>
      <Figure caption={caption}>
        <div className="flex flex-wrap justify-center gap-6">
          {(['light', 'dark'] as Mode[]).map((m) => (
            <div key={m} className="flex flex-col items-center gap-2">
              <div className="w-[300px] rounded-2xl p-6" style={{ background: rc('bg-layer-basement', m), color: rc('fg-neutral', m) }}>
                {render(m)}
              </div>
              <span className="text-[12px] text-fd-muted-foreground">{m === 'light' ? '라이트' : '다크'}</span>
            </div>
          ))}
        </div>
      </Figure>
      <ul className="not-prose -mt-2 mb-8 flex flex-wrap gap-2">
        {tokens.map((t) => (
          <li key={t}><Token>{t}</Token></li>
        ))}
      </ul>
    </>
  );
}

const btn: CSSProperties = { display: 'inline-block', fontSize: 14, fontWeight: 700, lineHeight: '20px', padding: '8px 14px', borderRadius: 8 };
const badge: CSSProperties = { display: 'inline-block', fontSize: 12, fontWeight: 700, lineHeight: '20px', padding: '0 8px', borderRadius: 4 };
// 카드 — card.yaml 의 면(흰 면 + 1px stroke-neutral-weak · 모서리 16 · 여백 24, 바닥 위)
const card = (m: Mode): CSSProperties => ({ background: rc('bg-layer-default', m), border: `1px solid ${rc('stroke-neutral-weak', m)}`, borderRadius: cardFace().radius, padding: cardFace().pad });

export function BrandExample({ brand = 'desk' }: { brand?: 'desk' | 'hr' }) {
  const b = (n: string, m: Mode) => rc(n, m, brand);
  return (
    <Pair
      caption={`브랜드 역할 — ${brand === 'desk' ? 'Desk' : 'HR'}. 화면에서 가장 중요한 동작과 브랜드 요소에 쓴다`}
      tokens={['fg-brand', 'fg-brand-contrast', 'bg-brand-solid', 'bg-brand-solid-pressed', 'bg-brand-weak', 'stroke-brand-solid', 'stroke-focus-ring']}
      render={(m) => (
        <div className="flex flex-col gap-3" style={card(m)}>
          <div className="flex items-center justify-between">
            <span style={{ ...ts('t5'), fontWeight: 700 }}>{brand === 'desk' ? '카드 청구서' : '연차 신청'}</span>
            <span style={{ ...badge, background: b('bg-brand-weak', m), color: b('fg-brand-contrast', m) }}>{brand === 'desk' ? '이번 달' : '대기'}</span>
          </div>
          <span className="text-[14px] font-medium" style={{ color: b('fg-brand', m) }}>자세히 보기 ›</span>
          <div className="flex flex-wrap gap-2">
            <span style={{ ...btn, background: b('bg-brand-solid', m), color: '#FFFFFF' }}>{brand === 'desk' ? '결제하기' : '승인'}</span>
            <span style={{ ...btn, background: b('bg-brand-solid-pressed', m), color: '#FFFFFF' }}>눌림</span>
            <span style={{ ...btn, border: `1px solid ${b('stroke-brand-solid', m)}`, color: b('fg-brand', m), padding: '7px 13px' }}>보류</span>
          </div>
          <span className="rounded-lg px-3 py-2 text-[13px]" style={{ background: rc('bg-layer-default', m), outline: `2px solid ${b('stroke-focus-ring', m)}`, outlineOffset: 2, color: rc('fg-neutral', m) }}>포커스된 입력칸</span>
        </div>
      )}
    />
  );
}

export function NeutralExample() {
  return (
    <Pair
      caption="중립 역할 — 일반 콘텐츠. 글자는 neutral · muted · subtle 세 단계로 위계를 준다"
      tokens={['fg-neutral', 'fg-neutral-muted', 'fg-neutral-subtle', 'fg-placeholder', 'fg-disabled', 'bg-neutral-weak', 'bg-neutral-weak-alpha', 'bg-disabled', 'bg-neutral-inverted', 'fg-neutral-inverted']}
      render={(m) => (
        <div className="flex flex-col gap-3">
          {/* 회색 바닥 위 칩 — 투명한 bg-neutral-weak-alpha(v120). 불투명 약한 배경 · 비활성은 흰 표면(카드) 안에만(Elevation "바닥 위의 채움") */}
          <div className="flex gap-2">
            {['전체', '식비', '카페'].map((t) => (
              <span key={t} className="rounded-full px-3 py-1.5" style={{ ...ts('t4'), fontWeight: 500, background: rc('bg-neutral-weak-alpha', m), color: rc('fg-neutral', m) }}>{t}</span>
            ))}
          </div>
          {/* 글자 역할(Typography) — 줄 제목 R6(t5 · 400 · neutral) · 설명 문장 R7(t4 · muted) · 메타 R9(t3 · subtle) · 자리 글 R19(t4 · placeholder) */}
          <div className="flex flex-col gap-3" style={card(m)}>
            <div>
              <div style={{ ...ts('t5'), color: rc('fg-neutral', m) }}>점심 · 지어낸분식</div>
              <div style={{ ...ts('t4'), color: rc('fg-neutral-muted', m) }}>세 명이 나눠 냈어요</div>
              <div style={{ ...ts('t3'), color: rc('fg-neutral-subtle', m) }}>식비 · 카드 · 오늘 12:40</div>
            </div>
            <span className="rounded-lg px-3 py-2" style={{ ...ts('t4'), background: rc('bg-neutral-weak', m), color: rc('fg-placeholder', m) }}>검색어를 입력하세요</span>
            <div className="flex items-center gap-2">
              <span style={{ ...btn, background: rc('bg-disabled', m), color: rc('fg-disabled', m) }}>저장</span>
              <span style={{ ...btn, fontWeight: 500, background: rc('bg-neutral-inverted', m), color: rc('fg-neutral-inverted', m) }}>저장했어요</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}

const STATUS_WORD: Record<string, [string, string, string]> = {
  critical: ['실패', '결제에 실패했어요', '−32,400원'],
  positive: ['완료', '이체를 마쳤어요', '+1,200,000원'],
  warning: ['주의', '예산의 90% 를 썼어요', '마감 D-1'],
  informative: ['안내', '10월부터 청구일이 바뀌어요', '새 기능'],
};
export function StatusExample({ role }: { role: 'critical' | 'positive' | 'warning' | 'informative' }) {
  const [w, sentence, inline] = STATUS_WORD[role];
  return (
    <Pair
      caption={`${role} 역할 — 채움(solid)은 흰 글자, 약한 배경(weak)은 contrast 글자`}
      tokens={[`fg-${role}`, `fg-${role}-contrast`, `bg-${role}-solid`, `bg-${role}-solid-pressed`, `bg-${role}-weak`, `bg-${role}-weak-pressed`, `stroke-${role}-solid`]}
      render={(m) => {
        const weak = rc(`bg-${role}-weak`, m), ctr = rc(`fg-${role}-contrast`, m);
        return (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span style={{ ...badge, background: rc(`bg-${role}-solid`, m), color: '#FFFFFF' }}>{w}</span>
              <span style={{ ...badge, background: weak, color: ctr }}>{w}</span>
              <span className="text-[14px] font-bold" style={{ color: rc(`fg-${role}`, m) }}>{inline}</span>
            </div>
            <div className="rounded-lg px-3 py-2.5 text-[13px] font-medium" style={{ background: weak, color: ctr }}>
              {sentence} <span className="tabular-nums opacity-80">· {contrast(ctr, weak).toFixed(2)}:1</span>
            </div>
            {role === 'critical' && (
              <div>
                <span className="block rounded-lg px-3 py-2 text-[13px]" style={{ background: rc('bg-layer-default', m), border: `1px solid ${rc('stroke-critical-solid', m)}` }}>1234-5678</span>
                <span className="mt-1 block text-[12px]" style={{ color: rc('fg-critical', m) }}>카드 번호가 맞지 않아요</span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export function LayerExample() {
  return (
    <Pair
      caption="레이어 — 바닥(basement) 위에 기본 표면(default), 그 위에 뜨는 표면(floating)"
      tokens={['bg-layer-basement', 'bg-layer-default', 'bg-layer-default-pressed', 'bg-layer-floating', 'bg-layer-floating-pressed']}
      render={(m) => (
        <div className="relative h-[200px]">
          <span className="absolute left-0 top-0 text-[11px]" style={{ color: rc('fg-neutral-subtle', m) }}>basement</span>
          <div className="absolute left-0 right-10 top-5 overflow-hidden" style={{ ...card(m), padding: 0 }}>
            <div className="px-3.5 py-2.5 text-[13px]">default</div>
            <div className="px-3.5 py-2.5 text-[13px]" style={{ background: rc('bg-layer-default-pressed', m) }}>default · 눌림</div>
            <div className="px-3.5 py-2.5 text-[13px]">default</div>
          </div>
          <div className="absolute bottom-0 right-0 w-[150px] overflow-hidden rounded-xl shadow-lg" style={{ background: rc('bg-layer-floating', m), border: `1px solid ${rc('stroke-neutral-weak', m)}` }}>
            <div className="px-3 py-2 text-[13px]">floating</div>
            <div className="px-3 py-2 text-[13px]" style={{ background: rc('bg-layer-floating-pressed', m) }}>floating · 눌림</div>
          </div>
        </div>
      )}
    />
  );
}

export function StateExample() {
  const pairs: [string, string, string, string][] = [
    ['bg-layer-default', 'bg-layer-default-pressed', 'fg-neutral', '목록 줄'],
    ['bg-brand-solid', 'bg-brand-solid-pressed', 'static-white', '브랜드 채움'],
    ['bg-critical-weak', 'bg-critical-weak-pressed', 'fg-critical-contrast', '약한 오류'],
  ];
  return (
    <Pair
      caption="상태 — 누르는 동안 한 단계 짙은 pressed 값으로 바뀐다(웹 hover 도 같은 값)"
      tokens={['*-pressed']}
      render={(m) => (
        <div className="flex flex-col gap-2">
          {pairs.map(([a, b, f, lab]) => (
            <div key={a} className="grid grid-cols-2 gap-2 text-[13px] font-medium">
              <span className="rounded-lg px-3 py-2" style={{ background: rc(a, m), color: rc(f, m), border: a === 'bg-layer-default' ? `1px solid ${rc('stroke-neutral-weak', m)}` : undefined }}>{lab}</span>
              <span className="rounded-lg px-3 py-2" style={{ background: rc(b, m), color: rc(f, m), border: a === 'bg-layer-default' ? `1px solid ${rc('stroke-neutral-weak', m)}` : undefined }}>눌림</span>
            </div>
          ))}
        </div>
      )}
    />
  );
}

// ── 토큰 표 ────────────────────────────────────────────────
// 값 옆에 역할이 가리키는 팔레트 단계를 붙인다(v108)
function StepSwatch({ hex, step }: { hex?: string; step?: string }) {
  if (!hex || !step) return <Swatch hex={hex} />;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <Chip hex={hex} />
      <span className="flex flex-col leading-tight">
        <code className="text-[13px]">{hex.toUpperCase()}</code>
        <span className="text-[11px] text-fd-muted-foreground">{step.replace(/-dark$/, '')}</span>
      </span>
    </span>
  );
}

export function RoleTokenTable({ property }: { property: 'fg' | 'bg' | 'stroke' }) {
  const alias = roleAliases();
  const rows = roleColors('desk').filter((r) => (property === 'fg' ? /^(fg|static)-/ : new RegExp(`^${property}-`)).test(r.name) && !BRAND_ROLES.includes(r.name));
  return (
    <Table head={['토큰', '라이트', '다크', '옛 이름']} minWidth={620}>
      {rows.map((r) => (
        <tr key={r.name}>
          <td><Token>{r.name}</Token></td>
          <td><StepSwatch hex={r.light} step={colorStep(r.name)} /></td>
          <td><StepSwatch hex={r.dark ?? (r.name === 'static-white' ? r.light : undefined)} step={colorStep(`${r.name}-dark`)} /></td>
          <td className="text-fd-muted-foreground">{alias.get(r.name)?.old ?? '—'}</td>
        </tr>
      ))}
    </Table>
  );
}

export function BrandRoleTable() {
  const d = new Map(roleColors('desk').map((r) => [r.name, r]));
  const h = new Map(roleColors('hr').map((r) => [r.name, r]));
  return (
    <Table head={['토큰', 'Desk 라이트', 'Desk 다크', 'HR 라이트', 'HR 다크']} minWidth={720}>
      {BRAND_ROLES.map((n) => (
        <tr key={n}>
          <td><Token>{n}</Token></td>
          <td><StepSwatch hex={d.get(n)?.light} step={colorStep(n, 'desk')} /></td>
          <td><StepSwatch hex={d.get(n)?.dark} step={colorStep(`${n}-dark`, 'desk')} /></td>
          <td><StepSwatch hex={h.get(n)?.light} step={colorStep(n, 'hr')} /></td>
          <td><StepSwatch hex={h.get(n)?.dark} step={colorStep(`${n}-dark`, 'hr')} /></td>
        </tr>
      ))}
    </Table>
  );
}

// ── 팔레트 ─────────────────────────────────────────────────
// 가족 하나의 단계 띠 — 라이트는 라이트 표면 위에, 다크는 다크 표면 위에 그린다
export function PaletteRamp({ family, brand = 'shared' }: { family: string; brand?: Brand }) {
  const steps = palette(family, brand);
  const modes: [Mode, string][] = [['light', '라이트'], ['dark', '다크']];
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      {modes.map(([m, label]) => (
        <div key={m} className="px-3 py-3 sm:px-4" style={{ background: rc('bg-layer-default', m) }}>
          <span className="mb-2 block text-[12px] font-medium" style={{ color: rc('fg-neutral-subtle', m) }}>{label}</span>
          <div className="grid gap-[3px] sm:gap-1" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((s) => (
              <div key={s.step} className="flex min-w-0 flex-col items-center gap-1" title={`${family}-${s.step}${m === 'dark' ? '-dark' : ''} ${s[m]}`}>
                <span className="block h-10 w-full rounded-md" style={{ background: s[m], boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-subtle', m)}` }} />
                <span className="text-[10px] font-bold tabular-nums sm:text-[11px]" style={{ color: rc('fg-neutral', m) }}>{s.step}</span>
                <span className="hidden text-[10px] tabular-nums lg:block" style={{ color: rc('fg-neutral-subtle', m) }}>{s[m].slice(1).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// SEED Palette 의 토큰 표처럼 라이트 · 다크를 한 줄에
export function PaletteTokenTable({ families }: { families: string[] }) {
  const rows = families.flatMap((f) => palette(f).map((s) => ({ name: `${f}-${s.step}`, ...s })));
  return (
    <Table head={['토큰', '라이트', '다크']} minWidth={440}>
      {rows.map((r) => (
        <tr key={r.name}>
          <td><Token>{r.name}</Token></td>
          <td><Swatch hex={r.light} /></td>
          <td><Swatch hex={r.dark} /></td>
        </tr>
      ))}
    </Table>
  );
}

export function BrandPaletteTable() {
  const h = new Map(palette('brand', 'hr').map((s) => [s.step, s]));
  return (
    <Table head={['토큰', 'Desk 라이트', 'Desk 다크', 'HR 라이트', 'HR 다크']} minWidth={720}>
      {palette('brand', 'desk').map((s) => (
        <tr key={s.step}>
          <td><Token>{`brand-${s.step}`}</Token></td>
          <td><Swatch hex={s.light} /></td>
          <td><Swatch hex={s.dark} /></td>
          <td><Swatch hex={h.get(s.step)?.light} /></td>
          <td><Swatch hex={h.get(s.step)?.dark} /></td>
        </tr>
      ))}
    </Table>
  );
}

// ── 차트 ───────────────────────────────────────────────────
// v110 — 팔레트 단계(라이트 700 · 다크 800-dark). 색을 고르지 않은 항목이 받는 순서대로 그린다
export function ChartRamp() {
  const c = design('shared').front.colors;
  const modes: [Mode, string][] = [['light', '라이트'], ['dark', '다크']];
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      {modes.map(([m, label]) => (
        <div key={m} className="px-3 py-3 sm:px-4" style={{ background: rc('bg-layer-default', m) }}>
          <span className="mb-2 block text-[12px] font-medium" style={{ color: rc('fg-neutral-subtle', m) }}>{label}</span>
          <div className="grid gap-[3px] sm:gap-1" style={{ gridTemplateColumns: `repeat(${CHART_ORDER.length}, minmax(0, 1fr))` }}>
            {CHART_ORDER.map((h, i) => {
              const name = m === 'dark' ? `chart-${h}-dark` : `chart-${h}`;
              return (
                <div key={h} className="flex min-w-0 flex-col items-center gap-1" title={`${name} ${c[name]}`}>
                  <span className="block h-10 w-full rounded-md" style={{ background: c[name] }} />
                  <span className="text-[10px] font-bold tabular-nums sm:text-[11px]" style={{ color: rc('fg-neutral', m) }}>{i + 1}</span>
                  <span className="hidden text-[10px] lg:block" style={{ color: rc('fg-neutral-subtle', m) }}>{h}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContrastNote({ fg, bg, brand = 'desk' }: { fg: string; bg: string; brand?: Brand }) {
  const a = color(fg, brand), b = color(bg, brand);
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Chip hex={a} size={12} /> on <Chip hex={b} size={12} /> <b className="tabular-nums">{contrast(a, b).toFixed(2)}:1</b>
    </span>
  );
}

export function ChartTable() {
  const c = design('shared').front.colors;
  return (
    <Table head={['토큰', '라이트', '다크']} minWidth={480}>
      {CHART_ORDER.map((h) => (
        <tr key={h}>
          <td><Token>{`chart-${h}`}</Token></td>
          <td><StepSwatch hex={c[`chart-${h}`]} step={colorStep(`chart-${h}`)} /></td>
          <td><StepSwatch hex={c[`chart-${h}-dark`]} step={colorStep(`chart-${h}-dark`)} /></td>
        </tr>
      ))}
    </Table>
  );
}

// v111 — 카테고리 옅은 바탕: 작은 면(weak) 위 아이콘 · 글자, 넓은 면(subtle) 메모 카드
const TINT_TILES: [string, string][] = [['식', 'red'], ['주', 'green'], ['카', 'orange'], ['생', 'blue'], ['교', 'yellow'], ['쇼', 'indigo'], ['건', 'pink'], ['문', 'violet'], ['부', 'brown'], ['기', 'gray']];
export function ChartTintExample() {
  const c = design('shared').front.colors;
  const v = (name: string, m: Mode) => c[m === 'dark' ? `${name}-dark` : name];
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      {(['light', 'dark'] as Mode[]).map((m) => (
        <div key={m} className="flex flex-col gap-3 rounded-xl border border-fd-border p-4" style={{ background: rc('bg-layer-default', m), color: rc('fg-neutral', m) }}>
          <span className="text-[12px] font-medium" style={{ color: rc('fg-neutral-subtle', m) }}>{m === 'dark' ? '다크' : '라이트'}</span>
          <div className="flex flex-wrap gap-1.5">
            {TINT_TILES.map(([t, h]) => (
              <span key={h} className="grid h-8 w-8 place-items-center rounded-[9px] text-[13px] font-bold" style={{ background: v(`chart-${h}-weak`, m), color: v(`chart-${h}`, m) }}>{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {([['팀 회의', 'blue'], ['병원', 'pink'], ['월세 이체', 'green'], ['친구 생일', 'orange']] as [string, string][]).map(([t, h]) => (
              <span key={t} className="rounded-md px-2 py-0.5 text-[12px] font-bold" style={{ background: v(`chart-${h}-weak`, m), color: v(`chart-${h}-contrast`, m) }}>{t}</span>
            ))}
          </div>
          <div className="flex flex-col gap-0.5 rounded-xl px-3.5 py-3 text-[13.5px]" style={{ background: v('chart-yellow-subtle', m) }}>
            <b className="text-[14.5px]">장보기</b>
            <span>우유 · 달걀 · 양파</span>
            <span className="text-[12px] font-bold" style={{ color: v('chart-yellow-contrast', m) }}>#노랑</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartTintTable() {
  const c = design('shared').front.colors;
  return (
    <Table head={['색', 'weak(작은 면)', 'subtle(넓은 면)', 'contrast(글자)']} minWidth={760}>
      {CHART_ORDER.map((h) => (
        <tr key={h}>
          <td><Token>{`chart-${h}`}</Token></td>
          {(['weak', 'subtle', 'contrast'] as const).map((k) => (
            <td key={k}>
              <div className="flex flex-col gap-1">
                <StepSwatch hex={c[`chart-${h}-${k}`]} step={colorStep(`chart-${h}-${k}`)} />
                <StepSwatch hex={c[`chart-${h}-${k}-dark`]} step={colorStep(`chart-${h}-${k}-dark`)} />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </Table>
  );
}
