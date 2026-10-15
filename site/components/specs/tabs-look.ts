// Tabs 의 모양 — specs/components/tabs.yaml(Line) · chip-tabs.yaml(Chip Tabs)을 풀어 둔다(서버, 빌드 때).
// 그림(tabs-view)은 이 값만 받아 그린다 — 탭의 높이 · 여백 · 막대 · 알림 점 · 색은 그림에 따로 적지 않는다.
// Chip Tabs 의 칩 하나는 chip.yaml 그대로라 chipLook 을 함께 넘긴다(칩 그림과 같은 ChipView 로 그린다).
// 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 --p-<토큰> 변수로).
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, type Brand } from '@/lib/design-tokens';
import { CHIP_SIZES, CHIP_VARIANTS, chipLook, type ChipSize, type ChipVariant } from './chip-look';
import { rowFogDepth, scrollFogLook } from './loading-look';
import {
  CHIP_TABS_SIZES,
  CHIP_TABS_VARIANTS,
  TABS_LAYOUTS,
  TABS_SELECTED,
  TABS_SIZES,
  TABS_STATES,
  TABS_TONES,
  type ChipTabsLook,
  type TabsColor,
  type TabsFace,
  type TabsLook,
  type TabsMotion,
  type TabsType,
} from './tabs-shared';
export * from './tabs-shared';

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string, file = 'tabs.yaml'): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${file} 에 ${what} 이 없다`);
  return v;
};
// '16px' · '0px' · '$spacing-x4' → 수
const len = (raw: unknown, what: string, file = 'tabs.yaml') => {
  const v = String(tokenValue(must(raw, what, file))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what, file);
};
const numIn = (text: string, re: RegExp, what: string, file = 'tabs.yaml') => {
  const m = re.exec(text);
  if (!m) throw new Error(`${file} 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};

// 사이트 모드를 따르는 그림의 CSS 변수 이름 — HR 에서 값이 다른 브랜드 토큰은 --p-hr-<이름>(tokens-style.tsx 와 같은 규칙)
function varName(name: string, brand: Brand) {
  if (brand !== 'hr') return name;
  const desk = design('desk').front.colors;
  const hr = design('hr').front.colors;
  if (!(name in desk) || !hr[name]) return name;
  const differs = hr[name] !== desk[name] || (hr[`${name}-dark`] ?? hr[name]) !== (desk[`${name}-dark`] ?? desk[name]);
  return differs ? `hr-${name}` : name;
}
function named(name: string, brand: Brand): TabsColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string, file = 'tabs.yaml'): TabsColor {
  const v = String(unbox(must(raw, what, file))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${file} 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
const sameColor = (a: TabsColor, b: TabsColor) => a.light === b.light && a.dark === b.dark;
function type(raw: unknown, weight: unknown, what: string): TabsType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`tabs.yaml 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}
const motionPair = (d: unknown, e: unknown, what: string, file = 'tabs.yaml'): TabsMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`, file))), easing: String(tokenValue(must(e, `${what} 곡선`, file))) });

