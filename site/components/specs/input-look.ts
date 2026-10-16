// 입력 묶음의 모양 — specs/components/slider · toggle · input-otp · color-swatch · icon-picker.yaml 과 아이콘 세트(category-icons.yaml)를
// 풀어 둔다(서버, 빌드 때). 그림(slider-view · toggle-view · swatch-view · icon-picker-view …)은 이 값만 받아 그린다 —
// 치수 · 색 · 글은 그림에 따로 적지 않는다. 비고의 수치(화살표 8 × 6 · 칸 아래 6 …)도 문장에서 읽고, 문장이 바뀌면 빌드가 멈춘다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { CHART_ORDER, color, contrast, design, pressScale, type Brand } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { CATEGORY_GLYPHS } from './category-glyphs';
import { textFieldLook } from './text-field-look';
import {
  SLIDER_STATES,
  SWATCH_STATES,
  TOGGLE_STATES,
  IP_STATES,
  type CategoryIcon,
  type CategoryIconSet,
  type IColor,
  type IMotion,
  type IPress,
  type IType,
  type IconPickerLook,
  type OtpLook,
  type SliderLook,
  type SwatchLook,
  type ToggleLook,
} from './input-shared';
export * from './input-shared';

type Raw = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');

function kit(F: string) {
  const must = <T,>(v: T | undefined, what: string): T => {
    if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${F} 에 ${what} 이 없다`);
    return v;
  };
  const len = (raw: unknown, what: string) => {
    const v = String(tokenValue(must(raw, what))).replace('−', '-');
    if (v === '0') return 0;
    return must(num(v), what);
  };
  const str = (raw: unknown, what: string) => String(unbox(must(raw, what))).trim();
  const re = (text: string, r: RegExp, what: string) => {
    const m = r.exec(text);
    if (!m) throw new Error(`${F} 의 ${what}(${text})에서 ${r} 를 찾지 못했다 — 문장이 바뀌면 그림도 같이 고친다`);
    return m;
  };
  const numIn = (text: string, r: RegExp, what: string) => Number(re(text, r, what)[1]);
  const quoted = (text: string, after: string, what: string) => re(text, new RegExp(`${after}\\s*"([^"]+)"`), what)[1];
  // 단위 없는 수(배율 · 불투명도 · 단계 수)
  const n = (raw: unknown, what: string) => {
    const v = Number(str(raw, what));
    if (!Number.isFinite(v)) throw new Error(`${F} 의 ${what}(${str(raw, what)})이 수가 아니다`);
    return v;
  };
  return { must, len, str, re, numIn, quoted, n };
}

