// Elevation 페이지 — 층 색은 역할 색(bg-layer-*), 그림자 · 딤은 DESIGN.md 의 prose 토큰, 층 이름은 "쌓임 맥락" 표에서 온다
import type { CSSProperties, ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { color, contrast, proseValue, roleAliases, roleColors, sectionTable, type Brand } from '@/lib/design-tokens';
import { Figure, Swatch, Table, Token } from './ui';

type Mode = 'light' | 'dark';
const rc = (name: string, mode: Mode = 'light', brand: Brand = 'desk') => (name === 'static-white' ? color(name, brand) : color(mode === 'dark' ? `${name}-dark` : name, brand));
const shadow = (n: 1 | 2 | 3 | 4, mode: Mode = 'light') => proseValue(`shadow-s${n}${mode === 'dark' ? '-dark' : ''}`);
const dim = (mode: Mode = 'light') => proseValue(mode === 'dark' ? 'overlay-dim-dark' : 'overlay-dim-light');

// "쌓임 맥락 — Global · Local" 의 두 표 — 층 번호 · 무엇 · groo
function levels(n: 0 | 1) {
  return sectionTable('쌓임 맥락', n).rows.map((r) => ({ level: r[0], what: r[1], token: r[2].replace(/`/g, '') }));
}
const head = (what: string) => what.split(' — ')[0];

function Cap({ children }: { children: ReactNode }) {
  return <span className="text-center text-[12px] leading-4 text-[#62697A]">{children}</span>;
}

// ── 휴대폰 틀과 화면 조각 ─────────────────────────────────
const PW = 116, PH = 210;
function Phone({ children, mode = 'light', w = PW, h = PH }: { children: ReactNode; mode?: Mode; w?: number; h?: number }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-[16px] border border-black/10" style={{ width: w, height: h, background: rc('bg-layer-basement', mode) }}>
      {children}
    </div>
  );
}
const HL: CSSProperties = { outline: `2px solid ${color('stroke-brand-solid')}`, outlineOffset: 1 };
function Nav({ mode = 'light', style }: { mode?: Mode; style?: CSSProperties }) {
  return (
    <div className="absolute inset-x-0 top-0 flex h-7 items-center px-2.5" style={{ background: rc('bg-layer-default', mode), ...style }}>
      <span className="block h-1.5 w-10 rounded" style={{ background: rc('fg-neutral', mode) }} />
    </div>
  );
}
function Cards({ mode = 'light', faded = false, style, top = 36 }: { mode?: Mode; faded?: boolean; style?: CSSProperties; top?: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute left-2 right-2 rounded-lg p-2" style={{ top: top + i * 50, height: 42, background: rc('bg-layer-default', mode), borderWidth: 1, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', mode), opacity: faded ? 0.35 : 1, ...style }}>
          <span className="block h-1.5 w-12 rounded" style={{ background: rc('fg-neutral-muted', mode) }} />
          <span className="mt-1.5 block h-1.5 w-8 rounded" style={{ background: rc('stroke-neutral-weak', mode) }} />
        </div>
      ))}
    </>
  );
}
function Sheet({ mode = 'light', style, children, h = 92 }: { mode?: Mode; style?: CSSProperties; children?: ReactNode; h?: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-xl px-2.5 pt-2" style={{ height: h, background: rc('bg-layer-floating', mode), ...style }}>
      <span className="mx-auto block h-1 w-6 rounded-full" style={{ background: rc('stroke-neutral-weak', mode) }} />
      {children ?? [0, 1, 2].map((i) => <span key={i} className="mt-2.5 block h-1.5 rounded" style={{ width: 70 - i * 14, background: rc('fg-neutral-muted', mode) }} />)}
    </div>
  );
}
function Dialog({ mode = 'light', style }: { mode?: Mode; style?: CSSProperties }) {
  return (
    <div className="absolute left-3 right-3 top-[62px] rounded-xl p-2.5" style={{ background: rc('bg-layer-floating', mode), boxShadow: shadow(4, mode), ...style }}>
      <span className="block h-1.5 w-14 rounded" style={{ background: rc('fg-neutral', mode) }} />
      <span className="mt-1.5 block h-1.5 w-16 rounded" style={{ background: rc('stroke-neutral-weak', mode) }} />
      <div className="mt-3 flex gap-1.5">
        <span className="block h-4 flex-1 rounded" style={{ background: rc('bg-neutral-weak', mode) }} />
        <span className="block h-4 flex-1 rounded" style={{ background: rc('bg-critical-solid', mode) }} />
      </div>
    </div>
  );
}
function Dim({ mode = 'light' }: { mode?: Mode }) {
  return <span className="absolute inset-0" style={{ background: dim(mode) }} />;
}

// ── 원칙 — 층이 쌓인 단면 ─────────────────────────────────
// 1 층(기본 — 카드 · 목록)은 그림자 없이 1px stroke-neutral-weak 와 바닥으로 가른다(card.md · "고도를 드러내는 세 가지"). 그림자는 2 층부터
export function ElevationHeroFigure() {
  const g = levels(0);
  const surf = ['bg-layer-basement', 'bg-layer-default', 'bg-layer-floating', 'bg-layer-floating'];
  return (
    <Figure caption="층이 높을수록 사용자 쪽으로 가깝다 — 위의 층이 아래 층을 덮는다">
      <div className="relative h-[250px] w-[520px] rounded-xl bg-white">
        {g.map((l, i) => (
          <div
            key={l.level}
            className="absolute flex h-[52px] w-[300px] items-center justify-between rounded-xl px-4"
            style={{ left: 24 + i * 52, bottom: 20 + i * 48, background: rc(surf[i]), borderWidth: 1, borderStyle: 'solid', borderColor: i === 1 ? rc('stroke-neutral-weak') : 'rgba(0, 0, 0, 0.05)', boxShadow: i > 1 ? shadow(Math.min(i + 1, 4) as 1 | 2 | 3 | 4) : undefined }}
          >
            <b className="text-[13px] text-[#1A1F2E]">{l.level} · {head(l.what)}</b>
            <code className="text-[11px] text-[#62697A]">{l.token}</code>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ── Global 층 넷 ─────────────────────────────────────────
export function GlobalLevelsFigure() {
  const g = levels(0);
  const screens: ReactNode[] = [
    <Phone key="0"><Nav style={{ opacity: 0.35 }} /><Cards faded /><span className="absolute inset-1 rounded-[13px]" style={HL} /></Phone>,
    <Phone key="1"><Nav style={HL} /><Cards style={HL} /></Phone>,
    <Phone key="2"><Nav /><Cards /><Dim /><Sheet style={HL} /></Phone>,
    <Phone key="3"><Nav /><Cards /><Dim /><Sheet /><Dim /><Dialog style={HL} /></Phone>,
  ];
  return (
    <Figure caption="Global 층 — 화면 전체의 구조. 파란 테두리가 그 층이다">
      <div className="flex gap-4">
        {g.map((l, i) => (
          <div key={l.level} className="flex w-[124px] flex-col items-center gap-2">
            {screens[i]}
            <b className="text-[13px] text-fd-foreground">{l.level} · {head(l.what).split(' · ')[0]}</b>
            <code className="text-[11px] text-fd-muted-foreground">{l.token}</code>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// 시트 안에서 연 목록 — 폰의 줄 동작은 Menu Sheet 라, 시트 위에 뜨는 Local 의 예는 칸 아래로 열린 Select 목록(폰에서도 떠 있는 목록)
export function PageOverPageFigure() {
  const list = (
    <div className="absolute left-[10px] right-[10px] top-[154px] rounded-lg py-1" style={{ background: rc('bg-layer-floating'), boxShadow: shadow(3), ...HL }}>
      {['식비', '교통', '카페'].map((t, i) => (
        <div key={t} className="flex items-center justify-between px-2 py-1 text-[9px] leading-none" style={{ color: rc('fg-neutral') }}>
          {t}
          {i === 0 && <Check aria-hidden size={9} strokeWidth={2.5} />}
        </div>
      ))}
    </div>
  );
  return (
    <Figure caption="시트가 덮이면 시트가 새 바닥이 된다 — 그 안에서 연 목록(Select)은 시트 위에 쌓인다">
      <div className="flex items-center gap-6">
        <Phone w={150} h={270}>
          <Nav />
          <Cards />
          <Dim />
          <Sheet h={170}>
            <span className="mt-2.5 block text-[8px] font-bold leading-[8px]" style={{ color: rc('fg-neutral') }}>
              카테고리
            </span>
            <span className="mt-1.5 flex h-4 items-center justify-between rounded px-1.5 text-[9px] leading-none" style={{ boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}`, color: rc('fg-neutral') }}>
              식비
              <ChevronDown aria-hidden size={9} strokeWidth={2.5} style={{ color: rc('fg-neutral-subtle') }} />
            </span>
            {[0, 1].map((i) => (
              <span key={i} className="mt-2.5 block h-1.5 rounded" style={{ width: 70 - i * 18, background: rc('fg-neutral-muted') }} />
            ))}
          </Sheet>
          {list}
        </Phone>
        <ol className="flex flex-col gap-2 text-[12px] leading-5 text-fd-foreground">
          <li><b>페이지</b> — Global 1</li>
          <li><b>시트</b> — Global 2 · 새 쌓임 맥락</li>
          <li><b>시트 안의 목록(Select)</b> — 시트를 바닥으로 한 Local</li>
        </ol>
      </div>
    </Figure>
  );
}

// ── Local 층 셋 ──────────────────────────────────────────
export function LocalLevelsFigure() {
  const l = levels(1);
  const tabs = (style?: CSSProperties) => (
    <div className="absolute inset-x-0 top-7 flex h-6 items-end gap-3 px-2.5" style={{ background: rc('bg-layer-default'), borderBottom: `1px solid ${rc('stroke-neutral-weak')}`, ...style }}>
      {[0, 1, 2].map((i) => <span key={i} className="mb-1.5 block h-1.5 w-6 rounded" style={{ background: i ? rc('stroke-neutral-weak') : rc('fg-neutral') }} />)}
    </div>
  );
  const fab = (style?: CSSProperties) => (
    <span className="absolute bottom-4 right-3 flex h-9 w-9 items-center justify-center rounded-full text-[16px]" style={{ background: rc('bg-brand-solid'), color: rc('static-white'), boxShadow: shadow(3), ...style }}>＋</span>
  );
  // 스낵바 — 그림자 없이 면 색으로 뜬다(snackbar.yaml root.shadow none · 아래 "고도를 드러내는 세 가지" 의 표면 색)
  const toast = (style?: CSSProperties) => (
    <div className="absolute inset-x-2.5 bottom-3 flex h-8 items-center rounded-lg px-2.5" style={{ background: rc('bg-neutral-inverted'), ...style }}>
      <span className="block h-1.5 w-16 rounded" style={{ background: rc('fg-neutral-inverted') }} />
    </div>
  );
  const screens = [
    <Phone key="1"><Nav />{tabs(HL)}<Cards top={62} style={HL} />{fab({ opacity: 0.35 })}</Phone>,
    <Phone key="2"><Nav />{tabs()}<Cards top={62} />{fab(HL)}</Phone>,
    <Phone key="3"><Nav />{tabs()}<Cards top={62} />{toast(HL)}</Phone>,
  ];
  return (
    <Figure caption="Local 층 — 한 층 안에서 콘텐츠끼리의 깊이">
      <div className="flex gap-5">
        {l.map((x, i) => (
          <div key={x.level} className="flex w-[150px] flex-col items-center gap-2">
            {screens[i]}
            <b className="text-center text-[13px] text-fd-foreground">{x.level} · {head(x.what)}</b>
            <span className="text-center text-[11px] leading-4 text-fd-muted-foreground">{x.what.split(' — ')[1] ?? ''} · {x.token}</span>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// 같은 층 안 — 상단 바는 표시 없음(SEED Top Navigation), 한 표면 안에서 머리 · 본문이 따로 스크롤되는 옆 패널 · 대화상자 · 사이드바는 머리 아래 1px
export function SameLevelFigure() {
  const scrolledBar = (
    <Phone>
      <Cards top={14} />
      <div className="absolute inset-x-0 top-0 flex h-7 items-center px-2.5" style={{ background: rc('bg-layer-default') }}>
        <span className="block h-1.5 w-10 rounded" style={{ background: rc('fg-neutral') }} />
      </div>
    </Phone>
  );
  // 왼쪽 옆 패널(주 메뉴) — 본문을 올리면 머리 아래 1px stroke-neutral-subtle
  const drawer = (
    <Phone>
      <Nav />
      <Cards />
      <Dim />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: '80%', background: rc('bg-layer-floating') }}>
        <div className="absolute inset-x-0 top-0 flex h-9 items-center px-2.5" style={{ background: rc('bg-layer-floating'), boxShadow: `inset 0 -1px 0 ${rc('stroke-neutral-subtle')}`, zIndex: 1 }}>
          <span className="block h-2 w-12 rounded" style={{ background: rc('fg-neutral') }} />
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="absolute left-2.5 block h-1.5 rounded" style={{ top: 28 + i * 20, width: 52 - (i % 3) * 8, background: rc(i === 2 ? 'fg-neutral' : 'fg-neutral-muted') }} />
        ))}
      </div>
    </Phone>
  );
  return (
    <Figure caption="목록이 상단 내비게이션 아래로 스크롤될 때 — 층을 올리지 않고 선 · 그림자도 긋지 않는다. 한 표면 안에서 머리와 본문이 따로 스크롤되는 옆 패널 · 대화상자 · 사이드바는 머리 아래에 선">
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">{scrolledBar}<Cap>상단 바 — 표시 없음</Cap></div>
        <div className="flex flex-col items-center gap-2">{drawer}<Cap>옆 패널 머리 — 선 <code>stroke-neutral-subtle</code></Cap></div>
      </div>
    </Figure>
  );
}

// ── 고도를 드러내는 세 가지 ───────────────────────────────
export function ThreeWaysFigure() {
  const card = 'flex w-[168px] flex-col items-center gap-3 rounded-xl bg-white px-3 pb-4 pt-5';
  const stage = 'relative h-[96px] w-[140px] overflow-hidden rounded-lg';
  return (
    <Figure caption="표면 색 · 그림자 · 선 — 가운데 것은 다크에서 잘 안 보여 꼭 필요한 곳에만 쓴다">
      <div className="flex gap-3">
        <div className={card}>
          <div className={stage} style={{ background: rc('bg-layer-basement') }}>
            <div className="absolute inset-x-2 bottom-2 flex h-8 items-center rounded-lg px-2.5" style={{ background: rc('bg-neutral-inverted') }}>
              <span className="block h-1.5 w-16 rounded" style={{ background: rc('fg-neutral-inverted') }} />
            </div>
          </div>
          <b className="text-[13px] text-[#1A1F2E]">표면 색</b>
          <Cap>배경의 밝기 · 색을 바꾼다 — 스낵바</Cap>
        </div>
        <div className={card}>
          <div className={stage} style={{ background: rc('bg-layer-basement') }}>
            <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-bold" style={{ background: rc('bg-brand-solid'), color: rc('static-white'), boxShadow: shadow(3) }}>＋</span>
          </div>
          <b className="text-[13px] text-[#1A1F2E]">그림자</b>
          <Cap>떠 있는 높이를 그림자로 — 떠 있는 버튼 · 탭 바 · 메뉴</Cap>
        </div>
        <div className={card}>
          <div className={stage} style={{ background: rc('bg-layer-basement') }}>
            <div className="absolute inset-y-0 left-0 w-7" style={{ background: rc('bg-layer-default'), boxShadow: `inset -1px 0 0 ${rc('stroke-neutral-subtle')}` }} />
            <div className="absolute left-9 right-2 top-2 flex h-8 items-center rounded-md px-2" style={{ background: rc('bg-layer-default'), borderWidth: 1, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak') }}>
              <span className="block h-1.5 w-12 rounded" style={{ background: rc('fg-neutral-muted') }} />
            </div>
            <div className="absolute bottom-2 left-9 right-2 flex h-7 items-center justify-around rounded-full" style={{ background: rc('bg-layer-floating'), boxShadow: `${shadow(3)}, inset 0 0 0 1px ${rc('stroke-neutral-subtle')}` }}>
              {[0, 1, 2, 3].map((i) => <span key={i} className="block h-2.5 w-2.5 rounded" style={{ background: i ? rc('stroke-neutral-weak') : rc('fg-neutral') }} />)}
            </div>
          </div>
          <b className="text-[13px] text-[#1A1F2E]">선</b>
          <Cap>가장자리에 테두리를 둔다 — 사이드바의 오른쪽 선 · 떠 있는 탭 바의 안쪽 테두리 · 카드의 1px 테두리</Cap>
        </div>
      </div>
    </Figure>
  );
}

export function ShadowFigure() {
  return (
    <Figure caption="그림자 4단계 — 다크는 더 짙은 검정과 위쪽 1px 빛으로 같은 높이를 낸다">
      <div className="flex gap-4">
        {(['light', 'dark'] as Mode[]).map((m) => (
          <div key={m} className="flex w-[264px] flex-col gap-3 rounded-2xl p-5" style={{ background: rc('bg-layer-basement', m) }}>
            <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', m) }}>{m === 'light' ? '라이트' : '다크'}</span>
            <div className="grid grid-cols-2 gap-5">
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="flex h-[72px] flex-col justify-end rounded-xl p-2.5" style={{ background: rc(m === 'dark' ? 'bg-layer-floating' : 'bg-layer-default', m), boxShadow: shadow(n, m) }}>
                  <code className="text-[11px]" style={{ color: rc('fg-neutral-muted', m) }}>shadow-s{n}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function LayerTokenTable() {
  const alias = roleAliases();
  const rows = roleColors('desk').filter((r) => r.name.startsWith('bg-layer-'));
  return (
    <Table head={['토큰', '라이트', '다크', '옛 이름']} minWidth={560}>
      {rows.map((r) => (
        <tr key={r.name}>
          <td><Token>{r.name}</Token></td>
          <td><Swatch hex={r.light} /></td>
          <td><Swatch hex={r.dark} /></td>
          <td className="text-fd-muted-foreground">{alias.get(r.name)?.old ?? '—'}</td>
        </tr>
      ))}
    </Table>
  );
}

export function BasementVsWeakFigure() {
  const cell = (m: Mode, which: 'basement' | 'weak') => (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-[92px] w-[220px] overflow-hidden rounded-xl" style={{ background: rc(which === 'basement' ? 'bg-layer-basement' : 'bg-layer-default', m), border: `1px solid ${rc('stroke-neutral-weak', m)}` }}>
        {which === 'basement' ? (
          <div className="absolute inset-x-3 top-3 h-12 rounded-lg" style={{ background: rc('bg-layer-default', m), borderWidth: 1, borderStyle: 'solid', borderColor: rc('stroke-neutral-weak', m) }} />
        ) : (
          <div className="absolute inset-x-3 top-3 flex h-10 items-center rounded-lg px-3" style={{ background: rc('bg-neutral-weak', m) }}>
            <span className="block h-1.5 w-20 rounded" style={{ background: rc('fg-neutral-subtle', m) }} />
          </div>
        )}
      </div>
      <code className="text-[11px]" style={{ color: rc('fg-neutral-subtle', m) }}>
        {which === 'basement' ? 'bg-layer-basement — 바닥' : 'bg-neutral-weak — 카드 안 채움'}
      </code>
    </div>
  );
  return (
    <Figure caption="라이트에서는 둘이 비슷하다. 다크에서 basement 는 가장 어두운 바닥이고, neutral-weak 는 카드보다 밝다">
      <div className="flex gap-4">
        {(['light', 'dark'] as Mode[]).map((m) => (
          <div key={m} className="flex flex-col gap-3 rounded-2xl p-4" style={{ background: m === 'dark' ? rc('bg-layer-default', 'dark') : '#FFFFFF' }}>
            <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', m) }}>{m === 'light' ? '라이트' : '다크'}</span>
            {cell(m, 'basement')}
            {cell(m, 'weak')}
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ── 화면 바탕 — 띠 화면(구역 · 묶음) · 흰 화면(DESIGN.md Layout "화면 바탕", 2026-10-16 Q-019-3 C · 폰 구역 화면은 2026-10-21 I-01 결정 3) ─────
// 투명한 색(#RRGGBBAA)을 바탕에 섞은 불투명 hex — 대비를 잴 때
function over(fg: string, bg: string) {
  const h = fg.replace('#', '');
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  const mix = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * a + parseInt(bg.replace('#', '').slice(i, i + 2), 16) * (1 - a)));
  return `#${mix.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
const ratio = (fg: string, bg: string) => contrast(over(fg, bg), bg).toFixed(2);
function Rows({ mode, n, top = 0 }: { mode: Mode; n: number; top?: number }) {
  return (
    <div className="flex flex-col gap-[7px] px-2.5" style={{ paddingTop: top }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5 shrink-0 rounded" style={{ background: rc('stroke-neutral-weak', mode) }} />
          <span className="block h-1.5 rounded" style={{ width: 44 - (i % 3) * 8, background: rc('fg-neutral-muted', mode) }} />
        </div>
      ))}
    </div>
  );
}
function GroupHead({ mode }: { mode: Mode }) {
  return <span className="mx-2.5 block h-1 w-8 rounded" style={{ background: rc('fg-neutral-subtle', mode) }} />;
}
export function ScreenFloorFigure() {
  const gapL = contrast(rc('bg-layer-default'), rc('bg-layer-basement'));
  const gapD = contrast(rc('bg-layer-default', 'dark'), rc('bg-layer-basement', 'dark'));
  const kinds: { key: string; name: string; what: string; draw: (m: Mode) => ReactNode }[] = [
    {
      key: 'section',
      name: '띠 화면 — 구역',
      what: '홈 · 자산 · 통계 · 예산 · 카드 상세',
      draw: (m) => (
        <Phone mode={m}>
          <Nav mode={m} />
          <div className="absolute inset-x-0 flex flex-col gap-2" style={{ top: 28 }}>
            <div className="flex flex-col gap-1.5 px-2.5 py-2.5" style={{ background: rc('bg-brand-solid', m) }}>
              <span className="block h-1 w-8 rounded" style={{ background: rc('static-white', m), opacity: 0.8 }} />
              <span className="block h-2 w-16 rounded" style={{ background: rc('static-white', m) }} />
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 pb-2.5 pt-2.5" style={{ background: rc('bg-layer-default', m) }}>
                <span className="mx-2.5 block h-1.5 w-10 rounded" style={{ background: rc('fg-neutral', m) }} />
                {i === 0 ? (
                  <span className="mx-2.5 block h-5 rounded" style={{ background: rc('bg-neutral-weak', m) }} />
                ) : (
                  <Rows mode={m} n={2} />
                )}
              </div>
            ))}
          </div>
        </Phone>
      ),
    },
    {
      key: 'band',
      name: '띠 화면 — 묶음',
      what: '설정 · 전체 · 캘린더 · 알림',
      draw: (m) => (
        <Phone mode={m}>
          <Nav mode={m} />
          <div className="absolute inset-x-0 flex flex-col gap-2" style={{ top: 28 }}>
            {[3, 2, 3].map((n, i) => (
              <div key={i} className="flex flex-col gap-1.5 pb-2 pt-1.5" style={{ background: rc('bg-layer-default', m) }}>
                <GroupHead mode={m} />
                <Rows mode={m} n={n} />
              </div>
            ))}
          </div>
        </Phone>
      ),
    },
    {
      key: 'white',
      name: '흰 화면',
      what: '가계부 거래',
      draw: (m) => (
        <Phone mode={m}>
          <div className="absolute inset-0" style={{ background: rc('bg-layer-default', m) }} />
          <Nav mode={m} />
          <div className="absolute inset-x-0 flex flex-col gap-1.5" style={{ top: 34 }}>
            <GroupHead mode={m} />
            <Rows mode={m} n={4} />
            <GroupHead mode={m} />
            <Rows mode={m} n={4} />
          </div>
        </Phone>
      ),
    },
  ];
  return (
    <Figure caption={`폰 화면의 바닥은 늘 회색이고, 그 위에 흰 띠를 구역 · 묶음마다 놓는다(거래 목록만 흰 화면). 띠 사이 틈은 라이트 ${gapL.toFixed(2)}:1 · 다크 ${gapD.toFixed(2)}:1 로 옅다 — 구역은 머리 글이, 묶음은 목록 제목이 가른다. 데스크톱은 같은 구역을 카드로 쌓는다`}>
      <div className="flex flex-col gap-4">
        {(['light', 'dark'] as Mode[]).map((m) => (
          <div key={m} className="flex gap-4">
            {kinds.map((k) => (
              <div key={k.key} className="flex w-[124px] flex-col items-center gap-2">
                {k.draw(m)}
                {m === 'dark' && (
                  <>
                    <b className="text-[13px] text-fd-foreground">{k.name}</b>
                    <span className="text-center text-[11px] leading-4 text-fd-muted-foreground">{k.what}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ── 바닥 위의 채움 — neutral-weak · disabled 는 흰 표면 위에만, 바닥 위 칩 · 세그먼트 트랙은 투명 짝(01-040 B) ─────
export function FloorFillFigure() {
  const chip = (bg: string, label: string, m: Mode) => (
    <span className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium" style={{ background: bg, color: rc('fg-neutral', m) }}>
      {label}
    </span>
  );
  const btn = (m: Mode, outline: boolean) => (
    <span
      className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-bold"
      style={{ background: outline ? 'transparent' : rc('bg-neutral-weak', m), boxShadow: outline ? `inset 0 0 0 1px ${rc('stroke-neutral-weak', m)}` : undefined, color: rc('fg-neutral', m) }}
    >
      지난달 보기
    </span>
  );
  const cell = (m: Mode) => {
    const floor = rc('bg-layer-basement', m);
    const alpha = rc('bg-neutral-weak-alpha', m);
    const weak = rc('bg-neutral-weak', m);
    const row = (ok: boolean, node: ReactNode, note: string) => (
      <div className="flex items-center justify-between gap-3">
        {node}
        <span className="text-[11px] leading-4" style={{ color: ok ? rc('fg-neutral-muted', m) : rc('fg-critical', m) }}>{note}</span>
      </div>
    );
    return (
      <div className="flex w-[280px] flex-col gap-3 rounded-2xl p-4" style={{ background: floor }}>
        <span className="text-[12px] font-bold" style={{ color: rc('fg-neutral', m) }}>{m === 'light' ? '라이트' : '다크'} · 회색 바닥</span>
        {row(false, btn(m, false), `neutralWeak ${contrast(weak, floor).toFixed(2)}:1`)}
        {row(true, btn(m, true), 'neutralOutline — 테두리')}
        {row(false, chip(weak, '식비', m), `bg-neutral-weak ${contrast(weak, floor).toFixed(2)}:1`)}
        {row(true, chip(alpha, '식비', m), `bg-neutral-weak-alpha ${ratio(alpha, floor)}:1`)}
      </div>
    );
  };
  return (
    <Figure caption="회색 바닥 위 — 약한 배경은 라이트에서 바닥과 같은 색이다. 버튼은 테두리로, 칩 · 세그먼트 트랙은 투명 짝으로 칠한다">
      <div className="flex flex-col gap-4 sm:flex-row">
        {cell('light')}
        {cell('dark')}
      </div>
    </Figure>
  );
}
