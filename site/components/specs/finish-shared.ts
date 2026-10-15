// 마무리 묶음(Quantity Picker · Attachment Input · Footer · Avatar 사진 바꾸기)의 모양 — 서버(finish-look) · 브라우저(finish-view · finish-play)가
// 함께 쓰는 상수 · 타입 · 계산. 파일 읽기(서버 전용)를 들이지 않는다. 수치는 모두 finish-look 이 YAML 에서 풀어 넘긴다.
import type { ButtonLook } from './button-look';
import type { IColor, IMotion, IPress, IRing, IType, ViewMode } from './input-shared';
import type { ProgressCircleLook } from './loading-shared';
import type { ScrollFogLook } from './loading-shared';
export { FONT, icv, pressRatio, typeStyle } from './input-shared';
export type { IColor, IMotion, IPress, IRing, IType, ViewMode };

// ── Quantity Picker ───────────────────────────────────────
export const QP_SIZES = ['small', 'medium', 'large'] as const;
export type QpSize = (typeof QP_SIZES)[number];
export type QpSizeProp = QpSize | 'responsive';
export const QP_STATES = ['enabled', 'hovered', 'focused', 'pressed', 'loading', 'invalid', 'disabled'] as const;
export type QpState = (typeof QP_STATES)[number];
// 버튼 하나에만 걸리는 상태(멈춘 그림)
export type QpButtonState = 'hovered' | 'pressed' | 'focused' | 'loading';
export type QpSizeLook = {
  // 상자 높이 = 버튼 한 변
  h: number;
  radius: number;
  icon: number;
  text: IType;
  // 누르는 자리 한 변 · 보이는 상자 둘레로 더하는 보이지 않는 여백
  touch: number;
  extend: number;
  progress: number;
};
export type QpLook = {
  sizes: Record<QpSize, QpSizeLook>;
  // responsive — 이 폭 미만 large · 이상 medium
  breakpoint: number;
  responsive: { below: QpSize; above: QpSize };
  defaults: { size: QpSizeProp; layout: 'hug' | 'fill' };
  root: { bg: IColor; borderW: number; border: IColor; invalidW: number; invalid: IColor };
  button: { hoverBg: IColor; pressedBg: IColor; loadingBg: IColor };
  icon: { color: IColor; disabled: IColor };
  divider: { w: number; h: number; color: IColor };
  value: { color: IColor; disabled: IColor; weight: number | string; padX: number };
  progress: { thickness: number; track: IColor; range: IColor };
  ring: IRing;
  press: IPress;
  color: IMotion;
  names: { decrement: string; increment: string };
  surface: { default: IColor; floating: IColor };
};
// 누른 버튼의 배율 — 정사각이라 기준 길이는 한 변(max(h, h ÷ 4, 24))
export const qpPressScale = (look: QpLook, h: number) => {
  const basis = Math.max(h, h / look.press.widthDivisor, look.press.minBasis);
  return (basis - look.press.distance) / basis;
};

// 그림 · 플레이그라운드의 값 범위 — 칸 이름 · 설명 · 오류 글은 quantity-picker.md 의 예시 · 글 절 그대로
export type QpPreset = { key: string; label: string; description?: string; min: number; max: number; value: number; unit: string; name?: string; error?: string };
export const QP_PRESETS: Record<string, QpPreset> = {
  approvals: { key: 'approvals', label: '승인 필요 횟수', description: '0 이면 승인 없이 바로 써요.', min: 0, max: 3, value: 1, unit: '회', name: 'approvalCount', error: '승인자는 2명이에요. 횟수를 2회 이하로 줄여주세요.' },
  interval: { key: 'interval', label: '반복 간격', min: 1, max: 100, value: 1, unit: '', name: 'repeatInterval' },
  maxGrant: { key: 'maxGrant', label: '최대 부여 횟수', min: 1, max: 99, value: 11, unit: '회', name: 'maxGrantCount' },
  hours: { key: 'hours', label: '소요시간', min: 0, max: 24, value: 8, unit: 'h', name: 'hours' },
  count: { key: 'count', label: '수량', min: 1, max: 9, value: 1, unit: '개' },
};


