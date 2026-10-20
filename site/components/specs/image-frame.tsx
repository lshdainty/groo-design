// Image Frame 페이지의 그림 — specs/components/image-frame.md 의 `[그림: …](../../site/components/specs/image-frame.tsx#<id>)` 자리.
// 틀 · 모서리 · 윤곽 · 그림 위 자리 · Indicator 는 image-frame.yaml, 카드 그림 · 카드 면은 card-art.yaml + institution-colors.yaml(image-look),
// 스켈레톤 · 대체 그림은 skeleton · content-placeholder.yaml, 배지는 badge.yaml, 목록 줄은 list.yaml, 가로 줄은 scroll-fog.yaml 로 그린다.
// 그림은 손으로 칠한 대역이다(실제 사진 · 카드 그림이 아니다).
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MousePointer2, RotateCw } from 'lucide-react';
import { Figure, Panel, MARK, MARK_LINE } from '../foundations/ui';
import { badgeLook } from './display-look';
import { AvatarView, Reading } from './display-view';
import { B, PhoneBoard, Screen, dk, tone } from './display-screens';
import { contrastOf, IF_PLACEMENTS, IF_RATIOS, imageFrameRadius, imageTones, institutions, over, PICS, PLACEMENT_KO, ratioText, RATIO_KO, cardFace, type IfRatio, type PicKind } from './image-look';
import { ImageFramePlayground } from './image-playground';
import { AspectRatioView, CardArtView, RawPic, VideoChild } from './image-view';
import { ARL, BenefitGridScreen, BenefitListScreen, CAL, CARDS, Card, CardCell, Cell, Discontinued, Frame, GRID, IFL, Ind, Logo, RULES, RuleCard, RuleScreen, Rows, at, cardRow, type Fig } from './image-screens';
import { ScrollFogView } from './loading-view';
import { scrollFogLook } from './loading-look';
import { Band, Legend, Note, pinStyle } from './overlay-screens';
import { Verdict, rc, type Mode } from './kit';

const Pair = ({ children, stack = false }: { children: ReactNode; stack?: boolean }) => <div className={`flex w-full flex-col gap-4 ${stack ? 'mx-auto max-w-[560px]' : 'max-w-[760px] md:flex-row'}`}>{children}</div>;
const BASEMENT = 'var(--p-bg-layer-basement)';
const modeKo = (m: Mode) => (m === 'dark' ? '다크' : '라이트');
const pin = pinStyle;
// 4배로 본 모서리 — 틀의 왼쪽 위를 키워 1px 윤곽이 보이게(판은 놓인 면)
function Zoom({ children, mode = 'auto', w = 120, h = 80, z = 4, label }: { children: ReactNode; mode?: Mode; w?: number; h?: number; z?: number; label?: string }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <span className="relative block overflow-hidden rounded-lg" style={{ width: w, height: h, background: rc('bg-layer-default', mode), outline: `1px dashed ${rc('stroke-neutral-weak', mode)}`, outlineOffset: -1 }}>
        <span className="absolute" style={{ left: 10, top: 10, transform: `scale(${z})`, transformOrigin: '0 0' }}>
          {children}
        </span>
      </span>
      {label && (
        <span className="text-[11px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
          {label}
        </span>
      )}
    </span>
  );
}
// 그림 아래 한 줄 설명(모드를 따른다)
function Sub({ children, mode = 'auto', strong }: { children?: ReactNode; mode?: Mode; strong?: ReactNode }) {
  return (
    <span className="flex max-w-[200px] flex-col items-center gap-0.5 text-center text-[11px] leading-4" style={{ color: tone('fg-neutral-subtle', mode) }}>
      {strong && (
        <b className="text-[12px]" style={{ color: tone('fg-neutral', mode) }}>
          {strong}
        </b>
      )}
      {children}
    </span>
  );
}
const ModeBoard = ({ mode, children, className = '' }: { mode: Mode; children: ReactNode; className?: string }) => (
  <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
    <div className="rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
      {children}
    </div>
    <span className="text-center text-[12px] leading-4 pk-muted">{modeKo(mode)}</span>
  </div>
);

// ── Overview ──────────────────────────────────────────────
const Hero: Fig = ({ caption }) => (
  <Figure caption={caption}>
    <div className="flex flex-col gap-4">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex items-start gap-4">
          <BenefitGridScreen mode={mode} scale={0.5} h={600} />
          <BenefitListScreen mode={mode} scale={0.5} h={600} />
          <RuleScreen mode={mode} scale={0.5} h={600} />
        </div>
      ))}
    </div>
  </Figure>
);

const Playground: Fig = () => {
  const faces = Object.fromEntries(['신한카드', 'KB국민카드', 'NH농협카드', 'BC카드', '하나카드'].map((n) => {
    const f = cardFace(n, institutions(), CAL());
    return [n, f ? { bg: f.bg, fg: f.fg } : null];
  }));
  const t = imageTones();
  return <ImageFramePlayground look={IFL()} ca={CAL()} faces={faces} badge={badgeLook()} tones={{ 'bg-layer-basement': t['bg-layer-basement'], 'bg-layer-default': t['bg-layer-default'], 'fg-neutral-subtle': t['fg-neutral-subtle'] }} />;
};