// 사이트 모드를 따르는 그림의 CSS 변수 이름 — HR 에서 값이 다른 브랜드 토큰은 --p-hr-<이름>(tokens-style.tsx 와 같은 규칙)
function varName(name: string, brand: Brand) {
  if (brand !== 'hr') return name;
  const desk = design('desk').front.colors;
  const hr = design('hr').front.colors;
  if (!(name in desk) || !hr[name]) return name;
  const differs = hr[name] !== desk[name] || (hr[`${name}-dark`] ?? hr[name]) !== (desk[`${name}-dark`] ?? desk[name]);
  return differs ? `hr-${name}` : name;
}
export function named(name: string, brand: Brand = 'desk'): IColor {
  const c = design(brand).front.colors;
  const light = color(name, brand);
  const dark = name === 'static-white' || name === 'static-black' ? light : c[`${name}-dark`] ? color(`${name}-dark`, brand) : light;
  return { name: varName(name, brand), light, dark };
}
function tokOf(F: string) {
  return (raw: unknown, brand: Brand, what: string): IColor => {
    const v = String(unbox(raw ?? '')).trim();
    const m = /^\$color-([a-z0-9-]+)$/.exec(v);
    if (!m) throw new Error(`${F} 의 ${what} 이 색 토큰이 아니다(${v})`);
    return named(m[1], brand);
  };
}
function typeOf(F: string) {
  return (raw: unknown, weight: unknown, what: string): IType => {
    const t = tokenValue(unbox(raw) as string) as TypeValue | undefined;
    if (!t || typeof t !== 'object') throw new Error(`${F} 의 ${what} 글자 토큰을 풀지 못했다`);
    if (!t.lineHeight) throw new Error(`${F} 의 ${what} 줄 높이가 없다`);
    return { fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
  };
}
const motionOf = (F: string, d: unknown, e: unknown, what: string): IMotion => {
  if (d === undefined || e === undefined) throw new Error(`${F} 의 ${what} 시간 · 곡선이 없다`);
  return { duration: String(tokenValue(d)), easing: String(tokenValue(e)) };
};
function blocks(name: string) {
  return ((loadComponentSpec(name) as unknown as { motion?: Record<string, { duration: unknown; easing?: unknown; properties?: string[]; note?: string }> }).motion ?? {});
}
function blockOf(F: string, name: string, key: string) {
  const m = blocks(name)[key];
  if (!m) throw new Error(`${F} 의 motion 에 "${key}" 이 없다`);
  return m;
}
function sameSet(F: string, got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${F} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — input-shared.ts 를 고친다`);
}
// "2px 거리 축소" — Feedback 의 눌림 피드백 축소량과 같아야 한다
function pressOf(F: string, raw: unknown, d: unknown, e: unknown, what: string): IPress {
  const k = kit(F);
  const distance = k.numIn(k.str(raw, what), /(\d+)px 거리 축소/, what);
  const ps = pressScale();
  if (distance !== ps.distance) throw new Error(`${F} 의 ${what} ${distance}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
  return { distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis, motion: motionOf(F, d, e, `${what} 모션`) };
}
const square = (F: string, raw: unknown, what: string) => {
  const v = String(unbox(raw)).trim();
  const m = /^(\d+) × (\d+)$/.exec(v);
  if (!m || m[1] !== m[2]) throw new Error(`${F} 의 ${what}(${v})이 'N × N' 이 아니다`);
  return Number(m[1]);
};

// ── Slider ────────────────────────────────────────────────
const sliderCache = new Map<Brand, SliderLook>();
// 끌기 시작 — "150ms · 3px"(누르고 있는 시간 · 움직인 거리). 값 줄의 글 그대로
function dragStartOf(t: string) {
  const m = /^(\d+)ms\s*·\s*(\d+)px$/.exec(t.trim());
  if (!m) throw new Error(`slider.yaml control.dragStart(${t})가 "Nms · Npx" 가 아니다 — 그림을 고친다`);
  return { delay: Number(m[1]), distance: Number(m[2]) };
}
export function sliderLook(brand: Brand = 'desk'): SliderLook {
  const hit = sliderCache.get(brand);
  if (hit) return hit;
  const F = 'slider.yaml';
  const k = kit(F);
  const tok = tokOf(F);
  const type = typeOf(F);
  const spec = loadComponentSpec('slider');
  sameSet(F, stateNames(spec), SLIDER_STATES, 'states');
  sameSet(F, axisValues(spec, 'mode'), ['single', 'range'], 'mode');
  sameSet(F, axisValues(spec, 'ticks'), ['none', 'discrete'], 'ticks');
  const b = resolveState(spec, {}, 'enabled');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  const disc = resolveState(spec, { ticks: 'discrete' }, 'enabled');
  const thumb = k.len(b['thumb.size'], 'thumb.size');
  const inset = k.len(b['thumb.inset'], 'thumb.inset');
  if (inset !== thumb / 2) throw new Error(`${F} 의 thumb.inset(${inset})이 손잡이 반지름(${thumb / 2})과 다르다`);
  const [, tmin, tmax] = k.re(String((spec.variants.ticks as Record<string, string>).discrete), /(\d+) ~ (\d+) 구간/, 'ticks.discrete');
  const enter = blockOf(F, 'slider', '말풍선 — 나타남');
  const exit = blockOf(F, 'slider', '말풍선 — 사라짐');
  const jump = blockOf(F, 'slider', '손잡이 · 채움 — 건너뛰기');
  const press = blockOf(F, 'slider', '손잡이 — 누름');
  const look: SliderLook = {
    control: { height: k.len(b['control.height'], 'control.height'), touchAction: k.str(b['control.touchAction'], 'control.touchAction'), dragStart: dragStartOf(k.str(b['control.dragStart'], 'control.dragStart')) },
    gap: k.len(b['root.gap'], 'root.gap'),
    padTop: k.len(b['root.paddingTop'], 'root.paddingTop'),
    track: { height: k.len(b['track.height'], 'track.height'), bg: tok(b['track.background'], brand, 'track.background'), disabledBg: tok(di['track.background'], brand, 'disabled track.background') },
    fill: { bg: tok(b['fill.background'], brand, 'fill.background'), disabledBg: tok(di['fill.background'], brand, 'disabled fill.background') },
    tick: { width: k.len(b['tick.width'], 'tick.width'), bg: tok(disc['tick.background'], brand, 'discrete tick.background'), floatingBg: tok(disc['tick.backgroundOnFloating'], brand, 'discrete tick.backgroundOnFloating'), min: Number(tmin), max: Number(tmax) },
    thumb: { size: thumb, pressedSize: k.len(pr['thumb.size'], 'pressed thumb.size'), bg: tok(b['thumb.background'], brand, 'thumb.background'), disabledBg: tok(di['thumb.background'], brand, 'disabled thumb.background'), inset },
    indicator: {
      bg: tok(b['valueIndicator.background'], brand, 'valueIndicator.background'),
      fg: tok(b['valueIndicator.foreground'], brand, 'valueIndicator.foreground'),
      text: type(b['valueIndicator.typography'], b['valueIndicator.fontWeight'], 'valueIndicator.typography'),
      padX: k.len(b['valueIndicator.paddingX'], 'valueIndicator.paddingX'),
      padY: k.len(b['valueIndicator.paddingY'], 'valueIndicator.paddingY'),
      radius: k.len(b['valueIndicator.radius'], 'valueIndicator.radius'),
      minWidth: k.len(b['valueIndicator.minWidth'], 'valueIndicator.minWidth'),
      offsetY: k.len(b['valueIndicator.offsetY'], 'valueIndicator.offsetY'),
      arrowW: k.len(b['valueIndicator.arrowWidth'], 'valueIndicator.arrowWidth'),
      arrowH: k.len(b['valueIndicator.arrowHeight'], 'valueIndicator.arrowHeight'),
    },
    markers: { text: type(b['markers.typography'], undefined, 'markers.typography'), fg: tok(b['markers.foreground'], brand, 'markers.foreground'), disabledFg: tok(di['markers.foreground'], brand, 'disabled markers.foreground') },
    header: { text: type(b['headerValue.typography'], b['headerValue.fontWeight'], 'headerValue.typography'), fg: tok(b['headerValue.foreground'], brand, 'headerValue.foreground'), disabledFg: tok(di['headerValue.foreground'], brand, 'disabled headerValue.foreground') },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: tok(fo['focusRing.color'], brand, 'focusRing.color') },
    pageSteps: k.n(b['thumb.pageStep'], 'thumb.pageStep'),
    motion: {
      jump: motionOf(F, jump.duration, jump.easing, '건너뛰기'),
      press: motionOf(F, press.duration, press.easing, '누름'),
      enter: motionOf(F, enter.duration, enter.easing, '나타남'),
      exit: motionOf(F, exit.duration, exit.easing, '사라짐'),
      enterScale: k.n(b['valueIndicator.enterScale'], 'valueIndicator.enterScale'),
      enterOpacity: k.n(b['valueIndicator.enterOpacity'], 'valueIndicator.enterOpacity'),
      enterY: k.len(b['valueIndicator.enterOffsetY'], 'valueIndicator.enterOffsetY'),
      exitOpacity: k.n(b['valueIndicator.exitOpacity'], 'valueIndicator.exitOpacity'),
      exitY: k.len(b['valueIndicator.exitOffsetY'], 'valueIndicator.exitOffsetY'),
    },
    surface: { default: named('bg-layer-default', brand), floating: named('bg-layer-floating', brand) },
  };
  // 머리 ↔ 손잡이 줄 사이(말풍선 자리) — 손잡이(누르지 않은 크기 — 말풍선은 커진 손잡이를 따라 오르지 않는다) 위에 뜬 말풍선이
  // Field 머리를 덮지 않아야 한다(Field 간격 + 위 여백)
  const fieldGap = textFieldLook('desk').field.gap;
  const bubbleTop = look.control.height / 2 - look.thumb.size / 2 - look.indicator.offsetY - (parseFloat(look.indicator.text.lineHeight) + look.indicator.padY * 2);
  if (fieldGap + look.padTop + bubbleTop < 0) throw new Error(`${F} 의 root.paddingTop(${look.padTop})으로는 말풍선이 Field 머리를 덮는다(${fieldGap + look.padTop + bubbleTop})`);
  // 비고의 "좌우 여백 8 × 2 + 화살표 8" — 최소 폭
  if (look.indicator.minWidth !== look.indicator.padX * 2 + look.indicator.arrowW) throw new Error(`${F} 의 말풍선 최소 폭(${look.indicator.minWidth})이 여백 × 2 + 화살표와 다르다`);
  sliderCache.set(brand, look);
  return look;
}