// ── Attachment Input ──────────────────────────────────────
export const AT_STATUSES = ['pending', 'uploading', 'success', 'error'] as const;
export type AtStatus = (typeof AT_STATUSES)[number];
export type AtKind = 'image' | 'file';
// 그림의 항목 — 사진은 칠한 그림(PicKind) 번호, 파일은 아이콘 종류
export type AtFileGlyph = 'pdf' | 'sheet' | 'file';
export type AtEntry = {
  id: string;
  name: string;
  size: number;
  kind: AtKind;
  status: AtStatus;
  progress?: number;
  // 사진 — 그림 이름(image-shared 의 PICS) 또는 고른 파일의 미리보기 주소
  pic?: string;
  previewUrl?: string;
  glyph?: AtFileGlyph;
};
export type AtLook = {
  root: { gap: number };
  items: { gap: number; padTop: number; bleed: number; fog: number };
  trigger: { size: number; radius: number; borderW: number; border: IColor; gap: number; hoverBg: IColor; pressedBg: IColor; icon: number; iconColor: IColor };
  count: { text: IType; color: IColor; max: IColor };
  // 막힘 · 다 참 · 끄는 파일 카드의 글 · 아이콘
  disabled: IColor;
  item: { h: number; radius: number; borderW: number; imageW: number; fileW: number; filePadX: number; gap: number; imageStroke: IColor; fileBorder: IColor };
  thumb: { size: number; radius: number; bg: IColor; icon: number; iconColor: IColor };
  meta: { width: number };
  // 이름 — 글자 단위(break-all, 11D) 네 줄
  // maskClear — 첫 줄만 오른쪽을 비우는 폭(× 둘레 구멍이 첫 줄 끝 글자를 파먹지 않게 — 오른쪽 float maskClear × 줄 높이)
  name: { text: IType; color: IColor; maxLines: number; wordBreak: 'break-all' | 'keep-all'; maskClear: number };
  size: { text: IType; color: IColor };
  circle: ProgressCircleLook;
  progress: { size: number; image: 'staticWhite'; file: 'neutral' };
  // 사진 위 덮개 — 올리는 중(라이트 50 · 다크 65) · 실패(두 모드 65 — 고정 값)
  dim: { uploading: IColor; error: string };
  action: { gap: number; icon: number; text: IType; imageColor: IColor; fileColor: IColor; label: string };
  badge: { h: number; padX: number; radius: string; bg: string; text: IType; fg: IColor; label: string };
  remove: { size: number; bg: IColor; borderW: number; border: IColor; offset: number; icon: number; iconColor: IColor; touch: number; extend: number; hoverBg: IColor; pressedBg: IColor };
  mask: { size: number; offset: number };
  dropzone: { h: number; gap: number; padX: number; radius: number; borderW: number; border: IColor; dragBorder: IColor; dragBg: IColor; disabledBorder: IColor; label: IType; labelColor: IColor; text: string };
  pick: { wide: ButtonLook; narrow: ButtonLook; label: string };
  // 사진의 읽기 전용 · 끄는 중 불투명도(13B — SEED 그대로) · 그 전환
  imageFade: { readonly: number; dragging: number; motion: IMotion };
  // 항목 누르기 — 메뉴(14A) · 끌기 문턱 · 키
  itemPress: { mouse: number; touch: number; keys: string };
  menu: { preview: string; open: string; makeCover: string; moveEarlier: string; moveLater: string; remove: string; title: string };
  ring: IRing;
  press: IPress;
  color: IMotion;
  // 드롭존을 그리는 폭(screen wide)
  breakpoint: number;
  fogLook: ScrollFogLook;
  surface: { default: IColor; floating: IColor };
};

// 크기 글 — "9.8MB" · "412KB" · "980B"(MB 는 소수 한 자리, 띄어 쓰지 않는다 — attachment-input.yaml size.format)
export function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(Math.round((bytes / 1024 / 1024) * 10) / 10).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}
// 확장자 — 마지막 점부터(".pdf"). 없으면 빈 글
export function splitExt(name: string) {
  const i = name.lastIndexOf('.');
  return i > 0 && i >= name.length - 6 ? { base: name.slice(0, i), ext: name.slice(i) } : { base: name, ext: '' };
}