// ── Anatomy ───────────────────────────────────────────────
const Anatomy: Fig = ({ caption }) => {
  const l = IFL();
  const W = 280;
  const H = W / l.ratios['4:3'].value;
  const off = l.floater.offset;
  const dash = { outline: `1px dashed ${MARK_LINE}`, outlineOffset: 3 } as CSSProperties;
  return (
    <Figure caption={caption}>
      <div className="flex flex-col items-center gap-7">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 rounded-2xl px-10 pb-8 pt-10 pk-surface">
          <span className="relative block" style={{ width: W }}>
            <Frame
              width={W}
              pic="white"
              zone={{ root: dash }}
              floaters={[at('top-start', <Discontinued />), at('bottom-end', <Ind label="사진 12장 중 1번째">1 / 12</Ind>)]}
            />
            {pin('ⓐ', { left: -26, top: -26 })}
            {pin('ⓑ', { left: W / 2 - 10, top: H / 2 - 10 })}
            {pin('ⓒ', { left: W + 8, top: H / 2 - 10 })}
            {pin('ⓔ', { left: off + 44, top: off - 22 })}
            {pin('ⓔ', { left: W - off - 64, top: H - off + 6 })}
          </span>
          <span className="flex flex-col items-center gap-5">
            <Zoom label={`ⓒ 윤곽 ${l.stroke.width}px — 4배로 본 왼쪽 위`}>
              <Frame width={W} pic="white" />
            </Zoom>
            <span className="flex gap-4">
              <span className="relative flex flex-col items-center gap-1">
                <Frame width={104} pic="dusk" state="loading" />
                <span className="text-[11px] leading-4 pk-muted">ⓓ 불러오는 중</span>
                {pin('ⓓ', { left: -10, top: -10 })}
              </span>
              <span className="flex flex-col items-center gap-1">
                <Frame width={104} pic={null} alt="저녁 하늘 사진" />
                <span className="text-[11px] leading-4 pk-muted">ⓓ 없음 · 실패</span>
              </span>
            </span>
          </span>
        </div>
        <Legend
          items={[
            ['ⓐ', 'Root — 비율 상자 · 모서리로 자른다'],
            ['ⓑ', 'Image — 꽉 채운다(cover)'],
            ['ⓒ', `Stroke — 안쪽 ${l.stroke.width}px, 그림 위에 늘`],
            ['ⓓ', 'Skeleton · Fallback — 그림 자리에'],
            ['ⓔ', `Floater — 네 모서리, 가장자리에서 ${off}`],
          ]}
        />
        <Note>
          {W} × {H} 의 4:3(모서리 {l.radius['8'].px} — 폭 {l.bands.r6 + 1} 이상). 흰 그림이라 윤곽이 둘레를 잡는다. 배지 · Indicator 는 가장자리에서 {off}
        </Note>
      </div>
    </Figure>
  );
};

