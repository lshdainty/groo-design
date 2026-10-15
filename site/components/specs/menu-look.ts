// Menu · Menu Sheet · Help Bubble · Tooltip 의 모양 — specs/components/menu · menu-sheet · help-bubble.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(menu-view)은 이 값만 받아 그린다 — 폭 · 높이 · 여백 · 글자 · 색 · 시간을 그림에 따로 적지 않는다.
// 비고 속 수(설명이 있을 때의 높이 · 몸통과의 거리 · 끝 모서리 · 누르는 영역)도 여기서 읽고 값끼리 맞는지 확인한다 — 문장이 바뀌면 빌드가 멈춘다.
// Menu Sheet 의 딤 · 쌓임 · 모션 · 끌어 닫기는 Bottom Sheet 와 같다고 스펙이 말한다 — 같은지 확인하고 overlay-live 의 시트를 그대로 쓴다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadComponentSpec, num, resolveState, stateNames, axisValues, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, pressScale, proseValue, type Brand } from '@/lib/design-tokens';
import { overlayLook } from './overlay-look';
import { MENU_TONES, type BubbleLook, type MColor, type MMotion, type MPress, type MRing, type MText, type MType, type MenuKit, type MenuLook, type MenuSheetLook, type SwipeKind, type SwipeLook } from './menu-shared';
import { cardFace } from './card-face';
export * from './menu-shared';

type Spec = 'menu' | 'menu-sheet' | 'help-bubble' | 'swipe-actions';
type Vals = Record<string, unknown>;
const REPO = join(process.cwd(), '..');

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`메뉴 YAML 에 ${what} 이 없다`);
  return v;
};
// '16px' · '$spacing-x3' · '$radius-full' → 수
const len = (raw: unknown, what: string) => {
  const v = String(tokenValue(must(raw, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what);
};
// 값 · 비고 글자 속 수 — 문장이 바뀌면 여기서 멈춘다(그림이 낡지 않게)
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`메뉴 YAML 의 ${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
const same = (a: unknown, b: unknown, what: string) => {
  if (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) > 1e-6 : JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what} — ${JSON.stringify(a)} 와 ${JSON.stringify(b)} 가 다르다`);
};
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — menu-look.ts 를 고친다`);
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
function named(name: string, brand: Brand): MColor {
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name: varName(name, brand), light: color(name, brand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): MColor {
  const v = String(unbox(must(raw, what))).trim();
  if (v === 'transparent') return { light: 'transparent', dark: 'transparent' };
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`메뉴 YAML 의 ${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
// { value: $color-a, dark: $color-b } — 다크 값이 따로 있는 색(스와이프 위험 라벨)
function tokPair(raw: unknown, brand: Brand, what: string): MColor {
  const box = must(raw, what) as { value?: unknown; dark?: unknown };
  if (!box || typeof box !== 'object' || box.dark === undefined) return tok(raw, brand, what);
  const l = tok(box.value, brand, `${what} 라이트`);
  const d = tok(box.dark, brand, `${what} 다크`);
  return { light: l.light, dark: d.dark === d.light ? d.light : d.dark };
}
function shadowOf(raw: unknown, what: string): MColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$(shadow-s\d)$/.exec(v);
  if (!m) throw new Error(`메뉴 YAML 의 ${what} 이 그림자 토큰이 아니다(${v})`);
  return { name: m[1], light: proseValue(m[1]), dark: proseValue(`${m[1]}-dark`) };
}
function type(raw: unknown, weight: unknown, what: string): MType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`메뉴 YAML 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? "'Pretendard Variable', Pretendard, sans-serif" };
}
const text = (v: Vals, slot: string, brand: Brand, what: string): MText => ({ ...type(v[`${slot}.typography`], v[`${slot}.fontWeight`], `${what} ${slot}.typography`), color: tok(v[`${slot}.foreground`], brand, `${what} ${slot}.foreground`) });
const lh = (t: MType) => must(num(t.lineHeight), `줄 높이 ${t.lineHeight}`);
const motionPair = (d: unknown, e: unknown, what: string): MMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });

type MotionEntry = { duration: unknown; easing: unknown; properties?: string[]; note?: string };
function motionEntry(spec: Spec | 'bottom-sheet', name: string): MotionEntry {
  const all = (loadComponentSpec(spec) as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`${spec}.yaml 의 motion 에 "${name}" 이 없다`);
  return m;
}
const motionOf = (spec: Spec | 'bottom-sheet', name: string) => {
  const m = motionEntry(spec, name);
  return motionPair(m.duration, m.easing, `${spec} ${name}`);
};

function ringOf(focused: Vals, brand: Brand, what: string): MRing {
  return { width: len(focused['focusRing.width'], `${what} focusRing.width`), offset: len(focused['focusRing.offset'], `${what} focusRing.offset`), color: tok(focused['focusRing.color'], brand, `${what} focusRing.color`) };
}
// "콘텐츠 2px 거리 축소" · "2px 거리 축소" — 거리가 Motion 의 눌림 피드백과 같은지
function pressOf(pressed: Vals, slot: string, what: string): MPress {
  const ps = pressScale();
  same(numIn(String(unbox(must(pressed[`${slot}.scale`], `${what} pressed ${slot}.scale`))), /(\d+)px/, `${what} pressed ${slot}.scale`), ps.distance, `${what} 누름 거리 — Motion 눌림 피드백`);
  return { distance: ps.distance, widthDivisor: ps.widthDivisor, minBasis: ps.minBasis, motion: motionPair(pressed[`${slot}.scaleDuration`], pressed[`${slot}.scaleEasing`], `${what} pressed ${slot}.scale`) };
}

// specs/z-index.md 의 층 — 그 층 줄에 컴포넌트 이름이 있고, 줄의 토큰(DESIGN.md v116 — z-floating …) 값이 줄의 숫자 · YAML 과 같은지
function zLayer(layer: string, component: string, z: number) {
  const md = readFileSync(join(REPO, 'specs/z-index.md'), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith(`| **${layer}`));
  if (!row) throw new Error(`specs/z-index.md 에 ${layer} 줄이 없다`);
  if (!new RegExp(`\`${component}\``).test(row)) throw new Error(`specs/z-index.md 의 ${layer} 줄에 ${component} 가 없다`);
  // | Layer | 토큰 | z-index | 컴포넌트 | 의미 |
  const [, tokenCell = '', zCell = ''] = row.split('|').slice(1).map((c) => c.trim());
  const tokens = [...tokenCell.matchAll(/`(z-[a-z-]+)`/g)].map((m) => m[1]);
  const values = [...zCell.matchAll(/`(\d+|auto)`/g)].map((m) => m[1]);
  if (!tokens.length || tokens.length !== values.length) throw new Error(`specs/z-index.md ${layer} 줄의 토큰(${tokens.join(', ')})과 값(${values.join(', ')})이 짝이 안 맞는다`);
  tokens.forEach((t, i) => same(proseValue(t), values[i], `specs/z-index.md ${layer} 의 ${t} — DESIGN.md 토큰 값`));
  if (!values.includes(String(z))) throw new Error(`${component} 의 z-index — YAML ${z} 가 specs/z-index.md ${layer}(${tokens.map((t, i) => `${t} ${values[i]}`).join(' · ')})에 없다`);
}

