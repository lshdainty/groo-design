// Select · Input Button 의 모양 — specs/components/select.yaml · input-button.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(select-view)은 이 값만 받아 그린다. 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 이름으로).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadComponentSpec, num, resolveState, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, proseValue, type Brand } from '@/lib/design-tokens';
import { SEL_SIZES, SEL_TONES, type SelBoxLook, type SelBoxSize, type SelColor, type SelGroupLabelSize, type SelItemSize, type SelMotion, type SelSize, type SelType, type SelectLook } from './select-shared';
export * from './select-shared';

type Spec = 'select' | 'input-button';

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`Select · Input Button YAML 에 ${what} 이 없다`);
  return v;
};
// '16px' · '0' → 수
const len = (raw: unknown, what: string) => {
  const v = tokenValue(must(raw, what));
  if (String(v) === '0') return 0;
  return must(num(v), what);
};
// 비고 · 값 글자 속 수 — 문장이 바뀌면 여기서 멈춘다(그림이 낡지 않게)
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`Select · Input Button YAML 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
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
function named(name: string, brand: Brand): SelColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): SelColor {
  const v = String(unbox(must(raw, what))).trim();
  if (v === 'transparent') return { light: 'transparent', dark: 'transparent' };
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`Select · Input Button YAML 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
// 그림자 토큰 — 라이트 · 다크(-dark) 값과 사이트 모드용 변수(--p-shadow-sN, tokens-style.tsx)
function shadow(raw: unknown, what: string): SelColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$(shadow-s\d)$/.exec(v);
  if (!m) throw new Error(`Select YAML 의 ${what} 이 그림자 토큰이 아니다(${v})`);
  return { name: m[1], light: proseValue(m[1]), dark: proseValue(`${m[1]}-dark`) };
}