// ── Properties ────────────────────────────────────────────
// 같은 폭에 여덟 비율 — 값 · 식은 image-frame.yaml 의 ratio 규칙
const num1 = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const Ratio: Fig = ({ caption }) => {
  const l = IFL();
  const w = 112;
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[640px] grid-cols-2 items-start justify-items-center gap-x-4 gap-y-6 rounded-2xl px-4 py-6 pk-surface sm:grid-cols-4">
        {IF_RATIOS.map((r) => (
          <div key={r} className="flex w-[124px] flex-col items-center gap-2">
            <Frame width={w} ratio={r} pic={r === 'card' ? 'card-h' : 'meadow'} />
            <span className="flex flex-col items-center gap-0.5 text-center text-[11px] leading-4 pk-muted">
              <b className="text-[12px] pk-text">
                {r}
                {r === l.defaults.ratio ? '(기본)' : ''}
              </b>
              <span className="tabular-nums">
                {l.ratios[r].expr}
                {/^≈|^\d/.test(l.ratios[r].note) ? ` ${l.ratios[r].note.split(' — ')[0]}` : ''}
              </span>
              <span className="tabular-nums">
                {w} × {num1(w / l.ratios[r].value)}
              </span>
              <span>{r === 'card' ? 'groo — ISO 카드' : RATIO_KO[r]}</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// 폭으로 고른 모서리 — 24 · 40 · 56 · 150, 화면 폭은 0. 아래는 3배로 본 모서리
const RADIUS_W: [number, IfRatio, PicKind][] = [
  [24, '1:1', 'meadow'],
  [40, '1:1', 'meadow'],
  [56, 'card', 'card-h'],
  [150, 'card', 'card-h'],
];
const Radius: Fig = ({ caption }) => {
  const l = IFL();
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6 rounded-2xl px-4 py-7 pk-surface">
        <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6">
          {RADIUS_W.map(([w, r, p]) => {
            const rk = imageFrameRadius(w, l.bands);
            return (
              <div key={w} className="flex flex-col items-center gap-2">
                <Frame width={w} ratio={r} pic={p} />
                <Zoom w={64} h={48} z={3}>
                  <Frame width={w} ratio={r} pic={p} />
                </Zoom>
                <span className="flex flex-col items-center text-center text-[11px] leading-4 pk-muted">
                  <b className="text-[12px] tabular-nums pk-text">
                    {w} → {l.radius[rk].px}
                  </b>
                  {l.radius[rk].token}
                </span>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-2">
            <div className="overflow-hidden" style={{ width: 150, borderRadius: 18, border: '5px solid var(--p-frame)', background: rc('bg-layer-default') }}>
              <Frame bleed fill ratio="4:3" pic="dusk" />
              <div className="flex flex-col gap-1 p-2.5">
                <span className="block h-2 w-20 rounded-full" style={{ background: rc('bg-neutral-weak') }} />
                <span className="block h-2 w-12 rounded-full" style={{ background: rc('bg-neutral-weak') }} />
              </div>
            </div>
            <span className="flex flex-col items-center text-center text-[11px] leading-4 pk-muted">
              <b className="text-[12px] pk-text">화면 폭 → {l.radius['0'].px}</b>
              좌우가 화면 끝에 닿는 그림
            </span>
          </div>
        </div>
        <Note>
          폭 {l.bands.r4} 이하 {l.radius['4'].px} · {l.bands.r6} 이하 {l.radius['6'].px} · 그 위 {l.radius['8'].px} · 화면 폭 {l.radius['0'].px}. 가운데 줄은 왼쪽 위 모서리를 3배로 본 모습이다
        </Note>
      </div>
    </Panel>
  );
};

// 투명 윤곽 — 흰 그림 · 어두운 그림, 라이트 · 다크. 대비는 투명한 선을 바탕에 겹쳐 잰다
const Stroke: Fig = ({ caption }) => {
  const l = IFL();
  const t = imageTones();
  const s = l.stroke.color;
  const white = '#FFFFFF';
  const darkSurface = t['bg-layer-default'].dark;
  const onWhite = ratioText(contrastOf(over(s.light, white), white));
  const onDark = ratioText(contrastOf(over(s.dark, darkSurface), darkSurface));
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4">
          {(['white', 'dusk'] as const).map((p) => (
            <span key={p} className="flex flex-col items-center gap-1.5">
              <Frame width={120} ratio="4:3" pic={p} mode={mode} />
              <Sub mode={mode}>{p === 'white' ? '흰 그림' : '어두운 그림'}</Sub>
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {(['white', 'dusk'] as const).map((p) => (
            <Zoom key={p} mode={mode} w={120} h={72} label="모서리 4배">
              <Frame width={120} ratio="4:3" pic={p} mode={mode} />
            </Zoom>
          ))}
        </div>
        <Sub mode={mode}>{mode === 'light' ? `${s.name} ${s.light} — 흰 그림 둘레 ${onWhite}:1, 어두운 그림 위에서는 보이지 않는다` : `${s.name} ${s.dark} — 어두운 면 위 ${onDark}:1, 흰 그림 둘레는 그림 자체가 바탕과 갈린다`}</Sub>
      </div>
    </ModeBoard>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

// cover — 사진(가운데를 남겨 자름) · contain — 흰 판 위 로고(두 모드 같다)
const Fit: Fig = ({ caption }) => {
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-wrap justify-center gap-5">
        <span className="flex flex-col items-center gap-1.5">
          <span className="relative block" style={{ width: 140, height: 140 }}>
            <span aria-hidden className="absolute" style={{ left: -35, top: 0, opacity: 0.25 }}>
              <RawPic kind="dusk" width={210} />
            </span>
            <Frame width={140} ratio="1:1" pic="dusk" mode={mode} />
          </span>
          <Sub mode={mode} strong="cover">
            사진 — 가운데를 남겨 자른다(흐린 곳이 잘린 자리)
          </Sub>
        </span>
        <span className="flex flex-col items-center gap-1.5">
          <Frame width={140} ratio="1:1" pic="logo-word" fit="contain" mode={mode} />
          <Sub mode={mode} strong="contain">
            로고 — 잘리지 않게, 둘레는 흰 판
          </Sub>
        </span>
      </div>
    </ModeBoard>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

// 상태 — 불러오는 중 · 다 받음 · 없음 · 실패
const States: Fig = ({ caption }) => {
  const l = IFL();
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {(
          [
            ['loading', '불러오는 중', '스켈레톤 — 면 + 반짝임'],
            ['loaded', '다 받음', `${l.reveal.ms}ms 투명도로 나타남`],
            ['none', '없음', '처음부터 대체 그림'],
            ['failed', '실패', `못 불러옴 · ${l.timeout / 1000}초가 지나도 안 옴`],
          ] as const
        ).map(([k, s, c]) => (
          <span key={k} className="flex flex-col items-center gap-1.5">
            <Frame width={132} ratio="4:3" pic={k === 'none' ? null : 'dusk'} state={k === 'loading' ? 'loading' : k === 'loaded' ? 'loaded' : 'fallback'} mode={mode} alt="저녁 하늘 사진" />
            <Sub mode={mode} strong={s}>
              {c}
            </Sub>
          </span>
        ))}
      </div>
    </ModeBoard>
  );
  return (
    <Panel caption={caption}>
      <div className="grid gap-4 md:grid-cols-2">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

// 그림 위 자리 — 네 모서리(점선) · 가장자리에서 6 · 위 시작 배지 · 아래 끝 Indicator, Indicator 를 키워 본 치수
const Overlay: Fig = ({ caption }) => {
  const l = IFL();
  const off = l.floater.offset;
  const ind = l.indicator;
  const W = 280;
  const H = W / l.ratios['4:3'].value;
  const slot = (p: (typeof IF_PLACEMENTS)[number]) => (
    <span key={p} aria-hidden className="absolute flex items-center justify-center text-[10px] font-bold" style={{ ...(p.startsWith('top') ? { top: off } : { bottom: off }), ...(p.endsWith('start') ? { left: off } : { right: off }), width: 66, height: 24, outline: `1px dashed ${MARK_LINE}`, background: 'rgba(255, 255, 255, 0.86)', color: MARK_LINE, zIndex: 1 }}>
      {PLACEMENT_KO[p]}
    </span>
  );
  const z = 3;
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 rounded-2xl px-4 py-8 pk-surface">
          <span className="flex flex-col items-center gap-2">
            <Frame width={W} pic="meadow" pins={<>{IF_PLACEMENTS.map(slot)}</>} />
            <Sub>네 자리 — 한 자리에 하나 · 틀 하나에 {l.floater.max}까지</Sub>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Frame width={W} pic="sea" floaters={[at('top-start', <Discontinued />), at('bottom-end', <Ind label="사진 12장 중 1번째">1 / 12</Ind>)]} />
            <Sub>위 시작 배지(solid) · 아래 끝 Indicator</Sub>
          </span>
          <span className="flex flex-col items-center gap-2">
            <Frame width={120} ratio="1:1" pic="forest" floaters={[at('bottom-end', <Ind label="사진 9장 더 있음">+9</Ind>)]} />
            <Sub>묶음 썸네일 &ldquo;+9&rdquo;</Sub>
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="relative inline-flex">
              <Ind label="사진 12장 중 1번째" zoom={z}>
                1 / 12
              </Ind>
              <Band style={{ left: 0, top: 0, width: ind.padX * z, height: ind.minH * z }} label={String(ind.padX)} vertical />
              <Band style={{ left: ind.padX * z, right: ind.padX * z, top: 0, height: ind.padY * z }} />
              <span aria-hidden className="absolute flex items-center" style={{ left: '100%', top: 0, bottom: 0, marginLeft: 6, borderLeft: `2px solid ${MARK_LINE}`, paddingLeft: 4 }}>
                <span className="rounded px-1 text-[10px] font-bold leading-4 text-white" style={{ background: MARK_LINE }}>
                  {ind.minH}
                </span>
              </span>
            </span>
            <Sub>
              3배로 본 Indicator — 높이 {ind.minH} · 좌우 {ind.padX} · 위아래 {ind.padY} · {ind.fontSize}/{ind.lineHeight} {ind.weight}
            </Sub>
          </span>
        </div>
        <Note>
          배지는 상태 · 분류, Indicator 는 장수 · 길이다. 둘 다 가장자리에서 {off}. 바탕 {ind.bgName}({ind.bg})는 두 모드 같다 — 흰 그림 위 흰 글자 {ratioText(contrastOf(ind.fg.light, over(ind.bg, '#FFFFFF')))}:1. 틀의 짧은 변이 {l.floater.minSide} 이상일 때만 얹는다
        </Note>
      </div>
    </Panel>
  );
};

// 세로 카드 그림 — 원래 그림을 시계 방향 90° 돌려 목록 56 · 격자 · 상세의 카드 비율 틀을 채운다
const CardRotate: Fig = ({ caption }) => {
  const l = IFL();
  const c = CARDS[1];
  return (
    <Panel caption={caption}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 rounded-2xl px-4 py-8 pk-surface">
          <span className="flex flex-col items-center gap-2">
            <RawPic kind="card-v" width={84} style={{ borderRadius: 6, overflow: 'hidden' }} />
            <Sub strong="원래 그림">540 × 856 — 폭 &lt; 높이</Sub>
          </span>
          <span className="flex flex-col items-center gap-1 pk-muted">
            <RotateCw aria-hidden size={22} strokeWidth={2} />
            <ArrowRight aria-hidden size={22} strokeWidth={2} />
            <span className="text-[11px]">시계 방향 {l.rotate}°</span>
          </span>
          <span className="flex flex-col items-center gap-3">
            <PhoneBoard>
              <Rows rows={[cardRow(c)]} />
            </PhoneBoard>
            <span className="flex flex-wrap items-start justify-center gap-6">
              <span className="flex flex-col items-center gap-2">
                <Card width={GRID.cell} issuer={c.issuer} name={c.name} pic={c.pic} />
                <Sub strong={`격자 ${GRID.cell}`}>모서리 8</Sub>
              </span>
              <span className="flex flex-col items-center gap-2">
                <Card width={312} issuer={c.issuer} name={c.name} pic={c.pic} />
                <Sub strong="상세 312">모서리 8 · 카드 전체가 거의 그대로</Sub>
              </span>
            </span>
          </span>
        </div>
        <Note>목록 56(모서리 {l.radius[imageFrameRadius(56, l.bands)].px}) · 격자 · 상세 모두 카드 비율 {l.ratios.card.value} — 돌린 뒤 cover 로 채워 줄 · 칸의 크기가 카드마다 같다. 방향은 다 받은 뒤 원래 크기로 정하고, 그때까지는 스켈레톤이다</Note>
      </div>
    </Panel>
  );
};

// 그림 없는 카드 — 아는 카드사의 면(작게 · 가운데 · 크게) · 모르는 카드사의 대체 그림. 카드 이름은 medium 한 줄 · large 두 줄까지(넘치면 말줄임)
const LONG_NAME = '트래블로그 체크 플러스 에디션';
const CardFace: Fig = ({ caption }) => {
  const ca = CAL();
  const clampKo = (n: number) => (n === 1 ? '한 줄' : `${n}줄까지`);
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-end justify-center gap-x-5 gap-y-4">
          <span className="flex flex-col items-center gap-1.5">
            <Card width={56} issuer="KB국민카드" name="톡톡 With" pic={null} mode={mode} />
            <Sub mode={mode} strong="small 56">
              첫 글자만 · {Math.round((56 / ca.ratio) * 10) / 10} 의 {Math.round(ca.initial.ratio * 100)}%
            </Sub>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <Card width={150} issuer="NH농협카드" name="NH올원 Pay" pic={null} mode={mode} />
            <Sub mode={mode} strong="medium 150">
              짙은 글자 — 흰 글자가 4.5 아래
            </Sub>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <Card width={150} issuer="하나카드" name={LONG_NAME} pic={null} mode={mode} />
            <Sub mode={mode} strong={`카드 이름 ${clampKo(ca.sizes.medium.nameClamp)}`}>
              넘치면 말줄임
            </Sub>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <Card width={150} issuer="BC카드" name="바로 카드" pic={null} mode={mode} />
            <Sub mode={mode} strong="모르는 카드사">
              대체 그림(credit-card)
            </Sub>
          </span>
        </div>
        <span className="flex max-w-full flex-col items-center gap-1.5 overflow-x-auto">
          <Card width={312} issuer="신한카드" name={`데일리 플러스 ${LONG_NAME}`} pic={null} mode={mode} />
          <Sub mode={mode} strong={`large 312 — 폭 ${ca.bands.large} 이상`}>
            회사 · 카드 이름 한 단계 크게 · 카드 이름 {clampKo(ca.sizes.large.nameClamp)}
          </Sub>
        </span>
      </div>
    </ModeBoard>
  );
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[700px] gap-4">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

// 큰 글자 × 좁은 면 — 회사 줄 + 이름 한 줄 + 아래 여백이 면 높이보다 크면 첫 글자 면(card-art.yaml label.fit, 2026-10-17 03-D 결정 3 A).
// 글자만 배율로 키운다(여백 · 면은 그대로). "지어낸카드" · 노란 면은 지어낸 것이다(기관 색 표 밖 — 그림용)
const FACE_SCALE_W = [96, 110, 124, 150];
const FACE_SCALES = [1, 1.3, 2];
const FaceScale: Fig = ({ caption }) => {
  const ca = CAL();
  const face = { bg: '#F2B705', fg: ca.text.dark };
  const need = (w: number, sc: number) => {
    const s = w >= ca.bands.large ? ca.sizes.large : ca.sizes.medium;
    return (s.issuer.lineHeight + s.name.lineHeight) * sc + s.padBottom;
  };
  const board = (mode: 'light' | 'dark') => (
    <ModeBoard mode={mode}>
      <div className="flex flex-col gap-4 overflow-x-auto">
        {FACE_SCALES.map((sc) => (
          <div key={sc} className="flex items-end gap-3">
            <b className="w-14 shrink-0 whitespace-nowrap text-[12px]" style={{ color: tone('fg-neutral-subtle', mode) }}>
              글자 {Math.round(sc * 100)}%
            </b>
            {FACE_SCALE_W.map((w) => {
              const h = Math.round((w / ca.ratio) * 10) / 10;
              const n = Math.round(need(w, sc) * 10) / 10;
              return (
                <span key={w} className="flex shrink-0 flex-col items-center gap-1.5">
                  <CardArtView look={IFL()} ca={ca} face={face} issuer="지어낸카드" name="탄탄 올림 체크카드" width={w} pic={null} mode={mode} textScale={sc} />
                  <Sub mode={mode} strong={`${w} · 면 ${h}`}>
                    글 {n} — {n > h ? '첫 글자' : '이름'}
                  </Sub>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </ModeBoard>
  );
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[760px] gap-4">
        {board('light')}
        {board('dark')}
      </div>
    </Panel>
  );
};

// ── Guidelines ────────────────────────────────────────────
// 무엇을 Image Frame 으로 — 사람 · 물건 · 그림 · 분류 · 비율 상자
const WhichGuide: Fig = ({ caption }) => {
  const lk = dk().avatar;
  return (
    <Panel caption={caption}>
      <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-4 sm:grid-cols-2">
        <Cell strong="사람 → Avatar" cap="원, 사진 또는 이니셜">
          <span className="flex items-center gap-3">
            <AvatarView look={lk} size="42" name="김민수" />
            <AvatarView look={lk} size="42" name="서다은" photo={1} />
          </span>
        </Cell>
        <Cell strong="물건 → Logo Tile" cap="은행 · 증권 · 카드 · 코인 · 금 · 회사 — 기관 색 + 첫 글자">
          <span className="flex items-center gap-3">
            <Logo name="신한" />
            <Logo name="유안타증권" />
            <Logo name="업비트" />
            <Logo name="비상금" face="name" />
          </span>
        </Cell>
        <Cell strong="그림 → Image Frame" cap="사진 · 카드 그림 · 규정 그림">
          <span className="flex items-center gap-3">
            <Card width={56} issuer="신한카드" name="데일리 플러스" pic="card-h" />
            <Frame width={48} ratio="1:1" pic="rule-vacation" />
            <Frame width={64} ratio="4:3" pic="meadow" />
          </span>
        </Cell>
        <Cell strong="분류 → List 타일" cap="카테고리 · 기능 — 옅은 색 + 아이콘">
          <span style={{ width: 200 }}>
            <Rows rows={[{ kind: 'view', prefix: { tile: 'orange', icon: 'utensils' }, title: '식비' }]} />
          </span>
        </Cell>
        <div className="sm:col-span-2">
          <Cell strong="그림이 아닌 비율 상자 → Aspect Ratio" cap="동영상 · 지도 — 모서리 · 윤곽이 없다">
            <span className="block" style={{ width: 200 }}>
              <AspectRatioView look={ARL()} ratio="16:9">
                <VideoChild frame={ARL().ratios['16:9'].value} label="자산 연결 안내 동영상" />
              </AspectRatioView>
            </span>
          </Cell>
        </div>
      </div>
    </Panel>
  );
};

// 투명 윤곽 하나 — 불투명한 테(stroke-neutral-subtle)는 어두운 카드 둘레에 옅은 테가 생긴다
const StrokeGuide: Fig = ({ caption }) => {
  const t = imageTones();
  const set = (mode: 'light' | 'dark', opaque: boolean) => (
    <span className="flex flex-col items-center gap-2 rounded-xl p-4" style={{ background: rc('bg-layer-default', mode) }}>
      <span className="flex gap-3">
        <Frame width={110} ratio="card" pic="card-dark" mode={mode} stroke={opaque ? 'opaque' : 'overlay'} opaqueStroke={t['stroke-neutral-subtle']} />
        <Frame width={110} ratio="card" pic="card-white" mode={mode} stroke={opaque ? 'opaque' : 'overlay'} opaqueStroke={t['stroke-neutral-subtle']} />
      </span>
      <Zoom mode={mode} w={120} h={64} label={modeKo(mode)}>
        <Frame width={110} ratio="card" pic="card-dark" mode={mode} stroke={opaque ? 'opaque' : 'overlay'} opaqueStroke={t['stroke-neutral-subtle']} />
      </Zoom>
    </span>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="투명 윤곽(stroke-neutral-overlay) — 흰 카드 둘레는 잡히고 어두운 카드 둘레에는 테가 없다" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {set('light', false)}
            {set('dark', false)}
          </div>
        </Verdict>
        <Verdict ok={false} note="불투명한 테(stroke-neutral-subtle) — 어두운 카드 둘레에 옅은 테가 생긴다" bg={BASEMENT}>
          <div className="flex flex-wrap justify-center gap-3">
            {set('light', true)}
            {set('dark', true)}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 불러오는 동안도 같은 모서리 — 스켈레톤 16 이 그림 8 로 바뀌는 줄
const RadiusGuide: Fig = ({ caption }) => {
  const l = IFL();
  const c = CARDS[0];
  const w = 112;
  const row = (st: 'loading' | 'loaded', r?: number) => (
    <div className="flex items-center gap-4 py-2">
      <Card width={w} issuer={c.issuer} name={c.name} pic={c.pic} state={st} radius={st === 'loading' ? r : undefined} />
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-medium leading-5 pk-text">{c.name}</span>
        <span className="text-[12px] leading-4 pk-muted">{st === 'loading' ? `불러오는 중 — 모서리 ${r ?? l.radius[imageFrameRadius(w, l.bands)].px}` : `다 받음 — 모서리 ${l.radius[imageFrameRadius(w, l.bands)].px}`}</span>
      </span>
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note={`스켈레톤 · 그림이 같은 모서리(폭 ${w} → ${l.radius[imageFrameRadius(w, l.bands)].px}) — 그림이 와도 모양이 그대로다`} bg={BASEMENT}>
          <div className="w-[270px] rounded-2xl px-5 py-2 pk-surface">
            {row('loading')}
            {row('loaded')}
          </div>
        </Verdict>
        <Verdict ok={false} note="스켈레톤 16(옛 '카드 · 썸네일') — 그림이 오는 순간 모서리가 8 로 바뀐다" bg={BASEMENT}>
          <div className="w-[270px] rounded-2xl px-5 py-2 pk-surface">
            {row('loading', l.sk.radius['16'])}
            {row('loaded')}
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 세로 카드는 돌려서 채운다 — 가운데만 잘린 지금
const RotateGuide: Fig = ({ caption }) => {
  const c = CARDS[1];
  return (
    <Panel caption={caption}>
      <Pair stack>
        <Verdict ok note="돌려서 채운다 — 카드 전체가 보이고 줄 · 격자의 크기가 카드마다 같다" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard>
              <Rows rows={[cardRow(c)]} />
            </PhoneBoard>
            <Card width={GRID.cell} issuer={c.issuer} name={c.name} pic={c.pic} />
          </div>
        </Verdict>
        <Verdict ok={false} note="가로 틀에 그대로 채운다 — 높이의 가운데 띠만 보인다(지금)" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard>
              <Rows rows={[{ ...cardRow(c), prefix: { node: <CropCard w={56} /> } }]} />
            </PhoneBoard>
            <CropCard w={GRID.cell} />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};
// 나쁜 예 — 세로 그림을 돌리지 않고 가로 틀에 cover(지금 제품)
function CropCard({ w }: { w: number }) {
  return <Frame width={w} ratio="card" pic="card-v" turn={false} />;
}

// 그림 없는 카드는 카드사 색으로 — 모르는 회사를 브랜드 파랑으로 칠한 화면
const FaceGuide: Fig = ({ caption }) => {
  const t = imageTones();
  const cells = (bad: boolean) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3" style={{ width: 2 * 128 + 12 }}>
      {[CARDS[2], CARDS[3], { ...CARDS[0], pic: null }, CARDS[4]].map((c) => (
        <span key={c.name} className="flex flex-col gap-1">
          {bad && c.issuer === 'BC카드' ? (
            <Frame
              width={128}
              ratio="card"
              pic={null}
              fallback={
                <span aria-hidden className="absolute flex flex-col justify-end" style={{ top: 0, right: 0, bottom: 0, left: 0, paddingLeft: 10, paddingRight: 10, paddingBottom: 8, background: t['bg-brand-solid'].light, color: t['static-white'].light }}>
                  <span className="text-[12px] font-medium leading-4">{c.issuer}</span>
                  <span className="text-[14px] font-bold leading-[19px]">{c.name}</span>
                </span>
              }
            />
          ) : (
            <Card width={128} issuer={c.issuer} name={c.name} pic={null} />
          )}
          <span className="truncate text-[12px] font-bold leading-4 pk-text">{c.name}</span>
        </span>
      ))}
    </div>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="아는 카드사(NH농협 · KB국민 · 신한)는 기관 색 면, 모르는 카드사(BC)는 대체 그림" bg={BASEMENT}>
          <div className="rounded-2xl p-4 pk-surface">{cells(false)}</div>
        </Verdict>
        <Verdict ok={false} note="모르는 카드사를 브랜드 파랑으로 칠했다 — 그 회사의 색처럼 보인다" bg={BASEMENT}>
          <div className="rounded-2xl p-4 pk-surface">{cells(true)}</div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 상세에는 카드 이름을 글로 — 그림만 있는 상세
const NameGuide: Fig = ({ caption }) => {
  const c = CARDS[0];
  const detail = (named: boolean) => (
    <Screen title="카드 상세" scale={0.62} h={520}>
      <div className="flex flex-col items-center px-6 pt-2" style={{ gap: 16 }}>
        <Card width={312} issuer={c.issuer} name={c.name} pic={c.pic} />
        {named && (
          <span className="flex w-full flex-col" style={{ gap: 2 }}>
            <span className="text-[20px] font-bold leading-[27px]" style={{ color: tone('fg-neutral') }}>
              {c.name}
            </span>
            <span className="text-[14px] leading-[19px]" style={{ color: tone('fg-neutral-subtle') }}>
              {c.issuer}
            </span>
          </span>
        )}
      </div>
    </Screen>
  );
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note="그림 아래 카드 이름 · 카드사를 글로 — 그림을 못 읽어도 이름이 남는다" bg={BASEMENT}>
          {detail(true)}
        </Verdict>
        <Verdict ok={false} note='제목은 "카드 상세" 뿐 — 이름은 그림 속 글 · alt 에만 있다' bg={BASEMENT}>
          {detail(false)}
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 그림 위는 둘까지, 역할대로 — 셋을 얹은 그림 · 장수를 배지에 넣은 그림
const OverlayGuide: Fig = ({ caption }) => {
  const l = IFL();
  const off = l.floater.offset;
  const W = 150;
  return (
    <Panel caption={caption}>
      <Pair stack>
        <Verdict ok note="상태는 배지(위 시작), 장수는 Indicator(아래 끝) — 둘까지" bg={BASEMENT}>
          <div className="flex flex-wrap items-start justify-center gap-3 rounded-2xl p-4 pk-surface">
            <Card width={W} issuer="현대카드" name="M 에디션" pic="card-h2" floaters={[at('top-start', <Discontinued />)]} />
            <Frame width={W} ratio="1:1" pic="forest" floaters={[at('bottom-end', <Ind label="사진 9장 더 있음">+9</Ind>)]} />
          </div>
        </Verdict>
        <Verdict ok={false} note="배지 · 장수 · 하트 셋을 얹었고, 장수를 배지로 그렸다" bg={BASEMENT}>
          <div className="flex flex-wrap items-start justify-center gap-3 rounded-2xl p-4 pk-surface">
            <Frame
              width={W}
              ratio="card"
              pic="card-h2"
              pins={
                <>
                  <span className="absolute" style={{ left: off, top: off, zIndex: 3 }}>
                    <Discontinued />
                  </span>
                  <span className="absolute" style={{ right: off, bottom: off, zIndex: 3 }}>
                    <Ind label="사진 3장 중 1번째">1 / 3</Ind>
                  </span>
                  <span aria-hidden className="absolute grid place-items-center" style={{ right: 0, top: 0, width: 40, height: 40, zIndex: 3, color: '#FFFFFF' }}>
                    <Heart size={22} strokeWidth={2} />
                  </span>
                </>
              }
            />
            <Frame
              width={W}
              ratio="1:1"
              pic="forest"
              pins={
                <span className="absolute" style={{ right: off, bottom: off, zIndex: 3 }}>
                  <B l="사진 +9" v="solid" t="brand" />
                </span>
              }
            />
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 여러 장은 끝이 보이는 가로 줄 — 4:5 · 사이 8 · 다음 장이 보인다 + "1 / 12". 화살표 · 점 · 자동 넘김(옛 Carousel)
const GALLERY: PicKind[] = ['meadow', 'sunset', 'sea', 'forest', 'dusk'];
const GalleryGuide: Fig = ({ caption }) => {
  const fog = scrollFogLook();
  const w = 140;
  const gap = 8;
  const pad = fog.uses.row.pad.left ?? 0;
  const next = 360 - pad - (w + gap) * 2;
  return (
    <Panel caption={caption}>
      <Pair stack>
        <Verdict ok note={`가로 줄 4:5 · 사이 ${gap} — 셋째 장이 ${next} 보여(끝 흐림 ${fog.uses.row.sides.right}) 넘길 수 있음을 안다. 크게 볼 때는 "1 / 12"`} bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard pad={12}>
              <ScrollFogView look={fog} use="row" live={false}>
                <div className="flex" style={{ gap }}>
                  {GALLERY.map((p) => (
                    <Frame key={p} width={w} ratio="4:5" pic={p} />
                  ))}
                </div>
              </ScrollFogView>
            </PhoneBoard>
            <Screen title="사진" scale={0.62} h={600}>
              <Frame bleed fill ratio="1:1" pic="sea" width={360} floaters={[at('bottom-end', <Ind label="사진 12장 중 1번째">1 / 12</Ind>)]} />
              <div className="flex flex-col px-6 pt-4" style={{ gap: 4 }}>
                <span className="text-[17px] font-bold leading-6" style={{ color: tone('fg-neutral') }}>
                  바닷가 산책
                </span>
                <span className="text-[14px] leading-[19px]" style={{ color: tone('fg-neutral-subtle') }}>
                  한 장씩 크게 볼 때 — 오른쪽 아래 &ldquo;1 / 12&rdquo;
                </span>
              </div>
            </Screen>
          </div>
        </Verdict>
        <Verdict ok={false} note="화살표 32 · 점 지시자 · 자동 넘김 — 다음 장이 보이지 않고, 화살표는 누르는 영역이 작다(옛 Carousel)" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <PhoneBoard pad={16}>
              <div className="flex items-center justify-center gap-2">
                {[ChevronLeft, null, ChevronRight].map((I, i) =>
                  I ? (
                    <span key={i} aria-hidden className="grid shrink-0 place-items-center rounded-full" style={{ width: 32, height: 32, background: rc('bg-layer-default'), boxShadow: `inset 0 0 0 1px ${rc('stroke-neutral-weak')}`, color: rc('fg-neutral') }}>
                      <I size={16} strokeWidth={2} />
                    </span>
                  ) : (
                    <Frame key={i} width={240} ratio="4:3" pic="meadow" />
                  ),
                )}
              </div>
              <div className="flex justify-center gap-1.5 pt-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} aria-hidden className="block rounded-full" style={{ width: 6, height: 6, background: rc(i === 0 ? 'fg-brand' : 'stroke-neutral-weak') }} />
                ))}
              </div>
              <div className="pt-2 text-center text-[11px] pk-muted">5초마다 자동 넘김</div>
            </PhoneBoard>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 흐리게 · 크게 하지 않는다 — 단종은 배지 · 흐린 그림 · 마우스에 1.05배 커지는 카드
const DimGuide: Fig = ({ caption }) => {
  const c = CARDS[5];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='단종은 "단종" 배지 — 그림은 그대로, 마우스를 올려도 바뀌지 않는다' bg={BASEMENT}>
          <div className="rounded-2xl p-4 pk-surface">
            <CardCell c={c} width={150} />
          </div>
        </Verdict>
        <Verdict ok={false} note="단종 카드를 불투명도로 흐렸고(0.6), 마우스에 1.05배 커진다" bg={BASEMENT}>
          <div className="flex gap-4 rounded-2xl p-4 pk-surface">
            <span className="flex flex-col gap-1.5" style={{ width: 112 }}>
              <Card width={112} issuer={c.issuer} name={c.name} pic={c.pic} dim={0.6} />
              <span className="truncate text-[13px] font-bold leading-[18px] pk-text" style={{ opacity: 0.6 }}>
                {c.name}
              </span>
            </span>
            <span className="relative flex flex-col gap-1.5" style={{ width: 112 }}>
              <Card width={112} issuer="신한카드" name="데일리 플러스" pic="card-h" scale={1.05} />
              <span className="truncate text-[13px] font-bold leading-[18px] pk-text">데일리 플러스</span>
              <MousePointer2 aria-hidden size={20} strokeWidth={2} className="absolute pk-text" style={{ left: 70, top: 44 }} fill="currentColor" />
            </span>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// 이름 옆이면 장식, 혼자면 이름 — 이름을 두 번 읽는 카드 혜택
const AltGuide: Fig = ({ caption }) => {
  const c = CARDS[0];
  return (
    <Panel caption={caption}>
      <Pair>
        <Verdict ok note='그림 옆에 이름이 있다 — 그림은 alt="" 로 숨기고 이름을 한 번만 읽는다' bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl p-4 pk-surface">
              <CardCell c={c} width={150} />
            </div>
            <Reading tone="ok">&ldquo;{c.name}, {c.issuer}&rdquo;</Reading>
          </div>
        </Verdict>
        <Verdict ok={false} note="alt 가 옆 이름과 같다 — 같은 이름을 두 번 읽는다" bg={BASEMENT}>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl p-4 pk-surface">
              <CardCell c={c} width={150} />
            </div>
            <Reading tone="bad">&ldquo;{c.name}, 이미지, {c.name}, {c.issuer}&rdquo;</Reading>
          </div>
        </Verdict>
      </Pair>
    </Panel>
  );
};

// ── 코드 예시(미리보기) — image-frame.md 의 코드 그대로 ──────
function Preview({ children, caption, w = 400, pad = 24 }: { children: ReactNode; caption?: string; w?: number; pad?: number }) {
  return (
    <figure className="not-prose mb-0 mt-6">
      <div className="flex min-h-[110px] items-center justify-center rounded-t-xl border border-b-0 border-fd-border" style={{ background: rc('bg-layer-default'), paddingTop: pad, paddingBottom: pad, paddingLeft: 8, paddingRight: 8 }}>
        <div className="w-full" style={{ maxWidth: w }}>
          {children}
        </div>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
const ExList: Fig = ({ caption }) => (
  <Preview caption={caption} w={360} pad={12}>
    <Rows rows={CARDS.slice(0, 4).map((c) => cardRow(c))} />
  </Preview>
);
const ExGrid: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <div className="grid" style={{ gridTemplateColumns: `repeat(2, ${GRID.cell}px)`, columnGap: GRID.gap, rowGap: 16 }}>
      {[CARDS[5], CARDS[0], CARDS[2], CARDS[1]].map((c) => (
        <div key={c.name} className="min-w-0">
          <Card width={GRID.cell} fill issuer={c.issuer} name={c.name} pic={c.pic} floaters={c.discontinued ? [at('top-start', <Discontinued />)] : undefined} />
          <p className="m-0 truncate text-[14px] font-bold leading-[19px] pk-text">{c.name}</p>
        </div>
      ))}
    </div>
  </Preview>
);
const ExDetail: Fig = ({ caption }) => {
  const c = CARDS[0];
  return (
    <Preview caption={caption} w={312}>
      <div className="flex flex-col" style={{ gap: 12 }}>
        <Card width={312} issuer={c.issuer} name={c.name} pic={c.pic} />
        <div>
          <h2 className="m-0 text-[20px] font-bold leading-[27px] pk-text">{c.name}</h2>
          <p className="m-0 text-[14px] leading-[19px] pk-muted">{c.issuer}</p>
        </div>
      </div>
    </Preview>
  );
};
const ExRule: Fig = ({ caption }) => (
  <Preview caption={caption} w={312}>
    <div className="grid" style={{ gridTemplateColumns: `repeat(2, ${GRID.cell}px)`, columnGap: GRID.gap }}>
      {RULES.slice(0, 2).map((r) => (
        <RuleCard key={r.title} r={r} width={GRID.cell} />
      ))}
    </div>
  </Preview>
);
const ExGallery: Fig = ({ caption }) => {
  const fog = scrollFogLook();
  return (
    <Preview caption={caption} w={360} pad={16}>
      <div className="flex flex-col" style={{ gap: 16 }}>
        <ScrollFogView look={fog} use="row" tabIndex={0} ariaLabel="사진">
          <div className="flex" style={{ gap: 8 }}>
            {GALLERY.map((p) => (
              <Frame key={p} width={144} ratio="4:5" pic={p} alt={PICS[p].ko} />
            ))}
          </div>
        </ScrollFogView>
        <Frame bleed fill width={360} ratio="1:1" pic="sea" alt="바닷가 사진" floaters={[at('bottom-end', <Ind label="사진 12장 중 1번째">1 / 12</Ind>)]} />
      </div>
    </Preview>
  );
};

export const imageFrameFigures: Record<string, Fig> = {
  hero: Hero,
  playground: Playground,
  anatomy: Anatomy,
  ratio: Ratio,
  radius: Radius,
  stroke: Stroke,
  fit: Fit,
  states: States,
  overlay: Overlay,
  'card-rotate': CardRotate,
  'card-face': CardFace,
  'card-face-scale': FaceScale,
  'which-guide': WhichGuide,
  'stroke-guide': StrokeGuide,
  'radius-guide': RadiusGuide,
  'rotate-guide': RotateGuide,
  'face-guide': FaceGuide,
  'name-guide': NameGuide,
  'overlay-guide': OverlayGuide,
  'gallery-guide': GalleryGuide,
  'dim-guide': DimGuide,
  'alt-guide': AltGuide,
  'ex-list': ExList,
  'ex-grid': ExGrid,
  'ex-detail': ExDetail,
  'ex-rule': ExRule,
  'ex-gallery': ExGallery,
};