// ── Toggle ────────────────────────────────────────────────
const toggleCache = new Map<Brand, ToggleLook>();
export function toggleLook(brand: Brand = 'desk'): ToggleLook {
  const hit = toggleCache.get(brand);
  if (hit) return hit;
  const F = 'toggle.yaml';
  const k = kit(F);
  const tok = tokOf(F);
  const spec = loadComponentSpec('toggle');
  sameSet(F, stateNames(spec), TOGGLE_STATES, 'states');
  sameSet(F, axisValues(spec, 'toggled'), ['off', 'on'], 'toggled');
  sameSet(F, axisValues(spec, 'tone'), ['default', 'inverted'], 'tone');
  const off = resolveState(spec, { toggled: 'off' }, 'enabled');
  const on = resolveState(spec, { toggled: 'on' }, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  const inv = resolveState(spec, { tone: 'inverted' }, 'enabled');
  const invHov = resolveState(spec, { tone: 'inverted' }, 'hovered');
  const invFo = resolveState(spec, { tone: 'inverted' }, 'focused');
  if (k.str(invHov['root.background'], 'inverted hovered root.background') !== 'transparent') throw new Error(`${F} 의 브랜드 채움 위 호버 바탕이 transparent 가 아니다 — 그림을 고친다`);
  const look: ToggleLook = {
    size: k.len(off['root.size'], 'root.size'),
    touch: square(F, off['root.touchTarget'], 'root.touchTarget'),
    radius: k.len(off['root.radius'], 'root.radius'),
    icon: k.len(off['icon.size'], 'icon.size'),
    stroke: { off: k.len(off['icon.strokeWidth'], 'off icon.strokeWidth'), on: k.len(on['icon.strokeWidth'], 'on icon.strokeWidth') },
    fg: { off: tok(off['icon.color'], brand, 'off icon.color'), on: tok(on['icon.color'], brand, 'on icon.color'), disabled: tok(di['icon.color'], brand, 'disabled icon.color'), inverted: tok(inv['icon.color'], brand, 'inverted icon.color') },
    hoverBg: tok(hov['root.background'], brand, 'hovered root.background'),
    pressBg: tok(pr['root.background'], brand, 'pressed root.background'),
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: tok(fo['focusRing.color'], brand, 'focusRing.color') },
    ringInverted: tok(invFo['focusRing.color'], brand, 'inverted focused focusRing.color'),
    press: pressOf(F, pr['root.scale'], pr['root.scaleDuration'], pr['root.scaleEasing'], 'pressed root.scale'),
    colorMotion: motionOf(F, off['root.transitionDuration'], off['root.transitionEasing'], 'root.transition'),
  };
  toggleCache.set(brand, look);
  return look;
}

