// Segmented Control 의 모양 — specs/components/segmented-control.yaml 을 고름 × 상태마다 풀어 둔다(서버, 빌드 때).
// 그림(segmented-control-view)은 이 값만 받아 그린다 — 트랙 · 칸 · 알약 · 알림 점의 치수 · 색은 그림에 따로 적지 않는다.
// 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 --p-<토큰> 변수로).
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, type Brand } from '@/lib/design-tokens';
import { SEG_SELECTED, SEG_STATES, SEG_TONES, type SegColor, type SegFace, type SegLook, type SegMotion, type SegType } from './segmented-control-shared';
export * from './segmented-control-shared';

const F = 'segmented-control.yaml';
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${F} 에 ${what} 이 없다`);
  return v;
};
const len = (raw: unknown, what: string) => {
  const v = String(tokenValue(must(raw, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what);
};
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`${F} 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return m.slice(1).map(Number);
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
function named(name: string, brand: Brand): SegColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): SegColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${F} 의 ${what} 이 색 토큰이 아니다(${v})`);
  // { value, dark } — 다크만 다른 토큰(안 고른 글: 라이트 fg-neutral-subtle · 다크 fg-neutral-muted, 2026-10-17).
  // 사이트 모드를 따르는 변수는 tokens-style 이 YAML 에서 모아 까는 --p-pair-<라이트>--<다크> 다
  const d = raw && typeof raw === 'object' && 'dark' in raw ? /^\$color-([a-z0-9-]+)$/.exec(String((raw as { dark: unknown }).dark).trim()) : null;
  if (d && d[1] !== m[1]) {
    const dark = design(brand).front.colors[`${d[1]}-dark`] ? color(`${d[1]}-dark`, brand) : color(d[1], brand);
    return { name: `pair-${m[1]}--${d[1]}`, light: color(m[1], brand), dark };
  }
  return named(m[1], brand);
}
function type(raw: unknown, weight: unknown, what: string): SegType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${F} 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}
const motionPair = (d: unknown, e: unknown, what: string): SegMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${F} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — segmented-control-shared.ts 를 고친다`);
}

const cache = new Map<Brand, SegLook>();

