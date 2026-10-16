'use client';
// 스펙대로 그린 이미지 묶음 — Image Frame(+ 그림 위 자리 · Indicator) · 카드 그림(CardArt) · Logo Tile · Aspect Ratio.
// 모양은 image-look 이 YAML 에서 푼 값(ImageFrameLook …)만 받는다. 색은 mode 가 auto 면 --p-<토큰> 변수(사이트 라이트 · 다크를 따른다).
// 그림은 손으로 칠한 대역(Pic)이다 — 실제 사진 · 카드 그림 · 기관 로고를 쓰지 않는다.
// 인라인 스타일은 단축 속성(padding · margin · inset)과 개별 속성을 한 객체에 섞지 않는다 — 링크로 들어올 때 React 가 단축 값을 지운다(#154).
import { useId, type CSSProperties, type ReactNode } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { ContentPlaceholderView, SkeletonView } from './loading-view';
import type { CpGlyph } from './loading-shared';
import {
  FONT,
  PICS,
  avatarInitial,
  cardArtSize,
  cardInitialSize,
  dcv,
  fitBox,
  imageFrameRadius,
  type AspectRatioLook,
  type CardArtLook,
  type DColor,
  type IfFit,
  type IfPlacement,
  type IfRatio,
  type IfState,
  type ImageFrameLook,
  type LogoTileLook,
  type LtImage,
  type LtSize,
  type PicKind,
  type ViewMode,
} from './image-shared';

export const srOnly: CSSProperties = { position: 'absolute', width: 1, height: 1, marginTop: -1, marginRight: -1, marginBottom: -1, marginLeft: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 };
const fill: CSSProperties = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 };

// 모드마다 다른 토큰을 쓰는 글자색(기관 색 면의 짙은 글자 — 라이트 fg-neutral · 다크 fg-neutral-inverted).
// 사이트 모드를 따를 때는 .pimg(global.css)가 -l · -d 를 고른다
export type SplitColor = DColor & { split?: [string, string] };
export function fgProps(c: SplitColor, mode: ViewMode): { className?: string; 'data-mode'?: string; style: CSSProperties } {
  if (c.split && mode === 'auto') return { className: 'pimg', 'data-mode': 'auto', style: { ['--pi-fg-l' as string]: `var(--p-${c.split[0]})`, ['--pi-fg-d' as string]: `var(--p-${c.split[1]})`, color: 'var(--pi-fg)' } };
  return { style: { color: dcv(c, mode) } };
}

