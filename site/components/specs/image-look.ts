// 이미지 묶음의 모양 — specs/components/image-frame · card-art · logo-tile · aspect-ratio.yaml 과 기관 색 표(institution-colors.yaml)를
// 풀어 둔다(서버, 빌드 때). 그림(image-view)은 이 값만 받아 그린다 — 비율 · 모서리 · 윤곽 · 거리 · 글자 · 색을 그림에 따로 적지 않는다.
// 축 설명 · 비고 속 수(폭 경계 24 · 48, 카드 면 경계 96 · 240, 짧은 변 80, 10초, 면 높이의 40%)도 여기서 읽고, 서로 맞는지 확인한다 —
// 문장이 바뀌면 빌드가 멈춘다(그림이 낡지 않게). 기관 색 표는 글자색(text)이 대비와 맞는지까지 잰다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { axisDesc, axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, contrast, design, proseValue, type Brand } from '@/lib/design-tokens';
import { avatarLook } from './display-look';
import { loadingKit } from './loading-look';
import {
  CA_SIZES,
  IF_FITS,
  IF_RADII,
  IF_RATIOS,
  IF_STATES,
  LT_FACES,
  LT_IMAGES,
  LT_SIZES,
  cardArtSize,
  cardInitialSize,
  imageFrameRadius,
  type AspectRatioLook,
  type CardArtLook,
  type DColor,
  type IfFit,
  type IfRadius,
  type IfRatio,
  type ImageFrameLook,
  type Institution,
  type LogoTileLook,
  type LtFace,
  type LtImage,
  type LtSize,
  type RatioDef,
} from './image-shared';
export * from './image-shared';

