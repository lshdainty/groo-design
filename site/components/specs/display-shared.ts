// 표시 묶음(Badge · Notification Badge · Tag Group · Avatar · Avatar Stack · Divider)의 모양 — 서버(display-look) · 브라우저(display-view · 플레이그라운드)가
// 함께 쓰는 상수 · 타입 · 규칙 함수. 파일 읽기(서버 전용)를 들이지 않는다.

export type ViewMode = 'light' | 'dark' | 'auto';
// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type DColor = { name?: string; light: string; dark: string };
export type DType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export const dcv = (c: DColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);
export const pxOf = (v: string | number) => (typeof v === 'number' ? v : parseFloat(v));

// ── Badge ─────────────────────────────────────────────────
export const BADGE_VARIANTS = ['weak', 'solid', 'outline'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export const BADGE_TONES = ['neutral', 'brand', 'informative', 'positive', 'warning', 'critical'] as const;
export type BadgeTone = (typeof BADGE_TONES)[number];
export const BADGE_SIZES = ['medium', 'large'] as const;
export type BadgeSize = (typeof BADGE_SIZES)[number];

// 변형 × 톤 하나의 색 — 바탕(없으면 투명) · 글자 · 안쪽 1px 선(outline 만) · 굵기
export type BadgeFace = { bg: DColor | null; fg: DColor; border: { color: DColor; width: number } | null; weight: number };
// 크기 하나 — 최소 높이 · 위아래 · 좌우 · 모서리 · 앞 아이콘 · 글자(굵기는 변형이 정한다)
export type BadgeSizeLook = { minH: number; padX: number; padY: number; radius: number; icon: number; text: Omit<DType, 'fontWeight'> };
export type BadgeLook = {
  defaults: { variant: BadgeVariant; tone: BadgeTone; size: BadgeSize };
  sizes: Record<BadgeSize, BadgeSizeLook>;
  faces: Record<BadgeVariant, Record<BadgeTone, BadgeFace>>;
  // 앞 아이콘 ↔ 글 · 배지 사이(묶음)
  gap: number;
  groupGap: number;
  cursor: string;
};

// ── Notification Badge ────────────────────────────────────
export const NOTIF_SIZES = ['small', 'large'] as const;
export type NotifSize = (typeof NOTIF_SIZES)[number];
export const NOTIF_ATTACHES = ['icon', 'text'] as const;
export type NotifAttach = (typeof NOTIF_ATTACHES)[number];
export type NotifLook = {
  defaults: { size: NotifSize; attach: NotifAttach };
  // 점 — 지름 · 색 · 아이콘 상자 안쪽 위 · 오른쪽 거리
  dot: { size: number; color: DColor; top: number; right: number };
  // 숫자 알약 — 최소 폭 · 높이 · 좌우 · 면 · 숫자. 아이콘에 붙으면 왼쪽 아래 꼭짓점이 (아이콘 폭 − fromRight, bottom)
  count: { minW: number; h: number; padX: number; bg: DColor; fg: DColor; text: DType; numerals: string; fromRight: number; bottom: number };
  // 글에 붙을 때 — 글 끝에서 이만큼 뒤, 줄 상자 위 끝
  textGap: number;
};
// 숫자 표기 — 0 이하면 없음, 100 이상이면 "99+"(앱과 같은 규칙 — 레시피 formatNotificationCount)
export function formatNotificationCount(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) return null;
  return count >= 100 ? '99+' : String(Math.floor(count));
}

// ── Tag Group ─────────────────────────────────────────────
export const TAG_SIZES = ['t2', 't3', 't4'] as const;
export type TagSize = (typeof TAG_SIZES)[number];
export const TAG_TONES = ['neutralSubtle', 'neutral', 'brand'] as const;
export type TagTone = (typeof TAG_TONES)[number];
export const TAG_WEIGHTS = ['regular', 'bold'] as const;
export type TagWeight = (typeof TAG_WEIGHTS)[number];
export type TagLook = {
  defaults: { size: TagSize; tone: TagTone; weight: TagWeight };
  sizes: Record<TagSize, { text: Omit<DType, 'fontWeight'>; icon: number }>;
  tones: Record<TagTone, DColor>;
  weights: Record<TagWeight, number>;
  // 아이콘 ↔ 글
  itemGap: number;
  // 구분 — 글자(앞 공백은 줄이 안 바뀌는 공백) · 색 · 굵기, 보조 기술이 읽는 보이지 않는 글
  sep: { glyph: string; color: DColor; weight: number };
  srSep: string;
  // 말줄임일 때 줄어드는 항목의 글 칸 최소 폭(em — 첫 글자 + "…")
  labelMin: string;
  // 말줄임일 때 항목이 줄어드는 정도 기본값
  shrink: number;
};
// 항목 하나 — 글 · 톤 · 굵기 · 앞 또는 뒤 아이콘 하나 · 줄어드는 차례(말줄임일 때) · 보조 기술이 읽을 글
export type TagItem = { label: string; tone?: TagTone; weight?: TagWeight; prefixIcon?: DisplayIcon; suffixIcon?: DisplayIcon; shrink?: number; srLabel?: string };
// 보조 기술이 읽는 글 — 항목마다 읽을 글(srLabel 이 있으면 그 글) + 보이지 않는 ", "
export const tagReading = (items: TagItem[], srSep = ', ') =>
  items
    .filter((i) => i.label !== '')
    .map((i) => i.srLabel ?? i.label)
    .join(srSep);

