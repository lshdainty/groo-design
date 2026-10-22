// 데이터 표시 묶음의 모양 — specs/components/{table, card, chart, searchable-list, swipe-actions}.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(data-*-view)은 이 값만 받아 그린다 — 높이 · 여백 · 색 · 모션은 그림에 따로 적지 않는다.
// YAML 의 축 · 상태 · 값의 꼴이 그림이 아는 것과 달라지면 여기서 멈춘다(그림이 조용히 낡지 않게).
// 숫자가 YAML 의 비고 · 스펙 md 에만 있는 것(열 폭 80 · 라벨 열 56 · 제스처 판정 · 열지도 칸 폭 실측)은 그 글을 읽는다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { axisDesc, axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { CHART_ORDER, color, contrast, design, pressScale, proseValue, type Brand as DBrand } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { checkLook } from './checkbox-look';
import { avatarLook, badgeLook } from './display-look';
import { AVATAR_SIZES, type AvatarSize } from './display-shared';
import { LT_SIZES, type LtSize } from './image-shared';
import { resultSectionLook } from './feedback-look';
import { imageFrameLook, logoTileLook } from './image-look';
import { listLook } from './list-look';
import { loadingKit } from './loading-look';
import { menuKit } from './menu-look';
import { radioLook } from './radio-group-look';
import { textFieldLook } from './text-field-look';
import {
  CHART_HUES,
  SWIPE_KINDS,
  type CardLook,
  type ChartHue,
  type ChartLook,
  type DColor,
  type DMotion,
  type DPress,
  type DRing,
  type DShadow,
  type DType,
  type HeatFg,
  type SearchLook,
  type SplitColor,
  type SwipeKitLook,
  type TableLook,
} from './data-shared';
export * from './data-shared';

type Brand = 'desk' | 'hr';
type Vals = Record<string, unknown>;
const REPO = join(process.cwd(), '..');
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
function must<T>(v: T | undefined | null, what: string): T {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`${what} 이 없다`);
  return v;
}
// '16px' · '0px' · '$spacing-x4' · '$radius-r2' → 수
function len(raw: unknown, what: string): number {
  const v0 = String(unbox(must(raw, what))).trim();
  const v = String(tokenValue(v0)).replace('−', '-');
  if (v === '0') return 0;
  if (v === '9999px') return 9999;
  return must(num(v), `${what}(${v0})`);
}
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text.replace(/−/g, '-'));
  if (!m) throw new Error(`${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
function same(a: number, b: number, what: string) {
  if (Math.abs(a - b) > 0.001) throw new Error(`${what} — ${a} 와 ${b} 가 다르다`);
}
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w, i) => got[i] !== w)) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — data-shared.ts 를 고친다`);
}
const md = (name: string) => readFileSync(join(REPO, 'specs/components', `${name}.md`), 'utf8');

