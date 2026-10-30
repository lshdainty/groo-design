// 마무리 묶음의 모양 — specs/components/quantity-picker · attachment-input · footer.yaml 과 avatar.yaml 의 사진 바꾸기 자리(edit photo)를
// 풀어 둔다(서버, 빌드 때). 그림(finish-view · finish-play)은 이 값만 받아 그린다 — 치수 · 색 · 글은 그림에 따로 적지 않는다.
// 숫자는 YAML 의 속성에서만 읽는다(비고에서 숫자를 뽑지 않는다). 속성끼리 맞아야 하는 값(누르는 자리 = 보이는 크기 + 여백 × 2,
// 파일 이름 칸 폭 = 카드 − 여백 − 썸네일 − 사이)은 여기서 셈해 보고, 어긋나면 빌드가 멈춘다.
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { pressScale, proseValue, type Brand } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { named } from './input-look';
import { loadingKit } from './loading-look';
import { QP_SIZES, QP_STATES, type AtLook, type AvEditLook, type FtLinkLook, type FtLook, type IColor, type IMotion, type IType, type QpLook, type QpSize, type QpSizeProp } from './finish-shared';
export * from './finish-shared';

type Vals = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);

function kit(F: string, brand: Brand) {
  const must = <T,>(v: T | undefined | null, what: string): T => {
    if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${F} 에 ${what} 이 없다`);
    return v;
  };
  // 길이 — '16px' · '$spacing-x4' · '$radius-r2' · '0px' · '-2px'
  const len = (raw: unknown, what: string) => {
    const v = String(tokenValue(must(raw, what))).replace('−', '-');
    if (v === '0') return 0;
    if (v === '9999px') return 9999;
    return must(num(v), what);
  };
  const str = (raw: unknown, what: string) => String(unbox(must(raw, what))).trim();
  const n = (raw: unknown, what: string) => {
    const v = Number(str(raw, what));
    if (!Number.isFinite(v)) throw new Error(`${F} 의 ${what}(${str(raw, what)})이 수가 아니다`);
    return v;
  };
  const color = (raw: unknown, what: string): IColor => {
    const v = str(raw, what);
    const m = /^\$color-([a-z0-9-]+)$/.exec(v);
    if (!m) throw new Error(`${F} 의 ${what} 이 색 토큰이 아니다(${v})`);
    return named(m[1], brand);
  };
  const type = (raw: unknown, weight: unknown, what: string): IType => {
    const t = tokenValue(unbox(must(raw, what)) as string) as TypeValue | undefined;
    if (!t || typeof t !== 'object' || !t.lineHeight) throw new Error(`${F} 의 ${what} 글자 토큰을 풀지 못했다`);
    return { fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
  };
  const motion = (d: unknown, e: unknown, what: string): IMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });
  // "44 × 44" — 정사각 누르는 자리
  const square = (raw: unknown, what: string) => {
    const m = /^(\d+) × (\d+)$/.exec(str(raw, what));
    if (!m || m[1] !== m[2]) throw new Error(`${F} 의 ${what}(${str(raw, what)})이 'N × N' 이 아니다`);
    return Number(m[1]);
  };
  // "2px 거리 축소" — Feedback 의 눌림 피드백과 같아야 한다
  const press = (raw: unknown, d: unknown, e: unknown, what: string) => {
    const m = /^(\d+)px 거리 축소$/.exec(str(raw, what));
    if (!m) throw new Error(`${F} 의 ${what}(${str(raw, what)})이 'Npx 거리 축소' 가 아니다`);
    const ps = pressScale();
    if (Number(m[1]) !== ps.distance) throw new Error(`${F} 의 ${what} ${m[1]}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
    return { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis, motion: motion(d, e, `${what} 모션`) };
  };
  const ring = (v: Vals, what: string) => ({ width: len(v['focusRing.width'], `${what} focusRing.width`), offset: len(v['focusRing.offset'], `${what} focusRing.offset`), color: color(v['focusRing.color'], `${what} focusRing.color`) });
  const same = (a: unknown, b: unknown, what: string) => {
    if (a !== b) throw new Error(`${F} 의 ${what}(${String(a)})이 ${String(b)} 와 다르다 — 그림을 고친다`);
  };
  return { must, len, str, n, color, type, motion, square, press, ring, same };
}
function sameSet(F: string, got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${F} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — finish-shared.ts 를 고친다`);
}
// 사진 위 딤 — { value: $overlay-dim-light, dark: $overlay-dim-dark } 이면 사이트 모드를 따르는 --p-overlay-dim(tokens-style 이 깐다)
function dimOf(F: string, raw: unknown, what: string): IColor {
  const box = (raw ?? {}) as { value?: unknown; dark?: unknown };
  if (String(box.value) !== '$overlay-dim-light' || String(box.dark) !== '$overlay-dim-dark') throw new Error(`${F} 의 ${what} 이 overlay-dim-light · -dark 가 아니다`);
  return { name: 'overlay-dim', light: proseValue('overlay-dim-light'), dark: proseValue('overlay-dim-dark') };
}
function fixedDim(F: string, raw: unknown, what: string) {
  const v = String(unbox(raw));
  if (v !== '$overlay-dim-dark') throw new Error(`${F} 의 ${what}(${v})이 overlay-dim-dark 가 아니다`);
  return proseValue('overlay-dim-dark');
}
// "1280 미만 …" · "1280 이상 …" — 경계 폭(축 설명 · 비고가 아니라 값 줄로 적힌 것)
const surfaces = (brand: Brand) => ({ default: named('bg-layer-default', brand), floating: named('bg-layer-floating', brand) });

// ── Quantity Picker ───────────────────────────────────────
const qpCache = new Map<Brand, QpLook>();
export function qpLook(brand: Brand = 'desk'): QpLook {
  const hit = qpCache.get(brand);
  if (hit) return hit;
  const F = 'quantity-picker.yaml';
  const k = kit(F, brand);
  const spec = loadComponentSpec('quantity-picker');
  sameSet(F, stateNames(spec), QP_STATES, 'states');
  sameSet(F, axisValues(spec, 'size'), [...QP_SIZES, 'responsive'], 'size');
  sameSet(F, axisValues(spec, 'layout'), ['hug', 'fill'], 'layout');
  const st = (s: string) => resolveState(spec, {}, s);
  const b = st('enabled');
  const ho = st('hovered');
  const fo = st('focused');
  const pr = st('pressed');
  const lo = st('loading');
  const inv = st('invalid');
  const di = st('disabled');
  const sizes = {} as QpLook['sizes'];
  for (const size of QP_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const h = k.len(v['root.minHeight'], `${size} root.minHeight`);
    k.same(k.len(v['button.size'], `${size} button.size`), h, `${size} button.size(정사각 — 상자 높이)`);
    k.same(k.str(v['button.radius'], `${size} button.radius`), k.str(v['root.radius'], `${size} root.radius`), `${size} button.radius`);
    const touch = k.square(v['button.touchTarget'], `${size} button.touchTarget`);
    const extend = k.len(v['button.touchExtend'], `${size} button.touchExtend`);
    k.same(h + extend * 2, touch, `${size} 보이는 ${h} + 여백 ${extend} × 2`);
    sizes[size] = {
      h,
      radius: k.len(v['root.radius'], `${size} root.radius`),
      icon: k.len(v['icon.size'], `${size} icon.size`),
      text: k.type(v['value.typography'], b['value.fontWeight'], `${size} value.typography`),
      touch,
      extend,
      progress: k.len(v['progressCircle.size'], `${size} progressCircle.size`),
    };
    k.same(sizes[size].progress, sizes[size].icon, `${size} progressCircle.size(아이콘 자리)`);
  }
  const resp = resolveState(spec, { size: 'responsive' }, 'enabled');
  const breakpoint = k.len(resp['root.breakpoint'], 'responsive root.breakpoint');
  // 비고 "미만은 large, 이상은 medium" — 어느 크기의 값을 쓰는지는 축 설명(variants.size.responsive)에도 있다
  const respDesc = String((spec.variants.size as Record<string, string>).responsive);
  if (!new RegExp(`${breakpoint} 미만 large · 이상 medium`).test(respDesc)) throw new Error(`${F} 의 size.responsive 설명(${respDesc})이 "${breakpoint} 미만 large · 이상 medium" 이 아니다`);
  const look: QpLook = {
    sizes,
    breakpoint,
    responsive: { below: 'large', above: 'medium' },
    defaults: { size: k.must(spec.defaults?.size, 'defaults.size') as QpSizeProp, layout: k.must(spec.defaults?.layout, 'defaults.layout') as 'hug' | 'fill' },
    root: {
      bg: k.color(b['root.background'], 'root.background'),
      borderW: k.len(b['root.borderWidth'], 'root.borderWidth'),
      border: k.color(b['root.borderColor'], 'root.borderColor'),
      invalidW: k.len(inv['root.borderWidth'], 'invalid root.borderWidth'),
      invalid: k.color(inv['root.borderColor'], 'invalid root.borderColor'),
    },
    button: { hoverBg: k.color(ho['button.background'], 'hovered button.background'), pressedBg: k.color(pr['button.background'], 'pressed button.background'), loadingBg: k.color(lo['button.background'], 'loading button.background') },
    icon: { color: k.color(b['icon.color'], 'icon.color'), disabled: k.color(di['icon.color'], 'disabled icon.color') },
    divider: { w: k.len(b['divider.width'], 'divider.width'), h: k.len(b['divider.height'], 'divider.height'), color: k.color(b['divider.background'], 'divider.background') },
    value: { color: k.color(b['value.foreground'], 'value.foreground'), disabled: k.color(di['value.foreground'], 'disabled value.foreground'), weight: unbox(b['value.fontWeight']) as number, padX: k.len(b['value.paddingX'], 'value.paddingX') },
    progress: { thickness: k.len(b['progressCircle.thickness'], 'progressCircle.thickness'), track: k.color(b['progressCircle.track'], 'progressCircle.track'), range: k.color(b['progressCircle.range'], 'progressCircle.range') },
    ring: k.ring(fo, 'focused'),
    press: k.press(pr['button.scale'], pr['button.scaleDuration'], pr['button.scaleEasing'], 'pressed button.scale'),
    color: k.motion(b['button.transitionDuration'], b['button.transitionEasing'], 'button 바탕'),
    names: { decrement: k.str(b['decrement.name'], 'decrement.name'), increment: k.str(b['increment.name'], 'increment.name') },
    surface: surfaces(brand),
  };
  // 끝(최소 · 최대)의 막힌 아이콘은 컨트롤 전체 막힘의 아이콘과 같은 색이다(그림은 한 색으로 그린다)
  const edgeMin = resolveState(spec, { edge: 'min' }, 'enabled');
  const edgeMax = resolveState(spec, { edge: 'max' }, 'enabled');
  k.same(k.str(edgeMin['decrement.iconColor'], 'edge min decrement.iconColor'), k.str(di['icon.color'], 'disabled icon.color'), 'edge min decrement.iconColor');
  k.same(k.str(edgeMax['increment.iconColor'], 'edge max increment.iconColor'), k.str(di['icon.color'], 'disabled icon.color'), 'edge max increment.iconColor');
  k.same(k.str(edgeMin['decrement.ariaDisabled'], 'edge min ariaDisabled'), 'true', 'edge min decrement.ariaDisabled');
  // 지우기 — 최소에서 휴지통(trash-2)으로, 막히지 않는다
  const rm = resolveState(spec, { removable: 'on', edge: 'min' }, 'enabled');
  k.same(k.str(rm['decrement.icon'], 'removable decrement.icon'), 'trash-2', 'removable decrement.icon');
  k.same(k.str(rm['decrement.ariaDisabled'], 'removable ariaDisabled'), 'false', 'removable decrement.ariaDisabled');
  qpCache.set(brand, look);
  return look;
}
export const qpSizeAt = (look: QpLook, size: QpSizeProp, wide: boolean): QpSize => (size === 'responsive' ? (wide ? look.responsive.above : look.responsive.below) : size);

// ── Attachment Input ──────────────────────────────────────
const atCache = new Map<Brand, AtLook>();
export function atLook(brand: Brand = 'desk'): AtLook {
  const hit = atCache.get(brand);
  if (hit) return hit;
  const F = 'attachment-input.yaml';
  const k = kit(F, brand);
  const spec = loadComponentSpec('attachment-input');
  sameSet(F, stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed', 'dragOver', 'dragging', 'readonly', 'disabled'], 'states');
  sameSet(F, axisValues(spec, 'status'), ['pending', 'uploading', 'success', 'error'], 'status');
  sameSet(F, axisValues(spec, 'kind'), ['image', 'file'], 'kind');
  const b = resolveState(spec, {}, 'enabled');
  const ho = resolveState(spec, {}, 'hovered');
  const fo = resolveState(spec, {}, 'focused');
  const pr = resolveState(spec, {}, 'pressed');
  const di = resolveState(spec, {}, 'disabled');
  const img = resolveState(spec, { kind: 'image' }, 'enabled');
  const file = resolveState(spec, { kind: 'file' }, 'enabled');
  const fileDrag = resolveState(spec, { kind: 'file' }, 'dragging');
  const imgUp = resolveState(spec, { kind: 'image', status: 'uploading' }, 'enabled');
  const fileUp = resolveState(spec, { kind: 'file', status: 'uploading' }, 'enabled');
  const imgErr = resolveState(spec, { kind: 'image', status: 'error' }, 'enabled');
  const fileErr = resolveState(spec, { kind: 'file', status: 'error' }, 'enabled');
  const full = resolveState(spec, { capacity: 'full' }, 'enabled');
  const dz = resolveState(spec, { layout: 'dropzone', screen: 'wide' }, 'enabled');
  const dzDrag = resolveState(spec, { layout: 'dropzone', screen: 'wide' }, 'dragOver');
  const dzDis = resolveState(spec, { layout: 'dropzone', screen: 'wide' }, 'disabled');
  const dzFull = resolveState(spec, { layout: 'dropzone', screen: 'wide', capacity: 'full' }, 'enabled');
  const narrow = resolveState(spec, { layout: 'dropzone', screen: 'narrow' }, 'enabled');
  const circle = loadingKit(brand === 'shared' ? 'desk' : brand).circle;
  const fog = loadingKit(brand === 'shared' ? 'desk' : brand).fog;
  // 막힌 색 — 타일 아이콘 · 개수 · ×(막힘) · 끄는 파일 카드가 한 색이다
  const disabled = k.color(di['triggerIcon.color'], 'disabled triggerIcon.color');
  for (const [v, key, what] of [
    [full, 'triggerIcon.color', 'full triggerIcon.color'],
    [full, 'count.foreground', 'full count.foreground'],
    [di, 'removeButton.iconColor', 'disabled removeButton.iconColor'],
    [fileDrag, 'name.foreground', 'file dragging name.foreground'],
    [fileDrag, 'thumbnailIcon.color', 'file dragging thumbnailIcon.color'],
  ] as const)
    k.same(k.str(v[key], what), k.str(di['triggerIcon.color'], 'disabled triggerIcon.color'), what);
  const trigger = {
    size: k.len(b['trigger.size'], 'trigger.size'),
    radius: k.len(b['trigger.radius'], 'trigger.radius'),
    borderW: k.len(b['trigger.borderWidth'], 'trigger.borderWidth'),
    border: k.color(b['trigger.borderColor'], 'trigger.borderColor'),
    gap: k.len(b['trigger.gap'], 'trigger.gap'),
    hoverBg: k.color(ho['trigger.background'], 'hovered trigger.background'),
    pressedBg: k.color(pr['trigger.background'], 'pressed trigger.background'),
    icon: k.len(b['triggerIcon.size'], 'triggerIcon.size'),
    iconColor: k.color(b['triggerIcon.color'], 'triggerIcon.color'),
  };
  const item = {
    h: k.len(b['item.height'], 'item.height'),
    radius: k.len(b['item.radius'], 'item.radius'),
    borderW: k.len(b['item.borderWidth'], 'item.borderWidth'),
    imageW: k.len(img['item.width'], 'image item.width'),
    fileW: k.len(file['item.width'], 'file item.width'),
    filePadX: k.len(file['item.paddingX'], 'file item.paddingX'),
    gap: k.len(b['item.gap'], 'item.gap'),
    imageStroke: k.color(img['item.borderColor'], 'image item.borderColor'),
    fileBorder: k.color(file['item.borderColor'], 'file item.borderColor'),
  };
  k.same(item.imageW, item.h, 'image item.width(정사각 — 높이)');
  k.same(trigger.size, item.h, 'trigger.size(항목 높이와 같은 줄)');
  const thumb = { size: k.len(b['thumbnail.size'], 'thumbnail.size'), radius: k.len(b['thumbnail.radius'], 'thumbnail.radius'), bg: k.color(b['thumbnail.background'], 'thumbnail.background'), icon: k.len(b['thumbnailIcon.size'], 'thumbnailIcon.size'), iconColor: k.color(b['thumbnailIcon.color'], 'thumbnailIcon.color') };
  const metaW = k.len(b['meta.width'], 'meta.width');
  // 이름 칸 폭 = 카드 − 좌우 여백 × 2 − 썸네일 − 사이
  k.same(item.fileW - item.filePadX * 2 - thumb.size - item.gap, metaW, `meta.width(카드 ${item.fileW} − ${item.filePadX} × 2 − ${thumb.size} − ${item.gap})`);
  const wb = k.str(b['name.wordBreak'], 'name.wordBreak');
  if (wb !== 'break-all' && wb !== 'keep-all') throw new Error(`${F} 의 name.wordBreak(${wb})를 그림이 모른다`);
  const name = { text: k.type(b['name.typography'], b['name.fontWeight'], 'name.typography'), color: k.color(b['name.foreground'], 'name.foreground'), maxLines: k.n(b['name.maxLines'], 'name.maxLines'), wordBreak: wb as 'break-all' | 'keep-all', maskClear: k.len(b['name.maskClear'], 'name.maskClear') };
  const size = { text: k.type(b['size.typography'], b['size.fontWeight'], 'size.typography'), color: k.color(b['size.foreground'], 'size.foreground') };
  // 네 줄 + 크기 한 줄이 상자 높이 안에 드는지
  const fits = parseFloat(name.text.lineHeight) * name.maxLines + parseFloat(size.text.lineHeight);
  if (fits > item.h) throw new Error(`${F} 의 이름 ${name.maxLines}줄 + 크기(${fits})가 상자 ${item.h} 를 넘는다`);
  const pcSize = k.len(b['progressCircle.size'], 'progressCircle.size');
  k.same(circle.sizes['24'].size, pcSize, 'progressCircle.size(Progress Circle size 24)');
  k.same(k.str(imgUp['progressCircle.tone'], 'image uploading tone'), 'staticWhite', 'image uploading progressCircle.tone');
  k.same(k.str(fileUp['progressCircle.tone'], 'file uploading tone'), 'neutral', 'file uploading progressCircle.tone');
  k.same(k.str(b['progressCircle.mode'], 'progressCircle.mode'), 'determinate', 'progressCircle.mode');
  const remove = {
    size: k.len(b['removeButton.size'], 'removeButton.size'),
    bg: k.color(b['removeButton.background'], 'removeButton.background'),
    borderW: k.len(b['removeButton.borderWidth'], 'removeButton.borderWidth'),
    border: k.color(b['removeButton.borderColor'], 'removeButton.borderColor'),
    offset: k.len(b['removeButton.offset'], 'removeButton.offset'),
    icon: k.len(b['removeButton.iconSize'], 'removeButton.iconSize'),
    iconColor: k.color(b['removeButton.iconColor'], 'removeButton.iconColor'),
    touch: k.square(b['removeButton.touchTarget'], 'removeButton.touchTarget'),
    extend: k.len(b['removeButton.touchExtend'], 'removeButton.touchExtend'),
    hoverBg: k.color(ho['removeButton.background'], 'hovered removeButton.background'),
    pressedBg: k.color(pr['removeButton.background'], 'pressed removeButton.background'),
  };
  k.same(remove.size + remove.extend * 2, remove.touch, `× 보이는 ${remove.size} + 여백 ${remove.extend} × 2`);
  const mask = { size: k.len(b['removeMask.size'], 'removeMask.size'), offset: k.len(b['removeMask.offset'], 'removeMask.offset') };
  // 구멍의 가운데 = × 의 가운데 — 모서리에서 안쪽 (반지름 − 걸친 만큼)
  k.same(remove.size / 2 - remove.offset, mask.offset, `removeMask.offset(× 가운데 = ${remove.size} ÷ 2 − ${remove.offset})`);
  const fogDepth = Number(/^좌우 (\d+)$/.exec(k.str(b['items.fog'], 'items.fog'))?.[1]);
  k.same(fogDepth, fog.uses.row.sides.left, 'items.fog(Scroll Fog row 의 깊이)');
  const bleed = k.len(b['items.bleedX'], 'items.bleedX');
  k.same(bleed, fog.uses.row.pad.left, 'items.bleedX(Scroll Fog row 의 여백)');
  const wideDesc = String((spec.variants.screen as Record<string, string>).wide);
  const bp = Number(/^(\d+) 이상 웹/.exec(wideDesc)?.[1]);
  if (!bp) throw new Error(`${F} 의 screen.wide 설명(${wideDesc})이 "N 이상 웹" 이 아니다`);
  k.same(k.str(dz['pickButton.size'], 'wide pickButton.size'), 'small', 'wide pickButton.size');
  const pickWide = buttonLook({ variant: k.str(dz['pickButton.variant'], 'wide pickButton.variant'), size: k.str(dz['pickButton.size'], 'wide pickButton.size') }, brand === 'shared' ? 'desk' : brand);
  const pickNarrow = buttonLook({ variant: k.str(narrow['pickButton.variant'], 'narrow pickButton.variant'), size: k.str(narrow['pickButton.size'], 'narrow pickButton.size') }, brand === 'shared' ? 'desk' : brand);
  k.same(k.str(narrow['pickButton.prefixIcon'], 'narrow pickButton.prefixIcon'), 'upload', 'narrow pickButton.prefixIcon');
  k.same(k.str(dzFull['dropzone.borderColor'], 'full dropzone.borderColor'), k.str(dzDis['dropzone.borderColor'], 'disabled dropzone.borderColor'), 'full dropzone.borderColor(막힘과 같다)');
  // 사진 · 파일 카드의 읽기 전용 · 끄는 중(13B)
  const imgRo = resolveState(spec, { kind: 'image' }, 'readonly');
  const imgDrag = resolveState(spec, { kind: 'image' }, 'dragging');
  const fileRo = resolveState(spec, { kind: 'file' }, 'readonly');
  for (const key of ['name.foreground', 'size.foreground', 'thumbnailIcon.color'] as const) {
    k.same(k.str(fileRo[key], `file readonly ${key}`), k.str(di['triggerIcon.color'], 'disabled triggerIcon.color'), `file readonly ${key}`);
    k.same(k.str(fileDrag[key], `file dragging ${key}`), k.str(di['triggerIcon.color'], 'disabled triggerIcon.color'), `file dragging ${key}`);
  }
  // 끌기 문턱 — "마우스 8px · 터치 250ms"
  const ds = /^마우스 (\d+)px · 터치 (\d+)ms$/.exec(k.str(b['item.dragStart'], 'item.dragStart'));
  if (!ds) throw new Error(`${F} 의 item.dragStart 가 "마우스 Npx · 터치 Nms" 가 아니다`);
  k.same(k.str(b['item.press'], 'item.press'), '메뉴를 연다', 'item.press');
  const ro = resolveState(spec, {}, 'readonly');
  k.same(k.str(ro['item.press'], 'readonly item.press'), '크게 보기', 'readonly item.press');
  const fileMenu = resolveState(spec, { kind: 'file' }, 'enabled');
  k.same(k.str(fileMenu['itemMenu.makeCover'], 'file itemMenu.makeCover'), '없음', 'file itemMenu.makeCover');
  const first = resolveState(spec, { position: 'first' }, 'enabled');
  const last = resolveState(spec, { position: 'last' }, 'enabled');
  k.same(k.str(first['itemMenu.moveEarlier'], 'first moveEarlier'), '막힘', 'position first itemMenu.moveEarlier');
  k.same(k.str(first['itemMenu.makeCover'], 'first makeCover'), '막힘', 'position first itemMenu.makeCover');
  k.same(k.str(last['itemMenu.moveLater'], 'last moveLater'), '막힘', 'position last itemMenu.moveLater');
  const look: AtLook = {
    imageFade: {
      readonly: k.n(imgRo['item.opacity'], 'image readonly item.opacity'),
      dragging: k.n(imgDrag['item.opacity'], 'image dragging item.opacity'),
      motion: k.motion(img['item.transitionDuration'], img['item.transitionEasing'], 'image item 흐림'),
    },
    itemPress: { mouse: Number(ds[1]), touch: Number(ds[2]), keys: k.str(b['item.keys'], 'item.keys') },
    menu: {
      preview: k.str(b['itemMenu.preview'], 'itemMenu.preview'),
      open: k.str(fileMenu['itemMenu.preview'], 'file itemMenu.preview'),
      makeCover: k.str(b['itemMenu.makeCover'], 'itemMenu.makeCover'),
      moveEarlier: k.str(b['itemMenu.moveEarlier'], 'itemMenu.moveEarlier'),
      moveLater: k.str(b['itemMenu.moveLater'], 'itemMenu.moveLater'),
      remove: k.str(b['itemMenu.remove'], 'itemMenu.remove'),
      title: k.str(b['itemMenu.title'], 'itemMenu.title'),
    },
    root: { gap: k.len(b['root.gap'], 'root.gap') },
    items: { gap: k.len(b['items.gap'], 'items.gap'), padTop: k.len(b['items.paddingTop'], 'items.paddingTop'), bleed, fog: fogDepth },
    trigger,
    count: { text: k.type(b['count.typography'], b['count.fontWeight'], 'count.typography'), color: k.color(b['count.foreground'], 'count.foreground'), max: k.color(b['countMax.foreground'], 'countMax.foreground') },
    disabled,
    item,
    thumb,
    meta: { width: metaW },
    name,
    size,
    circle,
    progress: { size: pcSize, image: 'staticWhite', file: 'neutral' },
    dim: { uploading: dimOf(F, imgUp['backdrop.background'], 'image uploading backdrop.background'), error: fixedDim(F, imgErr['backdrop.background'], 'image error backdrop.background') },
    action: {
      gap: k.len(b['actionButton.gap'], 'actionButton.gap'),
      icon: k.len(b['actionButton.iconSize'], 'actionButton.iconSize'),
      text: k.type(b['actionButton.typography'], b['actionButton.fontWeight'], 'actionButton.typography'),
      imageColor: k.color(imgErr['actionButton.color'], 'image error actionButton.color'),
      fileColor: k.color(fileErr['actionButton.color'], 'file error actionButton.color'),
      label: k.str(b['actionButton.label'], 'actionButton.label'),
    },
    badge: {
      h: k.len(b['badge.height'], 'badge.height'),
      padX: k.len(b['badge.paddingX'], 'badge.paddingX'),
      radius: k.str(b['badge.radius'], 'badge.radius'),
      bg: fixedDim(F, b['badge.background'], 'badge.background'),
      text: k.type(b['badge.typography'], b['badge.fontWeight'], 'badge.typography'),
      fg: k.color(b['badge.foreground'], 'badge.foreground'),
      label: k.str(b['badge.label'], 'badge.label'),
    },
    remove,
    mask,
    dropzone: {
      h: k.len(dz['dropzone.height'], 'dropzone.height'),
      gap: k.len(dz['dropzone.gap'], 'dropzone.gap'),
      padX: k.len(dz['dropzone.paddingX'], 'dropzone.paddingX'),
      radius: k.len(dz['dropzone.radius'], 'dropzone.radius'),
      borderW: k.len(dz['dropzone.borderWidth'], 'dropzone.borderWidth'),
      border: k.color(dz['dropzone.borderColor'], 'dropzone.borderColor'),
      dragBorder: k.color(dzDrag['dropzone.borderColor'], 'dragOver dropzone.borderColor'),
      dragBg: k.color(dzDrag['dropzone.background'], 'dragOver dropzone.background'),
      disabledBorder: k.color(dzDis['dropzone.borderColor'], 'disabled dropzone.borderColor'),
      label: k.type(dz['dropzoneLabel.typography'], dz['dropzoneLabel.fontWeight'], 'dropzoneLabel.typography'),
      labelColor: k.color(dz['dropzoneLabel.foreground'], 'dropzoneLabel.foreground'),
      text: k.str(dz['dropzoneLabel.text'], 'dropzoneLabel.text'),
    },
    pick: { wide: pickWide, narrow: pickNarrow, label: k.str(dz['pickButton.label'], 'pickButton.label') },
    ring: k.ring(fo, 'focused'),
    press: k.press(pr['trigger.scale'], pr['trigger.scaleDuration'], pr['trigger.scaleEasing'], 'pressed trigger.scale'),
    color: k.motion(b['trigger.transitionDuration'], b['trigger.transitionEasing'], 'trigger 바탕'),
    breakpoint: bp,
    fogLook: fog,
    surface: surfaces(brand),
  };
  k.same(k.str(dz['dropzone.borderStyle'], 'dropzone.borderStyle'), 'solid', 'dropzone.borderStyle(실선 — 5A)');
  k.same(k.str(narrow['pickButton.label'], 'narrow pickButton.label'), look.pick.label, 'narrow pickButton.label');
  atCache.set(brand, look);
  return look;
}

// ── Footer ────────────────────────────────────────────────
let ftCache: FtLook | undefined;
export function ftLook(): FtLook {
  if (ftCache) return ftCache;
  const F = 'footer.yaml';
  const brand: Brand = 'desk';
  const k = kit(F, brand);
  const spec = loadComponentSpec('footer');
  sameSet(F, stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed'], 'states');
  sameSet(F, axisValues(spec, 'width'), ['wide', 'narrow'], 'width');
  sameSet(F, axisValues(spec, 'linkSize'), ['medium', 'large'], 'linkSize');
  const b = resolveState(spec, {}, 'enabled');
  const fo = resolveState(spec, {}, 'focused');
  const wide = resolveState(spec, { width: 'wide' }, 'enabled');
  const narrow = resolveState(spec, { width: 'narrow' }, 'enabled');
  const link = (size: 'large' | 'medium'): FtLinkLook => {
    const v = resolveState(spec, { linkSize: size }, 'enabled');
    const h = resolveState(spec, { linkSize: size }, 'hovered');
    const p = resolveState(spec, { linkSize: size }, 'pressed');
    k.same(k.str(p['link.foreground'], `${size} pressed link.foreground`), k.str(h['link.foreground'], `${size} hovered link.foreground`), `${size} pressed link.foreground(올림과 같다)`);
    return { text: k.type(v['link.typography'], v['link.fontWeight'], `${size} link.typography`), color: k.color(v['link.foreground'], `${size} link.foreground`), hover: k.color(h['link.foreground'], `${size} hovered link.foreground`), icon: k.len(v['linkIcon.size'], `${size} linkIcon.size`) };
  };
  const maxW = (() => {
    const v = k.str(b['root.maxWidth'], 'root.maxWidth');
    const m = /^\$(layout-[a-z0-9-]+)$/.exec(v);
    if (!m) throw new Error(`${F} 의 root.maxWidth(${v})가 layout 토큰이 아니다`);
    return k.must(num(proseValue(m[1])), `root.maxWidth(${m[1]})`);
  })();
  const flex = /^1 1 (\d+)px$/.exec(k.str(b['brand.flex'], 'brand.flex'));
  if (!flex) throw new Error(`${F} 의 brand.flex 가 "1 1 Npx" 가 아니다`);
  const wideDesc = String((spec.variants.width as Record<string, string>).wide);
  const bp = Number(/^(\d+) 이상/.exec(wideDesc)?.[1]);
  if (!bp) throw new Error(`${F} 의 width.wide 설명(${wideDesc})이 "N 이상" 이 아니다`);
  const social = /^Button (\w+) · (\w+) · iconOnly$/.exec(k.str(b['social.button'], 'social.button'));
  if (!social) throw new Error(`${F} 의 social.button 이 "Button 변형 · 크기 · iconOnly" 가 아니다`);
  k.same(k.str(b['link.textDecoration'], 'link.textDecoration'), 'none', 'link.textDecoration(밑줄 없음)');
  const look: FtLook = {
    root: { maxW, padY: k.len(b['root.paddingY'], 'root.paddingY'), padXWide: k.len(wide['root.paddingX'], 'wide root.paddingX'), padXNarrow: k.len(narrow['root.paddingX'], 'narrow root.paddingX'), gap: k.len(b['root.gap'], 'root.gap') },
    topLine: { h: k.len(b['topLine.height'], 'topLine.height'), color: k.color(b['topLine.background'], 'topLine.background') },
    nav: { gap: k.len(b['navigation.gap'], 'navigation.gap') },
    brand: { basis: Number(flex[1]), minW: k.len(b['brand.minWidth'], 'brand.minWidth'), gap: k.len(b['brand.gap'], 'brand.gap') },
    brandName: { text: k.type(b['brandName.typography'], b['brandName.fontWeight'], 'brandName.typography'), color: k.color(b['brandName.foreground'], 'brandName.foreground') },
    brandIntro: { text: k.type(b['brandIntro.typography'], b['brandIntro.fontWeight'], 'brandIntro.typography'), color: k.color(b['brandIntro.foreground'], 'brandIntro.foreground'), maxW: k.len(b['brandIntro.maxWidth'], 'brandIntro.maxWidth') },
    sitemap: { gap: k.len(b['sitemap.gap'], 'sitemap.gap'), name: k.str(b['sitemap.name'], 'sitemap.name') },
    column: { minW: k.len(b['column.minWidth'], 'column.minWidth'), gap: k.len(b['column.gap'], 'column.gap') },
    columnTitle: { text: k.type(b['columnTitle.typography'], b['columnTitle.fontWeight'], 'columnTitle.typography'), color: k.color(b['columnTitle.foreground'], 'columnTitle.foreground') },
    columnLinks: { gap: k.len(b['columnLinks.gap'], 'columnLinks.gap') },
    divider: { h: k.len(b['divider.height'], 'divider.height'), color: k.color(b['divider.background'], 'divider.background') },
    info: { gap: k.len(b['info.gap'], 'info.gap') },
    policy: { colGap: k.len(b['policy.columnGap'], 'policy.columnGap'), rowGap: k.len(b['policy.rowGap'], 'policy.rowGap') },
    infoText: { text: k.type(b['infoText.typography'], b['infoText.fontWeight'], 'infoText.typography'), color: k.color(b['infoText.foreground'], 'infoText.foreground'), sep: String(unbox(b['infoText.separator'])) },
    bottom: { gap: k.len(b['bottom.gap'], 'bottom.gap') },
    copyright: { text: k.type(b['copyright.typography'], b['copyright.fontWeight'], 'copyright.typography'), color: k.color(b['copyright.foreground'], 'copyright.foreground'), format: k.str(b['copyright.text'], 'copyright.text') },
    social: { gap: k.len(b['social.gap'], 'social.gap'), button: buttonLook({ variant: social[1], size: social[2], layout: 'iconOnly' }, 'desk') },
    link: { gap: k.len(b['link.gap'], 'link.gap'), large: link('large'), medium: link('medium') },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: k.color(fo['focusRing.color'], 'focusRing.color'), radius: k.len(fo['focusRing.radius'], 'focusRing.radius') },
    color: k.motion(b['link.transitionDuration'], b['link.transitionEasing'], 'link 글자색'),
    breakpoint: bp,
    surface: named('bg-layer-default', brand),
  };
  if (!look.copyright.format.includes('{해}')) throw new Error(`${F} 의 copyright.text(${look.copyright.format})에 {해} 가 없다`);
  ftCache = look;
  return look;
}

// ── Avatar — 사진 바꾸기 자리(edit photo) ──────────────────
const avCache = new Map<Brand, AvEditLook>();
export function avEditLook(brand: Brand = 'hr'): AvEditLook {
  const hit = avCache.get(brand);
  if (hit) return hit;
  const F = 'avatar.yaml';
  const k = kit(F, brand);
  const spec = loadComponentSpec('avatar');
  sameSet(F, axisValues(spec, 'edit'), ['none', 'photo'], 'edit');
  const v = resolveState(spec, { edit: 'photo' }, 'enabled');
  const up = resolveState(spec, { edit: 'photo' }, 'uploading');
  // "Button neutralWeak · small — \"사진 바꾸기\"" — 변형 · 크기 · 글
  const btn = (raw: unknown, what: string) => {
    const m = /^Button (\w+) · (\w+) — "([^"]+)"$/.exec(k.str(raw, what));
    if (!m) throw new Error(`${F} 의 ${what} 이 'Button 변형 · 크기 — "글"' 이 아니다`);
    return { look: buttonLook({ variant: m[1], size: m[2] }, brand === 'shared' ? 'desk' : brand), label: m[3] };
  };
  const prog = /^Progress Circle (\d+) · (\w+) · determinate$/.exec(k.str(up['uploadOverlay.progress'], 'uploading uploadOverlay.progress'));
  if (!prog) throw new Error(`${F} 의 uploadOverlay.progress 가 'Progress Circle N · 톤 · determinate' 가 아니다`);
  k.same(prog[2], 'staticWhite', 'uploadOverlay.progress 톤');
  const name = /이름 "([^"]+)"/.exec(String((up['uploadOverlay.progress'] as { note?: string }).note ?? ''))?.[1] ?? '';
  k.same(k.str(up['editActions.disabled'], 'uploading editActions.disabled'), 'true', 'uploading editActions.disabled');
  const look: AvEditLook = {
    marginTop: k.len(v['editActions.marginTop'], 'editActions.marginTop'),
    gap: k.len(v['editActions.gap'], 'editActions.gap'),
    change: btn(v['editActions.change'], 'editActions.change'),
    remove: btn(v['editActions.remove'], 'editActions.remove'),
    dim: dimOf(F, up['uploadOverlay.background'], 'uploading uploadOverlay.background'),
    circle: loadingKit(brand === 'shared' ? 'desk' : brand).circle,
    progress: Number(prog[1]),
    progressName: name,
  };
  avCache.set(brand, look);
  return look;
}
export type { QpSize };