// 축 · 상태가 그림과 같은지 — YAML 에 폭 · 크기 · 상태가 늘거나 줄면 여기서 멈춘다(그림이 빠뜨리지 않게)
function sameSet(got: string[], want: readonly string[], what: string, file = 'tabs.yaml') {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${file} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — tabs-shared.ts 를 고친다`);
}

const cache = new Map<Brand, TabsLook>();

export function tabsLook(brand: Brand = 'desk'): TabsLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('tabs');
  sameSet(axisValues(spec, 'layout'), TABS_LAYOUTS, 'layout');
  sameSet(axisValues(spec, 'size'), TABS_SIZES, 'size');
  sameSet(axisValues(spec, 'selected'), TABS_SELECTED, 'selected');
  sameSet(stateNames(spec), TABS_STATES, 'states');

  const base = resolveState(spec, {}, 'enabled');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');

  // 크기 — 목록 · 탭의 최소 높이(둘이 같아야 한다 — 목록 높이가 곧 누르는 높이) · 글자
  const sizes = {} as TabsLook['sizes'];
  for (const size of TABS_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const h = len(v['trigger.minHeight'], `${size} trigger.minHeight`);
    if (len(v['list.minHeight'], `${size} list.minHeight`) !== h) throw new Error(`tabs.yaml ${size} — 목록 높이와 탭 높이가 다르다(그림은 하나로 그린다)`);
    sizes[size] = { h, text: type(v['label.typography'], v['label.fontWeight'], `${size} label.typography`) };
  }

  // 폭 — 목록 좌우 · 넘칠 때 · 스크롤 여유 · 탭 늘어남 · 막대 들임
  const layouts = {} as TabsLook['layouts'];
  for (const layout of TABS_LAYOUTS) {
    const v = resolveState(spec, { layout }, 'enabled');
    const overflow = v['list.overflowX'] === undefined ? 'visible' : String(unbox(v['list.overflowX']));
    if (overflow !== 'visible' && overflow !== 'auto') throw new Error(`tabs.yaml ${layout} list.overflowX(${overflow})를 그림이 모른다`);
    layouts[layout] = {
      padX: len(v['list.paddingX'], `${layout} list.paddingX`),
      grow: Number(unbox(must(v['trigger.grow'], `${layout} trigger.grow`))),
      inset: len(v['indicator.insetX'], `${layout} indicator.insetX`),
      overflowX: overflow,
      scrollPadding: v['list.scrollPadding'] === undefined ? 0 : len(v['list.scrollPadding'], `${layout} list.scrollPadding`),
    };
  }

  // 고름 × 상태의 모습 — 글자색 · 커서 · 누름 · 링. 막대는 고른 탭에만 있다 — 고른 탭의 상태마다 색(막히면 fg-disabled)
  const indicatorColors = Object.fromEntries(TABS_STATES.map((st) => [st, tok(resolveState(spec, { selected: 'selected' }, st)['indicator.background'], brand, `selected · ${st} indicator.background`)])) as TabsLook['indicator']['colors'];
  // 안 고른 탭에는 막대가 없다 — 안 고름 규칙에 막대 색이 따로 생기면 그림이 모르는 값이다
  for (const st of TABS_STATES) {
    const un = tok(resolveState(spec, { selected: 'unselected' }, st)['indicator.background'], brand, `unselected · ${st} indicator.background`);
    if (!sameColor(un, tok(base['indicator.background'], brand, 'indicator.background'))) throw new Error(`tabs.yaml unselected · ${st} — 안 고른 탭에 막대 색이 있다(그림은 고른 탭에만 막대를 그린다)`);
  }
  const faces = {} as TabsLook['faces'];
  for (const selected of TABS_SELECTED) {
    faces[selected] = {} as TabsLook['faces']['selected'];
    for (const st of TABS_STATES) {
      const r = resolveState(spec, { selected }, st);
      const where = `${selected} · ${st}`;
      const face: TabsFace = {
        fg: tok(r['label.foreground'], brand, `${where} label.foreground`),
        cursor: String(unbox(must(r['trigger.cursor'], `${where} trigger.cursor`))),
        scale: st === 'pressed' && r['trigger.scale'] !== undefined,
        ring: st === 'focused' && r['focusRing.width'] !== undefined,
      };
      faces[selected][st] = face;
    }
  }

  // 누름 축소 — YAML 의 "2px 거리" 가 Motion 의 눌림 피드백 축소량과 같은지(그림은 기초 값으로 셈한다)
  const ps = pressScale();
  const scaleRaw = must(pressed['trigger.scale'], 'pressed trigger.scale');
  const yamlDistance = numIn(String(unbox(scaleRaw)), /(\d+)px/, 'pressed trigger.scale');
  if (yamlDistance !== ps.distance) throw new Error(`tabs.yaml 의 누름 축소 ${yamlDistance}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
  const noteDivisor = numIn(noteOf(scaleRaw), /폭\s*÷\s*(\d+)/, 'pressed trigger.scale 비고');
  const noteMin = numIn(noteOf(scaleRaw), /,\s*(\d+)\)/, 'pressed trigger.scale 비고');
  if (noteDivisor !== ps.widthDivisor || noteMin !== ps.minBasis) throw new Error(`tabs.yaml 의 축소 기준(폭 ÷ ${noteDivisor}, ${noteMin})이 Motion 눌림 피드백(÷ ${ps.widthDivisor}, ${ps.minBasis})과 다르다`);

  // 모션 — 규칙의 값과 motion 블록이 같은지
  const slide = motionPair(base['indicator.transitionDuration'], base['indicator.transitionEasing'], 'indicator.transition');
  const scale = motionPair(pressed['trigger.scaleDuration'], pressed['trigger.scaleEasing'], 'pressed trigger.scale');
  const blocks = (spec as unknown as { motion?: Record<string, { duration: unknown; easing: unknown; properties?: string[] }> }).motion ?? {};
  const blockOf = (name: string) => {
    const m = blocks[name];
    if (!m) throw new Error(`tabs.yaml 의 motion 에 "${name}" 이 없다`);
    return { ...motionPair(m.duration, m.easing, name), properties: m.properties ?? [] };
  };
  const ms = blockOf('막대 — 미끄러짐');
  const mp = blockOf('누름 — 탭');
  if (ms.duration !== slide.duration || ms.easing !== slide.easing || mp.duration !== scale.duration || mp.easing !== scale.easing) throw new Error('tabs.yaml 의 motion 블록과 규칙의 전환 값이 다르다');
  const props = String(unbox(must(base['indicator.transitionProperty'], 'indicator.transitionProperty')))
    .split(',')
    .map((p) => p.trim());
  if (props.join() !== ms.properties.join()) throw new Error(`tabs.yaml 의 막대 전환 속성(${props.join(', ')})이 motion 블록(${ms.properties.join(', ')})과 다르다`);

  const align = String(unbox(must(base['trigger.alignItems'], 'trigger.alignItems')));
  const look: TabsLook = {
    defaults: { layout: must(spec.defaults?.layout, 'defaults.layout') as TabsLook['defaults']['layout'], size: must(spec.defaults?.size, 'defaults.size') as TabsLook['defaults']['size'] },
    list: { bg: tok(base['list.background'], brand, 'list.background'), line: tok(base['list.borderBottomColor'], brand, 'list.borderBottomColor'), lineWidth: len(base['list.borderBottomWidth'], 'list.borderBottomWidth') },
    trigger: { padX: len(base['trigger.paddingX'], 'trigger.paddingX'), padY: len(base['trigger.paddingY'], 'trigger.paddingY'), align },
    sizes,
    faces,
    indicator: { h: len(base['indicator.height'], 'indicator.height'), colors: indicatorColors, radius: len(base['indicator.radius'], 'indicator.radius'), props, motion: slide },
    layouts,
    notification: {
      size: len(base['notification.size'], 'notification.size'),
      radius: len(base['notification.radius'], 'notification.radius'),
      color: tok(base['notification.background'], brand, 'notification.background'),
      gap: len(base['notification.gap'], 'notification.gap'),
    },
    ring: { width: len(focused['focusRing.width'], 'focusRing.width'), offset: len(focused['focusRing.offset'], 'focusRing.offset'), color: tok(focused['focusRing.color'], brand, 'focusRing.color') },
    press: { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis, motion: scale },
    gutter: len('$spacing-global-gutter', 'spacing-global-gutter'),
    tone: Object.fromEntries(TABS_TONES.map((n) => [n, named(n, brand)])) as TabsLook['tone'],
  };
  cache.set(brand, look);
  return look;
}

