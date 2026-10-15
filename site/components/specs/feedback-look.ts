// 알림 메시지 넷의 모양 — specs/components/snackbar · callout · page-banner · result-section.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(feedback-view)은 이 값만 받아 그린다 — 띠 · 상자 · 결과의 높이 · 여백 · 글자 · 색 · 시간은 그림에 따로 적지 않는다.
// 비고 글의 수(액션 6초 · 닫기 −12 · 링크 밑줄 2 …)도 여기서 읽는다 — 문장이 바뀌면 빌드가 멈춰 그림이 낡지 않게.
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, proseValue, type Brand } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { navKit } from './nav-look';
import { cardFace } from './card-face';
import {
  BANNER_VARIANTS,
  FB_ICONS,
  FB_INTERACTIONS,
  FB_SCREEN_TONES,
  FB_TONES,
  RESULT_KINDS,
  RESULT_SIZES,
  SNACK_TONES,
  type BannerFace,
  type CalloutLook,
  type FbColor,
  type FbFace,
  type FbIcon,
  type FbMotion,
  type FbPress,
  type FbScreen,
  type FbTone,
  type FbType,
  type PageBannerLook,
  type ResultSectionLook,
  type ResultSizeLook,
  type SnackbarLook,
} from './feedback-shared';
export * from './feedback-shared';

type Spec = ReturnType<typeof loadComponentSpec>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string, file: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${file} 에 ${what} 이 없다`);
  return v;
};
// '16px' · '0px' · '−2px' · '$spacing-x3' → 수(빼기는 글자 − 도 받는다)
const len = (raw: unknown, what: string, file: string) => {
  const v = String(tokenValue(must(raw, what, file))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what, file);
};
// 값 · 비고 글자 속 수 — 문장이 바뀌면 여기서 멈춘다
const numIn = (text: string, re: RegExp, what: string, file: string) => {
  const m = re.exec(text.replace(/−/g, '-'));
  if (!m) throw new Error(`${file} 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
