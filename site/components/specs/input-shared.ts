// 입력 묶음(Slider · Toggle · Input OTP · Color Swatch · Icon Picker)의 모양 — 서버(input-look) · 브라우저(각 view · 플레이그라운드)가
// 함께 쓰는 상수 · 타입 · 계산. 파일 읽기(서버 전용)를 들이지 않는다. 수치는 모두 input-look 이 YAML 에서 풀어 넘긴다.

export type ViewMode = 'light' | 'dark' | 'auto';
// 색 — 토큰 이름(사이트 모드를 따르는 그림은 --p-<이름>)과 풀어 둔 라이트 · 다크 값
export type IColor = { name?: string; light: string; dark: string };
export type IType = { fontSize: string; lineHeight: string; fontWeight: number | string; fontFamily: string };
export type IMotion = { duration: string; easing: string };
export type IPress = { distance: number; widthDivisor: number; minBasis: number; motion: IMotion };
export type IRing = { width: number; offset: number; color: IColor };

export const icv = (c: IColor, mode: ViewMode) => (mode === 'auto' ? (c.name ? `var(--p-${c.name})` : c.light) : mode === 'dark' ? c.dark : c.light);
export const FONT = "'Pretendard Variable', Pretendard, sans-serif";
export const ms = (v: string) => parseFloat(v);
export const typeStyle = (t: IType) => ({ fontFamily: t.fontFamily, fontSize: t.fontSize, lineHeight: t.lineHeight, fontWeight: t.fontWeight });

// 눌림 축소 배율 — 기준 길이 max(높이, 폭 ÷ n, 최소)에서 축소량만큼(Feedback 의 눌림 피드백)
export function pressRatio(p: Pick<IPress, 'distance' | 'widthDivisor' | 'minBasis'>, w: number, h: number) {
  const basis = Math.max(h, w / p.widthDivisor, p.minBasis);
  return (basis - p.distance) / basis;
}

// ── Slider ────────────────────────────────────────────────
export const SLIDER_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type SliderState = (typeof SLIDER_STATES)[number];
export const SLIDER_MODES = ['single', 'range'] as const;
export type SliderMode = (typeof SLIDER_MODES)[number];

export type SliderLook = {
  // 손잡이 줄 — 높이 전체가 누르는 자리 · 손잡이 줄 ↔ 표식
  // dragStart — 손잡이 밖을 누르면 이만큼(ms) 누르고 있거나 이만큼(px) 움직여야 끌기가 된다(그전에는 건너뛰기만 — SEED dragStartDelay)
  control: { height: number; touchAction: string; dragStart: { delay: number; distance: number } };
  gap: number;
  // 위 여백 — 말풍선 자리(Field 머리 ↔ 손잡이 줄 = Field 간격 + 이 값)
  padTop: number;
  track: { height: number; bg: IColor; disabledBg: IColor };
  fill: { bg: IColor; disabledBg: IColor };
  // 눈금 — 구간이 tickMin ~ tickMax 개일 때만, 트랙 · 채움을 끊는 틈(놓인 표면 색)
  tick: { width: number; bg: IColor; floatingBg: IColor; min: number; max: number };
  thumb: { size: number; pressedSize: number; bg: IColor; disabledBg: IColor; inset: number };
  indicator: { bg: IColor; fg: IColor; text: IType; padX: number; padY: number; radius: number; minWidth: number; offsetY: number; arrowW: number; arrowH: number };
  markers: { text: IType; fg: IColor; disabledFg: IColor };
  header: { text: IType; fg: IColor; disabledFg: IColor };
  ring: IRing;
  // 키보드 — PageUp · PageDown · Shift + 화살표가 옮기는 단계 수
  pageSteps: number;
  // 말풍선 — 나타날 때 enterScale · enterOpacity · 아래 enterY 에서 제자리로, 사라질 때 exitOpacity · 아래 exitY 로(확대는 그대로)
  motion: { jump: IMotion; press: IMotion; enter: IMotion; exit: IMotion; enterScale: number; enterOpacity: number; enterY: number; exitOpacity: number; exitY: number };
  // 놓인 표면 — 흰 표면(카드 · 화면) · 시트 · 팝오버
  surface: { default: IColor; floating: IColor };
};

