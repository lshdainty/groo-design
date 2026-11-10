// Tabs 페이지의 화면 예시 값 — 서버 그림(tabs.tsx)과 브라우저 미리보기(tabs-demos · 플레이그라운드)가 함께 쓴다.
// 'use client' 파일에서 값을 내보내면 서버 그림에는 값 대신 참조가 가므로, 값은 여기에 둔다.
import type { TabItem } from './tabs-shared';

export const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');

// ── 화면 예시의 값 ─────────────────────────────────────
export const STATS_TABS: TabItem[] = [
  { value: 'category', label: '카테고리' },
  { value: 'trend', label: '추이' },
  { value: 'compare', label: '비교' },
];
export const CATEGORY_TABS: TabItem[] = [
  { value: 'expense', label: '지출' },
  { value: 'income', label: '수입' },
];
// 설정 > 금액 가리기 — 화면 아홉
export const SCREEN_TABS: TabItem[] = [
  { value: 'all', label: '전체' },
  { value: 'home', label: '홈' },
  { value: 'asset', label: '자산' },
  { value: 'ledger', label: '가계부' },
  { value: 'stats', label: '통계' },
  { value: 'budget', label: '예산' },
  { value: 'stock', label: '증권' },
  { value: 'dutch', label: '더치페이' },
  { value: 'etc', label: '기타' },
];
export const LEAVE_TABS: TabItem[] = [
  { value: 'mine', label: '신청 내역' },
  { value: 'approval', label: '승인 내역', notification: true },
];
export const BROKER_TABS: TabItem[] = [
  { value: 'namu', label: '나무증권' },
  { value: 'toss', label: '토스증권' },
];
export const VIEW_TABS: TabItem[] = [
  { value: 'holding', label: '보유' },
  { value: 'watch', label: '관심' },
  { value: 'discover', label: '발견' },
];

// 통계 10월 — 카테고리별 지출 · 달마다 지출
export type Hue = 'orange' | 'blue' | 'green' | 'violet' | 'brown' | 'red';
export const SPEND: { name: string; amount: number; hue: Hue }[] = [
  { name: '식비', amount: 182400, hue: 'orange' },
  { name: '쇼핑', amount: 89000, hue: 'violet' },
  { name: '카페', amount: 52300, hue: 'brown' },
  { name: '교통', amount: 48600, hue: 'blue' },
  { name: '문화', amount: 25000, hue: 'green' },
  { name: '의료', amount: 15000, hue: 'red' },
];
export const MONTHS: [string, number][] = [
  ['5월', 380200],
  ['6월', 402000],
  ['7월', 455100],
  ['8월', 398700],
  ['9월', 421900],
  ['10월', 412300],
];
export const won = (v: number) => `${v.toLocaleString('ko-KR')}원`;

// 증권 — 증권사 × 보기
type Stock = { name: string; sub: string; amount: string };
export const STOCKS: Record<string, Record<string, Stock[]>> = {
  namu: {
    holding: [
      { name: '가람전자', sub: '10주', amount: '712,000원' },
      { name: '나래반도체', sub: '3주', amount: '621,000원' },
      { name: '다온포털', sub: '2주', amount: '412,000원' },
    ],
    watch: [
      { name: '라온톡', sub: '관심', amount: '52,300원' },
      { name: '마루자동차', sub: '관심', amount: '231,500원' },
      { name: '한빛모터스', sub: '관심', amount: '98,700원' },
    ],
    discover: [
      { name: '소망바이오', sub: '많이 찾는 종목', amount: '182,400원' },
      { name: '아라에너지솔루션', sub: '많이 찾는 종목', amount: '368,000원' },
    ],
  },
  toss: {
    holding: [
      { name: '파인테크', sub: '5주', amount: '1,234,000원' },
      { name: '볼트모터스', sub: '2주', amount: '1,102,000원' },
    ],
    watch: [
      { name: '칩스원', sub: '관심', amount: '268,400원' },
      { name: '소프트웍스', sub: '관심', amount: '712,900원' },
    ],
    discover: [
      { name: '리버마켓', sub: '많이 찾는 종목', amount: '301,200원' },
      { name: '서치랩스', sub: '많이 찾는 종목', amount: '244,600원' },
    ],
  },
};

// 휴가 신청(HR) — 내 신청 · 승인할 신청
export const MINE: [string, string, string, string][] = [
  ['연차', '2026. 10. 12. (월)', '1일', '승인 대기'],
  ['반차(오전)', '2026. 9. 25. (목)', '0.5일', '승인'],
  ['연차', '2026. 9. 8. (월) ~ 9. 9. (화)', '2일', '승인'],
];
export const APPROVAL: [string, string, string, string][] = [
  ['김민지', '연차 · 2026. 10. 14. (수)', '1일', '승인 대기'],
  ['박서준', '반차(오후) · 2026. 10. 16. (금)', '0.5일', '승인 대기'],
];