const chipCache = new Map<Brand, ChipTabsLook>();

// Chip Tabs — 목록 · 알림 점은 chip-tabs.yaml, 칩 하나는 chip.yaml(chipLook) 그대로
export function chipTabsLook(brand: Brand = 'desk'): ChipTabsLook {
  const hit = chipCache.get(brand);
  if (hit) return hit;
  const F = 'chip-tabs.yaml';
  const spec = loadComponentSpec('chip-tabs');
  sameSet(axisValues(spec, 'variant'), CHIP_TABS_VARIANTS, 'variant', F);
  sameSet(axisValues(spec, 'size'), CHIP_TABS_SIZES, 'size', F);
  const chip = chipLook(brand === 'hr' ? 'hr' : 'desk');
  const base = resolveState(spec, {}, 'enabled');

  // 변형 — "chip.yaml variant=<이름>"(비고)을 Chip 의 변형으로
  const variants = {} as ChipTabsLook['variants'];
  for (const variant of CHIP_TABS_VARIANTS) {
    const raw = must(resolveState(spec, { variant }, 'enabled')['trigger.chip'], `${variant} trigger.chip`, F);
    const m = /variant=([a-zA-Z]+)/.exec(noteOf(raw));
    if (!m || !(CHIP_VARIANTS as readonly string[]).includes(m[1])) throw new Error(`${F} ${variant} 의 trigger.chip 비고에서 Chip 변형을 찾지 못했다(${noteOf(raw)})`);
    variants[variant] = m[1] as ChipVariant;
  }
  // 크기 — "chip.yaml size=<크기>"(비고)를 Chip 의 크기로. 높이 · 좌우 · 글은 chip.yaml 이 원본이다(Q-010-2)
  const sizes = {} as ChipTabsLook['sizes'];
  for (const size of CHIP_TABS_SIZES) {
    const raw = must(resolveState(spec, { size }, 'enabled')['trigger.chipSize'], `${size} trigger.chipSize`, F);
    const m = /size=([a-z]+)/.exec(noteOf(raw));
    if (!m || !(CHIP_SIZES as readonly string[]).includes(m[1])) throw new Error(`${F} ${size} 의 trigger.chipSize 비고에서 Chip 크기를 찾지 못했다(${noteOf(raw)})`);
    if (String(unbox(raw)) !== `Chip ${m[1]}`) throw new Error(`${F} ${size} 의 trigger.chipSize 값(${String(unbox(raw))})과 비고(size=${m[1]})가 다르다`);
    sizes[size] = m[1] as ChipSize;
  }
  const overflow = String(unbox(must(base['list.overflowX'], 'list.overflowX', F)));
  if (overflow !== 'auto') throw new Error(`${F} list.overflowX(${overflow})를 그림이 모른다`);
  const look: ChipTabsLook = {
    defaults: { variant: must(spec.defaults?.variant, 'defaults.variant', F) as ChipTabsLook['defaults']['variant'], size: must(spec.defaults?.size, 'defaults.size', F) as ChipTabsLook['defaults']['size'] },
    padX: len(base['list.paddingX'], 'list.paddingX', F),
    padY: len(base['list.paddingY'], 'list.paddingY', F),
    gap: len(base['list.gap'], 'list.gap', F),
    overflowX: 'auto',
    scrollPadding: len(base['list.scrollPadding'], 'list.scrollPadding', F),
    fog: rowFogDepth(base['list.fog'], `${F} list.fog`),
    mask: scrollFogLook().mask,
    shrink: Number(unbox(must(base['trigger.shrink'], 'trigger.shrink', F))),
    variants,
    sizes,
    notification: {
      size: len(base['notification.size'], 'notification.size', F),
      radius: len(base['notification.radius'], 'notification.radius', F),
      color: tok(base['notification.background'], brand, 'notification.background', F),
      gap: len(base['notification.gap'], 'notification.gap', F),
    },
    chip,
  };
  if (look.padX < look.fog) throw new Error(`${F} list.paddingX(${look.padX})가 흐림(${look.fog})보다 좁다 — 처음 · 끝 칩이 흐려진다`);
  // 칩은 줄지 않는다 — 그림의 칩(ChipView)은 flex: none 이다
  if (look.shrink !== 0) throw new Error(`${F} trigger.shrink(${look.shrink})가 0 이 아니다 — 칩 그림(flex: none)을 고친다`);
  // 칩 줄 위아래 — 칩의 누르는 영역 · 바깥 포커스 링이 잘리지 않아야 한다(스크롤 칸은 넘친 것을 자른다)
  const smallest = Math.min(...Object.values(sizes).map((s) => chip.sizes[s].h));
  if (look.padY < (chip.touch.h - smallest) / 2 || look.padY < chip.ring.width + chip.ring.offset) throw new Error(`${F} list.paddingY ${look.padY} 가 칩의 누르는 영역 · 포커스 링보다 작다`);
  chipCache.set(brand, look);
  return look;
}