// ── Input OTP ─────────────────────────────────────────────
let otpCache: OtpLook | undefined;
export function otpLook(): OtpLook {
  if (otpCache) return otpCache;
  const F = 'input-otp.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('input-otp');
  sameSet(F, stateNames(spec), ['enabled', 'focused', 'invalid', 'disabled'], 'states');
  sameSet(F, axisValues(spec, 'resend'), ['first', 'ready', 'cooldown'], 'resend');
  const b = resolveState(spec, {}, 'enabled');
  const inv = resolveState(spec, {}, 'invalid');
  const label = (r: 'first' | 'ready' | 'cooldown') => k.str(resolveState(spec, { resend: r }, 'enabled')['resend.label'], `${r} resend.label`);
  const size = (s: 'large' | 'medium') => {
    const v = resolveState(spec, { size: s }, 'enabled');
    return { height: k.len(v['field.minHeight'], `${s} field.minHeight`), radius: k.len(v['field.radius'], `${s} field.radius`), padX: k.len(v['field.paddingX'], `${s} field.paddingX`) };
  };
  const look: OtpLook = {
    length: k.numIn(k.str(b['value.filter'], 'value.filter'), /앞 (\d+)자리/, 'value.filter'),
    cooldown: k.numIn(k.str(b['resend.cooldown'], 'resend.cooldown'), /(\d+)초/, 'resend.cooldown'),
    placeholder: k.str(b['placeholder.content'], 'placeholder.content'),
    placeholderKeep: false,
    description: k.str(b['description.content'], 'description.content'),
    error: k.str(inv['description.content'], 'invalid description.content'),
    labels: { first: label('first'), ready: label('ready'), cooldown: label('cooldown') },
    resend: { marginTop: k.len(b['resend.marginTop'], 'resend.marginTop'), height: k.len(b['resend.height'], 'resend.height'), variant: k.str(b['resend.variant'], 'resend.variant'), size: 'medium' },
    sizes: { large: size('large'), medium: size('medium') },
    breakpoint: k.len(resolveState(spec, { size: 'responsive' }, 'enabled')['field.breakpoint'], 'responsive field.breakpoint'),
  };
  // 칸은 Input 그대로 — input.yaml 상자형과 같은지, 다시 받기는 Button 의 그 크기와 같은 높이인지
  const tf = textFieldLook('desk').input;
  for (const s of ['large', 'medium'] as const) {
    const i = tf.sizes.outline[s];
    if (i.minHeight !== look.sizes[s].height || i.radius !== look.sizes[s].radius || i.padX !== look.sizes[s].padX) throw new Error(`${F} 의 ${s} 칸(${JSON.stringify(look.sizes[s])})이 input.yaml 상자형과 다르다`);
  }
  if (tf.breakpoint !== look.breakpoint) throw new Error(`${F} 의 경계(${look.breakpoint})가 input.yaml(${tf.breakpoint})과 다르다`);
  // 막힌 칸의 자리 글 — 켜진 칸의 색(fg-placeholder)이면 그대로 두고, Input 의 막힘 색이면 Input 그대로. 그 밖의 색이면 그림을 고친다
  const phOff = k.str(resolveState(spec, {}, 'disabled')['placeholder.foreground'], 'disabled placeholder.foreground');
  if (phOff === `$color-${tf.color.placeholder.name}`) look.placeholderKeep = true;
  else if (phOff !== `$color-${tf.color.placeholderDisabled.name}`) throw new Error(`${F} 의 막힌 칸 자리 글(${phOff})이 input.yaml 의 자리 글 · 막힌 자리 글 어느 쪽도 아니다`);
  const h = buttonLook({ variant: look.resend.variant, size: look.resend.size }).faces.light.enabled.height;
  if (h !== look.resend.height) throw new Error(`${F} 의 다시 받기 높이(${look.resend.height})가 Button ${look.resend.variant} ${look.resend.size}(${h})와 다르다`);
  if (!look.labels.cooldown.includes('{n}')) throw new Error(`${F} 의 cooldown 글(${look.labels.cooldown})에 {n} 이 없다`);
  otpCache = look;
  return look;
}

