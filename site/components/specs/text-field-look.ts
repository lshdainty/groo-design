// Text Field 의 모양 — specs/components/field.yaml · input.yaml · textarea.yaml 을 풀어 둔다(서버, 빌드 때).
// 그림(text-field-view)은 이 값만 받아 그린다. 색은 토큰 이름과 라이트 · 다크 값을 함께 둔다(사이트 모드를 따르는 그림은 이름으로).
import { loadComponentSpec, num, resolveState, tokenValue, type TypeValue } from '@/lib/component-spec';
import { color, design, type Brand } from '@/lib/design-tokens';
import { TF_SIZES, TF_VARIANTS, type TfColor, type TfFieldLook, type TfInputLook, type TfInputSize, type TfLook, type TfMotion, type TfTextareaLook, type TfType } from './text-field-shared';
export * from './text-field-shared';

const unbox = (raw: unknown) => (raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw);
const must = <T,>(v: T | undefined, what: string): T => {
  if (v === undefined || (typeof v === 'number' && Number.isNaN(v))) throw new Error(`Text Field YAML 에 ${what} 이 없다`);
  return v;
};
// '16px' · '0' → 수
const len = (raw: unknown, what: string) => {
  const v = tokenValue(raw);
  if (String(v) === '0') return 0;
  return must(num(v), what);
};

function tok(raw: unknown, brand: Brand, what: string): TfColor {
  const v = String(unbox(must(raw, what))).trim();
  if (v === 'transparent') return { light: 'transparent', dark: 'transparent' };
  const m = /^\$color-([a-z0-9-]+)$/.exec(v);
  if (!m) throw new Error(`Text Field YAML 의 ${what} 이 색 토큰이 아니다(${v})`);
  const name = m[1];
  const dark = design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand);
  return { name, light: color(name, brand), dark };
}

function type(raw: unknown, what: string, weight?: unknown): TfType {
  const t = tokenValue(must(raw, what)) as TypeValue | undefined;
  if (!t || typeof t !== 'object') throw new Error(`Text Field YAML 의 ${what} 글자 토큰을 풀지 못했다`);
  return { fontSize: t.fontSize, lineHeight: must(t.lineHeight, `${what} 줄 높이`), fontWeight: (unbox(weight) as number | undefined) ?? t.fontWeight ?? 400, fontFamily: t.fontFamily ?? 'inherit' };
}

// '44 × 44' → 44(가로 · 세로가 같아야 한다)
function square(raw: unknown, what: string) {
  const v = String(unbox(must(raw, what))).trim();
  const m = /^(\d+) × (\d+)$/.exec(v);
  if (!m || m[1] !== m[2]) throw new Error(`Text Field YAML 의 ${what}(${v})이 'N × N' 이 아니다`);
  return Number(m[1]);
}

type MotionEntry = { duration: unknown; easing: unknown };
function motionOf(component: string, name: string): TfMotion {
  const all = (loadComponentSpec(component) as unknown as { motion?: Record<string, MotionEntry> }).motion ?? {};
  const m = all[name];
  if (!m) throw new Error(`${component}.yaml 의 motion 에 "${name}" 이 없다`);
  return { duration: String(tokenValue(m.duration)), easing: String(tokenValue(m.easing)) };
}

