// Date Picker · Time Picker · Wheel Picker 의 모양 — specs/components/date-picker · time-picker · wheel-picker.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(date-view)은 이 값만 받아 그린다 — 칸 · 원 · 휠 · 띠 · 안개의 수치와 색은 그림에 따로 적지 않는다.
// 비고 속 수(칸 위 3 · 44 보다 좁으면 칸 폭 − 2 · 336 + 24 + 336 · 위 4 · 달 아래 16 · 위아래 14 · 안개 88 · 123 · 72)도 여기서 읽고,
// 다른 YAML(Button · Chip · Bottom Sheet · Popover)과 맞는지 확인한다 — 문장이나 값이 바뀌면 빌드가 멈춘다.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { axisValues, loadComponentSpec, num, resolveState, stateNames, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, proseValue } from '@/lib/design-tokens';
import { buttonLook } from './button-look';
import { chipLook } from './chip-look';
import { overlayLook } from './overlay-look';
import { DP_RANGES, DP_SELECTIONS, DP_STATES, WP_SIZES, fogHeight, type Brand, type DColor, type DMotion, type DType, type DateKit, type DateLook, type DpFace, type DpProp, type DpState, type TimeLook, type TpColumnKey, type WheelLook, type WpSize } from './date-shared';
export * from './date-shared';

type Vals = Record<string, unknown>;
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const noteOf = (raw: unknown) => (raw && typeof raw === 'object' && 'note' in raw ? String((raw as { note: unknown }).note ?? '') : '');
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || v === null || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`날짜 · 시각 YAML 에 ${what} 이 없다`);
  return v;
};
// '16px' · '−2px' · '$spacing-x3' · '$radius-r2' → 수
const len = (raw: unknown, what: string) => {
  const v = String(tokenValue(must(raw, what))).replace('−', '-');
  if (v === '0') return 0;
  return must(num(v), what);
};
// 값 · 비고 글자 속 수 — 문장이 바뀌면 여기서 멈춘다(그림이 낡지 않게)
const numIn = (text: string, re: RegExp, what: string) => {
  const m = re.exec(text);
  if (!m) throw new Error(`${what}(${text})에서 ${re} 를 찾지 못했다`);
  return Number(m[1]);
};
const same = (a: number, b: number, what: string) => {
  if (Math.abs(a - b) > 1e-6) throw new Error(`${what} — ${a} 와 ${b} 가 다르다`);
};
function sameSet(got: string[], want: readonly string[], what: string) {
  if (got.length !== want.length || want.some((w) => !got.includes(w))) throw new Error(`${what}(${got.join(', ')})이 그림(${want.join(', ')})과 다르다 — date-shared.ts 를 고친다`);
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
function tok(raw: unknown, brand: Brand, what: string): DColor | null {
  const v = String(unbox(must(raw, what))).trim();
  if (v === 'transparent') return null;
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`${what} 이 색 토큰이 아니다(${v})`);
  return named(m[1], brand);
}
const tokc = (raw: unknown, brand: Brand, what: string): DColor => must(tok(raw, brand, what) ?? undefined, `${what}(투명이 아닌 색)`);
function type(raw: unknown, weight: unknown, what: string): DType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" };
}
const motionPair = (d: unknown, e: unknown, what: string): DMotion => ({ duration: String(tokenValue(must(d, `${what} 시간`))), easing: String(tokenValue(must(e, `${what} 곡선`))) });
type MotionEntry = { duration: unknown; easing: unknown; properties?: string[]; note?: string };
function motionEntry(spec: string, name: string): MotionEntry {
  const all = (loadComponentSpec(spec) as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`${spec}.yaml 의 motion 에 "${name}" 이 없다`);
  return m;
}
const mdRow = (file: string, start: string) => {
  const row = readFileSync(join(process.cwd(), '..', 'specs/components', file), 'utf8')
    .split('\n')
    .find((l) => l.startsWith(start));
  if (!row) throw new Error(`${file} 에 "${start}" 줄이 없다`);
  return row;
};

