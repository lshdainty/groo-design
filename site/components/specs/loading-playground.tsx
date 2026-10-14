'use client';
// 기다림 묶음의 플레이그라운드 — 속성을 고르면 스펙대로 그린 모습과 그 코드가 바뀐다(실제로 기다리고 · 돌고 · 차고 · 스크롤된다).
// 값은 loading-look 이 YAML 에서 푼 것(LoadingKit)만 쓴다. 코드는 각 스펙 md 의 "코드" 절과 같은 레시피 API 로 쓴다.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ButtonLook } from './button-look';
import { ButtonView } from './button-view';
import type { ChipLook } from './chip-shared';
import { ChipView } from './chip-view';
import type { ResultSectionLook } from './feedback-shared';
import { ResultSectionView } from './feedback-view';
import type { ListLook } from './list-shared';
import { ListView } from './list-view';
import { CATEGORY, FILTER_CHIPS, TERMS } from './loading-data';
import { CP_GLYPHS, FONT, FOG_USES, PC_TONES, glyphSize, lcv, phaseAt, won, type CpGlyph, type FogUse, type LdColor, type LdScreen, type LdTone, type LoadingKit, type PcSize, type PcTone, type PgMeaning, type SkText, type ViewMode } from './loading-shared';
import { ContentPlaceholderView, ProgressCircleView, ProgressView, ScrollFogView, SkeletonView, SlowTextView } from './loading-view';
import { BRANDS, MODES, PlayFrame, Seg } from './select-playground';

