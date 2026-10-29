// Select Box 의 모양 — specs/components/select-box.yaml 을 고름 · 모드 · 상태 · 배치마다 풀어 둔다(서버, 빌드 때).
// 그림(SelectBoxView)은 이 값만 받아 그린다. 오른쪽 라디오 · 체크는 그 컴포넌트의 YAML 에서 온다.
import { axisValues, loadComponentSpec, num, resolveState, tokenValue, type TypeValue } from '@/lib/component-spec';
import type { Mode } from '@/lib/component-spec';
import { color, design, pressScale, reducedMotion, type Brand } from '@/lib/design-tokens';
import { checkLook } from './checkbox-look';
import { snackbarLook } from './feedback-look';
import { radioLook } from './radio-group-look';
import { SB_DENSITIES, SB_LAYOUTS, SB_SELECTED, SB_STATES, type SbFace, type SbLayoutFace, type SbLook, type SbMotion, type SbState, type SbType } from './select-box-shared';
export * from './select-box-shared';

const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined) throw new Error(`select-box.yaml 에 ${what} 이 없다`);
  return v;
};
const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);

function type(raw: unknown, weight: unknown): SbType {
  const t = raw as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error('select-box.yaml 의 글자 토큰을 풀지 못했다');
  return { fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: (unbox(weight) as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}

function face(v: Record<string, unknown>, focused: Record<string, unknown>, state: SbState, mode: Mode, brand: Brand): SbFace {
  const t = (k: string, src = v) => tokenValue(src[k], mode, brand);
  const n = (k: string, src = v) => must(num(t(k, src)), k);
  const c = (k: string, src = v) => must(str(t(k, src)), k);
  return {
    radius: n('root.radius'),
    bg: c('root.background'),
    border: { width: n('root.borderWidth'), color: c('root.borderColor') },
    cursor: c('trigger.cursor'),
    trigger: { gap: n('trigger.gap') },
    prefix: { size: n('prefix.size'), color: c('prefix.color') },
    body: { gap: n('body.gap'), padRight: n('body.paddingRight') },
    label: { ...type(t('label.typography'), v['label.fontWeight']), color: c('label.foreground'), gap: n('label.gap') },
    description: { ...type(t('description.typography'), v['description.fontWeight']), color: c('description.foreground') },
    control: { size: n('control.size') },
    footer: { padX: n('footer.paddingX'), padBottom: n('footer.paddingBottom') },
    ring: { width: n('focusRing.width', focused), offset: n('focusRing.offset', focused), color: c('focusRing.color', focused) },
    scale: state === 'pressed' && v['trigger.scale'] !== undefined,
    motion: {
      bg: { duration: c('root.transitionDuration'), easing: c('root.transitionEasing') },
      scale: { duration: c('trigger.transitionDuration'), easing: c('trigger.transitionEasing') },
    },
  };
}

function layoutFace(v: Record<string, unknown>): SbLayoutFace {
  const t = (k: string) => tokenValue(v[k]);
  const n = (k: string) => num(t(k));
  const y = must(n('trigger.paddingY'), 'trigger.paddingY');
  const left = must(n('trigger.paddingLeft') ?? n('trigger.paddingX'), 'trigger.paddingLeft · paddingX');
  const right = must(n('trigger.paddingRight') ?? n('trigger.paddingX'), 'trigger.paddingRight · paddingX');
  const dir = str(t('content.direction'));
  if (dir !== 'row' && dir !== 'column') throw new Error(`select-box.yaml 의 content.direction 이 row · column 이 아니다(${dir})`);
  return { pad: { top: y, right, bottom: y, left }, alignItems: must(str(t('trigger.alignItems')), 'trigger.alignItems'), content: { gap: must(n('content.gap'), 'content.gap'), direction: dir } };
}

// motion 블록의 한 줄 — 이름으로 찾는다(이름을 바꾸면 여기가 멈춘다)
type MotionEntry = { duration: unknown; easing: unknown };
function motionOf(name: string): SbMotion {
  const all = (loadComponentSpec('select-box') as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`select-box.yaml 의 motion 에 "${name}" 이 없다`);
  return { duration: must(str(tokenValue(m.duration)), `${name}.duration`), easing: must(str(tokenValue(m.easing)), `${name}.easing`) };
}

const cache = new Map<string, SbLook>();

export function selectBoxLook(brand: Brand = 'desk'): SbLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('select-box');
  const faces = {} as SbLook['faces'];
  for (const selected of SB_SELECTED) {
    const when = { selected, layout: 'horizontal' };
    const focused = resolveState(spec, when, 'focused');
    faces[selected] = { light: {}, dark: {} } as SbLook['faces'][typeof selected];
    for (const mode of ['light', 'dark'] as Mode[]) for (const st of SB_STATES) faces[selected][mode][st] = face(resolveState(spec, when, st), focused, st, mode, brand);
  }
  const layouts = Object.fromEntries(SB_LAYOUTS.map((l) => [l, layoutFace(resolveState(spec, { layout: l }, 'enabled'))])) as SbLook['layouts'];
  // 밀도 — 세로형의 낮은 상자. 가로형은 밀도가 바꾸지 않는다(바뀌면 그림이 그 값을 못 그린다 — 여기서 멈춘다)
  const densities = axisValues(spec, 'density');
  if (densities.join() !== SB_DENSITIES.join()) throw new Error(`select-box.yaml 의 density 가 ${SB_DENSITIES.join(' · ')} 가 아니다(${densities.join(' · ')})`);
  const compact = layoutFace(resolveState(spec, { layout: 'vertical', density: 'compact' }, 'enabled'));
  if (JSON.stringify(layoutFace(resolveState(spec, { layout: 'horizontal', density: 'compact' }, 'enabled'))) !== JSON.stringify(layouts.horizontal))
    throw new Error('select-box.yaml 의 density compact 가 가로형 값을 바꾼다 — 그림은 세로형에만 낮은 상자를 그린다');
  const base = resolveState(spec, {}, 'enabled');
  const group = { gapX: must(num(tokenValue(base['group.gapX'])), 'group.gapX'), gapY: must(num(tokenValue(base['group.gapY'])), 'group.gapY') };

  // 펼침 안의 입력칸 — input.yaml 의 상자형 large(폰 화면의 칸 — 펼침의 내용은 쓰는 쪽이 정한다)
  const iv = resolveState(loadComponentSpec('input'), { variant: 'outline', size: 'large' }, 'enabled');
  const it = (k: string, mode: Mode = 'light') => tokenValue(iv[k], mode, brand);
  const inType = it('value.typography') as TypeValue;
  const ivFocus = resolveState(loadComponentSpec('input'), { variant: 'outline', size: 'large' }, 'focused');
  const both = (k: string) => ({ light: must(str(it(k, 'light')), `input ${k}`), dark: must(str(it(k, 'dark')), `input ${k}`) });

  const pick = (name: string): Record<Mode, string> => ({ light: color(name, brand), dark: design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand) });
  const { distance, widthDivisor, minBasis } = pressScale();
  const look: SbLook = {
    faces,
    layouts,
    compact,
    group,
    press: { distance, widthDivisor, minBasis },
    motion: {
      border: motionOf('고름 — 테두리'),
      footer: {
        open: { height: motionOf('펼침 — 열 때 · 높이'), opacity: motionOf('펼침 — 열 때 · 투명도') },
        close: { height: motionOf('펼침 — 닫을 때 · 높이'), opacity: motionOf('펼침 — 닫을 때 · 투명도') },
        reducedFade: `${reducedMotion().fade}ms`,
      },
    },
    marks: {
      // 레시피와 같은 컨트롤 — Radiomark medium · neutral, Checkmark medium · ghost · neutral
      radio: radioLook({ size: 'medium', tone: 'neutral' }, brand),
      check: checkLook({ size: 'medium', shape: 'ghost', tone: 'neutral' }, brand),
    },
    input: {
      height: must(num(it('root.minHeight')), 'input root.minHeight'),
      padX: must(num(it('root.paddingX')), 'input root.paddingX'),
      radius: must(num(it('root.radius')), 'input root.radius'),
      fontSize: inType.fontSize,
      lineHeight: inType.lineHeight,
      bg: both('root.background'),
      fg: both('value.foreground'),
      border: both('root.borderColor'),
      focus: { light: must(str(tokenValue(ivFocus['root.borderColor'], 'light', brand)), 'input focused root.borderColor'), dark: must(str(tokenValue(ivFocus['root.borderColor'], 'dark', brand)), 'input focused root.borderColor') },
    },
    surface: { default: pick('bg-layer-default'), basement: pick('bg-layer-basement'), floating: pick('bg-layer-floating') },
    snackbar: snackbarLook(brand),
  };
  cache.set(brand, look);
  return look;
}