// ── 그림 재료 ─────────────────────────────────────────────
// 원래 비율(PICS[kind].aspect)의 상자를 꽉 채운다 — 상자가 그 비율이라 찌그러지지 않는다
export function Pic({ kind }: { kind: PicKind }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = (n: string) => `${id}${n}`;
  const svg = (w: number, h: number, children: ReactNode) => (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
      {children}
    </svg>
  );
  const lin = (name: string, stops: [number, string][], x2 = 0, y2 = 1) => (
    <linearGradient id={g(name)} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
  switch (kind) {
    case 'dusk':
      return svg(300, 200, (
        <>
          <defs>{lin('s', [[0, '#1B2036'], [0.6, '#2B2F4A'], [1, '#3A3550']])}</defs>
          <rect width="300" height="200" fill={`url(#${g('s')})`} />
          <circle cx="214" cy="62" r="13" fill="#F5E6A8" />
          <path d="M0 150 C60 118 112 136 162 150 S252 128 300 142 V200 H0Z" fill="#161A2A" />
          <path d="M0 172 C80 156 150 178 300 166 V200 H0Z" fill="#0E111C" />
        </>
      ));
    case 'white':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#FFFFFF" />
          <ellipse cx="100" cy="152" rx="58" ry="11" fill="#000000" fillOpacity="0.07" />
          <path d="M60 92 h80 v42 a40 22 0 0 1 -80 0 z" fill="#DCE0E6" />
          <ellipse cx="100" cy="92" rx="40" ry="12" fill="#ECEEF2" />
          <path d="M140 102 c18 0 18 26 0 26" fill="none" stroke="#DCE0E6" strokeWidth="7" />
        </>
      ));
    case 'meadow':
      return svg(300, 225, (
        <>
          <defs>{lin('s', [[0, '#9DB7D5'], [1, '#D3E0EC']])}</defs>
          <rect width="300" height="225" fill={`url(#${g('s')})`} />
          <circle cx="232" cy="52" r="18" fill="#FFF4D2" />
          <path d="M0 150 C70 122 130 138 190 128 S270 118 300 126 V225 H0Z" fill="#7F9A6A" />
          <path d="M0 182 C90 160 190 186 300 170 V225 H0Z" fill="#5A6E52" />
          <circle cx="78" cy="122" r="20" fill="#4E6B46" />
          <rect x="75" y="134" width="6" height="22" fill="#4A3B2C" />
        </>
      ));
    case 'sunset':
      return svg(300, 225, (
        <>
          <defs>{lin('s', [[0, '#F6B26B'], [0.55, '#E07C7C'], [1, '#7A5682']])}</defs>
          <rect width="300" height="225" fill={`url(#${g('s')})`} />
          <circle cx="150" cy="128" r="30" fill="#FFE3A3" />
          <path d="M0 150 L70 104 L130 150 L196 96 L300 156 V225 H0Z" fill="#4A3858" />
          <path d="M0 190 C100 170 200 196 300 182 V225 H0Z" fill="#2E2238" />
        </>
      ));
    case 'sea':
      return svg(300, 225, (
        <>
          <defs>
            {lin('s', [[0, '#BFE3F2'], [1, '#86C9E6']])}
            {lin('w', [[0, '#3488C0'], [1, '#1F5F8E']])}
          </defs>
          <rect width="300" height="225" fill={`url(#${g('s')})`} />
          <rect y="118" width="300" height="70" fill={`url(#${g('w')})`} />
          <path d="M0 188 C80 176 170 196 300 180 V225 H0Z" fill="#E9D8B4" />
          <path d="M40 140 h40 M150 156 h56 M230 136 h34" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        </>
      ));
    case 'forest':
      return svg(300, 225, (
        <>
          <rect width="300" height="225" fill="#DDE8D2" />
          <path d="M40 170 L80 70 L120 170Z M110 176 L160 52 L210 176Z M196 170 L236 84 L276 170Z" fill="#3E7B4F" />
          <path d="M140 176 L172 100 L204 176Z" fill="#2F6040" />
          <rect y="168" width="300" height="57" fill="#6B8F5A" />
        </>
      ));
    case 'receipt':
      return svg(300, 400, (
        <>
          <rect width="300" height="400" fill="#E6E3DC" />
          <path d="M70 40 h160 v300 l-16 12 -16 -12 -16 12 -16 -12 -16 12 -16 -12 -16 12 -16 -12 -16 12 -16 -12 z" fill="#FFFFFF" />
          {[80, 104, 128, 152, 176, 200].map((y, i) => (
            <rect key={y} x="92" y={y} width={i % 2 ? 84 : 116} height="8" rx="4" fill="#C9CDD4" />
          ))}
          <rect x="92" y="250" width="116" height="10" rx="5" fill="#8E949F" />
        </>
      ));
    case 'card-h':
    case 'card-h2':
    case 'card-white':
    case 'card-dark': {
      const th = {
        'card-h': { a: '#283C86', b: '#45A247', chip: ['#F6D365', '#C9A227'], word: 'DAILY', fg: '#FFFFFF' },
        'card-h2': { a: '#F06A6A', b: '#F5A35C', chip: ['#FCE7B2', '#D9B25A'], word: 'PLUS', fg: '#FFFFFF' },
        'card-white': { a: '#FFFFFF', b: '#F7F8FA', chip: ['#E9EBEF', '#D3D7DE'], word: 'PREMIUM', fg: '#C3C8D1' },
        'card-dark': { a: '#262A33', b: '#0E1014', chip: ['#8C7A4E', '#5E5133'], word: 'BLACK', fg: '#5C6170' },
      }[kind];
      return svg(1586, 1000, (
        <>
          <defs>
            {lin('c', [[0, th.a], [1, th.b]], 1, 1)}
            {lin('p', [[0, th.chip[0]], [1, th.chip[1]]], 1, 1)}
          </defs>
          <rect width="1586" height="1000" fill={`url(#${g('c')})`} />
          <rect x="130" y="340" width="210" height="160" rx="26" fill={`url(#${g('p')})`} />
          <path d="M420 370 q40 50 0 100 M470 340 q66 80 0 160" fill="none" stroke={th.fg} strokeOpacity="0.55" strokeWidth="18" strokeLinecap="round" />
          <text x="1460" y="880" textAnchor="end" fontFamily="Pretendard, sans-serif" fontWeight="800" fontSize="150" letterSpacing="8" fill={th.fg}>
            {th.word}
          </text>
        </>
      ));
    }
    case 'card-v':
      return svg(540, 856, (
        <>
          <defs>
            {lin('c', [[0, '#E52D27'], [1, '#7B1FA2']], 0.5, 1)}
            {lin('p', [[0, '#F6D365'], [1, '#C9A227']], 1, 1)}
          </defs>
          <rect width="540" height="856" fill={`url(#${g('c')})`} />
          <rect x="70" y="90" width="150" height="112" rx="20" fill={`url(#${g('p')})`} />
          <text transform="translate(410 760) rotate(-90)" fontFamily="Pretendard, sans-serif" fontWeight="800" fontSize="104" letterSpacing="6" fill="#FFFFFF">
            TRAVEL
          </text>
          <rect x="70" y="742" width="120" height="22" rx="11" fill="#FFFFFF" fillOpacity="0.75" />
        </>
      ));
    case 'logo-leaf':
      return svg(200, 200, (
        <>
          <rect x="24" y="24" width="152" height="152" rx="40" fill="#141414" />
          <path d="M100 52 C142 72 146 128 100 150 C54 128 58 72 100 52Z" fill="#FFFFFF" />
          <path d="M100 66 V142" stroke="#141414" strokeWidth="8" strokeLinecap="round" />
          <circle cx="150" cy="150" r="22" fill="#2E9E5B" />
        </>
      ));
    case 'logo-word':
      return svg(240, 100, (
        <>
          <circle cx="44" cy="50" r="30" fill="#E8742F" />
          <circle cx="44" cy="50" r="12" fill="#141414" />
          <rect x="90" y="30" width="120" height="16" rx="8" fill="#141414" />
          <rect x="90" y="56" width="82" height="14" rx="7" fill="#141414" />
        </>
      ));
    case 'rule-vacation':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#DDF2E7" />
          <circle cx="150" cy="54" r="20" fill="#F6C25B" />
          <rect x="44" y="64" width="112" height="96" rx="12" fill="#FFFFFF" />
          <rect x="44" y="64" width="112" height="26" rx="12" fill="#3C9D6E" />
          <rect x="44" y="80" width="112" height="10" fill="#3C9D6E" />
          {[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={58 + c * 24} y={102 + r * 18} width="14" height="10" rx="3" fill={c === 2 && r === 1 ? '#3C9D6E' : '#D5E9DE'} />))}
        </>
      ));
    case 'rule-attire':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#ECE7F8" />
          <path d="M70 52 L100 64 L130 52 L162 76 L148 100 L134 92 V156 H66 V92 L52 100 L38 76Z" fill="#8B7BD8" />
          <path d="M86 56 L100 82 L114 56" fill="#FFFFFF" />
          <circle cx="100" cy="104" r="4" fill="#FFFFFF" />
          <circle cx="100" cy="126" r="4" fill="#FFFFFF" />
        </>
      ));
    case 'rule-education':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#FFF1D6" />
          <path d="M100 70 C80 58 54 58 40 64 V146 C56 140 80 140 100 152Z" fill="#FFFFFF" />
          <path d="M100 70 C120 58 146 58 160 64 V146 C144 140 120 140 100 152Z" fill="#FFFFFF" />
          <path d="M100 70 V152" stroke="#E5A23A" strokeWidth="5" />
          <path d="M40 64 V146 C56 140 80 140 100 152 C120 140 144 140 160 146 V64" fill="none" stroke="#E5A23A" strokeWidth="5" strokeLinejoin="round" />
          <path d="M58 86 h26 M58 104 h26 M116 86 h26 M116 104 h26" stroke="#F1C77F" strokeWidth="5" strokeLinecap="round" />
        </>
      ));
    case 'rule-culture':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#FDE4E4" />
          <rect x="34" y="52" width="92" height="62" rx="18" fill="#E77B7B" />
          <path d="M58 112 L52 132 L76 114Z" fill="#E77B7B" />
          <rect x="82" y="96" width="86" height="56" rx="18" fill="#FFFFFF" />
          <path d="M146 150 L152 168 L130 152Z" fill="#FFFFFF" />
          <path d="M54 76 h52 M54 92 h34" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
          <path d="M102 118 h46 M102 132 h28" stroke="#E7A6A6" strokeWidth="6" strokeLinecap="round" />
        </>
      ));
    case 'video':
      return svg(320, 180, (
        <>
          <defs>{lin('s', [[0, '#2A3B58'], [1, '#121A2A']])}</defs>
          <rect width="320" height="180" fill={`url(#${g('s')})`} />
          <path d="M0 132 C70 104 130 124 190 112 S280 100 320 110 V180 H0Z" fill="#1B263A" />
          <rect x="196" y="40" width="72" height="50" rx="6" fill="#3B5379" />
          <rect x="206" y="52" width="40" height="6" rx="3" fill="#7A93B8" />
          <rect x="206" y="66" width="52" height="6" rx="3" fill="#5C769C" />
        </>
      ));
    case 'map':
      return svg(200, 200, (
        <>
          <rect width="200" height="200" fill="#EEF1E6" />
          <rect x="14" y="16" width="56" height="44" rx="4" fill="#DDE5D2" />
          <rect x="120" y="120" width="66" height="60" rx="4" fill="#DDE5D2" />
          <path d="M0 140 C60 120 90 160 200 110" fill="none" stroke="#A9CBE8" strokeWidth="16" />
          <path d="M0 84 H200 M96 0 V200" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M150 0 L60 200" stroke="#FFFFFF" strokeWidth="7" />
          <circle cx="112" cy="70" r="11" fill="#E5484D" />
          <circle cx="112" cy="70" r="4" fill="#FFFFFF" />
        </>
      ));
  }
}