// md 의 Behavior 표 한 줄
function behaviorRow(spec: string, starts: string) {
  const md = readFileSync(join(REPO, 'specs/components', `${spec}.md`), 'utf8');
  const row = md.split('\n').find((l) => l.startsWith(`| ${starts}`));
  if (!row) throw new Error(`${spec}.md 의 Behavior 에 "${starts}" 줄이 없다`);
  return row;
}

// ── Menu ──────────────────────────────────────────────────
function menuLook(brand: Brand, breakpoint: number): MenuLook {
  const spec = loadComponentSpec('menu');
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], 'menu.yaml 의 states');
  sameSet(axisValues(spec, 'tone'), ['neutral', 'critical'], 'menu.yaml 의 tone');
  const w = 'menu';
  const v = resolveState(spec, {}, 'enabled');
  const hovered = resolveState(spec, {}, 'hovered');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');
  const disabled = resolveState(spec, {}, 'disabled');
  const crit = resolveState(spec, { tone: 'critical' }, 'enabled');
  const c = (raw: unknown, what: string) => tok(raw, brand, `${w} ${what}`);

  // 줄 높이 — 위아래 여백 + 이름 줄 높이(설명이 있으면 + 사이 + 설명 줄 높이). 값 · 비고의 39 · 57 과 맞아야 한다
  const padY = len(v['item.paddingY'], `${w} item.paddingY`);
  const label = type(v['itemLabel.typography'], v['itemLabel.fontWeight'], `${w} itemLabel`);
  const desc = type(v['itemDescription.typography'], v['itemDescription.fontWeight'], `${w} itemDescription`);
  const descGap = len(v['itemDescription.gap'], `${w} itemDescription.gap`);
  const height = padY * 2 + lh(label);
  const heightDesc = height + descGap + lh(desc);
  same(len(v['item.height'], `${w} item.height`), height, `${w} 한 줄 높이 — 여백 + 줄 높이`);
  same(numIn(noteOf(v['item.height']), /설명이 있으면\s*(\d+)/, `${w} item.height 비고`), heightDesc, `${w} 설명이 있는 줄 높이`);

  // 알약 · 링 — 알약은 줄 폭 전체(0 · 모서리 0)에서 호버 · 누름에 들어온다(Q-009-3 B). 링은 다 들어온 알약 자리(좌우 들임 · 모서리)에 고정
  same(len(v['highlight.insetX'], `${w} highlight.insetX`), 0, `${w} 알약 없는 자리 들임 0`);
  same(len(v['highlight.radius'], `${w} highlight.radius`), 0, `${w} 알약 없는 자리 모서리 0`);
  const insetX = len(hovered['highlight.insetX'], `${w} hovered highlight.insetX`);
  const radius = len(hovered['highlight.radius'], `${w} hovered highlight.radius`);
  same(len(pressed['highlight.insetX'], `${w} pressed highlight.insetX`), insetX, `${w} 누름 알약 들임 — 호버와 같다`);
  same(len(pressed['highlight.radius'], `${w} pressed highlight.radius`), radius, `${w} 누름 알약 모서리 — 호버와 같다`);
  same(len(focused['focusRing.insetX'], `${w} focusRing.insetX`), insetX, `${w} 링 들임 — 알약 들임`);
  same(len(focused['focusRing.radius'], `${w} focusRing.radius`), radius, `${w} 링 모서리 — 알약 모서리`);
  same(numIn(noteOf(hovered['highlight.insetX']), /좌우\s*(\d+)/, `${w} hovered highlight.insetX 비고`), insetX, `${w} 알약 들임 비고`);
  const ringNote = noteOf(focused['focusRing.offset']);
  same(numIn(ringNote, /좌우\s*(\d+)\s*들임/, `${w} focusRing.offset 비고`), insetX, `${w} 링 자리 — 알약 들임`);
  same(numIn(ringNote, /모서리\s*(\d+)/, `${w} focusRing.offset 비고`), radius, `${w} 링 자리 — 알약 모서리`);
  same(c(hovered['highlight.background'], 'hovered highlight.background').light, c(pressed['highlight.background'], 'pressed highlight.background').light, `${w} 호버 · 누름 알약 색`);
  if (String(unbox(disabled['highlight.background'])) !== 'transparent') throw new Error('menu.yaml 의 disabled highlight.background 가 transparent 가 아니다 — menu-view 를 고친다');

  // 묶음 사이 — "묶음 사이 8 + 선 1 + 8"
  const div = { color: c(v['divider.color'], 'divider.color'), height: len(v['divider.height'], `${w} divider.height`), marginX: len(v['divider.marginX'], `${w} divider.marginX`), marginY: len(v['divider.marginY'], `${w} divider.marginY`) };
  const dn = /(\d+)\s*\+\s*선\s*(\d+)\s*\+\s*(\d+)/.exec(noteOf(v['divider.marginY']));
  if (!dn) throw new Error('menu.yaml divider.marginY 비고에서 "N + 선 N + N" 을 찾지 못했다');
  same([Number(dn[1]), Number(dn[2]), Number(dn[3])], [div.marginY, div.height, div.marginY], `${w} 묶음 사이`);
  same(numIn(noteOf(v['divider.marginX']), /좌우\s*(\d+)/, `${w} divider.marginX 비고`), div.marginX, `${w} 선 들임`);

  // 메뉴 — 트리거와 · 가장자리와, 맞추는 쪽, 높이 상한 · 하한
  const offsetRaw = v['content.offset'];
  const align = String(unbox(must(v['content.align'], 'content.align')));
  if (align !== 'start' && align !== 'end') throw new Error(`menu.yaml content.align(${align})이 start · end 가 아니다 — menu-view 의 자리 잡기를 고친다`);
  const maxRaw = must(v['content.maxHeight'], 'content.maxHeight');
  const z = Number(unbox(must(v['content.zIndex'], 'content.zIndex')));
  zLayer('L3', 'menu', z);
  const open = motionEntry('menu', '열림');
  const close = motionEntry('menu', '닫힘');
  const from = numIn((open.properties ?? []).join(' '), /scale\s*([\d.]+)\s*→\s*1/, 'menu motion "열림" properties');
  same(numIn((close.properties ?? []).join(' '), /scale\s*→\s*([\d.]+)/, 'menu motion "닫힘" properties'), from, `${w} 닫힘 배율 — 열림 시작 배율`);
  const gText = type(v['groupLabel.typography'], v['groupLabel.fontWeight'], `${w} groupLabel`);
  const gPad = len(v['groupLabel.paddingY'], `${w} groupLabel.paddingY`);
  same(motionOf('menu', '호버 알약'), motionPair(v['item.transitionDuration'], v['item.transitionEasing'], `${w} item.transition`), `${w} 호버 알약 모션 — item.transition`);
  if (String(unbox(v['item.transitionProperty'])) !== 'background-color, inset, border-radius') throw new Error('menu.yaml item.transitionProperty 가 "background-color, inset, border-radius" 가 아니다 — menu-view 를 고친다');

  return {
    breakpoint,
    content: {
      width: len(v['content.width'], `${w} content.width`),
      radius: len(v['content.radius'], `${w} content.radius`),
      padY: len(v['content.paddingY'], `${w} content.paddingY`),
      offset: len(offsetRaw, `${w} content.offset`),
      edge: numIn(noteOf(offsetRaw), /가장자리와도\s*(\d+)/, `${w} content.offset 비고`),
      align,
      maxHeight: numIn(String(unbox(maxRaw)), /(\d+)px/, `${w} content.maxHeight`),
      minHeight: numIn(noteOf(maxRaw), /(\d+)\s*보다/, `${w} content.maxHeight 비고`),
      bg: c(v['content.background'], 'content.background'),
      shadow: shadowOf(v['content.shadow'], `${w} content.shadow`),
      z,
      motion: { open: motionOf('menu', '열림'), close: motionOf('menu', '닫힘'), from },
    },
    item: {
      padY,
      padX: len(v['item.paddingX'], `${w} item.paddingX`),
      gap: len(v['item.gap'], `${w} item.gap`),
      height,
      heightDesc,
      icon: len(v['itemIcon.size'], `${w} itemIcon.size`),
      suffix: len(v['suffixIcon.size'], `${w} suffixIcon.size`),
      label,
      desc,
      descGap,
      cursor: String(unbox(must(v['item.cursor'], 'item.cursor'))),
      cursorDisabled: String(unbox(must(disabled['item.cursor'], 'disabled item.cursor'))),
      color: {
        icon: c(v['itemIcon.color'], 'itemIcon.color'),
        label: c(v['itemLabel.foreground'], 'itemLabel.foreground'),
        desc: c(v['itemDescription.foreground'], 'itemDescription.foreground'),
        suffix: c(v['suffixIcon.color'], 'suffixIcon.color'),
        critical: c(crit['itemLabel.foreground'], 'critical itemLabel.foreground'),
        disabled: c(disabled['itemLabel.foreground'], 'disabled itemLabel.foreground'),
      },
    },
    highlight: { insetX, radius, bg: c(hovered['highlight.background'], 'hovered highlight.background'), motion: motionOf('menu', '호버 알약') },
    groupLabel: { padY: gPad, padX: len(v['groupLabel.paddingX'], `${w} groupLabel.paddingX`), text: gText, color: c(v['groupLabel.foreground'], 'groupLabel.foreground'), height: gPad * 2 + lh(gText) },
    divider: div,
    ring: ringOf(focused, brand, w),
    press: pressOf(pressed, 'item', w),
  };
}

