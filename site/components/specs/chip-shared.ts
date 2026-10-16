// Chip 의 모양 — 서버(chip-look) · 브라우저(chip-view · 플레이그라운드)가 함께 쓰는 상수 · 타입.
// 파일 읽기(서버 전용)를 들이지 않는다.

export const CHIP_VARIANTS = ['solid', 'outlineStrong', 'outlineWeak'] as const;
export type ChipVariant = (typeof CHIP_VARIANTS)[number];
export const CHIP_SIZES = ['small', 'medium', 'large'] as const;
export type ChipSize = (typeof CHIP_SIZES)[number];
export const CHIP_SELECTED = ['unselected', 'selected'] as const;
export type ChipSelected = (typeof CHIP_SELECTED)[number];
// chip.yaml 의 states — 호버는 웹만, 포커스는 키보드에만 링
export const CHIP_STATES = ['enabled', 'hovered', 'pressed', 'focused', 'disabled'] as const;
export type ChipState = (typeof CHIP_STATES)[number];

export type ViewMode = 'light' | 'dark' | 'auto';

// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type ChipColor = { name?: string; light: string; dark: string };
export type ChipType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type ChipMotion = { duration: string; easing: string };

export const ccv = (c: ChipColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);

// 변형 × 고름 × 상태 하나의 색 — 테두리는 안쪽(inset)에 그린다. 없으면 null
export type ChipFace = {
  bg: ChipColor;
  fg: ChipColor;
  border: { color: ChipColor; width: number } | null;
  cursor: string;
};

// 크기 하나 — 글이 있는 칩(높이 · 좌우 · 최소 폭)과 아이콘만 있는 칩(원 — 폭 = 높이)
export type ChipSizeLook = {
  h: number;
  padX: number;
  minW: number;
  iconOnlyW: number;
  prefixIcon: number;
  suffixIcon: number;
  removeIcon: number;
  icon: number;
};

export type ChipLook = {
  defaults: { variant: ChipVariant; size: ChipSize };
  sizes: Record<ChipSize, ChipSizeLook>;
  radius: number;
  // 칩의 최대 폭 — 놓인 줄의 폭('100%'). 넘으면 글 끝을 말줄임(…)하고 아이콘 · 지우기는 남는다(2026-10-17 사용자 결정 — 03-E 결정 2 A)
  maxWidth: string;
  // 아이콘 ↔ 글
  gap: number;
  text: ChipType;
  faces: Record<ChipVariant, Record<ChipSelected, Record<ChipState, ChipFace>>>;
  ring: { width: number; offset: number; color: ChipColor };
  // 누르는 영역 — 가로 · 세로로 이만큼 넓힌다(보이는 칩은 그대로 — 글이 있는 칩은 최소 폭이 이미 넘는다)
  touch: { w: number; h: number };
  // 입력값 칩 지우기의 누르는 영역(정사각) · 누르면 지우기만 따로 주는 배율(칩은 누름이 아니다)
  removeTarget: number;
  removeScale: number;
  // 묶음 — 칩 사이 · 줄 사이 · 비었을 때 높이 · 키보드 포커스 링(모서리 없이 묶음 둘레)
  group: { gap: number; rowGap: number; minHeight: number; ring: { width: number; offset: number; color: ChipColor } };
  // 가로 스크롤 줄(목록 위 필터 바 · 제안 줄) — 두 겹: 바깥 묶음 · 안쪽 스크롤 칸.
  // 안쪽 좌우 padX(화면 여백) · 위아래 padY(누르는 영역 · 링이 잘리지 않게) · 바깥 marginY(줄 높이는 칩 그대로) · 스크롤 멈춤 자리 scrollPadding
  // 가로 스크롤 줄 — fog 는 양 끝 흐림 깊이(Scroll Fog row — 늘 켜짐), mask 는 gradient-fade-mask
  scrollRow: { padX: number; padY: number; marginY: number; scrollPadding: number; overflowX: string; fog: number; mask: string };
  motion: { color: ChipMotion; scale: ChipMotion };
  press: { distance: number; widthDivisor: number; minBasis: number };
  // 그림 속 화면이 쓰는 역할 색(스크롤 끝 흐림은 아직 스펙이 없다 — 토큰으로 간단히). 시트 · 팝오버는 overlay-look
  tone: Record<ChipTone, ChipColor>;
};

export const CHIP_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-placeholder',
  'fg-critical',
  'fg-neutral-inverted',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-neutral-weak',
  'bg-neutral-inverted',
  'bg-critical-weak',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-critical-solid',
  // 세로 스크롤바 막대(scroll-area.yaml thumbColor — .psa 의 --psa-thumb)
  'stroke-neutral-solid',
  'chart-orange-weak',
  'chart-orange-contrast',
  'chart-blue-weak',
  'chart-blue-contrast',
  'chart-green-weak',
  'chart-green-contrast',
  'chart-violet-weak',
  'chart-violet-contrast',
] as const;
export type ChipTone = (typeof CHIP_TONES)[number];

// 그림의 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림). lucide 선 아이콘(v106)
export const CHIP_ICONS = [
  'chevron-down',
  'x',
  'rotate-ccw',
  'calendar',
  'tag',
  'credit-card',
  'utensils',
  'coffee',
  'bus',
  'shopping-bag',
  'film',
  'stethoscope',
  'arrow-up-right',
  'arrow-down-left',
  'arrow-left-right',
  'banknote',
  'user',
  'bell',
  'search',
] as const;
export type ChipIcon = (typeof CHIP_ICONS)[number];

// 부위 — Anatomy 의 칠 · 핀, 누르는 영역(target)
export type ChipPart = 'root' | 'prefix' | 'label' | 'suffix' | 'remove' | 'icon' | 'target';

// 여럿 고른 값을 한 칩에 — "첫 값 외 N개"(외 = 앞의 값을 뺀 개수)
export const summarize = (labels: string[]) => (labels.length <= 1 ? (labels[0] ?? '') : `${labels[0]} 외 ${labels.length - 1}개`);

// 눌림 축소 배율 — 기준 길이 max(높이, 폭 ÷ n, 최소) 에서 축소량만큼(칩 전체 — SEED scaleScope self)
export function pressRatio(press: ChipLook['press'], w: number, h: number) {
  const basis = Math.max(h, w / press.widthDivisor, press.minBasis);
  return (basis - press.distance) / basis;
}

// 칩 하나의 색 — 변형 · 고름 · 상태
export const faceOf = (look: ChipLook, variant: ChipVariant, selected: boolean, state: ChipState) => look.faces[variant][selected ? 'selected' : 'unselected'][state];
