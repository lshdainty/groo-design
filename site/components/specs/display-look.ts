// 표시 묶음의 모양 — specs/components/badge · notification-badge · tag-group · avatar · avatar-stack · divider.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(display-view)은 이 값만 받아 그린다 — 높이 · 여백 · 모서리 · 글자 · 색은 그림에 따로 적지 않는다.
// 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 --p-<토큰> 변수로).
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { CHART_ORDER, color, design, type Brand } from '@/lib/design-tokens';
import {
  AVATAR_SIZES,
  BADGE_SIZES,
  BADGE_TONES,
  BADGE_VARIANTS,
  DISPLAY_TONES,
  NOTIF_ATTACHES,
  NOTIF_SIZES,
  TAG_SIZES,
  TAG_TONES,
  TAG_WEIGHTS,
  type AvatarLook,
  type AvatarSize,
  type BadgeFace,
  type BadgeLook,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  type DColor,
  type DType,
  type DisplayTone,
  type DividerLook,
  type NotifAttach,
  type NotifLook,
  type NotifSize,
  type StackLook,
  type TagLook,
  type TagSize,
  type TagTone,
  type TagWeight,
} from './display-shared';
export * from './display-shared';

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
function must<T>(v: T | undefined, file: string, what: string): T {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${file} 에 ${what} 이 없다`);
  return v;
}
// '16px' · '0px' · '-5px' · '$spacing-x3' → 수
function len(raw: unknown, file: string, what: string) {
  const v = String(tokenValue(must(raw, file, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), file, `${what}(수)`);
}
const numIn = (text: string, re: RegExp, file: string, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`${file} 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
// 축 · 상태가 그림과 같은지 — YAML 에 변형 · 크기가 늘거나 줄면 여기서 멈춘다(그림이 빠뜨리지 않게)
function sameSet(got: string[], want: readonly string[], file: string, what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${file} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — display-shared.ts 를 고친다`);
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
function named(name: string, brand: Brand): DColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, file: string, what: string): DColor {
  const v = String(unbox(must(raw, file, what))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${file} 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
function text(raw: unknown, file: string, what: string): Omit<DType, 'fontWeight'> {
  const t = tokenValue(must(raw, file, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${file} 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, file, `${what} 줄 높이`), fontFamily: t.fontFamily ?? 'inherit' };
}
const weightOf = (raw: unknown, file: string, what: string) => must(num(`${unbox(must(raw, file, what))}px`), file, what);

const brandCache = <T,>(fn: (b: Brand) => T) => {
  const cache = new Map<Brand, T>();
  return (brand: Brand = 'desk') => {
    const hit = cache.get(brand);
    if (hit) return hit;
    const v = fn(brand);
    cache.set(brand, v);
    return v;
  };
};

// ── Badge ─────────────────────────────────────────────────
export const badgeLook = brandCache((brand): BadgeLook => {
  const F = 'badge.yaml';
  const spec = loadComponentSpec('badge');
  sameSet(axisValues(spec, 'variant'), BADGE_VARIANTS, F, 'variant');
  sameSet(axisValues(spec, 'tone'), BADGE_TONES, F, 'tone');
  sameSet(axisValues(spec, 'size'), BADGE_SIZES, F, 'size');
  sameSet(stateNames(spec), ['enabled'], F, 'states');
  const base = resolveState(spec, {}, 'enabled');
  const sizes = {} as BadgeLook['sizes'];
  for (const size of BADGE_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    sizes[size] = {
      minH: len(v['root.minHeight'], F, `${size} root.minHeight`),
      padX: len(v['root.paddingX'], F, `${size} root.paddingX`),
      padY: len(v['root.paddingY'], F, `${size} root.paddingY`),
      radius: len(v['root.radius'], F, `${size} root.radius`),
      icon: len(v['prefixIcon.size'], F, `${size} prefixIcon.size`),
      text: text(v['label.typography'], F, `${size} label.typography`),
    };
  }
  const faces = {} as BadgeLook['faces'];
  for (const variant of BADGE_VARIANTS) {
    faces[variant] = {} as Record<BadgeTone, BadgeFace>;
    for (const tone of BADGE_TONES) {
      const r = resolveState(spec, { variant, tone }, 'enabled');
      const w = `${variant} · ${tone}`;
      const bw = r['root.borderWidth'] === undefined ? 0 : len(r['root.borderWidth'], F, `${w} root.borderWidth`);
      const bgRaw = String(unbox(r['root.background'] ?? '')).trim();
      faces[variant][tone] = {
        bg: bgRaw === 'transparent' ? null : tok(r['root.background'], brand, F, `${w} root.background`),
        fg: tok(r['root.foreground'], brand, F, `${w} root.foreground`),
        border: bw > 0 ? { color: tok(r['root.borderColor'], brand, F, `${w} root.borderColor`), width: bw } : null,
        weight: weightOf(r['label.fontWeight'], F, `${w} label.fontWeight`),
      };
      if (variant === 'outline' && !faces[variant][tone].border) throw new Error(`${F} ${w} — outline 인데 테두리가 없다`);
    }
  }
  return {
    defaults: {
      variant: must(spec.defaults?.variant, F, 'defaults.variant') as BadgeVariant,
      tone: must(spec.defaults?.tone, F, 'defaults.tone') as BadgeTone,
      size: must(spec.defaults?.size, F, 'defaults.size') as BadgeSize,
    },
    sizes,
    faces,
    gap: len(base['root.gap'], F, 'root.gap'),
    groupGap: len(base['group.gap'], F, 'group.gap'),
    cursor: String(unbox(must(base['root.cursor'], F, 'root.cursor'))),
  };
});

// ── Notification Badge ────────────────────────────────────
export const notifLook = brandCache((brand): NotifLook => {
  const F = 'notification-badge.yaml';
  const spec = loadComponentSpec('notification-badge');
  sameSet(axisValues(spec, 'size'), NOTIF_SIZES, F, 'size');
  sameSet(axisValues(spec, 'attach'), NOTIF_ATTACHES, F, 'attach');
  const small = resolveState(spec, { size: 'small', attach: 'icon' }, 'enabled');
  const large = resolveState(spec, { size: 'large', attach: 'icon' }, 'enabled');
  const txt = resolveState(spec, { size: 'small', attach: 'text' }, 'enabled');
  if (String(unbox(small['root.radius'])) !== '$radius-full') throw new Error(`${F} root.radius 가 full 이 아니다 — 그림은 원 · 알약으로 그린다`);
  // 숫자 알약의 자리 — "왼쪽 아래 꼭짓점 = (아이콘 폭 − 8, 14)"
  const pos = String(unbox(must(large['root.position'], F, 'large · icon root.position')));
  const fromRight = numIn(pos, /아이콘 폭\s*[−-]\s*(\d+)/, F, 'large · icon root.position');
  const bottom = numIn(pos, /,\s*(\d+)\)/, F, 'large · icon root.position');
  const h = len(large['root.minHeight'], F, 'large root.minHeight');
  // 비고의 "24 아이콘이면 (16, 14) — left 16 · top −4" 가 식과 맞는지
  const note = noteOf(large['root.position']);
  if (numIn(note, /left\s*(\d+)/, F, 'large · icon 비고') !== 24 - fromRight || numIn(note, /top\s*[−-](\d+)/, F, 'large · icon 비고') !== h - bottom) throw new Error(`${F} large · icon 의 비고 좌표가 식과 다르다`);
  const t = text(large['label.typography'], F, 'large label.typography');
  return {
    defaults: { size: must(spec.defaults?.size, F, 'defaults.size') as NotifSize, attach: must(spec.defaults?.attach, F, 'defaults.attach') as NotifAttach },
    dot: {
      size: len(small['root.size'], F, 'small root.size'),
      color: tok(small['root.background'], brand, F, 'small root.background'),
      top: len(small['root.top'], F, 'small · icon root.top'),
      right: len(small['root.right'], F, 'small · icon root.right'),
    },
    count: {
      minW: len(large['root.minWidth'], F, 'large root.minWidth'),
      h,
      padX: len(large['root.paddingX'], F, 'large root.paddingX'),
      bg: tok(large['root.background'], brand, F, 'large root.background'),
      fg: tok(large['label.foreground'], brand, F, 'large label.foreground'),
      text: { ...t, fontWeight: weightOf(large['label.fontWeight'], F, 'label.fontWeight') },
      numerals: String(unbox(must(large['label.numerals'], F, 'large label.numerals'))),
      fromRight,
      bottom,
    },
    textGap: len(txt['root.gap'], F, 'text root.gap'),
  };
});

// ── Tag Group ─────────────────────────────────────────────
export const tagLook = brandCache((brand): TagLook => {
  const F = 'tag-group.yaml';
  const spec = loadComponentSpec('tag-group');
  sameSet(axisValues(spec, 'size'), TAG_SIZES, F, 'size');
  sameSet(axisValues(spec, 'tone'), TAG_TONES, F, 'tone');
  sameSet(axisValues(spec, 'weight'), TAG_WEIGHTS, F, 'weight');
  sameSet(axisValues(spec, 'overflow'), ['wrap', 'truncate'], F, 'overflow');
  const base = resolveState(spec, {}, 'enabled');
  const sizes = {} as TagLook['sizes'];
  for (const size of TAG_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const item = text(v['item.typography'], F, `${size} item.typography`);
    const sep = text(v['separator.typography'], F, `${size} separator.typography`);
    if (item.fontSize !== sep.fontSize || item.lineHeight !== sep.lineHeight) throw new Error(`${F} ${size} — 구분 글자가 항목 글자와 다르다(그림은 한 글자로 그린다)`);
    sizes[size] = { text: item, icon: len(v['icon.size'], F, `${size} icon.size`) };
  }
  const tones = {} as TagLook['tones'];
  for (const tone of TAG_TONES) tones[tone] = tok(resolveState(spec, { tone }, 'enabled')['item.foreground'], brand, F, `${tone} item.foreground`);
  const weights = {} as TagLook['weights'];
  for (const weight of TAG_WEIGHTS) weights[weight] = weightOf(resolveState(spec, { weight }, 'enabled')['item.fontWeight'], F, `${weight} item.fontWeight`);
  const tr = resolveState(spec, { overflow: 'truncate' }, 'enabled');
  // 글 칸 최소 폭은 em(글자 크기를 따른다) — "2.1em" 꼴이 아니면 멈춘다
  const emOf = (raw: unknown, file: string, what: string) => {
    const v = String(unbox(must(raw, file, what)));
    if (!/^\d+(\.\d+)?em$/.test(v)) throw new Error(`${file} ${what}(${v})가 em 이 아니다`);
    return v;
  };
  if (len(tr['separator.shrink'] ?? '0px', F, 'truncate separator.shrink') !== 0) throw new Error(`${F} truncate 의 separator.shrink 가 0 이 아니다`);
  const glyph = String(unbox(must(base['separator.glyph'], F, 'separator.glyph')));
  if (!glyph.startsWith(' ')) throw new Error(`${F} separator.glyph 의 앞 공백이 줄이 안 바뀌는 공백(U+00A0)이 아니다`);
  return {
    defaults: {
      size: must(spec.defaults?.size, F, 'defaults.size') as TagSize,
      tone: must(spec.defaults?.tone, F, 'defaults.tone') as TagTone,
      weight: must(spec.defaults?.weight, F, 'defaults.weight') as TagWeight,
    },
    sizes,
    tones,
    weights,
    itemGap: len(base['item.gap'], F, 'item.gap'),
    sep: { glyph, color: tok(base['separator.foreground'], brand, F, 'separator.foreground'), weight: weightOf(base['separator.fontWeight'], F, 'separator.fontWeight') },
    srSep: String(unbox(must(base['srSeparator.glyph'], F, 'srSeparator.glyph'))),
    shrink: Number(unbox(must(tr['item.shrink'], F, 'truncate item.shrink'))),
    labelMin: emOf(tr['label.minWidth'], F, 'truncate label.minWidth'),
  };
});

// ── Avatar · Avatar Stack ─────────────────────────────────
export const avatarLook = brandCache((brand): AvatarLook => {
  const F = 'avatar.yaml';
  const spec = loadComponentSpec('avatar');
  sameSet(axisValues(spec, 'size'), AVATAR_SIZES, F, 'size');
  const base = resolveState(spec, {}, 'enabled');
  const sizes = {} as AvatarLook['sizes'];
  for (const size of AVATAR_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const d = len(v['root.size'], F, `${size} root.size`);
    if (d !== Number(size)) throw new Error(`${F} size ${size} 의 root.size(${d})가 이름과 다르다`);
    sizes[size] = { d, font: len(v['initial.fontSize'], F, `${size} initial.fontSize`) };
  }
  // 이름 색 순서 — 비고의 "v110 순서 blue · green · …" 가 차트 색 순서(CHART_ORDER)와 같은지
  const bgNote = noteOf(base['initial.background']);
  const order = /순서\s*([a-z ·]+)\)/.exec(bgNote)?.[1].split('·').map((s) => s.trim()).filter(Boolean) ?? [];
  if (order.join(',') !== CHART_ORDER.join(',')) throw new Error(`${F} initial.background 비고의 색 순서(${order.join(', ')})가 차트 색 순서와 다르다`);
  if (!/^chart-\{/.test(String(unbox(base['initial.background'])))) throw new Error(`${F} initial.background 가 chart-{이름 색} 이 아니다`);
  const hues: Record<string, DColor> = {};
  for (const h of order) hues[h] = named(`chart-${h}`, brand);
  if (String(unbox(base['initial.textTransform'])) !== 'uppercase') throw new Error(`${F} initial.textTransform 이 uppercase 가 아니다`);
  return {
    defaultSize: must(spec.defaults?.size, F, 'defaults.size') as AvatarSize,
    sizes,
    order,
    hues,
    initial: { fg: tok(base['initial.foreground'], brand, F, 'initial.foreground'), weight: weightOf(base['initial.fontWeight'], F, 'initial.fontWeight'), lineHeight: Number(unbox(base['initial.lineHeight'])) },
    border: { width: len(base['border.borderWidth'], F, 'border.borderWidth'), color: tok(base['border.borderColor'], brand, F, 'border.borderColor') },
  };
});

export const stackLook = brandCache((brand): StackLook => {
  const F = 'avatar-stack.yaml';
  const spec = loadComponentSpec('avatar-stack');
  sameSet(axisValues(spec, 'size'), AVATAR_SIZES, F, 'size');
  const base = resolveState(spec, {}, 'enabled');
  const sizes = {} as StackLook['sizes'];
  for (const size of AVATAR_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const d = len(v['item.size'], F, `${size} item.size`);
    if (d !== Number(size) || len(v['overflow.size'], F, `${size} overflow.size`) !== d) throw new Error(`${F} size ${size} 의 item · overflow 크기가 다르다`);
    const ring = len(v['item.outlineWidth'], F, `${size} item.outlineWidth`);
    if (len(v['overflow.outlineWidth'], F, `${size} overflow.outlineWidth`) !== ring) throw new Error(`${F} size ${size} 의 "+N" 링이 아바타 링과 다르다`);
    sizes[size] = { overlap: -len(v['root.gap'], F, `${size} root.gap`), ring, plusFont: len(v['overflow.fontSize'], F, `${size} overflow.fontSize`) };
    if (sizes[size].overlap <= 0) throw new Error(`${F} size ${size} 의 root.gap 이 음수(겹침)가 아니다`);
  }
  // 링 색 = 놓인 바탕(surface 축) — "+N" 원도 같은 링이어야 한다
  sameSet(axisValues(spec, 'surface'), ['default', 'floating'], F, 'surface');
  const ringOf = (surface: 'default' | 'floating') => {
    const v = resolveState(spec, { surface }, 'enabled');
    if (String(unbox(v['item.outlineColor'])) !== String(unbox(v['overflow.outlineColor']))) throw new Error(`${F} surface ${surface} 의 "+N" 링 색이 아바타 링과 다르다`);
    return tok(v['item.outlineColor'], brand, F, `surface ${surface} item.outlineColor`);
  };
  // 넘침 — 폭에 맞춰 보이는 사람 수를 줄인다(그림은 stackFit 으로 센다 — 규칙 문장이 바뀌면 여기서 멈춘다)
  if (!String(unbox(must(base['root.overflow'], F, 'root.overflow'))).startsWith('폭에 맞춰')) throw new Error(`${F} root.overflow 가 "폭에 맞춰 …" 가 아니다 — stackFit 을 같이 고친다`);
  return {
    defaultSize: must(spec.defaults?.size, F, 'defaults.size') as AvatarSize,
    max: Number(unbox(must(base['root.items'], F, 'root.items'))),
    sizes,
    ring: { default: ringOf('default'), floating: ringOf('floating') },
    plus: { bg: tok(base['overflow.background'], brand, F, 'overflow.background'), fg: tok(base['overflow.foreground'], brand, F, 'overflow.foreground'), weight: weightOf(base['overflow.fontWeight'], F, 'overflow.fontWeight') },
  };
});

// ── Divider ───────────────────────────────────────────────
export const dividerLook = brandCache((brand): DividerLook => {
  const F = 'divider.yaml';
  const spec = loadComponentSpec('divider');
  sameSet(axisValues(spec, 'orientation'), ['horizontal', 'vertical'], F, 'orientation');
  sameSet(axisValues(spec, 'inset'), ['full', 'inset'], F, 'inset');
  const base = resolveState(spec, {}, 'enabled');
  const h = resolveState(spec, { orientation: 'horizontal', inset: 'inset' }, 'enabled');
  const v = resolveState(spec, { orientation: 'vertical', inset: 'inset' }, 'enabled');
  const inset = len(h['root.marginX'], F, 'horizontal · inset root.marginX');
  if (len(v['root.marginY'], F, 'vertical · inset root.marginY') !== inset) throw new Error(`${F} 세로 들임이 가로 들임과 다르다(그림은 하나로 그린다)`);
  return {
    thickness: len(base['root.thickness'], F, 'root.thickness'),
    color: tok(base['root.background'], brand, F, 'root.background'),
    inset,
    margin: len(base['root.margin'], F, 'root.margin'),
  };
});

// ── 모음 ──────────────────────────────────────────────────
export type DisplayKit = {
  badge: BadgeLook;
  notif: NotifLook;
  tag: TagLook;
  avatar: AvatarLook;
  stack: StackLook;
  divider: DividerLook;
  // 그림 속 화면이 쓰는 역할 색
  tone: Record<DisplayTone, DColor>;
  // 제목 ↔ 배지(badge.md 코드의 gap-x1_5)
  titleGap: number;
  // 그림 속 화면의 글자(탭 이름 · 본문) — DESIGN.md 글자 토큰
  text: Record<'t3' | 't4' | 't5' | 't6', Omit<DType, 'fontWeight'>>;
};
export const displayKit = brandCache(
  (brand): DisplayKit => ({
    badge: badgeLook(brand),
    notif: notifLook(brand),
    tag: tagLook(brand),
    avatar: avatarLook(brand),
    stack: stackLook(brand),
    divider: dividerLook(brand),
    tone: Object.fromEntries(DISPLAY_TONES.map((n) => [n, named(n, brand)])) as DisplayKit['tone'],
    titleGap: must(num(design().front.spacing.x1_5), 'DESIGN.md', 'spacing x1_5'),
    text: Object.fromEntries((['t3', 't4', 't5', 't6'] as const).map((n) => [n, text(`$text-${n}`, 'DESIGN.md', `text-${n}`)])) as DisplayKit['text'],
  }),
);
