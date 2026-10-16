// Feedback 페이지 — 눌림 색은 DESIGN*.md 의 역할 색, 축소 상수 · 시간은 "눌림 피드백" 표 · motion 표,
// 예로 드는 요소의 크기는 컴포넌트 YAML 에서 온다
import type { CSSProperties, ReactNode } from 'react';
import { color, design, pressScale, proseTokenSet, proseValue, px, roleColors, sectionCode, specDefault, specPartSize, specSize, type Brand } from '@/lib/design-tokens';
import { Figure, Panel, Swatch, Table, Token, Verdict } from './ui';
import { PressDemo } from './press-demo';
import { menuKit } from '../specs/menu-look';
import { MenuPanel } from '../specs/menu-view';
import { cardFace } from '../specs/card-face';

type Mode = 'light' | 'dark';
const rc = (name: string, mode: Mode = 'light', brand: Brand = 'desk') => (name === 'static-white' ? color(name, brand) : color(mode === 'dark' ? `${name}-dark` : name, brand));
const r3 = (n: number) => n.toFixed(3);
const r1 = (n: number) => `${Number(n.toFixed(2))}px`;

// 켜진 Switch — switch.yaml 의 기본 크기에서 트랙 · 엄지를 읽어 그린다(켜짐 = 짙은 회색, 엄지는 오른쪽)
function switchOn() {
  const size = specDefault('switch', 'size');
  const mark = specPartSize('switch', { size }, 'switchmark');
  const thumb = specPartSize('switch', { size }, 'thumb');
  const tw = mark.width ?? mark.height, th = mark.height, knob = thumb.height;
  const pad = (th - knob) / 2;
  const body = (
    <span className="relative block rounded-full" style={{ width: tw, height: th, background: rc('bg-neutral-inverted') }}>
      <span className="absolute rounded-full" style={{ right: pad, top: pad, width: knob, height: knob, background: rc('fg-neutral-inverted') }} />
    </span>
  );
  return { tw, th, body };
}

// 예시 화면 폭 — 375 폭 휴대폰에서 좌우 여백(spacing-global-gutter)을 뺀 전체 폭, 태블릿(breakpoint-md)에서 layout-margin 을 뺀 전체 폭
const PHONE = 375;
function widths() {
  const gutter = px(design().front.spacing['global-gutter']);
  const md = px(proseValue('breakpoint-md'));
  const margin = px(proseValue('layout-margin'));
  return { mobile: PHONE - gutter * 2, tablet: md - margin * 2 };
}

// 원래 크기를 점선으로 두고 그 안에서 줄어든 모습
function Shrunk({ w, h, radius = 8, children, style, dashed = true }: { w: number; h: number; radius?: number; children?: ReactNode; style: CSSProperties; dashed?: boolean }) {
  const { ratio } = pressScale();
  return (
    <span className="relative inline-flex shrink-0" style={{ width: w, height: h }}>
      {dashed && <span className="absolute inset-0 border border-dashed" style={{ borderRadius: radius, borderColor: rc('stroke-neutral-solid') }} />}
      <span className="flex h-full w-full items-center justify-center" style={{ borderRadius: radius, transform: `scale(${ratio(w, h)})`, ...style }}>
        {children}
      </span>
    </span>
  );
}
function Plain({ w, h, radius = 8, children, style }: { w: number; h: number; radius?: number; children?: ReactNode; style: CSSProperties }) {
  return (
    <span className="flex shrink-0 items-center justify-center" style={{ width: w, height: h, borderRadius: radius, ...style }}>
      {children}
    </span>
  );
}
function Cap({ children }: { children: ReactNode }) {
  return <span className="text-center text-[12px] leading-4 text-[#62697A]">{children}</span>;
}