// ── Menu Sheet ────────────────────────────────────────────
function menuSheetLook(brand: Brand): MenuSheetLook {
  const spec = loadComponentSpec('menu-sheet');
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], 'menu-sheet.yaml 의 states');
  sameSet(axisValues(spec, 'layout'), ['textWithIcon', 'textOnly'], 'menu-sheet.yaml 의 layout');
  const w = 'menu-sheet';
  const v = resolveState(spec, {}, 'enabled');
  const hovered = resolveState(spec, {}, 'hovered');
  const pressed = resolveState(spec, {}, 'pressed');
  const focused = resolveState(spec, {}, 'focused');
  const disabled = resolveState(spec, {}, 'disabled');
  const crit = resolveState(spec, { tone: 'critical' }, 'enabled');
  const only = resolveState(spec, { layout: 'textOnly' }, 'enabled');
  const c = (raw: unknown, what: string) => tok(raw, brand, `${w} ${what}`);

  // Bottom Sheet 와 같은 자리 — 딤 · 쌓임 · 폭 · 높이 상한 · 모션 · 끌어 닫기. 다르면 overlay-live 의 시트를 나눠 써야 한다
  const bs = loadComponentSpec('bottom-sheet');
  const b = resolveState(bs, {}, 'enabled');
  for (const k of ['overlay.background', 'overlay.zIndex', 'root.maxWidth', 'root.background', 'root.zIndex']) same(unbox(v[k]), unbox(b[k]), `${w} ${k} — Bottom Sheet 와 같다고 했다`);
  same((v['overlay.background'] as { dark?: unknown }).dark, (b['overlay.background'] as { dark?: unknown }).dark, `${w} 다크 딤 — Bottom Sheet`);
  same(numIn(String(unbox(v['root.maxHeight'])), /(\d+)%/, `${w} root.maxHeight`), numIn(String(unbox(b['root.maxHeight'])), /(\d+)%/, 'bottom-sheet root.maxHeight'), `${w} 높이 상한 — Bottom Sheet`);
  for (const name of ['열림 — 시트', '열림 — 딤', '닫힘 — 시트', '닫힘 — 딤']) {
    same(motionOf('menu-sheet', name), motionOf('bottom-sheet', name), `${w} 모션 "${name}" — Bottom Sheet`);
    same(motionEntry('menu-sheet', name).properties, motionEntry('bottom-sheet', name).properties, `${w} 모션 "${name}" 대상 — Bottom Sheet`);
  }
  const ov = overlayLook(brand === 'hr' ? 'hr' : 'desk');
  const drag = behaviorRow('menu-sheet', '아래로 끌기');
  same(numIn(drag, /([\d.]+)px\/ms/, 'menu-sheet.md 끌기 빠르기'), ov.sheet.drag.velocity, `${w} 끌기 빠르기 — Bottom Sheet`);
  same(numIn(drag, /높이의\s*(\d+)%/, 'menu-sheet.md 끌기 비율') / 100, ov.sheet.drag.distance, `${w} 끌기 비율 — Bottom Sheet`);
  same(numIn(drag, /열린 뒤\s*([\d.]+)초/, 'menu-sheet.md 끌기 막는 시간') * 1000, ov.sheet.drag.guard, `${w} 끌기 막는 시간 — Bottom Sheet`);
  same(c(hovered['item.background'], 'hovered item.background').light, c(pressed['item.background'], 'pressed item.background').light, `${w} 호버 · 누름 바탕`);
  same(c(hovered['closeButton.background'], 'hovered closeButton.background').light, c(pressed['closeButton.background'], 'pressed closeButton.background').light, `${w} 닫기 호버 · 누름 바탕`);
  // 호버 · 누름 바탕 위의 글자 — 설명과 위험한 이름 · 아이콘이 바뀐다. 호버와 누름은 같은 색이어야 그림이 한 벌로 그린다
  const critHover = resolveState(spec, { tone: 'critical' }, 'hovered');
  const critPressed = resolveState(spec, { tone: 'critical' }, 'pressed');
  same(c(hovered['itemDescription.foreground'], 'hovered itemDescription.foreground').light, c(pressed['itemDescription.foreground'], 'pressed itemDescription.foreground').light, `${w} 호버 · 누름 설명 색`);
  for (const k of ['itemIcon.color', 'itemLabel.foreground']) same(c(critHover[k], `critical hovered ${k}`).light, c(critPressed[k], `critical pressed ${k}`).light, `${w} 호버 · 누름 위험 ${k}`);
  same(c(critPressed['itemIcon.color'], 'critical pressed itemIcon.color').light, c(critPressed['itemLabel.foreground'], 'critical pressed itemLabel.foreground').light, `${w} 누름 위험 이름 · 아이콘`);
  const icon = len(v['itemIcon.size'], `${w} itemIcon.size`);

  return {
    dim: ov.sheet.dim,
    z: { dim: Number(unbox(v['overlay.zIndex'])), surface: Number(unbox(v['root.zIndex'])) },
    maxWidth: len(v['root.maxWidth'], `${w} root.maxWidth`),
    maxHeight: numIn(String(unbox(v['root.maxHeight'])), /(\d+)%/, `${w} root.maxHeight`) / 100,
    radius: len(v['root.radius'], `${w} root.radius`),
    bg: c(v['root.background'], 'root.background'),
    pad: { top: len(v['root.paddingTop'], `${w} root.paddingTop`), x: len(v['root.paddingX'], `${w} root.paddingX`), bottom: len(v['root.paddingBottom'], `${w} root.paddingBottom`) },
    handle: {
      width: len(v['handle.width'], `${w} handle.width`),
      height: len(v['handle.height'], `${w} handle.height`),
      radius: len(v['handle.radius'], `${w} handle.radius`),
      color: c(v['handle.background'], 'handle.background'),
      top: len(v['handle.top'], `${w} handle.top`),
    },
    header: { padBottom: len(v['header.paddingBottom'], `${w} header.paddingBottom`), gap: len(v['header.gap'], `${w} header.gap`), align: String(unbox(must(v['header.textAlign'], 'header.textAlign'))) },
    title: text(v, 'title', brand, w),
    description: text(v, 'description', brand, w),
    group: { bg: c(v['group.background'], 'group.background'), radius: len(v['group.radius'], `${w} group.radius`), gap: len(v['group.gap'], `${w} group.gap`) },
    item: {
      minHeight: len(v['item.minHeight'], `${w} item.minHeight`),
      padY: len(v['item.paddingY'], `${w} item.paddingY`),
      padX: len(v['item.paddingX'], `${w} item.paddingX`),
      gap: len(v['item.gap'], `${w} item.gap`),
      icon,
      label: type(v['itemLabel.typography'], v['itemLabel.fontWeight'], `${w} itemLabel`),
      desc: type(v['itemDescription.typography'], v['itemDescription.fontWeight'], `${w} itemDescription`),
      descGap: len(v['itemDescription.gap'], `${w} itemDescription.gap`),
      cursor: String(unbox(must(v['item.cursor'], 'item.cursor'))),
      cursorDisabled: String(unbox(must(disabled['item.cursor'], 'disabled item.cursor'))),
      pressed: c(pressed['item.background'], 'pressed item.background'),
      motion: motionPair(v['item.transitionDuration'], v['item.transitionEasing'], `${w} item.transition`),
      color: {
        icon: c(v['itemIcon.color'], 'itemIcon.color'),
        label: c(v['itemLabel.foreground'], 'itemLabel.foreground'),
        desc: c(v['itemDescription.foreground'], 'itemDescription.foreground'),
        critical: c(crit['itemLabel.foreground'], 'critical itemLabel.foreground'),
        disabled: c(disabled['itemLabel.foreground'], 'disabled itemLabel.foreground'),
      },
      on: { desc: c(pressed['itemDescription.foreground'], 'pressed itemDescription.foreground'), critical: c(critPressed['itemLabel.foreground'], 'critical pressed itemLabel.foreground') },
      textOnly: { justify: String(unbox(must(only['item.justifyContent'], 'textOnly item.justifyContent'))), align: String(unbox(must(only['itemLabel.textAlign'], 'textOnly itemLabel.textAlign'))) },
    },
    divider: { color: c(v['divider.color'], 'divider.color'), height: len(v['divider.height'], `${w} divider.height`) },
    close: {
      minHeight: len(v['closeButton.minHeight'], `${w} closeButton.minHeight`),
      padX: len(v['closeButton.paddingX'], `${w} closeButton.paddingX`),
      radius: len(v['closeButton.radius'], `${w} closeButton.radius`),
      bg: c(v['closeButton.background'], 'closeButton.background'),
      bgPressed: c(pressed['closeButton.background'], 'pressed closeButton.background'),
      text: text(v, 'closeButton', brand, w),
      marginTop: len(v['closeButton.marginTop'], `${w} closeButton.marginTop`),
    },
    ring: { ...ringOf(focused, brand, w), closeOffset: len(focused['focusRing.closeButtonOffset'], `${w} focusRing.closeButtonOffset`) },
    press: pressOf(pressed, 'item', w),
  };
}