// 그림 한 장을 틀에 — cover(가운데를 남겨 자른다) · contain(잘리지 않게) · 돌리기(세로 카드를 시계 방향으로 — 틀의 높이 × 폭 상자를 돌려 cover)
export function PicLayer({ kind, frame, fit = 'cover', rotate = 0, style, className, label }: { kind: PicKind; frame: number; fit?: IfFit; rotate?: number; style?: CSSProperties; className?: string; label?: string }) {
  const a = PICS[kind].aspect;
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  if (rotate) {
    const w = 100 / frame;
    const h = 100 * frame;
    const b = fitBox(1 / frame, a, 'cover');
    return (
      <span {...a11y} className={className} style={{ position: 'absolute', left: `${(100 - w) / 2}%`, top: `${(100 - h) / 2}%`, width: `${w}%`, height: `${h}%`, overflow: 'hidden', transform: `rotate(${rotate}deg)`, ...style }}>
        <span style={{ position: 'absolute', left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` }}>
          <Pic kind={kind} />
        </span>
      </span>
    );
  }
  const b = fitBox(frame, a, fit);
  return (
    <span {...a11y} className={className} style={{ position: 'absolute', left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%`, ...style }}>
      <Pic kind={kind} />
    </span>
  );
}
// 그림을 원래 비율 그대로(틀 없이) — "원래 그림" 을 보일 때
export function RawPic({ kind, width, style }: { kind: PicKind; width: number; style?: CSSProperties }) {
  return (
    <span aria-hidden style={{ position: 'relative', display: 'block', flexShrink: 0, width, aspectRatio: String(PICS[kind].aspect), ...style }}>
      <Pic kind={kind} />
    </span>
  );
}

// ── Image Frame ───────────────────────────────────────────
export type FloaterSpec = { placement: IfPlacement; node: ReactNode };
export type FramePart = 'root' | 'image' | 'stroke' | 'floater';
export type ImageFrameViewProps = {
  look: ImageFrameLook;
  mode?: ViewMode;
  ratio?: IfRatio;
  // 고정 폭(px) — 모서리를 고른다. fill 이면 부모 폭을 채운다(모서리는 width 로, 없으면 8)
  width?: number;
  fill?: boolean;
  bleed?: boolean;
  fit?: IfFit;
  // 그림(대역) — 없으면 처음부터 대체 그림
  pic?: PicKind | null;
  state?: IfState;
  fallbackIcon?: CpGlyph;
  // 대체 그림을 통째로(카드 면)
  fallback?: ReactNode;
  // 대체 글 — 빈 글이면 장식
  alt?: string;
  floaters?: FloaterSpec[];
  // 그림을 키워 그릴 때(Anatomy) — 치수를 모두 곱한다
  zoom?: number;
  // 나쁜 예 — 모서리 · 윤곽 · 흐림 · 커짐
  radius?: number;
  stroke?: 'overlay' | 'opaque' | 'none';
  opaqueStroke?: DColor;
  dim?: number;
  scale?: number;
  // 다 받으면 투명도로 나타난다(motion "그림이 옴")
  reveal?: boolean;
  // 나쁜 예 — 세로 카드 그림을 돌리지 않고 가로 틀에 채운다(지금 제품)
  turn?: boolean;
  zone?: Partial<Record<FramePart, CSSProperties>>;
  pins?: ReactNode;
  style?: CSSProperties;
};
// 그림 위 자리 — 가장자리에서 offset. 시작 = 왼쪽(왼쪽에서 오른쪽으로 쓰는 글)
export const floaterPos = (p: IfPlacement, off: number): CSSProperties => ({ position: 'absolute', zIndex: 3, display: 'flex', ...(p.startsWith('top') ? { top: off } : { bottom: off }), ...(p.endsWith('start') ? { left: off } : { right: off }) });

export function ImageFrameView({ look, mode = 'auto', ratio, width, fill: fillParent = false, bleed = false, fit, pic, state, fallbackIcon = 'image', fallback, alt = '', floaters, zoom = 1, radius, stroke = 'overlay', opaqueStroke, dim, scale, reveal = false, turn = true, zone, pins, style }: ImageFrameViewProps) {
  const r = ratio ?? look.defaults.ratio;
  const F = look.ratios[r].value;
  const rk = imageFrameRadius(fillParent && width === undefined ? undefined : width, look.bands, bleed);
  const rad = (radius ?? look.radius[rk].px) * zoom;
  const st: IfState = state ?? (pic ? 'loaded' : 'fallback');
  const f = fit ?? look.defaults.fit;
  const pxW = width !== undefined ? width * zoom : undefined;
  const pxH = pxW !== undefined ? pxW / F : undefined;
  const rotate = turn && r === 'card' && pic && PICS[pic].aspect < 1 ? look.rotate : 0;
  // 그림 위 자리 — 짧은 변이 minSide 이상일 때만, max 개까지(폭을 모르면 그린다)
  const shortSide = pxW !== undefined && pxH !== undefined ? Math.min(pxW, pxH) / zoom : Infinity;
  const fl = shortSide >= look.floater.minSide ? (floaters ?? []).slice(0, look.floater.max) : [];
  const line = stroke === 'none' ? null : stroke === 'opaque' && opaqueStroke ? dcv(opaqueStroke, mode) : dcv(look.stroke.color, mode);
  return (
    <span
      data-pframe={r}
      style={{
        position: 'relative',
        display: 'block',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: fillParent || pxW === undefined ? '100%' : pxW,
        aspectRatio: String(F),
        borderRadius: rad,
        overflow: 'hidden',
        isolation: 'isolate',
        background: f === 'contain' && st === 'loaded' ? dcv(look.plate, mode) : undefined,
        opacity: dim,
        transform: scale ? `scale(${scale})` : undefined,
        ...zone?.root,
        ...style,
      }}
    >
      {pic && st !== 'fallback' && (
        <PicLayer
          kind={pic}
          frame={F}
          fit={f}
          rotate={rotate}
          label={alt || undefined}
          className={reveal ? 'pif-reveal' : undefined}
          style={{ opacity: st === 'loading' ? 0 : 1, ...(reveal ? { ['--pif-d' as string]: look.reveal.duration, ['--pif-e' as string]: look.reveal.easing } : {}), ...zone?.image }}
        />
      )}
      {st === 'loading' && <SkeletonView look={look.sk} mode={mode} width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, borderRadius: 0 }} />}
      {st === 'fallback' &&
        (fallback ? (
          // 대체 그림을 통째로(카드 면) — alt 가 있으면 그 이름을 이어받는다
          <span style={fill} {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}>
            {fallback}
          </span>
        ) : (
          <ContentPlaceholderView look={look.cp} mode={mode} icon={fallbackIcon} label={alt || undefined} w={pxW} h={pxH} style={{ position: 'absolute', top: 0, left: 0 }} />
        ))}
      {line && <span aria-hidden data-pframe-stroke="" style={{ ...fill, zIndex: 2, borderRadius: 'inherit', boxShadow: `inset 0 0 0 ${look.stroke.width * zoom}px ${line}`, pointerEvents: 'none', ...zone?.stroke }} />}
      {fl.map((x) => (
        <span key={x.placement} data-pfloater={x.placement} style={{ ...floaterPos(x.placement, look.floater.offset * zoom), ...zone?.floater }}>
          {x.node}
        </span>
      ))}
      {pins}
    </span>
  );
}

