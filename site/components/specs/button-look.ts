// Button 의 모양 — specs/components/button.yaml 을 조합 · 상태 · 모드마다 풀어 둔다(서버에서, 빌드 때).
// 그림(ButtonView)은 이 값만 받아 그린다 — 페이지에 수치를 따로 적지 않는다.
import { loadComponentSpec, num, resolveState, tokenValue, type Mode, type TypeValue } from '@/lib/component-spec';
import { design, pressScale, type Brand } from '@/lib/design-tokens';

export const BUTTON_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'loading', 'disabled'] as const;
export type ButtonState = (typeof BUTTON_STATES)[number];

export type ButtonCombo = {
  variant?: string;
  size?: string;
  layout?: 'withText' | 'iconOnly';
  ghostColor?: string;
  flush?: 'left' | 'right';
};

export type ButtonFace = {
  bg: string;
  fg: string;
  border?: string;
  borderWidth?: number;
  height: number;
  width?: number;
  padX: number;
  padY: number;
  gap: number;
  radius: string;
  fontSize: string;
  lineHeight?: string;
  fontWeight: string | number;
  fontFamily: string;
  icon: number;
  labelColor?: string;
  cursor: string;
  progress: { size: number; thickness: number; track: string; range: string };
  ring: { width: number; offset: number; color: string };
  duration: { color: string; scale: string };
  easing: { color: string; scale: string };
};

export type ButtonLook = {
  combo: Required<Omit<ButtonCombo, 'flush'>> & { flush?: 'left' | 'right' };
  faces: Record<Mode, Record<ButtonState, ButtonFace>>;
  press: { distance: number; widthDivisor: number; minBasis: number };
  // 가장자리 맞춤(flush) 텍스트 버튼이 누를 때 바뀌는 글자색 — ghost neutral 의 글자
  textPressedFg: Record<Mode, string>;
};

const str = (v: unknown) => (typeof v === 'string' ? v : undefined);

function face(v: Record<string, unknown>, mode: Mode, brand: Brand, iconOnly: boolean, focused: Record<string, unknown>): ButtonFace {
  const t = (k: string) => tokenValue(v[k], mode, brand);
  const type = t('label.typography') as TypeValue | undefined;
  const px = (k: string) => num(t(k)) ?? 0;
  const icon = iconOnly ? num(v['icon.size']) : num(v['prefixIcon.size']);
  const fr = (k: string) => tokenValue(focused[k], mode, brand);
  return {
    bg: str(t('root.background')) ?? 'transparent',
    fg: str(t('root.foreground')) ?? 'inherit',
    border: str(t('root.borderColor')),
    borderWidth: num(t('root.borderWidth')),
    height: px('root.height'),
    width: num(t('root.width')),
    padX: iconOnly ? px('root.padding') : px('root.paddingX'),
    padY: iconOnly ? px('root.padding') : px('root.paddingY'),
    gap: px('root.gap'),
    radius: str(t('root.radius')) ?? '0',
    fontSize: type?.fontSize ?? '14px',
    lineHeight: type?.lineHeight,
    fontWeight: (v['label.fontWeight'] as number | undefined) ?? type?.fontWeight ?? 700,
    fontFamily: str(t('label.fontFamily')) ?? type?.fontFamily ?? 'inherit',
    icon: icon ?? 16,
    labelColor: str(t('label.color')),
    cursor: str(t('root.cursor')) ?? 'pointer',
    progress: {
      size: num(v['progressCircle.size']) ?? 16,
      thickness: num(v['progressCircle.thickness']) ?? 2,
      track: str(t('progressCircle.track')) ?? 'transparent',
      range: str(t('progressCircle.range')) ?? 'currentColor',
    },
    ring: {
      width: num(fr('focusRing.width')) ?? 2,
      offset: num(fr('focusRing.offset')) ?? 2,
      color: str(fr('focusRing.color')) ?? 'currentColor',
    },
    duration: { color: str(t('root.transitionDuration')) ?? '150ms', scale: str(tokenValue(focusedOr(v, 'root.scaleDuration'), mode, brand)) ?? '150ms' },
    easing: { color: str(t('root.transitionEasing')) ?? 'ease', scale: str(tokenValue(focusedOr(v, 'root.scaleEasing'), mode, brand)) ?? 'ease' },
  };
}
const focusedOr = (v: Record<string, unknown>, k: string) => v[k];

const cache = new Map<string, ButtonLook>();