// ── Overview ─────────────────────────────────────────────
export function FeedbackElementsFigure() {
  const lg = specSize('button', 'large');
  const brand = { background: rc('bg-brand-solid'), color: rc('static-white') };
  const pressed = { background: rc('bg-brand-solid-pressed'), color: rc('static-white') };
  const card = 'flex w-[168px] flex-col items-center gap-3 rounded-xl bg-white px-3 pb-4 pt-6';
  return (
    <Figure caption="누름을 알리는 세 가지 — 색은 기본, 크기는 짜임이 허락할 때, 햅틱은 기준이 생기면">
      <div className="flex gap-3">
        <div className={card}>
          <div className="flex gap-2">
            <Plain w={60} h={lg.height} style={{ ...brand, fontSize: 13, fontWeight: 700 }}>기본</Plain>
            <Plain w={60} h={lg.height} style={{ ...pressed, fontSize: 13, fontWeight: 700 }}>눌림</Plain>
          </div>
          <b className="text-[14px] text-[#1A1F2E]">색</b>
          <Cap>누르는 동안 표면 색이 바뀐다</Cap>
        </div>
        <div className={card}>
          <Shrunk w={128} h={lg.height} style={{ ...pressed, fontSize: 13, fontWeight: 700 }}>눌림</Shrunk>
          <b className="text-[14px] text-[#1A1F2E]">크기</b>
          <Cap>누르는 동안 정해진 거리만큼 작아진다</Cap>
        </div>
        <div className={card}>
          <span className="relative flex h-12 w-7 items-center justify-center rounded-md border-2" style={{ borderColor: rc('fg-neutral-muted') }}>
            <span className="absolute -left-3 text-[13px]" style={{ color: rc('fg-neutral-subtle') }}>((</span>
            <span className="absolute -right-3 text-[13px]" style={{ color: rc('fg-neutral-subtle') }}>))</span>
          </span>
          <b className="text-[14px] text-[#1A1F2E]">햅틱</b>
          <Cap>누른 순간 손끝에 진동이 온다 — 기준이 생기면 적는다</Cap>
        </div>
      </div>
    </Figure>
  );
}