type Vals = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
function must<T>(v: T | undefined, file: string, what: string): T {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${file} 에 ${what} 이 없다`);
  return v;
}
// '16px' · '0px' · '$spacing-x1_5' · '$radius-r1' → 수
function len(raw: unknown, file: string, what: string) {
  const v = String(tokenValue(must(raw, file, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), file, `${what}(수)`);
}
function numIn(text: string, re: RegExp, file: string, what: string) {
  const m = re.exec(text);
  if (!m) throw new Error(`${file} 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
}
function same(a: number, b: number, what: string) {
  if (Math.abs(a - b) > 1e-6) throw new Error(`${what} — ${a} 와 ${b} 가 다르다`);
}
function sameText(a: string, b: string, what: string) {
  if (a !== b) throw new Error(`${what} — "${a}" 와 "${b}" 가 다르다`);
}
// 축 · 상태가 그림과 같은지 — YAML 에 값이 늘거나 줄면 여기서 멈춘다(그림이 빠뜨리지 않게)
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — image-shared.ts 를 고친다`);
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
export function named(name: string, brand: Brand = 'desk'): DColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, file: string, what: string, brand: Brand = 'desk'): DColor {
  const v = String(unbox(must(raw, file, what))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${file} 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
const tokName = (raw: unknown) => /^\$color-([a-z0-9-]+)$/.exec(String(unbox(raw)).trim())?.[1];
function typeOf(raw: unknown, file: string, what: string) {
  const t = tokenValue(must(raw, file, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${file} 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: parseFloat(t.fontSize), lineHeight: parseFloat(must(t.lineHeight, file, `${what} 줄 높이`)), fontFamily: t.fontFamily ?? "'Pretendard Variable', Pretendard, sans-serif" };
}
// 기관 글자색 — 비고의 "white 면 static-white, dark 면 라이트 fg-neutral · 다크 fg-neutral-inverted" 에서 토큰 이름을 읽는다.
// dark 는 모드마다 다른 토큰이라 split 에 둘을 싣는다(사이트 모드를 따를 때 .pimg 가 고른다)
export type SplitColor = DColor & { split?: [string, string] };
function institutionText(note: string, file: string, what: string) {
  const m = /white 면 ([a-z0-9-]+), dark 면 라이트 ([a-z0-9-]+) · 다크 ([a-z0-9-]+)/.exec(note);
  if (!m) throw new Error(`${file} 의 ${what} 비고에서 기관 글자색(white 면 … · dark 면 라이트 … · 다크 …)을 찾지 못했다`);
  const white = named(m[1]);
  const dark: SplitColor = { light: color(m[2]), dark: design('desk').front.colors[`${m[3]}-dark`] ? color(`${m[3]}-dark`) : color(m[3]), split: [m[2], m[3]] };
  return { white, dark, names: [m[1], m[2], m[3]] as const };
}

// 비율 — 1 · 2 · "16 / 9" · 1.586
function ratioValue(raw: unknown, file: string, what: string) {
  const v = unbox(must(raw, file, what));
  if (typeof v === 'number') return { value: v, expr: String(v) };
  const s = String(v).trim();
  const m = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(s);
  if (m) return { value: Number(m[1]) / Number(m[2]), expr: s };
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error(`${file} 의 ${what}(${s})이 비율이 아니다`);
  return { value: n, expr: s };
}
function ratiosOf(spec: ReturnType<typeof loadComponentSpec>, state: string, file: string): Record<IfRatio, RatioDef> {
  sameSet(axisValues(spec, 'ratio'), IF_RATIOS, `${file} 의 ratio`);
  const out = {} as Record<IfRatio, RatioDef>;
  for (const r of IF_RATIOS) {
    const raw = resolveState(spec, { ratio: r }, state)['root.aspectRatio'];
    const { value, expr } = ratioValue(raw, file, `ratio ${r} root.aspectRatio`);
    // 이름이 a:b 면 값이 a ÷ b 인지
    const ab = /^(\d+):(\d+)$/.exec(r);
    if (ab) same(value, Number(ab[1]) / Number(ab[2]), `${file} ratio ${r} 의 값`);
    out[r] = { value, expr, note: noteOf(raw), desc: axisDesc(spec, 'ratio', r) ?? '' };
  }
  return out;
}

// ── Image Frame ───────────────────────────────────────────
let ifCache: ImageFrameLook | undefined;
export function imageFrameLook(): ImageFrameLook {
  if (ifCache) return ifCache;
  const F = 'image-frame.yaml';
  const spec = loadComponentSpec('image-frame');
  sameSet(axisValues(spec, 'radius'), IF_RADII, `${F} 의 radius`);
  sameSet(axisValues(spec, 'fit'), IF_FITS, `${F} 의 fit`);
  sameSet(stateNames(spec), IF_STATES, `${F} 의 states`);
  const ratios = ratiosOf(spec, 'loaded', F);
  const base = resolveState(spec, {}, 'loaded');
  const loading = resolveState(spec, {}, 'loading');
  const fallback = resolveState(spec, {}, 'fallback');
  // 모서리 — 값 이름과 px 가 같은지, 폭 경계는 축 설명에서("폭 24 이하" · "폭 25 ~ 48" · "폭 49 이상")
  const radius = {} as ImageFrameLook['radius'];
  for (const r of IF_RADII) {
    const raw = resolveState(spec, { radius: r }, 'loaded')['root.radius'];
    const px = len(raw, F, `radius ${r} root.radius`);
    same(px, Number(r), `${F} radius ${r} 의 값`);
    const v = String(unbox(raw));
    radius[r] = { px, token: v.startsWith('$') ? v.slice(1) : v, desc: axisDesc(spec, 'radius', r) ?? '' };
  }
  const r4 = numIn(radius['4'].desc, /폭\s*(\d+)\s*이하/, F, 'radius 4 설명');
  const r6from = numIn(radius['6'].desc, /폭\s*(\d+)\s*~/, F, 'radius 6 설명');
  const r6 = numIn(radius['6'].desc, /~\s*(\d+)/, F, 'radius 6 설명');
  const r8from = numIn(radius['8'].desc, /폭\s*(\d+)\s*이상/, F, 'radius 8 설명');
  same(r6from, r4 + 1, `${F} radius 6 의 시작 폭`);
  same(r8from, r6 + 1, `${F} radius 8 의 시작 폭`);
  if (!radius['0'].desc.includes('화면 폭')) throw new Error(`${F} radius 0 설명이 화면 폭이 아니다 — 그림의 bleed 를 고친다`);
  const bands = { r4, r6 };
  // 기본값 8 이 "부모 폭을 채움" 과 같은지(레시피 — width 가 없으면 8)
  if (imageFrameRadius(undefined, bands) !== must(spec.defaults?.radius, F, 'defaults.radius')) throw new Error(`${F} defaults.radius 가 부모 폭을 채우는 틀의 모서리와 다르다`);
  // 그림 위 자리 — "틀 가장자리 → 요소 바깥 상자 6" · "틀의 짧은 변이 80 이상일 때만" · "틀 하나에 둘까지"
  const offRaw = base['floater.offset'];
  const offset = len(offRaw, F, 'floater.offset');
  const minSide = numIn(noteOf(offRaw), /짧은 변이\s*(\d+)\s*이상/, F, 'floater.offset 비고');
  if (!/틀 하나에 둘까지/.test(noteOf(offRaw))) throw new Error(`${F} floater.offset 비고에 "틀 하나에 둘까지" 가 없다 — 그림의 최대 개수를 고친다`);
  // Indicator — 바탕은 두 모드 같은 prose 토큰(overlay-dim-dark)
  const bgRef = String(unbox(must(base['indicator.background'], F, 'indicator.background'))).trim();
  const bgName = /^\$(overlay-[a-z0-9-]+)$/.exec(bgRef)?.[1];
  if (!bgName) throw new Error(`${F} indicator.background(${bgRef})가 overlay 토큰이 아니다`);
  if (!/두 모드 같다/.test(noteOf(base['indicator.background']))) throw new Error(`${F} indicator.background 비고에 "두 모드 같다" 가 없다 — 그림의 바탕을 고친다`);
  const it = typeOf(base['indicator.typography'], F, 'indicator.typography');
  const padX = len(base['indicator.paddingX'], F, 'indicator.paddingX');
  const padY = len(base['indicator.paddingY'], F, 'indicator.paddingY');
  const minH = len(base['indicator.minHeight'], F, 'indicator.minHeight');
  same(minH, it.lineHeight + padY * 2, `${F} indicator.minHeight — 줄 높이 + 위아래 여백`);
  if (String(unbox(base['indicator.radius'])) !== '$radius-full') throw new Error(`${F} indicator.radius 가 full 이 아니다 — 그림은 알약으로 그린다`);
  // 불러오는 동안 · 없음 · 실패 — Skeleton · Content Placeholder 와 같은 값인지(그림은 그 둘의 그림을 그대로 쓴다)
  const kit = loadingKit('desk');
  const skBg = tokName(loading['skeleton.background']);
  if (skBg !== kit.skeleton.bg.name) throw new Error(`${F} loading skeleton.background(${skBg})가 skeleton.yaml 의 면(${kit.skeleton.bg.name})과 다르다`);
  const shimmer = loading['skeleton.shimmer'] as { value?: string; dark?: string } | undefined;
  if (String(shimmer?.value) !== '$gradient-shimmer-neutral' || String(shimmer?.dark) !== '$gradient-shimmer-neutral-dark') throw new Error(`${F} loading skeleton.shimmer 가 Skeleton 의 반짝임(gradient-shimmer-neutral · -dark)이 아니다`);
  if (Number(unbox(loading['image.opacity'])) !== 0) throw new Error(`${F} loading image.opacity 가 0 이 아니다 — 그림을 고친다`);
  const fbBg = tokName(fallback['fallback.background']);
  if (fbBg !== kit.placeholder.bg.name) throw new Error(`${F} fallback.background(${fbBg})가 content-placeholder.yaml 의 면과 다르다`);
  if (tokName(fallback['fallback.glyphColor']) !== kit.placeholder.glyph.color.name) throw new Error(`${F} fallback.glyphColor 가 content-placeholder.yaml 의 그림 색과 다르다`);
  same(numIn(String(unbox(fallback['fallback.glyphSize'])), /(\d+)%/, F, 'fallback.glyphSize') / 100, kit.placeholder.glyph.ratio, `${F} fallback.glyphSize — Content Placeholder 의 그림 비율`);
  const g = /(\d+)\s*~\s*(\d+)/.exec(noteOf(fallback['fallback.glyphSize']));
  if (!g) throw new Error(`${F} fallback.glyphSize 비고에서 "16 ~ 160" 을 찾지 못했다`);
  same(Number(g[1]), kit.placeholder.glyph.min, `${F} fallback.glyphSize 의 최소`);
  same(Number(g[2]), kit.placeholder.glyph.max, `${F} fallback.glyphSize 의 최대`);
  if (String(unbox(fallback['image.display'])) !== 'none') throw new Error(`${F} fallback image.display 가 none 이 아니다`);
  // 10초 — 상태 설명 "10초가 지나도 안 옴" 이 Skeleton 의 요청 제한과 같은지
  const timeout = numIn(String((spec.states as Record<string, string>).fallback ?? ''), /(\d+)초/, F, 'states.fallback') * 1000;
  same(timeout, kit.skeleton.region.timeout, `${F} 의 실패로 바꾸는 시간 — Skeleton 요청 제한`);
  // 그림이 옴 — motion
  const m = (spec as unknown as { motion?: Record<string, { duration: unknown; easing: unknown; properties?: string[] }> }).motion?.['그림이 옴'];
  if (!m) throw new Error(`${F} 의 motion 에 "그림이 옴" 이 없다`);
  if (!(m.properties ?? []).join(' ').includes('opacity 0 → 1')) throw new Error(`${F} motion "그림이 옴" 이 투명도 0 → 1 이 아니다`);
  const duration = String(tokenValue(m.duration));
  const easing = String(tokenValue(m.easing));
  // 돌리기 — card 의 image.rotate
  const rot = String(unbox(must(resolveState(spec, { ratio: 'card' }, 'loaded')['image.rotate'], F, 'card image.rotate')));
  const rotate = numIn(rot, /^(\d+)deg$/, F, 'card image.rotate');
  const contain = resolveState(spec, { fit: 'contain' }, 'loaded');
  if (String(unbox(contain['image.objectFit'])) !== 'contain' || String(unbox(base['image.objectFit'])) !== 'cover') throw new Error(`${F} fit 의 objectFit 이 cover · contain 이 아니다`);
  ifCache = {
    defaults: { ratio: must(spec.defaults?.ratio, F, 'defaults.ratio') as IfRatio, radius: spec.defaults?.radius as IfRadius, fit: must(spec.defaults?.fit, F, 'defaults.fit') as IfFit },
    ratios,
    radius,
    bands,
    stroke: { width: len(base['stroke.borderWidth'], F, 'stroke.borderWidth'), color: tok(base['stroke.borderColor'], F, 'stroke.borderColor') },
    plate: tok(contain['plate.background'], F, 'contain plate.background'),
    floater: { offset, minSide, max: 2 },
    indicator: { bg: proseValue(bgName), bgName, fg: tok(base['indicator.foreground'], F, 'indicator.foreground'), fontSize: it.fontSize, lineHeight: it.lineHeight, fontFamily: it.fontFamily, weight: Number(unbox(must(base['indicator.fontWeight'], F, 'indicator.fontWeight'))), padX, padY, minH },
    reveal: { duration, easing, ms: msOf(duration, `${F} 그림이 옴`) },
    timeout,
    rotate,
    sk: kit.skeleton,
    cp: kit.placeholder,
  };
  return ifCache;
}

// ── 카드 그림 ─────────────────────────────────────────────
let caCache: CardArtLook | undefined;
export function cardArtLook(): CardArtLook {
  if (caCache) return caCache;
  const F = 'card-art.yaml';
  const spec = loadComponentSpec('card-art');
  sameSet(axisValues(spec, 'size'), CA_SIZES, `${F} 의 size`);
  const base = resolveState(spec, {}, 'enabled');
  const ratio = ratioValue(base['root.aspectRatio'], F, 'root.aspectRatio').value;
  same(ratio, imageFrameLook().ratios.card.value, `${F} root.aspectRatio — Image Frame ratio card`);
  // 크기 경계 — "폭 96 미만" · "폭 96 ~ 239" · "폭 240 이상"
  const dSmall = axisDesc(spec, 'size', 'small') ?? '';
  const dMedium = axisDesc(spec, 'size', 'medium') ?? '';
  const dLarge = axisDesc(spec, 'size', 'large') ?? '';
  const medium = numIn(dSmall, /폭\s*(\d+)\s*미만/, F, 'size small 설명');
  same(numIn(dMedium, /폭\s*(\d+)\s*~/, F, 'size medium 설명'), medium, `${F} size medium 의 시작 폭`);
  const large = numIn(dLarge, /폭\s*(\d+)\s*이상/, F, 'size large 설명');
  same(numIn(dMedium, /~\s*(\d+)/, F, 'size medium 설명') + 1, large, `${F} size large 의 시작 폭`);
  const bands = { medium, large };
  // 첫 글자 — "면 높이의 40%" · "가장 작아도 10", 비고의 예(목록 56(높이 35.3) 14 …)가 식과 맞는지
  const small = resolveState(spec, { size: 'small' }, 'enabled');
  const ratioPct = numIn(String(unbox(small['initial.fontSize'])), /(\d+)%/, F, 'small initial.fontSize') / 100;
  const min = numIn(noteOf(small['initial.fontSize']), /가장 작아도\s*(\d+)/, F, 'small initial.fontSize 비고');
  const textNote = noteOf(base['face.foreground']);
  const text = institutionText(textNote, F, 'face.foreground');
  const look: CardArtLook = {
    ratio,
    bands,
    defaultSize: must(spec.defaults?.size, F, 'defaults.size') as CardArtLook['defaultSize'],
    initial: { ratio: ratioPct, min, weight: Number(unbox(must(base['initial.fontWeight'], F, 'initial.fontWeight'))), lineHeight: Number(unbox(must(base['initial.lineHeight'], F, 'initial.lineHeight'))) },
    issuerWeight: Number(unbox(must(base['issuer.fontWeight'], F, 'issuer.fontWeight'))),
    nameWeight: Number(unbox(must(base['name.fontWeight'], F, 'name.fontWeight'))),
    sizes: {} as CardArtLook['sizes'],
    text: { white: text.white, dark: text.dark },
  };
  for (const s of ['medium', 'large'] as const) {
    const v = resolveState(spec, { size: s }, 'enabled');
    const nameClamp = Number(unbox(must(v['name.lineClamp'], F, `${s} name.lineClamp`)));
    if (!Number.isInteger(nameClamp) || nameClamp < 1) throw new Error(`${F} ${s} name.lineClamp(${nameClamp})가 1 이상의 정수가 아니다`);
    look.sizes[s] = { padX: len(v['label.paddingX'], F, `${s} label.paddingX`), padBottom: len(v['label.paddingBottom'], F, `${s} label.paddingBottom`), issuer: typeOf(v['issuer.typography'], F, `${s} issuer.typography`), name: typeOf(v['name.typography'], F, `${s} name.typography`), nameClamp };
  }
  for (const [, w, h, s] of noteOf(small['initial.fontSize']).matchAll(/(\d+)\((\d+(?:\.\d+)?)\)\s*(\d+)/g)) {
    same(Math.round((Number(w) / ratio) * 10) / 10, Number(h), `${F} small 비고의 폭 ${w} 높이`);
    same(cardInitialSize(Number(w), look), Number(s), `${F} small 비고의 폭 ${w} 첫 글자`);
    if (cardArtSize(Number(w), bands) !== 'small') throw new Error(`${F} small 비고의 폭 ${w} 가 small 이 아니다`);
  }
  if (String(unbox(base['initial.textTransform'])) !== 'uppercase') throw new Error(`${F} initial.textTransform 이 uppercase 가 아니다`);
  // 글이 안 드는 면 — 첫 글자 면(label.fit, 2026-10-17 03-D 결정 3 A). 판단 식은 CardFaceView 의 fits 다
  if (String(unbox(base['label.fit'])) !== '안 들면 첫 글자 면') throw new Error(`${F} label.fit 이 "안 들면 첫 글자 면" 이 아니다 — CardFaceView 를 고친다`);
  caCache = look;
  return look;
}

// ── 기관 색 표 ────────────────────────────────────────────
let instCache: Institution[] | undefined;
export function institutions(): Institution[] {
  if (instCache) return instCache;
  const F = 'institution-colors.yaml';
  const doc = parseYaml(readFileSync(join(process.cwd(), '..', 'specs/components', F), 'utf8')) as { entries?: Institution[] };
  const rows = must(doc.entries, F, 'entries');
  // 글자색 — 흰 글자가 4.5 이상이면 white, 아니면 dark(라이트 fg-neutral · 다크 fg-neutral-inverted 로 잰다)
  const t = cardArtLook().text;
  const seen = new Map<string, string>();
  for (const e of rows) {
    if (!e.name || !/^#[0-9A-F]{6}$/.test(e.color) || !['white', 'dark'].includes(e.text)) throw new Error(`${F} 의 ${e.name ?? '?'} 줄이 name · color(#RRGGBB) · text(white · dark)를 갖지 않았다`);
    e.aliases = e.aliases ?? [];
    for (const k of [e.name, ...e.aliases]) {
      const key = k.replace(/\s+/g, '');
      if (seen.has(key)) throw new Error(`${F} 의 이름 ${k} 가 ${seen.get(key)} 와 겹친다`);
      seen.set(key, e.name);
    }
    const white = contrast(t.white.light, e.color);
    const want = white >= 4.5 ? 'white' : 'dark';
    if (e.text !== want) throw new Error(`${F} 의 ${e.name} — 흰 글자 ${white.toFixed(2)} 인데 text 가 ${e.text} 다`);
    if (e.text === 'dark' && Math.min(contrast(t.dark.light, e.color), contrast(t.dark.dark, e.color)) < 4.5) throw new Error(`${F} 의 ${e.name} — 짙은 글자도 4.5 에 못 미친다`);
  }
  instCache = rows;
  return rows;
}
// 표의 글자 대비 — white 면 하나, dark 면 라이트 · 다크
export type InstContrast = { kind: 'white'; white: number } | { kind: 'dark'; light: number; dark: number };
export function institutionContrast(e: Institution): InstContrast {
  const t = cardArtLook().text;
  return e.text === 'white' ? { kind: 'white', white: contrast(t.white.light, e.color) } : { kind: 'dark', light: contrast(t.dark.light, e.color), dark: contrast(t.dark.dark, e.color) };
}

