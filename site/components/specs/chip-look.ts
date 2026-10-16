// Chip 의 모양 — specs/components/chip.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(chip-view)은 이 값만 받아 그린다 — 칩의 높이 · 여백 · 아이콘 · 색은 그림에 따로 적지 않는다.
// 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 --p-<토큰> 변수로).
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, type Brand } from '@/lib/design-tokens';
import { CHIP_SELECTED, CHIP_SIZES, CHIP_STATES, CHIP_TONES, CHIP_VARIANTS, type ChipColor, type ChipFace, type ChipLook, type ChipMotion, type ChipSize, type ChipSizeLook, type ChipType, type ChipVariant } from './chip-shared';
import { rowFogDepth, scrollFogLook } from './loading-look';
export * from './chip-shared';

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`chip.yaml 에 ${what} 이 없다`);
  return v;
};
// '16px' · '0px' · '−6px' · '$spacing-x3' → 수(빼기는 글자 − 도 받는다)
const len = (raw: unknown, what: string) => {
  const v = String(tokenValue(must(raw, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what);
};
// 값 · 비고 글자 속 수 — 문장이 바뀌면 여기서 멈춘다(그림이 낡지 않게)
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`chip.yaml 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
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
function named(name: string, brand: Brand): ChipColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): ChipColor {
  const v = String(unbox(must(raw, what))).trim();
  if (v === 'transparent') return { light: 'transparent', dark: 'transparent' };
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`chip.yaml 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
function type(raw: unknown, weight: unknown, what: string): ChipType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`chip.yaml 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}
const motionPair = (d: unknown, e: unknown, what: string): ChipMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });

// 축 · 상태가 그림과 같은지 — YAML 에 변형 · 크기 · 상태가 늘거나 줄면 여기서 멈춘다(그림이 빠뜨리지 않게)
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`chip.yaml 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — chip-shared.ts 를 고친다`);
}

const cache = new Map<Brand, ChipLook>();

export function chipLook(brand: Brand = 'desk'): ChipLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('chip');
  sameSet(axisValues(spec, 'variant'), CHIP_VARIANTS, 'variant');
  sameSet(axisValues(spec, 'size'), CHIP_SIZES, 'size');
  sameSet(axisValues(spec, 'selected'), CHIP_SELECTED, 'selected');
  sameSet(stateNames(spec), CHIP_STATES, 'states');

  const base = resolveState(spec, {}, 'enabled');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');

  // 크기 — 글이 있는 칩 · 아이콘만 있는 칩
  const sizes = {} as Record<ChipSize, ChipSizeLook>;
  for (const size of CHIP_SIZES) {
    const v = resolveState(spec, { size, layout: 'withText' }, 'enabled');
    const io = resolveState(spec, { size, layout: 'iconOnly' }, 'enabled');
    const where = `${size}`;
    const h = len(v['root.height'], `${where} root.height`);
    if (len(io['root.height'], `${where} iconOnly root.height`) !== h) throw new Error(`chip.yaml ${where} — 아이콘만 있는 칩의 높이가 다르다`);
    if (len(io['root.paddingX'], `${where} iconOnly root.paddingX`) !== 0) throw new Error(`chip.yaml ${where} — 아이콘만 있는 칩의 좌우 여백이 0 이 아니다(그림은 가운데 맞춤)`);
    // 지우기의 누르는 영역은 크기마다 비고에 적혀 있다 — 셋이 같아야 한다(그림은 하나로 그린다)
    const target = numIn(noteOf(v['removeButton.size']), /누르는 영역\s*(\d+)\s*×/, `${where} removeButton.size 비고`);
    if (target !== numIn(noteOf(base['removeButton.color']), /누르는 영역\s*(\d+)\s*×/, 'removeButton.color 비고')) throw new Error(`chip.yaml ${where} — 지우기의 누르는 영역이 공통 비고와 다르다`);
    sizes[size] = {
      h,
      padX: len(v['root.paddingX'], `${where} root.paddingX`),
      minW: len(v['root.minWidth'], `${where} root.minWidth`),
      iconOnlyW: len(io['root.width'], `${where} iconOnly root.width`),
      prefixIcon: len(v['prefixIcon.size'], `${where} prefixIcon.size`),
      suffixIcon: len(v['suffixIcon.size'], `${where} suffixIcon.size`),
      removeIcon: len(v['removeButton.size'], `${where} removeButton.size`),
      icon: len(io['icon.size'], `${where} icon.size`),
    };
  }

  // 변형 × 고름 × 상태의 색 — 크기와 상관없다(크기 규칙에는 색이 없다)
  const faces = {} as ChipLook['faces'];
  for (const variant of CHIP_VARIANTS) {
    faces[variant] = {} as ChipLook['faces'][ChipVariant];
    for (const selected of CHIP_SELECTED) {
      faces[variant][selected] = {} as ChipLook['faces'][ChipVariant]['selected'];
      for (const st of CHIP_STATES) {
        const r = resolveState(spec, { variant, selected }, st);
        const where = `${variant} · ${selected} · ${st}`;
        const bw = r['root.borderWidth'] === undefined ? 0 : len(r['root.borderWidth'], `${where} root.borderWidth`);
        const face: ChipFace = {
          bg: tok(r['root.background'], brand, `${where} root.background`),
          fg: tok(r['root.foreground'], brand, `${where} root.foreground`),
          border: bw > 0 ? { color: tok(r['root.borderColor'], brand, `${where} root.borderColor`), width: bw } : null,
          cursor: String(unbox(must(r['root.cursor'], `${where} root.cursor`))),
        };
        faces[variant][selected][st] = face;
      }
    }
  }

  // 누름 축소 — YAML 의 "2px 거리" 가 Motion 의 눌림 피드백 축소량과 같은지(그림은 기초 값으로 셈한다)
  const ps = pressScale();
  const yamlDistance = numIn(String(unbox(must(pressed['root.scale'], 'pressed root.scale'))), /(\d+)px/, 'pressed root.scale');
  if (yamlDistance !== ps.distance) throw new Error(`chip.yaml 의 누름 축소 ${yamlDistance}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);

  // 모션 — 규칙의 값과 motion 블록이 같은지
  const color2 = motionPair(base['root.transitionDuration'], base['root.transitionEasing'], 'root.transition');
  const scale2 = motionPair(pressed['root.scaleDuration'], pressed['root.scaleEasing'], 'pressed root.scale');
  const blocks = (spec as unknown as { motion?: Record<string, { duration: unknown; easing: unknown }> }).motion ?? {};
  const blockOf = (name: string) => {
    const m = blocks[name];
    if (!m) throw new Error(`chip.yaml 의 motion 에 "${name}" 이 없다`);
    return motionPair(m.duration, m.easing, name);
  };
  const mc = blockOf('누름 · 호버 · 고름 — 색');
  const msc = blockOf('누름 — 칩');
  if (mc.duration !== color2.duration || mc.easing !== color2.easing || msc.duration !== scale2.duration || msc.easing !== scale2.easing) throw new Error('chip.yaml 의 motion 블록과 규칙의 전환 값이 다르다');

  // 입력값 칩 지우기의 누름 — 지우기만 2px 거리(기준 길이는 비고의 "기준 N" — Motion 의 기준 길이 규칙과 같아야 한다)
  const removeTarget = numIn(noteOf(base['removeButton.color']), /누르는 영역\s*(\d+)\s*×/, 'removeButton.color 비고');
  const removeRaw = must(pressed['removeButton.scale'], 'pressed removeButton.scale');
  const removeDistance = numIn(String(unbox(removeRaw)), /(\d+)px/, 'pressed removeButton.scale');
  const removeBasis = numIn(noteOf(removeRaw), /기준\s*(\d+)/, 'pressed removeButton.scale 비고');
  if (removeDistance !== ps.distance) throw new Error(`chip.yaml 의 지우기 축소 ${removeDistance}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
  if (removeBasis !== ps.basis(removeTarget, removeTarget)) throw new Error(`chip.yaml 의 지우기 축소 기준 ${removeBasis} 가 누르는 영역 ${removeTarget} 의 기준 길이(${ps.basis(removeTarget, removeTarget)})와 다르다`);

  // 누르는 영역 — "44 × 44"(가로 · 세로)
  const touchRaw = String(unbox(must(base['root.touchTarget'], 'root.touchTarget')));
  const touch = { w: numIn(touchRaw, /(\d+)\s*×/, 'root.touchTarget 가로'), h: numIn(touchRaw, /×\s*(\d+)/, 'root.touchTarget 세로') };
  // 가로 스크롤 줄 — 안쪽 위아래는 누르는 영역 · 포커스 링이 잘리지 않을 만큼, 바깥은 그만큼 되돌려 줄 높이가 칩 그대로여야 한다
  const scrollRow = {
    padX: len(base['scrollRow.paddingX'], 'scrollRow.paddingX'),
    padY: len(base['scrollRow.paddingY'], 'scrollRow.paddingY'),
    marginY: len(base['scrollRow.marginY'], 'scrollRow.marginY'),
    scrollPadding: len(base['scrollRow.scrollPadding'], 'scrollRow.scrollPadding'),
    overflowX: String(unbox(must(base['scrollRow.overflowX'], 'scrollRow.overflowX'))),
    // 양 끝 흐림 — "좌우 20px" 이 Scroll Fog row 의 깊이와 같은지(scroll-fog.yaml), 마스크는 gradient-fade-mask
    fog: rowFogDepth(base['scrollRow.fog'], 'chip.yaml scrollRow.fog'),
    mask: scrollFogLook().mask,
  };
  if (scrollRow.padX < scrollRow.fog) throw new Error(`chip.yaml 의 scrollRow.paddingX(${scrollRow.padX})가 흐림(${scrollRow.fog})보다 좁다 — 처음 · 끝 칩이 흐려진다`);
  const smallest = Math.min(...Object.values(sizes).map((v) => v.h));
  const ringOut = len(focused['focusRing.width'], 'focusRing.width') + len(focused['focusRing.offset'], 'focusRing.offset');
  if (scrollRow.padY < (touch.h - smallest) / 2 || scrollRow.padY < ringOut) throw new Error(`chip.yaml 의 scrollRow.paddingY ${scrollRow.padY} 가 누르는 영역(${(touch.h - smallest) / 2}) · 포커스 링(${ringOut})보다 작다`);
  if (scrollRow.marginY !== -scrollRow.padY) throw new Error(`chip.yaml 의 scrollRow.marginY(${scrollRow.marginY})가 −paddingY(${-scrollRow.padY})가 아니다 — 줄 높이가 칩과 달라진다`);
  // 묶음 — 비었을 때 높이 · 키보드 링(focused 의 group)
  const group = {
    gap: len(base['group.gap'], 'group.gap'),
    rowGap: len(base['group.rowGap'], 'group.rowGap'),
    minHeight: len(base['group.minHeight'], 'group.minHeight'),
    ring: { width: len(focused['group.outlineWidth'], 'focused group.outlineWidth'), offset: len(focused['group.outlineOffset'], 'focused group.outlineOffset'), color: tok(focused['group.outlineColor'], brand, 'focused group.outlineColor') },
  };
  // 비었을 때 높이는 비고대로 칩 한 줄(medium) — 크기가 바뀌면 같이 고친다
  if (group.minHeight !== sizes.medium.h) throw new Error(`chip.yaml 의 group.minHeight(${group.minHeight})가 medium 칩 높이(${sizes.medium.h})와 다르다`);

  // 최대 폭 — 줄 폭(100%)에서 말줄임. 값이 바뀌면 그림(chip-view 의 말줄임)을 같이 고친다
  if (String(unbox(base['root.maxWidth'])) !== '100%') throw new Error(`chip.yaml 의 root.maxWidth(${String(unbox(base['root.maxWidth']))})가 100% 가 아니다 — 그림은 줄 폭에서 말줄임한다`);
  if (!String(unbox(must(base['label.overflow'], 'label.overflow'))).startsWith('말줄임')) throw new Error('chip.yaml 의 label.overflow 가 말줄임이 아니다');

  const look: ChipLook = {
    defaults: { variant: must(spec.defaults?.variant, 'defaults.variant') as ChipVariant, size: must(spec.defaults?.size, 'defaults.size') as ChipSize },
    sizes,
    radius: len(base['root.radius'], 'root.radius'),
    maxWidth: String(unbox(must(base['root.maxWidth'], 'root.maxWidth'))),
    gap: len(base['root.gap'], 'root.gap'),
    text: type(base['label.typography'], base['label.fontWeight'], 'label.typography'),
    faces,
    ring: { width: len(focused['focusRing.width'], 'focusRing.width'), offset: len(focused['focusRing.offset'], 'focusRing.offset'), color: tok(focused['focusRing.color'], brand, 'focusRing.color') },
    touch,
    removeTarget,
    removeScale: ps.ratio(removeTarget, removeTarget),
    group,
    scrollRow,
    motion: { color: color2, scale: scale2 },
    press: { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis },
    tone: Object.fromEntries(CHIP_TONES.map((n) => [n, named(n, brand)])) as ChipLook['tone'],
  };
  cache.set(brand, look);
  return look;
}
