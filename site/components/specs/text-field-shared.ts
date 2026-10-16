// Text Field(Field · Input · Textarea)의 모양 — 서버(text-field-look) · 브라우저(text-field-view · 플레이그라운드)가 함께 쓰는 상수 · 타입.
// 파일 읽기(서버 전용)를 들이지 않는다.

export const TF_VARIANTS = ['outline', 'underline'] as const;
export type TfVariant = (typeof TF_VARIANTS)[number];
export const TF_SIZES = ['large', 'medium'] as const;
export type TfSize = (typeof TF_SIZES)[number];
export type TfSizeProp = TfSize | 'responsive';
export const TF_STATES = ['enabled', 'focused', 'invalid', 'disabled', 'readonly'] as const;
export type TfState = (typeof TF_STATES)[number];

// 색 — 토큰 이름(사이트 라이트 · 다크를 따를 때 --p-<이름>)과 풀어 둔 라이트 · 다크 값
export type TfColor = { name?: string; light: string; dark: string };
export type TfType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type TfMotion = { duration: string; easing: string };

// 입력칸 한 크기의 모습(모양 × 크기)
export type TfInputSize = {
  minHeight: number;
  radius: number;
  padX: number;
  padY: number;
  gap: number;
  text: TfType;
  icon: number;
  clear: number;
};

export type TfInputLook = {
  sizes: Record<TfVariant, Record<TfSize, TfInputSize>>;
  // 지우기 버튼의 누르는 영역(가로 = 세로) — 보이는 원 둘레로, 상자 밖은 상자가 자른다
  clearHit: number;
  // 반응형 — 이 폭 미만은 large, 이상은 medium
  breakpoint: number;
  stroke: { base: number; active: number };
  color: {
    border: TfColor;
    focus: TfColor;
    invalid: TfColor;
    bgDisabled: TfColor;
    value: TfColor;
    placeholder: TfColor;
    // 막힌 칸의 placeholder(input.yaml disabled › placeholder — Input OTP 는 fg-placeholder 그대로)
    placeholderDisabled: TfColor;
    affix: TfColor;
    icon: TfColor;
    clear: TfColor;
    // 캐럿 — 글자색(고른 글은 기기 기본)
    caret: TfColor;
    disabled: TfColor;
    // 밑줄형 읽기 전용의 값 · placeholder
    underlineReadonly: TfColor;
  };
  motion: TfMotion;
};

export type TfTextareaSize = { radius: number; padX: number; padY: number; text: TfType; minAuto: number; minFixed: number };
export type TfTextareaLook = { sizes: Record<TfSize, TfTextareaSize>; breakpoint: number };

export type TfFieldLook = {
  gap: number;
  header: { padX: number; gap: number };
  label: { text: TfType; color: TfColor; weight: Record<'medium' | 'bold', number> };
  required: { size: string; color: TfColor; marginTop: string; marginLeft: string };
  optional: { text: TfType; lineHeight: string; color: TfColor; padLeft: string };
  actionMarginY: number;
  footer: { padX: number; gap: number };
  description: { text: TfType; color: TfColor; icon: number; iconColor: TfColor; iconGap: number };
  error: { text: TfType; color: TfColor; icon: number; iconColor: TfColor; iconGap: number };
  count: { text: TfType; color: TfColor; empty: TfColor; max: TfColor; invalid: TfColor };
  form: { gapY: number; gapX: number };
};

export type TfLook = {
  input: TfInputLook;
  textarea: TfTextareaLook;
  field: TfFieldLook;
  surface: Record<'default' | 'basement' | 'floating', TfColor>;
};

// 그림의 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림)
export const TF_ICONS = ['search', 'calendar', 'user', 'mail', 'lock', 'link', 'hash', 'tag', 'info', 'smartphone'] as const;
export type TfIcon = (typeof TF_ICONS)[number];