// ── Wheel Picker ──────────────────────────────────────────
const wheelCache = new Map<Brand, WheelLook>();
export function wheelLook(brand: Brand = 'desk'): WheelLook {
  const hit = wheelCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('wheel-picker');
  sameSet(stateNames(spec), ['enabled', 'focused', 'disabled'], 'wheel-picker.yaml 의 states');
  sameSet(axisValues(spec, 'size'), WP_SIZES, 'wheel-picker.yaml 의 size');
  const visibleItems = axisValues(spec, 'visibleItems').map(Number);
  sameSet(visibleItems.map(String), ['5', '7'], 'wheel-picker.yaml 의 visibleItems');
  const w = 'wheel-picker';
  const base = resolveState(spec, {}, 'enabled');
  const focused = resolveState(spec, {}, 'focused');
  const disabled = resolveState(spec, {}, 'disabled');
  const sizes = {} as WheelLook['sizes'];
  for (const size of WP_SIZES) {
    const v = resolveState(spec, { size }, 'enabled');
    const item = len(v['item.height'], `${w} ${size} item.height`);
    same(len(v['indicator.height'], `${w} ${size} indicator.height`), item, `${w} ${size} — 띠 높이 · 항목 높이`);
    sizes[size] = { item, text: type(v['item.typography'], base['item.fontWeight'], `${w} ${size} item.typography`) };
  }
  // 휠 높이 = 항목 × 보이는 수 — 비고 "medium 5개 220 · 7개 308, small 5개 180"
  const rootNote = noteOf(base['root.height']);
  same(numIn(rootNote, /medium 5개\s*(\d+)/, `${w} root.height 비고`), sizes.medium.item * 5, `${w} medium 5개 높이`);
  same(numIn(rootNote, /7개\s*(\d+)/, `${w} root.height 비고`), sizes.medium.item * 7, `${w} medium 7개 높이`);
  same(numIn(rootNote, /small 5개\s*(\d+)/, `${w} root.height 비고`), sizes.small.item * 5, `${w} small 5개 높이`);
  // 칼럼 폭 = 항목 글 폭 + 좌우 16 — 항목 좌우 여백과 같다(그림은 가장 긴 글 + 좌우 여백으로 잰다)
  const padX = len(base['item.paddingX'], `${w} item.paddingX`);
  same(numIn(String(unbox(base['column.width'])), /좌우\s*(\d+)/, `${w} column.width`), padX, `${w} 칼럼 좌우 · 항목 좌우 여백`);
  // 안개 — "min(휠 높이 × 40%, 항목 3칸)" 과 비고의 셈(5개 88 · 7개 123 · small 72)
  const fogRaw = String(unbox(base['fog.height']));
  const ratio = numIn(fogRaw, /×\s*(\d+)%/, `${w} fog.height`) / 100;
  const maxItems = numIn(fogRaw, /항목\s*(\d+)칸/, `${w} fog.height`);
  const fogNote = noteOf(base['fog.height']);
  // gradient-fade-mask — "#000000xx p%" 단계
  const stops = [...proseValue('gradient-fade-mask').matchAll(/#000000([0-9a-f]{2})\s+([\d.]+)%/gi)].map((m) => ({ alpha: Math.round((parseInt(m[1], 16) / 255) * 1000) / 1000, at: Number(m[2]) }));
  if (stops.length < 2 || stops[0].at !== 0 || stops[stops.length - 1].at !== 100) throw new Error('gradient-fade-mask 의 단계를 읽지 못했다');
  if (!fogNote.includes('gradient-fade-mask')) throw new Error(`${w} fog.height 비고가 gradient-fade-mask 를 말하지 않는다 — date-view 의 안개를 고친다`);
  const ringNote = noteOf(focused['focusRing.offset']);
  const look: WheelLook = {
    defaults: { size: must(spec.defaults?.size, `${w} defaults.size`) as WpSize, visible: Number(must(spec.defaults?.visibleItems, `${w} defaults.visibleItems`)) },
    visibleItems,
    sizes,
    bg: tokc(base['root.background'], brand, `${w} root.background`),
    item: {
      padX,
      weight: unbox(must(base['item.fontWeight'], `${w} item.fontWeight`)) as number,
      color: tokc(base['item.foreground'], brand, `${w} item.foreground`),
      selected: tokc(base['item.selectedForeground'], brand, `${w} item.selectedForeground`),
      disabledSelected: tokc(disabled['item.selectedForeground'], brand, `${w} disabled item.selectedForeground`),
      numerals: String(unbox(must(base['item.numerals'], `${w} item.numerals`))),
    },
    band: { insetX: len(base['indicator.insetX'], `${w} indicator.insetX`), radius: len(base['indicator.radius'], `${w} indicator.radius`), color: tokc(base['indicator.background'], brand, `${w} indicator.background`) },
    fog: { ratio, maxItems, stops },
    ring: { width: len(focused['focusRing.width'], `${w} focusRing.width`), offset: len(focused['focusRing.offset'], `${w} focusRing.offset`), color: tokc(focused['focusRing.color'], brand, `${w} focusRing.color`), radius: numIn(ringNote, /모서리\s*(\d+)/, `${w} focusRing.offset 비고`) },
    motion: (() => {
      const rel = motionEntry('wheel-picker', '정착 — 끌기를 놓을 때');
      const range = String(unbox(rel.duration));
      const relNote = noteOf(rel.duration);
      const wheel = motionEntry('wheel-picker', '정착 — 휠 · 트랙패드');
      const releaseMin = numIn(range, /^(\d+)ms/, `${w} motion 끌기 정착 시간`);
      const perItem = numIn(relNote, /칸마다\s*(\d+)/, `${w} motion 끌기 정착 비고`);
      const maxItems2 = numIn(relNote, /최대\s*(\d+)칸/, `${w} motion 끌기 정착 비고`);
      const releaseMax = numIn(range, /~\s*(\d+)ms/, `${w} motion 끌기 정착 시간`);
      same(numIn(relNote, /^(\d+)\s*\+/, `${w} motion 끌기 정착 비고`), releaseMin, `${w} 끌기 정착 — 시작 시간`);
      // 360 은 상한이다 — 놓은 자리에서 맞출 칸까지(최대 3칸 + 반 칸)를 칸마다 40 으로 셈한다
      if (releaseMin + perItem * maxItems2 > releaseMax) throw new Error(`${w} 끌기 정착 — 220 + 40 × 3 이 상한 360 을 넘는다`);
      // wheel-picker.md Behavior — "3px 넘게 움직이면 끈다" · "마지막 입력 120ms 뒤 가까운 칸으로 160ms"
      const dragRow = mdRow('wheel-picker.md', '| 마우스로 끌기 |');
      const wheelRow = mdRow('wheel-picker.md', '| 마우스 휠 · 트랙패드 |');
      const wheelAlign = numIn(String(wheel.duration), /(\d+)ms/, `${w} motion 휠 정착 시간`);
      same(numIn(wheelRow, /(\d+)ms\s*\|/, 'wheel-picker.md 휠 정착'), wheelAlign, `${w} 휠 정착 — md · yaml`);
      same(numIn(wheelRow, /마지막 입력\s*(\d+)ms/, 'wheel-picker.md 휠 대기'), numIn(String(wheel.note ?? ''), /(\d+)ms 뒤/, `${w} motion 휠 비고`), `${w} 휠 대기 — md · yaml`);
      // 항목 누르기 · ↑ ↓ — 200ms ease-out cubic(Q-005 A). md 의 누르기 줄과 같아야 한다
      const press = motionEntry('wheel-picker', '항목 누르기 · ↑ ↓');
      const move = numIn(String(tokenValue(press.duration)), /(\d+)ms/, `${w} motion 누르기 시간`);
      same(numIn(mdRow('wheel-picker.md', '| 보이는 항목 누르기 |'), /가운데로\s*(\d+)ms/, 'wheel-picker.md 누르기 시간'), move, `${w} 누르기 시간 — md · yaml`);
      if (String(press.easing) !== 'ease-out cubic') throw new Error(`${w} motion 누르기 곡선(${String(press.easing)})을 그림이 모른다`);
      return {
        dragThreshold: numIn(dragRow, /(\d+)px 넘게/, 'wheel-picker.md 끌기 문턱'),
        move,
        releaseMin,
        releaseMax,
        perItem,
        maxItems: maxItems2,
        wheelIdle: numIn(wheelRow, /마지막 입력\s*(\d+)ms/, 'wheel-picker.md 휠 대기'),
        wheelAlign,
        // 놓기 직전 움직임이 이만큼 묵었으면 빠르기를 0 으로 본다(SEED 구현 값 — 스펙에는 없다)
        staleVelocity: 80,
      };
    })(),
  };
  // 비고의 셈 — 안개 5개 88 · 7개 123 · small 5개 72
  same(Math.floor(fogHeight(look, 'medium', 5)), numIn(fogNote, /medium 5개\s*(\d+)/, `${w} fog.height 비고`), `${w} 안개 medium 5개`);
  same(Math.floor(fogHeight(look, 'medium', 7)), numIn(fogNote, /7개\s*(\d+)/, `${w} fog.height 비고`), `${w} 안개 medium 7개`);
  same(Math.floor(fogHeight(look, 'small', 5)), numIn(fogNote, /small 5개\s*(\d+)/, `${w} fog.height 비고`), `${w} 안개 small 5개`);
  wheelCache.set(brand, look);
  return look;
}

// ── Time Picker ───────────────────────────────────────────
let timeCache: TimeLook | undefined;
export function timeLook(): TimeLook {
  if (timeCache) return timeCache;
  const spec = loadComponentSpec('time-picker');
  const w = 'time-picker';
  sameSet(stateNames(spec), ['enabled', 'disabled'], `${w}.yaml 의 states`);
  const steps = axisValues(spec, 'minuteStep').map(Number);
  sameSet(steps.map(String), ['1', '5', '10', '15', '30'], `${w}.yaml 의 minuteStep`);
  const v = resolveState(spec, {}, 'enabled');
  const wl = wheelLook();
  // 휠 220 = Wheel Picker medium 44 × 5
  const height = len(v['root.height'], `${w} root.height`);
  const hn = noteOf(v['root.height']);
  const size = /medium/.test(hn) ? 'medium' : 'small';
  const item = numIn(hn, /^(\d+)\s*×/, `${w} root.height 비고`);
  const visible = numIn(hn, /×\s*(\d+)/, `${w} root.height 비고`);
  same(item, wl.sizes[size].item, `${w} 항목 높이 — Wheel Picker ${size}`);
  same(item * visible, height, `${w} 휠 높이`);
  // 칼럼 순서 · 이름 — "오전·오후 → 시 → 분", 읽는 이름은 time-picker.md ARIA 줄의 "오전/오후" · "시" · "분"
  const order = String(unbox(v['root.columnOrder']));
  if (order.replace(/\s/g, '') !== '오전·오후→시→분') throw new Error(`${w} root.columnOrder(${order})가 그림(오전·오후 → 시 → 분)과 다르다`);
  const aria = mdRow('time-picker.md', '| **ARIA** |');
  const names = /이름\s*"([^"]+)"\s*·\s*"([^"]+)"\s*·\s*"([^"]+)"/.exec(aria);
  if (!names) throw new Error('time-picker.md ARIA 줄에서 칼럼 이름 셋을 찾지 못했다');
  const col = (k: TpColumnKey, slot: string, name: string) => {
    const align = String(unbox(must(v[`${slot}.align`], `${w} ${slot}.align`)));
    if (!['left', 'center', 'right'].includes(align)) throw new Error(`${w} ${slot}.align(${align})`);
    const note = noteOf(v[`${slot}.items`]);
    const loop = !note.includes('반복하지 않는다') && note.includes('반복');
    return [k, { align: align as 'left' | 'center' | 'right', loop, name }] as const;
  };
  // 항목 — 오전 · 오후 / 1 ~ 12 / 분 간격대로 00 ~ 59
  if (String(unbox(v['periodColumn.items'])).replace(/\s/g, '') !== '오전·오후') throw new Error(`${w} periodColumn.items 가 오전 · 오후가 아니다`);
  if (String(unbox(v['hourColumn.items'])).replace(/\s/g, '') !== '1~12') throw new Error(`${w} hourColumn.items 가 1 ~ 12 가 아니다`);
  if (!/00\s*~\s*59/.test(String(unbox(v['minuteColumn.items'])))) throw new Error(`${w} minuteColumn.items 가 00 ~ 59 가 아니다`);
  // 날짜 칸 옆 시각 칸 — time-picker.md "날짜와 함께" 의 "시각 칸은 144" 와 코드(flex-wrap · 날짜 min-w-max flex-1 · 시각 w-[144px] shrink-0)
  const md = readFileSync(join(process.cwd(), '..', 'specs/components/time-picker.md'), 'utf8');
  const fieldWidth = numIn(md, /시각 칸은\s*(\d+)/, 'time-picker.md 날짜와 함께');
  same(numIn(md, /w-\[(\d+)px\] shrink-0/, 'time-picker.md 코드의 시각 칸'), fieldWidth, 'time-picker.md 시각 칸 폭 — 글 · 코드');
  if (!/flex flex-wrap/.test(md) || !/min-w-max flex-1/.test(md)) throw new Error('time-picker.md 날짜 + 시각 코드가 flex-wrap · min-w-max flex-1 이 아니다 — date-screens 의 DateTimeRow 를 고친다');
  timeCache = {
    height,
    fieldWidth,
    visible,
    size,
    steps,
    defaultStep: Number(must(spec.defaults?.minuteStep, `${w} defaults.minuteStep`)),
    columns: Object.fromEntries([col('period', 'periodColumn', names[1]), col('hour', 'hourColumn', names[2]), col('minute', 'minuteColumn', names[3])]) as TimeLook['columns'],
  };
  return timeCache;
}