function inputLook(brand: Brand): TfInputLook {
  const spec = loadComponentSpec('input');
  const sizes = {} as TfInputLook['sizes'];
  for (const variant of TF_VARIANTS) {
    sizes[variant] = {} as Record<(typeof TF_SIZES)[number], TfInputSize>;
    for (const size of TF_SIZES) {
      const v = resolveState(spec, { variant, size }, 'enabled');
      const where = `input ${variant} × ${size}`;
      sizes[variant][size] = {
        minHeight: len(v['root.minHeight'], `${where} root.minHeight`),
        radius: v['root.radius'] === undefined ? 0 : len(v['root.radius'], `${where} root.radius`),
        padX: v['root.paddingX'] === undefined ? 0 : len(v['root.paddingX'], `${where} root.paddingX`),
        padY: v['root.paddingY'] === undefined ? 0 : len(v['root.paddingY'], `${where} root.paddingY`),
        gap: len(v['root.gap'], `${where} root.gap`),
        text: type(v['value.typography'], `${where} value.typography`, v['value.fontWeight']),
        icon: len(v['prefixIcon.size'], `${where} prefixIcon.size`),
        clear: len(v['clearButton.size'], `${where} clearButton.size`),
      };
    }
  }
  const base = resolveState(spec, { variant: 'outline', size: 'large' }, 'enabled');
  const focused = resolveState(spec, { variant: 'outline', size: 'large' }, 'focused');
  const invalid = resolveState(spec, { variant: 'outline', size: 'large' }, 'invalid');
  const disabled = resolveState(spec, { variant: 'outline', size: 'large' }, 'disabled');
  const ulReadonly = resolveState(spec, { variant: 'underline', size: 'large' }, 'readonly');
  const responsive = resolveState(spec, { size: 'responsive' }, 'enabled');
  return {
    sizes,
    clearHit: square(base['clearButton.touchTarget'], 'input clearButton.touchTarget'),
    breakpoint: len(responsive['root.breakpoint'], 'input root.breakpoint'),
    stroke: { base: len(base['root.borderWidth'], 'input root.borderWidth'), active: len(focused['root.borderWidth'], 'input focused root.borderWidth') },
    color: {
      border: tok(base['root.borderColor'], brand, 'input root.borderColor'),
      focus: tok(focused['root.borderColor'], brand, 'input focused root.borderColor'),
      invalid: tok(invalid['root.borderColor'], brand, 'input invalid root.borderColor'),
      bgDisabled: tok(disabled['root.background'], brand, 'input disabled root.background'),
      value: tok(base['value.foreground'], brand, 'input value.foreground'),
      placeholder: tok(base['placeholder.foreground'], brand, 'input placeholder.foreground'),
      placeholderDisabled: tok(disabled['placeholder.foreground'], brand, 'input disabled placeholder.foreground'),
      affix: tok(base['prefixText.foreground'], brand, 'input prefixText.foreground'),
      icon: tok(base['prefixIcon.color'], brand, 'input prefixIcon.color'),
      clear: tok(base['clearButton.color'], brand, 'input clearButton.color'),
      caret: tok(base['value.caretColor'], brand, 'input value.caretColor'),
      disabled: tok(disabled['value.foreground'], brand, 'input disabled value.foreground'),
      underlineReadonly: tok(ulReadonly['value.foreground'], brand, 'input underline readonly value.foreground'),
    },
    motion: motionOf('input', '포커스 · 오류 — 테두리'),
  };
}

function textareaLook(): TfTextareaLook {
  const spec = loadComponentSpec('textarea');
  const sizes = {} as TfTextareaLook['sizes'];
  for (const size of TF_SIZES) {
    const on = resolveState(spec, { size, autoSize: 'on' }, 'enabled');
    const off = resolveState(spec, { size, autoSize: 'off' }, 'enabled');
    const where = `textarea ${size}`;
    sizes[size] = {
      radius: len(on['root.radius'], `${where} root.radius`),
      padX: len(on['value.paddingX'], `${where} value.paddingX`),
      padY: len(on['value.paddingY'], `${where} value.paddingY`),
      text: type(on['value.typography'], `${where} value.typography`, on['value.fontWeight']),
      minAuto: len(on['value.minHeight'], `${where} autoSize on value.minHeight`),
      minFixed: len(off['value.minHeight'], `${where} autoSize off value.minHeight`),
    };
  }
  const responsive = resolveState(spec, { size: 'responsive' }, 'enabled');
  // 캐럿 · 값 색은 Input 과 같은 줄을 쓴다(그림은 Input 의 색으로 그린다) — 다르면 멈춘다
  const base = resolveState(spec, { size: 'large', autoSize: 'on' }, 'enabled');
  const inputBase = resolveState(loadComponentSpec('input'), { variant: 'outline', size: 'large' }, 'enabled');
  for (const k of ['value.caretColor', 'value.foreground']) {
    if (String(unbox(base[k])) !== String(unbox(inputBase[k]))) throw new Error(`textarea.yaml ${k} 가 input.yaml 과 다르다 — 그림은 Input 의 색으로 그린다`);
  }
  return { sizes, breakpoint: len(responsive['root.breakpoint'], 'textarea root.breakpoint') };
}