// 키운 그림(Anatomy) — 치수 · 글자를 k 배로
const scaleType = (t: IType, k: number): IType => ({ ...t, fontSize: `${parseFloat(t.fontSize) * k}px`, lineHeight: `${parseFloat(t.lineHeight) * k}px` });
export function sliderLookZoom(l: SliderLook, k: number): SliderLook {
  return {
    ...l,
    control: { ...l.control, height: l.control.height * k },
    gap: l.gap * k,
    padTop: l.padTop * k,
    track: { ...l.track, height: l.track.height * k },
    tick: { ...l.tick, width: l.tick.width * k },
    thumb: { ...l.thumb, size: l.thumb.size * k, pressedSize: l.thumb.pressedSize * k, inset: l.thumb.inset * k },
    indicator: { ...l.indicator, text: scaleType(l.indicator.text, k), padX: l.indicator.padX * k, padY: l.indicator.padY * k, radius: l.indicator.radius * k, minWidth: l.indicator.minWidth * k, offsetY: l.indicator.offsetY * k, arrowW: l.indicator.arrowW * k, arrowH: l.indicator.arrowH * k },
    markers: { ...l.markers, text: scaleType(l.markers.text, k) },
    header: { ...l.header, text: scaleType(l.header.text, k) },
    ring: { ...l.ring, width: l.ring.width * k, offset: l.ring.offset * k },
  };
}

// 구간 수 — (최대 − 최소) ÷ 단계
export const segmentsOf = (min: number, max: number, step: number) => Math.round((max - min) / step);
export const isDiscrete = (look: SliderLook, min: number, max: number, step: number) => {
  const n = segmentsOf(min, max, step);
  return n >= look.tick.min && n <= look.tick.max;
};
// 값 → 손잡이 가운데 x(트랙 폭 w, 양 끝에서 inset 들어온 범위)
export const thumbX = (look: SliderLook, w: number, min: number, max: number, v: number) => look.thumb.inset + ((w - look.thumb.inset * 2) * (v - min)) / (max - min || 1);
export const snapTo = (min: number, max: number, step: number, v: number) => Math.min(max, Math.max(min, min + Math.round((v - min) / step) * step));

// 값 하나 · 둘
export type SliderValue = number | [number, number];
// 그림 · 미리보기의 슬라이더 — slider.md 의 예(예산 알림 임계값 · 만족도 · 예산 사용률)
export type SliderPreset = { key: string; label: string; min: number; max: number; step: number; unit: string; value: SliderValue; description?: string; error?: string };
export const PRESETS: Record<'threshold' | 'score' | 'usage' | 'scoreRange', SliderPreset> = {
  threshold: { key: 'threshold', label: '예산 알림 임계값', min: 50, max: 100, step: 5, unit: '%', value: 80, description: '예산 사용률이 이 값을 넘으면 알려줘요.', error: '저장하지 못했어요. 값을 되돌렸어요 — 다시 해주세요.' },
  score: { key: 'score', label: '만족도', min: 1, max: 5, step: 1, unit: '점', value: 4 },
  usage: { key: 'usage', label: '예산 사용률', min: 0, max: 100, step: 10, unit: '%', value: [30, 70] },
  scoreRange: { key: 'scoreRange', label: '만족도', min: 1, max: 5, step: 1, unit: '점', value: [2, 4] },
};
export const headText = (v: SliderValue, unit: string) => (Array.isArray(v) ? `${v[0]}${unit} ~ ${v[1]}${unit}` : `${v}${unit}`);

// ── Toggle ────────────────────────────────────────────────
export const TOGGLE_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type ToggleState = (typeof TOGGLE_STATES)[number];
export type ToggleTone = 'default' | 'inverted';
export type ToggleLook = {
  size: number;
  touch: number;
  radius: number;
  icon: number;
  stroke: { off: number; on: number };
  fg: { off: IColor; on: IColor; disabled: IColor; inverted: IColor };
  hoverBg: IColor;
  pressBg: IColor;
  ring: IRing;
  // 브랜드 채움 위(tone inverted)의 포커스 링 색 — 기본 링(stroke-focus-ring)은 채움에 묻힌다
  ringInverted: IColor;
  press: IPress;
  colorMotion: IMotion;
};

