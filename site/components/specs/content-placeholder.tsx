// Content Placeholder 페이지의 그림 — specs/components/content-placeholder.md 의 `[그림: …](../../site/components/specs/content-placeholder.tsx#<id>)` 자리.
// 면 · 그림 색 · 그림 크기(틀 높이의 50% · 16 ~ 160) · 선 굵기는 content-placeholder.yaml 을 푼 값(loadingKit().placeholder)으로,
// 불러오는 동안의 스켈레톤은 skeleton.yaml 로 그린다. 화면 틀(폰 · 카드 제목)의 글자 크기는 그림 안에서 정한다.
import type { CSSProperties, ReactNode } from 'react';
import { ImageOff } from 'lucide-react';
import { contrast } from '@/lib/design-tokens';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { Verdict, rc, type Mode } from './kit';
import { FrameCardDemo, type CardRow } from './image-demos';
import { cardFace } from './card-face';
import { dcv, findInstitution, imageFrameLook, imageFrameRadius, imageTones, institutions } from './image-look';
import { CP_GLYPHS, glyphSize, type CpGlyph } from './loading-look';
import { PlaceholderPlayground } from './loading-playground';
import { Bone, CardBox, L, LdPhone, Placeholder, SCREEN, cardStack, type Fig } from './loading-screens';
import { Legend, Note, Pin } from './overlay-screens';
import { resultSectionLook } from './feedback-look';
import { ResultSectionView, type ResultSectionViewProps } from './feedback-view';
import { FilterStrip } from './feedback-screens';

