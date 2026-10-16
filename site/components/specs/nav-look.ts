// 화면 틀 · 이동 묶음의 모양 — specs/components/{top-navigation, bottom-navigation, side-navigation, side-panel, pagination,
// infinite-list, table-pagination, floating-action-button}.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(nav-*-view)은 이 값만 받아 그린다 — 높이 · 여백 · 색 · 모션은 그림에 따로 적지 않는다.
// YAML 의 축 · 상태 · 값의 꼴이 그림이 아는 것과 달라지면 여기서 멈춘다(그림이 조용히 낡지 않게).
// 숫자가 YAML 이 아니라 스펙 md 의 Behavior 에만 있는 것(탭 바가 줄어드는 스크롤 거리 · 옆 패널을 끌어 닫는 기준)은 그 줄을 읽는다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, proseValue, reducedMotion, type Brand as DBrand } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { notifLook } from './display-look';
import { loadingKit } from './loading-look';
import { selectLook } from './select-look';
import type { OvClose } from './overlay-shared';
import {
  NAV_TONES,
  PANEL_SIDES,
  PANEL_SIZES,
  TAB_SIZES,
  TOP_LEADING,
  TOP_TYPES,
  LIST_STATUS,
  type Brand,
  type FabLook,
  type InfiniteListLook,
  type NavIcon,
  type NavKit,
  type NColor,
  type NMotion,
  type NPress,
  type NShadow,
  type NType,
  type PaginationLook,
  type SideNavLook,
  type SidePanelLook,
  type TablePaginationLook,
  type TabBarLook,
  type TopNavLook,
} from './nav-shared';
export * from './nav-shared';