// ── Help Bubble · Tooltip ─────────────────────────────────
function bubbleLook(brand: Brand): BubbleLook {
  const spec = loadComponentSpec('help-bubble');
  sameSet(stateNames(spec), ['enabled', 'pressed', 'focused'], 'help-bubble.yaml 의 states');
  sameSet(axisValues(spec, 'opens'), ['press', 'hover'], 'help-bubble.yaml 의 opens');
  sameSet(axisValues(spec, 'closeButton'), ['hidden', 'shown'], 'help-bubble.yaml 의 closeButton');
  const w = 'help-bubble';
  const v = resolveState(spec, {}, 'enabled');
  const focused = resolveState(spec, {}, 'focused');
  const hover = resolveState(spec, { opens: 'hover' }, 'enabled');
  const cb = resolveState(spec, { opens: 'press', closeButton: 'shown' }, 'enabled');
  const cbPressed = resolveState(spec, { opens: 'press', closeButton: 'shown' }, 'pressed');
  const c = (raw: unknown, what: string) => tok(raw, brand, `${w} ${what}`);

  const padY = len(v['root.paddingY'], `${w} root.paddingY`);
  const title = text(v, 'title', brand, w);
  const description = text(v, 'description', brand, w);
  const descGap = len(v['description.gap'], `${w} description.gap`);
  const offset = len(v['root.offset'], `${w} root.offset`);
  const arrowH = len(v['arrow.height'], `${w} arrow.height`);
  same(numIn(noteOf(v['root.offset']), /몸통과는\s*(\d+)/, `${w} root.offset 비고`), offset + arrowH, `${w} 말풍선 몸통 ↔ 트리거 — 화살표 끝 거리 + 화살표 높이`);
  same(numIn(noteOf(v['root.maxWidth']), /양쪽\s*(\d+)/, `${w} root.maxWidth 비고`), len(v['root.margin'], `${w} root.margin`), `${w} 쓸 수 있는 폭 — 화면 가장자리`);
  if (!/위 0 · 오른쪽 0/.test(noteOf(cb['closeButton.size']))) throw new Error('help-bubble.yaml closeButton.size 비고에 "위 0 · 오른쪽 0" 이 없다 — menu-view 의 닫기 자리를 고친다');
  const z = Number(unbox(must(v['root.zIndex'], 'root.zIndex')));
  zLayer('L4', 'help-bubble', z);
  zLayer('L4', 'tooltip', z);

  // 닫기 버튼 — 상자 · 누르는 영역(사방 N 넓힌다) · 아이콘 자리(위 N · 오른쪽 N)
  const size = len(cb['closeButton.size'], `${w} closeButton.size`);
  const touch = String(unbox(must(cb['closeButton.touchTarget'], 'closeButton.touchTarget')));
  const hit = numIn(touch, /(\d+)\s*×/, `${w} closeButton.touchTarget`);
  same(numIn(touch, /×\s*(\d+)/, `${w} closeButton.touchTarget 세로`), hit, `${w} 닫기 누르는 영역 가로 · 세로`);
  same(numIn(noteOf(cb['closeButton.touchTarget']), /사방\s*(\d+)/, `${w} closeButton.touchTarget 비고`) * 2 + size, hit, `${w} 닫기 누르는 영역 — 상자 + 사방`);
  const iconSize = len(cb['closeButton.iconSize'], `${w} closeButton.iconSize`);
  same(numIn(noteOf(cb['closeButton.iconSize']), /위\s*(\d+)/, `${w} closeButton.iconSize 비고`), (size - iconSize) / 2, `${w} 닫기 아이콘 위 자리 — (상자 − 아이콘) ÷ 2`);
  same(numIn(noteOf(cb['closeButton.iconSize']), /오른쪽\s*(\d+)/, `${w} closeButton.iconSize 비고`), (size - iconSize) / 2, `${w} 닫기 아이콘 오른쪽 자리`);
  const ps = pressScale();
  same(numIn(String(unbox(must(cbPressed['closeButton.scale'], 'pressed closeButton.scale'))), /(\d+)px/, `${w} pressed closeButton.scale`), ps.distance, `${w} 닫기 누름 거리 — Motion 눌림 피드백`);

  // 열림 · 닫힘 지연(툴팁)
  const openDelay = numIn(String(unbox(must(hover['root.openDelay'], 'hover root.openDelay'))), /(\d+)ms/, `${w} root.openDelay`);
  const closeDelay = numIn(String(unbox(must(hover['root.closeDelay'], 'hover root.closeDelay'))), /(\d+)ms/, `${w} root.closeDelay`);
  const skipDelay = numIn(String(unbox(must(hover['root.skipDelay'], 'hover root.skipDelay'))), /(\d+)ms/, `${w} root.skipDelay`);
  if (!noteOf(hover['root.openDelay']).includes('키보드 초점은 바로')) throw new Error('help-bubble.yaml root.openDelay 비고에 "키보드 초점은 바로" 가 없다 — menu-view 의 툴팁을 고친다');
  const open = motionEntry('help-bubble', '열림');
  const lineH = lh(title);
  same(lh(description), lineH, `${w} 제목 · 설명 줄 높이(그림의 38 · 58)`);

  return {
    maxWidth: len(v['root.maxWidth'], `${w} root.maxWidth`),
    padY,
    padX: len(v['root.paddingX'], `${w} root.paddingX`),
    radius: len(v['root.radius'], `${w} root.radius`),
    bg: c(v['root.background'], 'root.background'),
    offset,
    bodyOffset: offset + arrowH,
    edge: len(v['root.margin'], `${w} root.margin`),
    z,
    arrow: {
      width: len(v['arrow.width'], `${w} arrow.width`),
      height: arrowH,
      tip: numIn(noteOf(v['arrow.height']), /끝 모서리\s*(\d+)/, `${w} arrow.height 비고`),
      pad: len(v['arrow.margin'], `${w} arrow.margin`),
    },
    title,
    description,
    descGap,
    height: padY * 2 + lineH,
    heightDesc: padY * 2 + lineH + descGap + lh(description),
    ring: { ...ringOf(focused, brand, w), rootOffset: len(focused['focusRing.rootOffset'], `${w} focusRing.rootOffset`), rootColor: tok(focused['focusRing.rootColor'], brand, `${w} focusRing.rootColor`) },
    close: {
      size,
      hit,
      icon: iconSize,
      radius: len(cb['closeButton.radius'], `${w} closeButton.radius`),
      color: c(cb['closeButton.color'], 'closeButton.color'),
      gap: numIn(noteOf(cb['closeButton.size']), /글과 이 상자 사이\s*(\d+)/, `${w} closeButton.size 비고`),
      scale: ps.ratio(size, size),
      motion: motionPair(cbPressed['closeButton.scaleDuration'], cbPressed['closeButton.scaleEasing'], `${w} pressed closeButton.scale`),
    },
    hover: { open: openDelay, close: closeDelay, skip: skipDelay },
    motion: { open: motionOf('help-bubble', '열림'), from: numIn((open.properties ?? []).join(' '), /scale\s*([\d.]+)\s*→\s*1/, 'help-bubble motion "열림" properties'), close: motionOf('help-bubble', '닫힘') },
  };
}

