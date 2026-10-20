// 기다림 묶음의 모양 — specs/components/skeleton · progress-circle · pull-to-refresh · progress · scroll-fog · content-placeholder.yaml 을
// 풀어 둔다(서버, 빌드 때). 그림(loading-view)은 이 값만 받아 그린다 — 크기 · 모서리 · 색 · 시간 · 곡선을 그림에 따로 적지 않는다.
// 비고 · 속성 글자 속 수(글자 자리 줄 높이 · 다시 시도 간격 · 호의 75% · 꼬리의 33.33% · 흐림 깊이)도 여기서 읽고 토큰과 맞는지 확인한다 —
// 문장이 바뀌면 빌드가 멈춘다(그림이 낡지 않게).
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, proseValue, type Brand } from '@/lib/design-tokens';
import {
  CP_GLYPHS,
  FOG_USES,
  LD_TONES,
  PC_SIZES,
  PC_TONES,
  PG_MEANINGS,
  SK_RADII,
  SK_TEXTS,
  type FogPlace,
  type FogUse,
  type LdColor,
  type LdMotion,
  type LdScreenBase,
  type LdType,
  type LoadingKit,
  type PcFace,
  type PgMeaning,
  type PlaceholderLook,
  type ProgressCircleLook,
  type ProgressLook,
  type PullLook,
  type ScrollFogLook,
  type SkRadius,
  type SkText,
  type SkeletonLook,
} from './loading-shared';
export * from './loading-shared';

type Vals = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`기다림 YAML 에 ${what} 이 없다`);
  return v;
};
// '16px' · '$spacing-x3' · '$radius-full' · '−88px' → 수
const len = (raw: unknown, what: string) => {
  const v = String(tokenValue(must(raw, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what);
};
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`기다림 YAML 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
const same = (a: number, b: number, what: string) => {
  if (Math.abs(a - b) > 1e-6) throw new Error(`${what} — ${a} 와 ${b} 가 다르다`);
};
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — loading-look.ts 를 고친다`);
}
const msOf = (v: string, what: string) => {
  const m = /^([\d.]+)\s*(ms|s)$/.exec(v.trim());
  if (!m) throw new Error(`${what}(${v})이 시간(ms · s)이 아니다`);
  return m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1]);
};