// 사이트 모드를 따르는 그림의 CSS 변수 이름 — HR 에서 값이 다른 브랜드 토큰은 --p-hr-<이름>(tokens-style.tsx 와 같은 규칙)
function varName(name: string, brand: Brand) {
  if (brand !== 'hr') return name;
  const desk = design('desk').front.colors;
  const hr = design('hr').front.colors;
  if (!(name in desk) || !hr[name]) return name;
  const differs = hr[name] !== desk[name] || (hr[`${name}-dark`] ?? hr[name]) !== (desk[`${name}-dark`] ?? desk[name]);
  return differs ? `hr-${name}` : name;
}
export function named(name: string, brand: Brand = 'desk'): DColor {
  const c = design(brand as DBrand).front.colors;
  if (!c[name]) throw new Error(`색 토큰 ${name} 이 없다`);
  const dark = c[`${name}-dark`] ? color(`${name}-dark`, brand as DBrand) : color(name, brand as DBrand);
  return { name: varName(name, brand), light: color(name, brand as DBrand), dark };
}
function tok(raw: unknown, brand: Brand, what: string): DColor {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
// 비고 · 값의 글에서 역할 색 이름(bg-layer-basement …)을 찾는다
function roleIn(text: string, what: string, brand: Brand): DColor {
  const m = /\b((?:bg|fg|stroke)-[a-z-]+[a-z])\b/.exec(text);
  if (!m) throw new Error(`${what}(${text})에서 색 이름을 찾지 못했다`);
  return named(m[1], brand);
}
function typeOf(raw: unknown, what: string, weight?: unknown, lineHeight?: unknown): DType {
  const t = tokenValue(must(unbox(raw), what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${what} 글자 토큰을 풀지 못했다`);
  const lh = lineHeight === undefined ? must(t.lineHeight, `${what} 줄 높이`) : String(unbox(lineHeight));
  return { fontSize: t.fontSize, lineHeight: lh, fontWeight: weight === undefined ? (t.fontWeight ?? 400) : Number(unbox(weight)), fontFamily: t.fontFamily ?? 'inherit' };
}
const textToken = (name: string, what: string, weight?: number) => typeOf(`$text-${name}`, what, weight);
// 비고에 적힌 글자 크기(· 줄 높이)로 글자 토큰을 찾는다 — "12 · fg-neutral-subtle" 의 12 는 t2
function textFor(size: number, what: string, weight?: number, lineHeight?: number): DType {
  const ty = design().front.typography;
  const hit = Object.keys(ty).find((k) => /^t\d+$/.test(k) && parseFloat(ty[k].fontSize) === size && (lineHeight === undefined || parseFloat(ty[k].lineHeight ?? '') === lineHeight));
  if (!hit) throw new Error(`${what} — 글자 ${size}${lineHeight ? ` / ${lineHeight}` : ''} 인 글자 토큰이 없다`);
  return textToken(hit, what, weight);
}
const motionPair = (d: unknown, e: unknown, what: string): DMotion => ({ duration: String(tokenValue(unbox(must(d, `${what} 시간`)))), easing: String(tokenValue(unbox(must(e, `${what} 곡선`)))) });
type MotionBlock = Record<string, { duration: unknown; easing: unknown; properties?: string[] }>;
function motionOf(spec: string, block: string): DMotion {
  const m = (loadComponentSpec(spec) as unknown as { motion?: MotionBlock }).motion?.[block];
  if (!m) throw new Error(`${spec}.yaml 의 motion 에 "${block}" 이 없다`);
  return motionPair(m.duration, m.easing, `${spec} ${block}`);
}
function shadowTok(raw: unknown, what: string): DShadow {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^\$(shadow-s\d)$/.exec(v);
  if (!m) throw new Error(`${what} 이 그림자 토큰이 아니다(${v})`);
  return { name: m[1], light: proseValue(m[1]), dark: proseValue(`${m[1]}-dark`) };
}
// 누름 — YAML 의 "2px 거리 축소" 가 Motion 의 눌림 피드백과 같은지
function pressOf(raw: unknown, what: string, motion: DMotion): DPress {
  const p = pressScale();
  same(numIn(String(unbox(must(raw, what))), /(\d+)px/, what), p.distance, `${what} 누름 거리 — Motion 눌림 피드백`);
  return { distance: p.distance, widthDivisor: p.widthDivisor, minBasis: p.minBasis, motion };
}
const ringOf = (v: Vals, brand: Brand, what: string): DRing => ({ width: len(v['focusRing.width'], `${what} focusRing.width`), offset: len(v['focusRing.offset'], `${what} focusRing.offset`), color: tok(v['focusRing.color'], brand, `${what} focusRing.color`) });
const touchOf = (raw: unknown, what: string) => numIn(String(unbox(must(raw, what))), /^(\d+)\s*×/, what);
// 일괄 작업 바의 동작 버튼 — table.yaml bulkBar.actions 가 "Button ghost small · neutral" 인지 확인하고 그 버튼으로(바뀌면 여기서 멈춘다)
function bulkActionLook(raw: unknown, brand: Brand) {
  const v = String(unbox(must(raw, 'table.yaml bulkBar.actions')));
  if (v !== 'Button ghost small · neutral') throw new Error(`table.yaml bulkBar.actions(${v})가 "Button ghost small · neutral" 이 아니다 — data-look 의 일괄 작업 바 버튼을 고친다`);
  return buttonLook({ variant: 'ghost', size: 'small', ghostColor: 'neutral' }, brand);
}
// 앞 붙이개 크기 — Avatar · Logo Tile 의 크기 이름(그 YAML 에 있는 크기만)
function avatarSize(n: number, what: string): AvatarSize {
  const v = String(n) as AvatarSize;
  if (!AVATAR_SIZES.includes(v)) throw new Error(`${what} ${n} 은 avatar.yaml 의 크기가 아니다`);
  return v;
}
function logoSize(n: number, what: string): LtSize {
  const v = String(n) as LtSize;
  if (!LT_SIZES.includes(v)) throw new Error(`${what} ${n} 은 logo-tile.yaml 의 크기가 아니다`);
  return v;
}

// ══ Table ══════════════════════════════════════════════════
const tableCache = new Map<Brand, TableLook>();
export function tableLook(brand: Brand = 'hr'): TableLook {
  const hit = tableCache.get(brand);
  if (hit) return hit;
  const F = 'table.yaml';
  const spec = loadComponentSpec('table');
  sameSet(axisValues(spec, 'row'), ['text', 'rich'], `${F} row`);
  sameSet(axisValues(spec, 'align'), ['start', 'end'], `${F} align`);
  sameSet(axisValues(spec, 'sort'), ['none', 'sortable', 'ascending', 'descending'], `${F} sort`);
  sameSet(axisValues(spec, 'selection'), ['none', 'empty', 'some', 'all'], `${F} selection`);
  sameSet(axisValues(spec, 'width'), ['wide', 'narrow'], `${F} width`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const rich = resolveState(spec, { row: 'rich' }, 'enabled');
  const end = resolveState(spec, { align: 'end' }, 'enabled');
  const sortable = resolveState(spec, { sort: 'sortable' }, 'enabled');
  const asc = resolveState(spec, { sort: 'ascending' }, 'enabled');
  const desc = resolveState(spec, { sort: 'descending' }, 'enabled');
  const narrow = resolveState(spec, { width: 'narrow' }, 'enabled');
  if (String(unbox(end['cell.numerals'])) !== 'tabular-nums' || String(unbox(end['headerCell.textAlign'])) !== 'end') throw new Error(`${F} align end — 숫자 열이 오른쪽 · 고정폭 숫자가 아니다`);
  if (String(unbox(asc['sortIcon.color'])) !== String(unbox(desc['sortIcon.color']))) throw new Error(`${F} 오름 · 내림의 짙은 표시 색이 다르다 — 그림은 한 색으로 그린다`);
  const breakpoint = numIn(must(axisDesc(spec, 'width', 'wide'), `${F} width.wide 설명`), /(\d+)\s*이상/, `${F} width.wide 설명`);
  same(breakpoint, parseFloat(proseValue('breakpoint-md')), `${F} 표 ↔ List 문턱 — breakpoint-md`);
  const head = {
    minH: len(b['headerRow.minHeight'], `${F} headerRow.minHeight`),
    padY: len(b['headerCell.paddingY'], `${F} headerCell.paddingY`),
    padX: len(b['headerCell.paddingX'], `${F} headerCell.paddingX`),
    type: typeOf(b['headerCell.typography'], `${F} headerCell.typography`, b['headerCell.fontWeight'], b['headerCell.lineHeight']),
    fg: tok(b['headerCell.foreground'], brand, `${F} headerCell.foreground`),
    line: tok(b['headerRow.borderBottomColor'], brand, `${F} headerRow.borderBottomColor`),
    lineW: len(b['headerRow.borderBottomWidth'], `${F} headerRow.borderBottomWidth`),
    stickyBg: roleIn(noteOf(b['headerRow.background']), `${F} headerRow.background 비고`, brand),
    z: Number(unbox(must(b['headerRow.zIndex'], `${F} headerRow.zIndex`))),
  };
  same(head.minH, head.padY * 2 + parseFloat(head.type.lineHeight) + head.lineW, `${F} 머리 41 — 위아래 + 줄 높이 + 선`);
  const cell = {
    padY: len(b['cell.paddingY'], `${F} cell.paddingY`),
    padX: len(b['cell.paddingX'], `${F} cell.paddingX`),
    type: typeOf(b['cell.typography'], `${F} cell.typography`, b['cell.fontWeight'], b['cell.lineHeight']),
    fg: tok(b['cell.foreground'], brand, `${F} cell.foreground`),
  };
  const rowLineW = len(b['row.borderBottomWidth'], `${F} row.borderBottomWidth`);
  const minText = len(b['row.minHeight'], `${F} row.minHeight`);
  same(minText, cell.padY * 2 + parseFloat(cell.type.lineHeight) + rowLineW, `${F} 줄 45 — 위아래 + 줄 높이 + 선`);
  const thumbNote = noteOf(b['thumbnail.size']);
  const checkNote = noteOf(b['checkbox.size']);
  const moreNote = noteOf(b['moreButton.size']);
  const bulkNote = noteOf(b['bulkBar.minHeight']);
  const check = checkLook({ size: 'large' }, brand);
  const checkSize = len(b['checkbox.size'], `${F} checkbox.size`);
  same(check.faces.unchecked.light.enabled.box.size, checkSize, `${F} 선택 칸 — checkbox.yaml large`);
  const more = buttonLook({ variant: 'ghost', layout: 'iconOnly', size: 'medium' }, brand);
  const moreSize = len(b['moreButton.size'], `${F} moreButton.size`);
  same(more.faces.light.enabled.height, moreSize, `${F} ⋮ — button.yaml ghost iconOnly medium`);
  const moreCol = numIn(moreNote, /열 폭\s*(\d+)/, `${F} moreButton.size 비고`);
  same(moreCol, numIn(moreNote, /앞\s*(\d+)/, `${F} moreButton 비고 앞`) + moreSize + numIn(moreNote, /끝\s*(\d+)/, `${F} moreButton 비고 끝`), `${F} ⋮ 열 폭 = 앞 + 40 + 끝`);
  const badge = badgeLook(brand);
  if (!String(unbox(b['badge.size'])).includes('Badge medium')) throw new Error(`${F} badge.size 가 Badge medium 이 아니다`);
  const sortNote = noteOf(sortable['sortButton.width']);
  // 72 줄은 칸 여백 없이 세로 가운데 — 썸네일 48 + 위아래 여백 + 선이 72 를 넘지 않아야 한다(Q-011-1)
  const richPadY = len(rich['cell.paddingY'], `${F} rich cell.paddingY`);
  if (len(b['thumbnail.size'], `${F} thumbnail.size`) + richPadY * 2 + rowLineW > len(rich['row.minHeight'], `${F} rich row.minHeight`)) throw new Error(`${F} rich 줄 — 썸네일 + 칸 여백 ${richPadY} × 2 + 선이 줄 높이를 넘는다`);
  const look: TableLook = {
    breakpoint,
    menuBreakpoint: menuKit(brand).menu.breakpoint,
    edge: len(b['root.paddingX'], `${F} root.paddingX`),
    head,
    row: {
      minH: { text: minText, rich: len(rich['row.minHeight'], `${F} rich row.minHeight`) },
      line: tok(b['row.borderBottomColor'], brand, `${F} row.borderBottomColor`),
      lineW: rowLineW,
      hoverBg: tok(hov['row.background'], brand, `${F} hovered row.background`),
      pressBg: tok(pr['row.background'], brand, `${F} pressed row.background`),
      motion: motionPair(b['row.transitionDuration'], b['row.transitionEasing'], `${F} row 전환`),
    },
    cell,
    detail: { type: typeOf(b['detail.typography'], `${F} detail.typography`), fg: tok(b['detail.foreground'], brand, `${F} detail.foreground`), gap: len(b['detail.gap'], `${F} detail.gap`) },
    thumb: { size: len(b['thumbnail.size'], `${F} thumbnail.size`), gap: len(b['thumbnail.gap'], `${F} thumbnail.gap`), avatar: avatarSize(numIn(thumbNote, /Avatar\s*(\d+)/, `${F} thumbnail 비고`), `${F} thumbnail 비고 Avatar`), logo: logoSize(numIn(thumbNote, /Logo Tile\s*(\d+)/, `${F} thumbnail 비고`), `${F} thumbnail 비고 Logo Tile`) },
    delta: { up: named('fg-critical', brand), down: named('fg-informative', brand), flat: named('fg-neutral-subtle', brand) },
    sort: {
      gap: len(sortable['sortButton.gap'], `${F} sortButton.gap`),
      icon: len(sortable['sortIcon.size'], `${F} sortIcon.size`),
      muted: tok(sortable['sortIcon.color'], brand, `${F} sortable sortIcon.color`),
      strong: tok(asc['sortIcon.color'], brand, `${F} ascending sortIcon.color`),
      bg: tok(hov['sortButton.background'], brand, `${F} hovered sortButton.background`),
      touchH: numIn(sortNote, /위아래로\s*(\d+)/, `${F} sortButton.width 비고`),
    },
    check: { look: check, size: checkSize, touch: touchOf(b['checkbox.touchTarget'], `${F} checkbox.touchTarget`), colW: numIn(checkNote, /앞\s*(\d+)/, `${F} checkbox 비고`) + checkSize + numIn(checkNote, /뒤\s*(\d+)/, `${F} checkbox 비고`) },
    more: { look: more, size: moreSize, touch: touchOf(b['moreButton.touchTarget'], `${F} moreButton.touchTarget`), colW: moreCol },
    bulk: {
      minH: len(b['bulkBar.minHeight'], `${F} bulkBar.minHeight`),
      padL: len(b['bulkBar.paddingX'], `${F} bulkBar.paddingX`),
      padR: numIn(noteOf(b['bulkBar.paddingX']), /오른쪽은[^\d]*(\d+)/, `${F} bulkBar.paddingX 비고`),
      radius: len(b['bulkBar.radius'], `${F} bulkBar.radius`),
      bg: tok(b['bulkBar.background'], brand, `${F} bulkBar.background`),
      gap: len(b['bulkBar.gap'], `${F} bulkBar.gap`),
      marginBottom: len(b['bulkBar.marginBottom'], `${F} bulkBar.marginBottom`),
      // 고른 수 글 — 비고의 "t4 14 · 500", 색은 table.md 접근성 표의 "일괄 작업 바 글 fg-neutral"
      text: textToken(`t${numIn(bulkNote, /t(\d+)\s/, `${F} bulkBar 비고 글자`)}`, `${F} bulkBar 글자`, numIn(bulkNote, /·\s*(\d{3})/, `${F} bulkBar 비고 굵기`)),
      fg: named('fg-neutral', brand),
      // 바 안 동작 — 모두 ghost neutral(table.yaml bulkBar.actions — 빨강은 확인창에서, 2026-10-17 01T-033 A)
      action: bulkActionLook(b['bulkBar.actions'], brand),
      clear: buttonLook({ variant: 'ghost', size: 'small', layout: 'iconOnly' }, brand),
    },
    ring: ringOf(fo, brand, F),
    badge,
    avatar: avatarLook(brand),
    list: listLook(brand),
    sk: loadingKit(brand).skeleton,
    result: resultSectionLook(brand),
    logo: logoTileLook(),
    frame: imageFrameLook(),
    narrowValue: textToken(`t${numIn(noteOf(narrow['cell.display']), /숫자는\s*t(\d+)/, `${F} narrow cell.display 비고`)}`, `${F} 좁은 화면 오른쪽 숫자`),
  };
  // 정렬 버튼은 칸 전체 — 머리 칸의 여백을 버튼이 가진다
  if (!String(unbox(sortable['sortButton.width'])).includes('칸 전체')) throw new Error(`${F} sortButton.width 가 칸 전체가 아니다`);
  same(badge.sizes.medium.minH, numIn(noteOf(b['badge.size']), /^(\d+)/, `${F} badge 비고`), `${F} 상태 배지 높이 — badge.yaml medium`);
  tableCache.set(brand, look);
  return look;
}

// ══ Card ═══════════════════════════════════════════════════
let cardCache: CardLook | undefined;
export function cardLook(): CardLook {
  if (cardCache) return cardCache;
  const brand: Brand = 'desk';
  const F = 'card.yaml';
  const spec = loadComponentSpec('card');
  sameSet(axisValues(spec, 'variant'), ['default', 'hero'], `${F} variant`);
  sameSet(axisValues(spec, 'press'), ['none', 'whole', 'peers'], `${F} press`);
  sameSet(axisValues(spec, 'body'), ['content', 'list', 'accordion'], `${F} body`);
  sameSet(axisValues(spec, 'stat'), ['none', 'large', 'small'], `${F} stat`);
  sameSet(axisValues(spec, 'delta'), ['none', 'up', 'down', 'flat'], `${F} delta`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  const L = resolveState(spec, { body: 'list' }, 'enabled');
  // 카드 안 아코디언(2026-10-10 — 카드 상세의 혜택 · 유의사항) — 좌우 0 · 아래 8 · 머리는 목록 카드와 같은 자리
  const A = resolveState(spec, { body: 'accordion' }, 'enabled');
  const W = resolveState(spec, { press: 'whole' }, 'enabled');
  const Wh = resolveState(spec, { press: 'whole' }, 'hovered');
  const Wp = resolveState(spec, { press: 'whole' }, 'pressed');
  const Pp = resolveState(spec, { press: 'peers' }, 'pressed');
  const H = resolveState(spec, { variant: 'hero' }, 'enabled');
  // 순자산 누름 · 호버 — 면은 채움 그대로, 2px 축소만(card.yaml { variant: hero, press: whole }) — 그림(HeroCardView)이 색을 바꾸지 않는다
  for (const st of ['hovered', 'pressed'] as const) {
    const v = resolveState(spec, { variant: 'hero', press: 'whole' }, st);
    if (String(unbox(v['root.background'])) !== String(unbox(H['root.background']))) throw new Error(`${F} 순자산 ${st} 면(${String(unbox(v['root.background']))})이 채움과 다르다 — 그림은 2px 축소만 그린다`);
  }
  if (!/축소/.test(String(unbox(resolveState(spec, { variant: 'hero', press: 'whole' }, 'pressed')['root.scale'])))) throw new Error(`${F} 순자산 누름에 축소가 없다`);
  if (String(unbox(b['root.shadow'])) !== 'none') throw new Error(`${F} root.shadow 가 none 이 아니다 — 그림은 그림자 없이 그린다`);
  if (String(unbox(Wh['root.background'])) !== String(unbox(Wp['root.background'])) || String(unbox(Pp['root.background'])) !== String(unbox(Wp['root.background']))) throw new Error(`${F} 누름 · 호버 면 색이 갈린다 — 그림은 한 색으로 그린다`);
  if (len(L['root.padding'], `${F} list root.padding`) !== 0) throw new Error(`${F} 목록 카드의 좌우 여백이 0 이 아니다`);
  if (len(A['root.padding'], `${F} accordion root.padding`) !== 0) throw new Error(`${F} 아코디언 카드의 좌우 여백이 0 이 아니다`);
  const radius = len(b['root.radius'], `${F} root.radius`);
  const listLk = listLook(brand);
  const itemRadius = len(b['list.itemRadius'], `${F} list.itemRadius`);
  // 카드 안 목록의 동심 모서리 — 카드 16 − 줄 바탕 들임 6 = 10
  same(itemRadius, radius - listLk.faces.none.light.pressed.bg.insetX, `${F} 목록 누름 바탕 모서리 — 카드 모서리 − List 바탕 들임`);
  const largeV = resolveState(spec, { stat: 'large' }, 'enabled');
  const smallV = resolveState(spec, { stat: 'small' }, 'enabled');
  const heroEnd = H['root.gradientEnd'] as { value?: unknown; dark?: unknown };
  const endL = /^\$color-([a-z0-9-]+)$/.exec(String(must(heroEnd?.value, `${F} hero root.gradientEnd`)))?.[1];
  const endD = /^\$color-([a-z0-9-]+)$/.exec(String(must(heroEnd?.dark, `${F} hero root.gradientEnd.dark`)))?.[1];
  if (!endL || !endD) throw new Error(`${F} hero root.gradientEnd 가 색 토큰이 아니다`);
  // 다크 끝은 "-dark" 짝 토큰(brand-300-dark) — 사이트 모드의 --p-<이름> 은 다크에서 그 짝이 된다
  const endDarkBase = endD.replace(/-dark$/, '');
  if (`${endDarkBase}-dark` !== endD) throw new Error(`${F} hero 다크 끝(${endD})이 -dark 짝 토큰이 아니다`);
  const end: SplitColor = { light: color(endL, 'desk'), dark: color(endD, 'desk'), split: [endL, endDarkBase] };
  const glowNote = noteOf(H['heroGlow.size']);
  const glowColor = String(tokenValue(unbox(H['heroGlow.background'])));
  const bgNote = noteOf(H['root.background']);
  const look: CardLook = {
    floor: roleIn(noteOf(b['root.background']), `${F} root.background 비고`, brand),
    surface: {
      bg: tok(b['root.background'], brand, `${F} root.background`),
      border: tok(b['root.borderColor'], brand, `${F} root.borderColor`),
      borderW: len(b['root.borderWidth'], `${F} root.borderWidth`),
      radius,
      pad: len(b['root.padding'], `${F} root.padding`),
      gap: len(b['root.gap'], `${F} root.gap`),
      pressBg: tok(Wp['root.background'], brand, `${F} pressed root.background`),
    },
    gutter: parseFloat(proseValue(must(/\b(layout-gutter)\b/.exec(noteOf(b['root.gap']))?.[1], `${F} root.gap 비고의 layout-gutter`))),
    header: {
      gap: len(b['header.gap'], `${F} header.gap`),
      padBottom: len(b['header.paddingBottom'], `${F} header.paddingBottom`),
      list: { top: len(L['header.paddingTop'], `${F} list header.paddingTop`), x: len(L['header.paddingX'], `${F} list header.paddingX`), bottom: len(L['header.paddingBottom'], `${F} list header.paddingBottom`) },
    },
    title: { ...typeOf(b['title.typography'], `${F} title.typography`, b['title.fontWeight']), fg: tok(b['title.foreground'], brand, `${F} title.foreground`) },
    action: {
      h: len(b['headerAction.height'], `${F} headerAction.height`),
      padL: len(b['headerAction.paddingLeft'], `${F} headerAction.paddingLeft`),
      padR: len(b['headerAction.paddingRight'], `${F} headerAction.paddingRight`),
      radius: len(b['headerAction.radius'], `${F} headerAction.radius`),
      type: typeOf(b['headerAction.typography'], `${F} headerAction.typography`, b['headerAction.fontWeight']),
      fg: tok(b['headerAction.foreground'], brand, `${F} headerAction.foreground`),
      touch: touchOf(b['headerAction.touchTarget'], `${F} headerAction.touchTarget`),
      bg: tok(hov['headerAction.background'], brand, `${F} hovered headerAction.background`),
      press: pressOf(pr['headerAction.scale'], `${F} pressed headerAction.scale`, motionOf('card', '누름 — 축소')),
    },
    content: { gap: len(b['content.gap'], `${F} content.gap`) },
    list: { itemRadius, padBottom: len(L['root.paddingBottom'], `${F} list root.paddingBottom`), look: listLk },
    accordion: {
      padBottom: len(A['root.paddingBottom'], `${F} accordion root.paddingBottom`),
      header: { top: len(A['header.paddingTop'], `${F} accordion header.paddingTop`), x: len(A['header.paddingX'], `${F} accordion header.paddingX`), bottom: len(A['header.paddingBottom'], `${F} accordion header.paddingBottom`) },
    },
    stat: {
      label: { ...typeOf(b['statLabel.typography'], `${F} statLabel.typography`, b['statLabel.fontWeight']), fg: tok(b['statLabel.foreground'], brand, `${F} statLabel.foreground`) },
      value: {
        weight: Number(unbox(must(b['statValue.fontWeight'], `${F} statValue.fontWeight`))),
        fg: tok(b['statValue.foreground'], brand, `${F} statValue.foreground`),
        marginTop: len(b['statValue.marginTop'], `${F} statValue.marginTop`),
        sizes: { large: typeOf(largeV['statValue.typography'], `${F} large statValue.typography`, b['statValue.fontWeight']), small: typeOf(smallV['statValue.typography'], `${F} small statValue.typography`, b['statValue.fontWeight']) },
      },
      delta: {
        type: typeOf(b['delta.typography'], `${F} delta.typography`, b['delta.fontWeight']),
        marginTop: len(b['delta.marginTop'], `${F} delta.marginTop`),
        colors: {
          up: tok(resolveState(spec, { delta: 'up' }, 'enabled')['delta.foreground'], brand, `${F} up delta.foreground`),
          down: tok(resolveState(spec, { delta: 'down' }, 'enabled')['delta.foreground'], brand, `${F} down delta.foreground`),
          flat: tok(resolveState(spec, { delta: 'flat' }, 'enabled')['delta.foreground'], brand, `${F} flat delta.foreground`),
        },
      },
      deltaText: { ...typeOf(b['deltaText.typography'], `${F} deltaText.typography`, b['deltaText.fontWeight']), fg: tok(b['deltaText.foreground'], brand, `${F} deltaText.foreground`), gap: len(b['deltaText.gap'], `${F} deltaText.gap`) },
    },
    hero: {
      start: tok(H['root.background'], brand, `${F} hero root.background`),
      end,
      angle: numIn(bgNote, /(\d+)°/, `${F} hero root.background 비고`),
      glow: {
        size: len(H['heroGlow.size'], `${F} heroGlow.size`),
        right: numIn(glowNote, /오른쪽\s*(-?\d+)/, `${F} heroGlow 비고`),
        top: numIn(glowNote, /위\s*(-?\d+)/, `${F} heroGlow 비고`),
        color: glowColor,
        stop: numIn(noteOf(H['heroGlow.background']), /지름의\s*(\d+)%/, `${F} heroGlow.background 비고`),
      },
      fg: tok(H['heroLabel.foreground'], brand, `${F} heroLabel.foreground`),
      pad: len(H['root.padding'], `${F} hero root.padding`),
      radius,
      label: typeOf(H['heroLabel.typography'], `${F} heroLabel.typography`, H['heroLabel.fontWeight']),
      amount: { ...typeOf(H['heroAmount.typography'], `${F} heroAmount.typography`, H['heroAmount.fontWeight']), marginTop: len(H['heroAmount.marginTop'], `${F} heroAmount.marginTop`) },
      detail: { ...typeOf(H['heroDetail.typography'], `${F} heroDetail.typography`, H['heroDetail.fontWeight']), marginTop: len(H['heroDetail.marginTop'], `${F} heroDetail.marginTop`) },
    },
    press: pressOf(Wp['root.scale'], `${F} pressed root.scale`, motionPair(Wp['root.scaleDuration'], Wp['root.scaleEasing'], `${F} 누름 축소`)),
    ring: ringOf(fo, brand, F),
  };
  // 누르는 카드의 면 색 전환 — YAML 의 시간 · 곡선(누름 — 면)과 같은지
  const face = motionOf('card', '누름 — 면');
  const w = motionPair(W['root.transitionDuration'], W['root.transitionEasing'], `${F} whole 전환`);
  if (face.duration !== w.duration || face.easing !== w.easing) throw new Error(`${F} 누름 — 면 모션이 whole 의 전환과 다르다`);
  if (String(unbox(H['heroLabel.foreground'])) !== String(unbox(H['heroAmount.foreground'])) || String(unbox(H['heroAmount.foreground'])) !== String(unbox(H['heroDetail.foreground']))) throw new Error(`${F} 순자산 글자색이 셋이 다르다 — 그림은 한 색으로 그린다`);
  cardCache = look;
  return look;
}

// ══ Chart ══════════════════════════════════════════════════
// 두 색을 sRGB 에서 섞는다(color-mix(in srgb, over p%, base) 와 같은 답)
function mixHex(over: string, base: string, p: number) {
  const ch = (h: string) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
  const [a, bb] = [ch(over), ch(base)];
  return `#${a.map((v, i) => Math.round(bb[i] + (v - bb[i]) * (p / 100)).toString(16).padStart(2, '0')).join('')}`;
}
const chartCache = new Map<Brand, ChartLook>();
export function chartLook(brand: Brand = 'desk'): ChartLook {
  const hit = chartCache.get(brand);
  if (hit) return hit;
  const F = 'chart.yaml';
  const spec = loadComponentSpec('chart');
  sameSet(axisValues(spec, 'kind'), ['line', 'bar', 'donut', 'heatmap'], `${F} kind`);
  sameSet(axisValues(spec, 'axis'), ['single', 'dual'], `${F} axis`);
  sameSet(axisValues(spec, 'legend'), ['shown', 'hidden'], `${F} legend`);
  sameSet(axisValues(spec, 'palette'), CHART_HUES, `${F} palette`);
  sameSet(CHART_ORDER, CHART_HUES, 'DESIGN.md v110 배정 순서(CHART_ORDER)');
  sameSet(stateNames(spec), ['enabled', 'hovered', 'pressed', 'focused', 'disabled'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hov = resolveState(spec, {}, 'hovered');
  const pr = resolveState(spec, {}, 'pressed');
  const fo = resolveState(spec, {}, 'focused');
  // 끈 타일만 호버 바탕(Q-012-2) · 끌 수 없는 마지막 타일은 커서 not-allowed(Q-012-3)
  const hiddenHov = resolveState(spec, { legend: 'hidden' }, 'hovered');
  if (hov['legendTile.background'] !== undefined && unbox(hov['legendTile.background']) !== unbox(b['legendTile.background'])) throw new Error(`${F} 켠 타일에 호버 바탕이 있다 — 호버 바탕은 끈 타일(legend hidden)만`);
  if (pr['legendTile.background'] !== undefined && unbox(pr['legendTile.background']) !== unbox(b['legendTile.background'])) throw new Error(`${F} 타일 누름에 바탕이 있다 — 누름은 색 없이 축소만`);
  const locked = resolveState(spec, { legend: 'shown' }, 'disabled');
  const lineV = resolveState(spec, { kind: 'line' }, 'enabled');
  const barV = resolveState(spec, { kind: 'bar' }, 'enabled');
  const donutV = resolveState(spec, { kind: 'donut' }, 'enabled');
  const heatV = resolveState(spec, { kind: 'heatmap' }, 'enabled');
  const dualV = resolveState(spec, { axis: 'dual' }, 'enabled');
  const hiddenV = resolveState(spec, { legend: 'hidden' }, 'enabled');
  const shownV = resolveState(spec, { legend: 'shown' }, 'enabled');
  if (!/chart-\{색\}-subtle/.test(String(unbox(shownV['legendTile.background'])))) throw new Error(`${F} 켠 타일 바탕이 chart-{색}-subtle 이 아니다`);
  if (!/chart-\{계열 색\}/.test(String(unbox(dualV['tickLabel.foreground'])))) throw new Error(`${F} 이중 축 눈금 글자가 계열 색이 아니다`);
  const series = {} as Record<ChartHue, ReturnType<typeof named>>;
  const subtle = {} as Record<ChartHue, ReturnType<typeof named>>;
  for (const h of CHART_HUES) {
    series[h] = tok(resolveState(spec, { palette: h }, 'enabled')['series.color'], brand, `${F} palette ${h}`);
    if (series[h].name !== `chart-${h}` && series[h].name !== `hr-chart-${h}`) throw new Error(`${F} palette ${h} 가 chart-${h} 가 아니다`);
    subtle[h] = named(`chart-${h}-subtle`, brand);
  }
  const dash = (raw: unknown, what: string) => {
    const m = /(\d+)\s*·\s*(\d+)/.exec(noteOf(raw));
    if (!m) throw new Error(`${what} 비고에서 점선 간격을 찾지 못했다`);
    return [Number(m[1]), Number(m[2])];
  };
  const tileNote = noteOf(b['legendTile.typography']);
  const tileName = typeOf(b['legendTile.typography'], `${F} legendTile.typography`);
  const total = textFor(numIn(tileNote, /합계\s*(\d+)\s*\//, `${F} legendTile 비고 합계`), `${F} 타일 합계`, numIn(tileNote, /합계\s*\d+\s*\/\s*\d+\s*·\s*(\d{3})/, `${F} legendTile 비고 합계 굵기`), numIn(tileNote, /합계\s*\d+\s*\/\s*(\d+)/, `${F} legendTile 비고 합계 줄 높이`));
  const tile = {
    radius: len(b['legendTile.radius'], `${F} legendTile.radius`),
    padY: len(b['legendTile.paddingY'], `${F} legendTile.paddingY`),
    padX: len(b['legendTile.paddingX'], `${F} legendTile.paddingX`),
    gap: len(b['legendTile.gap'], `${F} legendTile.gap`),
    name: { ...tileName, fg: tok(b['legendTile.foreground'], brand, `${F} legendTile.foreground`) },
    total: { ...total, fg: named('fg-neutral', brand) },
    dot: numIn(tileNote, /앞 점\s*(\d+)/, `${F} legendTile 비고 점`),
    dotGap: numIn(tileNote, /점 ↔ 이름\s*(\d+)/, `${F} legendTile 비고 점 ↔ 이름`),
    totalGap: numIn(tileNote, /아래\s*(\d+)\s*에 합계/, `${F} legendTile 비고 합계 위`),
    hiddenBg: tok(hiddenV['legendTile.background'], brand, `${F} hidden legendTile.background`),
    hiddenBorder: tok(hiddenV['legendTile.borderColor'], brand, `${F} hidden legendTile.borderColor`),
    hiddenBorderW: len(hiddenV['legendTile.borderWidth'], `${F} hidden legendTile.borderWidth`),
    hoverBg: tok(hiddenHov['legendTile.background'], brand, `${F} legend hidden hovered legendTile.background`),
    lockedCursor: String(unbox(must(locked['legendTile.cursor'], `${F} legend shown disabled legendTile.cursor`))),
    press: pressOf(pr['legendTile.scale'], `${F} pressed legendTile.scale`, motionPair(pr['legendTile.scaleDuration'], pr['legendTile.scaleEasing'], `${F} 타일 누름`)),
    color: motionPair(b['legendTile.transitionDuration'], b['legendTile.transitionEasing'], `${F} 타일 바탕 전환`),
  };
  // 타일 높이 62 = 위아래 10 + 이름 18 + 2 + 합계 22
  same(tile.padY * 2 + parseFloat(tile.name.lineHeight) + tile.totalGap + parseFloat(tile.total.lineHeight), numIn(noteOf(b['legendTile.touchTarget']), /높이\s*(\d+)/, `${F} legendTile.touchTarget 비고`), `${F} 지표 타일 높이`);
  const pointNote = noteOf(b['point.size']);
  const rowNote = noteOf(b['tooltipRow.foreground']);
  // 도넛 두께 = 지름 ÷ 10 + 6(정수로) — 식의 두 수는 YAML 속성, 지름은 series.diameter · diameterPhone
  const perDiameter = Number(unbox(must(donutV['series.thicknessPerDiameter'], `${F} donut series.thicknessPerDiameter`)));
  const thickOffset = len(donutV['series.thicknessOffset'], `${F} donut series.thicknessOffset`);
  const thick = (d: number) => Math.round(d * perDiameter + thickOffset);
  const donutDia = len(donutV['series.diameter'], `${F} donut series.diameter`);
  const donutPhone = len(donutV['series.diameterPhone'], `${F} donut series.diameterPhone`);
  // 비고에 적은 예(지름 → 두께)가 식과 같은지
  for (const m of noteOf(donutV['series.thickness']).matchAll(/(\d{3})\s*→\s*(\d+)/g)) same(thick(Number(m[1])), Number(m[2]), `${F} donut series.thickness 비고 ${m[1]} → ${m[2]}`);
  const centerNote = noteOf(b['donutCenter.typography']);
  const heatBgV = b['heatmapCell.background'];
  const steps = [...String(unbox(heatBgV)).matchAll(/(\d+)/g)].map((m) => Number(m[1]));
  const cuts = [...must(/값의\s*([\d\s·]+)%/.exec(noteOf(heatBgV))?.[1], `${F} heatmapCell.background 비고의 끊는 자리`).matchAll(/(\d+)/g)].map((m) => Number(m[1]));
  if (steps.length !== 5 || cuts.length !== 4) throw new Error(`${F} 열지도 단계(${steps.join(',')}) · 끊는 자리(${cuts.join(',')})가 다섯 · 넷이 아니다`);
  const heatGapNote = noteOf(heatV['heatmapCell.gap']);
  const valueNote = noteOf(b['heatmapValue.typography']);
  const fgNote = noteOf(b['heatmapValue.foreground']);
  // 단계마다 칸 글자색 — 칸 바탕 위 4.5 를 넘는 쪽(fg-neutral 먼저). 비고의 단계 배정과 같은지 본다
  const stepFg = (br: Brand): HeatFg[] => {
    const c = design(br as DBrand).front.colors;
    const pick = (dark: boolean) =>
      steps.map((p) => {
        const bg = mixHex(c[dark ? 'bg-brand-solid-dark' : 'bg-brand-solid'], c[dark ? 'bg-layer-default-dark' : 'bg-layer-default'], p);
        const ink = c[dark ? 'fg-neutral-dark' : 'fg-neutral'];
        if (contrast(ink, bg) >= 4.5) return 'fg-neutral';
        if (contrast(c['static-white'], bg) >= 4.5) return 'static-white';
        throw new Error(`${F} 열지도 ${br} ${dark ? '다크' : '라이트'} ${p}% 칸 — 어느 글자도 4.5 에 못 미친다`);
      });
    const light = pick(false);
    const dark = pick(true);
    return steps.map((_, i) => ({ light: light[i], dark: dark[i] }));
  };
  const desk = stepFg('desk');
  const hr = stepFg('hr');
  const claim = (br: 'Desk' | 'HR', fg: HeatFg[]) => {
    const whiteAt = fg.map((f, i) => (f.light === 'static-white' ? steps[i] : null)).filter((x): x is number => x !== null);
    const said = br === 'Desk' ? /Desk 라이트.*?·\s*([\d ·]+)%\s*는\s*static-white/.exec(fgNote)?.[1] : /HR\b.*?·\s*([\d ·]+)%\s*가\s*static-white/.exec(fgNote)?.[1];
    const saidSteps = [...must(said, `${F} heatmapValue.foreground 비고 — ${br} 흰 글자 단계`).matchAll(/(\d+)/g)].map((m) => Number(m[1]));
    if (saidSteps.join(',') !== whiteAt.join(',')) throw new Error(`${F} 열지도 ${br} 라이트 흰 글자 단계 — 비고 ${saidSteps.join(',')} · 잰 값 ${whiteAt.join(',')}`);
    if (fg.some((f) => f.dark !== 'fg-neutral')) throw new Error(`${F} 열지도 ${br} 다크에 fg-neutral 이 아닌 단계가 있다 — 비고는 "다크는 모두 fg-neutral"`);
  };
  claim('Desk', desk);
  claim('HR', hr);
  const widthNote = noteOf(b['heatmapCell.aspectRatio']);
  const widths = [...widthNote.matchAll(/(\d{3,4})\s*→\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])] as [number, number]);
  if (widths.length < 4) throw new Error(`${F} heatmapCell.aspectRatio 비고에서 칸 폭 실측을 읽지 못했다`);
  const look: ChartLook = {
    order: [...CHART_HUES],
    series,
    subtle,
    tick: { type: typeOf(b['tickLabel.typography'], `${F} tickLabel.typography`), fg: tok(b['tickLabel.foreground'], brand, `${F} tickLabel.foreground`) },
    grid: { width: len(b['gridLine.borderWidth'], `${F} gridLine.borderWidth`), dash: dash(b['gridLine.borderStyle'], `${F} gridLine.borderStyle`), color: tok(b['gridLine.borderColor'], brand, `${F} gridLine.borderColor`) },
    line: { width: len(lineV['line.strokeWidth'], `${F} line.strokeWidth`), areaFrom: numIn(noteOf(lineV['line.strokeWidth']), /(\d+)%\s*→/, `${F} line 비고`), areaTo: numIn(noteOf(lineV['line.strokeWidth']), /→\s*(\d+)%/, `${F} line 비고`) },
    bar: { maxW: len(barV['bar.maxWidth'], `${F} bar.maxWidth`), radius: len(barV['bar.radius'], `${F} bar.radius`), gap: len(barV['bar.gap'], `${F} bar.gap`) },
    donut: {
      perDiameter,
      offset: thickOffset,
      thickness: thick(donutDia),
      diameter: donutDia,
      phone: { diameter: donutPhone, thickness: thick(donutPhone) },
      center: { ...typeOf(b['donutCenter.typography'], `${F} donutCenter.typography`, b['donutCenter.fontWeight']), fg: tok(b['donutCenter.foreground'], brand, `${F} donutCenter.foreground`) },
      label: { ...textFor(numIn(centerNote, /위 라벨\s*(\d+)/, `${F} donutCenter 비고`), `${F} 도넛 가운데 라벨`), fg: roleIn(centerNote.split('위 라벨')[1] ?? '', `${F} donutCenter 비고 라벨 색`, brand) },
    },
    point: { size: len(b['point.size'], `${F} point.size`), ring: numIn(pointNote, /테두리\s*(\d+)/, `${F} point 비고`), ringColor: named('bg-layer-default', brand) },
    crosshair: { width: len(b['crosshair.borderWidth'], `${F} crosshair.borderWidth`), color: tok(b['crosshair.borderColor'], brand, `${F} crosshair.borderColor`), dash: dash(b['gridLine.borderStyle'], `${F} gridLine.borderStyle`) },
    tooltip: {
      minW: len(b['tooltip.minWidth'], `${F} tooltip.minWidth`),
      padY: len(b['tooltip.paddingY'], `${F} tooltip.paddingY`),
      padX: len(b['tooltip.paddingX'], `${F} tooltip.paddingX`),
      radius: len(b['tooltip.radius'], `${F} tooltip.radius`),
      bg: tok(b['tooltip.background'], brand, `${F} tooltip.background`),
      shadow: shadowTok(b['tooltip.shadow'], `${F} tooltip.shadow`),
      gap: len(b['tooltip.gap'], `${F} tooltip.gap`),
      z: Number(unbox(must(b['tooltip.zIndex'], `${F} tooltip.zIndex`))),
      head: { ...typeOf(b['tooltipHead.typography'], `${F} tooltipHead.typography`), fg: tok(b['tooltipHead.foreground'], brand, `${F} tooltipHead.foreground`) },
      row: {
        ...typeOf(b['tooltipRow.typography'], `${F} tooltipRow.typography`),
        fg: tok(b['tooltipRow.foreground'], brand, `${F} tooltipRow.foreground`),
        gap: len(b['tooltipRow.gap'], `${F} tooltipRow.gap`),
        minGap: numIn(noteOf(b['tooltipRow.gap']), /값은\s*(\d+)/, `${F} tooltipRow.gap 비고`),
        valueFg: roleIn(rowNote.split('값은')[1] ?? '', `${F} tooltipRow 비고 값 색`, brand),
        valueWeight: numIn(rowNote, /·\s*(\d{3})/, `${F} tooltipRow 비고 값 굵기`),
      },
      swatch: { size: len(b['swatch.size'], `${F} swatch.size`), radius: len(b['swatch.radius'], `${F} swatch.radius`) },
    },
    tile,
    legendList: {
      minH: len(b['legendList.minHeight'], `${F} legendList.minHeight`),
      type: typeOf(b['legendList.typography'], `${F} legendList.typography`),
      gap: len(b['legendList.gap'], `${F} legendList.gap`),
      swatch: numIn(noteOf(b['swatch.size']), /도넛 범례는\s*(\d+)/, `${F} swatch 비고`),
      fg: named('fg-neutral', brand),
      sub: roleIn(noteOf(b['legendList.minHeight']).split('%')[1] ?? '', `${F} legendList 비고 % 색`, brand),
      hoverBg: tok(hov['legendList.background'], brand, `${F} hovered legendList.background`),
      bgInsetX: listLook(brand).faces.none.light.pressed.bg.insetX,
      bgRadius: cardLook().list.itemRadius,
      bleed: cardLook().surface.pad,
    },
    heat: {
      radius: len(b['heatmapCell.radius'], `${F} heatmapCell.radius`),
      gap: len(heatV['heatmapCell.gap'], `${F} heatmap heatmapCell.gap`),
      labelCol: numIn(heatGapNote, /라벨 열\s*(\d+)/, `${F} heatmapCell.gap 비고`),
      steps,
      cuts,
      stepBg: { base: named('bg-layer-default', brand), over: roleIn(String(unbox(heatBgV)), `${F} heatmapCell.background`, brand) },
      empty: roleIn(noteOf(heatBgV).split('값이 없는 칸은')[1] ?? '', `${F} heatmapCell.background 비고 빈 칸`, brand),
      emptyFg: roleIn(valueNote.split('값이 없는 칸은')[1] ?? '', `${F} heatmapValue.typography 비고 빈 칸 글자`, brand),
      threshold: len(b['heatmapValue.threshold'], `${F} heatmapValue.threshold`),
      value: typeOf(b['heatmapValue.typography'], `${F} heatmapValue.typography`, b['heatmapValue.fontWeight']),
      fg: { desk, hr },
      head: { ...textFor(numIn(heatGapNote, /요일 머리\s*(\d+)/, `${F} heatmapCell.gap 비고 요일 머리`), `${F} 요일 머리`), fg: roleIn(heatGapNote.split('요일 머리')[1] ?? '', `${F} heatmapCell.gap 비고 요일 색`, brand) },
      name: { ...textFor(numIn(heatGapNote, /이름\s*(\d+)/, `${F} heatmapCell.gap 비고 이름`), `${F} 시간대 이름`, numIn(heatGapNote, /이름\s*\d+\s*·\s*(\d{3})/, `${F} heatmapCell.gap 비고 이름 굵기`)), fg: named('fg-neutral', brand) },
      time: { ...textFor(numIn(heatGapNote, /시간\s*(\d+)/, `${F} heatmapCell.gap 비고 시간`), `${F} 시간대 시간`), fg: roleIn(heatGapNote.split(/시간\s*\d+\s*·/)[1] ?? '', `${F} heatmapCell.gap 비고 시간 색`, brand) },
      widths,
    },
    ring: ringOf(fo, brand, F),
    motion: { draw: motionOf('chart', '그려짐'), color: motionOf('chart', '타일 · 범례 줄') },
    surface: named('bg-layer-default', brand),
  };
  same(look.heat.value.fontWeight as number, 700, `${F} 열지도 금액 굵기`);
  chartCache.set(brand, look);
  return look;
}

// ══ Searchable List ════════════════════════════════════════
let searchCache: SearchLook | undefined;
export function searchLook(): SearchLook {
  if (searchCache) return searchCache;
  const brand: Brand = 'desk';
  const F = 'searchable-list.yaml';
  const spec = loadComponentSpec('searchable-list');
  sameSet(axisValues(spec, 'size'), ['large', 'medium'], `${F} size`);
  sameSet(axisValues(spec, 'placement'), ['sheet', 'inline'], `${F} placement`);
  sameSet(axisValues(spec, 'prefix'), ['none', 'logo', 'cardArt', 'avatar'], `${F} prefix`);
  sameSet(axisValues(spec, 'selected'), ['other', 'current'], `${F} selected`);
  sameSet(stateNames(spec), ['enabled', 'highlighted', 'pressed'], `${F} states`);
  const b = resolveState(spec, {}, 'enabled');
  const hl = resolveState(spec, {}, 'highlighted');
  const pr = resolveState(spec, {}, 'pressed');
  const tf = textFieldLook(brand).input;
  if (String(unbox(b['field.variant'])) !== 'underline') throw new Error(`${F} field.variant 가 underline 이 아니다 — 그림은 밑줄형으로 그린다`);
  const heights = { large: len(b['field.height'], `${F} field.height`), medium: len(resolveState(spec, { size: 'medium' }, 'enabled')['field.height'], `${F} medium field.height`) };
  same(heights.large, tf.sizes.underline.large.minHeight, `${F} 검색칸 large — input.yaml 밑줄형 large`);
  same(heights.medium, tf.sizes.underline.medium.minHeight, `${F} 검색칸 medium — input.yaml 밑줄형 medium`);
  const breakpoint = numIn(must(axisDesc(spec, 'size', 'large'), `${F} size.large 설명`), /(\d+)\s*미만/, `${F} size.large 설명`);
  same(breakpoint, tf.breakpoint, `${F} 크기 문턱 — input.yaml 반응형`);
  const list = listLook(brand);
  const radio = radioLook({ size: 'large' }, brand);
  const radioSize = len(b['radio.size'], `${F} radio.size`);
  same(radio.faces.unchecked.light.enabled.mark.size, radioSize, `${F} 라디오 — radio-group.yaml large`);
  const optPadY = len(b['option.paddingY'], `${F} option.paddingY`);
  same(optPadY, list.faces.none.light.enabled.pad.y, `${F} 결과 줄 위아래 — list.yaml`);
  const optPadX = len(b['option.paddingX'], `${F} option.paddingX`);
  same(optPadX, list.faces.none.light.enabled.pad.x, `${F} 결과 줄 좌우 — list.yaml`);
  // 강조 바탕은 줄 폭 전체(0 · 모서리 0)에서 짚으면 들어온다(Menu · List — Q-009-3 B)
  same(len(b['highlight.insetX'], `${F} highlight.insetX`), 0, `${F} 강조 없는 바탕 들임 0`);
  same(len(b['highlight.radius'], `${F} highlight.radius`), 0, `${F} 강조 없는 바탕 모서리 0`);
  const insetX = len(hl['highlight.insetX'], `${F} highlighted highlight.insetX`);
  same(insetX, list.faces.none.light.pressed.bg.insetX, `${F} 강조 바탕 들임 — list.yaml 누름 바탕`);
  same(len(pr['highlight.insetX'], `${F} pressed highlight.insetX`), insetX, `${F} 누름 바탕 들임 — 강조와 같다`);
  const debounce = numIn(String(unbox(b['results.debounce'])), /(\d+)ms/, `${F} results.debounce`);
  const avatarNote = noteOf(resolveState(spec, { prefix: 'avatar' }, 'enabled')['prefix.size']);
  const look: SearchLook = {
    gap: len(b['root.gap'], `${F} root.gap`),
    breakpoint,
    field: { look: tf, marginX: len(b['field.marginX'], `${F} field.marginX`), heights },
    option: { padY: optPadY, padX: optPadX },
    title: { ...typeOf(b['title.typography'], `${F} title.typography`, b['title.fontWeight']), fg: tok(b['title.foreground'], brand, `${F} title.foreground`) },
    detail: { ...typeOf(b['detail.typography'], `${F} detail.typography`), fg: tok(b['detail.foreground'], brand, `${F} detail.foreground`) },
    highlight: { insetX, radius: len(hl['highlight.radius'], `${F} highlighted highlight.radius`), bg: tok(hl['highlight.background'], brand, `${F} highlighted highlight.background`) },
    prefix: {
      logo: logoSize(len(resolveState(spec, { prefix: 'logo' }, 'enabled')['prefix.size'], `${F} logo prefix.size`), `${F} logo prefix.size`),
      cardArt: len(resolveState(spec, { prefix: 'cardArt' }, 'enabled')['prefix.width'], `${F} cardArt prefix.width`),
      avatar: { one: avatarSize(len(resolveState(spec, { prefix: 'avatar' }, 'enabled')['prefix.size'], `${F} avatar prefix.size`), `${F} avatar prefix.size`), two: avatarSize(numIn(avatarNote, /설명\s*(\d+)/, `${F} avatar prefix 비고`), `${F} avatar prefix 비고`) },
    },
    radio,
    radioSize,
    debounce,
    skeletonRows: numIn(md('searchable-list'), /`rows`\(기본\s*(\d+)\)/, 'searchable-list.md 의 SearchableListSkeleton rows 기본'),
    list,
    sk: loadingKit(brand).skeleton,
    result: resultSectionLook(brand),
    logo: logoTileLook(),
    frame: imageFrameLook(),
    avatar: avatarLook(brand),
    badge: badgeLook(brand),
    color: motionOf('searchable-list', '강조 · 누름 — 바탕'),
    press: pressOf(pr['option.scale'], `${F} pressed option.scale`, motionOf('searchable-list', '누름 — 콘텐츠')),
  };
  if (String(unbox(pr['highlight.background'])) !== String(unbox(hl['highlight.background']))) throw new Error(`${F} 누름 · 강조 바탕이 다르다 — 그림은 한 색으로 그린다`);
  searchCache = look;
  return look;
}

// ══ Swipe Actions ══════════════════════════════════════════
let swipeCache: SwipeKitLook | undefined;
export function swipeKit(): SwipeKitLook {
  if (swipeCache) return swipeCache;
  const brand: Brand = 'desk';
  const F = 'swipe-actions.yaml';
  const spec = loadComponentSpec('swipe-actions');
  sameSet(axisValues(spec, 'kind'), SWIPE_KINDS, `${F} kind`);
  sameSet(axisValues(spec, 'size'), ['default'], `${F} size`);
  sameSet(stateNames(spec), ['enabled', 'hovered', 'focused', 'pressed', 'disabled'], `${F} states`);
  const v = resolveState(spec, { size: 'default' }, 'enabled');
  const hov = resolveState(spec, { size: 'default' }, 'hovered');
  const pr = resolveState(spec, { size: 'default' }, 'pressed');
  const fo = resolveState(spec, { size: 'default' }, 'focused');
  const di = resolveState(spec, { size: 'default', kind: 'primary' }, 'disabled');
  const wNote = noteOf(v['action.width']);
  const first = { width: numIn(wNote, /첫 액션\s*(\d+)/, `${F} action.width 비고`), lead: numIn(wNote, /첫\s*(\d+)\s*·/, `${F} action.width 비고 앞 간격`) };
  const rest = { width: numIn(wNote, /이후\s*(\d+)/, `${F} action.width 비고`), lead: numIn(wNote, /다음\s*(\d+)/, `${F} action.width 비고 사이`) };
  const badgeSize = len(v['badge.size'], `${F} badge.size`);
  same(first.width, first.lead + badgeSize, `${F} 첫 칸 = 앞 간격 + 배지`);
  same(rest.width, rest.lead + badgeSize, `${F} 다음 칸 = 사이 + 배지`);
  const kinds = {} as SwipeKitLook['kinds'];
  for (const k of SWIPE_KINDS) {
    const kv = resolveState(spec, { kind: k, size: 'default' }, 'enabled');
    kinds[k] = {
      badge: tok(kv['badge.background'], brand, `${F} ${k} badge.background`),
      border: kv['badge.borderWidth'] !== undefined ? { width: len(kv['badge.borderWidth'], `${F} ${k} badge.borderWidth`), color: tok(kv['badge.borderColor'], brand, `${F} ${k} badge.borderColor`) } : null,
      icon: tok(kv['icon.color'], brand, `${F} ${k} icon.color`),
      label: tok(kv['label.color'], brand, `${F} ${k} label.color`),
    };
  }
  const pct = (raw: unknown, what: string) => numIn(String(unbox(must(raw, what))), /(\d+)%/, what) / 100;
  const brightness = pct(pr['action.brightness'], `${F} pressed action.brightness`);
  same(brightness, pct(hov['action.brightness'], `${F} hovered action.brightness`), `${F} 호버 · 누름 밝기`);
  const text = md('swipe-actions');
  const row = (head: string) => must(text.split('\n').find((l) => l.startsWith(`| ${head}`)), `swipe-actions.md 제스처 판정 표의 "${head}" 줄`);
  const more = buttonLook({ variant: 'ghost', layout: 'iconOnly', size: 'medium' }, brand);
  same(more.faces.light.enabled.height, len(v['moreButton.size'], `${F} moreButton.size`), `${F} ⋮ — button.yaml ghost iconOnly medium`);
  const look: SwipeKitLook = {
    badge: { size: badgeSize, radius: len(v['badge.radius'], `${F} badge.radius`) },
    icon: len(v['icon.size'], `${F} icon.size`),
    label: typeOf(v['label.typography'], `${F} label.typography`, v['label.fontWeight'], v['label.lineHeight']),
    gap: len(v['action.gap'], `${F} action.gap`),
    first,
    rest,
    rowMin: numIn(noteOf(v['action.height']), /min\s*(\d+)/, `${F} action.height 비고`),
    kinds,
    disabled: { badge: tok(di['badge.background'], brand, `${F} disabled badge.background`), icon: tok(di['icon.color'], brand, `${F} disabled icon.color`), label: tok(di['label.color'], brand, `${F} disabled label.color`) },
    brightness,
    ring: ringOf(fo, brand, F),
    motion: motionOf('swipe-actions', '열림 · 닫힘'),
    more,
    gesture: {
      deadzone: numIn(row('데드존'), /(\d+)px/, 'swipe-actions.md 데드존'),
      axis: numIn(row('축 확정'), /×\s*([\d.]+)/, 'swipe-actions.md 축 확정'),
      open: numIn(row('열기'), /(\d+)%/, 'swipe-actions.md 열기') / 100,
      close: numIn(row('닫기'), /(\d+)%/, 'swipe-actions.md 닫기') / 100,
    },
    breakpoint: numIn(text, /뷰포트 폭이다\((\d+) 미만\)/, 'swipe-actions.md 폰 전용 문턱'),
  };
  same(look.breakpoint, parseFloat(proseValue('breakpoint-md')), `${F} 폰 전용 문턱 — breakpoint-md`);
  swipeCache = look;
  return look;
}

// 그림 속 화면이 쓰는 역할 색(화면 틀 · 글) — 모드를 따르는 이름 · 라이트 · 다크
export const DATA_TONES = [
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-layer-default-pressed',
  'bg-neutral-weak',
  'bg-brand-weak',
  'bg-brand-solid',
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-neutral-inverted',
  'fg-placeholder',
  'fg-critical',
  'fg-informative',
  'fg-brand',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-focus-ring',
  'static-white',
] as const;
export type DataTone = (typeof DATA_TONES)[number];
export const dataTones = (brand: Brand = 'desk') => Object.fromEntries(DATA_TONES.map((n) => [n, named(n, brand)])) as Record<DataTone, DColor>;