// 아이콘 이름(toggle-view 가 lucide 로 그린다) — 사선(-off) 짝은 기능 단추와 나쁜 예(모으기 단추의 사선)에만
export const TOGGLE_ICONS = ['star', 'star-off', 'pin', 'pin-off', 'eye', 'eye-off', 'bell', 'bell-off', 'heart'] as const;
export type ToggleIcon = (typeof TOGGLE_ICONS)[number];
// 단추 넷 — 이름(고정) · 끔 · 켬 아이콘 · 코드의 상태 이름(toggle.md 의 표)
// 금액 가리기 눈은 Toggle 이 아니다 — 설정으로 가는 버튼(2026-10-16 Q-017-2b A · 3c B, toggle.md)이라 단추 목록에 두지 않는다
export type ToggleKind = 'watch' | 'pin' | 'key';
export const TOGGLES: Record<ToggleKind, { label: string; icon: ToggleIcon; pressedIcon?: ToggleIcon; jsx: [string, string?]; state: [string, string]; memo?: boolean }> = {
  watch: { label: '관심 등록', icon: 'star', jsx: ['Star'], state: ['watched', 'setWatched'] },
  pin: { label: '장보기 목록 고정', icon: 'pin', jsx: ['Pin'], state: ['pinned', 'setPinned'], memo: true },
  key: { label: 'App Key 보기', icon: 'eye-off', pressedIcon: 'eye', jsx: ['EyeOff', 'Eye'], state: ['shown', 'setShown'] },
};
// 화면 읽기 프로그램이 읽는 말 — "관심 등록, 토글 버튼, 눌림"
export const toggleReadout = (label: string, pressed: boolean, disabled = false) => `${label}, 토글 버튼, ${pressed ? '눌림' : '안 눌림'}${disabled ? ', 사용 불가' : ''}`;

// ── Input OTP ─────────────────────────────────────────────
export type OtpResend = 'first' | 'ready' | 'cooldown';
export type OtpLook = {
  length: number;
  cooldown: number;
  placeholder: string;
  description: string;
  error: string;
  // "다시 받기({n}초)" — {n} 자리에 남은 초
  labels: Record<OtpResend, string>;
  resend: { marginTop: number; height: number; variant: string; size: string };
  sizes: Record<'large' | 'medium', { height: number; radius: number; padX: number }>;
  breakpoint: number;
};
// 숫자만 뽑아 앞 n 자리 — 치기 · 붙여넣기 · 자동 채우기 모두
export const otpDigits = (raw: string, n: number) => raw.replace(/\D+/g, '').slice(0, n);
export const resendLabel = (look: OtpLook, kind: OtpResend, left = 0) => look.labels[kind].replace('{n}', String(left));
// 보낸 때 → 다시 받기의 때와 남은 초
export function resendState(look: OtpLook, sentAt: number | null, now: number): { kind: OtpResend; left: number } {
  if (sentAt === null) return { kind: 'first', left: 0 };
  const left = Math.ceil((sentAt + look.cooldown * 1000 - now) / 1000);
  return left > 0 ? { kind: 'cooldown', left: Math.min(left, look.cooldown) } : { kind: 'ready', left: 0 };
}

// ── Color Swatch ──────────────────────────────────────────
export const SWATCH_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'] as const;
export type SwatchState = (typeof SWATCH_STATES)[number];
export type SwatchColor = { key: string; name: string; color: IColor };
export type SwatchLook = {
  columns: number;
  gap: number;
  width: number;
  size: number;
  touch: number;
  // 색상환 차례 — 빨강 → … → 회색
  colors: SwatchColor[];
  // v110 배정 순서(새 항목의 첫 색) — 회색은 빠진다
  assign: string[];
  check: { size: number; stroke: number; color: IColor };
  ring: { width: number; offset: number; color: IColor; disabledColor: IColor };
  focus: IRing;
  currentLabel: { text: IType; fg: IColor; gap: number };
  // stackBelow — 놓인 자리가 이보다 좁으면 지금 색 칸을 격자 위 줄에 두고 선을 가로로(사이는 그대로 gap)
  divider: { width: number; color: IColor; gap: number; stackBelow: number };
  auto: { borderWidth: number; borderColor: IColor };
  // 팔레트 밖 지금 색 — 그 색 위 대비가 큰 체크 색(모드마다)
  custom: { hex: string; check: IColor; contrast: { light: number; dark: number } };
  press: IPress;
  labelDisabled: IColor;
  names: { current: string; auto: string };
  // 칸 툴팁 — 마우스를 올리면(키보드 초점에도 — porest Tooltip) 칸 이름(색 이름)
  tooltip: boolean;
};
export const firstUnused = (look: SwatchLook, used: string[]) => look.assign.find((c) => !used.includes(c)) ?? look.assign[0];
// 지금 색 칸의 값(색 이름 대신)
export const CURRENT = 'current';
export type SwatchCurrent = { kind: 'custom'; hex: string } | { kind: 'auto'; color: string };