// ── Color Swatch ──────────────────────────────────────────
const swatchCache = new Map<Brand, SwatchLook>();
// 칸 툴팁 — 값 "색 이름"(칸 이름과 같은 글)만 그린다
function tipOf(t: string) {
  if (t !== '색 이름') throw new Error(`color-swatch.yaml swatch.tooltip(${t})이 "색 이름" 이 아니다 — 그림을 고친다`);
  return true;
}
export function swatchLook(brand: Brand = 'desk'): SwatchLook {
  const hit = swatchCache.get(brand);
  if (hit) return hit;
  const F = 'color-swatch.yaml';
  const k = kit(F);
  const tok = tokOf(F);
  const type = typeOf(F);
  const spec = loadComponentSpec('color-swatch');
  sameSet(F, stateNames(spec), SWATCH_STATES, 'states');
  sameSet(F, axisValues(spec, 'selected'), ['unselected', 'selected'], 'selected');
  sameSet(F, axisValues(spec, 'current'), ['none', 'custom', 'auto'], 'current');
  const b = resolveState(spec, {}, 'enabled');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const selDis = resolveState(spec, { selected: 'selected' }, 'disabled');
  const custom = resolveState(spec, { current: 'custom' }, 'enabled');
  const auto = resolveState(spec, { current: 'auto' }, 'enabled');
  const names = spec.variants.color as Record<string, string>;
  const colors = axisValues(spec, 'color').map((key) => ({ key, name: names[key], color: tok(resolveState(spec, { color: key }, 'enabled')['swatch.background'], brand, `${key} swatch.background`) }));
  const assign = CHART_ORDER.filter((c) => c !== 'gray');
  sameSet(F, colors.map((c) => c.key).filter((c) => c !== 'gray'), assign, 'color(회색 빼고)');
  const hex = k.re(noteOf(custom['current.background']), /(#[0-9A-Fa-f]{6})/, 'custom current.background 비고')[1].toUpperCase();
  // 지금 색 위 체크 — 규칙의 두 토큰("fg-neutral · fg-neutral-inverted 가운데 대비가 큰 쪽") 가운데 그 색 위 대비가 큰 쪽(모드마다)
  const rule = k.str(custom['check.color'], 'custom check.color');
  const [, ta, tb] = k.re(rule, /^([a-z0-9-]+) · ([a-z0-9-]+) 가운데 대비가 큰 쪽$/, 'custom check.color');
  const ca = named(ta, brand);
  const cb = named(tb, brand);
  const pick = (m: 'light' | 'dark') => (contrast(ca[m], hex) >= contrast(cb[m], hex) ? ca[m] : cb[m]);
  const check = { light: pick('light'), dark: pick('dark') };
  const size = k.len(b['swatch.size'], 'swatch.size');
  const columns = Number(k.str(b['group.columns'], 'group.columns'));
  const gap = k.len(b['group.gap'], 'group.gap');
  const width = k.len(b['group.width'], 'group.width');
  if (width !== size * columns + gap * (columns - 1)) throw new Error(`${F} 의 group.width(${width})가 ${size} × ${columns} + ${gap} × ${columns - 1} 과 다르다`);
  if (colors.length % columns) throw new Error(`${F} 의 색 ${colors.length}개가 ${columns}열로 나뉘지 않는다`);
  const look: SwatchLook = {
    columns,
    gap,
    width,
    size,
    touch: square(F, b['swatch.touchTarget'], 'swatch.touchTarget'),
    colors,
    assign,
    check: { size: k.len(b['check.size'], 'check.size'), stroke: k.len(b['check.strokeWidth'], 'check.strokeWidth'), color: tok(b['check.color'], brand, 'check.color') },
    ring: { width: k.len(b['ring.outlineWidth'], 'ring.outlineWidth'), offset: k.len(b['ring.outlineOffset'], 'ring.outlineOffset'), color: tok(b['ring.outlineColor'], brand, 'ring.outlineColor'), disabledColor: tok(selDis['ring.outlineColor'], brand, 'selected disabled ring.outlineColor') },
    focus: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: tok(fo['focusRing.color'], brand, 'focusRing.color') },
    currentLabel: { text: type(b['currentLabel.typography'], undefined, 'currentLabel.typography'), fg: tok(b['currentLabel.foreground'], brand, 'currentLabel.foreground'), gap: k.len(b['currentLabel.marginTop'], 'currentLabel.marginTop') },
    divider: { width: k.len(b['divider.width'], 'divider.width'), color: tok(b['divider.color'], brand, 'divider.color'), gap: k.len(b['divider.gap'], 'divider.gap'), stackBelow: k.len(b['divider.stackBelow'], 'divider.stackBelow') },
    auto: { borderWidth: k.len(auto['current.borderWidth'], 'auto current.borderWidth'), borderColor: tok(auto['current.borderColor'], brand, 'auto current.borderColor') },
    custom: { hex, check: { light: check.light, dark: check.dark }, contrast: { light: contrast(check.light, hex), dark: contrast(check.dark, hex) } },
    press: pressOf(F, pr['swatch.scale'], pr['swatch.scaleDuration'], pr['swatch.scaleEasing'], 'pressed swatch.scale'),
    labelDisabled: named('fg-disabled', brand),
    names: { current: k.str(custom['current.name'], 'custom current.name'), auto: k.str(auto['current.name'], 'auto current.name') },
    tooltip: tipOf(k.str(b['swatch.tooltip'], 'swatch.tooltip')),
  };
  // 쌓는 경계 = 지금 색 칸 + 사이 + 선 + 사이 + 격자 — 이보다 좁으면 옆으로 둘 수 없다
  const side = size + look.divider.gap * 2 + look.divider.width + width;
  if (look.divider.stackBelow !== side) throw new Error(`${F} 의 divider.stackBelow(${look.divider.stackBelow})가 칸 ${size} + 사이 ${look.divider.gap} × 2 + 선 ${look.divider.width} + 격자 ${width} = ${side} 와 다르다`);
  // 고른 고리(띄움 + 두께) 바깥에 포커스 링 — 띄움이 고리 바깥이어야 한다
  if (look.focus.offset < look.ring.offset + look.ring.width) throw new Error(`${F} 의 포커스 링 띄움(${look.focus.offset})이 고른 고리(${look.ring.offset} + ${look.ring.width}) 안쪽이다`);
  if (k.len(custom['current.size'], 'custom current.size') !== size || k.len(auto['current.size'], 'auto current.size') !== size) throw new Error(`${F} 의 지금 색 칸 크기가 색 칸(${size})과 다르다`);
  swatchCache.set(brand, look);
  return look;
}

// ── Icon Picker ───────────────────────────────────────────
const ipCache = new Map<Brand, IconPickerLook>();
export function iconPickerLook(brand: Brand = 'desk'): IconPickerLook {
  const hit = ipCache.get(brand);
  if (hit) return hit;
  const F = 'icon-picker.yaml';
  const k = kit(F);
  const tok = tokOf(F);
  const type = typeOf(F);
  const spec = loadComponentSpec('icon-picker');
  sameSet(F, stateNames(spec), IP_STATES, 'states');
  sameSet(F, axisValues(spec, 'selected'), ['unselected', 'selected'], 'selected');
  sameSet(F, axisValues(spec, 'surface'), ['sheet', 'popover'], 'surface');
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const sel = resolveState(spec, { selected: 'selected' }, 'enabled');
  const sheet = resolveState(spec, { surface: 'sheet' }, 'enabled');
  const pop = resolveState(spec, { surface: 'popover' }, 'enabled');
  const searchNote = noteOf(b['search.variant']);
  const emptyNote = noteOf(b['empty.size']);
  const trig = noteOf(b['trigger.component']);
  // 스크롤 상자(묶음 머리 · 격자)의 끝 흐림 — 켬이면 Scroll Fog overlayBody(시트 · 팝오버 본문의 fog 값 — overlay-look 이 Scroll Fog 와 견준다)
  const fogOf = (v: Record<string, unknown>, what: string) => {
    const t = k.str(v['scroll.scrollFog'], what);
    if (t !== '켬' && t !== '끔') throw new Error(`${F} ${what}(${t})가 켬 · 끔이 아니다 — 그림을 고친다`);
    return t === '켬';
  };
  const look: IconPickerLook = {
    cell: { size: k.len(b['cell.size'], 'cell.size'), radius: k.len(b['cell.radius'], 'cell.radius'), hoverBg: tok(hov['cell.background'], brand, 'hovered cell.background'), pressBg: tok(pr['cell.background'], brand, 'pressed cell.background') },
    icon: { size: k.len(b['icon.size'], 'icon.size'), stroke: k.len(b['icon.strokeWidth'], 'icon.strokeWidth'), selectedStroke: k.len(sel['icon.strokeWidth'], 'selected icon.strokeWidth'), color: tok(b['icon.color'], brand, 'icon.color') },
    selected: { borderWidth: k.len(sel['cell.borderWidth'], 'selected cell.borderWidth'), borderColor: tok(sel['cell.borderColor'], brand, 'selected cell.borderColor') },
    grid: { minGap: k.len(b['grid.columnGapMin'], 'grid.columnGapMin'), rowGap: k.len(b['grid.rowGap'], 'grid.rowGap'), searchGap: k.len(b['grid.searchGap'], 'grid.searchGap') },
    surfaces: {
      sheet: { padX: k.len(sheet['surface.paddingX'], 'sheet surface.paddingX'), columns: Number(k.str(sheet['grid.columns'], 'sheet grid.columns')), fog: fogOf(sheet, 'sheet scroll.scrollFog') },
      popover: { padX: k.len(pop['surface.paddingX'], 'popover surface.paddingX'), columns: Number(k.str(pop['grid.columns'], 'popover grid.columns')), fog: fogOf(pop, 'popover scroll.scrollFog') },
    },
    header: { text: type(b['groupHeader.typography'], b['groupHeader.fontWeight'], 'groupHeader.typography'), fg: tok(b['groupHeader.foreground'], brand, 'groupHeader.foreground'), padTop: k.len(b['groupHeader.paddingTop'], 'groupHeader.paddingTop'), padBottom: k.len(b['groupHeader.paddingBottom'], 'groupHeader.paddingBottom') },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: tok(fo['focusRing.color'], brand, 'focusRing.color') },
    popoverWidth: k.len(pop['surface.width'], 'popover surface.width'),
    search: { placeholder: k.quoted(searchNote, 'placeholder', 'search.variant 비고'), ariaLabel: k.quoted(searchNote, '이름', 'search.variant 비고'), sheetH: k.len(sheet['search.height'], 'sheet search.height'), popoverH: k.len(pop['search.height'], 'popover search.height') },
    empty: { title: k.quoted(emptyNote, '제목', 'empty.size 비고'), description: k.quoted(emptyNote, '설명', 'empty.size 비고') },
    title: k.quoted(noteOf(sheet['surface.component']), '제목', 'sheet surface.component 비고'),
    press: pressOf(F, pr['cell.scale'], pr['cell.scaleDuration'], pr['cell.scaleEasing'], 'pressed cell.scale'),
    colorMotion: motionOf(F, blockOf(F, 'icon-picker', '호버 · 누름 — 바탕').duration, blockOf(F, 'icon-picker', '호버 · 누름 — 바탕').easing, '호버 · 누름'),
    trigger: { label: k.quoted(trig, '라벨', 'trigger.component 비고'), none: k.quoted(trig, '태그 \\+', 'trigger.component 비고'), outside: k.quoted(trig, '아이콘 \\+', 'trigger.component 비고') },
    breakpoint: textFieldLook('desk').input.breakpoint,
  };
  // 팝오버 폭 = 칸 × 열 + 사이 최소 × (열 − 1) + 좌우 여백 — 팝오버 열이 사이 최소로 딱 들어가야 한다
  const P = look.surfaces.popover;
  if (look.popoverWidth !== look.cell.size * P.columns + look.grid.minGap * (P.columns - 1) + P.padX * 2) throw new Error(`${F} 의 팝오버 폭(${look.popoverWidth})이 칸 ${look.cell.size} × ${P.columns} + 사이 ${look.grid.minGap} × ${P.columns - 1} + 좌우 ${P.padX} × 2 와 다르다`);
  // 열 수 — 칸 · 사이 최소로 들어가는 만큼이 규칙의 열(시트 6 · 팝오버 7)과 같아야 한다. 시트 본문은 폰 360 ~ 390 의 본문(좌우 여백을 뺀 폭) 모두
  const fit = (w: number) => Math.floor((w + look.grid.minGap) / (look.cell.size + look.grid.minGap));
  const S = look.surfaces.sheet;
  for (const phone of [360, 390]) if (fit(phone - S.padX * 2) !== S.columns) throw new Error(`${F} 의 시트 열(${S.columns})이 폰 ${phone} 본문 ${phone - S.padX * 2} 에 들어가는 열(${fit(phone - S.padX * 2)})과 다르다`);
  if (fit(look.popoverWidth - P.padX * 2) !== P.columns) throw new Error(`${F} 의 팝오버 열(${P.columns})이 본문 ${look.popoverWidth - P.padX * 2} 에 들어가는 열과 다르다`);
  // 찾기 칸 높이 — 시트는 Input 밑줄형 large, 팝오버는 medium
  const tf = textFieldLook('desk').input;
  if (tf.sizes.underline.large.minHeight !== look.search.sheetH || tf.sizes.underline.medium.minHeight !== look.search.popoverH) throw new Error(`${F} 의 찾기 칸 높이(${look.search.sheetH} · ${look.search.popoverH})가 input.yaml 밑줄형과 다르다`);
  ipCache.set(brand, look);
  return look;
}

