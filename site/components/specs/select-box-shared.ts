// Select Box 의 모양 — 서버(select-box-look) · 브라우저(select-box-view · 플레이그라운드)가 함께 쓰는 상수 · 타입.
// 파일 읽기(서버 전용)를 들이지 않는다.
import type { CheckLook } from './checkbox-shared';
import type { SnackbarLook } from './feedback-shared';
import type { RadioLook } from './radio-group-shared';
import type { SelIcon, SelectLook } from './select-shared';

type Mode = 'light' | 'dark';

export const SB_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type SbState = (typeof SB_STATES)[number];
export const SB_SELECTED = ['unselected', 'selected'] as const;
export type SbSelected = (typeof SB_SELECTED)[number];
export const SB_LAYOUTS = ['horizontal', 'vertical'] as const;
export type SbLayout = (typeof SB_LAYOUTS)[number];
// 밀도 — compact 는 세로형의 낮은 상자(위아래 12 · 앞 ↔ 글 4, 2026-10-29 17-1 Q5 = B)
export const SB_DENSITIES = ['default', 'compact'] as const;
export type SbDensity = (typeof SB_DENSITIES)[number];

export type SbType = { fontSize: string; lineHeight?: string; fontWeight: number | string; fontFamily: string };
export type SbMotion = { duration: string; easing: string };

// 상자 하나의 모습 — 고름 · 모드 · 상태마다(배치는 따로 — 여백 · 맞춤 · 방향만 바꾼다)
export type SbFace = {
  radius: number;
  bg: string;
  // 테두리 — 상자 안쪽에 그린다(고르면 1 → 2px 로 굵어져도 내용이 밀리지 않는다)
  border: { width: number; color: string };
  cursor: string;
  trigger: { gap: number };
  prefix: { size: number; color: string };
  body: { gap: number; padRight: number };
  label: SbType & { color: string; gap: number };
  description: SbType & { color: string };
  control: { size: number };
  footer: { padX: number; padBottom: number };
  ring: { width: number; offset: number; color: string };
  // 누름 — 누르는 자리(콘텐츠 + 컨트롤)만 준다(2px 거리)
  scale: boolean;
  motion: { bg: SbMotion; scale: SbMotion };
};

// 배치 — 1열 가로형 · 2 ~ 3열 세로형
export type SbLayoutFace = {
  pad: { top: number; right: number; bottom: number; left: number };
  alignItems: string;
  content: { gap: number; direction: 'row' | 'column' };
};

export type SbLook = {
  faces: Record<SbSelected, Record<Mode, Record<SbState, SbFace>>>;
  layouts: Record<SbLayout, SbLayoutFace>;
  // 세로형의 낮은 상자(density compact) — 가로형에는 걸리지 않는다
  compact: SbLayoutFace;
  group: { gapX: number; gapY: number };
  press: { distance: number; widthDivisor: number; minBasis: number };
  motion: {
    // 고른 테두리 — 색이 바뀐다
    border: SbMotion;
    // 펼침 — 열 때 · 닫을 때 높이 · 투명도가 엇갈린다(내용이 높이보다 먼저 사라지지 않게)
    footer: { open: { height: SbMotion; opacity: SbMotion }; close: { height: SbMotion; opacity: SbMotion }; reducedFade: string };
  };
  // 오른쪽 컨트롤 — 그 컴포넌트의 YAML 에서(Radiomark medium neutral · Checkbox Ghost medium neutral)
  marks: { radio: RadioLook; check: CheckLook };
  // 펼침 안의 입력칸 — input.yaml 에서(펼침의 내용은 쓰는 쪽이 정한다 — 예시로만)
  input: { height: number; padX: number; radius: number; fontSize: string; lineHeight?: string | number; bg: Record<Mode, string>; fg: Record<Mode, string>; border: Record<Mode, string>; focus: Record<Mode, string> };
  surface: Record<'default' | 'basement' | 'floating', Record<Mode, string>>;
  // 최대 개수에 닿았을 때 띄우는 안내 — Snackbar(snackbar.yaml) 그대로
  snackbar: SnackbarLook;
};

// 그림의 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림)
export const SB_ICONS = [
  'file-text',
  'sheet',
  'braces',
  'infinity',
  'hash',
  'calendar',
  'calendar-range',
  'calendar-days',
  'calendar-clock',
  'list',
  'divide',
  'percent',
  'coins',
  'arrow-down-left',
  'arrow-up-right',
  'arrow-left-right',
  'wallet',
  'credit-card',
  'landmark',
  'user',
  'users',
  'shield',
  'clock',
  'repeat',
  'download',
  'gift',
  'umbrella',
  'trending-up',
  'piggy-bank',
] as const;
export type SbIcon = (typeof SB_ICONS)[number];

// 앞 — 아이콘 22
export type SbPrefix = { icon: SbIcon };
// 펼침의 내용 — 입력칸(앞 · 뒤 글자) · 고르는 칸(Input Button — 날짜처럼 타이핑하지 않는 값) 또는 안내 글
// 고르는 칸은 input-button.yaml 을 푼 값(SelectLook)으로 그린다 — 여는 자리(시트 · 팝오버)는 이 그림의 몫이 아니다
export type SbFooter =
  | { before?: string; value: string; after?: string; width?: number; aria: string }
  | { button: string; aria: string; look: SelectLook; icon?: SelIcon; width?: number | string }
  | { note: string };

// 상자 하나 — state 를 주면 그 상태로 멈춘 그림
export type BoxSpec = {
  value: string;
  title: string;
  description?: string;
  prefix?: SbPrefix;
  footer?: SbFooter;
  footerVisibility?: 'when-selected' | 'when-not-selected' | 'always';
  disabled?: boolean;
  // 여럿 고르기의 처음 값(하나 고르기는 묶음의 value)
  checked?: boolean;
  state?: SbState;
  layout?: SbLayout;
};

// 묶음에 싣는 색 — 펼침의 입력칸(상자 밖에서 펼침 내용만 그릴 때도 쓴다)
export function sbGroupVars(look: SbLook, mode: 'light' | 'dark' | 'auto' = 'auto') {
  const pickL = mode === 'dark' ? 'dark' : 'light';
  const pickD = mode === 'light' ? 'light' : 'dark';
  const i = look.input;
  const u = look.faces.unselected;
  return {
    '--psb-title-l': u[pickL].enabled.label.color,
    '--psb-title-d': u[pickD].enabled.label.color,
    '--psb-desc-l': u[pickL].enabled.description.color,
    '--psb-desc-d': u[pickD].enabled.description.color,
    '--psb-in-bg-l': i.bg[pickL],
    '--psb-in-bg-d': i.bg[pickD],
    '--psb-in-fg-l': i.fg[pickL],
    '--psb-in-fg-d': i.fg[pickD],
    '--psb-in-bd-l': i.border[pickL],
    '--psb-in-bd-d': i.border[pickD],
    '--psb-in-focus-l': i.focus[pickL],
    '--psb-in-focus-d': i.focus[pickD],
  } as Record<string, string>;
}