type Brand = 'desk' | 'hr';
const tone = (s: LdScreen, n: LdTone, mode: ViewMode) => lcv(s[n], mode);
const q = (s: string) => JSON.stringify(s);
// 받침이 있으면 "을", 없으면 "를"
const objOf = (w: string) => {
  const c = w.charCodeAt(w.length - 1);
  return `${w}${c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? '을' : '를'}`;
};
const Note = ({ children }: { children: ReactNode }) => <p className="m-0 text-[12px] leading-5 text-fd-muted-foreground sm:col-span-2">{children}</p>;
function Slider({ label, value, min, max, step = 1, onChange, ticks, format }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; ticks?: number[]; format?: (v: number) => string }) {
  return (
    <label className="flex flex-col gap-1.5 sm:col-span-2">
      <span className="flex justify-between text-[12px] font-medium text-fd-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-fd-foreground">{format ? format(value) : value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-fd-foreground)]" />
      {ticks && (
        <span className="relative h-4 text-[11px] tabular-nums text-fd-muted-foreground">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${((t - min) / (max - min)) * 100}%` }}>
              {format ? format(t) : t}
            </span>
          ))}
        </span>
      )}
    </label>
  );
}
// WCAG 2 대비(브라우저에서 — 토큰 값으로)
function lum(hex: string) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, s) => s - p);
  return ((x + 0.05) / (y + 0.05)).toFixed(2);
};

// ══ Skeleton ═════════════════════════════════════════════
type SkShape = 'text' | 'card' | 'avatar' | 'photo';
const SK_SHAPES = [
  ['text', '글'],
  ['card', '카드 면'],
  ['avatar', '아바타'],
  ['photo', '사진'],
] as const;
const SK_TEXT_OPTS = [
  ['t2', 't2 12'],
  ['t3', 't3 13'],
  ['t4', 't4 14'],
  ['t5', 't5 16'],
  ['t7', 't7 20'],
] as const;
const SK_CONTEXT: Record<SkShape, { title: string; what: string }> = {
  text: { title: '최근 메모', what: '메모' },
  card: { title: '카드 혜택', what: '카드 혜택' },
  avatar: { title: '함께 쓰는 사람', what: '함께 쓰는 사람' },
  photo: { title: '영수증 사진', what: '사진' },
};
const skFallback = (shape: SkShape, text: SkText) =>
  shape === 'text' ? `<Skeleton text="${text}" className="w-40" />` : shape === 'card' ? '<Skeleton radius="16" className="h-28 w-full" />' : shape === 'avatar' ? '<Skeleton radius="full" className="size-10" />' : '<Skeleton radius="0" className="aspect-[4/3] w-full" />';

export function SkeletonPlayground({ kit, screen, result }: { kit: LoadingKit; screen: LdScreen; result: ResultSectionLook }) {
  const sk = kit.skeleton;
  const r = sk.region;
  const end = r.timeout + 2000;
  const [shape, setShape] = useState<SkShape>('text');
  const [text, setText] = useState<SkText>('t4');
  const [still, setStill] = useState<'off' | 'on'>('off');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [t, setT] = useState(r.showAfter + 500);
  const [playing, setPlaying] = useState(false);
  const t0 = useRef(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const e = performance.now() - t0.current;
      setT(Math.min(e, end));
      if (e >= end) setPlaying(false);
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, end]);
  const play = () => {
    t0.current = performance.now();
    setT(0);
    setPlaying(true);
  };
  const phase = phaseAt(r, t);
  const ctx = SK_CONTEXT[shape];
  const code = useMemo(() => {
    const lines = [
      'import { LoadingRegion, Skeleton } from "@/components/ui/skeleton"',
      'import { ResultSection } from "@/components/ui/result-section"',
      '',
      ...(still === 'on' ? ['{/* 모션 줄이기면 띠가 멈추고 면만 남는다 — 기기 설정을 따르므로 코드는 같다 */}'] : []),
      '<LoadingRegion',
      '  pending={query.isPending}',
      '  failed={query.isError && !query.data}',
      `  fallback={${skFallback(shape, text)}}`,
      `  failure={<ResultSection kind="failure" size="medium" title=${q(`${objOf(ctx.what)} 불러오지 못했어요`)} primaryAction={{ label: "다시 시도", onClick: () => query.refetch() }} />}`,
      '>',
      '  {content}',
      '</LoadingRegion>',
    ];
    return lines.join('\n');
  }, [shape, text, still, ctx.what]);
  const failTitle = `${objOf(ctx.what)} 불러오지 못했어요`;
  const bone = (hidden: boolean) => {
    const common = { look: sk, mode, still: still === 'on', hidden };
    if (shape === 'text') return <SkeletonView {...common} text={text} width={160} />;
    if (shape === 'card') return <SkeletonView {...common} radius="16" width="100%" height={112} />;
    if (shape === 'avatar') return <SkeletonView {...common} radius="full" width={40} height={40} />;
    return <SkeletonView {...common} radius="0" width="100%" style={{ aspectRatio: '4 / 3' }} />;
  };
  const photo = shape === 'photo';
  const label = phase === 'quiet' ? '틀만 — 데이터 자리는 보이지 않게 그려 높이를 지킨다' : phase === 'waiting' ? '스켈레톤 — 숨은 상태 글 "불러오는 중…"' : phase === 'slow' ? '+ 오래 걸림 글 — 한 번 읽힌다' : '요청 제한 — 실패 + 다시 시도';
  return (
    <PlayFrame
      surface={tone(screen, 'bg-layer-basement', mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          {/* 카드 — card.yaml 의 면 · 머리(위 24 · 좌우 24 · 아래 4 · 제목 16 / 22 · 700). 본문이 아래 24 를 가진다 */}
          <div style={{ boxSizing: 'border-box', borderRadius: screen.card.radius, borderWidth: screen.card.borderW, borderStyle: 'solid', borderColor: tone(screen, 'stroke-neutral-weak', mode), overflow: 'hidden', background: tone(screen, 'bg-layer-default', mode), fontFamily: FONT, minHeight: 340 }}>
            <div style={{ paddingTop: screen.card.head.top, paddingRight: screen.card.head.x, paddingBottom: screen.card.head.bottom, paddingLeft: screen.card.head.x, fontFamily: screen.card.title.fontFamily, fontSize: screen.card.title.fontSize, lineHeight: screen.card.title.lineHeight, fontWeight: screen.card.title.fontWeight, color: tone(screen, 'fg-neutral', mode) }}>{ctx.title}</div>
            {phase === 'failed' ? (
              // 카드 안 결과 — 좌우는 카드의 24 만(결과 자리의 좌우 0)
              <div style={{ paddingTop: 24, paddingRight: sk.slowText.padXList, paddingBottom: 24, paddingLeft: sk.slowText.padXList }}>
                <ResultSectionView look={result} mode={mode} kind="failure" size="medium" inCard live title={failTitle} description="잠시 후 다시 시도해주세요." primary={{ label: '다시 시도', onClick: play }} />
              </div>
            ) : (
              <div aria-busy style={{ display: 'flex', flexDirection: 'column', gap: sk.slowText.gap, padding: photo ? '0 0 24px' : '0 24px 24px' }}>
                {phase === 'slow' && <SlowTextView look={sk} mode={mode} style={photo ? { paddingLeft: sk.slowText.padXList, paddingRight: sk.slowText.padXList } : undefined} />}
                {bone(phase === 'quiet')}
              </div>
            )}
          </div>
          <span className="text-[12px] leading-4 text-fd-muted-foreground" aria-live="off">
            {(t / 1000).toFixed(1)}초 — {label}
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="모양" value={shape} options={SK_SHAPES} onChange={setShape} />
          {shape === 'text' ? (
            <Seg label="글자 크기 text — 높이는 그 글자의 줄 높이" value={text} options={SK_TEXT_OPTS} onChange={setText} />
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px] text-fd-muted-foreground">
              <span className="font-medium">모서리 radius</span>
              <span>{shape === 'card' ? '카드 면 16(썸네일 · 카드 그림 같은 그림 자리는 Image Frame 의 모서리 4 · 6 · 8)' : shape === 'avatar' ? '아바타 full' : '화면 끝에 붙는 사진 0'} — 곧 올 내용의 모양을 따른다.</span>
            </div>
          )}
          <Slider label="기다린 시간" value={t} min={0} max={end} step={100} onChange={(v) => (setPlaying(false), setT(v))} ticks={[0, r.showAfter, r.slowAfter, r.timeout]} format={(v) => `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}초`} />
          <div className="flex flex-wrap items-end gap-3">
            <button type="button" onClick={play} className="rounded-md bg-fd-foreground px-3 py-1.5 text-[13px] font-medium text-fd-background">
              처음부터 기다리기
            </button>
            <Seg label="모션 줄이기" value={still} options={[['off', '끔'], ['on', '켬(띠가 멈춘다)']] as const} onChange={setStill} />
          </div>
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Note>
            {r.showAfter / 1000}초까지는 틀만 그리고 자리를 지킨다 · {r.slowAfter / 1000}초에 &quot;평소보다 오래 걸리고 있어요.&quot; · {r.timeout / 1000}초면 실패(요청 제한 — 다시 시도는 그 안에서 {r.retry}번, {r.retryDelays.map((d) => `${d / 1000}초`).join(' · ')} 뒤).
          </Note>
        </>
      }
    />
  );
}

// ══ Progress Circle ══════════════════════════════════════
type PcSurface = 'default' | 'floating' | 'dim' | 'inverted';
const PC_SURFACES = [
  ['default', '흰 면'],
  ['floating', '떠 있는 면'],
  ['dim', '사진 위 딤'],
  ['inverted', '짙은 채움'],
] as const;
// 사진(그림) — 딤 아래 깔리는 장면
const PHOTO_BG = 'linear-gradient(160deg, #9DB7D5 0%, #6E8FB3 45%, #5A6E52 46%, #7F9A6A 100%)';
export function ProgressCirclePlayground({ kits, screens }: { kits: Record<Brand, LoadingKit>; screens: Record<Brand, LdScreen> }) {
  const [size, setSize] = useState<PcSize>('40');
  const [toneV, setTone] = useState<PcTone>('neutral');
  const [has, setHas] = useState<'none' | 'value'>('none');
  const [value, setValue] = useState(40);
  const [surface, setSurface] = useState<PcSurface>('default');
  const [still, setStill] = useState<'off' | 'on'>('off');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const kit = kits[brand];
  const screen = screens[brand];
  const pc = kit.circle;
  const det = has === 'value';
  const code = useMemo(() => {
    const attrs = [...(size !== pc.defaults.size ? [`size=${q(size)}`] : []), ...(toneV !== pc.defaults.tone ? [`tone=${q(toneV)}`] : []), ...(det ? [`value={${value}}`] : []), `aria-label=${q('불러오는 중')}`];
    return `import { ProgressCircle } from "@/components/ui/progress-circle"\n\n${still === 'on' ? '{/* 모션 줄이기 — 값 없는 원은 돌지 않는 3/4 호, 채움은 바로 바뀐다(기기 설정을 따른다) */}\n' : ''}${toneV === 'inherit' ? '<span className="text-fg-brand">\n  ' : ''}<ProgressCircle ${attrs.join(' ')} />${toneV === 'inherit' ? '\n</span>' : ''}`;
  }, [size, toneV, det, value, still, pc.defaults]);
  const bg: Record<PcSurface, string> = {
    default: tone(screen, 'bg-layer-default', mode),
    floating: tone(screen, 'bg-layer-floating', mode),
    dim: tone(screen, 'bg-layer-default', mode),
    inverted: tone(screen, 'bg-neutral-inverted', mode),
  };
  // 원 : 바탕 대비 — 라이트 · 다크(값 있는 원 · 톤마다)
  const face = toneV === 'inherit' ? null : pc.tones[toneV];
  const surfHex = (m: 'light' | 'dark'): string => {
    const c: LdColor = surface === 'floating' ? screen['bg-layer-floating'] : surface === 'inverted' ? screen['bg-neutral-inverted'] : screen['bg-layer-default'];
    return m === 'dark' ? c.dark : c.light;
  };
  const contrastNote = face && surface !== 'dim' && /^#/.test(face.range.light) ? `원 : 바탕 ${ratio(face.range.light, surfHex('light'))}:1 · 다크 ${ratio(face.range.dark, surfHex('dark'))}:1` : surface === 'dim' ? '사진 위 딤(overlay-dim) — 흰 원(staticWhite)을 쓴다' : '글자색을 따른다';
  return (
    <PlayFrame
      surface={tone(screen, 'bg-layer-basement', mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          <div className="relative grid place-items-center overflow-hidden" style={{ height: 200, borderRadius: 16, background: bg[surface], fontFamily: FONT }}>
            {surface === 'dim' && (
              <>
                <span aria-hidden className="absolute inset-0" style={{ background: PHOTO_BG }} />
                <span aria-hidden className="absolute inset-0" style={{ background: lcv(screen.dim, mode) }} />
              </>
            )}
            <span className="relative flex items-center gap-2" style={{ color: tone(screen, 'fg-brand', mode), fontSize: 15, fontWeight: 600 }}>
              <ProgressCircleView look={pc} mode={mode} size={size} tone={toneV} value={det ? value : undefined} still={still === 'on'} />
              {toneV === 'inherit' && <span>영수증 올리는 중</span>}
            </span>
          </div>
          <span className="text-[12px] leading-4 text-fd-muted-foreground">
            {pc.sizes[size].size} · 두께 {pc.sizes[size].thickness} · {det ? `값 ${value}%` : '값 없는 원 — 호가 늘었다 줄며 돈다'} · {contrastNote}
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="크기 size" value={size} options={[['24', '24 — 요소 안'], ['40', '40 — 콘텐츠 가운데(기본)']] as const} onChange={setSize} />
          <Seg label="톤 tone" value={toneV} options={PC_TONES.map((t) => [t, t === pc.defaults.tone ? `${t}(기본)` : t] as const)} onChange={setTone} />
          <Seg label="값 value" value={has} options={[['none', '없음 — 값 없는 원'], ['value', '있음 — 값 있는 원']] as const} onChange={setHas} />
          {det ? <Slider label="값(0 ~ 100)" value={value} min={0} max={100} onChange={setValue} format={(v) => `${v}%`} /> : <span />}
          <Seg label="놓인 면" value={surface} options={PC_SURFACES} onChange={setSurface} />
          <Seg label="모션 줄이기" value={still} options={[['off', '끔'], ['on', '켬(돌지 않는다)']] as const} onChange={setStill} />
          <div className="flex flex-wrap gap-5">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
          <Note>톤은 놓인 면에 맞춘다 — 흰 면 · 떠 있는 면은 neutral, 앱 첫 화면 같은 큰 전환점만 brand, 사진 위 딤 · 짙은 채움은 staticWhite. 값을 옮기면 채움이 따라 찬다(처음 그릴 때는 움직이지 않는다).</Note>
        </>
      }
    />
  );
}

// ══ Progress(미터) ═══════════════════════════════════════
const PG_CTX: Record<PgMeaning, { label: string; max: number }> = {
  limit: { label: '식비 예산', max: 400000 },
  goal: { label: '여행 자금', max: 2000000 },
};
export function ProgressPlayground({ kits, screens }: { kits: Record<Brand, LoadingKit>; screens: Record<Brand, LdScreen> }) {
  const [meaning, setMeaning] = useState<PgMeaning>('limit');
  const [pct, setPct] = useState(88);
  const [surface, setSurface] = useState<'default' | 'floating'>('default');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [brand, setBrand] = useState<Brand>('desk');
  const kit = kits[brand];
  const screen = screens[brand];
  const ctx = PG_CTX[meaning];
  const value = Math.round((ctx.max * pct) / 100 / 100) * 100;
  const code = useMemo(
    () => `import { Progress } from "@/components/ui/progress"\n\n<Progress ${meaning === kit.progress.defaultMeaning ? '' : `meaning=${q(meaning)} `}label=${q(ctx.label)} value={${value}} max={${ctx.max}} />`,
    [meaning, ctx, value, kit.progress.defaultMeaning],
  );
  return (
    <PlayFrame
      surface={tone(screen, 'bg-layer-basement', mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3">
          {/* 기본 면은 카드(card.yaml — 1px 테두리 · 여백 24), 떠 있는 면은 테두리 없이 */}
          <div style={{ boxSizing: 'border-box', borderRadius: screen.card.radius, paddingTop: screen.card.pad, paddingRight: screen.card.pad, paddingBottom: screen.card.pad, paddingLeft: screen.card.pad, borderWidth: surface === 'floating' ? 0 : screen.card.borderW, borderStyle: 'solid', borderColor: tone(screen, 'stroke-neutral-weak', mode), background: tone(screen, surface === 'floating' ? 'bg-layer-floating' : 'bg-layer-default', mode) }}>
            <ProgressView look={kit.progress} mode={mode} meaning={meaning} label={ctx.label} value={value} max={ctx.max} />
          </div>
          <span className="text-[12px] leading-4 text-fd-muted-foreground">
            {meaning === 'limit' ? (value > ctx.max ? `넘친 한도 — 끝까지 위험 색 · "${won(value - ctx.max)} 초과"` : '쓸수록 찬다 — 색은 브랜드 하나') : value >= ctx.max ? '목표에 닿음 — 글 "달성" 만, 색은 그대로' : '모을수록 찬다 — 색은 브랜드 하나'}
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="뜻 meaning" value={meaning} options={[['limit', 'limit — 한도(기본)'], ['goal', 'goal — 목표']] as const} onChange={setMeaning} />
          <Seg label="놓인 면" value={surface} options={[['default', '흰 면(카드)'], ['floating', '떠 있는 면(시트)']] as const} onChange={setSurface} />
          <Slider label={`값 — ${ctx.label} ${won(ctx.max)} 중`} value={pct} min={0} max={150} onChange={setPct} ticks={[0, 50, 100, 150]} format={(v) => `${v}%`} />
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
            <Seg label="브랜드" value={brand} options={BRANDS} onChange={setBrand} />
          </div>
        </>
      }
    />
  );
}

// ══ Scroll Fog ═══════════════════════════════════════════
type FogBg = 'bg-layer-default' | 'bg-layer-basement' | 'bg-layer-floating';
const FOG_BGS = [
  ['bg-layer-default', '흰 면'],
  ['bg-layer-basement', '회색 바탕'],
  ['bg-layer-floating', '떠 있는 면'],
] as const;
const FOG_USE_KO: Record<FogUse, string> = { box: 'box — 상자(기본)', row: 'row — 가로 줄', overlayBody: 'overlayBody — 시트 본문', page: 'page — 바닥 버튼 화면' };
function fogCode(use: FogUse) {
  if (use === 'row') return `import { Chip, ChipGroup } from "@/components/ui/chip"\n\n{/* 칩 줄은 따로 켜지 않는다 — layout="scroll" 이면 늘 좌우 흐림 */}\n<ChipGroup layout="scroll" aria-label="카테고리">\n  {categories.map((c) => <Chip key={c}>{c}</Chip>)}\n</ChipGroup>`;
  if (use === 'overlayBody') return `import { ResponsiveDialogBody } from "@/components/ui/dialog"\n\n{/* 넘칠 수 있는 본문 — 위 · 아래 흐림과 같은 여백 */}\n<ResponsiveDialogBody scrollFog className="px-0">\n  <List>…</List>\n</ResponsiveDialogBody>`;
  if (use === 'page') return `import { ScrollFog } from "@/components/ui/scroll-fog"\n\n{/* 바닥 고정 버튼이 있는 화면 — 위는 머리 아래, 아래는 버튼 위에서 흐림이 끝난다 */}\n<ScrollFog use="page" className="flex-1">\n  <Terms />\n</ScrollFog>\n<footer className="px-6 pb-7 pt-3">\n  <Button size="large" className="w-full">동의하기</Button>\n</footer>`;
  return `import { ScrollFog } from "@/components/ui/scroll-fog"\n\n{/* 카드 안 높이를 정한 스크롤 — 넘치는 방향 양 끝 */}\n<ScrollFog className="max-h-60" tabIndex={0} role="region" aria-label="이용 약관">\n  <p>{terms}</p>\n</ScrollFog>`;
}
export function ScrollFogPlayground({ kit, screen, chip, list, cta }: { kit: LoadingKit; screen: LdScreen; chip: ChipLook; list: ListLook; cta: ButtonLook }) {
  const [use, setUse] = useState<FogUse>('row');
  const [bg, setBg] = useState<FogBg>('bg-layer-default');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [pos, setPos] = useState<'start' | 'middle' | 'end'>('start');
  const [cat, setCat] = useState('food');
  const [pick, setPick] = useState(FILTER_CHIPS[0]);
  const ref = useRef<HTMLDivElement | null>(null);
  const measure = () => {
    const el = ref.current;
    if (!el) return;
    const x = kit.fog.uses[use].axis === 'x';
    const at = x ? el.scrollLeft : el.scrollTop;
    const max = x ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setPos(at <= 1 ? 'start' : at >= max - 1 ? 'end' : 'middle');
  };
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ left: 0, top: 0 });
      setPos('start');
    }
  }, [use]);
  const p = kit.fog.uses[use];
  const surf = tone(screen, bg, mode);
  const fg = tone(screen, 'fg-neutral', mode);
  const depth = p.axis === 'x' ? `좌우 ${p.sides.left}` : `위 ${p.sides.top} · 아래 ${p.sides.bottom}`;
  const pad = p.axis === 'x' ? `여백 ${p.pad.left}` : `여백 위 ${p.pad.top} · 아래 ${p.pad.bottom}`;
  const terms = TERMS.map((t) => (
    <p key={t} style={{ margin: '0 0 12px', fontSize: 14, lineHeight: '22px', color: tone(screen, 'fg-neutral-muted', mode) }}>
      {t}
    </p>
  ));
  let stage: ReactNode;
  if (use === 'row')
    stage = (
      <div style={{ background: surf, borderRadius: 16, padding: '20px 0', overflow: 'hidden' }}>
        <ScrollFogView look={kit.fog} use="row" scrollRef={ref} onScroll={measure} style={{ paddingTop: 6, paddingBottom: 6 }}>
          <div role="radiogroup" aria-label="카테고리" style={{ display: 'flex', columnGap: 8 }}>
            {FILTER_CHIPS.map((t) => (
              <ChipView key={t} look={chip} mode={mode} variant={bg === 'bg-layer-basement' ? 'outlineStrong' : 'solid'} label={t} role="radio" selected={pick === t} tabIndex={pick === t ? 0 : -1} onClick={() => setPick(t)} />
            ))}
          </div>
        </ScrollFogView>
      </div>
    );
  else if (use === 'overlayBody')
    stage = (
      <div style={{ background: surf, borderRadius: '20px 20px 0 0', height: 360, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ padding: '24px 24px 16px', fontSize: 22, lineHeight: '30px', fontWeight: 700, color: fg }}>카테고리 고르기</div>
        <ScrollFogView look={kit.fog} use="overlayBody" scrollRef={ref} onScroll={measure} style={{ flex: 1, minHeight: 0 }}>
          <ListView look={list} rows={CATEGORY.map((c) => ({ ...c, checked: c.value === cat }))} mode={mode} value={cat} onValue={setCat} ariaLabel="카테고리" />
        </ScrollFogView>
      </div>
    );
  else if (use === 'page')
    stage = (
      <div style={{ background: surf, borderRadius: 20, height: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 52, padding: '0 24px', fontSize: 17, fontWeight: 700, color: fg, flexShrink: 0 }}>약관 동의</div>
        <ScrollFogView look={kit.fog} use="page" scrollRef={ref} onScroll={measure} tabIndex={0} ariaLabel="이용 약관" style={{ flex: 1, minHeight: 0 }} innerStyle={{ paddingLeft: 24, paddingRight: 24 }}>
          {terms}
          {terms}
        </ScrollFogView>
        <div style={{ padding: '12px 24px 20px', flexShrink: 0 }}>
          <ButtonView look={cta} mode={mode} label="동의하기" fill state="live" />
        </div>
      </div>
    );
  else
    stage = (
      <div style={{ background: surf, borderRadius: 16, padding: '0 20px', fontFamily: FONT }}>
        <ScrollFogView look={kit.fog} use="box" scrollRef={ref} onScroll={measure} tabIndex={0} ariaLabel="이용 약관" style={{ maxHeight: 240 }}>
          {terms}
        </ScrollFogView>
      </div>
    );
  return (
    <PlayFrame
      surface={tone(screen, bg === 'bg-layer-basement' ? 'bg-layer-default' : 'bg-layer-basement', mode)}
      code={fogCode(use)}
      stage={
        <div className="flex flex-col gap-3">
          {stage}
          <span className="text-[12px] leading-4 text-fd-muted-foreground">
            {depth} · {pad} — 지금 {pos === 'start' ? '처음' : pos === 'end' ? '끝' : '가운데'}, 흐림은 그대로{pos !== 'middle' ? '(빈 여백 위)' : ''}
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="자리 use" value={use} options={FOG_USES.map((u) => [u, FOG_USE_KO[u]] as const)} onChange={setUse} />
          <Seg label="바탕" value={bg} options={FOG_BGS} onChange={setBg} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Note>흐림은 색을 덮지 않는 마스크라 바탕이 바뀌어도 그대로다. 스크롤해 보면 처음 · 가운데 · 끝 어디서나 흐림이 켜져 있고, 처음 · 끝에서는 깊이만큼의 빈 여백 위에 놓인다.</Note>
        </>
      }
    />
  );
}

// ══ Content Placeholder ══════════════════════════════════
const CP_RATIOS = [
  ['1', '1:1'],
  ['4/3', '4:3'],
  ['16/9', '16:9'],
  ['1.586', '카드 1.586:1'],
  ['1/3', '좁고 긴 1:3'],
] as const;
type CpRatio = (typeof CP_RATIOS)[number][0];
const ratioOf = (r: CpRatio) => (r.includes('/') ? Number(r.split('/')[0]) / Number(r.split('/')[1]) : Number(r));
const CP_LUCIDE: Record<CpGlyph, string> = { image: 'ImageIcon', 'credit-card': 'CreditCard', receipt: 'Receipt', 'file-text': 'FileText' };
const CP_LABEL: Record<CpGlyph, string> = { image: '사진', 'credit-card': '카드 그림', receipt: '영수증 사진', 'file-text': '문서' };
// 틀의 모서리 — 그림 틀이라 Image Frame 처럼 폭으로 고른다(폭 r4 이하 · r6 이하 · 그 위 — image-frame.yaml). 서버가 값을 넘긴다
export type FrameRadii = { r4: number; r6: number; px: { s: number; m: number; l: number }; cls: { s: string; m: string; l: string } };
export function PlaceholderPlayground({ kit, screen, radii }: { kit: LoadingKit; screen: LdScreen; radii: FrameRadii }) {
  const [ratioV, setRatio] = useState<CpRatio>('4/3');
  const [w, setW] = useState(240);
  const [glyph, setGlyph] = useState<CpGlyph>('image');
  const [mode, setMode] = useState<ViewMode>('auto');
  const g = kit.placeholder.glyph;
  const h = Math.round(w / ratioOf(ratioV));
  const size = glyphSize(g, w, h);
  const rk = w <= radii.r4 ? 's' : w <= radii.r6 ? 'm' : 'l';
  const code = useMemo(() => {
    const aspect = ratioV === '1' ? 'aspect-square' : `aspect-[${ratioV}]`;
    return `${glyph === 'image' ? '' : `import { ${CP_LUCIDE[glyph]} } from "lucide-react"\n`}import { ContentPlaceholder } from "@/components/ui/content-placeholder"\n\n{/* 틀 — 크기 · 비율 · 모서리는 틀이 정한다(그림 틀은 Image Frame 처럼 폭으로 — ${w} → ${radii.px[rk]}) */}\n<div className="${aspect} w-[${w}px] overflow-hidden ${radii.cls[rk]}">\n  <ContentPlaceholder${glyph === 'image' ? '' : ` icon={<${CP_LUCIDE[glyph]} />}`} label=${q(CP_LABEL[glyph])} />\n</div>`;
  }, [ratioV, w, glyph, rk, radii]);
  const why = h * g.ratio < g.min ? `틀 높이의 ${g.ratio * 100}% 가 ${g.min} 보다 작아 ${g.min}` : h * g.ratio > g.max ? `틀 높이의 ${g.ratio * 100}% 가 ${g.max} 보다 커 ${g.max}` : `틀 높이의 ${g.ratio * 100}%`;
  // 대체 그림의 면은 페이지 바탕과 같은 색 — 흰 면(카드) 위에 둔다
  return (
    <PlayFrame
      surface={tone(screen, 'bg-layer-default', mode)}
      code={code}
      stage={
        <div className="flex flex-col items-center gap-3">
          <div style={{ width: w, maxWidth: '100%', height: h, overflow: 'hidden', borderRadius: radii.px[rk] }}>
            <ContentPlaceholderView look={kit.placeholder} mode={mode} icon={glyph} label={CP_LABEL[glyph]} w={w} h={h} />
          </div>
          <span className="self-stretch text-center text-[12px] leading-4 text-fd-muted-foreground">
            틀 {w} × {h} · 모서리 {radii.px[rk]} — 그림 {Math.round(size)}({size < h * g.ratio && size === w ? '틀 폭이 좁아 폭에 맞춤' : why})
          </span>
        </div>
      }
      controls={
        <>
          <Seg label="비율" value={ratioV} options={CP_RATIOS} onChange={setRatio} />
          <Seg label="그림 icon" value={glyph} options={CP_GLYPHS.map((c) => [c, c === 'image' ? 'image(기본)' : c] as const)} onChange={setGlyph} />
          <Slider label="틀 폭" value={w} min={40} max={360} step={4} onChange={setW} ticks={[40, 120, 240, 360]} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
        </>
      }
    />
  );
}

