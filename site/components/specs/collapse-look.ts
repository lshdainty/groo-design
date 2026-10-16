// 펼치고 접기 · 나누기 묶음의 모양 — specs/components/accordion · collapsible · tree-view · resizable · scroll-area · scroll-auto-hide.yaml 과
// list.yaml 의 하위 줄(nest · expanded)을 풀어 둔다(서버, 빌드 때). 그림(collapse-view · collapse-tree · collapse-split · collapse-scroll …)은
// 이 값만 받아 그린다 — 치수 · 색 · 글은 그림에 따로 적지 않는다. 수치는 YAML 의 속성 값에서만 읽는다(비고 note 는 읽지 않는다).
// 값끼리 맞물리는 자리(트리거 54 = 위아래 + 제목 줄 …)는 여기서 견주고, 어긋나면 빌드를 멈춘다.
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { pressScale, proseValue, reducedMotion, type Brand } from '@/lib/design-tokens';
import { BODY_W } from './collapse-data';
import { named } from './input-look';
import { listLook } from './list-look';
import type { AccLook, AutoHideLook, ColLook, IColor, IMotion, IPress, IType, NestLook, ScrollAreaLook, SplitLook, Tones, TreeLook, TriggerLook, WidgetLook } from './collapse-shared';
export * from './collapse-shared';

type Raw = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);