type Vals = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
function must<T>(v: T | undefined | null, what: string): T {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${what} 이 없다`);
  return v;
}
// '16px' · '0px' · '$spacing-x4' · '$radius-r2' · '$layout-sidebar' → 수
function len(raw: unknown, what: string): number {
  const v0 = String(unbox(must(raw, what))).trim();
  const lay = /^\$(layout-[a-z0-9-]+)$/.exec(v0);
  const v = lay ? proseValue(lay[1]) : String(tokenValue(v0)).replace('−', '-');
  if (v === '0') return 0;
  if (v === '9999px') return 9999;
  return must(num(v), `${what}(${v0})`);
}
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
function same(a: number, b: number, what: string) {
  if (Math.abs(a - b) > 0.001) throw new Error(`${what} — ${a} 와 ${b} 가 다르다`);
}
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — nav-shared.ts 를 고친다`);
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
export function named(name: string, brand: Brand = 'desk'): NColor {
  const dark = design(brand as DBrand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand as DBrand) : color(name, brand as DBrand);
  return { name: varName(name, brand), light: color(name, brand as DBrand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): NColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
function typeOf(raw: unknown, what: string): NType {
  const t = tokenValue(must(unbox(raw), what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}
const weightOf = (raw: unknown, what: string) => Number(unbox(must(raw, what)));
const motionPair = (d: unknown, e: unknown, what: string): NMotion => ({ duration: String(tokenValue(unbox(must(d, `${what} 시간`)))), easing: String(tokenValue(unbox(must(e, `${what} 곡선`)))) });
function shadowOf(raw: unknown, what: string): NShadow {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$(shadow-s\d)$/.exec(v);
  if (!m) throw new Error(`${what} 이 그림자 토큰이 아니다(${v})`);
  // 다크 짝 — YAML 의 dark 가 있으면 그것과 같은지 본다
  const dark = raw && typeof raw === 'object' && 'dark' in raw ? String((raw as { dark: unknown }).dark).replace(/^\$/, '') : `${m[1]}-dark`;
  if (dark !== `${m[1]}-dark`) throw new Error(`${what} 의 다크 그림자(${dark})가 ${m[1]}-dark 가 아니다`);
  return { name: m[1], light: proseValue(m[1]), dark: proseValue(dark) };
}
type MotionBlock = Record<string, { duration: unknown; easing: unknown; properties?: string[] }>;
function motionOf(spec: string, block: string): NMotion {
  const m = (loadComponentSpec(spec) as unknown as { motion?: MotionBlock }).motion?.[block];
  if (!m) throw new Error(`${spec}.yaml 의 motion 에 "${block}" 이 없다`);
  return motionPair(m.duration, m.easing, `${spec} ${block}`);
}
const ps = () => pressScale();
// 누름 — YAML 의 "2px 거리 축소" 가 Motion 의 눌림 피드백과 같은지, 비고의 "기준 N" 이 그 칸의 기준 길이와 같은지
function pressOf(raw: unknown, what: string, basis?: number): NPress {
  const p = ps();
  same(numIn(String(unbox(must(raw, what))), /(\d+)px/, what), p.distance, `${what} 누름 거리 — Motion 눌림 피드백`);
  if (basis !== undefined && /기준\s*(\d+)/.test(noteOf(raw))) same(numIn(noteOf(raw), /기준\s*(\d+)/, `${what} 비고`), basis, `${what} 누름 기준`);
  return { distance: p.distance, widthDivisor: p.widthDivisor, minBasis: p.minBasis, motion: { duration: '0ms', easing: 'linear' } };
}
const withMotion = (p: NPress, m: NMotion): NPress => ({ ...p, motion: m });
const ringOf = (v: Vals, brand: Brand, what: string) => ({ width: len(v['focusRing.width'], `${what} focusRing.width`), offset: len(v['focusRing.offset'], `${what} focusRing.offset`), color: tok(v['focusRing.color'], brand, `${what} focusRing.color`) });
// 스펙 md 의 Behavior 표에서 첫 칸이 head 로 시작하는 줄
function behaviorRow(spec: string, head: string) {
  const md = readFileSync(join(process.cwd(), '..', 'specs/components', `${spec}.md`), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith(`| ${head}`));
  if (!row) throw new Error(`${spec}.md 의 Behavior 에 "${head}" 줄이 없다`);
  return row;
}

// ── Top Navigation ──────────────────────────────────────────
// 켜고 끄는 단추의 켬 굵기(iconButton.strokeWidthOn — v106). Toggle(toggle.yaml)의 켬 굵기와 같아야 한다
function pressedStrokeOf(raw: unknown, F: string) {
  const on = len(raw, `${F} iconButton.strokeWidthOn`);
  const t = resolveState(loadComponentSpec('toggle'), { toggled: 'on' }, 'enabled')['icon.strokeWidth'];
  const want = Number(String(unbox(t)).replace('px', ''));
  if (on !== want) throw new Error(`${F} 의 켬 굵기(${on})가 toggle.yaml 켬(${want})과 다르다`);
  return on;
}

function topLook(brand: Brand): TopNavLook {
  const F = 'top-navigation.yaml';
  const spec = loadComponentSpec('top-navigation');
  sameSet(axisValues(spec, 'type'), TOP_TYPES, `${F} type`);
  sameSet(axisValues(spec, 'leadingIcon'), TOP_LEADING, `${F} leadingIcon`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  if (String(unbox(b['root.borderBottomWidth'])) !== '0px' || String(unbox(b['root.shadow'])) !== 'none') throw new Error(`${F} — 바 아래 선 · 그림자가 생겼다(그림은 늘 없이 그린다)`);
  const size = len(b['iconButton.size'], `${F} iconButton.size`);
  const types = {} as TopNavLook['types'];
  for (const type of ['root', 'standard'] as const) {
    const v = resolveState(spec, { type }, 'enabled');
    types[type] = { text: typeOf(v['title.typography'], `${F} ${type} title.typography`), left: len(v['title.marginLeft'], `${F} ${type} title.marginLeft`) };
  }
  const d = resolveState(spec, { type: 'desktop' }, 'enabled');
  if (String(unbox(d['title.display'])) !== 'none') throw new Error(`${F} desktop title.display 가 none 이 아니다 — 그림은 머리에 제목을 그리지 않는다`);
  const primarySize = /^([a-z]+)\s+(\d+)$/.exec(String(unbox(d['primaryButton.buttonSize'])).trim());
  if (!primarySize) throw new Error(`${F} desktop primaryButton.buttonSize 를 읽지 못했다`);
  const primary = buttonLook({ variant: 'brandSolid', size: primarySize[1] }, brand);
  same(primary.faces.light.enabled.height, Number(primarySize[2]), `${F} 주 버튼 높이 — Button ${primarySize[1]}`);
  const leading = {} as TopNavLook['leading'];
  for (const li of TOP_LEADING) {
    const g = resolveState(spec, { leadingIcon: li }, 'enabled')['leading.glyph'];
    const icon = /lucide\s+([a-z-]+)/.exec(String(unbox(g)))?.[1];
    const label = /이름\s*"([^"]+)"/.exec(noteOf(g))?.[1];
    if (!icon || !label) throw new Error(`${F} leadingIcon ${li} 의 글리프 · 이름을 읽지 못했다`);
    leading[li] = { icon: icon as NavIcon, label };
  }
  const p = pressOf(pr['iconButton.scale'], `${F} pressed iconButton.scale`, size);
  return {
    height: len(b['root.height'], `${F} root.height`),
    padX: len(b['root.paddingX'], `${F} root.paddingX`),
    bg: tok(b['root.background'], brand, `${F} root.background`),
    z: Number(unbox(b['root.zIndex'])),
    title: { fg: tok(b['title.foreground'], brand, `${F} title.foreground`), weight: weightOf(b['title.fontWeight'], `${F} title.fontWeight`), gap: len(b['title.gap'], `${F} title.gap`) },
    types,
    desktop: {
      padLeft: len(d['root.paddingLeft'], `${F} desktop root.paddingLeft`),
      padRight: len(d['root.paddingRight'], `${F} desktop root.paddingRight`),
      primarySize: primarySize[1],
      primaryGap: len(d['primaryButton.marginRight'], `${F} desktop primaryButton.marginRight`),
      screenTitle: typeOf(b['screenTitle.typography'], `${F} screenTitle.typography`),
      navToTitle: len(b['screenTitle.marginTop'], `${F} screenTitle.marginTop`),
    },
    search: { height: len(b['searchField.height'], `${F} searchField.height`), desktopWidth: len(d['searchField.width'], `${F} desktop searchField.width`) },
    screenRow: {
      gap: len(b['screenTitle.gap'], `${F} screenTitle.gap`),
      description: typeOf(b['screenDescription.typography'], `${F} screenDescription.typography`),
      descriptionFg: tok(b['screenDescription.foreground'], brand, `${F} screenDescription.foreground`),
      descriptionGap: len(b['screenDescription.marginTop'], `${F} screenDescription.marginTop`),
      actionsGap: len(b['screenActions.gap'], `${F} screenActions.gap`),
      buttonSize: /^([a-z]+)/.exec(String(unbox(b['screenActions.buttonSize'])).trim())?.[1] ?? 'small',
    },
    icon: {
      size,
      radius: len(b['iconButton.radius'], `${F} iconButton.radius`),
      icon: len(b['iconButton.iconSize'], `${F} iconButton.iconSize`),
      stroke: len(b['iconButton.strokeWidth'], `${F} iconButton.strokeWidth`),
      pressedStroke: pressedStrokeOf(b['iconButton.strokeWidthOn'], F),
      fg: tok(b['iconButton.color'], brand, `${F} iconButton.color`),
      hoverBg: tok(hov['iconButton.background'], brand, `${F} hovered iconButton.background`),
      pressBg: tok(pr['iconButton.background'], brand, `${F} pressed iconButton.background`),
      disabledFg: tok(di['iconButton.color'], brand, `${F} disabled iconButton.color`),
    },
    text: {
      height: len(b['textButton.height'], `${F} textButton.height`),
      padX: len(b['textButton.paddingX'], `${F} textButton.paddingX`),
      radius: len(b['textButton.radius'], `${F} textButton.radius`),
      type: { ...typeOf(b['textButton.typography'], `${F} textButton.typography`), fontWeight: weightOf(b['textButton.fontWeight'], `${F} textButton.fontWeight`) },
      fg: tok(b['textButton.foreground'], brand, `${F} textButton.foreground`),
      hoverBg: tok(hov['textButton.background'], brand, `${F} hovered textButton.background`),
      pressBg: tok(pr['textButton.background'], brand, `${F} pressed textButton.background`),
      disabledFg: tok(di['textButton.foreground'], brand, `${F} disabled textButton.foreground`),
    },
    dot: { size: len(b['notification.size'], `${F} notification.size`), top: len(b['notification.top'], `${F} notification.top`), right: len(b['notification.right'], `${F} notification.right`), color: tok(b['notification.background'], brand, `${F} notification.background`) },
    ring: ringOf(fo, brand, F),
    press: withMotion(p, motionPair(pr['iconButton.scaleDuration'], pr['iconButton.scaleEasing'], `${F} 누름`)),
    color: motionPair(b['iconButton.transitionDuration'], b['iconButton.transitionEasing'], `${F} 바탕 색`),
    leading,
    primary,
  };
}

// ── Bottom Navigation ───────────────────────────────────────
function tabLook(brand: Brand): TabBarLook {
  const F = 'bottom-navigation.yaml';
  const spec = loadComponentSpec('bottom-navigation');
  sameSet(axisValues(spec, 'size'), TAB_SIZES, `${F} size`);
  sameSet(axisValues(spec, 'selected'), ['unselected', 'selected'], `${F} selected`);
  sameSet(stateNames(spec), ['enabled', 'pressed', 'focused'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const sel = resolveState(spec, { selected: 'selected' }, 'enabled');
  const sizes = {} as TabBarLook['sizes'];
  for (const size of TAB_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const mb = String(unbox(v['root.marginBottom']));
    const labelDisplay = v['label.display'] === undefined ? '' : String(unbox(v['label.display']));
    sizes[size] = {
      h: len(v['root.height'], `${F} ${size} root.height`),
      marginX: len(v['root.marginX'], `${F} ${size} root.marginX`),
      bottomMin: numIn(mb, /max\((\d+)px/, `${F} ${size} root.marginBottom`),
      bottomMinus: numIn(mb, /−\s*(\d+)px/, `${F} ${size} root.marginBottom`),
      padX: len(v['root.paddingX'], `${F} ${size} root.paddingX`),
      padY: len(v['root.paddingY'], `${F} ${size} root.paddingY`),
      add: len(v['addButton.size'], `${F} ${size} addButton.size`),
      addIcon: len(v['addIcon.size'], `${F} ${size} addIcon.size`),
      labels: !labelDisplay.includes('sr-only'),
    };
  }
  // 본문 아래 여백 — "바의 아래 자리 + 66 + 24": 66 이 펼친 높이와 같은지, 24 를 읽는다
  const inset = String(unbox(b['bodyInset.paddingBottom']));
  same(numIn(inset, /\+\s*(\d+)\s*\+/, `${F} bodyInset.paddingBottom`), sizes.regular.h, `${F} bodyInset — 펼친 높이`);
  const notif = notifLook(brand);
  const shrink = numIn(behaviorRow('bottom-navigation', '아래로 스크롤'), /(\d+)\s*이상/, 'bottom-navigation.md 아래로 스크롤');
  const up = behaviorRow('bottom-navigation', '위로 스크롤');
  return {
    maxWidth: len(b['root.maxWidth'], `${F} root.maxWidth`),
    radius: len(b['root.radius'], `${F} root.radius`),
    bg: tok(b['root.background'], brand, `${F} root.background`),
    shadow: shadowOf(b['root.shadow'], `${F} root.shadow`),
    border: { color: tok(b['root.borderColor'], brand, `${F} root.borderColor`), width: len(b['root.borderWidth'], `${F} root.borderWidth`) },
    columns: Number(unbox(b['root.columns'])),
    gap: len(b['root.gap'], `${F} root.gap`),
    z: Number(unbox(b['root.zIndex'])),
    sizes,
    item: { gap: len(b['item.gap'], `${F} item.gap`) },
    icon: {
      size: len(b['icon.size'], `${F} icon.size`),
      fg: tok(b['icon.color'], brand, `${F} icon.color`),
      stroke: len(b['icon.strokeWidth'], `${F} icon.strokeWidth`),
      selFg: tok(sel['icon.color'], brand, `${F} selected icon.color`),
      selStroke: len(sel['icon.strokeWidth'], `${F} selected icon.strokeWidth`),
    },
    label: { type: typeOf(b['label.typography'], `${F} label.typography`), weight: weightOf(b['label.fontWeight'], `${F} label.fontWeight`), fg: tok(b['label.foreground'], brand, `${F} label.foreground`), selFg: tok(sel['label.foreground'], brand, `${F} selected label.foreground`) },
    add: { bg: tok(b['addButton.background'], brand, `${F} addButton.background`), pressBg: tok(pr['addButton.background'], brand, `${F} pressed addButton.background`), iconColor: tok(b['addIcon.color'], brand, `${F} addIcon.color`), iconStroke: len(b['addIcon.strokeWidth'], `${F} addIcon.strokeWidth`) },
    inset: { gap: numIn(inset, /\+\s*\d+\s*\+\s*(\d+)/, `${F} bodyInset.paddingBottom`) },
    ring: { ...ringOf(fo, brand, F), radius: len(fo['focusRing.radius'], `${F} focusRing.radius`), addOffset: numIn(noteOf(fo['focusRing.offset']), /원 바깥\s*(\d+)/, `${F} focusRing.offset 비고`) },
    press: withMotion(pressOf(pr['item.scale'], `${F} pressed item.scale`), motionPair(pr['item.scaleDuration'], pr['item.scaleEasing'], `${F} 누름`)),
    motion: motionPair(b['root.transitionDuration'], b['root.transitionEasing'], `${F} 펼침 ↔ 줄어듦`),
    scroll: { shrink, expand: numIn(up, /(\d+)\s*이상/, 'bottom-navigation.md 위로 스크롤'), top: numIn(up, /맨 위\s*(\d+)/, 'bottom-navigation.md 맨 위') },
    dot: { size: notif.dot.size, top: notif.dot.top, right: notif.dot.right, color: { name: notif.dot.color.name, light: notif.dot.color.light, dark: notif.dot.color.dark } },
  };
}

// ── Side Navigation ─────────────────────────────────────────
function sideLook(brand: Brand): SideNavLook {
  const F = 'side-navigation.yaml';
  const spec = loadComponentSpec('side-navigation');
  sameSet(axisValues(spec, 'collapsed'), ['expanded', 'collapsed'], `${F} collapsed`);
  sameSet(axisValues(spec, 'current'), ['none', 'current'], `${F} current`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'open', 'disabled'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  const op = resolveState(spec, {}, 'open');
  const cur = resolveState(spec, { current: 'current' }, 'enabled');
  const curHov = resolveState(spec, { current: 'current' }, 'hovered');
  const col = resolveState(spec, { collapsed: 'collapsed' }, 'enabled');
  same(numIn(String(unbox(op['chevron.rotate'])), /(\d+)deg/, `${F} open chevron.rotate`), 180, `${F} 펼친 꺾쇠 회전`);
  // 지금 항목은 마우스를 올려도 바탕이 그대로다 — 그림은 지금 바탕 하나로 그린다
  if (String(unbox(curHov['item.background'])) !== String(unbox(cur['item.background']))) throw new Error(`${F} 지금 항목의 호버 바탕이 지금 바탕과 다르다 — 그림을 고친다`);
  const scrollPad = String(unbox(b['content.scrollPadding']));
  const flyoutMotion = { open: motionOf('side-navigation', '펼침 메뉴 — 열림'), close: motionOf('side-navigation', '펼침 메뉴 — 닫힘') };
  const trigger = len(b['trigger.size'], `${F} trigger.size`);
  return {
    width: len(b['root.width'], `${F} root.width`),
    collapsedWidth: len(col['root.width'], `${F} collapsed root.width`),
    bg: tok(b['root.background'], brand, `${F} root.background`),
    border: { color: tok(b['root.borderColor'], brand, `${F} root.borderColor`), width: len(b['root.borderWidth'], `${F} root.borderWidth`) },
    motion: motionPair(b['root.transitionDuration'], b['root.transitionEasing'], `${F} 펼침 ↔ 접힘`),
    header: { minH: len(b['header.minHeight'], `${F} header.minHeight`), pad: len(b['header.padding'], `${F} header.padding`) },
    logo: { size: len(b['logo.size'], `${F} logo.size`), gap: len(b['logo.gap'], `${F} logo.gap`), type: typeOf(b['logo.typography'], `${F} logo.typography`), weight: weightOf(b['logo.fontWeight'], `${F} logo.fontWeight`), fg: tok(b['logo.foreground'], brand, `${F} logo.foreground`), marginLeft: len(b['logo.marginLeft'], `${F} logo.marginLeft`) },
    trigger: {
      size: trigger,
      radius: len(b['trigger.radius'], `${F} trigger.radius`),
      icon: len(b['trigger.iconSize'], `${F} trigger.iconSize`),
      fg: tok(b['trigger.color'], brand, `${F} trigger.color`),
      top: len(b['trigger.top'], `${F} trigger.top`),
      right: len(b['trigger.right'], `${F} trigger.right`),
      rightCollapsed: len(col['trigger.right'], `${F} collapsed trigger.right`),
      touch: numIn(String(unbox(b['trigger.touchTarget'])), /(\d+)\s*×/, `${F} trigger.touchTarget`),
      hoverBg: tok(hov['trigger.background'], brand, `${F} hovered trigger.background`),
      pressBg: tok(pr['trigger.background'], brand, `${F} pressed trigger.background`),
    },
    content: {
      padTop: len(b['content.paddingTop'], `${F} content.paddingTop`),
      padX: len(b['content.paddingX'], `${F} content.paddingX`),
      padBottom: len(b['content.paddingBottom'], `${F} content.paddingBottom`),
      gap: len(b['content.gap'], `${F} content.gap`),
      gapCollapsed: len(col['content.gap'], `${F} collapsed content.gap`),
      scrollTop: numIn(scrollPad, /위\s*(\d+)px/, `${F} content.scrollPadding`),
      scrollBottom: numIn(scrollPad, /아래\s*(\d+)px/, `${F} content.scrollPadding`),
    },
    divider: { h: len(b['divider.height'], `${F} divider.height`), color: tok(b['divider.background'], brand, `${F} divider.background`), motion: motionPair(b['divider.transitionDuration'], b['divider.transitionEasing'], `${F} divider`) },
    fog: { mask: proseValue(String(unbox(b['fog.mask'])).replace(/^\$/, '')), bottom: numIn(String(unbox(b['fog.size'])), /아래\s*(\d+)px/, `${F} fog.size`) },
    group: { type: typeOf(b['groupLabel.typography'], `${F} groupLabel.typography`), weight: weightOf(b['groupLabel.fontWeight'], `${F} groupLabel.fontWeight`), fg: tok(b['groupLabel.foreground'], brand, `${F} groupLabel.foreground`), pad: len(b['groupLabel.padding'], `${F} groupLabel.padding`) },
    groupDivider: { h: len(col['groupDivider.height'], `${F} groupDivider.height`), color: tok(col['groupDivider.background'], brand, `${F} groupDivider.background`), marginY: len(col['groupDivider.marginY'], `${F} groupDivider.marginY`), marginX: len(col['groupDivider.marginX'], `${F} groupDivider.marginX`) },
    item: {
      minH: len(b['item.minHeight'], `${F} item.minHeight`),
      padX: len(b['item.paddingX'], `${F} item.paddingX`),
      padXCollapsed: len(col['item.paddingX'], `${F} collapsed item.paddingX`),
      widthCollapsed: len(col['item.width'], `${F} collapsed item.width`),
      gap: len(b['item.gap'], `${F} item.gap`),
      radius: len(b['item.radius'], `${F} item.radius`),
      hoverBg: tok(hov['item.background'], brand, `${F} hovered item.background`),
      pressBg: tok(pr['item.background'], brand, `${F} pressed item.background`),
      currentBg: tok(cur['item.background'], brand, `${F} current item.background`),
    },
    icon: { size: len(b['itemIcon.size'], `${F} itemIcon.size`), fg: tok(b['itemIcon.color'], brand, `${F} itemIcon.color`), currentFg: tok(cur['itemIcon.color'], brand, `${F} current itemIcon.color`), disabledFg: tok(di['itemIcon.color'], brand, `${F} disabled itemIcon.color`) },
    label: {
      type: typeOf(b['itemLabel.typography'], `${F} itemLabel.typography`),
      weight: weightOf(b['itemLabel.fontWeight'], `${F} itemLabel.fontWeight`),
      fg: tok(b['itemLabel.foreground'], brand, `${F} itemLabel.foreground`),
      currentFg: tok(cur['itemLabel.foreground'], brand, `${F} current itemLabel.foreground`),
      disabledFg: tok(di['itemLabel.foreground'], brand, `${F} disabled itemLabel.foreground`),
      padY: len(b['itemLabel.paddingY'], `${F} itemLabel.paddingY`),
    },
    chevron: { size: len(b['chevron.size'], `${F} chevron.size`), fg: tok(b['chevron.color'], brand, `${F} chevron.color`), motion: motionPair(b['chevron.transitionDuration'], b['chevron.transitionEasing'], `${F} chevron`) },
    // 모션 줄이기 — 높이 움직임 없이 하위 목록만 서서히(motion "하위 펼침 — 모션 줄이기")
    sub: { minH: len(b['subItem.minHeight'], `${F} subItem.minHeight`), padLeft: len(b['subItem.paddingLeft'], `${F} subItem.paddingLeft`), motion: motionOf('side-navigation', '하위 펼침'), reduce: motionOf('side-navigation', '하위 펼침 — 모션 줄이기') },
    footer: { pad: len(b['footer.padding'], `${F} footer.padding`) },
    flyout: {
      width: len(b['flyout.width'], `${F} flyout.width`),
      bg: tok(b['flyout.background'], brand, `${F} flyout.background`),
      radius: len(b['flyout.radius'], `${F} flyout.radius`),
      shadow: shadowOf(b['flyout.shadow'], `${F} flyout.shadow`),
      padY: len(b['flyout.paddingY'], `${F} flyout.paddingY`),
      offset: len(b['flyout.offset'], `${F} flyout.offset`),
      openDelay: numIn(String(unbox(b['flyout.openDelay'])), /(\d+)ms/, `${F} flyout.openDelay`),
      closeDelay: numIn(String(unbox(b['flyout.closeDelay'])), /(\d+)ms/, `${F} flyout.closeDelay`),
      z: Number(unbox(b['flyout.zIndex'])),
      label: { type: typeOf(b['flyoutLabel.typography'], `${F} flyoutLabel.typography`), weight: weightOf(b['flyoutLabel.fontWeight'], `${F} flyoutLabel.fontWeight`), fg: tok(b['flyoutLabel.foreground'], brand, `${F} flyoutLabel.foreground`), padY: len(b['flyoutLabel.paddingY'], `${F} flyoutLabel.paddingY`), padX: len(b['flyoutLabel.paddingX'], `${F} flyoutLabel.paddingX`) },
      item: {
        minH: len(b['flyoutItem.minHeight'], `${F} flyoutItem.minHeight`),
        padX: len(b['flyoutItem.paddingX'], `${F} flyoutItem.paddingX`),
        type: typeOf(b['flyoutItem.typography'], `${F} flyoutItem.typography`),
        weight: weightOf(b['flyoutItem.fontWeight'], `${F} flyoutItem.fontWeight`),
        fg: tok(b['flyoutItem.foreground'], brand, `${F} flyoutItem.foreground`),
        insetX: len(b['flyoutItem.insetX'], `${F} flyoutItem.insetX`),
        radius: len(b['flyoutItem.radius'], `${F} flyoutItem.radius`),
        hoverBg: tok(hov['flyoutItem.background'], brand, `${F} hovered flyoutItem.background`),
        currentBg: tok(cur['flyoutItem.background'], brand, `${F} current flyoutItem.background`),
      },
      motion: flyoutMotion,
    },
    tooltip: { openDelay: numIn(String(unbox(b['tooltip.openDelay'])), /(\d+)ms/, `${F} tooltip.openDelay`), closeDelay: numIn(String(unbox(b['tooltip.closeDelay'])), /(\d+)ms/, `${F} tooltip.closeDelay`) },
    ring: { ...ringOf(fo, brand, F), radius: len(fo['focusRing.radius'], `${F} focusRing.radius`) },
    press: withMotion(pressOf(pr['item.scale'], `${F} pressed item.scale`), motionPair(pr['item.scaleDuration'], pr['item.scaleEasing'], `${F} 누름`)),
  };
}

// ── Side Panel ──────────────────────────────────────────────
function panelLook(brand: Brand): SidePanelLook {
  const F = 'side-panel.yaml';
  const spec = loadComponentSpec('side-panel');
  sameSet(axisValues(spec, 'side'), PANEL_SIDES, `${F} side`);
  sameSet(axisValues(spec, 'size'), PANEL_SIZES, `${F} size`);
  sameSet(axisValues(spec, 'scrollFog'), ['off', 'on'], `${F} scrollFog`);
  sameSet(stateNames(spec), ['enabled', 'scrolled', 'pressed', 'focused'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  // 왼쪽 규칙의 값 — 겹치는 순서로 풀면 뒤의 크기 규칙(기본 medium 720)이 왼쪽 폭 80% 를 덮는다(스펙 문제로 보고). 크기는 오른쪽만이라 왼쪽 규칙을 그대로 읽는다
  const leftRule = must(spec.rules.find((r) => r.when?.side === 'left' && Object.keys(r.when).length === 1), `${F} side: left 규칙`);
  const left = Object.fromEntries(Object.entries((leftRule.enabled ?? {}) as Record<string, Record<string, unknown>>).flatMap(([slot, props]) => Object.entries(props).map(([k, v]) => [`${slot}.${k}`, v]))) as Vals;
  const fog = resolveState(spec, { scrollFog: 'on' }, 'enabled');
  if (len(b['root.radius'], `${F} root.radius`) !== 0 || String(unbox(b['root.shadow'])) !== 'none') throw new Error(`${F} — 패널에 모서리 · 그림자가 생겼다(그림은 평평하게 그린다)`);
  const widths = {} as SidePanelLook['widths'];
  for (const size of PANEL_SIZES) widths[size] = len(resolveState(spec, { size }, 'enabled')['root.width'], `${F} ${size} root.width`);
  const ratio = (raw: unknown, what: string) => numIn(String(unbox(raw)), /(\d+)%/, what) / 100;
  const size = len(b['closeButton.size'], `${F} closeButton.size`);
  const touch = String(unbox(b['closeButton.touchTarget']));
  const p = ps();
  const closeScale = String(unbox(pr['closeButton.scale']));
  same(numIn(closeScale, /(\d+)px/, `${F} pressed closeButton.scale`), p.distance, `${F} 닫기 버튼 누름 거리`);
  const close: OvClose = {
    kind: 'ghost',
    size,
    radius: len(b['closeButton.radius'], `${F} closeButton.radius`),
    bg: null,
    bgPressed: tok(pr['closeButton.background'], brand, `${F} pressed closeButton.background`),
    icon: len(b['closeButton.iconSize'], `${F} closeButton.iconSize`),
    color: tok(b['closeButton.color'], brand, `${F} closeButton.color`),
    top: len(b['closeButton.top'], `${F} closeButton.top`),
    right: len(b['closeButton.right'], `${F} closeButton.right`),
    target: numIn(touch, /(\d+)\s*×/, `${F} closeButton.touchTarget`),
    scale: p.ratio(size, size),
    motion: { color: motionPair(b['closeButton.transitionDuration'], b['closeButton.transitionEasing'], `${F} closeButton`), scale: motionOf('side-panel', '누름 — 닫기 버튼') },
  };
  const drag = behaviorRow('side-panel', '붙은 쪽으로 끌기');
  const dim = (k: 'light' | 'dark') => {
    const raw = b['overlay.background'] as { value: string; dark: string };
    return proseValue(String(k === 'light' ? raw.value : raw.dark).replace(/^\$/, ''));
  };
  const fogSize = String(unbox(fog['fog.size']));
  const rm = reducedMotion();
  return {
    dim: { name: 'overlay-dim', light: dim('light'), dark: dim('dark') },
    z: { dim: Number(unbox(b['overlay.zIndex'])), surface: Number(unbox(b['root.zIndex'])) },
    maxRatio: ratio(b['root.maxWidth'], `${F} root.maxWidth`),
    leftRatio: ratio(left['root.width'], `${F} left root.width`),
    widths,
    defaults: { side: must(spec.defaults?.side, `${F} defaults.side`) as SidePanelLook['defaults']['side'], size: must(spec.defaults?.size, `${F} defaults.size`) as SidePanelLook['defaults']['size'] },
    bg: tok(b['root.background'], brand, `${F} root.background`),
    header: { padTop: len(b['header.paddingTop'], `${F} header.paddingTop`), padX: len(b['header.paddingX'], `${F} header.paddingX`), padBottom: len(b['header.paddingBottom'], `${F} header.paddingBottom`), minH: len(b['header.minHeight'], `${F} header.minHeight`), gap: len(b['header.gap'], `${F} header.gap`) },
    title: { ...typeOf(b['title.typography'], `${F} title.typography`), fontWeight: weightOf(b['title.fontWeight'], `${F} title.fontWeight`), color: tok(b['title.foreground'], brand, `${F} title.foreground`) },
    description: { ...typeOf(b['description.typography'], `${F} description.typography`), fontWeight: weightOf(b['description.fontWeight'], `${F} description.fontWeight`), color: tok(b['description.foreground'], brand, `${F} description.foreground`) },
    close,
    divider: { h: len(b['divider.height'], `${F} divider.height`), color: tok(b['divider.background'], brand, `${F} divider.background`), motion: motionPair(b['divider.transitionDuration'], b['divider.transitionEasing'], `${F} divider`) },
    body: { padX: len(b['body.paddingX'], `${F} body.paddingX`), padXLeft: len(left['body.paddingX'], `${F} left body.paddingX`), padBottom: len(b['body.paddingBottom'], `${F} body.paddingBottom`) },
    footer: {
      padTop: len(b['footer.paddingTop'], `${F} footer.paddingTop`),
      padX: len(b['footer.paddingX'], `${F} footer.paddingX`),
      padBottom: len(b['footer.paddingBottom'], `${F} footer.paddingBottom`),
      gap: len(b['footer.gap'], `${F} footer.gap`),
      justify: String(unbox(b['footer.justifyContent'])),
      buttonSize: must(/^([a-z]+)/.exec(String(unbox(b['footer.buttonSize'])))?.[1], `${F} footer.buttonSize`),
    },
    fog: {
      top: numIn(fogSize, /위\s*(\d+)px/, `${F} fog.size`),
      bottom: numIn(fogSize, /아래\s*(\d+)px/, `${F} fog.size`),
      padTop: len(fog['body.paddingTop'], `${F} on body.paddingTop`),
      padBottom: len(fog['body.paddingBottom'], `${F} on body.paddingBottom`),
      mask: proseValue(String(unbox(fog['fog.mask'])).replace(/^\$/, '')),
    },
    ring: ringOf(fo, brand, F),
    motion: { open: motionOf('side-panel', '열림 — 패널'), dimOpen: motionOf('side-panel', '열림 — 딤'), close: motionOf('side-panel', '닫힘 — 패널'), dimClose: motionOf('side-panel', '닫힘 — 딤'), reduce: { duration: `${rm.fade}ms`, easing: 'linear' } },
    drag: { velocity: numIn(drag, /([\d.]+)px\/ms/, 'side-panel.md 끌기 빠르기'), ratio: numIn(drag, /폭의\s*(\d+)%/, 'side-panel.md 끌기 비율') / 100 },
  };
}

// ── Pagination ──────────────────────────────────────────────
function pageLook(brand: Brand): PaginationLook {
  const F = 'pagination.yaml';
  const spec = loadComponentSpec('pagination');
  sameSet(axisValues(spec, 'current'), ['other', 'current'], `${F} current`);
  sameSet(axisValues(spec, 'count'), ['regular', 'narrow'], `${F} count`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  const cur = resolveState(spec, { current: 'current' }, 'enabled');
  const curPr = resolveState(spec, { current: 'current' }, 'pressed');
  const curHov = resolveState(spec, { current: 'current' }, 'hovered');
  const curDi = resolveState(spec, { current: 'current' }, 'disabled');
  const size = len(b['item.size'], `${F} item.size`);
  same(len(b['arrow.size'], `${F} arrow.size`), size, `${F} 화살표 칸 — 번호 칸`);
  same(len(b['ellipsis.size'], `${F} ellipsis.size`), size, `${F} 생략 칸 — 번호 칸`);
  same(len(b['empty.size'], `${F} empty.size`), size, `${F} 빈 칸 — 번호 칸`);
  if (String(unbox(curHov['item.background'])) !== String(unbox(curPr['item.background']))) throw new Error(`${F} 지금 쪽의 호버 · 누름 바탕이 다르다 — 그림을 고친다`);
  const slots = (count: 'regular' | 'narrow') => len(resolveState(spec, { count }, 'enabled')['root.width'], `${F} ${count} root.width`) / size;
  const desc = String(spec.variants.count && !Array.isArray(spec.variants.count) ? (spec.variants.count as Record<string, string>).regular : '');
  const breakpoint = numIn(desc, /(\d+)\s*이상/, `${F} count.regular 설명`);
  same(breakpoint, parseFloat(proseValue('breakpoint-sm')), `${F} 칸 수 문턱 — breakpoint-sm`);
  const touch = String(unbox(b['item.touchTarget']));
  same(numIn(touch, /^(\d+)\s*×/, `${F} item.touchTarget`), size, `${F} 누르는 영역 폭 — 칸 폭`);
  return {
    gap: len(b['root.gap'], `${F} root.gap`),
    marginTop: len(b['root.marginTop'], `${F} root.marginTop`),
    slots: { regular: slots('regular'), narrow: slots('narrow'), breakpoint },
    cell: {
      size,
      radius: len(b['item.radius'], `${F} item.radius`),
      touchH: numIn(touch, /×\s*(\d+)/, `${F} item.touchTarget`),
      hoverBg: tok(hov['item.background'], brand, `${F} hovered item.background`),
      pressBg: tok(pr['item.background'], brand, `${F} pressed item.background`),
      currentBg: tok(cur['item.background'], brand, `${F} current item.background`),
      currentFg: tok(cur['label.foreground'], brand, `${F} current label.foreground`),
      currentPressBg: tok(curPr['item.background'], brand, `${F} current pressed item.background`),
      currentDisabledBg: tok(curDi['item.background'], brand, `${F} current disabled item.background`),
    },
    label: { type: typeOf(b['label.typography'], `${F} label.typography`), weight: weightOf(b['label.fontWeight'], `${F} label.fontWeight`), fg: tok(b['label.foreground'], brand, `${F} label.foreground`), disabledFg: tok(di['label.foreground'], brand, `${F} disabled label.foreground`) },
    arrow: { icon: len(b['arrow.iconSize'], `${F} arrow.iconSize`), fg: tok(b['arrow.color'], brand, `${F} arrow.color`), disabledFg: tok(di['arrow.color'], brand, `${F} disabled arrow.color`) },
    ellipsis: { icon: len(b['ellipsis.iconSize'], `${F} ellipsis.iconSize`), fg: tok(b['ellipsis.color'], brand, `${F} ellipsis.color`) },
    ring: ringOf(fo, brand, F),
    press: withMotion(pressOf(pr['item.scale'], `${F} pressed item.scale`, size), motionPair(pr['item.scaleDuration'], pr['item.scaleEasing'], `${F} 누름`)),
    color: motionPair(b['item.transitionDuration'], b['item.transitionEasing'], `${F} 바탕 색`),
  };
}

// ── Table Pagination ────────────────────────────────────────
function tableLook(brand: Brand): TablePaginationLook {
  const F = 'table-pagination.yaml';
  const spec = loadComponentSpec('table-pagination');
  sameSet(axisValues(spec, 'total'), ['known', 'unknown', 'empty'], `${F} total`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const di = resolveState(spec, {}, 'disabled');
  // 빈 표(0개)는 막힘 상태가 아니라 전체 수의 값 — 화살표 둘 · 범위 "0-0" 이 막힌다(Q-011-5)
  const empty = resolveState(spec, { total: 'empty' }, 'enabled');
  if (tok(empty['arrow.color'], brand, `${F} total empty arrow.color`).name !== tok(di['arrow.color'], brand, `${F} disabled arrow.color`).name) throw new Error(`${F} 빈 표의 화살표가 막힌 화살표와 다른 색이다 — 그림은 한 색으로 그린다`);
  const select = selectLook(brand);
  const height = len(b['root.height'], `${F} root.height`);
  // 두 고르기는 Select medium — 그 높이가 줄 높이와 같아야 한다(사용자 결정 2026-10-08)
  for (const slot of ['pageSize', 'pageRange']) if (!String(unbox(b[`${slot}.size`])).includes('Select medium')) throw new Error(`${F} ${slot}.size 가 Select medium 이 아니다`);
  same(select.trigger.sizes.medium.h, height, `${F} 줄 높이 — Select medium 트리거`);
  const options = [...(spec.slots.pageSize ?? '').matchAll(/(?:선택지\s*)?(\d+)(?=\s*(?:·|$))/g)].map((m) => Number(m[1])).filter((n) => n >= 5);
  if (options.length < 2) throw new Error(`${F} slots.pageSize 에서 선택지를 읽지 못했다`);
  const size = len(b['arrow.size'], `${F} arrow.size`);
  const touch = String(unbox(b['arrow.touchTarget']));
  return {
    height,
    gap: len(b['root.gap'], `${F} root.gap`),
    marginTop: len(b['root.marginTop'], `${F} root.marginTop`),
    options,
    pageSize: { minW: len(b['pageSize.minWidth'], `${F} pageSize.minWidth`), gap: len(b['pageSize.gap'], `${F} pageSize.gap`) },
    suffix: { ...typeOf(b['pageSizeSuffix.typography'], `${F} pageSizeSuffix.typography`), fontWeight: weightOf(b['pageSizeSuffix.fontWeight'], `${F} pageSizeSuffix.fontWeight`), color: tok(b['pageSizeSuffix.foreground'], brand, `${F} pageSizeSuffix.foreground`) },
    range: { minW: len(b['pageRange.minWidth'], `${F} pageRange.minWidth`), maxH: len(b['pageRange.maxHeight'], `${F} pageRange.maxHeight`), gap: len(b['pageRange.gap'], `${F} pageRange.gap`), disabledFg: tok(empty['pageRange.foreground'], brand, `${F} total empty pageRange.foreground`) },
    total: { ...typeOf(b['total.typography'], `${F} total.typography`), fontWeight: weightOf(b['total.fontWeight'], `${F} total.fontWeight`), color: tok(b['total.foreground'], brand, `${F} total.foreground`) },
    arrow: {
      size,
      radius: len(b['arrow.radius'], `${F} arrow.radius`),
      icon: len(b['arrow.iconSize'], `${F} arrow.iconSize`),
      fg: tok(b['arrow.color'], brand, `${F} arrow.color`),
      disabledFg: tok(di['arrow.color'], brand, `${F} disabled arrow.color`),
      hoverBg: tok(hov['arrow.background'], brand, `${F} hovered arrow.background`),
      pressBg: tok(pr['arrow.background'], brand, `${F} pressed arrow.background`),
      touchH: numIn(touch, /×\s*(\d+)/, `${F} arrow.touchTarget`),
    },
    ring: ringOf(fo, brand, F),
    press: withMotion(pressOf(pr['arrow.scale'], `${F} pressed arrow.scale`, size), motionPair(pr['arrow.scaleDuration'], pr['arrow.scaleEasing'], `${F} 누름`)),
    color: motionPair(b['arrow.transitionDuration'], b['arrow.transitionEasing'], `${F} 바탕 색`),
    select,
  };
}

// ── 끝없이 불러오기 ─────────────────────────────────────────
function listLook(brand: Brand): InfiniteListLook {
  const F = 'infinite-list.yaml';
  const spec = loadComponentSpec('infinite-list');
  sameSet(axisValues(spec, 'status'), LIST_STATUS, `${F} status`);
  const b = resolveState(spec, {}, 'enabled');
  const lo = resolveState(spec, { status: 'loading' }, 'enabled');
  const er = resolveState(spec, { status: 'error' }, 'enabled');
  const en = resolveState(spec, { status: 'end' }, 'enabled');
  const desc = (k: string) => String((spec.variants.status as Record<string, string>)[k]);
  const quote = (s: string, what: string) => must(/"([^"]+)"/.exec(s)?.[1], what);
  const showAfter = numIn(noteOf(lo['progress.size']), /(\d+)초/, `${F} loading progress.size 비고`) * 1000;
  same(showAfter, loadingKit(brand).skeleton.region.showAfter, `${F} 원이 보이는 때 — skeleton 의 기다리는 동안`);
  if (String(unbox(er['message.typography'])) !== String(unbox(en['message.typography']))) throw new Error(`${F} 못 불러옴 · 끝 글자가 다르다 — 그림은 한 글자로 그린다`);
  const retry = /^([a-z]+)\s+\d+/.exec(String(unbox(er['retryButton.buttonSize'])))?.[1];
  const variant = /Button\s+([a-zA-Z]+)\s/.exec(noteOf(er['retryButton.buttonSize']))?.[1];
  const retryText = quote(noteOf(er['retryButton.buttonSize']), `${F} retryButton 글`);
  return {
    padY: len(b['root.paddingY'], `${F} root.paddingY`),
    threshold: len(b['sentinel.threshold'], `${F} sentinel.threshold`),
    showAfter,
    circle: len(lo['progress.size'], `${F} loading progress.size`),
    message: { ...typeOf(er['message.typography'], `${F} message.typography`), fontWeight: weightOf(er['message.fontWeight'], `${F} message.fontWeight`), errorFg: tok(er['message.foreground'], brand, `${F} error message.foreground`), endFg: tok(en['message.foreground'], brand, `${F} end message.foreground`) },
    texts: { error: quote(desc('error'), `${F} status.error 글`), end: quote(desc('end'), `${F} status.end 글`), retry: retryText },
    retry: { look: buttonLook({ variant: must(variant, `${F} retryButton 변형`), size: must(retry, `${F} retryButton 크기`) }, brand), marginTop: len(er['retryButton.marginTop'], `${F} retryButton.marginTop`) },
  };
}

// ── Floating Action Button ──────────────────────────────────
function fabLook(brand: Brand): FabLook {
  const F = 'floating-action-button.yaml';
  const spec = loadComponentSpec('floating-action-button');
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const pr = resolveState(spec, {}, 'pressed');
  const hov = resolveState(spec, {}, 'hovered');
  const fo = resolveState(spec, {}, 'focused');
  const size = len(b['root.size'], `${F} root.size`);
  if (String(unbox(hov['root.background'])) !== String(unbox(pr['root.background']))) throw new Error(`${F} 호버 · 누름 바탕이 다르다 — 그림을 고친다`);
  return {
    size,
    radius: len(b['root.radius'], `${F} root.radius`),
    bg: tok(b['root.background'], brand, `${F} root.background`),
    pressBg: tok(pr['root.background'], brand, `${F} pressed root.background`),
    shadow: shadowOf(b['root.shadow'], `${F} root.shadow`),
    right: len(b['root.marginRight'], `${F} root.marginRight`),
    bottom: len(b['root.marginBottom'], `${F} root.marginBottom`),
    z: Number(unbox(b['root.zIndex'])),
    icon: { size: len(b['icon.size'], `${F} icon.size`), color: tok(b['icon.color'], brand, `${F} icon.color`), stroke: len(b['icon.strokeWidth'], `${F} icon.strokeWidth`) },
    ring: ringOf(fo, brand, F),
    press: withMotion(pressOf(pr['root.scale'], `${F} pressed root.scale`, size), motionPair(pr['root.scaleDuration'], pr['root.scaleEasing'], `${F} 누름`)),
    color: motionPair(b['root.transitionDuration'], b['root.transitionEasing'], `${F} 색`),
  };
}

const cache = new Map<Brand, NavKit>();
export function navKit(brand: Brand = 'desk'): NavKit {
  const hit = cache.get(brand);
  if (hit) return hit;
  const kit: NavKit = {
    brand,
    top: topLook(brand),
    tab: tabLook(brand),
    side: sideLook(brand),
    panel: panelLook(brand),
    page: pageLook(brand),
    table: tableLook(brand),
    list: listLook(brand),
    fab: fabLook(brand),
    tone: Object.fromEntries(NAV_TONES.map((n) => [n, named(n, brand)])) as NavKit['tone'],
    gutter: len('$spacing-global-gutter', 'spacing-global-gutter'),
    margin: parseFloat(proseValue('layout-margin')),
  };
  // 상단 바 · 탭 바의 알림 점은 같은 Notification Badge small 이다
  const t = kit.top.dot;
  const d = kit.tab.dot;
  if (t.size !== d.size || t.top !== d.top || t.right !== d.right || t.color.light !== d.color.light) throw new Error('top-navigation.yaml 의 알림 점이 notification-badge.yaml(icon · small)과 다르다');
  cache.set(brand, kit);
  return kit;
}