function sameSet(got: string[], want: readonly string[], what: string, file: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${file} 의 ${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — feedback-shared.ts 를 고친다`);
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
function named(name: string, brand: Brand): FbColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string, file: string): FbColor {
  const v = String(unbox(must(raw, what, file))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${file} 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
function type(raw: unknown, weight: unknown, what: string, file: string): FbType {
  const t = tokenValue(must(raw, what, file)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${file} 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`, file), fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400 };
}
const motionPair = (d: unknown, e: unknown, what: string, file: string): FbMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`, file))), easing: String(tokenValue(must(e, `${what} 곡선`, file))) });
type MotionBlock = { duration: unknown; easing?: unknown; properties?: unknown[]; note?: string };
const motionBlock = (spec: Spec, name: string, file: string) => {
  const m = (spec as unknown as { motion?: Record<string, MotionBlock> }).motion?.[name];
  if (!m) throw new Error(`${file} 의 motion 에 "${name}" 이 없다`);
  return m;
};

// 누름 축소 — YAML 의 "2px 거리" 가 Motion 의 눌림 피드백 축소량과 같은지(그림은 기초 값으로 셈한다)
function checkPress(raw: unknown, what: string, file: string): FbPress {
  const ps = pressScale();
  const d = numIn(String(unbox(must(raw, what, file))), /(\d+)px/, what, file);
  if (d !== ps.distance) throw new Error(`${file} 의 ${what} 축소 ${d}px 가 Motion 눌림 피드백(${ps.distance}px)과 다르다`);
  return { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis };
}

// 톤의 기본 아이콘 — 비고 글에서 읽는다(lucide 이름). 그림의 아이콘 목록에 없는 이름이면 멈춘다
const ICON_NAMES = new Set<string>(FB_ICONS);
function iconName(n: string, what: string, file: string): FbIcon {
  if (!ICON_NAMES.has(n)) throw new Error(`${file} 의 ${what} 아이콘 ${n} 이 그림의 아이콘 목록(feedback-shared FB_ICONS)에 없다`);
  return n as FbIcon;
}
// callout.yaml — "톤마다 기본: neutral · informative info, positive circle-check, …, critical circle-alert(…)"
function toneIconsFromList(note: string, file: string): Record<FbTone, FbIcon> {
  const list = /기본:\s*([^(]+)/.exec(note)?.[1];
  if (!list) throw new Error(`${file} 의 icon.size 비고(${note})에서 톤 기본 아이콘을 찾지 못했다`);
  const out = {} as Record<FbTone, FbIcon>;
  for (const seg of list.split(',').map((x) => x.trim()).filter(Boolean)) {
    const words = seg.split(/\s+/);
    const icon = iconName(words[words.length - 1], seg, file);
    for (const t of words.slice(0, -1).filter((w) => w !== '·')) {
      if (!(FB_TONES as readonly string[]).includes(t)) throw new Error(`${file} 의 icon.size 비고에 모르는 톤 ${t} 이 있다`);
      out[t as FbTone] = icon;
    }
  }
  for (const t of FB_TONES) if (!out[t]) throw new Error(`${file} 의 icon.size 비고에 ${t} 의 기본 아이콘이 없다`);
  return out;
}
// page-banner.yaml — "(info · info · circle-check · triangle-alert · circle-alert)" 톤 차례대로
function toneIconsInOrder(note: string, file: string): Record<FbTone, FbIcon> {
  const list = /\(([a-z-]+(?:\s*·\s*[a-z-]+)+)\)/.exec(note)?.[1];
  const names = list?.split('·').map((x) => x.trim()) ?? [];
  if (names.length !== FB_TONES.length) throw new Error(`${file} 의 icon.size 비고(${note})에서 톤 다섯의 기본 아이콘을 찾지 못했다`);
  return Object.fromEntries(FB_TONES.map((t, i) => [t, iconName(names[i], t, file)])) as Record<FbTone, FbIcon>;
}

const screenCache = new Map<Brand, FbScreen>();
function screen(brand: Brand): FbScreen {
  const hit = screenCache.get(brand);
  if (hit) return hit;
  const s = Object.fromEntries(FB_SCREEN_TONES.map((n) => [n, named(n, brand)])) as unknown as FbScreen;
  s.dim = { light: proseValue('overlay-dim-light'), dark: proseValue('overlay-dim-dark') };
  const nk = navKit(brand === 'hr' ? 'hr' : 'desk');
  s.nav = { top: nk.top, tab: nk.tab };
  s.card = cardFace();
  screenCache.set(brand, s);
  return s;
}

// ── Snackbar ─────────────────────────────────────────────
const SNACK = 'snackbar.yaml';
const LUCIDE_NAME: Record<string, FbIcon> = { 'circle-check': 'circle-check', 'circle-alert': 'circle-alert' };
const snackCache = new Map<Brand, SnackbarLook>();
export function snackbarLook(brand: Brand = 'desk'): SnackbarLook {
  const hit = snackCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('snackbar');
  sameSet(axisValues(spec, 'tone'), SNACK_TONES, 'tone', SNACK);
  sameSet(stateNames(spec), ['enabled', 'pressed', 'focused'], 'states', SNACK);
  const b = resolveState(spec, {}, 'enabled');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');
  const pos = resolveState(spec, { tone: 'positive' }, 'enabled');
  const crit = resolveState(spec, { tone: 'critical' }, 'enabled');
  if (resolveState(spec, { tone: 'neutral' }, 'enabled')['icon.color'] !== undefined) throw new Error(`${SNACK} — neutral 에 아이콘 색이 생겼다(그림은 아이콘 없이 그린다)`);

  // 시간 — 값은 액션이 없을 때, 비고의 "액션이 있으면 N ms"
  const dur = b['root.duration'];
  const plain = numIn(String(unbox(must(dur, 'root.duration', SNACK))), /^(\d+)ms$/, 'root.duration', SNACK);
  const withAction = numIn(noteOf(dur), /액션이 있으면\s*(\d+)ms/, 'root.duration 비고', SNACK);
  // 아이콘 — 비고의 lucide 이름(체크(circle-check) · 느낌표(circle-alert))
  const iconNote = noteOf(b['icon.size']);
  const glyphOf = (re: RegExp, what: string) => {
    const n = re.exec(iconNote)?.[1];
    if (!n || !LUCIDE_NAME[n]) throw new Error(`${SNACK} 의 icon.size 비고(${iconNote})에서 ${what} 아이콘 이름을 찾지 못했다`);
    return LUCIDE_NAME[n];
  };
  // 액션 누르는 영역 — "글 + 좌우 8 × 44"
  const target = String(unbox(must(b['action.touchTarget'], 'action.touchTarget', SNACK)));
  // 닫기 바깥 여백 — "위 · 아래 · 오른쪽 −10"(왼쪽은 0). 그림은 이 세 쪽에만 준다
  const marginText = String(unbox(must(b['closeButton.margin'], 'closeButton.margin', SNACK)));
  if (!/^위\s*·\s*아래\s*·\s*오른쪽\s/.test(marginText)) throw new Error(`${SNACK} 의 closeButton.margin(${marginText})이 위 · 아래 · 오른쪽이 아니다 — 그림을 고친다`);
  const closeMargin = numIn(marginText, /-(\d+)/, 'closeButton.margin', SNACK);
  // 모션 — 나타남 scale 0.8 → 1 · 사라짐 scale → 0.8
  const enter = motionBlock(spec, '나타남', SNACK);
  const exit = motionBlock(spec, '사라짐', SNACK);
  const swap = motionBlock(spec, '새 것으로 바꿈', SNACK);
  const enterScale = numIn((enter.properties ?? []).map(String).join(' '), /scale\s+([\d.]+)\s*→\s*1/, '나타남 properties', SNACK);
  const exitScale = numIn((exit.properties ?? []).map(String).join(' '), /scale\s*→\s*([\d.]+)/, '사라짐 properties', SNACK);
  const look: SnackbarLook = {
    region: {
      padX: len(b['region.paddingX'], 'region.paddingX', SNACK),
      padBottom: len(b['region.paddingBottom'], 'region.paddingBottom', SNACK),
      // 화면 키보드 위 8 · 피할 자리가 바뀌어 옮겨 가는 시간 — 2026-10-15 Q-003-1
      keyboardGap: len(b['region.keyboardGap'], 'region.keyboardGap', SNACK),
      offset: motionPair(b['region.offsetDuration'], b['region.offsetEasing'], 'region.offset', SNACK),
      zIndex: Number(unbox(must(b['region.zIndex'], 'region.zIndex', SNACK))),
    },
    root: {
      maxWidth: len(b['root.maxWidth'], 'root.maxWidth', SNACK),
      minHeight: len(b['root.minHeight'], 'root.minHeight', SNACK),
      pad: len(b['root.padding'], 'root.padding', SNACK),
      radius: len(b['root.radius'], 'root.radius', SNACK),
      bg: tok(b['root.background'], brand, 'root.background', SNACK),
      shadow: String(unbox(must(b['root.shadow'], 'root.shadow', SNACK))),
    },
    duration: { plain, withAction },
    icon: {
      size: len(b['icon.size'], 'icon.size', SNACK),
      padRight: len(b['icon.paddingRight'], 'icon.paddingRight', SNACK),
      color: { positive: tok(pos['icon.color'], brand, 'positive icon.color', SNACK), critical: tok(crit['icon.color'], brand, 'critical icon.color', SNACK) },
      glyph: { positive: glyphOf(/체크\(([a-z-]+)\)/, '체크'), critical: glyphOf(/느낌표\(([a-z-]+)\)/, '느낌표') },
    },
    content: { padX: len(b['content.paddingX'], 'content.paddingX', SNACK), gap: len(b['content.gap'], 'content.gap', SNACK) },
    message: { ...type(b['message.typography'], b['message.fontWeight'], 'message.typography', SNACK), color: tok(b['message.foreground'], brand, 'message.foreground', SNACK) },
    action: {
      ...type(b['action.typography'], b['action.fontWeight'], 'action.typography', SNACK),
      color: tok(b['action.foreground'], brand, 'action.foreground', SNACK),
      targetPadX: numIn(target, /좌우\s*(\d+)/, 'action.touchTarget 좌우', SNACK),
      targetH: numIn(target, /×\s*(\d+)/, 'action.touchTarget 높이', SNACK),
      radius: len(b['action.radius'], 'action.radius', SNACK),
    },
    close: {
      size: len(b['closeButton.size'], 'closeButton.size', SNACK),
      icon: len(b['closeButton.iconSize'], 'closeButton.iconSize', SNACK),
      color: tok(b['closeButton.color'], brand, 'closeButton.color', SNACK),
      radius: len(b['closeButton.radius'], 'closeButton.radius', SNACK),
      margin: -closeMargin,
    },
    ring: {
      width: len(focused['focusRing.width'], 'focusRing.width', SNACK),
      offset: len(focused['focusRing.offset'], 'focusRing.offset', SNACK),
      actionOffset: len(focused['focusRing.actionOffset'], 'focusRing.actionOffset', SNACK),
      color: tok(focused['focusRing.color'], brand, 'focusRing.color', SNACK),
    },
    motion: {
      enter: { ...motionPair(enter.duration, enter.easing, '나타남', SNACK), scale: enterScale },
      exit: { ...motionPair(exit.duration, exit.easing, '사라짐', SNACK), scale: exitScale },
      swap: motionPair(swap.duration, swap.easing, '새 것으로 바꿈', SNACK),
      press: motionPair(pressed['action.scaleDuration'], pressed['action.scaleEasing'], 'action 누름', SNACK),
    },
    press: checkPress(pressed['action.scale'], 'pressed action.scale', SNACK),
    screen: screen(brand),
  };
  if (look.close.margin !== -look.root.pad) throw new Error(`${SNACK} 의 닫기 바깥 여백 ${look.close.margin} 이 띠 여백 −${look.root.pad} 와 다르다(비고: 띠 여백 안으로 들어와 띠 높이를 둔다)`);
  if (look.close.size !== look.root.minHeight) throw new Error(`${SNACK} 의 닫기 상자 ${look.close.size} 가 띠 최소 높이 ${look.root.minHeight} 와 다르다 — 띠 높이가 바뀐다`);
  // 액션 누르는 높이가 띠 최소 높이 안에 든다(띠 높이 안에서 위아래로 넓힌다 — 비고)
  if (look.action.targetH > look.root.minHeight) throw new Error(`${SNACK} 의 액션 누르는 높이 ${look.action.targetH} 가 띠 최소 높이 ${look.root.minHeight} 보다 크다`);
  snackCache.set(brand, look);
  return look;
}

// ── Callout ──────────────────────────────────────────────
const CALLOUT = 'callout.yaml';
const calloutCache = new Map<Brand, CalloutLook>();
export function calloutLook(brand: Brand = 'desk'): CalloutLook {
  const hit = calloutCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('callout');
  sameSet(axisValues(spec, 'tone'), FB_TONES, 'tone', CALLOUT);
  sameSet(axisValues(spec, 'interaction'), FB_INTERACTIONS, 'interaction', CALLOUT);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused'], 'states', CALLOUT);
  const b = resolveState(spec, {}, 'enabled');
  const focused = resolveState(spec, {}, 'focused');
  const faces = {} as Record<FbTone, FbFace>;
  for (const tone of FB_TONES) {
    const e = resolveState(spec, { tone, interaction: 'actionable' }, 'enabled');
    const p = resolveState(spec, { tone, interaction: 'actionable' }, 'pressed');
    const h = resolveState(spec, { tone, interaction: 'actionable' }, 'hovered');
    const cp = resolveState(spec, { tone, interaction: 'dismissible' }, 'pressed');
    const ch = resolveState(spec, { tone, interaction: 'dismissible' }, 'hovered');
    const face: FbFace = { bg: tok(e['root.background'], brand, `${tone} root.background`, CALLOUT), fg: tok(e['root.foreground'], brand, `${tone} root.foreground`, CALLOUT), pressed: tok(p['root.background'], brand, `${tone} pressed root.background`, CALLOUT) };
    // 호버 = 누름 바탕(Actionable 상자 · 닫기 버튼 모두) — 그림은 한 값으로 그린다
    const same = (raw: unknown, what: string) => {
      const c = tok(raw, brand, what, CALLOUT);
      if (c.light !== face.pressed.light || c.dark !== face.pressed.dark) throw new Error(`${CALLOUT} 의 ${tone} ${what} 이 Actionable 누름 바탕과 다르다`);
    };
    same(h['root.background'], 'hovered root.background');
    same(cp['closeButton.background'], 'dismissible pressed closeButton.background');
    same(ch['closeButton.background'], 'dismissible hovered closeButton.background');
    faces[tone] = face;
  }
  const actPressed = resolveState(spec, { interaction: 'actionable' }, 'pressed');
  const closePressed = resolveState(spec, { interaction: 'dismissible' }, 'pressed');
  const press = checkPress(actPressed['root.scale'], 'actionable pressed root.scale', CALLOUT);
  checkPress(closePressed['closeButton.scale'], 'dismissible pressed closeButton.scale', CALLOUT);
  const closeSize = len(b['closeButton.size'], 'closeButton.size', CALLOUT);
  // 닫기 축소 기준 — 비고 "기준 40" 이 닫기 상자와 같은지
  const closeBasis = numIn(noteOf(closePressed['closeButton.scale']), /기준\s*(\d+)/, 'closeButton.scale 비고', CALLOUT);
  if (closeBasis !== closeSize) throw new Error(`${CALLOUT} 의 닫기 축소 기준 ${closeBasis} 가 닫기 상자 ${closeSize} 와 다르다`);
  const closeNote = noteOf(b['closeButton.size']);
  const ringNote = noteOf(focused['focusRing.offset']);
  const blocks = { press: motionBlock(spec, '누름', CALLOUT), color: motionBlock(spec, '바탕', CALLOUT) };
  const look: CalloutLook = {
    root: { minHeight: len(b['root.minHeight'], 'root.minHeight', CALLOUT), pad: len(b['root.padding'], 'root.padding', CALLOUT), gap: len(b['root.gap'], 'root.gap', CALLOUT), radius: len(b['root.radius'], 'root.radius', CALLOUT) },
    icon: len(b['icon.size'], 'icon.size', CALLOUT),
    toneIcon: toneIconsFromList(noteOf(b['icon.size']), CALLOUT),
    suffixIcon: len(b['suffixIcon.size'], 'suffixIcon.size', CALLOUT),
    title: type(b['title.typography'], b['title.fontWeight'], 'title.typography', CALLOUT),
    description: type(b['description.typography'], b['description.fontWeight'], 'description.typography', CALLOUT),
    link: {
      ...type(b['link.typography'], b['link.fontWeight'], 'link.typography', CALLOUT),
      underlineOffset: numIn(noteOf(b['link.textDecoration']), /밑줄과\s*(\d+)\s*띄움/, 'link.textDecoration 비고', CALLOUT),
      ringRadius: numIn(ringNote, /모서리\s*(\d+)\s*·/, 'focusRing.offset 비고(링크 모서리)', CALLOUT),
    },
    close: {
      size: closeSize,
      icon: len(b['closeButton.iconSize'], 'closeButton.iconSize', CALLOUT),
      radius: len(b['closeButton.radius'], 'closeButton.radius', CALLOUT),
      margin: -numIn(closeNote, /바깥 여백\s*-(\d+)/, 'closeButton.size 비고(바깥 여백)', CALLOUT),
      ringRadius: numIn(ringNote, /·\s*(\d+)\)/, 'focusRing.offset 비고(닫기 모서리)', CALLOUT),
    },
    ring: { width: len(focused['focusRing.width'], 'focusRing.width', CALLOUT), offset: len(focused['focusRing.offset'], 'focusRing.offset', CALLOUT), color: tok(focused['focusRing.color'], brand, 'focusRing.color', CALLOUT) },
    faces,
    motion: { press: motionPair(blocks.press.duration, blocks.press.easing, '누름', CALLOUT), color: motionPair(blocks.color.duration, blocks.color.easing, '바탕', CALLOUT) },
    press,
    screen: screen(brand),
  };
  // 닫기 아이콘이 상자 오른쪽 끝에서 비고의 거리(14)에 선다 — 안쪽 여백 + 바깥 여백 + (상자 − 아이콘) ÷ 2
  const inset = numIn(closeNote, /오른쪽 끝에서\s*(\d+)/, 'closeButton.size 비고(아이콘 자리)', CALLOUT);
  if (look.root.pad + look.close.margin + (look.close.size - look.close.icon) / 2 !== inset) throw new Error(`${CALLOUT} 의 닫기 아이콘 자리(${inset})가 여백 · 상자로 셈한 값과 다르다`);
  calloutCache.set(brand, look);
  return look;
}

// ── Page Banner ──────────────────────────────────────────
const BANNER = 'page-banner.yaml';
const bannerCache = new Map<Brand, PageBannerLook>();
export function pageBannerLook(brand: Brand = 'desk'): PageBannerLook {
  const hit = bannerCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('page-banner');
  sameSet(axisValues(spec, 'tone'), FB_TONES, 'tone', BANNER);
  sameSet(axisValues(spec, 'variant'), BANNER_VARIANTS, 'variant', BANNER);
  sameSet(axisValues(spec, 'interaction'), FB_INTERACTIONS, 'interaction', BANNER);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused'], 'states', BANNER);
  const b = resolveState(spec, {}, 'enabled');
  const focused = resolveState(spec, {}, 'focused');
  const faces = {} as PageBannerLook['faces'];
  for (const variant of BANNER_VARIANTS) {
    faces[variant] = {} as Record<FbTone, BannerFace>;
    for (const tone of FB_TONES) {
      const where = `${variant} · ${tone}`;
      const e = resolveState(spec, { tone, variant, interaction: 'actionable' }, 'enabled');
      const p = resolveState(spec, { tone, variant, interaction: 'actionable' }, 'pressed');
      const h = resolveState(spec, { tone, variant, interaction: 'actionable' }, 'hovered');
      const f = resolveState(spec, { tone, variant }, 'focused');
      const face: BannerFace = {
        bg: tok(e['root.background'], brand, `${where} root.background`, BANNER),
        fg: tok(e['root.foreground'], brand, `${where} root.foreground`, BANNER),
        pressed: tok(p['root.background'], brand, `${where} pressed root.background`, BANNER),
        ring: tok(f['focusRing.color'], brand, `${where} focused focusRing.color`, BANNER),
      };
      const hv = tok(h['root.background'], brand, `${where} hovered root.background`, BANNER);
      if (hv.light !== face.pressed.light || hv.dark !== face.pressed.dark) throw new Error(`${BANNER} 의 ${where} 호버 바탕이 누름 바탕과 다르다`);
      faces[variant][tone] = face;
    }
  }
  const actPressed = resolveState(spec, { interaction: 'actionable' }, 'pressed');
  const press = checkPress(actPressed['content.scale'], 'actionable pressed content.scale', BANNER);
  checkPress(resolveState(spec, { interaction: 'display' }, 'pressed')['button.scale'], 'display pressed button.scale', BANNER);
  const closePressed = resolveState(spec, { interaction: 'dismissible' }, 'pressed');
  checkPress(closePressed['closeButton.scale'], 'dismissible pressed closeButton.scale', BANNER);
  const closeSize = len(b['closeButton.size'], 'closeButton.size', BANNER);
  if (numIn(noteOf(closePressed['closeButton.scale']), /기준\s*(\d+)/, 'closeButton.scale 비고', BANNER) !== closeSize) throw new Error(`${BANNER} 의 닫기 축소 기준이 닫기 상자와 다르다`);
  const btnTarget = String(unbox(must(b['button.touchTarget'], 'button.touchTarget', BANNER)));
  const closeNote = noteOf(b['closeButton.size']);
  const blocks = { press: motionBlock(spec, '누름', BANNER), color: motionBlock(spec, '바탕', BANNER) };
  const look: PageBannerLook = {
    root: {
      minHeight: len(b['root.minHeight'], 'root.minHeight', BANNER),
      padX: len(b['root.paddingX'], 'root.paddingX', BANNER),
      padY: len(b['root.paddingY'], 'root.paddingY', BANNER),
      gap: len(b['root.gap'], 'root.gap', BANNER),
      radius: len(b['root.radius'], 'root.radius', BANNER),
    },
    icon: { size: len(b['icon.size'], 'icon.size', BANNER), marginTop: len(b['icon.marginTop'], 'icon.marginTop', BANNER) },
    toneIcon: toneIconsInOrder(noteOf(b['icon.size']), BANNER),
    content: { gap: len(b['content.gap'], 'content.gap', BANNER), justify: String(unbox(must(b['content.justifyContent'], 'content.justifyContent', BANNER))) },
    title: type(b['title.typography'], b['title.fontWeight'], 'title.typography', BANNER),
    description: type(b['description.typography'], b['description.fontWeight'], 'description.typography', BANNER),
    button: {
      ...type(b['button.typography'], b['button.fontWeight'], 'button.typography', BANNER),
      pad: numIn(btnTarget, /사방\s*(\d+)/, 'button.touchTarget 사방', BANNER),
      targetH: numIn(btnTarget, /×\s*(\d+)/, 'button.touchTarget 높이', BANNER),
      radius: len(b['button.radius'], 'button.radius', BANNER),
    },
    suffixIcon: len(b['suffixIcon.size'], 'suffixIcon.size', BANNER),
    close: { size: closeSize, icon: len(b['closeButton.iconSize'], 'closeButton.iconSize', BANNER), radius: len(b['closeButton.radius'], 'closeButton.radius', BANNER), margin: -numIn(closeNote, /바깥 여백\s*-(\d+)/, 'closeButton.size 비고(바깥 여백)', BANNER) },
    ring: { width: len(focused['focusRing.width'], 'focusRing.width', BANNER), offset: len(focused['focusRing.offset'], 'focusRing.offset', BANNER) },
    faces,
    motion: { press: motionPair(blocks.press.duration, blocks.press.easing, '누름', BANNER), color: motionPair(blocks.color.duration, blocks.color.easing, '바탕', BANNER) },
    press,
    screen: screen(brand),
  };
  // 버튼의 누르는 높이 = 글 줄 높이 + 사방 여백 × 2 · 버튼 바깥 여백은 비고대로 −사방(띠 높이를 늘리지 않는다)
  if (parseFloat(look.button.lineHeight) + look.button.pad * 2 !== look.button.targetH) throw new Error(`${BANNER} 의 버튼 누르는 높이 ${look.button.targetH} 가 글 줄 높이 + 사방 ${look.button.pad} × 2 와 다르다`);
  if (numIn(noteOf(b['button.touchTarget']), /바깥 여백\s*-(\d+)/, 'button.touchTarget 비고', BANNER) !== look.button.pad) throw new Error(`${BANNER} 의 버튼 바깥 여백이 사방 여백과 다르다`);
  // 닫기 아이콘 자리 — 오른쪽 끝에서 비고의 거리(24)
  const inset = numIn(closeNote, /오른쪽 끝에서\s*(\d+)/, 'closeButton.size 비고(아이콘 자리)', BANNER);
  if (look.root.padX + look.close.margin + (look.close.size - look.close.icon) / 2 !== inset) throw new Error(`${BANNER} 의 닫기 아이콘 자리(${inset})가 여백 · 상자로 셈한 값과 다르다`);
  bannerCache.set(brand, look);
  return look;
}

// ── Result Section ───────────────────────────────────────
const RESULT = 'result-section.yaml';
const resultCache = new Map<Brand, ResultSectionLook>();
// "medium 40" · 비고 "Button neutralWeak" → button.yaml 의 그 변형 · 크기(높이까지 맞는지 본다)
function resultButton(raw: unknown, what: string, brand: Brand) {
  const v = String(unbox(must(raw, what, RESULT)));
  const size = /^([a-z]+)\s/.exec(v)?.[1];
  const height = numIn(v, /\s(\d+)$/, what, RESULT);
  const variant = /Button\s+([a-zA-Z]+)/.exec(noteOf(raw))?.[1];
  if (!size || !variant) throw new Error(`${RESULT} 의 ${what}(${v} · ${noteOf(raw)})에서 버튼 크기 · 변형을 읽지 못했다`);
  const look = buttonLook({ variant, size }, brand);
  const f = look.faces.light.enabled;
  if (f.height !== height) throw new Error(`${RESULT} 의 ${what} 높이 ${height} 가 button.yaml ${variant} · ${size}(${f.height})와 다르다`);
  return { variant, size, height, look, lineHeight: parseFloat(f.lineHeight ?? '0'), padY: f.padY };
}
export function resultSectionLook(brand: Brand = 'desk'): ResultSectionLook {
  const hit = resultCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('result-section');
  sameSet(axisValues(spec, 'size'), RESULT_SIZES, 'size', RESULT);
  sameSet(axisValues(spec, 'kind'), RESULT_KINDS, 'kind', RESULT);
  const b = resolveState(spec, {}, 'enabled');
  const sizes = {} as Record<(typeof RESULT_SIZES)[number], ResultSizeLook>;
  for (const size of RESULT_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    sizes[size] = {
      title: type(v['title.typography'], v['title.fontWeight'], `${size} title.typography`, RESULT),
      description: type(v['description.typography'], v['description.fontWeight'], `${size} description.typography`, RESULT),
      descGap: len(v['description.marginTop'], `${size} description.marginTop`, RESULT),
      actionsTop: len(v['actions.marginTop'], `${size} actions.marginTop`, RESULT),
    };
  }
  const kindColor = (kind: (typeof RESULT_KINDS)[number]) => tok(resolveState(spec, { kind }, 'enabled')['asset.color'], brand, `${kind} asset.color`, RESULT);
  // 실패 · 완료의 아이콘 — 비고의 lucide 이름
  const glyphOf = (kind: 'failure' | 'done'): FbIcon => {
    const n = noteOf(resolveState(spec, { kind }, 'enabled')['asset.color']);
    if (n !== 'circle-alert' && n !== 'circle-check') throw new Error(`${RESULT} 의 ${kind} asset.color 비고(${n})가 아이콘 이름이 아니다`);
    return n;
  };
  const enter = motionBlock(spec, '결과로 바뀜', RESULT);
  const look: ResultSectionLook = {
    root: { padX: len(b['root.paddingX'], 'root.paddingX', RESULT), padY: len(b['root.paddingY'], 'root.paddingY', RESULT), padXInCard: numIn(noteOf(b['root.paddingX']), /카드\(card\.md\) 안에서는\s*(\d+)/, 'root.paddingX 비고(카드 안 좌우)', RESULT) },
    asset: {
      size: len(b['asset.size'], 'asset.size', RESULT),
      strokeWidth: numIn(noteOf(b['asset.size']), /굵기\s*([\d.]+)/, 'asset.size 비고(굵기)', RESULT),
      marginBottom: len(b['asset.marginBottom'], 'asset.marginBottom', RESULT),
      color: { empty: kindColor('empty'), failure: kindColor('failure'), done: kindColor('done') },
      glyph: { failure: glyphOf('failure'), done: glyphOf('done') },
    },
    title: { color: tok(b['title.foreground'], brand, 'title.foreground', RESULT), fontWeight: unbox(must(b['title.fontWeight'], 'title.fontWeight', RESULT)) as number },
    description: { color: tok(b['description.foreground'], brand, 'description.foreground', RESULT), fontWeight: unbox(must(b['description.fontWeight'], 'description.fontWeight', RESULT)) as number },
    sizes,
    actions: { gap: len(b['actions.gap'], 'actions.gap', RESULT) },
    primary: resultButton(b['primaryButton.buttonSize'], 'primaryButton.buttonSize', brand),
    secondary: resultButton(b['secondaryButton.buttonSize'], 'secondaryButton.buttonSize', brand),
    motion: { enter: motionPair(enter.duration, enter.easing, '결과로 바뀜', RESULT) },
    screen: screen(brand),
  };
  // 버튼 사이 — 비고 "둘째 버튼이 위아래로 8 블리드해 상자 사이는 12": 블리드는 둘째 버튼의 위아래 여백, 상자 사이 = 사이 − 블리드
  const gapNote = noteOf(b['actions.gap']);
  const bleed = numIn(gapNote, /위아래로\s*(\d+)\s*블리드/, 'actions.gap 비고(블리드)', RESULT);
  const boxGap = numIn(gapNote, /상자 사이는\s*(\d+)/, 'actions.gap 비고(상자 사이)', RESULT);
  if (bleed !== look.secondary.padY) throw new Error(`${RESULT} 의 블리드 ${bleed} 가 둘째 버튼(${look.secondary.variant} ${look.secondary.size})의 위아래 여백 ${look.secondary.padY} 와 다르다`);
  if (look.actions.gap - bleed !== boxGap) throw new Error(`${RESULT} 의 버튼 사이 ${look.actions.gap} − 블리드 ${bleed} 가 상자 사이 ${boxGap} 와 다르다`);
  resultCache.set(brand, look);
  return look;
}