// ── Logo Tile ─────────────────────────────────────────────
let ltCache: LogoTileLook | undefined;
export function logoTileLook(): LogoTileLook {
  if (ltCache) return ltCache;
  const F = 'logo-tile.yaml';
  const spec = loadComponentSpec('logo-tile');
  sameSet(axisValues(spec, 'size'), LT_SIZES, `${F} 의 size`);
  sameSet(axisValues(spec, 'face'), LT_FACES, `${F} 의 face`);
  sameSet(axisValues(spec, 'image'), LT_IMAGES, `${F} 의 image`);
  sameSet(stateNames(spec), ['enabled'], `${F} 의 states`);
  const base = resolveState(spec, {}, 'enabled');
  const sizes = {} as LogoTileLook['sizes'];
  for (const s of LT_SIZES) {
    const v = resolveState(spec, { size: s }, 'enabled');
    const size = len(v['root.size'], F, `${s} root.size`);
    same(size, Number(s), `${F} size ${s} 의 root.size`);
    const radius = len(v['root.radius'], F, `${s} root.radius`);
    // 모서리 = 크기 × 0.3(반올림) · 첫 글자 = 크기의 40%(반올림) — 비고 "32 × 0.3 = 9.6 → 10" · "크기의 40%(12.8)"
    same(radius, Math.round(size * 0.3), `${F} size ${s} 의 모서리 — 크기 × 0.3`);
    const font = len(v['initial.fontSize'], F, `${s} initial.fontSize`);
    same(font, Math.round(size * 0.4), `${F} size ${s} 의 첫 글자 — 크기의 40%`);
    const rt = String(unbox(v['root.radius']));
    sizes[s] = { size, radius, radiusToken: rt.startsWith('$') ? rt.slice(1) : rt, font };
  }
  if (String(unbox(base['initial.textTransform'])) !== 'uppercase') throw new Error(`${F} initial.textTransform 이 uppercase 가 아니다`);
  if (String(unbox(base['root.overflow'])) !== 'hidden') throw new Error(`${F} root.overflow 가 hidden 이 아니다`);
  const platePad = len(base['plate.padding'], F, 'plate.padding');
  const card = resolveState(spec, { image: 'card' }, 'enabled');
  const logo = resolveState(spec, { image: 'logo' }, 'enabled');
  const inst = resolveState(spec, { face: 'institution' }, 'enabled');
  const nm = resolveState(spec, { face: 'name' }, 'enabled');
  if (!/^chart-\{/.test(String(unbox(nm['root.background'])))) throw new Error(`${F} face name root.background 가 chart-{이름 색} 이 아니다`);
  if (!noteOf(nm['root.background']).includes('Avatar 와 같은 함수')) throw new Error(`${F} face name 의 이름 색이 Avatar 와 같은 함수가 아니다 — 그림의 이름 색을 고친다`);
  const av = avatarLook('desk');
  const text = institutionText(noteOf(inst['initial.foreground']), F, 'face institution initial.foreground');
  const ca = cardArtLook();
  for (const [a, b] of [text.white.light, text.dark.light, text.dark.dark].map((x, i) => [x, [ca.text.white.light, ca.text.dark.light, ca.text.dark.dark][i]])) sameText(a, b, `${F} 의 기관 글자색 — card-art.yaml 과 같아야 한다`);
  // 카드 그림 — 판 안(크기 − 8) · 1.586, 비고 "32 → 24 × 15 · 40 → 32 × 20 · 48 → 40 × 25" 가 식과 맞는지 · 모서리 "24 는 4, 32 · 40 은 6"
  const cardRatio = imageFrameLook().ratios.card.value;
  for (const [, s, w, h] of noteOf(card['image.objectFit']).matchAll(/(\d+)\s*→\s*(\d+)\s*×\s*(\d+)/g)) {
    same(Number(s) - platePad * 2, Number(w), `${F} card 비고의 ${s} 폭`);
    same(Math.round(Number(w) / cardRatio), Number(h), `${F} card 비고의 ${s} 높이`);
  }
  // "24 는 4, 32 · 40 은 6" — 폭 묶음마다 Image Frame 모서리와 같은지
  const rn = noteOf(card['image.radius']);
  const pairs = [...rn.matchAll(/(\d+(?:\s*·\s*\d+)*)\s*[은는]\s*(\d+)/g)];
  if (pairs.length < 2) throw new Error(`${F} card image.radius 비고에서 "폭 는 모서리" 를 찾지 못했다`);
  for (const [, ws, r] of pairs) for (const w of ws.split('·').map((x) => Number(x.trim()))) same(imageFrameLook().radius[imageFrameRadius(w, imageFrameLook().bands)].px, Number(r), `${F} card 그림 ${w} 의 모서리`);
  // 판 안의 카드 그림 폭(크기 − 판 여백 × 2)이 비고의 폭과 같은지
  for (const s of LT_SIZES) if (!pairs.some(([, ws]) => ws.split('·').map((x) => Number(x.trim())).includes(Number(s) - platePad * 2))) throw new Error(`${F} card image.radius 비고에 크기 ${s} 의 그림 폭(${Number(s) - platePad * 2})이 없다`);
  if (String(unbox(logo['image.objectFit'])) !== 'contain') throw new Error(`${F} logo image.objectFit 이 contain 이 아니다`);
  ltCache = {
    defaults: { size: must(spec.defaults?.size, F, 'defaults.size') as LtSize, face: must(spec.defaults?.face, F, 'defaults.face') as LtFace, image: must(spec.defaults?.image, F, 'defaults.image') as LtImage },
    sizes,
    initial: { weight: Number(unbox(must(base['initial.fontWeight'], F, 'initial.fontWeight'))), lineHeight: Number(unbox(must(base['initial.lineHeight'], F, 'initial.lineHeight'))) },
    platePad,
    plate: { card: tok(card['plate.background'], F, 'card plate.background'), logo: tok(logo['plate.background'], F, 'logo plate.background') },
    stroke: { width: len(base['stroke.borderWidth'], F, 'stroke.borderWidth'), color: tok(base['stroke.borderColor'], F, 'stroke.borderColor') },
    order: av.order,
    hues: { ...av.hues, gray: named('chart-gray') },
    nameFg: tok(nm['initial.foreground'], F, 'face name initial.foreground'),
    text: { white: text.white, dark: text.dark },
    cardRatio,
  };
  // Image Frame · Avatar 와 같은 윤곽인지
  if (ltCache.stroke.color.name !== imageFrameLook().stroke.color.name || ltCache.stroke.width !== imageFrameLook().stroke.width) throw new Error(`${F} 의 윤곽이 Image Frame 과 다르다`);
  if (av.border.color.name !== imageFrameLook().stroke.color.name) throw new Error('avatar.yaml 의 테두리가 Image Frame 의 윤곽과 다르다(v118)');
  return ltCache;
}

// ── Aspect Ratio ──────────────────────────────────────────
let arCache: AspectRatioLook | undefined;
export function aspectRatioLook(): AspectRatioLook {
  if (arCache) return arCache;
  const F = 'aspect-ratio.yaml';
  const spec = loadComponentSpec('aspect-ratio');
  sameSet(stateNames(spec), ['enabled'], `${F} 의 states`);
  const ratios = ratiosOf(spec, 'enabled', F);
  const ifr = imageFrameLook().ratios;
  for (const r of IF_RATIOS) same(ratios[r].value, ifr[r].value, `${F} ratio ${r} — Image Frame 과 같은 비율`);
  const base: Vals = resolveState(spec, {}, 'enabled');
  same(len(base['root.radius'], F, 'root.radius'), 0, `${F} root.radius`);
  if (String(unbox(base['root.background'])) !== 'transparent') throw new Error(`${F} root.background 가 transparent 가 아니다`);
  if (String(unbox(base['child.objectFit'])) !== 'cover') throw new Error(`${F} child.objectFit 이 cover 가 아니다`);
  arCache = { defaults: { ratio: must(spec.defaults?.ratio, F, 'defaults.ratio') as IfRatio }, ratios };
  return arCache;
}

// ── 그림 속 화면의 역할 색 ───────────────────────────────
export const IMAGE_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-disabled',
  'fg-brand',
  'fg-critical',
  'fg-positive',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-neutral-weak',
  'bg-brand-solid',
  'bg-neutral-inverted',
  'fg-neutral-inverted',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-neutral-overlay',
  'static-white',
] as const;
export type ImageTone = (typeof IMAGE_TONES)[number];
export const imageTones = (brand: Brand = 'desk') => Object.fromEntries(IMAGE_TONES.map((n) => [n, named(n, brand)])) as Record<ImageTone, DColor>;