// ── 색 ──────────────────────────────────────────────────
// 사이트 모드를 따르는 그림의 CSS 변수 이름 — HR 에서 값이 다른 브랜드 토큰은 --p-hr-<이름>(tokens-style.tsx 와 같은 규칙)
function varName(name: string, brand: Brand) {
  if (brand !== 'hr') return name;
  const desk = design('desk').front.colors;
  const hr = design('hr').front.colors;
  if (!(name in desk) || !hr[name]) return name;
  const differs = hr[name] !== desk[name] || (hr[`${name}-dark`] ?? hr[name]) !== (desk[`${name}-dark`] ?? desk[name]);
  return differs ? `hr-${name}` : name;
}
function rgba(hex: string, pct: number) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${pct / 100})`;
}
export function named(name: string, brand: Brand = 'desk'): LdColor {
  const c = design(brand).front.colors;
  const dark = c[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
// `$color-x` · `$color-x / 30%`
function col(raw: unknown, brand: Brand, what: string): LdColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$color-([a-z0-9-]+)(?:\s*\/\s*(\d+)%)?$/.exec(v);
  if (!m) throw new Error(`기다림 YAML 의 ${what} 이 색 토큰이 아니다(${v})`);
  const c = named(m[1], brand);
  if (!m[2]) return c;
  const a = Number(m[2]);
  return { name: c.name, light: rgba(c.light, a), dark: rgba(c.dark, a), alpha: a };
}
function type(raw: unknown, what: string): LdType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: t.fontWeight ?? 400, fontFamily: t.fontFamily ?? "'Pretendard Variable', Pretendard, sans-serif" };
}
const motion = (d: unknown, e: unknown, what: string): LdMotion => {
  const duration = String(tokenValue(must(d, `${what} 시간`)));
  return { duration, easing: String(tokenValue(must(e, `${what} 곡선`))), ms: msOf(duration, `${what} 시간`) };
};
type MotionEntry = { duration: unknown; easing: unknown; properties?: string[]; note?: string };
function motionEntry(spec: string, name: string): MotionEntry {
  const all = (loadComponentSpec(spec) as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`${spec}.yaml 의 motion 에 "${name}" 이 없다`);
  return m;
}
const motionOf = (spec: string, name: string) => {
  const m = motionEntry(spec, name);
  return motion(m.duration, m.easing, `${spec} ${name}`);
};
const propsOf = (spec: string, name: string) => (motionEntry(spec, name).properties ?? []).join(' ');

// ── Skeleton ─────────────────────────────────────────────
function skeletonLook(): SkeletonLook {
  const F = 'skeleton.yaml';
  const spec = loadComponentSpec('skeleton');
  sameSet(axisValues(spec, 'radius'), SK_RADII, `${F} 의 radius`);
  sameSet(stateNames(spec), ['enabled', 'reducedMotion'], `${F} 의 states`);
  const v = resolveState(spec, {}, 'enabled');
  const reduced = resolveState(spec, {}, 'reducedMotion');
  // 모서리 — 값 이름과 실제 px 가 같아야 한다(full 은 9999)
  const radius = {} as Record<SkRadius, number>;
  for (const r of SK_RADII) {
    const px = len(resolveState(spec, { radius: r }, 'enabled')['root.radius'], `${F} radius ${r}`);
    if (r !== 'full') same(px, Number(r), `${F} radius ${r} 의 값`);
    radius[r] = px;
  }
  // 글자 자리 — 비고의 "t4 14 → 19" 가 글자 토큰의 크기 · 줄 높이와 같은지
  const typo = design().front.typography;
  const text = {} as SkeletonLook['text'];
  for (const t of SK_TEXTS) {
    const tk = must(typo[t], `글자 토큰 ${t}`);
    text[t] = { size: parseFloat(tk.fontSize), lineHeight: parseFloat(must(tk.lineHeight, `${t} 줄 높이`)) };
  }
  const hNote = noteOf(v['root.height']);
  const pairs = [...hNote.matchAll(/(t\d+)\s+(\d+)\s*→\s*(\d+)/g)];
  if (pairs.length < 3) throw new Error(`${F} root.height 비고에서 "tN 크기 → 줄 높이" 를 찾지 못했다`);
  for (const [, t, size, lh] of pairs) {
    const tk = text[t as SkText];
    if (!tk) throw new Error(`${F} root.height 비고의 ${t} 가 글자 토큰에 없다`);
    same(Number(size), tk.size, `${F} root.height 비고 ${t} 크기`);
    same(Number(lh), tk.lineHeight, `${F} root.height 비고 ${t} 줄 높이`);
  }
  // 반짝임 띠 — 라이트 · 다크 그라디언트
  const band = must(v['shimmer.background'], `${F} shimmer.background`) as { value?: string; dark?: string };
  const g = (ref: unknown, what: string) => {
    const m = /^\$(gradient-[a-z0-9-]+)$/.exec(String(ref ?? ''));
    if (!m) throw new Error(`${F} ${what} 가 그라디언트 토큰이 아니다(${String(ref)})`);
    return proseValue(m[1]);
  };
  if (String(band.value) !== '$gradient-shimmer-neutral' || String(band.dark) !== '$gradient-shimmer-neutral-dark') throw new Error(`${F} shimmer.background 가 gradient-shimmer-neutral · -dark 가 아니다 — tokens-style 의 --p-gradient-shimmer-neutral 과 함께 고친다`);
  if (String(unbox(v['shimmer.width'])) !== '100%') throw new Error(`${F} shimmer.width 가 100% 가 아니다 — 그림의 띠를 고친다`);
  if (Number(unbox(reduced['shimmer.opacity'])) !== 0) throw new Error(`${F} reducedMotion shimmer.opacity 가 0 이 아니다 — 그림의 모션 줄이기를 고친다`);
  // 반짝임 모션 — "translateX −100% → 100%"
  const sh = motionOf('skeleton', '반짝임');
  const tr = /translateX\s*([−-]?\d+)%\s*→\s*([−-]?\d+)%/.exec(propsOf('skeleton', '반짝임'));
  if (!tr) throw new Error(`${F} motion "반짝임" 의 properties 에서 translateX 를 찾지 못했다`);
  // 기다리는 영역 — 시간표 · 다시 시도("1초 · 2초 뒤")
  const ms = (k: string) => msOf(String(unbox(must(v[`region.${k}`], `${F} region.${k}`))), `${F} region.${k}`);
  const retry = numIn(String(unbox(v['region.retry'])), /(\d+)/, `${F} region.retry`);
  const retryDelays = [...noteOf(v['region.retry']).matchAll(/(\d+)초/g)].slice(0, retry).map((m) => Number(m[1]) * 1000);
  if (retryDelays.length !== retry) throw new Error(`${F} region.retry 비고의 간격(${retryDelays.join(', ')})이 ${retry}번이 아니다`);
  const region = { showAfter: ms('showAfter'), slowAfter: ms('slowAfter'), timeout: ms('timeout'), retry, retryDelays };
  if (!(region.showAfter < region.slowAfter && region.slowAfter < region.timeout)) throw new Error(`${F} region 의 시간표 순서가 맞지 않는다`);
  same(numIn(noteOf(v['region.timeout']), /(\d+)초/, `${F} region.timeout 비고`) * 1000, region.timeout, `${F} region.timeout 비고의 초`);
  return {
    radius,
    defaultRadius: must(spec.defaults?.radius, `${F} defaults.radius`) as SkRadius,
    bg: col(v['root.background'], 'desk', `${F} root.background`),
    shimmer: { light: g(band.value, 'shimmer.background'), dark: g(band.dark, 'shimmer.background dark') },
    text,
    motion: { shimmer: { ...sh, from: Number(tr[1].replace('−', '-')), to: Number(tr[2].replace('−', '-')) }, reveal: motionOf('skeleton', '내용으로 바뀜') },
    region,
    slowText: { ...type(v['slowText.typography'], `${F} slowText.typography`), fontWeight: Number(unbox(must(v['slowText.fontWeight'], `${F} slowText.fontWeight`))), color: col(v['slowText.foreground'], 'desk', `${F} slowText.foreground`), gap: len(v['slowText.gap'], `${F} slowText.gap`), padX: len(v['slowText.paddingX'], `${F} slowText.paddingX`), padXList: numIn(noteOf(v['slowText.paddingX']), /목록 카드\(body list\) 바로 아래 영역이면\s*(\d+)/, `${F} slowText.paddingX 비고(목록 카드)`) },
    surfaces: { default: named('bg-layer-default'), floating: named('bg-layer-floating'), basement: named('bg-layer-basement') },
  };
}

// ── Progress Circle ──────────────────────────────────────
function circleLook(brand: Brand): ProgressCircleLook {
  const F = 'progress-circle.yaml';
  const spec = loadComponentSpec('progress-circle');
  sameSet(axisValues(spec, 'size'), [...PC_SIZES, 'inherit'], `${F} 의 size`);
  sameSet(axisValues(spec, 'tone'), PC_TONES, `${F} 의 tone`);
  sameSet(axisValues(spec, 'mode'), ['indeterminate', 'determinate'], `${F} 의 mode`);
  sameSet(stateNames(spec), ['enabled', 'reducedMotion'], `${F} 의 states`);
  const sizes = {} as ProgressCircleLook['sizes'];
  for (const s of PC_SIZES) {
    const v = resolveState(spec, { size: s }, 'enabled');
    const size = len(v['root.size'], `${F} ${s} root.size`);
    const thickness = len(v['root.thickness'], `${F} ${s} root.thickness`);
    same(size, Number(s), `${F} size ${s} 의 값`);
    // "선 가운데 반지름 10.5" = (크기 − 두께) ÷ 2
    same(numIn(noteOf(v['root.thickness']), /반지름\s*([\d.]+)/, `${F} ${s} thickness 비고`), (size - thickness) / 2, `${F} ${s} 의 선 가운데 반지름`);
    sizes[s] = { size, thickness };
  }
  const face = (tone: string): PcFace => {
    const v = resolveState(spec, { tone }, 'enabled');
    return { track: col(v['root.track'], brand, `${F} ${tone} root.track`), range: col(v['root.range'], brand, `${F} ${tone} root.range`) };
  };
  const inh = resolveState(spec, { tone: 'inherit' }, 'enabled');
  const inheritTrackAlpha = numIn(String(unbox(inh['root.track'])), /(\d+)%/, `${F} inherit root.track`);
  if (String(unbox(inh['root.range'])) !== 'currentColor') throw new Error(`${F} inherit root.range 가 currentColor 가 아니다`);
  const base = resolveState(spec, {}, 'enabled');
  if (String(unbox(base['range.linecap'])) !== 'round') throw new Error(`${F} range.linecap 이 round 가 아니다 — 그림을 고친다`);
  const start = numIn(noteOf(base['range.start']).replace('−', '-'), /(-?\d+)°/, `${F} range.start 비고`);
  const reducedArc = numIn(String(unbox(resolveState(spec, { mode: 'indeterminate' }, 'reducedMotion')['range.length'])), /(\d+)%/, `${F} reducedMotion range.length`);
  // 값 있는 원의 채움 전환 — 규칙 값과 motion "채움" 이 같은지
  const det = resolveState(spec, { mode: 'determinate' }, 'enabled');
  const fill = motionOf('progress-circle', '채움');
  const ruleFill = motion(det['range.transitionDuration'], det['range.transitionEasing'], `${F} determinate range.transition`);
  if (ruleFill.duration !== fill.duration || ruleFill.easing !== fill.easing) throw new Error(`${F} 의 채움 전환이 규칙과 motion 에서 다르다`);
  const head = motionOf('progress-circle', '호 머리');
  const tail = motionOf('progress-circle', '호 꼬리');
  const rotate = motionOf('progress-circle', '회전');
  return {
    sizes,
    defaults: { size: must(spec.defaults?.size, `${F} defaults.size`) as ProgressCircleLook['defaults']['size'], tone: must(spec.defaults?.tone, `${F} defaults.tone`) as ProgressCircleLook['defaults']['tone'] },
    tones: { neutral: face('neutral'), brand: face('brand'), staticWhite: face('staticWhite') },
    inheritTrackAlpha,
    start,
    reducedArc,
    motion: {
      rotate,
      head: { ...head, until: numIn(propsOf('progress-circle', '호 머리'), /0\s*~\s*([\d.]+)%/, `${F} motion "호 머리"`) },
      tail: { ...tail, from: numIn(propsOf('progress-circle', '호 꼬리'), /0\s*~\s*([\d.]+)%/, `${F} motion "호 꼬리"`) },
      fill,
    },
  };
}

// ── 당겨서 새로 고침 ─────────────────────────────────────
function pullLook(circle: ProgressCircleLook): PullLook {
  const F = 'pull-to-refresh.yaml';
  const spec = loadComponentSpec('pull-to-refresh');
  sameSet(stateNames(spec), ['idle', 'pulling', 'ready', 'refreshing'], `${F} 의 states`);
  const v = resolveState(spec, {}, 'idle');
  const refreshing = resolveState(spec, {}, 'refreshing');
  const threshold = len(v['root.threshold'], `${F} root.threshold`);
  const indicator = len(v['indicator.height'], `${F} indicator.height`);
  same(len(v['indicator.translateY'], `${F} indicator.translateY`), -indicator, `${F} 쉬는 지시자 — 칸 높이만큼 위`);
  same(len(refreshing['content.translateY'], `${F} refreshing content.translateY`), threshold, `${F} 새로 고치는 동안 내용 자리 — 문턱`);
  const c = len(v['circle.size'], `${F} circle.size`);
  same(c, circle.sizes['24'].size, `${F} circle.size — Progress Circle 24`);
  // "원 24 + 위아래 32"
  same(numIn(noteOf(v['indicator.height']), /위아래\s*(\d+)/, `${F} indicator.height 비고`) * 2 + c, indicator, `${F} 지시자 칸 높이`);
  return {
    threshold,
    multiplier: Number(unbox(must(v['root.multiplier'], `${F} root.multiplier`))),
    indicator,
    circle: c,
    motion: { release: motionOf('pull-to-refresh', '놓음 — 88 로'), done: motionOf('pull-to-refresh', '끝남 — 제자리로'), cancel: motionOf('pull-to-refresh', '문턱 전 놓음') },
  };
}

// ── Progress(미터) ───────────────────────────────────────
function progressLook(brand: Brand): ProgressLook {
  const F = 'progress.yaml';
  const spec = loadComponentSpec('progress');
  sameSet(axisValues(spec, 'meaning'), PG_MEANINGS, `${F} 의 meaning`);
  sameSet(stateNames(spec), ['enabled', 'over', 'reached'], `${F} 의 states`);
  const v = resolveState(spec, {}, 'enabled');
  const over = resolveState(spec, { meaning: 'limit' }, 'over');
  const reached = resolveState(spec, { meaning: 'goal' }, 'reached');
  const fillMotion = motion(v['fill.transitionDuration'], v['fill.transitionEasing'], `${F} fill.transition`);
  const m = motionOf('progress', '채움');
  if (m.duration !== fillMotion.duration || m.easing !== fillMotion.easing) throw new Error(`${F} 의 채움 전환이 규칙과 motion 에서 다르다`);
  if (String(unbox(v['fill.transitionProperty'])) !== 'width') throw new Error(`${F} fill.transitionProperty 가 width 가 아니다 — 그림을 고친다`);
  if (String(unbox(over['fill.width'])) !== '100%' || String(unbox(reached['fill.width'])) !== '100%') throw new Error(`${F} 넘침 · 달성의 fill.width 가 100% 가 아니다 — 그림을 고친다`);
  return {
    gap: len(v['root.gap'], `${F} root.gap`),
    headerGap: len(v['header.gap'], `${F} header.gap`),
    label: { ...type(v['label.typography'], `${F} label`), fontWeight: Number(unbox(must(v['label.fontWeight'], `${F} label.fontWeight`))), color: col(v['label.foreground'], brand, `${F} label.foreground`) },
    status: { ...type(v['status.typography'], `${F} status`), color: col(v['status.foreground'], brand, `${F} status.foreground`) },
    track: { height: len(v['track.height'], `${F} track.height`), radius: len(v['track.radius'], `${F} track.radius`), bg: col(v['track.background'], brand, `${F} track.background`) },
    fill: { radius: len(v['fill.radius'], `${F} fill.radius`), bg: col(v['fill.background'], brand, `${F} fill.background`), motion: fillMotion },
    amount: { ...type(v['amount.typography'], `${F} amount`), color: col(v['amount.foreground'], brand, `${F} amount.foreground`) },
    over: { fill: col(over['fill.background'], brand, `${F} over fill.background`), status: col(over['status.foreground'], brand, `${F} over status.foreground`), weight: Number(unbox(over['status.fontWeight'])) },
    reached: { status: col(reached['status.foreground'], brand, `${F} reached status.foreground`), weight: Number(unbox(reached['status.fontWeight'])) },
    defaultMeaning: must(spec.defaults?.meaning, `${F} defaults.meaning`) as PgMeaning,
  };
}

// ── Scroll Fog ───────────────────────────────────────────
// "위 20px · 아래 80px"
const topBottom = (raw: unknown, what: string) => {
  const t = String(unbox(must(raw, what)));
  return { top: numIn(t, /위\s*(\d+)px/, what), bottom: numIn(t, /아래\s*(\d+)px/, what) };
};
let fogCache: ScrollFogLook | undefined;
export function scrollFogLook(): ScrollFogLook {
  if (fogCache) return fogCache;
  const F = 'scroll-fog.yaml';
  const spec = loadComponentSpec('scroll-fog');
  sameSet(axisValues(spec, 'use'), FOG_USES, `${F} 의 use`);
  const base = resolveState(spec, {}, 'enabled');
  if (String(unbox(base['fog.mask'])) !== '$gradient-fade-mask') throw new Error(`${F} fog.mask 가 gradient-fade-mask 가 아니다`);
  const mask = proseValue('gradient-fade-mask');
  const depth = len(base['fog.size'], `${F} fog.size`);
  const at = (use: FogUse) => resolveState(spec, { use }, 'enabled');
  const box = at('box');
  const row = at('row');
  const placement = (v: Vals, want: string, what: string) => {
    const p = String(unbox(v['fog.placement']));
    if (!p.includes(want)) throw new Error(`${F} ${what} fog.placement(${p})가 "${want}" 이 아니다 — 그림을 고친다`);
  };
  placement(row, '좌 · 우', 'row');
  if (!String(unbox(box['root.overflowY'])).startsWith('auto')) throw new Error(`${F} box root.overflowY 가 auto 가 아니다`);
  const boxPad = len(box['content.padding'], `${F} box content.padding`);
  same(boxPad, depth, `${F} box 여백 — 깊이`);
  const boxScroll = len(box['content.scrollPadding'], `${F} box content.scrollPadding`);
  const rowDepth = len(row['fog.size'], `${F} row fog.size`);
  const rowPad = len(row['content.paddingX'], `${F} row content.paddingX`);
  if (rowPad < rowDepth) throw new Error(`${F} row 여백(${rowPad})이 흐림(${rowDepth})보다 좁다`);
  const place = (use: 'overlayBody' | 'page'): FogPlace => {
    const v = at(use);
    placement(v, '위 · 아래', use);
    const d = topBottom(v['fog.size'], `${F} ${use} fog.size`);
    const s = topBottom(v['content.scrollPadding'], `${F} ${use} content.scrollPadding`);
    const pad = { top: len(v['content.paddingTop'], `${F} ${use} content.paddingTop`), bottom: len(v['content.paddingBottom'], `${F} ${use} content.paddingBottom`) };
    same(pad.top, d.top, `${F} ${use} 위 여백 — 흐림 깊이`);
    same(pad.bottom, d.bottom, `${F} ${use} 아래 여백 — 흐림 깊이`);
    same(s.top, d.top, `${F} ${use} 위 스크롤 여유 — 흐림 깊이`);
    same(s.bottom, d.bottom, `${F} ${use} 아래 스크롤 여유 — 흐림 깊이`);
    return { axis: 'y', sides: d, pad, scroll: s };
  };
  fogCache = {
    mask,
    depth,
    uses: {
      box: { axis: 'y', sides: { top: depth, bottom: depth }, pad: { top: boxPad, bottom: boxPad }, scroll: { top: boxScroll, bottom: boxScroll } },
      row: { axis: 'x', sides: { left: rowDepth, right: rowDepth }, pad: { left: rowPad, right: rowPad }, scroll: { left: len(row['content.scrollPadding'], `${F} row scrollPadding`), right: len(row['content.scrollPadding'], `${F} row scrollPadding`) } },
      overlayBody: place('overlayBody'),
      page: place('page'),
    },
    defaultUse: must(spec.defaults?.use, `${F} defaults.use`) as FogUse,
  };
  return fogCache;
}
// 칩 줄 · Chip Tabs 목록의 "좌우 20px" 이 Scroll Fog row 의 깊이와 같은지 — 칩 그림(chip-look · tabs-look)이 부른다
export function rowFogDepth(raw: unknown, what: string) {
  const d = numIn(String(unbox(must(raw, what))), /좌우\s*(\d+)px/, what);
  if (!noteOf(raw).includes('gradient-fade-mask')) throw new Error(`${what} 비고에 gradient-fade-mask 가 없다`);
  same(d, scrollFogLook().uses.row.sides.left ?? 0, `${what} — Scroll Fog row 의 깊이`);
  return d;
}
// 시트 · 대화상자 본문의 끝 흐림(축 scrollFog=on) — 그 YAML 의 값이 Scroll Fog overlayBody 와 같은지(overlay-look 이 부른다)
export function overlayFog(component: 'dialog' | 'bottom-sheet') {
  const F = `${component}.yaml`;
  const spec = loadComponentSpec(component);
  sameSet(axisValues(spec, 'scrollFog'), ['off', 'on'], `${F} 의 scrollFog`);
  if (spec.defaults?.scrollFog !== 'off') throw new Error(`${F} defaults.scrollFog 가 off 가 아니다 — 그림의 기본값을 고친다`);
  const v = resolveState(spec, { scrollFog: 'on' }, 'enabled');
  if (String(unbox(v['fog.mask'])) !== '$gradient-fade-mask') throw new Error(`${F} fog.mask 가 gradient-fade-mask 가 아니다`);
  const d = topBottom(v['fog.size'], `${F} fog.size`);
  const s = topBottom(v['body.scrollPadding'], `${F} body.scrollPadding`);
  const padTop = len(v['body.paddingTop'], `${F} body.paddingTop`);
  const padBottom = len(v['body.paddingBottom'], `${F} body.paddingBottom`);
  const ob = scrollFogLook().uses.overlayBody;
  same(d.top, ob.sides.top ?? 0, `${F} 위 흐림 — Scroll Fog overlayBody`);
  same(d.bottom, ob.sides.bottom ?? 0, `${F} 아래 흐림 — Scroll Fog overlayBody`);
  same(padTop, ob.pad.top ?? 0, `${F} 본문 위 여백 — Scroll Fog overlayBody`);
  same(padBottom, ob.pad.bottom ?? 0, `${F} 본문 아래 여백 — Scroll Fog overlayBody`);
  same(s.top, d.top, `${F} 위 스크롤 여유`);
  same(s.bottom, d.bottom, `${F} 아래 스크롤 여유`);
  return { top: d.top, bottom: d.bottom, padTop, padBottom, scrollTop: s.top, scrollBottom: s.bottom, mask: scrollFogLook().mask };
}

// ── Content Placeholder ──────────────────────────────────
function placeholderLook(): PlaceholderLook {
  const F = 'content-placeholder.yaml';
  const spec = loadComponentSpec('content-placeholder');
  const v = resolveState(spec, {}, 'enabled');
  if (String(unbox(v['root.width'])) !== '100%' || String(unbox(v['root.height'])) !== '100%') throw new Error(`${F} root 가 틀을 채우지 않는다 — 그림을 고친다`);
  same(len(v['root.radius'], `${F} root.radius`), 0, `${F} root.radius`);
  return {
    bg: col(v['root.background'], 'desk', `${F} root.background`),
    glyph: {
      ratio: numIn(String(unbox(v['glyph.size'])), /(\d+)%/, `${F} glyph.size`) / 100,
      min: len(v['glyph.minWidth'], `${F} glyph.minWidth`),
      max: len(v['glyph.maxWidth'], `${F} glyph.maxWidth`),
      color: col(v['glyph.color'], 'desk', `${F} glyph.color`),
      stroke: Number(unbox(must(v['glyph.strokeWidth'], `${F} glyph.strokeWidth`))),
    },
  };
}

// ── 묶음 ─────────────────────────────────────────────────
const kits = new Map<Brand, LoadingKit>();
export function loadingKit(brand: Brand = 'desk'): LoadingKit {
  const hit = kits.get(brand);
  if (hit) return hit;
  const circle = circleLook(brand);
  const kit: LoadingKit = { skeleton: skeletonLook(), circle, pull: pullLook(circle), progress: progressLook(brand), fog: scrollFogLook(), placeholder: placeholderLook() };
  kits.set(brand, kit);
  return kit;
}
// 그림 속 화면의 역할 색
export function loadingScreen(brand: Brand = 'desk'): LdScreenBase {
  const out = Object.fromEntries(LD_TONES.map((n) => [n, named(n, brand)])) as LdScreenBase;
  out.dim = { name: 'overlay-dim', light: proseValue('overlay-dim-light'), dark: proseValue('overlay-dim-dark') };
  return out;
}
export const PLACEHOLDER_GLYPHS = CP_GLYPHS;

// 사이트 전체에 까는 움직임 — Progress Circle 의 회전 · 호 · 채움, Skeleton 의 반짝임(tokens-style 이 부른다).
// 키프레임의 시간 · 곡선 · 단계(75% · 33.33%)는 YAML 에서, 모션 줄이기면 멈춘다(돌지 않는 호 · 띠 없음)
export function loadingCss() {
  const { skeleton: sk, circle: pc, progress: pg } = loadingKit('desk');
  const m = pc.motion;
  const s = sk.motion.shimmer;
  return [
    `@keyframes groo-pc-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`,
    `@keyframes groo-pc-head{0%{stroke-dasharray:0 100}${m.head.until}%,100%{stroke-dasharray:100 100}}`,
    `@keyframes groo-pc-tail{0%,${m.tail.from}%{stroke-dashoffset:0}100%{stroke-dashoffset:-100}}`,
    `@keyframes groo-sk-shimmer{from{transform:translateX(${s.from}%)}to{transform:translateX(${s.to}%)}}`,
    `.ppc-start{transform:rotate(${pc.start}deg);transform-box:view-box;transform-origin:50% 50%}`,
    `.ppc-spin{transform-origin:50% 50%;animation:groo-pc-rotate ${m.rotate.duration} ${m.rotate.easing} infinite}`,
    `.ppc-arc{stroke-dasharray:0 100;animation:groo-pc-head ${m.head.duration} ${m.head.easing} infinite,groo-pc-tail ${m.tail.duration} ${m.tail.easing} infinite}`,
    `.ppc-fill{transition:stroke-dashoffset ${m.fill.duration} ${m.fill.easing}}`,
    `.ppc-spin[data-still]{animation:none}`,
    `.ppc-arc[data-still]{animation:none;stroke-dasharray:${pc.reducedArc} 100;stroke-dashoffset:0}`,
    `.ppc-fill[data-still]{transition:none}`,
    `.ppg-fill{transition:width ${pg.fill.motion.duration} ${pg.fill.motion.easing}}`,
    `.psk-band{transform:translateX(${s.from}%);animation:groo-sk-shimmer ${s.duration} ${s.easing} infinite}`,
    `.psk-band[data-still]{animation:none;opacity:0}`,
    `@media (prefers-reduced-motion:reduce){.ppc-spin{animation:none}.ppc-arc{animation:none;stroke-dasharray:${pc.reducedArc} 100;stroke-dashoffset:0}.ppc-fill{transition:none}.ppg-fill{transition:none}.psk-band{animation:none;opacity:0}}`,
  ].join('');
}
