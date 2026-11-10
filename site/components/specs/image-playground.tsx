'use client';
// 이미지 묶음의 플레이그라운드 — Image Frame(+ 카드 그림) · Logo Tile · Aspect Ratio.
// 속성을 고르면 스펙대로 그린 모습 · 그 코드(레시피 API — 각 md 의 "코드" 절과 같다) · 잰 값(폭 · 높이 · 모서리 · 대비)이 바뀐다.
// 값은 image-look 이 YAML 에서 푼 것만 쓴다 — 모서리는 폭으로(imageFrameRadius), 기관 색은 표에서 찾는다(findInstitution).
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { BadgeLook } from './display-shared';
import { BadgeView, Reading } from './display-view';
import type { ListLook } from './list-shared';
import { ListView } from './list-view';
import {
  IF_RATIOS,
  LT_SIZES,
  avatarHueIndex,
  avatarInitial,
  codePointSum,
  contrastOf,
  dcv,
  findInstitution,
  imageFrameRadius,
  logoFace,
  ratioText,
  type AspectRatioLook,
  type CardArtLook,
  type DColor,
  type IfRatio,
  type IfState,
  type ImageFrameLook,
  type Institution,
  type LogoTileLook,
  type LtFace,
  type LtImage,
  type LtSize,
  type PicKind,
  type ViewMode,
} from './image-shared';
import { AspectRatioView, CardArtView, ImageFrameView, IndicatorView, LogoTileView, MapChild, VideoChild, type CardFace, type LogoState } from './image-view';
import { MODES, Seg } from './select-playground';

const FONT = "'Pretendard Variable', Pretendard, sans-serif";
// 무대의 역할 색 — 서버가 DESIGN.md 에서 풀어 넘긴다
type Tones = Record<'bg-layer-basement' | 'bg-layer-default' | 'fg-neutral-subtle', DColor>;
const q = (s: string) => JSON.stringify(s);
const Note = ({ children }: { children: ReactNode }) => <p className="m-0 text-[12px] leading-5 text-fd-muted-foreground sm:col-span-2">{children}</p>;
// 판 — 무대(놓인 바탕) · 잰 값 · 고르는 칸 · 코드. 무대는 실제 화면 폭(360)으로 그린다 — 좁은 화면에서는 무대 안에서 가로로 민다
function Frame({ surface, stage, info, reading, controls, code, stageW = 360 }: { surface: string; stage: ReactNode; info?: ReactNode; reading?: ReactNode; controls: ReactNode; code: string; stageW?: number }) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border">
      <div className="flex min-h-[220px] flex-col justify-center overflow-x-auto px-4 py-10" style={{ background: surface }}>
        <div className="mx-auto flex w-max flex-col items-center gap-4">
          <div style={{ width: stageW }}>{stage}</div>
          {info && (
            <div className="text-center text-[12px] leading-[18px] text-fd-muted-foreground" style={{ maxWidth: stageW }}>
              {info}
            </div>
          )}
          {reading && (
            <div className="flex justify-center" style={{ maxWidth: stageW }}>
              {reading}
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-4 border-t border-fd-border bg-fd-card p-5 sm:grid-cols-2">{controls}</div>
      <pre className="overflow-x-auto border-t border-fd-border bg-fd-secondary/50 px-5 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
function Slider({ label, value, min, max, onChange, ticks, disabled = false }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; ticks?: number[]; disabled?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${disabled ? 'opacity-40' : ''}`}>
      <span className="flex justify-between text-[12px] font-medium text-fd-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-fd-foreground">{value}</span>
      </span>
      <input type="range" min={min} max={max} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-fd-foreground)]" />
      {ticks && (
        <span className="relative h-4 text-[11px] tabular-nums text-fd-muted-foreground">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${((t - min) / (max - min)) * 100}%` }}>
              {t}
            </span>
          ))}
        </span>
      )}
    </label>
  );
}
const attr = (cond: boolean, s: string) => (cond ? [s] : []);

// ══ Image Frame ══════════════════════════════════════════
type Kind = 'photo' | 'white' | 'vertical' | 'nocard';
const KINDS = [
  ['photo', '사진'],
  ['white', '흰 그림'],
  ['vertical', '세로 카드'],
  ['nocard', '그림 없는 카드'],
] as const;
type Sizing = 'fixed' | 'parent' | 'bleed';
type Over = 'none' | 'badge' | 'indicator' | 'both';
const ISSUERS = ['신한카드', 'KB국민카드', 'NH농협카드', 'BC카드'] as const;
const STAGE_PAD = 24;