function type(raw: unknown, what: string, weight?: unknown): SelType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`Select · Input Button YAML 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}
const lh = (t: SelType, what: string) => must(num(t.lineHeight), `${what} 줄 높이(px)`);

type MotionEntry = { duration: unknown; easing: unknown; note?: string };
function motionEntry(component: Spec, name: string): MotionEntry {
  const all = (loadComponentSpec(component) as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`${component}.yaml 의 motion 에 "${name}" 이 없다`);
  return m;
}
const motionOf = (component: Spec, name: string): SelMotion => {
  const m = motionEntry(component, name);
  return { duration: String(tokenValue(must(m.duration, `${name}.duration`))), easing: String(tokenValue(must(m.easing, `${name}.easing`))) };
};
const motionPair = (d: unknown, e: unknown, what: string): SelMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });

// 상자 — Select 의 트리거(trigger · chevron)와 Input Button(root · suffixIcon)이 같은 값을 쓴다
function boxLook(component: Spec, brand: Brand): SelBoxLook {
  const spec = loadComponentSpec(component);
  const isSel = component === 'select';
  const root = isSel ? 'trigger' : 'root';
  const end = isSel ? 'chevron' : 'suffixIcon';
  const sizes = {} as Record<SelSize, SelBoxSize>;
  for (const size of SEL_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const where = `${component} ${size}`;
    const text = type(v['value.typography'], `${where} value.typography`, v['value.fontWeight']);
    const ph = type(v['placeholder.typography'], `${where} placeholder.typography`, v['placeholder.fontWeight']);
    if (ph.fontSize !== text.fontSize || ph.lineHeight !== text.lineHeight) throw new Error(`${where} — placeholder 와 값의 글자가 다르다(그림은 한 글자로 그린다)`);
    sizes[size] = {
      h: len(v[`${root}.minHeight`], `${where} ${root}.minHeight`),
      radius: len(v[`${root}.radius`], `${where} ${root}.radius`),
      padX: len(v[`${root}.paddingX`], `${where} ${root}.paddingX`),
      gap: len(v[`${root}.gap`], `${where} ${root}.gap`),
      text,
      icon: len(v['prefixIcon.size'], `${where} prefixIcon.size`),
      end: len(v[`${end}.size`], `${where} ${end}.size`),
      clear: isSel ? 0 : len(v['clearButton.size'], `${where} clearButton.size`),
    };
  }
  const at = (state: string) => resolveState(spec, { size: 'large' }, state);
  const base = at('enabled');
  const pressed = at('pressed');
  const focused = at('focused');
  const invalid = at('invalid');
  const disabled = at('disabled');
  const readonly = at('readonly');
  const c = (raw: unknown, what: string) => tok(raw, brand, `${component} ${what}`);
  const fgDisabled = c(disabled['value.foreground'], 'disabled value.foreground');
  // 막힌 칸의 placeholder · 아이콘 · 붙이개는 값과 같은 색이다 — 갈리면 그림도 나눠야 한다
  for (const k of ['placeholder.foreground', 'prefixIcon.color', `${end}.color`, ...(isSel ? [] : ['prefixText.foreground', 'suffixText.foreground'])]) {
    if (c(disabled[k], `disabled ${k}`).light !== fgDisabled.light) throw new Error(`${component}.yaml 의 disabled ${k} 가 값의 색과 다르다 — select-view 를 나눠 그린다`);
  }
  if (c(readonly[`${root}.background`], 'readonly background').light !== c(disabled[`${root}.background`], 'disabled background').light) throw new Error(`${component}.yaml 의 readonly · disabled 바탕이 다르다 — select-view 를 나눠 그린다`);
  return {
    sizes,
    stroke: { base: len(base[`${root}.borderWidth`], `${component} ${root}.borderWidth`), invalid: len(invalid[`${root}.borderWidth`], `${component} invalid ${root}.borderWidth`) },
    ring: { width: len(focused['focusRing.width'], `${component} focusRing.width`), offset: len(focused['focusRing.offset'], `${component} focusRing.offset`), color: c(focused['focusRing.color'], 'focusRing.color') },
    color: {
      bg: c(base[`${root}.background`], `${root}.background`),
      border: c(base[`${root}.borderColor`], `${root}.borderColor`),
      pressed: c(pressed[`${root}.background`], `pressed ${root}.background`),
      invalid: c(invalid[`${root}.borderColor`], `invalid ${root}.borderColor`),
      bgDisabled: c(disabled[`${root}.background`], `disabled ${root}.background`),
      value: c(base['value.foreground'], 'value.foreground'),
      placeholder: c(base['placeholder.foreground'], 'placeholder.foreground'),
      icon: c(base['prefixIcon.color'], 'prefixIcon.color'),
      end: c(base[`${end}.color`], `${end}.color`),
      affix: isSel ? c(base['placeholder.foreground'], 'placeholder.foreground') : c(base['prefixText.foreground'], 'prefixText.foreground'),
      clear: isSel ? c(base['prefixIcon.color'], 'prefixIcon.color') : c(base['clearButton.color'], 'clearButton.color'),
      disabled: fgDisabled,
    },
    motion: {
      bg: motionPair(base[`${root}.transitionDuration`], base[`${root}.transitionEasing`], `${component} ${root}.transition`),
      scale: motionPair(pressed[`${root}.scaleDuration`], pressed[`${root}.scaleEasing`], `${component} pressed ${root}.scale`),
      invalid: motionOf(component, '오류 — 테두리'),
    },
  };
}

// 목록의 쌓임 — specs/z-index.md 의 L3(popover · select · menu) 줄이 정하고, 값은 그 줄의 토큰(DESIGN.md v116 z-floating)이 원본이다.
// select.yaml 의 content.zIndex 도 같은 값이어야 한다
function floatingZ(yamlZ: unknown) {
  const md = readFileSync(join(process.cwd(), '..', 'specs/z-index.md'), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith('| **L3') && /`select`/.test(l));
  if (!row) throw new Error('specs/z-index.md 에서 select 가 든 L3 줄을 찾지 못했다');
  // | Layer | 토큰 | z-index | 컴포넌트 | 의미 |
  const [, tokenCell = '', zCell = ''] = row.split('|').slice(1).map((c) => c.trim());
  const token = /`(z-[a-z-]+)`/.exec(tokenCell)?.[1];
  const z = /`(\d+)`/.exec(zCell)?.[1];
  if (!token || !z) throw new Error(`specs/z-index.md L3 줄에서 토큰 · 값을 찾지 못했다 — ${row}`);
  if (proseValue(token) !== z) throw new Error(`specs/z-index.md L3 의 ${z} 가 DESIGN.md ${token}(${proseValue(token)}) 와 다르다`);
  if (String(unbox(yamlZ)) !== z) throw new Error(`select.yaml content.zIndex(${String(unbox(yamlZ))})가 specs/z-index.md L3 ${token} ${z} 와 다르다`);
  return Number(z);
}

const cache = new Map<Brand, SelectLook>();

export function selectLook(brand: Brand = 'desk'): SelectLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const sel = loadComponentSpec('select');
  const ibSpec = loadComponentSpec('input-button');
  const breakpoint = len(resolveState(sel, { size: 'responsive' }, 'enabled')['trigger.breakpoint'], 'select trigger.breakpoint');
  const ibBreakpoint = len(resolveState(ibSpec, { size: 'responsive' }, 'enabled')['root.breakpoint'], 'input-button root.breakpoint');
  // global.css 의 .psel 은 1280 에서 medium 으로 바꾼다 — YAML 의 반응형 폭이 바뀌면 거기도 고친다
  if (breakpoint !== 1280 || ibBreakpoint !== 1280) throw new Error(`select · input-button.yaml 의 반응형 폭(${breakpoint} · ${ibBreakpoint})이 global.css 의 1280 과 다르다`);

  const c = (raw: unknown, what: string) => tok(raw, brand, `select ${what}`);
  const base = resolveState(sel, { size: 'large' }, 'enabled');
  const pressed = resolveState(sel, { size: 'large' }, 'pressed');
  const open = resolveState(sel, { size: 'large' }, 'open');
  const disabled = resolveState(sel, { size: 'large' }, 'disabled');

  // 목록 — 높이 상한은 "min(480px, 남은 화면)", 하한은 비고의 "200 보다 좁아도 200"
  const maxRaw = must(base['content.maxHeight'], 'content.maxHeight');
  const openMotion = motionEntry('select', '목록 — 열 때');

  const items = {} as Record<SelSize, SelItemSize>;
  const labels = {} as Record<SelSize, SelGroupLabelSize>;
  const descGap = len(base['itemDescription.gap'], 'itemDescription.gap');
  for (const size of SEL_SIZES) {
    const v = resolveState(sel, { size }, 'enabled');
    const where = `select ${size}`;
    const padY = len(v['item.paddingY'], `${where} item.paddingY`);
    const label = type(v['itemLabel.typography'], `${where} itemLabel.typography`, v['itemLabel.fontWeight']);
    const desc = type(v['itemDescription.typography'], `${where} itemDescription.typography`, v['itemDescription.fontWeight']);
    const height = padY * 2 + lh(label, `${where} itemLabel`);
    const heightDesc = height + descGap + lh(desc, `${where} itemDescription`);
    // YAML 의 높이(값 · 비고의 "설명이 있으면 N")는 여백 + 줄 높이와 같아야 한다 — 그림은 여백으로 그린다
    const yh = len(v['item.minHeight'], `${where} item.minHeight`);
    const yd = numIn(noteOf(v['item.minHeight']), /설명이 있으면\s*(\d+)/, `${where} item.minHeight 비고`);
    if (yh !== height || yd !== heightDesc) throw new Error(`${where} — 선택지 높이 ${yh} · ${yd} 가 여백 + 줄 높이(${height} · ${heightDesc})와 다르다`);
    items[size] = {
      padY,
      gap: len(v['item.gap'], `${where} item.gap`),
      height,
      heightDesc,
      icon: len(v['itemIcon.size'], `${where} itemIcon.size`),
      label,
      desc,
      indicator: len(v['indicator.size'], `${where} indicator.size`),
    };
    const gText = type(v['groupLabel.typography'], `${where} groupLabel.typography`, v['groupLabel.fontWeight']);
    const gPad = len(v['groupLabel.paddingY'], `${where} groupLabel.paddingY`);
    labels[size] = { padY: gPad, text: gText, height: gPad * 2 + lh(gText, `${where} groupLabel`) };
  }

  const trigger = boxLook('select', brand);
  const ib = boxLook('input-button', brand);
  const { distance, widthDivisor, minBasis } = pressScale();
  const content = {
    radius: len(base['content.radius'], 'content.radius'),
    padY: len(base['content.paddingY'], 'content.paddingY'),
    gap: len(base['content.gap'], 'content.gap'),
    gutter: len(base['content.marginTop'], 'content.marginTop'),
    edge: len(base['content.margin'], 'content.margin'),
    maxHeight: numIn(String(unbox(maxRaw)), /(\d+)px/, 'content.maxHeight'),
    minHeight: numIn(noteOf(maxRaw), /(\d+)\s*보다/, 'content.maxHeight 비고'),
    bg: c(base['content.background'], 'content.background'),
    shadow: shadow(base['content.shadow'], 'content.shadow'),
    motion: { open: motionOf('select', '목록 — 열 때'), close: motionOf('select', '목록 — 닫을 때'), from: numIn(String(openMotion.note ?? ''), /(0\.\d+)\s*→\s*1/, '목록 — 열 때 비고') },
    z: floatingZ(must(base['content.zIndex'], 'content.zIndex')),
  };

  const look: SelectLook = {
    breakpoint,
    trigger: {
      ...trigger,
      chevron: {
        rotate: numIn(String(unbox(must(open['chevron.rotate'], 'open chevron.rotate'))), /(\d+)deg/, 'open chevron.rotate'),
        open: motionOf('select', '셰브론 — 열 때'),
        close: motionOf('select', '셰브론 — 닫을 때'),
      },
    },
    content,
    item: {
      padX: len(base['item.paddingX'], 'item.paddingX'),
      descGap,
      sizes: items,
      color: {
        label: c(base['itemLabel.foreground'], 'itemLabel.foreground'),
        desc: c(base['itemDescription.foreground'], 'itemDescription.foreground'),
        icon: c(base['itemIcon.color'], 'itemIcon.color'),
        indicator: c(base['indicator.color'], 'indicator.color'),
        disabled: c(disabled['itemLabel.foreground'], 'disabled itemLabel.foreground'),
      },
      indicatorStroke: numIn(noteOf(base['indicator.color']), /선\s*([\d.]+)/, 'indicator.color 비고'),
    },
    highlight: {
      radius: len(base['highlight.radius'], 'highlight.radius'),
      insetX: len(pressed['highlight.insetX'], 'pressed highlight.insetX'),
      bg: c(pressed['highlight.background'], 'pressed highlight.background'),
      motion: motionOf('select', '선택지 — 알약'),
    },
    groupLabel: { padX: len(base['groupLabel.paddingX'], 'groupLabel.paddingX'), color: c(base['groupLabel.foreground'], 'groupLabel.foreground'), sizes: labels },
    divider: {
      color: c(base['divider.color'], 'divider.color'),
      height: len(base['divider.height'], 'divider.height'),
      marginX: len(base['divider.marginX'], 'divider.marginX'),
      marginBottom: len(base['divider.marginBottom'], 'divider.marginBottom'),
    },
    press: { distance, widthDivisor, minBasis },
    ib: { ...ib, breakpoint: ibBreakpoint },
    tone: Object.fromEntries(SEL_TONES.map((n) => [n, named(n, brand)])) as SelectLook['tone'],
  };
  cache.set(brand, look);
  return look;
}