function kit(F: string) {
  const must = <T,>(v: T | undefined, what: string): T => {
    if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${F} 에 ${what} 이 없다`);
    return v;
  };
  // 길이 — 토큰($spacing-x4 …)이나 'Npx'
  const len = (raw: unknown, what: string) => {
    const v = String(tokenValue(unbox(must(raw, what)) as string)).replace('−', '-');
    if (v === '0') return 0;
    return must(num(v), what);
  };
  const str = (raw: unknown, what: string) => String(unbox(must(raw, what))).trim();
  // 단위 없는 수 · 'N%' · 'Ndeg'
  const n = (raw: unknown, what: string, unit = '') => {
    const t = str(raw, what);
    const m = new RegExp(`^(-?\\d+(?:\\.\\d+)?)${unit}$`).exec(t);
    if (!m) throw new Error(`${F} 의 ${what}(${t})이 수${unit ? `(${unit})` : ''}가 아니다`);
    return Number(m[1]);
  };
  const tok = (raw: unknown, brand: Brand, what: string): IColor => {
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
  const motion = (d: unknown, e: unknown, what: string): IMotion => ({ duration: String(tokenValue(unbox(must(d, `${what} 시간`)) as string)), easing: String(tokenValue(unbox(must(e, `${what} 곡선`)) as string)) });
  const block = (name: string, key: string) => {
    const m = (loadComponentSpec(name) as unknown as { motion?: Record<string, { duration?: unknown; easing?: unknown; properties?: string[] }> }).motion?.[key];
    if (!m) throw new Error(`${F} 의 motion 에 "${key}" 이 없다`);
    return m;
  };
  const blockMotion = (name: string, key: string) => {
    const m = block(name, key);
    return motion(m.duration, m.easing, `motion "${key}"`);
  };
  // "2px 거리 축소" — Feedback 의 눌림 피드백 축소량과 같아야 한다(값 칸의 글)
  const press = (raw: unknown, mo: IMotion, what: string): IPress => {
    const t = str(raw, what);
    const m = /^(\d+)px 거리 축소$/.exec(t);
    if (!m) throw new Error(`${F} 의 ${what}(${t})이 "Npx 거리 축소" 가 아니다`);
    const ps = pressScale();
    if (Number(m[1]) !== ps.distance) throw new Error(`${F} 의 ${what} ${m[1]}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
    return { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis, motion: mo };
  };
  // "N × M" — 누르는 영역
  const box = (raw: unknown, what: string) => {
    const t = str(raw, what);
    const m = /^(\d+) × (\d+)$/.exec(t);
    if (!m) throw new Error(`${F} 의 ${what}(${t})이 "N × M" 이 아니다`);
    return { w: Number(m[1]), h: Number(m[2]) };
  };
  const same = (a: unknown, b: unknown, what: string) => {
    if (a !== b) throw new Error(`${F} 의 ${what} — ${String(a)} 와 ${String(b)} 가 다르다`);
  };
  const sameSet = (got: string[], want: readonly string[], what: string) => {
    if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${F} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — collapse-shared.ts 를 고친다`);
  };
  return { must, len, str, n, tok, type, motion, block, blockMotion, press, box, same, sameSet };
}
const surfaces = (brand: Brand) => ({ default: named('bg-layer-default', brand), floating: named('bg-layer-floating', brand), basement: named('bg-layer-basement', brand) });

// ── 트리거(Accordion · Collapsible 공통) ─────────────────────
function triggerOf(F: string, name: 'accordion' | 'collapsible', brand: Brand, k: ReturnType<typeof kit>): TriggerLook {
  const spec = loadComponentSpec(name);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  const desc = resolveState(spec, { description: 'shown' }, 'enabled');
  const open = resolveState(spec, { open: 'expanded' }, 'enabled');
  const hasPrefix = name === 'accordion';
  const { same } = k;
  // 접힘 · 펼침 — 그림은 접히면 그리지 않고(hidden) 펼치면 보인다
  same(k.str(b['panel.display'], 'panel.display'), '숨김', 'panel.display(접힘) — 그림은 접히면 내용을 그리지 않는다');
  same(k.str(open['panel.display'], 'expanded panel.display'), '보임', 'expanded panel.display');
  same(k.str(b['panel.maxHeight'], 'panel.maxHeight'), 'none', 'panel.maxHeight — 그림은 패널 안에 스크롤 상자를 두지 않는다');
  same(k.str(b['title.lineClamp'], 'title.lineClamp'), 'none', 'title.lineClamp — 그림은 제목을 자르지 않는다');
  same(k.str(b['description.lineClamp'], 'description.lineClamp'), 'none', 'description.lineClamp');
  same(k.str(b['background.background'], 'background.background'), 'transparent', 'background.background(기본)');
  same(k.str(hov['background.background'], 'hovered background.background'), k.str(pr['background.background'], 'pressed background.background'), '호버 · 누름 바탕(같은 색 — v106)');
  same(k.len(hov['background.insetX'], 'hovered background.insetX'), k.len(pr['background.insetX'], 'pressed background.insetX'), '호버 · 누름 바탕 들임');
  same(k.str(b['chevron.rotate'], 'chevron.rotate'), '0deg', 'chevron.rotate(접힘)');
  const heading = /^h([2-6])$/.exec(k.str(b['heading.level'], 'heading.level'));
  if (!heading) throw new Error(`${F} 의 heading.level 이 h2 ~ h6 이 아니다`);
  const look: TriggerLook = {
    minH: k.len(b['trigger.minHeight'], 'trigger.minHeight'),
    minHDesc: k.len(desc['trigger.minHeight'], 'shown trigger.minHeight'),
    padY: k.len(b['trigger.paddingY'], 'trigger.paddingY'),
    padX: k.len(b['trigger.paddingX'], 'trigger.paddingX'),
    cursor: k.str(b['trigger.cursor'], 'trigger.cursor'),
    disabledCursor: k.str(di['trigger.cursor'], 'disabled trigger.cursor'),
    bg: {
      insetX: k.len(hov['background.insetX'], 'hovered background.insetX'),
      radius: k.len(hov['background.radius'], 'hovered background.radius'),
      color: k.tok(hov['background.background'], brand, 'hovered background.background'),
      motion: k.motion(b['background.transitionDuration'], b['background.transitionEasing'], 'background.transition'),
    },
    content: { gap: k.len(b['content.gap'], 'content.gap'), press: k.press(pr['content.scale'], k.motion(b['content.transitionDuration'], b['content.transitionEasing'], 'content.transition'), 'pressed content.scale') },
    prefixIcon: hasPrefix
      ? { size: k.len(b['prefixIcon.size'], 'prefixIcon.size'), color: k.tok(b['prefixIcon.color'], brand, 'prefixIcon.color'), disabled: k.tok(di['prefixIcon.color'], brand, 'disabled prefixIcon.color') }
      : { size: 0, color: named('fg-neutral', brand), disabled: named('fg-disabled', brand) },
    body: { gap: k.len(b['body.gap'], 'body.gap') },
    title: { ...k.type(b['title.typography'], b['title.fontWeight'], 'title.typography'), fg: k.tok(b['title.foreground'], brand, 'title.foreground'), disabled: k.tok(di['title.foreground'], brand, 'disabled title.foreground') },
    description: { ...k.type(b['description.typography'], b['description.fontWeight'], 'description.typography'), fg: k.tok(b['description.foreground'], brand, 'description.foreground'), disabled: k.tok(di['description.foreground'], brand, 'disabled description.foreground') },
    chevron: {
      size: k.len(b['chevron.size'], 'chevron.size'),
      color: k.tok(b['chevron.color'], brand, 'chevron.color'),
      disabled: k.tok(di['chevron.color'], brand, 'disabled chevron.color'),
      openRotate: k.n(open['chevron.rotate'], 'expanded chevron.rotate', 'deg'),
      motion: k.motion(b['chevron.transitionDuration'], b['chevron.transitionEasing'], 'chevron.transition'),
    },
    panel: { padTop: k.len(b['panel.paddingTop'], 'panel.paddingTop'), padX: k.len(b['panel.paddingX'], 'panel.paddingX'), padBottom: k.len(b['panel.paddingBottom'], 'panel.paddingBottom') },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: k.tok(fo['focusRing.color'], brand, 'focusRing.color'), radius: k.len(fo['focusRing.radius'], 'focusRing.radius') },
    heading: Number(heading[1]),
    motion: { height: k.blockMotion(name, '펼침 · 접힘 — 높이'), reduced: k.blockMotion(name, '모션 줄이기 — 펼침 · 접힘') },
  };
  // 트리거 높이 = 위아래 + 제목 줄(+ 사이 + 설명 줄)
  same(look.minH, look.padY * 2 + parseFloat(look.title.lineHeight), 'trigger.minHeight = 위아래 + 제목 줄');
  same(look.minHDesc, look.padY * 2 + parseFloat(look.title.lineHeight) + look.body.gap + parseFloat(look.description.lineHeight), 'shown trigger.minHeight = 위아래 + 제목 + 사이 + 설명');
  // 꺾쇠 회전 · 높이는 같은 시간(사용자 결정 3A)
  const ch = k.blockMotion(name, '꺾쇠 — 회전');
  same(ch.duration, look.motion.height.duration, '꺾쇠 회전 · 높이 펼침 시간');
  same(look.chevron.motion.duration, ch.duration, 'chevron.transitionDuration · motion "꺾쇠 — 회전"');
  // 모션 줄이기의 서서히 — DESIGN.md 모션 줄이기 모드 표(150ms)와 같아야 한다
  same(parseFloat(look.motion.reduced.duration), reducedMotion().fade, '모션 줄이기 시간 — DESIGN.md 모션 줄이기 모드');
  return look;
}

// ── Accordion ─────────────────────────────────────────────
const accCache = new Map<Brand, AccLook>();
export function accordionLook(brand: Brand = 'desk'): AccLook {
  const hit = accCache.get(brand);
  if (hit) return hit;
  const F = 'accordion.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('accordion');
  k.sameSet(stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed', 'disabled'], 'states');
  k.sameSet(axisValues(spec, 'variant'), ['inline', 'separated'], 'variant');
  k.sameSet(axisValues(spec, 'open'), ['collapsed', 'expanded'], 'open');
  k.sameSet(axisValues(spec, 'description'), ['none', 'shown'], 'description');
  k.sameSet(axisValues(spec, 'detail'), ['expandable', 'none'], 'detail');
  const trig = triggerOf(F, 'accordion', brand, k);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const inl = resolveState(spec, { variant: 'inline' }, 'enabled');
  const sep = resolveState(spec, { variant: 'separated' }, 'enabled');
  const sepFo = resolveState(spec, { variant: 'separated' }, 'focused');
  const none = resolveState(spec, { detail: 'none' }, 'enabled');
  const noneHov = resolveState(spec, { detail: 'none' }, 'hovered');
  // 상세 없는 항목 — 꺾쇠 없음 · 머리말 없음 · 바탕 없음
  k.same(k.str(none['chevron.display'], 'detail none chevron.display'), 'none', '상세 없는 항목의 꺾쇠(그림은 그리지 않는다)');
  k.same(k.str(noneHov['background.background'], 'detail none hovered background.background'), 'transparent', '상세 없는 항목의 호버 바탕');
  k.same(k.len(b['root.gap'], 'root.gap'), 0, 'inline 항목 사이(0 — 선이 가른다)');
  k.same(k.str(sep['item.shadow'], 'separated item.shadow'), 'none', 'separated 그림자');
  const [expand, collapse] = k.str(b['expandAll.label'], 'expandAll.label').split(' · ').map((s) => s.trim());
  if (!expand || !collapse) throw new Error(`${F} 의 expandAll.label 이 "펼치기 · 접기" 두 글이 아니다`);
  const touch = k.box(b['expandAll.touchTarget'], 'expandAll.touchTarget');
  const fo = resolveState(spec, {}, 'focused');
  const look: AccLook = {
    ...trig,
    panelText: { ...k.type(b['panelText.typography'], b['panelText.fontWeight'], 'panelText.typography'), fg: k.tok(b['panelText.foreground'], brand, 'panelText.foreground') },
    divider: { height: k.len(inl['divider.height'], 'inline divider.height'), color: k.tok(inl['divider.background'], brand, 'inline divider.background'), marginX: k.len(inl['divider.marginX'], 'inline divider.marginX') },
    separated: {
      gap: k.len(sep['root.gap'], 'separated root.gap'),
      borderW: k.len(sep['item.borderWidth'], 'separated item.borderWidth'),
      border: k.tok(sep['item.borderColor'], brand, 'separated item.borderColor'),
      radius: k.len(sep['item.radius'], 'separated item.radius'),
      ringRadius: k.len(sepFo['focusRing.radius'], 'separated focusRing.radius'),
    },
    header: {
      minH: k.len(b['header.minHeight'], 'header.minHeight'),
      gap: k.len(b['header.gap'], 'header.gap'),
      marginBottom: k.len(b['header.marginBottom'], 'header.marginBottom'),
      title: { ...k.type(b['headerTitle.typography'], b['headerTitle.fontWeight'], 'headerTitle.typography'), fg: k.tok(b['headerTitle.foreground'], brand, 'headerTitle.foreground') },
    },
    expandAll: {
      h: k.len(b['expandAll.height'], 'expandAll.height'),
      padL: k.len(b['expandAll.paddingLeft'], 'expandAll.paddingLeft'),
      padR: k.len(b['expandAll.paddingRight'], 'expandAll.paddingRight'),
      radius: k.len(b['expandAll.radius'], 'expandAll.radius'),
      type: k.type(b['expandAll.typography'], b['expandAll.fontWeight'], 'expandAll.typography'),
      fg: k.tok(b['expandAll.foreground'], brand, 'expandAll.foreground'),
      touch: touch.h,
      bg: k.tok(hov['expandAll.background'], brand, 'hovered expandAll.background'),
      press: k.press(pr['expandAll.scale'], k.blockMotion('accordion', '누름 — 콘텐츠'), 'pressed expandAll.scale'),
      motion: k.motion(b['expandAll.transitionDuration'], b['expandAll.transitionEasing'], 'expandAll.transition'),
      labels: { expand, collapse },
      // 모두 펼치기의 키보드 링 — focused expandAll(단추 바깥)
      ring: { width: k.len(fo['expandAll.outlineWidth'], 'focused expandAll.outlineWidth'), offset: k.len(fo['expandAll.outlineOffset'], 'focused expandAll.outlineOffset'), color: k.tok(fo['expandAll.outlineColor'], brand, 'focused expandAll.outlineColor') },
    },
    surfaces: surfaces(brand),
  };
  k.same(touch.w, touch.h, 'expandAll.touchTarget 의 높이(그림은 보이는 상자 위아래로 늘린다)');
  // 목록 머리 높이 = 모두 펼치기의 보이는 상자
  k.same(look.header.minH, look.expandAll.h, '목록 머리 높이 · 모두 펼치기 높이');
  // separated 의 누름 바탕은 면 모서리와 동심 — 16 − 6 = 10
  k.same(look.bg.radius, look.separated.radius - look.bg.insetX, '누름 바탕 모서리 — separated 면 모서리 − 들임');
  accCache.set(brand, look);
  return look;
}

// ── Collapsible ───────────────────────────────────────────
const colCache = new Map<Brand, ColLook>();
export function collapsibleLook(brand: Brand = 'desk'): ColLook {
  const hit = colCache.get(brand);
  if (hit) return hit;
  const F = 'collapsible.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('collapsible');
  k.sameSet(stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed', 'disabled'], 'states');
  k.sameSet(axisValues(spec, 'open'), ['collapsed', 'expanded'], 'open');
  k.sameSet(axisValues(spec, 'description'), ['none', 'shown'], 'description');
  k.sameSet(axisValues(spec, 'layout'), ['text', 'rows'], 'layout');
  k.sameSet(axisValues(spec, 'surface'), ['default', 'card', 'warning'], 'surface');
  const trig = triggerOf(F, 'collapsible', brand, k);
  const rows = resolveState(spec, { layout: 'rows' }, 'enabled');
  const card = resolveState(spec, { surface: 'card' }, 'enabled');
  const cardFo = resolveState(spec, { surface: 'card' }, 'focused');
  const warn = resolveState(spec, { surface: 'warning' }, 'enabled');
  const warnHov = resolveState(spec, { surface: 'warning' }, 'hovered');
  const warnPr = resolveState(spec, { surface: 'warning' }, 'pressed');
  const warnFo = resolveState(spec, { surface: 'warning' }, 'focused');
  k.same(k.str(warnHov['background.background'], 'warning hovered background.background'), k.str(warnPr['background.background'], 'warning pressed background.background'), '경고 상자 호버 · 누름 바탕');
  k.same(k.str(card['root.overflow'], 'card root.overflow'), 'hidden', '카드 면 넘침');
  k.same(k.str(warn['box.overflow'], 'warning box.overflow'), 'hidden', '경고 상자 넘침');
  const look: ColLook = {
    ...trig,
    rowsPadBottom: k.len(rows['panel.paddingBottom'], 'rows panel.paddingBottom'),
    card: {
      bg: k.tok(card['root.background'], brand, 'card root.background'),
      borderW: k.len(card['root.borderWidth'], 'card root.borderWidth'),
      border: k.tok(card['root.borderColor'], brand, 'card root.borderColor'),
      radius: k.len(card['root.radius'], 'card root.radius'),
      panelPadBottom: k.len(card['panel.paddingBottom'], 'card panel.paddingBottom'),
      ringRadius: k.len(cardFo['focusRing.radius'], 'card focusRing.radius'),
    },
    warning: {
      box: {
        bg: k.tok(warn['box.background'], brand, 'warning box.background'),
        borderW: k.len(warn['box.borderWidth'], 'warning box.borderWidth'),
        border: k.tok(warn['box.borderColor'], brand, 'warning box.borderColor'),
        radius: k.len(warn['box.radius'], 'warning box.radius'),
        padTop: k.len(warn['box.paddingTop'], 'warning box.paddingTop'),
        padX: k.len(warn['box.paddingX'], 'warning box.paddingX'),
        padBottom: k.len(warn['box.paddingBottom'], 'warning box.paddingBottom'),
      },
      padX: k.len(warn['trigger.paddingX'], 'warning trigger.paddingX'),
      divider: { height: k.len(warn['divider.height'], 'warning divider.height'), color: k.tok(warn['divider.background'], brand, 'warning divider.background') },
      pressBg: k.tok(warnHov['background.background'], brand, 'warning hovered background.background'),
      ringRadius: k.len(warnFo['focusRing.radius'], 'warning focusRing.radius'),
    },
    surfaces: surfaces(brand),
  };
  // 경고 상자 — 트리거 · 펼친 내용의 좌우는 상자 글의 좌우와 같다
  k.same(k.len(warn['panel.paddingX'], 'warning panel.paddingX'), look.warning.padX, '경고 상자 펼친 내용 좌우 · 트리거 좌우');
  k.same(look.warning.box.padX, look.warning.padX, '경고 상자 글 좌우 · 트리거 좌우');
  // 카드 면 · 경고 상자의 링 모서리는 면 모서리 − 링 들임(동심)
  k.same(look.card.ringRadius, look.card.radius + look.ring.offset, '카드 면 링 모서리 — 면 16 − 링 들임 2');
  k.same(look.warning.ringRadius, look.warning.box.radius + look.ring.offset, '경고 상자 링 모서리 — 상자 12 − 링 들임 2');
  // 트리거 · 꺾쇠 · 글은 Accordion 과 같다
  const acc = accordionLook(brand);
  for (const [a, b2, what] of [
    [trig.minH, acc.minH, '트리거 높이'],
    [trig.padX, acc.padX, '트리거 좌우'],
    [trig.chevron.size, acc.chevron.size, '꺾쇠'],
    [trig.title.fontSize, acc.title.fontSize, '이름 글자'],
    [trig.motion.height.duration, acc.motion.height.duration, '펼침 시간'],
  ] as const)
    k.same(a, b2, `${what} — accordion.yaml 과 같아야 한다`);
  colCache.set(brand, look);
  return look;
}

// ── Tree View ─────────────────────────────────────────────
const treeCache = new Map<Brand, TreeLook>();
// HR 관리 > 회사 의 부서 패널 폭 — 1280 본문(BODY_W — Resizable 그림과 같은 상수) × 목록 기본 폭(resizable.yaml panel.width 25%) = 248
export const deptPanelW = () => Math.round((BODY_W * splitLook().panel.def) / 100);

export function treeLook(brand: Brand = 'hr'): TreeLook {
  const hit = treeCache.get(brand);
  if (hit) return hit;
  const F = 'tree-view.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('tree-view');
  k.sameSet(stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed'], 'states');
  k.sameSet(axisValues(spec, 'selected'), ['none', 'selected'], 'selected');
  k.sameSet(axisValues(spec, 'expand'), ['collapsed', 'expanded', 'leaf'], 'expand');
  k.sameSet(axisValues(spec, 'mode'), ['foldable', 'fixed'], 'mode');
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const sel = resolveState(spec, { selected: 'selected' }, 'enabled');
  const selHov = resolveState(spec, { selected: 'selected' }, 'hovered');
  const selPr = resolveState(spec, { selected: 'selected' }, 'pressed');
  const open = resolveState(spec, { expand: 'expanded' }, 'enabled');
  const leaf = resolveState(spec, { expand: 'leaf' }, 'enabled');
  const fixed = resolveState(spec, { mode: 'fixed' }, 'enabled');
  k.same(k.str(b['group.display'], 'group.display'), '숨김', 'group.display(접힘)');
  k.same(k.str(open['group.display'], 'expanded group.display'), '보임', 'expanded group.display');
  k.same(k.str(fixed['group.display'], 'fixed group.display'), '보임', 'fixed group.display');
  k.same(k.str(fixed['chevron.display'], 'fixed chevron.display'), 'none', 'fixed chevron.display(꺾쇠를 그리지 않는다)');
  k.same(k.len(fixed['chevron.width'], 'fixed chevron.width'), 0, 'fixed chevron.width(칸도 뺀다)');
  k.same(k.str(leaf['chevron.display'], 'leaf chevron.display'), '빈 자리', 'leaf chevron.display(같은 폭의 빈 자리)');
  k.same(k.str(b['label.lineClamp'], 'label.lineClamp'), 'none', 'label.lineClamp — 그림은 이름을 자르지 않는다');
  // 고른 항목은 올리거나 눌러도 바탕 그대로
  k.same(k.str(selHov['row.background'], 'selected hovered row.background'), k.str(sel['row.background'], 'selected row.background'), '고른 항목 호버 바탕');
  k.same(k.str(selPr['row.background'], 'selected pressed row.background'), k.str(sel['row.background'], 'selected row.background'), '고른 항목 누름 바탕');
  const padL = k.len(b['row.paddingLeft'], 'row.paddingLeft');
  const chW = k.len(b['chevron.width'], 'chevron.width');
  const gap = k.len(b['content.gap'], 'content.gap');
  const rowH = k.len(b['row.minHeight'], 'row.minHeight');
  // 누르는 자리는 줄 전체다 — 꺾쇠는 표시만(사용자 결정 16D)
  k.same(k.str(b['chevron.touchTarget'], 'chevron.touchTarget'), '없음', 'chevron.touchTarget(꺾쇠는 표시만)');
  const collapsed = resolveState(spec, { expand: 'collapsed' }, 'enabled');
  const look: TreeLook = {
    root: { padX: k.len(b['root.paddingX'], 'root.paddingX'), padBottom: k.len(b['root.paddingBottom'], 'root.paddingBottom') },
    row: {
      minH: rowH,
      padY: k.len(b['row.paddingY'], 'row.paddingY'),
      padL,
      padR: k.len(b['row.paddingRight'], 'row.paddingRight'),
      indent: k.len(b['row.indent'], 'row.indent'),
      radius: k.len(b['row.radius'], 'row.radius'),
      hoverBg: k.tok(hov['row.background'], brand, 'hovered row.background'),
      pressBg: k.tok(pr['row.background'], brand, 'pressed row.background'),
      selectedBg: k.tok(sel['row.background'], brand, 'selected row.background'),
      motion: k.motion(b['row.transitionDuration'], b['row.transitionEasing'], 'row.transition'),
      cursor: k.str(b['row.cursor'], 'row.cursor'),
      touch: k.str(b['row.touchTarget'], 'row.touchTarget'),
    },
    press: {
      collapsed: k.str(collapsed['row.press'], 'collapsed row.press'),
      expanded: k.str(open['row.press'], 'expanded row.press'),
      leaf: k.str(leaf['row.press'], 'leaf row.press'),
      fixed: k.str(fixed['row.press'], 'fixed row.press'),
    },
    content: { gap, press: k.press(pr['content.scale'], k.motion(b['content.transitionDuration'], b['content.transitionEasing'], 'content.transition'), 'pressed content.scale') },
    chevron: {
      w: chW,
      h: k.len(b['chevron.height'], 'chevron.height'),
      icon: k.len(b['chevron.iconSize'], 'chevron.iconSize'),
      color: k.tok(b['chevron.color'], brand, 'chevron.color'),
      openRotate: k.n(open['chevron.rotate'], 'expanded chevron.rotate', 'deg'),
      motion: k.motion(b['chevron.transitionDuration'], b['chevron.transitionEasing'], 'chevron.transition'),
    },
    icon: { size: k.len(b['icon.size'], 'icon.size'), h: k.len(b['icon.height'], 'icon.height'), color: k.tok(b['icon.color'], brand, 'icon.color') },
    label: { ...k.type(b['label.typography'], b['label.fontWeight'], 'label.typography'), fg: k.tok(b['label.foreground'], brand, 'label.foreground') },
    header: { padTop: k.len(b['header.paddingTop'], 'header.paddingTop'), padRight: k.len(b['header.paddingRight'], 'header.paddingRight'), padBottom: k.len(b['header.paddingBottom'], 'header.paddingBottom'), padLeft: k.len(b['header.paddingLeft'], 'header.paddingLeft'), gap: k.len(b['header.gap'], 'header.gap') },
    title: { ...k.type(b['title.typography'], b['title.fontWeight'], 'title.typography'), fg: k.tok(b['title.foreground'], brand, 'title.foreground') },
    more: { size: k.len(b['moreButton.size'], 'moreButton.size'), icon: k.len(b['moreButton.iconSize'], 'moreButton.iconSize'), touch: k.box(b['moreButton.touchTarget'], 'moreButton.touchTarget').w },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: k.tok(fo['focusRing.color'], brand, 'focusRing.color'), radius: k.len(fo['focusRing.radius'], 'focusRing.radius') },
    motion: { group: k.blockMotion('tree-view', '하위 묶음 — 펼침 · 접힘'), reduced: k.blockMotion('tree-view', '모션 줄이기 — 펼침 · 접힘') },
    surface: named('bg-layer-default', brand),
    border: named('stroke-neutral-weak', brand),
    basement: named('bg-layer-basement', brand),
  };
  // 누르면 — 부모는 고르면서 펴고 접고, 잎 · 늘 펼친 나무는 고르기만(그림 · 동작이 이 넷을 그대로 따른다)
  k.same(look.press.collapsed, '고르며 편다', 'collapsed row.press');
  k.same(look.press.expanded, '고르며 접는다', 'expanded row.press');
  k.same(look.press.leaf, '고른다', 'leaf row.press');
  k.same(look.press.fixed, '고른다', 'fixed row.press');
  // 줄 높이 = 위아래 + 이름 첫 줄 · 꺾쇠 · 아이콘 칸은 이름 첫 줄 높이
  // 줄 높이 ≥ 위아래 + 이름 첫 줄(44 ≥ 12 + 19 + 12 = 43 — 한 줄이면 1 이 아래에 남는다, 보고함)
  if (rowH < look.row.padY * 2 + parseFloat(look.label.lineHeight)) throw new Error(`${F} 의 row.minHeight(${rowH})가 위아래 + 이름 줄보다 작다`);
  k.same(look.chevron.h, parseFloat(look.label.lineHeight), 'chevron.height = 이름 첫 줄');
  k.same(look.icon.h, parseFloat(look.label.lineHeight), 'icon.height = 이름 첫 줄');
  // 패널 머리 제목은 나무 줄의 글과 같은 자리 — 나무 여백 + 줄 왼쪽 여백
  k.same(look.header.padLeft, look.root.padX + padL, 'header.paddingLeft = root.paddingX + row.paddingLeft');
  // 고르기 · 펼치기 모션
  k.same(look.chevron.motion.duration, look.motion.group.duration, '꺾쇠 회전 · 하위 펼침 시간');
  k.same(parseFloat(look.motion.reduced.duration), reducedMotion().fade, '모션 줄이기 시간 — DESIGN.md 모션 줄이기 모드');
  treeCache.set(brand, look);
  return look;
}

// ── Resizable ─────────────────────────────────────────────
let splitCache: SplitLook | undefined;
export function splitLook(): SplitLook {
  if (splitCache) return splitCache;
  const brand: Brand = 'hr';
  const F = 'resizable.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('resizable');
  k.sameSet(stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed'], 'states');
  k.sameSet(axisValues(spec, 'kind'), ['split', 'widget'], 'kind');
  const b = resolveState(spec, { kind: 'split' }, 'enabled');
  const hov = resolveState(spec, { kind: 'split' }, 'hovered');
  const fo = resolveState(spec, { kind: 'split' }, 'focused');
  const pr = resolveState(spec, { kind: 'split' }, 'pressed');
  const bp = /^(\d+)px 이상$/.exec(k.str(b['group.breakpoint'], 'split group.breakpoint'));
  if (!bp) throw new Error(`${F} 의 split group.breakpoint 가 "Npx 이상" 이 아니다`);
  const active = k.str(hov['line.background'], 'hovered line.background');
  k.same(k.str(fo['line.background'], 'focused line.background'), active, '포커스 선 색 · 호버 선 색');
  k.same(k.str(pr['line.background'], 'pressed line.background'), active, '끄는 동안 선 색 · 호버 선 색');
  const look: SplitLook = {
    breakpoint: Number(bp[1]),
    panel: { def: k.n(b['panel.width'], 'panel.width', '%'), min: k.n(b['panel.minWidth'], 'panel.minWidth', '%'), max: k.n(b['panel.maxWidth'], 'panel.maxWidth', '%'), toggle: k.n(b['panel.toggleWidth'], 'panel.toggleWidth', '%') },
    handle: { width: k.len(b['handle.width'], 'handle.width'), step: k.n(b['handle.step'], 'handle.step', '%'), dragStart: k.len(b['handle.dragStart'], 'handle.dragStart'), cursor: k.str(b['handle.cursor'], 'handle.cursor'), name: k.str(b['handle.name'], 'handle.name') },
    line: { width: k.len(b['line.width'], 'line.width'), color: k.tok(b['line.background'], brand, 'line.background'), activeColor: k.tok(hov['line.background'], brand, 'hovered line.background'), motion: k.motion(b['line.transitionDuration'], b['line.transitionEasing'], 'line.transition') },
    grip: { w: k.len(b['grip.width'], 'grip.width'), h: k.len(b['grip.height'], 'grip.height'), radius: k.len(b['grip.radius'], 'grip.radius'), color: k.tok(b['grip.background'], brand, 'grip.background') },
    ring: { width: k.len(fo['focusRing.width'], 'focusRing.width'), offset: k.len(fo['focusRing.offset'], 'focusRing.offset'), color: k.tok(fo['focusRing.color'], brand, 'focusRing.color'), radius: k.len(fo['focusRing.radius'], 'focusRing.radius') },
  };
  // 오른쪽 상세는 100 − 최대 아래로 줄지 않는다 · 기본 ↔ 넓게는 범위 안
  if (!(look.panel.min < look.panel.def && look.panel.def < look.panel.toggle && look.panel.toggle <= look.panel.max)) throw new Error(`${F} 의 목록 폭(최소 ${look.panel.min} · 기본 ${look.panel.def} · 넓게 ${look.panel.toggle} · 최대 ${look.panel.max})이 차례가 아니다`);
  // 손잡이 표시는 선 색이 짙어졌을 때와 같은 색(stroke-neutral-solid)
  k.same(look.grip.color.light, look.line.activeColor.light, '손잡이 표시 색 · 짙어진 선 색');
  splitCache = look;
  return look;
}

let widgetCache: WidgetLook | undefined;
export function widgetLook(): WidgetLook {
  if (widgetCache) return widgetCache;
  const brand: Brand = 'hr';
  const F = 'resizable.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('resizable');
  const b = resolveState(spec, { kind: 'widget' }, 'enabled');
  const pr = resolveState(spec, { kind: 'widget' }, 'pressed');
  const fo = resolveState(spec, { kind: 'widget' }, 'focused');
  k.same(k.str(b['placeholder.display'], 'widget placeholder.display'), '숨김', '자리표시(끄지 않을 때)');
  k.same(k.str(pr['placeholder.display'], 'widget pressed placeholder.display'), '보임', '자리표시(끄는 동안)');
  const sh = /^\$shadow-(s\d)$/.exec(k.str(b['ghost.shadow'], 'widget ghost.shadow'));
  if (!sh) throw new Error(`${F} 의 widget ghost.shadow 가 그림자 토큰이 아니다`);
  const items = k
    .str(b['sizeMenu.items'], 'widget sizeMenu.items')
    .split(' · ')
    .map((t) => {
      const m = /^(.+ — (\d+)칸)$/.exec(t.trim());
      if (!m) throw new Error(`${F} 의 sizeMenu.items 줄(${t})이 "글 — N칸" 이 아니다`);
      return { label: m[1], columns: Number(m[2]) };
    });
  const look: WidgetLook = {
    columns: k.n(b['group.columns'], 'widget group.columns'),
    rowHeight: k.len(b['group.rowHeight'], 'widget group.rowHeight'),
    gap: k.len(b['group.gap'], 'widget group.gap'),
    handle: { size: k.len(b['widgetHandle.size'], 'widgetHandle.size'), cursor: k.str(b['widgetHandle.cursor'], 'widgetHandle.cursor') },
    mark: {
      size: k.len(b['widgetMark.size'], 'widgetMark.size'),
      borderW: k.len(b['widgetMark.borderWidth'], 'widgetMark.borderWidth'),
      color: k.tok(b['widgetMark.borderColor'], brand, 'widgetMark.borderColor'),
      right: k.len(b['widgetMark.right'], 'widgetMark.right'),
      bottom: k.len(b['widgetMark.bottom'], 'widgetMark.bottom'),
    },
    placeholder: {
      bg: k.tok(b['placeholder.background'], brand, 'placeholder.background'),
      borderW: k.len(b['placeholder.borderWidth'], 'placeholder.borderWidth'),
      borderStyle: k.str(b['placeholder.borderStyle'], 'placeholder.borderStyle'),
      border: k.tok(b['placeholder.borderColor'], brand, 'placeholder.borderColor'),
      radius: k.len(b['placeholder.radius'], 'placeholder.radius'),
    },
    ghost: { shadow: { name: `shadow-${sh[1]}`, light: proseValue(`shadow-${sh[1]}`), dark: proseValue(`shadow-${sh[1]}-dark`) }, radius: k.len(b['ghost.radius'], 'ghost.radius') },
    more: { size: k.len(b['moreButton.size'], 'moreButton.size'), icon: k.len(b['moreButton.iconSize'], 'moreButton.iconSize'), touch: k.box(b['moreButton.touchTarget'], 'moreButton.touchTarget').w },
    sizeMenu: { label: k.str(b['sizeMenu.label'], 'sizeMenu.label'), items },
    ring: { width: k.len(fo['focusRing.width'], 'widget focusRing.width'), offset: k.len(fo['focusRing.offset'], 'widget focusRing.offset'), color: k.tok(fo['focusRing.color'], brand, 'widget focusRing.color') },
  };
  k.same(k.box(b['widgetHandle.touchTarget'], 'widgetHandle.touchTarget').w, look.handle.size, '모서리 손잡이 누르는 자리 · 크기');
  if (!look.sizeMenu.items.some((i) => i.columns === look.columns)) throw new Error(`${F} 의 크기 메뉴에 가득(${look.columns}칸)이 없다`);
  widgetCache = look;
  return look;
}

// ── Scroll Area ───────────────────────────────────────────
const saCache = new Map<Brand, ScrollAreaLook>();
export function scrollAreaLook(brand: Brand = 'desk'): ScrollAreaLook {
  const hit = saCache.get(brand);
  if (hit) return hit;
  const F = 'scroll-area.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('scroll-area');
  k.sameSet(stateNames(spec), ['enabled', 'focused'], 'states');
  k.sameSet(axisValues(spec, 'context'), ['page', 'overlay', 'row'], 'context');
  k.sameSet(axisValues(spec, 'focusable'), ['inside', 'none'], 'focusable');
  const b = resolveState(spec, {}, 'enabled');
  const ov = resolveState(spec, { context: 'overlay' }, 'enabled');
  const row = resolveState(spec, { context: 'row' }, 'enabled');
  const none = resolveState(spec, { focusable: 'none' }, 'enabled');
  const noneFo = resolveState(spec, { focusable: 'none' }, 'focused');
  k.same(k.str(b['scrollbar.display'], 'scrollbar.display'), '늘 보임', '세로 스크롤바(숨기지 않는다)');
  k.same(k.str(row['scrollbar.display'], 'row scrollbar.display'), '숨김', '가로 줄 스크롤바');
  k.same(k.str(b['box.overflow'], 'box.overflow'), 'auto', '스크롤 상자 넘침');
  const look: ScrollAreaLook = {
    bar: { width: k.len(b['scrollbar.width'], 'scrollbar.width'), height: k.len(b['scrollbar.height'], 'scrollbar.height'), thumb: k.tok(b['thumb.background'], brand, 'thumb.background'), radius: k.len(b['thumb.radius'], 'thumb.radius'), track: k.str(b['track.background'], 'track.background') },
    firefox: { width: k.str(b['firefox.scrollbarWidth'], 'firefox.scrollbarWidth'), thumb: k.tok(b['firefox.thumbColor'], brand, 'firefox.thumbColor'), track: k.str(b['firefox.trackColor'], 'firefox.trackColor') },
    overscroll: k.str(ov['box.overscrollBehavior'], 'overlay box.overscrollBehavior'),
    focus: {
      tabIndex: k.n(none['box.tabIndex'], 'none box.tabIndex'),
      role: k.str(none['box.role'], 'none box.role'),
      ring: { width: k.len(noneFo['focusRing.width'], 'focusRing.width'), offset: k.len(noneFo['focusRing.offset'], 'focusRing.offset'), color: k.tok(noneFo['focusRing.color'], brand, 'focusRing.color') },
    },
    surfaces: surfaces(brand),
  };
  k.same(look.firefox.thumb.light, look.bar.thumb.light, 'Firefox 막대 색 · webkit 막대 색');
  k.same(look.firefox.track, look.bar.track, 'Firefox 바탕 · webkit 바탕');
  saCache.set(brand, look);
  return look;
}

// ── Scroll Auto Hide ──────────────────────────────────────
let ahCache: AutoHideLook | undefined;
export function autoHideLook(): AutoHideLook {
  if (ahCache) return ahCache;
  const brand: Brand = 'desk';
  const F = 'scroll-auto-hide.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('scroll-auto-hide');
  k.sameSet(stateNames(spec), ['shown', 'hidden'], 'states');
  k.sameSet(axisValues(spec, 'motionSetting'), ['normal', 'reduced'], 'motionSetting');
  const b = resolveState(spec, {}, 'shown');
  const red = resolveState(spec, { motionSetting: 'reduced' }, 'shown');
  k.same(k.str(b['root.follow'], 'root.follow'), '1:1', '따라가기(그림은 스크롤 거리를 그대로 따른다)');
  k.same(k.str(red['root.follow'], 'reduced root.follow'), '끔', '모션 줄이기 따라가기(그림은 끈다)');
  k.same(k.str(b['root.transform'], 'root.transform'), 'translate3d(0, 0, 0)', '드러남 transform(그림은 translate3d 로만 옮긴다)');
  k.same(k.str(b['scrollContainer.overflowY'], 'scrollContainer.overflowY'), 'auto', '스크롤 상자');
  const snapBlock = k.blockMotion('scroll-auto-hide', '스크롤 끝 — 스냅');
  const look: AutoHideLook = {
    position: k.str(b['root.position'], 'root.position'),
    top: k.len(b['root.top'], 'root.top'),
    threshold: k.n(b['root.snapThreshold'], 'root.snapThreshold', '%') / 100,
    snap: { duration: String(tokenValue(k.str(b['root.snapDuration'], 'root.snapDuration'))), easing: String(tokenValue(k.str(b['root.snapEasing'], 'root.snapEasing'))) },
    bg: k.tok(b['root.background'], brand, 'root.background'),
    z: k.n(b['root.zIndex'], 'root.zIndex'),
  };
  k.same(look.snap.duration, snapBlock.duration, '스냅 시간 · motion "스크롤 끝 — 스냅"');
  k.same(look.snap.easing, snapBlock.easing, '스냅 곡선 · motion "스크롤 끝 — 스냅"');
  ahCache = look;
  return look;
}

// ── List 하위 줄(list.yaml nest · expanded) ─────────────────
let nestCache: NestLook | undefined;
export function listNestLook(brand: Brand = 'desk'): NestLook {
  if (nestCache) return nestCache;
  const F = 'list.yaml';
  const k = kit(F);
  const spec = loadComponentSpec('list');
  k.sameSet(axisValues(spec, 'nest'), ['none', 'parent', 'child'], 'nest');
  k.sameSet(axisValues(spec, 'expanded'), ['collapsed', 'expanded'], 'expanded');
  const p = resolveState(spec, { nest: 'parent' }, 'enabled');
  const ph = resolveState(spec, { nest: 'parent' }, 'hovered');
  const pp = resolveState(spec, { nest: 'parent' }, 'pressed');
  const pf = resolveState(spec, { nest: 'parent' }, 'focused');
  const c = resolveState(spec, { nest: 'child' }, 'enabled');
  const open = resolveState(spec, { nest: 'parent', expanded: 'expanded' }, 'enabled');
  k.same(k.str(p['subList.display'], 'parent subList.display'), '숨김', '하위 줄(접힘)');
  k.same(k.str(open['subList.display'], 'expanded subList.display'), '보임', '하위 줄(펼침)');
  k.same(k.str(p['expandButton.rotate'], 'parent expandButton.rotate'), '0deg', '꺾쇠 단추 회전(접힘)');
  // 늘 펼친 편집 화면(mode fixed — 레시피 collapsible={false}, 2026-10-15 Q-002) — 그림(NestedListView fixed)은 꺾쇠 자리를 같은 폭으로 비우고 하위 줄을 늘 보인다
  k.sameSet(axisValues(spec, 'mode'), ['foldable', 'fixed'], 'mode');
  const fixed = resolveState(spec, { nest: 'parent', mode: 'fixed' }, 'enabled');
  k.same(k.str(fixed['subList.display'], 'fixed subList.display'), '보임', '하위 줄(늘 펼친 편집 화면)');
  k.same(k.str(fixed['expandButton.display'], 'fixed expandButton.display'), '빈 자리', '꺾쇠 자리(늘 펼친 편집 화면)');
  const sub = k.blockMotion('list', '하위 줄 — 펼침 · 접힘');
  const chev = k.blockMotion('list', '꺾쇠 단추 — 회전');
  const look: NestLook = {
    parentPadL: k.len(p['item.paddingLeft'], 'parent item.paddingLeft'),
    childPadL: k.len(c['item.paddingLeft'], 'child item.paddingLeft'),
    button: {
      size: k.len(p['expandButton.size'], 'expandButton.size'),
      radius: k.len(p['expandButton.radius'], 'expandButton.radius'),
      icon: k.len(p['expandButton.iconSize'], 'expandButton.iconSize'),
      color: k.tok(p['expandButton.color'], brand, 'expandButton.color'),
      marginRight: k.len(p['expandButton.marginRight'], 'expandButton.marginRight'),
      hoverBg: k.tok(ph['expandButton.background'], brand, 'hovered expandButton.background'),
      pressBg: k.tok(pp['expandButton.background'], brand, 'pressed expandButton.background'),
      press: k.press(pp['expandButton.scale'], k.blockMotion('list', '누름 — 콘텐츠'), 'pressed expandButton.scale'),
      ring: { width: k.len(pf['expandButton.outlineWidth'], 'focused expandButton.outlineWidth'), offset: k.len(pf['expandButton.outlineOffset'], 'focused expandButton.outlineOffset'), color: k.tok(pf['expandButton.outlineColor'], brand, 'focused expandButton.outlineColor') },
      openRotate: k.n(open['expandButton.rotate'], 'expanded expandButton.rotate', 'deg'),
    },
    motion: { sub, chevron: chev, reduced: k.blockMotion('list', '하위 줄 — 모션 줄이기') },
  };
  k.same(parseFloat(look.motion.reduced.duration), reducedMotion().fade, '하위 줄 모션 줄이기 시간 — DESIGN.md 모션 줄이기 모드');
  k.same(k.box(p['expandButton.touchTarget'], 'expandButton.touchTarget').w, look.button.size, '꺾쇠 단추 누르는 영역 = 보이는 상자');
  k.same(sub.duration, chev.duration, '하위 줄 펼침 · 꺾쇠 회전 시간');
  // 하위 줄의 시작 = 부모의 제목 자리(줄 앞 + 꺾쇠 단추 + 단추 뒤 + 타일 + 타일 뒤)
  const f = listLook(brand).faces.none.light.enabled;
  k.same(look.childPadL, look.parentPadL + look.button.size + look.button.marginRight + f.tile.size + f.prefix.padRight, 'child item.paddingLeft = 줄 앞 + 꺾쇠 단추 + 단추 뒤 + 타일 + 타일 뒤');
  nestCache = look;
  return look;
}

// ── 화면 조각의 색(브라우저 그림이 모드를 정해 그릴 때) ─────────────
// 원장 머리 · 거래 줄 · 대시보드처럼 브라우저 그림(collapse-ledger · collapse-split)이 라이트 · 다크를 따로 그리는 자리 — 역할 색을 풀어 넘긴다
const TONE_NAMES = [
  'fg-neutral',
  'fg-neutral-subtle',
  'fg-neutral-muted',
  'fg-critical',
  'fg-disabled',
  'fg-brand',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-neutral-weak',
  'bg-brand-solid',
  'bg-brand-weak',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-focus-ring',
  'static-white',
  ...['orange', 'brown', 'blue', 'pink', 'violet', 'indigo', 'green', 'red', 'yellow', 'gray'].flatMap((h) => [`chart-${h}`, `chart-${h}-weak`]),
] as const;
export type ToneName = (typeof TONE_NAMES)[number];
const toneCache = new Map<Brand, Tones>();
export function screenTones(brand: Brand = 'desk'): Tones {
  const hit = toneCache.get(brand);
  if (hit) return hit;
  const t = Object.fromEntries(TONE_NAMES.map((n) => [n, named(n, brand)])) as Tones;
  toneCache.set(brand, t);
  return t;
}

// ── Scroll Area 그림의 스크롤바(CSS) ───────────────────────────
// scroll-area.yaml 의 전역 한 벌을 그림 상자(.psa)에만 건다 — 사이트 자체의 스크롤바는 바꾸지 않는다(tokens-style 이 깐다).
// 크로미움 · 사파리는 webkit 규칙, Firefox 만 표준 두 줄을 @supports not selector(::-webkit-scrollbar) 안에(같이 두면 크로미움이 6px 을 버린다).
// 막대 색은 --psa-thumb(모드를 정한 그림) 또는 사이트 모드의 토큰. 가로 줄(.psa-row)은 숨긴다. 초점을 받는 상자(.psa-region)는 안쪽 링
export function scrollAreaCss() {
  const l = scrollAreaLook('desk');
  const thumb = `var(--psa-thumb,var(--p-${l.bar.thumb.name}))`;
  const ring = `var(--psa-ring,var(--p-${l.focus.ring.color.name}))`;
  return [
    `.psa::-webkit-scrollbar{width:${l.bar.width}px;height:${l.bar.height}px}`,
    `.psa::-webkit-scrollbar-track{background:${l.bar.track}}`,
    `.psa::-webkit-scrollbar-thumb{background:${thumb};border-radius:${l.bar.radius === 9999 ? '9999px' : `${l.bar.radius}px`}}`,
    `.psa::-webkit-scrollbar-corner{background:${l.bar.track}}`,
    `@supports not selector(::-webkit-scrollbar){.psa{scrollbar-width:${l.firefox.width};scrollbar-color:${thumb} ${l.firefox.track}}}`,
    `.psa-row{scrollbar-width:none}.psa-row::-webkit-scrollbar{display:none}`,
    `.psa-region:focus-visible{outline:${l.focus.ring.width}px solid ${ring};outline-offset:${l.focus.ring.offset}px}`,
  ].join('');
}
