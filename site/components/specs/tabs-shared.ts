// Tabs 의 모양 — 서버(tabs-look) · 브라우저(tabs-view · 플레이그라운드 · 미리보기)가 함께 쓰는 상수 · 타입.
// 파일 읽기(서버 전용)를 들이지 않는다.
import type { ChipLook, ChipSize, ChipVariant } from './chip-shared';

export const TABS_LAYOUTS = ['fill', 'hug'] as const;
export type TabsLayout = (typeof TABS_LAYOUTS)[number];
export const TABS_SIZES = ['small', 'medium'] as const;
export type TabsSize = (typeof TABS_SIZES)[number];
export const TABS_SELECTED = ['unselected', 'selected'] as const;
export type TabsSelected = (typeof TABS_SELECTED)[number];
// tabs.yaml 의 states — 호버 모양은 없다(SEED), 포커스는 키보드에만 링
export const TABS_STATES = ['enabled', 'pressed', 'focused', 'disabled'] as const;
export type TabsState = (typeof TABS_STATES)[number];

// chip-tabs.yaml 의 축 — 칩 하나는 chip.yaml 그대로(변형 · 크기를 Chip 의 이름으로 옮긴다)
export const CHIP_TABS_VARIANTS = ['solid', 'outline'] as const;
export type ChipTabsVariant = (typeof CHIP_TABS_VARIANTS)[number];
export const CHIP_TABS_SIZES = ['medium', 'large'] as const;
export type ChipTabsSize = (typeof CHIP_TABS_SIZES)[number];

export type ViewMode = 'light' | 'dark' | 'auto';

// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type TabsColor = { name?: string; light: string; dark: string };
export type TabsType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type TabsMotion = { duration: string; easing: string };

export const tcv = (c: TabsColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);

// 고름 × 상태 하나의 모습 — 글자색 · 커서 · 누름 축소 여부 · 링
export type TabsFace = { fg: TabsColor; cursor: string; scale: boolean; ring: boolean };

export type TabsLook = {
  defaults: { layout: TabsLayout; size: TabsSize };
  // 목록 — 불투명 바탕 + 바닥 안쪽 구획 선
  list: { bg: TabsColor; line: TabsColor; lineWidth: number };
  // 탭 — 위아래 · 좌우 여백, 글을 아래로 붙인다
  trigger: { padX: number; padY: number; align: string };
  sizes: Record<TabsSize, { h: number; text: TabsType }>;
  faces: Record<TabsSelected, Record<TabsState, TabsFace>>;
  // 막대 — 고른 탭의 상태마다 색(고른 탭이 막히면 fg-disabled)
  indicator: { h: number; colors: Record<TabsState, TabsColor>; radius: number; props: string[]; motion: TabsMotion };
  layouts: Record<TabsLayout, { padX: number; grow: number; inset: number; overflowX: 'visible' | 'auto'; scrollPadding: number }>;
  notification: { size: number; radius: number; color: TabsColor; gap: number };
  ring: { width: number; offset: number; color: TabsColor };
  press: { distance: number; widthDivisor: number; minBasis: number; motion: TabsMotion };
  // 화면 여백(spacing-global-gutter) — 그림 속 화면의 내용 좌우
  gutter: number;
  // 그림 속 화면이 쓰는 역할 색(브라우저 그림은 kit 을 들일 수 없다 — 서버에서 풀어 넘긴다)
  tone: Record<TabsTone, TabsColor>;
};

export type ChipTabsLook = {
  defaults: { variant: ChipTabsVariant; size: ChipTabsSize };
  // 목록 — 한 줄 가로 스크롤. 좌우 화면 여백 · 위아래 · 칩 사이 · 스크롤 여유
  padX: number;
  padY: number;
  gap: number;
  overflowX: 'auto';
  scrollPadding: number;
  // 양 끝 흐림 — Scroll Fog row 의 깊이(늘 켜짐) · gradient-fade-mask
  fog: number;
  mask: string;
  shrink: number;
  variants: Record<ChipTabsVariant, ChipVariant>;
  sizes: Record<ChipTabsSize, ChipSize>;
  // 알림 점 — 글 뒤(칩 안이라 오른쪽 위가 아니다). 고른 칩에는 그리지 않는다
  notification: { size: number; radius: number; color: TabsColor; gap: number };
  chip: ChipLook;
};

export const TABS_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-placeholder',
  'fg-brand',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-neutral-weak',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
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
  'chart-brown-weak',
  'chart-brown-contrast',
  'chart-red-weak',
  'chart-red-contrast',
  'chart-orange',
  'chart-blue',
  'chart-green',
  'chart-violet',
] as const;
export type TabsTone = (typeof TABS_TONES)[number];

// 탭 하나 — 값 · 글 · 막힘 · 알림 점
export type TabItem = { value: string; label: string; disabled?: boolean; notification?: boolean };

// 눌림 축소 배율 — 기준 길이 max(높이, 폭 ÷ n, 최소) 에서 축소량만큼(탭 전체 — SEED scaleScope self)
export function pressRatio(press: TabsLook['press'], w: number, h: number) {
  const basis = Math.max(h, w / press.widthDivisor, press.minBasis);
  return (basis - press.distance) / basis;
}

export const faceOf = (look: TabsLook, selected: boolean, state: TabsState) => look.faces[selected ? 'selected' : 'unselected'][state];

// 화살표 · Home · End 로 옮길 다음 칸 — 막힌 칸은 건너뛰고 끝에서 처음으로 돈다(Tabs · Segmented 같은 규칙)
export function nextEnabled(items: { disabled?: boolean }[], from: number, key: string, blocked = false): number | undefined {
  const n = items.length;
  const on = (i: number) => !blocked && !items[i]?.disabled;
  if (key === 'Home' || key === 'End') {
    const order = key === 'Home' ? [...Array(n).keys()] : [...Array(n).keys()].reverse();
    return order.find(on);
  }
  const dir = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
  if (!dir) return undefined;
  for (let k = 1; k <= n; k++) {
    const i = (from + dir * k + n * k) % n;
    if (on(i)) return i;
  }
  return undefined;
}