// ── Icon Picker ───────────────────────────────────────────
export type CategoryIcon = { id: string; group: string; name: string; aliases: string[]; lucideAliases?: string[] };
export type CategoryIconSet = { default: string; groups: string[]; entries: CategoryIcon[] };
export const IP_STATES = ['enabled', 'hovered', 'focused', 'pressed'] as const;
export type IpState = (typeof IP_STATES)[number];
export type IconPickerLook = {
  cell: { size: number; radius: number; hoverBg: IColor; pressBg: IColor };
  icon: { size: number; stroke: number; selectedStroke: number; color: IColor };
  selected: { borderWidth: number; borderColor: IColor };
  // 칸 사이 최소 · 줄 사이 · 찾는 동안(묶음 머리 없음) 찾기 칸 ↔ 격자
  grid: { minGap: number; rowGap: number; searchGap: number };
  // 여는 자리마다 본문 좌우 여백 · 열 수(시트 6 · 팝오버 7 — 들어가는 만큼이되 이보다 많지 않다) · 스크롤 상자의 끝 흐림(scroll.scrollFog)
  surfaces: Record<'sheet' | 'popover', { padX: number; columns: number; fog: boolean }>;
  header: { text: IType; fg: IColor; padTop: number; padBottom: number };
  ring: IRing;
  popoverWidth: number;
  // 찾기 칸 — 시트 large · 팝오버 medium(밑줄형 높이)
  search: { placeholder: string; ariaLabel: string; sheetH: number; popoverH: number };
  empty: { title: string; description: string };
  title: string;
  press: IPress;
  colorMotion: IMotion;
  // 트리거 — 라벨 · 아이콘 없는 항목 · 세트 밖
  trigger: { label: string; none: string; outside: string };
  breakpoint: number;
};

// 찾기 — 소문자 · 공백 없앰 · 부분 일치(이름 · 찾는 말 · id), 세트 차례 그대로
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
export function searchIcons(set: CategoryIconSet, query: string) {
  const q = norm(query);
  if (!q) return set.entries;
  return set.entries.filter((e) => [e.name, ...e.aliases, e.id].some((t) => norm(t).includes(q)));
}
// 저장 값 → 세트의 아이콘(id 또는 옛 이름) · 없으면 null
export const findIcon = (set: CategoryIconSet, id: string | null | undefined) => (id ? (set.entries.find((e) => e.id === id || e.lucideAliases?.includes(id)) ?? null) : null);
// 트리거의 값 — 세트 안이면 그 이름, 비었으면 태그 · "태그", 세트 밖이면 그 아이콘 · "지금 아이콘"
export function triggerValue(look: IconPickerLook, set: CategoryIconSet, value: string | null | undefined) {
  if (!value) return { id: set.default, text: look.trigger.none };
  const hit = findIcon(set, value);
  return hit ? { id: hit.id, text: hit.name } : { id: value, text: look.trigger.outside };
}
// 칸 48 · 사이 최소 — 놓인 폭에 들어가는 열 수와 칸 사이(남는 폭을 고르게)
export function gridColumns(look: IconPickerLook, width: number, max?: number) {
  const s = look.cell.size;
  const fit = Math.max(1, Math.floor((width + look.grid.minGap) / (s + look.grid.minGap)));
  // 여는 자리의 열(시트 6 · 팝오버 7)보다 많이 두지 않는다 — 좁으면(320 폰) 들어가는 만큼, 넓어도(태블릿 시트) 그 열
  const cols = max ? Math.min(max, fit) : fit;
  const gap = cols > 1 ? (width - cols * s) / (cols - 1) : 0;
  return { cols, gap };
}
// 결과 수 알림 — 글과 늦춤은 icon-picker.yaml count 의 비고에만 있다(비고는 읽지 않는다 — 값 줄이 생기면 그때 읽는다).
// 치기를 멈추고 delay 뒤 한 번 읽는다(글자마다 읽지 않게). 0건은 Result Section 이 알린다
export const IP_COUNT = { text: '검색 결과 {n}개', delay: 500 };
// 격자의 보이는 줄 — 묶음마다 cols 개씩(찾는 동안은 묶음 없이 한 덩어리)
export type GridRow = { group?: string; ids: string[] };
export function gridRows(entries: CategoryIcon[], cols: number, grouped: boolean, groups: string[]): GridRow[] {
  const rows: GridRow[] = [];
  const push = (list: CategoryIcon[], group?: string) => {
    for (let i = 0; i < list.length; i += cols) rows.push({ group: i === 0 ? group : undefined, ids: list.slice(i, i + cols).map((e) => e.id) });
  };
  if (!grouped) push(entries);
  else for (const g of groups) push(entries.filter((e) => e.group === g), g);
  return rows;
}