// ── Footer ────────────────────────────────────────────────
export type FtLinkSize = 'large' | 'medium';
export type FtLinkLook = { text: IType; color: IColor; hover: IColor; icon: number };
export type FtLook = {
  root: { maxW: number; padY: number; padXWide: number; padXNarrow: number; gap: number };
  topLine: { h: number; color: IColor };
  nav: { gap: number };
  brand: { basis: number; minW: number; gap: number };
  brandName: { text: IType; color: IColor };
  brandIntro: { text: IType; color: IColor; maxW: number };
  sitemap: { gap: number; name: string };
  column: { minW: number; gap: number };
  columnTitle: { text: IType; color: IColor };
  columnLinks: { gap: number };
  divider: { h: number; color: IColor };
  info: { gap: number };
  policy: { colGap: number; rowGap: number };
  infoText: { text: IType; color: IColor; sep: string };
  bottom: { gap: number };
  copyright: { text: IType; color: IColor; format: string };
  social: { gap: number; button: ButtonLook };
  link: { gap: number; large: FtLinkLook; medium: FtLinkLook };
  ring: IRing & { radius: number };
  color: IMotion;
  // 이 폭 미만 narrow(좌우 24 · 소셜은 저작권 아래)
  breakpoint: number;
  surface: IColor;
};
// "© {해} POREST" — 해는 그리는 때의 해
export const copyrightText = (format: string, owner: string, year: number) => format.replace('{해}', String(year)).replace('POREST', owner);

// ── Avatar — 사진 바꾸기 자리 ─────────────────────────────
export type AvEditLook = {
  marginTop: number;
  gap: number;
  change: { look: ButtonLook; label: string };
  remove: { look: ButtonLook; label: string };
  dim: IColor;
  circle: ProgressCircleLook;
  progress: number;
  progressName: string;
};

// ── Footer 의 그림 데이터 ──────────────────────────────────
// porest-home 바닥(7B) — footer.md 코드 절 그대로. 링크 주소는 실제 서비스 주소다(그림 속 링크는 눌러도 떠나지 않는다)
export type FtLinkData = { label: string; href?: string; external?: boolean; key?: string };
export const FT_HOME = {
  brand: { name: 'POREST', description: 'People + Forest. 사람(People)이 모여 숲(Forest)처럼 자라나는 조직 생태계를 설계합니다.' },
  columns: [
    {
      title: '서비스',
      links: [
        { label: 'HR', href: 'https://hr.porest.cloud' },
        { label: 'Desk', href: 'https://desk.porest.cloud' },
        { label: 'Desk 설명서', href: 'https://desk.porest.cloud/guide/' },
      ],
    },
    {
      title: '계정',
      links: [
        { label: '로그인', href: 'https://sso.porest.cloud', key: 'login' },
        { label: '회원가입', href: 'https://sso.porest.cloud', key: 'join' },
      ],
    },
  ],
  policy: [{ label: '개인정보 처리방침', href: 'https://sso.porest.cloud/privacy', external: true }],
  text: ['화면의 숫자와 이름은 소개용 예시입니다. 사진: Unsplash.'],
};
// 값이 없는 블록의 자리표시 — 지어낸 값이 아니라 "무엇이 들어갈 자리" 인지만 쓴다(footer.md "값이 없는 블록은 비워 둔다")
export const FT_PLACEHOLDER = {
  business: [['(상호)', '대표 (이름)', '사업자 등록번호 000-00-00000'], ['(주소)']],
  contact: [['(전화)', '(문의 메일)']],
};
// porest-home 의 색 · 글꼴 — 홈은 porest-design 을 따르지 않는다(홈 CLAUDE.md). 짝: fg-neutral → --ink · fg-neutral-muted → --ink2 ·
// fg-neutral-subtle → --ink3 · stroke-neutral-subtle → --line, 브랜드 글자는 --blue. 값은 porest-home origin/main index.html:10(1f78e02 — #10 에서 브랜드 사이 8 · 사이트맵 링크 올림 --ink3 으로 스펙에 맞췄다) —
// --ink3 은 #8B95A1(흰 바탕 3.04)에서 짙게 고친 값이다(사용자 결정 8A — 4.5 이상)
export const HOME_SKIN = { font: "'Noto Sans KR', -apple-system, 'Apple SD Gothic Neo', sans-serif", ink: '#191F28', ink2: '#4E5968', ink3: '#6B7684', line: '#E5E8EB', brand: '#1B64DA', bg: '#FFFFFF' };
export const HOME_INK3_BEFORE = '#8B95A1';

