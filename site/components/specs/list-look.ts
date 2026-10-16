// List 의 모양 — specs/components/list.yaml · list-header.yaml 을 강조 · 모드 · 상태마다 풀어 둔다(서버, 빌드 때).
// 그림(ListView)은 이 값만 받아 그린다. 줄에 끼우는 스위치 · 체크 · 라디오는 그 컴포넌트의 YAML 에서 온다.
import { axisDesc, axisValues, loadComponentSpec, num, resolveState, tokenValue, type TypeValue } from '@/lib/component-spec';
import type { Mode } from '@/lib/component-spec';
import { CHART_ORDER, color, design, pressScale, type Brand } from '@/lib/design-tokens';
import { buttonLook, recolorButton } from './button-look';
import { checkLook } from './checkbox-look';
import { radioLook } from './radio-group-look';
import { switchLook } from './switch-look';
import { avatarLook } from './display-look';
import { HEADER_VARIANTS, LIST_HIGHLIGHTS, LIST_STATES, type HeaderFace, type ListFace, type ListLook, type ListState, type ListType, type TileColor } from './list-shared';
export * from './list-shared';

const str = (v: unknown) => (typeof v === 'string' ? v : undefined);
const isColor = (v: unknown) => typeof v === 'string' && /^(#|rgba?\()/.test(v);
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined) throw new Error(`list.yaml 에 ${what} 이 없다`);
  return v;
};

