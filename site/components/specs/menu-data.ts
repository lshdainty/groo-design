// Menu · Menu Sheet · Help Bubble · Tooltip 페이지의 화면 예시 값 — 서버 그림과 브라우저 미리보기(데모 · 플레이그라운드)가 함께 쓴다.
// 'use client' 파일에서 값을 내보내면 서버 그림에는 값 대신 참조가 가므로, 값은 여기에 둔다.
// 글은 Writing v106 — 메뉴 줄은 동사로 짧게(2 ~ 6자), 설명 · 말풍선은 해요체 문장에 마침표.
import type { MenuGroup, MenuItem } from './menu-shared';

// ── Desk 메모 — 줄 끝 ⋮ ───────────────────────────────────
export type Memo = { title: string; sub: string };
export const MEMOS: Memo[] = [
  { title: '주간 회의 메모', sub: '업무 · 10월 2일' },
  { title: '여행 준비물', sub: '여행 · 9월 28일' },
  { title: '읽을 책', sub: '개인 · 9월 20일' },
];
export const PIN: MenuItem = { value: 'pin', label: '고정', icon: 'pin' };
export const EDIT: MenuItem = { value: 'edit', label: '수정', icon: 'pencil' };
export const DUPLICATE: MenuItem = { value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy' };
export const DELETE: MenuItem = { value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' };
export const MEMO_MENU: MenuGroup[] = [{ items: [PIN, EDIT, DUPLICATE] }, { items: [DELETE] }];
// 아이콘을 뺀 같은 목록
export const plainMenu = (groups: MenuGroup[]): MenuGroup[] => groups.map((g) => ({ ...g, items: g.items.map(({ icon, ...i }) => (void icon, i)) }));

// ── HR 직원 — 데스크톱 표의 ⋮ ──────────────────────────────
export type Person = { name: string; team: string; role: string; joined: string };
export const PEOPLE: Person[] = [
  { name: '김하늘', team: '개발팀', role: '선임', joined: '2023. 3. 2.' },
  { name: '박서준', team: '디자인팀', role: '책임', joined: '2021. 7. 12.' },
  { name: '이도윤', team: '인사팀', role: '사원', joined: '2025. 1. 6.' },
];
export const RESET_PASSWORD: MenuItem = { value: 'reset', label: '비밀번호 초기화', description: '새 비밀번호를 메일로 보내요.' };
export const EXPORT_LEAVE: MenuItem = { value: 'export', label: '휴가 내역 내보내기' };
export const PERSON_MENU = (hasLeave: boolean): MenuGroup[] => [
  { items: [{ value: 'edit', label: '수정' }, RESET_PASSWORD, { ...EXPORT_LEAVE, disabled: !hasLeave }] },
  { items: [{ value: 'delete', label: '삭제', tone: 'critical' }] },
];

// ── Desk 거래 — 묶음 이름 · 설명이 있는 메뉴(Anatomy · 여백) ──────────
export const TX_MENU: MenuGroup[] = [
  { items: [{ value: 'edit', label: '수정', icon: 'pencil' }, { value: 'duplicate', label: '복사해 새로 쓰기', icon: 'copy' }] },
  { label: '정산', items: [{ value: 'refund', label: '환불 기록', description: '돌려받은 돈을 붙여요.', icon: 'undo' }, { value: 'split', label: '나눠 내기', icon: 'users' }] },
  { items: [{ value: 'delete', label: '삭제', icon: 'trash', tone: 'critical' }] },
];
// 뒤 아이콘 — 바깥으로 나가는 줄(아이콘이 없는 메뉴에서)
export const GUIDE_ITEM: MenuItem = { value: 'guide', label: '설명서 보기', suffixIcon: 'external-link' };

// ── Desk 공유 캘린더 — 위험한 동작에 설명 ─────────────────────
export const SHARED_CAL_MENU: MenuGroup[] = [
  { items: [{ value: 'add', label: '일정 추가', icon: 'plus' }, { value: 'members', label: '멤버 보기', icon: 'users' }] },
  { items: [{ value: 'leave', label: '캘린더 나가기', description: '공유받은 일정이 더 보이지 않아요.', icon: 'log-out', tone: 'critical' }] },
];

// ── 테마 — 메뉴가 아니라 설정의 Segmented Control ─────────────
export const THEMES = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
];
export const THEME_MENU: MenuGroup[] = [{ items: [{ value: 'light', label: '라이트', icon: 'sun' }, { value: 'dark', label: '다크', icon: 'moon' }, { value: 'system', label: '시스템', icon: 'monitor' }] }];

// ── Menu Sheet — 메모 화면 머리 더보기 · 사진 ──────────────────
export const HEADER_MENU: MenuGroup[] = [
  {
    items: [
      { value: 'import', label: '가져오기', icon: 'folder-input' },
      { value: 'export', label: '내보내기', icon: 'folder-output' },
      { value: 'sort', label: '정렬 바꾸기', icon: 'arrow-down-up' },
    ],
  },
];
export const PHOTO_MENU: MenuGroup[] = [
  { items: [{ value: 'album', label: '앨범에서 고르기' }, { value: 'camera', label: '사진 찍기' }] },
  { items: [{ value: 'remove', label: '사진 지우기', tone: 'critical' }] },
];
// 스와이프 트레이 — 의미 순서(그리는 쪽이 뒤집는다: 위험한 것이 가장 안쪽)
export const SWIPE_ACTIONS: { value: string; label: string; icon: 'pin' | 'pencil' | 'trash'; kind: 'neutral' | 'primary' | 'destructive' }[] = [
  { value: 'pin', label: '고정', icon: 'pin', kind: 'neutral' },
  { value: 'edit', label: '수정', icon: 'pencil', kind: 'primary' },
  { value: 'delete', label: '삭제', icon: 'trash', kind: 'destructive' },
];
// 스와이프와 같은 동작의 시트(트레이와 같은 이름)
export const SWIPE_SHEET: MenuGroup[] = [{ items: [PIN, EDIT] }, { items: [DELETE] }];

// ── Help Bubble · Tooltip ─────────────────────────────────
export const LEAVE_RULE = { title: '연차 사용 규정', description: '입사 1년 미만은 한 달에 1일씩 생기고, 1년이 지나면 15일이 생겨요.' };
// 처음부터 열어 두는 안내(help-bubble.md 코드) — 홈 상단 바의 검색(2026-10-16 Q-017-2a A 로 더해진 자리). 예전 예시(상단 바의 금액 가리기)는 걷었다
export const SEARCH_TIP = { title: '거래를 찾아보세요', description: '가맹점 이름 · 메모 · 금액으로 찾을 수 있어요.' };
export const COPY_REASON = '복사할 지난달 예산이 없어요.';
// 툴팁 — 아이콘 버튼의 이름은 Desk 웹 데스크톱 머리(알림 · 설정 — 2026-10-16 눈은 뺐다)의 것을 쓴다(bubble-screens · bubble-demos). 본문 툴바는 제품에 없다