// 장수 · 길이 글(Indicator) — 보이는 글은 숨기고 읽는 글(label)을 숨은 글로. 바탕은 두 모드 같다(overlay-dim-dark)
export function IndicatorView({ look, children, label, zoom = 1, style }: { look: ImageFrameLook; children: ReactNode; label: string; zoom?: number; style?: CSSProperties }) {
  const i = look.indicator;
  return (
    <span
      data-pindicator=""
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        minHeight: i.minH * zoom,
        paddingTop: i.padY * zoom,
        paddingBottom: i.padY * zoom,
        paddingLeft: i.padX * zoom,
        paddingRight: i.padX * zoom,
        borderRadius: 9999,
        background: i.bg,
        color: i.fg.light,
        fontFamily: FONT,
        fontSize: i.fontSize * zoom,
        lineHeight: `${i.lineHeight * zoom}px`,
        fontWeight: i.weight,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span aria-hidden>{children}</span>
      <span style={srOnly}>{label}</span>
    </span>
  );
}

// ── 카드 그림 ─────────────────────────────────────────────
// 카드 면 — 기관 색 한 색. 작은 면(폭 < 96)은 회사 첫 글자만 가운데, 그 위는 왼쪽 아래 회사 · 카드 이름
export type CardFace = { bg: string; fg: SplitColor };
// textScale — 글자 배율(앱 · 브라우저 글자 크기). 글자만 커지고 여백은 그대로다. 회사 줄 + 이름 한 줄 + 아래 여백이 면 높이보다 크면
// 첫 글자 면(card-art.yaml label.fit — 2026-10-17 03-D 결정 3 A)
export function CardFaceView({ ca, face, issuer, name, width, mode = 'auto', zoom = 1, textScale = 1 }: { ca: CardArtLook; face: CardFace; issuer: string; name: string; width: number; mode?: ViewMode; zoom?: number; textScale?: number }) {
  const band = cardArtSize(width, ca.bands);
  const fits = band === 'small' || (ca.sizes[band].issuer.lineHeight + ca.sizes[band].name.lineHeight) * textScale + ca.sizes[band].padBottom <= width / ca.ratio;
  const size = fits ? band : 'small';
  const fg = fgProps(face.fg, mode);
  if (size === 'small')
    return (
      <span aria-hidden data-pcardface="small" className={fg.className} data-mode={fg['data-mode']} style={{ ...fill, display: 'flex', alignItems: 'center', justifyContent: 'center', background: face.bg, fontFamily: FONT, fontSize: cardInitialSize(width, ca) * zoom, lineHeight: ca.initial.lineHeight, fontWeight: ca.initial.weight, ...fg.style }}>
        {avatarInitial(issuer)}
      </span>
    );
  const s = ca.sizes[size];
  const z = zoom * textScale;
  return (
    <span aria-hidden data-pcardface={size} className={fg.className} data-mode={fg['data-mode']} style={{ ...fill, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box', paddingLeft: s.padX * zoom, paddingRight: s.padX * zoom, paddingBottom: s.padBottom * zoom, background: face.bg, fontFamily: FONT, textAlign: 'left', ...fg.style }}>
      <span style={{ display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: s.issuer.fontSize * z, lineHeight: `${s.issuer.lineHeight * z}px`, fontWeight: ca.issuerWeight }}>{issuer}</span>
      {s.nameClamp === 1 ? (
        // 한 줄 — 넘치면 말줄임(medium)
        <span style={{ display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: s.name.fontSize * z, lineHeight: `${s.name.lineHeight * z}px`, fontWeight: ca.nameWeight }}>{name}</span>
      ) : (
        // 여러 줄 — 단어 단위로 바꾸고(v114) 그 줄 수를 넘으면 말줄임(large 두 줄)
        <span style={{ display: '-webkit-box', WebkitLineClamp: s.nameClamp, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: s.name.fontSize * z, lineHeight: `${s.name.lineHeight * z}px`, fontWeight: ca.nameWeight, wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{name}</span>
      )}
    </span>
  );
}

export type CardArtViewProps = Omit<ImageFrameViewProps, 'ratio' | 'fallback' | 'fallbackIcon' | 'alt' | 'width'> & {
  ca: CardArtLook;
  width: number;
  issuer: string;
  name: string;
  // 아는 카드사의 면(서버가 기관 색 표에서 찾아 넘긴다) — 없으면 대체 그림
  face: CardFace | null;
  decorative?: boolean;
  // 글자 배율 — 카드 면의 글만 키운다(안 들면 첫 글자 면)
  textScale?: number;
};
// 카드 그림 — ratio card 의 Image Frame. 그림이 없거나 실패하면 아는 카드사는 카드 면, 모르면 대체 그림(credit-card).
// 장식(기본)이면 alt="" — 그림 · 면을 숨기고, 아니면 "카드사 카드 이름" 을 읽는다. 그림 위 배지는 그대로 읽힌다(레시피 CardArt 와 같다)
export function CardArtView({ ca, width, issuer, name, face, decorative = true, mode = 'auto', zoom = 1, textScale = 1, ...rest }: CardArtViewProps) {
  const label = [issuer.trim(), name.trim()].filter(Boolean).join(' ');
  return (
    <span data-pcardart="" style={{ display: 'block', flexShrink: 0, width: rest.fill ? '100%' : width * zoom }}>
      <ImageFrameView {...rest} mode={mode} zoom={zoom} ratio="card" width={width} alt={decorative ? '' : label} fallbackIcon="credit-card" fallback={face ? <CardFaceView ca={ca} face={face} issuer={issuer} name={name} width={width} mode={mode} zoom={zoom} textScale={textScale} /> : undefined} />
    </span>
  );
}

// ── Logo Tile ─────────────────────────────────────────────
export type LogoState = 'initial' | 'loaded' | 'failed';
export type LogoPaint = { bg: DColor; fg: SplitColor };
export type LogoTileViewProps = {
  look: LogoTileLook;
  frame: ImageFrameLook;
  mode?: ViewMode;
  size?: LtSize;
  name: string;
  // 면 · 글자색 — 기관 색 표 또는 이름 색(서버가 찾아 넘긴다)
  paint: LogoPaint;
  image?: LtImage;
  pic?: PicKind;
  // 첫 글자(그림이 오기 전) · 다 받음 · 실패(첫 글자 그대로)
  state?: LogoState;
  decorative?: boolean;
  zoom?: number;
  // 나쁜 예 — 윤곽 없음 · 모서리 · 글자색 · 원 · 두 글자
  bad?: { stroke?: boolean; radius?: number; fg?: string; round?: boolean; text?: string; crop?: boolean };
  zone?: Partial<Record<'root' | 'initial' | 'plate' | 'stroke', CSSProperties>>;
  pins?: ReactNode;
  style?: CSSProperties;
};
export function LogoTileView({ look, frame, mode = 'auto', size, name, paint, image, pic, state = 'loaded', decorative = true, zoom = 1, bad, zone, pins, style }: LogoTileViewProps) {
  const sz = look.sizes[size ?? look.defaults.size];
  const s = sz.size * zoom;
  const img = image ?? look.defaults.image;
  const covered = img !== 'none' && pic && state === 'loaded';
  const fg = bad?.fg ? { style: { color: bad.fg } as CSSProperties } : fgProps(paint.fg, mode);
  const inner = (sz.size - look.platePad * 2) * zoom;
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name.trim() };
  return (
    <span
      {...a11y}
      data-plogo={sz.size}
      className={'className' in fg ? fg.className : undefined}
      data-mode={'data-mode' in fg ? fg['data-mode'] : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: s,
        height: s,
        borderRadius: bad?.round ? 9999 : (bad?.radius ?? sz.radius) * zoom,
        overflow: 'hidden',
        // 그림이 덮으면 판의 색 — 둥근 가장자리에서 면의 색이 비치지 않게(판이 첫 글자 · 면을 모두 덮는다)
        background: dcv(covered ? (img === 'card' ? look.plate.card : look.plate.logo) : paint.bg, mode),
        fontFamily: FONT,
        fontSize: sz.font * zoom,
        lineHeight: look.initial.lineHeight,
        fontWeight: look.initial.weight,
        verticalAlign: 'middle',
        ...fg.style,
        ...zone?.root,
        ...style,
      }}
    >
      <span aria-hidden style={{ position: 'relative', ...zone?.initial }}>{bad?.text ?? avatarInitial(name)}</span>
      {covered && (
        <span aria-hidden data-plogo-plate={img} style={{ ...fill, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', paddingTop: look.platePad * zoom, paddingRight: look.platePad * zoom, paddingBottom: look.platePad * zoom, paddingLeft: look.platePad * zoom, background: dcv(img === 'card' ? look.plate.card : look.plate.logo, mode), ...zone?.plate }}>
          {img === 'card' ? (
            bad?.crop ? (
              <span style={{ position: 'relative', display: 'block', width: s, height: s, marginTop: -look.platePad * zoom, marginRight: -look.platePad * zoom, marginBottom: -look.platePad * zoom, marginLeft: -look.platePad * zoom, overflow: 'hidden' }}>
                <PicLayer kind={pic} frame={1} fit="cover" />
              </span>
            ) : (
              <ImageFrameView look={frame} mode={mode} ratio="card" width={sz.size - look.platePad * 2} pic={pic} zoom={zoom} />
            )
          ) : (
            <span style={{ position: 'relative', display: 'block', width: inner, height: inner }}>
              <PicLayer kind={pic} frame={1} fit="contain" />
            </span>
          )}
        </span>
      )}
      {bad?.stroke !== false && <span aria-hidden data-plogo-stroke="" style={{ ...fill, zIndex: 2, borderRadius: 'inherit', boxShadow: `inset 0 0 0 ${look.stroke.width * zoom}px ${dcv(look.stroke.color, mode)}`, pointerEvents: 'none', ...zone?.stroke }} />}
      {pins}
    </span>
  );
}

// ── Aspect Ratio ──────────────────────────────────────────
export function AspectRatioView({ look, ratio, width = '100%', children, zone, style }: { look: AspectRatioLook; ratio?: IfRatio; width?: number | string; children?: ReactNode; zone?: { root?: CSSProperties; child?: CSSProperties }; style?: CSSProperties }) {
  const r = ratio ?? look.defaults.ratio;
  return (
    <div data-paspect={r} style={{ position: 'relative', width, aspectRatio: String(look.ratios[r].value), overflow: 'hidden', ...zone?.root, ...style }}>
      <div style={{ ...fill, ...zone?.child }}>{children}</div>
    </div>
  );
}
// 동영상 자식 — 포스터 화면 + 재생 단추 + 막대(브라우저 기본 컨트롤 자리). 그림이라 누르지 않는다
// frame — 담는 상자의 비율(그림을 그 비율로 자른다)
export function VideoChild({ frame, playing = false, label = '안내 동영상' }: { frame: number; playing?: boolean; label?: string }) {
  return (
    <div role="img" aria-label={label} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden', background: '#121A2A' }}>
      <PicLayer kind="video" frame={frame} fit="cover" />
      {!playing && (
        <span aria-hidden style={{ position: 'absolute', left: '50%', top: '50%', width: 44, height: 44, marginLeft: -22, marginTop: -22, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.92)', display: 'grid', placeItems: 'center', color: '#121A2A' }}>
          <Play size={20} strokeWidth={2.5} fill="currentColor" style={{ marginLeft: 3 }} />
        </span>
      )}
      <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 8, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, background: 'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0))', color: '#FFFFFF' }}>
        {playing ? <Pause size={13} strokeWidth={2.5} /> : <Play size={13} strokeWidth={2.5} />}
        <span style={{ position: 'relative', flex: 1, height: 3, borderRadius: 9999, background: 'rgba(255,255,255,.35)' }}>
          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: playing ? '38%' : '0%', borderRadius: 9999, background: '#FFFFFF' }} />
        </span>
        <span style={{ fontFamily: FONT, fontSize: 10, lineHeight: '12px', fontVariantNumeric: 'tabular-nums' }}>{playing ? '0:46' : '0:00'} / 2:04</span>
        <Volume2 size={13} strokeWidth={2.5} />
      </span>
    </div>
  );
}
export function MapChild({ frame, label = '지도' }: { frame: number; label?: string }) {
  return (
    <div role="img" aria-label={label} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}>
      <PicLayer kind="map" frame={frame} fit="cover" />
    </div>
  );
}