export function buttonLook(combo: ButtonCombo = {}, brand: Brand = 'desk'): ButtonLook {
  const spec = loadComponentSpec('button');
  const full = {
    variant: combo.variant ?? spec.defaults?.variant ?? 'neutralSolid',
    size: combo.size ?? spec.defaults?.size ?? 'medium',
    layout: combo.layout ?? (spec.defaults?.layout as 'withText') ?? 'withText',
    ghostColor: combo.ghostColor ?? spec.defaults?.ghostColor ?? 'neutral',
    ...(combo.flush ? { flush: combo.flush } : {}),
  };
  const key = JSON.stringify([full, brand]);
  const hit = cache.get(key);
  if (hit) return hit;
  const when: Record<string, string> = { variant: full.variant, size: full.size, layout: full.layout, ghostColor: full.ghostColor };
  if (full.flush) when.flush = full.flush;
  const iconOnly = full.layout === 'iconOnly';
  const focused = resolveState(spec, when, 'focused');
  // 누름의 축소 시간 · 곡선은 pressed 상태에만 적혀 있다
  const pressed = resolveState(spec, when, 'pressed');
  const faces = {} as ButtonLook['faces'];
  for (const mode of ['light', 'dark'] as Mode[]) {
    faces[mode] = {} as Record<ButtonState, ButtonFace>;
    for (const st of BUTTON_STATES) {
      const v = { ...resolveState(spec, when, st), 'root.scaleDuration': pressed['root.scaleDuration'], 'root.scaleEasing': pressed['root.scaleEasing'] };
      faces[mode][st] = face(v, mode, brand, iconOnly, focused);
    }
  }
  const { distance, widthDivisor, minBasis } = pressScale();
  const neutral = resolveState(spec, { ...when, variant: 'ghost', ghostColor: 'neutral' }, 'enabled')['root.foreground'];
  const textPressedFg = { light: String(tokenValue(neutral, 'light', brand)), dark: String(tokenValue(neutral, 'dark', brand)) };
  const look = { combo: full, faces, press: { distance, widthDivisor, minBasis }, textPressedFg };
  cache.set(key, look);
  return look;
}

// ── 플레이그라운드용 조각 — 색은 변형(+ ghost 글자색)마다, 치수는 크기 × 배치마다 따로 싣는다 ──
// button.yaml 에서 색 규칙은 변형 · ghostColor 에만, 치수 규칙은 크기 · 배치에만 걸려 있어 둘을 곱하면 전부가 된다.
const COLOR_KEYS = ['bg', 'fg', 'border', 'borderWidth', 'labelColor', 'cursor'] as const;
export type ButtonParts = {
  colors: Record<string, Record<Mode, Record<ButtonState, Pick<ButtonFace, (typeof COLOR_KEYS)[number]> & { track: string; range: string; ringColor: string }>>>;
  sizes: Record<string, Record<'withText' | 'iconOnly', Omit<ButtonFace, (typeof COLOR_KEYS)[number]>>>;
  press: ButtonLook['press'];
  textPressedFg: Record<Mode, string>;
  // 미리보기 바탕 — bg-layer-default 의 라이트 · 다크
  surface: Record<Mode, string>;
};

export function buttonParts(brand: Brand = 'desk'): ButtonParts {
  const spec = loadComponentSpec('button');
  const variants = Array.isArray(spec.variants.variant) ? spec.variants.variant : Object.keys(spec.variants.variant);
  const ghostColors = Array.isArray(spec.variants.ghostColor) ? spec.variants.ghostColor : Object.keys(spec.variants.ghostColor);
  const sizes = Array.isArray(spec.variants.size) ? spec.variants.size : Object.keys(spec.variants.size);
  const colors: ButtonParts['colors'] = {};
  const keys = variants.flatMap((v) => (v === 'ghost' ? ghostColors.map((g) => [v, g]) : [[v, 'neutral']]));
  for (const [variant, ghostColor] of keys) {
    const look = buttonLook({ variant, ghostColor }, brand);
    const key = variant === 'ghost' ? `ghost:${ghostColor}` : variant;
    colors[key] = { light: {}, dark: {} } as ButtonParts['colors'][string];
    for (const mode of ['light', 'dark'] as Mode[])
      for (const st of BUTTON_STATES) {
        const f = look.faces[mode][st];
        colors[key][mode][st] = { bg: f.bg, fg: f.fg, border: f.border, borderWidth: f.borderWidth, labelColor: f.labelColor, cursor: f.cursor, track: f.progress.track, range: f.progress.range, ringColor: look.faces[mode].focused.ring.color };
      }
  }
  const sizeParts = {} as ButtonParts['sizes'];
  for (const size of sizes) {
    sizeParts[size] = {} as ButtonParts['sizes'][string];
    for (const layout of ['withText', 'iconOnly'] as const) {
      const f = buttonLook({ size, layout }, brand).faces.light.enabled;
      const { bg, fg, border, borderWidth, labelColor, cursor, ...rest } = f;
      void bg, void fg, void border, void borderWidth, void labelColor, void cursor;
      sizeParts[size][layout] = rest;
    }
  }
  const base = buttonLook({}, brand);
  const c = design(brand).front.colors;
  const surface = { light: c['bg-layer-default'], dark: c['bg-layer-default-dark'] ?? c['bg-layer-default'] };
  return { colors, sizes: sizeParts, press: base.press, textPressedFg: base.textPressedFg, surface };
}

// 글 버튼(SEED Text Button) — Button ghost small 의 상자(36 · 좌우 14 · 모서리 8 · 누름 bg-layer-default-pressed)에 글자색만 바꾼다.
// Card 머리 동작 · 모두 펼치기 · Result Section 둘째 버튼 · List Header 오른쪽 버튼(2026-10-16 글자 역할 D2). 막힘 · 로딩은 Button 그대로
export function recolorButton(look: ButtonLook, fg: Record<Mode, string>): ButtonLook {
  const faces = {} as ButtonLook['faces'];
  for (const m of ['light', 'dark'] as const) {
    faces[m] = Object.fromEntries(Object.entries(look.faces[m]).map(([st, f]) => [st, st === 'disabled' || st === 'loading' ? f : { ...f, fg: fg[m] }])) as ButtonLook['faces'][typeof m];
  }
  return { ...look, faces };
}