const cp = () => L().placeholder;
const Pair = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={`flex w-full flex-col gap-4 ${wide ? 'max-w-[900px] lg:flex-row' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const CARD_RATIO = 1.586;
const pin = (n: string, style: CSSProperties) => (
  <span aria-hidden className="pointer-events-none absolute" style={{ zIndex: 6, ...style }}>
    <Pin n={n} />
  </span>
);
// 틀 — 크기 · 비율 · 모서리는 틀이 정한다(대체 그림은 제 모서리가 없다). 그림 틀은 Image Frame 이라 모서리는 폭으로(24 이하 4 · 48 이하 6 · 그 위 8 ·
// 화면 폭 0 — image-frame.yaml), 안쪽 1px 투명 윤곽을 대체 그림 위에도 늘 그린다. r 은 나쁜 예(손으로 고른 모서리), stroke=false 는 Anatomy · 나쁜 예
function Frame({ w, h, r, bleed = false, stroke = true, mode = 'auto', children, style }: { w: number; h: number; r?: number; bleed?: boolean; stroke?: boolean; mode?: Mode; children: ReactNode; style?: CSSProperties }) {
  const f = imageFrameLook();
  const rad = r ?? f.radius[imageFrameRadius(w, f.bands, bleed)].px;
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: w, height: h, borderRadius: rad, isolation: 'isolate', ...style }}>
      {children}
      {stroke && <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 2, borderRadius: 'inherit', boxShadow: `inset 0 0 0 ${f.stroke.width}px ${dcv(f.stroke.color, mode)}`, pointerEvents: 'none' }} />}
    </div>
  );
}
// 카드 그림 · 혜택 그림(불러온 그림) — 그림 장식
const CardArt = ({ hue = '#2F3A57' }: { hue?: string }) => <span aria-hidden className="block h-full w-full" style={{ background: `linear-gradient(135deg, ${hue} 0%, #4D5B82 55%, #7F8DB8 100%)` }} />;
const GiftArt = () => <span aria-hidden className="block h-full w-full" style={{ background: 'linear-gradient(150deg, #F4B860 0%, #E5793B 100%)' }} />;

// ── Overview ──────────────────────────────────────────────
// 카드 목록 — 그림이 없는 줄은 모르는 카드사(BC)다. 아는 카드사의 그림 없는 카드는 이 그림이 아니라 카드 면이다(image-frame.md 카드 그림)
function CardList({ mode }: { mode: Mode }) {
  const w = 96;
  const h = Math.round(w / CARD_RATIO);
  const rows: [string, string, 'none' | 'ok'][] = [
    ['BC 바로 카드', '10월 352,400원', 'none'],
    ['신한카드 Deep', '10월 128,000원', 'ok'],
    ['BC 그린 카드', '10월 64,500원', 'none'],
  ];
  return (
    <div style={cardStack()}>
      <CardBox mode={mode} title="카드">
        {rows.map(([name, sub, img]) => (
          <div key={name} className="flex items-center gap-4" style={{ padding: '12px 24px' }}>
            <Frame w={w} h={h} mode={mode}>{img === 'ok' ? <CardArt /> : <Placeholder mode={mode} icon="credit-card" label={`${name} 카드 그림`} w={w} h={h} />}</Frame>
            <span className="flex flex-col gap-0.5">
              <span className="text-[16px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
                {name}
              </span>
              <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
                {sub}
              </span>
            </span>
          </div>
        ))}
      </CardBox>
    </div>
  );
}
function BenefitList({ mode }: { mode: Mode }) {
  const s = 64;
  const rows: [string, string, 'none' | 'ok'][] = [
    ['커피 30% 할인', '스타벅스 · 하루 한 번', 'none'],
    ['영화 4,000원 할인', 'CGV · 한 달 두 번', 'ok'],
    ['편의점 10% 할인', 'GS25 · CU', 'none'],
  ];
  return (
    <div style={cardStack()}>
      <CardBox mode={mode} title="받을 수 있는 혜택">
        {rows.map(([name, sub, img]) => (
          <div key={name} className="flex items-center gap-4" style={{ padding: '12px 24px' }}>
            <Frame w={s} h={s} mode={mode}>{img === 'ok' ? <GiftArt /> : <Placeholder mode={mode} label={`${name} 그림`} w={s} h={s} />}</Frame>
            <span className="flex flex-col gap-0.5">
              <span className="text-[16px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
                {name}
              </span>
              <span className="text-[13px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
                {sub}
              </span>
            </span>
          </div>
        ))}
      </CardBox>
    </div>
  );
}
function Attachment({ mode }: { mode: Mode }) {
  const w = 344;
  const h = Math.round((w * 3) / 4);
  const keys: [string, string][] = [
    ['금액', '−12,000원'],
    ['카테고리', '식비'],
    ['결제 수단', '현대카드 M'],
  ];
  return (
    <div className="flex flex-col" style={{ background: rc('bg-layer-default', mode) }}>
      <Frame w={w} h={h} bleed mode={mode}>
        <Placeholder mode={mode} icon="receipt" label="점심 식사 영수증 사진" w={w} h={h} />
      </Frame>
      <div style={{ padding: '8px 0' }}>
        {keys.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between" style={{ padding: '12px 24px' }}>
            <span className="text-[14px]" style={{ color: rc('fg-neutral-subtle', mode) }}>
              {k}
            </span>
            <span className="text-[14px] font-medium" style={{ color: rc('fg-neutral', mode) }}>
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <LdPhone mode={mode} title="자산" scale={0.52}>
            <CardList mode={mode} />
          </LdPhone>
          <LdPhone mode={mode} title="카드 혜택" back tabs={false} scale={0.52}>
            <BenefitList mode={mode} />
          </LdPhone>
          <LdPhone mode={mode} title="거래 상세" back tabs={false} scale={0.52} bg="bg-layer-default">
            <Attachment mode={mode} />
          </LdPhone>
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => {
  const f = imageFrameLook();
  const cls = (r: '4' | '6' | '8') => `rounded-${f.radius[r].token.replace(/^radius-/, '')}`;
  return <PlaceholderPlayground kit={L()} screen={SCREEN()} radii={{ r4: f.bands.r4, r6: f.bands.r6, px: { s: f.radius['4'].px, m: f.radius['6'].px, l: f.radius['8'].px }, cls: { s: cls('4'), m: cls('6'), l: cls('8') } }} />;
};

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const w = 280;
  const h = 210;
  const g = glyphSize(cp().glyph, w, h);
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="rounded-2xl p-10 pk-surface">
          <div className="relative">
            <Frame w={w} h={h} stroke={false} style={{ outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 }}>
              <Placeholder icon="receipt" label="영수증 사진" w={w} h={h} />
            </Frame>
            <span aria-hidden className="absolute" style={{ left: (w - g) / 2, top: (h - g) / 2, width: g, height: g, outline: `1px dashed ${MARK_LINE}`, background: MARK }} />
            {pin('ⓐ', { left: -16, top: -16 })}
            {pin('ⓑ', { left: (w + g) / 2 + 6, top: (h - g) / 2 - 10 })}
          </div>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 틀을 채운 면, 모서리는 틀이 자른다'],
            ['ⓑ', `Glyph — 가운데 정사각, 틀 높이의 ${cp().glyph.ratio * 100}%`],
          ]}
        />
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 크기 — 그림은 틀 높이의 50%(16 ~ 160), 틀 폭이 좁으면 폭
const SIZES: [string, number, number, number, string, boolean][] = [
  ['40 썸네일', 40, 40, 1, '', false],
  ['카드 그림 120', Math.round(120 * CARD_RATIO), 120, 1, '', false],
  ['화면 폭 4:3 사진', 360, 270, 0.6, '(60% 로 줄여 그렸다)', true],
  ['좁고 긴 틀', 48, 200, 1, '— 폭이 좁아 폭에 맞춘다', false],
];
const Sizes: Fig = ({ caption }) => {
  const g = cp().glyph;
  return (
    <Figure caption={caption}>
      <div className="grid grid-cols-2 items-end gap-x-6 gap-y-8 rounded-2xl px-8 py-8 pk-surface">
        {SIZES.map(([t, w, h, s, extra, bleed]) => {
          const size = glyphSize(g, w, h);
          return (
            <div key={t} className="flex w-[240px] flex-col items-center gap-3">
              <div className="relative" style={{ width: w * s, height: h * s }}>
                <div style={{ width: w, height: h, transform: s === 1 ? undefined : `scale(${s})`, transformOrigin: 'top left' }}>
                  <Frame w={w} h={h} bleed={bleed}>
                    <Placeholder w={w} h={h} />
                  </Frame>
                </div>
                {/* 그림의 한 변 — 줄여 그려도 수는 실제 값 */}
                <span aria-hidden className="absolute" style={{ left: ((w - size) / 2) * s, width: size * s, top: ((h - size) / 2) * s - 6, height: 2, background: MARK_LINE }} />
                <span aria-hidden className="absolute whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ left: (w / 2) * s, top: ((h - size) / 2) * s - 24, transform: 'translateX(-50%)', background: MARK_LINE }}>
                  {Math.round(size)}
                </span>
              </div>
              <span className="flex flex-col items-center gap-0.5 text-center text-[12px] leading-4 pk-muted">
                <b className="text-[13px] pk-text">{t}</b>
                {w} × {h} → 그림 {Math.round(size)} · 모서리 {imageFrameLook().radius[imageFrameRadius(w, imageFrameLook().bands, bleed)].px} {extra}
              </span>
            </div>
          );
        })}
      </div>
    </Figure>
  );
};

// 색 — 흰 카드 위 · 다크, 대비는 토큰 값으로 잰다
const Colors: Fig = ({ caption }) => {
  const p = cp();
  const card = (m: 'light' | 'dark') => (m === 'dark' ? SCREEN()['bg-layer-default'].dark : SCREEN()['bg-layer-default'].light);
  const face = (m: 'light' | 'dark') => (m === 'dark' ? p.bg.dark : p.bg.light);
  const glyph = (m: 'light' | 'dark') => (m === 'dark' ? p.glyph.color.dark : p.glyph.color.light);
  return (
    <Figure caption={caption}>
      <div className="flex flex-wrap justify-center gap-4">
        {(['light', 'dark'] as const).map((m) => (
          <div key={m} className="flex flex-col items-center gap-3 rounded-2xl px-8 py-6" style={{ background: rc('bg-layer-default', m) }}>
            <Frame w={200} h={150} mode={m}>
              <Placeholder mode={m} icon="image" w={200} h={150} />
            </Frame>
            <span className="text-center text-[12px] leading-5 tabular-nums" style={{ color: rc('fg-neutral-subtle', m) }}>
              {m === 'light' ? '라이트' : '다크'} — 면 : 카드 {contrast(face(m), card(m)).toFixed(2)}:1
              <br />
              그림 : 면 {contrast(glyph(m), face(m)).toFixed(2)}:1
            </span>
          </div>
        ))}
      </div>
    </Figure>
  );
};

// 그림 — 사진 · 카드 · 영수증 · 문서(lucide 선 아이콘, 24 격자 기준 선 굵기)
const GLYPH_KO: Record<CpGlyph, string> = { image: '사진(기본)', 'credit-card': '카드 그림', receipt: '영수증 사진', 'file-text': '문서' };
const Glyphs: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col items-center gap-4">
    <div className="flex flex-wrap justify-center gap-4 rounded-2xl px-8 py-7 pk-surface">
      {CP_GLYPHS.map((g) => (
        <div key={g} className="flex flex-col items-center gap-2">
          <Frame w={120} h={120}>
            <Placeholder icon={g} w={120} h={120} />
          </Frame>
          <span className="flex flex-col items-center text-center text-[12px] leading-4 pk-muted">
            <b className="text-[13px] pk-text">{GLYPH_KO[g]}</b>
            <code>{g}</code>
          </span>
        </div>
      ))}
    </div>
    <Note>선 굵기 {cp().glyph.stroke}(24 격자) — 그림이 커지면 같은 비율로 굵어진다</Note>
    </div>
  </Figure>
);

// ── Guidelines ────────────────────────────────────────────
// 불러오는 동안은 Skeleton — 불러오는 중 · 실패를 같은 그림으로
const LoadingGuide: Fig = ({ caption }) => {
  const w = 112;
  const h = Math.round(w / CARD_RATIO);
  const row = (name: string, sub: string, img: ReactNode) => (
    <div className="flex items-center gap-4" style={{ padding: '10px 0' }}>
      <Frame w={w} h={h}>{img}</Frame>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-medium pk-text">{name}</span>
        <span className="text-[12px] pk-muted">{sub}</span>
      </span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="불러오는 동안은 같은 모서리 · 같은 크기의 스켈레톤, 다 불러왔는데 없거나 실패하면 대체 그림" bg={BASEMENT}>
          <div className="w-[290px] rounded-2xl px-6 py-3 pk-surface">
            {row('BC 바로 카드', '불러오는 중', <Bone radius={imageFrameRadius(w, imageFrameLook().bands)} width="100%" height="100%" />)}
            {row('BC 그린 카드', '불러오지 못함', <Placeholder icon="credit-card" label="BC 그린 카드 카드 그림" w={w} h={h} />)}
          </div>
        </Verdict>
        <Verdict ok={false} note="불러오는 중과 실패가 같은 그림 — 기다려야 하는지 알 수 없다" bg={BASEMENT}>
          <div className="w-[290px] rounded-2xl px-6 py-3 pk-surface">
            {row('BC 바로 카드', '불러오는 중', <Placeholder icon="credit-card" w={w} h={h} />)}
            {row('BC 그린 카드', '불러오지 못함', <Placeholder icon="credit-card" w={w} h={h} />)}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 깨진 이미지 · 빈 칸을 두지 않는다 — 대체 그림 · 깨진 이미지 아이콘 · 빈 칸
const BrokenGuide: Fig = ({ caption }) => {
  const w = 120;
  const h = Math.round(w / CARD_RATIO);
  const cell = (child: ReactNode, cap: string) => (
    <div className="flex flex-col items-center gap-2">
      {child}
      <span className="text-center text-[12px] leading-4 pk-muted">{cap}</span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="불러오지 못하면 대체 그림 — 옅은 면 + 무엇이 없는지 말하는 그림" bg={BASEMENT}>
          <div className="rounded-2xl px-6 py-5 pk-surface">
            {cell(
              <Frame w={w} h={h}>
                <Placeholder icon="credit-card" label="BC 바로 카드 카드 그림" w={w} h={h} />
              </Frame>,
              '대체 그림',
            )}
          </div>
        </Verdict>
        <Verdict ok={false} note="브라우저의 깨진 이미지 아이콘과 대체 글이 그대로 · 투명한 빈 칸 · 다른 곳의 기본 그림(외부 주소)" bg={BASEMENT}>
          <div className="flex gap-4 rounded-2xl px-5 py-5 pk-surface">
            {cell(
              <Frame w={w} h={h} r={0} stroke={false}>
                <span className="flex items-start gap-1 p-1 text-[11px] leading-4" style={{ color: rc('fg-neutral-muted') }}>
                  <ImageOff aria-hidden size={14} strokeWidth={1.5} className="shrink-0" />
                  BC 바로 카드 카드 그림
                </span>
              </Frame>,
              '깨진 이미지 + 대체 글',
            )}
            {cell(<Frame w={w} h={h} stroke={false} style={{ outline: `1px dashed ${MARK_LINE}`, outlineOffset: -1 }}>{null}</Frame>, '투명한 빈 칸(점선은 그림 표시)')}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 미리보기 ─────────────────────────────────────────
// 코드 그대로 — <ImageFrame ratio="card" width={112} … fallbackIcon={<CreditCard />} />. 카드사는 기관 색 표에 없는 BC 로 둔다
// (아는 카드사의 그림 없는 카드는 CardArt 의 카드 면이라 이 그림이 아니다 — image-frame.md 카드 그림)
const EX_CARDS: CardRow[] = [
  { name: 'BC 바로 카드', image: 'none' },
  { name: 'BC 그린 카드', image: 'broken', pic: 'card-h2' },
  { name: 'BC 데일리 카드', image: 'ok', pic: 'card-h' },
];
const ExBasic: Fig = () => {
  for (const c of EX_CARDS) if (findInstitution(c.name, institutions())) throw new Error(`content-placeholder ex-basic 의 ${c.name} 이 기관 색 표에 있다 — 표에 없는 카드사로 둔다`);
  const t = imageTones();
  return (
    <figure className="not-prose mb-0 mt-6">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border px-2 py-6" style={{ background: rc('bg-layer-basement') }}>
        <div className="w-full max-w-[400px]">
          <FrameCardDemo look={imageFrameLook()} rows={EX_CARDS} sub={{ title: t['fg-neutral'], detail: t['fg-neutral-subtle'], surface: t['bg-layer-default'], border: t['stroke-neutral-weak'] }} card={cardFace()} />
        </div>
      </div>
    </figure>
  );
};

// ── 대신 보이는 것 고르기 — 같은 띠의 네 상태(2026-10-22 사용자 결정 1B · 2B) ──────
// 가계부 흰 화면의 "10월 거래" — 불러오는 중(줄 자리만 스켈레톤) · 처음(할 일 + 첫 버튼) · 걸러서 0건(조건 탓 · 버튼 없음) · 불러오지 못함(다시 시도).
// 결과는 result-section.yaml(resultSectionLook), 스켈레톤은 skeleton.yaml. 필터 바는 모양만 줄인 대역이다(Chip 은 chip.md)
function SkRow({ mode }: { mode: Mode }) {
  return (
    <div className="flex items-center gap-3" style={{ padding: '12px 24px' }}>
      <Bone mode={mode} radius="12" width={40} height={40} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <Bone mode={mode} text="t5" width="62%" />
        <Bone mode={mode} text="t3" width="42%" />
      </span>
      <Bone mode={mode} text="t5" width={72} />
    </div>
  );
}
type StandinState = 'loading' | 'first' | 'filtered' | 'failed';
const STANDIN_RESULT: Record<Exclude<StandinState, 'loading'>, Omit<ResultSectionViewProps, 'look'>> = {
  first: { kind: 'empty', icon: 'receipt-text', title: '아직 기록한 거래가 없어요', description: '거래를 기록하면 날짜별로 여기에 모여요.', primary: { label: '거래 추가' } },
  filtered: { kind: 'empty', icon: 'funnel-x', title: '조건에 맞는 거래가 없어요', description: '조건을 바꾸거나 지워 보세요.' },
  failed: { kind: 'failure', title: '거래를 불러오지 못했어요', description: '잠시 뒤 다시 시도해 주세요.', primary: { label: '다시 시도' } },
};
function StandinPhone({ mode, state }: { mode: Mode; state: StandinState }) {
  return (
    <LdPhone mode={mode} title="가계부" scale={0.5} h={600} bg="bg-layer-default">
      <FilterStrip mode={mode} on={state === 'filtered'} />
      <div className="text-[14px] font-bold" style={{ padding: '16px 24px 4px', color: rc('fg-neutral-subtle', mode) }}>
        10월 거래
      </div>
      {state === 'loading' ? (
        <div aria-busy>
          {[0, 1, 2, 3].map((i) => (
            <SkRow key={i} mode={mode} />
          ))}
        </div>
      ) : (
        <ResultSectionView look={resultSectionLook('desk')} mode={mode} size="large" grow {...STANDIN_RESULT[state]} />
      )}
    </LdPhone>
  );
}
const STANDIN_CAP: Record<StandinState, [string, string]> = {
  loading: ['불러오는 중', '1초부터 — 필터 · 목록 제목은 그리고 줄 자리만 스켈레톤'],
  first: ['처음 — 하나도 없음', 'Result Section empty — 할 일 + 첫 버튼'],
  filtered: ['걸러서 0건', '조건 탓을 제목이 말한다 · 버튼 없음(지우기는 필터 바 맨 앞)'],
  failed: ['불러오지 못함', 'failure + 다시 시도 — 비어 있음으로 보이지 않는다'],
};
const StandinGuide: Fig = ({ caption }) => (
  <Panel caption={caption}>
    <div className="mx-auto flex max-w-[420px] flex-wrap items-start justify-center gap-3">
      {(Object.keys(STANDIN_CAP) as StandinState[]).map((st) => (
        <div key={st} className="flex w-[196px] flex-col items-center gap-2">
          <StandinPhone mode="auto" state={st} />
          <span className="text-center text-[12px] leading-4 pk-muted">
            <b className="pk-text">{STANDIN_CAP[st][0]}</b> — {STANDIN_CAP[st][1]}
          </span>
        </div>
      ))}
    </div>
  </Panel>
);

export const contentPlaceholderFigures: Record<string, Fig> = {
  'standin-guide': StandinGuide,
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  sizes: Sizes,
  colors: Colors,
  glyphs: Glyphs,
  'loading-guide': LoadingGuide,
  'broken-guide': BrokenGuide,
  'ex-basic': ExBasic,
};