export function ImageFramePlayground({ look, ca, faces, badge, tones }: { look: ImageFrameLook; ca: CardArtLook; faces: Record<string, CardFace | null>; badge: BadgeLook; tones: Tones }) {
  const [ratio, setRatio] = useState<IfRatio>(look.defaults.ratio);
  const [sizing, setSizing] = useState<Sizing>('fixed');
  const [width, setWidth] = useState(150);
  const [kind, setKind] = useState<Kind>('photo');
  const [issuer, setIssuer] = useState<(typeof ISSUERS)[number]>('NH농협카드');
  const [state, setState] = useState<IfState>('loaded');
  const [overlay, setOverlay] = useState<Over>('none');
  const [mode, setMode] = useState<ViewMode>('auto');
  const [reveal, setReveal] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const card = kind === 'vertical' || kind === 'nocard';
  const r: IfRatio = card ? 'card' : ratio;
  const F = look.ratios[r].value;
  const stageW = 360;
  const w = sizing === 'bleed' ? stageW : sizing === 'parent' ? stageW - STAGE_PAD * 2 : width;
  const h = w / F;
  const rk = imageFrameRadius(sizing === 'fixed' ? width : undefined, look.bands, sizing === 'bleed');
  const st: IfState = kind === 'nocard' ? 'fallback' : state;
  const pic: PicKind | null = kind === 'photo' ? 'dusk' : kind === 'white' ? 'white' : kind === 'vertical' ? 'card-v' : null;
  const short = Math.min(w, h);
  const canFloat = short >= look.floater.minSide;
  const floaters = [
    ...(overlay === 'badge' || overlay === 'both' ? [{ placement: 'top-start' as const, node: <BadgeView look={badge} mode={mode} variant="solid">단종</BadgeView> }] : []),
    ...(overlay === 'indicator' || overlay === 'both' ? [{ placement: 'bottom-end' as const, node: <IndicatorView look={look} label="사진 12장 중 1번째">1 / 12</IndicatorView> }] : []),
  ];
  const play = () => {
    window.clearTimeout(timer.current);
    setReveal(true);
    setState('loading');
    timer.current = window.setTimeout(() => setState('loaded'), 1200);
  };
  const cardName = kind === 'vertical' ? '체크카드' : issuer === 'BC카드' ? '신용카드' : issuer === 'KB국민카드' ? '신용카드' : issuer === '신한카드' ? '신용카드' : '체크카드';
  const cardIssuer = kind === 'vertical' ? '하나카드' : issuer;
  const face = card ? (faces[cardIssuer] ?? null) : null;
  const frameProps = { look, mode, width: sizing === 'fixed' ? width : w, fill: sizing !== 'fixed', bleed: sizing === 'bleed', state: st, floaters, reveal };
  const view = card ? (
    <CardArtView {...frameProps} ca={ca} issuer={cardIssuer} name={cardName} face={face} pic={pic} />
  ) : (
    <ImageFrameView {...frameProps} ratio={r} pic={pic} alt={kind === 'photo' ? '저녁 하늘 사진' : '흰 배경 컵 사진'} />
  );
  const code = useMemo(() => {
    const flo = [
      ...(canFloat && (overlay === 'badge' || overlay === 'both') ? ['  <ImageFrameFloater placement="top-start">', '    <Badge variant="solid">단종</Badge>', '  </ImageFrameFloater>'] : []),
      ...(canFloat && (overlay === 'indicator' || overlay === 'both') ? ['  <ImageFrameFloater placement="bottom-end">', '    <ImageFrameIndicator label="사진 12장 중 1번째">1 / 12</ImageFrameIndicator>', '  </ImageFrameFloater>'] : []),
    ];
    const sizeAttr = sizing === 'bleed' ? ['bleed'] : sizing === 'fixed' ? [`width={${width}}`] : [];
    const names = ['ImageFrameFloater', ...(overlay === 'indicator' || overlay === 'both' ? ['ImageFrameIndicator'] : [])].filter(() => flo.length > 0);
    const head = card ? ['CardArt', ...names] : ['ImageFrame', ...names];
    const imports = [`import { ${[...new Set(head)].join(', ')} } from "@/components/ui/image-frame"`, ...(canFloat && (overlay === 'badge' || overlay === 'both') ? ['import { Badge } from "@/components/ui/badge"'] : [])];
    const comment =
      kind === 'nocard'
        ? face
          ? `{/* 그림이 없다(imgUrl 이 null) — 아는 카드사(${cardIssuer})는 기관 색 면 */}`
          : `{/* 그림이 없다 — 모르는 카드사(${cardIssuer})는 대체 그림(credit-card) */}`
        : st === 'loading'
          ? '{/* 불러오는 중 — 같은 모서리의 스켈레톤, 다 받으면 투명도로 나타난다 */}'
          : st === 'fallback'
            ? `{/* 못 불러옴(또는 ${look.timeout / 1000}초가 지나도 안 옴) — ${card ? (face ? '카드 면' : '대체 그림') : '대체 그림이 alt 를 이름으로 이어받는다'} */}`
            : '';
    const tag = card ? 'CardArt' : 'ImageFrame';
    const attrs = card ? [...sizeAttr, 'src={card.imgUrl}', `issuer=${q(cardIssuer)}`, `name=${q(cardName)}`] : [...attr(r !== look.defaults.ratio, `ratio=${q(r)}`), ...sizeAttr, 'src={photo.url}', 'alt={photo.description}'];
    const open = `<${tag} ${attrs.join(' ')}`;
    const body = flo.length ? [`${open}>`, ...flo, `</${tag}>`] : [`${open} />`];
    return [...imports, '', ...(comment ? [comment] : []), ...body].join('\n');
  }, [card, canFloat, overlay, sizing, width, kind, face, cardIssuer, cardName, st, look.timeout, look.defaults.ratio, r]);
  const surface = dcv(tones['bg-layer-basement'], mode);
  return (
    <Frame
      surface={surface}
      code={code}
      stage={
        <div style={{ background: dcv(tones['bg-layer-default'], mode), borderRadius: 16, paddingTop: 24, paddingBottom: 24, paddingLeft: sizing === 'bleed' ? 0 : STAGE_PAD, paddingRight: sizing === 'bleed' ? 0 : STAGE_PAD, overflow: 'hidden', fontFamily: FONT }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: w }}>{view}</div>
          </div>
        </div>
      }
      info={
        <>
          폭 <b className="tabular-nums text-fd-foreground">{w}</b> · 높이 <b className="tabular-nums text-fd-foreground">{h.toFixed(1)}</b>({look.ratios[r].expr}) · 모서리 <b className="tabular-nums text-fd-foreground">{look.radius[rk].px}</b>({look.radius[rk].token} — {sizing === 'bleed' ? '화면 폭' : sizing === 'parent' ? '부모 폭을 채움' : look.radius[rk].desc})
          {overlay !== 'none' && !canFloat && (
            <>
              <br />
              짧은 변 {short.toFixed(1)} 이 {look.floater.minSide} 보다 작다 — 그림 위에 얹지 않고 배지 · 장수는 줄의 글로 둔다
            </>
          )}
          {card && kind === 'vertical' && (
            <>
              <br />
              세로 그림(원래 540 × 856)을 시계 방향 {look.rotate}° 돌려 카드 비율 틀을 채웠다
            </>
          )}
        </>
      }
      controls={
        <>
          <div className={card ? 'pointer-events-none opacity-40' : ''}>
            <Seg label={card ? '비율 ratio — 카드 그림은 card(1.586)' : '비율 ratio'} value={r} options={IF_RATIOS.map((x) => [x, x === look.defaults.ratio ? `${x}(기본)` : x] as const)} onChange={setRatio} />
          </div>
          <Seg label="폭" value={sizing} options={[['fixed', '고정 폭 width'], ['parent', '부모 폭 채움'], ['bleed', '화면 폭 bleed']] as const} onChange={setSizing} />
          <Slider label="고정 폭(px) — 24 이하 4 · 48 이하 6 · 그 위 8" value={width} min={16} max={312} onChange={setWidth} ticks={[look.bands.r4, look.bands.r6, 150, 312]} disabled={sizing !== 'fixed'} />
          <Seg label="그림" value={kind} options={KINDS} onChange={setKind} />
          {kind === 'nocard' ? (
            <Seg label="카드사 — 표에 있으면 카드 면" value={issuer} options={ISSUERS.map((x) => [x, faces[x] ? x : `${x}(표에 없음)`] as const)} onChange={setIssuer} />
          ) : (
            <Seg label="상태" value={state} options={[['loading', '불러오는 중'], ['loaded', '다 받음'], ['fallback', '실패']] as const} onChange={(v) => (setReveal(false), setState(v))} />
          )}
          <Seg label="그림 위 요소" value={overlay} options={[['none', '없음'], ['badge', '배지 "단종"'], ['indicator', '장수 "1 / 12"'], ['both', '둘 다']] as const} onChange={setOverlay} />
          <div className="flex flex-wrap items-end gap-3">
            <button type="button" onClick={play} disabled={kind === 'nocard'} className="rounded-md bg-fd-foreground px-3 py-1.5 text-[13px] font-medium text-fd-background disabled:opacity-40">
              다시 불러오기
            </button>
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          </div>
          <Note>
            불러오는 동안은 같은 모서리의 스켈레톤, 다 받으면 {look.reveal.ms}ms 투명도로 나타난다. 없거나 · 못 불러오거나 · {look.timeout / 1000}초가 지나도 안 오면 대체 그림이다. 윤곽은 늘 그린다 — 끄는 속성이 없다.
          </Note>
        </>
      }
    />
  );
}