export function FeedbackTimingTable() {
  const rows = [
    ...proseTokenSet('motion-duration-', /^motion-duration-(color-transition|pressed-scale)$/),
    ...proseTokenSet('motion-ease-', /^motion-ease-pressed-scale$/),
  ];
  return (
    <Table head={['토큰', '값', '쓰는 곳']} minWidth={520}>
      {rows.map((r) => (
        <tr key={r.name}>
          <td><Token>{r.name}</Token></td>
          <td className="whitespace-nowrap tabular-nums">{r.value}</td>
          <td className="text-fd-muted-foreground">{r.note.replace(/`/g, '')}</td>
        </tr>
      ))}
    </Table>
  );
}

// ── Color ────────────────────────────────────────────────
export function PressColorFigure() {
  const lg = specSize('button', 'large');
  const label = { color: rc('static-white'), fontSize: 15, fontWeight: 700 };
  return (
    <Figure caption="기본과 눌림 — 표면 색만 bg-brand-solid 에서 bg-brand-solid-pressed 로 바뀌고 글자 색은 그대로다">
      <div className="flex gap-10 rounded-xl bg-white px-10 py-8">
        {[
          ['기본', 'bg-brand-solid'],
          ['눌림', 'bg-brand-solid-pressed'],
        ].map(([lab, bg]) => (
          <div key={bg} className="flex flex-col items-center gap-3">
            <Plain w={180} h={lg.height} style={{ ...label, background: rc(bg) }}>저장</Plain>
            <b className="text-[13px] text-[#1A1F2E]">{lab}</b>
            <code className="text-[12px] text-[#62697A]">{bg}</code>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// 메모 줄의 메뉴(menu.yaml — 알약 · 줄 · 글자 · 아이콘) — 가운데 줄을 누르는 순간. 나쁜 예는 글자 · 아이콘까지 흐려진다
function Menu({ pressedText }: { pressedText: boolean }) {
  const faded: CSSProperties = { color: rc('fg-disabled') };
  return (
    <MenuPanel
      look={menuKit('desk').menu}
      mode="light"
      groups={[{ items: [{ value: 'pin', label: '고정', icon: 'pin' }, { value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy' }, { value: 'edit', label: '수정', icon: 'pencil' }] }]}
      states={{ duplicate: 'pressed' }}
      marks={pressedText ? { items: { duplicate: { label: faded, icon: faded } } } : undefined}
    />
  );
}
export function SurfaceOnlyFigure() {
  return (
    <Figure>
      <div className="flex w-[540px] gap-4">
        <Verdict ok note="표면 색만 바뀌고 글자 · 아이콘 색은 그대로다">
          <Menu pressedText={false} />
        </Verdict>
        <Verdict ok={false} note="글자 · 아이콘까지 흐려지면 다른 요소로 바뀐 것처럼 읽힌다">
          <Menu pressedText />
        </Verdict>
      </div>
    </Figure>
  );
}

export function GhostFigure() {
  const row = (m: Mode, surface: string, pressed: string, where: string) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px]" style={{ color: rc('fg-neutral-subtle', m) }}>{where}</span>
      <div className="flex items-center gap-2 rounded-xl p-2" style={{ background: rc(surface, m), boxShadow: surface === 'bg-layer-floating' ? proseValue(m === 'dark' ? 'shadow-s2-dark' : 'shadow-s2') : undefined }}>
        <Plain w={92} h={36} style={{ color: rc('fg-neutral', m), fontSize: 13, fontWeight: 700 }}>기본</Plain>
        <Plain w={92} h={36} style={{ color: rc('fg-neutral', m), fontSize: 13, fontWeight: 700, background: rc(pressed, m) }}>눌림</Plain>
      </div>
      <code className="text-[11px]" style={{ color: rc('fg-neutral-subtle', m) }}>{pressed}</code>
    </div>
  );
  return (
    <Figure caption="평소 배경이 없는 ghost 버튼 — 누르는 동안 표면이 생긴다. 다크에서는 놓인 층에 따라 눌림 색이 다르다">
      <div className="flex gap-4">
        {(['light', 'dark'] as Mode[]).map((m) => (
          <div key={m} className="flex w-[250px] flex-col gap-4 rounded-2xl p-4" style={{ background: rc('bg-layer-basement', m) }}>
            <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', m) }}>{m === 'light' ? '라이트' : '다크'}</span>
            {row(m, 'bg-layer-default', 'bg-layer-default-pressed', '화면 위')}
            {row(m, 'bg-layer-floating', 'bg-layer-floating-pressed', '떠 있는 표면(메뉴 · 플로팅 버튼) 위')}
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function NoColorFigure() {
  const { tw, th, body } = switchOn();
  const sw = (pressed: boolean) => (pressed ? <Shrunk w={tw} h={th} radius={th} style={{}}>{body}</Shrunk> : <Plain w={tw} h={th} radius={th} style={{}}>{body}</Plain>);
  const tabs = (pressed: boolean) => (
    <div className="flex gap-1 border-b" style={{ borderColor: rc('stroke-neutral-weak') }}>
      {['지출', '수입', '이체'].map((t, i) => {
        const sel = i === 0;
        const text = <span className="text-[14px] font-bold" style={{ color: sel ? rc('fg-neutral') : rc('fg-neutral-subtle') }}>{t}</span>;
        const cell = pressed && i === 1 ? <Shrunk w={52} h={36} radius={6} style={{}}>{text}</Shrunk> : <Plain w={52} h={36} style={{}}>{text}</Plain>;
        return (
          <div key={t} className="relative">
            {cell}
            {sel && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full" style={{ background: rc('fg-neutral') }} />}
          </div>
        );
      })}
    </div>
  );
  const col = (title: string, a: ReactNode, b: ReactNode, width: number) => (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-4 pb-4 pt-6" style={{ width }}>
      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">{a}<Cap>기본</Cap></div>
        <div className="flex flex-col items-center gap-2">{b}<Cap>눌림</Cap></div>
      </div>
      <b className="text-[13px] text-[#1A1F2E]">{title}</b>
    </div>
  );
  return (
    <Figure caption="색이 이미 상태를 뜻하는 요소 — 누르는 동안 색은 그대로 두고 크기만 준다. 선택은 손을 뗀 뒤에 바뀐다">
      <div className="flex gap-4">
        {col('Switch — 켜짐 색 그대로', sw(false), sw(true), 170)}
        {col('Tabs — 선택 표시 그대로', tabs(false), tabs(true), 390)}
      </div>
    </Figure>
  );
}

export function PressedTokenTable() {
  const shared = roleColors('desk').filter((r) => r.name.endsWith('-pressed') && !r.name.includes('brand'));
  const brandRows = (['desk', 'hr'] as Brand[]).flatMap((b) =>
    roleColors(b)
      .filter((r) => r.name.endsWith('-pressed') && r.name.includes('brand'))
      .map((r) => ({ ...r, brand: b, base: roleColors(b).find((x) => x.name === r.name.replace(/-pressed$/, '')) })),
  );
  const all = roleColors('desk');
  const pair = (a?: string, b?: string) => (
    <span className="inline-flex items-center gap-1.5">
      <Swatch hex={a} /> <span className="text-fd-muted-foreground">→</span> <Swatch hex={b} />
    </span>
  );
  return (
    <Table head={['눌림 토큰', '기본 짝', '라이트 (기본 → 눌림)', '다크 (기본 → 눌림)']} minWidth={860}>
      {shared.map((r) => {
        const base = all.find((x) => x.name === r.name.replace(/-pressed$/, ''));
        return (
          <tr key={r.name}>
            <td><Token>{r.name}</Token></td>
            <td><Token>{base?.name ?? '—'}</Token></td>
            <td>{pair(base?.light, r.light)}</td>
            <td>{pair(base?.dark, r.dark)}</td>
          </tr>
        );
      })}
      {brandRows.map((r) => (
        <tr key={`${r.brand}-${r.name}`}>
          <td><Token>{r.name}</Token> <span className="text-[12px] text-fd-muted-foreground">{r.brand === 'desk' ? 'Desk' : 'HR'}</span></td>
          <td><Token>{r.base?.name ?? '—'}</Token></td>
          <td>{pair(r.base?.light, r.light)}</td>
          <td>{pair(r.base?.dark, r.dark)}</td>
        </tr>
      ))}
    </Table>
  );
}

// ── Scale ────────────────────────────────────────────────
export function ScaleHeroFigure() {
  const lg = specSize('button', 'large');
  const { ratio, distance, widthDivisor } = pressScale();
  const w = lg.height * widthDivisor - 12; // 폭 ÷ 4 가 높이보다 작게 — 기준 길이가 높이라 세로로 축소량만큼 준다
  const style = { background: rc('bg-brand-solid-pressed'), color: rc('static-white'), fontSize: 15, fontWeight: 700 };
  return (
    <Figure caption={`눌린 쪽은 점선의 원래 크기보다 작다 — 세로로 ${distance}px, 이 버튼에서 배율 ${r3(ratio(w, lg.height))}`}>
      <div className="flex gap-10 rounded-xl bg-white px-10 py-8">
        <div className="flex flex-col items-center gap-3">
          <Plain w={w} h={lg.height} style={{ ...style, background: rc('bg-brand-solid') }}>저장</Plain>
          <Cap>기본</Cap>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Shrunk w={w} h={lg.height} style={style}>저장</Shrunk>
          <Cap>눌림</Cap>
        </div>
      </div>
    </Figure>
  );
}

export function FixedRatioTable() {
  const h = specSize('button', 'large').height;
  const { distance } = pressScale();
  // 큰 버튼이 세로로 축소량만큼 줄도록 맞춘 배율 — 이것을 모든 요소에 똑같이 준다면
  const exact = (h - distance) / h;
  const fixed = Number(r3(exact));
  const { mobile, tablet } = widths();
  const rows: [string, number][] = [
    ['짧은 버튼', 80],
    ['버튼', 160],
    ['휴대폰 전체 폭', mobile],
    ['태블릿 전체 폭', tablet],
  ];
  return (
    <>
      <Table head={['요소 (폭 × 높이)', '고정 배율', '가로 축소', '세로 축소']} minWidth={560}>
        {rows.map(([n, w]) => (
          <tr key={n}>
            <td className="whitespace-nowrap">{n} <span className="tabular-nums text-fd-muted-foreground">{w} × {h}</span></td>
            <td className="tabular-nums">{fixed}</td>
            <td className="tabular-nums">{r1(w * (1 - exact))}</td>
            <td className="tabular-nums">{r1(h * (1 - exact))}</td>
          </tr>
        ))}
      </Table>
      <p className="-mt-2 text-sm text-fd-muted-foreground">
        고정 배율 {fixed} 은 높이 {h} 버튼이 세로로 {distance}px 줄도록 맞춘 값이다. 이 배율을 모든 요소에 똑같이 주면 세로로는 모두 같게 줄지만 가로로 줄어드는 양은 {Math.round(tablet / 80)}배까지 벌어지고, 화면이 넓을수록 커진다.
      </p>
    </>
  );
}

export function ScaleFormula() {
  return (
    <pre className="not-prose my-6 overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary/50 px-5 py-4 text-[14px] leading-6">
      <code>{sectionCode('눌림 피드백')}</code>
    </pre>
  );
}

export function BasisFigure() {
  const md = specSize('button', 'medium');
  const { ratio, distance } = pressScale();
  const tall = 100; // 예 — 높이 100 의 카드형 버튼
  const style = { background: rc('bg-brand-weak-pressed'), color: rc('fg-brand-contrast'), fontSize: 14, fontWeight: 700 };
  return (
    <Figure caption={`같은 ${distance}px 이라도 요소가 클수록 배율은 1 에 가깝다`}>
      <div className="flex items-end gap-10 rounded-xl bg-white px-10 py-8">
        {[
          [140, md.height, `높이 ${md.height} 버튼`],
          [140, tall, `높이 ${tall} 카드`],
        ].map(([w, h, lab]) => (
          <div key={String(lab)} className="flex flex-col items-center gap-3">
            <Shrunk w={Number(w)} h={Number(h)} style={style}>{`× ${r3(ratio(Number(w), Number(h)))}`}</Shrunk>
            <Cap>{lab}</Cap>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function ScaleResultTable() {
  const { basis, ratio, widthDivisor, minBasis } = pressScale();
  const icon = specSize('button', 'medium', 'enabled', 'iconOnly');
  const btn = specSize('button', 'small');
  const lg = specSize('button', 'large');
  const check = specPartSize('checkbox', { size: 'medium' }, 'checkmark');
  const { mobile } = widths();
  const rows: [string, number, number][] = [
    ['아이콘 버튼', icon.width ?? icon.height, icon.height],
    ['버튼', 88, btn.height],
    ['가로로 긴 버튼', mobile, lg.height],
    ['목록 줄', PHONE, 56],
    ['체크박스', check.width ?? check.height, check.height],
  ];
  const by = (w: number, h: number) => {
    const b = basis(w, h);
    return b === h ? '높이' : b === minBasis ? `최소 ${minBasis}` : `폭 ÷ ${widthDivisor}`;
  };
  return (
    <Table head={['요소', '크기 (폭 × 높이)', '기준 길이', '배율', '실제 축소']} minWidth={620}>
      {rows.map(([n, w, h]) => (
        <tr key={n}>
          <td className="whitespace-nowrap">{n}</td>
          <td className="tabular-nums">{w} × {h}</td>
          <td className="whitespace-nowrap">{by(w, h)} <span className="tabular-nums text-fd-muted-foreground">{Math.round(basis(w, h) * 10) / 10}</span></td>
          <td className="tabular-nums">{r3(ratio(w, h))}</td>
          <td className="whitespace-nowrap tabular-nums">가로 {r1(w * (1 - ratio(w, h)))}, 세로 {r1(h * (1 - ratio(w, h)))}</td>
        </tr>
      ))}
    </Table>
  );
}

export function CenterFigure() {
  const lg = specSize('button', 'large');
  const w = 180;
  const line = rc('fg-critical');
  return (
    <Figure caption="축소는 늘 요소의 정가운데를 기준으로 일어난다">
      <div className="rounded-xl bg-white px-12 py-8">
        <span className="relative inline-flex">
          <Shrunk w={w} h={lg.height} style={{ background: rc('bg-brand-solid-pressed'), color: rc('static-white'), fontSize: 15, fontWeight: 700 }}>
            <span className="opacity-60">저장</span>
          </Shrunk>
          <span className="absolute inset-x-[-16px] top-1/2 h-px" style={{ background: line }} />
          <span className="absolute inset-y-[-16px] left-1/2 w-px" style={{ background: line }} />
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: line }} />
        </span>
      </div>
    </Figure>
  );
}

function Row({ pressed, label, amount, mode = 'light' }: { pressed?: boolean; label: string; amount: string; mode?: Mode }) {
  const { ratio } = pressScale();
  const h = 56;
  const inner = (
    <span className="flex w-full items-center gap-3 px-4">
      <span className="block h-8 w-8 shrink-0 rounded-full" style={{ background: rc('bg-brand-weak', mode) }} />
      <span className="flex-1 text-[14px]" style={{ color: rc('fg-neutral', mode) }}>{label}</span>
      <span className="text-[14px] tabular-nums" style={{ color: rc('fg-neutral-subtle', mode) }}>{amount}</span>
    </span>
  );
  return (
    <div className="flex items-center" style={{ height: h, background: pressed ? rc('bg-layer-default-pressed', mode) : rc('bg-layer-default', mode), borderBottom: `1px solid ${rc('stroke-neutral-weak', mode)}` }}>
      <span className="flex w-full" style={{ transform: pressed ? `scale(${ratio(PHONE, h)})` : undefined }}>{inner}</span>
    </div>
  );
}
export function NoShiftFigure() {
  const guide = rc('fg-critical');
  return (
    <Figure caption="가운데 줄을 눌러도 위아래 줄의 자리는 그대로다 — 줄어든 만큼 주변이 당겨지지 않는다">
      <div className="relative w-[340px] overflow-hidden rounded-xl bg-white">
        <Row label="점심 식비" amount="12,000원" />
        <Row pressed label="버스" amount="1,500원" />
        <Row label="커피" amount="4,800원" />
        {[56, 112].map((y) => (
          <span key={y} className="absolute inset-x-0 border-t border-dashed" style={{ top: y, borderColor: guide }} />
        ))}
      </div>
    </Figure>
  );
}

export function SurfaceTargetFigure() {
  const lg = specSize('button', 'large');
  const link = rc('fg-brand');
  return (
    <Figure>
      <div className="flex w-[540px] gap-4">
        <Verdict ok note="면으로 잡히는 요소 — 원래 크기보다 작아진다">
          <Shrunk w={170} h={lg.height} style={{ background: rc('bg-brand-solid-pressed'), color: rc('static-white'), fontSize: 15, fontWeight: 700 }}>다음</Shrunk>
        </Verdict>
        <Verdict ok={false} note="줄바꿈되는 글 속 링크를 줄이면 글자 크기가 바뀐 것처럼 보인다">
          <p className="w-[200px] text-[14px] leading-6 text-[#1A1F2E]">
            카드 결제일은{' '}
            <span className="inline-block underline" style={{ color: link, transform: 'scale(0.9)' }}>설정에서</span> 바꿀 수 있어요. 바꾸면 다음 달부터 적용돼요.
          </p>
        </Verdict>
      </div>
    </Figure>
  );
}

export function SubActionsFigure() {
  const { ratio } = pressScale();
  const { body } = switchOn();
  const row = (
    <div className="w-[240px] overflow-hidden rounded-xl" style={{ background: rc('bg-layer-default-pressed') }}>
      <div className="flex h-14 items-center gap-3 px-4" style={{ transform: `scale(${ratio(240, 56)})` }}>
        <span className="flex-1 text-[14px] text-[#1A1F2E]">결제일 알림</span>
        {body}
      </div>
    </div>
  );
  const icon = specSize('button', 'medium', 'enabled', 'iconOnly');
  const card = (
    // 카드 — card.yaml 의 면(1px stroke-neutral-weak · 모서리 16 · 여백 24), 회색 바닥 위
    <div className="w-[240px]" style={{ background: rc('bg-layer-default'), border: `1px solid ${rc('stroke-neutral-weak')}`, borderRadius: cardFace().radius, padding: cardFace().pad }}>
      <div className="flex items-start justify-between">
        <span className="text-[14px] font-bold text-[#1A1F2E]">9월 가계부 정리</span>
        <Plain w={icon.height - 12} h={icon.height - 12} style={{ color: rc('fg-neutral-subtle'), fontSize: 16 }}>✕</Plain>
      </div>
      <p className="mt-1 text-[12px] text-[#62697A]">고정 지출을 한 번 더 확인해요</p>
      <div className="mt-3 flex gap-2">
        <Shrunk w={60} h={32} radius={16} style={{ background: rc('bg-neutral-weak-pressed'), color: rc('fg-neutral'), fontSize: 12, fontWeight: 700 }}>♡ 저장</Shrunk>
        <Plain w={60} h={32} radius={16} style={{ background: rc('bg-neutral-weak'), color: rc('fg-neutral'), fontSize: 12, fontWeight: 700 }}>공유</Plain>
      </div>
    </div>
  );
  return (
    <Figure caption="왼쪽 — 스위치가 그 줄의 설정을 바꾸므로 어디를 눌러도 줄 전체가 반응한다 / 오른쪽 — 닫기 · 저장 · 공유는 대등하므로 누른 버튼만 반응한다">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-5">{row}<Cap>딸린 동작 — 줄 전체</Cap></div>
        <div className="flex flex-col items-center gap-3 rounded-xl p-5" style={{ background: rc('bg-layer-basement') }}>{card}<Cap>대등한 동작 — 누른 것만</Cap></div>
      </div>
    </Figure>
  );
}

export function RootContentFigure() {
  const { tw, th, body: knob } = switchOn();
  return (
    <Figure caption="Root Scale — 요소 전체가 준다 / Content Scale — 배경은 그대로 두고 안쪽만 준다">
      <div className="flex gap-4">
        <div className="flex w-[200px] flex-col items-center gap-4 rounded-xl bg-white px-4 pb-4 pt-8">
          <div className="flex items-center gap-6">
            <Plain w={tw} h={th} radius={th} style={{}}>{knob}</Plain>
            <Shrunk w={tw} h={th} radius={th} style={{}}>{knob}</Shrunk>
          </div>
          <b className="text-[13px] text-[#1A1F2E]">Root Scale</b>
          <Cap>버튼 · 스위치처럼 배경과 안이 한 면인 요소</Cap>
        </div>
        <div className="flex w-[330px] flex-col items-center gap-4 rounded-xl bg-white px-4 pb-4 pt-5">
          <div className="w-full overflow-hidden rounded-lg border" style={{ borderColor: rc('stroke-neutral-weak') }}>
            <Row label="점심 식비" amount="12,000원" />
            <Row pressed label="버스" amount="1,500원" />
          </div>
          <b className="text-[13px] text-[#1A1F2E]">Content Scale</b>
          <Cap>목록 줄 · 아코디언처럼 배경이 폭을 채우는 요소 — 통째로 줄이면 정렬 · 여백 · 모서리가 어긋난다</Cap>
        </div>
      </div>
    </Figure>
  );
}

export function StatesFigure() {
  const btn = specSize('button', 'small');
  const w = 120;
  const col = (title: string, note: string, el: ReactNode) => (
    <div className="flex w-[170px] flex-col items-center gap-3 rounded-xl bg-white px-3 pb-4 pt-7">
      <div className="flex h-12 items-center">{el}</div>
      <b className="text-[13px] text-[#1A1F2E]">{title}</b>
      <Cap>{note}</Cap>
    </div>
  );
  return (
    <Figure caption="다른 상태에서 눌렀을 때 — 선택된 요소는 준다, 불러오는 중 · 비활성은 줄지 않는다">
      <div className="flex gap-3">
        {col('선택됨', '줄고, 선택 색은 그대로', (
          <Shrunk w={w} h={btn.height} radius={btn.height} style={{ background: rc('bg-brand-weak-pressed'), color: rc('fg-brand-contrast'), fontSize: 13, fontWeight: 700 }}>✓ 식비</Shrunk>
        ))}
        {col('불러오는 중', '줄지 않는다 — 입력을 받지 않는다', (
          <Plain w={w} h={btn.height} style={{ background: rc('bg-brand-solid'), color: rc('static-white'), fontSize: 13 }}>
            <span className="block h-4 w-4 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.35)', borderTopColor: rc('static-white') }} />
          </Plain>
        ))}
        {col('비활성', '줄지 않는다 — 누름에 반응하지 않는다', (
          <Plain w={w} h={btn.height} style={{ background: rc('bg-disabled'), color: rc('fg-disabled'), fontSize: 13, fontWeight: 700 }}>저장</Plain>
        ))}
      </div>
    </Figure>
  );
}

export function PressPlayground() {
  const { distance, widthDivisor, minBasis } = pressScale();
  const t = {
    scaleMs: parseFloat(proseValue('motion-duration-pressed-scale')),
    scaleEase: proseValue('motion-ease-pressed-scale'),
    colorMs: parseFloat(proseValue('motion-duration-color-transition')),
    colorEase: proseValue('motion-ease-easing'),
  };
  const colors = {
    brand: rc('bg-brand-solid'),
    brandPressed: rc('bg-brand-solid-pressed'),
    onBrand: rc('static-white'),
    layer: rc('bg-layer-default'),
    layerPressed: rc('bg-layer-default-pressed'),
    fg: rc('fg-neutral'),
    subtle: rc('fg-neutral-subtle'),
    line: rc('stroke-neutral-weak'),
    weak: rc('bg-brand-weak'),
    weakPressed: rc('bg-brand-weak-pressed'),
  };
  const heights = { icon: specSize('button', 'medium', 'enabled', 'iconOnly').height, button: specSize('button', 'small').height, wide: specSize('button', 'large').height, row: 56 };
  return (
    <Panel caption="눌러 보는 판 — 누르는 동안의 배율은 요소의 실제 크기에서 계산한다">
      <PressDemo c={{ distance, widthDivisor, minBasis }} t={t} colors={colors} heights={heights} />
    </Panel>
  );
}