function type(raw: unknown, weight: unknown): ListType {
  const t = raw as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error('list.yaml 의 글자 토큰을 풀지 못했다');
  return { fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: (weight as number | string | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}

function face(v: Record<string, unknown>, focused: Record<string, unknown>, state: ListState, mode: Mode, brand: Brand): ListFace {
  const t = (k: string, src = v) => tokenValue(src[k], mode, brand);
  const n = (k: string, src = v) => must(num(t(k, src)), k);
  const c = (k: string, src = v) => must(str(t(k, src)), k);
  // 단위 없는 수(줄어듦 0 · 1)
  const plain = (k: string) => {
    const x = Number(c(k));
    if (Number.isNaN(x)) throw new Error(`list.yaml 의 ${k} 가 수가 아니다`);
    return x;
  };
  const boxed = (k: string) => {
    const raw = v[k];
    return raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw;
  };
  return {
    pad: { y: n('item.paddingY'), x: n('item.paddingX') },
    cursor: c('item.cursor'),
    bg: { color: c('background.background'), insetX: n('background.insetX'), radius: n('background.radius') },
    prefix: { padRight: n('prefix.paddingRight'), iconSize: n('icon.size'), iconColor: c('icon.color') },
    tile: {
      size: n('tile.size'),
      radius: n('tile.radius'),
      iconSize: n('tile.iconSize'),
      bg: isColor(t('tile.background')) ? c('tile.background') : undefined,
      fg: isColor(t('tile.color')) ? c('tile.color') : undefined,
    },
    body: { gap: n('body.gap'), padRight: n('body.paddingRight'), minWidth: c('body.minWidth') },
    title: { ...type(t('title.typography'), boxed('title.fontWeight')), color: c('title.foreground'), overflowWrap: c('title.overflowWrap') },
    detail: { ...type(t('detail.typography'), boxed('detail.fontWeight')), color: c('detail.foreground'), overflowWrap: c('detail.overflowWrap') },
    suffix: {
      ...type(t('suffixText.typography'), boxed('suffixText.fontWeight')),
      gap: n('suffix.gap'),
      color: c('suffixText.foreground'),
      iconSize: n('suffixIcon.size'),
      iconColor: c('suffixIcon.color'),
      shrink: plain('suffix.shrink'),
      textShrink: plain('suffixText.shrink'),
      textOverflowWrap: c('suffixText.overflowWrap'),
    },
    ring: { width: n('focusRing.width', focused), offset: n('focusRing.offset', focused), color: c('focusRing.color', focused) },
    divider: { height: n('divider.height'), color: c('divider.background') },
    scale: state === 'pressed' && v['content.scale'] !== undefined,
    motion: {
      bg: { duration: c('background.transitionDuration'), easing: c('background.transitionEasing') },
      content: { duration: c('content.transitionDuration'), easing: c('content.transitionEasing') },
    },
  };
}

function headerFace(v: Record<string, unknown>, mode: Mode, brand: Brand): HeaderFace {
  const t = (k: string) => tokenValue(v[k], mode, brand);
  const weight = v['root.fontWeight'];
  return {
    ...type(t('root.typography'), weight && typeof weight === 'object' && 'value' in weight ? (weight as { value: unknown }).value : weight),
    padX: must(num(t('root.paddingX')), 'root.paddingX'),
    padY: must(num(t('root.paddingY')), 'root.paddingY'),
    gap: must(num(t('root.gap')), 'root.gap'),
    color: must(str(t('root.foreground')), 'root.foreground'),
  };
}

// 좁은 줄 — content.stackBelow(16em — 제목 글자 수)와 width narrow 규칙(설명 ↔ 값 · 본문 뒤 여백 · 맞춤)
function narrowOf(spec: ReturnType<typeof loadComponentSpec>): ListLook['narrow'] {
  const base = resolveState(spec, {}, 'enabled');
  const raw = String(tokenValue(base['content.stackBelow']) ?? '');
  const m = /^(\d+(?:\.\d+)?)em$/.exec(raw);
  if (!m) throw new Error(`list.yaml content.stackBelow(${raw})가 em 값이 아니다 — 제목 글자 수로 잰다`);
  const v = resolveState(spec, { width: 'narrow' }, 'enabled');
  return {
    below: Number(m[1]),
    marginTop: must(num(tokenValue(v['suffix.marginTop'])), 'narrow suffix.marginTop'),
    bodyPadRight: must(num(tokenValue(v['body.paddingRight'])), 'narrow body.paddingRight'),
    alignItems: must(str(tokenValue(v['item.alignItems'])), 'narrow item.alignItems'),
  };
}

const cache = new Map<string, ListLook>();

export function listLook(brand: Brand = 'desk'): ListLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const spec = loadComponentSpec('list');
  const faces = {} as ListLook['faces'];
  for (const highlight of LIST_HIGHLIGHTS) {
    const when = { highlight, align: 'center' };
    const focused = resolveState(spec, when, 'focused');
    faces[highlight] = { light: {}, dark: {} } as ListLook['faces'][typeof highlight];
    for (const mode of ['light', 'dark'] as Mode[]) for (const st of LIST_STATES) faces[highlight][mode][st] = face(resolveState(spec, when, st), focused, st, mode, brand);
  }
  const alignItems = Object.fromEntries(axisValues(spec, 'align').map((a) => [a, str(tokenValue(resolveState(spec, { align: a }, 'enabled')['item.alignItems'])) ?? 'center'])) as ListLook['alignItems'];

  const hspec = loadComponentSpec('list-header');
  const header = {} as ListLook['header'];
  for (const variant of HEADER_VARIANTS) {
    header[variant] = { light: headerFace(resolveState(hspec, { variant }, 'enabled'), 'light', brand), dark: headerFace(resolveState(hspec, { variant }, 'enabled'), 'dark', brand) };
  }

  // 타일 · 아바타의 카테고리 색 — 옅은 바탕(weak) · 아이콘(chart-색) · 글자(contrast)
  const pick = (name: string): Record<Mode, string> => ({ light: color(name, brand), dark: design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand) });
  const tiles: Record<string, TileColor> = {};
  for (const hue of CHART_ORDER) tiles[hue] = { bg: pick(`chart-${hue}-weak`), fg: pick(`chart-${hue}`), contrast: pick(`chart-${hue}-contrast`) };

  // 사람 줄의 아바타 — avatar.yaml 의 자리 설명이 "한 줄 목록 줄" 36 · "두 줄 목록 줄" 42 인지(바뀌면 여기서 멈춘다)
  const aspec = loadComponentSpec('avatar');
  if (!axisDesc(aspec, 'size', '36')?.includes('한 줄 목록 줄') || !axisDesc(aspec, 'size', '42')?.includes('두 줄 목록 줄')) throw new Error('avatar.yaml 의 36 · 42 자리 설명이 목록 줄(한 줄 · 두 줄)이 아니다 — list-look 의 avatarSize 를 고친다');

  const { distance, widthDivisor, minBasis } = pressScale();
  const look: ListLook = {
    faces,
    alignItems,
    header,
    press: { distance, widthDivisor, minBasis },
    tiles,
    marks: {
      // 줄의 컨트롤 — 레시피와 같은 크기(Switchmark 32 · Checkmark · Radiomark large)
      switch: switchLook({ size: '32' }, brand),
      check: checkLook({ size: 'large' }, brand),
      radio: radioLook({ size: 'large' }, brand),
      headerAction: headerActionLook(hspec, brand),
      iconButton: buttonLook({ variant: 'ghost', ghostColor: 'neutralSubtle', size: 'xsmall', layout: 'iconOnly' }, brand),
    },
    surface: { default: pick('bg-layer-default'), basement: pick('bg-layer-basement'), floating: pick('bg-layer-floating') },
    avatar: avatarLook(brand),
    avatarSize: { one: '36', two: '42' },
    titleGap: must(num(design().front.spacing.x1_5), 'spacing x1_5'),
    narrow: narrowOf(spec),
  };
  cache.set(brand, look);
  return look;
}

// 목록 제목 오른쪽 글 버튼 — list-header.yaml action(SEED Text Button, 2026-10-16 글자 역할 D2).
// 상자는 Button ghost small 과 같은지 확인하고(높이 · 좌우 · 모서리 · 글자), 글자색만 action.foreground 로 바꾼다
function headerActionLook(hspec: ReturnType<typeof loadComponentSpec>, brand: Brand) {
  const v = resolveState(hspec, {}, 'enabled');
  const base = buttonLook({ variant: 'ghost', size: 'small' }, brand);
  const f = base.faces.light.enabled;
  const want = { height: num(tokenValue(v['action.height'])), padX: num(tokenValue(v['action.paddingX'])), radius: tokenValue(v['action.radius']) };
  if (want.height !== f.height || want.padX !== f.padX || want.radius !== f.radius) throw new Error(`list-header.yaml action(${JSON.stringify(want)})이 Button ghost small(${f.height} · ${f.padX} · ${f.radius})과 다르다 — list-look 의 글 버튼을 고친다`);
  const fg = { light: String(tokenValue(v['action.foreground'], 'light', brand)), dark: String(tokenValue(v['action.foreground'], 'dark', brand)) };
  return recolorButton(base, fg);
}