// ══ Logo Tile ════════════════════════════════════════════
const NAME_PRESETS = ['신한', 'KB국민', 'NH농협카드 체크', 'IBK기업은행', '유안타증권', '카카오뱅크', 'Upbit', '비상금'] as const;
export function LogoTilePlayground({ look, frame, table, list, tones }: { look: LogoTileLook; frame: ImageFrameLook; table: Institution[]; list: ListLook; tones: Tones }) {
  const [name, setName] = useState('신한');
  const [face, setFace] = useState<LtFace>(look.defaults.face);
  const [size, setSize] = useState<LtSize>(look.defaults.size);
  const [image, setImage] = useState<LtImage>(look.defaults.image);
  const [load, setLoad] = useState<LogoState>('loaded');
  const [alone, setAlone] = useState<'decorative' | 'named'>('decorative');
  const [mode, setMode] = useState<ViewMode>('auto');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const p = logoFace(name, face, table, look);
  const found = face === 'institution' ? findInstitution(name, table) : null;
  const pic: PicKind | undefined = image === 'card' ? 'card-v' : image === 'logo' ? 'logo-leaf' : undefined;
  const play = () => {
    window.clearTimeout(timer.current);
    setLoad('initial');
    timer.current = window.setTimeout(() => setLoad('loaded'), 1200);
  };
  const tile = (decorative: boolean) => <LogoTileView look={look} frame={frame} mode={mode} size={size} name={name} paint={{ bg: p.bg, fg: p.fg }} image={image} pic={pic} state={load} decorative={decorative} />;
  // 대비 — 기관 색 면은 표의 글자색, 이름 색 면은 fg-neutral-inverted(라이트 · 다크)
  const crs = (() => {
    if (found) {
      const t = found.inst.text === 'white' ? [contrastOf(look.text.white.light, found.inst.color)] : [contrastOf(look.text.dark.light, found.inst.color), contrastOf(look.text.dark.dark, found.inst.color)];
      return t.map(ratioText).join(' · 다크 ');
    }
    if (!name.trim()) return '';
    const c = look.hues[p.hue ?? 'gray'];
    return `${ratioText(contrastOf(look.nameFg.light, c.light))} · 다크 ${ratioText(contrastOf(look.nameFg.dark, c.dark))}`;
  })();
  const sum = codePointSum(name);
  const code = useMemo(() => {
    const a = [...attr(size !== look.defaults.size, `size={${size}}`), `name=${q(name)}`, ...attr(face !== look.defaults.face, `face=${q(face)}`), ...(image !== 'none' ? [image === 'card' ? 'src={asset.cardCatalog.imgUrl}' : 'src={company.logoUrl}', ...attr(image !== 'logo', `imageType=${q(image)}`)] : []), ...attr(alone === 'named', 'decorative={false}')];
    const comment = image !== 'none' && load === 'initial' ? '{/* 그림이 오기 전 — 첫 글자 타일을 먼저 그린다 */}\n' : image !== 'none' && load === 'failed' ? '{/* 그림을 못 불러옴 — 첫 글자 그대로 */}\n' : '';
    return `import { LogoTile } from "@/components/ui/logo-tile"\n\n${comment}<LogoTile ${a.join(' ')} />`;
  }, [size, name, face, image, load, alone, look.defaults]);
  const sub = dcv(tones['fg-neutral-subtle'], mode);
  return (
    <Frame
      surface={dcv(tones['bg-layer-basement'], mode)}
      code={code}
      stage={
        <div className="flex flex-col gap-3" style={{ fontFamily: FONT }}>
          <span className="text-[12px] leading-4" style={{ color: sub }}>
            줄 안 — 이름 옆(장식)
          </span>
          <div className="overflow-hidden rounded-2xl" style={{ background: dcv(tones['bg-layer-default'], mode), paddingTop: 6, paddingBottom: 6 }}>
            <ListView look={list} mode={mode} live={false} rows={[{ kind: 'button', prefix: { node: tile(true) }, title: name.trim() || '이름 없음', detail: found ? `${found.inst.name} · ${found.inst.category}` : '기관 없음', suffix: { amount: '1,250,000원' } }]} />
          </div>
          <span className="text-[12px] leading-4" style={{ color: sub }}>
            혼자 — {alone === 'named' ? '이름을 가진다' : '장식(옆에 이름이 있을 때)'}
          </span>
          <div className="flex items-center justify-center rounded-2xl py-6" style={{ background: dcv(tones['bg-layer-default'], mode) }}>
            {tile(alone === 'decorative')}
          </div>
        </div>
      }
      info={
        <>
          {found ? (
            <>
              찾은 기관 <b className="text-fd-foreground">{found.inst.name}</b>({found.how === 'exact' ? '같은 이름 · 별칭' : `든 가장 긴 이름 "${found.key}"`}) · {found.inst.color}
              {found.inst.ci ? `(원래 ${found.inst.ci})` : ''} · {found.inst.text === 'white' ? '흰 글자' : '짙은 글자'} {crs}
            </>
          ) : name.trim() ? (
            <>
              {face === 'name' ? '표를 보지 않는다' : '표에 없다'} → 이름 색 <b className="text-fd-foreground">{p.hue}</b>(코드 포인트 합 {sum.toLocaleString('ko-KR')} % 10 = {avatarHueIndex(name)}) · fg-neutral-inverted {crs}
            </>
          ) : (
            '이름이 비면 글자 없이 chart-gray'
          )}
          <br />
          첫 글자 &ldquo;{avatarInitial(name)}&rdquo; · {look.sizes[size].size} · 모서리 {look.sizes[size].radius}({look.sizes[size].radiusToken}) · 글자 {look.sizes[size].font}
          {image !== 'none' && ` · 그림 판 안 ${look.sizes[size].size - look.platePad * 2}`}
        </>
      }
      reading={<Reading tone="neutral">{alone === 'named' ? `“${name.trim()}, 이미지”` : '타일은 읽지 않는다 — 옆의 이름을 한 번만 읽는다'}</Reading>}
      controls={
        <>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[12px] font-medium text-fd-muted-foreground">이름 name — 기관 이름, 없으면 자산 이름</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-[14px] text-fd-foreground" />
            <span className="flex flex-wrap gap-1">
              {NAME_PRESETS.map((n) => (
                <button key={n} type="button" onClick={() => (setName(n), setFace(n === '비상금' ? 'name' : 'institution'))} className="rounded-md border border-fd-border bg-fd-background px-2 py-0.5 text-[12px] text-fd-foreground hover:bg-fd-accent">
                  {n}
                </button>
              ))}
            </span>
          </label>
          <Seg label="면 face" value={face} options={[['institution', 'institution — 기관 색 표(기본)'], ['name', 'name — 이름 색']] as const} onChange={setFace} />
          <Seg label="크기 size" value={size} options={LT_SIZES.map((s) => [s, s === look.defaults.size ? `${s}(기본)` : s] as const)} onChange={setSize} />
          <Seg label="그림" value={image} options={[['none', '없음'], ['card', '카드 그림 card'], ['logo', '로고 그림 logo']] as const} onChange={setImage} />
          <Seg label="그림이 오는 순간" value={load} options={[['initial', '오기 전 — 첫 글자'], ['loaded', '다 받음'], ['failed', '실패 — 첫 글자 그대로']] as const} onChange={setLoad} />
          <Seg label="혼자 쓸 때" value={alone} options={[['decorative', '장식 decorative(기본)'], ['named', '이름 decorative={false}']] as const} onChange={setAlone} />
          <div className="flex flex-wrap items-end gap-3">
            <button type="button" onClick={play} disabled={image === 'none'} className="rounded-md bg-fd-foreground px-3 py-1.5 text-[13px] font-medium text-fd-background disabled:opacity-40">
              다시 불러오기
            </button>
            <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          </div>
          <Note>
            기관 색은 표에서만 찾는다(공백을 뺀 같은 이름 · 별칭, 아니면 든 가장 긴 이름). 없거나 face=&quot;name&quot; 이면 이름 색 — Avatar 와 같은 함수(코드 포인트 합 % 10 → 차트 10색)다. 그림은 첫 글자를 덮을 뿐이라 늦거나 실패해도 줄이 깜빡이지 않는다.
          </Note>
        </>
      }
    />
  );
}