// ── 스와이프 트레이(swipe-actions.yaml · md) ───────────────
export function swipeLook(brand: Brand = 'desk'): SwipeLook {
  const spec = loadComponentSpec('swipe-actions');
  const v = resolveState(spec, { size: 'default' }, 'enabled');
  const w = 'swipe-actions';
  const width = noteOf(v['action.width']);
  const md = readFileSync(join(REPO, 'specs/components/swipe-actions.md'), 'utf8');
  const label = type(v['label.typography'], v['label.fontWeight'], `${w} label`);
  // 줄 높이 1.3 — 이 컴포넌트의 override(글자 토큰의 줄 높이 대신)
  const lineHeight = String(unbox(must(v['label.lineHeight'], 'label.lineHeight')));
  const kinds = {} as SwipeLook['kinds'];
  for (const k of ['neutral', 'primary', 'destructive'] as SwipeKind[]) {
    const kv = resolveState(spec, { kind: k, size: 'default' }, 'enabled');
    kinds[k] = { badge: tok(kv['badge.background'], brand, `${w} ${k} badge`), icon: tok(kv['icon.color'], brand, `${w} ${k} icon`), label: tokPair(kv['label.color'], brand, `${w} ${k} label`) };
  }
  return {
    badge: len(v['badge.size'], `${w} badge.size`),
    icon: len(v['icon.size'], `${w} icon.size`),
    label: { ...label, lineHeight },
    gap: numIn(md, /배지↔라벨 gap\s*(\d+)/, 'swipe-actions.md 배지↔라벨 간격'),
    first: numIn(width, /첫 액션\s*(\d+)/, `${w} action.width 비고`),
    rest: numIn(width, /이후\s*(\d+)/, `${w} action.width 비고`),
    rowMin: numIn(noteOf(v['action.height']), /min\s*(\d+)/, `${w} action.height 비고`),
    kinds,
  };
}

const cache = new Map<Brand, MenuKit>();

export function menuKit(brand: Brand = 'desk'): MenuKit {
  const hit = cache.get(brand);
  if (hit) return hit;
  // 경계 — 시트 ↔ 대화상자와 같은 1280(Input Button 의 반응형 폭). menu.md 도 그 폭을 말해야 한다
  const breakpoint = overlayLook(brand === 'hr' ? 'hr' : 'desk').breakpoint;
  const md = readFileSync(join(REPO, 'specs/components/menu.md'), 'utf8');
  if (!md.includes(`${breakpoint} 이상에서 쓰고`)) throw new Error(`menu.md 가 ${breakpoint} 경계를 말하지 않는다 — 그림의 경계를 고친다`);
  const kit: MenuKit = {
    menu: menuLook(brand, breakpoint),
    sheet: menuSheetLook(brand),
    bubble: bubbleLook(brand),
    tone: Object.fromEntries(MENU_TONES.map((n) => [n, named(n, brand)])) as MenuKit['tone'],
    card: cardFace(),
  };
  cache.set(brand, kit);
  return kit;
}