// ── Avatar · Avatar Stack ─────────────────────────────────
export const AVATAR_SIZES = ['20', '24', '36', '42', '48', '56', '64', '80', '96', '108'] as const;
export type AvatarSize = (typeof AVATAR_SIZES)[number];
export type AvatarLook = {
  defaultSize: AvatarSize;
  sizes: Record<AvatarSize, { d: number; font: number }>;
  // 이름 색 — 차트 10색(v110 순서)
  order: string[];
  hues: Record<string, DColor>;
  initial: { fg: DColor; weight: number; lineHeight: number };
  border: { width: number; color: DColor };
};
export type StackLook = {
  defaultSize: AvatarSize;
  max: number;
  sizes: Record<AvatarSize, { overlap: number; ring: number; plusFont: number }>;
  ring: { default: DColor; floating: DColor };
  plus: { bg: DColor; fg: DColor; weight: number };
};
// 이니셜 — 표시 이름(앞뒤 공백을 뺀)의 첫 글자 하나(사용자가 보는 글자 단위), 로마자는 대문자
export function avatarInitial(name: string) {
  const n = name.trim();
  if (!n) return '';
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter;
  const first = Seg ? ([...new Seg('ko', { granularity: 'grapheme' }).segment(n)][0]?.segment ?? '') : (Array.from(n)[0] ?? '');
  return /^[a-z]$/i.test(first) ? first.toUpperCase() : first;
}
// 이름 색 — 표시 이름의 코드 포인트 합 % 10 → 차트 10색 순서. 이름이 비면 gray
export function avatarHueIndex(name: string) {
  const n = name.trim();
  if (!n) return -1;
  let sum = 0;
  for (const ch of n) sum += ch.codePointAt(0) ?? 0;
  return sum % 10;
}
export function avatarHue(name: string, order: string[]) {
  const i = avatarHueIndex(name);
  return i < 0 ? 'gray' : order[i];
}
export function codePointSum(name: string) {
  let sum = 0;
  for (const ch of name.trim()) sum += ch.codePointAt(0) ?? 0;
  return sum;
}
// 묶음에 보일 사람 — 앞 max 명, 넘치면 "+N"(99 를 넘으면 +99)
export function stackSlots<T>(people: T[], max: number) {
  if (people.length <= max) return { shown: people, more: 0 };
  return { shown: people.slice(0, max), more: Math.min(people.length - max, 99) };
}
// 폭에 맞춘 묶음(avatar-stack.yaml root.overflow — 2026-10-17 사용자 결정 03-E 결정 4 B) — 원 c 개의 폭 = 지름 + (c − 1) × (지름 − 겹침).
// 모두(전체 ≤ max)가 폭에 들면 모두, 아니면 "+N" 원까지 폭에 드는 원 수에서 하나를 뺀 사람(가장 적어도 1명 · max 까지)
export function stackWidth(circles: number, d: number, overlap: number) {
  return circles <= 0 ? 0 : d + (circles - 1) * (d - overlap);
}
export function stackFit(total: number, d: number, overlap: number, width: number, max: number) {
  const fits = width >= d ? 1 + Math.floor((width - d) / (d - overlap) + 1e-9) : 1;
  if (total <= max && total <= fits) return total;
  return Math.max(1, Math.min(max, fits - 1));
}
export type Person = { name: string; photo?: number };
// 사용자가 보는 글자 수(Tag Group 의 짧은 항목 — 두 글자 이하는 글 폭 그대로)
export function graphemeCount(text: string) {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter;
  return Seg ? [...new Seg('ko', { granularity: 'grapheme' }).segment(text)].length : Array.from(text).length;
}

// ── Divider ───────────────────────────────────────────────
export type DividerLook = { thickness: number; color: DColor; inset: number; margin: number };

// ── 그림 속 화면이 쓰는 역할 색 ───────────────────────────
export const DISPLAY_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-disabled',
  'fg-brand',
  'fg-critical',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-layer-default-pressed',
  'bg-neutral-weak',
  'stroke-neutral-subtle',
  'stroke-neutral-weak',
  'chart-orange-weak',
  'chart-orange',
  'chart-red-weak',
  'chart-red',
  'chart-violet-weak',
  'chart-violet',
  'chart-blue-weak',
  'chart-blue',
  'chart-green-weak',
  'chart-green',
  'chart-brown-weak',
  'chart-brown',
] as const;
export type DisplayTone = (typeof DISPLAY_TONES)[number];

// 그림의 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림). lucide 선 아이콘(v106)
export const DISPLAY_ICONS = [
  'pencil',
  'eye',
  'crown',
  'check',
  'clock',
  'triangle-alert',
  'lock',
  'sparkles',
  'circle-check',
  'repeat',
  'bell',
  'git-branch',
  'map-pin',
  'users',
  'star',
  'coffee',
  'tv',
  'shopping-bag',
  'bus',
  'credit-card',
  'wallet',
  'piggy-bank',
  'landmark',
  'utensils',
  'plane',
  'receipt',
  'x',
  'chevron-right',
  'chevron-left',
  'menu',
  'search',
  'house',
  'calendar',
  'settings',
  'megaphone',
  'sliders',
] as const;
export type DisplayIcon = (typeof DISPLAY_ICONS)[number];
