// 알림 메시지 넷(Snackbar · Callout · Page Banner · Result Section)의 모양 — 서버(feedback-look) · 브라우저(feedback-view · 데모 ·
// 플레이그라운드)가 함께 쓰는 상수 · 타입. 파일 읽기(서버 전용)를 들이지 않는다.
// 넷은 서로의 그림에 자주 같이 나온다(나누기 · 오류 자리 · 자리 그림) — 그래서 한 묶음으로 둔다.
import type { ButtonLook } from './button-look';
import type { TabBarLook, TopNavLook } from './nav-shared';
import type { CardFace } from './card-face';

export type ViewMode = 'light' | 'dark' | 'auto';

// 색 — name 은 사이트 모드를 따를 때 쓰는 CSS 변수(--p-<name>, HR 에서 값이 다른 브랜드 토큰은 hr-<토큰>), light · dark 는 풀어 둔 값
export type FbColor = { name?: string; light: string; dark: string };
export type FbType = { fontSize: string; lineHeight: string; fontWeight: number | string };
export type FbMotion = { duration: string; easing: string };
export type FbPress = { distance: number; widthDivisor: number; minBasis: number };

export const fcv = (c: FbColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);
export const FONT = "'Pretendard Variable', Pretendard, sans-serif";
export const ms = (v: string) => parseFloat(v);

// 눌림 축소 배율 — 기준 길이 max(높이, 폭 ÷ n, 최소) 에서 축소량만큼(Feedback 의 눌림 피드백)
export function pressRatio(press: FbPress, w: number, h: number) {
  const basis = Math.max(h, w / press.widthDivisor, press.minBasis);
  return (basis - press.distance) / basis;
}

// ── 축 ──────────────────────────────────────────────────
export const SNACK_TONES = ['neutral', 'positive', 'critical'] as const;
export type SnackTone = (typeof SNACK_TONES)[number];
// Callout · Page Banner 의 톤 다섯(magic 없음)
export const FB_TONES = ['neutral', 'informative', 'positive', 'warning', 'critical'] as const;
export type FbTone = (typeof FB_TONES)[number];
export const FB_INTERACTIONS = ['display', 'actionable', 'dismissible'] as const;
export type FbInteraction = (typeof FB_INTERACTIONS)[number];
export const BANNER_VARIANTS = ['weak', 'solid'] as const;
export type BannerVariant = (typeof BANNER_VARIANTS)[number];
export const RESULT_SIZES = ['large', 'medium'] as const;
export type ResultSize = (typeof RESULT_SIZES)[number];
export const RESULT_KINDS = ['empty', 'failure', 'done'] as const;
export type ResultKind = (typeof RESULT_KINDS)[number];

// 상태 — YAML 의 states(웹의 호버 · 키보드 포커스 포함)
export const SNACK_STATES = ['enabled', 'pressed', 'focused'] as const;
export type SnackState = (typeof SNACK_STATES)[number];
export const FB_STATES = ['enabled', 'hovered', 'pressed', 'focused'] as const;
export type FbState = (typeof FB_STATES)[number];

// ── 아이콘 — 이름으로 넘긴다(서버 그림 → 브라우저 그림). lucide 선 아이콘(Iconography v106 — 채운 원 없음) ──
export const FB_ICONS = [
  'circle-check',
  'circle-alert',
  'info',
  'triangle-alert',
  'chevron-right',
  'x',
  'receipt-text',
  'search',
  'search-x',
  'bell',
  'file-up',
  'star',
  'trash',
  'landmark',
  'sparkles',
  'funnel-x',
] as const;
export type FbIcon = (typeof FB_ICONS)[number];

// 그림 속 화면이 쓰는 역할 색(화면 틀 · 목록 · 바탕)
export const FB_SCREEN_TONES = [
  'fg-neutral',
  'fg-neutral-muted',
  'fg-neutral-subtle',
  'fg-placeholder',
  'fg-critical',
  'fg-positive',
  'fg-brand',
  'bg-layer-default',
  'bg-layer-basement',
  'bg-layer-floating',
  'bg-neutral-weak',
  'bg-brand-solid',
  'stroke-neutral-weak',
  'stroke-neutral-subtle',
  'static-white',
  'chart-orange-weak',
  'chart-orange-contrast',
  'chart-blue-weak',
  'chart-blue-contrast',
  'chart-green-weak',
  'chart-green-contrast',
  'chart-violet-weak',
  'chart-violet-contrast',
  'chart-red-weak',
  'chart-red-contrast',
] as const;
export type FbScreenTone = (typeof FB_SCREEN_TONES)[number];
// 화면 틀 — 머리는 Top Navigation, 아래 탭 바는 Bottom Navigation(top-navigation · bottom-navigation.yaml 을 nav-look 이 푼 값)
// card — 화면 속 카드(card.yaml — card-face)
export type FbScreen = Record<FbScreenTone, FbColor> & { dim: { light: string; dark: string }; nav: { top: TopNavLook; tab: TabBarLook }; card: CardFace };