// ── Date Picker ───────────────────────────────────────────
const dateCache = new Map<Brand, DateLook>();
export function dateLook(brand: Brand = 'desk'): DateLook {
  const hit = dateCache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('date-picker');
  const w = 'date-picker';
  sameSet(stateNames(spec), DP_STATES, `${w}.yaml 의 states`);
  sameSet(axisValues(spec, 'selection'), DP_SELECTIONS, `${w}.yaml 의 selection`);
  sameSet(axisValues(spec, 'visibleRange'), DP_RANGES, `${w}.yaml 의 visibleRange`);
  const v = resolveState(spec, {}, 'enabled');
  const st = (s: DpState) => resolveState(spec, {}, s);
  const two = resolveState(spec, { visibleRange: 'twoMonths' }, 'enabled');
  const cont = resolveState(spec, { visibleRange: 'continuous' }, 'enabled');
  const ov = overlayLook(brand);
  const wl = wheelLook(brand);
  const cl = chipLook(brand);

  // 달력 폭 — 팝오버 336(칸 48 × 7), 시트는 시트 폭 − 좌우 24 · 24(Bottom Sheet 본문 여백)
  const width = len(v['root.width'], `${w} root.width`);
  const cellH = len(v['cell.height'], `${w} cell.height`);
  const rootNote = noteOf(v['root.width']);
  same(numIn(rootNote, /칸\s*(\d+)\s*×/, `${w} root.width 비고`) * numIn(rootNote, /×\s*(\d+)/, `${w} root.width 비고`), width, `${w} 팝오버 달력 폭 — 칸 × 7`);
  same(numIn(rootNote, /칸\s*(\d+)\s*×/, `${w} root.width 비고`), cellH, `${w} 팝오버 칸 폭 · 칸 높이`);
  const sheetPadX = numIn(rootNote, /좌우\s*(\d+)/, `${w} root.width 비고`);
  same(sheetPadX, ov.sheet.body.padX, `${w} 시트 좌우 — Bottom Sheet 본문 좌우 여백`);
  same(ov.popover.body.padX, sheetPadX, `${w} 팝오버 좌우 — Popover 본문 좌우 여백`);

  // 원 — "칸 위 3 · 가로 가운데 … 칸이 44 보다 좁으면(320 화면) 칸 폭 − 2"
  const dayNote = noteOf(v['dayVisual.size']);
  const daySize = len(v['dayVisual.size'], `${w} dayVisual.size`);
  const top = numIn(dayNote, /칸 위\s*(\d+)/, `${w} dayVisual.size 비고`);
  same(top * 2 + daySize, cellH, `${w} 원 위아래 — 칸 위 3 + 원 + 아래 3 = 칸 높이`);
  same(numIn(dayNote, /원 · 띠끼리\s*(\d+)/, `${w} dayVisual.size 비고`), top * 2, `${w} 원끼리 거리`);
  const bandH = len(v['rangeBand.height'], `${w} rangeBand.height`);
  same(bandH, daySize, `${w} 띠 높이 · 원`);
  same(numIn(noteOf(v['rangeBand.height']), /칸 위\s*(\d+)/, `${w} rangeBand.height 비고`), top, `${w} 띠 위 거리 · 원`);

  // 이전 · 다음 — Button ghost iconOnly medium(40 · 아이콘 18)
  const nav = buttonLook({ variant: 'ghost', size: 'medium', layout: 'iconOnly' }, brand);
  const navSize = len(v['navButton.size'], `${w} navButton.size`);
  const navIcon = len(v['navButton.iconSize'], `${w} navButton.iconSize`);
  if (!/Button ghost iconOnly medium/.test(noteOf(v['navButton.size']))) throw new Error(`${w} navButton.size 비고가 Button ghost iconOnly medium 이 아니다 — nav 를 고친다`);
  same(nav.faces.light.enabled.height, navSize, `${w} 이전 · 다음 — Button medium 높이`);
  same(nav.faces.light.enabled.width ?? 0, navSize, `${w} 이전 · 다음 — Button iconOnly 폭`);
  same(nav.faces.light.enabled.icon, navIcon, `${w} 이전 · 다음 아이콘 — Button iconOnly medium`);
  const navColor = tokc(v['navButton.color'], brand, `${w} navButton.color`);
  if (nav.faces.light.enabled.fg !== navColor.light || nav.faces.dark.enabled.fg !== navColor.dark) throw new Error(`${w} navButton.color 가 Button ghost 의 글자색과 다르다`);
  const header = len(v['header.height'], `${w} header.height`);

  // 연 · 월 휠 — "Wheel Picker medium 44 × 7 = 308 을 가운데에(위아래 14)"
  const wheelH = len(v['wheel.height'], `${w} wheel.height`);
  const wn = noteOf(v['wheel.height']);
  const wheelSize = /medium/.test(wn) ? 'medium' : 'small';
  const wheelItem = numIn(wn, /(\d+)\s*×\s*\d+\s*=/, `${w} wheel.height 비고`);
  const wheelVisible = numIn(wn, /\d+\s*×\s*(\d+)\s*=/, `${w} wheel.height 비고`);
  same(wheelItem, wl.sizes[wheelSize].item, `${w} 연 · 월 휠 항목 — Wheel Picker ${wheelSize}`);
  same(numIn(wn, /=\s*(\d+)/, `${w} wheel.height 비고`), wheelItem * wheelVisible, `${w} 연 · 월 휠 높이`);
  same(numIn(wn, /위아래\s*(\d+)/, `${w} wheel.height 비고`) * 2 + wheelItem * wheelVisible, wheelH, `${w} 연 · 월 휠 자리`);
  same(numIn(wn, /요일 줄\s*(\d+)/, `${w} wheel.height 비고`) + numIn(wn, /6주\s*(\d+)/, `${w} wheel.height 비고`), wheelH, `${w} 휠 자리 = 요일 줄 + 6주`);
  same(len(v['weekday.height'], `${w} weekday.height`) + cellH * Number(unbox(v['cell.weeks'])), wheelH, `${w} 요일 줄 + 6주 = 휠 자리`);

  // 두 달 — "336 + 24 + 336 — 팝오버 폭 744", 이전 · 다음은 "위 4"
  const twoW = len(two['root.width'], `${w} twoMonths root.width`);
  const twoGap = len(two['root.columnGap'], `${w} twoMonths root.columnGap`);
  same(width * 2 + twoGap, twoW, `${w} 두 달 폭`);
  same(numIn(noteOf(two['root.width']), /팝오버 폭\s*(\d+)/, `${w} twoMonths root.width 비고`), twoW + ov.popover.body.padX * 2, `${w} 두 달 팝오버 폭 — 달력 + Popover 본문 좌우`);
  const navTop = numIn(noteOf(two['header.height']), /위\s*(\d+)\)/, `${w} twoMonths header.height 비고`);
  same(navTop * 2 + navSize, header, `${w} 두 달 이전 · 다음 — 머리 가운데`);

  // 빠른 기간 — "Chip outlineStrong medium 36", 칩 사이 8(Chip 묶음 간격), 아래 12
  const chipRaw = String(unbox(v['presets.chip']));
  const cm = /^Chip\s+(outlineStrong)\s+(medium)\s+(\d+)$/.exec(chipRaw);
  if (!cm) throw new Error(`${w} presets.chip(${chipRaw})이 "Chip outlineStrong medium 36" 꼴이 아니다`);
  same(cl.sizes.medium.h, Number(cm[3]), `${w} 빠른 기간 칩 — Chip medium 높이`);
  const presetGap = len(v['presets.gap'], `${w} presets.gap`);
  same(presetGap, cl.group.gap, `${w} 빠른 기간 칩 사이 — Chip 묶음 간격`);

  // 팝오버 바닥 — 달력 아래 16 · small 36, 시트는 Bottom Sheet 바닥(위 12 · 아래 16 · large 48)
  const footTop = len(v['footer.paddingTop'], `${w} footer.paddingTop`);
  const fn = noteOf(v['footer.paddingTop']);
  same(footTop, ov.popover.footer.padTop, `${w} 팝오버 바닥 위 — Popover 바닥`);
  same(numIn(fn, /small\s*(\d+)/, `${w} footer 비고`), ov.popover.footer.button.height, `${w} 팝오버 바닥 버튼 — Popover small`);
  same(numIn(fn, /위\s*(\d+)\s*·\s*아래/, `${w} footer 비고`), ov.sheet.footer.padTop, `${w} 시트 바닥 위 — Bottom Sheet`);
  same(numIn(fn, /·\s*아래\s*(\d+)/, `${w} footer 비고`), ov.sheet.footer.padBottom, `${w} 시트 바닥 아래 — Bottom Sheet`);
  same(numIn(fn, /large\s*(\d+)/, `${w} footer 비고`), ov.sheet.footer.button.height, `${w} 시트 바닥 버튼 — Bottom Sheet large`);

  // 상태 — 원 바탕 · 숫자 색 · 굵기 · 취소선 · 커서
  const faces = {} as Record<DpState, DpFace>;
  const baseRule = spec.rules.find((r) => !r.when || Object.keys(r.when).length === 0) as Record<string, Record<string, Record<string, unknown>> | undefined>;
  const PROP: Record<string, DpProp> = { 'dayVisual.background': 'bg', 'dayLabel.foreground': 'fg', 'dayLabel.fontWeight': 'weight', 'dayLabel.textDecoration': 'strike', 'cell.cursor': 'cursor' };
  for (const s of DP_STATES) {
    const r = st(s);
    const block = baseRule[s] ?? {};
    const set = Object.entries(PROP)
      .filter(([k]) => {
        const [slot, prop] = k.split('.');
        return block[slot]?.[prop] !== undefined;
      })
      .map(([, p]) => p);
    const deco = r['dayLabel.textDecoration'] === undefined ? 'none' : String(unbox(r['dayLabel.textDecoration']));
    faces[s] = {
      bg: tok(r['dayVisual.background'], brand, `${w} ${s} dayVisual.background`),
      fg: tokc(r['dayLabel.foreground'], brand, `${w} ${s} dayLabel.foreground`),
      weight: unbox(must(r['dayLabel.fontWeight'], `${w} ${s} dayLabel.fontWeight`)) as number,
      strike: deco === 'line-through',
      cursor: String(unbox(must(r['cell.cursor'], `${w} ${s} cell.cursor`))),
      set,
    };
  }
  // 원 크기 min(원, 칸 − 2) 가 "44 보다 좁으면 칸 폭 − 2" 와 같으려면 44 = 원 + 2 여야 한다(그림은 min 으로 그린다)
  same(numIn(dayNote, /(\d+)\s*보다 좁으면/, `${w} dayVisual.size 비고`), daySize + numIn(dayNote, /칸 폭\s*−\s*(\d+)/, `${w} dayVisual.size 비고`), `${w} 원을 줄이는 칸 폭 — 원 + 2`);
  // 호버 · 누름 — 오늘 · 기간 사이 날 위에서는 비고의 "한 단계 짙은 bg-neutral-weak-pressed"(누름 비고도 같은 토큰)
  const weakOf = (raw: unknown, what: string) => {
    const m = /(bg-[a-z-]+-pressed)/.exec(noteOf(raw).replace(/^[^—]*—/, ''));
    if (!m) throw new Error(`${w} ${what} 비고에서 오늘 · 기간 사이 날의 호버 색을 찾지 못했다`);
    return m[1];
  };
  const pressOnWeak = weakOf(st('hovered')['dayVisual.background'], 'hovered dayVisual.background');
  if (weakOf(st('pressed')['dayVisual.background'], 'pressed dayVisual.background') !== pressOnWeak) throw new Error(`${w} 호버 · 누름 비고의 오늘 · 기간 위 색이 다르다`);
  if (!noteOf(st('hovered')['dayVisual.background']).includes('막힌 날 · 읽기 전용 · 앞뒤 달에는 없다')) throw new Error(`${w} hovered 비고가 "막힌 날 · 읽기 전용 · 앞뒤 달에는 없다" 가 아니다 — date-view 의 호버를 고친다`);
  const focused = st('focused');
  const chev = motionEntry(w, '제목 셰브론');
  const monthNote = noteOf(cont['monthLabel.paddingX']);
  const look: DateLook = {
    width,
    sheetPadX,
    bg: tokc(v['root.background'], brand, `${w} root.background`),
    header: { height: header },
    title: {
      text: type(v['title.typography'], v['title.fontWeight'], `${w} title.typography`),
      color: tokc(v['title.foreground'], brand, `${w} title.foreground`),
      padX: len(v['title.paddingX'], `${w} title.paddingX`),
      gap: len(v['title.gap'], `${w} title.gap`),
      radius: len(v['title.radius'], `${w} title.radius`),
      icon: len(v['titleIcon.size'], `${w} titleIcon.size`),
      iconColor: tokc(v['titleIcon.color'], brand, `${w} titleIcon.color`),
    },
    nav: { size: navSize, icon: navIcon, color: navColor, target: numIn(noteOf(v['navButton.size']), /누르는 영역\s*(\d+)/, `${w} navButton.size 비고`) },
    weekday: { height: len(v['weekday.height'], `${w} weekday.height`), text: type(v['weekday.typography'], v['weekday.fontWeight'], `${w} weekday.typography`), color: tokc(v['weekday.foreground'], brand, `${w} weekday.foreground`) },
    cell: { height: cellH, weeks: Number(unbox(must(v['cell.weeks'], `${w} cell.weeks`))) },
    day: {
      size: daySize,
      top,
      shrinkBelow: numIn(dayNote, /(\d+)\s*보다 좁으면/, `${w} dayVisual.size 비고`),
      shrinkBy: numIn(dayNote, /칸 폭\s*−\s*(\d+)/, `${w} dayVisual.size 비고`),
      text: type(v['dayLabel.typography'], v['dayLabel.fontWeight'], `${w} dayLabel.typography`),
    },
    faces,
    pressOnWeak: named(pressOnWeak, brand),
    band: { height: bandH, color: tokc(v['rangeBand.background'], brand, `${w} rangeBand.background`) },
    monthLabel: {
      height: len(v['monthLabel.height'], `${w} monthLabel.height`),
      text: type(v['monthLabel.typography'], v['monthLabel.fontWeight'], `${w} monthLabel.typography`),
      color: tokc(v['monthLabel.foreground'], brand, `${w} monthLabel.foreground`),
      padX: len(cont['monthLabel.paddingX'], `${w} continuous monthLabel.paddingX`),
      gapBelow: numIn(monthNote, /달 아래\s*(\d+)/, `${w} continuous monthLabel.paddingX 비고`),
    },
    wheel: {
      height: wheelH,
      visible: wheelVisible,
      size: wheelSize,
      bg: tokc(v['wheel.background'], brand, `${w} wheel.background`),
      // "연 120 · 월 96" — 비고 "연은 오른쪽 · 월은 왼쪽 정렬". 달만 고르는 휠도 같은 칼럼이다(wheel-picker.yaml column.width 비고)
      columns: (() => {
        const raw = String(unbox(must(v['wheel.columns'], `${w} wheel.columns`)));
        const note = noteOf(v['wheel.columns']);
        if (!/연은 오른쪽/.test(note) || !/월은 왼쪽/.test(note)) throw new Error(`${w} wheel.columns 비고가 "연은 오른쪽 · 월은 왼쪽" 이 아니다 — date-view 의 연 · 월 휠을 고친다`);
        const year = numIn(raw, /연\s*(\d+)/, `${w} wheel.columns`);
        const month = numIn(raw, /월\s*(\d+)/, `${w} wheel.columns`);
        const wpNote = noteOf(resolveState(loadComponentSpec('wheel-picker'), {}, 'enabled')['column.width']);
        same(numIn(wpNote, /연\s*(\d+)\s*·\s*월/, 'wheel-picker.yaml column.width 비고'), year, 'wheel-picker 연 · 월 휠의 연 칼럼 — date-picker.yaml');
        same(numIn(wpNote, /월\s*(\d+)\s*고정/, 'wheel-picker.yaml column.width 비고'), month, 'wheel-picker 연 · 월 휠의 월 칼럼 — date-picker.yaml');
        return { year: { width: year, align: 'right' as const }, month: { width: month, align: 'left' as const } };
      })(),
    },
    twoMonths: { width: twoW, gap: twoGap, navTop },
    fog: { height: len(cont['fog.height'], `${w} continuous fog.height`) },
    presets: { gap: presetGap, padBottom: len(v['presets.paddingBottom'], `${w} presets.paddingBottom`), variant: 'outlineStrong', size: 'medium', height: Number(cm[3]) },
    footer: { padTop: footTop },
    ring: { width: len(focused['focusRing.width'], `${w} focusRing.width`), offset: len(focused['focusRing.offset'], `${w} focusRing.offset`), color: tokc(focused['focusRing.color'], brand, `${w} focusRing.color`) },
    motion: {
      bg: motionPair(v['dayVisual.transitionDuration'], v['dayVisual.transitionEasing'], `${w} dayVisual.transition`),
      chevron: motionPair(chev.duration, chev.easing, `${w} motion 제목 셰브론`),
      chevronTurn: numIn((chev.properties ?? []).join(' '), /→\s*(\d+)°/, `${w} motion 제목 셰브론 properties`),
    },
  };
  if (faces.enabled.bg) throw new Error(`${w} enabled dayVisual.background 가 투명이 아니다`);
  if (look.weekday.height !== cellH || header !== cellH) throw new Error(`${w} 머리 · 요일 · 날짜 줄이 모두 같은 높이가 아니다(date-picker.md "모두 48")`);
  dateCache.set(brand, look);
  return look;
}

// 브라우저 그림에 넘기는 한 벌
export function dateKit(brand: Brand = 'desk'): DateKit {
  return { brand, date: dateLook(brand), wheel: wheelLook(brand), time: timeLook(), chip: chipLook(brand), nav: buttonLook({ variant: 'ghost', size: 'medium', layout: 'iconOnly' }, brand) };
}