export function segmentedLook(brand: Brand = 'desk'): SegLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('segmented-control');
  sameSet(axisValues(spec, 'selected'), SEG_SELECTED, 'selected');
  sameSet(stateNames(spec), SEG_STATES, 'states');

  const base = resolveState(spec, {}, 'enabled');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');

  // 고름 × 상태 — 칸 바탕 · 테두리 · 글자색 · 커서 · 글 축소 · 링
  const faces = {} as SegLook['faces'];
  for (const selected of SEG_SELECTED) {
    faces[selected] = {} as SegLook['faces']['selected'];
    for (const st of SEG_STATES) {
      const r = resolveState(spec, { selected }, st);
      const where = `${selected} · ${st}`;
      const bw = r['item.borderWidth'] === undefined ? 0 : len(r['item.borderWidth'], `${where} item.borderWidth`);
      const face: SegFace = {
        bg: r['item.background'] === undefined ? null : tok(r['item.background'], brand, `${where} item.background`),
        border: bw > 0 ? { color: tok(r['item.borderColor'], brand, `${where} item.borderColor`), width: bw } : null,
        fg: tok(r['label.foreground'], brand, `${where} label.foreground`),
        cursor: String(unbox(must(r['item.cursor'], `${where} item.cursor`))),
        scale: st === 'pressed' && r['label.scale'] !== undefined,
        ring: st === 'focused' && r['focusRing.width'] !== undefined,
      };
      faces[selected][st] = face;
    }
  }

  // 누름 — 글만 2px 거리(Motion 의 눌림 피드백 축소량과 같아야 한다)
  const ps = pressScale();
  const [distance] = numIn(String(unbox(must(pressed['label.scale'], 'pressed label.scale'))), /(\d+)px/, 'pressed label.scale');
  if (distance !== ps.distance) throw new Error(`${F} 의 누름 축소 ${distance}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);

  // 모션 — 규칙의 값과 motion 블록이 같은지
  const slide = motionPair(base['indicator.transitionDuration'], base['indicator.transitionEasing'], 'indicator.transition');
  const colorM = motionPair(base['item.transitionDuration'], base['item.transitionEasing'], 'item.transition');
  const scaleM = motionPair(pressed['label.scaleDuration'], pressed['label.scaleEasing'], 'pressed label.scale');
  const blocks = (spec as unknown as { motion?: Record<string, { duration: unknown; easing: unknown; properties?: string[] }> }).motion ?? {};
  const blockOf = (name: string) => {
    const m = blocks[name];
    if (!m) throw new Error(`${F} 의 motion 에 "${name}" 이 없다`);
    return { ...motionPair(m.duration, m.easing, name), properties: m.properties ?? [] };
  };
  const bs = blockOf('고른 알약 — 미끄러짐');
  const bc = blockOf('누름 · 호버 · 고름 — 색');
  const bp = blockOf('누름 — 글');
  const same = (a: SegMotion, b: SegMotion) => a.duration === b.duration && a.easing === b.easing;
  if (!same(bs, slide) || !same(bc, colorM) || !same(bp, scaleM)) throw new Error(`${F} 의 motion 블록과 규칙의 전환 값이 다르다`);
  const props = String(unbox(must(base['item.transitionProperty'], 'item.transitionProperty')))
    .split(',')
    .map((p) => p.trim());
  if (props.join() !== bc.properties.join()) throw new Error(`${F} 의 칸 전환 속성(${props.join(', ')})이 motion 블록(${bc.properties.join(', ')})과 다르다`);
  const slideProp = String(unbox(must(base['indicator.transitionProperty'], 'indicator.transitionProperty'))).trim();
  if (slideProp !== 'transform' || bs.properties.join() !== 'transform') throw new Error(`${F} 의 알약 전환(${slideProp})이 transform 이 아니다 — 그림은 translateX 로 옮긴다`);

  // 칸 수 범위 — "칸 수(2 ~ 4)"
  const [min, max] = numIn(String(unbox(must(base['root.columns'], 'root.columns'))), /(\d+)\s*~\s*(\d+)/, 'root.columns');
  const padding = len(base['root.padding'], 'root.padding');
  const inset = len(base['indicator.inset'], 'indicator.inset');
  // 알약은 칸 격자와 겹쳐야 한다 — 트랙 안쪽 여백과 알약 들임이 같다
  if (inset !== padding) throw new Error(`${F} 의 indicator.inset(${inset})이 root.padding(${padding})과 다르다 — 알약이 칸과 어긋난다`);

  const look: SegLook = {
    root: { padding, radius: len(base['root.radius'], 'root.radius'), bg: tok(base['root.background'], brand, 'root.background'), min, max },
    item: { minH: len(base['item.minHeight'], 'item.minHeight'), padX: len(base['item.paddingX'], 'item.paddingX'), padY: len(base['item.paddingY'], 'item.paddingY'), radius: len(base['item.radius'], 'item.radius') },
    text: type(base['label.typography'], base['label.fontWeight'], 'label.typography'),
    align: String(unbox(must(base['label.textAlign'], 'label.textAlign'))),
    indicator: {
      bg: tok(base['indicator.background'], brand, 'indicator.background'),
      border: tok(base['indicator.borderColor'], brand, 'indicator.borderColor'),
      borderWidth: len(base['indicator.borderWidth'], 'indicator.borderWidth'),
      radius: len(base['indicator.radius'], 'indicator.radius'),
      inset,
      motion: slide,
    },
    notification: {
      size: len(base['notification.size'], 'notification.size'),
      radius: len(base['notification.radius'], 'notification.radius'),
      color: tok(base['notification.background'], brand, 'notification.background'),
      gap: len(base['notification.gap'], 'notification.gap'),
    },
    ring: { width: len(focused['focusRing.width'], 'focusRing.width'), offset: len(focused['focusRing.offset'], 'focusRing.offset'), color: tok(focused['focusRing.color'], brand, 'focusRing.color') },
    faces,
    motion: { color: colorM, scale: scaleM, props },
    press: { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis },
    gutter: len('$spacing-global-gutter', 'spacing-global-gutter'),
    tone: Object.fromEntries(SEG_TONES.map((n) => [n, named(n, brand)])) as SegLook['tone'],
  };
  // 비고의 "트랙 안쪽 4 를 더해 42" — 칸 높이 + 안쪽 여백 × 2 와 같아야 한다(문장이 바뀌면 그림도 같이 고친다)
  const [total] = numIn(noteOf(base['item.minHeight']), /더해\s*(\d+)/, 'item.minHeight 비고');
  if (total !== look.item.minH + padding * 2) throw new Error(`${F} 의 item.minHeight 비고(${total})가 칸 ${look.item.minH} + 안쪽 ${padding} × 2 와 다르다`);
  cache.set(brand, look);
  return look;
}