// ── Snackbar ─────────────────────────────────────────────
export type SnackbarLook = {
  // 화면 키보드 위 거리 · 피할 자리가 바뀌어 옮겨 갈 때의 모션
  region: { padX: number; padBottom: number; keyboardGap: number; offset: FbMotion; zIndex: number };
  root: { maxWidth: number; minHeight: number; pad: number; radius: number; bg: FbColor; shadow: string };
  // 보이는 시간(ms) — 액션이 없을 때 · 있을 때
  duration: { plain: number; withAction: number };
  icon: { size: number; padRight: number; color: Record<'positive' | 'critical', FbColor>; glyph: Record<'positive' | 'critical', FbIcon> };
  content: { padX: number; gap: number };
  message: FbType & { color: FbColor };
  // 액션 · 닫기의 모서리는 바탕이 없어 초점 링에만 보인다
  action: FbType & { color: FbColor; targetPadX: number; targetH: number; radius: number };
  // 닫기 — 보일 때 위 · 아래 · 오른쪽 바깥 여백 margin(음수, 띠 여백 안으로 들어와 띠 높이를 그대로 둔다)
  close: { size: number; icon: number; color: FbColor; radius: number; margin: number };
  // 링 — 띠 · 닫기는 offset(안쪽), 액션은 actionOffset(바깥) — 어느 링이든 띠 위에 그린다
  ring: { width: number; offset: number; actionOffset: number; color: FbColor };
  // 나타남 · 사라짐 · 바꿈 · 액션 누름
  motion: { enter: FbMotion & { scale: number }; exit: FbMotion & { scale: number }; swap: FbMotion; press: FbMotion };
  press: FbPress;
  screen: FbScreen;
};

// ── Callout ──────────────────────────────────────────────
export type FbFace = { bg: FbColor; fg: FbColor; pressed: FbColor };
export type CalloutLook = {
  root: { minHeight: number; pad: number; gap: number; radius: number };
  icon: number;
  // 톤의 기본 앞 아이콘 — callout.yaml icon.size 비고(바꾸거나 뺄 수 있다)
  toneIcon: Record<FbTone, FbIcon>;
  suffixIcon: number;
  title: FbType;
  description: FbType;
  link: FbType & { underlineOffset: number; ringRadius: number };
  // 닫기 — 상자 · 아이콘 · 모서리 · 바깥 여백(음수로 줄 높이를 늘리지 않는다)
  close: { size: number; icon: number; radius: number; margin: number; ringRadius: number };
  ring: { width: number; offset: number; color: FbColor };
  faces: Record<FbTone, FbFace>;
  motion: { press: FbMotion; color: FbMotion };
  press: FbPress;
  screen: FbScreen;
};

// ── Page Banner ──────────────────────────────────────────
// 바탕 × 톤 하나 — 링 색도 바탕마다(옅은 바탕은 stroke-focus-ring, 짙은 바탕은 띠 글자색)
export type BannerFace = FbFace & { ring: FbColor };
export type PageBannerLook = {
  root: { minHeight: number; padX: number; padY: number; gap: number; radius: number };
  icon: { size: number; marginTop: number };
  // 톤의 기본 앞 아이콘 — page-banner.yaml icon.size 비고(Callout 과 같다)
  toneIcon: Record<FbTone, FbIcon>;
  // 본문과 버튼 — 한 줄이면 justify(양 끝), 안 들어가면 버튼이 다음 줄 본문 시작선으로(줄 사이 gap)
  content: { gap: number; justify: string };
  title: FbType;
  description: FbType;
  // 글 버튼 — 사방 pad 만큼 누르는 상자를 넓히고 바깥 여백 −pad 로 띠 높이를 늘리지 않는다(누르는 높이 targetH) · 모서리는 링에만 보인다
  button: FbType & { pad: number; targetH: number; radius: number };
  suffixIcon: number;
  close: { size: number; icon: number; radius: number; margin: number };
  ring: { width: number; offset: number };
  faces: Record<BannerVariant, Record<FbTone, BannerFace>>;
  motion: { press: FbMotion; color: FbMotion };
  press: FbPress;
  screen: FbScreen;
};

// ── Result Section ───────────────────────────────────────
export type ResultSizeLook = { title: FbType; description: FbType; descGap: number; actionsTop: number };
// 첫 · 둘째 버튼 — button.yaml 의 그 변형 · 크기(look 은 Button 그림이 그대로 쓴다)
export type ResultButton = { variant: string; size: string; height: number; look: ButtonLook };
export type ResultSectionLook = {
  // padXInCard — 카드 안에서의 좌우(0 — 카드 안 여백 24 가 가장자리를 맡는다, 2026-10-09 사용자 결정 23B)
  root: { padX: number; padY: number; padXInCard: number };
  asset: { size: number; strokeWidth: number; marginBottom: number; color: Record<ResultKind, FbColor>; glyph: Record<'failure' | 'done', FbIcon> };
  title: { color: FbColor; fontWeight: number | string };
  description: { color: FbColor; fontWeight: number | string };
  sizes: Record<ResultSize, ResultSizeLook>;
  actions: { gap: number };
  primary: ResultButton;
  // 둘째 버튼(글 버튼)은 위아래로 블리드해 글 자리만 차지한다 — 블리드는 그 버튼의 위아래 여백(SEED bleedY asPadding)
  secondary: ResultButton & { lineHeight: number; padY: number };
  motion: { enter: FbMotion };
  screen: FbScreen;
};