// ── 아이콘 세트(category-icons.yaml) ──────────────────────
let setCache: CategoryIconSet | undefined;
export function categoryIconSet(): CategoryIconSet {
  if (setCache) return setCache;
  const F = 'category-icons.yaml';
  const doc = parseYaml(readFileSync(join(process.cwd(), '..', 'specs/components', F), 'utf8')) as { default?: string; groups?: string[]; entries?: CategoryIcon[] };
  if (!doc.default || !Array.isArray(doc.groups) || !Array.isArray(doc.entries)) throw new Error(`${F} 에 default · groups · entries 가 없다`);
  const ids = new Set<string>();
  const names = new Set<string>();
  const KEYS = ['id', 'group', 'name', 'aliases', 'lucideAliases'];
  for (const e of doc.entries) {
    const extra = Object.keys(e).filter((x) => !KEYS.includes(x));
    if (extra.length) throw new Error(`${F} 의 ${e.id} 에 모르는 키 ${extra.join(', ')}`);
    if (!e.id || !e.group || !e.name || !Array.isArray(e.aliases)) throw new Error(`${F} 의 줄 ${JSON.stringify(e)} 이 id · group · name · aliases 를 갖지 않았다`);
    if (!doc.groups.includes(e.group)) throw new Error(`${F} 의 ${e.id} 묶음 ${e.group} 이 groups 에 없다`);
    if (ids.has(e.id)) throw new Error(`${F} 의 id ${e.id} 가 겹친다`);
    if (names.has(e.name)) throw new Error(`${F} 의 이름 ${e.name} 이 겹친다`);
    ids.add(e.id);
    names.add(e.name);
    for (const id of [e.id, ...(e.lucideAliases ?? [])]) if (!CATEGORY_GLYPHS[id]) throw new Error(`${F} 의 ${id} 를 그릴 lucide 아이콘이 site/components/specs/category-glyphs.ts 에 없다 — 더한다`);
    e.aliases = e.aliases.map(String);
  }
  if (!ids.has(doc.default)) throw new Error(`${F} 의 default ${doc.default} 가 entries 에 없다`);
  // 묶음 차례대로 줄이 이어지는지(격자는 groups 차례 · 묶음 안은 표의 차례)
  const order = doc.entries.map((e) => doc.groups!.indexOf(e.group));
  if (order.some((g, i) => i > 0 && g < order[i - 1])) throw new Error(`${F} 의 줄이 groups 차례로 놓이지 않았다`);
  setCache = { default: doc.default, groups: doc.groups, entries: doc.entries };
  return setCache;
}