// ── Attachment Input 의 그림 데이터 ────────────────────────
// 가장 나쁜 두 이름 — 비교 페이지(마무리 11)가 그린 이름과 글자 수 · 글자 꼴이 같은 지어낸 이름(가게 · 앱 이름을 쓰지 않는다).
// 한글 · 숫자 · 밑줄이 같은 자리에 있어 글자 단위 줄바꿈의 결과가 같다
export const AT_PDF = '2026-10-15_카드영수증_숲길커피_리저브_광화문점.pdf';
export const AT_XLSX = '숲길가계부_2025-01-01_2026-10-15_거래내역_전체계좌.xlsx';
const MB = 1024 * 1024;
export const mb = (n: number) => Math.round(n * MB);
// 사진 아홉 — 칠한 그림(image-shared 의 PICS)을 돌려 쓴다
const PHOTO_PICS = ['receipt', 'white', 'dusk', 'meadow', 'sunset', 'sea', 'forest', 'receipt', 'dusk'];
export const photoEntry = (i: number, extra?: Partial<AtEntry>): AtEntry => ({
  id: `p${i}`,
  name: `IMG_20261015_0842${String(10 + i).padStart(2, '0')}.jpg`,
  size: mb([2.4, 1.8, 3.1, 2.2, 4.6, 2.9, 1.6, 3.4, 2.7][i % 9]),
  kind: 'image',
  status: 'success',
  pic: PHOTO_PICS[i % PHOTO_PICS.length],
  ...extra,
});
// 네 줄에 드는 PDF — 첫 줄 비움(maskClear)을 두고도 딱 네 줄(잰 값)
export const AT_PDF_FIT = '2026-10-15_카드영수증_숲길커피_광화문점.pdf';
export const pdfEntry = (extra?: Partial<AtEntry>): AtEntry => ({ id: 'pdf', name: AT_PDF, size: mb(9.8), kind: 'file', glyph: 'pdf', status: 'success', ...extra });
export const xlsxEntry = (extra?: Partial<AtEntry>): AtEntry => ({ id: 'xlsx', name: AT_XLSX, size: mb(4.2), kind: 'file', glyph: 'sheet', status: 'success', ...extra });
// 영수증 10/10 — PDF 하나 + 사진 아홉(여덟째 올리는 중 · 아홉째 실패)
export const AT_WORST: AtEntry[] = [pdfEntry(), ...Array.from({ length: 9 }, (_, i) => photoEntry(i, i === 7 ? { status: 'uploading', progress: 0.62 } : i === 8 ? { status: 'error' } : {}))];
// 거래 상세 머리 — 지어낸 가게 · 카드 별명
export const AT_TX = { merchant: '숲길커피 리저브 광화문점 · 카페', amount: '−12,800원', meta: '2026. 10. 15. 08:42 · 생활비 카드 · 일시불' };
// 거절 글 — attachment-input.md "다시 검사한다" 표 그대로
export const AT_REJECT = {
  FILE_TOO_LARGE: '10MB 넘는 파일은 올릴 수 없어요.',
  INVALID_TYPE: '사진 · PDF 만 올릴 수 있어요.',
  TOO_MANY_FILES: '10개까지 올릴 수 있어요.',
} as const;
export type AtRejectCode = keyof typeof AT_REJECT;

// ── HR 역할 — porest-sql hr/data/4. roles.sql 의 넷(설명 원문 그대로) + 관리자가 더한 넷(그림용 — 비교 페이지 10 이 그린 것) ──
export const HR_ROLES = [
  { code: 'ADMIN', name: '관리자', description: '관리자 권한으로 시스템 운영에 필요한 전체 권한이 부여되어 있습니다.' },
  { code: 'USER', name: '일반 사용자', description: '일반 사용자 권한으로 시스템 관리에 필요한 권한을 제외한 일반적인 읽기, 쓰기 권한이 부여되어 있습니다.' },
  { code: 'APPROVER', name: '승인권자', description: '휴가 신청 항목에 대해 승인/반려를 할 수 있는 권한이 부여되어 있습니다.' },
  { code: 'WORKCODE_M', name: '업무 코드 관리자', description: '업무 이력에 사용되는 코드를 관리하는 권한이 부여되어 있습니다.' },
  { code: 'ATTEND_M', name: '근태 담당자', description: '출퇴근 기록과 근무 시간을 확인하고 바로잡을 수 있는 권한이 부여되어 있습니다.' },
  { code: 'EVAL_M', name: '평가 담당자', description: '평가 일정을 열고 닫으며 평가 결과를 모아 볼 수 있는 권한이 부여되어 있습니다.' },
  { code: 'PAY_VIEW', name: '급여 조회', description: '구성원의 급여 명세를 읽기 전용으로 볼 수 있는 권한이 부여되어 있습니다.' },
  { code: 'EDU_M', name: '교육 관리자', description: '교육 과정을 만들고 수강 현황을 관리하는 권한이 부여되어 있습니다.' },
];
export const HR_ROLES_SAVED = ['USER', 'APPROVER'];
export const HR_USER = { name: '한지우', email: 'jiwoo.han@example.com', dept: '경영지원팀', position: '선임' };