function fieldLook(brand: Brand): TfFieldLook {
  const spec = loadComponentSpec('field');
  const v = resolveState(spec, {}, 'enabled');
  const inv = resolveState(spec, {}, 'invalid');
  const weight = (w: string) => Number(unbox(resolveState(spec, { labelWeight: w }, 'enabled')['label.fontWeight']));
  const rem = (raw: unknown, what: string) => String(unbox(must(raw, what)));
  return {
    gap: len(v['root.gap'], 'field root.gap'),
    header: { padX: len(v['header.paddingX'], 'field header.paddingX'), gap: len(v['header.gap'], 'field header.gap') },
    label: { text: type(v['label.typography'], 'field label.typography'), color: tok(v['label.foreground'], brand, 'field label.foreground'), weight: { medium: weight('medium'), bold: weight('bold') } },
    required: {
      size: rem(v['requiredIndicator.size'], 'field requiredIndicator.size'),
      color: tok(v['requiredIndicator.color'], brand, 'field requiredIndicator.color'),
      marginTop: rem(v['requiredIndicator.marginTop'], 'field requiredIndicator.marginTop'),
      marginLeft: rem(v['requiredIndicator.marginLeft'], 'field requiredIndicator.marginLeft'),
    },
    optional: {
      text: type(v['optionalIndicator.typography'], 'field optionalIndicator.typography'),
      lineHeight: rem(v['optionalIndicator.lineHeight'], 'field optionalIndicator.lineHeight'),
      color: tok(v['optionalIndicator.foreground'], brand, 'field optionalIndicator.foreground'),
      padLeft: rem(v['optionalIndicator.paddingLeft'], 'field optionalIndicator.paddingLeft'),
    },
    actionMarginY: len(v['headerAction.marginY'], 'field headerAction.marginY'),
    footer: { padX: len(v['footer.paddingX'], 'field footer.paddingX'), gap: len(v['footer.gap'], 'field footer.gap') },
    description: {
      text: type(v['description.typography'], 'field description.typography'),
      color: tok(v['description.foreground'], brand, 'field description.foreground'),
      icon: len(v['descriptionIcon.size'], 'field descriptionIcon.size'),
      iconColor: tok(v['descriptionIcon.color'], brand, 'field descriptionIcon.color'),
      iconGap: len(v['descriptionIcon.gap'], 'field descriptionIcon.gap'),
    },
    error: {
      text: type(v['errorMessage.typography'], 'field errorMessage.typography'),
      color: tok(v['errorMessage.foreground'], brand, 'field errorMessage.foreground'),
      icon: len(v['errorIcon.size'], 'field errorIcon.size'),
      iconColor: tok(v['errorIcon.color'], brand, 'field errorIcon.color'),
      iconGap: len(v['errorIcon.gap'], 'field errorIcon.gap'),
    },
    count: {
      text: type(v['characterCount.typography'], 'field characterCount.typography'),
      color: tok(v['characterCount.foreground'], brand, 'field characterCount.foreground'),
      // 값이 비면 최대와 같은 색(note — SEED data-empty)
      empty: tok(v['maxCharacterCount.foreground'], brand, 'field maxCharacterCount.foreground'),
      max: tok(v['maxCharacterCount.foreground'], brand, 'field maxCharacterCount.foreground'),
      invalid: tok(inv['characterCount.foreground'], brand, 'field invalid characterCount.foreground'),
    },
    form: { gapY: len(v['form.gapY'], 'field form.gapY'), gapX: len(v['form.gapX'], 'field form.gapX') },
  };
}

const cache = new Map<Brand, TfLook>();

export function textFieldLook(brand: Brand = 'desk'): TfLook {
  const hit = cache.get(brand);
  if (hit) return hit;
  const pick = (name: string): TfColor => ({ name, light: color(name, brand), dark: design(brand).front.colors[`${name}-dark`] ? color(`${name}-dark`, brand) : color(name, brand) });
  const input = inputLook(brand);
  const textarea = textareaLook();
  // global.css 의 .ptf · .ptt 는 1280 에서 medium 으로 바꾼다 — YAML 의 반응형 폭이 바뀌면 거기도 고친다
  if (input.breakpoint !== 1280 || textarea.breakpoint !== 1280) throw new Error(`input · textarea.yaml 의 반응형 폭(${input.breakpoint} · ${textarea.breakpoint})이 global.css 의 1280 과 다르다`);
  const look: TfLook = {
    input,
    textarea,
    field: fieldLook(brand),
    surface: { default: pick('bg-layer-default'), basement: pick('bg-layer-basement'), floating: pick('bg-layer-floating') },
  };
  cache.set(brand, look);
  return look;
}