// ══ Aspect Ratio ═════════════════════════════════════════
export function AspectRatioPlayground({ look, tones }: { look: AspectRatioLook; tones: Tones }) {
  const [ratio, setRatio] = useState<IfRatio>(look.defaults.ratio);
  const [width, setWidth] = useState(312);
  const [child, setChild] = useState<'video' | 'map'>('video');
  const [mode, setMode] = useState<ViewMode>('auto');
  const v = look.ratios[ratio].value;
  const code = useMemo(() => {
    const a = attr(ratio !== look.defaults.ratio, `ratio=${q(ratio)}`);
    const kid = child === 'video' ? '  <video src={guide.url} controls preload="metadata" className="size-full object-cover" aria-label="자산 연결 안내 동영상" />' : '  <iframe src={mapUrl} title="가게 위치 지도" className="size-full" />';
    return `import { AspectRatio } from "@/components/ui/aspect-ratio"\n\n<AspectRatio${a.length ? ` ${a.join(' ')}` : ''}>\n${kid}\n</AspectRatio>`;
  }, [ratio, child, look.defaults.ratio]);
  return (
    <Frame
      surface={dcv(tones['bg-layer-basement'], mode)}
      code={code}
      stage={
        <div style={{ background: dcv(tones['bg-layer-default'], mode), borderRadius: 16, paddingTop: 24, paddingBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width, outline: '1px dashed rgba(219, 39, 119, 0.6)', outlineOffset: 2 }}>
            <AspectRatioView look={look} ratio={ratio}>
              {child === 'video' ? <VideoChild frame={v} label="자산 연결 안내 동영상" /> : <MapChild frame={v} label="가게 위치 지도" />}
            </AspectRatioView>
          </div>
        </div>
      }
      info={
        <>
          부모 폭 <b className="tabular-nums text-fd-foreground">{width}</b> → 높이 <b className="tabular-nums text-fd-foreground">{(width / v).toFixed(1)}</b>(폭 ÷ {look.ratios[ratio].expr}) · 모서리 0 · 바탕 없음(점선은 상자의 자리)
        </>
      }
      controls={
        <>
          <Seg label="비율 ratio" value={ratio} options={IF_RATIOS.map((x) => [x, x === look.defaults.ratio ? `${x}(기본)` : x] as const)} onChange={setRatio} />
          <Slider label="부모 폭(px)" value={width} min={120} max={312} onChange={setWidth} ticks={[120, 200, 312]} />
          <Seg label="자식" value={child} options={[['video', '동영상'], ['map', '지도']] as const} onChange={setChild} />
          <Seg label="모드" value={mode} options={MODES} onChange={setMode} />
          <Note>상자는 모서리 · 바탕 · 윤곽이 없다 — 자식 하나가 상자를 채운다. 그림(사진 · 카드 그림)은 Image Frame 이다.</Note>
        </>
      }
    />
  );
}
